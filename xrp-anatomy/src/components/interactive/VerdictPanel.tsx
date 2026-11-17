"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, RotateCcw, X } from "lucide-react";
import { Badge, IconButton, Panel } from "./ui";
import { useI18n } from "@/lib/i18n";

export default function VerdictPanel() {
  const { t } = useI18n();
  const P = t.panels.verdict;
  const [open, setOpen] = useState(0);
  const [ans, setAns] = useState<(number | null)[]>(() => P.questions.map(() => null));
  const counts = [0, 1, 2].map((k) => ans.filter((a) => a === k).length);
  const answered = ans.filter((a) => a !== null).length;
  const icons = [Check, Minus, X];
  const tones = ["text-accent border-accent", "text-ink border-ink/60", "text-warn border-warn"];
  return (
    <Panel title={P.title} badge={<Badge kind="ill">{answered}/{P.questions.length}</Badge>}>
      <ol className="grid gap-1.5">
        {P.questions.map((q, i) => {
          const on = open === i;
          return (
            <li key={q.q} className={`border ${on ? "border-accent/60" : "border-line"}`}>
              <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left">
                <span className="serif text-[15.5px] leading-snug">
                  <span className="mono mr-2 text-[11px] text-mute">{i + 1}</span>
                  {q.q}
                </span>
                {ans[i] !== null && <span className={`tag shrink-0 ${tones[ans[i]!].split(" ")[0]}`}>{P.lean[ans[i]!]}</span>}
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="grid gap-2 px-3 pb-3 sm:grid-cols-2">
                      <div>
                        <div className="tag text-accent">{P.forL}</div>
                        <ul className="mt-1 space-y-1">
                          {q.pro.map((x) => (
                            <li key={x} className="text-[12.5px] leading-snug text-ink/85">+ {x}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="tag text-warn">{P.againstL}</div>
                        <ul className="mt-1 space-y-1">
                          {q.con.map((x) => (
                            <li key={x} className="text-[12.5px] leading-snug text-ink/85">− {x}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-1.5 px-3 pb-3" role="radiogroup" aria-label={q.q}>
                      {P.lean.map((l, k) => {
                        const Icon = icons[k];
                        const sel = ans[i] === k;
                        return (
                          <button
                            key={l}
                            role="radio"
                            aria-checked={sel}
                            onClick={() => {
                              setAns((a) => a.map((x, j) => (j === i ? k : x)));
                              setTimeout(() => setOpen(i + 1 < P.questions.length ? i + 1 : -1), 260);
                            }}
                            className={`tag flex flex-1 items-center justify-center gap-1 border px-1.5 py-1.5 transition-colors ${sel ? `${tones[k]} bg-paper` : "border-line text-mute hover:text-ink"}`}
                          >
                            <Icon size={12} /> {l}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 border-t border-line pt-3">
        <div className="flex items-center justify-between">
          <div className="tag text-mute">
            {P.summary} · {answered} {P.answered}
          </div>
          <IconButton onClick={() => setAns(P.questions.map(() => null))} label={P.reset} disabled={answered === 0}>
            <RotateCcw size={12} />
          </IconButton>
        </div>
        <div className="mt-2 flex h-3 w-full overflow-hidden bg-line" aria-hidden>
          {counts.map((c, k) => (
            <div key={k} className={`h-full transition-[width] duration-500 ${k === 0 ? "bg-accent" : k === 1 ? "bg-ink/50" : "bg-warn"}`} style={{ width: `${(c / P.questions.length) * 100}%` }} />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[11.5px] text-mute">
          {P.lean.map((l, k) => (
            <span key={l}>
              {l}: <span className="mono text-ink">{counts[k]}</span>
            </span>
          ))}
        </div>
        <p className="mt-2 text-[12px] leading-snug text-mute">{P.note}</p>
      </div>
    </Panel>
  );
}
