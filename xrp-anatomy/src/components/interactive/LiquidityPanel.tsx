"use client";
import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fmt, useStore } from "@/lib/store";
import { liquidityStore } from "@/lib/simStores";
import { route, DEFAULT_ROUTE } from "@/simulations/paymentRouter";
import { Badge, IconButton, Panel, Slider, Stat } from "./ui";

/** log-scale slider helpers */
const toLog = (v: number, min: number, max: number) => Math.log(v / min) / Math.log(max / min);
const fromLog = (u: number, min: number, max: number) => min * Math.pow(max / min, u);
const nice = (v: number) => {
  const p = Math.pow(10, Math.floor(Math.log10(v)) - 1);
  return Math.round(v / p) * p;
};

export default function LiquidityPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.liquidity;
  const p = useStore(liquidityStore, (s) => s);
  const r = useMemo(() => route(p), [p]);
  const usd = (v: number) => `$${v >= 1000 ? fmt(v / 1000, v >= 10000 ? 0 : 1, locale) + "k" : fmt(v, 0, locale)}`;

  const logSlider = (id: string, label: string, value: number, min: number, max: number, set: (v: number) => void) => (
    <Slider id={id} label={label} value={toLog(value, min, max)} min={0} max={1} step={0.005} onChange={(u) => set(nice(fromLog(u, min, max)))} format={() => usd(value)} />
  );

  const bestLabel =
    r.best === "direct" ? P.direct_only : r.best === "bridge" ? P.bridge_only : `${P.split} ${Math.round(r.splitDirectShare * 100)}/${Math.round((1 - r.splitDirectShare) * 100)}`;

  return (
    <Panel title={P.title} badge={<Badge kind="ill">{t.ui.illustrative}</Badge>}>
      {logSlider("liq-amount", P.amount, p.amountUsd, 100, 100_000, (v) => liquidityStore.set({ amountUsd: v }))}
      {logSlider("liq-direct", P.direct, p.directDepthUsd, 5_000, 2_000_000, (v) => liquidityStore.set({ directDepthUsd: v }))}
      {logSlider("liq-xrp", P.leg1, p.leg1DepthUsd, 5_000, 2_000_000, (v) => liquidityStore.set({ leg1DepthUsd: v, leg2DepthUsd: v }))}

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-3">
        <Stat label={P.direct_only} value={`${fmt(r.direct, 0, locale)} MXN`} tone={r.best === "direct" ? "accent" : "ink"} />
        <Stat label={P.bridge_only} value={`${fmt(r.bridge, 0, locale)} MXN`} tone={r.best === "bridge" ? "accent" : "ink"} />
        <Stat label={P.best} value={bestLabel} tone="accent" />
        <Stat label={P.out} value={`${fmt(r.bestOut, 0, locale)} MXN`} />
        <Stat label={P.priceImpact} value={`${fmt(r.priceImpactPct, 1, locale)}%`} tone={r.priceImpactPct > 2 ? "warn" : "ink"} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 border-t border-line pt-2.5">
        <p className="text-[12px] leading-snug text-mute">{P.model}</p>
        <IconButton onClick={() => liquidityStore.set({ ...DEFAULT_ROUTE })} label="Reset">
          <RotateCcw size={13} />
        </IconButton>
      </div>
    </Panel>
  );
}
