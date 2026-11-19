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
import Mint from "./Mint";
import Network from "./Network";
import Market from "./Market";
import Control from "./Control";
import Cast from "./Cast";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { COL, clock, rnd, xr, LOOK, g } from "./shared";
import { scrollState as SS } from "@/lib/timeline";

/** One render loop drives clocks and the X-RAY blend; the scene graph never rebuilds on toggle. */
function Driver() {
  const { scene } = useThree();
  const bg = useMemo(() => new THREE.Color(COL.night), []);
  const bgX = useMemo(() => new THREE.Color("#e2ebf7"), []);
  useFrame((_, dt) => {
    const { xray, reduced } = useView.getState();
    clock.reduced = reduced;
    if (!reduced) clock.t += Math.min(dt, 0.05);
    const k = reduced ? 1 : 1 - Math.exp(-dt * 6);
    xr.v += ((xray ? 1 : 0) - xr.v) * k;
    (scene.background as THREE.Color).copy(bg).lerp(bgX, xr.v);
    if (scene.fog) {
      const f = scene.fog as THREE.FogExp2;
      f.color.copy(scene.background as THREE.Color);
      // thin the haze for the long flight home and the system map
      const wide = SS.u > g("s09", 0.48) && SS.u < g("s09", 0.8) ? 1 : SS.u > g("end", 0.15) ? 1 : 0;
      f.density += ((wide ? 0.0028 : 0.0085) - f.density) * k;
    }
  });
  return null;
}

/** Image-based light from a procedural studio room: gives metal and glass real reflections, no network fetch. */
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = 0.65;
    return () => {
      tex.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** Daylight sun whose shadow box follows what the camera is looking at. */
function Sun() {
  const light = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();
  useEffect(() => {
    if (light.current) scene.add(light.current.target);
  }, [scene]);
  useFrame(() => {
    const l = light.current;
    if (!l) return;
    l.target.position.copy(LOOK);
    l.position.copy(LOOK).add(SUN_OFF);
    l.target.updateMatrixWorld();
  });
  const mobile = typeof window !== "undefined" && window.innerWidth < 760;
  return (
    <directionalLight
      ref={light}
      intensity={1.9}
      color="#fffaf0"
      castShadow={!mobile}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-22}
      shadow-camera-right={22}
      shadow-camera-top={22}
      shadow-camera-bottom={-22}
      shadow-camera-near={1}
      shadow-camera-far={90}
      shadow-bias={-0.0004}
      shadow-normalBias={0.02}
    />
  );
}
const SUN_OFF = new THREE.Vector3(14, 30, 18);

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
      <pointsMaterial color="#9fb3cc" size={0.06} transparent opacity={0.35} depthWrite={false} sizeAttenuation />
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
      shadows
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 46, near: 0.05, far: 600, position: [0, 0.3, 15] }}
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color(COL.night);
        scene.fog = new THREE.FogExp2(COL.night, 0.0085);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.9;
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
    >
      <Driver />
      <CameraRig />
      <Env />
      <Sun />
      <ambientLight intensity={0.12} />
      <hemisphereLight args={["#ffffff", "#b9c4d3", 0.5]} />
      <Dust />
      <Hero />
      <Shaft />
      <Vault />
      <Portal />
      <Mint />
      <Network />
      <Market />
      <Control />
      <Cast />
    </Canvas>
  );
}
