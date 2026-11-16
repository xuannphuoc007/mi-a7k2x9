"""USD/VND trong ngày: điểm giá từng ngày, kiểm toán dữ liệu gốc, độ phủ và trạng thái cập nhật.

Điểm giá gom từ: (1) nến 1 phút của Yahoo (7 ngày gần nhất), (2) nến 5 phút của Yahoo (khoảng 1 tháng),
(3) mẫu giá hiện tại từ TradingView (hoặc Yahoo nếu TradingView lỗi), (4) các điểm đã lưu từ lần chạy trước.
Cùng một thời điểm thì ưu tiên 1 phút, rồi 5 phút. Mỗi điểm lưu dạng [giây, giá, nhãn nguồn]:
y1 = Yahoo 1 phút, y5 = Yahoo 5 phút, tv = mẫu TradingView, old = điểm lưu từ phiên bản cũ (không rõ nguồn).

Về dữ liệu gốc: Yahoo trả đủ lưới thời gian (1 phút hoặc 5 phút trong giờ giao dịch) nhưng phần lớn nến có
close = null, nghĩa là nguồn không ghi nhận giá nào. Hệ thống chỉ bỏ các nến null đó. Nến có giá bằng giá trước
đó vẫn được giữ nguyên, không có bước lọc nến "không đổi" nào. Mẫu TradingView là một lần đọc giá hiện tại, không
phải thay đổi giá của thị trường, nên không tính vào độ phủ và số bản ghi mới.

Mô phỏng Requote chạy ở giao diện trên chính các điểm này, không có kết quả mô phỏng nào ghi cứng ở đây.
"""
from __future__ import annotations

import bisect
import datetime as dt
import statistics

from ..common import VN_TZ, iso_vn, now_vn

DEFAULTS = {
    "band_pct": 0.3,
    "since": "2026-11-05",
    "min_points": 10,          # số điểm tối thiểu để một ngày được coi là đủ dữ liệu
    "min_changes": 2,          # số lần giá đổi tối thiểu trong ngày
    "unusual_gap_min": 240,    # khoảng trống (phút giao dịch) bị coi là bất thường
    "stale_after_hours": 4,    # không có điểm mới quá lâu trong giờ giao dịch thì cảnh báo
    "assessment": {"min_sessions": 10, "min_price_changes": 30},
}
PRIORITY = {"old": 0, "y5": 1, "y1": 2, "tv": 3}
MARKET_REOPEN_HOUR_VN = 5  # ngoại hối nghỉ từ khoảng 05:00 thứ Bảy đến 05:00 thứ Hai (giờ VN, lệch ±1 giờ theo mùa)


def _vn_date(ts: int) -> str:
    return dt.datetime.fromtimestamp(ts, VN_TZ).date().isoformat()


def market_open(now: dt.datetime) -> bool:
    """Ước lượng thị trường ngoại hối đang mở theo giờ VN."""
    now = now.astimezone(VN_TZ)
    wd, h = now.weekday(), now.hour  # Monday=0
    if wd == 5:
        return h < MARKET_REOPEN_HOUR_VN
    if wd == 6:
        return False
    if wd == 0:
        return h >= MARKET_REOPEN_HOUR_VN
    return True


def _cfg(settings: dict) -> dict:
    c = {**DEFAULTS, **(settings.get("intraday") or {})}
    c["assessment"] = {**DEFAULTS["assessment"], **(c.get("assessment") or {})}
    return c


def _trading_gap_min(grid: list[int], a: int, b: int, step_min: float) -> float | None:
    """Số phút giao dịch giữa hai điểm, đếm theo lưới thời gian của nguồn (bỏ qua giờ nghỉ)."""
    if not grid:
        return None
    n = bisect.bisect_right(grid, b) - bisect.bisect_right(grid, a)
    return n * step_min


def _coverage(slots: int | None, actual: int) -> dict | None:
    if not slots:
        return None
    return {"expected": slots, "actual": actual, "pct": round(actual / slots * 100, 2)}


