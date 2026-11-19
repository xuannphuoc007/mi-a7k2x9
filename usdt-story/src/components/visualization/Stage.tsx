"use client";
/**
 * The pinned illustration: an SVG layer (diagrams) with a Three.js layer
 * (the USDT coin) on top. Both share one square coordinate system so scenes can
 * hand objects to each other. Stage colours are CSS variables, interpolated
 * when a chapter switches to the dark technical theme.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { subscribeG } from "@/animations/scrollController";
import { chapters, FINALE } from "@/data/coins/usdt/chapters";
import { useI18n } from "@/lib/i18n";
import { useStore, range } from "@/lib/store";
import { ui } from "@/animations/scrollController";
import { stageStore } from "@/lib/simStores";
import { Defs } from "./svg";
import IntroScene from "./scenes/IntroScene";
import MintScene from "./scenes/MintScene";
import VaultScene from "./scenes/VaultScene";
import ProfitScene from "./scenes/ProfitScene";
import BirthScene from "./scenes/BirthScene";
import DoubtsScene from "./scenes/DoubtsScene";
import DepegScene from "./scenes/DepegScene";
import GrowthScene from "./scenes/GrowthScene";
import VietnamScene from "./scenes/VietnamScene";
import RulesScene from "./scenes/RulesScene";
import { StrengthsScene, WeaknessesScene } from "./scenes/CardsScene";
import FinaleScene from "./scenes/FinaleScene";

const CoinCanvas = dynamic(() => import("./CoinCanvas"), { ssr: false });

/** Vault identity: warm light paper, Tether green, deep green-black ink, brass */
const LIGHT = { ink: [22, 36, 30], paper: [247, 245, 239], mute: [102, 113, 106], line: [225, 222, 211], accent: [15, 107, 82], soft: [226, 240, 232] };
/** the stress-test act uses a faintly warmer paper — still light */
const DARK = { ink: [22, 36, 30], paper: [249, 242, 237], mute: [112, 104, 98], line: [236, 224, 216], accent: [15, 107, 82], soft: [244, 232, 224] };
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
          "--s-ink": "#16241e",
          "--s-paper": "#f7f5ef",
          "--s-mute": "#66716a",
          "--s-line": "#e1ded3",
          "--s-accent": "#0f6b52",
          "--s-warn": "#c4453a",
          "--s-violet": "#4f5b55",
          "--s-accent-soft": "#e2f0e8",
          backgroundColor: "#f7f5ef",
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
          <IntroScene />
          <MintScene />
          <VaultScene />
          <ProfitScene />
          <BirthScene />
          <DoubtsScene />
          <DepegScene />
          <GrowthScene />
          <VietnamScene />
          <RulesScene />
          <StrengthsScene />
          <WeaknessesScene />
          <FinaleScene />
        </svg>
        <CoinCanvas mobile={mobile} />
      </div>
      </div>

      {/* stage chrome: figure tag + progress readout */}
      <div className="pointer-events-none absolute bottom-3 left-4 flex max-w-[68%] items-center gap-3 md:bottom-auto md:left-6 md:top-3 md:max-w-none" style={{ color: "var(--s-mute)" }}>
        <span className="tag truncate">
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
