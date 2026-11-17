"use client";
/**
 * Act 5 · Bitcoin vs Ethereum. Two columns build up row by row as the reader
 * scrolls — job, supply, block time, security — then size and the last year.
 */
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, EthGlyph, Label } from "../svg";

const IDX = chapterIndex("versus");
const BTC = "#f7931a";
const BX = 280;
const EX = 720;

/** Fortune, 13 Nov 2026 (8:30 a.m. ET) — prices and one-year change */
export const VS = {
  btcPrice: 69134.72,
  ethPrice: 1953.96,
  btcSupply: 20.1e6, // ≈ mined by Oct–Nov 2026 (20M on 9 Mar 2026, ~450 BTC/day)
  ethSupply: 121.7e6, // Coin Metrics, May 2026
  btcYear: -30.65,
  ethYear: -39.53,
};

function BtcCoin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle r={34} fill={BTC} />
      <text x={0} y={13} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-sans)", fontSize: 38, fontWeight: 700 }}>
        ₿
      </text>
    </g>
  );
}

export default function VersusScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.versus;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, head: 0, rows: 0, spin: 0, size: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { head: 1, duration: 0.08 }, at(-0.04))
        .to(v, { rows: 4, duration: 0.5, ease: "none" }, at(0.06))
        .to(v, { spin: 1, duration: 0.8, ease: "none" }, at(0.1))
        .to(v, { size: 1, duration: 0.16 }, at(0.6))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const head = smooth(v.head);
  const size = smooth(v.size);
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const rowY = (i: number) => lerp(300, 260, size) + i * lerp(130, 100, size);
  const rowO = (i: number) => smooth(clamp(v.rows - i)) * (1 - size * 0.25);
  const btcCap = VS.btcPrice * VS.btcSupply;
  const ethCap = VS.ethPrice * VS.ethSupply;
  const capW = 330;

  // block-time dials: ETH makes ~50 blocks while Bitcoin makes one
  const ethTurns = v.spin * 50;
  const btcTurns = v.spin * 1;
  const dial = (x: number, y: number, turns: number, col: string) => {
    const a = (turns % 1) * Math.PI * 2 - Math.PI / 2;
    return (
      <g transform={`translate(${x},${y})`}>
        <circle r={24} fill="none" stroke={C.line} strokeWidth={4} />
        <path d={`M0,-24 A24,24 0 ${turns % 1 > 0.5 ? 1 : 0} 1 ${Math.cos(a) * 24},${Math.sin(a) * 24}`} fill="none" stroke={col} strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  };

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* headers */}
      <g opacity={head}>
        <BtcCoin x={BX} y={140} s={lerp(0.8, 1, head)} />
        <EthGlyph x={EX} y={140} s={lerp(0.8, 1, head)} />
        <Label x={BX} y={205} anchor="middle" color={C.ink} size={fs(12)}>
          Bitcoin · 2009
        </Label>
        <Label x={EX} y={205} anchor="middle" color={C.ink} size={fs(12)}>
          Ethereum · 2015
        </Label>
        <text x={500} y={152} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-serif)", fontSize: 40 }}>
          vs
        </text>
        <line x1={500} x2={500} y1={240} y2={880} stroke={C.line} strokeDasharray="3 6" />
      </g>

      {/* rows */}
      {L.rows.map((r, i) => {
        const o = rowO(i);
        if (o <= 0.01) return null;
        const y = rowY(i);
        return (
          <g key={r.label} opacity={o}>
            <Label x={500} y={y - 34} anchor="middle" size={fs(8.5)}>
              {r.label}
            </Label>
            {/* visual per row */}
            {i === 1 && (
              <g>
                <rect x={BX - 110} y={y - 8} width={220} height={14} rx={7} fill={C.line} />
                <rect x={BX - 110} y={y - 8} width={220 * (VS.btcSupply / 21e6) * clamp(v.rows - i)} height={14} rx={7} fill={BTC} />
                <line x1={BX + 110} x2={BX + 110} y1={y - 16} y2={y + 14} stroke={C.ink} strokeWidth={2} />
                <rect x={EX - 110} y={y - 8} width={200} height={14} rx={7} fill={C.accent} />
                <path d={`M${EX + 92},${y - 12} L${EX + 114},${y - 1} L${EX + 92},${y + 10}Z`} fill={C.accent} />
              </g>
            )}
            {i === 2 && (
              <g>
                {dial(BX - 130, y, btcTurns, BTC)}
                {dial(EX - 130, y, ethTurns, C.accent)}
              </g>
            )}
            <text x={i === 2 ? BX - 92 : BX} y={i === 1 ? y + 40 : y + 6} textAnchor={i === 2 ? "start" : "middle"} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 15 * Math.min(k, 1.5), fontWeight: 500 }}>
              {r.btc}
            </text>
            <text x={i === 2 ? EX - 92 : EX} y={i === 1 ? y + 40 : y + 6} textAnchor={i === 2 ? "start" : "middle"} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 15 * Math.min(k, 1.5), fontWeight: 500 }}>
              {r.eth}
            </text>
          </g>
        );
      })}

      {/* size and the last year */}
      {size > 0.01 && (
        <g opacity={size}>
          <Label x={500} y={712} anchor="middle" size={fs(8.5)}>
            {L.cap}
          </Label>
          <rect x={500 - 10 - capW * size} y={730} width={capW * size} height={26} rx={4} fill={BTC} />
          <rect x={510} y={730} width={capW * (ethCap / btcCap) * size} height={26} rx={4} fill={C.accent} />
          <text x={500 - 18} y={790} textAnchor="end" fill={BTC} style={{ fontFamily: "var(--font-mono)", fontSize: fs(13), fontWeight: 600 }}>
            ≈ ${nf(btcCap / 1e12, 2)}T
          </text>
          <text x={518} y={790} fill={C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: fs(13), fontWeight: 600 }}>
            ≈ ${nf(ethCap / 1e9, 0)}B
          </text>
          <Label x={500} y={840} anchor="middle" size={fs(8.5)}>
            {L.year}
          </Label>
          <text x={500 - 18} y={880} textAnchor="end" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(16), fontWeight: 600 }}>
            {nf(VS.btcYear, 0)}%
          </text>
          <text x={518} y={880} fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(16), fontWeight: 600 }}>
            {nf(VS.ethYear, 0)}%
          </text>
        </g>
      )}
    </g>
  );
}
