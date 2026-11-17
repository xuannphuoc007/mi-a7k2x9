/**
 * Illustrative cross-currency routing model (NOT live XRPL pathfinding).
 * Each hop is a constant-product pool; "depth" is the pool's reserve on its
 * USD-equivalent side. Reference rates are invented for teaching.
 */
export const REF = { MXN_PER_USD: 18, USD_PER_XRP: 2 };

export type RouteParams = {
  amountUsd: number;
  directDepthUsd: number; // USD/MXN pool depth
  leg1DepthUsd: number; // USD/XRP pool depth
  leg2DepthUsd: number; // XRP/MXN pool depth
  hopCostBps: number; // spread + fee per hop
};

/** constant product swap with fee */
function cp(dx: number, x: number, y: number, feeBps: number) {
  const dxf = dx * (1 - feeBps / 10_000);
  return (y * dxf) / (x + dxf);
}

export function directOut(usd: number, p: RouteParams) {
  if (usd <= 0) return 0;
  const x = p.directDepthUsd;
  const y = p.directDepthUsd * REF.MXN_PER_USD;
  return cp(usd, x, y, p.hopCostBps);
}

export function bridgeOut(usd: number, p: RouteParams) {
  if (usd <= 0) return 0;
  const xrp = cp(usd, p.leg1DepthUsd, p.leg1DepthUsd / REF.USD_PER_XRP, p.hopCostBps);
  const xrpReserve = p.leg2DepthUsd / REF.USD_PER_XRP;
  const mxnReserve = p.leg2DepthUsd * REF.MXN_PER_USD;
  return cp(xrp, xrpReserve, mxnReserve, p.hopCostBps);
}

export type RouteResult = {
  direct: number;
  bridge: number;
  split: number;
  splitDirectShare: number; // 0..1 of input sent direct in the best split
  best: "direct" | "bridge" | "split";
  bestOut: number;
  ideal: number; // output at reference rate, no costs
  priceImpactPct: number;
};

export function route(p: RouteParams): RouteResult {
  const direct = directOut(p.amountUsd, p);
  const bridge = bridgeOut(p.amountUsd, p);
  let bestShare = 0;
  let bestSplit = -1;
  for (let i = 0; i <= 100; i++) {
    const s = i / 100;
    const out = directOut(p.amountUsd * s, p) + bridgeOut(p.amountUsd * (1 - s), p);
    if (out > bestSplit) {
      bestSplit = out;
      bestShare = s;
    }
  }
  const ideal = p.amountUsd * REF.MXN_PER_USD;
  let best: RouteResult["best"] = "split";
  let bestOut = bestSplit;
  if (bestShare >= 0.98 || direct >= bestSplit - 1e-9) {
    best = "direct";
    bestOut = direct;
    bestShare = 1;
  } else if (bestShare <= 0.02 || bridge >= bestSplit - 1e-9) {
    best = "bridge";
    bestOut = bridge;
    bestShare = 0;
  }
  return {
    direct,
    bridge,
    split: bestSplit,
    splitDirectShare: bestShare,
    best,
    bestOut,
    ideal,
    priceImpactPct: ideal > 0 ? (1 - bestOut / ideal) * 100 : 0,
  };
}

export const DEFAULT_ROUTE: RouteParams = {
  amountUsd: 5_000,
  directDepthUsd: 40_000,
  leg1DepthUsd: 300_000,
  leg2DepthUsd: 300_000,
  hopCostBps: 20,
};
