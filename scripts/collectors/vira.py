"""Bản tin Kinh tế - Tài chính ngày của VIRA (Hội Nghiên cứu thị trường liên ngân hàng Việt Nam,
nội dung do MSB Research soạn).

Lấy những số NHNN không công bố trên trang công khai:
  - USD/VND liên ngân hàng: giá chốt phiên
  - Lãi suất bình quân liên ngân hàng USD: qua đêm (ON) và 1 tháng (1M)
Bản tin sáng nay chứa số của phiên làm việc trước đó; không phải ngày nào cũng có bản tin.
Ngày ghi kèm mỗi số là ngày PHIÊN, không phải ngày đăng bản tin.
"""
from __future__ import annotations

import datetime as dt
import html
import re

from ..common import date_to_iso, http_get, metric

BASE = "https://vira.org.vn"
LIST_URL = f"{BASE}/tin/Ban-tin-Kinh-te-Tai-chinh-ngay.html"
SRC = "VIRA, Bản tin Kinh tế - Tài chính ngày (MSB Research)"
_LINK = re.compile(r'href="(/tin/Ban-tin-Kinh-te-Tai-chinh-ngay/Ban-tin-Kinh-te-Tai-chinh-ngay-(\d{2})-(\d{2})-(\d{4})-?\.html)"')
_NUM = r"(\d+(?:,\d+)?)"
_SEP = r"%?\s*[;,]?\s*(?:và\s*)?"


def text(page: str) -> str:
    page = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", page)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"(?s)<[^>]+>", " ", page)))


def links(list_page: str) -> list[tuple[str, dt.date]]:
    """Các bản tin trong trang danh sách, mới nhất trước."""
    found = {(dt.date(int(y), int(m), int(d)), path) for path, d, m, y in _LINK.findall(list_page)}
    if not found:
        raise RuntimeError("VIRA: không thấy bản tin nào trong trang danh sách (giao diện có thể đã đổi)")
    return [(BASE + path, day) for day, path in sorted(found, reverse=True)]


def latest_link(list_page: str) -> tuple[str, dt.date]:
    return links(list_page)[0]


def _rate(s: str) -> float:
    return float(s.replace(",", "."))


def _day(dd: str, mm: str, published: dt.date) -> dt.date:
    """Bản tin chỉ ghi ngày/tháng. Năm lấy theo ngày đăng; phiên tháng 12 trong bản tin tháng 1 thuộc năm trước."""
    year = published.year - 1 if int(mm) > published.month else published.year
    return dt.date(year, int(mm), int(dd))


def parse(page: str, published: dt.date) -> dict:
    t = text(page)
    out: dict = {}
    fx = re.search(r"Phiên (\d{2})/(\d{2}), NHNN niêm yết tỷ giá trung tâm ở mức ([\d.]+) VND/USD", t)
    lnh = re.search(r"thị trường LNH, tỷ giá chốt phiên (?:với|ở) mức ([\d.]+) VND/USD", t)
    if fx and lnh:
        out["fx_session"] = _day(fx.group(1), fx.group(2), published)
        out["interbank_close"] = float(lnh.group(1).replace(".", ""))
        out["central"] = float(fx.group(3).replace(".", ""))
    for cur in ("VND", "USD"):
        m = re.search(rf"Ngày (\d{{2}})/(\d{{2}}), lãi suất bình quân LNH VND", t) if cur == "VND" else None
        r = re.search(rf"[Ll]ãi suất bình quân LNH {cur}[^:]*?giao dịch tại:\s*ON {_NUM}{_SEP}1W {_NUM}{_SEP}2W {_NUM}{_SEP}1M {_NUM}", t)
        if r:
            out[f"{cur.lower()}_rates"] = {"ON": _rate(r.group(1)), "1W": _rate(r.group(2)),
                                           "2W": _rate(r.group(3)), "1M": _rate(r.group(4))}
            if m:
                out["rates_session"] = _day(m.group(1), m.group(2), published)
    if "rates_session" not in out and "usd_rates" in out:
        out["rates_session"] = out.get("fx_session")
    if "interbank_close" not in out and "usd_rates" not in out:
        raise RuntimeError("VIRA: bản tin không có số liên ngân hàng (cách viết có thể đã đổi)")
    return out


MAX_BULLETINS = 5


def collect(ctx) -> dict:
    """Mỗi nhóm số lấy từ bản tin mới nhất có nhóm số đó, xét tối đa 5 bản gần nhất."""
    p: dict = {}
    url = published = None
    errors = []
    for link, day in links(http_get(LIST_URL, as_text=True, headers={"Accept": "text/html"}))[:MAX_BULLETINS]:
        try:
            got = parse(http_get(link, as_text=True, headers={"Accept": "text/html"}), day)
        except Exception as e:  # noqa: BLE001
            errors.append(f"{day:%d/%m}: {e}")
            continue
        if url is None:
            url, published = link, day
        if "interbank_close" not in p and "interbank_close" in got:
            p.update({k: got[k] for k in ("interbank_close", "central", "fx_session")})
        if "usd_rates" not in p and "usd_rates" in got:
            p.update({k: got[k] for k in ("usd_rates", "vnd_rates", "rates_session") if k in got})
        if "interbank_close" in p and "usd_rates" in p:
            break
    if url is None:
        raise RuntimeError("VIRA: " + "; ".join(errors[:3]))
    metrics, warnings = {}, []
    if "interbank_close" in p:
        day = p["fx_session"].isoformat()
        metrics["usdvnd_interbank"] = metric(
            "USD/VND liên ngân hàng (giá chốt phiên)", p["interbank_close"], "VND", SRC, date_to_iso(day),
            kind="mid", period=day, note=f"Giá chốt phiên {p['fx_session']:%d/%m/%Y} trên thị trường liên ngân hàng")
    else:
        warnings.append("Bản tin không có giá chốt liên ngân hàng")
    usd = p.get("usd_rates")
    if usd:
        day = p["rates_session"].isoformat()
        for key, tenor, label in (("interbank_usd_overnight_rate", "ON", "qua đêm"), ("interbank_usd_1m_rate", "1M", "kỳ hạn 1 tháng")):
            metrics[key] = metric(f"Lãi suất liên ngân hàng USD {label}", usd[tenor], "%/năm", SRC, date_to_iso(day),
                                  kind="reference", period=day,
                                  note=f"Lãi suất bình quân liên ngân hàng USD, phiên {p['rates_session']:%d/%m/%Y}")
    else:
        warnings.append("Bản tin không có lãi suất liên ngân hàng USD")
    # Giữ lại số VND và tỷ giá trung tâm của bản tin để đối chiếu với số chính thức của NHNN
    table = {"url": url, "published": published.isoformat(),
             "fx_session": p.get("fx_session").isoformat() if p.get("fx_session") else None,
             "rates_session": p.get("rates_session").isoformat() if p.get("rates_session") else None,
             "central": p.get("central"), "vnd_rates": p.get("vnd_rates"), "usd_rates": usd}
    return {"metrics": metrics, "tables": {"vira": table}, "warnings": warnings}
