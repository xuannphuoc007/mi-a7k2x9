"use client";
/**
 * Act 5 · Bitcoin vs Ethereum vs Solana. Three columns build up row by row —
 * block time, fees, supply, who runs it — then size by market value.
 * The full comparison table follows in the reading column.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label, SolCoin } from "../svg";

const IDX = chapterIndex("versus");
const BTC = "#f7931a";
const ETH = "#6b7bd6";
const XS = [190, 500, 810];
/** Prices 13–14 Nov 2026 (Fortune; Kraken/press for SOL) × circulating supply. */
const CAP = [69134.72 * 20.1e6, 1953.96 * 121.7e6, 75 * 575e6];

function Coin({ i, x, y, s }: { i: number; x: number; y: number; s: number }) {
  if (i === 2) return <SolCoin x={x} y={y} s={s} />;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle r={34} fill={i === 0 ? BTC : ETH} />
      <text x={0} y={i === 0 ? 13 : 12} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-sans)", fontSize: i === 0 ? 38 : 34, fontWeight: 700 }}>
        {i === 0 ? "₿" : "Ξ"}
      </text>
    </g>
  );
}

export default function VersusScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.versus;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, head: 0, rows: 0, clock: 0, size: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { head: 1, duration: 0.08 }, at(-0.04))
        .to(v, { rows: 4, duration: 0.42, ease: "none" }, at(0.04))
        .to(v, { clock: 1, duration: 0.9, ease: "none" }, at(0.02))
        .to(v, { size: 1, duration: 0.14 }, at(0.48))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const head = smooth(v.head);
  const size = smooth(v.size);
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const rowY = (i: number) => lerp(290, 270, size) + i * lerp(118, 100, size);
  const rowO = (i: number) => smooth(clamp(v.rows - i)) * (1 - size * 0.3);
  const vs = mobile ? 20 : 14 * Math.min(k, 1.25);

  // block-time dials: in 10 minutes of story time, BTC makes 1 block, ETH 50, Solana ~2,000 (we spin by turns)
  const turns = [v.clock * 1, v.clock * 50, v.clock * 2000];
  const dial = (x: number, y: number, tr: number, col: string) => {
    const a = (tr % 1) * Math.PI * 2 - Math.PI / 2;
    return (
      <g transform={`translate(${x},${y})`}>
        <circle r={18} fill="none" stroke={C.line} strokeWidth={4} />
        <line x1={0} y1={0} x2={Math.cos(a) * 16} y2={Math.sin(a) * 16} stroke={col} strokeWidth={3.5} strokeLinecap="round" />
      </g>
    );
  };
  const cols = [BTC, ETH, "#9945ff"];
  const maxCap = CAP[0];

  return (
    <g opacity={v.vis * (1 - ex)}>
      <g opacity={head}>
        {XS.map((x, i) => (
          <g key={i}>
            <Coin i={i} x={x} y={130} s={lerp(0.8, 1, head)} />
            <Label x={x} y={198} anchor="middle" color={C.ink} size={fs(11)}>
              {L.coins[i]}
            </Label>
          </g>
        ))}
        <line x1={345} x2={345} y1={230} y2={880} stroke={C.line} strokeDasharray="3 6" />
        <line x1={655} x2={655} y1={230} y2={880} stroke={C.line} strokeDasharray="3 6" />
      </g>

      {L.rows.map((r, ri) => {
        const o = rowO(ri);
        if (o <= 0.01) return null;
        const y = rowY(ri);
        return (
          <g key={r.label} opacity={o}>
            <Label x={500} y={y - 36} anchor="middle" size={fs(8.5)}>
              {r.label}
            </Label>
            {XS.map((x, i) => (
              <g key={i}>
                {ri === 0 && !mobile && dial(x - 80, y - 4, turns[i], cols[i])}
                <text x={ri === 0 && !mobile ? x - 52 : x} y={y + 4} textAnchor={ri === 0 && !mobile ? "start" : "middle"} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: vs, fontWeight: 500 }}>
                  {r.vals[i]}
                </text>
              </g>
            ))}
          </g>
        );
      })}

      {size > 0.01 && (
        <g opacity={size}>
          <Label x={500} y={720} anchor="middle" size={fs(8.5)}>
            {L.cap}
          </Label>
          {XS.map((x, i) => {
            const h = 100 * Math.sqrt(CAP[i] / maxCap) * size;
            return (
              <g key={i}>
                <circle cx={x} cy={810} r={h / 2 + 4} fill={cols[i]} opacity={0.85} />
                <text x={x} y={880} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 700 }}>
                  ≈ ${CAP[i] >= 1e12 ? `${nf(CAP[i] / 1e12, 2)}T` : `${nf(CAP[i] / 1e9, 0)}B`}
                </text>
              </g>
            );
          })}
          <Label x={500} y={920} anchor="middle" size={fs(8)} upper={false} spacing="0.02em">
            {L.capNote}
          </Label>
        </g>
      )}
    </g>
  );
}
