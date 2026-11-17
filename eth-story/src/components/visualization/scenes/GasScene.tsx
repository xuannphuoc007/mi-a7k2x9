"use client";
/**
 * Act 3 · Simulation 2 — gas. Each block is a bus that leaves every 12 s.
 * Full buses push the base ticket price up (up to 12.5% per block), empty
 * ones pull it down; the base part is burned, the tip goes to the builder.
 */
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useClock } from "@/hooks/useTween";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth, useStore } from "@/lib/store";
import { gasStore } from "@/lib/simStores";
import { baseFees, burnedEth, GAS_BLOCKS } from "@/lib/models";
import { C, Flame, Label } from "../svg";

const IDX = chapterIndex("gas");
const SEATS = 30;

function Bus({ x, y, fill, k, target }: { x: number; y: number; fill: number; k: number; target: boolean }) {
  const filled = Math.round(fill * SEATS);
  return (
    <g transform={`translate(${x},${y}) scale(1.3)`}>
      <rect x={-130} y={-62} width={260} height={110} rx={16} fill={C.paper} stroke={C.accent} strokeWidth={2} />
      <rect x={-130} y={-62} width={260} height={18} rx={9} fill={C.accent} opacity={0.35} />
      {Array.from({ length: SEATS }, (_, i) => {
        const c = i % 10;
        const r = Math.floor(i / 10);
        return <rect key={i} x={-112 + c * 23} y={-36 + r * 24} width={17} height={18} rx={3} fill={i < filled ? (i < SEATS / 2 ? C.lilac : C.peach) : C.line} />;
      })}
      {target && <line x1={-112 + 5 * 23 - 3} x2={-112 + 5 * 23 - 3} y1={-44} y2={40} stroke={C.mint} strokeWidth={2} strokeDasharray="4 3" />}
      <circle cx={-80} cy={52} r={14} fill={C.line} stroke={C.mute} />
      <circle cx={80} cy={52} r={14} fill={C.line} stroke={C.mute} />
      <Label x={0} y={84 + 4 * k} anchor="middle" size={9.5 * k} color={C.mute}>
        {Math.round(fill * 100)}%
      </Label>
    </g>
  );
}

