"use client";
/**
 * Act 4 · Open allegations. The 10/10 crash: USDe briefly breaks to ~$0.65 on
 * Binance while holding near $1 elsewhere, then $283M is repaid. The 2026
 * Iran-flow reports as a chain of dated steps, each tagged ALLEGED; then
 * Binance's denial and lawsuit, the newspaper's position, and "no ruling yet".
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSegmentTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Chip, Label } from "../svg";

const IDX = chapterIndex("probes");

/** illustrative shape of the 40-minute window (21:00–22:20 UTC, 10 Oct 2025) */
const BIN = (x: number) => (x < 0.45 ? 1 : x < 0.55 ? lerp(1, 0.65, (x - 0.45) / 0.1) : x < 0.7 ? 0.65 + Math.sin(x * 60) * 0.03 : lerp(0.68, 0.99, (x - 0.7) / 0.3));
const ELSE = (x: number) => 1 - (x > 0.45 && x < 0.75 ? 0.012 * Math.sin((x - 0.45) * 10) : 0);

export default function ProbesScene() {
  const { t } = useI18n();
  const L = t.scenes.probes;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSegmentTimeline(
    IDX,
    0,
    0.5,
    { vis: 0, crash: 0, repay: 0, chain: 0, resp: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { crash: 1, duration: 0.18, ease: "none" }, at(-0.02))
        .to(v, { repay: 1, duration: 0.06 }, at(0.18))
        .to(v, { crash: 0, repay: 0, duration: 0.05 }, at(0.27))
        .to(v, { chain: 1, duration: 0.24, ease: "none" }, at(0.3))
        .to(v, { resp: 1, duration: 0.2, ease: "none" }, at(0.6))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const crash = v.crash;
  const chain = v.chain;
  const resp = v.resp;

  // crash chart
  const X0 = 140, X1 = 860, Y0 = 260, Y1 = 640;
  const yOf = (p: number) => Y1 - ((p - 0.55) / 0.5) * (Y1 - Y0);
  const xOf = (f: number) => X0 + f * (X1 - X0);
  const path = (fn: (x: number) => number, upTo: number) => {
    const pts: string[] = [];
    for (let f = 0; f <= upTo; f += 0.01) pts.push(`${xOf(f).toFixed(1)},${yOf(fn(f)).toFixed(1)}`);
    return pts.length ? "M" + pts.join("L") : "";
  };
  const liq = 19 * smooth(clamp((crash - 0.4) * 2.5));

  const steps = L.steps;
  const allegedTop = lerp(1, 0.4, smooth(resp));

  return (
    <g opacity={v.vis * (1 - ex)}>
      {crash > 0.01 && (
        <g opacity={smooth(clamp(crash * 5))}>
          <Label x={X0} y={Y0 - 50} color={C.ink} size={fs(11)}>
            {L.crashTitle}
          </Label>
          {[1, 0.8, 0.6].map((p) => (
            <g key={p}>
              <line x1={X0} x2={X1} y1={yOf(p)} y2={yOf(p)} stroke={C.line} strokeDasharray="2 6" />
              <text x={X0 - 10} y={yOf(p) + 4} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(10) }}>
                ${p.toFixed(2)}
              </text>
            </g>
          ))}
          <path d={path(ELSE, crash)} fill="none" stroke={C.mint} strokeWidth={3} />
          <path d={path(BIN, crash)} fill="none" stroke={C.warn} strokeWidth={3} />
          <Label x={X1} y={yOf(1) - 14} anchor="end" color={C.mint} size={fs(9.5)}>
            {L.elsewhere}
          </Label>
          {crash > 0.55 && (
            <Label x={xOf(0.56)} y={yOf(0.62) + 30 + fs(4)} color={C.warn} size={fs(9.5)}>
              {L.onBinance}
            </Label>
          )}
          <text x={X1} y={Y0 - 44} textAnchor="end" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(22), fontWeight: 700 }}>
            ${liq.toFixed(0)}B+
          </text>
          <Label x={X1} y={Y0 - 44 + fs(18)} anchor="end" size={fs(9)}>
            {L.liquidated}
          </Label>
          <g opacity={smooth(v.repay)}>
            <Chip x={500} y={760} text={L.repaid} color={C.mint} k={k} s={1.15} />
            <Label x={500} y={820 + fs(4)} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em">
              {L.binanceSays}
            </Label>
          </g>
          <Label x={500} y={Y1 + 34 + fs(4)} anchor="middle" size={fs(8.5)}>
            {L.illustrative}
          </Label>
        </g>
      )}

      {chain > 0.01 && (
        <g>
          <Label x={500} y={150} anchor="middle" color={C.ink} size={fs(12)} opacity={smooth(clamp(chain * 5))}>
            {L.iranTitle}
          </Label>
          {steps.map((s, i) => {
            const q = smooth(clamp(chain * steps.length * 1.1 - i));
            if (q <= 0.01) return null;
            const y = 230 + i * lerp(118, 70, smooth(resp));
            return (
              <g key={s.date} opacity={q * allegedTop + (1 - allegedTop) * 0.4}>
                {i > 0 && <line x1={300} x2={300} y1={y - lerp(118, 70, smooth(resp)) + 30} y2={y - 30} stroke={C.ink} strokeWidth={2} />}
                <rect x={120} y={y - 30} width={560} height={60} rx={6} fill={C.paper} stroke={C.ink} strokeWidth={1.4} />
                <text x={140} y={y + 6} fill={C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: 12 * Math.min(k, 1.3), fontWeight: 700 }}>
                  {s.date}
                </text>
                <text x={250} y={y + 6} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 14.5 * Math.min(k, 1.25) }}>
                  {s.what}
                </text>
                <g transform={`translate(790,${y}) rotate(-6)`}>
                  <rect x={-74} y={-20} width={148} height={40} rx={4} fill="none" stroke={C.peach} strokeWidth={3} />
                  <text y={8} textAnchor="middle" fill={C.peach} style={{ fontFamily: "var(--font-mono)", fontSize: 17, fontWeight: 800, letterSpacing: "0.08em" }}>
                    {L.alleged}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      )}

      {resp > 0.01 && (
        <g>
          {L.responses.map((r, i) => {
            const q = smooth(clamp(resp * 4 - i));
            const y = 600 + i * 92;
            const col = r.who === "binance" ? C.yellow : r.who === "wsj" ? C.lilac : C.mute;
            return (
              <g key={r.text} opacity={q}>
                <rect x={120} y={y - 34} width={760} height={68} rx={8} fill={C.paper} stroke={col} strokeWidth={2.5} />
                <rect x={120} y={y - 34} width={10} height={68} fill={col} />
                <text x={150} y={y + 6} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 15 * Math.min(k, 1.25) }}>
                  {r.text}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}
