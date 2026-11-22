/**
 * "The Missing Link" — chapter layout. Each chapter is one link in a chain that forms
 * as you read. `beats` are fractions of the chapter's scroll where a new text card lands
 * and the stage moves to its next step.
 */
export type ChapterConfig = { id: string; act: number; color: string; beats: number[]; height: number };

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
  { id: "pawn", act: 0, color: C.blue, beats: THREE, height: 3.4 },
  { id: "messenger", act: 0, color: C.amber, beats: THREE, height: 3.4 },
  { id: "nine", act: 1, color: C.sign, beats: FOUR, height: 4.2 },
  { id: "board", act: 1, color: C.sky, beats: THREE, height: 3.4 },
  { id: "noshop", act: 1, color: C.blueDeep, beats: THREE, height: 3.4 },
  { id: "safe", act: 1, color: C.gold, beats: THREE, height: 3.4 },
  { id: "border", act: 1, color: C.guard, beats: THREE, height: 3.4 },
  { id: "deposit", act: 2, color: C.warn, beats: THREE, height: 3.4 },
  { id: "wages", act: 2, color: C.amber, beats: THREE, height: 3.4 },
  { id: "story", act: 3, color: C.teal, beats: FOUR, height: 4.2 },
  { id: "verdict", act: 4, color: C.blue, beats: THREE, height: 3.4 },
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
