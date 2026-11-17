"use client";
/**
 * The central 3D object: an original layered XRP coin with twelve conceptual
 * layers, each with independently controlled position, rotation, scale,
 * opacity and highlight. Everything is a pure function of the story
 * coordinate `g` (plus explorer state in the finale), so it reverses exactly.
 */
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { engine, subscribeG } from "@/animations/scrollController";
import { cameraAt } from "@/animations/cameraController";
import { layers, type LayerDef } from "@/data/coins/xrp/anatomy";
import { FINALE, COIN } from "@/data/coins/xrp/chapters";
import { ledgerAccounts, ledgerServers, accountServer, serverLinks } from "@/data/coins/xrp/layouts";
import { makeDotTexture, makeLayerTexture, makeRimTexture } from "./coinTextures";
import { clamp, lerp, mulberry32, range, smooth } from "@/lib/store";
import { explorer } from "@/lib/explorerStore";
import { useI18n } from "@/lib/i18n";

const R = 1.55;
const N = layers.length;
const SHELL_HALF = 0.13;
const assembledZ = (i: number) => (i === 0 ? 0 : 0.1 - (i - 1) * 0.0185);
const MID = (N - 1) / 2;
const explodedZ = (i: number, s: number) => (MID - i) * s;

type LState = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number; o: number; h: number };
type Frame = {
  visible: boolean;
  gx: number; gy: number; gz: number; grx: number; gry: number; grz: number;
  shellRim: number; shellBack: number;
  labels: number; annotation: number; explore: number; numLabels: boolean;
  L: LState[];
};

const rnd = mulberry32(1234);
const scatter = layers.map(() => ({
  x: (rnd() - 0.5) * 9, y: (rnd() - 0.5) * 5.5, z: -1.5 - rnd() * 3,
  rx: (rnd() - 0.5) * 3, ry: (rnd() - 0.5) * 3, rz: (rnd() - 0.5) * 3,
}));
const cluster = layers.map((_, i) => ({ x: Math.sin(i * 1.7) * 0.9, y: Math.cos(i * 1.3) * 0.6, z: ((layers.length - 1) / 2 - i) * 0.55 }));

function makeFrame(): Frame {
  return {
    visible: false, gx: 0, gy: 0, gz: 0, grx: 0, gry: 0, grz: 0, shellRim: 1, shellBack: 1,
    labels: 0, annotation: 0, explore: 0, numLabels: true,
    L: layers.map(() => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, o: 1, h: 0 })),
  };
}

