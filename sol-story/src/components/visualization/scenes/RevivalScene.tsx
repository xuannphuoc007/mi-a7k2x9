"use client";
/**
 * Milestone 4 · The comeback. A gift box opens for BONK (Christmas 2022);
 * SOL's 2023 line draws itself — flat for months while builders keep building,
 * then lifted by the Pyth and Jito airdrops — ending above $100: +900%.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { priceAt, usd } from "@/lib/solSeries";
import { C, Label } from "../svg";

const IDX = chapterIndex("revival");
const T0 = 2022.92, T1 = 2024.0;
const X0 = 150, X1 = 870, YT = 300, YB = 720, PMAX = 120;
const xOf = (t: number) => X0 + ((t - T0) / (T1 - T0)) * (X1 - X0);
const yOf = (p: number) => YB - (p / PMAX) * (YB - YT);
const PTS = Array.from({ length: 120 }, (_, i) => {
  const t = T0 + (i / 119) * (T1 - T0);
  return { t, p: priceAt(t) ?? 10 };
});
const GIFT_T = [2022.98, 2023.89, 2023.935];
const GIFT_COL = ["#e0662f", "#6b7bd6", "#14b07c"];

function Gift({ x, y, s, open, col }: { x: number; y: number; s: number; open: number; col: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-40} y={-30} width={80} height={60} rx={6} fill={col} />
      <rect x={-6} y={-30} width={12} height={60} fill="#fff" opacity={0.85} />
      <g transform={`translate(0,${-30 - open * 26}) rotate(${-open * 18})`}>
        <rect x={-46} y={-16} width={92} height={18} rx={5} fill={col} />
        <rect x={-6} y={-16} width={12} height={18} fill="#fff" opacity={0.85} />
        <path d="M0,-16 q-22,-22 -26,-4 q4,10 26,4 q22,-22 26,-4 q-4,10 -26,4" fill="none" stroke="#fff" strokeWidth={4} />
      </g>
    </g>
  );
}

export default function RevivalScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.revival;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const big = (s: number, cap: number) => Math.min(fs(s), cap);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, box: 0, open: 0, chart: 0, T: T0, gifts: 0, gain: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { box: 1, duration: 0.08 }, at(-0.02))
        .to(v, { open: 1, duration: 0.12 }, at(0.06))
        .to(v, { chart: 1, duration: 0.06 }, at(0.24))
        .to(v, { T: 2023.75, duration: 0.2, ease: "none" }, at(0.27))
        .to(v, { T: 2023.97, duration: 0.18, ease: "none" }, at(0.5))
        .to(v, { gifts: 1, duration: 0.14, ease: "none" }, at(0.52))
        .to(v, { T: T1, duration: 0.06, ease: "none" }, at(0.72))
        .to(v, { gain: 1, duration: 0.1 }, at(0.74))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const box = smooth(v.box);
  const open = smooth(v.open);
  const chart = smooth(v.chart);
  const gain = smooth(v.gain);
  const shown = PTS.filter((q) => q.t <= v.T);
  const line = shown.length > 1 ? "M" + shown.map((q) => `${xOf(q.t).toFixed(1)},${yOf(q.p).toFixed(1)}`).join("L") : "";
  const tip = shown[shown.length - 1] ?? PTS[0];
  const g0 = GIFT_T.map((gt) => ({ x: xOf(gt), y: yOf(priceAt(gt) ?? 10) }));
  // the BONK box: big in the middle, then settles onto the chart
  const bx = lerp(500, g0[0].x, chart);
  const by = lerp(470, g0[0].y - 70, chart);
  const bs = lerp(2.4, 0.8, chart);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* chart frame */}
      <g opacity={chart}>
        <Label x={X0} y={250} size={big(11, 21)} color={C.ink}>
          {L.title}
        </Label>
        {[25, 50, 100].map((p) => (
          <g key={p}>
            <line x1={X0} x2={X1} y1={yOf(p)} y2={yOf(p)} stroke={C.line} />
            <text x={X0 - 10} y={yOf(p) + 5} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(10, 19) }}>
              ${p}
            </text>
          </g>
        ))}
        <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={C.ink} strokeOpacity={0.3} />
        {["2023", "2024"].map((y) => (
          <text key={y} x={xOf(Number(y))} y={YB + 32} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(10, 19) }}>
            {y}
          </text>
        ))}
        {line && <path d={line} fill="none" stroke="#9945ff" strokeWidth={4} strokeLinejoin="round" />}
        <circle cx={xOf(tip.t)} cy={yOf(tip.p)} r={7} fill={C.ink} />
        <text x={xOf(tip.t) + (tip.t > 2023.8 ? -14 : 14)} y={yOf(tip.p) - 16} textAnchor={tip.t > 2023.8 ? "end" : "start"} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 24), fontWeight: 700 }}>
          {usd(tip.p, locale)}
        </text>
        <Label x={xOf(2023.4)} y={yOf(20) - 50} anchor="middle" size={big(10, 19)} upper={false} spacing="0.02em" color={C.accent} opacity={smooth(clamp((v.T - 2023.3) * 4)) * (1 - gain * 0.5)}>
          {L.building}
        </Label>
      </g>

      {/* BONK gift */}
      <g opacity={box}>
        <Gift x={bx} y={by} s={bs} open={open} col={GIFT_COL[0]} />
        <g opacity={open * (1 - chart * 0.2)}>
          <circle cx={bx} cy={by - 60 * bs - open * 30 * bs} r={22 * bs} fill="#f7b731" stroke="#e0662f" strokeWidth={2} />
          <text x={bx} y={by - 60 * bs - open * 30 * bs + 6 * bs} textAnchor="middle" fill="#7a3d0a" style={{ fontFamily: "var(--font-mono)", fontSize: 13 * bs, fontWeight: 800 }}>
            BONK
          </text>
        </g>
        <g opacity={open * (1 - chart)}>
          <Label x={500} y={740} anchor="middle" size={big(12, 22)} color={C.ink}>
            {`${L.gifts[0].d} · ${L.gifts[0].s}`}
          </Label>
        </g>
        {chart > 0.5 && (
          <Label x={g0[0].x + 50} y={g0[0].y - 70} size={big(9.5, 18)} color="#e0662f" opacity={chart}>
            {L.gifts[0].t}
          </Label>
        )}
      </g>

      {/* Pyth & Jito airdrops */}
      {[1, 2].map((i) => {
        const q = smooth(clamp(v.gifts * 2 - (i - 1) * 0.9));
        if (q <= 0.01) return null;
        const g = L.gifts[i];
        const x = g0[i].x - (i === 1 ? 90 : 0);
        const y = i === 1 ? 470 : 360;
        return (
          <g key={g.t} opacity={q}>
            <line x1={x} y1={y + 30} x2={g0[i].x} y2={g0[i].y} stroke={GIFT_COL[i]} strokeDasharray="3 4" />
            <Gift x={x} y={y} s={0.75} open={q} col={GIFT_COL[i]} />
            <text x={x - 50} y={y + 6} opacity={1 - gain} textAnchor="end" fill={GIFT_COL[i]} style={{ fontFamily: "var(--font-sans)", fontSize: big(13, 24), fontWeight: 700 }}>
              {g.t}
            </text>
            <text x={x - 50} y={y + 6 + big(11, 20) * 1.3} opacity={1 - gain} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(10, 19) }}>
              {g.s}
            </text>
          </g>
        );
      })}

      {/* +900% */}
      {gain > 0.01 && (
        <g opacity={gain}>
          <text x={X0 + 20} y={420} fill="#14b07c" style={{ fontFamily: "var(--font-serif)", fontSize: big(76, 130), fontWeight: 600 }}>
            {L.gain}
          </text>
          <Label x={X0 + 24} y={470} size={big(11, 21)} upper={false} spacing="0.02em" color={C.ink}>
            {L.gainSub}
          </Label>
        </g>
      )}
    </g>
  );
}
