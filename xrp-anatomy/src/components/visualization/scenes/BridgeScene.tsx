"use client";
import { chapterIndex } from "@/data/coins/xrp/chapters";
import { useMemo } from "react";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useI18n } from "@/lib/i18n";
import { clamp, fmt, lerp, smooth, useStore } from "@/lib/store";
import { liquidityStore } from "@/lib/simStores";
import { route } from "@/simulations/paymentRouter";
import { C, DrawPath, Label } from "../svg";
import { BRIDGE_NODES as N } from "./MapScene";

const IDX = chapterIndex("bridge");
/** chapter 7 baselines the channels flatten into */
export const BOOK_AXIS_Y = 560;

const quad = (a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }) => `M${a.x},${a.y} Q${c.x},${c.y} ${b.x},${b.y}`;

export default function BridgeScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.bridge;
  const params = useStore(liquidityStore, (s) => s);
  const r = useMemo(() => route(params), [params]);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, nodes: 0, direct: 0, bridge: 0, flow: 0, deliver: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.06, ease: "none" }, at(-0.04))
        .to(v, { nodes: 1, duration: 0.12 }, at(-0.04))
        .to(v, { direct: 1, duration: 0.2 }, at(0.06))
        .to(v, { bridge: 1, duration: 0.24 }, at(0.3))
        .to(v, { flow: 1, duration: 0.2 }, at(0.6))
        .to(v, { deliver: 1, duration: 0.12 }, at(0.84))
        .to(v, { exit: 1, duration: 0.22 }, at(0.96))
        .to(v, { vis: 0, duration: 0.05, ease: "none" }, at(1.16));
    },
  );
  if (v.vis <= 0.001) return null;

  const ex = smooth(v.exit);
  // channel paths flatten into the order-book baseline on exit
  const dA = { x: lerp(N.usd.x, 140, ex), y: lerp(N.usd.y, BOOK_AXIS_Y, ex) };
  const dB = { x: lerp(N.mxn.x, 490, ex), y: lerp(N.mxn.y, BOOK_AXIS_Y, ex) };
  const dC = { x: lerp(500, 315, ex), y: lerp(800, BOOK_AXIS_Y, ex) };
  const bA = { x: lerp(N.usd.x, 510, ex), y: lerp(N.usd.y, BOOK_AXIS_Y, ex) };
  const bB = { x: lerp(N.mxn.x, 860, ex), y: lerp(N.mxn.y, BOOK_AXIS_Y, ex) };
  const bX = { x: lerp(N.xrp.x, 685, ex), y: lerp(N.xrp.y, BOOK_AXIS_Y, ex) };

  const shareDirect = r.best === "direct" ? 1 : r.best === "bridge" ? 0 : r.splitDirectShare;
  const flow = smooth(v.flow);
  const wDirect = lerp(lerp(2, 2 + Math.sqrt(params.directDepthUsd / 1000) * 1.1, 1), 1, ex);
  const wBridge = lerp(lerp(3, 3 + Math.sqrt(Math.min(params.leg1DepthUsd, params.leg2DepthUsd) / 1000) * 0.9, 1), 1, ex);
  const directPath = quad(dA, dC, dB);
  const bridgePath = `M${bA.x},${bA.y} L${bX.x},${bX.y} L${bB.x},${bB.y}`;
  const directActive = shareDirect > 0.02;
  const bridgeActive = shareDirect < 0.98;
  const nodesO = smooth(v.nodes) * (1 - ex);

  return (
    <g opacity={v.vis}>
      {/* depth envelopes */}
      <DrawPath d={directPath} p={v.direct} width={Math.min(40, wDirect)} color={C.ink} opacity={0.1} cap="butt" />
      <DrawPath d={bridgePath} p={v.bridge} width={Math.min(46, wBridge)} color={C.accent} opacity={0.16} cap="butt" />
      {/* centre lines */}
      <DrawPath d={directPath} p={v.direct} width={1} color={C.ink} />
      <DrawPath d={bridgePath} p={v.bridge} width={1.2} color={C.accent} />
      {/* animated flow proportional to the preferred split */}
      {flow > 0 && ex < 0.9 && (
        <g opacity={flow}>
          {directActive && (
            <path d={directPath} fill="none" stroke={C.ink} strokeWidth={lerp(1.5, 8, shareDirect)} className="flow" strokeLinecap="round" opacity={0.85} />
          )}
          {bridgeActive && (
            <path d={bridgePath} fill="none" stroke={C.accent} strokeWidth={lerp(1.5, 9, 1 - shareDirect)} className="flow" strokeLinecap="round" />
          )}
        </g>
      )}

      {/* labels on channels */}
      <g opacity={(1 - ex) * clamp(v.direct * 2 - 0.6)}>
        <Label x={500} y={790} anchor="middle" color={C.ink}>
          {L.direct}
        </Label>
        <Label x={500} y={808} anchor="middle" size={9.5}>
          {L.depth} ${fmt(params.directDepthUsd / 1000, 0, locale)}k · {fmt(r.direct, 0, locale)} MXN
        </Label>
      </g>
      <g opacity={(1 - ex) * clamp(v.bridge * 2 - 0.8)}>
        <Label x={300} y={430} anchor="end" color={C.accent}>
          {L.viaXrp}
        </Label>
        <Label x={300} y={448} anchor="end" size={9.5}>
          ${fmt(params.leg1DepthUsd / 1000, 0, locale)}k · ${fmt(params.leg2DepthUsd / 1000, 0, locale)}k
        </Label>
        <Label x={300} y={464} anchor="end" size={9.5}>
          {fmt(r.bridge, 0, locale)} MXN
        </Label>
      </g>

      {/* asset nodes */}
      {(
        [
          ["usd", "USD", "token", N.usd],
          ["xrp", "XRP", "native", N.xrp],
          ["mxn", "MXN", "token", N.mxn],
        ] as const
      ).map(([k, sym, kind, p]) => (
        <g key={k} transform={`translate(${p.x},${p.y})`} opacity={nodesO}>
          <circle r={k === "xrp" ? 52 : 46} fill={k === "xrp" ? C.accent : C.paper} stroke={C.ink} strokeWidth={1.4} />
          <circle r={k === "xrp" ? 60 : 54} fill="none" stroke={C.ink} strokeWidth={0.6} strokeDasharray="1 4" />
          <text y={4} textAnchor="middle" fill={k === "xrp" ? C.paper : C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: 26 }}>
            {sym}
          </text>
          <Label x={0} y={22} anchor="middle" color={k === "xrp" ? C.paper : C.mute} size={9}>
            {kind}
          </Label>
        </g>
      ))}

      {/* delivered */}
      <g transform={`translate(${N.mxn.x},${N.mxn.y + 92})`} opacity={smooth(v.deliver) * (1 - ex)}>
        <rect x={-92} y={-18} width={184} height={46} fill={C.paper} stroke={C.accent} />
        <Label x={0} y={-2} anchor="middle" color={C.accent} size={9.5}>
          {L.delivered} · {r.best === "split" ? t.panels.liquidity.split : r.best === "bridge" ? t.panels.liquidity.bridge_only : t.panels.liquidity.direct_only}
        </Label>
        <Label x={0} y={16} anchor="middle" color={C.ink} size={11} upper={false} spacing="0">
          {fmt(r.bestOut, 2, locale)} MXN
        </Label>
      </g>
      <g transform={`translate(${N.usd.x},${N.usd.y + 92})`} opacity={smooth(v.nodes) * (1 - ex)}>
        <Label x={0} y={0} anchor="middle" color={C.ink} size={11} upper={false} spacing="0">
          {fmt(params.amountUsd, 0, locale)} USD
        </Label>
      </g>
      <Label x={60} y={118} opacity={nodesO}>
        {t.ui.illustrative}
      </Label>
    </g>
  );
}
