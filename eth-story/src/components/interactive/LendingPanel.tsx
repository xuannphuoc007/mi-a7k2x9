"use client";
import { Badge, Panel, Slider, Stat } from "./ui";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { lendingStore } from "@/lib/simStores";
import { debtUsd, health, liqPrice, LTV, START_PRICE } from "@/lib/models";

export default function LendingPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.lending;
  const eth = useStore(lendingStore, (s) => s.eth);
  const pct = useStore(lendingStore, (s) => s.borrowPct);
  const price = useStore(lendingStore, (s) => s.price);
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const debt = debtUsd(eth, pct);
  const hf = health(eth, price, debt);
  const lp = liqPrice(eth, debt);
  const drop = 1 - lp / START_PRICE;
  const state = debt <= 0 ? 0 : hf < 1 ? 3 : hf < 1.2 ? 2 : 1;

  return (
    <Panel title={P.title} badge={<Badge kind="ill">{t.ui.illustrative}</Badge>}>
      <p className="text-[12.5px] leading-snug text-mute">{P.hint}</p>
      <Slider id="lend-eth" label={P.eth} value={eth} min={1} max={20} step={1} onChange={(x) => lendingStore.set({ eth: x })} format={(x) => `${x} ETH`} />
      <Slider
        id="lend-pct"
        label={P.borrow.replace("{ltv}", String(Math.round(LTV * 100)))}
        value={Math.round(pct * 100)}
        min={0}
        max={100}
        step={5}
        onChange={(x) => lendingStore.set({ borrowPct: x / 100 })}
        format={(x) => `${x}% · $${nf(debtUsd(eth, x / 100))}`}
      />
      <Slider id="lend-price" label={P.price} value={price} min={400} max={4000} step={10} onChange={(x) => lendingStore.set({ price: x })} format={(x) => `$${nf(x)}`} />
      <div className="mt-1 flex gap-2">
        <button className="tag border border-line px-2 py-1 text-mute hover:border-accent hover:text-accent" onClick={() => lendingStore.set({ price: START_PRICE })}>
          {P.reset} ${nf(START_PRICE)}
        </button>
        {debt > 0 && (
          <button className="tag border border-warn/60 px-2 py-1 text-warn hover:bg-warn hover:text-paper" onClick={() => lendingStore.set({ price: Math.max(400, Math.floor(lp * 0.98)) })}>
            {P.crash}
          </button>
        )}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
        <Stat label={P.health} value={debt > 0 ? (hf > 9.99 ? "> 9.99" : nf(hf, 2)) : "—"} tone={state === 3 ? "warn" : "accent"} />
        <Stat label={P.liq} value={debt > 0 ? `$${nf(lp)}` : "—"} tone="warn" />
        <Stat label={P.room} value={debt > 0 ? `−${nf(drop * 100, 0)}%` : "—"} />
      </div>
      <p aria-live="polite" className={`mt-2 text-[13px] leading-snug ${state === 3 ? "text-warn" : state === 2 ? "text-peach" : "text-ink/85"}`}>
        {P.states[state]}
      </p>
      <p className="mt-2 border-t border-line pt-2 text-[12px] leading-snug text-mute">{P.caveat}</p>
    </Panel>
  );
}
