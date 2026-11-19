"use client";
/**
 * Milestone 2 · NFTs. The same NFT costs a fortune in fees on Ethereum and a
 * fraction of a cent on Solana; Magic Eden's stall fills up (≈90% share);
 * SOL climbs >100× in 2021; then one weekend in 2022 shows both chains failing
 * in their own way — Ethereum fees explode, Solana stops for seven hours.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { priceAt, usd } from "@/lib/solSeries";
import { C, Label } from "../svg";
import { asset } from "@/lib/asset";

const IDX = chapterIndex("nft");
const ART = ["#9945ff", "#19b3c9", "#14c98a", "#f7931a", "#e0662f", "#6b7bd6"];

/** a small original abstract "NFT" */
function Art({ x, y, s, seed }: { x: number; y: number; s: number; seed: number }) {
  const a = ART[seed % ART.length];
  const b = ART[(seed + 2) % ART.length];
  const c = ART[(seed + 4) % ART.length];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-50} y={-50} width={100} height={100} rx={14} fill={a} opacity={0.18} />
      <circle cx={-12 + (seed % 3) * 6} cy={-6} r={26} fill={b} />
      <rect x={4} y={6 - (seed % 2) * 10} width={34} height={34} rx={6} fill={c} opacity={0.9} />
      <circle cx={-22} cy={-26} r={6} fill="#fff" />
    </g>
  );
}

const T0 = 2021.0, T1 = 2021.9;
const PX0 = 160, PX1 = 860, PYB = 720, PYT = 300;
const P21 = Array.from({ length: 60 }, (_, i) => {
  const t = T0 + (i / 59) * (T1 - T0);
  return { t, p: priceAt(t) ?? 1 };
});
const LMIN = Math.log10(1), LMAX = Math.log10(300);
const px = (t: number) => PX0 + ((t - T0) / (T1 - T0)) * (PX1 - PX0);
const py = (p: number) => PYB - ((Math.log10(Math.max(p, 1)) - LMIN) / (LMAX - LMIN)) * (PYB - PYT);
const LINE = "M" + P21.map((q) => `${px(q.t).toFixed(1)},${py(q.p).toFixed(1)}`).join("L");

