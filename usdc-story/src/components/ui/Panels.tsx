"use client";
import { useI18n } from "@/lib/i18n";
import { band, ramp, smooth, clamp } from "@/lib/timeline";
import { useLocal } from "./useLocal";

const fmt = (n: number, locale: string) => n.toLocaleString(locale, { maximumFractionDigits: 0 });

/** Live counters while 1,000 USDC crosses from Ethereum to Solana (illustrative). */
export function PortalHud() {
  const { t, locale } = useI18n();
  const tl = useLocal("s05");
  const h = t.hud;
  const show = band(tl, 0.1, 0.14, 0.84, 0.88);
  const eth = 1000 * (1 - smooth(ramp(tl, 0.16, 0.27)));
  const sol = 1000 * smooth(ramp(tl, 0.76, 0.86));
  const flight = tl > 0.27 && tl < 0.8;
  const total = eth + sol;
  const rows: [string, string, string][] = [
    [h.eth, fmt(eth, locale), eth < 999 && eth > 1 ? "#c4512f" : "#4f6380"],
    [h.flight, flight ? "✉ 1 msg" : "—", flight ? "#1f66b8" : "#9aa8bb"],
    [h.sol, fmt(sol, locale), sol > 1 && sol < 999 ? "#2775ca" : "#4f6380"],
  ];
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-3"
      style={{ opacity: show, transform: `translateY(${(1 - show) * 10}px)` }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 rounded-full border border-black/10 bg-white/85 px-4 py-2 backdrop-blur-sm md:px-5">
        <span className="mono text-[10px] uppercase tracking-[.14em] text-volt">{h.route}</span>
        {rows.map(([k, v, c]) => (
          <span key={k} className="flex items-baseline gap-2">
            <span className="text-[11.5px] text-mist">{k}</span>
            <span className="mono text-[13px] tabular-nums" style={{ color: c }}>
              {v}
            </span>
          </span>
        ))}
        <span className="flex items-baseline gap-2 border-l border-black/10 pl-4">
          <span className="text-[11.5px] text-warm">{h.total}</span>
          <span className="mono text-[13.5px] tabular-nums text-warm">{fmt(total, locale)}</span>
        </span>
      </div>
    </div>
  );
}

/** Confirmation once the destination mint completes. */
export function Confirm() {
  const { t } = useI18n();
  const tl = useLocal("s05");
  const h = t.hud;
  const show = band(tl, 0.84, 0.86, 0.91, 0.93);
  const steps: [string, string, number][] = [
    [h.burned, "1,000.00 USDC · Ethereum", 0.845],
    [h.attested, "Circle · Iris", 0.86],
    [h.minted, "1,000.00 USDC · Solana", 0.875],
  ];
  return (
    <div
      className="pointer-events-none fixed right-4 top-[64px] z-30 w-[min(340px,calc(100vw-2rem))] rounded-xl border border-black/10 bg-white/90 p-4 shadow-[0_10px_40px_rgba(15,35,64,.12)] md:right-10 md:top-1/2 md:-translate-y-1/2"
      style={{ opacity: show }}
    >
      <div className="mono mb-3 text-[10.5px] uppercase tracking-[.16em] text-volt">{h.confirm}</div>
      {steps.map(([k, v, at]) => {
        const on = tl >= at;
        return (
          <div key={k} className="flex items-center gap-3 py-1.5">
            <span
              className="grid h-5 w-5 place-items-center rounded-full border text-[11px]"
              style={{ borderColor: on ? "#2775ca" : "#c4cdd8", color: "#ffffff", background: on ? "#2775ca" : "transparent" }}
            >
              {on ? "✓" : ""}
            </span>
            <span className="mono w-[86px] text-[11px] uppercase text-mist">{k}</span>
            <span className="mono text-[12.5px] text-warm">{v}</span>
          </div>
        );
      })}
      <div className="mono mt-2 border-t border-black/10 pt-2 text-[12px] text-ice">
        {h.change}: <span className="text-warm">0</span>
      </div>
    </div>
  );
}

