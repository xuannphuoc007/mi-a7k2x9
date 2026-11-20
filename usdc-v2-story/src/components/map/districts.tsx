"use client";
/**
 * The districts of the USDC map. Each one is drawn in world coordinates and
 * animates from the global story coordinate g (chapter index + progress).
 * Buildings rise out of the ground as the camera approaches a district;
 * ambient movement (tokens on routes, lanterns, flames) is pure SVG/CSS so
 * scrolling never has to re-render it.
 */
import { memo } from "react";
import type { Dict } from "@/data/coins/usdc/translations";
import { clamp, lerp, range, smooth } from "@/lib/store";
import { Board, Box, Coin, Flame, Img, Island, K, Lantern, P, Person, Pin, Road, Roof, T, Tile, Tree, Windows, type XY } from "./iso";

type Props = { g: number; t: Dict; reduced: boolean; vi: boolean };
const st = (v: number, a: number, b: number) => smooth(range(v, a, b));
/** buildings rise as the camera approaches chapter idx */
const riseAt = (g: number, idx: number) => st(g, idx - 0.75, idx - 0.1);
/** fade something in at a and out at b (in g units) */
const win = (g: number, a: number, b: number, f = 0.06) => st(g, a, a + f) * (1 - st(g, b - f, b));

/** Coins travelling along a path forever (no re-render; SMIL) */
export function Flow({ d, n = 4, dur = 3, kind = "usdc", r = 9, reduced, opacity = 1 }: { d: string; n?: number; dur?: number; kind?: "usdc" | "usdt" | "usd" | "gold"; r?: number; reduced: boolean; opacity?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={kind === "gold" ? "#e6c66f" : kind === "usd" ? "#a8d3b5" : "#a9c9ee"} strokeWidth={3} strokeDasharray="2 9" strokeLinecap="round" />
      {Array.from({ length: n }, (_, k) => (
        <g key={k}>
          {kind === "gold" ? <circle r={r * 0.75} fill={K.gold} stroke="#b88a22" strokeWidth={1.2} /> : <Coin x={0} y={0} r={r} kind={kind} />}
          {!reduced && <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${(-dur * k) / n}s`} path={d} />}
        </g>
      ))}
    </g>
  );
}

const M = (a: XY, b: XY, lift = 60) => `M${a[0]},${a[1]} Q${(a[0] + b[0]) / 2},${Math.min(a[1], b[1]) - lift} ${b[0]},${b[1]}`;
const L2 = (a: XY, b: XY) => `M${a[0]},${a[1]} L${b[0]},${b[1]}`;

/* ───────────────────────── A · Hội An and Sarah's island (intro, birth beat 2, finale) */
function HoiAnRaw({ g, t, reduced }: Props) {
  const L = t.map;
  const rise = Math.max(0.35, riseAt(g, 0.2));
  const shopH = 46 * rise;
  const pay = st(g, 0.22, 0.3) * (1 - st(g, 1.1, 1.3)); // Sarah pays in USDC (intro beat 2)
  const race = win(g, 4.2, 4.5); // birth beat 2: bank vs USDC
  const fin = st(g, 9.95, 10.05) * (1 - st(g, 10.25, 10.35));
  const sarah = P(0.5, 16.6);
  const ha = P(4.6, 4.4);
  const bankIsle = P(7.5, 11.2);
  // a slow ferry through the bank island
  const ferry = clamp((g - 4.22) / 0.26) * 0.42;
  const fp = ferry < 0.5 ? [lerp(sarah[0], bankIsle[0], ferry * 2), lerp(sarah[1], bankIsle[1], ferry * 2)] : [lerp(bankIsle[0], ha[0], ferry * 2 - 1), lerp(bankIsle[1], ha[1], ferry * 2 - 1)];
  return (
    <g>
      {/* Hội An shop */}
      <Tile i={1} j={3.2} w={7} d={0.9} fill={K.road} stroke={K.roadLine} />
      <Box i={3} j={1} w={3} d={2} h={shopH} color={K.warm} top="#f7dc92" />
      {rise > 0.6 && <Windows i={3} j={1} w={3} d={2} h={shopH * 0.7} rows={1} color="#8a5a32" opacity={0.55} />}
      <Roof i={2.85} j={0.85} w={3.3} d={2.3} z={shopH} rise={24 * rise} />
      {rise > 0.5 && [0, 1, 2, 3, 4].map((k) => {
        const [x, y] = P(3.2 + k * 0.62, 3.05, shopH - 4);
        return <Lantern key={k} x={x} y={y} s={1.05} color={k % 2 ? K.gold : "#e2483d"} />;
      })}
      <Box i={0.8} j={1.2} w={1.4} d={1.4} h={22 * rise} color="#f1e2c4" />
      <Roof i={0.7} j={1.1} w={1.6} d={1.6} z={22 * rise} rise={14 * rise} color="#a85a3a" />
      <Tree x={P(7.6, 1.2)[0]} y={P(7.6, 1.2)[1]} />
      <Tree x={P(1.4, 5.2)[0]} y={P(1.4, 5.2)[1]} kind="palm" />
      <Tree x={P(8.2, 4.6)[0]} y={P(8.2, 4.6)[1]} s={0.8} />
      <Person x={ha[0]} y={ha[1]} shirt="#e2483d" hair="#1d1d24" wave={pay} />
      <Pin x={P(4.5, 1.6, shopH + 30)[0]} y={P(4.5, 1.6, shopH + 30)[1]} text={L.shop} sub={L.shopSub} fs={15} />

      {/* Sarah's island */}
      <Box i={-1.2} j={13.8} w={2.4} d={2} h={30 * rise} color="#ffffff" />
      <Roof i={-1.3} j={13.7} w={2.6} d={2.2} z={30 * rise} rise={16 * rise} color="#c97a4e" />
      <Tree x={P(-2.2, 16.6)[0]} y={P(-2.2, 16.6)[1]} kind="gum" />
      <Tree x={P(2.2, 13.6)[0]} y={P(2.2, 13.6)[1]} kind="gum" s={0.85} />
      <Person x={sarah[0]} y={sarah[1]} shirt="#7b6cc6" hair="#c99a54" wave={pay * 0.6} />
      <Pin x={sarah[0]} y={sarah[1] - 66} text={L.sarah} sub={L.sarahSub} fs={15} />

      {/* the bank detour */}
      <g opacity={Math.max(race, 0)}>
        <Box i={6.9} j={10.6} w={1.4} d={1.2} h={24} color={K.stone} />
        <Roof i={6.8} j={10.5} w={1.6} d={1.4} z={24} rise={12} color={K.stoneDark} />
        <path d={`M${sarah[0]},${sarah[1]} Q${(sarah[0] + bankIsle[0]) / 2},${sarah[1] + 30} ${bankIsle[0]},${bankIsle[1]} Q${(bankIsle[0] + ha[0]) / 2},${bankIsle[1] - 10} ${ha[0]},${ha[1]}`} fill="none" stroke={K.mute} strokeWidth={2.5} strokeDasharray="5 9" />
        <g transform={`translate(${fp[0]},${fp[1]})`}>
          <path d="M-22,0 L22,0 L15,10 L-15,10 Z" fill="#ffffff" stroke={K.mute} strokeWidth={1.5} />
          <rect x={-9} y={-12} width={18} height={12} rx={2} fill="#ffffff" stroke={K.mute} strokeWidth={1.5} />
          <text x={0} y={-2} textAnchor="middle" fill={K.ink} style={{ fontSize: 11, fontWeight: 800 }}>$</text>
        </g>
        <Pin x={bankIsle[0]} y={bankIsle[1] - 56} text={L.bankRoute} fs={14} color={K.mute} />
      </g>

      {/* USDC goes straight from Sarah to Hà */}
      <Flow d={M([sarah[0], sarah[1] - 30], [ha[0], ha[1] - 30], 160)} n={5} dur={2.2} reduced={reduced} opacity={Math.max(pay, race)} />
      <Pin x={(sarah[0] + ha[0]) / 2} y={Math.min(sarah[1], ha[1]) - 150} text={race > 0.1 ? L.usdcRoute : "1,000 USDC"} fs={15} color={K.usdcDark} bg={K.usdcSoft} opacity={Math.max(pay, race)} pointer={false} />

      {/* finale: Hà's phone */}
      <Board x={P(1.2, 4.6)[0] - 70} y={P(1.2, 4.6)[1]} w={170} h={220} opacity={fin} color={K.ink} border={K.ink}>
        <rect x={10} y={12} width={150} height={196} rx={10} fill="#fff" />
        <T x={85} y={40} fs={12} color={K.mute} weight={600}>{t.scenes.finale.wallet}</T>
        <Img x={85} y={90} w={60} href="/img/usdc.png" />
        <T x={85} y={145} fs={20} weight={800}>{t.scenes.finale.bal}</T>
        <T x={85} y={168} fs={13} color={K.usdcDark} weight={700}>{t.scenes.finale.approx}</T>
        <T x={85} y={193} fs={10.5} color={K.mute} weight={500}>{t.scenes.finale.tip}</T>
      </Board>
    </g>
  );
}

/* ───────────────────────── C · Circle Mint (chapter 1) */
function MintRaw({ g, t, reduced, vi }: Props) {
  const L = t.map, S = t.scenes.mint;
  const p = g - 1;
  const rise = riseAt(g, 1);
  const H = 64 * rise;
  const run = st(p, -0.15, 0.05);
  const burn = st(p, 0.2, 0.3);
  const band = st(p, 0.44, 0.52);
  const count = st(p, 0.68, 0.86);
  const settle = st(p, 0.5, 0.68);
  const inA = P(12.4, 0.5, 8), inB = P(15, 0.5, 8);
  const outA = P(19, 0.5, 8), outB = P(21.6, 0.5, 8);
  const furn = P(20.25, 3.75, 30);
  const tilt = (1 - settle) * Math.sin(settle * 18) * 14 + (settle < 0.02 ? -12 : 0);
  const [sx, sy] = P(15.8, 5.2);
  const n = Math.round(67.9e9 * count / 1e6) * 1e6;
  return (
    <g>
      <Box i={12.4} j={0.2} w={2.6} d={0.6} h={6} color="#cfd6de" />
      <Box i={19} j={0.2} w={2.6} d={0.6} h={6} color="#cfd6de" />
      <Box i={15} j={-1.2} w={4} d={3.2} h={H} color="#f3f7fd" top="#e3ecf7" />
      <Box i={15} j={-1.2} w={4} d={3.2} h={9 * rise} z={H * 0.72} color={K.usdc} noTop />
      {rise > 0.6 && <Windows i={15} j={-1.2} w={4} d={3.2} h={H * 0.66} rows={2} color="#bcd3ee" opacity={0.9} />}
      <Box i={16.2} j={-0.2} w={1.4} d={1.2} h={18 * rise} z={H} color="#dfe6ee" />
      <Pin x={P(17, 0.4, H + 34)[0]} y={P(17, 0.4, H + 34)[1]} text={L.mint} sub={L.mintSub} fs={16} opacity={rise} />
      <Flow d={L2(inA, inB)} n={3} dur={2.4} kind="usd" r={8} reduced={reduced} opacity={run} />
      <Flow d={L2(outA, outB)} n={3} dur={2.4} kind="usdc" r={9} reduced={reduced} opacity={run} />
      <Pin x={inA[0] - 6} y={inA[1] - 22} text={L.usdIn} fs={13} color="#3f8a5e" opacity={run} />
      <Pin x={outB[0] + 6} y={outB[1] - 22} text={L.usdcOut} fs={13} color={K.usdcDark} opacity={run} />

      {/* burn on return */}
      <g opacity={burn}>
        <Box i={19.6} j={3.1} w={1.3} d={1.3} h={26} color="#ece4dc" />
        <Flame x={furn[0]} y={furn[1] - 4} s={0.9} />
        <Flow d={L2(P(23.2, 5.2, 50), [furn[0], furn[1] - 10])} n={3} dur={1.8} reduced={reduced} />
        <Pin x={furn[0]} y={furn[1] - 44} text={L.burned} fs={13} color={K.red} />
      </g>

      {/* the rubber band: a see-saw that settles at $1 */}
      <g opacity={band * (1 - st(p, 0.7, 0.78) * 0.6) * (1 - st(p, 0.95, 1.05))}>
        <path d={`M${sx - 16},${sy} L${sx + 16},${sy} L${sx},${sy - 26} Z`} fill="#9aa4ae" />
        <g transform={`rotate(${tilt},${sx},${sy - 26})`}>
          <rect x={sx - 120} y={sy - 32} width={240} height={7} rx={3} fill={K.ink} />
          <Coin x={sx} y={sy - 46} r={13} />
        </g>
        <Pin x={sx - 110} y={sy - 52} text={S.low} fs={12} anchor="end" color={K.mute} pointer={false} />
        <Pin x={sx + 110} y={sy - 52} text={S.high} fs={12} anchor="start" color={K.mute} pointer={false} />
        <Pin x={sx} y={sy + 34} text={S.band} fs={13} color={K.usdcDark} bg={K.usdcSoft} pointer={false} opacity={settle} />
      </g>

      {/* counter on a billboard */}
      <Board x={P(12.8, 3.6)[0]} y={P(12.8, 3.6)[1]} w={300} h={86} opacity={count}>
        <T x={150} y={26} fs={11} color={K.mute} weight={600}>{S.counter}</T>
        <T x={150} y={64} fs={30} color={K.usdcDark} weight={800}>{new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(n)}</T>
      </Board>
    </g>
  );
}

/* ───────────────────────── D · The reserve yard (chapter 2) */
const COUNTS = [59, 29, 11, 1];
const CAT = COUNTS.flatMap((c, k) => Array(c).fill(k) as number[]);
const CCOL = [K.usdc, "#8dbbec", K.cash, K.grey];
function VaultRaw({ g, t }: Props) {
  const L = t.map, V = t.scenes.vault;
  const p = g - 2;
  const fill = st(p, -0.2, 0.12);
  const rev = [st(p, 0.15, 0.22), st(p, 0.33, 0.4), st(p, 0.51, 0.58), st(p, 0.51, 0.58)];
  let focus = -1;
  if (p > 0.51 && p < 0.66) focus = 2;
  else if (p > 0.33 && p < 0.51) focus = 1;
  else if (p > 0.15 && p < 0.33) focus = 0;
  const stress = st(p, 0.74, 0.86) * (1 - st(g, 3.3, 3.6));
  const rise = riseAt(g, 2);
  const i0 = 25, j0 = 1.6, c = 1.06;
  const crates = CAT.map((cat, k) => {
    const col = k % 10, row = Math.floor(k / 10);
    const q = clamp(fill * 1.6 - (row * 10 + col) * 0.006);
    if (q <= 0.01) return null;
    const lit = rev[cat];
    const dim = focus === -1 || focus === cat || (focus === 2 && cat === 3) ? 1 : 0.35;
    const sink = cat >= 2 ? stress : 0;
    return (
      <Box key={k} i={i0 + col * c} j={j0 + row * c} w={0.86} d={0.86} h={20} z={(1 - smooth(q)) * 60 - sink * 34} color={lit > 0.5 ? CCOL[cat] : "#d8dee6"} opacity={smooth(q) * dim * (1 - sink * 0.85)} />
    );
  });
  const cen = (cat: number): XY => {
    const idx = CAT.indexOf(cat) + Math.floor(COUNTS[cat] / 2);
    return P(i0 + (idx % 10) * c + 0.4, j0 + Math.floor(idx / 10) * c + 0.4, 26);
  };
  const fund = st(p, 0.15, 0.22) * (1 - st(p, 0.36, 0.42));
  const cal = st(p, 0.33, 0.4) * (1 - st(p, 0.54, 0.6));
  const owed = st(p, 0.64, 0.7);
  return (
    <g>
      <Tile i={i0 - 0.5} j={j0 - 0.5} w={10 * c + 0.6} d={10 * c + 0.6} fill="#e6ecef" stroke="#d3dce2" />
      {crates}
      <Box i={36} j={1.5} w={2.6} d={2.6} h={78 * rise} color="#eef2f8" top="#e1e8f2" />
      {rise > 0.6 && <Windows i={36} j={1.5} w={2.6} d={2.6} h={78 * rise * 0.9} rows={4} color="#c9d7ea" opacity={0.9} />}
      <Pin x={P(37.3, 2.8, 78 * rise + 26)[0]} y={P(37.3, 2.8, 78 * rise + 26)[1]} text={L.fund} sub={L.fundSub} fs={fund > 0.05 ? 16 : 13} opacity={0.45 + 0.55 * fund} color={fund > 0.05 ? K.usdcDark : K.ink} />
      <Pin x={P(30.3, 6.9, 40)[0]} y={P(30.3, 6.9, 40)[1] - 150} text={V.totalVal} sub={V.totalLabel} fs={20} color={K.ink} opacity={st(p, -0.05, 0.05) * (1 - st(p, 0.13, 0.18))} pointer={false} />
      {V.legend.map((it, k) => {
        if (k === 3) return null;
        const [x, y] = cen(k);
        const o = rev[k] * (focus === k || (focus === -1 && p > 0.6) ? 1 : 0.0);
        return <Pin key={k} x={x} y={y} text={`${it.pct} · ${it.name.split(" (")[0]}`} sub={k === 2 ? `${it.val} + ${V.legend[3].val} · ${V.legend[3].name}` : it.val} fs={15} color={k === 0 ? K.usdcDark : k === 1 ? "#3f74b8" : "#3f8a5e"} opacity={o * (1 - stress)} />;
      })}
      {/* ≈ 10 days */}
      <Board x={P(37, 8.5)[0]} y={P(37, 8.5)[1]} w={210} h={150} opacity={cal}>
        <rect x={20} y={22} width={74} height={84} rx={10} fill="#fff" stroke={K.ink} strokeWidth={2} />
        <rect x={20} y={22} width={74} height={22} rx={10} fill={K.usdc} />
        <rect x={20} y={34} width={74} height={10} fill={K.usdc} />
        <T x={57} y={92} fs={38} weight={800}>{Math.max(1, Math.round(10 * Math.min(1, cal * 1.3)))}</T>
        <T x={150} y={60} fs={22} weight={800} color={K.usdcDark}>{V.wam}</T>
        <T x={150} y={84} fs={10.5} weight={500} color={K.mute}>{V.wamSub.split(" ").slice(0, 3).join(" ")}</T>
        <T x={150} y={98} fs={10.5} weight={500} color={K.mute}>{V.wamSub.split(" ").slice(3).join(" ")}</T>
        <T x={105} y={136} fs={10} weight={600} color={K.mute}>{V.wamMore}</T>
      </Board>
      <Pin x={P(30.3, 12.6)[0]} y={P(30.3, 12.6)[1] + 44} text={V.owed} sub={V.buffer} fs={14} pointer={false} opacity={owed * (1 - stress)} />
      <Pin x={P(30.3, 6.9, 40)[0]} y={P(30.3, 6.9, 40)[1] - 120} text={V.stress} fs={17} color="#fff" bg={K.red} pointer={false} opacity={stress} />
    </g>
  );
}

/* ───────────────────────── E · Where the interest goes (chapter 3; Centre bridge in chapter 4) */
function MoneyRaw({ g, t, reduced }: Props) {
  const L = t.map, S = t.scenes.profit, B = t.scenes.birth;
  const p = g - 3;
  const rise = riseAt(g, 3);
  const cH = 132 * rise, kH = 96 * rise, tH = 50 * rise;
  const a = st(p, -0.15, 0.05);
  const bars = st(p, 0.22, 0.36);
  const split = st(p, 0.46, 0.56);
  const rate = st(p, 0.7, 0.86);
  const centre = win(g, 4.44, 4.78, 0.05);
  const centreGone = st(g, 4.62, 4.7);
  const treas = P(51, -1.5, tH + 10), circ = P(43.2, 1.2, cH * 0.7), cb = P(48, 6, kH * 0.7);
  return (
    <g>
      {/* US Treasury */}
      <Box i={49} j={-3} w={4} d={3} h={6} color={K.stone} />
      {[0, 1, 2, 3, 4].map((k) => (
        <Box key={k} i={49.25 + k * 0.8} j={-0.45} w={0.32} d={0.32} h={tH - 6} z={6} color="#f8f6f1" />
      ))}
      <Box i={49} j={-3} w={4} d={2.4} h={tH - 6} z={6} color={K.stone} />
      <Box i={48.9} j={-3.1} w={4.2} d={3.2} h={8} z={tH} color={K.stoneSide} />
      <Roof i={48.9} j={-3.1} w={4.2} d={3.2} z={tH + 8} rise={20 * rise} color={K.stoneDark} />
      <Pin x={P(51, -1.5, tH + 46)[0]} y={P(51, -1.5, tH + 46)[1]} text={L.treasury} fs={15} opacity={rise} />

      {/* Circle tower */}
      <Box i={42} j={0} w={2.5} d={2.5} h={cH} color="#f4f8fd" top="#e2ebf6" />
      <Box i={42} j={0} w={2.5} d={2.5} h={8 * rise} z={cH - 20 * rise} color={K.usdc} noTop />
      {rise > 0.6 && <Windows i={42} j={0} w={2.5} d={2.5} h={cH * 0.82} rows={6} color="#bcd3ee" opacity={0.9} />}
      <Pin x={P(43.25, 1.25, cH + 22)[0]} y={P(43.25, 1.25, cH + 22)[1]} text={L.circle} fs={16} color={K.usdcDark} opacity={rise} />

      {/* Coinbase & partners */}
      <Box i={47} j={5} w={2} d={2} h={kH} color="#eceff5" top="#dfe3ec" />
      {rise > 0.6 && <Windows i={47} j={5} w={2} d={2} h={kH * 0.85} rows={4} color="#c8cfdc" opacity={0.9} />}
      <Pin x={P(48, 6, kH + 22)[0]} y={P(48, 6, kH + 22)[1]} text={L.partners} fs={15} opacity={rise} />

      {/* Hà's jar: 0% */}
      <g opacity={a}>
        {(() => {
          const [x, y] = P(41.3, 5.2);
          return (
            <g>
              <ellipse cx={x} cy={y} rx={22} ry={7} fill="rgba(29,43,58,0.12)" />
              <path d={`M${x - 18},${y - 48} L${x - 18},${y - 4} Q${x},${y + 4} ${x + 18},${y - 4} L${x + 18},${y - 48}`} fill="#eef6ff" stroke="#9fb8d4" strokeWidth={2} />
              <Coin x={x - 6} y={y - 14} r={8} />
              <Coin x={x + 7} y={y - 18} r={8} />
              <Coin x={x} y={y - 30} r={8} />
              <Pin x={x} y={y - 58} text={L.jar} fs={14} color={K.red} />
            </g>
          );
        })()}
      </g>
      {/* interest: Treasury → Circle, thinning when rates fall */}
      <Flow d={M(treas, circ, 90)} n={Math.round(lerp(7, 3, rate))} dur={3.2} kind="gold" r={10} reduced={reduced} opacity={a} />
      <Pin x={(treas[0] + circ[0]) / 2} y={Math.min(treas[1], circ[1]) - 74} text={L.rate} fs={13} color="#9c7425" bg="#fbf3dc" pointer={false} opacity={a * (1 - rate)} />

      {/* revenue skyline */}
      {S.bars.map((b, k) => {
        const q = st(bars, k * 0.15, k * 0.15 + 0.4);
        const i = 41 + k * 2.1, j = 11.6;
        const h = b.v * 58 * q;
        const [x, y] = P(i + 0.5, j + 0.5, h + 14);
        const [bx, by] = P(i + 0.5, j + 1.4);
        return (
          <g key={b.y} opacity={bars > 0.01 ? 1 : 0}>
            <Box i={i} j={j} w={1} d={1} h={h} color={k === 3 ? "#9fb4c9" : K.usdc} />
            <T x={x} y={y} fs={15} weight={800} opacity={q}>{b.label}</T>
            <T x={bx} y={by + 18} fs={12} weight={600} color={K.mute} opacity={q}>{b.y}</T>
          </g>
        );
      })}
      <Pin x={P(45, 13)[0]} y={P(45, 13)[1] + 50} text={S.barsTitle} sub={S.partial} fs={13} pointer={false} opacity={bars} />

      {/* the split: most interest goes on to partners */}
      <Flow d={M(P(44.5, 2, cH * 0.6), cb, 70)} n={6} dur={2.6} kind="gold" r={9} reduced={reduced} opacity={split} />
      <Board x={P(41, 3.6)[0] - 150} y={P(41, 3.6)[1]} w={250} h={96} opacity={split * (1 - rate * 0.4)}>
        {Array.from({ length: 20 }, (_, k) => (
          <circle key={k} cx={22 + (k % 10) * 22} cy={22 + Math.floor(k / 10) * 20} r={8} fill={k < 12 ? "#6c7a96" : K.usdc} />
        ))}
        <T x={125} y={74} fs={12.5} weight={700}>{L.split}</T>
        <T x={125} y={90} fs={11} weight={600} color={K.usdcDark}>{S.splitVal}</T>
      </Board>

      {/* rates dial */}
      <Board x={P(46, -4)[0]} y={P(46, -4)[1]} w={230} h={80} opacity={rate}>
        <rect x={20} y={28} width={190} height={6} rx={3} fill="#e3e7ec" />
        <circle cx={lerp(190, 40, rate)} cy={31} r={10} fill={K.ink} />
        <T x={20} y={20} fs={10} anchor="start" color={K.mute}>{S.rateLow}</T>
        <T x={210} y={20} fs={10} anchor="end" color={K.mute}>{S.rateHigh}</T>
        <T x={115} y={62} fs={15} weight={800} color={K.red}>{S.rateNote}</T>
      </Board>

      {/* chapter 4: the Centre sky-bridge between Circle and Coinbase */}
      <g opacity={centre}>
        {(() => {
          const z1 = cH * 0.62, z2 = kH * 0.7;
          const a1 = P(44.5, 1.6, z1), a2 = P(44.5, 2.2, z1), b1 = P(47, 5.6, z2), b2 = P(47, 6.2, z2);
          const gone = centreGone;
          return (
            <g>
              <polygon points={`${a1[0]},${a1[1]} ${b1[0]},${b1[1]} ${b2[0]},${b2[1]} ${a2[0]},${a2[1]}`} fill={K.usdcSoft} stroke={K.usdc} strokeWidth={2} opacity={1 - gone * 0.8} strokeDasharray={gone > 0.5 ? "6 6" : undefined} />
              <Pin x={(a1[0] + b1[0]) / 2} y={(a1[1] + b1[1]) / 2 - 14} text={B.centre} fs={14} color={K.usdcDark} opacity={1 - gone} />
              <Pin x={(a1[0] + b1[0]) / 2 + 40} y={(a1[1] + b1[1]) / 2 - 64} text={B.after1} fs={13.5} opacity={gone} pointer={false} />
              <Pin x={(a1[0] + b1[0]) / 2 + 40} y={(a1[1] + b1[1]) / 2 - 22} text={B.after2} fs={13.5} color={K.mute} opacity={gone} pointer={false} />
            </g>
          );
        })()}
      </g>
    </g>
  );
}

/* ───────────────────────── F · The history road (chapter 4) */
function RoadRaw({ g, t }: Props) {
  const L = t.map, B = t.scenes.birth;
  const p = g - 4;
  const rise = riseAt(g, 4);
  const posts = [
    { i: 57.5, text: B.founded, sub: B.founders, at: -0.05 },
    { i: 61, text: B.launched, at: 0.03, logo: true },
    { i: 64.5, text: L.centreEnd, at: 0.11 },
    { i: 68, text: B.ipo, sub: B.ipoSub, at: 0.19 },
  ];
  const early: [number, number][] = [[2019.95, 0.5], [2020.2, 0.6], [2020.5, 1.0], [2020.72, 2.79], [2021.0, 4.1]];
  const ny = st(p, 0.68, 0.8);
  return (
    <g>
      <Road a={[56, 2.5]} b={[71, 2.5]} />
      {posts.map((q, k) => {
        const o = st(p, q.at, q.at + 0.06);
        const [x, y] = P(q.i, 1.7);
        return (
          <g key={k} opacity={0.25 + 0.75 * o}>
            <rect x={x - 2} y={y - 70} width={4} height={70} fill="#8b97a3" />
            <path d={`M${x + 2},${y - 70} L${x + 34},${y - 62} L${x + 2},${y - 54} Z`} fill={k === 1 ? K.usdc : k === 3 ? K.ink : "#9fb4c9"} />
            {q.logo && <Img x={x} y={y - 120} w={56} href="/img/usdc.png" opacity={o} />}
            <Pin x={x} y={y - (q.logo ? 152 : 78)} text={q.text} sub={q.sub} fs={14} opacity={o} />
          </g>
        );
      })}
      {/* NYSE */}
      <Box i={67} j={-2.4} w={3.4} d={2.6} h={6} color={K.stone} />
      {[0, 1, 2, 3].map((k) => (
        <Box key={k} i={67.3 + k * 0.85} j={-0.15} w={0.3} d={0.3} h={52 * rise} z={6} color="#fbfaf7" />
      ))}
      <Box i={67} j={-2.4} w={3.4} d={2.2} h={52 * rise} z={6} color={K.stone} />
      <Box i={66.9} j={-2.5} w={3.6} d={2.8} h={10} z={6 + 52 * rise} color={K.stoneSide} />
      <Pin x={P(68.7, -1, 90 * rise)[0]} y={P(68.7, -1, 90 * rise)[1]} text="NYSE · CRCL" fs={14} opacity={ny} color={K.ink} />
      {/* early supply columns along the road */}
      {early.map(([tt, b], k) => {
        const q = st(p, 0.7 + k * 0.03, 0.78 + k * 0.03);
        const i = 58 + k * 1.6;
        const h = b * 26 * q;
        const [x, y] = P(i + 0.4, 4.4, h + 10);
        return (
          <g key={tt}>
            <Box i={i} j={4} w={0.8} d={0.8} h={Math.max(1, h)} color={K.usdc} opacity={q} />
            {(k === 1 || k === 4) && <Pin x={x} y={y} text={k === 1 ? B.s2020 : B.s2021} fs={13} opacity={q} color={K.usdcDark} />}
          </g>
        );
      })}
    </g>
  );
}

/* ───────────────────────── G · The SVB lake (chapter 5) */
const PRICE: [number, number][] = [[0, 1.0], [0.14, 0.999], [0.22, 0.99], [0.3, 0.95], [0.36, 0.9], [0.42, 0.87], [0.5, 0.9], [0.58, 0.92], [0.66, 0.95], [0.74, 0.975], [0.82, 0.99], [0.9, 0.997], [1, 0.999]];
function SvbRaw({ g, t, reduced }: Props) {
  const L = t.map, D = t.scenes.depeg;
  const p = g - 5;
  const rise = riseAt(g, 5);
  const sink = st(p, 0.08, 0.3);
  const draw = st(p, 0.24, 0.46);
  const shrink = st(p, 0.5, 0.66);
  const tanks = st(p, 0.7, 0.8);
  const bz = -sink * 46;
  const [cx, cy] = P(79.25, 13.1);
  const tankH = lerp(43, 32.5, shrink) * 4.2 * rise;
  return (
    <g>
      <Tile i={75} j={9} w={8.5} d={8} fill={K.sea} stroke={K.seaLine} />
      <g opacity={1 - sink * 0.55}>
        <Box i={78} j={12} w={2.5} d={2.2} h={6} z={bz} color={K.stone} />
        {[0, 1, 2].map((k) => (
          <Box key={k} i={78.3 + k * 0.85} j={13.9} w={0.28} d={0.28} h={38 * rise} z={bz + 6} color="#fbfaf7" />
        ))}
        <Box i={78} j={12} w={2.5} d={1.8} h={38 * rise} z={bz + 6} color={K.stone} />
        <Box i={77.9} j={11.9} w={2.7} d={2.4} h={8} z={bz + 6 + 38 * rise} color={K.stoneSide} />
        <Roof i={77.9} j={11.9} w={2.7} d={2.4} z={bz + 14 + 38 * rise} rise={16} color={K.stoneDark} />
        <Coin x={P(79.2, 14.25, bz + 26)[0]} y={P(79.2, 14.25, bz + 26)[1]} r={11} />
      </g>
      {/* water closes over the base as it sinks */}
      <Tile i={77.4} j={11.4} w={3.7} d={3.4} fill={K.sea} opacity={sink * 0.85} />
      {sink > 0.05 && !reduced && [0, 1].map((k) => (
        <ellipse key={k} cx={cx} cy={cy} rx={60} ry={24} fill="none" stroke="#ffffff" strokeWidth={2} className="ripple" style={{ animationDelay: `${k * 1.2}s` }} />
      ))}
      <Pin x={cx} y={cy - 120 + sink * 30} text={D.svb} sub={D.svbDate} fs={16} opacity={rise} />
      <Pin x={cx} y={cy + 44} text={D.svbStuck} fs={14} color="#fff" bg={K.red} pointer={false} opacity={st(p, -0.05, 0.05) * (1 - st(p, 0.5, 0.6))} />

      {/* price board */}
      <Board x={P(74.5, 8.3)[0]} y={P(74.5, 8.3)[1]} w={300} h={170} opacity={draw * (1 - st(p, 0.74, 0.8))}>
        <T x={20} y={26} fs={14} weight={800} anchor="start">{L.priceTitle}</T>
        {[1, 0.95, 0.9].map((v) => {
          const y = 150 - ((v - 0.86) / 0.15) * 112;
          return (
            <g key={v}>
              <line x1={50} x2={285} y1={y} y2={y} stroke={v === 1 ? K.usdc : "#e3e7ec"} strokeWidth={v === 1 ? 2 : 1} strokeDasharray={v === 1 ? undefined : "3 4"} />
              <T x={44} y={y + 4} fs={10} anchor="end" color={K.mute} weight={500}>{"$" + v.toFixed(2)}</T>
            </g>
          );
        })}
        {(() => {
          const pts = PRICE.filter(([x]) => x <= draw).map(([x, v]) => `${50 + x * 235},${150 - ((v - 0.86) / 0.15) * 112}`);
          return pts.length > 1 ? <polyline points={pts.join(" ")} fill="none" stroke={K.red} strokeWidth={3} strokeLinejoin="round" /> : null;
        })()}
        <g opacity={st(draw, 0.42, 0.5)}>
          <circle cx={50 + 0.42 * 235} cy={150 - ((0.87 - 0.86) / 0.15) * 112} r={5} fill={K.red} />
          <T x={50 + 0.42 * 235 + 10} y={150 - ((0.87 - 0.86) / 0.15) * 112 + 4} fs={11} anchor="start" color={K.red} weight={800}>{D.usdcLow}</T>
        </g>
      </Board>

      {/* supply tank shrinks as Circle pays out */}
      <g opacity={st(p, 0.46, 0.52)}>
        <Box i={82.4} j={14.6} w={1.6} d={1.6} h={43 * 4.2 * rise} color="#eef3f9" opacity={0.6} />
        <Box i={82.4} j={14.6} w={1.6} d={1.6} h={tankH} color={K.usdc} />
        <Pin x={P(83.2, 15.4, tankH + 16)[0]} y={P(83.2, 15.4, tankH + 16)[1]} text={shrink > 0.6 ? D.to : D.from} sub={D.supply} fs={16} color={K.usdcDark} />
        <Flow d={L2(P(84, 16, 20), P(86.5, 18.6, 0))} n={3} dur={1.6} reduced={reduced} opacity={shrink > 0.02 && shrink < 0.98 ? 1 : 0.4} />
        <Pin x={P(84.5, 18.4)[0] + 30} y={P(84.5, 18.4)[1] + 50} text={D.redeemed} fs={13} pointer={false} opacity={shrink} />
      </g>

      {/* a bank that died, a coin that kept paying */}
      <Board x={P(76.5, 17.2)[0]} y={P(76.5, 17.2)[1]} w={330} h={130} opacity={tanks}>
        {[{ x: 82, name: D.svbTank, run: D.svbRun, end: D.svbEnd, bad: true }, { x: 248, name: D.usdcTank, run: D.usdcRun, end: D.usdcEnd, bad: false }].map((b) => (
          <g key={b.name}>
            <T x={b.x} y={26} fs={13} weight={800}>{b.name}</T>
            <rect x={b.x - 26} y={36} width={52} height={50} rx={6} fill="#f2f4f7" />
            <rect x={b.x - 26} y={36 + 50 * 0.25 * tanks} width={52} height={50 - 50 * 0.25 * tanks} rx={6} fill={b.bad ? "#e7b0aa" : K.usdc} />
            <T x={b.x} y={102} fs={11} weight={700} color={b.bad ? K.red : K.usdcDark}>{b.run}</T>
            <T x={b.x} y={120} fs={12} weight={800} color={b.bad ? K.red : K.usdcDark}>{(b.bad ? "✕ " : "✓ ") + b.end}</T>
          </g>
        ))}
      </Board>
    </g>
  );
}

/* ───────────────────────── H · Growth, chains, freezes, HQ (chapter 6) */
const SKY: [number, number][] = [[2020.0, 0.47], [2021.0, 4.1], [2022.0, 42.5], [2022.47, 55.9], [2023.0, 44.5], [2024.0, 23.8], [2025.0, 44.0], [2026.0, 75.3], [2026.87, 67.9]];
function GrowthRaw({ g, t, reduced }: Props) {
  const L = t.map, G = t.scenes.growth;
  const p = g - 6;
  const rise = riseAt(g, 6);
  const sky = st(p, -0.15, 0.32);
  const chains = st(p, 0.36, 0.46);
  const locks = st(p, 0.54, 0.64);
  const hq = st(p, 0.72, 0.8);
  const islands = [
    { i: 89, j: 14, w: 7, d: 7, name: "Ethereum", val: G.chains[0].val, coins: 12, logo: "/img/eth.svg" },
    { i: 98.5, j: 14, w: 2.6, d: 2.6, name: "Hyperliquid", val: G.chains[1].val, coins: 2 },
    { i: 98.5, j: 19, w: 2.2, d: 2.2, name: "Base", val: G.chains[2].val, coins: 1 },
    { i: 91, j: 23.4, w: 4.4, d: 3.4, name: G.chains[3].name, val: G.chains[3].val, coins: 5 },
  ];
  const ethC = P(92.5, 17.5, 10);
  return (
    <g>
      {/* skyline of supply milestones */}
      {SKY.map(([tt, b], k) => {
        const q = st(sky, k * 0.08, k * 0.08 + 0.3);
        const i = 89 + k * 1.55, j = 1.4;
        const h = b * 3.3 * q * rise;
        const [x, y] = P(i + 0.45, j + 0.45, h + 12);
        const [bx, by] = P(i + 0.45, j + 1.5);
        const hi = k === 3 || k === 5 || k === 8;
        return (
          <g key={tt}>
            <Box i={i} j={j} w={0.9} d={0.9} h={Math.max(1, h)} color={k === 5 ? "#9fb4c9" : K.usdc} opacity={0.25 + 0.75 * q} />
            {hi && <Pin x={x} y={y} text={k === 3 ? G.peak : k === 5 ? G.low : G.end} fs={13.5} color={k === 5 ? K.red : K.usdcDark} opacity={q} />}
            <T x={bx} y={by + 16} fs={10.5} weight={600} color={K.mute} opacity={q}>{L.skyDates[k]}</T>
          </g>
        );
      })}
      <Pin x={P(95, 5.6)[0]} y={P(95, 5.6)[1] + 40} text={G.title} fs={12.5} pointer={false} color={K.mute} opacity={sky * (1 - locks)} />

      {/* chain islands joined by burn-and-mint bridges */}
      <g opacity={0.35 + 0.65 * chains}>
        {islands.slice(1).map((s, k) => {
          const to = P(s.i + s.w / 2, s.j + s.d / 2, 10);
          return (
            <g key={k}>
              <Flow d={M(ethC, to, 50)} n={2} dur={2.6 + k * 0.4} reduced={reduced} opacity={chains} />
              <g opacity={chains}>
                <Flame x={ethC[0] + 12 * (k - 1)} y={ethC[1] - 18} s={0.45} />
              </g>
            </g>
          );
        })}
        {islands.map((s) => {
          const [x, y] = P(s.i + s.w / 2, s.j + s.d / 2);
          return (
            <g key={s.name}>
              {Array.from({ length: s.coins }, (_, k) => {
                const a = (k / s.coins) * Math.PI * 2;
                const rr = s.coins > 1 ? Math.min(s.w, s.d) * 14 : 0;
                return <Coin key={k} x={x + Math.cos(a) * rr} y={y + Math.sin(a) * rr * 0.5} r={8} />;
              })}
              {s.logo && <Img x={x} y={y - 10} w={34} href={s.logo} />}
              <Pin x={x} y={y - Math.max(s.w, s.d) * 9 - 16} text={`${s.name} ${s.val}`} fs={14} opacity={chains} />
            </g>
          );
        })}
        <Pin x={P(98, 23)[0] + 40} y={P(98, 23)[1] + 10} text={G.moveVal} sub={L.cctp} fs={14} color={K.usdcDark} bg={K.usdcSoft} pointer={false} opacity={chains} />
      </g>

      {/* freezes: 105 lockers, each ≈ 73 blacklisted addresses */}
      <g opacity={locks}>
        {Array.from({ length: 105 }, (_, k) => {
          const col = k % 21, row = Math.floor(k / 21);
          const q = st(locks, k * 0.004, k * 0.004 + 0.3);
          return <Box key={k} i={89 + col * 0.66} j={6.2 + row * 0.66} w={0.46} d={0.46} h={10} z={(1 - q) * 30} color={k < 5 ? K.usdc : K.usdt} opacity={q} />;
        })}
        <Pin x={P(90, 6.4, 14)[0]} y={P(90, 6.4, 14)[1]} text={G.lockUsdc} fs={14} color={K.usdcDark} />
        <Pin x={P(100.5, 7.5, 14)[0]} y={P(100.5, 7.5, 14)[1]} text={G.lockUsdt} fs={14} color="#1d7b5c" />
        <Pin x={P(96, 10.2)[0]} y={P(96, 10.2)[1] + 54} text={G.frozen} sub={G.lockNote} fs={14} pointer={false} />
      </g>

      {/* Circle HQ, New York */}
      <Box i={101.5} j={-3.2} w={2.6} d={2.6} h={168 * rise} color="#f4f8fd" top="#e2ebf6" />
      {rise > 0.6 && <Windows i={101.5} j={-3.2} w={2.6} d={2.6} h={168 * rise * 0.9} rows={8} color="#bcd3ee" opacity={0.9} />}
      <Box i={101.5} j={-3.2} w={2.6} d={2.6} h={8} z={168 * rise - 22} color={K.usdc} noTop />
      <Pin x={P(102.8, -1.9, 168 * rise + 22)[0]} y={P(102.8, -1.9, 168 * rise + 22)[1]} text={G.hq} fs={hq > 0.05 ? 15 : 13} opacity={0.4 + 0.6 * hq} />
    </g>
  );
}

/* ───────────────────────── I · The rules (chapter 7) */
function RulesRaw({ g, t, reduced }: Props) {
  const L = t.map, R = t.scenes.rules;
  const p = g - 7;
  const rise = riseAt(g, 7);
  const us = st(p, -0.15, 0.05);
  const eu = st(p, 0.16, 0.24);
  const sp = st(p, 0.36, 0.44);
  const needle = st(p, 0.4, 0.56);
  const gate = (i: number, j: number, col: string) => (
    <g>
      <Box i={i} j={j - 1.4} w={0.5} d={0.5} h={56 * rise} color={col} />
      <Box i={i} j={j + 0.9} w={0.5} d={0.5} h={56 * rise} color={col} />
      <Box i={i} j={j - 1.4} w={0.5} d={2.8} h={10} z={56 * rise} color={col} />
    </g>
  );
  const tb = P(112.4, -1.7, 64 * rise + 30);
  return (
    <g>
      <Road a={[106, 3]} b={[124, 3]} />
      {/* Circle National Trust */}
      <Box i={111} j={-3} w={3} d={2.6} h={6} color={K.stone} />
      {[0, 1, 2, 3].map((k) => (
        <Box key={k} i={111.25 + k * 0.75} j={-0.6} w={0.28} d={0.28} h={56 * rise} z={6} color="#fbfaf7" />
      ))}
      <Box i={111} j={-3} w={3} d={2.2} h={56 * rise} z={6} color="#eef3fa" />
      <Box i={110.9} j={-3.1} w={3.2} d={2.8} h={8} z={62 * rise} color={K.usdc} />
      <Roof i={110.9} j={-3.1} w={3.2} d={2.8} z={62 * rise + 8} rise={18 * rise} color={K.usdcDark} />
      <Pin x={tb[0]} y={tb[1] - 10} text={R.trust} sub={R.trustSub} fs={15} color={K.usdcDark} opacity={us} />

      {/* US gate */}
      {gate(109, 3, "#33435a")}
      <Pin x={P(109.25, 3, 90 * rise)[0]} y={P(109.25, 3, 90 * rise)[1]} text={L.usGate} fs={15} opacity={rise} />
      <Board x={P(113.5, 6.5)[0] + 30} y={P(113.5, 6.5)[1]} w={240} h={140} opacity={us * (1 - eu)}>
        {R.usNeeds.map((n, k) => (
          <g key={n}>
            <circle cx={24} cy={28 + k * 26} r={9} fill={K.usdc} />
            <path d={`M19,${28 + k * 26} l4,4 l7,-8`} fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
            <T x={42} y={33 + k * 26} fs={13} anchor="start" weight={600}>{n}</T>
          </g>
        ))}
        {R.countdown.map((c, k) => (
          <g key={c.d}>
            <circle cx={30 + k * 90} cy={110} r={6} fill={k === 2 ? K.usdcDark : "#fff"} stroke={K.usdcDark} strokeWidth={2} />
            <T x={30 + k * 90} y={128} fs={9.5} weight={700}>{c.d}</T>
          </g>
        ))}
        <line x1={36} x2={204} y1={110} y2={110} stroke={K.usdcDark} strokeWidth={1.5} />
      </Board>
      <Flow d={L2(P(106.5, 3, 12), P(113, 3, 12))} n={3} dur={2.4} reduced={reduced} opacity={us} />

      {/* EU gate with a ring of stars */}
      {gate(117, 3, "#2c4f9e")}
      {Array.from({ length: 12 }, (_, k) => {
        const a = (k / 12) * Math.PI * 2;
        const [x, y] = P(117.25, 3, 56 * rise + 40);
        return <circle key={k} cx={x + Math.cos(a) * 22} cy={y + Math.sin(a) * 22} r={3.2} fill={K.gold} opacity={rise} />;
      })}
      <Pin x={P(117.25, 3, 56 * rise + 74)[0]} y={P(117.25, 3, 56 * rise + 74)[1]} text={L.euGate} fs={15} opacity={rise} />
      <Flow d={L2(P(114, 3, 12), P(121, 3, 12))} n={3} dur={2.4} reduced={reduced} opacity={eu} />
      <g opacity={eu}>
        <Coin x={P(115.8, 4.1, 12)[0]} y={P(115.8, 4.1, 12)[1]} r={12} kind="usdt" />
        <path d={`M${P(115.8, 4.1, 12)[0] - 14},${P(115.8, 4.1, 12)[1] - 14} l28,28 m0,-28 l-28,28`} stroke={K.red} strokeWidth={4} strokeLinecap="round" />
        <Pin x={P(116, 8)[0]} y={P(116, 8)[1] + 70} text={R.euNote} fs={13} pointer={false} />
      </g>

      {/* S&P gauge */}
      <Board x={P(121.5, 7.5)[0] + 40} y={P(121.5, 7.5)[1]} w={300} h={200} opacity={sp}>
        <T x={150} y={26} fs={12} weight={700} color={K.mute}>{R.sp}</T>
        {(() => {
          const cx = 150, cy = 150, r = 100;
          const cols = [K.usdc, "#7fb2ea", "#e0c04a", "#e8892b", K.red];
          const seg = (k: number) => {
            const a0 = Math.PI + (k / 5) * Math.PI + 0.02, a1 = Math.PI + ((k + 1) / 5) * Math.PI - 0.02;
            const q = (a: number, rr: number) => `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
            return `M${q(a0, r)} A${r},${r} 0 0 1 ${q(a1, r)} L${q(a1, r - 30)} A${r - 30},${r - 30} 0 0 0 ${q(a0, r - 30)} Z`;
          };
          const ang = Math.PI + lerp(0.9, 0.3, needle) * Math.PI;
          const angT = Math.PI + 0.9 * Math.PI;
          return (
            <g>
              {cols.map((c, k) => (
                <path key={k} d={seg(k)} fill={c} opacity={k === 1 ? 1 : 0.45} />
              ))}
              {[1, 2, 3, 4, 5].map((n, k) => {
                const a = Math.PI + ((k + 0.5) / 5) * Math.PI;
                return <T key={n} x={cx + Math.cos(a) * (r - 15)} y={cy + Math.sin(a) * (r - 15) + 4} fs={11} weight={800} color="#fff">{n}</T>;
              })}
              <Coin x={cx + Math.cos(angT) * (r + 22)} y={cy + Math.sin(angT) * (r + 22)} r={10} kind="usdt" />
              <line x1={cx} y1={cy} x2={cx + Math.cos(ang) * (r - 40)} y2={cy + Math.sin(ang) * (r - 40)} stroke={K.ink} strokeWidth={5} strokeLinecap="round" />
              <circle cx={cx} cy={cy} r={8} fill={K.ink} />
              <T x={cx} y={cy + 32} fs={20} weight={800} color={K.usdcDark}>{R.spVal}</T>
            </g>
          );
        })()}
      </Board>
    </g>
  );
}

