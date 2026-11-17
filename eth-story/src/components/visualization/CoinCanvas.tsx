"use client";
/**
 * The Ethereum coin in 3D: a #627EEA disc carrying the white / pale-blue
 * logo on both faces. It opens the story, returns when Ethereum launches in
 * 2015, and in the finale assembles from flying logo pieces and can be dragged.
 * Pose is a pure function of the scroll coordinate g (plus drag in the finale).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { engine, subscribeG } from "@/animations/scrollController";
import { chapterIndex, FINALE } from "@/data/coins/eth/chapters";
import { clamp, createStore, lerp, range, smooth } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const ORIGIN = chapterIndex("origin");
const R = 1.25;
const K = R / 34; // logo units (EthGlyph, radius 34) → world units

/** the six logo pieces, in EthGlyph coordinates (y down) */
const PIECES: { pts: [number, number][]; color: string }[] = [
  { pts: [[0, -25.5], [-15.9, 0.3], [0, -6.4]], color: "#ffffff" },
  { pts: [[0, -25.5], [15.9, 0.3], [0, -6.4]], color: "#c1ccf7" },
  { pts: [[-15.9, 0.3], [0, -6.4], [0, 9.6]], color: "#c1ccf7" },
  { pts: [[15.9, 0.3], [0, -6.4], [0, 9.6]], color: "#8a9ff0" },
  { pts: [[-15.9, 3.5], [0, 12.6], [0, 25.2]], color: "#ffffff" },
  { pts: [[15.9, 3.5], [0, 12.6], [0, 25.2]], color: "#c1ccf7" },
];

export const coin = createStore({ yaw: 0, pitch: 0 });

function pose(g: number) {
  const hero = 1 - smooth(range(g, 0.08, 0.18));
  const origin = smooth(range(g, ORIGIN + 0.7, ORIGIN + 0.78)) * (1 - smooth(range(g, ORIGIN + 0.94, ORIGIN + 1.02)));
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
    const g = new THREE.CylinderGeometry(R, R, 0.16, 96);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);
  const discMats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#4f69d6", metalness: 0.35, roughness: 0.35, transparent: true }),
      new THREE.MeshBasicMaterial({ color: "#627eea", transparent: true }),
      new THREE.MeshBasicMaterial({ color: "#627eea", transparent: true }),
    ],
    [],
  );
  // one geometry per piece and face (front z+, back z− mirrored)
  const parts = useMemo(() => {
    const out: { geo: THREE.BufferGeometry; mat: THREE.MeshBasicMaterial; dir: THREE.Vector3; center: THREE.Vector3 }[] = [];
    [1, -1].forEach((face) => {
      PIECES.forEach((p, i) => {
        const v = p.pts.map(([x, y]) => new THREE.Vector3(x * K * face, -y * K, 0));
        const c = v.reduce((a, b) => a.clone().add(b), new THREE.Vector3()).divideScalar(3);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(v.flatMap((q) => [q.x - c.x, q.y - c.y, 0]), 3));
        const center = new THREE.Vector3(c.x, c.y, face * 0.083);
        const dir = new THREE.Vector3(c.x * 1.6 + (i % 2 ? 0.3 : -0.3), c.y * 1.6, face * (0.6 + (i % 3) * 0.25));
        out.push({ geo, mat: new THREE.MeshBasicMaterial({ color: p.color, side: THREE.DoubleSide, transparent: true }), dir, center });
      });
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
      m.rotation.set(e * 0.7 * ((i % 3) - 1), e * 0.9, e * 0.5 * ((i % 2) - 0.5));
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
        <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#c1ccf7" />
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
