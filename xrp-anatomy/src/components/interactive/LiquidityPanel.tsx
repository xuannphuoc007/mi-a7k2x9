"use client";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { fmt, useStore } from "@/lib/store";
import { liquidityStore } from "@/lib/simStores";
import { route, REF, DEFAULT_ROUTE } from "@/simulations/paymentRouter";
import { Badge, IconButton, Panel, Slider, Stat } from "./ui";
import { RotateCcw } from "lucide-react";

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

  const logSlider = (key: "amountUsd" | "directDepthUsd" | "leg1DepthUsd" | "leg2DepthUsd", label: string, min: number, max: number) => (
    <Slider
      id={`liq-${key}`}
      label={label}
      value={toLog(p[key], min, max)}
      min={0}
      max={1}
      step={0.005}
      onChange={(u) => liquidityStore.set({ [key]: nice(fromLog(u, min, max)) })}
      format={() => usd(p[key])}
    />
  );

  const bestLabel = r.best === "direct" ? P.direct_only : r.best === "bridge" ? P.bridge_only : `${P.split} ${Math.round(r.splitDirectShare * 100)}% / ${Math.round((1 - r.splitDirectShare) * 100)}%`;

  return (
    <Panel title={P.title} badge={<Badge kind="ill">{t.ui.illustrative}</Badge>}>
      {logSlider("amountUsd", P.amount, 100, 100_000)}
      {logSlider("directDepthUsd", P.direct, 5_000, 2_000_000)}
      {logSlider("leg1DepthUsd", P.leg1, 5_000, 2_000_000)}
      {logSlider("leg2DepthUsd", P.leg2, 5_000, 2_000_000)}
      <Slider id="liq-hop" label={P.impact} value={p.hopCostBps} min={0} max={150} step={1} onChange={(v) => liquidityStore.set({ hopCostBps: v })} format={(v) => `${v} bps`} />

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-3">
        <Stat label={P.direct_only} value={`${fmt(r.direct, 0, locale)} MXN`} tone={r.best === "direct" ? "accent" : "ink"} />
        <Stat label={P.bridge_only} value={`${fmt(r.bridge, 0, locale)} MXN`} tone={r.best === "bridge" ? "accent" : "ink"} />
        <Stat label={P.best} value={bestLabel} tone="accent" />
        <Stat label={P.out} value={`${fmt(r.bestOut, 0, locale)} MXN`} />
        <Stat label={P.effRate} value={`${fmt(r.bestOut / p.amountUsd, 3, locale)} MXN/USD`} />
        <Stat label={P.priceImpact} value={`${fmt(r.priceImpactPct, 2, locale)}%`} tone={r.priceImpactPct > 2 ? "warn" : "ink"} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 border-t border-line pt-2.5">
        <p className="text-[12px] leading-snug text-mute">
          {P.model} ({REF.MXN_PER_USD} MXN/USD)
        </p>
        <IconButton onClick={() => liquidityStore.set({ ...DEFAULT_ROUTE })} label="Reset">
          <RotateCcw size={13} />
        </IconButton>
      </div>
    </Panel>
  );
}
