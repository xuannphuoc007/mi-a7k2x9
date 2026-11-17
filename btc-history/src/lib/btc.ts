/** Data helpers for the Bitcoin history: price lookup, paths, supply schedule, drawdowns, SHA-256. */
import { PRICE, PRICE_NEWS, HASHRATE } from "@/data/coins/btc/series";
import { GENESIS_T, HALVINGS } from "@/data/coins/btc/events";

/** weekly closes + key extremes (Coin Metrics) followed by dated news points */
export const SERIES: [number, number][] = [...PRICE, ...PRICE_NEWS].sort((a, b) => a[0] - b[0]);
export const FIRST_T = SERIES[0][0];
export const LAST_T = SERIES[SERIES.length - 1][0];
export const LAST_PRICE = SERIES[SERIES.length - 1][1];
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

/** log-interpolated price at decimal year t; null before the first market price */
export function priceAt(t: number): number | null {
  if (t < FIRST_T) return null;
  if (t >= LAST_T) return LAST_PRICE;
  const i = search(SERIES, t);
  const [t0, p0] = SERIES[i];
  const [t1, p1] = SERIES[i + 1];
  const f = (t - t0) / (t1 - t0 || 1);
  return Math.exp(Math.log(p0) + (Math.log(p1) - Math.log(p0)) * f);
}

export function hashAt(t: number): number {
  if (t <= HASHRATE[0][0]) return HASHRATE[0][1];
  const last = HASHRATE[HASHRATE.length - 1];
  if (t >= last[0]) return last[1];
  const i = search(HASHRATE, t);
  const [t0, h0] = HASHRATE[i];
  const [t1, h1] = HASHRATE[i + 1];
  return h0 + ((h1 - h0) * (t - t0)) / (t1 - t0);
}

/** max price in a time window (for linear scale) */
export function maxIn(t0: number, t1: number) {
  let m = 0;
  for (const [t, p] of SERIES) if (t >= t0 && t <= t1 && p > m) m = p;
  const e = priceAt(t1);
  if (e && e > m) m = e;
  return m || 1;
}
export function minIn(t0: number, t1: number) {
  let m = Infinity;
  for (const [t, p] of SERIES) if (t >= t0 && t <= t1 && p < m) m = p;
  return Number.isFinite(m) ? m : 0.01;
}

const f4 = (n: number) => Math.round(n * 10000) / 10000;

/** price path in (year, log10 price) data space */
export const LOG_PATH = "M" + SERIES.map(([t, p]) => `${f4(t)},${f4(Math.log10(p))}`).join("L");
/** price path in (year, price/1000) data space — thousands keep numbers small */
export const LIN_PATH = "M" + SERIES.map(([t, p]) => `${f4(t)},${f4(p / 1000)}`).join("L");
/** areas closed far below the visible range */
export const LOG_AREA = LOG_PATH + `L${f4(LAST_T)},-6L${f4(FIRST_T)},-6Z`;
export const LIN_AREA = LIN_PATH + `L${f4(LAST_T)},-1L${f4(FIRST_T)},-1Z`;

/** drawdown from the running all-time high, as a fraction (0 … −0.94) */
export const DD: [number, number][] = (() => {
  let m = 0;
  return SERIES.map(([t, p]) => {
    m = Math.max(m, p);
    return [t, p / m - 1] as [number, number];
  });
})();
export const DD_PATH = "M" + DD.map(([t, d]) => `${f4(t)},${f4(d * 100)}`).join("L");
export const DD_AREA = DD_PATH + `L${f4(LAST_T)},0L${f4(FIRST_T)},0Z`;
export function ddAt(t: number): number {
  if (t < FIRST_T) return 0;
  if (t >= LAST_T) return DD[DD.length - 1][1];
  const i = search(DD, t);
  const [t0, a] = DD[i];
  const [t1, b] = DD[i + 1];
  return a + ((b - a) * (t - t0)) / (t1 - t0);
}

/** hashrate path in (year, log10 TH/s) */
export const HASH_PATH = "M" + HASHRATE.map(([t, h]) => `${f4(t)},${f4(Math.log10(h))}`).join("L");

/* ───────────── supply schedule ───────────── */
export const HALVING_TIMES = [GENESIS_T, ...HALVINGS.map((h) => h.t)];
/** estimated future halvings every ~4 years from the 2028 estimate */
for (let k = 0; k < 30; k++) HALVING_TIMES.push(2028.3 + 4 * k);
export const ERA_BLOCKS = 210000;

