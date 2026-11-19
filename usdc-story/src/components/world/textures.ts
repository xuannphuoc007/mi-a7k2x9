import * as THREE from "three";

/** Small procedural canvas textures so objects read as real things (no external image files). */
const cache = new Map<string, THREE.CanvasTexture>();

function make(key: string, w: number, h: number, draw: (x: CanvasRenderingContext2D, w: number, h: number) => void, repeat?: [number, number]) {
  if (cache.has(key)) return cache.get(key)!;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  cache.set(key, t);
  return t;
}

/** Top of a strapped bundle of banknotes */
export const cashTex = () =>
  make("cash", 256, 128, (x, w, h) => {
    x.fillStyle = "#7fa868";
    x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(30,70,40,.4)";
    for (let i = 0; i < 18; i++) {
      x.beginPath();
      x.ellipse(w / 2, h / 2, 40 + i * 3, 20 + i * 2, 0, 0, Math.PI * 2);
      x.stroke();
    }
    x.strokeStyle = "#3d5a48";
    x.lineWidth = 4;
    x.strokeRect(8, 8, w - 16, h - 16);
    x.fillStyle = "#3d5a48";
    x.font = "700 34px Georgia";
    x.fillText("1", 18, 44);
    x.fillText("1", w - 38, h - 18);
    // paper strap
    x.fillStyle = "#f3ead2";
    x.fillRect(w / 2 - 22, 0, 44, h);
    x.fillStyle = "#8a6d3b";
    x.font = "600 12px monospace";
    x.save();
    x.translate(w / 2 + 5, h / 2 + 22);
    x.rotate(-Math.PI / 2);
    x.fillText("$10,000", 0, 0);
    x.restore();
  });

/** Side of the bundle: stacked paper edges */
export const cashSideTex = () =>
  make("cashSide", 128, 64, (x, w, h) => {
    x.fillStyle = "#93b77f";
    x.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      x.fillStyle = y % 4 ? "rgba(80,100,85,.18)" : "rgba(255,255,255,.4)";
      x.fillRect(0, y, w, 1);
    }
    x.fillStyle = "#f3ead2";
    x.fillRect(w / 2 - 11, 0, 22, h);
  });

/** A US Treasury certificate folder (stylised) */
export const docTex = (label: string) =>
  make("doc" + label, 256, 320, (x, w, h) => {
    x.fillStyle = "#f4efe1";
    x.fillRect(0, 0, w, h);
    x.strokeStyle = "#2b4c7e";
    x.lineWidth = 6;
    x.strokeRect(10, 10, w - 20, h - 20);
    x.lineWidth = 1.5;
    x.strokeRect(20, 20, w - 40, h - 40);
    x.fillStyle = "#2b4c7e";
    x.textAlign = "center";
    x.font = "700 22px Georgia";
    x.fillText("U.S. TREASURY", w / 2, 62);
    x.font = "600 30px Georgia";
    x.fillText(label, w / 2, 118);
    x.beginPath();
    x.arc(w / 2, 196, 34, 0, Math.PI * 2);
    x.lineWidth = 3;
    x.stroke();
    x.font = "600 14px monospace";
    x.fillText("ILLUSTRATIVE", w / 2, 270);
    for (let i = 0; i < 5; i++) {
      x.fillStyle = "rgba(43,76,126,.25)";
      x.fillRect(40, 140 + i * 6 + (i > 2 ? 110 : 0), w - 80, 2);
    }
  });

/** Envelope with a printed address block; the seal is separate geometry */
export const envelopeTex = () =>
  make("env", 256, 160, (x, w, h) => {
    x.fillStyle = "#f6f1e4";
    x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(120,100,70,.35)";
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(0, 0);
    x.lineTo(w / 2, h * 0.58);
    x.lineTo(w, 0);
    x.stroke();
    x.fillStyle = "#2775ca";
    x.font = "600 13px monospace";
    x.fillText("BURN · 1,000 USDC", 18, h - 40);
    x.fillStyle = "#50627e";
    x.fillText("ETH → SOL", 18, h - 20);
  });

/** Office-tower glass facade */
export const facadeTex = (tint: string, key: string) =>
  make("fac" + key, 128, 256, (x, w, h) => {
    x.fillStyle = tint;
    x.fillRect(0, 0, w, h);
    for (let r = 0; r < 16; r++)
      for (let c = 0; c < 6; c++) {
        const lit = Math.sin(r * 12.9 + c * 78.2) > 0.3;
        x.fillStyle = lit ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.18)";
        x.fillRect(6 + c * 20, 6 + r * 15.5, 15, 11);
      }
  });

