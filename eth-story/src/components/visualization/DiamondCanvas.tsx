"use client";
/**
 * The Ethereum diamond in 3D: an upper bipyramid (8 facets) above a lower
 * chevron (4 facets) — twelve facets, one per chapter. It opens the story,
 * reappears when Ethereum launches in 2015, and returns in the finale where
 * it assembles from scattered facets and can be dragged and clicked.
 * Pose is a pure function of the scroll coordinate g (plus drag in the finale).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { engine, goToChapter, subscribeG } from "@/animations/scrollController";
import { chapterIndex, chapters, FINALE } from "@/data/coins/eth/chapters";
import { clamp, createStore, lerp, range, smooth, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const ORIGIN = chapterIndex("origin");
const PALETTE = ["#c8b2f5", "#87a9f0", "#b8faf6", "#f0cdc2", "#cab3f5", "#eecbc0", "#a7b6f2", "#d6c8fb", "#9fd8f2", "#f3d9cf", "#8f9fe8", "#bfe9f5"];

export const diamond = createStore({ yaw: 0, pitch: 0, hovered: -1, selected: -1 });

type Facet = { a: THREE.Vector3; b: THREE.Vector3; c: THREE.Vector3; n: THREE.Vector3; center: THREE.Vector3 };

function buildFacets(): Facet[] {
  const T = new THREE.Vector3(0, 1.55, 0);
  const B = new THREE.Vector3(0, -0.5, 0);
  const D = new THREE.Vector3(0, -1.6, 0);
  const r = 0.95;
  const E = [0, 1, 2, 3].map((i) => new THREE.Vector3(Math.cos((i * Math.PI) / 2) * r, 0, Math.sin((i * Math.PI) / 2) * r));
  const R = E.map((e) => new THREE.Vector3(e.x, -0.22, e.z));
  const tri: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [];
  for (let i = 0; i < 4; i++) tri.push([T, E[(i + 1) % 4], E[i]]);
  for (let i = 0; i < 4; i++) tri.push([B, E[i], E[(i + 1) % 4]]);
  for (let i = 0; i < 4; i++) tri.push([D, R[i], R[(i + 1) % 4]]);
  return tri.map(([a, b, c]) => {
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
    const center = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);
    if (n.dot(center) < 0) n.negate();
    return { a, b, c, n, center };
  });
}

/** visibility, position, scale, explode and spin as a function of g */
function pose(g: number) {
  const hero = 1 - smooth(range(g, 0.08, 0.18));
  const origin = smooth(range(g, ORIGIN + 0.7, ORIGIN + 0.78)) * (1 - smooth(range(g, ORIGIN + 0.94, ORIGIN + 1.02)));
  const fin = smooth(range(g, FINALE + 0.16, FINALE + 0.28));
  const assemble = smooth(range(g, FINALE + 0.2, FINALE + 0.45));
  const vis = Math.max(hero, origin, fin);
  let x = 0, y = 0.1, s = 0.9, explode = 0;
  if (hero > 0) {
    explode = (1 - hero) * 1.2;
  } else if (origin > 0) {
    y = 1.05;
    s = 0.55;
    explode = (1 - origin) * 0.8;
  } else if (fin > 0) {
    y = 0.15;
    s = 0.95;
    explode = lerp(2.2, 0, assemble) + (1 - fin) * 1.5;
  }
  return { vis, x, y, s, explode, explore: smooth(range(g, FINALE + 0.48, FINALE + 0.58)) };
}

