"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth, band, lerp } from "@/lib/timeline";
import { useI18n } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { CHAINS, ETH, SOL, MARKET, CONTROL, g, isMap, rnd, tmpM, tmpQ, tmpS, tmpV, clock, xr } from "./shared";
import { facadeTex, roadTex, signTex } from "./textures";
import { coinMats, bridgedMats, coinGeo } from "./coins";
import { Garden } from "./Portal";
import Tag from "./Tag";

const HUB = new THREE.Vector3(0, -64, -70);
const BRIDGE = new THREE.Vector3(-23, -64, -125);
const GROUND_Y = -64.42;

type Spec = { key: keyof typeof CHAINS; color: string; shape: "box" | "hex" | "tri"; h: number };
const SPECS: Spec[] = [
  { key: "base", color: "#0052ff", shape: "box", h: 9 },
  { key: "arb", color: "#213147", shape: "box", h: 8 },
  { key: "poly", color: "#8247e5", shape: "hex", h: 8.5 },
  { key: "avax", color: "#e84142", shape: "tri", h: 9.5 },
];

function Road({ a, b }: { a: THREE.Vector3; b: THREE.Vector3 }) {
  const geo = useMemo(() => {
    const len = a.distanceTo(b);
    const gq = new THREE.PlaneGeometry(2.4, len);
    const uv = gq.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * (len / 6));
    return gq;
  }, [a, b]);
  const tex = useMemo(() => {
    const t = roadTex().clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
    return t;
  }, []);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const ang = Math.atan2(b.x - a.x, b.z - a.z);
  return (
    <mesh geometry={geo} position={[mid.x, GROUND_Y + 0.03, mid.z]} rotation={[-Math.PI / 2, 0, ang]} receiveShadow>
      <meshStandardMaterial map={tex} roughness={0.9} />
    </mesh>
  );
}

