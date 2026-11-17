"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { rwaStore } from "@/lib/simStores";
import { Badge, Panel } from "./ui";

export default function RwaPanel() {
  const { t } = useI18n();
  const P = t.panels.rwa;
  const asset = useStore(rwaStore, (s) => s.asset);
  const tab = asset >= 0 ? P.tabs[asset] : null;
  return (
    <Panel title={P.title} badge={<Badge kind="fact">{t.ui.verified}</Badge>}>
      <div className="tag mb-2 text-mute">{P.pick}</div>
      <div role="radiogroup" aria-label={P.pick} className="grid grid-cols-2 gap-1.5">
        {P.tabs.map((it, i) => {
          const on = asset === i;
          return (
            <button
              key={it.name}
              role="radio"
              aria-checked={on}
              onClick={() => rwaStore.set({ asset: on ? -1 : i })}
              className={`border px-3 py-2 text-left text-[13.5px] leading-tight transition-colors ${on ? "border-accent bg-accent text-paper" : "border-ink/70 hover:border-accent hover:text-accent"}`}
            >
              {it.name}
            </button>
          );
        })}
      </div>
      <div className={`mt-3 border-t border-line pt-3 ${tab ? "min-h-[11em]" : ""}`} aria-live="polite">
        <AnimatePresence mode="wait">
          {tab ? (
            <motion.dl key={asset} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-2.5">
              {(
                [
                  [P.what, tab.what, "text-ink"],
                  [P.example, tab.example, "text-ink"],
                  [P.who, tab.who, "text-ink"],
                  [P.risk, tab.risk, "text-warn"],
                ] as const
              ).map(([k, val, tone]) => (
                <div key={k}>
                  <dt className="tag text-mute">{k}</dt>
                  <dd className={`mt-0.5 text-[13.5px] leading-snug ${tone}`}>{val}</dd>
                </div>
              ))}
            </motion.dl>
          ) : (
            <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[13.5px] leading-relaxed text-mute">
              {P.xrpRole}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {tab && <p className="mt-3 border-t border-line pt-2.5 text-[12px] leading-snug text-mute">{P.xrpRole}</p>}
    </Panel>
  );
}
