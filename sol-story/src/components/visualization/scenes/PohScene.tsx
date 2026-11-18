"use client";
/**
 * Act 3 · Proof of History. Validators chatter to agree on order; a hash chain
 * ticks like a clock and stamps transactions; leaders rotate on a known ring;
 * then the clock retires and Alpenglow's finality bar shrinks from 12.8 s to ≈0.15 s.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, mulberry32, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("poh");
const R6 = Array.from({ length: 6 }, (_, i) => ({ x: 500 + Math.cos((i / 6) * Math.PI * 2 - Math.PI / 2) * 250, y: 470 + Math.sin((i / 6) * Math.PI * 2 - Math.PI / 2) * 230 }));
const R8 = Array.from({ length: 8 }, (_, i) => ({ x: 500 + Math.cos((i / 8) * Math.PI * 2 - Math.PI / 2) * 240, y: 520 + Math.sin((i / 8) * Math.PI * 2 - Math.PI / 2) * 240 }));
const rnd = mulberry32(7);
const HEX = Array.from({ length: 12 }, () => Math.floor(rnd() * 0xffff).toString(16).padStart(4, "0"));
const BEADS = 9;
const BX = (i: number) => 120 + i * 95;
const BY = 430;

export default function PohScene() {
  const { t } = useI18n();
  const L = t.scenes.poh;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, talk: 0, chain: 0, ring: 0, rot: 0, retire: 0, bars: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { talk: 1, duration: 0.2, ease: "none" }, at(0.0))
        .to(v, { chain: 1, duration: 0.22, ease: "none" }, at(0.24))
        .to(v, { ring: 1, duration: 0.08 }, at(0.48))
        .to(v, { rot: 1, duration: 0.2, ease: "none" }, at(0.5))
        .to(v, { retire: 1, duration: 0.08 }, at(0.7))
        .to(v, { bars: 1, duration: 0.14 }, at(0.76))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const talkO = smooth(clamp(v.talk * 5)) * (1 - smooth(clamp(v.chain * 4)));
  const c4 = smooth(clamp(v.chain * 4));
  const chainO = c4 * (1 - smooth(v.ring));
  const ring = smooth(v.ring) * (1 - smooth(v.retire));
  const retire = smooth(v.retire);
  const bars = smooth(v.bars);
  const beadsShown = v.chain * BEADS;
  const leader = Math.floor(v.rot * 8 * 0.999);

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* 1 · validators arguing about order */}
      {talkO > 0.01 && (
        <g opacity={talkO}>
          {R6.map((a, i) =>
            R6.slice(i + 1).map((b, j) => {
              const q = clamp(v.talk * 3 - ((i + j) % 4) * 0.3);
              return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={lerp(a.x, b.x, q)} y2={lerp(a.y, b.y, q)} stroke={C.mute} strokeOpacity={0.35} strokeDasharray="4 6" />;
            }),
          )}
          {R6.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={30} fill="#fff" stroke={C.ink} strokeWidth={2} />
              <rect x={p.x - 13} y={p.y - 12} width={26} height={24} rx={4} fill={C.lilac} opacity={0.75} />
            </g>
          ))}
          {L.talk.map((s, i) => {
            const p = R6[[0, 2, 4][i]];
            const q = smooth(clamp(v.talk * 4 - i * 0.8));
            const w = s.length * fs(13) * 0.55 + 30;
            const dx = p.x > 500 ? 40 : p.x < 500 ? -40 - w : -w / 2;
            return (
              <g key={s} opacity={q}>
                <rect x={p.x + dx} y={p.y - 74} width={w} height={36} rx={18} fill="#fff" stroke={C.line} strokeWidth={2} />
                <text x={p.x + dx + w / 2} y={p.y - 51} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: fs(13), fontStyle: "italic" }}>
                  {s}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* 2 · the hash chain */}
      {chainO > 0.01 && (
        <g opacity={chainO}>
          <Label x={120} y={300} size={fs(11)} color={C.ink}>
            {L.chain}
          </Label>
          {Array.from({ length: BEADS }, (_, i) => {
            const q = smooth(clamp(beadsShown - i));
            if (q <= 0.01) return null;
            const x = BX(i);
            return (
              <g key={i} opacity={q}>
                {i > 0 && <line x1={BX(i - 1) + 30} x2={x - 30} y1={BY} y2={BY} stroke={C.accent} strokeWidth={2} markerEnd="url(#arrow)" />}
                <circle cx={x} cy={BY} r={30} fill={i === Math.floor(beadsShown) - 1 ? C.accentSoft : "#fff"} stroke={C.accent} strokeWidth={2} />
                <text x={x} y={BY + 5} textAnchor="middle" fill={C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: Math.min(fs(11), 15), fontWeight: 600 }}>
                  {HEX[i]}
                </text>
                <Label x={x} y={BY + 56} anchor="middle" size={fs(8.5)}>
                  {`${L.tick} ${i + 1}`}
                </Label>
              </g>
            );
          })}
          {[3, 6].map((i, j) => {
            const q = smooth(clamp(beadsShown - i - 0.4));
            if (q <= 0.01) return null;
            const x = (BX(i) + BX(i + 1)) / 2;
            return (
              <g key={i} opacity={q} transform={`translate(${x},${lerp(BY - 150, BY - 92, q)})`}>
                <rect x={-34} y={-22} width={68} height={44} rx={8} fill={j ? "#14c98a" : "#9945ff"} />
                <text y={6} textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700 }}>
                  TX
                </text>
                <line x1={0} x2={0} y1={22} y2={60} stroke={C.ink} strokeDasharray="3 4" />
              </g>
            );
          })}
          <Label x={500} y={BY - 190} anchor="middle" size={fs(9.5)} color={C.accent} opacity={smooth(clamp(beadsShown - 4))}>
            {L.stamp}
          </Label>
          <Label x={500} y={BY + 120} anchor="middle" size={fs(10.5)} color={C.ink} opacity={smooth(clamp(beadsShown - 6))}>
            {L.check}
          </Label>
        </g>
      )}

      {/* 3 · leader schedule */}
      {ring > 0.01 && (
        <g opacity={ring}>
          <circle cx={500} cy={520} r={240} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="6 8" />
          {R8.map((p, i) => {
            const on = i === leader;
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={on ? 40 : 28} fill={on ? C.accent : "#fff"} stroke={C.accent} strokeWidth={2} />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fill={on ? "#fff" : C.accent} style={{ fontFamily: "var(--font-mono)", fontSize: on ? 15 : 12, fontWeight: 700 }}>
                  V{i + 1}
                </text>
              </g>
            );
          })}
          <text x={500} y={510} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: Math.min(fs(22), 36), fontWeight: 600 }}>
            {L.ring}
          </text>
          <Label x={500} y={545} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em">
            {L.slots}
          </Label>
          <Label x={R8[leader].x} y={R8[leader].y + (R8[leader].y > 520 ? 70 : -56)} anchor="middle" size={fs(9.5)} color={C.accent}>
            {L.leader}
          </Label>
        </g>
      )}

      {/* 4 · retired, and the finality bars */}
      {retire > 0.01 && (
        <g opacity={retire}>
          <g transform={`translate(500,${lerp(330, 300, retire)}) rotate(-3)`}>
            <rect x={-380} y={-34} width={760} height={68} rx={10} fill="#fff" stroke={C.warn} strokeWidth={3} />
            <Label x={0} y={7} anchor="middle" size={Math.min(fs(12), 19)} color={C.warn}>
              {L.retired}
            </Label>
          </g>
          {[
            { lab: L.before, s: 12.8, txt: "≈ 12.8 s", col: C.mute },
            { lab: L.after, s: 0.15, txt: "≈ 0.15 s", col: "#14b07c" },
          ].map((b, i) => {
            const y = 540 + i * 130;
            const w = Math.max(10, (b.s / 12.8) * 600 * bars);
            return (
              <g key={b.lab} opacity={bars}>
                <text x={170} y={y - 18} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(18), fontWeight: 600 }}>
                  {b.lab}
                </text>
                <rect x={170} y={y} width={w} height={40} rx={20} fill={b.col} opacity={i ? 1 : 0.45} />
                <text x={170 + w + 14} y={y + 27} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(15), fontWeight: 700 }}>
                  {b.txt}
                </text>
              </g>
            );
          })}
          <Label x={170} y={830} size={fs(9.5)} upper={false} spacing="0.02em" opacity={bars}>
            {L.final}
          </Label>
        </g>
      )}
    </g>
  );
}
