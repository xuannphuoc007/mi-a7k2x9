"use client";
/**
 * Act 2 · The Journey. A calm 2020–2026 chart: one clean price line draws
 * itself, a price tag rides the tip, and each event drops in as a numbered
 * pin. Below the axis an era strip fills like a progress bar, and a single
 * news card swaps as each pin is reached. No glows, bursts or shaking —
 * everything is a pure function of scroll, so it plays backwards exactly.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { journeyEvents, type JEvent } from "@/data/coins/sol/events";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { FIRST_T, LAST_T, NEWS_FROM, NEWS_LOG_PATH, PRICE_LOG_AREA, PRICE_LOG_PATH, fmtDate, priceAt, usd } from "@/lib/solSeries";
import { C, Label } from "../svg";

const IDX = chapterIndex("journey");

const T0 = 2020.0;
const T1 = 2027.0;
const X0 = 90;
const X1 = 920;
const YT = 200;
const YB = 610;
const STRIP_Y = 650;
const CARD_Y = 735;
const L0 = Math.log10(0.3);
const L1 = Math.log10(900);
const sx = (X1 - X0) / (T1 - T0);
const sy = (YB - YT) / (L1 - L0);
const xOf = (t: number) => X0 + (t - T0) * sx;
const yOf = (p: number) => YB - (Math.log10(p) - L0) * sy;
const M = `matrix(${sx},0,0,${-sy},${X0 - T0 * sx},${YB + L0 * sy})`;
const LINE = "#7a3ff0";

const ERAS: [number, number, string][] = [
  [2020.2, 2021.0, "#b9b3cf"],
  [2021.0, 2021.9, "#9945ff"],
  [2021.9, 2023.8, "#d9304f"],
  [2023.8, 2025.1, "#14b07c"],
  [2025.1, 2026.95, "#5b5675"],
];

const isBad = (e: JEvent) => e.kind === "hack" || e.kind === "crash" || e.kind === "legal" || e.kind === "outage";
const tone = (e: JEvent) => (isBad(e) ? C.warn : e.kind === "peak" ? C.mint : C.ink);
const yEvent = (e: JEvent) => {
  const p = priceAt(e.t);
  return p === null ? YB - 10 : yOf(p);
};

/** chapter-local progress → playhead year (piecewise, aligned with the text beats) */
const KEYS: [number, number][] = [
  [0.04, 2020.2],
  [0.2, 2021.0],
  [0.38, 2021.95],
  [0.56, 2023.1],
  [0.74, 2025.3],
  [0.9, LAST_T + 0.005],
];

