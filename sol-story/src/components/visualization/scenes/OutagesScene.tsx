"use client";
/**
 * Act 4 · Outages. A heartbeat of block production runs from 2021; it goes
 * flat at each full stop (labelled with date and length), then beats steadily
 * after February 2024 while a day counter climbs past 1,000. Finally a second
 * engine (Firedancer) joins the original software.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("outages");
const X0 = 90, X1 = 910, Y = 420, TA = 2021.5, TB = 2026.9;
const xOf = (t: number) => X0 + ((t - TA) / (TB - TA)) * (X1 - X0);
const OUT_T = [2021.704, 2022.33, 2022.42, 2022.75, 2023.153, 2024.1];
const OX = OUT_T.map(xOf);
const flatAt = (x: number) => OX.some((o) => Math.abs(x - o) < 14);

const HEART = (() => {
  const pts: string[] = [];
  for (let x = X0; x < X1; x += 36) {
    if (flatAt(x + 18)) {
      pts.push(`${x},${Y}`, `${x + 36},${Y}`);
    } else {
      pts.push(`${x},${Y}`, `${x + 13},${Y}`, `${x + 17},${Y - 30}`, `${x + 21},${Y + 18}`, `${x + 25},${Y}`, `${x + 36},${Y}`);
    }
  }
  return "M" + pts.join("L");
})();

export default function OutagesScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.outages;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, frame: 0, T: TA, eng: 0, fd: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { frame: 1, duration: 0.08 }, at(-0.02))
        .to(v, { T: 2021.8, duration: 0.2, ease: "none" }, at(0.02))
        .to(v, { T: 2023.3, duration: 0.22, ease: "none" }, at(0.26))
        .to(v, { T: TB, duration: 0.2, ease: "none" }, at(0.5))
        .to(v, { eng: 1, duration: 0.08 }, at(0.72))
        .to(v, { fd: 1, duration: 0.1 }, at(0.8))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const frame = smooth(v.frame);
  const T = v.T;
  const px = xOf(T);
  const eng = smooth(v.eng);
  const fd = smooth(v.fd);
  const days = Math.round(1015 * clamp((T - 2024.1) / (TB - 2024.1)));
  const shown = OUT_T.filter((o) => o <= T);
  const last = shown.length - 1;

  return (
    <g opacity={v.vis * (1 - ex)}>
      <defs>
        <clipPath id="out-clip">
          <rect x={0} y={0} width={Math.max(0, px)} height={1000} />
        </clipPath>
      </defs>
      <g opacity={frame}>
        <Label x={X0} y={105} size={fs(11)} color={C.ink}>
          {L.title}
        </Label>
        <line x1={X0} x2={X1} y1={Y} y2={Y} stroke={C.line} strokeWidth={1.5} />
        {[2022, 2023, 2024, 2025, 2026].map((y) => (
          <text key={y} x={xOf(y)} y={Y + 70} textAnchor="middle" fill={y <= T ? C.ink : C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
            {y}
          </text>
        ))}
        <g clipPath="url(#out-clip)">
          <path d={HEART} fill="none" stroke="#9945ff" strokeWidth={2.4} strokeLinejoin="round" />
          {OX.map((x, i) => (
            <line key={i} x1={x - 16} x2={x + 16} y1={Y} y2={Y} stroke={C.warn} strokeWidth={5} strokeLinecap="round" />
          ))}
        </g>
        <circle cx={px} cy={Y} r={6} fill={C.ink} />
      </g>

      {/* outage cards in two staggered rows, each tied to its flat spot */}
      {shown.map((o, i) => {
        const age = smooth(clamp((T - o) / 0.12));
        const x = OX[i];
        const item = L.list[i];
        const cx = 190 + (i % 3) * 310;
        const cy = i >= 3 ? 290 : 185;
        const f = Math.min(fs(11), 22);
        const w = 280;
        return (
          <g key={i} opacity={age * (i === last ? 1 : 0.75)}>
            <path d={`M${cx},${cy + f + 6} L${x},${Y - 34}`} stroke={C.warn} strokeDasharray="3 4" fill="none" />
            <rect x={cx - w / 2} y={cy - f - 6} width={w} height={f * 2 + 12} rx={12} fill="#fff" stroke={C.warn} strokeWidth={i === last ? 2.5 : 1.5} />
            <text x={cx} y={cy + f * 0.36} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: f }}>
              <tspan fill={C.warn} fontWeight={700}>{item.d}</tspan> · {item.h}
            </text>
          </g>
        );
      })}

      {/* day counter */}
      {T > 2024.12 && (
        <g opacity={smooth(clamp((T - 2024.12) / 0.3)) * (1 - eng * 0.5)}>
          <text x={xOf(2025.5)} y={Y + 175} textAnchor="middle" fill="#14b07c" style={{ fontFamily: "var(--font-serif)", fontSize: Math.min(fs(54), 92), fontWeight: 600 }}>
            {new Intl.NumberFormat(locale).format(days)}
          </text>
          <Label x={xOf(2025.5)} y={Y + 208} anchor="middle" size={fs(10.5)} color={C.ink}>
            {L.since}
          </Label>
          {!mobile && (
            <Label x={xOf(2025.5)} y={Y + 230} anchor="middle" size={fs(8.5)} upper={false} spacing="0.02em">
              {L.sinceNote}
            </Label>
          )}
        </g>
      )}

      {/* client diversity */}
      {eng > 0.01 && (
        <g opacity={eng} transform={`translate(0,${(1 - eng) * 20})`}>
          <Label x={X0} y={700} size={fs(11)} color={C.ink}>
            {L.clients}
          </Label>
          <rect x={X0} y={725} width={(X1 - X0) * (1 - fd * 0.3)} height={56} rx={14} fill="#b9b3cf" />
          <text x={X0 + 20} y={760} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 700 }}>
            {L.agave}
          </text>
          {fd > 0.01 && (
            <g opacity={fd}>
              <rect x={X0 + (X1 - X0) * 0.7 + 6} y={725} width={(X1 - X0) * 0.3 - 6} height={56} rx={14} fill="#14c98a" />
              <text x={X1 - 14} y={760} textAnchor="end" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: fs(11), fontWeight: 700 }}>
                {mobile ? "Firedancer" : L.fd}
              </text>
            </g>
          )}
          <Label x={X0} y={820} size={fs(9.5)} upper={false} spacing="0.02em" color={fd > 0.5 ? "#14b07c" : C.warn}>
            {fd > 0.5 ? L.share : L.one}
          </Label>
        </g>
      )}
    </g>
  );
}
