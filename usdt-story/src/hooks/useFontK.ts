"use client";
import { stageStore } from "@/lib/simStores";
import { useStore } from "@/lib/store";

/** multiplier for SVG text sizes so labels stay ≥ ~9.5px on small stages */
export function useFontK() {
  const px = useStore(stageStore, (s) => s.px);
  const perUnit = px / 1000;
  return Math.max(1, Math.min(2.6, 9.5 / (10.5 * perUnit)));
}
