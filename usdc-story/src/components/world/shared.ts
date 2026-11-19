import * as THREE from "three";
import { START, LEN, type SceneId } from "@/lib/timeline";

export const COL = {
  night: "#eef2f7", // daylight background (kept the key name for minimal churn)
  ink: "#0f2340",
  usdc: "#2775ca",
  volt: "#3d8ee6",
  ice: "#9cc9f5",
  warm: "#ffffff",
  mist: "#50627e",
  risk: "#d0603f",
  silver: "#c3ccd8",
  steel: "#aab4c2",
  paper: "#f2ecdc",
  money: "#a9b79f",
  marble: "#e9edf2",
  eth: "#6f7fe6",
  solA: "#14f195",
  solB: "#9945ff",
};

/** global u for a scene-local moment */
export const g = (id: SceneId, t: number) => START[id] + t * LEN[id];

/** Smoothed X-RAY amount (0 cinematic → 1 system). Written once per frame by <XrayDriver/>. */
export const xr = { v: 0 };
/** Frozen clock for reduced motion */
export const clock = { t: 0, reduced: false, mobile: false };

/** World anchors */
export const HERO = new THREE.Vector3(0, 0, 0);
export const VAULT = { center: new THREE.Vector3(0, -72, -40), ceil: -48, front: -20, back: -60, halfW: 18 };
/** where the camera is looking (written by CameraRig, read by the sun so shadows follow the action) */
export const LOOK = new THREE.Vector3();
export const ETH = new THREE.Vector3(0, -64, -110);
export const SOL = new THREE.Vector3(46, -64, -200);
export const TUNNEL = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -56, -118),
  new THREE.Vector3(4, -52, -134),
  new THREE.Vector3(16, -49, -156),
  new THREE.Vector3(32, -51, -176),
  new THREE.Vector3(44, -56, -192),
]);

/** Points on an octahedron surface (|x|+|y|+|z| = r) with facet normals — the "digital dollar" packet shape. */
export function packetPoints(n: number, r: number, seed = 1) {
  const pts: THREE.Vector3[] = [];
  const nrm: THREE.Vector3[] = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n;
    const rr = Math.sqrt(1 - y * y);
    const th = ga * i * seed;
    const d = new THREE.Vector3(Math.cos(th) * rr, y, Math.sin(th) * rr);
    const l1 = Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z);
    pts.push(d.clone().multiplyScalar(r / l1));
    nrm.push(new THREE.Vector3(Math.sign(d.x) || 1, Math.sign(d.y) || 1, Math.sign(d.z) || 1).normalize());
  }
  return { pts, nrm };
}

/** deterministic pseudo-random */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const tmpM = new THREE.Matrix4();
export const tmpQ = new THREE.Quaternion();
export const tmpV = new THREE.Vector3();
export const tmpS = new THREE.Vector3();
export const tmpC = new THREE.Color();
export const UP = new THREE.Vector3(0, 0, 1);

/**
 * Points on both faces of a flat token (coin) of radius r, facing ±z, with a colour per tile
 * sampled from the logo image so the tiles read as the real USDC token.
 */
export function coinPoints(n: number, r: number, sample?: (u: number, v: number) => THREE.Color) {
  const pts: THREE.Vector3[] = [];
  const nrm: THREE.Vector3[] = [];
  const col: THREE.Color[] = [];
  const half = Math.ceil(n / 2);
  const d = Math.sqrt((Math.PI * r * r) / half) * 0.98;
  const grid: [number, number][] = [];
  for (let y = -r; y <= r; y += d) for (let x = -r; x <= r; x += d) if (x * x + y * y <= r * r) grid.push([x, y]);
  for (let i = 0; i < n; i++) {
    const front = i < half;
    const gp = grid[(front ? i : i - half) % grid.length];
    const [x, y] = gp;
    pts.push(new THREE.Vector3(front ? x : -x, y, front ? 0.07 : -0.07));
    nrm.push(new THREE.Vector3(0, 0, front ? 1 : -1));
    col.push(sample ? sample((x / r + 1) / 2, 1 - (y / r + 1) / 2) : new THREE.Color("#2775ca"));
  }
  return { pts, nrm, col, d };
}

/** Load an image into a pixel sampler (u,v in 0..1). */
export function loadSampler(src: string): Promise<(u: number, v: number) => THREE.Color> {
  return new Promise((res) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const x = c.getContext("2d")!;
      x.drawImage(img, 0, 0);
      const data = x.getImageData(0, 0, c.width, c.height).data;
      res((u, v) => {
        const px = Math.min(c.width - 1, Math.max(0, Math.floor(u * c.width)));
        const py = Math.min(c.height - 1, Math.max(0, Math.floor(v * c.height)));
        const i = (py * c.width + px) * 4;
        const a = data[i + 3] / 255;
        // transparent pixels outside the logo → USDC blue
        return new THREE.Color((data[i] * a + 39 * (1 - a)) / 255, (data[i + 1] * a + 117 * (1 - a)) / 255, (data[i + 2] * a + 202 * (1 - a)) / 255).convertSRGBToLinear();
      });
    };
    img.onerror = () => res(() => new THREE.Color("#2775ca").convertSRGBToLinear());
    img.src = src;
  });
}
