"""USDT/VND P2P — Binance P2P và OKX P2P.

QUAN TRỌNG: Hai nền tảng không công bố API P2P công khai có tài liệu. Collector này gọi
endpoint mà chính website P2P dùng để hiển thị danh sách quảng cáo. Mặc định TẮT
(config/settings.json -> p2p.enabled = false). Chỉ bật khi đơn vị đã xác nhận việc truy cập
phù hợp điều khoản dịch vụ, hoặc thay bằng nguồn giá OTC/nội bộ được cấp quyền.

Giá quảng cáo P2P KHÔNG được coi là giá thực thi. "Best executable" ở đây chỉ tính trên các
quảng cáo thoả đồng thời: hạn mức min/max chứa quy mô giao dịch, đủ lượng USDT khả dụng,
phương thức thanh toán chuyển khoản ngân hàng, và tiêu chí uy tín người đăng (tỷ lệ hoàn thành,
số lệnh/tháng) theo cấu hình.

Quy ước phía giá (theo góc nhìn đơn vị muốn mua/bán USDT):
- ask = giá thấp nhất mà người bán USDT chào (ta MUA USDT ở giá này)
- bid = giá cao nhất mà người mua USDT chào (ta BÁN USDT ở giá này)
"""
from __future__ import annotations

from ..common import http_get, http_post, iso_vn, metric, missing, to_float
import datetime as dt

BINANCE_URL = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"
OKX_URL = "https://www.okx.com/v3/c2c/tradingOrders/books"


def _binance(trade_type: str) -> list[dict]:
    """trade_type BUY = quảng cáo bán USDT (ask); SELL = quảng cáo mua USDT (bid)."""
    ads = []
    for page in (1, 2, 3):
        j = http_post(BINANCE_URL, {"fiat": "VND", "asset": "USDT", "tradeType": trade_type,
                                    "page": page, "rows": 20, "payTypes": [],
                                    "publisherType": None})
        rows = j.get("data") or []
        for row in rows:
            a, u = row.get("adv", {}), row.get("advertiser", {})
            ads.append({
                "price": to_float(a.get("price")),
                "min_vnd": to_float(a.get("minSingleTransAmount")),
                "max_vnd": to_float(a.get("dynamicMaxSingleTransAmount") or a.get("maxSingleTransAmount")),
                "available_usdt": to_float(a.get("surplusAmount") or a.get("tradableQuantity")),
                "methods": [m.get("tradeMethodName") or m.get("identifier") or "" for m in a.get("tradeMethods", [])],
                "completion": to_float(u.get("monthFinishRate")),
                "orders": to_float(u.get("monthOrderCount")),
                "merchant": u.get("nickName", ""),
            })
        if len(rows) < 20:
            break
    return ads


def _okx(side: str) -> list[dict]:
    """side=sell -> người đăng bán USDT (ask); side=buy -> người đăng mua USDT (bid)."""
    j = http_get(OKX_URL, params={"quoteCurrency": "vnd", "baseCurrency": "usdt", "side": side,
                                  "paymentMethod": "all", "userType": "all"})
    rows = (j.get("data") or {}).get(side, [])
    out = []
    for a in rows:
        out.append({
            "price": to_float(a.get("price")),
            "min_vnd": to_float(a.get("quoteMinAmountPerOrder")),
            "max_vnd": to_float(a.get("quoteMaxAmountPerOrder")),
            "available_usdt": to_float(a.get("availableAmount")),
            "methods": a.get("paymentMethods") or [],
            "completion": to_float(a.get("completedRate")),
            "orders": to_float(a.get("completedOrderQuantity")),
            "merchant": a.get("nickName", ""),
        })
    return out


def eligible(ads: list[dict], size_vnd: float, cfg: dict) -> list[dict]:
    kws = [k.lower() for k in cfg.get("allowed_payment_keywords", [])]
    res = []
    for a in ads:
        p = a.get("price")
        if not p or a.get("min_vnd") is None or a.get("max_vnd") is None:
            continue
        if not (a["min_vnd"] <= size_vnd <= a["max_vnd"]):
            continue
        if (a.get("available_usdt") or 0) * p < size_vnd:
            continue
        if a.get("completion") is not None and a["completion"] < cfg.get("min_completion_rate", 0):
            continue
        if a.get("orders") is not None and a["orders"] < cfg.get("min_month_orders", 0):
            continue
        if kws and not any(any(k in str(m).lower() for k in kws) for m in a.get("methods", [])):
            continue
        res.append(a)
    return res


