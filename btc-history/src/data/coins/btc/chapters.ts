/**
 * Chapter structure for the Bitcoin history. Each chapter has a camera
 * "window" on the price chart (time range + log price range) and a playhead
 * target: how far through history the story has advanced by the end of it.
 */
export type PanelKind = "genesis" | "pizza" | "halving" | "drawdown" | "mining" | "events" | "dominoes" | "explorer" | null;

export type Window = { t0: number; t1: number; p0: number; p1: number };

export type ChapterConfig = {
  id: string;
  beats: number[];
  height: number;
  panel: PanelKind;
  panelAt?: number;
  panelSpan?: number;
  /** camera window while in this chapter */
  win: Window;
  /** playhead (decimal year) reached at the end of the chapter's main beat */
  play: number;
  /** overlay shown on the chart */
  overlay?: "supply" | "hashrate" | "dominoes" | "genesis";
};

export const chapters: ChapterConfig[] = [
  { id: "genesis", beats: [0, 0.26, 0.5], height: 4.6, panel: "genesis", panelAt: 0.72, panelSpan: 0.19, win: { t0: 2008.55, t1: 2009.75, p0: 0.001, p1: 1 }, play: 2009.08, overlay: "genesis" },
  { id: "pizza", beats: [0.02, 0.3, 0.86], height: 3.8, panel: "pizza", panelAt: 0.5, panelSpan: 0.33, win: { t0: 2009.9, t1: 2011.35, p0: 0.01, p1: 3 }, play: 2011.15 },
  { id: "rules", beats: [0.02, 0.28, 0.86], height: 4.0, panel: "halving", panelAt: 0.48, panelSpan: 0.35, win: { t0: 2009, t1: 2034, p0: 0.01, p1: 400000 }, play: 2011.2, overlay: "supply" },
  { id: "bubbles", beats: [0.02, 0.3, 0.84], height: 4.0, panel: "drawdown", panelAt: 0.5, panelSpan: 0.31, win: { t0: 2011.0, t1: 2015.4, p0: 0.8, p1: 2500 }, play: 2015.2 },
  { id: "mining", beats: [0.02, 0.28, 0.86], height: 4.0, panel: "mining", panelAt: 0.48, panelSpan: 0.35, win: { t0: 2009, t1: 2026.95, p0: 0.01, p1: 400000 }, play: 2016.6, overlay: "hashrate" },
  { id: "mania", beats: [0.02, 0.3, 0.84], height: 3.8, panel: "events", panelAt: 0.53, panelSpan: 0.28, win: { t0: 2016.3, t1: 2019.6, p0: 300, p1: 30000 }, play: 2019.45 },
  { id: "institutions", beats: [0.02, 0.3, 0.86], height: 4.2, panel: "events", panelAt: 0.52, panelSpan: 0.31, win: { t0: 2019.6, t1: 2022.05, p0: 3000, p1: 90000 }, play: 2021.97 },
  { id: "dominoes", beats: [0.02, 0.28, 0.86], height: 4.0, panel: "dominoes", panelAt: 0.46, panelSpan: 0.36, win: { t0: 2021.85, t1: 2023.25, p0: 12000, p1: 75000 }, play: 2023.1, overlay: "dominoes" },
  { id: "wallstreet", beats: [0.02, 0.3, 0.86], height: 4.2, panel: "events", panelAt: 0.52, panelSpan: 0.31, win: { t0: 2023.0, t1: 2026.0, p0: 15000, p1: 180000 }, play: 2025.85 },
  { id: "now", beats: [0.02, 0.24, 0.5], height: 5.4, panel: "explorer", panelAt: 0.68, panelSpan: 0.3, win: { t0: 2025.55, t1: 2027.0, p0: 45000, p1: 150000 }, play: 2026.872 },
];

export const CHAPTER_COUNT = chapters.length;
export const FINALE = CHAPTER_COUNT - 1;

/** full-history window used by the finale explorer */
export const FULL_WINDOW = { t0: 2010.4, t1: 2027.2, p0: 0.03, p1: 300000 };

/** the 2008 starting point of the playhead */
export const PLAY_START = 2008.62;
