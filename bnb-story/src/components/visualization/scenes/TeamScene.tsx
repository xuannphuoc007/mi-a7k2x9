"use client";
/**
 * Act 5 · The people at the top. Three profile cards (initials, no portraits):
 * founder, co-founder & co-CEO, ex-regulator co-CEO — each with role, dates
 * and the main criticism. The card the reader is on is highlighted.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSegmentTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label, Portrait } from "../svg";
import { asset } from "@/lib/asset";
import { Initials } from "./PleaScene";

const IDX = chapterIndex("team");
const COLORS = [C.ink, C.yellow, C.sky];

export default function TeamScene() {
  const { t } = useI18n();
  const L = t.scenes.team;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSegmentTimeline(
    IDX,
    0,
    0.45,
    { vis: 0, cards: 0, focus: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { cards: 3, duration: 0.66, ease: "none" }, at(-0.04))
        .to(v, { focus: 2, duration: 0.6, ease: "none" }, at(0.04))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const focus = v.focus;
  const ts = 15 * Math.min(k, 1.3);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {L.people.map((p, i) => {
        const q = smooth(clamp(v.cards * 1.6 - i * 0.9));
        if (q <= 0.01) return null;
        const active = clamp(1 - Math.abs(focus - i) * 1.4);
        const y = 120 + i * 265;
        const x = lerp(160, 120, active);
        const w = lerp(680, 760, active);
        return (
          <g key={p.name} opacity={q * lerp(0.45, 1, active)} transform={`translate(0,${(1 - q) * 30})`}>
            <rect x={x} y={y} width={w} height={240} rx={12} fill={C.paper} stroke={active > 0.5 ? C.yellow : C.line} strokeWidth={active > 0.5 ? 3 : 1.5} />
            {i === 0 ? (
              <Portrait x={x + 70} y={y + 74} r={40 * lerp(0.9, 1.1, active)} href={asset("/img/cz-portrait.jpg")} id="team-cz" />
            ) : (
              <Initials x={x + 70} y={y + 74} text={p.initials} color={COLORS[i]} s={lerp(0.9, 1.1, active)} />
            )}
            <text x={x + 140} y={y + 58} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(19), fontWeight: 600 }}>
              {p.name}
            </text>
            <Label x={x + 140} y={y + 58 + fs(20)} color={C.accent} size={fs(9.5)}>
              {p.role}
            </Label>
            {p.facts.map((f, j) => (
              <text key={f} x={x + 40} y={y + 140 + j * (ts + 7)} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: ts }}>
                {"· " + f}
              </text>
            ))}
            <text x={x + 40} y={y + 140 + p.facts.length * (ts + 7) + 6} fill={C.warn} style={{ fontFamily: "var(--font-sans)", fontSize: ts, fontStyle: "italic" }}>
              {L.critic + " " + p.critic}
            </text>
          </g>
        );
      })}
      <Label x={500} y={930} anchor="middle" size={fs(8.5)} upper={false} spacing="0.02em">
        {L.note}
      </Label>
    </g>
  );
}
