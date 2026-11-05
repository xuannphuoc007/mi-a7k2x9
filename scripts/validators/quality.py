"""Kiểm tra chất lượng dữ liệu: schema, timestamp, độ trễ, ngoại lai, trùng lặp, lệch nguồn."""
from __future__ import annotations

import datetime as dt
import math

QUALITIES = {"ok", "stale", "missing", "error", "manual", "warning"}
REQUIRED = ("label", "value", "unit", "source", "timestamp", "quality")
RANGES = {  # key: (min, max)
    "btc_dominance": (0, 100), "eth_dominance": (0, 100), "fear_greed": (0, 100),
    "usdt_price": (0.8, 1.2), "usdc_price": (0.8, 1.2),
    "usdvnd_vcb_sell": (15000, 40000), "usdvnd_vcb_buy_transfer": (15000, 40000),
    "usdvnd_vcb_buy_cash": (15000, 40000), "sbv_central_rate": (15000, 40000),
    "usdtvnd_p2p_bid": (15000, 40000), "usdtvnd_p2p_ask": (15000, 40000),
    "usdvnd_free_buy": (15000, 40000), "usdvnd_free_sell": (15000, 40000),
    "usdvnd_bidv_sell": (15000, 40000), "usdvnd_tcb_sell": (15000, 40000),
    "dgs2": (-2, 25), "dgs10": (-2, 25), "dff": (-1, 25), "unrate": (0, 40),
}


def parse_ts(ts: str | None) -> dt.datetime | None:
    if not ts:
        return None
    try:
        t = dt.datetime.fromisoformat(ts)
        return t if t.tzinfo else t.replace(tzinfo=dt.timezone.utc)
    except ValueError:
        return None


def check_metric(key: str, m: dict) -> list[str]:
    errs = [f"{key}: thiếu trường '{f}'" for f in REQUIRED if f not in m]
    if errs:
        return errs
    v = m["value"]
    if v is not None and (not isinstance(v, (int, float)) or isinstance(v, bool) or math.isnan(v) or math.isinf(v)):
        errs.append(f"{key}: value không phải số hợp lệ ({v!r})")
    if m["quality"] not in QUALITIES:
        errs.append(f"{key}: quality không hợp lệ ({m['quality']})")
    if v is None and m["quality"] not in ("missing", "error"):
        errs.append(f"{key}: value rỗng nhưng quality = {m['quality']}")
    if v is not None and parse_ts(m["timestamp"]) is None:
        errs.append(f"{key}: timestamp không hợp lệ ({m['timestamp']!r})")
    return errs


def apply_quality(snap: dict, settings: dict, now: dt.datetime) -> list[str]:
    """Đánh dấu stale/warning tại chỗ; trả về danh sách cảnh báo để ghi log & hiển thị."""
    warns: list[str] = []
    limits = settings.get("staleness_hours", {})
    metrics = snap.get("metrics", {})
    for key, m in metrics.items():
        v = m.get("value")
        if v is None:
            continue
        t = parse_ts(m.get("timestamp"))
        cat = m.get("category")
        lim = limits.get(cat)
        if t and t > now + dt.timedelta(hours=1):
            m["quality"] = "warning"
            m["note"] = (m.get("note", "") + " | Timestamp ở tương lai").strip(" |")
            warns.append(f"{key}: timestamp ở tương lai")
        elif t and lim and (now - t).total_seconds() > lim * 3600 and m["quality"] in ("ok", "manual"):
            age_h = (now - t).total_seconds() / 3600
            m["quality"] = "stale"
            m["note"] = (m.get("note", "") + f" | Dữ liệu cũ {age_h:.0f} giờ (ngưỡng {lim} giờ)").strip(" |")
            warns.append(f"{key}: cũ {age_h:.0f}h")
        rng = RANGES.get(key)
        if rng and not (rng[0] <= v <= rng[1]):
            m["quality"] = "warning"
            m["note"] = (m.get("note", "") + f" | Ngoài khoảng hợp lý {rng}").strip(" |")
            warns.append(f"{key}: ngoài khoảng {rng} ({v})")

    tol = settings.get("cross_source_tolerance_pct", 1.0)
    for sym in ("btc", "eth", "sol", "xrp", "bnb"):
        a, b = metrics.get(f"{sym}_price"), metrics.get(f"{sym}_binance_last")
        if a and b and a.get("value") and b.get("value"):
            diff = abs(a["value"] / b["value"] - 1) * 100
            if diff > tol:
                for m in (a, b):
                    m["quality"] = "warning"
                    m["note"] = (m.get("note", "") + f" | Lệch {diff:.2f}% giữa CoinGecko và Binance").strip(" |")
                warns.append(f"{sym}: CoinGecko vs Binance lệch {diff:.2f}%")
    return warns


def clean_series(snap: dict) -> None:
    """Sắp xếp theo thời gian, bỏ điểm trùng timestamp và giá trị không hợp lệ."""
    for s in snap.get("series", {}).values():
        seen: dict[int, float] = {}
        for t, v in s.get("points", []):
            if v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v))):
                continue
            seen[int(t)] = v
        s["points"] = [[t, seen[t]] for t in sorted(seen)]
    for c in snap.get("candles", {}).values():
        for tf in ("1d", "1h"):
            rows = {r["time"]: r for r in c.get(tf, []) if r["high"] >= r["low"] > 0}
            c[tf] = [rows[t] for t in sorted(rows)]


def check_snapshot(snap: dict) -> list[str]:
    """Kiểm tra schema snapshot — dùng trong CI và trước khi ghi file."""
    errs = []
    for f in ("schema_version", "generated_at", "date", "run", "metrics", "sources"):
        if f not in snap:
            errs.append(f"snapshot thiếu '{f}'")
    for k, m in (snap.get("metrics") or {}).items():
        errs += check_metric(k, m)
    for k, s in (snap.get("series") or {}).items():
        for f in ("label", "unit", "source", "points"):
            if f not in s:
                errs.append(f"series {k}: thiếu '{f}'")
    for s in snap.get("sources", []):
        for f in ("id", "name", "status"):
            if f not in s:
                errs.append(f"source thiếu '{f}'")
    return errs
