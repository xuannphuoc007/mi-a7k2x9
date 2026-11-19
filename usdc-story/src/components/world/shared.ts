import * as THREE from "three";
import { START, LEN, type SceneId } from "@/lib/timeline";

export const COL = {
  night: "#070f20",
  usdc: "#2775ca",
  volt: "#60b4ff",
  ice: "#a7dbff",
  warm: "#f5f8fd",
  mist: "#a0b4ce",
  risk: "#ed846b",
  silver: "#c9d4e4",
  eth: "#8e9cf5",
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
export const VAULT = { center: new THREE.Vector3(0, -72, -30), hatchY: -45, radius: 20 };
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
