"use client";
/**
 * Act 3 · Simulation 3 — staking. Validators lock 32 ETH; every 12 s one is
 * picked at random to propose and the rest vote. Honest work earns, being
 * offline costs a little, double-signing is slashed. The panel runs a year.
 */
import { useMemo } from "react";
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, mulberry32, smooth } from "@/lib/store";
import { DEPOSIT, SLASH_DAY, stakeBalance } from "@/lib/models";
import { C, EthGlyph, Label } from "../svg";

const IDX = chapterIndex("staking");
const N = 24;
const CX = 500;
const CY = 410;
const RR = 270;
const TONES = [C.mint, C.peach, C.warn];

function Stack({ x, y, s = 1, tone = C.lilac, h = 1 }: { x: number; y: number; s?: number; tone?: string; h?: number }) {
  const n = Math.max(1, Math.round(4 * h));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={0} cy={-i * 6} rx={15} ry={6} fill={tone} stroke={C.paper} strokeWidth={1.2} />
      ))}
    </g>
  );
}

export default function StakingScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.staking;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const order = useMemo(() => {
    const r = mulberry32(42);
    return Array.from({ length: 40 }, () => Math.floor(r() * N));
  }, []);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, ring: 0, slots: 0, rules: 0, inter: 0, day: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { ring: 1, duration: 0.14 }, at(-0.08))
        .to(v, { slots: 1, duration: 0.22, ease: "none" }, at(0.04))
        .to(v, { rules: 1, duration: 0.12 }, at(0.26))
        .to(v, { inter: 1, duration: 0.04 }, at(0.44))
        .to(v, { day: 365, duration: 0.42, ease: "none" }, at(0.47))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const inter = smooth(v.inter);
  const rules = smooth(v.rules) * (1 - inter);
  const ring = smooth(v.ring) * (1 - Math.max(inter, smooth(v.rules)));
  const nf = (n: number, d = 2) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

  const slotF = v.slots * 8;
  const slot = Math.floor(slotF);
  const sf = slotF - slot;
  const proposer = order[slot % order.length];
  const pos = (i: number) => ({ x: CX + Math.cos((i / N) * Math.PI * 2 - Math.PI / 2) * RR, y: CY + Math.sin((i / N) * Math.PI * 2 - Math.PI / 2) * RR * 0.86 });

  // chart for the year simulation
  const X0 = 150, X1 = 870, Y0 = 300, Y1 = 700;
  const B0 = 29, B1 = 33.2;
  const xOf = (d: number) => X0 + (d / 365) * (X1 - X0);
  const yOf = (b: number) => Y1 - ((b - B0) / (B1 - B0)) * (Y1 - Y0);
  const path = (beh: number, upTo: number) => {
    const pts: string[] = [];
    for (let d = 0; d <= upTo; d += 3) pts.push(`${xOf(d).toFixed(1)},${yOf(Math.max(B0, stakeBalance(beh, d, others))).toFixed(1)}`);
    pts.push(`${xOf(upTo).toFixed(1)},${yOf(Math.max(B0, stakeBalance(beh, upTo, others))).toFixed(1)}`);
    return "M" + pts.join("L");
  };
  const day = v.day;
  const others = 0.01;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* ring of validators */}
      <g opacity={ring}>
        <Label x={CX} y={80} anchor="middle" color={C.ink} size={fs(11)}>
          {L.staked}
        </Label>
        <circle cx={CX} cy={CY} r={58} fill={C.accentSoft} stroke={C.accent} strokeWidth={1.4} />
        <EthGlyph x={CX} y={CY - 4} s={1.1} />
        {v.slots > 0 && (
          <Label x={CX} y={CY + 84} anchor="middle" size={fs(9.5)} color={C.ink}>
            {L.slot} {slot + 1} · {Math.round(sf * 12)}s
          </Label>
        )}
        {Array.from({ length: N }, (_, i) => {
          const p = pos(i);
          const isP = v.slots > 0 && i === proposer;
          const vote = v.slots > 0 && !isP && sf > 0.35 && (i * 7 + slot) % 5 !== 0;
          return (
            <g key={i}>
              {vote && <line x1={p.x} y1={p.y} x2={lerp(p.x, CX, clamp((sf - 0.35) * 2.2))} y2={lerp(p.y, CY, clamp((sf - 0.35) * 2.2))} stroke={C.mint} strokeWidth={1} opacity={0.5} />}
              {isP && <line x1={p.x} y1={p.y} x2={lerp(p.x, CX, clamp(sf * 3))} y2={lerp(p.y, CY, clamp(sf * 3))} stroke={C.lilac} strokeWidth={3} />}
              {isP && <circle cx={p.x} cy={p.y - 10} r={28} fill="url(#glow)" />}
              <Stack x={p.x} y={p.y} tone={isP ? C.lilac : C.sky} s={isP ? 1.2 : 0.9} />
            </g>
          );
        })}
        {v.slots > 0 && v.slots < 1 && (
          <Label x={pos(proposer).x} y={pos(proposer).y - 40} anchor="middle" color={C.lilac} size={fs(9)}>
            {L.proposer}
          </Label>
        )}
        <Label x={CX} y={CY + 84 + fs(18)} anchor="middle" size={fs(9)} opacity={v.slots > 0 ? 1 : 0}>
          {L.deposit}
        </Label>
      </g>

      {/* carrot & stick */}
      {rules > 0.01 && (
        <g opacity={rules}>
          {L.rules.map((r, i) => {
            const x = lerp(210, 790, i / 2);
            const q = clamp(v.rules * 3 - i * 0.5);
            return (
              <g key={i} opacity={q} transform={`translate(${x},${430})`}>
                <rect x={-130} y={-150} width={260} height={300} rx={10} fill={C.paper} stroke={TONES[i]} strokeWidth={1.6} />
                <Stack x={0} y={-40} tone={TONES[i]} s={1.6} h={i === 2 ? 0.4 : 1} />
                {i === 2 && <circle cx={0} cy={-60} r={50} fill="url(#glow-warn)" />}
                <text x={0} y={44} textAnchor="middle" fill={TONES[i]} style={{ fontFamily: "var(--font-mono)", fontSize: fs(18), fontWeight: 600 }}>
                  {r.delta}
                </text>
                <Label x={0} y={84} anchor="middle" color={C.ink} size={fs(10)}>
                  {r.name}
                </Label>
                {k < 1.5 && (
                  <Label x={0} y={108} anchor="middle" size={9.5} upper={false} spacing="0.02em">
                    {r.sub}
                  </Label>
                )}
              </g>
            );
          })}
        </g>
      )}

      {/* a year as a validator */}
      {inter > 0.01 && (
        <g opacity={inter}>
          <Label x={X0} y={Y0 - 50} color={C.ink} size={fs(10.5)} opacity={k < 1.5 ? 1 : 0}>
            {L.year}
          </Label>
          <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke={C.line} />
          {[30, 31, 32, 33].map((b) => (
            <g key={b}>
              <line x1={X0} x2={X1} y1={yOf(b)} y2={yOf(b)} stroke={C.line} strokeDasharray="2 6" />
              <text x={X0 - 8} y={yOf(b) + 4} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9) }}>
                {b}
              </text>
            </g>
          ))}
          {[0, 90, 180, 270, 365].map((d) => (
            <text key={d} x={xOf(d)} y={Y1 + fs(18)} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9) }}>
              {L.day} {d}
            </text>
          ))}
          {[0, 1, 2].map((b) => (
            <path key={`g${b}`} d={path(b, 365)} fill="none" stroke={TONES[b]} strokeWidth={1} opacity={0.15} strokeDasharray="3 4" />
          ))}
          {[0, 1, 2].map((b) => (
            <path key={b} d={path(b, day)} fill="none" stroke={TONES[b]} strokeWidth={3} strokeLinejoin="round" />
          ))}
          {day >= SLASH_DAY && (
            <g transform={`translate(${xOf(SLASH_DAY)},${yOf(stakeBalance(2, SLASH_DAY, others))})`}>
              <circle r={10 + Math.min(1, (day - SLASH_DAY) / 30) * 40} fill="none" stroke={C.warn} strokeWidth={2} opacity={1 - Math.min(1, (day - SLASH_DAY) / 30)} />
              <Label x={8} y={-16} color={C.warn} size={fs(9.5)}>
                {L.slashed}
              </Label>
            </g>
          )}
          {[0, 1, 2].map((b) => {
            const bal = stakeBalance(b, day, others);
            const chg = bal - DEPOSIT;
            return (
              <g key={`d${b}`}>
                <circle cx={xOf(day)} cy={yOf(Math.max(B0, bal))} r={6} fill={TONES[b]} stroke={C.paper} strokeWidth={2} />
                <text x={X1} y={Y1 + 90 + b * fs(22)} textAnchor="end" fill={TONES[b]} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 600 }}>
                  {L.rules[b].name} · {nf(bal, 2)} ETH ({chg >= 0 ? "+" : ""}
                  {nf(chg, 2)})
                </text>
              </g>
            );
          })}
          <Label x={X1} y={Y0 - 50} anchor="end" size={fs(10)} color={C.ink}>
            {L.day} {Math.round(day)} / 365
          </Label>
        </g>
      )}
    </g>
  );
}
