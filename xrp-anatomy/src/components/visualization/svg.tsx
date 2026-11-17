"use client";
/** Small SVG drawing primitives shared by every scene. Colours come from the
 * stage's CSS variables so a scene can flip to the dark technical theme. */
import type { ReactNode, SVGProps } from "react";
import { clamp, lerp } from "@/lib/store";
import type { Pt } from "@/data/coins/xrp/layouts";

export const C = {
  ink: "var(--s-ink)",
  paper: "var(--s-paper)",
  mute: "var(--s-mute)",
  line: "var(--s-line)",
  accent: "var(--s-accent)",
  warn: "var(--s-warn)",
  accentSoft: "var(--s-accent-soft)",
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
