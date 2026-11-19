"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth, band, lerp } from "@/lib/timeline";
import { useI18n } from "@/lib/i18n";
import { CONTROL, g, isMap, tmpM, tmpQ, tmpS, tmpV, tmpC, clock, xr } from "./shared";
import { signTex } from "./textures";
import { coinMats, coinGeo } from "./coins";
import Tag from "./Tag";

const C = CONTROL;
const FY = C.y;
const COLS = 12;
const ROWS = 6;
const TARGET = 3 * COLS + 5;
const WALLZ = C.z - 8;
const boxPos = (i: number) => new THREE.Vector3(C.x - 8.25 + (i % COLS) * 1.5, FY + 0.6 + Math.floor(i / COLS) * 1.0, WALLZ);
const T = boxPos(TARGET);
const ROLES = ["OWNER", "MASTER MINTER", "PAUSER", "BLACKLISTER", "ADMIN"];
const ROLE_COL = ["#2775ca", "#3ddc97", "#f0b429", "#c4402f", "#7a5cd6"];

export default function Control() {
  const { t } = useI18n();
  const L = t.labels;
  const S = t.sys;
  const group = useRef<THREE.Group>(null);
  const boxes = useRef<THREE.InstancedMesh>(null);
  const lock = useRef<THREE.Group>(null);
  const coin = useRef<THREE.Mesh>(null);
  const reject = useRef<THREE.Mesh>(null);
  const lamps = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const cgeo = useMemo(() => coinGeo(), []);
  const mats = useMemo(
    () => ({
      floor: new THREE.MeshStandardMaterial({ color: "#e9edf2", roughness: 0.6 }),
      wall: new THREE.MeshStandardMaterial({ color: "#e4e9f0", roughness: 0.8 }),
      box: new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.35, roughness: 0.45 }),
      desk: new THREE.MeshStandardMaterial({ color: "#2b3442", metalness: 0.4, roughness: 0.45 }),
      red: new THREE.MeshStandardMaterial({ color: "#c4402f", metalness: 0.3, roughness: 0.4 }),
      steel: new THREE.MeshStandardMaterial({ color: "#c3ccd8", metalness: 0.9, roughness: 0.3 }),
      sign: new THREE.MeshStandardMaterial({ map: signTex("USDC CONTRACT · FiatToken", "#0f2340", "#ffffff", 1024, 128, "700 58px 'Space Grotesk', Arial") }),
      reject: new THREE.MeshBasicMaterial({ map: signTex("✕  TRANSFER REVERTED", "#c4402f", "#ffffff", 768, 128, "700 54px 'JetBrains Mono', monospace"), transparent: true }),
      history: new THREE.MeshStandardMaterial({ map: signTex("PAST TRANSFERS · UNCHANGED", "#f7f5f0", "#3b4c63", 1024, 128, "600 50px 'JetBrains Mono', monospace") }),
      roles: ROLES.map((r) => new THREE.MeshStandardMaterial({ map: signTex(r, "#1b2533", "#ffffff", 512, 96, "700 40px 'JetBrains Mono', monospace") })),
    }),
    [],
  );

  useFrame(() => {
    const u = scrollState.u;
    const vis = (u > g("s06", 0.85) && u < g("s08", 0.15)) || isMap(u);
    if (group.current) group.current.visible = vis;
    if (!vis) return;
    const tl = isMap(u) ? 0.5 : local("s07", u);
    const tm = clock.t;
    const locked = smooth(ramp(tl, 0.27, 0.33));

    if (boxes.current) {
      for (let i = 0; i < COLS * ROWS; i++) {
        tmpV.copy(boxPos(i));
        tmpQ.identity();
        tmpS.set(1, 1, 1);
        tmpM.compose(tmpV, tmpQ, tmpS);
        boxes.current.setMatrixAt(i, tmpM);
        tmpC.set(i === TARGET ? "#ffffff" : "#f2f5f9");
        if (i === TARGET) tmpC.lerp(RED, locked * 0.75);
        boxes.current.setColorAt(i, tmpC);
      }
      boxes.current.instanceMatrix.needsUpdate = true;
      if (boxes.current.instanceColor) boxes.current.instanceColor.needsUpdate = true;
    }
    if (lock.current) {
      lock.current.scale.setScalar(Math.max(0.001, locked));
      lock.current.position.set(T.x, T.y + lerp(1.2, 0, locked), T.z + 0.42);
    }
    // a transfer tries to reach the frozen address and bounces back
    const inn = smooth(ramp(tl, 0.42, 0.5));
    const back = smooth(ramp(tl, 0.5, 0.6));
    if (coin.current) {
      coin.current.visible = tl > 0.4 && tl < 0.64;
      tmpV.set(lerp(C.x + 2, T.x, inn), lerp(FY + 2.4, T.y, inn) + Math.sin(Math.PI * inn) * 1.0, lerp(C.z + 2, T.z + 0.9, inn));
      if (back > 0) tmpV.set(lerp(T.x, T.x + 1.6, back), T.y + Math.sin(Math.PI * back) * 0.8 - back * (T.y - FY - 0.3), lerp(T.z + 0.9, T.z + 3.5, back));
      coin.current.position.copy(tmpV);
      coin.current.rotation.set(Math.PI / 2, 0, tm * 2);
    }
    if (reject.current) {
      const r = band(tl, 0.49, 0.52, 0.64, 0.7);
      (reject.current.material as THREE.MeshBasicMaterial).opacity = r;
      reject.current.visible = r > 0.01;
    }
    // role lamps light one by one; the blacklister stays red while it acts
    const each = [band(tl, 0.66, 0.69, 0.92, 0.96), band(tl, 0.68, 0.71, 0.92, 0.96), band(tl, 0.7, 0.73, 0.92, 0.96), Math.max(band(tl, 0.24, 0.27, 0.6, 0.64), band(tl, 0.72, 0.75, 0.92, 0.96)), band(tl, 0.74, 0.77, 0.92, 0.96)];
    lamps.current.forEach((m, i) => m && (m.emissiveIntensity = 0.1 + each[i] * 1.6 + xr.v * 0.4));
    [mats.wall, mats.floor].forEach((m) => {
      m.transparent = xr.v > 0.01;
      m.opacity = 1 - 0.6 * xr.v;
    });
  });

  const n = (a: number, b: number, c: number, d: number) => (u: number) => band(local("s07", u), a, b, c, d);

  return (
    <group ref={group}>
      <pointLight position={[C.x, FY + 9, C.z + 4]} color="#ffffff" intensity={90} distance={40} decay={1.4} />
      <mesh position={[C.x, FY + 0.05, C.z - 1]} material={mats.floor} receiveShadow>
        <boxGeometry args={[26, 0.3, 20]} />
      </mesh>
      <mesh position={[C.x, FY + 4, WALLZ - 0.6]} material={mats.wall} receiveShadow>
        <boxGeometry args={[22, 8, 0.6]} />
      </mesh>
      <mesh position={[C.x, FY + 7.1, WALLZ - 0.25]} material={mats.sign}>
        <planeGeometry args={[12, 1.5]} />
      </mesh>
      <instancedMesh ref={boxes} args={[undefined, undefined, COLS * ROWS]} material={mats.box} frustumCulled={false} castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.85, 0.7]} />
      </instancedMesh>

      {/* padlock on the frozen address */}
      <group ref={lock}>
        <mesh material={mats.red} castShadow>
          <boxGeometry args={[0.55, 0.45, 0.18]} />
        </mesh>
        <mesh position={[0, 0.3, 0]} material={mats.steel}>
          <torusGeometry args={[0.17, 0.05, 10, 24, Math.PI]} />
        </mesh>
      </group>
      <mesh ref={coin} geometry={cgeo} material={coinMats()} scale={0.45} castShadow />
      <mesh ref={reject} position={[T.x + 1.2, T.y + 1.4, T.z + 1.6]} material={mats.reject}>
        <planeGeometry args={[3.6, 0.6]} />
      </mesh>

      {/* the console with the contract's privileged roles */}
      <mesh position={[C.x, FY + 0.55, C.z + 2]} material={mats.desk} castShadow receiveShadow>
        <boxGeometry args={[11, 1.1, 2.2]} />
      </mesh>
      {ROLES.map((r, i) => {
        const x = C.x - 4.4 + i * 2.2;
        return (
          <group key={r} position={[x, FY + 1.2, C.z + 2]}>
            <mesh rotation={[0.5, 0, 0]} material={mats.desk}>
              <boxGeometry args={[1.9, 0.12, 1.2]} />
            </mesh>
            <mesh position={[0, 0.07, 0.04]} rotation={[0.5 - Math.PI / 2, 0, 0]} material={mats.roles[i]}>
              <planeGeometry args={[1.7, 0.32]} />
            </mesh>
            <mesh position={[0, 0.32, -0.3]}>
              <sphereGeometry args={[0.16, 20, 20]} />
              <meshStandardMaterial ref={(m) => (lamps.current[i] = m)} color={ROLE_COL[i]} emissive={ROLE_COL[i]} emissiveIntensity={0.1} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[C.x + 10.6, FY + 3.4, C.z - 2]} rotation={[0, -Math.PI / 2, 0]} material={mats.history}>
        <planeGeometry args={[7, 0.9]} />
      </mesh>

      <Tag kind="cine" position={[T.x + 1, T.y + 0.2, T.z + 0.5]} text={L.frozen} vis={n(0.3, 0.34, 0.66, 0.72)} />
      <Tag kind="cine" position={[C.x - 6, FY + 2.6, C.z + 3.2]} text={L.roles} vis={n(0.64, 0.68, 0.92, 0.98)} align="right" />
      <Tag kind="sys" position={[T.x + 1.4, T.y - 0.9, T.z + 0.6]} k={S.blacklist[0]} text={S.blacklist[1]} vis={n(0.2, 0.26, 0.92, 0.98)} />
      <Tag kind="sys" position={[C.x - 8, FY + 4.2, C.z + 2]} k={S.pause[0]} text={S.pause[1]} vis={n(0.6, 0.66, 0.92, 0.98)} align="right" />
      <Tag kind="sys" position={[C.x + 6, FY + 3.2, C.z + 2]} k={S.upgrade[0]} text={S.upgrade[1]} vis={n(0.6, 0.66, 0.92, 0.98)} />
      <Tag kind="sys" position={[C.x + 9.5, FY + 4.6, C.z - 2]} k={S.terms[0]} text={S.terms[1]} vis={n(0.1, 0.16, 0.92, 0.98)} />
    </group>
  );
}

const RED = new THREE.Color("#c4402f");
