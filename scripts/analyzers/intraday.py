"""USD/VND trong ngày: đường giá từng ngày so với biên ±x% quanh giá mở cửa.

Điểm giá gom từ: (1) nến 5 phút của Yahoo (từ ngày `since`), (2) giá hiện tại (TradingView, hoặc Yahoo
nếu TradingView lỗi), (3) các điểm đã có trong bản lưu trước. Giá mở cửa của một ngày là điểm đầu tiên
của ngày đó theo giờ VN. Ngày không có điểm nào (cuối tuần) thì bỏ qua.
"""
from __future__ import annotations

import datetime as dt

from ..common import VN_TZ

DEFAULT_BAND_PCT = 0.3
DEFAULT_SINCE = "2026-11-05"


def _vn_date(ts: int) -> str:
    return dt.datetime.fromtimestamp(ts, VN_TZ).date().isoformat()


def _day(date: str, pts: list[tuple[int, float]], band: float) -> dict:
    prices = [v for _, v in pts]
    open_, last = prices[0], prices[-1]
    lo, hi = open_ * (1 - band / 100), open_ * (1 + band / 100)
    return {
        "date": date, "open": open_, "lo": lo, "hi": hi, "last": last,
        "dev_pct": (last / open_ - 1) * 100,
        "high": max(prices), "low": min(prices),
        "range_pct": (max(prices) / min(prices) - 1) * 100,
        "outside_count": sum(1 for p in prices if p < lo or p > hi),
        "n_points": len(prices),
        "points": [[t, v] for t, v in pts],
    }


def build(snap: dict, prev_latest: dict, today: dt.date, settings: dict) -> dict | None:
    cfg = settings.get("intraday") or {}
    band = float(cfg.get("band_pct", DEFAULT_BAND_PCT))
    since = str(cfg.get("since", DEFAULT_SINCE))
    pts: dict[int, float] = {}
    prev = (prev_latest.get("tables") or {}).get("intraday") or {}
    for d in prev.get("days", []):
        for t, v in d.get("points", []):
            pts[int(t)] = float(v)
    for t, v in (snap["tables"].pop("intraday_raw", None) or {}).get("points", []):
        pts[int(t)] = float(v)
    cur = snap["metrics"].get("usdvnd_market") or {}
    if cur.get("value") is not None and cur.get("timestamp") and not cur.get("carried"):
        try:
            pts[int(dt.datetime.fromisoformat(cur["timestamp"]).timestamp())] = float(cur["value"])
        except ValueError:
            pass
    by_day: dict[str, list[tuple[int, float]]] = {}
    for t, v in sorted(pts.items()):
        d = _vn_date(t)
        if d >= since:
            by_day.setdefault(d, []).append((t, v))
    days = [_day(d, p, band) for d, p in by_day.items() if len(p) >= 2]
    if not days:
        return None
    days.sort(key=lambda x: x["date"], reverse=True)
    return {
        "band_pct": band, "since": since, "days": days,
        "source": "TradingView FX_IDC:USDVND (giá hiện tại) và Yahoo Finance USDVND=X (nến 5 phút)",
    }
