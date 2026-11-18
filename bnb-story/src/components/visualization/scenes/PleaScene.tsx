"use client";
/**
 * Act 4 · The 2023 guilty plea. Three charges are stamped GUILTY; $4.3B
 * splits into a $1.8B fine and $2.5B forfeited; what officials said the
 * failures allowed; then CZ's path from CEO to four months in prison.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("plea");

export function Initials({ x, y, text, s = 1, color = C.ink, opacity = 1 }: { x: number; y: number; text: string; s?: number; color?: string; opacity?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <circle r={40} fill={color} />
      <text y={10} textAnchor="middle" fill={color === C.yellow ? "#1e2026" : "#fff"} style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700 }}>
        {text}
      </text>
    </g>
  );
}

export default function PleaScene() {
  const { t } = useI18n();
  const L = t.scenes.plea;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, court: 0, stamp: 0, money: 0, split: 0, allowed: 0, cz: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { court: 1, duration: 0.08 }, at(-0.04))
        .to(v, { stamp: 1, duration: 0.2, ease: "none" }, at(0.04))
        .to(v, { court: 0, duration: 0.05 }, at(0.28))
        .to(v, { money: 1, duration: 0.06 }, at(0.3))
        .to(v, { split: 1, duration: 0.1 }, at(0.36))
        .to(v, { allowed: 1, duration: 0.1 }, at(0.46))
        .to(v, { money: 0, duration: 0.05 }, at(0.58))
        .to(v, { cz: 1, duration: 0.26, ease: "none" }, at(0.6))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const court = smooth(v.court);
  const money = smooth(v.money);
  const split = smooth(v.split);
  const cz = v.cz;

  const steps = L.czSteps;
  const X0 = 140;
  const X1 = 860;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {court > 0.01 && (
        <g opacity={court}>
          <text x={500} y={210} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(14), letterSpacing: "0.14em" }}>
            {L.date}
          </text>
          <Label x={500} y={250} anchor="middle" size={fs(10)}>
            {L.court}
          </Label>
          {L.charges.map((c, i) => {
            const y = 340 + i * 150;
            const q = clamp(v.stamp * 3 - i);
            return (
              <g key={c}>
                <rect x={120} y={y - 50} width={760} height={100} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={1.6} />
                <text x={150} y={y + 7} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 17 * Math.min(k, 1.35) }}>
                  {c}
                </text>
                {q > 0 && (
                  <g transform={`translate(800,${y}) rotate(-8) scale(${lerp(1.6, 1, smooth(q))})`} opacity={smooth(q)}>
                    <rect x={-90} y={-26} width={180} height={52} rx={4} fill="none" stroke={C.warn} strokeWidth={4} />
                    <text y={11} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 800, letterSpacing: "0.1em" }}>
                      {L.guilty}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      )}

      {money > 0.01 && (
        <g opacity={money}>
          <text x={500} y={230} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(64), fontWeight: 600 }}>
            $4.3B
          </text>
          {/* one bar splitting into two */}
          <rect x={150} y={290} width={700 * (1.8 / 4.3) - split * 6} height={60} rx={6} fill={C.warn} />
          <rect x={150 + 700 * (1.8 / 4.3) + split * 6} y={290} width={700 * (2.5 / 4.3) - split * 6} height={60} rx={6} fill={C.lilac} />
          <g opacity={split}>
            <Label x={150} y={380 + fs(4)} color={C.warn} size={fs(10.5)}>
              {L.fine}
            </Label>
            <Label x={850} y={380 + fs(k >= 1.5 ? 18 : 4)} anchor="end" color={C.lilac} size={fs(10.5)}>
              {L.forfeit}
            </Label>
            <Label x={500} y={440 + fs(k >= 1.5 ? 22 : 6)} anchor="middle" color={C.ink} size={fs(10.5)}>
              {L.monitor}
            </Label>
          </g>
          {v.allowed > 0.01 && (
            <g opacity={smooth(v.allowed)}>
              <Label x={500} y={540} anchor="middle" size={fs(10)} color={C.mute}>
                {L.allowedTitle}
              </Label>
              {L.allowed.map((a, i) => {
                const n = L.allowed.length;
                const x = 500 + (i - (n - 1) / 2) * 200;
                return (
                  <g key={a} opacity={clamp(v.allowed * 4 - i * 0.6)}>
                    <rect x={x - 90} y={575} width={180} height={64} rx={6} fill="#fde6ea" stroke={C.warn} />
                    <text x={x} y={613} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 13.5 * Math.min(k, 1.25) }}>
                      {a}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </g>
      )}

      {cz > 0.001 && (
        <g opacity={smooth(clamp(cz * 6))}>
          <g transform="translate(500,290)">
            <Initials x={0} y={0} text="CZ" s={1.4} color={C.ink} />
            <Label x={0} y={86 + fs(4)} anchor="middle" color={C.ink} size={fs(11)}>
              Changpeng Zhao
            </Label>
          </g>
          <line x1={X0} x2={X1} y1={560} y2={560} stroke={C.line} strokeWidth={3} />
          <line x1={X0} x2={X0 + (X1 - X0) * clamp(cz * 1.1)} y1={560} y2={560} stroke={C.ink} strokeWidth={3} />
          {steps.map((s, i) => {
            const x = X0 + (i / (steps.length - 1)) * (X1 - X0);
            const q = clamp(cz * 1.1 * (steps.length - 1) - i + 1);
            const bad = i === 2;
            return (
              <g key={s.when} opacity={smooth(clamp(q))}>
                <circle cx={x} cy={560} r={14} fill={bad ? C.warn : C.yellow} stroke={C.ink} strokeWidth={2} />
                <text x={x} y={530} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(11), fontWeight: 700 }}>
                  {s.when}
                </text>
                <text x={x} y={600 + fs(4)} textAnchor="middle" fill={bad ? C.warn : C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 14 * Math.min(k, 1.3) }}>
                  {s.what}
                </text>
              </g>
            );
          })}
          {/* prison bars over the sentence */}
          {cz > 0.6 && (
            <g transform="translate(500,800)" opacity={smooth(clamp((cz - 0.6) * 4))}>
              <rect x={-160} y={-60} width={320} height={120} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={2} />
              {[-110, -55, 0, 55, 110].map((x) => (
                <line key={x} x1={x} x2={x} y1={-60} y2={60} stroke={C.ink} strokeWidth={5} />
              ))}
              <text y={10} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(18), fontWeight: 800 }} stroke={C.paper} strokeWidth={5} paintOrder="stroke">
                {L.months}
              </text>
            </g>
          )}
        </g>
      )}
    </g>
  );
}
