"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, local, ramp, smooth, band, lerp } from "@/lib/timeline";
import { useI18n } from "@/lib/i18n";
import { COL, packetPoints, rnd, tmpM, tmpQ, tmpV, tmpS, tmpC, clock, xr, g } from "./shared";
import Tag from "./Tag";

const W = 6.6;
const H = 2.8;

/** Original, stylised banknote (not a real currency design). */
function drawNote(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 1320;
  c.height = 560;
  const x = c.getContext("2d")!;
  const ink = "#2c4a3d";
  const g0 = x.createLinearGradient(0, 0, c.width, c.height);
  g0.addColorStop(0, "#e9eedf");
  g0.addColorStop(0.5, "#dfe7d6");
  g0.addColorStop(1, "#e6ebdc");
  x.fillStyle = g0;
  x.fillRect(0, 0, c.width, c.height);
  // fine guilloche waves
  x.lineWidth = 1;
  for (let k = 0; k < 46; k++) {
    x.strokeStyle = `rgba(44,74,61,${0.05 + (k % 5) * 0.012})`;
    x.beginPath();
    for (let i = 0; i <= c.width; i += 6) {
      const y = 40 + k * 10.6 + Math.sin(i / 38 + k * 0.6) * 6 + Math.sin(i / 11 + k) * 1.5;
      if (i === 0) x.moveTo(i, y);
      else x.lineTo(i, y);
    }
    x.stroke();
  }
  // frame
  x.strokeStyle = ink;
  x.lineWidth = 10;
  x.strokeRect(26, 26, c.width - 52, c.height - 52);
  x.lineWidth = 2;
  x.strokeRect(46, 46, c.width - 92, c.height - 92);
  // central rosette (abstract, no portrait)
  const cx = c.width / 2;
  const cy = c.height / 2 + 6;
  x.fillStyle = "rgba(233,238,223,.9)";
  x.beginPath();
  x.ellipse(cx, cy, 170, 190, 0, 0, Math.PI * 2);
  x.fill();
  for (let r = 0; r < 36; r++) {
    x.strokeStyle = `rgba(44,74,61,${0.18 + (r % 3) * 0.08})`;
    x.lineWidth = 1.2;
    x.beginPath();
    x.ellipse(cx, cy, 150, 60, (r * Math.PI) / 36, 0, Math.PI * 2);
    x.stroke();
  }
  x.lineWidth = 3;
  x.strokeStyle = ink;
  x.beginPath();
  x.ellipse(cx, cy, 170, 190, 0, 0, Math.PI * 2);
  x.stroke();
  x.fillStyle = ink;
  x.textAlign = "center";
  x.font = "700 64px Georgia, serif";
  x.fillText("1", cx, cy + 22);
  // corner numerals
  x.font = "700 92px Georgia, serif";
  x.fillText("1", 120, 140);
  x.fillText("1", c.width - 120, c.height - 80);
  x.font = "600 30px Georgia, serif";
  x.fillText("1", c.width - 110, 120);
  x.fillText("1", 110, c.height - 92);
  // texts
  x.font = "600 44px Georgia, serif";
  x.fillText("ONE  DOLLAR", cx, c.height - 74);
  x.font = "500 22px Georgia, serif";
  x.fillText("THE JOURNEY OF A DIGITAL DOLLAR", cx, 92);
  x.font = "500 18px monospace";
  x.textAlign = "left";
  x.fillText("DD 0000 0001 A", 270, 170);
  x.textAlign = "right";
  x.fillText("DD 0000 0001 A", c.width - 270, c.height - 150);
  x.textAlign = "center";
  x.font = "500 14px monospace";
  x.fillText("ILLUSTRATIVE · NOT LEGAL TENDER", cx, c.height - 46);
  return c;
}

