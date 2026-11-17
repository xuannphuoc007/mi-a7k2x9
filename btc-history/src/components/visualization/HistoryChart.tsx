"use client";
/**
 * The price-history chart that fills the stage. Paths are built once in data
 * space (year, log10 price) and placed with a single matrix transform, so the
 * camera can pan/zoom every frame for the cost of one attribute.
 */
import { useMemo, useRef } from "react";
import { burstQ, chart, focusEvent, visibleEvent, X0, X1, YT, YB, BASE_Y, type Frame } from "@/animations/chartController";
import { events, HALVINGS, type BtcEvent } from "@/data/coins/btc/events";
import { FINALE } from "@/data/coins/btc/chapters";
import { LOG_PATH, LOG_AREA, LIN_PATH, LIN_AREA, DD_PATH, DD_AREA, HASH_PATH, SUPPLY_PATH, HALVING_TIMES, FIRST_T, LAST_T, priceAt, hashAt, fmtMonth } from "@/lib/btc";
import { clamp, lerp, range, smooth, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { GenesisOverlay } from "./overlays/GenesisOverlay";
import { DominoOverlay } from "./overlays/DominoOverlay";

const ORANGE = "var(--color-accent)";
const GOLD = "var(--color-gold)";
const WARN = "var(--color-warn)";
const INK = "var(--color-ink)";
const MUTE = "var(--color-mute)";
const LINE = "var(--color-line)";

export function shortPrice(p: number) {
  if (p >= 1e6) return `$${+(p / 1e6).toFixed(1)}M`;
  if (p >= 1e3) return `$${+(p / 1e3).toFixed(p >= 1e4 ? 0 : 1)}K`;
  if (p >= 1) return `$${+p.toFixed(1)}`;
  return `$${+p.toPrecision(1)}`;
}

function logTicks(p0: number, p1: number) {
  const out: number[] = [];
  for (let k = Math.floor(Math.log10(p0)) - 1; k <= Math.ceil(Math.log10(p1)); k++)
    for (const m of [1, 2, 5]) {
      const v = m * 10 ** k;
      if (v >= p0 * 1.02 && v <= p1 / 1.02) out.push(v);
    }
  if (out.length <= 8) return out;
  const decades = out.filter((v) => Math.abs(Math.log10(v) - Math.round(Math.log10(v))) < 1e-6);
  return decades.length > 8 ? decades.filter((_, i) => i % 2 === 0) : decades;
}
function niceStep(raw: number) {
  const e = 10 ** Math.floor(Math.log10(raw));
  const f = raw / e;
  return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * e;
}
function timeTicks(t0: number, t1: number, mobile = false) {
  const span = t1 - t0;
  const out: { t: number; major: boolean }[] = [];
  if (span > 2.4) {
    const step = span > 80 ? 20 : span > 40 ? 10 : mobile ? (span > 14 ? 4 : span > 6 ? 2 : 1) : span > 14 ? 2 : 1;
    for (let y = Math.ceil(t0); y <= t1; y++) if (y % step === 0) out.push({ t: y, major: true });
  } else {
    const months = span > 1.2 ? 3 : 2;
    for (let y = Math.floor(t0); y <= Math.ceil(t1); y++)
      for (let m = 0; m < 12; m += months) {
        const t = y + m / 12;
        if (t >= t0 && t <= t1) out.push({ t, major: m === 0 });
      }
  }
  return out;
}

const kindColor = (e: BtcEvent) =>
  e.kind === "crash" || (e.kind === "macro" && e.cat === "crisis") ? WARN : e.kind === "ath" ? GOLD : ORANGE;

function Marker({ e, x, y, r, selected, onPick, q }: { e: BtcEvent; x: number; y: number; r: number; selected: boolean; onPick: () => void; q: number }) {
  const c = kindColor(e);
  const shape =
    e.kind === "crash" ? (
      <rect x={-r} y={-r} width={r * 2} height={r * 2} transform="rotate(45)" fill={c} stroke="var(--color-paper)" strokeWidth={r * 0.35} />
    ) : e.kind === "ath" ? (
      <path d={`M0,${-r * 1.35} L${r * 1.2},${r * 0.8} L${-r * 1.2},${r * 0.8}Z`} fill={c} stroke="var(--color-paper)" strokeWidth={r * 0.3} />
    ) : e.kind === "tech" || e.kind === "halving" ? (
      <rect x={-r} y={-r} width={r * 2} height={r * 2} fill="var(--color-paper)" stroke={c} strokeWidth={r * 0.45} />
    ) : (
      <circle r={r} fill={e.kind === "macro" ? "var(--color-paper)" : c} stroke={e.kind === "macro" ? c : "var(--color-paper)"} strokeWidth={r * 0.4} />
    );
  return (
    <g
      transform={`translate(${x},${y})`}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={e.en.title}
      onClick={(ev) => {
        ev.stopPropagation();
        onPick();
      }}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          onPick();
        }
      }}
      onPointerDown={(ev) => ev.stopPropagation()}
    >
      <circle r={r * 3.2} fill="transparent" />
      {selected && (
        <>
          <circle r={r * 2.2} fill="none" stroke={c} strokeWidth={r * 0.3} className="ping" />
          <circle r={r * 2.6} fill="none" stroke={c} strokeWidth={r * 0.18} opacity={0.6} />
        </>
      )}
      <g transform={`scale(${1 + 0.6 * (1 - q) * (q > 0 ? 1 : 0)})`}>{shape}</g>
    </g>
  );
}

