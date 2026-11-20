"use client";
/**
 * 7 · New rules. The US (GENIUS Act): three requirements, a timeline to the
 * federal trust-bank charter, USDC and Circle National Trust. Europe (MiCA):
 * USDC stays on the regulated shelf while USDT slides off. S&P's gauge swings
 * to 2, "strong", with USDT marked at 5. The gauge stays while the table scrolls past.
 */
import { chapterIndex } from "@/data/coins/usdc/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { Bank, C, Logo, UsdtToken } from "../svg";

const IDX = chapterIndex("rules");

export default function RulesScene() {
  const { t } = useI18n();
  const L = t.scenes.rules;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, us: 0, usat: 0, eu: 0, slide: 0, sp: 0, needle: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { us: 1, duration: 0.08 }, at(-0.02))
        .to(v, { usat: 1, duration: 0.08 }, at(0.08))
        .to(v, { eu: 1, duration: 0.06 }, at(0.2))
        .to(v, { slide: 1, duration: 0.12 }, at(0.26))
        .to(v, { sp: 1, duration: 0.06 }, at(0.4))
        .to(v, { needle: 1, duration: 0.12, ease: "back.out(1.4)" }, at(0.45))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const fsz = big(15, 25);
  const usO = smooth(v.us) * fadeOut(smooth(v.eu));
  const euO = fadeIn(smooth(v.eu)) * fadeOut(smooth(v.sp));
  const spO = fadeIn(smooth(v.sp));
  const usat = smooth(v.usat);
  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* A: United States */}
      {usO > 0.01 && (
        <g opacity={usO}>
          <text x={110} y={170} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(36, 52) }}>
            {L.us}
          </text>
          <text x={110} y={170 + big(15, 24) * 1.8} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(15, 24) }}>
            {L.usLaw}
          </text>
          {L.usNeeds.map((n, i) => (
            <g key={n} opacity={smooth(clamp(v.us * 3 - i * 0.6))}>
              <circle cx={130} cy={330 + i * 80} r={22} fill={C.green} />
              <path d={`M119,${330 + i * 80} l8,8 l15,-16`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              <text x={170} y={338 + i * 80} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(18, 28) }}>
                {n}
              </text>
            </g>
          ))}
          {/* the countdown */}
          <g opacity={smooth(clamp(v.us * 2 - 0.6))}>
            <line x1={150} x2={850} y1={600} y2={600} stroke={C.line} strokeWidth={5} />
            <line x1={150} x2={lerp(150, 850, smooth(v.usat))} y1={600} y2={600} stroke={C.gd} strokeWidth={5} />
            {L.countdown.map((c, k) => {
              const x = 150 + k * 350;
              return (
                <g key={c.d}>
                  <circle cx={x} cy={600} r={14} fill={k === 2 ? C.gd : C.paper} stroke={k === 2 ? C.gd : C.ink} strokeWidth={4} />
                  <text x={x} y={570} textAnchor={k === 0 ? "start" : k === 2 ? "end" : "middle"} fill={k === 2 ? C.gd : C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 22), fontWeight: 600 }} transform={k === 0 ? "translate(-14,0)" : k === 2 ? "translate(14,0)" : undefined}>
                    {c.d}
                  </text>
                  <text x={x} y={640 + big(12, 19) * 0.4} textAnchor={k === 0 ? "start" : k === 2 ? "end" : "middle"} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(12, 19) }} transform={k === 0 ? "translate(-14,0)" : k === 2 ? "translate(14,0)" : undefined}>
                    {mobile && k === 2 ? c.t.split(" ").slice(0, 3).join(" ") : c.t}
                  </text>
                  {mobile && k === 2 && (
                    <text x={x} y={640 + big(12, 19) * 1.8} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(12, 19) }} transform="translate(14,0)">
                      {c.t.split(" ").slice(3).join(" ")}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
          <g opacity={usat} transform={`translate(${mobile ? 290 : 280},${mobile ? 760 : 780})`}>
            <Logo x={0} y={0} w={140} h={140} href="/img/usdc.png" />
            <text x={0} y={115} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(13, 22), fontWeight: 600 }}>
              {L.usdcIn}
            </text>
          </g>
          <g opacity={usat} transform={`translate(${mobile ? 720 : 720},${mobile ? 760 : 780})`}>
            <Bank x={0} y={0} s={0.8} color={C.gd} />
            <text x={0} y={115} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 600 }}>
              {L.trust}
            </text>
            <text x={0} y={115 + fsz * 1.4} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(13, 22) }}>
              {L.trustSub}
            </text>
          </g>
        </g>
      )}

      {/* B: Europe */}
      {euO > 0.01 && (
        <g opacity={euO}>
          <text x={110} y={170} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(36, 52) }}>
            {L.eu}
          </text>
          <text x={110} y={170 + big(15, 24) * 1.8} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(15, 24) }}>
            {L.euLaw}
          </text>
          {/* ring of stars */}
          <g transform="translate(800,170)">
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <circle key={i} cx={Math.cos(a) * 52} cy={Math.sin(a) * 52} r={7} fill={C.brass} />;
            })}
          </g>
          {/* a regulated exchange shelf */}
          <rect x={150} y={540} width={700} height={18} rx={4} fill={C.ink} />
          <rect x={150} y={360} width={700} height={200} rx={14} fill="none" stroke={C.line} strokeWidth={3} />
          {["USDC", "EURC", "USDT"].map((n, i) => {
            const isT = n === "USDT";
            const s = smooth(v.slide);
            const x = 270 + i * 230 + (isT ? s * 260 : 0);
            const y = 470 + (isT ? s * 240 : 0);
            return (
              <g key={n} opacity={isT ? 1 - s * 0.4 : 1} transform={`rotate(${isT ? s * 24 : 0},${x},${y})`}>
                {isT ? <UsdtToken x={x} y={y} r={56} /> : n === "USDC" ? <Logo x={x} y={y} w={112} h={112} href="/img/usdc.png" /> : <circle cx={x} cy={y} r={56} fill="#1f4fa3" />}
                {n === "EURC" && (
                  <text x={x} y={y + 8} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600 }}>
                    {n}
                  </text>
                )}
                {isT && s > 0.5 && <path d={`M${x - 60},${y - 60} L${x + 60},${y + 60} M${x + 60},${y - 60} L${x - 60},${y + 60}`} stroke={C.warn} strokeWidth={8} opacity={(s - 0.5) * 2} />}
              </g>
            );
          })}
          <text x={500} y={mobile ? 860 : 880} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz }}>
            {L.euNote}
          </text>
        </g>
      )}

      {/* C: S&P gauge */}
      {spO > 0.01 && (
        <g opacity={spO}>
          <text x={500} y={200} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {L.sp}
          </text>
          {(() => {
            const cx = 500, cy = 620, R = 300;
            const seg = (i: number) => {
              const a0 = Math.PI + (i / 5) * Math.PI, a1 = Math.PI + ((i + 1) / 5) * Math.PI;
              const p = (a: number, r: number) => `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
              return `M${p(a0 + 0.02, R)} A${R},${R} 0 0 1 ${p(a1 - 0.02, R)} L${p(a1 - 0.02, R - 70)} A${R - 70},${R - 70} 0 0 0 ${p(a0 + 0.02, R - 70)} Z`;
            };
            const cols = ["#2775ca", "#5aa0e6", "#e0c04a", "#e8892b", "#c4453a"];
            const ang = Math.PI + lerp(0.9, 0.3, smooth(v.needle)) * Math.PI;
            const angT = Math.PI + 0.9 * Math.PI;
            return (
              <g>
                {cols.map((c, i) => (
                  <path key={i} d={seg(i)} fill={c} opacity={i === 1 ? 1 : 0.5} />
                ))}
                {[1, 2, 3, 4, 5].map((n, i) => {
                  const a = Math.PI + ((i + 0.5) / 5) * Math.PI;
                  return (
                    <text key={n} x={cx + Math.cos(a) * (R - 35)} y={cy + Math.sin(a) * (R - 35) + 9} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700 }}>
                      {n}
                    </text>
                  );
                })}
                {/* USDT's mark, for comparison */}
                <g opacity={smooth(v.needle)}>
                  <line x1={cx + Math.cos(angT) * (R + 8)} y1={cy + Math.sin(angT) * (R + 8)} x2={cx + Math.cos(angT) * (R + 40)} y2={cy + Math.sin(angT) * (R + 40)} stroke={C.usdt} strokeWidth={6} strokeLinecap="round" />
                  <UsdtToken x={cx + Math.cos(angT) * (R + 72)} y={cy + Math.sin(angT) * (R + 72)} r={26} />
                </g>
                <line x1={cx} y1={cy} x2={cx + Math.cos(ang) * (R - 90)} y2={cy + Math.sin(ang) * (R - 90)} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
                <circle cx={cx} cy={cy} r={22} fill={C.ink} />
                <text x={cx - R} y={cy + 50} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22) }}>
                  {L.spScale[0]}
                </text>
                <text x={cx + R} y={cy + 50} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22) }}>
                  {L.spScale[1]}
                </text>
                <text x={cx} y={cy + 160} textAnchor="middle" fill={C.gd} opacity={smooth(v.needle)} style={{ fontFamily: "var(--font-serif)", fontSize: big(52, 72), fontWeight: 500 }}>
                  {L.spVal}
                </text>
              </g>
            );
          })()}
        </g>
      )}
    </g>
  );
}
