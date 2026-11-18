"use client";
/**
 * Act 4 · Meme coins. Pump.fun pops tokens like popcorn; a schematic chart of
 * daily launches peaks in January 2025; TRUMP and LIBRA spike and collapse;
 * the class-action card (alleged · denied); and Lily Liu's line that memecoins
 * do not define Solana.
 */
import { useMemo } from "react";
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, mulberry32, smooth } from "@/lib/store";
import { C, Label, Logo, Portrait } from "../svg";

const IDX = chapterIndex("memes");
/** schematic monthly bars Jan 2024 → Nov 2026 (relative), peak at Jan 2025 */
const BARS = [6, 10, 18, 22, 20, 24, 26, 30, 34, 48, 62, 78, 100, 60, 34, 30, 28, 30, 34, 36, 30, 26, 22, 24, 30, 26, 22, 20, 22, 24, 26, 24, 22, 20, 18];
const HX0 = 150, HX1 = 880, HB = 720, HH = 380;

function wrap(text: string, max: number) {
  const out: string[] = [];
  let line = "";
  for (const w of text.split(" ")) {
    if ((line + " " + w).trim().length > max) {
      out.push(line.trim());
      line = w;
    } else line += " " + w;
  }
  if (line.trim()) out.push(line.trim());
  return out;
}

/** spike-and-crash path in a panel */
function spike(x0: number, x1: number, yb: number, h: number, peakAt: number, end: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const f = i / 40;
    const y = f < peakAt ? Math.pow(f / peakAt, 2.2) : lerp(1, end, Math.pow((f - peakAt) / (1 - peakAt), 0.45));
    pts.push(`${lerp(x0, x1, f).toFixed(1)},${(yb - y * h).toFixed(1)}`);
  }
  return "M" + pts.join("L");
}
const TRUMP_D = spike(160, 460, 640, 300, 0.25, 0.14);
const LIBRA_D = spike(540, 840, 640, 300, 0.12, 0.05);

