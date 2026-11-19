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

      {/* where it lives */}
      {chO > 0.01 && (
        <g opacity={chO}>
          <text x={X0} y={by - 50} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: tf, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {L.chainsTitle}
          </text>
          {(() => {
            const vals = [92.4, 73.6, 17.8];
            const total = 183.8;
            const cols = ["#eb0029", "#627eea", C.grey];
            let x = X0;
            return L.chains.map((c, i) => {
              const w = ((X1 - X0) * vals[i]) / total * smooth(clamp(v.chains * 1.5 - i * 0.2));
              const g = (
                <g key={c.name}>
                  <rect x={x} y={by} width={Math.max(0, w - 6)} height={90} rx={10} fill={cols[i]} />
                  {w > 120 && (
                    <>
                      <text x={x + 18} y={by + 40} fill="#fff" style={{ fontFamily: "var(--font-sans)", fontSize: big(16, 24), fontWeight: 600 }}>
                        {c.name}
                      </text>
                      <text x={x + 18} y={by + 72} fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 22) }}>
                        {c.val}
                      </text>
                    </>
                  )}
                </g>
              );
              x += w;
              return g;
            });
          })()}
          <Logo x={X0 + 30} y={by + 150} w={52} h={52} href="/img/tron.png" />
        </g>
      )}

      {/* frozen */}
      {frO > 0.01 && (
        <g opacity={frO}>
          <g transform={`translate(${X0 + 60},${by + 40})`}>
            <path d="M-30,-10 v-26 a30,30 0 0 1 60,0 v26" fill="none" stroke={C.ink} strokeWidth={9} />
            <rect x={-48} y={-12} width={96} height={80} rx={12} fill={C.warn} />
            <circle cx={0} cy={22} r={10} fill="#fff" />
          </g>
          <text x={X0 + 150} y={by + 40} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(34, 48), fontWeight: 500 }}>
            {L.frozen}
          </text>
          <text x={X0 + 150} y={by + 40 + big(15, 24) * 1.8} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(15, 24) }}>
            {L.frozenSub}
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
