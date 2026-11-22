/**
 * "The Ship of Light" — chapter layout. `beats` are fractions of the chapter's scroll
 * where a new text card lands and the stage moves to its next step.
 */
export type ChapterConfig = { id: string; act: number; color: string; beats: number[]; height: number };

const THREE = [0.0, 0.25, 0.5];
const FOUR = [0.0, 0.19, 0.38, 0.57];

/** palette: Solana purple → green, with a few state accents */
export const C = {
  purple: "#9945ff",
  violet: "#6b2bd9",
  lilac: "#efe6ff",
  green: "#14f195",
  mint: "#0a9e6e", // readable green for text
  cyan: "#18a8d8",
  ink: "#1b1530",
  mute: "#6a6580",
  line: "#e6e1f2",
  warn: "#e0475b",
  amber: "#f0a020",
  fire: "#ff6a3d",
};

export const chapters: ChapterConfig[] = [
  { id: "launch", act: 0, color: C.purple, beats: THREE, height: 3.4 },
  { id: "rota", act: 1, color: C.violet, beats: THREE, height: 3.4 },
  { id: "direct", act: 1, color: C.cyan, beats: THREE, height: 3.4 },
  { id: "clock", act: 1, color: C.purple, beats: THREE, height: 3.4 },
  { id: "shreds", act: 1, color: C.mint, beats: THREE, height: 3.4 },
  { id: "lanes", act: 1, color: C.cyan, beats: THREE, height: 3.4 },
  { id: "fees", act: 1, color: C.amber, beats: THREE, height: 3.4 },
  { id: "stops", act: 2, color: C.warn, beats: THREE, height: 3.4 },
  { id: "engine", act: 2, color: C.violet, beats: THREE, height: 3.4 },
  { id: "faster", act: 3, color: C.mint, beats: THREE, height: 3.4 },
  { id: "token", act: 4, color: C.purple, beats: FOUR, height: 4.2 },
  { id: "verdict", act: 4, color: C.violet, beats: THREE, height: 3.4 },
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
