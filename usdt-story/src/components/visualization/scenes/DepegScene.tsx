"use client";
/**
 * 6 · The anchor slips (May 2022). TerraUSD sinks below the waterline; USDT
 * dips to $0.95 for a few hours (schematic); the supply bar shrinks as
 * billions are paid out and burned; the anchor holds at $1.
 */
import { chapterIndex } from "@/data/coins/usdt/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Flame, Logo, Token } from "../svg";

const IDX = chapterIndex("depeg");
// schematic intraday path: [x 0..1, price]
const PATH: [number, number][] = [[0, 1.0], [0.2, 0.999], [0.32, 0.997], [0.4, 0.985], [0.47, 0.962], [0.52, 0.95], [0.56, 0.962], [0.62, 0.98], [0.7, 0.985], [0.8, 0.993], [0.9, 0.997], [1, 0.999]];

function Anchor({ x, y, s = 1, color = C.ink }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round">
      <circle cx={0} cy={-80} r={18} />
      <line x1={0} y1={-62} x2={0} y2={70} />
      <line x1={-40} y1={-30} x2={40} y2={-30} />
      <path d="M-70,20 C-60,70 -30,80 0,80 C30,80 60,70 70,20" />
      <path d="M-82,32 L-70,18 L-56,30" />
      <path d="M82,32 L70,18 L56,30" />
    </g>
  );
}

