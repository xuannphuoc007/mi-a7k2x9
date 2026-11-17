"use client";
import { useRef } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";
import { Badge, IconButton, Panel, Segmented, Slider, Stat } from "./ui";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { gasStore } from "@/lib/simStores";
import { baseFees, ETH_USD, GAS_BLOCKS, TX_GAS, txCostEth } from "@/lib/models";

export default function GasPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.gas;
  const fullness = useStore(gasStore, (s) => s.fullness);
  const blocks = useStore(gasStore, (s) => s.blocks);
  const tip = useStore(gasStore, (s) => s.tip);
  const kind = useStore(gasStore, (s) => s.kind);
  const tw = useRef<gsap.core.Tween | null>(null);
  const nf = (n: number, d = 2) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

  const run = () => {
    tw.current?.kill();
    const o = { b: 0 };
    gasStore.set({ blocks: 0 });
    tw.current = gsap.to(o, { b: GAS_BLOCKS, duration: 5, ease: "none", onUpdate: () => gasStore.set({ blocks: o.b }) });
  };
  const fees = baseFees(fullness);
  const base = fees[Math.min(GAS_BLOCKS, Math.floor(blocks))];
  const gas = TX_GAS[kind];
  const eth = txCostEth(base, tip, gas);
  const usd = eth * ETH_USD;

  return (
    <Panel title={P.title} badge={<Badge kind="ill">{t.ui.illustrative}</Badge>}>
      <p className="text-[12.5px] leading-snug text-mute">{P.hint}</p>
      <Slider
        id="gas-full"
        label={P.fullness}
        value={Math.round(fullness * 100)}
        min={0}
        max={100}
        step={5}
        onChange={(x) => {
          tw.current?.kill();
          gasStore.set({ fullness: x / 100, blocks: 0 });
        }}
        format={(x) => `${x}%`}
      />
      <div className="mt-1 flex items-center gap-2">
        <IconButton primary onClick={run} label={P.run}>
          <Play size={13} /> {P.run}
        </IconButton>
        <span className="tag text-mute">
          {P.blocks}: {Math.floor(blocks)}/{GAS_BLOCKS} · {Math.floor(blocks) * 12}s
        </span>
      </div>
      <Slider id="gas-tip" label={P.tip} value={tip} min={0} max={2} step={0.1} onChange={(x) => gasStore.set({ tip: x })} format={(x) => `${nf(x, 1)} gwei`} />
      <div className="mt-1">
        <Segmented label={P.kind} value={String(kind)} onChange={(x) => gasStore.set({ kind: Number(x) })} options={P.kinds.map((s, i) => ({ value: String(i), label: s }))} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
        <Stat label={P.base} value={`${nf(base, base < 10 ? 2 : 1)} gwei`} tone="accent" />
        <Stat label={P.gas} value={gas.toLocaleString(locale)} />
        <Stat label={P.cost} value={usd < 0.01 ? "< $0.01" : `$${nf(usd, usd < 1 ? 3 : 2)}`} tone={usd > 1 ? "warn" : "ink"} />
      </div>
      <p className="mt-1 text-[12px] leading-snug text-mute">{P.costEth.replace("{eth}", nf(eth, 6))}</p>
      <p className="mt-2 border-t border-line pt-2 text-[12px] leading-snug text-mute">{P.caveat}</p>
    </Panel>
  );
}
