"use client";
/** Chapter 8 overlay: the 2022 domino chain topples as the playhead passes each collapse. */
import { YB, type Frame } from "@/animations/chartController";
import { clamp, range, smooth } from "@/lib/store";

export const DOMINOES = [
  { name: "TERRA", t: 2022.353 },
  { name: "3AC", t: 2022.445 },
  { name: "CELSIUS", t: 2022.449 },
  { name: "VOYAGER", t: 2022.51 },
  { name: "FTX", t: 2022.862 },
  { name: "BLOCKFI", t: 2022.907 },
];

export function DominoOverlay({ f, m, mobile }: { f: Frame; m: number; mobile: boolean }) {
  const fs = (px: number) => px * f.u;
  const w = mobile ? 34 : 30;
  const h = mobile ? 124 : 108;
  const gap = mobile ? 82 : 74;
  const base = YB - 6;
  const x0 = 96;
  return (
    <g opacity={m * (1 - f.ddMix)} pointerEvents="none">
      <line x1={x0 - 20} x2={x0 + gap * 5 + w + 60} y1={base} y2={base} stroke="var(--color-line)" strokeWidth={2} />
      {DOMINOES.map((d, k) => {
        const fall = clamp(Math.max(smooth(range(f.T, d.t - 0.004, d.t + 0.014)), f.domino - k));
        const x = x0 + k * gap;
        const a = fall * 68;
        const red = fall > 0.45;
        const ar = (a * Math.PI) / 180;
        const tipX = x + w + (-w * Math.cos(ar) + h * Math.sin(ar)) + w / 2;
        const tipY = base + (-w * Math.sin(ar) - h * Math.cos(ar));
        const tx = f.xOf(d.t);
        const ty = f.yOf(d.t);
        return (
          <g key={d.name}>
            {fall > 0.05 && <line x1={tipX} y1={tipY} x2={tx} y2={ty} stroke="var(--color-warn)" strokeOpacity={0.45 * fall} strokeWidth={1.2} strokeDasharray="2 5" />}
            <g transform={`rotate(${a} ${x + w} ${base})`}>
              <rect x={x} y={base - h} width={w} height={h} rx={3} fill={red ? "var(--color-warn)" : "var(--color-paper-2)"} stroke={red ? "var(--color-warn)" : "var(--color-ink)"} strokeWidth={1.4} />
              <circle cx={x + w / 2} cy={base - h + 14} r={3} fill={red ? "var(--color-paper)" : "var(--color-ink)"} />
              <text
                transform={`translate(${x + w / 2 + fs(3.6)},${base - 10}) rotate(-90)`}
                className="mono"
                style={{ fontSize: fs(9.5), letterSpacing: "0.08em", fontWeight: 600 }}
                fill={red ? "var(--color-paper)" : "var(--color-ink)"}
              >
                {d.name}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
