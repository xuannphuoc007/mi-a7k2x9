/**
 * Structural chapter config for the Solana story (six acts):
 * Problem → Origin → Journey → How it works → Stress tests → Today & reality.
 * Every scene plays itself as the reader scrolls — no controls needed.
 */
export type PanelKind = "compare" | "versus";
export type PanelSlot = { kind: PanelKind; at: number; span: number };
export type ChapterConfig = { id: string; act: number; beats: number[]; height: number; panels: PanelSlot[]; dark?: boolean };

export const chapters: ChapterConfig[] = [
  { id: "problem", act: 0, beats: [0, 0.24, 0.48, 0.72], height: 4.6, panels: [] },
  { id: "origin", act: 1, beats: [0.02, 0.26, 0.5, 0.72], height: 4.6, panels: [] },
  { id: "journey", act: 2, beats: [0.02, 0.2, 0.38, 0.56, 0.74], height: 6, panels: [] },
  { id: "poh", act: 3, beats: [0.02, 0.26, 0.5, 0.72], height: 4.6, panels: [] },
  { id: "speed", act: 3, beats: [0.02, 0.28, 0.52, 0.74], height: 4.6, panels: [] },
  { id: "validators", act: 3, beats: [0.02, 0.27, 0.5, 0.72], height: 4.8, panels: [] },
  { id: "outages", act: 4, beats: [0.02, 0.26, 0.5, 0.72], height: 4.8, panels: [], dark: true },
  { id: "ftx", act: 4, beats: [0.02, 0.26, 0.5, 0.72], height: 4.6, panels: [], dark: true },
  { id: "memes", act: 4, beats: [0.01, 0.2, 0.39, 0.58, 0.76], height: 5.8, panels: [], dark: true },
  { id: "defi", act: 5, beats: [0.02, 0.27, 0.5, 0.72], height: 4.8, panels: [] },
  { id: "legal", act: 5, beats: [0.02, 0.3, 0.58], height: 4.2, panels: [] },
  { id: "team", act: 5, beats: [0.02, 0.5], height: 3.6, panels: [] },
  { id: "versus", act: 5, beats: [0.02], height: 4.4, panels: [{ kind: "versus", at: 0.3, span: 0.42 }] },
  { id: "reality", act: 5, beats: [0.02, 0.24, 0.46, 0.68], height: 5, panels: [] },
  { id: "finale", act: 5, beats: [0.02, 0.3, 0.56], height: 4.2, panels: [] },
];

export const CHAPTER_COUNT = chapters.length;
export const FINALE = CHAPTER_COUNT - 1;

export function chapterIndex(id: string) {
  const i = chapters.findIndex((c) => c.id === id);
  if (i < 0) throw new Error(`unknown chapter ${id}`);
  return i;
}
