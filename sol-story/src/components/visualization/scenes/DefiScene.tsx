"use client";
/**
 * Solana today. Minh swaps SOL for USDC: Jupiter splits the order across
 * Raydium, Orca and others. Then three tiles — digital dollars, tokenised
 * shares and funds, days without an outage — with the big names building on
 * Solana, and the price note.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Chip, Label, Logo, Person } from "../svg";

const IDX = chapterIndex("today");
const M = { x: 110, y: 470 };
const J = { x: 350, y: 470 };
const V = [
  { x: 610, y: 320 },
  { x: 610, y: 470 },
  { x: 610, y: 620 },
];
const U = { x: 860, y: 470 };
const SHARE = [0.5, 0.3, 0.2];

export default function DefiScene() {
  const { t } = useI18n();
  const L = t.scenes.defi;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, route: 0, flow: 0, t1: 0, names: 0, t2: 0, t3: 0, risk: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { route: 1, duration: 0.1 }, at(-0.02))
        .to(v, { flow: 1, duration: 0.18, ease: "none" }, at(0.06))
        .to(v, { t1: 1, duration: 0.1 }, at(0.27))
        .to(v, { names: 1, duration: 0.14, ease: "none" }, at(0.33))
        .to(v, { t2: 1, duration: 0.1 }, at(0.5))
        .to(v, { t3: 1, duration: 0.1 }, at(0.72))
        .to(v, { risk: 1, duration: 0.08 }, at(0.8))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const t1 = smooth(v.t1);
  const routeO = smooth(v.route) * (1 - t1);
  const flow = v.flow;
  const tiles = [t1, smooth(v.t2), smooth(v.t3)];
  const risk = smooth(v.risk);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* the swap route */}
      {routeO > 0.01 && (
        <g opacity={routeO}>
          <Person x={M.x} y={M.y} s={0.6} color={C.sky} />
          <Label x={M.x} y={M.y + 72} anchor="middle" size={fs(10)} color={C.ink}>
            {L.minh}
          </Label>
          <line x1={M.x + 40} x2={J.x - 60} y1={M.y} y2={J.y} stroke={C.line} strokeWidth={4} />
          {V.map((p, i) => (
            <g key={i}>
              <path d={`M${J.x + 60},${J.y} C${J.x + 140},${J.y} ${p.x - 140},${p.y} ${p.x - 60},${p.y}`} fill="none" stroke={C.line} strokeWidth={2 + SHARE[i] * 14} />
              <path d={`M${p.x + 60},${p.y} C${p.x + 140},${p.y} ${U.x - 140},${U.y} ${U.x - 46},${U.y}`} fill="none" stroke={C.line} strokeWidth={2 + SHARE[i] * 14} />
            </g>
          ))}
          <Logo x={J.x} y={J.y} w={104} h={104} href="/img/jupiter.png" />
          <Label x={J.x} y={J.y + 84} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em">
            {mobile ? "Jupiter" : L.route}
          </Label>
          <Logo x={V[0].x} y={V[0].y} w={86} h={98} href="/img/raydium.png" />
          {[1, 2].map((i) => (
            <g key={i}>
              <circle cx={V[i].x} cy={V[i].y} r={44} fill="#fff" stroke="#19b3c9" strokeWidth={3} />
              <text x={V[i].x} y={V[i].y + 5} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: Math.min(fs(11), 16), fontWeight: 600 }}>
                {L.venues[i]}
              </text>
            </g>
          ))}
          {/* coins travelling */}
          {Array.from({ length: 9 }, (_, j) => {
            const lane = j % 3;
            const q = clamp(flow * 1.6 - j * 0.07);
            if (q <= 0 || q >= 1) return null;
            let x, y;
            if (q < 0.33) {
              const f = q / 0.33;
              x = lerp(M.x + 40, J.x, f);
              y = M.y;
            } else if (q < 0.66) {
              const f = (q - 0.33) / 0.33;
              x = lerp(J.x, V[lane].x, f);
              y = lerp(J.y, V[lane].y, smooth(f));
            } else {
              const f = (q - 0.66) / 0.34;
              x = lerp(V[lane].x, U.x, f);
              y = lerp(V[lane].y, U.y, smooth(f));
            }
            return <circle key={j} cx={x} cy={y} r={9} fill={q < 0.5 ? "#9945ff" : "#2775ca"} />;
          })}
          <g opacity={smooth(clamp(flow * 1.5 - 0.5))}>
            <circle cx={U.x} cy={U.y} r={46} fill="#2775ca" />
            <text x={U.x} y={U.y + 6} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700 }}>
              USDC
            </text>
            <Label x={U.x} y={U.y + 80} anchor="middle" size={fs(10)} color={C.ink}>
              {L.got}
            </Label>
          </g>
        </g>
      )}

      {/* stat tiles */}
      {L.bars.map((b, i) => {
        const q = tiles[i];
        if (q <= 0.01) return null;
        const y = 210 + i * 175;
        const col = ["#2775ca", "#9945ff", "#14b07c"][i];
        return (
          <g key={b.label} opacity={q} transform={`translate(${(1 - q) * 30},0)`}>
            <rect x={120} y={y} width={760} height={140} rx={22} fill="#fff" stroke={C.line} strokeWidth={2} />
            <rect x={120} y={y} width={12} height={140} rx={6} fill={col} />
            <text x={160} y={y + 88} fill={col} style={{ fontFamily: "var(--font-serif)", fontSize: Math.min(fs(46), 72), fontWeight: 600 }}>
              {b.val}
            </text>
            <text x={mobile ? 160 : 470} y={mobile ? y + 128 : y + 66} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fs(mobile ? 11 : 16), fontWeight: 600 }}>
              {b.label}
            </text>
            {!mobile && (
              <Label x={470} y={y + 96} size={fs(9.5)}>
                {b.note}
              </Label>
            )}
          </g>
        );
      })}
      {v.names > 0.01 && (
        <g>
          {L.names.map((n, i) => {
            const q = smooth(clamp(v.names * 4 - i * 0.8)) * (1 - risk * 0.4);
            if (q <= 0.01) return null;
            const show = i < 3 || v.t2 > 0.5;
            if (i >= 5) return null;
            if (!show) return null;
            const x = 220 + (i % 2) * 380;
            const y = 760 + Math.floor(i / 2) * 60;
            return <Chip key={n} x={x} y={y} text={n} color={i === 3 ? C.ink : C.lilac} k={Math.min(k, 1.5)} opacity={q} />;
          })}
        </g>
      )}
      {risk > 0.01 && (
        <g opacity={risk} transform="translate(640,150) rotate(-4)">
          <rect x={-240} y={-32} width={480} height={64} rx={32} fill="#fff" stroke={C.warn} strokeWidth={3} />
          <Label x={0} y={7} anchor="middle" size={Math.min(fs(13), 20)} color={C.warn}>
            {L.risk}
          </Label>
        </g>
      )}
    </g>
  );
}
