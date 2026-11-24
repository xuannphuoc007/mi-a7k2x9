"""Tỷ giá điều hành của NHNN và tỷ giá USD/VND trên thị trường quốc tế.

1) Tỷ giá trung tâm NHNN
   NHNN không có API công khai chính thức. Collector đọc endpoint công khai không cần key của
   allratestoday.com (bên thứ ba, tổng hợp từ thông báo của NHNN, ngày làm việc). Đây KHÔNG phải
   API của NHNN: nếu endpoint đổi hoặc lỗi, chỉ số hiện "Chưa có dữ liệu" và có thể nhập tay trong
   config/manual_inputs.json (giá trị nhập tay có ngày mới hơn hoặc bằng sẽ được ưu tiên).

2) USD/VND thị trường quốc tế (Yahoo Finance, mã USDVND=X)
   Giá tham chiếu quốc tế, không phải giá liên ngân hàng trong nước. Có sẵn lịch sử 1 năm nên
   volatility tính được ngay, không phải chờ tích luỹ.
"""
from __future__ import annotations

import datetime as dt
import re
from curl_cffi import requests as cffi_requests
from ..common import VN_TZ, date_to_iso, http_get, http_post, iso_vn, metric, missing, now_vn, s_to_iso, to_float

SBV_PAGE = "https://sbv.gov.vn/vi/t%E1%BB%B7-gi%C3%A1"
SRC_SBV_OFFICIAL = "NHNN (sbv.gov.vn), thông báo tỷ giá trung tâm"
STOCKBIZ_ON = "https://stockbiz.vn/vi-mo/du-lieu/lai-suat-lien-ngan-hang"
SRC_ON = "NHNN, lãi suất liên ngân hàng qua đêm (qua stockbiz.vn, FireAnt)"
SBV_RATES_PAGE = "https://sbv.gov.vn/vi/l%C3%A3i-su%E1%BA%A5t1"
SRC_SBV_RATES = "NHNN (sbv.gov.vn), lãi suất thị trường liên ngân hàng"
TENORS = {"Qua đêm": "ON", "1 Tuần": "1W", "2 Tuần": "2W", "1 Tháng": "1M", "3 Tháng": "3M", "6 Tháng": "6M", "9 Tháng": "9M"}

SBV_URL = "https://allratestoday.com/api/open/central-bank/sbv"
SRC_SBV = "NHNN, tỷ giá trung tâm (qua allratestoday.com, bên thứ ba)"
YAHOO_URL = "https://query1.finance.yahoo.com/v8/finance/chart/USDVND=X"
SRC_YAHOO = "Yahoo Finance USDVND=X"
BROWSER_UA = {"User-Agent": "Mozilla/5.0 (compatible; MarketIntelligence/1.0)"}
INVESTING_USDVND_URL = "https://endpoints.investing.com/pd-instruments/v1/instruments/2214?domain_id=1"
SRC_INVESTING = "Investing.com USD/VND"

def parse_sbv(j: dict) -> dict:
    """Trả về {central, buy, sell, date}. Chịu được hai dạng: danh sách `rates` hoặc một cặp đơn lẻ."""
    entries = []
    for r in j.get("rates") or []:
        if str(r.get("base", "")).upper() == "USD" and str(r.get("quote", "")).upper() == "VND":
            entries.append((str(r.get("type", "")).lower(), to_float(r.get("value"))))
    if not entries and str(j.get("source", "")).upper() == "USD" and str(j.get("target", "")).upper() == "VND":
        entries.append((str(j.get("rate_type", "reference")).lower(), to_float(j.get("rate"))))
    got = {t: v for t, v in entries if v is not None}
    if "reference" not in got:
        keys = ", ".join(sorted(j.keys()))[:120]
        raise RuntimeError(f"không thấy tỷ giá trung tâm USD/VND (các trường: {keys})")
    rate_date = str(j.get("rate_date") or "")[:10]
    if not rate_date:
        raise RuntimeError("thiếu ngày công bố (rate_date)")
    return {"central": got["reference"], "buy": got.get("buy"), "sell": got.get("sell"), "date": rate_date}


