"use client";
import { useMemo } from "react";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth, useStore } from "@/lib/store";
import { routeStore } from "@/lib/simStores";
import { MAP, dotPath, mxPoly, polyPath, project, usPoly, type Pt } from "@/data/coins/xrp/layouts";
import { C, DrawPath, Label, along, mix } from "../svg";

const IDX = 4;
/** chapter 6 asset node positions — chips morph into these on exit */
export const BRIDGE_NODES = { usd: { x: 210, y: 640 }, xrp: { x: 500, y: 290 }, mxn: { x: 790, y: 640 } };

const curve = (a: Pt, b: Pt, bend = 0.18) => {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  return `M${a.x},${a.y} Q${mx - dy * bend},${my + dx * bend} ${b.x},${b.y}`;
};

export default function MapScene() {
  const { t } = useI18n();
  const L = t.scenes.map;
  const mode = useStore(routeStore, (s) => s.mode);
  const dots = useMemo(() => ({ us: dotPath(usPoly, 12.5), mx: dotPath(mxPoly, 12.5), usOutline: polyPath(usPoly), mxOutline: polyPath(mxPoly) }), []);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, map: 0, origin: 0, route: 0, convert: 0, bridge: 0, deliver: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.08, ease: "none" }, at(-0.06))
        .to(v, { map: 1, duration: 0.24 }, at(-0.06))
        .to(v, { origin: 1, duration: 0.1 }, at(0.12))
        .to(v, { route: 1, duration: 0.18 }, at(0.22))
        .to(v, { convert: 1, duration: 0.12 }, at(0.38))
        .to(v, { bridge: 1, duration: 0.1 }, at(0.48))
        .to(v, { deliver: 1, duration: 0.16 }, at(0.58))
        .to(v, { exit: 1, duration: 0.22 }, at(0.96))
        .to(v, { vis: 0, duration: 0.05, ease: "none" }, at(1.16));
    },
  );
  if (v.vis <= 0.001) return null;

  const ex = smooth(v.exit);
  const mapO = smooth(v.map) * (1 - ex);

  // Route B (XRPL-enabled)
  const B = [MAP.sender, MAP.onramp, MAP.xrpl, MAP.offramp, MAP.recipient];
  // Route A (correspondent banking)
  const A = [MAP.sender, project(-74.0, 40.7), project(-80.2, 25.8), project(-99.1, 19.4), MAP.recipient];
  const route = mode === "A" ? A : B;
  const names = mode === "A" ? [L.senderBank, L.corrUS, L.nostro, L.corrMX, L.recipientBank] : [L.sender, L.onramp, L.xrpl, L.offramp, L.recipient];

  const LBL: { dx: number; dy: number; a: "start" | "middle" | "end" }[] =
    mode === "A"
      ? [{ dx: 0, dy: 34, a: "middle" }, { dx: 0, dy: -24, a: "middle" }, { dx: 22, dy: 4, a: "start" }, { dx: 22, dy: 4, a: "start" }, { dx: -16, dy: 32, a: "end" }]
      : [{ dx: 0, dy: 34, a: "middle" }, { dx: 0, dy: -28, a: "middle" }, { dx: 32, dy: 4, a: "start" }, { dx: 18, dy: -16, a: "start" }, { dx: -16, dy: 32, a: "end" }];
  const segP = (k: number) => clamp(v.route * 4 - k);
  const delivered = smooth(v.deliver);
  const coin = along(route, lerp(0, 0.5, smooth(v.route)) + delivered * 0.5);

  // chips at the XRPL node
  const chipBase = { x: MAP.xrpl.x, y: MAP.xrpl.y + 70 };
  const chips = [
    { k: "USD", at: { x: chipBase.x - 70, y: chipBase.y }, to: BRIDGE_NODES.usd, show: smooth(v.convert) },
    { k: "XRP", at: { x: chipBase.x, y: chipBase.y - 6 }, to: BRIDGE_NODES.xrp, show: smooth(v.bridge) },
    { k: "MXN", at: { x: chipBase.x + 70, y: chipBase.y }, to: BRIDGE_NODES.mxn, show: smooth(v.convert) },
  ];

  return (
    <g opacity={v.vis}>
      {/* map */}
      <g opacity={mapO}>
        <path d={dots.us} stroke={C.ink} strokeWidth={3.4} strokeLinecap="round" opacity={0.28} />
        <path d={dots.mx} stroke={C.accent} strokeWidth={3.4} strokeLinecap="round" opacity={0.42} />
        <DrawPath d={dots.usOutline} p={v.map} width={0.8} color={C.ink} opacity={0.5} />
        <DrawPath d={dots.mxOutline} p={v.map} width={0.8} color={C.ink} opacity={0.5} />
        {/* graticule */}
        {[-120, -110, -100, -90, -80, -70].map((lon) => {
          const a = project(lon, 50), b = project(lon, 14);
          return <line key={lon} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.line} strokeWidth={0.5} strokeDasharray="1 5" />;
        })}
        {[20, 30, 40].map((lat) => {
          const a = project(-126, lat), b = project(-65, lat);
          return (
            <g key={lat}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.line} strokeWidth={0.5} strokeDasharray="1 5" />
              <Label x={a.x} y={a.y - 4} size={8.5}>
                {lat}°N
              </Label>
            </g>
          );
        })}
        <Label x={project(-112, 43).x} y={project(-112, 43).y} color={C.ink} size={12}>
          {L.us}
        </Label>
        <Label x={project(-108, 24).x} y={project(-108, 24).y} color={C.accent} size={12}>
          {L.mx}
        </Label>
      </g>

      {/* route */}
      <g opacity={1 - ex}>
        {route.slice(0, -1).map((p, k) => {
          const q = route[k + 1];
          const onLedger = mode === "B" && (k === 1 || k === 2);
          return (
            <g key={`${mode}${k}`}>
              <DrawPath d={curve(p, q)} p={segP(k)} width={onLedger ? 3 : 1.6} color={onLedger ? C.accent : C.ink} />
              {mode === "A" && <DrawPath d={curve(p, q)} p={segP(k)} width={7} color={C.ink} opacity={0.06} />}
            </g>
          );
        })}
        {route.map((p, k) => {
          const show = clamp(v.origin * 2 - (k === 0 ? 0 : 1) + segP(k - 1));
          const isLedger = mode === "B" && k === 2;
          return (
            <g key={`n${mode}${k}`} transform={`translate(${p.x},${p.y})`} opacity={clamp(show)}>
              {isLedger ? (
                <g>
                  <circle r={22} fill={C.paper} stroke={C.accent} strokeWidth={1.8} />
                  <circle r={14} fill="none" stroke={C.accent} strokeDasharray="2 3" />
                  <text y={4} textAnchor="middle" fill={C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em" }}>
                    XRPL
                  </text>
                </g>
              ) : mode === "A" && k > 0 && k < 4 ? (
                <g>
                  <rect x={-12} y={-12} width={24} height={24} fill={C.paper} stroke={C.ink} strokeWidth={1.3} />
                  <path d="M-8,-3 L0,-9 L8,-3 M-6,-2 V6 M-2,-2 V6 M2,-2 V6 M6,-2 V6 M-9,8 H9" stroke={C.ink} fill="none" strokeWidth={0.9} />
                </g>
              ) : (
                <g>
                  <circle r={9} fill={k === 0 || k === 4 ? C.ink : C.paper} stroke={C.ink} strokeWidth={1.3} />
                  {(k === 0 || k === 4) && <circle r={16} fill="none" stroke={C.ink} strokeWidth={0.6} />}
                </g>
              )}
              <Label x={LBL[k].dx} y={LBL[k].dy} anchor={LBL[k].a} color={isLedger ? C.accent : C.ink} size={10}>
                {names[k]}
              </Label>
            </g>
          );
        })}
        {/* moving value */}
        {v.route > 0.02 && delivered < 0.99 && (
          <g transform={`translate(${coin.x},${coin.y})`}>
            <circle r={16} fill="url(#glow)" />
            <circle r={5} fill={C.accent} stroke={C.ink} strokeWidth={0.8} />
          </g>
        )}
        {/* delivered stamp */}
        <g transform={`translate(${MAP.recipient.x - 10},${MAP.recipient.y + 58})`} opacity={delivered}>
          <rect x={-60} y={-16} width={120} height={26} fill={C.paper} stroke={C.accent} />
          <Label x={0} y={1} anchor="middle" color={C.accent} size={10}>
            MXN ✓ {t.scenes.bridge.delivered}
          </Label>
        </g>
        {/* finality brackets */}
        {mode === "B" && (
          <g opacity={delivered}>
            <path d={`M${MAP.onramp.x + 8},${MAP.onramp.y + 140} h-6 v20 h${MAP.offramp.x - MAP.onramp.x} v-20 h-6`} fill="none" stroke={C.accent} strokeWidth={0.9} opacity={0} />
            <Label x={MAP.xrpl.x + 32} y={MAP.xrpl.y + 20} color={C.accent} size={9.5}>
              ← {L.ledgerLeg}
            </Label>
            <Label x={MAP.sender.x - 140} y={MAP.sender.y + 64} size={9.5}>
              {L.fiatLeg}
            </Label>
          </g>
        )}
        {mode === "A" && (
          <Label x={project(-79, 31).x} y={project(-79, 31).y} size={9.5} opacity={segP(2)}>
            {L.nostro}
          </Label>
        )}
      </g>

      {/* conversion chips → bridge nodes */}
      {mode === "B" &&
        chips.map((c) => {
          const p = mix(c.at, c.to, ex);
          const s = lerp(1, 2.6, ex);
          return (
            <g key={c.k} transform={`translate(${p.x},${p.y}) scale(${s})`} opacity={c.show * (1 - clamp((v.exit - 0.85) * 8)) * (1 - delivered * 0.4 * (1 - ex))}>
              <rect x={-24} y={-11} width={48} height={22} rx={11} fill={c.k === "XRP" ? C.accent : C.paper} stroke={C.ink} strokeWidth={1} />
              <text y={4} textAnchor="middle" fill={c.k === "XRP" ? C.paper : C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600 }}>
                {c.k}
              </text>
            </g>
          );
        })}
      {mode === "B" && (
        <g opacity={smooth(v.convert) * (1 - ex)}>
          <Label x={chipBase.x} y={chipBase.y + 34} anchor="middle" size={9.5}>
            {L.conversion} {v.bridge > 0.5 ? `· ${L.bridge}` : ""}
          </Label>
          <line x1={chipBase.x - 44} y1={chipBase.y} x2={chipBase.x - 26} y2={chipBase.y} stroke={C.ink} markerEnd="" />
          <line x1={chipBase.x + 26} y1={chipBase.y} x2={chipBase.x + 44} y2={chipBase.y} stroke={C.ink} />
        </g>
      )}
    </g>
  );
}
