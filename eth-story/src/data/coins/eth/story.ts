/** Story copy for the Ethereum explainer (six acts), English and Vietnamese.
 * Written for complete beginners: everyday words first, jargon only once it has been explained. */
export type Beat = { title: string; body: string[]; notes?: string[]; deep?: string[] };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "Who goes first?",
    title: "Who goes first?",
    question: "How do two strangers on opposite sides of the world trust each other with money?",
    figure: "Lan, a designer in Da Nang, and Anna, a baker in Berlin, face each other across a map. A $500 logo job sits between them, and each waits for the other to move first.",
    takeaway: "Between strangers, someone has to go first — or a middleman has to hold the money. Ethereum asks: what if the 'middleman' were a small program that nobody owns?",
    beats: [
      {
        title: "No crypto knowledge needed. We start with a $500 logo.",
        body: ["Lan is a graphic designer in Da Nang. Anna runs a small bakery in Berlin and needs a new logo. They have never met. Scroll down — the picture on the right tells the story."],
      },
      {
        title: "The oldest problem in trade: who goes first?",
        body: [
          "If Anna pays first, Lan might disappear with the money. If Lan works first, Anna might take the logo and never pay. Each one is asking the other to take the risk.",
        ],
      },
      {
        title: "So they use a middleman — and pay for it.",
        body: [
          "A freelance platform holds Anna's money and releases it when the job is done. That works, but it costs: Upwork takes 0–15% from the freelancer per contract, Fiverr keeps 20% of each order.",
          "The platform also makes the rules — it can freeze accounts, change fees, or decide a dispute.",
        ],
        notes: ["Upwork and Fiverr help centres, as summarised by Lilach Bullock, Oct 2026."],
      },
      {
        title: "Four ways to settle — watch them one by one.",
        body: [
          "1. Anna pays first — Anna carries the risk. 2. Lan works first — Lan carries the risk. 3. A platform — safe for both, but $100 of the $500 is gone at Fiverr's 20%.",
          "4. A smart contract — rules written in code, a few cents in fees. The rest of this story explains how that works.",
        ],
      },
    ],
  },
  {
    label: "A computer nobody owns",
    title: "A computer nobody owns",
    question: "Bitcoin already existed. Why build something new?",
    figure: "A pocket calculator labelled Bitcoin beside a computer labelled Ethereum; then a vending machine that takes a coin and drops a snack with no shopkeeper.",
    takeaway: "Ethereum is a shared computer run by thousands of people at once. Programs on it — smart contracts — follow their rules automatically, and ETH is the fuel that pays for running them.",
    beats: [
      {
        title: "2013: a 19-year-old has an idea.",
        body: [
          "Vitalik Buterin was writing about Bitcoin. Bitcoin is like a calculator: brilliant at one thing — sending coins. He asked: what if a blockchain were a full computer, able to run any program?",
        ],
      },
      {
        title: "A smart contract is a vending machine for agreements.",
        body: [
          "Put in a coin, press B4, get a snack. No shopkeeper decides — the machine's rules do. A smart contract is the same idea in code: 'if this happens, then send that money.'",
          "Once it is on Ethereum, nobody — not even its author — can quietly change the rules.",
        ],
      },
      {
        title: "2014–2015: funded by the public, then switched on.",
        body: [
          "In a 2014 online sale, people sent about 31,000 BTC (roughly $18 million at the time) and received over 60 million ETH. On 30 July 2015 the network went live.",
        ],
        deep: ["A non-profit, the Ethereum Foundation, funds research. But it does not run the network: thousands of independent computers do, and they choose which software to run."],
      },
      {
        title: "ETH is the fuel.",
        body: [
          "Every action on this shared computer costs a small fee, paid in ETH. That's why ETH exists — not as 'Ethereum shares', but as the fuel that pays the computers doing the work.",
        ],
      },
    ],
  },
  {
    label: "Eleven years in fast-forward",
    title: "Eleven years in fast-forward",
    question: "What has actually happened to Ethereum since 2015?",
    figure: "ETH's price from 2015 to 2026 on a log scale, drawn as the playhead advances; events burst as they are crossed — red for hacks and crashes, white for peaks, blue for upgrades.",
    takeaway: "Ethereum survived a hack that split its community, two boom-and-bust cycles and a complete engine swap. The technology kept improving — but the price has never moved in a straight line.",
    beats: [
      {
        title: "2015–2017: the first big test.",
        body: ["Within a year, a famous contract called The DAO was drained by a bug. The community voted to undo it — and split into Ethereum and Ethereum Classic."],
      },
      {
        title: "2017–2020: boom, bust, and 'DeFi summer'.",
        body: ["Start-ups raised billions selling tokens on Ethereum, then most failed. By 2020, real apps for lending and trading without banks were taking off."],
      },
      {
        title: "2021–2023: burning fees and swapping the engine.",
        body: ["Fees started being burned in 2021. In 2022 'The Merge' replaced mining with staking — while the network kept running."],
      },
      {
        title: "2024–2026: cheaper, more mainstream, more volatile.",
        body: ["ETFs, cheap Layer-2 networks and a record close near $4,830 in August 2025. By November 2026 ETH was back under $2,000."],
        notes: ["Prices: Coin Metrics daily closes to 23 May 2026, then dated news reports (dashed line)."],
      },
    ],
  },
  {
    label: "The contract in action",
    title: "The contract in action",
    question: "What would a smart contract actually do for Lan and Anna?",
    figure: "A transparent box between Lan and Anna holds $500 in a digital dollar. Three rules glow one by one as the scenario plays out, and the money flows to whoever the rules say.",
    takeaway: "The contract holds the money and follows its rules exactly — no company in between, no fee percentage. But it can only judge what can be checked by code.",
    beats: [
      {
        title: "Anna locks $500 in a contract — not with Lan, not with a platform.",
        body: [
          "She uses a stablecoin: a digital dollar that stays worth $1, so neither side worries about ETH's price swinging. The money now sits inside a small program on Ethereum that anyone can inspect.",
        ],
      },
      {
        title: "Three rules, written in advance:",
        body: [
          "1. If Anna presses 'approve', the $500 goes to Lan.",
          "2. If Lan delivers and Anna stays silent for 7 days, the $500 goes to Lan anyway.",
          "3. If nothing is delivered by the deadline, the $500 goes back to Anna.",
        ],
        deep: ["Real escrow contracts often add a third person as referee for disputes. That person can be anyone both sides agree on — but then you are trusting a person again."],
      },
      {
        title: "Three endings, played one after another.",
        body: [
          "Anna approves after two days → rule 1 pays Lan. Anna stays silent → after 7 days rule 2 pays Lan anyway. Lan never delivers → at the deadline rule 3 refunds Anna.",
          "Nobody presses a button at a company. The fee is a few cents, not a percentage.",
        ],
      },
      {
        title: "Honest limits.",
        body: [
          "Code cannot tell if a logo is beautiful — only whether a file was delivered on time. And a bug in the code is a bug forever: that is exactly what went wrong with The DAO.",
        ],
      },
    ],
  },
  {
    label: "One notebook, thousands of copies",
    title: "One notebook, thousands of copies",
    question: "Where does this contract live, and who runs it?",
    figure: "A single shared notebook copied onto thousands of computers worldwide; every 12 seconds a new page is added and all copies update together.",
    takeaway: "Ethereum is one shared record kept by thousands of computers. Every 12 seconds a new page (block) is added. Contracts are just entries in that record — so everyone can check them.",
    beats: [
      {
        title: "Imagine a notebook that thousands of people keep identical copies of.",
        body: ["Every balance and every contract is written in it. If one copy is changed in secret, it no longer matches the others — and is ignored."],
      },
      {
        title: "Every 12 seconds, a new page.",
        body: ["New transactions are collected into a 'block' — a page of the notebook — and added to the end. Pages are linked, so old pages can't be edited without breaking the chain."],
      },
      {
        title: "Lan and Anna's contract is one entry in that notebook.",
        body: ["When Anna presses 'approve', every computer runs the same code and gets the same result. That is why nobody needs to trust a single company."],
      },
      {
        title: "But running code on thousands of computers is expensive.",
        body: ["What stops someone from uploading a program that loops forever and jams everyone? The answer is the fee — called gas."],
      },
    ],
  },
  {
    label: "Gas: the ticket price",
    title: "Gas: the ticket price",
    question: "Why is Ethereum sometimes cheap and sometimes very expensive?",
    figure: "Blocks drawn as buses leaving every 12 seconds. When buses are full the ticket price rises, when they are empty it falls; the base part of every ticket is burned in a small flame.",
    takeaway: "Each block is a bus with limited seats. The base ticket price rises when buses are full and falls when they're empty — and that base price is burned, not paid to anyone.",
    beats: [
      {
        title: "Think of each block as a bus that leaves every 12 seconds.",
        body: [
          "Seats are limited. 'Gas' measures how much work your transaction needs — a simple ETH transfer uses 21,000 gas, a complex contract much more.",
        ],
      },
      {
        title: "The ticket has two parts.",
        body: [
          "The base fee is set automatically: if the last bus was more than half full, it rises (by up to 12.5%); if less, it falls. This part is burned — it disappears forever.",
          "The tip is optional and goes to whoever builds the block, to get you on board faster.",
        ],
        notes: ["EIP-1559 (August 2021). Simplified: real blocks have a target of 50% full."],
      },
      {
        title: "Watch a rush hour.",
        body: [
          "Twelve nearly full buses in a row: the base fee climbs about 10% per block — more than three times higher in under 3 minutes. When the rush ends, it slides back down just as fast.",
          "In 2026 a simple transfer costs cents. In busy 2021, it often cost several dollars.",
        ],
        notes: ["Simplified model: starting fee 1 gwei, ETH at $1,954 (13 Nov 2026)."],
      },
    ],
  },
  {
    label: "Staking: a deposit for honesty",
    title: "Staking: a deposit for honesty",
    question: "Without miners, who keeps the notebook honest?",
    figure: "Validators each lock 32 ETH as a deposit; every 12 seconds one is picked at random to propose the next page while others vote; a cheater's deposit shrinks in red.",
    takeaway: "Validators lock up ETH as a deposit. Honest work earns a small reward; going offline costs a little; cheating can cost a lot. Your own money is the guarantee of your behaviour.",
    beats: [
      {
        title: "To help run Ethereum, you put down a deposit.",
        body: [
          "A 'validator' locks 32 ETH. Every 12 seconds one validator is picked at random to propose the next page; others check it and vote.",
          "About 41.4 million ETH — roughly a third of all ETH — was staked in August 2026.",
        ],
        notes: ["KuCoin / The Block, Aug 2026."],
      },
      {
        title: "Carrot and stick.",
        body: [
          "Honest validators earn new ETH — around 2.8% a year in August 2026. Being offline costs small penalties. Signing two conflicting pages ('slashing') burns part of the deposit and removes the validator.",
        ],
        deep: ["Most people don't run their own validator. They stake through exchanges or pools such as Lido, which held roughly 23% of all staked ETH in 2026 — a concentration risk people debate."],
      },
      {
        title: "One year, three validators.",
        body: [
          "The honest one ends near 32.9 ETH. The one that is offline a fifth of the time ends near 32.5. The one that double-signs on day 120 is slashed, loses about 1.7 ETH and is removed.",
        ],
        notes: ["Simplified: ≈2.8% a year; real penalties depend on how many validators are slashed at once."],
      },
    ],
  },
  {
    label: "DeFi: a bank made of code",
    title: "DeFi: a bank made of code",
    question: "Can you borrow money with no bank and no credit check?",
    figure: "A balance scale: deposited ETH on one side, borrowed dollars on the other. As the ETH price falls, the scale tips toward a red liquidation line.",
    takeaway: "DeFi lending works by over-collateral: you lock more than you borrow. If the price of your collateral falls too far, the code sells it automatically — no phone call, no mercy.",
    beats: [
      {
        title: "Put ETH in, take dollars out.",
        body: [
          "On lending apps like Aave, you deposit ETH as collateral and borrow stablecoins against it. No forms, no credit score — the code only checks the numbers.",
        ],
      },
      {
        title: "The catch: you must always be over-covered.",
        body: [
          "You can borrow up to about 80% of your ETH's value. If ETH falls so that your debt reaches about 83% of it, anyone can repay part of your loan and take your ETH at a discount (around 5%). That is a 'liquidation'.",
        ],
        notes: ["Rounded values similar to Aave v3 for ETH; real parameters vary by market and change over time."],
        deep: ["The 'health factor' = collateral × 83% ÷ debt. Above 1 is safe; at 1 or below, liquidation can happen."],
      },
      {
        title: "Watch the price fall.",
        body: [
          "Someone deposits 5 ETH (about $9,770) and borrows $4,690. As ETH slides from $1,954 toward $1,130, the health factor drops from 1.73 to below 1 — and the code lets someone repay half the loan and take ETH at a discount.",
        ],
      },
    ],
  },
  {
    label: "Follow the money",
    title: "Follow the money",
    question: "Does using Ethereum make ETH scarcer — or more plentiful?",
    figure: "Fees split into a burned flame and a tip; new ETH flows in to stakers; a see-saw weighs ETH created against ETH burned, above the real supply line since The Merge.",
    takeaway: "New ETH is created for stakers, and the base fee of every transaction is burned. Busy network → more burned. Quiet network → supply grows. Neither tells you the price.",
    beats: [
      {
        title: "Two taps: one fills, one drains.",
        body: [
          "Fill: new ETH is created every day to reward stakers. Drain: the base fee of every transaction is burned.",
          "When the network is busy, the drain can be bigger than the tap — supply shrinks. When it's quiet, supply grows.",
        ],
      },
      {
        title: "What really happened since The Merge.",
        body: [
          "Supply was about 120.5 million ETH at The Merge, fell to about 120.0 million in early 2024, then rose again to about 121.7 million by May 2026 as cheaper Layer-2 networks reduced fees on the main chain.",
        ],
        notes: ["Coin Metrics, to 23 May 2026. Different trackers report slightly different supply totals."],
      },
      {
        title: "Four things people mix up.",
        body: [
          "Network success (people use it) ≠ network revenue (fees paid) ≠ token value (ETH price) ≠ holder profit (what you bought it for). Each can move without the others.",
        ],
      },
      {
        title: "A busy year vs a quiet year.",
        body: [
          "Like 2023 — about 20 million ETH staked and ~3,000 ETH burned a day: more is burned than created, so supply shrinks a little (≈ −0.3% a year).",
          "Like 2026 — 41 million staked and ~300 burned a day: supply grows about 0.8% a year.",
        ],
        notes: ["Issuance ≈ 166.3 × √(staked ETH) per year. 2023 fees ≈ 3,600 ETH/day, spring 2026 ≈ 300 (Coin Metrics)."],
      },
    ],
  },
  {
    label: "Layer 2: pack the bus",
    title: "Layer 2: pack the bus",
    question: "If Ethereum is expensive, how did Lan's contract cost only cents?",
    figure: "Hundreds of small transactions are packed into one sealed crate on a side road, and only the crate rides the main Ethereum bus.",
    takeaway: "Layer-2 networks bundle many transactions and post the bundle to Ethereum. Users get cents-level fees with Ethereum's security behind them — at the price of new trade-offs.",
    beats: [
      {
        title: "Instead of one seat each, share a crate.",
        body: [
          "Layer-2 networks (like Arbitrum or Base) collect hundreds of transactions, pack them into one bundle, and post it to Ethereum. The bus fare is split among everyone in the crate.",
        ],
      },
      {
        title: "2024: a special cheap lane.",
        body: ["The Dencun upgrade added 'blobs', a cheaper space just for these bundles. Fees on Layer 2 dropped to cents — and Fusaka in December 2025 added more room."],
      },
      {
        title: "Trade-offs.",
        body: [
          "Many Layer 2s are still run by one company that orders transactions. And because users pay Layer 2 instead of the main chain, less fee money is burned on Ethereum — part of why supply grew again.",
        ],
      },
    ],
  },
  {
    label: "Bitcoin vs Ethereum",
    title: "Bitcoin vs Ethereum",
    question: "If Bitcoin is digital gold, what is Ethereum?",
    figure: "Bitcoin and Ethereum side by side: what each is for, how many coins exist, how often a block is added, how the network is secured, how big each is and how each price did over the past year.",
    takeaway: "Bitcoin does one job — scarce digital money — and changes very slowly. Ethereum is a programmable platform that keeps upgrading. Different goals, different risks.",
    beats: [
      {
        title: "Same idea at the start, different goals.",
        body: [
          "Both are shared records that nobody owns. Bitcoin is built to be simple, scarce money. Ethereum is built to run programs — and ETH is the fuel.",
          "The table below puts them side by side.",
        ],
      },
      {
        title: "Neither one is 'better'.",
        body: [
          "Bitcoin's strength is that it barely changes; its supply is fixed at 21 million. Ethereum's strength is that it can do much more; its supply has no fixed cap and depends on use. In the year to 13 November 2026, both prices fell — Bitcoin about 31%, ETH about 40%.",
        ],
        notes: ["Prices: Fortune, 13 Nov 2026. Bitcoin supply: 20 millionth coin mined 9 Mar 2026 (The Block)."],
      },
    ],
  },
  {
    label: "Reality check",
    title: "Reality check",
    question: "What is strong, what is risky — and what does that mean for ETH?",
    figure: "A balance beam: strengths on one side, risks on the other, with the 2026 price line beneath.",
    takeaway: "Ethereum is the most-used platform for smart contracts and digital dollars. It also faces hacks around it, strong competitors and concentration — and the price can fall a lot. Both are true.",
    beats: [
      {
        title: "What's strong.",
        body: [
          "Running since 2015 without stopping. The largest home for smart contracts and digital dollars — around $157 billion in stablecoins in mid-2026, about half the market. About a third of all ETH staked to secure it.",
        ],
        notes: ["Axis Intelligence, June 2026; KuCoin, Aug 2026."],
      },
      {
        title: "What's risky.",
        body: [
          "Hacks around the network: in February 2025 about $1.5 billion of ETH was stolen from the exchange Bybit. Competitors like Solana are faster and cheaper. Staking is concentrated in a few big providers. And ETH was about 40% lower in November 2026 than a year before.",
        ],
        notes: ["FBI via TechTarget, Feb 2025; Fortune, 13 Nov 2026."],
      },
      {
        title: "Both are true at once.",
        body: [
          "The network kept running through every crash in this story — but that never protected anyone who bought ETH at a peak.",
          "If you are thinking about ETH, ask what you would be relying on: people using the network, fees flowing back to ETH, or simply the price going up. Those are three different bets.",
        ],
      },
    ],
  },
  {
    label: "Back to Lan",
    title: "Back to Lan",
    question: "So — did Lan get paid?",
    figure: "The ETH coin assembles from its logo pieces. Drag to rotate it.",
    takeaway: "Ethereum turns agreements into code that runs on a computer nobody owns. That is powerful and also unforgiving. Understanding both sides is the point.",
    beats: [
      {
        title: "Anna approved. $500 reached Lan in seconds, for a few cents in fees.",
        body: ["No platform cut, no waiting for a bank transfer. The contract did what it promised — on a Layer-2 network secured by Ethereum."],
      },
      {
        title: "Not magic.",
        body: [
          "Lan still needs a wallet she protects, and a way to turn digital dollars into đồng. A bug or a lost password can't be called back. Ethereum removes the middleman — it also removes the help desk.",
        ],
      },
      {
        title: "One coin, the whole story.",
        body: ["Drag the ETH coin to turn it. Or use the chapter list at the top to jump back to any part of the story."],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Ai làm trước?",
    title: "Ai làm trước?",
    question: "Hai người lạ ở hai đầu thế giới làm sao tin nhau trong chuyện tiền bạc?",
    figure: "Lan, nhà thiết kế ở Đà Nẵng, và Anna, chủ tiệm bánh ở Berlin, đứng hai bên tấm bản đồ. Một hợp đồng logo 500 USD nằm giữa, và ai cũng chờ người kia làm trước.",
    takeaway: "Giữa hai người lạ, phải có người chịu rủi ro trước — hoặc nhờ bên trung gian giữ tiền. Ethereum đặt câu hỏi: nếu 'bên trung gian' là một chương trình nhỏ không ai sở hữu thì sao?",
    beats: [
      {
        title: "Không cần biết gì về crypto. Ta bắt đầu bằng một cái logo 500 USD.",
        body: ["Lan là nhà thiết kế đồ hoạ ở Đà Nẵng. Anna có một tiệm bánh nhỏ ở Berlin và cần logo mới. Hai người chưa từng gặp nhau. Hãy cuộn xuống — hình bên phải sẽ kể câu chuyện."],
      },
      {
        title: "Bài toán lâu đời nhất của buôn bán: ai làm trước?",
        body: ["Nếu Anna trả tiền trước, Lan có thể biến mất. Nếu Lan làm trước, Anna có thể lấy logo rồi không trả. Ai cũng đang bảo người kia chịu rủi ro."],
      },
      {
        title: "Nên họ nhờ bên trung gian — và phải trả phí.",
        body: [
          "Nền tảng freelance giữ tiền của Anna và chỉ chuyển cho Lan khi xong việc. Cách này ổn, nhưng tốn: Upwork thu của freelancer 0–15% mỗi hợp đồng, Fiverr giữ lại 20% mỗi đơn.",
          "Nền tảng cũng là người đặt luật — có thể khoá tài khoản, đổi mức phí, hay phân xử tranh chấp.",
        ],
        notes: ["Trung tâm trợ giúp Upwork và Fiverr, theo tổng hợp của Lilach Bullock, 10/2026."],
      },
      {
        title: "Bốn cách thanh toán — xem lần lượt từng cách.",
        body: [
          "1. Anna trả trước — Anna chịu rủi ro. 2. Lan làm trước — Lan chịu rủi ro. 3. Dùng nền tảng — an toàn cho cả hai, nhưng mất 100 USD trong 500 USD với mức 20% của Fiverr.",
          "4. Hợp đồng thông minh — luật viết bằng code, phí vài xu. Phần còn lại của câu chuyện sẽ giải thích cách nó hoạt động.",
        ],
      },
    ],
  },
  {
    label: "Chiếc máy tính không ai sở hữu",
    title: "Chiếc máy tính không ai sở hữu",
    question: "Đã có Bitcoin rồi. Sao còn phải làm cái mới?",
    figure: "Một máy tính bỏ túi ghi Bitcoin cạnh một máy tính ghi Ethereum; rồi một máy bán hàng tự động nhận đồng xu và nhả gói bánh mà không cần người bán.",
    takeaway: "Ethereum là một chiếc máy tính chung do hàng nghìn người cùng vận hành. Các chương trình trên đó — hợp đồng thông minh — tự chạy theo luật đã viết, và ETH là nhiên liệu để trả cho việc chạy chúng.",
    beats: [
      {
        title: "2013: ý tưởng của một chàng trai 19 tuổi.",
        body: ["Vitalik Buterin đang viết bài về Bitcoin. Bitcoin giống cái máy tính bỏ túi: rất giỏi đúng một việc — chuyển coin. Anh tự hỏi: nếu blockchain là một chiếc máy tính đầy đủ, chạy được mọi chương trình thì sao?"],
      },
      {
        title: "Hợp đồng thông minh là máy bán hàng tự động cho các thoả thuận.",
        body: [
          "Bỏ xu vào, bấm B4, nhận gói bánh. Không có người bán quyết định — luật của cái máy quyết định. Hợp đồng thông minh là ý tưởng đó viết bằng code: 'nếu chuyện này xảy ra, thì chuyển khoản tiền kia'.",
          "Khi đã nằm trên Ethereum, không ai — kể cả người viết — có thể lén sửa luật.",
        ],
      },
      {
        title: "2014–2015: công chúng góp vốn, rồi bật máy.",
        body: ["Trong đợt bán trực tuyến năm 2014, mọi người gửi khoảng 31.000 BTC (khoảng 18 triệu USD lúc đó) và nhận hơn 60 triệu ETH. Ngày 30/7/2015, mạng chính thức chạy."],
        deep: ["Một tổ chức phi lợi nhuận, Ethereum Foundation, tài trợ nghiên cứu. Nhưng họ không vận hành mạng: hàng nghìn máy tính độc lập mới là bên vận hành, và họ tự chọn phần mềm để chạy."],
      },
      {
        title: "ETH là nhiên liệu.",
        body: ["Mọi thao tác trên chiếc máy tính chung này đều tốn một khoản phí nhỏ, trả bằng ETH. Đó là lý do ETH tồn tại — không phải 'cổ phần của Ethereum', mà là nhiên liệu trả cho những máy tính đang làm việc."],
      },
    ],
  },
  {
    label: "Mười một năm tua nhanh",
    title: "Mười một năm tua nhanh",
    question: "Từ 2015 đến nay, chuyện gì đã thực sự xảy ra với Ethereum?",
    figure: "Giá ETH từ 2015 đến 2026 theo thang log, tự vẽ ra khi thanh thời gian chạy; mỗi sự kiện bùng lên khi được vượt qua — đỏ cho hack và sập giá, trắng cho đỉnh, xanh cho nâng cấp.",
    takeaway: "Ethereum đã sống sót qua vụ hack làm cộng đồng tách đôi, hai chu kỳ bùng nổ rồi sụp đổ, và một lần thay toàn bộ 'động cơ'. Công nghệ liên tục tiến bộ — nhưng giá chưa bao giờ đi theo đường thẳng.",
    beats: [
      {
        title: "2015–2017: thử thách lớn đầu tiên.",
        body: ["Chưa đầy một năm, một hợp đồng nổi tiếng tên The DAO bị rút sạch vì một lỗi code. Cộng đồng bỏ phiếu đảo ngược — và tách thành Ethereum và Ethereum Classic."],
      },
      {
        title: "2017–2020: bùng nổ, sụp đổ, và 'mùa hè DeFi'.",
        body: ["Các start-up gọi hàng tỷ USD bằng cách bán token trên Ethereum, rồi phần lớn thất bại. Đến 2020, các ứng dụng cho vay và giao dịch không cần ngân hàng bắt đầu bùng nổ thật sự."],
      },
      {
        title: "2021–2023: đốt phí và thay động cơ.",
        body: ["Từ 2021, phí bắt đầu bị đốt. Năm 2022, 'The Merge' thay đào coin bằng staking — trong khi mạng vẫn chạy bình thường."],
      },
      {
        title: "2024–2026: rẻ hơn, phổ biến hơn, biến động hơn.",
        body: ["Quỹ ETF, mạng Layer 2 giá rẻ, và mức đóng cửa kỷ lục gần 4.830 USD vào tháng 8/2025. Đến tháng 11/2026, ETH lại xuống dưới 2.000 USD."],
        notes: ["Giá: giá đóng cửa ngày của Coin Metrics đến 23/5/2026, sau đó là số liệu báo chí có ghi ngày (nét đứt)."],
      },
    ],
  },
  {
    label: "Hợp đồng hoạt động thế nào",
    title: "Hợp đồng hoạt động thế nào",
    question: "Một hợp đồng thông minh thực sự sẽ làm gì cho Lan và Anna?",
    figure: "Một chiếc hộp trong suốt giữa Lan và Anna giữ 500 USD tiền số. Ba điều luật lần lượt sáng lên khi kịch bản diễn ra, và tiền chảy về người mà luật chỉ định.",
    takeaway: "Hợp đồng giữ tiền và làm đúng từng chữ theo luật — không công ty nào đứng giữa, không thu phí phần trăm. Nhưng nó chỉ phán xử được những gì code kiểm tra được.",
    beats: [
      {
        title: "Anna khoá 500 USD vào hợp đồng — không đưa Lan, không đưa nền tảng.",
        body: ["Cô dùng stablecoin: đồng đô la số luôn giữ giá 1 USD, nên không ai phải lo giá ETH lên xuống. Tiền giờ nằm trong một chương trình nhỏ trên Ethereum mà ai cũng xem được."],
      },
      {
        title: "Ba điều luật, viết sẵn từ trước:",
        body: [
          "1. Nếu Anna bấm 'duyệt', 500 USD chuyển cho Lan.",
          "2. Nếu Lan đã giao bài và Anna im lặng 7 ngày, 500 USD vẫn chuyển cho Lan.",
          "3. Nếu đến hạn mà không có gì được giao, 500 USD trả lại cho Anna.",
        ],
        deep: ["Hợp đồng ký quỹ thực tế thường thêm một người thứ ba làm trọng tài khi tranh chấp. Người đó có thể là bất kỳ ai hai bên đồng ý — nhưng lúc đó bạn lại đang tin vào một con người."],
      },
      {
        title: "Ba kết cục, lần lượt diễn ra.",
        body: [
          "Anna duyệt sau hai ngày → luật 1 trả tiền cho Lan. Anna im lặng → sau 7 ngày luật 2 vẫn trả cho Lan. Lan không giao bài → đến hạn luật 3 hoàn tiền cho Anna.",
          "Không có nhân viên công ty nào bấm nút. Phí là vài xu, không tính theo phần trăm.",
        ],
      },
      {
        title: "Giới hạn, nói thật.",
        body: ["Code không biết logo có đẹp hay không — chỉ biết file có được giao đúng hạn hay không. Và lỗi trong code là lỗi vĩnh viễn: đó chính là chuyện đã xảy ra với The DAO."],
      },
    ],
  },
  {
    label: "Một cuốn sổ, hàng nghìn bản sao",
    title: "Một cuốn sổ, hàng nghìn bản sao",
    question: "Hợp đồng này nằm ở đâu, và ai vận hành nó?",
    figure: "Một cuốn sổ chung được chép giống hệt lên hàng nghìn máy tính khắp thế giới; cứ 12 giây có thêm một trang mới và mọi bản sao cùng cập nhật.",
    takeaway: "Ethereum là một bản ghi chung do hàng nghìn máy tính cùng giữ. Cứ 12 giây có thêm một trang (khối). Hợp đồng chỉ là các mục trong bản ghi đó — nên ai cũng kiểm tra được.",
    beats: [
      {
        title: "Hãy tưởng tượng một cuốn sổ mà hàng nghìn người cùng giữ bản sao giống hệt nhau.",
        body: ["Mọi số dư và mọi hợp đồng đều ghi trong đó. Nếu một bản bị sửa lén, nó sẽ không khớp với các bản khác — và bị bỏ qua."],
      },
      {
        title: "Cứ 12 giây, thêm một trang.",
        body: ["Giao dịch mới được gom vào một 'khối' — một trang của cuốn sổ — rồi nối vào cuối. Các trang móc nối với nhau, nên không thể sửa trang cũ mà không làm đứt cả chuỗi."],
      },
      {
        title: "Hợp đồng của Lan và Anna là một mục trong cuốn sổ đó.",
        body: ["Khi Anna bấm 'duyệt', mọi máy tính cùng chạy một đoạn code và ra cùng một kết quả. Vì vậy không ai cần tin vào một công ty duy nhất."],
      },
      {
        title: "Nhưng chạy code trên hàng nghìn máy tính thì tốn kém.",
        body: ["Điều gì ngăn ai đó tải lên một chương trình chạy vòng lặp mãi mãi làm kẹt cả mạng? Câu trả lời là phí — gọi là gas."],
      },
    ],
  },
  {
    label: "Gas: giá vé xe",
    title: "Gas: giá vé xe",
    question: "Vì sao Ethereum lúc thì rẻ, lúc lại rất đắt?",
    figure: "Các khối được vẽ như những chuyến xe buýt rời bến mỗi 12 giây. Xe đầy thì giá vé tăng, xe vắng thì giá giảm; phần giá vé cơ bản bị đốt trong một ngọn lửa nhỏ.",
    takeaway: "Mỗi khối là một chuyến xe có số ghế giới hạn. Giá vé cơ bản tăng khi xe đầy và giảm khi xe vắng — và phần giá đó bị đốt, không trả cho ai cả.",
    beats: [
      {
        title: "Hãy coi mỗi khối là một chuyến xe buýt rời bến mỗi 12 giây.",
        body: ["Số ghế có hạn. 'Gas' đo xem giao dịch của bạn cần bao nhiêu công sức — chuyển ETH đơn giản tốn 21.000 gas, hợp đồng phức tạp tốn nhiều hơn."],
      },
      {
        title: "Vé có hai phần.",
        body: [
          "Phí cơ bản được đặt tự động: nếu chuyến trước đầy hơn một nửa, phí tăng (tối đa 12,5%); nếu vắng hơn, phí giảm. Phần này bị đốt — biến mất vĩnh viễn.",
          "Tiền tip là tuỳ chọn, trả cho người xếp khối, để bạn được lên xe nhanh hơn.",
        ],
        notes: ["EIP-1559 (8/2021). Đã đơn giản hoá: khối thực tế nhắm mức đầy 50%."],
      },
      {
        title: "Xem một giờ cao điểm.",
        body: [
          "Mười hai chuyến xe gần như kín chỗ liên tiếp: phí cơ bản tăng khoảng 10% mỗi khối — gấp hơn ba lần chỉ trong chưa đầy 3 phút. Hết cao điểm, phí lại trượt xuống nhanh như vậy.",
          "Năm 2026, chuyển tiền đơn giản tốn vài xu. Năm 2021 đông đúc, thường tốn vài đô la.",
        ],
        notes: ["Mô hình đơn giản: phí khởi điểm 1 gwei, giá ETH 1.954 USD (13/11/2026)."],
      },
    ],
  },
  {
    label: "Staking: tiền cọc cho sự trung thực",
    title: "Staking: tiền cọc cho sự trung thực",
    question: "Không còn thợ đào, ai giữ cho cuốn sổ trung thực?",
    figure: "Mỗi validator khoá 32 ETH làm tiền cọc; cứ 12 giây một người được chọn ngẫu nhiên đề xuất trang mới trong khi những người khác bỏ phiếu; tiền cọc của kẻ gian lận co lại màu đỏ.",
    takeaway: "Validator khoá ETH làm tiền cọc. Làm đúng thì được thưởng chút ít; mất kết nối thì bị trừ chút ít; gian lận thì mất nhiều. Tiền của chính bạn là thứ bảo đảm cho hành vi của bạn.",
    beats: [
      {
        title: "Muốn tham gia vận hành Ethereum, bạn phải đặt cọc.",
        body: [
          "Một 'validator' khoá 32 ETH. Cứ 12 giây, một validator được chọn ngẫu nhiên để đề xuất trang tiếp theo; những người khác kiểm tra và bỏ phiếu.",
          "Khoảng 41,4 triệu ETH — chừng một phần ba tổng số ETH — đang được stake vào tháng 8/2026.",
        ],
        notes: ["KuCoin / The Block, 8/2026."],
      },
      {
        title: "Củ cà rốt và cây gậy.",
        body: ["Validator trung thực nhận ETH mới — khoảng 2,8%/năm vào tháng 8/2026. Mất kết nối bị phạt nhỏ. Ký hai trang mâu thuẫn nhau ('slashing') bị đốt một phần tiền cọc và bị loại."],
        deep: ["Phần lớn mọi người không tự chạy validator. Họ stake qua sàn hoặc các pool như Lido — nơi nắm khoảng 23% tổng ETH đang stake năm 2026, một rủi ro tập trung đang gây tranh luận."],
      },
      {
        title: "Một năm, ba validator.",
        body: [
          "Validator trung thực kết thúc gần 32,9 ETH. Validator mất kết nối một phần năm thời gian kết thúc gần 32,5. Validator ký hai lần vào ngày 120 bị slashing, mất khoảng 1,7 ETH và bị loại.",
        ],
        notes: ["Đơn giản hoá: ≈2,8%/năm; mức phạt thật phụ thuộc số validator bị phạt cùng lúc."],
      },
    ],
  },
  {
    label: "DeFi: ngân hàng bằng code",
    title: "DeFi: ngân hàng bằng code",
    question: "Có vay được tiền mà không cần ngân hàng, không cần thẩm định tín dụng?",
    figure: "Một chiếc cân: ETH thế chấp một bên, đô la vay một bên. Khi giá ETH giảm, cân nghiêng dần về vạch thanh lý màu đỏ.",
    takeaway: "Cho vay DeFi dựa trên thế chấp vượt mức: bạn khoá nhiều hơn số vay. Nếu tài sản thế chấp giảm giá quá sâu, code tự động bán nó — không gọi điện báo, không nương tay.",
    beats: [
      {
        title: "Gửi ETH vào, rút đô la ra.",
        body: ["Trên các ứng dụng cho vay như Aave, bạn gửi ETH làm tài sản thế chấp và vay stablecoin. Không giấy tờ, không điểm tín dụng — code chỉ kiểm tra các con số."],
      },
      {
        title: "Điều kiện: lúc nào cũng phải thế chấp dư.",
        body: ["Bạn vay được tối đa khoảng 80% giá trị ETH. Nếu ETH giảm khiến khoản nợ chạm khoảng 83% giá trị đó, bất kỳ ai cũng có thể trả bớt nợ giúp bạn và lấy ETH của bạn với giá chiết khấu (khoảng 5%). Đó là 'thanh lý'."],
        notes: ["Giá trị làm tròn, tương tự Aave v3 cho ETH; thông số thật khác nhau theo thị trường và thay đổi theo thời gian."],
        deep: ["'Chỉ số sức khoẻ' = tài sản thế chấp × 83% ÷ khoản nợ. Trên 1 là an toàn; bằng hoặc dưới 1 thì có thể bị thanh lý."],
      },
      {
        title: "Xem giá rơi.",
        body: [
          "Một người gửi 5 ETH (khoảng 9.770 USD) và vay 4.690 USD. Khi ETH trượt từ 1.954 USD về phía 1.130 USD, chỉ số sức khoẻ giảm từ 1,73 xuống dưới 1 — và code cho phép người khác trả nửa khoản nợ, lấy ETH với giá chiết khấu.",
        ],
      },
    ],
  },
  {
    label: "Lần theo dòng tiền",
    title: "Lần theo dòng tiền",
    question: "Dùng Ethereum nhiều có làm ETH khan hiếm hơn — hay nhiều hơn?",
    figure: "Phí chia thành ngọn lửa bị đốt và tiền tip; ETH mới chảy về người stake; một chiếc bập bênh cân ETH tạo ra với ETH bị đốt, phía trên đường tổng cung thật từ sau The Merge.",
    takeaway: "ETH mới được tạo ra cho người stake, còn phí cơ bản của mọi giao dịch bị đốt. Mạng đông → đốt nhiều. Mạng vắng → tổng cung tăng. Cả hai điều đó không nói lên giá.",
    beats: [
      {
        title: "Hai cái vòi: một cái xả vào, một cái rút ra.",
        body: [
          "Xả vào: mỗi ngày có ETH mới được tạo ra để thưởng người stake. Rút ra: phí cơ bản của mọi giao dịch bị đốt.",
          "Mạng đông thì lượng rút có thể lớn hơn lượng xả — tổng cung giảm. Mạng vắng thì tổng cung tăng.",
        ],
      },
      {
        title: "Điều thực sự đã xảy ra từ sau The Merge.",
        body: ["Tổng cung khoảng 120,5 triệu ETH lúc The Merge, giảm còn khoảng 120,0 triệu đầu 2024, rồi tăng lại lên khoảng 121,7 triệu vào tháng 5/2026 khi các mạng Layer 2 giá rẻ làm phí trên chuỗi chính giảm."],
        notes: ["Coin Metrics, đến 23/5/2026. Các trang theo dõi khác nhau cho số tổng cung hơi khác nhau."],
      },
      {
        title: "Bốn khái niệm người ta hay lẫn lộn.",
        body: [
          "Mạng thành công (nhiều người dùng) ≠ mạng có doanh thu (phí được trả) ≠ giá trị token (giá ETH) ≠ lợi nhuận người nắm giữ (bạn mua ở giá nào). Mỗi thứ có thể đi một hướng.",
        ],
      },
      {
        title: "Một năm đông và một năm vắng.",
        body: [
          "Như 2023 — khoảng 20 triệu ETH stake và ~3.000 ETH bị đốt mỗi ngày: đốt nhiều hơn tạo ra, tổng cung giảm nhẹ (≈ −0,3%/năm).",
          "Như 2026 — 41 triệu stake và ~300 ETH bị đốt mỗi ngày: tổng cung tăng khoảng 0,8%/năm.",
        ],
        notes: ["Phát hành ≈ 166,3 × √(ETH stake) mỗi năm. Phí 2023 ≈ 3.600 ETH/ngày, mùa xuân 2026 ≈ 300 (Coin Metrics)."],
      },
    ],
  },
  {
    label: "Layer 2: gom hàng lên xe",
    title: "Layer 2: gom hàng lên xe",
    question: "Nếu Ethereum đắt, sao hợp đồng của Lan chỉ tốn vài xu?",
    figure: "Hàng trăm giao dịch nhỏ được đóng vào một thùng hàng niêm phong trên đường nhánh, và chỉ cái thùng đó lên chuyến xe chính của Ethereum.",
    takeaway: "Mạng Layer 2 gom nhiều giao dịch rồi gửi cả gói lên Ethereum. Người dùng trả phí vài xu mà vẫn có Ethereum bảo vệ phía sau — đổi lại là những đánh đổi mới.",
    beats: [
      {
        title: "Thay vì mỗi người một ghế, hãy chung một thùng hàng.",
        body: ["Các mạng Layer 2 (như Arbitrum hay Base) gom hàng trăm giao dịch, đóng thành một gói rồi gửi lên Ethereum. Tiền vé được chia cho tất cả mọi người trong thùng."],
      },
      {
        title: "2024: một làn đường giá rẻ riêng.",
        body: ["Bản nâng cấp Dencun thêm 'blob', một không gian rẻ hơn dành riêng cho các gói này. Phí trên Layer 2 giảm xuống vài xu — và Fusaka tháng 12/2025 mở rộng thêm."],
      },
      {
        title: "Đánh đổi.",
        body: ["Nhiều mạng Layer 2 vẫn do một công ty sắp xếp thứ tự giao dịch. Và vì người dùng trả phí cho Layer 2 thay vì chuỗi chính, ít phí bị đốt trên Ethereum hơn — một phần lý do tổng cung tăng trở lại."],
      },
    ],
  },
  {
    label: "Bitcoin và Ethereum",
    title: "Bitcoin và Ethereum",
    question: "Nếu Bitcoin là vàng số, thì Ethereum là gì?",
    figure: "Bitcoin và Ethereum đặt cạnh nhau: dùng để làm gì, có bao nhiêu coin, bao lâu thêm một khối, mạng được bảo vệ ra sao, quy mô mỗi bên và giá mỗi bên đã đi thế nào trong năm qua.",
    takeaway: "Bitcoin làm một việc — tiền số khan hiếm — và thay đổi rất chậm. Ethereum là nền tảng lập trình được và liên tục nâng cấp. Mục tiêu khác nhau, rủi ro khác nhau.",
    beats: [
      {
        title: "Cùng ý tưởng ban đầu, khác mục tiêu.",
        body: [
          "Cả hai đều là bản ghi chung không ai sở hữu. Bitcoin được thiết kế làm tiền đơn giản, khan hiếm. Ethereum được thiết kế để chạy chương trình — và ETH là nhiên liệu.",
          "Bảng dưới đây đặt hai bên cạnh nhau.",
        ],
      },
      {
        title: "Không bên nào 'tốt hơn'.",
        body: [
          "Điểm mạnh của Bitcoin là gần như không thay đổi; tổng cung cố định 21 triệu. Điểm mạnh của Ethereum là làm được nhiều hơn; tổng cung không có trần cố định và phụ thuộc mức sử dụng. Trong năm tính đến 13/11/2026, giá cả hai đều giảm — Bitcoin khoảng 31%, ETH khoảng 40%.",
        ],
        notes: ["Giá: Fortune, 13/11/2026. Tổng cung Bitcoin: coin thứ 20 triệu được đào ngày 9/3/2026 (The Block)."],
      },
    ],
  },
  {
    label: "Nhìn thẳng thực tế",
    title: "Nhìn thẳng thực tế",
    question: "Điều gì mạnh, điều gì rủi ro — và điều đó có ý nghĩa gì với ETH?",
    figure: "Một thanh cân: điểm mạnh một bên, rủi ro một bên, với đường giá năm 2026 bên dưới.",
    takeaway: "Ethereum là nền tảng được dùng nhiều nhất cho hợp đồng thông minh và đô la số. Nó cũng đối mặt với các vụ hack xung quanh, đối thủ mạnh và rủi ro tập trung — và giá có thể giảm rất sâu. Cả hai điều đều đúng.",
    beats: [
      {
        title: "Điểm mạnh.",
        body: ["Chạy liên tục từ 2015, chưa từng dừng. Nơi lớn nhất cho hợp đồng thông minh và đô la số — khoảng 157 tỷ USD stablecoin giữa năm 2026, chừng một nửa thị trường. Khoảng một phần ba tổng ETH đang được stake để bảo vệ mạng."],
        notes: ["Axis Intelligence, 6/2026; KuCoin, 8/2026."],
      },
      {
        title: "Rủi ro.",
        body: ["Hack xung quanh mạng: tháng 2/2025, khoảng 1,5 tỷ USD ETH bị đánh cắp từ sàn Bybit. Đối thủ như Solana nhanh và rẻ hơn. Staking tập trung vào vài nhà cung cấp lớn. Và giá ETH tháng 11/2026 thấp hơn khoảng 40% so với một năm trước."],
        notes: ["FBI qua TechTarget, 2/2025; Fortune, 13/11/2026."],
      },
      {
        title: "Cả hai điều cùng đúng.",
        body: [
          "Mạng vẫn chạy qua mọi đợt sập giá trong câu chuyện này — nhưng điều đó chưa từng bảo vệ ai mua ETH ở đỉnh.",
          "Nếu bạn đang nghĩ đến ETH, hãy hỏi mình đang dựa vào điều gì: nhiều người dùng mạng, phí quay về ETH, hay đơn giản là giá tăng. Đó là ba ván cược khác nhau.",
        ],
      },
    ],
  },
  {
    label: "Quay lại với Lan",
    title: "Quay lại với Lan",
    question: "Vậy rốt cuộc Lan có được trả tiền không?",
    figure: "Đồng ETH ghép lại từ các mảnh logo. Kéo để xoay.",
    takeaway: "Ethereum biến thoả thuận thành code chạy trên một chiếc máy tính không ai sở hữu. Điều đó vừa mạnh mẽ vừa không khoan nhượng. Hiểu cả hai mặt mới là điều quan trọng.",
    beats: [
      {
        title: "Anna bấm duyệt. 500 USD đến tay Lan trong vài giây, phí vài xu.",
        body: ["Không bị nền tảng cắt phần trăm, không phải chờ chuyển khoản ngân hàng. Hợp đồng làm đúng như đã hứa — trên một mạng Layer 2 được Ethereum bảo vệ."],
      },
      {
        title: "Không phải phép màu.",
        body: ["Lan vẫn cần một chiếc ví tự bảo vệ, và một cách đổi đô la số sang tiền đồng. Lỗi code hay mất mật khẩu thì không gọi lại được. Ethereum bỏ đi người trung gian — và cũng bỏ luôn quầy hỗ trợ."],
      },
      {
        title: "Một đồng coin, cả câu chuyện.",
        body: ["Kéo đồng ETH để xoay. Hoặc dùng mục lục phía trên để quay lại bất kỳ phần nào của câu chuyện."],
      },
    ],
  },
];
