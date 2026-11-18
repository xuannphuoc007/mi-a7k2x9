"use client";
/**
 * Act 3 · DeFi on BNB Chain. Minh swaps against a pool (two tanks — the
 * price moves with their ratio); then deposits on BNB Chain vs Ethereum and
 * Solana; then a "sandwich" bot squeezes a trade, with the chain's risk stats.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSegmentTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Chip, Label, Person } from "../svg";

const IDX = chapterIndex("chain");
/** DefiLlama: BSC $4.90B (12 Nov 2026); Solana ≈ $5.9B and Ethereum ≈ $50B (CryptoBriefing, 2026). */
const TVL = [
  { key: "eth", v: 50, color: "#6b7bd6" },
  { key: "sol", v: 5.9, color: "#8a5cf5" },
  { key: "bnb", v: 4.9, color: "#f0b90b" },
] as const;

export default function DefiScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.defi;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSegmentTimeline(
    IDX,
    0.5,
    1,
    { vis: 0, pool: 0, swap: 0, tvl: 0, sand: 0, stats: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { pool: 1, duration: 0.1 }, at(-0.04))
        .to(v, { swap: 1, duration: 0.18, ease: "none" }, at(0.08))
        .to(v, { tvl: 1, duration: 0.18 }, at(0.3))
        .to(v, { sand: 1, duration: 0.18, ease: "none" }, at(0.6))
        .to(v, { stats: 1, duration: 0.12 }, at(0.72))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const pool = smooth(v.pool);
  const swap = smooth(v.swap);
  const tvl = smooth(v.tvl);
  const sand = v.sand;
  const stats = smooth(v.stats);
  const nf = (n: number, d = 1) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const ts = 15 * Math.min(k, 1.35);

  // pool: x*y = k. Start 1,000 BNB / 600,000 USDT; Minh adds 6,000 USDT (illustrative, scaled up so the move shows)
  const bnb0 = 1000;
  const usd0 = 600000;
  const add = 30000 * swap;
  const usd = usd0 + add;
  const bnb = (bnb0 * usd0) / usd;
  const price = usd / bnb;
  const hB = 260 * (bnb / bnb0);
  const hU = 260 * (usd / usd0) * 0.82;
  const poolFade = 1 - tvl;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* --- the pool --- */}
      {poolFade > 0.02 && (
        <g opacity={pool * poolFade}>
          <Label x={500} y={140} anchor="middle" color={C.ink} size={fs(11)}>
            {L.poolTitle}
          </Label>
          {[
            { x: 380, h: hB, col: C.yellow, name: "BNB", amt: nf(bnb, 0) },
            { x: 620, h: hU, col: C.mint, name: "USDT", amt: nf(usd, 0) },
          ].map((tk) => (
            <g key={tk.name}>
              <rect x={tk.x - 70} y={200} width={140} height={330} rx={12} fill="none" stroke={C.ink} strokeWidth={2} />
              <rect x={tk.x - 66} y={526 - tk.h} width={132} height={tk.h} rx={8} fill={tk.col} opacity={0.75} />
              <text x={tk.x} y={570} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(13), fontWeight: 700 }}>
                {tk.amt} {tk.name}
              </text>
            </g>
          ))}
          <line x1={450} x2={550} y1={365} y2={365} stroke={C.ink} strokeWidth={2} strokeDasharray="4 5" />
          <text x={500} y={350} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12) }}>
            x · y = k
          </text>
          {/* Minh drops USDT in, takes BNB out */}
          <Person x={150} y={640} s={0.9} color={C.sky} />
          <Label x={150} y={720} anchor="middle" color={C.ink} size={fs(10)}>
            {L.minh}
          </Label>
          {swap > 0.02 && swap < 0.98 && (
            <>
              <Chip x={lerp(200, 600, swap)} y={lerp(600, 190, Math.sin(swap * Math.PI * 0.5))} text="USDT" color={C.mint} k={Math.min(k, 1.3)} opacity={1} />
              <Chip x={lerp(380, 180, swap)} y={lerp(190, 580, swap)} text="BNB" color={C.yellow} k={Math.min(k, 1.3)} opacity={1} />
            </>
          )}
          <text x={500} y={650} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(16), fontWeight: 700 }}>
            1 BNB ≈ ${nf(price, 0)}
          </text>
          <Label x={500} y={690} anchor="middle" size={fs(9)} upper={false} spacing="0.02em">
            {L.poolNote}
          </Label>
          {!mobile && (
            <text x={500} y={760} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: ts }}>
              {L.lend}
            </text>
          )}
        </g>
      )}

      {/* --- deposits compared --- */}
      {tvl > 0.01 && (
        <g opacity={tvl * (1 - smooth(clamp(sand * 3)))}>
          <Label x={140} y={180} color={C.ink} size={fs(11)}>
            {L.tvlTitle}
          </Label>
          {TVL.map((c, i) => {
            const y = 250 + i * 110;
            const w = 700 * (c.v / 50) * tvl;
            return (
              <g key={c.key}>
                <text x={140} y={y - 14} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: ts, fontWeight: 600 }}>
                  {L.chains[i]}
                </text>
                <rect x={140} y={y} width={Math.max(4, w)} height={34} rx={5} fill={c.color} opacity={0.85} />
                <text x={150 + Math.max(4, w)} y={y + 24} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(13), fontWeight: 700 }}>
                  ≈ ${nf(c.v, c.v >= 10 ? 0 : 1)}B
                </text>
              </g>
            );
          })}
          <Label x={140} y={600} size={fs(8.5)} upper={false} spacing="0.02em">
            {L.tvlSrc}
          </Label>
          <g transform="translate(140,650)">
            <rect x={0} y={0} width={720} height={mobile ? 120 : 96} rx={8} fill="#fcf0c8" stroke={C.gold} strokeWidth={1.2} />
            {L.apps.map((a, i) => (
              <text key={a} x={20} y={32 + i * (mobile ? 40 : 30)} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 14 * Math.min(k, 1.3) }}>
                {a}
              </text>
            ))}
          </g>
        </g>
      )}

      {/* --- sandwich --- */}
      {sand > 0.01 && (
        <g>
          <g opacity={smooth(clamp(sand * 3))}>
            <Label x={500} y={150} anchor="middle" color={C.ink} size={fs(11)}>
              {L.sandTitle}
            </Label>
            {[
              { lab: L.botBuy, col: C.warn, p: 0 },
              { lab: L.minhBuy, col: C.yellow, p: 1 },
              { lab: L.botSell, col: C.warn, p: 2 },
            ].map((r, i) => {
              const q = smooth(clamp(sand * 4 - 0.3 - [1, 0, 2][i] * 0.6));
              const y = 210 + r.p * 70;
              const slide = i === 1 ? 0 : (1 - q) * (i === 0 ? -300 : 300);
              return (
                <g key={i} opacity={i === 1 ? 1 : q} transform={`translate(${slide},0)`}>
                  <rect x={250} y={y} width={500} height={54} rx={i === 1 ? 6 : 26} fill={r.col} opacity={i === 1 ? 0.9 : 0.85} />
                  <text x={500} y={y + 34} textAnchor="middle" fill={i === 1 ? "#1e2026" : "#fff"} style={{ fontFamily: "var(--font-mono)", fontSize: 12 * Math.min(k, 1.3), fontWeight: 700 }}>
                    {r.lab}
                  </text>
                </g>
              );
            })}
            <text x={500} y={470} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: ts }}>
              {L.sandNote}
            </text>
          </g>
          {stats > 0.01 && (
            <g opacity={stats}>
              {L.stats.map((s, i) => {
                const x = mobile ? 500 : 230 + i * 270;
                const y = mobile ? 560 + i * 110 : 600;
                return (
                  <g key={s.big}>
                    <text x={x} y={y} textAnchor="middle" fill={i === 1 ? C.mint : C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(mobile ? 20 : 26), fontWeight: 700 }}>
                      {s.big}
                    </text>
                    <text x={x} y={y + 34} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 13 * Math.min(k, 1.3) }}>
                      {s.small}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </g>
      )}
    </g>
  );
}
