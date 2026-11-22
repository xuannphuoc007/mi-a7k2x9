/** "The Missing Link" — story copy, English and Vietnamese.
 * Narrator: Khoa, a developer in Saigon building a small lending app (fictional).
 * Dated figures; sources in references.ts. */
export type Beat = { title: string; body: string[]; insight?: string };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "The missing link",
    title: "Blockchains are sealed glass boxes",
    question: "A blockchain cannot see the world. So who carries the truth in — and why trust them?",
    figure: "Several glass blocks, each a blockchain, sealed and blind. Between them and the outside world there is a gap: the missing link.",
    beats: [
      {
        title: "Meet Khoa.",
        body: [
          "Khoa builds a small lending app in Saigon: lock ETH, borrow dollars. To know how much to lend, his app needs the price of ETH — right now.",
        ],
      },
      {
        title: "A blockchain is a sealed glass box.",
        body: [
          "Everything inside runs perfectly, but nothing inside can look out. A smart contract can't open a website, read an exchange or ask a bank. Prices, reserves, random numbers — all of it lives outside the glass.",
        ],
      },
      {
        title: "Someone has to carry facts in.",
        body: [
          "That messenger is called an oracle. If one messenger lies or goes silent, every app that trusts it pays. Chainlink is built so that no single messenger can do either.",
        ],
        insight: "Chainlink says its oracles had enabled more than $36 trillion of transaction value by Q3 2026.",
      },
    ],
  },
  {
    label: "No chain of its own",
    title: "Chainlink has no glass box of its own",
    question: "Ethereum, Solana and BNB are blockchains. What is Chainlink?",
    figure: "Glass blocks for Ethereum, Solana, Base, Arbitrum and BNB, all linked by one chain of blue hexagons that belongs to none of them.",
    takeaway: "Chainlink is not a blockchain. It is the chain between blockchains — and LINK earns from services, not from block space.",
    beats: [
      {
        title: "Not a blockchain.",
        body: [
          "Chainlink runs no blocks and sells no block space. LINK itself is a token that lives on Ethereum (an ERC-677 token: a normal token that can carry an instruction with a payment).",
        ],
      },
      {
        title: "A chain that touches every box.",
        body: ["The same network of independent operators serves dozens of blockchains at once. Each service is run by its own small group of nodes, called a DON."],
      },
      {
        title: "So it earns differently.",
        body: [
          "ETH, SOL and BNB earn from people paying to use their chain (gas). LINK earns only when someone pays for a Chainlink service: data, cross-chain transfers, reserve checks.",
        ],
        insight: "This is the root of the big LINK question in chapter 11: the network can be busy while the token stays weak.",
      },
    ],
  },
  {
    label: "Many nodes, one signature",
    title: "Many nodes, one signature",
    question: "If many messengers bring a price, which one does Khoa's app believe?",
    figure: "Nine hexagon nodes each fetch a price, talk to each other off-chain, agree on the middle value, sign one shared report, and only one transaction enters the glass block.",
    takeaway: "Many independent nodes, one median, one signed report, one transaction. Cheaper — and no single node decides.",
    beats: [
      {
        title: "Each node asks its own sources.",
        body: ["Exchanges and data companies quote slightly different prices. Every node collects its own."],
      },
      {
        title: "They agree outside the chain.",
        body: [
          "The nodes talk to each other off-chain and take the median — the middle value. A broken or dishonest node at the edge can't drag the result.",
        ],
      },
      {
        title: "They all sign one report.",
        body: ["Instead of nine separate messages, the network produces one report signed by a quorum of nodes. The blockchain checks the signatures."],
      },
      {
        title: "Only one transaction goes in.",
        body: ["One node delivers the signed report. This design (Off-Chain Reporting, live since February 2021) cut node gas costs by up to 90%."],
        insight: "Nine messengers, one envelope, many seals: that is why the price in Khoa's app is both cheap and hard to fake.",
      },
    ],
  },
  {
    label: "Push or pull",
    title: "Push or pull",
    question: "Does the price arrive on a schedule, or when you need it?",
    figure: "Left: a price pushed into the block when it moves 0.5% or every hour. Right: a fast trade pulls a fresh signed price in under a second and checks the seals itself.",
    beats: [
      {
        title: "Push: Data Feeds.",
        body: ["The ETH/USD feed writes a new price when the market moves 0.5% — or after one hour, whichever comes first. Good for lending apps like Khoa's."],
      },
      {
        title: "Pull: Data Streams.",
        body: [
          "Fast trading apps can't wait. With Data Streams, signed prices are ready off-chain every moment; the app grabs one inside its own transaction and the chain verifies the signatures on the spot.",
        ],
      },
      {
        title: "Same seals, different delivery.",
        body: ["Both are signed by a decentralized oracle network. Push is simple and always there; pull is faster and you pay only when you use it."],
      },
    ],
  },
  {
    label: "Reserves & dice",
    title: "Checking vaults, rolling dice",
    question: "What else can't a blockchain see?",
    figure: "A stablecoin printer linked to a vault meter: printing beyond the reserve is blocked. Then a lottery: a random number arrives with a proof; a tampered number fails the check.",
    beats: [
      {
        title: "Proof of Reserve: look inside the vault.",
        body: ["A token backed by dollars or bitcoin is only as good as its reserve. Chainlink nodes report the reserve on-chain, so the blockchain can see it."],
      },
      {
        title: "No reserve, no printing.",
        body: ["The token's own contract can refuse to mint if new supply would exceed the reported reserve. Issuers such as 21Shares use it for their products."],
      },
      {
        title: "VRF: a fair dice roll.",
        body: ["Blockchains are predictable by design, so they can't roll dice. Chainlink VRF delivers a random number together with a cryptographic proof."],
      },
      {
        title: "A fake roll gets caught.",
        body: ["If anyone changes the number, the proof no longer matches and the contract rejects it. Games and NFT draws use this to stay fair."],
        insight: "Same idea every time: bring an outside fact in with evidence the blockchain can check itself.",
      },
    ],
  },
  {
    label: "Two guards (CCIP)",
    title: "A gate with two guards",
    question: "How do you move value between glass boxes without being robbed?",
    figure: "Two glass blocks joined by a gate. The main network commits a batch; a second network written in a different language checks it and either blesses it or curses the whole gate shut.",
    takeaway: "CCIP adds a second, independent network that must approve every batch — and can stop everything if something looks wrong.",
    beats: [
      {
        title: "Bridges were the weakest link.",
        body: ["In 2022 Ronin lost $624 million, Wormhole $325 million, Nomad $190 million. Chainalysis counted 64% of DeFi hack losses that year came from bridges."],
      },
      {
        title: "Guard one commits, guard two checks.",
        body: [
          "In Chainlink's CCIP (live since July 2023), one network commits a batch of transfers. A separate Risk Management Network re-checks it. The two are written in different languages (Go and Rust) by different teams, so one bug is unlikely to fool both.",
        ],
      },
      {
        title: "Bless — or curse.",
        body: ["Only a blessed batch is executed. If the second guard sees something wrong, it can \"curse\" the system and pause transfers until it is fixed."],
      },
      {
        title: "Hacks elsewhere brought traffic here.",
        body: ["After a $292 million exploit at KelpDAO, projects holding over $3 billion moved to CCIP. CCIP 2.0 launched on 28 September 2026 after more than $84 billion of transfers."],
      },
    ],
  },
  {
    label: "The alarm",
    title: "Staking is an alarm bell",
    question: "What happens when a messenger goes silent?",
    figure: "A clock ticks while the ETH/USD feed is silent. At three hours, an alert is raised: each node operator loses 700 LINK and the person who rang the bell gets 7,000 LINK.",
    beats: [
      {
        title: "A deposit, not a savings account.",
        body: ["Node operators and the community lock LINK in a staking pool of up to 45 million LINK (v0.2, November 2023)."],
      },
      {
        title: "Three hours of silence rings the bell.",
        body: ["If the ETH/USD feed on Ethereum goes more than three hours without a valid update, a staker can raise an alert on-chain."],
      },
      {
        title: "Penalty and reward.",
        body: ["A valid alert cuts 700 LINK from each node operator serving the feed and pays 7,000 LINK to the alerter. Community stakers are not slashed."],
        insight: "The penalty is small and covers one feed so far — a start, not a full insurance policy.",
      },
    ],
  },
  {
    label: "Two flows of LINK",
    title: "Two flows of LINK",
    question: "Where does LINK come from, and where does it go?",
    figure: "1 billion LINK in a grid. A pipe carries fees paid in any token, converted into LINK and into the Reserve. A bigger pipe carries unlocked LINK out of company wallets to an exchange.",
    takeaway: "Usage now buys LINK — but the company still releases about 14 times more LINK than the Reserve buys.",
    beats: [
      {
        title: "1 billion LINK, fixed since 2017.",
        body: ["35% sold in the 2017 token sale (about $32 million), 35% for node operators and the ecosystem, 30% kept by the company."],
      },
      {
        title: "Pay with anything, end up as LINK.",
        body: [
          "Since 2025, users can pay for Chainlink services in other tokens; Payment Abstraction converts the fees into LINK automatically. Since August 2025 part of it goes into the Chainlink Reserve, with no withdrawals planned for years.",
        ],
      },
      {
        title: "The Reserve: 6.68 million LINK.",
        body: ["By 13 November 2026 the Reserve held about 6.68 million LINK (≈ $75 million). It bought about 447,000 LINK in the 30 days to 5 November."],
      },
      {
        title: "The other pipe is wider.",
        body: ["About 19 million LINK leave the company's non-circulating wallets each quarter, most of it to Binance — roughly 6 million a month."],
        insight: "≈ 6 million out vs ≈ 0.45 million in each month: about 14 to 1.",
      },
    ],
  },
  {
    label: "2017–2022",
    title: "The journey so far",
    question: "How did LINK get here?",
    figure: "A price line on a timeline: the 2017 sale at about 10 cents, the 2020 DeFi summer, the $52.88 peak in May 2021, and LUNA's stuck price in May 2022.",
    beats: [
      {
        title: "2017: whitepaper and sale.",
        body: ["Sergey Nazarov and Steve Ellis, with Ari Juels, raised $32 million selling 350 million LINK at roughly 9–11 cents. For almost two years LINK stayed under $1.30."],
      },
      {
        title: "2020: DeFi summer.",
        body: ["Lending and trading apps boomed and all needed prices. LINK reached $20.30 in August 2020 while an anonymous \"Zeus Capital\" called it a scam."],
      },
      {
        title: "10 May 2021: the top.",
        body: ["LINK hit its all-time high of $52.88 — about 580 times the sale price."],
      },
      {
        title: "May 2022: a stuck link.",
        body: [
          "When LUNA collapsed to $0.01, Chainlink's LUNA feed kept reporting a built-in minimum of $0.107. Attackers borrowed against the inflated price; Venus lost about $11.2 million.",
        ],
        insight: "The lesson for apps like Khoa's: the oracle is one link — check its answers and keep a pause button.",
      },
    ],
  },
  {
    label: "Banks & CRE",
    title: "Banks hook into the chain",
    question: "Why do Swift, UBS and DTCC work with a crypto project?",
    figure: "Bank buildings linked by blue hexagons to glass blocks, with labels showing which links are pilots and which are live.",
    beats: [
      {
        title: "Swift: 17 banks piloting.",
        body: ["Swift connects over 11,500 institutions. Its blockchain ledger connects banks through the Chainlink platform; 17 banks are piloting it."],
      },
      {
        title: "UBS: a real transaction.",
        body: ["On 4 November 2025 UBS completed a live subscription and redemption of its tokenised money-market fund using Chainlink's Digital Transfer Agent standard."],
      },
      {
        title: "CRE: one control room for many links.",
        body: [
          "The Chainlink Runtime Environment (live since 4 November 2025) lets institutions combine data, reserves, compliance and cross-chain transfers in one workflow. DTCC plans a go-live in Q4 2026.",
        ],
        insight: "Many of these are pilots or planned launches. A big name is not the same as daily volume.",
      },
    ],
  },
  {
    label: "LINK today",
    title: "LINK in November 2026",
    question: "The chain keeps growing. Why doesn't the price?",
    figure: "Price tiles, a usage line rising while the price line falls, and the range of market-share estimates.",
    beats: [
      {
        title: "About $9, far from the top.",
        body: ["LINK closed at $8.85 on 15 November 2026 — about 84% below its 2021 high. Market value is around $7 billion."],
      },
      {
        title: "Wall Street can buy it.",
        body: ["Grayscale's GLNK became the first US spot Chainlink ETF on 2 December 2025; CME LINK futures started in February 2026. US spot ETFs held about $175 million in November 2026."],
      },
      {
        title: "Still the default, not the only one.",
        body: ["Estimates of Chainlink's oracle share range from about 60% to 84%. Pyth and RedStone win fast-trading apps; RedStone has over 99% on Hyperliquid's EVM."],
        insight: "Busy network, weak token: fees can be paid in other tokens, and unlocks keep coming.",
      },
    ],
  },
  {
    label: "Strong & weak",
    title: "Strong links, weak links",
    question: "What should a LINK holder watch?",
    figure: "Five solid blue links for strengths and five cracked red links for weaknesses.",
    beats: [
      {
        title: "Strong links.",
        body: [
          "Default oracle for most big DeFi lending apps since 2019 · no single node decides · a second guard on cross-chain transfers · banks and market infrastructure build with it · fees now buy LINK for the Reserve.",
        ],
      },
      {
        title: "Weak links.",
        body: [
          "LINK earns from services, not block space, and fees can arrive in other tokens · about 19 million LINK unlocked each quarter · one company steers products and much of the supply · faster rivals in trading · oracles can still be wrong (LUNA, 2022).",
        ],
      },
    ],
  },
  {
    label: "Conclusion",
    title: "The chain is not the token",
    question: "So what is LINK, in one sentence?",
    figure: "All the glass blocks linked into one network by blue hexagons; one hexagon labelled LINK sits apart.",
    beats: [
      {
        title: "Chainlink is the missing link.",
        body: ["It carries prices, reserves, random numbers and transfers into and between blockchains — with many independent nodes, shared signatures and a second guard."],
      },
      {
        title: "But the chain is not the token.",
        body: [
          "Khoa will use Chainlink's feed, with his own safety checks. If you buy LINK, you bet on the token: watch the unlocks, the Reserve and how much revenue is paid in LINK. As of November 2026 Vietnam has no licensed crypto exchange. This is education, not investment advice.",
        ],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Mắt xích còn thiếu",
    title: "Blockchain là những khối kính kín",
    question: "Blockchain không nhìn thấy thế giới. Vậy ai mang sự thật vào — và vì sao tin được họ?",
    figure: "Nhiều khối kính, mỗi khối là một blockchain, đóng kín và không nhìn ra ngoài. Giữa chúng và thế giới bên ngoài là một khoảng trống: mắt xích còn thiếu.",
    beats: [
      {
        title: "Làm quen với Khoa.",
        body: ["Khoa làm một ứng dụng cho vay nhỏ ở Sài Gòn: khoá ETH, vay đô la. Để biết cho vay bao nhiêu, ứng dụng phải biết giá ETH — ngay lúc này."],
      },
      {
        title: "Blockchain là một khối kính kín.",
        body: [
          "Mọi thứ bên trong chạy hoàn hảo, nhưng không gì bên trong nhìn ra được. Hợp đồng thông minh không mở được trang web, không đọc được sàn, không hỏi được ngân hàng. Giá cả, dự trữ, số ngẫu nhiên — tất cả đều nằm ngoài lớp kính.",
        ],
      },
      {
        title: "Phải có ai đó mang sự thật vào.",
        body: ["Người đưa tin đó gọi là oracle. Nếu một người nói sai hoặc im lặng, mọi ứng dụng tin vào họ đều thiệt. Chainlink được xây để không một người đưa tin nào làm được hai điều đó."],
        insight: "Chainlink cho biết oracle của họ đã hỗ trợ hơn 36 nghìn tỷ USD giá trị giao dịch tính tới quý III/2026.",
      },
    ],
  },
  {
    label: "Không có chain riêng",
    title: "Chainlink không có khối kính nào của riêng mình",
    question: "Ethereum, Solana, BNB là blockchain. Còn Chainlink là gì?",
    figure: "Các khối kính Ethereum, Solana, Base, Arbitrum, BNB được nối bằng một chuỗi lục giác xanh không thuộc về khối nào.",
    takeaway: "Chainlink không phải blockchain. Nó là sợi xích giữa các blockchain — và LINK kiếm tiền từ dịch vụ, không phải từ chỗ trong khối.",
    beats: [
      {
        title: "Không phải blockchain.",
        body: [
          "Chainlink không chạy khối nào, không bán chỗ trong khối. Bản thân LINK là một token nằm trên Ethereum (chuẩn ERC-677: token bình thường nhưng gửi kèm được lệnh khi thanh toán).",
        ],
      },
      {
        title: "Một sợi xích chạm vào mọi khối kính.",
        body: ["Cùng một mạng các nhà vận hành độc lập phục vụ hàng chục blockchain cùng lúc. Mỗi dịch vụ do một nhóm node nhỏ riêng đảm nhận, gọi là DON."],
      },
      {
        title: "Nên cách kiếm tiền cũng khác.",
        body: [
          "ETH, SOL, BNB thu tiền khi người ta trả phí để dùng chuỗi của mình (gas). LINK chỉ thu khi có người trả tiền cho một dịch vụ Chainlink: dữ liệu, chuyển liên chuỗi, kiểm tra dự trữ.",
        ],
        insight: "Đây là gốc của câu hỏi lớn ở chương 11: mạng có thể rất bận mà token vẫn yếu.",
      },
    ],
  },
  {
    label: "Nhiều node, một chữ ký",
    title: "Nhiều node, một chữ ký",
    question: "Nếu nhiều người cùng mang giá đến, ứng dụng của Khoa tin ai?",
    figure: "Chín node lục giác mỗi node lấy một mức giá, trao đổi với nhau ngoài chuỗi, thống nhất giá trị ở giữa, cùng ký một báo cáo, và chỉ một giao dịch đi vào khối kính.",
    takeaway: "Nhiều node độc lập, một trung vị, một báo cáo có chữ ký chung, một giao dịch. Rẻ hơn — và không node nào tự quyết.",
    beats: [
      {
        title: "Mỗi node hỏi nguồn riêng.",
        body: ["Các sàn và công ty dữ liệu báo giá hơi khác nhau. Node nào cũng tự thu thập."],
      },
      {
        title: "Thống nhất ngoài chuỗi.",
        body: ["Các node trao đổi với nhau ngoài chuỗi và lấy trung vị — giá trị nằm giữa. Một node hỏng hay gian lận ở rìa không kéo lệch được kết quả."],
      },
      {
        title: "Cùng ký một báo cáo.",
        body: ["Thay vì chín tin nhắn riêng, mạng tạo một báo cáo được đa số node ký. Blockchain tự kiểm tra các chữ ký."],
      },
      {
        title: "Chỉ một giao dịch đi vào.",
        body: ["Một node mang báo cáo đã ký vào chuỗi. Cách làm này (Off-Chain Reporting, chạy từ tháng 2/2021) giảm tới 90% phí gas cho node."],
        insight: "Chín người đưa tin, một phong bì, nhiều con dấu: vì thế giá trong ứng dụng của Khoa vừa rẻ vừa khó làm giả.",
      },
    ],
  },
  {
    label: "Đẩy hay kéo",
    title: "Đẩy hay kéo",
    question: "Giá đến theo lịch, hay đến khi bạn cần?",
    figure: "Bên trái: giá được đẩy vào khối khi lệch 0,5% hoặc mỗi giờ. Bên phải: một lệnh giao dịch nhanh kéo một mức giá có chữ ký trong chưa tới một giây và tự kiểm tra con dấu.",
    beats: [
      {
        title: "Đẩy: Data Feeds.",
        body: ["Nguồn giá ETH/USD ghi giá mới khi thị trường lệch 0,5% — hoặc sau một giờ, tuỳ điều kiện nào đến trước. Hợp với ứng dụng cho vay như của Khoa."],
      },
      {
        title: "Kéo: Data Streams.",
        body: ["Ứng dụng giao dịch nhanh không chờ được. Với Data Streams, giá có chữ ký luôn sẵn ngoài chuỗi; ứng dụng lấy một mức giá ngay trong giao dịch của mình và chuỗi kiểm tra chữ ký tại chỗ."],
      },
      {
        title: "Cùng con dấu, khác cách giao.",
        body: ["Cả hai đều do một mạng oracle phi tập trung ký. Đẩy thì đơn giản và luôn có sẵn; kéo thì nhanh hơn và chỉ trả tiền khi dùng."],
      },
    ],
  },
  {
    label: "Kiểm kho & bốc thăm",
    title: "Soi kho, gieo xúc xắc",
    question: "Blockchain còn không nhìn thấy gì nữa?",
    figure: "Máy in stablecoin nối với đồng hồ đo kho: in vượt dự trữ bị chặn. Sau đó là bốc thăm: số ngẫu nhiên đến kèm bằng chứng; số bị sửa không qua được kiểm tra.",
    beats: [
      {
        title: "Proof of Reserve: nhìn vào trong kho.",
        body: ["Một token được bảo chứng bằng đô la hay bitcoin chỉ tốt khi kho dự trữ thật. Node Chainlink báo lượng dự trữ lên chuỗi, để blockchain nhìn thấy được."],
      },
      {
        title: "Kho không đủ thì không in.",
        body: ["Hợp đồng của token có thể từ chối in thêm nếu nguồn cung mới vượt lượng dự trữ được báo. Các bên phát hành như 21Shares dùng cách này cho sản phẩm của mình."],
      },
      {
        title: "VRF: gieo xúc xắc công bằng.",
        body: ["Blockchain vốn được thiết kế để đoán trước được, nên không tự gieo xúc xắc. Chainlink VRF đưa vào một số ngẫu nhiên kèm bằng chứng mật mã."],
      },
      {
        title: "Gieo gian là bị bắt.",
        body: ["Nếu ai sửa con số, bằng chứng không còn khớp và hợp đồng từ chối. Game và bốc thăm NFT dùng cách này để giữ công bằng."],
        insight: "Lần nào cũng cùng một ý: mang sự thật bên ngoài vào kèm bằng chứng mà blockchain tự kiểm tra được.",
      },
    ],
  },
  {
    label: "Hai lớp gác (CCIP)",
    title: "Cổng có hai người gác",
    question: "Làm sao chuyển giá trị giữa các khối kính mà không bị cướp?",
    figure: "Hai khối kính nối bằng một cổng. Mạng chính ghi nhận một lô; mạng thứ hai viết bằng ngôn ngữ khác kiểm tra lại rồi ban phước, hoặc nguyền để đóng cả cổng.",
    takeaway: "CCIP thêm một mạng thứ hai, độc lập, phải duyệt từng lô — và có thể dừng tất cả nếu thấy bất thường.",
    beats: [
      {
        title: "Cầu nối từng là mắt xích yếu nhất.",
        body: ["Năm 2022 Ronin mất 624 triệu USD, Wormhole 325 triệu, Nomad 190 triệu. Chainalysis thống kê 64% tiền mất trong các vụ hack DeFi năm đó đến từ cầu nối."],
      },
      {
        title: "Người gác thứ nhất ghi, người thứ hai soát.",
        body: [
          "Trong CCIP của Chainlink (chạy từ 7/2023), một mạng ghi nhận lô chuyển tiền. Một Risk Management Network riêng soát lại. Hai bên viết bằng hai ngôn ngữ (Go và Rust), do hai đội khác nhau, nên khó có một lỗi lừa được cả hai.",
        ],
      },
      {
        title: "Ban phước — hoặc nguyền.",
        body: ["Chỉ lô được ban phước mới được thực hiện. Nếu người gác thứ hai thấy bất thường, họ có thể \"nguyền\" hệ thống và tạm dừng chuyển cho tới khi sửa xong."],
      },
      {
        title: "Hack ở nơi khác, khách lại sang đây.",
        body: ["Sau vụ KelpDAO bị khai thác 292 triệu USD, các dự án giữ hơn 3 tỷ USD đã chuyển sang CCIP. CCIP 2.0 ra mắt ngày 28/9/2026, sau hơn 84 tỷ USD đã đi qua."],
      },
    ],
  },
  {
    label: "Còi báo động",
    title: "Staking là chiếc còi báo động",
    question: "Chuyện gì xảy ra khi người đưa tin im lặng?",
    figure: "Đồng hồ chạy trong khi nguồn giá ETH/USD im lặng. Tới ba giờ, còi vang lên: mỗi nhà vận hành node mất 700 LINK, người bấm còi nhận 7.000 LINK.",
    beats: [
      {
        title: "Tiền ký quỹ, không phải sổ tiết kiệm.",
        body: ["Nhà vận hành node và cộng đồng khoá LINK vào quỹ staking chứa tối đa 45 triệu LINK (bản v0.2, tháng 11/2023)."],
      },
      {
        title: "Im lặng ba giờ là còi vang.",
        body: ["Nếu nguồn giá ETH/USD trên Ethereum quá ba giờ không có cập nhật hợp lệ, người staking có thể bấm báo động ngay trên chuỗi."],
      },
      {
        title: "Phạt và thưởng.",
        body: ["Báo động hợp lệ sẽ cắt 700 LINK của mỗi nhà vận hành node phục vụ nguồn giá đó, và trả 7.000 LINK cho người báo. Người staking cộng đồng không bị cắt."],
        insight: "Mức phạt còn nhỏ và mới áp cho một nguồn giá — là bước đầu, chưa phải hợp đồng bảo hiểm đầy đủ.",
      },
    ],
  },
  {
    label: "Hai dòng chảy LINK",
    title: "Hai dòng chảy LINK",
    question: "LINK đến từ đâu, và đi về đâu?",
    figure: "1 tỷ LINK trong một lưới ô. Một đường ống mang phí trả bằng đủ loại token, đổi thành LINK và đổ vào quỹ dự trữ. Một đường ống lớn hơn mang LINK mở khoá từ ví công ty ra sàn.",
    takeaway: "Lượng dùng giờ đã mua LINK — nhưng công ty vẫn xả ra nhiều gấp khoảng 14 lần số quỹ dự trữ mua vào.",
    beats: [
      {
        title: "1 tỷ LINK, cố định từ 2017.",
        body: ["35% bán trong đợt mở bán 2017 (khoảng 32 triệu USD), 35% cho nhà vận hành node và hệ sinh thái, 30% công ty giữ."],
      },
      {
        title: "Trả bằng gì cũng được, cuối cùng thành LINK.",
        body: [
          "Từ năm 2025, người dùng có thể trả phí dịch vụ Chainlink bằng token khác; Payment Abstraction tự đổi phí sang LINK. Từ 8/2025 một phần đổ vào Chainlink Reserve, và không dự kiến rút ra trong nhiều năm.",
        ],
      },
      {
        title: "Quỹ dự trữ: 6,68 triệu LINK.",
        body: ["Đến 13/11/2026 quỹ có khoảng 6,68 triệu LINK (≈ 75 triệu USD). Trong 30 ngày tới 5/11 quỹ mua khoảng 447.000 LINK."],
      },
      {
        title: "Ống còn lại to hơn.",
        body: ["Mỗi quý khoảng 19 triệu LINK rời các ví chưa lưu hành của công ty, phần lớn lên Binance — khoảng 6 triệu mỗi tháng."],
        insight: "Mỗi tháng ≈ 6 triệu ra so với ≈ 0,45 triệu vào: khoảng 14 trên 1.",
      },
    ],
  },
  {
    label: "2017–2022",
    title: "Hành trình tới nay",
    question: "LINK đã đi tới đây như thế nào?",
    figure: "Đường giá trên dòng thời gian: đợt bán 2017 khoảng 10 cent, mùa hè DeFi 2020, đỉnh 52,88 USD tháng 5/2021, và giá LUNA bị kẹt tháng 5/2022.",
    beats: [
      {
        title: "2017: sách trắng và đợt bán.",
        body: ["Sergey Nazarov và Steve Ellis, cùng Ari Juels, gọi được 32 triệu USD khi bán 350 triệu LINK giá khoảng 9–11 cent. Gần hai năm sau, LINK vẫn dưới 1,30 USD."],
      },
      {
        title: "2020: mùa hè DeFi.",
        body: ["Ứng dụng cho vay và giao dịch bùng nổ, ứng dụng nào cũng cần giá. LINK lên 20,30 USD vào 8/2020 trong khi một \"Zeus Capital\" ẩn danh gọi nó là lừa đảo."],
      },
      {
        title: "10/5/2021: đỉnh cao nhất.",
        body: ["LINK chạm đỉnh lịch sử 52,88 USD — gấp khoảng 580 lần giá bán ban đầu."],
      },
      {
        title: "5/2022: một mắt xích bị kẹt.",
        body: ["Khi LUNA sụp xuống 0,01 USD, nguồn giá LUNA của Chainlink vẫn báo mức sàn cài sẵn 0,107 USD. Kẻ tấn công vay dựa trên giá bị thổi phồng; Venus mất khoảng 11,2 triệu USD."],
        insight: "Bài học cho ứng dụng như của Khoa: oracle chỉ là một mắt xích — hãy tự kiểm tra con số và có nút tạm dừng.",
      },
    ],
  },
  {
    label: "Ngân hàng & CRE",
    title: "Ngân hàng móc vào sợi xích",
    question: "Vì sao Swift, UBS, DTCC làm việc với một dự án crypto?",
    figure: "Các toà nhà ngân hàng nối bằng lục giác xanh tới khối kính, có nhãn cho biết mắt xích nào là thí điểm, mắt xích nào chạy thật.",
    beats: [
      {
        title: "Swift: 17 ngân hàng chạy thử.",
        body: ["Swift kết nối hơn 11.500 tổ chức. Sổ cái blockchain của Swift nối các ngân hàng qua nền tảng Chainlink; 17 ngân hàng đang chạy thử."],
      },
      {
        title: "UBS: một giao dịch thật.",
        body: ["Ngày 4/11/2025, UBS hoàn tất một lệnh mua và một lệnh rút thật với quỹ thị trường tiền tệ dạng token, dùng chuẩn Digital Transfer Agent của Chainlink."],
      },
      {
        title: "CRE: một phòng điều khiển cho nhiều mắt xích.",
        body: [
          "Chainlink Runtime Environment (chạy từ 4/11/2025) cho phép tổ chức gộp dữ liệu, dự trữ, tuân thủ và chuyển liên chuỗi vào một quy trình. DTCC dự kiến chạy thật trong quý IV/2026.",
        ],
        insight: "Nhiều việc trong số này là thí điểm hoặc kế hoạch. Tên lớn không đồng nghĩa với khối lượng hằng ngày.",
      },
    ],
  },
  {
    label: "LINK hôm nay",
    title: "LINK tháng 11/2026",
    question: "Sợi xích cứ dài ra. Sao giá không lên?",
    figure: "Các ô giá, đường lượng dùng đi lên trong khi đường giá đi xuống, và khoảng ước tính thị phần.",
    beats: [
      {
        title: "Khoảng 9 USD, cách xa đỉnh.",
        body: ["LINK đóng cửa ở 8,85 USD ngày 15/11/2026 — thấp hơn đỉnh 2021 khoảng 84%. Vốn hoá khoảng 7 tỷ USD."],
      },
      {
        title: "Phố Wall đã mua được.",
        body: ["GLNK của Grayscale là ETF Chainlink giao ngay đầu tiên ở Mỹ (2/12/2025); hợp đồng tương lai LINK trên CME bắt đầu tháng 2/2026. Các ETF giao ngay ở Mỹ nắm khoảng 175 triệu USD vào 11/2026."],
      },
      {
        title: "Vẫn là mặc định, nhưng không còn duy nhất.",
        body: ["Thị phần oracle của Chainlink được ước tính từ khoảng 60% tới 84%. Pyth và RedStone thắng ở mảng giao dịch nhanh; RedStone chiếm hơn 99% trên EVM của Hyperliquid."],
        insight: "Mạng bận rộn, token yếu: phí có thể trả bằng token khác, và mở khoá vẫn đều đặn.",
      },
    ],
  },
  {
    label: "Mạnh & yếu",
    title: "Mắt xích chắc, mắt xích yếu",
    question: "Người giữ LINK nên để ý gì?",
    figure: "Năm mắt xích xanh chắc chắn cho điểm mạnh và năm mắt xích đỏ nứt cho điểm yếu.",
    beats: [
      {
        title: "Mắt xích chắc.",
        body: [
          "Oracle mặc định của phần lớn ứng dụng cho vay DeFi lớn từ 2019 · không node nào tự quyết · lớp gác thứ hai cho chuyển liên chuỗi · ngân hàng và hạ tầng thị trường xây cùng · phí giờ đã mua LINK cho quỹ dự trữ.",
        ],
      },
      {
        title: "Mắt xích yếu.",
        body: [
          "LINK thu từ dịch vụ chứ không từ chỗ trong khối, và phí có thể trả bằng token khác · khoảng 19 triệu LINK mở khoá mỗi quý · một công ty cầm lái sản phẩm và nhiều nguồn cung · đối thủ nhanh hơn ở mảng giao dịch · oracle vẫn có thể sai (LUNA, 2022).",
        ],
      },
    ],
  },
  {
    label: "Kết luận",
    title: "Sợi xích không phải là token",
    question: "Vậy LINK là gì, trong một câu?",
    figure: "Mọi khối kính được nối thành một mạng bằng lục giác xanh; một lục giác mang chữ LINK đứng riêng.",
    beats: [
      {
        title: "Chainlink là mắt xích còn thiếu.",
        body: ["Nó mang giá cả, dự trữ, số ngẫu nhiên và các lệnh chuyển vào và giữa các blockchain — bằng nhiều node độc lập, chữ ký chung và một lớp gác thứ hai."],
      },
      {
        title: "Nhưng sợi xích không phải là token.",
        body: [
          "Khoa sẽ dùng nguồn giá của Chainlink, kèm các bước tự kiểm tra. Nếu bạn mua LINK, bạn đặt cược vào token: hãy theo dõi mở khoá, quỹ dự trữ và bao nhiêu doanh thu thật sự trả bằng LINK. Tính tới tháng 11/2026 Việt Nam chưa có sàn crypto được cấp phép. Đây là nội dung giáo dục, không phải lời khuyên đầu tư.",
        ],
      },
    ],
  },
];
