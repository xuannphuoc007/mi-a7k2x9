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
    ["Solana goes live", "The network starts running (as a \"beta\"). SOL is worth less than a dollar."],
    ["Solana chạy thật", "Mạng bắt đầu chạy (bản \"beta\"). Một SOL chưa tới 1 USD."]),
  E("magiceden", "2021-09-17", "milestone",
    ["Magic Eden opens", "An NFT marketplace for Solana; within months it handles about 90% of Solana NFT trading."],
    ["Magic Eden mở cửa", "Chợ NFT dành cho Solana; vài tháng sau chiếm khoảng 90% giao dịch NFT trên Solana."]),
  E("peak21", "2021-11-06", "peak",
    ["2021 peak ≈ $259", "\"Solana summer\": NFTs, cheap fees and big backers push SOL up more than 100×."],
    ["Đỉnh 2021 ≈ 259 USD", "\"Mùa hè Solana\": NFT, phí rẻ và nhà bảo trợ lớn đẩy SOL tăng hơn 100 lần."]),
  E("out22", "2022-04-30", "outage",
    ["Network stops for 7 hours", "Bots rushing to grab NFTs flood the network until it halts."],
    ["Mạng dừng 7 giờ", "Bot tranh nhau đúc NFT dội giao dịch tới mức mạng ngừng chạy."]),
  E("ftx", "2022-11-11", "crash",
    ["FTX collapses", "Solana's biggest backer goes bankrupt. SOL falls to about $8 by late December."],
    ["FTX sụp đổ", "Nhà bảo trợ lớn nhất của Solana phá sản. Cuối tháng 12, SOL chỉ còn khoảng 8 USD."]),
  E("bonk", "2022-12-25", "milestone",
    ["BONK: a Christmas gift", "A dog meme coin gives half its supply away free to Solana users."],
    ["BONK: quà Giáng sinh", "Một meme coin hình chú chó tặng miễn phí một nửa số token cho người dùng Solana."]),
  E("jito", "2023-12-07", "milestone",
    ["Airdrop season", "Pyth and Jito hand out free tokens worth hundreds of millions; users rush back."],
    ["Mùa quà tặng (airdrop)", "Pyth và Jito tặng token trị giá hàng trăm triệu USD; người dùng đổ về."]),
  E("pump", "2024-01-19", "milestone",
    ["Pump.fun launches", "Anyone can create a meme coin in seconds for a few cents."],
    ["Pump.fun ra đời", "Ai cũng tạo được meme coin trong vài giây, tốn vài xu."]),
  E("trump", "2025-01-19", "peak",
    ["Record ≈ $295", "Days after the TRUMP meme coin launches, traders flood Solana."],
    ["Kỷ lục ≈ 295 USD", "Vài ngày sau khi meme coin TRUMP ra đời, người giao dịch đổ dồn vào Solana."]),
  E("etf", "2025-10-28", "milestone",
    ["SOL funds on Wall Street", "A U.S. fund holding SOL starts trading on the stock exchange."],
    ["Quỹ SOL lên sàn chứng khoán Mỹ", "Một quỹ nắm giữ SOL bắt đầu giao dịch trên sàn chứng khoán New York."]),
  E("alpenglow", "2026-10-21", "upgrade",
    ["Big upgrade: final in ≈ 0.15 s", "A new voting system makes payments final in a fraction of a second."],
    ["Nâng cấp lớn: chốt trong ≈ 0,15 giây", "Hệ thống bỏ phiếu mới giúp khoản thanh toán được chốt gần như tức thì."]),
  E("london", "2026-11-15", "milestone",
    ["Breakpoint London", "The ecosystem gathers in London — while SOL trades near $70–75."],
    ["Breakpoint London", "Cả hệ sinh thái họp mặt ở London — trong khi SOL chỉ quanh 70–75 USD."]),
];
