"use client";
/**
 * Act 4 · Simulation 4 — a DeFi loan. Lock ETH, borrow dollars against it.
 * A health gauge and two bars (collateral vs debt) show how a price fall
 * pushes the loan toward the liquidation line, where code sells the ETH.
 */
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth, useStore } from "@/lib/store";
import { lendingStore } from "@/lib/simStores";
import { BONUS, debtUsd, health, liqPrice, LT, START_PRICE } from "@/lib/models";
import { C, EthGlyph, Label } from "../svg";

const IDX = chapterIndex("defi");
const GX = 500;
const GY = 380;
const GR = 210;
const HF_MIN = 0.6;
const HF_MAX = 2.6;
const angle = (hf: number) => Math.PI * (1 - clamp((hf - HF_MIN) / (HF_MAX - HF_MIN)));

function arc(a0: number, a1: number, r: number) {
  const p = (a: number) => `${GX + Math.cos(a) * r},${GY - Math.sin(a) * r}`;
  return `M${p(a0)} A${r},${r} 0 0 1 ${p(a1)}`;
}

export default function DefiScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.defi;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const eth = useStore(lendingStore, (s) => s.eth);
  const pct = useStore(lendingStore, (s) => s.borrowPct);
  const priceI = useStore(lendingStore, (s) => s.price);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, dep: 0, borrow: 0, drop: 0, inter: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { dep: 1, duration: 0.12 }, at(-0.04))
        .to(v, { borrow: 1, duration: 0.12 }, at(0.1))
        .to(v, { drop: 1, duration: 0.16, ease: "none" }, at(0.26))
        .to(v, { inter: 1, duration: 0.05 }, at(0.44))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const inter = v.inter > 0.5;
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

  // story: 5 ETH, borrow 60% of the max, then the price slides to 20% below the liquidation price and back
  const E = inter ? eth : 5;
  const debt = debtUsd(E, inter ? pct : 0.6) * smooth(v.borrow);
  const lp = liqPrice(E, debtUsd(E, inter ? pct : 0.6));
  const storyPrice = v.drop < 0.75 ? lerp(START_PRICE, lp * 0.97, smooth(v.drop / 0.75)) : lerp(lp * 0.97, lp * 0.97, 1);
  const price = inter ? priceI : storyPrice;
  const hf = health(E, price, debt);
  const liquidated = debt > 0 && hf < 1;
  const coll = E * price;
  // liquidation (simplified): half the debt repaid, collateral seized with a 5% bonus
  const repaid = debt * 0.5;
  const seizedEth = (repaid * (1 + BONUS)) / price;

  const a = angle(Number.isFinite(hf) ? hf : HF_MAX);
  const dep = smooth(v.dep);
  const hfTxt = !Number.isFinite(hf) || hf > 9.99 ? "∞" : nf(hf, 2);
  const tone = liquidated ? C.warn : hf < 1.2 ? C.peach : C.mint;

  // bars
  const BY = 920;
  const BH = 280;
  const maxV = Math.max(E * START_PRICE, E * price) * 1.05;
  const hOf = (x: number) => (x / maxV) * BH;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* gauge */}
      <g opacity={dep}>
        <path d={arc(Math.PI, angle(1), GR)} stroke={C.warn} strokeWidth={22} fill="none" opacity={0.6} />
        <path d={arc(angle(1), angle(1.2), GR)} stroke={C.peach} strokeWidth={22} fill="none" opacity={0.6} />
        <path d={arc(angle(1.2), 0, GR)} stroke={C.mint} strokeWidth={22} fill="none" opacity={0.5} />
        {[1, 1.5, 2].map((h) => (
          <text key={h} x={GX + Math.cos(angle(h)) * (GR + 30)} y={GY - Math.sin(angle(h)) * (GR + 30)} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: fs(9) }}>
            {h.toFixed(1)}
          </text>
        ))}
        <line x1={GX} y1={GY} x2={GX + Math.cos(a) * (GR - 30)} y2={GY - Math.sin(a) * (GR - 30)} stroke={tone} strokeWidth={5} strokeLinecap="round" />
        <circle cx={GX} cy={GY} r={12} fill={tone} />
        <text x={GX} y={GY + 62} textAnchor="middle" fill={tone} style={{ fontFamily: "var(--font-mono)", fontSize: fs(30), fontWeight: 600 }}>
          {debt > 0 ? hfTxt : "—"}
        </text>
        <Label x={GX} y={GY + 62 + fs(20)} anchor="middle" size={fs(9)}>
          {L.health}
        </Label>
        {liquidated && <circle cx={GX} cy={GY} r={GR + 40} fill="url(#glow-warn)" />}
      </g>

      {/* price ticker */}
      <g opacity={dep}>
        <EthGlyph x={120} y={110} s={0.8} />
        <text x={150} y={120} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(18), fontWeight: 600 }}>
          ${nf(price)}
        </text>
        <Label x={120} y={150 + fs(4)} size={fs(8.5)}>
          {L.price}
        </Label>
        {debt > 0 && (
          <Label x={880} y={120} anchor="end" color={C.warn} size={fs(9.5)}>
            {L.liqAt} ${nf(lp)}
          </Label>
        )}
      </g>

      {/* bars: collateral vs debt */}
      <g opacity={dep}>
        <rect x={300} y={BY - hOf(coll)} width={150} height={hOf(coll)} fill={C.lilac} opacity={liquidated ? 0.5 : 0.85} rx={4} />
        <line x1={290} x2={710} y1={BY - hOf(coll * LT)} y2={BY - hOf(coll * LT)} stroke={C.warn} strokeWidth={2} strokeDasharray="6 4" />
        <Label x={286} y={BY - hOf(coll * LT) + 4} anchor="end" color={C.warn} size={fs(8.5)}>
          {k < 1.5 ? L.line : "83%"}
        </Label>
        <Label x={375} y={BY + fs(20)} anchor="middle" color={C.ink} size={fs(9.5)}>
          {L.collateral}
        </Label>
        <Label x={375} y={BY - hOf(coll) - 10} anchor="middle" color={C.lilac} size={fs(9.5)}>
          ${nf(coll)}
        </Label>
        {v.borrow > 0.01 && (
          <>
            <rect x={550} y={BY - hOf(debt)} width={150} height={hOf(debt)} fill={liquidated ? C.warn : C.mint} opacity={0.85} rx={4} />
            <Label x={625} y={BY + fs(20)} anchor="middle" color={C.ink} size={fs(9.5)}>
              {L.debt}
            </Label>
            <Label x={625} y={BY - hOf(debt) - 10} anchor="middle" color={liquidated ? C.warn : C.mint} size={fs(9.5)}>
              ${nf(debt)}
            </Label>
          </>
        )}
        <line x1={260} x2={740} y1={BY} y2={BY} stroke={C.line} />
      </g>

      {liquidated && (
        <g>
          <rect x={160} y={505} width={680} height={64} rx={6} fill={C.paper} stroke={C.warn} strokeWidth={1.6} />
          <Label x={500} y={531} anchor="middle" color={C.warn} size={fs(11)}>
            {L.liquidated}
          </Label>
          <Label x={500} y={531 + fs(18)} anchor="middle" color={C.ink} size={fs(9)} upper={false} spacing="0.02em">
            {L.seized.replace("{repaid}", nf(repaid)).replace("{eth}", nf(seizedEth, 2))}
          </Label>
        </g>
      )}
    </g>
  );
}
