"use client";
/**
 * 1 · Print and burn. A deposit receipt (stamped PRINTED) sends tokens out;
 * a redemption receipt (stamped BURNED) takes tokens back into a flame.
 * Then a rubber band pulls a coin back to $1.00, and a counter rolls up to
 * the USDC in circulation.
 */
import { chapterIndex } from "@/data/coins/usdc/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Flame, Token } from "../svg";

const IDX = chapterIndex("mint");

function Receipt({ x, y, w, rot, title, rows, stamp, stampCol, p, st, big }: {
  x: number; y: number; w: number; rot: number; title: string; rows: string[][]; stamp: string; stampCol: string; p: number; st: number; big: (s: number, c: number) => number;
}) {
  const rh = big(15, 27) * 2.4;
  const h = 96 + rows.length * rh + 130;
  const teeth = Math.round(w / 15);
  const tw = w / teeth;
  const edge = Array.from({ length: teeth }, (_, i) => `l${-tw / 2},${7} l${-tw / 2},${-7}`).join(" ");
  return (
    <g transform={`translate(${x},${y + (1 - p) * 30}) rotate(${rot})`} opacity={p}>
      <path d={`M0,0 h${w} v${h} ${edge} Z`} fill="#fffdf6" stroke="#e4ddc8" strokeWidth={1.5} />
      <text x={26} y={48} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 22), letterSpacing: "0.18em" }}>
        {title}
      </text>
      <line x1={26} x2={w - 26} y1={66} y2={66} stroke="#cfc6ad" strokeDasharray="3 5" />
      {rows.map(([a, b], i) => (
        <g key={a} opacity={clamp(p * 3 - 1 - i * 0.4)}>
          <text x={26} y={66 + rh * (i + 0.85)} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 21), letterSpacing: "0.08em" }}>
            {a}
          </text>
          <text x={w - 26} y={66 + rh * (i + 0.85)} textAnchor="end" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(15, 27), fontWeight: 500 }}>
            {b}
          </text>
        </g>
      ))}
      {st > 0.01 && (
        <g transform={`translate(${w / 2},${66 + rows.length * rh + 82}) rotate(-6) scale(${lerp(1.5, 1, st)})`} opacity={st * 0.9}>
          <rect x={-100} y={-34} width={200} height={68} rx={10} fill="none" stroke={stampCol} strokeWidth={3} />
          <text y={big(9, 16)} textAnchor="middle" fill={stampCol} style={{ fontFamily: "var(--font-mono)", fontSize: big(22, 34), fontWeight: 600, letterSpacing: "0.16em" }}>
            {stamp}
          </text>
        </g>
      )}
    </g>
  );
}

