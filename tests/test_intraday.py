"""Gom điểm giá trong ngày, độ phủ, ngày hợp lệ và trạng thái cập nhật."""
import datetime as dt

from scripts.analyzers import intraday
from scripts.collectors import vn_rates
from scripts.common import VN_TZ

SETTINGS = {"intraday": {"band_pct": 0.3, "since": "2026-11-09", "min_points": 4, "min_changes": 2}}


def ts(day: str, hh: int, mm: int = 0) -> int:
    d = dt.date.fromisoformat(day)
    return int(dt.datetime.combine(d, dt.time(hh, mm), VN_TZ).timestamp())


def snap_with(raw):
    return {"tables": {"intraday_raw": raw}, "metrics": {}}


def grid(day: str, start_h: int, end_h: int, step_min: int = 5):
    t, end = ts(day, start_h), ts(day, end_h)
    out = []
    while t < end:
        out.append(t)
        t += step_min * 60
    return out


def test_prefers_1m_over_5m_and_filters_since():
    raw = {
        "y5": [[ts("2026-11-06", 9), 100.0], [ts("2026-11-10", 9), 25500.0], [ts("2026-11-10", 10), 25510.0]],
        "y1": [[ts("2026-11-10", 9), 25501.0]],
    }
    r = intraday.build(snap_with(raw), {}, dt.date(2026, 11, 10), SETTINGS)
    assert [d["date"] for d in r["days"]] == ["2026-11-10"]  # 06/11 nằm trước since
    d = r["days"][0]
    assert d["open"] == 25501.0 and d["n_points"] == 2
    assert d["meta"]["sources"] == {"y1": 1, "y5": 1}
    assert d["points"][0][2] == "y1"


def test_stored_points_are_kept_and_tags_survive():
    prev = {"tables": {"intraday": {"days": [{"date": "2026-11-10", "points": [[ts("2026-11-10", 8), 25490.0, "y5"], [ts("2026-11-10", 8, 5), 25495.0]]}]}}}
    raw = {"y5": [[ts("2026-11-10", 12), 25520.0]]}
    r = intraday.build(snap_with(raw), prev, dt.date(2026, 11, 10), SETTINGS)
    d = r["days"][0]
    assert d["n_points"] == 3 and d["open"] == 25490.0 and d["last"] == 25520.0
    assert d["meta"]["sources"] == {"y5": 2, "old": 1}
    assert r["audit"]["new_market_records"] == 1  # chỉ điểm 12:00 là mới so với bản lưu trước


def test_equal_prices_are_not_filtered():
    raw = {"y5": [[ts("2026-11-10", 9, i * 5), 25500.0] for i in range(6)] + [[ts("2026-11-10", 10), 25510.0]]}
    d = intraday.build(snap_with(raw), {}, dt.date(2026, 11, 10), SETTINGS)["days"][0]
    assert d["n_points"] == 7  # giữ cả các nến giá không đổi
    assert d["meta"]["price_changes"] == 1


def test_coverage_uses_source_grid_and_gap_counts_only_trading_time():
    g = grid("2026-11-10", 9, 17)  # 96 ô 5 phút
    raw = {
        "y5": [[ts("2026-11-10", 9), 25500.0], [ts("2026-11-10", 9, 5), 25505.0], [ts("2026-11-10", 15), 25510.0], [ts("2026-11-10", 16), 25520.0]],
        "grid": {"y5": g},
    }
    d = intraday.build(snap_with(raw), {}, dt.date(2026, 11, 10), SETTINGS)["days"][0]
    c = d["meta"]["coverage"]["5m"]
    assert c == {"expected": 96, "actual": 4, "pct": round(4 / 96 * 100, 2)}
    assert d["meta"]["max_gap_min"] == 355.0  # 09:05 -> 15:00 = 71 ô 5 phút
    assert d["meta"]["unusual_gaps"] == 1
    assert any("bất thường" in w for w in d["meta"]["warnings"])


def test_gap_over_closed_hours_is_not_counted():
    g = grid("2026-11-10", 9, 10) + grid("2026-11-10", 20, 21)  # nghỉ từ 10:00 đến 20:00
    raw = {"y5": [[ts("2026-11-10", 9, 55), 25500.0], [ts("2026-11-10", 20), 25501.0]], "grid": {"y5": g}}
    d = intraday.build(snap_with(raw), {}, dt.date(2026, 11, 10), SETTINGS)["days"][0]
    assert d["meta"]["max_gap_min"] == 5.0  # chỉ 1 ô giao dịch nằm giữa, 10 giờ nghỉ không tính


