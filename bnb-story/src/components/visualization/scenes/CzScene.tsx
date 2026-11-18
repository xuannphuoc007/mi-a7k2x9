"use client";
/**
 * Act 5 · CZ and the community. A timeline of moments, each coloured by how
 * it is usually read (credit / mixed / criticism); then the Binance Alpha
 * backlash as a grid of 221 listings; then supporters' and critics' readings.
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSegmentTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label, Portrait } from "../svg";
import { asset } from "@/lib/asset";

const IDX = chapterIndex("team");
const TONE: Record<string, string> = { credit: "#0f9a68", mixed: "#c99400", critic: "#d9304f" };
const ALPHA_TOTAL = 221;
const ALPHA_DOWN = 200; // "more than 90%" of 221 — community-compiled (CCN, Jan 2026)

export default function CzScene() {
  const { t } = useI18n();
  const L = t.scenes.cz;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSegmentTimeline(
    IDX,
    0.45,
    1,
    { vis: 0, line: 0, alpha: 0, sides: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { line: 1, duration: 0.28, ease: "none" }, at(-0.02))
        .to(v, { alpha: 1, duration: 0.2, ease: "none" }, at(0.3))
        .to(v, { sides: 1, duration: 0.16 }, at(0.6))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const line = v.line;
  const alpha = v.alpha;
  const sides = smooth(v.sides);
  const lineFade = 1 - smooth(clamp(alpha * 3)) * 0.92;
  const ts = mobile ? 20 : 14 * Math.min(k, 1.3);
  const evs = L.moments;
  const Y0 = 200;
  const step = mobile ? 78 : 72;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* --- timeline (vertical, reads top to bottom) --- */}
      {lineFade > 0.02 && (
        <g opacity={lineFade}>
          <Portrait x={170} y={128} r={44} href={asset("/img/cz-portrait.jpg")} id="cz-timeline" />
          <line x1={170} x2={170} y1={Y0} y2={Y0 + step * (evs.length - 1) * clamp(line * 1.15)} stroke={C.ink} strokeWidth={2.5} />
          {evs.map((e, i) => {
            const q = smooth(clamp((line * 1.15 * (evs.length - 1) - i + 0.6) * 2));
            if (q <= 0.01) return null;
            const y = Y0 + i * step;
            const col = TONE[e.tone];
            return (
              <g key={e.when + e.what} opacity={q}>
                <circle cx={170} cy={y} r={11} fill={col} stroke={C.paper} strokeWidth={3} />
                <text x={200} y={y + 6} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(mobile ? 9 : 11) }}>
                  {e.when}
                </text>
                <text x={mobile ? 330 : 310} y={y + 6} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: mobile ? 23 : 16 * Math.min(k, 1.2), fontWeight: 600 }}>
                  {e.what}
                </text>
              </g>
            );
          })}
          {!mobile && (
            <g transform={`translate(170,${Y0 + step * evs.length + 10})`} opacity={smooth(clamp(line * 2 - 1))}>
              {(["credit", "mixed", "critic"] as const).map((tn, i) => (
                <g key={tn} transform={`translate(${i * 210},0)`}>
                  <circle r={7} fill={TONE[tn]} />
                  <text x={16} y={5} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: 13 }}>
                    {L.legend[i]}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      )}

      {/* --- the Alpha backlash --- */}
      {alpha > 0.01 && (
        <g opacity={smooth(clamp(alpha * 4)) * (1 - sides * 0.85)}>
          <Label x={500} y={160} anchor="middle" color={C.ink} size={fs(11)}>
            {L.alphaTitle}
          </Label>
          {Array.from({ length: ALPHA_TOTAL }, (_, i) => {
            const cols = 17;
            const cx = 500 - (cols * 34) / 2 + (i % cols) * 34 + 17;
            const cy = 220 + Math.floor(i / cols) * 34;
            const turned = clamp(alpha * 1.4 * ALPHA_TOTAL - i) > 0 && i < ALPHA_DOWN;
            return <rect key={i} x={cx - 13} y={cy - 13} width={26} height={26} rx={4} fill={turned ? C.warn : C.line} opacity={turned ? 0.8 : 1} />;
          })}
          <text x={500} y={720} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(18), fontWeight: 700 }}>
            {L.alphaBig}
          </text>
          <Label x={500} y={760} anchor="middle" size={fs(8.5)} upper={false} spacing="0.02em">
            {L.alphaNote}
          </Label>
        </g>
      )}

      {/* --- two readings --- */}
      {sides > 0.01 && (
        <g opacity={sides}>
          {[L.fans, L.critics].map((side, si) => {
            const x = si === 0 ? 270 : 730;
            const col = si === 0 ? C.mint : C.warn;
            return (
              <g key={si} transform={`translate(0,${lerp(30, 0, sides)})`}>
                <rect x={x - 220} y={200} width={440} height={mobile ? 560 : 470} rx={10} fill={C.paper} stroke={col} strokeWidth={2} />
                <Label x={x} y={240} anchor="middle" color={col} size={fs(11)}>
                  {side.title}
                </Label>
                {side.points.map((p, i) =>
                  p.split("\n").map((ln, j) => (
                    <text key={`${i}-${j}`} x={x - 190} y={300 + i * (mobile ? 150 : 120) + j * (ts + 8)} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: ts }}>
                      {j === 0 ? "• " : "  "}
                      {ln}
                    </text>
                  )),
                )}
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}
