"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { routeStore } from "@/lib/simStores";
import { Badge, Panel, Segmented } from "./ui";

export default function RoutePanel() {
  const { t } = useI18n();
  const P = t.panels.route;
  const mode = useStore(routeStore, (s) => s.mode);
  const steps = mode === "A" ? P.stepsA : P.stepsB;
  const parties = mode === "A" ? P.partiesA : P.partiesB;
  return (
    <Panel title={P.title} badge={<Badge kind="ill">{t.ui.illustrative}</Badge>}>
      <Segmented
        label={P.title}
        value={mode}
        onChange={(m) => routeStore.set({ mode: m })}
        options={[
          { value: "A", label: P.routeA },
          { value: "B", label: P.routeB },
        ]}
      />
      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
          <div className="tag mt-3.5 text-mute">
            {P.parties} · {parties.length}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {parties.map((p, i) => (
              <span key={p} className="flex items-center gap-1">
                <span className={`mono rounded-sm border px-1.5 py-0.5 text-[11.5px] ${p.includes("XRP") ? "border-accent text-accent" : "border-ink/60"}`}>{p}</span>
                {i < parties.length - 1 && <span className="text-mute">→</span>}
              </span>
            ))}
          </div>
          <div className="tag mt-3.5 text-mute">{P.steps}</div>
          <ol className="mt-1.5 space-y-1">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-2.5 text-[13.5px] leading-snug">
                <span className="mono w-4 shrink-0 text-mute">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      </AnimatePresence>
      <p className="mt-3 border-t border-line pt-2.5 text-[12.5px] leading-snug text-mute">{P.caveat}</p>
    </Panel>
  );
}
