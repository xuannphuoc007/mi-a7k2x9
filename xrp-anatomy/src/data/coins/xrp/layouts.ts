/**
 * Shared coordinates (SVG viewBox 0..1000) so consecutive scenes can morph
 * into one another, and the 3D particle field can land exactly on the
 * ledger diagram.
 */
export const VB = 1000;
export const CENTER = { x: 500, y: 490 };

export type Pt = { x: number; y: number };

export const ledgerAccounts: (Pt & { addr: string; balance: number; seq: number; objects: number })[] = [
  { x: 170, y: 270, addr: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", balance: 1250.5, seq: 42, objects: 2 },
  { x: 345, y: 135, addr: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe", balance: 88.0, seq: 7, objects: 0 },
  { x: 610, y: 125, addr: "rLHzPsX6oXkzU2qL12kHCH8G8cnZv1rBJh", balance: 30412.25, seq: 1203, objects: 5 },
  { x: 830, y: 255, addr: "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo", balance: 512.75, seq: 96, objects: 1 },
  { x: 875, y: 520, addr: "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y", balance: 2.4, seq: 3, objects: 0 },
  { x: 735, y: 790, addr: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH", balance: 9700.0, seq: 311, objects: 3 },
  { x: 440, y: 865, addr: "rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv", balance: 145.1, seq: 58, objects: 1 },
  { x: 160, y: 680, addr: "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf", balance: 1000.0, seq: 19, objects: 0 },
];

export const ledgerServers: Pt[] = [
  { x: 370, y: 370 },
  { x: 615, y: 340 },
  { x: 680, y: 585 },
  { x: 470, y: 665 },
  { x: 300, y: 545 },
];

/** account index → server index */
export const accountServer = [0, 0, 1, 1, 2, 2, 3, 4];
export const serverLinks: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [0, 2],
  [1, 3],
];

/** The account that sends in chapter 2 */
export const SENDER = 0;

export const VALIDATOR_COUNT = 12;
export const VALIDATOR_R = 300;
export function validatorPos(i: number, r = VALIDATOR_R, cx = CENTER.x, cy = CENTER.y): Pt {
  const a = -Math.PI / 2 + (i / VALIDATOR_COUNT) * Math.PI * 2;
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
}
/** One server's UNL (validator 6 = "V-07"): indices it trusts */
export const UNL_OWNER = 6;
export const UNL = [0, 1, 2, 4, 5, 7, 8, 9, 10, 11];

/* ── Map (chapter 5): simplified US + Mexico outlines in lon/lat ── */
const usOutline: [number, number][] = [
  [-124.7, 48.4], [-124.1, 46.2], [-124.2, 42.0], [-123.8, 39.8], [-122.4, 37.8], [-120.6, 34.6], [-118.5, 34.0], [-117.1, 32.5],
  [-114.7, 32.7], [-111.0, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.6], [-103.0, 29.0], [-101.4, 29.8], [-99.5, 27.5], [-97.2, 25.9],
  [-97.4, 27.8], [-94.8, 29.4], [-91.0, 29.2], [-89.0, 30.2], [-85.0, 29.7], [-82.8, 27.9], [-81.2, 25.2], [-80.1, 26.5], [-81.4, 30.4],
  [-80.9, 32.0], [-77.9, 34.0], [-75.5, 35.3], [-76.2, 37.0], [-74.0, 40.4], [-71.0, 41.5], [-70.0, 41.8], [-70.6, 43.0], [-67.0, 44.8],
  [-69.2, 47.4], [-71.5, 45.0], [-74.9, 45.0], [-79.0, 43.3], [-82.7, 41.7], [-83.5, 46.1], [-89.0, 48.0], [-95.2, 49.0], [-123.0, 49.0],
];
const mxOutline: [number, number][] = [
  [-117.1, 32.5], [-115.8, 30.4], [-114.1, 28.0], [-112.1, 25.8], [-109.9, 22.9], [-110.6, 24.3], [-112.2, 27.0], [-114.3, 30.0], [-114.7, 31.7],
  [-112.8, 30.6], [-111.0, 27.8], [-108.6, 25.3], [-105.7, 22.4], [-105.3, 20.2], [-103.5, 18.3], [-100.5, 17.1], [-96.6, 15.7], [-94.2, 16.1],
  [-92.2, 14.6], [-91.5, 17.3], [-88.3, 18.5], [-87.5, 21.5], [-90.4, 21.2], [-90.7, 19.5], [-92.0, 18.6], [-94.5, 18.2], [-96.0, 19.5],
  [-97.4, 21.5], [-97.7, 24.0], [-97.2, 25.9], [-99.5, 27.5], [-101.4, 29.8], [-103.0, 29.0], [-104.5, 29.6], [-106.5, 31.8], [-108.2, 31.3],
  [-111.0, 31.3], [-114.7, 32.7],
];

/** Equirectangular projection into the scene, fitted to the US/MX window. */
export function project(lon: number, lat: number): Pt {
  const lon0 = -127, lon1 = -64, lat0 = 13, lat1 = 51;
  const w = 880, x0 = 60;
  const sx = w / (lon1 - lon0);
  const sy = sx * 1.22; // mild vertical stretch to fill the square stage
  const h = (lat1 - lat0) * sy;
  const y0 = CENTER.y - h / 2 + 10;
  return { x: x0 + (lon - lon0) * sx, y: y0 + (lat1 - lat) * sy };
}

function inPoly(x: number, y: number, poly: Pt[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export const usPoly = usOutline.map(([a, b]) => project(a, b));
export const mxPoly = mxOutline.map(([a, b]) => project(a, b));
export const polyPath = (p: Pt[]) => "M" + p.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join("L") + "Z";

/** Dot-matrix fill as a single path of zero-length segments (render with round caps). */
export function dotPath(poly: Pt[], step = 13) {
  const xs = poly.map((p) => p.x), ys = poly.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  let d = "";
  let row = 0;
  for (let y = minY; y <= maxY; y += step, row++) {
    for (let x = minX + (row % 2) * (step / 2); x <= maxX; x += step) {
      if (inPoly(x, y, poly)) d += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
    }
  }
  return d;
}

export const MAP = {
  sender: project(-97.0, 32.8), // Dallas–Fort Worth area
  onramp: project(-92.0, 35.5),
  xrpl: project(-86.5, 27.5), // abstract, offshore — the ledger has no location
  offramp: project(-99.2, 19.6), // Mexico City
  recipient: project(-103.4, 20.7), // Guadalajara
};
