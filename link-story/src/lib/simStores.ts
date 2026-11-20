/** Shared UI state between the stage and the reading column. */
import { createStore } from "@/lib/store";

/** stage square size in CSS px (for scaling SVG text on small screens) */
export const stageStore = createStore({ px: 800 });
