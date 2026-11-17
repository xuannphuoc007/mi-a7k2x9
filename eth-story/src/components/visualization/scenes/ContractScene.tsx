"use client";
/**
 * Act 3 · Simulation 1 — the escrow contract. Anna locks $500 (a stablecoin)
 * in a contract with three written rules. As the reader scrolls, three
 * endings play one after another; the deciding rule lights up and the money moves.
 */
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Chip, Label, Person } from "../svg";

const IDX = chapterIndex("contract");
const LAN = { x: 170, y: 380 };
const ANNA = { x: 830, y: 380 };
const BOX = { x: 500, y: 360 };

/** which rule decides each scenario: 0 approve → rule 0 · 1 silent → rule 1 · 2 no delivery → rule 2 */
export const DECIDING_RULE = [0, 1, 2];

function Vault({ lock, glow }: { lock: number; glow: number }) {
  return (
    <g transform={`translate(${BOX.x},${BOX.y})`}>
      <circle r={130} fill="url(#glow)" opacity={0.4 + glow * 0.6} />
      <path d="M0,-110 L92,0 L0,110 L-92,0 Z" fill={C.paper} fillOpacity={0.6} stroke={C.lilac} strokeWidth={2.2} />
      <path d="M0,-110 L0,110 M-92,0 L92,0" stroke={C.lilac} strokeWidth={0.7} opacity={0.4} />
      <g transform={`translate(0,${74}) scale(${0.8 + lock * 0.2})`} opacity={lock}>
        <rect x={-14} y={-8} width={28} height={22} rx={3} fill={C.lilac} />
        <path d="M-9,-8 V-16 A9,9 0 0 1 9,-16 V-8" fill="none" stroke={C.lilac} strokeWidth={3} />
      </g>
    </g>
  );
}

