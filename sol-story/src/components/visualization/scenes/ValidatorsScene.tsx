"use client";
/**
 * Act 3 · Validators & SOL supply. A shrinking crowd of validators; a donut of
 * staked SOL with the ≈18–20 largest highlighted; then the inflation curve from
 * 8% toward a 1.5% floor, and the steeper path voted in August 2026 (schematic).
 */
import { useMemo } from "react";
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, mulberry32, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("validators");
const CX = 500;
const CY = 520;
/** inflation chart frame */
const X0 = 160, X1 = 870, YT = 300, YB = 720, T0 = 2021, T1 = 2034;
const xOf = (t: number) => X0 + ((t - T0) / (T1 - T0)) * (X1 - X0);
const yOf = (p: number) => YB - (p / 8.5) * (YB - YT);
const orig = (t: number) => Math.max(1.5, 8 * Math.pow(0.871, Math.max(0, t - 2021.1)));
const FAST_T = 2026.75;
const fast = (t: number) => (t < FAST_T ? orig(t) : Math.max(1.5, orig(FAST_T) * Math.pow(0.7, t - FAST_T)));
const path = (f: (t: number) => number, a: number, b: number) => {
  const pts: string[] = [];
  for (let t = a; t <= b + 1e-6; t += 0.1) pts.push(`${xOf(t).toFixed(1)},${yOf(f(t)).toFixed(1)}`);
  return "M" + pts.join("L");
};
const ORIG_D = path(orig, 2021.1, T1);
const FAST_D = path(fast, FAST_T, T1);

export default function ValidatorsScene() {
  const { t } = useI18n();
  const L = t.scenes.validators;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const crowd = useMemo(() => {
    const r = mulberry32(5);
    return Array.from({ length: 150 }, (_, i) => {
      const a = (i / 150) * Math.PI * 2 + r() * 0.04;
      const rad = 210 + r() * 90;
      return { x: CX + Math.cos(a) * rad, y: CY + Math.sin(a) * rad * 0.92, s: 3 + Math.pow(r(), 3) * 12, keep: i % 3 === 0 };
    });
  }, []);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, crowd: 0, shrink: 0, donut: 0, nak: 0, infl: 0, faster: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { crowd: 1, duration: 0.08 }, at(-0.02))
        .to(v, { shrink: 1, duration: 0.14 }, at(0.08))
        .to(v, { donut: 1, duration: 0.12 }, at(0.27))
        .to(v, { nak: 1, duration: 0.08 }, at(0.38))
        .to(v, { infl: 1, duration: 0.16 }, at(0.5))
        .to(v, { faster: 1, duration: 0.12 }, at(0.72))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const crowdO = smooth(v.crowd);
  const shrink = smooth(v.shrink);
  const donut = smooth(v.donut);
  const nak = smooth(v.nak);
  const infl = smooth(v.infl);
  const faster = smooth(v.faster);
  const ringO = crowdO * (1 - clamp(infl * 2.5));
  const chartO = clamp(infl * 1.6 - 0.6);

  const R = 150;
  const circ = 2 * Math.PI * R;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {ringO > 0.01 && (
        <g opacity={ringO}>
          {crowd.map((c, i) => {
            const o = c.keep ? 1 : 1 - shrink;
            if (o <= 0.01) return null;
            const big = c.keep && i % 9 === 0 && nak > 0;
            return <circle key={i} cx={c.x} cy={c.y} r={c.s} fill={big ? C.warn : "#9945ff"} opacity={(big ? 0.9 : 0.35) * o * (1 - donut * 0.2)} />;
          })}
          <g opacity={1 - clamp(donut * 2.5)}>
            <text x={CX} y={CY - 8} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: Math.min(fs(34), 58), fontWeight: 600 }}>
              {L.count}
            </text>
            <Label x={CX} y={CY + 30} anchor="middle" size={fs(10.5)} opacity={shrink}>
              {L.was}
            </Label>
          </g>
          {donut > 0.01 && (
            <g opacity={donut}>
              <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.line} strokeWidth={34} />
              <circle cx={CX} cy={CY} r={R} fill="none" stroke="#9945ff" strokeWidth={34} strokeDasharray={`${circ * 0.68 * donut} ${circ}`} transform={`rotate(-90 ${CX} ${CY})`} />
              <text x={CX} y={CY + 14} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(48), fontWeight: 600 }}>
                68%
              </text>
              <Label x={CX} y={CY + 48} anchor="middle" size={fs(9.5)}>
                {L.staked}
              </Label>
            </g>
          )}
          <g opacity={nak}>
            <Label x={CX} y={190} anchor="middle" size={fs(10.5)} color={C.warn}>
              {L.nak}
            </Label>
            <Label x={CX} y={870} anchor="middle" size={fs(10)}>
              {L.noslash}
            </Label>
          </g>
        </g>
      )}

      {/* inflation */}
      {chartO > 0.01 && (
        <g opacity={chartO}>
          <Label x={X0} y={250} size={fs(11)} color={C.ink}>
            {L.inflTitle}
          </Label>
          {!mobile && (
            <Label x={X1} y={250} anchor="end" size={fs(8.5)}>
              {L.schematic}
            </Label>
          )}
          {[2, 4, 6, 8].map((p) => (
            <g key={p}>
              <line x1={X0} x2={X1} y1={yOf(p)} y2={yOf(p)} stroke={C.line} />
              <text x={X0 - 10} y={yOf(p) + 4} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
                {p}%
              </text>
            </g>
          ))}
          <line x1={X0} x2={X1} y1={yOf(1.5)} y2={yOf(1.5)} stroke={C.mint} strokeDasharray="6 6" />
          <Label x={X0 + 8} y={yOf(1.5) + 26} size={fs(9.5)} color={C.mint}>
            {L.floor}
          </Label>
          {[2022, 2026, 2030, 2034].map((y) => (
            <text key={y} x={xOf(y)} y={YB + 28} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
              {y}
            </text>
          ))}
          <path d={ORIG_D} fill="none" stroke="#9945ff" strokeWidth={3} pathLength={1} strokeDasharray={`${infl} 1`} strokeOpacity={1 - faster * 0.55} />
          <Label x={X1} y={285} anchor="end" size={fs(9.5)} color="#9945ff" opacity={infl}>
            {L.old}
          </Label>
          <circle cx={xOf(2026.5)} cy={yOf(orig(2026.5))} r={8} fill={C.ink} opacity={smooth(clamp(infl * 2 - 1))} />
          <Label x={xOf(2026.5) + 14} y={yOf(orig(2026.5)) - 14} size={fs(9.5)} color={C.ink} opacity={smooth(clamp(infl * 2 - 1))}>
            {L.now}
          </Label>
          {faster > 0.01 && (
            <g opacity={faster}>
              <path d={FAST_D} fill="none" stroke="#14b07c" strokeWidth={4} pathLength={1} strokeDasharray={`${faster} 1`} />
              <Label x={X1} y={285 + fs(9.5) * 1.8} anchor="end" size={fs(9.5)} color="#14b07c">
                {L.fast}
              </Label>
            </g>
          )}
        </g>
      )}
    </g>
  );
}
