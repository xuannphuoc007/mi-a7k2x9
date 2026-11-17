"use client";
/**
 * The pinned illustration: an SVG layer (diagrams) with a Three.js layer
 * (the ETH coin) on top. Both share one square coordinate system so scenes can
 * hand objects to each other. Stage colours are CSS variables, interpolated
 * when a chapter switches to the dark technical theme.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { subscribeG } from "@/animations/scrollController";
import { chapters, FINALE } from "@/data/coins/eth/chapters";
import { useI18n } from "@/lib/i18n";
import { useStore, range } from "@/lib/store";
import { ui } from "@/animations/scrollController";
import { stageStore } from "@/lib/simStores";
import { Defs } from "./svg";
import ProblemScene from "./scenes/ProblemScene";
import OriginScene from "./scenes/OriginScene";
import JourneyScene from "./scenes/JourneyScene";
import ContractScene from "./scenes/ContractScene";
import NetworkScene from "./scenes/NetworkScene";
import GasScene from "./scenes/GasScene";
import StakingScene from "./scenes/StakingScene";
import DefiScene from "./scenes/DefiScene";
import EconomicsScene from "./scenes/EconomicsScene";
import Layer2Scene from "./scenes/Layer2Scene";
import RealityScene from "./scenes/RealityScene";
import FinaleScene from "./scenes/FinaleScene";
import VersusScene from "./scenes/VersusScene";

const CoinCanvas = dynamic(() => import("./CoinCanvas"), { ssr: false });

/** Ethereum identity: light paper, ETH blue-violet (#627EEA) and the facet colours of the diamond */
const LIGHT = { ink: [28, 31, 58], paper: [246, 247, 253], mute: [104, 110, 145], line: [221, 225, 241], accent: [98, 126, 234], soft: [230, 234, 252] };
const DARK = { ink: [28, 31, 58], paper: [240, 242, 252], mute: [104, 110, 145], line: [214, 219, 238], accent: [98, 126, 234], soft: [226, 231, 251] };
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
          "--s-ink": "#1c1f3a",
          "--s-paper": "#f6f7fd",
          "--s-mute": "#686e91",
          "--s-line": "#dde1f1",
          "--s-accent": "#627eea",
          "--s-warn": "#e0475b",
          "--s-violet": "#8b67d8",
          "--s-accent-soft": "#e6eafc",
          backgroundColor: "#f6f7fd",
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
          <ContractScene />
          <NetworkScene />
          <GasScene />
          <StakingScene />
          <DefiScene />
          <EconomicsScene />
          <Layer2Scene />
          <VersusScene />
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
