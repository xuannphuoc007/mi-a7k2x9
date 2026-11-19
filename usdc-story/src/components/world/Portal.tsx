"use client";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth, band, lerp } from "@/lib/timeline";
import { useI18n } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { COL, ETH, SOL, TUNNEL, coinPoints, loadSampler, rnd, tmpM, tmpQ, tmpV, tmpS, tmpC, clock, xr, g } from "./shared";
import { envelopeTex, facadeTex } from "./textures";
import { tunnelS } from "./CameraRig";
import Tag from "./Tag";

const RINGS = 46;
const GATE_S = 0.08;
const PKT_E = new THREE.Vector3(ETH.x, ETH.y + 2.3, ETH.z);
const PKT_S = new THREE.Vector3(SOL.x, SOL.y + 2.3, SOL.z);

function Platform({ at, sides, color, matRef }: { at: THREE.Vector3; sides: number; color: string; matRef: React.MutableRefObject<THREE.MeshStandardMaterial | null> }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(9, 9.4, 0.6, sides)), [sides]);
  return (
    <group position={at}>
      <mesh>
        <cylinderGeometry args={[9, 9.4, 0.6, sides]} />
        <meshStandardMaterial ref={matRef} color="#e4e8ed" metalness={0.1} roughness={0.7} transparent opacity={0.95} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} transparent opacity={0.9} />
      </lineSegments>
      {[3, 5.5, 8].map((r) => (
        <mesh key={r} position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r, r + 0.03, sides === 6 ? 6 : 96]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 0.4, sides === 6 ? 6 : 48]} />
        <meshStandardMaterial color="#c9d1db" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** grass ring and a few simple trees so the plazas read as real places */
