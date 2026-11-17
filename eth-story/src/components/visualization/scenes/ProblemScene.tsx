"use client";
/**
 * Act 0 · The Problem. Lan (Da Nang) and Anna (Berlin) want to trade a $500
 * logo but neither wants to go first. A platform solves it for a fee; the
 * panel lets readers compare four ways, including a smart contract.
 */
import { chapterIndex } from "@/data/coins/eth/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useTween } from "@/hooks/useTween";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth, useStore } from "@/lib/store";
import { problemStore } from "@/lib/simStores";
import { C, Chip, Label, Person } from "../svg";

const IDX = chapterIndex("problem");
export const AMOUNT = 500;
/** Fiverr keeps 20% of each order; Upwork 0–15% per contract (help centres, Oct 2026) */
export const PLATFORM_FEE_DEFAULT = 20;

const LAN = { x: 200, y: 560 };
const ANNA = { x: 800, y: 560 };
const MID = { x: 500, y: 540 };

function LogoCard({ x, y, s = 1, opacity = 1 }: { x: number; y: number; s?: number; opacity?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <rect x={-34} y={-40} width={68} height={80} rx={6} fill={C.paper} stroke={C.peach} strokeWidth={2} />
      <circle cx={0} cy={-8} r={16} fill="none" stroke={C.peach} strokeWidth={3} />
      <path d="M-9,-8 Q0,-22 9,-8 Q0,6 -9,-8" fill={C.peach} />
      <line x1={-20} x2={20} y1={22} y2={22} stroke={C.mute} strokeWidth={2} />
    </g>
  );
}

function Platform({ x, y, opacity, label, k }: { x: number; y: number; opacity: number; label: string; k: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      <rect x={-78} y={-64} width={156} height={118} rx={6} fill={C.accentSoft} stroke={C.accent} strokeWidth={1.6} />
      <path d="M-78,-64 L0,-104 L78,-64 Z" fill={C.accent} opacity={0.9} />
      {[-46, -16, 14, 44].map((cx) => (
        <rect key={cx} x={cx - 8} y={-40} width={16} height={60} fill={C.accent} opacity={0.35} />
      ))}
      <text x={0} y={44} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: 11 * k, letterSpacing: "0.12em" }}>
        {label}
      </text>
    </g>
  );
}

function ContractBox({ x, y, opacity, label, sub, k }: { x: number; y: number; opacity: number; label: string; sub: string; k: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      <circle r={120} fill="url(#glow)" opacity={0.8} />
      <path d="M0,-92 L74,0 L0,92 L-74,0 Z" fill={C.paper} stroke={C.lilac} strokeWidth={2.4} />
      <path d="M0,-92 L0,92 M-74,0 L74,0" stroke={C.lilac} strokeWidth={0.8} opacity={0.5} />
      <text x={0} y={-6} textAnchor="middle" fill={C.mint} style={{ fontFamily: "var(--font-mono)", fontSize: 12 * k }}>
        {"if (…)"}
      </text>
      <text x={0} y={14 * k} textAnchor="middle" fill={C.mint} style={{ fontFamily: "var(--font-mono)", fontSize: 12 * k }}>
        {"pay()"}
      </text>
      <Label x={0} y={118 + 6 * k} anchor="middle" color={C.lilac} size={11 * k}>
        {label}
      </Label>
      <Label x={0} y={118 + 22 * k} anchor="middle" color={C.mute} size={9.5 * k} upper={false} spacing="0.02em">
        {sub}
      </Label>
    </g>
  );
}