export default function DepegScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.depeg;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, sink: 0, chart: 0, draw: 0, bar: 0, shrink: 0, hold: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { sink: 1, duration: 0.2, ease: "power1.in" }, at(0.0))
        .to(v, { chart: 1, duration: 0.06 }, at(0.24))
        .to(v, { draw: 1, duration: 0.18, ease: "none" }, at(0.28))
        .to(v, { bar: 1, duration: 0.06 }, at(0.48))
        .to(v, { shrink: 1, duration: 0.16, ease: "none" }, at(0.52))
        .to(v, { hold: 1, duration: 0.1 }, at(0.71))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const fsz = big(15, 25);
  const aO = fadeOut(smooth(v.chart));
  const chartO = fadeIn(smooth(v.chart)) * fadeOut(smooth(v.bar));
  const barO = fadeIn(smooth(v.bar)) * fadeOut(smooth(v.hold));
  const holdO = fadeIn(smooth(v.hold));
  const wave = (y: number, ph: number) => {
    let d = `M80,${y}`;
    for (let x = 80; x <= 920; x += 10) d += ` L${x},${(y + Math.sin(x / 40 + ph) * 8).toFixed(1)}`;
    return d;
  };
  const price = (p: number) => (locale === "vi-VN" ? p.toFixed(2).replace(".", ",") : "$" + p.toFixed(2));
  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* A: TerraUSD sinks */}
      {aO > 0.01 && (
        <g opacity={aO}>
          <rect x={80} y={430} width={840} height={460} fill="#dfe9ee" opacity={0.5} />
          <path d={wave(430, v.sink * 4)} fill="none" stroke="#7fa6b8" strokeWidth={3} />
          {(() => {
            const y = lerp(300, 740, smooth(v.sink));
            const p = lerp(1, 0.3, smooth(clamp(v.sink * 1.2)));
            return (
              <g>
                <Logo x={500} y={y} w={160} h={160} href="/img/terra.png" opacity={1 - v.sink * 0.35} />
                <text x={500 + 120} y={y + 12} fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: big(24, 36), fontWeight: 600 }}>
                  {price(p)}
                </text>
              </g>
            );
          })()}
          <text x={500} y={200} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(32, 48) }}>
            {L.ust}
          </text>
          <text x={500} y={200 + big(16, 26) * 1.8} textAnchor="middle" fill={C.warn} opacity={smooth(clamp(v.sink * 2 - 1))} style={{ fontFamily: "var(--font-mono)", fontSize: big(16, 26) }}>
            {price(1)} → {L.ustLow}
          </text>
        </g>
      )}

      {/* B: USDT dips to $0.95 */}
      {chartO > 0.01 && (
        <g opacity={chartO}>
          {(() => {
            const X0 = mobile ? 170 : 150, X1 = 880, YT = 260, YB = 760;
            const yOf = (p: number) => YB - ((p - 0.94) / 0.07) * (YB - YT);
            const n = PATH.filter(([x]) => x <= v.draw);
            const last = n[n.length - 1];
            const d = "M" + n.map(([x, p]) => `${lerp(X0, X1, x).toFixed(1)},${yOf(p).toFixed(1)}`).join("L") + (v.draw > last[0] ? (() => {
              const i = PATH.indexOf(last);
              const nx = PATH[i + 1];
              if (!nx) return "";
              const f = (v.draw - last[0]) / (nx[0] - last[0]);
              return `L${lerp(X0, X1, v.draw).toFixed(1)},${yOf(lerp(last[1], nx[1], f)).toFixed(1)}`;
            })() : "");
            return (
              <g>
                <text x={X0} y={190} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(30, 46) }}>
                  {L.usdt}
                </text>
                {[1.0, 0.98, 0.96, 0.95].map((p) => (
                  <g key={p}>
                    <line x1={X0} x2={X1} y1={yOf(p)} y2={yOf(p)} stroke={p === 1 ? C.gd : C.line} strokeWidth={p === 1 ? 3 : 1.5} strokeDasharray={p === 1 ? undefined : "4 6"} />
                    <text x={X0 - 12} y={yOf(p) + 6} textAnchor="end" fill={p === 1 ? C.gd : C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22) }}>
                      {price(p)}
                    </text>
                  </g>
                ))}
                <path d={d} fill="none" stroke={C.warn} strokeWidth={5} strokeLinejoin="round" />
                <g opacity={smooth(clamp((v.draw - 0.52) * 8))}>
                  <circle cx={lerp(X0, X1, 0.52)} cy={yOf(0.95)} r={10} fill={C.warn} />
                  <text x={lerp(X0, X1, 0.52) + 24} y={yOf(0.95) + 8} fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: big(15, 24), fontWeight: 600 }}>
                    {L.usdtLow}
                  </text>
                </g>
              </g>
            );
          })()}
        </g>
      )}

      {/* C: supply shrinks as Tether pays out */}
      {barO > 0.01 && (
        <g opacity={barO}>
          {(() => {
            const X0 = 100, W84 = 760, Y = 420, H = 120;
            const w = lerp(W84, (W84 * 73) / 84, smooth(v.shrink));
            return (
              <g>
                <text x={X0} y={Y - 50} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {L.supply}
                </text>
                <rect x={X0} y={Y} width={W84} height={H} rx={12} fill="none" stroke={C.line} strokeWidth={3} strokeDasharray="8 8" />
                <rect x={X0} y={Y} width={w} height={H} rx={12} fill={C.green} />
                <text x={X0 + 24} y={Y + H / 2 + 14} fill="#fff" style={{ fontFamily: "var(--font-serif)", fontSize: big(34, 48), fontWeight: 500 }}>
                  {v.shrink > 0.6 ? L.to : L.from}
                </text>
                {v.shrink > 0.02 && v.shrink < 0.99 && <Flame x={X0 + w + 10} y={Y + H / 2 + 20} s={1.2} t={v.shrink * 8} />}
                {Array.from({ length: 6 }, (_, i) => {
                  const q = clamp(v.shrink * 1.4 - i * 0.07);
                  if (q <= 0 || q >= 1) return null;
                  return <Token key={i} x={X0 + w - 20 + q * 60} y={Y + H + 60 + q * 160} r={16} opacity={1 - q} />;
                })}
                <text x={500} y={Y + H + 300} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: big(26, 42) }}>
                  {L.redeemed}
                </text>
              </g>
            );
          })()}
        </g>
      )}

      {/* D: the anchor holds */}
      {holdO > 0.01 && (
        <g opacity={holdO}>
          <line x1={120} x2={880} y1={300} y2={300} stroke={C.gd} strokeWidth={4} />
          <text x={120} y={280} fill={C.gd} style={{ fontFamily: "var(--font-mono)", fontSize: big(16, 26), fontWeight: 600 }}>
            {L.peg}
          </text>
          <line x1={500} x2={500} y1={300} y2={480} stroke={C.ink} strokeWidth={4} strokeDasharray="14 8" />
          <Anchor x={500} y={600} s={1.4} color={C.gd} />
          <Token x={500} y={300} r={46} />
          <text x={500} y={850} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(40, 60) }}>
            {L.holds}
          </text>
        </g>
      )}
    </g>
  );
}
