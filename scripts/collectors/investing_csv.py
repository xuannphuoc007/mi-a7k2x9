"""Nến ngày USD/VND từ file CSV do người dùng tự tải từ Investing.com (nhập tay, không tự động).

File: config/investing_usdvnd_daily.csv (nút "Tải xuống" ở trang dữ liệu lịch sử USD/VND).
Cột: Ngày (dd/mm/yyyy), Lần cuối (đóng), Mở, Cao, Thấp, KL, % Thay đổi; số dạng 25,785.0.

Nến ngày lấy hoàn toàn từ file. Các ngày sau lần tải gần nhất (thường là hôm nay) dựng từ điểm giá
Investing mà web ghi mỗi lần cập nhật. Yahoo/TradingView không còn dùng cho nến khi có file. Muốn cập nhật
thì tải lại file và ghi đè lên file cũ.
"""
from __future__ import annotations

import csv
import datetime as dt
import io
from pathlib import Path

CSV_PATH = Path(__file__).resolve().parents[2] / "config" / "investing_usdvnd_daily.csv"
LABEL = "Investing.com (file CSV nhập tay)"


def _num(s: str) -> float:
    return float(s.replace(",", "").strip())


def parse_csv(text: str) -> list[dict]:
    """Trả về nến ngày cũ -> mới. Dòng hỏng hoặc giá vô lý bị bỏ qua."""
    rows = csv.DictReader(io.StringIO(text.lstrip("﻿")))
    out: dict[int, dict] = {}
    for r in rows:
        try:
            day = dt.datetime.strptime((r.get("Ngày") or "").strip(), "%d/%m/%Y")
            c, o, h, lo = (_num(r[k]) for k in ("Lần cuối", "Mở", "Cao", "Thấp"))
        except (ValueError, KeyError, TypeError):
            continue
        if not all(15000 <= v <= 40000 for v in (c, o, h, lo)) or h < max(o, c) - 1e-9 or lo > min(o, c) + 1e-9:
            continue
        t = int(day.replace(tzinfo=dt.timezone.utc).timestamp())
        out[t] = {"time": t, "open": o, "high": h, "low": lo, "close": c, "volume": 0}
    return [out[t] for t in sorted(out)]


def today_candles(prev_close: float, last_t: int, ticks: list[dict]) -> list[dict]:
    """Nến các ngày SAU file CSV, dựng từ điểm giá Investing mỗi lần web cập nhật.
    Mở = đóng của nến trước; cao/thấp = lớn nhất/nhỏ nhất trong các điểm đã lấy (nên là số lấy mẫu, không phải
    cao/thấp thật của ngày); đóng = điểm mới nhất. Bỏ thứ Bảy, Chủ nhật."""
    by_day: dict[int, list[float]] = {}
    for k in sorted(ticks, key=lambda x: x["t"]):
        vn = dt.datetime.fromtimestamp(k["t"], dt.timezone(dt.timedelta(hours=7)))
        if vn.weekday() >= 5:
            continue
        t = int(dt.datetime(vn.year, vn.month, vn.day, tzinfo=dt.timezone.utc).timestamp())
        if t > last_t:
            by_day.setdefault(t, []).append(float(k["v"]))
    out, prev = [], prev_close
    for t in sorted(by_day):
        v = by_day[t]
        out.append({"time": t, "open": prev, "high": max([prev, *v]), "low": min([prev, *v]), "close": v[-1], "volume": 0})
        prev = v[-1]
    return out


def apply(snap: dict, path: Path | None = None) -> str | None:
    """Thay nến ngày USD/VND bằng nến của file CSV Investing, nối thêm nến các ngày sau file từ điểm giá Investing.
    Không còn dùng nến Yahoo/TradingView khi có file. Trả về ngày cuối của file, hoặc None nếu không dùng."""
    p = path or CSV_PATH
    if not p.exists():
        return None
    cs = parse_csv(p.read_text(encoding="utf-8"))
    if not cs:
        return None
    # Không còn nguồn nến nào khác (đã bỏ Yahoo/TradingView) nên tự tạo mục nến nếu chưa có
    entry = snap.setdefault("candles", {}).setdefault(
        "usdvnd_market", {"1d": [], "1h": [], "source": "", "unit": "VND", "volume_unit": ""})
    ticks = ((snap.get("tables") or {}).get("usdvnd_ticks") or {}).get("ticks") or []
    entry["1d"] = cs + today_candles(cs[-1]["close"], cs[-1]["time"], ticks)
    last = dt.datetime.fromtimestamp(cs[-1]["time"], dt.timezone.utc).strftime("%d/%m/%Y")
    entry["source"] = f"{LABEL} đến {last}; các ngày sau: điểm giá Investing mỗi lần web cập nhật"
    return last
