"use client";
/** Chapter 1 overlay: the whitepaper unfolds, block 0 assembles and the chain starts to grow. */
import { BASE_Y, type Frame } from "@/animations/chartController";
import { events, GENESIS_T } from "@/data/coins/btc/events";
import { range, smooth } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const ORANGE = "#f7931a";
const WP_T = events.find((e) => e.id === "whitepaper")!.t;

function Cube({ x, y, s, q, spread = 60, glow = false }: { x: number; y: number; s: number; q: number; spread?: number; glow?: boolean }) {
  if (q <= 0) return null;
  const a = s * 0.866;
  const d = (1 - q) * spread;
  return (
    <g opacity={q}>
      {glow && <circle cx={x} cy={y} r={s * 2.6} fill="url(#glow)" opacity={q} />}
      <path d={`M${x},${y - s} L${x + a},${y - s / 2} L${x},${y} L${x - a},${y - s / 2}Z`} transform={`translate(0,${-d})`} fill={ORANGE} />
      <path d={`M${x - a},${y - s / 2} L${x},${y} L${x},${y + s} L${x - a},${y + s / 2}Z`} transform={`translate(${-d},${d * 0.4})`} fill="#b86a0e" />
      <path d={`M${x + a},${y - s / 2} L${x},${y} L${x},${y + s} L${x + a},${y + s / 2}Z`} transform={`translate(${d},${d * 0.4})`} fill="#6e3f08" />
    </g>
  );
}

export function GenesisOverlay({ f, m }: { f: Frame; m: number }) {
  const { t, lang } = useI18n();
  const fs = (px: number) => px * f.u;
  const T = f.T;
  const xg = f.xOf(GENESIS_T);
  const cubeY = BASE_Y - 36;
  const q0 = smooth(range(T, GENESIS_T - 0.03, GENESIS_T + 0.004));
  const wpq = smooth(range(T, WP_T, WP_T + 0.05));
  const xw = f.xOf(WP_T);
  const n = 8;
  const blocks = Array.from({ length: n }, (_, k) => ({ k: k + 1, q: smooth(range(T, GENESIS_T + 0.006 + k * 0.0085, GENESIS_T + 0.011 + k * 0.0085)) }));
  return (
    <g opacity={m * (1 - f.hero)} pointerEvents="none">
      {/* whitepaper */}
      {wpq > 0 && (
        <g transform={`translate(${xw},${BASE_Y - 70}) scale(1,${wpq})`} opacity={wpq}>
          <rect x={-fs(13)} y={-fs(18)} width={fs(26)} height={fs(34)} fill="var(--color-paper-2)" stroke={ORANGE} strokeWidth={fs(1.2)} />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={-fs(8)} x2={fs(i % 2 ? 4 : 8)} y1={-fs(10) + i * fs(5.5)} y2={-fs(10) + i * fs(5.5)} stroke="var(--color-ink)" strokeOpacity={0.5} strokeWidth={fs(1)} />
          ))}
          <text y={-fs(24)} textAnchor="middle" className="mono" style={{ fontSize: fs(10), letterSpacing: "0.12em" }} fill={ORANGE}>
            {t.chart.whitepaper.toUpperCase()}
          </text>
        </g>
      )}
      {/* chain */}
      {blocks.map(({ k, q }) => {
        const x = xg + fs(34) + k * fs(26);
        const px = xg + fs(34) + (k - 1) * fs(26);
        return (
          <g key={k} opacity={q}>
            <line x1={k === 1 ? xg + fs(16) : px + fs(7)} x2={x - fs(7)} y1={cubeY + fs(6)} y2={cubeY + fs(6)} stroke={ORANGE} strokeOpacity={0.7} strokeWidth={fs(1.2)} />
            <Cube x={x} y={cubeY + fs(2)} s={fs(7)} q={q} spread={fs(20)} />
          </g>
        );
      })}
      {blocks[2].q > 0 && (
        <text x={xg + fs(60)} y={cubeY + fs(34)} className="mono" style={{ fontSize: fs(9.5), letterSpacing: "0.1em" }} fill="var(--color-mute)" opacity={blocks[2].q}>
          {t.chart.chain.toUpperCase()}
        </text>
      )}
      {/* block 0 */}
      <Cube x={xg} y={cubeY} s={fs(16)} q={q0} spread={fs(60)} glow />
      {q0 > 0.4 && (
        <g opacity={smooth(range(q0, 0.4, 1))}>
          <text x={xg + fs(26)} y={cubeY - fs(46)} className="serif" style={{ fontSize: fs(17), fontWeight: 600 }} fill="var(--color-ink)">
            {t.chart.block0} · {lang === "vi" ? "3/1/2009" : "3 Jan 2009"}
          </text>
          <text x={xg + fs(26)} y={cubeY - fs(30)} className="mono" style={{ fontSize: fs(9.5) }} fill={ORANGE}>
            000000000019d6689c08…8ce26f
          </text>
        </g>
      )}
    </g>
  );
}
