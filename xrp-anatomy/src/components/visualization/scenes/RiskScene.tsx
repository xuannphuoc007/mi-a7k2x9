"use client";
import { chapterIndex } from "@/data/coins/xrp/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useClock, useTween } from "@/hooks/useTween";
import { useI18n } from "@/lib/i18n";
import { clamp, fmt, lerp, smooth, useStore } from "@/lib/store";
import { riskStore } from "@/lib/simStores";
import { engine } from "@/animations/scrollController";
import { C, DrawPath, Label, mix } from "../svg";
import { RISK_CORE } from "./SupplyScene";

const IDX = chapterIndex("risk");
const P = {
  sender: { x: 100, y: 560 },
  onramp: { x: 285, y: 560 },
  core: { x: RISK_CORE.x, y: RISK_CORE.y },
  payout: { x: 715, y: 560 },
  recipient: { x: 900, y: 560 },
  dex: { x: 500, y: 400 },
  vals: { x: 500, y: 752 },
  market: { x: 500, y: 215 },
  issuer: { x: 285, y: 380 },
  border: 610,
};
/** which components each risk touches */
const AFFECTS: Record<number, string[]> = {
  0: ["market", "dex"],
  1: ["dex", "route"],
  2: ["issuer", "onramp", "payout"],
  3: ["border", "onramp", "payout"],
  4: ["payout"],
};

