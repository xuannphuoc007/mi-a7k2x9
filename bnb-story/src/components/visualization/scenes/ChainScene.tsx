"use client";
/**
 * Act 3 · BNB Chain. A crowd of Ethereum validators beside 45 on BNB Chain
 * (21 at a time) with sub-second blocks; the 2022 bridge hack, when
 * validators were contacted one by one and the chain stopped; then how many
 * parties it takes to stall each chain.
 */
import { useMemo } from "react";
import { chapterIndex } from "@/data/coins/bnb/chapters";
import { useSegmentTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, mulberry32, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("chain");
const NV = 45;

export default function ChainScene() {
  const { t } = useI18n();
  const L = t.scenes.chain;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const eth = useMemo(() => {
    const r = mulberry32(3);
    return Array.from({ length: 900 }, () => ({ x: 90 + r() * 330, y: 250 + r() * 330 }));
  }, []);
  const bnbNodes = useMemo(() => Array.from({ length: NV }, (_, i) => ({ x: 600 + (i % 9) * 36, y: 290 + Math.floor(i / 9) * 60 })), []);
  const v = useSegmentTimeline(
    IDX,
    0,
    0.5,
    { vis: 0, compare: 0, blocks: 0, hack: 0, calls: 0, nak: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.04, ease: "none" }, at(-0.06))
        .to(v, { compare: 1, duration: 0.1 }, at(-0.04))
        .to(v, { blocks: 1, duration: 0.6, ease: "none" }, at(0))
        .to(v, { hack: 1, duration: 0.06 }, at(0.3))
        .to(v, { calls: 1, duration: 0.2, ease: "none" }, at(0.34))
        .to(v, { nak: 1, duration: 0.12 }, at(0.6))
        .to(v, { exit: 1, duration: 0.08 }, at(0.92))
        .to(v, { vis: 0, duration: 0.01, ease: "none" }, at(1.0));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);
  const compare = smooth(v.compare);
  const hack = smooth(v.hack);
  const nak = smooth(v.nak);
  const calls = v.calls;
  const called = Math.floor(calls * NV);
  const halted = calls > 0.95;
  const blockN = 41_200_000 + Math.floor(v.blocks * (halted ? 300 : 900));
  const round = Math.floor(v.blocks * 40) % NV;

  return (
    <g opacity={v.vis * (1 - ex)}>
      <g opacity={compare * (1 - nak * 0.85)}>
        {/* Ethereum crowd */}
        <Label x={255} y={210} anchor="middle" color={C.ink} size={fs(11)}>
          Ethereum
        </Label>
        {eth.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.4} fill={C.lilac} opacity={0.5} />
        ))}
        <Label x={255} y={620 + fs(4)} anchor="middle" size={fs(9.5)}>
          {L.ethCount}
        </Label>
        {/* BNB Chain set */}
        <Label x={744} y={210} anchor="middle" color={C.ink} size={fs(11)}>
          BNB Chain
        </Label>
        {bnbNodes.map((n, i) => {
          const active = (i - round + NV) % NV < 21;
          const isCalled = hack > 0 && i < called;
          return (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={13} fill={isCalled ? C.warn : active ? C.yellow : C.paper} stroke={C.ink} strokeWidth={1.5} />
              {isCalled && <rect x={n.x - 4} y={n.y - 5} width={3} height={10} fill="#fff" />}
              {isCalled && <rect x={n.x + 1} y={n.y - 5} width={3} height={10} fill="#fff" />}
            </g>
          );
        })}
        <Label x={744} y={620 + fs(4)} anchor="middle" size={fs(9.5)}>
          {L.bnbCount}
        </Label>
        {/* block ticker */}
        <g transform="translate(744,690)">
          <rect x={-170} y={-28} width={340} height={56} rx={6} fill={halted ? C.warn : C.ink} />
          <text x={0} y={7} textAnchor="middle" fill={halted ? "#fff" : C.yellow} style={{ fontFamily: "var(--font-mono)", fontSize: fs(13), fontWeight: 700 }}>
            {halted ? L.halted : `${L.block} #${blockN.toLocaleString("en-US")} · 0.45s`}
          </text>
        </g>
      </g>

      {/* the 2022 halt */}
      {hack > 0.01 && nak < 0.5 && (
        <g opacity={hack * (1 - nak)}>
          <g transform="translate(255,770)">
            <rect x={-200} y={-50} width={400} height={100} rx={8} fill="#fde6ea" stroke={C.warn} strokeWidth={2} />
            <text y={-8} textAnchor="middle" fill={C.warn} style={{ fontFamily: "var(--font-mono)", fontSize: fs(14), fontWeight: 700 }}>
              {L.hack}
            </text>
            <text y={22} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontSize: 13 * Math.min(k, 1.4) }}>
              {L.oneByOne}
            </text>
          </g>
          {called > 0 && called < NV && (
            <line x1={455} y1={770} x2={bnbNodes[called - 1].x} y2={bnbNodes[called - 1].y} stroke={C.warn} strokeWidth={1.5} strokeDasharray="4 4" />
          )}
        </g>
      )}

      {/* how many to stall */}
      {nak > 0.01 && (
        <g opacity={nak}>
          <Label x={500} y={240} anchor="middle" color={C.ink} size={fs(12)}>
            {L.nakTitle}
          </Label>
          {[
            { name: "Ethereum", n: 30, c: C.lilac },
            { name: "BNB Chain", n: 7, c: C.yellow },
          ].map((r, i) => (
            <g key={r.name} transform={`translate(0,${370 + i * 150})`}>
              <Label x={140} y={8} size={fs(11)} color={C.ink}>
                {r.name}
              </Label>
              {Array.from({ length: r.n }, (_, j) => (
                <circle key={j} cx={360 + j * 17} cy={0} r={7} fill={r.c} stroke={C.ink} strokeWidth={1} opacity={clamp(v.nak * 3 - j * 0.04)} />
              ))}
              <text x={360 + r.n * 17 + 20} y={8} fill={C.ink} style={{ fontFamily: "var(--font-mono)", fontSize: fs(18), fontWeight: 700 }}>
                ≈{r.n}
              </text>
            </g>
          ))}
          <Label x={500} y={700} anchor="middle" size={fs(9.5)} upper={false} spacing="0.02em">
            {L.nakNote}
          </Label>
          <g transform="translate(500,800)">
            <rect x={-330} y={-36} width={660} height={72} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={1.4} />
            <text y={6} textAnchor="middle" fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: fs(15), fontStyle: "italic" }}>
              {L.quote}
            </text>
          </g>
        </g>
      )}
    </g>
  );
}
