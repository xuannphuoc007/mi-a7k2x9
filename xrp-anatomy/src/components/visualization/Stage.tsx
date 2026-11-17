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
import { chapters } from "@/data/coins/xrp/chapters";
import { useI18n } from "@/lib/i18n";
import { useStore, range } from "@/lib/store";
import { ui } from "@/animations/scrollController";
import { Defs } from "./svg";
import LedgerScene from "./scenes/LedgerScene";
import ConsensusScene from "./scenes/ConsensusScene";
import SendScene from "./scenes/SendScene";
import MapScene from "./scenes/MapScene";
import BridgeScene from "./scenes/BridgeScene";
import DexScene from "./scenes/DexScene";
import SupplyScene from "./scenes/SupplyScene";
import RiskScene from "./scenes/RiskScene";
import PiecesScene from "./scenes/PiecesScene";

const CoinCanvas = dynamic(() => import("./CoinCanvas"), { ssr: false });

const LIGHT = { ink: [23, 28, 30], paper: [247, 247, 242], mute: [119, 126, 128], line: [199, 207, 204], accent: [50, 127, 118], soft: [216, 231, 227] };
const DARK = { ink: [232, 236, 232], paper: [21, 26, 28], mute: [140, 150, 150], line: [62, 72, 74], accent: [94, 186, 172], soft: [32, 66, 62] };
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

  useEffect(
    () =>
      subscribeG((g) => {
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
        if (figRef.current) figRef.current.textContent = `${(g * 10).toFixed(1).padStart(4, "0")}%`;
      }),
    [],
  );

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden"
      style={
        {
          "--s-ink": "#171c1e",
          "--s-paper": "#f7f7f2",
          "--s-mute": "#777e80",
          "--s-line": "#c7cfcc",
          "--s-accent": "#327f76",
          "--s-warn": "#bb6946",
          "--s-accent-soft": "#d8e7e3",
          backgroundColor: "#f7f7f2",
        } as React.CSSProperties
      }
      role="img"
      aria-label={t.chapters[chapter].figure}
    >
      {/* square drawing area, centred */}
      <div className="absolute inset-0" style={{ containerType: "size" }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "min(100cqw, 100cqh)", height: "min(100cqw, 100cqh)" }}>
        <CoinCanvas mobile={mobile} />
        <svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
          <Defs />
          <LedgerScene />
          <ConsensusScene />
          <SendScene />
          <MapScene />
          <BridgeScene />
          <DexScene />
          <SupplyScene />
          <RiskScene />
          <PiecesScene />
        </svg>
      </div>
      </div>

      {/* stage chrome: figure tag + progress readout */}
      <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-3 md:bottom-auto md:left-6 md:top-[calc(var(--header-h)+8px)]" style={{ color: "var(--s-mute)" }}>
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
