"use client";
/**
 * Drawing kit for the stage (viewBox 640 × 560): glass blocks (blockchains),
 * hexagon nodes, hexagon chain links, the LINK coin, labels and moving particles.
 */
import type { ReactNode } from "react";
import { C } from "@/data/coins/link/chapters";

export const VW = 640;
export const VH = 560;

export const vis = (on: boolean, extra = "") => `pv ${on ? "" : "pv-hide"} ${extra}`;

export function hexPts(cx: number, cy: number, r: number, rot = -90) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = ((rot + k * 60) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

export function Defs() {
  return (
    <defs>
      <linearGradient id="gFront" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#d6e5f6" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e9f1fb" />
      </linearGradient>
      <linearGradient id="gSide" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c9dbf1" />
        <stop offset="1" stopColor="#b5cbe8" />
      </linearGradient>
      <linearGradient id="gHex" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a78ea" />
        <stop offset="1" stopColor="#1f4cc4" />
      </linearGradient>
      <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#1a3a9c" floodOpacity="0.16" />
      </filter>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/** a blockchain: a sealed glass block */
export function Glass({
  x,
  y,
  w,
  h,
  label,
  sub,
  dim,
  children,
  accent = C.blue,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  sub?: string;
  dim?: boolean;
  children?: ReactNode;
  accent?: string;
}) {
  const d = Math.min(26, w * 0.16);
  const k = d * 0.62;
  return (
    <g opacity={dim ? 0.45 : 1} className="pv" filter="url(#soft)">
      <polygon points={`${x},${y} ${x + w},${y} ${x + w + d},${y - k} ${x + d},${y - k}`} fill="url(#gTop)" stroke="#a9c3e4" strokeWidth="1.2" />
      <polygon points={`${x + w},${y} ${x + w + d},${y - k} ${x + w + d},${y + h - k} ${x + w},${y + h}`} fill="url(#gSide)" stroke="#a9c3e4" strokeWidth="1.2" />
      <rect x={x} y={y} width={w} height={h} fill="url(#gFront)" stroke="#a9c3e4" strokeWidth="1.2" />
      <path d={`M${x + 8} ${y + h * 0.55} L${x + w * 0.5} ${y + 8}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
      <path d={`M${x + 8} ${y + h * 0.8} L${x + w * 0.75} ${y + 8}`} stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {label && (
        <text x={x + w / 2} y={y + h + 20} textAnchor="middle" fontSize="15" fontWeight="700" fill={C.ink}>
          {label}
        </text>
      )}
      {sub && (
        <text x={x + w / 2} y={y + h + 38} textAnchor="middle" fontSize="12.5" fill={C.mute}>
          {sub}
        </text>
      )}
      <rect x={x} y={y} width={w} height="4" fill={accent} opacity="0.85" />
      {children}
    </g>
  );
}

/** a node: solid hexagon */
export function Node({ x, y, r = 16, color = "url(#gHex)", label, ring, children }: { x: number; y: number; r?: number; color?: string; label?: string; ring?: string; children?: ReactNode }) {
  return (
    <g>
      {ring && <polygon points={hexPts(x, y, r + 5)} fill="none" stroke={ring} strokeWidth="3" />}
      <polygon points={hexPts(x, y, r)} fill={color} />
      <polygon points={hexPts(x, y, r * 0.45)} fill="#fff" opacity="0.9" />
      {label && (
        <text x={x} y={y + r + 15} textAnchor="middle" fontSize="12" fontWeight="600" fill={C.mute}>
          {label}
        </text>
      )}
      {children}
    </g>
  );
}

/** the LINK coin */
export function Coin({ x, y, r = 22, label = "LINK" }: { x: number; y: number; r?: number; label?: string }) {
  return (
    <g filter="url(#soft)">
      <polygon points={hexPts(x, y, r)} fill="url(#gHex)" />
      <polygon points={hexPts(x, y, r * 0.62)} fill="none" stroke="#fff" strokeWidth={r * 0.16} />
      {label && (
        <text x={x} y={y + r + 15} textAnchor="middle" fontSize="12" fontWeight="800" fill={C.blueDeep}>
          {label}
        </text>
      )}
    </g>
  );
}

/** a chain of hexagon rings between two points; links appear one by one when `on` */
export function Chain({ x1, y1, x2, y2, r = 9, color = C.blue, on = true, delay = 0, broken }: { x1: number; y1: number; x2: number; y2: number; r?: number; color?: string; on?: boolean; delay?: number; broken?: boolean }) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const n = Math.max(2, Math.floor(len / (r * 1.55)));
  return (
    <g>
      {Array.from({ length: n + 1 }, (_, i) => {
        const t = i / n;
        const cx = x1 + (x2 - x1) * t;
        const cy = y1 + (y2 - y1) * t;
        const gap = broken && Math.abs(t - 0.5) < 0.09;
        return (
          <polygon
            key={i}
            points={hexPts(cx, cy, r, i % 2 ? -90 : -60)}
            fill="none"
            stroke={color}
            strokeWidth={r * 0.42}
            strokeLinejoin="round"
            style={{ opacity: on && !gap ? 1 : 0, transition: `opacity .35s ease ${on ? delay + i * 0.035 : 0}s` }}
          />
        );
      })}
    </g>
  );
}

/** a dot travelling along a path forever */
export function Particle({ path, dur = 2, delay = 0, r = 4, color = C.blue }: { path: string; dur?: number; delay?: number; r?: number; color?: string }) {
  return (
    <circle r={r} fill={color}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

export function Pill({ x, y, text, color = C.blue, fill = "#fff", size = 13, anchor = "middle", bold = true }: { x: number; y: number; text: string; color?: string; fill?: string; size?: number; anchor?: "middle" | "start" | "end"; bold?: boolean }) {
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

export function Check({ x, y, r = 10, color = C.sign }: { x: number; y: number; r?: number; color?: string }) {
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

/* ---------- everyday objects (beginner edition) ---------- */

/** a simple person: head, body, optional badge colour (hexagon = Chainlink messenger) */
export function Person({ x, y, s = 1, color = "#5b8def", badge, skin = "#f3c9a5", mood }: { x: number; y: number; s?: number; color?: string; badge?: string; skin?: string; mood?: "bad" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={58} rx={20} ry={5} fill="#000" opacity={0.08} />
      <rect x={-17} y={16} width={34} height={42} rx={14} fill={color} />
      <circle cx={0} cy={0} r={14} fill={skin} />
      <path d="M-14 -3 C -12 -18, 12 -18, 14 -3 C 8 -9, -8 -9, -14 -3Z" fill="#3a2a22" />
      {mood === "bad" ? (
        <path d="M-5 6 q5 -4 10 0" stroke="#3a2a22" strokeWidth={1.8} fill="none" />
      ) : (
        <path d="M-5 5 q5 4 10 0" stroke="#3a2a22" strokeWidth={1.8} fill="none" />
      )}
      <circle cx={-5} cy={-1} r={1.6} fill="#3a2a22" />
      <circle cx={5} cy={-1} r={1.6} fill="#3a2a22" />
      {badge && <polygon points={hexPts(0, 33, 7)} fill={badge} stroke="#fff" strokeWidth={1.5} />}
    </g>
  );
}

/** a coin with a letter (ETH, LINK…) */
export function Token({ x, y, r = 14, label = "Ξ", color = "#6b7fd6" }: { x: number; y: number; r?: number; label?: string; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} stroke="#fff" strokeWidth={2} />
      <text x={x} y={y + r * 0.38} textAnchor="middle" fontSize={r * 1.05} fontWeight={800} fill="#fff">
        {label}
      </text>
    </g>
  );
}

/** a gold shop front with a price board */
export function GoldShop({ x, y, w = 150, label, price, color = "#d8a31a" }: { x: number; y: number; w?: number; label: string; price?: string; color?: string }) {
  return (
    <g filter="url(#soft)">
      <rect x={x} y={y + 26} width={w} height={110} rx={6} fill="#fffaf0" stroke={color} strokeWidth={2.5} />
      <path d={`M${x - 6} ${y + 30} L${x + w + 6} ${y + 30} L${x + w - 6} ${y} L${x + 6} ${y}Z`} fill={color} />
      {Array.from({ length: 5 }, (_, k) => (
        <rect key={k} x={x + 6 + (k * (w - 12)) / 5} y={y + 30} width={(w - 12) / 10} height={10} fill="#fff" opacity={0.7} />
      ))}
      <text x={x + w / 2} y={y + 20} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">
        {label}
      </text>
      {price && (
        <g>
          <rect x={x + 14} y={y + 52} width={w - 28} height={34} rx={6} fill="#fff" stroke={C.line} />
          <text x={x + w / 2} y={y + 75} textAnchor="middle" fontSize={15} fontWeight={800} fill={C.ink}>
            {price}
          </text>
        </g>
      )}
      <rect x={x + w / 2 - 16} y={y + 96} width={32} height={40} fill="#f1e2b8" stroke={color} />
    </g>
  );
}

/** a paper slip with optional stamps */
export function Slip({ x, y, w = 110, h = 64, text, stamps = 0, color = C.sign, fake }: { x: number; y: number; w?: number; h?: number; text: string; stamps?: number; color?: string; fake?: boolean }) {
  return (
    <g filter="url(#soft)">
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#fff" stroke={fake ? C.warn : color} strokeWidth={2.2} strokeDasharray={fake ? "5 4" : undefined} />
      <text x={x + w / 2} y={y + 26} textAnchor="middle" fontSize={15} fontWeight={800} fill={fake ? C.warn : C.ink}>
        {text}
      </text>
      {Array.from({ length: stamps }, (_, k) => (
        <circle key={k} cx={x + 12 + k * ((w - 24) / Math.max(1, stamps - 1))} cy={y + h - 14} r={6} fill="none" stroke={color} strokeWidth={2.2} />
      ))}
    </g>
  );
}

/** a big glass room (the blockchain) with a counter and a screen */
export function Room({ x, y, w, h, label, screen, screenColor = C.ink, blink, accent = C.blue, children }: { x: number; y: number; w: number; h: number; label?: string; screen?: string; screenColor?: string; blink?: boolean; accent?: string; children?: ReactNode }) {
  const cy = y + h * 0.68;
  return (
    <Glass x={x} y={y} w={w} h={h} label={label} accent={accent}>
      <rect x={x + w * 0.08} y={cy} width={w * 0.84} height={h * 0.12} rx={6} fill="#c9a77c" />
      <rect x={x + w * 0.08} y={cy + h * 0.12} width={w * 0.84} height={h * 0.16} fill="#b38e62" />
      {screen !== undefined && (
        <g>
          <rect x={x + w * 0.5} y={cy - h * 0.3} width={w * 0.38} height={h * 0.26} rx={8} fill="#fff" stroke={screenColor} strokeWidth={2.5} />
          <rect x={x + w * 0.68} y={cy - h * 0.04} width={8} height={h * 0.04} fill={C.mute} />
          <g className={blink ? "blink" : ""}>
            <text x={x + w * 0.69} y={cy - h * 0.15} textAnchor="middle" fontSize={Math.min(17, w * 0.06)} fontWeight={800} fill={screenColor}>
              {screen}
            </text>
          </g>
        </g>
      )}
      {children}
    </Glass>
  );
}
