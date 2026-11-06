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

from ..common import date_to_iso, http_get, metric, s_to_iso, to_float

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


def collect_sbv(ctx) -> dict:
    j = http_get(SBV_URL, params={"source": "USD", "target": "VND"})
    p = parse_sbv(j)
    ts = date_to_iso(p["date"])
    note_band = ("Mua vào / bán ra là giá NHNN áp dụng với tổ chức tín dụng, quanh tỷ giá trung tâm "
                 "(biên độ do NHNN quy định).")
    m = {
        "sbv_central_rate": metric("Tỷ giá trung tâm NHNN", p["central"], "VND", SRC_SBV, ts,
                                   kind="reference", period=p["date"],
                                   note="Tỷ giá tham chiếu NHNN công bố mỗi ngày làm việc, không phải giá giao dịch"),
    }
    if p["buy"] is not None:
        m["sbv_buy_rate"] = metric("NHNN mua vào", p["buy"], "VND", SRC_SBV, ts, kind="bid",
                                   period=p["date"], note=note_band)
    if p["sell"] is not None:
        m["sbv_sell_rate"] = metric("NHNN bán ra", p["sell"], "VND", SRC_SBV, ts, kind="ask",
                                    period=p["date"], note=note_band)
    return {"metrics": m}


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
