"""Giá spot crypto.

- CoinGecko (không cần key; COINGECKO_DEMO_KEY tuỳ chọn để giảm rủi ro rate-limit)
- Binance public market data qua data-api.binance.vision (không cần key, dùng được từ máy chủ Mỹ)
"""
from __future__ import annotations

from ..common import env, http_get, metric, ms_to_iso, s_to_iso, iso_vn, to_float
import datetime as dt

CG = "https://api.coingecko.com/api/v3"
BINANCE = "https://data-api.binance.vision/api/v3/klines"
ASSETS = {"BTC": "bitcoin", "ETH": "ethereum", "SOL": "solana", "XRP": "ripple", "BNB": "binancecoin"}
STABLES = {"USDT": "tether", "USDC": "usd-coin"}
SRC_CG = "CoinGecko"
SRC_BN = "Binance (data-api.binance.vision)"


def _cg_headers():
    key = env("COINGECKO_DEMO_KEY")
    return {"x-cg-demo-api-key": key} if key else None


def collect_coingecko(ctx) -> dict:
    ids = ",".join(list(ASSETS.values()) + list(STABLES.values()))
    rows = http_get(f"{CG}/coins/markets", headers=_cg_headers(), params={
        "vs_currency": "usd", "ids": ids,
        "price_change_percentage": "24h,7d,30d", "sparkline": "false"})
    g = http_get(f"{CG}/global", headers=_cg_headers())["data"]

    by_id = {r["id"]: r for r in rows}
    out_m: dict[str, dict] = {}
    for sym, cid in {**ASSETS, **STABLES}.items():
        r = by_id.get(cid)
        if not r:
            continue
        ts = iso_vn(dt.datetime.fromisoformat(r["last_updated"].replace("Z", "+00:00")))
        k = sym.lower()
        out_m[f"{k}_price"] = metric(
            f"{sym}/USD", to_float(r.get("current_price")), "USD", SRC_CG, ts, kind="index",
            change_24h=to_float(r.get("price_change_percentage_24h_in_currency")),
            change_7d=to_float(r.get("price_change_percentage_7d_in_currency")),
            change_30d=to_float(r.get("price_change_percentage_30d_in_currency")))
        out_m[f"{k}_mcap"] = metric(f"{sym} Market Cap", to_float(r.get("market_cap")),
                                    "USD", SRC_CG, ts)
        out_m[f"{k}_volume_24h"] = metric(f"{sym} Volume 24h", to_float(r.get("total_volume")),
                                          "USD", SRC_CG, ts,
                                          note="Tổng volume các sàn CoinGecko theo dõi")

    gts = s_to_iso(g["updated_at"])
    pct = g.get("market_cap_percentage", {})
    out_m["total_mcap"] = metric("Tổng vốn hoá crypto", to_float(g["total_market_cap"].get("usd")),
                                 "USD", SRC_CG, gts,
                                 change_24h=to_float(g.get("market_cap_change_percentage_24h_usd")))
    out_m["total_volume_24h"] = metric("Tổng volume 24h", to_float(g["total_volume"].get("usd")),
                                       "USD", SRC_CG, gts)
    out_m["btc_dominance"] = metric("BTC Dominance", to_float(pct.get("btc")), "%", SRC_CG, gts)
    out_m["eth_dominance"] = metric("ETH Dominance", to_float(pct.get("eth")), "%", SRC_CG, gts)

    btc, eth = out_m.get("btc_price", {}).get("value"), out_m.get("eth_price", {}).get("value")
    if btc and eth:
        out_m["eth_btc"] = metric("ETH/BTC", eth / btc, "BTC", f"{SRC_CG} (tính từ giá USD)",
                                  out_m["eth_price"]["timestamp"])
    # USDT tính theo VND trên CoinGecko: tham chiếu quốc tế, không phải giá P2P trong nước
    try:
        ref = http_get(f"{CG}/simple/price", headers=_cg_headers(),
                       params={"ids": "tether", "vs_currencies": "vnd", "include_last_updated_at": "true"})["tether"]
        out_m["usdtvnd_reference"] = metric("USDT/VND quy đổi quốc tế", to_float(ref.get("vnd")), "VND", SRC_CG,
                                            s_to_iso(ref["last_updated_at"]), kind="reference",
                                            note="Quy đổi theo tỷ giá quốc tế, không phải giá mua bán thực tế ở Việt Nam")
    except Exception:  # noqa: BLE001
        pass  # chỉ là số tham chiếu, thiếu thì bỏ qua
    return {"metrics": out_m}


def _klines(symbol: str, interval: str, limit: int) -> list[dict]:
    rows = http_get(BINANCE, params={"symbol": symbol, "interval": interval, "limit": limit})
    out = []
    for r in rows:
        out.append({"time": int(r[0]) // 1000, "open": float(r[1]), "high": float(r[2]),
                    "low": float(r[3]), "close": float(r[4]), "volume": float(r[7])})
    return out  # volume = quote volume (USDT)


def collect_binance(ctx) -> dict:
    candles: dict[str, dict] = {}
    metrics: dict[str, dict] = {}
    for sym in ASSETS:
        daily = _klines(f"{sym}USDT", "1d", 200)
        hourly = _klines(f"{sym}USDT", "1h", 72)
        candles[sym] = {"1d": daily, "1h": hourly, "source": SRC_BN,
                        "unit": "USDT", "volume_unit": "USDT (quote volume)"}
        if hourly:
            last = hourly[-1]
            metrics[f"{sym.lower()}_binance_last"] = metric(
                f"{sym}/USDT Binance (nến 1h gần nhất)", last["close"], "USDT", SRC_BN,
                ms_to_iso(last["time"] * 1000 + 3600_000 - 1), kind="executable",
                note="Giá đóng cửa nến 1h gần nhất trên Binance Spot")
    return {"metrics": metrics, "candles": candles}
