"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Badge, IconButton, Panel, Slider, Stat } from "./ui";
import { useI18n } from "@/lib/i18n";
import { LATEST_ACTIVITY } from "@/lib/xrpSeries";
import { SUPPLY_NOW } from "@/data/coins/xrp/series";

const REAL = {
  tx: LATEST_ACTIVITY[1],
  drops: Math.round((LATEST_ACTIVITY[2] / LATEST_ACTIVITY[1]) * 1e6),
  price: 0.914,
};

export default function EconomicsPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.economics;
  const [txLog, setTxLog] = useState(Math.log10(REAL.tx));
  const [dropsLog, setDropsLog] = useState(Math.log10(REAL.drops));
  const [price, setPrice] = useState(REAL.price);
  const tx = Math.round(10 ** txLog);
  const drops = Math.round(10 ** dropsLog);
  const perDay = (tx * drops) / 1e6;
  const perYear = perDay * 365;
  const share = (perYear / SUPPLY_NOW) * 100;
  const years = (SUPPLY_NOW * 0.01) / perYear;
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d }).format(n);
  const compact = (n: number) => new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);
  return (
    <Panel title={P.title} badge={<Badge kind="sim">calculator</Badge>}>
      <Slider id="eco-tx" label={P.tx} value={txLog} min={4} max={8} step={0.01} onChange={setTxLog} format={() => compact(tx)} />
      <Slider id="eco-fee" label={P.fee} value={dropsLog} min={1} max={4} step={0.01} onChange={setDropsLog} format={() => `${nf(drops)} ${P.drops}`} />
      <Slider id="eco-price" label={P.price} value={price} min={0.2} max={5} step={0.01} onChange={setPrice} format={(v) => `$${v.toFixed(2)}`} />
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
        <Stat label={P.burnedDay} value={`${nf(perDay)} XRP`} tone="warn" />
        <Stat label={P.burnedYear} value={`${compact(perYear)} XRP`} />
        <Stat label={P.share} value={`${share < 0.001 ? share.toExponential(1) : nf(share, 4)}%`} />
        <Stat label={P.usd} value={`$${compact(perYear * price)}`} />
      </div>
      <div className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3">
        <div>
          <div className="tag text-mute">{P.years}</div>
          <div className="mono glow-text text-[34px] leading-none text-accent">{years > 1e6 ? compact(years) : nf(years)}</div>
        </div>
        <IconButton
          onClick={() => {
            setTxLog(Math.log10(REAL.tx));
            setDropsLog(Math.log10(REAL.drops));
            setPrice(REAL.price);
          }}
          label={P.reset}
        >
          <RotateCcw size={13} /> {P.reset}
        </IconButton>
      </div>
      <p className="mt-3 text-[12px] leading-snug text-mute">{P.defaults}</p>
      <p className="mt-1.5 text-[12.5px] leading-snug text-ink/80">{P.note}</p>
    </Panel>
  );
}
