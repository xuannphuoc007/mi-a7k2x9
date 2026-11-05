"""Tin lớn ảnh hưởng liên thị trường, lấy từ RSS công khai.

Không dùng AI: tin được chấm điểm bằng từ khoá. Tin càng thuộc chủ đề tác động rộng
(lãi suất, lạm phát, thuế quan, chiến sự...), càng nhiều nguồn cùng đưa thì điểm càng cao.
Tiêu đề giữ nguyên ngôn ngữ gốc của nguồn.
"""
from __future__ import annotations

import datetime as dt
import email.utils
import html
import re
import xml.etree.ElementTree as ET

from ..common import http_get, iso_vn, now_vn

FEEDS = (
    ("CNBC", "https://www.cnbc.com/id/100003114/device/rss/rss.html", 1.0),
    ("CNBC", "https://www.cnbc.com/id/20910258/device/rss/rss.html", 1.0),
    ("BBC", "https://feeds.bbci.co.uk/news/business/rss.xml", 1.0),
    ("Federal Reserve", "https://www.federalreserve.gov/feeds/press_all.xml", 1.5),
    ("CoinDesk", "https://www.coindesk.com/arc/outboundfeeds/rss/", 1.0),
    ("Cointelegraph", "https://cointelegraph.com/rss", 0.8),
    ("Decrypt", "https://decrypt.co/feed", 0.8),
    ("VnExpress", "https://vnexpress.net/rss/kinh-doanh.rss", 1.0),
    ("CafeF", "https://cafef.vn/tai-chinh-ngan-hang.rss", 1.0),
    ("CafeF", "https://cafef.vn/thi-truong-chung-khoan.rss", 0.8),
)
WINDOW_HOURS = 30
MAX_ITEMS = 10
MAX_PER_TOPIC = 3
MIN_SCORE = 3.0

