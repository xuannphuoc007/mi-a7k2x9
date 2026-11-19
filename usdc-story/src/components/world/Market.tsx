"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth, band, lerp, clamp } from "@/lib/timeline";
import { useI18n } from "@/lib/i18n";
import { MARKET, SVB, g, isMap, rnd, tmpM, tmpQ, tmpS, tmpV, clock, xr } from "./shared";
import { boardCanvas, signTex, wireTex } from "./textures";
import { coinMats, coinGeo } from "./coins";
import Bank from "./Bank";
import Tag from "./Tag";

const M = MARKET;
const FY = M.y;
const BOARD = new THREE.Vector3(M.x, FY + 6.5, M.z - 12);
const WINDOW = new THREE.Vector3(M.x + 11.5, FY + 2.1, M.z - 1.2);
const DESK = new THREE.Vector3(M.x - 2, FY + 1.3, M.z + 1);
const HOLDER = new THREE.Vector3(M.x + 5, FY, M.z + 8);
const BANK2 = new THREE.Vector3(M.x + 22, FY, M.z + 10);
const NFLOW = 8;
const NPILE = 14;

/* ---------- price paths (pure functions of scroll) ---------- */
/** scene 06: illustrative scenarios */
export function pegPrice(t: number) {
  const n = Math.sin(t * 190) * 0.00018 + Math.sin(t * 71) * 0.00012;
  const shortage = smooth(ramp(t, 0.36, 0.44)) * (1 - 0.94 * smooth(ramp(t, 0.46, 0.58)));
  const closed = smooth(ramp(t, 0.62, 0.8));
  return 1 + n - 0.009 * shortage - 0.024 * closed + Math.sin(t * 40) * 0.0012 * closed;
}
export const pegScenario = (t: number) => (t < 0.34 ? 0 : t < 0.6 ? 1 : 2);
export const counterClosed6 = (t: number) => t > 0.62 && t < 0.9;

/** scene 08: March 2023, sourced points; the line between them is interpolated */
export const SVB_POINTS: [number, number][] = [
  [0.0, 1.0], // Fri 10 Mar
  [0.32, 0.8726], // Sat 11 Mar — low (CryptoCompare CCCAGG)
  [0.58, 0.99], // late Sun 12 Mar — above $0.99 after the joint statement
  [0.72, 0.9918], // Mon 13 Mar
  [1.0, 1.0], // Thu 16 Mar — back at $1 on most exchanges
];
export function svbPrice(x: number) {
  for (let i = 0; i < SVB_POINTS.length - 1; i++) {
    const [a, pa] = SVB_POINTS[i];
    const [b, pb] = SVB_POINTS[i + 1];
    if (x <= b) return lerp(pa, pb, smooth(ramp(x, a, b)));
  }
  return 1;
}
/** scene-08 local t → position on the Fri→Thu axis */
export const svbX = (t: number) => clamp((t - 0.1) / 0.8);
export const counterClosed8 = (t: number) => t > 0.16 && t < 0.62;

