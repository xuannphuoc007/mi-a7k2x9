/** Dated sources. `kind` distinguishes protocol docs from company / market sources. */
export type Reference = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  kind: "protocol" | "company" | "market";
  date?: string; // publication or "as of" date
  accessed: string;
  supports: string;
};

const ACCESSED = "2026-11-17";

export const references: Reference[] = [
  { id: "tx-cost", title: "Transaction Cost", publisher: "XRPL.org", url: "https://xrpl.org/docs/concepts/transactions/transaction-cost", kind: "protocol", accessed: ACCESSED, supports: "10-drop reference cost; fees are destroyed, not paid to any party; load scaling" },
  { id: "reserves", title: "Reserves", publisher: "XRPL.org", url: "https://xrpl.org/docs/concepts/accounts/reserves", kind: "protocol", accessed: ACCESSED, supports: "1 XRP base reserve, 0.2 XRP owner reserve on Mainnet" },
  { id: "reserves-blog", title: "Lower Reserves Are In Effect", publisher: "XRPL.org blog", url: "https://xrpl.org/blog/2024/lower-reserves-are-in-effect", kind: "protocol", date: "2024-12", accessed: ACCESSED, supports: "Reserves lowered from 10/2 XRP to 1/0.2 XRP" },
  { id: "consensus", title: "Consensus Protocol", publisher: "XRPL.org", url: "https://xrpl.org/docs/concepts/consensus-protocol", kind: "protocol", accessed: ACCESSED, supports: "XRP Ledger Consensus Protocol, ledger history, validation" },
  { id: "learn-consensus", title: "How the XRP Ledger Works", publisher: "Learn XRPL", url: "https://learn.xrpl.org/course/intro-to-the-xrpl/lesson/how-the-xrp-ledger-works/", kind: "protocol", accessed: ACCESSED, supports: "80% supermajority of trusted validators; UNL" },
  { id: "escrow", title: "Escrow", publisher: "XRPL.org", url: "https://xrpl.org/docs/concepts/payment-types/escrow", kind: "protocol", accessed: ACCESSED, supports: "FinishAfter, Condition, CancelAfter; enforced by the ledger" },
  { id: "paths", title: "Paths", publisher: "XRPL.org", url: "https://xrpl.org/docs/concepts/tokens/fungible-tokens/paths", kind: "protocol", accessed: ACCESSED, supports: "Paths connect sender and receiver through orders and AMMs" },
  { id: "autobridging", title: "Auto-Bridging", publisher: "XRPL.org", url: "https://xrpl.org/docs/concepts/tokens/decentralized-exchange/autobridging", kind: "protocol", accessed: ACCESSED, supports: "XRP used automatically as an intermediary between order books" },
  { id: "amm", title: "Automated Market Makers", publisher: "XRPL.org", url: "https://xrpl.org/docs/concepts/tokens/decentralized-exchange/automated-market-makers", kind: "protocol", accessed: ACCESSED, supports: "Constant-product AMM integrated with the DEX; trading fee up to 1%" },
  { id: "amm-blog", title: "Get Ready for AMM", publisher: "XRPL.org blog", url: "https://xrpl.org/blog/2024/get-ready-for-amm", kind: "protocol", date: "2024-03", accessed: ACCESSED, supports: "AMM amendment (XLS-30) expected on Mainnet 2024-03-22" },
  { id: "ripple-escrow", title: "An Explanation of Ripple's XRP Escrow", publisher: "Ripple", url: "https://ripple.com/insights/explanation-ripples-xrp-escrow/", kind: "company", date: "2017-12", accessed: ACCESSED, supports: "Ripple locked 55 billion XRP in escrows releasing up to 1 billion per month" },
  { id: "escrow-2026", title: "Ripple locks 200M XRP back into escrow", publisher: "Crypto Briefing", url: "https://cryptobriefing.com/ripple-locks-200m-xrp-escrow/", kind: "market", date: "2026-09-01 (as of)", accessed: ACCESSED, supports: "~31.28 billion XRP remained in escrow as of 1 September 2026" },
];
