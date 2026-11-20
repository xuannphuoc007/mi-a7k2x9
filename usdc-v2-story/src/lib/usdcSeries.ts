/** USDC supply helpers (billions of dollars) and number formatting. */
import { SUPPLY, SUPPLY_NEWS, DATA_END } from "@/data/coins/usdc/series";

export { DATA_END, SUPPLY, SUPPLY_NEWS };
export const SERIES: [number, number][] = [...SUPPLY, ...SUPPLY_NEWS].sort((a, b) => a[0] - b[0]);
export const FIRST_T = SERIES[0][0];
export const LAST_T = SERIES[SERIES.length - 1][0];

function search(arr: [number, number][], t: number) {
  let lo = 0;
  let hi = arr.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (arr[m][0] <= t) lo = m;
    else hi = m;
  }
  return lo;
}

/** linearly interpolated supply (billions) at decimal year t */
export function supplyAt(t: number): number {
  if (t <= FIRST_T) return SERIES[0][1];
  if (t >= LAST_T) return SERIES[SERIES.length - 1][1];
  const i = search(SERIES, t);
  const [t0, p0] = SERIES[i];
  const [t1, p1] = SERIES[i + 1];
  const f = (t - t0) / (t1 - t0 || 1);
  return p0 + (p1 - p0) * f;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtDate(t: number, lang: "en" | "vi", day = true) {
  const y = Math.floor(t);
  const ms = Date.UTC(y, 0, 1) + (t - y) * (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1));
  const d = new Date(ms);
  const m = d.getUTCMonth();
  if (lang === "vi") return day ? `${d.getUTCDate()}/${m + 1}/${y}` : `${m + 1}/${y}`;
  return day ? `${d.getUTCDate()} ${MONTHS[m]} ${y}` : `${MONTHS[m]} ${y}`;
}
export function num(n: number, locale = "en-US", d = 0) {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}
/** "$184B" / "184 tỷ USD" style */
export function bn(n: number, lang: "en" | "vi", d = 0) {
  const s = num(n, lang === "vi" ? "vi-VN" : "en-US", d);
  return lang === "vi" ? `${s} tỷ` : `$${s}B`;
}
