"use client";
/**
 * Milestone 1 · Speed and cost. Anatoly Yakovenko and the 2020 launch; then the
 * two tricks in plain pictures — a shared clock that stamps the order of
 * payments, and many checkout lanes working at once — and finally the fee:
 * a busy Ethereum day versus Solana.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label, Portrait } from "../svg";

const IDX = chapterIndex("speed");
const CORNERS = [
  { x: 200, y: 290 },
  { x: 800, y: 290 },
  { x: 200, y: 680 },
  { x: 800, y: 680 },
];
const LY = [330, 425, 520, 615];
const CARDS = [
  { lane: 0, d: 0 },
  { lane: 0, d: 0.45 },
  { lane: 1, d: 0.1 },
  { lane: 1, d: 0.55 },
  { lane: 2, d: 0.05 },
  { lane: 2, d: 0.5 },
  { lane: 3, d: 0.2 },
  { lane: 3, d: 0.62 },
];

export default function SpeedScene() {
  const { t } = useI18n();
  const L = t.scenes.speed;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const big = (s: number, cap: number) => Math.min(fs(s), cap);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, who: 0, pills: 0, ask: 0, clock: 0, tick: 0, lanes: 0, flow: 0, fee: 0, bars: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { who: 1, duration: 0.08 }, at(-0.02))
        .to(v, { pills: 1, duration: 0.14, ease: "none" }, at(0.06))
        .to(v, { ask: 1, duration: 0.06 }, at(0.25))
        .to(v, { clock: 1, duration: 0.08 }, at(0.33))
        .to(v, { tick: 1, duration: 0.14, ease: "none" }, at(0.34))
        .to(v, { lanes: 1, duration: 0.06 }, at(0.5))
        .to(v, { flow: 1, duration: 0.2, ease: "none" }, at(0.52))
        .to(v, { fee: 1, duration: 0.06 }, at(0.72))
        .to(v, { bars: 1, duration: 0.12 }, at(0.76))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const ask = smooth(v.ask);
  const clock = smooth(v.clock);
  const lanes = smooth(v.lanes);
  const fee = smooth(v.fee);
  const whoO = smooth(v.who) * (1 - ask);
  const askO = ask * (1 - clock);
  const clockO = clock * (1 - lanes);
  const lanesO = lanes * (1 - fee);
  const bars = smooth(v.bars);
  const ang = v.tick * 720 - 90;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* who + when */}
      {whoO > 0.01 && (
        <g opacity={whoO}>
          <Portrait x={290} y={420} r={130} href="/img/anatoly.png" />
          <text x={290} y={600} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(20, 38), fontWeight: 600 }}>
            {L.who}
          </text>
          <Label x={290} y={630 + fs(3)} anchor="middle" size={big(10, 20)} upper={false} spacing="0.02em">
            {L.role}
          </Label>
          <line x1={560} x2={560} y1={330} y2={lerp(330, 520, clamp(v.pills * 1.4))} stroke={C.accent} strokeWidth={2} />
          {[L.idea, L.launch].map((s, i) => {
            const q = smooth(clamp(v.pills * 2.2 - i * 1.1));
            const y = 330 + i * 190;
            return (
              <g key={s} opacity={q} transform={`translate(${(1 - q) * 20},0)`}>
                <circle cx={560} cy={y} r={i ? 14 : 10} fill={i ? C.accent : "#fff"} stroke={C.accent} strokeWidth={3} />
                <text x={594} y={y + 8} fill={i ? C.accent : C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(15, 26), fontWeight: 700 }}>
                  {s}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* computers asking each other */}
      {askO > 0.01 && (
        <g opacity={askO}>
          {CORNERS.map((c, i) => (
            <g key={i}>
              <rect x={c.x - 40} y={c.y - 28} width={80} height={56} rx={8} fill="#fff" stroke={C.ink} strokeWidth={2} />
              <rect x={c.x - 28} y={c.y - 18} width={56} height={34} rx={4} fill={C.lilac} opacity={0.35} />
              {i < 3 && (
                <g>
                  <rect x={c.x - 110} y={c.y + (c.y < 500 ? -100 : 50)} width={220} height={50} rx={25} fill="#fff" stroke={C.line} strokeWidth={2} />
                  <text x={c.x} y={c.y + (c.y < 500 ? -68 : 82)} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(13, 24), fontStyle: "italic" }}>
                    {L.askers[i]}
                  </text>
                </g>
              )}
            </g>
          ))}
          {CORNERS.map((a, i) =>
            CORNERS.slice(i + 1).map((b, j) => <line key={`${i}${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.mute} strokeOpacity={0.35} strokeDasharray="5 7" />),
          )}
        </g>
      )}

      {/* the shared clock */}
      {clockO > 0.01 && (
        <g opacity={clockO}>
          <circle cx={500} cy={440} r={170} fill="#fff" stroke={C.accent} strokeWidth={6} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={500 + Math.cos(a) * 150} y1={440 + Math.sin(a) * 150} x2={500 + Math.cos(a) * 162} y2={440 + Math.sin(a) * 162} stroke={C.accent} strokeWidth={i % 3 ? 2 : 5} />;
          })}
          <line x1={500} y1={440} x2={500 + Math.cos((ang * Math.PI) / 180) * 125} y2={440 + Math.sin((ang * Math.PI) / 180) * 125} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          <circle cx={500} cy={440} r={10} fill={C.ink} />
          {[0, 1, 2].map((i) => {
            const q = smooth(clamp(v.tick * 3.2 - i * 0.9));
            const x = 360 + i * 140;
            return (
              <g key={i} opacity={q} transform={`translate(${x},${lerp(560, 700, q)})`}>
                <rect x={-50} y={-30} width={100} height={60} rx={12} fill={["#9945ff", "#19b3c9", "#14b07c"][i]} />
                <text y={9} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700 }}>
                  #{i + 1}
                </text>
              </g>
            );
          })}
          <text x={500} y={210} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(24, 42), fontWeight: 600 }}>
            {L.clock}
          </text>
          <Label x={500} y={790} anchor="middle" size={big(11, 21)} upper={false} spacing="0.02em" color={C.accent}>
            {L.clockSub}
          </Label>
          <Label x={500} y={830} anchor="middle" size={big(9, 17)} upper={false} spacing="0.02em">
            {L.later}
          </Label>
        </g>
      )}

      {/* many checkouts */}
      {lanesO > 0.01 && (
        <g opacity={lanesO}>
          <text x={500} y={230} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(24, 42), fontWeight: 600 }}>
            {L.lanes}
          </text>
          {LY.map((y, i) => (
            <g key={i}>
              <rect x={150} y={y - 32} width={700} height={64} rx={32} fill="#fff" stroke={C.line} strokeWidth={2} />
              <rect x={812} y={y - 22} width={30} height={44} rx={6} fill={C.accent} opacity={0.8} />
            </g>
          ))}
          {CARDS.map((c, i) => {
            const q = clamp(v.flow * 1.6 - c.d);
            if (q <= 0 || q >= 1) return null;
            return (
              <rect key={i} x={lerp(170, 760, q)} y={LY[c.lane] - 20} width={52} height={40} rx={9} fill={["#9945ff", "#19b3c9", "#14b07c", "#e0662f"][c.lane]} />
            );
          })}
          <Label x={500} y={720} anchor="middle" size={big(11, 21)} upper={false} spacing="0.02em" color={C.accent}>
            {L.lanesSub}
          </Label>
        </g>
      )}

      {/* the fee */}
      {fee > 0.01 && (
        <g opacity={fee}>
          <text x={150} y={260} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(24, 42), fontWeight: 600 }}>
            {L.feeTitle}
          </text>
          {[
            { lab: L.eth, val: L.ethVal, w: 640, col: C.warn },
            { lab: L.sol, val: L.solVal, w: 8, col: "#14b07c" },
          ].map((b, i) => {
            const y = 380 + i * 190;
            const w = Math.max(8, b.w * bars);
            return (
              <g key={b.lab}>
                <text x={150} y={y - 22} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(15, 28), fontWeight: 600 }}>
                  {b.lab}
                </text>
                <rect x={150} y={y} width={w} height={64} rx={14} fill={b.col} opacity={i ? 1 : 0.85} />
                <text x={i ? 150 + w + 18 : 150 + w - 18} y={y + 43} textAnchor={i ? "start" : "end"} fill={i ? b.col : "#fff"} style={{ fontFamily: "var(--font-mono)", fontSize: big(22, 40), fontWeight: 700 }}>
                  {b.val}
                </text>
              </g>
            );
          })}
          <Label x={150} y={760} size={big(12, 22)} color="#14b07c" opacity={bars}>
            {L.time}
          </Label>
        </g>
      )}
    </g>
  );
}
