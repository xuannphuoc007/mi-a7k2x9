import datetime as dt

import pytest

from scripts import run_pipeline
from scripts.analyzers import fx_forward, volatility
from scripts.collectors import vn_rates
from scripts.run_pipeline import _accept
from tests import fake_api
from tests.test_pipeline import fake_http  # noqa: F401


def test_parse_sbv_and_errors():
    p = vn_rates.parse_sbv(fake_api.sbv_json())
    assert p["central"] == 25100 and p["buy"] == 24800 and p["date"] == "2026-11-05"
    with pytest.raises(RuntimeError):
        vn_rates.parse_sbv({"rates": []})


def test_parse_yahoo():
    price, when, pts = vn_rates.parse_yahoo(fake_api.yahoo_json())
    assert len(pts) == 365 and price == pts[-1][1]
    with pytest.raises(RuntimeError):
        vn_rates.parse_yahoo({"chart": {"result": None, "error": "x"}})


def test_merge_rule():
    auto = {"value": 25100, "quality": "ok", "timestamp": "2026-11-05T00:00:00+07:00", "period": "2026-11-05"}
    empty = {"value": None, "quality": "missing"}
    assert not _accept(auto, empty)
    assert _accept(empty, auto)
    assert _accept(auto, {"value": 25090, "quality": "manual", "period": "2026-11-06"})
    assert not _accept(auto, {"value": 25090, "quality": "manual", "period": "2026-11-01"})


def test_forward_cip_and_missing():
    assert fx_forward.implied(25000, 4.0, 4.0, 30) == pytest.approx(25000 * (1 + 0.04 * 30 / 365) / (1 + 0.04 * 30 / 360))
    cfg = {"forward": {}}
    snap = {"metrics": {"usdvnd_vcb_mid": {"value": 25000, "quality": "ok", "timestamp": "t"},
                        "interbank_overnight_rate": {"value": 4.0, "quality": "manual", "timestamp": "t"},
                        "dtb4wk": {"value": 3.7, "quality": "ok", "timestamp": "t"}}}
    r = fx_forward.build(snap, cfg)
    assert r["metrics"]["usdvnd_fwd_1m_implied"]["value"] > 25000
    assert r["table"]["caveats"]
    r2 = fx_forward.build({"metrics": {}}, cfg)
    assert r2["metrics"]["usdvnd_fwd_1m_implied"]["value"] is None and r2["table"]["missing"]


def test_volatility_skips_and_accumulates():
    today = dt.date(2026, 11, 6)
    pts = [[int((dt.datetime(2026, 10, 8, 5, tzinfo=dt.timezone.utc) + dt.timedelta(days=i)).timestamp()), 25000 * (1 + 0.001 * (-1) ** i)]
           for i in range(30)]
    snap = {"date": today.isoformat(), "series": {"usdvnd_market": {"points": pts}},
            "metrics": {"sbv_central_rate": {"value": 25100, "quality": "ok"}}, "candles": {}}
    rows = {r["key"]: r for r in volatility.build(snap, {}, {}, today)}
    assert rows["usdvnd_market"]["status"] == "ok" and rows["usdvnd_market"]["vol_7d"] > 0
    assert rows["sbv_central_rate"]["status"] == "accumulating"
    assert rows["sofr"]["status"] == "no_data"
    assert rows["usdvnd_market"]["vol_90d"] is None  # chưa đủ 35 kỳ


def test_pipeline_end_to_end(tmp_path, fake_http):
    assert run_pipeline.run(tmp_path, force=True) == 0
    import json
    s = json.loads((tmp_path / "latest.json").read_text(encoding="utf-8"))
    m = s["metrics"]
    assert m["sbv_central_rate"]["value"] == 25100 and m["sbv_central_rate"]["quality"] != "missing"
    assert m["usdvnd_market"]["value"] and m["sofr"]["value"]
    # chưa nhập lãi suất VND nên chưa tính forward, và nói rõ lý do
    assert m["usdvnd_fwd_1m_implied"]["value"] is None
    assert "lãi suất VND" in s["tables"]["forward"]["missing"]
