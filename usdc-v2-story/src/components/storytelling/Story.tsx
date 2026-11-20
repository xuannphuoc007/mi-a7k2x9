"use client";
/**
 * Map edition: the isometric map fills the screen and stays put; chapters are
 * tall transparent sections whose text cards float over the map. Card
 * positions use the same beat fractions as the camera keyframes.
 */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { chapters, type PanelKind } from "@/data/coins/usdc/chapters";
import { registerSection, initScrollEngine } from "@/animations/scrollController";
import { useI18n } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import MapStage from "@/components/map/MapStage";
import ComparePanel from "@/components/interactive/ComparePanel";
import { useIsMobile, useReducedMotion } from "@/hooks/useMedia";

const PANELS: Record<PanelKind, () => React.ReactElement> = {
  compare: () => <ComparePanel which="compare" />,
  versus: () => <ComparePanel which="versus" />,
};

function Bulb() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 16 16">
      <path d="M8 1.5a4.8 4.8 0 0 0-2.9 8.6c.5.4.8 1 .8 1.6v.3h4.2v-.3c0-.6.3-1.2.8-1.6A4.8 4.8 0 0 0 8 1.5z" fill="currentColor" />
      <rect x="6" y="13" width="4" height="1.6" rx=".8" fill="currentColor" />
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

  const offset = mobile ? "66svh" : "26svh";
  const card = "pointer-events-auto rounded-[22px] border border-white/70 bg-white/92 shadow-[0_18px_50px_-20px_rgba(29,43,58,0.35)] backdrop-blur-md";

  return (
    <div ref={storyRef} id="story" className="relative">
      {/* the map: one full screen, pinned for the whole story */}
      <div className="sticky top-0 z-0 -mb-[100svh] h-[100svh]">
        <MapStage mobile={mobile} reduced={reduced} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#d9ebf3] to-transparent" />
      </div>

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
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ amount: 0.35, margin: "0px 0px -8% 0px" }}
                    transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                    className="absolute inset-x-0 px-3 md:px-8"
                    style={{ top: `calc(${p} * ${H} + ${hero ? (mobile ? "56svh" : "14svh") : offset})` }}
                  >
                    <div className={`${card} ${hero ? "max-w-[30rem] p-5 md:p-8" : "max-w-[27rem] p-4 md:p-6"}`}>
                      {hero ? (
                        <header>
                          <div className="flex items-center gap-3">
                            <img src={asset("/img/usdc.png")} alt="" width={44} height={44} />
                            <span className="tag rounded-full bg-accent-soft px-3 py-1 text-accent">{t.acts[0]}</span>
                          </div>
                          <h1 id="chapter-1-title" className="serif mt-4 text-[44px] leading-[0.98] md:text-[60px]">
                            {t.ui.brand}
                          </h1>
                          <p className="mt-3 text-[18px] font-semibold leading-snug text-accent md:text-[20px]">{ch.question}</p>
                          <p className="mt-4 text-[18px] font-bold leading-snug">{beat.title}</p>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-2 text-[15px] leading-relaxed text-ink/80">
                              {b}
                            </p>
                          ))}
                          <ol className="mt-5 flex flex-wrap gap-1.5" aria-label={t.ui.contents}>
                            {t.acts.map((a, k) => (
                              <li key={a} className="rounded-full border border-line px-2.5 py-1 text-[11.5px] font-semibold text-mute">
                                <span className="text-accent">{k + 1}</span> {a}
                              </li>
                            ))}
                          </ol>
                        </header>
                      ) : (
                        <>
                          {j === 0 && (
                            <header className="mb-4">
                              <div className="flex items-center gap-2">
                                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-accent px-2 text-[12px] font-extrabold text-white">{i + 1}</span>
                                <span className="tag text-mute">{t.acts[c.act]}</span>
                              </div>
                              <h2 id={`chapter-${i + 1}-title`} className="serif mt-3 text-[30px] leading-[1.05] md:text-[36px]">
                                {ch.title.replace(/^\d+ · /, "")}
                              </h2>
                              <p className="mt-2 text-[16px] font-semibold leading-snug text-accent">{ch.question}</p>
                            </header>
                          )}
                          <h3 className="text-[17.5px] font-extrabold leading-snug md:text-[20px]">{beat.title}</h3>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-2 text-[14.5px] leading-relaxed text-ink/80 md:mt-2.5 md:text-[15px]">
                              {b}
                            </p>
                          ))}
                          {beat.notes?.map((n) => (
                            <p key={n} className="mt-3 rounded-lg bg-[#f1f4f8] px-3 py-2 text-[12.5px] leading-snug text-mute">
                              {n}
                            </p>
                          ))}
                          {beat.insight && (
                            <aside className="mt-4 rounded-2xl bg-[#fff6dc] px-4 py-3">
                              <div className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wide text-[#a57a12]">
                                <Bulb />
                                {t.ui.insight}
                              </div>
                              <p className="mt-1 text-[15.5px] font-semibold leading-snug text-ink">{beat.insight}</p>
                            </aside>
                          )}
                          {j === c.beats.length - 1 && ch.takeaway && (
                            <aside className="mt-4 rounded-2xl border-2 border-dashed border-accent/40 px-4 py-3">
                              <div className="text-[12px] font-extrabold uppercase tracking-wide text-accent">{t.ui.inShort}</div>
                              <p className="mt-1 text-[15px] font-semibold leading-snug">{ch.takeaway}</p>
                            </aside>
                          )}
                        </>
                      )}
                    </div>
                  </motion.article>
                );
              })}
              {c.panels.map((slot) => {
                const Panel = PANELS[slot.kind];
                return (
                  <div key={slot.kind} className="absolute inset-x-0 px-3 md:px-8" style={{ top: `calc(${slot.at} * ${H})`, height: `calc(${slot.span} * ${H} + 40svh)` }}>
                    <div className="sticky max-w-[30rem]" style={{ top: mobile ? "calc(44svh)" : "calc(var(--header-h) + 4svh)" }}>
                      <div className={`${card} overflow-hidden ${mobile ? "max-h-[52svh] overflow-y-auto overscroll-contain" : ""}`}>
                        <Panel />
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}
      </main>
    </div>
  );
}
