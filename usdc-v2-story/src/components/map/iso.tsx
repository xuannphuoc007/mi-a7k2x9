"use client";
/**
 * Isometric drawing kit for the USDC map. World grid (i, j, z) is projected to
 * flat SVG coordinates with a 2:1 diamond: +i runs right-down, +j runs
 * left-down, +z goes up. Every shape is plain SVG so the camera can zoom freely.
 */
import type { ReactNode } from "react";
import { asset } from "@/lib/asset";

export const TW = 40; // half tile width
export const TH = 20; // half tile height

export type XY = [number, number];
export const P = (i: number, j: number, z = 0): XY => [(i - j) * TW, (i + j) * TH - z];
const pts = (a: XY[]) => a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** Palette: soft daylight pastels, USDC blue as the only strong colour. */
export const K = {
  sea: "#d9ebf3",
  seaLine: "#c3dceb",
  land: "#eef4e6",
  landSide: "#d7e3c9",
  landEdge: "#c6d6b4",
  road: "#fbfaf6",
  roadLine: "#e2dccb",
  ink: "#1d2b3a",
  mute: "#6d7a88",
  usdc: "#2775ca",
  usdcDark: "#1b5aa6",
  usdcSoft: "#dbe9f8",
  usdt: "#26a17b",
  cash: "#5fae7d",
  gold: "#e3b341",
  red: "#d9534a",
  warm: "#f4d27a",
  roof: "#b8613f",
  white: "#ffffff",
  stone: "#ece8df",
  stoneSide: "#d8d2c4",
  stoneDark: "#c6bfae",
  grey: "#a9b3bd",
};

/** shade a hex colour by factor (<1 darker) */
export function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
  return `rgb(${c.join(",")})`;
}

/** Flat diamond/rectangle on the ground */
export function Tile({ i, j, w = 1, d = 1, z = 0, fill, stroke, sw = 1, opacity = 1, dash }: { i: number; j: number; w?: number; d?: number; z?: number; fill: string; stroke?: string; sw?: number; opacity?: number; dash?: string }) {
  return <polygon points={pts([P(i, j, z), P(i + w, j, z), P(i + w, j + d, z), P(i, j + d, z)])} fill={fill} stroke={stroke} strokeWidth={sw} opacity={opacity} strokeDasharray={dash} strokeLinejoin="round" />;
}

/** Iso cuboid: top + the two faces turned to the viewer */
export function Box({ i, j, w = 1, d = 1, h, z = 0, color, top, opacity = 1, stroke = "rgba(29,43,58,0.10)", noTop = false }: { i: number; j: number; w?: number; d?: number; h: number; z?: number; color: string; top?: string; opacity?: number; stroke?: string; noTop?: boolean }) {
  if (opacity <= 0.01) return null;
  const hh = Math.max(0, h);
  return (
    <g opacity={opacity}>
      <polygon points={pts([P(i, j + d, z), P(i + w, j + d, z), P(i + w, j + d, z + hh), P(i, j + d, z + hh)])} fill={shade(color, 0.9)} stroke={stroke} strokeWidth={0.8} strokeLinejoin="round" />
      <polygon points={pts([P(i + w, j, z), P(i + w, j + d, z), P(i + w, j + d, z + hh), P(i + w, j, z + hh)])} fill={shade(color, 0.78)} stroke={stroke} strokeWidth={0.8} strokeLinejoin="round" />
      {!noTop && <polygon points={pts([P(i, j, z + hh), P(i + w, j, z + hh), P(i + w, j + d, z + hh), P(i, j + d, z + hh)])} fill={top ?? color} stroke={stroke} strokeWidth={0.8} strokeLinejoin="round" />}
    </g>
  );
}