def book_metrics(asks: list[dict], bids: list[dict], cfg: dict) -> dict:
    """Tính best executable bid/ask theo từng quy mô và độ sâu quanh giá tốt nhất."""
    rows = []
    for size in cfg["trade_sizes_vnd"]:
        ea, eb = eligible(asks, size, cfg), eligible(bids, size, cfg)
        ask = min((a["price"] for a in ea), default=None)
        bid = max((b["price"] for b in eb), default=None)
        mid = (ask + bid) / 2 if ask and bid else None
        rows.append({"size_vnd": size, "ask": ask, "bid": bid, "mid": mid,
                     "spread_pct": (ask - bid) / mid * 100 if mid else None,
                     "ask_count": len(ea), "bid_count": len(eb)})
    band = cfg.get("depth_band_pct", 0.5) / 100
    base = rows[0]
    depth_ask = depth_bid = None
    if base["ask"]:
        depth_ask = sum(a.get("available_usdt") or 0 for a in asks
                        if a.get("price") and a["price"] <= base["ask"] * (1 + band))
    if base["bid"]:
        depth_bid = sum(b.get("available_usdt") or 0 for b in bids
                        if b.get("price") and b["price"] >= base["bid"] * (1 - band))
    return {"by_size": rows, "depth_ask_usdt": depth_ask, "depth_bid_usdt": depth_bid,
            "ads_ask": len(asks), "ads_bid": len(bids)}


def collect(ctx) -> dict:
    cfg = ctx["settings"]["p2p"]
    if not cfg.get("enabled"):
        note = ("Chưa có dữ liệu: collector P2P đang TẮT (config/settings.json → p2p.enabled). "
                "Binance/OKX không có API P2P công khai; cần pháp chế xác nhận trước khi bật, "
                "hoặc tích hợp nguồn OTC/nội bộ được cấp quyền.")
        return {"metrics": {
            "usdtvnd_p2p_bid": missing("USDT/VND P2P — best executable bid", "VND", "P2P", note),
            "usdtvnd_p2p_ask": missing("USDT/VND P2P — best executable ask", "VND", "P2P", note),
            "usdtvnd_p2p_mid": missing("USDT/VND P2P — mid", "VND", "P2P", note)},
            "tables": {"p2p": {"enabled": False, "note": note, "platforms": {}}}, "disabled": True}

    ts = iso_vn(dt.datetime.now(dt.timezone.utc))
    platforms, errors = {}, []
    for name in cfg.get("platforms", []):
        try:
            if name == "binance":
                asks, bids = _binance("BUY"), _binance("SELL")
            elif name == "okx":
                asks, bids = _okx("sell"), _okx("buy")
            else:
                continue
            bm = book_metrics(asks, bids, cfg)
            bm["timestamp"] = ts
            platforms[name] = bm
        except Exception as e:  # noqa: BLE001
            errors.append(f"{name}: {e}")
            platforms[name] = {"error": str(e), "timestamp": ts}
    if not any("by_size" in p for p in platforms.values()):
        raise RuntimeError("; ".join(errors) or "Không có nền tảng P2P nào trả dữ liệu")

    # Giá tổng hợp: ask tốt nhất & bid tốt nhất trên mọi nền tảng ở quy mô nhỏ nhất
    best_ask = min((p["by_size"][0]["ask"] for p in platforms.values()
                    if "by_size" in p and p["by_size"][0]["ask"]), default=None)
    best_bid = max((p["by_size"][0]["bid"] for p in platforms.values()
                    if "by_size" in p and p["by_size"][0]["bid"]), default=None)
    mid = (best_ask + best_bid) / 2 if best_ask and best_bid else None
    size0 = cfg["trade_sizes_vnd"][0]
    src = "P2P " + ", ".join(k for k, v in platforms.items() if "by_size" in v)
    note = f"Tốt nhất trong các quảng cáo đủ điều kiện thực thi ở quy mô {size0:,.0f} VND"
    return {"metrics": {
        "usdtvnd_p2p_bid": metric("USDT/VND P2P — best executable bid", best_bid, "VND", src, ts,
                                  kind="bid", note=note),
        "usdtvnd_p2p_ask": metric("USDT/VND P2P — best executable ask", best_ask, "VND", src, ts,
                                  kind="ask", note=note),
        "usdtvnd_p2p_mid": metric("USDT/VND P2P — mid", mid, "VND", src, ts, kind="mid",
                                  note="Trung bình best executable bid và ask")},
        "tables": {"p2p": {"enabled": True, "platforms": platforms, "config": {
            "trade_sizes_vnd": cfg["trade_sizes_vnd"], "min_completion_rate": cfg["min_completion_rate"],
            "min_month_orders": cfg["min_month_orders"], "depth_band_pct": cfg["depth_band_pct"]}}},
        "warnings": errors}
