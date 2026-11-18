"use client";
/**
 * Act 5 · Who leads Binance now — one picture. The three portraits pop in
 * around the Binance mark and the links between them draw themselves:
 * co-founders and partners, largest shareholder, the two co-CEOs.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSegmentTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("team");
const IMGS = ["/img/cz-four-art.png", "/img/yi-he.png", "/img/richard-teng.png"];
const MAP = [
  { x: 500, y: 215, r: 92 },
  { x: 185, y: 680, r: 86 },
  { x: 815, y: 680, r: 86 },
];
const LOGO = { x: 500, y: 520 };

export default function TeamScene() {
  const { t } = useI18n();
  const L = t.scenes.team;
  const k = useFontK();
  const mobile = k >= 1.5;
  const v = useSegmentTimeline(
    IDX,
    0,
    0.3,
    { vis: 0, pop: 0, links: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { pop: 3, duration: 0.36, ease: "none" }, at(-0.04))
        .to(v, { links: 1, duration: 0.36, ease: "none" }, at(0.2))
        .to(v, { exit: 1, duration: 0.06 }, at(0.9))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(0.97));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const lk = v.links;

  const links = [
    { a: MAP[0], b: MAP[1], label: L.links[0], col: C.peach, dash: true, fr: 0.5 },
    { a: MAP[0], b: LOGO, label: L.links[1], col: C.ink, dash: false, fr: 0.6 },
    { a: MAP[1], b: LOGO, label: L.links[2], col: C.gold, dash: false, fr: 0.5 },
    { a: MAP[2], b: LOGO, label: L.links[3], col: C.sky, dash: false, fr: 0.5 },
  ];

  return (
    <g opacity={v.vis * (1 - ex)}>
      <Label x={500} y={90} anchor="middle" color={C.ink} size={(mobile ? 13 : 11) * Math.min(k, 1.3)} opacity={smooth(clamp(v.pop))}>
        {L.mapTitle}
      </Label>

      {/* the Binance mark */}
      <g opacity={smooth(clamp(lk * 3))} transform={`translate(${LOGO.x},${LOGO.y}) scale(${lerp(0.7, 1, smooth(clamp(lk * 3)))})`}>
        <circle r={72} fill="#1e2026" />
        <image href={asset("/img/binance-logo.png")} x={-48} y={-26} width={96} height={52} />
      </g>

      {/* links */}
      {links.map((ln, i) => {
        const q = smooth(clamp(lk * 4 - i * 0.8));
        if (q <= 0.01) return null;
        const mx = ln.a.x + (ln.b.x - ln.a.x) * ln.fr;
        const my = ln.a.y + (ln.b.y - ln.a.y) * ln.fr;
        const cw = mobile ? 11 : 7.8;
        const lw = ln.label.length * cw + 26;
        return (
          <g key={i}>
            <line
              x1={ln.a.x}
              y1={ln.a.y}
              x2={ln.a.x + (ln.b.x - ln.a.x) * q}
              y2={ln.a.y + (ln.b.y - ln.a.y) * q}
              stroke={ln.col}
              strokeWidth={3}
              strokeDasharray={ln.dash ? "8 6" : undefined}
              strokeLinecap="round"
            />
            <g opacity={smooth(clamp(q * 2 - 1))} transform={`translate(${mx},${my})`}>
              <rect x={-lw / 2} y={-17} width={lw} height={34} rx={17} fill="#fff" stroke={ln.col} strokeWidth={1.5} />
              <text x={0} y={6} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: mobile ? 19 : 13.5, fontWeight: 600 }}>
                {ln.label}
              </text>
            </g>
          </g>
        );
      })}

      {/* portraits pop in one by one */}
      {L.people.map((p, i) => {
        const q = clamp(v.pop - i);
        if (q <= 0.01) return null;
        const s = q < 1 ? 0.6 + 0.5 * Math.sin(q * Math.PI * 0.75) : 1;
        const { x, y, r } = MAP[i];
        const side = i === 0;
        return (
          <g key={p.name} opacity={smooth(clamp(q * 2))}>
            <g transform={`translate(${x},${y}) scale(${s})`}>
              <image href={asset(IMGS[i])} x={-r} y={-r} width={r * 2} height={r * 2} />
            </g>
            <text
              x={side ? x + r + 20 : x}
              y={side ? y - 6 : y + r + 34}
              textAnchor={side ? "start" : "middle"}
              fill={C.ink}
              style={{ fontFamily: "var(--font-serif)", fontSize: mobile ? 30 : 22, fontWeight: 600 }}
            >
              {p.name}
            </text>
            <text
              x={side ? x + r + 20 : x}
              y={side ? y + (mobile ? 28 : 20) : y + r + (mobile ? 64 : 56)}
              textAnchor={side ? "start" : "middle"}
              fill={C.mute}
              style={{ fontFamily: "var(--font-mono)", fontSize: mobile ? 16 : 12, letterSpacing: "0.06em" }}
            >
              {p.role.toUpperCase()}
            </text>
          </g>
        );
      })}

      <Label x={500} y={950} anchor="middle" size={(mobile ? 12 : 8.5) * Math.min(k, 1.2)} upper={false} spacing="0.02em" opacity={mobile ? 0 : smooth(clamp(lk * 2 - 1))}>
        {L.note}
      </Label>
    </g>
  );
}
