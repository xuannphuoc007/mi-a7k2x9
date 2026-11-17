import { createStore } from "@/lib/store";
import type { CategoryId } from "@/data/coins/xrp/anatomy";

export const explorer = createStore({
  selected: -1 as number,
  category: null as CategoryId | null,
  yaw: 0,
  pitch: 0,
  zoom: 1,
  hovered: -1 as number,
});

export function resetExplorer() {
  explorer.set({ selected: -1, category: null, yaw: 0, pitch: 0, zoom: 1, hovered: -1 });
}
