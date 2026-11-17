"use client";
/**
 * The pinned illustration: a Three.js layer (the coin) under an SVG layer
 * (technical diagrams). Both share one square coordinate system so scenes can
 * hand objects to each other. Stage colours are CSS variables, interpolated
 * when a chapter switches to the dark technical theme.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { subscribeG } from "@/animations/scrollController";
import { chapters, FINALE } from "@/data/coins/xrp/chapters";
import { useI18n } from "@/lib/i18n";
import { useStore, range } from "@/lib/store";
import { ui } from "@/animations/scrollController";
import { stageStore } from "@/lib/simStores";
import { Defs } from "./svg";
import ProblemScene from "./scenes/ProblemScene";
import OriginScene from "./scenes/OriginScene";
import JourneyScene from "./scenes/JourneyScene";
import EconomicsScene from "./scenes/EconomicsScene";
import LedgerScene from "./scenes/LedgerScene";
import ConsensusScene from "./scenes/ConsensusScene";
import SendScene from "./scenes/SendScene";
import MapScene from "./scenes/MapScene";
import BridgeScene from "./scenes/BridgeScene";
import DexScene from "./scenes/DexScene";
import SupplyScene from "./scenes/SupplyScene";
import RiskScene from "./scenes/RiskScene";
import PiecesScene from "./scenes/PiecesScene";
import RwaScene from "./scenes/RwaScene";

const CoinCanvas = dynamic(() => import("./CoinCanvas"), { ssr: false });

/** XRP identity: black and white, with the XRP Ledger's green; technical scenes go deeper and bluer */
const LIGHT = { ink: [238, 242, 243], paper: [10, 12, 15], mute: [139, 149, 155], line: [44, 52, 60], accent: [50, 230, 133], soft: [14, 53, 38] };
const DARK = { ink: [232, 240, 248], paper: [5, 9, 18], mute: [128, 146, 168], line: [36, 52, 78], accent: [25, 163, 255], soft: [10, 40, 70] };
const mixRgb = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

/** dark amount for a given g, from chapter config */
function darkness(g: number) {
  let d = 0;
  chapters.forEach((c, i) => {
    if (!c.dark) return;
    d = Math.max(d, range(g, i - 0.12, i + 0.04) * (1 - range(g, i + 0.9, i + 1.05)));
  });
  return d;
}

export default function Stage({ mobile }: { mobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLSpanElement>(null);
  const { t } = useI18n();
  const chapter = useStore(ui, (s) => s.chapter);
  const squareRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = squareRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => stageStore.set({ px: el.clientWidth || 800 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(
    () =>
      subscribeG((g) => {
        // in the finale explorer the 3D coin underneath must receive drags and clicks
        if (svgRef.current) svgRef.current.style.pointerEvents = g > FINALE + 0.8 ? "none" : "auto";
        const el = ref.current;
        if (!el) return;
        const d = darkness(g);
        el.style.setProperty("--s-ink", mixRgb(LIGHT.ink, DARK.ink, d));
        el.style.setProperty("--s-paper", mixRgb(LIGHT.paper, DARK.paper, d));
        el.style.setProperty("--s-mute", mixRgb(LIGHT.mute, DARK.mute, d));
        el.style.setProperty("--s-line", mixRgb(LIGHT.line, DARK.line, d));
        el.style.setProperty("--s-accent", mixRgb(LIGHT.accent, DARK.accent, d));
        el.style.setProperty("--s-accent-soft", mixRgb(LIGHT.soft, DARK.soft, d));
        el.style.backgroundColor = mixRgb(LIGHT.paper, DARK.paper, d);
        if (figRef.current) figRef.current.textContent = `${((g / chapters.length) * 100).toFixed(1).padStart(4, "0")}%`;
      }),
    [],
  );

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden"
      style={
        {
          "--s-ink": "#eef2f3",
          "--s-paper": "#0a0c0f",
          "--s-mute": "#8b959b",
          "--s-line": "#2c343c",
          "--s-accent": "#32e685",
          "--s-warn": "#ff6b5a",
          "--s-violet": "#9a52ff",
          "--s-accent-soft": "#0e3526",
          backgroundColor: "#0a0c0f",
        } as React.CSSProperties
      }
      role="img"
      aria-label={t.chapters[chapter].figure}
    >
      {/* square drawing area, centred */}
      <div className="absolute inset-0" style={{ containerType: "size" }}>
      <div ref={squareRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "min(100cqw, 100cqh)", height: "min(100cqw, 100cqh)" }}>
        <CoinCanvas mobile={mobile} />
        <svg ref={svgRef} viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
          <Defs />
          <ProblemScene />
          <OriginScene />
          <JourneyScene />
          <LedgerScene />
          <ConsensusScene />
          <SendScene />
          <MapScene />
          <BridgeScene />
          <DexScene />
          <EconomicsScene />
          <RwaScene />
          <SupplyScene />
          <RiskScene />
          <PiecesScene />
        </svg>
      </div>
      </div>

      {/* stage chrome: figure tag + progress readout */}
      <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-3 md:bottom-auto md:left-6 md:top-3" style={{ color: "var(--s-mute)" }}>
        <span className="tag">
          FIG. {String(chapter + 1).padStart(2, "0")} — {t.chapters[chapter].label}
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-4 md:bottom-5 md:right-16" style={{ color: "var(--s-mute)" }}>
        <span className="tag" ref={figRef}>
          000.0%
        </span>
      </div>
    </div>
  );
}
