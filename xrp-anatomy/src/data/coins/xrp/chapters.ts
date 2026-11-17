/**
 * Structural chapter config (language-independent).
 * `beats` are chapter-local scroll positions (0…1) at which each text beat
 * sits in the reading column; they are synchronised with the scene timelines.
 * `height` is the chapter's scroll length in viewport heights.
 */
export type PanelKind = "send" | "route" | "liquidity" | "dex" | "risk" | "explorer" | null;

export type ChapterConfig = {
  id: string;
  beats: number[];
  height: number;
  panel: PanelKind;
  /** chapter-local position of the interactive panel (sticky while in view) */
  panelAt?: number;
  /** how long (0..1 of chapter) the panel stays sticky */
  panelSpan?: number;
  /** dark technical scene */
  dark?: boolean;
};

export const chapters: ChapterConfig[] = [
  { id: "coin", beats: [0, 0.24, 0.5, 0.78], height: 4.2, panel: null },
  { id: "ledger", beats: [0.02, 0.3, 0.56, 0.8], height: 3.8, panel: null },
  { id: "consensus", beats: [0.02, 0.27, 0.52, 0.78], height: 4.0, panel: null, dark: true },
  { id: "send", beats: [0.02, 0.78], height: 3.6, panel: "send", panelAt: 0.2, panelSpan: 0.52 },
  { id: "crossborder", beats: [0.02, 0.2, 0.84], height: 4.2, panel: "route", panelAt: 0.4, panelSpan: 0.4 },
  { id: "bridge", beats: [0.02, 0.28, 0.86], height: 4.0, panel: "liquidity", panelAt: 0.46, panelSpan: 0.36 },
  { id: "dex", beats: [0.02, 0.24, 0.86], height: 4.0, panel: "dex", panelAt: 0.44, panelSpan: 0.38 },
  { id: "supply", beats: [0.02, 0.26, 0.5, 0.76], height: 4.0, panel: null },
  { id: "risk", beats: [0.02, 0.84], height: 3.8, panel: "risk", panelAt: 0.22, panelSpan: 0.58 },
  { id: "pieces", beats: [0.02, 0.33, 0.6], height: 5.0, panel: "explorer", panelAt: 0.84, panelSpan: 0.16 },
];

export const CHAPTER_COUNT = chapters.length;
