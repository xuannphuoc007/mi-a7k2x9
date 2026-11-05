"""Phản hồi API giả lập CHỈ dùng cho unit test (không bao giờ dùng trong production).

Mô phỏng đúng cấu trúc JSON/CSV của từng nguồn để kiểm tra parser và tính toán.
"""
from __future__ import annotations

import datetime as dt
import math

NOW = dt.datetime(2026, 11, 5, 0, 30, tzinfo=dt.timezone.utc)
NOW_MS = int(NOW.timestamp() * 1000)
DAY = 86400


def _wave(i, base, amp=0.03):
    return base * (1 + amp * math.sin(i / 3) + 0.001 * i)


def coingecko_markets():
    rows = []
    for cid, p in (("bitcoin", 100000), ("ethereum", 3500), ("solana", 180), ("tether", 1.0002), ("usd-coin", 0.9999)):
        rows.append({"id": cid, "current_price": p, "market_cap": p * 1e7, "total_volume": p * 1e5,
                     "price_change_percentage_24h_in_currency": 1.2,
                     "price_change_percentage_7d_in_currency": 4.5,
                     "price_change_percentage_30d_in_currency": -2.0,
                     "last_updated": "2026-11-05T00:29:00.000Z"})
    return rows


def coingecko_global():
    return {"data": {"updated_at": int(NOW.timestamp()), "total_market_cap": {"usd": 3.5e12},
                     "total_volume": {"usd": 1.2e11}, "market_cap_percentage": {"btc": 58.1, "eth": 12.0},
                     "market_cap_change_percentage_24h_usd": 0.8}}


def klines(symbol, interval, limit):
    step = DAY if interval == "1d" else 3600
    base = {"BTCUSDT": 100000, "ETHUSDT": 3500, "SOLUSDT": 180}[symbol]
    start = NOW_MS // 1000 - step * limit
    out = []
    for i in range(limit):
        c = _wave(i, base)
        out.append([(start + i * step) * 1000, str(c * 0.99), str(c * 1.01), str(c * 0.98), str(c), "1", 0,
                    str(c * 1000), 0, 0, 0, 0])
    return out


def okx(path, params):
    ts = str(NOW_MS)
    if path.endswith("/public/funding-rate"):
        return {"code": "0", "data": [{"fundingRate": "0.0001", "ts": ts, "fundingTime": ts}]}
    if path.endswith("/funding-rate-history"):
        return {"code": "0", "data": [{"fundingTime": str(NOW_MS - i * 8 * 3600_000),
                                       "realizedRate": str(0.0001 + 0.00001 * (i % 5))} for i in range(100)]}
    if path.endswith("/public/open-interest"):
        return {"code": "0", "data": [{"oiUsd": "5000000000", "oiCcy": "50000", "ts": ts}]}
    if path.endswith("/open-interest-volume"):
        return {"code": "0", "data": [[str(NOW_MS - i * DAY * 1000), str(_wave(i, 1e10)), "1e9"] for i in range(30)]}
    if path.endswith("/long-short-account-ratio"):
        return {"code": "0", "data": [[str(NOW_MS - i * DAY * 1000), str(1 + 0.1 * math.sin(i))] for i in range(30)]}
    if path.endswith("/taker-volume"):
        return {"code": "0", "data": [[str(NOW_MS - i * DAY * 1000), "1000", str(1000 + 50 * math.sin(i))] for i in range(30)]}
    if path.endswith("/mark-price"):
        return {"code": "0", "data": [{"markPx": "100050", "ts": ts}]}
    if path.endswith("/index-tickers"):
        return {"code": "0", "data": [{"idxPx": "100000", "ts": ts}]}
    raise AssertionError(path)


def fng():
    return {"data": [{"value": str(60 - i % 10), "value_classification": "Greed",
                      "timestamp": str(int(NOW.timestamp()) - i * DAY)} for i in range(120)]}


def llama_assets():
    return {"peggedAssets": [
        {"symbol": "USDT", "circulating": {"peggedUSD": 1.9e11}, "circulatingPrevDay": {"peggedUSD": 1.89e11},
         "circulatingPrevWeek": {"peggedUSD": 1.88e11}, "circulatingPrevMonth": {"peggedUSD": 1.85e11}},
        {"symbol": "USDC", "circulating": {"peggedUSD": 7.5e10}, "circulatingPrevDay": {"peggedUSD": 7.5e10},
         "circulatingPrevWeek": {"peggedUSD": 7.4e10}, "circulatingPrevMonth": {"peggedUSD": 7.2e10}}]}


def llama_chart():
    start = int(NOW.timestamp()) - 150 * DAY
    return [{"date": str(start + i * DAY), "totalCirculatingUSD": {"peggedUSD": 2.9e11 * (1 + 0.0005 * i)}}
            for i in range(150)]


def fred_csv(sid):
    lines = ["observation_date," + sid]
    d0 = dt.date(2024, 9, 1)
    monthly = sid in ("CPIAUCSL", "CPILFESL", "PCEPI", "PCEPILFE", "PAYEMS", "UNRATE")
    if monthly:
        for i in range(26):
            y, m = divmod(d0.month - 1 + i, 12)
            lines.append(f"{d0.year + y}-{m + 1:02d}-01,{300 + i * 0.8:.3f}")
    else:
        base = {"DFEDTARU": 4.0, "DFEDTARL": 3.75, "DFF": 3.88, "DGS2": 3.6, "DGS10": 4.1,
                "T10Y2Y": 0.5, "DTWEXBGS": 120.0}[sid]
        d = dt.date(2025, 10, 1)
        i = 0
        while d <= dt.date(2026, 11, 4):
            if d.weekday() < 5:
                v = base - (0.5 if sid.startswith("DFEDTAR") and d > dt.date(2026, 6, 1) else 0) + 0.01 * math.sin(i)
                lines.append(f"{d.isoformat()},{v:.3f}")
                i += 1
            d += dt.timedelta(days=1)
        lines.append("2026-11-05,.")
    return "\n".join(lines)


def vcb_json():
    return {"Date": "2026-11-05T00:00:00", "UpdatedDate": "2026-11-05T07:15:00",
            "Data": [{"currencyCode": "USD", "cash": "26,100.00", "transfer": "26,130.00", "sell": "26,380.00"}]}


def router(method, url, params=None, body=None, as_text=False):
    if "coingecko" in url:
        return coingecko_markets() if url.endswith("/coins/markets") else coingecko_global()
    if "binance.vision" in url:
        return klines(params["symbol"], params["interval"], params["limit"])
    if "okx.com/api/v5" in url:
        return okx(url.split("/api/v5")[1], params)
    if "alternative.me" in url:
        return fng()
    if url.endswith("/stablecoins"):
        return llama_assets()
    if "stablecoincharts" in url:
        return llama_chart()
    if "fred" in url:
        return fred_csv(params["id"])
    if "vietcombank" in url:
        return vcb_json()
    raise AssertionError(f"URL không có trong fake router: {url}")
