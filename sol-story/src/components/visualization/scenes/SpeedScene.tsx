"use client";
/**
 * Act 3 · Speed. Transactions run side by side on separate cores; only those
 * touching the same account (a hot token mint) queue. Then the base fee splits
 * — half burned, half to the block maker — and block time halves to 200 ms.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Flame, Label } from "../svg";

const IDX = chapterIndex("speed");
const LX0 = 250;
const LX1 = 880;
const LY = [300, 395, 490, 585];
/** lane, account, delay; the hot mint queues in lane 0 */
const TXS: { lane: number; acc: string; d: number; hot?: boolean; coffee?: boolean }[] = [
  { lane: 0, acc: "HOT", d: 0, hot: true },
  { lane: 0, acc: "HOT", d: 0.22, hot: true },
  { lane: 0, acc: "HOT", d: 0.44, hot: true },
  { lane: 0, acc: "HOT", d: 0.66, hot: true },
  { lane: 1, acc: "A", d: 0 },
  { lane: 1, acc: "D", d: 0.3 },
  { lane: 1, acc: "F", d: 0.6 },
  { lane: 2, acc: "☕", d: 0.05, coffee: true },
  { lane: 2, acc: "E", d: 0.4 },
  { lane: 3, acc: "B", d: 0.1 },
  { lane: 3, acc: "C", d: 0.45 },
  { lane: 3, acc: "G", d: 0.75 },
];

export default function SpeedScene() {
  const { t } = useI18n();
  const L = t.scenes.speed;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, lanes: 0, flow: 0, focus: 0, fee: 0, split: 0, slot: 0, half: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { lanes: 1, duration: 0.08 }, at(0.0))
        .to(v, { flow: 1, duration: 0.44, ease: "none" }, at(0.06))
        .to(v, { focus: 1, duration: 0.08 }, at(0.28))
        .to(v, { fee: 1, duration: 0.08 }, at(0.5))
        .to(v, { split: 1, duration: 0.12 }, at(0.56))
        .to(v, { slot: 1, duration: 0.08 }, at(0.72))
        .to(v, { half: 1, duration: 0.12 }, at(0.78))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const fee = smooth(v.fee);
  const lanesO = smooth(v.lanes) * (1 - fee);
  const focus = smooth(v.focus);
  const split = smooth(v.split);
  const slot = smooth(v.slot);
  const feeO = fee * (1 - slot);
  const half = smooth(v.half);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* parallel lanes */}
      {lanesO > 0.01 && (
        <g opacity={lanesO}>
          {LY.map((y, i) => (
            <g key={i}>
              <rect x={LX0} y={y - 30} width={LX1 - LX0} height={60} rx={30} fill={i === 0 ? `rgba(217,48,79,${0.08 * focus})` : "#fff"} stroke={C.line} strokeWidth={2} />
              <Label x={LX0 - 18} y={y + 5} anchor="end" size={fs(9.5)}>
                {L.cores[i]}
              </Label>
            </g>
          ))}
          {TXS.map((tx, i) => {
            // hot ones advance one at a time; others glide freely
            const speed = tx.hot ? 0.75 : 1.6;
            const raw = clamp((v.flow - tx.d * (tx.hot ? 1.1 : 0.5)) * speed);
            const q = raw;
            const x = lerp(LX0 + 40, LX1 - 40, clamp(q));
            const col = tx.hot ? C.warn : tx.coffee ? "#14b07c" : "#9945ff";
            return (
              <g key={i} transform={`translate(${x},${LY[tx.lane]})`} opacity={clamp(q * 8) * (q >= 1 ? 0.35 : 1)}>
                <rect x={-30} y={-19} width={60} height={38} rx={10} fill={col} />
                <text y={5} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700 }}>
                  {tx.acc}
                </text>
              </g>
            );
          })}
          <g opacity={focus}>
            <Label x={LX1} y={LY[0] - 44} anchor="end" size={fs(10)} color={C.warn}>
              {`${L.hot} · ${L.wait}`}
            </Label>
            <Label x={LX1} y={LY[2] - 44} anchor="end" size={fs(10)} color="#14b07c">
              {mobile ? L.coffee : `${L.coffee} · ${L.free}`}
            </Label>
          </g>
        </g>
      )}

      {/* the fee */}
      {feeO > 0.01 && (
        <g opacity={feeO}>
          <Label x={500} y={250} anchor="middle" size={fs(11)} color={C.ink}>
            {L.feeTitle}
          </Label>
          <text x={500} y={330} textAnchor="middle" fill={C.accent} style={{ fontFamily: "var(--font-serif)", fontSize: Math.min(fs(46), 78), fontWeight: 600 }}>
            {L.fee}
          </text>
          <Label x={500} y={368} anchor="middle" size={fs(11)}>
            {L.feeUsd}
          </Label>
          {[0, 1].map((s) => {
            const tx = lerp(500, s ? 700 : 300, split);
            const ty = lerp(420, 560, split);
            return (
              <g key={s}>
                <circle cx={tx} cy={ty} r={30} fill={s ? "#9945ff" : C.warn} opacity={0.9} />
                <text x={tx} y={ty + 5} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700 }}>
                  50%
                </text>
              </g>
            );
          })}
          <g opacity={split}>
            <Flame x={300} y={680} s={1.1} t={v.split * 3} />
            <Label x={300} y={760} anchor="middle" size={fs(10.5)} color={C.warn}>
              {L.burned}
            </Label>
            <g transform="translate(700,680)">
              <rect x={-44} y={-40} width={88} height={70} rx={10} fill="#fff" stroke={C.ink} strokeWidth={2} />
              {[0, 1, 2].map((r) => (
                <rect key={r} x={-32} y={-28 + r * 18} width={64} height={10} rx={3} fill={C.lilac} opacity={0.5} />
              ))}
            </g>
            <Label x={700} y={760} anchor="middle" size={fs(10.5)} color={C.accent}>
              {L.leader}
            </Label>
            <Label x={500} y={840} anchor="middle" size={fs(10)} upper={false} spacing="0.02em">
              {L.priority}
            </Label>
          </g>
        </g>
      )}

      {/* block time halves */}
      {slot > 0.01 && (
        <g opacity={slot}>
          <Label x={140} y={330} size={fs(11)} color={C.ink}>
            {L.slot}
          </Label>
          {[0, 1].map((row) => {
            const n = row ? 10 : 5;
            const y = 420 + row * 170;
            const shown = row ? half : 1;
            return (
              <g key={row} opacity={row ? half : 1}>
                <text x={140} y={y - 16} fill={row ? "#14b07c" : C.mute} style={{ fontFamily: "var(--font-serif)", fontSize: fs(22), fontWeight: 600 }}>
                  {row ? L.ms200 : L.ms400}
                </text>
                {row === 1 && (
                  <Label x={860} y={y - 18} anchor="end" size={fs(9.5)} color="#14b07c">
                    {L.date}
                  </Label>
                )}
                {Array.from({ length: n }, (_, i) => {
                  const w = 720 / n;
                  const q = smooth(clamp(shown * n - i));
                  return <rect key={i} x={140 + i * w + 3} y={y} width={(w - 6) * q} height={60} rx={10} fill={row ? "#14c98a" : "#b9b3cf"} />;
                })}
              </g>
            );
          })}
          <line x1={140} x2={860} y1={760} y2={760} stroke={C.ink} strokeOpacity={0.3} />
          <Label x={140} y={790} size={fs(9.5)}>
            0 s
          </Label>
          <Label x={860} y={790} anchor="end" size={fs(9.5)}>
            2 s
          </Label>
        </g>
      )}
    </g>
  );
}
