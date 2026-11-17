/** Story-driven copy (six acts). Generated from the content plan; edit freely. */
export type Beat = { title: string; body: string[]; notes?: string[]; deep?: string[] };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
 {
  "label": "Sending $200 home",
  "title": "Sending $200 home",
  "question": "Why does sending money to another country still cost so much?",
  "figure": "A sender in the United States and her mother in Mexico, joined by a chain of banks. The money hops from bank to bank and loses a little at each stop, while extra cash sits parked in accounts along the way.",
  "takeaway": "An international payment passes through several companies. Each takes a share, and some must keep cash parked abroad in advance. That is the problem XRP was built around.",
  "beats": [
   {
    "title": "Maria works in Texas. Every month she sends $200 to her mother in Mexico.",
    "body": [
     "Before any crypto, let's follow her money. Keep scrolling — the picture on the right shows where it goes."
    ]
   },
   {
    "title": "Her money doesn't fly straight there.",
    "body": [
     "Maria's bank usually has no direct link to her mother's bank. So the payment hops through partner banks (called correspondent banks), and the dollars are changed into pesos along the way."
    ],
    "deep": [
     "The banks send each other payment messages, often over the Swift network. The money itself moves between accounts that the banks hold at each other."
    ]
   },
   {
    "title": "Every stop takes a slice.",
    "body": [
     "Sending $200 abroad cost 6.3% on average in the third quarter of 2025 — about $12.60. Through a bank it averaged 14.9%. The world's target is 3% by 2030."
    ],
    "notes": [
     "World Bank, Remittance Prices Worldwide, Q3 2025 — global averages for sending $200."
    ]
   },
   {
    "title": "The hidden cost: money parked in advance.",
    "body": [
     "To pay out fast, a bank or payment company keeps money waiting in accounts in the other country — just in case. That cash sits idle instead of earning, and the cost ends up in the price customers pay."
    ],
    "deep": [
     "Speed has improved a lot: about 90% of payments on the Swift network reach the receiving bank within an hour. The slow and costly parts are often the last step, the currency exchange, and this parked money."
    ]
   }
  ]
 },
 {
  "label": "An idea older than Bitcoin",
  "title": "An idea older than Bitcoin",
  "question": "Who created XRP — and why?",
  "figure": "A web of friends passes IOUs along a chain; three engineers swap mining for agreement; 100 blocks appear for 100 billion XRP, and 80 of them move to a new company.",
  "takeaway": "XRP was built by engineers who wanted fast, cheap value transfer without mining. Most of it was given to the company that became Ripple — which is why Ripple and XRP are so often confused.",
  "beats": [
   {
    "title": "2004: money as a chain of trust.",
    "body": [
     "A Canadian programmer, Ryan Fugger, built RipplePay. Friends could pay each other through chains of IOUs — I owe you, you owe her — without a bank in the middle."
    ]
   },
   {
    "title": "2011: like Bitcoin, but without mining.",
    "body": [
     "Engineers David Schwartz, Jed McCaleb and Arthur Britto liked Bitcoin but saw how much energy mining wasted. They designed a shared ledger where trusted computers simply agree on each new page."
    ]
   },
   {
    "title": "June 2012: the XRP Ledger goes live.",
    "body": [
     "All 100 billion XRP were created on day one. There is no mining and no way to print more."
    ],
    "notes": [
     "Each block in the picture = 1 billion XRP."
    ]
   },
   {
    "title": "80 billion XRP go to a company.",
    "body": [
     "In September 2012 the founders started a company with Chris Larsen — first NewCoin, then OpenCoin, now Ripple — and gave it 80 billion XRP to build uses for it. Keep the three names apart: XRP is the currency, the XRP Ledger is the open network, Ripple is a private company."
    ],
    "deep": [
     "Ripple uses the XRP it holds to fund its business and grow the market. How and when it sold that XRP later became the center of a long court case — that's the next chapter."
    ]
   }
  ]
 },
 {
  "label": "The journey",
  "title": "Fourteen years on one line",
  "question": "What happened to XRP between 2012 and today?",
  "figure": "A timeline from 2012 to 2026. XRP's price draws itself as a line, and markers burst as the events that shaped the project go by.",
  "takeaway": "XRP's story is bank partnerships, booms, a long court case and a cleared path — but real progress and the price have often moved in different directions.",
  "beats": [
   {
    "title": "2012–2016: a startup that talks to banks.",
    "body": [
     "Ripple pitched its tools to banks and payment firms. In May 2015 it paid a $700,000 penalty to US regulators for selling XRP without the required anti-money-laundering controls — the first case of its kind."
    ]
   },
   {
    "title": "2017–2018: a boom, and a lock on the supply.",
    "body": [
     "As crypto boomed, XRP's daily price went from under a cent to about $2.75 in January 2018. Ripple locked 55 billion XRP in escrow, and in October 2018 launched a service that uses XRP to move money between countries."
    ]
   },
   {
    "title": "2020–2023: the lawsuit years.",
    "body": [
     "In December 2020 the US SEC sued Ripple, saying its XRP sales were unregistered securities offerings. Many US exchanges stopped trading XRP. In July 2023 a judge ruled that XRP sold on public exchanges was not a security — but direct sales to big investors were."
    ]
   },
   {
    "title": "2024–2026: case closed — price still swinging.",
    "body": [
     "The case ended in August 2025 with a $125 million penalty. Ripple launched the RLUSD dollar token, US spot XRP funds opened in November 2025, and real-world assets grew on the ledger. Yet on 14 November 2026 XRP closed below $1, its lowest since 2024."
    ],
    "notes": [
     "Prices: Coin Metrics daily closes to 23 May 2026, then dated news reports."
    ],
    "deep": [
     "A ruling, a product or a fund launch can happen at the same time as a price move. That doesn't prove one caused the other — crypto prices also follow Bitcoin, interest rates and investors' mood."
    ]
   }
  ]
 },
 {
  "label": "Open it up",
  "title": "So what is XRP, exactly?",
  "figure": "A drawn coin turns, splits into thin layers, breaks into thousands of dots and re-forms as a network of accounts.",
  "takeaway": "XRP is a balance in a shared public record (the XRP Ledger). Ripple is a company, not the network.",
  "beats": [
   {
    "title": "Let's open up the coin.",
    "body": [
     "Now you know where XRP came from. Time to look inside — no crypto knowledge needed, just keep scrolling."
    ]
   },
   {
    "title": "XRP is a number in a shared record book.",
    "body": [
     "XRP is the digital currency of the XRP Ledger (XRPL). There is no physical coin and no file. Your XRP is simply a balance written in a public record book that many computers around the world keep identical."
    ],
    "notes": [
     "The smallest amount is 0.000001 XRP (called a 'drop')."
    ]
   },
   {
    "title": "XRP, XRPL and Ripple are three different things.",
    "body": [
     "XRP is the currency. XRPL is the public network that records it — anyone can use it and no single company runs it. Ripple is a private company that builds products on top and owns a lot of XRP. Ripple cannot approve or block payments on the ledger."
    ]
   },
   {
    "title": "From coin to records.",
    "body": [
     "The layers you just saw are ideas, not parts: records, checks, rules and markets. Take away the picture of a coin and what is left is a list of accounts and their balances."
    ]
   }
  ],
  "question": "If XRP isn't a coin you can hold, what is it?"
 },
 {
  "label": "Inside the ledger",
  "title": "Inside the ledger",
  "figure": "Account circles connected to servers. One account signs a payment and it is passed from server to server.",
  "takeaway": "Accounts hold balances, a signature proves the payment is yours, and servers pass it around.",
  "beats": [
   {
    "title": "Every account is a line in the book.",
    "body": [
     "Each account has an address (like an email address for money) and a balance. To open an account you must keep a small minimum — 1 XRP today — so nobody can flood the book with empty accounts.",
     "Tap or hover a circle to look inside. All values are made up for the demo."
    ]
   },
   {
    "title": "Signing = your digital signature.",
    "body": [
     "To send XRP you create a payment and sign it with your secret key. Anyone can check the signature is real, but nobody ever sees the key. If you lose the key, nobody can recover it for you."
    ]
   },
   {
    "title": "The message spreads.",
    "body": [
     "The signed payment goes to any XRPL server. The server checks it and passes it on to others. In a moment, much of the network has heard about it."
    ]
   },
   {
    "title": "Heard about is not done.",
    "body": [
     "At this point the payment is only waiting. It counts once the network agrees on it — that's the next chapter."
    ]
   }
  ],
  "question": "Where is my XRP actually kept?"
 },
 {
  "label": "Agreement without mining",
  "title": "Agreement without mining",
  "figure": "A ring of validators compares notes until 80% agree; the waiting payment becomes part of a confirmed page in the record book.",
  "takeaway": "Trusted validators agree every few seconds. 80% agreement = confirmed and final. No mining.",
  "beats": [
   {
    "title": "No mining. No staking.",
    "body": [
     "Bitcoin uses mining; many other networks use staking. The XRP Ledger uses neither. A group of servers called validators simply compare notes and agree on which payments to accept. They earn no reward for it."
    ]
   },
   {
    "title": "Each server picks validators it trusts.",
    "body": [
     "Every server keeps a list of validators it trusts not to cheat. Most use a recommended list, but anyone can change theirs. The dashed lines show the list of one server."
    ],
    "deep": [
     "Each server's list of trusted validators is called a UNL (Unique Node List). The XRP Ledger Foundation and others publish recommended lists; every operator can choose their own."
    ]
   },
   {
    "title": "Agreement at 80%.",
    "body": [
     "Validators compare their lists of payments a few times, quickly setting aside anything disputed. When at least 80% of the trusted validators agree, the decision is made. No single company decides."
    ]
   },
   {
    "title": "Confirmed means final.",
    "body": [
     "Every 3–5 seconds a new page of the record book is confirmed. Once confirmed it cannot be changed. If 80% agreement can't be reached, the network pauses instead of splitting in two."
    ]
   }
  ],
  "question": "Who decides which payments are real — without a bank?"
 },
 {
  "label": "Send XRP",
  "title": "Send XRP",
  "figure": "Two demo wallets. Press play to watch a payment get signed, agreed, confirmed, and the tiny fee burned.",
  "takeaway": "Sign → share → agree → confirm → balances change → fee burned. It takes a few seconds.",
  "beats": [
   {
    "title": "Try it: send XRP.",
    "body": [
     "Two pretend wallets with pretend money. Choose an amount and press play to follow one payment from start to finish."
    ]
   },
   {
    "title": "Why a fee if it's so tiny?",
    "body": [
     "Every payment burns a tiny fee — normally 0.00001 XRP. It isn't paid to anyone; it simply disappears. That makes spamming the network expensive while keeping normal use almost free. Each wallet also keeps its 1 XRP minimum."
    ]
   }
  ],
  "question": "What happens when you press 'send'?"
 },
 {
  "label": "Back to Maria's $200",
  "title": "Back to Maria's $200",
  "figure": "A map of the United States and Mexico with a payment route from a sender in the US to a family in Mexico, compared with a traditional bank route.",
  "takeaway": "XRP can act as a bridge between currencies, but banks, apps and local rules are still part of the trip.",
  "beats": [
   {
    "title": "Same trip, a different road.",
    "body": [
     "Instead of a chain of banks, a licensed payment company takes Maria's dollars, the value crosses the XRP Ledger — possibly as XRP for a few seconds — and a partner in Mexico pays out pesos. Switch between the two roads in the panel."
    ]
   },
   {
    "title": "No money parked in advance.",
    "body": [
     "XRP can be bought with dollars in one country and sold for pesos in another within seconds. So the payment company doesn't need cash waiting abroad. Ripple first sold this as a service called xRapid in October 2018."
    ],
    "deep": [
     "This only works if enough people buy and sell XRP in both currencies at that moment — the next chapter shows why that matters."
    ]
   },
   {
    "title": "The ledger is only part of the trip.",
    "body": [
     "The ledger step is final within seconds. But the money still has to enter and leave through banks or apps, pass legal checks and be paid out locally. We don't promise any time or cost — that depends on the companies involved."
    ]
   }
  ],
  "question": "Could Maria's money take a shorter road?"
 },
 {
  "label": "XRP as a bridge",
  "title": "XRP as a bridge",
  "figure": "Three circles — dollar token, XRP and peso token. A thin direct path joins dollars to pesos; a wider path goes through XRP.",
  "takeaway": "More buyers and sellers means better prices. XRP can connect two quieter markets.",
  "beats": [
   {
    "title": "Swapping two small currencies is hard.",
    "body": [
     "Few people swap dollar tokens directly for peso tokens. With few traders, a big swap pushes the price against you and you receive less."
    ]
   },
   {
    "title": "Go through XRP instead.",
    "body": [
     "Many people trade dollars↔XRP and XRP↔pesos. Using those two busy markets can give a better result than the quiet direct one. The ledger can choose this route automatically."
    ]
   },
   {
    "title": "The ledger can split the trip.",
    "body": [
     "It can even send part one way and part the other, choosing whatever delivers the most at that moment. The numbers above come from a simple model, not real prices."
    ]
   }
  ],
  "question": "Why go through XRP at all?"
 },
 {
  "label": "Built-in marketplace",
  "title": "Built-in marketplace",
  "figure": "Buyer and seller bars meet in the middle and trade, then turn into a money pool with a price curve.",
  "takeaway": "Two ways to trade on XRPL: order lists and money pools. Big trades move the price more.",
  "beats": [
   {
    "title": "A marketplace inside the ledger.",
    "body": [
     "The XRP Ledger has its own exchange (a DEX). Buy and sell orders are stored right in the record book — no separate company runs it."
    ]
   },
   {
    "title": "Orders meet in the middle.",
    "body": [
     "Buyers list the price they'll pay, sellers list the price they want. When the prices meet, the trade happens instantly as part of the same confirmed page."
    ]
   },
   {
    "title": "Plus pools of money (AMM).",
    "body": [
     "Since March 2024 there are also 'pools': piles of two currencies that anyone can add to and trade against. The pool sets its price automatically — the more you buy, the more each unit costs. A trade can use orders, pools or both."
    ]
   }
  ],
  "question": "Where does the exchange rate come from?"
 },
 {
  "label": "Who pays, who earns?",
  "title": "Who pays, who earns?",
  "question": "If more people use the network, who actually makes money?",
  "figure": "A payment in the middle with arrows to everyone involved: the fee goes up in flames, validators get nothing, companies earn service fees, and XRP holders gain only if the price rises. Then four boxes people often confuse, and a chart of ledger activity against the price.",
  "takeaway": "Network use, network income, token value and your profit are four different things. A busy ledger does not guarantee a rising price.",
  "beats": [
   {
    "title": "Follow the money.",
    "body": [
     "Every XRP Ledger transaction burns a tiny fee — nobody receives it. Validators are not paid at all. The money is made around the ledger: payment companies charge for transfers, exchanges and market makers earn on trades, and Ripple earns from its products and from selling XRP it owns."
    ]
   },
   {
    "title": "Four things people mix up.",
    "body": [
     "1 · The network is used. 2 · The network earns money — here almost none, because fees are burned. 3 · The token has a market value — set by how many people want to buy or sell XRP. 4 · You make a profit — which depends on when you buy and sell. Success at one step does not guarantee the next."
    ],
    "deep": [
     "Burned fees make XRP very slightly scarcer. At recent rates it would take thousands of years to burn 1% of all XRP — try the calculator below."
    ]
   },
   {
    "title": "The evidence: a busy ledger, a falling price.",
    "body": [
     "Through 2026 the ledger handled roughly two to three million transactions a day, while XRP's price fell by about half over the year. More use did not mean a higher price — at least not this year."
    ],
    "notes": [
     "Activity: Coin Metrics weekly averages to May 2026. Price: Coin Metrics, then dated news reports."
    ]
   }
  ]
 },
 {
  "label": "Real-world assets (RWA)",
  "title": "Real-world assets on XRPL",
  "figure": "A bond, a building, a gold bar and a fund pass through an issuer's vault and come out as tokens on the ledger; only verified wallets can receive them, and they swap with a dollar token in one step.",
  "takeaway": "A token is only as good as the company, the custodian and the legal agreement behind it.",
  "beats": [
   {
    "title": "Real things, digital receipts.",
    "body": [
     "Real-world assets (RWA) are things that exist outside the internet: government bonds, buildings, gold, investment funds, dollars in a bank. 'Tokenizing' means a regulated company holds the real asset and issues tokens on a ledger that stand for a share of it — a digital receipt you can move in seconds."
    ]
   },
   {
    "title": "Why issuers choose the XRP Ledger.",
    "body": [
     "The basic tools are already built in: a token format designed for real assets (live since October 2025), ID checks recorded on the ledger, members-only markets where only verified buyers can trade (live since February 2026), plus the built-in exchange and fast, low-cost settlement."
    ],
    "notes": [
     "Tokens move on the ledger. The real asset stays with the issuer and its custodian."
    ]
   },
   {
    "title": "Where XRP fits — and where it doesn't.",
    "body": [
     "These tokens are not XRP. XRP's role is small and technical: every transaction burns a tiny XRP fee, and holding tokens requires a small XRP reserve. Tokenized assets on XRPL grew to about $4.18 billion in June 2026, from roughly $147 million a year earlier (Evernorth, using RWA.xyz data). But a few large issuers make up much of that, and growth does not automatically move XRP's price."
    ]
   }
  ],
  "question": "Who else is using the ledger now?"
 },
 {
  "label": "Supply and escrow",
  "title": "Supply and escrow",
  "figure": "A ring of 100 blocks stands for 100 billion XRP. 55 blocks are locked; one unlocks, part moves on and the rest is locked again.",
  "takeaway": "The supply was fixed on day one. Escrow controls when Ripple can use its own XRP.",
  "beats": [
   {
    "title": "All XRP was created at the start.",
    "body": [
     "100 billion XRP were created when the ledger launched in 2012. Nobody can mine or print more. Because every fee is burned, the total shrinks very slowly."
    ],
    "notes": [
     "Each block ≈ 1 billion XRP"
    ]
   },
   {
    "title": "Escrow: a time lock.",
    "body": [
     "Escrow locks coins until a set date. The ledger itself enforces the lock, so nobody has to be trusted to keep the promise."
    ]
   },
   {
    "title": "Ripple's 55 billion.",
    "body": [
     "In December 2017 Ripple locked 55 billion of its XRP in escrow, unlocking up to 1 billion each month."
    ]
   },
   {
    "title": "Unlocked is not new — and not automatically sold.",
    "body": [
     "Unlocked XRP goes back to Ripple's own account; it is not newly created. Whatever Ripple doesn't use has usually been locked again for later. About 31.28 billion XRP were still in escrow on 1 September 2026, according to Crypto Briefing citing on-chain data. This number changes every month."
    ]
   }
  ],
  "question": "Where does new XRP come from — and who holds it?"
 },
 {
  "label": "Reality check",
  "title": "Reality check",
  "question": "So does XRP have a future? Judge for yourself.",
  "figure": "The payment route redrawn as a risk map. Choosing a risk highlights the part that fails and shows what happens.",
  "takeaway": "XRP addresses a real problem. Whether that turns into lasting value for the token is still an open question — and yours to judge.",
  "beats": [
   {
    "title": "Every step can fail.",
    "body": [
     "A payment is a chain. The ledger part is fast, but every other link can break. Pick a risk to see where it hits."
    ]
   },
   {
    "title": "Weigh the evidence.",
    "body": [
     "Next are five honest questions about XRP. Each has evidence on both sides. Pick where you land — there is no right answer, and no score that tells you to buy or sell."
    ]
   },
   {
    "title": "Know which link broke.",
    "body": [
     "Most real problems happen off the ledger — at companies, banks, regulators, or in the market itself. Nothing on this page is investment advice."
    ]
   }
  ]
 },
 {
  "label": "All the pieces",
  "title": "All the pieces",
  "figure": "Every layer returns, lines up, rebuilds the coin and opens into an interactive exploded drawing with thirteen layers you can select.",
  "beats": [
   {
    "title": "Everything comes back.",
    "body": [
     "Records, signatures, servers, validators, fees, routes, markets, real-world assets, supply and risk — each idea is a layer of the same object."
    ]
   },
   {
    "title": "The layers line up.",
    "body": [
     "Records and agreement at the core. Payments, markets and real-world assets around them. Risk wrapped around everything."
    ]
   },
   {
    "title": "A coin again — and now you know what's inside.",
    "body": [
     "XRP itself is the thin bright disc near the middle. Everything else is what gives it meaning. Explore it below."
    ]
   }
  ],
  "question": "Now that you know the story — what's inside the coin?"
 }
];

