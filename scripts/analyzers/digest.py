"""Bản tin trong ngày: viết thành câu từ số liệu đã thu thập, theo quy tắc, không dùng AI."""
from __future__ import annotations

import datetime as dt

COINS = ("BTC", "ETH", "SOL", "XRP", "BNB")
REGIME_VI = {
    "Risk-on": ("Ưa rủi ro", "Dòng tiền đang nghiêng về tài sản rủi ro."),
    "Risk-off": ("Né rủi ro", "Dòng tiền đang rời tài sản rủi ro."),
    "Neutral": ("Trung tính", "Chưa có xu hướng rõ."),
    "High Volatility": ("Biến động mạnh", "Giá dao động lớn hơn bình thường."),
    "Liquidity Stress": ("Căng thanh khoản", "Có dấu hiệu tiền stablecoin co lại hoặc USDT lệch giá."),
    "Không đủ dữ liệu": ("Chưa đủ dữ liệu", ""),
}


def n0(v: float) -> str:
    return f"{v:,.0f}".replace(",", ".")


def pct(v: float, sign: bool = True) -> str:
    return (f"{v:+.2f}" if sign else f"{v:.2f}").replace(".", ",") + "%"


def _v(snap: dict, key: str) -> float | None:
    return (snap.get("metrics", {}).get(key) or {}).get("value")


def _crypto(snap: dict) -> tuple[str | None, str | None]:
    moves = [(c, (snap["metrics"].get(f"{c.lower()}_price") or {}).get("change_24h")) for c in COINS]
    moves = [(c, x) for c, x in moves if x is not None]
    btc = _v(snap, "btc_price")
    if not moves or btc is None:
        return None, None
    btc_ch = dict(moves).get("BTC")
    up = sum(1 for _, x in moves if x > 0)
    best, worst = max(moves, key=lambda x: x[1]), min(moves, key=lambda x: x[1])
    head = "crypto tăng đồng loạt" if up == len(moves) else "crypto giảm đồng loạt" if up == 0 else "crypto phân hoá"
    text = f"BTC {n0(btc)} USD ({pct(btc_ch)} trong 24 giờ)." if btc_ch is not None else f"BTC {n0(btc)} USD."
    text += f" Mạnh nhất {best[0]} {pct(best[1])}, yếu nhất {worst[0]} {pct(worst[1])}."
    return head, text


def _fx(snap: dict) -> tuple[str | None, list[dict]]:
    bank, free = _v(snap, "usdvnd_vcb_sell"), _v(snap, "usdvnd_free_sell")
    mid = _v(snap, "usdtvnd_p2p_mid")
    head, rows = None, []
    if bank and free:
        d = free - bank
        side = "cao hơn" if d >= 0 else "thấp hơn"
        head = f"đô chợ đen {side} ngân hàng {n0(abs(d))} đồng"
        rows.append({"tag": "Đô la", "text": f"Vietcombank bán {n0(bank)}, chợ đen bán {n0(free)}: "
                                             f"{side} {n0(abs(d))} đồng ({pct(abs(d) / bank * 100, False)})."})
    elif bank:
        rows.append({"tag": "Đô la", "text": f"Vietcombank bán {n0(bank)} đồng."})
    if mid:
        parts = [f"Giá giữa trên các sàn P2P khoảng {n0(mid)} đồng"]
        if bank:
            parts.append(f"{pct((mid / bank - 1) * 100)} so với Vietcombank")
        if free:
            parts.append(f"{pct((mid / free - 1) * 100)} so với chợ đen")
        rows.append({"tag": "USDT", "text": ", ".join(parts) + "."})
    return head, rows


def build(snap: dict, today: dt.date) -> dict:
    tables = snap.get("tables", {})
    crypto_head, crypto_text = _crypto(snap)
    fx_head, fx_rows = _fx(snap)
    bullets = list(fx_rows)
    if crypto_text:
        bullets.append({"tag": "Crypto", "text": crypto_text})

    supply = (snap.get("metrics", {}).get("stablecoin_supply_total") or {}).get("change_7d")
    if supply is not None:
        flow = "tiền đang chảy vào thị trường crypto" if supply > 0 else "tiền đang rút khỏi thị trường crypto"
        bullets.append({"tag": "Dòng tiền", "text": f"Tổng cung stablecoin {pct(supply)} trong 7 ngày: {flow}."})

    fomc_next = (tables.get("fomc") or {}).get("next")
    if fomc_next:
        days = (dt.date.fromisoformat(fomc_next["end"]) - today).days
        if 0 <= days <= 14:
            bullets.append({"tag": "Lịch", "text": f"Còn {days} ngày đến kết quả họp FOMC "
                                                   f"({fomc_next['end'][8:]}/{fomc_next['end'][5:7]})."})

    headline = ", ".join(x for x in (crypto_head, fx_head) if x) or "Bản tin thị trường"
    headline = headline[0].upper() + headline[1:]
    label = (snap.get("regime") or {}).get("label", "")
    vi, why = REGIME_VI.get(label, (label, ""))
    return {"headline": headline, "bullets": bullets, "regime_vi": vi, "regime_why": why}
