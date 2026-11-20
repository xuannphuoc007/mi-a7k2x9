"use client";
/**
 * Full-screen 3D layer: daylight, studio reflections, the train and its world.
 * Everything is a pure function of the scroll coordinate g (engine.g), so the
 * journey plays forwards and backwards exactly.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { engine } from "@/animations/scrollController";
import { chapters, CHAPTER_COUNT, DEPART } from "@/data/coins/link/chapters";
import { useI18n } from "@/lib/i18n";
import Train from "./Train";
import World, { type StationInfo } from "./World";
import { distance, live, speed01 } from "./motion";
import { destinationSign, fontsReady, sideDecal, stationSign } from "./textures";

const SKY_FOG = "#e2ecf2";

/** camera shots, relative to the (fixed) train. look = what the lens points at. */
type Shot = { p: [number, number, number]; l: [number, number, number]; fov: number };
const SHOTS: Record<string, Shot> = {
  hero: { p: [36, 6.5, 27], l: [-6, 2.0, 0], fov: 30 },
  side: { p: [-4, 5.5, 46], l: [-19, 2.2, 0], fov: 32 },
  front: { p: [34, 3.6, 10], l: [0, 2.3, 0], fov: 28 },
  high: { p: [40, 30, 52], l: [-20, 0.5, -2], fov: 32 },
  platform: { p: [14, 2.75, -4.3], l: [-14, 2.4, 0.4], fov: 42 },
  low: { p: [20, 1.8, 15], l: [-8, 2.8, 0], fov: 34 },
  far: { p: [80, 52, 96], l: [-24, 0, -8], fov: 30 },
  run: { p: [22, 4.2, 20], l: [-8, 2.2, 0], fov: 34 },
};
const PLAN = ["hero", "side", "front", "high", "low", "side", "front", "hero", "high", "front", "far"];
// phones: the train lives in a narrow band between the board and the cards, so keep it close
const PLAN_M = ["hero", "front", "side", "front", "low", "hero", "front", "low", "side", "front", "hero"];

const v3 = (a: [number, number, number]) => new THREE.Vector3(...a);
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function shotAt(i: number, p: number, mobile: boolean) {
  const plan = mobile ? PLAN_M : PLAN;
  const s = SHOTS[plan[Math.min(plan.length - 1, Math.max(0, i))]];
  const pos = v3(s.p);
  const look = v3(s.l);
  if (mobile) {
    pos.x += 6;
    look.x += 6;
  }
  // slow orbit while dwelling, so the picture is never frozen
  const yaw = (p - 0.4) * 0.16;
  const off = pos.clone().sub(look).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  if (mobile) off.multiplyScalar(1.28);
  return { pos: look.clone().add(off), look, fov: s.fov + (mobile ? 14 : 0) };
}

function blendShot(a: ReturnType<typeof shotAt>, b: ReturnType<typeof shotAt>, t: number) {
  return { pos: a.pos.clone().lerp(b.pos, t), look: a.look.clone().lerp(b.look, t), fov: a.fov + (b.fov - a.fov) * t };
}

function runShot(mobile: boolean) {
  const s = SHOTS.run;
  const look = v3(s.l);
  const off = v3(s.p).sub(look);
  if (mobile) off.multiplyScalar(1.25);
  return { pos: look.clone().add(off), look, fov: s.fov + (mobile ? 14 : 0) };
}

function Rig({ mobile }: { mobile: boolean }) {
  const { camera, size } = useThree();
  useFrame(() => {
    const g = Math.max(0, Math.min(CHAPTER_COUNT - 1e-4, engine.g));
    live.g = g;
    live.S = distance(g);
    live.v = speed01(g);
    const i = Math.floor(g);
    const p = g - i;
    let shot = shotAt(i, p, mobile);
    if (i < CHAPTER_COUNT - 1 && p > DEPART) {
      const r = runShot(mobile);
      const t = (p - DEPART) / (1 - DEPART);
      const next = shotAt(i + 1, 0, mobile);
      shot = t < 0.5 ? blendShot(shot, r, smooth(0, 0.42, t)) : blendShot(r, next, smooth(0.58, 1, t));
    }
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.copy(shot.pos);
    cam.lookAt(shot.look);
    if (Math.abs(cam.fov - shot.fov) > 0.01) {
      cam.fov = shot.fov;
    }
    // frame the train between the text column and the board on desktop, lower on phones
    const w = size.width,
      h = size.height;
    if (mobile) cam.setViewOffset(w, h, 0, -h * 0.02, w, h);
    else cam.setViewOffset(w, h, -w * 0.07, -h * 0.11, w, h);
    cam.updateProjectionMatrix();
  });
  return null;
}

