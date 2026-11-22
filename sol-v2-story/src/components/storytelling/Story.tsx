"use client";
/**
 * The Ship of Light: text cards scroll on the left; a sticky 2D stage on the right
 * (top half on phones) plays the current chapter's scene; the flight path runs
 * along the bottom.
 */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { chapters, C } from "@/data/coins/sol/chapters";
import { registerSection, initScrollEngine } from "@/animations/scrollController";
import { useI18n } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { useIsMobile, useReducedMotion } from "@/hooks/useMedia";
import Stage from "@/components/stage/Stage";

function Bulb() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 16 16">
      <path d="M8 1.5a4.8 4.8 0 0 0-2.9 8.6c.5.4.8 1 .8 1.6v.3h4.2v-.3c0-.6.3-1.2.8-1.6A4.8 4.8 0 0 0 8 1.5z" fill="currentColor" />
      <rect x="6" y="13" width="4" height="1.6" rx=".8" fill="currentColor" />
    </svg>
  );
}

/** three slanted light bars */
export function Bars({ color, size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 30 24" aria-hidden>
      <defs>
        <linearGradient id="barsG" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={color ?? C.purple} />
          <stop offset="1" stopColor={color ?? C.green} />
        </linearGradient>
      </defs>
      <polygon points="4 2 28 2 25 6 1 6" fill="url(#barsG)" />
      <polygon points="1 10 25 10 28 14 4 14" fill="url(#barsG)" />
      <polygon points="4 18 28 18 25 22 1 22" fill="url(#barsG)" />
    </svg>
  );
}

export default function Story() {
  const { t } = useI18n();
  const storyRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!storyRef.current) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    return initScrollEngine(storyRef.current, reduced);
  }, [reduced]);

  const offset = mobile ? "62svh" : "24svh";
  const card = "pointer-events-auto relative overflow-hidden rounded-[22px] bg-white/95 shadow-[0_24px_60px_-30px_rgba(91,43,179,0.55)] ring-1 ring-[#e6e1f2] backdrop-blur";

  return (
    <div ref={storyRef} id="story" className="relative">
      <div className="space sticky top-0 z-0 -mb-[100svh] h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[560px] w-[560px] rounded-full bg-[#eadcff] opacity-80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-52 right-[22%] h-[520px] w-[520px] rounded-full bg-[#d4f8e8] opacity-80 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[#e2ecff] opacity-70 blur-3xl" />
        <Stage mobile={mobile} />
      </div>

      <main id="content" className="pointer-events-none relative z-10">
        {chapters.map((c, i) => {
          const ch = t.chapters[i];
          const H = `${c.height * 100}svh`;
          const tint = c.color;
          return (
            <section key={c.id} ref={(el) => registerSection(i, el)} id={`chapter-${i + 1}`} aria-labelledby={`chapter-${i + 1}-title`} className="relative" style={{ height: H }}>
              <p className="sr-only">{ch.figure}</p>
              {c.beats.map((p, j) => {
                const beat = ch.beats[j];
                if (!beat) return null;
                const hero = i === 0 && j === 0;
                return (
                  <motion.article
                    key={j}
                    initial={{ opacity: 0, x: mobile ? 0 : -28, y: mobile ? 24 : 0 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ amount: 0.35, margin: "0px 0px -8% 0px" }}
                    transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
                    className={`absolute px-3 ${mobile ? "inset-x-0" : "left-7 w-[430px]"}`}
                    style={{ top: `calc(${p} * ${H} + ${hero ? (mobile ? "60svh" : "13svh") : offset})` }}
                  >
                    <div className={`${card} ${hero ? "p-6" : "p-5"}`}>
                      <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: hero ? `linear-gradient(90deg, ${C.purple}, ${C.green})` : `linear-gradient(90deg, ${tint}, ${tint}00)` }} />
                      {hero ? (
                        <header>
                          <div className="flex items-center gap-3">
                            <img src={asset("/img/sol-mark.png")} alt="" width={34} height={30} />
                            <span className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: C.violet }}>
                              {t.ui.kicker}
                            </span>
                          </div>
                          <h1 id="chapter-1-title" className="serif mt-4 text-[40px] leading-[1.02] md:text-[50px]">
                            {t.ui.brand}
                          </h1>
                          <p className="mt-2.5 text-[15.5px] leading-snug text-mute">{t.ui.tagline}</p>
                          <p className="mt-4 rounded-xl px-3.5 py-2.5 text-[15.5px] font-semibold leading-snug" style={{ color: C.violet, background: "linear-gradient(90deg,#efe6ff,#e2fbf0)" }}>
                            {ch.question}
                          </p>
                          <p className="mt-4 text-[17px] font-bold leading-snug">{beat.title}</p>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-1.5 text-[15px] leading-relaxed text-ink/80">
                              {b}
                            </p>
                          ))}
                          <ol className="mt-5 flex flex-wrap gap-1.5" aria-label={t.ui.contents}>
                            {t.acts.map((a) => (
                              <li key={a} className="flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] font-medium text-mute">
                                <Bars size={11} />
                                {a}
                              </li>
                            ))}
                          </ol>
                        </header>
                      ) : (
                        <>
                          {j === 0 && (
                            <header className="mb-3">
                              <div className="flex items-center gap-2">
                                <Bars color={tint} size={16} />
                                <span className="tag" style={{ color: tint }}>
                                  {t.ui.chapter} {String(i + 1).padStart(2, "0")} · {t.acts[c.act]}
                                </span>
                              </div>
                              <h2 id={`chapter-${i + 1}-title`} className="serif mt-2.5 text-[26px] leading-[1.1] md:text-[30px]">
                                {ch.title}
                              </h2>
                              <p className="mt-1.5 text-[15px] font-semibold leading-snug" style={{ color: tint }}>
                                {ch.question}
                              </p>
                            </header>
                          )}
                          <h3 className="flex items-start gap-2 text-[17px] font-bold leading-snug md:text-[18px]">
                            <span className="mt-[8px] h-[6px] w-4 shrink-0 -skew-x-[30deg] rounded-[2px]" style={{ background: tint }} />
                            {beat.title}
                          </h3>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-2 text-[14.5px] leading-relaxed text-ink/80 md:text-[15px]">
                              {b}
                            </p>
                          ))}
                          {beat.term && <p className="mt-2 text-[12.5px] leading-snug text-mute">🔤 {beat.term}</p>}
                          {beat.insight && (
                            <aside className="mt-3.5 rounded-xl bg-[#fff4df] px-3.5 py-2.5">
                              <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide text-[#a8670e]">
                                <Bulb />
                                {t.ui.insight}
                              </div>
                              <p className="mt-1 text-[14.5px] font-semibold leading-snug text-ink">{beat.insight}</p>
                            </aside>
                          )}
                          {j === c.beats.length - 1 && ch.takeaway && (
                            <aside className="mt-3.5 rounded-xl border-2 px-3.5 py-2.5" style={{ borderColor: tint + "55" }}>
                              <div className="text-[11.5px] font-bold uppercase tracking-wide" style={{ color: tint }}>
                                {t.ui.inShort}
                              </div>
                              <p className="mt-1 text-[14.5px] font-semibold leading-snug">{ch.takeaway}</p>
                            </aside>
                          )}
                        </>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </section>
          );
        })}
      </main>
    </div>
  );
}
