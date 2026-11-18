/** Key moments for Binance and BNB (Act 2 · The Journey). Prices are read from the series at each date. */
export type JKind = "milestone" | "upgrade" | "hack" | "peak" | "crash" | "legal";
export type JEvent = { id: string; date: string; t: number; kind: JKind; en: { title: string; body: string }; vi: { title: string; body: string } };

const dy = (iso: string) => {
  const d = new Date(iso + "T12:00:00Z");
  const y = d.getUTCFullYear();
  return y + (d.getTime() - Date.UTC(y, 0, 1)) / (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1));
};
const E = (id: string, date: string, kind: JKind, en: [string, string], vi: [string, string]): JEvent => ({
  id, date, t: dy(date), kind, en: { title: en[0], body: en[1] }, vi: { title: vi[0], body: vi[1] },
});

export const journeyEvents: JEvent[] = [
  E("ico", "2017-07-14", "milestone",
    ["Binance opens", "Funded by a $15 million sale of BNB tokens at roughly 10–15 cents each."],
    ["Binance mở cửa", "Gọi vốn 15 triệu USD bằng cách bán token BNB với giá khoảng 10–15 xu."]),
  E("china", "2017-09-15", "legal",
    ["China bans exchanges", "Binance moves operations abroad — the start of years without a fixed headquarters."],
    ["Trung Quốc cấm sàn", "Binance dời hoạt động ra nước ngoài — mở đầu nhiều năm không có trụ sở cố định."]),
  E("hack2019", "2019-05-07", "hack",
    ["7,000 BTC stolen", "About $40 million taken from a hot wallet; Binance covers it from its emergency fund (SAFU)."],
    ["Mất 7.000 BTC", "Khoảng 40 triệu USD bị lấy từ ví nóng; Binance bù bằng quỹ khẩn cấp (SAFU)."]),
  E("bsc", "2020-09-01", "upgrade",
    ["BNB Smart Chain launches", "Binance's own Ethereum-compatible blockchain; BNB becomes its fuel."],
    ["BNB Smart Chain ra mắt", "Blockchain riêng của Binance, tương thích Ethereum; BNB thành nhiên liệu của nó."]),
  E("peak2021", "2021-05-10", "peak",
    ["2021 peak ≈ $690", "The bull market and cheap BNB Chain fees push BNB to a new high."],
    ["Đỉnh 2021 ≈ 690 USD", "Thị trường bò và phí rẻ trên BNB Chain đẩy BNB lên đỉnh mới."]),
  E("bridge", "2022-10-06", "hack",
    ["Bridge hack ≈ $570M", "Validators halt BNB Chain within hours — limiting losses, and raising questions about who controls it."],
    ["Cầu nối bị hack ≈ 570 triệu USD", "Các validator dừng BNB Chain trong vài giờ — hạn chế thiệt hại, nhưng làm dấy lên câu hỏi ai kiểm soát chuỗi."]),
  E("ftx", "2022-11-11", "crash",
    ["FTX collapses", "Binance's main rival goes bankrupt after using customers' money. Binance grows even bigger."],
    ["FTX sụp đổ", "Đối thủ lớn nhất của Binance phá sản sau khi dùng tiền khách. Binance càng lớn hơn."]),
  E("sec", "2023-06-05", "legal",
    ["SEC sues Binance and CZ", "The U.S. securities regulator files a civil case (dropped in May 2025)."],
    ["SEC kiện Binance và CZ", "Cơ quan chứng khoán Mỹ khởi kiện dân sự (rút đơn tháng 5/2025)."]),
  E("plea", "2023-11-21", "legal",
    ["Guilty pleas, $4.3 billion", "Binance and CZ plead guilty to U.S. charges; CZ steps down."],
    ["Nhận tội, 4,3 tỷ USD", "Binance và CZ nhận tội trước các cáo buộc tại Mỹ; CZ từ chức."]),
  E("prison", "2024-04-30", "legal",
    ["CZ sentenced to 4 months", "He serves the sentence and is released in September 2024."],
    ["CZ lĩnh 4 tháng tù", "Ông chấp hành án và ra tù tháng 9/2024."]),
  E("mgx", "2025-05-01", "milestone",
    ["$2B deal settled in USD1", "Abu Dhabi's MGX investment uses the Trump-family-linked stablecoin."],
    ["Thương vụ 2 tỷ USD bằng USD1", "Khoản đầu tư của MGX (Abu Dhabi) dùng stablecoin gắn với gia đình Trump."]),
  E("crash1010", "2025-10-10", "crash",
    ["Record, then the 10/10 crash", "BNB closes at a record ≈ $1,310 on 7 Oct (≈ $1,375 intraday). On 10 Oct $19B+ is liquidated market-wide and Binance repays ≈ $283M after collateral depegs on its platform."],
    ["Kỷ lục, rồi cú sập 10/10", "BNB đóng cửa kỷ lục ≈ 1.310 USD ngày 7/10 (≈ 1.375 USD trong phiên). Ngày 10/10 hơn 19 tỷ USD bị thanh lý toàn thị trường và Binance hoàn ≈ 283 triệu USD sau khi tài sản thế chấp mất neo trên sàn."]),
  E("pardon", "2025-10-23", "legal",
    ["CZ pardoned", "President Trump grants a full pardon; critics cite conflicts of interest."],
    ["CZ được ân xá", "Tổng thống Trump ân xá toàn phần; giới phê bình nêu xung đột lợi ích."]),
  E("iran", "2026-02-23", "legal",
    ["Iran-flow report", "A WSJ report triggers Senate letters; Binance denies it and sues for defamation."],
    ["Tin về dòng tiền Iran", "Bài báo của WSJ dẫn tới thư của Thượng viện; Binance phủ nhận và kiện phỉ báng."]),
  E("hack2026", "2026-10-29", "hack",
    ["≈ $6.3B stolen", "The largest crypto theft on record; Binance covers it with company funds."],
    ["≈ 6,3 tỷ USD bị trộm", "Vụ trộm crypto lớn nhất từng ghi nhận; Binance bù bằng tiền công ty."]),
];
