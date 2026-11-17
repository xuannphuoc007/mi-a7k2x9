"use client";
import { useMemo } from "react";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useTween } from "@/hooks/useTween";
import { useI18n } from "@/lib/i18n";
import { clamp, fmt, lerp, smooth, useStore } from "@/lib/store";
import { dexStore } from "@/lib/simStores";
import { buildBook, walkBook, ammBuy, ammReserves, MID, LEVELS } from "@/simulations/liquiditySimulator";
import { C, DrawPath, Label } from "../svg";
import { BOOK_AXIS_Y as BASE } from "./BridgeScene";

const IDX = 6;
const COLW = 30;
const STEP = 38;
const MAXH = 290;
const ISO = { x: 9, y: -7 };
/** chapter 8 supply ring centre/radius (AMM pool vessel morphs into it) */
export const SUPPLY = { x: 500, y: 470, r: 300 };
const POOL = { x: 780, y: 200, r: 56 };
/** chapter 8 (RWA) issuer vault — the pool shrinks into it on exit */
const POOL_EXIT = { x: 330, y: 485, r: 46 };

export default function DexScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.dex;
  const dex = useStore(dexStore, (s) => s);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, axis: 0, buys: 0, sells: 0, match: 0, levels: 0, morph: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.05, ease: "none" }, at(-0.04))
        .to(v, { axis: 1, duration: 0.14 }, at(-0.04))
        .to(v, { buys: 1, duration: 0.14, ease: "none" }, at(0.04))
        .to(v, { sells: 1, duration: 0.14, ease: "none" }, at(0.14))
        .to(v, { match: 1, duration: 0.16 }, at(0.26))
        .to(v, { levels: 1, duration: 0.14 }, at(0.42))
        .to(v, { morph: 1, duration: 0.2 }, at(0.72))
        .to(v, { exit: 1, duration: 0.22 }, at(0.96))
        .to(v, { vis: 0, duration: 0.05, ease: "none" }, at(1.16));
    },
  );
  const forced = dex.mode === "book" ? 0 : dex.mode === "amm" ? 1 : -1;
  const morphT = useTween(forced < 0 ? (v.morph > 0.5 ? 1 : 0) : forced, 0.7);
  const book = useMemo(() => buildBook(dex.liquidity), [dex.liquidity]);
  const fill = useMemo(() => walkBook(book.asks, dex.size), [book, dex.size]);
  const amm = useMemo(() => ammBuy(dex.liquidity, dex.size), [dex.liquidity, dex.size]);
  const norm = useMemo(() => buildBook(1.6).asks[LEVELS - 1].size, []);

  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const morph = forced < 0 ? smooth(v.morph) : clamp(morphT);
  const interactive = v.levels > 0.95; // panel results only shown once the narrative has built the book
  const showBookFill = interactive && morph < 0.5;
  const showAmm = morph > 0.02;
  const colO = (1 - morph) * (1 - ex);
  const wobble = (i: number) => 1 + Math.sin(i * 1.9 + v.levels * 6) * 0.18 * v.levels * (1 - v.levels);

  const col = (side: "bid" | "ask", i: number, size: number) => {
    const grow = side === "bid" ? clamp(v.buys * LEVELS - i) : clamp(v.sells * LEVELS - i);
    const matchCut = side === "ask" && i < 2 ? (1 - Math.sin(clamp(v.match) * Math.PI) * (i === 0 ? 0.85 : 0.4)) : 1;
    const h = Math.min(MAXH * 1.3, (size / norm) * MAXH) * smooth(grow) * matchCut * wobble(i) * lerp(1, 0.25, morph);
    const cx = side === "bid" ? 490 - (i + 0.5) * STEP : 510 + (i + 0.5) * STEP;
    const x = cx - COLW / 2;
    const y = BASE - h;
    const color = side === "bid" ? C.accent : C.warn;
    const consumed = side === "ask" && showBookFill ? fill.perLevel[i] / book.asks[i].size : 0;
    return (
      <g key={`${side}${i}`} opacity={grow > 0 ? 1 : 0}>
        {/* iso side + top */}
        <path d={`M${x + COLW},${y} l${ISO.x},${ISO.y} v${h} l${-ISO.x},${-ISO.y} Z`} fill={color} opacity={0.35} />
        <path d={`M${x},${y} l${ISO.x},${ISO.y} h${COLW} l${-ISO.x},${-ISO.y} Z`} fill={color} opacity={0.55} />
        <rect x={x} y={y} width={COLW} height={h} fill={C.paper} stroke={C.ink} strokeWidth={0.9} />
        <rect x={x} y={y} width={COLW} height={h} fill={color} opacity={0.22} />
        {consumed > 0 && <rect x={x} y={y} width={COLW} height={h * consumed} fill="url(#hatch-warn)" stroke={C.warn} strokeWidth={1.2} />}
      </g>
    );
  };

  // AMM curve in reserve space
  const { x: x0, y: y0 } = ammReserves(dex.liquidity);
  const k = x0 * y0;
  const X0 = 0.25 * x0, X1 = 2.2 * x0;
  const Ymax = k / X0;
  const sx = (x: number) => 130 + ((x - X0) / (X1 - X0)) * 740;
  const sy = (y: number) => BASE - (y / Ymax) * 330;
  const curve = buildCurve(X0, X1, k, sx, sy);
  const p0 = { x: sx(x0), y: sy(y0) };
  const p1 = amm.complete ? { x: sx(amm.x2), y: sy(amm.y2) } : p0;

  // pool vessel → supply ring on exit
  const pool = { x: lerp(POOL.x, POOL_EXIT.x, ex), y: lerp(POOL.y, POOL_EXIT.y, ex), r: lerp(POOL.r, POOL_EXIT.r, ex) };
  const xrpShare = amm.complete && interactive && morph > 0.5 ? amm.x2 / (amm.x2 + amm.y2 / MID) : 0.5;

  return (
    <g opacity={v.vis}>
      {/* axis */}
      <g opacity={smooth(v.axis) * (1 - ex)}>
        <line x1={110} y1={BASE} x2={890} y2={BASE} stroke={C.ink} strokeWidth={1} />
        <line x1={500} y1={BASE + 8} x2={500} y2={BASE - 360} stroke={C.line} strokeDasharray="2 4" />
        <Label x={500} y={BASE + 26} anchor="middle" color={C.ink} size={10}>
          {fmt(MID, 3, locale)} · mid
        </Label>
        <Label x={110} y={BASE + 46} opacity={colO}>
          {L.price}
        </Label>
        <Label x={300} y={BASE + 26} anchor="middle" color={C.accent} opacity={colO}>
          {L.bids}
        </Label>
        <Label x={700} y={BASE + 26} anchor="middle" color={C.warn} opacity={colO}>
          {L.asks}
        </Label>
      </g>

      {/* columns */}
      <g opacity={colO}>
        {book.bids.map((l, i) => col("bid", i, l.size))}
        {book.asks.map((l, i) => col("ask", i, l.size))}
      </g>

      {/* match spark */}
      {v.match > 0 && v.match < 1 && (
        <g transform={`translate(500,${BASE - 120})`} opacity={Math.sin(v.match * Math.PI) * (1 - morph)}>
          <circle r={10 + v.match * 40} fill="url(#glow)" />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const r1 = 8 + v.match * 18, r2 = 14 + v.match * 34;
            return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={C.accent} strokeWidth={1.4} />;
          })}
          <Label x={0} y={-56} anchor="middle" color={C.ink}>
            {L.match}
          </Label>
        </g>
      )}
      <g opacity={clamp(v.match * 3) * (1 - morph) * (1 - ex)}>
        <Label x={500} y={BASE - 380} anchor="middle" color={C.ink}>
          {L.spread}
        </Label>
      </g>

      {/* AMM */}
      {showAmm && (
        <g opacity={(1 - ex) * clamp(morph * 1.5)}>
          <DrawPath d={curve} p={morph} width={1.8} color={C.accent} />
          <Label x={sx(X1) - 4} y={sy(k / X1) - 12} anchor="end" color={C.accent} size={12}>
            {L.curve}
          </Label>
          <Label x={130} y={sy(Ymax) - 8} size={9.5}>
            USD ↑
          </Label>
          <Label x={870} y={BASE + 46} anchor="end" size={9.5}>
            XRP →
          </Label>
          <circle cx={p0.x} cy={p0.y} r={6} fill={C.paper} stroke={C.ink} strokeWidth={1.4} />
          {interactive && amm.complete && (
            <g>
              <path d={`M${p0.x},${p0.y} L${p1.x},${p1.y}`} stroke={C.warn} strokeWidth={2} strokeDasharray="3 3" />
              <circle cx={p1.x} cy={p1.y} r={6} fill={C.warn} stroke={C.ink} />
              <line x1={p0.x} y1={p0.y} x2={p0.x} y2={BASE} stroke={C.line} strokeDasharray="2 3" />
              <line x1={p1.x} y1={p1.y} x2={p1.x} y2={BASE} stroke={C.line} strokeDasharray="2 3" />
            </g>
          )}
        </g>
      )}

      {/* pool vessel */}
      <g transform={`translate(${pool.x},${pool.y})`} opacity={clamp(morph * 2) * (ex > 0.9 ? 1 - (ex - 0.9) * 10 : 1)}>
        <circle r={pool.r} fill={C.paper} stroke={C.ink} strokeWidth={1.3} />
        <path
          d={`M0,${-pool.r} A${pool.r},${pool.r} 0 0 0 0,${pool.r} Z`}
          fill={C.accent}
          opacity={0.75}
          transform={`scale(${lerp(0.4, 1.6, xrpShare)},1)`}
          style={{ transition: "transform .4s" }}
        />
        <Label x={-pool.r * 0.5} y={4} anchor="middle" color={C.paper} size={10} opacity={1 - ex}>
          XRP
        </Label>
        <Label x={pool.r * 0.5} y={4} anchor="middle" color={C.ink} size={10} opacity={1 - ex}>
          USD
        </Label>
        <Label x={0} y={pool.r + 20} anchor="middle" color={C.ink} opacity={1 - ex}>
          {L.pool}
        </Label>
        <Label x={0} y={pool.r + 36} anchor="middle" size={9.5} opacity={1 - ex}>
          {L.lp}
        </Label>
      </g>

      {/* results readout */}
      {interactive && (
        <g transform="translate(110,120)" opacity={1 - ex}>
          <Label x={0} y={0} color={C.ink}>
            {morph < 0.5 ? t.panels.dex.book : t.panels.dex.amm} · {fmt(dex.size, 0, locale)} XRP
          </Label>
          {morph < 0.5 ? (
            fill.complete ? (
              <>
                <Label x={0} y={20} upper={false} spacing="0" color={C.ink} size={11}>
                  {t.panels.dex.avg} ${fmt(fill.avg, 3, locale)} · +{fmt(fill.slippagePct, 2, locale)}%
                </Label>
              </>
            ) : (
              <Label x={0} y={20} color={C.warn}>
                {t.panels.dex.insufficient}
              </Label>
            )
          ) : amm.complete ? (
            <Label x={0} y={20} upper={false} spacing="0" color={C.ink} size={11}>
              {t.panels.dex.avg} ${fmt(amm.avg, 3, locale)} · +{fmt(amm.slippagePct, 2, locale)}%
            </Label>
          ) : null}
          <Label x={0} y={40} size={9.5}>
            {t.ui.illustrative}
          </Label>
        </g>
      )}
      <Label x={940} y={BASE + 46} anchor="end" size={9.5} opacity={colO * clamp(v.axis)}>
        {L.size} ↑
      </Label>
    </g>
  );
}

function buildCurve(X0: number, X1: number, k: number, sx: (x: number) => number, sy: (y: number) => number) {
  let d = "";
  for (let i = 0; i <= 80; i++) {
    const x = X0 + ((X1 - X0) * i) / 80;
    d += `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(k / x).toFixed(1)}`;
  }
  return d;
}