def _text(html_text: str) -> str:
    t = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", html_text)
    t = re.sub(r"(?s)<[^>]+>", " ", t)
    t = (t.replace("&nbsp;", " ").replace("&amp;", "&"))
    return re.sub(r"\s+", " ", t)


def _vn_num(s: str) -> float:
    return float(s.replace(".", "").replace(",", "."))


def _vn_date(d: str) -> str:
    dd, mm, yy = d.split("/")
    return f"{yy}-{mm}-{dd}"


def parse_sbv_page(html_text: str) -> dict:
    """Trang https://sbv.gov.vn/vi/tỷ-giá: tỷ giá trung tâm và giá mua/bán USD tại Cục Quản lý ngoại hối."""
    t = _text(html_text)
    c = re.search(r"áp dụng cho ngày\s*(\d{2}/\d{2}/\d{4})", t)
    v = re.search(r"1 Đô la Mỹ =\s*([\d.,]+)\s*VND", t)
    if not c or not v:
        raise RuntimeError("sbv.gov.vn: không thấy tỷ giá trung tâm trên trang (giao diện có thể đã đổi)")
    out = {"central": _vn_num(v.group(1)), "date": _vn_date(c.group(1)), "buy": None, "sell": None}
    b = re.search(r"USD Đô la Mỹ\s+([\d.,]+)\s+([\d.,]+)", t)
    if b:
        out["buy"], out["sell"] = _vn_num(b.group(1)), _vn_num(b.group(2))
    return out


def parse_stockbiz_on(html_text: str) -> tuple[float, str]:
    t = _text(html_text)
    m = re.search(r"Số mới nhất\s*·\s*(\d{2}/\d{2}/\d{4})\s*([\d.,]+)\s*%", t)
    if not m:
        raise RuntimeError("stockbiz.vn: không thấy lãi suất qua đêm (giao diện có thể đã đổi)")
    return _vn_num(m.group(2)), _vn_date(m.group(1))


def parse_sbv_interbank(html_text: str) -> dict:
    """Bảng "Lãi suất thị trường liên ngân hàng" trên sbv.gov.vn: {date, rates: {ON, 1W, ..., 1M}}.

    Dòng có dấu (*) là số tham chiếu của một ngày cũ hơn (NHNN ghi chú bên dưới bảng): bỏ, không dùng.
    """
    t = _text(html_text)
    i = t.find("Lãi suất thị trường liên ngân hàng")
    d = re.search(r"Ngày áp dụng:\s*(\d{2}/\d{2}/\d{4})", t[i:]) if i >= 0 else None
    if not d:
        raise RuntimeError("sbv.gov.vn: không thấy bảng lãi suất liên ngân hàng (giao diện có thể đã đổi)")
    body = t[i + d.end(): i + d.end() + 1500]
    rates = {}
    for name, tenor in TENORS.items():
        m = re.search(rf"{name}\s+([\d]+(?:,\d+)?)\s*(\(\*\))?", body)
        if m and not m.group(2):
            rates[tenor] = _vn_num(m.group(1))
    if "ON" not in rates:
        raise RuntimeError("sbv.gov.vn: bảng lãi suất liên ngân hàng không có kỳ hạn qua đêm")
    return {"date": _vn_date(d.group(1)), "rates": rates}


