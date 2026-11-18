"use client";
/**
 * Act 0 · The Problem. Minh wants to pay a friend $2 for coffee. Three roads:
 * Bitcoin crawls, Ethereum charges a toll, Solana's many-lane highway delivers
 * in a blink. Then the five milestones that made Solana famous.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Chip, Label, Person } from "../svg";

const IDX = chapterIndex("intro");
const X0 = 200;
const X1 = 860;
const LANE_Y = [320, 480, 650];
const LANE_C = ["#f7931a", "#6b7bd6", "#9945ff"];

export default function ProblemScene() {
  const { t } = useI18n();
  const L = t.scenes.problem;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, minh: 0, lanes: 0, run: 0, sol: 0, solRun: 0, scale: 0, heads: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(0.02))
        .to(v, { minh: 1, duration: 0.1 }, at(0.05))
        .to(v, { lanes: 1, duration: 0.1 }, at(0.14))
        .to(v, { run: 1, duration: 0.42, ease: "none" }, at(0.2))
        .to(v, { sol: 1, duration: 0.08 }, at(0.34))
        .to(v, { solRun: 1, duration: 0.08, ease: "power1.in" }, at(0.42))
        .to(v, { scale: 1, duration: 0.1 }, at(0.6))
        .to(v, { heads: 1, duration: 0.2, ease: "none" }, at(0.64))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const minh = smooth(v.minh);
  const lanes = smooth(v.lanes);
  const sol = smooth(v.sol);
  const scale = smooth(v.scale);
  const story = 1 - scale;
  const run = v.run;

  const prog = [smooth(clamp(run)) * 0.16, run * 0.6, smooth(v.solRun)];
  const laneO = [lanes, lanes, sol];


  return (
    <g opacity={v.vis * (1 - ex)}>
      <g opacity={story}>
        {/* Minh and his friend */}
        <Person x={100} y={430} s={0.62} color={C.sky} opacity={minh} />
        <Label x={100} y={500 + fs(6)} anchor="middle" color={C.ink} size={fs(10.5)} opacity={minh}>
          {mobile ? "Minh" : L.minh}
        </Label>
        <Person x={935} y={430} s={0.55} color={C.mint} opacity={lanes} />
        <Label x={935} y={500 + fs(6)} anchor="middle" size={fs(10)} opacity={lanes}>
          {L.friend}
        </Label>
        {lanes < 0.05 && <Chip x={180} y={330} text={`☕ ${L.coffee}`} color={C.ink} k={Math.min(k, 1.6)} opacity={minh} />}

        {LANE_Y.map((y, i) => {
          const o = laneO[i];
          if (o <= 0.01) return null;
          const isSol = i === 2;
          const p = prog[i];
          const cx = lerp(X0 + 20, X1 - 20, p);
          const done = isSol && p > 0.98;
          const h = isSol ? 74 : 40;
          return (
            <g key={i} opacity={o}>
              <text x={X0} y={y - h / 2 - 14} fill={LANE_C[i]} style={{ fontFamily: "var(--font-serif)", fontSize: fs(18), fontWeight: 600 }}>
                {L.lanes[i]}
              </text>
              {!mobile && (
                <Label x={X1} y={y - h / 2 - 16} anchor="end" size={fs(9)} upper={false} spacing="0.02em">
                  {L.laneSub[i]}
                </Label>
              )}
              <rect x={X0} y={y - h / 2} width={X1 - X0} height={h} rx={h / 2} fill="#fff" stroke={C.line} strokeWidth={2} />
              {isSol ? (
                <>
                  {[0, 1, 2].map((r) => (
                    <line key={r} x1={X0 + 24} x2={X1 - 24} y1={y - h / 2 + ((r + 1) * h) / 4} y2={y - h / 2 + ((r + 1) * h) / 4} stroke={C.line} strokeDasharray="10 10" />
                  ))}
                  {Array.from({ length: 28 }, (_, j) => {
                    const q = (j * 0.173 + run * 5) % 1;
                    return <circle key={j} cx={X0 + 24 + q * (X1 - X0 - 48)} cy={y - h / 2 + (((j % 4) + 0.5) * h) / 4} r={4} fill={j % 2 ? "#9945ff" : "#14c98a"} opacity={0.55} />;
                  })}
                </>
              ) : (
                Array.from({ length: i === 0 ? 7 : 4 }, (_, j) => (
                  <rect key={j} x={X1 - 60 - j * 42} y={y - 10} width={30} height={20} rx={5} fill={C.line} />
                ))
              )}
              <Chip x={cx} y={y} text={`☕ ${L.coffee}`} color={LANE_C[i]} k={Math.min(k, 1.5)} />
              {i === 0 && run > 0.15 && (
                <Label x={cx} y={y + h / 2 + 22} anchor="middle" size={fs(9.5)} color={C.mute} opacity={clamp(run * 3 - 0.4)}>
                  {L.waiting}
                </Label>
              )}
              {i === 1 && run > 0.3 && <Chip x={lerp(X0, X1, 0.62)} y={y + h / 2 + 26} text={L.fee} color={C.warn} k={Math.min(k, 1.4)} s={0.9} opacity={clamp(run * 3 - 0.9)} />}
              {done && (
                <Chip x={X1 + 2} y={y + h / 2 + 30} text={L.paid} color={C.mint} k={Math.min(k, 1.5)} opacity={clamp((v.solRun - 0.9) * 10)} />
              )}
            </g>
          );
        })}
      </g>

      {/* the five milestones */}
      {scale > 0.01 && (
        <g opacity={scale}>
          <text x={500} y={215} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: Math.min(fs(26), 44), fontWeight: 600 }}>
            {L.perDay}
          </text>
          {L.headlines.map((h, i) => {
            const q = smooth(clamp(v.heads * 5 - i * 0.8));
            const y = 300 + i * 112;
            const col = ["#9945ff", "#19b3c9", C.warn, "#14b07c", "#e0662f"][i];
            return (
              <g key={h} opacity={q} transform={`translate(${(1 - q) * -30},0)`}>
                <rect x={220} y={y - 40} width={560} height={80} rx={40} fill="#fff" stroke={col} strokeWidth={2.5} />
                <circle cx={262} cy={y} r={28} fill={col} />
                <text x={262} y={y + 9} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700 }}>
                  {i + 1}
                </text>
                <text x={310} y={y + Math.min(fs(15), 28) * 0.36} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: Math.min(fs(15), 28), fontWeight: 600 }}>
                  {h.replace(/^\d · /, "")}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}