export const chaptersVi: Chapter[] = [
 {
  "label": "Gửi 200 USD về nhà",
  "title": "Gửi 200 USD về nhà",
  "question": "Vì sao gửi tiền ra nước ngoài đến giờ vẫn còn đắt như vậy?",
  "figure": "Một người gửi ở Mỹ và mẹ cô ở Mexico, nối với nhau bằng một chuỗi ngân hàng. Tiền nhảy qua từng ngân hàng, mỗi chặng bị trừ một ít, trong khi tiền dự phòng nằm chờ sẵn trong các tài khoản dọc đường.",
  "takeaway": "Một khoản chuyển tiền quốc tế đi qua nhiều công ty. Mỗi bên lấy một phần, và có bên phải giữ sẵn tiền ở nước ngoài. Đó là vấn đề mà XRP được tạo ra để giải quyết.",
  "beats": [
   {
    "title": "Maria làm việc ở Texas. Mỗi tháng cô gửi 200 USD cho mẹ ở Mexico.",
    "body": [
     "Trước khi nói đến crypto, hãy đi theo đồng tiền của cô. Cứ cuộn xuống — hình bên phải sẽ cho bạn thấy tiền đi đâu."
    ]
   },
   {
    "title": "Tiền của cô không bay thẳng tới nơi.",
    "body": [
     "Ngân hàng của Maria thường không có kết nối trực tiếp với ngân hàng của mẹ cô. Vì vậy khoản tiền nhảy qua các ngân hàng trung gian (gọi là ngân hàng đại lý), và đô la được đổi sang peso trên đường đi."
    ],
    "deep": [
     "Các ngân hàng gửi cho nhau điện thanh toán, thường qua mạng Swift. Còn tiền thật thì di chuyển giữa các tài khoản mà các ngân hàng mở tại nhau."
    ]
   },
   {
    "title": "Mỗi trạm cắt một ít.",
    "body": [
     "Gửi 200 USD ra nước ngoài tốn trung bình 6,3% trong quý 3/2025 — khoảng 12,60 USD. Gửi qua ngân hàng thì trung bình tới 14,9%. Mục tiêu của thế giới là 3% vào năm 2030."
    ],
    "notes": [
     "Ngân hàng Thế giới, Remittance Prices Worldwide, quý 3/2025 — trung bình toàn cầu khi gửi 200 USD."
    ]
   },
   {
    "title": "Chi phí ẩn: tiền phải gửi sẵn từ trước.",
    "body": [
     "Để trả tiền nhanh, ngân hàng hoặc công ty chuyển tiền phải để sẵn tiền trong tài khoản ở nước bên kia — phòng khi cần. Số tiền đó nằm im thay vì sinh lời, và chi phí ấy cuối cùng nằm trong giá khách hàng phải trả."
    ],
    "deep": [
     "Tốc độ đã cải thiện nhiều: khoảng 90% khoản thanh toán trên mạng Swift tới ngân hàng nhận trong vòng một giờ. Phần chậm và tốn kém thường là chặng cuối, khâu đổi tiền, và khoản tiền gửi sẵn này."
    ]
   }
  ]
 },
 {
  "label": "Ý tưởng có trước cả Bitcoin",
  "title": "Ý tưởng có trước cả Bitcoin",
  "question": "Ai tạo ra XRP — và để làm gì?",
  "figure": "Một mạng bạn bè chuyền giấy nợ qua nhau thành chuỗi; ba kỹ sư thay việc đào coin bằng sự đồng thuận; 100 khối xuất hiện tượng trưng cho 100 tỷ XRP, và 80 khối chuyển sang một công ty mới.",
  "takeaway": "XRP do các kỹ sư muốn chuyển giá trị nhanh, rẻ mà không cần đào coin tạo ra. Phần lớn XRP được trao cho công ty sau này là Ripple — vì vậy người ta hay nhầm Ripple với XRP.",
  "beats": [
   {
    "title": "2004: tiền là một chuỗi niềm tin.",
    "body": [
     "Một lập trình viên người Canada, Ryan Fugger, xây dựng RipplePay. Bạn bè có thể trả tiền cho nhau qua chuỗi giấy nợ — tôi nợ bạn, bạn nợ cô ấy — mà không cần ngân hàng ở giữa."
    ]
   },
   {
    "title": "2011: giống Bitcoin, nhưng không cần đào.",
    "body": [
     "Các kỹ sư David Schwartz, Jed McCaleb và Arthur Britto thích Bitcoin nhưng thấy việc đào coin tốn quá nhiều năng lượng. Họ thiết kế một sổ cái chung, nơi các máy tính đáng tin cậy chỉ cần đồng ý với nhau về mỗi trang mới."
    ]
   },
   {
    "title": "Tháng 6/2012: XRP Ledger hoạt động.",
    "body": [
     "Toàn bộ 100 tỷ XRP được tạo ra ngay ngày đầu tiên. Không có đào coin và không có cách nào in thêm."
    ],
    "notes": [
     "Mỗi khối trong hình = 1 tỷ XRP."
    ]
   },
   {
    "title": "80 tỷ XRP được trao cho một công ty.",
    "body": [
     "Tháng 9/2012, các nhà sáng lập cùng Chris Larsen lập công ty — đầu tiên là NewCoin, rồi OpenCoin, nay là Ripple — và trao cho công ty 80 tỷ XRP để xây dựng ứng dụng. Hãy tách bạch ba cái tên: XRP là đồng tiền, XRP Ledger là mạng lưới mở, Ripple là một công ty tư nhân."
    ],
    "deep": [
     "Ripple dùng số XRP nắm giữ để tài trợ hoạt động và phát triển thị trường. Cách và thời điểm Ripple bán XRP sau này trở thành trung tâm của một vụ kiện kéo dài — đó là chương tiếp theo."
    ]
   }
  ]
 },
 {
  "label": "Hành trình",
  "title": "Mười bốn năm trên một đường kẻ",
  "question": "Điều gì đã xảy ra với XRP từ 2012 đến nay?",
  "figure": "Một dòng thời gian từ 2012 đến 2026. Giá XRP tự vẽ thành một đường, và các mốc sự kiện bừng sáng khi đường giá đi qua.",
  "takeaway": "Câu chuyện của XRP là những mối quan hệ với ngân hàng, các đợt bùng nổ, một vụ kiện dài và con đường được dọn sạch — nhưng tiến triển thực tế và giá thường đi theo hai hướng khác nhau.",
  "beats": [
   {
    "title": "2012–2016: startup làm việc với ngân hàng.",
    "body": [
     "Ripple chào bán công cụ của mình cho ngân hàng và công ty thanh toán. Tháng 5/2015, Ripple nộp phạt 700.000 USD cho cơ quan quản lý Mỹ vì bán XRP mà không có biện pháp chống rửa tiền theo quy định — vụ đầu tiên thuộc loại này."
    ]
   },
   {
    "title": "2017–2018: bùng nổ, và khoá nguồn cung.",
    "body": [
     "Khi crypto bùng nổ, giá XRP theo ngày đi từ dưới 1 xu lên khoảng 2,75 USD vào tháng 1/2018. Ripple khoá 55 tỷ XRP trong escrow, và tháng 10/2018 ra mắt dịch vụ dùng XRP để chuyển tiền giữa các nước."
    ]
   },
   {
    "title": "2020–2023: những năm kiện tụng.",
    "body": [
     "Tháng 12/2020, Uỷ ban Chứng khoán Mỹ (SEC) kiện Ripple, cho rằng việc bán XRP là chào bán chứng khoán không đăng ký. Nhiều sàn ở Mỹ ngừng giao dịch XRP. Tháng 7/2023, toà phán XRP bán trên sàn công khai không phải chứng khoán — nhưng bán trực tiếp cho nhà đầu tư lớn thì có."
    ]
   },
   {
    "title": "2024–2026: khép hồ sơ — giá vẫn chao đảo.",
    "body": [
     "Vụ kiện kết thúc vào tháng 8/2025 với khoản phạt 125 triệu USD. Ripple ra mắt đồng đô la số RLUSD, các quỹ ETF XRP giao ngay tại Mỹ mở cửa tháng 11/2025, và tài sản thực được token hoá tăng mạnh trên sổ cái. Vậy mà ngày 14/11/2026, XRP đóng cửa dưới 1 USD, thấp nhất kể từ 2024."
    ],
    "notes": [
     "Giá: giá đóng cửa ngày của Coin Metrics đến 23/5/2026, sau đó theo các bản tin có ghi ngày."
    ],
    "deep": [
     "Một phán quyết, một sản phẩm hay một quỹ ra đời có thể trùng lúc với biến động giá. Điều đó không chứng minh cái này gây ra cái kia — giá crypto còn theo Bitcoin, lãi suất và tâm lý nhà đầu tư."
    ]
   }
  ]
 },
 {
  "label": "Mở ra xem",
  "title": "Rốt cuộc XRP là gì?",
  "figure": "Một đồng xu được vẽ tay xoay chậm, tách thành nhiều lớp mỏng, vỡ thành hàng nghìn chấm rồi tụ lại thành mạng lưới tài khoản.",
  "takeaway": "XRP là một con số số dư trong cuốn sổ chung công khai (XRP Ledger). Ripple là một công ty, không phải là mạng lưới.",
  "beats": [
   {
    "title": "Hãy mở đồng xu ra.",
    "body": [
     "Giờ bạn đã biết XRP từ đâu tới. Đến lúc nhìn vào bên trong — không cần kiến thức crypto, cứ cuộn tiếp."
    ]
   },
   {
    "title": "XRP là một con số trong cuốn sổ chung.",
    "body": [
     "XRP là tiền số của XRP Ledger (XRPL). Không có đồng xu thật, cũng không có tệp nào cả. XRP của bạn chỉ là một số dư được ghi trong một cuốn sổ công khai, được rất nhiều máy tính trên thế giới giữ giống hệt nhau."
    ],
    "notes": [
     "Đơn vị nhỏ nhất là 0,000001 XRP (gọi là một 'drop')."
    ]
   },
   {
    "title": "XRP, XRPL và Ripple là ba thứ khác nhau.",
    "body": [
     "XRP là đồng tiền. XRPL là mạng lưới công khai ghi lại nó — ai cũng dùng được và không công ty nào điều hành một mình. Ripple là một công ty tư nhân xây dựng sản phẩm trên đó và nắm giữ nhiều XRP. Ripple không thể duyệt hay chặn giao dịch trên sổ cái."
    ]
   },
   {
    "title": "Từ đồng xu đến sổ ghi chép.",
    "body": [
     "Những lớp bạn vừa thấy là ý tưởng, không phải linh kiện: sổ sách, kiểm tra, quy tắc và thị trường. Bỏ hình đồng xu đi, thứ còn lại là danh sách các tài khoản và số dư."
    ]
   }
  ],
  "question": "Nếu XRP không phải đồng xu cầm được, thì nó là gì?"
 },
 {
  "label": "Bên trong sổ cái",
  "title": "Bên trong sổ cái",
  "figure": "Các vòng tròn tài khoản nối với máy chủ. Một tài khoản ký lệnh chuyển tiền và lệnh được chuyền từ máy chủ này sang máy chủ khác.",
  "takeaway": "Tài khoản giữ số dư, chữ ký chứng minh lệnh là của bạn, và các máy chủ chuyền lệnh đi.",
  "beats": [
   {
    "title": "Mỗi tài khoản là một dòng trong sổ.",
    "body": [
     "Mỗi tài khoản có một địa chỉ (giống email nhưng dành cho tiền) và một số dư. Để mở tài khoản, bạn phải giữ lại một khoản tối thiểu nhỏ — hiện là 1 XRP — để không ai có thể làm đầy sổ bằng tài khoản rỗng.",
     "Chạm hoặc di chuột vào một vòng tròn để xem bên trong. Mọi số liệu đều là giả lập."
    ]
   },
   {
    "title": "Ký = chữ ký số của bạn.",
    "body": [
     "Để gửi XRP, bạn tạo lệnh chuyển và ký bằng khoá bí mật. Ai cũng kiểm tra được chữ ký là thật, nhưng không ai nhìn thấy khoá. Mất khoá thì không ai khôi phục giúp bạn được."
    ]
   },
   {
    "title": "Lệnh được lan ra.",
    "body": [
     "Lệnh đã ký được gửi tới bất kỳ máy chủ XRPL nào. Máy chủ kiểm tra rồi chuyền tiếp cho máy chủ khác. Chỉ trong chốc lát, phần lớn mạng lưới đã biết về nó."
    ]
   },
   {
    "title": "Đã biết chưa phải là đã xong.",
    "body": [
     "Lúc này lệnh chỉ đang chờ. Nó chỉ có hiệu lực khi mạng lưới đồng ý — đó là chương tiếp theo."
    ]
   }
  ],
  "question": "XRP của tôi thực ra được cất ở đâu?"
 },
 {
  "label": "Đồng thuận không cần đào",
  "title": "Đồng thuận không cần đào",
  "figure": "Một vòng validator so sánh với nhau cho đến khi 80% đồng ý; lệnh đang chờ trở thành một trang đã xác nhận trong sổ.",
  "takeaway": "Các validator tin cậy đồng ý vài giây một lần. Đạt 80% = đã xác nhận và không đổi được. Không cần đào.",
  "beats": [
   {
    "title": "Không đào. Không staking.",
    "body": [
     "Bitcoin dùng đào; nhiều mạng khác dùng staking. XRP Ledger không dùng cả hai. Một nhóm máy chủ gọi là validator chỉ so sánh với nhau và thống nhất nên chấp nhận giao dịch nào. Họ không nhận thưởng cho việc này."
    ]
   },
   {
    "title": "Mỗi máy chủ tự chọn validator để tin.",
    "body": [
     "Mỗi máy chủ giữ một danh sách validator mà nó tin là sẽ không gian lận. Phần lớn dùng danh sách được khuyến nghị, nhưng ai cũng có thể tự thay đổi. Các đường nét đứt là danh sách của một máy chủ."
    ],
    "deep": [
     "Danh sách validator mà mỗi máy chủ tin cậy gọi là UNL (Unique Node List). XRP Ledger Foundation và một số bên khác công bố danh sách khuyến nghị; mỗi người vận hành có thể tự chọn."
    ]
   },
   {
    "title": "Đồng ý ở mức 80%.",
    "body": [
     "Các validator so danh sách giao dịch vài lượt, nhanh chóng gác lại những giao dịch còn tranh cãi. Khi ít nhất 80% validator tin cậy đồng ý, quyết định được chốt. Không công ty nào quyết một mình."
    ]
   },
   {
    "title": "Đã xác nhận nghĩa là cuối cùng.",
    "body": [
     "Cứ 3–5 giây, một trang mới của cuốn sổ được xác nhận. Đã xác nhận thì không sửa được. Nếu không đạt 80%, mạng sẽ tạm dừng thay vì tách làm đôi."
    ]
   }
  ],
  "question": "Ai quyết định giao dịch nào là thật — khi không có ngân hàng?"
 },
 {
  "label": "Gửi XRP",
  "title": "Gửi XRP",
  "figure": "Hai ví giả lập. Bấm phát để xem một lệnh chuyển được ký, đồng thuận, xác nhận và khoản phí nhỏ bị đốt.",
  "takeaway": "Ký → chia sẻ → đồng thuận → xác nhận → số dư thay đổi → phí bị đốt. Mất vài giây.",
  "beats": [
   {
    "title": "Thử ngay: gửi XRP.",
    "body": [
     "Hai ví giả với tiền giả. Chọn số lượng rồi bấm phát để theo dõi một lệnh chuyển từ đầu đến cuối."
    ]
   },
   {
    "title": "Phí nhỏ vậy thì để làm gì?",
    "body": [
     "Mỗi giao dịch đốt một khoản phí rất nhỏ — thường là 0,00001 XRP. Khoản này không trả cho ai, nó biến mất luôn. Nhờ vậy, spam mạng lưới trở nên tốn kém, còn dùng bình thường thì gần như miễn phí. Mỗi ví cũng luôn giữ lại 1 XRP tối thiểu."
    ]
   }
  ],
  "question": "Chuyện gì xảy ra khi bạn bấm 'gửi'?"
 },
 {
  "label": "Trở lại 200 USD của Maria",
  "title": "Trở lại 200 USD của Maria",
  "figure": "Bản đồ Hoa Kỳ và Mexico với tuyến chuyển tiền từ người gửi ở Mỹ tới gia đình ở Mexico, so sánh với tuyến ngân hàng truyền thống.",
  "takeaway": "XRP có thể làm cầu nối giữa hai đồng tiền, nhưng ngân hàng, ứng dụng và luật địa phương vẫn là một phần của hành trình.",
  "beats": [
   {
    "title": "Cùng chuyến đi, con đường khác.",
    "body": [
     "Thay vì một chuỗi ngân hàng, một công ty thanh toán được cấp phép nhận đô la của Maria, giá trị đi qua XRP Ledger — có thể ở dạng XRP trong vài giây — và một đối tác ở Mexico chi trả peso. Chuyển qua lại giữa hai con đường trong bảng bên dưới."
    ]
   },
   {
    "title": "Không cần tiền gửi sẵn.",
    "body": [
     "XRP có thể được mua bằng đô la ở nước này và bán lấy peso ở nước kia trong vài giây. Nhờ vậy công ty thanh toán không cần để sẵn tiền ở nước ngoài. Ripple bắt đầu bán dịch vụ này với tên xRapid vào tháng 10/2018."
    ],
    "deep": [
     "Cách này chỉ hiệu quả nếu lúc đó có đủ người mua bán XRP bằng cả hai đồng tiền — chương sau cho thấy vì sao điều đó quan trọng."
    ]
   },
   {
    "title": "Sổ cái chỉ là một phần của chuyến đi.",
    "body": [
     "Bước trên sổ cái được chốt trong vài giây. Nhưng tiền vẫn phải vào và ra qua ngân hàng hoặc ứng dụng, qua kiểm tra pháp lý và được chi trả tại chỗ. Chúng tôi không hứa thời gian hay chi phí — điều đó tuỳ vào các công ty tham gia."
    ]
   }
  ],
  "question": "Tiền của Maria có thể đi đường ngắn hơn không?"
 },
 {
  "label": "XRP làm cầu nối",
  "title": "XRP làm cầu nối",
  "figure": "Ba vòng tròn — token đô la, XRP và token peso. Một đường mảnh nối thẳng đô la với peso; một đường rộng hơn đi qua XRP.",
  "takeaway": "Càng nhiều người mua bán thì giá càng tốt. XRP có thể nối hai thị trường vắng người.",
  "beats": [
   {
    "title": "Đổi hai đồng tiền nhỏ với nhau rất khó.",
    "body": [
     "Ít người đổi trực tiếp token đô la sang token peso. Khi ít người giao dịch, một lệnh đổi lớn sẽ đẩy giá bất lợi và bạn nhận về ít hơn."
    ]
   },
   {
    "title": "Hãy đi vòng qua XRP.",
    "body": [
     "Rất nhiều người giao dịch đô la↔XRP và XRP↔peso. Dùng hai thị trường đông đúc đó có thể cho kết quả tốt hơn thị trường trực tiếp vắng vẻ. Sổ cái có thể tự chọn tuyến này."
    ]
   },
   {
    "title": "Sổ cái có thể chia đôi chuyến đi.",
    "body": [
     "Nó thậm chí có thể gửi một phần đi đường này, một phần đi đường kia, miễn sao người nhận được nhiều nhất vào lúc đó. Các con số phía trên lấy từ mô hình đơn giản, không phải giá thật."
    ]
   }
  ],
  "question": "Vì sao phải đi qua XRP?"
 },
 {
  "label": "Chợ giao dịch có sẵn",
  "title": "Chợ giao dịch có sẵn",
  "figure": "Các cột người mua và người bán gặp nhau ở giữa và khớp lệnh, rồi biến thành một bể tiền với đường cong giá.",
  "takeaway": "Có hai cách giao dịch trên XRPL: danh sách lệnh và bể tiền. Lệnh càng lớn thì giá càng bị đẩy nhiều.",
  "beats": [
   {
    "title": "Một khu chợ nằm ngay trong sổ cái.",
    "body": [
     "XRP Ledger có sàn giao dịch riêng (DEX). Lệnh mua và bán được ghi ngay trong cuốn sổ — không có công ty riêng nào điều hành."
    ]
   },
   {
    "title": "Lệnh gặp nhau ở giữa.",
    "body": [
     "Người mua niêm yết giá họ chịu trả, người bán niêm yết giá họ muốn. Khi hai giá gặp nhau, giao dịch xảy ra ngay trong cùng một trang được xác nhận."
    ]
   },
   {
    "title": "Thêm các bể tiền (AMM).",
    "body": [
     "Từ tháng 3/2024 còn có các 'bể': hai loại tiền được gom lại, ai cũng có thể góp vào hoặc giao dịch với bể. Bể tự đặt giá — mua càng nhiều thì mỗi đơn vị càng đắt. Một giao dịch có thể dùng lệnh, bể, hoặc cả hai."
    ]
   }
  ],
  "question": "Tỷ giá đến từ đâu?"
 },
 {
  "label": "Ai trả, ai hưởng?",
  "title": "Ai trả tiền, ai kiếm tiền?",
  "question": "Nếu nhiều người dùng mạng lưới hơn, thì ai thực sự kiếm được tiền?",
  "figure": "Một giao dịch ở giữa với các mũi tên tới mọi bên liên quan: phí bị đốt cháy, validator không nhận gì, các công ty thu phí dịch vụ, còn người giữ XRP chỉ lời khi giá tăng. Sau đó là bốn ô khái niệm hay bị nhầm, và biểu đồ hoạt động của sổ cái so với giá.",
  "takeaway": "Mạng được dùng, thu nhập của mạng, giá trị token và lợi nhuận của bạn là bốn chuyện khác nhau. Sổ cái bận rộn không đảm bảo giá tăng.",
  "beats": [
   {
    "title": "Lần theo dòng tiền.",
    "body": [
     "Mỗi giao dịch trên XRP Ledger đốt một khoản phí rất nhỏ — không ai nhận được. Validator hoàn toàn không được trả tiền. Tiền được kiếm ở xung quanh sổ cái: công ty thanh toán thu phí chuyển tiền, sàn giao dịch và nhà tạo lập thị trường kiếm từ giao dịch, còn Ripple kiếm từ sản phẩm của mình và từ việc bán XRP mà công ty sở hữu."
    ]
   },
   {
    "title": "Bốn điều người ta hay nhầm.",
    "body": [
     "1 · Mạng lưới được sử dụng. 2 · Mạng lưới có thu nhập — ở đây gần như bằng 0, vì phí bị đốt. 3 · Token có giá trị thị trường — do số người muốn mua hay bán XRP quyết định. 4 · Bạn có lãi — phụ thuộc vào lúc bạn mua và bán. Thành công ở bước này không đảm bảo bước sau."
    ],
    "deep": [
     "Phí bị đốt khiến XRP khan hiếm hơn một chút xíu. Với tốc độ gần đây, phải mất hàng nghìn năm mới đốt được 1% tổng số XRP — hãy thử máy tính bên dưới."
    ]
   },
   {
    "title": "Bằng chứng: sổ cái bận rộn, giá đi xuống.",
    "body": [
     "Suốt năm 2026, sổ cái xử lý khoảng hai đến ba triệu giao dịch mỗi ngày, trong khi giá XRP giảm khoảng một nửa trong năm. Dùng nhiều hơn không có nghĩa là giá cao hơn — ít nhất là trong năm nay."
    ],
    "notes": [
     "Hoạt động: trung bình tuần của Coin Metrics đến tháng 5/2026. Giá: Coin Metrics, sau đó theo các bản tin có ghi ngày."
    ]
   }
  ]
 },
 {
  "label": "Tài sản thực (RWA)",
  "title": "Tài sản thực trên XRPL",
  "figure": "Trái phiếu, toà nhà, thỏi vàng và quỹ đi qua kho của đơn vị phát hành và thành token trên sổ cái; chỉ ví đã xác minh mới nhận được, và token đổi lấy đồng đô la số trong một bước.",
  "takeaway": "Một token chỉ đáng tin bằng công ty, đơn vị lưu ký và thoả thuận pháp lý đứng sau nó.",
  "beats": [
   {
    "title": "Tài sản thật, biên nhận số.",
    "body": [
     "Tài sản thực (RWA — real-world assets) là những thứ tồn tại ngoài internet: trái phiếu chính phủ, toà nhà, vàng, quỹ đầu tư, tiền đô trong ngân hàng. 'Token hoá' nghĩa là một công ty được quản lý giữ tài sản thật và phát hành token trên sổ cái đại diện cho một phần của nó — như một tờ biên nhận số chuyển đi được trong vài giây."
    ]
   },
   {
    "title": "Vì sao các đơn vị phát hành chọn XRP Ledger.",
    "body": [
     "Các công cụ cơ bản đã có sẵn: định dạng token thiết kế cho tài sản thực (hoạt động từ tháng 10/2025), xác minh danh tính ghi trên sổ cái, chợ 'chỉ dành cho thành viên' nơi chỉ người mua đã xác minh mới giao dịch được (hoạt động từ tháng 2/2026), cùng sàn giao dịch có sẵn và thanh toán nhanh, rẻ."
    ],
    "notes": [
     "Token di chuyển trên sổ cái. Tài sản thật vẫn nằm ở đơn vị phát hành và đơn vị lưu ký."
    ]
   },
   {
    "title": "XRP nằm ở đâu — và không nằm ở đâu.",
    "body": [
     "Các token này không phải XRP. Vai trò của XRP nhỏ và mang tính kỹ thuật: mỗi giao dịch đốt một khoản phí XRP rất nhỏ, và nắm giữ token cần một khoản dự trữ XRP nhỏ. Tài sản token hoá trên XRPL tăng lên khoảng 4,18 tỷ USD vào tháng 6/2026, từ khoảng 147 triệu USD một năm trước (Evernorth, dựa trên dữ liệu RWA.xyz). Nhưng một vài đơn vị phát hành lớn chiếm phần lớn con số đó, và sự tăng trưởng này không tự động đẩy giá XRP."
    ]
   }
  ],
  "question": "Còn ai khác đang dùng sổ cái này?"
 },
 {
  "label": "Nguồn cung và ký quỹ",
  "title": "Nguồn cung và ký quỹ",
  "figure": "Một vòng 100 khối tượng trưng cho 100 tỷ XRP. 55 khối bị khoá; một khối được mở, một phần đi tiếp và phần còn lại bị khoá lại.",
  "takeaway": "Nguồn cung cố định từ ngày đầu. Ký quỹ quyết định khi nào Ripple được dùng XRP của chính mình.",
  "beats": [
   {
    "title": "Toàn bộ XRP được tạo ngay từ đầu.",
    "body": [
     "100 tỷ XRP được tạo khi sổ cái ra mắt năm 2012. Không ai đào hay in thêm được. Vì mọi khoản phí đều bị đốt, tổng lượng XRP giảm rất chậm."
    ],
    "notes": [
     "Mỗi khối ≈ 1 tỷ XRP"
    ]
   },
   {
    "title": "Ký quỹ: một chiếc khoá hẹn giờ.",
    "body": [
     "Ký quỹ (escrow) khoá tiền đến một ngày định trước. Chính sổ cái thực thi chiếc khoá, nên không cần tin ai giữ lời."
    ]
   },
   {
    "title": "55 tỷ của Ripple.",
    "body": [
     "Tháng 12/2017, Ripple khoá 55 tỷ XRP của mình vào ký quỹ, mỗi tháng mở ra tối đa 1 tỷ."
    ]
   },
   {
    "title": "Được mở khoá không phải là mới tạo — và không tự động bị bán.",
    "body": [
     "XRP được mở khoá quay về tài khoản của chính Ripple; nó không phải XRP mới. Phần Ripple không dùng thường được khoá lại cho sau này. Khoảng 31,28 tỷ XRP vẫn nằm trong ký quỹ vào ngày 1/9/2026, theo Crypto Briefing dẫn dữ liệu on-chain. Con số này thay đổi hằng tháng."
    ]
   }
  ],
  "question": "XRP mới đến từ đâu — và ai đang nắm giữ?"
 },
 {
  "label": "Kiểm chứng thực tế",
  "title": "Kiểm chứng thực tế",
  "question": "Vậy XRP có tương lai không? Bạn tự đánh giá.",
  "figure": "Tuyến thanh toán được vẽ lại thành bản đồ rủi ro. Chọn một rủi ro sẽ làm nổi bật phần bị hỏng và cho thấy điều xảy ra.",
  "takeaway": "XRP nhắm vào một vấn đề có thật. Điều đó có biến thành giá trị lâu dài cho token hay không vẫn là câu hỏi mở — và là để bạn tự đánh giá.",
  "beats": [
   {
    "title": "Bước nào cũng có thể hỏng.",
    "body": [
     "Một khoản thanh toán là một chuỗi. Phần sổ cái thì nhanh, nhưng mắt xích nào khác cũng có thể đứt. Chọn một rủi ro để xem nó đánh vào đâu."
    ]
   },
   {
    "title": "Cân nhắc bằng chứng.",
    "body": [
     "Tiếp theo là năm câu hỏi thẳng thắn về XRP. Mỗi câu đều có bằng chứng cho cả hai phía. Hãy chọn quan điểm của bạn — không có đáp án đúng, và không có điểm số nào bảo bạn mua hay bán."
    ]
   },
   {
    "title": "Biết mắt xích nào bị đứt.",
    "body": [
     "Phần lớn sự cố thật xảy ra ngoài sổ cái — ở các công ty, ngân hàng, cơ quan quản lý, hoặc chính thị trường. Không nội dung nào ở đây là lời khuyên đầu tư."
    ]
   }
  ]
 },
 {
  "label": "Tất cả các mảnh ghép",
  "title": "Tất cả các mảnh ghép",
  "figure": "Mọi lớp quay trở lại, xếp thẳng hàng, ghép lại thành đồng xu rồi mở ra thành bản vẽ tách lớp tương tác với mười ba lớp có thể chọn.",
  "beats": [
   {
    "title": "Mọi thứ quay trở lại.",
    "body": [
     "Sổ sách, chữ ký, máy chủ, validator, phí, tuyến chuyển, thị trường, tài sản thực, nguồn cung và rủi ro — mỗi ý tưởng là một lớp của cùng một vật thể."
    ]
   },
   {
    "title": "Các lớp xếp thẳng hàng.",
    "body": [
     "Sổ sách và đồng thuận ở lõi. Thanh toán, thị trường và tài sản thực bao quanh. Rủi ro bọc ngoài tất cả."
    ]
   },
   {
    "title": "Lại là đồng xu — và giờ bạn biết bên trong có gì.",
    "body": [
     "Bản thân XRP là chiếc đĩa mỏng sáng ở gần giữa. Mọi thứ khác là thứ mang lại ý nghĩa cho nó. Hãy khám phá ở bên dưới."
    ]
   }
  ],
  "question": "Giờ bạn đã biết câu chuyện — bên trong đồng xu có gì?"
 }
];

