"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth, band, lerp } from "@/lib/timeline";
import { useI18n } from "@/lib/i18n";
import { COL, MINT, g, isMap, tmpM, tmpQ, tmpS, tmpV, clock, xr } from "./shared";
import { floorTex, signTex, wireTex, cashTex, cashSideTex } from "./textures";
import { coinMats, coinGeo } from "./coins";
import Bank from "./Bank";
import Tag from "./Tag";

const FY = MINT.floor;
const Z = MINT.z;
const NCOIN = 9;
const BOOTH = new THREE.Vector3(20, FY, 7);
const PHONE = new THREE.Vector3(27, FY, 7);
const COIN_UP = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

/** Hall floor with a round opening where the glass elevator passes through. */
function floorGeo() {
  const s = new THREE.Shape();
  s.moveTo(-14, -14);
  s.lineTo(46, -14);
  s.lineTo(46, 40);
  s.lineTo(-14, 40);
  s.lineTo(-14, -14);
  const h = new THREE.Path();
  h.absarc(0, 8, 4.3, 0, Math.PI * 2, true);
  s.holes.push(h);
  const geo = new THREE.ShapeGeometry(s, 48);
  geo.rotateX(-Math.PI / 2);
  // map world xz to repeating UVs
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / 10;
    uv[i * 2 + 1] = pos.getZ(i) / 10;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}