/** Reserve coverage: reported normal day vs a simulated frozen-bank weekend. Plays on scroll. */
export function Coverage() {
  const { t, locale } = useI18n();
  const v = t.vault;
  const tl = useLocal("s03");
  const a = smooth(ramp(tl, 0.79, 0.85));
  const b = smooth(ramp(tl, 0.85, 0.91));
  const owed = 67.9;
  const max = 70;
  const nf = (n: number) => n.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const Bar = ({ label, val, color, k, dashed }: { label: string; val: number; color: string; k: number; dashed?: boolean }) => (
    <div className="mb-1.5">
      <div className="mb-0.5 flex justify-between text-[12px] text-mist">
        <span>{label}</span>
        <span className="mono tabular-nums text-warm">${nf(val * k)}B</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-black/5">
        <div
          className="h-full rounded-full"
          style={{ width: `${((val * k) / max) * 100}%`, background: dashed ? `repeating-linear-gradient(90deg, ${color} 0 6px, transparent 6px 9px)` : color }}
        />
      </div>
    </div>
  );
  return (
    <div className="space-y-5">
      <div style={{ opacity: 0.35 + 0.65 * a }}>
        <div className="mono mb-2 flex items-center gap-2 text-[10.5px] uppercase tracking-[.14em] text-volt">
          <span className="h-1.5 w-1.5 rounded-full bg-volt" /> {v.normal}
        </div>
        <Bar label={v.reserves} val={68.1} color="#2775ca" k={a} />
        <Bar label={v.usdc} val={owed} color="#4f6380" k={a} />
        <div className="mono text-[13px] text-warm">
          {v.cover} ≈ {((68.1 / owed) * 100 * clamp(a * 1.0)).toLocaleString(locale, { maximumFractionDigits: 1 })}%
        </div>
      </div>
      <div style={{ opacity: 0.35 + 0.65 * b }}>
        <div className="mono mb-2 flex items-center gap-2 text-[10.5px] uppercase tracking-[.14em] text-ice">
          <span className="h-1.5 w-1.5 rounded-full border border-ice" /> {t.ui.sim} · {v.stress}
        </div>
        <Bar label={v.liquid} val={60.1} color="#c4512f" k={b} dashed />
        <Bar label={v.usdc} val={owed} color="#4f6380" k={b} />
        <div className="mono text-[13px] text-risk">
          {v.cover} ≈ {((60.1 / owed) * 100 * b).toLocaleString(locale, { maximumFractionDigits: 1 })}%
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-mist">{v.stressNote}</p>
      </div>
    </div>
  );
}

/** CCTP burn-and-mint vs a typical lock-and-mint bridge. Dots run on their own (CSS), no input needed. */
export function Compare() {
  const { t } = useI18n();
  const c = t.compare;
  const Row = ({ title, steps, risk, hot, wrapped }: { title: string; steps: string[]; risk: string; hot: string; wrapped?: boolean }) => (
    <div className="mb-6">
      <div className="mono mb-2 text-[11px] uppercase tracking-[.14em]" style={{ color: hot }}>
        {title}
      </div>
      <div className="relative grid grid-cols-3 gap-2">
        <div className="absolute left-[8%] right-[8%] top-1/2 h-px -translate-y-1/2" style={{ background: `${hot}55` }} />
        <span className="flow-dot absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full" style={{ background: hot, boxShadow: `0 0 12px ${hot}` }} />
        {steps.map((s, i) => (
          <div
            key={s}
            className="relative z-10 rounded-md border px-2.5 py-2 text-[12.5px] leading-snug text-warm"
            style={{ borderColor: i === 1 && wrapped ? "#c4512f" : `${hot}66`, background: "#ffffff" }}
          >
            <span className="mono mr-1 text-[10px] text-mist">{i + 1}</span>
            {s}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[13px] text-mist">{risk}</p>
    </div>
  );
  return (
    <div className="mt-6 w-full max-w-[680px] text-left">
      <style>{`@keyframes flow{0%{left:6%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:92%;opacity:0}} .flow-dot{animation:flow 3.2s linear infinite} @media (prefers-reduced-motion: reduce){.flow-dot{animation:none;left:50%}}`}</style>
      <Row title={c.cctp} steps={c.cctpSteps} risk={c.cctpRisk} hot="#2775ca" />
      <Row title={c.bridge} steps={c.bridgeSteps} risk={c.bridgeRisk} hot="#c4512f" wrapped />
    </div>
  );
}
