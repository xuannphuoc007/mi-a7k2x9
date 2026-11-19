"use client";
/**
 * 4 · Born for traders (2014). Realcoin → first tokens → Tether; between two
 * exchanges a bank transfer crawls while USDT zips; Bitfinex as the sister
 * company with the two people behind both; the early supply line.
 */
import { chapterIndex } from "@/data/coins/usdt/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { SUPPLY } from "@/lib/usdtSeries";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Logo, Portrait, Token } from "../svg";

const IDX = chapterIndex("birth");
const EARLY = SUPPLY.filter(([t]) => t <= 2021.6);

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
      {/* A: timeline 2014 */}
      {tlO > 0.01 && (
        <g opacity={tlO}>
          <line x1={120} x2={880} y1={560} y2={560} stroke={C.line} strokeWidth={4} />
          <line x1={120} x2={lerp(120, 880, v.tl)} y1={560} y2={560} stroke={C.gd} strokeWidth={4} />
          {[
            { x: 160, label: L.realcoin, at: 0.05 },
            { x: 500, label: L.first, at: 0.45 },
            { x: 840, label: L.renamed, at: 0.85 },
          ].map((m, i) => {
            const q = smooth(clamp((v.tl - m.at) * 6));
            const up = i % 2 === 0;
            return (
              <g key={m.label} opacity={q}>
                <circle cx={m.x} cy={560} r={14} fill={i === 2 ? C.green : C.paper} stroke={C.gd} strokeWidth={4} />
                <text x={m.x} y={up ? 520 : 610 + fsz} textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fsz, fontWeight: 500 }} transform={i === 0 ? "translate(-30,0)" : i === 2 ? "translate(30,0)" : undefined}>
                  {m.label}
                </text>
              </g>
            );
          })}
          <g opacity={smooth(clamp(v.tl * 6))}>
            <Logo x={160} y={420} w={64} h={64} href="/img/btc.svg" />
            <text x={204} y={428} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 20) }}>
              {L.onBtc}
            </text>
          </g>
          <g opacity={smooth(clamp((v.tl - 0.85) * 6))}>
            <Logo x={840} y={330} w={190} h={190} href="/img/tether.png" />
          </g>
        </g>
      )}

      {/* B: two exchanges, bank vs USDT */}
      {exO2 > 0.01 && (
        <g opacity={exO2}>
          {[{ x: 170, n: L.exA }, { x: 830, n: L.exB }].map((e) => (
            <g key={e.n}>
              <rect x={e.x - 110} y={400} width={220} height={200} rx={18} fill="#fff" stroke={C.ink} strokeWidth={2.5} />
              <path d={`M${e.x - 120},400 L${e.x},330 L${e.x + 120},400 Z`} fill={C.ink} opacity={0.85} />
              {[0, 1, 2].map((i) => (
                <rect key={i} x={e.x - 80 + i * 56} y={440} width={36} height={120} rx={4} fill={C.line} />
              ))}
              <text x={e.x} y={640 + fsz} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 600 }}>
                {e.n}
              </text>
            </g>
          ))}
          {/* bank route: slow, arcing above */}
          <path d="M290,420 C380,200 620,200 710,420" fill="none" stroke={C.mute} strokeWidth={3} strokeDasharray="4 10" />
          {(() => {
            const q = v.move * 0.18; // crawls
            const x = lerp(290, 710, q), y = 420 - Math.sin(q * Math.PI) * 165;
            return (
              <g>
                <rect x={x - 26} y={y - 18} width={52} height={36} rx={4} fill="#fff" stroke={C.mute} strokeWidth={2} />
                <text x={x} y={y + 7} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>
                  $
                </text>
              </g>
            );
          })()}
          <text x={500} y={210} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24) }}>
            {L.bank}
          </text>
          {/* USDT route: fast and straight */}
          <line x1={290} x2={710} y1={500} y2={500} stroke={C.green} strokeWidth={4} />
          {[0, 1, 2].map((i) => {
            const q = (v.move * 3 + i * 0.33) % 1;
            return <Token key={i} x={lerp(300, 700, q)} y={500} r={20} opacity={v.move > 0.02 ? 1 : 0} />;
          })}
          <text x={500} y={560 + fsz} textAnchor="middle" fill={C.gd} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), fontWeight: 600 }}>
            {L.usdt}
          </text>
        </g>
      )}

      {/* C: sister companies and two people */}
      {sisO > 0.01 && (
        <g opacity={sisO}>
          <Logo x={280} y={260} w={mobile ? 330 : 380} h={80} href="/img/bitfinex.png" />
          <Logo x={760} y={260} w={150} h={150} href="/img/tether.png" />
          <path d="M280,320 v40 h480 v-40" fill="none" stroke={C.ink} strokeWidth={2} transform="translate(0,20)" />
          <text x={520} y={430} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22), letterSpacing: "0.08em" }}>
            {L.sister}
          </text>
          {[
            { x: 300, href: "/img/paolo.png", name: "Paolo Ardoino", role: L.ceo },
            { x: 700, href: "/img/giancarlo.png", name: "Giancarlo Devasini", role: L.owner },
          ].map((p) => (
            <g key={p.name}>
              <Portrait x={p.x} y={620} r={mobile ? 100 : 110} href={p.href} />
              <text x={p.x} y={770 + fsz * 0.4} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(22, 34), fontWeight: 500 }}>
                {p.name}
              </text>
              <text x={p.x} y={770 + fsz * 2} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22) }}>
                {p.role}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* D: the early supply line */}
      {lineO > 0.01 && (
        <g opacity={lineO}>
          {(() => {
            const X0 = 120, X1 = 880, YB = 760, YT = 260;
            const xOf = (tt: number) => X0 + ((tt - 2014.75) / (2021.6 - 2014.75)) * (X1 - X0);
            const yOf = (b: number) => YB - (b / 66) * (YB - YT);
            const T = lerp(2014.75, 2021.6, v.line);
            const pts = EARLY.filter(([tt]) => tt <= T);
            const d = pts.length > 1 ? "M" + pts.map(([tt, b]) => `${xOf(tt).toFixed(1)},${yOf(b).toFixed(1)}`).join("L") : "";
            return (
              <g>
                <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={C.ink} strokeOpacity={0.3} />
                {[2015, 2017, 2019, 2021].map((y) => (
                  <text key={y} x={xOf(y)} y={YB + 34} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22) }}>
                    {y}
                  </text>
                ))}
                {d && <path d={d} fill="none" stroke={C.green} strokeWidth={5} strokeLinejoin="round" />}
                <g opacity={smooth(clamp((T - 2017.0) * 3))}>
                  <circle cx={xOf(2017.0)} cy={yOf(0.01)} r={8} fill={C.ink} />
                  <text x={xOf(2017.0)} y={yOf(0) - 40} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), fontWeight: 500 }}>
                    {L.s2017}
                  </text>
                </g>
                <g opacity={smooth(clamp((T - 2021.45) * 8))}>
                  <circle cx={xOf(2021.5)} cy={yOf(64.4)} r={8} fill={C.ink} />
                  <text x={xOf(2021.5) - 20} y={yOf(64.4) + 6} textAnchor="end" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), fontWeight: 500 }}>
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
