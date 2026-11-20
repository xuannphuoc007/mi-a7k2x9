"use client";
/**
 * One poster per station, drawn at a fixed design size (416 × 280) and scaled to fit.
 * Each poster builds up beat by beat: earlier beats stay, the current one is highlighted.
 * HTML for text (so English and Vietnamese both wrap), inline SVG for charts.
 */
import type { ReactNode } from "react";
import { LINES } from "@/data/coins/link/chapters";
import type { Dict } from "@/data/coins/link/translations";

export const PW = 416;
export const PH = 280;

type P = { b: number; t: Dict; color: string };

const vis = (on: boolean) => `pv ${on ? "" : "pv-hide"}`;

function Stat({ v, l, color, small }: { v: string; l: string; color: string; small?: boolean }) {
  return (
    <div className="rounded-xl bg-[#f4f7fa] px-3 py-2">
      <div className={`font-bold leading-none tracking-tight ${small ? "text-[19px]" : "text-[24px]"}`} style={{ color }}>
        {v}
      </div>
      <div className="mt-1 text-[11.5px] leading-snug text-mute">{l}</div>
    </div>
  );
}

function Hex({ size = 22, color = LINES.blue, inner = "#fff" }: { size?: number; color?: string; inner?: string }) {
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 20 22.4" aria-hidden>
      <path d="M10 0 20 5.6v11.2L10 22.4 0 16.8V5.6z" fill={color} />
      <path d="M10 6.2 15 9v4.6l-5 2.8-5-2.8V9z" fill={inner} />
    </svg>
  );
}

/* ---------- 01 oracle ---------- */
function Oracle({ b, t }: P) {
  const s = t.scenes.oracle;
  return (
    <div className="relative h-full">
      {/* phone */}
      <div className={`absolute left-0 top-1 w-[122px] rounded-[18px] border-[3px] border-ink bg-white p-2.5 ${vis(true)}`}>
        <div className="mx-auto mb-2 h-1 w-8 rounded bg-ink/20" />
        <div className="text-[11px] font-semibold leading-tight text-mute">{s.app}</div>
        <div className="mt-2 rounded-lg bg-[#eef3fb] px-2 py-1.5 text-[12px] font-semibold">{s.lock}</div>
        <div className="mt-1.5 rounded-lg bg-[#eef3fb] px-2 py-1.5 text-[12px] font-semibold">{s.borrow}</div>
        <div className={`mt-2 rounded-lg px-2 py-1.5 text-center text-[13px] font-bold ${b >= 2 ? "bg-[#e3f6ee] text-[#1a8d63]" : "blink bg-[#fde8e6] text-warn"}`}>
          {b >= 2 ? s.price : s.ask}
        </div>
      </div>
      {/* blockchain box with a closed eye */}
      <div className={`absolute left-[150px] top-[18px] w-[118px] ${vis(b >= 1)}`}>
        <div className="flex h-[104px] flex-col items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: LINES.navy }}>
          <svg width="44" height="22" viewBox="0 0 44 22" aria-hidden>
            <path d="M3 6c5 9 33 9 38 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            {[8, 16, 22, 28, 36].map((x) => (
              <path key={x} d={`M${x} ${x === 22 ? 13 : 11}l${x < 22 ? -2 : x > 22 ? 2 : 0} 6`} stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            ))}
          </svg>
          <div className="mt-2 text-[14px] font-bold">{s.chain}</div>
        </div>
        <div className="mt-1.5 text-center text-[11px] leading-snug text-mute">{s.blind}</div>
      </div>
      {/* the outside world */}
      <div className={`absolute right-0 top-0 flex w-[96px] flex-col gap-1.5 ${vis(b >= 1)}`}>
        {s.outside.map((o, i) => (
          <div key={o} className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2 py-1.5 text-[12px] font-semibold">
            <span className="text-[13px]">{["📈", "⛅", "⚽", "🏦"][i]}</span>
            {o}
          </div>
        ))}
      </div>
      {/* wall + oracle */}
      <svg className={`absolute left-[290px] top-0 ${vis(b >= 1)}`} width="8" height="168" aria-hidden>
        <line x1="4" y1="0" x2="4" y2="168" stroke="#c9d1db" strokeWidth="3" strokeDasharray="5 5" />
      </svg>
      <svg className={`absolute left-[268px] top-[52px] ${vis(b >= 2)}`} width="52" height="24" viewBox="0 0 52 24" aria-hidden>
        <path d="M50 12H6" stroke={LINES.blue} strokeWidth="3" className="flow" />
        <path d="M12 5 4 12l8 7" stroke={LINES.blue} strokeWidth="3" fill="none" />
      </svg>
      <div className={`absolute right-0 top-[176px] flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 shadow ring-1 ring-black/5 ${vis(b >= 2)}`}>
        <Hex size={15} />
        <span className="text-[12.5px] font-bold" style={{ color: LINES.blue }}>
          {s.oracle}
        </span>
        <span className="text-[11px] text-mute">{s.carries}</span>
      </div>
      <div className={`absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto] items-end gap-3 ${vis(b >= 2)}`}>
        <p className="text-[12px] leading-snug text-mute">
          <span className="font-semibold text-warn">✕ {s.liar}</span>
          <br />
          <span className="font-semibold text-[#1a8d63]">✓ {s.many}</span>
        </p>
        <Stat v={s.tve} l={s.tveSub} color={LINES.blue} small />
      </div>
    </div>
  );
}