export default function NftScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.nft;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const big = (s: number, cap: number) => Math.min(fs(s), cap);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, cards: 0, fees: 0, market: 0, fill: 0, chart: 0, weekend: 0, fail: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { cards: 1, duration: 0.08 }, at(-0.02))
        .to(v, { fees: 1, duration: 0.14, ease: "none" }, at(0.06))
        .to(v, { market: 1, duration: 0.06 }, at(0.26))
        .to(v, { fill: 1, duration: 0.16, ease: "none" }, at(0.3))
        .to(v, { chart: 1, duration: 0.18 }, at(0.5))
        .to(v, { weekend: 1, duration: 0.06 }, at(0.72))
        .to(v, { fail: 1, duration: 0.14, ease: "none" }, at(0.76))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const market = smooth(v.market);
  const chart = smooth(v.chart);
  const weekend = smooth(v.weekend);
  const fadeIn = (x: number) => clamp(x * 1.6 - 0.6);
  const fadeOut = (x: number) => 1 - clamp(x * 2.5);
  const cardsO = smooth(v.cards) * fadeOut(market);
  const marketO = fadeIn(market) * fadeOut(chart);
  const chartO = fadeIn(chart) * fadeOut(weekend);
  const ethFee = Math.round(lerp(50, 1500, Math.pow(v.fees, 2.2)));
  const last = P21[P21.length - 1];

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* the same NFT, two fees */}
      {cardsO > 0.01 && (
        <g opacity={cardsO}>
          {[
            { x: 280, name: L.eth, col: "#6b7bd6", fee: `$${new Intl.NumberFormat(locale).format(ethFee)}${ethFee >= 1500 ? "+" : ""}`, bad: true },
            { x: 720, name: L.sol, col: "#9945ff", fee: L.solFee, bad: false },
          ].map((c, i) => (
            <g key={c.name}>
              <text x={c.x} y={250} textAnchor="middle" fill={c.col} style={{ fontFamily: "var(--font-serif)", fontSize: big(24, 44), fontWeight: 600 }}>
                {c.name}
              </text>
              <rect x={c.x - 130} y={290} width={260} height={300} rx={22} fill="#fff" stroke={C.line} strokeWidth={2} />
              <clipPath id={`nftcard${i}`}>
                <rect x={c.x - 116} y={304} width={232} height={272} rx={14} />
              </clipPath>
              <image href={asset(i === 0 ? "/img/nft-eth.jpg" : "/img/nft-sol.jpg")} x={c.x - 136} y={304} width={272} height={272} preserveAspectRatio="xMidYMid slice" clipPath={`url(#nftcard${i})`} />
              <rect x={c.x - 120} y={640} width={240} height={70} rx={35} fill={c.bad ? C.warn : "#14b07c"} />
              <text x={c.x} y={685} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: big(20, 34), fontWeight: 700 }}>
                {c.bad ? c.fee : L.solFee.replace(/^[^<]*/, "")}
              </text>
            </g>
          ))}
          <Label x={280} y={750} anchor="middle" size={big(10, 19)} color={C.warn}>
            {L.ethFee}
          </Label>
          <Label x={720} y={750} anchor="middle" size={big(10, 19)} color="#14b07c">
            {L.solFee}
          </Label>
        </g>
      )}

      {/* Magic Eden's stall */}
      {marketO > 0.01 && (
        <g opacity={marketO}>
          <text x={500} y={230} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(26, 46), fontWeight: 600 }}>
            {L.market}
          </text>
          <path d="M170,300 L830,300 L800,250 L200,250 Z" fill="#e0662f" opacity={0.85} />
          <rect x={170} y={300} width={660} height={360} rx={12} fill="#fff" stroke={C.line} strokeWidth={2} />
          {Array.from({ length: 12 }, (_, i) => {
            const q = smooth(clamp(v.fill * 12 - i));
            const x = 250 + (i % 4) * 167;
            const y = 385 + Math.floor(i / 4) * 105;
            return (
              <g key={i} opacity={q} transform={`translate(0,${(1 - q) * 14})`}>
                <Art x={x} y={y} s={0.85} seed={i} />
              </g>
            );
          })}
          <rect x={170} y={710} width={660} height={34} rx={17} fill={C.line} />
          <rect x={170} y={710} width={660 * 0.9 * smooth(clamp(v.fill * 1.2))} height={34} rx={17} fill="#9945ff" />
          <Label x={500} y={790} anchor="middle" size={big(11, 21)} color={C.ink}>
            {L.share}
          </Label>
        </g>
      )}

      {/* SOL in 2021 */}
      {chartO > 0.01 && (
        <g opacity={chartO}>
          <Label x={PX0} y={250} size={big(11, 21)} color={C.ink}>
            {L.summer}
          </Label>
          <line x1={PX0} x2={PX1} y1={PYB} y2={PYB} stroke={C.ink} strokeOpacity={0.3} />
          <path d={LINE} fill="none" stroke="#9945ff" strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={`${chart} 1`} />
          <text x={PX0} y={PYB + 40} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(11, 22) }}>
            {usd(P21[0].p, locale)}
          </text>
          <g opacity={smooth(clamp(chart * 2 - 1))}>
            <circle cx={px(last.t)} cy={py(last.p)} r={8} fill="#9945ff" />
            <text x={px(last.t) - 14} y={py(last.p) - 20} textAnchor="end" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 26), fontWeight: 700 }}>
              {usd(last.p, locale)}
            </text>
            <text x={PX0 + 10} y={420} fill="#14b07c" style={{ fontFamily: "var(--font-serif)", fontSize: big(60, 100), fontWeight: 600 }}>
              {L.x100}
            </text>
          </g>
        </g>
      )}

      {/* one weekend, two failures */}
      {weekend > 0.01 && (
        <g opacity={fadeIn(weekend)}>
          <text x={500} y={230} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(22, 38), fontWeight: 600 }}>
            {L.weekend}
          </text>
          <line x1={500} x2={500} y1={280} y2={720} stroke={C.line} strokeWidth={2} />
          {/* Ethereum: a fee meter going through the roof */}
          <text x={280} y={320} textAnchor="middle" fill="#6b7bd6" style={{ fontFamily: "var(--font-serif)", fontSize: big(20, 36), fontWeight: 600 }}>
            {L.eth}
          </text>
          <rect x={240} y={360} width={80} height={300} rx={40} fill="#fff" stroke={C.line} strokeWidth={2} />
          <rect x={250} y={650 - 280 * v.fail} width={60} height={280 * v.fail} rx={30} fill={C.warn} />
          <Label x={280} y={710} anchor="middle" size={big(9.5, 18)} upper={false} spacing="0.02em" color={C.warn}>
            {L.ethBad}
          </Label>
          {/* Solana: heartbeat goes flat */}
          <text x={720} y={320} textAnchor="middle" fill="#9945ff" style={{ fontFamily: "var(--font-serif)", fontSize: big(20, 36), fontWeight: 600 }}>
            {L.sol}
          </text>
          <path
            d={`M560,510 L600,510 L610,470 L620,540 L630,510 L670,510 L680,470 L690,540 L700,510 L${lerp(700, 880, v.fail)},510`}
            fill="none"
            stroke="#9945ff"
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {v.fail > 0.05 && <line x1={700} x2={lerp(700, 880, v.fail)} y1={510} y2={510} stroke={C.warn} strokeWidth={6} strokeLinecap="round" />}
          <text x={720} y={600} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-serif)", fontSize: big(40, 70), fontWeight: 600 }} opacity={smooth(clamp(v.fail * 2 - 0.6))}>
            7h
          </text>
          <Label x={720} y={710} anchor="middle" size={big(9.5, 18)} upper={false} spacing="0.02em" color={C.warn}>
            {L.solBad}
          </Label>
          <g opacity={smooth(clamp(v.fail * 2 - 1))} transform="translate(500,800)">
            <rect x={-200} y={-30} width={400} height={60} rx={30} fill="#fff" stroke={C.ink} strokeWidth={2} />
            <Label x={0} y={7} anchor="middle" size={big(12, 22)} color={C.ink}>
              {L.lesson}
            </Label>
          </g>
        </g>
      )}
    </g>
  );
}
