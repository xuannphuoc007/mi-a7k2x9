/**
 * Key events in Bitcoin's history. Prices on the chart come from Coin Metrics
 * daily data (to 23 May 2026) and dated news sources afterwards; intraday
 * extremes are mentioned in the text where they differ from the daily close.
 */
export type EventKind = "crash" | "ath" | "halving" | "tech" | "adoption" | "regulation" | "macro" | "milestone";
export type Category = "tech" | "market" | "crisis" | "adoption" | "policy";

export type BtcEvent = {
  id: string;
  date: string;
  /** decimal year */
  t: number;
  kind: EventKind;
  cat: Category;
  chapter: number;
  /** label placement above (−) or below (+) the line */
  dy?: number;
  future?: boolean;
  en: { title: string; body: string };
  vi: { title: string; body: string };
};

const dy = (iso: string) => {
  const d = new Date(iso + "T12:00:00Z");
  const y = d.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  const end = Date.UTC(y + 1, 0, 1);
  return y + (d.getTime() - start) / (end - start);
};

const E = (
  id: string, date: string, kind: EventKind, cat: Category, chapter: number,
  en: [string, string], vi: [string, string], extra: Partial<BtcEvent> = {},
): BtcEvent => ({ id, date, t: dy(date), kind, cat, chapter, en: { title: en[0], body: en[1] }, vi: { title: vi[0], body: vi[1] }, ...extra });

