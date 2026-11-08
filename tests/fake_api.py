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
    for cid, p in (("bitcoin", 100000), ("ethereum", 3500), ("solana", 180), ("ripple", 2.0), ("binancecoin", 600), ("tether", 1.0002), ("usd-coin", 0.9999)):
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
    base = {"BTCUSDT": 100000, "ETHUSDT": 3500, "SOLUSDT": 180, "XRPUSDT": 2.0, "BNBUSDT": 600}[symbol]
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
                "T10Y2Y": 0.5, "DTWEXBGS": 120.0, "SOFR": 3.65, "DTB4WK": 3.7}[sid]
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


RSS = """<?xml version="1.0"?><rss><channel>
<item><title>Fed rate cut sends stocks surging</title><link>https://x.test/1</link><pubDate>{now}</pubDate></item>
<item><title>A recipe for lunch</title><link>https://x.test/2</link><pubDate>{now}</pubDate></item>
<item><title>Old CPI inflation story</title><link>https://x.test/3</link><pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate></item>
</channel></rss>"""

BIDV = {"data": [{"currency": "USD", "muaTm": "26,100", "muaCk": "26,110", "ban": "26,400"}]}
TCB = {"exchangeRate": {"data": [
    {"sourceCurrency": "USD", "label": "USD (1,2)", "bidRateTM": "25000", "askRateTM": "26500", "inputDate": "2026-11-05T07:00:00.000Z"},
    {"sourceCurrency": "USD", "label": "USD (50,100)", "bidRateTM": "26090", "bidRateCK": "26120", "askRate": "26390",
     "inputDate": "2026-11-05T07:00:00.000Z"}]}}
TYGIAUSD = '<meta name="description" content="Tỷ giá usd chợ đen hôm nay 05-11-2026 7giờ: Mua-26,700; Bán-26,760, giá đô" />'
TYGIAVN = "<div>USD tự do</div><div>26,700\n / 26,760</div>"


def binance_ads(body):
    price = 26800 if body["tradeType"] == "BUY" else 26700
    return {"data": [{"adv": {"price": str(price), "minSingleTransAmount": "1000000", "dynamicMaxSingleTransAmount": "1000000000",
                              "surplusAmount": "100000", "tradeMethods": [{"identifier": "BANK", "tradeMethodName": "Bank Transfer"}]},
                      "advertiser": {"monthFinishRate": 0.99, "monthOrderCount": 500, "nickName": "a"}}]}


def okx_ads(side):
    price = "26820" if side == "sell" else "26720"
    return {"data": {side: [{"price": price, "quoteMinAmountPerOrder": "1000000", "quoteMaxAmountPerOrder": "1000000000",
                             "availableAmount": "100000", "paymentMethods": ["bank"], "completedRate": "0.99",
                             "completedOrderQuantity": 500, "nickName": "b"}]}}


def bybit_ads(body):
    price = "26810" if body["side"] == "1" else "26710"
    return {"result": {"items": [{"price": price, "minAmount": "1000000", "maxAmount": "1000000000", "lastQuantity": "100000",
                                  "payments": ["14"], "recentExecuteRate": 99, "recentOrderNum": 500, "nickName": "c"}]}}


def bitget_ads(body):
    price = "26830" if body["side"] == 1 else "26690"
    return {"data": {"dataList": [{"price": price, "minAmount": "1000000", "maxAmount": "1000000000", "lastAmount": "100000",
                                   "paymethodInfo": [{"paymethodName": "Bank transfer"}], "turnoverRate": "0.99",
                                   "turnoverNum": "500", "nickName": "d"}]}}


def post_router(url, body, **kw):
    if "binance" in url:
        return binance_ads(body)
    if "bybit" in url:
        return bybit_ads(body)
    if "bitget" in url:
        return bitget_ads(body)
    raise AssertionError(f"URL không có trong fake router: {url}")


def sbv_json():
    return {"rates": [{"base": "USD", "quote": "VND", "type": "reference", "value": 25100},
                      {"base": "USD", "quote": "VND", "type": "buy", "value": 24800},
                      {"base": "USD", "quote": "VND", "type": "sell", "value": 26400}],
            "rate_date": "2026-11-05"}


SBV_PAGE = """<html><body><h3>Tỷ giá trung tâm</h3><p>NHNN công bố tỷ giá trung tâm của Đồng Việt Nam với Đô la Mỹ, áp dụng cho ngày 05/11/2026 như sau:</p>
<table><tr><td>1 Đô la Mỹ =</td><td>25.615 VND</td></tr></table><p>Tỷ giá áp dụng cho ngày</p><p>05/11/2026</p>
<table><tr><td>1</td><td>USD</td><td>Đô la Mỹ</td><td>24.385,00</td><td>26.845,00</td></tr></table></body></html>"""

