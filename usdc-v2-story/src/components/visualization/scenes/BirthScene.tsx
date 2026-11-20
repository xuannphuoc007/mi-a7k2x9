"use client";
/**
 * 4 · From start-up to Wall Street. A timeline (Circle 2013 → USDC Sep 2018 →
 * NYSE Jun 2025); Sarah's bank transfer crawls to Hà while USDC zips across;
 * Circle and Coinbase under the Centre consortium (2018–2023) and what changed;
 * the early supply line, below $1B until mid-2020, then ≈ $4B by 2021.
 */
import { chapterIndex } from "@/data/coins/usdc/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { SUPPLY } from "@/lib/usdcSeries";
import { clamp, lerp, smooth } from "@/lib/store";
import { Badge, C, Logo, Person, Token, wrap } from "../svg";

const IDX = chapterIndex("birth");
const T0 = 2018.7, T1 = 2021.05;
const EARLY = SUPPLY.filter(([t]) => t <= T1);

export default function BirthScene() {
  const { t } = useI18n();
  const L = t.scenes.birth;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, tl: 0, ex: 0, move: 0, sis: 0, line: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { tl: 1, duration: 0.18, ease: "none" }, at(-0.02))
        .to(v, { ex: 1, duration: 0.08 }, at(0.24))
        .to(v, { move: 1, duration: 0.16, ease: "none" }, at(0.3))
        .to(v, { sis: 1, duration: 0.1 }, at(0.48))
        .to(v, { line: 1, duration: 0.18, ease: "none" }, at(0.7))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const exO = smooth(v.exit);
  const tlO = fadeOut(smooth(v.ex));
  const exO2 = fadeIn(smooth(v.ex)) * fadeOut(smooth(v.sis));
  const sisO = fadeIn(smooth(v.sis)) * fadeOut(smooth(v.line));
  const lineO = fadeIn(smooth(v.line));
  const fsz = big(15, 25);
  return (
    <g opacity={v.vis * (1 - exO)}>
      {/* A: timeline 2013 → 2018 → 2025 */}
      {tlO > 0.01 && (
        <g opacity={tlO}>
          <line x1={120} x2={880} y1={560} y2={560} stroke={C.line} strokeWidth={4} />
          <line x1={120} x2={lerp(120, 880, v.tl)} y1={560} y2={560} stroke={C.gd} strokeWidth={4} />
          {[
            { x: 160, label: L.founded, at: 0.05 },
            { x: 500, label: L.launched, at: 0.45 },
            { x: 840, label: L.ipo, at: 0.85 },
          ].map((m, i) => {
            const q = smooth(clamp((v.tl - m.at) * 6));
            const up = i % 2 === 0;
            return (
              <g key={m.label} opacity={q}>
                <circle cx={m.x} cy={560} r={14} fill={i === 1 ? C.green : C.paper} stroke={C.gd} strokeWidth={4} />
                <text x={m.x} y={up ? 520 : 610 + fsz} textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fsz, fontWeight: 500 }} transform={i === 0 ? "translate(-30,0)" : i === 2 ? "translate(30,0)" : undefined}>
                  {m.label}
                </text>
              </g>
            );
          })}
          <g opacity={smooth(clamp(v.tl * 6))}>
            {wrap(L.founders, mobile ? 22 : 30).map((ln, k) => (
              <text key={k} x={130} y={420 + k * big(12, 20) * 1.4} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 20) }}>
                {ln}
              </text>
            ))}
          </g>
          <g opacity={smooth(clamp((v.tl - 0.45) * 6))}>
            <Logo x={500} y={380} w={150} h={150} href="/img/usdc.png" />
          </g>
          <g opacity={smooth(clamp((v.tl - 0.85) * 6))}>
            <Badge x={790} y={380} w={200} text="CRCL" fs={34} color={C.ink} />
            <text x={870} y={680 + fsz} textAnchor="end" fill={C.gd} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22), fontWeight: 600 }}>
              {L.ipoSub}
            </text>
          </g>
        </g>
      )}

      {/* B: Sarah → Hà, bank vs USDC */}
      {exO2 > 0.01 && (
        <g opacity={exO2}>
          {[{ x: 170, n: L.exA, col: C.violet }, { x: 830, n: L.exB, col: C.sky }].map((e) => (
            <g key={e.n}>
              <Person x={e.x} y={470} s={1.05} color={e.col} />
              <text x={e.x} y={640 + fsz} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 600 }}>
                {e.n}
              </text>
            </g>
          ))}
          {/* bank route: slow, arcing above through several banks */}
          <path d="M260,420 C360,200 640,200 740,420" fill="none" stroke={C.mute} strokeWidth={3} strokeDasharray="4 10" />
          {[0.3, 0.5, 0.7].map((q) => {
            const x = lerp(260, 740, q), y = 420 - Math.sin(q * Math.PI) * 165;
            return (
              <g key={q}>
                <path d={`M${x - 22},${y - 6} L${x},${y - 22} L${x + 22},${y - 6} Z`} fill={C.mute} />
                <rect x={x - 18} y={y - 6} width={36} height={22} fill="#fff" stroke={C.mute} strokeWidth={2} />
              </g>
            );
          })}
          {(() => {
            const q = v.move * 0.22; // crawls
            const x = lerp(260, 740, q), y = 420 - Math.sin(q * Math.PI) * 165;
            return (
              <g>
                <rect x={x - 26} y={y - 18} width={52} height={36} rx={4} fill="#fff" stroke={C.ink} strokeWidth={2} />
                <text x={x} y={y + 7} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>
                  $
                </text>
              </g>
            );
          })()}
          <text x={500} y={200} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24) }}>
            {L.bank}
          </text>
          {/* USDC route: fast and straight */}
          <line x1={260} x2={740} y1={500} y2={500} stroke={C.green} strokeWidth={4} />
          {[0, 1, 2].map((i) => {
            const q = (v.move * 3 + i * 0.33) % 1;
            return <Token key={i} x={lerp(270, 730, q)} y={500} r={20} opacity={v.move > 0.02 ? 1 : 0} />;
          })}
          <text x={500} y={560 + fsz} textAnchor="middle" fill={C.gd} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), fontWeight: 600 }}>
            {L.usdc}
          </text>
        </g>
      )}

      {/* C: Circle + Coinbase = Centre, and what changed in 2023 */}
      {sisO > 0.01 && (
        <g opacity={sisO}>
          <Badge x={290} y={260} w={mobile ? 300 : 320} text="Circle" fs={40} color={C.gd} />
          <Badge x={710} y={260} w={mobile ? 300 : 320} text="Coinbase" fs={40} color={C.ink} />
          <path d="M290,310 v40 h420 v-40" fill="none" stroke={C.ink} strokeWidth={2} />
          <text x={500} y={410} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22), letterSpacing: "0.06em" }}>
            {L.centre}
          </text>
          <Logo x={500} y={520} w={110} h={110} href="/img/usdc.png" />
          {[L.after1, L.after2].map((txt, k) => {
            const q = smooth(clamp(v.sis * 2.2 - 0.6 - k * 0.4));
            const lines = wrap(txt, mobile ? 34 : 58);
            return (
              <g key={k} opacity={q} transform={`translate(0,${(1 - q) * 12})`}>
                <rect x={120} y={640 + k * 130} width={760} height={110} rx={18} fill="#fff" stroke={k === 0 ? C.gd : C.ink} strokeWidth={2} />
                {lines.map((ln, j) => (
                  <text key={j} x={150} y={640 + k * 130 + 110 / 2 + (j - (lines.length - 1) / 2) * big(16, 26) * 1.3 + 8} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(16, 26), fontWeight: 500 }}>
                    {ln}
                  </text>
                ))}
              </g>
            );
          })}
        </g>
      )}

      {/* D: the early supply line */}
      {lineO > 0.01 && (
        <g opacity={lineO}>
          {(() => {
            const X0 = 120, X1 = 880, YB = 760, YT = 260;
            const xOf = (tt: number) => X0 + ((tt - T0) / (T1 - T0)) * (X1 - X0);
            const yOf = (b: number) => YB - (b / 4.6) * (YB - YT);
            const T = lerp(T0, T1, v.line);
            const pts = EARLY.filter(([tt]) => tt <= T);
            const d = pts.length > 1 ? "M" + pts.map(([tt, b]) => `${xOf(tt).toFixed(1)},${yOf(b).toFixed(1)}`).join("L") : "";
            return (
              <g>
                <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={C.ink} strokeOpacity={0.3} />
                {[1, 2, 3, 4].map((b) => (
                  <g key={b}>
                    <line x1={X0} x2={X1} y1={yOf(b)} y2={yOf(b)} stroke={C.line} />
                    <text x={X0 - 10} y={yOf(b) + 6} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 20) }}>
                      {b}
                    </text>
                  </g>
                ))}
                {[2019, 2020, 2021].map((y) => (
                  <text key={y} x={xOf(y)} y={YB + 34} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22) }}>
                    {y}
                  </text>
                ))}
                {d && <path d={d} fill="none" stroke={C.green} strokeWidth={5} strokeLinejoin="round" />}
                {pts.map(([tt, b]) => (
                  <circle key={tt} cx={xOf(tt)} cy={yOf(b)} r={4.5} fill={C.paper} stroke={C.green} strokeWidth={2.5} />
                ))}
                <g opacity={smooth(clamp((T - 2020.2) * 6))}>
                  <circle cx={xOf(2020.2)} cy={yOf(0.6)} r={8} fill={C.ink} />
                  <text x={xOf(2020.2)} y={yOf(0.6) - 40} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), fontWeight: 500 }}>
                    {L.s2020}
                  </text>
                </g>
                <g opacity={smooth(clamp((T - 2020.98) * 14))}>
                  <circle cx={xOf(2021.0)} cy={yOf(4.1)} r={8} fill={C.ink} />
                  <text x={xOf(2021.0) - 20} y={yOf(4.1) + 6} textAnchor="end" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), fontWeight: 500 }}>
                    {L.s2021}
                  </text>
                </g>
              </g>
            );
          })()}
        </g>
      )}
    </g>
  );
}
