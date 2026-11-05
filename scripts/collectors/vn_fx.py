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
