"use client";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Undo2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { clamp, useStore } from "@/lib/store";
import { explorer, resetExplorer } from "@/lib/explorerStore";
import { categories, layers, type CategoryId } from "@/data/coins/xrp/anatomy";
import { goToChapter } from "@/animations/scrollController";
import { IconButton, Panel } from "./ui";

export default function ExplorerPanel() {
  const { t } = useI18n();
  const P = t.panels.explorer;
  const ex = useStore(explorer, (s) => s);
  const list = ex.category ? layers.filter((l) => l.category === ex.category) : layers;
  const sel = ex.selected;

  const rotate = (d: number) => explorer.set((s) => ({ yaw: s.yaw + d }));
  const zoom = (d: number) => explorer.set((s) => ({ zoom: clamp(s.zoom + d, 0.7, 1.8) }));

  return (
    <Panel title={P.title}>
      <p className="text-[12.5px] leading-snug text-mute">{P.hint}</p>
      <div
        className="mt-3 flex flex-wrap gap-1.5"
        role="radiogroup"
        aria-label={P.title}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") rotate(-0.2);
          if (e.key === "ArrowRight") rotate(0.2);
        }}
      >
        {categories.map((c: CategoryId) => {
          const on = ex.category === c;
          return (
            <button
              key={c}
              role="radio"
              aria-checked={on}
              onClick={() => explorer.set({ category: on ? null : c, selected: -1 })}
              className={`tag rounded-full border px-2.5 py-1.5 transition-colors ${on ? (c === "risks" ? "border-warn bg-warn text-paper" : "border-accent bg-accent text-paper") : "border-ink/70 text-ink hover:bg-paper-2"}`}
            >
              {P.categories[c]}
            </button>
          );
        })}
      </div>

      <ol className="mt-3 grid grid-cols-2 gap-x-3 gap-y-0.5 border-t border-line pt-2.5">
        {list.map((l) => {
          const on = sel === l.index;
          return (
            <li key={l.id}>
              <button
                onClick={() => explorer.set({ selected: on ? -1 : l.index })}
                onMouseEnter={() => explorer.set({ hovered: l.index })}
                onMouseLeave={() => explorer.set({ hovered: -1 })}
                aria-pressed={on}
                className={`flex w-full items-baseline gap-2 py-1 text-left text-[13.5px] transition-colors ${on ? "text-accent" : "text-ink hover:text-accent"}`}
              >
                <span className="mono w-5 shrink-0 text-[11px] text-mute">{String(l.index + 1).padStart(2, "0")}</span>
                <span className="truncate">{t.anatomy[l.index].name}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-2 min-h-[5.5em] border-t border-line pt-2.5" aria-live="polite">
        <AnimatePresence mode="wait">
          {sel >= 0 ? (
            <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <div className="flex items-baseline justify-between gap-2">
                <div className="serif text-[18px]">{t.anatomy[sel].name}</div>
                <button className="tag text-accent underline-offset-4 hover:underline" onClick={() => goToChapter(layers[sel].chapter, 0.3)}>
                  {t.ui.chapter} {String(layers[sel].chapter + 1).padStart(2, "0")} ↗
                </button>
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed">{t.anatomy[sel].body}</p>
            </motion.div>
          ) : (
            <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[13px] text-mute">
              {P.none}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 border-t border-line pt-2.5">
        <IconButton onClick={() => rotate(-0.35)} label={P.rotateLeft}>
          <RotateCcw size={13} />
        </IconButton>
        <IconButton onClick={() => rotate(0.35)} label={P.rotateRight}>
          <RotateCw size={13} />
        </IconButton>
        <IconButton onClick={() => zoom(0.15)} label={P.zoomIn}>
          <ZoomIn size={13} />
        </IconButton>
        <IconButton onClick={() => zoom(-0.15)} label={P.zoomOut}>
          <ZoomOut size={13} />
        </IconButton>
        <IconButton onClick={resetExplorer} label={P.reset}>
          <Undo2 size={13} /> {P.reset}
        </IconButton>
      </div>
    </Panel>
  );
}
