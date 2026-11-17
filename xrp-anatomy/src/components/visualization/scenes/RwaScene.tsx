"use client";
import { chapterIndex } from "@/data/coins/xrp/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useTween } from "@/hooks/useTween";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth, useStore } from "@/lib/store";
import { rwaStore } from "@/lib/simStores";
import { C, DrawPath, Label, mix } from "../svg";
import { SUPPLY } from "./DexScene";

const IDX = chapterIndex("rwa");
/** where the DEX pool lands as this scene begins */
export const RWA_VAULT = { x: 330, y: 485, w: 150, h: 250 };

const ROWS = [250, 410, 570, 730];
const ASSET_X = 125;
const TOKEN_X = 545;
const GATE_X = 690;
const WALLETS = [
  { x: 870, y: 260, ok: true },
  { x: 870, y: 430, ok: true },
  { x: 870, y: 600, ok: false },
];
const SWAP = { x: 760, y: 800 };
const TOKEN_LABEL = ["T-BILL", "DEED", "GOLD", "RLUSD"];

export default function RwaScene() {
  const { t } = useI18n();
  const L = t.scenes.rwa;
  const asset = useStore(rwaStore, (s) => s.asset);
  const focus = useTween(asset, 0.4);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, assets: 0, wrap: 0, mint: 0, gate: 0, settle: 0, income: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.06, ease: "none" }, at(-0.06))
        .to(v, { assets: 1, duration: 0.2 }, at(-0.04))
        .to(v, { wrap: 1, duration: 0.16 }, at(0.16))
        .to(v, { mint: 1, duration: 0.14 }, at(0.32))
        .to(v, { gate: 1, duration: 0.18 }, at(0.46))
        .to(v, { settle: 1, duration: 0.14 }, at(0.66))
        .to(v, { income: 1, duration: 0.1 }, at(0.8))
        .to(v, { exit: 1, duration: 0.22 }, at(0.96))
        .to(v, { vis: 0, duration: 0.05, ease: "none" }, at(1.16));
    },
  );
  if (v.vis <= 0.001) return null;

  const ex = smooth(v.exit);
  const o = 1 - ex;
  const wrap = smooth(v.wrap);
  const mint = smooth(v.mint);
  const gate = smooth(v.gate);
  const settle = smooth(v.settle);
  const names = [L.tbill, L.estate, L.gold, L.fund];
  /** 1 when this row is the selected asset (or nothing selected) */
  const lit = (i: number) => (asset < 0 ? 1 : asset === i ? 1 : lerp(1, 0.25, clamp(Math.abs(focus - i))));
  const ringPos = (i: number, n: number) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { x: SUPPLY.x + Math.cos(a) * 265, y: SUPPLY.y + Math.sin(a) * 265 };
  };

  return (
    <g opacity={v.vis}>
      {/* boundary between the real world and the ledger */}
      <g opacity={o}>
        <line x1={470} y1={150} x2={470} y2={880} stroke={C.ink} strokeDasharray="4 6" opacity={0.6} />
        <Label x={60} y={128} color={C.ink}>
          {L.realWorld}
        </Label>
        <Label x={490} y={128} color={C.accent}>
          {L.onLedger}
        </Label>
      </g>

      {/* vault: issuer + custodian */}
      <g transform={`translate(${RWA_VAULT.x},${RWA_VAULT.y})`} opacity={o * clamp(v.assets * 3)}>
        <rect x={-RWA_VAULT.w / 2} y={-RWA_VAULT.h / 2} width={RWA_VAULT.w} height={RWA_VAULT.h} fill={C.paper} stroke={C.ink} strokeWidth={1.4} />
        <rect x={-RWA_VAULT.w / 2 + 8} y={-RWA_VAULT.h / 2 + 8} width={RWA_VAULT.w - 16} height={RWA_VAULT.h - 16} fill="url(#hatch)" opacity={0.5 * wrap} />
        <circle cx={0} cy={0} r={26} fill={C.paper} stroke={C.ink} strokeWidth={1.2} />
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = (k / 6) * Math.PI * 2 + wrap * Math.PI;
          return <line key={k} x1={Math.cos(a) * 8} y1={Math.sin(a) * 8} x2={Math.cos(a) * 22} y2={Math.sin(a) * 22} stroke={C.ink} strokeWidth={1.2} />;
        })}
        <Label x={0} y={-RWA_VAULT.h / 2 - 22} anchor="middle" color={C.ink} size={10}>
          {L.issuer}
        </Label>
        <Label x={0} y={RWA_VAULT.h / 2 + 20} anchor="middle" size={9} upper={false} spacing="0">
          {L.legal}
        </Label>
      </g>

      {/* real-world assets → into the vault */}
      {ROWS.map((y, i) => {
        const start = { x: ASSET_X, y };
        const p = mix(start, { x: RWA_VAULT.x, y: RWA_VAULT.y }, wrap);
        const appear = clamp(v.assets * 4 - i * 0.6);
        const s = lerp(1, 0.35, wrap);
        return (
          <g key={`a${i}`} opacity={appear * o * (1 - clamp((wrap - 0.85) * 7)) * lit(i)}>
            <g transform={`translate(${p.x},${p.y}) scale(${s})`}>
              <AssetGlyph kind={i} />
            </g>
            <Label x={ASSET_X} y={y + 48} anchor="middle" color={C.ink} size={10} opacity={1 - wrap}>
              {names[i]}
            </Label>
          </g>
        );
      })}

      {/* the real asset stays behind: ghost outlines in the vault */}
      <g opacity={o * wrap * 0.8} transform={`translate(${RWA_VAULT.x},${RWA_VAULT.y})`}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${(i % 2 ? 1 : -1) * 40},${(i < 2 ? -1 : 1) * 70}) scale(0.42)`} opacity={lit(i)}>
            <AssetGlyph kind={i} />
          </g>
        ))}
      </g>

      {/* ID gate */}
      <g opacity={o * clamp(mint * 2)}>
        <rect x={GATE_X - 6} y={200} width={12} height={460} fill={C.paper} stroke={C.ink} strokeWidth={1.2} />
        <rect x={GATE_X - 6} y={200} width={12} height={460} fill="url(#hatch-accent)" />
        <g transform={`translate(${GATE_X},682)`}>
          <rect x={-22} y={-15} width={44} height={30} rx={3} fill={C.paper} stroke={C.accent} strokeWidth={1.4} />
          <circle cx={-9} cy={-2} r={5} fill="none" stroke={C.accent} />
          <path d="M-16,10 Q-9,2 -2,10" fill="none" stroke={C.accent} />
          <line x1={2} y1={-5} x2={15} y2={-5} stroke={C.accent} />
          <line x1={2} y1={2} x2={12} y2={2} stroke={C.accent} />
        </g>
        <Label x={GATE_X} y={716} anchor="middle" color={C.accent} size={10}>
          {L.gate}
        </Label>
      </g>

      {/* wallets */}
      {WALLETS.map((w, k) => (
        <g key={`w${k}`} transform={`translate(${w.x},${w.y})`} opacity={o * clamp(gate * 3 - k * 0.3)}>
          <rect x={-46} y={-30} width={92} height={60} rx={5} fill={C.paper} stroke={w.ok ? C.ink : C.warn} strokeWidth={1.3} strokeDasharray={w.ok ? undefined : "4 3"} />
          <rect x={-46} y={-30} width={92} height={14} rx={5} fill={w.ok ? C.ink : C.warn} />
          <Label x={0} y={-19} anchor="middle" color={C.paper} size={8}>
            {L.wallet}
          </Label>
          <Label x={0} y={46} anchor="middle" color={w.ok ? C.accent : C.warn} size={9.5}>
            {w.ok ? `✓ ${L.verified}` : `✕ ${L.blocked}`}
          </Label>
        </g>
      ))}

      {/* tokens: minted on the ledger, through the gate, to wallets */}
      {ROWS.map((y, i) => {
        if (mint <= 0.01) return null;
        const born = { x: TOKEN_X, y };
        const atGate = { x: GATE_X - 30, y: lerp(y, i < 3 ? WALLETS[i].y : SWAP.y - 70, 0.5) };
        let p = mix(mix(RWA_VAULT, born, clamp(mint * 1.3 - i * 0.1)), atGate, clamp(gate * 2));
        if (i < 2) p = mix(p, { x: WALLETS[i].x - 10, y: WALLETS[i].y + 4 }, clamp(gate * 2 - 1));
        if (i === 2) {
          // refused: bounces at the gate
          const bounce = clamp(gate * 2 - 1);
          p = { x: p.x - Math.sin(bounce * Math.PI) * 26, y: p.y };
        }
        if (i === 3) p = mix(p, SWAP, clamp(gate * 2 - 1));
        // settlement: the investor's token and the RLUSD swap places in one step
        const W0 = { x: WALLETS[0].x - 10, y: WALLETS[0].y + 4 };
        if (i === 0 && settle > 0) p = quad(W0, { x: 1000, y: 560 }, SWAP, settle);
        if (i === 3 && settle > 0) p = quad(SWAP, { x: 640, y: 470 }, W0, settle);
        // exit: fly into the supply ring
        p = mix(p, ringPos(i * 3, 12), ex);
        const refused = i === 2 && gate > 0.5;
        return (
          <g key={`t${i}`} transform={`translate(${p.x},${p.y}) scale(${lerp(1, 0.6, ex)})`} opacity={lit(i) * (1 - clamp((ex - 0.8) * 5))}>
            <Hex fill={i === 3 ? C.accent : C.paper} stroke={refused ? C.warn : C.ink} />
            <text y={3.5} textAnchor="middle" fill={i === 3 ? C.paper : C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, fontWeight: 600 }}>
              {TOKEN_LABEL[i]}
            </text>
          </g>
        );
      })}

      {/* settlement */}
      <g opacity={o * clamp(settle * 3)}>
        <circle cx={SWAP.x} cy={SWAP.y} r={36} fill="none" stroke={C.accent} strokeDasharray="3 4" />
        <path d={`M${WALLETS[0].x - 10},${WALLETS[0].y + 34} Q 1000,560 ${SWAP.x + 30},${SWAP.y - 20}`} fill="none" stroke={C.ink} strokeDasharray="2 5" opacity={0.5} />
        <path d={`M${SWAP.x - 30},${SWAP.y - 20} Q 640,470 ${WALLETS[0].x - 50},${WALLETS[0].y + 10}`} fill="none" stroke={C.accent} strokeDasharray="2 5" opacity={0.7} />
        <Label x={SWAP.x} y={SWAP.y + 58} anchor="middle" color={C.ink} size={10}>
          {L.swap}
        </Label>
        <Label x={SWAP.x} y={SWAP.y + 74} anchor="middle" size={9} upper={false} spacing="0">
          {L.atomic}
        </Label>
      </g>

      {/* income flows back from the real asset (an off-ledger promise) */}
      <g opacity={o}>
        <DrawPath d={`M${RWA_VAULT.x},${RWA_VAULT.y - RWA_VAULT.h / 2} Q ${600},${90} ${WALLETS[0].x},${WALLETS[0].y - 32}`} p={v.income} width={1.2} color={C.warn} dash={v.income > 0 ? "5 5" : undefined} />
        <Label x={600} y={172} anchor="middle" color={C.warn} size={9.5} opacity={v.income}>
          {L.income}
        </Label>
      </g>

      {/* dated stat */}
      <g transform="translate(60,880)" opacity={o * clamp(v.assets * 2 - 0.5)}>
        <Label x={0} y={0} color={C.ink} size={10}>
          {L.stat} {L.statValue}
        </Label>
        <Label x={0} y={16} size={9} upper={false} spacing="0">
          {L.statDate}
        </Label>
      </g>
    </g>
  );
}

function quad(a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

function Hex({ fill, stroke }: { fill: string; stroke: string }) {
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = (k / 6) * Math.PI * 2;
    return `${(Math.cos(a) * 26).toFixed(1)},${(Math.sin(a) * 22).toFixed(1)}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={1.4} />;
}

