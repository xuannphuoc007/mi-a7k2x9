"use client";
/**
 * Act 4 · Follow the money. Two taps (new ETH in, burned fees out), the real
 * supply line since The Merge, four ideas people mix up, and a see-saw for
 * the supply calculator in the panel.
 */
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useClock } from "@/hooks/useTween";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { issuancePerYear } from "@/lib/models";
import { DATA_END, MERGE_T, SUPPLY, supplyAt } from "@/lib/ethSeries";
import { C, EthGlyph, Flame, Label } from "../svg";

const IDX = chapterIndex("economics");

// supply chart frame
const T0 = 2022.55;
const T1 = 2026.5;
const S0 = 119.8;
const S1 = 121.95;
const X0 = 130;
const X1 = 880;
const Y0 = 220;
const Y1 = 720;
const sx = (X1 - X0) / (T1 - T0);
const sy = (Y1 - Y0) / (S1 - S0);
const xOf = (t: number) => X0 + (t - T0) * sx;
const yOf = (s: number) => Y1 - (s - S0) * sy;
const M = `matrix(${sx},0,0,${-sy},${X0 - T0 * sx},${Y1 + S0 * sy})`;
const LOW_T = 2024.2;
const SUPPLY_PATH = "M" + SUPPLY.filter(([t]) => t >= T0).map(([t, s]) => `${t.toFixed(4)},${s.toFixed(4)}`).join("L");

