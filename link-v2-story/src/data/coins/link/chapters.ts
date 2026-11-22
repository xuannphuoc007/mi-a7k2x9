/**
 * "The Missing Link" — chapter layout. Each chapter is one link in a chain that forms
 * as you read. `beats` are fractions of the chapter's scroll where a new text card lands
 * and the stage moves to its next step.
 */
export type ChapterConfig = { id: string; act: number; color: string; beats: number[]; height: number };

const TWO = [0.0, 0.32];
const THREE = [0.0, 0.25, 0.5];
const FOUR = [0.0, 0.19, 0.38, 0.57];

/** palette: Chainlink blue at the core, state accents around it */
export const C = {
  blue: "#2a5ada",
  blueDeep: "#1a3a9c",
  blueSoft: "#e6edfc",
  sky: "#5b8def",
  ink: "#14202e",
  mute: "#5d6977",
  line: "#dfe5ec",
  glass: "#eef4fb",
  sign: "#12a37a", // signed / agreed
  guard: "#7b5cd6", // second guard / CCIP
  warn: "#e2463a", // alarm / curse / slash
  amber: "#f0a020", // money / fees
  gold: "#d8a31a",
  teal: "#13a0b5",
};

export const chapters: ChapterConfig[] = [
  { id: "missing", act: 0, color: C.blue, beats: THREE, height: 3.4 },
  { id: "nochain", act: 0, color: C.blueDeep, beats: THREE, height: 3.4 },
  { id: "ocr", act: 1, color: C.sign, beats: FOUR, height: 4.2 },
  { id: "pushpull", act: 1, color: C.sky, beats: THREE, height: 3.4 },
  { id: "proofs", act: 1, color: C.gold, beats: FOUR, height: 4.2 },
  { id: "ccip", act: 1, color: C.guard, beats: FOUR, height: 4.2 },
  { id: "alarm", act: 2, color: C.warn, beats: THREE, height: 3.4 },
  { id: "flows", act: 2, color: C.amber, beats: FOUR, height: 4.2 },
  { id: "journey", act: 3, color: C.teal, beats: FOUR, height: 4.2 },
  { id: "banks", act: 3, color: C.blue, beats: THREE, height: 3.4 },
  { id: "today", act: 4, color: C.blueDeep, beats: THREE, height: 3.4 },
  { id: "verdict", act: 4, color: C.ink, beats: TWO, height: 3.0 },
  { id: "finale", act: 5, color: C.blue, beats: TWO, height: 3.0 },
];

export const CHAPTER_COUNT = chapters.length;
export const FINALE = CHAPTER_COUNT - 1;

export function chapterIndex(id: string) {
  return chapters.findIndex((c) => c.id === id);
}

/** current chapter, beat and in-chapter progress for a story coordinate g */
export function beatAt(g: number) {
  const gg = Math.max(0, Math.min(CHAPTER_COUNT - 1e-6, g));
  const ch = Math.floor(gg);
  const p = gg - ch;
  const bs = chapters[ch].beats;
  let beat = 0;
  for (let i = 0; i < bs.length; i++) if (p >= bs[i] - 0.02) beat = i;
  return { ch, beat, p };
}