export default function MemesScene() {
  const { t } = useI18n();
  const L = t.scenes.memes;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const pops = useMemo(() => {
    const r = mulberry32(21);
    const A = "ABCDEFGHKLMNPRSTWXYZ";
    return Array.from({ length: 26 }, (_, i) => ({
      a: r() * Math.PI * 2,
      d: 170 + r() * 220,
      at: i / 26,
      name: "$" + Array.from({ length: 3 + Math.floor(r() * 2) }, () => A[Math.floor(r() * A.length)]).join(""),
      c: ["#9945ff", "#14c98a", "#19b3c9", "#f7931a", "#e0662f"][i % 5],
    }));
  }, []);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, logo: 0, pop: 0, hist: 0, coins: 0, crash: 0, suit: 0, quote: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { logo: 1, duration: 0.08 }, at(-0.02))
        .to(v, { pop: 1, duration: 0.16, ease: "none" }, at(0.03))
        .to(v, { hist: 1, duration: 0.14 }, at(0.2))
        .to(v, { coins: 1, duration: 0.08 }, at(0.39))
        .to(v, { crash: 1, duration: 0.12, ease: "none" }, at(0.42))
        .to(v, { suit: 1, duration: 0.08 }, at(0.58))
        .to(v, { quote: 1, duration: 0.08 }, at(0.76))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const logo = smooth(v.logo);
  const hist = smooth(v.hist);
  const coins = smooth(v.coins);
  const suit = smooth(v.suit);
  const quote = smooth(v.quote);
  const histO = hist * (1 - coins);
  const coinsO = coins * (1 - suit);
  const lg = { x: lerp(500, 110, hist), y: lerp(420, 120, hist), w: lerp(190, 64, hist) };
  const maxc = Math.floor(54 / Math.min(k, 1.9));

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* Pump.fun and popping tokens */}
      <Logo x={lg.x} y={lg.y} w={lg.w} h={lg.w * 1.25} href="/img/pumpfun.png" opacity={logo * (1 - suit * 0.6)} />
      {v.pop > 0.01 &&
        hist < 0.99 &&
        pops.map((p, i) => {
          const q = clamp((v.pop - p.at * 0.8) * 4);
          if (q <= 0) return null;
          const life = q < 0.6 ? q / 0.6 : 1 - (q - 0.6) / 0.4;
          const x = 500 + Math.cos(p.a) * p.d * smooth(clamp(q * 1.3));
          const y = 420 + Math.sin(p.a) * p.d * 0.85 * smooth(clamp(q * 1.3));
          return (
            <g key={i} opacity={life * (1 - hist)} transform={`translate(${x},${y})`}>
              <circle r={26} fill={p.c} opacity={0.9} />
              <text y={4} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700 }}>
                {p.name}
              </text>
            </g>
          );
        })}

      {/* daily launches, schematic */}
      {histO > 0.01 && (
        <g opacity={histO}>
          <Label x={HX0} y={235} size={fs(10.5)} color={C.ink}>
            {L.launches}
          </Label>
          <line x1={HX0} x2={HX1} y1={HB} y2={HB} stroke={C.ink} strokeOpacity={0.3} />
          {BARS.map((b, i) => {
            const w = (HX1 - HX0) / BARS.length;
            const h = (b / 100) * HH * smooth(clamp(hist * 2 - i / BARS.length));
            const peak = b === 100;
            return <rect key={i} x={HX0 + i * w + 2} y={HB - h} width={w - 4} height={h} rx={3} fill={peak ? C.warn : "#9945ff"} opacity={peak ? 1 : 0.45} />;
          })}
          {["2024", "2025", "2026"].map((y, i) => (
            <text key={y} x={HX0 + ((i * 12 + 0.5) * (HX1 - HX0)) / BARS.length} y={HB + 28} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
              {y}
            </text>
          ))}
          <Label x={HX0 + (12.5 * (HX1 - HX0)) / BARS.length + 16} y={HB - HH - 6} size={fs(10)} color={C.warn} opacity={smooth(clamp(hist * 2 - 1))}>
            {L.peak}
          </Label>
        </g>
      )}

      {/* TRUMP and LIBRA */}
      {coinsO > 0.01 && (
        <g opacity={coinsO}>
          {[
            { d: TRUMP_D, name: "TRUMP", note: L.trumpNote, x: 310 },
            { d: LIBRA_D, name: "LIBRA", note: L.libraNote, x: 690 },
          ].map((c) => (
            <g key={c.name}>
              <text x={c.x} y={280} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(24), fontWeight: 600 }}>
                {c.name}
              </text>
              <line x1={c.x - 150} x2={c.x + 150} y1={640} y2={640} stroke={C.line} strokeWidth={2} />
              <path d={c.d} fill="none" stroke={C.warn} strokeWidth={3} pathLength={1} strokeDasharray={`${smooth(v.crash)} 1`} />
              <Label x={c.x} y={mobile && c.name === "LIBRA" ? 720 : 680} anchor="middle" size={fs(10)} color={C.warn} opacity={smooth(clamp(v.crash * 2 - 1))}>
                {c.note}
              </Label>
            </g>
          ))}
          <Label x={500} y={790} anchor="middle" size={fs(10.5)} color={C.ink} opacity={smooth(clamp(v.crash * 2 - 1))}>
            {L.losers}
          </Label>
        </g>
      )}

      {/* the lawsuit */}
      {suit > 0.01 && (
        <g opacity={suit * (1 - quote * 0.92)} transform={`translate(500,${lerp(420, 400, suit)})`}>
          {(() => {
            const lh = fs(14) * 1.35;
            const wrapped = L.caseLines.map((ln) => wrap(ln, maxc));
            const total = wrapped.reduce((n, w) => n + w.length * lh + 26, 0);
            const H = total + 130;
            let yy = -H / 2 + 105;
            return (
              <g>
                <rect x={-330} y={-H / 2} width={660} height={H} rx={14} fill="#fff" stroke={C.ink} strokeWidth={2} />
                <Label x={0} y={-H / 2 + 50} anchor="middle" size={fs(11)} color={C.ink}>
                  {L.caseTitle}
                </Label>
                {wrapped.map((lines, i) => {
                  const g = (
                    <text key={i} x={-290} y={yy} fill={i === 2 ? C.warn : C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fs(14), fontWeight: i === 2 ? 700 : 500 }}>
                      {lines.map((l, j) => (
                        <tspan key={j} x={-290} dy={j ? lh : 0}>
                          {l}
                        </tspan>
                      ))}
                    </text>
                  );
                  yy += lines.length * lh + 26;
                  return g;
                })}
                <g transform={`translate(230,${-H / 2 - 10}) rotate(-10)`}>
                  <rect x={-100} y={-28} width={200} height={56} rx={8} fill="#fff" stroke={C.warn} strokeWidth={4} />
                  <Label x={0} y={8} anchor="middle" size={Math.min(fs(13), 24)} color={C.warn}>
                    ALLEGED
                  </Label>
                </g>
              </g>
            );
          })()}
        </g>
      )}

      {/* the foundation's line */}
      {quote > 0.01 && (
        <g opacity={quote}>
          <rect x={120} y={700} width={760} height={150} rx={75} fill="#fff" stroke={C.accent} strokeWidth={2} />
          <Portrait x={200} y={775} r={58} href="/img/lily-liu.png" />
          {wrap(L.quote, mobile ? 30 : 46).map((l, i, arr) => (
            <text key={i} x={285} y={775 + (i - (arr.length - 1) / 2) * fs(15) * 1.35 + 6} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(15), fontStyle: "italic" }}>
              {l}
            </text>
          ))}
        </g>
      )}
    </g>
  );
}