export default function EconomicsScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.economics;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, taps: 0, busy: 0, chart: 0, draw: 0, four: 0, saw: 0, year: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { taps: 1, duration: 0.1 }, at(-0.06))
        .to(v, { busy: 1, duration: 0.18, ease: "none" }, at(0.06))
        .to(v, { taps: 0, duration: 0.05 }, at(0.25))
        .to(v, { chart: 1, duration: 0.05 }, at(0.27))
        .to(v, { draw: 1, duration: 0.18, ease: "none" }, at(0.28))
        .to(v, { chart: 0, duration: 0.05 }, at(0.5))
        .to(v, { four: 1, duration: 0.1 }, at(0.52))
        .to(v, { four: 0, duration: 0.05 }, at(0.7))
        .to(v, { saw: 1, duration: 0.05 }, at(0.72))
        .to(v, { year: 1, duration: 0.08 }, at(0.84))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  const clock = useClock(v.vis > 0.01 && (v.taps > 0.01 || v.saw > 0.01));
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

  // --- taps: quiet day (level rises) → busy day (level falls)
  const taps = smooth(v.taps);
  const busy = v.busy;
  const busyOn = busy > 0.5;
  const level = busy < 0.5 ? lerp(0.45, 0.62, busy / 0.5) : lerp(0.62, 0.4, (busy - 0.5) / 0.5);
  const burnW = busyOn ? 16 : 4;

  // --- chart reveal
  const tNow = lerp(T0, DATA_END, v.draw);
  const chart = smooth(v.chart);

  // --- see-saw: a busy year like 2023, then a quiet one like 2026
  const yq = smooth(v.year);
  const staked = lerp(20, 41.4, yq);
  const burnDay = lerp(3000, 300, yq);
  const iss = issuancePerYear(staked);
  const burn = burnDay * 365;
  const net = iss - burn;
  const supplyNow = 121.72e6;
  const tilt = clamp(net / 1.5e6, -1, 1) * 0.22;
  const saw = smooth(v.saw);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* two taps */}
      {taps > 0.01 && (
        <g opacity={taps}>
          {/* tank */}
          <rect x={350} y={380} width={300} height={320} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={1.6} />
          <rect x={354} y={380 + 320 * (1 - level)} width={292} height={316 * level} rx={6} fill={C.accent} opacity={0.35} />
          <EthGlyph x={500} y={380 + 320 * (1 - level / 2)} s={1.4} />
          <Label x={640} y={360} anchor="end" color={C.ink} size={fs(10)}>
            {L.supply}
          </Label>
          {/* inflow */}
          <path d="M180,250 H390 V300" fill="none" stroke={C.line} strokeWidth={22} strokeLinecap="round" />
          <rect x={384} y={300} width={12} height={380 + 320 * (1 - level) - 300} fill={C.lilac} opacity={0.8} />
          <Label x={180} y={220} color={C.lilac} size={fs(10)}>
            {L.newEth}
          </Label>
          {/* outflow */}
          <path d="M600,700 V780 H780" fill="none" stroke={C.line} strokeWidth={22} strokeLinecap="round" />
          <rect x={600 - burnW / 2} y={700} width={burnW} height={60} fill={C.peach} opacity={0.8} />
          <Flame x={820} y={790} s={busyOn ? 1.3 : 0.6} t={clock} />
          <Label x={780} y={850 + fs(4)} anchor="middle" color={C.peach} size={fs(10)}>
            {L.burned}
          </Label>
          <Label x={500} y={900 + fs(10)} anchor="middle" color={busyOn ? C.peach : C.lilac} size={fs(11)}>
            {busyOn ? L.busy : L.quiet}
          </Label>
        </g>
      )}

      {/* real supply since The Merge */}
      {chart > 0.01 && (
        <g opacity={chart}>
          <defs>
            <clipPath id="ec-reveal">
              <rect x={0} y={0} width={xOf(tNow)} height={1000} />
            </clipPath>
          </defs>
          <Label x={X0} y={Y0 - 40} color={C.ink} size={fs(10.5)} opacity={k < 1.5 ? 1 : 0}>
            {L.chart}
          </Label>
          {[120, 121].map((s) => (
            <g key={s}>
              <line x1={X0} x2={X1} y1={yOf(s)} y2={yOf(s)} stroke={C.line} strokeDasharray="2 6" />
              <text x={X0 - 8} y={yOf(s) + 4} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9) }}>
                {s}M
              </text>
            </g>
          ))}
          {[2023, 2024, 2025, 2026].map((y) => (
            <text key={y} x={xOf(y)} y={Y1 + fs(20)} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9) }}>
              {y}
            </text>
          ))}
          <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke={C.line} />
          <path d={SUPPLY_PATH} transform={M} fill="none" stroke={C.ink} strokeOpacity={0.12} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <g clipPath="url(#ec-reveal)">
            <path d={SUPPLY_PATH} transform={M} fill="none" stroke={C.lilac} strokeWidth={3} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </g>
          <line x1={xOf(MERGE_T)} x2={xOf(MERGE_T)} y1={Y0} y2={Y1} stroke={C.accent} strokeDasharray="3 4" />
          <Label x={xOf(MERGE_T) + 6} y={Y0 + 10} color={C.accent} size={fs(9)}>
            The Merge
          </Label>
          {tNow > LOW_T && (
            <g>
              <circle cx={xOf(LOW_T)} cy={yOf(supplyAt(LOW_T))} r={6} fill={C.mint} />
              <Label x={xOf(LOW_T)} y={yOf(supplyAt(LOW_T)) + 26 + fs(4)} anchor="middle" color={C.mint} size={fs(9)}>
                ≈{nf(supplyAt(LOW_T), 1)}M
              </Label>
            </g>
          )}
          <circle cx={xOf(tNow)} cy={yOf(supplyAt(tNow))} r={7} fill={C.lilac} stroke={C.paper} strokeWidth={2} />
          <text x={X1} y={Y0 - 40} textAnchor="end" fill={C.lilac} style={{ fontFamily: "var(--font-mono)", fontSize: fs(20), fontWeight: 600 }}>
            {nf(supplyAt(tNow), 2)}M
          </text>
        </g>
      )}

      {/* four different things */}
      {v.four > 0.01 && (
        <g opacity={smooth(v.four)}>
          {L.four.map((c, i) => {
            const x = i % 2 ? 720 : 280;
            const y = i < 2 ? 330 : 640;
            const q = clamp(v.four * 4 - i * 0.6);
            const col = [C.mint, C.sky, C.lilac, C.peach][i];
            return (
              <g key={i} opacity={q} transform={`translate(${x},${y})`}>
                <rect x={-190} y={-110} width={380} height={220} rx={10} fill={C.paper} stroke={col} strokeWidth={1.6} />
                <text x={0} y={-30} textAnchor="middle" fill={col} style={{ fontFamily: "var(--font-serif)", fontSize: 22 * Math.min(k, 1.25) }}>
                  {c.name}
                </text>
                <Label x={0} y={18} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em" color={C.ink}>
                  {c.what}
                </Label>
                {k < 1.5 && (
                  <Label x={0} y={52} anchor="middle" size={9.5} upper={false} spacing="0.02em">
                    {c.eg}
                  </Label>
                )}
              </g>
            );
          })}
          {[
            [500, 330],
            [500, 640],
            [280, 485],
            [720, 485],
          ].map(([x, y], i) => (
            <text key={i} x={x} y={y + 14} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-serif)", fontSize: 44 }}>
              ≠
            </text>
          ))}
        </g>
      )}

      {/* see-saw */}
      {saw > 0.01 && (
        <g opacity={saw}>
          <Label x={500} y={160} anchor="middle" color={C.ink} size={fs(10.5)}>
            {L.perYear}
          </Label>
          <Label x={500} y={160 + fs(24)} anchor="middle" color={yq < 0.5 ? C.peach : C.lilac} size={fs(11)}>
            {yq < 0.5 ? L.busyYear : L.quietYear}
          </Label>
          <g transform={`translate(500,520) rotate(${(-tilt * 180) / Math.PI})`}>
            <rect x={-380} y={-8} width={760} height={16} rx={8} fill={C.ink} opacity={0.85} />
            <g transform="translate(-300,-8)">
              <rect x={-90} y={-Math.min(200, 40 + iss / 8000)} width={180} height={Math.min(200, 40 + iss / 8000)} rx={6} fill={C.lilac} opacity={0.85} />
            </g>
            <g transform="translate(300,-8)">
              <rect x={-90} y={-Math.min(200, 40 + burn / 8000)} width={180} height={Math.min(200, 40 + burn / 8000)} rx={6} fill={C.peach} opacity={0.85} />
            </g>
          </g>
          <path d="M470,600 L500,530 L530,600 Z" fill={C.mute} />
          <Label x={200} y={680} anchor="middle" color={C.lilac} size={fs(10)}>
            {L.created}
          </Label>
          <text x={200} y={680 + fs(28)} textAnchor="middle" fill={C.lilac} style={{ fontFamily: "var(--font-mono)", fontSize: fs(17), fontWeight: 600 }}>
            +{nf(iss / 1000)}k
          </text>
          <Label x={800} y={680} anchor="middle" color={C.peach} size={fs(10)}>
            {L.burned}
          </Label>
          <text x={800} y={680 + fs(28)} textAnchor="middle" fill={C.peach} style={{ fontFamily: "var(--font-mono)", fontSize: fs(17), fontWeight: 600 }}>
            −{nf(burn / 1000)}k
          </text>
          <text x={500} y={830} textAnchor="middle" fill={net >= 0 ? C.lilac : C.mint} style={{ fontFamily: "var(--font-mono)", fontSize: fs(24), fontWeight: 600 }}>
            {net >= 0 ? "+" : "−"}
            {nf(Math.abs((net / supplyNow) * 100), 2)}%
          </text>
          <Label x={500} y={830 + fs(22)} anchor="middle" size={fs(9.5)}>
            {net >= 0 ? L.grows : L.shrinks}
          </Label>
        </g>
      )}
    </g>
  );
}
