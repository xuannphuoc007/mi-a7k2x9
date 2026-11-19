"use client";
/**
 * 9 · New rules. The US (GENIUS Act): three requirements, USAT for Americans,
 * USDT pointed at the rest of the world. Europe (MiCA): USDT slides off a
 * regulated exchange shelf. S&P's gauge swings to 5, "weak". The gauge stays
 * while the comparison table scrolls past.
 */
import { chapterIndex } from "@/data/coins/usdt/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Logo, Token } from "../svg";

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
          <g opacity={usat} transform={`translate(${mobile ? 300 : 280},${mobile ? 700 : 690})`}>
            <Logo x={0} y={0} w={150} h={150} href="/img/usat.png" />
            <text x={0} y={120} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 600 }}>
              {L.usat}
            </text>
            <text x={0} y={120 + fsz * 1.4} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(13, 22) }}>
              {L.usatSub}
            </text>
          </g>
          <g opacity={usat} transform={`translate(${mobile ? 720 : 720},${mobile ? 700 : 690})`}>
            <Logo x={0} y={0} w={130} h={130} href="/img/tether.png" />
            <path d="M80,0 L180,-50" stroke={C.mute} strokeWidth={3} markerEnd="url(#arrow)" />
            <text x={0} y={120} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(13, 22) }}>
              {mobile ? "USDT" : L.usdtOut}
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
                {isT ? <Token x={x} y={y} r={56} /> : <circle cx={x} cy={y} r={56} fill={n === "USDC" ? "#2775ca" : "#1f4fa3"} />}
                {!isT && (
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
            const cols = ["#26a17b", "#7cbf6b", "#e0c04a", "#e8892b", "#c4453a"];
            const ang = Math.PI + lerp(0.1, 0.9, smooth(v.needle)) * Math.PI;
            return (
              <g>
                {cols.map((c, i) => (
                  <path key={i} d={seg(i)} fill={c} opacity={i === 4 ? 1 : 0.55} />
                ))}
                {[1, 2, 3, 4, 5].map((n, i) => {
                  const a = Math.PI + ((i + 0.5) / 5) * Math.PI;
                  return (
                    <text key={n} x={cx + Math.cos(a) * (R - 35)} y={cy + Math.sin(a) * (R - 35) + 9} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700 }}>
                      {n}
                    </text>
                  );
                })}
                <line x1={cx} y1={cy} x2={cx + Math.cos(ang) * (R - 90)} y2={cy + Math.sin(ang) * (R - 90)} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
                <circle cx={cx} cy={cy} r={22} fill={C.ink} />
                <text x={cx - R} y={cy + 50} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22) }}>
                  {L.spScale[0]}
                </text>
                <text x={cx + R} y={cy + 50} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22) }}>
                  {L.spScale[1]}
                </text>
                <text x={cx} y={cy + 160} textAnchor="middle" fill={C.warn} opacity={smooth(v.needle)} style={{ fontFamily: "var(--font-serif)", fontSize: big(52, 72), fontWeight: 500 }}>
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
