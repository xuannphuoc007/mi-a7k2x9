/** Story copy for the BNB & Binance explainer (six acts), English and Vietnamese.
 * Beginner-first. Accusations are labelled by status: admitted in court, dropped, pardoned, alleged & denied. */
export type Beat = { title: string; body: string[]; notes?: string[]; deep?: string[] };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "Who holds your coins?",
    title: "Who holds your coins?",
    question: "When an app says you own bitcoin, who actually has it?",
    figure: "Minh, a student in Hanoi, wants $100 of bitcoin. His order travels into a huge exchange that is both a marketplace and a vault, and his app shows a balance.",
    takeaway: "A crypto exchange is a marketplace and a vault at the same time. Your app balance is the exchange's promise — which is why who runs the exchange matters so much.",
    beats: [
      {
        title: "No crypto knowledge needed. We start with $100.",
        body: ["Minh is a student in Hanoi. He wants to buy $100 of bitcoin, but his bank doesn't sell it. Like most people, he downloads an exchange app. Scroll down — the picture tells the story."],
      },
      {
        title: "An exchange is two businesses in one.",
        body: [
          "A marketplace: it matches Minh with someone who wants to sell. A vault: after the trade, it keeps the bitcoin for him.",
          "Minh's app shows \"0.0014 BTC\". That number is a line in the exchange's own records — a promise that it holds the coin for him.",
        ],
      },
      {
        title: "The biggest exchange of them all is Binance.",
        body: ["Binance says it is closing in on 300 million users and it is the largest crypto exchange by trading volume. Its own coin, BNB, is one of the biggest cryptocurrencies."],
        notes: ["Binance at Binance Blockchain Week, Dec 2025 (The Block)."],
      },
      {
        title: "So its story affects millions of people.",
        body: [
          "Binance grew faster than any exchange in history. It also pleaded guilty to U.S. crimes, saw its founder go to prison and then be pardoned, faces new allegations it denies, and suffered the largest crypto theft on record.",
          "This story covers both: how it works, and what it has been accused of — with dates and sources.",
        ],
      },
    ],
  },
  {
    label: "The founder and a $15M start",
    title: "The founder and a $15M start",
    question: "How did a 2017 start-up become the world's biggest exchange in months?",
    figure: "A timeline from Changpeng Zhao's trading-software career to Binance's July 2017 launch, funded by selling 100 million BNB tokens, then a move out of China.",
    takeaway: "Binance started in 2017 with about $15 million raised by selling its own BNB token. It grew at record speed — partly by moving fast across borders, which later became its biggest legal problem.",
    beats: [
      {
        title: "Changpeng Zhao — \"CZ\".",
        body: [
          "Born in China in 1977, he moved to Canada as a teenager and spent his early career building trading software for stock exchanges and Bloomberg. He discovered bitcoin in 2013 and worked briefly at the Chinese exchange OKCoin.",
        ],
      },
      {
        title: "July 2017: Binance opens, funded by its own coin.",
        body: [
          "CZ and co-founder Yi He raised about $15 million in an online token sale, selling BNB for roughly 10–15 cents each. Of the 200 million BNB created, half went to the public, 40% to the founding team and 10% to early investors. (A 2023 Forbes investigation, using on-chain data, argued the sale really raised under $5 million and that far fewer tokens reached buyers; Binance has stood by its figures.)",
        ],
        notes: ["CoinDesk; BNB whitepaper (2017)."],
      },
      {
        title: "September 2017: China bans exchanges — Binance moves.",
        body: [
          "Weeks after launch, China shut down local crypto exchanges. Binance shifted to Japan, then Malta and elsewhere. For years it had no official headquarters — a strength for growth, and a weakness with regulators.",
        ],
      },
      {
        title: "Within months, the largest exchange in the world.",
        body: [
          "Low fees, hundreds of coins and a fast app pulled in traders. BNB became the coin that gave discounts on those fees — tying its value to Binance's success.",
        ],
      },
    ],
  },
  {
    label: "Nine years in fast-forward",
    title: "Nine years in fast-forward",
    question: "What has happened to Binance and BNB since 2017?",
    figure: "BNB's price from 2017 to November 2026 on a log scale, drawn as the playhead advances; events burst as they are crossed — red for hacks and legal blows, white for peaks, gold for milestones.",
    takeaway: "BNB went from about 10 cents to a record near $1,375 in October 2025. Along the way came hacks, a criminal guilty plea, a pardon and the biggest crypto theft ever. The price has followed both the market and the headlines.",
    beats: [
      {
        title: "2017–2019: launch, China ban, first big hack.",
        body: ["In May 2019 hackers stole 7,000 bitcoin (about $40 million then). Binance covered it from an emergency fund it had set aside."],
      },
      {
        title: "2020–2022: its own blockchain, a bridge hack, FTX's collapse.",
        body: [
          "BNB Smart Chain launched in 2020. In October 2022 a bridge on that chain was exploited for about $570 million, and validators halted the chain. A month later rival exchange FTX collapsed — and Binance became even more dominant.",
        ],
      },
      {
        title: "2023–2024: guilty plea and prison.",
        body: ["In November 2023 Binance and CZ pleaded guilty to U.S. charges and agreed to pay $4.3 billion. CZ stepped down and served four months in prison in 2024."],
      },
      {
        title: "2025: political turn, record price, a pardon.",
        body: [
          "A $2 billion investment settled in a Trump-family-linked stablecoin, the SEC dropping its case, the 10/10 crash, a record BNB price — and in October, a presidential pardon for CZ.",
        ],
      },
      {
        title: "2026: new allegations and the largest hack ever.",
        body: ["Reports of Iran-linked flows and new probes, which Binance denies and is suing over. Then on 29 October, about $6.3 billion stolen. By mid-November BNB was near $600."],
        notes: ["Prices: Coin Metrics daily closes to 23 May 2026, then dated press reports (dashed)."],
      },
    ],
  },
  {
    label: "The marketplace",
    title: "The marketplace",
    question: "What happens when Minh presses 'Buy'?",
    figure: "An order book: buyers' prices on one side, sellers' prices on the other. Orders meet in the middle, trades print, and a small fee drops into the exchange's account.",
    takeaway: "The exchange matches buyers and sellers and takes a small fee on every trade. After the trade, your coins usually stay in the exchange's wallets — not yours.",
    beats: [
      {
        title: "Buyers on one side, sellers on the other.",
        body: [
          "Every buyer posts the highest price they'll pay; every seller the lowest they'll accept. The list is called the order book. When the prices meet, the exchange's computer matches them — thousands of times a second.",
        ],
      },
      {
        title: "On every trade, the exchange earns a fee.",
        body: [
          "A standard spot trade on Binance costs about 0.1%. Pay that fee in BNB and you get a discount — one of the main reasons people hold BNB.",
          "Multiply tiny fees by billions of dollars of trading a day and you get one of the most profitable companies in crypto.",
        ],
      },
      {
        title: "After the trade, who holds the bitcoin?",
        body: [
          "Binance does. Most coins sit in offline 'cold' wallets; some sit in online 'hot' wallets so withdrawals are fast. Minh's balance is a number in Binance's database.",
          "That's convenient — and it means Minh trusts Binance's security, honesty and ability to pay. Crypto users have a saying: \"not your keys, not your coins.\"",
        ],
      },
    ],
  },
  {
    label: "Proof of reserves",
    title: "Proof of reserves",
    question: "How can you tell an exchange really has your money?",
    figure: "A stack of customer balances is folded into a tree of fingerprints; Minh checks his own leaf; a reserve bar is compared with what customers are owed — with what the proof cannot see shown in grey.",
    takeaway: "Proof of reserves lets you check your balance is counted and that the exchange holds at least that much of each coin. It is not a full audit: debts and other liabilities can stay out of view.",
    beats: [
      {
        title: "November 2022: FTX shows what can go wrong.",
        body: ["FTX, then one of the largest exchanges, had quietly used customers' money. When people rushed to withdraw, it couldn't pay and collapsed within days. Every exchange was suddenly asked: do you really hold our coins?"],
      },
      {
        title: "Binance's answer: a public proof.",
        body: [
          "Binance began publishing 'proof of reserves'. All customer balances are hashed into a tree; you can check your own balance is in it. Binance then shows its wallets hold at least as much of each coin as customers are owed.",
        ],
        deep: ["The tree is called a Merkle tree: each pair of balances is combined into one fingerprint, then pairs of fingerprints, up to a single 'root'. Change any balance and the root changes."],
      },
      {
        title: "What it can't show.",
        body: [
          "A snapshot doesn't show debts the company owes elsewhere, whether coins were borrowed just for the snapshot, or how safe the wallets are. An accounting firm that had reviewed Binance's first report stopped working with crypto clients in December 2022.",
          "After the October 2026 hack, Binance expanded the proof to 44 tokens.",
        ],
        notes: ["CoinGabbar on the 4 Nov 2026 proof-of-reserves snapshot."],
      },
    ],
  },
  {
    label: "BNB: the exchange's own coin",
    title: "BNB: the exchange's own coin",
    question: "What is BNB for, and why is its supply shrinking?",
    figure: "Uses of BNB orbit the coin — fee discounts, gas on BNB Chain, token launches — while a supply bar burns down from 200 million toward a 100 million target.",
    takeaway: "BNB gives discounts and pays fees on BNB Chain, and Binance burns part of the supply every quarter. That makes BNB unusually tied to one company's fortunes.",
    beats: [
      {
        title: "Three main jobs.",
        body: [
          "A discount coupon for trading fees on Binance. The 'gas' that pays for transactions on BNB Chain. And a ticket to Binance's token-launch programmes.",
        ],
      },
      {
        title: "Burning towards 100 million.",
        body: [
          "BNB started with 200 million coins. Every quarter a formula-based 'auto-burn' destroys some, plus part of every fee on BNB Chain. After the 37th burn in October 2026, about 131.5 million remained, against a target of 100 million.",
        ],
        notes: ["BNB Chain / TokenPost via CoinPaprika, Nov 2026."],
      },
      {
        title: "The catch: one company in the middle.",
        body: [
          "Unlike bitcoin or ether, BNB was created by a company that sold it to fund itself, kept 40% for its team and still drives most of its use. Good news for Binance tends to lift BNB; bad news hits it directly.",
        ],
      },
    ],
  },
  {
    label: "BNB Chain: fast, but few",
    title: "BNB Chain: fast, but few",
    question: "Is BNB Chain decentralised?",
    figure: "Forty-five validators on BNB Chain beside the crowd of validators on Ethereum; blocks fly by every 0.45 seconds; in 2022 the validators are contacted one by one and the chain stops.",
    takeaway: "BNB Chain is fast and cheap because only a small set of validators run it. That same smallness let it be paused within hours in 2022 — useful in a crisis, and the main reason critics call it centralised.",
    beats: [
      {
        title: "A copy of Ethereum, tuned for speed.",
        body: ["BNB Chain runs software forked from Ethereum, so the same apps work. But instead of hundreds of thousands of validators, it uses 45 active ones — 21 at a time — and produces a block about every 0.45 seconds."],
        notes: ["BNB Chain docs and BNBScan via CoinPaprika, 5 Nov 2026."],
      },
      {
        title: "October 2022: the chain that could be stopped.",
        body: [
          "When a bridge was hacked for about $570 million, BNB Chain contacted its validators \"one by one\" and halted the network within hours, limiting the damage. On Ethereum or Bitcoin, that kind of quick stop is practically impossible.",
        ],
      },
      {
        title: "Two ways to read it.",
        body: [
          "Supporters: fast, cheap, and able to protect users in an emergency. Critics: a few parties — many close to Binance — can coordinate to change or stop the chain. One analysis puts the number needed to stall it at about 7, versus about 30 for Ethereum. BNB Chain says Binance does not control BNB or the chain.",
        ],
        notes: ["Blockworks (2022); QuickNode on validator concentration."],
      },
    ],
  },
  {
    label: "Guilty: the 2023 plea",
    title: "Guilty: the 2023 plea",
    question: "What exactly did Binance and CZ admit?",
    figure: "A $4.3 billion stack splits into a criminal fine and forfeited money; CZ's name moves from CEO to a four-month prison term; a monitor watches the company.",
    takeaway: "This part is not an allegation: Binance and CZ pleaded guilty in a U.S. court. The crimes were about failing to stop and report illegal money — not about stealing customers' funds.",
    beats: [
      {
        title: "21 November 2023: guilty pleas in Seattle.",
        body: [
          "Binance admitted failing to keep an effective anti-money-laundering programme, running an unlicensed money-transmitting business and violating U.S. sanctions. It agreed to pay $4.3 billion — a $1.8 billion criminal fine plus $2.5 billion forfeited — and to accept an independent monitor.",
        ],
        notes: ["U.S. Department of Justice; Shearman & Sterling analysis."],
      },
      {
        title: "What officials said it allowed.",
        body: [
          "U.S. officials said the failures let money connected to child abuse, drug trafficking and terrorism move through the exchange, and that Binance served users in sanctioned places such as Iran.",
          "Binance said the settlement let it \"turn the page\" and invest heavily in compliance.",
        ],
        notes: ["AP; Treasury and DOJ statements, Nov 2023."],
      },
      {
        title: "CZ: resignation, $50 million, four months.",
        body: [
          "CZ pleaded guilty personally to a Bank Secrecy Act violation, paid a $50 million fine and stepped down as CEO. Richard Teng took over. In April 2024 a judge sentenced CZ to four months in prison; he was released in September 2024.",
        ],
      },
    ],
  },
  {
    label: "Politics and a pardon",
    title: "Politics and a pardon",
    question: "Why do critics link Binance's comeback to U.S. politics?",
    figure: "Three dated events line up — a $2 billion investment settled in a Trump-family-linked stablecoin, the SEC dropping its case, a presidential pardon — with supporters' and critics' readings on either side.",
    takeaway: "Facts: a Trump-linked stablecoin was used for a $2 billion Binance deal, the SEC dropped its case, and CZ was pardoned. Supporters call it the end of an unfair crackdown; critics call it a conflict of interest. Both readings are below.",
    beats: [
      {
        title: "2025: three things happen in seven months.",
        body: [
          "March–May: Abu Dhabi's MGX invests $2 billion in Binance, settled in USD1 — a stablecoin from the Trump family's World Liberty Financial. 29 May: the SEC drops its 2023 civil case against Binance and CZ, with prejudice. 23 October: President Trump pardons CZ.",
        ],
        notes: ["The Block; Reuters; SEC litigation release, 29 May 2025."],
      },
      {
        title: "The case for the pardon.",
        body: [
          "The White House said CZ was prosecuted in the previous administration's \"war on crypto\", with no allegations of fraud or identifiable victims. Supporters note a prison term was unusual for a first-time Bank Secrecy Act case. President Trump said he did not know CZ.",
        ],
      },
      {
        title: "The case against.",
        body: [
          "Critics, including Senator Elizabeth Warren, said CZ pleaded guilty, then boosted one of the President's crypto ventures and lobbied for a pardon. By February 2026 Binance reportedly held about 89% of all USD1 in custody — deepening concerns about ties between the exchange and the President's family business.",
        ],
        notes: ["Reuters; DL News (Feb 2026)."],
      },
    ],
  },
  {
    label: "Open allegations",
    title: "Open allegations",
    question: "What is Binance accused of now — and what does it say?",
    figure: "Two cases side by side. The 10/10 crash: prices on Binance briefly break, then $283 million is repaid. The 2026 Iran-flow reports: a newspaper report, Senate letters, a reported Justice Department probe — and Binance's denial and lawsuit.",
    takeaway: "These are allegations, not findings. Binance denies the Iran-flow reports and is suing the Wall Street Journal; the newspaper stands by its reporting. Watch how the investigations and the lawsuit end.",
    beats: [
      {
        title: "10 October 2025: the biggest liquidation day ever.",
        body: [
          "Over $19 billion of leveraged bets were wiped out across crypto. On Binance, the dollar token USDe briefly traded near $0.65 and other collateral lost its peg, liquidating users. Binance blamed technical glitches and market conditions, said the depegs came after the market bottom, and repaid about $283 million.",
        ],
        notes: ["CoinGecko; The Block; Binance statement, Oct 2025."],
      },
      {
        title: "February 2026: reports of Iran-linked flows.",
        body: [
          "The Wall Street Journal reported that Binance's own investigators had traced about $1.7 billion to Iran-linked entities and were later dismissed. Senator Richard Blumenthal opened an inquiry; 11 senators asked Treasury and the Justice Department to investigate; the Journal later reported a Justice Department probe.",
        ],
        notes: ["Decrypt; Cointelegraph; Senate letter, 24 Feb 2026."],
      },
      {
        title: "Binance's answer: \"defamatory\".",
        body: [
          "Binance told the Senate its review found no accounts transacting directly with Iranian entities, said it did not fire staff for raising concerns, and on 11 March 2026 sued the Journal's publisher for defamation. The Journal stands by its reporting and has asked the court to dismiss the suit. No court has ruled on the facts.",
        ],
        notes: ["The Block; Courthouse News via Talking Biz News (Aug 2026)."],
      },
    ],
  },
  {
    label: "The $6.3 billion hack",
    title: "The $6.3 billion hack",
    question: "What happened on 29 October 2026?",
    figure: "Hot wallets on about ten blockchains empty within hours; a frozen portion is held back by partners; a replacement stack refills customers' balances.",
    takeaway: "The largest crypto theft on record hit Binance's hot wallets, not customers' balances: Binance covered the losses with company money. It showed both Binance's size and the risk of keeping coins on any exchange.",
    beats: [
      {
        title: "About $6.3 billion, in one evening.",
        body: [
          "From 20:05 UTC on 29 October, Binance's online 'hot' wallets on about ten blockchains were drained — more than four times the 2025 Bybit theft, until then the record. Blockchain analysts linked it to North Korean hackers; Binance and governments had not confirmed that at the time.",
        ],
        notes: ["TRM Labs; Chainalysis via Al Jazeera; Binance incident update."],
      },
      {
        title: "Freeze, pause, repay.",
        body: [
          "Stablecoin issuers and partners froze about $3 billion — Tether alone over 1.5 billion USDT. Binance paused withdrawals and reopened them coin by coin from 1 November. It said the attack \"should not have happened\" and that it would bear the full cost; by 13 November it said it had covered more than $6.34 billion with company funds.",
        ],
      },
      {
        title: "What it means.",
        body: [
          "Customers were made whole — something only a very large company could afford. But withdrawals were frozen for days, and BNB fell about 23% in the two weeks after. Critics ask why so much sat in online wallets; Binance has promised an independent security review.",
        ],
        notes: ["Memeburn; CryptoTicker, Nov 2026."],
      },
    ],
  },
  {
    label: "The people at the top",
    title: "The people at the top",
    question: "Who runs Binance now — and who still shapes it?",
    figure: "Three profile cards: the founder, the co-founder and co-CEO, and the ex-regulator co-CEO — each with role, dates and the main criticism.",
    takeaway: "Binance is led by a former regulator and a co-founder, while its pardoned founder remains its most influential voice. Critics say the founder's circle still holds the real power; Binance says the two-CEO model combines compliance and innovation.",
    beats: [
      {
        title: "CZ — the founder.",
        body: [
          "Pleaded guilty in 2023, served four months, pardoned in 2025. He says he no longer manages the exchange, but remains Binance's best-known figure and a constant voice on X. After the pardon, The Block noted it could pave the way for his return.",
        ],
      },
      {
        title: "Yi He — co-founder, co-CEO since December 2025.",
        body: [
          "Ran marketing and customer service from the start. Named co-CEO on 3 December 2025 alongside Richard Teng. She is CZ's life partner; CZ wrote she \"should have been the Binance CEO from day 1\". Critics see the appointment as founder control continuing.",
        ],
        notes: ["The Block; Banking Dive, Dec 2025."],
      },
      {
        title: "Richard Teng — the ex-regulator.",
        body: [
          "A former financial regulator in Singapore and Abu Dhabi, CEO since November 2023, now co-CEO. He is the face of Binance's compliance push — and the one answering the 2026 Senate letters and leading the response to the hack.",
        ],
      },
    ],
  },
  {
    label: "On the exchange or in your wallet?",
    title: "On the exchange or in your wallet?",
    question: "Where should Minh keep his $100 of bitcoin?",
    figure: "Two shelves: coins kept on an exchange account and coins kept in a wallet you control, compared row by row.",
    takeaway: "An exchange is convenient and can make you whole after a hack — if it chooses and is able to. Your own wallet removes that dependence but puts all the responsibility on you.",
    beats: [
      {
        title: "Two ways to hold the same coin.",
        body: ["Keep it on the exchange, or withdraw it to a wallet only you control. The table below compares them."],
      },
      {
        title: "A simple rule many people use.",
        body: [
          "Keep on an exchange only what you are actively trading; move long-term savings to a wallet you control and back up the recovery phrase offline. Either way, never share that phrase with anyone.",
        ],
      },
    ],
  },
  {
    label: "Reality check",
    title: "Reality check",
    question: "Strengths, risks — and what this means for BNB.",
    figure: "A balance beam: strengths on one side, risks on the other, with BNB's last twelve months of price beneath.",
    takeaway: "Binance is the biggest, most liquid exchange and has repaid users after every major incident. It is also a convicted company with a pardoned founder, open allegations and the record hack. BNB carries all of that.",
    beats: [
      {
        title: "What's strong.",
        body: ["The most users and trading volume in crypto. It has repaid users after the 2019 hack, the 10/10 crash and the 2026 theft. Proof of reserves is public. BNB's supply keeps shrinking through burns."],
      },
      {
        title: "What's risky.",
        body: [
          "A 2023 criminal conviction and ongoing monitoring; new allegations it denies; close ties to U.S. political interests that critics question; the largest hack on record; and a coin and chain that depend heavily on one company.",
        ],
      },
      {
        title: "Both are true at once.",
        body: [
          "BNB hit a record near $1,375 in October 2025 and was near $600 in mid-November 2026 — down more than half. If you hold BNB, you are betting on Binance itself: its business, its legal fights and its security.",
        ],
        notes: ["AMBCrypto (record high); ad-hoc-news, 14 Nov 2026."],
      },
    ],
  },
  {
    label: "Back to Minh",
    title: "Back to Minh",
    question: "So — what should Minh do with his $100?",
    figure: "A gold coin marked BNB assembles from its pieces. Drag to rotate it.",
    takeaway: "Exchanges make crypto easy, and Binance made it easiest of all. Understanding who holds the coins — and the record of the people who run the exchange — is the point.",
    beats: [
      {
        title: "Minh bought his bitcoin in seconds.",
        body: ["The order matched, the fee was a few cents, and his app shows the balance. Now he knows that balance is Binance's promise, backed by Binance's reserves, security and record."],
      },
      {
        title: "What he decides.",
        body: [
          "He keeps a small amount on the exchange to trade, withdraws the rest to his own wallet, writes the recovery phrase on paper — and keeps an eye on the news in this story.",
        ],
      },
      {
        title: "One coin, the whole story.",
        body: ["Drag the coin to turn it. Or use the chapter list at the top to jump back to any part of the story."],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Ai giữ coin của bạn?",
    title: "Ai giữ coin của bạn?",
    question: "Khi app báo bạn đang có bitcoin, thực ra ai đang giữ nó?",
    figure: "Minh, sinh viên ở Hà Nội, muốn mua 100 USD bitcoin. Lệnh của cậu đi vào một sàn giao dịch khổng lồ vừa là chợ vừa là két sắt, và app hiện ra một con số số dư.",
    takeaway: "Sàn crypto vừa là chợ vừa là két sắt. Số dư trên app là lời hứa của sàn — vì vậy ai điều hành sàn là chuyện rất quan trọng.",
    beats: [
      {
        title: "Không cần biết gì về crypto. Ta bắt đầu với 100 USD.",
        body: ["Minh là sinh viên ở Hà Nội. Cậu muốn mua 100 USD bitcoin nhưng ngân hàng không bán. Như phần lớn mọi người, cậu tải app của một sàn giao dịch. Hãy cuộn xuống — hình bên cạnh sẽ kể câu chuyện."],
      },
      {
        title: "Sàn giao dịch là hai công việc trong một.",
        body: [
          "Một cái chợ: ghép Minh với người muốn bán. Một cái két: sau khi mua, sàn giữ bitcoin giúp cậu.",
          "App của Minh hiện \"0,0014 BTC\". Con số đó là một dòng trong sổ sách của chính sàn — lời hứa rằng sàn đang giữ coin cho cậu.",
        ],
      },
      {
        title: "Sàn lớn nhất trong số đó là Binance.",
        body: ["Binance cho biết sắp chạm 300 triệu người dùng và là sàn crypto lớn nhất theo khối lượng giao dịch. Đồng coin riêng của sàn, BNB, nằm trong nhóm crypto lớn nhất."],
        notes: ["Binance tại Binance Blockchain Week, 12/2025 (The Block)."],
      },
      {
        title: "Vì vậy câu chuyện của nó ảnh hưởng tới hàng triệu người.",
        body: [
          "Binance lớn nhanh hơn bất kỳ sàn nào trong lịch sử. Nó cũng đã nhận tội hình sự tại Mỹ, nhà sáng lập từng ngồi tù rồi được ân xá, đang đối mặt với những cáo buộc mới mà nó phủ nhận, và hứng vụ trộm crypto lớn nhất từng ghi nhận.",
          "Câu chuyện này kể cả hai mặt: sàn hoạt động thế nào, và nó đã bị cáo buộc những gì — có ngày tháng và nguồn.",
        ],
      },
    ],
  },
  {
    label: "Nhà sáng lập và 15 triệu USD khởi đầu",
    title: "Nhà sáng lập và 15 triệu USD khởi đầu",
    question: "Làm sao một start-up năm 2017 thành sàn lớn nhất thế giới chỉ sau vài tháng?",
    figure: "Dòng thời gian từ sự nghiệp viết phần mềm giao dịch của Changpeng Zhao đến ngày Binance ra mắt tháng 7/2017, gọi vốn bằng cách bán 100 triệu BNB, rồi rời khỏi Trung Quốc.",
    takeaway: "Binance khởi đầu năm 2017 với khoảng 15 triệu USD gọi được nhờ bán chính token BNB của mình. Sàn lớn với tốc độ kỷ lục — một phần nhờ đi nhanh qua nhiều quốc gia, điều về sau thành rắc rối pháp lý lớn nhất của nó.",
    beats: [
      {
        title: "Changpeng Zhao — \"CZ\".",
        body: ["Sinh năm 1977 ở Trung Quốc, sang Canada khi còn là thiếu niên, những năm đầu sự nghiệp viết phần mềm giao dịch cho các sở chứng khoán và Bloomberg. Ông biết đến bitcoin năm 2013 và làm một thời gian ngắn ở sàn OKCoin của Trung Quốc."],
      },
      {
        title: "Tháng 7/2017: Binance mở cửa, gọi vốn bằng coin của chính nó.",
        body: ["CZ và đồng sáng lập Yi He gọi được khoảng 15 triệu USD qua đợt bán token trực tuyến, mỗi BNB giá chừng 10–15 xu. Trong 200 triệu BNB được tạo ra, một nửa bán cho công chúng, 40% cho đội sáng lập và 10% cho nhà đầu tư thiên thần. (Một điều tra của Forbes năm 2023, dựa trên dữ liệu on-chain, cho rằng đợt bán thực ra chỉ thu chưa tới 5 triệu USD và số token đến tay người mua ít hơn nhiều; Binance giữ nguyên số liệu của mình.)"],
        notes: ["CoinDesk; whitepaper BNB (2017)."],
      },
      {
        title: "Tháng 9/2017: Trung Quốc cấm sàn — Binance dời đi.",
        body: ["Vài tuần sau khi ra mắt, Trung Quốc đóng cửa các sàn crypto trong nước. Binance chuyển sang Nhật, rồi Malta và nơi khác. Nhiều năm liền sàn không có trụ sở chính thức — lợi thế để tăng trưởng, nhưng là điểm yếu với cơ quan quản lý."],
      },
      {
        title: "Chỉ vài tháng, thành sàn lớn nhất thế giới.",
        body: ["Phí thấp, hàng trăm loại coin và app nhanh hút trader. BNB trở thành đồng coin cho giảm giá phí giao dịch — khiến giá trị của nó gắn chặt với thành công của Binance."],
      },
    ],
  },
  {
    label: "Chín năm tua nhanh",
    title: "Chín năm tua nhanh",
    question: "Từ 2017 đến nay, chuyện gì đã xảy ra với Binance và BNB?",
    figure: "Giá BNB từ 2017 đến 11/2026 theo thang log, tự vẽ khi thanh thời gian chạy; mỗi sự kiện bùng lên khi được vượt qua — đỏ cho hack và đòn pháp lý, trắng cho đỉnh, vàng cho cột mốc.",
    takeaway: "BNB đi từ khoảng 10 xu lên mức kỷ lục gần 1.375 USD vào tháng 10/2025. Dọc đường là các vụ hack, một lần nhận tội hình sự, một lệnh ân xá và vụ trộm crypto lớn nhất lịch sử. Giá đi theo cả thị trường lẫn tin tức.",
    beats: [
      {
        title: "2017–2019: ra mắt, Trung Quốc cấm, vụ hack lớn đầu tiên.",
        body: ["Tháng 5/2019 hacker lấy 7.000 bitcoin (khoảng 40 triệu USD lúc đó). Binance bù lại bằng quỹ khẩn cấp đã trích lập sẵn."],
      },
      {
        title: "2020–2022: blockchain riêng, cầu nối bị hack, FTX sụp đổ.",
        body: ["BNB Smart Chain ra mắt năm 2020. Tháng 10/2022 một cầu nối trên chuỗi này bị khai thác khoảng 570 triệu USD và các validator dừng cả chuỗi. Một tháng sau sàn đối thủ FTX sụp đổ — và Binance càng thống trị."],
      },
      {
        title: "2023–2024: nhận tội và ngồi tù.",
        body: ["Tháng 11/2023 Binance và CZ nhận tội trước các cáo buộc tại Mỹ và đồng ý nộp 4,3 tỷ USD. CZ từ chức và ngồi tù bốn tháng năm 2024."],
      },
      {
        title: "2025: bước ngoặt chính trị, giá kỷ lục, lệnh ân xá.",
        body: ["Khoản đầu tư 2 tỷ USD được thanh toán bằng stablecoin gắn với gia đình Trump, SEC rút vụ kiện, cú sập 10/10, giá BNB kỷ lục — và tháng 10, tổng thống ân xá cho CZ."],
      },
      {
        title: "2026: cáo buộc mới và vụ hack lớn nhất lịch sử.",
        body: ["Báo chí đưa tin về dòng tiền liên quan Iran và các cuộc điều tra mới, Binance phủ nhận và đang khởi kiện. Rồi ngày 29/10, khoảng 6,3 tỷ USD bị đánh cắp. Đến giữa tháng 11, BNB quanh 600 USD."],
        notes: ["Giá: giá đóng cửa ngày của Coin Metrics đến 23/5/2026, sau đó là số liệu báo chí có ghi ngày (nét đứt)."],
      },
    ],
  },
  {
    label: "Cái chợ",
    title: "Cái chợ",
    question: "Chuyện gì xảy ra khi Minh bấm 'Mua'?",
    figure: "Một sổ lệnh: giá của người mua một bên, giá của người bán một bên. Lệnh gặp nhau ở giữa, giao dịch khớp, và một khoản phí nhỏ rơi vào tài khoản của sàn.",
    takeaway: "Sàn ghép người mua với người bán và thu một khoản phí nhỏ mỗi giao dịch. Sau đó coin của bạn thường nằm trong ví của sàn — không phải ví của bạn.",
    beats: [
      {
        title: "Người mua một bên, người bán một bên.",
        body: ["Mỗi người mua đặt mức giá cao nhất họ chịu trả; mỗi người bán đặt mức giá thấp nhất họ chịu bán. Danh sách đó gọi là sổ lệnh. Khi giá gặp nhau, máy tính của sàn khớp lệnh — hàng nghìn lần mỗi giây."],
      },
      {
        title: "Mỗi giao dịch, sàn thu phí.",
        body: [
          "Một giao dịch giao ngay thông thường trên Binance tốn khoảng 0,1%. Trả phí bằng BNB thì được giảm giá — một lý do chính khiến người ta giữ BNB.",
          "Nhân khoản phí nhỏ đó với hàng tỷ USD giao dịch mỗi ngày, bạn có một trong những công ty lãi nhất ngành crypto.",
        ],
      },
      {
        title: "Mua xong, ai giữ bitcoin?",
        body: [
          "Binance giữ. Phần lớn coin nằm trong ví 'lạnh' ngoại tuyến; một phần nằm trong ví 'nóng' trực tuyến để rút cho nhanh. Số dư của Minh là một con số trong cơ sở dữ liệu của Binance.",
          "Rất tiện — nhưng nghĩa là Minh tin vào bảo mật, sự trung thực và khả năng chi trả của Binance. Dân crypto có câu: \"không giữ khoá, không phải coin của bạn.\"",
        ],
      },
    ],
  },
  {
    label: "Bằng chứng dự trữ",
    title: "Bằng chứng dự trữ",
    question: "Làm sao biết sàn thật sự đang giữ tiền của bạn?",
    figure: "Số dư của mọi khách hàng được gấp thành một cây dấu vân tay; Minh tự kiểm tra chiếc lá của mình; một thanh dự trữ được so với số sàn đang nợ khách — phần bằng chứng không nhìn thấy được tô xám.",
    takeaway: "Bằng chứng dự trữ cho bạn kiểm tra số dư của mình có được tính, và sàn giữ ít nhất chừng đó mỗi loại coin. Nó không phải kiểm toán đầy đủ: các khoản nợ khác có thể nằm ngoài tầm nhìn.",
    beats: [
      {
        title: "Tháng 11/2022: FTX cho thấy điều có thể xảy ra.",
        body: ["FTX, khi đó là một trong những sàn lớn nhất, đã lén dùng tiền của khách. Khi mọi người đổ xô rút, sàn không trả nổi và sụp trong vài ngày. Mọi sàn bỗng bị hỏi: các anh có thật giữ coin của chúng tôi không?"],
      },
      {
        title: "Câu trả lời của Binance: một bằng chứng công khai.",
        body: ["Binance bắt đầu công bố 'bằng chứng dự trữ'. Số dư của mọi khách hàng được băm thành một cây; bạn tự kiểm tra số dư của mình có trong đó. Sau đó Binance cho thấy ví của mình giữ ít nhất bằng số đang nợ khách của từng loại coin."],
        deep: ["Cây này gọi là cây Merkle: mỗi cặp số dư được gộp thành một dấu vân tay, rồi từng cặp dấu vân tay, cho đến một 'gốc' duy nhất. Sửa bất kỳ số dư nào thì gốc thay đổi."],
      },
      {
        title: "Những gì nó không chứng minh được.",
        body: [
          "Một bức ảnh chụp nhanh không cho thấy khoản nợ công ty vay ở nơi khác, coin có bị vay tạm chỉ để chụp hay không, hay ví an toàn đến đâu. Công ty kế toán từng rà soát báo cáo đầu tiên của Binance đã ngừng làm việc với khách hàng crypto từ tháng 12/2022.",
          "Sau vụ hack tháng 10/2026, Binance mở rộng bằng chứng lên 44 token.",
        ],
        notes: ["CoinGabbar về ảnh chụp bằng chứng dự trữ ngày 4/11/2026."],
      },
    ],
  },
  {
    label: "BNB: đồng coin của sàn",
    title: "BNB: đồng coin của sàn",
    question: "BNB dùng để làm gì, và vì sao nguồn cung ngày càng ít?",
    figure: "Các công dụng của BNB xoay quanh đồng coin — giảm phí, gas trên BNB Chain, mở bán token — trong khi thanh nguồn cung cháy dần từ 200 triệu về mục tiêu 100 triệu.",
    takeaway: "BNB cho giảm phí và trả phí trên BNB Chain, và mỗi quý một phần nguồn cung bị đốt. Điều đó khiến BNB gắn chặt bất thường với vận mệnh của một công ty.",
    beats: [
      {
        title: "Ba công việc chính.",
        body: ["Phiếu giảm giá cho phí giao dịch trên Binance. 'Gas' trả phí giao dịch trên BNB Chain. Và vé vào các chương trình mở bán token của Binance."],
      },
      {
        title: "Đốt dần về 100 triệu.",
        body: ["BNB khởi đầu với 200 triệu coin. Mỗi quý, cơ chế 'đốt tự động' theo công thức tiêu huỷ một phần, cộng thêm một phần phí trên BNB Chain. Sau đợt đốt thứ 37 vào tháng 10/2026, còn khoảng 131,5 triệu, so với mục tiêu 100 triệu."],
        notes: ["BNB Chain / TokenPost qua CoinPaprika, 11/2026."],
      },
      {
        title: "Điểm mấu chốt: một công ty đứng giữa.",
        body: ["Khác bitcoin hay ether, BNB do một công ty tạo ra và bán để tự gọi vốn, giữ 40% cho đội ngũ và vẫn là bên tạo ra phần lớn nhu cầu sử dụng. Tin tốt cho Binance thường đẩy BNB lên; tin xấu đánh thẳng vào nó."],
      },
    ],
  },
  {
    label: "BNB Chain: nhanh, nhưng ít người",
    title: "BNB Chain: nhanh, nhưng ít người",
    question: "BNB Chain có phi tập trung không?",
    figure: "Bốn mươi lăm validator của BNB Chain cạnh đám đông validator của Ethereum; các khối bay qua mỗi 0,45 giây; năm 2022 các validator được liên hệ từng người một và chuỗi dừng lại.",
    takeaway: "BNB Chain nhanh và rẻ vì chỉ một nhóm nhỏ validator vận hành. Chính sự nhỏ đó giúp nó dừng được trong vài giờ năm 2022 — hữu ích khi khủng hoảng, và là lý do chính khiến giới phê bình gọi nó là tập trung.",
    beats: [
      {
        title: "Bản sao của Ethereum, chỉnh cho nhanh.",
        body: ["BNB Chain chạy phần mềm tách ra từ Ethereum nên dùng được cùng ứng dụng. Nhưng thay vì hàng trăm nghìn validator, nó dùng 45 validator hoạt động — mỗi lượt 21 — và ra một khối khoảng mỗi 0,45 giây."],
        notes: ["Tài liệu BNB Chain và BNBScan qua CoinPaprika, 5/11/2026."],
      },
      {
        title: "Tháng 10/2022: chuỗi có thể bị dừng.",
        body: ["Khi một cầu nối bị hack khoảng 570 triệu USD, BNB Chain liên hệ các validator \"từng người một\" và dừng mạng trong vài giờ, hạn chế thiệt hại. Trên Ethereum hay Bitcoin, dừng nhanh như vậy gần như không thể."],
      },
      {
        title: "Hai cách nhìn.",
        body: ["Phía ủng hộ: nhanh, rẻ, và bảo vệ được người dùng khi khẩn cấp. Phía phê bình: chỉ vài bên — nhiều bên thân với Binance — có thể phối hợp đổi hoặc dừng chuỗi. Một phân tích ước tính chỉ cần khoảng 7 bên để làm tê liệt chuỗi, so với khoảng 30 của Ethereum. BNB Chain khẳng định Binance không kiểm soát BNB hay chuỗi."],
        notes: ["Blockworks (2022); QuickNode về mức tập trung validator."],
      },
    ],
  },
  {
    label: "Có tội: bản nhận tội 2023",
    title: "Có tội: bản nhận tội 2023",
    question: "Chính xác thì Binance và CZ đã thừa nhận điều gì?",
    figure: "Chồng tiền 4,3 tỷ USD tách thành khoản phạt hình sự và khoản tịch thu; tên CZ chuyển từ CEO sang bản án bốn tháng tù; một giám sát viên theo dõi công ty.",
    takeaway: "Phần này không phải cáo buộc: Binance và CZ đã nhận tội trước toà án Mỹ. Tội danh là không ngăn chặn và không báo cáo tiền bất hợp pháp — không phải lấy cắp tiền của khách.",
    beats: [
      {
        title: "21/11/2023: nhận tội ở Seattle.",
        body: ["Binance thừa nhận không duy trì chương trình chống rửa tiền hiệu quả, vận hành dịch vụ chuyển tiền không phép và vi phạm lệnh trừng phạt của Mỹ. Sàn đồng ý nộp 4,3 tỷ USD — 1,8 tỷ phạt hình sự cộng 2,5 tỷ bị tịch thu — và chấp nhận một giám sát viên độc lập."],
        notes: ["Bộ Tư pháp Mỹ; phân tích của Shearman & Sterling."],
      },
      {
        title: "Giới chức nói nó đã để lọt những gì.",
        body: [
          "Giới chức Mỹ cho biết những thiếu sót đó để tiền liên quan đến lạm dụng trẻ em, buôn ma tuý và khủng bố đi qua sàn, và Binance đã phục vụ người dùng ở các nơi bị trừng phạt như Iran.",
          "Binance nói thoả thuận giúp sàn \"lật sang trang mới\" và đầu tư mạnh vào tuân thủ.",
        ],
        notes: ["AP; tuyên bố của Bộ Tài chính và Bộ Tư pháp, 11/2023."],
      },
      {
        title: "CZ: từ chức, 50 triệu USD, bốn tháng.",
        body: ["CZ tự nhận tội vi phạm Đạo luật Bảo mật Ngân hàng, nộp phạt 50 triệu USD và rời ghế CEO. Richard Teng lên thay. Tháng 4/2024 toà tuyên CZ bốn tháng tù; ông ra tù tháng 9/2024."],
      },
    ],
  },
  {
    label: "Chính trị và lệnh ân xá",
    title: "Chính trị và lệnh ân xá",
    question: "Vì sao giới phê bình gắn sự trở lại của Binance với chính trường Mỹ?",
    figure: "Ba sự kiện có ngày tháng xếp hàng — khoản đầu tư 2 tỷ USD thanh toán bằng stablecoin gắn với gia đình Trump, SEC rút vụ kiện, lệnh ân xá của tổng thống — với cách nhìn của phía ủng hộ và phía phê bình hai bên.",
    takeaway: "Dữ kiện: stablecoin gắn với gia đình Trump được dùng cho thương vụ 2 tỷ USD với Binance, SEC rút vụ kiện, và CZ được ân xá. Phía ủng hộ gọi đó là kết thúc một cuộc trấn áp bất công; phía phê bình gọi là xung đột lợi ích. Cả hai cách nhìn đều ở dưới.",
    beats: [
      {
        title: "2025: ba chuyện xảy ra trong bảy tháng.",
        body: ["Tháng 3–5: quỹ MGX của Abu Dhabi đầu tư 2 tỷ USD vào Binance, thanh toán bằng USD1 — stablecoin của World Liberty Financial thuộc gia đình Trump. 29/5: SEC rút vụ kiện dân sự năm 2023 với Binance và CZ, không được khởi kiện lại. 23/10: Tổng thống Trump ân xá cho CZ."],
        notes: ["The Block; Reuters; thông cáo tố tụng của SEC, 29/5/2025."],
      },
      {
        title: "Lý lẽ ủng hộ lệnh ân xá.",
        body: ["Nhà Trắng nói CZ bị truy tố trong \"cuộc chiến với crypto\" của chính quyền trước, không có cáo buộc gian lận hay nạn nhân cụ thể. Phía ủng hộ cho rằng án tù là bất thường với vụ vi phạm Đạo luật Bảo mật Ngân hàng lần đầu. Tổng thống Trump nói ông không quen CZ."],
      },
      {
        title: "Lý lẽ phản đối.",
        body: ["Phía phê bình, gồm Thượng nghị sĩ Elizabeth Warren, nói CZ đã nhận tội, rồi giúp một dự án crypto của Tổng thống và vận động để được ân xá. Đến tháng 2/2026, theo báo chí, Binance lưu ký khoảng 89% toàn bộ USD1 — làm sâu thêm lo ngại về quan hệ giữa sàn và việc kinh doanh của gia đình Tổng thống."],
        notes: ["Reuters; DL News (2/2026)."],
      },
    ],
  },
  {
    label: "Các cáo buộc đang mở",
    title: "Các cáo buộc đang mở",
    question: "Hiện nay Binance bị cáo buộc điều gì — và họ nói gì?",
    figure: "Hai vụ việc đặt cạnh nhau. Cú sập 10/10: giá trên Binance vỡ trong chốc lát, rồi 283 triệu USD được hoàn trả. Tin về dòng tiền liên quan Iran năm 2026: một bài báo, thư của Thượng viện, một cuộc điều tra của Bộ Tư pháp theo báo chí — và lời phủ nhận cùng vụ kiện của Binance.",
    takeaway: "Đây là cáo buộc, chưa phải kết luận. Binance phủ nhận các tin về dòng tiền Iran và đang kiện Wall Street Journal; tờ báo giữ nguyên bài viết. Hãy theo dõi các cuộc điều tra và vụ kiện kết thúc ra sao.",
    beats: [
      {
        title: "10/10/2025: ngày thanh lý lớn nhất lịch sử.",
        body: ["Hơn 19 tỷ USD vị thế đòn bẩy bị xoá sổ trên toàn thị trường. Trên Binance, token đô la USDe có lúc chỉ còn khoảng 0,65 USD và các tài sản thế chấp khác mất neo, khiến người dùng bị thanh lý. Binance đổ lỗi cho trục trặc kỹ thuật và điều kiện thị trường, nói việc mất neo xảy ra sau khi thị trường chạm đáy, và hoàn trả khoảng 283 triệu USD."],
        notes: ["CoinGecko; The Block; tuyên bố của Binance, 10/2025."],
      },
      {
        title: "Tháng 2/2026: tin về dòng tiền liên quan Iran.",
        body: ["Wall Street Journal đưa tin các điều tra viên nội bộ của Binance đã lần ra khoảng 1,7 tỷ USD tới các thực thể liên quan Iran và sau đó bị cho nghỉ. Thượng nghị sĩ Richard Blumenthal mở cuộc điều tra sơ bộ; 11 thượng nghị sĩ đề nghị Bộ Tài chính và Bộ Tư pháp vào cuộc; sau đó tờ báo đưa tin Bộ Tư pháp đang điều tra."],
        notes: ["Decrypt; Cointelegraph; thư của Thượng viện, 24/2/2026."],
      },
      {
        title: "Binance đáp: \"phỉ báng\".",
        body: ["Binance trả lời Thượng viện rằng rà soát không thấy tài khoản nào giao dịch trực tiếp với thực thể Iran, khẳng định không sa thải nhân viên vì nêu lo ngại, và ngày 11/3/2026 kiện công ty chủ quản của tờ báo tội phỉ báng. Wall Street Journal giữ nguyên bài viết và đã đề nghị toà bác đơn. Chưa có toà nào phán quyết về sự thật."],
        notes: ["The Block; Courthouse News qua Talking Biz News (8/2026)."],
      },
    ],
  },
  {
    label: "Vụ hack 6,3 tỷ USD",
    title: "Vụ hack 6,3 tỷ USD",
    question: "Chuyện gì đã xảy ra ngày 29/10/2026?",
    figure: "Các ví nóng trên khoảng mười blockchain cạn sạch trong vài giờ; một phần bị các đối tác đóng băng giữ lại; một chồng tiền bù đắp lại số dư của khách.",
    takeaway: "Vụ trộm crypto lớn nhất từng ghi nhận đánh vào ví nóng của Binance, không phải số dư của khách: Binance bù toàn bộ bằng tiền công ty. Nó cho thấy cả quy mô của Binance lẫn rủi ro khi để coin trên bất kỳ sàn nào.",
    beats: [
      {
        title: "Khoảng 6,3 tỷ USD, trong một buổi tối.",
        body: ["Từ 20:05 UTC ngày 29/10, các ví 'nóng' trực tuyến của Binance trên khoảng mười blockchain bị rút sạch — gấp hơn bốn lần vụ Bybit năm 2025, kỷ lục trước đó. Các nhà phân tích blockchain cho rằng thủ phạm là hacker Triều Tiên; thời điểm đó Binance và các chính phủ chưa xác nhận."],
        notes: ["TRM Labs; Chainalysis qua Al Jazeera; cập nhật sự cố của Binance."],
      },
      {
        title: "Đóng băng, tạm dừng, hoàn trả.",
        body: ["Các bên phát hành stablecoin và đối tác đóng băng khoảng 3 tỷ USD — riêng Tether hơn 1,5 tỷ USDT. Binance tạm dừng rút tiền và mở lại từng loại coin từ ngày 1/11. Sàn nói vụ tấn công \"lẽ ra không được xảy ra\" và sẽ chịu toàn bộ chi phí; đến 13/11, sàn cho biết đã bù hơn 6,34 tỷ USD bằng tiền công ty."],
      },
      {
        title: "Điều đó có nghĩa gì.",
        body: ["Khách hàng được bù đủ — điều chỉ một công ty rất lớn mới làm được. Nhưng việc rút tiền bị đóng băng nhiều ngày, và BNB giảm khoảng 23% trong hai tuần sau đó. Giới phê bình hỏi vì sao nhiều tiền đến vậy nằm trong ví trực tuyến; Binance hứa sẽ có đánh giá bảo mật độc lập."],
        notes: ["Memeburn; CryptoTicker, 11/2026."],
      },
    ],
  },
  {
    label: "Những người đứng đầu",
    title: "Những người đứng đầu",
    question: "Ai đang điều hành Binance — và ai vẫn định hình nó?",
    figure: "Ba thẻ hồ sơ: nhà sáng lập, đồng sáng lập kiêm đồng CEO, và đồng CEO từng là nhà quản lý — mỗi thẻ có vai trò, mốc thời gian và lời phê bình chính.",
    takeaway: "Binance do một cựu nhà quản lý và một đồng sáng lập điều hành, còn nhà sáng lập đã được ân xá vẫn là tiếng nói có ảnh hưởng nhất. Giới phê bình cho rằng nhóm thân cận nhà sáng lập vẫn nắm quyền thật; Binance nói mô hình hai CEO kết hợp tuân thủ và đổi mới.",
    beats: [
      {
        title: "CZ — nhà sáng lập.",
        body: ["Nhận tội năm 2023, ngồi tù bốn tháng, được ân xá năm 2025. Ông nói không còn điều hành sàn, nhưng vẫn là gương mặt nổi tiếng nhất của Binance và lên tiếng liên tục trên X. Sau lệnh ân xá, The Block nhận định điều này có thể mở đường cho ông quay lại."],
      },
      {
        title: "Yi He — đồng sáng lập, đồng CEO từ tháng 12/2025.",
        body: ["Phụ trách marketing và chăm sóc khách hàng từ ngày đầu. Được bổ nhiệm đồng CEO ngày 3/12/2025 cùng Richard Teng. Bà là bạn đời của CZ; CZ viết rằng bà \"lẽ ra phải là CEO Binance từ ngày đầu\". Giới phê bình xem việc bổ nhiệm là sự tiếp nối quyền kiểm soát của nhà sáng lập."],
        notes: ["The Block; Banking Dive, 12/2025."],
      },
      {
        title: "Richard Teng — cựu nhà quản lý.",
        body: ["Từng là quan chức quản lý tài chính ở Singapore và Abu Dhabi, CEO từ tháng 11/2023, nay là đồng CEO. Ông là gương mặt của nỗ lực tuân thủ — và là người trả lời các bức thư của Thượng viện năm 2026, dẫn dắt việc ứng phó vụ hack."],
      },
    ],
  },
  {
    label: "Để trên sàn hay trong ví?",
    title: "Để trên sàn hay trong ví?",
    question: "Minh nên giữ 100 USD bitcoin của mình ở đâu?",
    figure: "Hai kệ: coin để trong tài khoản sàn và coin để trong ví bạn tự kiểm soát, so sánh từng dòng.",
    takeaway: "Sàn tiện lợi và có thể bù cho bạn sau vụ hack — nếu sàn muốn và có khả năng. Ví riêng bỏ đi sự phụ thuộc đó nhưng đặt toàn bộ trách nhiệm lên vai bạn.",
    beats: [
      {
        title: "Hai cách giữ cùng một đồng coin.",
        body: ["Để trên sàn, hoặc rút về ví chỉ bạn kiểm soát. Bảng dưới đây so sánh hai cách."],
      },
      {
        title: "Một quy tắc đơn giản nhiều người dùng.",
        body: ["Chỉ để trên sàn phần bạn đang giao dịch; chuyển khoản tiết kiệm dài hạn về ví bạn kiểm soát và chép cụm từ khôi phục ra giấy. Dù cách nào, đừng bao giờ đưa cụm từ đó cho ai."],
      },
    ],
  },
  {
    label: "Nhìn thẳng thực tế",
    title: "Nhìn thẳng thực tế",
    question: "Điểm mạnh, rủi ro — và điều đó có ý nghĩa gì với BNB.",
    figure: "Một thanh cân: điểm mạnh một bên, rủi ro một bên, với giá BNB 12 tháng qua bên dưới.",
    takeaway: "Binance là sàn lớn nhất, thanh khoản nhất, và đã hoàn trả người dùng sau mọi sự cố lớn. Nó cũng là công ty từng bị kết tội, có nhà sáng lập được ân xá, các cáo buộc đang mở và vụ hack kỷ lục. BNB gánh tất cả những điều đó.",
    beats: [
      {
        title: "Điểm mạnh.",
        body: ["Nhiều người dùng và khối lượng giao dịch nhất ngành. Đã hoàn trả người dùng sau vụ hack 2019, cú sập 10/10 và vụ trộm 2026. Bằng chứng dự trữ được công khai. Nguồn cung BNB tiếp tục giảm nhờ đốt."],
      },
      {
        title: "Rủi ro.",
        body: ["Bản án hình sự năm 2023 và việc giám sát vẫn tiếp diễn; cáo buộc mới mà sàn phủ nhận; quan hệ gần gũi với lợi ích chính trị tại Mỹ bị giới phê bình đặt câu hỏi; vụ hack lớn nhất lịch sử; và một đồng coin cùng một blockchain phụ thuộc nặng vào một công ty."],
      },
      {
        title: "Cả hai điều cùng đúng.",
        body: ["BNB lập đỉnh gần 1.375 USD vào tháng 10/2025 và quanh 600 USD giữa tháng 11/2026 — giảm hơn một nửa. Nếu giữ BNB, bạn đang đặt cược vào chính Binance: việc kinh doanh, các cuộc chiến pháp lý và khả năng bảo mật của nó."],
        notes: ["AMBCrypto (đỉnh kỷ lục); ad-hoc-news, 14/11/2026."],
      },
    ],
  },
  {
    label: "Quay lại với Minh",
    title: "Quay lại với Minh",
    question: "Vậy Minh nên làm gì với 100 USD của mình?",
    figure: "Một đồng coin vàng khắc chữ BNB ghép lại từ các mảnh. Kéo để xoay.",
    takeaway: "Sàn giao dịch làm crypto trở nên dễ dàng, và Binance làm điều đó dễ nhất. Hiểu ai đang giữ coin — và hồ sơ của những người điều hành sàn — mới là điều quan trọng.",
    beats: [
      {
        title: "Minh mua bitcoin trong vài giây.",
        body: ["Lệnh khớp, phí vài xu, app hiện số dư. Giờ cậu biết số dư đó là lời hứa của Binance, được bảo đảm bằng dự trữ, bảo mật và hồ sơ của Binance."],
      },
      {
        title: "Cậu quyết định.",
        body: ["Để một ít trên sàn để giao dịch, rút phần còn lại về ví riêng, chép cụm từ khôi phục ra giấy — và theo dõi tin tức trong câu chuyện này."],
      },
      {
        title: "Một đồng coin, cả câu chuyện.",
        body: ["Kéo đồng coin để xoay. Hoặc dùng mục lục phía trên để quay lại bất kỳ phần nào của câu chuyện."],
      },
    ],
  },
];
