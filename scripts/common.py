"""Tiện ích dùng chung: HTTP có retry/timeout, thời gian UTC+7, chuẩn hoá chỉ số."""
from __future__ import annotations

import datetime as dt
import logging
import os
import time
from typing import Any

import requests

VN_TZ = dt.timezone(dt.timedelta(hours=7))
USER_AGENT = "MarketIntelligenceDashboard/1.0 (+https://github.com)"
log = logging.getLogger("mi")


class FetchError(Exception):
    """Lỗi khi gọi nguồn dữ liệu (HTTP, timeout, JSON hỏng)."""


def _request(method: str, url: str, *, params=None, json_body=None, headers=None,
             timeout: float = 20, retries: int = 3, as_text: bool = False,
             as_bytes: bool = False) -> Any:
    h = {"User-Agent": USER_AGENT, "Accept": "application/json, text/plain, */*"}
    if headers:
        h.update(headers)
    last: Exception | None = None
    for attempt in range(retries):
        try:
            r = requests.request(method, url, params=params, json=json_body,
                                 headers=h, timeout=timeout)
            if r.status_code == 429 or r.status_code >= 500:
                last = FetchError(f"HTTP {r.status_code} từ {url}")
                time.sleep(min(2 ** attempt * 3, 20))
                continue
            if r.status_code != 200:
                raise FetchError(f"HTTP {r.status_code} từ {url}")
            if as_bytes:
                return r.content
            return r.text if as_text else r.json()
        except FetchError:
            raise
        except (requests.RequestException, ValueError) as e:
            last = FetchError(f"{type(e).__name__}: {e}")
            time.sleep(2 ** attempt)
    raise last or FetchError(f"Không gọi được {url}")


def http_get(url: str, **kw) -> Any:
    return _request("GET", url, **kw)


def http_post(url: str, body: dict, **kw) -> Any:
    return _request("POST", url, json_body=body, **kw)


def env(name: str) -> str | None:
    v = os.environ.get(name, "").strip()
    return v or None


def now_vn() -> dt.datetime:
    return dt.datetime.now(VN_TZ).replace(microsecond=0)


def iso_vn(t: dt.datetime) -> str:
    if t.tzinfo is None:
        t = t.replace(tzinfo=dt.timezone.utc)
    return t.astimezone(VN_TZ).replace(microsecond=0).isoformat()


def ms_to_iso(ms: int | float | str) -> str:
    return iso_vn(dt.datetime.fromtimestamp(int(float(ms)) / 1000, dt.timezone.utc))


def s_to_iso(s: int | float | str) -> str:
    return iso_vn(dt.datetime.fromtimestamp(int(float(s)), dt.timezone.utc))


def date_to_iso(d: str) -> str:
    """'2026-11-04' -> ISO tại 00:00 UTC+7."""
    return dt.datetime.fromisoformat(d).replace(tzinfo=VN_TZ).isoformat()


def to_float(v: Any) -> float | None:
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().replace(",", "")
    if s in ("", ".", "-", "N/A", "null"):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def metric(label: str, value: float | None, unit: str, source: str, timestamp: str | None,
           *, quality: str | None = None, note: str | None = None,
           change_24h: float | None = None, change_7d: float | None = None,
           change_30d: float | None = None, kind: str | None = None,
           period: str | None = None) -> dict:
    """Chỉ số chuẩn: luôn có value/unit/source/timestamp/quality.

    quality: ok | stale | missing | error | manual | warning
    kind: phân loại giá (reference | bid | ask | mid | executable | index | ...)
    """
    if quality is None:
        quality = "missing" if value is None else "ok"
    m = {"label": label, "value": value, "unit": unit, "source": source,
         "timestamp": timestamp, "quality": quality}
    for k, v in (("note", note), ("change_24h", change_24h), ("change_7d", change_7d),
                 ("change_30d", change_30d), ("kind", kind), ("period", period)):
        if v is not None:
            m[k] = v
    return m


def missing(label: str, unit: str, source: str, note: str) -> dict:
    return metric(label, None, unit, source, None, quality="missing", note=note)


def pct_change(new: float | None, old: float | None) -> float | None:
    if new is None or old in (None, 0):
        return None
    return (new / old - 1) * 100
