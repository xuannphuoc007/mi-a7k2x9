"use client";
/**
 * Act 2 · The Journey. A 2017–2026 timeline: BNB's price draws itself as the
 * playhead advances, era bands open behind it, and each event bursts as it is
 * crossed — red shockwaves (and a shake) for hacks and crashes, white
 * rays for peaks, blue-violet rings for upgrades and milestones. Everything is a pure function of
 * scroll, so it plays backwards exactly.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { journeyEvents, type JEvent } from "@/data/coins/bnb/events";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, smooth } from "@/lib/store";
import { FIRST_T, LAST_T, NEWS_FROM, NEWS_LOG_PATH, PRICE_LOG_AREA, PRICE_LOG_PATH, fmtDate, priceAt, usd } from "@/lib/bnbSeries";
import { C, Label } from "../svg";

const IDX = chapterIndex("journey");

const T0 = 2017.4;
const T1 = 2027.0;
const X0 = 70;
const X1 = 930;
const YT = 215;
const YB = 640;
const CARD_Y = 712;
const L0 = Math.log10(0.05);
const L1 = Math.log10(4000);
const sx = (X1 - X0) / (T1 - T0);
const sy = (YB - YT) / (L1 - L0);
const xOf = (t: number) => X0 + (t - T0) * sx;
const yOf = (p: number) => YB - (Math.log10(p) - L0) * sy;
const M = `matrix(${sx},0,0,${-sy},${X0 - T0 * sx},${YB + L0 * sy})`;
const BASE = YB - 20;

const ERAS: [number, number, "mute" | "accent" | "warn"][] = [
  [2017.53, 2018.1, "accent"],
  [2018.1, 2020.7, "mute"],
  [2020.7, 2022.4, "accent"],
  [2022.4, 2024.75, "warn"],
  [2024.75, 2026.95, "mute"],
];

const isBad = (e: JEvent) => e.kind === "hack" || e.kind === "crash" || e.kind === "legal";
const tone = (e: JEvent) => (isBad(e) ? C.warn : e.kind === "peak" ? C.ink : e.kind === "upgrade" ? C.lilac : C.accent);
const yEvent = (e: JEvent) => {
  const p = priceAt(e.t);
  return p === null ? BASE : yOf(p);
};

/** chapter-local progress → playhead year (piecewise, aligned with the text beats) */
const KEYS: [number, number][] = [
  [0.04, 2017.5],
  [0.22, 2020.0],
  [0.42, 2023.0],
  [0.62, 2025.0],
  [0.8, 2026.0],
  [0.9, LAST_T + 0.005],
];