export const storyEn = {
 "acts": [
  "The Problem",
  "The Origin",
  "The Journey",
  "The Simulation",
  "The Economics",
  "The Reality Check"
 ],
 "ui": {
  "act": "Act",
  "deeper": "Go deeper",
  "news": "news-reported",
  "data": "Data",
  "sister": "Also: Bitcoin — a history in motion"
 },
 "scenes": {
  "problem": {
   "sender": "Maria · USD",
   "family": "Mother · MXN",
   "yourBank": "Maria's bank",
   "corr": "Partner bank",
   "famBank": "Mother's bank",
   "fee": "fee",
   "parked": "Parked in advance",
   "idle": "idle cash",
   "arrives": "arrives",
   "chart": "Average cost of sending $200 · World Bank, Q3 2025",
   "channels": [
    "Banks",
    "Post offices",
    "Money transfer firms",
    "Mobile apps"
   ],
   "target": "2030 target 3%",
   "fx": "USD → MXN",
   "hop": "stop"
  },
  "origin": {
   "y2004": "2004 · RipplePay",
   "iou": "IOU",
   "friends": "a chain of friends who trust each other",
   "y2011": "2011 · no mining",
   "mining": "Mining",
   "agree": "Agreement",
   "y2012": "June 2012 · 100 billion XRP",
   "block": "1 block = 1 billion XRP",
   "company": "Company · NewCoin → OpenCoin → Ripple",
   "founders": "Founders",
   "ledger": "XRP Ledger · open network"
  },
  "journey": {
   "price": "XRP price · USD · log scale",
   "eras": [
    "Startup years",
    "Boom",
    "Lawsuit years",
    "After the case"
   ],
   "news": "news-reported",
   "today": "Nov 2026"
  },
  "economics": {
   "payment": "A payment on the XRP Ledger",
   "burned": "Fee burned",
   "nobody": "nobody receives it",
   "validators": "Validators",
   "nothing": "paid nothing",
   "ripple": "Ripple",
   "rippleEarns": "products · XRP sales",
   "firms": "Payment firms",
   "firmsEarn": "transfer fees",
   "markets": "Exchanges & market makers",
   "marketsEarn": "spreads · trading fees",
   "holders": "XRP holders",
   "holdersEarn": "only if the price rises",
   "boxes": [
    "Network used",
    "Network income",
    "Token value",
    "Your profit"
   ],
   "boxSub": [
    "payments, users",
    "fees burned ≈ $0",
    "price × coins",
    "when you buy & sell"
   ],
   "not": "not automatic",
   "activity": "Transactions per day",
   "price": "XRP price",
   "scale": "both on log scales · Coin Metrics + news"
  }
 },
 "panels": {
  "problem": {
   "title": "What does Maria pay?",
   "channel": "Send through",
   "channels": [
    "Bank",
    "Money transfer firm",
    "Mobile app"
   ],
   "pct": "Average cost",
   "fee": "Fee on $200",
   "arrives": "Her mother receives (value)",
   "hops": "Partner banks in the middle",
   "hopsNote": "Illustrative: the number of partner banks varies.",
   "parties": "Companies touching the money",
   "speed": "About 90% of payments on Swift reach the receiving bank within an hour — but only 43% reach the customer's account that fast.",
   "source": "Costs: World Bank RPW, Q3 2025 global averages for sending $200. A bank route also needs cash parked abroad."
  },
  "journey": {
   "title": "Key moments",
   "hint": "Tap an event to light it up on the timeline.",
   "price": "1 XRP that day",
   "caveat": "Events and price moves can happen together without one causing the other.",
   "all": "All",
   "news": "news-reported"
  },
  "economics": {
   "title": "Fee burn calculator",
   "tx": "Transactions per day",
   "fee": "Average fee per transaction",
   "drops": "drops",
   "price": "XRP price",
   "burnedDay": "XRP burned per day",
   "burnedYear": "XRP burned per year",
   "share": "Share of all XRP burned per year",
   "usd": "Value burned per year",
   "years": "Years to burn 1% of all XRP",
   "reset": "Use real values",
   "defaults": "Real values: Coin Metrics weekly average (May 2026); price: news-reported close, 14 Nov 2026.",
   "note": "1 XRP = 1,000,000 drops. Burned fees make XRP very slightly scarcer — they are income for no one."
  },
  "verdict": {
   "title": "Judge for yourself",
   "forL": "Evidence for",
   "againstL": "Evidence against",
   "lean": [
    "Convincing",
    "Mixed",
    "Not convincing"
   ],
   "summary": "Your view so far",
   "answered": "answered",
   "reset": "Clear",
   "note": "A thinking tool, not a score and not investment advice.",
   "questions": [
    {
     "q": "Is the problem real?",
     "pro": [
      "Sending $200 abroad still cost 6.3% on average in Q3 2025 — about double the 3% target.",
      "Banks and payment firms keep cash parked abroad to pay out quickly."
     ],
     "con": [
      "About 90% of payments on Swift already reach the receiving bank within an hour.",
      "Apps and dollar tokens are cutting costs too — without XRP."
     ]
    },
    {
     "q": "Does the XRP Ledger solve it well?",
     "pro": [
      "Payments are final in 3–5 seconds and the fee is a tiny fraction of a cent.",
      "The built-in exchange can swap currencies in the same step."
     ],
     "con": [
      "Money still enters and leaves through banks and licensed companies.",
      "ID checks, local rules and payout networks don't speed up just because the ledger is fast."
     ]
    },
    {
     "q": "Do payments need XRP itself?",
     "pro": [
      "XRP can bridge two currencies so no cash has to sit abroad.",
      "The ledger uses XRP automatically when that gives a better price."
     ],
     "con": [
      "Dollar tokens such as RLUSD can also carry value straight across.",
      "The bridge only works when XRP markets are deep in both currencies."
     ]
    },
    {
     "q": "Is the legal cloud gone?",
     "pro": [
      "The SEC case ended in August 2025.",
      "US spot XRP funds opened in November 2025."
     ],
     "con": [
      "A court order still limits Ripple's direct sales to big investors.",
      "Ripple still holds a large share of XRP, including about 31 billion in escrow (Sept 2026)."
     ]
    },
    {
     "q": "Does adoption reach the price?",
     "pro": [
      "Tokenized real-world assets on XRPL reached about $4.18 billion in June 2026.",
      "Ripple keeps expanding its regulated businesses."
     ],
     "con": [
      "XRP fell nearly half in 2026 and closed below $1 in November.",
      "Fees are burned, so more use creates almost no income for holders."
     ]
    }
   ]
  }
 }
};

