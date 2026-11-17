"use client";
import { chapterIndex } from "@/data/coins/xrp/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, mulberry32, smooth } from "@/lib/store";
import { CENTER, UNL, UNL_OWNER, VALIDATOR_COUNT, validatorPos } from "@/data/coins/xrp/layouts";
import { C, DrawPath, Label, mix } from "../svg";

const IDX = chapterIndex("consensus");
const rnd = mulberry32(77);
/** each validator's initial candidate set (3 bits) — they disagree at first */
const initialSets = Array.from({ length: VALIDATOR_COUNT }, () => [rnd() > 0.3, rnd() > 0.5, rnd() > 0.6]);
const finalSet = [true, true, false];
const MINI = { x: 500, y: 520, r: 74 }; // where the ring shrinks to for chapter 4

export default function ConsensusScene() {
  const { t } = useI18n();
  const L = t.scenes.consensus;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, expand: 0, unl: 0, proposals: 0, round: 0, converge: 0, validate: 0, chain: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.1, ease: "none" }, at(-0.1))
        .to(v, { expand: 1, duration: 0.24 }, at(-0.02))
        .to(v, { unl: 1, duration: 0.12 }, at(0.22))
        .to(v, { proposals: 1, duration: 0.5, ease: "none" }, at(0.25))
        .to(v, { round: 3.999, duration: 0.48, ease: "none" }, at(0.27))
        .to(v, { converge: 1, duration: 0.24 }, at(0.5))
        .to(v, { validate: 1, duration: 0.08 }, at(0.75))
        .to(v, { chain: 1, duration: 0.16 }, at(0.82))
        .to(v, { exit: 1, duration: 0.2 }, at(0.98))
        .to(v, { vis: 0, duration: 0.06, ease: "none" }, at(1.14));
    },
  );
  if (v.vis <= 0.001) return null;

  const ex = smooth(v.exit);
  const radius = lerp(230, 300, smooth(v.expand));
  const pos = Array.from({ length: VALIDATOR_COUNT }, (_, i) => {
    const full = validatorPos(i, radius);
    const mini = validatorPos(i, MINI.r, MINI.x, MINI.y);
    return mix(full, mini, ex);
  });
  const round = Math.floor(v.round);
  const conv = smooth(v.converge);
  const agree = Math.round(lerp(lerp(38, 64, clamp(v.round / 3)), 90, conv));
  const owner = pos[UNL_OWNER];
  const blockY = lerp(CENTER.y, 880, smooth(v.chain));
  const blockAt = mix({ x: lerp(CENTER.x, 680, smooth(v.chain)), y: blockY }, { x: 500, y: 110 }, ex);

  return (
    <g opacity={v.vis}>
      {/* faint orbit */}
      <circle cx={lerp(CENTER.x, MINI.x, ex)} cy={lerp(CENTER.y, MINI.y, ex)} r={lerp(radius, MINI.r, ex)} fill="none" stroke={C.line} strokeDasharray="2 6" opacity={0.8} />

      {/* UNL of one server */}
      {UNL.map((j, k) => (
        <DrawPath
          key={`u${j}`}
          d={`M${owner.x},${owner.y} L${pos[j].x},${pos[j].y}`}
          p={clamp(v.unl * 2 - k * 0.08)}
          width={0.9}
          color={C.accent}
          opacity={0.75 * (1 - ex) * (1 - v.validate * 0.6)}
        />
      ))}
      <Label x={owner.x} y={owner.y + 44} anchor="middle" color={C.accent} opacity={v.unl * (1 - ex) * (1 - v.validate)}>
        {L.unl}
      </Label>

      {/* proposals travelling between validators */}
      {v.proposals > 0 &&
        v.proposals < 1 &&
        pos.map((p, i) => {
          const j = (i + 3 + (round % 2) * 2) % VALIDATOR_COUNT;
          const ph = (v.proposals * 7 + i * 0.137) % 1;
          const q = mix(p, pos[j], smooth(ph));
          const set = initialSets[i].map((b, k) => (conv > 0.5 + k * 0.1 ? finalSet[k] : b));
          return (
            <g key={`pr${i}`} transform={`translate(${q.x},${q.y})`} opacity={Math.sin(ph * Math.PI)}>
              {set.map((b, k) => (
                <rect key={k} x={-8 + k * 6} y={-3} width={4.5} height={6} fill={b ? (conv > 0.6 ? C.accent : C.ink) : "none"} stroke={C.ink} strokeWidth={0.6} />
              ))}
            </g>
          );
        })}

      {/* validators */}
      {pos.map((p, i) => {
        const appear = clamp(v.expand * 3 - (i % 6) * 0.25);
        const set = initialSets[i].map((b, k) => (conv > 0.4 + k * 0.12 ? finalSet[k] : b));
        const isOwner = i === UNL_OWNER;
        const inUnl = UNL.includes(i) || isOwner;
        return (
          <g key={`v${i}`} transform={`translate(${p.x},${p.y}) scale(${appear * lerp(1, 0.45, ex)})`}>
            {v.validate > 0 && v.validate < 1 && <circle r={18 + v.validate * 30} fill="none" stroke={C.accent} opacity={1 - v.validate} />}
            <circle r={17} fill={C.paper} stroke={isOwner ? C.accent : C.ink} strokeWidth={isOwner ? 2.2 : 1.3} />
            <circle r={11} fill="none" stroke={C.ink} strokeWidth={0.6} strokeDasharray="1.5 2.5" opacity={inUnl ? 0.9 : 0.25} />
            {set.map((b, k) => (
              <rect key={k} x={-7 + k * 5} y={-3} width={4} height={6} fill={b ? (conv > 0.55 ? C.accent : C.ink) : "none"} stroke={C.ink} strokeWidth={0.5} />
            ))}
            <Label x={0} y={32} anchor="middle" size={9.5} opacity={(1 - ex) * clamp(v.expand * 2 - 0.5)}>
              V-{String(i + 1).padStart(2, "0")}
            </Label>
          </g>
        );
      })}

      {/* center: pending packet → validated ledger block */}
      <g transform={`translate(${blockAt.x},${blockAt.y}) scale(${lerp(1, 0.62, ex)})`}>
        <circle r={lerp(40, 10, v.validate)} fill="url(#glow)" opacity={1 - v.chain} />
        {v.validate < 0.5 ? (
          <rect x={-7} y={-5} width={14} height={10} rx={1.5} fill={C.accent} stroke={C.ink} strokeWidth={0.8} />
        ) : (
          <g opacity={clamp(v.validate * 2 - 1)}>
            <rect x={-78} y={-30} width={156} height={60} fill={C.paper} stroke={C.accent} strokeWidth={1.6} />
            <Label x={-70} y={-13} color={C.accent} size={9.5}>
              {L.validated}
            </Label>
            <Label x={-70} y={4} color={C.ink} size={10} upper={false} spacing="0">
              {L.ledgerIndex} #N+1 ✓
            </Label>
          </g>
        )}
      </g>

      {/* history chain */}
      <g opacity={smooth(v.chain) * (1 - ex)}>
        {[-3, -2, -1].map((k) => (
          <g key={k} transform={`translate(${680 + k * 168},880)`}>
            <rect x={-78} y={-30} width={156} height={60} fill={C.paper} stroke={C.ink} strokeWidth={1} opacity={0.75} />
            <Label x={-70} y={-10} size={9.5} upper={false} spacing="0">
              {L.ledgerIndex} #N{k === -1 ? "" : k + 1}
            </Label>
            <Label x={-70} y={8} size={9.5} upper={false} spacing="0" color={C.accent}>
              ✓
            </Label>
            <line x1={78} y1={0} x2={98} y2={0} stroke={C.ink} strokeWidth={1} />
          </g>
        ))}
        <Label x={430} y={930} anchor="middle">
          {L.history}
        </Label>
      </g>

      {/* round meter */}
      <g transform="translate(60,118)" opacity={clamp(v.proposals * 4) * (1 - ex) * (1 - v.chain * 0.6)}>
        <Label x={0} y={0} color={C.ink}>
          {L.agreement} {agree}% · {L.threshold} 80%
        </Label>
        <rect x={0} y={12} width={240} height={6} fill="none" stroke={C.ink} strokeWidth={0.8} />
        <rect x={0} y={12} width={(240 * agree) / 100} height={6} fill={agree >= 80 ? C.accent : C.ink} />
        <line x1={192} y1={7} x2={192} y2={24} stroke={C.warn} strokeWidth={1.4} />
        <Label x={192} y={40} anchor="middle" color={C.warn} size={9.5}>
          80%
        </Label>
      </g>
      <Label x={60} y={196} color={agree >= 80 ? C.accent : C.warn} opacity={clamp(v.proposals * 4) * (1 - ex) * (1 - v.chain)}>
        {conv > 0.85 ? L.supermajority : L.tentative}
      </Label>
      <Label x={940} y={118} anchor="end" opacity={smooth(v.expand) * (1 - ex)}>
        {L.noMining}
      </Label>
    </g>
  );
}