export default function ProblemScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.problem;
  const k = useFontK();
  const mobile = k >= 1.5;
  const option = useStore(problemStore, (s) => s.option);
  const fee = useStore(problemStore, (s) => s.fee);
  const o = [useTween(option === 0 ? 1 : 0, 0.45), useTween(option === 1 ? 1 : 0, 0.45), useTween(option === 2 ? 1 : 0, 0.45), useTween(option === 3 ? 1 : 0, 0.45)];
  const feeT = useTween(fee, 0.35);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, people: 0, who: 0, plat: 0, flow: 0, inter: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(0.04))
        .to(v, { people: 1, duration: 0.12 }, at(0.06))
        .to(v, { who: 1, duration: 0.12 }, at(0.2))
        .to(v, { plat: 1, duration: 0.1 }, at(0.4))
        .to(v, { flow: 1, duration: 0.14, ease: "none" }, at(0.44))
        .to(v, { inter: 1, duration: 0.08 }, at(0.58))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const people = smooth(v.people);
  const who = smooth(v.who) * (1 - smooth(v.plat));
  const inter = smooth(v.inter);
  const story = 1 - inter;
  const plat = smooth(v.plat);
  const fs = (s: number) => s * k;

  // during the scroll story, the platform takes Fiverr's 20%
  const storyFee = PLATFORM_FEE_DEFAULT;
  const f = clamp(v.flow);
  const flowX = f < 0.5 ? lerp(ANNA.x - 60, MID.x, f / 0.5) : lerp(MID.x, LAN.x + 60, (f - 0.5) / 0.5);
  const after = f > 0.5;
  const amtStory = after ? AMOUNT * (1 - storyFee / 100) : AMOUNT;

  // interactive blends
  const platShown = Math.max(plat * story, o[2] * inter);
  const contractShown = o[3] * inter;
  const feeNow = feeT;
  const lanGets = inter ? lerp(AMOUNT, AMOUNT * (1 - feeNow / 100), o[2]) - 0.01 * o[3] : amtStory;
  const usd = (n: number) => "$" + new Intl.NumberFormat(locale, { maximumFractionDigits: n % 1 ? 2 : 0, minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);

  const riskAnna = o[0] * inter;
  const riskLan = o[1] * inter;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* the distance between them */}
      <path d={`M${LAN.x},${LAN.y - 90} Q500,${170} ${ANNA.x},${ANNA.y - 90}`} fill="none" stroke={C.line} strokeWidth={1.5} strokeDasharray="3 8" opacity={people} />
      <Label x={500} y={232} anchor="middle" size={fs(9.5)} opacity={people * (1 - plat)}>
        {L.distance}
      </Label>

      {/* the job */}
      <g opacity={people * (1 - who) * (1 - plat)}>
        <LogoCard x={500} y={330} />
        <Label x={500} y={400} anchor="middle" color={C.peach} size={fs(11)}>
          {L.job}
        </Label>
      </g>

      {/* people */}
      <Person x={LAN.x} y={LAN.y} color={C.lilac} opacity={people} s={lerp(0.7, 1, people)} wave={o[3] * inter} />
      <Person x={ANNA.x} y={ANNA.y} color={C.sky} opacity={people} s={lerp(0.7, 1, people)} />
      <Label x={LAN.x} y={LAN.y + 90 + fs(4)} anchor="middle" color={C.ink} size={fs(12)} opacity={people}>
        {L.lan}
      </Label>
      <Label x={ANNA.x} y={ANNA.y + 90 + fs(4)} anchor="middle" color={C.ink} size={fs(12)} opacity={people}>
        {L.anna}
      </Label>
      {!mobile && (
        <>
          <Label x={LAN.x} y={LAN.y + 112} anchor="middle" size={10} opacity={people} upper={false} spacing="0.02em">
            {L.lanSub}
          </Label>
          <Label x={ANNA.x} y={ANNA.y + 112} anchor="middle" size={10} opacity={people} upper={false} spacing="0.02em">
            {L.annaSub}
          </Label>
        </>
      )}

      {/* who goes first? */}
      {who > 0.01 && (
        <g opacity={who}>
          <path d={`M${ANNA.x - 60},${ANNA.y - 70} Q500,${330} ${LAN.x + 60},${LAN.y - 70}`} fill="none" stroke={C.mint} strokeWidth={2} strokeDasharray="6 6" markerEnd="" />
          <Chip x={500} y={392} text="$500 ?" color={C.mint} k={k} />
          <path d={`M${LAN.x + 60},${LAN.y + 40} Q500,${760} ${ANNA.x - 60},${ANNA.y + 40}`} fill="none" stroke={C.peach} strokeWidth={2} strokeDasharray="6 6" />
          <LogoCard x={500} y={690} s={0.7} />
          <text x={500} y={590} textAnchor="middle" fill={C.ink} opacity={0.9} style={{ fontFamily: "var(--font-serif)", fontSize: 120, fontWeight: 600 }}>
            ?
          </text>
          <Label x={500} y={790} anchor="middle" color={C.warn} size={fs(11)}>
            {L.whoFirst}
          </Label>
        </g>
      )}

      {/* the middleman */}
      <Platform x={MID.x} y={MID.y} opacity={platShown} label={L.platform} k={k} />
      {plat * story > 0.01 && (
        <g opacity={plat * story}>
          <Chip x={flowX} y={MID.y - 150} text={usd(amtStory)} color={C.mint} k={k} />
          {after && <Chip x={MID.x + 2} y={MID.y + 110} text={`−${storyFee}%`} color={C.warn} k={k} s={0.9} opacity={clamp((f - 0.5) * 4)} />}
          {!mobile && (
            <Label x={MID.x} y={MID.y + 170} anchor="middle" size={10} upper={false} spacing="0.02em" opacity={clamp((f - 0.6) * 3)}>
              {L.rules}
            </Label>
          )}
        </g>
      )}

      {/* interactive outcomes */}
      {inter > 0.01 && (
        <g opacity={inter}>
          {/* pay first: money already with Lan, risk on Anna */}
          <g opacity={riskAnna}>
            <Chip x={LAN.x + 120} y={LAN.y - 120} text="$500" color={C.mint} k={k} />
            <circle cx={ANNA.x} cy={ANNA.y - 22} r={46} fill="none" stroke={C.warn} strokeWidth={2.5} className="ping" />
            <Label x={ANNA.x} y={ANNA.y - 96} anchor="middle" color={C.warn} size={fs(11)}>
              {L.riskAnna}
            </Label>
          </g>
          {/* work first: logo already with Anna, risk on Lan */}
          <g opacity={riskLan}>
            <LogoCard x={ANNA.x - 130} y={ANNA.y - 110} s={0.8} />
            <circle cx={LAN.x} cy={LAN.y - 22} r={46} fill="none" stroke={C.warn} strokeWidth={2.5} className="ping" />
            <Label x={LAN.x} y={LAN.y - 96} anchor="middle" color={C.warn} size={fs(11)}>
              {L.riskLan}
            </Label>
          </g>
          <ContractBox x={MID.x} y={MID.y - 10} opacity={contractShown} label={L.contract} sub={L.contractSub} k={k} />
          {/* receipt */}
          <g opacity={Math.max(o[2], o[3])}>
            <Chip x={LAN.x} y={LAN.y - 130} text={usd(Math.round(lanGets * 100) / 100)} color={C.mint} k={k} />
            <Label x={LAN.x} y={LAN.y - 130 - fs(22)} anchor="middle" size={fs(9)}>
              {L.lanGets}
            </Label>
            {o[2] > 0.05 && (
              <Label x={MID.x} y={MID.y + 110 + fs(8)} anchor="middle" color={C.warn} size={fs(10)} opacity={o[2]}>
                {L.keeps.replace("{x}", usd(Math.round((AMOUNT * feeNow) / 100)))}
              </Label>
            )}
          </g>
        </g>
      )}
    </g>
  );
}
