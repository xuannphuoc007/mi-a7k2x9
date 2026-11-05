"""Đánh giá hướng tác động của tin, theo 3 lớp độc lập, không gộp thành một điểm:

1. effects  — quy tắc theo sự kiện: thị trường nào thường tăng hay giảm. Không khớp quy tắc nào
              thì để trống ("chưa rõ hướng"), không đoán.
2. tone     — giọng tin do mô hình ngôn ngữ chấm (xem tone.py). Chỉ tin tiếng Anh, có thể không có.
3. reaction — thị trường thực tế đã đi thế nào trong ngày. Chỉ đặt cạnh nhau, không chứng minh
              tin nào gây ra biến động.
"""
from __future__ import annotations

import re

UP = ("hike", "hikes", "hiked", "raise", "raises", "raised", "rise", "rises", "rose", "rising", "surge", "surges", "surged",
      "soar", "soars", "soared", "jump", "jumps", "jumped", "climb", "climbs", "climbed", "gain", "gains", "gained", "rally",
      "rallies", "rallied", "rebound", "rebounds", "rebounded", "recover", "recovers", "recovered", "lên cao nhất", "tăng", "tăng mạnh", "tăng vọt", "vọt", "phục hồi", "hồi phục")
DOWN = ("cut", "cuts", "fall", "falls", "fell", "falling", "drop", "drops", "dropped", "plunge", "plunges", "plunged",
        "tumble", "tumbles", "tumbled", "slide", "slides", "slid", "slump", "slumps", "slumped", "sink", "sinks", "sank",
        "crash", "crashes", "crashed", "sell-off", "selloff", "giảm", "giảm mạnh", "lao dốc", "rớt", "sụt", "tụt", "bốc hơi")
# Từ khiến câu không còn là khẳng định, hoặc nói về tương lai không chắc: thà để "chưa rõ" còn hơn gắn sai
HEDGE = r"\b(no|not|won't|unlikely|without|despite|if|whether|could|may|might|why|what|how|delay|delays|pause|pauses|rule out|rules out)\b|\b(không|chưa|liệu|nếu|vì sao|tại sao|có thể)\b|\?"
FOREIGN = (r"\b(euro ?zone|ecb|bank of england|boe|britain|british|uk|japan|boj|bank of japan|china|pboc|canada|australia|india|"
           r"germany|france|anh|nhật bản|trung quốc|châu âu)\b")
FED = (r"\b(fed|fed's|federal reserve|fomc|powell|barkin|waller|bowman|williams|goolsbee|daly|kashkari|hammack|logan|bostic|"
       r"musalem|schmid|jefferson|miran)\b")

_FLAGS = re.I


def _rx(words) -> str:
    return r"(?:" + "|".join(re.escape(w) for w in sorted(words, key=len, reverse=True)) + r")"


# Chủ thể đứng trước từ chỉ hướng, cách nhau tối đa 3 từ: "giá vàng thế giới tăng mạnh", "bitcoin plunges".
# Có (?!\s*cường) để "tăng cường theo dõi" không bị coi là "tăng".
def _moves(subject: str, words) -> re.Pattern:
    return re.compile(rf"(?<!\w)(?:{subject})(?!\w)(?:[\s,]+[\w'%./:-]+){{0,3}}?[\s,:]+{_rx(words)}(?!\w)(?!\s*cường)", _FLAGS)


ASSETS = (
    ("Crypto", r"bitcoin|btc|crypto|cryptocurrency|ether|ethereum|tiền số|tiền ảo|tiền mã hóa"),
    ("Chứng khoán", r"stocks|stock market|shares|nasdaq|s&p 500|dow|dow jones|wall street|chứng khoán mỹ"),
    ("VN-Index", r"vn-index|chứng khoán việt nam|chứng khoán"),
    ("Vàng", r"gold|giá vàng|vàng thế giới|vàng sjc|vàng"),
    ("Dầu", r"oil|crude|brent|giá dầu|giá xăng|dầu"),
    ("USD/VND", r"tỷ giá usd|tỷ giá|tỉ giá|giá usd|đồng usd|đô la mỹ|usd"),
    ("USD", r"dollar|greenback"),
    ("Lợi suất", r"treasury yields?|yields?"),
)
_ERASE = re.compile(r"\b(erases?|erased|wipes? out|gives? back)\b[\s\w-]*\b(rally|gains?|rebound)\b", _FLAGS)
_ASSET_RX = [(name, s, _moves(s, UP), _moves(s, DOWN)) for name, s in ASSETS]

_RISK_OFF = {"USD": "up", "Lợi suất": "up", "Chứng khoán": "down", "Crypto": "down", "Vàng": "down"}
_RISK_ON = {"USD": "down", "Lợi suất": "down", "Chứng khoán": "up", "Crypto": "up", "Vàng": "up"}

