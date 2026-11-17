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
  { id: "mpt", title: "Multi-Purpose Tokens (MPTs)", publisher: "XRPL.org", url: "https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens", kind: "protocol", date: "2025-10-01 (enabled)", accessed: ACCESSED, supports: "Token format for real-world assets, enabled on Mainnet 1 Oct 2025" },
  { id: "permissioned-dex", title: "XRP Ledger activates 'members-only' DEX upgrade", publisher: "The Block", url: "https://www.theblock.co/amp/post/390340/xrp-ledger-activates-members-only-dex-upgrade-aimed-at-regulated-institutions", kind: "market", date: "2026-02", accessed: ACCESSED, supports: "Permissioned DEX (XLS-81) live: credential-gated trading venues" },
  { id: "ousg", title: "Tokenized Treasuries Go Live on the XRPL (Ondo OUSG)", publisher: "Ripple", url: "https://ripple.com/insights/tokenized-treasuries-go-live-on-the-xrpl/", kind: "company", date: "2025-06-11", accessed: ACCESSED, supports: "OUSG live on XRPL; mint and redeem with RLUSD; permissioned access" },
  { id: "dubai", title: "Real Estate Goes Crypto in Dubai's Tokenization Push", publisher: "Finance Magnates", url: "https://www.financemagnates.com/trending/real-estate-goes-crypto-in-dubais-16-billion-tokenization-push/", kind: "market", date: "2025-05-26", accessed: ACCESSED, supports: "Dubai Land Department title-deed tokenization on XRPL with Ctrl Alt (Prypco Mint)" },
  { id: "rwa-4b", title: "XRP Ledger's Tokenized RWA Surpasses $4.18B (Evernorth research)", publisher: "KuCoin News / TheCryptoBasic", url: "https://www.kucoin.com/news/flash/xrp-ledger-s-tokenized-rwa-surpasses-4-18b-28x-growth-in-a-year", kind: "market", date: "2026-06 (as of)", accessed: ACCESSED, supports: "≈$4.18B tokenized RWA on XRPL in June 2026, up from ≈$147M a year earlier" },
  { id: "rwa-concentration", title: "XRP Records $3.6B RWA Inflow in 2026", publisher: "KuCoin News / TheCryptoBasic", url: "https://www.kucoin.com/news/flash/xrp-records-3-6b-rwa-inflow-in-2026-leading-all-blockchains", kind: "market", date: "2026", accessed: ACCESSED, supports: "Commodity and credit tokens drive inflows; two issuers ≈89% of the 2026 total" },
  { id: "rlusd", title: "RLUSD Hits $2.49B Market Cap", publisher: "KuCoin Blog", url: "https://www.kucoin.com/blog/rlusd-hits-2-49b-market-cap-up-86-in-2026-and-closing-in-on-pyusd", kind: "market", date: "2026-09-28 (as of)", accessed: ACCESSED, supports: "RLUSD ≈$2.49B market cap across networks" },
  { id: "rlusd-issuer", title: "What Is RLUSD? Ripple's Stablecoin Explained", publisher: "Stablecoin Insider", url: "https://stablecoininsider.org/rlusd-bank-stablecoin-2026/", kind: "market", date: "2026", accessed: ACCESSED, supports: "Issued by Standard Custody & Trust Company, NYDFS-supervised; reserves held with BNY" },
  { id: "ripple-escrow", title: "An Explanation of Ripple's XRP Escrow", publisher: "Ripple", url: "https://ripple.com/insights/explanation-ripples-xrp-escrow/", kind: "company", date: "2017-12", accessed: ACCESSED, supports: "Ripple locked 55 billion XRP in escrows releasing up to 1 billion per month" },
  { id: "escrow-2026", title: "Ripple locks 200M XRP back into escrow", publisher: "Crypto Briefing", url: "https://cryptobriefing.com/ripple-locks-200m-xrp-escrow/", kind: "market", date: "2026-09-01 (as of)", accessed: ACCESSED, supports: "~31.28 billion XRP remained in escrow as of 1 September 2026" },
];
