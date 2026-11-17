/**
 * The twelve conceptual layers of the coin, in stacking order (front → back),
 * plus the categories used by the final explorer. Visual parameters live here
 * so another asset can reuse the same storytelling engine with its own anatomy.
 */
export type CategoryId = "core" | "ledger" | "consensus" | "payments" | "liquidity" | "risks";

export type LayerDef = {
  id: string;
  index: number;
  category: CategoryId;
  /** radius as a fraction of the coin radius */
  radius: number;
  /** inner hole as a fraction of radius (0 = solid disc) */
  hole: number;
  /** glyph drawn on the layer's face texture */
  glyph:
    | "shell" | "asset" | "ledger" | "signature" | "p2p" | "validators"
    | "fees" | "routing" | "bridge" | "dex" | "supply" | "risk";
  tint: string;
  /** chapter where this layer is the protagonist (for the explorer's "see chapter" link) */
  chapter: number;
};

export const categories: CategoryId[] = ["core", "ledger", "consensus", "payments", "liquidity", "risks"];

export const layers: LayerDef[] = [
  { id: "shell", index: 0, category: "core", radius: 1.0, hole: 0, glyph: "shell", tint: "#e9e8df", chapter: 0 },
  { id: "asset", index: 1, category: "core", radius: 0.9, hole: 0, glyph: "asset", tint: "#d6e8e3", chapter: 0 },
  { id: "ledger", index: 2, category: "ledger", radius: 0.94, hole: 0.0, glyph: "ledger", tint: "#f1f1ea", chapter: 1 },
  { id: "signing", index: 3, category: "ledger", radius: 0.86, hole: 0.42, glyph: "signature", tint: "#eef0ea", chapter: 1 },
  { id: "p2p", index: 4, category: "consensus", radius: 0.95, hole: 0.0, glyph: "p2p", tint: "#e7ece9", chapter: 1 },
  { id: "validators", index: 5, category: "consensus", radius: 0.9, hole: 0.55, glyph: "validators", tint: "#dce6e3", chapter: 2 },
  { id: "fees", index: 6, category: "ledger", radius: 0.8, hole: 0.0, glyph: "fees", tint: "#f2e6de", chapter: 3 },
  { id: "routing", index: 7, category: "payments", radius: 0.96, hole: 0.0, glyph: "routing", tint: "#eceee7", chapter: 4 },
  { id: "bridge", index: 8, category: "liquidity", radius: 0.88, hole: 0.3, glyph: "bridge", tint: "#e2ebe7", chapter: 5 },
  { id: "dex", index: 9, category: "liquidity", radius: 0.92, hole: 0.0, glyph: "dex", tint: "#eef0ea", chapter: 6 },
  { id: "supply", index: 10, category: "core", radius: 0.97, hole: 0.62, glyph: "supply", tint: "#e8eae2", chapter: 7 },
  { id: "risk", index: 11, category: "risks", radius: 1.0, hole: 0.7, glyph: "risk", tint: "#f3e3da", chapter: 8 },
];

export const LAYER_COUNT = layers.length;
