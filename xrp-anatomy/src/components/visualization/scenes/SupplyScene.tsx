"use client";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label, mix } from "../svg";
import { SUPPLY } from "./DexScene";

const IDX = 7;
const RI = 232;
const RO = 296;
/** chapter 9 risk-map core node, where the ring shrinks to */
export const RISK_CORE = { x: 500, y: 560, r: 46 };

const arc = (cx: number, cy: number, r1: number, r2: number, a1: number, a2: number) => {
  const p = (r: number, a: number) => `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;
  const lg = a2 - a1 > Math.PI ? 1 : 0;
  return `M${p(r2, a1)} A${r2},${r2} 0 ${lg} 1 ${p(r2, a2)} L${p(r1, a2)} A${r1},${r1} 0 ${lg} 0 ${p(r1, a1)} Z`;
};
const segAngle = (i: number) => -Math.PI / 2 + (i / 100) * Math.PI * 2;

export default function SupplyScene() {
  const { t } = useI18n();
  const L = t.scenes.supply;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, ring: 0, lock: 0, timeline: 0, release: 0, split: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.05, ease: "none" }, at(-0.05))
        .to(v, { ring: 1, duration: 0.24, ease: "none" }, at(-0.04))
        .to(v, { lock: 1, duration: 0.16 }, at(0.26))
        .to(v, { timeline: 1, duration: 0.16 }, at(0.46))
        .to(v, { release: 1, duration: 0.14 }, at(0.6))
        .to(v, { split: 1, duration: 0.16 }, at(0.76))
        .to(v, { exit: 1, duration: 0.22 }, at(0.96))
        .to(v, { vis: 0, duration: 0.05, ease: "none" }, at(1.16));
    },
  );
  if (v.vis <= 0.001) return null;

  const ex = smooth(v.exit);
  const cx = lerp(SUPPLY.x, RISK_CORE.x, ex);
  const cy = lerp(SUPPLY.y, RISK_CORE.y, ex);
  const sc = lerp(1, RISK_CORE.r / RO, ex);
  const lock = smooth(v.lock);
  const rel = smooth(v.release);
  const split = smooth(v.split);
  const o = 1 - ex;

  // the released tranche: segment 0
  const segMid = segAngle(0.5);
  const segHome = { x: cx + Math.cos(segMid) * ((RI + RO) / 2) * sc, y: cy + Math.sin(segMid) * ((RI + RO) / 2) * sc };
  const rippleBox = { x: 860, y: 140 };
  const usedBox = { x: 860, y: 300 };
  const tlY = 880;
  const reEscrowSlot = { x: 880, y: tlY };
  const relPos = mix(segHome, rippleBox, rel);
  const usedPos = mix(rippleBox, usedBox, split);
  const backPos = mix(rippleBox, reEscrowSlot, split);

  return (
    <g opacity={v.vis}>
      {/* ring */}
      <g>
        {Array.from({ length: 100 }, (_, i) => {
          const show = clamp(v.ring * 100 - i * 0.92);
          if (show <= 0) return null;
          const escrowed = i < 55;
          const isReleased = i === 0 && rel > 0.02;
          const a1 = segAngle(i) + 0.006, a2 = segAngle(i + 1) - 0.006;
          return (
            <path
              key={i}
              d={arc(cx, cy, RI * sc, lerp(RI, RO, show) * sc, a1, a2)}
              fill={isReleased ? "none" : escrowed ? (lock > 0 ? C.ink : C.paper) : C.paper}
              fillOpacity={escrowed ? lerp(0, 0.82, lock) + (lock > 0 ? 0 : 1) : 1}
              stroke={C.ink}
              strokeWidth={0.6}
              strokeDasharray={isReleased ? "2 3" : undefined}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={(RI - 14) * sc} fill="none" stroke={C.line} strokeDasharray="1 5" />
      </g>

      {/* centre caption */}
      <g opacity={o * clamp(v.ring * 2)}>
        <text x={cx} y={cy - 6} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: 30 }}>
          {L.total.replace(" XRP", "")}
        </text>
        <Label x={cx} y={cy + 18} anchor="middle">
          XRP · {L.created}
        </Label>
        <Label x={cx} y={cy + 40} anchor="middle" color={C.warn} opacity={lock}>
          {L.notMinted}
        </Label>
      </g>

      {/* escrow bracket + locks */}
      <g opacity={lock * o}>
        <path d={arc(cx, cy, RO * sc + 14, RO * sc + 16, segAngle(0), segAngle(55))} fill={C.ink} />
        {[8, 22, 38, 50].map((i) => {
          const a = segAngle(i);
          const p = { x: cx + Math.cos(a) * (RO + 36), y: cy + Math.sin(a) * (RO + 36) };
          return <Lock key={i} x={p.x} y={p.y} />;
        })}
        <Label x={60} y={150} color={C.ink} anchor="start">
          ■ {L.escrow} · {L.locked}
        </Label>
        <Label x={60} y={168} anchor="start" size={9.5} upper={false} spacing="0">
          FinishAfter · CancelAfter · 55 × 10⁹
        </Label>
      </g>

      {/* timeline */}
      <g opacity={smooth(v.timeline) * o}>
        <line x1={90} y1={tlY} x2={920} y2={tlY} stroke={C.ink} />
        {Array.from({ length: 12 }, (_, m) => {
          const x = 120 + m * 66;
          const isFirst = m === 0;
          return (
            <g key={m} transform={`translate(${x},${tlY})`}>
              <line y1={-6} y2={6} stroke={C.ink} />
              <rect x={-14} y={-34} width={28} height={20} fill={isFirst && rel > 0.1 ? "none" : C.ink} fillOpacity={0.75} stroke={C.ink} strokeWidth={0.6} strokeDasharray={isFirst && rel > 0.1 ? "2 2" : undefined} />
              <Label x={0} y={22} anchor="middle" size={9}>
                M{m + 1}
              </Label>
            </g>
          );
        })}
        <Label x={90} y={tlY - 50}>
          {L.timeline}
        </Label>
      </g>

      {/* released tranche path */}
      {rel > 0.01 && (
        <g opacity={o}>
          <g transform={`translate(${relPos.x},${relPos.y})`} opacity={1 - split}>
            <rect x={-16} y={-10} width={32} height={20} fill={C.accent} stroke={C.ink} />
          </g>
          <g transform={`translate(${rippleBox.x},${rippleBox.y})`} opacity={rel}>
            <rect x={-80} y={-26} width={160} height={52} fill="none" stroke={C.ink} strokeDasharray="3 3" />
            <Label x={0} y={-34} anchor="middle" color={C.ink} size={10}>
              {L.release} → {L.toRipple}
            </Label>
          </g>
          {split > 0.01 && (
            <>
              <g transform={`translate(${usedPos.x},${usedPos.y})`}>
                <rect x={-8} y={-10} width={16} height={20} fill={C.accent} stroke={C.ink} />
              </g>
              <Label x={usedBox.x} y={usedBox.y + 30} anchor="middle" color={C.ink} opacity={split}>
                {L.onwards}
              </Label>
              <g transform={`translate(${backPos.x},${backPos.y - 24})`}>
                <rect x={-12} y={-10} width={24} height={20} fill={C.ink} fillOpacity={0.75} stroke={C.ink} />
              </g>
              <g opacity={split}>
                <Lock x={reEscrowSlot.x + 26} y={reEscrowSlot.y - 24} />
                <Label x={reEscrowSlot.x} y={reEscrowSlot.y - 50} anchor="end" color={C.ink}>
                  {L.reescrow}
                </Label>
              </g>
            </>
          )}
        </g>
      )}
      <Label x={60} y={118} opacity={o * smooth(v.ring)}>
        1 ▮ ≈ 10⁹ XRP · {t.ui.illustrative}
      </Label>
    </g>
  );
}

function Lock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-5,-2 V-7 A5,5 0 0 1 5,-7 V-2" fill="none" stroke={C.ink} strokeWidth={1.4} />
      <rect x={-7} y={-2} width={14} height={11} fill={C.paper} stroke={C.ink} strokeWidth={1.3} />
      <circle cy={3} r={1.4} fill={C.ink} />
    </g>
  );
}