function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = 0.55;
    scene.fog = new THREE.Fog(SKY_FOG, 110, 620);
    // daylight sky painted into the framebuffer (an opaque canvas composites more reliably)
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 256;
    const x = c.getContext("2d")!;
    const gr = x.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "#b4d4ee");
    gr.addColorStop(0.38, "#cde2f1");
    gr.addColorStop(0.62, SKY_FOG);
    gr.addColorStop(1, "#e6ede8");
    x.fillStyle = gr;
    x.fillRect(0, 0, 4, 256);
    const bg = new THREE.CanvasTexture(c);
    bg.colorSpace = THREE.SRGBColorSpace;
    scene.background = bg;
    return () => {
      bg.dispose();
      tex.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Sun({ mobile }: { mobile: boolean }) {
  const ref = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();
  useEffect(() => {
    const l = ref.current;
    if (!l) return;
    l.target.position.set(-21, 0, 0);
    scene.add(l.target);
    const c = l.shadow.camera as THREE.OrthographicCamera;
    c.left = -46;
    c.right = 46;
    c.top = 30;
    c.bottom = -30;
    c.near = 1;
    c.far = 200;
    c.updateProjectionMatrix();
    l.shadow.bias = -0.0004;
    l.shadow.normalBias = 0.03;
  }, [scene]);
  return (
    <directionalLight
      ref={ref}
      position={[-21 + 38, 62, 46]}
      intensity={2.3}
      color="#fff6e8"
      castShadow
      shadow-mapSize-width={mobile ? 1024 : 2048}
      shadow-mapSize-height={mobile ? 1024 : 2048}
    />
  );
}

export default function TrainScene({ mobile }: { mobile: boolean }) {
  const { t, lang } = useI18n();
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [departing, setDeparting] = useState(false);

  useEffect(() => {
    let alive = true;
    fontsReady().then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  // track which station the sign should name, without re-rendering every frame
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const g = Math.max(0, engine.g);
      const i = Math.min(CHAPTER_COUNT - 1, Math.floor(g));
      const dep = i < CHAPTER_COUNT - 1 && g - i > DEPART;
      setChapter((c) => (c === i ? c : i));
      setDeparting((d) => (d === dep ? d : dep));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const decal = useMemo(() => (ready ? sideDecal() : null), [ready]);
  const signText = useMemo(() => {
    const k = departing ? chapter + 1 : chapter;
    const n = String(k + 1).padStart(2, "0");
    return `${departing ? "→ " : ""}${n} ${t.chapters[k].label.toUpperCase()}`;
  }, [chapter, departing, t]);
  const sign = useMemo(() => (ready ? destinationSign(signText) : null), [ready, signText]);
  useEffect(() => () => sign?.dispose(), [sign]);

  const stations: StationInfo[] = useMemo(
    () =>
      chapters.map((c, i) => ({
        line: c.line,
        tex: ready ? stationSign(String(i + 1).padStart(2, "0"), t.chapters[i].label, c.line, `${t.ui.line} LINK · ${t.acts[c.act]}`) : null,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, lang],
  );

  return (
    <Canvas
      shadows
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 32, near: 0.3, far: 900, position: [17, 4.6, 15.5] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.02;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <Env />
      <hemisphereLight args={["#dcecff", "#e8e1d4", 0.85]} />
      <Sun mobile={mobile} />
      <Rig mobile={mobile} />
      <Train sign={sign} decal={decal} />
      <World mobile={mobile} stations={stations} />
    </Canvas>
  );
}
