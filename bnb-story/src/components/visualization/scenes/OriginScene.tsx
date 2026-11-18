"use client";
/**
 * Act 1 · Origin. CZ's path to 2017 as a timeline (no portrait), the July 2017
 * token sale split 50/40/10, the move out of China, and BNB as a fee coupon
 * (the 3D coin floats above while the chapter closes).
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { BnbGlyph, C, Label } from "../svg";

const IDX = chapterIndex("origin");

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  return `M${cx},${cy} L${p(a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`;
}

export default function OriginScene() {
  const { t } = useI18n();
  const L = t.scenes.origin;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, line: 0, sale: 0, move: 0, coupon: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { line: 1, duration: 0.2, ease: "none" }, at(-0.02))
        .to(v, { line: 0, duration: 0.04 }, at(0.24))
        .to(v, { sale: 1, duration: 0.16, ease: "none" }, at(0.27))
        .to(v, { sale: 0, duration: 0.04 }, at(0.48))
        .to(v, { move: 1, duration: 0.18, ease: "none" }, at(0.5))
        .to(v, { move: 0, duration: 0.04 }, at(0.72))
        .to(v, { coupon: 1, duration: 0.1 }, at(0.74))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);

  // timeline
  const steps = L.steps;
  const X0 = 110;
  const X1 = 890;
  const Y = 470;
  const n = steps.length;
  const lineQ = v.line;

  // sale pie: 50% public, 40% team, 10% angels
  const sale = smooth(v.sale);
  const parts = [
    { f: 0.5, c: C.yellow, label: L.pie[0] },
    { f: 0.4, c: C.lilac, label: L.pie[1] },
    { f: 0.1, c: C.peach, label: L.pie[2] },
  ];
  let a = -Math.PI / 2;

  // move: China ✗ → Japan → Malta → "no fixed HQ"
  const move = v.move;
  const stops = [
    { x: 260, y: 430, label: L.places[0] },
    { x: 470, y: 330, label: L.places[1] },
    { x: 700, y: 470, label: L.places[2] },
    { x: 560, y: 640, label: L.places[3] },
  ];
  const seg = clamp(move * 3.2);
  const leg = Math.min(2, Math.floor(seg));
  const lq = seg - leg;
  const plane = move <= 0 ? stops[0] : { x: lerp(stops[leg].x, stops[leg + 1].x, smooth(clamp(lq))), y: lerp(stops[leg].y, stops[leg + 1].y, smooth(clamp(lq))) };

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* CZ timeline */}
      {lineQ > 0.01 && (
        <g opacity={smooth(clamp(lineQ * 4)) * (1 - smooth(clamp((v.sale - 0) * 4)))}>
          <Label x={500} y={260} anchor="middle" color={C.ink} size={fs(12)}>
            {L.cz}
          </Label>
          <line x1={X0} x2={lerp(X0, X1, lineQ)} y1={Y} y2={Y} stroke={C.ink} strokeWidth={2} />
          {steps.map((s, i) => {
            const x = X0 + (i / (n - 1)) * (X1 - X0);
            const q = clamp(lineQ * (n - 0.5) - i);
            if (q <= 0) return null;
            const up = i % 2 === 0;
            return (
              <g key={s.year} opacity={smooth(q)}>
                <circle cx={x} cy={Y} r={i === n - 1 ? 12 : 7} fill={i === n - 1 ? C.yellow : C.paper} stroke={C.ink} strokeWidth={2} />
                <text x={x} y={up ? Y - 30 : Y + 46} textAnchor="middle" fill={i === n - 1 ? C.accent : C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(13), fontWeight: 600 }}>
                  {s.year}
                </text>
                {!mobile && (
                  <Label x={x} y={up ? Y - 54 : Y + 70} anchor="middle" size={10} upper={false} spacing="0.01em" color={C.mute}>
                    {s.what}
                  </Label>
                )}
              </g>
            );
          })}
        </g>
      )}

      {/* the token sale */}
      {sale > 0.01 && (
        <g opacity={sale}>
          <Label x={500} y={200} anchor="middle" color={C.ink} size={fs(12)}>
            {L.saleTitle}
          </Label>
          {parts.map((p, i) => {
            const a0 = a;
            const a1 = a + p.f * Math.PI * 2 * clamp(v.sale * 1.4);
            a = a0 + p.f * Math.PI * 2;
            const mid = (a0 + a0 + p.f * Math.PI * 2) / 2;
            return (
              <g key={i}>
                {a1 > a0 && <path d={arc(500, 460, 170, a0, a1)} fill={p.c} stroke={C.paper} strokeWidth={3} />}
                <Label x={k >= 1.5 ? 500 : 500 + Math.cos(mid) * 235} y={k >= 1.5 ? 670 + i * fs(13) : 460 + Math.sin(mid) * 215} anchor={k >= 1.5 ? "middle" : Math.cos(mid) > 0.2 ? "start" : Math.cos(mid) < -0.2 ? "end" : "middle"} color={C.ink} size={fs(10)} opacity={clamp(v.sale * 2 - 0.6)}>
                  {p.label}
                </Label>
              </g>
            );
          })}
          <circle cx={500} cy={460} r={70} fill={C.paper} />
          <text x={500} y={466} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(15), fontWeight: 700 }}>
            200M BNB
          </text>
          <Label x={500} y={k >= 1.5 ? 690 + 3 * fs(13) : 720} anchor="middle" color={C.accent} size={fs(11)}>
            {L.raised}
          </Label>
        </g>
      )}

      {/* moving out of China */}
      {move > 0.01 && (
        <g opacity={smooth(clamp(move * 5)) * (1 - smooth(clamp((move - 0.95) * 20)))}>
          <Label x={500} y={200} anchor="middle" color={C.ink} size={fs(12)}>
            {L.moveTitle}
          </Label>
          {stops.map((s, i) => (
            <g key={i}>
              {i > 0 && <line x1={stops[i - 1].x} y1={stops[i - 1].y} x2={s.x} y2={s.y} stroke={C.line} strokeWidth={2} strokeDasharray="4 6" />}
              <circle cx={s.x} cy={s.y} r={i === 3 ? 34 : 12} fill={i === 0 ? C.warn : i === 3 ? "none" : C.paper} stroke={i === 0 ? C.warn : C.ink} strokeWidth={2} strokeDasharray={i === 3 ? "5 5" : undefined} />
              {i === 0 && <path d={`M${s.x - 7},${s.y - 7} L${s.x + 7},${s.y + 7} M${s.x + 7},${s.y - 7} L${s.x - 7},${s.y + 7}`} stroke="#fff" strokeWidth={3} />}
              <Label x={s.x} y={s.y + (i === 3 ? 62 : 40) + fs(4)} anchor="middle" color={i === 0 ? C.warn : C.ink} size={fs(10)}>
                {s.label}
              </Label>
            </g>
          ))}
          <g transform={`translate(${plane.x},${plane.y - 26})`}>
            <path d="M-16,0 L16,0 L4,-5 L-2,-16 L-6,-16 L-4,-4 L-12,-4 L-15,-9 L-18,-9 Z" fill={C.accent} />
          </g>
        </g>
      )}

      {/* BNB as a coupon — the 3D coin floats above (CoinCanvas) */}
      {v.coupon > 0.01 && (
        <g opacity={smooth(v.coupon)}>
          <g transform="translate(500,700)">
            <rect x={-230} y={-70} width={460} height={140} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={2} strokeDasharray="0" />
            <line x1={70} x2={70} y1={-70} y2={70} stroke={C.ink} strokeDasharray="6 6" />
            <Label x={-80} y={-28} anchor="middle" size={fs(10)} color={C.mute}>
              {L.fee}
            </Label>
            <text x={-80} y={20} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(24), fontWeight: 700 }}>
              {L.feeValue}
            </text>
            <BnbGlyph x={150} y={0} s={1.15} />
          </g>
          <Label x={500} y={820 + fs(6)} anchor="middle" color={C.accent} size={fs(11)}>
            {L.coupon}
          </Label>
        </g>
      )}
    </g>
  );
}