export default function Hero() {
  const { t } = useI18n();
  const mobile = typeof window !== "undefined" && window.innerWidth < 760;
  const COLS = mobile ? 74 : 112;
  const ROWS = Math.round((COLS * H) / W);
  const N = COLS * ROWS;

  const data = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = drawNote();
    const ctx = canvas.getContext("2d")!;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const grid: THREE.Vector3[] = [];
    const paper: THREE.Color[] = [];
    const tw = W / COLS;
    const th = H / ROWS;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        grid.push(new THREE.Vector3(-W / 2 + tw * (c + 0.5), H / 2 - th * (r + 0.5), 0));
        const px = Math.floor(((c + 0.5) / COLS) * canvas.width);
        const py = Math.floor(((r + 0.5) / ROWS) * canvas.height);
        const i = (py * canvas.width + px) * 4;
        paper.push(new THREE.Color(img[i] / 255, img[i + 1] / 255, img[i + 2] / 255).convertSRGBToLinear());
      }
    // packet targets, sorted so tiles fly to nearby facets (keeps the morph legible)
    const { pts, nrm } = packetPoints(N, 1.55);
    const order = pts.map((p, i) => ({ i, k: Math.atan2(p.y, p.x) + p.z * 0.4 }));
    const gord = grid.map((p, i) => ({ i, k: Math.atan2(p.y * 2.3, p.x) }));
    order.sort((a, b) => a.k - b.k);
    gord.sort((a, b) => a.k - b.k);
    const target = new Array<THREE.Vector3>(N);
    const normal = new Array<THREE.Vector3>(N);
    for (let j = 0; j < N; j++) {
      target[gord[j].i] = pts[order[j].i];
      normal[gord[j].i] = nrm[order[j].i];
    }
    const digital = paper.map((_, i) => new THREE.Color(rnd(i) > 0.55 ? COL.volt : rnd(i + 9) > 0.5 ? COL.usdc : COL.ice).convertSRGBToLinear());
    const qn = normal.map((n) => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n));
    return { tex, grid, paper, target, qn, digital, tw, th };
  }, [N, COLS, ROWS]);

  const inst = useRef<THREE.InstancedMesh>(null);
  const plane = useRef<THREE.Mesh>(null);
  const planeMat = useRef<THREE.MeshStandardMaterial>(null);
  const tileMat = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.LineSegments>(null);

  const ident = useMemo(() => new THREE.Quaternion(), []);
  const spin = useMemo(() => new THREE.Quaternion(), []);
  const axis = useMemo(() => new THREE.Vector3(), []);
  const rotQ = useMemo(() => new THREE.Quaternion(), []);
  const qT = useMemo(() => new THREE.Quaternion(), []);
  const bR = useMemo(() => new THREE.Vector3(), []);
  const Y = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const wireGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.62)), []);

  useFrame(() => {
    if (!data || !inst.current || !group.current) return;
    const u = scrollState.u;
    const vis = u < g("s03", 0.22);
    group.current.visible = vis;
    if (!vis) return;
    const tl = local("s01", u);
    const m = smooth(ramp(tl, 0.24, 0.5)); // morph paper → packet
    const burst = Math.sin(Math.PI * m); // fragments scatter mid-morph
    const tm = clock.t;

    if (plane.current && planeMat.current) {
      const po = 1 - ramp(tl, 0.22, 0.27);
      planeMat.current.opacity = po;
      plane.current.visible = po > 0.001;
      plane.current.position.y = Math.sin(tm * 0.6) * 0.06;
    }
    inst.current.visible = tl > 0.215;

    const shown = tl > 0.215;
    rotQ.setFromAxisAngle(Y, tm * 0.12);
    if (shown) {
      for (let i = 0; i < data.grid.length; i++) {
        const a = data.grid[i];
        const b = bR.copy(data.target[i]).applyQuaternion(rotQ);
        const r1 = rnd(i);
        const r2 = rnd(i + 3.1);
        const r3 = rnd(i + 7.7);
        // per-tile delay so the note peels from the edges inward
        const d = Math.min(0.35, Math.abs(a.x) / (W / 2) * 0.25 + r1 * 0.1);
        const mi = smooth(ramp(m, d, d + 0.65));
        const bi = Math.sin(Math.PI * mi);
        tmpV.lerpVectors(a, b, mi);
        tmpV.x += (r1 - 0.5) * 2.6 * bi;
        tmpV.y += (r2 - 0.5) * 2.2 * bi;
        tmpV.z += (r3 - 0.2) * 3.4 * bi;
        tmpV.y += Math.sin(tm * 0.6) * 0.06 * (1 - mi);
        axis.set(r2 - 0.5, r3 - 0.5, r1 - 0.5).normalize();
        spin.setFromAxisAngle(axis, bi * (2 + r1 * 3));
        qT.multiplyQuaternions(rotQ, data.qn[i]);
        tmpQ.slerpQuaternions(ident, qT, mi).multiply(spin);
        const sc = lerp(1, 0.78, mi);
        tmpS.set(sc, sc, 1);
        tmpM.compose(tmpV, tmpQ, tmpS);
        inst.current.setMatrixAt(i, tmpM);
        tmpC.copy(data.paper[i]).lerp(data.digital[i], smooth(ramp(mi, 0.25, 0.9)));
        inst.current.setColorAt(i, tmpC);
      }
      inst.current.instanceMatrix.needsUpdate = true;
      if (inst.current.instanceColor) inst.current.instanceColor.needsUpdate = true;
    }
    if (tileMat.current) {
      tileMat.current.emissiveIntensity = 0.05 + m * 0.9 + burst * 0.4;
      tileMat.current.opacity = 1 - 0.75 * xr.v;
    }
    if (glow.current) {
      const s = 0.2 + m * 1.0;
      glow.current.scale.setScalar(s);
      (glow.current.material as THREE.MeshBasicMaterial).opacity = m * 0.55 * (1 - ramp(tl, 0.66, 0.74) * 0.6);
    }
    if (halo.current) {
      halo.current.rotation.z = tm * 0.1;
      (halo.current.material as THREE.MeshBasicMaterial).opacity = band(tl, 0.42, 0.52, 0.6, 0.68) * 0.6;
    }
    if (wire.current) {
      wire.current.rotation.y = tm * 0.12;
      const wo = xr.v * smooth(ramp(tl, 0.4, 0.5));
      (wire.current.material as THREE.LineBasicMaterial).opacity = wo;
      wire.current.visible = wo > 0.005;
    }
  });

  const L = t.labels;
  const S = t.sys;
  const noteVis = (u: number) => band(local("s01", u), 0.02, 0.08, 0.2, 0.24);
  const pktVis = (u: number) => band(local("s01", u), 0.44, 0.5, 0.6, 0.64);
  const sysVis = (u: number) => band(local("s01", u), 0.0, 0.03, 0.62, 0.68);

  if (!data) return null;
  return (
    <group ref={group}>
      <mesh ref={plane} position={[0, 0, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial ref={planeMat} map={data.tex} transparent roughness={0.85} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <instancedMesh ref={inst} args={[undefined, undefined, N]} frustumCulled={false}>
        <boxGeometry args={[data.tw * 0.985, data.th * 0.985, 0.012]} />
        <meshStandardMaterial
          ref={tileMat}
          roughness={0.55}
          metalness={0.25}
          emissive={COL.usdc}
          emissiveIntensity={0}
          side={THREE.DoubleSide}
          transparent
        />
      </instancedMesh>
      <mesh ref={glow}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={COL.volt} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={halo} rotation={[0, 0, 0]}>
        <ringGeometry args={[2.3, 2.34, 128]} />
        <meshBasicMaterial color={COL.ice} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments ref={wire} geometry={wireGeo}>
        <lineBasicMaterial color={COL.ice} transparent opacity={0} />
      </lineSegments>

      <Tag kind="cine" position={[-3.3, 1.75, 0]} text={L.note} vis={noteVis} />
      <Tag kind="cine" position={[3.5, 0.9, 0]} text={L.paper} vis={noteVis} />
      <Tag kind="cine" position={[-3.3, -1.75, 0]} text={L.hours} vis={noteVis} />
      <Tag kind="cine" position={[3.5, -1.2, 0]} text={L.days} vis={noteVis} />
      <Tag kind="cine" position={[2.2, 1.5, 0]} text={L.token} vis={pktVis} />
      <Tag kind="cine" position={[-2.2, -1.4, 0]} text={L.anyhour} vis={pktVis} align="right" />

      <Tag kind="sys" position={[-3.4, 2.4, 0]} k={S.issuer[0]} text={S.issuer[1]} vis={sysVis} />
      <Tag kind="sys" position={[3.4, 1.9, 0]} k={S.contract[0]} text={S.contract[1]} vis={sysVis} />
      <Tag kind="sys" position={[-3.4, -2.3, 0]} k={S.redeem[0]} text={S.redeem[1]} vis={sysVis} />
      <Tag kind="sys" position={[3.4, -2.0, 0]} k={S.notins[0]} text={S.notins[1]} vis={sysVis} />
    </group>
  );
}