export default function Mint() {
  const { t } = useI18n();
  const L = t.labels;
  const S = t.sys;
  const group = useRef<THREE.Group>(null);
  const slip = useRef<THREE.Mesh>(null);
  const piston = useRef<THREE.Mesh>(null);
  const coins = useRef<THREE.InstancedMesh>(null);
  const sold = useRef<THREE.InstancedMesh>(null);
  const cash = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);
  const belt1 = useRef<THREE.InstancedMesh>(null);

  const mats = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ map: cashSideTex(), roughness: 0.85 });
    const top = new THREE.MeshStandardMaterial({ map: cashTex(), roughness: 0.8 });
    const fm = floorTex().clone();
    fm.repeat.set(1, 1);
    fm.needsUpdate = true;
    return {
      floor: new THREE.MeshStandardMaterial({ map: fm, color: "#f1ede6", roughness: 0.5 }),
      paint: new THREE.MeshStandardMaterial({ color: "#2f5a8f", metalness: 0.45, roughness: 0.4 }),
      dark: new THREE.MeshStandardMaterial({ color: "#3a4554", metalness: 0.6, roughness: 0.45 }),
      steel: new THREE.MeshStandardMaterial({ color: "#c3ccd8", metalness: 0.9, roughness: 0.3 }),
      wire: new THREE.MeshStandardMaterial({ map: wireTex(), roughness: 0.9 }),
      sign: new THREE.MeshStandardMaterial({ map: signTex("CIRCLE MINT · ISSUANCE", "#0f2340", "#ffffff", 1024, 128, "700 60px 'Space Grotesk', Arial") }),
      ex: new THREE.MeshStandardMaterial({ map: signTex("EXCHANGE", "#f0b429", "#1b2533", 512, 128) }),
      ledger: new THREE.MeshStandardMaterial({ map: signTex("ON-CHAIN · +1,000 USDC", "#e9f2fc", "#2775ca", 768, 128, "700 52px 'JetBrains Mono', monospace") }),
      screen: new THREE.MeshStandardMaterial({ color: "#2775ca", emissive: "#2775ca", emissiveIntensity: 0.4 }),
      cash: [side, side, top, side, side, side],
    };
  }, []);
  const fgeo = useMemo(() => floorGeo(), []);
  const cgeo = useMemo(() => coinGeo(), []);

  useFrame(() => {
    const u = scrollState.u;
    const vis = (u > g("s01", 0.6) && u < g("s03", 0.16)) || isMap(u);
    if (group.current) group.current.visible = vis;
    if (!vis) return;
    const tl = isMap(u) ? 0.7 : local("s02", u);
    const tm = clock.t;

    // 1) the wire slip leaves the bank and rides the belt into the press
    const go = smooth(ramp(tl, 0.1, 0.26));
    if (slip.current) {
      slip.current.position.set(lerp(10.8, 23.2, go), FY + 1.08 + Math.sin(Math.PI * go) * 0.08, Z);
      slip.current.visible = tl > 0.06 && tl < 0.3;
    }
    if (belt1.current) {
      for (let i = 0; i < 18; i++) {
        tmpV.set(11.6 + i * 0.6, FY + 0.95, Z);
        tmpQ.setFromAxisAngle(Y, tm * 2 * (tl > 0.08 && tl < 0.6 ? 1 : 0.1)).premultiply(R_X);
        tmpS.set(1, 1, 1);
        tmpM.compose(tmpV, tmpQ, tmpS);
        belt1.current.setMatrixAt(i, tmpM);
        tmpV.set(27.4 + i * 0.47, FY + 0.95, Z);
        tmpM.compose(tmpV, tmpQ, tmpS);
        belt1.current.setMatrixAt(i + 18, tmpM);
      }
      belt1.current.instanceMatrix.needsUpdate = true;
    }
    // 2) the press stamps twice
    const hit = band(tl, 0.26, 0.29, 0.31, 0.33) + band(tl, 0.33, 0.36, 0.38, 0.4);
    if (piston.current) piston.current.position.y = FY + 4.6 - hit * 1.4;
    if (lamp.current) lamp.current.emissiveIntensity = 0.3 + hit * 1.6 + band(tl, 0.38, 0.42, 0.56, 0.6) * 0.8;

    // 3) new coins roll out and stack on the ledger pedestal
    if (coins.current) {
      for (let i = 0; i < NCOIN; i++) {
        const st = 0.38 + i * 0.018;
        const k = smooth(ramp(tl, st, st + 0.08));
        const shown = tl > st ? 1 : 0;
        const x = lerp(27.2, 39, k);
        const y = k < 1 ? FY + 1.45 + Math.sin(Math.PI * k) * 0.6 : FY + 1.2 + i * 0.16;
        tmpV.set(x, y, Z + 1.6 * k);
        if (k < 1) tmpQ.copy(COIN_UP).premultiply(tmpQ2.setFromAxisAngle(Y, -k * 4));
        else tmpQ.identity();
        tmpS.set(0.55 * shown, 0.55 * shown, 0.55 * shown);
        tmpM.compose(tmpV, tmpQ, tmpS);
        coins.current.setMatrixAt(i, tmpM);
      }
      coins.current.instanceMatrix.needsUpdate = true;
    }

    // 4) buying on an exchange: existing coins change hands, the press stays idle
    const ex = smooth(ramp(tl, 0.6, 0.74));
    if (sold.current) {
      for (let i = 0; i < 6; i++) {
        const mine = i < 3;
        const k = mine ? smooth(ramp(ex, i * 0.15, i * 0.15 + 0.55)) : 0;
        const from = tmpV.set(BOOTH.x - 0.8 + (i % 3) * 0.8, BOOTH.y + 1.9 + Math.floor(i / 3) * 0.18, BOOTH.z - 0.2);
        const to = tmpV2.set(PHONE.x, PHONE.y + 1.5 + i * 0.05, PHONE.z + 0.3);
        tmpV3.lerpVectors(from, to, k);
        tmpV3.y += Math.sin(Math.PI * k) * 1.2;
        tmpQ.identity();
        tmpS.setScalar(0.42);
        tmpM.compose(tmpV3, tmpQ, tmpS);
        sold.current.setMatrixAt(i, tmpM);
      }
      sold.current.instanceMatrix.needsUpdate = true;
    }
    if (cash.current) {
      const k = smooth(ramp(ex, 0.1, 0.7));
      cash.current.position.set(lerp(PHONE.x - 0.4, BOOTH.x + 1.3, k), PHONE.y + 1.4 + Math.sin(Math.PI * k) * 1.0, lerp(PHONE.z + 0.6, BOOTH.z + 0.3, k));
      cash.current.visible = ex > 0.02;
    }
    [mats.paint, mats.dark, mats.floor].forEach((m) => {
      m.transparent = xr.v > 0.01;
      m.opacity = 1 - 0.55 * xr.v;
    });
  });

  const near = (a: number, b: number, c: number, d: number) => (u: number) => band(local("s02", u), a, b, c, d);
  const all = near(0.04, 0.1, 0.9, 0.96);

  return (
    <group ref={group}>
      <pointLight position={[18, FY + 9, Z + 8]} color="#fff4e2" intensity={90} distance={45} decay={1.4} />
      <pointLight position={[24, FY + 6, 10]} color="#ffffff" intensity={40} distance={30} decay={1.5} />

      <mesh geometry={fgeo} position={[0, FY, 0]} material={mats.floor} receiveShadow />
      <mesh position={[16, FY + 5, Z - 8]} receiveShadow>
        <boxGeometry args={[60, 10, 0.6]} />
        <meshStandardMaterial color="#efe8dc" roughness={0.85} />
      </mesh>
      <mesh position={[24, FY + 7.4, Z - 7.6]} material={mats.sign}>
        <planeGeometry args={[18, 2.25]} />
      </mesh>

      {/* the bank that sends the dollars */}
      <Bank position={[8.6, FY, Z]} scale={1.15} sign="BANK" />

      {/* belts */}
      <mesh position={[16.6, FY + 0.45, Z]} material={mats.dark} castShadow receiveShadow>
        <boxGeometry args={[11, 0.9, 1.6]} />
      </mesh>
      <mesh position={[31.4, FY + 0.45, Z]} material={mats.dark} castShadow receiveShadow>
        <boxGeometry args={[8.8, 0.9, 1.6]} />
      </mesh>
      <instancedMesh ref={belt1} args={[undefined, undefined, 36]} material={mats.steel} frustumCulled={false}>
        <cylinderGeometry args={[0.12, 0.12, 1.5, 12]} />
      </instancedMesh>
      <mesh ref={slip} material={mats.wire} castShadow>
        <boxGeometry args={[1.25, 0.02, 0.8]} />
      </mesh>

      {/* the minting press */}
      <group position={[25, FY, Z]}>
        <mesh position={[0, 1.4, 0]} material={mats.paint} castShadow>
          <boxGeometry args={[3.6, 2.8, 3]} />
        </mesh>
        {[-1.4, 1.4].map((x) => (
          <mesh key={x} position={[x, 4.2, 0]} material={mats.paint} castShadow>
            <boxGeometry args={[0.5, 3, 0.8]} />
          </mesh>
        ))}
        <mesh position={[0, 5.9, 0]} material={mats.paint} castShadow>
          <boxGeometry args={[3.6, 0.8, 1.4]} />
        </mesh>
        <mesh position={[0, 2.0, 1.52]}>
          <planeGeometry args={[2.2, 1.0]} />
          <meshStandardMaterial ref={lamp} color="#bfe0ff" emissive="#2775ca" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <mesh ref={piston} position={[25, FY + 4.6, Z]} material={mats.steel} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 2, 24]} />
      </mesh>

      {/* the on-chain ledger */}
      <mesh position={[40, FY + 3.4, Z - 1.8]} material={mats.ledger} castShadow>
        <boxGeometry args={[5.4, 0.9, 0.2]} />
      </mesh>
      <mesh position={[40, FY + 1.6, Z - 1.8]} material={mats.dark}>
        <boxGeometry args={[0.3, 3.2, 0.3]} />
      </mesh>
      <mesh position={[39, FY + 0.5, Z + 1.6]} material={mats.steel} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.15, 1.0, 32]} />
      </mesh>
      <instancedMesh ref={coins} args={[cgeo, coinMats(), NCOIN]} frustumCulled={false} castShadow />

      {/* an exchange kiosk: where most people get USDC */}
      <group position={BOOTH}>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.6, 1.8]} />
          <meshStandardMaterial color="#f7f3ea" roughness={0.6} />
        </mesh>
        <mesh position={[0, 3.6, -0.7]} material={mats.ex}>
          <boxGeometry args={[4.2, 1.05, 0.12]} />
        </mesh>
        {[-2, 2].map((x) => (
          <mesh key={x} position={[x, 2.2, -0.7]} material={mats.dark}>
            <boxGeometry args={[0.12, 2.8, 0.12]} />
          </mesh>
        ))}
      </group>
      <instancedMesh ref={sold} args={[cgeo, coinMats(), 6]} frustumCulled={false} castShadow />
      <group position={[PHONE.x, PHONE.y, PHONE.z]}>
        <mesh position={[0, 0.5, 0]} material={mats.dark}>
          <cylinderGeometry args={[0.35, 0.45, 1, 20]} />
        </mesh>
        <mesh position={[0, 1.55, 0]} rotation={[-0.2, -0.4, 0]} castShadow>
          <boxGeometry args={[0.62, 1.15, 0.07]} />
          <meshStandardMaterial color="#1b2533" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0.02, 1.56, 0.04]} rotation={[-0.2, -0.4, 0]} material={mats.screen}>
          <planeGeometry args={[0.54, 1.02]} />
        </mesh>
      </group>
      <mesh ref={cash} material={mats.cash} castShadow>
        <boxGeometry args={[0.8, 0.28, 0.42]} />
      </mesh>

      <Tag kind="cine" position={[8.6, FY + 4.4, Z + 1.4]} text={L.mintBank} vis={near(0.04, 0.1, 0.3, 0.36)} />
      <Tag kind="cine" position={[25, FY + 7.0, Z + 1]} text={L.press} vis={near(0.2, 0.26, 0.42, 0.48)} />
      <Tag kind="cine" position={[40, FY + 4.4, Z - 1.6]} text={L.ledger} vis={near(0.4, 0.46, 0.58, 0.62)} />
      <Tag kind="cine" position={[BOOTH.x - 2.4, BOOTH.y + 4.6, BOOTH.z]} text={L.booth} vis={near(0.58, 0.62, 0.8, 0.86)} align="right" />
      <Tag kind="sys" position={[11, FY + 2.6, Z + 1]} k={S.kyb[0]} text={S.kyb[1]} vis={all} />
      <Tag kind="sys" position={[27.5, FY + 5.2, Z + 1]} k={S.minter[0]} text={S.minter[1]} vis={all} />
      <Tag kind="sys" position={[36, FY + 2.6, Z + 2.5]} k={S.chainmint[0]} text={S.chainmint[1]} vis={all} />
      <Tag kind="sys" position={[PHONE.x + 1, PHONE.y + 2.6, PHONE.z]} k={S.secondary[0]} text={S.secondary[1]} vis={all} />
    </group>
  );
}

const R_X = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
const Y = new THREE.Vector3(0, 1, 0);
const tmpQ2 = new THREE.Quaternion();
const tmpV2 = new THREE.Vector3();
const tmpV3 = new THREE.Vector3();
void COL;
