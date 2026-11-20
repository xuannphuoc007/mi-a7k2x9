"use client";
import { goToChapter, ui } from "@/animations/scrollController";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useG } from "@/hooks/useG";

/** The route: a bottom bar of stops, one per chapter, with a token riding along (desktop). */
export default function ChapterNav() {
  const { t } = useI18n();
  const chapter = useStore(ui, (s) => s.chapter);
  const g = useG(0.01);
  const n = t.chapters.length;
  const frac = Math.min(1, g / (n - 1));
  return (
    <nav aria-label={t.ui.contents} className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 md:block">
      <div className="relative flex items-center gap-0 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 shadow-[0_10px_30px_-14px_rgba(29,43,58,0.35)] backdrop-blur-md">
        <span aria-hidden className="absolute left-[26px] right-[26px] top-1/2 h-[3px] -translate-y-1/2 rounded bg-[#e3e9f0]" />
        <span aria-hidden className="absolute left-[26px] top-1/2 h-[3px] -translate-y-1/2 rounded bg-accent" style={{ width: `calc((100% - 52px) * ${frac})` }} />
        {t.chapters.map((c, i) => {
          const active = i === chapter;
          return (
            <button
              key={i}
              onClick={() => goToChapter(i)}
              className="group relative z-10 flex h-6 w-10 items-center justify-center outline-offset-4"
              aria-current={active ? "step" : undefined}
              aria-label={`${t.ui.chapter} ${i + 1}: ${c.label}`}
            >
              <span className={`flex items-center justify-center rounded-full text-[10px] font-extrabold transition-all ${active ? "h-6 w-6 bg-accent text-white" : i < chapter ? "h-3 w-3 bg-accent" : "h-3 w-3 border-2 border-[#c8d3df] bg-white"}`}>
                {active ? i + 1 : ""}
              </span>
              <span className="pointer-events-none absolute bottom-8 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
