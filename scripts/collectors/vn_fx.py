"""Tỷ giá Việt Nam.

- Vietcombank: tỷ giá niêm yết công khai (mua tiền mặt, mua chuyển khoản, bán).
  Thử API JSON trên website trước, nếu lỗi dùng XML công khai cũ.
- Tỷ giá trung tâm NHNN và lãi suất liên ngân hàng: NHNN không có API công khai ổn định,
  nên đọc từ config/manual_inputs.json (nhập tay, gắn nhãn "Nhập tay").
"""
from __future__ import annotations

import datetime as dt
import json
import re
from pathlib import Path

from ..common import VN_TZ, date_to_iso, http_get, iso_vn, metric, missing, now_vn, to_float

SRC_VCB = "Vietcombank (tỷ giá niêm yết)"
VCB_JSON = "https://www.vietcombank.com.vn/api/exchangerates"
VCB_XML = "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx"
BIDV_URL = "https://bidv.com.vn/ServicesBIDV/ExchangeDetailServlet"
TCB_URL = "https://techcombank.com/content/techcombank/web/vn/vi/cong-cu-tien-ich/ty-gia/_jcr_content.exchange-rates.integration.json"
TYGIAUSD_URL = "https://tygiausd.org/"
TYGIAVN_URL = "https://tygia.vn/"


def _vcb_json(day: dt.date):
    j = http_get(VCB_JSON, params={"date": day.isoformat()})
    rows = j.get("Data") or j.get("data") or []
    usd = next((r for r in rows if str(r.get("currencyCode", r.get("CurrencyCode", ""))).upper() == "USD"), None)
    if not usd:
        raise RuntimeError("Vietcombank JSON không có USD")
    g = lambda *ks: next((to_float(usd[k]) for k in ks if k in usd), None)  # noqa: E731
    ts = j.get("UpdatedDate") or j.get("Date")
    ts_iso = iso_vn(dt.datetime.fromisoformat(ts).replace(tzinfo=VN_TZ)) if ts else iso_vn(dt.datetime.now(dt.timezone.utc))
    return g("cash", "Cash"), g("transfer", "Transfer"), g("sell", "Sell"), ts_iso


def _vcb_xml():
    text = http_get(VCB_XML, as_text=True)
    m = re.search(r'<Exrate[^>]*CurrencyCode="USD"[^>]*/>', text)
    if not m:
        raise RuntimeError("Vietcombank XML không có USD")
    attr = dict(re.findall(r'(\w+)="([^"]*)"', m.group(0)))
    dtm = re.search(r"<DateTime>([^<]+)</DateTime>", text)
    ts = iso_vn(dt.datetime.now(dt.timezone.utc))
    if dtm:
        try:
            ts = iso_vn(dt.datetime.strptime(dtm.group(1).strip(), "%m/%d/%Y %I:%M:%S %p").replace(tzinfo=VN_TZ))
        except ValueError:
            pass
    return to_float(attr.get("Buy")), to_float(attr.get("Transfer")), to_float(attr.get("Sell")), ts


def collect_vcb(ctx) -> dict:
    errs = []
    res = None
    try:
        res = _vcb_json(now_vn().date())
    except Exception as e:  # noqa: BLE001
        errs.append(f"JSON: {e}")
        try:
            res = _vcb_xml()
        except Exception as e2:  # noqa: BLE001
            errs.append(f"XML: {e2}")
    if not res:
        raise RuntimeError("; ".join(errs))
    cash, transfer, sell, ts = res
    mid = (transfer + sell) / 2 if transfer and sell else None
    m = {
        "usdvnd_vcb_buy_transfer": metric("USD/VND Vietcombank — mua chuyển khoản", transfer, "VND", SRC_VCB, ts,
                                          kind="bid", note="Giá ngân hàng MUA USD (khách bán USD) — tỷ giá niêm yết"),
        "usdvnd_vcb_buy_cash": metric("USD/VND Vietcombank — mua tiền mặt", cash, "VND", SRC_VCB, ts, kind="bid"),
        "usdvnd_vcb_sell": metric("USD/VND Vietcombank — bán", sell, "VND", SRC_VCB, ts,
                                  kind="ask", note="Giá ngân hàng BÁN USD — tỷ giá niêm yết"),
        "usdvnd_vcb_mid": metric("USD/VND Vietcombank — mid", mid, "VND", f"{SRC_VCB} (tính)", ts,
                                 kind="mid", note="Trung bình giá mua chuyển khoản và giá bán"),
    }
    return {"metrics": m, "warnings": errs}


def _fx_metrics(key: str, name: str, source: str, cash, transfer, sell, ts) -> dict:
    return {
        f"usdvnd_{key}_buy_transfer": metric(f"USD/VND {name} — mua chuyển khoản", transfer, "VND", source, ts, kind="bid"),
        f"usdvnd_{key}_buy_cash": metric(f"USD/VND {name} — mua tiền mặt", cash, "VND", source, ts, kind="bid"),
        f"usdvnd_{key}_sell": metric(f"USD/VND {name} — bán", sell, "VND", source, ts, kind="ask"),
    }


def _bidv() -> dict:
    j = http_get(BIDV_URL)
    usd = next((r for r in j.get("data", []) if r.get("currency") == "USD"), None)
    if not usd:
        raise RuntimeError("BIDV không có USD")
    return _fx_metrics("bidv", "BIDV", "BIDV (tỷ giá niêm yết)", to_float(usd.get("muaTm")),
                       to_float(usd.get("muaCk")), to_float(usd.get("ban")),
                       iso_vn(dt.datetime.now(dt.timezone.utc)))


