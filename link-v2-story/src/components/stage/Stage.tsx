"use client";
/**
 * The stage: one sticky SVG that shows the current chapter's scene.
 * Desktop: between the chain nav (left) and the text column (right).
 * Phone: the top half of the screen, text scrolls underneath.
 */
import { beatAt, chapters, C } from "@/data/coins/link/chapters";
import { useI18n } from "@/lib/i18n";
import { useG } from "@/hooks/useG";
import { Defs, VH, VW } from "./kit";
import { SCENES } from "./scenes";

export default function Stage({ mobile }: { mobile: boolean }) {
  const { t } = useI18n();
  const g = useG(0.004);
  const { ch, beat, p } = beatAt(g);
  const Scene = SCENES[ch];
  const c = chapters[ch];
  const tint = c.color === C.ink ? "#24305e" : c.color;
  return (
    <div
      className={`absolute ${mobile ? "inset-x-0 top-[58px] h-[50svh] px-1" : "bottom-6 left-[84px] right-[480px] top-[78px]"}`}
      aria-hidden
    >
      <div className={`flex items-center gap-2 ${mobile ? "px-2" : ""}`}>
        <span className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white" style={{ background: tint }}>
          {t.ui.chapter} {String(ch + 1).padStart(2, "0")}
        </span>
        <span className="truncate text-[13px] font-semibold text-mute">{t.chapters[ch].label}</span>
      </div>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="mt-1 h-[calc(100%-28px)] w-full" preserveAspectRatio="xMidYMid meet" style={{ fontFamily: "Lexend, sans-serif" }}>
        <Defs />
        <g key={ch} className="scene-in">
          <Scene b={beat} p={p} t={t} />
        </g>
      </svg>
    </div>
  );
}
