/** Small, clearly-simplified models shared by scenes and panels. */

// ---------- gas (EIP-1559, simplified) ----------
export const GAS_LIMIT = 60_000_000; // gas per block (illustrative, 2026)
export const BASE0 = 1; // starting base fee in gwei (illustrative)
export const GAS_BLOCKS = 12;
export const TX_GAS = [21_000, 150_000, 60_000]; // transfer · token swap · escrow approve (illustrative)
export const ETH_USD = 1954; // ETH price on 13 Nov 2026 (Fortune)

/** base fee (gwei) for blocks 0..n at a constant fullness f (0..1) */
export function baseFees(f: number, n = GAS_BLOCKS) {
  const out = [BASE0];
  for (let i = 1; i <= n; i++) out.push(out[i - 1] * (1 + 0.125 * (f - 0.5) / 0.5));
  return out;
}
/** ETH burned by one block with base fee b (gwei) and fullness f */
export const burnedEth = (b: number, f: number) => b * f * GAS_LIMIT * 1e-9;
/** cost of one transaction in ETH */
export const txCostEth = (base: number, tip: number, gas: number) => (base + tip) * gas * 1e-9;

// ---------- staking (simplified) ----------
export const DEPOSIT = 32;
export const APR = 0.028; // ≈ base APR, Aug 2026
export const SLASH_DAY = 120;
/** validator balance after `day` days for behaviour 0 honest · 1 offline 20% · 2 double-signs */
export function stakeBalance(behaviour: number, day: number, othersSlashed = 0.01) {
  const yr = day / 365;
  if (behaviour === 0) return DEPOSIT * (1 + APR * yr);
  if (behaviour === 1) return DEPOSIT * (1 + APR * 0.8 * yr - APR * 0.2 * yr);
  // slashed at SLASH_DAY: an initial penalty of 1 ETH, a larger penalty that grows if many others were slashed at the same time,
  // then forced exit: no more rewards (simplified)
  if (day < SLASH_DAY) return DEPOSIT * (1 + APR * yr);
  const before = DEPOSIT * (1 + (APR * SLASH_DAY) / 365);
  const corr = Math.min(DEPOSIT, DEPOSIT * 3 * othersSlashed);
  const after = before - 1 - corr * Math.min(1, (day - SLASH_DAY) / 18);
  return Math.max(0, after);
}

// ---------- lending (similar to Aave v3 for ETH, rounded) ----------
export const LTV = 0.8;
export const LT = 0.83;
export const BONUS = 0.05;
export const START_PRICE = ETH_USD;
export const debtUsd = (eth: number, pct: number) => eth * START_PRICE * LTV * pct;
export const health = (eth: number, price: number, debt: number) => (debt <= 0 ? Infinity : (eth * price * LT) / debt);
export const liqPrice = (eth: number, debt: number) => debt / (eth * LT);

// ---------- supply ----------
/** new ETH per year ≈ 166.3 × √(staked ETH) — the shape of the protocol's issuance curve */
export const issuancePerYear = (stakedMillions: number) => 166.3 * Math.sqrt(stakedMillions * 1e6);
