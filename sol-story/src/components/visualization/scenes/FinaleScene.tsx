"use client";
/**
 * Act 5 · Finale. Back to Minh: his phone confirms the coffee payment in a
 * fraction of a second for less than a cent. Then the stage clears and the
 * 3D SOL coin assembles (CoinCanvas).
 */
import { FINALE } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { lerp, smooth } from "@/lib/store";
import { C, Label, Person } from "../svg";

export default function FinaleScene() {
  const { t } = useI18n();
  const L = t.scenes.finale;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    FINALE,
    { vis: 0, people: 0, paid: 0, out: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { people: 1, duration: 0.08 }, at(-0.04))
        .to(v, { paid: 1, duration: 0.08, ease: "back.out(1.7)" }, at(0.03))
        .to(v, { out: 1, duration: 0.08 }, at(0.16))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(0.25));
    },
    { post: 0.05 },
  );
  if (v.vis <= 0.001) return null;
  const out = smooth(v.out);
  const people = smooth(v.people);
  const paid = v.paid;
  return (
    <g opacity={v.vis * (1 - out)}>
      <Person x={320} y={560} color={C.sky} s={1.05} opacity={people} wave={smooth(paid)} />
      <Label x={320} y={660 + fs(4)} anchor="middle" color={C.ink} size={fs(12)} opacity={people}>
        Minh
      </Label>
      <g transform="translate(660,470)" opacity={people}>
        <rect x={-110} y={-190} width={220} height={380} rx={30} fill={C.ink} />
        <rect x={-96} y={-164} width={192} height={328} rx={14} fill="#fff" />
        <g transform={`scale(${lerp(0.4, 1, Math.min(1, paid))})`} opacity={Math.min(1, paid * 1.5)}>
          <circle cx={0} cy={-62} r={44} fill="#14c98a" />
          <path d="M-20,-62 L-5,-46 L22,-80" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text y={22} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: Math.min(fs(15), 26), fontWeight: 700 }} opacity={Math.min(1, paid)}>
          {L.paid}
        </text>
        <text y={58} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: Math.min(fs(10.5), 20) }} opacity={Math.min(1, paid)}>
          {L.to}
        </text>
        <text y={98} textAnchor="middle" fill="#14b07c" style={{ fontFamily: "var(--font-serif)", fontSize: Math.min(fs(22), 40), fontWeight: 600 }} opacity={Math.min(1, paid)}>
          {L.time}
        </text>
        <text y={130} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: Math.min(fs(10.5), 20) }} opacity={Math.min(1, paid)}>
          {L.fee}
        </text>
      </g>
    </g>
  );
}
