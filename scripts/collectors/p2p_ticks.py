"""USDT/VND P2P Binance — điểm giá trong ngày cho tab "Trong ngày".

Mỗi lần pipeline chạy lấy MỘT điểm giá (mua USDT / bán USDT) theo bộ lọc:
- chỉ người đăng là merchant đã xác minh (publisherType = merchant)
- quảng cáo nhận được lệnh cỡ `amount_vnd` (transAmount)
- tỷ lệ hoàn thành tháng >= 95%, >= 100 lệnh/tháng
- lượng USDT còn bán được đủ cho lệnh cỡ `amount_vnd`
Từ các quảng cáo đạt chuẩn: lấy `top_n` giá tốt nhất -> giá tốt nhất và trung vị.

Các điểm được nối vào bảng `tables.p2p_intraday.ticks` (giữ `keep_days` ngày). Lần chạy trong
ngày không lưu vào repo, nên điểm cũ được lấy từ cả snapshot trong repo lẫn bản đang chạy trên
website rồi gộp lại.

Endpoint là endpoint chính website Binance P2P dùng (không có API công khai có tài liệu),
nên có thể đổi hoặc bị chặn bất cứ lúc nào.
"""
from __future__ import annotations

import datetime as dt
import statistics

from ..common import http_get, http_post, iso_vn, log, to_float

URL = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"
DEFAULTS = {"amount_vnd": 50_000_000, "top_n": 10, "min_completion_rate": 0.95,
            "min_month_orders": 100, "keep_days": 7}


def quote(side: str, cfg: dict) -> dict:
    """side=BUY: ta mua USDT (quảng cáo bán USDT). side=SELL: ta bán USDT."""
    amount = cfg["amount_vnd"]
    body = {"fiat": "VND", "asset": "USDT", "tradeType": side, "page": 1, "rows": 20,
            "payTypes": [], "publisherType": "merchant", "transAmount": str(amount)}
    ads = (http_post(URL, body) or {}).get("data") or []
    good = []
    for a in ads:
        adv, usr = a.get("adv") or {}, a.get("advertiser") or {}
        price = to_float(adv.get("price"))
        qty = to_float(adv.get("tradableQuantity") or adv.get("surplusAmount"))
        if not price or qty is None:
            continue
        if (to_float(usr.get("monthFinishRate")) or 0) < cfg["min_completion_rate"]:
            continue
        if (to_float(usr.get("monthOrderCount")) or 0) < cfg["min_month_orders"]:
            continue
        if qty * price < amount:
            continue
        good.append(price)
    # Mua USDT thì giá thấp là tốt; bán USDT thì giá cao là tốt
    good = sorted(good, reverse=(side == "SELL"))[: cfg["top_n"]]
    if not good:
        return {"best": None, "median": None, "n": 0}
    return {"best": good[0], "median": statistics.median(good), "n": len(good)}


def _old_ticks(ctx) -> list[dict]:
    out = list(((ctx.get("prev_latest") or {}).get("tables", {}).get("p2p_intraday") or {}).get("ticks") or [])
    site = (ctx["settings"].get("site_url") or "").rstrip("/")
    if site:
        try:
            live = http_get(f"{site}/data/latest.json", retries=1)
            out += ((live.get("tables") or {}).get("p2p_intraday") or {}).get("ticks") or []
        except Exception as e:  # noqa: BLE001
            log.info("Không đọc được điểm P2P trên website: %s", e)
    return out


def merge(old: list[dict], new: dict | None, now_s: int, keep_days: int) -> list[dict]:
    by_t = {int(t["t"]): t for t in old if t.get("t")}
    if new:
        by_t[int(new["t"])] = new
    cut = now_s - keep_days * 86400
    return [by_t[k] for k in sorted(by_t) if k >= cut]


def collect(ctx) -> dict:
    cfg = {**DEFAULTS, **(ctx["settings"].get("p2p_intraday") or {})}
    now = dt.datetime.now(dt.timezone.utc)
    now_s = int(now.timestamp())
    warnings, tick = [], None
    try:
        buy, sell = quote("BUY", cfg), quote("SELL", cfg)
        if buy["best"] or sell["best"]:
            tick = {"t": now_s, "buy": buy["best"], "buy_med": buy["median"], "n_buy": buy["n"],
                    "sell": sell["best"], "sell_med": sell["median"], "n_sell": sell["n"]}
        else:
            warnings.append("Binance P2P không có quảng cáo nào đạt bộ lọc")
    except Exception as e:  # noqa: BLE001
        warnings.append(f"Binance P2P lỗi: {e}"[:200])
    ticks = merge(_old_ticks(ctx), tick, now_s, cfg["keep_days"])
    table = {"source": "Binance P2P (merchant đã xác minh)", "amount_vnd": cfg["amount_vnd"],
             "top_n": cfg["top_n"], "min_completion_rate": cfg["min_completion_rate"],
             "min_month_orders": cfg["min_month_orders"], "band_pct": cfg.get("band_pct", 0.3),
             "updated_at": iso_vn(now) if tick else None, "ticks": ticks}
    return {"metrics": {}, "tables": {"p2p_intraday": table}, "warnings": warnings}
