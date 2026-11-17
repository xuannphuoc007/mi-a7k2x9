"use client";
/**
 * Act 4 · Layer 2. Hundreds of small payments are packed into one crate on
 * a side road and only the crate rides the main bus; in 2024 the crate gets
 * its own cheap lane (blobs). Then the trade-offs: one sequencer, less burn.
 */
import { useMemo } from "react";
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, mulberry32, smooth } from "@/lib/store";
import { C, Flame, Label } from "../svg";

const IDX = chapterIndex("layer2");
const CRATE = { x: 500, y: 330 };

export default function Layer2Scene() {
  const { t } = useI18n();
  const L = t.scenes.layer2;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const dots = useMemo(() => {
    const r = mulberry32(5);
    return Array.from({ length: 90 }, () => ({ x: 80 + r() * 300, y: 140 + r() * 380, d: r(), c: Math.floor(r() * 3) }));
  }, []);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, dots: 0, pack: 0, ride: 0, blob: 0, trade: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { dots: 1, duration: 0.1 }, at(-0.08))
        .to(v, { pack: 1, duration: 0.14, ease: "none" }, at(0.06))
        .to(v, { ride: 1, duration: 0.1 }, at(0.2))
        .to(v, { blob: 1, duration: 0.14 }, at(0.32))
        .to(v, { trade: 1, duration: 0.14 }, at(0.62))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const pack = smooth(v.pack);
  const ride = smooth(v.ride);
  const blob = smooth(v.blob);
  const trade = smooth(v.trade);
  const cols = [C.lilac, C.mint, C.peach];

  // crate position: packs on the side road, then rides down to the main road (L1)
  const crate = { x: lerp(CRATE.x, lerp(700, 380, blob), ride), y: lerp(CRATE.y, lerp(590, 760, blob), ride) };
  const feeL1 = 2.4; // illustrative $ per payment if each paid its own seat on a busy day
  const perTx = lerp(feeL1, lerp(0.05, 0.01, blob), pack);

  return (
    <g opacity={v.vis * (1 - ex) * (1 - trade * 0.0)}>
      {/* roads */}
      <g opacity={smooth(v.dots)}>
        <Label x={60} y={110} color={C.lilac} size={fs(10)}>
          {L.side}
        </Label>
        <line x1={40} x2={960} y1={600} y2={600} stroke={C.line} strokeWidth={3} />
        <Label x={60} y={630 + fs(4)} color={C.accent} size={fs(10)}>
          {L.main}
        </Label>
        {blob > 0.01 && (
          <g opacity={blob}>
            <line x1={40} x2={960} y1={760} y2={760} stroke={C.mint} strokeWidth={3} strokeDasharray="10 8" />
            <Label x={960} y={790 + fs(4)} anchor="end" color={C.mint} size={fs(10)}>
              {L.blobLane}
            </Label>
          </g>
        )}
      </g>

      {/* the main-road bus (an Ethereum block) */}
      <g opacity={smooth(v.dots)} transform="translate(640,548)">
        <rect x={-150} y={-60} width={300} height={104} rx={16} fill={C.paper} stroke={C.accent} strokeWidth={2} />
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={-132 + (i % 12) * 22} y={-40 + Math.floor(i / 12) * 26} width={16} height={18} rx={3} fill={i < 20 - Math.round(ride * (1 - blob) * 4) ? C.line : C.accentSoft} />
        ))}
        <circle cx={-96} cy={48} r={13} fill={C.line} stroke={C.mute} />
        <circle cx={96} cy={48} r={13} fill={C.line} stroke={C.mute} />
        <Label x={0} y={-72} anchor="middle" size={fs(8.5)} color={C.accent}>
          {L.block}
        </Label>
      </g>

      {/* many small payments flow into the crate */}
      {dots.map((d, i) => {
        const q = clamp(pack * 1.5 - d.d * 0.5);
        const x = lerp(d.x, CRATE.x - 40 + (i % 9) * 10, smooth(q));
        const y = lerp(d.y, CRATE.y - 30 + Math.floor(i / 9) * 6, smooth(q));
        if (q >= 1 && ride > 0.02) return null;
        return <circle key={i} cx={x} cy={y} r={lerp(6, 3, q)} fill={cols[d.c]} opacity={smooth(v.dots) * (1 - q * 0.3)} />;
      })}

      {/* the crate */}
      {pack > 0.5 && (
        <g transform={`translate(${crate.x},${crate.y - 40})`} opacity={clamp((pack - 0.5) * 3)}>
          <rect x={-60} y={-44} width={120} height={88} rx={6} fill={C.accentSoft} stroke={C.accent} strokeWidth={2} />
          <path d="M-60,-10 H60 M-20,-44 V44 M20,-44 V44" stroke={C.accent} strokeWidth={1} opacity={0.5} />
          <Label x={0} y={64 + fs(4)} anchor="middle" size={fs(9)} color={C.ink}>
            {L.crate}
          </Label>
        </g>
      )}

      {/* fee per payment */}
      <g opacity={smooth(v.dots)}>
        <text x={940} y={170} textAnchor="end" fill={pack > 0.5 ? C.mint : C.peach} style={{ fontFamily: "var(--font-mono)", fontSize: fs(28), fontWeight: 600 }}>
          {perTx >= 0.995 ? `$${perTx.toFixed(2)}` : `${Math.max(1, Math.round(perTx * 100))}¢`}
        </text>
        <Label x={940} y={170 + fs(20)} anchor="end" size={fs(9)}>
          {L.perPayment}
        </Label>
      </g>

      {/* trade-offs */}
      {trade > 0.01 && (
        <g opacity={trade}>
          <rect x={90} y={150} width={420} height={380} rx={10} fill={C.paper} stroke={C.line} />
          <g transform="translate(300,260)">
            <circle r={36} fill={C.accentSoft} stroke={C.peach} strokeWidth={2} />
            <rect x={-14} y={-14} width={28} height={28} rx={3} fill={C.peach} />
            {[-1, 0, 1].map((d) => (
              <path key={d} d={`M${-150},${d * 36} L${-44},${d * 8}`} stroke={C.line} strokeWidth={1.4} />
            ))}
            <path d="M44,0 L140,0" stroke={C.accent} strokeWidth={2} />
          </g>
          <Label x={300} y={340 + fs(4)} anchor="middle" color={C.peach} size={fs(10)}>
            {L.sequencer}
          </Label>
          <g transform="translate(300,440)">
            <Flame x={-60} y={10} s={0.45} />
            <path d="M-20,10 H40" stroke={C.peach} strokeWidth={2} strokeDasharray="4 4" />
            <path d="M40,2 L54,10 L40,18" fill={C.peach} />
            <Label x={0} y={56 + fs(4)} anchor="middle" color={C.peach} size={fs(9.5)}>
              {L.lessBurn}
            </Label>
          </g>
        </g>
      )}
    </g>
  );
}