export function Garden({ at }: { at: THREE.Vector3 }) {
  const trees = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 + rnd(i + at.x) * 0.3;
        const r = 11.5 + rnd(i + 2 + at.z) * 3.5;
        return { x: Math.cos(a) * r, z: Math.sin(a) * r, h: 1.6 + rnd(i + 5) * 1.4 };
      }),
    [at],
  );
  return (
    <group position={[at.x, at.y - 0.25, at.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[9.2, 17, 64]} />
        <meshStandardMaterial color="#9fc48a" roughness={0.95} />
      </mesh>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, t.h * 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.16, t.h * 0.7, 8]} />
            <meshStandardMaterial color="#8a6a4a" roughness={0.9} />
          </mesh>
          <mesh position={[0, t.h * 0.9, 0]} castShadow>
            <sphereGeometry args={[t.h * 0.42, 14, 12]} />
            <meshStandardMaterial color={i % 3 ? "#6fa45a" : "#86b86b"} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Portal() {
  const { t } = useI18n();
  const L = t.labels;
  const S = t.sys;
  const mobile = typeof window !== "undefined" && window.innerWidth < 760;
  const N = mobile ? 560 : 1000;

  const group = useRef<THREE.Group>(null);
  const tiles = useRef<THREE.InstancedMesh>(null);
  const tileMat = useRef<THREE.MeshStandardMaterial>(null);
  const crystals = useRef<THREE.Group>(null);
  const bands = useRef<THREE.InstancedMesh>(null);
  const rings = useRef<THREE.InstancedMesh>(null);
  const gate = useRef<THREE.Group>(null);
  const gateMat = useRef<THREE.MeshStandardMaterial>(null);
  const arcs = useRef<THREE.Group>(null);
  const msg = useRef<THREE.Group>(null);
  const msgMat = useRef<THREE.MeshStandardMaterial>(null);
  const trail = useRef<THREE.Points>(null);
  const burnRing = useRef<THREE.MeshBasicMaterial>(null);
  const mintRing = useRef<THREE.MeshBasicMaterial>(null);
  const ethMat = useRef<THREE.MeshStandardMaterial | null>(null);
  const solMat = useRef<THREE.MeshStandardMaterial | null>(null);
  const flare = useRef<THREE.Mesh>(null);
  const pathMat = useRef<THREE.LineBasicMaterial>(null);

  const pkt = useMemo(() => coinPoints(N, 1.35), [N]);
  const qn = useMemo(() => pkt.nrm.map((n) => (n.z > 0 ? new THREE.Quaternion() : new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI))), [pkt]);
  const tcol = useMemo(() => pkt.pts.map(() => new THREE.Color(COL.usdc)), [pkt]);
  useEffect(() => {
    let live = true;
    loadSampler(asset("/img/usdc.png")).then((sample) => {
      if (!live) return;
      pkt.pts.forEach((p, i) => tcol[i].copy(sample(((p.z > 0 ? p.x : -p.x) / 1.35 + 1) / 2, 1 - (p.y / 1.35 + 1) / 2)));
    });
    return () => {
      live = false;
    };
  }, [pkt, tcol]);
  const envMap = useMemo(() => (typeof document !== "undefined" ? envelopeTex() : null), []);
  const ethFac = useMemo(() => (typeof document !== "undefined" ? facadeTex("#5d6acb", "eth") : null), []);
  const solFac = useMemo(() => (typeof document !== "undefined" ? facadeTex("#2b3552", "sol") : null), []);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(TUNNEL, 220, 2.5, 32, false), []);
  const seal = useRef<THREE.Mesh>(null);
  const frames = useMemo(() => TUNNEL.computeFrenetFrames(RINGS, false), []);
  const trailGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(60 * 3), 3));
    return geo;
  }, []);
  const gatePos = useMemo(() => TUNNEL.getPoint(GATE_S), []);
  const gateTan = useMemo(() => TUNNEL.getTangent(GATE_S), []);
  const gateQ = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), gateTan), [gateTan]);

  /** Network pathway from the vault to Ethereum, branching toward other chains (scene 04 later). */
  const pathGeo = useMemo(() => {
    const arr: number[] = [];
    const curves = [
      [[0, -56, -50], [0, -58, -75], [0, -61, -100]],
      [[0, -58, -75], [-22, -64, -100], [-48, -70, -140]],
      [[0, -58, -75], [26, -66, -92], [70, -64, -120]],
      [[0, -58, -75], [-30, -54, -80], [-70, -52, -96]],
      [[0, -61, -100], [18, -70, -130], [30, -78, -170]],
    ].map((pts) => new THREE.QuadraticBezierCurve3(...(pts.map((p) => new THREE.Vector3(...(p as [number, number, number]))) as [THREE.Vector3, THREE.Vector3, THREE.Vector3])));
    for (const c of curves) {
      const ps = c.getPoints(40);
      for (let i = 0; i < ps.length - 1; i++) arr.push(ps[i].x, ps[i].y, ps[i].z, ps[i + 1].x, ps[i + 1].y, ps[i + 1].z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return geo;
  }, []);

  useFrame(() => {
    const u = scrollState.u;
    const vis = u > g("s03", 0.82);
    if (group.current) group.current.visible = vis;
    if (!vis) return;
    const tl = local("s05", u);
    const tm = clock.t;
    const x = xr.v;
    const s = tunnelS(tl);

    if (pathMat.current) pathMat.current.opacity = (0.25 + 0.35 * x) * (1 - 0.6 * smooth(ramp(tl, 0.2, 0.4)));

    // packet: assembled on Ethereum → burned into the ring → re-formed on Solana
    const burn = smooth(ramp(tl, 0.14, 0.27));
    const mint = smooth(ramp(tl, 0.74, 0.86));
    const atSol = tl > 0.5;
    if (tiles.current) {
      for (let i = 0; i < N; i++) {
        const p = pkt.pts[i];
        const r1 = rnd(i);
        const r2 = rnd(i + 4.2);
        const base = atSol ? PKT_S : PKT_E;
        const k = atSol ? 1 - mint : burn; // 0 = assembled, 1 = dissolved into the ring
        const ki = smooth(ramp(k, r1 * 0.35, r1 * 0.35 + 0.65));
        const ang = r2 * Math.PI * 2 + ki * (atSol ? -3 : 3);
        const ringR = 2.1;
        const ring = tmpS.set(Math.cos(ang) * ringR, -2.0 + (atSol ? 0 : 0) , Math.sin(ang) * ringR);
        const spinY = Math.sin(tm * 0.4) * 0.5 + 0.35;
        tmpV.copy(p).applyAxisAngle(UPY, spinY);
        tmpV.lerp(ring, ki).add(base);
        tmpV.y += Math.sin(Math.PI * ki) * (atSol ? 1.2 : 0.8);
        tmpQ.setFromAxisAngle(UPY, spinY).multiply(qn[i]);
        const sc = (1 - ki * 0.9) * (atSol ? (mint > 0.001 ? 1 : 0) : burn < 0.999 ? 1 : 0);
        tmpM.compose(tmpV, tmpQ, tmpSc.set(sc, sc, sc));
        tiles.current.setMatrixAt(i, tmpM);
        tmpC.copy(tcol[i]).lerp(HOT, atSol ? 0 : smooth(ramp(ki, 0.2, 0.8)) * 0.85);
        tiles.current.setColorAt(i, tmpC);
      }
      tiles.current.instanceMatrix.needsUpdate = true;
      if (tiles.current.instanceColor) tiles.current.instanceColor.needsUpdate = true;
    }
    if (tileMat.current) tileMat.current.opacity = 1 - 0.7 * x;
    if (burnRing.current) burnRing.current.opacity = 0.25 + band(tl, 0.14, 0.2, 0.3, 0.36) * 0.75;
    if (mintRing.current) mintRing.current.opacity = 0.25 + band(tl, 0.7, 0.75, 0.86, 0.92) * 0.75;

    // Ethereum crystals turn slowly; Solana light bands stream fast
    if (crystals.current) crystals.current.rotation.y = tm * 0.15;
    if (bands.current) {
      let i = 0;
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 16; c++) {
          const sp = 2.2 + r * 0.9;
          let xx = ((c / 16) * 17 + tm * sp + r * 3) % 17;
          xx -= 8.5;
          const edge = Math.min(1, (8.5 - Math.abs(xx)) / 1.2);
          tmpV.set(SOL.x + 6 + xx * 0.27, SOL.y + 3.2 + r * 2.6, SOL.z - 0.05);
          tmpQ.identity();
          tmpS.set(Math.max(0, edge) * 0.4, 1, 1);
          tmpM.compose(tmpV, tmpQ, tmpS);
          bands.current.setMatrixAt(i, tmpM);
          tmpC.set(COL.solA).lerp(tmpC2.set(COL.solB), (xx + 8.5) / 17);
          bands.current.setColorAt(i, tmpC);
          i++;
        }
      bands.current.instanceMatrix.needsUpdate = true;
      if (bands.current.instanceColor) bands.current.instanceColor.needsUpdate = true;
    }

    // signed message
    const rise = smooth(ramp(tl, 0.27, 0.4));
    const down = smooth(ramp(tl, 0.7, 0.76));
    const msgOn = tl > 0.26 && tl < 0.78;
    if (msg.current) {
      msg.current.visible = msgOn;
      if (tl <= 0.4) tmpV.copy(PKT_E).setY(ETH.y + 0.8).lerp(TUNNEL.getPoint(0), rise);
      else if (tl < 0.7) TUNNEL.getPoint(s, tmpV);
      else tmpV.copy(TUNNEL.getPoint(1)).lerp(tmpS.set(SOL.x, SOL.y + 0.9, SOL.z), down);
      msg.current.position.copy(tmpV);
      msg.current.rotation.set(0, tm * 0.8, Math.sin(tm) * 0.2);
      const sc = smooth(ramp(tl, 0.26, 0.3)) * (1 - smooth(ramp(tl, 0.74, 0.78)));
      msg.current.scale.setScalar(Math.max(0.001, sc));
    }
    const signed = smooth(ramp(s, GATE_S - 0.02, GATE_S + 0.01));
    if (msgMat.current) {
      msgMat.current.emissiveIntensity = 0.05;
    }
    if (trail.current) {
      const pos = trailGeo.attributes.position as THREE.BufferAttribute;
      for (let k = 0; k < 60; k++) {
        const sk = Math.max(0, s - k * 0.004);
        if (tl > 0.4 && tl < 0.7) TUNNEL.getPoint(sk, tmpV);
        else tmpV.copy(msg.current ? msg.current.position : tmpV);
        tmpV.x += (rnd(k) - 0.5) * 0.25;
        tmpV.y += (rnd(k + 2) - 0.5) * 0.25;
        pos.setXYZ(k, tmpV.x, tmpV.y, tmpV.z);
      }
      pos.needsUpdate = true;
      (trail.current.material as THREE.PointsMaterial).opacity = msgOn ? 0.8 : 0;
    }

    // tunnel rings light up around the message
    if (rings.current) {
      for (let i = 0; i < RINGS; i++) {
        const si = i / (RINGS - 1);
        TUNNEL.getPoint(si, tmpV);
        tmpQ.setFromUnitVectors(Z, frames.tangents[i]);
        const near = Math.exp(-Math.pow((si - s) * 14, 2)) * (tl > 0.38 && tl < 0.72 ? 1 : 0);
        const scl = 1 + near * 0.25;
        tmpM.compose(tmpV, tmpQ, tmpSc.set(scl, scl, scl));
        rings.current.setMatrixAt(i, tmpM);
        tmpC.set("#c9a24a").lerp(tmpC2.set(COL.usdc), near);
        rings.current.setColorAt(i, tmpC);
      }
      rings.current.instanceMatrix.needsUpdate = true;
      if (rings.current.instanceColor) rings.current.instanceColor.needsUpdate = true;
    }

    // attestation gate flashes when the message passes
    const flash = Math.exp(-Math.pow((s - GATE_S) * 22, 2)) * (tl > 0.38 && tl < 0.6 ? 1 : 0);
    if (gateMat.current) gateMat.current.emissiveIntensity = flash * 1.2 + band(tl, 0.3, 0.36, 0.44, 0.5) * 0.2;
    if (seal.current) seal.current.scale.setScalar(Math.max(0.001, signed));
    if (arcs.current) arcs.current.rotation.z = tm * 0.3 + flash * 2;
    if (flare.current) {
      flare.current.scale.setScalar(0.5 + flash * 2.2);
      (flare.current.material as THREE.MeshBasicMaterial).opacity = flash * 0.22;
    }
    [ethMat.current, solMat.current].forEach((m) => m && (m.opacity = 0.95 * (1 - 0.65 * x)));
  });

  const near = (a: number, b: number, c: number, d: number) => (u: number) => band(local("s05", u), a, b, c, d);

  return (
    <group ref={group}>
      <pointLight position={[ETH.x, ETH.y + 8, ETH.z + 4]} color={COL.eth} intensity={70} distance={40} decay={1.4} />
      <pointLight position={[SOL.x, SOL.y + 8, SOL.z + 4]} color="#7fe9d0" intensity={60} distance={40} decay={1.4} />
      <pointLight position={[gatePos.x, gatePos.y, gatePos.z]} color={COL.volt} intensity={40} distance={25} decay={1.5} />

      <lineSegments geometry={pathGeo}>
        <lineBasicMaterial ref={pathMat} color={COL.usdc} transparent opacity={0.3} />
      </lineSegments>

      {/* Ethereum world: slow, crystalline */}
      <Platform at={ETH} sides={6} color={COL.eth} matRef={ethMat} />
      <Garden at={ETH} />
      <Garden at={SOL} />
      {/* Ethereum tower with a crystal crown */}
      <mesh position={[ETH.x - 6, ETH.y + 6.3, ETH.z - 2.5]} castShadow receiveShadow>
        <boxGeometry args={[5, 12, 4]} />
        <meshStandardMaterial map={ethFac} metalness={0.4} roughness={0.25} />
      </mesh>
      <group ref={crystals} position={[ETH.x - 6, ETH.y + 14.2, ETH.z - 2.5]}>
        <mesh scale={[1.3, 2.0, 1.3]} castShadow>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={COL.eth} metalness={0.5} roughness={0.15} />
        </mesh>
      </group>
      <mesh position={[ETH.x, ETH.y + 0.5, ETH.z]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.14, 12, 72]} />
        <meshStandardMaterial color={COL.steel} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[ETH.x, ETH.y + 0.36, ETH.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.25, 96]} />
        <meshBasicMaterial ref={burnRing} color={COL.risk} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Solana world: fast, streaming */}
      <Platform at={SOL} sides={48} color="#4fcfae" matRef={solMat} />
      <mesh position={[SOL.x + 6, SOL.y + 5.8, SOL.z - 2.5]} castShadow receiveShadow>
        <boxGeometry args={[5, 11, 4.8]} />
        <meshStandardMaterial map={solFac} metalness={0.4} roughness={0.25} />
      </mesh>
      <instancedMesh ref={bands} args={[undefined, undefined, 48]} frustumCulled={false}>
        <boxGeometry args={[1.6, 0.07, 0.07]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <mesh position={[SOL.x, SOL.y + 0.36, SOL.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.25, 96]} />
        <meshBasicMaterial ref={mintRing} color={COL.usdc} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* the packet (burned on one chain, minted on the other) */}
      <instancedMesh ref={tiles} args={[undefined, undefined, N]} frustumCulled={false}>
        <boxGeometry args={[pkt.d * 1.0, pkt.d * 1.0, 0.02]} />
        <meshStandardMaterial ref={tileMat} emissive={COL.usdc} emissiveIntensity={0.02} roughness={0.35} metalness={0.15} side={THREE.DoubleSide} transparent />
      </instancedMesh>

      {/* pneumatic glass tube + attestation (notary) ring */}
      <mesh geometry={tubeGeo}>
        <meshPhysicalMaterial color="#dcecfb" roughness={0.06} transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <instancedMesh ref={rings} args={[undefined, undefined, RINGS]} frustumCulled={false}>
        <torusGeometry args={[2.62, 0.06, 10, 72]} />
        <meshStandardMaterial metalness={0.85} roughness={0.3} />
      </instancedMesh>
      <group ref={gate} position={gatePos} quaternion={gateQ}>
        <mesh>
          <torusGeometry args={[4.2, 0.12, 16, 120]} />
          <meshStandardMaterial ref={gateMat} color="#c9a24a" emissive={COL.usdc} emissiveIntensity={0} metalness={0.9} roughness={0.25} />
        </mesh>
        <group ref={arcs}>
          {[0, 1, 2].map((k) => (
            <mesh key={k} rotation={[0, 0, (k * Math.PI * 2) / 3]}>
              <torusGeometry args={[3.5, 0.07, 8, 60, Math.PI * 0.45]} />
              <meshStandardMaterial color={COL.usdc} metalness={0.5} roughness={0.3} />
            </mesh>
          ))}
        </group>
        <mesh ref={flare}>
          <circleGeometry args={[1, 48]} />
          <meshBasicMaterial color={COL.usdc} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={msg}>
        <mesh castShadow>
          <boxGeometry args={[1.0, 0.62, 0.03]} />
          <meshStandardMaterial ref={msgMat} map={envMap} color="#ffffff" emissive="#ffffff" emissiveIntensity={0.05} roughness={0.8} />
        </mesh>
        <mesh ref={seal} position={[0, 0.02, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.13, 0.04, 24]} />
          <meshStandardMaterial color="#b8322a" metalness={0.1} roughness={0.45} />
        </mesh>
      </group>
      <points ref={trail} geometry={trailGeo}>
        <pointsMaterial color={COL.volt} size={0.07} transparent opacity={0} depthWrite={false} />
      </points>

      {/* labels */}
      <Tag kind="cine" position={[ETH.x - 9.5, ETH.y + 1.2, ETH.z + 2]} text={L.source} img={asset("/img/eth.svg")} vis={near(0.03, 0.1, 0.36, 0.42)} align="right" />
      <Tag kind="cine" position={[SOL.x + 3.2, SOL.y + 1.6, SOL.z + 4]} text={L.dest} img={asset("/img/sol.png")} vis={near(0.7, 0.76, 0.95, 1.0)} />
      <Tag kind="cine" position={[gatePos.x + 4.6, gatePos.y + 2.6, gatePos.z]} text={L.gate + " · Circle"} vis={near(0.3, 0.36, 0.46, 0.5)} />

      <Tag kind="sys" position={[ETH.x + 2.6, ETH.y + 3.6, ETH.z + 1]} k={S.burn[0]} text={S.burn[1]} vis={near(0.06, 0.12, 0.36, 0.4)} />
      <Tag kind="sys" position={[gatePos.x + 4.4, gatePos.y + 0.8, gatePos.z]} k={S.iris[0]} text={S.iris[1]} vis={near(0.3, 0.36, 0.5, 0.55)} />
      <Tag kind="sys" position={[gatePos.x + 4.4, gatePos.y - 0.6, gatePos.z]} k={S.fast[0]} text={S.fast[1]} vis={near(0.3, 0.36, 0.5, 0.55)} />
      <Tag kind="sys" position={[gatePos.x + 4.4, gatePos.y - 1.8, gatePos.z]} k={S.std[0]} text={S.std[1]} vis={near(0.3, 0.36, 0.5, 0.55)} />
      <Tag kind="sys" position={[SOL.x + 2.6, SOL.y + 3.8, SOL.z + 1]} k={S.mint[0]} text={S.mint[1]} vis={near(0.74, 0.8, 0.95, 1.0)} />
    </group>
  );
}

const UPY = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);
const HOT = new THREE.Color(COL.risk);
const tmpSc = new THREE.Vector3();
const tmpC2 = new THREE.Color();
void lerp;
