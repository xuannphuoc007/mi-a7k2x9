/**
 * Camera choreography as a pure function of the story coordinate `g`
 * (plus explorer state in the finale). Keyframes are interpolated with
 * smoothstep so motion eases between beats yet stays exactly reversible.
 */
import { smooth, range, lerp } from "@/lib/store";

export type Pose = { pos: [number, number, number]; target: [number, number, number]; fov: number };

type Key = { g: number; pose: Pose };

/** Canonical front pose: the particle field is mapped to the SVG stage for this pose. */
export const CANONICAL: Pose = { pos: [0, 0, 8], target: [0, 0, 0], fov: 35 };

const keys: Key[] = [
  { g: 0.0, pose: { pos: [0.0, 0.25, 9.2], target: [0, 0, 0], fov: 35 } },
  { g: 0.2, pose: { pos: [0.0, 0.1, 7.0], target: [0, 0, 0], fov: 35 } }, // dolly in
  { g: 0.42, pose: { pos: [0.9, 1.2, 10.4], target: [0, 0, 0], fov: 36 } }, // orbit to 3/4 exploded view
  { g: 0.62, pose: { pos: [0.6, 0.8, 10.2], target: [0, 0, 0], fov: 36 } }, // dolly out as it dissolves
  { g: 0.9, pose: CANONICAL },
  { g: 1.2, pose: CANONICAL },
  // finale (chapter 11 = g 10..11)
  { g: 9.8, pose: { pos: [0, 0, 11], target: [0, 0, 0], fov: 35 } },
  { g: 10.3, pose: { pos: [-1.5, 0.8, 10], target: [0, 0, 0], fov: 35 } },
  { g: 10.6, pose: { pos: [0.9, 1.2, 10.6], target: [0, 0, 0], fov: 36 } }, // layers align
  { g: 10.8, pose: { pos: [0.0, 0.15, 7.8], target: [0, 0, 0], fov: 35 } }, // reassembled, front
  { g: 10.97, pose: { pos: [0.0, 1.5, 11.0], target: [0, -0.15, 0], fov: 35 } }, // explorer
];

export function cameraAt(g: number): Pose {
  if (g <= keys[0].g) return keys[0].pose;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (g >= a.g && g <= b.g) {
      const t = smooth(range(g, a.g, b.g));
      return {
        pos: [lerp(a.pose.pos[0], b.pose.pos[0], t), lerp(a.pose.pos[1], b.pose.pos[1], t), lerp(a.pose.pos[2], b.pose.pos[2], t)],
        target: [lerp(a.pose.target[0], b.pose.target[0], t), lerp(a.pose.target[1], b.pose.target[1], t), lerp(a.pose.target[2], b.pose.target[2], t)],
        fov: lerp(a.pose.fov, b.pose.fov, t),
      };
    }
  }
  return keys[keys.length - 1].pose;
}
