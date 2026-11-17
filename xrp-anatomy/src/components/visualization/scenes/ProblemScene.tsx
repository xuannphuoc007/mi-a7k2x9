"use client";
/**
 * Act 1 · The Problem. Maria's $200 hops through a chain of banks: each stop
 * bites off a fee, the dollars turn into pesos, and cash sits parked in
 * accounts along the way. World Bank averages appear as the evidence.
 */
import { chapterIndex } from "@/data/coins/xrp/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth, useStore } from "@/lib/store";
import { problemStore } from "@/lib/simStores";
import { C, Label } from "../svg";

const IDX = chapterIndex("problem");

/** World Bank Remittance Prices Worldwide, Q3 2025 — average cost of sending $200 */
export const CHANNEL_PCT = { bank: 14.9, post: 5.5, mto: 4.7, mobile: 4.6 };
export const GLOBAL_PCT = 6.3;
export const TARGET_PCT = 3;
/** panel channel index → % */
export const PANEL_CHANNELS = [CHANNEL_PCT.bank, CHANNEL_PCT.mto, CHANNEL_PCT.mobile];

const ROW_Y = 330;

function Bank({ x, y, s = 1, warn = 0 }: { x: number; y: number; s?: number; warn?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-26} y={-26} width={52} height={52} rx={4} fill={C.paper} stroke={warn > 0.5 ? C.warn : C.ink} strokeWidth={1.4} />
      <path d="M-15,-7 L0,-17 L15,-7 Z M-12,-4 V11 M-4,-4 V11 M4,-4 V11 M12,-4 V11 M-17,14 H17" stroke={C.ink} fill="none" strokeWidth={1.3} strokeLinejoin="round" />
    </g>
  );
}

