"use client";
import { useEffect, useState } from "react";
import { Badge, Panel, Segmented } from "./ui";
import { chart, frameRange } from "@/animations/chartController";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { CYCLES, LAST_T, money } from "@/lib/btc";

export default function DrawdownPanel() {
  const { t, locale } = useI18n();
  const p = t.panels.drawdown;
  const view = useStore(chart, (s) => s.view);
  const [pick, setPick] = useState<string | null>(null);
  useEffect(() => () => chart.set({ focus: null, view: "price" }), []);

  const choose = (id: string) => {
    if (pick === id) {
      setPick(null);
      chart.set({ focus: null });
      return;
    }
    const c = CYCLES.find((x) => x.id === id)!;
    setPick(id);
    chart.set({ focus: frameRange(c.peakT - 0.25, (c.recoverT ?? LAST_T) + 0.15, 0.03) });
  };

  return (
    <Panel title={p.title} badge={<Badge kind="fact">5 × −50%+</Badge>}>
      <Segmented
        label={p.view}
        value={view}
        onChange={(v) => chart.set({ view: v })}
        options={[
          { value: "price", label: p.price },
          { value: "dd", label: p.dd },
        ]}
      />
      <ul className="mt-3 grid gap-1.5">
        {CYCLES.map((c) => {
          const on = pick === c.id;
          const months = c.recoverT ? Math.round((c.recoverT - c.peakT) * 12) : null;
          return (
            <li key={c.id}>
              <button
                onClick={() => choose(c.id)}
                aria-pressed={on}
                className={`grid w-full grid-cols-[3.2rem_1fr_auto] items-center gap-3 border px-3 py-2 text-left transition-colors ${on ? "border-accent bg-accent/10" : "border-line hover:border-mute"}`}
              >
                <span className="serif text-[18px]">{c.id}</span>
                <span className="min-w-0">
                  <span className="block h-1.5 w-full bg-line">
                    <span className="block h-full bg-warn" style={{ width: `${-c.fall * 100}%` }} />
                  </span>
                  <span className="mono mt-1 block truncate text-[11px] text-mute">
                    {money(c.peak, locale, true)} → {money(c.low, locale, true)}
                  </span>
                </span>
                <span className="text-right">
                  <span className="mono block text-[15px] text-warn">{Math.round(c.fall * 100)}%</span>
                  <span className="tag block text-mute">{months !== null ? `${months} ${p.months}` : p.notYet}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="tag mt-2 flex justify-between text-mute">
        <span>{p.fall}</span>
        <span>{p.recover}</span>
      </div>
      <p className="mt-2 text-[12.5px] leading-snug text-mute">{p.hint}</p>
    </Panel>
  );
}