/** Window rows on the two visible faces of a box */
export function Windows({ i, j, w, d, h, z = 0, rows, color = "#ffffff", opacity = 0.75 }: { i: number; j: number; w: number; d: number; h: number; z?: number; rows: number; color?: string; opacity?: number }) {
  const out: ReactNode[] = [];
  const gap = h / (rows + 1);
  for (let r = 1; r <= rows; r++) {
    const zz = z + gap * r;
    for (let k = 0; k < Math.max(1, Math.round(w * 2)); k++) {
      const a = i + (k + 0.25) / 2, b = a + 0.25;
      if (b > i + w) break;
      out.push(<polygon key={`f${r}-${k}`} points={pts([P(a, j + d, zz - 5), P(b, j + d, zz - 5), P(b, j + d, zz + 5), P(a, j + d, zz + 5)])} fill={color} opacity={opacity} />);
    }
    for (let k = 0; k < Math.max(1, Math.round(d * 2)); k++) {
      const a = j + (k + 0.25) / 2, b = a + 0.25;
      if (b > j + d) break;
      out.push(<polygon key={`s${r}-${k}`} points={pts([P(i + w, a, zz - 5), P(i + w, b, zz - 5), P(i + w, b, zz + 5), P(i + w, a, zz + 5)])} fill={color} opacity={opacity * 0.8} />);
    }
  }
  return <g>{out}</g>;
}

/** Gable roof along i over a w×d footprint at height z */
export function Roof({ i, j, w, d, z, rise = 26, color = K.roof }: { i: number; j: number; w: number; d: number; z: number; rise?: number; color?: string }) {
  const m = j + d / 2;
  return (
    <g>
      <polygon points={pts([P(i, j + d, z), P(i + w, j + d, z), P(i + w, m, z + rise), P(i, m, z + rise)])} fill={shade(color, 0.92)} stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
      <polygon points={pts([P(i + w, j, z), P(i + w, j + d, z), P(i + w, m, z + rise)])} fill={shade(color, 0.7)} stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
      <polygon points={pts([P(i, j, z), P(i + w, j, z), P(i + w, m, z + rise), P(i, m, z + rise)])} fill={color} stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
    </g>
  );
}

/** A land slab (island) with a little earth edge */
export function Island({ i, j, w, d, fill = K.land, depth = 14 }: { i: number; j: number; w: number; d: number; fill?: string; depth?: number }) {
  return (
    <g>
      <polygon points={pts([P(i - 0.15, j + d + 0.15, 0), P(i + w + 0.15, j + d + 0.15, 0), P(i + w + 0.15, j + d + 0.15, -depth), P(i - 0.15, j + d + 0.15, -depth)])} fill={K.landSide} />
      <polygon points={pts([P(i + w + 0.15, j - 0.15, 0), P(i + w + 0.15, j + d + 0.15, 0), P(i + w + 0.15, j + d + 0.15, -depth), P(i + w + 0.15, j - 0.15, -depth)])} fill={K.landEdge} />
      <polygon points={pts([P(i - 0.15, j - 0.15), P(i + w + 0.15, j - 0.15), P(i + w + 0.15, j + d + 0.15), P(i - 0.15, j + d + 0.15)])} fill={fill} />
    </g>
  );
}

/** A straight road strip between two grid points (axis-aligned) */
export function Road({ a, b, width = 1, color = K.road }: { a: [number, number]; b: [number, number]; width?: number; color?: string }) {
  const [i0, j0] = a, [i1, j1] = b;
  const hw = width / 2;
  let poly: XY[];
  if (j0 === j1) poly = [P(Math.min(i0, i1), j0 - hw), P(Math.max(i0, i1), j0 - hw), P(Math.max(i0, i1), j0 + hw), P(Math.min(i0, i1), j0 + hw)];
  else poly = [P(i0 - hw, Math.min(j0, j1)), P(i0 + hw, Math.min(j0, j1)), P(i0 + hw, Math.max(j0, j1)), P(i0 - hw, Math.max(j0, j1))];
  const [x0, y0] = P(i0, j0), [x1, y1] = P(i1, j1);
  return (
    <g>
      <polygon points={pts(poly)} fill={color} stroke={K.roadLine} strokeWidth={1} />
      <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={K.roadLine} strokeWidth={2} strokeDasharray="10 12" />
    </g>
  );
}

