"use client";
/**
 * Three-car metro set modelled on the reader's reference picture:
 * white clear-coated bodies, orange belt stripes, amber cab mask with a
 * three-pane windscreen, LED destination sign, bogies with rotating wheels,
 * bellows gangways, roof AC units and a pantograph on the middle car.
 */
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { buildBody } from "./body";
import { makePaint } from "./paint";
import { live, WHEEL_R } from "./motion";

export const CAB_L = 20.6;
export const MID_L = 20;
export const GAP = 0.9;
export const CARS = [
  { x: 0, L: CAB_L, nose: true, tail: false, flip: false, doors: [-7.6, -3.2, 1.2, 5.4] as [number, number, number, number] },
  { x: -(CAB_L / 2 + GAP + MID_L / 2), L: MID_L, nose: false, tail: false, flip: false, doors: [-6.9, -2.3, 2.3, 6.9] as [number, number, number, number] },
  { x: -(CAB_L / 2 + GAP * 2 + MID_L + CAB_L / 2), L: CAB_L, nose: true, tail: true, flip: true, doors: [-7.6, -3.2, 1.2, 5.4] as [number, number, number, number] },
];
export const TRAIN_FRONT = CAB_L / 2;
export const TRAIN_BACK = CARS[2].x - CAB_L / 2;
const FLOOR = 1.0; // body sill above rail top

const steel = new THREE.MeshStandardMaterial({ color: "#7d848a", metalness: 0.85, roughness: 0.32 });
const dark = new THREE.MeshStandardMaterial({ color: "#2f3438", metalness: 0.35, roughness: 0.6 });
const darker = new THREE.MeshStandardMaterial({ color: "#1d2124", metalness: 0.2, roughness: 0.7 });
const rubber = new THREE.MeshStandardMaterial({ color: "#151719", roughness: 0.9 });
const roofGrey = new THREE.MeshPhysicalMaterial({ color: "#d4d9dc", roughness: 0.45, clearcoat: 0.3 });
const spring = new THREE.MeshStandardMaterial({ color: "#b8892c", metalness: 0.4, roughness: 0.45 });

const wheelGeo = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.13, 36);
wheelGeo.rotateX(Math.PI / 2);
const hubGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.16, 20);
hubGeo.rotateX(Math.PI / 2);
const boltGeo = new THREE.BoxGeometry(0.07, 0.07, 0.17);

function Wheel({ x, z }: { x: number; z: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.z = -live.S / WHEEL_R;
  });
  return (
    <group ref={ref} position={[x, WHEEL_R, z]}>
      <mesh geometry={wheelGeo} material={steel} castShadow />
      <mesh geometry={hubGeo} material={dark} />
      {[0, 1, 2, 3, 4].map((k) => (
        <mesh key={k} geometry={boltGeo} material={darker} position={[Math.cos((k * Math.PI * 2) / 5) * 0.26, Math.sin((k * Math.PI * 2) / 5) * 0.26, 0]} />
      ))}
    </group>
  );
}

