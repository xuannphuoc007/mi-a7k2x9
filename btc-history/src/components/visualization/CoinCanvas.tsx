"use client";
/**
 * The 3D bitcoin. It is a pure function of the chart frame: a large hero coin
 * inside a spinning "block" in the opening, then a small coin riding the
 * playhead (or the crosshair). Scroll speed spins it; all-time highs flash it
 * gold and crashes tint it red.
 */
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { frame } from "@/animations/chartController";
import { engine } from "@/animations/scrollController";
import { clamp, lerp, mulberry32 } from "@/lib/store";

const HW = 2 * 8 * Math.tan((17.5 * Math.PI) / 180); // world height visible at z = 0
const K = HW / 1000;

function faceTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(200, 180, 40, 256, 256, 260);
  grd.addColorStop(0, "#ffb347");
  grd.addColorStop(0.55, "#f7931a");
  grd.addColorStop(1, "#b55f06");
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 512);
  // rim rings
  g.strokeStyle = "rgba(255,230,190,0.55)";
  g.lineWidth = 10;
  g.beginPath();
  g.arc(256, 256, 236, 0, Math.PI * 2);
  g.stroke();
  g.strokeStyle = "rgba(120,60,0,0.35)";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(256, 256, 214, 0, Math.PI * 2);
  g.stroke();
  // tick marks around the edge
  g.strokeStyle = "rgba(255,240,215,0.35)";
  g.lineWidth = 3;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    g.beginPath();
    g.moveTo(256 + Math.cos(a) * 222, 256 + Math.sin(a) * 222);
    g.lineTo(256 + Math.cos(a) * 230, 256 + Math.sin(a) * 230);
    g.stroke();
  }
  // the ₿ mark, drawn: a bold B with two bars, tilted like the familiar logo
  g.save();
  g.translate(256, 262);
  g.rotate((14 * Math.PI) / 180);
  g.fillStyle = "#fff6ea";
  g.shadowColor = "rgba(90,40,0,0.45)";
  g.shadowBlur = 12;
  g.shadowOffsetY = 6;
  g.font = "800 300px 'Space Grotesk Variable', Arial, Helvetica, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("B", 6, 8);
  for (const x of [-34, 14]) {
    g.fillRect(x, -158, 24, 46);
    g.fillRect(x, 112, 24, 46);
  }
  g.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Coin() {
  const group = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const cube = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const last = useRef({ g: 0, spin: 0, vel: 0 });
  const mats = useMemo(() => {
    const tex = typeof document !== "undefined" ? faceTexture() : null;
    const face = new THREE.MeshStandardMaterial({ map: tex, metalness: 0.55, roughness: 0.32, emissive: new THREE.Color("#000000") });
    const side = new THREE.MeshStandardMaterial({ color: "#d9800f", metalness: 0.85, roughness: 0.3, emissive: new THREE.Color("#000000") });
    return { face, side };
  }, []);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.3, 2.3, 2.3)), []);
  const edges2 = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 1.5, 1.5)), []);
  const gold = useMemo(() => new THREE.Color("#ffc65c"), []);
  const red = useMemo(() => new THREE.Color("#ff3b2f"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state, dt) => {
    const f = frame.current;
    const gr = group.current;
    if (!f || !gr || !spinner.current) return;
    const d = Math.min(dt, 0.05);
    const L = last.current;
    const dg = f.g - L.g;
    L.g = f.g;
    L.vel = lerp(L.vel, Math.abs(dg) / Math.max(d, 1e-3), 0.12);
    const reduced = engine.reduced;

    const rUnits = lerp(13 * f.u * f.coin.scale, 150, f.hero);
    const s = Math.max(0.0001, rUnits * K);
    gr.position.set((f.coin.x + f.shake.x - 500) * K, (500 - f.coin.y - f.shake.y) * K, 0);
    gr.scale.setScalar(s);
    gr.visible = s > 0.002;

    // spin: idle drift + scroll velocity
    if (!reduced) L.spin += d * (0.55 + Math.min(L.vel, 3) * 7);
    const wobble = reduced ? 0 : Math.sin(state.clock.elapsedTime * 1.3) * 0.12;
    spinner.current.rotation.set(Math.PI / 2 + wobble * 0.6 - 0.18 * f.hero, L.spin, 0);

    // momentum tilt from the line's slope near the coin
    const slope = clamp((f.yOf(f.dot.t - 0.03) - f.dot.y) / 120, -1, 1);
    gr.rotation.z = lerp(gr.rotation.z, slope * 0.35 * (1 - f.hero), 0.1);

    tmp.setRGB(0, 0, 0);
    tmp.lerp(gold, Math.min(1, f.coin.gold * 0.9));
    tmp.lerp(red, Math.min(1, f.coin.red * 0.8));
    mats.face.emissive.copy(tmp);
    mats.side.emissive.copy(tmp);
    mats.face.emissiveIntensity = 0.55;
    mats.side.emissiveIntensity = 0.55;

    if (cube.current) {
      cube.current.visible = f.hero > 0.01;
      cube.current.rotation.x = (reduced ? 0.5 : state.clock.elapsedTime * 0.25) + f.g * 2;
      cube.current.rotation.y = (reduced ? 0.7 : state.clock.elapsedTime * 0.35) + f.g * 3;
      cube.current.scale.setScalar(1 + (1 - f.hero) * 0.6);
      cube.current.children.forEach((c) => (((c as THREE.LineSegments).material as THREE.LineBasicMaterial).opacity = f.hero * 0.55));
    }
    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.35 + f.coin.gold * 0.5;
      m.color.copy(f.coin.red > f.coin.gold ? red : gold);
    }
  });

  return (
    <group ref={group}>
      <mesh ref={halo} position={[0, 0, -0.3]}>
        <circleGeometry args={[1.9, 48]} />
        <meshBasicMaterial transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} map={useGlowTexture()} />
      </mesh>
      <group ref={spinner}>
        <mesh material={[mats.side, mats.face, mats.face]}>
          <cylinderGeometry args={[1, 1, 0.16, 96, 1]} />
        </mesh>
      </group>
      <group ref={cube}>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#f7931a" transparent opacity={0.5} />
        </lineSegments>
        <lineSegments geometry={edges2}>
          <lineBasicMaterial color="#ffc65c" transparent opacity={0.4} />
        </lineSegments>
      </group>
    </group>
  );
}

