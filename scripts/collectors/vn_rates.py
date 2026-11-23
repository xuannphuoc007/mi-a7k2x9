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

from ..common import VN_TZ, date_to_iso, http_get, http_post, iso_vn, metric, now_vn, s_to_iso, to_float

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


def parse_daily_candles(j: dict) -> list[dict]:
    """Nến ngày (mở, cao, thấp, đóng) từ phản hồi Yahoo. Mỗi ngày giờ Việt Nam một nến, bỏ cuối tuần.
    Thời điểm nến là 00:00 UTC của ngày đó, đúng định dạng biểu đồ ngày của web."""
    res = (j.get("chart", {}).get("result") or [None])[0] or {}
    q = ((res.get("indicators") or {}).get("quote") or [{}])[0]
    rows: dict[int, dict] = {}
    for i, t in enumerate(res.get("timestamp") or []):
        try:
            o, h, lo, c = q["open"][i], q["high"][i], q["low"][i], q["close"][i]
        except (KeyError, IndexError):
            continue
        if None in (o, h, lo, c):
            continue
        day = dt.datetime.fromtimestamp(t, VN_TZ).date()
        if day.weekday() >= 5:
            continue
        ts = int(dt.datetime(day.year, day.month, day.day, tzinfo=dt.timezone.utc).timestamp())
        rows[ts] = {"time": ts, "open": float(o), "high": float(max(h, o, c)), "low": float(min(lo, o, c)),
                    "close": float(c), "volume": 0}
    return [rows[t] for t in sorted(rows)]


def tv_day_bar(ticker: str) -> dict | None:
    """Nến của ngày hiện tại từ TradingView (mở, cao, thấp, giá hiện tại). Lỗi thì None."""
    try:
        j = http_post(TV_URL, {"symbols": {"tickers": [ticker]}, "columns": ["open", "high", "low", "close"]},
                      headers=BROWSER_UA)
        rows = j.get("data") or []
        v = [to_float(x) for x in rows[0]["d"]] if rows else []
        if len(v) == 4 and None not in v and v[2] <= v[3] <= v[1]:
            return {"open": v[0], "high": v[1], "low": v[2], "close": v[3]}
    except Exception:  # noqa: BLE001
        pass
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


def collect_market_fx(ctx) -> dict:
    price, ts, pts, tv = _quote_with_history(YAHOO_URL, "FX_IDC:USDVND", 15000, 40000)
    src = f"{SRC_TV} FX_IDC:USDVND" if tv else SRC_YAHOO
    m = {"usdvnd_market": metric(
        "USD/VND thị trường quốc tế", price, "VND", src, ts, kind="mid",
        change_24h=_change(price, pts),
        note="Giá tham chiếu quốc tế (không phải giá ngân hàng), có thể lệch so với giá liên ngân hàng trong nước"
             + (". Giá hiện tại từ TradingView, lịch sử từ Yahoo Finance" if tv else ""))}
    series = {"usdvnd_market": {"label": "USD/VND thị trường quốc tế", "unit": "VND", "source": src,
                                "points": pts}}
    out = {"metrics": m, "series": series}
    raw = _YAHOO_RAW.get(YAHOO_URL)
    candles = parse_daily_candles(raw) if raw else []
    if candles:
        bar = tv_day_bar("FX_IDC:USDVND") if src == f"{SRC_TV} FX_IDC:USDVND" else None
        today = int(dt.datetime.combine(now_vn().date(), dt.time(), tzinfo=dt.timezone.utc).timestamp())
        if bar and now_vn().weekday() < 5:
            candles = [c for c in candles if c["time"] != today] + [{"time": today, **bar, "volume": 0}]
        out["candles"] = {"usdvnd_market": {"1d": candles, "1h": [], "source": src + ", nến ngày Yahoo Finance",
                                            "unit": "VND", "volume_unit": ""}}
    return out


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


def audit_yahoo(j: dict) -> dict:
    """Số liệu kiểm toán dữ liệu gốc của một phản hồi Yahoo: lưới thời gian, số nến có giá, số nến null."""
    res = (j.get("chart", {}).get("result") or [None])[0]
    if not res:
        raise RuntimeError(f"Yahoo không trả dữ liệu: {(j.get('chart') or {}).get('error')}")
    stamps = [int(t) for t in (res.get("timestamp") or [])]
    closes = ((res.get("indicators") or {}).get("quote") or [{}])[0].get("close") or []
    pts = [[t, float(c)] for t, c in zip(stamps, closes) if c is not None]
    vals = [v for _, v in pts]
    return {
        "grid": stamps, "points": pts,
        "audit": {
            "raw_bars": len(stamps), "non_null": len(pts), "null": len(stamps) - len(pts),
            "null_pct": round((len(stamps) - len(pts)) / len(stamps) * 100, 2) if stamps else None,
            "equal_to_previous_kept": sum(1 for i in range(1, len(vals)) if vals[i] == vals[i - 1]),
            "window_start": stamps[0] if stamps else None, "window_end": stamps[-1] if stamps else None,
            "last_priced_bar": pts[-1][0] if pts else None,
            "market_time": (res.get("meta") or {}).get("regularMarketTime"),
        },
    }


def collect_intraday(ctx) -> dict:
    """USD/VND từ Yahoo: nến 1 phút (7 ngày gần nhất) và nến 5 phút (1 tháng) để vẽ và mô phỏng từng ngày.
    Chỉ bỏ nến có close = null do Yahoo trả về, không lọc nến giá không đổi. Một khung lỗi thì dùng khung còn lại;
    cả hai lỗi thì báo lỗi nguồn."""
    raw: dict = {"grid": {}, "api": {}}
    errs = []
    for tag, rng, itv in (("y5", "1mo", "5m"), ("y1", "7d", "1m")):
        try:
            a = audit_yahoo(http_get(YAHOO_URL, params={"range": rng, "interval": itv}, headers=BROWSER_UA))
        except Exception as e:  # noqa: BLE001
            errs.append(f"{itv}: {e}")
            continue
        raw[tag] = a["points"]
        raw["grid"][tag] = a["grid"]
        raw["api"][tag] = {"interval": itv, "range": rng, **a["audit"]}
    if "y5" not in raw and "y1" not in raw:
        raise RuntimeError("; ".join(errs))
    times = [v["market_time"] for v in raw["api"].values() if v.get("market_time")]
    raw["last_market_ts"] = max(times) if times else None
    return {"tables": {"intraday_raw": raw}, "warnings": errs}