STOCKBIZ_ON = ('<html><dl><div><dt>Số mới nhất · 04/11/2026</dt><dd>5,02%</dd></div>'
               '<div><dt>Lần trước · 03/11/2026</dt><dd>3,81%</dd></div></dl></html>')


SBV_RATES = """<html><body><h3>Lãi suất thị trường liên ngân hàng</h3><p>Ngày áp dụng: <b>05/11/2026</b></p>
<table><tr><th>Thời hạn</th><th>Lãi suất BQ liên Ngân hàng (% năm)</th><th>Doanh số (Tỷ đồng)</th></tr>
<tr><td>Qua đêm</td><td> 4,51 </td><td> 806.145,0 </td></tr><tr><td>1 Tuần</td><td> 5 </td><td> 6.650,0 </td></tr>
<tr><td>1 Tháng</td><td> 5,27 </td><td> 7.814,0 </td></tr><tr><td>9 Tháng</td><td> 7,11 </td><td> (*) </td><td>100,0</td></tr></table>
<p>(*) Tham chiếu doanh số và lãi suất ngày 28/10/2026</p></body></html>"""

VIRA_LIST = """<a href="/tin/Ban-tin-Kinh-te-Tai-chinh-ngay/Ban-tin-Kinh-te-Tai-chinh-ngay-04-11-2026-.html">x</a>
<a href="/tin/Ban-tin-Kinh-te-Tai-chinh-ngay/Ban-tin-Kinh-te-Tai-chinh-ngay-06-11-2026-.html">y</a>"""

# Trích nguyên văn bản tin ngày 06/11/2026
VIRA_BULLETIN = ("<p>Thị trường ngoại tệ: Phiên 05/11, NHNN niêm yết tỷ giá trung tâm ở mức 25.623 VND/USD, giảm 04 đồng so với "
                 "phiên trước đó. Trên thị trường LNH, tỷ giá chốt phiên với mức 25.720 VND/USD, giảm mạnh 80 đồng so với phiên 04/11.</p>"
                 "<p>Thị trường tiền tệ LNH: Ngày 05/11, lãi suất bình quân LNH VND giảm 0,08 – 0,50 đpt ở các kỳ hạn ON và 1M trong "
                 "khi đi ngang ở kỳ hạn 1W và tăng 0,05 đpt ở kỳ hạn 2W so với phiên trước đó, giao dịch tại: ON 4,50%; 1W 5,00%; "
                 "2W 5,05% và 1M 5,40%. Lãi suất bình quân LNH USD giữ nguyên ở kỳ hạn ON trong khi tăng 0,01 – 0,02 đpt ở các kỳ "
                 "hạn còn lại; giao dịch tại: ON 3,85%; 1W 3,91%; 2W 3,92%, 1M 4,04. Lợi suất TPCP trên thị trường thứ cấp...</p>")


def yahoo_json():
    t0 = int(dt.datetime(2025, 11, 6, tzinfo=dt.timezone.utc).timestamp())
    stamps = [t0 + 86400 * i for i in range(365)]
    closes = [25000 + 3 * i + 20 * math.sin(i) for i in range(365)]
    return {"chart": {"result": [{"meta": {"regularMarketPrice": closes[-1], "regularMarketTime": stamps[-1]},
                                  "timestamp": stamps, "indicators": {"quote": [{"close": closes}]}}],
                      "error": None}}


def router(method, url, params=None, body=None, as_text=False, as_bytes=False):
    if as_bytes:
        from email.utils import format_datetime
        return RSS.format(now=format_datetime(dt.datetime.now(dt.timezone.utc))).encode()
    if "sbv.gov.vn" in url and ("l%C3%A3i" in url or "lãi" in url):
        return SBV_RATES
    if "sbv.gov.vn" in url:
        return SBV_PAGE
    if "vira.org.vn" in url:
        return VIRA_LIST if url.endswith("Ban-tin-Kinh-te-Tai-chinh-ngay.html") else VIRA_BULLETIN
    if "stockbiz" in url:
        return STOCKBIZ_ON
    if "allratestoday" in url:
        return sbv_json()
    if "finance.yahoo" in url:
        return yahoo_json()
    if "bidv" in url:
        return BIDV
    if "techcombank" in url:
        return TCB
    if "tygiausd" in url:
        return TYGIAUSD
    if "tygia.vn" in url:
        return TYGIAVN
    if "c2c/tradingOrders" in url:
        return okx_ads(params["side"])
    if "simple/price" in url:
        return {"tether": {"vnd": 26300, "last_updated_at": int(NOW.timestamp())}}
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
