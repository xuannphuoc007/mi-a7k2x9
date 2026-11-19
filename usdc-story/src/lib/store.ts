"use client";
import { create } from "zustand";

/** Shared presentation state. Toggling X-RAY never touches scroll or the 3D scene graph. */
type S = { xray: boolean; setXray: (v: boolean) => void; reduced: boolean; setReduced: (v: boolean) => void };
export const useView = create<S>((set) => ({
  xray: false,
  setXray: (xray) => set({ xray }),
  reduced: false,
  setReduced: (reduced) => set({ reduced }),
}));