export default function MintScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.mint;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, r1: 0, s1: 0, out: 0, r2: 0, s2: 0, burn: 0, band: 0, settle: 0, count: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { r1: 1, duration: 0.08 }, at(-0.02))
        .to(v, { s1: 1, duration: 0.05, ease: "back.out(2)" }, at(0.08))
        .to(v, { out: 1, duration: 0.12, ease: "none" }, at(0.11))
        .to(v, { r2: 1, duration: 0.08 }, at(0.25))
        .to(v, { burn: 1, duration: 0.12, ease: "none" }, at(0.32))
        .to(v, { s2: 1, duration: 0.05, ease: "back.out(2)" }, at(0.4))
        .to(v, { band: 1, duration: 0.07 }, at(0.48))
        .to(v, { settle: 1, duration: 0.18, ease: "none" }, at(0.52))
        .to(v, { count: 1, duration: 0.14, ease: "power1.out" }, at(0.71))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const recO = fadeOut(smooth(v.band));
  const bandO = fadeIn(smooth(v.band)) * fadeOut(smooth(v.count));
  const countO = fadeIn(smooth(v.count));
  // receipts: side by side on desktop, one replacing the other on mobile
  const W = mobile ? 840 : 400;
  const r1x = mobile ? 80 : 60, r1y = mobile ? 120 : 150;
  const r2x = mobile ? 80 : 530, r2y = mobile ? 120 : 210;
  const r1O = smooth(v.r1) * (mobile ? 1 - smooth(v.r2) : 1);
  return (
    <g opacity={v.vis * (1 - ex)}>
      {recO > 0.01 && (
        <g opacity={recO}>
          <Receipt x={r1x} y={r1y} w={W} rot={mobile ? -1 : -3} title={L.depTitle} rows={L.depRows} stamp={L.depStamp} stampCol={C.gd} p={r1O} st={smooth(v.s1) * r1O} big={big} />
          {/* printed tokens fly out */}
          {Array.from({ length: 7 }, (_, i) => {
            const q = clamp(v.out * 1.6 - i * 0.09);
            if (q <= 0 || q >= 1 || mobile) return null;
            const x0 = mobile ? 500 : 260, y0 = mobile ? 520 : 560;
            return <Token key={i} x={x0 + (i - 3) * 40 * q} y={y0 + q * 260} r={18} opacity={1 - q * 0.6} />;
          })}
          <Receipt x={r2x} y={r2y} w={W} rot={mobile ? 1 : 3} title={L.redTitle} rows={L.redRows} stamp={L.redStamp} stampCol={C.warn} p={smooth(v.r2)} st={smooth(v.s2)} big={big} />
          {/* returned tokens fall into the flame */}
          {v.r2 > 0.3 && (
            <g>
              <Flame x={mobile ? 500 : 730} y={mobile ? 880 : 860} s={1.3} t={v.burn * 6} opacity={smooth(v.r2) * (1 - smooth(clamp(v.burn * 2 - 1)) * 0.3)} />
              {Array.from({ length: 6 }, (_, i) => {
                const q = clamp(v.burn * 1.5 - i * 0.1);
                if (q <= 0 || q >= 1) return null;
                const x = (mobile ? 500 : 730) + (i - 2.5) * 30 * (1 - q);
                return <Token key={i} x={x} y={lerp(700, 850, q)} r={16} opacity={1 - q} />;
              })}
            </g>
          )}
        </g>
      )}

      {/* rubber band keeps the price at $1 */}
      {bandO > 0.01 && (
        <g opacity={bandO}>
          {(() => {
            const X0 = 120, X1 = 880, Y = 480;
            const px = (p: number) => lerp(X0, X1, (p - 0.98) / 0.04);
            const wob = Math.sin(v.settle * 14) * (1 - v.settle) * 0.012;
            const cxp = px(1 + (v.settle < 0.05 ? -0.01 : wob));
            const spring = (xa: number, xb: number) => {
              const n = 14;
              let d = `M${xa},${Y}`;
              for (let i = 1; i <= n; i++) d += ` L${lerp(xa, xb, i / n)},${Y + (i === n ? 0 : i % 2 ? -14 : 14)}`;
              return d;
            };
            return (
              <g>
                <line x1={X0} x2={X1} y1={Y + 90} y2={Y + 90} stroke={C.line} strokeWidth={2} />
                {[0.98, 0.99, 1.0, 1.01, 1.02].map((p) => (
                  <g key={p}>
                    <line x1={px(p)} x2={px(p)} y1={Y + 80} y2={Y + 100} stroke={p === 1 ? C.gd : C.mute} strokeWidth={p === 1 ? 3 : 1.5} />
                    <text x={px(p)} y={Y + 100 + big(14, 26) * 1.4} textAnchor="middle" fill={p === 1 ? C.gd : C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 24), fontWeight: p === 1 ? 600 : 400 }}>
                      {(locale === "vi-VN" ? p.toFixed(2).replace(".", ",") : "$" + p.toFixed(2))}
                    </text>
                  </g>
                ))}
                <path d={spring(X0 + 20, cxp - 40)} fill="none" stroke={C.brass} strokeWidth={3} strokeLinejoin="round" />
                <path d={spring(cxp + 40, X1 - 20)} fill="none" stroke={C.brass} strokeWidth={3} strokeLinejoin="round" />
                <rect x={X0 - 6} y={Y - 30} width={12} height={60} rx={4} fill={C.ink} />
                <rect x={X1 - 6} y={Y - 30} width={12} height={60} rx={4} fill={C.ink} />
                <Token x={cxp} y={Y} r={40} />
                <text x={X0} y={Y - 110} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(14, 24) }}>
                  {L.low}
                </text>
                <text x={X1} y={Y - 110 + (mobile ? big(14, 24) * 1.6 : 0) * 0} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(14, 24) }} transform={mobile ? `translate(0,${big(14, 24) * 1.8})` : undefined}>
                  {L.high}
                </text>
                <text x={500} y={Y + 250} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: big(26, 44) }}>
                  {L.band}
                </text>
              </g>
            );
          })()}
        </g>
      )}

      {/* counter */}
      {countO > 0.01 && (
        <g opacity={countO}>
          <text x={500} y={380} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22), letterSpacing: "0.14em" }}>
            {L.counter}
          </text>
          <text x={500} y={500} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: mobile ? 92 : 104, fontWeight: 420 }}>
            {(() => {
              const n = Math.round(L.counterVal * smooth(v.count) / 1e6) * 1e6;
              return new Intl.NumberFormat(locale).format(n);
            })()}
          </text>
          {Array.from({ length: 9 }, (_, i) => (
            <Token key={i} x={260 + i * 60} y={620} r={22} opacity={clamp(v.count * 2 - i * 0.08)} />
          ))}
        </g>
      )}
    </g>
  );
}