def test_session_validity():
    ok = {"y5": [[ts("2026-11-10", 9, i * 5), 25500.0 + (i % 3) * 5] for i in range(6)]}
    d = intraday.build(snap_with(ok), {}, dt.date(2026, 11, 10), SETTINGS)["days"][0]
    assert d["meta"]["valid"] and d["meta"]["invalid_reason"] is None

    flat = {"y5": [[ts("2026-11-10", 9, i * 5), 25500.0] for i in range(6)]}
    d = intraday.build(snap_with(flat), {}, dt.date(2026, 11, 10), SETTINGS)["days"][0]
    assert not d["meta"]["valid"] and "đổi" in d["meta"]["invalid_reason"]

    few = {"y5": [[ts("2026-11-10", 9), 25500.0], [ts("2026-11-10", 10), 25510.0]]}
    d = intraday.build(snap_with(few), {}, dt.date(2026, 11, 10), SETTINGS)["days"][0]
    assert not d["meta"]["valid"] and "điểm" in d["meta"]["invalid_reason"]


def test_weekend_is_never_valid_and_labelled():
    raw = {"y5": [[ts("2026-11-14", 1, i * 5), 25500.0 + i] for i in range(6)]}  # thứ Bảy
    d = intraday.build(snap_with(raw), {}, dt.date(2026, 11, 14), SETTINGS)["days"][0]
    assert d["meta"]["weekend"] and not d["meta"]["valid"]
    assert any("Cuối tuần" in w for w in d["meta"]["warnings"])


def test_tradingview_sample_does_not_count_as_market_record():
    raw = {"y5": [[ts("2026-11-10", 9, i * 5), 25500.0 + i] for i in range(5)]}
    snap = snap_with(raw)
    snap["metrics"]["usdvnd_market"] = {"value": 25600.0, "source": "TradingView FX_IDC:USDVND",
                                        "timestamp": dt.datetime.fromtimestamp(ts("2026-11-10", 12), VN_TZ).isoformat()}
    r = intraday.build(snap, {}, dt.date(2026, 11, 10), SETTINGS)
    d = r["days"][0]
    assert d["meta"]["sources"]["tv"] == 1 and d["meta"]["market_points"] == 5
    assert r["audit"]["new_market_records"] == 5 and r["audit"]["tradingview_sample_ts"] == ts("2026-11-10", 12)


def test_market_open_window():
    def at(y, m, d, h):
        return dt.datetime(y, m, d, h, 0, tzinfo=VN_TZ)
    assert intraday.market_open(at(2026, 11, 11, 15))      # thứ Tư
    assert not intraday.market_open(at(2026, 11, 14, 9))   # thứ Bảy sau 05:00
    assert intraday.market_open(at(2026, 11, 14, 3))       # thứ Bảy trước 05:00 vẫn còn phiên New York
    assert not intraday.market_open(at(2026, 11, 15, 12))  # Chủ nhật
    assert not intraday.market_open(at(2026, 11, 16, 3))   # thứ Hai trước 05:00
    assert intraday.market_open(at(2026, 11, 16, 6))


def test_returns_none_without_two_points_in_a_day():
    raw = {"y5": [[ts("2026-11-10", 9), 25500.0]]}
    assert intraday.build(snap_with(raw), {}, dt.date(2026, 11, 10), SETTINGS) is None


def test_audit_yahoo_counts_null_bars_and_keeps_equal_prices():
    j = {"chart": {"result": [{"meta": {"regularMarketTime": 1100}, "timestamp": [1000, 1060, 1120, 1180, 1240],
                               "indicators": {"quote": [{"close": [None, 25500.0, None, 25500.0, 25510.0]}]}}], "error": None}}
    a = vn_rates.audit_yahoo(j)
    assert a["audit"]["raw_bars"] == 5 and a["audit"]["non_null"] == 3 and a["audit"]["null"] == 2
    assert a["audit"]["equal_to_previous_kept"] == 1  # 25500 lặp lại vẫn được giữ
    assert a["points"] == [[1060, 25500.0], [1180, 25500.0], [1240, 25510.0]]
    assert a["audit"]["last_priced_bar"] == 1240 and a["audit"]["market_time"] == 1100