/** Screen-facing token: USDC blue coin with a $; optional USDT variant */
export function Coin({ x, y, r = 11, kind = "usdc", opacity = 1 }: { x: number; y: number; r?: number; kind?: "usdc" | "usdt" | "usd"; opacity?: number }) {
  if (opacity <= 0.01) return null;
  if (kind === "usd")
    return (
      <g opacity={opacity}>
        <rect x={x - r * 1.4} y={y - r * 0.8} width={r * 2.8} height={r * 1.6} rx={2} fill={K.cash} stroke="#3f8a5e" strokeWidth={1} />
        <circle cx={x} cy={y} r={r * 0.45} fill="none" stroke="#e8f5ec" strokeWidth={1.2} />
      </g>
    );
  return (
    <g opacity={opacity}>
      <ellipse cx={x} cy={y + r * 1.05} rx={r * 0.9} ry={r * 0.3} fill="rgba(29,43,58,0.12)" />
      <circle cx={x} cy={y} r={r} fill={kind === "usdc" ? K.usdc : K.usdt} />
      {kind === "usdc" && <circle cx={x} cy={y} r={r * 0.72} fill="none" stroke="#fff" strokeWidth={r * 0.1} opacity={0.85} />}
      <text x={x} y={y + r * 0.38} textAnchor="middle" fill="#fff" style={{ fontSize: r * 1.05, fontWeight: 800, fontFamily: "var(--font-sans)" }}>
        {kind === "usdc" ? "$" : "₮"}
      </text>
    </g>
  );
}

/** A small person facing the viewer */
export function Person({ x, y, s = 1, shirt = K.usdc, hair = "#2b2b33", opacity = 1, wave = 0 }: { x: number; y: number; s?: number; shirt?: string; hair?: string; opacity?: number; wave?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <ellipse cx={0} cy={0} rx={13} ry={5} fill="rgba(29,43,58,0.15)" />
      <rect x={-6} y={-14} width={5} height={14} rx={2} fill="#3c4756" />
      <rect x={1} y={-14} width={5} height={14} rx={2} fill="#3c4756" />
      <path d="M-10,-14 C-10,-34 -6,-38 0,-38 C6,-38 10,-34 10,-14 Z" fill={shirt} />
      <circle cx={0} cy={-46} r={8.5} fill="#f2c9a5" />
      <path d="M-9,-47 C-9,-57 9,-57 9,-47 C6,-52 -5,-52 -9,-47Z" fill={hair} />
      {wave > 0 && <path d={`M9,-32 L${16 + wave * 4},${-46 - wave * 5}`} stroke={shirt} strokeWidth={5} strokeLinecap="round" />}
    </g>
  );
}

export function Tree({ x, y, s = 1, kind = "round" }: { x: number; y: number; s?: number; kind?: "round" | "palm" | "gum" }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={12} ry={4.5} fill="rgba(29,43,58,0.12)" />
      <rect x={-2} y={-18} width={4} height={18} fill="#8a6a4a" />
      {kind === "round" && <circle cx={0} cy={-26} r={13} fill="#9cc98a" />}
      {kind === "round" && <circle cx={-5} cy={-30} r={6} fill="#b5d9a3" />}
      {kind === "gum" && <ellipse cx={0} cy={-30} rx={10} ry={17} fill="#a9c4a2" />}
      {kind === "palm" && (
        <g>
          {[-50, -15, 20, 55].map((a) => (
            <ellipse key={a} cx={0} cy={-20} rx={14} ry={4} fill="#8fc07a" transform={`rotate(${a} 0 -20) translate(10 0)`} />
          ))}
        </g>
      )}
    </g>
  );
}

/** A red Hội An lantern hanging from a point */
export function Lantern({ x, y, s = 1, color = "#e2483d" }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="lantern-bob">
      <line x1={0} y1={-8} x2={0} y2={0} stroke="#7a5a3a" strokeWidth={1} />
      <rect x={-3.5} y={0} width={7} height={2.5} fill={K.gold} />
      <ellipse cx={0} cy={9} rx={7} ry={7.5} fill={color} />
      <ellipse cx={-2} cy={7} rx={2.2} ry={4} fill="#fff" opacity={0.25} />
      <rect x={-3.5} y={15.5} width={7} height={2.5} fill={K.gold} />
      <line x1={0} y1={18} x2={0} y2={24} stroke={K.gold} strokeWidth={1.5} />
    </g>
  );
}

