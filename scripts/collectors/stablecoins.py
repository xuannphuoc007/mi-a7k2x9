"""Nguồn cung stablecoin — DefiLlama Stablecoins API (không cần key).

Lưu ý khái niệm:
- circulating supply (DefiLlama): lượng token đang lưu hành.
- market cap (CoinGecko): giá x lượng lưu hành; với stablecoin gần bằng supply nhưng không đồng nhất.
- volume giao dịch (CoinGecko): giá trị khớp trên sàn trong 24h, KHÔNG phải settlement on-chain.
"""
from __future__ import annotations

import datetime as dt

from ..common import http_get, iso_vn, metric, pct_change, s_to_iso, to_float

BASE = "https://stablecoins.llama.fi"
SRC = "DefiLlama Stablecoins"


def collect(ctx) -> dict:
    assets = http_get(f"{BASE}/stablecoins", params={"includePrices": "true"})["peggedAssets"]
    now = iso_vn(dt.datetime.now(dt.timezone.utc))
    metrics: dict[str, dict] = {}
    for sym in ("USDT", "USDC"):
        a = next((x for x in assets if x.get("symbol") == sym), None)
        if not a:
            continue
        cur = to_float((a.get("circulating") or {}).get("peggedUSD"))
        d1 = to_float((a.get("circulatingPrevDay") or {}).get("peggedUSD"))
        d7 = to_float((a.get("circulatingPrevWeek") or {}).get("peggedUSD"))
        d30 = to_float((a.get("circulatingPrevMonth") or {}).get("peggedUSD"))
        metrics[f"{sym.lower()}_supply"] = metric(
            f"{sym} Circulating Supply", cur, "USD", SRC, now,
            change_24h=pct_change(cur, d1), change_7d=pct_change(cur, d7),
            change_30d=pct_change(cur, d30),
            note="Lượng lưu hành (circulating), không phải market cap")

    chart = http_get(f"{BASE}/stablecoincharts/all")
    pts = []
    for row in chart:
        v = to_float((row.get("totalCirculatingUSD") or {}).get("peggedUSD"))
        if v is not None:
            pts.append([int(row["date"]), v])
    pts.sort(key=lambda p: p[0])
    pts = pts[-200:]
    series = {"stablecoin_supply": {"label": "Tổng cung stablecoin (USD-pegged)", "unit": "USD",
                                    "source": SRC, "points": pts}}
    if pts:
        last_t, last_v = pts[-1]

        def back(days):
            target = last_t - days * 86400
            cand = [p for p in pts if p[0] <= target]
            return cand[-1][1] if cand else None

        metrics["stablecoin_supply_total"] = metric(
            "Tổng cung stablecoin (USD-pegged)", last_v, "USD", SRC, s_to_iso(last_t),
            change_24h=pct_change(last_v, back(1)), change_7d=pct_change(last_v, back(7)),
            change_30d=pct_change(last_v, back(30)),
            note="Tổng circulating của các stablecoin neo USD, số liệu theo ngày")
    return {"metrics": metrics, "series": series}
