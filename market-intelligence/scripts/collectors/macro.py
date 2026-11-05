"""Vĩ mô Mỹ — FRED (St. Louis Fed).

Mặc định tải CSV công khai (fredgraph.csv) không cần key. Nếu có FRED_API_KEY thì dùng
API chính thức (ổn định hơn). DXY (ICE) không có trên FRED; dùng Nominal Broad U.S. Dollar
Index (DTWEXBGS) làm chỉ số đô la thay thế và ghi rõ trên giao diện.
"""
from __future__ import annotations

import csv
import datetime as dt
import io
import json
from pathlib import Path

from ..common import date_to_iso, env, http_get, metric, missing, to_float

SRC = "FRED (St. Louis Fed)"
DAILY = {
    "DFEDTARU": ("Fed Funds Target — cận trên", "%"),
    "DFEDTARL": ("Fed Funds Target — cận dưới", "%"),
    "DFF": ("Effective Federal Funds Rate", "%"),
    "DGS2": ("US Treasury 2Y", "%"),
    "DGS10": ("US Treasury 10Y", "%"),
    "T10Y2Y": ("Spread 10Y − 2Y", "%"),
    "DTWEXBGS": ("Nominal Broad USD Index (thay thế DXY)", "điểm"),
}
MONTHLY = {
    "CPIAUCSL": ("CPI (YoY)", "yoy"),
    "CPILFESL": ("Core CPI (YoY)", "yoy"),
    "PCEPI": ("PCE (YoY)", "yoy"),
    "PCEPILFE": ("Core PCE (YoY)", "yoy"),
    "PAYEMS": ("Nonfarm Payrolls (thay đổi tháng)", "diff"),
    "UNRATE": ("Unemployment Rate", "level"),
}
RELEASE = {
    "CPIAUCSL": "BLS — CPI", "CPILFESL": "BLS — CPI", "PCEPI": "BEA — Personal Income and Outlays",
    "PCEPILFE": "BEA — Personal Income and Outlays", "PAYEMS": "BLS — Employment Situation",
    "UNRATE": "BLS — Employment Situation",
}


def fetch_series(sid: str, start: str) -> list[tuple[str, float]]:
    key = env("FRED_API_KEY")
    if key:
        j = http_get("https://api.stlouisfed.org/fred/series/observations", params={
            "series_id": sid, "api_key": key, "file_type": "json", "observation_start": start})
        rows = [(o["date"], to_float(o["value"])) for o in j["observations"]]
    else:
        text = http_get("https://fred.stlouisfed.org/graph/fredgraph.csv",
                        params={"id": sid, "cosd": start}, as_text=True)
        reader = csv.reader(io.StringIO(text))
        next(reader, None)
        rows = [(r[0], to_float(r[1])) for r in reader if len(r) >= 2]
    return [(d, v) for d, v in rows if v is not None]


def _epoch(d: str) -> int:
    return int(dt.datetime.fromisoformat(d).replace(tzinfo=dt.timezone.utc).timestamp())


