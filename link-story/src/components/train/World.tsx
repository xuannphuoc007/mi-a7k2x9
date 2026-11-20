"use client";
/**
 * The world the train runs through: an elevated concrete viaduct with two slab
 * tracks and overhead catenary, a pastel city below, and one glass-arch station
 * per chapter. The train is fixed at the origin; everything here slides by -S.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { live, SPACING } from "./motion";
import { mulberry32 } from "@/lib/store";

export const TRACK_B = 4.3; // second track (nearer the camera)
const DECK_TOP = -0.4;
const GROUND = -11;
const LONG = 1400;
/** station centre relative to the station's stop point (train is centred near x = -21) */
export const STATION_C = -21;
export const STATION_LEN = 100;

const concrete = new THREE.MeshStandardMaterial({ color: "#d9d6cf", roughness: 0.85 });
const concreteDark = new THREE.MeshStandardMaterial({ color: "#bfbbb3", roughness: 0.9 });
const slabMat = new THREE.MeshStandardMaterial({ color: "#a9a69f", roughness: 0.95 });
const railWeb = new THREE.MeshStandardMaterial({ color: "#6d5f55", metalness: 0.5, roughness: 0.6 });
const railHead = new THREE.MeshStandardMaterial({ color: "#c9ced2", metalness: 0.95, roughness: 0.22 });
const mastMat = new THREE.MeshStandardMaterial({ color: "#8b949b", metalness: 0.6, roughness: 0.45 });
const wireMat = new THREE.MeshStandardMaterial({ color: "#5a5048", metalness: 0.7, roughness: 0.4 });
const ribMat = new THREE.MeshStandardMaterial({ color: "#f4f6f8", metalness: 0.3, roughness: 0.35 });
const glassMat = new THREE.MeshPhysicalMaterial({
  color: "#d6eef8",
  transparent: true,
  opacity: 0.14,
  roughness: 0.05,
  metalness: 0.1,
  side: THREE.DoubleSide,
  depthWrite: false,
});
const platTop = new THREE.MeshStandardMaterial({ color: "#e4e1da", roughness: 0.8 });
const tactile = new THREE.MeshStandardMaterial({ color: "#f2c230", roughness: 0.7 });
const edgeWhite = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.6 });
const balGlass = new THREE.MeshPhysicalMaterial({ color: "#e8f5fb", transparent: true, opacity: 0.28, roughness: 0.05, depthWrite: false });
const ground = new THREE.MeshStandardMaterial({ color: "#e3e8df", roughness: 1 });
const road = new THREE.MeshStandardMaterial({ color: "#c7ccd0", roughness: 0.95 });
const walk = new THREE.MeshStandardMaterial({ color: "#e9e6df", roughness: 0.95 });
const trunk = new THREE.MeshStandardMaterial({ color: "#8a6f5a", roughness: 0.9 });
const leaf = new THREE.MeshStandardMaterial({ color: "#93bf8e", roughness: 0.9 });

/** wraps children every `period` metres so a short set of objects reads as an endless line */
function Wrap({ period, children }: { period: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.position.x = -(((live.S % period) + period) % period);
  });
  return <group ref={ref}>{children}</group>;
}

function deckGeometry() {
  const s = new THREE.Shape();
  const P: [number, number][] = [
    [-2.75, DECK_TOP],
    [7.05, DECK_TOP],
    [7.05, -1.0],
    [4.9, -2.5],
    [-0.6, -2.5],
    [-2.75, -1.0],
  ];
  s.moveTo(-P[0][0], P[0][1]);
  for (let i = 1; i < P.length; i++) s.lineTo(-P[i][0], P[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: LONG, bevelEnabled: false });
  g.rotateY(Math.PI / 2);
  g.translate(-LONG / 2, 0, 0);
  g.computeVertexNormals();
  return g;
}