/** Scroll-tied burst played when the playhead crosses an event (q: 0 → 1) */
function Burst({ e, x, y, q, u }: { e: BtcEvent; x: number; y: number; q: number; u: number }) {
  if (q <= 0 || q >= 1) return null;
  const o = 1 - q;
  const c = kindColor(e);
  if (c === WARN) {
    const q2 = clamp((q - 0.18) / 0.82);
    return (
      <g transform={`translate(${x},${y})`} pointerEvents="none">
        <circle r={10 + q * 150} fill="none" stroke={WARN} strokeWidth={3 * o + 0.5} opacity={o} />
        {q2 > 0 && <circle r={8 + q2 * 100} fill="none" stroke={WARN} strokeWidth={2 * (1 - q2) + 0.4} opacity={(1 - q2) * 0.8} />}
        <circle r={30 + q * 40} fill="url(#glow-warn)" opacity={o} />
        <line x1={0} x2={0} y1={-900} y2={900} stroke={WARN} strokeWidth={1.5 * u} opacity={o * 0.5} />
      </g>
    );
  }
  if (e.kind === "ath") {
    return (
      <g transform={`translate(${x},${y})`} pointerEvents="none">
        <circle r={36 + q * 30} fill="url(#glow-gold)" opacity={o} />
        {Array.from({ length: 14 }, (_, k) => {
          const a = (k / 14) * Math.PI * 2 + 0.2;
          const r1 = 14 + q * 40;
          const r2 = 24 + q * 110 * (k % 2 ? 0.7 : 1);
          return <line key={k} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={GOLD} strokeWidth={2.4 * o + 0.4} strokeLinecap="round" opacity={o} />;
        })}
        <circle r={12 + q * 60} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={o * 0.8} />
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`} pointerEvents="none">
      <circle r={8 + q * 70} fill="none" stroke={ORANGE} strokeWidth={2 * o + 0.3} opacity={o * 0.9} />
      <circle r={20 + q * 20} fill="url(#glow)" opacity={o * 0.8} />
    </g>
  );
}

export default function HistoryChart({ f, mobile }: { f: Frame; mobile: boolean }) {
  const { t, lang } = useI18n();
  const selected = useStore(chart, (s) => s.selected);
  const filters = useStore(chart, (s) => s.filters);
  const probe = useStore(chart, (s) => s.probe);
  const invest = useStore(chart, (s) => s.invest);
  const svgRef = useRef<SVGSVGElement>(null);
  const touchTimer = useRef<number>(0);

  const { win, u, T, vis, g } = f;
  const sx = (X1 - X0) / (win.t1 - win.t0);
  const l0 = Math.log10(win.p0);
  const l1 = Math.log10(win.p1);
  const syLog = (YB - YT) / (l1 - l0);
  const logM = `matrix(${sx},0,0,${-syLog},${X0 - win.t0 * sx},${YB + l0 * syLog})`;
  const syLin = (YB - YT) / (f.linMax / 1000);
  const linM = `matrix(${sx},0,0,${-syLin},${X0 - win.t0 * sx},${YB})`;
  const ddM = `matrix(${sx},0,0,${-(YB - YT) / 100},${X0 - win.t0 * sx},${YT})`;
  const hashL0 = -6.6;
  const hashSy = (YB - YT) / 16.4;
  const hashM = `matrix(${sx},0,0,${-hashSy},${X0 - win.t0 * sx},${YB + hashL0 * hashSy})`;
  const supSy = (YB - YT) / 23;
  const supM = `matrix(${sx},0,0,${-supSy},${X0 - win.t0 * sx},${YB})`;
  const xOf = f.xOf;

  const finale = vis[FINALE];
  const axis = smooth(range(g, 0.8, 1.0));
  const supplyMix = vis[2];
  const hashMix = vis[4];
  const priceDim = 1 - 0.68 * Math.max(supplyMix, hashMix);
  const logO = (1 - f.scaleMix) * (1 - f.ddMix);
  const linO = f.scaleMix * (1 - f.ddMix);
  const ddO = f.ddMix;
  const revealX = clamp(xOf(Math.min(f.clipT, LAST_T + 0.01)), X0 - 10, X1 + 10);
  const playX = xOf(T);
  const fs = (px: number) => px * u;

  const yTicksLog = useMemo(() => logTicks(win.p0, win.p1), [win.p0, win.p1]);
  const step = niceStep(f.linMax / 5);
  const yTicksLin: number[] = [];
  for (let v = step; v < f.linMax; v += step) yTicksLin.push(v);
  const xTicks = timeTicks(win.t0, win.t1, mobile);

  const ch = f.ch;
  const span = win.t1 - win.t0;
  const visible = events.filter((e) => {
    if (e.t < win.t0 - span * 0.05 || e.t > win.t1 + span * 0.05) return false;
    const explore = ch === FINALE && f.local >= 0.55;
    if (explore && !filters[e.cat]) return false;
    if (explore) return !e.future;
    if (e.future) return ch === 2 && supplyMix > 0.2;
    return visibleEvent(e, f.clipT, ch);
  });

  const onMove = (ev: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 1000;
    const y = ((ev.clientY - rect.top) / rect.height) * 1000;
    const tt = win.t0 + (x - X0) / sx;
    if (x < X0 || x > X1 || y < YT - 40 || y > YB + 20 || tt < FIRST_T || tt > Math.min(f.clipT, LAST_T) || f.hero > 0.5) {
      if (chart.get().cursor !== null) chart.set({ cursor: null });
      return;
    }
    chart.set({ cursor: tt });
    if (ev.pointerType === "touch") {
      window.clearTimeout(touchTimer.current);
      touchTimer.current = window.setTimeout(() => chart.set({ cursor: null }), 2600);
    }
  };

  // halving vertical lines (past ones, revealed by the playhead)
  const halvingLines = span > 30 ? [] : HALVINGS.filter((h) => h.t <= f.clipT && h.t >= win.t0 && h.t <= win.t1);

  const cursorT = f.dot.t;
  const showCursor = chart.get().cursor !== null;
  const yearText = Math.floor(showCursor ? cursorT : Math.max(2008, Math.min(T, 2026.99)));

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 1000"
      className="absolute inset-0 h-full w-full select-none"
      role="img"
      aria-label={t.chapters[ch].figure}
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={(ev) => {
        if (ev.pointerType !== "touch") chart.set({ cursor: null });
      }}
      onClick={() => {
        if (selected) focusEvent(null);
      }}
    >
      <defs>
        <clipPath id="plot">
          <rect x={X0 - 2} y={YT - 60} width={X1 - X0 + 4} height={YB - YT + 62} />
        </clipPath>
        <clipPath id="reveal">
          <rect x={0} y={0} width={Math.max(0, revealX)} height={1000} />
        </clipPath>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#f7931a" stopOpacity="0.32" />
          <stop offset="70%" stopColor="#f7931a" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#f7931a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="area-dd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff5a4e" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ff5a4e" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="area-supply" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc65c" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffc65c" stopOpacity="0.02" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#f7931a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f7931a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-warn">
          <stop offset="0%" stopColor="#ff5a4e" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff5a4e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-gold">
          <stop offset="0%" stopColor="#ffc65c" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffc65c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vignette" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#f7931a" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#f7931a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={1000} height={1000} fill="url(#vignette)" />

      {/* big background year */}
      <text
        x={500}
        y={600}
        textAnchor="middle"
        className="serif"
        style={{ fontSize: 290, fontWeight: 700, letterSpacing: "-0.04em" }}
        fill={INK}
        opacity={0.045 * (1 - f.hero)}
      >
        {yearText}
      </text>

      {/* grid + axes */}
      <g opacity={axis * (0.35 + 0.65 * priceDim)}>
        <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={LINE} strokeWidth={1.2} />
        {logO > 0.01 &&
          yTicksLog.map((v) => {
            const y = f.yPrice(v);
            if (y < YT - 5 || y > YB + 1) return null;
            return (
              <g key={`l${v}`} opacity={logO}>
                <line x1={X0} x2={X1} y1={y} y2={y} stroke={LINE} strokeWidth={0.8} strokeDasharray="2 6" />
                <text x={X0 + 4} y={y - fs(5)} className="mono halo" style={{ fontSize: fs(10.5) }} fill={MUTE}>
                  {shortPrice(v)}
                </text>
              </g>
            );
          })}
        {linO > 0.01 &&
          yTicksLin.map((v) => {
            const y = YB - (v / f.linMax) * (YB - YT);
            return (
              <g key={`n${v}`} opacity={linO}>
                <line x1={X0} x2={X1} y1={y} y2={y} stroke={LINE} strokeWidth={0.8} strokeDasharray="2 6" />
                <text x={X0 + 4} y={y - fs(5)} className="mono halo" style={{ fontSize: fs(10.5) }} fill={MUTE}>
                  {shortPrice(v)}
                </text>
              </g>
            );
          })}
        {ddO > 0.01 &&
          [0, -25, -50, -75, -100].map((v) => {
            const y = YT + (-v / 100) * (YB - YT);
            return (
              <g key={`d${v}`} opacity={ddO}>
                <line x1={X0} x2={X1} y1={y} y2={y} stroke={v === 0 ? MUTE : LINE} strokeWidth={0.8} strokeDasharray={v === 0 ? undefined : "2 6"} />
                <text x={X0 + 4} y={y - fs(5)} className="mono" style={{ fontSize: fs(10.5) }} fill={v === 0 ? INK : MUTE}>
                  {v}%
                </text>
              </g>
            );
          })}
      </g>
      <g opacity={1 - f.hero}>
        {xTicks.map(({ t: tt, major }) => {
          const x = xOf(tt);
          if (x < X0 + fs(14) || x > X1 - fs(14)) return null;
          const label = major && span > 2.4 ? String(tt) : fmtMonth(tt + 0.001, lang);
          if (mobile && !major && span <= 2.4 && xTicks.length > 7) return null;
          return (
            <g key={tt}>
              <line x1={x} x2={x} y1={YB} y2={YB + fs(5)} stroke={MUTE} strokeWidth={1} />
              <text x={x} y={YB + fs(18)} textAnchor="middle" className="mono" style={{ fontSize: fs(10.5) }} fill={major ? INK : MUTE}>
                {label}
              </text>
            </g>
          );
        })}
      </g>

      <g transform={`translate(${f.shake.x},${f.shake.y})`}>
        <g clipPath="url(#plot)">
          {/* supply overlay (chapter 3) */}
          {supplyMix > 0.01 && <SupplyLayer f={f} m={supplyMix} supM={supM} supSy={supSy} mobile={mobile} />}
          {/* hashrate overlay (chapter 5) */}
          {hashMix > 0.01 && <HashLayer f={f} m={hashMix} hashM={hashM} hashL0={hashL0} hashSy={hashSy} mobile={mobile} />}

          {/* the price line: faint ghost of what's ahead, bright where history has happened */}
          <g opacity={priceDim}>
            {logO > 0.01 && (
              <g opacity={logO}>
                <path d={LOG_PATH} transform={logM} fill="none" stroke={INK} strokeOpacity={0.13} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                <g clipPath="url(#reveal)">
                  <path d={LOG_AREA} transform={logM} fill="url(#area)" />
                  <path d={LOG_PATH} transform={logM} fill="none" stroke={ORANGE} strokeOpacity={0.22} strokeWidth={7} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  <path d={LOG_PATH} transform={logM} fill="none" stroke={ORANGE} strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </g>
              </g>
            )}
            {linO > 0.01 && (
              <g opacity={linO}>
                <path d={LIN_PATH} transform={linM} fill="none" stroke={INK} strokeOpacity={0.13} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                <g clipPath="url(#reveal)">
                  <path d={LIN_AREA} transform={linM} fill="url(#area)" />
                  <path d={LIN_PATH} transform={linM} fill="none" stroke={ORANGE} strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </g>
              </g>
            )}
            {ddO > 0.01 && (
              <g opacity={ddO}>
                <g clipPath="url(#reveal)">
                  <path d={DD_AREA} transform={ddM} fill="url(#area-dd)" />
                  <path d={DD_PATH} transform={ddM} fill="none" stroke={WARN} strokeWidth={1.8} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </g>
              </g>
            )}
          </g>

          {/* halving lines */}
          {halvingLines.map((h) => {
            const x = xOf(h.t);
            const q = clamp(burstQ(g, h.t, 0.16));
            return (
              <g key={h.t} pointerEvents="none">
                <line x1={x} x2={x} y1={YT - 20} y2={YB} stroke={GOLD} strokeOpacity={0.4} strokeWidth={1.2} strokeDasharray="4 5" />
                {!(mobile && ch === FINALE && f.local > 0.55) && (
                  <text x={x + fs(5)} y={YT - 8} className="mono" style={{ fontSize: fs(10) }} fill={GOLD} opacity={0.85}>
                    {mobile ? "÷2" : `÷2 · ${h.reward} BTC`}
                  </text>
                )}
                {q > 0 && q < 1 && (
                  <text
                    x={x}
                    y={YT + 120 - q * 60}
                    textAnchor="middle"
                    className="serif"
                    style={{ fontSize: 90 + q * 40, fontWeight: 700 }}
                    fill={GOLD}
                    opacity={Math.sin(q * Math.PI) * 0.85}
                  >
                    ÷2
                  </text>
                )}
              </g>
            );
          })}

          {/* what-if investment band (finale) */}
          {finale > 0.01 && ch === FINALE && <InvestBand f={f} m={smooth(range(f.local, 0.6, 0.7))} invest={invest} labels={[t.chart.buy, t.chart.sell]} />}

          {/* playhead */}
          {f.hero < 0.95 && T < LAST_T + 0.02 && (
            <g opacity={(1 - f.hero) * (1 - finale * smooth(range(f.local, 0.55, 0.65)) * (ch === FINALE ? 1 : 0))} pointerEvents="none">
              <line x1={playX} x2={playX} y1={YT - 30} y2={YB} stroke={ORANGE} strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="3 4" />
              {priceAt(T) !== null && (
                <>
                  <circle cx={playX} cy={f.yOf(T)} r={34} fill="url(#glow)" />
                  <circle cx={playX} cy={f.yOf(T)} r={fs(4)} fill={ORANGE} />
                </>
              )}
            </g>
          )}

          {/* events */}
          {visible.map((e) => {
            const x = xOf(e.t);
            const y = e.future ? YT + 90 : f.yOf(e.t);
            const q = e.future ? 0 : burstQ(g, e.t);
            return <Burst key={`b${e.id}`} e={e} x={x} y={y} q={q} u={u} />;
          })}
          {visible.map((e) => {
            const x = xOf(e.t);
            const y = e.future ? YT + 90 : f.yOf(e.t);
            return (
              <Marker
                key={e.id}
                e={e}
                x={x}
                y={y}
                r={fs(mobile ? 4.2 : 5)}
                q={e.future ? 0 : clamp(burstQ(g, e.t, 0.06))}
                selected={selected === e.id}
                onPick={() => focusEvent(selected === e.id ? null : e)}
              />
            );
          })}

          {/* probe from a panel slider */}
          {probe !== null && probe >= win.t0 && probe <= win.t1 && (
            <g pointerEvents="none">
              <line x1={xOf(probe)} x2={xOf(probe)} y1={YT - 30} y2={YB} stroke={GOLD} strokeWidth={1.4} />
              {priceAt(probe) !== null && supplyMix < 0.5 && <circle cx={xOf(probe)} cy={f.yOf(probe)} r={fs(5)} fill={GOLD} stroke="var(--color-paper)" strokeWidth={fs(2)} />}
            </g>
          )}

          {/* crosshair */}
          {showCursor && (
            <g pointerEvents="none">
              <line x1={f.dot.x} x2={f.dot.x} y1={YT - 30} y2={YB} stroke={INK} strokeOpacity={0.6} strokeWidth={1} />
              <line x1={X0} x2={X1} y1={f.dot.y} y2={f.dot.y} stroke={INK} strokeOpacity={0.25} strokeWidth={1} strokeDasharray="2 4" />
            </g>
          )}
        </g>

        {vis[0] > 0.01 && <GenesisOverlay f={f} m={vis[0]} />}
        {vis[7] > 0.01 && <DominoOverlay f={f} m={vis[7]} mobile={mobile} />}
      </g>

      {/* "no price yet" baseline in the earliest chapters */}
      {T < FIRST_T + 0.4 && win.t0 < FIRST_T && (
        <g opacity={(1 - f.hero) * (1 - smooth(range(g, 1.86, 2.0)))} pointerEvents="none">
          <line x1={X0} x2={Math.min(X1, xOf(FIRST_T))} y1={BASE_Y} y2={BASE_Y} stroke={MUTE} strokeOpacity={0.6} strokeDasharray="1 5" strokeWidth={1.2} />
          <text x={X0 + 4} y={BASE_Y + fs(16)} className="mono" style={{ fontSize: fs(10), letterSpacing: "0.12em" }} fill={MUTE}>
            {t.chart.noPrice.toUpperCase()}
          </text>
        </g>
      )}
    </svg>
  );
}

function SupplyLayer({ f, m, supM, supSy, mobile }: { f: Frame; m: number; supM: string; supSy: number; mobile: boolean }) {
  const { t, lang } = useI18n();
  const probe = useStore(chart, (s) => s.probe);
  const sweep = smooth(range(f.g, 2.04, 2.7));
  const tEnd = Math.max(lerp(2009, f.win.t1, sweep), probe ?? 0);
  const x = f.xOf(tEnd);
  const y21 = YB - 21 * supSy;
  const fs = (px: number) => px * f.u;
  const nowT = 2026.88;
  return (
    <g opacity={m} pointerEvents="none">
      <line x1={X0} x2={X1} y1={y21} y2={y21} stroke={GOLD} strokeWidth={1.2} strokeDasharray="6 5" />
      <text x={X1 - 6} y={y21 - fs(7)} textAnchor="end" className="mono" style={{ fontSize: fs(11) }} fill={GOLD}>
        {t.chart.max}
      </text>
      <clipPath id="sup-reveal">
        <rect x={0} y={0} width={Math.max(0, x)} height={1000} />
      </clipPath>
      <g clipPath="url(#sup-reveal)">
        <path d={`${SUPPLY_PATH}L2142,0L2009,0Z`} transform={supM} fill="url(#area-supply)" />
        <path d={SUPPLY_PATH} transform={supM} fill="none" stroke={GOLD} strokeWidth={2.4} vectorEffect="non-scaling-stroke" />
      </g>
      {HALVING_TIMES.slice(1, 12).map((ht, k) => {
        const hx = f.xOf(ht);
        if (hx < X0 || hx > X1 || ht > tEnd) return null;
        const future = ht > 2026.9;
        const r = 50 / 2 ** (k + 1);
        return (
          <g key={ht}>
            <line x1={hx} x2={hx} y1={YT} y2={YB} stroke={GOLD} strokeOpacity={future ? 0.25 : 0.45} strokeDasharray={future ? "2 6" : "5 5"} />
            {f.win.t1 - f.win.t0 < 40 && (
              <text x={hx + fs(4)} y={YB - fs(8)} className="mono" style={{ fontSize: fs(10) }} fill={GOLD} opacity={future ? 0.6 : 0.95}>
                {r >= 1 ? r : r.toFixed(r < 0.1 ? 3 : 2)}
                {future ? "*" : ""}
              </text>
            )}
          </g>
        );
      })}
      {nowT <= tEnd && nowT < f.win.t1 && (
        <g>
          <circle cx={f.xOf(nowT)} cy={YB - 20.03 * supSy} r={fs(5)} fill={GOLD} />
          <text x={f.xOf(nowT) - fs(8)} y={YB - 20.03 * supSy - fs(10)} textAnchor="end" className="mono" style={{ fontSize: fs(11) }} fill={INK}>
            {lang === "vi" ? "≈ 20,0 triệu · 95%" : "≈ 20.0M · 95%"}
          </text>
        </g>
      )}
      {!mobile && <text x={X0 + 4} y={YT + fs(4)} className="mono" style={{ fontSize: fs(10.5), letterSpacing: "0.1em" }} fill={GOLD}>
        {t.chart.supply.toUpperCase()} · {lang === "vi" ? "phần thưởng / khối ở chân" : "reward per block along the bottom"}
      </text>}
    </g>
  );
}

function HashLayer({ f, m, hashM, hashL0, hashSy, mobile }: { f: Frame; m: number; hashM: string; hashL0: number; hashSy: number; mobile: boolean }) {
  const { t } = useI18n();
  const sweep = smooth(range(f.g, 4.06, 4.78));
  const tEnd = lerp(2009, 2026.45, sweep);
  const x = f.xOf(tEnd);
  const fs = (px: number) => px * f.u;
  const yH = (h: number) => YB - (Math.log10(h) - hashL0) * hashSy;
  const units: [number, string][] = [
    [1e-6, "1 MH/s"],
    [1e-3, "1 GH/s"],
    [1, "1 TH/s"],
    [1e3, "1 PH/s"],
    [1e6, "1 EH/s"],
    [1e9, "1 ZH/s"],
  ];
  const eras: [number, number][] = [
    [2009.45, 0],
    [2010.95, 1],
    [2013.4, 2],
    [2018.2, 3],
  ];
  return (
    <g opacity={m} pointerEvents="none">
      {units.map(([h, l]) => (
        <g key={l}>
          <line x1={X0} x2={X1} y1={yH(h)} y2={yH(h)} stroke={GOLD} strokeOpacity={0.12} />
          <text x={X1 - 6} y={yH(h) - fs(5)} textAnchor="end" className="mono" style={{ fontSize: fs(10) }} fill={GOLD} opacity={0.75}>
            {l}
          </text>
        </g>
      ))}
      <clipPath id="hash-reveal">
        <rect x={0} y={0} width={Math.max(0, x)} height={1000} />
      </clipPath>
      <g clipPath="url(#hash-reveal)">
        <path d={HASH_PATH} transform={hashM} fill="none" stroke={GOLD} strokeOpacity={0.25} strokeWidth={8} vectorEffect="non-scaling-stroke" />
        <path d={HASH_PATH} transform={hashM} fill="none" stroke={GOLD} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      </g>
      {eras.map(([et, k]) => {
        if (et > tEnd) return null;
        const ex = f.xOf(et);
        const ey = yH(hashAt(et));
        return (
          <g key={k} opacity={smooth(range(tEnd, et, et + 0.6))}>
            <line x1={ex} x2={ex} y1={ey} y2={ey - fs(34)} stroke={GOLD} strokeWidth={1} />
            <circle cx={ex} cy={ey} r={fs(3.5)} fill={GOLD} />
            <text x={ex - fs(4)} y={ey - fs(40)} className="mono halo" style={{ fontSize: fs(10.5) }} fill={INK}>
              {t.chart.eras[k].toUpperCase()}
            </text>
          </g>
        );
      })}
      {!mobile && (
        <text x={X0 + 4} y={YT + fs(4)} className="mono" style={{ fontSize: fs(10.5), letterSpacing: "0.1em" }} fill={GOLD}>
          {t.chart.hash.toUpperCase()} (log)
        </text>
      )}
      {tEnd > 2026 && (
        <g>
          <circle cx={x} cy={yH(hashAt(tEnd))} r={22} fill="url(#glow-gold)" />
          <circle cx={x} cy={yH(hashAt(tEnd))} r={fs(4)} fill={GOLD} />
        </g>
      )}
    </g>
  );
}

function InvestBand({ f, m, invest, labels }: { f: Frame; m: number; invest: { amount: number; buy: number; sell: number }; labels: [string, string] }) {
  if (m <= 0.01) return null;
  const a = Math.min(invest.buy, invest.sell);
  const b = Math.max(invest.buy, invest.sell);
  const xa = f.xOf(a);
  const xb = f.xOf(b);
  const fs = (px: number) => px * f.u;
  return (
    <g opacity={m} pointerEvents="none">
      <rect x={xa} y={YT - 30} width={Math.max(1, xb - xa)} height={YB - YT + 30} fill="#f7931a" opacity={0.07} />
      {[
        [invest.buy, labels[0], "var(--color-up)"],
        [invest.sell, labels[1], ORANGE],
      ].map(([tt, l, c]) => {
        const x = f.xOf(tt as number);
        return (
          <g key={l as string}>
            <line x1={x} x2={x} y1={YT - 30} y2={YB} stroke={c as string} strokeWidth={1.4} />
            <circle cx={x} cy={f.yOf(tt as number)} r={fs(5)} fill={c as string} stroke="var(--color-paper)" strokeWidth={fs(2)} />
            <text x={x > 860 ? x - fs(4) : x + fs(4)} y={YT - 36} textAnchor={x > 860 ? "end" : "start"} className="mono" style={{ fontSize: fs(10.5), letterSpacing: "0.1em" }} fill={c as string}>
              {(l as string).toUpperCase()}
            </text>
          </g>
        );
      })}
    </g>
  );
}

