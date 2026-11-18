"use client";
/**
 * Act 3 · The marketplace. An order book builds up, trades print as bids and
 * asks meet, fees drip into the exchange; then where the coins actually go:
 * mostly cold storage, some in an online hot wallet, and a row in a database.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("exchange");
const MID = 69000;
const ROWS = 7;

export default function ExchangeScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.exchange;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, book: 0, match: 0, fees: 0, custody: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { book: 1, duration: 0.18, ease: "none" }, at(-0.02))
        .to(v, { match: 1, duration: 0.5, ease: "none" }, at(0.12))
        .to(v, { fees: 1, duration: 0.08 }, at(0.3))
        .to(v, { custody: 1, duration: 0.1 }, at(0.58))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const custody = smooth(v.custody);
  const book = 1 - custody;

  const trades = Math.floor(v.match * 18);
  const flash = (v.match * 18) % 1;
  const drift = Math.sin(trades * 1.7) * 6;
  const rowH = 46 * Math.min(k, 1.4);
  const y0 = 230;
  const feeUsd = trades * 6.9; // 0.1% of a $6,900 trade, illustrative

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* order book */}
      <g opacity={book}>
        <Label x={250} y={y0 - 40} anchor="middle" color={C.mint} size={fs(11)}>
          {L.buyers}
        </Label>
        <Label x={750} y={y0 - 40} anchor="middle" color={C.warn} size={fs(11)}>
          {L.sellers}
        </Label>
        {Array.from({ length: ROWS }, (_, i) => {
          const q = clamp(v.book * ROWS * 1.2 - i);
          const wB = 60 + ((i * 37 + trades * 13) % 140);
          const wA = 60 + ((i * 53 + trades * 7) % 140);
          const hot = i === 0 && flash < 0.35 && v.match > 0;
          const y = y0 + i * rowH;
          return (
            <g key={i} opacity={q}>
              <rect x={430 - wB} y={y - rowH * 0.36} width={wB} height={rowH * 0.7} fill={C.mint} opacity={hot ? 0.9 : 0.22} />
              <text x={170} y={y + 5} fill={C.mint} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 600 }}>
                {nf(MID - 5 - i * 5 + drift)}
              </text>
              <rect x={570} y={y - rowH * 0.36} width={wA} height={rowH * 0.7} fill={C.warn} opacity={hot ? 0.9 : 0.18} />
              <text x={830} y={y + 5} textAnchor="end" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 600 }}>
                {nf(MID + 5 + i * 5 + drift)}
              </text>
            </g>
          );
        })}
        {/* matching engine */}
        <g transform={`translate(500,${y0 + rowH * 1.5})`} opacity={clamp(v.book * 2)}>
          <circle r={46} fill={C.yellow} />
          <circle r={56} fill="none" stroke={C.yellow} strokeWidth={2} opacity={v.match > 0 ? 1 - flash : 0} transform={`scale(${1 + flash * 0.6})`} />
          <text y={6} textAnchor="middle" fill="#1e2026" style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700 }}>
            {L.match}
          </text>
        </g>
        {/* trade tape */}
        {v.match > 0 && (
          <g>
            <Label x={500} y={y0 + ROWS * rowH + 30} anchor="middle" size={fs(10)} color={C.ink}>
              {L.trades}: {trades}
            </Label>
            {Array.from({ length: Math.min(5, trades) }, (_, j) => {
              const n = trades - j;
              return (
                <text key={n} x={500} y={y0 + ROWS * rowH + 30 + (j + 1) * fs(20)} textAnchor="middle" fill={j === 0 ? C.ink : C.mute} opacity={1 - j * 0.18} style={{ fontFamily: "var(--font-mono)", fontSize: fs(11) }}>
                  {`0.1 BTC @ ${nf(MID + Math.sin(n * 1.7) * 6)}`}
                </text>
              );
            })}
          </g>
        )}
        {/* fee jar */}
        <g opacity={smooth(v.fees)} transform="translate(860,760)">
          <rect x={-60} y={-70} width={120} height={120} rx={12} fill={C.paper} stroke={C.ink} strokeWidth={2} />
          <rect x={-56} y={50 - clamp(trades / 18) * 110} width={112} height={Math.max(0, clamp(trades / 18) * 110 - 4)} rx={8} fill={C.yellow} opacity={0.8} />
          <Label x={0} y={-84} anchor="middle" size={fs(9)} color={C.accent}>
            {L.fees}
          </Label>
          <text x={0} y={80 + fs(10)} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 600 }}>
            ${nf(feeUsd, 1)}
          </text>
        </g>
      </g>

      {/* where the coins go */}
      {custody > 0.01 && (
        <g opacity={custody}>
          <Label x={500} y={160} anchor="middle" color={C.ink} size={fs(12)}>
            {L.where}
          </Label>
          <g transform="translate(300,420)">
            <rect x={-150} y={-110} width={300} height={220} rx={14} fill="#eaf3fb" stroke={C.sky} strokeWidth={2} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={i} d={`M0,0 L${Math.cos((i * Math.PI) / 3) * 40},${Math.sin((i * Math.PI) / 3) * 40}`} stroke={C.sky} strokeWidth={4} strokeLinecap="round" />
            ))}
            <Label x={0} y={80} anchor="middle" color={C.sky} size={fs(11)}>
              {L.cold}
            </Label>
            <Label x={0} y={-80} anchor="middle" color={C.ink} size={fs(9)}>
              {L.coldSub}
            </Label>
          </g>
          <g transform="translate(720,440)">
            <rect x={-100} y={-80} width={200} height={160} rx={14} fill="#fff4ec" stroke={C.peach} strokeWidth={2} />
            <path d="M-30,30 Q-30,-10 0,-40 Q30,-10 30,30 Z" fill={C.peach} opacity={0.75} />
            <Label x={0} y={60} anchor="middle" color={C.peach} size={fs(11)}>
              {L.hot}
            </Label>
            <Label x={0} y={-56} anchor="middle" color={C.ink} size={fs(9)}>
              {L.hotSub}
            </Label>
          </g>
          {/* database row */}
          <g transform={`translate(500,${lerp(740, 720, custody)})`}>
            <rect x={-300} y={-40} width={600} height={80} rx={6} fill={C.paper} stroke={C.ink} strokeWidth={1.6} />
            <text x={-280} y={8} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(13) }}>
              {"user: minh · BTC: 0.0014"}
            </text>
            <Label x={0} y={70 + fs(4)} anchor="middle" color={C.accent} size={fs(10.5)}>
              {L.row}
            </Label>
          </g>
          <Label x={500} y={880 + fs(8)} anchor="middle" color={C.warn} size={fs(11)}>
            {L.keys}
          </Label>
        </g>
      )}
    </g>
  );
}
