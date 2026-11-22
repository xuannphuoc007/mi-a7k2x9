/** Prefix a /public path with the deploy base path (GitHub Pages sub-folder). */
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${p}`;
