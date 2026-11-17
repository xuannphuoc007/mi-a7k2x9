/** Shared state between reading-column panels and stage scenes. */
import { createStore } from "@/lib/store";

/** Act 1: how Lan and Anna settle the deal — 0 pay first · 1 work first · 2 platform · 3 smart contract */
export const problemStore = createStore({ option: 2, fee: 20 });

/** Act 3: selected journey event id */
export const journeyStore = createStore({ selected: null as string | null });

/** Act 4: escrow contract — scenario and run progress (0..1) */
export const escrowStore = createStore({ scenario: 0, run: 0, runs: 0, amount: 500, days: 7 });

/** Act 4: gas — how full blocks are (0..1), how many blocks have passed, tip in gwei */
export const gasStore = createStore({ fullness: 0.9, blocks: 0, tip: 0.1, kind: 0 });

/** Act 4: staking — behaviour 0 honest · 1 sometimes offline · 2 double-signs; day of the year */
export const stakingStore = createStore({ behaviour: 0, day: 0, othersSlashed: 0.01 });

/** Act 5: DeFi loan — ETH deposited, share borrowed (of max), ETH price */
export const lendingStore = createStore({ eth: 5, borrowPct: 0.6, price: 1954 });

/** Act 4: supply calculator — staked ETH (millions), ETH burned per day */
export const supplyStore = createStore({ staked: 41.4, burn: 300 });

/** stage square size in CSS px (for scaling SVG text on small screens) */
export const stageStore = createStore({ px: 800 });