function drawBoard(x: CanvasRenderingContext2D, mode: "peg" | "svb" | "flat", t: number, labels: string[]) {
  const W = 1024;
  const H = 512;
  x.fillStyle = "#0f1b2d";
  x.fillRect(0, 0, W, H);
  const lo = mode === "svb" ? 0.85 : 0.97;
  const hi = mode === "svb" ? 1.01 : 1.004;
  const X0 = 70;
  const X1 = W - 40;
  const Y0 = 120;
  const Y1 = H - 60;
  const py = (p: number) => Y1 - ((p - lo) / (hi - lo)) * (Y1 - Y0);
  // grid
  x.strokeStyle = "rgba(255,255,255,.08)";
  x.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = Y0 + ((Y1 - Y0) * i) / 4;
    x.beginPath();
    x.moveTo(X0, y);
    x.lineTo(X1, y);
    x.stroke();
  }
  // $1.00 line
  x.setLineDash([10, 8]);
  x.strokeStyle = "#7fb6f0";
  x.beginPath();
  x.moveTo(X0, py(1));
  x.lineTo(X1, py(1));
  x.stroke();
  x.setLineDash([]);
  x.fillStyle = "#7fb6f0";
  x.font = "600 20px 'JetBrains Mono', monospace";
  x.fillText("$1.00", 4, py(1) + 6);
  // path
  const N = 260;
  let last = 1;
  x.lineWidth = 4;
  x.beginPath();
  for (let i = 0; i <= N; i++) {
    const k = i / N;
    let p: number;
    let s: number;
    if (mode === "peg") {
      s = 0.06 + k * 0.84;
      if (s > t) break;
      p = pegPrice(s);
    } else if (mode === "svb") {
      if (k > svbX(t)) break;
      p = svbPrice(k);
    } else {
      p = 1 + Math.sin(k * 60 + t * 10) * 0.0002;
    }
    last = p;
    const X = X0 + k * (X1 - X0);
    if (i === 0) x.moveTo(X, py(p));
    else x.lineTo(X, py(p));
  }
  const dev = Math.abs(last - 1);
  x.strokeStyle = dev > 0.004 ? "#ff7a59" : dev > 0.0012 ? "#f0b429" : "#3ddc97";
  x.stroke();
  // header
  x.fillStyle = "#ffffff";
  x.font = "700 30px 'Space Grotesk', Arial";
  x.fillText("USDC / USD", 24, 48);
  x.font = "700 58px 'JetBrains Mono', monospace";
  x.fillStyle = dev > 0.004 ? "#ff7a59" : dev > 0.0012 ? "#f0b429" : "#3ddc97";
  x.textAlign = "right";
  x.fillText(`$${last.toFixed(4)}`, W - 24, 62);
  x.textAlign = "left";
  // axis labels
  x.fillStyle = "rgba(255,255,255,.6)";
  x.font = "500 18px 'JetBrains Mono', monospace";
  labels.forEach((l, i) => x.fillText(l, X0 + ((X1 - X0) * i) / Math.max(1, labels.length - 1) - (i === labels.length - 1 ? 60 : 0), H - 24));
  x.fillStyle = "rgba(255,255,255,.45)";
  x.font = "500 16px 'JetBrains Mono', monospace";
  x.fillText(mode === "svb" ? "HISTORICAL · MARCH 2023" : mode === "peg" ? "SIMULATED" : "", 24, 84);
}

