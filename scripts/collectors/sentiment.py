"""Fear & Greed Index — alternative.me (không cần key)."""
from __future__ import annotations

from ..common import http_get, metric, s_to_iso, to_float

URL = "https://api.alternative.me/fng/"
SRC = "Alternative.me Crypto Fear & Greed"


def collect(ctx) -> dict:
    data = http_get(URL, params={"limit": 120})["data"]
    pts = sorted(([int(d["timestamp"]), to_float(d["value"])] for d in data), key=lambda x: x[0])
    latest = data[0]
    v = to_float(latest["value"])
    prev = to_float(data[1]["value"]) if len(data) > 1 else None
    prev7 = to_float(data[7]["value"]) if len(data) > 7 else None
    m = metric("Fear & Greed Index", v, "điểm (0-100)", SRC, s_to_iso(latest["timestamp"]),
               note=f"Phân loại: {latest.get('value_classification', '')}",
               change_24h=(v - prev) if v is not None and prev is not None else None,
               change_7d=(v - prev7) if v is not None and prev7 is not None else None)
    m["change_unit"] = "điểm"
    return {"metrics": {"fear_greed": m},
            "series": {"fear_greed": {"label": "Fear & Greed", "unit": "điểm", "source": SRC,
                                      "points": [[t, val] for t, val in pts]}}}
