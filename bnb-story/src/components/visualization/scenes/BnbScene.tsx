"use client";
/**
 * Act 3 · BNB, the exchange's own coin. Its three jobs orbit the coin; a
 * supply bar burns down from 200M towards the 100M target (37 quarterly
 * burns, endpoints from BNB Chain); then one company sits in the middle of it all.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useClock } from "@/hooks/useTween";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { BnbGlyph, C, Flame, Label } from "../svg";

const IDX = chapterIndex("bnb");
const START = 200;
const NOW = 131.51; // after the 37th burn, 19 Oct 2026
const TARGET = 100;
const BURNS = 37;

export default function BnbScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.bnb;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, uses: 0, spin: 0, burn: 0, middle: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { uses: 1, duration: 0.14 }, at(-0.04))
        .to(v, { spin: 1, duration: 0.3, ease: "none" }, at(0))
        .to(v, { uses: 0, duration: 0.05 }, at(0.28))
        .to(v, { burn: 1, duration: 0.24, ease: "none" }, at(0.31))
        .to(v, { middle: 1, duration: 0.12 }, at(0.6))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  const clock = useClock(v.vis > 0.01 && v.burn > 0.01 && v.middle < 0.5);
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const nf = (n: number, d = 1) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const uses = smooth(v.uses);
  const middle = smooth(v.middle);
  const burnShown = 1 - middle;

  // burns: 37 equal-time steps, eased so early burns are larger in count terms
  const b = v.burn;
  const nBurn = Math.floor(b * BURNS);
  const supply = lerp(START, NOW, Math.pow(nBurn / BURNS, 0.85));
  const BX0 = 140;
  const BX1 = 860;
  const sx = (m: number) => BX0 + (m / START) * (BX1 - BX0);

  const news = L.news;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* the three jobs */}
      {uses > 0.01 && (
        <g opacity={uses}>
          <BnbGlyph x={500} y={470} s={2.6} />
          <circle cx={500} cy={470} r={230} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="4 8" />
          {L.uses.map((u, i) => {
            const a = v.spin * Math.PI * 0.6 + (i / 3) * Math.PI * 2 - Math.PI / 2;
            const x = 500 + Math.cos(a) * 230;
            const y = 470 + Math.sin(a) * 230;
            const q = clamp(v.uses * 3 - i * 0.5);
            return (
              <g key={u.name} opacity={q} transform={`translate(${x},${y})`}>
                <circle r={46} fill={C.paper} stroke={C.ink} strokeWidth={2} />
                <text y={10} textAnchor="middle" style={{ fontSize: 28 }}>
                  {u.icon}
                </text>
                <Label x={0} y={70 + fs(4)} anchor="middle" color={C.ink} size={fs(10.5)}>
                  {u.name}
                </Label>
              </g>
            );
          })}
        </g>
      )}

      {/* the burn */}
      {b > 0.001 && (
        <g opacity={smooth(clamp(b * 6)) * burnShown}>
          <Label x={BX0} y={250} size={fs(11)} color={C.ink}>
            {L.supplyTitle}
          </Label>
          <rect x={BX0} y={300} width={BX1 - BX0} height={90} rx={8} fill={C.line} />
          <rect x={BX0} y={300} width={sx(supply) - BX0} height={90} rx={8} fill={C.yellow} />
          <line x1={sx(TARGET)} x2={sx(TARGET)} y1={280} y2={410} stroke={C.ink} strokeWidth={2.5} strokeDasharray="6 5" />
          <Label x={sx(TARGET)} y={k >= 1.5 ? 268 : 430 + fs(4)} anchor="middle" color={C.ink} size={fs(10)}>
            {L.target}
          </Label>
          <Flame x={sx(supply) + 18} y={330} s={0.9} t={clock} opacity={nBurn < BURNS ? 1 : 0.6} />
          <text x={BX0} y={500} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(34), fontWeight: 700 }}>
            {nf(supply)}M
          </text>
          <Label x={BX0} y={500 + fs(24)} size={fs(10)}>
            {L.left}
          </Label>
          <text x={BX1} y={500} textAnchor="end" fill={C.peach} style={{ fontFamily: "var(--font-mono)", fontSize: fs(34), fontWeight: 700 }}>
            {nBurn}
          </text>
          <Label x={BX1} y={500 + fs(24)} anchor="end" size={fs(10)} color={C.peach}>
            {L.burns}
          </Label>
          <Label x={500} y={650} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em" opacity={k >= 1.5 ? 0 : 1}>
            {L.burnNote}
          </Label>
        </g>
      )}

      {/* one company in the middle */}
      {middle > 0.01 && (
        <g opacity={middle}>
          <circle cx={500} cy={430} r={86} fill={C.ink} />
          <text x={500} y={438} textAnchor="middle" fill={C.yellow} style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, letterSpacing: "0.12em" }}>
            BINANCE
          </text>
          {L.ties.map((tie, i) => {
            const a = (i / L.ties.length) * Math.PI * 2 - Math.PI / 2;
            const x = 500 + Math.cos(a) * 260;
            const y = 430 + Math.sin(a) * 210;
            const q = clamp(v.middle * 4 - i * 0.4);
            return (
              <g key={tie} opacity={q}>
                <line x1={500 + Math.cos(a) * 92} y1={430 + Math.sin(a) * 92} x2={x - Math.cos(a) * 40} y2={y - Math.sin(a) * 40} stroke={C.ink} strokeWidth={2} />
                <BnbGlyph x={x} y={y} s={0.9} />
                <Label x={x} y={y + (Math.sin(a) > 0.3 ? 58 : -44) + fs(4)} anchor="middle" color={C.ink} size={fs(10)}>
                  {tie}
                </Label>
              </g>
            );
          })}
          {news.map((n, i) => (
            <g key={n.text} opacity={clamp(v.middle * 3 - 1 - i * 0.5)} transform={`translate(${i === 0 ? 260 : 740},800)`}>
              <rect x={-200} y={-34} width={400} height={68} rx={6} fill={C.paper} stroke={i === 0 ? C.mint : C.warn} strokeWidth={2} />
              <text x={-180} y={8} fill={i === 0 ? C.mint : C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700 }}>
                {i === 0 ? "▲" : "▼"}
              </text>
              <text x={-148} y={7} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 14.5 * Math.min(k, 1.4) }}>
                {n.text}
              </text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
}
