"use client";
import { Badge, Panel, Slider, Stat } from "./ui";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { problemStore } from "@/lib/simStores";
import { useTween } from "@/hooks/useTween";
import { AMOUNT } from "@/components/visualization/scenes/ProblemScene";

export default function ProblemPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.problem;
  const option = useStore(problemStore, (s) => s.option);
  const fee = useStore(problemStore, (s) => s.fee);
  const cost = option === 2 ? (AMOUNT * fee) / 100 : option === 3 ? 0.01 : 0;
  const shown = useTween(cost, 0.4);
  const nf = (n: number, d = 2) => new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
  const o = P.options[option];
  return (
    <Panel title={P.title} badge={<Badge kind="sim">{t.ui.simulated}</Badge>}>
      <p className="text-[12.5px] leading-snug text-mute">{P.hint}</p>
      <div className="mt-3 grid grid-cols-2 gap-1.5" role="radiogroup" aria-label={P.title}>
        {P.options.map((x, i) => (
          <button
            key={x.name}
            role="radio"
            aria-checked={option === i}
            onClick={() => problemStore.set({ option: i })}
            className={`tag border px-2 py-2 text-left transition-colors ${option === i ? "border-accent bg-accent text-paper" : "border-line text-ink hover:border-accent hover:text-accent"}`}
          >
            <span className="mono mr-1.5 opacity-70">{i + 1}</span>
            {x.name}
          </button>
        ))}
      </div>
      {option === 2 && (
        <Slider id="problem-fee" label={P.fee} value={fee} min={0} max={20} step={1} onChange={(v) => problemStore.set({ fee: v })} format={(v) => `${v}%`} />
      )}
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
        <Stat label={P.cost} value={`$${nf(shown)}`} tone={cost > 1 ? "warn" : "accent"} />
        <Stat label={P.risk} value={o.risk} tone={option < 2 ? "warn" : "ink"} />
        <Stat label={P.rules} value={o.rules} />
      </div>
      <p className="mt-3 border-l-2 border-accent pl-3 text-[13px] leading-snug text-ink/85">{o.note}</p>
      <p className="mt-2 text-[12px] leading-snug text-mute">{P.source}</p>
    </Panel>
  );
}
