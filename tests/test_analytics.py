import datetime as dt
import math

from scripts.analyzers import analytics as an
from scripts.collectors.p2p import book_metrics, eligible
from scripts.validators.quality import apply_quality, check_metric

CFG = {"trade_sizes_vnd": [50_000_000, 500_000_000], "min_completion_rate": 0.95, "min_month_orders": 100,
       "allowed_payment_keywords": ["bank"], "depth_band_pct": 0.5}


def ad(price, mn, mx, avail, completion=0.99, orders=500, methods=("Bank Transfer",)):
    return {"price": price, "min_vnd": mn, "max_vnd": mx, "available_usdt": avail,
            "completion": completion, "orders": orders, "methods": list(methods)}


def test_pearson_perfect_and_none():
    assert an.pearson([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]) == 1.0
    assert abs(an.pearson([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]) + 1) < 1e-12
    assert an.pearson([1, 2, 3], [1, 2, 3]) is None  # < 5 quan sát


def test_realized_vol_constant_growth_is_zero():
    closes = [100 * math.exp(0.01 * i) for i in range(40)]
    assert an.realized_vol_ann(closes, 30) < 1e-6


def test_correlation_uses_returns_and_pairwise_dates():
    days = [(dt.date(2026, 8, 1) + dt.timedelta(days=i)).isoformat() for i in range(60)]
    a = {d: 100 * (1.01 ** i) * (1 + 0.02 * math.sin(i)) for i, d in enumerate(days)}
    b = {d: v * 2 for d, v in a.items() if days.index(d) % 2 == 0}  # thiếu nửa số ngày
    res = an.correlation_matrix({"BTC": a, "ETH": b}, days[-1], windows=(30,))
    w = res["windows"]["30"]
    assert res["assets"] == ["BTC", "ETH"]
    assert w["n"][0][1] < w["n"][0][0]  # pairwise-complete làm giảm số quan sát


def test_p2p_eligibility_filters():
    asks = [ad(26500, 10e6, 100e6, 10_000), ad(26400, 100e6, 1e9, 100_000),
            ad(26300, 10e6, 100e6, 10_000, completion=0.5),  # uy tín thấp
            ad(26200, 10e6, 100e6, 10_000, methods=("Momo",))]  # sai phương thức
    bids = [ad(26350, 10e6, 1e9, 100_000)]
    assert [a["price"] for a in eligible(asks, 50e6, CFG)] == [26500]
    bm = book_metrics(asks, bids, CFG)
    s50, s500 = bm["by_size"]
    assert s50["ask"] == 26500 and s50["bid"] == 26350
    assert s500["ask"] == 26400  # quy mô lớn chỉ khớp quảng cáo có hạn mức lớn
    assert s50["spread_pct"] > 0


def test_risk_level_thresholds():
    assert an.level(None, [1, 2]) == "na"
    assert an.level(0.5, [1, 2]) == "low"
    assert an.level(-1.5, [1, 2]) == "medium"
    assert an.level(2.0, [1, 2]) == "high"


def test_quality_marks_stale_and_out_of_range():
    now = dt.datetime(2026, 11, 5, 8, tzinfo=dt.timezone(dt.timedelta(hours=7)))
    snap = {"metrics": {
        "btc_price": {"label": "x", "value": 1, "unit": "USD", "source": "s", "quality": "ok",
                      "timestamp": "2026-11-01T00:00:00+07:00", "category": "crypto"},
        "fear_greed": {"label": "x", "value": 150, "unit": "", "source": "s", "quality": "ok",
                       "timestamp": "2026-11-05T07:00:00+07:00", "category": "sentiment"}}}
    apply_quality(snap, {"staleness_hours": {"crypto": 6, "sentiment": 36}}, now)
    assert snap["metrics"]["btc_price"]["quality"] == "stale"
    assert snap["metrics"]["fear_greed"]["quality"] == "warning"


def test_metric_schema():
    assert check_metric("k", {"label": "a", "value": None, "unit": "", "source": "", "timestamp": None,
                              "quality": "ok"})  # rỗng nhưng 'ok' -> lỗi
    assert not check_metric("k", {"label": "a", "value": 1.0, "unit": "", "source": "",
                                  "timestamp": "2026-11-05T07:00:00+07:00", "quality": "ok"})


def test_regime_needs_enough_inputs():
    settings = {"regime": {
        "liquidity_stress": {"usdt_peg_deviation_abs_pct": 0.5, "p2p_premium_abs_pct": 3, "stablecoin_supply_7d_pct": -1},
        "high_volatility": {"btc_realized_vol_7d_ann_pct": 75, "btc_abs_change_24h_pct": 6},
        "score": {"btc_7d_return_pct": 3, "fear_greed_risk_on": 55, "fear_greed_risk_off": 45,
                  "us10y_7d_change_bp": 10, "funding_hot_pct": 0.03, "risk_on_min_score": 2, "risk_off_max_score": -2}}}
    assert an.regime({"metrics": {}}, settings)["label"] == "Không đủ dữ liệu"
    peg = {"metrics": {"usdt_peg_dev": {"value": -0.8}}}
    assert an.regime(peg, settings)["label"] == "Liquidity Stress"