export function eraAt(t: number) {
  let e = 0;
  while (e + 1 < HALVING_TIMES.length && t >= HALVING_TIMES[e + 1]) e++;
  return e;
}
export function rewardAt(t: number) {
  if (t < GENESIS_T) return 0;
  return 50 / 2 ** eraAt(t);
}
/** coins in existence at t (block-schedule approximation, ≈ within 0.1% of the real count) */
export function supplyAt(t: number) {
  if (t < GENESIS_T) return 0;
  let s = 0;
  for (let e = 0; e + 1 < HALVING_TIMES.length; e++) {
    const a = HALVING_TIMES[e];
    const b = HALVING_TIMES[e + 1];
    const r = 50 / 2 ** e;
    if (t >= b) s += ERA_BLOCKS * r;
    else {
      s += ERA_BLOCKS * r * ((t - a) / (b - a));
      break;
    }
  }
  return Math.min(21e6, s);
}
export const SUPPLY_PATH = (() => {
  const pts: string[] = [];
  for (let t = GENESIS_T; t <= 2142; t += 0.1) pts.push(`${f4(t)},${f4(supplyAt(t) / 1e6)}`);
  return "M" + pts.join("L");
})();

/* ───────────── crash cycles ───────────── */
export type Cycle = { id: string; peakT: number; peak: number; lowT: number; low: number; recoverT: number | null; fall: number };
function cycle(id: string, a: number, b: number): Cycle {
  let peakT = a;
  let peak = 0;
  for (const [t, p] of SERIES) if (t >= a && t <= b && p > peak) [peakT, peak] = [t, p];
  let lowT = peakT;
  let low = peak;
  let recoverT: number | null = null;
  for (const [t, p] of SERIES) {
    if (t <= peakT) continue;
    if (recoverT === null && p >= peak && t > lowT) {
      recoverT = t;
      break;
    }
    if (p < low) [lowT, low] = [t, p];
  }
  return { id, peakT, peak, lowT, low, recoverT, fall: low / peak - 1 };
}
export const CYCLES: Cycle[] = [
  cycle("2011", 2011.3, 2011.6),
  cycle("2013", 2013.8, 2014.1),
  cycle("2017", 2017.8, 2018.1),
  cycle("2021", 2021.8, 2021.95),
  cycle("2025", 2025.7, 2025.8),
];

/* ───────────── formatting ───────────── */
export function money(n: number, locale = "en-US", compact = false) {
  if (!Number.isFinite(n)) return "—";
  if (compact && Math.abs(n) >= 1e4) {
    return "$" + new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: n >= 1e9 ? 2 : 1 }).format(n);
  }
  const d = n < 0.1 ? 4 : n < 10 ? 2 : 0;
  return "$" + new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}

const MONTHS = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  vi: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
};
export function dateOf(t: number) {
  const y = Math.floor(t);
  const start = Date.UTC(y, 0, 1);
  const end = Date.UTC(y + 1, 0, 1);
  return new Date(start + (t - y) * (end - start));
}
export function fmtDate(t: number, lang: "en" | "vi", withDay = true) {
  const d = dateOf(t);
  const m = d.getUTCMonth();
  if (lang === "vi") return withDay ? `${d.getUTCDate()}/${m + 1}/${d.getUTCFullYear()}` : `${m + 1}/${d.getUTCFullYear()}`;
  return withDay ? `${d.getUTCDate()} ${MONTHS.en[m]} ${d.getUTCFullYear()}` : `${MONTHS.en[m]} ${d.getUTCFullYear()}`;
}
export function fmtMonth(t: number, lang: "en" | "vi") {
  const d = dateOf(t);
  return `${MONTHS[lang][d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`;
}

/* ───────────── SHA-256 (sync, for the mining toy) ───────────── */
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);
const W = new Uint32Array(64);
const enc = new TextEncoder();
export function sha256hex(msg: string): string {
  const bytes = enc.encode(msg);
  const l = bytes.length;
  const n = (((l + 9 + 63) >> 6) << 6);
  const buf = new Uint8Array(n);
  buf.set(bytes);
  buf[l] = 0x80;
  const bits = l * 8;
  buf[n - 4] = (bits >>> 24) & 255;
  buf[n - 3] = (bits >>> 16) & 255;
  buf[n - 2] = (bits >>> 8) & 255;
  buf[n - 1] = bits & 255;
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a, h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
  for (let o = 0; o < n; o += 64) {
    for (let i = 0; i < 16; i++) W[i] = (buf[o + i * 4] << 24) | (buf[o + i * 4 + 1] << 16) | (buf[o + i * 4 + 2] << 8) | buf[o + i * 4 + 3];
    for (let i = 16; i < 64; i++) {
      const a = W[i - 15], b = W[i - 2];
      const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
      const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let i = 0; i < 64; i++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + W[i]) | 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const mj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + mj) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
  }
  return [h0, h1, h2, h3, h4, h5, h6, h7].map((x) => (x >>> 0).toString(16).padStart(8, "0")).join("");
}
