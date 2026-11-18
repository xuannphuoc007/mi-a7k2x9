"use client";
/** Small SVG drawing primitives shared by every scene. Colours come from the
 * stage's CSS variables so a scene can flip to the dark technical theme. */
import type { ReactNode, SVGProps } from "react";
import { clamp, lerp } from "@/lib/store";
import { asset } from "@/lib/asset";
export type Pt = { x: number; y: number };

export const C = {
  ink: "var(--s-ink)",
  paper: "var(--s-paper)",
  mute: "var(--s-mute)",
  line: "var(--s-line)",
  accent: "var(--s-accent)",
  warn: "var(--s-warn)",
  accentSoft: "var(--s-accent-soft)",
  violet: "var(--s-violet, #4b4f5c)",
  lilac: "#4b4f5c",
  mint: "#0f9a68",
  peach: "#e0662f",
  sky: "#2f6fd6",
  yellow: "#f0b90b",
  gold: "#c99400",
};

/** Draw-on stroke: renders `p` (0..1) of a path using pathLength normalisation. */
export function DrawPath({ d, p, width = 1.2, color = C.ink, dash, opacity = 1, className, cap = "round" }: {
  d: string; p: number; width?: number; color?: string; dash?: string; opacity?: number; className?: string; cap?: "round" | "butt";
}) {
  const q = clamp(p);
  if (q <= 0) return null;
  return (
    <path
      d={d}
      pathLength={dash ? undefined : 1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dash ?? `${q} 1.0001`}
      strokeLinecap={cap}
      opacity={dash ? q * opacity : opacity}
      className={className}
    />
  );
}
export type { SVGProps };

export function Label({ x, y, children, anchor = "start", color = C.mute, size = 11, opacity = 1, weight = 500, spacing = "0.1em", upper = true }: {
  x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; color?: string; size?: number; opacity?: number; weight?: number; spacing?: string; upper?: boolean;
}) {
  if (opacity <= 0.01) return null;
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={color}
      opacity={opacity}
      style={{ fontFamily: "var(--font-mono)", fontSize: size, letterSpacing: spacing, textTransform: upper ? "uppercase" : "none", fontWeight: weight }}
    >
      {children}
    </text>
  );
}

/** Technical callout: dot, elbow leader line and a label. */
export function Callout({ from, to, text, sub, p = 1, anchor = "start", color = C.ink }: {
  from: Pt; to: Pt; text: string; sub?: string; p?: number; anchor?: "start" | "end"; color?: string;
}) {
  if (p <= 0.01) return null;
  const elbowX = to.x;
  const d = `M${from.x},${from.y} L${lerp(from.x, elbowX, 0.6)},${to.y} L${to.x},${to.y}`;
  const tx = anchor === "start" ? to.x + 6 : to.x - 6;
  return (
    <g opacity={Math.min(1, p * 1.5)}>
      <circle cx={from.x} cy={from.y} r={2.6} fill={color} />
      <DrawPath d={d} p={p} width={0.8} color={C.mute} />
      <Label x={tx} y={to.y + 4} anchor={anchor} color={color} opacity={clamp(p * 2 - 0.6)}>
        {text}
      </Label>
      {sub && (
        <Label x={tx} y={to.y + 18} anchor={anchor} color={C.mute} size={10} opacity={clamp(p * 2 - 0.8)} upper={false} spacing="0.02em">
          {sub}
        </Label>
      )}
    </g>
  );
}

export const mix = (a: Pt, b: Pt, t: number): Pt => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
export const along = (pts: Pt[], t: number): Pt => {
  if (pts.length === 1) return pts[0];
  const segs = pts.length - 1;
  const q = clamp(t) * segs;
  const i = Math.min(segs - 1, Math.floor(q));
  return mix(pts[i], pts[i + 1], q - i);
};

/** Sketchy hatch pattern + paper texture defs used by scenes */
export function Defs() {
  return (
    <defs>
      <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="var(--s-ink)" strokeWidth="0.8" opacity="0.35" />
      </pattern>
      <pattern id="hatch-warn" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="7" stroke="var(--s-warn)" strokeWidth="2.2" opacity="0.55" />
      </pattern>
      <pattern id="hatch-accent" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <line x1="0" y1="0" x2="0" y2="5" stroke="var(--s-accent)" strokeWidth="1" opacity="0.5" />
      </pattern>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 Z" fill="#1e2026" />
      </marker>
      <radialGradient id="glow">
        <stop offset="0%" stopColor="var(--s-accent)" stopOpacity="0.55" />
        <stop offset="100%" stopColor="var(--s-accent)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="glow-warn">
        <stop offset="0%" stopColor="var(--s-warn)" stopOpacity="0.5" />
        <stop offset="100%" stopColor="var(--s-warn)" stopOpacity="0" />
      </radialGradient>
      <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
      </filter>
    </defs>
  );
}

