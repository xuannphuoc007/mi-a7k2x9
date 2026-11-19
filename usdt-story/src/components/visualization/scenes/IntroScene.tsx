"use client";
/**
 * Intro. A round vault door with the Tether mark at its hub. As the reader
 * scrolls, the wheel turns slowly; "1 USD in ⇄ 1 USDT out" appears under it,
 * then the question: is the money really there?
 */
import { chapterIndex } from "@/data/coins/usdt/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { smooth } from "@/lib/store";
import { C, Logo } from "../svg";

const IDX = chapterIndex("intro");

export function VaultDoor({ cx, cy, R, spin = 0, idp = "vd" }: { cx: number; cy: number; R: number; spin?: number; idp?: string }) {
  const s = R / 262;
  const bolts = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2);
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  return (
    <g>
      <defs>
        <radialGradient id={`${idp}-door`} cx="42%" cy="36%" r="75%">
          <stop offset="0" stopColor="#fbfbf7" />
          <stop offset=".7" stopColor="#e3e6df" />
          <stop offset="1" stopColor="#cfd5cd" />
        </radialGradient>
        <linearGradient id={`${idp}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6cf8f" />
          <stop offset=".5" stopColor="#c49a3a" />
          <stop offset="1" stopColor="#9c7425" />
        </linearGradient>
        <radialGradient id={`${idp}-shadow`}>
          <stop offset="0.7" stopColor="#2a3a30" stopOpacity="0.14" />
          <stop offset="1" stopColor="#2a3a30" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy + 18 * s} r={300 * s} fill={`url(#${idp}-shadow)`} />
      <circle cx={cx} cy={cy} r={262 * s} fill={`url(#${idp}-rim)`} />
      <circle cx={cx} cy={cy} r={244 * s} fill={`url(#${idp}-door)`} />
      {[224, 212, 160].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r * s} fill="none" stroke="#c9cfc6" strokeWidth={r === 160 ? 2 : 1.2} />
      ))}
      {bolts.map((a, i) => (
        <g key={i}>
          <circle cx={cx + 234 * s * Math.cos(a)} cy={cy + 234 * s * Math.sin(a)} r={6 * s} fill="#b9c0b6" />
          <circle cx={cx + 234 * s * Math.cos(a) - 1.5 * s} cy={cy + 234 * s * Math.sin(a) - 1.5 * s} r={2.6 * s} fill="#f3f4ef" />
        </g>
      ))}
      <g transform={`rotate(${spin * 0.35},${cx},${cy})`}>
        {ticks.map((i) => {
          const a = (i / 60) * Math.PI * 2;
          const r1 = (i % 5 ? 202 : 194) * s;
          return <line key={i} x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)} x2={cx + 212 * s * Math.cos(a)} y2={cy + 212 * s * Math.sin(a)} stroke="#9aa398" strokeWidth={i % 5 ? 1 : 2} />;
        })}
      </g>
      <g transform={`rotate(${spin},${cx},${cy})`}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
          return (
            <g key={i}>
              <line x1={cx + 80 * s * Math.cos(a)} y1={cy + 80 * s * Math.sin(a)} x2={cx + 148 * s * Math.cos(a)} y2={cy + 148 * s * Math.sin(a)} stroke="#b3baae" strokeWidth={16 * s} strokeLinecap="round" />
              <circle cx={cx + 150 * s * Math.cos(a)} cy={cy + 150 * s * Math.sin(a)} r={14 * s} fill={`url(#${idp}-rim)`} />
            </g>
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={96 * s} fill="#f7f5ef" stroke="#b9c0b6" strokeWidth={2} />
      <Logo x={cx} y={cy + 4 * s} w={130 * s} h={130 * s} href="/img/tether.png" />
    </g>
  );
}

export default function IntroScene() {
  const { t } = useI18n();
  const L = t.scenes.problem;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 1, door: 0, spin: 0, flow: 0, q: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { door: 1, duration: 0.12 }, at(-0.2))
        .to(v, { spin: 140, duration: 0.9, ease: "none" }, at(0))
        .to(v, { flow: 1, duration: 0.12 }, at(0.24))
        .to(v, { q: 1, duration: 0.12 }, at(0.56))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const door = Math.max(0.15, smooth(v.door));
  const flow = smooth(v.flow);
  const q = smooth(v.q);
  const cx = 500, cy = 410;
  const ly = 830;
  return (
    <g opacity={v.vis * (1 - ex)}>
      <g opacity={door} transform={`translate(0,${(1 - door) * 20})`}>
        <rect x={cx - 310} y={cy - 310} width={620} height={620} rx={44} fill="#ebe9e0" stroke="#d6d3c6" strokeWidth={2} />
        <VaultDoor cx={cx} cy={cy} R={262} spin={v.spin} idp="intro" />
      </g>
      {/* 1 USD ⇄ 1 USDT */}
      <g opacity={flow} transform={`translate(0,${(1 - flow) * 16})`}>
        <line x1={cx - 310} x2={cx + 310} y1={ly - 70} y2={ly - 70} stroke={C.line} strokeWidth={2} />
        <text x={cx - 310} y={ly} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(44, 72), fontWeight: 450 }}>
          {L.inVal}
        </text>
        <text x={cx - 308} y={ly + big(14, 26) * 1.7} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 22), letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {L.inSub}
        </text>
        <text x={cx} y={ly - 8} textAnchor="middle" fill={C.brass} style={{ fontFamily: "var(--font-serif)", fontSize: big(34, 56) }}>
          ⇄
        </text>
        <text x={cx + 310} y={ly} textAnchor="end" fill={C.gd} style={{ fontFamily: "var(--font-serif)", fontSize: big(44, 72), fontWeight: 450 }}>
          {L.outVal}
        </text>
        <text x={cx + 308} y={ly + big(14, 26) * 1.7} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 22), letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {L.outSub}
        </text>
      </g>
      {/* the question */}
      {q > 0.01 && (
        <g opacity={q}>
          <g transform={`translate(${cx + 236},${cy - 236}) scale(${0.7 + 0.3 * q})`}>
            <circle r={58} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
            <text y={26} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: 76, fontWeight: 500 }}>
              ?
            </text>
          </g>
          <text x={cx} y={mobile ? 60 : 74} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: big(26, 44) }}>
            {L.question}
          </text>
        </g>
      )}
    </g>
  );
}
