"use client";
/** Route map (desktop): one metro line, a colour per station, drawn as the train travels. */
import { goToChapter, ui } from "@/animations/scrollController";
import { chapters, DEPART } from "@/data/coins/link/chapters";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useG } from "@/hooks/useG";

const STEP = 64;
const PAD = 22;

export default function ChapterNav() {
  const { t } = useI18n();
  const chapter = useStore(ui, (s) => s.chapter);
  const g = useG(0.005);
  const n = chapters.length;
  const W = PAD * 2 + STEP * (n - 1);
  // marker: sits at a station while dwelling, glides during the run
  const i = Math.floor(g);
  const p = g - i;
  const run = i < n - 1 && p > DEPART ? (p - DEPART) / (1 - DEPART) : 0;
  const pos = Math.min(n - 1, i + (run * run * (3 - 2 * run)));
  const mx = PAD + pos * STEP;
  return (
    <nav aria-label={t.ui.contents} className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 md:block">
      <div className="rounded-2xl bg-white px-3 pb-1.5 pt-6 shadow-[0_14px_40px_-18px_rgba(22,32,44,0.45)] ring-1 ring-black/5">
        <div className="relative" style={{ width: W, height: 30 }}>
          <svg width={W} height={30} className="absolute inset-0" aria-hidden>
            {chapters.slice(0, -1).map((c, k) => {
              const x1 = PAD + k * STEP,
                x2 = x1 + STEP;
              const done = Math.max(0, Math.min(1, pos - k));
              return (
                <g key={k}>
                  <line x1={x1} x2={x2} y1={15} y2={15} stroke="#e3e8ee" strokeWidth={6} strokeLinecap="round" />
                  {done > 0 && <line x1={x1} x2={x1 + STEP * done} y1={15} y2={15} stroke={chapters[k + 1].line} strokeWidth={6} strokeLinecap="round" />}
                </g>
              );
            })}
          </svg>
          {chapters.map((c, k) => {
            const active = k === chapter;
            return (
              <button
                key={k}
                onClick={() => goToChapter(k)}
                className="group absolute top-[15px] -translate-x-1/2 -translate-y-1/2 outline-offset-4"
                style={{ left: PAD + k * STEP }}
                aria-current={active ? "step" : undefined}
                aria-label={`${t.ui.station} ${k + 1}: ${t.chapters[k].label}`}
              >
                <span
                  className="block rounded-full bg-white transition-all"
                  style={{ width: active ? 18 : 12, height: active ? 18 : 12, boxShadow: `inset 0 0 0 ${active ? 4 : 3}px ${k <= pos + 0.01 ? c.line : "#c3ccd6"}` }}
                />
                <span
                  className={`pointer-events-none absolute bottom-[22px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold text-white transition-opacity ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{ background: c.line }}
                >
                  {String(k + 1).padStart(2, "0")} · {t.chapters[k].label}
                </span>
              </button>
            );
          })}
          {/* the train */}
          <span aria-hidden className="pointer-events-none absolute top-[24px] -translate-x-1/2" style={{ left: mx }}>
            <svg width="26" height="10" viewBox="0 0 26 10">
              <rect x="0" y="1" width="22" height="7" rx="2" fill="#16202c" />
              <path d="M20 1h2.5c2 0 3.5 2 3.5 3.5V8H20z" fill="#f39a24" />
              <rect x="3" y="3" width="3" height="2" fill="#fff" />
              <rect x="8" y="3" width="3" height="2" fill="#fff" />
              <rect x="13" y="3" width="3" height="2" fill="#fff" />
            </svg>
          </span>
        </div>
      </div>
    </nav>
  );
}