def _techcombank() -> dict:
    rows = http_get(TCB_URL)["exchangeRate"]["data"]
    # Mệnh giá lớn (50, 100) là dòng có đủ giá chuyển khoản
    usd = next((r for r in rows if r.get("sourceCurrency") == "USD" and r.get("bidRateCK")), None)
    if not usd:
        raise RuntimeError("Techcombank không có USD")
    # inputDate ghi hậu tố Z nhưng thực tế là giờ Việt Nam
    ts = iso_vn(dt.datetime.fromisoformat(usd["inputDate"].replace("Z", "")).replace(tzinfo=VN_TZ))
    return _fx_metrics("tcb", "Techcombank", "Techcombank (tỷ giá niêm yết)", to_float(usd.get("bidRateTM")),
                       to_float(usd.get("bidRateCK")), to_float(usd.get("askRate")), ts)


def collect_banks(ctx) -> dict:
    metrics, errors = {}, []
    for name, fn in (("BIDV", _bidv), ("Techcombank", _techcombank)):
        try:
            metrics.update(fn())
        except Exception as e:  # noqa: BLE001
            errors.append(f"{name}: {e}")
    if not metrics:
        raise RuntimeError("; ".join(errors))
    return {"metrics": metrics, "warnings": errors}


def _flat(html_text: str) -> str:
    s = re.sub(r"<(script|style).*?</\1>", " ", html_text, flags=re.S | re.I)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))


def _rate(s: str) -> float:
    return float(re.sub(r"[.,]", "", s))


def parse_tygiausd(html_text: str) -> tuple[float, float]:
    m = re.search(r"chợ đen hôm nay[^:]*:\s*Mua-([\d,.]+);\s*Bán-([\d,.]+)", html_text)
    if not m:
        raise RuntimeError("tygiausd.org: không thấy giá USD chợ đen")
    return _rate(m.group(1)), _rate(m.group(2))


def parse_tygia_vn(html_text: str) -> tuple[float, float]:
    m = re.search(r"USD tự do\s+([\d,.]+)\s*/\s*([\d,.]+)", _flat(html_text))
    if not m:
        raise RuntimeError("tygia.vn: không thấy giá USD tự do")
    return _rate(m.group(1)), _rate(m.group(2))


def collect_free_market(ctx) -> dict:
    """USD chợ đen / tự do. Không có nguồn chính thức: số do các trang tỷ giá tự tổng hợp và công bố."""
    ts = iso_vn(dt.datetime.now(dt.timezone.utc))
    quotes, errors = [], []
    for name, url, parser in (("tygiausd.org", TYGIAUSD_URL, parse_tygiausd), ("tygia.vn", TYGIAVN_URL, parse_tygia_vn)):
        try:
            buy, sell = parser(http_get(url, as_text=True, headers={"Accept": "text/html"}))
            if not (15000 <= buy <= 40000 and 15000 <= sell <= 40000 and buy <= sell):
                raise RuntimeError(f"giá bất thường {buy}/{sell}")
            quotes.append({"source": name, "url": url, "buy": buy, "sell": sell, "timestamp": ts})
        except Exception as e:  # noqa: BLE001
            errors.append(f"{name}: {e}")
    if not quotes:
        raise RuntimeError("; ".join(errors))
    best = quotes[0]
    src = ", ".join(q["source"] for q in quotes)
    note = "Thị trường tự do, không có nguồn chính thức. Số do các trang tỷ giá công bố."
    if len(quotes) > 1 and abs(quotes[0]["sell"] / quotes[1]["sell"] - 1) > 0.01:
        errors.append(f"Các nguồn chợ đen lệch hơn 1%: {quotes[0]['sell']} và {quotes[1]['sell']}")
    return {"metrics": {
        "usdvnd_free_buy": metric("USD chợ đen — mua vào", best["buy"], "VND", src, ts, kind="bid", note=note),
        "usdvnd_free_sell": metric("USD chợ đen — bán ra", best["sell"], "VND", src, ts, kind="ask", note=note),
    }, "tables": {"free_market": quotes}, "warnings": errors}


def collect_manual(ctx) -> dict:
    path: Path = ctx["config_dir"] / "manual_inputs.json"
    cfg = json.loads(path.read_text(encoding="utf-8"))
    metrics = {}

    def man(key, label, unit, kind=None, note=None):
        item = cfg.get(key) or {}
        v, d = to_float(item.get("value")), item.get("date")
        if v is None or not d:
            metrics[key] = missing(label, unit, item.get("source", "Nhập tay"),
                                   "Chưa có dữ liệu: chưa nhập tay trong config/manual_inputs.json")
            return
        by = item.get("updated_by") or "không ghi"
        metrics[key] = metric(label, v, unit, f"{item.get('source', 'Nhập tay')} — nhập tay bởi {by}",
                              date_to_iso(d), quality="manual", kind=kind, note=note, period=d)

    man("sbv_central_rate", "Tỷ giá trung tâm NHNN", "VND", kind="reference",
        note="Tỷ giá tham chiếu do NHNN công bố, không phải giá giao dịch")
    man("interbank_overnight_rate", "Lãi suất LNH qua đêm (bình quân)", "%/năm")
    man("internal_usdt_inventory", "Tồn kho USDT nội bộ", "USDT")
    inv = cfg.get("internal_usdt_inventory") or {}
    notes = [n for n in cfg.get("sbv_policy_notes", []) if n.get("text")]
    return {"metrics": metrics,
            "tables": {"sbv_policy_notes": notes,
                       "inventory_target": to_float(inv.get("target"))}}
