"use client";
/**
 * The reading column. Each chapter is a tall section whose scroll length maps
 * to the chapter's local progress; text beats are placed at the same local
 * progress values the scene timelines use, so copy and visuals stay in sync.
 */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { chapters, type PanelKind } from "@/data/coins/btc/chapters";
import { registerSection, initScrollEngine } from "@/animations/scrollController";
import { useI18n } from "@/lib/i18n";
import Stage from "@/components/visualization/Stage";
import GenesisPanel from "@/components/interactive/GenesisPanel";
import PizzaPanel from "@/components/interactive/PizzaPanel";
import HalvingPanel from "@/components/interactive/HalvingPanel";
import DrawdownPanel from "@/components/interactive/DrawdownPanel";
import MiningPanel from "@/components/interactive/MiningPanel";
import EventsPanel from "@/components/interactive/EventsPanel";
import DominoesPanel from "@/components/interactive/DominoesPanel";
import ExplorerPanel from "@/components/interactive/ExplorerPanel";
import { useIsMobile, useReducedMotion } from "@/hooks/useMedia";

const PANELS: Record<Exclude<PanelKind, null>, () => React.ReactElement> = {
  genesis: GenesisPanel,
  pizza: PizzaPanel,
  halving: HalvingPanel,
  drawdown: DrawdownPanel,
  mining: MiningPanel,
  events: EventsPanel,
  dominoes: DominoesPanel,
  explorer: ExplorerPanel,
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
        <div className="h-[50svh] border-b border-line bg-paper pt-[var(--header-h)] md:sticky md:top-0 md:h-[100svh] md:border-b-0 md:border-l md:pb-3 md:pr-14 md:pt-[calc(var(--header-h)+8px)]">
          <Stage mobile={mobile} />
        </div>
      </div>

      {/* reading column */}
      <main id="content" className="relative md:order-1">
        {chapters.map((c, i) => {
          const ch = t.chapters[i];
          const H = `${c.height * 100}svh`;
          const Panel = c.panel ? PANELS[c.panel] : null;
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
                          <div className="tag flex items-center gap-3 text-mute">
                            <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                            <span className="h-px w-10 bg-accent/60" />
                            <span>{ch.kicker}</span>
                          </div>
                          <h2 id={`chapter-${i + 1}-title`} className="serif mt-3 text-[40px] leading-[1.02] tracking-[-0.015em] md:text-[54px]">
                            {ch.title}
                          </h2>
                        </header>
                      )}
                      {isHero ? (
                        <header>
                          <div className="tag flex items-center gap-3 text-mute">
                            <span className="text-accent">01</span>
                            <span className="h-px w-10 bg-accent/60" />
                            <span>{ch.kicker} · {ch.title}</span>
                          </div>
                          <h1 id="chapter-1-title" className="serif mt-4 text-[54px] font-bold leading-[0.92] tracking-[-0.03em] md:text-[92px]">
                            <span className="orange-grad">{t.ui.brand}</span>
                            <span className="mt-1 block text-[26px] font-medium tracking-[-0.01em] text-ink/90 md:text-[34px]">{t.ui.brandSub}</span>
                          </h1>
                          <p className="serif mt-5 text-[20px] leading-snug text-ink/85 md:text-[23px]">{beat.title}</p>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-5 max-w-[30rem] text-[15.5px] leading-relaxed text-ink/80">
                              {b}
                            </p>
                          ))}
                          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2" aria-label="legend">
                            {(["crash", "ath", "tech", "other"] as const).map((k) => (
                              <li key={k} className="tag flex items-center gap-2 text-mute">
                                <span
                                  className={`inline-block h-2.5 w-2.5 ${
                                    k === "crash" ? "rotate-45 bg-warn" : k === "ath" ? "bg-gold [clip-path:polygon(50%_0,100%_100%,0_100%)]" : k === "tech" ? "border-2 border-accent" : "rounded-full bg-accent"
                                  }`}
                                />
                                {t.ui.legend[k]}
                              </li>
                            ))}
                          </ul>
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
              {Panel && (
                <div
                  className="absolute inset-x-0 px-5 md:px-10 lg:px-14"
                  style={{ top: `calc(${c.panelAt} * ${H})`, height: `calc(${c.panelSpan} * ${H} + ${mobile ? "46svh" : "40svh"})` }}
                >
                  <div className="sticky max-w-[34rem]" style={{ top: mobile ? "calc(50svh + 10px)" : "calc(var(--header-h) + 5svh)" }}>
                    <div className={mobile ? "max-h-[46svh] overflow-y-auto overscroll-contain" : ""}>
                      <Panel />
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}
