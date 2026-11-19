"use client";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { scrollState } from "@/lib/timeline";
import { xr } from "./shared";

/**
 * A label pinned to a point in the 3D world.
 * kind "sys"  → only in System (X-RAY) view: real entity + mechanism
 * kind "cine" → small cinematic caption, dims in System view
 */
export default function Tag({
  position,
  kind,
  k,
  text,
  vis,
  img,
  align = "left",
}: {
  position: [number, number, number];
  kind: "sys" | "cine";
  k?: string;
  text: string;
  vis: (u: number) => number;
  img?: string;
  align?: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFrame(() => {
    const el = ref.current;
    if (!el) return;
    const v = vis(scrollState.u);
    const o = kind === "sys" ? v * xr.v : v * (1 - 0.65 * xr.v);
    el.style.opacity = o.toFixed(3);
    el.style.visibility = o < 0.01 ? "hidden" : "visible";
  });
  return (
    <Html position={position} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div
        ref={ref}
        style={{ opacity: 0, transform: align === "right" ? "translate(-100%, -50%)" : "translate(0, -50%)" }}
        className={kind === "sys" ? "syslabel" : "cinelabel"}
      >
        {kind === "sys" ? (
          <>
            <div className="k">{k}</div>
            <b>{text}</b>
          </>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {img && <img src={img} alt="" width={18} height={18} style={{ borderRadius: 999 }} />}
            {text}
          </span>
        )}
      </div>
    </Html>
  );
}
