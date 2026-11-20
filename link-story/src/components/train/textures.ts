/**
 * Canvas textures: the LED destination sign and the platform signs.
 * Drawn with the page font (Lexend has Vietnamese glyphs) so signs follow the language toggle.
 */
import * as THREE from "three";

const FONT = "Lexend, 'Lexend Variable', system-ui, sans-serif";

export async function fontsReady() {
  try {
    await Promise.all([document.fonts.load(`700 64px Lexend`), document.fonts.load(`500 40px Lexend`)]);
  } catch {}
}

function tex(c: HTMLCanvasElement, aniso = 8) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  t.needsUpdate = true;
  return t;
}

/** LED destination sign: amber dots on black, e.g. "LINK ⬡ 06 LUNA, 2022" */
export function destinationSign(text: string) {
  const W = 1024,
    H = 160;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d")!;
  x.fillStyle = "#07090b";
  x.fillRect(0, 0, W, H);
  // draw text into an offscreen mask, then sample it as LED dots
  const m = document.createElement("canvas");
  m.width = W;
  m.height = H;
  const mx = m.getContext("2d")!;
  mx.fillStyle = "#fff";
  mx.font = `700 92px ${FONT}`;
  mx.textAlign = "center";
  mx.textBaseline = "middle";
  let size = 92;
  while (mx.measureText(text).width > W - 60 && size > 40) {
    size -= 4;
    mx.font = `700 ${size}px ${FONT}`;
  }
  mx.fillText(text, W / 2, H / 2 + 4);
  const d = mx.getImageData(0, 0, W, H).data;
  const step = 7;
  for (let yy = step / 2; yy < H; yy += step) {
    for (let xx = step / 2; xx < W; xx += step) {
      const i = (Math.floor(yy) * W + Math.floor(xx)) * 4;
      const on = d[i] > 90;
      x.beginPath();
      x.arc(xx, yy, step * 0.36, 0, Math.PI * 2);
      x.fillStyle = on ? "#ffb347" : "#1a1612";
      x.fill();
    }
  }
  return tex(c);
}

/** hanging platform sign: line-coloured roundel + station name, white board */
export function stationSign(num: string, name: string, line: string, sub: string) {
  const W = 1024,
    H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d")!;
  x.fillStyle = "#fbfcfd";
  x.fillRect(0, 0, W, H);
  x.fillStyle = line;
  x.fillRect(0, H - 26, W, 26);
  // roundel
  x.beginPath();
  x.arc(118, 112, 78, 0, Math.PI * 2);
  x.fillStyle = line;
  x.fill();
  x.beginPath();
  x.arc(118, 112, 56, 0, Math.PI * 2);
  x.fillStyle = "#fff";
  x.fill();
  x.fillStyle = "#14202e";
  x.font = `800 58px ${FONT}`;
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(num, 118, 116);
  x.textAlign = "left";
  let size = 76;
  x.font = `700 ${size}px ${FONT}`;
  while (x.measureText(name).width > W - 250 && size > 36) {
    size -= 4;
    x.font = `700 ${size}px ${FONT}`;
  }
  x.fillStyle = "#14202e";
  x.fillText(name, 222, 96);
  x.font = `500 34px ${FONT}`;
  x.fillStyle = "#5c6876";
  x.fillText(sub, 224, 166);
  return tex(c);
}

/** side decal on the car body: hexagon mark + "LINK METRO" */
export function sideDecal() {
  const W = 1024,
    H = 160;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d")!;
  x.clearRect(0, 0, W, H);
  // hexagon
  const cx = 80,
    cy = 80,
    r = 54;
  x.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = Math.PI / 6 + (k * Math.PI) / 3;
    const px = cx + r * Math.cos(a),
      py = cy + r * Math.sin(a);
    if (k === 0) x.moveTo(px, py);
    else x.lineTo(px, py);
  }
  x.closePath();
  x.fillStyle = "#2a5ada";
  x.fill();
  x.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = Math.PI / 6 + (k * Math.PI) / 3;
    const px = cx + r * 0.5 * Math.cos(a),
      py = cy + r * 0.5 * Math.sin(a);
    if (k === 0) x.moveTo(px, py);
    else x.lineTo(px, py);
  }
  x.closePath();
  x.fillStyle = "#ffffff";
  x.fill();
  x.font = `800 74px ${FONT}`;
  x.textBaseline = "middle";
  x.fillStyle = "#24305e";
  x.fillText("LINK METRO", 160, 86);
  return tex(c);
}