# (chủ đề áp dụng, điều kiện phải có, điều kiện loại trừ, tác động, cơ sở). Gắn theo chủ đề chính của tin để
# một từ nhắc thoáng qua như "since Iran war" không kích hoạt quy tắc chiến sự.
RULES = (
    ("fed", [FED, r"\b(rate hikes?|hikes? rates?|raises? (interest )?rates?)\b|tăng lãi suất"], FOREIGN, _RISK_OFF,
     "Fed thắt chặt thường làm USD và lợi suất tăng, tài sản rủi ro giảm."),
    ("fed", [FED, r"\b(rate cuts?|cuts? (interest )?rates?|lowers? rates?)\b|giảm lãi suất|hạ lãi suất"], FOREIGN, _RISK_ON,
     "Fed nới lỏng thường làm USD và lợi suất giảm, tài sản rủi ro tăng."),
    ("inflation", [rf"(?:{r'cpi|pce|inflation|lạm phát'})(?:\s+[\w'%.-]+){{0,3}}?\s+(?:hits?|{_rx(UP)}|hotter|higher|tops?)(?!\w)"], FOREIGN, _RISK_OFF,
     "Lạm phát Mỹ cao hơn làm giảm khả năng Fed nới lỏng."),
    ("inflation", [rf"(?:{r'cpi|pce|inflation|lạm phát'})(?:\s+[\w'%.-]+){{0,3}}?\s+(?:cools?|eases?|{_rx(DOWN)}|lower|slows?)(?!\w)"], FOREIGN, _RISK_ON,
     "Lạm phát Mỹ hạ nhiệt mở thêm dư địa cho Fed nới lỏng."),
    ("inflation", [r"\b(payrolls?|jobs? report|nonfarm)\b.*\b(beat|beats|strong|stronger|surge|surges|jump|jumps)\b"], FOREIGN,
     {"USD": "up", "Lợi suất": "up"}, "Việc làm Mỹ mạnh làm giảm khả năng Fed nới lỏng."),
    ("inflation", [r"\b(payrolls?|jobs? report|nonfarm)\b.*\b(miss|misses|weak|weaker|fall|falls|drop|drops)\b|\bunemployment\b.*\b(rise|rises|jump|jumps|higher)\b"], FOREIGN,
     {"USD": "down", "Lợi suất": "down"}, "Việc làm Mỹ yếu làm tăng khả năng Fed nới lỏng."),
    ("trade", [r"\b(impose|imposes|new|raise|raises|hike|hikes|threaten|threatens)\b.*\btariffs?\b|\btariffs?\b.*\b(hike|hikes|threat|threats|raise|raises)\b|áp thuế|tăng thuế"], r"\b(cut|cuts|lower|lowers|pause|pauses|deal)\b",
     {"Chứng khoán": "down", "VN-Index": "down"}, "Thuế quan cao hơn ảnh hưởng tăng trưởng và xuất khẩu."),
    ("trade", [r"\b(trade deal|cuts? tariffs?|lowers? tariffs?|pauses? tariffs?|tariff (cut|pause))\b|thỏa thuận thương mại|giảm thuế"], None,
     {"Chứng khoán": "up", "VN-Index": "up"}, "Giảm căng thẳng thương mại hỗ trợ tăng trưởng và xuất khẩu."),
    ("geo", [r"\b(invasion|missile|missiles|airstrike|airstrikes|attack|attacks|escalates?|escalation|sanctions)\b|không kích|lệnh trừng phạt|leo thang"], r"\b(ceasefire|truce|peace)\b|ngừng bắn",
     {"Dầu": "up", "Vàng": "up", "Chứng khoán": "down", "Crypto": "down"}, "Căng thẳng địa chính trị đẩy tiền về tài sản trú ẩn."),
    ("geo", [r"\b(ceasefire|truce|peace (deal|talks))\b|ngừng bắn|hòa đàm"], None,
     {"Dầu": "down", "Vàng": "down", "Chứng khoán": "up"}, "Căng thẳng hạ nhiệt làm giảm nhu cầu trú ẩn."),
    ("crypto_risk", [r"\b(hack|hacked|exploit|exploited|drained|depeg|depegged|insolvency|insolvent)\b"],
     r"\b(must|prove|cover|covers|reimburse|reimburses|compensate|compensates|recover|recovers|reopen|reopening|setback)\b|bù đắp|khắc phục|hoàn trả",
     {"Crypto": "down"}, "Sự cố an ninh hoặc mất khả năng thanh toán làm giảm niềm tin."),
    ("crypto_flow", [r"\betf inflows?\b|\binflows?\b.*\betfs?\b|\betfs?\b.*\b(inflows?|draws?)\b"], None, {"Crypto": "up"}, "Tiền vào quỹ ETF là lực mua trực tiếp."),
    ("crypto_flow", [r"\betf outflows?\b|\boutflows?\b.*\betfs?\b|\betfs?\b.*\boutflows?\b"], None, {"Crypto": "down"}, "Tiền rút khỏi quỹ ETF là lực bán trực tiếp."),
    ("crypto_policy", [r"\b(approves?|approved|passes|passed|signs?|signed)\b.*\b(etf|crypto|stablecoin|clarity act|genius act|market structure)\b"], None,
     {"Crypto": "up"}, "Pháp lý rõ ràng hơn thu hút dòng vốn tổ chức."),
    ("crypto_policy", [r"\b(bans?|banned|sues?|sued|lawsuit|crackdown|charges)\b.*\b(crypto|exchange|binance|coinbase|stablecoin|tether)\b|cấm.*(tiền số|tiền ảo|crypto)"], None,
     {"Crypto": "down"}, "Siết pháp lý làm tăng rủi ro cho thị trường crypto."),
)
_RULES = [(topic, [re.compile(p, _FLAGS) for p in need], re.compile(block, _FLAGS) if block else None, fx, why)
          for topic, need, block, fx, why in RULES]
