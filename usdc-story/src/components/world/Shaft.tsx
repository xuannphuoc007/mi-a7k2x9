"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth } from "@/lib/timeline";
import { COL, g, tmpM, tmpQ, tmpS, tmpV, xr } from "./shared";

/** A glass elevator shaft from the table down to the vault antechamber. */
const TOP = -1.2;
const BOT = -56;
const N = 28;
const R = 3.8;

export default function Shaft() {
  const grp = useRef<THREE.Group>(null);
  const rings = useRef<THREE.InstancedMesh>(null);
  const glass = useRef<THREE.MeshPhysicalMaterial>(null);
  const led = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const u = scrollState.u;
    const vis = u > g("s01", 0.55) && u < g("s03", 0.2);
    if (grp.current) grp.current.visible = vis;
    if (!vis || !rings.current) return;
    const on = smooth(ramp(local("s01", u), 0.58, 0.74));
    for (let i = 0; i < N; i++) {
      const y = TOP - (i / (N - 1)) * (TOP - BOT);
      tmpV.set(0, y, -8);
      tmpQ.setFromAxisAngle(tmpS.set(1, 0, 0), Math.PI / 2);
      const a = Math.max(0.001, smooth(ramp(on * 1.4 - (i / N) * 0.4, 0, 1)));
      tmpS.set(a, a, a);
      tmpM.compose(tmpV, tmpQ, tmpS);
      rings.current.setMatrixAt(i, tmpM);
    }
    rings.current.instanceMatrix.needsUpdate = true;
    if (glass.current) glass.current.opacity = on * (0.16 - 0.1 * xr.v);
    if (led.current) led.current.opacity = on * 0.9;
  });
  const H = TOP - BOT;
  return (
    <group ref={grp}>
      <instancedMesh ref={rings} args={[undefined, undefined, N]} frustumCulled={false}>
        <torusGeometry args={[R, 0.09, 12, 72]} />
        <meshStandardMaterial color={COL.silver} metalness={0.9} roughness={0.3} />
      </instancedMesh>
      {Array.from({ length: 6 }, (_, k) => {
        const a = (k / 6) * Math.PI * 2 + 0.3;
        return (
          <mesh key={k} position={[Math.cos(a) * R, (TOP + BOT) / 2, -8 + Math.sin(a) * R]}>
            <boxGeometry args={[0.14, H, 0.14]} />
            <meshStandardMaterial color="#c9a24a" metalness={0.85} roughness={0.3} />
          </mesh>
        );
      })}
      <mesh position={[0, (TOP + BOT) / 2, -8]}>
        <cylinderGeometry args={[R - 0.05, R - 0.05, H, 48, 1, true]} />
        <meshPhysicalMaterial ref={glass} color="#dfeefc" roughness={0.08} metalness={0} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {Array.from({ length: 6 }, (_, k) => (
        <mesh key={k} position={[0, TOP - 4 - k * 9, -8]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R - 0.12, 0.025, 6, 72]} />
          <meshBasicMaterial ref={k === 0 ? led : undefined} color={COL.usdc} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}
