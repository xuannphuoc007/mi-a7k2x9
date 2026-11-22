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
      <svg viewBox={`0 0 ${VW} ${VH}`} className={`mt-1 w-full ${mobile ? "h-[calc(100%-62px)]" : "h-[calc(100%-84px)]"}`} preserveAspectRatio="xMidYMid meet" style={{ fontFamily: "Lexend, sans-serif" }}>
        <Defs />
        <g key={ch} className="scene-in">
          <Scene b={beat} p={p} t={t} />
        </g>
      </svg>
      <div className="mt-1 flex justify-center px-2">
        <div key={`${ch}-${beat}`} className="scene-in flex max-w-full items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-[0_10px_30px_-16px_rgba(26,58,156,0.5)] ring-1 ring-[#dde5f0]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ background: tint }}>
            {beat + 1}
          </span>
          <span className={`font-bold leading-tight ${mobile ? "text-[14px]" : "text-[17px]"}`}>{t.chapters[ch].beats[beat].title.replace(/^[①②③④]\s*/, "")}</span>
        </div>
      </div>
    </div>
  );
}
