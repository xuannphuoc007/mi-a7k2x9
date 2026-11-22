"use client";
import { useFontK } from "./useFontK";

/** font scaling helpers shared by scenes */
export function useK() {
  const k = useFontK();
  const mobile = k >= 1.5;
  const fs = (s: number) => s * k;
  const big = (s: number, cap: number) => Math.min(s * k, cap);
  return { k, mobile, fs, big };
}

/** cross-fade helpers for stages inside one scene */
export const fadeIn = (x: number) => Math.max(0, Math.min(1, x * 1.6 - 0.6));
export const fadeOut = (x: number) => 1 - Math.max(0, Math.min(1, x * 2.5));
