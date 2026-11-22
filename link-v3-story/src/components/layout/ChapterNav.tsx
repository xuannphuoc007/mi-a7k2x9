"use client";
/** The chain (desktop): one hexagon link per chapter, filled as you read. */
import { goToChapter, ui } from "@/animations/scrollController";
import { chapters, C } from "@/data/coins/link/chapters";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

function hex(cx: number, cy: number, r: number, rot: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = ((rot + k * 60) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

export default function ChapterNav() {
  const { t } = useI18n();
  const chapter = useStore(ui, (s) => s.chapter);
  const STEP = 34;
  const H = STEP * (chapters.length - 1) + 40;
  return (
    <nav aria-label={t.ui.contents} className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="relative" style={{ width: 40, height: H }}>
        <svg width={40} height={H} className="absolute inset-0" aria-hidden>
          {chapters.map((c, k) => {
            const cy = 20 + k * STEP;
            const done = k <= chapter;
            return (
              <polygon
                key={k}
                points={hex(20, cy, k === chapter ? 13 : 11, k % 2 ? -90 : -60)}
                fill={k === chapter ? c.color : "none"}
                stroke={done ? c.color : "#c3ccd6"}
                strokeWidth={k === chapter ? 3 : 4.5}
                style={{ transition: "all .4s" }}
              />
            );
          })}
        </svg>
        {chapters.map((c, k) => (
          <button
            key={k}
            onClick={() => goToChapter(k)}
            className="group absolute left-0 flex h-[30px] w-[40px] items-center justify-center"
            style={{ top: 5 + k * STEP }}
            aria-current={k === chapter ? "step" : undefined}
            aria-label={`${t.ui.chapter} ${k + 1}: ${t.chapters[k].label}`}
          >
            <span
              className={`pointer-events-none absolute left-[46px] whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-semibold text-white shadow transition-opacity ${
                "opacity-0 group-hover:opacity-100"
              }`}
              style={{ background: c.color === C.ink ? "#24305e" : c.color }}
            >
              {String(k + 1).padStart(2, "0")} · {t.chapters[k].label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
