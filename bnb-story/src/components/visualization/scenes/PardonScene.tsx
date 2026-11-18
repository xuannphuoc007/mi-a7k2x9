"use client";
/**
 * Act 4 · Politics and a pardon. Three dated 2025 events line up on a
 * timeline; then supporters' and critics' readings side by side; then the
 * share of the USD1 stablecoin reportedly held at Binance (Feb 2026).
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("pardon");

function pie(cx: number, cy: number, r: number, f: number) {
  const a0 = -Math.PI / 2;
  const a1 = a0 + f * Math.PI * 2;
  const p = (a: number) => `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  return `M${cx},${cy} L${p(a0)} A${r},${r} 0 ${f > 0.5 ? 1 : 0} 1 ${p(a1)} Z`;
}

export default function PardonScene() {
  const { t } = useI18n();
  const L = t.scenes.pardon;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, line: 0, sides: 0, usd1: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { line: 1, duration: 0.24, ease: "none" }, at(-0.02))
        .to(v, { sides: 1, duration: 0.2, ease: "none" }, at(0.3))
        .to(v, { usd1: 1, duration: 0.14 }, at(0.62))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const line = v.line;
  const sides = smooth(clamp(v.sides * 2));
  const usd1 = smooth(v.usd1);
  const top = lerp(1, 0.35, sides);
  const evs = L.events;
  const X0 = 140;
  const X1 = 860;
  const Y = lerp(470, 190, sides);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* 2025 timeline */}
      <g opacity={smooth(clamp(line * 5))}>
        <text x={500} y={lerp(260, 120, sides)} textAnchor="middle" fill={C.ink} opacity={0.08} style={{ fontFamily: "var(--font-serif)", fontSize: lerp(200, 110, sides), fontWeight: 600 }}>
          2025
        </text>
        <line x1={X0} x2={X0 + (X1 - X0) * clamp(line * 1.2)} y1={Y} y2={Y} stroke={C.ink} strokeWidth={2.5} />
        {evs.map((e, i) => {
          const x = X0 + e.pos * (X1 - X0);
          const q = smooth(clamp(line * 1.2 - e.pos + 0.05) * 6);
          if (q <= 0.01) return null;
          const below = i % 2 === 1;
          return (
            <g key={e.date} opacity={q}>
              <circle cx={x} cy={Y} r={12} fill={i === 2 ? C.yellow : C.paper} stroke={C.ink} strokeWidth={2} />
              <g opacity={top}>
                <text x={x} y={below ? Y + 48 : Y - 70} textAnchor="middle" fill={C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: fs(11), fontWeight: 700 }}>
                  {e.date}
                </text>
                <text x={x} y={below ? Y + 72 : Y - 44} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 15 * Math.min(k, 1.3), fontWeight: 600 }}>
                  {e.what}
                </text>
                {k < 1.5 && (
                  <text x={x} y={below ? Y + 94 : Y - 22} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}>
                    {e.sub}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </g>

      {/* two readings */}
      {sides > 0.01 && (
        <g opacity={sides * (1 - usd1 * 0.75)}>
          {[L.pro, L.con].map((side, si) => {
            const x = si === 0 ? 270 : 730;
            const col = si === 0 ? C.mint : C.warn;
            return (
              <g key={si}>
                <rect x={x - 220} y={280} width={440} height={380} rx={10} fill={C.paper} stroke={col} strokeWidth={2} />
                <Label x={x} y={320} anchor="middle" color={col} size={fs(11)}>
                  {side.title}
                </Label>
                {side.points.map((p, i) => {
                  const q = clamp(v.sides * 4 - 1 - i * 0.5 - si * 0.25);
                  return (
                    <g key={p} opacity={q}>
                      <circle cx={x - 190} cy={378 + i * 90} r={5} fill={col} />
                      {p.split("\n").map((ln, j) => (
                        <text key={j} x={x - 175} y={384 + i * 90 + j * 22} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 15 * Math.min(k, 1.25) }}>
                          {ln}
                        </text>
                      ))}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      )}

      {/* USD1 custody */}
      {usd1 > 0.01 && (
        <g opacity={usd1}>
          <rect x={200} y={690} width={600} height={220} rx={12} fill={C.paper} stroke={C.ink} strokeWidth={1.6} />
          <circle cx={320} cy={800} r={80} fill={C.line} />
          <path d={pie(320, 800, 80, 0.89 * clamp(v.usd1 * 1.3))} fill={C.yellow} />
          <text x={440} y={790} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(30), fontWeight: 700 }}>
            ≈89%
          </text>
          <text x={440} y={826} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 14 * Math.min(k, 1.3) }}>
            {L.usd1}
          </text>
          <text x={440} y={850} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 11 * Math.min(k, 1.3) }}>
            {L.usd1Src}
          </text>
        </g>
      )}
    </g>
  );
}
