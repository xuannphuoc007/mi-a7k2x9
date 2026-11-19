/**
 * One normalized timeline for the whole film.
 * Scroll position is measured in "screens" (u = scrollY / viewportHeight).
 * Every 3D transform is a pure function of u, so scrolling back replays everything in reverse.
 */
export type SceneId = "s01" | "s03" | "s05" | "end";
export const SECTIONS: { id: SceneId; screens: number }[] = [
  { id: "s01", screens: 4.6 },
  { id: "s03", screens: 6.4 },
  { id: "s05", screens: 6.4 },
  { id: "end", screens: 2.4 },
];

export const START: Record<SceneId, number> = (() => {
  const o = {} as Record<SceneId, number>;
  let acc = 0;
  for (const s of SECTIONS) {
    o[s.id] = acc;
    acc += s.screens;
  }
  return o;
})();
export const LEN: Record<SceneId, number> = Object.fromEntries(SECTIONS.map((s) => [s.id, s.screens])) as Record<SceneId, number>;
export const TOTAL = SECTIONS.reduce((a, s) => a + s.screens, 0);

/** Local progress 0..1 of a scene for a global u (not clamped outside → use clamp). */
export const local = (id: SceneId, u: number) => clamp((u - START[id]) / LEN[id]);

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
/** 0..1 ramp of x between a and b */
export const ramp = (x: number, a: number, b: number) => clamp((x - a) / (b - a));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
/** rise in [a,b], fall in [c,d] */
export const band = (x: number, a: number, b: number, c: number, d: number) => smooth(ramp(x, a, b)) * (1 - smooth(ramp(x, c, d)));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Live scroll state shared between DOM and the render loop (no React state → no re-render per frame). */
export const scrollState = { u: 0, target: 0, vh: 800 };
