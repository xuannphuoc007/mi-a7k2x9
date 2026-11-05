"""Phái sinh — OKX public API v5 (không cần key).

Chỉ số lấy từ MỘT sàn (OKX), không phải toàn thị trường. Dữ liệu toàn thị trường
(liquidation, OI tổng hợp) cần nguồn trả phí nên không hiển thị.

Volume Delta / CVD: dùng endpoint taker-volume của OKX, nơi volume đã được phân loại
theo bên chủ động (taker buy / taker sell), nên được phép tính delta và cộng dồn.
"""
from __future__ import annotations

from ..common import http_get, metric, missing, ms_to_iso, to_float

API = "https://www.okx.com/api/v5"
SRC = "OKX"
COINS = ("BTC", "ETH", "SOL", "XRP", "BNB")


def _data(path: str, params: dict) -> list:
    j = http_get(f"{API}{path}", params=params)
    if str(j.get("code")) != "0":
        raise RuntimeError(f"OKX {path} code={j.get('code')} msg={j.get('msg')}")
    return j.get("data") or []


def collect(ctx) -> dict:
    metrics: dict[str, dict] = {}
    series: dict[str, dict] = {}
    errors: list[str] = []
    for c in COINS:
        k = c.lower()
        inst = f"{c}-USDT-SWAP"
        # --- Funding ---
        try:
            fr = _data("/public/funding-rate", {"instId": inst})[0]
            v = to_float(fr.get("fundingRate"))
            metrics[f"{k}_funding"] = metric(
                f"{c} Funding Rate (kỳ hiện tại)", v * 100 if v is not None else None, "%/kỳ 8h",
                f"{SRC} {inst}", ms_to_iso(fr.get("ts") or fr.get("fundingTime")),
                note="Funding của perpetual USDT-margined trên OKX")
            hist = _data("/public/funding-rate-history", {"instId": inst, "limit": 100})
            pts = sorted(([int(h["fundingTime"]) // 1000, to_float(h.get("realizedRate") or h.get("fundingRate")) * 100]
                          for h in hist if to_float(h.get("realizedRate") or h.get("fundingRate")) is not None),
                         key=lambda p: p[0])
            series[f"{k}_funding"] = {"label": f"{c} Funding (realized)", "unit": "%",
                                      "source": f"{SRC} {inst}", "points": pts}
        except Exception as e:  # noqa: BLE001
            errors.append(f"{c} funding: {e}")
            metrics[f"{k}_funding"] = missing(f"{c} Funding Rate", "%", SRC, f"Lỗi nguồn: {e}")

        # --- Open interest ---
        try:
            oi = _data("/public/open-interest", {"instType": "SWAP", "instId": inst})[0]
            oi_usd = to_float(oi.get("oiUsd"))
            note = "OI của hợp đồng perpetual USDT trên OKX"
            unit = "USD"
            if oi_usd is None:
                oi_usd, unit = to_float(oi.get("oiCcy")), c
                note += " (OKX không trả oiUsd, hiển thị theo số coin)"
            metrics[f"{k}_oi"] = metric(f"{c} Open Interest (OKX {inst})", oi_usd, unit,
                                        SRC, ms_to_iso(oi["ts"]), note=note)
            rows = _data("/rubik/stat/contracts/open-interest-volume", {"ccy": c, "period": "1D"})
            pts = sorted(([int(r[0]) // 1000, to_float(r[1])] for r in rows if to_float(r[1]) is not None),
                         key=lambda p: p[0])
            series[f"{k}_oi"] = {"label": f"{c} OI (OKX, mọi hợp đồng)", "unit": "USD",
                                 "source": f"{SRC} rubik", "points": pts}
            if len(pts) >= 8:
                last = pts[-1][1]
                metrics[f"{k}_oi"]["change_24h"] = (last / pts[-2][1] - 1) * 100 if pts[-2][1] else None
                metrics[f"{k}_oi"]["change_7d"] = (last / pts[-8][1] - 1) * 100 if pts[-8][1] else None
        except Exception as e:  # noqa: BLE001
            errors.append(f"{c} OI: {e}")
            metrics.setdefault(f"{k}_oi", missing(f"{c} Open Interest", "USD", SRC, f"Lỗi nguồn: {e}"))

        # --- Long/Short account ratio ---
        try:
            rows = _data("/rubik/stat/contracts/long-short-account-ratio", {"ccy": c, "period": "1D"})
            pts = sorted(([int(r[0]) // 1000, to_float(r[1])] for r in rows if to_float(r[1]) is not None),
                         key=lambda p: p[0])
            series[f"{k}_ls_ratio"] = {"label": f"{c} Long/Short account ratio", "unit": "lần",
                                       "source": f"{SRC} rubik", "points": pts}
            if pts:
                metrics[f"{k}_ls_ratio"] = metric(
                    f"{c} Long/Short Ratio (tài khoản)", pts[-1][1], "lần", f"{SRC} rubik",
                    ms_to_iso(pts[-1][0] * 1000),
                    change_24h=(pts[-1][1] - pts[-2][1]) if len(pts) > 1 else None,
                    note="Tỷ lệ số tài khoản long / short trên OKX, không phải khối lượng vị thế")
                metrics[f"{k}_ls_ratio"]["change_unit"] = "lần"
        except Exception as e:  # noqa: BLE001
            errors.append(f"{c} L/S: {e}")
            metrics[f"{k}_ls_ratio"] = missing(f"{c} Long/Short Ratio", "lần", SRC, f"Lỗi nguồn: {e}")

        # --- Taker volume -> Volume delta / CVD ---
        try:
            rows = _data("/rubik/stat/taker-volume", {"ccy": c, "instType": "CONTRACTS", "period": "1D"})
            parsed = sorted(([int(r[0]) // 1000, to_float(r[1]), to_float(r[2])] for r in rows
                             if to_float(r[1]) is not None and to_float(r[2]) is not None),
                            key=lambda p: p[0])  # [ts, sellVol, buyVol]
            delta = [[t, b - s] for t, s, b in parsed]
            cvd, acc = [], 0.0
            for t, d in delta:
                acc += d
                cvd.append([t, acc])
            unit = "theo đơn vị OKX"
            series[f"{k}_volume_delta"] = {"label": f"{c} Volume Delta (taker buy − sell)", "unit": unit,
                                           "source": f"{SRC} rubik taker-volume", "points": delta}
            series[f"{k}_cvd"] = {"label": f"{c} CVD (cộng dồn trong cửa sổ dữ liệu)", "unit": unit,
                                  "source": f"{SRC} rubik taker-volume", "points": cvd}
            if delta:
                metrics[f"{k}_volume_delta"] = metric(
                    f"{c} Volume Delta ngày gần nhất", delta[-1][1], unit, f"{SRC} rubik",
                    ms_to_iso(delta[-1][0] * 1000),
                    note="Taker buy − taker sell trên hợp đồng OKX. Đơn vị theo OKX trả về; so sánh theo dấu và độ lớn tương đối.")
        except Exception as e:  # noqa: BLE001
            errors.append(f"{c} taker: {e}")
            metrics[f"{k}_volume_delta"] = missing(f"{c} Volume Delta", "", SRC, f"Lỗi nguồn: {e}")

        # --- Perp basis (mark vs index) ---
        try:
            mk = _data("/public/mark-price", {"instType": "SWAP", "instId": inst})[0]
            ix = _data("/market/index-tickers", {"instId": f"{c}-USDT"})[0]
            mpx, ipx = to_float(mk.get("markPx")), to_float(ix.get("idxPx"))
            basis = (mpx / ipx - 1) * 100 if mpx and ipx else None
            metrics[f"{k}_basis"] = metric(
                f"{c} Perp Basis (mark vs index)", basis, "%", SRC, ms_to_iso(mk["ts"]),
                note="Chênh lệch mark price perpetual so với index spot trên OKX; không phải basis hợp đồng kỳ hạn quý")
        except Exception as e:  # noqa: BLE001
            errors.append(f"{c} basis: {e}")
            metrics[f"{k}_basis"] = missing(f"{c} Perp Basis", "%", SRC, f"Lỗi nguồn: {e}")

        # L/S và Volume Delta là số theo ngày, mốc thời gian là đầu ngày nên không áp ngưỡng 6 giờ
        for key in (f"{k}_ls_ratio", f"{k}_volume_delta"):
            if key in metrics:
                metrics[key]["category"] = "derivatives_daily"

    if errors and len(errors) >= len(COINS) * 5:
        raise RuntimeError("; ".join(errors[:3]))
    return {"metrics": metrics, "series": series, "warnings": errors}
