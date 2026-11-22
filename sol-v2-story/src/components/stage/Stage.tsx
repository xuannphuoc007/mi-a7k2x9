"use client";
/**
 * The stage: one sticky SVG that shows the current chapter's scene.
 * Desktop: to the right of the text column, above the flight path.
 * Phone: the top half of the screen, text scrolls underneath.
 */
import { beatAt, chapters } from "@/data/coins/sol/chapters";
import { useI18n } from "@/lib/i18n";
import { useG } from "@/hooks/useG";
import { Defs, VH, VW } from "./kit";
import { SCENES } from "./scenes";

export default function Stage({ mobile }: { mobile: boolean }) {
  const { t } = useI18n();
  const g = useG(0.004);
  const { ch, beat, p } = beatAt(g);
  const Scene = SCENES[ch];
  const tint = chapters[ch].color;
  return (
    <div className={`absolute ${mobile ? "inset-x-0 top-[58px] h-[50svh] px-1" : "bottom-[92px] left-[480px] right-6 top-[78px]"}`} aria-hidden>
      <div className={`flex items-center justify-end gap-2 ${mobile ? "px-2" : ""}`}>
        <span className="truncate text-[13px] font-semibold text-mute">{t.chapters[ch].label}</span>
        <span className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white" style={{ background: tint }}>
          {t.ui.chapter} {String(ch + 1).padStart(2, "0")}
        </span>
      </div>
      <svg viewBox={`0 0 ${VW} ${VH}`} className={`mt-1 w-full ${mobile ? "h-[calc(100%-62px)]" : "h-[calc(100%-84px)]"}`} preserveAspectRatio="xMidYMid meet" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        <Defs />
        <g key={ch} className="scene-in">
          <Scene b={beat} p={p} t={t} />
        </g>
      </svg>
      <div className="mt-1 flex justify-center px-2">
        <div key={`${ch}-${beat}`} className="scene-in flex max-w-full items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_10px_30px_-16px_rgba(91,43,179,0.5)] ring-1 ring-[#e6e1f2]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ background: tint }}>
            {beat + 1}
          </span>
          <span className={`font-bold leading-tight ${mobile ? "text-[14px]" : "text-[17px]"}`}>{t.chapters[ch].beats[beat].title}</span>
        </div>
      </div>
    </div>
  );
}
