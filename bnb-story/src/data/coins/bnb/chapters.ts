/**
 * Structural chapter config for the BNB & Binance story (six acts):
 * Problem → Origin → Journey → How it works → Accusations → People & reality.
 * Every scene plays itself as the reader scrolls — no controls needed.
 */
export type PanelKind = "compare";
export type PanelSlot = { kind: PanelKind; at: number; span: number };
export type ChapterConfig = { id: string; act: number; beats: number[]; height: number; panels: PanelSlot[]; dark?: boolean };

export const chapters: ChapterConfig[] = [
  { id: "problem", act: 0, beats: [0, 0.22, 0.46, 0.7], height: 4.6, panels: [] },
  { id: "origin", act: 1, beats: [0.02, 0.26, 0.5, 0.74], height: 4.4, panels: [] },
  { id: "journey", act: 2, beats: [0.02, 0.22, 0.42, 0.62, 0.8], height: 5.6, panels: [] },
  { id: "exchange", act: 3, beats: [0.02, 0.3, 0.6], height: 4.2, panels: [] },
  { id: "reserves", act: 3, beats: [0.02, 0.3, 0.6], height: 4.2, panels: [] },
  { id: "bnb", act: 3, beats: [0.02, 0.3, 0.6], height: 4.2, panels: [] },
  { id: "chain", act: 3, beats: [0.02, 0.3, 0.6], height: 4.2, panels: [] },
  { id: "plea", act: 4, beats: [0.02, 0.3, 0.6], height: 4.4, panels: [], dark: true },
  { id: "pardon", act: 4, beats: [0.02, 0.3, 0.6], height: 4.4, panels: [], dark: true },
  { id: "probes", act: 4, beats: [0.02, 0.3, 0.6], height: 4.4, panels: [], dark: true },
  { id: "hack", act: 4, beats: [0.02, 0.3, 0.6], height: 4.4, panels: [], dark: true },
  { id: "team", act: 5, beats: [0.02, 0.3, 0.6], height: 4.4, panels: [] },
  { id: "custody", act: 5, beats: [0.02, 0.8], height: 4.4, panels: [{ kind: "compare", at: 0.2, span: 0.46 }] },
  { id: "reality", act: 5, beats: [0.02, 0.36, 0.68], height: 3.8, panels: [] },
  { id: "finale", act: 5, beats: [0.02, 0.3, 0.56], height: 4.2, panels: [] },
];

export const CHAPTER_COUNT = chapters.length;
export const FINALE = CHAPTER_COUNT - 1;

export function chapterIndex(id: string) {
  const i = chapters.findIndex((c) => c.id === id);
  if (i < 0) throw new Error(`unknown chapter ${id}`);
  return i;
}