/** Hand-drawn glyphs for the four real-world assets. */
function AssetGlyph({ kind }: { kind: number }) {
  if (kind === 0)
    return (
      <g>
        <rect x={-30} y={-22} width={60} height={44} fill={C.paper} stroke={C.ink} strokeWidth={1.3} />
        <rect x={-26} y={-18} width={52} height={36} fill="none" stroke={C.ink} strokeWidth={0.6} strokeDasharray="2 2" />
        {[-8, 0, 8].map((y) => (
          <line key={y} x1={-18} y1={y} x2={8} y2={y} stroke={C.ink} strokeWidth={0.8} />
        ))}
        <circle cx={16} cy={9} r={6} fill={C.accent} />
      </g>
    );
  if (kind === 1)
    return (
      <g>
        <path d="M-26,24 V-8 L0,-28 L26,-8 V24 Z" fill={C.paper} stroke={C.ink} strokeWidth={1.3} />
        {[-14, 0, 14].map((x) => [-4, 8].map((y) => <rect key={`${x}${y}`} x={x - 4} y={y} width={8} height={8} fill="none" stroke={C.ink} strokeWidth={0.8} />))}
        <rect x={-5} y={14} width={10} height={10} fill={C.ink} />
      </g>
    );
  if (kind === 2)
    return (
      <g>
        <path d="M-30,16 L-20,-6 H20 L30,16 Z" fill="#e6d39a" stroke={C.ink} strokeWidth={1.3} />
        <path d="M-20,-6 L-12,-18 H12 L20,-6" fill="#efe2b8" stroke={C.ink} strokeWidth={1.1} />
        <line x1={-14} y1={4} x2={14} y2={4} stroke={C.ink} strokeWidth={0.6} />
      </g>
    );
  return (
    <g>
      {[0, 1, 2].map((k) => (
        <rect key={k} x={-28 + k * 3} y={-14 - k * 5} width={52} height={28} rx={2} fill={C.paper} stroke={C.ink} strokeWidth={1.1} />
      ))}
      <circle cx={0} cy={-10} r={9} fill="none" stroke={C.ink} strokeWidth={1} />
      <text x={0} y={-6} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: 13 }}>
        $
      </text>
    </g>
  );
}