/** Choreography for the coin. Writes into `f` to avoid allocations per frame. */
function choreograph(f: Frame, gAbs: number, time: number, reduced: boolean) {
  const ex = explorer.get();
  const g = gAbs - COIN; // intro runs in coin-chapter-local units
  f.visible = (g > -0.05 && g < 0.72) || gAbs > FINALE - 0.16;
  if (gAbs < FINALE - 0.5) {
    const p0 = smooth(range(g, 0, 0.2));
    const e = smooth(range(g, 0.2, 0.45));
    const idle = reduced ? 0 : Math.sin(time * 0.45) * 0.38 * (1 - range(g, 0.02, 0.24));
    f.gx = 0; f.gy = 0; f.gz = 0.55 * p0 * (1 - e);
    f.grx = lerp(0.14, -0.3, e);
    f.gry = idle + lerp(0, -1.0, e) + p0 * (1 - e) * 0.25;
    f.grz = 0;
    f.shellRim = 1 - 0.85 * e;
    f.shellBack = 1 - 0.95 * e;
    f.labels = range(g, 0.27, 0.34) * (1 - range(g, 0.43, 0.48));
    f.annotation = 1 - range(g, 0.16, 0.26);
    f.explore = 0;
    f.numLabels = true;
    for (let i = 0; i < N; i++) {
      const s = f.L[i];
      s.x = 0; s.y = 0;
      s.z = lerp(assembledZ(i), explodedZ(i, 0.42), e);
      s.rx = 0; s.ry = 0; s.rz = e * (i - MID) * 0.035;
      s.s = 1;
      s.o = 1 - smooth(range(g, 0.46 + i * 0.011, 0.57 + i * 0.011));
      s.h = i === 1 ? 0.35 * range(g, 0.3, 0.4) : 0;
    }
    return;
  }
  // finale
  const l = gAbs - FINALE;
  const fade = range(gAbs, FINALE - 0.24, FINALE - 0.02);
  const m = smooth(range(l, -0.2, 0.32));
  const a = smooth(range(l, 0.36, 0.62));
  const c = smooth(range(l, 0.65, 0.82));
  const o = smooth(range(l, 0.86, 0.98));
  f.explore = o;
  f.numLabels = false;
  f.gx = lerp(0, -0.15, o); f.gy = lerp(0, -0.15, o); f.gz = 0;
  f.grx = lerp(lerp(lerp(0.0, -0.3, a), 0.05, c), -1.0, o) + ex.pitch * o;
  f.gry = lerp(lerp(lerp(0.25 * (1 - m), -1.0, a), 0, c), -0.3, o) + ex.yaw * o + (reduced ? 0 : Math.sin(time * 0.3) * 0.04 * o);
  f.grz = c * (1 - o) * 0.0;
  f.shellRim = 0.15 + 0.85 * c * (1 - o);
  f.shellBack = 0.08 + 0.92 * c * (1 - o);
  f.labels = range(l, 0.9, 0.99);
  f.annotation = c * (1 - o) * range(l, 0.74, 0.82);
  const anySel = ex.selected >= 0 || ex.category !== null;
  for (let i = 0; i < N; i++) {
    const s = f.L[i];
    const S = scatter[i], M = cluster[i];
    let x = lerp(S.x, M.x, m), y = lerp(S.y, M.y, m), z = lerp(S.z, M.z, m);
    x = lerp(x, 0, a); y = lerp(y, 0, a); z = lerp(z, explodedZ(i, 0.42), a);
    z = lerp(z, assembledZ(i), c);
    z = lerp(z, explodedZ(i, 0.3), o);
    const member = ex.selected === i || (ex.category !== null && layers[i].category === ex.category);
    const sel = ex.selected === i ? 1 : 0;
    x += sel * 1.0 * o;
    s.x = x; s.y = y; s.z = z;
    s.rx = S.rx * (1 - m); s.ry = S.ry * (1 - m); s.rz = S.rz * (1 - m);
    s.s = 1 + sel * 0.04 * o;
    const dim = anySel && !member ? 0.28 : 1;
    s.o = fade * lerp(1, dim, o);
    s.h = o * (member ? 1 : ex.hovered === i ? 0.5 : 0);
  }
}

/* ───────────────────────── Layer mesh ───────────────────────── */

