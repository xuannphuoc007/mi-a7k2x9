/**
 * Where the train is, as a pure function of the story coordinate g.
 * Each chapter is a station. The train dwells at station i for the first DEPART
 * of chapter i, then runs to station i+1 and arrives exactly as chapter i+1 begins.
 * The train itself never moves in the scene: the world slides by -S.
 */
import { CHAPTER_COUNT, DEPART } from "@/data/coins/link/chapters";

/** per-frame shared state written by the scene driver */
export const live = { g: 0, S: 0, v: 0 };

/** distance between stations, metres */
export const SPACING = 320;
/** wheel radius, metres */
export const WHEEL_R = 0.42;

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/** run fraction between stations, 0 while dwelling */
export function runT(g: number) {
  const ch = Math.floor(g);
  if (ch >= CHAPTER_COUNT - 1) return 0;
  const p = g - ch;
  return p <= DEPART ? 0 : (p - DEPART) / (1 - DEPART);
}

/** distance travelled along the line, metres */
export function distance(g: number) {
  const gg = Math.max(0, Math.min(CHAPTER_COUNT - 1, g));
  const ch = Math.floor(gg);
  const t = runT(gg);
  // a smooth accelerate / cruise / brake profile
  return (ch + easeInOutSine(t)) * SPACING;
}

/** 0 at rest, 1 at cruising speed (used for sway, blur hints, wheel sound of the eye) */
export function speed01(g: number) {
  const t = runT(g);
  return Math.sin(Math.PI * t);
}
