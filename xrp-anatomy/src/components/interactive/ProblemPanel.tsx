"use client";
import { Badge, Panel, Segmented, Slider, Stat } from "./ui";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { problemStore } from "@/lib/simStores";
import { useTween } from "@/hooks/useTween";
import { PANEL_CHANNELS } from "@/components/visualization/scenes/ProblemScene";

export default function ProblemPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.problem;
  const channel = useStore(problemStore, (s) => s.channel);
  const hops = useStore(problemStore, (s) => s.hops);
  const pct = PANEL_CHANNELS[channel];
  const fee = (200 * pct) / 100;
  const shownFee = useTween(fee, 0.5);
  const nf = (n: number, d = 2) => new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
  return (
    <Panel title={P.title} badge={<Badge kind="fact">World Bank</Badge>}>
      <div className="tag mb-1.5 text-mute">{P.channel}</div>
      <Segmented
        label={P.channel}
        value={String(channel) as "0" | "1" | "2"}
        onChange={(v) => problemStore.set({ channel: Number(v) })}
        options={P.channels.map((c, i) => ({ value: String(i) as "0" | "1" | "2", label: c }))}
      />
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="tag text-mute">{P.fee}</div>
          <div className="mono text-[34px] leading-none text-warn">−${nf(shownFee)}</div>
        </div>
        <div className="text-right">
          <div className="tag text-mute">{P.arrives}</div>
          <div className="mono text-[22px] leading-none text-accent">${nf(200 - shownFee)}</div>
        </div>
      </div>
      <div className="mt-3 h-2 w-full bg-line" aria-hidden>
        <div className="h-full bg-warn transition-[width] duration-500" style={{ width: `${(pct / 16) * 100}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
        <Stat label={P.pct} value={`${nf(pct, 1)}%`} tone="warn" />
        <Stat label={P.parties} value={hops + 2} />
      </div>
      <div className="mt-2">
        <Slider id="problem-hops" label={P.hops} value={hops} min={0} max={3} step={1} onChange={(v) => problemStore.set({ hops: v })} format={(v) => String(v)} />
        <p className="text-[12px] leading-snug text-mute">{P.hopsNote}</p>
      </div>
      <p className="mt-3 border-l-2 border-accent pl-3 text-[13px] leading-snug text-ink/85">{P.speed}</p>
      <p className="mt-2 text-[12px] leading-snug text-mute">{P.source}</p>
    </Panel>
  );
}
