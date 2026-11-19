"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { useView } from "@/lib/store";
import { SECTIONS, START, TOTAL, scrollState, type SceneId } from "@/lib/timeline";
import { asset } from "@/lib/asset";
import { sources, type Beat as BeatT } from "@/data/copy";
import { PortalHud, Confirm, Coverage, Compare } from "./ui/Panels";
import { MintHud, PegHud, SvbHud, RedeemHud, MapPanel } from "./ui/Huds";
import { useGlobalU } from "./ui/useLocal";

const World = dynamic(() => import("./world/World"), { ssr: false });

function useVh() {
  const [vh, setVh] = useState(800);
  useEffect(() => {
    let w = window.innerWidth;
    const set = () => {
      setVh(window.innerHeight);
      scrollState.vh = window.innerHeight;
    };
    set();
    const on = () => {
      // ignore mobile address-bar height jitter: only re-measure on width change or big height change
      if (window.innerWidth !== w || Math.abs(window.innerHeight - scrollState.vh) > 140) {
        w = window.innerWidth;
        set();
      }
    };
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vh;
}

function useScrollDriver(vh: number) {
  useEffect(() => {
    const on = () => {
      scrollState.target = window.scrollY / vh;
    };
    on();
    scrollState.u = scrollState.target;
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [vh]);
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const NUMS = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];
const LIVE: Record<string, SceneId> = { "01": "s01", "02": "s02", "03": "s03", "04": "s04", "05": "s05", "06": "s06", "07": "s07", "08": "s08", "09": "s09" };

function Header({ vh }: { vh: number }) {
  const { t, lang, setLang } = useI18n();
  const { xray, setXray } = useView();
  const u = useGlobalU(0.05);
  const cur = u >= START.end ? "" : NUMS[SECTIONS.findIndex((x, i) => u >= START[x.id] && (i === SECTIONS.length - 1 || u < START[SECTIONS[i + 1].id]))] || "";
  const go = (id: SceneId) => window.scrollTo({ top: START[id] * vh + 2, behavior: useView.getState().reduced ? "auto" : "smooth" });
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-[52px] items-center justify-between gap-3 px-4 md:px-7" style={{ background: "linear-gradient(#eef2f7f2, #eef2f700)" }}>
      <button onClick={() => window.scrollTo({ top: 0 })} className="flex min-w-0 items-center gap-2.5 text-left">
        <img src={asset("/img/usdc.png")} alt="USDC" width={22} height={22} />
        <span className="mono hidden truncate text-[11px] uppercase tracking-[.16em] text-warm/90 lg:inline">{t.ui.project}</span>
      </button>
      <nav className="hidden items-center gap-1 md:flex" aria-label="chapters">
        {NUMS.map((n) => {
          const live = LIVE[n];
          return (
            <button
              key={n}
              disabled={!live}
              onClick={() => live && go(live)}
              title={live ? undefined : "—"}
              className={`mono rounded px-1.5 py-1 text-[11px] tracking-wider transition ${cur === n ? "text-warm" : live ? "text-mist hover:text-warm" : "cursor-default text-black/20"}`}
            >
              {n}
              <span className={`mx-auto mt-0.5 block h-px transition-all ${cur === n ? "w-full bg-volt" : "w-0"}`} />
            </button>
          );
        })}
      </nav>
      <div className="flex items-center gap-2">
        <div className="mono flex items-center rounded-full border border-black/10 p-0.5 text-[10.5px] uppercase" role="group" aria-label="X-RAY">
          <span className="hidden px-2 text-volt sm:inline">X-ray</span>
          {[false, true].map((v) => (
            <button
              key={String(v)}
              onClick={() => setXray(v)}
              aria-pressed={xray === v}
              className={`rounded-full px-2.5 py-1 tracking-wider transition ${xray === v ? "bg-usdc text-white" : "text-mist hover:text-warm"}`}
            >
              {v ? t.ui.system : t.ui.cinematic}
            </button>
          ))}
        </div>
        <div className="mono flex rounded-full border border-black/10 p-0.5 text-[10.5px]">
          {(["en", "vi"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`rounded-full px-2 py-1 uppercase ${lang === l ? "bg-warm text-night" : "text-mist"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function Progress() {
  const u = useGlobalU(0.01);
  const p = Math.min(1, u / (TOTAL - 1));
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[2px] bg-black/5">
      <div className="h-full bg-volt" style={{ width: `${p * 100}%` }} />
    </div>
  );
}

function XrayVeil() {
  const { xray } = useView();
  const { t } = useI18n();
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[5] transition-opacity duration-500"
        style={{
          opacity: xray ? 1 : 0,
          backgroundImage: "linear-gradient(rgba(39,117,202,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(39,117,202,.09) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="mono pointer-events-none fixed left-4 top-[58px] z-30 text-[10px] uppercase tracking-[.2em] text-volt transition-opacity duration-500 md:left-7" style={{ opacity: xray ? 1 : 0 }}>
        ▣ {t.ui.system} view
      </div>
    </>
  );
}

function BeatBlock({ b, top }: { b: BeatT; top: number }) {
  const { t } = useI18n();
  const align = b.side === "l" ? "md:mr-auto md:ml-[6vw]" : b.side === "r" ? "md:ml-auto md:mr-[6vw]" : "mx-auto text-center";
  const veil = b.side === "l" ? "veil-l" : b.side === "r" ? "veil-r" : "veil-c";
  return (
    <div className="absolute inset-x-0 px-5 md:px-0" style={{ top }}>
      <div className={`relative max-w-[34rem] ${align} ${b.side === "c" ? "md:max-w-[46rem]" : ""}`}>
        <div className={`pointer-events-none absolute -inset-x-[30vw] -inset-y-24 -z-10 ${veil}`} />
        {b.chip && (
          <div
            className={`mono mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] uppercase tracking-[.12em] ${b.chip.kind === "data" ? "border-volt/50 text-volt" : "border-dashed border-ice/50 text-ice"}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${b.chip.kind === "data" ? "bg-volt" : "border border-ice"}`} />
            {b.chip.kind === "data" ? t.ui.data : t.ui.sim} · {b.chip.text}
          </div>
        )}
        {b.head && <h3 className="display shadow-text mb-3 text-[30px] font-semibold leading-[1.05] tracking-[-0.02em] text-warm md:text-[44px]">{b.head}</h3>}
        <p className="shadow-text text-[18px] font-light leading-[1.55] text-warm md:text-[21px]">{b.l1}</p>
        {b.l2 && (
          <details className="group/l2 mt-4">
            <summary className="mono mb-1 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-volt">
              <span className="grid h-4 w-4 place-items-center rounded-full border border-volt/60 text-[10px]">{"›"}</span>
              {t.ui.l2}
            </summary>
            <p className="shadow-text text-[15px] leading-[1.6] text-mist md:text-[16px]">{b.l2}</p>
          </details>
        )}
        {b.deep && (
          <details className="group mt-3">
            <summary className="mono inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[.18em] text-ice hover:text-warm">
              <span className="grid h-4 w-4 place-items-center rounded-full border border-ice/60 text-[10px] transition group-open:rotate-45">+</span>
              {t.ui.deep}
            </summary>
            <ul className="mt-2 space-y-1.5 border-l border-black/10 pl-3 text-[14px] leading-relaxed text-mist">
              {b.deep.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
        )}
        {b.insight && (
          <aside className="mt-5 border-l-2 border-volt bg-white/80 py-3 pl-4 pr-3 text-left">
            <div className="mono mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[.18em] text-volt">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1z" /></svg>
              {t.ui.insight}
            </div>
            <p className="text-[15px] leading-[1.6] text-warm">{b.insight}</p>
          </aside>
        )}
      </div>
    </div>
  );
}

function SceneSection({ idx, vh }: { idx: number; vh: number }) {
  const { t } = useI18n();
  const sc = t.scenes[idx];
  const len = SECTIONS[idx].screens;
  const isHero = idx === 0;
  return (
    <section id={sc.id} className="relative" style={{ height: len * vh }}>
      {isHero ? (
        <div className="absolute inset-x-0 top-0 flex flex-col justify-end px-5 pb-[11vh] md:px-[6vw]" style={{ height: vh }}>
          <div className="mono mb-4 text-[11px] uppercase tracking-[.22em] text-volt">
            {sc.num} · {sc.kicker}
          </div>
          <h1 className="display shadow-text max-w-[15ch] text-[44px] font-semibold leading-[0.98] tracking-[-0.035em] text-warm md:text-[88px]">{sc.title}</h1>
          <p className="shadow-text mt-5 max-w-[36rem] text-[16px] text-mist md:text-[18px]">
            <span className="text-warm">{t.ui.project}.</span> {t.ui.subtitle}
          </p>
          <div className="mono mt-8 flex items-center gap-3 text-[10.5px] uppercase tracking-[.2em] text-mist">
            <span className="relative block h-8 w-px overflow-hidden bg-white/15">
              <span className="absolute left-0 top-0 block h-3 w-px animate-[drip_1.8s_ease-in-out_infinite] bg-volt" />
            </span>
            {t.ui.scroll}
          </div>
          <style>{`@keyframes drip{0%{transform:translateY(-12px)}100%{transform:translateY(32px)}}`}</style>
        </div>
      ) : (
        <div className="absolute inset-x-0 px-5 md:px-[6vw]" style={{ top: (idx === 0 ? 0.12 : 0.22) * vh }}>
          <div className="mono mb-3 text-[11px] uppercase tracking-[.22em] text-volt">
            {sc.num} · {sc.kicker}
          </div>
          <h2 className="display shadow-text max-w-[16ch] text-[40px] font-semibold leading-[0.98] tracking-[-0.035em] text-warm md:text-[80px]">{sc.title}</h2>
        </div>
      )}
      {sc.beats.map((b, i) => (
        <div key={i}>
          <BeatBlock b={b} top={(b.t * len + 0.45) * vh} />
          {sc.id === "s01" && b.side === "c" && (
            <p className="mono absolute inset-x-0 mx-auto max-w-[40rem] px-5 text-center text-[11.5px] leading-relaxed text-mist/90" style={{ top: (b.t * len + 0.45) * vh + 190 }}>
              {t.ui.metaphor}
            </p>
          )}
          {sc.id === "s03" && i === sc.beats.length - 1 && (
            <div className="absolute inset-x-0 px-5 md:px-0" style={{ top: (b.t * len + 0.45) * vh + (typeof window !== "undefined" && window.innerWidth < 768 ? 330 : 0) }}>
              <div className="max-w-[30rem] md:ml-[6vw] md:mr-auto">
                <Coverage />
              </div>
            </div>
          )}
          {sc.id === "s05" && i === sc.beats.length - 1 && (
            <div className="absolute inset-x-0 flex justify-center px-5" style={{ top: (b.t * len + 0.45) * vh + 150 }}>
              <Compare />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function EndSection({ vh }: { vh: number }) {
  const { t } = useI18n();
  return (
    <section id="map" className="relative" style={{ height: SECTIONS[SECTIONS.length - 1].screens * vh }}>
      <div className="absolute inset-x-0 bottom-0 px-4 pb-6 md:px-[4vw]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => window.scrollTo({ top: 0, behavior: useView.getState().reduced ? "auto" : "smooth" })} className="mono rounded-full border border-volt/60 bg-white/90 px-4 py-2 text-[11px] uppercase tracking-[.16em] text-volt hover:bg-usdc hover:text-white">
              ↺ {t.ui.replay}
            </button>
            <details className="group relative">
              <summary className="mono rounded-full border border-black/10 bg-white/90 px-4 py-2 text-[11px] uppercase tracking-[.16em] text-warm">
                {t.ui.sources} ({sources.length})
              </summary>
              <ol className="absolute bottom-12 left-0 max-h-[52vh] w-[min(640px,92vw)] list-decimal space-y-1 overflow-auto rounded-xl border border-black/10 bg-white/95 py-3 pl-8 pr-4 text-[12px] leading-relaxed text-mist shadow-[0_10px_40px_rgba(15,35,64,.15)]">
                {sources.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
            </details>
          </div>
          <p className="max-w-[560px] rounded-lg bg-white/80 px-3 py-2 text-[11px] leading-relaxed text-mist">
            {t.ui.disclaimer} {t.ui.credits}
          </p>
        </div>
      </div>
    </section>
  );
}

function Inner() {
  const vh = useVh();
  useScrollDriver(vh);
  const setReduced = useView((s) => s.setReduced);
  const [gl, setGl] = useState<boolean | null>(null);
  const { t } = useI18n();
  useEffect(() => {
    setGl(hasWebGL());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [setReduced]);
  return (
    <>
      {gl && <World />}
      {gl === false && (
        <div className="fixed inset-0 z-0" style={{ background: "radial-gradient(60% 50% at 50% 40%, #ffffff 0%, #eef2f7 70%)" }}>
          <p className="mono absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-mist">{t.ui.nowebgl}</p>
        </div>
      )}
      <XrayVeil />
      <Header vh={vh} />
      <main className="relative z-10">
        {t.scenes.map((_, i) => (
          <SceneSection key={i} idx={i} vh={vh} />
        ))}
        <EndSection vh={vh} />
      </main>
      <PortalHud />
      <Confirm />
      <MintHud />
      <PegHud />
      <SvbHud />
      <RedeemHud />
      <MapPanel vh={vh} />
      <Progress />
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Inner />
    </I18nProvider>
  );
}
