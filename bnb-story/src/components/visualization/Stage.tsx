"use client";
/**
 * The pinned illustration: an SVG layer (diagrams) with a Three.js layer
 * (the BNB coin) on top. Both share one square coordinate system so scenes can
 * hand objects to each other. Stage colours are CSS variables, interpolated
 * when a chapter switches to the dark technical theme.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { subscribeG } from "@/animations/scrollController";
import { chapters, FINALE } from "@/data/coins/bnb/chapters";
import { useI18n } from "@/lib/i18n";
import { useStore, range } from "@/lib/store";
import { ui } from "@/animations/scrollController";
import { stageStore } from "@/lib/simStores";
import { Defs } from "./svg";
import ProblemScene from "./scenes/ProblemScene";
import OriginScene from "./scenes/OriginScene";
import JourneyScene from "./scenes/JourneyScene";
import ExchangeScene from "./scenes/ExchangeScene";
import ReservesScene from "./scenes/ReservesScene";
import BnbScene from "./scenes/BnbScene";
import ChainScene from "./scenes/ChainScene";
import PleaScene from "./scenes/PleaScene";
import PardonScene from "./scenes/PardonScene";
import ProbesScene from "./scenes/ProbesScene";
import HackScene from "./scenes/HackScene";
import TeamScene from "./scenes/TeamScene";
import CustodyScene from "./scenes/CustodyScene";
import RealityScene from "./scenes/RealityScene";
import FinaleScene from "./scenes/FinaleScene";

const CoinCanvas = dynamic(() => import("./CoinCanvas"), { ssr: false });

/** BNB identity: warm light paper, Binance yellow (#F0B90B) and graphite */
const LIGHT = { ink: [30, 32, 38], paper: [251, 249, 243], mute: [111, 106, 92], line: [235, 228, 207], accent: [169, 124, 0], soft: [252, 240, 200] };
/** the accusations act uses a faintly warmer paper — still light */
const DARK = { ink: [30, 32, 38], paper: [250, 244, 240], mute: [111, 100, 96], line: [236, 222, 214], accent: [169, 124, 0], soft: [252, 236, 214] };
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
        if (svgRef.current) svgRef.current.style.pointerEvents = g > FINALE + 0.5 ? "none" : "auto";
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
          "--s-ink": "#1e2026",
          "--s-paper": "#fbf9f3",
          "--s-mute": "#6f6a5c",
          "--s-line": "#ebe4cf",
          "--s-accent": "#a97c00",
          "--s-warn": "#d9304f",
          "--s-violet": "#4b4f5c",
          "--s-accent-soft": "#fcf0c8",
          backgroundColor: "#fbf9f3",
        } as React.CSSProperties
      }
      role="img"
      aria-label={t.chapters[chapter].figure}
    >
      {/* square drawing area, centred */}
      <div className="absolute inset-0" style={{ containerType: "size" }}>
      <div ref={squareRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "min(100cqw, 100cqh)", height: "min(100cqw, 100cqh)" }}>
        <svg ref={svgRef} viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
          <Defs />
          <ProblemScene />
          <OriginScene />
          <JourneyScene />
          <ExchangeScene />
          <ReservesScene />
          <BnbScene />
          <ChainScene />
          <PleaScene />
          <PardonScene />
          <ProbesScene />
          <HackScene />
          <TeamScene />
          <CustodyScene />
          <RealityScene />
          <FinaleScene />
        </svg>
        <CoinCanvas mobile={mobile} />
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
