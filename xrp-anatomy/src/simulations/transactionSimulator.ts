/**
 * Simulated XRP payment between two wallets. No keys, no network writes.
 * Amounts are tracked in drops (integers) to avoid floating-point drift.
 */
export const DROPS_PER_XRP = 1_000_000;
export const BASE_RESERVE_DROPS = 1 * DROPS_PER_XRP; // Mainnet base reserve since Dec 2024
export const REFERENCE_FEE_DROPS = 10; // documented reference transaction cost

export type Wallets = { a: number; b: number }; // drops
export const INITIAL_WALLETS: Wallets = { a: 1000 * DROPS_PER_XRP, b: 200 * DROPS_PER_XRP };

export type FeeInfo = { drops: number; source: "live" | "illustrative"; at?: string };

export function spendable(balanceDrops: number) {
  return Math.max(0, balanceDrops - BASE_RESERVE_DROPS);
}

export function canPay(w: Wallets, amountDrops: number, feeDrops: number) {
  return amountDrops + feeDrops <= spendable(w.a);
}

export function applyPayment(w: Wallets, amountDrops: number, feeDrops: number): Wallets {
  return { a: w.a - amountDrops - feeDrops, b: w.b + amountDrops };
}

export const toXrp = (drops: number) => drops / DROPS_PER_XRP;

/** Pseudo transaction hash for display only. */
export function fakeHash(seed: number) {
  let h = 2166136261 ^ seed;
  let out = "";
  for (let i = 0; i < 64; i++) {
    h = Math.imul(h ^ (h >>> 13), 16777619) + i * 2654435761;
    out += ((h >>> 0) % 16).toString(16).toUpperCase();
  }
  return out;
}

/**
 * Try a public XRPL JSON-RPC endpoint for the current base fee.
 * Returns null on any failure (CORS, network, timeout) so the UI can fall back
 * to the clearly-labelled documented reference cost.
 */
export async function fetchLiveFee(timeoutMs = 4500): Promise<FeeInfo | null> {
  const endpoints = ["https://xrplcluster.com/", "https://s2.ripple.com:51234/"];
  for (const url of endpoints) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "fee", params: [{}] }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) continue;
      const json = await res.json();
      const base = Number(json?.result?.drops?.base_fee);
      if (Number.isFinite(base) && base > 0 && base < 1_000_000) {
        return { drops: base, source: "live", at: new Date().toISOString() };
      }
    } catch {
      /* try next */
    }
  }
  return null;
}
