"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth, band, lerp } from "@/lib/timeline";
import { useI18n } from "@/lib/i18n";
import { COL, VAULT, rnd, tmpM, tmpQ, tmpV, tmpS, clock, xr, g } from "./shared";
import Tag from "./Tag";

const C = VAULT.center; // floor centre (0,-72,-30)
const FY = C.y;
const HY = VAULT.hatchY;
const X = { repo: -9, tbill: -3, bank: 4.5, other: 8.4 };
const H = { repo: 16, tbill: 8.05, bank: 2.98 };
const REPO_LEVELS = 26;
const DISCS = 40;

const fadeMats = (mats: (THREE.Material | null)[], base: number[], k: number) =>
  mats.forEach((m, i) => {
    if (m) (m as THREE.MeshStandardMaterial).opacity = base[i] * k;
  });

/** A small classical bank built from simple solids (cash cubes visible through glass). */
function Bank({ position, scale, rise, matRef, cashRef }: { position: [number, number, number]; scale: number; rise: React.MutableRefObject<number>; matRef: React.MutableRefObject<THREE.MeshStandardMaterial | null>; cashRef: React.MutableRefObject<THREE.MeshStandardMaterial | null> }) {
  const grp = useRef<THREE.Group>(null);
  useFrame(() => {
    if (grp.current) {
      grp.current.visible = rise.current > 0.01;
      grp.current.scale.set(scale, scale * Math.max(0.001, rise.current), scale);
    }
  });
  const cols = [-1.25, -0.42, 0.42, 1.25];
  return (
    <group ref={grp} position={position}>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[3.6, 0.36, 2.6]} />
        <meshStandardMaterial ref={matRef} color="#1d3d66" metalness={0.6} roughness={0.35} transparent opacity={0.85} />
      </mesh>
      {cols.map((x) => (
        <mesh key={x} position={[x, 1.36, 0.95]}>
          <cylinderGeometry args={[0.17, 0.2, 2, 16]} />
          <meshStandardMaterial color={COL.silver} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => (
          <mesh key={`${r}${c}`} position={[-0.38 + c * 0.76, 0.66 + r * 0.62, -0.25]}>
            <boxGeometry args={[0.6, 0.5, 0.9]} />
            <meshStandardMaterial ref={r === 0 && c === 0 ? cashRef : undefined} color={COL.volt} emissive={COL.usdc} emissiveIntensity={0.6} metalness={0.2} roughness={0.4} />
          </mesh>
        )),
      )}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[3.9, 0.26, 2.8]} />
        <meshStandardMaterial color="#26507f" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.95, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.95, 1, 0.65]}>
        <cylinderGeometry args={[1, 1, 2.8, 3]} />
        <meshStandardMaterial color="#26507f" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

