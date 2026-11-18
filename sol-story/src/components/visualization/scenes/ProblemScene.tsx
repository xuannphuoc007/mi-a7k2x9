"use client";
/**
 * Act 0 · The Problem. Minh wants to pay a friend $2 for coffee. Three roads:
 * Bitcoin crawls, Ethereum charges a toll, Solana's many-lane highway delivers
 * in a blink. Then the scale (≈100M user transactions a day) and four headlines.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Chip, Label, Person } from "../svg";

const IDX = chapterIndex("problem");
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
        .to(v, { lanes: 1, duration: 0.1 }, at(0.2))
        .to(v, { run: 1, duration: 0.46, ease: "none" }, at(0.26))
        .to(v, { sol: 1, duration: 0.08 }, at(0.46))
        .to(v, { solRun: 1, duration: 0.08, ease: "power1.in" }, at(0.53))
        .to(v, { scale: 1, duration: 0.12 }, at(0.7))
        .to(v, { heads: 1, duration: 0.16, ease: "none" }, at(0.76))
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

  const hp = [
    { x: 260, y: 220 },
    { x: 745, y: 205 },
    { x: 255, y: 790 },
    { x: 750, y: 805 },
  ];

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

      {/* scale */}
      {scale > 0.01 && (
        <g opacity={scale * (1 - smooth(clamp(v.heads * 2)) * 0.25)}>
          <text x={500} y={505} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(66), fontWeight: 600 }}>
            ≈ {Math.round(100 * clamp(scale * 1.05))}M
          </text>
          <Label x={500} y={548} anchor="middle" size={fs(11)} color={C.accent}>
            {L.perDay}
          </Label>
        </g>
      )}

      {v.heads > 0.01 &&
        L.headlines.map((h, i) => {
          const q = smooth(clamp(v.heads * 4 - i * 0.75));
          if (q <= 0.01) return null;
          const p = mobile ? { x: 500, y: [170, 255, 760, 845][i] } : hp[i];
          const bad = i < 2;
          const w = Math.min(mobile ? 940 : 420, h.length * fs(11) * 0.64 + 44);
          return (
            <g key={h} opacity={q} transform={`translate(${p.x},${p.y + (1 - q) * 18})`}>
              <rect x={-w / 2} y={-28} width={w} height={56} rx={28} fill="#fff" stroke={bad ? C.warn : C.accent} strokeWidth={2} />
              <Label x={0} y={5} anchor="middle" color={bad ? C.warn : C.accent} size={fs(11)}>
                {h}
              </Label>
            </g>
          );
        })}
    </g>
  );
}
