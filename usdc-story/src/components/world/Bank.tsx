"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { cashTex, cashSideTex, signTex } from "./textures";

/** A small classical bank in stone, cash bundles visible between the columns. */
export default function Bank({ position, scale = 1, sign, rotation = 0 }: { position: [number, number, number]; scale?: number; sign?: string; rotation?: number }) {
  const m = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ map: cashSideTex(), roughness: 0.85 });
    const top = new THREE.MeshStandardMaterial({ map: cashTex(), roughness: 0.8 });
    return {
      cash: [side, side, top, side, side, side],
      marble: new THREE.MeshStandardMaterial({ color: "#efece6", roughness: 0.45 }),
      stone: new THREE.MeshStandardMaterial({ color: "#e2ddd2", roughness: 0.55 }),
      sign: sign ? new THREE.MeshStandardMaterial({ map: signTex(sign, "#e2ddd2", "#3b4c63", 512, 96, "700 44px Georgia") }) : null,
    };
  }, [sign]);
  const cols = [-1.25, -0.42, 0.42, 1.25];
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.18, 0]} material={m.stone} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.36, 2.6]} />
      </mesh>
      {cols.map((x) => (
        <mesh key={x} position={[x, 1.36, 0.95]} material={m.marble} castShadow>
          <cylinderGeometry args={[0.17, 0.2, 2, 20]} />
        </mesh>
      ))}
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => (
          <mesh key={`${r}${c}`} position={[-0.42 + c * 0.84, 0.54 + r * 0.34, -0.2]} material={m.cash}>
            <boxGeometry args={[0.78, 0.32, 0.42]} />
          </mesh>
        )),
      )}
      <mesh position={[0, 1.3, -1.15]} material={m.stone}>
        <boxGeometry args={[3.4, 2.2, 0.2]} />
      </mesh>
      <mesh position={[0, 2.5, 0]} material={m.marble} castShadow>
        <boxGeometry args={[3.9, 0.26, 2.8]} />
      </mesh>
      {m.sign && (
        <mesh position={[0, 2.5, 1.41]} material={m.sign}>
          <planeGeometry args={[3.6, 0.24]} />
        </mesh>
      )}
      <mesh position={[0, 2.95, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.95, 1, 0.65]} material={m.stone} castShadow>
        <cylinderGeometry args={[1, 1, 2.8, 3]} />
      </mesh>
    </group>
  );
}
