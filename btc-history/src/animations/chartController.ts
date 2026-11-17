"use client";
/**
 * The history chart's "camera". Every visual on the stage — SVG chart, HTML
 * captions, 3D coin — reads one `frame` computed from the story coordinate g
 * plus UI state (focus, scale, view, cursor). Scroll-driven parts are pure
 * functions of g, so scrolling back reverses everything exactly; UI-driven
 * parts (focus, scale…) are tweened mixes layered on top.
 */
import gsap from "gsap";
import { engine, ui } from "@/animations/scrollController";
import { chapters, FINALE, FULL_WINDOW, PLAY_START, type Window } from "@/data/coins/btc/chapters";
import { events, type BtcEvent, type Category } from "@/data/coins/btc/events";
import { clamp, createStore, lerp, range, smooth } from "@/lib/store";
import { ddAt, maxIn, minIn, priceAt, FIRST_T, LAST_T } from "@/lib/btc";

export const X0 = 40;
export const X1 = 960;
export const YT = 150;
export const YB = 800;
export const BASE_Y = YB - 34; // events before any market price sit on this line

export const chart = createStore({
  focus: null as Window | null,
  selected: null as string | null,
  cursor: null as number | null,
  /** a date chosen in a panel (pizza / halving sliders) */
  probe: null as number | null,
  scale: "log" as "log" | "linear",
  view: "price" as "price" | "dd",
  filters: { tech: true, market: true, crisis: true, adoption: true, policy: true } as Record<Category, boolean>,
  invest: { amount: 1000, buy: 2015.0, sell: LAST_T },
  /** stage size in CSS px (for converting px to SVG units) */
  size: 800,
});

/** tweened UI mixes */
const anim = { focusMix: 0, scaleMix: 0, ddMix: 0, domino: 0 };
let lastFocus: Window = chapters[0].win;
let version = 0;
const bump = () => {
  version++;
};

export const lerpWin = (a: Window, b: Window, t: number): Window => ({
  t0: lerp(a.t0, b.t0, t),
  t1: lerp(a.t1, b.t1, t),
  p0: Math.exp(lerp(Math.log(a.p0), Math.log(b.p0), t)),
  p1: Math.exp(lerp(Math.log(a.p1), Math.log(b.p1), t)),
});

/** per-chapter visibility envelope: fades in just before the chapter, out at its end */
export function chapterVis(g: number, i: number, end = 1.04) {
  return smooth(range(g, i - 0.18, i + 0.04)) * (1 - smooth(range(g, i + 0.88, i + end)));
}

export function baseWindow(g: number): Window {
  const n = chapters.length;
  const i = Math.max(0, Math.min(n - 1, Math.floor(g)));
  const u = g - i;
  let w = chapters[i].win;
  if (i === FINALE) w = lerpWin(w, FULL_WINDOW, smooth(range(u, 0.55, 0.7)));
  if (i < n - 1 && u > 0.84) w = lerpWin(w, chapters[i + 1].win, smooth(range(u, 0.84, 1)));
  return w;
}

export function playhead(g: number) {
  const n = chapters.length;
  const i = Math.max(0, Math.min(n - 1, Math.floor(g)));
  const u = g - i;
  const start = i === 0 ? PLAY_START : chapters[i - 1].play;
  const end = chapters[i].play;
  const endU = i === FINALE ? 0.5 : 0.85;
  return lerp(start, end, range(u, 0.05, endU));
}

/** the story coordinate g at which the playhead crosses decimal year t (Infinity if never) */
const crossCache = new Map<number, number>();
export function crossG(t: number): number {
  const hit = crossCache.get(t);
  if (hit !== undefined) return hit;
  let out = Infinity;
  for (let i = 0; i < chapters.length; i++) {
    const start = i === 0 ? PLAY_START : chapters[i - 1].play;
    const end = chapters[i].play;
    const endU = i === FINALE ? 0.5 : 0.85;
    if (end > start && t >= start && t <= end) {
      out = i + 0.05 + ((t - start) / (end - start)) * (endU - 0.05);
      break;
    }
  }
  crossCache.set(t, out);
  return out;
}
/** 0 → 1 progress of the "just crossed" effect for an event at t */
export const burstQ = (g: number, t: number, len = 0.14) => (g - crossG(t)) / len;

