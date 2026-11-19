"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, clamp, ease, ramp } from "@/lib/timeline";
import { clock } from "./shared";

export type Stop = { u: number; p: [number, number, number]; ry: number };
export type Look = { skin: string; hair: string; top: string; pants: string; shoes: string; bun?: boolean; ponytail?: boolean; phone?: boolean };

/** Position along a list of stops (eased between neighbours) + whether the figure is walking. */
function sampleTrack(stops: Stop[], u: number, out: THREE.Vector3) {
  if (u <= stops[0].u) {
    out.set(...stops[0].p);
    return { ry: stops[0].ry, walk: 0 };
  }
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (u <= b.u) {
      const k = ease(ramp(u, a.u, b.u));
      out.set(a.p[0] + (b.p[0] - a.p[0]) * k, a.p[1] + (b.p[1] - a.p[1]) * k, a.p[2] + (b.p[2] - a.p[2]) * k);
      const dist = Math.hypot(b.p[0] - a.p[0], b.p[2] - a.p[2]);
      const moving = dist > 0.3 && Math.abs(b.p[1] - a.p[1]) < 1 ? Math.sin(Math.PI * k) : 0;
      // face the walking direction while moving, then turn to the resting direction
      const walkDir = Math.atan2(b.p[0] - a.p[0], b.p[2] - a.p[2]);
      const ry = moving > 0.05 ? walkDir + (b.ry - walkDir) * Math.pow(k, 4) : a.ry + (b.ry - a.ry) * k;
      return { ry, walk: moving };
    }
  }
  const l = stops[stops.length - 1];
  out.set(...l.p);
  return { ry: l.ry, walk: 0 };
}

/**
 * A friendly toy-figure person. Everything is driven by scroll (position) plus a small idle
 * motion, so scrolling back plays the walk in reverse.
 */
export default function Person({ look, stops, windows, scale = 1 }: { look: Look; stops: Stop[]; windows: (u: number) => number; scale?: number }) {
  const root = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const m = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: look.skin, roughness: 0.7 }),
      hair: new THREE.MeshStandardMaterial({ color: look.hair, roughness: 0.6 }),
      top: new THREE.MeshStandardMaterial({ color: look.top, roughness: 0.7 }),
      pants: new THREE.MeshStandardMaterial({ color: look.pants, roughness: 0.8 }),
      shoes: new THREE.MeshStandardMaterial({ color: look.shoes, roughness: 0.6 }),
      eye: new THREE.MeshBasicMaterial({ color: "#1b2533" }),
      phone: new THREE.MeshStandardMaterial({ color: "#1b2533", metalness: 0.3, roughness: 0.3 }),
      screen: new THREE.MeshStandardMaterial({ color: "#2775ca", emissive: "#2775ca", emissiveIntensity: 0.5 }),
    }),
    [look],
  );

  useFrame(() => {
    const u = scrollState.u;
    const v = clamp(windows(u));
    const g = root.current;
    if (!g) return;
    g.visible = v > 0.01;
    if (!g.visible) return;
    const { ry, walk } = sampleTrack(stops, u, pos);
    const tm = clock.t;
    // walk cycle uses scroll position so it is in step with the movement, idle sway uses time
    const phase = u * 60;
    const sw = Math.sin(phase) * 0.6 * walk;
    g.position.copy(pos);
    g.position.y += Math.abs(Math.sin(phase)) * 0.05 * walk;
    g.rotation.y = ry;
    const s = scale * (0.4 + 0.6 * v);
    g.scale.setScalar(s);
    if (legL.current) legL.current.rotation.x = sw;
    if (legR.current) legR.current.rotation.x = -sw;
    if (armL.current) armL.current.rotation.x = -sw * 0.8;
    if (armR.current) armR.current.rotation.x = look.phone ? -1.1 + Math.sin(tm * 0.8) * 0.04 : sw * 0.8;
    if (head.current) {
      head.current.rotation.y = Math.sin(tm * 0.35) * 0.18 * (1 - walk);
      head.current.rotation.x = look.phone ? 0.25 : 0;
    }
  });

  return (
    <group ref={root}>
      {/* legs */}
      {[
        [legL, -0.13],
        [legR, 0.13],
      ].map(([ref, x]) => (
        <group key={String(x)} ref={ref as React.RefObject<THREE.Group>} position={[x as number, 0.86, 0]}>
          <mesh position={[0, -0.4, 0]} material={m.pants} castShadow>
            <capsuleGeometry args={[0.12, 0.6, 6, 12]} />
          </mesh>
          <mesh position={[0, -0.8, 0.06]} material={m.shoes} castShadow>
            <boxGeometry args={[0.2, 0.1, 0.32]} />
          </mesh>
        </group>
      ))}
      {/* body */}
      <mesh position={[0, 1.22, 0]} material={m.top} castShadow>
        <capsuleGeometry args={[0.27, 0.48, 8, 16]} />
      </mesh>
      {/* arms */}
      {[
        [armL, -0.36],
        [armR, 0.36],
      ].map(([ref, x]) => (
        <group key={String(x)} ref={ref as React.RefObject<THREE.Group>} position={[x as number, 1.5, 0]}>
          <mesh position={[0, -0.3, 0]} material={m.top} castShadow>
            <capsuleGeometry args={[0.08, 0.42, 6, 10]} />
          </mesh>
          <mesh position={[0, -0.6, 0]} material={m.skin}>
            <sphereGeometry args={[0.08, 12, 12]} />
          </mesh>
          {look.phone && (x as number) > 0 && (
            <group position={[0, -0.62, 0.06]} rotation={[1.1, 0, 0]}>
              <mesh material={m.phone}>
                <boxGeometry args={[0.13, 0.24, 0.02]} />
              </mesh>
              <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]} material={m.screen}>
                <planeGeometry args={[0.11, 0.21]} />
              </mesh>
            </group>
          )}
        </group>
      ))}
      {/* head */}
      <group ref={head} position={[0, 1.86, 0]}>
        <mesh material={m.skin} castShadow>
          <sphereGeometry args={[0.23, 24, 24]} />
        </mesh>
        <mesh position={[0, 0.06, -0.03]} scale={[1.06, 0.9, 1.06]} material={m.hair}>
          <sphereGeometry args={[0.235, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        {look.bun && (
          <mesh position={[0, 0.12, -0.22]} material={m.hair}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>
        )}
        {look.ponytail && (
          <mesh position={[0, -0.05, -0.24]} rotation={[0.3, 0, 0]} material={m.hair}>
            <capsuleGeometry args={[0.07, 0.3, 6, 10]} />
          </mesh>
        )}
        {[-0.08, 0.08].map((x) => (
          <mesh key={x} position={[x, 0.02, 0.215]} material={m.eye}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
        ))}
        <mesh position={[0, -0.07, 0.215]} rotation={[0, 0, Math.PI]} material={m.eye}>
          <torusGeometry args={[0.045, 0.01, 6, 16, Math.PI]} />
        </mesh>
      </group>
    </group>
  );
}
