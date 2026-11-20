"use client";
/**
 * 6 · Down by half, then back. The USDC supply line draws itself from 2018 to
 * 2026 through dated milestones (dots), with era bands. Below, in turn: where
 * USDC sits by blockchain and the CCTP burn-and-mint bar, freeze padlocks
 * (USDC vs USDT), and Circle's New York listing.
 */
import { chapterIndex } from "@/data/coins/usdc/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { SUPPLY, SUPPLY_NEWS, DATA_END } from "@/lib/usdcSeries";
import { clamp, smooth } from "@/lib/store";
import { C, Logo } from "../svg";

const IDX = chapterIndex("growth");
const T0 = 2018.7, T1 = 2026.9;
const ERAS: [number, number][] = [[2018.7, 2020.45], [2020.45, 2022.47], [2022.47, 2024.0], [2024.0, 2026.9]];

export default function GrowthScene() {
  const { t } = useI18n();
  const L = t.scenes.growth;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, T: T0, users: 0, chains: 0, freeze: 0, hq: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { T: 2024.0, duration: 0.16, ease: "none" }, at(0.0))
        .to(v, { T: T1, duration: 0.14, ease: "none" }, at(0.18))
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
  const yOf = (b: number) => YB - (b / 80) * (YB - YT);
  const pts = SUPPLY.filter(([tt]) => tt >= T0 && tt <= Math.min(v.T, DATA_END));
  const line = pts.length > 1 ? "M" + pts.map(([tt, b]) => `${xOf(tt).toFixed(1)},${yOf(b).toFixed(1)}`).join("L") : "";
  const news = v.T > DATA_END ? "M" + [SUPPLY[SUPPLY.length - 1], ...SUPPLY_NEWS.filter(([tt]) => tt <= v.T)].map(([tt, b]) => `${xOf(tt).toFixed(1)},${yOf(b).toFixed(1)}`).join("L") : "";
  const eraO = smooth(clamp((v.T - 2019) * 0.8));
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
      {[20, 40, 60, 80].map((b) => (
        <g key={b}>
          <line x1={X0} x2={X1} y1={yOf(b)} y2={yOf(b)} stroke={C.line} />
          <text x={X0 - 10} y={yOf(b) + 5} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: tf }}>
            {b}
          </text>
        </g>
      ))}
      <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={C.ink} strokeOpacity={0.3} />
      {[2019, 2021, 2023, 2025].map((y) => (
        <text key={y} x={xOf(y)} y={YB + 26} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: tf }}>
          {y}
        </text>
      ))}
      {line && <path d={line} fill="none" stroke={C.green} strokeWidth={5} strokeLinejoin="round" />}
      {news && <path d={news} fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="8 7" />}
      {pts.map(([tt, b]) => (
        <circle key={tt} cx={xOf(tt)} cy={yOf(b)} r={4} fill={C.paper} stroke={C.green} strokeWidth={2.2} />
      ))}
      <g opacity={smooth(clamp((v.T - 2022.5) * 8))}>
        <circle cx={xOf(2022.47)} cy={yOf(55.9)} r={8} fill={C.ink} />
        <text x={xOf(2022.47) + 16} y={yOf(55.9) - 14} textAnchor="start" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 21), fontWeight: 600 }}>
          {L.peak}
        </text>
      </g>
      <g opacity={smooth(clamp((v.T - 2024.02) * 8))}>
        <circle cx={xOf(2024.0)} cy={yOf(23.8)} r={8} fill={C.warn} />
        <text x={xOf(2024.0)} y={yOf(23.8) + 36} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 21), fontWeight: 600 }}>
          {L.low}
        </text>
      </g>
      {v.T > T1 - 0.05 && (
        <g>
          <circle cx={xOf(2026.87)} cy={yOf(67.9)} r={8} fill={C.ink} />
          <text x={xOf(2026.87) - 16} y={yOf(67.9) + 44} textAnchor="end" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(26, 40), fontWeight: 500 }}>
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

      {/* where it lives — and how it moves between chains */}
      {chO > 0.01 && (
        <g opacity={chO}>
          {(() => {
            const vals = [42.17, 6.32, 4.43, 17.11];
            const total = 70.03;
            const cols = ["#627eea", "#3a9e8f", "#3d6fd8", C.grey];
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
                      {k === 0 && w > 90 && <Logo x={x + 34} y={y1 + h / 2} w={40} h={40} href="/img/eth.svg" />}
                      {k === 0 && w > 200 && (
                        <text x={x + 64} y={y1 + h / 2 + 8} fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: big(15, 22), fontWeight: 600 }}>
                          {ch.name} {ch.val}
                        </text>
                      )}
                    </g>
                  );
                  x += w;
                  return g;
                })}
                <text x={X0} y={y1 + h + big(11, 17) * 1.6} fill={C.mute} opacity={grow(3)} style={{ fontFamily: "var(--font-mono)", fontSize: big(11, 17) }}>
                  {L.chains.map((ch) => `${ch.name} ${ch.val}`).join(" · ")}
                </text>
                {/* CCTP: burn on one chain, mint on another */}
                <g opacity={smooth(clamp(v.chains * 2 - 0.9))}>
                  <text x={X0} y={y2 - 16} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: tf, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {mobile ? L.moveTitle.split(" · ")[0].replace(/ \(CCTP\)/, "") : L.moveTitle}
                  </text>
                  <rect x={X0} y={y2} width={X1 - X0} height={h} rx={10} fill={C.green} />
                  {Array.from({ length: 10 }, (_, k) => {
                    const ph = (v.chains * 3 + k / 10) % 1;
                    return <circle key={k} cx={X0 + (mobile ? 470 : 430) + ph * (X1 - X0 - (mobile ? 500 : 460))} cy={y2 + h / 2} r={6} fill="#fff" opacity={0.55} />;
                  })}
                  <text x={X0 + 20} y={y2 + h / 2 + 8} fill="#fff" style={{ fontFamily: "var(--font-sans)", fontSize: big(16, 24), fontWeight: 700 }}>
                    {L.moveVal}
                  </text>
                </g>
              </g>
            );
          })()}
        </g>
      )}

      {/* frozen: 100 padlocks ≈ all blacklisted addresses; 5 of them are USDC */}
      {frO > 0.01 && (
        <g opacity={frO}>
          <text x={X0} y={by - 70} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(28, 40), fontWeight: 500 }}>
            {L.frozen}
          </text>
          {Array.from({ length: 105 }, (_, k) => {
            const col = k % 35, row = Math.floor(k / 35);
            const x = X0 + 10 + col * ((X1 - X0) / 35), y = by + 24 + row * 32;
            const q = smooth(clamp(v.freeze * 2.2 - k * 0.008));
            const isC = k < 5;
            return (
              <g key={k} opacity={q} transform={`translate(${x},${y}) scale(0.44)`}>
                <path d="M-14,-6 v-12 a14,14 0 0 1 28,0 v12" fill="none" stroke={C.ink} strokeWidth={6} />
                <rect x={-20} y={-8} width={40} height={32} rx={6} fill={isC ? C.green : C.usdt} />
              </g>
            );
          })}
          <g opacity={smooth(clamp(v.freeze * 2 - 0.8))}>
            <circle cx={X0 + 10} cy={by - 70 + big(14, 21) * 1.9 - 6} r={8} fill={C.green} />
            <text x={X0 + 26} y={by - 70 + big(14, 21) * 1.9} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 20), fontWeight: 600 }}>
              {L.lockUsdc}
            </text>
            <circle cx={X0 + (mobile ? 400 : 380)} cy={by - 70 + big(14, 21) * 1.9 - 6} r={8} fill={C.usdt} />
            <text x={X0 + (mobile ? 416 : 396)} y={by - 70 + big(14, 21) * 1.9} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 20), fontWeight: 600 }}>
              {L.lockUsdt}
            </text>
          </g>
          <text x={X0} y={by + 24 + 3 * 32 + big(12, 18) * 0.9} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(12, 18) }}>
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
