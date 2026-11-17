"use client";
/**
 * Act 1 · Origin. Calculator vs computer; a vending machine as the mental
 * model for smart contracts; the 2014 crowdsale and the July 2015 launch;
 * ETH as fuel (the 3D diamond floats above while this chapter closes).
 */
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, EthGlyph, Label } from "../svg";

const IDX = chapterIndex("origin");

function Calculator({ x, y, o, label, sub, k }: { x: number; y: number; o: number; label: string; sub: string; k: number }) {
  if (o <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y})`} opacity={o}>
      <rect x={-70} y={-110} width={140} height={210} rx={14} fill={C.paper} stroke={C.mute} strokeWidth={1.6} />
      <rect x={-54} y={-94} width={108} height={44} rx={4} fill={C.accentSoft} />
      <text x={46} y={-63} textAnchor="end" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: 18 }}>
        −0.5 ₿
      </text>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={-54 + (i % 3) * 38} y={-36 + Math.floor(i / 3) * 32} width={30} height={24} rx={4} fill={C.line} />
      ))}
      <Label x={0} y={130 + 6 * k} anchor="middle" color={C.ink} size={11 * k}>
        {label}
      </Label>
      <Label x={0} y={130 + 22 * k} anchor="middle" size={9.5 * k} upper={false} spacing="0.02em">
        {sub}
      </Label>
    </g>
  );
}

function Computer({ x, y, o, label, sub, k, lines }: { x: number; y: number; o: number; label: string; sub: string; k: number; lines: number }) {
  if (o <= 0.01) return null;
  const code = ["if paid:", "  send(lan, 500)", "else:", "  refund(anna)"];
  return (
    <g transform={`translate(${x},${y})`} opacity={o}>
      <rect x={-130} y={-110} width={260} height={170} rx={10} fill={C.paper} stroke={C.accent} strokeWidth={2} />
      <rect x={-116} y={-96} width={232} height={142} rx={4} fill={C.accentSoft} />
      {code.map((c, i) => (
        <text key={i} x={-100} y={-66 + i * 28} fill={i % 2 ? C.mint : C.lilac} opacity={clamp(lines * 4 - i)} style={{ fontFamily: "var(--font-mono)", fontSize: 16 }}>
          {c}
        </text>
      ))}
      <path d="M-40,60 L-56,96 H56 L40,60" fill={C.line} />
      <Label x={0} y={130 + 6 * k} anchor="middle" color={C.accent} size={11 * k}>
        {label}
      </Label>
      <Label x={0} y={130 + 22 * k} anchor="middle" size={9.5 * k} upper={false} spacing="0.02em">
        {sub}
      </Label>
    </g>
  );
}

function Vending({ x, y, coin, drop, rule, k, L }: { x: number; y: number; coin: number; drop: number; rule: number; k: number; L: { ifCoin: string; then: string; ifApprove: string; thenPay: string; noShop: string } }) {
  const coinY = lerp(-230, -40, smooth(coin));
  const snackY = lerp(30, 120, smooth(drop));
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-120} y={-170} width={240} height={330} rx={12} fill={C.paper} stroke={C.ink} strokeWidth={1.6} />
      <rect x={-100} y={-150} width={140} height={200} rx={4} fill={C.accentSoft} />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={-90 + (i % 3) * 44} y={-140 + Math.floor(i / 3) * 62} width={34} height={44} rx={4} fill={[C.lilac, C.mint, C.peach][i % 3]} opacity={i === 7 ? 1 - smooth(drop) * 0.8 : 0.75} />
      ))}
      <rect x={56} y={-150} width={50} height={110} rx={4} fill={C.line} />
      <rect x={70} y={-120} width={22} height={6} rx={3} fill={C.ink} />
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={68 + (i % 2) * 26} cy={-90 + Math.floor(i / 2) * 16} r={5} fill={i === 3 && rule > 0 ? C.accent : C.mute} />
      ))}
      <rect x={-100} y={70} width={200} height={70} rx={4} fill={C.line} opacity={0.6} />
      <rect x={-46 + 44 - 17} y={snackY} width={34} height={44} rx={4} fill={C.mint} opacity={smooth(drop)} />
      {coin > 0 && coin < 1 && <circle cx={81} cy={coinY} r={11} fill="#ffd27a" stroke={C.paper} strokeWidth={2} />}
      {/* the rule, then the same rule for Lan and Anna */}
      <g transform="translate(0,220)">
        <rect x={-210} y={-26} width={420} height={70} rx={6} fill={C.paper} stroke={C.accent} strokeWidth={1.2} opacity={clamp(rule * 3)} />
        <text x={0} y={-2} textAnchor="middle" fill={C.lilac} opacity={clamp(rule * 3) * (1 - smooth(clamp((rule - 0.5) * 3)))} style={{ fontFamily: "var(--font-mono)", fontSize: 14 * Math.min(k, 1.6) }}>
          {L.ifCoin}
        </text>
        <text x={0} y={22} textAnchor="middle" fill={C.mint} opacity={clamp(rule * 3) * (1 - smooth(clamp((rule - 0.5) * 3)))} style={{ fontFamily: "var(--font-mono)", fontSize: 14 * Math.min(k, 1.6) }}>
          {L.then}
        </text>
        <text x={0} y={-2} textAnchor="middle" fill={C.lilac} opacity={smooth(clamp((rule - 0.55) * 3))} style={{ fontFamily: "var(--font-mono)", fontSize: 14 * Math.min(k, 1.6) }}>
          {L.ifApprove}
        </text>
        <text x={0} y={22} textAnchor="middle" fill={C.mint} opacity={smooth(clamp((rule - 0.55) * 3))} style={{ fontFamily: "var(--font-mono)", fontSize: 14 * Math.min(k, 1.6) }}>
          {L.thenPay}
        </text>
      </g>
      <Label x={0} y={-196} anchor="middle" color={C.ink} size={11 * k}>
        {L.noShop}
      </Label>
    </g>
  );
}

export default function OriginScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.origin;
  const k = useFontK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, calc: 0, comp: 0, lines: 0, vend: 0, coin: 0, drop: 0, rule: 0, sale: 0, launch: 0, fuel: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { calc: 1, duration: 0.1 }, at(-0.1))
        .to(v, { comp: 1, duration: 0.12 }, at(0.06))
        .to(v, { lines: 1, duration: 0.12, ease: "none" }, at(0.1))
        .to(v, { calc: 0, comp: 0, duration: 0.06 }, at(0.24))
        .to(v, { vend: 1, duration: 0.06 }, at(0.26))
        .to(v, { coin: 1, duration: 0.08, ease: "none" }, at(0.3))
        .to(v, { drop: 1, duration: 0.06 }, at(0.36))
        .to(v, { rule: 1, duration: 0.12, ease: "none" }, at(0.36))
        .to(v, { vend: 0, duration: 0.05 }, at(0.48))
        .to(v, { sale: 1, duration: 0.14, ease: "none" }, at(0.5))
        .to(v, { launch: 1, duration: 0.08 }, at(0.64))
        .to(v, { sale: 0, launch: 0, duration: 0.05 }, at(0.72))
        .to(v, { fuel: 1, duration: 0.1 }, at(0.74))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const fs = (s: number) => s * k;
  const sale = smooth(v.sale);
  const btc = Math.round(31000 * clamp(v.sale * 1.3));
  const eth = 60 * clamp(v.sale * 1.3);
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* year stamp */}
      <text x={500} y={170} textAnchor="middle" fill={C.ink} opacity={0.06 * (1 - smooth(v.fuel))} style={{ fontFamily: "var(--font-serif)", fontSize: 200, fontWeight: 600 }}>
        {v.launch > 0.5 || v.fuel > 0 ? "2015" : v.sale > 0.02 ? "2014" : "2013"}
      </text>

      {/* calculator vs computer */}
      <Calculator x={k > 1.5 ? 230 : 250} y={470} o={smooth(v.calc)} label={L.calc} sub={L.calcSub} k={k} />
      <Computer x={k > 1.5 ? 640 : 650} y={470} o={smooth(v.comp)} label={L.comp} sub={L.compSub} k={k} lines={v.lines} />
      {v.comp > 0.3 && v.calc > 0.3 && (
        <Label x={500} y={250} anchor="middle" color={C.mute} size={fs(10)} opacity={Math.min(v.comp, v.calc)}>
          {L.vitalik}
        </Label>
      )}

      {/* vending machine */}
      {v.vend > 0.01 && (
        <g opacity={smooth(v.vend)}>
          <Vending x={500} y={420} coin={v.coin} drop={v.drop} rule={v.rule} k={k} L={L} />
        </g>
      )}

      {/* crowdsale → launch */}
      {sale > 0.01 && (
        <g opacity={sale}>
          {Array.from({ length: 18 }, (_, i) => {
            const q = clamp(v.sale * 1.6 - i / 26);
            const x = lerp(140 + (i % 6) * 22, 470, smooth(q));
            const y = lerp(330 + Math.floor(i / 6) * 40, 470, smooth(q));
            return <circle key={i} cx={x} cy={y} r={11} fill="#f7931a" opacity={q < 1 ? 0.9 : 0} />;
          })}
          <Label x={200} y={290} anchor="middle" color="#f7931a" size={fs(12)}>
            {nf(btc)} BTC
          </Label>
          <rect x={430} y={410} width={140} height={120} rx={8} fill={C.accentSoft} stroke={C.accent} strokeWidth={1.4} />
          <EthGlyph x={500} y={470} s={1.3} />
          {Array.from({ length: 12 }, (_, i) => {
            const q = clamp(v.sale * 1.6 - 0.35 - i / 20);
            return <EthGlyph key={i} x={lerp(580, 760 + (i % 4) * 40, smooth(q))} y={lerp(470, 330 + Math.floor(i / 4) * 70, smooth(q))} s={0.6} opacity={q > 0 ? 1 : 0} />;
          })}
          <Label x={810} y={290} anchor="middle" color={C.lilac} size={fs(12)}>
            {nf(eth, 0)}M ETH
          </Label>
          <Label x={500} y={600} anchor="middle" size={fs(10)}>
            {L.sale}
          </Label>
          <g opacity={smooth(v.launch)}>
            <rect x={300} y={680} width={400} height={86} rx={6} fill={C.paper} stroke={C.mint} strokeWidth={1.6} />
            <text x={500} y={722} textAnchor="middle" fill={C.mint} style={{ fontFamily: "var(--font-serif)", fontSize: 30 * Math.min(k, 1.5) }}>
              {L.launch}
            </text>
            <Label x={500} y={750} anchor="middle" size={fs(9.5)}>
              {L.launchSub}
            </Label>
          </g>
        </g>
      )}

      {/* ETH is fuel — the 3D diamond floats above (DiamondCanvas) */}
      {v.fuel > 0.01 && (
        <g opacity={smooth(v.fuel)}>
          <Label x={500} y={600} anchor="middle" color={C.lilac} size={fs(12)}>
            {L.fuel}
          </Label>
          {L.actions.map((a, i) => {
            const n = L.actions.length;
            const x = lerp(170, 830, i / (n - 1));
            const q = clamp(v.fuel * 3 - i * 0.25);
            return (
              <g key={a} opacity={q}>
                <line x1={500} y1={620} x2={x} y2={720} stroke={C.line} strokeWidth={1.2} strokeDasharray="3 5" />
                <circle cx={x} cy={740} r={30} fill={C.accentSoft} stroke={C.accent} strokeWidth={1.4} />
                <EthGlyph x={x} y={740} s={0.55} />
                <Label x={x} y={798 + fs(4)} anchor="middle" color={C.ink} size={fs(9.5)} upper={false} spacing="0.02em">
                  {a}
                </Label>
              </g>
            );
          })}
          <Label x={500} y={880} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em">
            {L.fuelSub}
          </Label>
        </g>
      )}
    </g>
  );
}
