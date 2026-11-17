"use client";
import { goToChapter, ui } from "@/animations/scrollController";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useG } from "@/hooks/useG";
import { chapters } from "@/data/coins/xrp/chapters";

/** Vertical progress indicator with direct chapter navigation (desktop). */
export default function ChapterNav() {
  const { t } = useI18n();
  const chapter = useStore(ui, (s) => s.chapter);
  const g = useG(0.01);
  return (
    <nav aria-label={t.ui.contents} className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <ol className="relative flex flex-col items-end gap-[11px]">
        <span aria-hidden className="absolute right-[3px] top-1 bottom-1 w-px bg-line" />
        <span aria-hidden className="absolute right-[3px] top-1 w-px bg-accent transition-[height] duration-150" style={{ height: `calc(${Math.min(1, g / (t.chapters.length - 0.001)) * 100}% - 8px)` }} />
        {t.chapters.map((c, i) => {
          const active = i === chapter;
          return (
            <li key={i} className={`group relative flex items-center ${i > 0 && chapters[i - 1].act !== chapters[i].act ? "mt-3" : ""}`}>
              <button
                onClick={() => goToChapter(i)}
                className="flex items-center gap-3 outline-offset-4"
                aria-current={active ? "step" : undefined}
                aria-label={`${t.ui.chapter} ${i + 1}: ${c.label}`}
              >
                <span
                  className={`tag pointer-events-none whitespace-nowrap rounded-sm bg-paper/90 px-1.5 py-0.5 transition-all duration-200 ${
                    active ? "text-ink opacity-0 group-hover:opacity-100" : "translate-x-1 text-mute opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  }`}
                >
                  {c.label}
                </span>
                <span className={`tag w-5 text-right ${active ? "text-ink" : "text-mute"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`relative z-10 block h-[7px] w-[7px] rounded-full border transition-all ${active ? "scale-150 border-accent bg-accent shadow-[0_0_10px_#32e685]" : i < chapter ? "border-accent bg-accent/70" : "border-mute bg-paper"}`} />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
