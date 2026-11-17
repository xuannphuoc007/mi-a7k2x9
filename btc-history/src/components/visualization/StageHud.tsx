"use client";
/** HTML layer over the chart: price ticker, event captions, the selected-event card and the crosshair readout. */
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { burstQ, chart, focusEvent, visibleEvent, X0, X1, YT, BASE_Y, type Frame } from "@/animations/chartController";
import { events, type BtcEvent } from "@/data/coins/btc/events";
import { chapters, FINALE } from "@/data/coins/btc/chapters";
import { fmtDate, money, NEWS_FROM, priceAt } from "@/lib/btc";
import { range, smooth, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const pct = (v: number) => `${v / 10}%`;

function place(x: number, y: number, below: boolean) {
  const tx = x < 230 ? "-10%" : x > 770 ? "-90%" : "-50%";
  const ty = below ? "18px" : "calc(-100% - 18px)";
  return { left: pct(x), top: pct(y), transform: `translate(${tx}, ${ty})` };
}

const tone = (e: BtcEvent) => (e.kind === "crash" || (e.kind === "macro" && e.cat === "crisis") ? "text-warn" : e.kind === "ath" ? "text-gold" : "text-accent");

export default function StageHud({ f, mobile }: { f: Frame; mobile: boolean }) {
  const { t, lang, locale } = useI18n();
  const selectedId = useStore(chart, (s) => s.selected);
  const cursor = useStore(chart, (s) => s.cursor);
  const probe = useStore(chart, (s) => s.probe);
  const view = useStore(chart, (s) => s.view);
  const scale = useStore(chart, (s) => s.scale);
  const ch = f.ch;
  const c = t.chapters[ch];
  const span = f.win.t1 - f.win.t0;

  const price = f.dot.price;
  const tickerT = f.dot.t;
  const finaleOut = ch === FINALE ? smooth(range(f.local, 0.52, 0.6)) : 0;

  // the event the playhead most recently crossed gets a caption
  let current: BtcEvent | null = null;
  let currentAge = 1;
  if (!selectedId && cursor === null && f.hero < 0.5) {
    for (const e of events) {
      if (e.future || !visibleEvent(e, f.T, ch)) continue;
      if (e.t < f.win.t0 || e.t > f.win.t1) continue;
      const age = burstQ(f.g, e.t, 1);
      if (age >= 0 && age < 0.34 && age < currentAge) {
        current = e;
        currentAge = age;
      }
    }
  }
  const capO = current ? (1 - smooth(range(currentAge, 0.24, 0.34))) * (1 - finaleOut) : 0;
  const selected = selectedId ? events.find((e) => e.id === selectedId) ?? null : null;

  const nearest = cursor !== null ? events.find((e) => !e.future && Math.abs(e.t - cursor) < span * 0.012) : undefined;
  const scaleLabel = view === "dd" ? t.chart.dd : scale === "linear" ? t.chart.linear : t.chart.log;

  return (
    <div className="pointer-events-none absolute inset-0" style={{ opacity: 1 }}>
      {/* chapter tag + scale */}
      <div className="absolute left-[4%] top-[3.2%] max-w-[55%]" style={{ opacity: 1 - f.hero }}>
        <div className="tag flex items-center gap-2 text-mute">
          <span className="text-accent">FIG. {String(ch + 1).padStart(2, "0")}</span>
          <span className="h-px w-5 bg-mute/60" />
          <span className="truncate">{c.years}</span>
        </div>
        <div className={`tag mt-1 text-mute/80 ${mobile ? "hidden" : ""}`}>
          {t.chart.pair} · {scaleLabel}
          {tickerT >= NEWS_FROM && price !== null ? ` · ${t.ui.news}` : ""}
        </div>
      </div>

      {/* price ticker */}
      <div className="absolute right-[4%] top-[2.6%] text-right" style={{ opacity: 1 - f.hero }}>
        <div className={`mono leading-none tracking-tight ${cursor !== null ? "text-ink" : "text-accent glow-text"} ${mobile ? "text-[20px]" : "text-[34px]"}`}>
          {price !== null ? money(price, locale) : "—"}
        </div>
        <div className="tag mt-1.5 text-mute">{price !== null ? fmtDate(tickerT, lang) : t.ui.noPrice}</div>
      </div>

      {/* hero label */}
      {f.hero > 0.02 && !mobile && (
        <div className="absolute inset-x-0 bottom-[11%] text-center" style={{ opacity: f.hero }}>
          <div className="tag text-mute">{lang === "vi" ? "2008 → 2026 · 10 chương" : "2008 → 2026 · 10 chapters"}</div>
          <div className="serif mt-2 text-[15px] text-ink/80 md:text-[18px]">{t.ui.brandSub}</div>
        </div>
      )}

      {/* caption for the latest event */}
      {current && capO > 0.02 && (
        <div
          key={current.id}
          className="absolute"
          style={{ ...place(f.xOf(current.t), current.t < 2010.54 ? BASE_Y - 170 : f.yOf(current.t), ((current.dy ?? -1) > 0 && f.yOf(current.t) < 640) || (current.t >= 2010.54 && f.yOf(current.t) < 330)), opacity: capO }}
        >
          <div className={`border border-line bg-paper/90 px-2.5 py-1.5 backdrop-blur-sm ${mobile ? "max-w-[46vw]" : "max-w-[260px]"}`}>
            <div className={`tag ${tone(current)}`}>{fmtDate(current.t, lang)}</div>
            <div className={`serif leading-tight ${mobile ? "text-[12px]" : "text-[15px]"}`}>{current[lang].title}</div>
          </div>
        </div>
      )}

      {/* crosshair readout */}
      {cursor !== null && (
        <div className="absolute" style={place(f.dot.x, f.dot.y, f.dot.y < 420)}>
          <div className="border border-ink/60 bg-paper/95 px-2.5 py-1.5">
            <div className="tag text-mute">{fmtDate(cursor, lang)}</div>
            <div className="mono text-[14px] text-ink">{price !== null ? money(price, locale) : "—"}</div>
            {nearest && <div className={`mt-0.5 max-w-[200px] text-[12px] leading-snug ${tone(nearest)}`}>{nearest[lang].title}</div>}
          </div>
        </div>
      )}

      {/* probe chip */}
      {probe !== null && probe >= f.win.t0 && probe <= f.win.t1 && (
        <div className="absolute" style={{ left: pct(Math.min(Math.max(f.xOf(probe), X0 + 40), X1 - 40)), top: pct(YT - 30), transform: "translate(-50%, -100%)" }}>
          <div className="tag whitespace-nowrap border border-gold/60 bg-paper/90 px-2 py-1 text-gold">
            {fmtDate(probe, lang)}
            {priceAt(probe) !== null && f.vis[2] < 0.5 ? ` · ${money(priceAt(probe)!, locale)}` : ""}
          </div>
        </div>
      )}

      {/* selected event card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            className={`pointer-events-auto absolute top-[12%] border border-ink/80 bg-paper/95 shadow-[0_0_40px_rgba(247,147,26,0.12)] backdrop-blur ${
              mobile ? "inset-x-[3%] p-3" : `${f.xOf(selected.t) < 500 ? "right-[4%]" : "left-[4%]"} w-[min(56%,360px)] p-4`
            }`}
          >
            <button
              onClick={() => focusEvent(null)}
              className="absolute right-2 top-2 text-mute hover:text-ink"
              aria-label={t.panels.events.close}
            >
              <X size={16} />
            </button>
            <div className={`tag ${tone(selected)}`}>
              {fmtDate(selected.t, lang)} · {t.cats[selected.cat]}
              {selected.future ? ` · ${t.ui.future}` : ""}
            </div>
            <h4 className={`serif mt-1 pr-5 leading-tight ${mobile ? "text-[16px]" : "text-[21px]"}`}>{selected[lang].title}</h4>
            <p className={`mt-1.5 leading-snug text-ink/85 ${mobile ? "line-clamp-3 text-[12.5px]" : "text-[14px]"}`}>{selected[lang].body}</p>
            {!selected.future && priceAt(selected.t) !== null && (
              <div className="mono mt-2 text-[12px] text-accent">1 BTC ≈ {money(priceAt(selected.t)!, locale)}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">{chapters[ch].id}</span>
    </div>
  );
}
