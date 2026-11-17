"use client";
import { useEffect, useState } from "react";
import { subscribeFrame, frame, type Frame } from "@/animations/chartController";

/** Re-render on every new chart frame. */
export function useStageFrame(): Frame | null {
  const [f, setF] = useState<Frame | null>(frame.current);
  useEffect(() => subscribeFrame(setF), []);
  return f;
}
