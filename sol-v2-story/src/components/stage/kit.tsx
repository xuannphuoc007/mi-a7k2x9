"use client";
/**
 * Drawing kit for the Ship of Light stage (viewBox 640 × 560): the light ship, beams,
 * phones, validators, block tiles, a light star field, labels and small helpers.
 */
import type { ReactNode } from "react";
import { C } from "@/data/coins/sol/chapters";

export const VW = 640;
export const VH = 560;

export const vis = (on: boolean, extra = "") => `pv ${on ? "" : "pv-hide"} ${extra}`;

export function Defs() {
  return (
    <defs>
      <linearGradient id="gSol" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.purple} />
        <stop offset="1" stopColor={C.green} />
      </linearGradient>
      <linearGradient id="gSolD" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor={C.purple} />
        <stop offset="0.55" stopColor="#5f8ff0" />
        <stop offset="1" stopColor={C.green} />
      </linearGradient>
      <linearGradient id="gTrail" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor={C.purple} stopOpacity="0.95" />
        <stop offset="0.5" stopColor="#4fb6e8" stopOpacity="0.55" />
        <stop offset="1" stopColor={C.green} stopOpacity="0" />
      </linearGradient>
      <linearGradient id="gHull" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#ece4ff" />
      </linearGradient>
      <linearGradient id="gCard" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#f8f5ff" />
      </linearGradient>
      <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="8" height="8" fill="#fde3e7" />
        <rect width="3" height="8" fill={C.warn} opacity="0.55" />
      </pattern>
      <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#5b2bb3" floodOpacity="0.14" />
      </filter>
      <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/** faint star dots — deterministic so every render looks the same */
export function Stars({ n = 46, seed = 7 }: { n?: number; seed?: number }) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return (
    <g aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const x = rnd() * 640;
        const y = rnd() * 560;
        const r = 0.8 + rnd() * 1.6;
        const col = i % 3 === 0 ? C.green : i % 3 === 1 ? C.purple : "#7aa7ff";
        return (
          <circle key={i} cx={x} cy={y} r={r} fill={col} opacity={0.28}>
            {i % 4 === 0 && <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${2.4 + (i % 5)}s`} repeatCount="indefinite" />}
          </circle>
        );
      })}
    </g>
  );
}

/** speed lines streaming past (behind the ship) */
export function Streaks({ y0 = 60, y1 = 500, n = 9, dur = 1.6 }: { y0?: number; y1?: number; n?: number; dur?: number }) {
  return (
    <g aria-hidden opacity={0.55}>
      {Array.from({ length: n }, (_, i) => {
        const y = y0 + ((y1 - y0) * ((i * 37) % n)) / (n - 1);
        const len = 60 + ((i * 29) % 90);
        return (
          <line key={i} x1={700} y1={y} x2={700 + len} y2={y} stroke="url(#gSol)" strokeWidth={i % 2 ? 1.6 : 2.6} strokeLinecap="round">
            <animateTransform attributeName="transform" type="translate" from="0 0" to={`${-900} 0`} dur={`${dur + (i % 4) * 0.35}s`} begin={`${-i * 0.37}s`} repeatCount="indefinite" />
          </line>
        );
      })}
    </g>
  );
}

/**
 * The ship of light: a sleek white hull pointing right, with three slanted light bars
 * (the Solana mark's shape) streaming behind it as a trail.
 */
export function Ship({ x, y, s = 1, trail = 1, bob = true }: { x: number; y: number; s?: number; trail?: number; bob?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g>
        {bob && <animateTransform attributeName="transform" type="translate" values="0 0; 0 -5; 0 0" dur="3.2s" repeatCount="indefinite" />}
        {/* trail: three slanted bars */}
        {[-16, 0, 16].map((dy, i) => (
          <polygon
            key={i}
            points={`${-44} ${dy - 5} ${-44 - 150 * trail} ${dy - 5} ${-52 - 150 * trail} ${dy + 5} ${-52} ${dy + 5}`}
            fill="url(#gTrail)"
            opacity={0.9 - i * 0.1}
          >
            <animate attributeName="opacity" values={`${0.55 + i * 0.1};0.95;${0.55 + i * 0.1}`} dur={`${0.9 + i * 0.25}s`} repeatCount="indefinite" />
          </polygon>
        ))}
        {/* engine glow */}
        <circle cx={-44} cy={0} r={13} fill={C.green} opacity={0.35} filter="url(#glow)" />
        {/* wings */}
        <path d="M-8 -12 L-34 -40 L-14 -40 L18 -12 Z" fill="url(#gSolD)" />
        <path d="M-8 12 L-34 40 L-14 40 L18 12 Z" fill="url(#gSolD)" />
        {/* hull */}
        <path d="M70 0 C 48 -18, 8 -22, -40 -16 L-48 0 L-40 16 C 8 22, 48 18, 70 0 Z" fill="url(#gHull)" stroke={C.purple} strokeWidth={2.2} filter="url(#soft)" />
        <path d="M-36 -4 L54 -4 L60 0 L54 4 L-36 4 Z" fill="url(#gSol)" opacity={0.9} />
        {/* canopy */}
        <path d="M34 -6 C 40 -14, 54 -10, 60 -3 L34 -3 Z" fill="#bfe9ff" stroke={C.cyan} strokeWidth={1.4} />
      </g>
    </g>
  );
}

/** a small ship icon (for pointers) */
export function MiniShip({ x, y, s = 0.32 }: { x: number; y: number; s?: number }) {
  return <Ship x={x} y={y} s={s} trail={0.45} bob={false} />;
}

/** a beam of light from A to B, with a bright pulse travelling along it */
export function Beam({ x1, y1, x2, y2, on = true, dur = 1.2, delay = 0, width = 4, color }: { x1: number; y1: number; x2: number; y2: number; on?: boolean; dur?: number; delay?: number; width?: number; color?: string }) {
  const d = `M${x1} ${y1} L${x2} ${y2}`;
  return (
    <g className={vis(on)}>
      <path d={d} stroke={color ?? "url(#gSol)"} strokeWidth={width} strokeLinecap="round" opacity={0.5} />
      <path d={d} stroke={color ?? "url(#gSol)"} strokeWidth={width * 0.45} strokeLinecap="round" className="flow" />
      <circle r={width * 1.5} fill="#fff" stroke={color ?? C.purple} strokeWidth={2} filter="url(#glow)">
        <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} />
      </circle>
    </g>
  );
}

/** a dot travelling along a path forever */
export function Particle({ path, dur = 2, delay = 0, r = 4, color = C.purple }: { path: string; dur?: number; delay?: number; r?: number; color?: string }) {
  return (
    <circle r={r} fill={color}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

/** a phone with a screen line and a caption under it */
export function Phone({ x, y, label, screen, sub, color = C.purple, ok }: { x: number; y: number; label?: string; screen?: string; sub?: string; color?: string; ok?: boolean }) {
  return (
    <g filter="url(#soft)">
      <rect x={x - 34} y={y - 58} width={68} height={116} rx={14} fill="#fff" stroke={color} strokeWidth={2.4} />
      <rect x={x - 27} y={y - 46} width={54} height={86} rx={7} fill={ok ? "#e5fbf1" : C.lilac} />
      <rect x={x - 9} y={y + 45} width={18} height={4} rx={2} fill={C.line} />
      {screen && (
        <text x={x} y={y - 6} textAnchor="middle" fontSize={screen.length > 7 ? 11.5 : 14} fontWeight={800} fill={ok ? C.mint : C.ink}>
          {screen}
        </text>
      )}
      {sub && (
        <text x={x} y={y + 14} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={C.mute}>
          {sub}
        </text>
      )}
      {label && (
        <text x={x} y={y + 80} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
          {label}
        </text>
      )}
    </g>
  );
}

/** a validator: a small server box with status lights */
export function Validator({ x, y, s = 1, color = C.purple, label, lead, dim }: { x: number; y: number; s?: number; color?: string; label?: string; lead?: boolean; dim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? 0.4 : 1}>
      {lead && <rect x={-31} y={-31} width={62} height={62} rx={16} fill="none" stroke={color} strokeWidth={3} strokeDasharray="6 5" className="spin-slow" />}
      <rect x={-22} y={-22} width={44} height={44} rx={10} fill="#fff" stroke={color} strokeWidth={2.4} filter="url(#soft)" />
      {[-9, 0, 9].map((dy) => (
        <g key={dy}>
          <rect x={-14} y={dy - 3} width={20} height={6} rx={2} fill={C.lilac} />
          <circle cx={11} cy={dy} r={2.6} fill={color} />
        </g>
      ))}
      {label && (
        <text x={0} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          {label}
        </text>
      )}
    </g>
  );
}

/** a block tile */
export function Tile({ x, y, w = 28, h = 28, color = C.purple, label, faint }: { x: number; y: number; w?: number; h?: number; color?: string; label?: string; faint?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={faint ? "#fff" : color} stroke={color} strokeWidth={1.8} opacity={faint ? 0.9 : 0.92} />
      {label && (
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={faint ? color : "#fff"}>
          {label}
        </text>
      )}
    </g>
  );
}

/** a white rounded card */
export function Card({ x, y, w, h, stroke = C.line, children, fill = "url(#gCard)" }: { x: number; y: number; w: number; h: number; stroke?: string; children?: ReactNode; fill?: string }) {
  return (
    <g filter="url(#soft)">
      <rect x={x} y={y} width={w} height={h} rx={16} fill={fill} stroke={stroke} strokeWidth={1.6} />
      {children}
    </g>
  );
}

export function Pill({ x, y, text, color = C.purple, fill = "#fff", size = 13, anchor = "middle", bold = true }: { x: number; y: number; text: string; color?: string; fill?: string; size?: number; anchor?: "middle" | "start" | "end"; bold?: boolean }) {
  const w = text.length * size * 0.58 + 18;
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "start" ? x : x - w;
  return (
    <g>
      <rect x={x0} y={y - size * 0.95} width={w} height={size * 1.75} rx={size * 0.87} fill={fill} stroke={color} strokeWidth="1.6" />
      <text x={x0 + w / 2} y={y + size * 0.3} textAnchor="middle" fontSize={size} fontWeight={bold ? 700 : 500} fill={color}>
        {text}
      </text>
    </g>
  );
}

export function T({ x, y, children, size = 14, color = C.ink, weight = 600, anchor = "middle", className }: { x: number; y: number; children: ReactNode; size?: number; color?: string; weight?: number; anchor?: "middle" | "start" | "end"; className?: string }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={color} textAnchor={anchor} className={className}>
      {children}
    </text>
  );
}

export function Check({ x, y, r = 10, color = C.mint }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} />
      <path d={`M${x - r * 0.45} ${y} l${r * 0.32} ${r * 0.34} l${r * 0.6} -${r * 0.66}`} stroke="#fff" strokeWidth={r * 0.26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export function Cross({ x, y, r = 10, color = C.warn }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} />
      <path d={`M${x - r * 0.38} ${y - r * 0.38} l${r * 0.76} ${r * 0.76} m0 -${r * 0.76} l-${r * 0.76} ${r * 0.76}`} stroke="#fff" strokeWidth={r * 0.24} strokeLinecap="round" />
    </g>
  );
}

/** the SOL coin, drawn (no image) so it stays crisp */
export function SolCoin({ x, y, r = 30 }: { x: number; y: number; r?: number }) {
  const k = r / 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} filter="url(#soft)">
      <circle r={30} fill="#1b1530" />
      <circle r={27} fill="none" stroke="url(#gSolD)" strokeWidth={2.5} />
      {[-9, 0, 9].map((dy, i) => (
        <polygon key={i} points={i === 1 ? `-11 ${dy - 3} 15 ${dy - 3} 11 ${dy + 3} -15 ${dy + 3}` : `-15 ${dy - 3} 11 ${dy - 3} 15 ${dy + 3} -11 ${dy + 3}`} fill="url(#gSolD)" />
      ))}
    </g>
  );
}
