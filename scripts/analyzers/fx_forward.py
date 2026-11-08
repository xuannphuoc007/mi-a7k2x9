"""Giá kỳ hạn USD/VND 1 tháng.

Không có nguồn công khai miễn phí cho giá forward do ngân hàng yết. Hai con số được tách riêng:
  - usdvnd_fwd_1m_quote   : giá nhập tay từ ngân hàng / Reuters / Bloomberg (nếu có)
  - usdvnd_fwd_1m_implied : giá tính theo ngang giá lãi suất có bảo hiểm (CIP), KHÔNG phải giá yết

    F = S × (1 + r_VND × d/365) / (1 + r_USD × d/360),  d = số ngày của kỳ hạn
"""
from __future__ import annotations

from ..common import metric


def _val(snap: dict, key: str):
    m = snap["metrics"].get(key) or {}
    return m.get("value"), m


def implied(spot: float, r_vnd_pct: float, r_usd_pct: float, days: int = 30) -> float:
    return spot * (1 + r_vnd_pct / 100 * days / 365) / (1 + r_usd_pct / 100 * days / 360)


def build(snap: dict, settings: dict) -> dict:
    """Trả {metrics, table}. Thiếu đầu vào nào thì không tính, ghi rõ lý do."""
    cfg = settings.get("forward", {})
    days = int(cfg.get("tenor_days", 30))
    spot_keys = cfg.get("spot_priority", ["usdvnd_interbank"])
    vnd_keys = cfg.get("vnd_rate_priority", ["interbank_vnd_1m_rate"])
    usd_keys = cfg.get("usd_rate_priority", ["interbank_usd_1m_rate"])

    def pick(keys):
        for k in keys:
            v, m = _val(snap, k)
            if v is not None and m.get("quality") in ("ok", "manual"):
                return k, v, m
        return None, None, None

    sk, spot, sm = pick(spot_keys)
    vk, rv, vm = pick(vnd_keys)
    uk, ru, um = pick(usd_keys)
    missing = [n for n, x in (("tỷ giá spot", sk), ("lãi suất VND", vk), ("lãi suất USD", uk)) if x is None]
    table = {"tenor_days": days, "spot_key": sk, "vnd_rate_key": vk, "usd_rate_key": uk,
             "spot": spot, "r_vnd": rv, "r_usd": ru, "implied": None, "points": None,
             "quote": None, "quote_vs_implied": None, "missing": missing, "caveats": []}
    metrics = {}
    if missing:
        metrics["usdvnd_fwd_1m_implied"] = metric(
            "USD/VND kỳ hạn 1 tháng (tính theo CIP)", None, "VND", "Tính từ spot và lãi suất", None,
            quality="missing", note="Chưa tính được vì thiếu: " + ", ".join(missing))
        return {"metrics": metrics, "table": table}
    f = implied(spot, rv, ru, days)
    table.update(implied=round(f, 2), points=round(f - spot, 2))
    if sk != "usdvnd_interbank":
        table["caveats"].append("Spot không phải giá liên ngân hàng.")
    if vk != "interbank_vnd_1m_rate":
        table["caveats"].append("Lãi suất VND không phải kỳ hạn 1 tháng.")
    if uk != "interbank_usd_1m_rate":
        table["caveats"].append("Lãi suất USD không phải kỳ hạn 1 tháng liên ngân hàng trong nước.")
    table["inputs"] = [{"key": k, "label": m.get("label"), "value": v, "period": m.get("period"), "source": m.get("source")}
                       for k, v, m in ((sk, spot, sm), (vk, rv, vm), (uk, ru, um))]
    dates = sorted({m.get("period") for m in (sm, vm, um) if m.get("period")})
    if len(dates) > 1:
        table["caveats"].append("Các đầu vào thuộc các ngày khác nhau: " + ", ".join(dates) + ".")
    ts = max((m.get("timestamp") or "") for m in (sm, vm, um)) or None
    metrics["usdvnd_fwd_1m_implied"] = metric(
        "USD/VND kỳ hạn 1 tháng (tính theo CIP)", round(f, 2), "VND", "Tính từ spot và lãi suất", ts,
        kind="reference", note="Giá lý thuyết theo chênh lệch lãi suất 1 tháng, không phải giá ngân hàng yết. "
        + " ".join(table["caveats"]))
    metrics["usdvnd_fwd_1m_points"] = metric(
        "Điểm swap 1 tháng (tính)", round(f - spot, 2), "VND", "Tính từ spot và lãi suất", ts, kind="reference",
        note="Kỳ hạn trừ spot, dương nghĩa là VND giảm giá theo chênh lệch lãi suất")
    q, qm = _val(snap, "usdvnd_fwd_1m_quote")
    if q is not None:
        table["quote"] = q
        table["quote_vs_implied"] = round(q - f, 2)
    return {"metrics": metrics, "table": table}
