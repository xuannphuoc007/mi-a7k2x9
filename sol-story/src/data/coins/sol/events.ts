/** Key moments for Solana (Act 2 · The Journey). Prices are read from the series at each date. */
export type JKind = "milestone" | "upgrade" | "hack" | "peak" | "crash" | "legal" | "outage";
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
  E("launch", "2020-03-16", "milestone",
    ["Mainnet beta goes live", "About 500 million SOL exist at launch; days later 8 million are auctioned to the public at 22 cents."],
    ["Mạng chính (bản beta) chạy", "Khoảng 500 triệu SOL lúc ra mắt; vài ngày sau 8 triệu SOL được đấu giá cho công chúng giá 22 xu."]),
  E("out21", "2021-09-14", "outage",
    ["17-hour outage", "Bots flood a token sale with transactions and the network stops making blocks."],
    ["Dừng mạng 17 giờ", "Bot dội giao dịch vào một đợt mở bán token và mạng ngừng tạo khối."]),
  E("peak21", "2021-11-06", "peak",
    ["2021 peak ≈ $259", "\"Solana summer\": NFTs, cheap fees and big backers such as FTX push SOL up more than 100×."],
    ["Đỉnh 2021 ≈ 259 USD", "\"Mùa hè Solana\": NFT, phí rẻ và những người ủng hộ lớn như FTX đẩy SOL tăng hơn 100 lần."]),
  E("wormhole", "2022-02-02", "hack",
    ["Wormhole bridge hacked", "120,000 wrapped ETH (≈ $320M) stolen; Jump Crypto puts the money back."],
    ["Cầu Wormhole bị hack", "120.000 wETH (≈ 320 triệu USD) bị lấy; Jump Crypto bù lại toàn bộ."]),
  E("ftx", "2022-11-11", "crash",
    ["FTX collapses", "Solana's best-known backer goes bankrupt. SOL falls to about $8 by late December."],
    ["FTX sụp đổ", "Nhà bảo trợ nổi tiếng nhất của Solana phá sản. Cuối tháng 12, SOL rơi về khoảng 8 USD."]),
  E("sec", "2023-06-05", "legal",
    ["SEC calls SOL a security", "In lawsuits against Binance and Coinbase. Both cases are dropped in 2025."],
    ["SEC gọi SOL là chứng khoán", "Trong các vụ kiện Binance và Coinbase. Cả hai vụ đều bị rút năm 2025."]),
  E("out24", "2024-02-06", "outage",
    ["Last full outage (≈ 5 h)", "A software bug stops blocks for about five hours. No full stop since."],
    ["Lần dừng mạng gần nhất (≈ 5 giờ)", "Một lỗi phần mềm làm mạng ngừng tạo khối khoảng 5 giờ. Từ đó chưa dừng lần nào."]),
  E("trump", "2025-01-19", "peak",
    ["Record ≈ $295, TRUMP coin", "Days after the TRUMP meme coin launches, traders flood Solana."],
    ["Kỷ lục ≈ 295 USD, đồng TRUMP", "Vài ngày sau khi meme coin TRUMP ra đời, người giao dịch đổ dồn vào Solana."]),
  E("libra", "2025-02-14", "crash",
    ["LIBRA crash", "A token promoted by Argentina's president loses ≈ $4.4B of value within hours."],
    ["LIBRA sụp", "Token được tổng thống Argentina quảng bá mất ≈ 4,4 tỷ USD giá trị trong vài giờ."]),
  E("etf", "2025-10-28", "milestone",
    ["U.S. spot SOL ETF with staking", "Bitwise's BSOL starts trading on the New York Stock Exchange."],
    ["Quỹ ETF SOL giao ngay có staking tại Mỹ", "Quỹ BSOL của Bitwise bắt đầu giao dịch trên sàn chứng khoán New York."]),
  E("firedancer", "2025-12-12", "upgrade",
    ["Firedancer goes live", "A second, independent validator program written by Jump runs on mainnet."],
    ["Firedancer chạy thật", "Phần mềm validator độc lập thứ hai, do Jump viết, chạy trên mạng chính."]),
  E("alpenglow", "2026-10-21", "upgrade",
    ["Alpenglow switched on", "New voting system: Proof of History is retired and blocks are final in ≈ 0.15 s."],
    ["Bật Alpenglow", "Hệ thống bỏ phiếu mới: Proof of History nghỉ hưu, khối được chốt trong ≈ 0,15 giây."]),
  E("london", "2026-11-15", "milestone",
    ["Breakpoint London", "The ecosystem gathers under the slogan \"Token Supercycle\" — while SOL trades near $70–75."],
    ["Breakpoint London", "Cả hệ sinh thái họp mặt với khẩu hiệu \"Token Supercycle\" — trong khi SOL chỉ quanh 70–75 USD."]),
];