export type Frame = {
  version: number;
  g: number;
  ch: number;
  local: number;
  win: Window;
  linMax: number;
  T: number;
  clipT: number;
  scaleMix: number;
  ddMix: number;
  focusMix: number;
  domino: number;
  hero: number;
  vis: number[];
  shake: { x: number; y: number };
  /** px → SVG units */
  u: number;
  dot: { x: number; y: number; price: number | null; t: number };
  coin: { x: number; y: number; scale: number; gold: number; red: number; born: number };
  xOf: (t: number) => number;
  yOf: (t: number) => number;
  yPrice: (p: number) => number;
};

export const frame = { current: null as Frame | null };
const listeners = new Set<(f: Frame) => void>();
export function subscribeFrame(fn: (f: Frame) => void) {
  listeners.add(fn);
  if (frame.current) fn(frame.current);
  return () => {
    listeners.delete(fn);
  };
}

export function visibleEvent(e: BtcEvent, T: number, ch: number) {
  if (e.future) return ch === 2;
  return e.t <= T + 0.0005;
}

function compute(): Frame {
  const g = engine.g;
  const n = chapters.length;
  const ch = Math.max(0, Math.min(n - 1, Math.floor(g + 0.02)));
  const local = g - Math.floor(g);
  const s = chart.get();

  const base = baseWindow(g);
  const win = anim.focusMix > 0 ? lerpWin(base, lastFocus, smooth(anim.focusMix)) : base;
  const linMax = Math.max(1, maxIn(win.t0, win.t1) * 1.12);
  const T = playhead(g);
  const reveal = Math.max(lastFocus.t1, s.probe ?? 0);
  const clipT = anim.focusMix > 0 || s.probe ? lerp(T, Math.max(T, reveal), Math.max(smooth(anim.focusMix), s.probe ? 1 : 0)) : T;

  const sx = (X1 - X0) / (win.t1 - win.t0);
  const l0 = Math.log10(win.p0);
  const l1 = Math.log10(win.p1);
  const xOf = (t: number) => X0 + (t - win.t0) * sx;
  const yLog = (p: number) => YB - ((Math.log10(Math.max(p, 1e-9)) - l0) / (l1 - l0)) * (YB - YT);
  const yLin = (p: number) => YB - (p / linMax) * (YB - YT);
  const yPrice = (p: number) => lerp(yLog(p), yLin(p), anim.scaleMix);
  const yOf = (t: number) => {
    const p = priceAt(t);
    if (p === null) return BASE_Y;
    const yp = yPrice(p);
    if (anim.ddMix <= 0) return yp;
    return lerp(yp, YT + -ddAt(t) * (YB - YT), anim.ddMix);
  };

  const vis = chapters.map((_, i) => chapterVis(g, i, i === FINALE ? 1.5 : 1.04));
  const hero = 1 - smooth(range(g, 0.06, 0.22));

  // scroll-tied shake when the playhead has just crossed a crash
  let shake = 0;
  let gold = 0;
  let red = 0;
  for (const e of events) {
    if (e.future) continue;
    const q = burstQ(g, e.t);
    if (q < 0 || q > 1) continue;
    if (e.kind === "crash") {
      shake = Math.max(shake, 1 - q);
      red = Math.max(red, 1 - q);
    }
    if (e.kind === "ath") gold = Math.max(gold, 1 - q);
  }
  const sh = engine.reduced ? 0 : shake * shake;
  const shakeV = { x: Math.sin(T * 9000) * 7 * sh, y: Math.cos(T * 7000) * 5 * sh };

  const dotT = Math.min(s.cursor ?? T, LAST_T);
  const dotPrice = priceAt(dotT);
  const dot = { t: dotT, x: xOf(dotT), y: yOf(dotT), price: dotPrice };

  // coin: hero centre → born from block 0 → riding the playhead / crosshair
  const born = smooth(range(T, 2009.0, 2009.04));
  const onChart = dotPrice !== null ? 1 : born;
  const smallX = clamp(dot.x, X0, X1);
  const smallY = clamp(dotPrice !== null ? dot.y : BASE_Y - 78, YT, YB);
  const coin = {
    x: lerp(smallX, 500, hero),
    y: lerp(smallY, 470, hero),
    scale: onChart * (s.cursor !== null ? 1.15 : 1),
    gold: Math.max(gold, hero * 0.2),
    red,
    born: Math.max(onChart, hero),
  };

  const sizePx = s.size || 800;
  return {
    version,
    g,
    ch,
    local,
    win,
    linMax,
    T,
    clipT: Math.max(clipT, s.cursor ?? 0),
    scaleMix: anim.scaleMix,
    ddMix: anim.ddMix,
    focusMix: anim.focusMix,
    domino: anim.domino,
    hero,
    vis,
    shake: shakeV,
    u: 1000 / sizePx,
    dot,
    coin,
    xOf,
    yOf,
    yPrice,
  };
}

