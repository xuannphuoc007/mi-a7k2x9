"use client";
/**
 * 2 · Inside the vault. 100 squares ≈ $68.1B of reserves on 12 Nov 2026.
 * Categories light up beat by beat: overnight repo (59), Treasury bills (29),
 * bank cash (11 + 1); a bracket marks ≈ 100 squares owed to holders; then a
 * stress test drops the 12 bank-cash squares and 88 remain.
 */
import { chapterIndex } from "@/data/coins/usdc/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { clamp, smooth } from "@/lib/store";
import { C, wrap } from "../svg";
import { fadeIn, fadeOut } from "@/hooks/useK";

const IDX = chapterIndex("vault");
const COUNTS = [59, 29, 11, 1];
const COLS = [C.green, C.sky2, C.cash, C.grey];
const BANK0 = 88; // first bank-cash square
const CAT: number[] = COUNTS.flatMap((n, c) => Array(n).fill(c));

export default function VaultScene() {
  const { t } = useI18n();
  const L = t.scenes.vault;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, fill: 0, c0: 0, c1: 0, c2: 0, c3: 0, all: 0, owed: 0, stress: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { fill: 1, duration: 0.14, ease: "none" }, at(0.0))
        .to(v, { c0: 1, duration: 0.08 }, at(0.17))
        .to(v, { c1: 1, duration: 0.08 }, at(0.35))
        .to(v, { c2: 1, duration: 0.08 }, at(0.53))
        .to(v, { c3: 1, duration: 0.08 }, at(0.53))
        .to(v, { all: 1, duration: 0.05 }, at(0.64))
        .to(v, { owed: 1, duration: 0.06 }, at(0.67))
        .to(v, { stress: 1, duration: 0.12, ease: "none" }, at(0.75))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const rev = [v.c0, v.c1, v.c2, v.c3].map(smooth);
  // which category is "in focus" right now
  let focus = -1;
  if (v.c2 > 0.5) focus = 23; // both kinds of bank cash together
  else if (v.c1 > 0.5) focus = 1;
  else if (v.c0 > 0.5) focus = 0;
  const all = smooth(v.all);
  const owed = smooth(v.owed);
  const c = mobile ? 50 : 56;
  const g = mobile ? 6 : 8;
  const W = 10 * c + 9 * g;
  const x0 = mobile ? 50 : 70;
  const y0 = 150;
  const lx = x0 + W + (mobile ? 30 : 50);
  return (
    <g opacity={v.vis * (1 - ex)}>
      <rect x={x0 - 22} y={y0 - 22} width={W + 44} height={W + 44} rx={24} fill="#ecebe3" stroke="#d6d3c6" strokeWidth={2} />
      {CAT.map((cat, i) => {
        const q = clamp(v.fill * 1.3 - i * 0.003);
        if (q <= 0.01) return null;
        const r = Math.floor(i / 10), col = i % 10;
        const x = x0 + col * (c + g), y = y0 + r * (c + g);
        const lit = rev[cat];
        const st = v.stress;
        const shake = cat >= 2 && st > 0 && st < 0.6 ? Math.sin(st * 90 + i) * 3 * (1 - st / 0.6) : 0;
        const fall = i >= BANK0 ? Math.max(0, (st - 0.45) / 0.55) : 0;
        const inFocus = focus === -1 || all > 0.5 || focus === cat || (focus === 23 && cat >= 2);
        const dim = inFocus ? 1 : 0.35 + 0.65 * all;
        return (
          <g key={i} opacity={q * dim * Math.max(0, 1 - fall * 1.6)} transform={fall > 0 ? `translate(${(i - 93.5) * 10 * fall},${fall * fall * 260}) rotate(${(i % 2 ? 1 : -1) * fall * 40},${x + c / 2},${y + c / 2})` : shake ? `translate(${shake},0)` : undefined}>
            <rect x={x} y={y} width={c} height={c} rx={9} fill="#f7f5ef" stroke="#cfccc0" strokeWidth={1.5} />
            <rect x={x} y={y} width={c} height={c} rx={9} fill={COLS[cat]} opacity={lit} />
            <rect x={x + 3} y={y + 3} width={c - 6} height={c * 0.4} rx={7} fill="#fff" opacity={0.16 * lit} />
          </g>
        );
      })}
      {/* owed bracket */}
      {owed > 0.01 && (
        <g opacity={owed}>
          <path d={`M${x0},${y0 + W + 44} v14 h${W} v-14`} fill="none" stroke={C.ink} strokeWidth={2} />
          <text x={x0} y={y0 + W + 58 + big(13, 22) * 1.8} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(12.5, 21), letterSpacing: "0.08em" }}>
            {L.owed}
          </text>
          <text x={x0} y={y0 + W + 58 + big(13, 22) * 3.4} fill={C.gd} style={{ fontFamily: "var(--font-sans)", fontSize: big(14, 22), fontWeight: 600 }}>
            {L.buffer}
          </text>
        </g>
      )}
      {/* stress test result */}
      {v.stress > 0.5 && (
        <g opacity={smooth((v.stress - 0.5) * 2)}>
          <rect x={x0 - 8} y={y0 + 7 * (c + g) - 76} width={W + 16} height={60} rx={30} fill={C.warn} />
          <text x={x0 + W / 2} y={y0 + 7 * (c + g) - 37} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 20), fontWeight: 600 }}>
            {L.stress}
          </text>
        </g>
      )}
      {/* insight cards over the dimmed part of the grid */}
      {(() => {
        const fundO = fadeIn(smooth(v.c0)) * fadeOut(smooth(v.c1));
        const wamO = fadeIn(smooth(v.c1)) * fadeOut(smooth(v.c2));
        const ch = 3 * (c + g) + 8;
        const wh = 4 * (c + g) + 8;
        return (
          <g>
            {fundO > 0.01 && (
              <g opacity={fundO} transform={`translate(${x0 - 8},${y0 + 7 * (c + g) - 8})`}>
                <rect width={W + 16} height={ch} rx={16} fill={C.paper} fillOpacity={0.97} stroke={C.gd} strokeWidth={2.5} />
                <text x={24} y={big(13, 20) + 18} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 19), letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {L.fundIf}
                </text>
                <text x={24} y={ch * 0.56} fill={C.gd} style={{ fontFamily: "var(--font-serif)", fontSize: mobile ? 60 : 66, fontWeight: 450 }}>
                  {L.fund}
                </text>
                <text x={24} y={ch * 0.56 + big(15, 22) * 1.7} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(15, 22), fontWeight: 500 }}>
                  {L.fundSub}
                </text>
                <text x={24} y={ch * 0.56 + big(15, 22) * 1.7 + big(12, 19) * 1.6} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(12, 19) }}>
                  {L.fundMore}
                </text>
              </g>
            )}
            {wamO > 0.01 && (
              <g opacity={wamO} transform={`translate(${x0 - 8},${y0 - 8})`}>
                <rect width={W + 16} height={wh} rx={16} fill={C.paper} fillOpacity={0.97} stroke={C.gd} strokeWidth={2.5} />
                {/* a calendar page torn to day 10 */}
                <g transform={`translate(${mobile ? 110 : 120},${wh / 2})`}>
                  <rect x={-70} y={-70} width={140} height={150} rx={14} fill="#fff" stroke={C.ink} strokeWidth={3} />
                  <rect x={-70} y={-70} width={140} height={38} rx={14} fill={C.green} />
                  <rect x={-70} y={-46} width={140} height={14} fill={C.green} />
                  {[-38, 38].map((dx) => (
                    <rect key={dx} x={dx - 5} y={-84} width={10} height={28} rx={5} fill={C.ink} />
                  ))}
                  <text y={58} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: 76, fontWeight: 500 }}>
                    {Math.max(1, Math.round(10 * Math.min(1, wamO * 1.4)))}
                  </text>
                </g>
                <text x={mobile ? 230 : 250} y={wh / 2 - 6} fill={C.gd} style={{ fontFamily: "var(--font-serif)", fontSize: big(48, 64), fontWeight: 500 }}>
                  {L.wam}
                </text>
                {wrap(L.wamSub, mobile ? 22 : 30).map((ln, k) => (
                  <text key={k} x={mobile ? 230 : 250} y={wh / 2 + big(15, 22) * (1.6 + k * 1.3)} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(15, 22) }}>
                    {ln}
                  </text>
                ))}
                <text x={mobile ? 230 : 250} y={wh / 2 + big(15, 22) * 1.6 + big(15, 22) * 1.3 * (wrap(L.wamSub, mobile ? 22 : 30).length - 1) + big(12, 19) * 1.9} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 19) }}>
                  {L.wamMore}
                </text>
              </g>
            )}
          </g>
        );
      })()}
      {/* legend */}
      <g opacity={clamp(v.fill * 2)}>
        <text x={x0 - 20} y={y0 - 50} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 20), letterSpacing: "0.14em" }}>
          {L.totalLabel}
        </text>
        <text x={x0 + W + 20} y={y0 - 50} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 20) }}>
          {L.tile}
        </text>
        <text x={lx} y={y0 + big(40, 60) * 0.8} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(32, 50), fontWeight: 420 }}>
          {L.totalVal}
        </text>
        {L.legend.map((it, i) => {
          const ly = y0 + big(40, 60) + 60 + i * big(70, 120);
          const on = rev[i];
          return (
            <g key={it.name} opacity={0.25 + 0.75 * on}>
              <rect x={lx} y={ly - 16} width={18} height={18} rx={4} fill={COLS[i]} />
              {(mobile ? [it.name.split(" (")[0]] : [it.name]).map((n) => (
                <text key={n} x={lx + 28} y={ly} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(15, 22), fontWeight: 500 }}>
                  {n.length > 26 && !mobile && n.includes(" (") ? n.slice(0, n.indexOf(" (")) : n}
                </text>
              ))}
              <text x={lx + 28} y={ly + big(15, 22) * 1.5} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 20) }}>
                {it.val} · {it.pct}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
