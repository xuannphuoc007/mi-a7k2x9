"use client";
import { useRef } from "react";
import gsap from "gsap";
import { Play, RotateCcw } from "lucide-react";
import { Badge, IconButton, Panel, Segmented } from "./ui";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { escrowStore } from "@/lib/simStores";
import { DECIDING_RULE } from "@/components/visualization/scenes/ContractScene";

export default function EscrowPanel() {
  const { t } = useI18n();
  const P = t.panels.escrow;
  const R = t.scenes.contract.rules;
  const scenario = useStore(escrowStore, (s) => s.scenario);
  const run = useStore(escrowStore, (s) => s.run);
  const runs = useStore(escrowStore, (s) => s.runs);
  const tw = useRef<gsap.core.Tween | null>(null);

  const play = () => {
    tw.current?.kill();
    const o = { r: 0 };
    escrowStore.set((s) => ({ run: 0, runs: s.runs + 1 }));
    tw.current = gsap.to(o, { r: 1, duration: 3.6, ease: "none", onUpdate: () => escrowStore.set({ run: o.r }) });
  };
  const pick = (v: string) => {
    tw.current?.kill();
    escrowStore.set({ scenario: Number(v), run: 0, runs: 0 });
  };
  const done = runs > 0 && run >= 0.999;
  const rule = DECIDING_RULE[scenario];

  return (
    <Panel title={P.title} badge={<Badge kind="sim">{t.ui.simulated}</Badge>}>
      <p className="text-[12.5px] leading-snug text-mute">{P.hint}</p>
      <div className="mt-3">
        <Segmented label={P.scenario} value={String(scenario)} onChange={pick} options={P.scenarios.map((s, i) => ({ value: String(i), label: s }))} />
      </div>
      <p className="mt-2 text-[13px] leading-snug text-ink/85">{P.describe[scenario]}</p>
      <div className="mt-3 flex items-center gap-2">
        <IconButton primary onClick={play} label={P.play}>
          {runs > 0 ? <RotateCcw size={13} /> : <Play size={13} />} {runs > 0 ? P.again : P.play}
        </IconButton>
        <div className="h-1 flex-1 bg-line">
          <div className="h-full bg-accent" style={{ width: `${(runs > 0 ? run : 0) * 100}%` }} />
        </div>
      </div>
      <div className="mono mt-3 border border-line bg-paper/60 p-2.5 text-[12px] leading-relaxed">
        {R.map((r, i) => (
          <div key={i} className={`px-1.5 ${done && i === rule ? "bg-accent/25 text-mint" : "text-lilac/80"}`}>
            {i + 1}. {r.code}
          </div>
        ))}
      </div>
      <div aria-live="polite" className="mt-2 min-h-[2.6em] text-[13px] leading-snug">
        {done ? (
          <span className={scenario === 2 ? "text-sky" : "text-mint"}>
            {P.result[scenario]} {P.fee}
          </span>
        ) : (
          <span className="text-mute">{runs > 0 ? P.running : P.waiting}</span>
        )}
      </div>
      <p className="mt-2 border-t border-line pt-2 text-[12px] leading-snug text-mute">{P.caveat}</p>
    </Panel>
  );
}
