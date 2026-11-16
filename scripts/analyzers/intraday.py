"""USD/VND trong ngày: điểm giá từng ngày kèm thông tin nguồn và chất lượng dữ liệu.

Điểm giá gom từ: (1) nến 1 phút của Yahoo (7 ngày gần nhất), (2) nến 5 phút của Yahoo (khoảng 1 tháng),
(3) giá hiện tại (TradingView, hoặc Yahoo nếu TradingView lỗi), (4) các điểm đã lưu từ lần chạy trước.
Cùng một thời điểm thì ưu tiên 1 phút, rồi 5 phút. Mỗi điểm lưu dạng [giây, giá, nhãn nguồn]:
y1 = Yahoo 1 phút, y5 = Yahoo 5 phút, tv = TradingView, old = điểm lưu từ phiên bản cũ (không rõ nguồn).
Giá mở cửa của một ngày là điểm đầu tiên của ngày đó theo giờ VN. Mô phỏng Requote chạy ở giao diện
trên chính các điểm này, nên không có kết quả mô phỏng nào được ghi cứng ở đây.
"""
from __future__ import annotations

import datetime as dt
import statistics

from ..common import VN_TZ

DEFAULT_BAND_PCT = 0.3
DEFAULT_SINCE = "2026-11-05"
GRID_5M_PER_DAY = 288
LOW_COVERAGE_PCT = 25.0
BIG_GAP_MIN = 180.0
PRIORITY = {"old": 0, "y5": 1, "y1": 2, "tv": 3}


def _vn_date(ts: int) -> str:
    return dt.datetime.fromtimestamp(ts, VN_TZ).date().isoformat()


def _warnings(date: str, n: int, coverage: float, max_gap: float | None) -> list[str]:
    out = []
    weekend = dt.date.fromisoformat(date).weekday() >= 5
    if n < 2:
        out.append("Chưa đủ hai điểm giá để đánh giá")
    if not weekend and coverage < LOW_COVERAGE_PCT:
        out.append(f"Thiếu dữ liệu: có {n} điểm, khoảng {coverage:.0f}% so với lưới 5 phút ({GRID_5M_PER_DAY} điểm/ngày)")
    if not weekend and max_gap is not None and max_gap > BIG_GAP_MIN:
        out.append(f"Có khoảng trống {max_gap / 60:.1f} giờ không có điểm giá")
    if weekend:
        out.append("Cuối tuần, thị trường ngoại hối nghỉ nên có ít điểm")
    return out


def _day(date: str, pts: list[tuple[int, float, str]], band: float) -> dict:
    prices = [v for _, v, _ in pts]
    open_, last = prices[0], prices[-1]
    lo, hi = open_ * (1 - band / 100), open_ * (1 + band / 100)
    gaps = [(pts[i][0] - pts[i - 1][0]) / 60 for i in range(1, len(pts))]
    max_gap = max(gaps) if gaps else None
    coverage = min(len(pts) / GRID_5M_PER_DAY * 100, 100.0)
    counts: dict[str, int] = {}
    for _, _, tag in pts:
        counts[tag] = counts.get(tag, 0) + 1
    return {
        "date": date, "open": open_, "lo": lo, "hi": hi, "last": last,
        "dev_pct": (last / open_ - 1) * 100,
        "high": max(prices), "low": min(prices),
        "range_pct": (max(prices) / min(prices) - 1) * 100,
        "outside_count": sum(1 for p in prices if p < lo or p > hi),
        "n_points": len(pts),
        "meta": {
            "interval_min": round(statistics.median(gaps), 1) if gaps else None,
            "max_gap_min": round(max_gap, 1) if max_gap is not None else None,
            "coverage_pct": round(coverage, 1),
            "sources": counts,
            "last_point_at": pts[-1][0],
            "warnings": _warnings(date, len(pts), coverage, max_gap),
        },
        "points": [[t, v, tag] for t, v, tag in pts],
    }


def build(snap: dict, prev_latest: dict, today: dt.date, settings: dict) -> dict | None:
    cfg = settings.get("intraday") or {}
    band = float(cfg.get("band_pct", DEFAULT_BAND_PCT))
    since = str(cfg.get("since", DEFAULT_SINCE))
    pts: dict[int, tuple[float, str]] = {}

    def put(t: int, v: float, tag: str) -> None:
        old = pts.get(t)
        if old is None or PRIORITY[tag] >= PRIORITY[old[1]]:
            pts[t] = (v, tag)

    prev = (prev_latest.get("tables") or {}).get("intraday") or {}
    for d in prev.get("days", []):
        for p in d.get("points", []):
            put(int(p[0]), float(p[1]), p[2] if len(p) > 2 and p[2] in PRIORITY else "old")
    raw = snap["tables"].pop("intraday_raw", None) or {}
    for tag in ("y5", "y1"):
        for t, v in raw.get(tag, []):
            put(int(t), float(v), tag)
    cur = snap["metrics"].get("usdvnd_market") or {}
    if cur.get("value") is not None and cur.get("timestamp") and not cur.get("carried"):
        try:
            ts = int(dt.datetime.fromisoformat(cur["timestamp"]).timestamp())
            tag = "tv" if str(cur.get("source", "")).startswith("TradingView") else "y1"
            put(ts, float(cur["value"]), tag)
        except ValueError:
            pass
    by_day: dict[str, list[tuple[int, float, str]]] = {}
    for t in sorted(pts):
        d = _vn_date(t)
        if d >= since:
            by_day.setdefault(d, []).append((t, pts[t][0], pts[t][1]))
    days = [_day(d, p, band) for d, p in by_day.items() if len(p) >= 2]
    if not days:
        return None
    days.sort(key=lambda x: x["date"], reverse=True)
    return {
        "band_pct": band, "since": since, "days": days,
        "source": "TradingView FX_IDC:USDVND (giá hiện tại), Yahoo Finance USDVND=X (nến 1 phút và 5 phút)",
    }
