"use client";
/**
 * Act 4 · The $6.3B hack (29 Oct 2026). Hot wallets on about ten chains drain
 * while a counter climbs; compared with earlier record thefts; ~$3B is
 * frozen by partners and withdrawals pause; then company funds refill
 * customers' balances while BNB slides.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("hack");
const CHAINS = ["XRPL", "Solana", "Optimism", "Arbitrum", "Avalanche", "Polygon", "…", "…", "…", "…"];
const RECORDS: [string, number][] = [
  ["Ronin 2022", 0.62],
  ["Bybit 2025", 1.5],
  ["Binance 2026", 6.36],
];

export default function HackScene() {
  const { t } = useI18n();
  const L = t.scenes.hack;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, drain: 0, rec: 0, freeze: 0, refill: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { drain: 1, duration: 0.2, ease: "none" }, at(-0.02))
        .to(v, { rec: 1, duration: 0.08 }, at(0.18))
        .to(v, { freeze: 1, duration: 0.16, ease: "none" }, at(0.3))
        .to(v, { refill: 1, duration: 0.22, ease: "none" }, at(0.6))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const drain = v.drain;
  const rec = smooth(v.rec);
  const freeze = v.freeze;
  const refill = v.refill;
  const stolen = 6.3 * smooth(drain);
  const mins = Math.floor(drain * 175);
  const clock = `${String(20 + Math.floor((5 + mins) / 60)).padStart(2, "0")}:${String((5 + mins) % 60).padStart(2, "0")} UTC`;
  const recFade = 1 - smooth(clamp(freeze * 4));

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* wallets draining */}
      <g opacity={1 - smooth(clamp((refill - 0.05) * 5)) * 0.85}>
        <Label x={140} y={150} color={C.ink} size={fs(11)}>
          {L.wallets}
        </Label>
        <text x={860} y={156} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12) }}>
          29 OCT · {clock}
        </text>
        {CHAINS.map((c, i) => {
          const x = 140 + (i % 5) * 160 + 40;
          const y = 220 + Math.floor(i / 5) * 150;
          const q = clamp(drain * 1.6 - i * 0.06);
          const frozenPart = 0.47 * smooth(clamp(freeze * 2 - i * 0.05));
          return (
            <g key={i} transform={`translate(${x},${y})`}>
              <rect x={-55} y={0} width={110} height={90} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={1.6} />
              <rect x={-49} y={6 + 78 * q} width={98} height={78 * (1 - q)} rx={6} fill={C.yellow} opacity={0.85} />
              {frozenPart > 0.01 && <rect x={-49} y={6 + 78 * (1 - frozenPart)} width={98} height={78 * frozenPart * q} rx={6} fill={C.sky} opacity={0.75} />}
              <text x={0} y={-10} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                {c}
              </text>
              {q > 0.2 && q < 1 && <path d={`M55,45 l${30 * q},${-10 * q}`} stroke={C.warn} strokeWidth={3} />}
            </g>
          );
        })}
        <text x={500} y={590} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-serif)", fontSize: fs(58), fontWeight: 600 }}>
          ${stolen.toFixed(1)}B
        </text>
        <Label x={500} y={620 + fs(6)} anchor="middle" size={fs(10)} color={C.ink}>
          {L.stolen}
        </Label>
      </g>

      {/* biggest thefts */}
      {rec > 0.01 && (
        <g opacity={rec * recFade}>
          <Label x={140} y={690} size={fs(10)} color={C.ink}>
            {L.records}
          </Label>
          {RECORDS.map(([n, b], i) => (
            <g key={n} transform={`translate(0,${730 + i * 52})`}>
              <text x={140} y={6} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(11) }}>
                {n}
              </text>
              <rect x={340} y={-14} width={(b / 6.36) * 470 * rec} height={26} rx={4} fill={i === 2 ? C.warn : C.lilac} opacity={0.85} />
              <text x={340 + (b / 6.36) * 470 * rec + 10} y={6} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(11), fontWeight: 700 }}>
                ${b}B
              </text>
            </g>
          ))}
        </g>
      )}

      {/* freeze & pause */}
      {freeze > 0.01 && refill < 0.3 && (
        <g opacity={smooth(clamp(freeze * 4)) * (1 - smooth(clamp(refill * 4)))}>
          <g transform="translate(500,760)">
            <rect x={-330} y={-44} width={660} height={88} rx={10} fill="#eaf3fb" stroke={C.sky} strokeWidth={2} />
            <text y={-4} textAnchor="middle" fill={C.sky} style={{ fontFamily: "var(--font-mono)", fontSize: fs(16), fontWeight: 700 }}>
              ≈ $3B {L.frozen}
            </text>
            <text y={24} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 13.5 * Math.min(k, 1.3) }}>
              {L.tether}
            </text>
          </g>
          <g transform="translate(500,875)">
            <rect x={-230} y={-28} width={460} height={56} rx={6} fill={freeze > 0.7 ? C.mint : C.warn} />
            <text y={7} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: fs(13), fontWeight: 700 }}>
              {freeze > 0.7 ? L.reopen : L.paused}
            </text>
          </g>
        </g>
      )}

      {/* company funds refill */}
      {refill > 0.01 && (
        <g opacity={smooth(clamp(refill * 5))}>
          <Label x={500} y={190} anchor="middle" color={C.ink} size={fs(12)}>
            {L.refillTitle}
          </Label>
          <rect x={200} y={240} width={600} height={70} rx={8} fill={C.line} />
          <rect x={200} y={240} width={600 * clamp(refill * 1.25)} height={70} rx={8} fill={C.mint} />
          <text x={500} y={285} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: fs(18), fontWeight: 700 }}>
            ${(6.34 * clamp(refill * 1.25)).toFixed(2)}B
          </text>
          <Label x={500} y={350 + fs(4)} anchor="middle" size={fs(10)} upper={false} spacing="0.02em">
            {L.covered}
          </Label>
          {/* BNB after the hack */}
          <g opacity={smooth(clamp((refill - 0.4) * 3))}>
            <Label x={200} y={520} size={fs(10)} color={C.ink}>
              {L.bnbAfter}
            </Label>
            <path d={`M200,600 L340,620 L480,640 L620,660 L${lerp(620, 800, clamp((refill - 0.5) * 2))},${lerp(660, 760, clamp((refill - 0.5) * 2))}`} fill="none" stroke={C.yellow} strokeWidth={4} strokeLinejoin="round" />
            <text x={200} y={585} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(11) }}>
              $759
            </text>
            {refill > 0.95 && (
              <text x={800} y={800} textAnchor="end" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(16), fontWeight: 700 }}>
                $584 · −23%
              </text>
            )}
          </g>
        </g>
      )}
    </g>
  );
}
