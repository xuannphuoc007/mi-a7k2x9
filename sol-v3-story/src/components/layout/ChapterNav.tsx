"use client";
/** The flight path (desktop): one waypoint per chapter along the bottom; the ship sits on the current one. */
import { goToChapter, ui } from "@/animations/scrollController";
import { chapters, C } from "@/data/coins/sol/chapters";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function ChapterNav() {
  const { t } = useI18n();
  const chapter = useStore(ui, (s) => s.chapter);
  const n = chapters.length;
  const pct = (k: number) => (k / (n - 1)) * 100;
  return (
    <nav aria-label={t.ui.contents} className="fixed bottom-5 left-[500px] right-12 z-40 hidden h-[54px] lg:block">
      <div className="absolute inset-x-0 top-[26px] h-[4px] rounded-full bg-[#e6e1f2]" />
      <div className="absolute left-0 top-[26px] h-[4px] rounded-full transition-[width] duration-500" style={{ width: `${pct(chapter)}%`, background: `linear-gradient(90deg, ${C.purple}, ${C.green})` }} />
      {chapters.map((c, k) => {
        const on = k === chapter;
        const done = k < chapter;
        return (
          <button
            key={k}
            onClick={() => goToChapter(k)}
            className="group absolute top-0 flex h-[54px] w-8 -translate-x-1/2 items-center justify-center"
            style={{ left: `${pct(k)}%` }}
            aria-current={on ? "step" : undefined}
            aria-label={`${t.ui.chapter} ${k + 1}: ${t.chapters[k].label}`}
          >
            {on ? (
              <svg width="34" height="22" viewBox="-60 -26 132 52" className="translate-y-[1px]" aria-hidden>
                <polygon points="-44 -12 -60 -12 -64 -6 -48 -6" fill={C.purple} opacity="0.6" />
                <polygon points="-48 -3 -64 -3 -60 3 -44 3" fill={C.cyan} opacity="0.6" />
                <polygon points="-44 6 -60 6 -64 12 -48 12" fill={C.green} opacity="0.7" />
                <path d="M-8 -12 L-30 -26 L-14 -26 L18 -12 Z" fill={C.violet} />
                <path d="M-8 12 L-30 26 L-14 26 L18 12 Z" fill={C.violet} />
                <path d="M70 0 C 48 -18, 8 -22, -40 -16 L-48 0 L-40 16 C 8 22, 48 18, 70 0 Z" fill="#fff" stroke={C.purple} strokeWidth="5" />
              </svg>
            ) : (
              <span
                className="block h-3 w-3 rotate-45 rounded-[3px] border-2 transition-colors"
                style={{ borderColor: done ? c.color : "#cfc6e6", background: done ? c.color : "#fff" }}
              />
            )}
            <span className="pointer-events-none absolute bottom-[50px] whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-semibold text-white opacity-0 shadow transition-opacity group-hover:opacity-100" style={{ background: c.color }}>
              {String(k + 1).padStart(2, "0")} · {t.chapters[k].label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