function Person({ x, y, accent }: { x: number; y: number; accent?: boolean }) {
  const c = accent ? C.accent : C.ink;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={34} fill="url(#glow)" opacity={accent ? 0.7 : 0.25} />
      <circle cy={-10} r={10} fill="none" stroke={c} strokeWidth={1.6} />
      <path d="M-17,20 C-15,4 15,4 17,20" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

export default function ProblemScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.problem;
  const k = useFontK();
  const channel = useStore(problemStore, (s) => s.channel);
  const hops = useStore(problemStore, (s) => s.hops);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, people: 0, chain: 0, flow: 0, bars: 0, parked: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.05, ease: "none" }, at(-0.22))
        .to(v, { people: 1, duration: 0.14 }, at(-0.2))
        .to(v, { chain: 1, duration: 0.16, ease: "none" }, at(0.12))
        .to(v, { flow: 1, duration: 0.24, ease: "none" }, at(0.3))
        .to(v, { bars: 1, duration: 0.14 }, at(0.4))
        .to(v, { parked: 1, duration: 0.14 }, at(0.82))
        .to(v, { exit: 1, duration: 0.18 }, at(0.98))
        .to(v, { vis: 0, duration: 0.04, ease: "none" }, at(1.16));
    },
  );
  if (v.vis <= 0.001) return null;

  const ex = smooth(v.exit);
  const pct = PANEL_CHANNELS[channel] ?? GLOBAL_PCT;
  const totalFee = (200 * pct) / 100;

  // nodes: sender · Maria's bank · partner banks… · mother's bank · mother
  const banks = hops + 2;
  const n = banks + 2;
  const xs = Array.from({ length: n }, (_, i) => lerp(90, 910, i / (n - 1)));
  const pts = xs.map((x, i) => ({ x, y: ROW_Y + (i === 0 || i === n - 1 ? 0 : Math.sin((i / (n - 1)) * Math.PI) * -40) }));
  const names = [L.sender, L.yourBank, ...Array.from({ length: hops }, () => L.corr), L.famBank, L.family];

  // envelope position along the chain
  const seg = (n - 1) * clamp(v.flow);
  const si = Math.min(n - 2, Math.floor(seg));
  const sf = seg - si;
  const env = { x: lerp(pts[si].x, pts[si + 1].x, smooth(sf)), y: lerp(pts[si].y, pts[si + 1].y, smooth(sf)) - 92 };
  const passed = (b: number) => clamp(seg - b); // bank node index b (1..banks) passed?
  let taken = 0;
  for (let b = 1; b <= banks; b++) taken += (totalFee / banks) * smooth(clamp(passed(b) * 3));
  const value = 200 - taken;
  const fxDone = passed(banks) > 0.2;
  const chainP = (i: number) => clamp(v.chain * (n - 1) - (i - 1) + 0.3);

  // bars (evidence)
  const bars: [string, number][] = [
    [L.channels[0], CHANNEL_PCT.bank],
    [L.channels[1], CHANNEL_PCT.post],
    [L.channels[2], CHANNEL_PCT.mto],
    [L.channels[3], CHANNEL_PCT.mobile],
  ];
  const selBar = [0, 2, 3][channel];
  const bx0 = 330;
  const bx = (p: number) => bx0 + (p / 16) * 560;
  const by0 = 630;
  const fs = (s: number) => s * k;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* links */}
      {pts.slice(0, -1).map((p, i) => {
        const q = pts[i + 1];
        const lp = clamp(chainP(i + 1));
        const mx = (p.x + q.x) / 2;
        const d = `M${p.x},${p.y} Q${mx},${Math.min(p.y, q.y) - 34} ${q.x},${q.y}`;
        return <path key={`l${i}-${n}`} d={d} fill="none" stroke={C.mute} strokeWidth={1.3} strokeDasharray="3 5" pathLength={1} opacity={lp} />;
      })}

      {/* nodes */}
      {pts.map((p, i) => {
        const isPerson = i === 0 || i === n - 1;
        const o = isPerson ? smooth(v.people) : smooth(chainP(i));
        const label = names[i];
        const below = false;
        return (
          <g key={`n${i}-${n}`} opacity={o}>
            {isPerson ? <Person x={p.x} y={p.y} accent={i === n - 1} /> : <Bank x={p.x} y={p.y} s={lerp(0.6, 1, o)} />}
            {(isPerson || k < 1.5) && (
              <Label x={p.x} y={p.y + (below || isPerson ? 52 + fs(6) : -40)} anchor="middle" color={isPerson ? C.ink : C.mute} size={fs(isPerson ? 10.5 : 9.2)}>
                {label}
              </Label>
            )}
            {/* fee bite */}
            {!isPerson && passed(i) > 0 && (
              <g opacity={clamp(passed(i) * 4) * (1 - v.parked * 0.85)} transform={`translate(${p.x},${p.y + 46 + clamp(passed(i)) * 24})`}>
                <rect x={-fs(26)} y={-fs(10)} width={fs(52)} height={fs(18)} rx={fs(9)} fill={C.paper} stroke={C.warn} strokeWidth={1} />
                <text y={fs(3.5)} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
                  −${(totalFee / banks).toFixed(2)}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* parked cash under partner banks */}
      {v.parked > 0.01 &&
        pts.slice(2, n - 1).map((p, i) => {
          const h = 70 * smooth(v.parked);
          return (
            <g key={`v${i}-${n}`} transform={`translate(${p.x},${p.y + 60})`} opacity={smooth(v.parked)}>
              <rect x={-30} y={0} width={60} height={86} fill="none" stroke={C.warn} strokeDasharray="3 3" />
              {Array.from({ length: 7 }, (_, s) => (
                <rect key={s} x={-24} y={80 - (s + 1) * 10} width={48} height={7} rx={1.5} fill={C.accent} opacity={(s + 1) * 10 <= h ? 0.75 : 0.08} />
              ))}
              <text y={104} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(8.5), letterSpacing: "0.08em" }}>
                {i === 0 ? L.parked.toUpperCase() : ""}
              </text>
            </g>
          );
        })}
      {v.parked > 0.5 && (
        <Label x={500} y={ROW_Y + 196} anchor="middle" color={C.warn} size={fs(9.5)} opacity={smooth((v.parked - 0.5) * 2)}>
          zz · {L.idle}
        </Label>
      )}

      {/* the envelope */}
      {v.flow > 0.001 && v.flow < 0.999 && (
        <g transform={`translate(${env.x},${env.y})`}>
          <circle r={30} fill="url(#glow)" />
          <rect x={-30} y={-18} width={60} height={36} rx={4} fill={C.paper} stroke={C.accent} strokeWidth={1.6} />
          <path d="M-30,-18 L0,4 L30,-18" fill="none" stroke={C.accent} strokeWidth={1.2} />
          <text y={-26} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 600 }}>
            {`$${value.toFixed(2)}${fxDone ? " → MXN" : ""}`}
          </text>
        </g>
      )}
      {/* sender wallet before the trip / delivered stamp after */}
      {v.flow < 0.01 && (
        <g transform={`translate(${pts[0].x},${pts[0].y - 70})`} opacity={smooth(v.people)}>
          <rect x={-34} y={-16} width={68} height={30} rx={4} fill={C.paper} stroke={C.accent} strokeWidth={1.4} />
          <text y={5} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(13), fontWeight: 600 }}>
            $200
          </text>
        </g>
      )}
      {v.flow >= 0.999 && (
        <g transform={`translate(${Math.min(pts[n - 1].x - 30, 990 - fs(62))},${pts[n - 1].y - (k < 1.5 ? 92 : 100)})`}>
          <rect x={-fs(62)} y={-fs(18)} width={fs(124)} height={fs(34)} rx={4} fill={C.accent} />
          <text y={fs(5)} textAnchor="middle" fill={C.paper} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 700 }}>
            ${(200 - totalFee).toFixed(2)} {L.arrives}
          </text>
        </g>
      )}


      {/* evidence: World Bank averages */}
      <g opacity={smooth(v.bars) * (1 - smooth(v.parked) * 0.75)}>
        <Label x={k < 1.5 ? bx0 - 230 : 30} y={by0 - 40} size={fs(k < 1.5 ? 9.5 : 7.6)} color={C.mute}>
          {L.chart}
        </Label>
        {bars.map(([name, p], i) => {
          const y = by0 + i * 46;
          const on = i === selBar;
          const w = (bx(p) - bx0) * smooth(clamp(v.bars * 1.6 - i * 0.15));
          return (
            <g key={name}>
              <Label x={bx0 - 12} y={y + 5} anchor="end" color={on ? C.ink : C.mute} size={fs(9.5)}>
                {name}
              </Label>
              <rect x={bx0} y={y - 11} width={Math.max(0, w)} height={22} fill={on ? C.warn : C.line} opacity={on ? 0.95 : 0.9} />
              <text x={bx0 + w + 8} y={y + 5} fill={on ? C.warn : C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(11), fontWeight: 600 }}>
                {p.toLocaleString(locale)}%
              </text>
            </g>
          );
        })}
        <line x1={bx(TARGET_PCT)} x2={bx(TARGET_PCT)} y1={by0 - 22} y2={by0 + 3 * 46 + 20} stroke={C.accent} strokeWidth={1.4} strokeDasharray="5 4" />
        <Label x={bx(TARGET_PCT) - 6} y={by0 + 3 * 46 + 36} anchor="end" color={C.accent} size={fs(9)}>
          {L.target}
        </Label>
        <line x1={bx(GLOBAL_PCT)} x2={bx(GLOBAL_PCT)} y1={by0 - 22} y2={by0 + 3 * 46 + 20} stroke={C.ink} strokeWidth={1} strokeDasharray="2 4" opacity={0.7} />
        <Label x={bx(GLOBAL_PCT) + 6} y={by0 + 3 * 46 + 36} color={C.ink} size={fs(9)}>
          avg {GLOBAL_PCT.toLocaleString(locale)}%
        </Label>
      </g>
    </g>
  );
}
