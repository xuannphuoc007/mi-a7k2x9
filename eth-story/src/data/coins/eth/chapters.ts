/**
 * Structural chapter config for the Ethereum story (six acts):
 * Problem → Origin → Journey → Simulation → Economics → Reality check.
 * Every simulation plays itself as the reader scrolls — no controls needed.
 */
export type PanelKind = "compare";
export type PanelSlot = { kind: PanelKind; at: number; span: number };
export type ChapterConfig = { id: string; act: number; beats: number[]; height: number; panels: PanelSlot[]; dark?: boolean };

export const chapters: ChapterConfig[] = [
  { id: "problem", act: 0, beats: [0, 0.2, 0.42, 0.64], height: 4.6, panels: [] },
  { id: "origin", act: 1, beats: [0.02, 0.26, 0.5, 0.74], height: 4.2, panels: [] },
  { id: "journey", act: 2, beats: [0.02, 0.24, 0.46, 0.68], height: 4.8, panels: [] },
  { id: "contract", act: 3, beats: [0.02, 0.22, 0.42, 0.86], height: 5.2, panels: [] },
  { id: "network", act: 3, beats: [0.02, 0.28, 0.54, 0.78], height: 3.8, panels: [] },
  { id: "gas", act: 3, beats: [0.02, 0.26, 0.5], height: 4.4, panels: [] },
  { id: "staking", act: 3, beats: [0.02, 0.26, 0.5], height: 4.2, panels: [] },
  { id: "defi", act: 4, beats: [0.02, 0.26, 0.5], height: 4.4, panels: [] },
  { id: "economics", act: 4, beats: [0.02, 0.26, 0.52, 0.74], height: 4.6, panels: [] },
  { id: "layer2", act: 4, beats: [0.02, 0.32, 0.62], height: 3.8, panels: [] },
  { id: "versus", act: 5, beats: [0.02, 0.8], height: 4.6, panels: [{ kind: "compare", at: 0.2, span: 0.46 }] },
  { id: "reality", act: 5, beats: [0.02, 0.36, 0.68], height: 3.8, panels: [] },
  { id: "finale", act: 5, beats: [0.02, 0.28, 0.56], height: 4.4, panels: [] },
];

export const CHAPTER_COUNT = chapters.length;
export const FINALE = CHAPTER_COUNT - 1;

export function chapterIndex(id: string) {
  const i = chapters.findIndex((c) => c.id === id);
  if (i < 0) throw new Error(`unknown chapter ${id}`);
  return i;
}
