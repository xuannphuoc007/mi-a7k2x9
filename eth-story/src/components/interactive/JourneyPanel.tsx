"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Badge, Panel } from "./ui";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { journeyStore } from "@/lib/simStores";
import { journeyEvents, type JEvent } from "@/data/coins/eth/events";
import { NEWS_FROM, fmtDate, priceAt, usd } from "@/lib/ethSeries";

const dot = (e: JEvent) =>
  e.kind === "hack" || e.kind === "crash" ? "rotate-45 bg-warn" : e.kind === "peak" ? "bg-ink [clip-path:polygon(50%_0,100%_100%,0_100%)]" : e.kind === "upgrade" ? "rotate-45 bg-lilac" : "rounded-full bg-accent";

export default function JourneyPanel() {
  const { t, lang, locale } = useI18n();
  const P = t.panels.journey;
  const selected = useStore(journeyStore, (s) => s.selected);
  return (
    <Panel title={P.title} badge={<Badge kind="fact">2015 → 2026</Badge>}>
      <p className="text-[12.5px] leading-snug text-mute">{P.hint}</p>
      <ul className="mt-2 grid max-h-[52svh] gap-0.5 overflow-y-auto pr-1">
        {journeyEvents.map((e) => {
          const on = selected === e.id;
          const p = priceAt(e.t);
          return (
            <li key={e.id}>
              <button
                onClick={() => journeyStore.set({ selected: on ? null : e.id })}
                aria-expanded={on}
                className={`grid w-full grid-cols-[auto_1fr] items-baseline gap-x-3 border-l-2 px-3 py-1.5 text-left transition-colors ${on ? "border-accent bg-accent/10" : "border-transparent hover:border-line"}`}
              >
                <span className={`inline-block h-2.5 w-2.5 ${dot(e)}`} aria-hidden />
                <span className="min-w-0">
                  <span className="tag block text-mute">{fmtDate(e.t, lang)}</span>
                  <span className={`serif block text-[15px] leading-snug ${on ? "text-accent" : ""}`}>{e[lang].title}</span>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="px-3 pb-2 pl-[2.1rem] text-[13px] leading-snug text-ink/85">{e[lang].body}</p>
                    {p !== null && (
                      <p className="mono px-3 pb-2 pl-[2.1rem] text-[11.5px] text-accent">
                        {P.price}: {usd(p, locale)}
                        {e.t >= NEWS_FROM ? ` (${P.news})` : ""}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 border-t border-line pt-2 text-[12px] leading-snug text-mute">{P.caveat}</p>
    </Panel>
  );
}
