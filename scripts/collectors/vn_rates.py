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

import re

from ..common import date_to_iso, http_get, metric, s_to_iso, to_float

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
        raise RuntimeError("Yahoo không có giá USD/VND")
    return price, int(when), pts


def collect_market_fx(ctx) -> dict:
    j = http_get(YAHOO_URL, params={"range": "1y", "interval": "1d"}, headers=BROWSER_UA)
    price, when, pts = parse_yahoo(j)
    ts = s_to_iso(when)
    m = {"usdvnd_market": metric(
        "USD/VND thị trường quốc tế", price, "VND", SRC_YAHOO, ts, kind="mid",
        note="Giá tham chiếu quốc tế từ Yahoo Finance, có thể lệch so với giá liên ngân hàng trong nước")}
    series = {"usdvnd_market": {"label": "USD/VND thị trường quốc tế", "unit": "VND", "source": SRC_YAHOO,
                                "points": pts}}
    return {"metrics": m, "series": series}
