/** Story copy for the Solana explainer, English and Vietnamese.
 * Plain language first: five milestones, then Solana today, strengths, weaknesses and a conclusion.
 * Lawsuit claims are labelled as allegations, with the responses of those named. */
export type Beat = { title: string; body: string[]; notes?: string[]; deep?: string[] };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "Why Solana?",
    title: "Why Solana?",
    question: "If crypto is digital money, why couldn't you buy a coffee with it?",
    figure: "Minh tries to pay for a coffee on three blockchains: Bitcoin crawls, Ethereum charges a high fee when busy, and Solana delivers in under a second for less than a cent.",
    takeaway: "Older blockchains are safe but slow, and can get expensive. Solana's promise is simple: one network fast and cheap enough for everyday use.",
    beats: [
      {
        title: "No crypto knowledge needed. We start with a coffee.",
        body: ["Minh is a student in Hanoi. He wants to pay a friend back $2 for a coffee — using crypto. Scroll down; the picture tells the story."],
      },
      {
        title: "On Bitcoin the coffee goes cold. On Ethereum it costs more than the coffee.",
        body: [
          "Bitcoin confirms a payment roughly every 10 minutes. Ethereum is quicker, but when it is busy the fee can be many times the price of the coffee.",
          "Solana was built to do the opposite: confirm in under a second, for less than a cent.",
        ],
      },
      {
        title: "Five moments made Solana famous.",
        body: [
          "Speed and low fees, an NFT boom, a near-death experience with FTX, a surprising comeback, and a meme-coin frenzy. We go through them one by one — then weigh the strengths against the weaknesses.",
        ],
      },
    ],
  },
  {
    label: "1 · Taking on Ethereum with speed and cost",
    title: "1 · Taking on Ethereum with speed and cost",
    question: "What did Solana do differently?",
    figure: "Anatoly Yakovenko and the 2020 launch; a shared clock stamps transactions in order; many checkout lanes run at once; then the fee: tens of dollars on a busy Ethereum versus a fraction of a cent on Solana.",
    takeaway: "Solana's founders borrowed ideas from mobile networks: a shared clock so computers agree quickly, and many lanes working at the same time. The result: payments in under a second for less than a cent.",
    beats: [
      {
        title: "2020: an engineer who wanted a blockchain as fast as a phone network.",
        body: [
          "Anatoly Yakovenko spent more than a decade at Qualcomm, the mobile-chip company. In 2017 he had an idea for making blockchains much faster. Solana started running on 16 March 2020.",
        ],
      },
      {
        title: "Trick 1: a clock everyone trusts.",
        body: [
          "Most blockchains spend a lot of time with computers asking each other \"which payment came first?\". Solana added a shared clock that stamps every transaction with its place in line, so nobody needs to ask. Its name was Proof of History.",
          "(In October 2026 a newer, even faster voting system replaced it.)",
        ],
      },
      {
        title: "Trick 2: many checkouts at once.",
        body: [
          "Like a supermarket with many tills, Solana handles payments that don't affect each other at the same time instead of one by one. People who hold SOL back the computers that run the network (that part is called Proof of Stake).",
        ],
      },
      {
        title: "The result: fast and very cheap.",
        body: [
          "A simple payment on Solana costs a fraction of a cent and is confirmed in under a second. During busy times on Ethereum, ordinary transactions could cost $50–100.",
          "The price of that speed: running Solana needs powerful, expensive computers — remember this for later.",
        ],
        notes: ["Ethereum fee example: The Motley Fool, May 2022. Solana fee: 0.000005 SOL per signature (Syndica)."],
      },
    ],
  },
  {
    label: "2 · NFTs bring Solana to the crowd (2021–2022)",
    title: "2 · NFTs bring Solana to the crowd",
    question: "Why did so many people suddenly hear about Solana in 2021?",
    figure: "Two NFT mints side by side — Ethereum's fee tag climbs into the thousands while Solana's stays under a cent; Magic Eden's market fills up; SOL climbs over 100×; then the same weekend in 2022 shows Ethereum fees exploding and Solana stopping for seven hours.",
    takeaway: "When buying NFTs on Ethereum got too expensive, collectors moved to Solana and its marketplace Magic Eden. It made Solana famous — and showed its weak spot: cheap transactions also invite floods of bots.",
    beats: [
      {
        title: "2021: NFTs boom — and Ethereum is too expensive.",
        body: [
          "NFTs are digital pictures or items with a certificate of ownership on a blockchain. On Ethereum, buying one could cost more in fees than the picture itself. On Solana, the fee was a fraction of a cent.",
        ],
      },
      {
        title: "Magic Eden: Solana's market square.",
        body: [
          "Launched in September 2021, Magic Eden became the main place to trade Solana NFTs, handling about 90% of that trading within months. Collections like DeGods and y00ts became famous.",
        ],
      },
      {
        title: "\"Solana summer\".",
        body: [
          "Newcomers poured in. SOL went from under $2 at the start of 2021 to about $259 in November — more than 100 times higher.",
        ],
      },
      {
        title: "One weekend, two kinds of failure.",
        body: [
          "On 30 April – 1 May 2022, a huge NFT sale on Ethereum pushed fees into the thousands of dollars per transaction. The same weekend, bots rushing to grab NFTs on Solana flooded it until the network stopped for seven hours.",
          "Lesson: Ethereum gets expensive when busy; Solana stays cheap — but cheap also makes spam easy.",
        ],
        notes: ["Vice; The Next Web; Solana Foundation outage report."],
      },
    ],
  },
  {
    label: "3 · FTX collapses — Solana seems dead (2022)",
    title: "3 · FTX collapses — Solana seems dead",
    question: "What happened when Solana's biggest backer went bankrupt?",
    figure: "A tower labelled FTX · Alameda stands on a pile of SOL, then crumbles as the price tag falls from $35 to $8; a tombstone asks \"Solana is dead?\" as two NFT collections leave; then a small sprout grows.",
    takeaway: "FTX and its sister firm Alameda were Solana's loudest backers and held lots of SOL. When FTX collapsed in November 2022, SOL fell about 97% from its peak and many called Solana dead. But the network itself kept running.",
    beats: [
      {
        title: "FTX: Solana's biggest friend.",
        body: [
          "Sam Bankman-Fried's exchange FTX and trading firm Alameda invested early, built apps on Solana and promoted it everywhere. They held a huge pile of SOL — in court, these coins were called \"Sam coins\".",
        ],
      },
      {
        title: "November 2022: FTX goes bankrupt.",
        body: [
          "FTX had used its customers' money. Investors feared all that SOL would be dumped. SOL fell from about $35 to $13 in days, and to around $8 by the end of December — down 97% from its peak.",
        ],
      },
      {
        title: "\"Solana is dead.\"",
        body: [
          "Headlines said it; many believed it. On Christmas Day 2022, DeGods and y00ts — Solana's two most popular NFT collections — announced they would move to Ethereum and Polygon.",
        ],
      },
      {
        title: "But the network never stopped.",
        body: [
          "Solana itself was not FTX: blocks kept coming, and many developers stayed. Ironically, when the bankrupt FTX later sold its SOL in 2024, buyers paid $64 and $102 per coin — far above the bottom.",
        ],
      },
    ],
  },
  {
    label: "4 · A spectacular comeback (2023)",
    title: "4 · A spectacular comeback",
    question: "How did Solana come back from the dead?",
    figure: "SOL's price through 2023 rises from about $10 to over $100; gift boxes open for BONK at Christmas 2022, then Pyth and Jito in late 2023; a large label shows +900%.",
    takeaway: "A playful community gift (BONK), builders who stayed, and a season of free-token giveaways brought users back. SOL rose more than 900% in 2023 — one of the biggest comebacks in crypto.",
    beats: [
      {
        title: "Christmas 2022: a gift called BONK.",
        body: [
          "A dog-themed meme coin, BONK, gave half of all its tokens away for free to about 297,000 Solana wallets — NFT holders, artists and developers. No investors, just a gift. It brought the fun back.",
        ],
      },
      {
        title: "2023: quietly rebuilding.",
        body: [
          "For most of the year SOL sat around $20. The headlines moved on, but many teams kept building apps on Solana.",
        ],
      },
      {
        title: "\"Airdrop\" season: free tokens for early users.",
        body: [
          "An airdrop is when a project gives its token away to early users. In November 2023 Pyth handed out tokens worth about $87 million; in December Jito gave away about $225 million. People rushed to try Solana apps, hoping to be next.",
        ],
      },
      {
        title: "More than 900% in one year.",
        body: [
          "SOL started 2023 at about $10 and ended above $100. In just over a year, Solana went from \"dead\" to one of the hottest blockchains again.",
        ],
      },
    ],
  },
  {
    label: "5 · Meme coins and Pump.fun (2024–2025)",
    title: "5 · Meme coins and Pump.fun",
    question: "Why did Solana become the home of meme coins — and who lost?",
    figure: "Pump.fun spawns tokens like popcorn; daily launches peak at 95,578 on 26 January 2025. TRUMP and LIBRA rocket and fall; a lawsuit card labelled \"alleged\" names Pump.fun and Solana organisations.",
    takeaway: "Cheap, fast transactions made Solana the main place for meme coins. A few people got rich; most buyers lost. A U.S. lawsuit calls it a rigged casino — Pump.fun and the Solana organisations deny it, and no court has ruled.",
    beats: [
      {
        title: "Pump.fun: a new coin in seconds, for cents.",
        body: [
          "Launched in January 2024, Pump.fun lets anyone create a token with just a name and a picture. Early buyers pay less; if enough people buy, the token moves to a normal exchange.",
        ],
      },
      {
        title: "95,578 new tokens in one day.",
        body: [
          "New tokens on Solana peaked on 26 January 2025 — Pump.fun made about 60% of them. Almost all were worth close to nothing within days, but the trading made Solana very busy.",
        ],
      },
      {
        title: "TRUMP and LIBRA.",
        body: [
          "In January 2025 Donald Trump launched the TRUMP meme coin on Solana; its value briefly approached $15 billion before falling more than 80%. Within three weeks, about 813,000 wallets had lost a combined $2 billion. In February, LIBRA — promoted by Argentina's president — lost about $4.4 billion of value within hours.",
        ],
      },
      {
        title: "The lawsuit: \"a digital casino\" (alleged).",
        body: [
          "A U.S. class action claims Pump.fun ran an unlicensed casino that took more than $5.5 billion from users, and names Solana Labs, the Solana Foundation and their leaders. They deny it. The case is still going on.",
        ],
        notes: ["Status: allegations in a civil case, not court findings."],
      },
      {
        title: "\"Memecoins do not define Solana.\"",
        body: [
          "That is how Solana Foundation president Lily Liu put it in May 2026. The foundation now pushes payments and digital dollars instead. The meme frenzy has cooled.",
        ],
      },
    ],
  },
  {
    label: "Six years in one picture",
    title: "Six years in one picture",
    question: "How did the five moments show up in SOL's price?",
    figure: "SOL's price from March 2020 to November 2026 on a log scale, drawn as the playhead advances; numbered pins mark the launch, Magic Eden, the outage, FTX, BONK, the airdrops, Pump.fun, the record, U.S. funds and the 2026 upgrade.",
    takeaway: "SOL went from under a dollar to about $295, crashing to $8 in between. In November 2026 it is near $70–75 — more than 40% below a year earlier — even though the network is busier than ever.",
    beats: [
      {
        title: "2020: a quiet start under $1.",
        body: ["Each numbered pin is one moment from the story. Watch how the price reacts."],
        notes: ["Price: estimated from Coin Metrics market-value data, calibrated to monthly closes; dashed line = monthly closes and news reports."],
      },
      {
        title: "2021: NFTs and \"Solana summer\".",
        body: ["Magic Eden opens, newcomers pour in, SOL climbs to about $259."],
      },
      {
        title: "2022: outages, FTX — almost zero.",
        body: ["A seven-hour stop in spring, then FTX's collapse in November. SOL ends the year around $10."],
      },
      {
        title: "2023–2025: comeback, then meme mania.",
        body: ["BONK, the airdrops, Pump.fun and finally the TRUMP coin push SOL to a record near $295 in January 2025."],
      },
      {
        title: "2025–2026: big money arrives, the price cools.",
        body: ["U.S. funds holding SOL and a major upgrade arrive — yet the price drifts back to the $70s as the meme frenzy fades."],
      },
    ],
  },
  {
    label: "Solana today",
    title: "Solana today",
    question: "What do people actually use Solana for in 2026?",
    figure: "Minh swaps SOL for a digital dollar: Jupiter splits his order across Raydium and other exchanges. Then tiles rise: $17.5 billion in digital dollars, $5 billion in tokenised assets, 1,000 days without an outage; names of big companies follow.",
    takeaway: "Beyond memes, Solana is now used for swapping, holding digital dollars and even tokenised shares. Big names — PayPal, Western Union, the DTCC — build on it. But most activity is still trading.",
    beats: [
      {
        title: "Swapping right inside your wallet.",
        body: [
          "Minh wants to swap SOL for USDC, a digital dollar. He uses Jupiter, which finds the best price across exchanges such as Raydium. No bank account, no paperwork — just his wallet.",
        ],
      },
      {
        title: "Digital dollars pour in.",
        body: [
          "Digital dollars (stablecoins) on Solana reached a record $17.5 billion in September 2026. Western Union chose Solana for its own digital dollar, and Samsung Wallet supports USDC on Solana.",
        ],
      },
      {
        title: "Wall Street steps in.",
        body: [
          "Since late 2025, ordinary investors can buy SOL through funds on the stock exchange. Tokenised shares and funds on Solana reached $5 billion, and the DTCC — which settles most U.S. stock trades — plans to connect to Solana in 2027.",
        ],
      },
      {
        title: "More reliable — but the price cooled.",
        body: [
          "Solana has run 1,000 days in a row without stopping, and an October 2026 upgrade makes payments final in about 0.15 seconds. Still, SOL trades near $70–75, more than 40% below a year earlier.",
        ],
      },
    ],
  },
  {
    label: "The people behind it",
    title: "The people behind it",
    question: "Who steers Solana today?",
    figure: "A map with portraits of Anatoly Yakovenko, Raj Gokal and Lily Liu around the Solana mark, linked to Solana Labs and the Solana Foundation; then Anza and Jump, which write the software.",
    takeaway: "No single company controls Solana, but a handful of organisations write most of its software and steer its direction.",
    beats: [
      {
        title: "Three faces, a few organisations.",
        body: [
          "Anatoly Yakovenko and Raj Gokal co-founded Solana Labs, the company that built the network. Lily Liu leads the Solana Foundation, a non-profit in Switzerland that funds and promotes the ecosystem. All three are named in the Pump.fun lawsuit and deny the claims.",
        ],
      },
      {
        title: "Who writes the software?",
        body: [
          "Most of the core engineers now work at Anza, which maintains the main software. Jump Crypto wrote a second, independent version (Firedancer), so one bug can no longer stop everything.",
        ],
      },
    ],
  },
  {
    label: "Bitcoin vs Ethereum vs Solana",
    title: "Bitcoin vs Ethereum vs Solana",
    question: "How does Solana compare with the two biggest coins?",
    figure: "Three coins side by side — Bitcoin, Ethereum, Solana — with rows for confirmation time, fees, supply and who runs each network, and bubbles sized by market value in mid-November 2026.",
    takeaway: "Bitcoin is the slow, scarce one; Ethereum the big app platform; Solana the fast, cheap one. Solana is much smaller by value — about $43 billion.",
    beats: [
      {
        title: "Three designs, three trade-offs.",
        body: [
          "Bitcoin stays simple and slow so almost anyone can check it. Ethereum stays careful and sends busy traffic to cheaper side networks. Solana does everything on one fast network — which needs bigger, pricier machines.",
          "The table beside the picture lines them up.",
        ],
      },
    ],
  },
  {
    label: "Strengths",
    title: "Strengths",
    question: "What does Solana do well?",
    figure: "Five cards light up one at a time: fast, cheap, really used, big money has arrived, and resilient.",
    takeaway: "Fast, cheap, heavily used, trusted by big companies, and tough enough to survive FTX.",
    beats: [
      {
        title: "1. Fast.",
        body: ["A payment is confirmed in under a second — and since October 2026 it becomes final in about 0.15 seconds."],
      },
      {
        title: "2. Cheap.",
        body: ["A simple transfer costs a fraction of a cent, so small payments, games and apps make sense."],
      },
      {
        title: "3. Really used.",
        body: ["About 100 million user transactions a day. In August 2026 Solana handled more than all other major blockchains combined."],
        notes: ["crypto.news; Solana Compass."],
      },
      {
        title: "4. Big money has arrived.",
        body: ["$17.5 billion in digital dollars, U.S. stock-market funds holding SOL, and companies like PayPal, Western Union and the DTCC building on it."],
      },
      {
        title: "5. Resilient.",
        body: ["It survived the FTX collapse, has run 1,000 days without stopping, and now has two independent versions of its software."],
      },
    ],
  },
  {
    label: "Weaknesses",
    title: "Weaknesses",
    question: "What should worry you about Solana?",
    figure: "Five warning cards light up one at a time: outages and hacks, power in few hands, the meme-coin reputation, wild price swings, and new coins printed every year.",
    takeaway: "Past outages, power concentrated in a few hands, a meme-coin casino reputation, extreme price swings and no supply cap.",
    beats: [
      {
        title: "1. It has stopped — and been hacked.",
        body: ["Between 2021 and 2024 the network fully stopped several times, once for 17 hours and once for about 19. In 2022 a hacker took about $320 million from Wormhole, a bridge connected to Solana."],
      },
      {
        title: "2. Power in few hands.",
        body: ["Fewer than 800 computers run the network — down about two-thirds since 2023 — and they are expensive. Early investors, the team and the foundation got most of the first coins, and a few organisations write most of the software."],
      },
      {
        title: "3. A meme-coin reputation.",
        body: ["Pump.fun, TRUMP and LIBRA made Solana look like a casino. Most meme buyers lost money, and a lawsuit (still only allegations) names Solana's leaders."],
      },
      {
        title: "4. Wild price swings.",
        body: ["SOL fell 97% from 2021 to 2022, and in November 2026 it is about 75% below its January 2025 record. Its price depends heavily on how much people trade."],
      },
      {
        title: "5. New coins printed every year.",
        body: ["There is no maximum number of SOL. About 3.8% new SOL is created each year as rewards; holders who don't take part slowly own a smaller share. (A vote in 2026 decided to cut this faster.)"],
      },
    ],
  },
  {
    label: "Weighing it up",
    title: "Weighing it up",
    question: "So which side is heavier?",
    figure: "A balance with the five strengths on one side and the five weaknesses on the other; then SOL's last twelve months drawn as a single line, ending more than 40% lower.",
    takeaway: "The technology has clearly improved; the price has not followed. Both sides of the scale are real.",
    beats: [
      {
        title: "Strengths on the left…",
        body: ["Fast, cheap, really used, big money, resilient."],
      },
      {
        title: "…weaknesses on the right.",
        body: ["Outages and hacks, few hands, meme reputation, wild swings, endless supply. The scale ends up close to level — which is exactly why people argue about Solana."],
      },
      {
        title: "The last twelve months.",
        body: ["Usage hit records while the price fell by more than 40%. The network and the coin's price no longer move together."],
      },
    ],
  },
  {
    label: "Conclusion",
    title: "Conclusion",
    question: "So — what is Solana, after six years?",
    figure: "Minh's phone confirms the coffee payment in a fraction of a second for less than a cent. The stage clears and a 3D SOL coin assembles and can be rotated.",
    takeaway: "Solana proved a blockchain can be as fast and cheap as a payment app, and tough enough to survive FTX. In exchange it accepts fewer, more powerful operators, an outage history and a speculative crowd. A great network and a safe coin are two different questions.",
    beats: [
      {
        title: "Conclusion: fast, tough — and still risky.",
        body: [
          "Solana did what it promised: Minh's $2 arrives in under a second for less than a cent. It also survived a crash that would have killed most projects, and won over big companies.",
          "The price of that speed is real: fewer, more powerful operators, a history of outages, and a reputation tied to meme coins.",
        ],
      },
      {
        title: "What this means for you.",
        body: [
          "As a user: Solana is a convenient, cheap way to send money and swap tokens — but stay away from meme coins you don't understand.",
          "As an investor: SOL has fallen 75–97% more than once. A strong network does not guarantee a rising price. Only risk money you can afford to lose. This is not investment advice.",
        ],
      },
      {
        title: "Turn the coin over.",
        body: ["Drag the SOL coin to rotate it. Sources for every number are listed below."],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Vì sao có Solana?",
    title: "Vì sao có Solana?",
    question: "Nếu crypto là tiền số, sao không trả được ly cà phê?",
    figure: "Minh thử trả tiền cà phê trên ba blockchain: Bitcoin chậm như rùa, Ethereum lúc đông phí cao hơn cả ly cà phê, còn Solana xong trong chưa tới một giây với phí chưa tới một xu.",
    takeaway: "Các blockchain đời đầu an toàn nhưng chậm, có lúc rất đắt. Lời hứa của Solana rất đơn giản: một mạng đủ nhanh và đủ rẻ để dùng hằng ngày.",
    beats: [
      {
        title: "Không cần biết gì về crypto. Bắt đầu từ một ly cà phê.",
        body: ["Minh là sinh viên ở Hà Nội. Cậu muốn trả bạn 2 USD tiền cà phê — bằng crypto. Cứ cuộn xuống; hình vẽ sẽ kể câu chuyện."],
      },
      {
        title: "Trên Bitcoin, cà phê nguội mất. Trên Ethereum, phí đắt hơn cả cà phê.",
        body: [
          "Bitcoin khoảng 10 phút mới xác nhận một lần. Ethereum nhanh hơn, nhưng lúc đông người dùng, phí có thể gấp nhiều lần giá ly cà phê.",
          "Solana được làm ra để làm điều ngược lại: xác nhận trong chưa tới một giây, phí chưa tới một xu.",
        ],
      },
      {
        title: "Năm dấu mốc làm nên tên tuổi Solana.",
        body: [
          "Tốc độ và phí rẻ, cơn sốt NFT, suýt chết cùng FTX, cú hồi sinh ngoạn mục, và cơn sốt meme coin. Mình đi qua từng mốc — rồi đặt điểm mạnh và điểm yếu lên bàn cân.",
        ],
      },
    ],
  },
  {
    label: "1 · Thách thức Ethereum bằng tốc độ và chi phí",
    title: "1 · Thách thức Ethereum bằng tốc độ và chi phí",
    question: "Solana đã làm gì khác đi?",
    figure: "Anatoly Yakovenko và ngày ra mắt 2020; một chiếc đồng hồ chung đóng dấu thứ tự giao dịch; nhiều quầy tính tiền chạy cùng lúc; rồi so phí: hàng chục USD trên Ethereum lúc đông và chưa tới một xu trên Solana.",
    takeaway: "Những người sáng lập Solana mượn ý tưởng từ mạng di động: một chiếc đồng hồ chung để các máy thống nhất nhanh, và nhiều làn chạy cùng lúc. Kết quả: chuyển tiền chưa tới một giây, phí chưa tới một xu.",
    beats: [
      {
        title: "2020: một kỹ sư muốn blockchain nhanh như mạng điện thoại.",
        body: [
          "Anatoly Yakovenko làm hơn mười năm ở Qualcomm, hãng chip điện thoại. Năm 2017 ông nghĩ ra cách làm blockchain nhanh hơn nhiều. Solana chính thức chạy từ ngày 16/3/2020.",
        ],
      },
      {
        title: "Bí quyết 1: một chiếc đồng hồ ai cũng tin.",
        body: [
          "Đa số blockchain tốn rất nhiều thời gian để các máy tính hỏi nhau \"giao dịch nào tới trước?\". Solana thêm một chiếc đồng hồ chung đóng dấu thứ tự cho từng giao dịch, nên không ai phải hỏi nữa. Tên kỹ thuật của nó là Proof of History.",
          "(Tháng 10/2026, một hệ thống bỏ phiếu mới còn nhanh hơn đã thay thế nó.)",
        ],
      },
      {
        title: "Bí quyết 2: nhiều quầy tính tiền cùng lúc.",
        body: [
          "Giống siêu thị có nhiều quầy, Solana xử lý cùng lúc những giao dịch không liên quan nhau thay vì xếp hàng từng cái. Người giữ SOL đứng ra bảo lãnh cho các máy vận hành mạng (phần này gọi là Proof of Stake).",
        ],
      },
      {
        title: "Kết quả: nhanh và rất rẻ.",
        body: [
          "Một lần chuyển tiền đơn giản trên Solana tốn chưa tới một xu và được xác nhận trong chưa tới một giây. Trong khi đó, lúc Ethereum đông, một giao dịch bình thường có thể tốn 50–100 USD.",
          "Cái giá của tốc độ: muốn chạy Solana cần máy tính mạnh và đắt — hãy nhớ điều này cho phần sau.",
        ],
        notes: ["Ví dụ phí Ethereum: The Motley Fool, 5/2022. Phí Solana: 0,000005 SOL mỗi chữ ký (Syndica)."],
      },
    ],
  },
  {
    label: "2 · NFT đưa Solana tới cộng đồng (2021–2022)",
    title: "2 · NFT đưa Solana tới cộng đồng",
    question: "Vì sao năm 2021 bỗng nhiều người biết tới Solana?",
    figure: "Hai lần đúc NFT đặt cạnh nhau — nhãn phí trên Ethereum vọt lên hàng nghìn USD, trên Solana vẫn dưới một xu; chợ Magic Eden đông dần; SOL tăng hơn 100 lần; rồi cùng một cuối tuần năm 2022, phí Ethereum bùng nổ còn Solana dừng bảy giờ.",
    takeaway: "Khi mua NFT trên Ethereum quá đắt, người chơi chuyển sang Solana và chợ Magic Eden. Điều đó làm Solana nổi tiếng — và lộ ra điểm yếu: giao dịch rẻ cũng dễ bị bot dội tràn.",
    beats: [
      {
        title: "2021: NFT bùng nổ — và Ethereum quá đắt.",
        body: [
          "NFT là những tấm hình, vật phẩm số có \"giấy chứng nhận sở hữu\" trên blockchain. Trên Ethereum, phí mua một NFT có lúc còn đắt hơn chính tấm hình. Trên Solana, phí chưa tới một xu.",
        ],
      },
      {
        title: "Magic Eden: khu chợ của Solana.",
        body: [
          "Ra mắt tháng 9/2021, Magic Eden thành nơi mua bán NFT chính của Solana, chỉ vài tháng đã chiếm khoảng 90% giao dịch NFT trên mạng này. Các bộ sưu tập như DeGods, y00ts trở nên nổi tiếng.",
        ],
      },
      {
        title: "\"Mùa hè Solana\".",
        body: [
          "Người mới ùa vào. SOL từ dưới 2 USD đầu năm 2021 lên khoảng 259 USD vào tháng 11 — tăng hơn 100 lần.",
        ],
      },
      {
        title: "Cùng một cuối tuần, hai kiểu thất bại.",
        body: [
          "Ngày 30/4 – 1/5/2022, một đợt bán NFT khổng lồ trên Ethereum đẩy phí lên hàng nghìn USD mỗi giao dịch. Cùng cuối tuần đó, bot tranh nhau đúc NFT trên Solana dội giao dịch tới mức mạng dừng bảy giờ.",
          "Bài học: Ethereum đắt lên khi đông; Solana vẫn rẻ — nhưng rẻ cũng khiến việc spam quá dễ.",
        ],
        notes: ["Vice; The Next Web; báo cáo sự cố của Solana Foundation."],
      },
    ],
  },
  {
    label: "3 · FTX sụp đổ, Solana tưởng như đã chết (2022)",
    title: "3 · FTX sụp đổ, Solana tưởng như đã chết",
    question: "Chuyện gì xảy ra khi nhà bảo trợ lớn nhất của Solana phá sản?",
    figure: "Toà tháp FTX · Alameda đứng trên đống SOL rồi đổ sụp, nhãn giá rơi từ 35 xuống 8 USD; một bia mộ hỏi \"Solana đã chết?\" khi hai bộ sưu tập NFT rời đi; rồi một mầm cây nhú lên.",
    takeaway: "FTX và công ty chị em Alameda là những người ủng hộ ồn ào nhất và nắm rất nhiều SOL. Khi FTX sụp tháng 11/2022, SOL mất khoảng 97% so với đỉnh và nhiều người tuyên bố Solana đã chết. Nhưng bản thân mạng vẫn chạy.",
    beats: [
      {
        title: "FTX: người bạn lớn nhất của Solana.",
        body: [
          "Sàn FTX và công ty giao dịch Alameda của Sam Bankman-Fried đầu tư sớm, xây ứng dụng trên Solana và quảng bá khắp nơi. Họ nắm một đống SOL khổng lồ — ở toà, những đồng này được gọi là \"Sam coins\".",
        ],
      },
      {
        title: "Tháng 11/2022: FTX phá sản.",
        body: [
          "FTX đã dùng tiền của khách. Nhà đầu tư sợ toàn bộ số SOL kia bị bán tháo. SOL rơi từ khoảng 35 xuống 13 USD trong vài ngày, và còn khoảng 8 USD cuối tháng 12 — mất 97% so với đỉnh.",
        ],
      },
      {
        title: "\"Solana đã chết.\"",
        body: [
          "Báo chí nói vậy, nhiều người tin vậy. Đúng ngày Giáng sinh 2022, DeGods và y00ts — hai bộ sưu tập NFT nổi tiếng nhất Solana — tuyên bố chuyển sang Ethereum và Polygon.",
        ],
      },
      {
        title: "Nhưng mạng chưa từng ngừng.",
        body: [
          "Solana không phải là FTX: khối mới vẫn đều đặn ra đời, nhiều lập trình viên vẫn ở lại. Trớ trêu là năm 2024, khi FTX phá sản bán số SOL của mình, người mua trả 64 và 102 USD mỗi đồng — cao hơn rất nhiều so với đáy.",
        ],
      },
    ],
  },
  {
    label: "4 · Hồi sinh ngoạn mục (2023)",
    title: "4 · Hồi sinh ngoạn mục",
    question: "Solana sống lại bằng cách nào?",
    figure: "Giá SOL suốt năm 2023 đi từ khoảng 10 lên hơn 100 USD; các hộp quà mở ra: BONK dịp Giáng sinh 2022, rồi Pyth và Jito cuối 2023; nhãn lớn ghi +900%.",
    takeaway: "Một món quà vui của cộng đồng (BONK), những người xây dựng ở lại, và mùa tặng token miễn phí đã kéo người dùng quay về. SOL tăng hơn 900% trong năm 2023 — một trong những cú lội ngược dòng lớn nhất của crypto.",
    beats: [
      {
        title: "Giáng sinh 2022: món quà tên BONK.",
        body: [
          "Một meme coin hình chú chó tên BONK tặng miễn phí một nửa số token cho khoảng 297.000 ví Solana — người giữ NFT, nghệ sĩ và lập trình viên. Không có quỹ đầu tư nào, chỉ là món quà. Nó mang niềm vui trở lại.",
        ],
      },
      {
        title: "2023: lặng lẽ xây lại.",
        body: [
          "Gần cả năm SOL chỉ quanh 20 USD. Báo chí không còn để ý, nhưng nhiều nhóm vẫn tiếp tục xây ứng dụng trên Solana.",
        ],
      },
      {
        title: "Mùa \"airdrop\": tặng token cho người dùng sớm.",
        body: [
          "Airdrop là khi một dự án tặng token cho những người dùng sớm. Tháng 11/2023 Pyth tặng token trị giá khoảng 87 triệu USD; tháng 12 Jito tặng khoảng 225 triệu USD. Người ta ùa vào dùng thử các ứng dụng Solana, mong được tặng lần sau.",
        ],
      },
      {
        title: "Tăng hơn 900% trong một năm.",
        body: [
          "SOL bắt đầu năm 2023 ở khoảng 10 USD và kết thúc trên 100 USD. Chỉ hơn một năm, Solana từ \"đã chết\" trở lại thành một trong những blockchain nóng nhất.",
        ],
      },
    ],
  },
  {
    label: "5 · Cơn sốt memecoin và Pump.fun (2024–2025)",
    title: "5 · Cơn sốt memecoin và Pump.fun",
    question: "Vì sao Solana thành nhà của meme coin — và ai thua?",
    figure: "Pump.fun nổ token như bỏng ngô; số token ra đời mỗi ngày đạt đỉnh 95.578 vào 26/1/2025. TRUMP và LIBRA vọt lên rồi rơi; thẻ vụ kiện ghi \"cáo buộc\" nêu tên Pump.fun và các tổ chức Solana.",
    takeaway: "Giao dịch rẻ và nhanh biến Solana thành nơi chính để chơi meme coin. Vài người giàu lên; đa số người mua thua lỗ. Một vụ kiện ở Mỹ gọi đó là sòng bạc gian lận — Pump.fun và các tổ chức Solana phủ nhận, toà chưa phán quyết.",
    beats: [
      {
        title: "Pump.fun: coin mới trong vài giây, vài xu.",
        body: [
          "Ra mắt tháng 1/2024, Pump.fun cho phép bất kỳ ai tạo token chỉ với một cái tên và một tấm hình. Người mua sớm được giá thấp; nếu đủ người mua, token được chuyển lên sàn giao dịch thông thường.",
        ],
      },
      {
        title: "95.578 token mới trong một ngày.",
        body: [
          "Số token mới trên Solana đạt đỉnh ngày 26/1/2025 — khoảng 60% tạo qua Pump.fun. Gần như tất cả chỉ còn giá trị xấp xỉ bằng không sau vài ngày, nhưng việc mua bán khiến Solana bận rộn chưa từng thấy.",
        ],
      },
      {
        title: "TRUMP và LIBRA.",
        body: [
          "Tháng 1/2025 ông Donald Trump tung meme coin TRUMP trên Solana; vốn hoá có lúc gần 15 tỷ USD rồi mất hơn 80%. Chỉ sau ba tuần, khoảng 813.000 ví lỗ tổng cộng 2 tỷ USD. Tháng 2, LIBRA — được Tổng thống Argentina quảng bá — mất khoảng 4,4 tỷ USD giá trị chỉ trong vài giờ.",
        ],
      },
      {
        title: "Vụ kiện: \"sòng bạc số\" (cáo buộc).",
        body: [
          "Một vụ kiện tập thể ở Mỹ cáo buộc Pump.fun vận hành sòng bạc không phép, rút hơn 5,5 tỷ USD từ người dùng, và nêu tên Solana Labs, Solana Foundation cùng lãnh đạo. Họ phủ nhận. Vụ án vẫn đang tiếp diễn.",
        ],
        notes: ["Tình trạng: cáo buộc trong vụ dân sự, chưa phải kết luận của toà."],
      },
      {
        title: "\"Meme coin không định nghĩa Solana.\"",
        body: [
          "Đó là lời Chủ tịch Solana Foundation Lily Liu hồi tháng 5/2026. Quỹ giờ đẩy mạnh thanh toán và đô la số. Cơn sốt meme đã nguội.",
        ],
      },
    ],
  },
  {
    label: "Sáu năm trong một hình",
    title: "Sáu năm trong một hình",
    question: "Năm dấu mốc hiện lên trên giá SOL thế nào?",
    figure: "Giá SOL từ tháng 3/2020 tới tháng 11/2026 trên thang log, vẽ dần theo đầu đọc; các ghim đánh số đánh dấu ngày ra mắt, Magic Eden, lần sập mạng, FTX, BONK, mùa airdrop, Pump.fun, kỷ lục, quỹ ở Mỹ và nâng cấp 2026.",
    takeaway: "SOL đi từ dưới 1 USD lên khoảng 295 USD, có lúc rơi xuống 8 USD ở giữa. Tháng 11/2026 giá quanh 70–75 USD — giảm hơn 40% so với một năm trước — dù mạng đang bận rộn hơn bao giờ hết.",
    beats: [
      {
        title: "2020: khởi đầu lặng lẽ dưới 1 USD.",
        body: ["Mỗi ghim đánh số là một khoảnh khắc trong câu chuyện. Hãy xem giá phản ứng ra sao."],
        notes: ["Giá: ước tính từ dữ liệu vốn hoá của Coin Metrics, hiệu chỉnh theo giá đóng cửa tháng; nét đứt = giá đóng cửa tháng và số liệu báo chí."],
      },
      {
        title: "2021: NFT và \"mùa hè Solana\".",
        body: ["Magic Eden mở cửa, người mới đổ về, SOL lên khoảng 259 USD."],
      },
      {
        title: "2022: sập mạng, FTX — gần như về 0.",
        body: ["Mùa xuân mạng dừng bảy giờ, tháng 11 FTX sụp. SOL kết thúc năm quanh 10 USD."],
      },
      {
        title: "2023–2025: hồi sinh, rồi cơn sốt meme.",
        body: ["BONK, mùa airdrop, Pump.fun và cuối cùng là đồng TRUMP đẩy SOL lên kỷ lục gần 295 USD vào tháng 1/2025."],
      },
      {
        title: "2025–2026: tiền lớn vào, giá hạ nhiệt.",
        body: ["Các quỹ ở Mỹ nắm giữ SOL và một bản nâng cấp lớn ra đời — nhưng giá trôi về vùng 70 USD khi cơn sốt meme qua đi."],
      },
    ],
  },
  {
    label: "Solana hôm nay",
    title: "Solana hôm nay",
    question: "Năm 2026, người ta thật sự dùng Solana để làm gì?",
    figure: "Minh đổi SOL lấy đô la số: Jupiter chia lệnh của cậu qua Raydium và các sàn khác. Rồi các ô số liệu hiện lên: 17,5 tỷ USD đô la số, 5 tỷ USD tài sản số hoá, 1.000 ngày không sập mạng; tên các công ty lớn nối tiếp.",
    takeaway: "Ngoài meme, Solana giờ được dùng để đổi token, giữ đô la số và cả cổ phiếu số hoá. Những tên tuổi lớn — PayPal, Western Union, DTCC — đang xây trên đó. Nhưng phần lớn hoạt động vẫn là mua bán đầu cơ.",
    beats: [
      {
        title: "Đổi tiền ngay trong ví.",
        body: [
          "Minh muốn đổi SOL lấy USDC, một đồng đô la số. Cậu dùng Jupiter, công cụ tìm giá tốt nhất qua các sàn như Raydium. Không cần tài khoản ngân hàng, không giấy tờ — chỉ cần ví.",
        ],
      },
      {
        title: "Đô la số đổ về.",
        body: [
          "Đô la số (stablecoin) trên Solana đạt kỷ lục 17,5 tỷ USD vào tháng 9/2026. Western Union chọn Solana cho đồng đô la số của riêng mình, Samsung Wallet hỗ trợ USDC trên Solana.",
        ],
      },
      {
        title: "Phố Wall bước vào.",
        body: [
          "Từ cuối 2025, nhà đầu tư thông thường có thể mua SOL qua các quỹ niêm yết trên sàn chứng khoán. Cổ phiếu, quỹ được số hoá trên Solana đạt 5 tỷ USD, và DTCC — nơi thanh toán phần lớn giao dịch cổ phiếu ở Mỹ — dự định kết nối với Solana năm 2027.",
        ],
      },
      {
        title: "Ổn định hơn — nhưng giá hạ nhiệt.",
        body: [
          "Solana đã chạy 1.000 ngày liên tục không dừng, và bản nâng cấp tháng 10/2026 giúp khoản thanh toán được chốt trong khoảng 0,15 giây. Dù vậy, SOL chỉ quanh 70–75 USD, giảm hơn 40% so với một năm trước.",
        ],
      },
    ],
  },
  {
    label: "Những người đứng sau",
    title: "Những người đứng sau",
    question: "Ai đang lèo lái Solana?",
    figure: "Bản đồ với chân dung Anatoly Yakovenko, Raj Gokal và Lily Liu quanh biểu tượng Solana, nối tới Solana Labs và Solana Foundation; rồi Anza và Jump, những nơi viết phần mềm.",
    takeaway: "Không công ty nào kiểm soát Solana một mình, nhưng một nhóm nhỏ tổ chức viết phần lớn phần mềm và định hướng đi.",
    beats: [
      {
        title: "Ba gương mặt, vài tổ chức.",
        body: [
          "Anatoly Yakovenko và Raj Gokal đồng sáng lập Solana Labs, công ty xây dựng mạng lưới. Lily Liu đứng đầu Solana Foundation, tổ chức phi lợi nhuận ở Thuỵ Sĩ tài trợ và quảng bá hệ sinh thái. Cả ba bị nêu tên trong vụ kiện Pump.fun và đều phủ nhận.",
        ],
      },
      {
        title: "Ai viết phần mềm?",
        body: [
          "Phần lớn kỹ sư lõi giờ làm ở Anza, nơi duy trì phần mềm chính. Jump Crypto viết một phiên bản thứ hai độc lập (Firedancer), để một lỗi không còn làm dừng tất cả.",
        ],
      },
    ],
  },
  {
    label: "Bitcoin vs Ethereum vs Solana",
    title: "Bitcoin vs Ethereum vs Solana",
    question: "Solana so với hai đồng lớn nhất thì sao?",
    figure: "Ba đồng coin cạnh nhau — Bitcoin, Ethereum, Solana — với các hàng thời gian xác nhận, phí, nguồn cung và ai vận hành mạng, cùng bong bóng có kích thước theo vốn hoá giữa tháng 11/2026.",
    takeaway: "Bitcoin chậm và khan hiếm; Ethereum là nền tảng ứng dụng lớn; Solana nhanh và rẻ. Solana nhỏ hơn nhiều về giá trị — khoảng 43 tỷ USD.",
    beats: [
      {
        title: "Ba thiết kế, ba sự đánh đổi.",
        body: [
          "Bitcoin giữ mọi thứ đơn giản và chậm để gần như ai cũng kiểm tra được. Ethereum thận trọng và đẩy bớt việc sang các mạng phụ rẻ hơn. Solana làm tất cả trên một mạng nhanh — đổi lại cần máy lớn và đắt hơn.",
          "Bảng bên cạnh hình đặt ba đồng cạnh nhau.",
        ],
      },
    ],
  },
  {
    label: "Điểm mạnh",
    title: "Điểm mạnh",
    question: "Solana làm tốt điều gì?",
    figure: "Năm thẻ lần lượt sáng lên: nhanh, rẻ, được dùng thật, tiền lớn đã vào, và bền bỉ.",
    takeaway: "Nhanh, rẻ, được dùng nhiều, được các công ty lớn tin dùng, và đủ lì để sống sót sau FTX.",
    beats: [
      {
        title: "1. Nhanh.",
        body: ["Một khoản chuyển được xác nhận trong chưa tới một giây — và từ tháng 10/2026 được chốt hẳn trong khoảng 0,15 giây."],
      },
      {
        title: "2. Rẻ.",
        body: ["Một lần chuyển đơn giản tốn chưa tới một xu, nên thanh toán nhỏ, trò chơi và ứng dụng đều hợp lý."],
      },
      {
        title: "3. Được dùng thật.",
        body: ["Khoảng 100 triệu giao dịch người dùng mỗi ngày. Tháng 8/2026, Solana xử lý nhiều giao dịch hơn tất cả các blockchain lớn khác cộng lại."],
        notes: ["crypto.news; Solana Compass."],
      },
      {
        title: "4. Tiền lớn đã vào.",
        body: ["17,5 tỷ USD đô la số, các quỹ trên sàn chứng khoán Mỹ nắm giữ SOL, và những công ty như PayPal, Western Union, DTCC xây trên Solana."],
      },
      {
        title: "5. Bền bỉ.",
        body: ["Sống sót sau cú sụp FTX, chạy 1.000 ngày không dừng, và giờ có hai phiên bản phần mềm độc lập."],
      },
    ],
  },
  {
    label: "Điểm yếu",
    title: "Điểm yếu",
    question: "Điều gì ở Solana đáng lo?",
    figure: "Năm thẻ cảnh báo lần lượt sáng lên: từng sập mạng và bị hack, quyền lực trong tay ít người, tiếng xấu meme coin, giá lên xuống dữ dội, và năm nào cũng in thêm coin.",
    takeaway: "Từng sập mạng, quyền lực tập trung vào ít người, tiếng xấu sòng bạc meme coin, giá biến động cực mạnh và không có trần nguồn cung.",
    beats: [
      {
        title: "1. Từng sập mạng — và bị hack.",
        body: ["Từ 2021 tới 2024 mạng dừng hẳn nhiều lần, có lần 17 giờ, có lần khoảng 19 giờ. Năm 2022 hacker lấy khoảng 320 triệu USD từ Wormhole, một cầu nối gắn với Solana."],
      },
      {
        title: "2. Quyền lực trong tay ít người.",
        body: ["Chưa tới 800 máy vận hành mạng — giảm khoảng 2/3 từ năm 2023 — và chúng rất đắt. Nhà đầu tư sớm, đội ngũ và quỹ nắm phần lớn số coin đầu tiên, còn phần mềm chủ yếu do vài tổ chức viết."],
      },
      {
        title: "3. Tiếng xấu meme coin.",
        body: ["Pump.fun, TRUMP và LIBRA khiến Solana trông như sòng bạc. Đa số người mua meme coin lỗ tiền, và một vụ kiện (vẫn chỉ là cáo buộc) nêu tên lãnh đạo Solana."],
      },
      {
        title: "4. Giá lên xuống dữ dội.",
        body: ["SOL mất 97% từ 2021 tới 2022, và tháng 11/2026 thấp hơn khoảng 75% so với kỷ lục tháng 1/2025. Giá phụ thuộc nhiều vào việc người ta mua bán nhiều hay ít."],
      },
      {
        title: "5. Năm nào cũng in thêm coin.",
        body: ["SOL không có số lượng tối đa. Mỗi năm khoảng 3,8% SOL mới được tạo ra làm phần thưởng; ai không tham gia sẽ dần sở hữu phần nhỏ hơn. (Năm 2026 đã bỏ phiếu cắt giảm nhanh hơn.)"],
      },
    ],
  },
  {
    label: "Đặt lên bàn cân",
    title: "Đặt lên bàn cân",
    question: "Vậy bên nào nặng hơn?",
    figure: "Một chiếc cân với năm điểm mạnh một bên và năm điểm yếu bên kia; rồi 12 tháng gần nhất của SOL vẽ thành một đường, kết thúc giảm hơn 40%.",
    takeaway: "Công nghệ rõ ràng đã tiến bộ; giá thì chưa theo kịp. Cả hai đĩa cân đều có thật.",
    beats: [
      {
        title: "Điểm mạnh bên trái…",
        body: ["Nhanh, rẻ, được dùng thật, tiền lớn vào, bền bỉ."],
      },
      {
        title: "…điểm yếu bên phải.",
        body: ["Sập mạng và bị hack, ít người nắm quyền, tiếng xấu meme, giá biến động, in thêm coin. Chiếc cân gần như thăng bằng — và đó chính là lý do người ta tranh cãi mãi về Solana."],
      },
      {
        title: "Mười hai tháng qua.",
        body: ["Mức sử dụng lập kỷ lục trong khi giá giảm hơn 40%. Mạng lưới và giá coin không còn đi cùng nhau."],
      },
    ],
  },
  {
    label: "Kết luận",
    title: "Kết luận",
    question: "Vậy — sau sáu năm, Solana là gì?",
    figure: "Điện thoại của Minh báo khoản trả tiền cà phê đã được xác nhận trong chưa tới một giây với phí chưa tới một xu. Sân khấu trống dần và đồng SOL 3D ghép lại, có thể xoay.",
    takeaway: "Solana chứng minh một blockchain có thể nhanh và rẻ như ứng dụng thanh toán, và đủ lì để sống sót sau FTX. Đổi lại, nó chấp nhận ít người vận hành hơn với máy mạnh hơn, lịch sử sập mạng và một đám đông đầu cơ. Mạng tốt và coin an toàn là hai câu hỏi khác nhau.",
    beats: [
      {
        title: "Kết luận: nhanh, lì đòn — nhưng vẫn rủi ro.",
        body: [
          "Solana làm đúng điều đã hứa: 2 USD của Minh tới nơi trong chưa tới một giây, phí chưa tới một xu. Nó còn sống sót sau một cú sụp có thể giết chết hầu hết dự án khác, và thuyết phục được các công ty lớn.",
          "Nhưng cái giá của tốc độ là có thật: ít người vận hành hơn với máy mạnh hơn, lịch sử sập mạng, và cái tên gắn liền với meme coin.",
        ],
      },
      {
        title: "Điều này có nghĩa gì với bạn.",
        body: [
          "Nếu là người dùng: Solana là cách chuyển tiền và đổi token tiện, rẻ — nhưng hãy tránh xa những meme coin bạn không hiểu.",
          "Nếu là nhà đầu tư: SOL đã từng mất 75–97% giá trị hơn một lần. Mạng tốt không bảo đảm giá tăng. Chỉ dùng số tiền bạn chấp nhận mất. Đây không phải lời khuyên đầu tư.",
        ],
      },
      {
        title: "Lật đồng coin.",
        body: ["Kéo đồng SOL để xoay. Nguồn của mọi con số có ở bên dưới."],
      },
    ],
  },
];
