"use client";
/**
 * Act 5 · The people. A calm power map: Anatoly Yakovenko and Raj Gokal tied to
 * Solana Labs, Lily Liu to the Solana Foundation, all around the Solana mark;
 * then the code builders — Anza (Agave) and Jump (Firedancer) — join.
 */
import { chapterIndex } from "@/data/coins/sol/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label, Portrait, SolMark } from "../svg";

const IDX = chapterIndex("team");
const P = [
  { x: 210, y: 250, href: "/img/anatoly.png" },
  { x: 790, y: 250, href: "/img/raj.png" },
  { x: 330, y: 760, href: "/img/lily-liu.png" },
];
const MID = { x: 500, y: 480 };
const ORG = [
  { x: 500, y: 250 },
  { x: 560, y: 640 },
  { x: 175, y: 520 },
  { x: 825, y: 520 },
];

function Pill({ x, y, text, k, o, col }: { x: number; y: number; text: string; k: number; o: number; col: string }) {
  if (o <= 0.01) return null;
  const f = Math.min(13 * k, 26);
  const w = text.length * f * 0.6 + 34;
  return (
    <g opacity={o} transform={`translate(${x},${y}) scale(${lerp(0.85, 1, o)})`}>
      <rect x={-w / 2} y={-f} width={w} height={f * 2} rx={f} fill="#fff" stroke={col} strokeWidth={2.5} />
      <text y={f * 0.36} textAnchor="middle" fill={col} style={{ fontFamily: "var(--font-mono)", fontSize: f, fontWeight: 700 }}>
        {text}
      </text>
    </g>
  );
}

export default function TeamScene() {
  const { t } = useI18n();
  const L = t.scenes.team;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const mobile = k >= 1.5;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, mark: 0, people: 0, links: 0, code: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.04))
        .to(v, { mark: 1, duration: 0.08 }, at(-0.02))
        .to(v, { people: 1, duration: 0.2, ease: "none" }, at(0.02))
        .to(v, { links: 1, duration: 0.16 }, at(0.16))
        .to(v, { code: 1, duration: 0.14 }, at(0.5))
        .to(v, { exit: 1, duration: 0.07 }, at(0.93))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const mark = smooth(v.mark);
  const links = smooth(v.links);
  const code = smooth(v.code);
  const pop = (i: number) => {
    const q = clamp(v.people * 3 - i * 0.9);
    return q < 0.7 ? smooth(q / 0.7) * 1.06 : lerp(1.06, 1, (q - 0.7) / 0.3);
  };
  const line = (a: { x: number; y: number }, b: { x: number; y: number }, q: number, col: string) =>
    q > 0.01 ? <line x1={a.x} y1={a.y} x2={lerp(a.x, b.x, q)} y2={lerp(a.y, b.y, q)} stroke={col} strokeWidth={2.5} strokeDasharray="2 7" strokeLinecap="round" /> : null;

  return (
    <g opacity={v.vis * (1 - ex)}>
      {/* links */}
      {line(P[0], ORG[0], links, C.accent)}
      {line(P[1], ORG[0], links, C.accent)}
      {line(P[2], ORG[1], links, "#14b07c")}
      {line(ORG[0], MID, links, C.accent)}
      {line(ORG[1], MID, links, "#14b07c")}
      {line(ORG[2], MID, code, C.ink)}
      {line(ORG[3], MID, code, C.ink)}

      <circle cx={MID.x} cy={MID.y} r={78 * mark} fill="#fff" stroke={C.line} strokeWidth={2} />
      <SolMark x={MID.x} y={MID.y} w={92} opacity={mark} />

      {P.map((p, i) => {
        const s = pop(i);
        if (s <= 0.01) return null;
        const person = L.people[i];
        const side = i === 2;
        return (
          <g key={i}>
            <g transform={`translate(${p.x},${p.y}) scale(${s}) translate(${-p.x},${-p.y})`}>
              <Portrait x={p.x} y={p.y} r={88} href={p.href} />
            </g>
            <g opacity={clamp(s)}>
              <text x={side ? p.x + 110 : p.x} y={side ? p.y + 4 : p.y + 126} textAnchor={side ? "start" : "middle"} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(19), fontWeight: 600 }}>
                {person.name}
              </text>
              <Label x={side ? p.x + 110 : p.x} y={side ? p.y + 30 + fs(4) : p.y + 152 + fs(4)} anchor={side ? "start" : "middle"} size={fs(9)} upper={false} spacing="0.02em">
                {person.role}
              </Label>
            </g>
          </g>
        );
      })}

      <Pill x={ORG[0].x} y={ORG[0].y} text={L.orgs[0]} k={k} o={links} col={C.accent} />
      <Pill x={ORG[1].x + (mobile ? 0 : 60)} y={ORG[1].y} text={mobile ? "Solana Foundation" : L.orgs[1]} k={k} o={links} col="#14b07c" />
      <Pill x={ORG[2].x} y={ORG[2].y} text={mobile ? "Anza" : L.orgs[2]} k={k} o={code} col={C.ink} />
      <Pill x={ORG[3].x} y={ORG[3].y} text={mobile ? "Jump" : L.orgs[3]} k={k} o={code} col={C.ink} />

      {!mobile && (
        <Label x={500} y={930} anchor="middle" size={fs(9)} upper={false} spacing="0.02em" opacity={links}>
          {L.note}
        </Label>
      )}
    </g>
  );
}
