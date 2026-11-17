"use client";
/**
 * Act 2 · The Origin. 2004: an IOU ripples through a web of friends.
 * 2011: mining is crossed out and replaced by agreement. 2012: 100 blocks
 * = 100 billion XRP appear; 80 slide to the company, 20 stay with founders.
 */
import { chapterIndex } from "@/data/coins/xrp/chapters";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useFontK } from "@/hooks/useFontK";
import { useI18n } from "@/lib/i18n";
import { clamp, lerp, smooth } from "@/lib/store";
import { C, Label } from "../svg";

const IDX = chapterIndex("origin");

const FRIENDS = [
  { x: 230, y: 420 }, { x: 360, y: 300 }, { x: 420, y: 520 }, { x: 560, y: 380 },
  { x: 640, y: 560 }, { x: 760, y: 330 }, { x: 800, y: 480 },
];
const LINKS: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 6], [5, 6], [3, 4], [1, 5]];
const IOU_PATH = [0, 1, 3, 5, 6];

export default function OriginScene() {
  const { t } = useI18n();
  const L = t.scenes.origin;
  const k = useFontK();
  const fs = (s: number) => s * k;
  const v = useSceneTimeline(
    IDX,
    { vis: 0, web: 0, iou: 0, webOut: 0, mine: 0, cross: 0, agree: 0, mineOut: 0, grid: 0, split: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.05, ease: "none" }, at(-0.1))
        .to(v, { web: 1, duration: 0.12 }, at(-0.08))
        .to(v, { iou: 1, duration: 0.16, ease: "none" }, at(0.06))
        .to(v, { webOut: 1, duration: 0.06 }, at(0.24))
        .to(v, { mine: 1, duration: 0.06 }, at(0.27))
        .to(v, { cross: 1, duration: 0.06 }, at(0.34))
        .to(v, { agree: 1, duration: 0.08 }, at(0.38))
        .to(v, { mineOut: 1, duration: 0.05 }, at(0.48))
        .to(v, { grid: 1, duration: 0.16, ease: "none" }, at(0.5))
        .to(v, { split: 1, duration: 0.16 }, at(0.75))
        .to(v, { exit: 1, duration: 0.16 }, at(1.0))
        .to(v, { vis: 0, duration: 0.04, ease: "none" }, at(1.16));
    },
  );
  if (v.vis <= 0.001) return null;
  const ex = smooth(v.exit);

  // ── 2004 web of trust
  const webO = smooth(v.web) * (1 - smooth(v.webOut));
  const iouSeg = (IOU_PATH.length - 1) * clamp(v.iou);
  const ii = Math.min(IOU_PATH.length - 2, Math.floor(iouSeg));
  const a = FRIENDS[IOU_PATH[ii]];
  const b = FRIENDS[IOU_PATH[ii + 1]];
  const iou = { x: lerp(a.x, b.x, smooth(iouSeg - ii)), y: lerp(a.y, b.y, smooth(iouSeg - ii)) };

  // ── 2011 mining → agreement
  const mineO = smooth(v.mine) * (1 - smooth(v.mineOut));

  // ── 2012 grid of 100 blocks
  const gridO = clamp(v.grid * 3) * (1 - ex);
  const split = smooth(v.split);

  return (
    <g opacity={v.vis * (1 - ex * 0.999)}>
      {/* 2004 */}
      {webO > 0.01 && (
        <g opacity={webO}>
          <Label x={500} y={200} anchor="middle" color={C.accent} size={fs(13)} weight={600}>
            {L.y2004}
          </Label>
          {LINKS.map(([i, j]) => {
            const onPath = IOU_PATH.some((p, q) => q < IOU_PATH.length - 1 && ((p === i && IOU_PATH[q + 1] === j) || (p === j && IOU_PATH[q + 1] === i)));
            return <line key={`${i}-${j}`} x1={FRIENDS[i].x} y1={FRIENDS[i].y} x2={FRIENDS[j].x} y2={FRIENDS[j].y} stroke={onPath && v.iou > 0 ? C.accent : C.line} strokeWidth={onPath ? 1.6 : 1} strokeDasharray={onPath ? undefined : "3 4"} />;
          })}
          {FRIENDS.map((f, i) => {
            const lit = IOU_PATH.indexOf(i) >= 0 && IOU_PATH.indexOf(i) <= iouSeg + 0.5 && v.iou > 0;
            return (
              <g key={i} transform={`translate(${f.x},${f.y}) scale(${lerp(0.4, 1, smooth(clamp(v.web * 2 - i * 0.12)))})`}>
                <circle r={22} fill={C.paper} stroke={lit ? C.accent : C.ink} strokeWidth={1.4} />
                <circle cy={-5} r={5.5} fill="none" stroke={lit ? C.accent : C.ink} strokeWidth={1.2} />
                <path d="M-9,10 C-8,2 8,2 9,10" fill="none" stroke={lit ? C.accent : C.ink} strokeWidth={1.2} />
              </g>
            );
          })}
          {v.iou > 0.001 && v.iou < 0.999 && (
            <g transform={`translate(${iou.x},${iou.y - 34})`}>
              <circle r={26} fill="url(#glow)" />
              <rect x={-fs(22)} y={-fs(11)} width={fs(44)} height={fs(22)} rx={fs(11)} fill={C.accent} />
              <text y={fs(4)} textAnchor="middle" fill={C.paper} style={{ fontFamily: "var(--font-mono)", fontSize: fs(10), fontWeight: 700 }}>
                {L.iou}
              </text>
            </g>
          )}
          <Label x={500} y={650} anchor="middle" size={fs(10)} upper={false} spacing="0.02em">
            {L.friends}
          </Label>
        </g>
      )}

      {/* 2011 */}
      {mineO > 0.01 && (
        <g opacity={mineO}>
          <Label x={500} y={200} anchor="middle" color={C.accent} size={fs(13)} weight={600}>
            {L.y2011}
          </Label>
          {/* mining: a pickaxe over a hot chip */}
          <g transform="translate(320,450)">
            <rect x={-70} y={-70} width={140} height={140} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={1.4} />
            {Array.from({ length: 5 }, (_, i) => (
              <line key={i} x1={-70 + 23 * (i + 1)} x2={-70 + 23 * (i + 1)} y1={-70} y2={70} stroke={C.line} />
            ))}
            <path d="M-40,40 L35,-35 M20,-50 C40,-45 52,-28 50,-12" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
            <Label x={0} y={104} anchor="middle" color={C.ink} size={fs(11)}>
              {L.mining}
            </Label>
            {/* the cross */}
            <path d="M-80,-80 L80,80 M80,-80 L-80,80" stroke={C.warn} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${smooth(v.cross)} 1`} />
          </g>
          <path d="M440,450 L540,450" stroke={C.mute} strokeWidth={1.4} markerEnd="" opacity={smooth(v.agree)} />
          <path d="M528,440 L542,450 L528,460" stroke={C.mute} strokeWidth={1.4} fill="none" opacity={smooth(v.agree)} />
          {/* agreement: a ring of validators that light up */}
          <g transform="translate(690,450)" opacity={smooth(v.agree)}>
            <circle r={78} fill="none" stroke={C.accent} strokeWidth={1} strokeDasharray="2 5" />
            {Array.from({ length: 6 }, (_, i) => {
              const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const on = clamp(v.agree * 7 - i) > 0.5;
              return <circle key={i} cx={Math.cos(ang) * 78} cy={Math.sin(ang) * 78} r={12} fill={on ? C.accent : C.paper} stroke={C.accent} strokeWidth={1.4} />;
            })}
            <path d="M-18,0 L-5,13 L20,-14" stroke={C.accent} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={clamp(v.agree * 2 - 1)} />
            <Label x={0} y={112} anchor="middle" color={C.accent} size={fs(11)}>
              {L.agree}
            </Label>
          </g>
        </g>
      )}

      {/* 2012: 100 blocks, then 80 / 20 */}
      {v.grid > 0.001 && (
        <g opacity={gridO}>
          <Label x={500} y={200} anchor="middle" color={C.accent} size={fs(13)} weight={600} opacity={1 - split * 0.0}>
            {L.y2012}
          </Label>
          <Label x={500} y={228} anchor="middle" size={fs(9.5)} opacity={1 - split}>
            {L.block}
          </Label>
          {Array.from({ length: 100 }, (_, i) => {
            const r = Math.floor(i / 10);
            const c = i % 10;
            const appear = smooth(clamp(v.grid * 1.6 - (r * 10 + c) / 100));
            const home = { x: 320 + c * 37, y: 300 + r * 37 };
            const comp = i < 80;
            const ti = comp ? i : i - 80;
            const target = comp ? { x: 560 + (ti % 8) * 34, y: 330 + Math.floor(ti / 8) * 34 } : { x: 110 + (ti % 4) * 34, y: 400 + Math.floor(ti / 4) * 34 };
            const st = smooth(clamp(split * 1.5 - ((comp ? ti : ti) / 100) * 0.5));
            const x = lerp(home.x, target.x, st);
            const y = lerp(home.y, target.y, st);
            return <rect key={i} x={x} y={y} width={28} height={28} rx={3} fill={comp && st > 0.5 ? C.accent : C.ink} opacity={appear * (comp && st > 0.5 ? 0.9 : 0.85)} transform={`rotate(${(1 - appear) * 40} ${x + 14} ${y + 14})`} />;
          })}
          {split > 0.05 && (
            <g opacity={smooth(split)}>
              <rect x={548} y={318} width={286} height={364} rx={8} fill="none" stroke={C.accent} strokeWidth={1.3} />
              <Label x={691} y={710} anchor="middle" color={C.accent} size={fs(10.5)} weight={600}>
                80 · {L.company}
              </Label>
              <rect x={98} y={388} width={150} height={184} rx={8} fill="none" stroke={C.ink} strokeWidth={1.1} />
              <Label x={173} y={600} anchor="middle" color={C.ink} size={fs(10.5)} weight={600}>
                20 · {L.founders}
              </Label>
              {/* the open network spans everything */}
              <rect x={70} y={260} width={860} height={480} rx={14} fill="none" stroke={C.mute} strokeDasharray="6 6" />
              <Label x={86} y={284} color={C.mute} size={fs(10)}>
                {L.ledger}
              </Label>
            </g>
          )}
        </g>
      )}
    </g>
  );
}