export default function GasScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.gas;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const fullness = useStore(gasStore, (s) => s.fullness);
  const blocks = useStore(gasStore, (s) => s.blocks);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, bus: 0, fillS: 0, ticket: 0, inter: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { bus: 1, duration: 0.1 }, at(-0.08))
        .to(v, { fillS: 1, duration: 0.2, ease: "none" }, at(0.04))
        .to(v, { ticket: 1, duration: 0.14 }, at(0.26))
        .to(v, { inter: 1, duration: 0.06 }, at(0.44))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  const clock = useClock(v.vis > 0.01 && v.ticket > 0.1);
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const inter = smooth(v.inter);
  const nf = (n: number, d = 2) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

  // story mode: a bus fills to 1/2 then to full; interactive: the panel's fullness and block count
  const f = inter > 0.5 ? fullness : lerp(0.15, 0.9, smooth(v.fillS));
  const fees = baseFees(inter > 0.5 ? fullness : 0.5);
  const shown = inter > 0.5 ? clamp(blocks, 0, GAS_BLOCKS) : 0;
  const nDone = Math.floor(shown);
  const frac = shown - nDone;
  let burned = 0;
  for (let i = 0; i < nDone; i++) burned += burnedEth(fees[i], fullness);
  const base = fees[Math.min(nDone, GAS_BLOCKS)];

  // chart
  const CX0 = 140;
  const CX1 = 880;
  const CY0 = 170;
  const CY1 = 390;
  const maxB = Math.max(4.5, ...fees.slice(0, nDone + 1));
  const bw = (CX1 - CX0) / (GAS_BLOCKS + 1);
  const yOf = (b: number) => CY1 - (b / maxB) * (CY1 - CY0);
  const busX = 500 - smooth(frac) * 620;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* base fee chart */}
      <g opacity={inter}>
        <line x1={CX0} x2={CX1} y1={CY1} y2={CY1} stroke={C.line} />
        <line x1={CX0} x2={CX1} y1={yOf(1)} y2={yOf(1)} stroke={C.line} strokeDasharray="2 6" />
        <Label x={CX0} y={CY0 - 24} size={fs(9.5)} color={C.ink}>
          {L.chart}
        </Label>
        <Label x={CX1} y={yOf(1) - 6} anchor="end" size={fs(8.5)}>
          1 gwei
        </Label>
        {fees.slice(0, nDone + 1).map((b, i) => {
          const h = CY1 - yOf(b);
          const isNow = i === nDone;
          return (
            <g key={i}>
              <rect x={CX0 + i * bw + 4} y={yOf(b)} width={bw - 8} height={h} rx={3} fill={isNow ? C.accent : b >= 1 ? C.peach : C.mint} opacity={isNow ? 1 : 0.75} />
            </g>
          );
        })}
        <text x={CX1} y={CY0 + 6} textAnchor="end" fill={C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: fs(22), fontWeight: 600 }}>
          {nf(base, base < 10 ? 2 : 1)} gwei
        </text>
        <Label x={CX1} y={CY0 + 6 + fs(18)} anchor="end" size={fs(9)}>
          {L.baseNow} · {L.block} {nDone}/{GAS_BLOCKS}
        </Label>
      </g>

      {/* the story's intro text over the chart area */}
      <g opacity={(1 - inter) * smooth(v.bus)}>
        <Label x={500} y={230} anchor="middle" color={C.ink} size={fs(11)}>
          {L.every12}
        </Label>
        <Label x={500} y={260 + fs(4)} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em" opacity={1 - v.ticket}>
          {L.seat}
        </Label>
      </g>

      {/* buses */}
      <g opacity={smooth(v.bus)}>
        <line x1={0} x2={1000} y1={620} y2={620} stroke={C.line} strokeWidth={2} />
        <Bus x={inter > 0.5 ? busX : 500} y={560} fill={f} k={k} target />
        {inter > 0.5 && frac > 0 && <Bus x={busX + 620} y={560} fill={0} k={k} target />}
        <Label x={500 + 175} y={455} size={fs(8.5)} color={C.mint} opacity={1 - inter * 0.4}>
          {L.target}
        </Label>
      </g>

      {/* ticket split */}
      <g opacity={smooth(v.ticket)}>
        <g transform="translate(330,770)">
          <rect x={-120} y={-34} width={240} height={68} rx={6} fill={C.paper} stroke={C.ink} strokeWidth={1.4} strokeDasharray="0" />
          <line x1={40} x2={40} y1={-34} y2={34} stroke={C.ink} strokeDasharray="4 4" />
          <Label x={-40} y={6} anchor="middle" color={C.peach} size={fs(10)}>
            {L.base}
          </Label>
          <Label x={80} y={6} anchor="middle" color={C.mint} size={fs(10)}>
            {L.tip}
          </Label>
        </g>
        <path d="M290,808 C290,860 520,860 560,880" fill="none" stroke={C.peach} strokeWidth={1.6} strokeDasharray="4 5" />
        <Flame x={600} y={880} s={0.9} t={clock} />
        <Label x={660} y={870} color={C.peach} size={fs(10)}>
          {L.burned}
        </Label>
        {inter > 0.5 && (
          <Label x={660} y={870 + fs(18)} color={C.ink} size={fs(11)}>
            {nf(burned, 2)} ETH
          </Label>
        )}
        <path d="M410,736 C430,680 760,700 800,740" fill="none" stroke={C.mint} strokeWidth={1.6} strokeDasharray="4 5" />
        <circle cx={820} cy={760} r={26} fill={C.accentSoft} stroke={C.mint} strokeWidth={1.4} />
        <path d="M808,762 L818,772 L834,750" stroke={C.mint} strokeWidth={3} fill="none" strokeLinecap="round" />
        <Label x={820} y={810 + fs(4)} anchor="middle" color={C.mint} size={fs(9)}>
          {L.builder}
        </Label>
      </g>
    </g>
  );
}
