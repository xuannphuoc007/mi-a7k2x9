"use client";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useI18n } from "@/lib/i18n";
import { clamp, smooth, useStore } from "@/lib/store";
import { explorer } from "@/lib/explorerStore";
import { layers } from "@/data/coins/xrp/anatomy";
import { C, DrawPath, Label } from "../svg";

const IDX = 9;

/** Engineering-plate frame and title block drawn around the 3D exploded view. */
export default function PiecesScene() {
  const { t } = useI18n();
  const sel = useStore(explorer, (s) => s.selected);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, gather: 0, frame: 0, block: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.06, ease: "none" }, at(-0.1))
        .to(v, { gather: 1, duration: 0.35 }, at(-0.05))
        .to(v, { frame: 1, duration: 0.2 }, at(0.62))
        .to(v, { block: 1, duration: 0.12 }, at(0.86));
    },
    { pre: 0.2, post: 0.01 },
  );
  if (v.vis <= 0.001) return null;
  const f = smooth(v.frame);
  const corner = (x: number, y: number, sx: number, sy: number) => `M${x},${y + 26 * sy} V${y} H${x + 26 * sx}`;

  return (
    <g opacity={v.vis}>
      {/* gathering lines: dispersed components converge toward centre */}
      {v.gather < 1 &&
        Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2 + 0.3;
          const r1 = 470 - v.gather * 300;
          const r2 = r1 + 40;
          return (
            <line
              key={i}
              x1={500 + Math.cos(a) * r1}
              y1={500 + Math.sin(a) * r1}
              x2={500 + Math.cos(a) * r2}
              y2={500 + Math.sin(a) * r2}
              stroke={C.mute}
              strokeWidth={0.8}
              opacity={Math.sin(v.gather * Math.PI)}
            />
          );
        })}
      {/* plate frame */}
      <g opacity={f}>
        <DrawPath d={corner(40, 40, 1, 1)} p={f} width={1.2} />
        <DrawPath d={corner(960, 40, -1, 1)} p={f} width={1.2} />
        <DrawPath d={corner(40, 960, 1, -1)} p={f} width={1.2} />
        <DrawPath d={corner(960, 960, -1, -1)} p={f} width={1.2} />
        {Array.from({ length: 19 }, (_, i) => (
          <line key={i} x1={50 + i * 50} y1={40} x2={50 + i * 50} y2={i % 2 ? 46 : 50} stroke={C.mute} strokeWidth={0.6} />
        ))}
        {Array.from({ length: 19 }, (_, i) => (
          <line key={`y${i}`} x1={40} y1={50 + i * 50} x2={i % 2 ? 46 : 50} y2={50 + i * 50} stroke={C.mute} strokeWidth={0.6} />
        ))}
        <Label x={56} y={104} color={C.ink}>
          {t.scenes.pieces.plate}
        </Label>
      </g>
      {/* title block */}
      <g transform="translate(52,852)" opacity={smooth(v.block)}>
        <rect width={310} height={90} fill={C.paper} stroke={C.ink} strokeWidth={1} />
        <line x1={0} y1={30} x2={310} y2={30} stroke={C.ink} strokeWidth={0.6} />
        <line x1={200} y1={30} x2={200} y2={90} stroke={C.ink} strokeWidth={0.6} />
        <text x={12} y={21} fill={C.ink} style={{ fontFamily: "var(--font-serif)", fontSize: 17 }}>
          {t.scenes.pieces.title}
        </text>
        <Label x={12} y={50} size={9.5}>
          {sel >= 0 ? `${t.panels.explorer.layer} ${String(sel + 1).padStart(2, "0")}` : `12 × ${t.panels.explorer.layer}`}
        </Label>
        <Label x={12} y={68} size={9.5} color={C.ink} upper={false} spacing="0">
          {sel >= 0 ? t.anatomy[sel].name : "1 : 1 · conceptual"}
        </Label>
        <Label x={210} y={50} size={9.5}>
          rev 2026·11
        </Label>
        <Label x={210} y={68} size={9.5}>
          sheet 10/10
        </Label>
      </g>
      <g opacity={clamp(v.block * 2 - 1)}>
        <Label x={948} y={940} anchor="end" size={9.5}>
          {layers.length} × {t.panels.explorer.layer} · {t.ui.illustrative}
        </Label>
      </g>
    </g>
  );
}