function LayerMesh({
  def, frame, textures, rimTex, labelRef, numRef, index, onSelect, onHover,
}: {
  def: LayerDef;
  frame: React.MutableRefObject<Frame>;
  textures: THREE.Texture[];
  rimTex: THREE.Texture;
  labelRef: (el: HTMLDivElement | null) => void;
  numRef: (el: HTMLDivElement | null) => void;
  index: number;
  onSelect: (i: number) => void;
  onHover: (i: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const { t } = useI18n();
  const r = R * def.radius;
  const isShell = def.index === 0;
  const thick = isShell ? SHELL_HALF * 2 : 0.012;

  const mats = useMemo(() => {
    const face = new THREE.MeshStandardMaterial({
      map: textures[def.index], transparent: true, alphaTest: 0.03,
      roughness: isShell ? 0.5 : 0.92, metalness: isShell ? 0.22 : 0.0,
      emissive: new THREE.Color("#32e685"), emissiveIntensity: 0,
    });
    const back = new THREE.MeshStandardMaterial({
      map: isShell ? textures[0] : null, color: isShell ? "#ffffff" : def.tint, transparent: true,
      roughness: 0.9, metalness: isShell ? 0.2 : 0, alphaTest: 0.03,
    });
    const side = new THREE.MeshStandardMaterial({
      map: isShell ? rimTex : null, color: isShell ? "#ffffff" : "#c9ccc3", transparent: true, roughness: 0.6, metalness: isShell ? 0.25 : 0,
    });
    const edge = new THREE.LineBasicMaterial({ color: "#171c1e", transparent: true });
    return { face, back, side, edge };
  }, [def, textures, rimTex, isShell]);

  const geo = useMemo(() => {
    const face = new THREE.CircleGeometry(r, 128);
    const side = new THREE.CylinderGeometry(r, r, thick, 128, 1, true);
    side.rotateX(Math.PI / 2);
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 128; k++) {
      const a = (k / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    const edge = new THREE.BufferGeometry().setFromPoints(pts);
    return { face, side, edge };
  }, [r, thick]);

  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      Object.values(geo).forEach((g) => g.dispose());
    },
    [mats, geo],
  );

  useFrame(() => {
    const s = frame.current.L[index];
    const f = frame.current;
    const gr = group.current;
    if (!gr) return;
    gr.position.set(s.x, s.y, s.z);
    gr.rotation.set(s.rx, s.ry, s.rz);
    gr.scale.setScalar(s.s);
    gr.visible = s.o > 0.004;
    const o = clamp(s.o);
    mats.face.opacity = o;
    mats.face.emissiveIntensity = s.h * 0.35;
    mats.back.opacity = isShell ? o * f.shellBack : o;
    mats.side.opacity = isShell ? o * f.shellRim : o * 0.9;
    mats.edge.opacity = o;
    mats.edge.color.set(s.h > 0.5 ? "#12a160" : "#171c1e");
    mats.face.depthWrite = o > 0.5;
  });

  const half = thick / 2;
  return (
    <group ref={group}>
      <mesh
        geometry={geo.face}
        material={mats.face}
        position={[0, 0, half + 0.0005]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (frame.current.explore < 0.9) return;
          e.stopPropagation();
          onSelect(index);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (frame.current.explore < 0.9) return;
          e.stopPropagation();
          onHover(index);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(-1);
          document.body.style.cursor = "";
        }}
      />
      <mesh geometry={geo.face} material={mats.back} position={[0, 0, -half - 0.0005]} rotation={[0, Math.PI, 0]} />
      <mesh geometry={geo.side} material={mats.side} />
      <lineLoop geometry={geo.edge} material={mats.edge} position={[0, 0, half + 0.001]} />
      <Html position={[0, index % 2 ? -r - 0.08 : r + 0.08, half]} zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
        <div ref={numRef} style={{ opacity: 0, transform: `translate(-50%, ${index % 2 ? "0" : "-100%"})`, textAlign: "center" }}>
          {index % 2 ? <div style={{ width: 1, height: 14, background: "var(--color-mute)", margin: "0 auto" }} /> : null}
          <span className="tag" style={{ color: index === 1 ? "var(--color-accent)" : "var(--color-ink)", background: "rgba(247,247,242,.85)", padding: "0 3px" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          {index % 2 ? null : <div style={{ width: 1, height: 14, background: "var(--color-mute)", margin: "0 auto" }} />}
        </div>
      </Html>
      <Html position={[r * 0.72, -r * 0.72, half]} zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
        <div ref={labelRef} style={{ opacity: 0, transform: "translate(6px,-50%)", whiteSpace: "nowrap", transition: "color .2s" }}>
          <span className="tag" style={{ color: "var(--color-mute)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="tag" style={{ color: "var(--color-ink)", marginLeft: 6, background: "rgba(247,247,242,.82)", padding: "1px 4px" }}>
            {t.anatomy[index].name}
          </span>
        </div>
      </Html>
    </group>
  );
}

/* ───────────────────────── Particles ───────────────────────── */

function Particles({ count, frameGroup }: { count: number; frameGroup: React.MutableRefObject<THREE.Group | null> }) {
  const size = useThree((s) => s.size);
  const pointsRef = useRef<THREE.Points>(null);
  const dot = useMemo(() => makeDotTexture(), []);

  const data = useMemo(() => {
    const r = mulberry32(99);
    const src = new Float32Array(count * 3);
    const mid = new Float32Array(count * 3);
    const delay = new Float32Array(count);
    const layerOf = new Uint8Array(count);
    const local = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const li = Math.floor(r() * N);
      layerOf[i] = li;
      const a = r() * Math.PI * 2;
      const rr = Math.sqrt(r()) * R * layers[li].radius;
      local[i * 2] = Math.cos(a) * rr;
      local[i * 2 + 1] = Math.sin(a) * rr;
      const th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1), d = 2.2 + r() * 2.2;
      mid[i * 3] = Math.sin(ph) * Math.cos(th) * d * 1.35;
      mid[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * d * 0.8;
      mid[i * 3 + 2] = Math.cos(ph) * d * 0.6;
      delay[i] = r();
    }
    const colors = new Float32Array(count * 3);
    const ink = new THREE.Color("#eef2f3"), acc = new THREE.Color("#32e685");
    for (let i = 0; i < count; i++) {
      const c = r() < 0.16 ? acc : ink;
      colors.set([c.r, c.g, c.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { src, mid, delay, layerOf, local, geo, srcReady: false };
  }, [count]);

  // targets on the canonical plane, matched to the SVG ledger layout
  const targets = useMemo(() => {
    const r = mulberry32(5);
    const T = new Float32Array(count * 3);
    const Hw = 2 * 8 * Math.tan((35 * Math.PI) / 360);
    const k = (Math.min(size.width, size.height) / 1000) * (Hw / size.height);
    const put = (i: number, x: number, y: number) => {
      T[i * 3] = (x - 500) * k;
      T[i * 3 + 1] = -(y - 500) * k;
      T[i * 3 + 2] = 0;
    };
    const edges: [number, number, number, number][] = [];
    ledgerAccounts.forEach((acc, i) => {
      const s = ledgerServers[accountServer[i]];
      edges.push([acc.x, acc.y, s.x, s.y]);
    });
    serverLinks.forEach(([a, b]) => edges.push([ledgerServers[a].x, ledgerServers[a].y, ledgerServers[b].x, ledgerServers[b].y]));
    for (let i = 0; i < count; i++) {
      const u = i / count;
      if (u < 0.55) {
        const n = ledgerAccounts[i % ledgerAccounts.length];
        const ring = r() < 0.7;
        const a = r() * Math.PI * 2;
        const rad = ring ? 21 + (r() - 0.5) * 3 : Math.sqrt(r()) * 12;
        put(i, n.x + Math.cos(a) * rad, n.y + Math.sin(a) * rad);
      } else if (u < 0.75) {
        const n = ledgerServers[i % ledgerServers.length];
        const side = Math.floor(r() * 4), t = r() * 2 - 1;
        const h = 15;
        const [dx, dy] = side === 0 ? [t * h, -h] : side === 1 ? [h, t * h] : side === 2 ? [t * h, h] : [-h, t * h];
        put(i, n.x + dx, n.y + dy);
      } else {
        const e = edges[i % edges.length];
        const t = 0.12 + r() * 0.76;
        put(i, lerp(e[0], e[2], t) + (r() - 0.5) * 2, lerp(e[1], e[3], t) + (r() - 0.5) * 2);
      }
    }
    return T;
  }, [count, size.width, size.height]);

  useEffect(() => () => { data.geo.dispose(); dot.dispose(); }, [data, dot]);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const m4 = useMemo(() => new THREE.Matrix4(), []);
  const obj = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const g = engine.g - COIN;
    const pts = pointsRef.current;
    if (!pts) return;
    const visible = g > 0.44 && g < 1.12;
    pts.visible = visible;
    if (!visible) {
      data.srcReady = false;
      return;
    }
    // capture source positions once from the exploded coin as it dissolves
    if (!data.srcReady && frameGroup.current) {
      const fg = frameGroup.current;
      fg.updateMatrixWorld(true);
      for (let i = 0; i < count; i++) {
        const li = data.layerOf[i];
        obj.position.set(0, 0, explodedZ(li, 0.42));
        obj.rotation.set(0, 0, (li - MID) * 0.035);
        obj.updateMatrix();
        m4.multiplyMatrices(fg.matrixWorld, obj.matrix);
        tmp.set(data.local[i * 2], data.local[i * 2 + 1], 0).applyMatrix4(m4);
        data.src[i * 3] = tmp.x; data.src[i * 3 + 1] = tmp.y; data.src[i * 3 + 2] = tmp.z;
      }
      data.srcReady = true;
    }
    const pos = data.geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const d = data.delay[i];
      const s = smooth(range(g, 0.46 + d * 0.08, 0.7 + d * 0.06));
      const t = smooth(range(g, 0.72 + d * 0.1, 0.97 + d * 0.02));
      for (let k = 0; k < 3; k++) {
        const j = i * 3 + k;
        arr[j] = lerp(lerp(data.src[j], data.mid[j], s), targets[j], t);
      }
    }
    pos.needsUpdate = true;
    const mat = pts.material as THREE.PointsMaterial;
    mat.opacity = range(g, 0.45, 0.52) * (1 - range(g, 1.0, 1.1));
    mat.size = lerp(0.05, 0.034, range(g, 0.72, 1));
  });

  return (
    <points ref={pointsRef} geometry={data.geo} frustumCulled={false}>
      <pointsMaterial size={0.04} vertexColors map={dot} alphaTest={0.2} transparent depthWrite={false} sizeAttenuation />
    </points>
  );
}

/* ───────────────────────── Annotation ring ───────────────────────── */

function Annotation({ frame }: { frame: React.MutableRefObject<Frame> }) {
  const ref = useRef<THREE.Group>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const { ring, ticks, mat, tickMat } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const rr = R * 1.22;
    for (let k = 0; k <= 256; k++) {
      const a = (k / 256) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, 0));
    }
    const ring = new THREE.BufferGeometry().setFromPoints(pts);
    const tp: THREE.Vector3[] = [];
    for (let k = 0; k < 72; k++) {
      const a = (k / 72) * Math.PI * 2;
      const l = k % 6 === 0 ? 0.12 : 0.05;
      tp.push(new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, 0), new THREE.Vector3(Math.cos(a) * (rr + l), Math.sin(a) * (rr + l), 0));
    }
    const ticks = new THREE.BufferGeometry().setFromPoints(tp);
    const mat = new THREE.LineDashedMaterial({ color: "#777e80", dashSize: 0.04, gapSize: 0.05, transparent: true });
    const tickMat = new THREE.LineBasicMaterial({ color: "#777e80", transparent: true });
    return { ring, ticks, mat, tickMat };
  }, []);
  const lineRef = useRef<THREE.Line>(null);
  useEffect(() => {
    lineRef.current?.computeLineDistances();
    return () => { ring.dispose(); ticks.dispose(); mat.dispose(); tickMat.dispose(); };
  }, [ring, ticks, mat, tickMat]);
  useFrame((state) => {
    const a = frame.current.annotation;
    if (!ref.current) return;
    ref.current.visible = a > 0.01;
    mat.opacity = a;
    tickMat.opacity = a * 0.8;
    ref.current.rotation.z = engine.reduced ? 0 : state.clock.elapsedTime * 0.02;
    if (htmlRef.current) htmlRef.current.style.opacity = String(state.size.width < 620 ? 0 : a);
  });
  return (
    <group ref={ref}>
      <lineLoop ref={lineRef as never} geometry={ring} material={mat} />
      <lineSegments geometry={ticks} material={tickMat} />
      <Html position={[0, -R * 1.36, 0]} style={{ pointerEvents: "none" }}>
        <div ref={htmlRef} style={{ opacity: 0, whiteSpace: "nowrap", transform: "translate(-50%, 0)", textAlign: "center" }}>
          <div className="tag" style={{ color: "var(--color-ink)" }}>{t.scenes.coin.ring}</div>
          <div className="tag" style={{ color: "var(--color-mute)", marginTop: 4 }}>{t.scenes.coin.genesis} · {t.scenes.coin.drops}</div>
        </div>
      </Html>
    </group>
  );
}

