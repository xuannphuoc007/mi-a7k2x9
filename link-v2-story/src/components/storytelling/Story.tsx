"use client";
/**
 * The Missing Link: a sticky 2D stage (left / top on phones) with a scene per chapter,
 * text cards scrolling on the right, and the chain of chapters on the far left.
 */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { chapters, C } from "@/data/coins/link/chapters";
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

function LinkIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 20 22.4" aria-hidden>
      <path d="M10 1.5 18.5 6.3v9.8L10 20.9 1.5 16.1V6.3z" fill="none" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
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

  const offset = mobile ? "62svh" : "22svh";
  const card = "pointer-events-auto rounded-[20px] bg-white shadow-[0_20px_50px_-26px_rgba(26,58,156,0.45)] ring-1 ring-[#dde5f0]";

  return (
    <div ref={storyRef} id="story" className="relative">
      <div className="lattice sticky top-0 z-0 -mb-[100svh] h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#dbe6fb] opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 right-[30%] h-[480px] w-[480px] rounded-full bg-[#e3f3ef] opacity-70 blur-3xl" />
        <Stage mobile={mobile} />
      </div>

      <main id="content" className="pointer-events-none relative z-10">
        {chapters.map((c, i) => {
          const ch = t.chapters[i];
          const H = `${c.height * 100}svh`;
          const tint = c.color === C.ink ? "#24305e" : c.color;
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
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.35, margin: "0px 0px -8% 0px" }}
                    transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                    className={`absolute px-3 ${mobile ? "inset-x-0" : "right-8 w-[430px]"}`}
                    style={{ top: `calc(${p} * ${H} + ${hero ? (mobile ? "60svh" : "12svh") : offset})` }}
                  >
                    <div className={`${card} ${hero ? "p-6" : "p-5"}`}>
                      {hero ? (
                        <header>
                          <div className="flex items-center gap-3">
                            <img src={asset("/img/link-mark.png")} alt="" width={34} height={39} />
                            <span className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: C.blue }}>
                              {t.ui.kicker}
                            </span>
                          </div>
                          <h1 id="chapter-1-title" className="serif mt-4 text-[42px] leading-[1.0] md:text-[52px]">
                            {t.ui.brand}
                          </h1>
                          <p className="mt-2.5 text-[15.5px] leading-snug text-mute">{t.ui.tagline}</p>
                          <p className="mt-4 rounded-xl bg-[#e6edfc] px-3.5 py-2.5 text-[15.5px] font-semibold leading-snug" style={{ color: C.blueDeep }}>
                            {ch.question}
                          </p>
                          <p className="mt-4 text-[17px] font-bold leading-snug">{beat.title}</p>
                          {beat.body.map((b, k) => (
                            <p key={k} className="mt-1.5 text-[15px] leading-relaxed text-ink/80">
                              {b}
                            </p>
                          ))}
                          <ol className="mt-5 flex flex-wrap gap-1.5" aria-label={t.ui.contents}>
                            {t.acts.map((a, k) => (
                              <li key={a} className="flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] font-medium text-mute">
                                <LinkIcon color={C.blue} size={10} />
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
                                <LinkIcon color={tint} size={18} />
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
                            <span className="mt-[7px] h-2 w-2 shrink-0 rotate-45 rounded-[2px]" style={{ background: tint }} />
                            {beat.title}
                          </h3>
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