_HEDGE = re.compile(HEDGE, _FLAGS)


def effects(title: str, topic: str) -> dict:
    """Trả về {'effects': [{'market', 'dir'}], 'basis': str | None}. Rỗng nghĩa là chưa rõ hướng."""
    if _HEDGE.search(title):
        return {"effects": [], "basis": None}
    fx: dict[str, str] = {}
    basis = None
    for t, need, block, rule_fx, why in _RULES:
        if t == topic and all(r.search(title) for r in need) and not (block and block.search(title)):
            fx.update(rule_fx)
            basis = why
            break
    # Tiêu đề nói thẳng tài sản nào tăng giảm: tin theo câu chữ, ưu tiên hơn suy luận từ quy tắc
    stated = {}
    for market, subject, up, down in _ASSET_RX:
        u, d = up.search(title), down.search(title)
        # "Bitcoin erases rally", "stocks erase gains": chủ thể đứng ngay trước cụm xoá đà tăng
        erased = re.search(rf"(?<!\w)(?:{subject})(?!\w)(?:\s+[\w'-]+){{0,2}}?\s+{_ERASE.pattern}", title, _FLAGS)
        if erased:
            stated[market] = "down"
            continue
        if u and d:
            continue  # vừa tăng vừa giảm trong một câu: không kết luận
        if u or d:
            stated[market] = "up" if u else "down"
    if "VN-Index" in stated and "Chứng khoán" in stated:
        del stated["VN-Index"]
    if stated:
        fx.update(stated)
        basis = basis or "Tiêu đề nêu trực tiếp diễn biến giá."
    return {"effects": [{"market": m, "dir": d} for m, d in fx.items()], "basis": basis}


def reactions(snap: dict) -> dict[str, dict]:
    """Biến động thực tế theo thị trường, từ số liệu đã thu thập trong ngày."""
    m = snap.get("metrics", {})

    def add(market, label, key, unit="%"):
        x = (m.get(key) or {}).get("change_24h")
        if x is not None and (m.get(key) or {}).get("quality") == "ok":
            out[market] = {"label": label, "value": round(x, 2), "unit": (m.get(key) or {}).get("change_unit") or unit}

    out: dict[str, dict] = {}
    add("Crypto", "BTC", "btc_price")
    add("Lợi suất", "Lợi suất 10 năm", "dgs10", "bp")
    add("Trái phiếu", "Lợi suất 10 năm", "dgs10", "bp")
    add("USD", "Chỉ số USD", "dtwexbgs")
    add("USD/VND", "Đô chợ đen", "usdvnd_free_sell", "đ")
    add("USDT/VND", "USDT/VND", "usdtvnd_p2p_mid", "đ")
    return out


def annotate(snap: dict, tones: dict[str, dict] | None = None) -> None:
    """Gắn 3 lớp đánh giá vào từng tin, tại chỗ."""
    tones = tones or {}
    rx = reactions(snap)
    for n in snap.get("tables", {}).get("news", []) or []:
        res = effects(n["title"], n["topic"])
        n["effects"], n["effects_basis"] = res["effects"], res["basis"]
        n["tone"] = tones.get(n["title"])
        wanted = [e["market"] for e in n["effects"]] or n.get("markets", [])
        seen, react = set(), []
        for market in wanted:
            r = rx.get(market)
            if r and r["label"] not in seen:
                seen.add(r["label"])
                react.append(r)
        n["reaction"] = react
