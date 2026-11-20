/** Story copy for the LINK (Chainlink) explainer, English and Vietnamese.
 * Told as a metro journey: every chapter is a station. Narrator: Khoa, a developer in
 * Saigon building a small lending app (fictional). Dated figures; sources in references.ts. */
export type Beat = { title: string; body: string[]; insight?: string };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "The blind blockchain",
    title: "A blockchain cannot see the world",
    question: "How does a smart contract know what ETH costs right now?",
    figure: "A blockchain drawn as a closed box with its eyes shut; outside are prices, weather, sports scores and banks; a messenger — the oracle — carries one number in.",
    takeaway: "Blockchains only know what is written on them. An oracle carries outside facts in; Chainlink is the largest network of such messengers.",
    beats: [
      {
        title: "Meet Khoa.",
        body: [
          "Khoa writes a small lending app in Saigon: you lock ETH in it and borrow dollars. To know how much to lend, the app must know the price of ETH — right now, not yesterday.",
        ],
      },
      {
        title: "A blockchain can't look outside.",
        body: [
          "A smart contract only sees what is already on its own chain. It cannot open a website, read an exchange or call a bank. Someone has to bring the price in. That messenger is called an oracle.",
        ],
      },
      {
        title: "If the messenger lies, everyone pays.",
        body: [
          "One wrong price lets someone borrow far too much — or wipes out honest borrowers. Chainlink is a network of many independent messengers built so that no single one can lie or switch off the feed.",
        ],
        insight: "Chainlink says its oracles had enabled more than $36 trillion of transaction value by the third quarter of 2026.",
      },
    ],
  },
  {
    label: "Price feeds",
    title: "How one price is made",
    question: "Where does the number in Khoa's app come from?",
    figure: "Data sources on the left, a ring of independent node operators in the middle, a median bar, and one price written on the blockchain; a clock and a 0.5% band show when it updates.",
    takeaway: "Many sources, many independent nodes, the middle value wins, and the price is refreshed when it moves 0.5% or every hour.",
    beats: [
      {
        title: "Step 1: ask many sources.",
        body: ["Exchanges and data companies all quote ETH at slightly different prices. Chainlink does not trust any single one of them."],
      },
      {
        title: "Step 2: many nodes, take the middle.",
        body: [
          "Many independent node operators each fetch the price. The network takes the median — the middle value — so one broken or dishonest node at the edge cannot drag the result.",
        ],
      },
      {
        title: "Step 3: update only when it matters.",
        body: [
          "Writing to Ethereum costs fees, so the ETH/USD feed updates when the price moves 0.5% — or after one hour, whichever comes first.",
        ],
      },
      {
        title: "Step 4: Khoa's app reads one number.",
        body: ["The app never talks to an exchange. It reads one on-chain number that hundreds of other apps read too."],
        insight: "By DefiLlama's count, Chainlink secures about $31 billion across 543 protocols — far more than any other oracle.",
      },
    ],
  },
  {
    label: "The LINK token",
    title: "What LINK is for",
    question: "If the service is the network, what does the token do?",
    figure: "A 10×10 grid standing for 1 billion LINK: the 2017 sale, node operators and ecosystem, the company; then the staking pool, the Chainlink Reserve and the supply still waiting to be released.",
    takeaway: "LINK pays the node operators and backs them with a deposit. Usage revenue now buys LINK for a reserve, but the company still releases far more LINK than the reserve buys.",
    beats: [
      {
        title: "1 billion LINK, fixed.",
        body: [
          "All 1 billion LINK were created in 2017. 35% were sold in the token sale (about $32 million), 35% set aside for node operators and the ecosystem, and 30% kept by the company.",
        ],
      },
      {
        title: "Staking is a deposit, not a savings account.",
        body: [
          "Node operators lock LINK as a guarantee. If a feed fails and isn't fixed in time, their stake can be cut (\"slashed\"). The pool holds up to 45 million LINK; the 40.875 million community share filled in about six hours in December 2023.",
        ],
      },
      {
        title: "Usage now buys LINK.",
        body: [
          "Since August 2025 the Chainlink Reserve turns fees from its services into LINK and holds them. By 13 November 2026 it held about 6.68 million LINK, worth roughly $75 million.",
        ],
      },
      {
        title: "But the company keeps releasing LINK.",
        body: [
          "Every quarter about 19 million LINK leave the company's \"non-circulating\" wallets, most of it sent to Binance. Around 748–767 million LINK now circulate.",
        ],
        insight: "The reserve bought about 447,000 LINK in the 30 days to 5 November 2026. A quarterly unlock of ~19 million is about 6 million a month — roughly 14 times as much.",
      },
    ],
  },
  {
    label: "Cross-chain (CCIP)",
    title: "Bridges between blockchains",
    question: "How do tokens move from one chain to another without being stolen?",
    figure: "Blockchains as islands; broken bridges labelled with the money stolen; then the CCIP bridge with a separate checkpoint, and volume bars after CCIP 2.0.",
    takeaway: "Bridges were crypto's weakest point. CCIP adds a separate checking network, and more projects moved to it after each hack.",
    beats: [
      {
        title: "Bridges were the weakest point.",
        body: [
          "Each blockchain is an island. Bridges carry tokens between them — and became the favourite target of hackers: Ronin lost $624 million, Wormhole $325 million, Nomad $190 million, all in 2022.",
        ],
        insight: "Chainalysis counted that 64% of all money stolen in DeFi hacks in 2022 came from bridges.",
      },
      {
        title: "CCIP: a bridge with a second guard.",
        body: [
          "Chainlink's Cross-Chain Interoperability Protocol went live on 17 July 2023. Tokens are locked or burned on one chain and released or minted on the other, with an extra independent network checking each transfer. It now links more than 60 blockchains.",
        ],
      },
      {
        title: "Hacks elsewhere sent traffic here.",
        body: [
          "After a $292 million exploit at KelpDAO, projects holding more than $3 billion moved to CCIP. CCIP 2.0 launched on 28 September 2026, after more than $84 billion of transfers.",
        ],
      },
    ],
  },
  {
    label: "Banks on board",
    title: "Banks get on the train",
    question: "Why do Swift, JPMorgan and UBS work with a crypto project?",
    figure: "A platform where carriages labelled Swift, J.P. Morgan, UBS, DTCC and others board one by one.",
    takeaway: "Big financial players use Chainlink to connect their systems to blockchains. Many projects are still tests or pilots, not daily business.",
    beats: [
      {
        title: "Swift: the bank messaging network.",
        body: [
          "Swift links more than 11,500 financial institutions. Its new blockchain ledger, announced in 2025, connects banks through Chainlink's software; 17 banks are piloting it.",
        ],
      },
      {
        title: "J.P. Morgan: a test across two chains.",
        body: [
          "In May 2025 J.P. Morgan's Kinexys, Ondo Finance and Chainlink settled a tokenised Treasury fund against payment across a private and a public chain — on a test network.",
        ],
      },
      {
        title: "UBS: a real transaction.",
        body: [
          "On 4 November 2025 UBS completed a live subscription and redemption of its tokenised money-market fund (uMINT) using Chainlink's Digital Transfer Agent standard.",
        ],
      },
      {
        title: "Many names — read the fine print.",
        body: [
          "DTCC, Euroclear, SIX, Deutsche Börse, ANZ, Fidelity International and Mastercard also appear on Chainlink's partner list.",
        ],
        insight: "Several of these are pilots, tests or demos. A big name on a slide is not the same as daily volume flowing through the network.",
      },
    ],
  },
  {
    label: "2017–2021",
    title: "From a $32 million sale to $52",
    question: "How did LINK get here?",
    figure: "A price line on a timeline: the 2017 sale at about $0.09, mainnet in 2019, the 2020 DeFi rally to $20, and the all-time high of $52.88 in May 2021.",
    takeaway: "Two quiet years, then DeFi made price feeds essential and LINK rose more than 500 times from its sale price.",
    beats: [
      {
        title: "2017: whitepaper and token sale.",
        body: [
          "Sergey Nazarov and Steve Ellis, with Ari Juels, published the Chainlink whitepaper in September 2017 and raised $32 million selling 350 million LINK at roughly 9–11 cents.",
        ],
      },
      {
        title: "2019: the network goes live.",
        body: [
          "Chainlink launched on Ethereum mainnet in 2019. For nearly two years after the sale, LINK never traded above $1.30.",
        ],
      },
      {
        title: "2020: DeFi summer.",
        body: [
          "Lending and trading apps on Ethereum boomed and all needed prices. LINK went from about $4–5 to $20.30 in August 2020 — while an anonymous \"Zeus Capital\" called it a scam headed for 7 cents.",
        ],
        insight: "Fans who refused to sell called themselves \"LINK Marines\". A $20 million short on Aave was liquidated during the rally.",
      },
      {
        title: "10 May 2021: the top.",
        body: ["LINK hit its all-time high of $52.88 — about 580 times the average sale price of 2017."],
      },
    ],
  },
  {
    label: "LUNA, 2022",
    title: "When a price got stuck",
    question: "What happens when reality falls through the floor?",
    figure: "LUNA's real price crashing to $0.01 while the oracle line stays flat at $0.107; the gap is drained by attackers.",
    takeaway: "A safety floor in the LUNA feed kept reporting $0.107 while LUNA fell to $0.01. Apps that didn't check lost millions.",
    beats: [
      {
        title: "May 2022: LUNA collapses.",
        body: [
          "The Terra token LUNA fell more than 99% in days. Chainlink's LUNA feed had a built-in minimum of about $0.10 — a circuit breaker. LUNA went below it.",
        ],
      },
      {
        title: "Stuck at $0.107, real price $0.01.",
        body: [
          "On Venus, attackers deposited 230 million LUNA worth about $2.3 million — valued by the stuck feed at ten times more — and borrowed about $13.5 million. Venus lost about $11.2 million; Blizz Finance was drained.",
        ],
      },
      {
        title: "Who was to blame?",
        body: [
          "Chainlink said the minimum was a documented safety setting; critics said it should have reacted. The lesson for apps like Khoa's: an oracle is one piece — check its answers and have a pause button.",
        ],
        insight: "2022 also brought bridge hacks and a bear market. Chainlink started staking in December 2022.",
      },
    ],
  },
  {
    label: "LINK today",
    title: "LINK in 2026",
    question: "Usage keeps growing. Why doesn't the price?",
    figure: "Departure-board tiles: price, market value, supply, ETF holdings; reserve bars rising from 1 million to 6.68 million LINK; a gap between usage and price.",
    takeaway: "The network is busier than ever; the token trades far below its 2021 top. Usage and price are not tied tightly.",
    beats: [
      {
        title: "About $9, far from the top.",
        body: [
          "LINK closed at $8.85 on 15 November 2026 — about 84% below its 2021 high and 42.5% below its September 2026 peak of $15.44. Its market value is around $7 billion.",
        ],
      },
      {
        title: "Wall Street can buy it.",
        body: [
          "Grayscale's GLNK became the first US spot Chainlink ETF on 2 December 2025; CME launched LINK futures in February 2026. US spot LINK ETFs held about $175–190 million in November 2026 — around 2% of LINK's value.",
        ],
      },
      {
        title: "The reserve keeps growing.",
        body: ["About 1 million LINK in December 2025, 3.06 million at the end of March 2026, 6.05 million in September and 6.68 million on 13 November 2026."],
      },
      {
        title: "Rivals are catching up in places.",
        body: [
          "Pyth and RedStone serve fast trading apps; RedStone has over 99% of the oracle market on Hyperliquid's EVM. Chainlink's share is estimated anywhere from about 60% to 84%, depending on who counts and how.",
        ],
      },
      {
        title: "Busy network, weak token.",
        body: [
          "Apps can pay Chainlink in other tokens, which are converted to LINK only for the reserve. So more usage does not automatically mean more buyers of LINK.",
        ],
        insight: "Even so, the reserve's buying is real money from real customers — something most tokens can't show.",
      },
    ],
  },
  {
    label: "Strengths",
    title: "What Chainlink does well",
    question: "Why is it the default choice?",
    figure: "Five station cards with big numbers: years of track record, many independent nodes, bank partners, safer bridges, revenue into the reserve.",
    beats: [
      { title: "1 · The default since 2019.", body: ["Most large DeFi lending apps, including Aave, use Chainlink prices. Being the standard is hard to take away."] },
      { title: "2 · No single point to bribe.", body: ["Many independent nodes, a median, and staked LINK that can be slashed make one bad actor much less dangerous."] },
      { title: "3 · Trusted by finance's plumbing.", body: ["Swift, DTCC, UBS and J.P. Morgan's Kinexys build with it — no other oracle has that list."] },
      { title: "4 · Safer bridges.", body: ["CCIP's separate checking network attracted more than $3 billion after other bridges were hacked."] },
      { title: "5 · Revenue that buys LINK.", body: ["The reserve turns real fees into LINK: 6.68 million LINK so far."] },
    ],
  },
  {
    label: "Weaknesses",
    title: "What can go wrong",
    question: "What should a LINK holder watch?",
    figure: "Five warning cards: weak link between usage and price, steady unlocks, dependence on one company, faster rivals, the LUNA lesson.",
    beats: [
      { title: "1 · Usage ≠ price.", body: ["Fees can be paid in other tokens, and LINK is down about 84% from its high while usage grew."] },
      { title: "2 · Steady selling from the company.", body: ["About 19 million LINK are released every quarter, mostly to Binance — roughly 14 times what the reserve buys."] },
      { title: "3 · One company steers.", body: ["Chainlink Labs designs the products, signs the bank deals and still controls a large part of the supply."] },
      { title: "4 · Faster rivals.", body: ["Pyth and RedStone win fast-trading and newer chains; RedStone dominates Hyperliquid's EVM."] },
      { title: "5 · Oracles can be wrong.", body: ["The LUNA feed stuck at $0.107 in 2022 cost Venus about $11 million. No oracle removes all risk."] },
    ],
  },
  {
    label: "Conclusion",
    title: "Conclusion",
    question: "So what is LINK, in one sentence?",
    figure: "The whole metro map lit up: every station of the journey, with the train at the last stop.",
    beats: [
      {
        title: "Chainlink is the metro system of on-chain data.",
        body: ["Prices, bridges and bank connections run on its tracks. It is widely used, battle-tested and hard to replace."],
      },
      {
        title: "But the network is not the token.",
        body: [
          "A busy network does not guarantee a rising LINK price: unlocks, other payment tokens and rivals all matter.",
        ],
        insight: "Watch three numbers: the quarterly unlocks, the reserve's buying, and how much of Chainlink's revenue is actually paid in LINK.",
      },
      {
        title: "For Khoa — and for you.",
        body: [
          "Khoa will use Chainlink's feed, with his own safety checks. If you buy LINK, know you are betting on the token, not only on the network. As of November 2026 Vietnam has no licensed crypto exchange yet. This is education, not investment advice.",
        ],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Blockchain bị bịt mắt",
    title: "Blockchain không nhìn thấy thế giới bên ngoài",
    question: "Làm sao một hợp đồng thông minh biết giá ETH ngay lúc này?",
    figure: "Blockchain vẽ như một chiếc hộp nhắm mắt; bên ngoài là giá cả, thời tiết, tỷ số bóng đá, ngân hàng; một người đưa tin — oracle — mang một con số vào.",
    takeaway: "Blockchain chỉ biết những gì đã ghi trên nó. Oracle mang thông tin bên ngoài vào; Chainlink là mạng lưới người đưa tin lớn nhất.",
    beats: [
      {
        title: "Làm quen với Khoa.",
        body: [
          "Khoa viết một ứng dụng cho vay nhỏ ở Sài Gòn: bạn khoá ETH vào và vay đô la. Để biết cho vay bao nhiêu, ứng dụng phải biết giá ETH — ngay bây giờ, không phải hôm qua.",
        ],
      },
      {
        title: "Blockchain không tự nhìn ra ngoài được.",
        body: [
          "Hợp đồng thông minh chỉ thấy những gì đã có trên chuỗi của nó. Nó không mở được trang web, không đọc được sàn, không gọi được ngân hàng. Phải có ai đó mang giá vào. Người đưa tin đó gọi là oracle.",
        ],
      },
      {
        title: "Người đưa tin nói sai, ai cũng thiệt.",
        body: [
          "Một con số sai có thể cho ai đó vay quá nhiều — hoặc thanh lý oan người vay tử tế. Chainlink là mạng gồm nhiều người đưa tin độc lập, xây sao cho không một ai có thể nói dối hay tắt nguồn tin một mình.",
        ],
        insight: "Chainlink cho biết oracle của họ đã hỗ trợ hơn 36 nghìn tỷ USD giá trị giao dịch tính tới quý III/2026.",
      },
    ],
  },
  {
    label: "Nguồn giá",
    title: "Một cái giá được làm ra thế nào",
    question: "Con số trong ứng dụng của Khoa từ đâu ra?",
    figure: "Các nguồn dữ liệu bên trái, một vòng các nhà vận hành node độc lập ở giữa, một thanh trung vị, và một mức giá được ghi lên blockchain; đồng hồ và dải 0,5% cho biết khi nào cập nhật.",
    takeaway: "Nhiều nguồn, nhiều node độc lập, lấy giá trị ở giữa, và giá được làm mới khi lệch 0,5% hoặc sau mỗi giờ.",
    beats: [
      {
        title: "Bước 1: hỏi nhiều nguồn.",
        body: ["Các sàn và công ty dữ liệu đều báo giá ETH hơi khác nhau. Chainlink không tin riêng một nguồn nào."],
      },
      {
        title: "Bước 2: nhiều node, lấy số ở giữa.",
        body: [
          "Nhiều nhà vận hành node độc lập cùng lấy giá. Mạng lấy trung vị — giá trị nằm giữa — nên một node hỏng hay gian lận ở rìa không kéo lệch được kết quả.",
        ],
      },
      {
        title: "Bước 3: chỉ cập nhật khi cần.",
        body: [
          "Ghi lên Ethereum tốn phí, nên nguồn giá ETH/USD cập nhật khi giá lệch 0,5% — hoặc sau một giờ, tuỳ điều kiện nào đến trước.",
        ],
      },
      {
        title: "Bước 4: ứng dụng của Khoa đọc một con số.",
        body: ["Ứng dụng không bao giờ nói chuyện với sàn. Nó đọc một con số trên chuỗi mà hàng trăm ứng dụng khác cũng đọc."],
        insight: "Theo DefiLlama, Chainlink bảo vệ khoảng 31 tỷ USD trên 543 giao thức — nhiều hơn hẳn mọi oracle khác.",
      },
    ],
  },
  {
    label: "Token LINK",
    title: "LINK dùng để làm gì",
    question: "Nếu dịch vụ là cả mạng lưới, thì token làm gì?",
    figure: "Lưới 10×10 tượng trưng cho 1 tỷ LINK: phần bán năm 2017, phần cho nhà vận hành node và hệ sinh thái, phần của công ty; sau đó là quỹ staking, Chainlink Reserve và phần cung còn chờ xả.",
    takeaway: "LINK trả công cho nhà vận hành node và làm tiền ký quỹ của họ. Doanh thu nay được dùng mua LINK cho quỹ dự trữ, nhưng công ty vẫn xả ra nhiều LINK hơn số quỹ mua vào.",
    beats: [
      {
        title: "1 tỷ LINK, cố định.",
        body: [
          "Toàn bộ 1 tỷ LINK được tạo năm 2017. 35% bán trong đợt mở bán (khoảng 32 triệu USD), 35% dành cho nhà vận hành node và hệ sinh thái, 30% công ty giữ.",
        ],
      },
      {
        title: "Staking là tiền ký quỹ, không phải sổ tiết kiệm.",
        body: [
          "Nhà vận hành node khoá LINK làm bảo đảm. Nếu nguồn giá hỏng mà không sửa kịp, phần khoá có thể bị cắt (\"slash\"). Quỹ chứa tối đa 45 triệu LINK; phần 40,875 triệu dành cho cộng đồng đã đầy trong khoảng sáu giờ vào tháng 12/2023.",
        ],
      },
      {
        title: "Lượng sử dụng giờ được dùng để mua LINK.",
        body: [
          "Từ tháng 8/2025, Chainlink Reserve đổi phí dịch vụ thành LINK và giữ lại. Đến ngày 13/11/2026 quỹ có khoảng 6,68 triệu LINK, trị giá chừng 75 triệu USD.",
        ],
      },
      {
        title: "Nhưng công ty vẫn đều đặn xả LINK.",
        body: [
          "Mỗi quý khoảng 19 triệu LINK rời các ví \"chưa lưu hành\" của công ty, phần lớn chuyển lên Binance. Hiện có khoảng 748–767 triệu LINK đang lưu hành.",
        ],
        insight: "Quỹ dự trữ mua khoảng 447.000 LINK trong 30 ngày tới 5/11/2026. Một đợt mở khoá ~19 triệu mỗi quý tương đương khoảng 6 triệu mỗi tháng — gấp chừng 14 lần.",
      },
    ],
  },
  {
    label: "Cầu nối chuỗi (CCIP)",
    title: "Cây cầu giữa các blockchain",
    question: "Làm sao chuyển token từ chuỗi này sang chuỗi khác mà không bị trộm?",
    figure: "Các blockchain là những hòn đảo; những cây cầu gãy ghi số tiền bị trộm; sau đó là cây cầu CCIP với một trạm kiểm tra riêng, và các cột khối lượng sau CCIP 2.0.",
    takeaway: "Cầu nối từng là điểm yếu nhất của crypto. CCIP thêm một mạng kiểm tra riêng, và sau mỗi vụ hack lại có thêm dự án chuyển sang.",
    beats: [
      {
        title: "Cầu nối là điểm yếu nhất.",
        body: [
          "Mỗi blockchain là một hòn đảo. Cầu nối chở token qua lại — và trở thành mục tiêu ưa thích của hacker: Ronin mất 624 triệu USD, Wormhole 325 triệu, Nomad 190 triệu, đều trong năm 2022.",
        ],
        insight: "Chainalysis thống kê 64% số tiền bị trộm trong các vụ hack DeFi năm 2022 đến từ cầu nối.",
      },
      {
        title: "CCIP: cây cầu có thêm người gác.",
        body: [
          "Giao thức liên chuỗi CCIP của Chainlink chạy thật từ 17/7/2023. Token bị khoá hoặc đốt ở chuỗi này rồi được mở hoặc tạo ở chuỗi kia, kèm một mạng độc lập kiểm tra từng lần chuyển. Hiện nó nối hơn 60 blockchain.",
        ],
      },
      {
        title: "Hack ở nơi khác, khách lại sang đây.",
        body: [
          "Sau vụ KelpDAO bị khai thác 292 triệu USD, các dự án giữ hơn 3 tỷ USD đã chuyển sang CCIP. CCIP 2.0 ra mắt ngày 28/9/2026, sau hơn 84 tỷ USD đã được chuyển qua.",
        ],
      },
    ],
  },
  {
    label: "Ngân hàng lên tàu",
    title: "Ngân hàng lên tàu",
    question: "Vì sao Swift, JPMorgan, UBS lại làm việc với một dự án crypto?",
    figure: "Một sân ga nơi các toa ghi Swift, J.P. Morgan, UBS, DTCC và các tên khác lần lượt lên tàu.",
    takeaway: "Các tổ chức tài chính lớn dùng Chainlink để nối hệ thống của họ với blockchain. Nhiều dự án vẫn là thử nghiệm, chưa phải hoạt động hằng ngày.",
    beats: [
      {
        title: "Swift: mạng nhắn tin giữa các ngân hàng.",
        body: [
          "Swift kết nối hơn 11.500 tổ chức tài chính. Sổ cái blockchain mới của Swift, công bố năm 2025, nối các ngân hàng qua phần mềm của Chainlink; 17 ngân hàng đang chạy thử.",
        ],
      },
      {
        title: "J.P. Morgan: một phép thử qua hai chuỗi.",
        body: [
          "Tháng 5/2025, Kinexys của J.P. Morgan, Ondo Finance và Chainlink đã tất toán một quỹ trái phiếu Kho bạc dạng token đổi lấy thanh toán, qua một chuỗi riêng và một chuỗi công khai — trên mạng thử nghiệm.",
        ],
      },
      {
        title: "UBS: một giao dịch thật.",
        body: [
          "Ngày 4/11/2025, UBS hoàn tất một lệnh mua và một lệnh rút thật với quỹ thị trường tiền tệ dạng token (uMINT), dùng chuẩn Digital Transfer Agent của Chainlink.",
        ],
      },
      {
        title: "Nhiều tên tuổi — nhớ đọc kỹ.",
        body: [
          "DTCC, Euroclear, SIX, Deutsche Börse, ANZ, Fidelity International và Mastercard cũng có trong danh sách đối tác của Chainlink.",
        ],
        insight: "Nhiều trong số này là thí điểm, thử nghiệm hoặc trình diễn. Một tên lớn trên slide khác với khối lượng chạy qua mạng mỗi ngày.",
      },
    ],
  },
  {
    label: "2017–2021",
    title: "Từ đợt bán 32 triệu USD tới 52 USD",
    question: "LINK đã đi tới đây như thế nào?",
    figure: "Đường giá trên dòng thời gian: đợt bán năm 2017 khoảng 0,09 USD, mạng chính năm 2019, đợt tăng DeFi năm 2020 lên 20 USD, và đỉnh 52,88 USD tháng 5/2021.",
    takeaway: "Hai năm im ắng, rồi DeFi khiến nguồn giá trở nên thiết yếu và LINK tăng hơn 500 lần so với giá bán ban đầu.",
    beats: [
      {
        title: "2017: sách trắng và đợt bán token.",
        body: [
          "Sergey Nazarov và Steve Ellis, cùng Ari Juels, công bố sách trắng Chainlink tháng 9/2017 và gọi được 32 triệu USD khi bán 350 triệu LINK với giá khoảng 9–11 cent.",
        ],
      },
      {
        title: "2019: mạng chạy thật.",
        body: ["Chainlink chạy trên mạng chính Ethereum năm 2019. Gần hai năm sau đợt bán, LINK chưa từng vượt 1,30 USD."],
      },
      {
        title: "2020: mùa hè DeFi.",
        body: [
          "Các ứng dụng cho vay và giao dịch trên Ethereum bùng nổ và đều cần giá. LINK đi từ khoảng 4–5 USD lên 20,30 USD vào tháng 8/2020 — trong khi một \"Zeus Capital\" ẩn danh gọi nó là lừa đảo, sẽ về 7 cent.",
        ],
        insight: "Những người nhất quyết không bán tự gọi mình là \"LINK Marines\". Một lệnh bán khống 20 triệu USD trên Aave đã bị thanh lý trong đợt tăng.",
      },
      {
        title: "10/5/2021: đỉnh cao nhất.",
        body: ["LINK chạm đỉnh lịch sử 52,88 USD — gấp khoảng 580 lần giá bán trung bình năm 2017."],
      },
    ],
  },
  {
    label: "LUNA, 2022",
    title: "Khi một mức giá bị kẹt",
    question: "Chuyện gì xảy ra khi thực tế rơi xuyên sàn?",
    figure: "Giá thật của LUNA lao xuống 0,01 USD trong khi đường oracle nằm ngang ở 0,107 USD; khoảng chênh bị kẻ tấn công rút sạch.",
    takeaway: "Mức sàn an toàn trong nguồn giá LUNA cứ báo 0,107 USD khi LUNA đã xuống 0,01 USD. Ứng dụng nào không tự kiểm tra thì mất hàng triệu USD.",
    beats: [
      {
        title: "Tháng 5/2022: LUNA sụp đổ.",
        body: [
          "Token LUNA của Terra mất hơn 99% trong vài ngày. Nguồn giá LUNA của Chainlink có sẵn một mức tối thiểu khoảng 0,10 USD — một cầu dao an toàn. LUNA rơi xuống dưới mức đó.",
        ],
      },
      {
        title: "Kẹt ở 0,107 USD, giá thật 0,01 USD.",
        body: [
          "Trên Venus, kẻ tấn công nạp 230 triệu LUNA trị giá khoảng 2,3 triệu USD — được nguồn giá kẹt định giá cao gấp mười — rồi vay khoảng 13,5 triệu USD. Venus mất khoảng 11,2 triệu USD; Blizz Finance bị rút cạn.",
        ],
      },
      {
        title: "Lỗi của ai?",
        body: [
          "Chainlink nói mức tối thiểu là thiết lập an toàn đã công bố; phía chỉ trích cho rằng họ phải phản ứng. Bài học cho những ứng dụng như của Khoa: oracle chỉ là một mắt xích — hãy tự kiểm tra con số và có nút tạm dừng.",
        ],
        insight: "Năm 2022 còn có các vụ hack cầu nối và thị trường giá xuống. Chainlink bắt đầu staking vào tháng 12/2022.",
      },
    ],
  },
  {
    label: "LINK hôm nay",
    title: "LINK năm 2026",
    question: "Lượng dùng cứ tăng. Sao giá không tăng?",
    figure: "Các ô bảng giờ tàu: giá, vốn hoá, nguồn cung, lượng ETF nắm giữ; cột quỹ dự trữ tăng từ 1 triệu lên 6,68 triệu LINK; khoảng cách giữa lượng dùng và giá.",
    takeaway: "Mạng lưới bận rộn hơn bao giờ hết; token thì giao dịch thấp xa đỉnh 2021. Lượng dùng và giá không gắn chặt với nhau.",
    beats: [
      {
        title: "Khoảng 9 USD, cách xa đỉnh.",
        body: [
          "LINK đóng cửa ở 8,85 USD ngày 15/11/2026 — thấp hơn đỉnh 2021 khoảng 84% và thấp hơn đỉnh tháng 9/2026 (15,44 USD) 42,5%. Vốn hoá khoảng 7 tỷ USD.",
        ],
      },
      {
        title: "Phố Wall đã mua được.",
        body: [
          "GLNK của Grayscale thành ETF Chainlink giao ngay đầu tiên ở Mỹ ngày 2/12/2025; CME ra hợp đồng tương lai LINK tháng 2/2026. Các ETF LINK giao ngay ở Mỹ nắm khoảng 175–190 triệu USD vào tháng 11/2026 — chừng 2% giá trị LINK.",
        ],
      },
      {
        title: "Quỹ dự trữ vẫn lớn dần.",
        body: ["Khoảng 1 triệu LINK tháng 12/2025, 3,06 triệu cuối tháng 3/2026, 6,05 triệu tháng 9 và 6,68 triệu ngày 13/11/2026."],
      },
      {
        title: "Đối thủ đang bắt kịp ở vài nơi.",
        body: [
          "Pyth và RedStone phục vụ các ứng dụng giao dịch tốc độ cao; RedStone chiếm hơn 99% thị phần oracle trên EVM của Hyperliquid. Thị phần của Chainlink được ước tính từ khoảng 60% tới 84%, tuỳ ai đếm và đếm thế nào.",
        ],
      },
      {
        title: "Mạng bận rộn, token yếu.",
        body: [
          "Ứng dụng có thể trả phí cho Chainlink bằng token khác, chỉ được đổi sang LINK cho quỹ dự trữ. Nên dùng nhiều hơn không tự động có nghĩa là thêm người mua LINK.",
        ],
        insight: "Dù vậy, tiền quỹ dự trữ bỏ ra mua là tiền thật từ khách hàng thật — điều mà phần lớn token không có.",
      },
    ],
  },
  {
    label: "Điểm mạnh",
    title: "Chainlink làm tốt điều gì",
    question: "Vì sao nó là lựa chọn mặc định?",
    figure: "Năm thẻ ga với những con số lớn: nhiều năm hoạt động, nhiều node độc lập, đối tác ngân hàng, cầu nối an toàn hơn, doanh thu vào quỹ dự trữ.",
    beats: [
      { title: "1 · Chuẩn mặc định từ 2019.", body: ["Phần lớn các ứng dụng cho vay DeFi lớn, trong đó có Aave, dùng giá của Chainlink. Đã là chuẩn thì khó bị thay."] },
      { title: "2 · Không có một điểm để mua chuộc.", body: ["Nhiều node độc lập, lấy trung vị, cộng LINK đặt cọc có thể bị cắt khiến một kẻ xấu đơn lẻ ít nguy hiểm hơn nhiều."] },
      { title: "3 · Được hạ tầng tài chính tin dùng.", body: ["Swift, DTCC, UBS và Kinexys của J.P. Morgan đều làm việc với nó — không oracle nào khác có danh sách như vậy."] },
      { title: "4 · Cầu nối an toàn hơn.", body: ["Mạng kiểm tra riêng của CCIP đã hút hơn 3 tỷ USD sau khi các cầu khác bị hack."] },
      { title: "5 · Doanh thu dùng để mua LINK.", body: ["Quỹ dự trữ biến phí thật thành LINK: tới nay 6,68 triệu LINK."] },
    ],
  },
  {
    label: "Điểm yếu",
    title: "Điều gì có thể trục trặc",
    question: "Người giữ LINK nên để ý gì?",
    figure: "Năm thẻ cảnh báo: lượng dùng ít gắn với giá, mở khoá đều đặn, phụ thuộc một công ty, đối thủ nhanh hơn, bài học LUNA.",
    beats: [
      { title: "1 · Lượng dùng ≠ giá.", body: ["Phí có thể trả bằng token khác, và LINK đã giảm khoảng 84% từ đỉnh trong khi lượng dùng tăng."] },
      { title: "2 · Công ty bán ra đều đặn.", body: ["Khoảng 19 triệu LINK được mở khoá mỗi quý, phần lớn lên Binance — gấp chừng 14 lần lượng quỹ dự trữ mua vào."] },
      { title: "3 · Một công ty cầm lái.", body: ["Chainlink Labs thiết kế sản phẩm, ký các hợp tác ngân hàng và vẫn nắm một phần lớn nguồn cung."] },
      { title: "4 · Đối thủ nhanh hơn.", body: ["Pyth và RedStone thắng ở mảng giao dịch tốc độ cao và các chuỗi mới; RedStone áp đảo trên EVM của Hyperliquid."] },
      { title: "5 · Oracle cũng có thể sai.", body: ["Nguồn giá LUNA kẹt ở 0,107 USD năm 2022 khiến Venus mất khoảng 11 triệu USD. Không oracle nào xoá hết rủi ro."] },
    ],
  },
  {
    label: "Kết luận",
    title: "Kết luận",
    question: "Vậy LINK là gì, trong một câu?",
    figure: "Toàn bộ sơ đồ tuyến sáng lên: mọi ga của hành trình, đoàn tàu ở ga cuối.",
    beats: [
      {
        title: "Chainlink là hệ thống tàu điện của dữ liệu trên chuỗi.",
        body: ["Giá cả, cầu nối và kết nối ngân hàng chạy trên đường ray của nó. Được dùng rộng rãi, đã qua thử lửa và khó thay thế."],
      },
      {
        title: "Nhưng mạng lưới không phải là token.",
        body: ["Mạng bận rộn không bảo đảm giá LINK tăng: mở khoá, token thanh toán khác và đối thủ đều có ảnh hưởng."],
        insight: "Hãy theo dõi ba con số: lượng mở khoá mỗi quý, lượng quỹ dự trữ mua vào, và bao nhiêu doanh thu của Chainlink thực sự được trả bằng LINK.",
      },
      {
        title: "Với Khoa — và với bạn.",
        body: [
          "Khoa sẽ dùng nguồn giá của Chainlink, kèm các bước tự kiểm tra. Nếu bạn mua LINK, hãy hiểu mình đang đặt cược vào token, không chỉ vào mạng lưới. Tính tới tháng 11/2026, Việt Nam chưa có sàn crypto nào được cấp phép. Đây là nội dung giáo dục, không phải lời khuyên đầu tư.",
        ],
      },
    ],
  },
];