/* ───────────────────────── Islands and sea routes, drawn first */
export function Ground({ reduced }: { reduced: boolean }) {
  const route = (a: XY, b: XY) => `M${a[0]},${a[1]} L${b[0]},${b[1]}`;
  const legs: [XY, XY][] = [
    [P(9.5, 2.5), P(11.8, 1.5)],
    [P(23, 1.5), P(24, 3)],
    [P(39.2, 4), P(39.8, 4)],
    [P(55, 4), P(55.8, 2.5)],
    [P(71.5, 4), P(72, 8)],
    [P(85.5, 10), P(88, 6)],
    [P(105, 3), P(105.8, 3)],
  ];
  return (
    <g>
      <Island i={0} j={0} w={9} d={6} />
      <Island i={-3} j={12.6} w={6} d={5.4} fill="#f4efe0" />
      <Island i={12} j={-3} w={11} d={9.6} />
      <Island i={24} j={0.4} w={15.2} d={13} />
      <Island i={40} j={-4} w={15} d={17.6} />
      <Island i={56} j={-3} w={15.5} d={8.5} />
      <Island i={72} j={6} w={13.5} d={13} />
      <Island i={88} j={-4} w={17} d={15.6} />
      <Island i={88.6} j={13.6} w={8} d={8} />
      <Island i={98.2} j={13.6} w={3.2} d={3.2} />
      <Island i={98.2} j={18.7} w={2.8} d={2.8} />
      <Island i={90.6} j={23} w={5.2} d={4.2} />
      <Island i={106} j={-4} w={19} d={16} />
      {legs.map(([a, b], k) => (
        <path key={k} d={route(a, b)} stroke={K.road} strokeWidth={18} strokeLinecap="round" />
      ))}
      {!reduced && <rect x={-2000} y={-1000} width={9000} height={5000} fill="url(#waves)" opacity={0.5} className="waves" />}
    </g>
  );
}

