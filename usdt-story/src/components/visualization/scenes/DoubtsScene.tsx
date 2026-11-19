"use client";
/**
 * 5 · The years of doubt. A safe with a "100% backed" sign; $850M missing at
 * Crypto Capital and the hole covered with Tether's money; 100 days of which
 * only ~28 were fully backed, with the two fines; quarterly reports stack up;
 * finally a KPMG audit stamp lands on the safe.
 */
import { chapterIndex } from "@/data/coins/usdt/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Logo } from "../svg";

const IDX = chapterIndex("doubts");

function Safe({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-150} y={-150} width={300} height={300} rx={22} fill="#e9e7df" stroke={C.ink} strokeWidth={3} />
      <rect x={-124} y={-124} width={248} height={248} rx={14} fill="#f4f3ee" stroke="#c9c6bb" strokeWidth={2} />
      <circle r={58} fill="#fff" stroke={C.ink} strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 48} y2={Math.sin(a) * 48} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />;
      })}
      <circle r={14} fill={C.ink} />
      <rect x={100} y={-40} width={14} height={80} rx={6} fill={C.ink} />
    </g>
  );
}

export default function DoubtsScene() {
  const { t } = useI18n();
  const L = t.scenes.doubts;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, safe: 0, sign: 0, miss: 0, cover: 0, cal: 0, fines: 0, reports: 0, audit: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { safe: 1, duration: 0.08 }, at(-0.02))
        .to(v, { sign: 1, duration: 0.08, ease: "back.out(1.6)" }, at(0.06))
        .to(v, { miss: 1, duration: 0.08 }, at(0.18))
        .to(v, { cover: 1, duration: 0.1 }, at(0.26))
        .to(v, { cal: 1, duration: 0.12, ease: "none" }, at(0.36))
        .to(v, { fines: 1, duration: 0.08 }, at(0.47))
        .to(v, { reports: 1, duration: 0.12, ease: "none" }, at(0.55))
        .to(v, { audit: 1, duration: 0.08, ease: "back.out(1.8)" }, at(0.74))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const fsz = big(15, 25);
  const partA = fadeOut(smooth(v.cal));
  const calO = fadeIn(smooth(v.cal)) * fadeOut(smooth(v.reports));
  const lastO = fadeIn(smooth(v.reports));
  const miss = smooth(v.miss);
  const cover = smooth(v.cover);
  const sign = smooth(v.sign);
  const swing = Math.sin(v.sign * 9) * (1 - v.sign) * 10;
  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* A + B: the safe, the sign and the missing $850M */}
      {partA > 0.01 && (
        <g opacity={partA}>
          <g opacity={smooth(v.safe)}>
            <Safe x={mobile ? 300 : 280} y={560} s={mobile ? 0.9 : 1} />
          </g>
          {sign > 0.01 && (
            <g transform={`translate(${mobile ? 300 : 280},330) rotate(${swing})`} opacity={sign}>
              <line x1={-70} y1={-60} x2={-70} y2={0} stroke={C.mute} strokeWidth={2} />
              <line x1={70} y1={-60} x2={70} y2={0} stroke={C.mute} strokeWidth={2} />
              <rect x={-130} y={0} width={260} height={64} rx={6} fill={C.paper} stroke={C.gd} strokeWidth={3} />
              <text y={42} textAnchor="middle" fill={C.gd} style={{ fontFamily: "var(--font-mono)", fontSize: big(20, 30), fontWeight: 600, letterSpacing: "0.12em" }}>
                {L.sign}
              </text>
              {miss > 0.5 && <path d={`M-130,0 L130,64 M130,0 L-130,64`} stroke={C.warn} strokeWidth={4} opacity={(miss - 0.5) * 2 * (0.5 + 0.5 * cover)} />}
            </g>
          )}
          {miss > 0.01 && (
            <g opacity={miss}>
              <Logo x={mobile ? 720 : 740} y={230} w={mobile ? 300 : 330} h={70} href="/img/bitfinex.png" />
              <g transform={`translate(${mobile ? 720 : 740},450)`}>
                <rect x={-185} y={-90} width={370} height={180} rx={14} fill="#fff" stroke={C.warn} strokeWidth={3} strokeDasharray="10 8" />
                <text y={-8} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-serif)", fontSize: big(27, 38), fontWeight: 500 }}>
                  {L.missing}
                </text>
                <text y={42} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12.5, 21) }}>
                  {L.missingSub}
                </text>
              </g>
              <line x1={mobile ? 720 : 740} y1={280} x2={mobile ? 720 : 740} y2={355} stroke={C.ink} strokeWidth={2} markerEnd="url(#arrow)" />
            </g>
          )}
          {cover > 0.01 && (
            <g opacity={cover}>
              <path d={`M${mobile ? 400 : 430},600 C${mobile ? 520 : 560},640 ${mobile ? 640 : 680},620 ${mobile ? 700 : 720},${545}`} fill="none" stroke={C.warn} strokeWidth={3} markerEnd="url(#arrow)" />
              {Array.from({ length: 4 }, (_, i) => {
                const q = clamp(v.cover * 1.5 - i * 0.15);
                if (q <= 0 || q >= 1) return null;
                return <circle key={i} cx={lerp(430, 710, q)} cy={600 + Math.sin(q * Math.PI) * 30} r={10} fill={C.green} />;
              })}
              <text x={500} y={mobile ? 830 : 800} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz }}>
                {L.covered}
              </text>
            </g>
          )}
        </g>
      )}

      {/* C: 100 days, ~28 fully backed; the fines */}
      {calO > 0.01 && (
        <g opacity={calO}>
          <text x={mobile ? 80 : 120} y={170} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), letterSpacing: "0.1em" }}>
            {L.calTitle}
          </text>
          {Array.from({ length: 100 }, (_, i) => {
            const q = clamp(v.cal * 1.4 - i * 0.004);
            const ok = [3, 7, 11, 12, 18, 19, 22, 26, 31, 34, 38, 41, 45, 47, 52, 56, 59, 63, 66, 70, 71, 77, 81, 85, 88, 92, 95, 98].includes(i);
            const c = mobile ? 50 : 42, g = mobile ? 8 : 8;
            const x = (mobile ? 80 : 120) + (i % 10) * (c + g);
            const y = 200 + Math.floor(i / 10) * (c + g);
            return <rect key={i} x={x} y={y} width={c} height={c} rx={6} fill={ok ? C.green : "url(#hatch-warn)"} stroke={ok ? "none" : C.warn} strokeOpacity={0.5} opacity={q} />;
          })}
          <text x={mobile ? 80 : 120} y={mobile ? 805 : 740} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 500 }}>
            {L.calNote}
          </text>
          {[
            { v: L.fine1, s: L.fine1Sub, y: mobile ? 905 : 300 },
            { v: L.fine2, s: L.fine2Sub, y: mobile ? 905 : 500 },
          ].map((f, i) => {
            const q = smooth(clamp(v.fines * 2 - i * 0.5));
            const x = mobile ? (i === 0 ? 270 : 730) : 790;
            return (
              <g key={f.v} transform={`translate(${x},${f.y}) rotate(${i ? 6 : -6}) scale(${lerp(1.4, 1, q)})`} opacity={q}>
                <rect x={-160} y={-70} width={320} height={140} rx={14} fill="none" stroke={C.warn} strokeWidth={4} />
                <text y={8} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-serif)", fontSize: big(36, 40), fontWeight: 500 }}>
                  {f.v}
                </text>
                <text y={46} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 19) }}>
                  {f.s}
                </text>
              </g>
            );
          })}
          {!mobile && (
            <text x={790} y={650} textAnchor="middle" fill={C.mute} opacity={smooth(v.fines)} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 20) }}>
              {L.noAdmit}
            </text>
          )}
        </g>
      )}

      {/* D + E: reports stack up, then the audit stamp */}
      {lastO > 0.01 && (
        <g opacity={lastO}>
          <Safe x={500} y={500} s={1.05} />
          {Array.from({ length: 10 }, (_, i) => {
            const q = clamp(v.reports * 1.4 - i * 0.04);
            if (q <= 0.01) return null;
            const x = 140 + (i % 5) * 18, y = 760 - i * 22;
            return (
              <g key={i} opacity={q} transform={`translate(${mobile ? x - 40 : x},${y})`}>
                <rect x={0} y={0} width={110} height={70} rx={4} fill="#fff" stroke={C.mute} strokeWidth={1.5} />
                <text x={10} y={26} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>
                  Q{(i % 4) + 1}
                </text>
              </g>
            );
          })}
          {v.audit > 0.01 && (
            <g transform={`translate(${mobile ? 650 : 700},${300}) rotate(-10) scale(${lerp(1.6, 1, Math.min(1, v.audit))})`} opacity={Math.min(1, v.audit)}>
              <circle r={130} fill={C.paper} fillOpacity={0.85} stroke={C.gd} strokeWidth={6} />
              <circle r={112} fill="none" stroke={C.gd} strokeWidth={2} />
              <text y={18} textAnchor="middle" fill={C.gd} style={{ fontFamily: "var(--font-serif)", fontSize: 64, fontWeight: 600 }}>
                {L.audit}
              </text>
              <text y={66} textAnchor="middle" fill={C.gd} style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600 }}>
                {L.auditDate}
              </text>
              <path d="M-40,-60 L-10,-30 L44,-86" fill="none" stroke={C.gd} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
          <text x={500} y={900} textAnchor="middle" fill={C.ink} opacity={smooth(v.audit)} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 500 }}>
            {L.auditSub}
          </text>
        </g>
      )}
    </g>
  );
}
