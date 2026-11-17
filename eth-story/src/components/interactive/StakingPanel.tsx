"use client";
import { useRef } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";
import { Badge, IconButton, Panel, Segmented, Slider, Stat } from "./ui";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { stakingStore } from "@/lib/simStores";
import { DEPOSIT, ETH_USD, stakeBalance } from "@/lib/models";

export default function StakingPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.staking;
  const behaviour = useStore(stakingStore, (s) => s.behaviour);
  const day = useStore(stakingStore, (s) => s.day);
  const others = useStore(stakingStore, (s) => s.othersSlashed);
  const tw = useRef<gsap.core.Tween | null>(null);
  const nf = (n: number, d = 2) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

  const run = () => {
    tw.current?.kill();
    const o = { d: 0 };
    stakingStore.set({ day: 0 });
    tw.current = gsap.to(o, { d: 365, duration: 4.5, ease: "none", onUpdate: () => stakingStore.set({ day: o.d }) });
  };
  const bal = stakeBalance(behaviour, day, others);
  const chg = bal - DEPOSIT;

  return (
    <Panel title={P.title} badge={<Badge kind="ill">{t.ui.illustrative}</Badge>}>
      <p className="text-[12.5px] leading-snug text-mute">{P.hint}</p>
      <div className="mt-3">
        <Segmented
          label={P.behaviour}
          value={String(behaviour)}
          onChange={(x) => {
            tw.current?.kill();
            stakingStore.set({ behaviour: Number(x), day: 0 });
          }}
          options={P.behaviours.map((s, i) => ({ value: String(i), label: s }))}
        />
      </div>
      <p className="mt-2 text-[13px] leading-snug text-ink/85">{P.describe[behaviour]}</p>
      {behaviour === 2 && (
        <Slider id="stake-others" label={P.others} value={Math.round(others * 100)} min={0} max={33} step={1} onChange={(x) => stakingStore.set({ othersSlashed: x / 100 })} format={(x) => `${x}%`} />
      )}
      <div className="mt-2 flex items-center gap-2">
        <IconButton primary onClick={run} label={P.run}>
          <Play size={13} /> {P.run}
        </IconButton>
        <div className="h-1 flex-1 bg-line">
          <div className="h-full bg-accent" style={{ width: `${(day / 365) * 100}%` }} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
        <Stat label={P.balance} value={`${nf(bal, 3)} ETH`} tone={chg < 0 ? "warn" : "accent"} />
        <Stat label={P.change} value={`${chg >= 0 ? "+" : ""}${nf(chg, 3)}`} tone={chg < 0 ? "warn" : "ink"} />
        <Stat label={P.usd} value={`${chg >= 0 ? "+" : "−"}$${nf(Math.abs(chg * ETH_USD), 0)}`} />
      </div>
      <p className="mt-2 border-t border-line pt-2 text-[12px] leading-snug text-mute">{P.caveat}</p>
    </Panel>
  );
}