export default function RiskScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.risk;
  const R = t.panels.risk.labels;
  const risk = useStore(riskStore, (s) => s.risk);
  const v = useSceneTimeline(IDX, { vis: 0, build: 0, exit: 0 }, (tl, v, at) => {
    tl.to(v, { vis: 1, duration: 0.05, ease: "none" }, at(-0.05))
      .to(v, { build: 1, duration: 0.3, ease: "none" }, at(-0.04))
      .to(v, { exit: 1, duration: 0.24 }, at(0.92))
      .to(v, { vis: 0, duration: 0.05, ease: "none" }, at(1.16));
  });
  const active = v.vis > 0 && risk >= 0 && !engine.reduced;
  const time = useClock(active);
  const fx = useTween(risk >= 0 ? 1 : 0, 0.5);
  if (v.vis <= 0.001) return null;

  const ex = smooth(v.exit);
  const b = (k: number) => smooth(clamp(v.build * 6 - k));
  const hit = (k: string) => (risk >= 0 && AFFECTS[risk]?.includes(k) ? 1 : 0);
  const pull = (p: { x: number; y: number }) => mix(p, { x: 500, y: 500 }, ex);
  const o = 1 - ex;
  const s = lerp(1, 0.2, ex);

  // effects
  const routeW = risk === 1 ? lerp(10, 2.5, fx) : 10;
  const rate = 36 * (1 + (risk === 0 ? 0.045 * Math.sin(time * 2.2) + 0.02 * Math.sin(time * 5.1) : 0));
  const cost = risk === 1 ? lerp(0.6, 4.8, fx) : 0.6;
  const payoutDown = risk === 4 ? fx : 0;
  const gate = risk === 3 ? fx : 0;
  const offline = 0;

  const node = (key: keyof typeof P, label: string, k: number, shape: "circle" | "square" = "circle", extra?: React.ReactNode) => {
    const p = pull(P[key] as { x: number; y: number });
    const h = hit(key);
    return (
      <g transform={`translate(${p.x},${p.y}) scale(${s * b(k)})`} opacity={o}>
        {h > 0 && <circle r={58} fill="url(#glow-warn)" opacity={fx} />}
        {shape === "circle" ? (
          <circle r={22} fill={C.paper} stroke={h ? C.warn : C.ink} strokeWidth={h ? 2.2 : 1.3} />
        ) : (
          <rect x={-20} y={-20} width={40} height={40} fill={C.paper} stroke={h ? C.warn : C.ink} strokeWidth={h ? 2.2 : 1.3} />
        )}
        {extra}
        <Label x={0} y={42} anchor="middle" color={h ? C.warn : C.ink} size={10}>
          {label}
        </Label>
      </g>
    );
  };

  const sp = pull(P.sender), on = pull(P.onramp), co = pull(P.core), pa = pull(P.payout), re = pull(P.recipient);
  const dx = pull(P.dex), va = pull(P.vals), mk = pull(P.market), is = pull(P.issuer);
  const spark = Array.from({ length: 40 }, (_, i) => {
    const x = -70 + i * 3.6;
    const y = Math.sin(i * 0.5 + (risk === 0 ? time * 3 : 0)) * (risk === 0 ? 14 : 5) + Math.sin(i * 1.7) * 3;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join("");

  return (
    <g opacity={v.vis}>
      {/* jurisdiction border */}
      <g opacity={b(1) * o}>
        <line x1={P.border} y1={150} x2={P.border} y2={860} stroke={hit("border") ? C.warn : C.line} strokeDasharray="5 5" strokeWidth={hit("border") ? 1.6 : 1} />
        <Label x={P.border - 10} y={170} anchor="end" size={9.5}>
          US
        </Label>
        <Label x={P.border + 10} y={170} size={9.5}>
          MX
        </Label>
        <Label x={P.border} y={880} anchor="middle" color={hit("border") ? C.warn : C.mute} size={9.5}>
          {L.regulator}
        </Label>
      </g>

      {/* main route */}
      <g opacity={o}>
        <DrawPath d={`M${sp.x},${sp.y} L${on.x},${on.y}`} p={b(0.5)} width={2} />
        <DrawPath d={`M${on.x},${on.y} L${co.x},${co.y}`} p={b(1.2)} width={routeW} color={hit("route") ? C.warn : C.accent} opacity={0.3} cap="butt" />
        <DrawPath d={`M${co.x},${co.y} L${pa.x},${pa.y}`} p={b(1.8)} width={routeW} color={hit("route") ? C.warn : C.accent} opacity={0.3} cap="butt" />
        <DrawPath d={`M${on.x},${on.y} L${pa.x},${pa.y}`} p={b(1.5)} width={1.4} color={C.accent} />
        <DrawPath d={`M${pa.x},${pa.y} L${re.x},${re.y}`} p={b(2.4)} width={2} dash={payoutDown > 0.5 ? "4 4" : undefined} />
        <DrawPath d={`M${dx.x},${dx.y} L${co.x},${co.y}`} p={b(2)} width={1} color={C.ink} />
        <DrawPath d={`M${mk.x},${mk.y + 30} L${dx.x},${dx.y - 22}`} p={b(2.6)} width={0.8} color={C.mute} dash="2 4" />
        <DrawPath d={`M${va.x},${va.y - 64} L${co.x},${co.y + 24}`} p={b(2.6)} width={1} color={C.ink} />
        <DrawPath d={`M${is.x + 20},${is.y + 10} L${dx.x - 22},${dx.y}`} p={b(2.8)} width={0.8} color={hit("issuer") ? C.warn : C.mute} dash={hit("issuer") ? "6 6" : "2 4"} />
      </g>

      {node("sender", L.sender, 0)}
      {node("onramp", L.onramp, 0.8, "square")}
      {node("payout", L.offramp, 2, "square", payoutDown > 0 ? (
        <g opacity={payoutDown}>
          <path d="M-12,-12 L12,12 M12,-12 L-12,12" stroke={C.warn} strokeWidth={2.4} />
        </g>
      ) : null)}
      {node("recipient", L.recipient, 2.6)}
      {node("issuer", L.issuer, 3, "square", <text y={4} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}>IOU</text>)}

      {/* XRPL core */}
      <g transform={`translate(${co.x},${co.y}) scale(${s})`} opacity={b(1.5)}>
        {hit("core") > 0 && <circle r={70} fill="url(#glow-warn)" opacity={fx} />}
        <circle r={RISK_CORE.r} fill={C.paper} stroke={C.accent} strokeWidth={2} />
        <circle r={RISK_CORE.r - 8} fill="none" stroke={C.accent} strokeDasharray="2 3" />
        <text y={5} textAnchor="middle" fill={C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.1em" }}>
          XRPL
        </text>
      </g>

      {/* DEX node with mini book */}
      <g transform={`translate(${dx.x},${dx.y}) scale(${s * b(2)})`} opacity={o}>
        {hit("dex") > 0 && <circle r={60} fill="url(#glow-warn)" opacity={fx} />}
        <rect x={-46} y={-26} width={92} height={52} fill={C.paper} stroke={hit("dex") ? C.warn : C.ink} strokeWidth={hit("dex") ? 2 : 1.2} />
        {Array.from({ length: 6 }, (_, i) => {
          const consumed = risk === 1 ? clamp(fx * 6 - i) : 0;
          const thin = risk === 1 ? lerp(1, 0.3, fx) : 1;
          return <rect key={i} x={-38 + i * 13} y={18 - (10 + i * 5) * thin} width={9} height={(10 + i * 5) * thin} fill={consumed > 0.5 ? C.warn : C.accent} opacity={0.7} />;
        })}
        <Label x={0} y={44} anchor="middle" color={hit("dex") ? C.warn : C.ink} size={10}>
          {L.dex}
        </Label>
      </g>

      {/* market price */}
      <g transform={`translate(${mk.x},${mk.y}) scale(${s * b(3)})`} opacity={o}>
        <rect x={-80} y={-30} width={160} height={60} fill={C.paper} stroke={hit("market") ? C.warn : C.ink} strokeWidth={hit("market") ? 2 : 1} />
        <path d={spark} fill="none" stroke={hit("market") ? C.warn : C.ink} strokeWidth={1.4} />
        <Label x={0} y={-38} anchor="middle" color={hit("market") ? C.warn : C.ink} size={10}>
          {L.market}
        </Label>
      </g>

      {/* validators */}
      <g transform={`translate(${va.x},${va.y}) scale(${s * b(3.4)})`} opacity={o}>
        {hit("vals") > 0 && <circle r={86} fill="url(#glow-warn)" opacity={fx} />}
        <circle r={48} fill="none" stroke={C.line} strokeDasharray="2 4" />
        {Array.from({ length: 10 }, (_, i) => {
          const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
          const off = i < offline;
          return <circle key={i} cx={Math.cos(a) * 48} cy={Math.sin(a) * 48} r={7} fill={off ? C.paper : C.ink} stroke={off ? C.warn : C.ink} strokeDasharray={off ? "2 2" : undefined} opacity={off ? lerp(1, 0.6, fx) : 1} />;
        })}
        <Label x={0} y={78} anchor="middle" color={hit("vals") ? C.warn : C.ink} size={10}>
          {L.validators}
        </Label>
      </g>

      {/* contextual readouts */}
      <g opacity={o * fx}>
        {(risk === 0 || risk === 1) && (
          <g transform="translate(70,120)">
            <Label x={0} y={0} color={C.ink}>
              {R.price}: 1 XRP ≈ {fmt(rate, 2, locale)} MXN
            </Label>
            <Label x={0} y={18} color={risk === 0 ? C.mute : C.warn}>
              {R.cost} ≈ {fmt(cost, 1, locale)}%
            </Label>
            <Label x={0} y={36} size={9.5}>
              {t.ui.illustrative}
            </Label>
          </g>
        )}
        {risk === 2 && (
          <Label x={is.x} y={is.y - 38} anchor="middle" color={C.warn}>
            IOU ≠ XRP
          </Label>
        )}
        {risk === 3 && (
          <g transform={`translate(${P.border},560)`}>
            <rect x={-6} y={-60 * gate} width={12} height={120 * gate} fill="url(#hatch-warn)" stroke={C.warn} />
            <Label x={14} y={-70} color={C.warn}>
              {R.blocked}
            </Label>
          </g>
        )}
        {risk === 4 && (
          <g>
            <Label x={co.x} y={co.y - 66} anchor="middle" color={C.accent}>
              ✓ {R.settled}
            </Label>
            <Label x={pa.x} y={pa.y - 40} anchor="middle" color={C.warn}>
              {R.offline}
            </Label>
            <Label x={pa.x + 20} y={pa.y + 70} anchor="middle" color={C.warn}>
              … {R.waiting}
            </Label>
          </g>
        )}
      </g>
    </g>
  );
}