export default function Network() {
  const { t } = useI18n();
  const L = t.labels;
  const S = t.sys;
  const group = useRef<THREE.Group>(null);
  const traffic = useRef<THREE.InstancedMesh>(null);
  const locked = useRef<THREE.Mesh>(null);
  const wrapped = useRef<THREE.Mesh>(null);
  const highlight = useRef<THREE.Mesh[]>([]);
  const cgeo = useMemo(() => coinGeo(), []);

  const roads = useMemo(() => {
    const ends = [ETH, CHAINS.base, CHAINS.arb, CHAINS.poly, CHAINS.avax];
    const r: [THREE.Vector3, THREE.Vector3][] = ends.map((e) => [HUB, e]);
    r.push([ETH, BRIDGE], [BRIDGE, CHAINS.poly], [CHAINS.avax, SOL], [SOL, MARKET], [MARKET, CONTROL]);
    return r.map(([a, b]) => [new THREE.Vector3(a.x, GROUND_Y, a.z), new THREE.Vector3(b.x, GROUND_Y, b.z)] as [THREE.Vector3, THREE.Vector3]);
  }, []);
  const mats = useMemo(
    () => ({
      fac: SPECS.map((s) => facadeTex(s.color, s.key)),
      bridge: new THREE.MeshStandardMaterial({ map: signTex("BRIDGE · LOCK & MINT", "#5b6675", "#ffffff", 768, 128, "700 50px 'Space Grotesk', Arial") }),
      glass: new THREE.MeshPhysicalMaterial({ color: "#dcecfb", roughness: 0.05, transparent: true, opacity: 0.35 }),
    }),
    [],
  );

  useFrame(() => {
    const u = scrollState.u;
    const vis = (u > g("s03", 0.85) && u < g("s07", 0)) || u > g("s09", 0.4);
    if (group.current) group.current.visible = vis || isMap(u);
    if (!(vis || isMap(u))) return;
    const tl = local("s04", u);
    const tm = clock.t;

    // ambient traffic: native USDC rolling along the roads
    if (traffic.current) {
      const n = traffic.current.count;
      for (let i = 0; i < n; i++) {
        const [a, b] = roads[i % 5];
        const k = (tm * 0.04 + rnd(i) + (i % 2 ? 0 : 0.5)) % 1;
        const fwd = i % 2 === 0;
        tmpV.lerpVectors(fwd ? a : b, fwd ? b : a, k);
        tmpV.y = GROUND_Y + 0.55;
        const ang = Math.atan2(b.x - a.x, b.z - a.z);
        tmpQ.setFromEuler(EU.set(0, ang + Math.PI / 2, Math.PI / 2));
        tmpQ.multiply(ROLL.setFromAxisAngle(YAX, tm * 3 * (fwd ? 1 : -1)));
        tmpS.setScalar(0.5);
        tmpV.x += (fwd ? 0.55 : -0.55) * Math.cos(ang);
        tmpV.z -= (fwd ? 0.55 : -0.55) * Math.sin(ang);
        tmpM.compose(tmpV, tmpQ, tmpS);
        traffic.current.setMatrixAt(i, tmpM);
      }
      traffic.current.instanceMatrix.needsUpdate = true;
    }

    // the bridge: a native coin is locked inside, a grey IOU comes out the other side
    const lock = smooth(ramp(tl, 0.56, 0.64));
    const out = smooth(ramp(tl, 0.64, 0.74));
    if (locked.current) {
      locked.current.position.set(lerp(BRIDGE.x + 5, BRIDGE.x + 0.6, lock), GROUND_Y + 1.2, BRIDGE.z + lerp(4, 0, lock));
      locked.current.rotation.set(Math.PI / 2, 0, tm * 0.6);
    }
    if (wrapped.current) {
      wrapped.current.visible = out > 0.01;
      wrapped.current.position.set(lerp(BRIDGE.x - 1.2, BRIDGE.x - 6, out), GROUND_Y + 1.2, BRIDGE.z - lerp(0, 3, out));
      wrapped.current.rotation.set(Math.PI / 2, 0, tm * 0.6);
      wrapped.current.scale.setScalar(Math.max(0.01, out) * 0.8);
    }
    // gentle spotlight ring on the plaza being discussed
    const focus = [band(tl, 0.2, 0.26, 0.32, 0.36), band(tl, 0.32, 0.38, 0.44, 0.48), band(tl, 0.46, 0.52, 0.6, 0.64), band(tl, 0.72, 0.78, 0.86, 0.9)];
    highlight.current.forEach((m, i) => {
      if (m) (m.material as THREE.MeshBasicMaterial).opacity = focus[i] * 0.6 + xr.v * 0.2;
    });
  });

  const near = (a: number, b: number, c: number, d: number) => (u: number) => band(local("s04", u), a, b, c, d);
  const plazaVis = near(0.08, 0.14, 0.94, 1.0);
  const labelFor: Record<string, string> = { base: "Base", arb: "Arbitrum", poly: "Polygon PoS", avax: "Avalanche" };

  return (
    <group ref={group}>
      {/* landscape ground (starts behind the vault's back wall) */}
      <mesh position={[55, GROUND_Y, -191]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 259]} />
        <meshStandardMaterial color="#dfe8d8" roughness={1} />
      </mesh>
      {roads.map(([a, b], i) => (
        <Road key={i} a={a} b={b} />
      ))}
      <mesh position={[HUB.x, GROUND_Y + 0.05, HUB.z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4, 40]} />
        <meshStandardMaterial color="#c9d0d8" roughness={0.8} />
      </mesh>
      <instancedMesh ref={traffic} args={[cgeo, coinMats(), 30]} frustumCulled={false} castShadow />

      {SPECS.map((s, i) => {
        const at = CHAINS[s.key];
        return (
          <group key={s.key}>
            <Garden at={at} />
            <mesh position={[at.x, at.y, at.z]} receiveShadow>
              <cylinderGeometry args={[9, 9.4, 0.6, 48]} />
              <meshStandardMaterial color="#e4e8ed" roughness={0.7} />
            </mesh>
            <mesh ref={(m) => (highlight.current[i] = m as THREE.Mesh)} position={[at.x, at.y + 0.32, at.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[8.2, 8.9, 64]} />
              <meshBasicMaterial color={s.color} transparent opacity={0} />
            </mesh>
            <mesh position={[at.x, at.y + 0.3 + s.h / 2, at.z - 2]} castShadow receiveShadow>
              {s.shape === "box" && <boxGeometry args={[4.2, s.h, 4.2]} />}
              {s.shape === "hex" && <cylinderGeometry args={[2.7, 2.7, s.h, 6]} />}
              {s.shape === "tri" && <cylinderGeometry args={[3.2, 3.2, s.h, 3]} />}
              <meshStandardMaterial map={mats.fac[i]} metalness={0.35} roughness={0.3} />
            </mesh>
            {/* a coin on a pedestal: native USDC lives here too */}
            <mesh position={[at.x + 3.2, at.y + 0.6, at.z + 2.6]}>
              <cylinderGeometry args={[0.8, 0.95, 0.6, 24]} />
              <meshStandardMaterial color="#c9d1db" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh geometry={cgeo} material={coinMats()} position={[at.x + 3.2, at.y + 1.75, at.z + 2.6]} rotation={[Math.PI / 2, 0, 0]} scale={0.65} castShadow />
            <Tag kind="cine" position={[at.x - 4.5, at.y + s.h + 1.4, at.z - 2]} text={labelFor[s.key]} vis={plazaVis} />
          </group>
        );
      })}

      {/* third-party bridge: lock on one side, IOU on the other */}
      <group position={[BRIDGE.x, GROUND_Y, BRIDGE.z]}>
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 3.2, 3.2]} />
          <meshStandardMaterial color="#8a95a4" metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh position={[0, 3.6, 1.62]} material={mats.bridge}>
          <planeGeometry args={[4.4, 0.75]} />
        </mesh>
        <mesh position={[1.9, 1.2, 0]} material={mats.glass}>
          <boxGeometry args={[0.2, 2.0, 2.0]} />
        </mesh>
      </group>
      <mesh ref={locked} geometry={cgeo} material={coinMats()} scale={0.8} castShadow />
      <mesh ref={wrapped} geometry={cgeo} material={bridgedMats()} castShadow />

      <Tag kind="cine" position={[ETH.x + 4, ETH.y + 16, ETH.z - 2]} text="Ethereum" img={asset("/img/eth.svg")} vis={plazaVis} />
      <Tag kind="cine" position={[BRIDGE.x - 2, BRIDGE.y + 5.2, BRIDGE.z]} text={L.bridgeTag} vis={near(0.52, 0.56, 0.8, 0.86)} align="right" />
      <Tag kind="sys" position={[BRIDGE.x + 3, BRIDGE.y + 3.6, BRIDGE.z + 2]} k={S.bridged[0]} text={S.bridged[1]} vis={near(0.5, 0.56, 0.9, 0.96)} />
      <Tag kind="sys" position={[CHAINS.base.x + 3, CHAINS.base.y + 4, CHAINS.base.z + 3]} k={S.native[0]} text={S.native[1]} vis={near(0.18, 0.24, 0.9, 0.96)} />
      <Tag kind="sys" position={[HUB.x + 3, HUB.y + 3, HUB.z]} k={S.erc20[0]} text={S.erc20[1]} vis={near(0.06, 0.12, 0.9, 0.96)} />
    </group>
  );
}

const EU = new THREE.Euler();
const ROLL = new THREE.Quaternion();
const YAX = new THREE.Vector3(0, 1, 0);
