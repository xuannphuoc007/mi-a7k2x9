/**
 * All educational copy lives here — English (default) and Vietnamese.
 * Every structure in `vi` must match `en` exactly (enforced by the `Dict` type).
 */

type Beat = { title: string; body: string[]; notes?: string[] };
type Chapter = { label: string; title: string; kicker: string; figure: string; beats: Beat[] };

const enChapters: Chapter[] = [
  {
    label: "The coin that isn't a coin",
    title: "The coin that isn't a coin",
    kicker: "Chapter 01",
    figure:
      "An illustrated coin rotates, separates into twelve thin conceptual layers, dissolves into thousands of particles and re-forms as a network of ledger accounts.",
    beats: [
      {
        title: "One digital asset. An entire financial network. Let's take it apart.",
        body: [
          "XRP looks like a coin in every illustration ever made of it — including this one. Scroll, and we will open it up layer by layer until only the machinery is left.",
        ],
      },
      {
        title: "There is no metal, and no file called XRP.",
        body: [
          "XRP is the native digital asset of the XRP Ledger. It doesn't live in a wallet app or on a device. It exists only as balances recorded in the ledger's shared state: a number attached to an account, which a network of independent servers keeps in agreement.",
        ],
        notes: ["1 XRP = 1,000,000 drops — the smallest unit the ledger records"],
      },
      {
        title: "Three names, three different things.",
        body: [
          "XRP is the asset. The XRP Ledger (XRPL) is the open-source, decentralized ledger that records it, run by independent server operators. Ripple is a private company that builds payment and custody products and holds a large amount of XRP — but it is not the ledger, and it cannot approve transactions on it.",
          "Not every Ripple product uses XRP, and not every XRP payment involves Ripple.",
        ],
      },
      {
        title: "From object to ledger.",
        body: [
          "The layers you just saw are conceptual — systems, not parts. Strip them away and the coin becomes what it always was: many account entries, each holding a balance, connected through servers that share one version of the truth.",
        ],
      },
    ],
  },
  {
    label: "Inside the ledger",
    title: "Inside the ledger",
    kicker: "Chapter 02",
    figure:
      "A network of account nodes and servers. One account signs a payment, the signed transaction travels to a server and propagates peer-to-peer to the others, then heads toward consensus.",
    beats: [
      {
        title: "A ledger of accounts, not coins.",
        body: [
          "Each XRPL account is an entry in ledger state: an address, an XRP balance, a sequence number and some flags. To exist, an account must hold a minimum reserve — on Mainnet that is 1 XRP plus 0.2 XRP per object it owns (values set by validator vote, last lowered in December 2024).",
          "Hover or tap a node to inspect it. All values shown are simulated.",
        ],
      },
      {
        title: "Signing: authority without sharing a key.",
        body: [
          "The owner builds a Payment transaction and signs it with their private key. The signature proves the account authorised it; the key itself never leaves the wallet. The account's Sequence number makes every transaction unique, so a signed payment cannot be replayed.",
        ],
      },
      {
        title: "Propagation: many servers, one message.",
        body: [
          "The signed transaction can be submitted to any XRPL server. Each server checks the signature and fee, then relays it to its peers. Within moments much of the network knows about it — but knowing is not the same as final.",
        ],
      },
      {
        title: "Pending.",
        body: [
          "Until a transaction is included in a validated ledger, any result you see is tentative. To become final, it has to pass through consensus.",
        ],
      },
    ],
  },
  {
    label: "Consensus without mining",
    title: "Consensus without mining",
    kicker: "Chapter 03",
    figure:
      "A ring of validators exchanges proposals in rounds until a supermajority of one server's trusted list agrees; the pending transaction becomes part of a validated ledger chained to history.",
    beats: [
      {
        title: "No mining. No staking.",
        body: [
          "The XRP Ledger uses its own consensus protocol. There is no proof-of-work puzzle to solve and no stake to lock up, and validators receive no block reward. Their job is to agree — every few seconds — on which transactions belong in the next ledger version.",
        ],
      },
      {
        title: "Each server chooses whom to trust.",
        body: [
          "Every server keeps a Unique Node List (UNL): the validators it trusts not to collude. Many operators use a recommended default list from a list publisher, but the list is configurable. Validators exchange proposals: 'these are the transactions I think should go in.'",
        ],
        notes: ["The dashed lines show one server's UNL — not a global roll call"],
      },
      {
        title: "Rounds converge on a supermajority.",
        body: [
          "Transactions that not enough trusted validators include are set aside for a later ledger. The agreement threshold rises round by round until a supermajority — 80% of a server's UNL — accepts the same set. It is not a single worldwide vote, and no central operator signs off.",
        ],
      },
      {
        title: "Validated means final.",
        body: [
          "A new ledger version typically closes every 3–5 seconds. Before validation, a transaction's result is only tentative; once its ledger is validated, the outcome is final and chained by hash to every ledger before it. If 80% agreement can't be reached, the network pauses rather than splitting into competing histories.",
        ],
      },
    ],
  },
  {
    label: "Send XRP",
    title: "Send XRP",
    kicker: "Chapter 04",
    figure:
      "Two simulated wallets. Pressing play signs a payment, sends it through validators, validates a ledger, updates both balances and shows the fee being destroyed.",
    beats: [
      {
        title: "A payment, step by step.",
        body: [
          "Two simulated wallets, no real keys and no real money. Pick an amount and press play to follow a single XRP payment from signature to validated balance.",
        ],
      },
      {
        title: "The reserve stays put.",
        body: [
          "A wallet can never spend below its reserve, and the fee is charged even if a transaction fails after reaching a validated ledger. Both rules exist to keep the shared ledger from filling with junk.",
        ],
      },
    ],
  },
  {
    label: "Cross-border payment",
    title: "Cross-border payment",
    kicker: "Chapter 05",
    figure:
      "A map of the United States and Mexico. A payment route is drawn from a US sender to a Mexican recipient through an on-ramp, a currency conversion on the XRP Ledger and a local payout partner. A comparison shows a correspondent-banking route.",
    beats: [
      {
        title: "Dollars in Texas, pesos in Jalisco.",
        body: [
          "A worker in the United States wants to pay family in Mexico. The sender holds US dollars; the recipient needs Mexican pesos. Something has to connect two currencies, two banking systems and two sets of rules.",
        ],
      },
      {
        title: "Finding a route.",
        body: [
          "In an XRPL-enabled flow, a regulated provider takes in dollars, the value moves across the ledger — possibly using XRP as a bridge asset between a USD token and an MXN token — and a payout partner in Mexico delivers pesos to a bank account or cash point.",
        ],
        notes: ["Step 1 origin · 2 route · 3 conversion · 4 bridge · 5 delivery"],
      },
      {
        title: "Two kinds of 'settled'.",
        body: [
          "XRPL finality covers only the on-ledger leg: once that ledger is validated, the XRP or token transfer is final. Whether the recipient actually has pesos still depends on FX liquidity, on- and off-ramps, compliance checks and local payout rails. We deliberately show structure here — not times or costs, which vary by provider and corridor.",
        ],
      },
    ],
  },
  {
    label: "The liquidity bridge",
    title: "The liquidity bridge",
    kicker: "Chapter 06",
    figure:
      "Three asset nodes — a USD token, XRP and an MXN token. A thin direct channel connects USD to MXN; a wider route passes through XRP. Flow width changes with the liquidity settings.",
    beats: [
      {
        title: "A thin direct market.",
        body: [
          "Converting a USD token straight into an MXN token needs someone willing to take the other side. For many currency pairs, that direct market is shallow: a large order quickly moves the price against you.",
        ],
      },
      {
        title: "Two deep markets can beat one thin one.",
        body: [
          "XRP trades against many assets. If USD→XRP and XRP→MXN are each deeper than USD→MXN, routing through XRP can deliver more pesos. The ledger can do this automatically — it's called auto-bridging.",
        ],
      },
      {
        title: "Paths, plural.",
        body: [
          "XRPL pathfinding searches order books and AMM pools, and a single cross-currency payment can be split across several paths at once. The best route depends entirely on the market at that moment — the model above is illustrative, not live data.",
        ],
      },
    ],
  },
  {
    label: "DEX and AMM",
    title: "DEX and AMM",
    kicker: "Chapter 07",
    figure:
      "An order book with bids and asks as layered bars; orders match at the spread, then the book morphs into an automated market maker pool curve.",
    beats: [
      {
        title: "An exchange built into the ledger.",
        body: [
          "Since its launch, the XRP Ledger has included a decentralized exchange: a central limit order book where offers to buy and sell are stored in ledger state itself, not on a separate platform.",
        ],
      },
      {
        title: "Orders meet at the spread.",
        body: [
          "When a new offer crosses existing ones, they execute as part of transaction processing — in the same validated ledger, under the same consensus. What is left of the offer rests in the book.",
        ],
      },
      {
        title: "Then came the pool.",
        body: [
          "The AMM amendment (XLS-30) went live on Mainnet in March 2024. Liquidity pools now sit beside the order books, priced by a constant-product formula with a trading fee of up to 1% set by liquidity providers. Payments and offers can draw from whichever source gives the better rate.",
        ],
      },
    ],
  },
  {
    label: "Token supply and escrow",
    title: "Token supply and escrow",
    kicker: "Chapter 08",
    figure:
      "A ring of 100 segments represents the 100 billion XRP created at launch. Fifty-five segments are locked in escrow; one is released on a schedule, part of it moves on and the remainder is locked into a new escrow.",
    beats: [
      {
        title: "Created once, at the start.",
        body: [
          "All 100 billion XRP were created when the ledger launched in 2012. There is no mining and no protocol mechanism to issue more. Because every fee is destroyed, the total in existence can only shrink — slowly.",
        ],
        notes: ["Each segment ≈ 1 billion XRP"],
      },
      {
        title: "Escrow: a lock the ledger enforces.",
        body: [
          "Escrow is a native ledger feature that holds funds until a time passes (FinishAfter), optionally until a cryptographic condition is met, and optionally with an expiry (CancelAfter) after which they return to the sender. Consensus enforces it — nobody has to be trusted to honour it.",
        ],
      },
      {
        title: "Ripple's 55 billion.",
        body: [
          "In December 2017, Ripple locked 55 billion of its XRP into a series of escrows that make up to 1 billion XRP available each month. This is a Ripple-specific arrangement built on the general escrow feature.",
        ],
      },
      {
        title: "Released is not minted — and not automatically circulating.",
        body: [
          "A release moves existing XRP back to Ripple's own account. Whatever Ripple doesn't use has typically been placed into new escrows at the end of the schedule. As of 1 September 2026, roughly 31.28 billion XRP remained in escrow, according to Crypto Briefing citing on-chain data. That figure changes monthly — check a current source.",
        ],
      },
    ],
  },
  {
    label: "What can go wrong?",
    title: "What can go wrong?",
    kicker: "Chapter 09",
    figure:
      "The payment infrastructure redrawn as a risk map. Selecting a risk highlights the affected component and shows a contextual effect such as a narrowing route or an offline payout provider.",
    beats: [
      {
        title: "Every link is a risk.",
        body: [
          "Fast settlement on a ledger is one link in a longer chain. Select a risk to see where it sits and what it does to a payment.",
        ],
      },
      {
        title: "Know which layer failed.",
        body: [
          "Most real-world failures happen off the ledger — at providers, banks, regulators or in the market itself. Understanding which layer a problem lives in is the first step to judging it. Nothing on this page is investment advice.",
        ],
      },
    ],
  },
  {
    label: "All the pieces",
    title: "All the pieces",
    kicker: "Chapter 10",
    figure:
      "Every conceptual component returns, aligns, reassembles into the coin and opens into an interactive exploded diagram with twelve selectable layers.",
    beats: [
      {
        title: "Everything comes back.",
        body: [
          "Ledger state, signatures, servers, validators, fees, routes, bridges, books, pools, escrow and risk. Each idea you met along the way is a layer of the same object.",
        ],
      },
      {
        title: "Layers align.",
        body: [
          "Ledger and consensus at the core, liquidity and payments around them, risk wrapped around everything. Remove any one of them and the others mean less.",
        ],
      },
      {
        title: "A coin again — but now you know what's inside.",
        body: [
          "The asset itself is the thin bright disc near the middle. Everything else is the machinery that gives that number meaning. Explore it below.",
        ],
      },
    ],
  },
];