function Diamond() {
  const group = useRef<THREE.Group>(null);
  const facets = useMemo(buildFacets, []);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const mats = useMemo(
    () => PALETTE.map((c) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.25, roughness: 0.35, flatShading: true, side: THREE.DoubleSide, transparent: true, emissive: new THREE.Color("#627eea"), emissiveIntensity: 0 })),
    [],
  );
  const geos = useMemo(
    () =>
      facets.map((f) => {
        const g = new THREE.BufferGeometry();
        const a = f.a.clone().sub(f.center), b = f.b.clone().sub(f.center), c = f.c.clone().sub(f.center);
        g.setAttribute("position", new THREE.Float32BufferAttribute([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z], 3));
        g.computeVertexNormals();
        return g;
      }),
    [facets],
  );
  const edges = useMemo(() => geos.map((g) => new THREE.EdgesGeometry(g)), [geos]);
  const spin = useRef(0);

  useFrame((state, dt) => {
    const gr = group.current;
    if (!gr) return;
    const g = engine.g;
    const p = pose(g);
    const d = diamond.get();
    gr.visible = p.vis > 0.01;
    if (!gr.visible) return;
    if (!engine.reduced) spin.current += Math.min(dt, 0.05) * (0.35 * (1 - p.explore) + 0.08 * p.explore);
    gr.position.set(p.x, p.y + (engine.reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.04), 0);
    gr.scale.setScalar(p.s * lerp(0.6, 1, p.vis));
    gr.rotation.set(0.12 + d.pitch * p.explore, spin.current + d.yaw * p.explore, 0);
    facets.forEach((f, i) => {
      const m = meshes.current[i];
      if (!m) return;
      const k = p.explode * (0.6 + ((i * 37) % 11) / 11);
      m.position.copy(f.center).addScaledVector(f.n, k);
      m.rotation.set(k * 0.6 * ((i % 3) - 1), k * 0.8, k * 0.4 * ((i % 2) - 0.5));
      const mat = mats[i];
      mat.opacity = p.vis;
      const hi = i === d.selected ? 0.55 : i === d.hovered ? 0.3 : 0;
      mat.emissiveIntensity = lerp(mat.emissiveIntensity, hi * p.explore, 0.2);
    });
  });

  return (
    <group ref={group}>
      {facets.map((f, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshes.current[i] = m;
          }}
          geometry={geos[i]}
          material={mats[i]}
          onPointerOver={(e) => {
            if (pose(engine.g).explore < 0.5) return;
            e.stopPropagation();
            diamond.set({ hovered: i });
          }}
          onPointerOut={() => diamond.set({ hovered: -1 })}
          onClick={(e) => {
            if (pose(engine.g).explore < 0.5) return;
            e.stopPropagation();
            diamond.set((s) => ({ selected: s.selected === i ? -1 : i }));
          }}
        >
          <lineSegments geometry={edges[i]}>
            <lineBasicMaterial color="#0b0d17" transparent opacity={0.35} />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
}

function useDrag(el: HTMLElement | null) {
  useEffect(() => {
    if (!el) return;
    let down = false, sx = 0, sy = 0, y0 = 0, p0 = 0, moved = 0;
    const onDown = (e: PointerEvent) => {
      if (pose(engine.g).explore < 0.5) return;
      down = true;
      moved = 0;
      sx = e.clientX;
      sy = e.clientY;
      y0 = diamond.get().yaw;
      p0 = diamond.get().pitch;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      moved = Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy);
      diamond.set({ yaw: y0 + (e.clientX - sx) * 0.01, pitch: clamp(p0 + (e.clientY - sy) * 0.008, -1.2, 1.2) });
    };
    const onUp = () => {
      down = false;
      el.style.cursor = "grab";
      void moved;
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

export default function DiamondCanvas({ mobile }: { mobile: boolean }) {
  const { t } = useI18n();
  const [active, setActive] = useState(true);
  const [explore, setExplore] = useState(false);
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  const selected = useStore(diamond, (s) => s.selected);
  const hovered = useStore(diamond, (s) => s.hovered);
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

  const shown = selected >= 0 ? selected : hovered;
  return (
    <div
      ref={setWrap}
      className="absolute inset-0"
      style={{ visibility: active ? "visible" : "hidden", pointerEvents: explore ? "auto" : "none", touchAction: explore ? "none" : "auto", cursor: explore ? "grab" : "default" }}
      aria-hidden={!explore}
    >
      <Canvas frameloop={active ? "always" : "never"} dpr={[1, mobile ? 1.75 : 2]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 8], fov: 35 }} onPointerMissed={() => diamond.set({ selected: -1 })}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 5, 6]} intensity={2.1} />
        <directionalLight position={[-4, -2, 3]} intensity={0.7} color="#87a9f0" />
        <pointLight position={[0, 0, 4]} intensity={4} distance={12} color="#c8b2f5" />
        <Diamond />
      </Canvas>
      {explore && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[6%] flex justify-center px-4">
          <div className="pointer-events-auto max-w-[min(92%,480px)] border border-line bg-paper/90 px-4 py-2.5 text-center backdrop-blur">
            {shown >= 0 ? (
              <>
                <div className="tag text-accent">
                  {t.ui.facet} {String(shown + 1).padStart(2, "0")} · {t.acts[chapters[shown].act]}
                </div>
                <div className="serif mt-0.5 text-[17px] leading-tight">{t.chapters[shown].title}</div>
                {selected >= 0 && (
                  <button onClick={() => goToChapter(selected)} className="tag mt-2 border border-accent px-2.5 py-1 text-accent hover:bg-accent hover:text-paper">
                    {t.ui.goChapter} →
                  </button>
                )}
              </>
            ) : (
              <div className="tag text-mute">{t.ui.facetHint}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
