"use client";
/**
 * The USDC coin in 3D: the USDC mark (supplied by the site owner) on a cream
 * face with a brass rim. In the finale it assembles from wedge-shaped pieces
 * and can be dragged.
 * Pose is a pure function of the scroll coordinate g (plus drag in the finale).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { asset } from "@/lib/asset";
import { engine, subscribeG } from "@/animations/scrollController";
import { FINALE } from "@/data/coins/usdc/chapters";
import { clamp, createStore, lerp, range, smooth } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const R = 1.25;
const WEDGES = 8;

/** coin face drawn once into a canvas texture */
function faceTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f7f5ef";
  g.beginPath();
  g.arc(256, 256, 256, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#c49a3a";
  g.lineWidth = 16;
  g.beginPath();
  g.arc(256, 256, 206, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#2775ca";
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    g.beginPath();
    g.arc(256 + Math.cos(a) * 234, 256 + Math.sin(a) * 234, 5, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = "#1c5aa0";
  g.font = "600 132px 'Fraunces Variable', Georgia, serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("USDC", 256, 262);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  // swap in the supplied USDC mark on a cream face with a brass ring once it has loaded
  const img = new Image();
  img.onload = () => {
    g.clearRect(0, 0, 512, 512);
    g.fillStyle = "#f6f6f2";
    g.beginPath();
    g.arc(256, 256, 256, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#c49a3a";
    g.lineWidth = 14;
    g.beginPath();
    g.arc(256, 256, 238, 0, Math.PI * 2);
    g.stroke();
    g.drawImage(img, 44, 44, 424, 424);
    tex.needsUpdate = true;
  };
  img.src = asset("/img/usdc.png");
  return tex;
}

export const coin = createStore({ yaw: 0, pitch: 0 });

function pose(g: number) {
  const hero = 0; // the intro uses the vault door instead of the coin
  const origin = 0; // no mid-story coin in this edition
  const fin = smooth(range(g, FINALE + 0.16, FINALE + 0.28));
  const assemble = smooth(range(g, FINALE + 0.2, FINALE + 0.45));
  const vis = Math.max(hero, origin, fin);
  let y = 0.1, s = 0.95, explode = 0;
  if (hero > 0) {
    explode = (1 - hero) * 1.2;
  } else if (origin > 0) {
    y = 1.05;
    s = 0.58;
    explode = (1 - origin) * 0.8;
  } else if (fin > 0) {
    y = 0.12;
    s = 1.0;
    explode = lerp(2.4, 0, assemble) + (1 - fin) * 1.5;
  }
  return { vis, y, s, explode, explore: smooth(range(g, FINALE + 0.48, FINALE + 0.58)) };
}

function Coin() {
  const group = useRef<THREE.Group>(null);
  const disc = useRef<THREE.Mesh>(null);
  const pieces = useRef<(THREE.Mesh | null)[]>([]);
  const spin = useRef(0);

  const discGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(R, R, 0.16, 96, 1, true);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);
  const discMats = useMemo(() => [new THREE.MeshStandardMaterial({ color: "#c49a3a", metalness: 0.55, roughness: 0.3, transparent: true, side: THREE.DoubleSide })], []);
  // eight wedges per face, each carrying its slice of the face texture
  const parts = useMemo(() => {
    const tex = faceTexture();
    const out: { geo: THREE.BufferGeometry; mat: THREE.MeshBasicMaterial; dir: THREE.Vector3; center: THREE.Vector3; face: number }[] = [];
    [1, -1].forEach((face) => {
      for (let i = 0; i < WEDGES; i++) {
        const a0 = (i / WEDGES) * Math.PI * 2;
        const geo = new THREE.CircleGeometry(R, 12, a0, (Math.PI * 2) / WEDGES);
        const mid = a0 + Math.PI / WEDGES;
        const center = new THREE.Vector3(0, 0, face * 0.081);
        const dir = new THREE.Vector3(Math.cos(mid) * 1.6, Math.sin(mid) * 1.6, face * (0.5 + (i % 3) * 0.3));
        out.push({ geo, mat: new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.FrontSide }), dir, center, face });
      }
    });
    return out;
  }, []);

  useFrame((state, dt) => {
    const gr = group.current;
    if (!gr) return;
    const p = pose(engine.g);
    const d = coin.get();
    gr.visible = p.vis > 0.01;
    if (!gr.visible) return;
    if (!engine.reduced) spin.current += Math.min(dt, 0.05) * (0.55 * (1 - p.explore) + 0.12 * p.explore);
    gr.position.set(0, p.y + (engine.reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.04), 0);
    gr.scale.setScalar(p.s * lerp(0.6, 1, p.vis));
    // gentle sway so the face stays readable; a full turn every few seconds in between
    const sway = Math.sin(spin.current) * 0.9;
    gr.rotation.set(0.08 + d.pitch * p.explore, sway * (1 - p.explore) + (spin.current * 0.25 + d.yaw) * p.explore, 0);
    discMats.forEach((m) => (m.opacity = p.vis * (1 - clamp(p.explode / 1.2) * 0.9)));
    parts.forEach((pt, i) => {
      const m = pieces.current[i];
      if (!m) return;
      const e = p.explode;
      m.position.copy(pt.center).addScaledVector(pt.dir, e);
      m.rotation.set(e * 0.7 * ((i % 3) - 1), (pt.face < 0 ? Math.PI : 0) + e * 0.9, e * 0.5 * ((i % 2) - 0.5));
      pt.mat.opacity = p.vis;
    });
  });

  return (
    <group ref={group}>
      <mesh ref={disc} geometry={discGeo} material={discMats} />
      {parts.map((pt, i) => (
        <mesh
          key={i}
          ref={(m) => {
            pieces.current[i] = m;
          }}
          geometry={pt.geo}
          material={pt.mat}
        />
      ))}
    </group>
  );
}

