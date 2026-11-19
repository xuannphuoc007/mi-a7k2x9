"use client";
import { useEffect, useState } from "react";
import { scrollState, local, type SceneId } from "@/lib/timeline";

/** Scene-local progress for HTML overlays, quantised so React only re-renders on real change. */
export function useLocal(id: SceneId, step = 0.004) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const t = Math.round(local(id, scrollState.u) / step) * step;
      if (t !== last) {
        last = t;
        setV(t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [id, step]);
  return v;
}

export function useGlobalU(step = 0.01) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const t = Math.round(scrollState.u / step) * step;
      if (t !== last) {
        last = t;
        setV(t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);
  return v;
}
