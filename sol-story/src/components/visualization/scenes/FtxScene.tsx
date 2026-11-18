"use client";
/**
 * Milestone 3 · FTX collapses. A tower labelled FTX · Alameda sits on a pile of
 * SOL; it crumbles and the price tag drops $35 → $13 → $8; a tombstone asks
 * "Solana is dead?" while two NFT collections leave; then a sprout grows —
 * the network kept running.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label, SolCoin } from "../svg";

const IDX = chapterIndex("ftx");
const PILE = Array.from({ length: 14 }, (_, i) => ({ x: 340 + (i % 7) * 52 + (i >= 7 ? 26 : 0), y: i >= 7 ? 800 : 840 }));
const BLOCKS = Array.from({ length: 12 }, (_, i) => ({ c: i % 3, r: Math.floor(i / 3) }));

export default function FtxScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.ftx;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const big = (s: number, cap: number) => Math.min(fs(s), cap);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, tower: 0, sam: 0, fall: 0, price: 0, dead: 0, leave: 0, sprout: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { tower: 1, duration: 0.1 }, at(-0.02))
        .to(v, { sam: 1, duration: 0.12 }, at(0.08))
        .to(v, { fall: 1, duration: 0.14, ease: "power2.in" }, at(0.27))
        .to(v, { price: 1, duration: 0.18, ease: "none" }, at(0.27))
        .to(v, { dead: 1, duration: 0.08 }, at(0.5))
        .to(v, { leave: 1, duration: 0.14, ease: "none" }, at(0.54))
        .to(v, { sprout: 1, duration: 0.14 }, at(0.72))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const tower = smooth(v.tower);
  const sam = smooth(v.sam);
  const fall = v.fall;
  const dead = smooth(v.dead);
  const sprout = smooth(v.sprout);
  const pv = v.price < 0.5 ? lerp(35, 13, smooth(v.price * 2)) : lerp(13, 8, smooth((v.price - 0.5) * 2));
  const priceO = smooth(clamp(v.price * 4)) * (1 - dead);
  const leaf = (s: number, dir: number) => `M0,0 q${dir * 30 * s},${-18 * s} ${dir * 54 * s},${-4 * s} q${-dir * 26 * s},${22 * s} ${-dir * 54 * s},${4 * s} Z`;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {PILE.map((p, i) => (
        <SolCoin key={i} x={p.x} y={p.y} s={0.7} opacity={tower * (1 - dead * 0.6)} />
      ))}

      {/* the tower */}
      <g opacity={tower * (1 - dead)}>
        {BLOCKS.map((b, i) => {
          const f = smooth(fall);
          const fx = (b.c - 1) * (40 + i * 6) * f;
          const fy = (5 - b.r) * 70 * f * 1.6;
          const rot = (b.c - 1 || 0.5) * 40 * fall;
          return (
            <g key={i} transform={`translate(${410 + b.c * 60 + fx},${470 + b.r * 70 + fy}) rotate(${rot} 28 32)`} opacity={1 - fall * 0.7}>
              <rect width={56} height={64} rx={4} fill="#fff" stroke={C.ink} strokeWidth={2} />
              <rect x={16} y={14} width={24} height={14} rx={2} fill="#19b3c9" opacity={0.5} />
            </g>
          );
        })}
        <text x={500} y={448 + fall * 300} textAnchor="middle" fill={C.ink} opacity={1 - fall} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 24), fontWeight: 700, letterSpacing: "0.12em" }}>
          {L.tower}
        </text>
        <g opacity={sam * (1 - smooth(clamp(fall * 3)))}>
          {[0, 1, 2].map((i) => (
            <SolCoin key={i} x={680 + i * 34} y={400 - i * 44 + (1 - sam) * 20} s={0.6} />
          ))}
          <Label x={720} y={300} anchor="middle" size={big(12, 22)} color={C.accent}>
            {L.sam}
          </Label>
        </g>
      </g>

      {/* bankrupt + falling price */}
      {fall > 0.3 && (
        <g opacity={smooth(clamp((fall - 0.3) * 3)) * (1 - dead)} transform="translate(500,330) rotate(-6)">
          <rect x={-260} y={-36} width={520} height={72} rx={8} fill="#fff" stroke={C.warn} strokeWidth={4} />
          <Label x={0} y={8} anchor="middle" size={big(14, 24)} color={C.warn}>
            {L.bankrupt}
          </Label>
        </g>
      )}
      {priceO > 0.01 && (
        <g opacity={priceO} transform={`translate(800,${lerp(470, 640, v.price)})`}>
          <rect x={-80} y={-30} width={160} height={60} rx={30} fill={C.ink} />
          <text y={10} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700 }}>
            ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(pv)}
          </text>
          {v.price > 0.95 && (
            <Label x={0} y={58} anchor="middle" size={big(9.5, 18)} color={C.warn}>
              {L.bottom}
            </Label>
          )}
        </g>
      )}

      {/* "Solana is dead?" */}
      {dead > 0.01 && (
        <g opacity={dead}>
          <g transform={`translate(${lerp(500, 330, sprout)},${lerp(560, 540, dead)})`} opacity={1 - sprout * 0.45}>
            <path d="M-130,180 L-130,-60 Q-130,-170 0,-170 Q130,-170 130,-60 L130,180 Z" fill="#fff" stroke={C.ink} strokeWidth={3} />
            <text y={-70} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 600 }}>
              R.I.P.
            </text>
            <text y={-10} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 22), fontWeight: 700 }}>
              {L.dead}
            </text>
            <text y={36} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 16 }}>
              2020 – 2022 ?
            </text>
          </g>
          {/* two NFT cards leaving */}
          {[0, 1].map((i) => {
            const q = clamp(v.leave * 1.3 - i * 0.25);
            const x = lerp(260, 900, q);
            const y = 250 + i * 90 - Math.sin(q * Math.PI) * 30;
            return (
              <g key={i} opacity={(1 - q) * clamp(q * 5)} transform={`translate(${x},${y}) rotate(${q * 12})`}>
                <rect x={-36} y={-36} width={72} height={72} rx={10} fill={i ? "#14c98a" : "#9945ff"} />
                <circle cx={0} cy={-4} r={14} fill="#fff" opacity={0.85} />
              </g>
            );
          })}
          <Label x={500} y={165} anchor="middle" size={big(10.5, 20)} upper={false} spacing="0.02em" color={C.warn} opacity={smooth(clamp(v.leave * 2)) * (1 - sprout)}>
            {`${L.leaving} · ${L.leaveDate}`}
          </Label>
        </g>
      )}

      {/* the sprout */}
      {sprout > 0.01 && (
        <g transform="translate(680,720) scale(1.6)">
          <ellipse cx={0} cy={6} rx={70} ry={14} fill="#c9b79c" opacity={0.6} />
          <line x1={0} y1={0} x2={0} y2={-120 * sprout} stroke="#14b07c" strokeWidth={6} strokeLinecap="round" />
          <path d={leaf(sprout, 1)} transform={`translate(0,${-80 * sprout})`} fill="#14c98a" />
          <path d={leaf(sprout, -1)} transform={`translate(0,${-110 * sprout})`} fill="#14b07c" />
        </g>
      )}
      {sprout > 0.01 && (
        <Label x={500} y={165} anchor="middle" size={big(11, 21)} upper={false} spacing="0.02em" color="#14b07c" opacity={sprout}>
          {L.stayed}
        </Label>
      )}
    </g>
  );
}