# (mã, tên, trọng số, thị trường chịu tác động, vì sao đáng chú ý, từ khoá)
TOPICS = (
    ("fed", "Lãi suất", 5, ["USD", "Trái phiếu", "Chứng khoán", "Crypto"],
     "Lãi suất của các ngân hàng trung ương lớn chi phối đồng USD và khẩu vị rủi ro trên mọi thị trường.",
     ["fomc", "fed chair", "powell", "rate cut", "rate cuts", "rate hike", "rate hikes", "interest rate", "interest rates",
      "federal funds", "fed giảm lãi suất", "fed tăng lãi suất", "fed giữ", "chủ tịch fed"]),
    ("inflation", "Lạm phát & việc làm", 5, ["USD", "Trái phiếu", "Chứng khoán", "Crypto"],
     "Số liệu này quyết định kỳ vọng về đường đi của lãi suất.",
     ["cpi", "pce", "inflation", "payrolls", "nonfarm", "jobs report", "unemployment", "jobless", "lạm phát"]),
    ("sbv", "Tỷ giá & NHNN", 5, ["USD/VND", "USDT/VND", "VN-Index"],
     "Tác động trực tiếp đến giá đô trong nước và thanh khoản tiền đồng.",
     ["nhnn", "ngân hàng nhà nước", "tỷ giá", "tỉ giá", "giá usd", "đồng usd", "usd/vnd", "tín phiếu", "room tín dụng",
      "liên ngân hàng", "tiền đồng"]),
    ("trade", "Thuế quan & thương mại", 4, ["USD", "Chứng khoán", "Hàng hoá", "VN-Index"],
     "Căng thẳng thương mại ảnh hưởng tăng trưởng toàn cầu và xuất khẩu của Việt Nam.",
     ["tariff", "tariffs", "trade war", "trade deal", "export controls", "thuế quan", "thuế đối ứng", "chiến tranh thương mại"]),
    ("geo", "Địa chính trị", 4, ["Dầu", "Vàng", "USD", "Crypto"],
     "Rủi ro địa chính trị đẩy dòng tiền về tài sản trú ẩn và làm giá năng lượng biến động.",
     ["war", "invasion", "missile", "airstrike", "ceasefire", "sanctions", "strait of hormuz", "chiến sự", "chiến tranh",
      "lệnh trừng phạt", "ngừng bắn", "không kích"]),
    ("politics", "Chính trị & tài khoá Mỹ", 3, ["USD", "Trái phiếu", "Chứng khoán"],
     "Thay đổi chính sách tài khoá của Mỹ ảnh hưởng lợi suất và khẩu vị rủi ro.",
     ["midterm", "midterms", "election", "government shutdown", "debt ceiling", "bầu cử mỹ", "trần nợ"]),
    ("energy", "Dầu & hàng hoá", 3, ["Dầu", "Lạm phát", "VN-Index"],
     "Giá năng lượng tác động trực tiếp đến lạm phát.",
     ["oil price", "oil prices", "crude", "opec", "brent", "giá dầu", "giá xăng"]),
    ("gold", "Vàng", 3, ["Vàng", "USD", "USD/VND"],
     "Giá vàng phản ánh nhu cầu trú ẩn và tác động đến cầu ngoại tệ tự do trong nước.",
     ["gold price", "gold prices", "gold record", "giá vàng", "vàng sjc"]),
    ("markets", "Chứng khoán toàn cầu", 2, ["Chứng khoán", "Crypto"],
     "Biến động mạnh của chứng khoán thường lan sang tài sản rủi ro khác.",
     ["wall street", "s&p 500", "nasdaq", "dow jones", "stocks plunge", "stocks tumble", "market selloff", "vn-index", "chứng khoán"]),
    ("crypto_policy", "Pháp lý crypto", 4, ["Crypto", "Stablecoin"],
     "Thay đổi pháp lý làm thay đổi dòng vốn tổ chức vào crypto.",
     ["sec", "cftc", "crypto bill", "market structure bill", "clarity act", "genius act", "spot etf", "etf approval",
      "tài sản số", "tài sản mã hóa", "sàn tiền số", "sàn tài sản"]),
    ("crypto_risk", "Rủi ro crypto", 4, ["Crypto", "Stablecoin"],
     "Sự cố lớn làm giảm niềm tin và có thể kéo theo bán tháo.",
     ["hack", "hacked", "exploit", "depeg", "depegged", "insolvency", "liquidations", "liquidated", "drained"]),
    ("crypto_flow", "Dòng tiền crypto", 3, ["Crypto", "Stablecoin"],
     "Dòng tiền vào ra quỹ ETF và stablecoin là chỉ báo sớm cho giá crypto.",
     ["etf inflows", "etf outflows", "etf flows", "bitcoin etf", "ether etf", "tether", "usdt", "usdc", "stablecoin",
      "stablecoins", "bitcoin", "btc"]),
)
INTENSE = ["plunge", "plunges", "surge", "surges", "soar", "soars", "tumble", "tumbles", "crash", "crashes", "record",
           "historic", "biggest", "emergency", "lao dốc", "kỷ lục", "giảm mạnh", "tăng mạnh", "khẩn cấp", "sụp đổ"]
NOISE = ["price prediction", "sponsored", "how to", "best crypto", "podcast", "opinion", "quiz", "giveaway"]
STOP = {"the", "a", "an", "of", "to", "in", "on", "for", "and", "as", "at", "by", "is", "are", "with", "from", "after", "its",
        "it", "that", "this", "be", "will", "could", "says", "say", "new", "over", "more", "than", "how", "what", "why"}


def _kw(words: list[str]) -> re.Pattern:
    return re.compile(r"(?<![\w])(?:" + "|".join(re.escape(w) for w in words) + r")(?![\w])", re.I)


_TOPICS = [(t, _kw(t[5])) for t in TOPICS]
_INTENSE, _NOISE = _kw(INTENSE), _kw(NOISE)


def _clean(s: str | None) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def _date(s: str | None) -> dt.datetime | None:
    if not s:
        return None
    try:
        t = email.utils.parsedate_to_datetime(s)
    except (TypeError, ValueError):
        try:
            t = dt.datetime.fromisoformat(s.strip().replace("Z", "+00:00"))
        except ValueError:
            return None
    return t if t.tzinfo else t.replace(tzinfo=dt.timezone.utc)


