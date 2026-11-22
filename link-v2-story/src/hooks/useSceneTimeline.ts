"use client";
import { useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { registerScene } from "@/animations/scrollController";

export type SceneBuilder<V> = (
  tl: gsap.core.Timeline,
  v: V,
  /** convert chapter-local progress (−pre … 1+post) to a timeline position */
  at: (local: number) => number,
) => void;

/**
 * A chapter's scroll-scrubbed timeline. GSAP tweens a plain value object
 * (`v`) — the scene renders deterministically from those values, so the
 * timeline is perfectly reversible and never fights React for DOM ownership.
 */
export function useSceneTimeline<V extends Record<string, number>>(
  index: number,
  initial: V,
  build: SceneBuilder<V>,
  opts: { pre?: number; post?: number } = {},
): V {
  const pre = opts.pre ?? 0.22;
  const post = opts.post ?? 0.22;
  const [state, setState] = useState<V>(initial);

  useLayoutEffect(() => {
    const v = { ...initial } as V;
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" },
      onUpdate: () => setState({ ...v }),
    });
    const at = (local: number) => local + pre;
    build(tl, v, at);
    tl.set({}, {}, 1 + pre + post); // pin total duration
    const off = registerScene({ start: index - pre, end: index + 1 + post, tl });
    return () => {
      off();
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return state;
}

/**
 * Like useSceneTimeline, but the scene lives in a segment [s, e] of its
 * chapter: the builder writes positions and durations in segment-local units
 * (0 → 1 across the segment), exactly as a whole-chapter scene would.
 */
export function useSegmentTimeline<V extends Record<string, number>>(
  index: number,
  s: number,
  e: number,
  initial: V,
  build: SceneBuilder<V>,
): V {
  return useSceneTimeline(index, initial, (tl, v, at) => {
    const pad = 0.2;
    const sub = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    build(sub, v, (p) => p + pad);
    sub.timeScale(1 / (e - s));
    tl.add(sub, at(s) - pad * (e - s));
  });
}
