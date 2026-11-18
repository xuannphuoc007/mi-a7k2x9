/**
 * Structural chapter config for the Solana story (five acts):
 * Intro → Five milestones → Solana today → Strengths & weaknesses → Conclusion.
 * Every scene plays itself as the reader scrolls — no controls needed.
 */
export type PanelKind = "compare" | "versus";
export type PanelSlot = { kind: PanelKind; at: number; span: number };
export type ChapterConfig = { id: string; act: number; beats: number[]; height: number; panels: PanelSlot[]; dark?: boolean };

const FIVE = [0.02, 0.2, 0.38, 0.56, 0.74];
const FOUR = [0.02, 0.26, 0.5, 0.72];

export const chapters: ChapterConfig[] = [
  { id: "intro", act: 0, beats: [0, 0.3, 0.62], height: 4.2, panels: [] },
  { id: "speed", act: 1, beats: FOUR, height: 4.6, panels: [] },
  { id: "nft", act: 1, beats: FOUR, height: 4.6, panels: [] },
  { id: "ftx", act: 1, beats: FOUR, height: 4.6, panels: [], dark: true },
  { id: "revival", act: 1, beats: FOUR, height: 4.6, panels: [] },
  { id: "memes", act: 1, beats: [0.01, 0.2, 0.39, 0.58, 0.76], height: 5.8, panels: [], dark: true },
  { id: "journey", act: 2, beats: FIVE, height: 6, panels: [] },
  { id: "today", act: 2, beats: FOUR, height: 4.8, panels: [] },
  { id: "team", act: 2, beats: [0.02, 0.5], height: 3.6, panels: [] },
  { id: "versus", act: 2, beats: [0.02], height: 4.4, panels: [{ kind: "versus", at: 0.3, span: 0.42 }] },
  { id: "strengths", act: 3, beats: FIVE, height: 5.6, panels: [] },
  { id: "weaknesses", act: 3, beats: FIVE, height: 5.6, panels: [], dark: true },
  { id: "balance", act: 3, beats: [0.02, 0.3, 0.6], height: 4.4, panels: [] },
  { id: "finale", act: 4, beats: [0.02, 0.3, 0.58], height: 4.8, panels: [] },
];

export const CHAPTER_COUNT = chapters.length;
export const FINALE = CHAPTER_COUNT - 1;

export function chapterIndex(id: string) {
  const i = chapters.findIndex((c) => c.id === id);
  if (i < 0) throw new Error(`unknown chapter ${id}`);
  return i;
}
