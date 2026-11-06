"""Volatility cho mọi biến có đủ dữ liệu; biến chưa đủ thì bỏ qua và ghi rõ trạng thái.

Phương pháp
  - Giá, tỷ giá, open interest: độ lệch chuẩn log return, quy năm (365 cho crypto, 252 cho còn lại), đơn vị %/năm.
  - Lãi suất, funding, chỉ số tâm lý: độ lệch chuẩn thay đổi tuyệt đối theo kỳ (bp với lãi suất, điểm với chỉ số).
  - Cửa sổ 7/30/90 ngày lịch; cần tối thiểu số quan sát theo settings.volatility.min_returns.
  - Chuỗi tích luỹ từ snapshot hằng ngày (tỷ giá trong nước, lãi suất nhập tay…) sẽ tự đủ dữ liệu sau vài tuần.
"""
from __future__ import annotations

import datetime as dt
import math

from ..common import VN_TZ

WINDOWS = (7, 30, 90)
DEFAULT_MIN = {7: 4, 30: 12, 90: 35}
MAX_STALE_DAYS = 10

# key: (nhãn, nhóm, chế độ, hệ số bp/điểm, số kỳ/năm). Nguồn dữ liệu: chuỗi trong snapshot, nến, hoặc lịch sử chỉ số.
SPECS: dict[str, tuple[str, str, str, float, int]] = {
    "usdvnd_market": ("USD/VND thị trường quốc tế", "Tỷ giá", "log", 1, 252),
    "usdvnd_vcb_mid": ("USD/VND Vietcombank (giữa)", "Tỷ giá", "log", 1, 252),
    "usdvnd_free_sell": ("USD chợ đen (bán ra)", "Tỷ giá", "log", 1, 252),
    "usdvnd_interbank": ("USD/VND liên ngân hàng", "Tỷ giá", "log", 1, 252),
    "sbv_central_rate": ("Tỷ giá trung tâm NHNN", "Tỷ giá", "log", 1, 252),
    "usdtvnd_p2p_mid": ("USDT/VND P2P (giữa)", "Tỷ giá", "log", 1, 252),
    "usdvnd_fwd_1m_quote": ("USD/VND kỳ hạn 1 tháng (giá yết)", "Tỷ giá", "log", 1, 252),
    "usdvnd_fwd_1m_implied": ("USD/VND kỳ hạn 1 tháng (CIP)", "Tỷ giá", "log", 1, 252),
    "interbank_overnight_rate": ("Lãi suất LNH qua đêm VND", "Lãi suất", "abs", 100, 252),
    "interbank_usd_overnight_rate": ("Lãi suất LNH qua đêm USD", "Lãi suất", "abs", 100, 252),
    "sofr": ("SOFR (USD qua đêm)", "Lãi suất", "abs", 100, 252),
    "dtb4wk": ("Tín phiếu Mỹ 4 tuần", "Lãi suất", "abs", 100, 252),
    "dgs2": ("Lợi suất Mỹ 2 năm", "Lãi suất", "abs", 100, 252),
    "dgs10": ("Lợi suất Mỹ 10 năm", "Lãi suất", "abs", 100, 252),
    "dtwexbgs": ("Chỉ số USD rộng", "Tỷ giá", "log", 1, 252),
    "fear_greed": ("Fear & Greed", "Tâm lý", "abs", 1, 365),
}
for _s in ("btc", "eth", "sol", "xrp", "bnb"):
    SPECS[f"{_s}_oi"] = (f"{_s.upper()} open interest", "Phái sinh", "log", 1, 365)
    SPECS[f"{_s}_funding"] = (f"{_s.upper()} funding", "Phái sinh", "abs", 100, 365)
CANDLES = {"BTC": "Bitcoin", "ETH": "Ethereum", "SOL": "Solana", "XRP": "XRP", "BNB": "BNB"}


def _day(ts: float) -> str:
    return dt.datetime.fromtimestamp(ts, VN_TZ).date().isoformat()


