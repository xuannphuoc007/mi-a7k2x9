"use client";
import { Play, RotateCcw } from "lucide-react";
import { Badge, IconButton, Panel } from "./ui";
import { pushDominoes, resetDominoes } from "@/animations/chartController";
import { DOMINOES } from "@/components/visualization/overlays/DominoOverlay";
import { useStageFrame } from "@/hooks/useStageFrame";
import { useI18n } from "@/lib/i18n";
import { clamp, range, smooth } from "@/lib/store";

export default function DominoesPanel() {
  const { t } = useI18n();
  const p = t.panels.dominoes;
  const f = useStageFrame();
  const fallen = DOMINOES.map((d, k) => (f ? clamp(Math.max(smooth(range(f.T, d.t - 0.004, d.t + 0.014)), f.domino - k)) > 0.45 : false));
  const all = fallen.every(Boolean);
  return (
    <Panel title={p.title} badge={<Badge kind="fact">2022</Badge>}>
      <div className="flex gap-2">
        <IconButton primary onClick={pushDominoes} label={p.push} disabled={all}>
          <Play size={13} /> {p.push}
        </IconButton>
        <IconButton onClick={resetDominoes} label={p.reset}>
          <RotateCcw size={13} /> {p.reset}
        </IconButton>
      </div>
      <ol className="mt-3 grid gap-1">
        {p.items.map((it, k) => (
          <li key={it.name} className={`grid grid-cols-[1.4rem_1fr] gap-2 border-l-2 py-1 pl-2.5 transition-colors duration-300 ${fallen[k] ? "border-warn" : "border-line"}`}>
            <span className={`mono text-[12px] ${fallen[k] ? "text-warn" : "text-mute"}`}>{k + 1}</span>
            <span className="min-w-0">
              <span className="flex items-baseline justify-between gap-2">
                <span className={`serif text-[15.5px] ${fallen[k] ? "text-warn line-through decoration-1" : "text-ink"}`}>{it.name}</span>
                <span className="tag shrink-0 text-mute">{it.date}</span>
              </span>
              <span className="block text-[12.5px] leading-snug text-ink/75">{it.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