def test_news_rank_drops_old_noise_and_merges_same_story():
    from scripts.collectors import news
    now = dt.datetime(2026, 11, 5, 8, tzinfo=dt.timezone(dt.timedelta(hours=7)))

    def item(title, source="CNBC", hours=1):
        return {"title": title, "link": f"https://x.test/{title}{source}", "published": now - dt.timedelta(hours=hours),
                "source": source, "weight": 1.0}

    ranked = news.rank([
        item("Fed rate cut sends stocks higher"),
        item("Fed rate cut sends stocks higher today", "BBC"),
        item("Bitcoin price prediction for next week"),
        item("Lunch ideas for busy people"),
        item("CPI inflation surprise", hours=48),
    ], now)
    assert [n["title"] for n in ranked] == ["Fed rate cut sends stocks higher"]
    assert ranked[0]["sources"] == ["CNBC", "BBC"]


def test_free_market_parsers():
    from scripts.collectors import vn_fx
    assert vn_fx.parse_tygiausd('content="chợ đen hôm nay 05-11-2026 22giờ: Mua-26,070; Bán-26,130, x"') == (26070, 26130)
    assert vn_fx.parse_tygia_vn("<b>USD tự do</b><i>26,070\n   / 26,130</i>") == (26070, 26130)


def _fx(title, topic):
    from scripts.analyzers import news_signal
    return {e["market"]: e["dir"] for e in news_signal.effects(title, topic)["effects"]}


def test_effects_on_real_headlines():
    # Các tiêu đề thật từng bị gắn sai ở lần chạy thử đầu tiên
    assert _fx("Bitcoin Erases Election Rally as AI Stocks Plunge, $428 Million in Crypto Longs Get Wiped Out", "politics") == {
        "Crypto": "down", "Chứng khoán": "down"}
    assert _fx("Bitcoin crashes 6% to 7-week low as US stocks erase election gains", "politics") == {
        "Crypto": "down", "Chứng khoán": "down"}
    assert _fx("Canton Coin Gets SEC Nod as Wall Street Tokenization Heats Up", "crypto_policy") == {}
    assert _fx("Gate CEO says crypto exchanges must prove they can survive a hack like Binance’s", "crypto_risk") == {}
    assert _fx("Binance bù đắp 98% tài sản sau vụ hack 6,3 tỷ USD", "crypto_risk") == {}
    # Các tiêu đề đúng phải giữ nguyên
    assert _fx("Tỷ giá USD giảm mạnh nhất một tháng", "sbv") == {"USD/VND": "down"}
    assert _fx("Giá vàng thế giới tăng mạnh nhất 3 tháng", "gold") == {"Vàng": "up"}
    assert _fx("Live updates: Bitcoin plunges as Nasdaq falls 4% in panicky selloff", "crypto_flow") == {
        "Crypto": "down", "Chứng khoán": "down"}
    assert _fx("Mercado Bitcoin hack continued hours after exchange said attack was contained", "crypto_risk") == {"Crypto": "down"}


def test_effects_need_the_right_context():
    # Ngân hàng trung ương khác không suy ra hướng USD; "tăng cường" không phải "tăng"; câu hỏi không kết luận
    assert _fx("Bank of England hikes interest rate for the first time since Iran war", "fed") == {}
    assert _fx("NHNN Khu vực 2 tăng cường theo dõi lãi suất với các giao dịch phát sinh", "sbv") == {}
    assert _fx("Will the Fed cut rates? Bitcoin could surge", "fed") == {}
    fed = _fx("Fed cuts interest rates by a quarter point", "fed")
    assert fed["USD"] == "down" and fed["Crypto"] == "up"
    war = _fx("Missile attack on Gulf port rattles region", "geo")
    assert war["Dầu"] == "up" and war["Chứng khoán"] == "down"


def test_tone_keeps_only_confident_known_labels():
    from scripts.analyzers import tone
    got = tone.read_results(["a", "b", "c"], [{"label": "BEARISH", "score": 0.91}, {"label": "BULLISH", "score": 0.5},
                                               {"label": "OTHER", "score": 0.99}])
    assert got == {"a": {"label": "negative", "score": 0.91}}


def test_annotate_uses_only_fresh_metrics_for_reaction():
    from scripts.analyzers import news_signal
    snap = {"metrics": {"btc_price": {"change_24h": -5.0, "quality": "ok"},
                        "dtwexbgs": {"change_24h": 0.1, "quality": "stale"}},
            "tables": {"news": [{"title": "Bitcoin plunges", "topic": "crypto_flow", "markets": ["Crypto", "USD"]}]}}
    news_signal.annotate(snap, {"Bitcoin plunges": {"label": "negative", "score": 0.9}})
    n = snap["tables"]["news"][0]
    assert n["effects"] == [{"market": "Crypto", "dir": "down"}]
    assert n["tone"]["label"] == "negative"
    assert [r["label"] for r in n["reaction"]] == ["BTC"]
