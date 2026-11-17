/**
 * Teaching model for the DEX chapter: a synthetic order book and a
 * constant-product AMM around an illustrative mid price. Not market data.
 */
export const MID = 2.0; // USD per XRP (illustrative)
export const TICK = 0.004;
export const LEVELS = 9;
export const AMM_FEE = 0.003;

export type Level = { price: number; size: number };

export function buildBook(liquidity: number) {
  const asks: Level[] = [];
  const bids: Level[] = [];
  for (let i = 0; i < LEVELS; i++) {
    const shape = 1 + i * 0.35 + (i % 3 === 1 ? 0.4 : 0);
    asks.push({ price: +(MID + TICK * (i + 0.5)).toFixed(4), size: Math.round(liquidity * 900 * shape) });
    bids.push({ price: +(MID - TICK * (i + 0.5)).toFixed(4), size: Math.round(liquidity * 900 * shape * (i % 2 ? 1.1 : 0.92)) });
  }
  return { asks, bids };
}

export type Fill = {
  filled: number;
  cost: number;
  avg: number;
  slippagePct: number;
  levels: number;
  perLevel: number[]; // amount taken from each ask level
  complete: boolean;
};

/** Market buy of `qty` XRP walking the asks. */
export function walkBook(asks: Level[], qty: number): Fill {
  let left = qty;
  let cost = 0;
  const perLevel = asks.map(() => 0);
  let levels = 0;
  for (let i = 0; i < asks.length && left > 1e-9; i++) {
    const take = Math.min(left, asks[i].size);
    perLevel[i] = take;
    cost += take * asks[i].price;
    left -= take;
    levels++;
  }
  const filled = qty - left;
  const avg = filled > 0 ? cost / filled : MID;
  return { filled, cost, avg, slippagePct: ((avg - MID) / MID) * 100, levels, perLevel, complete: left <= 1e-9 };
}

/** AMM reserves sized so total value ≈ book depth for a fair comparison. */
export function ammReserves(liquidity: number) {
  const xrp = liquidity * 250_000; // XRP side
  return { x: xrp, y: xrp * MID };
}

/** Buy `qty` XRP from a constant-product pool; returns USD cost incl. fee. */
export function ammBuy(liquidity: number, qty: number) {
  const { x, y } = ammReserves(liquidity);
  if (qty >= x) return { cost: Infinity, avg: Infinity, slippagePct: Infinity, x, y, x2: x, y2: y, complete: false };
  const dyNoFee = (x * y) / (x - qty) - y;
  const cost = dyNoFee / (1 - AMM_FEE);
  const avg = cost / qty;
  return { cost, avg, slippagePct: ((avg - MID) / MID) * 100, x, y, x2: x - qty, y2: y + dyNoFee, complete: true };
}