/* memoised wrappers: each district only re-renders while its own g window moves */
const eq = (a: Props, b: Props) => a.g === b.g && a.t === b.t && a.reduced === b.reduced && a.vi === b.vi;
const HoiAnM = memo(HoiAnRaw, eq), MintM = memo(MintRaw, eq), VaultM = memo(VaultRaw, eq), MoneyM = memo(MoneyRaw, eq), RoadM = memo(RoadRaw, eq), SvbM = memo(SvbRaw, eq), GrowthM = memo(GrowthRaw, eq), RulesM = memo(RulesRaw, eq);

/** clamp g into the windows where a district actually changes */
const gate = (g: number, ranges: [number, number][]) => {
  for (const [a, b] of ranges) if (g >= a && g <= b) return g;
  // outside every window: snap to the nearest window edge below (or the first start)
  let best = ranges[0][0];
  for (const [a, b] of ranges) if (g > b) best = b;
  return best;
};

export function Districts({ g, t, reduced, vi }: Omit<Props, "g"> & { g: number }) {
  const q = (v: number) => Math.round(v * 500) / 500;
  return (
    <g>
      <HoiAnM g={q(gate(g, [[-1, 1.4], [4.1, 4.6], [9.9, 10.4]]))} t={t} reduced={reduced} vi={vi} />
      <MintM g={q(gate(g, [[0, 2.1]]))} t={t} reduced={reduced} vi={vi} />
      <VaultM g={q(gate(g, [[1, 3.7]]))} t={t} reduced={reduced} vi={vi} />
      <MoneyM g={q(gate(g, [[2, 4.9]]))} t={t} reduced={reduced} vi={vi} />
      <RoadM g={q(gate(g, [[3, 5.1]]))} t={t} reduced={reduced} vi={vi} />
      <SvbM g={q(gate(g, [[4, 6.1]]))} t={t} reduced={reduced} vi={vi} />
      <GrowthM g={q(gate(g, [[5, 7.1]]))} t={t} reduced={reduced} vi={vi} />
      <RulesM g={q(gate(g, [[6, 8.1]]))} t={t} reduced={reduced} vi={vi} />
    </g>
  );
}
