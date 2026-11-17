"use client";
import { useEffect } from "react";
import { Badge, Panel, Slider, Stat } from "./ui";
import { chart } from "@/animations/chartController";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { HALVING_TIMES, eraAt, fmtDate, rewardAt, supplyAt } from "@/lib/btc";

function aim(t: number) {
  chart.set({ probe: t, focus: t > 2033 ? { t0: 2006, t1: 2144, p0: 0.01, p1: 400000 } : null });
}

export default function HalvingPanel() {
  const { t, lang, locale } = useI18n();
  const p = t.panels.halving;
  const probe = useStore(chart, (s) => s.probe);
  const year = probe ?? 2026.88;
  useEffect(() => () => chart.set({ probe: null, focus: null }), []);
  const reward = rewardAt(year);
  const supply = supplyAt(year);
  const era = eraAt(year);
  const next = HALVING_TIMES.find((h) => h > year);
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d }).format(n);
  const eras = Array.from({ length: 8 }, (_, k) => 0.5 ** (k + 1));

  return (
    <Panel title={p.title} badge={<Badge kind="sim">2009 → 2140</Badge>}>
      <Slider id="halving-year" label={p.year} value={year} min={2009.02} max={2140} step={0.25} onChange={aim} format={(v) => (v > 2026.9 ? `${Math.floor(v)} (${t.chart.est})` : String(Math.floor(v)))} />
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <div className="tag text-mute">{p.reward}</div>
          <div className="mono text-[34px] leading-none text-gold">
            {reward >= 0.01 ? nf(reward, 4) : reward.toExponential(1)} <span className="text-[16px] text-mute">BTC</span>
          </div>
        </div>
        <div className="text-right">
          <div className="tag text-mute">{p.era}</div>
          <div className="mono text-[22px] leading-none">{era + 1}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex h-7 w-full gap-[2px]" aria-hidden>
          {eras.map((w, k) => {
            const fill = k < era ? 1 : k === era ? Math.max(0, Math.min(1, (supply - (21e6 * (1 - 0.5 ** k))) / (21e6 * w))) : 0;
            return (
              <div key={k} className="relative h-full overflow-hidden bg-line/70" style={{ flexGrow: w, flexBasis: 0 }}>
                <div className={`absolute inset-y-0 left-0 ${k % 2 ? "bg-gold" : "bg-accent"}`} style={{ width: `${fill * 100}%`, transition: "width .3s" }} />
                {w > 0.06 && <span className="mono absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-paper mix-blend-difference">{50 / 2 ** k}</span>}
              </div>
            );
          })}
          <div className="h-full bg-line/40" style={{ flexGrow: 0.004, flexBasis: 0 }} />
        </div>
        <div className="mt-1 text-[11.5px] text-mute">{p.eras}</div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
        <Stat label={p.supply} value={`${nf(supply / 1e6, 3)}M`} tone="accent" />
        <Stat label={p.ofMax} value={`${nf((supply / 21e6) * 100, 2)}%`} />
        <Stat label={p.perDay} value={nf(reward * 144, 2)} />
      </div>
      {next && <div className="tag mt-3 text-mute">{p.next}: <span className="text-ink">{next > 2026.9 ? `~${Math.floor(next)} (${t.chart.est})` : fmtDate(next, lang)}</span></div>}
      <p className="mt-2 text-[12.5px] leading-snug text-mute">{p.note}</p>
    </Panel>
  );
}
