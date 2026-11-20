/** Story copy for the USDC explainer, English and Vietnamese.
 * Plain language first: how the vault works, eight years of history, USDC today, strengths, weaknesses and a conclusion.
 * Narrator: Hà, who sells Hội An lanterns online; Sarah is her customer in Australia. Both are fictional. */
export type Beat = { title: string; body: string[]; notes?: string[]; deep?: string[]; insight?: string };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "Why USDC?",
    title: "A digital dollar with its papers in order",
    question: "How can a coin always be worth exactly one dollar — and who checks?",
    figure: "A round vault door with the USDC mark in the middle; 1 USD goes in, 1 USDC comes out; a question mark hangs over the vault.",
    takeaway: "USDC is a digital dollar issued by Circle, a US company listed on the stock exchange. Each token is meant to be backed by one real dollar of cash or very short US government debt, and the backing is checked every month.",
    beats: [
      {
        title: "No finance knowledge needed. We start with Hà's lanterns.",
        body: ["Hà makes silk lanterns in Hội An and sells them online. Sarah, a customer in Australia, orders 1,000 dollars' worth. A bank transfer would take days and cost fees, so Sarah offers to pay in USDC instead. Scroll down."],
      },
      {
        title: "USDC is a receipt for a dollar in a vault.",
        body: [
          "A US company called Circle holds dollars — as cash and as very short loans to the US government. For every dollar it holds, it creates one USDC: a token on a blockchain that can be sent anywhere in minutes.",
          "That is why its price stays at about $1: a business can always hand one USDC back to Circle for one dollar.",
        ], insight: "USDC is the second-largest stablecoin. About 67.9 billion were in circulation on 12 November 2026 — a little over a third of the size of Tether's USDT.",
      },
      {
        title: "So the whole story comes down to two questions: is the money in the vault — and can it always get out?",
        body: [
          "First we open the vault and see how it works. Then eight years of history — including the weekend in 2023 when part of the vault got stuck in a failing bank — and finally the rules, the strengths, the weaknesses and a conclusion.",
        ],
      },
    ],
  },
  {
    label: "1 · Mint and burn",
    title: "1 · Dollars in, tokens out",
    question: "Where do new USDC come from — and where do they go?",
    figure: "Two receipts: a business sends Circle 1,000,000 USD and Circle mints 1,000,000 USDC; another returns 1,000,000 USDC, Circle burns them and wires the dollars back. A rubber band keeps the price at $1; a counter shows about 67.9 billion USDC.",
    takeaway: "New USDC are created when dollars come in and destroyed when dollars go out. Traders keep the price near $1 by buying cheap tokens and cashing them in, or creating new ones and selling them.",
    beats: [
      {
        title: "Send a dollar, a token is minted.",
        body: [
          "A business with a Circle Mint account — say a payments company — wires Circle 1 million dollars. Circle creates (\"mints\") 1 million new USDC and sends them to the company's wallet.",
          "Nothing magical: the dollars go into the reserve, the tokens go out into the world.",
        ],
      },
      {
        title: "Hand the token back, it is burned.",
        body: [
          "When a business returns 1 million USDC, Circle wires the dollars back and destroys (\"burns\") the tokens. Only verified businesses can do this directly with Circle; a standard redemption carries no Circle fee.",
          "So the number of USDC should always match the dollars Circle owes.",
        ], insight: "The door is busy: in the week to 12 November 2026, Circle minted about 10.8 billion USDC and burned about 12.1 billion. At that pace, an amount equal to every USDC in existence passes through Circle in about six weeks.",
      },
      {
        title: "Sarah never meets Circle. So why is her USDC worth $1?",
        body: [
          "Ordinary people buy USDC on an exchange or in an app. Big traders keep that price near $1: if USDC drops to $0.99, they buy the cheap tokens and hand them to Circle for a full dollar; if it rises to $1.01, they mint new ones for $1 and sell them.",
          "That simple trade works like a rubber band, pulling the price back to one dollar.",
        ],
      },
      {
        title: "About 67.9 billion USDC exist today.",
        body: [
          "On 12 November 2026 Circle reported about 67.9 billion USDC in circulation, against reserves of about $68.1 billion.",
          "Each one is a promise of one dollar. Next: what exactly backs those promises?",
        ],
      },
    ],
  },
  {
    label: "2 · Inside the vault",
    title: "2 · Open the vault: cash and very short IOUs, nothing else",
    question: "What backs 67.9 billion promises?",
    figure: "A grid of 100 squares, each about $0.68 billion: 59 blue (overnight loans backed by US Treasury bonds), 29 light blue (Treasury bills), 11 green (cash at the largest banks), 1 grey (cash at other banks). A bracket marks about 100 squares owed to holders; in a stress test the 12 bank-cash squares fall away and 88 remain.",
    takeaway: "Almost nine tenths of the vault is very short lending to, or secured by, the US government; the rest is bank cash. No gold, no bitcoin, no company loans — but also almost no extra cushion.",
    beats: [
      {
        title: "$68.1 billion of reserves.",
        body: [
          "Circle publishes what is in the vault every week, and every month a Big Four accounting firm (Deloitte) checks that the reserves are at least as large as the USDC in circulation. On 12 November 2026: $68.1 billion of reserves for about 67.9 billion USDC.",
          "Let's turn that into 100 squares, each worth about $0.68 billion.",
        ],
      },
      {
        title: "59 squares: overnight loans backed by US government bonds.",
        body: [
          "The biggest part — about $39.9 billion — is \"repo\": Circle lends cash overnight to large banks and takes US Treasury bonds as a pledge. The next morning the cash comes back.",
          "Most of this sits in the Circle Reserve Fund, a money-market fund registered with the US securities regulator and managed by BlackRock, the world's largest asset manager. Circle is its only shareholder.",
        ], insight: "BlackRock publishes the fund's holdings itself — a second pair of eyes, outside Circle, on most of the vault.",
      },
      {
        title: "29 squares: Treasury bills.",
        body: [
          "About $20.1 billion is US Treasury bills that mature in less than three months — short IOUs from the US government.",
        ], insight: "S&P found that the vault's assets mature, on average, in about ten days. In other words, almost the whole vault turns back into cash within two weeks.",
      },
      {
        title: "12 squares: cash in banks.",
        body: [
          "About $7.4 billion sits as deposits at \"systemically important\" banks — the giants governments are least likely to let fail — and about $0.6 billion at other banks.",
          "Cash is available at once on a weekday. But a deposit is only as safe as the bank that holds it.",
        ],
      },
      {
        title: "About 100 squares are owed. Now freeze the banks.",
        body: [
          "Reserves and USDC are almost equal: $68.1 billion against 67.9 billion. Unlike Tether, Circle keeps almost no extra cushion inside the vault. Its promise is simply one dollar in, one dollar out — checked every month.",
          "Stress test: imagine every bank holding Circle's cash froze it for a weekend.",
        ], insight: "Even then, 88 of the 100 squares — the repo loans and Treasury bills — would still be there. In 2023 the stuck share was about 8%, and that alone pushed USDC down to 87 cents. Chapter 5 tells that story.",
        notes: ["Circle transparency report, 12 Nov 2026. A monthly accountant's check confirms the totals on given dates; it is not a full audit of the company."],
      },
    ],
  },
  {
    label: "3 · Who keeps the interest?",
    title: "3 · Interest for Circle — and a big share for Coinbase",
    question: "If Hà's USDC earns nothing, who earns the interest?",
    figure: "Hà's 1,000 USDC earn 0%; the dollars behind them earn interest for Circle. Bars show Circle's revenue: $1.45 billion (2023), $1.68 billion (2024), $2.75 billion (2025), $2.26 billion (January–September 2026). Of every 100 dollars earned in 2025, about 61 were paid on to partners, mostly Coinbase.",
    takeaway: "USDC holders get no interest from Circle. Circle earns it from the reserves — then pays most of it to the exchanges and apps that spread USDC, above all Coinbase.",
    beats: [
      {
        title: "Hà earns 0%. Circle earns the interest.",
        body: [
          "Holding USDC pays no interest from Circle. But the dollars behind it sit in Treasury bills and repo loans that do pay interest — about 3.5% a year in the third quarter of 2026.",
          "So the more USDC exists, the more Circle earns.",
        ],
      },
      {
        title: "Billions a year — nearly all of it interest.",
        body: [
          "Circle's revenue was about $1.45 billion in 2023, $1.68 billion in 2024 and $2.75 billion in 2025. In 2024, 99% of it came from interest on the reserves.",
          "From January to September 2026 it reached about $2.26 billion, including a one-off $182 million from pre-selling tokens of its new blockchain, Arc.",
        ],
      },
      {
        title: "But most of the interest is passed on.",
        body: [
          "Circle pays exchanges and apps to hold and offer USDC. In 2025, about 61 of every 100 dollars it earned went straight out again as distribution and transaction costs.",
          "The biggest partner by far is Coinbase, which helped launch USDC and received about $908 million from Circle in 2024 alone.",
        ], insight: "In 2024 Circle paid Coinbase about $908 million — almost six times Circle's own net profit that year (about $156 million).",
      },
      {
        title: "The business in one line.",
        body: [
          "Take dollars from holders at 0%, lend them to the US government, share the interest with the distributors.",
          "When US rates fall, income falls with them: Circle estimated that one percentage point lower would cut its reserve income by about $441 million a year. In the third quarter of 2026, a 0.61-point drop in its return already cut reserve income by 8%.",
        ],
      },
    ],
  },
  {
    label: "4 · From start-up to Wall Street (2013–2025)",
    title: "4 · From a payments start-up to the New York Stock Exchange",
    question: "Who built USDC, and why?",
    figure: "A timeline: Circle founded in 2013, USDC launched on 26 September 2018, Circle listed on the NYSE on 5 June 2025. Sarah's bank transfer crawls to Hà while USDC zips across; Circle and Coinbase under the Centre consortium, 2018–2023; the early supply line stays below $1 billion until mid-2020, then jumps to about $4 billion by 2021.",
    takeaway: "USDC was built by Circle, with Coinbase, as a regulated digital dollar that accountants can check. It grew slowly at first, took off with DeFi in 2020, and Circle went public in 2025.",
    beats: [
      {
        title: "2013: a payments start-up. 2018: a digital dollar.",
        body: [
          "Circle was founded in 2013 by Jeremy Allaire and Sean Neville. On 26 September 2018, together with the exchange Coinbase, it launched USDC on Ethereum — a dollar token backed by cash and reviewed by accountants every month.",
        ], insight: "USDC arrived four years after Tether, from the opposite starting point: designed from day one to live inside US rules.",
      },
      {
        title: "Why a token at all? Speed.",
        body: [
          "A bank transfer from Sarah in Australia to Hà in Vietnam can take days and pass through several banks, each taking a fee. USDC goes from wallet to wallet in minutes, at any hour, on any day.",
        ],
      },
      {
        title: "Circle + Coinbase = Centre.",
        body: [
          "At first USDC was run by Centre, a consortium set up by Circle and Coinbase. In August 2023 they closed it: Circle took full control of USDC, and Coinbase received a stake in Circle while keeping a share of the interest.",
        ], insight: "That 2023 deal is why Coinbase still collects such a large share of USDC's interest (chapter 3).",
      },
      {
        title: "A slow start, a jump — and Wall Street.",
        body: [
          "For almost two years USDC stayed below $1 billion. Then the March 2020 crash and \"DeFi summer\" — apps on Ethereum that lend and trade without a bank — pushed it to about $4 billion by 1 January 2021.",
          "On 5 June 2025 Circle listed its shares on the New York Stock Exchange: priced at $31, they closed the first day at $83.23.",
        ], insight: "That 168% first-day jump was the biggest for a billion-dollar US IPO in more than 30 years of Renaissance Capital's records.",
      },
    ],
  },
  {
    label: "5 · The stuck weekend (Mar 2023)",
    title: "5 · When the bank holding the cash failed",
    question: "What happens if the bank holding the dollars goes bust?",
    figure: "Silicon Valley Bank sinks below the waterline with $3.3 billion of USDC reserves inside; USDC drops to about $0.87 on 11 March 2023 and returns to $1; the supply bar shrinks from about $43 billion to about $32.5 billion; two tanks: SVB collapsed, USDC kept paying $1.",
    takeaway: "In March 2023 about 8% of USDC's reserves got stuck in a failed bank. The price fell to 87 cents for a weekend and recovered once the US government guaranteed the bank's deposits. Circle then moved its cash to the largest banks.",
    beats: [
      {
        title: "Friday, 10 March 2023: Silicon Valley Bank collapses.",
        body: [
          "SVB, a large Californian bank, failed after a run by its depositors. Late that night Circle said $3.3 billion of its roughly $40 billion of reserves was still inside — the transfers it had ordered to move the money had not gone through.",
        ],
      },
      {
        title: "Saturday: USDC falls to 87 cents.",
        body: [
          "Banks were closed for the weekend, so Circle could not pay anyone out. Holders who wanted to leave had to sell on exchanges, and the price fell to about $0.87 — the lowest in USDC's history.",
        ], insight: "Markets did the arithmetic fast: about 8% of the reserves were stuck, and the price fell by roughly that much — and briefly more.",
      },
      {
        title: "Monday: the doors reopen.",
        body: [
          "On Sunday the US authorities said all SVB deposits would be protected. When banks opened on Monday, Circle restarted redemptions: from 13 to 15 March it paid out $3.8 billion and created $0.8 billion of new USDC. The price went back to $1.",
          "But trust had taken a hit: within weeks about $10 billion of USDC had been cashed in and did not come back.",
        ],
      },
      {
        title: "A bank died; USDC did not.",
        body: [
          "SVB lost about a quarter of its deposits in a single day and collapsed. USDC lost about a quarter of its supply over the following weeks — and still paid $1 for every token handed back.",
        ], insight: "Circle's lesson: since then it keeps most of the vault in a BlackRock fund of US government debt and its cash at the very largest banks. But the 2023 rescue came from the US government, not from Circle.",
      },
    ],
  },
  {
    label: "6 · Down by half, then back (2022–2026)",
    title: "6 · Shrinking by half — then a comeback",
    question: "How big is USDC now, and where does it live?",
    figure: "The USDC supply line from 2018 to 2026, drawn through dated milestones: a peak of about $56 billion in June 2022, a low of $23.8 billion in January 2024, $75.3 billion at the end of 2025 and about 67.9 billion in November 2026. Below: where USDC sits by blockchain; padlocks comparing frozen addresses, USDC 372 against USDT 7,268; Circle's headquarters in New York.",
    takeaway: "USDC fell by more than half from 2022 to 2024, then tripled. It lives on 38 blockchains, mostly Ethereum, and — like USDT — it can be frozen, though far less often.",
    beats: [
      {
        title: "Up to $56 billion — then down to $24 billion.",
        body: [
          "USDC peaked at about $56 billion in June 2022. The crypto crash, the SVB weekend and competition from USDT then shrank it to about $23.8 billion at the start of 2024.",
        ],
        notes: ["The line joins dated figures from Circle and the press with straight lines; it is not a daily series."],
      },
      {
        title: "The comeback.",
        body: [
          "With clearer rules in Europe and the US, USDC grew again: about $44 billion at the start of 2025 and $75.3 billion at its end. In late 2026 it slipped back, to about 67.9 billion in mid-November.",
        ], insight: "In 2025 alone USDC grew 72% — faster than USDT. Even so, USDT is still more than two and a half times its size.",
      },
      {
        title: "One coin, 38 blockchains.",
        body: [
          "Circle issues USDC directly on 38 blockchains (September 2026). About 60% of it sits on Ethereum; Hyperliquid and Base are next.",
          "To move USDC between chains, Circle burns it on one and mints it on the other — a system called CCTP. More than $41 billion moved that way in the last quarter of 2025 alone.",
        ],
      },
      {
        title: "Like USDT, it can be frozen.",
        body: [
          "Circle can block any address, and does so on court orders, sanctions and regulators' demands. From 2023 to 2025 it blacklisted about 372 addresses holding $109 million. Tether blacklisted about 7,268 holding $3.29 billion.",
        ], insight: "Circle freezes about 30 times less than Tether — but a freeze can still hit businesses: in March 2026 it froze 16 business wallets at once in a civil court case.",
      },
      {
        title: "A public company in New York.",
        body: [
          "Circle is listed on the New York Stock Exchange (ticker CRCL) and files audited yearly accounts and quarterly reports with the US securities regulator. Anyone can read how much it earns, what it pays Coinbase and what sits in the vault.",
        ],
      },
    ],
  },
  {
    label: "7 · New rules",
    title: "7 · The rule-follower's advantage",
    question: "Is USDC allowed in the US and Europe?",
    figure: "America's GENIUS Act demands licences, full safe reserves and regular reports; Circle wins a federal trust-bank charter. Europe's MiCA shelf keeps USDC while USDT slides off. S&P's gauge points to 2, \"strong\"; USDT sits at 5.",
    takeaway: "USDC was built for the rules. It is licensed in Europe, on track under America's new law and now has a federally supervised trust bank — its biggest advantage over USDT.",
    beats: [
      {
        title: "America: the GENIUS Act — and a bank charter.",
        body: [
          "On 18 July 2025 the US signed its first federal stablecoin law: issuers serving Americans need a licence, full reserves of safe assets and regular reports — close to how USDC already worked.",
          "Circle also applied to open a national trust bank. The US bank regulator, the OCC, approved it conditionally in December 2025 and finally on 10 July 2026: Circle National Trust, under direct federal supervision.",
        ], insight: "The trust bank starts by safekeeping digital assets; the plan is for it to oversee the USDC reserve later — moving the vault under a federal bank supervisor.",
      },
      {
        title: "Europe: first through the door.",
        body: [
          "The EU's MiCA rules allow only licensed stablecoins on regulated exchanges. On 1 July 2024 Circle became the first global stablecoin issuer to comply, through an e-money licence in France. Tether did not apply, and USDT was removed for European users.",
        ],
      },
      {
        title: "A \"strong\" grade.",
        body: [
          "The rating agency S&P scores how well a stablecoin holds $1, from 1 (very strong) to 5 (weak). In December 2025 it kept USDC at 2, \"strong\": the reserves themselves scored 1, the best, but it is not yet proven how holders would be protected if Circle itself went bankrupt. USDT is rated 5.",
          "The table below compares USDC with its two closest relatives.",
        ],
      },
    ],
  },
  {
    label: "Strengths",
    title: "What USDC does well",
    question: "Why do banks, apps and payment companies choose it?",
    figure: "Five cards: the plainest vault; checked every month; inside the rules; fast and on many blockchains; it survived its worst weekend.",
    beats: [
      { title: "1 · The plainest vault.", body: ["Only cash, overnight loans backed by Treasury bonds, and Treasury bills — no gold, bitcoin or company loans. S&P gives the reserve assets its best score: 1, \"very strong\"."] },
      { title: "2 · Checked every month.", body: ["Circle shows the vault every week, a Big Four firm checks it every month, and as a listed company Circle files audited accounts with the US securities regulator."] },
      { title: "3 · Inside the rules.", body: ["Licensed under Europe's MiCA since July 2024, built for America's GENIUS Act, and with a federally supervised trust bank approved in July 2026."] },
      { title: "4 · Fast and everywhere.", body: ["Issued natively on 38 blockchains and moved between them by burning and minting — more than $41 billion in the last quarter of 2025 alone."] },
      { title: "5 · It survived its worst weekend.", body: ["In March 2023, with $3.3 billion stuck in a failed bank, Circle still paid out $3.8 billion in three days once banks reopened — and every token went back to $1."] },
    ],
  },
  {
    label: "Weaknesses",
    title: "What can go wrong",
    question: "What risks come with holding USDC?",
    figure: "Five warning cards: it depends on banks; one company can freeze it; holders get no interest; income tied to US rates; smaller and swings with crypto.",
    beats: [
      { title: "1 · It depends on banks.", body: ["The 2023 weekend showed it: when one bank failed, USDC fell to 87 cents. Bank cash — about 12% of the vault today — is only as safe as the banks that hold it, and redemptions wait for banks to open."] },
      { title: "2 · One company can freeze it.", body: ["Circle blocks addresses on court orders and sanctions. It does so far less often than Tether, but any USDC can still be frozen."] },
      { title: "3 · No interest, no insurance.", body: ["Holders earn nothing from Circle while it keeps the interest and shares most of it with Coinbase and other partners. And USDC is not a bank deposit: there is no deposit insurance."] },
      { title: "4 · Tied to US interest rates.", body: ["Nearly all Circle's income is interest. Each one-point cut in US rates costs it about $441 million a year — pressure that grows as rates fall."] },
      { title: "5 · Smaller, and swings with crypto.", body: ["USDC fell from about $56 billion (2022) to $23.8 billion (2024) before recovering. USDT is still more than two and a half times larger and dominates trading."] },
    ],
  },
  {
    label: "Conclusion",
    title: "Conclusion",
    question: "So, should Hà accept USDC?",
    figure: "Hà's phone shows 1,000 USDC ≈ $1,000; then the USDC coin assembles and can be turned.",
    beats: [
      {
        title: "USDC does one job well: a dollar you can check.",
        body: ["It has stayed at about $1 for eight years except for one weekend, keeps a simple vault of cash and US government debt, is checked every month and is regulated in the US and Europe."],
      },
      {
        title: "But it is still a promise from one company — and from its banks.",
        body: ["Circle sets the rules, can freeze addresses, keeps the interest and depends on the banking system. Regulation lowers these risks; it does not remove them."], insight: "Choosing between USDC and USDT is a trade-off: USDC offers more rules and openness; USDT offers more size and reach. Neither pays holders interest or insures their money.",
      },
      {
        title: "For Hà: a tool, not a savings account.",
        body: [
          "To get paid by Sarah in minutes, USDC is practical. To spend the money, Hà still has to turn it into đồng — and as of November 2026 no crypto exchange in Vietnam is licensed yet. So convert promptly, use reputable platforms and don't leave large sums on one exchange. This is education, not investment advice.",
          "Drag the coin to turn it over.",
        ],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Vì sao có USDC?",
    title: "Đồng đô la số có giấy tờ đầy đủ",
    question: "Làm sao một đồng coin luôn đáng đúng 1 đô la — và ai kiểm tra?",
    figure: "Một cánh cửa két tròn với biểu tượng USDC ở giữa; 1 USD đi vào, 1 USDC đi ra; một dấu hỏi lơ lửng trên chiếc két.",
    takeaway: "USDC là đồng đô la số do Circle — một công ty Mỹ niêm yết trên sàn chứng khoán — phát hành. Mỗi token được bảo chứng bằng 1 đô la tiền mặt hoặc nợ rất ngắn hạn của chính phủ Mỹ, và việc bảo chứng được kiểm tra hằng tháng.",
    beats: [
      {
        title: "Không cần biết gì về tài chính. Bắt đầu từ những chiếc đèn lồng của Hà.",
        body: ["Hà làm đèn lồng lụa ở Hội An và bán online. Sarah, một khách hàng ở Úc, đặt lô hàng 1.000 đô. Chuyển khoản ngân hàng mất vài ngày và tốn phí, nên Sarah đề nghị trả bằng USDC. Hãy cuộn xuống."],
      },
      {
        title: "USDC là tờ biên nhận cho 1 đô la nằm trong két.",
        body: [
          "Một công ty Mỹ tên Circle giữ đô la — dưới dạng tiền mặt và các khoản cho chính phủ Mỹ vay rất ngắn hạn. Cứ mỗi đô la họ giữ, họ tạo ra một USDC: token nằm trên blockchain, gửi đi đâu cũng được trong vài phút.",
          "Vì vậy giá của nó đứng quanh 1 USD: doanh nghiệp luôn có thể trả 1 USDC cho Circle để lấy lại 1 đô la.",
        ], insight: "USDC là stablecoin lớn thứ hai thế giới. Ngày 12/11/2026 có khoảng 67,9 tỷ USDC đang lưu hành — lớn hơn một phần ba quy mô USDT của Tether một chút.",
      },
      {
        title: "Nên cả câu chuyện xoay quanh hai câu hỏi: tiền có trong két không — và lúc nào cũng rút ra được không?",
        body: [
          "Trước tiên ta mở két xem nó vận hành ra sao. Sau đó là tám năm lịch sử — kể cả dịp cuối tuần năm 2023 khi một phần tiền trong két bị kẹt ở một ngân hàng sụp đổ — rồi tới luật chơi, điểm mạnh, điểm yếu và phần kết luận.",
        ],
      },
    ],
  },
  {
    label: "1 · Tạo ra và đốt đi",
    title: "1 · Đô la vào, token ra",
    question: "USDC mới từ đâu ra — và đi đâu?",
    figure: "Hai tờ biên nhận: một doanh nghiệp gửi Circle 1.000.000 USD và Circle tạo 1.000.000 USDC; một doanh nghiệp khác trả lại 1.000.000 USDC, Circle đốt chúng và chuyển đô la về. Một sợi dây chun giữ giá ở 1 USD; bộ đếm hiện khoảng 67,9 tỷ USDC.",
    takeaway: "USDC mới được tạo ra khi đô la đi vào và bị huỷ khi đô la đi ra. Dân giao dịch giữ giá quanh 1 USD bằng cách mua token rẻ để đổi lấy đô la, hoặc tạo token mới để bán.",
    beats: [
      {
        title: "Gửi 1 đô la, một token được tạo ra.",
        body: [
          "Một doanh nghiệp có tài khoản Circle Mint — ví dụ một công ty thanh toán — chuyển khoản cho Circle 1 triệu đô. Circle tạo (\"mint\") 1 triệu USDC mới và gửi vào ví của công ty đó.",
          "Không có gì thần bí: đô la vào quỹ dự trữ, token đi ra ngoài thế giới.",
        ],
      },
      {
        title: "Trả lại token, token bị đốt.",
        body: [
          "Khi một doanh nghiệp trả lại 1 triệu USDC, Circle chuyển đô la về và huỷ (\"đốt\") số token đó. Chỉ doanh nghiệp đã xác minh mới làm trực tiếp với Circle được; đổi theo cách thông thường (Standard) không mất phí của Circle.",
          "Vì vậy số USDC luôn phải khớp với số đô la Circle đang nợ.",
        ], insight: "Cánh cửa này rất bận: trong tuần tới 12/11/2026, Circle tạo khoảng 10,8 tỷ USDC và đốt khoảng 12,1 tỷ. Với tốc độ đó, một lượng bằng toàn bộ USDC đang tồn tại đi qua tay Circle chỉ trong khoảng sáu tuần.",
      },
      {
        title: "Sarah chưa từng gặp Circle. Vậy sao USDC của cô vẫn đáng 1 đô?",
        body: [
          "Người bình thường mua USDC trên sàn hoặc trong ứng dụng. Các nhà giao dịch lớn giữ giá quanh 1 USD: nếu USDC rớt xuống 0,99 USD, họ mua token rẻ rồi đổi với Circle lấy đủ 1 đô; nếu nó lên 1,01 USD, họ tạo token mới với giá 1 USD rồi bán ra.",
          "Phép mua bán đơn giản đó hoạt động như một sợi dây chun, kéo giá về lại 1 đô la.",
        ],
      },
      {
        title: "Hiện có khoảng 67,9 tỷ USDC.",
        body: [
          "Ngày 12/11/2026, Circle báo cáo khoảng 67,9 tỷ USDC đang lưu hành, với quỹ dự trữ khoảng 68,1 tỷ USD.",
          "Mỗi token là một lời hứa trả 1 đô la. Tiếp theo: cái gì đứng sau những lời hứa đó?",
        ],
      },
    ],
  },
  {
    label: "2 · Bên trong két",
    title: "2 · Mở két: chỉ có tiền mặt và giấy nợ rất ngắn",
    question: "Cái gì bảo chứng cho 67,9 tỷ lời hứa?",
    figure: "Lưới 100 ô, mỗi ô khoảng 0,68 tỷ USD: 59 ô xanh dương (cho vay qua đêm có trái phiếu Kho bạc Mỹ thế chấp), 29 ô xanh nhạt (tín phiếu Kho bạc), 11 ô xanh lá (tiền gửi ở các ngân hàng lớn nhất), 1 ô xám (tiền gửi ở ngân hàng khác). Một dấu ngoặc đánh dấu khoảng 100 ô đang nợ người giữ; trong phép thử sức chịu đựng, 12 ô tiền gửi ngân hàng rơi ra, còn lại 88 ô.",
    takeaway: "Gần chín phần mười chiếc két là các khoản cho vay rất ngắn cho chính phủ Mỹ hoặc có chính phủ Mỹ đứng sau; phần còn lại là tiền gửi ngân hàng. Không vàng, không bitcoin, không cho doanh nghiệp vay — nhưng cũng gần như không có lớp đệm dư.",
    beats: [
      {
        title: "68,1 tỷ USD dự trữ.",
        body: [
          "Circle công bố trong két có gì mỗi tuần, và mỗi tháng một hãng kiểm toán Big Four (Deloitte) kiểm tra xem quỹ dự trữ có ít nhất bằng số USDC đang lưu hành không. Ngày 12/11/2026: 68,1 tỷ USD dự trữ cho khoảng 67,9 tỷ USDC.",
          "Hãy đổi con số đó thành 100 ô vuông, mỗi ô khoảng 0,68 tỷ USD.",
        ],
      },
      {
        title: "59 ô: cho vay qua đêm, có trái phiếu chính phủ Mỹ thế chấp.",
        body: [
          "Phần lớn nhất — khoảng 39,9 tỷ USD — là \"repo\": Circle cho các ngân hàng lớn vay tiền qua đêm và nhận trái phiếu Kho bạc Mỹ làm vật thế chấp. Sáng hôm sau tiền quay về.",
          "Phần lớn số này nằm trong Circle Reserve Fund, một quỹ thị trường tiền tệ đăng ký với cơ quan chứng khoán Mỹ và do BlackRock — công ty quản lý tài sản lớn nhất thế giới — điều hành. Circle là cổ đông duy nhất.",
        ], insight: "BlackRock tự công bố danh mục của quỹ — thêm một đôi mắt bên ngoài Circle nhìn vào phần lớn chiếc két.",
      },
      {
        title: "29 ô: tín phiếu Kho bạc.",
        body: [
          "Khoảng 20,1 tỷ USD là tín phiếu Kho bạc Mỹ đáo hạn trong vòng chưa tới ba tháng — giấy nợ ngắn hạn của chính phủ Mỹ.",
        ], insight: "S&P tính ra tài sản trong két đáo hạn trung bình sau khoảng 10 ngày. Nói cách khác, gần như cả chiếc két quay về thành tiền mặt trong vòng hai tuần.",
      },
      {
        title: "12 ô: tiền gửi ngân hàng.",
        body: [
          "Khoảng 7,4 tỷ USD là tiền gửi ở các ngân hàng \"quan trọng mang tính hệ thống\" — những gã khổng lồ mà chính phủ ít khi để sụp — và khoảng 0,6 tỷ USD ở các ngân hàng khác.",
          "Tiền mặt rút được ngay trong ngày làm việc. Nhưng tiền gửi chỉ an toàn bằng chính ngân hàng giữ nó.",
        ],
      },
      {
        title: "Khoảng 100 ô đang nợ. Giờ thử đóng băng các ngân hàng.",
        body: [
          "Dự trữ và USDC gần như bằng nhau: 68,1 tỷ USD so với 67,9 tỷ USDC. Khác với Tether, Circle gần như không giữ lớp đệm dư trong két. Lời hứa của họ đơn giản là 1 đô vào, 1 đô ra — được kiểm tra hằng tháng.",
          "Phép thử: giả sử mọi ngân hàng đang giữ tiền mặt của Circle cùng đóng băng nó trong một dịp cuối tuần.",
        ], insight: "Kể cả khi đó, 88 trên 100 ô — các khoản repo và tín phiếu Kho bạc — vẫn còn nguyên. Năm 2023 phần bị kẹt chỉ khoảng 8%, vậy mà riêng chuyện đó đã kéo USDC xuống 0,87 USD. Chương 5 kể lại câu chuyện ấy.",
        notes: ["Báo cáo minh bạch của Circle, 12/11/2026. Kiểm tra hằng tháng của kế toán xác nhận số tổng vào những ngày nhất định; đó không phải kiểm toán toàn bộ công ty."],
      },
    ],
  },
  {
    label: "3 · Ai hưởng tiền lãi?",
    title: "3 · Tiền lãi về Circle — và một phần lớn cho Coinbase",
    question: "Nếu USDC của Hà không sinh lãi, thì ai hưởng tiền lãi?",
    figure: "1.000 USDC của Hà được 0%; số đô la phía sau sinh lãi cho Circle. Các cột cho thấy doanh thu của Circle: 1,45 tỷ USD (2023), 1,68 tỷ (2024), 2,75 tỷ (2025), 2,26 tỷ (tháng 1–9/2026). Cứ 100 đô kiếm được năm 2025, khoảng 61 đô được chuyển cho đối tác, chủ yếu là Coinbase.",
    takeaway: "Người giữ USDC không nhận lãi từ Circle. Circle hưởng lãi từ quỹ dự trữ — rồi trả phần lớn cho các sàn và ứng dụng phân phối USDC, nhiều nhất là Coinbase.",
    beats: [
      {
        title: "Hà được 0%. Circle hưởng tiền lãi.",
        body: [
          "Giữ USDC không được Circle trả lãi. Nhưng số đô la phía sau nằm trong tín phiếu Kho bạc và các khoản repo có sinh lãi — khoảng 3,5%/năm trong quý 3/2026.",
          "Vậy USDC càng nhiều, Circle càng kiếm được nhiều.",
        ],
      },
      {
        title: "Hàng tỷ đô mỗi năm — gần như toàn bộ là tiền lãi.",
        body: [
          "Doanh thu của Circle khoảng 1,45 tỷ USD năm 2023, 1,68 tỷ năm 2024 và 2,75 tỷ năm 2025. Năm 2024, 99% trong số đó đến từ tiền lãi của quỹ dự trữ.",
          "Từ tháng 1 tới tháng 9/2026 doanh thu đạt khoảng 2,26 tỷ USD, trong đó có khoản một lần 182 triệu USD từ bán trước token của blockchain mới Arc.",
        ],
      },
      {
        title: "Nhưng phần lớn tiền lãi được chia lại.",
        body: [
          "Circle trả tiền cho các sàn và ứng dụng để họ giữ và cung cấp USDC. Năm 2025, cứ 100 đô Circle kiếm được thì khoảng 61 đô đi ra ngay dưới dạng chi phí phân phối và giao dịch.",
          "Đối tác lớn nhất là Coinbase — bên cùng ra mắt USDC — nhận khoảng 908 triệu USD từ Circle chỉ riêng năm 2024.",
        ], insight: "Năm 2024 Circle trả Coinbase khoảng 908 triệu USD — gần gấp sáu lần lợi nhuận ròng của chính Circle năm đó (khoảng 156 triệu USD).",
      },
      {
        title: "Mô hình kinh doanh trong một dòng.",
        body: [
          "Nhận đô la của người giữ với lãi 0%, cho chính phủ Mỹ vay, chia tiền lãi với các bên phân phối.",
          "Khi lãi suất Mỹ giảm, thu nhập giảm theo: Circle ước tính lãi suất thấp hơn 1 điểm phần trăm sẽ làm thu nhập từ dự trữ giảm khoảng 441 triệu USD/năm. Trong quý 3/2026, lợi suất giảm 0,61 điểm đã khiến thu nhập từ dự trữ giảm 8%.",
        ],
      },
    ],
  },
  {
    label: "4 · Từ start-up lên Phố Wall (2013–2025)",
    title: "4 · Từ một start-up thanh toán tới Sàn chứng khoán New York",
    question: "Ai tạo ra USDC, và để làm gì?",
    figure: "Một dòng thời gian: Circle thành lập năm 2013, USDC ra mắt 26/9/2018, Circle niêm yết trên NYSE ngày 5/6/2025. Khoản chuyển khoản ngân hàng của Sarah bò chậm tới Hà trong khi USDC lướt qua; Circle và Coinbase dưới liên minh Centre, 2018–2023; đường nguồn cung ban đầu nằm dưới 1 tỷ USD tới giữa 2020 rồi vọt lên khoảng 4 tỷ vào đầu 2021.",
    takeaway: "USDC do Circle tạo ra cùng Coinbase, như một đồng đô la số có quản lý mà kế toán kiểm tra được. Ban đầu tăng chậm, bùng nổ cùng DeFi năm 2020, và Circle lên sàn chứng khoán năm 2025.",
    beats: [
      {
        title: "2013: một start-up thanh toán. 2018: một đồng đô la số.",
        body: [
          "Circle được Jeremy Allaire và Sean Neville thành lập năm 2013. Ngày 26/9/2018, cùng sàn Coinbase, Circle ra mắt USDC trên Ethereum — token đô la có tiền mặt bảo chứng và được kế toán rà soát hằng tháng.",
        ], insight: "USDC ra đời sau Tether bốn năm, từ điểm xuất phát ngược lại: được thiết kế ngay từ đầu để sống trong khuôn khổ luật Mỹ.",
      },
      {
        title: "Cần token để làm gì? Để nhanh.",
        body: [
          "Một khoản chuyển khoản từ Sarah ở Úc tới Hà ở Việt Nam có thể mất vài ngày, đi qua nhiều ngân hàng, mỗi nơi lấy một khoản phí. USDC đi từ ví này sang ví kia trong vài phút, bất kể giờ nào, ngày nào.",
        ],
      },
      {
        title: "Circle + Coinbase = Centre.",
        body: [
          "Ban đầu USDC do Centre — liên minh do Circle và Coinbase lập ra — điều hành. Tháng 8/2023 hai bên giải thể Centre: Circle nắm toàn quyền USDC, còn Coinbase nhận cổ phần trong Circle và vẫn giữ một phần tiền lãi.",
        ], insight: "Thoả thuận năm 2023 đó là lý do Coinbase vẫn hưởng phần lớn như vậy trong tiền lãi của USDC (chương 3).",
      },
      {
        title: "Khởi đầu chậm, cú nhảy vọt — và Phố Wall.",
        body: [
          "Gần hai năm đầu USDC ở dưới 1 tỷ USD. Rồi cú sập tháng 3/2020 và \"mùa hè DeFi\" — các ứng dụng trên Ethereum cho vay và giao dịch không cần ngân hàng — đẩy nó lên khoảng 4 tỷ USD vào ngày 1/1/2021.",
          "Ngày 5/6/2025 Circle niêm yết cổ phiếu trên Sàn chứng khoán New York: giá chào bán 31 USD, kết thúc phiên đầu ở 83,23 USD.",
        ], insight: "Mức tăng 168% trong ngày đầu là lớn nhất với một thương vụ IPO tỷ đô ở Mỹ trong hơn 30 năm dữ liệu của Renaissance Capital.",
      },
    ],
  },
  {
    label: "5 · Cuối tuần bị kẹt (3/2023)",
    title: "5 · Khi ngân hàng giữ tiền mặt sụp đổ",
    question: "Chuyện gì xảy ra nếu ngân hàng giữ số đô la bị phá sản?",
    figure: "Ngân hàng Silicon Valley Bank chìm dưới mặt nước với 3,3 tỷ USD dự trữ của USDC bên trong; USDC rớt xuống khoảng 0,87 USD ngày 11/3/2023 rồi về lại 1 USD; thanh nguồn cung co lại từ khoảng 43 tỷ xuống khoảng 32,5 tỷ USD; hai bể nước: SVB sụp đổ, USDC vẫn trả đủ 1 USD.",
    takeaway: "Tháng 3/2023 khoảng 8% dự trữ của USDC bị kẹt ở một ngân hàng phá sản. Giá rơi xuống 0,87 USD trong một dịp cuối tuần và hồi lại khi chính phủ Mỹ bảo lãnh tiền gửi của ngân hàng đó. Sau đó Circle chuyển tiền mặt sang các ngân hàng lớn nhất.",
    beats: [
      {
        title: "Thứ Sáu, 10/3/2023: Silicon Valley Bank sụp đổ.",
        body: [
          "SVB, một ngân hàng lớn ở California, phá sản sau làn sóng rút tiền của người gửi. Tối muộn hôm đó Circle cho biết 3,3 tỷ trong khoảng 40 tỷ USD dự trữ vẫn còn kẹt bên trong — các lệnh chuyển tiền ra đã không kịp thực hiện.",
        ],
      },
      {
        title: "Thứ Bảy: USDC rơi xuống 0,87 USD.",
        body: [
          "Ngân hàng đóng cửa cuối tuần nên Circle không thể trả tiền cho ai. Người muốn rời đi phải bán trên sàn, và giá rơi xuống khoảng 0,87 USD — thấp nhất trong lịch sử USDC.",
        ], insight: "Thị trường tính nhẩm rất nhanh: khoảng 8% dự trữ bị kẹt, và giá rơi xuống gần đúng chừng đó — có lúc còn sâu hơn.",
      },
      {
        title: "Thứ Hai: cửa mở lại.",
        body: [
          "Chủ nhật, nhà chức trách Mỹ tuyên bố toàn bộ tiền gửi ở SVB sẽ được bảo vệ. Khi ngân hàng mở cửa sáng thứ Hai, Circle đổi tiền trở lại: từ 13 tới 15/3 họ trả ra 3,8 tỷ USD và tạo mới 0,8 tỷ USDC. Giá về lại 1 USD.",
          "Nhưng niềm tin đã bị sứt mẻ: trong vài tuần, khoảng 10 tỷ USDC bị đổi ra và không quay lại.",
        ],
      },
      {
        title: "Một ngân hàng chết; USDC thì không.",
        body: [
          "SVB mất khoảng một phần tư tiền gửi chỉ trong một ngày và sụp đổ. USDC mất khoảng một phần tư nguồn cung trong mấy tuần sau đó — nhưng vẫn trả đủ 1 USD cho mỗi token được trả lại.",
        ], insight: "Bài học của Circle: từ đó họ để phần lớn chiếc két trong một quỹ của BlackRock chỉ giữ nợ chính phủ Mỹ, và để tiền mặt ở những ngân hàng lớn nhất. Nhưng cú giải cứu năm 2023 đến từ chính phủ Mỹ, không phải từ Circle.",
      },
    ],
  },
  {
    label: "6 · Giảm một nửa, rồi quay lại (2022–2026)",
    title: "6 · Co lại một nửa — rồi trở lại",
    question: "USDC giờ lớn cỡ nào, và nằm ở đâu?",
    figure: "Đường nguồn cung USDC từ 2018 tới 2026, vẽ qua các mốc có ghi ngày: đỉnh khoảng 56 tỷ USD tháng 6/2022, đáy 23,8 tỷ tháng 1/2024, 75,3 tỷ cuối 2025 và khoảng 67,9 tỷ tháng 11/2026. Bên dưới: USDC nằm trên các blockchain nào; ổ khoá so sánh số địa chỉ bị đóng băng, USDC 372 so với USDT 7.268; trụ sở Circle ở New York.",
    takeaway: "USDC co lại hơn một nửa từ 2022 tới 2024, rồi tăng gấp ba. Nó có mặt trên 38 blockchain, chủ yếu là Ethereum, và — giống USDT — có thể bị đóng băng, dù ít hơn nhiều.",
    beats: [
      {
        title: "Lên tới 56 tỷ — rồi xuống còn 24 tỷ.",
        body: [
          "USDC đạt đỉnh khoảng 56 tỷ USD vào tháng 6/2022. Cú sập của thị trường crypto, dịp cuối tuần SVB và sự cạnh tranh của USDT sau đó khiến nó co lại còn khoảng 23,8 tỷ vào đầu 2024.",
        ],
        notes: ["Đường biểu đồ nối các con số có ghi ngày từ Circle và báo chí bằng đường thẳng; đây không phải chuỗi số liệu hằng ngày."],
      },
      {
        title: "Sự trở lại.",
        body: [
          "Khi luật chơi ở châu Âu và Mỹ rõ ràng hơn, USDC tăng trở lại: khoảng 44 tỷ USD đầu 2025 và 75,3 tỷ vào cuối năm. Cuối 2026 nó giảm bớt, còn khoảng 67,9 tỷ vào giữa tháng 11.",
        ], insight: "Riêng năm 2025 USDC tăng 72% — nhanh hơn USDT. Dù vậy, USDT vẫn lớn hơn nó hơn hai lần rưỡi.",
      },
      {
        title: "Một đồng coin, 38 blockchain.",
        body: [
          "Circle phát hành USDC trực tiếp trên 38 blockchain (9/2026). Khoảng 60% nằm trên Ethereum; tiếp theo là Hyperliquid và Base.",
          "Để chuyển USDC giữa các chain, Circle đốt nó ở chain này và tạo mới ở chain kia — hệ thống gọi là CCTP. Riêng quý 4/2025 đã có hơn 41 tỷ USD đi qua đường này.",
        ],
      },
      {
        title: "Giống USDT, nó có thể bị đóng băng.",
        body: [
          "Circle có thể khoá bất kỳ địa chỉ nào, và làm vậy theo lệnh toà, lệnh trừng phạt và yêu cầu của cơ quan quản lý. Từ 2023 tới 2025, họ đưa vào danh sách đen khoảng 372 địa chỉ giữ 109 triệu USD. Tether đưa vào danh sách đen khoảng 7.268 địa chỉ giữ 3,29 tỷ USD.",
        ], insight: "Circle đóng băng ít hơn Tether khoảng 30 lần — nhưng việc đóng băng vẫn có thể trúng doanh nghiệp: tháng 3/2026 Circle cùng lúc khoá 16 ví doanh nghiệp trong một vụ kiện dân sự.",
      },
      {
        title: "Một công ty đại chúng ở New York.",
        body: [
          "Circle niêm yết trên Sàn chứng khoán New York (mã CRCL) và nộp báo cáo tài chính năm đã kiểm toán cùng báo cáo quý cho cơ quan chứng khoán Mỹ. Ai cũng đọc được họ kiếm bao nhiêu, trả Coinbase bao nhiêu và trong két có gì.",
        ],
      },
    ],
  },
  {
    label: "7 · Luật chơi mới",
    title: "7 · Lợi thế của người tuân thủ luật",
    question: "USDC có được phép ở Mỹ và châu Âu không?",
    figure: "Đạo luật GENIUS của Mỹ đòi hỏi giấy phép, dự trữ an toàn đầy đủ và báo cáo định kỳ; Circle được cấp giấy phép ngân hàng tín thác liên bang. Kệ MiCA của châu Âu giữ lại USDC trong khi USDT trượt xuống. Kim đồng hồ của S&P chỉ số 2, \"mạnh\"; USDT ở mức 5.",
    takeaway: "USDC được xây để sống trong luật. Nó có giấy phép ở châu Âu, đi đúng hướng theo luật mới của Mỹ và nay có một ngân hàng tín thác chịu giám sát liên bang — lợi thế lớn nhất so với USDT.",
    beats: [
      {
        title: "Mỹ: Đạo luật GENIUS — và một giấy phép ngân hàng.",
        body: [
          "Ngày 18/7/2025 Mỹ ký đạo luật liên bang đầu tiên về stablecoin: bên phát hành phục vụ người Mỹ phải có giấy phép, dự trữ đầy đủ bằng tài sản an toàn và báo cáo định kỳ — gần với cách USDC vốn đã vận hành.",
          "Circle còn xin mở một ngân hàng tín thác quốc gia. Cơ quan quản lý ngân hàng Mỹ (OCC) chấp thuận có điều kiện vào tháng 12/2025 và chấp thuận chính thức ngày 10/7/2026: Circle National Trust, chịu giám sát trực tiếp của liên bang.",
        ], insight: "Ngân hàng tín thác này bắt đầu bằng việc lưu ký tài sản số; kế hoạch là sau đó nó sẽ quản lý quỹ dự trữ của USDC — đưa chiếc két về dưới sự giám sát của một cơ quan ngân hàng liên bang.",
      },
      {
        title: "Châu Âu: người đầu tiên bước qua cửa.",
        body: [
          "Luật MiCA của EU chỉ cho phép stablecoin có giấy phép trên các sàn được quản lý. Ngày 1/7/2024 Circle trở thành bên phát hành stablecoin toàn cầu đầu tiên tuân thủ, nhờ giấy phép tiền điện tử ở Pháp. Tether không xin phép, và USDT bị gỡ khỏi các sàn cho người dùng châu Âu.",
        ],
      },
      {
        title: "Điểm \"mạnh\".",
        body: [
          "Hãng xếp hạng S&P chấm khả năng giữ giá 1 USD của stablecoin từ 1 (rất mạnh) tới 5 (yếu). Tháng 12/2025 S&P giữ USDC ở mức 2, \"mạnh\": riêng tài sản dự trữ được điểm 1, cao nhất, nhưng vẫn chưa có tiền lệ chứng minh người giữ sẽ được bảo vệ ra sao nếu chính Circle phá sản. USDT bị chấm 5.",
          "Bảng dưới đây so sánh USDC với hai người họ gần nhất.",
        ],
      },
    ],
  },
  {
    label: "Điểm mạnh",
    title: "USDC làm tốt điều gì",
    question: "Vì sao ngân hàng, ứng dụng và công ty thanh toán chọn nó?",
    figure: "Năm thẻ: chiếc két đơn giản nhất; được kiểm tra hằng tháng; nằm trong luật; nhanh và có mặt trên nhiều blockchain; vượt qua cuối tuần tồi tệ nhất.",
    beats: [
      { title: "1 · Chiếc két đơn giản nhất.", body: ["Chỉ có tiền mặt, cho vay qua đêm có trái phiếu Kho bạc thế chấp và tín phiếu Kho bạc — không vàng, không bitcoin, không cho doanh nghiệp vay. S&P chấm tài sản dự trữ điểm cao nhất: 1, \"rất mạnh\"."] },
      { title: "2 · Được kiểm tra hằng tháng.", body: ["Circle công bố chiếc két mỗi tuần, một hãng Big Four kiểm tra mỗi tháng, và là công ty niêm yết nên Circle nộp báo cáo tài chính đã kiểm toán cho cơ quan chứng khoán Mỹ."] },
      { title: "3 · Nằm trong luật.", body: ["Có giấy phép theo MiCA của châu Âu từ tháng 7/2024, được xây cho Đạo luật GENIUS của Mỹ, và có ngân hàng tín thác chịu giám sát liên bang được duyệt tháng 7/2026."] },
      { title: "4 · Nhanh và ở khắp nơi.", body: ["Phát hành trực tiếp trên 38 blockchain và chuyển giữa chúng bằng cách đốt rồi tạo mới — riêng quý 4/2025 đã hơn 41 tỷ USD."] },
      { title: "5 · Vượt qua cuối tuần tồi tệ nhất.", body: ["Tháng 3/2023, với 3,3 tỷ USD kẹt ở một ngân hàng phá sản, Circle vẫn trả ra 3,8 tỷ USD trong ba ngày khi ngân hàng mở cửa trở lại — và mọi token về lại 1 USD."] },
    ],
  },
  {
    label: "Điểm yếu",
    title: "Điều gì có thể trục trặc",
    question: "Giữ USDC thì đi kèm những rủi ro nào?",
    figure: "Năm thẻ cảnh báo: phụ thuộc ngân hàng; một công ty có thể đóng băng; người giữ không có lãi; thu nhập gắn với lãi suất Mỹ; nhỏ hơn và lên xuống theo crypto.",
    beats: [
      { title: "1 · Phụ thuộc vào ngân hàng.", body: ["Cuối tuần năm 2023 đã chứng minh: khi một ngân hàng sụp, USDC rơi xuống 0,87 USD. Tiền gửi ngân hàng — khoảng 12% chiếc két hiện nay — chỉ an toàn bằng các ngân hàng giữ nó, và việc đổi tiền phải chờ ngân hàng mở cửa."] },
      { title: "2 · Một công ty có thể đóng băng.", body: ["Circle khoá địa chỉ theo lệnh toà và lệnh trừng phạt. Họ làm vậy ít hơn Tether rất nhiều, nhưng USDC nào cũng vẫn có thể bị đóng băng."] },
      { title: "3 · Không lãi, không bảo hiểm.", body: ["Người giữ không nhận gì từ Circle, trong khi Circle giữ tiền lãi và chia phần lớn cho Coinbase cùng các đối tác. Và USDC không phải tiền gửi ngân hàng: không có bảo hiểm tiền gửi."] },
      { title: "4 · Gắn với lãi suất Mỹ.", body: ["Gần như toàn bộ thu nhập của Circle là tiền lãi. Mỗi lần lãi suất Mỹ giảm 1 điểm, Circle mất khoảng 441 triệu USD/năm — áp lực tăng dần khi lãi suất đi xuống."] },
      { title: "5 · Nhỏ hơn, và lên xuống theo crypto.", body: ["USDC từng giảm từ khoảng 56 tỷ USD (2022) xuống 23,8 tỷ (2024) rồi mới hồi phục. USDT vẫn lớn hơn hơn hai lần rưỡi và áp đảo trong giao dịch."] },
    ],
  },
  {
    label: "Kết luận",
    title: "Kết luận",
    question: "Vậy Hà có nên nhận USDC không?",
    figure: "Điện thoại của Hà hiện 1.000 USDC ≈ 1.000 USD; sau đó đồng USDC ráp lại và có thể xoay.",
    beats: [
      {
        title: "USDC làm tốt một việc: một đồng đô la mà bạn kiểm tra được.",
        body: ["Nó giữ quanh 1 USD suốt tám năm, trừ một dịp cuối tuần; giữ một chiếc két đơn giản gồm tiền mặt và nợ chính phủ Mỹ; được kiểm tra hằng tháng và chịu quản lý ở Mỹ lẫn châu Âu."],
      },
      {
        title: "Nhưng nó vẫn là lời hứa của một công ty — và của các ngân hàng phía sau.",
        body: ["Circle đặt luật, có thể khoá địa chỉ, giữ tiền lãi và phụ thuộc vào hệ thống ngân hàng. Được quản lý làm giảm các rủi ro đó; không xoá được chúng."], insight: "Chọn giữa USDC và USDT là một phép đánh đổi: USDC cho nhiều luật lệ và minh bạch hơn; USDT cho quy mô và độ phủ lớn hơn. Không bên nào trả lãi cho người giữ hay bảo hiểm tiền của họ.",
      },
      {
        title: "Với Hà: một công cụ, không phải sổ tiết kiệm.",
        body: [
          "Để nhận tiền của Sarah trong vài phút, USDC rất tiện. Nhưng để tiêu, Hà vẫn phải đổi sang tiền đồng — và tính tới tháng 11/2026, Việt Nam chưa có sàn crypto nào được cấp phép. Vì vậy hãy đổi sớm, dùng nền tảng uy tín và đừng để số tiền lớn trên một sàn. Đây là nội dung giáo dục, không phải lời khuyên đầu tư.",
          "Kéo để lật đồng coin.",
        ],
      },
    ],
  },
];