export const en = {
  meta: {
    title: "Anatomy of XRP — an interactive explainer",
    description:
      "One digital asset. An entire financial network. A cinematic, scroll-driven explainer of XRP and the XRP Ledger.",
  },
  ui: {
    brand: "Anatomy of XRP",
    tagline: "One digital asset. An entire financial network. Let's take it apart.",
    scroll: "Scroll to explore",
    chapter: "Chapter",
    of: "of",
    contents: "Contents",
    language: "Language",
    simulated: "Simulated",
    illustrative: "Illustrative model",
    live: "Live",
    verified: "Documented fact",
    sources: "Sources & references",
    accessed: "accessed",
    disclaimerTitle: "Educational disclaimer",
    disclaimer:
      "This site is an independent educational explainer. It is not affiliated with Ripple or the XRP Ledger Foundation and is not financial, investment, legal or tax advice. Wallets, balances, prices, routes and liquidity shown are simulated or illustrative unless explicitly labelled LIVE. Market-sensitive figures are dated and may be out of date.",
    reducedMotion: "Reduced motion is on: animations jump between states.",
    backToTop: "Back to the top",
    credits: "Design & illustration: original work. Technical reference: xrpl.org.",
    skip: "Skip to content",
  },
  chapters: enChapters,
  scenes: {
    coin: {
      ring: "Native asset · XRP Ledger",
      genesis: "Created at genesis · 2012",
      drops: "1 XRP = 1,000,000 drops",
      exploded: "Exploded view · conceptual layers",
      balances: "Account balances",
      distributed: "Distributed ledger",
    },
    ledger: {
      accountState: "Account state",
      server: "Server",
      signed: "Signed",
      payment: "Payment",
      relay: "Peer-to-peer relay",
      pending: "Pending · tentative",
      address: "Address",
      balance: "Balance",
      sequence: "Sequence",
      state: "State",
      active: "Active",
      reserve: "Reserve held",
      simulated: "Simulated account",
    },
    consensus: {
      validator: "Validator",
      proposal: "Validator proposal",
      unl: "Trusted list (UNL) of V-07",
      round: "Round",
      threshold: "Threshold",
      agreement: "Agreement",
      tentative: "Tentative result",
      validated: "Validated · final",
      ledgerHash: "Ledger hash",
      ledgerIndex: "Ledger",
      history: "Immutable history",
      noMining: "No mining · no stake · no block reward",
      supermajority: "Supermajority ≥ 80% of UNL",
    },
    send: {
      walletA: "Wallet A",
      walletB: "Wallet B",
      network: "Validators",
      fee: "Transaction fee",
      destroyed: "Destroyed",
      reserve: "Reserve",
      steps: ["Sign", "Submit", "Consensus", "Validate", "Balances", "Burn fee"],
      magnified: "×1,000,000 magnified",
    },
    map: {
      us: "United States",
      mx: "Mexico",
      sender: "Sender · USD",
      recipient: "Recipient · MXN",
      onramp: "On-ramp provider",
      xrpl: "XRP Ledger",
      offramp: "Payout partner",
      conversion: "Currency conversion",
      bridge: "Bridge asset",
      route: "Liquidity route",
      senderBank: "Sender's bank",
      corrUS: "Correspondent (USD)",
      corrMX: "Correspondent (MXN)",
      recipientBank: "Recipient's bank",
      nostro: "Pre-funded accounts",
      ledgerLeg: "XRPL finality covers this leg",
      fiatLeg: "Fiat legs: off-ledger",
    },
    bridge: {
      direct: "Direct order book",
      viaXrp: "Bridge via XRP",
      delivered: "Delivered",
      depth: "Depth",
      preferred: "Preferred route",
    },
    dex: {
      bids: "Bids · buy XRP",
      asks: "Asks · sell XRP",
      spread: "Spread",
      match: "Match",
      pool: "AMM pool",
      curve: "x · y = k",
      price: "Price (USD per XRP)",
      size: "Size (XRP)",
      lp: "LP tokens",
    },
    supply: {
      total: "100,000,000,000 XRP",
      created: "Created at launch · 2012",
      escrow: "Escrow condition",
      locked: "Locked",
      release: "Release",
      toRipple: "To Ripple's account",
      reescrow: "Re-escrowed",
      onwards: "Used / sold",
      timeline: "Escrow schedule · illustrative",
      notMinted: "Not newly minted",
    },
    risk: {
      sender: "Sender",
      onramp: "On-ramp",
      xrpl: "XRPL",
      dex: "DEX / AMM",
      validators: "Validators",
      offramp: "Payout",
      recipient: "Recipient",
      market: "Market price",
      regulator: "Regulation",
      issuer: "Token issuer",
    },
    pieces: {
      title: "XRP · anatomy",
      plate: "Plate X — exploded view",
    },
  },
  panels: {
    send: {
      title: "Transaction simulator",
      amount: "Transfer amount",
      play: "Play transaction",
      pause: "Pause",
      resume: "Resume",
      replay: "Replay",
      reset: "Reset balances",
      fee: "Fee",
      feeLive: "Live base fee from a public XRPL server",
      feeIllustrative: "Reference cost from XRPL docs (10 drops). Live fee unavailable.",
      result: "Result",
      tentative: "tesSUCCESS (tentative)",
      validated: "tesSUCCESS · validated",
      unfunded: "Insufficient spendable balance — the simulator stops here.",
      hash: "Tx hash",
      spendable: "Spendable",
      reserveNote: "1 XRP base reserve kept in each wallet",
      stepLabel: "Step",
      stepsDetail: [
        "Wallet A signs the Payment with its private key.",
        "The signed transaction is submitted and relayed.",
        "Validators include it in their proposals.",
        "A ledger is validated — the result is now final.",
        "Balances update in ledger state.",
        "The fee is destroyed. It is paid to no one.",
      ],
    },
    route: {
      title: "Compare routes",
      routeA: "Route A · correspondent banking",
      routeB: "Route B · XRPL-enabled",
      parties: "Parties involved",
      steps: "Structural steps",
      stepsA: [
        "Sender's bank debits USD",
        "Message sent to a USD correspondent",
        "Funds move through pre-funded correspondent accounts",
        "FX conversion USD → MXN at an intermediary",
        "Recipient's bank credits MXN",
      ],
      stepsB: [
        "On-ramp provider receives USD",
        "USD value enters the XRP Ledger",
        "Conversion on the DEX — XRP may bridge USD → MXN",
        "Payout partner receives MXN value",
        "Local rail credits pesos to the recipient",
      ],
      partiesA: ["Sender", "Sender's bank", "Correspondent (USD)", "Correspondent (MXN)", "Recipient's bank", "Recipient"],
      partiesB: ["Sender", "On-ramp", "XRP Ledger", "Payout partner", "Recipient"],
      caveat:
        "Neither route is guaranteed faster or cheaper. Compliance, FX liquidity, on/off-ramps and local payout infrastructure remain necessary in both.",
    },
    liquidity: {
      title: "Liquidity experiment",
      amount: "Payment amount (USD)",
      direct: "Direct USD/MXN liquidity",
      leg1: "USD/XRP depth",
      leg2: "XRP/MXN depth",
      impact: "Spread & fees per hop",
      best: "Preferred route",
      direct_only: "Direct",
      bridge_only: "Via XRP",
      split: "Split",
      out: "Recipient gets",
      effRate: "Effective rate",
      priceImpact: "Price impact",
      model:
        "Illustrative constant-product model with made-up reference rates (1 USD = 18 MXN, 1 XRP = 2 USD). Not live XRPL pathfinding.",
    },
    dex: {
      title: "Order book vs AMM",
      size: "Trade size (buy XRP)",
      liquidity: "Liquidity",
      mode: "View",
      book: "Order book",
      amm: "AMM pool",
      avg: "Average price",
      slippage: "Slippage vs mid",
      levels: "Levels consumed",
      cost: "Total cost",
      model:
        "Teaching model: a synthetic book and a 0.3%-fee constant-product pool around an illustrative mid price of 2.00 USD/XRP. Real XRPL books and pools differ, and payments can use both at once.",
      insufficient: "Not enough liquidity for this size",
    },
    risk: {
      title: "Risk map",
      select: "Select a risk",
      effect: "What happens",
      items: [
        {
          name: "Market volatility",
          body: "XRP's price can move sharply within minutes. If a payment uses XRP as a bridge, the rate it receives depends on the market at execution — a short swing changes the illustrative conversion result.",
        },
        {
          name: "Thin liquidity",
          body: "When order books and pools are shallow, the route narrows: the same payment moves the price further and fewer pesos arrive.",
        },
        {
          name: "Slippage",
          body: "Large orders walk deeper into the book. The average price you get is worse than the quoted top-of-book price.",
        },
        {
          name: "Counterparty risk",
          body: "XRP itself is not anyone's liability, but tokens such as a USD or MXN token are issued by someone — and on/off-ramps hold customer money. If an issuer or provider fails, the token or payout may not be redeemable.",
        },
        {
          name: "Regulatory restrictions",
          body: "Licensing, sanctions, and rules on crypto assets differ by country and change over time. A corridor that works today may be restricted tomorrow.",
        },
        {
          name: "Infrastructure disruption",
          body: "If a payout partner, bank rail or exchange goes offline, the ledger leg can be final while the recipient still waits for fiat.",
        },
        {
          name: "Validator trust assumptions",
          body: "Consensus assumes UNLs overlap enough and that most trusted validators are honest and online. If more than about 20% of a server's UNL goes offline, ledgers stop validating until it recovers — the network halts rather than forks.",
        },
      ],
      labels: {
        price: "Illustrative rate",
        cost: "Conversion cost",
        offline: "Offline",
        settled: "XRPL leg final",
        waiting: "Fiat payout pending",
        blocked: "Restricted",
        halted: "Validation paused",
        quorum: "Online UNL",
      },
    },
    explorer: {
      title: "Anatomy explorer",
      hint: "Drag the illustration to rotate. Select a layer or a group to zoom in.",
      categories: {
        core: "Core asset",
        ledger: "Ledger",
        consensus: "Consensus",
        payments: "Payments",
        liquidity: "Liquidity",
        risks: "Risks",
      },
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      rotateLeft: "Rotate left",
      rotateRight: "Rotate right",
      reset: "Reset view",
      layer: "Layer",
      none: "Nothing selected — choose a layer.",
    },
  },
  anatomy: [
    { name: "Exterior shell", body: "The familiar 'coin' — a visual metaphor. XRP has no physical form; the shell is only the image people use for it." },
    { name: "Digital asset", body: "XRP itself: the ledger's native asset, divisible to one millionth (a drop). Held directly in accounts with no issuer and no trust line." },
    { name: "Ledger state", body: "The shared database of accounts, balances, offers, trust lines and other objects that every server agrees on after each validated ledger." },
    { name: "Transaction signing", body: "Private keys authorise transactions; signatures prove it. Sequence numbers prevent replay. Multi-signing is also supported." },
    { name: "Peer-to-peer network", body: "Independent servers relay transactions and proposals to each other. Anyone can run a server; most do not validate." },
    { name: "Validator consensus", body: "Validators agree on each ledger using trusted lists (UNLs) and a supermajority threshold of 80%. No mining, no staking rewards." },
    { name: "Transaction fees", body: "A small XRP cost (10 drops reference, more under load) destroyed with each transaction to protect the network from spam." },
    { name: "Cross-border routing", body: "Payments can deliver a different currency than they send, by pathing through the DEX. Off-ledger providers handle fiat in and out." },
    { name: "Liquidity bridges", body: "XRP can sit between two other assets (auto-bridging) when two XRP markets together offer a better rate than a direct one." },
    { name: "Decentralized exchange", body: "A native order book plus AMM pools (since March 2024). Both live in ledger state and settle under consensus." },
    { name: "Supply & escrow", body: "100 billion XRP created at launch, slowly reduced by fee burning. Escrow locks XRP until a time or condition — Ripple uses it for its holdings." },
    { name: "Risk & infrastructure", body: "Market volatility, liquidity, counterparties, regulation, off-ledger infrastructure and consensus assumptions surround every use of XRP." },
  ],
  references: {
    heading: "Sources",
    note: "Technical facts are taken from official XRP Ledger documentation. Ripple's own site is cited only for Ripple-specific arrangements. Market-sensitive figures carry dates.",
  },
};

