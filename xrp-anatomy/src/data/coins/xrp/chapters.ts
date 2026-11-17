/**
 * Structural chapter config (language-independent).
 * The story runs in six acts: Problem → Origin → Journey → Simulation →
 * Economics → Reality check. `beats` are chapter-local scroll positions (0…1)
 * of each text beat; panels are sticky interactive tools placed between beats.
 */
export type PanelKind =
  | "problem"
  | "journey"
  | "send"
  | "route"
  | "liquidity"
  | "dex"
  | "economics"
  | "rwa"
  | "risk"
  | "verdict"
  | "explorer";

export type PanelSlot = { kind: PanelKind; at: number; span: number };

export type ChapterConfig = {
  id: string;
  /** act index 0..5 */
  act: number;
  beats: number[];
  height: number;
  panels: PanelSlot[];
  /** extra-dark technical scene */
  dark?: boolean;
};

export const chapters: ChapterConfig[] = [
  { id: "problem", act: 0, beats: [0, 0.2, 0.4, 0.92], height: 4.8, panels: [{ kind: "problem", at: 0.58, span: 0.3 }] },
  { id: "origin", act: 1, beats: [0.02, 0.26, 0.5, 0.74], height: 4.2, panels: [] },
  { id: "journey", act: 2, beats: [0.02, 0.24, 0.46, 0.68], height: 5.2, panels: [{ kind: "journey", at: 0.86, span: 0.1 }] },
  { id: "coin", act: 3, beats: [0, 0.24, 0.5, 0.78], height: 4.2, panels: [] },
  { id: "ledger", act: 3, beats: [0.02, 0.3, 0.56, 0.8], height: 3.8, panels: [] },
  { id: "consensus", act: 3, beats: [0.02, 0.27, 0.52, 0.78], height: 4.0, panels: [], dark: true },
  { id: "send", act: 3, beats: [0.02, 0.78], height: 3.6, panels: [{ kind: "send", at: 0.2, span: 0.52 }] },
  { id: "crossborder", act: 3, beats: [0.02, 0.2, 0.84], height: 4.2, panels: [{ kind: "route", at: 0.4, span: 0.4 }] },
  { id: "bridge", act: 3, beats: [0.02, 0.28, 0.86], height: 4.0, panels: [{ kind: "liquidity", at: 0.46, span: 0.36 }] },
  { id: "dex", act: 3, beats: [0.02, 0.24, 0.86], height: 4.0, panels: [{ kind: "dex", at: 0.44, span: 0.38 }] },
  { id: "economics", act: 4, beats: [0.02, 0.26, 0.5], height: 4.4, panels: [{ kind: "economics", at: 0.7, span: 0.22 }] },
  { id: "rwa", act: 4, beats: [0.02, 0.24, 0.86], height: 4.2, panels: [{ kind: "rwa", at: 0.42, span: 0.4 }] },
  { id: "supply", act: 4, beats: [0.02, 0.26, 0.5, 0.76], height: 4.0, panels: [] },
  {
    id: "risk",
    act: 5,
    beats: [0.02, 0.5, 0.9],
    height: 5.2,
    panels: [
      { kind: "risk", at: 0.18, span: 0.28 },
      { kind: "verdict", at: 0.68, span: 0.18 },
    ],
  },
  { id: "pieces", act: 5, beats: [0.02, 0.33, 0.6], height: 5.0, panels: [{ kind: "explorer", at: 0.84, span: 0.16 }] },
];

export const CHAPTER_COUNT = chapters.length;

/** index of the finale (exploded coin) chapter */
export const FINALE = CHAPTER_COUNT - 1;

/** index of a chapter by id (scenes use this instead of hard-coded numbers) */
export function chapterIndex(id: string) {
  const i = chapters.findIndex((c) => c.id === id);
  if (i < 0) throw new Error(`unknown chapter ${id}`);
  return i;
}

/** the coin intro chapter — the 3D coin choreography is offset from here */
export const COIN = chapterIndex("coin");
