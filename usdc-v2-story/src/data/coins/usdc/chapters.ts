/**
 * Structural chapter config for the USDC story (six acts):
 * Intro → How the vault works → Eight years → USDC today → Strengths & weaknesses → Conclusion.
 * Every scene plays itself as the reader scrolls — no controls needed.
 */
export type PanelKind = "compare" | "versus";
export type PanelSlot = { kind: PanelKind; at: number; span: number };
export type ChapterConfig = { id: string; act: number; beats: number[]; height: number; panels: PanelSlot[]; dark?: boolean };

const FIVE = [0.02, 0.2, 0.38, 0.56, 0.74];
const FOUR = [0.02, 0.26, 0.5, 0.72];

export const chapters: ChapterConfig[] = [
  { id: "intro", act: 0, beats: [0, 0.3, 0.62], height: 4.2, panels: [] },
  { id: "mint", act: 1, beats: FOUR, height: 4.8, panels: [] },
  { id: "vault", act: 1, beats: FIVE, height: 5.6, panels: [] },
  { id: "profit", act: 1, beats: FOUR, height: 4.6, panels: [] },
  { id: "birth", act: 2, beats: FOUR, height: 4.4, panels: [] },
  { id: "depeg", act: 2, beats: FOUR, height: 4.6, panels: [], dark: true },
  { id: "growth", act: 2, beats: FIVE, height: 5.6, panels: [] },
  { id: "rules", act: 3, beats: [0.02, 0.22, 0.42], height: 5.4, panels: [{ kind: "versus", at: 0.6, span: 0.3 }] },
  { id: "strengths", act: 4, beats: FIVE, height: 5.6, panels: [] },
  { id: "weaknesses", act: 4, beats: FIVE, height: 5.6, panels: [], dark: true },
  { id: "finale", act: 5, beats: [0.02, 0.3, 0.58], height: 4.8, panels: [] },
];

export const CHAPTER_COUNT = chapters.length;
export const FINALE = CHAPTER_COUNT - 1;

export function chapterIndex(id: string) {
  const i = chapters.findIndex((c) => c.id === id);
  if (i < 0) throw new Error(`unknown chapter ${id}`);
  return i;
}
