"use client";
/**
 * Act 5 · Regulators. A "SECURITY?" stamp lands on SOL in June 2023, then is
 * struck through when the cases are dropped in 2025 without a ruling. Then
 * a stock-exchange facade lights up with SOL fund tickers (Canada, then the U.S.).
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label, SolCoin } from "../svg";

const IDX = chapterIndex("legal");
const TICKERS = [
  { t: "SOLQ · SOLL", ca: true },
  { t: "BSOL", ca: false },
  { t: "GSOL", ca: false },
  { t: "SSK", ca: false },
];

export default function LegalScene() {
  const { t } = useI18n();
  const L = t.scenes.legal;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, coin: 0, stamp: 0, strike: 0, funds: 0, tick: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { coin: 1, duration: 0.08 }, at(-0.02))
        .to(v, { stamp: 1, duration: 0.08, ease: "back.out(1.6)" }, at(0.08))
        .to(v, { strike: 1, duration: 0.12 }, at(0.32))
        .to(v, { funds: 1, duration: 0.1 }, at(0.58))
        .to(v, { tick: 1, duration: 0.18, ease: "none" }, at(0.64))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const coin = smooth(v.coin);
  const stamp = clamp(v.stamp);
  const strike = smooth(v.strike);
  const funds = smooth(v.funds);
  const cx = lerp(500, 200, funds);
  const cy = lerp(450, 470, funds);
  const cs = lerp(3, 1.7, funds);

  return (
    <g opacity={v.vis * (1 - ex)}>
      <SolCoin x={cx} y={cy} s={cs} opacity={coin} />
      <g opacity={1 - funds}>
        <Label x={500} y={190} anchor="middle" size={fs(11)} color={C.ink} opacity={coin}>
          {L.sec}
        </Label>
        {stamp > 0.01 && (
          <g transform={`translate(500,450) rotate(-12) scale(${lerp(1.6, 1, stamp)})`} opacity={clamp(stamp * 2)}>
            <rect x={-230} y={-46} width={460} height={92} rx={10} fill="rgba(255,255,255,0.6)" stroke={C.warn} strokeWidth={5} />
            <text y={16} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: Math.min(fs(30), 44), fontWeight: 800, letterSpacing: "0.08em" }}>
              {L.stamp}
            </text>
            <line x1={-220} x2={lerp(-220, 220, strike)} y1={0} y2={0} stroke={C.ink} strokeWidth={6} strokeLinecap="round" opacity={strike > 0.01 ? 1 : 0} />
          </g>
        )}
        <g opacity={strike}>
          <Label x={500} y={720} anchor="middle" size={fs(13)} color="#14b07c">
            {L.dropped}
          </Label>
          <Label x={500} y={752} anchor="middle" size={fs(10)} upper={false} spacing="0.02em">
            {L.noRuling}
          </Label>
        </g>
      </g>

      {/* stock-market funds */}
      {funds > 0.01 && (
        <g opacity={funds}>
          <Label x={380} y={210} size={fs(11)} color={C.ink}>
            {L.fundsTitle}
          </Label>
          <path d="M380,330 L640,250 L900,330 Z" fill={C.ink} />
          <rect x={390} y={330} width={500} height={420} fill="#fff" stroke={C.ink} strokeWidth={2} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={410 + i * 96} y={350} width={20} height={380} fill={C.line} />
          ))}
          {TICKERS.map((tk, i) => {
            const q = smooth(clamp(v.tick * 4 - i * 0.8));
            const y = 400 + i * 82;
            return (
              <g key={tk.t} opacity={q}>
                <rect x={440} y={y - 30} width={400} height={56} rx={10} fill={C.ink} />
                <text x={466} y={y + 7} fill={tk.ca ? "#ffb4a8" : "#14f195"} style={{ fontFamily: "var(--font-mono)", fontSize: fs(15), fontWeight: 700 }}>
                  {tk.t}
                </text>
                <text x={820} y={y + 7} textAnchor="end" fill="#14f195" style={{ fontFamily: "var(--font-mono)", fontSize: fs(13) }}>
                  ▲
                </text>
              </g>
            );
          })}
          <Label x={390} y={790} size={fs(10)} color={C.ink}>
            {L.canada}
          </Label>
          <Label x={390} y={818} size={fs(10)} color="#14b07c">
            {L.us}
          </Label>
        </g>
      )}
    </g>
  );
}
