/** Dated sources. `kind` distinguishes protocol docs from market / data sources. */
export type Reference = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  kind: "protocol" | "market" | "data" | "public";
  date?: string;
  accessed: string;
  supports: string;
};

const ACCESSED = "2026-11-17";

export const references: Reference[] = [
  { id: "cm", title: "Coin Metrics community network data (eth.csv)", publisher: "Coin Metrics · GitHub", url: "https://github.com/coinmetrics/data", kind: "data", date: "to 2026-05-23", accessed: ACCESSED, supports: "Daily price, fees per day, transactions per day and ETH supply (CC BY-NC 4.0)" },
  { id: "fees", title: "Freelancing platforms by the numbers", publisher: "Lilach Bullock", url: "https://www.lilachbullock.com/freelancing-platforms-by-the-numbers/", kind: "market", date: "Oct 2026", accessed: ACCESSED, supports: "Upwork freelancer fee 0–15% per contract; Fiverr keeps 20% of each order (from their help centres)" },
  { id: "wp", title: "Ethereum Whitepaper", publisher: "ethereum.org", url: "https://ethereum.org/en/whitepaper/", kind: "protocol", date: "2013", accessed: ACCESSED, supports: "Vitalik Buterin's 2013 proposal for a blockchain with a built-in programming language" },
  { id: "history", title: "Ethereum timeline", publisher: "ethereum.org", url: "https://ethereum.org/en/history/", kind: "protocol", accessed: ACCESSED, supports: "Crowdsale 2014, launch 30 Jul 2015, DAO fork, London, The Merge, Shapella, Dencun, Pectra, Fusaka" },
  { id: "gas", title: "Gas and fees", publisher: "ethereum.org", url: "https://ethereum.org/en/developers/docs/gas/", kind: "protocol", accessed: ACCESSED, supports: "Base fee burned, priority fee (tip), 21,000 gas for a simple transfer, base fee changes up to 12.5% per block" },
  { id: "eip1559", title: "EIP-1559: Fee market change for ETH 1.0 chain", publisher: "Ethereum Improvement Proposals", url: "https://eips.ethereum.org/EIPS/eip-1559", kind: "protocol", date: "2021", accessed: ACCESSED, supports: "Target block fullness of 50% and the base-fee update rule" },
  { id: "pos", title: "Proof-of-stake", publisher: "ethereum.org", url: "https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/", kind: "protocol", accessed: ACCESSED, supports: "32 ETH per validator, 12-second slots, random block proposer, penalties and slashing" },
  { id: "merge", title: "The Merge", publisher: "ethereum.org", url: "https://ethereum.org/en/roadmap/merge/", kind: "protocol", date: "2022-09-15", accessed: ACCESSED, supports: "Switch to proof-of-stake; energy use cut by about 99.95%" },
  { id: "dank", title: "Danksharding (proto-danksharding / blobs)", publisher: "ethereum.org", url: "https://ethereum.org/en/roadmap/danksharding/", kind: "protocol", accessed: ACCESSED, supports: "Blobs for Layer-2 data, introduced with Dencun in March 2024" },
  { id: "staking", title: "Ethereum Staking Reaches 41.4 Million ETH, Accounting for 34% of Total Supply", publisher: "KuCoin", url: "https://www.kucoin.com/blog/ethereum-staking-reaches-41-4-million-eth-accounting-for-34-of-total-supply", kind: "market", date: "2026-08-05", accessed: ACCESSED, supports: "41.4M ETH staked (~34%); base APR diluted to about 2.78%; concentration in exchanges and Lido" },
  { id: "theblock", title: "Ethereum staking climbs to 34% as proposal targets validator rewards", publisher: "The Block", url: "https://theblock.co/news/ecosystems/2026-08-12-ethereum-staking-climbs-34-proposal-targets-validator-rewards-eth-treasury-firm-yields-411312", kind: "market", date: "2026-08-12", accessed: ACCESSED, supports: "Staked share up from about 29% at the start of 2026 to 34%" },
  { id: "lido", title: "Can Ethereum's staking economy drive ETH higher in the second half of 2026?", publisher: "Analytics Insight", url: "https://www.analyticsinsight.net/ethereum/can-ethereums-staking-economy-drive-eth-higher-in-the-second-half-of-2026", kind: "market", date: "2026", accessed: ACCESSED, supports: "Lido holds about 22.9% of staked ETH" },
  { id: "aave", title: "Risk parameters", publisher: "Aave docs", url: "https://docs.aave.com/risk/asset-risk/risk-parameters", kind: "protocol", accessed: ACCESSED, supports: "Loan-to-value, liquidation threshold and liquidation bonus (used here as rounded, illustrative values)" },
  { id: "stable", title: "Ethereum Statistics 2026", publisher: "Axis Intelligence", url: "https://axis-intelligence.com/?p=36360", kind: "market", date: "2026-06-21", accessed: ACCESSED, supports: "About $157B of stablecoins on Ethereum mainnet, ~51% of the market; 73 rollups with >$48B TVL (May 2026)" },
  { id: "bybit", title: "FBI: Lazarus Group behind $1.5 billion Bybit heist", publisher: "TechTarget", url: "https://www.techtarget.com/cybersecurity/news/366619872/FBI-Lazarus-Group-behind-15-billion-Bybit-heist", kind: "public", date: "2025-02", accessed: ACCESSED, supports: "$1.5B in ETH stolen from Bybit on 21 Feb 2025; FBI attribution to North Korea" },
  { id: "btc20m", title: "Bitcoin's mined supply hits 20 million milestone", publisher: "The Block", url: "https://www.theblock.co/news/ecosystems/2026-03-09-bitcoin-mined-supply-hits-20-million-btc-392660", kind: "market", date: "2026-03-09", accessed: ACCESSED, supports: "20 millionth bitcoin mined; less than 1 million BTC left to issue" },
  { id: "btcsched", title: "Predictable milestones prove bitcoin reliable", publisher: "Unchained", url: "https://www.unchained.com/blog/predictable-milestones-prove-bitcoin-reliable", kind: "market", date: "2026", accessed: ACCESSED, supports: "Bitcoin issuance schedule: ≈20.1M BTC mined by Oct 2026" },
  { id: "fortunebtc", title: "Current price of Bitcoin for Nov. 13, 2026", publisher: "Fortune", url: "https://fortune.com/article/price-of-bitcoin-11-13-2026/", kind: "market", date: "2026-11-13", accessed: ACCESSED, supports: "BTC $69,134.72 and ETH $1,953.96 at 8:30 a.m. ET; BTC −30.65% versus a year earlier" },
  { id: "fortune", title: "Current price of Ethereum for Nov. 13, 2026", publisher: "Fortune", url: "https://fortune.com/article/price-of-ethereum-11-13-2026/", kind: "market", date: "2026-11-13", accessed: ACCESSED, supports: "ETH ≈ $1,954 on 13 Nov 2026; about −40% versus a year earlier" },
];
