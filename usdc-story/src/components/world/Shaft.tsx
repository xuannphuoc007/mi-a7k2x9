"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth } from "@/lib/timeline";
import { COL, clock, g, tmpC, tmpM, tmpQ, tmpS, tmpV, xr } from "./shared";

/** The descent from the packet into the financial infrastructure: a lit shaft that ends at the vault hatch. */
const PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -1.5, -8),
  new THREE.Vector3(0, -6, -14),
  new THREE.Vector3(0, -16, -21),
  new THREE.Vector3(0, -30, -27),
  new THREE.Vector3(0, -43, -30),
]);
const N = 46;

export default function Shaft() {
  const grp = useRef<THREE.Group>(null);
  const rings = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineBasicMaterial>(null);
  const frames = useMemo(() => PATH.computeFrenetFrames(N, false), []);
  const railGeo = useMemo(() => {
    const arr: number[] = [];
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const pts = PATH.getPoints(80).map((p, i) => {
        const tng = PATH.getTangentAt(i / 80);
        const side = new THREE.Vector3().crossVectors(tng, new THREE.Vector3(1, 0, 0)).normalize();
        const up = new THREE.Vector3(1, 0, 0);
        return p.clone().add(side.multiplyScalar(Math.cos(a) * 4.2)).add(up.multiplyScalar(Math.sin(a) * 4.2));
      });
      for (let i = 0; i < pts.length - 1; i++) arr.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return geo;
  }, []);
  useFrame(() => {
    const u = scrollState.u;
    const vis = u > g("s01", 0.55) && u < g("s03", 0.25);
    if (grp.current) grp.current.visible = vis;
    if (!vis || !rings.current) return;
    const tl = local("s01", u);
    const on = smooth(ramp(tl, 0.6, 0.75));
    const tm = clock.t;
    for (let i = 0; i < N; i++) {
      const s = i / (N - 1);
      PATH.getPoint(s, tmpV);
      tmpQ.setFromUnitVectors(Z, frames.tangents[i]);
      const appear = smooth(ramp(on * 1.3 - s * 0.3, 0, 1));
      tmpS.setScalar(Math.max(0.001, appear));
      tmpM.compose(tmpV, tmpQ, tmpS);
      rings.current.setMatrixAt(i, tmpM);
      const pulse = 0.5 + 0.5 * Math.sin(tm * 2 - s * 18);
      tmpC.set(COL.usdc).lerp(C2.set(COL.ice), pulse * 0.5).multiplyScalar(0.5 + pulse * 0.7);
      rings.current.setColorAt(i, tmpC);
    }
    rings.current.instanceMatrix.needsUpdate = true;
    if (rings.current.instanceColor) rings.current.instanceColor.needsUpdate = true;
    if (lines.current) {
      lines.current.opacity = on * (0.35 + 0.4 * xr.v);
      lines.current.visible = lines.current.opacity > 0.005;
    }
  });
  return (
    <group ref={grp}>
      <instancedMesh ref={rings} args={[undefined, undefined, N]} frustumCulled={false}>
        <torusGeometry args={[4.2, 0.035, 8, 90]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <lineSegments geometry={railGeo}>
        <lineBasicMaterial ref={lines} color={COL.volt} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}
const Z = new THREE.Vector3(0, 0, 1);
const C2 = new THREE.Color();
