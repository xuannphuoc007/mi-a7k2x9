"use client";
/**
 * Conclusion. Back to Lan: her phone wallet shows 1,000 USDT ≈ $1,000 —
 * a tool, not a savings account. Then the stage clears and the 3D USDT coin
 * assembles (CoinCanvas).
 */
import { FINALE } from "@/data/coins/usdt/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { lerp, smooth } from "@/lib/store";
import { C, Label, Logo, Person } from "../svg";

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
        Lan
      </Label>
      <g transform="translate(660,470)" opacity={people}>
        <rect x={-110} y={-190} width={220} height={380} rx={30} fill={C.ink} />
        <rect x={-96} y={-164} width={192} height={328} rx={14} fill="#fff" />
        <text y={-122} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: Math.min(fs(10.5), 20) }}>
          {L.wallet}
        </text>
        <g transform={`scale(${lerp(0.4, 1, Math.min(1, paid))})`} opacity={Math.min(1, paid * 1.5)}>
          <Logo x={0} y={-50} w={90} h={90} href="/img/tether.png" />
        </g>
        <text y={34} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: Math.min(fs(20), 30), fontWeight: 500 }} opacity={Math.min(1, paid)}>
          {L.bal}
        </text>
        <text y={74} textAnchor="middle" fill={C.gd} style={{ fontFamily: "var(--font-mono)", fontSize: Math.min(fs(13), 24), fontWeight: 600 }} opacity={Math.min(1, paid)}>
          {L.approx}
        </text>
        <text y={128} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: Math.min(fs(9.5), 17) }} opacity={Math.min(1, paid)}>
          {L.tip.length > 22 ? L.tip.slice(0, L.tip.lastIndexOf(" ", 22)) : L.tip}
        </text>
        <text y={128 + Math.min(fs(9.5), 17) * 1.3} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: Math.min(fs(9.5), 17) }} opacity={Math.min(1, paid)}>
          {L.tip.length > 22 ? L.tip.slice(L.tip.lastIndexOf(" ", 22) + 1) : ""}
        </text>
      </g>
    </g>
  );
}