export default function Vault() {
  const { t } = useI18n();
  const L = t.labels;
  const S = t.sys;
  const mobile = typeof window !== "undefined" && window.innerWidth < 760;
  const NCLOUD = mobile ? 220 : 420;

  const group = useRef<THREE.Group>(null);
  const halfA = useRef<THREE.Group>(null);
  const halfB = useRef<THREE.Group>(null);
  const fins = useRef<THREE.InstancedMesh>(null);
  const finMat = useRef<THREE.MeshStandardMaterial>(null);
  const roofMat = useRef<THREE.MeshStandardMaterial>(null);
  const cubes = useRef<THREE.InstancedMesh>(null);
  const bonds = useRef<THREE.InstancedMesh>(null);
  const plates = useRef<THREE.InstancedMesh>(null);
  const discs = useRef<THREE.InstancedMesh>(null);
  const discGrp = useRef<THREE.Group>(null);
  const cloud = useRef<THREE.InstancedMesh>(null);
  const cloudMat = useRef<THREE.MeshStandardMaterial>(null);
  const fundMat = useRef<THREE.MeshBasicMaterial>(null);
  const fundEdge = useRef<THREE.LineBasicMaterial>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);
  const node = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const bankMat = useRef<THREE.MeshStandardMaterial | null>(null);
  const bankCash = useRef<THREE.MeshStandardMaterial | null>(null);
  const otherMat = useRef<THREE.MeshStandardMaterial | null>(null);
  const otherCash = useRef<THREE.MeshStandardMaterial | null>(null);
  const riseBank = useRef(0);
  const riseOther = useRef(0);
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: COL.ice, transparent: true, opacity: 0 }), []);

  const cloudPts = useMemo(
    () =>
      Array.from({ length: NCLOUD }, (_, i) => {
        const a = rnd(i) * Math.PI * 2;
        const r = Math.sqrt(rnd(i + 2)) ;
        return new THREE.Vector3(Math.cos(a) * r * 10, (rnd(i + 5) - 0.5) * 3.2, Math.sin(a) * r * 7.5);
      }),
    [NCLOUD],
  );
  const NODE = useMemo(() => new THREE.Vector3(0, -57.5, -30), []);
  const lineGeo = useMemo(() => {
    const arr: number[] = [];
    const cc = new THREE.Vector3(0, -51.5, -30);
    for (let i = 0; i < cloudPts.length; i += 4) {
      const p = cloudPts[i].clone().add(cc);
      arr.push(p.x, p.y, p.z, NODE.x, NODE.y, NODE.z);
    }
    const tops: [number, number][] = [
      [X.repo, FY + H.repo],
      [X.tbill, FY + H.tbill],
      [X.bank, FY + 3.2],
      [X.other, FY + 1.1],
    ];
    for (const [x, y] of tops) arr.push(NODE.x, NODE.y, NODE.z, x, y + 0.2, C.z);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return geo;
  }, [cloudPts, NODE]);
  const fundEdgesGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(10.6, 17.6, 5.2)), []);
  const towerEdges = useMemo(() => {
    const gs = [new THREE.BoxGeometry(3.4, H.repo, 2.4), new THREE.CylinderGeometry(1.5, 1.5, H.tbill, 18, 1, true)];
    return gs.map((g0) => new THREE.EdgesGeometry(g0));
  }, []);

  const finCount = 84;

  useFrame(() => {
    const u = scrollState.u;
    const vis = u > g("s01", 0.74) && u < g("s05", 0.16);
    if (group.current) group.current.visible = vis;
    if (!vis) return;
    const tl = local("s03", u);
    const tm = clock.t;
    const x = xr.v;

    // hatch irises open as the camera arrives
    const open = smooth(ramp(tl, 0.03, 0.13));
    if (halfA.current) halfA.current.position.x = open * 8.5;
    if (halfB.current) halfB.current.position.x = -open * 8.5;

    // glass fins of the vault wall
    if (fins.current) {
      for (let i = 0; i < finCount; i++) {
        const a = (i / finCount) * Math.PI * 2;
        tmpV.set(C.x + Math.cos(a) * VAULT.radius, (FY + HY) / 2, C.z + Math.sin(a) * VAULT.radius);
        tmpQ.setFromAxisAngle(tmpS.set(0, 1, 0), -a);
        tmpS.set(1, 1, 1);
        tmpM.compose(tmpV, tmpQ, tmpS);
        fins.current.setMatrixAt(i, tmpM);
      }
      fins.current.instanceMatrix.needsUpdate = true;
    }
    fadeMats([finMat.current, roofMat.current], [0.42, 0.95], 1 - 0.7 * x);

    // towers rise one after another
    const rise = (i: number) => smooth(ramp(tl, 0.15 + i * 0.035, 0.27 + i * 0.035));
    const rRepo = rise(0);
    const rT = rise(1);
    riseBank.current = rise(2);
    riseOther.current = rise(3);

    // overnight repo: each night cash (cube) and Treasury (cylinder) swap sides, then swap back
    if (cubes.current && bonds.current && plates.current) {
      const focus = band(tl, 0.3, 0.36, 0.44, 0.5);
      for (let i = 0; i < REPO_LEVELS; i++) {
        const shown = rRepo * REPO_LEVELS > i ? 1 : 0;
        const y = FY + 0.35 + i * (H.repo / REPO_LEVELS);
        const ph = (tm * 0.22 + i * 0.137) % 1;
        const sw = smooth(ramp(ph, 0.1, 0.35)) - smooth(ramp(ph, 0.6, 0.85));
        const arc = Math.sin(Math.PI * sw) * 0.25;
        tmpQ.identity();
        tmpS.setScalar(shown);
        tmpV.set(X.repo + lerp(-0.85, 0.85, sw), y + 0.22 + arc, C.z);
        tmpM.compose(tmpV, tmpQ, tmpS);
        cubes.current.setMatrixAt(i, tmpM);
        tmpV.set(X.repo + lerp(0.85, -0.85, sw), y + 0.18 - arc * 0.5, C.z);
        tmpQ.setFromAxisAngle(tmpS.set(1, 0, 0), Math.PI / 2);
        tmpS.setScalar(shown);
        tmpM.compose(tmpV, tmpQ, tmpS);
        bonds.current.setMatrixAt(i, tmpM);
        tmpQ.identity();
        tmpV.set(X.repo, y, C.z);
        tmpS.set(shown, shown, shown);
        tmpM.compose(tmpV, tmpQ, tmpS);
        plates.current.setMatrixAt(i, tmpM);
      }
      cubes.current.instanceMatrix.needsUpdate = true;
      bonds.current.instanceMatrix.needsUpdate = true;
      plates.current.instanceMatrix.needsUpdate = true;
      (cubes.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + focus * 0.9;
    }

    // T-bills: a slow spiral; discs drift down as they mature and reappear on top
    if (discs.current && discGrp.current) {
      discGrp.current.rotation.y = tm * 0.08;
      const span = H.tbill - 0.3;
      for (let j = 0; j < DISCS; j++) {
        let y = (j * (span / DISCS) - tm * 0.12) % span;
        if (y < 0) y += span;
        const edge = Math.min(1, y / 0.6, (span - y) / 0.6);
        const shown = rT * span > y ? 1 : 0;
        const a = j * 0.55;
        tmpV.set(Math.cos(a) * 0.35, 0.2 + y, Math.sin(a) * 0.35);
        tmpQ.identity();
        tmpS.set(edge * shown, shown, edge * shown);
        tmpM.compose(tmpV, tmpQ, tmpS);
        discs.current.setMatrixAt(j, tmpM);
      }
      discs.current.instanceMatrix.needsUpdate = true;
      (discs.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.05 + band(tl, 0.44, 0.5, 0.56, 0.62) * 0.5;
    }
    const bankFocus = band(tl, 0.56, 0.62, 0.68, 0.73);
    [bankCash.current, otherCash.current].forEach((m) => m && (m.emissiveIntensity = 0.5 + bankFocus * 1.2));
    fadeMats([bankMat.current, otherMat.current], [0.85, 0.85], 1 - 0.6 * x);

    // the fund wrapper appears around repo + T-bills
    const fund = smooth(ramp(tl, 0.68, 0.75));
    if (fundMat.current) {
      fundMat.current.opacity = fund * (0.07 + 0.08 * x);
      fundMat.current.visible = fund > 0.005;
    }
    if (fundEdge.current) {
      fundEdge.current.opacity = fund * (0.55 + 0.45 * x);
      fundEdge.current.visible = fund > 0.005;
    }

    // USDC cloud above: every token is linked to one shared pool, not to an asset
    const cl = smooth(ramp(tl, 0.76, 0.84));
    if (cloud.current) {
      for (let i = 0; i < cloudPts.length; i++) {
        const p = cloudPts[i];
        tmpV.set(p.x + Math.sin(tm * 0.3 + i) * 0.25, -51.5 + p.y + Math.sin(tm * 0.5 + i * 1.7) * 0.18, C.z + p.z);
        tmpQ.setFromAxisAngle(tmpS.set(0, 1, 0), tm * 0.4 + i);
        const sc = cl * (0.16 + rnd(i + 1) * 0.08);
        tmpS.setScalar(sc);
        tmpM.compose(tmpV, tmpQ, tmpS);
        cloud.current.setMatrixAt(i, tmpM);
      }
      cloud.current.instanceMatrix.needsUpdate = true;
    }
    if (cloudMat.current) cloudMat.current.emissiveIntensity = 0.6 + 0.4 * Math.sin(tm);
    if (linesMat.current) {
      linesMat.current.opacity = smooth(ramp(tl, 0.8, 0.87)) * (0.35 + 0.4 * x);
      linesMat.current.visible = linesMat.current.opacity > 0.005;
    }
    if (node.current) node.current.scale.setScalar(smooth(ramp(tl, 0.8, 0.86)) * (1 + 0.15 * Math.sin(tm * 2)));
    if (light.current) light.current.intensity = 60 + 40 * smooth(ramp(tl, 0.1, 0.25));
    edgeMat.opacity = x * smooth(ramp(tl, 0.2, 0.3));
    edgeMat.visible = edgeMat.opacity > 0.005;
  });

  const vRepo = (u: number) => band(local("s03", u), 0.27, 0.32, 0.86, 0.92);
  const sysIn = (u: number) => band(local("s03", u), 0.18, 0.26, 0.95, 1.0);
  const fundVis = (u: number) => band(local("s03", u), 0.7, 0.76, 0.95, 1.0);
  const poolVis = (u: number) => band(local("s03", u), 0.8, 0.86, 0.97, 1.0);

  return (
    <group ref={group}>
      <pointLight ref={light} position={[0, -52, -30]} color={COL.volt} intensity={60} distance={60} decay={1.4} />
      <pointLight position={[-8, -60, -20]} color={COL.ice} intensity={25} distance={30} decay={1.6} />
      <pointLight position={[6, -50, -24]} color="#cfe6ff" intensity={45} distance={40} decay={1.5} />

      {/* roof ring + iris hatch */}
      <mesh position={[C.x, HY + 0.3, C.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.6, 21.5, 96, 1]} />
        <meshStandardMaterial ref={roofMat} color="#0f2340" metalness={0.75} roughness={0.35} transparent opacity={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[C.x, HY + 0.3, C.z]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[7.6, 0.32, 16, 120]} />
        <meshStandardMaterial color={COL.silver} metalness={0.9} roughness={0.25} />
      </mesh>
      {[halfA, halfB].map((ref, k) => (
        <group key={k} ref={ref}>
          <group position={[C.x, HY + 0.3, C.z]} rotation={[0, k ? Math.PI : 0, 0]}>
            <mesh>
              <cylinderGeometry args={[7.3, 7.3, 0.5, 64, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#1a3459" metalness={0.85} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            {Array.from({ length: 9 }, (_, i) => {
              const a = ((i + 0.5) / 9) * Math.PI;
              return (
                <mesh key={i} position={[Math.sin(a) * 6.4, 0.32, Math.cos(a) * 6.4]}>
                  <cylinderGeometry args={[0.28, 0.28, 0.2, 16]} />
                  <meshStandardMaterial color={COL.silver} metalness={0.9} roughness={0.2} />
                </mesh>
              );
            })}
            <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.2, 2.4, 64, 1, 0, Math.PI]} />
              <meshBasicMaterial color={COL.volt} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      ))}

      {/* glass wall fins */}
      <instancedMesh ref={fins} args={[undefined, undefined, finCount]} frustumCulled={false}>
        <boxGeometry args={[0.16, HY - FY, 1.4]} />
        <meshStandardMaterial ref={finMat} color="#1b3a63" metalness={0.6} roughness={0.25} transparent opacity={0.42} emissive={COL.usdc} emissiveIntensity={0.08} />
      </instancedMesh>

      {/* floor with survey rings */}
      <mesh position={[C.x, FY, C.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[VAULT.radius + 0.5, 96]} />
        <meshStandardMaterial color="#0b1730" metalness={0.5} roughness={0.6} />
      </mesh>
      {[4, 8, 12, 16, 19.5].map((r) => (
        <mesh key={r} position={[C.x, FY + 0.02, C.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r, r + 0.03, 128]} />
          <meshBasicMaterial color={COL.usdc} transparent opacity={0.45} />
        </mesh>
      ))}

      {/* overnight repo tower */}
      <instancedMesh ref={plates} args={[undefined, undefined, REPO_LEVELS]} frustumCulled={false}>
        <boxGeometry args={[3.2, 0.05, 2.2]} />
        <meshStandardMaterial color="#20446f" metalness={0.5} roughness={0.3} transparent opacity={0.7} />
      </instancedMesh>
      <instancedMesh ref={cubes} args={[undefined, undefined, REPO_LEVELS]} frustumCulled={false}>
        <boxGeometry args={[0.42, 0.34, 0.42]} />
        <meshStandardMaterial color={COL.volt} emissive={COL.usdc} emissiveIntensity={0.6} roughness={0.35} metalness={0.2} />
      </instancedMesh>
      <instancedMesh ref={bonds} args={[undefined, undefined, REPO_LEVELS]} frustumCulled={false}>
        <cylinderGeometry args={[0.13, 0.13, 1.2, 16]} />
        <meshStandardMaterial color={COL.silver} metalness={0.85} roughness={0.25} />
      </instancedMesh>

      {/* T-bill spiral */}
      <group ref={discGrp} position={[X.tbill, FY, C.z]}>
        <instancedMesh ref={discs} args={[undefined, undefined, DISCS]} frustumCulled={false}>
          <cylinderGeometry args={[1.15, 1.15, 0.08, 40]} />
          <meshStandardMaterial color="#8fa4c2" metalness={0.75} roughness={0.35} emissive={COL.ice} emissiveIntensity={0.05} />
        </instancedMesh>
      </group>

      {/* cash at banks */}
      <Bank position={[X.bank, FY, C.z]} scale={1} rise={riseBank} matRef={bankMat} cashRef={bankCash} />
      <Bank position={[X.other, FY, C.z]} scale={0.32} rise={riseOther} matRef={otherMat} cashRef={otherCash} />

      {/* X-RAY outlines of the towers */}
      <lineSegments geometry={towerEdges[0]} material={edgeMat} position={[X.repo, FY + H.repo / 2, C.z]} />
      <lineSegments geometry={towerEdges[1]} material={edgeMat} position={[X.tbill, FY + H.tbill / 2, C.z]} />

      {/* Circle Reserve Fund wrapper */}
      <mesh position={[(X.repo + X.tbill) / 2 - 0.3, FY + 8.8, C.z]}>
        <boxGeometry args={[10.6, 17.6, 5.2]} />
        <meshBasicMaterial ref={fundMat} color={COL.volt} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={fundEdgesGeo} position={[(X.repo + X.tbill) / 2 - 0.3, FY + 8.8, C.z]}>
        <lineBasicMaterial ref={fundEdge} color={COL.ice} transparent opacity={0} />
      </lineSegments>

      {/* USDC cloud and the single pool node */}
      <instancedMesh ref={cloud} args={[undefined, undefined, cloudPts.length]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial ref={cloudMat} color={COL.volt} emissive={COL.usdc} emissiveIntensity={0.8} roughness={0.3} metalness={0.3} />
      </instancedMesh>
      <mesh ref={node} position={NODE}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshBasicMaterial color={COL.ice} />
      </mesh>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial ref={linesMat} color={COL.volt} transparent opacity={0} depthWrite={false} />
      </lineSegments>

      {/* labels */}
      <Tag kind="cine" position={[X.repo - 1.8, FY + 0.6, C.z + 2.2]} text={L.repo} vis={vRepo} align="right" />
      <Tag kind="cine" position={[X.tbill - 0.2, FY + 0.25, C.z + 2.6]} text={L.tbill} vis={vRepo} />
      <Tag kind="cine" position={[X.bank - 1.2, FY + 0.15, C.z + 2.4]} text={L.bank} vis={vRepo} />
      <Tag kind="cine" position={[X.other + 0.3, FY + 0.9, C.z + 0.6]} text={L.other} vis={vRepo} />
      <Tag kind="cine" position={[X.repo - 0.5, FY + 18.1, C.z]} text={L.fund} vis={fundVis} />
      <Tag kind="cine" position={[NODE.x + 0.8, NODE.y, NODE.z]} text={L.pool} vis={poolVis} />
      <Tag kind="cine" position={[9.5, -50.5, C.z]} text={L.tokens} vis={poolVis} />

      <Tag kind="sys" position={[X.repo + 1.9, FY + 12, C.z]} k={S.repo[0]} text={S.repo[1]} vis={sysIn} />
      <Tag kind="sys" position={[X.tbill + 1.6, FY + 6.5, C.z]} k={S.tbill[0]} text={S.tbill[1]} vis={sysIn} />
      <Tag kind="sys" position={[X.bank + 2.0, FY + 3.6, C.z]} k={S.bank[0]} text={S.bank[1]} vis={sysIn} />
      <Tag kind="sys" position={[X.other + 0.9, FY + 1.6, C.z]} k={S.other[0]} text={S.other[1]} vis={sysIn} />
      <Tag kind="sys" position={[X.repo - 2.4, FY + 18.4, C.z]} k={S.fund[0]} text={S.fund[1]} vis={fundVis} align="right" />
      <Tag kind="sys" position={[NODE.x + 1, NODE.y - 1.2, NODE.z]} k={S.pool[0]} text={S.pool[1]} vis={poolVis} />
      <Tag kind="sys" position={[-12, -47, C.z]} k={S.report[0]} text={S.report[1]} vis={sysIn} />
    </group>
  );
}