def _day(date: str, pts: list[tuple[int, float, str]], cfg: dict, grid5: list[int], slots: dict,
         actual_raw: dict, prev_meta: dict | None) -> dict:
    prices = [v for _, v, _ in pts]
    open_, last = prices[0], prices[-1]
    band = cfg["band_pct"]
    lo, hi = open_ * (1 - band / 100), open_ * (1 + band / 100)
    market = [(t, v) for t, v, tag in pts if tag != "tv"]  # điểm do thị trường ghi nhận
    mp = [v for _, v in market]
    changes = sum(1 for i in range(1, len(mp)) if mp[i] != mp[i - 1])
    weekday = dt.date.fromisoformat(date).weekday()
    weekend = weekday >= 5
    wall = [(pts[i][0] - pts[i - 1][0]) / 60 for i in range(1, len(pts))]

    # --- độ phủ theo lưới của nguồn (5 phút và 1 phút) và khoảng trống trong giờ giao dịch
    fresh = bool(slots.get("5m"))
    if fresh:
        buckets = {t // 300 for t, _ in market}
        cov = {"5m": _coverage(slots.get("5m"), len(buckets)), "1m": _coverage(slots.get("1m"), actual_raw.get("1m", 0))}
        gaps = []
        for i in range(1, len(market)):
            g = _trading_gap_min(grid5, market[i - 1][0], market[i][0], 5.0)
            if g is not None:
                gaps.append([market[i - 1][0], market[i][0], g])
    elif prev_meta and prev_meta.get("coverage"):
        cov, gaps = prev_meta["coverage"], prev_meta.get("gaps_all") or prev_meta.get("gaps") or []
    else:
        cov = {"5m": None, "1m": None}
        gaps = [[market[i - 1][0], market[i][0], (market[i][0] - market[i - 1][0]) / 60] for i in range(1, len(market))]
    gaps.sort(key=lambda x: x[2], reverse=True)
    max_gap = gaps[0][2] if gaps else None
    unusual = [g for g in gaps if g[2] > cfg["unusual_gap_min"]]

    counts: dict[str, int] = {}
    for _, _, tag in pts:
        counts[tag] = counts.get(tag, 0) + 1

    reason = None
    if weekend:
        reason = "Cuối tuần, thị trường nghỉ"
    elif len(market) < cfg["min_points"]:
        reason = f"Chỉ có {len(market)} điểm thị trường (cần ít nhất {cfg['min_points']})"
    elif changes < cfg["min_changes"]:
        reason = f"Giá chỉ đổi {changes} lần (cần ít nhất {cfg['min_changes']})"

    warnings = []
    c5 = (cov or {}).get("5m")
    if reason and not weekend:
        warnings.append(f"Không đủ dữ liệu để phân tích: {reason}")
    if weekend:
        warnings.append("Cuối tuần, thị trường ngoại hối nghỉ nên ít điểm và giá đứng yên là bình thường")
    if c5 and not weekend and c5["pct"] < 10:
        warnings.append(f"Nguồn chỉ ghi giá ở {c5['actual']}/{c5['expected']} nến 5 phút ({c5['pct']:.1f}%), còn lại không có giá")
    for g in unusual[:3]:
        warnings.append(f"Khoảng trống bất thường {g[2] / 60:.1f} giờ giao dịch, từ {_hm(g[0])} đến {_hm(g[1])}")

    return {
        "date": date, "open": open_, "lo": lo, "hi": hi, "last": last,
        "dev_pct": (last / open_ - 1) * 100,
        "high": max(prices), "low": min(prices),
        "range_pct": (max(prices) / min(prices) - 1) * 100,
        "outside_count": sum(1 for p in prices if p < lo or p > hi),
        "n_points": len(pts),
        "meta": {
            "interval_min": round(statistics.median(wall), 1) if wall else None,
            "coverage": cov,
            "price_changes": changes,
            "market_points": len(market),
            "max_gap_min": round(max_gap, 1) if max_gap is not None else None,
            "gaps": [[g[0], g[1], round(g[2], 1)] for g in gaps[:3]],
            "gaps_all": [[g[0], g[1], round(g[2], 1)] for g in gaps],
            "unusual_gaps": len(unusual),
            "sources": counts,
            "last_point_at": pts[-1][0],
            "weekend": weekend,
            "valid": reason is None,
            "invalid_reason": reason,
            "warnings": warnings,
        },
        "points": [[t, v, tag] for t, v, tag in pts],
    }


def _hm(ts: int) -> str:
    return dt.datetime.fromtimestamp(ts, VN_TZ).strftime("%H:%M")


def build(snap: dict, prev_latest: dict, today: dt.date, settings: dict) -> dict | None:
    cfg = _cfg(settings)
    since = str(cfg["since"])
    fetch_dt = now_vn()
    pts: dict[int, tuple[float, str]] = {}

    def put(t: int, v: float, tag: str) -> None:
        old = pts.get(t)
        if old is None or PRIORITY[tag] >= PRIORITY[old[1]]:
            pts[t] = (v, tag)

    prev = (prev_latest.get("tables") or {}).get("intraday") or {}
    prev_days = {d["date"]: d for d in prev.get("days", [])}
    prev_ts: set[int] = set()
    for d in prev.get("days", []):
        for p in d.get("points", []):
            t = int(p[0])
            prev_ts.add(t)
            put(t, float(p[1]), p[2] if len(p) > 2 and p[2] in PRIORITY else "old")

    raw = snap["tables"].pop("intraday_raw", None) or {}
    for tag in ("y5", "y1"):
        for t, v in raw.get(tag, []):
            put(int(t), float(v), tag)
    cur = snap["metrics"].get("usdvnd_market") or {}
    tv_ts = None
    if cur.get("value") is not None and cur.get("timestamp") and not cur.get("carried"):
        try:
            tv_ts = int(dt.datetime.fromisoformat(cur["timestamp"]).timestamp())
            tag = "tv" if str(cur.get("source", "")).startswith("TradingView") else "y1"
            put(tv_ts, float(cur["value"]), tag)
        except ValueError:
            pass

    grid = raw.get("grid") or {}
    grid5 = sorted(int(t) for t in grid.get("y5", []))
    slots: dict[str, dict[str, int]] = {}
    for key, name in (("y5", "5m"), ("y1", "1m")):
        for t in grid.get(key, []):
            d = _vn_date(int(t))
            slots.setdefault(d, {})[name] = slots.get(d, {}).get(name, 0) + 1
    actual_raw: dict[str, dict[str, int]] = {}
    for t, _ in raw.get("y1", []):
        d = _vn_date(int(t))
        actual_raw.setdefault(d, {})["1m"] = actual_raw.get(d, {}).get("1m", 0) + 1

    by_day: dict[str, list[tuple[int, float, str]]] = {}
    for t in sorted(pts):
        d = _vn_date(t)
        if d >= since:
            by_day.setdefault(d, []).append((t, pts[t][0], pts[t][1]))
    days = [_day(d, p, cfg, grid5, slots.get(d, {}), actual_raw.get(d, {}), (prev_days.get(d) or {}).get("meta"))
            for d, p in by_day.items() if len(p) >= 2]
    if not days:
        return None
    days.sort(key=lambda x: x["date"], reverse=True)

    # --- trạng thái cập nhật
    stored_market = [t for t in pts if pts[t][1] != "tv" and _vn_date(t) >= since]
    latest_stored = max(stored_market) if stored_market else None
    new_market = [t for t in stored_market if t not in prev_ts]
    last_market_ts = raw.get("last_market_ts")
    is_open = market_open(fetch_dt)
    hours_quiet = (fetch_dt.timestamp() - latest_stored) / 3600 if latest_stored else None
    if not raw:
        status, text = "source_error", "Không lấy được dữ liệu Yahoo lần này, đang dùng điểm đã lưu"
    elif not is_open:
        status, text = "market_closed", "Thị trường ngoại hối đang nghỉ, không kỳ vọng có điểm mới"
    elif new_market:
        status, text = "new_data", f"Có {len(new_market)} điểm thị trường mới so với bản lưu trước"
    elif hours_quiet is not None and hours_quiet > cfg["stale_after_hours"]:
        status, text = "stale_suspect", (f"Không có điểm thị trường mới trong {hours_quiet:.1f} giờ giao dịch gần nhất. "
                                         "Có thể giá đứng yên thật, cũng có thể nguồn ngừng cập nhật, dữ liệu không phân biệt được")
    else:
        status, text = "no_new", "Chạy thành công nhưng chưa có điểm thị trường mới, giá có thể đang đứng yên"
    valid_days = [d for d in days if d["meta"]["valid"]]
    return {
        "band_pct": cfg["band_pct"], "since": since, "days": days,
        "config": {k: cfg[k] for k in ("min_points", "min_changes", "unusual_gap_min", "stale_after_hours", "assessment")},
        "audit": {
            "fetch_at": iso_vn(fetch_dt),
            "last_market_ts": last_market_ts,
            "latest_stored_ts": latest_stored,
            "tradingview_sample_ts": tv_ts,
            "new_market_records": len(new_market),
            "compared_with": prev_latest.get("generated_at"),
            "market_open": is_open,
            "status": status, "status_text": text,
            "api": raw.get("api") or {},
            "stored_market_points": len(stored_market),
            "valid_sessions": len(valid_days), "total_sessions": len(days),
        },
        "source": "Yahoo Finance USDVND=X (nến 1 phút và 5 phút), TradingView FX_IDC:USDVND (mẫu giá hiện tại)",
    }