export default function ContractScene() {
  const { t } = useI18n();
  const L = t.scenes.contract;
  const k = useFontK();
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, people: 0, deposit: 0, rules: 0, inter: 0, play: 0, limits: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { people: 1, duration: 0.1 }, at(-0.1))
        .to(v, { deposit: 1, duration: 0.14, ease: "none" }, at(0.04))
        .to(v, { rules: 1, duration: 0.16, ease: "none" }, at(0.22))
        .to(v, { inter: 1, duration: 0.03 }, at(0.41))
        .to(v, { play: 3, duration: 0.42, ease: "none" }, at(0.43))
        .to(v, { limits: 1, duration: 0.1 }, at(0.84))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const fs = (s: number) => s * k;
  const inter = smooth(v.inter);
  const limits = smooth(v.limits);
  // three endings, one after another: approve → silent 7 days → nothing delivered
  const scenario = Math.min(2, Math.floor(v.play));
  const runs = v.play > 0 ? 1 : 0;
  const active = clamp((v.play - scenario) * 1.15);

  // ---- simulated run (0..1) ----
  const delivered = scenario !== 2;
  const fileQ = delivered ? smooth(clamp(active / 0.28)) : 0;
  const dayQ = clamp((active - 0.3) / 0.4);
  const days = scenario === 0 ? Math.min(2, Math.floor(dayQ * 3)) : Math.floor(dayQ * (scenario === 1 ? 7 : 14));
  const approved = scenario === 0 && active > 0.48;
  const payQ = smooth(clamp((active - 0.72) / 0.26));
  const decided = active > 0.7 && runs > 0;
  const rule = DECIDING_RULE[scenario];
  const to = scenario === 2 ? ANNA : LAN;

  // the $500 chip: Anna → vault during the story; vault → winner during a run
  const dep = smooth(v.deposit);
  let chip = { x: lerp(ANNA.x - 40, BOX.x, dep), y: lerp(ANNA.y - 120, BOX.y, dep) };
  if (inter > 0.5 && payQ > 0) chip = { x: lerp(BOX.x, to.x, payQ), y: lerp(BOX.y, to.y - 130, payQ) };

  const codeY = 610;
  const lineH = 44 * Math.min(k, 1.6);
  const lit = (i: number) => {
    const appear = clamp(v.rules * 3 - i);
    if (inter < 0.5 || runs === 0) return { o: appear, hi: 0 };
    return { o: 1, hi: decided && i === rule ? 1 : 0 };
  };

  return (
    <g opacity={v.vis * (1 - ex)}>
      <Person x={LAN.x} y={LAN.y} color={C.lilac} opacity={smooth(v.people)} s={0.85} wave={decided && scenario !== 2 ? payQ : 0} />
      <Person x={ANNA.x} y={ANNA.y} color={C.sky} opacity={smooth(v.people)} s={0.85} wave={decided && scenario === 2 ? payQ : 0} />
      <Label x={LAN.x} y={LAN.y + 82 + fs(4)} anchor="middle" color={C.ink} size={fs(11)} opacity={v.people}>
        Lan
      </Label>
      <Label x={ANNA.x} y={ANNA.y + 82 + fs(4)} anchor="middle" color={C.ink} size={fs(11)} opacity={v.people}>
        Anna
      </Label>

      <Vault lock={dep} glow={decided ? 1 - payQ : 0} />
      <Label x={BOX.x} y={BOX.y - 128} anchor="middle" color={C.lilac} size={fs(10.5)} opacity={dep}>
        {L.vault}
      </Label>

      {/* delivered file */}
      {inter > 0.5 && runs > 0 && delivered && (
        <g transform={`translate(${lerp(LAN.x + 60, BOX.x - 40, fileQ)},${lerp(LAN.y - 60, BOX.y - 30, fileQ)})`} opacity={1 - payQ * 0.6}>
          <rect x={-18} y={-22} width={36} height={44} rx={3} fill={C.paper} stroke={C.peach} strokeWidth={2} />
          <circle cx={0} cy={-2} r={8} fill={C.peach} />
          <Label x={0} y={36} anchor="middle" color={C.peach} size={fs(9)}>
            logo.png
          </Label>
        </g>
      )}

      {/* the money */}
      <Chip x={chip.x} y={chip.y} text="$500" color={C.mint} k={k} opacity={dep} />
      {dep > 0.98 && inter < 0.5 && (
        <Label x={BOX.x} y={BOX.y + 140 + fs(8)} anchor="middle" size={fs(9)} upper={false} spacing="0.02em">
          {L.stable}
        </Label>
      )}

      {/* day counter + approval */}
      {inter > 0.5 && runs > 0 && active > 0.28 && (
        <g>
          <Label x={BOX.x} y={190} anchor="middle" color={scenario === 2 && days >= 14 ? C.warn : C.ink} size={fs(13)}>
            {L.day} {days}
            {scenario === 2 ? ` / 14` : scenario === 1 ? ` / 7` : ""}
          </Label>
          {approved && (
            <g transform={`translate(${ANNA.x},${ANNA.y - 120})`}>
              <circle r={22} fill={C.mint} />
              <path d="M-9,0 L-2,7 L10,-7" stroke="#ffffff" strokeWidth={3.5} fill="none" strokeLinecap="round" />
            </g>
          )}
          {scenario === 1 && dayQ > 0 && (
            <Label x={ANNA.x} y={ANNA.y - 120} anchor="middle" color={C.mute} size={fs(14)}>
              …
            </Label>
          )}
        </g>
      )}
      {inter > 0.5 && runs > 0 && limits < 0.05 && (
        <Label x={BOX.x} y={130} anchor="middle" color={C.accent} size={fs(11)}>
          {`${scenario + 1}/3 · ${L.endings[scenario]}`}
        </Label>
      )}

      {/* the code */}
      <g opacity={smooth(clamp(v.rules * 4)) * (1 - limits * 0.75)}>
        <rect x={90} y={codeY - 46} width={820} height={lineH * 3 + 64} rx={8} fill={C.paper} stroke={C.line} strokeWidth={1.2} />
        <Label x={110} y={codeY - 22} size={fs(9)} color={C.mute}>
          {L.codeTitle}
        </Label>
        {L.rules.map((r, i) => {
          const s = lit(i);
          const y = codeY + 14 + i * lineH;
          return (
            <g key={i} opacity={s.o}>
              {s.hi > 0 && <rect x={100} y={y - lineH * 0.62} width={800} height={lineH * 0.86} rx={4} fill={C.accent} opacity={0.25} />}
              <text x={118} y={y} fill={s.hi ? C.mint : C.lilac} style={{ fontFamily: "var(--font-mono)", fontSize: (mobile ? 12.5 : 15) * Math.min(k, 1.6) }}>
                {String(i + 1)}. {mobile ? r.short : r.code}
              </text>
            </g>
          );
        })}
      </g>

      {/* outcome */}
      {inter > 0.5 && decided && (
        <Label x={BOX.x} y={codeY + lineH * 3 + 50 + fs(6)} anchor="middle" color={scenario === 2 ? C.sky : C.mint} size={fs(11)} opacity={payQ}>
          {L.outcomes[scenario]}
        </Label>
      )}

      {/* honest limits */}
      {limits > 0.01 && (
        <g opacity={limits}>
          <rect x={120} y={560} width={760} height={300} rx={10} fill={C.paper} stroke={C.line} />
          <g transform="translate(170,640)">
            <circle r={20} fill={C.mint} />
            <path d="M-8,0 L-2,6 L9,-6" stroke="#ffffff" strokeWidth={3} fill="none" strokeLinecap="round" />
            <Label x={40} y={6} color={C.ink} size={fs(14)} upper={false} spacing="0.01em">
              {L.can}
            </Label>
          </g>
          <g transform="translate(170,720)">
            <circle r={20} fill={C.warn} />
            <path d="M-7,-7 L7,7 M7,-7 L-7,7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" />
            <Label x={40} y={6} color={C.ink} size={fs(14)} upper={false} spacing="0.01em">
              {L.cannot}
            </Label>
          </g>
          <g transform="translate(170,800)">
            <ellipse rx={13} ry={17} fill={C.warn} />
            {[-1, 1].map((d) => (
              <path key={d} d={`M${d * 12},-6 L${d * 24},-12 M${d * 13},4 L${d * 26},4 M${d * 12},12 L${d * 22},20`} stroke={C.warn} strokeWidth={2.5} />
            ))}
            <Label x={40} y={6} color={C.ink} size={fs(14)} upper={false} spacing="0.01em">
              {L.bug}
            </Label>
          </g>
        </g>
      )}
    </g>
  );
}
