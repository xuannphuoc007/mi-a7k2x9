import json
from pathlib import Path

import pytest

from scripts import run_pipeline
from scripts.collectors import crypto, derivatives, macro, news, p2p, sentiment, stablecoins, vn_fx, vn_rates
from scripts.validators.quality import check_snapshot
from tests import fake_api

MODULES = (crypto, derivatives, macro, sentiment, stablecoins, vn_fx, vn_rates, p2p, news)


@pytest.fixture
def fake_http(monkeypatch):
    def get(url, params=None, headers=None, as_text=False, as_bytes=False, **kw):
        return fake_api.router("GET", url, params, as_text=as_text, as_bytes=as_bytes)

    monkeypatch.setattr(p2p, "http_post", fake_api.post_router)

    for mod in MODULES:
        if hasattr(mod, "http_get"):
            monkeypatch.setattr(mod, "http_get", get)
    monkeypatch.delenv("GITHUB_EVENT_NAME", raising=False)
    monkeypatch.delenv("FRED_API_KEY", raising=False)


def test_full_pipeline_writes_valid_snapshot(tmp_path, fake_http):
    assert run_pipeline.run(tmp_path) == 0
    snap = json.loads((tmp_path / "latest.json").read_text(encoding="utf-8"))
    assert check_snapshot(snap) == []
    m = snap["metrics"]
    assert m["btc_price"]["value"] == 100000
    assert m["btc_dominance"]["value"] == 58.1
    assert m["usdvnd_vcb_sell"]["value"] == 26380
    assert m["usdvnd_vcb_sell"]["kind"] == "ask"
    # Đủ 5 đồng
    assert m["xrp_price"]["value"] == 2.0 and m["bnb_price"]["value"] == 600
    # USDT/VND: trung vị 4 sàn, giá mua vào luôn thấp hơn giá bán ra
    assert m["usdtvnd_p2p_bid"]["value"] == 26705 and m["usdtvnd_p2p_ask"]["value"] == 26815
    # Ngân hàng và chợ đen
    assert m["usdvnd_bidv_sell"]["value"] == 26400 and m["usdvnd_tcb_sell"]["value"] == 26390
    assert m["usdvnd_free_buy"]["value"] == 26700 and m["usdvnd_free_sell"]["value"] == 26760
    fx = snap["tables"]["fx"]
    assert [b["id"] for b in fx["banks"]] == ["vcb", "bidv", "tcb"]
    assert len(fx["free"]) == 2 and len(fx["platforms"]) == 4
    assert fx["gaps"]["free_vs_bank"]["vnd"] == 26760 - 26380
    # Chỉ số không có nguồn thì không còn xuất hiện
    assert "dxy" in m and "btc_liquidations" not in m
    # Tin: giữ tin lớn còn mới, bỏ tin ngoài chủ đề và tin cũ
    titles = [n["title"] for n in snap["tables"]["news"]]
    assert titles == ["Fed rate cut sends stocks surging"]
    assert snap["tables"]["news"][0]["sources"]
    # Bản tin ngày nằm cả trong bản lưu lịch sử để chọn lại ngày cũ
    dg = snap["tables"]["digest"]
    assert "chợ đen" in dg["headline"] and dg["bullets"]
    # CPI YoY tính từ chỉ số
    assert m["cpiaucsl"]["unit"] == "% YoY"
    assert snap["regime"]["label"] in {"Risk-on", "Risk-off", "Neutral", "High Volatility", "Liquidity Stress", "Không đủ dữ liệu"}
    assert "BTC" in snap["correlation"]["assets"]
    idx = json.loads((tmp_path / "index.json").read_text(encoding="utf-8"))
    assert idx["latest"] == snap["date"]
    hist = tmp_path / idx["dates"][0]["file"]
    light = json.loads(hist.read_text(encoding="utf-8"))
    assert "series" not in light and "candles" not in light
    assert light["tables"]["digest"] == dg and light["tables"]["news"]


def test_source_failure_is_isolated(tmp_path, fake_http, monkeypatch):
    def boom(*a, **k):
        raise RuntimeError("HTTP 451")
    monkeypatch.setattr(derivatives, "http_get", boom)
    assert run_pipeline.run(tmp_path) == 0
    snap = json.loads((tmp_path / "latest.json").read_text(encoding="utf-8"))
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
    assert check_snapshot(json.loads(p.read_text(encoding="utf-8"))) == []
