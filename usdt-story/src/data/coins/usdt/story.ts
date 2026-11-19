/** Story copy for the USDT explainer, English and Vietnamese.
 * Plain language first: how the vault works, twelve years of history, USDT today, strengths, weaknesses and a conclusion.
 * Regulators' findings are reported as findings, with Tether's responses. */
export type Beat = { title: string; body: string[]; notes?: string[]; deep?: string[]; insight?: string };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "Why USDT?",
    title: "A dollar without a bank",
    question: "How can a coin always be worth exactly one dollar?",
    figure: "A round vault door with the Tether mark in the middle; 1 USD goes in, 1 USDT comes out; a question mark hangs over the vault.",
    takeaway: "USDT is a digital dollar issued by a private company, Tether. It is worth $1 as long as people trust that Tether really holds a dollar for every token.",
    beats: [
      {
        title: "No finance knowledge needed. We start with Lan's savings.",
        body: ["Lan is a freelance designer in Da Nang, paid by a client abroad. She wants to keep part of her money in US dollars — but a dollar account is slow and complicated to open. A friend says: \"Just hold USDT.\" Scroll down."],
      },
      {
        title: "USDT is a receipt for a dollar in a vault.",
        body: [
          "A company called Tether holds dollars (and things almost as good as dollars). For every dollar it holds, it creates one USDT — a token that lives on a blockchain and can be sent anywhere in minutes.",
          "That is why its price stays at about $1: in principle, one USDT can always be handed back for one dollar.",
        ], insight: "About 184 billion USDT exist — a sum equal to more than a third of Vietnam's whole economy in 2025 (GDP ≈ $514 billion).",
      },
      {
        title: "So the whole story comes down to one question: is the money really in the vault?",
        body: [
          "First we open the vault and see how it works. Then twelve years of history — including the years when nobody could check — and finally USDT in Vietnam, its strengths, its weaknesses and a conclusion.",
        ],
      },
    ],
  },
  {
    label: "1 · Print and burn",
    title: "1 · Dollars in, tokens out",
    question: "Where do new USDT come from — and where do they go?",
    figure: "Two receipts: a customer deposits 1,000,000 USD and Tether prints 1,000,000 USDT; another returns 1,000,000 USDT, Tether burns them and pays the dollars back. A rubber band keeps the price at $1; a counter shows about 183.5 billion USDT.",
    takeaway: "New USDT are printed when dollars come in and burned when dollars go out. Traders keep the price near $1 by buying cheap tokens and cashing them in, or printing new ones and selling them.",
    beats: [
      {
        title: "Deposit a dollar, a token is printed.",
        body: [
          "A big customer — say a trading company — sends Tether 1 million dollars by bank transfer. Tether creates (\"prints\") 1 million new USDT and sends them to the customer's wallet.",
          "Nothing magical: the dollars go into Tether's reserve, the tokens go out into the world.",
        ],
      },
      {
        title: "Hand the token back, it is burned.",
        body: [
          "When a customer returns 1 million USDT and asks for dollars, Tether pays the dollars and destroys (\"burns\") the tokens. Only verified customers, mostly companies, can do this directly with Tether.",
          "So the number of USDT should always match the dollars Tether owes.",
        ], insight: "Tether earns almost nothing from people sending USDT to each other. Its money comes from the dollars you hand it — which is the subject of chapter 3.",
      },
      {
        title: "Lan never meets Tether. So why is her USDT still worth $1?",
        body: [
          "Ordinary people buy USDT from other people or on an exchange. Big traders keep that price near $1: if USDT drops to $0.99, they buy the cheap tokens and hand them to Tether for a full dollar; if it rises to $1.01, they get new tokens for $1 and sell them.",
          "That simple trade works like a rubber band, pulling the price back to one dollar.",
        ],
      },
      {
        title: "About 183.5 billion USDT exist today.",
        body: [
          "At the end of September 2026, Tether reported about 183.5 billion USDT in issue — the third-largest crypto asset after Bitcoin and Ethereum.",
          "Each one is a promise of one dollar. Next: what exactly backs those promises?",
        ],
      },
    ],
  },
  {
    label: "2 · Inside the vault",
    title: "2 · Open the vault: a company that lends more to America than Germany does",
    question: "What backs 183.5 billion promises?",
    figure: "A grid of 100 squares, each about $1.9 billion: 69 green (US Treasury bills and overnight loans backed by them), 10 gold, 4 orange (bitcoin), 17 grey (other). A bracket marks the 96 squares owed to holders; the last 4 are the cushion.",
    takeaway: "About seven tenths of the vault is short-term US government debt. The rest includes gold, bitcoin and loans — assets whose value can move — above a thin cushion of about 4%.",
    beats: [
      {
        title: "191.5 billion dollars of assets.",
        body: [
          "Every three months Tether publishes a reserve report checked by an accounting firm (BDO). On 30 September 2026 it listed $191.5 billion of assets against $183.5 billion owed to USDT holders.",
          "Let's turn that into 100 squares, each worth about $1.9 billion.",
        ],
      },
      {
        title: "69 squares: lending to the US government.",
        body: [
          "Most of the vault is US Treasury bills — short IOUs from the US government, repaid within about three months — plus overnight loans backed by them. Together, about $132 billion.",
          "These are among the safest and easiest assets to sell in finance, and they make Tether one of the biggest holders of US government debt.",
        ], insight: "If Tether were a country, it would be about the 17th-largest holder of US government debt — ahead of Germany, South Korea and Saudi Arabia.",
      },
      {
        title: "10 squares of gold, 4 of bitcoin.",
        body: [
          "Tether also keeps about $19.1 billion of physical gold and $8.4 billion of bitcoin. Their prices move — a lot, in bitcoin's case.",
          "When they rise, the vault grows. When they fall, the cushion shrinks.",
        ], insight: "Tether holds roughly 140 tonnes of gold in a Swiss vault — more than the national reserves of Australia, Qatar, South Korea or Greece. In 2025 only Poland's central bank bought more gold.",
      },
      {
        title: "17 squares: \"other\".",
        body: [
          "The rest — about $31.6 billion — is a mix of cash-like funds, secured loans and other investments. Tether publishes less detail about these, and that is exactly what critics worry about.",
        ],
      },
      {
        title: "96 squares are owed; 4 are the cushion. Now shake the vault.",
        body: [
          "About $183.5 billion belongs, in effect, to USDT holders. The difference — about $7.95 billion — is Tether's cushion (\"excess reserves\"). It nearly doubled in the third quarter of 2026, mostly because bitcoin and gold rose.",
          "A cushion of about 4% is thin: one analyst calculated that a fall of about 15% in Tether's non-cash assets would wipe it out.",
        ], insight: "Stress test: if gold, bitcoin and loans lost about 15%, the four cushion squares would be gone — and USDT would no longer be fully backed on paper.",
        notes: ["Tether reserve report, 30 Sep 2026 (BDO). A report like this checks one day's figures; it is not a full audit."],
      },
    ],
  },
  {
    label: "3 · Who keeps the interest?",
    title: "3 · The most profitable vault in the world",
    question: "If Lan's USDT earns nothing, who earns the interest?",
    figure: "Lan's 1,000 USDT earn 0%; the dollars behind them, invested in Treasury bills, earn interest for Tether. Bars show Tether's reported profit: $6.2 billion (2023), $13 billion (2024), $10.1 billion (2025), $4.5 billion (January–September 2026).",
    takeaway: "USDT holders get no interest; Tether keeps it. That makes Tether extremely profitable — and part of the money goes into riskier investments.",
    beats: [
      {
        title: "Lan earns 0%. Tether earns the interest.",
        body: [
          "Holding USDT pays no interest. But the dollars behind it sit in Treasury bills that do pay interest — several percent a year while US rates are high.",
          "So the bigger USDT grows, the more Tether earns, without paying holders anything.",
        ],
      },
      {
        title: "Billions a year.",
        body: [
          "Tether reported a profit of $6.2 billion in 2023, more than $13 billion in 2024 and $10.1 billion in 2025 — numbers close to the biggest Wall Street banks.",
          "From January to September 2026 it reported $4.5 billion.",
        ],
      },
      {
        title: "One employee, the profit of hundreds of bankers.",
        body: [
          "In 2024 Tether made about $13 billion with roughly 150 employees. Tether keeps profits as its own capital and invests much of it — in bitcoin, gold and companies in mining, AI and media; that portfolio passed $20 billion by the end of 2025.",
        ],
        insight: "≈ $85 million of profit per employee in 2024 — about 300 times Goldman Sachs. One Tether employee earns what a whole floor of bankers earns.",
      },
      {
        title: "Tether is a bet on US interest rates.",
        body: [
          "Tether's business fits in one line: borrow at 0% from USDT holders, lend to the US government at market rates. When rates fall, profit falls: 2025 profit was about 23% lower than 2024.",
          "It works as long as holders keep their trust. If too many want dollars back at once, Tether must sell quickly — easy for Treasury bills, harder for loans or gold.",
        ],
        insight: "Simple maths: on about $132 billion of Treasury bills, every 1 percentage point cut in US rates takes roughly $1.3 billion a year out of Tether's income.",
      },
    ],
  },
  {
    label: "4 · Born for traders (2014)",
    title: "4 · 2014: a dollar for crypto traders",
    question: "Why would anyone need a dollar on a blockchain?",
    figure: "Realcoin becomes Tether in November 2014; between two exchanges, a bank transfer takes days while USDT moves in minutes; Bitfinex stands next to Tether as its sister company; the supply line stays near zero until 2017, then rises.",
    takeaway: "USDT was built for crypto traders who needed a fast dollar. From day one it was tied to the exchange Bitfinex — a link that later raised serious questions.",
    beats: [
      {
        title: "Realcoin, July 2014.",
        body: [
          "Three entrepreneurs — Brock Pierce, Reeve Collins and Craig Sellars — announced \"Realcoin\", a dollar-backed token running on top of the Bitcoin network. The first tokens were created on 6 October 2014; on 20 November it was renamed Tether.",
        ],
      },
      {
        title: "The problem: banks are slow, crypto never sleeps.",
        body: [
          "Crypto exchanges trade 24 hours a day, but moving dollars between them meant bank transfers that took days — and many banks refused to work with crypto companies at all.",
          "With USDT, a trader could hold \"dollars\" on an exchange and move them to another one in minutes.",
        ],
      },
      {
        title: "The sister company: Bitfinex.",
        body: [
          "From the start Tether was tied to Bitfinex, a large crypto exchange, with the same owners and managers behind both. That link would cause most of the trouble later.",
          "Paolo Ardoino, Bitfinex's technology chief, became Tether's CEO at the end of 2023. Giancarlo Devasini, Bitfinex's finance chief, controls the company.",
        ], insight: "The world's biggest digital dollar was not created by a bank, but by the people running a crypto exchange — and it is still controlled by them.",
      },
      {
        title: "Small for years, then everywhere.",
        body: [
          "At the start of 2017 there were only about 10 million USDT. Then traders discovered it: by mid-2021 there were over 60 billion, and USDT had become the main \"dollar\" of the crypto world.",
        ],
      },
    ],
  },
  {
    label: "5 · The years of doubt (2017–2021)",
    title: "5 · Is the money really there?",
    question: "What did regulators find when they finally looked?",
    figure: "A vault with a \"100% backed\" sign; investigators find $850 million missing at Bitfinex's payment processor, covered with Tether's money; a calendar of 26 months where only 27.6% of days were fully backed; fines of $18.5 million and $41 million; in 2026, a KPMG audit stamp.",
    takeaway: "Regulators found that in its early years USDT was not always fully backed as claimed. Tether paid fines without admitting wrongdoing, slowly became more open, and completed its first full audit only in 2026.",
    beats: [
      {
        title: "\"Fully backed\", said the website.",
        body: [
          "For years Tether said every USDT was backed by one dollar in its bank accounts, and promised a proper audit. In 2017 it hired an accounting firm, but the relationship ended before any audit was finished.",
        ],
      },
      {
        title: "2019: $850 million goes missing.",
        body: [
          "New York's Attorney General said Bitfinex had lost about $850 million handed to a payment company, Crypto Capital, and had covered the hole with money from Tether's reserve.",
          "Bitfinex said the money had been seized by authorities in several countries rather than lost, and that it was trying to recover it.",
        ],
      },
      {
        title: "2021: two settlements.",
        body: [
          "In February 2021 Tether and Bitfinex paid $18.5 million to settle with New York, without admitting wrongdoing, and agreed to publish reserve reports and stop serving New Yorkers.",
          "In October 2021 the US derivatives regulator (CFTC) fined Tether $41 million. It found that over 26 months in 2016–2018, Tether held enough dollars to back every USDT on only 27.6% of the days.",
        ], insight: "27.6% of 26 months means: in more than two years, the vault was full for only about seven months in total.",
      },
      {
        title: "Tether's answer.",
        body: [
          "Tether did not admit wrongdoing and says it has always paid customers who asked for their dollars. Since 2021 it publishes quarterly reserve reports checked by an accounting firm — reports that look at a single day, not a whole year.",
        ],
      },
      {
        title: "2026: the first full audit.",
        body: [
          "In August 2026 Tether announced that KPMG had completed a full audit of its 2025 accounts with a \"clean\" opinion — the first in the company's history, about nine years after an audit was first promised.",
          "It does not change what happened in 2016–2018, but it answers the oldest criticism for the most recent year.",
        ], insight: "First promised: 2017. Delivered: 2026. Nine years in which the world's biggest stablecoin had no full audit.",
      },
    ],
  },
  {
    label: "6 · The anchor slips (May 2022)",
    title: "6 · May 2022: $7 billion out in 48 hours",
    question: "What happens when everyone wants their dollar back at once?",
    figure: "TerraUSD, a digital dollar without a real vault, sinks to cents; USDT dips to $0.95 for a few hours; Tether pays out billions and the supply shrinks from about 84 to about 73 billion; the price returns to $1.",
    takeaway: "When panic hit in May 2022, USDT briefly fell to $0.95, but Tether paid out billions at $1 and the price recovered. Having real assets in the vault made the difference with TerraUSD.",
    beats: [
      {
        title: "Another \"dollar\" collapses.",
        body: [
          "TerraUSD (UST) was a digital dollar without a vault of real dollars: its price relied on a formula and on its sister coin, LUNA. In May 2022 the formula broke and UST fell to about 30 cents within days.",
          "Panic spread to every stablecoin.",
        ],
      },
      {
        title: "12 May: USDT dips to 95 cents.",
        body: [
          "For a few hours USDT traded as low as $0.95. People rushed to swap it for other coins, or to ask Tether for their dollars.",
        ],
      },
      {
        title: "Tether pays — billions.",
        body: [
          "Tether kept paying $1 for every token. It said it redeemed about $7 billion in 48 hours, and over the following weeks the USDT in circulation fell from about $84 billion to about $73 billion.",
          "Every token handed back was burned.",
        ],
      },
      {
        title: "The anchor holds. A bank did not.",
        body: [
          "Within days USDT was back near $1. Compare that with Silicon Valley Bank in March 2023: customers tried to pull $42 billion — a quarter of its deposits — in one day, and the bank collapsed the next morning.",
          "SVB had locked its money in long-term bonds it could only sell at a loss. Tether's vault held far more short-term assets that could be turned into cash quickly.",
        ],
        insight: "USDT survived a run of about 9% of its supply in two days; SVB died from a run of 25% in one. What matters is not how big the vault is, but how fast it can turn into cash.",
      },
    ],
  },
  {
    label: "7 · Bigger than ever (2023–2026)",
    title: "7 · From 73 to 184 billion",
    question: "Who uses USDT, and where does it travel?",
    figure: "USDT supply since 2015: a slow start, the 2021 boom, the 2022 dip, then a climb to about 184 billion; a split bar shows most USDT on Tron and Ethereum; 530 million users; a padlock for frozen wallets.",
    takeaway: "USDT has become the world's most used digital dollar, travelling mostly on Tron and Ethereum. Unlike cash, it can be frozen by the company that issues it.",
    beats: [
      {
        title: "Ten years of growth in one line.",
        body: ["The line shows how many USDT existed. Almost nothing until 2017, a boom in 2021, the 2022 dip — then steady growth."],
        notes: ["Supply: Coin Metrics (all chains it tracks) to Dec 2025; dashed: Tether's quarterly reports and DefiLlama."],
      },
      {
        title: "2023–2025: a record every year.",
        body: [
          "USDT grew by about $50 billion in 2025 alone, to $186.5 billion at the end of the year. Tether says about 530 million people use it — especially in countries where banks are slow or the local money loses value.",
        ],
      },
      {
        title: "Where USDT lives.",
        body: [
          "USDT exists on several blockchains. Most of it sits on Tron — cheap and fast to send — and on Ethereum. On 1 October 2026: about $92 billion on Tron, $74 billion on Ethereum, and smaller amounts on BNB Chain and Solana.",
        ], insight: "Tron holds about half of all USDT, yet it carried roughly 73% of all stablecoin transfers in Q3 2026: it is where digital dollars actually move, especially in emerging markets.",
      },
      {
        title: "A dollar that can be frozen.",
        body: [
          "Unlike cash, Tether can freeze USDT in any wallet. It does so at the request of police and regulators: it says it has frozen more than $4.4 billion linked to scams, hacks and sanctions, working with over 340 agencies in 65 countries.",
        ], insight: "Once blacklisted, a wallet almost never comes back: of the addresses Tether blocked in 2025, only about 4 in 100 were ever released.",
      },
      {
        title: "A new home: El Salvador.",
        body: ["In January 2025 Tether moved its headquarters from the British Virgin Islands to El Salvador, after receiving a licence there."],
      },
    ],
  },
  {
    label: "8 · USDT in Vietnam",
    title: "8 · USDT in Vietnam: $220 billion a year",
    question: "Why does USDT often cost more than a dollar at the bank?",
    figure: "Lan buys USDT with dong by bank transfer from a seller on an exchange (P2P); a price board compares the bank dollar rate with the P2P USDT price; warning signs show frozen bank accounts and scams; a timeline runs from Resolution 05 to the first licences.",
    takeaway: "In Vietnam USDT is the main bridge between the dong and crypto, usually bought P2P at a small premium over the bank dollar. P2P carries real risks, and licensed local exchanges are on the way.",
    beats: [
      {
        title: "One of the busiest crypto countries.",
        body: ["In Chainalysis' 2025 ranking of how widely people use crypto, Vietnam came 4th in the world. In the 12 months to June 2025, about $220 billion of crypto flowed to Vietnamese users — and for most of them, USDT is the door in."],
        insight: "$220 billion of crypto in a year is equal to about 43% of Vietnam's GDP in 2025 ($514 billion). It is a flow, not wealth — but it shows how much money already moves outside the banks.",
      },
      {
        title: "How Lan buys: P2P.",
        body: [
          "Big international exchanges have almost no direct trading between the dong and coins. So Lan uses \"P2P\": on the exchange she picks a seller, transfers dong from her bank account, and the exchange releases the seller's USDT to her. Selling works the other way round.",
        ],
      },
      {
        title: "Why USDT often costs more than a bank dollar.",
        body: [
          "Buying dollars at a bank to invest is not simple, while demand for USDT is high — so sellers can ask a little more. In late August 2025 P2P USDT reached about 26,900 dong, while the bank rate was around 26,385 — about 2% higher.",
          "The gap moves: in September 2025, after new rules were announced, it shrank and USDT briefly traded below the official rate.",
        ], insight: "The premium works like a thermometer: when it is high, Vietnamese demand for dollars and crypto is running hot; when it turns negative, money is leaving crypto.",
      },
      {
        title: "The risks of P2P.",
        body: [
          "Some sellers have had bank accounts frozen after unknowingly receiving money from scam victims; some buyers have paid and waited for coins. Experts advise trading only inside the exchange, accepting money only from the buyer's own account, and keeping every record.",
        ],
      },
      {
        title: "New rules are coming.",
        body: [
          "Resolution 05 (9 September 2025) started a five-year pilot for licensed crypto exchanges. The Ministry of Finance began accepting applications on 20 January 2026, and several companies have passed the first round.",
          "As of mid-November 2026 no exchange had been licensed yet. Six months after the first licence, buying and selling crypto outside licensed exchanges will be penalised.",
        ],
      },
    ],
  },
  {
    label: "9 · New rules",
    title: "9 · New rules for digital dollars",
    question: "Is USDT allowed in the US and Europe?",
    figure: "Two roads: America's GENIUS Act demands licensed issuers, full reserves and audits, so Tether launches a separate coin, USAT; Europe's MiCA rules push USDT off regulated exchanges; S&P's gauge points to 5, \"weak\".",
    takeaway: "Strict new rules in the US and Europe leave USDT outside the regulated system there. Tether answered with a separate US coin, while USDT remains the dollar of the rest of the world.",
    beats: [
      {
        title: "America: the GENIUS Act.",
        body: [
          "On 18 July 2025 the US signed its first federal law for stablecoins: issuers serving Americans need a licence, full reserves of safe assets and regular reports.",
          "USDT, run from El Salvador, is not built for those rules — so in January 2026 Tether launched a separate coin for the US, USAT, issued by Anchorage Digital Bank and led by Bo Hines, a former White House crypto adviser.",
        ], insight: "A countdown has started: from 18 July 2028, three years after the law was signed, US platforms may only offer approved stablecoins. Unless Tether gets USDT approved, it has less than two years left on American exchanges.",
      },
      {
        title: "Europe: off the shelves.",
        body: [
          "The EU's MiCA rules allow only authorised stablecoins on regulated exchanges. Tether chose not to apply. Exchanges removed USDT for European users in 2024–2025, and the last transition period ended on 1 July 2026; Circle's USDC took its place.",
        ],
      },
      {
        title: "A \"weak\" grade.",
        body: [
          "In November 2025 the rating agency S&P cut its score for USDT's ability to hold $1 to 5 — \"weak\", the lowest on its scale — citing more risky assets in the vault and gaps in what Tether discloses. Tether said it strongly disagrees.",
          "The table below compares USDT with its two closest relatives.",
        ],
      },
    ],
  },
  {
    label: "Strengths",
    title: "What USDT does well",
    question: "Why do hundreds of millions of people use it?",
    figure: "Five cards: it stays at $1; it is the biggest and most used; it moves any time, anywhere; it paid out under stress; it is more open than before.",
    beats: [
      { title: "1 · It stays at one dollar.", body: ["In normal months USDT trades within a fraction of a cent of $1 — in November 2025 its average closing price was about $0.9997. Its worst slip in years was to $0.95, for a few hours in May 2022."] },
      { title: "2 · The biggest and the most used.", body: ["With about $184 billion in circulation, USDT is the third-largest crypto asset and the most traded: in November 2025 alone, $3.84 trillion of it changed hands."] },
      { title: "3 · Fast, cheap, always open.", body: ["USDT crosses borders at any hour, usually in minutes, without a bank in the middle. That is why it is the dollar of choice in countries where banks are slow or money loses value."] },
      { title: "4 · It paid when it mattered.", body: ["In May 2022 Tether paid out about $7 billion in 48 hours at $1 per token, while TerraUSD — with no real vault — collapsed."] },
      { title: "5 · More open than before.", body: ["Quarterly reserve reports since 2021, a cushion of about $8 billion, and in 2026 a first full audit by KPMG with a clean opinion."] },
    ],
  },
  {
    label: "Weaknesses",
    title: "What can go wrong",
    question: "What risks come with holding USDT?",
    figure: "Five warning cards: a record of broken promises; riskier assets and a thin cushion; one company can freeze it; holders get no interest or protection; outside the rules in the US and Europe.",
    beats: [
      { title: "1 · A record of broken promises.", body: ["US regulators found that USDT was fully backed on only 27.6% of days in 2016–2018. Tether paid $18.5 million and $41 million to settle, without admitting wrongdoing."] },
      { title: "2 · Riskier assets, thin cushion.", body: ["About 30% of the vault is gold, bitcoin, loans and other investments, above a cushion of about 4%. S&P rates USDT's ability to stay at $1 as \"weak\" — 5 out of 5."] },
      { title: "3 · One company can freeze it.", body: ["Tether can block any wallet. It has frozen more than $4.4 billion, mostly linked to crime — but in 2025 only 3.6% of blacklisted addresses were later released, and innocent users can be caught."] },
      { title: "4 · No interest, no insurance.", body: ["Holders earn nothing while Tether keeps billions in interest. And unlike a bank deposit, USDT has no deposit insurance if something goes wrong."] },
      { title: "5 · Outside the rules in the US and Europe.", body: ["USDT is not authorised under America's GENIUS Act or Europe's MiCA and has been removed from regulated European exchanges. In Vietnam, buying it P2P carries scam and frozen-account risks."] },
    ],
  },
  {
    label: "Conclusion",
    title: "Conclusion",
    question: "So, should Lan hold USDT?",
    figure: "Lan's phone shows 1,000 USDT ≈ $1,000; then the USDT coin assembles and can be turned.",
    beats: [
      {
        title: "USDT does one job well: it is a dollar that moves like crypto.",
        body: ["It has stayed close to $1 for most of twelve years, survived a run in 2022 and is used by hundreds of millions of people. Behind it sits a huge vault, mostly US government debt."],
      },
      {
        title: "But it is a promise from one private company.",
        body: ["Tether decides what goes into the vault, can freeze any wallet, keeps all the interest, and spent years with a poor record on transparency — only now improving. Outside the US and Europe, few rules protect holders."], insight: "The real question is not \"is USDT safe?\" but \"whose risk am I taking?\": a private company in El Salvador that keeps the interest, instead of a bank with deposit insurance.",
      },
      {
        title: "For Lan: a tool, not a savings account.",
        body: [
          "To send dollars or park them for a short time, USDT is practical. For large or long-term savings, spread the risk, don't keep everything on one exchange, and in Vietnam move to licensed platforms as they open. This is education, not investment advice.",
          "Drag the coin to turn it over.",
        ],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Vì sao có USDT?",
    title: "Đồng đô la không cần ngân hàng",
    question: "Làm sao một đồng coin luôn đáng đúng 1 đô la?",
    figure: "Một cánh cửa két tròn với biểu tượng Tether ở giữa; 1 USD đi vào, 1 USDT đi ra; một dấu hỏi lơ lửng trên chiếc két.",
    takeaway: "USDT là đồng đô la số do một công ty tư nhân, Tether, phát hành. Nó đáng 1 USD chừng nào mọi người còn tin rằng Tether thật sự giữ 1 đô la cho mỗi token.",
    beats: [
      {
        title: "Không cần biết gì về tài chính. Bắt đầu từ khoản tiền của Lan.",
        body: ["Lan là designer tự do ở Đà Nẵng, nhận tiền từ khách nước ngoài. Cô muốn giữ một phần bằng đô la Mỹ — nhưng mở tài khoản đô la thì chậm và rắc rối. Một người bạn bảo: \"Cứ giữ USDT đi.\" Hãy cuộn xuống."],
      },
      {
        title: "USDT là tờ biên nhận cho 1 đô la nằm trong két.",
        body: [
          "Một công ty tên Tether giữ đô la (và những thứ gần như đô la). Cứ mỗi đô la họ giữ, họ tạo ra một USDT — token nằm trên blockchain, gửi đi đâu cũng được trong vài phút.",
          "Vì vậy giá của nó đứng quanh 1 USD: về nguyên tắc, mỗi USDT luôn đổi lại được 1 đô la.",
        ], insight: "Đang có khoảng 184 tỷ USDT — bằng hơn một phần ba quy mô cả nền kinh tế Việt Nam năm 2025 (GDP ≈ 514 tỷ USD).",
      },
      {
        title: "Nên cả câu chuyện xoay quanh một câu hỏi: tiền có thật sự nằm trong két không?",
        body: [
          "Trước tiên ta mở két xem nó vận hành ra sao. Sau đó là 12 năm lịch sử — kể cả những năm không ai kiểm tra được — rồi tới USDT ở Việt Nam, điểm mạnh, điểm yếu và phần kết luận.",
        ],
      },
    ],
  },
  {
    label: "1 · In ra và đốt đi",
    title: "1 · Đô la vào, token ra",
    question: "USDT mới từ đâu ra — và biến đi đâu?",
    figure: "Hai tờ biên nhận: một khách gửi 1.000.000 USD và Tether in ra 1.000.000 USDT; một khách khác trả lại 1.000.000 USDT, Tether đốt chúng và trả đô la. Một sợi dây thun giữ giá ở 1 USD; bộ đếm cho thấy khoảng 183,5 tỷ USDT.",
    takeaway: "USDT mới được in ra khi đô la đi vào và bị đốt khi đô la đi ra. Dân giao dịch giữ giá quanh 1 USD bằng cách mua token rẻ để đổi lấy đô la, hoặc lấy token mới rồi bán ra.",
    beats: [
      {
        title: "Gửi 1 đô la, một token được in ra.",
        body: [
          "Một khách hàng lớn — ví dụ một công ty giao dịch — chuyển khoản cho Tether 1 triệu đô la. Tether tạo (\"in\") 1 triệu USDT mới và gửi vào ví của khách.",
          "Không có phép màu nào: đô la vào két dự trữ của Tether, token đi ra thế giới.",
        ],
      },
      {
        title: "Trả token lại, token bị đốt.",
        body: [
          "Khi khách trả lại 1 triệu USDT để lấy đô la, Tether trả đô la và huỷ (\"đốt\") số token đó. Chỉ khách hàng đã xác minh, phần lớn là doanh nghiệp, mới làm việc trực tiếp với Tether được.",
          "Nhờ vậy số USDT luôn phải khớp với số đô la Tether đang nợ.",
        ], insight: "Tether gần như không kiếm tiền từ việc người dùng chuyển USDT cho nhau. Tiền của họ đến từ chính số đô la bạn gửi vào — chuyện của chương 3.",
      },
      {
        title: "Lan chẳng bao giờ gặp Tether. Vậy sao USDT của cô vẫn đáng 1 USD?",
        body: [
          "Người bình thường mua USDT từ người khác hoặc trên sàn. Các tay giao dịch lớn giữ giá ở đó quanh 1 USD: nếu USDT rơi xuống 0,99, họ mua token rẻ rồi đem đổi với Tether lấy đủ 1 đô la; nếu lên 1,01, họ lấy token mới với giá 1 USD rồi bán ra.",
          "Phép mua bán đơn giản ấy giống một sợi dây thun, luôn kéo giá về đúng 1 đô la.",
        ],
      },
      {
        title: "Hiện có khoảng 183,5 tỷ USDT.",
        body: [
          "Cuối tháng 9/2026, Tether báo cáo khoảng 183,5 tỷ USDT đang lưu hành — tài sản mã hoá lớn thứ ba sau Bitcoin và Ethereum.",
          "Mỗi đồng là một lời hứa trả 1 đô la. Tiếp theo: thứ gì đứng sau những lời hứa ấy?",
        ],
      },
    ],
  },
  {
    label: "2 · Bên trong két",
    title: "2 · Mở két: một công ty cho Mỹ vay nhiều hơn cả nước Đức",
    question: "Thứ gì đứng sau 183,5 tỷ lời hứa?",
    figure: "Lưới 100 ô, mỗi ô khoảng 1,9 tỷ USD: 69 ô xanh (tín phiếu Kho bạc Mỹ và khoản cho vay qua đêm có tín phiếu bảo đảm), 10 ô vàng, 4 ô cam (bitcoin), 17 ô xám (khác). Một dấu ngoặc đánh dấu 96 ô phải trả người giữ; 4 ô cuối là phần đệm.",
    takeaway: "Khoảng bảy phần mười két là nợ ngắn hạn của chính phủ Mỹ. Phần còn lại gồm vàng, bitcoin và các khoản cho vay — những thứ có thể lên xuống giá — cộng một phần đệm mỏng khoảng 4%.",
    beats: [
      {
        title: "191,5 tỷ đô la tài sản.",
        body: [
          "Cứ ba tháng, Tether công bố một báo cáo dự trữ do công ty kiểm toán BDO kiểm tra. Ngày 30/9/2026, báo cáo ghi 191,5 tỷ USD tài sản, trong khi phải trả người giữ USDT 183,5 tỷ USD.",
          "Hãy chia số đó thành 100 ô vuông, mỗi ô khoảng 1,9 tỷ USD.",
        ],
      },
      {
        title: "69 ô: cho chính phủ Mỹ vay.",
        body: [
          "Phần lớn két là tín phiếu Kho bạc Mỹ — giấy nợ ngắn hạn của chính phủ Mỹ, trả lại trong khoảng ba tháng — cộng các khoản cho vay qua đêm có tín phiếu bảo đảm. Tổng cộng khoảng 132 tỷ USD.",
          "Đây là loại tài sản an toàn và dễ bán nhất trong tài chính, và khiến Tether trở thành một trong những chủ nợ lớn nhất của chính phủ Mỹ.",
        ], insight: "Nếu Tether là một quốc gia, nó sẽ là chủ nợ lớn khoảng thứ 17 của chính phủ Mỹ — xếp trên cả Đức, Hàn Quốc và Ả Rập Xê Út.",
      },
      {
        title: "10 ô vàng, 4 ô bitcoin.",
        body: [
          "Tether còn giữ khoảng 19,1 tỷ USD vàng thật và 8,4 tỷ USD bitcoin. Giá của chúng lên xuống — với bitcoin thì lên xuống rất mạnh.",
          "Khi giá tăng, két phình ra. Khi giá giảm, phần đệm mỏng đi.",
        ], insight: "Tether giữ khoảng 140 tấn vàng trong một hầm ở Thuỵ Sĩ — nhiều hơn dự trữ quốc gia của Úc, Qatar, Hàn Quốc hay Hy Lạp. Năm 2025, chỉ ngân hàng trung ương Ba Lan mua vàng nhiều hơn Tether.",
      },
      {
        title: "17 ô: \"khác\".",
        body: [
          "Phần còn lại — khoảng 31,6 tỷ USD — là hỗn hợp quỹ gần như tiền mặt, khoản cho vay có bảo đảm và các khoản đầu tư khác. Tether công bố ít chi tiết hơn về nhóm này, và đó chính là điều giới phê bình lo ngại.",
        ],
      },
      {
        title: "96 ô phải trả; 4 ô là phần đệm. Giờ thử lắc chiếc két.",
        body: [
          "Khoảng 183,5 tỷ USD thực chất thuộc về người giữ USDT. Phần chênh lệch — khoảng 7,95 tỷ USD — là phần đệm của Tether (\"dự trữ dư\"). Nó tăng gần gấp đôi trong quý 3/2026, chủ yếu nhờ bitcoin và vàng tăng giá.",
          "Phần đệm khoảng 4% là mỏng: một nhà phân tích tính rằng chỉ cần nhóm tài sản không phải tiền mặt của Tether giảm khoảng 15% là phần đệm biến mất.",
        ], insight: "Phép thử sức chịu: nếu vàng, bitcoin và các khoản cho vay mất khoảng 15% giá trị, 4 ô đệm biến mất — và trên giấy tờ, USDT không còn được bảo đảm đủ.",
        notes: ["Báo cáo dự trữ của Tether ngày 30/9/2026 (BDO). Loại báo cáo này kiểm tra số liệu của một ngày, không phải kiểm toán đầy đủ."],
      },
    ],
  },
  {
    label: "3 · Ai hưởng tiền lãi?",
    title: "3 · Chiếc két sinh lời nhất thế giới",
    question: "Nếu USDT của Lan không sinh lãi, thì ai hưởng lãi?",
    figure: "1.000 USDT của Lan lãi 0%; số đô la đứng sau, đem mua tín phiếu, sinh lãi cho Tether. Các cột cho thấy lợi nhuận Tether báo cáo: 6,2 tỷ USD (2023), 13 tỷ (2024), 10,1 tỷ (2025), 4,5 tỷ (tháng 1–9/2026).",
    takeaway: "Người giữ USDT không được lãi; Tether giữ toàn bộ. Điều đó khiến Tether lời cực lớn — và một phần tiền được đem đi đầu tư rủi ro hơn.",
    beats: [
      {
        title: "Lan được 0%. Tether hưởng tiền lãi.",
        body: [
          "Giữ USDT không có lãi. Nhưng số đô la đứng sau nằm trong tín phiếu, và tín phiếu thì có lãi — vài phần trăm mỗi năm khi lãi suất Mỹ còn cao.",
          "Nên USDT càng lớn, Tether càng kiếm nhiều, mà không phải trả gì cho người giữ.",
        ],
      },
      {
        title: "Hàng tỷ đô mỗi năm.",
        body: [
          "Tether báo lãi 6,2 tỷ USD năm 2023, hơn 13 tỷ năm 2024 và 10,1 tỷ năm 2025 — ngang ngửa những ngân hàng lớn nhất Phố Wall.",
          "Từ tháng 1 đến tháng 9/2026, họ báo lãi 4,5 tỷ USD.",
        ],
      },
      {
        title: "Một nhân viên, lợi nhuận bằng hàng trăm nhân viên ngân hàng.",
        body: [
          "Năm 2024 Tether lãi khoảng 13 tỷ USD với chừng 150 nhân viên. Lợi nhuận được giữ làm vốn và đem đầu tư — vào bitcoin, vàng và các công ty đào coin, AI, truyền thông; danh mục này vượt 20 tỷ USD vào cuối 2025.",
        ],
        insight: "≈ 85 triệu USD lợi nhuận trên mỗi nhân viên năm 2024 — gấp khoảng 300 lần Goldman Sachs. Một nhân viên Tether làm ra lợi nhuận bằng cả một tầng nhân viên ngân hàng.",
      },
      {
        title: "Tether là một ván cược vào lãi suất Mỹ.",
        body: [
          "Mô hình của Tether gói trong một câu: vay của người giữ USDT với lãi 0%, cho chính phủ Mỹ vay với lãi thị trường. Lãi suất giảm thì lợi nhuận giảm: lợi nhuận 2025 thấp hơn 2024 khoảng 23%.",
          "Nó chạy tốt chừng nào người giữ còn tin. Nếu quá nhiều người cùng đòi đô la một lúc, Tether phải bán gấp — dễ với tín phiếu, khó hơn với khoản cho vay hay vàng.",
        ],
        insight: "Phép tính đơn giản: với khoảng 132 tỷ USD tín phiếu, mỗi lần lãi suất Mỹ giảm 1 điểm phần trăm, Tether mất khoảng 1,3 tỷ USD thu nhập mỗi năm.",
      },
    ],
  },
  {
    label: "4 · Sinh ra cho dân giao dịch (2014)",
    title: "4 · 2014: đồng đô la cho dân crypto",
    question: "Ai cần một đồng đô la nằm trên blockchain?",
    figure: "Realcoin đổi tên thành Tether tháng 11/2014; giữa hai sàn, chuyển khoản ngân hàng mất vài ngày còn USDT chỉ mất vài phút; Bitfinex đứng cạnh Tether như công ty chị em; đường nguồn cung nằm sát đáy tới 2017 rồi bắt đầu đi lên.",
    takeaway: "USDT sinh ra cho dân giao dịch crypto cần một đồng đô la nhanh. Ngay từ đầu nó đã gắn chặt với sàn Bitfinex — mối liên hệ về sau gây ra nhiều câu hỏi lớn.",
    beats: [
      {
        title: "Realcoin, tháng 7/2014.",
        body: [
          "Ba doanh nhân — Brock Pierce, Reeve Collins và Craig Sellars — công bố \"Realcoin\", một token được bảo đảm bằng đô la chạy trên mạng Bitcoin. Những token đầu tiên được tạo ngày 6/10/2014; ngày 20/11 dự án đổi tên thành Tether.",
        ],
      },
      {
        title: "Vấn đề: ngân hàng thì chậm, crypto thì không bao giờ ngủ.",
        body: [
          "Sàn crypto chạy 24 giờ mỗi ngày, nhưng chuyển đô la giữa các sàn phải qua ngân hàng, mất vài ngày — và nhiều ngân hàng từ chối làm việc với công ty crypto.",
          "Có USDT, dân giao dịch giữ \"đô la\" ngay trên sàn và chuyển sang sàn khác trong vài phút.",
        ],
      },
      {
        title: "Công ty chị em: Bitfinex.",
        body: [
          "Ngay từ đầu Tether đã gắn với Bitfinex, một sàn crypto lớn, cùng một nhóm chủ và người điều hành. Mối liên hệ này về sau gây ra phần lớn rắc rối.",
          "Paolo Ardoino, giám đốc công nghệ của Bitfinex, trở thành CEO của Tether từ cuối năm 2023. Giancarlo Devasini, giám đốc tài chính của Bitfinex, là người nắm quyền kiểm soát công ty.",
        ], insight: "Đồng đô la số lớn nhất thế giới không do ngân hàng nào tạo ra, mà do những người điều hành một sàn crypto — và đến nay vẫn do họ nắm.",
      },
      {
        title: "Nhỏ bé nhiều năm, rồi ở khắp nơi.",
        body: [
          "Đầu năm 2017 mới có khoảng 10 triệu USDT. Rồi dân giao dịch phát hiện ra nó: giữa năm 2021 đã có hơn 60 tỷ, và USDT trở thành \"đồng đô la\" chính của thế giới crypto.",
        ],
      },
    ],
  },
  {
    label: "5 · Những năm bị nghi ngờ (2017–2021)",
    title: "5 · Tiền có thật sự ở đó không?",
    question: "Cơ quan quản lý tìm thấy gì khi cuối cùng họ vào kiểm tra?",
    figure: "Một chiếc két treo biển \"bảo đảm 100%\"; nhà điều tra phát hiện 850 triệu USD thất lạc ở công ty thanh toán của Bitfinex, được bù bằng tiền của Tether; một cuốn lịch 26 tháng chỉ 27,6% số ngày được bảo đảm đủ; hai khoản phạt 18,5 triệu và 41 triệu USD; năm 2026, con dấu kiểm toán của KPMG.",
    takeaway: "Cơ quan quản lý phát hiện trong những năm đầu USDT không phải lúc nào cũng được bảo đảm đủ như đã nói. Tether nộp phạt mà không nhận sai, dần minh bạch hơn, và tới năm 2026 mới có cuộc kiểm toán đầy đủ đầu tiên.",
    beats: [
      {
        title: "\"Bảo đảm đủ 100%\", trang web nói.",
        body: [
          "Nhiều năm liền Tether nói mỗi USDT được bảo đảm bằng 1 đô la trong tài khoản ngân hàng của họ, và hứa sẽ kiểm toán đàng hoàng. Năm 2017 họ thuê một công ty kiểm toán, nhưng hai bên chia tay trước khi có kết quả.",
        ],
      },
      {
        title: "2019: 850 triệu đô la biến mất.",
        body: [
          "Tổng chưởng lý bang New York cáo buộc Bitfinex đã mất khoảng 850 triệu USD gửi ở một công ty thanh toán tên Crypto Capital, rồi lấy tiền trong két dự trữ của Tether để bù vào.",
          "Bitfinex nói số tiền bị cơ quan chức năng nhiều nước tạm giữ chứ không mất, và họ đang tìm cách lấy lại.",
        ],
      },
      {
        title: "2021: hai lần dàn xếp.",
        body: [
          "Tháng 2/2021, Tether và Bitfinex trả 18,5 triệu USD để dàn xếp với New York, không thừa nhận sai phạm; họ đồng ý công bố báo cáo dự trữ và ngừng phục vụ người dân New York.",
          "Tháng 10/2021, cơ quan quản lý phái sinh Mỹ (CFTC) phạt Tether 41 triệu USD. CFTC kết luận trong 26 tháng giai đoạn 2016–2018, Tether chỉ đủ đô la bảo đảm cho mọi USDT vào 27,6% số ngày.",
        ], insight: "27,6% của 26 tháng nghĩa là: trong hơn hai năm, cộng lại chỉ khoảng 7 tháng chiếc két thật sự đủ tiền.",
      },
      {
        title: "Tether đáp lại.",
        body: [
          "Tether không thừa nhận sai phạm và nói họ luôn trả tiền cho khách nào yêu cầu. Từ 2021 họ công bố báo cáo dự trữ mỗi quý có công ty kiểm toán kiểm tra — loại báo cáo chỉ nhìn vào một ngày, không phải cả năm.",
        ],
      },
      {
        title: "2026: cuộc kiểm toán đầy đủ đầu tiên.",
        body: [
          "Tháng 8/2026, Tether thông báo KPMG đã hoàn tất kiểm toán đầy đủ sổ sách năm 2025 với ý kiến \"chấp nhận toàn phần\" — lần đầu tiên trong lịch sử công ty, khoảng chín năm sau lời hứa đầu tiên.",
          "Nó không xoá được chuyện 2016–2018, nhưng trả lời lời chỉ trích lâu đời nhất cho năm gần nhất.",
        ], insight: "Hứa: 2017. Có kết quả: 2026. Chín năm đồng stablecoin lớn nhất thế giới không có một cuộc kiểm toán đầy đủ nào.",
      },
    ],
  },
  {
    label: "6 · Neo bị kéo lệch (5/2022)",
    title: "6 · Tháng 5/2022: 7 tỷ đô bị rút trong 48 giờ",
    question: "Chuyện gì xảy ra khi ai cũng đòi lại đô la cùng một lúc?",
    figure: "TerraUSD, một đồng đô la số không có két tiền thật, chìm xuống vài xu; USDT tụt về 0,95 USD trong vài giờ; Tether trả hàng tỷ đô la và nguồn cung co lại từ khoảng 84 xuống khoảng 73 tỷ; giá quay về 1 USD.",
    takeaway: "Khi hoảng loạn ập tới tháng 5/2022, USDT có lúc tụt về 0,95 USD, nhưng Tether trả hàng tỷ đô theo giá 1 USD và giá hồi lại. Có tài sản thật trong két là khác biệt với TerraUSD.",
    beats: [
      {
        title: "Một \"đồng đô la\" khác sụp đổ.",
        body: [
          "TerraUSD (UST) là đồng đô la số không có két đô la thật: giá của nó dựa vào một công thức và đồng coin chị em LUNA. Tháng 5/2022 công thức gãy, UST rơi xuống khoảng 30 xu chỉ trong vài ngày.",
          "Hoảng loạn lan sang mọi stablecoin.",
        ],
      },
      {
        title: "12/5: USDT tụt xuống 95 xu.",
        body: ["Trong vài giờ, USDT có lúc chỉ còn 0,95 USD. Người ta đổ xô đổi nó sang coin khác, hoặc đòi Tether trả đô la."],
      },
      {
        title: "Tether trả tiền — hàng tỷ đô.",
        body: [
          "Tether vẫn trả đúng 1 USD cho mỗi token. Họ nói đã chi trả khoảng 7 tỷ USD trong 48 giờ, và trong vài tuần sau đó lượng USDT lưu hành giảm từ khoảng 84 tỷ xuống khoảng 73 tỷ.",
          "Token nào được trả lại đều bị đốt.",
        ],
      },
      {
        title: "Chiếc neo trụ vững. Một ngân hàng thì không.",
        body: [
          "Chỉ vài ngày sau USDT đã về lại quanh 1 USD. So với ngân hàng Silicon Valley Bank (SVB) tháng 3/2023: khách đòi rút 42 tỷ USD — một phần tư tiền gửi — trong một ngày, và sáng hôm sau ngân hàng sụp.",
          "SVB đã khoá tiền vào trái phiếu dài hạn, chỉ bán được khi chịu lỗ. Két của Tether giữ nhiều tài sản ngắn hạn hơn, đổi ra tiền mặt nhanh hơn.",
        ],
        insight: "USDT chịu được đợt rút khoảng 9% nguồn cung trong hai ngày; SVB chết vì đợt rút 25% trong một ngày. Điều quyết định không phải két to bao nhiêu, mà là két đổi ra tiền mặt nhanh đến đâu.",
      },
    ],
  },
  {
    label: "7 · Lớn hơn bao giờ hết (2023–2026)",
    title: "7 · Từ 73 lên 184 tỷ",
    question: "Ai dùng USDT, và nó đi trên những con đường nào?",
    figure: "Nguồn cung USDT từ 2015: khởi đầu chậm, bùng nổ 2021, hụt 2022, rồi leo lên khoảng 184 tỷ; một thanh chia cho thấy phần lớn USDT nằm trên Tron và Ethereum; 530 triệu người dùng; một ổ khoá cho ví bị đóng băng.",
    takeaway: "USDT đã thành đồng đô la số được dùng nhiều nhất thế giới, đi chủ yếu trên Tron và Ethereum. Khác tiền mặt, nó có thể bị chính công ty phát hành đóng băng.",
    beats: [
      {
        title: "Mười năm tăng trưởng trong một đường kẻ.",
        body: ["Đường kẻ cho thấy có bao nhiêu USDT tồn tại. Gần như bằng không tới 2017, bùng nổ năm 2021, hụt năm 2022 — rồi tăng đều."],
        notes: ["Nguồn cung: Coin Metrics (các chuỗi họ theo dõi) tới 12/2025; nét đứt: báo cáo quý của Tether và DefiLlama."],
      },
      {
        title: "2023–2025: năm nào cũng lập kỷ lục.",
        body: [
          "Riêng năm 2025, USDT tăng thêm khoảng 50 tỷ, lên 186,5 tỷ vào cuối năm. Tether nói khoảng 530 triệu người dùng nó — nhất là ở những nước ngân hàng chậm hoặc đồng nội tệ mất giá.",
        ],
      },
      {
        title: "USDT sống ở đâu?",
        body: [
          "USDT có mặt trên nhiều blockchain. Phần lớn nằm trên Tron — gửi rẻ và nhanh — và Ethereum. Ngày 1/10/2026: khoảng 92 tỷ trên Tron, 74 tỷ trên Ethereum, phần nhỏ hơn trên BNB Chain và Solana.",
        ], insight: "Tron giữ khoảng một nửa số USDT, nhưng chuyên chở khoảng 73% toàn bộ lượng stablecoin được chuyển đi trong quý 3/2026: đó là nơi đô la số thật sự di chuyển, nhất là ở các nước mới nổi.",
      },
      {
        title: "Đồng đô la có thể bị đóng băng.",
        body: [
          "Khác tiền mặt, Tether có thể đóng băng USDT trong bất kỳ ví nào. Họ làm vậy theo yêu cầu của công an và cơ quan quản lý: Tether nói đã đóng băng hơn 4,4 tỷ USD liên quan lừa đảo, hack và lệnh trừng phạt, phối hợp với hơn 340 cơ quan ở 65 nước.",
        ], insight: "Một khi bị đưa vào danh sách đen, ví gần như không bao giờ được trả lại: trong số địa chỉ Tether khoá năm 2025, chỉ khoảng 4 trên 100 được gỡ ra.",
      },
      {
        title: "Nhà mới: El Salvador.",
        body: ["Tháng 1/2025, Tether dời trụ sở từ Quần đảo Virgin thuộc Anh sang El Salvador sau khi được cấp phép ở đó."],
      },
    ],
  },
  {
    label: "8 · USDT ở Việt Nam",
    title: "8 · USDT ở Việt Nam: 220 tỷ đô mỗi năm",
    question: "Vì sao USDT thường đắt hơn đô la ở ngân hàng?",
    figure: "Lan mua USDT bằng tiền đồng, chuyển khoản cho người bán trên sàn (P2P); bảng giá so tỷ giá đô la ngân hàng với giá USDT P2P; biển cảnh báo tài khoản bị phong toả và lừa đảo; dòng thời gian từ Nghị quyết 05 tới những giấy phép đầu tiên.",
    takeaway: "Ở Việt Nam, USDT là cây cầu chính giữa tiền đồng và crypto, thường được mua qua P2P với giá nhỉnh hơn đô la ngân hàng. P2P có rủi ro thật, và sàn trong nước được cấp phép đang đến gần.",
    beats: [
      {
        title: "Một trong những nước dùng crypto sôi động nhất.",
        body: ["Trong bảng xếp hạng mức độ dùng crypto năm 2025 của Chainalysis, Việt Nam đứng thứ 4 thế giới. Trong 12 tháng đến 6/2025, khoảng 220 tỷ USD crypto đã chảy về ví người dùng Việt — và với đa số họ, USDT là cánh cửa bước vào."],
        insight: "220 tỷ USD crypto mỗi năm bằng khoảng 43% GDP Việt Nam năm 2025 (514 tỷ USD). Đó là dòng tiền chứ không phải tài sản — nhưng cho thấy lượng tiền đang chảy ngoài hệ thống ngân hàng lớn đến mức nào.",
      },
      {
        title: "Lan mua thế nào: P2P.",
        body: [
          "Các sàn quốc tế lớn gần như không có cặp giao dịch trực tiếp giữa tiền đồng và coin. Nên Lan dùng \"P2P\": trên sàn cô chọn một người bán, chuyển khoản tiền đồng từ tài khoản ngân hàng của mình, rồi sàn nhả USDT của người bán sang cho cô. Bán thì làm ngược lại.",
        ],
      },
      {
        title: "Vì sao USDT thường đắt hơn đô la ngân hàng?",
        body: [
          "Mua đô la ở ngân hàng để đầu tư không đơn giản, trong khi nhu cầu USDT lại cao — nên người bán có thể đòi giá nhỉnh hơn. Cuối tháng 8/2025, USDT trên P2P lên khoảng 26.900 đồng, trong khi tỷ giá ngân hàng quanh 26.385 đồng — cao hơn khoảng 2%.",
          "Mức chênh không cố định: tháng 9/2025, sau khi có quy định mới, chênh lệch thu hẹp và USDT có lúc còn thấp hơn tỷ giá chính thức.",
        ], insight: "Mức chênh giá giống một chiếc nhiệt kế: chênh cao là lúc người Việt đang \"khát\" đô la và crypto; chênh âm là lúc tiền đang rút khỏi crypto.",
      },
      {
        title: "Rủi ro của P2P.",
        body: [
          "Có người bán bị phong toả tài khoản ngân hàng vì vô tình nhận tiền của nạn nhân lừa đảo; có người mua chuyển tiền rồi chờ mãi không thấy coin. Chuyên gia khuyên chỉ giao dịch trong sàn, chỉ nhận tiền từ chính tài khoản của người mua, và lưu lại mọi chứng từ.",
        ],
      },
      {
        title: "Luật chơi mới đang tới.",
        body: [
          "Nghị quyết 05 (9/9/2025) mở chương trình thí điểm 5 năm cho sàn tài sản mã hoá được cấp phép. Bộ Tài chính nhận hồ sơ từ 20/1/2026, và một số doanh nghiệp đã qua vòng đầu.",
          "Tính tới giữa tháng 11/2026 chưa sàn nào được cấp phép. Sáu tháng sau khi có giấy phép đầu tiên, mua bán crypto ngoài sàn được cấp phép sẽ bị xử phạt.",
        ],
      },
    ],
  },
  {
    label: "9 · Luật chơi mới",
    title: "9 · Luật chơi mới cho đồng đô la số",
    question: "USDT có được phép ở Mỹ và châu Âu không?",
    figure: "Hai con đường: Đạo luật GENIUS của Mỹ đòi đơn vị phát hành có giấy phép, dự trữ đầy đủ và báo cáo, nên Tether ra một đồng riêng là USAT; quy định MiCA của châu Âu đẩy USDT khỏi các sàn được cấp phép; kim đồng hồ của S&P chỉ vào 5, \"yếu\".",
    takeaway: "Luật mới khắt khe ở Mỹ và châu Âu khiến USDT nằm ngoài hệ thống được quản lý ở đó. Tether đáp lại bằng một đồng riêng cho Mỹ, còn USDT vẫn là đồng đô la của phần còn lại của thế giới.",
    beats: [
      {
        title: "Mỹ: Đạo luật GENIUS.",
        body: [
          "Ngày 18/7/2025, Mỹ ký luật liên bang đầu tiên về stablecoin: ai phát hành cho người Mỹ phải có giấy phép, dự trữ đầy đủ bằng tài sản an toàn và báo cáo thường xuyên.",
          "USDT, điều hành từ El Salvador, không được thiết kế cho luật này — nên tháng 1/2026 Tether ra một đồng riêng cho Mỹ là USAT, do ngân hàng Anchorage Digital phát hành, đứng đầu là Bo Hines, cựu cố vấn crypto của Nhà Trắng.",
        ], insight: "Đồng hồ đã bắt đầu đếm ngược: từ 18/7/2028, đúng ba năm sau ngày ký luật, các nền tảng ở Mỹ chỉ được bán stablecoin được cấp phép. Nếu USDT không được duyệt, nó chỉ còn chưa tới hai năm trên các sàn Mỹ.",
      },
      {
        title: "Châu Âu: bị gỡ khỏi kệ.",
        body: [
          "Quy định MiCA của EU chỉ cho phép stablecoin được cấp phép trên các sàn chịu quản lý. Tether chọn không xin. Các sàn gỡ USDT với người dùng châu Âu trong 2024–2025, và giai đoạn chuyển tiếp cuối cùng kết thúc ngày 1/7/2026; USDC của đối thủ Circle thế chỗ.",
        ],
      },
      {
        title: "Điểm \"yếu\".",
        body: [
          "Tháng 11/2025, hãng xếp hạng S&P hạ điểm khả năng giữ giá 1 USD của USDT xuống 5 — \"yếu\", mức thấp nhất trên thang của họ — vì két có nhiều tài sản rủi ro hơn và Tether công bố chưa đủ. Tether nói họ phản đối mạnh mẽ.",
          "Bảng dưới đây so USDT với hai \"người họ hàng\" gần nhất.",
        ],
      },
    ],
  },
  {
    label: "Điểm mạnh",
    title: "USDT làm tốt điều gì",
    question: "Vì sao hàng trăm triệu người dùng nó?",
    figure: "Năm thẻ: giữ được 1 USD; lớn nhất và được dùng nhiều nhất; chuyển đi lúc nào, đâu cũng được; đã trả tiền khi bị thử thách; minh bạch hơn trước.",
    beats: [
      { title: "1 · Giữ được giá 1 đô la.", body: ["Những tháng bình thường, USDT chỉ lệch 1 USD chưa tới một xu — tháng 11/2025 giá đóng cửa trung bình khoảng 0,9997 USD. Lần trượt tệ nhất nhiều năm qua là xuống 0,95 USD, vài giờ trong tháng 5/2022."] },
      { title: "2 · Lớn nhất và được dùng nhiều nhất.", body: ["Với khoảng 184 tỷ USD lưu hành, USDT là tài sản mã hoá lớn thứ ba và được giao dịch nhiều nhất: riêng tháng 11/2025 đã có 3.840 tỷ USD USDT đổi chủ."] },
      { title: "3 · Nhanh, rẻ, luôn mở cửa.", body: ["USDT qua biên giới bất kể giờ nào, thường chỉ vài phút, không cần ngân hàng đứng giữa. Vì thế nó là đồng đô la được chọn ở những nước ngân hàng chậm hoặc tiền mất giá."] },
      { title: "4 · Đã trả tiền khi bị thử thách.", body: ["Tháng 5/2022, Tether chi trả khoảng 7 tỷ USD trong 48 giờ với giá 1 USD mỗi token, trong khi TerraUSD — không có két tiền thật — sụp đổ."] },
      { title: "5 · Minh bạch hơn trước.", body: ["Báo cáo dự trữ mỗi quý từ 2021, phần đệm khoảng 8 tỷ USD, và năm 2026 có cuộc kiểm toán đầy đủ đầu tiên của KPMG với ý kiến chấp nhận toàn phần."] },
    ],
  },
  {
    label: "Điểm yếu",
    title: "Điều gì có thể hỏng",
    question: "Giữ USDT đi kèm những rủi ro gì?",
    figure: "Năm thẻ cảnh báo: tiền sử hứa không giữ lời; tài sản rủi ro hơn và phần đệm mỏng; một công ty có thể đóng băng; người giữ không có lãi, không có bảo hiểm; nằm ngoài luật ở Mỹ và châu Âu.",
    beats: [
      { title: "1 · Tiền sử hứa không giữ lời.", body: ["Cơ quan quản lý Mỹ kết luận USDT chỉ được bảo đảm đủ vào 27,6% số ngày giai đoạn 2016–2018. Tether trả 18,5 triệu và 41 triệu USD để dàn xếp, không thừa nhận sai phạm."] },
      { title: "2 · Tài sản rủi ro hơn, phần đệm mỏng.", body: ["Khoảng 30% két là vàng, bitcoin, khoản cho vay và đầu tư khác, trên một phần đệm chỉ khoảng 4%. S&P chấm khả năng giữ giá 1 USD của USDT là \"yếu\" — 5 trên 5."] },
      { title: "3 · Một công ty có thể đóng băng.", body: ["Tether có thể khoá bất kỳ ví nào. Họ đã đóng băng hơn 4,4 tỷ USD, phần lớn liên quan tội phạm — nhưng năm 2025 chỉ 3,6% địa chỉ bị đưa vào danh sách đen được gỡ ra, và người vô tội cũng có thể bị vướng."] },
      { title: "4 · Không lãi, không bảo hiểm.", body: ["Người giữ không được đồng nào, còn Tether giữ hàng tỷ đô tiền lãi mỗi năm. Và khác tiền gửi ngân hàng, USDT không có bảo hiểm tiền gửi nếu có chuyện."] },
      { title: "5 · Nằm ngoài luật ở Mỹ và châu Âu.", body: ["USDT không được cấp phép theo Đạo luật GENIUS của Mỹ hay MiCA của châu Âu, và đã bị gỡ khỏi các sàn được quản lý ở châu Âu. Ở Việt Nam, mua qua P2P có rủi ro lừa đảo và bị phong toả tài khoản."] },
    ],
  },
  {
    label: "Kết luận",
    title: "Kết luận",
    question: "Vậy Lan có nên giữ USDT?",
    figure: "Điện thoại của Lan hiện 1.000 USDT ≈ 1.000 USD; rồi đồng USDT ghép lại và có thể xoay.",
    beats: [
      {
        title: "USDT làm tốt một việc: là đồng đô la di chuyển như crypto.",
        body: ["Nó giữ được quanh 1 USD trong phần lớn 12 năm, vượt qua đợt rút tiền ồ ạt năm 2022 và được hàng trăm triệu người dùng. Đằng sau là một chiếc két khổng lồ, phần lớn là nợ của chính phủ Mỹ."],
      },
      {
        title: "Nhưng đó là lời hứa của một công ty tư nhân.",
        body: ["Tether quyết định thứ gì nằm trong két, có thể đóng băng bất kỳ ví nào, giữ toàn bộ tiền lãi, và có nhiều năm minh bạch kém — giờ mới khá lên. Ngoài Mỹ và châu Âu, rất ít luật bảo vệ người giữ."], insight: "Câu hỏi đúng không phải \"USDT có an toàn không?\" mà là \"mình đang chịu rủi ro của ai?\": một công ty tư nhân ở El Salvador giữ toàn bộ tiền lãi, thay vì một ngân hàng có bảo hiểm tiền gửi.",
      },
      {
        title: "Với Lan: một công cụ, không phải sổ tiết kiệm.",
        body: [
          "Để gửi đô la hay giữ tạm trong thời gian ngắn, USDT tiện lợi. Với khoản tiết kiệm lớn hoặc dài hạn, hãy chia nhỏ rủi ro, đừng để tất cả trên một sàn, và ở Việt Nam hãy chuyển sang nền tảng được cấp phép khi chúng mở. Đây là kiến thức giáo dục, không phải lời khuyên đầu tư.",
          "Kéo đồng coin để lật nó lại.",
        ],
      },
    ],
  },
];
