"use client";
/**
 * Act 4 · Manipulation questions. First, what wash trading looks like (one
 * trader on both sides, volume climbing, real buyers zero). Then six case
 * cards, each stamped with its status — dropped, confirmed by Binance,
 * denied, flagged by data, disputed.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSegmentTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, smooth } from "@/lib/store";
import { C, Label, Person } from "../svg";

const IDX = chapterIndex("probes");
const STATUS_COL: Record<string, string> = { dropped: "#4b4f5c", confirmed: "#0f9a68", denied: "#e0662f", flagged: "#2f6fd6", disputed: "#d9304f" };

export default function ManipScene() {
  const { t } = useI18n();
  const L = t.scenes.manip;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSegmentTimeline(
    IDX,
    0.5,
    1,
    { vis: 0, wash: 0, cards: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { wash: 1, duration: 0.18, ease: "none" }, at(-0.04))
        .to(v, { cards: 6, duration: 0.62, ease: "none" }, at(0.18))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const wash = v.wash;
  const cards = v.cards;
  const washFade = 1 - smooth(clamp(cards * 1.5));
  const ts = 14 * Math.min(k, 1.3);
  const spin = wash * Math.PI * 6;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* --- wash trading --- */}
      {washFade > 0.02 && (
        <g opacity={washFade * smooth(clamp(wash * 4))}>
          <Label x={500} y={170} anchor="middle" color={C.ink} size={fs(11)}>
            {L.washTitle}
          </Label>
          <Person x={330} y={420} s={1} color={C.warn} />
          <Person x={670} y={420} s={1} color={C.warn} />
          <text x={330} y={520} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: ts, fontWeight: 600 }}>
            {L.acctA}
          </text>
          <text x={670} y={520} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: ts, fontWeight: 600 }}>
            {L.acctB}
          </text>
          <path d="M390,360 C450,300 550,300 610,360" fill="none" stroke={C.ink} strokeWidth={2.5} markerEnd="url(#arrow)" />
          <path d="M610,440 C550,500 450,500 390,440" fill="none" stroke={C.ink} strokeWidth={2.5} markerEnd="url(#arrow)" />
          <circle cx={500 + Math.cos(spin) * 110} cy={400 + Math.sin(spin) * 70} r={10} fill={C.yellow} stroke={C.ink} strokeWidth={1.5} />
          <text x={500} y={410} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(11) }}>
            {L.sameOwner}
          </text>
          <g transform="translate(200,600)">
            <text x={0} y={0} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12) }}>
              {L.volume}
            </text>
            <rect x={0} y={16} width={600} height={30} rx={5} fill={C.line} />
            <rect x={0} y={16} width={600 * wash} height={30} rx={5} fill={C.yellow} />
            <text x={0} y={100} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(12) }}>
              {L.realBuyers}
            </text>
            <rect x={0} y={116} width={600} height={30} rx={5} fill={C.line} />
            <text x={610} y={140} fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(14), fontWeight: 700 }}>
              0
            </text>
          </g>
        </g>
      )}

      {/* --- six case cards --- */}
      {cards > 0.01 &&
        L.cases.map((c, i) => {
          const q = smooth(clamp(cards - i));
          if (q <= 0.01) return null;
          const col = i % 2;
          const row = Math.floor(i / 2);
          const W = mobile ? 380 : 390;
          const H = mobile ? 210 : 200;
          const x = col === 0 ? 500 - W - 15 : 515;
          const y = 120 + row * (H + 30);
          const sc = STATUS_COL[c.status];
          return (
            <g key={c.title} opacity={q} transform={`translate(${x},${y + (1 - q) * 30})`}>
              <rect x={0} y={0} width={W} height={H} rx={10} fill={C.paper} stroke={sc} strokeWidth={2} />
              <rect x={0} y={0} width={8} height={H} rx={4} fill={sc} />
              <text x={24} y={36} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(mobile ? 9 : 10.5) }}>
                {c.when}
              </text>
              <text x={24} y={mobile ? 72 : 68} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: (mobile ? 18 : 17) * Math.min(k, 1.25), fontWeight: 700 }}>
                {c.title}
              </text>
              {!mobile &&
                c.lines.map((ln, j) => (
                  <text key={j} x={24} y={98 + j * 22} fill={C.ink} opacity={0.85} style={{ fontFamily: "var(--font-sans)", fontSize: 14 }}>
                    {ln}
                  </text>
                ))}
              <g transform={`translate(24,${H - (mobile ? 60 : 42)})`}>
                <rect x={0} y={0} width={Math.min(W - 48, c.label.length * fs(mobile ? 6.5 : 9.5) * 0.66 + 24)} height={fs(mobile ? 15 : 13) + 12} rx={4} fill="none" stroke={sc} strokeWidth={2} />
                <text x={12} y={fs(mobile ? 15 : 13) * 0.75 + 7} fill={sc} style={{ fontFamily: "var(--font-mono)", fontSize: fs(mobile ? 6.5 : 9.5), fontWeight: 700, letterSpacing: mobile ? "0.02em" : "0.06em" }}>
                  {c.label}
                </text>
              </g>
            </g>
          );
        })}
    </g>
  );
}
