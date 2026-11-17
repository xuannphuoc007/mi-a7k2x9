"use client";
/**
 * Act 3 · The network. Thousands of identical copies of one notebook; a
 * tampered copy is outvoted; every 12 seconds a new page (block) is chained
 * on; Lan and Anna's contract is one entry that every copy runs; an endless
 * loop shows why each step has to cost gas.
 */
import { useMemo } from "react";
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, mulberry32, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("network");
const lemX = (t: number) => (60 * Math.cos(t)) / (1 + Math.sin(t) ** 2);
const lemY = (t: number) => (60 * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) ** 2);
const loopPath = "M" + Array.from({ length: 73 }, (_, i) => `${lemX((i / 72) * Math.PI * 2).toFixed(1)},${lemY((i / 72) * Math.PI * 2).toFixed(1)}`).join("L") + "Z";
const CX = 500;
const CY = 400;
const R = 270;

function Book({ x, y, s = 1, tone = C.accent, o = 1 }: { x: number; y: number; s?: number; tone?: string; o?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
      <rect x={-9} y={-11} width={18} height={22} rx={2} fill={C.paper} stroke={tone} strokeWidth={1.6} />
      <line x1={-5} x2={5} y1={-4} y2={-4} stroke={tone} strokeWidth={1.2} />
      <line x1={-5} x2={5} y1={1} y2={1} stroke={tone} strokeWidth={1.2} />
      <line x1={-5} x2={2} y1={6} y2={6} stroke={tone} strokeWidth={1.2} />
    </g>
  );
}