function Track({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <mesh material={slabMat} position={[0, -0.34, 0]} receiveShadow>
        <boxGeometry args={[LONG, 0.12, 2.9]} />
      </mesh>
      {[-0.7175, 0.7175].map((rz) => (
        <group key={rz} position={[0, 0, rz]}>
          <mesh material={railWeb} position={[0, -0.1, 0]} receiveShadow>
            <boxGeometry args={[LONG, 0.12, 0.09]} />
          </mesh>
          <mesh material={railHead} position={[0, -0.02, 0]}>
            <boxGeometry args={[LONG, 0.045, 0.072]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Sleepers() {
  const STEP = 0.65;
  const N = Math.ceil(300 / STEP);
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.BoxGeometry(0.26, 0.1, 2.35), []);
  useMemo(() => {}, []);
  const setup = (m: THREE.InstancedMesh | null) => {
    if (!m || m.userData.done) return;
    const o = new THREE.Object3D();
    let k = 0;
    for (const z of [0, TRACK_B]) {
      for (let i = 0; i < N; i++) {
        o.position.set(-150 + i * STEP, -0.23, z);
        o.updateMatrix();
        m.setMatrixAt(k++, o.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
    m.userData.done = true;
  };
  return (
    <Wrap period={STEP}>
      <instancedMesh
        ref={(m) => {
          (ref as React.MutableRefObject<THREE.InstancedMesh | null>).current = m;
          setup(m);
        }}
        args={[geo, concreteDark, N * 2]}
        receiveShadow
      />
    </Wrap>
  );
}

function Piers() {
  const P = 32;
  const xs = useMemo(() => Array.from({ length: 22 }, (_, i) => -11 * P + i * P), []);
  return (
    <Wrap period={P}>
      {xs.map((x) => (
        <group key={x} position={[x, 0, 2.15]}>
          <mesh material={concrete} position={[0, (GROUND + -2.5) / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.7, -2.5 - GROUND, 2.6]} />
          </mesh>
          <mesh material={concrete} position={[0, -2.95, 0]}>
            <boxGeometry args={[2.0, 0.9, 6.4]} />
          </mesh>
        </group>
      ))}
    </Wrap>
  );
}

function Catenary() {
  const P = 48;
  const xs = useMemo(() => Array.from({ length: 16 }, (_, i) => -8 * P + i * P + 7), []);
  return (
    <>
      <Wrap period={P}>
        {xs.map((x) => (
          <group key={x} position={[x, 0, 0]}>
            {[
              { z: -2.6, to: 0 },
              { z: -2.6, to: TRACK_B },
            ].map((m) => (
              <group key={m.z}>
                {m.to === 0 && (
                  <mesh material={mastMat} position={[0, 3.6, m.z]} castShadow>
                    <boxGeometry args={[0.24, 8.0, 0.24]} />
                  </mesh>
                )}
                <mesh material={mastMat} position={[0, m.to === 0 ? 6.62 : 7.15, (m.z + m.to) / 2 + 0.2]}>
                  <boxGeometry args={[0.08, 0.08, Math.abs(m.z - m.to) + 0.4]} />
                </mesh>
                <mesh material={mastMat} position={[0.0, m.to === 0 ? 6.1 : 6.6, m.to + 0.0]}>
                  <boxGeometry args={[0.05, m.to === 0 ? 1.1 : 1.6, 0.05]} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </Wrap>
      {[0, TRACK_B].map((z) => (
        <group key={z}>
          <mesh material={wireMat} position={[0, 5.55, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, LONG, 5]} />
          </mesh>
          <mesh material={wireMat} position={[0, 6.62, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, LONG, 5]} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** buildings with procedural windows (pattern in mesh-local space so it travels with the block) */
function makeBuildingMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.82 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLP;\nvarying vec3 vLN;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvec4 ip = vec4(position, 1.0);\n#ifdef USE_INSTANCING\nip = instanceMatrix * ip;\n#endif\nvLP = ip.xyz;\nvLN = normal;",
      );
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLP;\nvarying vec3 vLN;")
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        {
          vec3 n = normalize(vLN);
          float h = abs(n.z) > 0.5 ? vLP.x : vLP.z;
          vec2 cell = vec2(mod(h, 3.4) / 3.4, mod(vLP.y - ${GROUND.toFixed(1)}, 3.5) / 3.5);
          float wx = smoothstep(0.16, 0.19, cell.x) * (1.0 - smoothstep(0.81, 0.84, cell.x));
          float wy = smoothstep(0.30, 0.33, cell.y) * (1.0 - smoothstep(0.86, 0.89, cell.y));
          float isWall = 1.0 - step(0.5, abs(n.y));
          float above = step(${(GROUND + 3.0).toFixed(1)}, vLP.y);
          float w = wx * wy * isWall * above;
          vec3 glass = mix(vec3(0.55, 0.66, 0.74), vec3(0.72, 0.81, 0.87), cell.y);
          diffuseColor.rgb = mix(diffuseColor.rgb, glass, w * 0.85);
          diffuseColor.rgb *= mix(1.0, 0.86, step(0.5, n.y));
        }`,
      );
  };
  m.customProgramCacheKey = () => "link-building-v1";
  return m;
}

const PASTEL = ["#f3efe6", "#e6edf2", "#f1e5da", "#e1ebe8", "#ebe6f1", "#f5efdc", "#dde6ef", "#eee2e0", "#f7f4ef"];

function City({ mobile }: { mobile: boolean }) {
  const T = 480;
  const mat = useMemo(makeBuildingMaterial, []);
  const box = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    return g;
  }, []);
  const data = useMemo(() => {
    const r = mulberry32(7);
    const out: { x: number; z: number; w: number; d: number; h: number; c: THREE.Color }[] = [];
    const band = (z0: number, z1: number, hMin: number, hMax: number, wMin: number, wMax: number, gap: number) => {
      let x = -T / 2;
      while (x < T / 2) {
        const w = wMin + r() * (wMax - wMin);
        const d = wMin + r() * (wMax - wMin);
        const h = hMin + Math.pow(r(), 1.6) * (hMax - hMin);
        const z = z0 + r() * (z1 - z0);
        out.push({ x: x + w / 2, z, w, d, h, c: new THREE.Color(PASTEL[Math.floor(r() * PASTEL.length)]) });
        x += w + gap + r() * gap;
      }
    };
    band(-24, -40, 8, 34, 10, 22, 4);
    band(-52, -80, 16, 58, 14, 28, 6);
    band(-100, -150, 30, 95, 16, 30, 10);
    if (!mobile) band(-180, -240, 50, 130, 18, 34, 18);
    band(26, 40, 6, 18, 10, 18, 5);
    band(54, 80, 10, 30, 12, 22, 8);
    return out;
  }, [mobile]);
  const setup = (m: THREE.InstancedMesh | null) => {
    if (!m || m.userData.done) return;
    const o = new THREE.Object3D();
    data.forEach((b, i) => {
      o.position.set(b.x, GROUND, b.z);
      o.scale.set(b.w, b.h, b.d);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, b.c);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.userData.done = true;
  };
  return (
    <Wrap period={T}>
      {[-1, 0, 1].map((k) => (
        <group key={k} position={[k * T, 0, 0]}>
          <instancedMesh ref={setup} args={[box, mat, data.length]} castShadow={false} receiveShadow />
        </group>
      ))}
    </Wrap>
  );
}

function Trees() {
  const T = 240;
  const data = useMemo(() => {
    const r = mulberry32(11);
    const out: { x: number; z: number; s: number }[] = [];
    for (const z0 of [-11.5, 14.5, 19]) {
      let x = -T / 2;
      while (x < T / 2) {
        out.push({ x, z: z0 + (r() - 0.5) * 1.5, s: 0.8 + r() * 0.6 });
        x += 7 + r() * 6;
      }
    }
    return out;
  }, []);
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.24, 3, 6), []);
  const leafGeo = useMemo(() => {
    // three merged blobs read as a crown rather than a crystal
    const parts = [
      [0, 0, 0, 1.7],
      [0.9, -0.4, 0.4, 1.25],
      [-0.8, -0.3, -0.5, 1.3],
    ].map(([x, y, z, r]) => new THREE.SphereGeometry(r, 14, 10).translate(x, y, z));
    const pos: number[] = [];
    const nor: number[] = [];
    const idx: number[] = [];
    let off = 0;
    for (const g of parts) {
      pos.push(...(g.attributes.position.array as Float32Array));
      nor.push(...(g.attributes.normal.array as Float32Array));
      idx.push(...Array.from(g.index!.array as Uint16Array, (v) => v + off));
      off += g.attributes.position.count;
    }
    const m = new THREE.BufferGeometry();
    m.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    m.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    m.setIndex(idx);
    return m;
  }, []);
  const setT = (m: THREE.InstancedMesh | null) => {
    if (!m || m.userData.done) return;
    const o = new THREE.Object3D();
    data.forEach((t, i) => {
      o.position.set(t.x, GROUND + 1.5 * t.s, t.z);
      o.scale.setScalar(t.s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.userData.done = true;
  };
  const setL = (m: THREE.InstancedMesh | null) => {
    if (!m || m.userData.done) return;
    const o = new THREE.Object3D();
    data.forEach((t, i) => {
      o.position.set(t.x, GROUND + 4.0 * t.s, t.z);
      o.scale.set(t.s, t.s * 1.1, t.s);
      o.rotation.set(0, i, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.userData.done = true;
  };
  return (
    <Wrap period={T}>
      {[-1, 0, 1].map((k) => (
        <group key={k} position={[k * T, 0, 0]}>
          <instancedMesh ref={setT} args={[trunkGeo, trunk, data.length]} />
          <instancedMesh ref={setL} args={[leafGeo, leaf, data.length]} />
        </group>
      ))}
    </Wrap>
  );
}

/** cantilevered glass arch: springs from the platform back (z -7.4), crests over the
 *  tracks and stops in the air above the far edge, so the near side stays open */
function archPoint(t: number) {
  const z = -7.4 + t * 14.8;
  const u = t * 0.8;
  const y = 1.1 + 8.8 * Math.sin(Math.PI * u);
  return new THREE.Vector3(0, y, z);
}

function useStationGeometry() {
  return useMemo(() => {
    const pts = Array.from({ length: 41 }, (_, i) => archPoint(i / 40));
    const curve = new THREE.CatmullRomCurve3(pts);
    const rib = new THREE.TubeGeometry(curve, 64, 0.13, 8, false);
    // glass skin: arch swept along x
    const NX = 2,
      NT = 40;
    const pos: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= NX; i++) {
      for (let j = 0; j <= NT; j++) {
        const p = archPoint(j / NT);
        pos.push(-STATION_LEN / 2 + (STATION_LEN * i) / NX, p.y, p.z);
      }
    }
    for (let i = 0; i < NX; i++)
      for (let j = 0; j < NT; j++) {
        const a = i * (NT + 1) + j,
          b = (i + 1) * (NT + 1) + j;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    const skin = new THREE.BufferGeometry();
    skin.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    skin.setIndex(idx);
    skin.computeVertexNormals();
    const purlinTs = [0.1, 0.24, 0.38, 0.52, 0.66, 0.8, 0.93, 1.0];
    return { rib, skin, purlins: purlinTs.map(archPoint) };
  }, []);
}

export type StationInfo = { line: string; tex: THREE.Texture | null };

function Station({ i, info, geo }: { i: number; info: StationInfo; geo: ReturnType<typeof useStationGeometry> }) {
  const ref = useRef<THREE.Group>(null);
  const lineMat = useMemo(() => new THREE.MeshStandardMaterial({ color: info.line, roughness: 0.5 }), [info.line]);
  const signMat = useMemo(() => new THREE.MeshBasicMaterial({ map: info.tex, toneMapped: false }), [info.tex]);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const x = i * SPACING + STATION_C - live.S;
    g.position.x = x;
    g.visible = Math.abs(x) < 420;
  });
  const ribs = useMemo(() => Array.from({ length: Math.floor(STATION_LEN / 6) + 1 }, (_, k) => -STATION_LEN / 2 + k * 6), []);
  return (
    <group ref={ref}>
      {/* platform deck and platform */}
      <mesh material={concrete} position={[0, -1.4, -5.2]} receiveShadow>
        <boxGeometry args={[STATION_LEN + 4, 2.0, 5.8]} />
      </mesh>
      <mesh material={platTop} position={[0, 0.34, -4.25]} receiveShadow castShadow>
        <boxGeometry args={[STATION_LEN, 1.48, 5.2]} />
      </mesh>
      <mesh material={tactile} position={[0, 1.085, -2.25]}>
        <boxGeometry args={[STATION_LEN, 0.01, 0.32]} />
      </mesh>
      <mesh material={edgeWhite} position={[0, 1.085, -1.74]}>
        <boxGeometry args={[STATION_LEN, 0.012, 0.12]} />
      </mesh>
      <mesh material={lineMat} position={[0, 0.85, -1.625]}>
        <boxGeometry args={[STATION_LEN, 0.28, 0.02]} />
      </mesh>
      {/* back balustrade */}
      <mesh material={balGlass} position={[0, 1.65, -6.75]}>
        <boxGeometry args={[STATION_LEN, 1.1, 0.04]} />
      </mesh>
      <mesh material={ribMat} position={[0, 2.22, -6.75]}>
        <boxGeometry args={[STATION_LEN, 0.06, 0.1]} />
      </mesh>
      {/* arch ribs, purlins, glass skin */}
      {ribs.map((x) => (
        <mesh key={x} geometry={geo.rib} material={ribMat} position={[x, 0, 0]} castShadow />
      ))}
      {geo.purlins.map((p, k) => (
        <mesh key={k} material={k === geo.purlins.length - 1 ? lineMat : ribMat} position={[0, p.y, p.z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[k === geo.purlins.length - 1 ? 0.13 : 0.06, k === geo.purlins.length - 1 ? 0.13 : 0.06, STATION_LEN, 8]} />
        </mesh>
      ))}
      <mesh geometry={geo.skin} material={glassMat} renderOrder={2} />
      {/* hanging name boards */}
      {[-26, 22].map((x) => (
        <group key={x} position={[x, 4.4, -3.4]}>
          <mesh material={ribMat} position={[0, 0, -0.05]}>
            <boxGeometry args={[4.6, 1.3, 0.08]} />
          </mesh>
          <mesh material={signMat} position={[0, 0, 0.0]}>
            <planeGeometry args={[4.4, 1.1]} />
          </mesh>
          {[-1.6, 1.6].map((dx) => (
            <mesh key={dx} material={mastMat} position={[dx, 2.0, -0.05]}>
              <cylinderGeometry args={[0.02, 0.02, 2.7, 5]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* lift tower */}
      <group position={[-40, 0, -5.6]}>
        <mesh material={balGlass} position={[0, 3.2, 0]}>
          <boxGeometry args={[2.4, 4.2, 1.8]} />
        </mesh>
        <mesh material={lineMat} position={[0, 5.4, 0]}>
          <boxGeometry args={[2.5, 0.22, 1.9]} />
        </mesh>
      </group>
    </group>
  );
}

export default function World({ mobile, stations }: { mobile: boolean; stations: StationInfo[] }) {
  const deck = useMemo(deckGeometry, []);
  const sgeo = useStationGeometry();
  return (
    <group>
      <mesh geometry={deck} material={concrete} receiveShadow />
      {/* parapets */}
      <mesh material={concrete} position={[0, 0.15, 6.95]} receiveShadow>
        <boxGeometry args={[LONG, 1.1, 0.22]} />
      </mesh>
      <mesh material={concrete} position={[0, 0.15, -2.62]} receiveShadow>
        <boxGeometry args={[LONG, 1.1, 0.22]} />
      </mesh>
      <Track z={0} />
      <Track z={TRACK_B} />
      <Sleepers />
      <Piers />
      <Catenary />
      {/* ground level */}
      <mesh material={ground} rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND, 0]} receiveShadow>
        <planeGeometry args={[2400, 1200]} />
      </mesh>
      <mesh material={road} rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND + 0.02, 2.2]} receiveShadow>
        <planeGeometry args={[LONG, 22]} />
      </mesh>
      {[-10.2, 14.6].map((z) => (
        <mesh key={z} material={walk} rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND + 0.04, z]}>
          <planeGeometry args={[LONG, 3]} />
        </mesh>
      ))}
      <Trees />
      <City mobile={mobile} />
      {stations.map((s, i) => (
        <Station key={i} i={i} info={s} geo={sgeo} />
      ))}
    </group>
  );
}
