/**
 * Procedural, hand-drawn-looking faces for each conceptual layer of the coin.
 * Drawn on canvas once (after fonts load) and used as Three.js textures.
 */
import * as THREE from "three";
import type { LayerDef } from "@/data/coins/xrp/anatomy";
import { mulberry32 } from "@/lib/store";

const INK = "#171c1e";
const MUTE = "#777e80";
const ACCENT = "#327f76";
const WARN = "#bb6946";
const LINE = "#c7cfcc";

type Ctx = CanvasRenderingContext2D;

function circleClip(ctx: Ctx, S: number, r: number, hole: number) {
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, r, 0, Math.PI * 2);
  if (hole > 0) ctx.arc(S / 2, S / 2, r * hole, 0, Math.PI * 2, true);
  ctx.clip("evenodd");
}

/** Wobbly pencil line between two points. */
function pencil(ctx: Ctx, x1: number, y1: number, x2: number, y2: number, rnd: () => number, jitter = 0.8) {
  const n = Math.max(2, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 18));
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x1 + (x2 - x1) * t + (rnd() - 0.5) * jitter;
    const y = y1 + (y2 - y1) * t + (rnd() - 0.5) * jitter;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function ringText(ctx: Ctx, S: number, text: string, radius: number, size: number, color = INK, spacing = 1) {
  ctx.save();
  ctx.translate(S / 2, S / 2);
  ctx.fillStyle = color;
  ctx.font = `500 ${size}px "JetBrains Mono Variable", ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const chars = [...text];
  const circ = 2 * Math.PI * radius;
  const step = (size * 0.62 * spacing) / circ;
  const total = Math.min(chars.length, Math.floor(1 / step));
  for (let i = 0; i < total; i++) {
    const a = -Math.PI / 2 + i * step * Math.PI * 2;
    ctx.save();
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(chars[i % chars.length], 0, -radius);
    ctx.restore();
  }
  ctx.restore();
}

function hatch(ctx: Ctx, S: number, angle: number, gap: number, color: string, alpha: number, width = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.translate(S / 2, S / 2);
  ctx.rotate(angle);
  for (let x = -S; x < S; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x, -S);
    ctx.lineTo(x, S);
    ctx.stroke();
  }
  ctx.restore();
}

function baseDisc(ctx: Ctx, S: number, r: number, tint: string, hole: number) {
  ctx.save();
  circleClip(ctx, S, r, hole);
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, S, S);
  // paper speckle
  const rnd = mulberry32(7);
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = INK;
  for (let i = 0; i < 2200; i++) ctx.fillRect(rnd() * S, rnd() * S, 1.2, 1.2);
  ctx.restore();
  // outline
  ctx.save();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, r - 1.5, 0, Math.PI * 2);
  ctx.stroke();
  if (hole > 0) {
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, r * hole + 1, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/** shading crescent: pencil hatching only on the lower-right part of the disc */
function crescentShade(ctx: Ctx, S: number, r: number, hole: number) {
  ctx.save();
  circleClip(ctx, S, r, hole);
  ctx.beginPath();
  ctx.rect(0, 0, S, S);
  ctx.arc(S / 2 - r * 0.22, S / 2 - r * 0.24, r * 1.02, 0, Math.PI * 2, true);
  ctx.clip("evenodd");
  hatch(ctx, S, -0.75, 7, INK, 0.16, 1.1);
  ctx.restore();
}

const glyphs: Record<LayerDef["glyph"], (ctx: Ctx, S: number, r: number, def: LayerDef) => void> = {
  shell(ctx, S, r) {
    const cx = S / 2;
    // metallic-paper gradient
    ctx.save();
    circleClip(ctx, S, r, 0);
    const g = ctx.createRadialGradient(cx - r * 0.3, cx - r * 0.35, r * 0.1, cx, cx, r);
    g.addColorStop(0, "#f6f5ee");
    g.addColorStop(0.65, "#e4e3da");
    g.addColorStop(1, "#cfd0c6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.restore();
    crescentShade(ctx, S, r, 0);
    const rnd = mulberry32(11);
    ctx.strokeStyle = INK;
    // engraved rings
    for (const [f, w] of [
      [0.985, 2.4],
      [0.9, 1.4],
      [0.885, 0.8],
      [0.64, 1.6],
    ] as const) {
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.arc(cx, cx, r * f, 0, Math.PI * 2);
      ctx.stroke();
    }
    // tick marks (milling)
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 180; i++) {
      const a = (i / 180) * Math.PI * 2;
      const r1 = r * 0.905;
      const r2 = r * (i % 15 === 0 ? 0.955 : 0.94);
      pencil(ctx, cx + Math.cos(a) * r1, cx + Math.sin(a) * r1, cx + Math.cos(a) * r2, cx + Math.sin(a) * r2, rnd, 0.6);
    }
    ringText(ctx, S, "XRP LEDGER · NATIVE DIGITAL ASSET · 100 000 000 000 · GENESIS 2012 · ", r * 0.765, r * 0.062, INK, 1.12);
    // lattice inside the inner ring (abstract ledger cells)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cx, r * 0.62, 0, Math.PI * 2);
    ctx.clip();
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    for (let x = -r; x < r; x += r * 0.09) {
      ctx.beginPath();
      ctx.moveTo(cx + x, cx - r);
      ctx.lineTo(cx + x + r * 0.5, cx + r);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + x, cx - r);
      ctx.lineTo(cx + x - r * 0.5, cx + r);
      ctx.stroke();
    }
    ctx.restore();
    // monogram
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `400 ${r * 0.5}px "Newsreader Variable", Georgia, serif`;
    ctx.fillText("XRP", cx, cx + r * 0.02);
    ctx.font = `500 ${r * 0.05}px "JetBrains Mono Variable", monospace`;
    ctx.fillStyle = MUTE;
    ctx.fillText("ANATOMY · PLATE I", cx, cx + r * 0.36);
    ctx.fillText("Ø 1 XRP = 10⁶ DROPS", cx, cx - r * 0.34);
  },
  asset(ctx, S, r) {
    const cx = S / 2;
    ctx.fillStyle = ACCENT;
    for (let y = -r; y < r; y += r * 0.07) {
      for (let x = -r; x < r; x += r * 0.07) {
        const ox = (Math.round(y / (r * 0.07)) % 2) * r * 0.035;
        const d = Math.hypot(x + ox, y);
        if (d < r * 0.82) {
          ctx.globalAlpha = 0.25 + 0.6 * (1 - d / r);
          ctx.beginPath();
          ctx.arc(cx + x + ox, cx + y, r * 0.011, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
    ringText(ctx, S, "1 XRP = 1 000 000 DROPS · NO ISSUER · NO TRUST LINE · ", r * 0.9, r * 0.055, ACCENT, 1.1);
    ctx.fillStyle = INK;
    ctx.font = `400 ${r * 0.2}px "Newsreader Variable", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("XRP", cx, cx);
  },
  ledger(ctx, S, r) {
    const cx = S / 2;
    const rnd = mulberry32(21);
    ctx.save();
    circleClip(ctx, S, r * 0.96, 0);
    ctx.font = `500 ${r * 0.045}px "JetBrains Mono Variable", monospace`;
    ctx.textBaseline = "middle";
    const rowH = r * 0.085;
    let row = 0;
    for (let y = cx - r; y < cx + r; y += rowH, row++) {
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y + rowH / 2);
      ctx.lineTo(S, y + rowH / 2);
      ctx.stroke();
      const addr = "r" + Array.from({ length: 6 }, () => "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[Math.floor(rnd() * 58)]).join("");
      const bal = (rnd() * 9000 + 20).toFixed(2);
      ctx.fillStyle = row % 4 === 0 ? ACCENT : INK;
      ctx.fillText(`${addr}…   ${bal} XRP   seq ${Math.floor(rnd() * 900)}`, cx - r * 0.82, y);
    }
    ctx.restore();
  },
  signature(ctx, S, r, def) {
    const cx = S / 2;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const rr = r * (def.hole + 1) * 0.5;
    for (let i = 0; i <= 720; i++) {
      const a = (i / 720) * Math.PI * 2;
      const w = Math.sin(a * 23) * r * 0.05 + Math.sin(a * 7 + 1) * r * 0.03;
      const x = cx + Math.cos(a) * (rr + w);
      const y = cx + Math.sin(a) * (rr + w);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ringText(ctx, S, "SIGNED · SEQUENCE · ED25519 / SECP256K1 · ", r * 0.92, r * 0.05, MUTE, 1.15);
  },
  p2p(ctx, S, r) {
    const cx = S / 2;
    const rnd = mulberry32(5);
    const pts: [number, number][] = [];
    for (let i = 0; i < 46; i++) {
      const a = rnd() * Math.PI * 2;
      const d = Math.sqrt(rnd()) * r * 0.86;
      pts.push([cx + Math.cos(a) * d, cx + Math.sin(a) * d]);
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    pts.forEach((p, i) => {
      const near = pts
        .map((q, j) => [Math.hypot(p[0] - q[0], p[1] - q[1]), j] as const)
        .sort((a, b) => a[0] - b[0])
        .slice(1, 3);
      near.forEach(([, j]) => {
        if (j > i) pencil(ctx, p[0], p[1], pts[j][0], pts[j][1], rnd, 1);
      });
    });
    ctx.globalAlpha = 1;
    pts.forEach((p, i) => {
      ctx.fillStyle = i % 7 === 0 ? ACCENT : "#f7f7f2";
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(p[0], p[1], r * 0.022, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  },
  validators(ctx, S, r, def) {
    const cx = S / 2;
    const rr = r * (def.hole + 1) * 0.5;
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = r * 0.05;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(cx, cx, rr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.8);
    ctx.stroke();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + (i / 12) * Math.PI * 2;
      ctx.fillStyle = i < 10 ? INK : "#f7f7f2";
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * rr, cx + Math.sin(a) * rr, r * 0.035, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ringText(ctx, S, "UNL · 80% SUPERMAJORITY · ", r * 0.93, r * 0.05, MUTE, 1.2);
  },
  fees(ctx, S, r) {
    const cx = S / 2;
    const rnd = mulberry32(9);
    for (let i = 0; i < 520; i++) {
      const a = rnd() * Math.PI * 2;
      const d = Math.pow(rnd(), 0.7) * r * 0.88;
      ctx.globalAlpha = (d / r) * 0.9;
      ctx.fillStyle = WARN;
      ctx.fillRect(cx + Math.cos(a) * d, cx + Math.sin(a) * d, 2.4, 2.4);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cx, r * 0.16, 0, Math.PI * 2);
    ctx.moveTo(cx - r * 0.2, cx + r * 0.2);
    ctx.lineTo(cx + r * 0.2, cx - r * 0.2);
    ctx.stroke();
    ringText(ctx, S, "10 DROPS · DESTROYED · NOT PAID TO ANYONE · ", r * 0.62, r * 0.05, WARN, 1.1);
  },
  routing(ctx, S, r) {
    const cx = S / 2;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, cx, Math.abs(i) * r * 0.15 + 1, r * 0.95, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - r, cx + i * r * 0.15);
      ctx.lineTo(cx + r, cx + i * r * 0.15);
      ctx.stroke();
    }
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.6, cx - r * 0.35);
    ctx.bezierCurveTo(cx - r * 0.1, cx - r * 0.7, cx + r * 0.3, cx + r * 0.1, cx + r * 0.5, cx + r * 0.45);
    ctx.stroke();
    ctx.setLineDash([]);
    for (const [x, y] of [
      [-0.6, -0.35],
      [0.5, 0.45],
    ]) {
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(cx + x * r, cx + y * r, r * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  bridge(ctx, S, r) {
    const cx = S / 2;
    const pts = [
      [cx - r * 0.62, cx + r * 0.42, "USD"],
      [cx, cx - r * 0.62, "XRP"],
      [cx + r * 0.62, cx + r * 0.42, "MXN"],
    ] as const;
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = r * 0.06;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[1][0], pts[1][1]);
    ctx.lineTo(pts[2][0], pts[2][1]);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[2][0], pts[2][1]);
    ctx.stroke();
    ctx.setLineDash([]);
    for (const [x, y, l] of pts) {
      ctx.fillStyle = "#f7f7f2";
      ctx.beginPath();
      ctx.arc(x, y, r * 0.13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.font = `600 ${r * 0.07}px "JetBrains Mono Variable", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(l, x, y);
    }
  },
  dex(ctx, S, r) {
    const cx = S / 2;
    for (let i = 0; i < 9; i++) {
      const h = r * 0.065;
      const y = cx - r * 0.62 + i * h * 1.45;
      const wb = r * (0.18 + i * 0.05);
      const wa = r * (0.16 + i * 0.055);
      ctx.fillStyle = ACCENT;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(cx - wb - r * 0.03, y, wb, h);
      ctx.fillStyle = WARN;
      ctx.fillRect(cx + r * 0.03, y, wa, h);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cx - r * 0.7);
    ctx.lineTo(cx, cx + r * 0.7);
    ctx.stroke();
  },
  rwa(ctx, S, r) {
    const cx = S / 2;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    // building
    const bx = cx - r * 0.42, by = cx + r * 0.25;
    ctx.strokeRect(bx - r * 0.12, by - r * 0.42, r * 0.24, r * 0.42);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) ctx.strokeRect(bx - r * 0.08 + i * r * 0.06, by - r * 0.37 + j * r * 0.09, r * 0.03, r * 0.05);
    // bond certificate
    const dx = cx + r * 0.05, dy = cx - r * 0.38;
    ctx.fillStyle = "#f7f7f2";
    ctx.fillRect(dx - r * 0.16, dy, r * 0.32, r * 0.22);
    ctx.strokeRect(dx - r * 0.16, dy, r * 0.32, r * 0.22);
    ctx.beginPath();
    ctx.arc(dx + r * 0.1, dy + r * 0.15, r * 0.035, 0, Math.PI * 2);
    ctx.fillStyle = ACCENT;
    ctx.fill();
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.moveTo(dx - r * 0.12, dy + r * (0.05 + k * 0.045));
      ctx.lineTo(dx + r * 0.05, dy + r * (0.05 + k * 0.045));
      ctx.stroke();
    }
    // gold bar
    const gx = cx + r * 0.38, gy = cx + r * 0.22;
    ctx.beginPath();
    ctx.moveTo(gx - r * 0.16, gy);
    ctx.lineTo(gx - r * 0.1, gy - r * 0.1);
    ctx.lineTo(gx + r * 0.1, gy - r * 0.1);
    ctx.lineTo(gx + r * 0.16, gy);
    ctx.closePath();
    ctx.fillStyle = "#e6d39a";
    ctx.fill();
    ctx.stroke();
    // token hexagons in the middle
    for (let k = 0; k < 3; k++) {
      const hx = cx - r * 0.12 + k * r * 0.12, hy = cx + r * 0.05;
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a / 6) * Math.PI * 2;
        const px = hx + Math.cos(ang) * r * 0.05, py = hy + Math.sin(ang) * r * 0.05;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = k === 1 ? ACCENT : "#f7f7f2";
      ctx.fill();
      ctx.stroke();
    }
    ringText(ctx, S, "REAL-WORLD ASSETS · BONDS · PROPERTY · GOLD · RLUSD · ", r * 0.86, r * 0.05, MUTE, 1.12);
  },
  supply(ctx, S, r, def) {
    const cx = S / 2;
    const r1 = r * def.hole + 4;
    const r2 = r * 0.97 - 4;
    for (let i = 0; i < 100; i++) {
      const a1 = -Math.PI / 2 + (i / 100) * Math.PI * 2 + 0.004;
      const a2 = -Math.PI / 2 + ((i + 1) / 100) * Math.PI * 2 - 0.004;
      ctx.beginPath();
      ctx.arc(cx, cx, r2, a1, a2);
      ctx.arc(cx, cx, r1, a2, a1, true);
      ctx.closePath();
      ctx.fillStyle = i < 55 ? INK : "#f7f7f2";
      ctx.globalAlpha = i < 55 ? 0.75 : 1;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  },
  risk(ctx, S, r, def) {
    ctx.save();
    circleClip(ctx, S, r * 0.99, def.hole);
    hatch(ctx, S, 0.8, 16, WARN, 0.55, 5);
    ctx.restore();
    ringText(ctx, S, "RISK · LIQUIDITY · COUNTERPARTY · REGULATION · INFRASTRUCTURE · ", r * 0.85, r * 0.045, INK, 1.1);
  },
};

export function makeLayerTexture(def: LayerDef, size = 1024): THREE.CanvasTexture {
  const S = size;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const r = S / 2 - 2;
  if (def.glyph !== "shell") {
    baseDisc(ctx, S, r, def.tint, def.hole);
    ctx.save();
    circleClip(ctx, S, r - 2, def.hole);
    glyphs[def.glyph](ctx, S, r, def);
    ctx.restore();
    crescentShade(ctx, S, r, def.hole);
  } else {
    glyphs.shell(ctx, S, r, def);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Knurled edge texture for the coin rim. */
export function makeRimTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#d4d5cc";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = INK;
  ctx.globalAlpha = 0.55;
  for (let x = 0; x < c.width; x += 6) {
    ctx.beginPath();
    ctx.moveTo(x, 6);
    ctx.lineTo(x, c.height - 6);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillRect(0, 0, c.width, 2);
  ctx.fillRect(0, c.height - 2, c.width, 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/** Soft round sprite for particles. */
export function makeDotTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.55, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
