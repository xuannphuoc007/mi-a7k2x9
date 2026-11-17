/** Key moments in Ethereum's history (Act 2 · The Journey). Prices are read from the series at each date. */
export type JKind = "milestone" | "upgrade" | "hack" | "peak" | "crash";
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
  E("launch", "2015-07-30", "milestone",
    ["Ethereum goes live", "The first block of the 'world computer' is produced. For the first time anyone can upload a small program that runs on thousands of computers at once."],
    ["Ethereum chính thức chạy", "Khối đầu tiên của 'chiếc máy tính chung của thế giới' ra đời. Lần đầu tiên ai cũng có thể tải lên một chương trình nhỏ chạy cùng lúc trên hàng nghìn máy tính."]),
  E("dao", "2016-06-17", "hack",
    ["The DAO is drained", "A bug in a popular investment contract lets an attacker take about 3.6 million ETH. The code did exactly what it said — just not what people meant."],
    ["Quỹ The DAO bị rút sạch", "Một lỗi trong hợp đồng đầu tư nổi tiếng cho phép kẻ tấn công lấy khoảng 3,6 triệu ETH. Code làm đúng những gì nó viết — chỉ là không đúng ý người viết."]),
  E("fork", "2016-07-20", "crash",
    ["The community splits in two", "Most users agree to rewrite history and return the money. A minority refuses: 'code is law'. Their chain lives on as Ethereum Classic."],
    ["Cộng đồng tách làm đôi", "Đa số đồng ý viết lại lịch sử để trả tiền cho nạn nhân. Một nhóm nhỏ phản đối: 'code là luật'. Chuỗi của họ tồn tại đến nay với tên Ethereum Classic."]),
  E("ico", "2018-01-13", "peak",
    ["ICO fever peaks", "Thousands of start-ups raise money by selling their own tokens on Ethereum. ETH goes from about $8 a year earlier to over $1,300 — then falls more than 90%."],
    ["Cơn sốt ICO lên đỉnh", "Hàng nghìn start-up gọi vốn bằng cách bán token của riêng mình trên Ethereum. ETH tăng từ khoảng 8 USD một năm trước lên hơn 1.300 USD — rồi rơi hơn 90%."]),
  E("defi", "2020-06-15", "milestone",
    ["'DeFi summer'", "Lending, trading and saving apps that run without a bank take off. Blocks fill up and fees jump."],
    ["'Mùa hè DeFi'", "Các ứng dụng cho vay, giao dịch, gửi tiết kiệm chạy không cần ngân hàng bùng nổ. Các khối đầy kín và phí tăng vọt."]),
  E("london", "2021-08-05", "upgrade",
    ["Fees start being burned (EIP-1559)", "Each transaction now has a base fee that is destroyed instead of paid to anyone. Busy days can remove more ETH than is created."],
    ["Bắt đầu đốt phí (EIP-1559)", "Mỗi giao dịch giờ có một khoản phí cơ bản bị tiêu huỷ thay vì trả cho ai. Ngày đông giao dịch, lượng ETH bị đốt có thể nhiều hơn lượng mới tạo ra."]),
  E("ath2021", "2021-11-08", "peak",
    ["Peak ≈ $4,800", "NFT and DeFi mania push ETH to its 2021 high. A year later it is below $1,300."],
    ["Đỉnh ≈ 4.800 USD", "Cơn sốt NFT và DeFi đẩy ETH lên đỉnh năm 2021. Một năm sau, giá dưới 1.300 USD."]),
  E("merge", "2022-09-15", "upgrade",
    ["The Merge: goodbye mining", "Ethereum switches from energy-hungry mining to staking without stopping for a second. Energy use falls by about 99.95%."],
    ["The Merge: tạm biệt đào coin", "Ethereum chuyển từ đào coin tốn điện sang staking mà không dừng mạng một giây nào. Lượng điện tiêu thụ giảm khoảng 99,95%."]),
  E("shapella", "2023-04-12", "upgrade",
    ["Staked ETH can be withdrawn", "Validators can finally take out their deposits and rewards. Fears of a mass exit don't come true."],
    ["Rút được ETH đã stake", "Validator cuối cùng cũng rút được tiền đặt cọc và phần thưởng. Nỗi lo tháo chạy hàng loạt không xảy ra."]),
  E("dencun", "2024-03-13", "upgrade",
    ["Dencun: cheap lanes for Layer 2", "A new data space ('blobs') makes fees on Layer-2 networks fall to cents."],
    ["Dencun: làn đường giá rẻ cho Layer 2", "Không gian dữ liệu mới ('blob') giúp phí trên các mạng Layer 2 giảm xuống vài xu."]),
  E("etf", "2024-07-23", "milestone",
    ["Spot ETH ETFs start trading in the US", "Ordinary brokerage accounts can now hold ETH through funds."],
    ["Quỹ ETF ETH giao ngay giao dịch tại Mỹ", "Tài khoản chứng khoán thông thường giờ có thể nắm ETH qua quỹ."]),
  E("bybit", "2025-02-21", "hack",
    ["Bybit hack: ≈ $1.5 billion", "Hackers the FBI links to North Korea trick an exchange's wallet software and take about 400,000 ETH. Ethereum itself was not broken — the exchange's setup was."],
    ["Bybit bị hack: ≈ 1,5 tỷ USD", "Nhóm hacker mà FBI cho là của Triều Tiên lừa phần mềm ví của sàn và lấy khoảng 400.000 ETH. Bản thân Ethereum không bị phá — cách sàn quản lý ví mới là lỗ hổng."]),
  E("pectra", "2025-05-07", "upgrade",
    ["Pectra: smarter wallets", "Ordinary wallets can act like smart contracts — for example, paying fees in another token."],
    ["Pectra: ví thông minh hơn", "Ví thường có thể hoạt động như hợp đồng thông minh — ví dụ trả phí bằng token khác."]),
  E("ath2025", "2025-08-22", "peak",
    ["Record close ≈ $4,830", "Companies buying ETH for their treasuries and ETF inflows push ETH to a new record."],
    ["Đóng cửa kỷ lục ≈ 4.830 USD", "Các công ty mua ETH làm tài sản dự trữ và dòng tiền vào ETF đẩy ETH lên mức kỷ lục mới."]),
  E("fusaka", "2025-12-03", "upgrade",
    ["Fusaka: more room for Layer 2", "Another upgrade gives Layer-2 networks more cheap data space."],
    ["Fusaka: thêm chỗ cho Layer 2", "Một bản nâng cấp nữa cho các mạng Layer 2 thêm không gian dữ liệu giá rẻ."]),
  E("below2k", "2026-11-13", "crash",
    ["Below $2,000 again", "About 40% lower than a year earlier. The network keeps working; the price is a separate story."],
    ["Lại dưới 2.000 USD", "Thấp hơn khoảng 40% so với một năm trước. Mạng vẫn chạy bình thường; giá là một câu chuyện khác."]),
];
