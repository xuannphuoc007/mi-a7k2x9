"use client";
/**
 * Act 5 · Reality check. Strengths stack on one side of a beam, risks on the
 * other; underneath, the last year of BNB's price. Both are true at once.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSegmentTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { priceAt, LAST_T, NEWS_FROM } from "@/lib/bnbSeries";
import { C, Label } from "../svg";

const IDX = chapterIndex("reality");
const P0 = 2025.85;

export default function RealityScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.reality;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSegmentTimeline(
    IDX,
    0,
    0.5,
    { vis: 0, beam: 0, good: 0, bad: 0, price: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { beam: 1, duration: 0.08 }, at(-0.08))
        .to(v, { good: 1, duration: 0.16, ease: "none" }, at(0.02))
        .to(v, { bad: 1, duration: 0.16, ease: "none" }, at(0.34))
        .to(v, { price: 1, duration: 0.16, ease: "none" }, at(0.6))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const nG = L.good.length;
  const nB = L.bad.length;
  const g = v.good * nG;
  const b = v.bad * nB;
  const tilt = (clamp(b / nB) * 0.95 - clamp(g / nG)) * 0.12; // radians, positive = risks side (right) down
  const nf = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);

  const BX = 500;
  const BY = 470;
  const half = 360;
  const boxH = 58 * Math.min(k, 1.5);
  const boxW = 300;

  // price strip
  const PX0 = 120, PX1 = 880, PY0 = 700, PY1 = 880;
  const pts: string[] = [];
  const minP = 450, maxP = 1500;
  const xOf = (t: number) => PX0 + ((t - P0) / (LAST_T - P0)) * (PX1 - PX0);
  const yOf = (p: number) => PY1 - ((Math.log(p) - Math.log(minP)) / (Math.log(maxP) - Math.log(minP))) * (PY1 - PY0);
  const tEnd = lerp(P0, LAST_T, v.price);
  for (let tt = P0; tt <= tEnd; tt += 0.01) pts.push(`${xOf(tt).toFixed(1)},${yOf(priceAt(tt) ?? minP).toFixed(1)}`);
  const pStart = priceAt(P0) ?? 0;
  const pEnd = priceAt(LAST_T) ?? 0;

  return (
    <g opacity={v.vis * (1 - ex)}>
      <g transform={`translate(${BX},${BY}) rotate(${(tilt * 180) / Math.PI})`} opacity={smooth(v.beam)}>
        <rect x={-half - 20} y={-6} width={(half + 20) * 2} height={12} rx={6} fill={C.ink} opacity={0.85} />
        {L.good.map((s, i) => {
          const q = clamp(g - i);
          if (q <= 0) return null;
          return (
            <g key={s} transform={`translate(${-half / 2 - 20},${-12 - boxH / 2 - i * (boxH + 6) - (1 - smooth(q)) * 60})`} opacity={smooth(q)}>
              <rect x={-boxW / 2} y={-boxH / 2} width={boxW} height={boxH} rx={6} fill="#e8f6ef" stroke={C.mint} strokeWidth={1.4} />
              <text x={0} y={5 * Math.min(k, 1.5)} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 14.5 * Math.min(k, 1.5) }}>
                {s}
              </text>
            </g>
          );
        })}
        {L.bad.map((s, i) => {
          const q = clamp(b - i);
          if (q <= 0) return null;
          return (
            <g key={s} transform={`translate(${half / 2 + 20},${-12 - boxH / 2 - i * (boxH + 6) - (1 - smooth(q)) * 60})`} opacity={smooth(q)}>
              <rect x={-boxW / 2} y={-boxH / 2} width={boxW} height={boxH} rx={6} fill={C.paper} stroke={C.warn} strokeWidth={1.4} />
              <text x={0} y={5 * Math.min(k, 1.5)} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 14.5 * Math.min(k, 1.5) }}>
                {s}
              </text>
            </g>
          );
        })}
      </g>
      <path d={`M${BX - 34},${BY + 90} L${BX},${BY + 10} L${BX + 34},${BY + 90} Z`} fill={C.mute} opacity={smooth(v.beam)} />
      <Label x={BX - half / 2 - 20} y={BY + 60 + fs(4)} anchor="middle" color={C.mint} size={fs(10.5)} opacity={clamp(g)}>
        {L.strengths}
      </Label>
      <Label x={BX + half / 2 + 20} y={BY + 60 + fs(4)} anchor="middle" color={C.warn} size={fs(10.5)} opacity={clamp(b)}>
        {L.risks}
      </Label>

      {v.price > 0.01 && (
        <g opacity={clamp(v.price * 4)}>
          <Label x={PX0} y={PY0 - 16} size={fs(9.5)} color={C.ink}>
            {L.year}
          </Label>
          <line x1={PX0} x2={PX1} y1={PY1} y2={PY1} stroke={C.line} />
          <path d={"M" + pts.join("L")} fill="none" stroke={C.yellow} strokeWidth={3} strokeLinejoin="round" />
          {NEWS_FROM < LAST_T && <line x1={xOf(NEWS_FROM)} x2={xOf(NEWS_FROM)} y1={PY0} y2={PY1} stroke={C.line} strokeDasharray="2 5" />}
          <Label x={PX0} y={PY1 + fs(18)} size={fs(9)}>
            ${nf(pStart)}
          </Label>
          {v.price > 0.98 && (
            <g>
              <circle cx={xOf(LAST_T)} cy={yOf(pEnd)} r={6} fill={C.warn} />
              <Label x={PX1} y={PY1 + fs(18)} anchor="end" color={C.warn} size={fs(9.5)}>
                ${nf(pEnd)} · {L.change}
              </Label>
            </g>
          )}
        </g>
      )}
    </g>
  );
}
