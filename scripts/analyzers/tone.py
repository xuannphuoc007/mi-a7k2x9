"""Giọng tin (tích cực / tiêu cực / trung tính) bằng mô hình FinTwitBERT, chạy ngay trên máy chủ GitHub.

Không cần API key. Mô hình giấy phép MIT, ghim đúng phiên bản, chỉ nạp định dạng safetensors.
Mô hình được huấn luyện trên văn bản tài chính tiếng Anh nên không chấm tin tiếng Việt.

Thư viện này là tuỳ chọn (requirements-ml.txt): thiếu thư viện hoặc mô hình lỗi thì trả về rỗng,
website chỉ ẩn dòng giọng tin, phần còn lại vẫn chạy.
"""
from __future__ import annotations

import logging

log = logging.getLogger("mi")

MODEL = "StephanAkkerman/FinTwitBERT-sentiment"
REVISION = "da059da3b3bbcb43f9ed1aeb5ae61644010c7e1e"
LABELS = {"BULLISH": "positive", "BEARISH": "negative", "NEUTRAL": "neutral"}
# Dưới ngưỡng này mô hình không chắc: coi như không có nhận định
MIN_CONFIDENCE = 0.7


def read_results(titles: list[str], results: list[dict]) -> dict[str, dict]:
    out = {}
    for title, r in zip(titles, results):
        label = LABELS.get(str(r.get("label", "")).upper())
        score = float(r.get("score", 0))
        if label and score >= MIN_CONFIDENCE:
            out[title] = {"label": label, "score": round(score, 2)}
    return out


def score_titles(titles: list[str]) -> dict[str, dict]:
    if not titles:
        return {}
    try:
        from transformers import pipeline  # noqa: PLC0415
    except ImportError:
        log.info("Chưa cài thư viện mô hình (requirements-ml.txt): bỏ qua giọng tin.")
        return {}
    try:
        clf = pipeline("text-classification", model=MODEL, revision=REVISION, device=-1,
                       model_kwargs={"use_safetensors": True})
        return read_results(titles, clf(titles, truncation=True, batch_size=16))
    except Exception:  # noqa: BLE001
        log.exception("Không chấm được giọng tin: bỏ qua, các phần khác vẫn chạy.")
        return {}