function useDrag(el: HTMLElement | null) {
  useEffect(() => {
    if (!el) return;
    let down = false, sx = 0, sy = 0, y0 = 0, p0 = 0;
    const onDown = (e: PointerEvent) => {
      if (pose(engine.g).explore < 0.5) return;
      down = true;
      sx = e.clientX;
      sy = e.clientY;
      y0 = coin.get().yaw;
      p0 = coin.get().pitch;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      coin.set({ yaw: y0 + (e.clientX - sx) * 0.01, pitch: clamp(p0 + (e.clientY - sy) * 0.008, -1.2, 1.2) });
    };
    const onUp = () => {
      down = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [el]);
}

export default function CoinCanvas({ mobile }: { mobile: boolean }) {
  const { t } = useI18n();
  const [active, setActive] = useState(true);
  const [explore, setExplore] = useState(false);
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  useDrag(wrap);

  useEffect(
    () =>
      subscribeG((g) => {
        const p = pose(g);
        setActive(p.vis > 0.005);
        setExplore(p.explore > 0.5);
        if (wrap) wrap.style.opacity = String(clamp(p.vis * 1.2));
      }),
    [wrap],
  );

  return (
    <div
      ref={setWrap}
      className="absolute inset-0"
      style={{ visibility: active ? "visible" : "hidden", pointerEvents: explore ? "auto" : "none", touchAction: explore ? "none" : "auto", cursor: explore ? "grab" : "default" }}
      aria-hidden={!explore}
    >
      <Canvas flat frameloop={active ? "always" : "never"} dpr={[1, mobile ? 1.75 : 2]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 8], fov: 35 }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 5, 6]} intensity={2} />
        <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#fff4d9" />
        <Coin />
      </Canvas>
      {explore && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[7%] flex justify-center px-4">
          <div className="tag border border-line bg-paper/90 px-4 py-2 text-center text-mute backdrop-blur">{t.ui.dragHint}</div>
        </div>
      )}
    </div>
  );
}
