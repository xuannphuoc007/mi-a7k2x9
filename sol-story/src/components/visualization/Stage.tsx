"use client";
/**
 * The pinned illustration: an SVG layer (diagrams) with a Three.js layer
 * (the SOL coin) on top. Both share one square coordinate system so scenes can
 * hand objects to each other. Stage colours are CSS variables, interpolated
 * when a chapter switches to the dark technical theme.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { subscribeG } from "@/animations/scrollController";
import { chapters, FINALE } from "@/data/coins/sol/chapters";
import { useI18n } from "@/lib/i18n";
import { useStore, range } from "@/lib/store";
import { ui } from "@/animations/scrollController";
import { stageStore } from "@/lib/simStores";
import { Defs } from "./svg";
import ProblemScene from "./scenes/ProblemScene";
import SpeedScene from "./scenes/SpeedScene";
import NftScene from "./scenes/NftScene";
import FtxScene from "./scenes/FtxScene";
import RevivalScene from "./scenes/RevivalScene";
import MemesScene from "./scenes/MemesScene";
import JourneyScene from "./scenes/JourneyScene";
import DefiScene from "./scenes/DefiScene";
import TeamScene from "./scenes/TeamScene";
import VersusScene from "./scenes/VersusScene";
import { StrengthsScene, WeaknessesScene } from "./scenes/CardsScene";
import RealityScene from "./scenes/RealityScene";
import FinaleScene from "./scenes/FinaleScene";

const CoinCanvas = dynamic(() => import("./CoinCanvas"), { ssr: false });

/** Solana identity: cool light paper, Solana purple (#9945FF) and teal (#14F195), deep ink */
const LIGHT = { ink: [27, 24, 48], paper: [248, 247, 252], mute: [106, 102, 128], line: [229, 225, 241], accent: [122, 63, 240], soft: [239, 231, 255] };
/** the stress-test act uses a faintly warmer paper — still light */
const DARK = { ink: [27, 24, 48], paper: [251, 246, 247], mute: [112, 100, 112], line: [238, 224, 230], accent: [122, 63, 240], soft: [246, 230, 244] };
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
          "--s-ink": "#1b1830",
          "--s-paper": "#f8f7fc",
          "--s-mute": "#6a6680",
          "--s-line": "#e5e1f1",
          "--s-accent": "#7a3ff0",
          "--s-warn": "#d9304f",
          "--s-violet": "#5b5675",
          "--s-accent-soft": "#efe7ff",
          backgroundColor: "#f8f7fc",
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
          <SpeedScene />
          <NftScene />
          <FtxScene />
          <RevivalScene />
          <MemesScene />
          <JourneyScene />
          <DefiScene />
          <TeamScene />
          <VersusScene />
          <StrengthsScene />
          <WeaknessesScene />
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