/* ---------- 02 feeds ---------- */
function Feeds({ b, t, color }: P) {
  const s = t.scenes.feeds;
  const vals = ["100.1", "99.9", "100.2", "100.0", "100.1"];
  const nodes = [100.1, 99.9, 100.2, 92.0, 100.0, 100.1, 100.3];
  const sorted = [...nodes].sort((a, c) => a - c);
  return (
    <div className="relative h-full">
      <div className="mb-1 flex items-center justify-between">
        <span className="tag text-mute">{s.sources}</span>
        <span className="text-[10.5px] italic text-mute">{t.ui.illustrative}</span>
      </div>
      <div className="flex gap-1">
        {s.srcs.map((x, i) => (
          <div key={x} className={`flex-1 rounded-lg border px-1 py-1 text-center ${b === 0 ? "border-transparent" : "border-line"}`} style={b === 0 ? { background: color + "1f" } : {}}>
            <div className="truncate text-[10.5px] text-mute">{x}</div>
            <div className="text-[13px] font-bold">{vals[i]}</div>
          </div>
        ))}
      </div>
      {/* nodes → median */}
      <div className={`mt-2 grid grid-cols-[1fr_118px] gap-2 ${vis(b >= 1)}`}>
        <div>
          <div className="tag mb-1 text-mute">{s.nodes}</div>
          <svg viewBox="0 0 270 92" className="w-full" aria-hidden>
            {sorted.map((v, i) => {
              const h = 10 + (v - 90) * 5.2;
              const x = 8 + i * 37;
              const mid = i === 3;
              const out = v < 95;
              return (
                <g key={i}>
                  <rect x={x} y={86 - h} width="26" height={h} rx="5" fill={out ? "#f3b4ad" : mid ? color : "#cfd8e3"} />
                  <text x={x + 13} y={80 - h} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={out ? "#d6403a" : "#16202c"}>
                    {v.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex justify-between text-[11px]">
            <span className="font-semibold text-warn">↑ {s.outlier}</span>
            <span className="font-bold" style={{ color }}>
              {s.median} = 100.1
            </span>
          </div>
        </div>
        <div className={`rounded-xl px-2.5 py-2 ${vis(b >= 2)}`} style={{ background: b === 2 ? color + "1f" : "#f4f7fa" }}>
          <div className="tag text-mute">{s.rule}</div>
          <div className="mt-1.5 text-[13px] font-bold leading-snug">± {s.dev}</div>
          <div className="mt-1 flex items-center gap-1.5 text-[13px] font-bold leading-snug">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <circle cx="8" cy="8" r="6.5" stroke="#16202c" strokeWidth="1.6" fill="none" />
              <path d="M8 4v4l3 2" stroke="#16202c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
            {s.hb}
          </div>
        </div>
      </div>
      <div className={`absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto] items-end gap-3 ${vis(b >= 3)}`}>
        <div className="flex items-center gap-2 rounded-xl border-2 px-3 py-2" style={{ borderColor: color }}>
          <Hex size={18} />
          <div>
            <div className="text-[11px] text-mute">{s.onchain}</div>
            <div className="text-[18px] font-bold leading-none">100.1</div>
          </div>
          <div className="ml-auto max-w-[110px] text-right text-[11px] font-semibold leading-snug">→ {s.reads}</div>
        </div>
        <Stat v={s.tvs} l={s.tvsSub} color={color} small />
      </div>
    </div>
  );
}

/* ---------- 03 token ---------- */
function Token({ b, t, color }: P) {
  const s = t.scenes.token;
  const cell = (i: number) => (i < 35 ? LINES.magenta : i < 70 ? LINES.orange : LINES.navy);
  const stakeCells = new Set([35, 36, 37, 38, 39]);
  return (
    <div className="grid h-full grid-cols-[150px_1fr] gap-3">
      <div>
        <div className="tag mb-1 text-mute">{s.total}</div>
        <div className="grid grid-cols-10 gap-[2px]">
          {Array.from({ length: 100 }, (_, i) => {
            const stake = stakeCells.has(i) && b >= 1;
            const dim = b >= 1 && !stake && !(b >= 3 && i >= 70);
            return (
              <div
                key={i}
                className="pv relative aspect-square rounded-[3px]"
                style={{
                  background: cell(i),
                  opacity: dim ? 0.28 : 1,
                  outline: stake ? `2px solid ${LINES.green}` : undefined,
                  outlineOffset: stake ? -1 : undefined,
                }}
              >
                {i === 40 && b >= 2 && <span className="absolute inset-y-0 left-0 rounded-[3px]" style={{ width: "67%", background: LINES.teal, outline: "2px solid #fff" }} />}
              </div>
            );
          })}
        </div>
        <div className="mt-1 text-[10.5px] text-mute">{s.tile}</div>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          [LINES.magenta, s.sale],
          [LINES.orange, s.eco],
          [LINES.navy, s.co],
        ].map(([c, l]) => (
          <div key={l} className="flex items-center gap-2 text-[12px] font-semibold leading-tight" style={{ opacity: b === 0 ? 1 : 0.55 }}>
            <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: c }} />
            {l}
          </div>
        ))}
        <div className={`rounded-lg px-2.5 py-1.5 ${vis(b >= 1)}`} style={{ background: b === 1 ? LINES.green + "1c" : "transparent" }}>
          <div className="text-[12.5px] font-bold" style={{ color: LINES.green }}>
            🔒 {s.staking}
          </div>
          <div className="text-[11px] text-mute">{s.slash}</div>
        </div>
        <div className={`rounded-lg px-2.5 py-1.5 ${vis(b >= 2)}`} style={{ background: b === 2 ? LINES.teal + "1c" : "transparent" }}>
          <div className="text-[12.5px] font-bold" style={{ color: LINES.teal }}>
            {s.reserve}
          </div>
          <div className="text-[11px] text-mute">{s.reserveSub}</div>
        </div>
        <div className={`rounded-lg px-2.5 py-1.5 ${vis(b >= 3)}`} style={{ background: b === 3 ? color + "14" : "transparent" }}>
          <div className="text-[12.5px] font-bold">
            {s.unlock}: {s.unlockVal} <span className="font-medium text-mute">({s.toBinance})</span>
          </div>
          <div className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-mute">{s.compareTitle}</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-3 rounded" style={{ width: 118, background: LINES.red }} />
            <span className="text-[11px] font-semibold">{s.out}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-3 rounded" style={{ width: 11, background: LINES.teal }} />
            <span className="text-[11px] font-semibold">{s.inn}</span>
            <span className="ml-auto text-[17px] font-bold text-warn">{s.ratio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 04 ccip ---------- */
function Ccip({ b, t, color }: P) {
  const s = t.scenes.ccip;
  const isl = [
    { n: "Ethereum", x: 72, y: 26 },
    { n: "Ronin", x: 44, y: 112 },
    { n: "Solana", x: 176, y: 122 },
    { n: "Base", x: 236, y: 26 },
    { n: "Arbitrum", x: 362, y: 58 },
    { n: "Avalanche", x: 306, y: 124 },
  ];
  const broken = [
    [0, 1],
    [0, 2],
    [3, 2],
  ];
  const good = [
    [0, 3],
    [3, 4],
    [0, 5],
    [4, 5],
  ];
  return (
    <div className="flex h-full flex-col">
      <svg viewBox="0 0 416 142" className="w-full" aria-hidden>
        {broken.map(([a, c], k) => {
          const A = isl[a],
            C = isl[c];
          const mx = (A.x + C.x) / 2,
            my = (A.y + C.y) / 2;
          return (
            <g key={k} opacity={b >= 1 ? 0.3 : 1} className="pv">
              <line x1={A.x} y1={A.y} x2={mx - 5} y2={my - 4} stroke={LINES.red} strokeWidth="5" strokeLinecap="round" />
              <line x1={mx + 5} y1={my + 4} x2={C.x} y2={C.y} stroke={LINES.red} strokeWidth="5" strokeLinecap="round" />
              <circle cx={mx} cy={my} r="9" fill="#fff" stroke={LINES.red} strokeWidth="2" />
              <path d={`M${mx - 3.5} ${my - 3.5}l7 7m0-7l-7 7`} stroke={LINES.red} strokeWidth="2.2" strokeLinecap="round" />
            </g>
          );
        })}
        <g className={vis(b >= 1)}>
          {good.map(([a, c], k) => (
            <line key={k} x1={isl[a].x} y1={isl[a].y} x2={isl[c].x} y2={isl[c].y} stroke={color} strokeWidth="4" className="flow" />
          ))}
          <g transform="translate(176 58)">
            <path d="M14 0 28 6v10c0 9-6 15-14 18C6 31 0 25 0 16V6z" fill={color} stroke="#fff" strokeWidth="2" />
            <path d="m8 16 4.5 4.5L21 11" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        </g>
        {isl.map((i) => (
          <g key={i.n}>
            <ellipse cx={i.x} cy={i.y + 5} rx="36" ry="12" fill="#cfe6d9" />
            <ellipse cx={i.x} cy={i.y} rx="36" ry="12" fill="#eef8f2" stroke="#9cc9ad" />
            <text x={i.x} y={i.y + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#16202c">
              {i.n}
            </text>
          </g>
        ))}
      </svg>
      <div className={`mt-1 text-[12px] leading-snug ${b === 0 ? "" : "opacity-60"}`}>
        <span className="font-bold text-warn">
          {s.hacks}: {s.hackList.map((h) => `${h.n} ${h.v}`).join(" · ")}
        </span>
        <span className="text-mute"> — {s.share}</span>
      </div>
      <div className={`mt-1.5 rounded-lg px-2.5 py-1.5 ${vis(b >= 1)}`} style={{ background: color + "18" }}>
        <span className="text-[14px] font-bold" style={{ color }}>
          {s.ccip} · {s.chains}
        </span>
        <span className="text-[11.5px] text-mute">
          {" "}
          — {s.guard} · {s.launch}
        </span>
      </div>
      <div className={`mt-auto grid grid-cols-3 gap-1.5 ${vis(b >= 2)}`}>
        {s.stats.map((x) => (
          <Stat key={x.l} v={x.v} l={x.l} color={color} small />
        ))}
      </div>
    </div>
  );
}

/* ---------- 05 banks ---------- */
function Banks({ b, t, color }: P) {
  const s = t.scenes.banks;
  const showRow = (i: number) => (i < 3 ? b >= i : b >= 3);
  const chip: Record<string, string> = { live: LINES.green, test: LINES.orange, pilot: LINES.purple, partner: "#7b8794" };
  return (
    <div className="flex h-full flex-col">
      <div className="mb-1.5 text-[11px] text-mute">
        <span className="text-[19px] font-bold" style={{ color }}>
          {s.swift}
        </span>{" "}
        {s.swiftSub}
      </div>
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[1.05fr_1.5fr_64px] gap-2 bg-[#f1f4f7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-mute">
          {s.cols.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        {s.rows.map((r, i) => (
          <div
            key={r.n}
            className={`grid grid-cols-[1.05fr_1.5fr_64px] items-center gap-2 border-t border-line px-2.5 py-[4px] ${vis(showRow(i))}`}
            style={{ background: (i < 3 ? b === i : b === 3 && i >= 3) ? color + "14" : "#fff" }}
          >
            <span className="text-[12px] font-bold leading-tight">{r.n}</span>
            <span className="text-[11px] leading-tight text-mute">{r.w}</span>
            <span className="justify-self-start rounded px-1.5 py-0.5 text-[9.5px] font-bold text-white" style={{ background: chip[r.s] }}>
              {s.status[r.s as keyof typeof s.status]}
            </span>
          </div>
        ))}
      </div>
      <div className={`mt-auto text-[12px] font-semibold text-warn ${vis(b >= 3)}`}>⚠ {s.caveat}</div>
    </div>
  );
}

/* ---------- 06 history ---------- */
function History({ b, t, color }: P) {
  const s = t.scenes.history;
  const X0 = 2017.6,
    X1 = 2021.6;
  const sx = (x: number) => 34 + ((x - X0) / (X1 - X0)) * 370;
  const sy = (v: number) => 160 - ((Math.log10(v) + 1.3) / (Math.log10(70) + 1.3)) * 150;
  const pts: [number, number][] = [
    [2017.72, 0.12], [2017.85, 0.2], [2018.03, 1.1], [2018.25, 0.45], [2018.7, 0.4], [2018.95, 0.3], [2019.2, 0.45], [2019.38, 1.3],
    [2019.5, 4.0], [2019.65, 2.2], [2019.95, 1.8], [2020.2, 2.6], [2020.45, 4.6], [2020.62, 20.3], [2020.75, 10], [2020.95, 12.5],
    [2021.1, 26], [2021.25, 30], [2021.36, 52.88], [2021.48, 28],
  ];
  const d = pts.map(([x, v], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)} ${sy(v).toFixed(1)}`).join(" ");
  const until = [2017.95, 2019.6, 2020.7, X1][b] ?? X1;
  const ms = [
    { x: 2017.72, v: 0.12 },
    { x: 2019.38, v: 1.3 },
    { x: 2020.62, v: 20.3 },
    { x: 2021.36, v: 52.88 },
  ];
  return (
    <div className="relative h-full">
      <div className="flex justify-between">
        <span className="tag text-mute">{s.axis}</span>
        <span className="text-[11px] font-semibold text-mute">{s.founders}</span>
      </div>
      <svg viewBox="0 0 416 178" className="mt-1 w-full" aria-hidden>
        <defs>
          <clipPath id="hist-clip">
            <rect x="0" y="0" height="178" width={sx(until)} style={{ transition: "width 1.1s cubic-bezier(.3,.6,.2,1)" }} />
          </clipPath>
        </defs>
        {[0.1, 1, 10, 50].map((v) => (
          <g key={v}>
            <line x1="34" x2="406" y1={sy(v)} y2={sy(v)} stroke="#e5eaef" />
            <text x="28" y={sy(v) + 4} textAnchor="end" fontSize="10.5" fill="#5d6977">
              ${v}
            </text>
          </g>
        ))}
        {[2018, 2019, 2020, 2021].map((y) => (
          <g key={y}>
            <line x1={sx(y)} x2={sx(y)} y1="160" y2="164" stroke="#c3ccd6" />
            <text x={sx(y)} y="176" textAnchor="middle" fontSize="10.5" fill="#5d6977">
              {y}
            </text>
          </g>
        ))}
        <path d={`${d} L${sx(2021.48)} 160 L${sx(2017.72)} 160Z`} fill={color + "33"} clipPath="url(#hist-clip)" />
        <path d={d} stroke={color === LINES.yellow ? "#c9950a" : color} strokeWidth="2.6" fill="none" strokeLinejoin="round" clipPath="url(#hist-clip)" />
        {ms.map((m, i) => (
          <circle key={i} cx={sx(m.x)} cy={sy(m.v)} r={b === i ? 6 : 4.5} fill="#fff" stroke="#16202c" strokeWidth="2" className={vis(b >= i)} />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 grid grid-cols-4 gap-1.5">
        {s.ms.map((m, i) => (
          <div key={m.d} className={`rounded-lg px-2 py-1.5 ${vis(b >= i)}`} style={{ background: b === i ? "#fff3cf" : "#f4f7fa" }}>
            <div className="text-[10.5px] text-mute">{m.d}</div>
            <div className="text-[15px] font-bold leading-tight">{m.v}</div>
            <div className="text-[10.5px] leading-tight text-mute">{m.l}</div>
          </div>
        ))}
      </div>
      <div className={`absolute left-[132px] top-[22px] rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-warn shadow ${vis(b === 2)}`}>
        {s.zeus} · <span className="text-[#1a8d63]">{s.marines}</span>
      </div>
      <div className={`absolute left-[214px] top-[20px] text-[22px] font-bold text-[#c9950a] ${vis(b >= 3)}`}>{s.times}</div>
    </div>
  );
}

/* ---------- 07 luna ---------- */
function Luna({ b, t, color }: P) {
  const s = t.scenes.luna;
  const sy = (v: number) => 112 - ((Math.log10(v) + 2.3) / 4.3) * 104;
  const real = [80, 64, 30, 5, 1, 0.3, 0.1, 0.03, 0.01, 0.008];
  const sx = (i: number) => 34 + i * 41;
  const dReal = real.map((v, i) => `${i ? "L" : "M"}${sx(i)} ${sy(v).toFixed(1)}`).join(" ");
  const feed = real.map((v) => Math.max(v, 0.107));
  const dFeed = feed.map((v, i) => `${i ? "L" : "M"}${sx(i)} ${sy(v).toFixed(1)}`).join(" ");
  const top = feed.map((v, i) => [sx(i), sy(v)] as const).slice(5);
  const bot = real.map((v, i) => [sx(i), sy(v)] as const).slice(5).reverse();
  const gap = [...top, ...bot].map(([x, y], i) => `${i ? "L" : "M"}${x} ${y.toFixed(1)}`).join(" ") + "Z";
  return (
    <div className="flex h-full flex-col">
      <span className="tag text-mute">{s.date}</span>
      <svg viewBox="0 0 416 118" className="w-full" aria-hidden>
        {[0.01, 0.1, 1, 10].map((v) => (
          <g key={v}>
            <line x1="34" x2="412" y1={sy(v)} y2={sy(v)} stroke="#e5eaef" />
            <text x="30" y={sy(v) + 4} textAnchor="end" fontSize="10.5" fill="#5d6977">
              ${v}
            </text>
          </g>
        ))}
        <path d={gap} fill={LINES.red} opacity={b >= 1 ? 0.22 : 0} className="pv" />
        <path d={dReal} stroke="#16202c" strokeWidth="2.6" fill="none" />
        <path d={dFeed} stroke={color} strokeWidth="3" fill="none" strokeDasharray={b >= 1 ? "0" : "6 5"} />
        <text x={sx(9) + 2} y={sy(0.107) - 6} textAnchor="end" fontSize="12.5" fontWeight="700" fill={color}>
          {s.stuck}
        </text>
        <text x={sx(8) - 6} y={sy(0.01) + 3} textAnchor="end" fontSize="12.5" fontWeight="700" fill="#16202c">
          {s.realVal}
        </text>
        <text x={sx(7) + 14} y={sy(0.055) + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={LINES.red} className={vis(b >= 1)}>
          {s.gap}
        </text>
      </svg>
      <div className="flex flex-wrap gap-x-3 text-[11px] font-semibold leading-tight">
          <span className="flex items-center gap-1">
            <span className="h-[3px] w-4 bg-ink" />
            {s.real}
          </span>
          <span className="flex items-center gap-1" style={{ color }}>
            <span className="h-[3px] w-4" style={{ background: color }} />
            {s.feed}
          </span>
      </div>
      <div className={`mt-1 grid grid-cols-4 gap-1 ${vis(b >= 1)}`}>
        {s.attack.map((a, i) => (
          <div key={a.l} className="rounded-lg bg-[#f4f7fa] px-2 py-1">
            <div className="text-[10.5px] leading-tight text-mute">{a.l}</div>
            <div className={`text-[13px] font-bold ${i === 2 ? "text-warn" : ""}`}>{a.v}</div>
          </div>
        ))}
      </div>
      <div className={`mt-1 rounded-lg bg-warn-soft px-2 py-1 text-[11.5px] font-bold text-warn ${vis(b >= 1)}`}>{s.loss}</div>
      <div className={`mt-auto flex flex-wrap gap-x-3 gap-y-0.5 rounded-lg bg-[#e3f6ee] px-2 py-1.5 ${vis(b >= 2)}`}>
        {s.lesson.map((l) => (
          <span key={l} className="text-[11.5px] font-semibold leading-snug text-[#1a7f5a]">
            ✓ {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- 08 today ---------- */
function Today({ b, t, color }: P) {
  const s = t.scenes.today;
  const maxR = 7;
  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-4 gap-1.5">
        {s.tiles.map((x, i) => (
          <div key={x.l} className={`rounded-xl px-2 py-1.5 ${i === 3 ? vis(b >= 1) : ""}`} style={{ background: (b === 0 && i < 3) || (b === 1 && i === 3) ? color + "1c" : "#f4f7fa" }}>
            <div className={`text-[17px] font-bold leading-none ${i === 1 ? "text-warn" : ""}`}>{x.v}</div>
            <div className="mt-1 text-[10.5px] leading-tight text-mute">{x.l}</div>
          </div>
        ))}
      </div>
      <div className={`mt-1.5 text-[11px] font-semibold text-mute ${vis(b >= 1)}`}>{s.etf}</div>
      <div className="relative mt-2 flex-1">
        {/* reserve */}
        <div className={`absolute inset-0 ${b === 2 ? "pv" : "pv pv-hide"}`}>
          <div className="tag text-mute">{s.reserveTitle}</div>
          <div className="mt-2 flex h-[118px] items-end gap-4 px-2">
            {s.reserve.map((r) => (
              <div key={r.d} className="flex flex-1 flex-col items-center justify-end">
                <div className="text-[13px] font-bold">{r.v.toLocaleString(t.ui.of === "of" ? "en-US" : "vi-VN")}</div>
                <div className="w-full rounded-t-md" style={{ height: (r.v / maxR) * 92, background: color }} />
                <div className="mt-1 text-[10.5px] text-mute">{r.d}</div>
              </div>
            ))}
          </div>
        </div>
        {/* share */}
        <div className={`absolute inset-0 ${b === 3 ? "pv" : "pv pv-hide"}`}>
          <div className="tag text-mute">{s.share}</div>
          <div className="mt-2 text-[26px] font-bold" style={{ color }}>
            {s.shareVal}
          </div>
          <div className="relative mt-2 h-4 rounded-full bg-[#e8edf2]">
            <div className="absolute inset-y-0 rounded-full" style={{ left: "60%", width: "24%", background: color, opacity: 0.85 }} />
            <div className="absolute inset-y-0 left-0 rounded-l-full" style={{ width: "60%", background: color, opacity: 0.35 }} />
          </div>
          <div className="mt-2 text-[12px] font-semibold">{s.rivals}</div>
          <div className="mt-0.5 text-[12px] font-semibold text-warn">{s.redstone}</div>
        </div>
        {/* usage vs price */}
        <div className={`absolute inset-0 ${b >= 4 ? "pv" : "pv pv-hide"}`}>
          <svg viewBox="0 0 400 120" className="w-full" aria-hidden>
            <path d="M10 100 C 120 90, 220 60, 390 18" stroke={LINES.green} strokeWidth="4" fill="none" />
            <path d="M10 40 C 90 30, 130 90, 200 70 S 300 30, 330 34 S 370 92, 390 96" stroke={LINES.red} strokeWidth="4" fill="none" />
            <text x="388" y="14" textAnchor="end" fontSize="13" fontWeight="700" fill={LINES.green}>
              {s.usage} ↑
            </text>
            <text x="388" y="116" textAnchor="end" fontSize="13" fontWeight="700" fill={LINES.red}>
              {s.price} ↓
            </text>
            <text x="330" y="58" textAnchor="middle" fontSize="10.5" fill="#5d6977">
              {s.peak}
            </text>
          </svg>
          <div className="text-center text-[13px] font-bold">{s.gap}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 09 / 10 strengths, weaknesses ---------- */
function Cards({ b, items, color, warn }: { b: number; items: { title: string; stat: string; note: string }[]; color: string; warn?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      {items.map((c, i) => (
        <div
          key={c.title}
          className={`grid grid-cols-[22px_1fr_auto] items-center gap-2.5 rounded-xl px-2.5 py-1.5 ${vis(b >= i)}`}
          style={{ background: b === i ? color + "1c" : "#f4f7fa", outline: b === i ? `2px solid ${color}` : "none" }}
        >
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: color }}>
            {warn ? "!" : i + 1}
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-bold leading-tight">{c.title}</div>
            <div className="truncate text-[11px] leading-tight text-mute">{c.note}</div>
          </div>
          <span className="text-[17px] font-bold" style={{ color }}>
            {c.stat}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- 11 finale ---------- */
function Finale({ b, t }: P) {
  const s = t.scenes.finale;
  const lines = Object.values(LINES);
  return (
    <div className="flex h-full flex-col">
      <svg viewBox="0 0 416 44" className="w-full" aria-hidden>
        {t.chapters.slice(0, 10).map((_, i) => (
          <line key={i} x1={14 + i * 38.8} x2={14 + (i + 1) * 38.8} y1="22" y2="22" stroke={lines[i % lines.length]} strokeWidth="6" strokeLinecap="round" />
        ))}
        {t.chapters.map((_, i) => (
          <circle key={i} cx={14 + i * 38.8} cy="22" r="8" fill="#fff" stroke="#16202c" strokeWidth="2.5" />
        ))}
      </svg>
      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="rounded-xl px-3 py-2 text-center text-[17px] font-bold" style={{ background: LINES.blue + "1c", color: LINES.blue }}>
          {s.network}
        </div>
        <span className={`text-[28px] font-bold text-warn ${vis(b >= 1)}`}>≠</span>
        <div className={`rounded-xl px-3 py-2 text-center text-[17px] font-bold ${vis(b >= 1)}`} style={{ background: LINES.orange + "1f", color: "#b8620c" }}>
          {s.token}
        </div>
      </div>
      <div className={`mt-2 ${vis(b >= 1)}`}>
        <div className="tag text-mute">{s.watchTitle}</div>
        <div className="mt-1 grid grid-cols-3 gap-1.5">
          {s.watch.map((w, i) => (
            <div key={w} className="rounded-lg bg-[#f4f7fa] px-2 py-1.5 text-[12px] font-semibold leading-snug">
              <span className="font-bold" style={{ color: lines[i + 5] }}>
                {i + 1}.
              </span>{" "}
              {w}
            </div>
          ))}
        </div>
      </div>
      <div className={`mt-auto space-y-0.5 text-[11.5px] font-semibold leading-snug ${vis(b >= 2)}`}>
        <div>✓ {s.khoa}</div>
        <div className="text-mute">⚑ {s.vn}</div>
        <div className="text-warn">{s.notAdvice}</div>
      </div>
    </div>
  );
}

export function Poster({ ch, b, t, color }: { ch: number; b: number; t: Dict; color: string }): ReactNode {
  const p = { b, t, color };
  switch (ch) {
    case 0:
      return <Oracle {...p} />;
    case 1:
      return <Feeds {...p} />;
    case 2:
      return <Token {...p} />;
    case 3:
      return <Ccip {...p} />;
    case 4:
      return <Banks {...p} />;
    case 5:
      return <History {...p} />;
    case 6:
      return <Luna {...p} />;
    case 7:
      return <Today {...p} />;
    case 8:
      return <Cards b={b} items={t.scenes.cards.strengths} color={LINES.green} />;
    case 9:
      return <Cards b={b} items={t.scenes.cards.weaknesses} color={LINES.red} warn />;
    default:
      return <Finale {...p} />;
  }
}
