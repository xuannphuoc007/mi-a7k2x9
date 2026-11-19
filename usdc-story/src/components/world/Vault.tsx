"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth, band, lerp } from "@/lib/timeline";
import { useI18n } from "@/lib/i18n";
import { COL, VAULT, rnd, tmpM, tmpQ, tmpV, tmpS, clock, xr, g } from "./shared";
import { cashTex, cashSideTex, docTex, floorTex, lockerTex } from "./textures";
import Tag from "./Tag";
import { asset } from "@/lib/asset";

const C = VAULT.center; // floor centre (0,-72,-40)
const FY = C.y;
const CY = VAULT.ceil;
const ZF = VAULT.front;
const ZB = VAULT.back;
const HW = VAULT.halfW;
const DOOR = new THREE.Vector3(0, -64.6, ZF);
const DR = 4.9;
const EXIT = new THREE.Vector3(0, -58, ZB);
const X = { repo: -9, tbill: -3, bank: 4.5, other: 8.4 };
const H = { repo: 16, tbill: 8.05, bank: 2.98 };
const REPO_LEVELS = 22;
const EUL = new THREE.Euler();
const BILLC = [new THREE.Color("#ffd9cf"), new THREE.Color("#fff0b8"), new THREE.Color("#d6f0d0")];
const SHEETS = 34;

/** wall with a round opening */
function holedWall(w: number, h: number, hx: number, hy: number, r: number, depth: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, -h / 2);
  s.lineTo(w / 2, -h / 2);
  s.lineTo(w / 2, h / 2);
  s.lineTo(-w / 2, h / 2);
  s.lineTo(-w / 2, -h / 2);
  const hole = new THREE.Path();
  hole.absarc(hx, hy, r, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 64 });
}

function useMats() {
  return useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ map: cashSideTex(), roughness: 0.85 });
    const top = new THREE.MeshStandardMaterial({ map: cashTex(), roughness: 0.8 });
    const cash = [side, side, top, side, side, side];
    const docTop = new THREE.MeshStandardMaterial({ map: docTex("NOTE"), roughness: 0.9 });
    const paper = new THREE.MeshStandardMaterial({ color: "#efe8d6", roughness: 0.95 });
    const doc = [paper, paper, docTop, paper, paper, paper];
    const billTop = new THREE.MeshStandardMaterial({ map: docTex("BILL · 13 WK"), roughness: 0.9 });
    const bill = [paper, paper, billTop, paper, paper, paper];
    const steel = new THREE.MeshStandardMaterial({ color: "#2f4f78", metalness: 0.45, roughness: 0.45 });
    const marble = new THREE.MeshStandardMaterial({ color: "#efece6", roughness: 0.45, metalness: 0.02 });
    const stone = new THREE.MeshStandardMaterial({ color: "#e2ddd2", roughness: 0.55 });
    return { cash, doc, bill, steel, marble, stone, fadeable: [side, top, docTop, paper, billTop, marble, stone] };
  }, []);
}

/** A small classical bank in marble, with strapped cash visible between the columns. */
function Bank({ position, scale, rise, mats }: { position: [number, number, number]; scale: number; rise: React.MutableRefObject<number>; mats: ReturnType<typeof useMats> }) {
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
      <mesh position={[0, 0.18, 0]} material={mats.stone} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.36, 2.6]} />
      </mesh>
      {[0, 1, 2].map((k) => (
        <mesh key={k} position={[0, 0.06 + k * 0.1, 1.45 + k * 0.12]} material={mats.stone}>
          <boxGeometry args={[3.2 - k * 0.2, 0.1, 0.25]} />
        </mesh>
      ))}
      {cols.map((x) => (
        <mesh key={x} position={[x, 1.36, 0.95]} material={mats.marble} castShadow>
          <cylinderGeometry args={[0.17, 0.2, 2, 20]} />
        </mesh>
      ))}
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => (
          <mesh key={`${r}${c}`} position={[-0.42 + c * 0.84, 0.54 + r * 0.34, -0.2]} material={mats.cash}>
            <boxGeometry args={[0.78, 0.32, 0.42]} />
          </mesh>
        )),
      )}
      <mesh position={[0, 1.3, -1.15]} material={mats.stone}>
        <boxGeometry args={[3.4, 2.2, 0.2]} />
      </mesh>
      <mesh position={[0, 2.5, 0]} material={mats.marble} castShadow>
        <boxGeometry args={[3.9, 0.26, 2.8]} />
      </mesh>
      <mesh position={[0, 2.95, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.95, 1, 0.65]} material={mats.stone} castShadow>
        <cylinderGeometry args={[1, 1, 2.8, 3]} />
      </mesh>
    </group>
  );
}

