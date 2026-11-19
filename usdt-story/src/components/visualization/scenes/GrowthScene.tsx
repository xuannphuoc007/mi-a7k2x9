"use client";
/**
 * 7 · Bigger than ever. The USDT supply line draws itself from 2015 to 2026
 * (Coin Metrics, then dashed quarterly figures), with era bands. Below, in
 * turn: where USDT lives (Tron / Ethereum / others), the freeze padlock, and
 * the move to El Salvador.
 */
import { chapterIndex } from "@/data/coins/usdt/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { SUPPLY, SUPPLY_NEWS, DATA_END } from "@/lib/usdtSeries";
import { clamp, smooth } from "@/lib/store";
import { C, Logo } from "../svg";

const IDX = chapterIndex("growth");
const T0 = 2015.0, T1 = 2026.8;
const ERAS: [number, number][] = [[2015.0, 2020.9], [2020.9, 2022.3], [2022.3, 2023.0], [2023.0, 2026.8]];

export default function GrowthScene() {
  const { t } = useI18n();
  const L = t.scenes.growth;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, T: T0, users: 0, chains: 0, freeze: 0, hq: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { T: 2020.9, duration: 0.16, ease: "none" }, at(0.0))
        .to(v, { T: T1, duration: 0.16, ease: "none" }, at(0.18))
        .to(v, { users: 1, duration: 0.06 }, at(0.3))
        .to(v, { chains: 1, duration: 0.1 }, at(0.38))
        .to(v, { freeze: 1, duration: 0.08 }, at(0.56))
        .to(v, { hq: 1, duration: 0.08 }, at(0.74))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const X0 = 130, X1 = 880, YT = 170, YB = 560;
  const xOf = (tt: number) => X0 + ((tt - T0) / (T1 - T0)) * (X1 - X0);
  const yOf = (b: number) => YB - (b / 200) * (YB - YT);
  const pts = SUPPLY.filter(([tt]) => tt >= T0 && tt <= Math.min(v.T, DATA_END));
  const line = pts.length > 1 ? "M" + pts.map(([tt, b]) => `${xOf(tt).toFixed(1)},${yOf(b).toFixed(1)}`).join("L") : "";
  const news = v.T > DATA_END ? "M" + [SUPPLY[SUPPLY.length - 1], ...SUPPLY_NEWS.filter(([tt]) => tt <= v.T)].map(([tt, b]) => `${xOf(tt).toFixed(1)},${yOf(b).toFixed(1)}`).join("L") : "";
  const eraO = smooth(clamp((v.T - 2016) * 0.6));
  const chO = fadeIn(smooth(v.chains)) * fadeOut(smooth(v.freeze));
  const frO = fadeIn(smooth(v.freeze)) * fadeOut(smooth(v.hq));
  const hqO = fadeIn(smooth(v.hq));
  const by = 760;
  const tf = big(13, 22);
  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* chart */}
      <text x={X0} y={YT - 40} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: tf, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {L.title}
      </text>
      {ERAS.map(([a, b], i) => (
        <g key={i} opacity={eraO * (v.T >= a ? 1 : 0.2)}>
          <rect x={xOf(a)} y={YT} width={xOf(b) - xOf(a)} height={YB - YT} fill={i % 2 ? C.accentSoft : "transparent"} opacity={0.6} />
          {!(mobile && i === 2) && (
            <text x={(xOf(a) + xOf(b)) / 2} y={YB + 30 + tf * (i === 2 ? 2.3 : 1)} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(11, 18) }}>
              {L.eras[i]}
            </text>
          )}
        </g>
      ))}
      {[50, 100, 150, 200].map((b) => (
        <g key={b}>
          <line x1={X0} x2={X1} y1={yOf(b)} y2={yOf(b)} stroke={C.line} />
          <text x={X0 - 10} y={yOf(b) + 5} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: tf }}>
            {b}
          </text>
        </g>
      ))}
      <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={C.ink} strokeOpacity={0.3} />
      {[2016, 2019, 2022, 2025].map((y) => (
        <text key={y} x={xOf(y)} y={YB + 26} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: tf }}>
          {y}
        </text>
      ))}
      {line && <path d={line} fill="none" stroke={C.green} strokeWidth={5} strokeLinejoin="round" />}
      {news && <path d={news} fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="8 7" />}
      {v.T > T1 - 0.05 && (
        <g>
          <circle cx={xOf(2026.75)} cy={yOf(183.8)} r={8} fill={C.ink} />
          <text x={xOf(2026.75) - 16} y={yOf(183.8) - 18} textAnchor="end" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(26, 40), fontWeight: 500 }}>
            {L.end}
          </text>
        </g>
      )}
      {/* users */}
      <g opacity={smooth(v.users)}>
        <rect x={X0 + 20} y={YT + 30} width={Math.max(260, L.users.length * big(15, 24) * 0.62 + 40)} height={56} rx={28} fill="#fff" stroke={C.green} strokeWidth={2.5} />
        <text x={X0 + 40} y={YT + 66} fill={C.gd} style={{ fontFamily: "var(--font-mono)", fontSize: big(15, 24), fontWeight: 600 }}>
          {L.users}
        </text>
      </g>

      {/* where it lives — and where it moves */}
      {chO > 0.01 && (
        <g opacity={chO}>
          {(() => {
            const vals = [92.4, 73.6, 17.8];
            const total = 183.8;
            const cols = ["#eb0029", "#627eea", C.grey];
            const logos = ["/img/tron.png", "/img/eth.svg", ""];
            const y1 = 690, y2 = 830, h = 64;
            let x = X0;
            const grow = (k: number) => smooth(clamp(v.chains * 1.5 - k * 0.2));
            return (
              <g>
                <text x={X0} y={y1 - 16} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: tf, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {L.chainsTitle}
                </text>
                {L.chains.map((ch, k) => {
                  const w = (((X1 - X0) * vals[k]) / total) * grow(k);
                  const g = (
                    <g key={ch.name}>
                      <rect x={x} y={y1} width={Math.max(0, w - 6)} height={h} rx={10} fill={cols[k]} />
                      {logos[k] && w > 90 && <Logo x={x + 34} y={y1 + h / 2} w={40} h={40} href={logos[k]} />}
                      {w > 200 && (
                        <text x={x + 64} y={y1 + h / 2 + 8} fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: big(15, 22), fontWeight: 600 }}>
                          {ch.val}
                        </text>
                      )}
                      {k === 2 && w > 40 && (
                        <g>
                          <Logo x={x + w / 2 - 22} y={y1 + h + 30} w={34} h={34} href="/img/bnb.png" />
                          <Logo x={x + w / 2 + 22} y={y1 + h + 30} w={34} h={34} href="/img/sol.png" />
                        </g>
                      )}
                    </g>
                  );
                  x += w;
                  return g;
                })}
                {/* transfers: Tron carries ~73% */}
                <g opacity={smooth(clamp(v.chains * 2 - 0.9))}>
                  <text x={X0} y={y2 - 16} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: tf, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {L.moveTitle}
                  </text>
                  <rect x={X0} y={y2} width={(X1 - X0) * 0.73 - 6} height={h} rx={10} fill="#eb0029" />
                  <rect x={X0 + (X1 - X0) * 0.73} y={y2} width={(X1 - X0) * 0.27} height={h} rx={10} fill={C.line} />
                  {Array.from({ length: 12 }, (_, k) => {
                    const ph = (v.chains * 3 + k / 12) % 1;
                    return <circle key={k} cx={X0 + 220 + ph * ((X1 - X0) * 0.73 - 240)} cy={y2 + h / 2} r={6} fill="#fff" opacity={0.7} />;
                  })}
                  <text x={X0 + 20} y={y2 + h / 2 + 8} fill="#fff" style={{ fontFamily: "var(--font-sans)", fontSize: big(16, 24), fontWeight: 700 }}>
                    {L.moveTron}
                  </text>
                  {!mobile && (
                    <text x={X1 - 12} y={y2 + h / 2 + 7} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 18) }}>
                      {L.moveRest}
                    </text>
                  )}
                </g>
              </g>
            );
          })()}
        </g>
      )}

      {/* frozen: 100 wallets, ~4 ever released */}
      {frO > 0.01 && (
        <g opacity={frO}>
          <text x={X0} y={by - 70} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(30, 42), fontWeight: 500 }}>
            {L.frozen}
          </text>
          {Array.from({ length: 100 }, (_, k) => {
            const col = k % 20, row = Math.floor(k / 20);
            const x = X0 + 14 + col * ((X1 - X0) / 20), y = by + 24 + row * 36;
            const q = smooth(clamp(v.freeze * 2.2 - k * 0.008));
            const free = [13, 37, 58, 86].includes(k) && v.freeze > 0.7;
            return (
              <g key={k} opacity={q} transform={`translate(${x},${y}) scale(0.62)`}>
                <path d={free ? "M-14,-6 v-14 a14,14 0 0 1 28,0" : "M-14,-6 v-12 a14,14 0 0 1 28,0 v12"} fill="none" stroke={free ? C.green : C.ink} strokeWidth={6} />
                <rect x={-20} y={-8} width={40} height={32} rx={6} fill={free ? C.green : C.warn} />
              </g>
            );
          })}
          <text x={X0} y={by - 70 + big(15, 22) * 1.9} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(15, 22) }}>
            {L.lockNote}
          </text>
        </g>
      )}

      {/* HQ */}
      {hqO > 0.01 && (
        <g opacity={hqO}>
          <g transform={`translate(${X0 + 60},${by + 40})`}>
            <rect x={-40} y={-40} width={80} height={110} fill="#fff" stroke={C.ink} strokeWidth={3} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={-26 + (i % 2) * 32} y={-26 + Math.floor(i / 2) * 34} width={20} height={20} fill={C.line} />
            ))}
            <path d="M-50,-40 L0,-74 L50,-40 Z" fill={C.green} />
          </g>
          <text x={X0 + 150} y={by + 60} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(30, 44), fontWeight: 500 }}>
            {L.hq}
          </text>
        </g>
      )}
    </g>
  );
}
