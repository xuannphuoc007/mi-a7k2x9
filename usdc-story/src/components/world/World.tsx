"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useView } from "@/lib/store";
import { scrollState } from "@/lib/timeline";
import CameraRig from "./CameraRig";
import Hero from "./Hero";
import Vault from "./Vault";
import Portal from "./Portal";
import Shaft from "./Shaft";
import { COL, clock, rnd, xr } from "./shared";

/** One render loop drives clocks and the X-RAY blend; the scene graph never rebuilds on toggle. */
function Driver() {
  const { scene } = useThree();
  const bg = useMemo(() => new THREE.Color(COL.night), []);
  const bgX = useMemo(() => new THREE.Color("#0a1a33"), []);
  useFrame((_, dt) => {
    const { xray, reduced } = useView.getState();
    clock.reduced = reduced;
    if (!reduced) clock.t += Math.min(dt, 0.05);
    const k = reduced ? 1 : 1 - Math.exp(-dt * 6);
    xr.v += ((xray ? 1 : 0) - xr.v) * k;
    (scene.background as THREE.Color).copy(bg).lerp(bgX, xr.v);
    if (scene.fog) (scene.fog as THREE.FogExp2).color.copy(scene.background as THREE.Color);
  });
  return null;
}

function Dust() {
  const n = typeof window !== "undefined" && window.innerWidth < 760 ? 900 : 1800;
  const geo = useMemo(() => {
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = -90 + rnd(i) * 200;
      a[i * 3 + 1] = -120 + rnd(i + 1.3) * 140;
      a[i * 3 + 2] = -270 + rnd(i + 2.7) * 300;
    }
    const g0 = new THREE.BufferGeometry();
    g0.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g0;
  }, [n]);
  const ref = useRef<THREE.Points>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.t * 0.02) * 0.01;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={COL.ice} size={0.07} transparent opacity={0.55} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export default function World() {
  useEffect(() => {
    scrollState.u = scrollState.target;
  }, []);
  return (
    <Canvas
      className="!fixed inset-0"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      dpr={[1, typeof window !== "undefined" && window.innerWidth < 760 ? 1.5 : 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 46, near: 0.05, far: 600, position: [0, 0.3, 15] }}
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color(COL.night);
        scene.fog = new THREE.FogExp2(COL.night, 0.011);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Driver />
      <CameraRig />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={[COL.ice, COL.night, 0.55]} />
      <directionalLight position={[6, 8, 10]} intensity={1.6} color="#f2f6ff" />
      <directionalLight position={[-8, -4, -6]} intensity={0.5} color={COL.volt} />
      <Dust />
      <Hero />
      <Shaft />
      <Vault />
      <Portal />
    </Canvas>
  );
}
