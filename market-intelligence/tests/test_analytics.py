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