let glowTex: THREE.Texture | null = null;
function useGlowTexture() {
  return useMemo(() => {
    if (glowTex || typeof document === "undefined") return glowTex;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,0.9)");
    grd.addColorStop(0.35, "rgba(255,255,255,0.25)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    glowTex = new THREE.CanvasTexture(c);
    return glowTex;
  }, []);
}

function Dust() {
  const pts = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const rnd = mulberry32(21);
    const n = 420;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 1.2 + rnd() * 3.6;
      const a = rnd() * Math.PI * 2;
      const b = Math.acos(2 * rnd() - 1);
      pos[i * 3] = Math.sin(b) * Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(b) * Math.sin(a) * r;
      pos[i * 3 + 2] = Math.cos(b) * r * 0.6 - 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((state) => {
    const f = frame.current;
    const p = pts.current;
    if (!f || !p) return;
    if (!engine.reduced) {
      p.rotation.y = state.clock.elapsedTime * 0.04 + f.g * 0.4;
      p.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    (p.material as THREE.PointsMaterial).opacity = 0.18 + f.hero * 0.6 + f.coin.gold * 0.25;
    p.scale.setScalar(1 + f.hero * 0.2);
  });
  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial color="#f7931a" size={0.035} sizeAttenuation transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function CoinCanvas() {
  return (
    <Canvas
      className="!pointer-events-none !absolute inset-0"
      camera={{ position: [0, 0, 8], fov: 35 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 6]} intensity={2.2} />
      <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#ffb060" />
      <pointLight position={[0, 0, 3]} intensity={6} distance={10} color="#ff9a2a" />
      <Dust />
      <Coin />
    </Canvas>
  );
}