def parse_feed(raw: bytes, source: str, weight: float) -> list[dict]:
    root = ET.fromstring(raw)
    out = []
    for it in root.iter("item"):
        def get(tag: str) -> str | None:
            return next((c.text for c in it if c.tag == tag or c.tag.endswith("}" + tag)), None)
        title, link = _clean(get("title")), _clean(get("link"))
        published = _date(get("pubDate") or get("date"))
        if title and link and published:
            out.append({"title": title, "link": link, "published": published, "source": source, "weight": weight})
    return out


def score(item: dict) -> dict | None:
    """Chấm điểm một tin; tin không thuộc chủ đề nào hoặc là tin rác thì bỏ."""
    title = item["title"]
    if _NOISE.search(title):
        return None
    hits = [t for t, rx in _TOPICS if rx.search(title)]
    if not hits:
        return None
    main = max(hits, key=lambda t: t[2])
    s = main[2] * item["weight"] + 0.5 * (len(hits) - 1) + (1.5 if _INTENSE.search(title) else 0)
    markets = list(dict.fromkeys(m for t in hits for m in t[3]))[:4]
    return {**item, "topic": main[0], "topic_label": main[1], "why": main[4], "markets": markets, "score": s}


def _tokens(title: str) -> set[str]:
    return {w for w in re.findall(r"[\w']+", title.lower()) if w not in STOP and len(w) > 2}


def cluster(items: list[dict]) -> list[dict]:
    """Gộp các tin cùng sự kiện. Nhiều nguồn cùng đưa thì điểm cao hơn."""
    groups: list[dict] = []
    for it in sorted(items, key=lambda x: -x["score"]):
        tk = _tokens(it["title"])
        for g in groups:
            union = tk | g["_tokens"]
            if union and len(tk & g["_tokens"]) / len(union) >= 0.4:
                if it["source"] not in g["sources"]:
                    g["sources"].append(it["source"])
                    g["score"] += 1.0
                break
        else:
            groups.append({**it, "sources": [it["source"]], "_tokens": tk})
    return groups


def rank(items: list[dict], now: dt.datetime) -> list[dict]:
    window = dt.timedelta(hours=WINDOW_HOURS)
    seen, scored = set(), []
    for it in items:
        age = now - it["published"]
        if it["link"] in seen or not dt.timedelta(hours=-1) <= age <= window:
            continue
        seen.add(it["link"])
        s = score(it)
        if s:
            scored.append(s)
    out, per_topic = [], {}
    for g in sorted(cluster(scored), key=lambda x: (-x["score"], -x["published"].timestamp())):
        if g["score"] < MIN_SCORE or per_topic.get(g["topic"], 0) >= MAX_PER_TOPIC:
            continue
        per_topic[g["topic"]] = per_topic.get(g["topic"], 0) + 1
        out.append({"title": g["title"], "link": g["link"], "source": g["source"], "sources": g["sources"],
                    "published": iso_vn(g["published"]), "topic": g["topic"], "topic_label": g["topic_label"],
                    "why": g["why"], "markets": g["markets"], "score": round(g["score"], 1),
                    "lang": "vi" if g["source"] in ("VnExpress", "CafeF") else "en"})
        if len(out) >= MAX_ITEMS:
            break
    return out


def collect(ctx) -> dict:
    items, errors, ok = [], [], 0
    for source, url, weight in FEEDS:
        try:
            raw = http_get(url, as_bytes=True, headers={"Accept": "application/rss+xml, application/xml, text/xml"})
            items += parse_feed(raw, source, weight)
            ok += 1
        except Exception as e:  # noqa: BLE001
            errors.append(f"{source}: {str(e)[:120]}")
    if not ok:
        raise RuntimeError("; ".join(errors[:3]))
    return {"tables": {"news": rank(items, now_vn())}, "warnings": errors}
