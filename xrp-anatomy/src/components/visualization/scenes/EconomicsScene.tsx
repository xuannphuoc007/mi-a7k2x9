"use client";
/**
 * Act 5 · The Economics. (1) Follow the money from one payment: the fee
 * burns, validators get nothing, value flows to companies around the ledger,
 * holders gain only if the price rises. (2) Four ideas people confuse, with
 * broken links between them. (3) Evidence: ledger activity vs XRP's price.
 */
import { chapterIndex } from "@/data/coins/xrp/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { PRICE_LOG_PATH, NEWS_LOG_PATH, TX_LOG_PATH } from "@/lib/xrpSeries";
import { C, Label } from "../svg";

const IDX = chapterIndex("economics");
const CX = 500;
const CY = 470;

export default function EconomicsScene() {
  const { t } = useI18n();
  const L = t.scenes.economics;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, hub: 0, flow: 0, hubOut: 0, boxes: 0, breaks: 0, boxOut: 0, chart: 0, band: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.05, ease: "none" }, at(-0.12))
        .to(v, { hub: 1, duration: 0.12 }, at(-0.08))
        .to(v, { flow: 1, duration: 0.16, ease: "none" }, at(0.06))
        .to(v, { hubOut: 1, duration: 0.05 }, at(0.24))
        .to(v, { boxes: 1, duration: 0.12, ease: "none" }, at(0.27))
        .to(v, { breaks: 1, duration: 0.08 }, at(0.38))
        .to(v, { boxOut: 1, duration: 0.05 }, at(0.48))
        .to(v, { chart: 1, duration: 0.16, ease: "none" }, at(0.5))
        .to(v, { band: 1, duration: 0.08 }, at(0.62))
        .to(v, { exit: 1, duration: 0.14 }, at(1.0))
        .to(v, { vis: 0, duration: 0.04, ease: "none" }, at(1.16));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);

  // ── 1 · follow the money
  const hubO = smooth(v.hub) * (1 - smooth(v.hubOut));
  const sats = [
    { a: -90, name: L.burned, sub: L.nobody, c: C.warn, kind: "burn" },
    { a: -30, name: L.ripple, sub: L.rippleEarns, c: C.accent, kind: "earn" },
    { a: 30, name: L.firms, sub: L.firmsEarn, c: C.accent, kind: "earn" },
    { a: 90, name: L.holders, sub: L.holdersEarn, c: C.violet, kind: "maybe" },
    { a: 150, name: L.markets, sub: L.marketsEarn, c: C.accent, kind: "earn" },
    { a: 210, name: L.validators, sub: L.nothing, c: C.mute, kind: "zero" },
  ];
  const R = 270;

  // ── 2 · four ideas
  const boxO = smooth(v.boxes) * (1 - smooth(v.boxOut));
  const bw = 190;
  const bxs = [125, 375, 625, 875];

  // ── 3 · evidence chart
  const T0 = 2014.5;
  const T1 = 2027;
  const X0 = 90;
  const X1 = 910;
  const sx = (X1 - X0) / (T1 - T0);
  // tx/day log10 3.0 … 7.0 into 270…690 ; price log10 −2.6 … 0.8 into 270…690
  const ty0 = 3.0, ty1 = 7.0, py0 = -2.6, py1 = 0.8;
  const YT = 290, YB = 690;
  const mTx = `matrix(${sx},0,0,${-(YB - YT) / (ty1 - ty0)},${X0 - T0 * sx},${YB + ty0 * ((YB - YT) / (ty1 - ty0))})`;
  const mPx = `matrix(${sx},0,0,${-(YB - YT) / (py1 - py0)},${X0 - T0 * sx},${YB + py0 * ((YB - YT) / (py1 - py0))})`;
  const chartO = smooth(clamp(v.chart * 3));
  const reveal = X0 + (X1 - X0) * smooth(v.chart);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* 1 · follow the money */}
      {hubO > 0.01 && (
        <g opacity={hubO}>
          {sats.map((s, i) => {
            const ang = (s.a * Math.PI) / 180;
            const x = CX + Math.cos(ang) * R;
            const y = CY + Math.sin(ang) * R * 0.86;
            const p = smooth(clamp(v.flow * 1.4 - i * 0.07));
            const dash = s.kind === "zero" ? "2 6" : undefined;
            const dots = s.kind === "zero" ? 0 : 3;
            return (
              <g key={i}>
                <line x1={CX + Math.cos(ang) * 74} y1={CY + Math.sin(ang) * 74 * 0.86} x2={lerp(CX, x, p)} y2={lerp(CY, y, p)} stroke={s.c} strokeWidth={1.4} strokeDasharray={dash} opacity={0.8} />
                {Array.from({ length: dots }, (_, d) => {
                  const q = ((v.flow * 3 + d / dots) % 1) * p;
                  return <circle key={d} cx={lerp(CX, x, q)} cy={lerp(CY, y, q)} r={3.4} fill={s.c} opacity={p * (1 - q * 0.3)} />;
                })}
                <g transform={`translate(${x},${y})`} opacity={p}>
                  {s.kind === "burn" ? (
                    <g>
                      <circle r={40} fill="url(#glow-warn)" />
                      <path d="M0,-26 C14,-10 18,2 10,16 C6,24 -6,24 -10,16 C-16,6 -10,-4 -4,-10 C-4,0 2,4 4,0 C6,-8 2,-16 0,-26Z" fill={C.warn} />
                    </g>
                  ) : (
                    <circle r={26} fill={C.paper} stroke={s.c} strokeWidth={1.6} />
                  )}
                  {s.kind === "zero" && (
                    <text y={6} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700 }}>
                      0
                    </text>
                  )}
                  {s.kind === "earn" && (
                    <text y={6} textAnchor="middle" fill={s.c} style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700 }}>
                      $
                    </text>
                  )}
                  {s.kind === "maybe" && (
                    <text y={6} textAnchor="middle" fill={s.c} style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700 }}>
                      ?
                    </text>
                  )}
                  <Label x={0} y={(s.a > 0 && s.a < 180 ? 48 : -48) + (s.a > 0 && s.a < 180 ? fs(4) : 0)} anchor="middle" color={C.ink} size={fs(10)} weight={600}>
                    {s.name}
                  </Label>
                  <Label x={0} y={(s.a > 0 && s.a < 180 ? 48 + fs(16) : -48 + fs(14))} anchor="middle" color={s.c} size={fs(9)} upper={false} spacing="0.02em">
                    {s.sub}
                  </Label>
                </g>
              </g>
            );
          })}
          {/* the payment */}
          <g transform={`translate(${CX},${CY}) scale(${lerp(0.6, 1, smooth(v.hub))})`}>
            <circle r={90} fill="url(#glow)" />
            <circle r={70} fill={C.paper} stroke={C.accent} strokeWidth={2} />
            <XrpMark s={1.1} />
          </g>
          {k < 1.5 && (
            <Label x={CX} y={CY + 108} anchor="middle" color={C.accent} size={fs(9.5)}>
              {L.payment}
            </Label>
          )}
        </g>
      )}

      {/* 2 · four ideas people mix up */}
      {boxO > 0.01 && (
        <g opacity={boxO}>
          {L.boxes.map((b, i) => {
            const p = smooth(clamp(v.boxes * 4 - i));
            const x = bxs[i];
            return (
              <g key={b} transform={`translate(${x},${CY}) scale(${lerp(0.7, 1, p)})`} opacity={p}>
                <rect x={-bw / 2 + 8} y={-70} width={bw - 16} height={140} rx={8} fill={C.paper} stroke={i === 0 ? C.accent : i === 3 ? C.violet : C.ink} strokeWidth={1.4} />
                <text y={-34} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(22), fontWeight: 600 }}>
                  {i + 1}
                </text>
                <text y={8} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(17) }}>
                  {b}
                </text>
                <text y={36} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(8.5) }}>
                  {L.boxSub[i]}
                </text>
              </g>
            );
          })}
          {[0, 1, 2].map((i) => {
            const x0 = bxs[i] + bw / 2 - 6;
            const x1 = bxs[i + 1] - bw / 2 + 6;
            const br = smooth(clamp(v.breaks * 3 - i));
            return (
              <g key={i}>
                <line x1={x0} x2={(x0 + x1) / 2 - 6 * br} y1={CY} y2={CY - 4 * br} stroke={C.mute} strokeWidth={1.6} />
                <line x1={(x0 + x1) / 2 + 6 * br} x2={x1} y1={CY + 4 * br} y2={CY} stroke={C.mute} strokeWidth={1.6} />
                <path d={`M${x1 - 8},${CY - 6} L${x1},${CY} L${x1 - 8},${CY + 6}`} fill="none" stroke={C.mute} strokeWidth={1.6} />
              </g>
            );
          })}
          <Label x={500} y={CY + 130} anchor="middle" color={C.warn} size={fs(10)} opacity={smooth(v.breaks)}>
            ≠ {L.not}
          </Label>
        </g>
      )}

      {/* 3 · evidence */}
      {v.chart > 0.001 && (
        <g opacity={chartO}>
          <defs>
            <clipPath id="eco-reveal">
              <rect x={0} y={0} width={reveal} height={1000} />
            </clipPath>
          </defs>
          <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={C.line} />
          {[2016, 2018, 2020, 2022, 2024, 2026].map((y) => (
            <text key={y} x={X0 + (y - T0) * sx} y={YB + fs(18)} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
              {y}
            </text>
          ))}
          {/* 2026 band */}
          <rect x={X0 + (2026 - T0) * sx} y={YT - 30} width={(2026.9 - 2026) * sx} height={YB - YT + 30} fill={C.warn} opacity={0.12 * smooth(v.band)} />
          <g clipPath="url(#eco-reveal)">
            <path d={TX_LOG_PATH} transform={mTx} fill="none" stroke={C.ink} strokeWidth={1.8} vectorEffect="non-scaling-stroke" opacity={0.85} />
            <path d={PRICE_LOG_PATH} transform={mPx} fill="none" stroke={C.accent} strokeWidth={2} vectorEffect="non-scaling-stroke" />
            <path d={NEWS_LOG_PATH} transform={mPx} fill="none" stroke={C.accent} strokeWidth={2} strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
          </g>
          <g transform={`translate(${X0},${YT - 52})`}>
            <rect width={22} height={3} y={-4} fill={C.ink} />
            <Label x={30} y={0} color={C.ink} size={fs(9.5)}>
              {L.activity}
            </Label>
            <rect x={0} y={fs(14)} width={22} height={3} fill={C.accent} />
            <Label x={30} y={fs(18)} color={C.accent} size={fs(9.5)}>
              {L.price}
            </Label>
          </g>
          <Label x={X1} y={YB + fs(38)} anchor="end" size={fs(8)}>
            {L.scale}
          </Label>
        </g>
      )}
    </g>
  );
}

/** the XRP mark, drawn: two mirrored swooshes forming an X */
export function XrpMark({ s = 1, color = "var(--s-accent)" }: { s?: number; color?: string }) {
  return (
    <g transform={`scale(${s})`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M-30,-24 L-12,-6 C-6,0 6,0 12,-6 L30,-24" />
      <path d="M-30,24 L-12,6 C-6,0 6,0 12,6 L30,24" />
    </g>
  );
}
