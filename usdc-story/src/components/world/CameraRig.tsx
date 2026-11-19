"use client";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState, ease, ramp, local } from "@/lib/timeline";
import { g, TUNNEL, clock } from "./shared";

type K = [number, [number, number, number], [number, number, number]];

const A = new THREE.Vector3(0, -55.5, -109);
const look0 = TUNNEL.getPoint(0.06);

/** Camera keyframes: global u → position, look-at target. */
const KEYS: K[] = [
  [g("s01", 0), [0, -0.6, 15], [0, -1.5, 0]],
  [g("s01", 0.22), [0.4, 0.15, 8.2], [0, 0, 0]],
  [g("s01", 0.48), [3.4, 0.9, 5.4], [0, 0, 0]],
  [g("s01", 0.62), [0.3, 0.05, 2.2], [0, 0, -4]],
  [g("s01", 0.76), [0, -0.4, -4.5], [0, -3, -14]],
  [g("s01", 0.9), [0, -12, -19], [0, -40, -29]],
  [g("s03", 0), [0, -34, -24], [0, -60, -31]],
  [g("s03", 0.14), [0, -48.5, -27.5], [0, -70, -31.5]],
  [g("s03", 0.27), [13, -59, -11], [-1, -65, -30]],
  [g("s03", 0.36), [-3.2, -61.5, -19], [-9, -63.5, -30]],
  [g("s03", 0.5), [2.6, -65, -19.5], [-3, -67.2, -30]],
  [g("s03", 0.62), [9, -68, -21.5], [4.8, -70.2, -30]],
  [g("s03", 0.74), [-4, -56.5, -5.5], [-5, -64, -30]],
  [g("s03", 0.88), [0, -49, -1], [0, -57, -30]],
  [g("s05", 0), [0, -55, -68], [0, -62, -110]],
  [g("s05", 0.12), [5.5, -59.5, -99], [0, -62, -110]],
  [g("s05", 0.27), [3.6, -60.6, -103], [0, -62.6, -110]],
  [g("s05", 0.4), [A.x, A.y, A.z], [look0.x, look0.y, look0.z]],
  // 0.40 → 0.70 handled by the tunnel follow below
  [g("s05", 0.7), [43, -55.6, -189.5], [46, -58, -197]],
  [g("s05", 0.78), [54, -58.5, -189], [46, -62, -200]],
  [g("s05", 0.88), [51.5, -60, -193], [46, -61.6, -200]],
  [g("end", 0), [62, -27, -117], [23, -62, -158]],
  [g("end", 1), [66, -22, -106], [23, -62, -158]],
];

const P = new THREE.Vector3();
const L = new THREE.Vector3();
const pa = new THREE.Vector3();
const pb = new THREE.Vector3();

function sample(u: number) {
  if (u <= KEYS[0][0]) {
    P.set(...KEYS[0][1]);
    L.set(...KEYS[0][2]);
    return;
  }
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [u0, p0, l0] = KEYS[i];
    const [u1, p1, l1] = KEYS[i + 1];
    if (u <= u1) {
      const k = ease(ramp(u, u0, u1));
      P.set(...p0).lerp(pa.set(...p1), k);
      L.set(...l0).lerp(pb.set(...l1), k);
      return;
    }
  }
  const last = KEYS[KEYS.length - 1];
  P.set(...last[1]);
  L.set(...last[2]);
}

/** Tunnel progress of the signed message (0..1), shared with the Portal scene. */
export const tunnelS = (t: number) => ease(ramp(t, 0.4, 0.7));

export default function CameraRig() {
  const { camera, size } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const look = new THREE.Vector3();

  useFrame((_, dt) => {
    // deterministic target from scroll; the only smoothing is a critically-damped follow of u
    const k = clock.reduced ? 1 : 1 - Math.exp(-dt * 5.5);
    scrollState.u += (scrollState.target - scrollState.u) * k;
    const u = scrollState.u;

    const t5 = local("s05", u);
    if (t5 > 0.4 && t5 < 0.7) {
      const s = tunnelS(t5);
      const cs = s - 0.05;
      if (cs < 0) P.copy(A).lerp(TUNNEL.getPoint(0), (cs + 0.05) / 0.05);
      else TUNNEL.getPoint(cs, P);
      P.y += 0.35;
      TUNNEL.getPoint(Math.min(1, s + 0.06), L);
      // ease out into the next keyframe for the last 8%
      const out = ramp(t5, 0.66, 0.7);
      if (out > 0) {
        P.lerp(pa.set(43, -55.6, -189.5), ease(out));
        L.lerp(pb.set(46, -58, -197), ease(out));
      }
    } else sample(u);

    cam.position.copy(P);
    look.copy(L);
    cam.lookAt(look);
    const mobile = size.width < 760;
    const fov = mobile ? 66 : 46;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}
