"use client";
import { Badge, Panel, Slider, Stat } from "./ui";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { supplyStore } from "@/lib/simStores";
import { issuancePerYear } from "@/lib/models";

const PRESETS = [
  { burn: 3000, staked: 20 },
  { burn: 300, staked: 41.4 },
];

export default function SupplyPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.supply;
  const staked = useStore(supplyStore, (s) => s.staked);
  const burn = useStore(supplyStore, (s) => s.burn);
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const iss = issuancePerYear(staked);
  const net = iss - burn * 365;
  const apr = iss / (staked * 1e6);

  return (
    <Panel title={P.title} badge={<Badge kind="ill">{t.ui.illustrative}</Badge>}>
      <p className="text-[12.5px] leading-snug text-mute">{P.hint}</p>
      <Slider id="sup-staked" label={P.staked} value={staked} min={5} max={80} step={0.2} onChange={(x) => supplyStore.set({ staked: x })} format={(x) => `${nf(x, 1)}M ETH`} />
      <Slider id="sup-burn" label={P.burn} value={burn} min={0} max={6000} step={50} onChange={(x) => supplyStore.set({ burn: x })} format={(x) => `${nf(x)} ETH`} />
      <div className="mt-1 flex flex-wrap gap-2">
        {P.presets.map((p, i) => (
          <button key={p} className="tag border border-line px-2 py-1 text-mute hover:border-accent hover:text-accent" onClick={() => supplyStore.set(PRESETS[i])}>
            {p}
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
        <Stat label={P.created} value={`+${nf(iss / 1000)}k`} tone="accent" />
        <Stat label={P.burned} value={`−${nf((burn * 365) / 1000)}k`} />
        <Stat label={P.apr} value={`${nf(apr * 100, 2)}%`} />
      </div>
      <p aria-live="polite" className={`mt-2 text-[13px] leading-snug ${net < 0 ? "text-mint" : "text-ink/85"}`}>
        {(net >= 0 ? P.grows : P.shrinks).replace("{n}", nf(Math.abs(net / 1000)))}
      </p>
      <p className="mt-2 border-t border-line pt-2 text-[12px] leading-snug text-mute">{P.caveat}</p>
    </Panel>
  );
}