export default function Market() {
  const { t } = useI18n();
  const L = t.labels;
  const S = t.sys;
  const group = useRef<THREE.Group>(null);
  const shutter = useRef<THREE.Mesh>(null);
  const flow = useRef<THREE.InstancedMesh>(null);
  const pile = useRef<THREE.InstancedMesh>(null);
  const bars = useRef<THREE.InstancedMesh>(null);
  const closedSign = useRef<THREE.Mesh>(null);
  const screens = useRef<THREE.MeshStandardMaterial>(null);
  const burn = useRef<THREE.MeshBasicMaterial>(null);
  const redeemCoin = useRef<THREE.Mesh>(null);
  const slip = useRef<THREE.Mesh>(null);
  const lastKey = useRef("");
  const cgeo = useMemo(() => coinGeo(), []);
  const board = useMemo(() => (typeof document !== "undefined" ? boardCanvas() : null), []);
  const mats = useMemo(
    () => ({
      floor: new THREE.MeshStandardMaterial({ color: "#ece7de", roughness: 0.7 }),
      desk: new THREE.MeshStandardMaterial({ color: "#d9c3a0", roughness: 0.6 }),
      dark: new THREE.MeshStandardMaterial({ color: "#2b3442", metalness: 0.5, roughness: 0.4 }),
      counter: new THREE.MeshStandardMaterial({ color: "#f7f5f0", roughness: 0.5 }),
      sign: new THREE.MeshStandardMaterial({ map: signTex("CIRCLE MINT · REDEEM 1:1", "#2775ca", "#ffffff", 1024, 128, "700 58px 'Space Grotesk', Arial") }),
      ex: new THREE.MeshStandardMaterial({ map: signTex("EXCHANGE FLOOR", "#f0b429", "#1b2533", 768, 128, "700 60px 'Space Grotesk', Arial") }),
      closed: new THREE.MeshStandardMaterial({ map: signTex("CLOSED", "#c4402f", "#ffffff", 512, 128, "800 74px 'Space Grotesk', Arial") }),
      shutter: new THREE.MeshStandardMaterial({ color: "#a3adba", metalness: 0.7, roughness: 0.4 }),
      bar: new THREE.MeshStandardMaterial({ color: "#59606b", metalness: 0.8, roughness: 0.35 }),
      wire: new THREE.MeshStandardMaterial({ map: wireTex(), roughness: 0.9 }),
    }),
    [],
  );

  useFrame(() => {
    const u = scrollState.u;
    const map = isMap(u);
    const vis = (u > g("s05", 0.85) && u < g("s09", 0.62)) || map;
    if (group.current) group.current.visible = vis;
    if (!vis) return;
    const t6 = local("s06", u);
    const t8 = local("s08", u);
    const t9 = local("s09", u);
    const in6 = u < g("s07", 0);
    const in8 = u >= g("s08", 0) && u < g("s09", 0);
    const in9 = u >= g("s09", 0);
    const tm = clock.t;

    // board
    if (board) {
      const mode: "peg" | "svb" | "flat" = in8 ? "svb" : in6 ? "peg" : "flat";
      const tt = in8 ? t8 : in6 ? t6 : t9;
      const key = mode + Math.round(tt * 500);
      if (key !== lastKey.current) {
        lastKey.current = key;
        drawBoard(board.x, mode, tt, mode === "svb" ? ["FRI 10", "SAT 11", "SUN 12", "MON 13", "THU 16"] : mode === "peg" ? L.scen.split("|") : []);
        board.t.needsUpdate = true;
      }
    }
    const price = in8 ? svbPrice(svbX(t8)) : in6 ? pegPrice(Math.max(0.06, t6)) : 1;
    const dev = Math.abs(price - 1);
    if (screens.current) {
      screens.current.emissive.set(dev > 0.004 ? "#ff7a59" : dev > 0.0012 ? "#f0b429" : "#3ddc97");
      screens.current.color.copy(screens.current.emissive);
    }

    // counter shutter
    const closed = in6 ? counterClosed6(t6) : in8 ? counterClosed8(t8) : false;
    const cl = in6 ? smooth(ramp(t6, 0.62, 0.67)) * (1 - smooth(ramp(t6, 0.9, 0.95))) : in8 ? smooth(ramp(t8, 0.16, 0.22)) * (1 - smooth(ramp(t8, 0.62, 0.68))) : 0;
    if (shutter.current) shutter.current.position.y = WINDOW.y + lerp(1.7, 0, cl);

    // arbitrage flow: coins to the counter, dollars back — strength follows the gap and whether the window is open
    let strength = in6 ? 0.25 + clamp(dev * 120) : in8 ? (t8 > 0.62 ? 1 : 0.15) : 0.15;
    if (closed) strength = 0;
    if (flow.current) {
      for (let i = 0; i < NFLOW; i++) {
        const k = (tm * 0.22 + i / NFLOW) % 1;
        const on = strength > (i / NFLOW) * 1.1 ? 1 : 0;
        tmpV.lerpVectors(DESK, WINDOW, k);
        tmpV.y += Math.sin(Math.PI * k) * 2.2;
        tmpQ.setFromEuler(EU.set(Math.PI / 2, 0, tm + i));
        tmpS.setScalar(0.38 * on);
        tmpM.compose(tmpV, tmpQ, tmpS);
        flow.current.setMatrixAt(i, tmpM);
      }
      flow.current.instanceMatrix.needsUpdate = true;
    }
    // backlog in front of a closed window
    const backlog = in6 ? smooth(ramp(t6, 0.64, 0.84)) * (1 - smooth(ramp(t6, 0.9, 0.95))) : in8 ? smooth(ramp(t8, 0.2, 0.55)) * (1 - smooth(ramp(t8, 0.66, 0.85))) : 0;
    if (pile.current) {
      for (let i = 0; i < NPILE; i++) {
        const on = backlog * NPILE > i ? 1 : 0;
        tmpV.set(WINDOW.x - 1.2 + (i % 4) * 0.6 + (rnd(i) - 0.5) * 0.1, FY + 0.12 + Math.floor(i / 4) * 0.15, WINDOW.z + 1.6 + (rnd(i + 3) - 0.5) * 0.6);
        tmpQ.identity();
        tmpS.setScalar(0.32 * on);
        tmpM.compose(tmpV, tmpQ, tmpS);
        pile.current.setMatrixAt(i, tmpM);
      }
      pile.current.instanceMatrix.needsUpdate = true;
    }

    // SVB: gates drop on Friday, lift on Monday
    const gate = in8 ? smooth(ramp(t8, 0.1, 0.16)) * (1 - smooth(ramp(t8, 0.62, 0.7))) : 0;
    if (bars.current) {
      for (let i = 0; i < 14; i++) {
        tmpV.set(SVB.x - 3.4 + i * 0.52, FY + lerp(9, 2.1, gate), SVB.z + 2.7);
        tmpQ.identity();
        tmpS.set(1, 1, 1);
        tmpM.compose(tmpV, tmpQ, tmpS);
        bars.current.setMatrixAt(i, tmpM);
      }
      bars.current.instanceMatrix.needsUpdate = true;
    }
    if (closedSign.current) closedSign.current.visible = gate > 0.5;

    // scene 09: one holder redeems — coin to the window, burned, dollars wired to a bank
    if (redeemCoin.current) {
      const go = smooth(ramp(t9, 0.06, 0.18));
      const b = smooth(ramp(t9, 0.18, 0.28));
      redeemCoin.current.visible = in9 && t9 < 0.3;
      tmpV.lerpVectors(HOLDER.clone().setY(FY + 1.8), WINDOW, go);
      tmpV.y += Math.sin(Math.PI * go) * 1.5;
      redeemCoin.current.position.copy(tmpV);
      redeemCoin.current.scale.setScalar(Math.max(0.01, 0.6 * (1 - b)));
      redeemCoin.current.rotation.set(Math.PI / 2, 0, tm);
    }
    if (burn.current) burn.current.opacity = in9 ? band(t9, 0.16, 0.2, 0.28, 0.34) : 0;
    if (slip.current) {
      const k = smooth(ramp(t9, 0.28, 0.42));
      slip.current.visible = in9 && t9 > 0.27 && t9 < 0.46;
      slip.current.position.set(lerp(WINDOW.x, BANK2.x, k), FY + 2.2 + Math.sin(Math.PI * k) * 2.4, lerp(WINDOW.z + 0.6, BANK2.z + 1.5, k));
      slip.current.rotation.set(-0.3, k * 2, 0);
    }
    [mats.floor, mats.counter, mats.desk].forEach((m) => {
      m.transparent = xr.v > 0.01;
      m.opacity = 1 - 0.5 * xr.v;
    });
  });

  const n6 = (a: number, b: number, c: number, d: number) => (u: number) => band(local("s06", u), a, b, c, d);
  const n8 = (a: number, b: number, c: number, d: number) => (u: number) => band(local("s08", u), a, b, c, d);
  const n9 = (a: number, b: number, c: number, d: number) => (u: number) => band(local("s09", u), a, b, c, d);
  const sys6 = (u: number) => Math.max(n6(0.04, 0.1, 0.92, 0.98)(u), n8(0.04, 0.1, 0.92, 0.98)(u), n9(0.02, 0.06, 0.42, 0.48)(u));

  return (
    <group ref={group}>
      <pointLight position={[M.x, FY + 10, M.z + 6]} color="#fff4e2" intensity={110} distance={50} decay={1.4} />
      {/* floor */}
      <mesh position={[M.x + 6, FY + 0.05, M.z]} material={mats.floor} receiveShadow>
        <boxGeometry args={[42, 0.3, 30]} />
      </mesh>

      {/* price board */}
      <mesh position={BOARD} castShadow>
        <boxGeometry args={[18, 8, 0.4]} />
        <meshStandardMaterial color="#1b2533" metalness={0.4} roughness={0.5} />
      </mesh>
      {board && (
        <mesh position={[BOARD.x, BOARD.y, BOARD.z + 0.21]}>
          <planeGeometry args={[17.4, 7.6]} />
          <meshBasicMaterial map={board.t} toneMapped={false} />
        </mesh>
      )}
      {[-6, 6].map((dx) => (
        <mesh key={dx} position={[BOARD.x + dx, FY + 1.3, BOARD.z]} material={mats.dark}>
          <boxGeometry args={[0.4, 2.6, 0.4]} />
        </mesh>
      ))}
      <mesh position={[M.x - 13, FY + 2.6, M.z - 1]} rotation={[0, 0.7, 0]} material={mats.ex}>
        <boxGeometry args={[4.6, 0.8, 0.1]} />
      </mesh>
      <mesh position={[M.x - 13, FY + 1.1, M.z - 1]} material={mats.dark}>
        <boxGeometry args={[0.12, 2.2, 0.12]} />
      </mesh>

      {/* trading desks */}
      {Array.from({ length: 8 }, (_, i) => {
        const x = M.x - 9 + (i % 4) * 3.2;
        const z = M.z + (i < 4 ? -2 : 2.4);
        return (
          <group key={i} position={[x, FY, z]}>
            <mesh position={[0, 0.95, 0]} material={mats.desk} castShadow receiveShadow>
              <boxGeometry args={[2.6, 0.1, 1.2]} />
            </mesh>
            {[-1.15, 1.15].map((lx) => (
              <mesh key={lx} position={[lx, 0.47, 0]} material={mats.dark}>
                <boxGeometry args={[0.08, 0.9, 1.0]} />
              </mesh>
            ))}
            {[-0.55, 0.55].map((mx) => (
              <group key={mx} position={[mx, 1.45, -0.3]}>
                <mesh material={mats.dark}>
                  <boxGeometry args={[0.95, 0.62, 0.06]} />
                </mesh>
                <mesh position={[0, 0, 0.035]}>
                  <planeGeometry args={[0.85, 0.52]} />
                  <meshStandardMaterial ref={i === 0 && mx < 0 ? screens : undefined} color="#3ddc97" emissive="#3ddc97" emissiveIntensity={0.6} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}

      {/* Circle redemption counter */}
      <group position={[WINDOW.x, FY, WINDOW.z - 2.2]}>
        <mesh position={[0, 2.4, 0]} material={mats.counter} castShadow receiveShadow>
          <boxGeometry args={[7, 4.8, 4]} />
        </mesh>
        <mesh position={[0, 5.3, 2.01]} material={mats.sign}>
          <planeGeometry args={[7, 0.9]} />
        </mesh>
        <mesh position={[0, 2.1, 2.02]}>
          <planeGeometry args={[3, 1.8]} />
          <meshStandardMaterial color="#dcecfb" emissive="#9cc9f5" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0.95, 2.4]} material={mats.counter} castShadow>
          <boxGeometry args={[4, 0.15, 0.9]} />
        </mesh>
        <mesh position={[2.6, 1.0, 2.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.5, 32]} />
          <meshBasicMaterial ref={burn} color="#ff7a3c" transparent opacity={0} />
        </mesh>
      </group>
      <mesh ref={shutter} position={[WINDOW.x, WINDOW.y + 1.7, WINDOW.z + 0.03]} material={mats.shutter}>
        <boxGeometry args={[3.1, 1.9, 0.08]} />
      </mesh>
      <instancedMesh ref={flow} args={[cgeo, coinMats(), NFLOW]} frustumCulled={false} castShadow />
      <instancedMesh ref={pile} args={[cgeo, coinMats(), NPILE]} frustumCulled={false} castShadow />

      {/* scene 09: the holder, the wire, the receiving bank */}
      <group position={HOLDER}>
        <mesh position={[0, 0.5, 0]} material={mats.dark}>
          <cylinderGeometry args={[0.35, 0.45, 1, 20]} />
        </mesh>
        <mesh position={[0, 1.55, 0]} rotation={[-0.2, 0.5, 0]}>
          <boxGeometry args={[0.62, 1.15, 0.07]} />
          <meshStandardMaterial color="#1b2533" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>
      <mesh ref={redeemCoin} geometry={cgeo} material={coinMats()} castShadow />
      <mesh ref={slip} material={mats.wire} castShadow>
        <boxGeometry args={[1.25, 0.02, 0.8]} />
      </mesh>
      <Bank position={[BANK2.x, FY, BANK2.z]} scale={1.3} sign="YOUR BANK" rotation={-0.5} />

      {/* Silicon Valley Bank, March 2023 */}
      <Bank position={[SVB.x, FY, SVB.z]} scale={1.8} sign="SILICON VALLEY BANK" />
      <instancedMesh ref={bars} args={[undefined, undefined, 14]} material={mats.bar} frustumCulled={false} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 4.2, 10]} />
      </instancedMesh>
      <mesh ref={closedSign} position={[SVB.x, FY + 4.7, SVB.z + 2.85]} material={mats.closed}>
        <planeGeometry args={[2.6, 0.65]} />
      </mesh>

      <Tag kind="cine" position={[BOARD.x - 9, BOARD.y + 4.6, BOARD.z]} text={L.board} vis={n6(0.06, 0.12, 0.9, 0.96)} />
      <Tag kind="cine" position={[WINDOW.x + 3.8, WINDOW.y + 3.8, WINDOW.z]} text={L.counter} vis={(u) => Math.max(n6(0.36, 0.42, 0.9, 0.96)(u), n9(0.02, 0.06, 0.3, 0.36)(u))} />
      <Tag kind="cine" position={[SVB.x - 3.5, FY + 7.2, SVB.z + 2]} text="Silicon Valley Bank" vis={n8(0.06, 0.12, 0.7, 0.8)} align="right" />
      <Tag kind="cine" position={[BANK2.x - 2, FY + 5, BANK2.z]} text={L.yourBank} vis={n9(0.26, 0.3, 0.46, 0.52)} />
      <Tag kind="sys" position={[WINDOW.x + 3.8, WINDOW.y + 1.6, WINDOW.z + 1]} k={S.redeemer[0]} text={S.redeemer[1]} vis={sys6} />
      <Tag kind="sys" position={[DESK.x - 4, DESK.y + 2.4, DESK.z]} k={S.secondary[0]} text={S.secondary[1]} vis={sys6} align="right" />
      <Tag kind="sys" position={[WINDOW.x + 3.8, WINDOW.y - 0.6, WINDOW.z + 1]} k={S.banking[0]} text={S.banking[1]} vis={sys6} />
    </group>
  );
}

const EU = new THREE.Euler();