export type Dict = typeof en;

const viChapters: Chapter[] = [
  {
    label: "Đồng xu không phải đồng xu",
    title: "Đồng xu không phải đồng xu",
    kicker: "Chương 01",
    figure:
      "Một đồng xu minh hoạ xoay chậm, tách thành mười hai lớp khái niệm mỏng, tan thành hàng nghìn hạt rồi tụ lại thành mạng lưới các tài khoản trên sổ cái.",
    beats: [
      {
        title: "Một tài sản số. Cả một mạng lưới tài chính. Hãy mổ xẻ nó.",
        body: [
          "Mọi hình minh hoạ về XRP đều vẽ nó như một đồng xu — kể cả trang này. Hãy cuộn xuống, chúng ta sẽ mở nó ra từng lớp cho đến khi chỉ còn lại bộ máy bên trong.",
        ],
      },
      {
        title: "Không có kim loại, cũng không có tệp nào tên là XRP.",
        body: [
          "XRP là tài sản số gốc của XRP Ledger. Nó không nằm trong ứng dụng ví hay trên thiết bị nào. Nó chỉ tồn tại dưới dạng số dư được ghi trong trạng thái chung của sổ cái: một con số gắn với một tài khoản, được một mạng lưới máy chủ độc lập giữ cho thống nhất.",
        ],
        notes: ["1 XRP = 1.000.000 drop — đơn vị nhỏ nhất mà sổ cái ghi nhận"],
      },
      {
        title: "Ba cái tên, ba thứ khác nhau.",
        body: [
          "XRP là tài sản. XRP Ledger (XRPL) là sổ cái phi tập trung, mã nguồn mở ghi nhận nó, do các nhà vận hành máy chủ độc lập chạy. Ripple là một công ty tư nhân xây dựng sản phẩm thanh toán, lưu ký và nắm giữ lượng lớn XRP — nhưng Ripple không phải là sổ cái và không thể phê duyệt giao dịch trên đó.",
          "Không phải sản phẩm nào của Ripple cũng dùng XRP, và không phải giao dịch XRP nào cũng liên quan đến Ripple.",
        ],
      },
      {
        title: "Từ vật thể đến sổ cái.",
        body: [
          "Những lớp bạn vừa thấy là khái niệm — là các hệ thống, không phải linh kiện. Bóc hết chúng ra, đồng xu trở về đúng bản chất: rất nhiều mục tài khoản, mỗi mục giữ một số dư, kết nối qua các máy chủ cùng chia sẻ một phiên bản sự thật.",
        ],
      },
    ],
  },
  {
    label: "Bên trong sổ cái",
    title: "Bên trong sổ cái",
    kicker: "Chương 02",
    figure:
      "Mạng lưới các nút tài khoản và máy chủ. Một tài khoản ký lệnh thanh toán, giao dịch đã ký đi tới một máy chủ, lan truyền ngang hàng sang các máy chủ khác rồi hướng tới đồng thuận.",
    beats: [
      {
        title: "Sổ cái của tài khoản, không phải của đồng xu.",
        body: [
          "Mỗi tài khoản XRPL là một mục trong trạng thái sổ cái: một địa chỉ, số dư XRP, số thứ tự (sequence) và vài cờ trạng thái. Để tồn tại, tài khoản phải giữ một khoản dự trữ tối thiểu — trên Mainnet là 1 XRP cộng 0,2 XRP cho mỗi đối tượng sở hữu (mức do validator bỏ phiếu, lần giảm gần nhất vào tháng 12/2024).",
          "Di chuột hoặc chạm vào một nút để xem chi tiết. Mọi giá trị đều là mô phỏng.",
        ],
      },
      {
        title: "Ký giao dịch: uỷ quyền mà không lộ khoá.",
        body: [
          "Chủ tài khoản tạo một giao dịch Payment và ký bằng khoá riêng. Chữ ký chứng minh tài khoản đã cho phép; bản thân khoá không bao giờ rời khỏi ví. Số Sequence khiến mỗi giao dịch là duy nhất, nên một lệnh đã ký không thể bị phát lại.",
        ],
      },
      {
        title: "Lan truyền: nhiều máy chủ, một thông điệp.",
        body: [
          "Giao dịch đã ký có thể gửi tới bất kỳ máy chủ XRPL nào. Mỗi máy chủ kiểm tra chữ ký và phí rồi chuyển tiếp cho các máy chủ ngang hàng. Chỉ trong chốc lát, phần lớn mạng lưới đã biết về nó — nhưng biết chưa có nghĩa là đã chốt.",
        ],
      },
      {
        title: "Đang chờ.",
        body: [
          "Cho đến khi được đưa vào một sổ cái đã xác thực, mọi kết quả bạn thấy chỉ là tạm thời. Để trở thành cuối cùng, giao dịch phải đi qua cơ chế đồng thuận.",
        ],
      },
    ],
  },
  {
    label: "Đồng thuận không cần đào",
    title: "Đồng thuận không cần đào",
    kicker: "Chương 03",
    figure:
      "Một vòng validator trao đổi đề xuất qua nhiều vòng cho đến khi siêu đa số trong danh sách tin cậy của một máy chủ đồng ý; giao dịch đang chờ trở thành một phần của sổ cái đã xác thực, nối vào lịch sử.",
    beats: [
      {
        title: "Không đào. Không staking.",
        body: [
          "XRP Ledger dùng giao thức đồng thuận riêng. Không có câu đố proof-of-work, không phải khoá tài sản để stake, và validator không nhận phần thưởng khối. Việc của họ là cùng đồng ý — vài giây một lần — giao dịch nào thuộc về phiên bản sổ cái tiếp theo.",
        ],
      },
      {
        title: "Mỗi máy chủ tự chọn tin ai.",
        body: [
          "Mỗi máy chủ giữ một Danh sách Nút Duy nhất (UNL): các validator mà nó tin là sẽ không thông đồng. Nhiều nhà vận hành dùng danh sách mặc định được khuyến nghị từ một đơn vị công bố danh sách, nhưng có thể tự cấu hình. Các validator trao đổi đề xuất: 'đây là các giao dịch tôi cho là nên được đưa vào'.",
        ],
        notes: ["Các đường nét đứt là UNL của một máy chủ — không phải điểm danh toàn cầu"],
      },
      {
        title: "Các vòng hội tụ về siêu đa số.",
        body: [
          "Giao dịch không được đủ validator tin cậy đưa vào sẽ được để lại cho sổ cái sau. Ngưỡng đồng ý tăng dần qua từng vòng cho đến khi siêu đa số — 80% UNL của một máy chủ — chấp nhận cùng một tập giao dịch. Đây không phải một cuộc bỏ phiếu toàn cầu, và không có nhà vận hành trung tâm nào duyệt.",
        ],
      },
      {
        title: "Đã xác thực nghĩa là cuối cùng.",
        body: [
          "Một phiên bản sổ cái mới thường đóng sau mỗi 3–5 giây. Trước khi xác thực, kết quả giao dịch chỉ là tạm thời; khi sổ cái đã được xác thực, kết quả là cuối cùng và được nối bằng hash với mọi sổ cái trước đó. Nếu không đạt 80% đồng thuận, mạng sẽ tạm dừng thay vì tách thành các lịch sử cạnh tranh.",
        ],
      },
    ],
  },
  {
    label: "Gửi XRP",
    title: "Gửi XRP",
    kicker: "Chương 04",
    figure:
      "Hai ví mô phỏng. Bấm phát để ký lệnh thanh toán, gửi qua validator, xác thực sổ cái, cập nhật số dư hai bên và thấy phí bị huỷ.",
    beats: [
      {
        title: "Một lệnh thanh toán, từng bước.",
        body: [
          "Hai ví mô phỏng, không có khoá thật, không có tiền thật. Chọn số lượng rồi bấm phát để theo dõi một lệnh chuyển XRP từ chữ ký đến số dư đã xác thực.",
        ],
      },
      {
        title: "Khoản dự trữ luôn nằm yên.",
        body: [
          "Ví không bao giờ tiêu được xuống dưới mức dự trữ, và phí vẫn bị trừ ngay cả khi giao dịch thất bại sau khi đã vào sổ cái được xác thực. Cả hai quy tắc đều để giữ cho sổ cái chung không bị rác lấp đầy.",
        ],
      },
    ],
  },
  {
    label: "Thanh toán xuyên biên giới",
    title: "Thanh toán xuyên biên giới",
    kicker: "Chương 05",
    figure:
      "Bản đồ Hoa Kỳ và Mexico. Một tuyến thanh toán được vẽ từ người gửi ở Mỹ tới người nhận ở Mexico qua nhà cung cấp nạp tiền, chuyển đổi tiền tệ trên XRP Ledger và đối tác chi trả địa phương. Phần so sánh cho thấy tuyến qua ngân hàng đại lý.",
    beats: [
      {
        title: "Đô la ở Texas, peso ở Jalisco.",
        body: [
          "Một người lao động ở Mỹ muốn gửi tiền cho gia đình ở Mexico. Người gửi có đô la Mỹ; người nhận cần peso Mexico. Phải có thứ gì đó nối hai đồng tiền, hai hệ thống ngân hàng và hai bộ quy định.",
        ],
      },
      {
        title: "Tìm tuyến đường.",
        body: [
          "Trong luồng có XRPL, một nhà cung cấp được cấp phép nhận đô la, giá trị đi qua sổ cái — có thể dùng XRP làm tài sản cầu nối giữa token USD và token MXN — rồi đối tác chi trả tại Mexico giao peso vào tài khoản ngân hàng hoặc điểm nhận tiền mặt.",
        ],
        notes: ["Bước 1 khởi tạo · 2 tuyến · 3 chuyển đổi · 4 cầu nối · 5 giao nhận"],
      },
      {
        title: "Hai kiểu 'đã thanh toán'.",
        body: [
          "Tính cuối cùng của XRPL chỉ áp dụng cho chặng trên sổ cái: khi sổ cái được xác thực, lệnh chuyển XRP hoặc token là cuối cùng. Người nhận có thực sự nhận được peso hay không vẫn phụ thuộc thanh khoản ngoại hối, kênh nạp/rút, kiểm tra tuân thủ và hệ thống chi trả địa phương. Ở đây chúng tôi cố ý chỉ thể hiện cấu trúc — không nêu thời gian hay chi phí, vì chúng khác nhau theo nhà cung cấp và hành lang.",
        ],
      },
    ],
  },
  {
    label: "Cầu thanh khoản",
    title: "Cầu thanh khoản",
    kicker: "Chương 06",
    figure:
      "Ba nút tài sản — token USD, XRP và token MXN. Một kênh trực tiếp mảnh nối USD với MXN; một tuyến rộng hơn đi qua XRP. Độ rộng dòng chảy thay đổi theo thiết lập thanh khoản.",
    beats: [
      {
        title: "Một thị trường trực tiếp mỏng.",
        body: [
          "Đổi thẳng token USD sang token MXN cần có người sẵn sàng đứng phía bên kia. Với nhiều cặp tiền, thị trường trực tiếp đó rất nông: một lệnh lớn sẽ nhanh chóng đẩy giá bất lợi cho bạn.",
        ],
      },
      {
        title: "Hai thị trường sâu có thể thắng một thị trường mỏng.",
        body: [
          "XRP được giao dịch với nhiều tài sản. Nếu USD→XRP và XRP→MXN đều sâu hơn USD→MXN, đi vòng qua XRP có thể giao được nhiều peso hơn. Sổ cái có thể tự làm việc này — gọi là auto-bridging (tự động bắc cầu).",
        ],
      },
      {
        title: "Nhiều tuyến cùng lúc.",
        body: [
          "Cơ chế tìm đường của XRPL quét cả sổ lệnh lẫn pool AMM, và một giao dịch chuyển đổi tiền tệ có thể được chia qua nhiều tuyến cùng lúc. Tuyến tốt nhất phụ thuộc hoàn toàn vào thị trường tại thời điểm đó — mô hình phía trên chỉ để minh hoạ, không phải dữ liệu thật.",
        ],
      },
    ],
  },
  {
    label: "DEX và AMM",
    title: "DEX và AMM",
    kicker: "Chương 07",
    figure:
      "Sổ lệnh với lệnh mua và bán là các thanh xếp lớp; lệnh khớp tại chênh lệch giá, sau đó sổ lệnh biến đổi thành đường cong của pool tạo lập thị trường tự động.",
    beats: [
      {
        title: "Một sàn giao dịch nằm ngay trong sổ cái.",
        body: [
          "Từ khi ra đời, XRP Ledger đã có sàn giao dịch phi tập trung: một sổ lệnh giới hạn tập trung, nơi các lệnh mua bán được lưu ngay trong trạng thái sổ cái chứ không ở một nền tảng riêng.",
        ],
      },
      {
        title: "Lệnh gặp nhau ở chênh lệch giá.",
        body: [
          "Khi một lệnh mới cắt qua các lệnh có sẵn, chúng được khớp ngay trong quá trình xử lý giao dịch — trong cùng sổ cái được xác thực, dưới cùng cơ chế đồng thuận. Phần còn lại của lệnh nằm chờ trong sổ.",
        ],
      },
      {
        title: "Rồi pool xuất hiện.",
        body: [
          "Bản sửa đổi AMM (XLS-30) được kích hoạt trên Mainnet vào tháng 3/2024. Các pool thanh khoản giờ nằm cạnh sổ lệnh, định giá theo công thức tích không đổi với phí giao dịch tối đa 1% do nhà cung cấp thanh khoản đặt. Thanh toán và lệnh có thể lấy thanh khoản từ nguồn nào cho tỷ giá tốt hơn.",
        ],
      },
    ],
  },
  {
    label: "Nguồn cung và ký quỹ",
    title: "Nguồn cung và ký quỹ",
    kicker: "Chương 08",
    figure:
      "Một vòng 100 phân đoạn tượng trưng cho 100 tỷ XRP được tạo lúc khởi đầu. Năm mươi lăm phân đoạn bị khoá trong ký quỹ; một phân đoạn được giải phóng theo lịch, một phần đi tiếp và phần còn lại được khoá vào ký quỹ mới.",
    beats: [
      {
        title: "Tạo một lần, ngay từ đầu.",
        body: [
          "Toàn bộ 100 tỷ XRP được tạo khi sổ cái ra mắt năm 2012. Không có đào và không có cơ chế giao thức nào để phát hành thêm. Vì mọi khoản phí đều bị huỷ, tổng lượng tồn tại chỉ có thể giảm — một cách chậm rãi.",
        ],
        notes: ["Mỗi phân đoạn ≈ 1 tỷ XRP"],
      },
      {
        title: "Ký quỹ: ổ khoá do sổ cái thực thi.",
        body: [
          "Escrow (ký quỹ) là tính năng gốc của sổ cái, giữ tiền cho đến khi qua một thời điểm (FinishAfter), tuỳ chọn thêm điều kiện mật mã, và tuỳ chọn thời hạn (CancelAfter) mà sau đó tiền trả về người gửi. Cơ chế đồng thuận thực thi nó — không cần tin ai giữ lời.",
        ],
      },
      {
        title: "55 tỷ của Ripple.",
        body: [
          "Tháng 12/2017, Ripple khoá 55 tỷ XRP của mình vào chuỗi hợp đồng ký quỹ, mỗi tháng mở ra tối đa 1 tỷ XRP. Đây là thoả thuận riêng của Ripple, xây trên tính năng ký quỹ chung.",
        ],
      },
      {
        title: "Giải phóng không phải đúc mới — và không tự động lưu hành.",
        body: [
          "Mỗi lần giải phóng chuyển XRP đã có sẵn về tài khoản của chính Ripple. Phần Ripple không dùng thường được khoá vào ký quỹ mới ở cuối lịch trình. Tính đến 1/9/2026, khoảng 31,28 tỷ XRP vẫn nằm trong ký quỹ, theo Crypto Briefing dẫn dữ liệu on-chain. Con số này thay đổi hằng tháng — hãy kiểm tra nguồn hiện hành.",
        ],
      },
    ],
  },
  {
    label: "Điều gì có thể sai?",
    title: "Điều gì có thể sai?",
    kicker: "Chương 09",
    figure:
      "Hạ tầng thanh toán được vẽ lại thành bản đồ rủi ro. Chọn một rủi ro sẽ làm nổi bật thành phần bị ảnh hưởng và hiển thị hiệu ứng tương ứng, như tuyến bị thu hẹp hoặc đối tác chi trả ngừng hoạt động.",
    beats: [
      {
        title: "Mỗi mắt xích là một rủi ro.",
        body: [
          "Thanh toán nhanh trên sổ cái chỉ là một mắt xích trong chuỗi dài hơn. Chọn một rủi ro để xem nó nằm ở đâu và tác động gì tới khoản thanh toán.",
        ],
      },
      {
        title: "Biết lớp nào hỏng.",
        body: [
          "Phần lớn sự cố thực tế xảy ra ngoài sổ cái — ở nhà cung cấp, ngân hàng, cơ quan quản lý hoặc chính thị trường. Hiểu vấn đề nằm ở lớp nào là bước đầu để đánh giá nó. Không nội dung nào trên trang này là lời khuyên đầu tư.",
        ],
      },
    ],
  },
  {
    label: "Tất cả các mảnh ghép",
    title: "Tất cả các mảnh ghép",
    kicker: "Chương 10",
    figure:
      "Mọi thành phần khái niệm quay trở lại, thẳng hàng, ghép lại thành đồng xu rồi mở ra thành sơ đồ tách lớp tương tác với mười hai lớp có thể chọn.",
    beats: [
      {
        title: "Mọi thứ quay trở lại.",
        body: [
          "Trạng thái sổ cái, chữ ký, máy chủ, validator, phí, tuyến, cầu, sổ lệnh, pool, ký quỹ và rủi ro. Mỗi ý tưởng bạn gặp trên đường đi là một lớp của cùng một vật thể.",
        ],
      },
      {
        title: "Các lớp thẳng hàng.",
        body: [
          "Sổ cái và đồng thuận ở lõi, thanh khoản và thanh toán bao quanh, rủi ro bọc ngoài tất cả. Bỏ đi bất kỳ lớp nào, những lớp còn lại sẽ kém ý nghĩa hơn.",
        ],
      },
      {
        title: "Lại là đồng xu — nhưng giờ bạn biết bên trong có gì.",
        body: [
          "Bản thân tài sản là chiếc đĩa mỏng sáng ở gần giữa. Mọi thứ khác là bộ máy mang lại ý nghĩa cho con số đó. Hãy khám phá ở bên dưới.",
        ],
      },
    ],
  },
];

