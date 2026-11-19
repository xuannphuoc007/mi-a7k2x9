"use client";
import { useI18n } from "@/lib/i18n";
import { useView } from "@/lib/store";
import { band, ramp, smooth, START, LEN, type SceneId } from "@/lib/timeline";
import { pegPrice, pegScenario, svbPrice, svbX, counterClosed6 } from "../world/Market";
import { useLocal } from "./useLocal";

const shell = "pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-3";
const pill = "flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 rounded-2xl border border-black/10 bg-white/90 px-4 py-2.5 shadow-[0_10px_40px_rgba(15,35,64,.10)] backdrop-blur-sm md:px-5";

/** Scene 02: a worked example of minting, presets cycle on scroll. */
export function MintHud() {
  const { t, locale } = useI18n();
  const m = t.mint;
  const tl = useLocal("s02");
  const show = band(tl, 0.08, 0.12, 0.8, 0.84);
  const ex = tl > 0.6;
  const presets = [100, 1000, 10000];
  const pi = tl < 0.36 ? 1 : tl < 0.44 ? 0 : tl < 0.52 ? 1 : 2;
  const amt = presets[pi];
  const done = [tl > 0.1, tl > 0.24, tl > 0.38];
  return (
    <div className={shell} style={{ opacity: show }}>
      <div className={pill}>
        {ex ? (
          <span className="mono text-[12.5px] text-warm">{m.exchange}</span>
        ) : (
          <>
            <span className="mono text-[10px] uppercase tracking-[.14em] text-volt">{m.title}</span>
            {m.steps.map((s, i) => (
              <span key={s} className="flex items-center gap-1.5 text-[12px]" style={{ color: done[i] ? "#0f2340" : "#9aa8bb" }}>
                <span className="grid h-4 w-4 place-items-center rounded-full text-[9px] text-white" style={{ background: done[i] ? "#2775ca" : "#c4cdd8" }}>
                  ✓
                </span>
                {s}
              </span>
            ))}
            <span className="flex items-center gap-1 border-l border-black/10 pl-4">
              {presets.map((p, i) => (
                <span key={p} className={`mono rounded-full px-2 py-0.5 text-[11px] ${i === pi && tl > 0.3 ? "bg-usdc text-white" : "text-mist"}`}>
                  ${p.toLocaleString(locale)}
                </span>
              ))}
            </span>
            <span className="mono text-[12.5px] text-warm">
              ${amt.toLocaleString(locale)} → {(tl > 0.38 ? amt : 0).toLocaleString(locale)} USDC <span className="text-mist">· {m.rule}</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/** Scene 06: simulated market price, gap and whether arbitrage can act. */
export function PegHud() {
  const { t, locale } = useI18n();
  const p = t.peg;
  const tl = useLocal("s06", 0.002);
  const show = band(tl, 0.08, 0.12, 0.88, 0.92);
  const sc = pegScenario(tl);
  const price = pegPrice(Math.max(0.06, tl));
  const gap = Math.abs(1 - price) * 10000;
  const status = counterClosed6(tl) ? 2 : gap < 6 ? 0 : 1;
  const col = status === 2 ? "#c4512f" : status === 1 ? "#1f66b8" : "#4f6380";
  return (
    <div className={shell} style={{ opacity: show }}>
      <div className={pill}>
        <span className="flex gap-1">
          {p.scen.map((s, i) => (
            <span key={s} className={`mono rounded-full px-2 py-0.5 text-[10.5px] uppercase tracking-wider ${i === sc ? "bg-warm text-night" : "text-mist"}`}>
              {s}
            </span>
          ))}
        </span>
        <span className="text-[12px] text-mist">
          {p.price} <b className="mono text-[13.5px] text-warm">${price.toFixed(4)}</b>
        </span>
        <span className="text-[12px] text-mist">
          {p.gap} <b className="mono text-[13px] text-warm">{gap.toLocaleString(locale, { maximumFractionDigits: 0 })} bps</b>
        </span>
        <span className="text-[12px] text-mist">
          {p.cost} <b className="mono text-[13px] text-warm">{p.costv[sc]}</b>
        </span>
        <span className="mono text-[11.5px]" style={{ color: col }}>
          ● {p.status[status]}
        </span>
      </div>
    </div>
  );
}

/** Scene 08: the March 2023 weekend, day by day. */
export function SvbHud() {
  const { t } = useI18n();
  const s = t.svb;
  const tl = useLocal("s08", 0.002);
  const show = band(tl, 0.06, 0.1, 0.92, 0.96);
  const x = svbX(tl);
  const pos = [0, 0.32, 0.58, 0.72, 1.0];
  let di = 0;
  pos.forEach((p, i) => x >= p - 0.02 && (di = i));
  const price = svbPrice(x);
  return (
    <div className={shell} style={{ opacity: show }}>
      <div className={pill}>
        <span className="flex gap-1">
          {s.days.map((d, i) => (
            <span key={d} className={`mono rounded-full px-2 py-0.5 text-[11px] ${i === di ? "bg-warm text-night" : i < di ? "text-warm" : "text-mist/60"}`}>
              {d}
            </span>
          ))}
        </span>
        <span className="text-[12px] text-mist">
          {s.price} <b className="mono text-[13.5px]" style={{ color: price < 0.99 ? "#c4512f" : "#0f2340" }}>${price.toFixed(4)}</b>
        </span>
        <span className="text-[11px] text-mist">{s.note}</span>
      </div>
    </div>
  );
}

/** Scene 09: the redemption steps. */
export function RedeemHud() {
  const { t } = useI18n();
  const r = t.redeem;
  const tl = useLocal("s09");
  const show = band(tl, 0.04, 0.08, 0.44, 0.5);
  const done = [tl > 0.16, tl > 0.27, tl > 0.42];
  return (
    <div className={shell} style={{ opacity: show }}>
      <div className={pill}>
        <span className="mono text-[10px] uppercase tracking-[.14em] text-volt">{r.title}</span>
        {r.steps.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5 text-[12px]" style={{ color: done[i] ? "#0f2340" : "#9aa8bb" }}>
            <span className="grid h-4 w-4 place-items-center rounded-full text-[9px] text-white" style={{ background: done[i] ? (i === 1 ? "#d0603f" : "#2775ca") : "#c4cdd8" }}>
              ✓
            </span>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

const PARTS = ["issuance", "reserves", "chains", "cctp", "markets", "controls", "redemption"] as const;
const CHAPTER: Record<(typeof PARTS)[number], SceneId> = { issuance: "s02", reserves: "s03", chains: "s04", cctp: "s05", markets: "s06", controls: "s07", redemption: "s09" };

/** The final interactive system map: buttons fly the camera to each part of the machine. */
export function MapPanel({ vh }: { vh: number }) {
  const { t } = useI18n();
  const mp = t.map;
  const tl = useLocal("end");
  const { focus, setFocus } = useView();
  const show = smooth(ramp(tl, 0.28, 0.36));
  const sel = focus as (typeof PARTS)[number] | null;
  return (
    <div className="fixed inset-x-0 top-[64px] z-30 flex justify-center px-3" style={{ opacity: show, pointerEvents: show > 0.5 ? "auto" : "none" }}>
      <div className="w-full max-w-[920px] rounded-2xl border border-black/10 bg-white/92 p-4 shadow-[0_10px_40px_rgba(15,35,64,.12)] backdrop-blur-sm">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="display text-[22px] font-semibold tracking-tight text-warm md:text-[28px]">{mp.title}</h2>
          <span className="text-[12.5px] text-mist">{mp.hint}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFocus(null)} className={`mono rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-wider ${!sel ? "border-warm bg-warm text-night" : "border-black/10 text-mist hover:text-warm"}`}>
            {mp.overview}
          </button>
          {PARTS.map((k) => (
            <button
              key={k}
              onClick={() => setFocus(k)}
              className={`mono rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-wider ${sel === k ? "border-usdc bg-usdc text-white" : "border-black/10 text-warm hover:border-usdc"}`}
            >
              {mp.parts[k][0]}
            </button>
          ))}
        </div>
        {sel && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3">
            <span className="text-[14px] text-warm">{mp.parts[sel][1]}</span>
            <button
              onClick={() => {
                setFocus(null);
                window.scrollTo({ top: (START[CHAPTER[sel]] + 0.02 * LEN[CHAPTER[sel]]) * vh, behavior: "auto" });
              }}
              className="mono text-[11px] uppercase tracking-[.14em] text-volt hover:underline"
            >
              {mp.go} {t.scenes.find((s) => s.id === CHAPTER[sel])?.num} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
