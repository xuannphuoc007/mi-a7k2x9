"use client";
/**
 * Act 5 · Reality check. A balance weighs strengths against risks, then SOL's
 * last twelve months are drawn as a single calm line with its change.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { LAST_T, priceAt, usd } from "@/lib/solSeries";
import { C, Label } from "../svg";

const IDX = chapterIndex("balance");
const PIV = { x: 500, y: 300 };
const ARM = 270;
const T_A = LAST_T - 1;
const SX0 = 140, SX1 = 860, SYT = 330, SYB = 700;
const PTS = Array.from({ length: 105 }, (_, i) => {
  const t = T_A + (i / 104) * (LAST_T - T_A);
  return { t, p: priceAt(t) ?? 0 };
});
const PMAX = Math.max(...PTS.map((p) => p.p)) * 1.08;
const PMIN = Math.min(...PTS.map((p) => p.p)) * 0.85;
const sx = (t: number) => SX0 + ((t - T_A) / (LAST_T - T_A)) * (SX1 - SX0);
const sy = (p: number) => SYB - ((p - PMIN) / (PMAX - PMIN)) * (SYB - SYT);
const SPARK = "M" + PTS.map((q) => `${sx(q.t).toFixed(1)},${sy(q.p).toFixed(1)}`).join("L");

export default function RealityScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.reality;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, beam: 0, good: 0, bad: 0, chart: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { beam: 1, duration: 0.08 }, at(-0.02))
        .to(v, { good: 1, duration: 0.16, ease: "none" }, at(0.04))
        .to(v, { bad: 1, duration: 0.18, ease: "none" }, at(0.3))
        .to(v, { chart: 1, duration: 0.2 }, at(0.58))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const beam = smooth(v.beam);
  const chart = smooth(v.chart);
  const balO = beam * (1 - clamp(chart * 2.5));
  const chartO = clamp(chart * 1.6 - 0.6);
  // the beam tips toward strengths, then back to level as risks pile up
  const tilt = (v.good * 5 - v.bad * 5) * 1;
  const rad = (tilt * Math.PI) / 180;
  const left = { x: PIV.x - Math.cos(rad) * ARM, y: PIV.y + Math.sin(rad) * ARM };
  const right = { x: PIV.x + Math.cos(rad) * ARM, y: PIV.y - Math.sin(rad) * ARM };
  const f = Math.min(fs(12), 24);
  const chipW = 270;

  const pan = (p: { x: number; y: number }, items: string[], q: number, col: string) => (
    <g>
      <line x1={p.x} y1={p.y} x2={p.x - 110} y2={p.y + 110} stroke={C.mute} strokeWidth={1.5} />
      <line x1={p.x} y1={p.y} x2={p.x + 110} y2={p.y + 110} stroke={C.mute} strokeWidth={1.5} />
      <path d={`M${p.x - 130},${p.y + 110} Q${p.x},${p.y + 160} ${p.x + 130},${p.y + 110} Z`} fill="#fff" stroke={C.ink} strokeWidth={2} />
      {items.map((s, i) => {
        const o = smooth(clamp(q * items.length - i));
        if (o <= 0.01) return null;
        const y = p.y + 112 - (i + 1) * (f * 2 + 10) + (1 - o) * -30;
        return (
          <g key={s} opacity={o}>
            <rect x={p.x - chipW / 2} y={y - f} width={chipW} height={f * 2} rx={f} fill={col} />
            <text x={p.x} y={y + f * 0.36} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-sans)", fontSize: f, fontWeight: 600 }}>
              {s}
            </text>
          </g>
        );
      })}
    </g>
  );

  const last = PTS[PTS.length - 1];
  const first = PTS[0];
  return (
    <g opacity={v.vis * (1 - ex)}>
      {balO > 0.01 && (
        <g opacity={balO} transform="translate(0,170)">
          <path d={`M${PIV.x - 40},${PIV.y + 360} L${PIV.x},${PIV.y} L${PIV.x + 40},${PIV.y + 360} Z`} fill={C.line} />
          <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          <circle cx={PIV.x} cy={PIV.y} r={10} fill={C.ink} />
          {pan(left, L.strengths, v.good, "#14b07c")}
          {pan(right, L.risks, v.bad, C.warn)}
        </g>
      )}

      {chartO > 0.01 && (
        <g opacity={chartO}>
          <Label x={SX0} y={250} size={fs(11)} color={C.ink}>
            {L.year}
          </Label>
          <line x1={SX0} x2={SX1} y1={SYB} y2={SYB} stroke={C.ink} strokeOpacity={0.3} />
          <path d={SPARK} fill="none" stroke="#7a3ff0" strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray={`${chart} 1`} />
          <circle cx={sx(first.t)} cy={sy(first.p)} r={6} fill="#7a3ff0" />
          <text x={sx(first.t)} y={sy(first.p) - 18} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 700 }}>
            {usd(first.p, locale)}
          </text>
          <g opacity={smooth(clamp(chart * 2 - 1))}>
            <circle cx={sx(last.t)} cy={sy(last.p)} r={7} fill={C.warn} />
            <text x={sx(last.t)} y={sy(last.p) + 36} textAnchor="end" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 700 }}>
              {usd(last.p, locale)}
            </text>
            <text x={SX1} y={240} textAnchor="end" fill={C.warn} style={{ fontFamily: "var(--font-serif)", fontSize: fs(58), fontWeight: 600 }}>
              {`${Math.round((last.p / first.p - 1) * 100)}%`.replace("-", "−")}
            </text>
            <text x={SX0} y={800} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(30), fontWeight: 600 }}>
              {L.fromVal}
            </text>
            <Label x={SX0} y={835} size={fs(10)} upper={false} spacing="0.02em">
              {L.from}
            </Label>
          </g>
        </g>
      )}
    </g>
  );
}
