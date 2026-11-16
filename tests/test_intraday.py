"""Gom điểm giá trong ngày: ưu tiên nến 1 phút, giữ điểm đã lưu, cảnh báo thiếu dữ liệu."""
import datetime as dt

from scripts.analyzers import intraday
from scripts.common import VN_TZ

SETTINGS = {"intraday": {"band_pct": 0.3, "since": "2026-11-09"}}


def ts(day: str, hh: int, mm: int = 0) -> int:
    d = dt.date.fromisoformat(day)
    return int(dt.datetime.combine(d, dt.time(hh, mm), VN_TZ).timestamp())


def snap_with(raw):
    return {"tables": {"intraday_raw": raw}, "metrics": {}}


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
    prev = {"tables": {"intraday": {"days": [{"points": [[ts("2026-11-10", 8), 25490.0, "y5"], [ts("2026-11-10", 8, 5), 25495.0]]}]}}}
    raw = {"y5": [[ts("2026-11-10", 12), 25520.0]]}
    r = intraday.build(snap_with(raw), prev, dt.date(2026, 11, 10), SETTINGS)
    d = r["days"][0]
    assert d["n_points"] == 3 and d["open"] == 25490.0 and d["last"] == 25520.0
    assert d["meta"]["sources"] == {"y5": 2, "old": 1}


def test_metrics_and_missing_data_warning():
    raw = {"y5": [[ts("2026-11-10", 9), 25500.0], [ts("2026-11-10", 15), 25600.0]]}
    d = intraday.build(snap_with(raw), {}, dt.date(2026, 11, 10), SETTINGS)["days"][0]
    assert round(d["range_pct"], 3) == round((25600 / 25500 - 1) * 100, 3)
    assert round(d["dev_pct"], 3) == round(d["range_pct"], 3)
    assert d["outside_count"] == 1  # 25600 vượt biên 25500 * 1.003
    assert d["meta"]["max_gap_min"] == 360.0
    joined = " ".join(d["meta"]["warnings"])
    assert "Thiếu dữ liệu" in joined and "khoảng trống" in joined


def test_weekend_is_labelled_not_flagged_as_missing():
    raw = {"y5": [[ts("2026-11-14", 9), 25500.0], [ts("2026-11-14", 10), 25501.0]]}  # thứ Bảy
    d = intraday.build(snap_with(raw), {}, dt.date(2026, 11, 14), SETTINGS)["days"][0]
    assert any("Cuối tuần" in w for w in d["meta"]["warnings"])
    assert not any("Thiếu dữ liệu" in w for w in d["meta"]["warnings"])


def test_returns_none_without_two_points_in_a_day():
    raw = {"y5": [[ts("2026-11-10", 9), 25500.0]]}
    assert intraday.build(snap_with(raw), {}, dt.date(2026, 11, 10), SETTINGS) is None
