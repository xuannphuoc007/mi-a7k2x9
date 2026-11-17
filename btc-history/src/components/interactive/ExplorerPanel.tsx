"use client";
import { Badge, Panel, Segmented, Slider } from "./ui";
import { chart } from "@/animations/chartController";
import type { Category } from "@/data/coins/btc/events";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useTween } from "@/hooks/useTween";
import { FIRST_T, LAST_T, SERIES, fmtDate, money, priceAt } from "@/lib/btc";

const CATS: Category[] = ["tech", "market", "crisis", "adoption", "policy"];
const PRESETS: [number, number][] = [
  [2017.956, LAST_T],
  [2022.888, LAST_T],
  [2016.52, 2020.36],
];

function worstDrop(a: number, b: number) {
  let peak = priceAt(a) ?? 0;
  let worst = 0;
  for (const [t, p] of SERIES) {
    if (t < a) continue;
    if (t > b) break;
    peak = Math.max(peak, p);
    worst = Math.min(worst, p / peak - 1);
  }
  return worst;
}

export default function ExplorerPanel() {
  const { t, lang, locale } = useI18n();
  const p = t.panels.explorer;
  const invest = useStore(chart, (s) => s.invest);
  const scale = useStore(chart, (s) => s.scale);
  const filters = useStore(chart, (s) => s.filters);
  const set = (patch: Partial<typeof invest>) => chart.set({ invest: { ...invest, ...patch } });

  const a = Math.min(invest.buy, invest.sell);
  const b = Math.max(invest.buy, invest.sell);
  const pa = priceAt(a) ?? 0.06;
  const pb = priceAt(b) ?? pa;
  const result = (invest.amount / pa) * pb;
  const shown = useTween(result, 0.6);
  const mult = pb / pa;
  const worst = worstDrop(a, b);
  const amountPos = Math.log10(invest.amount);

  return (
    <Panel title={p.title} badge={<Badge kind="sim">what-if</Badge>}>
      <Slider id="ex-amount" label={p.invest} value={amountPos} min={1} max={5} step={0.01} onChange={(v) => set({ amount: Math.round(10 ** v / (10 ** v > 1000 ? 100 : 10)) * (10 ** v > 1000 ? 100 : 10) })} format={() => money(invest.amount, locale)} />
      <Slider id="ex-buy" label={p.buy} value={invest.buy} min={FIRST_T} max={LAST_T} step={1 / 52} onChange={(v) => set({ buy: v })} format={(v) => fmtDate(v, lang)} />
      <Slider id="ex-sell" label={p.sell} value={invest.sell} min={FIRST_T} max={LAST_T} step={1 / 52} onChange={(v) => set({ sell: v })} format={(v) => fmtDate(v, lang)} />
      <div className="mt-1 flex flex-wrap gap-1.5">
        {PRESETS.map(([x, y], i) => (
          <button key={i} onClick={() => set({ buy: x, sell: y })} className="tag border border-line px-2 py-1 text-mute transition-colors hover:border-accent hover:text-ink">
            {p.presets[i]}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3">
        <div className="min-w-0">
          <div className="tag text-mute">{p.result}</div>
          <div className={`mono truncate text-[30px] leading-none ${mult >= 1 ? "text-accent glow-text" : "text-warn"}`}>{money(shown, locale, shown >= 1e6)}</div>
        </div>
        <div className="text-right">
          <div className="mono text-[20px] leading-none">{mult >= 100 ? Math.round(mult).toLocaleString(locale) : mult.toFixed(2)}{p.multiple}</div>
          <div className="tag mt-1 text-warn">{Math.round(worst * 100)}%</div>
        </div>
      </div>
      <div className="tag mt-1 text-right text-mute">{p.worst}</div>
      <div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-3">
        <span className="tag text-mute">{p.scale}</span>
        <Segmented label={p.scale} value={scale} onChange={(v) => chart.set({ scale: v })} options={[{ value: "log", label: p.log }, { value: "linear", label: p.linear }]} />
      </div>
      <div className="mt-3">
        <div className="tag text-mute">{p.filters}</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {CATS.map((c) => (
            <button
              key={c}
              aria-pressed={filters[c]}
              onClick={() => chart.set({ filters: { ...filters, [c]: !filters[c] } })}
              className={`tag border px-2 py-1 transition-colors ${filters[c] ? "border-accent bg-accent/15 text-ink" : "border-line text-mute line-through"}`}
            >
              {t.cats[c]}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[12.5px] leading-snug text-mute">{p.hover} {p.note}</p>
    </Panel>
  );
}