export default function Vault() {
  const { t } = useI18n();
  const L = t.labels;
  const S = t.sys;
  const mobile = typeof window !== "undefined" && window.innerWidth < 760;
  const NCLOUD = mobile ? 200 : 380;
  const mats = useMats();

  const group = useRef<THREE.Group>(null);
  const door = useRef<THREE.Group>(null);
  const wheel = useRef<THREE.Group>(null);
  const bolts = useRef<THREE.InstancedMesh>(null);
  const cubes = useRef<THREE.InstancedMesh>(null);
  const bonds = useRef<THREE.InstancedMesh>(null);
  const shelves = useRef<THREE.InstancedMesh>(null);
  const sheets = useRef<THREE.InstancedMesh>(null);
  const cloud = useRef<THREE.InstancedMesh>(null);
  const fundMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const fundEdge = useRef<THREE.LineBasicMaterial>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);
  const node = useRef<THREE.Mesh>(null);
  const wallMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const riseBank = useRef(0);
  const riseOther = useRef(0);
  const glowRepo = useRef<THREE.MeshBasicMaterial>(null);
  const glowBill = useRef<THREE.MeshBasicMaterial>(null);
  const glowBank = useRef<THREE.MeshBasicMaterial>(null);
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: COL.usdc, transparent: true, opacity: 0 }), []);

  const geo = useMemo(() => {
    const wallH = CY - FY;
    return {
      front: holedWall(HW * 2, wallH, 0, DOOR.y - (FY + CY) / 2, DR + 0.25, 1.2),
      back: holedWall(HW * 2, wallH, 0, EXIT.y - (FY + CY) / 2, 4.6, 1.2),
      fundEdges: new THREE.EdgesGeometry(new THREE.BoxGeometry(10.6, 17.6, 5.2)),
      towers: [new THREE.EdgesGeometry(new THREE.BoxGeometry(3.4, H.repo, 2.4)), new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, H.tbill, 2.0))],
    };
  }, []);

  const cloudPts = useMemo(
    () =>
      Array.from({ length: NCLOUD }, (_, i) => {
        const a = rnd(i) * Math.PI * 2;
        const r = Math.sqrt(rnd(i + 2));
        return new THREE.Vector3(Math.cos(a) * r * 11, (rnd(i + 5) - 0.5) * 2.4, Math.sin(a) * r * 8);
      }),
    [NCLOUD],
  );
  const CLOUD_Y = -52.6;
  const NODE = useMemo(() => new THREE.Vector3(0, -58.2, C.z), []);
  const lineGeo = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < cloudPts.length; i += 4) {
      const p = cloudPts[i];
      arr.push(p.x, CLOUD_Y + p.y, C.z + p.z, NODE.x, NODE.y, NODE.z);
    }
    const tops: [number, number][] = [
      [X.repo, FY + H.repo],
      [X.tbill, FY + H.tbill],
      [X.bank, FY + 3.2],
      [X.other, FY + 1.1],
    ];
    for (const [x, y] of tops) arr.push(NODE.x, NODE.y, NODE.z, x, y + 0.2, C.z);
    const g0 = new THREE.BufferGeometry();
    g0.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return g0;
  }, [cloudPts, NODE]);

  const floorMap = useMemo(() => floorTex(), []);
  const coinMats = useMemo(() => {
    const face = new THREE.TextureLoader().load(asset("/img/usdc.png"));
    face.colorSpace = THREE.SRGBColorSpace;
    const side = new THREE.MeshStandardMaterial({ color: "#d7e3f2", metalness: 0.6, roughness: 0.3 });
    const cap = new THREE.MeshStandardMaterial({ map: face, color: "#ffffff", metalness: 0.1, roughness: 0.35 });
    return [side, cap, cap];
  }, []);
  const lockerMap = useMemo(() => lockerTex(), []);

  useFrame(() => {
    const u = scrollState.u;
    const vis = u > g("s01", 0.8) && u < g("s05", 0.16);
    if (group.current) group.current.visible = vis;
    if (!vis) return;
    const tl = local("s03", u);
    const tm = clock.t;
    const x = xr.v;

    // the vault door: wheel turns, bolts retract, door swings inward on its hinge
    const spin = smooth(ramp(tl, 0.03, 0.08));
    const retract = smooth(ramp(tl, 0.06, 0.09));
    const swing = smooth(ramp(tl, 0.085, 0.15));
    if (wheel.current) wheel.current.rotation.z = -spin * Math.PI * 1.5;
    if (door.current) door.current.rotation.y = swing * 1.85;
    if (bolts.current) {
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2;
        const r = DR - 0.1 + (1 - retract) * 0.55;
        tmpV.set(Math.cos(a) * r, Math.sin(a) * r, 0);
        tmpQ.setFromAxisAngle(tmpS.set(0, 0, 1), a - Math.PI / 2);
        tmpS.set(1, 1, 1);
        tmpM.compose(tmpV, tmpQ, tmpS);
        bolts.current.setMatrixAt(i, tmpM);
      }
      bolts.current.instanceMatrix.needsUpdate = true;
    }
    wallMats.current.forEach((m) => {
      m.transparent = x > 0.01;
      m.opacity = 1 - 0.75 * x;
    });
    mats.fadeable.forEach((m) => {
      m.transparent = x > 0.01;
      m.opacity = 1 - 0.55 * x;
    });

    const rise = (i: number) => smooth(ramp(tl, 0.15 + i * 0.035, 0.27 + i * 0.035));
    const rRepo = rise(0);
    const rT = rise(1);
    riseBank.current = rise(2);
    riseOther.current = rise(3);

    // overnight repo: on every shelf, a cash bundle and a Treasury folder swap sides each "night" and swap back
    if (cubes.current && bonds.current && shelves.current) {
      for (let i = 0; i < REPO_LEVELS; i++) {
        const shown = rRepo * REPO_LEVELS > i ? 1 : 0;
        const y = FY + 0.4 + i * (H.repo / REPO_LEVELS);
        const ph = (tm * 0.2 + i * 0.137) % 1;
        const sw = smooth(ramp(ph, 0.1, 0.35)) - smooth(ramp(ph, 0.6, 0.85));
        const lift = Math.sin(Math.PI * sw) * 0.22;
        tmpQ.identity();
        tmpS.setScalar(shown);
        tmpV.set(X.repo + lerp(-0.78, 0.78, sw), y + 0.19 + lift, C.z);
        tmpM.compose(tmpV, tmpQ, tmpS);
        cubes.current.setMatrixAt(i, tmpM);
        tmpV.set(X.repo + lerp(0.78, -0.78, sw), y + 0.08 + lift * 0.5, C.z);
        tmpM.compose(tmpV, tmpQ, tmpS);
        bonds.current.setMatrixAt(i, tmpM);
        tmpV.set(X.repo, y, C.z);
        tmpM.compose(tmpV, tmpQ, tmpS);
        shelves.current.setMatrixAt(i, tmpM);
      }
      cubes.current.instanceMatrix.needsUpdate = true;
      bonds.current.instanceMatrix.needsUpdate = true;
      shelves.current.instanceMatrix.needsUpdate = true;
    }

    // T-bills: certificates drift down the rack as they mature, new ones arrive on top
    if (sheets.current) {
      const span = H.tbill - 0.3;
      for (let j = 0; j < SHEETS; j++) {
        let y = (j * (span / SHEETS) - tm * 0.1) % span;
        if (y < 0) y += span;
        const edge = Math.min(1, y / 0.5, (span - y) / 0.5);
        const shown = rT * span > y ? 1 : 0;
        tmpV.set(X.tbill + (rnd(j) - 0.5) * 0.14, FY + 0.25 + y, C.z + (rnd(j + 3) - 0.5) * 0.14);
        tmpQ.setFromAxisAngle(tmpS.set(0, 1, 0), (rnd(j + 7) - 0.5) * 0.12);
        tmpS.set(edge * shown, shown, edge * shown);
        tmpM.compose(tmpV, tmpQ, tmpS);
        sheets.current.setMatrixAt(j, tmpM);
        sheets.current.setColorAt(j, BILLC[j % 3]);
      }
      sheets.current.instanceMatrix.needsUpdate = true;
      if (sheets.current.instanceColor) sheets.current.instanceColor.needsUpdate = true;
    }

    // floor spotlights under the asset being discussed
    if (glowRepo.current) glowRepo.current.opacity = band(tl, 0.3, 0.36, 0.44, 0.5) * 0.55;
    if (glowBill.current) glowBill.current.opacity = band(tl, 0.44, 0.5, 0.56, 0.62) * 0.55;
    if (glowBank.current) glowBank.current.opacity = band(tl, 0.56, 0.62, 0.68, 0.73) * 0.55;

    const fund = smooth(ramp(tl, 0.68, 0.75));
    if (fundMat.current) {
      fundMat.current.opacity = fund * 0.16;
      fundMat.current.visible = fund > 0.005;
    }
    if (fundEdge.current) {
      fundEdge.current.opacity = fund * 0.95;
      fundEdge.current.visible = fund > 0.005;
    }

    const cl = smooth(ramp(tl, 0.76, 0.84));
    if (cloud.current) {
      for (let i = 0; i < cloudPts.length; i++) {
        const p = cloudPts[i];
        tmpV.set(p.x + Math.sin(tm * 0.3 + i) * 0.25, CLOUD_Y + p.y + Math.sin(tm * 0.5 + i * 1.7) * 0.15, C.z + p.z);
        tmpQ.setFromEuler(EUL.set(Math.PI / 2 - 0.35 + Math.sin(tm * 0.5 + i) * 0.25, Math.sin(tm * 0.3 + i * 2.1) * 0.6, 0));
        const sc = cl * (0.17 + rnd(i + 1) * 0.08);
        tmpS.setScalar(Math.max(0.0001, sc));
        tmpM.compose(tmpV, tmpQ, tmpS);
        cloud.current.setMatrixAt(i, tmpM);
      }
      cloud.current.instanceMatrix.needsUpdate = true;
    }
    if (linesMat.current) {
      linesMat.current.opacity = smooth(ramp(tl, 0.8, 0.87)) * (0.45 + 0.35 * x);
      linesMat.current.visible = linesMat.current.opacity > 0.005;
    }
    if (node.current) node.current.scale.setScalar(Math.max(0.001, smooth(ramp(tl, 0.8, 0.86))));
    edgeMat.opacity = x * smooth(ramp(tl, 0.2, 0.3));
    edgeMat.visible = edgeMat.opacity > 0.005;
  });

  const vRepo = (u: number) => band(local("s03", u), 0.27, 0.32, 0.86, 0.92);
  const sysIn = (u: number) => band(local("s03", u), 0.18, 0.26, 0.95, 1.0);
  const fundVis = (u: number) => band(local("s03", u), 0.7, 0.76, 0.95, 1.0);
  const poolVis = (u: number) => band(local("s03", u), 0.8, 0.86, 0.97, 1.0);
  const doorVis = (u: number) => band(local("s03", u), -0.05, 0.0, 0.08, 0.12);
  const wallRef = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !wallMats.current.includes(m)) wallMats.current.push(m);
  };
  const wallH = CY - FY;
  const yMid = (FY + CY) / 2;

  return (
    <group ref={group}>
      <pointLight position={[0, CY - 2, C.z]} color="#fff6e8" intensity={70} distance={60} decay={1.3} />
      <pointLight position={[-9, -58, C.z + 9]} color="#ffffff" intensity={28} distance={30} decay={1.5} />
      <pointLight position={[0, -60, ZF + 10]} color="#ffffff" intensity={40} distance={30} decay={1.4} />

      {/* floors (antechamber + vault) */}
      <mesh position={[0, FY, (ZF + 8 + ZB) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[HW * 2 + 6, ZF + 8 - ZB]} />
        <meshStandardMaterial ref={wallRef} map={floorMap} roughness={0.35} metalness={0.05} />
      </mesh>
      {/* walls */}
      <mesh geometry={geo.front} position={[0, yMid, ZF - 1.2]} receiveShadow>
        <meshStandardMaterial ref={wallRef} color="#e6dccb" roughness={0.8} />
      </mesh>
      <mesh geometry={geo.back} position={[0, yMid, ZB - 1.2]}>
        <meshStandardMaterial ref={wallRef} color="#e6dccb" roughness={0.8} />
      </mesh>
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[sd * HW, yMid, (ZF + ZB) / 2]} receiveShadow>
          <boxGeometry args={[0.6, wallH, ZF - ZB]} />
          <meshStandardMaterial ref={wallRef} map={lockerMap} roughness={0.4} metalness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, CY + 0.3, (ZF + ZB) / 2]}>
        <boxGeometry args={[HW * 2, 0.6, ZF - ZB]} />
        <meshStandardMaterial ref={wallRef} color="#f1ebe0" roughness={0.9} />
      </mesh>
      {[-8, 0, 8].map((x) => (
        <mesh key={x} position={[x, CY - 0.02, (ZF + ZB) / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, ZF - ZB - 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* door frame + exit frame */}
      <mesh position={[DOOR.x, DOOR.y, ZF + 0.05]}>
        <torusGeometry args={[DR + 0.35, 0.32, 16, 96]} />
        <meshStandardMaterial color={COL.steel} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[EXIT.x, EXIT.y, ZB + 0.05]}>
        <torusGeometry args={[4.7, 0.25, 16, 96]} />
        <meshStandardMaterial color={COL.steel} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[EXIT.x, EXIT.y, ZB + 0.2]}>
        <torusGeometry args={[4.35, 0.05, 8, 96]} />
        <meshBasicMaterial color={COL.usdc} />
      </mesh>

      {/* the vault door, hinged on the left */}
      <group ref={door} position={[DOOR.x - DR - 0.45, DOOR.y, ZF + 0.1]}>
        <group position={[DR + 0.45, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[DR, DR, 1.3, 96]} />
            <meshStandardMaterial color="#c9d1dc" metalness={0.92} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0, 0.66]}>
            <torusGeometry args={[DR - 0.35, 0.18, 16, 96]} />
            <meshStandardMaterial color="#b7c1ce" metalness={0.95} roughness={0.22} />
          </mesh>
          {[1.2, 2.3, 3.4].map((r) => (
            <mesh key={r} position={[0, 0, 0.66]}>
              <torusGeometry args={[r, 0.03, 8, 96]} />
              <meshStandardMaterial color="#a5afbd" metalness={0.9} roughness={0.3} />
            </mesh>
          ))}
          <instancedMesh ref={bolts} args={[undefined, undefined, 20]} frustumCulled={false}>
            <cylinderGeometry args={[0.2, 0.2, 1.1, 16]} />
            <meshStandardMaterial color="#d9b65e" metalness={0.95} roughness={0.2} />
          </instancedMesh>
          <group ref={wheel} position={[0, 0, 1.05]}>
            <mesh>
              <torusGeometry args={[1.45, 0.13, 12, 64]} />
              <meshStandardMaterial color="#c9a24a" metalness={0.95} roughness={0.25} />
            </mesh>
            {[0, 1, 2].map((k) => (
              <mesh key={k} rotation={[0, 0, (k * Math.PI) / 3]}>
                <boxGeometry args={[2.9, 0.12, 0.12]} />
                <meshStandardMaterial color="#c9a24a" metalness={0.95} roughness={0.25} />
              </mesh>
            ))}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.4, 24]} />
              <meshStandardMaterial color="#d9b65e" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
        </group>
        {[-2.6, 0, 2.6].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 1.4, 20]} />
            <meshStandardMaterial color="#9aa6b6" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* overnight repo: steel shelving */}
      {[
        [-1.6, -1.1],
        [1.6, -1.1],
        [-1.6, 1.1],
        [1.6, 1.1],
      ].map(([dx, dz]) => (
        <mesh key={`${dx}${dz}`} position={[X.repo + dx, FY + H.repo / 2 + 0.2, C.z + dz]} material={mats.steel} castShadow>
          <boxGeometry args={[0.1, H.repo + 0.4, 0.1]} />
        </mesh>
      ))}
      <instancedMesh ref={shelves} args={[undefined, undefined, REPO_LEVELS]} frustumCulled={false} material={mats.steel} castShadow receiveShadow>
        <boxGeometry args={[3.3, 0.05, 2.3]} />
      </instancedMesh>
      <instancedMesh ref={cubes} args={[undefined, undefined, REPO_LEVELS]} frustumCulled={false} material={mats.cash} castShadow>
        <boxGeometry args={[0.95, 0.34, 0.5]} />
      </instancedMesh>
      <instancedMesh ref={bonds} args={[undefined, undefined, REPO_LEVELS]} frustumCulled={false} material={mats.doc} castShadow>
        <boxGeometry args={[0.9, 0.12, 1.12]} />
      </instancedMesh>

      {/* T-bill rack */}
      {[
        [-1.15, -0.8],
        [1.15, -0.8],
        [-1.15, 0.8],
        [1.15, 0.8],
      ].map(([dx, dz]) => (
        <mesh key={`b${dx}${dz}`} position={[X.tbill + dx, FY + H.tbill / 2, C.z + dz]} material={mats.steel} castShadow>
          <boxGeometry args={[0.07, H.tbill, 0.07]} />
        </mesh>
      ))}
      <instancedMesh ref={sheets} args={[undefined, undefined, SHEETS]} frustumCulled={false} material={mats.bill} castShadow>
        <boxGeometry args={[1.9, 0.045, 1.35]} />
      </instancedMesh>

      {/* cash at banks */}
      <Bank position={[X.bank, FY, C.z]} scale={1} rise={riseBank} mats={mats} />
      <Bank position={[X.other, FY, C.z]} scale={0.32} rise={riseOther} mats={mats} />

      {/* soft floor spotlights */}
      {(
        [
          [X.repo, glowRepo, 2.6],
          [X.tbill, glowBill, 2.0],
          [X.bank + 1.6, glowBank, 4.2],
        ] as [number, React.RefObject<THREE.MeshBasicMaterial>, number][]
      ).map(([x, ref, r]) => (
        <mesh key={x} position={[x, FY + 0.02, C.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[r, 48]} />
          <meshBasicMaterial ref={ref} color={COL.volt} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}

      {/* X-RAY outlines */}
      <lineSegments geometry={geo.towers[0]} material={edgeMat} position={[X.repo, FY + H.repo / 2, C.z]} />
      <lineSegments geometry={geo.towers[1]} material={edgeMat} position={[X.tbill, FY + H.tbill / 2, C.z]} />

      {/* Circle Reserve Fund: a glass display case */}
      <mesh position={[(X.repo + X.tbill) / 2 - 0.3, FY + 8.8, C.z]}>
        <boxGeometry args={[10.6, 17.6, 5.2]} />
        <meshPhysicalMaterial ref={fundMat} color="#d9ecff" roughness={0.05} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={geo.fundEdges} position={[(X.repo + X.tbill) / 2 - 0.3, FY + 8.8, C.z]}>
        <lineBasicMaterial ref={fundEdge} color="#b38d48" transparent opacity={0} />
      </lineSegments>

      {/* USDC holders above, all tied to one pool */}
      <instancedMesh ref={cloud} args={[undefined, undefined, cloudPts.length]} frustumCulled={false} material={coinMats}>
        <cylinderGeometry args={[1, 1, 0.14, 32]} />
      </instancedMesh>
      <mesh ref={node} position={NODE}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#c9a24a" metalness={0.8} roughness={0.25} />
      </mesh>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial ref={linesMat} color={COL.usdc} transparent opacity={0} depthWrite={false} />
      </lineSegments>

      {/* labels */}
      <Tag kind="cine" position={[DOOR.x + DR + 1, DOOR.y + 3, ZF + 0.5]} text={L.vault} vis={doorVis} />
      <Tag kind="cine" position={[X.repo - 1.9, FY + 0.6, C.z + 2.2]} text={L.repo} vis={vRepo} align="right" />
      <Tag kind="cine" position={[X.tbill - 0.2, FY + 0.25, C.z + 2.6]} text={L.tbill} vis={vRepo} />
      <Tag kind="cine" position={[X.bank - 1.2, FY + 0.15, C.z + 2.6]} text={L.bank} vis={vRepo} />
      <Tag kind="cine" position={[X.other + 0.3, FY + 0.9, C.z + 0.6]} text={L.other} vis={vRepo} />
      <Tag kind="cine" position={[X.repo - 0.5, FY + 18.1, C.z]} text={L.fund} vis={fundVis} />
      <Tag kind="cine" position={[NODE.x + 0.8, NODE.y, NODE.z]} text={L.pool} vis={poolVis} />
      <Tag kind="cine" position={[10.5, CLOUD_Y + 0.5, C.z]} text={L.tokens} vis={poolVis} />

      <Tag kind="sys" position={[X.repo + 1.9, FY + 12, C.z]} k={S.repo[0]} text={S.repo[1]} vis={sysIn} />
      <Tag kind="sys" position={[X.tbill + 1.6, FY + 6.5, C.z]} k={S.tbill[0]} text={S.tbill[1]} vis={sysIn} />
      <Tag kind="sys" position={[X.bank + 2.0, FY + 3.6, C.z]} k={S.bank[0]} text={S.bank[1]} vis={sysIn} />
      <Tag kind="sys" position={[X.other + 0.9, FY + 1.6, C.z]} k={S.other[0]} text={S.other[1]} vis={sysIn} />
      <Tag kind="sys" position={[X.repo - 2.4, FY + 18.4, C.z]} k={S.fund[0]} text={S.fund[1]} vis={fundVis} align="right" />
      <Tag kind="sys" position={[NODE.x + 1, NODE.y - 1.2, NODE.z]} k={S.pool[0]} text={S.pool[1]} vis={poolVis} />
      <Tag kind="sys" position={[-13, CY - 2, C.z]} k={S.report[0]} text={S.report[1]} vis={sysIn} />
    </group>
  );
}
