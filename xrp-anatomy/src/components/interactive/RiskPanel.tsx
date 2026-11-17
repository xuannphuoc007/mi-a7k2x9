"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { riskStore } from "@/lib/simStores";
import { Panel } from "./ui";

export default function RiskPanel() {
  const { t } = useI18n();
  const P = t.panels.risk;
  const risk = useStore(riskStore, (s) => s.risk);
  return (
    <Panel title={P.title}>
      <div className="tag mb-2 text-mute">{P.select}</div>
      <div role="radiogroup" aria-label={P.select} className="flex flex-wrap gap-1.5">
        {P.items.map((it, i) => {
          const on = risk === i;
          return (
            <button
              key={it.name}
              role="radio"
              aria-checked={on}
              onClick={() => riskStore.set({ risk: on ? -1 : i })}
              className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${on ? "border-warn bg-warn text-paper" : "border-ink/70 hover:border-warn hover:text-warn"}`}
            >
              {it.name}
            </button>
          );
        })}
      </div>
      <div className="mt-3 min-h-[6.5em] border-t border-line pt-3" aria-live="polite">
        <AnimatePresence mode="wait">
          {risk >= 0 ? (
            <motion.div key={risk} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <div className="tag text-warn">{P.effect}</div>
              <p className="mt-1 text-[14px] leading-relaxed">{P.items[risk].body}</p>
            </motion.div>
          ) : (
            <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[13.5px] text-mute">
              —
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Panel>
  );
}
