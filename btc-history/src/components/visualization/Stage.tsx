"use client";
/** The sticky stage: a square drawing area with the SVG chart, the 3D coin above it and HTML captions on top. */
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { chart, initChart } from "@/animations/chartController";
import { useStageFrame } from "@/hooks/useStageFrame";
import HistoryChart from "./HistoryChart";
import StageHud from "./StageHud";

const CoinCanvas = dynamic(() => import("./CoinCanvas"), { ssr: false });

export default function Stage({ mobile }: { mobile: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const f = useStageFrame();

  useEffect(() => initChart(), []);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => chart.set({ size: el.clientWidth || 800 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden [container-type:size]">
      <div ref={box} className="relative" style={{ width: "min(100cqw, 100cqh)", height: "min(100cqw, 100cqh)" }}>
        {f && <HistoryChart f={f} mobile={mobile} />}
        <CoinCanvas />
        {f && <StageHud f={f} mobile={mobile} />}
      </div>
    </div>
  );
}
