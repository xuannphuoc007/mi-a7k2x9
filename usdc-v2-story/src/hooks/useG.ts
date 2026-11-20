"use client";
import { useEffect, useState } from "react";
import { subscribeG } from "@/animations/scrollController";

/** Subscribe to the story coordinate, quantised to avoid needless renders. */
export function useG(step = 0.002) {
  const [g, setG] = useState(0);
  useEffect(() => subscribeG((v) => setG((p) => (Math.abs(p - v) >= step ? Math.round(v / step) * step : p))), [step]);
  return g;
}
