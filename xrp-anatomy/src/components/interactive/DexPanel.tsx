"use client";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { fmt, useStore } from "@/lib/store";
import { dexStore } from "@/lib/simStores";
import { ammBuy, buildBook, walkBook } from "@/simulations/liquiditySimulator";
import { Badge, Panel, Segmented, Slider, Stat } from "./ui";

export default function DexPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.dex;
  const d = useStore(dexStore, (s) => s);
  const book = useMemo(() => buildBook(d.liquidity), [d.liquidity]);
  const fill = useMemo(() => walkBook(book.asks, d.size), [book, d.size]);
  const amm = useMemo(() => ammBuy(d.liquidity, d.size), [d.liquidity, d.size]);
  return (
    <Panel title={P.title} badge={<Badge kind="ill">{t.ui.illustrative}</Badge>}>
      <Segmented
        label={P.mode}
        value={d.mode === "auto" ? null : d.mode}
        onChange={(m) => dexStore.set({ mode: m })}
        options={[
          { value: "book", label: P.book },
          { value: "amm", label: P.amm },
        ]}
      />
      <Slider id="dex-size" label={P.size} value={d.size} min={500} max={60000} step={500} onChange={(v) => dexStore.set({ size: v })} format={(v) => `${fmt(v, 0, locale)} XRP`} />
      <Slider id="dex-liq" label={P.liquidity} value={d.liquidity} min={0.3} max={2} step={0.05} onChange={(v) => dexStore.set({ liquidity: v })} format={(v) => `×${fmt(v, 2, locale)}`} />

      <div className="mt-3 grid grid-cols-2 gap-x-4 border-t border-line pt-3">
        <div className={`space-y-2 ${d.mode === "amm" ? "opacity-55" : ""}`}>
          <div className="tag text-ink">{P.book}</div>
          {fill.complete ? (
            <>
              <Stat label={P.avg} value={`$${fmt(fill.avg, 3, locale)}`} />
              <Stat label={P.slippage} value={`+${fmt(fill.slippagePct, 2, locale)}%`} tone={fill.slippagePct > 1 ? "warn" : "ink"} />
              <Stat label={P.cost} value={`$${fmt(fill.cost, 0, locale)}`} />
            </>
          ) : (
            <p className="text-[12.5px] text-warn">{P.insufficient}</p>
          )}
        </div>
        <div className={`space-y-2 ${d.mode === "book" ? "opacity-55" : ""}`}>
          <div className="tag text-ink">{P.amm}</div>
          {amm.complete ? (
            <>
              <Stat label={P.avg} value={`$${fmt(amm.avg, 3, locale)}`} />
              <Stat label={P.slippage} value={`+${fmt(amm.slippagePct, 2, locale)}%`} tone={amm.slippagePct > 1 ? "warn" : "ink"} />
              <Stat label={P.cost} value={`$${fmt(amm.cost, 0, locale)}`} />
            </>
          ) : (
            <p className="text-[12.5px] text-warn">{P.insufficient}</p>
          )}
        </div>
      </div>
      <p className="mt-3 border-t border-line pt-2.5 text-[12px] leading-snug text-mute">{P.model}</p>
    </Panel>
  );
}
