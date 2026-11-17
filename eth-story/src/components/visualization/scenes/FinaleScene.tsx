"use client";
/**
 * Act 5 · Finale. Back to Lan: the contract pays her for cents on a Layer-2
 * network. Then the stage clears and the 3D diamond assembles (DiamondCanvas).
 */
import { FINALE } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Chip, Label, Person } from "../svg";

export default function FinaleScene() {
  const { t } = useI18n();
  const L = t.scenes.finale;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    FINALE,
    { vis: 0, people: 0, pay: 0, stamp: 0, out: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { people: 1, duration: 0.08 }, at(-0.08))
        .to(v, { pay: 1, duration: 0.1, ease: "none" }, at(0.02))
        .to(v, { stamp: 1, duration: 0.05 }, at(0.1))
        .to(v, { out: 1, duration: 0.08 }, at(0.15))
        .to(v, { vis: 0, duration: 0.02, ease: "none" }, at(0.24));
    },
    { post: 0.05 },
  );
  if (v.vis <= 0.001) return null;
  const out = smooth(v.out);
  const pay = smooth(v.pay);
  const stamp = smooth(v.stamp);
  return (
    <g opacity={v.vis * (1 - out)}>
      <Person x={220} y={520} color={C.lilac} s={1.05} opacity={smooth(v.people)} wave={stamp} />
      <Person x={780} y={520} color={C.sky} s={0.9} opacity={smooth(v.people)} />
      <path d="M720,430 Q500,300 290,430" fill="none" stroke={C.mint} strokeWidth={2} strokeDasharray="6 6" opacity={clamp(pay * 3)} />
      <Chip x={lerp(720, 300, pay)} y={lerp(430, 410, pay) - Math.sin(pay * Math.PI) * 90} text="$500" color={C.mint} k={k} opacity={smooth(v.people)} />
      <g opacity={stamp} transform={`translate(500,700) rotate(-4) scale(${lerp(1.3, 1, stamp)})`}>
        <rect x={-210} y={-50} width={420} height={100} rx={8} fill="none" stroke={C.mint} strokeWidth={3} />
        <text x={0} y={-6} textAnchor="middle" fill={C.mint} style={{ fontFamily: "var(--font-mono)", fontSize: fs(18), fontWeight: 600 }}>
          {L.paid}
        </text>
        <Label x={0} y={26} anchor="middle" color={C.ink} size={fs(9.5)}>
          {L.fee}
        </Label>
      </g>
    </g>
  );
}