/** Small document glyph for a signed transaction */
export function TxCard({ x, y, s = 1, signed = 0, label = "PAYMENT", opacity = 1 }: { x: number; y: number; s?: number; signed?: number; label?: string; opacity?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <rect x={-34} y={-22} width={68} height={44} rx={3} fill={C.paper} stroke={C.ink} strokeWidth={1.2} />
      <line x1={-26} y1={-10} x2={18} y2={-10} stroke={C.ink} strokeWidth={0.8} opacity={0.5} />
      <line x1={-26} y1={-2} x2={8} y2={-2} stroke={C.ink} strokeWidth={0.8} opacity={0.5} />
      <text x={-26} y={-13} style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: "0.12em" }} fill={C.mute}>{label}</text>
      {signed > 0 && (
        <path
          d="M-26,12 C-20,4 -16,18 -10,10 S0,4 4,12 S14,16 22,6"
          pathLength={1}
          strokeDasharray={`${clamp(signed)} 1`}
          fill="none"
          stroke={C.accent}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

/** A simple person: round head, rounded shoulders. */
export function Person({ x, y, s = 1, color = C.lilac, opacity = 1, wave = 0 }: { x: number; y: number; s?: number; color?: string; opacity?: number; wave?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <ellipse cx={0} cy={58} rx={46} ry={8} fill={C.ink} opacity={0.08} />
      <path d="M-40,56 C-40,18 -24,6 0,6 C24,6 40,18 40,56 Z" fill={color} />
      <circle cx={0} cy={-22} r={22} fill={color} />
      <circle cx={-7} cy={-24} r={2.4} fill={C.paper} />
      <circle cx={7} cy={-24} r={2.4} fill={C.paper} />
      <path d="M-7,-13 Q0,-8 7,-13" stroke={C.paper} strokeWidth={2} fill="none" strokeLinecap="round" />
      {wave > 0 && <path d={`M30,20 L${46 + wave * 6},${-6 - wave * 4}`} stroke={color} strokeWidth={10} strokeLinecap="round" />}
    </g>
  );
}

/** A money chip: rounded pill with an amount. */
export function Chip({ x, y, text, color = C.mint, s = 1, opacity = 1, k = 1 }: { x: number; y: number; text: string; color?: string; s?: number; opacity?: number; k?: number }) {
  if (opacity <= 0.01) return null;
  const fsz = 14 * k;
  const w = Math.max(56, text.length * fsz * 0.62 + 22);
  const h = fsz + 14;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} />
      <text x={0} y={fsz * 0.36} textAnchor="middle" fill={color === "#f0b90b" || color === "#fcf0c8" ? "#1e2026" : "#ffffff"} style={{ fontFamily: "var(--font-mono)", fontSize: fsz, fontWeight: 600 }}>
        {text}
      </text>
    </g>
  );
}

/** A small flame (burn). `t` animates the flicker. */
export function Flame({ x, y, s = 1, t = 0, opacity = 1 }: { x: number; y: number; s?: number; t?: number; opacity?: number }) {
  if (opacity <= 0.01) return null;
  const f = Math.sin(t * 9) * 0.06;
  return (
    <g transform={`translate(${x},${y}) scale(${s * (1 + f)},${s * (1 - f)})`} opacity={opacity}>
      <path d="M0,-46 C14,-26 26,-14 22,6 C19,22 8,30 0,30 C-8,30 -19,22 -22,6 C-26,-14 -8,-22 0,-46Z" fill="#ff8a5c" />
      <path d="M0,-20 C8,-8 12,0 10,10 C8,20 3,24 0,24 C-3,24 -8,20 -10,10 C-12,0 -6,-6 0,-20Z" fill="#ffd27a" />
    </g>
  );
}

/** An original BNB coin glyph (not the trademark logo): a gold disc with a ring and the ticker. */
export function BnbGlyph({ x, y, s = 1, opacity = 1 }: { x: number; y: number; s?: number; opacity?: number; label?: string }) {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <image href={asset("/img/bnb-coin.png")} x={-34} y={-34} width={68} height={68} />
    </g>
  );
}

/** A small building with a vault door — the exchange. */
export function Exchange({ x, y, s = 1, opacity = 1, label }: { x: number; y: number; s?: number; opacity?: number; label?: string }) {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <path d="M-120,-70 L0,-130 L120,-70 Z" fill="#1e2026" />
      <image href={asset("/img/binance-logo.png")} x={-28} y={-106} width={56} height={31} />
      <rect x={-110} y={-70} width={220} height={170} fill="#ffffff" stroke="#1e2026" strokeWidth={2} />
      {[-80, -40, 40, 80].map((cx) => (
        <rect key={cx} x={cx - 9} y={-56} width={18} height={140} fill="#f0b90b" opacity={0.45} />
      ))}
      <circle cx={0} cy={18} r={36} fill="#fcf0c8" stroke="#1e2026" strokeWidth={2} />
      <circle cx={0} cy={18} r={7} fill="#1e2026" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={0} y1={18} x2={Math.cos((i * Math.PI) / 3) * 26} y2={18 + Math.sin((i * Math.PI) / 3) * 26} stroke="#1e2026" strokeWidth={2} />
      ))}
      {label && (
        <text x={0} y={128} textAnchor="middle" fill="#1e2026" style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.14em" }}>
          {label}
        </text>
      )}
    </g>
  );
}

/** A photo or drawing cropped to a circle (used for images supplied by the site owner). */
export function Portrait({ x, y, r, href, id, opacity = 1, fy = 0.38 }: { x: number; y: number; r: number; href: string; id: string; opacity?: number; fy?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={id}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <image href={href} x={x - r * 1.15} y={y - r * 2 * fy * 1.6} width={r * 2.3} height={r * 3.07} preserveAspectRatio="xMidYMin slice" clipPath={`url(#${id})`} />
      <circle cx={x} cy={y} r={r} fill="none" stroke="#1e2026" strokeWidth={2} />
    </g>
  );
}
