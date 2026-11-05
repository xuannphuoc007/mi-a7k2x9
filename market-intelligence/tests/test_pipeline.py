import json
from pathlib import Path

import pytest

from scripts import run_pipeline
from scripts.collectors import crypto, derivatives, macro, p2p, sentiment, stablecoins, vn_fx
from scripts.validators.quality import check_snapshot
from tests import fake_api

MODULES = (crypto, derivatives, macro, sentiment, stablecoins, vn_fx, p2p)


@pytest.fixture
def fake_http(monkeypatch):
    def get(url, params=None, headers=None, as_text=False, **kw):
        return fake_api.router("GET", url, params, as_text=as_text)

    for mod in MODULES:
        if hasattr(mod, "http_get"):
            monkeypatch.setattr(mod, "http_get", get)
    monkeypatch.delenv("GITHUB_EVENT_NAME", raising=False)
    monkeypatch.delenv("FRED_API_KEY", raising=False)


def test_full_pipeline_writes_valid_snapshot(tmp_path, fake_http):
    assert run_pipeline.run(tmp_path) == 0
    snap = json.loads((tmp_path / "latest.json").read_text())
    assert check_snapshot(snap) == []
    m = snap["metrics"]
    assert m["btc_price"]["value"] == 100000
    assert m["btc_dominance"]["value"] == 58.1
    assert m["usdvnd_vcb_sell"]["value"] == 26380
    assert m["usdvnd_vcb_sell"]["kind"] == "ask"
    # P2P tắt mặc định -> thiếu dữ liệu, không bịa số
    assert m["usdtvnd_p2p_mid"]["value"] is None and m["usdtvnd_p2p_mid"]["quality"] == "missing"
    assert m["p2p_premium"]["value"] is None
    # DXY không có nguồn hợp lệ -> missing có giải thích
    assert m["dxy"]["value"] is None and "ICE" in m["dxy"]["note"]
    # Liquidation chưa có nguồn
    assert m["btc_liquidations"]["quality"] == "missing"
    # CPI YoY tính từ chỉ số
    assert m["cpiaucsl"]["unit"] == "% YoY"
    assert snap["regime"]["label"] in {"Risk-on", "Risk-off", "Neutral", "High Volatility", "Liquidity Stress", "Không đủ dữ liệu"}
    assert "BTC" in snap["correlation"]["assets"]
    idx = json.loads((tmp_path / "index.json").read_text())
    assert idx["latest"] == snap["date"]
    hist = tmp_path / idx["dates"][0]["file"]
    light = json.loads(hist.read_text())
    assert "series" not in light and "candles" not in light


def test_source_failure_is_isolated(tmp_path, fake_http, monkeypatch):
    def boom(*a, **k):
        raise RuntimeError("HTTP 451")
    monkeypatch.setattr(derivatives, "http_get", boom)
    assert run_pipeline.run(tmp_path) == 0
    snap = json.loads((tmp_path / "latest.json").read_text())
    st = {s["id"]: s for s in snap["sources"]}
    assert st["okx_derivatives"]["status"] == "error"
    assert st["coingecko"]["status"] == "ok"
    assert snap["metrics"]["btc_price"]["value"] == 100000


def test_all_sources_fail_writes_nothing(tmp_path, monkeypatch):
    def boom(ctx):
        raise RuntimeError("offline")
    monkeypatch.setattr(run_pipeline, "SOURCES", [(*s[:2], boom, *s[3:]) for s in run_pipeline.SOURCES])
    assert run_pipeline.run(tmp_path) == 2
    assert not (tmp_path / "latest.json").exists()


def test_history_is_not_overwritten(tmp_path, fake_http):
    run_pipeline.run(tmp_path)
    run_pipeline.run(tmp_path)
    files = list((tmp_path / "history").rglob("*.json"))
    assert len(files) == 2


def test_repository_seed_data_valid():
    """Nếu repo đã có dữ liệu thật, dữ liệu đó phải đúng schema."""
    p = Path(__file__).resolve().parent.parent / "public" / "data" / "latest.json"
    if not p.exists():
        pytest.skip("Chưa có dữ liệu — workflow chưa chạy lần nào")
    assert check_snapshot(json.loads(p.read_text())) == []
