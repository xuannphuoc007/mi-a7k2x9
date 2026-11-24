"""Nến ngày USD/VND từ file CSV do người dùng tự tải từ Investing.com (nhập tay, không tự động).

File: config/investing_usdvnd_daily.csv (nút "Tải xuống" ở trang dữ liệu lịch sử USD/VND).
Cột: Ngày (dd/mm/yyyy), Lần cuối (đóng), Mở, Cao, Thấp, KL, % Thay đổi; số dạng 25,785.0.

Ngày nào có trong file thì lấy mở/cao/thấp/đóng của file thay cho nến Yahoo. Ngày chưa có trong file
(thường là hôm nay và các ngày sau lần tải gần nhất) vẫn dùng Yahoo/TradingView. Muốn cập nhật thì tải
lại file và ghi đè lên file cũ.
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


def overlay(candles: list[dict], csv_candles: list[dict]) -> list[dict]:
    """Nến CSV thay nến cùng ngày; nến khác (Yahoo/TradingView) giữ lại và lấy giá mở = giá đóng ngày trước."""
    by_t = {c["time"]: c for c in candles}
    csv_t = {c["time"] for c in csv_candles}
    by_t.update({c["time"]: c for c in csv_candles})
    merged = [by_t[t] for t in sorted(by_t)]
    for prev, cur in zip(merged, merged[1:]):
        if cur["time"] not in csv_t:
            cur["open"] = prev["close"]
            cur["high"] = max(cur["high"], cur["open"], cur["close"])
            cur["low"] = min(cur["low"], cur["open"], cur["close"])
    return merged


def apply(snap: dict, path: Path | None = None) -> str | None:
    """Gộp CSV vào snap['candles']['usdvnd_market']['1d']. Trả về ngày cuối của file, hoặc None nếu không dùng."""
    p = path or CSV_PATH
    entry = (snap.get("candles") or {}).get("usdvnd_market")
    if not entry or not p.exists():
        return None
    cs = parse_csv(p.read_text(encoding="utf-8"))
    if not cs:
        return None
    entry["1d"] = overlay(entry.get("1d") or [], cs)
    last = dt.datetime.fromtimestamp(cs[-1]["time"], dt.timezone.utc).strftime("%d/%m/%Y")
    entry["source"] = f"{LABEL} đến {last}; các ngày sau đó: {entry.get('source', 'Yahoo Finance')}"
    return last
