"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/** Smoothly tween a number toward `target` (used for UI-driven transitions). */
export function useTween(target: number, duration = 0.6) {
  const [v, setV] = useState(target);
  const obj = useRef({ v: target });
  useEffect(() => {
    const tw = gsap.to(obj.current, {
      v: target,
      duration,
      ease: "power3.inOut",
      onUpdate: () => setV(obj.current.v),
    });
    return () => {
      tw.kill();
    };
  }, [target, duration]);
  return v;
}

/** rAF clock in seconds while `on` is true (paused when off or reduced motion). */
export function useClock(on: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      setT((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [on]);
  return t;
}
