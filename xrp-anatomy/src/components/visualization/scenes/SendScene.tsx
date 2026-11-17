"use client";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useI18n } from "@/lib/i18n";
import { clamp, fmt, lerp, mulberry32, range, smooth, useStore } from "@/lib/store";
import { sendStore } from "@/lib/simStores";
import { toXrp } from "@/simulations/transactionSimulator";
import { MAP, VALIDATOR_COUNT, validatorPos } from "@/data/coins/xrp/layouts";
import { C, Label, TxCard, mix } from "../svg";

const IDX = 3;
const A = { x: 190, y: 500 };
const B = { x: 810, y: 500 };
const RING = { x: 500, y: 520, r: 74 };
const BURN = { x: 500, y: 760 };
const rnd = mulberry32(3);
const embers = Array.from({ length: 36 }, () => ({ a: rnd() * Math.PI * 2, d: 10 + rnd() * 50, s: 1 + rnd() * 2 }));

export default function SendScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.send;
  const sim = useStore(sendStore, (s) => s);
  const v = useSceneTimeline(IDX, { vis: 0, enter: 0, exit: 0 }, (tl, v, at) => {
    tl.to(v, { vis: 1, duration: 0.08, ease: "none" }, at(-0.06))
      .to(v, { enter: 1, duration: 0.22 }, at(-0.04))
      .to(v, { exit: 1, duration: 0.24 }, at(0.94))
      .to(v, { vis: 0, duration: 0.05, ease: "none" }, at(1.17));
  });
  if (v.vis <= 0.001) return null;

  const en = smooth(v.enter);
  const ex = smooth(v.exit);
  const st = sim.t;
  const sSign = range(st, 0, 1), sSubmit = range(st, 1, 2), sCons = range(st, 2, 3), sVal = range(st, 3, 4), sBal = range(st, 4, 5), sBurn = range(st, 5, 6);

  // wallets glide in, then on exit move to the map's sender / recipient
  const aPos = mix(mix({ x: -80, y: A.y }, A, en), MAP.sender, ex);
  const bPos = mix(mix({ x: 1080, y: B.y }, B, en), MAP.recipient, ex);
  const ringPos = mix(RING, MAP.xrpl, ex);
  const wScale = lerp(1, 0.18, ex);

  const balA = sim.failed ? sim.before.a : lerp(sim.before.a, sim.after.a, smooth(sBal));
  const balB = sim.failed ? sim.before.b : lerp(sim.before.b, sim.after.b, smooth(sBal));

  // packet path: A → ring (submit), orbit (consensus), ring → B (balances)
  let packet: { x: number; y: number } | null = null;
  if (!sim.failed && st > 1 && st < 5) {
    if (st <= 2) packet = mix({ x: A.x + 90, y: A.y }, { x: RING.x - RING.r, y: RING.y }, smooth(sSubmit));
    else if (st <= 4) {
      const ang = Math.PI + sCons * Math.PI * 2;
      packet = { x: RING.x + Math.cos(ang) * RING.r * (1 - sVal), y: RING.y + Math.sin(ang) * RING.r * (1 - sVal) };
    } else packet = mix(RING, { x: B.x - 90, y: B.y }, smooth(sBal));
  }

  const steps = L.steps;
  const curStep = Math.min(5, Math.floor(st));

  return (
    <g opacity={v.vis}>
      {/* validated ledger strip at the top */}
      <g opacity={en * (1 - ex)}>
        {[0, 1, 2, 3].map((k) => {
          const isNew = k === 3;
          const show = isNew ? smooth(sVal) * (sim.failed ? 0 : 1) : 1;
          return (
            <g key={k} transform={`translate(${260 + k * 160},110)`} opacity={show}>
              <rect x={-66} y={-22} width={132} height={44} fill={C.paper} stroke={isNew ? C.accent : C.ink} strokeWidth={isNew ? 1.6 : 0.9} />
              <Label x={-58} y={-4} size={9} color={isNew ? C.accent : C.mute}>
                {isNew ? t.scenes.consensus.validated : t.scenes.consensus.ledgerIndex}
              </Label>
              <Label x={-58} y={12} size={9.5} upper={false} spacing="0" color={C.ink}>
                {isNew && sim.hash ? `tx ${sim.hash.slice(0, 10)}…` : `#N${k === 2 ? "" : k - 2}`}
              </Label>
              {k < 3 && <line x1={66} y1={0} x2={94} y2={0} stroke={C.ink} />}
            </g>
          );
        })}
      </g>

      {/* validator mini-ring */}
      <g transform={`translate(${ringPos.x},${ringPos.y}) scale(${lerp(1, 0.5, ex)})`}>
        <circle r={RING.r} fill="none" stroke={C.line} strokeDasharray="2 5" />
        {Array.from({ length: VALIDATOR_COUNT }, (_, i) => {
          const p = validatorPos(i, RING.r, 0, 0);
          const lit = sCons > 0 && (sCons * VALIDATOR_COUNT > i || sVal > 0);
          return <circle key={i} cx={p.x} cy={p.y} r={7.5} fill={lit ? C.accent : C.paper} stroke={C.ink} strokeWidth={1} />;
        })}
        {sVal > 0 && sVal < 1 && <circle r={RING.r + sVal * 40} fill="none" stroke={C.accent} opacity={1 - sVal} />}
        <Label x={0} y={RING.r + 30} anchor="middle" opacity={en * (1 - ex)}>
          {L.network}
        </Label>
      </g>

      {/* wallets */}
      <Wallet pos={aPos} scale={wScale} name={L.walletA} bal={balA} reserveLabel={L.reserve} locale={locale} sign={sSign} active={st > 0 && st < 2} fade={en} />
      <Wallet pos={bPos} scale={wScale} name={L.walletB} bal={balB} reserveLabel={L.reserve} locale={locale} sign={0} active={sBal > 0 && sBal < 1} fade={en} />

      {/* tx card being signed on wallet A */}
      <TxCard x={A.x} y={A.y - 118} signed={sSign} label="PAYMENT" opacity={en * (1 - ex) * clamp(st * 4) * (1 - sSubmit)} />

      {packet && (
        <g transform={`translate(${packet.x},${packet.y})`}>
          <circle r={18} fill="url(#glow)" />
          <rect x={-7} y={-5} width={14} height={10} rx={1.5} fill={C.accent} stroke={C.ink} strokeWidth={0.8} />
        </g>
      )}

      {/* fee burn */}
      <g transform={`translate(${BURN.x},${BURN.y})`} opacity={en * (1 - ex)}>
        <circle r={58} fill="none" stroke={C.warn} strokeDasharray="1 4" />
        {sBurn > 0 &&
          embers.map((e, i) => {
            const q = smooth(clamp(sBurn * 1.4 - (i % 6) * 0.06));
            const d = e.d * q;
            return <rect key={i} x={Math.cos(e.a) * d} y={Math.sin(e.a) * d - 60 * (1 - q)} width={e.s * 2} height={e.s * 2} fill={C.warn} opacity={(1 - q) * 0.9} />;
          })}
        {sBurn > 0 && sBurn < 0.5 && <rect x={-9} y={-9 - 120 * (1 - sBurn * 2)} width={18} height={18} fill={C.warn} />}
        <Label x={0} y={-70} anchor="middle" color={C.warn}>
          {L.fee} · {sim.fee.drops} drops
        </Label>
        <Label x={0} y={4} anchor="middle" color={C.ink} opacity={smooth(sBurn)}>
          {L.destroyed}
        </Label>
        <Label x={0} y={80} anchor="middle" size={9.5}>
          {L.magnified}
        </Label>
      </g>

      {/* step track */}
      <g transform="translate(95,900)" opacity={en * (1 - ex)}>
        {steps.map((s, i) => {
          const done = st >= i + 1;
          const cur = curStep === i && st > 0 && st < 6;
          return (
            <g key={s} transform={`translate(${i * 148},0)`}>
              <line x1={0} y1={0} x2={142} y2={0} stroke={C.line} />
              <line x1={0} y1={0} x2={142 * range(st, i, i + 1)} y2={0} stroke={sim.failed && i >= 1 ? C.warn : C.accent} strokeWidth={2} />
              <circle cx={0} cy={0} r={5} fill={done || cur ? C.accent : C.paper} stroke={C.ink} />
              <Label x={0} y={24} color={cur ? C.ink : C.mute} size={10}>
                {String(i + 1).padStart(2, "0")} {s}
              </Label>
            </g>
          );
        })}
      </g>
      {sim.failed && (
        <Label x={500} y={420} anchor="middle" color={C.warn} opacity={en}>
          tecUNFUNDED_PAYMENT · {t.ui.simulated}
        </Label>
      )}
    </g>
  );
}

