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


def test_parse_sbv_official_page_and_stockbiz():
    p = vn_rates.parse_sbv_page(fake_api.SBV_PAGE)
    assert p == {"central": 25615.0, "date": "2026-11-05", "buy": 24385.0, "sell": 26845.0}
    assert vn_rates.parse_stockbiz_on(fake_api.STOCKBIZ_ON) == (5.02, "2026-11-04")
    ib = vn_rates.parse_sbv_interbank(fake_api.SBV_RATES)
    # Kỳ hạn 9 tháng có dấu (*) là số của ngày cũ hơn nên bị bỏ
    assert ib == {"date": "2026-11-05", "rates": {"ON": 4.51, "1W": 5.0, "1M": 5.27}}
    with pytest.raises(RuntimeError):
        vn_rates.parse_sbv_page("<html>đổi giao diện</html>")
    with pytest.raises(RuntimeError):
        vn_rates.parse_stockbiz_on("<html></html>")


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
    # Số phiên 05/11/2026 theo bản tin VIRA: 25.720; VND 1M 5,40%; USD 1M 4,04% -> khoảng 25.747
    snap = {"metrics": {"usdvnd_interbank": {"value": 25720, "quality": "ok", "timestamp": "t", "period": "2026-11-05"},
                        "interbank_vnd_1m_rate": {"value": 5.40, "quality": "ok", "timestamp": "t", "period": "2026-11-05"},
                        "interbank_usd_1m_rate": {"value": 4.04, "quality": "ok", "timestamp": "t", "period": "2026-11-05"}}}
    r = fx_forward.build(snap, cfg)
    assert r["metrics"]["usdvnd_fwd_1m_implied"]["value"] == pytest.approx(25747.47, abs=0.01)
    assert r["table"]["caveats"] == [] and len(r["table"]["inputs"]) == 3
    # Không thay lãi suất 1 tháng bằng qua đêm, không dùng số cũ
    snap["metrics"]["interbank_vnd_1m_rate"]["quality"] = "stale"
    snap["metrics"]["interbank_overnight_rate"] = {"value": 4.5, "quality": "ok", "timestamp": "t"}
    r2 = fx_forward.build(snap, cfg)
    assert r2["metrics"]["usdvnd_fwd_1m_implied"]["value"] is None and r2["table"]["missing"] == ["lãi suất VND"]


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
    assert m["sbv_central_rate"]["value"] == 25615 and m["sbv_central_rate"]["quality"] != "missing"
    assert m["usdvnd_market"]["value"] and m["sofr"]["value"]
    assert m["interbank_overnight_rate"]["value"] == 4.51 and m["interbank_vnd_1m_rate"]["value"] == 5.27
    assert m["sbv_sell_rate"]["value"] == 26845
    assert m["usdvnd_interbank"]["value"] == 25720 and m["usdvnd_interbank"]["period"] == "2026-11-05"
    assert m["interbank_usd_overnight_rate"]["value"] == 3.85 and m["interbank_usd_1m_rate"]["value"] == 4.04
    # FWD = 25.720 × (1 + 5,27% × 30/365) / (1 + 4,04% × 30/360)
    assert m["usdvnd_fwd_1m_implied"]["value"] == pytest.approx(25720 * (1 + 0.0527 * 30 / 365) / (1 + 0.0404 * 30 / 360), abs=0.01)
    assert s["tables"]["forward"]["caveats"] == []


def test_vira_parser_on_real_bulletin_text():
    from scripts.collectors import vira
    url, day = vira.latest_link(fake_api.VIRA_LIST)
    assert day == dt.date(2026, 11, 6) and url.endswith("ngay-06-11-2026-.html")
    p = vira.parse(fake_api.VIRA_BULLETIN, day)
    assert p["interbank_close"] == 25720 and p["central"] == 25623 and p["fx_session"] == dt.date(2026, 11, 5)
    assert p["usd_rates"] == {"ON": 3.85, "1W": 3.91, "2W": 3.92, "1M": 4.04}
    assert p["vnd_rates"] == {"ON": 4.50, "1W": 5.00, "2W": 5.05, "1M": 5.40}
    assert p["rates_session"] == dt.date(2026, 11, 5)
    # Phiên cuối tháng 12 nằm trong bản tin đầu tháng 1 năm sau
    assert vira._day("31", "12", dt.date(2027, 1, 2)) == dt.date(2026, 12, 31)
    with pytest.raises(RuntimeError):
        vira.parse("<p>bản tin không có số</p>", day)
