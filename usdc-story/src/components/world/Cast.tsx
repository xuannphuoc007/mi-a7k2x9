"use client";
import { band, START, LEN } from "@/lib/timeline";
import Person, { type Look, type Stop } from "./Person";
import { g, isMap } from "./shared";

/** Hà: sells handmade lanterns online from Hội An; Sarah: her customer in Australia. */
const HA: Look = { skin: "#f0c9a6", hair: "#1c1b22", top: "#1f9e8f", pants: "#2b3a55", shoes: "#6b4a33", bun: true, phone: true };
const SARAH: Look = { skin: "#f4d3bd", hair: "#e3c06c", top: "#d9534f", pants: "#3b4c63", shoes: "#2b2b2b", ponytail: true, phone: true };

const W = (id: Parameters<typeof g>[0], a: number, b: number) => (u: number) => band(u, g(id, a) - 0.08, g(id, a), g(id, b), g(id, b) + 0.08);
const deskWin = (u: number) => Math.max(W("s01", 0, 0.68)(u), u > g("s09", 0.76) ? 1 : 0, isMap(u) ? 1 : 0);

/** Hà at her workbench (scaled up so the floating note reads as a big hologram above the bench) */
function HaAtDesk() {
  return <Person look={HA} scale={2.3} stops={[{ u: 0, p: [6.0, -4.4, 1.6], ry: -1.05 }]} windows={(u) => (u < START.s01 + 0.02 ? 1 : deskWin(u))} />;
}

/** each place is held while she is visible; she only moves between places while hidden */
const hold = (a: number, b: number, id: Parameters<typeof g>[0], p: [number, number, number], ry: number): Stop[] => [
  { u: g(id, a), p, ry },
  { u: g(id, b), p, ry },
];
const haStops: Stop[] = [
  ...hold(0.2, 0.97, "s03", [2.2, -72, -33.5], 2.9), // in the vault, near the shared pool
  ...hold(0.1, 0.46, "s04", [-36.4, -63.7, -84.2], 0.7), // on the Base plaza
  ...hold(0.02, 0.38, "s05", [2.9, -63.7, -107.3], 0.32), // at the Ethereum pedestal
  ...hold(0.72, 0.98, "s05", [49.2, -63.7, -197.2], 0.56), // on Solana
  { u: g("s06", 0.05), p: [88, -63.8, -187], ry: -2.4 }, // walks onto the exchange floor
  ...hold(0.24, 0.64, "s06", [97.4, -63.8, -195.7], Math.PI),
  ...hold(0.06, 0.92, "s07", [143.6, -63.8, -254.8], 2.6), // control room
  ...hold(0.2, 0.97, "s08", [106.4, -63.8, -199.2], 2.5), // watching the board
  ...hold(0.01, 0.34, "s09", [103.4, -63.8, -190.4], -2.6), // redeeming through her phone
];
const haWin = (u: number) => Math.max(W("s03", 0.26, 0.95)(u), W("s04", 0.18, 0.44)(u), W("s05", 0.04, 0.36)(u), W("s05", 0.74, 0.97)(u), W("s06", 0.06, 0.62)(u), W("s07", 0.1, 0.9)(u), W("s08", 0.24, 0.96)(u), W("s09", 0.02, 0.32)(u));

const sarahStops: Stop[] = [
  { u: g("s02", 0.54), p: [27.5, -24, 13.2], ry: -2.4 },
  { u: g("s02", 0.64), p: [22.6, -24, 9.6], ry: Math.PI - 0.35 },
];

export default function Cast() {
  void LEN;
  return (
    <>
      <HaAtDesk />
      <Person look={HA} stops={haStops} windows={haWin} />
      <Person look={SARAH} stops={sarahStops} windows={W("s02", 0.5, 0.9)} />
    </>
  );
}
