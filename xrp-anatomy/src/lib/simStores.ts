/** Shared state between the reading-column panels and the stage scenes. */
import { createStore } from "@/lib/store";
import { INITIAL_WALLETS, REFERENCE_FEE_DROPS, type FeeInfo, type Wallets } from "@/simulations/transactionSimulator";
import { DEFAULT_ROUTE, type RouteParams } from "@/simulations/paymentRouter";

export const sendStore = createStore({
  /** continuous step progress 0..6 */
  t: 0,
  playing: false,
  amountXrp: 500,
  before: INITIAL_WALLETS as Wallets,
  after: INITIAL_WALLETS as Wallets,
  fee: { drops: REFERENCE_FEE_DROPS, source: "illustrative" } as FeeInfo,
  hash: "",
  failed: false,
  runs: 0,
});

export const routeStore = createStore({ mode: "B" as "A" | "B" });

export const liquidityStore = createStore<RouteParams>({ ...DEFAULT_ROUTE });

export const dexStore = createStore({
  size: 6000,
  liquidity: 1,
  mode: "auto" as "auto" | "book" | "amm",
});

export const riskStore = createStore({ risk: -1 });

export const rwaStore = createStore({ asset: -1 });
