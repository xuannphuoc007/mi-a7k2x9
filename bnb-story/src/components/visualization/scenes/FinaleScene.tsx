"use client";
/**
 * Act 5 · Finale. Back to Minh: the bitcoin he bought splits — a little stays
 * on the exchange, the rest goes to his own wallet. Then the stage clears and
 * the 3D BNB coin assembles (CoinCanvas).
 */
import { FINALE } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Exchange, Label, Person } from "../svg";

export default function FinaleScene() {
  const { t } = useI18n();
  const L = t.scenes.finale;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    FINALE,
    { vis: 0, people: 0, split: 0, out: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { people: 1, duration: 0.08 }, at(-0.04))
        .to(v, { split: 1, duration: 0.12, ease: "none" }, at(0.04))
        .to(v, { out: 1, duration: 0.08 }, at(0.16))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(0.25));
    },
    { post: 0.05 },
  );
  if (v.vis <= 0.001) return null;
  const out = smooth(v.out);
  const sp = smooth(v.split);
  const coin = (x: number, y: number, s = 1, o = 1) => (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
      <circle r={18} fill="#f7931a" />
      <text y={6} textAnchor="middle" fill="#fff" style={{ fontSize: 18, fontWeight: 700 }}>
        ₿
      </text>
    </g>
  );
  return (
    <g opacity={v.vis * (1 - out)}>
      <Person x={500} y={560} color={C.sky} s={1.05} opacity={smooth(v.people)} wave={sp} />
      <Label x={500} y={660 + fs(4)} anchor="middle" color={C.ink} size={fs(12)} opacity={smooth(v.people)}>
        Minh
      </Label>
      <Exchange x={200} y={420} s={0.8} opacity={smooth(v.people)} />
      <g transform="translate(800,400)" opacity={smooth(v.people)}>
        <rect x={-50} y={-80} width={100} height={150} rx={12} fill={C.ink} />
        <rect x={-40} y={-66} width={80} height={60} rx={4} fill="#fbf9f3" />
        <circle cx={0} cy={36} r={16} fill={C.yellow} />
      </g>
      {coin(lerp(500, 220, sp), lerp(440, 300, sp), lerp(1.4, 0.8, sp))}
      {coin(lerp(500, 800, sp), lerp(440, 290, sp), lerp(1.4, 1.2, sp))}
      <g opacity={sp}>
        <Label x={200} y={560 + fs(4)} anchor="middle" color={C.ink} size={fs(10)}>
          {L.trade}
        </Label>
        <Label x={800} y={560 + fs(4)} anchor="middle" color={C.ink} size={fs(10)}>
          {L.save}
        </Label>
      </g>
      <Label x={500} y={790} anchor="middle" color={C.accent} size={fs(11)} opacity={clamp(sp * 2 - 1)}>
        {L.phrase}
      </Label>
    </g>
  );
}
