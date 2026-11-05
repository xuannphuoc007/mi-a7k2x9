"""Tính toán định lượng: biến động, tương quan, regime, bảng rủi ro market making,
tín hiệu theo quy tắc. Không dùng AI — mọi kết luận đều truy ngược được về số liệu và ngưỡng.
"""
from __future__ import annotations

import datetime as dt
import math
from typing import Iterable

# ---------------------------------------------------------------- thống kê cơ bản

def log_returns(closes: list[float]) -> list[float]:
    return [math.log(b / a) for a, b in zip(closes, closes[1:]) if a and b and a > 0 and b > 0]


def realized_vol_ann(closes: list[float], window: int, periods_per_year: int = 365) -> float | None:
    """Độ biến động thực tế (annualized, %) từ log return của `window` kỳ gần nhất."""
    r = log_returns(closes[-(window + 1):])
    if len(r) < max(3, window // 2):
        return None
    m = sum(r) / len(r)
    var = sum((x - m) ** 2 for x in r) / (len(r) - 1)
    return math.sqrt(var) * math.sqrt(periods_per_year) * 100


def pearson(xs: list[float], ys: list[float]) -> float | None:
    n = len(xs)
    if n < 5 or n != len(ys):
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    sxx = sum((x - mx) ** 2 for x in xs)
    syy = sum((y - my) ** 2 for y in ys)
    if sxx == 0 or syy == 0:
        return None
    return sxy / math.sqrt(sxx * syy)


def day_key(ts: int) -> str:
    return dt.datetime.fromtimestamp(ts, dt.timezone.utc).date().isoformat()


def daily_last(points: Iterable[list]) -> dict[str, float]:
    """Gom chuỗi về 1 giá trị/ngày (giá trị cuối ngày UTC), loại trùng lặp."""
    out: dict[str, float] = {}
    for t, v in sorted(points, key=lambda p: p[0]):
        if v is not None:
            out[day_key(int(t))] = float(v)
    return out


def daily_mean(points: Iterable[list]) -> dict[str, float]:
    acc: dict[str, list[float]] = {}
    for t, v in points:
        if v is not None:
            acc.setdefault(day_key(int(t)), []).append(float(v))
    return {k: sum(v) / len(v) for k, v in acc.items()}


def to_changes(levels: dict[str, float], mode: str) -> dict[str, float]:
    """mode: 'log' (lợi suất log) | 'diff' (chênh lệch tuyệt đối). Chỉ tính giữa 2 quan sát liền kề."""
    keys = sorted(levels)
    out = {}
    for a, b in zip(keys, keys[1:]):
        va, vb = levels[a], levels[b]
        if mode == "log":
            if va > 0 and vb > 0:
                out[b] = math.log(vb / va)
        else:
            out[b] = vb - va
    return out

# ---------------------------------------------------------------- tương quan

CORR_ASSETS = [
    ("BTC", "BTC", "log"), ("ETH", "ETH", "log"), ("SOL", "SOL", "log"),
    ("USD_BROAD", "USD Broad Index", "log"), ("US10Y", "US 10Y (Δ)", "diff"),
    ("STABLE", "Stablecoin supply", "log"), ("BTC_OI", "BTC OI (OKX)", "log"),
    ("BTC_FUNDING", "BTC Funding (Δ)", "diff"), ("USDVND", "USD/VND VCB", "log"),
    ("USDTVND", "USDT/VND P2P", "log"),
]


def build_level_series(snap: dict, history_levels: dict[str, dict[str, float]]) -> dict[str, dict[str, float]]:
    s = snap.get("series", {})
    c = snap.get("candles", {})
    lv: dict[str, dict[str, float]] = {}
    for sym in ("BTC", "ETH", "SOL"):
        d = c.get(sym, {}).get("1d") or []
        if d:
            lv[sym] = {day_key(k["time"]): k["close"] for k in d}
    if "dtwexbgs" in s:
        lv["USD_BROAD"] = daily_last(s["dtwexbgs"]["points"])
    if "dgs10" in s:
        lv["US10Y"] = {k: v * 100 for k, v in daily_last(s["dgs10"]["points"]).items()}  # bp
    if "stablecoin_supply" in s:
        lv["STABLE"] = daily_last(s["stablecoin_supply"]["points"])
    if "btc_oi" in s:
        lv["BTC_OI"] = daily_last(s["btc_oi"]["points"])
    if "btc_funding" in s:
        lv["BTC_FUNDING"] = daily_mean(s["btc_funding"]["points"])
    for k in ("USDVND", "USDTVND"):
        if history_levels.get(k):
            lv[k] = history_levels[k]
    return lv


def correlation_matrix(levels: dict[str, dict[str, float]], end_day: str,
                       windows=(7, 30, 90)) -> dict:
    changes = {}
    for key, _label, mode in CORR_ASSETS:
        if key in levels and len(levels[key]) >= 3:
            changes[key] = to_changes(levels[key], mode)
    keys = [k for k, _, _ in CORR_ASSETS if k in changes]
    labels = {k: lab for k, lab, _ in CORR_ASSETS}
    end = dt.date.fromisoformat(end_day)
    out = {}
    for w in windows:
        start = (end - dt.timedelta(days=w)).isoformat()
        mat, nmat = [], []
        for a in keys:
            row, nrow = [], []
            for b in keys:
                common = sorted(d for d in changes[a] if d in changes[b] and start < d <= end_day)
                xs = [changes[a][d] for d in common]
                ys = [changes[b][d] for d in common]
                r = 1.0 if a == b and len(common) >= 5 else pearson(xs, ys)
                row.append(None if r is None else round(r, 3))
                nrow.append(len(common))
            mat.append(row)
            nmat.append(nrow)
        out[str(w)] = {"matrix": mat, "n": nmat}
    return {"assets": keys, "labels": {k: labels[k] for k in keys}, "end_day": end_day,
            "windows": out, "method": (
                "Pearson trên chuỗi thay đổi theo ngày (log return; riêng US10Y và Funding dùng chênh lệch tuyệt đối), "
                "chỉ dùng các ngày cả hai chuỗi đều có dữ liệu (pairwise-complete). Ô có < 5 quan sát để trống. "
                "Tương quan không hàm ý quan hệ nhân quả."),
            "notes": ("Chuỗi FRED chỉ có ngày làm việc của Mỹ nên số quan sát thấp hơn crypto. "
                      "USD/VND và USDT/VND dùng lịch sử do hệ thống tự lưu, cần tích luỹ đủ ngày.")}

# ---------------------------------------------------------------- risk level

def level(value: float | None, thresholds: list[float], absolute: bool = True) -> str:
    if value is None:
        return "na"
    v = abs(value) if absolute else value
    if v >= thresholds[1]:
        return "high"
    if v >= thresholds[0]:
        return "medium"
    return "low"


def _mv(snap: dict, key: str) -> float | None:
    m = snap.get("metrics", {}).get(key)
    return m.get("value") if m else None


def premium_base(snap: dict, settings: dict) -> tuple[float | None, str]:
    base = settings.get("reference_fx", {}).get("premium_base", "vcb_sell")
    key = {"vcb_sell": "usdvnd_vcb_sell", "vcb_mid": "usdvnd_vcb_mid",
           "sbv_central": "sbv_central_rate"}.get(base, "usdvnd_vcb_sell")
    return _mv(snap, key), key


def fx_derived(snap: dict, settings: dict) -> dict:
    """Các chỉ số chênh lệch USDT/VND vs USD/VND và peg."""
    from ..common import metric, missing  # noqa: PLC0415
    out = {}
    base, base_key = premium_base(snap, settings)
    mid = _mv(snap, "usdtvnd_p2p_mid")
    base_label = snap.get("metrics", {}).get(base_key, {}).get("label", base_key)
    if mid and base:
        out["p2p_premium"] = metric("P2P Premium (USDT/VND mid vs USD/VND)", (mid / base - 1) * 100, "%",
                                    f"Tính từ USDT/VND P2P mid và {base_label}",
                                    snap["metrics"]["usdtvnd_p2p_mid"]["timestamp"],
                                    note=f"Tham chiếu: {base_label}. Hai loại giá khác bản chất: P2P là giá thực thi, ngân hàng là giá niêm yết.")
    else:
        out["p2p_premium"] = missing("P2P Premium (USDT/VND vs USD/VND)", "%", "Tính toán",
                                     "Chưa có dữ liệu: thiếu USDT/VND P2P hoặc USD/VND tham chiếu")
    sbv = _mv(snap, "sbv_central_rate")
    vcb = _mv(snap, "usdvnd_vcb_sell")
    if sbv and vcb:
        out["vcb_vs_sbv"] = metric("VCB bán so với tỷ giá trung tâm", (vcb / sbv - 1) * 100, "%",
                                   "Tính từ Vietcombank và NHNN (nhập tay)",
                                   snap["metrics"]["usdvnd_vcb_sell"]["timestamp"])
    p = _mv(snap, "usdt_price")
    if p:
        out["usdt_peg_dev"] = metric("USDT/USD Peg Deviation", (p - 1) * 100, "%", "CoinGecko (tính)",
                                     snap["metrics"]["usdt_price"]["timestamp"],
                                     note="(Giá USDT/USD − 1) × 100")
    return out


def risk_table(snap: dict, settings: dict, hist: dict[int, dict]) -> list[dict]:
    """hist: {số ngày trước: snapshot của ngày đó}."""
    th = settings["risk_thresholds"]
    p2p = snap.get("tables", {}).get("p2p", {})
    plats = {k: v for k, v in (p2p.get("platforms") or {}).items() if "by_size" in v}
    bid, ask, mid = (_mv(snap, "usdtvnd_p2p_bid"), _mv(snap, "usdtvnd_p2p_ask"), _mv(snap, "usdtvnd_p2p_mid"))
    rows = []

    def add(key, label, value, unit, thr, note, absolute=True):
        rows.append({"key": key, "label": label, "value": value, "unit": unit,
                     "risk": level(value, th[thr], absolute) if thr else "na",
                     "thresholds": th.get(thr) if thr else None, "note": note})

    add("usdt_vnd_spread", "USDT/VND Spread", (ask - bid) / mid * 100 if mid else None, "%",
        "usdt_vnd_spread_pct", "(best executable ask − bid) / mid, quy mô nhỏ nhất")
    prem = snap.get("metrics", {}).get("p2p_premium", {}).get("value")
    add("p2p_premium", "P2P Premium", prem, "%", "p2p_premium_abs_pct", "USDT/VND mid so với USD/VND tham chiếu")
    mids = [p["by_size"][0]["mid"] for p in plats.values() if p["by_size"][0].get("mid")]
    xspread = (max(mids) - min(mids)) / (sum(mids) / len(mids)) * 100 if len(mids) >= 2 else None
    add("cross_exchange_spread", "Cross-Exchange Spread", xspread, "%", "cross_exchange_spread_pct",
        "Chênh lệch mid giữa các nền tảng P2P (cần ≥ 2 nền tảng)")
    inv = _mv(snap, "internal_usdt_inventory")
    target = snap.get("tables", {}).get("inventory_target")
    dev = (inv / target - 1) * 100 if inv is not None and target else None
    add("usdt_inventory_risk", "USDT Inventory Risk", dev, "% lệch mục tiêu", "inventory_deviation_abs_pct",
        "Độ lệch tồn kho so với mục tiêu (nhập tay). Chưa có nếu chưa nhập tồn kho và mục tiêu")
    peg = snap.get("metrics", {}).get("usdt_peg_dev", {}).get("value")
    add("usdt_peg", "USDT Peg Deviation", peg, "%", "usdt_peg_deviation_abs_pct", "Giá USDT/USD lệch khỏi 1")

    # thay đổi 24h / 7D từ lịch sử đã lưu
    for r in rows:
        r["change_24h"] = _hist_change(r, hist, 1)
        r["change_7d"] = _hist_change(r, hist, 7)
    return rows


def _hist_change(row: dict, hist: dict[int, dict], days: int) -> float | None:
    old = hist.get(days)
    if row["value"] is None or not old:
        return None
    for r in old.get("tables", {}).get("risk", []):
        if r["key"] == row["key"] and r.get("value") is not None:
            return row["value"] - r["value"]
    return None

# ---------------------------------------------------------------- regime

def regime(snap: dict, settings: dict) -> dict:
    cfg = settings["regime"]
    m = snap.get("metrics", {})
    v = lambda k: (m.get(k) or {}).get("value")  # noqa: E731
    btc_closes = [k["close"] for k in (snap.get("candles", {}).get("BTC", {}).get("1d") or [])]
    vol7 = realized_vol_ann(btc_closes, 7)
    sma20 = sum(btc_closes[-20:]) / 20 if len(btc_closes) >= 20 else None
    btc = btc_closes[-1] if btc_closes else v("btc_price")
    us10y_7d = (m.get("dgs10") or {}).get("change_7d")
    rules = []

    def rule(group, name, value, cond, threshold_text, effect=0, available=True):
        rules.append({"group": group, "name": name, "value": value, "threshold": threshold_text,
                      "triggered": bool(cond) if available and value is not None else None,
                      "effect": effect if available and value is not None and cond else 0})

    ls = cfg["liquidity_stress"]
    peg = v("usdt_peg_dev")
    prem = v("p2p_premium")
    sup7 = (m.get("stablecoin_supply_total") or {}).get("change_7d")
    rule("Liquidity Stress", "|USDT peg deviation| (%)", peg, peg is not None and abs(peg) >= ls["usdt_peg_deviation_abs_pct"], f"≥ {ls['usdt_peg_deviation_abs_pct']}")
    rule("Liquidity Stress", "|P2P premium| (%)", prem, prem is not None and abs(prem) >= ls["p2p_premium_abs_pct"], f"≥ {ls['p2p_premium_abs_pct']}")
    rule("Liquidity Stress", "Stablecoin supply 7D (%)", sup7, sup7 is not None and sup7 <= ls["stablecoin_supply_7d_pct"], f"≤ {ls['stablecoin_supply_7d_pct']}")

    hv = cfg["high_volatility"]
    ch24 = (m.get("btc_price") or {}).get("change_24h")
    rule("High Volatility", "BTC realized vol 7D annualized (%)", vol7, vol7 is not None and vol7 >= hv["btc_realized_vol_7d_ann_pct"], f"≥ {hv['btc_realized_vol_7d_ann_pct']}")
    rule("High Volatility", "|BTC 24h| (%)", ch24, ch24 is not None and abs(ch24) >= hv["btc_abs_change_24h_pct"], f"≥ {hv['btc_abs_change_24h_pct']}")

    sc = cfg["score"]
    ch7 = (m.get("btc_price") or {}).get("change_7d")
    fg = v("fear_greed")
    fund = v("btc_funding")
    trend = (btc / sma20 - 1) * 100 if btc and sma20 else None
    rule("Score", "BTC so với SMA20 (%)", trend, trend is not None and trend > 0, "> 0 → +1 ; < 0 → −1",
         effect=1 if (trend or 0) > 0 else -1)
    if trend is not None and trend < 0:
        rules[-1].update(triggered=True, effect=-1)
    rule("Score", "BTC 7D (%)", ch7, ch7 is not None and abs(ch7) >= sc["btc_7d_return_pct"],
         f"≥ +{sc['btc_7d_return_pct']} → +1 ; ≤ −{sc['btc_7d_return_pct']} → −1",
         effect=1 if (ch7 or 0) > 0 else -1)
    rule("Score", "Fear & Greed", fg, fg is not None and (fg >= sc["fear_greed_risk_on"] or fg <= sc["fear_greed_risk_off"]),
         f"≥ {sc['fear_greed_risk_on']} → +1 ; ≤ {sc['fear_greed_risk_off']} → −1",
         effect=1 if (fg or 0) >= sc["fear_greed_risk_on"] else -1)
    rule("Score", "Stablecoin supply 7D (%)", sup7, sup7 is not None and sup7 != 0, "> 0 → +1 ; < 0 → −1",
         effect=1 if (sup7 or 0) > 0 else -1)
    rule("Score", "US10Y 7D (bp)", us10y_7d, us10y_7d is not None and abs(us10y_7d) >= sc["us10y_7d_change_bp"],
         f"≤ −{sc['us10y_7d_change_bp']} → +1 ; ≥ +{sc['us10y_7d_change_bp']} → −1",
         effect=1 if (us10y_7d or 0) < 0 else -1)
    rule("Score", "BTC funding (%/8h)", fund, fund is not None and fund >= sc["funding_hot_pct"],
         f"≥ {sc['funding_hot_pct']} → −1 (đòn bẩy quá nóng)", effect=-1)

    score = sum(r["effect"] for r in rules if r["group"] == "Score")
    available = sum(1 for r in rules if r["group"] == "Score" and r["value"] is not None)
    if any(r["triggered"] for r in rules if r["group"] == "Liquidity Stress"):
        label = "Liquidity Stress"
    elif any(r["triggered"] for r in rules if r["group"] == "High Volatility"):
        label = "High Volatility"
    elif available < 3:
        label = "Không đủ dữ liệu"
    elif score >= sc["risk_on_min_score"]:
        label = "Risk-on"
    elif score <= sc["risk_off_max_score"]:
        label = "Risk-off"
    else:
        label = "Neutral"
    return {"label": label, "score": score, "score_inputs": available, "rules": rules,
            "btc_realized_vol_7d": vol7,
            "btc_realized_vol_30d": realized_vol_ann(btc_closes, 30),
            "method": ("Ưu tiên: Liquidity Stress > High Volatility > điểm tổng. "
                       f"Risk-on khi điểm ≥ {sc['risk_on_min_score']}, Risk-off khi ≤ {sc['risk_off_max_score']}, "
                       "cần ≥ 3 chỉ báo có dữ liệu. Ngưỡng nằm trong config/settings.json.")}

# ---------------------------------------------------------------- tín hiệu theo quy tắc

def _vn(v: float, sign: bool = False) -> str:
    return (f"{v:+.2f}" if sign else f"{v:.2f}").replace(".", ",")


def macro_signals(snap: dict) -> list[dict]:
    s, m = snap.get("series", {}), snap.get("metrics", {})
    out = []

    def val_days_ago(key, days):
        pts = (s.get(key) or {}).get("points") or []
        if not pts:
            return None, None
        last_t = pts[-1][0]
        older = [p for p in pts if p[0] <= last_t - days * 86400]
        return pts[-1][1], (older[-1][1] if older else None)

    cur, old = val_days_ago("dfedtaru", 180)
    if cur is not None and old is not None:
        d = (cur - old) * 100
        stance = "nới lỏng" if d < 0 else "thắt chặt" if d > 0 else "giữ nguyên"
        out.append({"topic": "Fed", "type": "Fact",
                    "text": f"Cận trên lãi suất mục tiêu {_vn(cur)}%, thay đổi {d:+.0f} bp trong 6 tháng: chu kỳ {stance}."})
    sp = (m.get("t10y2y") or {}).get("value")
    if sp is not None:
        out.append({"topic": "Lợi suất", "type": "Fact",
                    "text": f"Lợi suất 10 năm cao hơn 2 năm {_vn(sp)} điểm % ({'đường cong dương' if sp > 0 else 'đường cong đảo ngược'})."})
    cur, old = val_days_ago("dtwexbgs", 30)
    if cur and old:
        out.append({"topic": "USD", "type": "Fact",
                    "text": f"Chỉ số USD rộng thay đổi {_vn((cur / old - 1) * 100, True)}% trong 30 ngày."})
    cur, old = val_days_ago("dgs10", 30)
    if cur is not None and old is not None:
        out.append({"topic": "Lợi suất", "type": "Fact",
                    "text": f"Lợi suất Mỹ 10 năm {_vn(cur)}%, thay đổi {(cur - old) * 100:+.0f} bp trong 30 ngày."})
    cpi = (m.get("cpilfesl") or {}).get("value")
    if cpi is not None:
        out.append({"topic": "Lạm phát", "type": "Fact",
                    "text": f"CPI lõi {_vn(cpi)}% so với cùng kỳ (kỳ {(m['cpilfesl'].get('period') or '')})."})
    return out


def mm_signals(snap: dict, settings: dict) -> list[dict]:
    out = []
    risk = snap.get("tables", {}).get("risk", [])
    names = {"high": "CAO", "medium": "TRUNG BÌNH"}
    for r in risk:
        if r["risk"] in names:
            out.append({"topic": r["label"], "type": "Fact", "level": r["risk"],
                        "text": f"{r['label']} = {r['value']:.3f} {r['unit']} — mức rủi ro {names[r['risk']]} "
                                f"(ngưỡng {r['thresholds']})."})
    prem = (snap.get("metrics", {}).get("p2p_premium") or {}).get("value")
    if prem is not None:
        direction = ("USDT/VND cao hơn USD/VND tham chiếu: nhu cầu mua USDT bằng VND lớn hơn nguồn cung"
                     if prem > 0 else "USDT/VND thấp hơn USD/VND tham chiếu: áp lực bán USDT lấy VND")
        out.append({"topic": "P2P Premium", "type": "Analysis", "level": "info",
                    "text": f"Premium {prem:+.2f}%. {direction} (diễn giải theo quy tắc, cần đối chiếu dữ liệu nội bộ)."})
    if not (snap.get("tables", {}).get("p2p") or {}).get("enabled"):
        out.append({"topic": "Dữ liệu", "type": "Fact", "level": "info",
                    "text": "Chưa có giá P2P/OTC: các chỉ báo spread, premium, áp lực thanh khoản chưa tính được."})
    return out


# ---------------------------------------------------------------- bảng giá đô
BANKS = (("vcb", "Vietcombank"), ("bidv", "BIDV"), ("tcb", "Techcombank"))
PLATFORM_NAMES = {"binance": "Binance", "okx": "OKX", "bybit": "Bybit", "bitget": "Bitget"}


def fx_day_change(snap: dict, hist: dict[int, dict]) -> None:
    """Thêm thay đổi so với hôm trước (đồng) cho các giá đô và USDT/VND, dựa trên bản đã lưu."""
    old = (hist.get(1) or {}).get("metrics", {})
    for k, m in snap.get("metrics", {}).items():
        if not k.startswith(("usdvnd_", "usdtvnd_")) or m.get("value") is None:
            continue
        prev = (old.get(k) or {}).get("value")
        if prev is not None:
            m["change_24h"] = m["value"] - prev
            m["change_unit"] = "đ"


def fx_board(snap: dict) -> dict:
    """Gom giá ngân hàng, chợ đen và USDT/VND về một bảng để giao diện so sánh."""
    tables = snap.get("tables", {})
    banks = []
    for key, name in BANKS:
        cash, transfer, sell = (_mv(snap, f"usdvnd_{key}_{f}") for f in ("buy_cash", "buy_transfer", "sell"))
        if sell is None and transfer is None:
            continue
        banks.append({"id": key, "name": name, "buy_cash": cash, "buy_transfer": transfer, "sell": sell,
                      "timestamp": snap["metrics"][f"usdvnd_{key}_sell"].get("timestamp")})

    platforms = []
    for pid, p in ((tables.get("p2p") or {}).get("platforms") or {}).items():
        if "by_size" in p:
            platforms.append({"id": pid, "name": PLATFORM_NAMES.get(pid, pid), "by_size": p["by_size"],
                              "depth_ask_usdt": p.get("depth_ask_usdt"), "depth_bid_usdt": p.get("depth_bid_usdt"),
                              "ads_ask": p.get("ads_ask"), "ads_bid": p.get("ads_bid"), "timestamp": p.get("timestamp")})

    bank_sell = _mv(snap, "usdvnd_vcb_sell")
    free_sell, usdt_mid = _mv(snap, "usdvnd_free_sell"), _mv(snap, "usdtvnd_p2p_mid")

    def gap(a, b):
        return {"vnd": a - b, "pct": (a / b - 1) * 100} if a and b else None

    return {"banks": banks, "free": tables.get("free_market") or [], "platforms": platforms,
            "trade_sizes_vnd": ((tables.get("p2p") or {}).get("config") or {}).get("trade_sizes_vnd") or [],
            "reference_size_vnd": ((tables.get("p2p") or {}).get("config") or {}).get("reference_size_vnd"),
            "gaps": {"free_vs_bank": gap(free_sell, bank_sell), "usdt_vs_bank": gap(usdt_mid, bank_sell),
                     "usdt_vs_free": gap(usdt_mid, free_sell)}}
