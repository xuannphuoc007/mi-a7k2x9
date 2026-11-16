"""USD/VND trong ngày: đường giá so với biên ±x% quanh giá mở cửa.

Điểm giá gom từ: (1) nến 5 phút của Yahoo trong ngày, (2) giá hiện tại (TradingView, hoặc Yahoo nếu
TradingView lỗi), (3) các điểm đã có trong bản lưu trước cùng ngày. Giá mở cửa là điểm đầu tiên của ngày (giờ VN).
"""
from __future__ import annotations

import datetime as dt

from ..common import VN_TZ

DEFAULT_BAND_PCT = 0.3


def _day_start(day: dt.date) -> int:
    return int(dt.datetime.combine(day, dt.time(0, 0), VN_TZ).timestamp())


def build(snap: dict, prev_latest: dict, today: dt.date, settings: dict) -> dict | None:
    band = float((settings.get("intraday") or {}).get("band_pct", DEFAULT_BAND_PCT))
    t0 = _day_start(today)
    pts: dict[int, float] = {}
    prev = (prev_latest.get("tables") or {}).get("intraday") or {}
    if prev.get("date") == today.isoformat():
        for t, v in prev.get("points", []):
            pts[int(t)] = float(v)
    for t, v in (snap["tables"].pop("intraday_raw", None) or {}).get("points", []):
        if int(t) >= t0:
            pts[int(t)] = float(v)
    cur = snap["metrics"].get("usdvnd_market") or {}
    if cur.get("value") is not None and cur.get("timestamp") and not cur.get("carried"):
        try:
            ts = int(dt.datetime.fromisoformat(cur["timestamp"]).timestamp())
            if ts >= t0:
                pts[ts] = float(cur["value"])
        except ValueError:
            pass
    if len(pts) < 2:
        return None
    series = sorted(pts.items())
    prices = [v for _, v in series]
    open_ = prices[0]
    lo, hi = open_ * (1 - band / 100), open_ * (1 + band / 100)
    last = prices[-1]
    return {
        "date": today.isoformat(), "open": open_, "band_pct": band, "lo": lo, "hi": hi,
        "last": last, "dev_pct": (last / open_ - 1) * 100,
        "high": max(prices), "low": min(prices),
        "range_pct": (max(prices) / min(prices) - 1) * 100,
        "outside_count": sum(1 for p in prices if p < lo or p > hi),
        "n_points": len(prices),
        "points": [[t, v] for t, v in series],
        "source": "TradingView FX_IDC:USDVND (giá hiện tại) và Yahoo Finance USDVND=X (nến 5 phút)",
    }
