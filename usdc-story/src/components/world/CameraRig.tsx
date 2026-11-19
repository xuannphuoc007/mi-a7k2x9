"use client";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState, ease, ramp, local } from "@/lib/timeline";
import { g, TUNNEL, clock, LOOK, isMap } from "./shared";
import { useView } from "@/lib/store";

/** where the camera goes when a system-map button is pressed */
export const FOCUS: Record<string, [[number, number, number], [number, number, number]]> = {
  issuance: [[14, -15, 12], [22, -22, -14]],
  reserves: [[12, -60, -24], [-1, -66, -42]],
  chains: [[0, -26, -56], [0, -64, -120]],
  cctp: [[40, -40, -126], [24, -55, -160]],
  markets: [[100, -56, -184], [104, -59, -206]],
  controls: [[139, -55, -235], [150, -61, -252]],
  redemption: [[112, -59, -190], [112, -61, -203]],
};

type K = [number, [number, number, number], [number, number, number]];

const A = new THREE.Vector3(0, -55.5, -109);
const look0 = TUNNEL.getPoint(0.06);

/** Camera keyframes: global u → position, look-at target. */
const KEYS: K[] = [
  // 01 — note → token, then into the elevator
  [g("s01", 0), [0, -0.6, 15], [0, -1.5, 0]],
  [g("s01", 0.22), [0.4, 0.15, 8.2], [0, 0, 0]],
  [g("s01", 0.48), [1.6, 0.5, 6.4], [0, 0, 0]],
  [g("s01", 0.62), [0.3, 0.05, 2.2], [0, 0, -4]],
  [g("s01", 0.76), [0, -0.4, -4.5], [0, -3, -12]],
  [g("s01", 0.88), [0, -6, -8.2], [0, -40, -8.9]],
  // 02 — the minting floor
  [g("s02", 0), [0, -20.2, -6.5], [14, -22, -18]],
  [g("s02", 0.14), [12, -18.2, -3], [14, -22.4, -18]],
  [g("s02", 0.32), [21.5, -19, -7], [24.5, -21.4, -18]],
  [g("s02", 0.5), [31, -19.4, -7], [37, -22.2, -17]],
  [g("s02", 0.67), [27, -18.5, 15], [22, -22.4, 5]],
  [g("s02", 0.82), [12, -14, 12], [20, -22, -10]],
  [g("s02", 0.94), [0, -21.5, -7.6], [0, -60, -8.6]],
  // 03 — the vault
  [g("s03", 0), [0, -42, -8.1], [0, -80, -8.8]],
  [g("s03", 0.07), [0, -63.4, -4], [0, -64.4, -20]],
  [g("s03", 0.15), [0, -64, -17.5], [0, -65, -32]],
  [g("s03", 0.27), [12, -60, -24], [-1, -66, -42]],
  [g("s03", 0.36), [-3.2, -61.5, -29], [-9, -63.5, -40]],
  [g("s03", 0.5), [2.6, -65, -29.5], [-3, -67.2, -40]],
  [g("s03", 0.62), [9, -68, -31.5], [4.8, -70.2, -40]],
  [g("s03", 0.74), [-3.5, -57, -23.5], [-5, -64, -40]],
  [g("s03", 0.88), [0, -54, -22.5], [0, -58, -40]],
  [g("s03", 0.96), [0, -56, -42], [0, -57.5, -70]],
  // 04 — the internet of dollars
  [g("s04", 0.06), [0, -55, -66], [0, -62, -100]],
  [g("s04", 0.28), [-24, -52, -70], [-40, -61, -90]],
  [g("s04", 0.4), [26, -52, -68], [40, -61, -88]],
  [g("s04", 0.54), [-34, -54, -112], [-46, -61, -140]],
  [g("s04", 0.66), [-14, -59, -117], [-24, -63, -125]],
  [g("s04", 0.8), [36, -52, -110], [50, -61, -132]],
  [g("s04", 0.94), [6, -56, -92], [0, -62, -110]],
  // 05 — the cross-chain portal
  [g("s05", 0.12), [5.5, -59.5, -99], [0, -62, -110]],
  [g("s05", 0.27), [3.6, -60.6, -103], [0, -62.6, -110]],
  [g("s05", 0.4), [A.x, A.y, A.z], [look0.x, look0.y, look0.z]],
  // 0.40 → 0.70 handled by the tunnel follow below
  [g("s05", 0.7), [43, -55.6, -189.5], [46, -58, -197]],
  [g("s05", 0.78), [54, -58.5, -189], [46, -62, -200]],
  [g("s05", 0.86), [51.5, -60, -193], [46, -61.6, -200]],
  [g("s05", 0.95), [64, -50, -176], [46, -62, -200]],
  // 06 — the one-dollar question
  [g("s06", 0.02), [80, -50, -168], [100, -60, -206]],
  [g("s06", 0.12), [100, -57.5, -186], [100, -58, -212]],
  [g("s06", 0.46), [104, -57.5, -187], [107, -59.5, -204]],
  [g("s06", 0.7), [112, -59, -190], [112, -61, -203]],
  [g("s06", 0.88), [100, -56, -183], [102, -59, -208]],
  // 07 — the control layer
  [g("s07", 0.02), [128, -52, -222], [150, -61, -256]],
  [g("s07", 0.14), [150, -59.5, -238], [150, -61.5, -256]],
  [g("s07", 0.3), [146.5, -60.4, -248], [149.2, -60.8, -258]],
  [g("s07", 0.5), [152.5, -60.2, -246], [149.3, -60.8, -257]],
  [g("s07", 0.7), [150, -58.4, -241.5], [150, -62.8, -248]],
  [g("s07", 0.88), [139, -55, -235], [150, -61, -252]],
  // 08 — when the peg breaks (March 2023)
  [g("s08", 0.02), [120, -52, -180], [124, -60, -205]],
  [g("s08", 0.13), [138, -60, -184], [138, -61.5, -198]],
  [g("s08", 0.3), [100, -57.5, -186], [100, -58, -212]],
  [g("s08", 0.48), [112, -59, -190], [112, -61, -203]],
  [g("s08", 0.82), [104, -57.5, -187], [107, -59.5, -204]],
  [g("s08", 0.95), [100, -56, -184], [101, -58.5, -210]],
  // 09 — back to the real world, then all the way back to the table
  [g("s09", 0.06), [101, -56.5, -178], [108, -61, -198]],
  [g("s09", 0.2), [113.5, -59.8, -195.5], [111.5, -61.6, -201.5]],
  [g("s09", 0.38), [117, -57, -182], [121, -61, -190]],
  [g("s09", 0.6), [70, -20, -120], [40, -55, -150]],
  [g("s09", 0.72), [22, 10, 38], [0, -8, -30]],
  [g("s09", 0.84), [0, 1.0, 9.5], [0, -0.4, 0]],
  [g("s09", 1), [0, 0.4, 11.5], [0, -0.6, 0]],
  // map: overview of the whole system
  [g("end", 0.3), [80, 70, 45], [55, -58, -125]],
];

const P = new THREE.Vector3();
const curP = new THREE.Vector3();
const curL = new THREE.Vector3();
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

    if (isMap(u)) {
      const f = useView.getState().focus;
      const tgt = f && FOCUS[f] ? FOCUS[f] : null;
      if (tgt) {
        P.set(...tgt[0]);
        L.set(...tgt[1]);
      }
      const km = clock.reduced ? 1 : 1 - Math.exp(-dt * 2.4);
      curP.lerp(P, km);
      curL.lerp(L, km);
      P.copy(curP);
      L.copy(curL);
    } else {
      curP.copy(P);
      curL.copy(L);
    }

    cam.position.copy(P);
    look.copy(L);
    LOOK.copy(L);
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
