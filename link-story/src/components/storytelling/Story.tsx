"use client";
/**
 * Metro edition: a 3D train fills the screen and stays put while the world
 * slides past. Each chapter is a station; its text cards scroll over the scene,
 * the station information board (right / top on phones) switches by beat, and
 * the route map at the bottom draws itself as the journey goes on.
 */
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { chapters } from "@/data/coins/link/chapters";
import { registerSection, initScrollEngine } from "@/animations/scrollController";
import { useI18n } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { useIsMobile, useReducedMotion } from "@/hooks/useMedia";
import InfoBoard from "@/components/board/InfoBoard";

const TrainScene = dynamic(() => import("@/components/train/TrainScene"), { ssr: false });

function Bulb() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 16 16">
      <path d="M8 1.5a4.8 4.8 0 0 0-2.9 8.6c.5.4.8 1 .8 1.6v.3h4.2v-.3c0-.6.3-1.2.8-1.6A4.8 4.8 0 0 0 8 1.5z" fill="currentColor" />
      <rect x="6" y="13" width="4" height="1.6" rx=".8" fill="currentColor" />
    </svg>
  );
}

export function Roundel({ n, color, size = 34 }: { n: number; color: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-white font-bold text-ink"
      style={{ width: size, height: size, border: `${Math.round(size * 0.17)}px solid ${color}`, fontSize: size * 0.36 }}
    >
      {String(n).padStart(2, "0")}
    </span>
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

  const offset = mobile ? "60svh" : "24svh";
  const card = "pointer-events-auto rounded-2xl bg-white shadow-[0_22px_50px_-24px_rgba(22,32,44,0.45)] ring-1 ring-black/5";

  return (
    <div ref={storyRef} id="story" className="relative">
      <div className="sticky top-0 z-0 -mb-[100svh] h-[100svh] overflow-hidden">
        <div className="sky absolute inset-0" />
        <div className="absolute inset-0">
          <TrainScene mobile={mobile} />
        </div>
      </div>

      <InfoBoard mobile={mobile} />

      <main id="content" className="pointer-events-none relative z-10">
        {chapters.map((c, i) => {
          const ch = t.chapters[i];
          const H = `${c.height * 100}svh`;
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
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ amount: 0.35, margin: "0px 0px -8% 0px" }}
                    transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
                    className="absolute inset-x-0 px-3 md:px-7"
                    style={{ top: `calc(${p} * ${H} + ${hero ? (mobile ? "63svh" : "13svh") : offset})` }}
                  >
                    <div className={`${card} relative overflow-hidden ${hero ? "max-w-[29rem] p-5 md:p-7" : "max-w-[25.5rem] p-4 pl-5 md:p-5 md:pl-6"}`}>
                      <span aria-hidden className="absolute inset-y-0 left-0 w-[5px]" style={{ background: c.line }} />
                      {hero ? (
                        <header>
                          <div className="flex items-center gap-3">
                            <img src={asset("/img/link-mark.png")} alt="" width={40} height={46} />
                            <span className="tag rounded-full px-3 py-1 text-white" style={{ background: c.line }}>
                              {t.ui.stops}
                            </span>
                          </div>
                          <h1 id="chapter-1-title" className="serif mt-4 text-[40px] leading-[1.02] md:text-[54px]">
                            {t.ui.brand}
                          </h1>
                          <p className="mt-2 text-[16px] leading-snug text-mute">{t.ui.tagline}</p>
                          <p className="mt-4 text-[17px] font-semibold leading-snug" style={{ color: c.line }}>
                            {ch.question}
                          </p>
                          <p className="mt-3 text-[17px] font-bold leading-snug">{beat.title}</p>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-2 text-[15px] leading-relaxed text-ink/80">
                              {b}
                            </p>
                          ))}
                          <ol className="mt-5 flex flex-wrap gap-1.5" aria-label={t.ui.contents}>
                            {t.acts.map((a, k) => (
                              <li key={a} className="rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] font-medium text-mute">
                                <span className="font-bold text-ink">{k + 1}</span> {a}
                              </li>
                            ))}
                          </ol>
                        </header>
                      ) : (
                        <>
                          {j === 0 && (
                            <header className="mb-3.5">
                              <div className="flex items-center gap-2.5">
                                <Roundel n={i + 1} color={c.line} size={30} />
                                <span className="tag text-mute">
                                  {t.ui.station} {String(i + 1).padStart(2, "0")} · {t.acts[c.act]}
                                </span>
                              </div>
                              <h2 id={`chapter-${i + 1}-title`} className="serif mt-3 text-[27px] leading-[1.08] md:text-[32px]">
                                {ch.title}
                              </h2>
                              <p className="mt-1.5 text-[15.5px] font-semibold leading-snug" style={{ color: c.line }}>
                                {ch.question}
                              </p>
                            </header>
                          )}
                          <h3 className="text-[17px] font-bold leading-snug md:text-[18.5px]">{beat.title}</h3>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-2 text-[14.5px] leading-relaxed text-ink/80 md:text-[15px]">
                              {b}
                            </p>
                          ))}
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
                            <aside className="mt-3.5 rounded-xl border-2 px-3.5 py-2.5" style={{ borderColor: c.line + "55" }}>
                              <div className="text-[11.5px] font-bold uppercase tracking-wide" style={{ color: c.line }}>
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