export type StoryDict = typeof storyEn;

export const storyVi: StoryDict = {
 "acts": [
  "Vấn đề",
  "Khởi nguồn",
  "Hành trình",
  "Mô phỏng",
  "Kinh tế",
  "Kiểm chứng thực tế"
 ],
 "ui": {
  "act": "Hồi",
  "deeper": "Tìm hiểu sâu hơn",
  "news": "theo bản tin",
  "data": "Dữ liệu",
  "sister": "Xem thêm: Bitcoin — lịch sử chuyển động"
 },
 "scenes": {
  "problem": {
   "sender": "Maria · USD",
   "family": "Mẹ · MXN",
   "yourBank": "Ngân hàng của Maria",
   "corr": "Ngân hàng đại lý",
   "famBank": "Ngân hàng của mẹ",
   "fee": "phí",
   "parked": "Tiền gửi sẵn",
   "idle": "tiền nằm im",
   "arrives": "nhận được",
   "chart": "Chi phí trung bình khi gửi 200 USD · Ngân hàng Thế giới, quý 3/2025",
   "channels": [
    "Ngân hàng",
    "Bưu điện",
    "Công ty chuyển tiền",
    "Ứng dụng di động"
   ],
   "target": "Mục tiêu 2030: 3%",
   "fx": "USD → MXN",
   "hop": "chặng"
  },
  "origin": {
   "y2004": "2004 · RipplePay",
   "iou": "NỢ",
   "friends": "một chuỗi bạn bè tin tưởng nhau",
   "y2011": "2011 · không đào coin",
   "mining": "Đào coin",
   "agree": "Đồng thuận",
   "y2012": "Tháng 6/2012 · 100 tỷ XRP",
   "block": "1 khối = 1 tỷ XRP",
   "company": "Công ty · NewCoin → OpenCoin → Ripple",
   "founders": "Nhà sáng lập",
   "ledger": "XRP Ledger · mạng lưới mở"
  },
  "journey": {
   "price": "Giá XRP · USD · thang log",
   "eras": [
    "Thời khởi nghiệp",
    "Bùng nổ",
    "Những năm kiện tụng",
    "Sau vụ kiện"
   ],
   "news": "theo bản tin",
   "today": "11/2026"
  },
  "economics": {
   "payment": "Một giao dịch trên XRP Ledger",
   "burned": "Phí bị đốt",
   "nobody": "không ai nhận",
   "validators": "Validator",
   "nothing": "không được trả",
   "ripple": "Ripple",
   "rippleEarns": "sản phẩm · bán XRP",
   "firms": "Công ty thanh toán",
   "firmsEarn": "phí chuyển tiền",
   "markets": "Sàn & nhà tạo lập thị trường",
   "marketsEarn": "chênh lệch giá · phí giao dịch",
   "holders": "Người giữ XRP",
   "holdersEarn": "chỉ khi giá tăng",
   "boxes": [
    "Mạng được dùng",
    "Thu nhập của mạng",
    "Giá trị token",
    "Lợi nhuận của bạn"
   ],
   "boxSub": [
    "giao dịch, người dùng",
    "phí bị đốt ≈ 0 USD",
    "giá × số coin",
    "lúc bạn mua & bán"
   ],
   "not": "không tự động",
   "activity": "Giao dịch mỗi ngày",
   "price": "Giá XRP",
   "scale": "cả hai theo thang log · Coin Metrics + bản tin"
  }
 },
 "panels": {
  "problem": {
   "title": "Maria phải trả bao nhiêu?",
   "channel": "Gửi qua",
   "channels": [
    "Ngân hàng",
    "Công ty chuyển tiền",
    "Ứng dụng di động"
   ],
   "pct": "Chi phí trung bình",
   "fee": "Phí trên 200 USD",
   "arrives": "Mẹ cô nhận được (giá trị)",
   "hops": "Số ngân hàng đại lý ở giữa",
   "hopsNote": "Minh hoạ: số ngân hàng trung gian mỗi tuyến một khác.",
   "parties": "Số công ty chạm vào tiền",
   "speed": "Khoảng 90% khoản thanh toán trên Swift tới ngân hàng nhận trong vòng một giờ — nhưng chỉ 43% vào tới tài khoản người nhận nhanh như vậy.",
   "source": "Chi phí: Ngân hàng Thế giới RPW, trung bình toàn cầu quý 3/2025 khi gửi 200 USD. Tuyến ngân hàng còn cần tiền gửi sẵn ở nước ngoài."
  },
  "journey": {
   "title": "Những khoảnh khắc chính",
   "hint": "Chạm vào một sự kiện để làm nó sáng lên trên dòng thời gian.",
   "price": "1 XRP ngày đó",
   "caveat": "Sự kiện và biến động giá có thể xảy ra cùng lúc mà không phải cái này gây ra cái kia.",
   "all": "Tất cả",
   "news": "theo bản tin"
  },
  "economics": {
   "title": "Máy tính đốt phí",
   "tx": "Số giao dịch mỗi ngày",
   "fee": "Phí trung bình mỗi giao dịch",
   "drops": "drop",
   "price": "Giá XRP",
   "burnedDay": "XRP bị đốt mỗi ngày",
   "burnedYear": "XRP bị đốt mỗi năm",
   "share": "Tỷ lệ tổng XRP bị đốt mỗi năm",
   "usd": "Giá trị bị đốt mỗi năm",
   "years": "Số năm để đốt 1% tổng XRP",
   "reset": "Dùng số liệu thật",
   "defaults": "Số liệu thật: trung bình tuần của Coin Metrics (5/2026); giá: giá đóng cửa theo bản tin ngày 14/11/2026.",
   "note": "1 XRP = 1.000.000 drop. Phí bị đốt khiến XRP khan hiếm hơn một chút xíu — đó không phải thu nhập của ai cả."
  },
  "verdict": {
   "title": "Bạn tự đánh giá",
   "forL": "Bằng chứng ủng hộ",
   "againstL": "Bằng chứng phản bác",
   "lean": [
    "Thuyết phục",
    "Còn lưỡng lự",
    "Không thuyết phục"
   ],
   "summary": "Quan điểm của bạn đến giờ",
   "answered": "đã trả lời",
   "reset": "Xoá",
   "note": "Một công cụ để suy nghĩ, không phải điểm số và không phải lời khuyên đầu tư.",
   "questions": [
    {
     "q": "Vấn đề có thật không?",
     "pro": [
      "Gửi 200 USD ra nước ngoài vẫn tốn trung bình 6,3% trong quý 3/2025 — gấp khoảng đôi mục tiêu 3%.",
      "Ngân hàng và công ty thanh toán phải để sẵn tiền ở nước ngoài để chi trả nhanh."
     ],
     "con": [
      "Khoảng 90% khoản thanh toán trên Swift đã tới ngân hàng nhận trong vòng một giờ.",
      "Các ứng dụng và đồng đô la số cũng đang giảm chi phí — mà không cần XRP."
     ]
    },
    {
     "q": "XRP Ledger có giải quyết tốt không?",
     "pro": [
      "Giao dịch hoàn tất sau 3–5 giây và phí chỉ là một phần rất nhỏ của 1 xu.",
      "Sàn tích hợp có thể đổi tiền ngay trong cùng một bước."
     ],
     "con": [
      "Tiền vẫn phải vào và ra qua ngân hàng và công ty được cấp phép.",
      "Kiểm tra danh tính, luật địa phương và mạng lưới chi trả không nhanh hơn chỉ vì sổ cái nhanh."
     ]
    },
    {
     "q": "Thanh toán có thực sự cần XRP?",
     "pro": [
      "XRP có thể làm cầu nối giữa hai đồng tiền nên không cần để sẵn tiền ở nước ngoài.",
      "Sổ cái tự dùng XRP khi điều đó cho giá tốt hơn."
     ],
     "con": [
      "Đồng đô la số như RLUSD cũng chuyển giá trị thẳng qua được.",
      "Cầu nối chỉ hiệu quả khi thị trường XRP đủ sâu ở cả hai đồng tiền."
     ]
    },
    {
     "q": "Đám mây pháp lý đã tan chưa?",
     "pro": [
      "Vụ kiện của SEC kết thúc vào tháng 8/2025.",
      "Các quỹ ETF XRP giao ngay tại Mỹ mở cửa tháng 11/2025."
     ],
     "con": [
      "Lệnh của toà vẫn hạn chế việc Ripple bán trực tiếp cho nhà đầu tư lớn.",
      "Ripple vẫn nắm một phần lớn XRP, gồm khoảng 31 tỷ trong escrow (9/2026)."
     ]
    },
    {
     "q": "Mức độ ứng dụng có phản ánh vào giá?",
     "pro": [
      "Tài sản thực được token hoá trên XRPL đạt khoảng 4,18 tỷ USD vào tháng 6/2026.",
      "Ripple tiếp tục mở rộng các mảng kinh doanh được cấp phép."
     ],
     "con": [
      "XRP giảm gần một nửa trong năm 2026 và đóng cửa dưới 1 USD vào tháng 11.",
      "Phí bị đốt, nên dùng nhiều hơn gần như không tạo thu nhập cho người giữ."
     ]
    }
   ]
  }
 }
};