export default function JourneyScene() {
  const { t, lang, locale } = useI18n();
  const L = t.scenes.journey;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, frame: 0, T: KEYS[0][1], exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06)).to(v, { frame: 1, duration: 0.14 }, at(-0.1));
      for (let i = 1; i < KEYS.length; i++) {
        tl.to(v, { T: KEYS[i][1], duration: KEYS[i][0] - KEYS[i - 1][0], ease: "none" }, at(KEYS[i - 1][0]));
      }
      tl.to(v, { exit: 1, duration: 0.1 }, at(0.9)).to(v, { vis: 0, duration: 0.02, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const T = v.T;
  const frame = smooth(v.frame);
  const px = xOf(Math.min(T, LAST_T));
  const price = priceAt(Math.min(T, LAST_T));
  const started = price !== null && T >= FIRST_T;
  const py = started ? yOf(price!) : YB;

  const visible = journeyEvents.filter((e) => e.t <= T + 0.002);
  const current = visible.length ? visible[visible.length - 1] : null;
  const curIdx = current ? journeyEvents.indexOf(current) : -1;
  // card swap: 0 → 1 over a short stretch after each new event
  const swap = current ? smooth(clamp((T - current.t) / 0.12)) : 0;

  const eraIdx = ERAS.findIndex(([a, b]) => T >= a && T < b);
  const tagLeft = px > X1 - 130;

  return (
    <g opacity={v.vis * (1 - ex)}>
      <defs>
        <clipPath id="jr-reveal">
          <rect x={0} y={0} width={Math.max(0, px)} height={1000} />
        </clipPath>
        <linearGradient id="jr-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9945ff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#14c98a" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g opacity={frame}>
        {/* year, top-left */}
        <text x={X0} y={150} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(46), fontWeight: 600, letterSpacing: "-0.02em" }}>
          {Math.floor(Math.min(T, 2026.99))}
        </text>
        {!mobile && (
          <Label x={X1} y={140} anchor="end" size={fs(8.5)}>
            {L.price}
          </Label>
        )}

        {/* light grid */}
        {[1, 10, 100].map((p) => (
          <g key={p}>
            <line x1={X0} x2={X1} y1={yOf(p)} y2={yOf(p)} stroke={C.line} strokeWidth={1} />
            <text x={X0 - 8} y={yOf(p) + 4} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
              ${p.toLocaleString("en-US")}
            </text>
          </g>
        ))}
        <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={C.ink} strokeOpacity={0.35} strokeWidth={1.2} />

        {/* the line */}
        <g clipPath="url(#jr-reveal)">
          <path d={PRICE_LOG_AREA} transform={M} fill="url(#jr-area)" />
          <path d={PRICE_LOG_PATH} transform={M} fill="none" stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d={NEWS_LOG_PATH} transform={M} fill="none" stroke={LINE} strokeWidth={2.4} strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
        </g>
        {T > NEWS_FROM && !mobile && (
          <Label x={xOf(NEWS_FROM) - 6} y={YT - 14} anchor="end" size={fs(8)} color={C.mute}>
            {L.news} ⋯
          </Label>
        )}

        {/* pins */}
        {journeyEvents.map((e, i) => {
          const age = T - e.t;
          if (age < -0.002) return null;
          const drop = smooth(clamp(age / 0.18));
          const x = xOf(e.t);
          const y = yEvent(e);
          const isCur = i === curIdx;
          const c = tone(e);
          const r = isCur ? 13 : 9;
          const pinY = lerp(y - 70, y - 26, drop);
          return (
            <g key={e.id} opacity={drop}>
              <line x1={x} x2={x} y1={pinY + r} y2={y} stroke={c} strokeWidth={1.4} />
              <circle cx={x} cy={y} r={3} fill={c} />
              <circle cx={x} cy={pinY} r={r} fill={isCur ? c : C.paper} stroke={c} strokeWidth={2} />
              <text x={x} y={pinY + (isCur ? 5 : 4)} textAnchor="middle" fill={isCur ? "#fff" : c} style={{ fontFamily: "var(--font-mono)", fontSize: isCur ? 13 : 10, fontWeight: 700 }}>
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* price tag riding the tip */}
        {started && T < LAST_T + 0.01 && (
          <g transform={`translate(${px},${py})`}>
            <circle r={5} fill={LINE} stroke={C.paper} strokeWidth={2} />
            <g transform={`translate(${tagLeft ? -14 : 14},0)`}>
              <rect x={tagLeft ? -112 : 0} y={-17} width={112} height={34} rx={17} fill={C.ink} />
              <text x={tagLeft ? -56 : 56} y={6} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700 }}>
                {usd(price!, locale)}
              </text>
            </g>
          </g>
        )}

        {/* era strip: fills like a progress bar */}
        {ERAS.map(([a, b, col], i) => {
          const fill = clamp((T - a) / (b - a));
          return (
            <g key={i}>
              <rect x={xOf(a) + 1} y={STRIP_Y} width={Math.max(0, (b - a) * sx - 2)} height={10} rx={5} fill={C.line} />
              <rect x={xOf(a) + 1} y={STRIP_Y} width={Math.max(0, ((b - a) * sx - 2) * fill)} height={10} rx={5} fill={col} />
            </g>
          );
        })}
        {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
          <text key={y} x={xOf(y)} y={STRIP_Y - 8} textAnchor="middle" fill={y <= T ? C.ink : C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
            {y}
          </text>
        ))}
        {eraIdx >= 0 && (
          <text
            x={Math.min(X1 - 90, Math.max(X0 + 90, (xOf(ERAS[eraIdx][0]) + xOf(Math.min(T, ERAS[eraIdx][1]))) / 2))}
            y={STRIP_Y + 36}
            textAnchor="middle"
            fill={ERAS[eraIdx][2] === "#b9b3cf" ? C.mute : ERAS[eraIdx][2]}
            style={{ fontFamily: "var(--font-mono)", fontSize: fs(10), fontWeight: 700, letterSpacing: "0.12em" }}
          >
            {L.eras[eraIdx].toUpperCase()}
          </text>
        )}
      </g>

      {/* news card: slides in from the right each time a pin lands */}
      {current && <EventCard e={current} n={curIdx + 1} lang={lang} k={k} s={swap} price={priceAt(current.t)} locale={locale} />}
    </g>
  );
}

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

function EventCard({ e, n, lang, k, s, price, locale }: { e: JEvent; n: number; lang: "en" | "vi"; k: number; s: number; price: number | null; locale: string }) {
  const title = e[lang].title;
  const fsT = 19 * Math.min(k, 1.4);
  const showBody = k < 1.5;
  const body = showBody ? wrap(e[lang].body, 78) : [];
  const h = 30 * Math.min(k, 1.6) + fsT + 18 + body.length * 22;
  const c = tone(e);
  const dx = (1 - s) * 40;
  return (
    <g opacity={s} transform={`translate(${dx},0)`} pointerEvents="none">
      <rect x={X0} y={CARD_Y} width={X1 - X0} height={h} rx={14} fill="#fff" stroke={C.line} strokeWidth={1.5} />
      <circle cx={X0 + 34} cy={CARD_Y + 34} r={18} fill={c} />
      <text x={X0 + 34} y={CARD_Y + 40} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700 }}>
        {n}
      </text>
      <text x={X0 + 66} y={CARD_Y + 24 * Math.min(k, 1.6)} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 12 * Math.min(k, 1.5), letterSpacing: "0.1em" }}>
        {fmtDate(e.t, lang).toUpperCase()}
        {price !== null ? ` · ${usd(price, locale)}` : ""}
      </text>
      <text x={X0 + 66} y={CARD_Y + 24 * Math.min(k, 1.6) + fsT + 8} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fsT, fontWeight: 600 }}>
        {title}
      </text>
      {body.map((l, i) => (
        <text key={i} x={X0 + 66} y={CARD_Y + 24 * Math.min(k, 1.6) + fsT + 36 + i * 22} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: 16 }}>
          {l}
        </text>
      ))}
    </g>
  );
}
