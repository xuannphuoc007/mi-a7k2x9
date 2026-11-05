"""Kiểm tra dữ liệu đã commit: schema snapshot + mọi đường dẫn trong index.json tồn tại.

Chạy: python -m scripts.validators.check_data [thư_mục_data]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from .quality import check_snapshot


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("public/data")
    latest = root / "latest.json"
    if not latest.exists():
        print("Chưa có dữ liệu (latest.json) — bỏ qua kiểm tra.")
        return 0
    errs = check_snapshot(json.loads(latest.read_text(encoding="utf-8")))
    index = json.loads((root / "index.json").read_text(encoding="utf-8"))
    for e in index.get("dates", []):
        f = root / e["file"]
        if not f.exists():
            errs.append(f"index.json trỏ tới file không tồn tại: {e['file']}")
            continue
        errs += [f"{e['file']}: {x}" for x in check_snapshot(json.loads(f.read_text(encoding="utf-8")))]
    if errs:
        print("\n".join(errs[:50]))
        return 1
    print(f"OK: latest.json và {len(index.get('dates', []))} ngày lịch sử hợp lệ.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
