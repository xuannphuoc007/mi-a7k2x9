"use client";
/**
 * 8 · USDT in Vietnam. Rank #4 (Chainalysis 2025); how P2P works (dong by bank
 * transfer, the exchange releases USDT); the price board with the premium;
 * three risks; the licensing timeline.
 */
import { chapterIndex } from "@/data/coins/usdt/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Person, Token } from "../svg";

const IDX = chapterIndex("vietnam");

export default function VietnamScene() {
  const { t } = useI18n();
  const L = t.scenes.vietnam;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, rank: 0, cmp: 0, p2p: 0, flow: 0, board: 0, risks: 0, law: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { rank: 1, duration: 0.06 }, at(-0.02))
        .to(v, { cmp: 1, duration: 0.12 }, at(0.03))
        .to(v, { p2p: 1, duration: 0.06 }, at(0.17))
        .to(v, { flow: 1, duration: 0.14, ease: "none" }, at(0.21))
        .to(v, { board: 1, duration: 0.08 }, at(0.36))
        .to(v, { risks: 1, duration: 0.1 }, at(0.54))
        .to(v, { law: 1, duration: 0.14, ease: "none" }, at(0.72))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const fsz = big(15, 25);
  const rankO = smooth(v.rank) * fadeOut(smooth(v.p2p));
  const p2pO = fadeIn(smooth(v.p2p)) * fadeOut(smooth(v.board));
  const boardO = fadeIn(smooth(v.board)) * fadeOut(smooth(v.risks));
  const riskO = fadeIn(smooth(v.risks)) * fadeOut(smooth(v.law));
  const lawO = fadeIn(smooth(v.law));
  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* A: #4 — and $220B a year next to the whole economy */}
      {rankO > 0.01 && (
        <g opacity={rankO}>
          <g transform="translate(110,250)">
            <rect x={0} y={-62} width={86} height={58} rx={6} fill="#da251d" />
            <path d="M43,-50 L48,-38 L61,-38 L51,-30 L55,-17 L43,-25 L31,-17 L35,-30 L25,-38 L38,-38 Z" fill="#ffcd00" />
            <text x={110} y={-10} fill={C.gd} style={{ fontFamily: "var(--font-serif)", fontSize: 92, fontWeight: 450 }}>
              {L.rank}
            </text>
            <text x={250} y={-24} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 22), letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {L.rankSub}
            </text>
          </g>
          {[
            { label: L.gdp, val: L.gdpVal, w: 1, col: C.grey, y: 380 },
            { label: L.crypto, val: L.cryptoVal, w: 220 / 514, col: C.green, y: 600 },
          ].map((b, k) => {
            const q = smooth(clamp(v.cmp * 1.6 - k * 0.5));
            return (
              <g key={b.label}>
                <text x={110} y={b.y - 22} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 21), letterSpacing: "0.04em" }}>
                  {b.label}
                </text>
                <rect x={110} y={b.y} width={780 * b.w * q} height={110} rx={14} fill={b.col} />
                <text x={k === 0 ? 130 : 110 + 780 * b.w * q + 24} y={b.y + 70} fill={k === 0 ? "#fff" : C.gd} opacity={q} style={{ fontFamily: "var(--font-serif)", fontSize: big(34, 46), fontWeight: 500 }}>
                  {b.val}
                </text>
              </g>
            );
          })}
          <g opacity={smooth(clamp(v.cmp * 2 - 1.2))}>
            <line x1={110 + 780 * (220 / 514)} x2={110 + 780 * (220 / 514)} y1={380} y2={710} stroke={C.ink} strokeWidth={2} strokeDasharray="6 6" />
            <text x={110} y={830} fill={C.gd} style={{ fontFamily: "var(--font-serif)", fontSize: big(56, 72), fontWeight: 500 }}>
              {L.pct}
            </text>
            <text x={110 + big(56, 72) * 3.2} y={820} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(15, 22) }}>
              {L.gdpShare}
            </text>
          </g>
        </g>
      )}

      {/* B: P2P flow */}
      {p2pO > 0.01 && (
        <g opacity={p2pO}>
          <Person x={170} y={560} s={0.95} color={C.sky} />
          <text x={170} y={680} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 600 }}>
            {L.minh}
          </text>
          <Person x={830} y={560} s={0.95} color={C.lilac} />
          <text x={830} y={680} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 600 }}>
            {L.seller}
          </text>
          {/* exchange escrow */}
          <g transform="translate(500,260)">
            <rect x={-150} y={-80} width={300} height={160} rx={18} fill="#fff" stroke={C.ink} strokeWidth={2.5} />
            <Token x={0} y={-6} r={40} />
            <text y={-100} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 20) }}>
              {L.exchange}
            </text>
          </g>
          <path d="M760,470 C720,380 660,330 640,320" fill="none" stroke={C.line} strokeWidth={3} strokeDasharray="4 8" />
          {/* ① dong goes from Lan to seller */}
          <path d="M240,640 C400,760 600,760 760,640" fill="none" stroke={C.brass} strokeWidth={4} />
          {(() => {
            const q = clamp(v.flow * 2);
            const x = lerp(240, 760, q), y = 640 + Math.sin(q * Math.PI) * 90;
            return (
              <g opacity={q > 0 && q < 1 ? 1 : 0.0}>
                <rect x={x - 34} y={y - 22} width={68} height={44} rx={6} fill="#fff" stroke={C.brass} strokeWidth={3} />
                <text x={x} y={y + 9} textAnchor="middle" fill={C.brass} style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 600 }}>
                  ₫
                </text>
              </g>
            );
          })()}
          <text x={500} y={820} textAnchor="middle" fill={C.brass} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), fontWeight: 600 }}>
            {L.step1}
          </text>
          {/* ② exchange releases USDT to Lan */}
          <path d="M360,320 C300,360 250,420 230,470" fill="none" stroke={C.green} strokeWidth={4} />
          {(() => {
            const q = clamp(v.flow * 2 - 1);
            return q > 0 && q < 1 ? <Token x={lerp(360, 230, q)} y={lerp(320, 470, q)} r={22} /> : null;
          })()}
          <text x={mobile ? 80 : 120} y={mobile ? 400 : 390} fill={C.gd} opacity={smooth(clamp(v.flow * 2 - 1))} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24), fontWeight: 600 }}>
            {L.step2}
          </text>
        </g>
      )}

      {/* C: price board */}
      {boardO > 0.01 && (
        <g opacity={boardO}>
          <rect x={110} y={200} width={780} height={520} rx={22} fill="#fff" stroke={C.ink} strokeWidth={2.5} />
          <text x={150} y={262} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22), letterSpacing: "0.08em" }}>
            {L.boardTitle}
          </text>
          {[
            { l: L.bank, val: L.bankVal, col: C.ink, y: 400 },
            { l: L.p2p, val: L.p2pVal, col: C.gd, y: 560 },
          ].map((r, i) => (
            <g key={r.l} opacity={smooth(clamp(v.board * 2 - i * 0.6))}>
              <text x={150} y={r.y} fill={C.mute} style={{ fontFamily: "var(--font-sans)", fontSize: big(17, 26) }}>
                {r.l}
              </text>
              <text x={850} y={r.y + 6} textAnchor="end" fill={r.col} style={{ fontFamily: "var(--font-mono)", fontSize: big(50, 64), fontWeight: 500 }}>
                {r.val}
              </text>
              <line x1={150} x2={850} y1={r.y + 50} y2={r.y + 50} stroke={C.line} />
            </g>
          ))}
          <g transform="translate(720,800)" opacity={smooth(clamp(v.board * 2 - 1))}>
            <rect x={-130} y={-46} width={260} height={92} rx={46} fill={C.brass} />
            <text y={16} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-serif)", fontSize: big(40, 52), fontWeight: 600 }}>
              {L.premium}
            </text>
          </g>
        </g>
      )}

      {/* D: risks */}
      {riskO > 0.01 && (
        <g opacity={riskO}>
          {L.risks.map((r, i) => {
            const q = smooth(clamp(v.risks * 2 - i * 0.3));
            const y = 260 + i * 210;
            return (
              <g key={r} opacity={q} transform={`translate(${(1 - q) * 30},0)`}>
                <rect x={110} y={y - 70} width={780} height={150} rx={22} fill="#fff" stroke={C.warn} strokeWidth={2.5} />
                <g transform={`translate(200,${y + 5})`}>
                  <path d="M0,-50 L52,40 L-52,40 Z" fill={C.warn} strokeLinejoin="round" />
                  <rect x={-5} y={-18} width={10} height={34} rx={4} fill="#fff" />
                  <circle cx={0} cy={28} r={6} fill="#fff" />
                </g>
                <text x={290} y={y + big(20, 32) * 0.35} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(28, 40), fontWeight: 500 }}>
                  {r}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* E: the law timeline */}
      {lawO > 0.01 && (
        <g opacity={lawO}>
          <line x1={200} x2={200} y1={180} y2={820} stroke={C.line} strokeWidth={5} />
          <line x1={200} x2={200} y1={180} y2={lerp(180, 820, v.law)} stroke={C.gd} strokeWidth={5} />
          {L.timeline.map((s, i) => {
            const y = 200 + i * 200;
            const q = smooth(clamp(v.law * 4 - i * 0.8));
            const warn = i === 2;
            return (
              <g key={s.d} opacity={q}>
                <circle cx={200} cy={y} r={18} fill={warn ? C.paper : C.green} stroke={warn ? C.warn : C.gd} strokeWidth={5} />
                <text x={250} y={y - 6} fill={warn ? C.warn : C.gd} style={{ fontFamily: "var(--font-mono)", fontSize: big(15, 24), fontWeight: 600 }}>
                  {s.d}
                </text>
                <text x={250} y={y + big(20, 30) * 1.2} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: big(24, 34) }}>
                  {s.t}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}
