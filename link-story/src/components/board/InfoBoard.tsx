"use client";
/**
 * Station information board: line-coloured header with the station roundel,
 * a strip showing the run to the next station, the chapter poster (switches by
 * beat) and a footer with beat dots and the next stop.
 * Desktop: fixed on the right. Phone: compact, under the header.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { beatAt, chapters, CHAPTER_COUNT, DEPART } from "@/data/coins/link/chapters";
import { goToChapter } from "@/animations/scrollController";
import { useI18n } from "@/lib/i18n";
import { useG } from "@/hooks/useG";
import { Poster, PH, PW } from "./posters";

function Roundel({ n, color, size }: { n: number; color: string; size: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-white font-bold text-ink"
      style={{ width: size, height: size, boxShadow: `inset 0 0 0 ${Math.round(size * 0.15)}px ${color}, 0 0 0 2px #fff`, fontSize: size * 0.36 }}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

export default function InfoBoard({ mobile }: { mobile: boolean }) {
  const { t, lang } = useI18n();
  const g = useG(0.004);
  const { ch, beat, p } = beatAt(g);
  const c = chapters[ch];
  const last = ch >= CHAPTER_COUNT - 1;
  const departing = !last && p > DEPART;
  const run = departing ? (p - DEPART) / (1 - DEPART) : 0;
  const next = Math.min(CHAPTER_COUNT - 1, ch + 1);

  // fit the fixed-size poster into the board width
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(Math.min(1, el.clientWidth / PW)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const posterH = mobile ? Math.min(PH * k, 214) : PH * k;
  const kk = mobile ? Math.min(k, posterH / PH) : k;

  return (
    <aside
      style={{ transform: "translateZ(0)" }}
      aria-live="polite"
      aria-label={`${t.ui.station} ${ch + 1}: ${t.chapters[ch].label}`}
      className={`fixed z-30 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg ${
        mobile ? "inset-x-2 top-[62px]" : "right-6 top-[84px] w-[448px]"
      }`}
    >
      {/* header */}
      <div className="relative flex items-center gap-3 px-4 py-2.5 text-white transition-colors duration-500" style={{ background: c.line }}>
        <Roundel n={ch + 1} color={c.line} size={mobile ? 30 : 36} />
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] opacity-85">
            {departing ? t.ui.departing : t.ui.now} · {t.acts[c.act]}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={ch + lang + (departing ? "d" : "")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className={`truncate font-bold leading-tight ${mobile ? "text-[16px]" : "text-[18px]"}`}
            >
              {departing ? `→ ${t.chapters[next].label}` : t.chapters[ch].label}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-right text-[10px] font-semibold uppercase leading-tight tracking-wider opacity-85">
          {t.ui.line}
          <br />
          <span className="text-[14px] tracking-normal">LINK</span>
        </div>
      </div>
      {/* run strip */}
      <div className="relative h-[5px] bg-[#e9eef3]">
        <div className="absolute inset-y-0 left-0" style={{ width: `${(departing ? run : 0) * 100}%`, background: chapters[next].line }} />
      </div>

      {/* poster */}
      <div ref={box} className={mobile ? "px-3 pt-2.5" : "px-4 pt-3.5"}>
        <div style={{ height: posterH }} className="relative">
          <div
            key={ch}
            className="absolute left-0 top-0 origin-top-left animate-[fadein_.45s_ease]"
            style={{ width: PW, height: PH, transform: `scale(${kk})` }}
          >
            <Poster ch={ch} b={beat} t={t} color={c.line} />
          </div>
        </div>
      </div>

      {/* footer */}
      <div className={`flex items-center gap-2 border-t border-line ${mobile ? "mt-2 px-3 py-1.5" : "mt-3.5 px-4 py-2"}`}>
        <div className="flex gap-1" aria-hidden>
          {c.beats.map((_, i) => (
            <span key={i} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === beat ? 18 : 6, background: i <= beat ? c.line : "#d5dce4" }} />
          ))}
        </div>
        <button
          onClick={() => goToChapter(last ? 0 : next)}
          className="ml-auto flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-mute hover:text-ink"
        >
          <span className="shrink-0">{last ? t.ui.terminus : t.ui.next}</span>
          {!last && (
            <>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: chapters[next].line }} />
              <span className="truncate text-ink">
                {String(next + 1).padStart(2, "0")} {t.chapters[next].label}
              </span>
            </>
          )}
          <span aria-hidden>→</span>
        </button>
      </div>
    </aside>
  );
}