/** Polished stone floor tiles */
export const floorTex = () =>
  make(
    "floor",
    512,
    512,
    (x, w, h) => {
      x.fillStyle = "#d9cdb6";
      x.fillRect(0, 0, w, h);
      for (let i = 0; i < 1400; i++) {
        x.fillStyle = `rgba(${150 + (i % 40)},${160 + (i % 30)},${175 + (i % 20)},.07)`;
        x.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 30, 1);
      }
      x.strokeStyle = "rgba(140,115,80,.45)";
      x.lineWidth = 2;
      for (let k = 0; k <= 4; k++) {
        x.beginPath();
        x.moveTo((k * w) / 4, 0);
        x.lineTo((k * w) / 4, h);
        x.stroke();
        x.beginPath();
        x.moveTo(0, (k * h) / 4);
        x.lineTo(w, (k * h) / 4);
        x.stroke();
      }
    },
    [6, 6],
  );

/** A wall of safe-deposit boxes */
export const lockerTex = () =>
  make(
    "locker",
    256,
    256,
    (x, w, h) => {
      x.fillStyle = "#8f7444";
      x.fillRect(0, 0, w, h);
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++) {
          const X0 = c * 64 + 3;
          const Y0 = r * 64 + 3;
          const g = x.createLinearGradient(X0, Y0, X0 + 58, Y0 + 58);
          g.addColorStop(0, "#e2c27f");
          g.addColorStop(1, "#b38d48");
          x.fillStyle = g;
          x.fillRect(X0, Y0, 58, 58);
          x.fillStyle = "#6b5129";
          x.beginPath();
          x.arc(X0 + 44, Y0 + 29, 4, 0, Math.PI * 2);
          x.fill();
          x.fillRect(X0 + 10, Y0 + 26, 16, 6);
        }
    },
    [10, 3],
  );

/** Plain painted sign */
export const signTex = (text: string, bg: string, fg: string, w = 512, h = 128, font = "700 54px 'Space Grotesk', Arial") =>
  make(`sign${text}${bg}${fg}`, w, h, (x) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, w, h);
    x.fillStyle = fg;
    x.font = font;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, w / 2, h / 2 + 2);
  });

/** Bank wire slip */
export const wireTex = () =>
  make("wire", 256, 160, (x, w, h) => {
    x.fillStyle = "#f8f4e8";
    x.fillRect(0, 0, w, h);
    x.fillStyle = "#2b4c7e";
    x.fillRect(0, 0, w, 30);
    x.fillStyle = "#ffffff";
    x.font = "700 16px monospace";
    x.fillText("WIRE TRANSFER · USD", 12, 21);
    x.fillStyle = "#2b4c7e";
    x.font = "600 14px monospace";
    x.fillText("TO: CIRCLE (ISSUER)", 12, 58);
    x.fillText("REF: MINT USDC", 12, 82);
    x.font = "700 26px Georgia";
    x.fillText("$ 1,000.00", 12, 128);
  });

/** Asphalt road with a dashed centre line */
export const roadTex = () =>
  make(
    "road",
    64,
    256,
    (x, w, h) => {
      x.fillStyle = "#b9c0c9";
      x.fillRect(0, 0, w, h);
      x.fillStyle = "#ffffff";
      for (let y = 0; y < h; y += 64) x.fillRect(w / 2 - 2, y, 4, 34);
      x.fillStyle = "#e8ecf0";
      x.fillRect(0, 0, 3, h);
      x.fillRect(w - 3, 0, 3, h);
    },
    [1, 1],
  );

/** Face of a bridged "USDC.e" IOU token (grey, deliberately different) */
export const usdceTex = () =>
  make("usdce", 256, 256, (x, w, h) => {
    x.fillStyle = "#9aa4b1";
    x.beginPath();
    x.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    x.fill();
    x.strokeStyle = "#ffffff";
    x.lineWidth = 10;
    x.beginPath();
    x.arc(w / 2, h / 2, w / 2 - 26, 0, Math.PI * 2);
    x.stroke();
    x.fillStyle = "#ffffff";
    x.font = "700 52px 'Space Grotesk', Arial";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText("USDC.e", w / 2, h / 2);
  });

/** Big LED-style price board, redrawn by the scene when the value changes. */
export function boardCanvas() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return { c, t, x: c.getContext("2d")! };
}
