"use client";
/**
 * 3 · Who keeps the interest? Hà's tokens earn 0%; the dollars behind them
 * sit in Treasury bills and repo whose interest drips to Circle. Then Circle's
 * revenue bars, how each $100 is split with partners, and the business in one line.
 */
import { chapterIndex } from "@/data/coins/usdc/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useK, fadeIn, fadeOut } from "@/hooks/useK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { Badge, C, Person, Token, wrap } from "../svg";

const IDX = chapterIndex("profit");

export default function ProfitScene() {
  const { t } = useI18n();
  const L = t.scenes.profit;
  const { big, mobile } = useK();
  const v = useSceneTimeline(
    IDX,
    { vis: 0, a: 0, drip: 0, bars: 0, uses: 0, model: 0, rate: 0, flowT: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { a: 1, duration: 0.08 }, at(-0.02))
        .to(v, { drip: 1, duration: 0.2, ease: "none" }, at(0.05))
        .to(v, { bars: 1, duration: 0.14 }, at(0.24))
        .to(v, { uses: 1, duration: 0.1 }, at(0.48))
        .to(v, { model: 1, duration: 0.1 }, at(0.7))
        .to(v, { flowT: 6, duration: 0.24, ease: "none" }, at(0.7))
        .to(v, { rate: 1, duration: 0.12 }, at(0.78))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const a = smooth(v.a) * fadeOut(smooth(v.bars));
  const barsO = fadeIn(smooth(v.bars)) * fadeOut(smooth(v.uses));
  const usesO = fadeIn(smooth(v.uses)) * fadeOut(smooth(v.model));
  const modelO = fadeIn(smooth(v.model));
  const fsz = big(14, 24);
  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* A: 0% for Hà, interest for Circle */}
      {a > 0.01 && (
        <g opacity={a}>
          <Person x={170} y={400} s={0.9} color={C.sky} />
          <text x={170} y={510 + fsz} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 500 }}>
            {L.minh}
          </text>
          <g transform="translate(170,640)">
            <rect x={-95} y={-30} width={190} height={60} rx={30} fill="#fff" stroke={C.warn} strokeWidth={2.5} />
            <text y={big(9, 14)} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: big(18, 28), fontWeight: 600 }}>
              {L.zero}
            </text>
          </g>
          {/* dollars go into bills */}
          <path d="M260,400 C340,300 400,300 440,330" fill="none" stroke={C.line} strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" />
          <g transform="translate(540,380)">
            <rect x={-100} y={-70} width={200} height={140} rx={10} fill="#fff" stroke={C.ink} strokeWidth={2} />
            {[0, 1, 2].map((i) => (
              <line key={i} x1={-76} x2={i === 2 ? 20 : 76} y1={-34 + i * 22} y2={-34 + i * 22} stroke={C.line} strokeWidth={4} />
            ))}
            <rect x={-76} y={36} width={60} height={18} rx={4} fill={C.green} />
            <text y={110} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fsz, fontWeight: 500 }}>
              {L.bills}
            </text>
          </g>
          {/* interest drips to Circle */}
          <Badge x={830} y={640} w={210} text="Circle" fs={36} />
          {Array.from({ length: 8 }, (_, i) => {
            const q = clamp(v.drip * 2.2 - i * 0.15);
            if (q <= 0 || q >= 1) return null;
            const x = lerp(620, 800, q), y = lerp(440, 600, q) - Math.sin(q * Math.PI) * 60;
            return <circle key={i} cx={x} cy={y} r={12} fill={C.brass} stroke="#9c7425" strokeWidth={2} />;
          })}
          <text x={830} y={760 + fsz} textAnchor="middle" fill={C.brass} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22), fontWeight: 600 }}>
            {L.interest}
          </text>
        </g>
      )}

      {/* B: profit bars */}
      {barsO > 0.01 && (
        <g opacity={barsO}>
          <text x={110} y={190} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22), letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {L.barsTitle}
          </text>
          <line x1={110} x2={900} y1={760} y2={760} stroke={C.ink} strokeOpacity={0.3} />
          {L.bars.map((b, i) => {
            const q = smooth(clamp(v.bars * 1.6 - i * 0.18));
            const h = (b.v / 3) * 470 * q;
            const x = 150 + i * 190;
            const col = i === 3 ? C.grey : C.green;
            return (
              <g key={b.y}>
                <rect x={x} y={760 - h} width={130} height={h} rx={8} fill={col} />
                <text x={x + 65} y={760 - h - 18} textAnchor="middle" fill={C.ink} opacity={q} style={{ fontFamily: "var(--font-serif)", fontSize: big(26, 40), fontWeight: 500 }}>
                  {b.label}
                </text>
                <text x={x + 65} y={760 + big(14, 24) * 1.6} textAnchor="middle" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(14, 24) }}>
                  {b.y}
                </text>
              </g>
            );
          })}
          <text x={900} y={760 + big(14, 24) * 3.4} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(11, 19) }}>
            {L.partial}
          </text>
        </g>
      )}

      {/* C: of every $100 earned, about $61 is paid on to partners */}
      {usesO > 0.01 && (
        <g opacity={usesO}>
          <text x={110} y={190} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: big(13, 22), letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {L.splitTitle}
          </text>
          {Array.from({ length: 100 }, (_, k) => {
            const col = k % 10, row = Math.floor(k / 10);
            const paid = k < 61;
            const q = smooth(Math.min(1, Math.max(0, v.uses * 2 - k * 0.006)));
            if (q <= 0.01) return null;
            const x = (mobile ? 130 : 150) + col * (mobile ? 42 : 44), y = 260 + row * (mobile ? 42 : 44);
            return <circle key={k} cx={x} cy={y} r={mobile ? 17 : 18} fill={paid ? "#5b6b8c" : C.green} opacity={q} />;
          })}
          {(() => {
            const lx = mobile ? 580 : 640;
            const fz = big(16, 26);
            return (
              <g>
                <circle cx={lx} cy={330} r={18} fill="#5b6b8c" />
                {wrap(L.paid, mobile ? 14 : 18).map((ln, k) => (
                  <text key={k} x={lx + 32} y={340 + k * fz * 1.3} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fz, fontWeight: 600 }}>
                    {ln}
                  </text>
                ))}
                <circle cx={lx} cy={560} r={18} fill={C.green} />
                {wrap(L.kept, mobile ? 14 : 18).map((ln, k) => (
                  <text key={k} x={lx + 32} y={570 + k * fz * 1.3} fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fz, fontWeight: 600 }}>
                    {ln}
                  </text>
                ))}
              </g>
            );
          })()}
          <text x={500} y={800} textAnchor="middle" fill={C.gd} style={{ fontFamily: "var(--font-serif)", fontSize: big(26, 38), fontWeight: 500 }}>
            {L.splitVal}
          </text>
        </g>
      )}

      {/* D: the business in one line */}
      {modelO > 0.01 && (
        <g opacity={modelO}>
          {(() => {
            const y = 470;
            const nodes = [
              { x: 160, label: "USDC", sub: L.nodes[0], col: C.warn },
              { x: 500, label: "Circle", sub: L.nodes[1], col: C.green },
              { x: 840, label: "US Treasury", sub: L.nodes[2], col: C.brass },
            ];
            return (
              <g>
                <line x1={230} x2={420} y1={y} y2={y} stroke={C.ink} strokeWidth={3} markerEnd="url(#arrow)" />
                <line x1={580} x2={760} y1={y} y2={y} stroke={C.ink} strokeWidth={3} markerEnd="url(#arrow)" />
                {nodes.map((n) => (
                  <g key={n.x}>
                    <circle cx={n.x} cy={y} r={70} fill="#fff" stroke={n.col} strokeWidth={4} />
                    {n.label === "Circle" ? (
                      <text x={n.x} y={y + 10} textAnchor="middle" fill={C.gd} style={{ fontFamily: "var(--font-sans)", fontSize: 30, fontWeight: 700 }}>
                        Circle
                      </text>
                    ) : n.label === "USDC" ? (
                      <Token x={n.x} y={y} r={38} />
                    ) : (
                      <text x={n.x} y={y + 14} textAnchor="middle" fill={C.brass} style={{ fontFamily: "var(--font-serif)", fontSize: 44 }}>
                        $
                      </text>
                    )}
                    <text x={n.x} y={y + 110} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: big(14, 22), fontWeight: 500 }}>
                      {n.sub}
                    </text>
                  </g>
                ))}
                {/* interest flowing back from the US government to Circle; it thins as rates fall */}
                <path d={`M840,${y - 80} C760,${y - 230} 580,${y - 230} 520,${y - 90}`} fill="none" stroke={C.line} strokeWidth={3} strokeDasharray="3 8" />
                {Array.from({ length: 10 }, (_, k) => {
                  const dens = 1 - 0.55 * smooth(v.rate);
                  if (k / 10 > dens) return null;
                  const ph = (v.flowT + k / 10) % 1;
                  const bx = (1 - ph) ** 3 * 840 + 3 * (1 - ph) ** 2 * ph * 760 + 3 * (1 - ph) * ph ** 2 * 580 + ph ** 3 * 520;
                  const by = (1 - ph) ** 3 * (y - 80) + 3 * (1 - ph) ** 2 * ph * (y - 230) + 3 * (1 - ph) * ph ** 2 * (y - 230) + ph ** 3 * (y - 90);
                  return <circle key={k} cx={bx} cy={by} r={10} fill={C.brass} stroke="#9c7425" strokeWidth={2} />;
                })}
                {/* rate slider */}
                <g transform={`translate(0,${y + 200})`}>
                  <line x1={260} x2={740} y1={0} y2={0} stroke={C.line} strokeWidth={8} strokeLinecap="round" />
                  <circle cx={lerp(700, 300, smooth(v.rate))} cy={0} r={18} fill={C.ink} />
                  <text x={260} y={-26} fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 19) }}>
                    {L.rateLow}
                  </text>
                  <text x={740} y={-26} textAnchor="end" fill={C.mute} style={{ fontFamily: "var(--font-mono)", fontSize: big(12, 19) }}>
                    {L.rateHigh}
                  </text>
                  <text x={500} y={70} textAnchor="middle" fill={C.warn} opacity={smooth(v.rate)} style={{ fontFamily: "var(--font-serif)", fontSize: big(24, 36), fontWeight: 500 }}>
                    {L.rateNote}
                  </text>
                </g>
                <text x={500} y={180} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: big(26, 40) }}>
                  {L.model}
                </text>
              </g>
            );
          })()}
        </g>
      )}
    </g>
  );
}
