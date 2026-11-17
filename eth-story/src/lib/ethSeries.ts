/** Price, supply and fee helpers for the Journey and Economics chapters. */
import { PRICE, PRICE_NEWS, SUPPLY, FEES, MERGE_T, DATA_END } from "@/data/coins/eth/series";

export { MERGE_T, DATA_END, SUPPLY, FEES };
export const SERIES: [number, number][] = [...PRICE, ...PRICE_NEWS].sort((a, b) => a[0] - b[0]);
export const FIRST_T = SERIES[0][0];
export const LAST_T = SERIES[SERIES.length - 1][0];
export const NEWS_FROM = PRICE_NEWS[0][0];

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

/** log-interpolated price at decimal year t (null before the first price) */
export function priceAt(t: number): number | null {
  if (t < FIRST_T) return null;
  if (t >= LAST_T) return SERIES[SERIES.length - 1][1];
  const i = search(SERIES, t);
  const [t0, p0] = SERIES[i];
  const [t1, p1] = SERIES[i + 1];
  const f = (t - t0) / (t1 - t0 || 1);
  return Math.exp(Math.log(p0) + (Math.log(p1) - Math.log(p0)) * f);
}

/** linear supply (millions) at t, clamped to the series */
export function supplyAt(t: number): number {
  const S = SUPPLY;
  if (t <= S[0][0]) return S[0][1];
  if (t >= S[S.length - 1][0]) return S[S.length - 1][1];
  const i = search(S, t);
  const [t0, a] = S[i];
  const [t1, b] = S[i + 1];
  return a + ((b - a) * (t - t0)) / (t1 - t0 || 1);
}

const f4 = (n: number) => Math.round(n * 10000) / 10000;
/** price path in (year, log10 price) */
export const PRICE_LOG_PATH = "M" + PRICE.map(([t, p]) => `${f4(t)},${f4(Math.log10(p))}`).join("L");
/** news-reported tail, starting from the last Coin Metrics point */
export const NEWS_LOG_PATH = "M" + [PRICE[PRICE.length - 1], ...PRICE_NEWS].map(([t, p]) => `${f4(t)},${f4(Math.log10(p))}`).join("L");
export const PRICE_LOG_AREA = PRICE_LOG_PATH + `L${f4(PRICE[PRICE.length - 1][0])},-4L${f4(PRICE[0][0])},-4Z`;

/** supply path in (year, millions) */
export const SUPPLY_PATH = "M" + SUPPLY.map(([t, s]) => `${f4(t)},${f4(s)}`).join("L");
/** fees path in (year, log10 ETH/day) */
export const FEES_LOG_PATH = "M" + FEES.filter((f) => f[1] > 0).map(([t, f]) => `${f4(t)},${f4(Math.log10(f))}`).join("L");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtDate(t: number, lang: "en" | "vi", day = true) {
  const y = Math.floor(t);
  const ms = Date.UTC(y, 0, 1) + (t - y) * (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1));
  const d = new Date(ms);
  const m = d.getUTCMonth();
  if (lang === "vi") return day ? `${d.getUTCDate()}/${m + 1}/${y}` : `${m + 1}/${y}`;
  return day ? `${d.getUTCDate()} ${MONTHS[m]} ${y}` : `${MONTHS[m]} ${y}`;
}
export function usd(n: number, locale = "en-US", digits?: number) {
  const d = digits ?? (n < 0.1 ? 4 : n < 10 ? 2 : 0);
  return "$" + new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}
export function num(n: number, locale = "en-US", d = 0) {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}
