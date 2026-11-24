"""Điểm giá USD/VND trong ngày: mỗi lần pipeline chạy ghi thêm MỘT điểm là giá hiện tại của chỉ số
`usdvnd_market` (khi giá đó lấy từ Investing.com), giữ `keep_days` ngày.

Không gọi thêm nguồn nào: chỉ đọc giá mà bước thu thập đã lấy. Lần chạy trong ngày không lưu vào repo
nên điểm cũ được lấy từ snapshot trước và từ bản đang chạy trên website, rồi gộp lại.
"""
from __future__ import annotations

import datetime as dt

from ..collectors.p2p_ticks import _old_ticks, merge

KEY = "usdvnd_ticks"


def record(snap: dict, ctx: dict, keep_days: int = 7) -> None:
    m = (snap.get("metrics") or {}).get("usdvnd_market") or {}
    now_s = int(dt.datetime.now(dt.timezone.utc).timestamp())
    tick = None
    if m.get("value") is not None and "investing" in str(m.get("source", "")).lower():
        tick = {"t": now_s, "v": float(m["value"])}
    ticks = merge(_old_ticks(ctx, KEY), tick, now_s, keep_days)
    if ticks:
        band = ((ctx.get("settings") or {}).get("intraday") or {}).get("band_pct", 0.3)
        snap["tables"][KEY] = {"source": "Investing.com USD/VND (giá hiện tại mỗi lần web cập nhật)",
                               "band_pct": band, "ticks": ticks}
