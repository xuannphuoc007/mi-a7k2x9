"use client";
/**
 * Act 0 · The Problem. Minh in Hanoi wants $100 of bitcoin. An exchange is a
 * marketplace and a vault at once; his app balance is a promise. Then the
 * scale (≈300M users) and the four headlines this story will explain.
 */
import { useMemo } from "react";
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, mulberry32, smooth } from "@/lib/store";
import { C, Chip, Exchange, Label, Person } from "../svg";

const IDX = chapterIndex("problem");
const MINH = { x: 170, y: 560 };
const EX = { x: 640, y: 500 };

function Phone({ x, y, o, text, sub, k }: { x: number; y: number; o: number; text: string; sub: string; k: number }) {
  if (o <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y})`} opacity={o}>
      <rect x={-56} y={-96} width={112} height={192} rx={16} fill="#1e2026" />
      <rect x={-48} y={-80} width={96} height={160} rx={6} fill="#fbf9f3" />
      <circle cx={0} cy={-40} r={16} fill="#f7931a" />
      <text x={0} y={-34} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700 }}>
        ₿
      </text>
      <text x={0} y={6} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: 13 * Math.min(k, 1.3), fontWeight: 600 }}>
        {text}
      </text>
      <text x={0} y={26} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 9 * Math.min(k, 1.3) }}>
        {sub}
      </text>
    </g>
  );
}

export default function ProblemScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.problem;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const crowd = useMemo(() => {
    const r = mulberry32(11);
    return Array.from({ length: 220 }, () => {
      const a = r() * Math.PI * 2;
      const d = 250 + r() * 220;
      return { x: EX.x - 80 + Math.cos(a) * d * 0.9, y: EX.y + Math.sin(a) * d * 0.7, q: r() };
    });
  }, []);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, minh: 0, ex: 0, buy: 0, promise: 0, scale: 0, heads: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(0.02))
        .to(v, { minh: 1, duration: 0.1 }, at(0.06))
        .to(v, { ex: 1, duration: 0.1 }, at(0.2))
        .to(v, { buy: 1, duration: 0.14, ease: "none" }, at(0.26))
        .to(v, { promise: 1, duration: 0.08 }, at(0.38))
        .to(v, { scale: 1, duration: 0.18, ease: "none" }, at(0.46))
        .to(v, { heads: 1, duration: 0.2, ease: "none" }, at(0.7))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const minh = smooth(v.minh);
  const exO = smooth(v.ex);
  const buy = v.buy;
  const scale = smooth(v.scale);
  const heads = v.heads;
  const story = 1 - scale * 0.85;
  const users = Math.round(300 * clamp(v.scale * 1.1));

  // $100 travels Minh → market; a bitcoin travels market → vault
  const usdQ = smooth(clamp(buy / 0.5));
  const btcQ = smooth(clamp((buy - 0.5) / 0.5));

  const H = L.headlines;
  const hp = [
    { x: 250, y: 220 },
    { x: 760, y: 200 },
    { x: 230, y: 820 },
    { x: 770, y: 840 },
  ];

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* the crowd of other users */}
      {scale > 0.01 &&
        crowd.map((c, i) => (c.q < scale ? <circle key={i} cx={c.x} cy={c.y} r={4} fill={i % 7 === 0 ? C.yellow : C.lilac} opacity={0.35 * (1 - heads * 0.6)} /> : null))}

      <g opacity={story}>
        <Person x={MINH.x} y={MINH.y} color={C.sky} opacity={minh} s={lerp(0.7, 1, minh)} />
        <Label x={MINH.x} y={MINH.y + 90 + fs(4)} anchor="middle" color={C.ink} size={fs(12)} opacity={minh}>
          {L.minh}
        </Label>
        {k < 1.5 && (
          <Label x={MINH.x} y={MINH.y + 112} anchor="middle" size={10} opacity={minh} upper={false} spacing="0.02em">
            {L.minhSub}
          </Label>
        )}
        <Chip x={lerp(MINH.x + 80, EX.x - 60, usdQ)} y={lerp(MINH.y - 110, EX.y - 70, usdQ)} text="$100" color={C.mint} k={k} opacity={minh * (1 - btcQ)} />

        <Exchange x={EX.x} y={EX.y} s={1.25} opacity={exO} label={L.exchange} />
        <g opacity={exO}>
          <Label x={EX.x - 150} y={EX.y - 60} anchor="end" color={C.accent} size={fs(10)}>
            {L.market}
          </Label>
          <Label x={EX.x - 150} y={EX.y + 30} anchor="end" color={C.accent} size={fs(10)}>
            {L.vault}
          </Label>
          <line x1={EX.x - 146} x2={EX.x - 120} y1={EX.y - 64} y2={EX.y - 64} stroke={C.accent} />
          <line x1={EX.x - 146} x2={EX.x - 60} y1={EX.y + 26} y2={EX.y + 26} stroke={C.accent} />
        </g>
        {btcQ > 0 && btcQ < 1 && (
          <g transform={`translate(${lerp(EX.x + 30, EX.x, btcQ)},${lerp(EX.y - 110, EX.y + 22, btcQ)})`}>
            <circle r={16} fill="#f7931a" />
            <text y={6} textAnchor="middle" fill="#fff" style={{ fontSize: 16, fontWeight: 700 }}>
              ₿
            </text>
          </g>
        )}
        <Phone x={MINH.x + 10} y={300} o={smooth(v.promise)} text="0.0014 BTC" sub={L.app} k={k} />
        {v.promise > 0.01 && (
          <g opacity={smooth(v.promise)}>
            <path d={`M${MINH.x + 70},300 C400,300 520,420 ${EX.x - 40},${EX.y + 20}`} fill="none" stroke={C.accent} strokeWidth={1.6} strokeDasharray="5 6" />
            <Label x={420} y={330} anchor="middle" color={C.accent} size={fs(10)}>
              {L.promise}
            </Label>
          </g>
        )}
      </g>

      {/* scale */}
      {scale > 0.01 && (
        <g opacity={scale * (1 - smooth(clamp(heads * 2)) * 0.7)}>
          <text x={500} y={500} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(64), fontWeight: 600 }}>
            ≈{new Intl.NumberFormat(locale).format(users)}M
          </text>
          <Label x={500} y={540} anchor="middle" size={fs(11)} color={C.ink}>
            {L.users}
          </Label>
        </g>
      )}

      {/* the four headlines */}
      {heads > 0.01 &&
        H.map((h, i) => {
          const q = smooth(clamp(heads * 4 - i * 0.7));
          if (q <= 0.01) return null;
          const p = hp[i];
          const w = Math.min(380, h.length * fs(11) * 0.62 + 40);
          return (
            <g key={h} opacity={q} transform={`translate(${p.x},${p.y}) scale(${lerp(1.3, 1, q)}) rotate(${i % 2 ? 2 : -2})`}>
              <rect x={-w / 2} y={-28} width={w} height={56} rx={4} fill={C.paper} stroke={i === 0 || i === 3 ? C.warn : C.ink} strokeWidth={2} />
              <Label x={0} y={6} anchor="middle" color={i === 0 || i === 3 ? C.warn : C.ink} size={fs(11)}>
                {h}
              </Label>
            </g>
          );
        })}
    </g>
  );
}