export const vi: Dict = {
  meta: {
    title: "Giải phẫu XRP — bài giải thích tương tác",
    description:
      "Một tài sản số. Cả một mạng lưới tài chính. Bài giải thích điện ảnh, điều khiển bằng thao tác cuộn về XRP và XRP Ledger.",
  },
  ui: {
    brand: "Giải phẫu XRP",
    tagline: "Một tài sản số. Cả một mạng lưới tài chính. Hãy mổ xẻ nó.",
    scroll: "Cuộn để khám phá",
    chapter: "Chương",
    of: "/",
    contents: "Mục lục",
    language: "Ngôn ngữ",
    simulated: "Mô phỏng",
    illustrative: "Mô hình minh hoạ",
    live: "Trực tiếp",
    verified: "Dữ kiện có tài liệu",
    sources: "Nguồn & tài liệu tham khảo",
    accessed: "truy cập",
    disclaimerTitle: "Tuyên bố giáo dục",
    disclaimer:
      "Đây là trang giải thích giáo dục độc lập, không liên kết với Ripple hay XRP Ledger Foundation, và không phải lời khuyên tài chính, đầu tư, pháp lý hay thuế. Ví, số dư, giá, tuyến và thanh khoản hiển thị đều là mô phỏng hoặc minh hoạ, trừ khi được ghi rõ TRỰC TIẾP. Các số liệu nhạy cảm theo thị trường đều có ghi ngày và có thể đã cũ.",
    reducedMotion: "Đang bật giảm chuyển động: hình ảnh chuyển trạng thái tức thì.",
    backToTop: "Về đầu trang",
    credits: "Thiết kế & minh hoạ: tác phẩm gốc. Tham chiếu kỹ thuật: xrpl.org.",
    skip: "Bỏ qua tới nội dung",
  },
  chapters: viChapters,
  scenes: {
    coin: {
      ring: "Tài sản gốc · XRP Ledger",
      genesis: "Tạo từ sổ cái đầu tiên · 2012",
      drops: "1 XRP = 1.000.000 drop",
      exploded: "Hình tách lớp · các lớp khái niệm",
      balances: "Số dư tài khoản",
      distributed: "Sổ cái phân tán",
    },
    ledger: {
      accountState: "Trạng thái tài khoản",
      server: "Máy chủ",
      signed: "Đã ký",
      payment: "Thanh toán",
      relay: "Chuyển tiếp ngang hàng",
      pending: "Đang chờ · tạm thời",
      address: "Địa chỉ",
      balance: "Số dư",
      sequence: "Sequence",
      state: "Trạng thái",
      active: "Hoạt động",
      reserve: "Dự trữ bị giữ",
      simulated: "Tài khoản mô phỏng",
    },
    consensus: {
      validator: "Validator",
      proposal: "Đề xuất của validator",
      unl: "Danh sách tin cậy (UNL) của V-07",
      round: "Vòng",
      threshold: "Ngưỡng",
      agreement: "Mức đồng ý",
      tentative: "Kết quả tạm thời",
      validated: "Đã xác thực · cuối cùng",
      ledgerHash: "Hash sổ cái",
      ledgerIndex: "Sổ cái",
      history: "Lịch sử bất biến",
      noMining: "Không đào · không stake · không thưởng khối",
      supermajority: "Siêu đa số ≥ 80% UNL",
    },
    send: {
      walletA: "Ví A",
      walletB: "Ví B",
      network: "Validator",
      fee: "Phí giao dịch",
      destroyed: "Đã huỷ",
      reserve: "Dự trữ",
      steps: ["Ký", "Gửi", "Đồng thuận", "Xác thực", "Số dư", "Huỷ phí"],
      magnified: "phóng to ×1.000.000",
    },
    map: {
      us: "Hoa Kỳ",
      mx: "Mexico",
      sender: "Người gửi · USD",
      recipient: "Người nhận · MXN",
      onramp: "Nhà cung cấp nạp tiền",
      xrpl: "XRP Ledger",
      offramp: "Đối tác chi trả",
      conversion: "Chuyển đổi tiền tệ",
      bridge: "Tài sản cầu nối",
      route: "Tuyến thanh khoản",
      senderBank: "NH người gửi",
      corrUS: "NH đại lý (USD)",
      corrMX: "NH đại lý (MXN)",
      recipientBank: "NH người nhận",
      nostro: "Tài khoản ký quỹ trước",
      ledgerLeg: "Tính cuối cùng XRPL chỉ ở chặng này",
      fiatLeg: "Chặng tiền pháp định: ngoài sổ cái",
    },
    bridge: {
      direct: "Sổ lệnh trực tiếp",
      viaXrp: "Cầu nối qua XRP",
      delivered: "Đã giao",
      depth: "Độ sâu",
      preferred: "Tuyến ưu tiên",
    },
    dex: {
      bids: "Lệnh mua · mua XRP",
      asks: "Lệnh bán · bán XRP",
      spread: "Chênh lệch",
      match: "Khớp",
      pool: "Pool AMM",
      curve: "x · y = k",
      price: "Giá (USD mỗi XRP)",
      size: "Khối lượng (XRP)",
      lp: "Token LP",
    },
    supply: {
      total: "100.000.000.000 XRP",
      created: "Tạo lúc ra mắt · 2012",
      escrow: "Điều kiện ký quỹ",
      locked: "Đang khoá",
      release: "Giải phóng",
      toRipple: "Về tài khoản Ripple",
      reescrow: "Ký quỹ lại",
      onwards: "Đã dùng / bán",
      timeline: "Lịch ký quỹ · minh hoạ",
      notMinted: "Không phải đúc mới",
    },
    risk: {
      sender: "Người gửi",
      onramp: "Nạp tiền",
      xrpl: "XRPL",
      dex: "DEX / AMM",
      validators: "Validator",
      offramp: "Chi trả",
      recipient: "Người nhận",
      market: "Giá thị trường",
      regulator: "Quy định",
      issuer: "Đơn vị phát hành token",
    },
    pieces: {
      title: "XRP · giải phẫu",
      plate: "Bản vẽ X — hình tách lớp",
    },
  },
  panels: {
    send: {
      title: "Trình mô phỏng giao dịch",
      amount: "Số lượng chuyển",
      play: "Phát giao dịch",
      pause: "Tạm dừng",
      resume: "Tiếp tục",
      replay: "Phát lại",
      reset: "Đặt lại số dư",
      fee: "Phí",
      feeLive: "Phí cơ sở trực tiếp từ một máy chủ XRPL công khai",
      feeIllustrative: "Chi phí tham chiếu theo tài liệu XRPL (10 drop). Không lấy được phí trực tiếp.",
      result: "Kết quả",
      tentative: "tesSUCCESS (tạm thời)",
      validated: "tesSUCCESS · đã xác thực",
      unfunded: "Số dư khả dụng không đủ — trình mô phỏng dừng tại đây.",
      hash: "Hash giao dịch",
      spendable: "Khả dụng",
      reserveNote: "Mỗi ví giữ 1 XRP dự trữ cơ sở",
      stepLabel: "Bước",
      stepsDetail: [
        "Ví A ký lệnh Payment bằng khoá riêng.",
        "Giao dịch đã ký được gửi lên và chuyển tiếp.",
        "Validator đưa nó vào đề xuất của mình.",
        "Một sổ cái được xác thực — kết quả giờ là cuối cùng.",
        "Số dư cập nhật trong trạng thái sổ cái.",
        "Phí bị huỷ. Không ai nhận khoản này.",
      ],
    },
    route: {
      title: "So sánh tuyến",
      routeA: "Tuyến A · ngân hàng đại lý",
      routeB: "Tuyến B · có XRPL",
      parties: "Các bên tham gia",
      steps: "Các bước cấu trúc",
      stepsA: [
        "Ngân hàng người gửi ghi nợ USD",
        "Gửi điện tới ngân hàng đại lý USD",
        "Tiền đi qua các tài khoản đại lý đã ký quỹ trước",
        "Chuyển đổi USD → MXN tại bên trung gian",
        "Ngân hàng người nhận ghi có MXN",
      ],
      stepsB: [
        "Nhà cung cấp nạp tiền nhận USD",
        "Giá trị USD đi vào XRP Ledger",
        "Chuyển đổi trên DEX — XRP có thể làm cầu USD → MXN",
        "Đối tác chi trả nhận giá trị MXN",
        "Hệ thống thanh toán nội địa ghi có peso cho người nhận",
      ],
      partiesA: ["Người gửi", "NH người gửi", "Đại lý (USD)", "Đại lý (MXN)", "NH người nhận", "Người nhận"],
      partiesB: ["Người gửi", "Nạp tiền", "XRP Ledger", "Đối tác chi trả", "Người nhận"],
      caveat:
        "Không tuyến nào được đảm bảo nhanh hơn hay rẻ hơn. Tuân thủ, thanh khoản ngoại hối, kênh nạp/rút và hạ tầng chi trả địa phương vẫn cần thiết ở cả hai.",
    },
    liquidity: {
      title: "Thí nghiệm thanh khoản",
      amount: "Số tiền thanh toán (USD)",
      direct: "Thanh khoản trực tiếp USD/MXN",
      leg1: "Độ sâu USD/XRP",
      leg2: "Độ sâu XRP/MXN",
      impact: "Chênh lệch & phí mỗi chặng",
      best: "Tuyến ưu tiên",
      direct_only: "Trực tiếp",
      bridge_only: "Qua XRP",
      split: "Chia tuyến",
      out: "Người nhận được",
      effRate: "Tỷ giá thực tế",
      priceImpact: "Tác động giá",
      model:
        "Mô hình tích không đổi minh hoạ với tỷ giá tham chiếu giả định (1 USD = 18 MXN, 1 XRP = 2 USD). Không phải cơ chế tìm đường XRPL thật.",
    },
    dex: {
      title: "Sổ lệnh và AMM",
      size: "Khối lượng giao dịch (mua XRP)",
      liquidity: "Thanh khoản",
      mode: "Chế độ xem",
      book: "Sổ lệnh",
      amm: "Pool AMM",
      avg: "Giá trung bình",
      slippage: "Trượt giá so với giá giữa",
      levels: "Số mức giá đã quét",
      cost: "Tổng chi phí",
      model:
        "Mô hình giảng dạy: sổ lệnh tổng hợp và pool tích không đổi phí 0,3% quanh giá giữa minh hoạ 2,00 USD/XRP. Sổ lệnh và pool thật trên XRPL khác, và thanh toán có thể dùng cả hai cùng lúc.",
      insufficient: "Không đủ thanh khoản cho khối lượng này",
    },
    risk: {
      title: "Bản đồ rủi ro",
      select: "Chọn một rủi ro",
      effect: "Điều gì xảy ra",
      items: [
        {
          name: "Biến động thị trường",
          body: "Giá XRP có thể biến động mạnh chỉ trong vài phút. Nếu thanh toán dùng XRP làm cầu, tỷ giá nhận được phụ thuộc thị trường lúc khớp — một dao động ngắn làm thay đổi kết quả chuyển đổi minh hoạ.",
        },
        {
          name: "Thanh khoản mỏng",
          body: "Khi sổ lệnh và pool nông, tuyến bị thu hẹp: cùng một khoản thanh toán đẩy giá đi xa hơn và số peso đến nơi ít hơn.",
        },
        {
          name: "Trượt giá",
          body: "Lệnh lớn quét sâu vào sổ lệnh. Giá trung bình bạn nhận tệ hơn giá tốt nhất đang niêm yết.",
        },
        {
          name: "Rủi ro đối tác",
          body: "Bản thân XRP không phải khoản nợ của ai, nhưng các token như token USD hay MXN do một đơn vị phát hành — và kênh nạp/rút giữ tiền của khách hàng. Nếu đơn vị phát hành hoặc nhà cung cấp gặp sự cố, token hoặc khoản chi trả có thể không quy đổi được.",
        },
        {
          name: "Hạn chế pháp lý",
          body: "Giấy phép, lệnh trừng phạt và quy định về tài sản mã hoá khác nhau giữa các quốc gia và thay đổi theo thời gian. Một hành lang hoạt động hôm nay có thể bị hạn chế ngày mai.",
        },
        {
          name: "Gián đoạn hạ tầng",
          body: "Nếu đối tác chi trả, hệ thống ngân hàng hoặc sàn ngừng hoạt động, chặng trên sổ cái có thể đã cuối cùng trong khi người nhận vẫn chờ tiền pháp định.",
        },
        {
          name: "Giả định tin cậy validator",
          body: "Đồng thuận giả định các UNL chồng lấn đủ nhiều và phần lớn validator tin cậy trung thực, trực tuyến. Nếu hơn khoảng 20% UNL của một máy chủ ngoại tuyến, sổ cái ngừng được xác thực cho đến khi phục hồi — mạng dừng lại thay vì phân nhánh.",
        },
      ],
      labels: {
        price: "Tỷ giá minh hoạ",
        cost: "Chi phí chuyển đổi",
        offline: "Ngoại tuyến",
        settled: "Chặng XRPL đã chốt",
        waiting: "Chờ chi trả pháp định",
        blocked: "Bị hạn chế",
        halted: "Tạm dừng xác thực",
        quorum: "UNL trực tuyến",
      },
    },
    explorer: {
      title: "Trình khám phá giải phẫu",
      hint: "Kéo hình minh hoạ để xoay. Chọn một lớp hoặc một nhóm để phóng to.",
      categories: {
        core: "Tài sản lõi",
        ledger: "Sổ cái",
        consensus: "Đồng thuận",
        payments: "Thanh toán",
        liquidity: "Thanh khoản",
        risks: "Rủi ro",
      },
      zoomIn: "Phóng to",
      zoomOut: "Thu nhỏ",
      rotateLeft: "Xoay trái",
      rotateRight: "Xoay phải",
      reset: "Đặt lại góc nhìn",
      layer: "Lớp",
      none: "Chưa chọn gì — hãy chọn một lớp.",
    },
  },
  anatomy: [
    { name: "Vỏ ngoài", body: "'Đồng xu' quen thuộc — một ẩn dụ thị giác. XRP không có hình dạng vật lý; lớp vỏ chỉ là hình ảnh người ta dùng để nói về nó." },
    { name: "Tài sản số", body: "Chính là XRP: tài sản gốc của sổ cái, chia nhỏ tới một phần triệu (một drop). Nắm giữ trực tiếp trong tài khoản, không có đơn vị phát hành, không cần trust line." },
    { name: "Trạng thái sổ cái", body: "Cơ sở dữ liệu chung gồm tài khoản, số dư, lệnh, trust line và các đối tượng khác mà mọi máy chủ thống nhất sau mỗi sổ cái được xác thực." },
    { name: "Ký giao dịch", body: "Khoá riêng uỷ quyền giao dịch; chữ ký chứng minh điều đó. Số sequence chống phát lại. Có hỗ trợ đa chữ ký." },
    { name: "Mạng ngang hàng", body: "Các máy chủ độc lập chuyển tiếp giao dịch và đề xuất cho nhau. Ai cũng có thể chạy máy chủ; phần lớn không làm validator." },
    { name: "Đồng thuận validator", body: "Validator thống nhất từng sổ cái dựa trên danh sách tin cậy (UNL) và ngưỡng siêu đa số 80%. Không đào, không thưởng staking." },
    { name: "Phí giao dịch", body: "Một lượng XRP nhỏ (tham chiếu 10 drop, cao hơn khi tải lớn) bị huỷ theo mỗi giao dịch để bảo vệ mạng khỏi spam." },
    { name: "Định tuyến xuyên biên giới", body: "Thanh toán có thể giao một đồng tiền khác với đồng tiền gửi đi nhờ đi qua DEX. Các nhà cung cấp ngoài sổ cái lo phần tiền pháp định vào và ra." },
    { name: "Cầu thanh khoản", body: "XRP có thể đứng giữa hai tài sản khác (auto-bridging) khi hai thị trường XRP cộng lại cho tỷ giá tốt hơn thị trường trực tiếp." },
    { name: "Sàn phi tập trung", body: "Sổ lệnh gốc cùng các pool AMM (từ tháng 3/2024). Cả hai nằm trong trạng thái sổ cái và thanh toán dưới cơ chế đồng thuận." },
    { name: "Nguồn cung & ký quỹ", body: "100 tỷ XRP được tạo lúc ra mắt, giảm dần do phí bị huỷ. Ký quỹ khoá XRP đến một thời điểm hoặc điều kiện — Ripple dùng nó cho lượng XRP nắm giữ." },
    { name: "Rủi ro & hạ tầng", body: "Biến động thị trường, thanh khoản, đối tác, quy định, hạ tầng ngoài sổ cái và các giả định đồng thuận bao quanh mọi cách dùng XRP." },
  ],
  references: {
    heading: "Nguồn",
    note: "Dữ kiện kỹ thuật lấy từ tài liệu chính thức của XRP Ledger. Trang của Ripple chỉ được trích cho các thoả thuận riêng của Ripple. Số liệu nhạy cảm theo thị trường đều có ghi ngày.",
  },
};