export function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="flame-flicker">
      <path d="M0,-30 C9,-17 16,-9 13,4 C11,14 5,19 0,19 C-5,19 -11,14 -13,4 C-16,-9 -5,-14 0,-30Z" fill="#ff9a62" />
      <path d="M0,-12 C5,-5 8,0 6,6 C5,12 2,14 0,14 C-2,14 -5,12 -6,6 C-8,0 -4,-4 0,-12Z" fill="#ffd77a" />
    </g>
  );
}

/** A screen-facing label pill anchored at a world point (pointer below) */
export function Pin({ x, y, text, sub, color = K.ink, bg = "#ffffff", fs = 15, opacity = 1, anchor = "middle", pointer = true }: { x: number; y: number; text: string; sub?: string; color?: string; bg?: string; fs?: number; opacity?: number; anchor?: "middle" | "start" | "end"; pointer?: boolean }) {
  if (opacity <= 0.01) return null;
  const w = Math.max(text.length * fs * 0.56, sub ? sub.length * fs * 0.46 : 0) + fs * 1.4;
  const h = sub ? fs * 2.7 : fs * 1.75;
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "start" ? x - fs * 0.9 : x - w + fs * 0.9;
  const y0 = y - h - (pointer ? 9 : 0);
  return (
    <g opacity={opacity} style={{ pointerEvents: "none" }}>
      <rect x={x0} y={y0 + 2} width={w} height={h} rx={h / 2.4} fill="rgba(29,43,58,0.10)" />
      <rect x={x0} y={y0} width={w} height={h} rx={h / 2.4} fill={bg} stroke="rgba(29,43,58,0.10)" />
      {pointer && <path d={`M${x - 6},${y0 + h - 0.5} L${x},${y - 1} L${x + 6},${y0 + h - 0.5} Z`} fill={bg} />}
      <text x={x0 + w / 2} y={y0 + fs * 1.18} textAnchor="middle" fill={color} style={{ fontSize: fs, fontWeight: 700, fontFamily: "var(--font-sans)" }}>
        {text}
      </text>
      {sub && (
        <text x={x0 + w / 2} y={y0 + fs * 2.25} textAnchor="middle" fill={K.mute} style={{ fontSize: fs * 0.78, fontWeight: 500, fontFamily: "var(--font-sans)" }}>
          {sub}
        </text>
      )}
    </g>
  );
}

/** A billboard on two legs, facing the viewer */
export function Board({ x, y, w, h, children, opacity = 1, color = "#ffffff", border = "rgba(29,43,58,0.15)" }: { x: number; y: number; w: number; h: number; children?: ReactNode; opacity?: number; color?: string; border?: string }) {
  if (opacity <= 0.01) return null;
  return (
    <g opacity={opacity}>
      <ellipse cx={x} cy={y} rx={w * 0.38} ry={7} fill="rgba(29,43,58,0.10)" />
      <rect x={x - w * 0.3 - 2} y={y - 34} width={4} height={34} fill="#9aa4ae" />
      <rect x={x + w * 0.3 - 2} y={y - 34} width={4} height={34} fill="#9aa4ae" />
      <rect x={x - w / 2} y={y - 34 - h} width={w} height={h} rx={10} fill={color} stroke={border} strokeWidth={1.5} />
      <g transform={`translate(${x - w / 2},${y - 34 - h})`}>{children}</g>
    </g>
  );
}

export function Img({ x, y, w, href, opacity = 1 }: { x: number; y: number; w: number; href: string; opacity?: number }) {
  if (opacity <= 0.01) return null;
  return <image href={asset(href)} x={x - w / 2} y={y - w / 2} width={w} height={w} opacity={opacity} />;
}

export function T({ x, y, children, fs = 14, color = K.ink, weight = 600, anchor = "middle", opacity = 1 }: { x: number; y: number; children: ReactNode; fs?: number; color?: string; weight?: number; anchor?: "middle" | "start" | "end"; opacity?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} opacity={opacity} style={{ fontSize: fs, fontWeight: weight, fontFamily: "var(--font-sans)" }}>
      {children}
    </text>
  );
}