def collect(ctx) -> dict:
    today = dt.date.today()
    start_daily = (today - dt.timedelta(days=400)).isoformat()
    start_monthly = (today - dt.timedelta(days=800)).isoformat()
    metrics, series, errors = {}, {}, []

    for sid, (label, unit) in DAILY.items():
        try:
            rows = fetch_series(sid, start_daily)
            if not rows:
                raise RuntimeError("không có quan sát")
            d, v = rows[-1]
            prev = rows[-2][1] if len(rows) > 1 else None
            back7 = [x for x in rows if x[0] <= (dt.date.fromisoformat(d) - dt.timedelta(days=7)).isoformat()]
            back7v = back7[-1][1] if back7 else None
            if unit == "%":
                ch24, ch7 = ((v - prev) * 100 if prev is not None else None,
                             (v - back7v) * 100 if back7v is not None else None)
                note = "change_24h / change_7d tính theo điểm cơ bản (bp) so với quan sát trước"
            else:
                ch24 = (v / prev - 1) * 100 if prev else None
                ch7 = (v / back7v - 1) * 100 if back7v else None
                note = None
            metrics[sid.lower()] = metric(label, v, unit, f"{SRC} {sid}", date_to_iso(d),
                                          change_24h=ch24, change_7d=ch7, note=note,
                                          period=d)
            if unit == "%":
                metrics[sid.lower()]["change_unit"] = "bp"
            series[sid.lower()] = {"label": label, "unit": unit, "source": f"{SRC} {sid}",
                                   "points": [[_epoch(dd), vv] for dd, vv in rows[-260:]]}
        except Exception as e:  # noqa: BLE001
            errors.append(f"{sid}: {e}")
            metrics[sid.lower()] = missing(label, unit, f"{SRC} {sid}", f"Lỗi nguồn: {e}")

    for sid, (label, mode) in MONTHLY.items():
        try:
            rows = fetch_series(sid, start_monthly)
            if len(rows) < 13 and mode == "yoy":
                raise RuntimeError("không đủ 13 tháng để tính YoY")
            d, v = rows[-1]
            if mode == "yoy":
                val, unit = (v / rows[-13][1] - 1) * 100, "% YoY"
                prev = (rows[-2][1] / rows[-14][1] - 1) * 100 if len(rows) >= 14 else None
                pts = [[_epoch(rows[i][0]), (rows[i][1] / rows[i - 12][1] - 1) * 100]
                       for i in range(12, len(rows))]
            elif mode == "diff":
                val, unit = (v - rows[-2][1]), "nghìn việc làm"
                prev = rows[-2][1] - rows[-3][1] if len(rows) >= 3 else None
                pts = [[_epoch(rows[i][0]), rows[i][1] - rows[i - 1][1]] for i in range(1, len(rows))]
            else:
                val, unit = v, "%"
                prev = rows[-2][1] if len(rows) >= 2 else None
                pts = [[_epoch(dd), vv] for dd, vv in rows]
            metrics[sid.lower()] = metric(
                label, val, unit, f"{SRC} {sid}", date_to_iso(d), period=d[:7],
                change_24h=None,
                note=(f"Kỳ tham chiếu {d[:7]}. Nguồn gốc: {RELEASE[sid]}. "
                      f"Kỳ trước: {prev:.2f}. " if prev is not None else f"Kỳ tham chiếu {d[:7]}. ")
                     + "Ngày công bố và kỳ vọng thị trường: chưa có nguồn miễn phí, xem lịch BLS/BEA.")
            series[sid.lower()] = {"label": label, "unit": unit, "source": f"{SRC} {sid}",
                                   "points": pts[-24:]}
        except Exception as e:  # noqa: BLE001
            errors.append(f"{sid}: {e}")
            metrics[sid.lower()] = missing(label, "", f"{SRC} {sid}", f"Lỗi nguồn: {e}")

    metrics["dxy"] = missing("DXY (ICE U.S. Dollar Index)", "điểm", "—",
                             "Chưa có dữ liệu: DXY là chỉ số độc quyền của ICE, không có API miễn phí hợp lệ. "
                             "Xem Nominal Broad USD Index (FRED DTWEXBGS) làm chỉ báo thay thế.")
    if len(errors) == len(DAILY) + len(MONTHLY):
        raise RuntimeError("; ".join(errors[:3]))
    return {"metrics": metrics, "series": series, "warnings": errors}


def fomc_schedule(config_dir: Path, today: dt.date) -> dict:
    cfg = json.loads((config_dir / "fomc.json").read_text(encoding="utf-8"))
    meetings = cfg["meetings"]
    upcoming = [m for m in meetings if m["end"] >= today.isoformat()]
    past = [m for m in meetings if m["end"] < today.isoformat()]
    return {"source": cfg["source"], "next": upcoming[0] if upcoming else None,
            "last": past[-1] if past else None, "upcoming": upcoming[:6]}
