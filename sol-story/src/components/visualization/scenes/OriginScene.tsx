"use client";
/**
 * Act 1 · Origin. Anatoly Yakovenko's path from Qualcomm to the 2017 Proof of
 * History paper; the team renames "Loom" after Solana Beach; early sale prices;
 * then a pie of the first ≈500M SOL while the 3D coin appears above.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label, Portrait } from "../svg";

const IDX = chapterIndex("origin");
const SLICES = [35.4, 12.5, 12.5, 38, 1.6];
const PIE_C = ["#9945ff", "#6b7bd6", "#19b3c9", "#14c98a", "#f7931a"];
const PRICES = [0.04, 0.2, 0.225, 0.22];

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${cx},${cy} L${p(a0)} A${r},${r} 0 ${large} 1 ${p(a1)} Z`;
}

export default function OriginScene() {
  const { t } = useI18n();
  const L = t.scenes.origin;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, face: 0, steps: 0, move: 0, rename: 0, sales: 0, pie: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { face: 1, duration: 0.1 }, at(0.0))
        .to(v, { steps: 1, duration: 0.18, ease: "none" }, at(0.06))
        .to(v, { move: 1, duration: 0.08 }, at(0.26))
        .to(v, { rename: 1, duration: 0.1 }, at(0.3))
        .to(v, { sales: 1, duration: 0.16 }, at(0.48))
        .to(v, { pie: 1, duration: 0.16 }, at(0.68))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const face = smooth(v.face);
  const move = smooth(v.move);
  const rename = smooth(v.rename);
  const sales = smooth(v.sales);
  const pie = smooth(v.pie);
  const top = 1 - sales; // portrait + timeline + rename
  const pr = { x: lerp(500, 165, move), y: lerp(290, 200, move), r: lerp(118, 74, move) };

  const SX = [190, 400, 610, 820];
  const SY = 610;

  let acc = -Math.PI / 2;
  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* portrait + name */}
      <g opacity={face * top}>
        <Portrait x={pr.x} y={pr.y} r={pr.r} href="/img/anatoly.png" />
        <text x={move > 0.5 ? pr.x + pr.r + 18 : pr.x} y={move > 0.5 ? pr.y + 8 : pr.y + pr.r + 40} textAnchor={move > 0.5 ? "start" : "middle"} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(22), fontWeight: 600 }}>
          {L.who}
        </text>
      </g>

      {/* timeline */}
      <g opacity={top}>
        <line x1={SX[0]} x2={lerp(SX[0], SX[3], clamp(v.steps * 1.1))} y1={SY} y2={SY} stroke={C.accent} strokeWidth={2} />
        {L.steps.map((st, i) => {
          const q = smooth(clamp(v.steps * 4 - i * 0.9));
          if (q <= 0.01) return null;
          const last = i === 3;
          return (
            <g key={st.year} opacity={q}>
              <circle cx={SX[i]} cy={SY} r={last ? 11 : 8} fill={last ? C.accent : "#fff"} stroke={C.accent} strokeWidth={2.5} />
              <text x={SX[i]} y={SY - 26} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 700 }}>
                {st.year}
              </text>
              <Label x={SX[i]} y={SY + 38} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em" color={C.mute}>
                {mobile ? st.what.split(" ").slice(0, 2).join(" ") : st.what}
              </Label>
            </g>
          );
        })}
      </g>

      {/* rename card */}
      {rename > 0.01 && (
        <g opacity={rename * top} transform={`translate(500,${lerp(400, 380, rename)})`}>
          <rect x={-250} y={-58} width={500} height={116} rx={20} fill="#fff" stroke={C.line} strokeWidth={2} />
          <text x={0} y={-6} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(26), fontWeight: 600 }}>
            {L.rename}
          </text>
          {[0, 1, 2].map((w) => (
            <path key={w} d={`M${-90 + w * 60},${30} q15,-12 30,0 t30,0`} fill="none" stroke="#19b3c9" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
          ))}
          {!mobile && (
            <Label x={0} y={52} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em">
              {L.beach}
            </Label>
          )}
        </g>
      )}

      {/* early sale prices */}
      {sales > 0.01 && (
        <g opacity={sales * (1 - pie)}>
          <text x={150} y={270} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(24), fontWeight: 600 }}>
            {L.salesTitle}
          </text>
          <line x1={150} x2={870} y1={760} y2={760} stroke={C.ink} strokeOpacity={0.35} />
          {L.sales.map((s, i) => {
            const x = 230 + i * 180;
            const h = (PRICES[i] / 0.225) * 380 * smooth(clamp(sales * 2 - i * 0.25));
            const pub = i === 3;
            return (
              <g key={s.who}>
                <rect x={x - 45} y={760 - h} width={90} height={h} rx={10} fill={pub ? "#f7931a" : "#9945ff"} opacity={pub ? 0.9 : 0.25 + i * 0.2} />
                <text x={x} y={750 - h} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: Math.min(fs(14), 28), fontWeight: 700 }}>
                  {mobile ? s.p.replace(" USD", "") : s.p}
                </text>
                <Label x={x} y={790} anchor="middle" size={fs(9)} upper={false} spacing="0.02em" color={pub ? C.ink : C.mute}>
                  {mobile ? s.who.split(" ").slice(-1)[0] : s.who}
                </Label>
              </g>
            );
          })}
        </g>
      )}

      {/* the first ≈500M SOL */}
      {pie > 0.01 && (
        <g opacity={pie}>
          <Label x={130} y={500} size={fs(11)} color={C.ink}>
            {L.pieTitle}
          </Label>
          {SLICES.map((p, i) => {
            const a0 = acc;
            const span = (p / 100) * Math.PI * 2 * pie;
            acc += span;
            return <path key={i} d={arc(310, 690, i === 4 ? 160 : 150, a0, a0 + span)} fill={PIE_C[i]} stroke="#fff" strokeWidth={2} />;
          })}
          {L.pie.map((lab, i) => (
            <g key={lab} opacity={smooth(clamp(pie * 3 - i * 0.35))}>
              <rect x={540} y={566 + i * 52 - 12} width={22} height={22} rx={6} fill={PIE_C[i]} />
              <text x={576} y={566 + i * 52 + 5} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fs(15), fontWeight: i === 4 ? 700 : 500 }}>
                {lab}
              </text>
            </g>
          ))}
          {!mobile && (
            <Label x={540} y={846} size={fs(8.5)} upper={false} spacing="0.02em">
              {L.pieNote}
            </Label>
          )}
        </g>
      )}
    </g>
  );
}
