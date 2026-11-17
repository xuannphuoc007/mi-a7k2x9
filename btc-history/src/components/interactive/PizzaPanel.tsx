"use client";
import { useEffect } from "react";
import { Pizza } from "lucide-react";
import { Badge, Panel, Slider, Stat } from "./ui";
import { chart, frameRange } from "@/animations/chartController";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useTween } from "@/hooks/useTween";
import { events } from "@/data/coins/btc/events";
import { LAST_T, fmtDate, money, priceAt } from "@/lib/btc";
import { chapters } from "@/data/coins/btc/chapters";

const PIZZA_T = events.find((e) => e.id === "pizza")!.t;
const PRESETS = [PIZZA_T, 2013.92, 2017.956, 2021.852, 2025.762, LAST_T];

function aim(t: number) {
  const w = chapters[1].win;
  chart.set({ probe: t, focus: t > w.t1 - 0.05 ? frameRange(2010.3, Math.max(t + 0.25, 2011.5), 0.04) : null });
}

export default function PizzaPanel() {
  const { t, lang, locale } = useI18n();
  const p = t.panels.pizza;
  const probe = useStore(chart, (s) => s.probe);
  const at = probe ?? PIZZA_T;
  useEffect(() => () => chart.set({ probe: null, focus: null }), []);

  const price = priceAt(at);
  const value = price === null ? 41 : price * 10000;
  const shown = useTween(value, 0.7);
  const pizzas = value / 20;
  const mag = Math.max(0, Math.min(1, Math.log10(Math.max(value, 1)) / 10));

  return (
    <Panel title={p.title} badge={<Badge kind="fact">10,000 BTC</Badge>}>
      <Slider id="pizza-date" label={p.date} value={at} min={PIZZA_T} max={LAST_T} step={1 / 104} onChange={aim} format={(v) => fmtDate(v, lang)} />
      <div className="mt-1 flex flex-wrap gap-1.5">
        {PRESETS.map((pt, i) => (
          <button
            key={i}
            onClick={() => aim(pt)}
            className={`tag border px-2 py-1 transition-colors ${Math.abs(pt - at) < 0.01 ? "border-accent text-accent" : "border-line text-mute hover:text-ink"}`}
          >
            {p.presets[i]}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="tag text-mute">{p.worth}</div>
          <div className="mono glow-text text-[30px] leading-none text-accent md:text-[36px]">{money(shown, locale, shown >= 1e6)}</div>
        </div>
        <Pizza size={36} className="shrink-0 text-gold" strokeWidth={1.4} style={{ transform: `rotate(${mag * 360}deg)`, transition: "transform .7s" }} />
      </div>
      <div className="mt-3" aria-hidden>
        <div className="tag flex justify-between text-mute/70">
          <span>$1</span>
          <span>{p.scale}</span>
          <span>$10B</span>
        </div>
        <div className="mt-1 h-2 w-full bg-line">
          <div className="h-full bg-gradient-to-r from-accent to-gold transition-[width] duration-700" style={{ width: `${mag * 100}%` }} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
        <Stat label={p.price} value={price === null ? p.before : money(price, locale)} />
        <Stat label={p.pizzas} value={price === null ? "2" : new Intl.NumberFormat(locale, { notation: pizzas > 1e6 ? "compact" : "standard", maximumFractionDigits: 1 }).format(pizzas)} tone="accent" />
      </div>
      <p className="mt-3 text-[12.5px] leading-snug text-mute">{price === null ? p.deal + ". " : ""}{p.note}</p>
    </Panel>
  );
}