def collect_interbank_on(ctx) -> dict:
    """Lãi suất bình quân liên ngân hàng VND: qua đêm và 1 tháng, theo ngày áp dụng của NHNN."""
    warnings = []
    try:
        p = parse_sbv_interbank(http_get(SBV_RATES_PAGE, as_text=True, headers=BROWSER_UA))
        day, src = p["date"], SRC_SBV_RATES
        rates = p["rates"]
    except Exception as e:  # noqa: BLE001
        warnings.append(f"sbv.gov.vn: {e}")
        val, day = parse_stockbiz_on(http_get(STOCKBIZ_ON, as_text=True, headers=BROWSER_UA))
        rates, src = {"ON": val}, SRC_ON
    else:
        # Đối chiếu với Stockbiz (cùng số liệu NHNN qua FireAnt) khi cùng ngày
        try:
            val, sday = parse_stockbiz_on(http_get(STOCKBIZ_ON, as_text=True, headers=BROWSER_UA))
            if sday == day and abs(val - rates["ON"]) > 0.005:
                warnings.append(f"Lãi suất qua đêm ngày {day}: NHNN {rates['ON']}%, Stockbiz {val}%")
        except Exception:  # noqa: BLE001
            pass
    m = {"interbank_overnight_rate": metric(
        "Lãi suất liên ngân hàng qua đêm VND", rates["ON"], "%/năm", src, date_to_iso(day), kind="reference", period=day,
        note="Lãi suất bình quân liên ngân hàng VND kỳ hạn qua đêm do NHNN công bố")}
    if "1M" in rates:
        m["interbank_vnd_1m_rate"] = metric(
            "Lãi suất liên ngân hàng VND kỳ hạn 1 tháng", rates["1M"], "%/năm", src, date_to_iso(day), kind="reference",
            period=day, note="Lãi suất bình quân liên ngân hàng VND kỳ hạn 1 tháng do NHNN công bố")
    for k in m:
        m[k]["category"] = "vn_daily"
    return {"metrics": m, "warnings": warnings}


def collect_sbv(ctx) -> dict:
    errors = []
    try:
        p = parse_sbv_page(http_get(SBV_PAGE, as_text=True, headers=BROWSER_UA))
        src = SRC_SBV_OFFICIAL
    except Exception as e:  # noqa: BLE001
        errors.append(f"sbv.gov.vn: {e}")
        try:
            p = parse_sbv(http_get(SBV_URL, params={"source": "USD", "target": "VND"}))
            src = SRC_SBV
        except Exception as e2:  # noqa: BLE001
            raise RuntimeError("; ".join(errors + [f"allratestoday: {e2}"])) from e2
    ts = date_to_iso(p["date"])
    SRC = src  # noqa: N806
    note_band = ("Mua vào / bán ra là giá NHNN áp dụng với tổ chức tín dụng, quanh tỷ giá trung tâm "
                 "(biên độ do NHNN quy định).")
    m = {
        "sbv_central_rate": metric("Tỷ giá trung tâm NHNN", p["central"], "VND", SRC, ts,
                                   kind="reference", period=p["date"],
                                   note="Tỷ giá tham chiếu NHNN công bố mỗi ngày làm việc, không phải giá giao dịch"),
    }
    if p["buy"] is not None:
        m["sbv_buy_rate"] = metric("NHNN mua vào", p["buy"], "VND", SRC, ts, kind="bid",
                                   period=p["date"], note=note_band)
    if p["sell"] is not None:
        m["sbv_sell_rate"] = metric("NHNN bán ra", p["sell"], "VND", SRC, ts, kind="ask",
                                    period=p["date"], note=note_band)
    return {"metrics": m, "warnings": errors}


def parse_yahoo(j: dict) -> tuple[float, int, list[list[float]]]:
    res = (j.get("chart", {}).get("result") or [None])[0]
    if not res:
        err = (j.get("chart") or {}).get("error")
        raise RuntimeError(f"Yahoo không trả dữ liệu: {err}")
    stamps = res.get("timestamp") or []
    closes = ((res.get("indicators") or {}).get("quote") or [{}])[0].get("close") or []
    pts = [[int(t), float(c)] for t, c in zip(stamps, closes) if c is not None]
    meta = res.get("meta") or {}
    price = to_float(meta.get("regularMarketPrice"))
    when = meta.get("regularMarketTime")
    if price is None and pts:
        price, when = pts[-1][1], pts[-1][0]
    if price is None or when is None:
        raise RuntimeError("Yahoo không có giá")
    return price, int(when), pts


TV_URL = "https://scanner.tradingview.com/global/scan"
SRC_TV = "TradingView"


def tv_quote(ticker: str) -> float | None:
    """Giá hiện tại từ endpoint scanner của TradingView (không chính thức, có thể đổi hoặc bị chặn).
    Lỗi thì trả None để dùng Yahoo."""
    try:
        j = http_post(TV_URL, {"symbols": {"tickers": [ticker]}, "columns": ["close"]},
                      headers=BROWSER_UA)
        rows = j.get("data") or []
        return to_float(rows[0]["d"][0]) if rows else None
    except Exception:  # noqa: BLE001
        return None


