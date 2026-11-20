"use client";
/**
 * The full-screen isometric map. A camera (the SVG viewBox) flies between
 * keyframes as the reader scrolls; long hops lift the camera a little so the
 * reader sees where they are going. The world itself lives in districts.tsx.
 */
import { memo, useEffect, useRef } from "react";
import { subscribeG } from "@/animations/scrollController";
import { useG } from "@/hooks/useG";
import { useI18n } from "@/lib/i18n";
import { clamp, easeInOut, range, smooth } from "@/lib/store";
import { Districts, Ground } from "./districts";
import { K, P, Pin } from "./iso";

/** [g, i, j, z, visible world width (desktop)] */
const KF: [number, number, number, number, number][] = [
  [0.0, 4.5, 3, 30, 1000], [0.3, 2.5, 9, 0, 1500], [0.62, 10, 5, 0, 2600],
  [1.0, 17, 1.5, 30, 1100], [1.26, 19.5, 2.5, 0, 1000], [1.5, 16.5, 4.5, 0, 950], [1.72, 15, 2.5, 20, 1200],
  [2.0, 30.5, 7, 0, 1250], [2.2, 34, 4.5, 30, 1300], [2.38, 33.5, 7.5, 0, 1250], [2.56, 31, 10, 0, 1150], [2.74, 31, 7.5, 0, 1300],
  [3.0, 46, 2.5, 50, 1250], [3.26, 45, 10.5, 40, 1250], [3.5, 43.5, 4, 40, 1250], [3.72, 48.5, -2, 40, 1200],
  [4.0, 62.5, 1.5, 40, 1350], [4.26, 3.5, 9, 0, 1700], [4.5, 45.8, 3.6, 70, 1100], [4.72, 63, 2.5, 30, 1300],
  [5.0, 79, 12.5, 30, 1150], [5.26, 77, 10, 30, 1150], [5.5, 81.5, 14.5, 80, 1350], [5.72, 78.5, 15, 0, 1150],
  [6.0, 95.5, 2, 70, 1350], [6.2, 95.5, 2, 70, 1350], [6.38, 94.5, 19, 0, 1500], [6.56, 95.5, 7.5, 0, 1250], [6.74, 100, 0, 90, 1300],
  [7.0, 112, 3, 30, 1250], [7.22, 117, 4, 30, 1150], [7.42, 120.5, 7, 40, 1150], [7.95, 120.5, 7, 40, 1150],
  [8.0, 30.5, 7, 0, 1300], [8.2, 35, 5, 30, 1300], [8.38, 114, 3, 30, 1500], [8.56, 94.5, 19, 0, 1500], [8.74, 79, 13, 30, 1200],
  [9.0, 79, 13, 30, 1200], [9.2, 95, 7.5, 0, 1250], [9.38, 46, 4, 50, 1250], [9.56, 51, 0, 30, 1200], [9.74, 95, 2, 60, 1350],
  [10.0, 5.5, 3, 30, 1050], [10.3, 40, 8, 0, 3600], [10.58, 62.8, 7.9, 0, 8600],
];

function camera(g: number) {
  let k = 0;
  while (k < KF.length - 2 && KF[k + 1][0] <= g) k++;
  const a = KF[k], b = KF[k + 1];
  const d = b[0] - a[0];
  const t = easeInOut(range(g, a[0] + 0.15 * d, Math.max(a[0] + 0.3 * d, b[0] - 0.05)));
  const [ax, ay] = P(a[1], a[2], a[3]);
  const [bx, by] = P(b[1], b[2], b[3]);
  const dist = Math.hypot(bx - ax, by - ay);
  const bump = clamp(dist / (a[4] + b[4]) - 0.6, 0, 1.6);
  const w = Math.exp(Math.log(a[4]) + (Math.log(b[4]) - Math.log(a[4])) * t) * (1 + bump * Math.sin(Math.PI * t));
  return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, w };
}

/** strengths (8) and weaknesses (9): a big stat pin at each visited place */
const STAT_AT: [number, number, number][][] = [
  [[30.5, 7, 60], [37.3, 2.8, 140], [114, 3, 120], [92.5, 17.5, 70], [79.2, 13, 110]],
  [[79.2, 13, 110], [95, 7.5, 50], [46, 4, 160], [51, -1.5, 110], [95, 2, 280]],
];
const BEATS = [0.02, 0.2, 0.38, 0.56, 0.74];

const GroundM = memo(Ground);

export default function MapStage({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const { t, lang } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const g = useG(0.002);

  useEffect(
    () =>
      subscribeG((gg) => {
        const svg = svgRef.current, box = boxRef.current;
        if (!svg || !box) return;
        const W = box.clientWidth || 1, H = box.clientHeight || 1;
        const c = camera(gg);
        const vw = c.w * (mobile ? 0.5 : W < 1200 ? 0.85 : 1);
        const vh = (vw * H) / W;
        const fx = mobile ? 0.5 : 0.66, fy = mobile ? 0.27 : 0.52;
        svg.setAttribute("viewBox", `${(c.x - vw * fx).toFixed(1)} ${(c.y - vh * fy).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
      }),
    [mobile],
  );

  const ch = Math.floor(g);
  const stat = (ch === 8 || ch === 9) && (() => {
    const loc = g - ch;
    let k = 0;
    BEATS.forEach((b, i) => {
      if (loc >= b - 0.04) k = i;
    });
    const on = smooth(range(loc, BEATS[k] - 0.04, BEATS[k] + 0.02)) * (1 - smooth(range(loc, 0.93, 0.99)));
    const item = t.scenes.cards[ch === 8 ? "strengths" : "weaknesses"][k];
    const [i, j, z] = STAT_AT[ch - 8][k];
    const [x, y] = P(i, j, z);
    return { x, y, on, item, good: ch === 8 };
  })();

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden" style={{ background: K.sea }}>
      <svg ref={svgRef} className="h-full w-full" viewBox="-400 -400 1600 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label={t.chapters[clamp(ch, 0, t.chapters.length - 1)].figure}>
        <defs>
          <pattern id="waves" width="120" height="60" patternUnits="userSpaceOnUse">
            <path d="M0,30 q15,-8 30,0 t30,0" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" />
            <path d="M60,55 q15,-8 30,0 t30,0" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.5" />
          </pattern>
        </defs>
        <rect x={-3000} y={-2000} width={12000} height={8000} fill={K.sea} />
        <GroundM reduced={reduced} />
        <Districts g={g} t={t} reduced={reduced} vi={lang === "vi"} />
        {stat && stat.on > 0.01 && (
          <g transform={`translate(${stat.x},${stat.y}) scale(${0.85 + 0.15 * stat.on})`} opacity={stat.on}>
            <Pin x={0} y={0} text={stat.item.stat} sub={stat.item.title} fs={30} color={stat.good ? K.usdcDark : K.red} bg={stat.good ? "#ffffff" : "#fff6f4"} />
          </g>
        )}
      </svg>
    </div>
  );
}