function Bogie({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      {[-1.1, 1.1].map((wx) => [-0.72, 0.72].map((wz) => <Wheel key={`${wx}${wz}`} x={wx} z={wz} />))}
      {/* side frames */}
      {[-1.02, 1.02].map((z) => (
        <group key={z}>
          <mesh material={dark} position={[0, 0.58, z]} castShadow>
            <boxGeometry args={[3.0, 0.28, 0.16]} />
          </mesh>
          {[-1.1, 1.1].map((ax) => (
            <group key={ax}>
              <mesh material={darker} position={[ax, WHEEL_R, z]}>
                <boxGeometry args={[0.36, 0.3, 0.22]} />
              </mesh>
              <mesh material={spring} position={[ax, 0.7, z]}>
                <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      <mesh material={dark} position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 0.24, 2.0]} />
      </mesh>
      {/* air springs */}
      {[-0.95, 0.95].map((z) => (
        <mesh key={z} material={rubber} position={[0, 0.86, z]}>
          <cylinderGeometry args={[0.27, 0.3, 0.26, 20]} />
        </mesh>
      ))}
      {/* traction motor */}
      <mesh material={darker} position={[0.55, 0.5, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.7, 16]} />
      </mesh>
    </group>
  );
}

function Underframe({ L }: { L: number }) {
  const boxes = useMemo(() => {
    const out: { x: number; w: number; h: number; d: number }[] = [];
    let x = -L / 2 + 5.2;
    const end = L / 2 - 5.2;
    const sizes = [1.6, 2.4, 1.1, 2.8, 1.4, 2.0, 1.2];
    let k = 0;
    while (x < end - 0.6) {
      const w = Math.min(sizes[k % sizes.length], end - x);
      out.push({ x: x + w / 2, w: w - 0.12, h: 0.42 + ((k * 37) % 5) * 0.03, d: 2.15 - ((k * 13) % 3) * 0.15 });
      x += w;
      k++;
    }
    return out;
  }, [L]);
  return (
    <>
      {boxes.map((b, i) => (
        <mesh key={i} material={i % 3 === 1 ? darker : dark} position={[b.x, FLOOR - b.h / 2 - 0.02, 0]} castShadow>
          <boxGeometry args={[b.w, b.h, b.d]} />
        </mesh>
      ))}
    </>
  );
}

function Roof({ L, panto }: { L: number; panto?: boolean }) {
  return (
    <group position={[0, FLOOR + 3.75, 0]}>
      {[-L / 2 + 4.6, L / 2 - 4.6].map((x) => (
        <RoundedBox key={x} args={[3.4, 0.34, 1.7]} radius={0.1} smoothness={3} position={[x, 0.1, 0]} material={roofGrey} castShadow />
      ))}
      {panto && <Pantograph />}
    </group>
  );
}

/** single-arm pantograph raised to the contact wire (5.55 m above rail) */
function Pantograph() {
  const top = 5.55 - (FLOOR + 3.75);
  const arm = (a: THREE.Vector3, b: THREE.Vector3, r: number, key: string) => {
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const len = a.distanceTo(b);
    const dir = b.clone().sub(a).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return (
      <mesh key={key} material={steel} position={mid} quaternion={q}>
        <cylinderGeometry args={[r, r, len, 8]} />
      </mesh>
    );
  };
  const base = new THREE.Vector3(-0.9, 0.12, 0);
  const knee = new THREE.Vector3(0.55, top * 0.45, 0);
  const head = new THREE.Vector3(-0.15, top - 0.04, 0);
  return (
    <group>
      <mesh material={dark} position={[-0.3, 0.06, 0]}>
        <boxGeometry args={[1.8, 0.12, 1.2]} />
      </mesh>
      {[-0.5, 0.5].map((z) => (
        <mesh key={z} material={roofGrey} position={[-0.9, 0.06, z]}>
          <cylinderGeometry args={[0.06, 0.08, 0.18, 10]} />
        </mesh>
      ))}
      {arm(base.clone().setZ(0.25), knee.clone().setZ(0.12), 0.035, "a1")}
      {arm(base.clone().setZ(-0.25), knee.clone().setZ(-0.12), 0.035, "a2")}
      {arm(knee, head, 0.03, "a3")}
      <mesh material={darker} position={[head.x, head.y, 0]}>
        <boxGeometry args={[0.12, 0.05, 1.7]} />
      </mesh>
      <mesh material={steel} position={[head.x + 0.18, head.y - 0.02, 0]}>
        <boxGeometry args={[0.08, 0.04, 1.6]} />
      </mesh>
    </group>
  );
}

function Gangway({ x }: { x: number }) {
  return (
    <group position={[x, FLOOR + 0.1, 0]}>
      {[-0.36, -0.18, 0, 0.18, 0.36].map((dx) => (
        <RoundedBox key={dx} args={[0.14, 3.35, 2.45]} radius={0.06} smoothness={2} position={[dx, 1.75, 0]} material={rubber} />
      ))}
    </group>
  );
}

function Coupler() {
  return (
    <group position={[TRAIN_FRONT - 0.15, 0.62, 0]}>
      <mesh material={darker}>
        <boxGeometry args={[0.7, 0.22, 0.3]} />
      </mesh>
      <mesh material={dark} position={[0.38, 0, 0]}>
        <boxGeometry args={[0.16, 0.34, 0.42]} />
      </mesh>
    </group>
  );
}

export default function Train({ sign, decal }: { sign: THREE.Texture | null; decal: THREE.Texture | null }) {
  const group = useRef<THREE.Group>(null);
  const geos = useMemo(() => ({ cab: buildBody(CAB_L, true), mid: buildBody(MID_L, false) }), []);
  const mats = useMemo(
    () =>
      CARS.map((c) =>
        makePaint({ L: c.L, nose: c.nose, tail: c.tail, doors: c.doors, sign: null, decal: null }),
      ),
    [],
  );
  useEffect(() => {
    mats.forEach((m, i) => {
      const u = m.userData.uniforms;
      u.uSign.value = sign;
      u.uHasSign.value = sign && CARS[i].nose ? 1 : 0;
      u.uDecal.value = decal;
      u.uHasDecal.value = decal ? 1 : 0;
    });
  }, [sign, decal, mats]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    // gentle sway and bounce only while running
    const t = state.clock.elapsedTime;
    const v = live.v;
    g.rotation.x = Math.sin(t * 1.7 + live.S * 0.05) * 0.0035 * v;
    g.position.y = Math.sin(t * 9 + live.S * 0.8) * 0.006 * v;
  });

  return (
    <group ref={group}>
      {CARS.map((c, i) => (
        <group key={i} position={[c.x, 0, 0]} rotation={[0, c.flip ? Math.PI : 0, 0]}>
          <mesh geometry={c.L === CAB_L ? geos.cab : geos.mid} material={mats[i]} position={[0, FLOOR, 0]} castShadow receiveShadow />
          <Bogie x={c.L / 2 - 3.4} />
          <Bogie x={-c.L / 2 + 3.4} />
          <Underframe L={c.L} />
          <Roof L={c.L} panto={i === 1} />
        </group>
      ))}
      <Gangway x={CARS[0].x - CAB_L / 2 - GAP / 2} />
      <Gangway x={CARS[1].x - MID_L / 2 - GAP / 2} />
      <Coupler />
    </group>
  );
}