export const events: BtcEvent[] = [
  // 0 — Genesis
  E("lehman", "2008-09-15", "macro", "crisis", 0,
    ["Lehman Brothers collapses", "The biggest bankruptcy in US history deepens the global financial crisis. Governments rush to rescue banks with public money."],
    ["Lehman Brothers sụp đổ", "Vụ phá sản lớn nhất lịch sử Mỹ đẩy khủng hoảng tài chính toàn cầu lên đỉnh điểm. Các chính phủ vội dùng tiền công để cứu ngân hàng."], { dy: -1 }),
  E("whitepaper", "2008-10-31", "tech", "tech", 0,
    ["The Bitcoin whitepaper", "Someone using the name Satoshi Nakamoto shares a 9-page paper: “Bitcoin: A Peer-to-Peer Electronic Cash System”."],
    ["Sách trắng Bitcoin", "Một người lấy tên Satoshi Nakamoto chia sẻ bài viết 9 trang: “Bitcoin: A Peer-to-Peer Electronic Cash System” (hệ thống tiền điện tử ngang hàng)."], { dy: 1 }),
  E("genesis", "2009-01-03", "tech", "tech", 0,
    ["The genesis block", "The first block is mined. Hidden inside is a newspaper headline about a second bank bailout."],
    ["Khối khởi nguyên", "Khối đầu tiên được đào. Bên trong giấu một dòng tít báo về gói cứu trợ ngân hàng lần thứ hai."], { dy: -1 }),
  E("firsttx", "2009-01-12", "tech", "tech", 0,
    ["First transaction", "Satoshi sends 10 BTC to programmer Hal Finney."],
    ["Giao dịch đầu tiên", "Satoshi gửi 10 BTC cho lập trình viên Hal Finney."], { dy: 1 }),
  // 1 — Pizza
  E("pizza", "2010-05-22", "adoption", "adoption", 1,
    ["Pizza Day: 10,000 BTC", "Laszlo Hanyecz pays 10,000 BTC for two pizzas — the first known purchase of real goods with bitcoin."],
    ["Ngày Pizza: 10.000 BTC", "Laszlo Hanyecz trả 10.000 BTC cho hai chiếc pizza — lần đầu tiên bitcoin được dùng để mua hàng thật."], { dy: -1 }),
  E("gox-open", "2010-07-18", "milestone", "market", 1,
    ["Mt. Gox starts trading", "An exchange called Mt. Gox opens. The first market prices are under 10 cents."],
    ["Mt. Gox bắt đầu giao dịch", "Sàn Mt. Gox mở cửa. Những mức giá đầu tiên chưa tới 10 xu."], { dy: 1 }),
  E("parity", "2011-02-09", "milestone", "market", 1,
    ["1 BTC = $1", "Bitcoin reaches parity with the US dollar for the first time."],
    ["1 BTC = 1 USD", "Lần đầu tiên bitcoin ngang giá đô la Mỹ."], { dy: -1 }),
  // 2 — Rules
  E("halving1", "2012-11-28", "halving", "tech", 2,
    ["1st halving: 50 → 25 BTC", "The reward for each new block is cut in half, exactly as the code says."],
    ["Halving lần 1: 50 → 25 BTC", "Phần thưởng cho mỗi khối mới giảm một nửa, đúng như mã nguồn quy định."], { dy: -1 }),
  // 3 — Bubbles
  E("peak2011", "2011-06-08", "ath", "market", 3,
    ["First bubble: $29", "Media attention sends the price from $1 to about $29 in four months."],
    ["Bong bóng đầu tiên: 29 USD", "Sự chú ý của báo chí đẩy giá từ 1 USD lên khoảng 29 USD chỉ trong bốn tháng."], { dy: -1 }),
  E("goxhack", "2011-06-19", "crash", "crisis", 3,
    ["Mt. Gox hacked", "A hack at the biggest exchange shakes trust. Over the next months the price falls more than 90%."],
    ["Mt. Gox bị hack", "Vụ hack ở sàn lớn nhất làm lung lay niềm tin. Trong những tháng sau, giá giảm hơn 90%."], { dy: 1 }),
  E("thousand", "2013-12-04", "ath", "market", 3,
    ["Above $1,000", "A second, bigger bubble: bitcoin closes above $1,100."],
    ["Vượt 1.000 USD", "Bong bóng thứ hai, lớn hơn: bitcoin đóng cửa trên 1.100 USD."], { dy: -1 }),
  E("goxcollapse", "2014-02-24", "crash", "crisis", 3,
    ["Mt. Gox collapses", "The exchange that handled most bitcoin trading stops; about 850,000 BTC are reported missing."],
    ["Mt. Gox sụp đổ", "Sàn từng xử lý phần lớn giao dịch bitcoin ngừng hoạt động; khoảng 850.000 BTC được báo là biến mất."], { dy: 1 }),
  // 4 — Mining
  E("halving2", "2016-07-09", "halving", "tech", 4,
    ["2nd halving: 25 → 12.5 BTC", "Fewer new coins per block — while the network's computing power keeps exploding."],
    ["Halving lần 2: 25 → 12,5 BTC", "Ít đồng mới hơn cho mỗi khối — trong khi sức mạnh tính toán của mạng vẫn tăng vọt."], { dy: -1 }),
  // 5 — Mania
  E("fork", "2017-08-01", "tech", "tech", 5,
    ["Block size war → a split", "After years of arguing about block size, a group splits off as Bitcoin Cash. Bitcoin activates its SegWit upgrade on 24 August."],
    ["Cuộc chiến kích thước khối → chia tách", "Sau nhiều năm tranh cãi về kích thước khối, một nhóm tách ra thành Bitcoin Cash. Bitcoin kích hoạt nâng cấp SegWit ngày 24/8."], { dy: 1 }),
  E("peak2017", "2017-12-16", "ath", "market", 5,
    ["Mania: ~$19,600", "A retail frenzy peaks. Regulated bitcoin futures start trading on CME the next day."],
    ["Cơn sốt: ~19.600 USD", "Cơn sốt nhà đầu tư cá nhân lên đỉnh. Hợp đồng tương lai bitcoin bắt đầu giao dịch trên sàn CME ngay hôm sau."], { dy: -1 }),
  E("winter", "2018-12-15", "crash", "market", 5,
    ["Crypto winter: −84%", "A year later bitcoin trades around $3,200, about 84% below its peak."],
    ["Mùa đông crypto: −84%", "Một năm sau, bitcoin còn khoảng 3.200 USD, thấp hơn đỉnh khoảng 84%."], { dy: 1 }),
  // 6 — Institutions
  E("blackthursday", "2020-03-12", "crash", "crisis", 6,
    ["Black Thursday", "COVID panic hits every market. Bitcoin loses nearly 40% in a single day."],
    ["Thứ Năm Đen", "Hoảng loạn vì COVID lan khắp các thị trường. Bitcoin mất gần 40% chỉ trong một ngày."], { dy: 1 }),
  E("halving3", "2020-05-11", "halving", "tech", 6,
    ["3rd halving: 12.5 → 6.25 BTC", "The supply cut lands in the middle of money printing to fight the pandemic."],
    ["Halving lần 3: 12,5 → 6,25 BTC", "Lần cắt giảm nguồn cung diễn ra giữa lúc các nước in tiền chống đại dịch."], { dy: -1 }),
  E("microstrategy", "2020-08-11", "adoption", "adoption", 6,
    ["A company buys bitcoin", "MicroStrategy (now Strategy) puts $250M into 21,454 BTC as its treasury reserve — and keeps buying."],
    ["Doanh nghiệp mua bitcoin", "MicroStrategy (nay là Strategy) dùng 250 triệu USD mua 21.454 BTC làm tài sản dự trữ — và tiếp tục mua thêm."], { dy: 1 }),
  E("tesla", "2021-02-08", "adoption", "adoption", 6,
    ["Tesla buys $1.5B", "A household-name company adds bitcoin to its balance sheet."],
    ["Tesla mua 1,5 tỷ USD", "Một công ty nổi tiếng đưa bitcoin vào bảng cân đối kế toán."], { dy: -1 }),
  E("coinbase", "2021-04-14", "adoption", "adoption", 6,
    ["Coinbase goes public", "A US crypto exchange lists on Nasdaq; bitcoin trades near $63,000."],
    ["Coinbase niêm yết", "Một sàn crypto Mỹ lên sàn Nasdaq; bitcoin giao dịch quanh 63.000 USD."], { dy: -1 }),
  E("chinaban", "2021-05-21", "regulation", "policy", 6,
    ["China cracks down on mining", "Miners pack up and leave China. The network's computing power falls by about half, then recovers within months."],
    ["Trung Quốc trấn áp đào coin", "Thợ đào rời Trung Quốc. Sức mạnh tính toán của mạng giảm khoảng một nửa, rồi hồi phục sau vài tháng."], { dy: 1 }),
  E("elsalvador", "2021-09-07", "regulation", "policy", 6,
    ["El Salvador: legal tender", "The first country to make bitcoin legal money. (In 2025, under an IMF deal, accepting it became voluntary.)"],
    ["El Salvador: tiền pháp định", "Quốc gia đầu tiên công nhận bitcoin là tiền hợp pháp. (Năm 2025, theo thoả thuận với IMF, việc chấp nhận bitcoin trở thành tự nguyện.)"], { dy: 1 }),
  E("ath2021", "2021-11-08", "ath", "market", 6,
    ["Peak: ~$67,500", "Daily close high (about $69,000 intraday). The Taproot upgrade activates a week later."],
    ["Đỉnh: ~67.500 USD", "Mức đóng cửa cao nhất (khoảng 69.000 USD trong phiên). Nâng cấp Taproot kích hoạt một tuần sau."], { dy: -1 }),
  // 7 — Dominoes
  E("luna", "2022-05-09", "crash", "crisis", 7,
    ["Terra/LUNA collapses", "A $40B+ 'algorithmic stablecoin' system unravels in days and drags the market down."],
    ["Terra/LUNA sụp đổ", "Hệ sinh thái 'stablecoin thuật toán' hơn 40 tỷ USD tan rã trong vài ngày, kéo cả thị trường đi xuống."], { dy: -1 }),
  E("celsius", "2022-06-13", "crash", "crisis", 7,
    ["Celsius freezes, 3AC fails", "A crypto lender blocks withdrawals; a large hedge fund (Three Arrows Capital) defaults soon after."],
    ["Celsius đóng băng, 3AC vỡ nợ", "Một nền tảng cho vay crypto chặn rút tiền; quỹ lớn Three Arrows Capital vỡ nợ ngay sau đó."], { dy: 1 }),
  E("ftx", "2022-11-11", "crash", "crisis", 7,
    ["FTX collapses", "One of the largest exchanges files for bankruptcy after customer funds are found missing."],
    ["FTX sụp đổ", "Một trong những sàn lớn nhất nộp đơn phá sản sau khi phát hiện tiền của khách hàng bị thiếu hụt."], { dy: -1 }),
  E("bottom2022", "2022-11-21", "crash", "market", 7,
    ["Bear market low: ~$15,800", "About 77% below the 2021 peak."],
    ["Đáy thị trường gấu: ~15.800 USD", "Thấp hơn khoảng 77% so với đỉnh 2021."], { dy: 1 }),
  // 8 — Wall Street
  E("etf", "2024-01-11", "adoption", "policy", 8,
    ["Spot Bitcoin ETFs launch", "US regulators approve funds that hold real bitcoin. Anyone with a brokerage account can now buy exposure."],
    ["Quỹ ETF Bitcoin giao ngay ra đời", "Cơ quan quản lý Mỹ duyệt các quỹ nắm giữ bitcoin thật. Ai có tài khoản chứng khoán cũng có thể đầu tư."], { dy: 1 }),
  E("ath2024", "2024-03-14", "ath", "market", 8,
    ["New high before a halving", "Above $71,000 — the first time a record came before the halving, not after."],
    ["Đỉnh mới trước halving", "Vượt 71.000 USD — lần đầu tiên kỷ lục đến trước halving thay vì sau."], { dy: -1 }),
  E("halving4", "2024-04-20", "halving", "tech", 8,
    ["4th halving: 6.25 → 3.125 BTC", "New supply drops to about 450 BTC a day."],
    ["Halving lần 4: 6,25 → 3,125 BTC", "Nguồn cung mới giảm còn khoảng 450 BTC mỗi ngày."], { dy: 1 }),
  E("100k", "2024-12-05", "ath", "market", 8,
    ["$100,000", "After the US election, bitcoin crosses six figures for the first time."],
    ["100.000 USD", "Sau bầu cử Mỹ, bitcoin lần đầu vượt mốc sáu chữ số."], { dy: -1 }),
  E("reserve", "2025-03-06", "regulation", "policy", 8,
    ["US Strategic Bitcoin Reserve", "An executive order says bitcoin seized by the government (about 200,000 BTC) will be held as a reserve, not sold."],
    ["Quỹ Dự trữ Bitcoin Chiến lược Mỹ", "Một sắc lệnh quy định bitcoin bị chính phủ tịch thu (khoảng 200.000 BTC) sẽ được giữ làm dự trữ, không bán."], { dy: 1 }),
  E("ath2025", "2025-10-06", "ath", "market", 8,
    ["All-time high: ~$126,000", "The record so far (intraday). Daily close about $124,800."],
    ["Đỉnh mọi thời đại: ~126.000 USD", "Kỷ lục đến nay (trong phiên). Đóng cửa ngày khoảng 124.800 USD."], { dy: -1 }),
  E("liquidation", "2025-10-10", "crash", "crisis", 8,
    ["Record $19B liquidation", "A surprise 100% US tariff on China sets off the largest wipe-out of leveraged bets in crypto history."],
    ["Thanh lý kỷ lục 19 tỷ USD", "Mức thuế 100% bất ngờ của Mỹ lên hàng Trung Quốc gây ra đợt thanh lý vị thế đòn bẩy lớn nhất lịch sử crypto."], { dy: 1 }),
  // 9 — Now
  E("crash2026", "2026-02-05", "crash", "crisis", 9,
    ["Flash crash to ~$60,000", "Leverage unwinds during a tech sell-off; bitcoin briefly falls more than 50% below its record."],
    ["Sập nhanh về ~60.000 USD", "Đòn bẩy bị xả giữa đợt bán tháo cổ phiếu công nghệ; bitcoin có lúc thấp hơn kỷ lục hơn 50%."], { dy: 1 }),
  E("june2026", "2026-06-30", "crash", "market", 9,
    ["Worst month since 2022", "June closes down about 20%, with record outflows from US spot ETFs."],
    ["Tháng tệ nhất kể từ 2022", "Tháng 6 đóng cửa giảm khoảng 20%, các quỹ ETF giao ngay Mỹ bị rút vốn kỷ lục."], { dy: 1 }),
  E("aug2026", "2026-08-31", "milestone", "market", 9,
    ["Best August since 2017", "A ~25% rebound from the summer lows."],
    ["Tháng 8 tốt nhất kể từ 2017", "Hồi phục khoảng 25% từ đáy mùa hè."], { dy: -1 }),
  E("fedhike", "2026-09-16", "macro", "crisis", 9,
    ["The Fed raises rates", "Higher interest rates make risky assets less attractive."],
    ["Fed tăng lãi suất", "Lãi suất cao hơn khiến tài sản rủi ro kém hấp dẫn."], { dy: 1 }),
  E("binance", "2026-10-29", "crash", "crisis", 9,
    ["Binance hack: $6.3B", "The largest crypto theft on record, attributed to North Korea-linked hackers. Binance says it will cover the losses."],
    ["Binance bị hack 6,3 tỷ USD", "Vụ trộm crypto lớn nhất từng ghi nhận, được cho là của nhóm hacker liên quan Triều Tiên. Binance cho biết sẽ bù đắp thiệt hại."], { dy: -1 }),
  E("nov2026", "2026-11-15", "crash", "market", 9,
    ["Four-month low near $62,000", "ETF outflows and rate fears push bitcoin roughly 50% below its record."],
    ["Đáy bốn tháng quanh 62.000 USD", "Dòng tiền rút khỏi ETF và lo ngại lãi suất đẩy bitcoin thấp hơn kỷ lục khoảng 50%."], { dy: 1 }),
  E("halving5", "2028-04-15", "halving", "tech", 2,
    ["5th halving (est. 2028)", "Expected around April 2028: 3.125 → 1.5625 BTC."],
    ["Halving lần 5 (dự kiến 2028)", "Dự kiến khoảng tháng 4/2028: 3,125 → 1,5625 BTC."], { dy: -1, future: true }),
];

export const HALVINGS = [
  { t: dy("2012-11-28"), reward: 25, height: 210000 },
  { t: dy("2016-07-09"), reward: 12.5, height: 420000 },
  { t: dy("2020-05-11"), reward: 6.25, height: 630000 },
  { t: dy("2024-04-20"), reward: 3.125, height: 840000 },
];
export const GENESIS_T = dy("2009-01-03");
export const toDecimalYear = dy;

export function yearToDate(t: number) {
  const y = Math.floor(t);
  const start = Date.UTC(y, 0, 1);
  const end = Date.UTC(y + 1, 0, 1);
  return new Date(start + (t - y) * (end - start));
}
