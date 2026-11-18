"use client";
/**
 * Act 4 · The FTX winter. A tower labelled FTX · Alameda sits on a pile of SOL;
 * the Wormhole bridge loses 120k ETH and Jump refills it; the tower crumbles
 * and the price tag drops $35 → $13 → $8; finally the estate's auction at $64.
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
  const v = useSceneTimeline(
    IDX,
    { vis: 0, tower: 0, sam: 0, bridge: 0, drain: 0, refill: 0, fall: 0, price: 0, sale: 0, sold: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { tower: 1, duration: 0.1 }, at(-0.02))
        .to(v, { sam: 1, duration: 0.12 }, at(0.08))
        .to(v, { bridge: 1, duration: 0.08 }, at(0.26))
        .to(v, { drain: 1, duration: 0.08 }, at(0.33))
        .to(v, { refill: 1, duration: 0.08 }, at(0.42))
        .to(v, { fall: 1, duration: 0.14, ease: "power2.in" }, at(0.52))
        .to(v, { price: 1, duration: 0.16, ease: "none" }, at(0.52))
        .to(v, { sale: 1, duration: 0.1 }, at(0.72))
        .to(v, { sold: 1, duration: 0.06 }, at(0.82))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const tower = smooth(v.tower);
  const sam = smooth(v.sam);
  const bridge = smooth(v.bridge) * (1 - smooth(clamp(v.fall * 3)));
  const drain = smooth(v.drain);
  const refill = smooth(v.refill);
  const fall = v.fall;
  const sale = smooth(v.sale);
  const sold = smooth(v.sold);
  const tx = lerp(500, 290, smooth(v.bridge)) ;
  const towerX = fall > 0 ? lerp(tx, 500, smooth(clamp(fall * 3))) : tx;

  // $35 → $13 → $8
  const pv = v.price < 0.5 ? lerp(35, 13, smooth(v.price * 2)) : lerp(13, 8, smooth((v.price - 0.5) * 2));
  const priceO = smooth(clamp(v.price * 4)) * (1 - sale);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* the SOL pile */}
      {PILE.map((p, i) => (
        <SolCoin key={i} x={p.x} y={p.y} s={0.7} opacity={tower * (1 - sold * 0.5)} />
      ))}

      {/* the tower */}
      <g opacity={tower * (1 - sale)}>
        {BLOCKS.map((b, i) => {
          const fx = (b.c - 1) * (40 + i * 6) * smooth(fall);
          const fy = (5 - b.r) * 70 * smooth(fall) * 1.6;
          const rot = (b.c - 1 || 0.5) * 40 * fall;
          const x = towerX - 90 + b.c * 60;
          const y = 470 + b.r * 70;
          return (
            <g key={i} transform={`translate(${x + fx},${y + fy}) rotate(${rot} 28 32)`} opacity={1 - fall * 0.7}>
              <rect width={56} height={64} rx={4} fill="#fff" stroke={C.ink} strokeWidth={2} />
              <rect x={16} y={14} width={24} height={14} rx={2} fill="#19b3c9" opacity={0.5} />
            </g>
          );
        })}
        <text x={towerX} y={448 + fall * 300} textAnchor="middle" fill={C.ink} opacity={1 - fall} style={{ fontFamily: "var(--font-mono)", fontSize: fs(13), fontWeight: 700, letterSpacing: "0.12em" }}>
          {L.tower}
        </text>
        {/* "Sam coins" */}
        <g opacity={sam * (1 - smooth(v.bridge))}>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${towerX + 150 + i * 30},${380 - i * 40 + (1 - sam) * 20})`}>
              <SolCoin x={0} y={0} s={0.55} />
            </g>
          ))}
          <Label x={towerX + 190} y={290} anchor="middle" size={fs(12)} color={C.accent}>
            {L.sam}
          </Label>
        </g>
      </g>

      {/* Wormhole bridge */}
      {bridge > 0.01 && (
        <g opacity={bridge}>
          <path d="M540,420 Q720,290 900,420" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          <circle cx={720} cy={355} r={lerp(4, 30, drain)} fill="#fff" stroke={C.warn} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => {
            const q = clamp(drain * 1.4 - i * 0.15);
            return (
              <g key={i} transform={`translate(${720 + (i - 1.5) * 16},${355 + q * 180})`} opacity={(1 - q) * (1 - refill)}>
                <circle r={13} fill="#6b7bd6" />
                <text y={5} textAnchor="middle" fill="#fff" style={{ fontSize: 13, fontWeight: 700 }}>
                  Ξ
                </text>
              </g>
            );
          })}
          <Label x={720} y={240} anchor="middle" size={fs(11)} color={C.ink}>
            {L.hack}
          </Label>
          <Label x={720} y={262} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em" color={refill > 0.5 ? "#14b07c" : C.warn}>
            {L.hackSub}
          </Label>
          {refill > 0.01 && <circle cx={720} cy={355} r={30 * (1 - refill) + 4} fill="#14c98a" opacity={refill} />}
        </g>
      )}

      {/* bankrupt stamp + falling price */}
      {fall > 0.3 && (
        <g opacity={smooth(clamp((fall - 0.3) * 3)) * (1 - sale)} transform="translate(500,330) rotate(-6)">
          <rect x={-250} y={-36} width={500} height={72} rx={8} fill="#fff" stroke={C.warn} strokeWidth={4} />
          <Label x={0} y={8} anchor="middle" size={fs(14)} color={C.warn}>
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
            <Label x={0} y={58} anchor="middle" size={fs(9.5)} color={C.warn}>
              {L.bottom}
            </Label>
          )}
        </g>
      )}

      {/* estate sale */}
      {sale > 0.01 && (
        <g opacity={sale}>
          <Label x={500} y={240} anchor="middle" size={fs(11)} color={C.ink}>
            {L.saleTitle}
          </Label>
          <g transform={`translate(500,${lerp(420, 400, sale)})`}>
            <rect x={-260} y={-110} width={520} height={220} rx={22} fill="#fff" stroke={C.line} strokeWidth={2} />
            <text y={-10} textAnchor="middle" fill={C.accent} style={{ fontFamily: "var(--font-serif)", fontSize: fs(64), fontWeight: 600 }}>
              $64
            </text>
            <text y={36} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fs(16), fontWeight: 600 }}>
              {L.saleA}
            </text>
            <text y={70} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: fs(14) }}>
              {L.saleB}
            </text>
          </g>
          {/* gavel */}
          <g transform={`translate(800,${lerp(560, 590, sold)}) rotate(${lerp(-35, 0, sold)})`}>
            <rect x={-48} y={-22} width={96} height={44} rx={10} fill="#7a4b2a" />
            <rect x={-6} y={18} width={12} height={90} rx={5} fill="#a0693f" />
          </g>
          <g opacity={sold} transform="translate(250,600) rotate(-10)">
            <rect x={-90} y={-30} width={180} height={60} rx={8} fill="none" stroke="#14b07c" strokeWidth={4} />
            <Label x={0} y={8} anchor="middle" size={fs(16)} color="#14b07c">
              {L.sold}
            </Label>
          </g>
        </g>
      )}
    </g>
  );
}
