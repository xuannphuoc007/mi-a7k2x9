"use client";
/**
 * Act 3 · Proof of reserves. FTX's vault leaks and collapses; a Merkle tree
 * folds every balance into one root and Minh checks his leaf; reserves are
 * compared with what customers are owed; what the proof can't see is greyed.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("reserves");
const LEAVES = ["Minh 0.0014", "a 2.10", "b 0.33", "c 5.00", "d 0.07", "e 1.25", "f 0.90", "g 3.40"];

export default function ReservesScene() {
  const { t } = useI18n();
  const L = t.scenes.reserves;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, ftx: 0, run: 0, tree: 0, check: 0, bars: 0, blind: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { ftx: 1, duration: 0.08 }, at(-0.04))
        .to(v, { run: 1, duration: 0.18, ease: "none" }, at(0.06))
        .to(v, { ftx: 0, duration: 0.05 }, at(0.27))
        .to(v, { tree: 1, duration: 0.14, ease: "none" }, at(0.3))
        .to(v, { check: 1, duration: 0.08 }, at(0.44))
        .to(v, { bars: 1, duration: 0.08 }, at(0.52))
        .to(v, { blind: 1, duration: 0.14 }, at(0.62))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const ftx = smooth(v.ftx);
  const run = v.run;
  const tree = v.tree;
  const check = smooth(v.check);
  const bars = smooth(v.bars);
  const blind = smooth(v.blind);

  // tree geometry
  const leafY = 560;
  const lw = 780 / 8;
  const leafX = (i: number) => 110 + lw / 2 + i * lw;
  const level = (n: number, depth: number) => Array.from({ length: n }, (_, i) => ({ x: 110 + (780 / n) * (i + 0.5), y: leafY - depth * 110 }));
  const levels = [level(8, 0), level(4, 1), level(2, 2), level(1, 3)];
  const proofPath = [0, 0, 0, 0];

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* FTX */}
      {ftx > 0.01 && (
        <g opacity={ftx}>
          <g transform="translate(500,470)">
            <rect x={-150} y={-130} width={300} height={260} rx={14} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
            <rect x={-136} y={-116 + 232 * clamp(run * 1.2)} width={272} height={232 * (1 - clamp(run * 1.2))} rx={8} fill={C.sky} opacity={0.3} />
            <text y={10} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 600 }}>
              FTX
            </text>
          </g>
          {/* money leaking sideways */}
          {Array.from({ length: 10 }, (_, i) => {
            const q = clamp(run * 2 - i * 0.08);
            if (q <= 0 || q >= 1) return null;
            return <circle key={i} cx={lerp(650, 900, q)} cy={420 + (i % 4) * 22 - q * 60} r={9} fill={C.sky} opacity={1 - q} />;
          })}
          <Label x={860} y={330} anchor="end" color={C.sky} size={fs(10)} opacity={clamp(run * 3)}>
            {L.used}
          </Label>
          {/* the bank run */}
          {Array.from({ length: 14 }, (_, i) => {
            const q = clamp(run * 1.6 - 0.4 - i * 0.03);
            if (q <= 0) return null;
            return <path key={`r${i}`} d={`M${120 + (i % 7) * 40},${720 + Math.floor(i / 7) * 40} l${lerp(0, 60, q)},${lerp(0, -60, q)}`} stroke={C.ink} strokeWidth={2} markerEnd="" opacity={0.6} />;
          })}
          <Label x={500} y={260} anchor="middle" color={C.warn} size={fs(13)} opacity={clamp((run - 0.7) * 4)}>
            {L.collapsed}
          </Label>
        </g>
      )}

      {/* Merkle tree */}
      {tree > 0.01 && (
        <g opacity={smooth(clamp(tree * 3)) * (1 - blind * 0.65)}>
          <Label x={500} y={140} anchor="middle" color={C.ink} size={fs(11)}>
            {L.treeTitle}
          </Label>
          {levels.slice(1).map((lv, d) =>
            lv.map((n, i) => {
              const q = clamp(tree * 4 - d - 0.6);
              const c1 = levels[d][i * 2];
              const c2 = levels[d][i * 2 + 1];
              const onPath = check > 0 && i === proofPath[d + 1];
              return (
                <g key={`${d}-${i}`} opacity={q}>
                  <line x1={c1.x} y1={c1.y - 18} x2={n.x} y2={n.y + 18} stroke={onPath ? C.yellow : C.line} strokeWidth={onPath ? 4 : 2} />
                  <line x1={c2.x} y1={c2.y - 18} x2={n.x} y2={n.y + 18} stroke={onPath ? C.yellow : C.line} strokeWidth={onPath ? 4 : 2} />
                  <rect x={n.x - 34} y={n.y - 18} width={68} height={36} rx={6} fill={d === 2 ? C.ink : C.paper} stroke={C.ink} strokeWidth={1.4} />
                  <text x={n.x} y={n.y + 5} textAnchor="middle" fill={d === 2 ? C.yellow : C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {d === 2 ? "root" : `#${(i * 7 + d * 3).toString(16)}f${d}`}
                  </text>
                </g>
              );
            }),
          )}
          {LEAVES.map((l, i) => (
            <g key={l} opacity={clamp(tree * 4)}>
              <rect x={leafX(i) - lw / 2 + 4} y={leafY - 20} width={lw - 8} height={40} rx={6} fill={i === 0 && check > 0 ? C.yellow : C.paper} stroke={C.ink} strokeWidth={1.4} />
              <text x={leafX(i)} y={leafY + 5} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: k > 1.5 ? 10 : 11 }}>
                {k > 1.5 && i > 0 ? l.split(" ")[0] : l}
              </text>
            </g>
          ))}
          {check > 0.01 && (
            <Label x={leafX(0)} y={leafY + 50 + fs(4)} anchor="start" color={C.accent} size={fs(10)} opacity={check}>
              {L.check}
            </Label>
          )}
          {/* reserves vs owed */}
          {bars > 0.01 && (
            <g opacity={bars} transform="translate(0,0)">
              <Label x={110} y={690} size={fs(10)} color={C.ink}>
                {L.owed}
              </Label>
              <rect x={330} y={674} width={460 * bars} height={24} rx={4} fill={C.lilac} opacity={0.8} />
              <Label x={110} y={740} size={fs(10)} color={C.ink}>
                {L.held}
              </Label>
              <rect x={330} y={724} width={460 * 1.1 * bars} height={24} rx={4} fill={C.yellow} />
              <text x={330 + 460 * 1.1 * bars + 10} y={742} fill={C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 700 }}>
                ≥100%
              </text>
            </g>
          )}
        </g>
      )}

      {/* blind spots */}
      {blind > 0.01 && (
        <g opacity={blind}>
          <Label x={500} y={790} anchor="middle" color={C.warn} size={fs(11)}>
            {L.cantTitle}
          </Label>
          {L.cant.map((c, i) => {
            const x = 500 + (i - 1) * 300;
            const q = clamp(v.blind * 3 - i * 0.6);
            return (
              <g key={c} opacity={q}>
                <rect x={x - 140} y={815} width={280} height={70} rx={8} fill="#ece9e1" stroke={C.mute} strokeDasharray="5 5" />
                <text x={x} y={857} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 13.5 * Math.min(k, 1.35) }}>
                  {c}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}
