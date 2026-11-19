"use client";
import { create } from "zustand";

/** Shared presentation state. Toggling X-RAY never touches scroll or the 3D scene graph. */
type S = {
  xray: boolean;
  setXray: (v: boolean) => void;
  reduced: boolean;
  setReduced: (v: boolean) => void;
  /** system-map focus (null = overview) */
  focus: string | null;
  setFocus: (f: string | null) => void;
};
export const useView = create<S>((set) => ({
  focus: null,
  setFocus: (focus) => set({ focus }),
  xray: false,
  setXray: (xray) => set({ xray }),
  reduced: false,
  setReduced: (reduced) => set({ reduced }),
}));