def _collect_levels(snap: dict, hist: dict[int, dict]) -> dict[str, dict[str, float]]:
    """key -> {ngày: giá trị}. Ưu tiên chuỗi dài trong snapshot, bổ sung từ lịch sử đã lưu."""
    out: dict[str, dict[str, float]] = {}
    for key in SPECS:
        lv: dict[str, float] = {}
        s = (snap.get("series") or {}).get(key)
        if s:
            for t, v in s.get("points", []):
                if v is not None:
                    lv[_day(t)] = float(v)
        for h in hist.values():
            m = (h.get("metrics") or {}).get(key) or {}
            if m.get("value") is not None and h.get("date") and h["date"] not in lv:
                lv[h["date"]] = float(m["value"])
        m = snap["metrics"].get(key) or {}
        if m.get("value") is not None and key not in (snap.get("series") or {}):
            lv[snap["date"]] = float(m["value"])
        if lv:
            out[key] = lv
    for sym in CANDLES:
        cl = {_day(c["time"]): c["close"] for c in (snap.get("candles") or {}).get(sym, {}).get("1d", [])}
        if cl:
            out[f"candle:{sym}"] = cl
    return out


def _std(xs: list[float]) -> float | None:
    if len(xs) < 2:
        return None
    m = sum(xs) / len(xs)
    return math.sqrt(sum((x - m) ** 2 for x in xs) / (len(xs) - 1))


def compute(levels: dict[str, float], mode: str, scale: float, ann: int, end: dt.date,
            mins: dict[int, int]) -> dict:
    days = sorted(levels)
    res: dict = {"obs": len(days), "first_date": days[0], "last_date": days[-1]}
    for w in WINDOWS:
        lo = (end - dt.timedelta(days=w)).isoformat()
        pts = [(d, levels[d]) for d in days if d >= lo]
        if mode == "log":
            rets = [math.log(b / a) for (_, a), (_, b) in zip(pts, pts[1:]) if a > 0 and b > 0]
        else:
            rets = [(b - a) * scale for (_, a), (_, b) in zip(pts, pts[1:])]
        sd = _std(rets) if len(rets) >= mins[w] else None
        if sd is not None and mode == "log":
            sd = sd * math.sqrt(ann) * 100
        res[f"vol_{w}d"] = None if sd is None else round(sd, 3)
        res[f"n_{w}d"] = len(rets)
    return res


def build(snap: dict, hist: dict[int, dict], settings: dict, today: dt.date) -> list[dict]:
    cfg = settings.get("volatility", {})
    mins = {int(k): v for k, v in (cfg.get("min_returns") or {}).items()} or DEFAULT_MIN
    levels = _collect_levels(snap, hist)
    rows = []
    items = [(k, *SPECS[k]) for k in SPECS] + \
            [(f"candle:{s}", f"{n} (giá đóng cửa)", "Crypto", "log", 1, 365) for s, n in CANDLES.items()]
    for key, label, group, mode, scale, ann in items:
        row = {"key": key, "label": label, "group": group, "method": mode,
               "unit": "%/năm" if mode == "log" else ("bp" if scale == 100 else "điểm"),
               "vol_7d": None, "vol_30d": None, "vol_90d": None}
        lv = levels.get(key)
        if not lv:
            row.update(status="no_data", note="Chưa có dữ liệu cho biến này, sẽ tự tính khi có số liệu.")
            rows.append(row)
            continue
        row.update(compute(lv, mode, scale, ann, today, mins))
        age = (today - dt.date.fromisoformat(row["last_date"])).days
        have = [row[f"vol_{w}d"] for w in WINDOWS if row[f"vol_{w}d"] is not None]
        if age > MAX_STALE_DAYS:
            row.update(status="stale", note=f"Số liệu cuối cùng cách đây {age} ngày, không tính volatility.",
                       vol_7d=None, vol_30d=None, vol_90d=None)
        elif not have:
            row.update(status="accumulating",
                       note=f"Mới có {row['obs']} quan sát, cần thêm để tính (7 ngày cần {mins[7]} kỳ thay đổi).")
        else:
            row["status"] = "ok"
        rows.append(row)
    return rows