_YAHOO_RAW: dict[str, dict] = {}


def _yahoo_or_none(url: str):
    try:
        j = http_get(url, params={"range": "1y", "interval": "1d"}, headers=BROWSER_UA)
        out = parse_yahoo(j)
        _YAHOO_RAW[url] = j
        return out
    except Exception:  # noqa: BLE001
        return None


def _quote_with_history(url: str, tv_ticker: str, lo: float, hi: float):
    """Giá hiện tại ưu tiên TradingView, lịch sử và dự phòng từ Yahoo. Trả (giá, thời điểm iso, điểm, nguồn)."""
    yh = _yahoo_or_none(url)
    pts = yh[2] if yh else []
    tv = tv_quote(tv_ticker)
    if tv is not None and lo <= tv <= hi:
        return tv, iso_vn(now_vn()), pts, SRC_TV
    if yh:
        return yh[0], s_to_iso(yh[1]), pts, None
    raise RuntimeError("TradingView và Yahoo đều không trả giá")


def _change(price: float, pts: list) -> float | None:
    if not pts:
        return None
    prev = pts[-2][1] if len(pts) >= 2 and abs(pts[-1][1] - price) / price < 1e-4 else pts[-1][1]
    return (price / prev - 1) * 100 if prev else None


def investing_usdvnd_quote() -> float | None:
    """Giá USD/VND hiện tại từ Investing.com. Lỗi hoặc bị chặn thì trả None."""
    headers = {
        "Origin": "https://www.investing.com",
        "Referer": "https://www.investing.com/",
        "Accept": "application/json, text/plain, */*",
        "domain-id": "1",
    }
    try:
        r = cffi_requests.get(INVESTING_USDVND_URL, headers=headers, impersonate="chrome", timeout=15)
        r.raise_for_status()
        val = to_float((r.json().get("price") or {}).get("last"))
        return val if val is not None and 15000 <= val <= 40000 else None
    except Exception:  # noqa: BLE001
        return None


def collect_market_fx(ctx) -> dict:
    """USD/VND thị trường quốc tế: CHỈ giá hiện tại từ Investing.com. Không dùng Yahoo/TradingView.
    Không lấy được thì chỉ số báo "chưa có dữ liệu" (không lùi về nguồn khác)."""
    price = investing_usdvnd_quote()
    label = "USD/VND thị trường quốc tế"
    if price is None:
        return {"metrics": {"usdvnd_market": missing(label, "VND", SRC_INVESTING,
                                                     "Chưa có dữ liệu: Investing.com không trả giá lần này")},
                "warnings": ["Investing.com không trả giá"]}
    return {"metrics": {"usdvnd_market": metric(
        label, price, "VND", SRC_INVESTING, iso_vn(now_vn()), kind="mid",
        note="Giá tham chiếu quốc tế từ Investing.com (không phải giá ngân hàng), có thể lệch so với giá liên ngân hàng trong nước")}}


DXY_URL = "https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB"
SRC_DXY = "Yahoo Finance DX-Y.NYB (ICE US Dollar Index)"


def collect_dxy(ctx) -> dict:
    """DXY: giá hiện tại từ TradingView (TVC:DXY), lịch sử và dự phòng từ Yahoo (FRED không có DXY)."""
    price, ts, pts, tv = _quote_with_history(DXY_URL, "TVC:DXY", 50, 200)
    src = f"{SRC_TV} TVC:DXY" if tv else SRC_DXY
    m = {"dxy": metric("DXY (chỉ số đô la ICE)", price, "điểm", src, ts, kind="mid",
                       change_24h=_change(price, pts),
                       note="Giá tham chiếu, không phải dữ liệu real-time chính thức của ICE"
                            + (". Giá hiện tại từ TradingView, lịch sử từ Yahoo Finance" if tv else ""))}
    series = {"dxy": {"label": "DXY", "unit": "điểm", "source": src, "points": pts}}
    return {"metrics": m, "series": series}


