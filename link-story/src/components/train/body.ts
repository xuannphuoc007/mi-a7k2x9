/**
 * Car body: a lofted cross-section (superellipse — boxy sill, rounded cant rail)
 * with an optional rounded cab nose and raked windscreen at the +x end.
 * Paint (stripes, glass, doors, cab mask, lights) is drawn per pixel in the
 * material shader from object-space position, so every line follows the curved body.
 */
import * as THREE from "three";

export const W = 1.45; // half width
export const YC = 1.5; // waist height (widest point), body-local
export const HU = 2.25; // waist → roof
export const HD = 1.5; // waist → sill
export const NOSE = 1.7; // nose length

function profile(v: number): [number, number] {
  const th = -Math.PI / 2 + v * Math.PI * 2;
  const c = Math.cos(th),
    s = Math.sin(th);
  const upper = s >= 0;
  const e = 2 / (upper ? 4.4 : 10);
  const z = W * Math.sign(c) * Math.pow(Math.abs(c), e);
  const y = YC + (upper ? HU : HD) * Math.sign(s) * Math.pow(Math.abs(s), e);
  return [y, z];
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function buildBody(L: number, nose: boolean) {
  const NV = 128;
  // u samples: dense near the ends
  const us: number[] = [];
  const a = -L / 2,
    b = L / 2;
  const tail = 0.14;
  us.push(a, a + 0.02, a + 0.05, a + 0.09, a + tail);
  const bodyEnd = nose ? b - NOSE : b - tail;
  const nBody = Math.ceil((bodyEnd - (a + tail)) / 0.5);
  for (let i = 1; i <= nBody; i++) us.push(a + tail + ((bodyEnd - (a + tail)) * i) / nBody);
  if (nose) {
    const NN = 44;
    for (let i = 1; i <= NN; i++) {
      const t = i / NN;
      us.push(bodyEnd + NOSE * (1 - Math.pow(1 - t, 1.6)));
    }
  } else {
    us.push(b - 0.09, b - 0.05, b - 0.02, b);
  }

  const pos: number[] = [];
  const ring = (u: number) => {
    // end taper at the gangway ends (hidden, just closes the shell neatly)
    let k = 1;
    if (u < a + tail) k = 0.9 + 0.1 * smoothstep(a, a + tail, u);
    if (!nose && u > b - tail) k = 0.9 + 0.1 * smoothstep(b, b - tail, u);
    const s = nose && u > bodyEnd ? (u - bodyEnd) / NOSE : 0;
    const wz = nose ? Math.cbrt(Math.max(0, 1 - s * s * s)) : 1;
    for (let j = 0; j <= NV; j++) {
      let [y, z] = profile(j / NV);
      y = YC + (y - YC) * (y > YC ? k : 1);
      z *= k * wz;
      let x = u;
      if (s > 0) {
        if (y > YC) y = YC + (y - YC) * (1 - 0.045 * s * s);
        x -= 0.62 * smoothstep(1.55, 3.75, y) * s * s; // raked windscreen
        x -= 0.12 * smoothstep(0.45, 0.0, y) * s * s; // tucked skirt
      }
      pos.push(x, y, z);
    }
  };
  us.forEach(ring);

  const idx: number[] = [];
  const R = NV + 1;
  for (let i = 0; i < us.length - 1; i++) {
    for (let j = 0; j < NV; j++) {
      const A = i * R + j,
        B = (i + 1) * R + j,
        C = i * R + j + 1,
        D = (i + 1) * R + j + 1;
      idx.push(A, B, C, B, D, C);
    }
  }
  // caps: back always, front only without a nose
  const cap = (ringIndex: number, flip: boolean) => {
    const base = pos.length / 3;
    const r0 = ringIndex * R;
    let cx = 0,
      cy = 0;
    for (let j = 0; j < NV; j++) {
      cx += pos[(r0 + j) * 3];
      cy += pos[(r0 + j) * 3 + 1];
    }
    pos.push(cx / NV, cy / NV, 0);
    // duplicate the rim so the flat cap does not bend the side normals
    for (let j = 0; j <= NV; j++) pos.push(pos[(r0 + j) * 3], pos[(r0 + j) * 3 + 1], pos[(r0 + j) * 3 + 2]);
    for (let j = 0; j < NV; j++) {
      const p = base + 1 + j,
        q = base + 2 + j;
      if (flip) idx.push(base, q, p);
      else idx.push(base, p, q);
    }
  };
  cap(0, false);
  if (!nose) cap(us.length - 1, true);

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
