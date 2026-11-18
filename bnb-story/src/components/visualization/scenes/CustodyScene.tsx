"use client";
/**
 * Act 5 · On the exchange or in your wallet? Two shelves side by side; then
 * what happens in a bad day for each: the exchange is hacked (it pays — if it
 * can), or you lose your recovery phrase (nobody can help).
 */
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, smooth } from "@/lib/store";
import { C, Exchange, Label } from "../svg";

const IDX = chapterIndex("custody");

export default function CustodyScene() {
  const { t } = useI18n();
  const L = t.scenes.custody;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, show: 0, bad: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { show: 1, duration: 0.14 }, at(-0.04))
        .to(v, { bad: 1, duration: 0.3, ease: "none" }, at(0.4))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const show = smooth(v.show);
  const bad = v.bad;
  const ts = 15 * Math.min(k, 1.3);

  return (
    <g opacity={v.vis * (1 - ex)}>
      <g opacity={show}>
        <Exchange x={270} y={360} s={1.05} />
        <Label x={270} y={500 + fs(4)} anchor="middle" color={C.ink} size={fs(11)}>
          {L.exchange}
        </Label>
        {/* own wallet: a small device with a key */}
        <g transform="translate(730,360)">
          <rect x={-70} y={-110} width={140} height={210} rx={16} fill={C.ink} />
          <rect x={-56} y={-92} width={112} height={90} rx={6} fill="#fbf9f3" />
          <circle cx={0} cy={50} r={22} fill={C.yellow} />
          <path d="M-22,-48 a14,14 0 1,1 28,0 a14,14 0 1,1 -28,0 M6,-48 h30 v10 M28,-48 v8" fill="none" stroke={C.ink} strokeWidth={4} />
        </g>
        <Label x={730} y={500 + fs(4)} anchor="middle" color={C.ink} size={fs(11)}>
          {L.wallet}
        </Label>
        <text x={270} y={560} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: ts }}>
          {L.exchangeKeys}
        </text>
        <text x={730} y={560} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: ts }}>
          {L.walletKeys}
        </text>
      </g>

      {/* a bad day */}
      {bad > 0.01 && (
        <g>
          <Label x={500} y={640} anchor="middle" color={C.warn} size={fs(11)} opacity={clamp(bad * 4)}>
            {L.badDay}
          </Label>
          <g opacity={smooth(clamp(bad * 3))}>
            <path d="M250,200 L280,250 L262,252 L290,300" fill="none" stroke={C.warn} strokeWidth={5} strokeLinejoin="round" />
            <rect x={90} y={680} width={360} height={150} rx={10} fill={C.paper} stroke={C.warn} strokeWidth={2} />
            {L.exchangeBad.map((l, i) => (
              <text key={l} x={110} y={720 + i * (ts + 10)} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: ts }}>
                {l}
              </text>
            ))}
          </g>
          <g opacity={smooth(clamp(bad * 3 - 1))}>
            <text x={730} y={250} textAnchor="middle" fill={C.warn} style={{ fontSize: 48 }}>
              ?
            </text>
            <rect x={550} y={680} width={360} height={150} rx={10} fill={C.paper} stroke={C.warn} strokeWidth={2} />
            {L.walletBad.map((l, i) => (
              <text key={l} x={570} y={720 + i * (ts + 10)} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: ts }}>
                {l}
              </text>
            ))}
          </g>
        </g>
      )}
    </g>
  );
}
