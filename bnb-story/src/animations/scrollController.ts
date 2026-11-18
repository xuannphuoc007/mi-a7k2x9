"use client";
/**
 * Global scroll animation engine.
 *
 * One ScrollTrigger watches the whole story. Scroll position is converted into a
 * single normalised story coordinate `g` (chapter index + local progress, 0…N).
 * `g` is smoothed with gsap.quickTo (scrub-like inertia) and every chapter's own
 * paused GSAP timeline is scrubbed from it via `timeline.progress()`.
 *
 * Because every visual is a pure function of `g`, scrolling backwards reverses
 * every transformation exactly, chapter jumps render intermediate states in
 * order, and nothing restarts.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { createStore, clamp } from "@/lib/store";
import { CHAPTER_COUNT } from "@/data/coins/bnb/chapters";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export type SceneRegistration = {
  start: number; // in g units
  end: number;
  tl: gsap.core.Timeline;
};

type Range = { top: number; len: number };

export const engine = {
  /** smoothed story coordinate */
  g: 0,
  /** raw (unsmoothed) story coordinate */
  target: 0,
  count: CHAPTER_COUNT,
  sections: [] as (HTMLElement | null)[],
  ranges: [] as Range[],
  scenes: new Set<SceneRegistration>(),
  listeners: new Set<(g: number) => void>(),
  reduced: false,
  lastApplied: -1,
};

export const ui = createStore({
  chapter: 0,
  interacted: false,
  ready: false,
});

export function registerSection(i: number, el: HTMLElement | null) {
  engine.sections[i] = el;
}

function measure() {
  const vh = window.innerHeight;
  const y = window.scrollY;
  const tops = engine.sections.map((el) => (el ? el.getBoundingClientRect().top + y : 0));
  engine.ranges = engine.sections.map((el, i) => {
    const top = tops[i];
    if (i < engine.sections.length - 1) return { top, len: Math.max(1, tops[i + 1] - top) };
    const h = el ? el.offsetHeight : vh;
    return { top, len: Math.max(1, h - vh) };
  });
}

export function scrollToG(g: number): number {
  const i = Math.max(0, Math.min(engine.count - 1, Math.floor(g)));
  const r = engine.ranges[i];
  if (!r) return 0;
  return r.top + (g - i) * r.len;
}

function scrollToGValue(y: number): number {
  const rs = engine.ranges;
  if (!rs.length) return 0;
  if (y <= rs[0].top) return 0;
  for (let i = 0; i < rs.length; i++) {
    const r = rs[i];
    if (y < r.top + r.len || i === rs.length - 1) {
      return Math.min(engine.count, i + clamp((y - r.top) / r.len));
    }
  }
  return engine.count;
}

export function registerScene(reg: SceneRegistration) {
  engine.scenes.add(reg);
  applyScene(reg, engine.g);
  return () => {
    engine.scenes.delete(reg);
  };
}

function applyScene(reg: SceneRegistration, g: number) {
  const p = clamp((g - reg.start) / (reg.end - reg.start));
  if (reg.tl.progress() !== p) reg.tl.progress(p);
}

export function subscribeG(fn: (g: number) => void) {
  engine.listeners.add(fn);
  fn(engine.g);
  return () => {
    engine.listeners.delete(fn);
  };
}

function tick() {
  const g = engine.g;
  if (Math.abs(g - engine.lastApplied) < 1e-5) return;
  engine.lastApplied = g;
  engine.scenes.forEach((s) => applyScene(s, g));
  engine.listeners.forEach((l) => l(g));
  const ch = Math.max(0, Math.min(engine.count - 1, Math.floor(g + 0.02)));
  ui.set({ chapter: ch });
  if (g > 0.06 && !ui.get().interacted) ui.set({ interacted: true });
}

/** Boot the engine. Returns a cleanup function. */
export function initScrollEngine(story: HTMLElement, reduced: boolean) {
  engine.reduced = reduced;
  const setG = gsap.quickTo(engine, "g", { duration: reduced ? 0.001 : 0.75, ease: "power3.out" });

  const update = () => {
    engine.target = scrollToGValue(window.scrollY);
    if (engine.reduced) engine.g = engine.target;
    else setG(engine.target);
  };

  const st = ScrollTrigger.create({
    trigger: story,
    start: "top top",
    end: "bottom bottom",
    onUpdate: update,
    onRefresh: () => {
      measure();
      update();
    },
  });

  measure();
  engine.target = scrollToGValue(window.scrollY);
  engine.g = engine.target; // no animated catch-up on first paint
  engine.lastApplied = -1;
  gsap.ticker.add(tick);
  tick();
  ui.set({ ready: true });

  const ro = new ResizeObserver(() => ScrollTrigger.refresh());
  ro.observe(story);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => {
    st.kill();
    ro.disconnect();
    gsap.ticker.remove(tick);
  };
}

export function goToChapter(i: number, local = 0.0) {
  const y = scrollToG(i + local) + 2;
  ui.set({ interacted: true });
  gsap.to(window, {
    scrollTo: { y, autoKill: true },
    duration: engine.reduced ? 0 : Math.min(2.2, 0.8 + Math.abs(i - engine.g) * 0.14),
    ease: "power2.inOut",
  });
}