function Wallet({ pos, scale, name, bal, reserveLabel, locale, sign, active, fade }: {
  pos: { x: number; y: number }; scale: number; name: string; bal: number; reserveLabel: string; locale: string; sign: number; active: boolean; fade: number;
}) {
  return (
    <g transform={`translate(${pos.x},${pos.y}) scale(${scale})`} opacity={fade}>
      {/* back panel for depth */}
      <rect x={-104} y={-64} width={208} height={136} rx={6} fill={C.line} opacity={0.6} transform="translate(8,8)" />
      <rect x={-104} y={-64} width={208} height={136} rx={6} fill={C.paper} stroke={active ? C.accent : C.ink} strokeWidth={active ? 2 : 1.3} />
      <rect x={-104} y={-64} width={208} height={30} rx={6} fill={C.ink} />
      <rect x={-104} y={-44} width={208} height={10} fill={C.ink} />
      <text x={-92} y={-44} fill={C.paper} style={{ fontFamily: "var(--font-serif)", fontSize: 17 }}>
        {name}
      </text>
      <text x={92} y={-45} textAnchor="end" fill={C.paper} style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em" }}>
        SIM
      </text>
      <text x={-92} y={8} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: 21, fontWeight: 500 }}>
        {fmt(toXrp(bal), 6, locale)}
      </text>
      <text x={-92} y={28} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em" }}>
        XRP
      </text>
      <rect x={-92} y={40} width={16} height={16} fill="url(#hatch)" stroke={C.ink} strokeWidth={0.6} />
      <text x={-70} y={52} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {reserveLabel} 1 XRP
      </text>
      {sign > 0 && (
        <g transform="translate(70,40)" opacity={clamp(sign * 2)}>
          <circle r={14} fill="none" stroke={C.accent} strokeWidth={1.4} />
          <path d="M-6,0 L-1,5 L7,-5" fill="none" stroke={C.accent} strokeWidth={1.8} pathLength={1} strokeDasharray={`${sign} 1`} />
        </g>
      )}
    </g>
  );
}
