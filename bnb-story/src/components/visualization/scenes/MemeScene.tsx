"use client";
/**
 * Act 3 (inside the BNB chapter) · Meme coins. One post sparks hundreds of
 * copycat tokens; the "4" meme and October 2025's meme season; then the
 * typical rise-and-dump shape and how much single wallets reportedly held.
 * Images of CZ were supplied by the site owner and are credited on screen.
 */
import { useMemo } from "react";
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSegmentTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("bnb");
/** Share of supply in one wallet at peak — claims by an on-chain analyst (Cointelegraph, Oct 2025). */
const CONC = [
  { name: "PALU", pct: 39 },
  { name: "币安人生", pct: 23 },
  { name: "4", pct: 14 },
];

function rnd(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function MemeScene() {
  const { t } = useI18n();
  const L = t.scenes.memes;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSegmentTimeline(
    IDX,
    0.55,
    1,
    { vis: 0, post: 0, spawn: 0, four: 0, chart: 0, conc: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { post: 1, duration: 0.1 }, at(-0.04))
        .to(v, { spawn: 1, duration: 0.2, ease: "none" }, at(0.06))
        .to(v, { four: 1, duration: 0.12 }, at(0.28))
        .to(v, { chart: 1, duration: 0.22, ease: "none" }, at(0.58))
        .to(v, { conc: 1, duration: 0.14 }, at(0.7))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  const dots = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        x: 130 + rnd(i) * 740,
        y: 560 + rnd(i + 300) * 190,
        r: 8 + rnd(i + 600) * 10,
        d: rnd(i + 900),
      })),
    [],
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const post = smooth(v.post);
  const spawn = v.spawn;
  const four = smooth(v.four);
  const chart = v.chart;
  const conc = smooth(v.conc);
  const s1 = 1 - four;
  const s2 = four * (1 - smooth(clamp(chart * 4)));
  const ts = 15 * Math.min(k, 1.35);

  // illustrative meme chart: slow start, spike, insiders sell, long bleed
  const X0 = 150;
  const X1 = 850;
  const Y0 = 470;
  const Y1 = 200;
  const shape = (u: number) => {
    if (u < 0.18) return 0.04 + u * 0.3;
    if (u < 0.42) return 0.09 + Math.pow((u - 0.18) / 0.24, 2.2) * 0.91;
    if (u < 0.48) return 1 - ((u - 0.42) / 0.06) * 0.55;
    return 0.45 * Math.exp(-(u - 0.48) * 4.2) + 0.03;
  };
  const N = 120;
  const pts: string[] = [];
  for (let i = 0; i <= N * chart; i++) {
    const u = i / N;
    pts.push(`${i === 0 ? "M" : "L"}${(X0 + (X1 - X0) * u).toFixed(1)},${(Y0 - (Y0 - Y1) * shape(u)).toFixed(1)}`);
  }
  const px = (u: number) => X0 + (X1 - X0) * u;
  const py = (u: number) => Y0 - (Y0 - Y1) * shape(u);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* --- stage 1: one post, hundreds of coins --- */}
      {s1 > 0.01 && (
        <g opacity={s1}>
          <g opacity={post} transform={`translate(0,${lerp(20, 0, post)})`}>
            <defs>
              <clipPath id="meme-illus">
                <rect x={190} y={110} width={620} height={349} rx={16} />
              </clipPath>
            </defs>
            <image href={asset("/img/cz-memes.jpg")} x={190} y={110} width={620} height={349} clipPath="url(#meme-illus)" preserveAspectRatio="xMidYMid slice" />
            <Label x={810} y={480} anchor="end" size={fs(8)} upper={false} spacing="0.02em">
              {L.illusCredit}
            </Label>
            <text x={500} y={530} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 17 * Math.min(k, 1.25), fontWeight: 600 }}>
              {L.postText}
            </text>
          </g>
          {dots.map((d, i) => {
            const q = smooth(clamp((spawn * 1.4 - d.d * 0.9) * 3));
            if (q <= 0.01) return null;
            return (
              <g key={i} opacity={q} transform={`translate(${d.x},${d.y + 20}) scale(${q})`}>
                <circle r={d.r} fill={i % 3 === 0 ? C.mint : C.yellow} opacity={0.85} />
              </g>
            );
          })}
          <g opacity={smooth(clamp(spawn * 2 - 0.6))}>
            <rect x={100} y={812} width={800} height={64} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={1.5} />
            <text x={500} y={852} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: 13 * Math.min(k, 1.45), fontWeight: 700 }}>
              {L.spawned}
            </text>
          </g>
        </g>
      )}

      {/* --- stage 2: the "4" meme --- */}
      {s2 > 0.01 && (
        <g opacity={s2} transform={`translate(0,${lerp(24, 0, four)})`}>
          <defs>
            <clipPath id="meme-four">
              <rect x={260} y={120} width={480} height={352} rx={16} />
            </clipPath>
          </defs>
          <image href={asset("/img/cz-four.jpg")} x={260} y={120} width={480} height={352} clipPath="url(#meme-four)" preserveAspectRatio="xMidYMid slice" />
          <Label x={740} y={494} anchor="end" size={fs(8)} upper={false} spacing="0.02em">
            {L.photoCredit}
          </Label>
          <text x={500} y={560} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 20 * Math.min(k, 1.25), fontWeight: 700 }}>
            {L.fourCaption}
          </text>
          <text x={500} y={670} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(15), fontWeight: 700 }}>
            {L.fourPeak}
          </text>
        </g>
      )}

      {/* --- stage 3: the shape of a meme coin, and who holds it --- */}
      {chart > 0.01 && (
        <g opacity={smooth(clamp(chart * 4))}>
          <Label x={X0} y={160} color={C.ink} size={fs(11)}>
            {L.chartTitle}
          </Label>
          <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke={C.line} strokeWidth={2} />
          <path d={pts.join(" ")} fill="none" stroke={C.gold} strokeWidth={4} strokeLinejoin="round" />
          {chart > 0.2 && (
            <g opacity={smooth(clamp((chart - 0.2) * 6))}>
              <circle cx={px(0.1)} cy={py(0.1)} r={8} fill={C.mint} />
              <text x={px(0.1)} y={py(0.1) - 18} textAnchor="middle" fill={C.mint} style={{ fontFamily: "var(--font-sans)", fontSize: ts, fontWeight: 600 }}>
                {L.early}
              </text>
            </g>
          )}
          {chart > 0.46 && (
            <g opacity={smooth(clamp((chart - 0.46) * 6))}>
              <circle cx={px(0.42)} cy={Y1} r={8} fill={C.warn} />
              <text x={px(0.42) + 18} y={Y1 + 6} fill={C.warn} style={{ fontFamily: "var(--font-sans)", fontSize: ts, fontWeight: 600 }}>
                {L.dump}
              </text>
              <circle cx={px(0.38)} cy={py(0.38)} r={8} fill={C.sky} />
              <text x={px(0.38) - 14} y={py(0.38) + 6} textAnchor="end" fill={C.sky} style={{ fontFamily: "var(--font-sans)", fontSize: ts, fontWeight: 600 }}>
                {L.late}
              </text>
            </g>
          )}
          <Label x={X0} y={Y0 + 30} size={fs(8)} upper={false} spacing="0.02em">
            {L.chartNote}
          </Label>
        </g>
      )}
      {conc > 0.01 && (
        <g opacity={conc}>
          <Label x={X0} y={570} color={C.ink} size={fs(11)}>
            {L.concTitle}
          </Label>
          {CONC.map((c, i) => {
            const y = 600 + i * 66;
            const w = 520 * (c.pct / 100) * conc;
            return (
              <g key={c.name}>
                <text x={X0} y={y + 26} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fs(13), fontWeight: 700 }}>
                  {c.name}
                </text>
                <rect x={300} y={y} width={520} height={36} rx={5} fill={C.line} />
                <rect x={300} y={y} width={w} height={36} rx={5} fill={C.warn} opacity={0.85} />
                <text x={310 + w} y={y + 25} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12), fontWeight: 700 }}>
                  {c.pct}%
                </text>
              </g>
            );
          })}
          <Label x={X0} y={822} size={fs(8)} upper={false} spacing="0.02em">
            {L.concNote}
          </Label>
          <text x={X1} y={880} textAnchor="end" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(14), fontWeight: 700 }}>
            {L.rush}
          </text>
        </g>
      )}
    </g>
  );
}
