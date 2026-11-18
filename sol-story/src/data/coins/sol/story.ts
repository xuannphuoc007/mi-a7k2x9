/** Story copy for the Solana explainer (six acts), English and Vietnamese.
 * Beginner-first. Lawsuit claims are labelled as allegations, with the responses of those named. */
export type Beat = { title: string; body: string[]; notes?: string[]; deep?: string[] };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "Why are blockchains slow?",
    title: "Why are blockchains slow?",
    question: "If crypto is digital money, why can't you buy a coffee with it?",
    figure: "Minh tries to pay for a coffee on three blockchains: a slow single lane, a busier toll road with high fees, and a wide many-lane highway that settles in a fraction of a second.",
    takeaway: "Older blockchains are safe but slow and can get expensive. Solana's whole idea is one very fast, very cheap chain — fast enough for everyday payments.",
    beats: [
      {
        title: "No crypto knowledge needed. We start with a coffee.",
        body: ["Minh is a student in Hanoi. He wants to pay a friend back for a coffee — about $2 — using crypto. Scroll down; the picture tells the story."],
      },
      {
        title: "On Bitcoin, the coffee goes cold.",
        body: [
          "Bitcoin adds a new page (a \"block\") to its shared record about every 10 minutes and fits only around 7 payments per second. When it is busy, people bid higher fees to jump the queue.",
          "Ethereum is quicker — a block every 12 seconds — but in the 2021 boom a simple swap could cost tens of dollars.",
        ],
      },
      {
        title: "Solana's bet: one chain, many lanes.",
        body: [
          "Solana was designed to work more like a payment network than a slow ledger. Blocks come every fraction of a second, many transactions run side by side, and the basic fee is a tiny fraction of a cent.",
        ],
        notes: ["Base fee: 5,000 lamports (0.000005 SOL) per signature — Syndica, 2026."],
      },
      {
        title: "And people really use it.",
        body: [
          "In 2026 Solana handles around 100 million user transactions a day — more than 1,000 every second. That speed made it famous. It also brought outages, a crash with FTX, a meme-coin frenzy and lawsuits. This story covers all of it.",
        ],
        notes: ["≈ 97M non-vote transactions/day in Q3 2026 (crypto.news, from Solana's Allium data)."],
      },
    ],
  },
  {
    label: "A clock, two coffees and a beach",
    title: "A clock, two coffees and a beach",
    question: "Who built Solana, and who got the coins first?",
    figure: "A timeline from Anatoly Yakovenko's years at Qualcomm to the November 2017 Proof of History paper and the March 2020 launch, then a pie chart of how the first 500 million SOL were split.",
    takeaway: "Solana was started in 2017 by a former Qualcomm engineer with an idea for a blockchain \"clock\". Most of the first coins went to investors, the team, the foundation and a community reserve — only a small slice was sold to the public.",
    beats: [
      {
        title: "Anatoly Yakovenko — an engineer who hated waiting.",
        body: [
          "Anatoly spent more than a decade at Qualcomm, the mobile-chip company, then worked at Mesosphere and Dropbox. In November 2017 he wrote a short paper describing \"Proof of History\": a way for computers to agree on time without constantly asking each other.",
        ],
      },
      {
        title: "From \"Loom\" to Solana.",
        body: [
          "He started the project with Raj Gokal and former Qualcomm colleagues Greg Fitzgerald and Stephen Akridge. It was first called Loom; they renamed it after Solana Beach, the small Californian town where several of them had lived.",
        ],
      },
      {
        title: "Early investors bought cheaply.",
        body: [
          "Private sales in 2018–2019 sold SOL for between 4 and 25 cents. In March 2020 the public could join a CoinList auction: 8 million SOL at 22 cents — about $1.8 million in total. The network launched as a \"mainnet beta\" on 16 March 2020.",
        ],
        notes: ["CoinGecko token distribution; DefiLlama raises list."],
      },
      {
        title: "Who got the first 500 million SOL.",
        body: [
          "Roughly 35% went to early investors, 12.5% to the team and 12.5% to the Solana Foundation, and 38% to a community reserve for grants and growth. The public auction was about 1.6%. Most investor coins became tradeable in January 2021.",
          "Critics call this \"VC-heavy\"; supporters say the reserve paid for years of building. Both are true at once.",
        ],
      },
    ],
  },
  {
    label: "Six years in fast-forward",
    title: "Six years in fast-forward",
    question: "What has happened to Solana and SOL since 2020?",
    figure: "SOL's price from March 2020 to November 2026 on a log scale, drawn as the playhead advances; numbered pins mark launches, outages, the FTX crash, meme-coin records, ETFs and upgrades.",
    takeaway: "SOL went from under a dollar to about $295 in January 2025, crashing to $8 in between. In November 2026 it is near $70–75 — more than 40% below its price a year earlier — even as the network does more than ever.",
    beats: [
      {
        title: "2020: a quiet start under $1.",
        body: ["Solana launched in the middle of the COVID market crash. For months SOL traded below a dollar or two. Watch the line — each pin is a moment in the story."],
        notes: ["Price: estimated from Coin Metrics market-cap data ÷ supply, calibrated to monthly closes; dashed line = monthly closes and news reports."],
      },
      {
        title: "2021: \"Solana summer\".",
        body: [
          "Cheap fees drew NFT projects and traders from Ethereum. Big backers — above all Sam Bankman-Fried's FTX and Alameda — promoted it. SOL rose more than 100-fold to about $259 in November, despite a 17-hour outage in September.",
        ],
      },
      {
        title: "2022: everything goes wrong.",
        body: [
          "A $320 million bridge hack in February, more outages in spring, then the collapse of FTX in November. SOL fell to around $8 by the end of December — down 97% from its peak.",
        ],
      },
      {
        title: "2023–2025: the comeback.",
        body: [
          "Developers stayed. Fees stayed low. By late 2023 SOL was rising again; in January 2025 a meme coin launched by Donald Trump pulled in so many traders that SOL hit a record near $295.",
        ],
      },
      {
        title: "2025–2026: Wall Street arrives, prices cool.",
        body: [
          "U.S. funds holding SOL launched in October 2025, a second validator program went live and a new voting system replaced Solana's famous clock. Yet the meme hangover and a weak crypto market pushed SOL back to the $70s.",
        ],
      },
    ],
  },
  {
    label: "A clock everyone can trust",
    title: "A clock everyone can trust",
    question: "What was \"Proof of History\" — and why was it switched off?",
    figure: "A chain of hash beads ticks forward like a clock; transactions are stamped between ticks; validators take turns as leader on a ring. Then the clock fades and Alpenglow's voting cuts finality from about 12.8 seconds to about 0.15 seconds.",
    takeaway: "Proof of History was a cryptographic clock that let Solana order transactions without endless chatter. In October 2026 a faster voting system, Alpenglow, made it unnecessary — blocks now become final in about a sixth of a second.",
    beats: [
      {
        title: "The hard part of a blockchain is agreeing on order.",
        body: [
          "Thousands of computers around the world must agree which payment came first. Their clocks drift and messages arrive late, so most blockchains spend a lot of time talking before they agree.",
        ],
      },
      {
        title: "Proof of History: a clock you can check.",
        body: [
          "One computer runs a calculation over and over, each step feeding the next — like a long chain of fingerprints. It can't be rushed, but anyone can check it quickly. Stamp a transaction into the chain and you have proof of when it happened.",
        ],
        deep: ["Technically it is a sequential SHA-256 hash chain: each output is the input of the next, so the count of hashes works as a tick counter."],
      },
      {
        title: "Leaders take turns, known in advance.",
        body: [
          "Validators take turns being \"leader\" for a few slots at a time, on a schedule everyone knows. Transactions are sent straight to the next leader, which keeps things fast.",
        ],
      },
      {
        title: "October 2026: the clock retires.",
        body: [
          "A new voting system called Alpenglow went live on 21 October 2026. It removes Proof of History and the old voting rules, moves votes off the chain, and cuts the time until a payment is final from around 12.8 seconds to about 0.15 seconds.",
          "The idea that made Solana famous is gone — replaced by something faster.",
        ],
        notes: ["Activated at epoch 1064 (Solana Compass); ~150 ms target finality (Solana ecosystem roundup, Oct 2026)."],
      },
    ],
  },
  {
    label: "Many checkouts at once",
    title: "Many checkouts at once",
    question: "How can Solana be both fast and cheap?",
    figure: "Transactions flow into parallel lanes; only those touching the same account wait in line. A fee meter shows the 0.000005 SOL base fee, and slot length halves from 400 to 200 milliseconds.",
    takeaway: "Solana runs unrelated transactions side by side, like a supermarket with many checkouts. A busy app makes its own lane expensive without slowing everyone else.",
    beats: [
      {
        title: "Every transaction says what it will touch.",
        body: [
          "Before it runs, each Solana transaction lists the accounts it will read or change. If two transactions don't touch the same account, they can run at the same time on different processor cores.",
        ],
      },
      {
        title: "Only shoppers buying the same item queue together.",
        body: [
          "Think of a supermarket. Thousands of shoppers use different checkouts; only people fighting over the last discounted TV must wait in one line. On Solana, a hot new token makes its own line pricey — Minh's coffee payment is unaffected.",
        ],
      },
      {
        title: "A fraction of a cent.",
        body: [
          "The base fee is 0.000005 SOL per signature. Users can add a \"priority fee\" to jump ahead. Half of each base fee is destroyed (\"burned\"); the rest goes to the validator that made the block.",
        ],
        notes: ["Fee structure: Syndica, 2026."],
      },
      {
        title: "And it keeps getting faster.",
        body: [
          "On 9 October 2026 Solana halved its block time target from 400 to 200 milliseconds. Bigger blocks earlier in the year let it reach a record 5.2 billion user transactions in August 2026.",
        ],
        notes: ["Solana ecosystem roundup, Oct 2026; Solana Compass, Aug 2026."],
      },
    ],
  },
  {
    label: "Who runs the network?",
    title: "Who runs the network?",
    question: "Who keeps Solana running — and how is SOL created?",
    figure: "A ring of validators sized by stake, with about 68% of all SOL staked; then an inflation curve falling from 8% toward a 1.5% floor, and the steeper path voted in August 2026.",
    takeaway: "Fewer than 800 validators, backed by about 68% of all SOL, run Solana. New SOL is printed as staking rewards, with inflation slowly falling — and holders voted to cut it faster in 2026.",
    beats: [
      {
        title: "Validators: powerful computers that check every block.",
        body: [
          "Anyone can run one, but it takes a data-centre-class machine and very fast internet. Fewer than 800 validators were active in 2026, down from about 2,560 in March 2023 as costs rose and subsidies shrank.",
        ],
      },
      {
        title: "Staking: SOL holders lend weight to validators.",
        body: [
          "Holders \"stake\" SOL with a validator they trust and share its rewards. About 68% of all SOL is staked. A rough measure of decentralisation — how many of the largest validators would be needed to stall the chain — is only about 18–20.",
          "Unlike Ethereum, Solana does not yet confiscate (\"slash\") stake from validators that misbehave.",
        ],
      },
      {
        title: "Where new SOL comes from.",
        body: [
          "There is no maximum supply. New SOL is printed as staking rewards: inflation started at 8% a year and falls 15% each year towards a floor of 1.5%. In mid-2026 it was about 3.8%. Stakers keep up; people who don't stake slowly get diluted.",
        ],
      },
      {
        title: "August 2026: holders vote to cut faster.",
        body: [
          "A governance vote passed with just over two-thirds support to double the pace of the cuts — inflation falling 30% a year instead of 15%. Supporters say it helps SOL hold value; critics worry it squeezes small validators.",
        ],
        notes: ["The Block, 31 Aug 2026."],
      },
    ],
  },
  {
    label: "When the network stopped",
    title: "When the network stopped",
    question: "Why did Solana keep going down — and has it been fixed?",
    figure: "A heartbeat line of block production flatlines seven times between 2021 and 2024, then runs steadily as a day counter climbs past 1,000 days; a second software client, Firedancer, joins the original.",
    takeaway: "Between 2021 and early 2024 Solana fully stopped at least seven times. Since February 2024 it has not, and a second independent validator program now runs alongside the first — but the record is the main reason critics doubt it.",
    beats: [
      {
        title: "September 2021: 17 hours of silence.",
        body: [
          "Bots hammering a token sale sent so many transactions that validators ran out of memory and stopped agreeing. No new blocks for 17 hours; validators had to coordinate a manual restart.",
        ],
      },
      {
        title: "2022–2023: more stops.",
        body: [
          "Seven hours in April 2022 (bots fighting over an NFT mint), about 4.5 hours in June 2022 (a bug), a misconfigured node in October 2022, and about 19 hours in February 2023. Each time, money could not move.",
        ],
      },
      {
        title: "February 2024: the last one, so far.",
        body: [
          "A bug stopped blocks for about five hours. Since then, Solana has run without a full outage — 1,000 days in a row by early November 2026.",
        ],
        notes: ["Crypto Briefing; Solana status page, Nov 2026."],
      },
      {
        title: "A second engine: Firedancer.",
        body: [
          "For years every validator ran the same software, so one bug could stop them all. Jump Crypto wrote a separate program from scratch, Firedancer. A hybrid version arrived in 2024 and the full client in December 2025. Estimates of how much stake runs Jump's code vary widely — from about a sixth to well over a third, depending on whether the hybrid is counted.",
        ],
      },
    ],
  },
  {
    label: "The FTX winter",
    title: "The FTX winter",
    question: "What happened when Solana's biggest backer collapsed?",
    figure: "A tower labelled FTX/Alameda stands on a pile of SOL, then crumbles; the price tag falls from $35 to $13 to $8. Later an auction gavel sells locked SOL at $64.",
    takeaway: "FTX and Alameda were Solana's loudest backers and big holders. Their collapse in November 2022 sent SOL down to about $8. The bankrupt estate later sold its SOL at $64 and $102 — far above the bottom.",
    beats: [
      {
        title: "Sam Bankman-Fried loved Solana.",
        body: [
          "His exchange FTX and trading firm Alameda Research invested early, built projects on Solana and promoted it loudly. Alameda held a huge pile of SOL. At trial, Alameda's former CEO said coins tied to Sam were known as \"Sam coins\".",
        ],
      },
      {
        title: "February 2022: the Wormhole hack.",
        body: [
          "Before FTX fell, a hacker exploited Wormhole, a bridge connecting Solana and Ethereum, and took 120,000 wrapped ether — about $320 million. Jump Crypto replaced the money within a day.",
        ],
      },
      {
        title: "November 2022: FTX goes bankrupt.",
        body: [
          "FTX had used customers' money. When it collapsed, investors feared Alameda's SOL would be dumped. SOL fell from about $35 to $13 in days and to around $8 by the end of December. Some well-known NFT projects later left for other chains.",
        ],
      },
      {
        title: "2024: the estate sells — at much higher prices.",
        body: [
          "To repay FTX's customers, the estate sold its locked SOL: about 25–30 million at $64 (≈ $1.9 billion) to firms including Galaxy and Pantera, then the rest at about $102. Solana had survived its sponsor.",
        ],
      },
    ],
  },
  {
    label: "The meme-coin casino",
    title: "The meme-coin casino",
    question: "Why did Solana become the home of meme coins — and who lost?",
    figure: "Pump.fun spawns tokens like popcorn; daily launches peak at 95,578 on 26 January 2025. TRUMP and LIBRA rocket and fall; a lawsuit card labelled \"alleged · denied\" names Pump.fun and Solana organisations.",
    takeaway: "Cheap, fast transactions made Solana the main venue for meme coins. A few people got rich; most buyers lost. A U.S. class action calls it a rigged casino — Pump.fun and the Solana organisations deny it, and no court has ruled.",
    beats: [
      {
        title: "Pump.fun: a new coin in seconds, for cents.",
        body: [
          "Launched in January 2024, Pump.fun lets anyone create a token with a name and a picture. Early buyers get a lower price; if enough people buy, the token \"graduates\" to a normal exchange.",
        ],
      },
      {
        title: "95,578 new tokens in one day.",
        body: [
          "New tokens on Solana peaked on 26 January 2025 — Pump.fun made about 60% of them. Almost all were worth close to nothing within days — but the trading fees made Solana's validators and apps very busy.",
        ],
      },
      {
        title: "TRUMP and LIBRA.",
        body: [
          "On 17 January 2025 Donald Trump launched the TRUMP meme coin on Solana; its market value briefly approached $15 billion before falling more than 80%. Within three weeks, a Chainalysis analysis for The New York Times found about 813,000 wallets had lost a combined $2 billion. In February, LIBRA — promoted by Argentina's President Javier Milei — lost about $4.4 billion of value within hours.",
        ],
      },
      {
        title: "The lawsuit: \"a digital casino\" (alleged).",
        body: [
          "A U.S. class action filed in January 2025 and expanded since claims Pump.fun ran an unlicensed casino that took more than $5.5 billion from users — and names Solana Labs, the Solana Foundation, and Anatoly Yakovenko, Raj Gokal and Lily Liu. Those named deny it. A judge allowed expanded claims in December 2025; the case is ongoing.",
        ],
        notes: ["Status: allegations in a civil case, not court findings. Jito entities were dismissed in Sept 2025."],
      },
      {
        title: "\"Memecoins do not define Solana.\"",
        body: [
          "That is how Solana Foundation president Lily Liu put it in May 2026. The foundation now pushes payments, stablecoins and tokenised stocks. Meme trading has cooled — and with it, much of the fee income it brought.",
        ],
      },
    ],
  },
  {
    label: "Money apps on Solana",
    title: "Money apps on Solana",
    question: "What do people actually do with Solana besides trading memes?",
    figure: "Minh swaps SOL for a dollar stablecoin: Jupiter splits his order across Raydium and other exchanges. Then bars rise: $17.5 billion in stablecoins, $5 billion in tokenised real-world assets, $60 billion a month in DEX trades.",
    takeaway: "Solana has become a busy hub for swapping tokens, digital dollars and tokenised assets. Big names — PayPal, Western Union, Samsung Wallet, the DTCC — now build on it, but most of the money is still trading.",
    beats: [
      {
        title: "Swaps without a company in the middle.",
        body: [
          "Minh wants to swap SOL for USDC, a digital dollar. He uses Jupiter, an \"aggregator\" that splits his order across exchanges such as Raydium and Orca to find the best price. No account, no ID check — just his wallet.",
        ],
      },
      {
        title: "Digital dollars.",
        body: [
          "Stablecoins on Solana hit a record $17.5 billion in September 2026, held by about 14 million addresses. Samsung Wallet added USDC on Solana, and Western Union chose Solana for its USDPT stablecoin.",
        ],
        notes: ["Solana ecosystem roundups, Sept–Oct 2026."],
      },
      {
        title: "Stocks, funds and gold — as tokens.",
        body: [
          "Tokenised real-world assets reached a record $5 billion in October 2026. In November, the DTCC — the company that settles most U.S. stock trades — said it plans to connect its tokenisation service to Solana in the second half of 2027.",
        ],
      },
      {
        title: "The risks don't go away.",
        body: [
          "Apps can be hacked, bridges have been, and a token's price can collapse in minutes. Most activity is still trading — $60 billion of exchange volume in October 2026 alone. \"Faster\" doesn't mean \"safer\".",
        ],
      },
    ],
  },
  {
    label: "Security, fund or neither?",
    title: "Security, fund or neither?",
    question: "What do regulators say about SOL?",
    figure: "A courtroom stamp marks SOL \"security?\" in 2023, then the stamp is crossed out as the cases are dropped in 2025; ETF ticker boards for SOL funds light up on a building.",
    takeaway: "U.S. regulators called SOL a security in 2023 but dropped those cases in 2025 without a ruling. Since late 2025 ordinary investors can buy SOL through stock-market funds that even pass on staking rewards.",
    beats: [
      {
        title: "June 2023: \"SOL is a security.\"",
        body: [
          "In lawsuits against Binance and Coinbase, the U.S. Securities and Exchange Commission listed SOL among tokens it said were sold as investments. Robinhood removed SOL from its app for several months.",
        ],
      },
      {
        title: "2025: the cases are dropped.",
        body: [
          "Under a new administration the SEC dropped the Coinbase case in February 2025 and the Binance case in May 2025. No court ever decided whether SOL itself is a security — the question was simply left open.",
        ],
      },
      {
        title: "SOL in a brokerage account.",
        body: [
          "Canada approved spot SOL funds in April 2025. In the U.S., new listing rules in September 2025 opened the door, and Bitwise's BSOL — the first U.S. spot SOL fund that also stakes — began trading on 28 October 2025, followed by Grayscale and others.",
        ],
      },
    ],
  },
  {
    label: "The people behind it",
    title: "The people behind it",
    question: "Who steers Solana today?",
    figure: "A map with portraits of Anatoly Yakovenko, Raj Gokal and Lily Liu around the Solana mark, linked to Solana Labs, the Solana Foundation, Anza and Jump's Firedancer team.",
    takeaway: "No single company controls Solana, but a handful of organisations — Solana Labs, the Solana Foundation, Anza and Jump — write most of its code and steer its direction.",
    beats: [
      {
        title: "Three faces, several organisations.",
        body: [
          "Anatoly Yakovenko and Raj Gokal co-founded Solana Labs, the company that built the network. Lily Liu, a former CFO and co-founder of Earn.com, is president of the Solana Foundation, a non-profit in Zug, Switzerland that funds the ecosystem and promotes it. All three are named in the Pump.fun lawsuit and deny the claims.",
        ],
      },
      {
        title: "Who writes the code?",
        body: [
          "In 2024 most of Solana Labs' core engineers moved to a new firm, Anza, which maintains the original validator software (now called Agave). Jump Crypto builds the second client, Firedancer. More teams means less dependence on any one of them.",
        ],
      },
    ],
  },
  {
    label: "Bitcoin vs Ethereum vs Solana",
    title: "Bitcoin vs Ethereum vs Solana",
    question: "How does Solana compare with the two biggest coins?",
    figure: "Three coins side by side — Bitcoin, Ethereum, Solana — with rows for block time, fees, supply and how many computers run each network, and bubbles sized by market value in mid-November 2026.",
    takeaway: "Bitcoin is the slow, scarce one; Ethereum the large app platform that scales with add-on networks; Solana the fast, cheap single chain. Solana is far smaller by value — about $43 billion.",
    beats: [
      {
        title: "Three designs, three trade-offs.",
        body: [
          "Bitcoin keeps things simple and slow so almost anyone can check it. Ethereum keeps its main chain cautious and sends most activity to cheaper \"Layer 2\" networks. Solana puts everything on one fast chain — which needs bigger, more expensive machines.",
          "The table beside the picture lines them up.",
        ],
      },
    ],
  },
  {
    label: "Reality check",
    title: "Reality check",
    question: "So what is Solana really worth paying attention to?",
    figure: "A balance with strengths on one side — speed, low fees, activity, institutions, uptime — and risks on the other — outage history, fewer validators, meme reputation, lawsuits, competition. Then SOL's last 12 months: down more than 40%.",
    takeaway: "Solana is one of the most-used blockchains in the world, and also one of the most debated. Its technology has matured; its price has not followed. Watch usage, uptime and the lawsuits — not just the chart.",
    beats: [
      {
        title: "What it does well.",
        body: [
          "Fast, cheap and heavily used: more user transactions than all other major chains combined in August 2026, a record stablecoin supply, real companies building payments, U.S. funds, two independent validator clients and more than two and a half years without a full outage.",
        ],
      },
      {
        title: "What still worries people.",
        body: [
          "Its outage history; fewer validators and expensive hardware; a meme-coin reputation and a racketeering lawsuit naming its leaders; no supply cap; heavy competition from Ethereum's Layer 2s and newer fast chains; and SOL's dependence on trading activity.",
        ],
      },
      {
        title: "The last twelve months.",
        body: [
          "In mid-November 2026 SOL trades around $70–75 — more than 40% below a year earlier and roughly 75% below its January 2025 record. Network activity hit records at the same time. The price and the usage have stopped moving together.",
        ],
      },
      {
        title: "What to watch in 2027.",
        body: [
          "Whether Alpenglow stays stable, how much stake moves to Firedancer, the faster inflation cuts, the DTCC connection, and how the Pump.fun case ends. Not investment advice — the same coin can look strong or fragile depending on what you measure.",
        ],
      },
    ],
  },
  {
    label: "Minh's coffee, paid",
    title: "Minh's coffee, paid",
    question: "So — can Minh pay for that coffee now?",
    figure: "Minh's phone shows the coffee payment confirmed in a fraction of a second for less than a cent. The stage clears and a 3D SOL coin assembles and can be rotated.",
    takeaway: "Solana made a blockchain fast and cheap enough for a coffee. Whether that makes SOL a good investment is a separate — and much harder — question.",
    beats: [
      {
        title: "Paid. In under a second.",
        body: ["Minh's $2 arrives at his friend's wallet before he has put his phone down. The fee: a fraction of a cent. That was the whole point."],
      },
      {
        title: "But speed is not the whole story.",
        body: [
          "Minh now knows what sits underneath: a small group of builders and validators, a history of outages, a meme-coin casino and a price that swings wildly. A great network and a good investment are not the same thing.",
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
    label: "Vì sao blockchain chậm?",
    title: "Vì sao blockchain chậm?",
    question: "Nếu crypto là tiền số, sao không trả được ly cà phê?",
    figure: "Minh thử trả tiền cà phê trên ba blockchain: một làn đường chậm, một trạm thu phí đông và phí cao, và một xa lộ nhiều làn xác nhận trong chưa tới một giây.",
    takeaway: "Các blockchain đời đầu an toàn nhưng chậm và có lúc rất đắt. Ý tưởng của Solana là một chuỗi duy nhất cực nhanh, cực rẻ — đủ nhanh cho thanh toán hằng ngày.",
    beats: [
      {
        title: "Không cần biết gì về crypto. Bắt đầu từ một ly cà phê.",
        body: ["Minh là sinh viên ở Hà Nội. Cậu muốn trả bạn tiền ly cà phê — khoảng 2 USD — bằng crypto. Cứ cuộn xuống; hình vẽ sẽ kể câu chuyện."],
      },
      {
        title: "Trên Bitcoin, cà phê nguội mất.",
        body: [
          "Bitcoin thêm một trang mới (một \"khối\") vào sổ cái chung khoảng 10 phút một lần và chỉ chứa được chừng 7 giao dịch mỗi giây. Lúc đông, người ta trả phí cao hơn để chen lên trước.",
          "Ethereum nhanh hơn — 12 giây một khối — nhưng trong cơn sốt 2021, một lệnh đổi token đơn giản có thể tốn vài chục USD.",
        ],
      },
      {
        title: "Canh bạc của Solana: một chuỗi, nhiều làn.",
        body: [
          "Solana được thiết kế giống một mạng thanh toán hơn là một cuốn sổ chậm. Khối mới ra chưa tới một giây, nhiều giao dịch chạy song song, và phí cơ bản chỉ là một phần nhỏ của một xu.",
        ],
        notes: ["Phí cơ bản: 5.000 lamport (0,000005 SOL) mỗi chữ ký — Syndica, 2026."],
      },
      {
        title: "Và người ta dùng thật.",
        body: [
          "Năm 2026 Solana xử lý khoảng 100 triệu giao dịch của người dùng mỗi ngày — hơn 1.000 giao dịch mỗi giây. Tốc độ đó làm Solana nổi tiếng. Nó cũng kéo theo những lần sập mạng, cú sụp cùng FTX, cơn sốt meme coin và các vụ kiện. Câu chuyện này kể hết.",
        ],
        notes: ["≈ 97 triệu giao dịch không phải phiếu bầu/ngày trong Q3/2026 (crypto.news, theo dữ liệu Allium của Solana)."],
      },
    ],
  },
  {
    label: "Một chiếc đồng hồ, hai ly cà phê và một bãi biển",
    title: "Đồng hồ, cà phê và bãi biển",
    question: "Ai làm ra Solana, và ai có coin trước?",
    figure: "Dòng thời gian từ những năm Anatoly Yakovenko ở Qualcomm tới bài viết Proof of History tháng 11/2017 và ngày ra mắt tháng 3/2020, rồi biểu đồ tròn cho thấy 500 triệu SOL đầu tiên được chia thế nào.",
    takeaway: "Solana bắt đầu năm 2017 từ một kỹ sư cũ của Qualcomm với ý tưởng về \"chiếc đồng hồ\" cho blockchain. Phần lớn coin đầu tiên thuộc về nhà đầu tư, đội ngũ, quỹ và kho cộng đồng — chỉ một phần nhỏ được bán cho công chúng.",
    beats: [
      {
        title: "Anatoly Yakovenko — kỹ sư ghét phải chờ.",
        body: [
          "Anatoly làm hơn mười năm ở Qualcomm, hãng chip điện thoại, rồi tới Mesosphere và Dropbox. Tháng 11/2017 ông viết một bài ngắn mô tả \"Proof of History\": cách để các máy tính thống nhất về thời gian mà không phải liên tục hỏi nhau.",
        ],
      },
      {
        title: "Từ \"Loom\" thành Solana.",
        body: [
          "Ông lập dự án cùng Raj Gokal và hai đồng nghiệp cũ ở Qualcomm là Greg Fitzgerald và Stephen Akridge. Ban đầu dự án tên Loom; sau đó đổi theo tên Solana Beach, thị trấn nhỏ ở California nơi vài người trong nhóm từng sống.",
        ],
      },
      {
        title: "Nhà đầu tư sớm mua rất rẻ.",
        body: [
          "Các vòng bán riêng năm 2018–2019 bán SOL giá từ 4 tới 25 xu. Tháng 3/2020 công chúng mới được tham gia một phiên đấu giá trên CoinList: 8 triệu SOL giá 22 xu — tổng cộng khoảng 1,8 triệu USD. Mạng chạy bản \"mainnet beta\" từ 16/3/2020.",
        ],
        notes: ["Phân bổ token theo CoinGecko; danh sách gọi vốn của DefiLlama."],
      },
      {
        title: "500 triệu SOL đầu tiên về tay ai.",
        body: [
          "Khoảng 35% cho nhà đầu tư sớm, 12,5% cho đội ngũ, 12,5% cho Solana Foundation và 38% cho kho cộng đồng dùng để tài trợ và phát triển. Phiên đấu giá công khai chỉ khoảng 1,6%. Phần lớn coin của nhà đầu tư được mở khoá để giao dịch từ tháng 1/2021.",
          "Người phê bình gọi đây là cấu trúc \"nặng tay quỹ đầu tư\"; người ủng hộ nói kho cộng đồng đã nuôi nhiều năm xây dựng. Cả hai đều đúng.",
        ],
      },
    ],
  },
  {
    label: "Sáu năm tua nhanh",
    title: "Sáu năm tua nhanh",
    question: "Solana và SOL đã trải qua những gì từ 2020?",
    figure: "Giá SOL từ tháng 3/2020 tới tháng 11/2026 trên thang log, vẽ dần theo đầu đọc; các ghim đánh số đánh dấu ra mắt, sập mạng, cú sụp FTX, kỷ lục meme coin, quỹ ETF và nâng cấp.",
    takeaway: "SOL đi từ dưới 1 USD lên khoảng 295 USD vào tháng 1/2025, có lúc rơi xuống 8 USD ở giữa. Tháng 11/2026 giá quanh 70–75 USD — giảm hơn 40% so với một năm trước — dù mạng đang hoạt động sôi động hơn bao giờ hết.",
    beats: [
      {
        title: "2020: khởi đầu lặng lẽ dưới 1 USD.",
        body: ["Solana ra mắt giữa lúc thị trường sập vì COVID. Nhiều tháng liền SOL chỉ có giá một hai USD. Hãy nhìn đường giá — mỗi ghim là một khoảnh khắc trong câu chuyện."],
        notes: ["Giá: ước tính từ vốn hoá của Coin Metrics ÷ nguồn cung, hiệu chỉnh theo giá đóng cửa tháng; nét đứt = giá đóng cửa tháng và số liệu báo chí."],
      },
      {
        title: "2021: \"Mùa hè Solana\".",
        body: [
          "Phí rẻ kéo các dự án NFT và người giao dịch từ Ethereum sang. Những người ủng hộ lớn — nhất là FTX và Alameda của Sam Bankman-Fried — quảng bá rầm rộ. SOL tăng hơn 100 lần lên khoảng 259 USD vào tháng 11, dù tháng 9 mạng vừa sập 17 giờ.",
        ],
      },
      {
        title: "2022: mọi thứ đổ vỡ.",
        body: [
          "Tháng 2 cầu nối bị hack 320 triệu USD, mùa xuân thêm nhiều lần sập mạng, rồi tháng 11 FTX sụp đổ. Cuối tháng 12, SOL chỉ còn khoảng 8 USD — mất 97% so với đỉnh.",
        ],
      },
      {
        title: "2023–2025: cú trở lại.",
        body: [
          "Lập trình viên ở lại. Phí vẫn rẻ. Cuối 2023 SOL tăng trở lại; tháng 1/2025 meme coin do ông Donald Trump tung ra kéo vào đông người giao dịch tới mức SOL lập kỷ lục gần 295 USD.",
        ],
      },
      {
        title: "2025–2026: Phố Wall tới, giá hạ nhiệt.",
        body: [
          "Các quỹ Mỹ nắm giữ SOL ra mắt tháng 10/2025, phần mềm validator thứ hai chạy thật, và một hệ thống bỏ phiếu mới thay thế \"chiếc đồng hồ\" nổi tiếng của Solana. Nhưng dư âm cơn sốt meme và thị trường crypto yếu đẩy SOL về vùng 70 USD.",
        ],
      },
    ],
  },
  {
    label: "Chiếc đồng hồ ai cũng tin",
    title: "Chiếc đồng hồ ai cũng tin",
    question: "\"Proof of History\" là gì — và vì sao bị tắt?",
    figure: "Một chuỗi hạt băm nhích dần như kim đồng hồ; giao dịch được đóng dấu giữa các nhịp; validator lần lượt làm trưởng nhóm trên một vòng tròn. Rồi đồng hồ mờ đi và cơ chế Alpenglow rút thời gian chốt từ khoảng 12,8 giây xuống khoảng 0,15 giây.",
    takeaway: "Proof of History là chiếc đồng hồ mật mã giúp Solana sắp thứ tự giao dịch mà không phải bàn bạc mãi. Tháng 10/2026 một hệ thống bỏ phiếu nhanh hơn, Alpenglow, khiến nó không còn cần thiết — giờ khối được chốt trong khoảng 1/6 giây.",
    beats: [
      {
        title: "Phần khó nhất của blockchain là thống nhất thứ tự.",
        body: [
          "Hàng nghìn máy tính khắp thế giới phải đồng ý khoản thanh toán nào tới trước. Đồng hồ của chúng lệch nhau, tin nhắn tới trễ, nên đa số blockchain tốn nhiều thời gian trao đổi trước khi thống nhất.",
        ],
      },
      {
        title: "Proof of History: chiếc đồng hồ ai cũng kiểm tra được.",
        body: [
          "Một máy tính chạy đi chạy lại một phép tính, bước sau lấy kết quả bước trước — như một chuỗi dấu vân tay dài. Không thể làm nhanh hơn, nhưng ai cũng kiểm tra lại được rất nhanh. Đóng dấu một giao dịch vào chuỗi là có bằng chứng nó xảy ra lúc nào.",
        ],
        deep: ["Về kỹ thuật, đó là chuỗi băm SHA-256 tuần tự: đầu ra của bước này là đầu vào của bước sau, nên số lần băm đóng vai trò bộ đếm nhịp."],
      },
      {
        title: "Trưởng nhóm thay phiên, biết trước lịch.",
        body: [
          "Các validator lần lượt làm \"leader\" (trưởng nhóm) trong vài slot, theo lịch mà ai cũng biết. Giao dịch được gửi thẳng tới leader kế tiếp, nhờ vậy mọi thứ chạy nhanh.",
        ],
      },
      {
        title: "Tháng 10/2026: đồng hồ nghỉ hưu.",
        body: [
          "Hệ thống bỏ phiếu mới tên Alpenglow chạy từ 21/10/2026. Nó bỏ Proof of History và luật bỏ phiếu cũ, đưa phiếu bầu ra khỏi chuỗi, và rút thời gian để một khoản thanh toán được chốt từ khoảng 12,8 giây xuống khoảng 0,15 giây.",
          "Ý tưởng làm nên tên tuổi Solana đã ra đi — thay bằng thứ nhanh hơn.",
        ],
        notes: ["Kích hoạt ở epoch 1064 (Solana Compass); mục tiêu chốt ~150 ms (bản tin hệ sinh thái Solana, 10/2026)."],
      },
    ],
  },
  {
    label: "Nhiều quầy thu ngân cùng lúc",
    title: "Nhiều quầy thu ngân cùng lúc",
    question: "Làm sao Solana vừa nhanh vừa rẻ?",
    figure: "Giao dịch chảy vào các làn song song; chỉ những giao dịch đụng cùng một tài khoản mới phải xếp hàng. Đồng hồ phí hiện mức phí cơ bản 0,000005 SOL, và độ dài slot giảm một nửa từ 400 xuống 200 mili giây.",
    takeaway: "Solana chạy song song những giao dịch không liên quan nhau, như siêu thị có nhiều quầy tính tiền. Một ứng dụng đang hot chỉ làm đắt làn của chính nó, không làm chậm người khác.",
    beats: [
      {
        title: "Mỗi giao dịch khai trước sẽ đụng vào đâu.",
        body: [
          "Trước khi chạy, mỗi giao dịch Solana liệt kê các tài khoản nó sẽ đọc hoặc sửa. Nếu hai giao dịch không đụng cùng tài khoản, chúng chạy cùng lúc trên các nhân xử lý khác nhau.",
        ],
      },
      {
        title: "Chỉ người mua cùng món mới phải xếp chung hàng.",
        body: [
          "Hãy nghĩ tới siêu thị. Hàng nghìn người dùng các quầy khác nhau; chỉ ai tranh nhau chiếc TV giảm giá cuối cùng mới phải chờ chung một hàng. Trên Solana, một token mới đang sốt chỉ làm đắt hàng của nó — khoản trả cà phê của Minh không bị ảnh hưởng.",
        ],
      },
      {
        title: "Chưa tới một xu.",
        body: [
          "Phí cơ bản là 0,000005 SOL mỗi chữ ký. Người dùng có thể trả thêm \"phí ưu tiên\" để được xử lý trước. Một nửa phí cơ bản bị huỷ (\"đốt\"); nửa còn lại vào tay validator tạo khối.",
        ],
        notes: ["Cấu trúc phí: Syndica, 2026."],
      },
      {
        title: "Và vẫn đang nhanh hơn nữa.",
        body: [
          "Ngày 9/10/2026 Solana giảm một nửa thời gian mục tiêu mỗi khối, từ 400 xuống 200 mili giây. Trước đó, khối được nới rộng giúp mạng đạt kỷ lục 5,2 tỷ giao dịch người dùng trong tháng 8/2026.",
        ],
        notes: ["Bản tin hệ sinh thái Solana, 10/2026; Solana Compass, 8/2026."],
      },
    ],
  },
  {
    label: "Ai vận hành mạng?",
    title: "Ai vận hành mạng?",
    question: "Ai giữ cho Solana chạy — và SOL mới được tạo ra thế nào?",
    figure: "Một vòng validator có kích thước theo lượng stake, khoảng 68% tổng SOL đang được stake; rồi đường lạm phát giảm từ 8% về mức sàn 1,5%, cùng lộ trình dốc hơn được bỏ phiếu thông qua tháng 8/2026.",
    takeaway: "Chưa tới 800 validator, được khoảng 68% tổng số SOL hậu thuẫn, vận hành Solana. SOL mới được in ra làm phần thưởng staking, lạm phát giảm dần — và năm 2026 người nắm giữ đã bỏ phiếu cắt nhanh hơn.",
    beats: [
      {
        title: "Validator: những máy tính mạnh kiểm tra từng khối.",
        body: [
          "Ai cũng có thể chạy một validator, nhưng cần máy cấu hình cỡ trung tâm dữ liệu và internet rất nhanh. Năm 2026 có chưa tới 800 validator hoạt động, giảm từ khoảng 2.560 hồi tháng 3/2023 vì chi phí tăng và trợ cấp giảm.",
        ],
      },
      {
        title: "Staking: người giữ SOL góp sức cho validator.",
        body: [
          "Người giữ SOL \"stake\" (gửi) SOL vào một validator họ tin và chia phần thưởng. Khoảng 68% tổng SOL đang được stake. Một thước đo thô về phi tập trung — cần bao nhiêu validator lớn nhất cộng lại để làm tê liệt mạng — chỉ khoảng 18–20.",
          "Khác Ethereum, Solana hiện chưa tịch thu (\"slash\") stake của validator gian lận.",
        ],
      },
      {
        title: "SOL mới từ đâu ra.",
        body: [
          "Không có nguồn cung tối đa. SOL mới được in ra làm phần thưởng staking: lạm phát bắt đầu ở 8%/năm và giảm 15% mỗi năm về mức sàn 1,5%. Giữa 2026 lạm phát khoảng 3,8%. Người stake theo kịp; người không stake bị pha loãng dần.",
        ],
      },
      {
        title: "Tháng 8/2026: bỏ phiếu cắt nhanh hơn.",
        body: [
          "Một cuộc bỏ phiếu quản trị được thông qua với hơn 2/3 ủng hộ, tăng gấp đôi tốc độ cắt giảm — lạm phát giảm 30% mỗi năm thay vì 15%. Phe ủng hộ nói giúp SOL giữ giá trị; phe phản đối lo validator nhỏ bị bóp nghẹt.",
        ],
        notes: ["The Block, 31/8/2026."],
      },
    ],
  },
  {
    label: "Khi mạng ngừng chạy",
    title: "Khi mạng ngừng chạy",
    question: "Vì sao Solana cứ sập — và đã sửa được chưa?",
    figure: "Đường nhịp tim của việc tạo khối đứng im bảy lần từ 2021 tới 2024, rồi chạy đều trong khi bộ đếm ngày vượt mốc 1.000; phần mềm thứ hai, Firedancer, chạy song song với bản gốc.",
    takeaway: "Từ 2021 tới đầu 2024 Solana dừng hẳn ít nhất bảy lần. Từ tháng 2/2024 chưa dừng lần nào, và giờ có thêm phần mềm validator độc lập thứ hai — nhưng lịch sử này vẫn là lý do chính khiến nhiều người nghi ngờ.",
    beats: [
      {
        title: "Tháng 9/2021: 17 giờ im lặng.",
        body: [
          "Bot dội vào một đợt mở bán token nhiều giao dịch tới mức validator hết bộ nhớ và không còn thống nhất được. Không có khối mới trong 17 giờ; các validator phải phối hợp khởi động lại bằng tay.",
        ],
      },
      {
        title: "2022–2023: lại dừng tiếp.",
        body: [
          "Bảy giờ vào tháng 4/2022 (bot tranh nhau đúc NFT), khoảng 4,5 giờ tháng 6/2022 (lỗi phần mềm), một máy cấu hình sai tháng 10/2022, và khoảng 19 giờ tháng 2/2023. Mỗi lần như vậy, tiền không thể chuyển đi.",
        ],
      },
      {
        title: "Tháng 2/2024: lần cuối, tính tới giờ.",
        body: [
          "Một lỗi phần mềm làm ngừng tạo khối khoảng 5 giờ. Từ đó Solana chạy liên tục không dừng hẳn lần nào — tròn 1.000 ngày vào đầu tháng 11/2026.",
        ],
        notes: ["Crypto Briefing; trang trạng thái Solana, 11/2026."],
      },
      {
        title: "Động cơ thứ hai: Firedancer.",
        body: [
          "Nhiều năm liền mọi validator chạy cùng một phần mềm, nên một lỗi có thể làm dừng tất cả. Jump Crypto viết lại từ đầu một chương trình riêng, Firedancer. Bản lai ra mắt năm 2024, bản đầy đủ tháng 12/2025. Ước tính lượng stake chạy mã của Jump chênh nhau nhiều — từ khoảng 1/6 tới hơn 1/3, tuỳ có tính bản lai hay không.",
        ],
      },
    ],
  },
  {
    label: "Mùa đông FTX",
    title: "Mùa đông FTX",
    question: "Chuyện gì xảy ra khi nhà bảo trợ lớn nhất của Solana sụp đổ?",
    figure: "Toà tháp FTX/Alameda đứng trên đống SOL rồi đổ sụp; nhãn giá rơi từ 35 xuống 13 rồi 8 USD. Sau đó búa đấu giá bán số SOL bị khoá với giá 64 USD.",
    takeaway: "FTX và Alameda là những người ủng hộ ồn ào nhất và nắm rất nhiều SOL. Cú sụp tháng 11/2022 kéo SOL xuống khoảng 8 USD. Về sau, bên quản lý tài sản phá sản bán SOL với giá 64 và 102 USD — cao hơn nhiều so với đáy.",
    beats: [
      {
        title: "Sam Bankman-Fried mê Solana.",
        body: [
          "Sàn FTX và công ty giao dịch Alameda Research của ông đầu tư sớm, xây dự án trên Solana và quảng bá rầm rộ. Alameda nắm một lượng SOL khổng lồ. Tại phiên toà, cựu CEO Alameda nói các đồng coin gắn với Sam được gọi là \"Sam coins\".",
        ],
      },
      {
        title: "Tháng 2/2022: vụ hack Wormhole.",
        body: [
          "Trước khi FTX sụp, một hacker khai thác lỗ hổng của Wormhole, cầu nối giữa Solana và Ethereum, lấy 120.000 wETH — khoảng 320 triệu USD. Jump Crypto bù lại toàn bộ trong vòng một ngày.",
        ],
      },
      {
        title: "Tháng 11/2022: FTX phá sản.",
        body: [
          "FTX đã dùng tiền của khách. Khi nó sụp, nhà đầu tư sợ Alameda xả SOL. Giá SOL rơi từ khoảng 35 xuống 13 USD trong vài ngày và còn khoảng 8 USD cuối tháng 12. Một số dự án NFT nổi tiếng sau đó chuyển sang chuỗi khác.",
        ],
      },
      {
        title: "2024: bán tài sản — với giá cao hơn nhiều.",
        body: [
          "Để trả tiền cho khách hàng FTX, bên quản lý tài sản bán số SOL bị khoá: khoảng 25–30 triệu SOL giá 64 USD (≈ 1,9 tỷ USD) cho các quỹ như Galaxy và Pantera, phần còn lại khoảng 102 USD. Solana đã sống sót sau khi mất nhà bảo trợ.",
        ],
      },
    ],
  },
  {
    label: "Sòng bạc meme coin",
    title: "Sòng bạc meme coin",
    question: "Vì sao Solana thành nhà của meme coin — và ai thua?",
    figure: "Pump.fun nổ token như bỏng ngô; số token ra đời mỗi ngày đạt đỉnh 95.578 vào 26/1/2025. TRUMP và LIBRA vọt lên rồi rơi; thẻ vụ kiện ghi \"cáo buộc · bị phủ nhận\" nêu tên Pump.fun và các tổ chức Solana.",
    takeaway: "Giao dịch rẻ và nhanh biến Solana thành nơi chính để chơi meme coin. Vài người giàu lên; đa số người mua thua lỗ. Một vụ kiện tập thể ở Mỹ gọi đó là sòng bạc gian lận — Pump.fun và các tổ chức Solana phủ nhận, toà chưa phán quyết.",
    beats: [
      {
        title: "Pump.fun: coin mới trong vài giây, vài xu.",
        body: [
          "Ra mắt tháng 1/2024, Pump.fun cho phép bất kỳ ai tạo token chỉ với một cái tên và một tấm hình. Người mua sớm được giá thấp; nếu đủ người mua, token \"tốt nghiệp\" lên sàn giao dịch thông thường.",
        ],
      },
      {
        title: "95.578 token mới trong một ngày.",
        body: [
          "Số token mới trên Solana đạt đỉnh ngày 26/1/2025 — khoảng 60% tạo qua Pump.fun. Gần như tất cả chỉ còn giá trị xấp xỉ bằng không sau vài ngày — nhưng phí giao dịch khiến validator và ứng dụng trên Solana bận rộn chưa từng thấy.",
        ],
      },
      {
        title: "TRUMP và LIBRA.",
        body: [
          "Ngày 17/1/2025 ông Donald Trump tung meme coin TRUMP trên Solana; vốn hoá có lúc gần 15 tỷ USD rồi mất hơn 80%. Chỉ sau ba tuần, phân tích của Chainalysis cho báo New York Times cho thấy khoảng 813.000 ví lỗ tổng cộng 2 tỷ USD. Tháng 2, LIBRA — được Tổng thống Argentina Javier Milei quảng bá — mất khoảng 4,4 tỷ USD giá trị chỉ trong vài giờ.",
        ],
      },
      {
        title: "Vụ kiện: \"sòng bạc số\" (cáo buộc).",
        body: [
          "Một vụ kiện tập thể ở Mỹ nộp tháng 1/2025 và được mở rộng sau đó cáo buộc Pump.fun vận hành sòng bạc không phép, rút hơn 5,5 tỷ USD từ người dùng — và nêu tên Solana Labs, Solana Foundation, cùng Anatoly Yakovenko, Raj Gokal và Lily Liu. Những người bị nêu tên phủ nhận. Tháng 12/2025 thẩm phán cho phép mở rộng cáo buộc; vụ án vẫn đang tiếp diễn.",
        ],
        notes: ["Tình trạng: cáo buộc trong vụ dân sự, chưa phải kết luận của toà. Các đơn vị Jito đã được rút khỏi vụ kiện tháng 9/2025."],
      },
      {
        title: "\"Meme coin không định nghĩa Solana.\"",
        body: [
          "Đó là lời Chủ tịch Solana Foundation Lily Liu hồi tháng 5/2026. Quỹ giờ đẩy mạnh thanh toán, stablecoin và cổ phiếu token hoá. Cơn sốt meme đã nguội — kéo theo phần lớn nguồn phí nó từng mang lại.",
        ],
      },
    ],
  },
  {
    label: "Ứng dụng tài chính trên Solana",
    title: "Ứng dụng tài chính trên Solana",
    question: "Ngoài chơi meme, người ta thật sự làm gì với Solana?",
    figure: "Minh đổi SOL lấy đồng đô la số: Jupiter chia lệnh của cậu qua Raydium và các sàn khác. Rồi các cột dâng lên: 17,5 tỷ USD stablecoin, 5 tỷ USD tài sản thực token hoá, 60 tỷ USD giao dịch DEX mỗi tháng.",
    takeaway: "Solana thành trung tâm sôi động để đổi token, giữ đô la số và tài sản token hoá. Những tên tuổi lớn — PayPal, Western Union, Samsung Wallet, DTCC — đang xây trên đó, nhưng phần lớn dòng tiền vẫn là giao dịch đầu cơ.",
    beats: [
      {
        title: "Đổi token mà không cần công ty đứng giữa.",
        body: [
          "Minh muốn đổi SOL lấy USDC, một đồng đô la số. Cậu dùng Jupiter, một \"bộ gom lệnh\" chia lệnh qua các sàn như Raydium và Orca để tìm giá tốt nhất. Không cần tài khoản, không cần xác minh danh tính — chỉ cần ví.",
        ],
      },
      {
        title: "Đô la số.",
        body: [
          "Stablecoin trên Solana đạt kỷ lục 17,5 tỷ USD vào tháng 9/2026, nằm trong khoảng 14 triệu địa chỉ. Samsung Wallet thêm USDC trên Solana, và Western Union chọn Solana cho stablecoin USDPT của mình.",
        ],
        notes: ["Bản tin hệ sinh thái Solana, 9–10/2026."],
      },
      {
        title: "Cổ phiếu, quỹ và vàng — dưới dạng token.",
        body: [
          "Tài sản thực được token hoá đạt kỷ lục 5 tỷ USD vào tháng 10/2026. Tháng 11, DTCC — công ty thanh toán bù trừ phần lớn giao dịch cổ phiếu ở Mỹ — cho biết dự định kết nối dịch vụ token hoá của mình với Solana trong nửa cuối 2027.",
        ],
      },
      {
        title: "Rủi ro không biến mất.",
        body: [
          "Ứng dụng có thể bị hack, cầu nối đã từng bị hack, và giá một token có thể sập trong vài phút. Phần lớn hoạt động vẫn là giao dịch — riêng tháng 10/2026 có 60 tỷ USD khối lượng trên các sàn. \"Nhanh hơn\" không có nghĩa là \"an toàn hơn\".",
        ],
      },
    ],
  },
  {
    label: "Chứng khoán, quỹ hay không gì cả?",
    title: "Chứng khoán, quỹ, hay không gì cả?",
    question: "Cơ quan quản lý nói gì về SOL?",
    figure: "Con dấu toà án đóng chữ \"chứng khoán?\" lên SOL năm 2023, rồi bị gạch đi khi các vụ kiện được rút năm 2025; bảng điện tử các quỹ ETF SOL sáng lên trên một toà nhà.",
    takeaway: "Năm 2023 cơ quan quản lý Mỹ gọi SOL là chứng khoán nhưng rút các vụ kiện năm 2025 mà không có phán quyết. Từ cuối 2025, nhà đầu tư thông thường có thể mua SOL qua quỹ niêm yết trên sàn chứng khoán, thậm chí nhận cả lãi staking.",
    beats: [
      {
        title: "Tháng 6/2023: \"SOL là chứng khoán.\"",
        body: [
          "Trong các vụ kiện Binance và Coinbase, Uỷ ban Chứng khoán Mỹ (SEC) liệt SOL vào danh sách token mà họ cho là được bán như một khoản đầu tư. Robinhood gỡ SOL khỏi ứng dụng trong vài tháng.",
        ],
      },
      {
        title: "2025: các vụ kiện bị rút.",
        body: [
          "Dưới chính quyền mới, SEC rút vụ Coinbase tháng 2/2025 và vụ Binance tháng 5/2025. Chưa toà nào quyết định bản thân SOL có phải chứng khoán hay không — câu hỏi đơn giản là bị bỏ ngỏ.",
        ],
      },
      {
        title: "SOL trong tài khoản chứng khoán.",
        body: [
          "Canada duyệt các quỹ SOL giao ngay tháng 4/2025. Ở Mỹ, quy tắc niêm yết mới tháng 9/2025 mở đường, và quỹ BSOL của Bitwise — quỹ SOL giao ngay đầu tiên ở Mỹ có staking — bắt đầu giao dịch ngày 28/10/2025, tiếp theo là Grayscale và các quỹ khác.",
        ],
      },
    ],
  },
  {
    label: "Những người đứng sau",
    title: "Những người đứng sau",
    question: "Ai đang lèo lái Solana?",
    figure: "Bản đồ với chân dung Anatoly Yakovenko, Raj Gokal và Lily Liu quanh biểu tượng Solana, nối tới Solana Labs, Solana Foundation, Anza và đội Firedancer của Jump.",
    takeaway: "Không công ty nào kiểm soát Solana một mình, nhưng một nhóm nhỏ tổ chức — Solana Labs, Solana Foundation, Anza và Jump — viết phần lớn mã nguồn và định hướng đi.",
    beats: [
      {
        title: "Ba gương mặt, vài tổ chức.",
        body: [
          "Anatoly Yakovenko và Raj Gokal đồng sáng lập Solana Labs, công ty xây dựng mạng lưới. Lily Liu, từng là CFO và đồng sáng lập Earn.com, là chủ tịch Solana Foundation — tổ chức phi lợi nhuận ở Zug (Thuỵ Sĩ) tài trợ và quảng bá hệ sinh thái. Cả ba đều bị nêu tên trong vụ kiện Pump.fun và đều phủ nhận cáo buộc.",
        ],
      },
      {
        title: "Ai viết mã?",
        body: [
          "Năm 2024 phần lớn kỹ sư lõi của Solana Labs chuyển sang công ty mới Anza, nơi duy trì phần mềm validator gốc (nay tên Agave). Jump Crypto xây phần mềm thứ hai, Firedancer. Càng nhiều đội, càng ít phụ thuộc vào một bên.",
        ],
      },
    ],
  },
  {
    label: "Bitcoin vs Ethereum vs Solana",
    title: "Bitcoin vs Ethereum vs Solana",
    question: "Solana so với hai đồng lớn nhất thì sao?",
    figure: "Ba đồng coin cạnh nhau — Bitcoin, Ethereum, Solana — với các hàng thời gian tạo khối, phí, nguồn cung và số máy vận hành mạng, cùng bong bóng có kích thước theo vốn hoá giữa tháng 11/2026.",
    takeaway: "Bitcoin chậm và khan hiếm; Ethereum là nền tảng ứng dụng lớn mở rộng nhờ các mạng phụ; Solana là một chuỗi duy nhất nhanh và rẻ. Solana nhỏ hơn nhiều về giá trị — khoảng 43 tỷ USD.",
    beats: [
      {
        title: "Ba thiết kế, ba sự đánh đổi.",
        body: [
          "Bitcoin giữ mọi thứ đơn giản và chậm để gần như ai cũng kiểm tra được. Ethereum giữ chuỗi chính thận trọng và đẩy phần lớn hoạt động sang các mạng \"Layer 2\" rẻ hơn. Solana đặt tất cả lên một chuỗi nhanh — đổi lại cần máy lớn và đắt hơn.",
          "Bảng bên cạnh hình đặt ba đồng cạnh nhau.",
        ],
      },
    ],
  },
  {
    label: "Nhìn thẳng thực tế",
    title: "Nhìn thẳng thực tế",
    question: "Vậy Solana thực sự đáng chú ý ở điểm nào?",
    figure: "Một chiếc cân: một bên là điểm mạnh — tốc độ, phí thấp, hoạt động, tổ chức lớn, thời gian chạy ổn định; bên kia là rủi ro — lịch sử sập mạng, ít validator hơn, tiếng xấu meme, vụ kiện, cạnh tranh. Rồi 12 tháng gần nhất của SOL: giảm hơn 40%.",
    takeaway: "Solana là một trong những blockchain được dùng nhiều nhất thế giới, và cũng là một trong những chuỗi gây tranh cãi nhất. Công nghệ đã trưởng thành; giá thì chưa theo kịp. Hãy theo dõi mức sử dụng, độ ổn định và các vụ kiện — không chỉ biểu đồ giá.",
    beats: [
      {
        title: "Điểm mạnh.",
        body: [
          "Nhanh, rẻ và được dùng nhiều: tháng 8/2026 số giao dịch người dùng nhiều hơn tất cả các chuỗi lớn khác cộng lại, lượng stablecoin kỷ lục, doanh nghiệp thật xây hệ thống thanh toán, các quỹ ở Mỹ, hai phần mềm validator độc lập và hơn hai năm rưỡi không dừng mạng.",
        ],
      },
      {
        title: "Điều vẫn khiến người ta lo.",
        body: [
          "Lịch sử sập mạng; ít validator hơn và phần cứng đắt; tiếng xấu meme coin cùng vụ kiện theo luật chống tổ chức tội phạm (RICO) nêu tên lãnh đạo; không có trần nguồn cung; cạnh tranh gắt từ các Layer 2 của Ethereum và những chuỗi nhanh mới; và giá SOL phụ thuộc vào hoạt động giao dịch.",
        ],
      },
      {
        title: "Mười hai tháng qua.",
        body: [
          "Giữa tháng 11/2026 SOL ở quanh 70–75 USD — giảm hơn 40% so với một năm trước và thấp hơn khoảng 75% so với kỷ lục tháng 1/2025. Cùng lúc đó, hoạt động trên mạng lập kỷ lục. Giá và mức sử dụng không còn đi cùng nhau.",
        ],
      },
      {
        title: "Điều cần theo dõi năm 2027.",
        body: [
          "Alpenglow có ổn định không, bao nhiêu stake chuyển sang Firedancer, lộ trình cắt lạm phát nhanh hơn, kết nối với DTCC, và vụ Pump.fun kết thúc thế nào. Không phải lời khuyên đầu tư — cùng một đồng coin có thể trông mạnh hay mong manh tuỳ bạn đo cái gì.",
        ],
      },
    ],
  },
  {
    label: "Ly cà phê của Minh, đã trả",
    title: "Ly cà phê của Minh, đã trả",
    question: "Vậy — giờ Minh trả được ly cà phê chưa?",
    figure: "Điện thoại của Minh báo khoản trả tiền cà phê đã được xác nhận trong chưa tới một giây với phí chưa tới một xu. Sân khấu trống dần và đồng SOL 3D ghép lại, có thể xoay.",
    takeaway: "Solana đã làm blockchain đủ nhanh và rẻ cho một ly cà phê. Còn SOL có phải khoản đầu tư tốt hay không là một câu hỏi khác — và khó hơn nhiều.",
    beats: [
      {
        title: "Đã trả. Chưa tới một giây.",
        body: ["2 USD của Minh tới ví của bạn trước khi cậu kịp đặt điện thoại xuống. Phí: chưa tới một xu. Đó chính là mục đích ban đầu."],
      },
      {
        title: "Nhưng tốc độ chưa phải tất cả.",
        body: [
          "Giờ Minh đã biết bên dưới là gì: một nhóm nhỏ người xây và validator, lịch sử sập mạng, một sòng bạc meme coin và một mức giá lên xuống dữ dội. Một mạng lưới tốt và một khoản đầu tư tốt không phải là một.",
        ],
      },
      {
        title: "Lật đồng coin.",
        body: ["Kéo đồng SOL để xoay. Nguồn của mọi con số có ở bên dưới."],
      },
    ],
  },
];