function Burst({ e, q, x, y }: { e: JEvent; q: number; x: number; y: number }) {
  if (q <= 0 || q >= 1) return null;
  const o = 1 - q;
  if (isBad(e)) {
    const q2 = clamp((q - 0.2) / 0.8);
    return (
      <g transform={`translate(${x},${y})`} pointerEvents="none">
        <circle r={10 + q * 70} fill="none" stroke={C.warn} strokeWidth={2.5 * o + 0.4} opacity={o} />
        {q2 > 0 && <circle r={8 + q2 * 42} fill="none" stroke={C.warn} strokeWidth={2 * (1 - q2) + 0.4} opacity={(1 - q2) * 0.8} />}
        <circle r={22 + q * 22} fill="url(#glow-warn)" opacity={o * 0.8} />
              </g>
    );
  }
  if (e.kind === "peak") {
    return (
      <g transform={`translate(${x},${y})`} pointerEvents="none">
        {Array.from({ length: 14 }, (_, k) => {
          const a = (k / 14) * Math.PI * 2 + 0.2;
          const r1 = 12 + q * 22;
          const r2 = 20 + q * 55 * (k % 2 ? 0.7 : 1);
          return <line key={k} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={C.ink} strokeWidth={2.4 * o + 0.4} strokeLinecap="round" opacity={o} />;
        })}
        <circle r={10 + q * 34} fill="none" stroke={C.ink} strokeWidth={1.2} opacity={o * 0.6} />
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`} pointerEvents="none">
      <circle r={10 + q * 44} fill="none" stroke={e.kind === "upgrade" ? C.lilac : C.accent} strokeWidth={2.2 * o + 0.3} opacity={o * 0.9} />
      <circle r={22 + q * 22} fill="url(#glow)" opacity={o} />
    </g>
  );
}

export default function JourneyScene() {
  const { t, lang, locale } = useI18n();
  const L = t.scenes.journey;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const selected = null as string | null;
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
  const px = xOf(T);

  // scroll-tied shake right after a legal blow or crash
  let shake = 0;
  for (const e of journeyEvents) {
    if (!isBad(e)) continue;
    const q = (T - e.t) / 1.1;
    if (q >= 0 && q < 1) shake = Math.max(shake, 1 - q);
  }
  const sh = shake * shake;
  const shx = Math.sin(T * 900) * 2.5 * sh;
  const shy = Math.cos(T * 700) * 2 * sh;

  const price = priceAt(Math.min(T, LAST_T));
  const visible = journeyEvents.filter((e) => e.t <= T + 0.002);
  let current: JEvent | null = null;
  for (const e of visible) if (!current || e.t > current.t) current = e;
  const sel = selected ? journeyEvents.find((e) => e.id === selected) ?? null : null;
  const card = sel ?? current;

  return (
    <g opacity={v.vis * (1 - ex)}>
      <defs>
        <clipPath id="jr-reveal">
          <rect x={0} y={0} width={Math.max(0, px)} height={1000} />
        </clipPath>
        <clipPath id="jr-plot">
          <rect x={X0 - 4} y={YT - 60} width={X1 - X0 + 8} height={YB - YT + 64} />
        </clipPath>
        <linearGradient id="jr-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0b90b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f0b90b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* year, top-left */}
      <text x={X0} y={150} fill={C.ink} opacity={0.85 * frame} style={{ fontFamily: "var(--font-serif)", fontSize: fs(44), fontWeight: 600, letterSpacing: "-0.02em" }}>
        {Math.floor(Math.min(T, 2026.99))}
      </text>

      <g transform={`translate(${shx},${shy})`} opacity={frame}>
        {/* era bands */}
        {ERAS.map(([a, b, c], i) => {
          const open = clamp((T - a) / 0.6);
          if (open <= 0) return null;
          const w = (Math.min(T, b) - a) * sx;
          const col = c === "warn" ? C.warn : c === "accent" ? C.accent : C.mute;
          return (
            <g key={i}>
              <rect x={xOf(a)} y={YT - 40} width={Math.max(0, w)} height={YB - YT + 40} fill={c === "warn" ? "url(#hatch-warn)" : col} opacity={c === "warn" ? 0.18 : 0.05} />
              <Label x={xOf(a) + 6} y={YT - 24} color={col} size={fs(9)} opacity={w > L.eras[i].length * fs(9) * 0.72 + 12 ? open : 0}>
                {L.eras[i]}
              </Label>
            </g>
          );
        })}

        {/* axes */}
        <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={C.line} strokeWidth={1.2} />
        {[0.1, 1, 10, 100, 1000].map((p) => (
          <g key={p}>
            <line x1={X0} x2={X1} y1={yOf(p)} y2={yOf(p)} stroke={C.line} strokeDasharray="2 6" />
            <text x={X0 + 4} y={yOf(p) - 5} fill={C.mute} className="halo" style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
              ${p.toLocaleString("en-US")}
            </text>
          </g>
        ))}
        {Array.from({ length: 5 }, (_, i) => 2018 + i * 2).map((y) => (
          <g key={y}>
            <line x1={xOf(y)} x2={xOf(y)} y1={YB} y2={YB + 6} stroke={C.mute} />
            <text x={xOf(y)} y={YB + fs(18)} textAnchor="middle" fill={y <= T ? C.ink : C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5) }}>
              {y}
            </text>
          </g>
        ))}
        <Label x={X0} y={YB + fs(38)} size={fs(8.5)} opacity={k >= 1.5 ? 0 : 1}>
          {L.price}
        </Label>

        {/* price: faint ghost ahead, bright behind the playhead */}
        <g clipPath="url(#jr-plot)">
          <g clipPath="url(#jr-reveal)">
            <path d={PRICE_LOG_AREA} transform={M} fill="url(#jr-area)" />
            <path d={PRICE_LOG_PATH} transform={M} fill="none" stroke={C.accent} strokeOpacity={0.25} strokeWidth={7} vectorEffect="non-scaling-stroke" />
            <path d={PRICE_LOG_PATH} transform={M} fill="none" stroke={C.accent} strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path d={NEWS_LOG_PATH} transform={M} fill="none" stroke={C.accent} strokeWidth={2} strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
          </g>
        </g>
        {T > NEWS_FROM && (
          <Label x={xOf(NEWS_FROM) - 4} y={YT - 8} anchor="end" size={fs(8)} color={C.mute}>
            {L.news} ⋯
          </Label>
        )}

        {/* bursts + markers */}
        {visible.map((e) => (
          <Burst key={`b${e.id}`} e={e} q={(T - e.t) / 1.1} x={xOf(e.t)} y={yEvent(e)} />
        ))}
        {journeyEvents.map((e) => {
          const on = e.t <= T + 0.002;
          const isSel = e.id === selected;
          const x = xOf(e.t);
          const y = yEvent(e);
          const c = tone(e);
          const r = 6;
          const pop = 1 + 0.7 * (1 - clamp((T - e.t) / 0.4)) * (on ? 1 : 0);
          return (
            <g
              key={e.id}
              transform={`translate(${x},${y})`}
              opacity={on ? 1 : 0}
            >
              <circle r={18} fill="transparent" />
              {isSel && <circle r={16} fill="none" stroke={c} strokeWidth={1.6} className="ping" />}
              <g transform={`scale(${pop})`}>
                {isBad(e) ? (
                  <rect x={-r} y={-r} width={r * 2} height={r * 2} transform="rotate(45)" fill={c} stroke={C.paper} strokeWidth={2} />
                ) : e.kind === "peak" ? (
                  <path d={`M0,${-r * 1.4} L${r * 1.2},${r * 0.8} L${-r * 1.2},${r * 0.8}Z`} fill={c} stroke={C.paper} strokeWidth={2} />
                ) : e.kind === "upgrade" ? (
                  <path d={`M0,${-r * 1.4} L${r},0 L0,${r * 1.4} L${-r},0Z`} fill={c} stroke={C.paper} strokeWidth={2} />
                ) : (
                  <circle r={r} fill={c} stroke={C.paper} strokeWidth={2} />
                )}
              </g>
            </g>
          );
        })}

        {/* playhead */}
        {T < LAST_T + 0.01 && (
          <g pointerEvents="none">
            <line x1={px} x2={px} y1={YT - 40} y2={YB} stroke={C.accent} strokeOpacity={0.5} strokeDasharray="3 4" />
            {price !== null && T >= FIRST_T && (
              <>
                <circle cx={px} cy={yOf(price)} r={28} fill="url(#glow)" />
                <circle cx={px} cy={yOf(price)} r={5} fill={C.accent} stroke={C.paper} strokeWidth={2} />
              </>
            )}
          </g>
        )}
      </g>

      {/* ticker */}
      <g opacity={frame}>
        <text x={X1} y={140} textAnchor="end" fill={C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: fs(30), fontWeight: 600 }}>
          {price !== null && T >= FIRST_T ? usd(price, locale) : "—"}
        </text>
        <text x={X1} y={140 + fs(20)} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9.5), letterSpacing: "0.1em" }}>
          {fmtDate(Math.min(T, LAST_T), lang).toUpperCase()}
        </text>
      </g>

      {/* headline card for the latest (or selected) event */}
      {card && (
        <EventCard e={card} lang={lang} k={k} o={sel ? 1 : smooth(clamp((T - card.t) / 0.08))} price={priceAt(card.t)} locale={locale} />
      )}
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

function EventCard({ e, lang, k, o, price, locale }: { e: JEvent; lang: "en" | "vi"; k: number; o: number; price: number | null; locale: string }) {
  if (o <= 0.02) return null;
  const x = xOf(e.t);
  const y = yEvent(e);
  const title = e[lang].title;
  const fsT = 19 * Math.min(k, 1.4);
  const showBody = k < 1.5;
  const body = showBody ? wrap(e[lang].body, 84) : [];
  const w = X1 - X0;
  const h = 30 * Math.min(k, 1.6) + fsT + 18 + body.length * 22;
  const c = tone(e);
  const lift = (1 - o) * 10;
  return (
    <g opacity={o} pointerEvents="none" transform={`translate(0,${lift})`}>
      <line x1={x} y1={y + 10} x2={x} y2={CARD_Y} stroke={c} strokeWidth={1.2} strokeDasharray="3 4" opacity={0.8} />
      <circle cx={x} cy={CARD_Y} r={4} fill={c} />
      <rect x={X0} y={CARD_Y} width={w} height={h} rx={8} fill={C.paper} stroke={c} strokeWidth={1.4} />
      <rect x={X0} y={CARD_Y} width={6} height={h} rx={3} fill={c} />
      <text x={X0 + 22} y={CARD_Y + 24 * Math.min(k, 1.6)} fill={c} style={{ fontFamily: "var(--font-mono)", fontSize: 12 * Math.min(k, 1.5), letterSpacing: "0.1em" }}>
        {fmtDate(e.t, lang).toUpperCase()}
        {price !== null ? ` · ${usd(price, locale)}` : ""}
      </text>
      <text x={X0 + 22} y={CARD_Y + 24 * Math.min(k, 1.6) + fsT + 8} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fsT, fontWeight: 600 }}>
        {title}
      </text>
      {body.map((l, i) => (
        <text key={i} x={X0 + 22} y={CARD_Y + 24 * Math.min(k, 1.6) + fsT + 36 + i * 22} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: 16 }}>
          {l}
        </text>
      ))}
    </g>
  );
}
