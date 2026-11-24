import json
from pathlib import Path

import pytest

from scripts import run_pipeline
from scripts.collectors import crypto, derivatives, macro, investing_csv, news, p2p, p2p_ticks, sentiment, stablecoins, vira, vn_fx, vn_rates
from scripts.validators.quality import check_snapshot
from tests import fake_api

MODULES = (crypto, derivatives, macro, sentiment, stablecoins, vira, vn_fx, vn_rates, p2p, p2p_ticks, news)


@pytest.fixture
def fake_http(monkeypatch):
    def get(url, params=None, headers=None, as_text=False, as_bytes=False, **kw):
        return fake_api.router("GET", url, params, as_text=as_text, as_bytes=as_bytes)

    monkeypatch.setattr(p2p, "http_post", fake_api.post_router)
    monkeypatch.setattr(vn_rates, "http_post", fake_api.post_router)
    monkeypatch.setattr(p2p_ticks, "http_post", fake_api.post_router)
    monkeypatch.setattr(investing_csv, "CSV_PATH", Path("/không/có/file.csv"))  # test không đọc file thật
    monkeypatch.setattr(vn_rates, "investing_usdvnd_quote", lambda: None)  # test không gọi mạng thật

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


def test_p2p_ticks_filter_and_merge(monkeypatch):
    def ads(url, body, **kw):
        assert body["publisherType"] == "merchant" and body["transAmount"] == "50000000"
        rows = [  # (giá, tỷ lệ hoàn thành, số lệnh, USDT còn)
            (26400, 0.99, 500, 10000), (26380, 0.90, 500, 10000),  # tỷ lệ hoàn thành thấp -> bỏ
            (26390, 0.99, 50, 10000),                               # ít lệnh -> bỏ
            (26385, 0.99, 500, 100),                                # không đủ USDT cho 50 triệu -> bỏ
            (26410, 0.98, 300, 5000), (26420, 0.97, 200, 5000)]
        return {"data": [{"adv": {"price": str(p), "tradableQuantity": str(q)},
                          "advertiser": {"monthFinishRate": r, "monthOrderCount": n}} for p, r, n, q in rows]}
    monkeypatch.setattr(p2p_ticks, "http_post", ads)
    cfg = dict(p2p_ticks.DEFAULTS)
    buy = p2p_ticks.quote("BUY", cfg)
    assert buy == {"best": 26400, "median": 26410, "n": 3}
    sell = p2p_ticks.quote("SELL", cfg)
    assert sell["best"] == 26420
    old = [{"t": 100}, {"t": 200}, {"t": 200}]
    merged = p2p_ticks.merge(old, {"t": 300}, now_s=300, keep_days=1)
    assert [t["t"] for t in merged] == [100, 200, 300]
    assert p2p_ticks.merge(old, None, now_s=200 + 86400 + 1, keep_days=1) == []


def test_p2p_ticks_in_snapshot(tmp_path, fake_http):
    assert run_pipeline.run(tmp_path) == 0
    t = json.loads((tmp_path / "latest.json").read_text(encoding="utf-8"))["tables"]["p2p_intraday"]
    assert len(t["ticks"]) == 1 and t["ticks"][0]["buy"] == 26800 and t["ticks"][0]["sell"] == 26700
    assert run_pipeline.run(tmp_path, force=True) == 0  # lần chạy sau giữ điểm cũ
    t = json.loads((tmp_path / "latest.json").read_text(encoding="utf-8"))["tables"]["p2p_intraday"]
    assert len(t["ticks"]) >= 1


CSV_SAMPLE = '\ufeff"Ngày","Lần cuối","Mở","Cao","Thấp","KL","% Thay đổi"\n' \
    '"23/11/2026","25,785.0","25,805.0","25,847.5","25,783.0","","-0.06%"\n' \
    '"20/11/2026","25,801.5","25,752.5","25,812.0","25,732.5","","0.18%"\n' \
    '"xx/11/2026","1","2","3","4","",""\n' \
    '"19/11/2026","25,755.0","25,692.5","25,762.5","25,792.5","",""\n'  # thấp > mở: hỏng, bỏ


def test_investing_csv_parse_and_apply(tmp_path):
    import datetime as D
    cs = investing_csv.parse_csv(CSV_SAMPLE)
    assert [(c["open"], c["close"]) for c in cs] == [(25752.5, 25801.5), (25805.0, 25785.0)]
    vn = D.timezone(D.timedelta(hours=7))
    ts = lambda d, h: int(D.datetime(2026, 11, d, h, tzinfo=vn).timestamp())
    ticks = [{"t": ts(24, 9), "v": 25790.0}, {"t": ts(24, 11), "v": 25830.0}, {"t": ts(24, 15), "v": 25770.0},
             {"t": ts(22, 9), "v": 25999.0},   # Chủ nhật: bỏ
             {"t": ts(23, 9), "v": 25000.0}]   # ngày đã có trong file: bỏ
    f = tmp_path / "x.csv"
    f.write_text(CSV_SAMPLE, encoding="utf-8")
    snap = {"candles": {"usdvnd_market": {"1d": [{"time": 1, "open": 1, "high": 1, "low": 1, "close": 1}], "source": "TradingView"}},
            "tables": {"usdvnd_ticks": {"ticks": ticks}}}
    assert investing_csv.apply(snap, f) == "23/11/2026"
    out = snap["candles"]["usdvnd_market"]["1d"]
    assert len(out) == 3 and out[0]["time"] != 1                         # nến Yahoo/TradingView không còn
    today = out[2]
    assert (today["open"], today["high"], today["low"], today["close"]) == (25785.0, 25830.0, 25770.0, 25770.0)
    assert "Investing" in snap["candles"]["usdvnd_market"]["source"] and "TradingView" not in snap["candles"]["usdvnd_market"]["source"]
    assert investing_csv.apply({"candles": {}}, f) is None
    assert investing_csv.apply(snap, tmp_path / "none.csv") is None


def test_investing_csv_real_file_is_valid():
    real = Path(__file__).resolve().parents[1] / "config" / "investing_usdvnd_daily.csv"
    cs = investing_csv.parse_csv(real.read_text(encoding="utf-8"))
    assert len(cs) > 200 and cs == sorted(cs, key=lambda c: c["time"])


def test_usdvnd_ticks_only_from_investing(monkeypatch):
    import time
    from scripts.analyzers import usdvnd_ticks
    old = int(time.time()) - 600
    monkeypatch.setattr(usdvnd_ticks, "_old_ticks", lambda ctx, key: [{"t": old, "v": 25700.0}])
    snap = {"metrics": {"usdvnd_market": {"value": 25785.0, "source": "Investing.com USD/VND"}}, "tables": {}}
    usdvnd_ticks.record(snap, {})
    assert [t["v"] for t in snap["tables"]["usdvnd_ticks"]["ticks"]] == [25700.0, 25785.0]
    snap = {"metrics": {"usdvnd_market": {"value": 25705.0, "source": "TradingView FX_IDC:USDVND"}}, "tables": {}}
    usdvnd_ticks.record(snap, {})  # nguồn khác Investing: không thêm điểm mới, chỉ giữ điểm cũ
    assert [t["v"] for t in snap["tables"]["usdvnd_ticks"]["ticks"]] == [25700.0]