let lastKey = "";
function tick() {
  const s = chart.get();
  const key = `${engine.g.toFixed(5)}|${version}|${anim.focusMix.toFixed(4)}|${anim.scaleMix.toFixed(4)}|${anim.ddMix.toFixed(4)}|${anim.domino.toFixed(4)}|${s.cursor}|${s.probe}|${s.size}`;
  if (key === lastKey && frame.current) return;
  lastKey = key;
  const f = compute();
  frame.current = f;
  listeners.forEach((l) => l(f));
}

let booted = false;
export function initChart() {
  if (booted) return () => {};
  booted = true;
  let prev = chart.get();
  const offStore = chart.subscribe(() => {
    const s = chart.get();
    const d = engine.reduced ? 0.001 : 0.9;
    if (s.focus !== prev.focus) {
      if (s.focus && prev.focus && anim.focusMix > 0.01) {
        // re-aim from the current focus to the new one
        const from = { ...lastFocus };
        const target = s.focus;
        gsap.killTweensOf(focusTw);
        focusTw.k = 0;
        gsap.to(focusTw, { k: 1, duration: d, ease: "power3.inOut", onUpdate: () => { lastFocus = lerpWin(from, target, focusTw.k); bump(); } });
        gsap.to(anim, { focusMix: 1, duration: d, ease: "power3.inOut", onUpdate: bump, overwrite: "auto" });
      } else if (s.focus) {
        gsap.killTweensOf(focusTw);
        lastFocus = s.focus;
        gsap.to(anim, { focusMix: 1, duration: d, ease: "power3.inOut", onUpdate: bump, overwrite: "auto" });
      } else {
        gsap.to(anim, { focusMix: 0, duration: d, ease: "power3.inOut", onUpdate: bump, overwrite: "auto" });
      }
    }
    if (s.scale !== prev.scale) gsap.to(anim, { scaleMix: s.scale === "linear" ? 1 : 0, duration: d, ease: "power3.inOut", onUpdate: bump, overwrite: "auto" });
    if (s.view !== prev.view) gsap.to(anim, { ddMix: s.view === "dd" ? 1 : 0, duration: d, ease: "power3.inOut", onUpdate: bump, overwrite: "auto" });
    prev = s;
    bump();
  });
  // leaving a chapter resets panel-driven camera changes
  let ch = ui.get().chapter;
  const offUi = ui.subscribe(() => {
    const c = ui.get().chapter;
    if (c === ch) return;
    ch = c;
    chart.set({ focus: null, selected: null, probe: null, cursor: null, view: "price", scale: "log" });
    gsap.to(anim, { domino: 0, duration: 0.4 });
  });
  gsap.ticker.add(tick);
  tick();
  return () => {
    offStore();
    offUi();
    gsap.ticker.remove(tick);
    booted = false;
  };
}
const focusTw = { k: 0 };

/* ───────────── panel actions ───────────── */
export function pushDominoes() {
  gsap.to(anim, { domino: 6.2, duration: engine.reduced ? 0.01 : 3.4, ease: "power1.in", onUpdate: bump, overwrite: true });
}
export function resetDominoes() {
  gsap.to(anim, { domino: 0, duration: engine.reduced ? 0.01 : 0.6, ease: "power2.out", onUpdate: bump, overwrite: true });
}

/** a window that frames [t0, t1] with some headroom around the price range */
export function frameRange(t0: number, t1: number, pad = 0.08): Window {
  const span = t1 - t0;
  const a = Math.max(FIRST_T, t0);
  const lo = minIn(a, t1);
  const hi = maxIn(a, t1);
  return { t0: t0 - span * pad, t1: t1 + span * pad, p0: Math.max(0.01, lo / 2.2), p1: hi * 2.2 };
}

export function focusEvent(e: BtcEvent | null) {
  if (!e) {
    chart.set({ selected: null, focus: null });
    return;
  }
  if (e.t < FIRST_T || e.future) {
    chart.set({ selected: e.id, focus: null });
    return;
  }
  chart.set({ selected: e.id, focus: frameRange(e.t - 0.45, e.t + 0.45) });
}
