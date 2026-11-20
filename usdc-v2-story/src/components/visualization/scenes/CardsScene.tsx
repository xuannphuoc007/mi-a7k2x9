"use client";
/**
 * Strengths / Weaknesses. Five numbered cards stacked down the stage; each
 * lights up in turn as its beat arrives, with one big number and a short note.
 */
import { chapterIndex, chapters } from "@/data/coins/usdc/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, smooth } from "@/lib/store";
import { C } from "../svg";

function wrap(text: string, max: number) {
  const out: string[] = [];
  let line = "";
  for (const w of text.split(" ")) {
    if ((line + " " + w).trim().length > max) {
      out.push(line.trim());
      line = w;
    } else line += " " + w;
  }
  if (line.trim()) out.push(line.trim());
  return out;
}

function Cards({ id, tone }: { id: "strengths" | "weaknesses"; tone: "good" | "bad" }) {
  const IDX = chapterIndex(id);
  const beats = chapters[IDX].beats;
  const { t } = useI18n();
  const items = t.scenes.cards[id];
  const k = useFontK();
  const mobile = k >= 1.5;
  const big = (s: number, cap: number) => Math.min(s * k, cap);
  const col = tone === "good" ? "#2775ca" : C.warn;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, p: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { p: 1, duration: 1, ease: "none" }, at(0))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  let active = -1;
  beats.forEach((b, i) => {
    if (v.p >= b - 0.07) active = i;
  });

  const H = 150;
  const Y0 = 130;
  return (
    <g opacity={v.vis * (1 - ex)}>
      {items.map((it, i) => {
        const shown = smooth(clamp((v.p - beats[i] + 0.08) / 0.06));
        if (shown <= 0.01) return null;
        const on = i === active;
        const y = Y0 + i * (H + 18);
        const noteLines = wrap(it.note, mobile ? 30 : 40);
        return (
          <g key={it.title} opacity={shown * (on ? 1 : 0.45)} transform={`translate(${(1 - shown) * 30},0)`}>
            <rect x={70} y={y} width={860} height={H} rx={24} fill="#fff" stroke={on ? col : C.line} strokeWidth={on ? 3 : 2} />
            <circle cx={140} cy={y + H / 2} r={40} fill={on ? col : "#fff"} stroke={col} strokeWidth={3} />
            <text x={140} y={y + H / 2 + 12} textAnchor="middle" fill={on ? "#fff" : col} style={{ fontFamily: "var(--font-mono)", fontSize: 34, fontWeight: 700 }}>
              {i + 1}
            </text>
            <text x={205} y={y + (mobile ? 58 : 66)} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(24, 40), fontWeight: 600 }}>
              {it.title}
            </text>
            {noteLines.slice(0, mobile ? 2 : 3).map((l, j) => (
              <text key={j} x={205} y={y + (mobile ? 96 : 102) + j * big(13, 20) * 1.3} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(13, 20) }}>
                {l}
              </text>
            ))}
            <text x={905} y={y + (mobile ? H - 18 : H / 2 + 14)} textAnchor="end" fill={col} style={{ fontFamily: "var(--font-serif)", fontSize: big(mobile ? 26 : 38, 48), fontWeight: 600 }}>
              {it.stat}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function StrengthsScene() {
  return <Cards id="strengths" tone="good" />;
}

export function WeaknessesScene() {
  return <Cards id="weaknesses" tone="bad" />;
}
