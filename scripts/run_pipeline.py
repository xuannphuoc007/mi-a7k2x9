"""Pipeline hằng ngày: thu thập → kiểm tra → chuẩn hoá → tính toán → ghi JSON.

Chạy:  python -m scripts.run_pipeline [--out public/data] [--force]

Kết quả:
  <out>/latest.json                    snapshot đầy đủ (gồm chuỗi & nến cho biểu đồ)
  <out>/history/YYYY/MM/YYYY-MM-DD.json snapshot rút gọn từng ngày (không gồm chuỗi/nến)
  <out>/index.json                     danh mục ngày có dữ liệu
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import logging
import sys
import time
from pathlib import Path

from .analyzers import analytics as an
from .analyzers import digest, fx_forward, news_signal, tone
from .collectors import crypto, derivatives, macro, news, p2p, sentiment, stablecoins, vn_fx, vn_rates
from .common import VN_TZ, env, iso_vn, now_vn
from .validators.quality import apply_quality, check_snapshot, clean_series

ROOT = Path(__file__).resolve().parent.parent
log = logging.getLogger("mi")

SOURCES = [
    # id, tên, hàm, nhóm (staleness), url, key env (tuỳ chọn)
    ("coingecko", "CoinGecko — giá, vốn hoá, dominance", crypto.collect_coingecko, "crypto",
     "https://api.coingecko.com/api/v3", "COINGECKO_DEMO_KEY"),
    ("binance_spot", "Binance Spot — nến 1D/1H", crypto.collect_binance, "crypto",
     "https://data-api.binance.vision", None),
    ("okx_derivatives", "OKX — funding, OI, long/short, taker volume, basis", derivatives.collect, "derivatives",
     "https://www.okx.com/api/v5", None),
    ("fear_greed", "Alternative.me — Fear & Greed", sentiment.collect, "sentiment",
     "https://api.alternative.me/fng/", None),
    ("defillama", "DefiLlama — nguồn cung stablecoin", stablecoins.collect, "stablecoins",
     "https://stablecoins.llama.fi", None),
    ("fred", "FRED — lãi suất, lợi suất, CPI, PCE, việc làm", macro.collect, "macro",
     "https://fred.stlouisfed.org", "FRED_API_KEY"),
    ("vietcombank", "Vietcombank — tỷ giá USD/VND niêm yết", vn_fx.collect_vcb, "fx_vn",
     "https://www.vietcombank.com.vn", None),
    ("banks", "BIDV, Techcombank — tỷ giá USD/VND niêm yết", vn_fx.collect_banks, "fx_vn",
     "bidv.com.vn, techcombank.com", None),
    ("free_market", "USD chợ đen — tygiausd.org, tygia.vn", vn_fx.collect_free_market, "fx_vn",
     "https://tygiausd.org", None),
    ("sbv_rate", "NHNN — tỷ giá trung tâm, giá mua/bán", vn_rates.collect_sbv, "fx_vn",
     "https://sbv.gov.vn/vi/tỷ-giá", None),
    ("interbank_on", "NHNN — lãi suất liên ngân hàng qua đêm VND", vn_rates.collect_interbank_on, "fx_vn",
     "https://stockbiz.vn/vi-mo/du-lieu/lai-suat-lien-ngan-hang", None),
    ("market_fx", "Yahoo Finance — USD/VND thị trường quốc tế", vn_rates.collect_market_fx, "fx_vn",
     "https://finance.yahoo.com/quote/USDVND=X", None),
    ("news", "Tin tức — CNBC, BBC, Fed, CoinDesk, VnExpress, CafeF…", news.collect, "news", "RSS", None),
    ("manual", "Nhập tay — NHNN, liên ngân hàng, tồn kho nội bộ", vn_fx.collect_manual, "manual",
     "config/manual_inputs.json", None),
    ("p2p", "USDT/VND P2P — Binance, OKX, Bybit, Bitget", p2p.collect, "p2p", "website P2P của từng sàn", None),
]
MONTHLY_KEYS = {"cpiaucsl", "cpilfesl", "pcepi", "pcepilfe", "payems", "unrate"}
LIGHT_DROP = ("series", "candles")


def _load(p: Path):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def _write(p: Path, obj) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_suffix(p.suffix + ".tmp")
    tmp.write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    tmp.replace(p)


def history_file(out: Path, day: dt.date) -> Path:
    return out / "history" / f"{day:%Y}" / f"{day:%m}" / f"{day.isoformat()}.json"


def load_history(out: Path, today: dt.date, days: int = 120) -> dict[int, dict]:
    res = {}
    for d in range(1, days + 1):
        snap = _load(history_file(out, today - dt.timedelta(days=d)))
        if snap:
            res[d] = snap
    return res


def history_levels(hist: dict[int, dict]) -> dict[str, dict[str, float]]:
    lv = {"USDVND": {}, "USDTVND": {}}
    for snap in hist.values():
        m = snap.get("metrics", {})
        for key, metric_key in (("USDVND", "usdvnd_vcb_mid"), ("USDTVND", "usdtvnd_p2p_mid")):
            v = (m.get(metric_key) or {}).get("value")
            if v:
                lv[key][snap["date"]] = v
    return lv


def _accept(old: dict | None, new: dict) -> bool:
    """Quy tắc gộp khi hai nguồn cùng khoá: không để chỗ trống ghi đè số có thật;
    nhập tay chỉ thay số tự động khi có ngày mới hơn hoặc bằng."""
    if not old or old.get("value") is None:
        return True
    if new.get("value") is None:
        return False
    if new.get("quality") == "manual":
        return (new.get("period") or "") >= (old.get("period") or (old.get("timestamp") or "")[:10])
    return True


def run(out: Path, force: bool = False) -> int:
    started = now_vn()
    today = started.date()
    settings = json.loads((ROOT / "config" / "settings.json").read_text(encoding="utf-8"))
    trigger = env("GITHUB_EVENT_NAME") or "local"

    prev_latest = _load(out / "latest.json") or {}
    if trigger == "schedule" and not force and prev_latest.get("date") == today.isoformat() \
            and prev_latest.get("run", {}).get("trigger") == "schedule":
        log.info("Đã có snapshot lịch trình cho %s — bỏ qua lần chạy lặp.", today)
        return 0

    ctx = {"settings": settings, "config_dir": ROOT / "config", "today": today}
    snap: dict = {"schema_version": 1, "date": today.isoformat(), "metrics": {}, "series": {},
                  "candles": {}, "tables": {}, "sources": []}
    prev_sources = {s["id"]: s for s in prev_latest.get("sources", [])}
    ok_count = 0
    for sid, name, fn, cat, url, key_env in SOURCES:
        t0 = time.time()
        st = {"id": sid, "name": name, "url": url, "category": cat,
              "needs_key": False, "optional_key": key_env,
              "key_present": bool(env(key_env)) if key_env else None}
        try:
            res = fn(ctx)
            for k, m in res.get("metrics", {}).items():
                m.setdefault("category", "macro_monthly" if k in MONTHLY_KEYS else
                             "macro_daily" if cat == "macro" else cat)
                if not _accept(snap["metrics"].get(k), m):
                    continue
                snap["metrics"][k] = m
            snap["series"].update(res.get("series", {}))
            snap["candles"].update(res.get("candles", {}))
            snap["tables"].update(res.get("tables", {}))
            warns = res.get("warnings") or []
            st["status"] = "disabled" if res.get("disabled") else ("partial" if warns else "ok")
            st["warnings"] = warns[:10]
            st["metrics_count"] = sum(1 for m in res.get("metrics", {}).values() if m.get("value") is not None)
            if st["status"] != "disabled":
                st["last_success"] = iso_vn(dt.datetime.now(dt.timezone.utc))
                ok_count += 1
            else:
                st["last_success"] = prev_sources.get(sid, {}).get("last_success")
        except Exception as e:  # noqa: BLE001
            log.exception("Nguồn %s lỗi", sid)
            st.update(status="error", error=f"{type(e).__name__}: {e}"[:400], metrics_count=0,
                      last_success=prev_sources.get(sid, {}).get("last_success"))
        st["latency_ms"] = int((time.time() - t0) * 1000)
        snap["sources"].append(st)

    if ok_count == 0:
        log.error("Tất cả nguồn đều lỗi — không ghi snapshot.")
        return 2

    # --- chuẩn hoá & kiểm tra
    clean_series(snap)
    snap["metrics"].update({k: {**m, "category": "derived"} for k, m in an.fx_derived(snap, settings).items()})
    if snap["candles"]:
        for sym in crypto.ASSETS:
            cl = [c["close"] for c in snap["candles"].get(sym, {}).get("1d", [])]
            v7, v30 = an.realized_vol_ann(cl, 7), an.realized_vol_ann(cl, 30)
            snap["tables"].setdefault("volatility", {})[sym] = {"vol_7d": v7, "vol_30d": v30,
                                                                  "source": "Binance Spot 1D (tính)"}

    hist = load_history(out, today)
    fwd = fx_forward.build(snap, settings)
    snap["metrics"].update({k: {**m, "category": "derived"} for k, m in fwd["metrics"].items()})
    snap["tables"]["forward"] = fwd["table"]
    an.fx_day_change(snap, hist)
    snap["tables"]["fx"] = an.fx_board(snap)
    snap["tables"]["risk"] = an.risk_table(snap, settings, hist)
    snap["regime"] = an.regime(snap, settings)
    levels = an.build_level_series(snap, history_levels(hist))
    snap["correlation"] = an.correlation_matrix(levels, today.isoformat())
    snap["tables"]["macro_signals"] = an.macro_signals(snap)
    snap["tables"]["mm_signals"] = an.mm_signals(snap, settings)
    snap["tables"]["fomc"] = macro.fomc_schedule(ROOT / "config", today)
    snap["tables"]["thresholds"] = settings["risk_thresholds"]
    snap["tables"]["digest"] = digest.build(snap, today)

    finished = now_vn()
    snap["warnings"] = apply_quality(snap, settings, finished)
    # Sau bước kiểm tra chất lượng, để số liệu cũ không bị dùng làm phản ứng trong ngày
    news_items = snap["tables"].get("news") or []
    news_signal.annotate(snap, tone.score_titles([n["title"] for n in news_items if n.get("lang") == "en"]))
    scheduled = dt.datetime.combine(today, dt.time(7, 10), VN_TZ) if trigger == "schedule" else None
    snap["generated_at"] = finished.isoformat()
    snap["run"] = {
        "trigger": trigger, "started_at": started.isoformat(), "finished_at": finished.isoformat(),
        "scheduled_for": scheduled.isoformat() if scheduled else None,
        "delay_minutes": round((started - scheduled).total_seconds() / 60, 1) if scheduled else None,
        "run_id": env("GITHUB_RUN_ID"),
        "run_url": (f"{env('GITHUB_SERVER_URL')}/{env('GITHUB_REPOSITORY')}/actions/runs/{env('GITHUB_RUN_ID')}"
                    if env("GITHUB_RUN_ID") else None),
    }
    q = {}
    for m in snap["metrics"].values():
        q[m["quality"]] = q.get(m["quality"], 0) + 1
    snap["quality_summary"] = q

    errs = check_snapshot(snap)
    if errs:
        log.error("Snapshot không hợp lệ:\n%s", "\n".join(errs[:30]))
        return 3

    # --- ghi file (không xoá lịch sử)
    _write(out / "latest.json", snap)
    light = {k: v for k, v in snap.items() if k not in LIGHT_DROP}
    hf = history_file(out, today)
    if hf.exists():  # giữ bản chạy trước trong ngày
        hf.rename(hf.with_name(f"{today.isoformat()}.{dt.datetime.fromtimestamp(hf.stat().st_mtime, VN_TZ):%H%M%S}.json"))
    _write(hf, light)

    index = _load(out / "index.json") or {"dates": []}
    entries = {e["date"]: e for e in index["dates"]}
    entries[today.isoformat()] = {"date": today.isoformat(), "file": str(hf.relative_to(out)).replace("\\", "/"),
                                  "generated_at": snap["generated_at"], "regime": snap["regime"]["label"],
                                  "quality": q}
    index = {"latest": today.isoformat(), "updated_at": snap["generated_at"],
             "dates": sorted(entries.values(), key=lambda e: e["date"], reverse=True)}
    _write(out / "index.json", index)
    log.info("Đã ghi snapshot %s: %d chỉ số, %d nguồn OK, cảnh báo: %d",
             today, len(snap["metrics"]), ok_count, len(snap["warnings"]))
    return 0


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "public" / "data"))
    ap.add_argument("--force", action="store_true", help="Chạy cả khi hôm nay đã có snapshot lịch trình")
    a = ap.parse_args()
    sys.exit(run(Path(a.out), a.force))


if __name__ == "__main__":
    main()