/* ───────────────────────── Rig ───────────────────────── */

function Rig({ mobile }: { mobile: boolean }) {
  const frame = useRef<Frame>(makeFrame());
  const coinGroup = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const numEls = useRef<(HTMLDivElement | null)[]>([]);
  const { camera, size } = useThree();
  const [ready, setReady] = useState(false);
  const texRef = useRef<{ faces: THREE.Texture[]; rim: THREE.Texture } | null>(null);

  useEffect(() => {
    let alive = true;
    const build = () => {
      if (!alive) return;
      const faces = layers.map((l) => makeLayerTexture(l, l.index === 0 ? 1024 : mobile ? 512 : 768));
      texRef.current = { faces, rim: makeRimTexture() };
      setReady(true);
    };
    (document.fonts?.ready ?? Promise.resolve()).then(build);
    return () => {
      alive = false;
      texRef.current?.faces.forEach((t) => t.dispose());
      texRef.current?.rim.dispose();
    };
  }, [mobile]);

  const target = useMemo(() => new THREE.Vector3(), []);
  const tmpV = useMemo(() => new THREE.Vector3(), []);
  const focus = useRef(new THREE.Vector3());
  const focusAmt = useRef(0);

  useFrame((state) => {
    const g = engine.g;
    const f = frame.current;
    choreograph(f, g, state.clock.elapsedTime, engine.reduced);
    const cg = coinGroup.current;
    if (cg) {
      cg.position.set(f.gx, f.gy, f.gz);
      cg.rotation.set(f.grx, f.gry, f.grz);
      cg.visible = f.visible;
    }
    // small stages: shrink and shift left in the finale so the layer labels fit
    const small = size.width < 620;
    if (small && g > FINALE - 0.3) f.numLabels = true;
    if (outer.current) {
      const k = g < FINALE - 0.5 || !small ? 0 : f.explore;
      outer.current.scale.setScalar(lerp(1, 0.8, k));
      outer.current.position.x = lerp(0, -0.55, k);
    }

    // camera
    const pose = cameraAt(g);
    const ex = explorer.get();
    target.set(...pose.target);
    tmpV.set(...pose.pos);
    // explorer: focus selected layer, apply zoom
    let wantFocus = 0;
    if (f.explore > 0.5 && ex.selected >= 0 && cg) {
      const child = cg.children[ex.selected];
      if (child) {
        child.getWorldPosition(focus.current);
        wantFocus = 1;
      }
    }
    focusAmt.current = lerp(focusAmt.current, wantFocus, 0.08);
    const fa = focusAmt.current * f.explore;
    target.lerp(focus.current, fa * 0.5);
    const zoom = lerp(1, ex.zoom * (1 + fa * 0.18), f.explore);
    const dir = tmpV.clone().sub(new THREE.Vector3(...pose.target));
    tmpV.copy(target).add(dir.multiplyScalar(1 / zoom));
    camera.position.copy(tmpV);
    camera.lookAt(target);
    const pc = camera as THREE.PerspectiveCamera;
    if (Math.abs(pc.fov - pose.fov) > 0.01) {
      pc.fov = pose.fov;
      pc.updateProjectionMatrix();
    }
    // labels
    const setLbl = (el: HTMLDivElement | null, o: number) => {
      if (!el) return;
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
    };
    for (let i = 0; i < N; i++) {
      const o = f.L[i].o > 0.05 ? f.labels * Math.min(1, f.L[i].o * 1.4) : 0;
      setLbl(labelEls.current[i], f.numLabels ? 0 : o);
      setLbl(numEls.current[i], f.numLabels ? o : 0);
    }
  });

  if (!ready || !texRef.current) return null;
  const tex = texRef.current;

  return (
    <group ref={outer}>
      <Annotation frame={frame} />
      <group ref={coinGroup}>
        {layers.map((def, i) => (
          <LayerMesh
            key={def.id}
            def={def}
            index={i}
            frame={frame}
            textures={tex.faces}
            rimTex={tex.rim}
            labelRef={(el) => (labelEls.current[i] = el)}
            numRef={(el) => (numEls.current[i] = el)}
            onSelect={(k) => explorer.set((s) => ({ selected: s.selected === k ? -1 : k, category: null }))}
            onHover={(k) => explorer.set({ hovered: k })}
          />
        ))}
      </group>
      <Particles count={mobile ? 1300 : 2400} frameGroup={coinGroup} />
    </group>
  );
}