export default function NetworkScene() {
  const { t } = useI18n();
  const L = t.scenes.network;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const nodes = useMemo(() => {
    const r = mulberry32(7);
    return Array.from({ length: 64 }, (_, i) => {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * R;
      return { x: CX + Math.cos(a) * d, y: CY + Math.sin(a) * d * 0.82, i, delay: r() };
    });
  }, []);
  const links = useMemo(() => {
    const out: [number, number][] = [];
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
        .filter((b) => b.j !== i)
        .sort((p, q) => p.d - q.d)
        .slice(0, 2);
      near.forEach((b) => i < b.j && out.push([i, b.j]));
    });
    return out;
  }, [nodes]);
  const BAD = 23;
  const LOOP = loopPath;

  const v = useSceneTimeline(
    IDX,
    { vis: 0, grow: 0, tamper: 0, chain: 0, run: 0, loop: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { grow: 1, duration: 0.16, ease: "none" }, at(-0.06))
        .to(v, { tamper: 1, duration: 0.14, ease: "none" }, at(0.12))
        .to(v, { chain: 1, duration: 0.24, ease: "none" }, at(0.28))
        .to(v, { run: 1, duration: 0.18, ease: "none" }, at(0.54))
        .to(v, { loop: 1, duration: 0.18, ease: "none" }, at(0.78))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);

  // tamper: one copy turns red, then is outvoted and dims
  const red = clamp(v.tamper * 3) * (1 - clamp((v.tamper - 0.7) * 3.3));
  const ignored = clamp((v.tamper - 0.45) * 2.5);
  // blocks: one every 12 s, scroll-driven
  const nBlocks = Math.floor(lerp(3, 12, v.chain));
  const blockFrac = (lerp(3, 12, v.chain) % 1) || 0;
  const slot = 1_200_000 + Math.floor(v.chain * 9) + 3;
  // the contract runs on every copy
  const runWave = v.run;
  // endless loop
  const loop = smooth(v.loop);
  const jam = clamp(v.loop * 2) * (1 - clamp((v.loop - 0.55) * 3));
  const gasStop = clamp((v.loop - 0.55) * 3);

  const bw = 64;
  const by = 830;
  const bx = (i: number) => 960 - (nBlocks - i) * (bw + 14) - (1 - blockFrac) * 0;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* globe outline */}
      <g opacity={1 - loop * 0.8}>
      <ellipse cx={CX} cy={CY} rx={R + 30} ry={(R + 30) * 0.82} fill="none" stroke={C.line} strokeDasharray="2 6" opacity={smooth(v.grow)} />
      {links.map(([a, b], i) => {
        const q = clamp(v.grow * 1.6 - nodes[a].delay * 0.6);
        if (q <= 0) return null;
        return <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={lerp(nodes[a].x, nodes[b].x, q)} y2={lerp(nodes[a].y, nodes[b].y, q)} stroke={jam > 0.3 ? C.warn : C.line} strokeWidth={1} opacity={0.8} />;
      })}
      {nodes.map((n) => {
        const q = clamp(v.grow * 1.5 - n.delay * 0.5);
        if (q <= 0) return null;
        const bad = n.i === BAD;
        const d = Math.hypot(n.x - CX, n.y - CY) / R;
        const pulse = runWave > 0 && runWave < 1 ? clamp(1 - Math.abs(runWave * 1.4 - d) * 5) : 0;
        const tone = bad && red > 0 ? C.warn : jam > 0.3 && (n.i % 3 === 0) ? C.warn : pulse > 0.2 ? C.mint : C.accent;
        return (
          <g key={n.i}>
            {pulse > 0 && <circle cx={n.x} cy={n.y} r={18 * pulse + 6} fill="none" stroke={C.mint} opacity={pulse} />}
            <Book x={n.x} y={n.y} s={lerp(0.4, 1, q)} tone={tone} o={bad ? 1 - ignored * 0.75 : q} />
            {bad && ignored > 0 && (
              <path d={`M${n.x - 14},${n.y - 14} L${n.x + 14},${n.y + 14} M${n.x + 14},${n.y - 14} L${n.x - 14},${n.y + 14}`} stroke={C.warn} strokeWidth={2.5} opacity={ignored} />
            )}
          </g>
        );
      })}
      {red > 0.05 && (
        <Label x={nodes[BAD].x} y={nodes[BAD].y - 26} anchor="middle" color={C.warn} size={fs(9.5)} opacity={Math.max(red, ignored * (1 - clamp((v.chain - 0.05) * 6)))}>
          {ignored > 0.5 ? L.outvoted : L.tampered}
        </Label>
      )}
      </g>
      <Label x={CX} y={90} anchor="middle" color={C.ink} size={fs(11)} opacity={smooth(v.grow) * (1 - clamp(v.chain * 4))}>
        {L.copies}
      </Label>

      {/* the chain of pages */}
      {v.chain > 0.001 && (
        <g opacity={smooth(clamp(v.chain * 5))}>
          <Label x={40} y={by - 60} size={fs(10)} color={C.ink}>
            {L.every12}
          </Label>
          <Label x={960} y={by - 60} anchor="end" size={fs(9.5)}>
            {L.block} #{slot.toLocaleString("en-US")}
          </Label>
          {Array.from({ length: nBlocks }, (_, i) => {
            const x = bx(i);
            if (x < 20) return null;
            const isNew = i === nBlocks - 1;
            const hasContract = i === nBlocks - 2 && runWave > 0;
            return (
              <g key={i} opacity={isNew ? clamp(blockFrac * 3 + 0.3) : 1}>
                {i > 0 && <line x1={x - 14} x2={x} y1={by} y2={by} stroke={C.accent} strokeWidth={2} />}
                <rect x={x} y={by - 30} width={bw} height={60} rx={5} fill={hasContract ? C.accentSoft : C.paper} stroke={hasContract ? C.mint : C.accent} strokeWidth={1.4} />
                {[0, 1, 2].map((r) => (
                  <line key={r} x1={x + 10} x2={x + bw - 10 - r * 8} y1={by - 14 + r * 13} y2={by - 14 + r * 13} stroke={hasContract && r === 1 ? C.mint : C.line} strokeWidth={hasContract && r === 1 ? 3 : 2} />
                ))}
              </g>
            );
          })}
        </g>
      )}
      {runWave > 0.05 && (
        <Label x={CX} y={90} anchor="middle" color={C.mint} size={fs(11)} opacity={clamp(runWave * 3) * (1 - loop)}>
          {L.sameResult}
        </Label>
      )}

      {/* endless loop → out of gas */}
      {loop > 0.01 && (
        <g opacity={loop} transform={`translate(${CX},${CY})`}>
          <circle r={86} fill={C.paper} stroke={gasStop > 0.5 ? C.mint : C.warn} strokeWidth={2.5} />
          <path d={LOOP} fill="none" stroke={gasStop > 0.5 ? C.line : C.warn} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
          {gasStop < 0.5 && (
            <circle cx={lemX(v.loop * 30)} cy={lemY(v.loop * 30)} r={9} fill={C.warn} />
          )}
          {gasStop >= 0.5 && (
            <g>
              <rect x={-26} y={-26} width={52} height={52} rx={6} fill={C.mint} />
              <rect x={-11} y={-11} width={22} height={22} rx={2} fill={C.paper} />
            </g>
          )}
          <Label x={0} y={-104} anchor="middle" color={gasStop > 0.5 ? C.mint : C.warn} size={fs(11)}>
            {gasStop > 0.5 ? L.outOfGas : L.loop}
          </Label>
          {gasStop > 0 && (
            <g opacity={gasStop}>
              <rect x={-70} y={104} width={140} height={14} rx={7} fill={C.line} />
              <rect x={-70} y={104} width={140 * (1 - gasStop)} height={14} rx={7} fill={C.mint} />
              <Label x={0} y={140 + fs(4)} anchor="middle" size={fs(9)}>
                {L.gasLeft}
              </Label>
            </g>
          )}
        </g>
      )}
    </g>
  );
}
