/**
 * The LINK story as a metro line: every chapter is a station, every station has
 * its own line colour. The train dwells at the station for most of a chapter and
 * runs to the next one at the end (see TrainScene).
 */
export type PanelKind = "compare" | "versus";
export type PanelSlot = { kind: PanelKind; at: number; span: number };
export type ChapterConfig = { id: string; act: number; line: string; beats: number[]; height: number; panels: PanelSlot[] };

const FIVE = [0.0, 0.15, 0.3, 0.45, 0.6];
const FOUR = [0.0, 0.19, 0.38, 0.57];
const THREE = [0.0, 0.25, 0.5];

/** line colours — a whole palette, not one brand colour */
export const LINES = {
  blue: "#2a5ada",
  orange: "#f08a24",
  magenta: "#e2457f",
  purple: "#7b5cd6",
  green: "#1fa774",
  yellow: "#e8b417",
  red: "#e0463a",
  teal: "#13a0b5",
  navy: "#24305e",
};

export const chapters: ChapterConfig[] = [
  { id: "oracle", act: 0, line: LINES.blue, beats: THREE, height: 3.4, panels: [] },
  { id: "feeds", act: 1, line: LINES.orange, beats: FOUR, height: 4.2, panels: [] },
  { id: "token", act: 1, line: LINES.magenta, beats: FOUR, height: 4.2, panels: [] },
  { id: "ccip", act: 1, line: LINES.purple, beats: THREE, height: 3.6, panels: [] },
  { id: "banks", act: 1, line: LINES.green, beats: FOUR, height: 4.2, panels: [] },
  { id: "history", act: 2, line: LINES.yellow, beats: FOUR, height: 4.2, panels: [] },
  { id: "luna", act: 2, line: LINES.red, beats: THREE, height: 3.6, panels: [] },
  { id: "today", act: 3, line: LINES.teal, beats: FIVE, height: 5.0, panels: [] },
  { id: "strengths", act: 4, line: LINES.blue, beats: FIVE, height: 5.0, panels: [] },
  { id: "weaknesses", act: 4, line: LINES.red, beats: FIVE, height: 5.0, panels: [] },
  { id: "finale", act: 5, line: LINES.navy, beats: THREE, height: 3.8, panels: [] },
];

export const CHAPTER_COUNT = chapters.length;
export const FINALE = CHAPTER_COUNT - 1;
/** fraction of a chapter after which the train leaves for the next station */
export const DEPART = 0.8;

export function chapterIndex(id: string) {
  const i = chapters.findIndex((c) => c.id === id);
  if (i < 0) throw new Error(`unknown chapter ${id}`);
  return i;
}

/** which beat is showing at story coordinate g */
export function beatAt(g: number) {
  const ch = Math.max(0, Math.min(CHAPTER_COUNT - 1, Math.floor(g)));
  const p = g - ch;
  const beats = chapters[ch].beats;
  let b = 0;
  for (let i = 0; i < beats.length; i++) if (p >= beats[i] - 0.001) b = i;
  return { ch, beat: b, p };
}
