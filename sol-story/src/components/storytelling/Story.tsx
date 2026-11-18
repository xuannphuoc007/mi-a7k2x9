"use client";
/**
 * The reading column. Each chapter is a tall section whose scroll length maps
 * to the chapter's local progress; text beats are placed at the same local
 * progress values the scene timelines use, so copy and visuals stay in sync.
 */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { chapters, type PanelKind } from "@/data/coins/sol/chapters";
import { registerSection, initScrollEngine } from "@/animations/scrollController";
import { useI18n } from "@/lib/i18n";
import Stage from "@/components/visualization/Stage";
import ComparePanel from "@/components/interactive/ComparePanel";
import { useIsMobile, useReducedMotion } from "@/hooks/useMedia";

const PANELS: Record<PanelKind, () => React.ReactElement> = {
  compare: () => <ComparePanel which="compare" />,
  versus: () => <ComparePanel which="versus" />,
};

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

  // beats sit below the mobile stage, or a third of the way down on desktop
  const beatOffset = mobile ? "54svh" : "30svh";

  return (
    <div ref={storyRef} id="story" className="relative md:grid md:grid-cols-[var(--stage-left)_1fr]">
      {/* stage — sticky; on mobile it overlays the top half and takes no flow space */}
      <div className="sticky top-0 z-20 h-[50svh] -mb-[50svh] md:relative md:order-2 md:mb-0 md:h-auto md:self-stretch">
        <div className="h-[50svh] border-b border-line bg-paper pt-[var(--header-h)] md:sticky md:top-0 md:h-[100svh] md:border-b-0 md:border-l md:pr-14 md:pt-[calc(var(--header-h)+4px)]">
          <Stage mobile={mobile} />
        </div>
      </div>

      {/* reading column */}
      <main id="content" className="relative md:order-1">
        {chapters.map((c, i) => {
          const ch = t.chapters[i];
          const H = `${c.height * 100}svh`;
          const actStart = i === 0 || chapters[i - 1].act !== c.act;
          const kicker = `${t.ui.act} ${String(c.act + 1).padStart(2, "0")} · ${t.acts[c.act]}`;
          return (
            <section
              key={c.id}
              ref={(el) => registerSection(i, el)}
              id={`chapter-${i + 1}`}
              aria-labelledby={`chapter-${i + 1}-title`}
              className="relative"
              style={{ height: H }}
            >
              <p className="sr-only">{ch.figure}</p>
              {c.beats.map((p, j) => {
                const beat = ch.beats[j];
                if (!beat) return null;
                const isHero = i === 0 && j === 0;
                return (
                  <motion.article
                    key={j}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.4, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                    className="absolute inset-x-0 px-5 md:px-10 lg:px-14"
                    style={{ top: `calc(${p} * ${H} + ${isHero ? (mobile ? "54svh" : "16svh") : beatOffset})` }}
                  >
                    <div className={`max-w-[34rem] ${mobile ? "border border-line bg-paper/95 p-4 backdrop-blur" : ""}`}>
                      {j === 0 && !isHero && (
                        <header className="mb-5">
                          {actStart && (
                            <div aria-hidden className="serif mb-2 text-[64px] font-semibold leading-none tracking-[-0.04em] text-line md:text-[88px]">
                              {String(c.act + 1).padStart(2, "0")}
                            </div>
                          )}
                          <div className="tag flex items-center gap-3 text-mute">
                            <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                            <span className="h-px w-10 bg-accent/60" />
                            <span>{kicker}</span>
                          </div>
                          <h2 id={`chapter-${i + 1}-title`} className="serif mt-3 text-[40px] leading-[1.02] tracking-[-0.015em] md:text-[54px]">
                            {ch.title}
                          </h2>
                          <p className="mt-3 flex gap-2 text-[17px] leading-snug text-accent md:text-[18px]">
                            <span aria-hidden className="mono text-[13px] leading-[1.6]">Q</span>
                            <span className="serif italic">{ch.question}</span>
                          </p>
                        </header>
                      )}
                      {isHero ? (
                        <header>
                          <div className="tag flex items-center gap-3 text-mute">
                            <span className="text-accent">01</span>
                            <span className="h-px w-10 bg-accent/60" />
                            <span>{kicker}</span>
                          </div>
                          <h1 id="chapter-1-title" className="serif mt-4 text-[54px] leading-[0.95] tracking-[-0.02em] md:text-[84px]">
                            <span className="bnb-grad">{t.ui.brand}</span>
                          </h1>
                          <p className="serif mt-5 text-[22px] italic leading-snug text-accent md:text-[26px]">{ch.question}</p>
                          <p className="serif mt-5 text-[21px] leading-snug text-ink/90 md:text-[24px]">{beat.title}</p>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-4 max-w-[30rem] text-[15.5px] leading-relaxed text-ink/80">
                              {b}
                            </p>
                          ))}
                          <ol className="mt-6 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3" aria-label={t.ui.contents}>
                            {t.acts.map((a, k) => (
                              <li key={a} className="tag flex items-baseline gap-2 text-mute">
                                <span className="text-accent">{String(k + 1).padStart(2, "0")}</span>
                                {a}
                              </li>
                            ))}
                          </ol>
                        </header>
                      ) : (
                        <>
                          <h3 className="serif text-[24px] leading-tight md:text-[27px]">{beat.title}</h3>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-3 text-[15.5px] leading-relaxed text-ink/85">
                              {b}
                            </p>
                          ))}
                          {beat.notes?.map((n) => (
                            <p key={n} className="mono mt-4 border-l-2 border-accent pl-3 text-[12px] leading-snug text-mute">
                              {n}
                            </p>
                          ))}
                          {beat.deep && beat.deep.length > 0 && (
                            <details className="group mt-4 border-t border-line pt-2.5">
                              <summary className="tag flex cursor-pointer list-none items-center gap-2 text-mute hover:text-accent">
                                <span className="inline-block transition-transform group-open:rotate-90">›</span>
                                {t.ui.deeper}
                              </summary>
                              {beat.deep.map((d) => (
                                <p key={d} className="mt-2 text-[14px] leading-relaxed text-ink/75">
                                  {d}
                                </p>
                              ))}
                            </details>
                          )}
                          {j === c.beats.length - 1 && ch.takeaway && (
                            <aside className="mt-5 border border-accent/40 bg-accent-soft/50 px-4 py-3">
                              <div className="tag text-accent">{t.ui.inShort}</div>
                              <p className="serif mt-1 text-[18px] leading-snug">{ch.takeaway}</p>
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
                  <div
                    key={slot.kind}
                    className="absolute inset-x-0 px-5 md:px-10 lg:px-14"
                    style={{ top: `calc(${slot.at} * ${H})`, height: `calc(${slot.span} * ${H} + ${mobile ? "46svh" : "40svh"})` }}
                  >
                    <div className="sticky max-w-[34rem]" style={{ top: mobile ? "calc(50svh + 10px)" : "calc(var(--header-h) + 5svh)" }}>
                      <div className={mobile ? "max-h-[46svh] overflow-y-auto overscroll-contain" : ""}>
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