/* ───────────────────────── Drag to rotate ───────────────────────── */

function useDragRotate(el: HTMLElement | null) {
  useEffect(() => {
    if (!el) return;
    let down = false, sx = 0, sy = 0, yaw0 = 0, pitch0 = 0;
    const onDown = (e: PointerEvent) => {
      if (engine.g < FINALE + 0.85) return;
      down = true;
      sx = e.clientX; sy = e.clientY;
      yaw0 = explorer.get().yaw; pitch0 = explorer.get().pitch;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      explorer.set({
        yaw: yaw0 + (e.clientX - sx) * 0.008,
        pitch: clamp(pitch0 + (e.clientY - sy) * 0.006, -0.6, 0.9),
      });
    };
    const onUp = () => (down = false);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [el]);
}

export default function CoinCanvas({ mobile }: { mobile: boolean }) {
  const [active, setActive] = useState(true);
  const [explore, setExplore] = useState(false);
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useDragRotate(wrap);

  useEffect(
    () =>
      subscribeG((g) => {
        const l = g - COIN;
        setActive((l > -0.05 && l < 1.25) || g > FINALE - 0.16);
        setExplore(g > FINALE + 0.85);
        // fade the canvas in as the coin chapter approaches
        if (wrapRef.current) wrapRef.current.style.opacity = String(g > FINALE - 0.5 ? smooth(range(g, FINALE - 0.14, FINALE - 0.02)) : smooth(range(l, -0.01, 0.07)));
      }),
    [],
  );

  return (
    <div
      ref={(el) => {
        wrapRef.current = el;
        setWrap(el);
      }}
      className="absolute inset-0"
      style={{
        visibility: active ? "visible" : "hidden",
        touchAction: explore ? "none" : "auto",
        pointerEvents: explore ? "auto" : "none",
        cursor: explore ? "grab" : "default",
      }}
      aria-hidden="true"
    >
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, mobile ? 1.75 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.25, 9.2], fov: 35, near: 0.1, far: 100 }}
        onPointerMissed={() => engine.g > FINALE + 0.85 && explorer.set({ selected: -1 })}
      >
        <ambientLight intensity={1.6} />
        <hemisphereLight args={["#ffffff", "#c7cfcc", 0.9]} />
        <directionalLight position={[4, 5, 6]} intensity={1.6} />
        <directionalLight position={[-5, -2, 3]} intensity={0.4} />
        <Rig mobile={mobile} />
      </Canvas>
    </div>
  );
}
