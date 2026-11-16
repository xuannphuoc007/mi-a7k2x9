/**
 * Mô phỏng Requote USD/VND trên các điểm giá đã lưu. Chạy hoàn toàn trên dữ liệu đầu vào,
 * không có số liệu ghi cứng. Mỗi ngày mô phỏng độc lập: mốc ban đầu là giá mở cửa của ngày đó.
 *
 * Dynamic Requote: giá báo giữ nguyên cho đến khi giá thị trường lệch từ ngưỡng (bps) so với giá báo
 * hiện tại trở lên, khi đó báo lại bằng giá thị trường (một lần Requote) và đường biên dời theo.
 * Static Band: giá báo là giá mở cửa cả ngày, đường biên cố định, chỉ đếm số điểm giá ra ngoài biên.
 *
 * Độ lệch đo tại từng điểm dữ liệu so với giá báo đang hiệu lực trước khi Requote, nên điểm kích hoạt
 * có độ lệch từ ngưỡng trở lên. Giữa hai điểm dữ liệu giá có thể đã lệch nhiều hơn mà ta không thấy.
 */

export type Pt = [number, number, string?]

export interface DayInput {
  date: string
  points: Pt[]
}

export interface RequoteEvent {
  t: number
  price: number
  /** Giá báo cũ trước khi báo lại. */
  from: number
  devBps: number
  /** Số giây giữ giá báo cũ. */
  heldSec: number
}

export interface HoldStats {
  count: number
  avgSec: number | null
  medianSec: number | null
  maxSec: number | null
}

export interface DevStats {
  avgBps: number | null
  maxBps: number | null
  avgVnd: number | null
  maxVnd: number | null
}

export interface DynamicDay {
  date: string
  thresholdBps: number
  points: number
  quoted: [number, number][]
  hi: [number, number][]
  lo: [number, number][]
  events: RequoteEvent[]
  requotes: number
  marketChanges: number
  dev: DevStats
  holds: number[]
}

export interface StaticDay {
  date: string
  thresholdBps: number
  points: number
  open: number
  lo: number
  hi: number
  outside: number
  firstExitT: number | null
  dev: DevStats
}

const bps = (p: number, ref: number) => (p / ref - 1) * 1e4

function devStats(devs: number[], refs: number[]): DevStats {
  if (!devs.length) return { avgBps: null, maxBps: null, avgVnd: null, maxVnd: null }
  const abs = devs.map(Math.abs)
  const vnd = abs.map((d, i) => (d / 1e4) * refs[i])
  const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length
  return { avgBps: mean(abs), maxBps: Math.max(...abs), avgVnd: mean(vnd), maxVnd: Math.max(...vnd) }
}

function sorted(points: Pt[]): [number, number][] {
  return points.map(([t, v]) => [t, v] as [number, number]).sort((a, b) => a[0] - b[0])
}

export function simulateDynamicDay(day: DayInput, thresholdBps: number): DynamicDay {
  const pts = sorted(day.points)
  const quoted: [number, number][] = []
  const hi: [number, number][] = []
  const lo: [number, number][] = []
  const events: RequoteEvent[] = []
  const devs: number[] = []
  const refs: number[] = []
  let anchor = pts.length ? pts[0][1] : 0
  let anchorT = pts.length ? pts[0][0] : 0
  let marketChanges = 0
  const k = thresholdBps / 1e4
  pts.forEach(([t, p], i) => {
    if (i > 0 && p !== pts[i - 1][1]) marketChanges++
    const dev = bps(p, anchor)
    devs.push(dev)
    refs.push(anchor)
    if (i > 0 && Math.abs(dev) >= thresholdBps) {
      events.push({ t, price: p, from: anchor, devBps: dev, heldSec: t - anchorT })
      anchor = p
      anchorT = t
    }
    quoted.push([t, anchor])
    hi.push([t, anchor * (1 + k)])
    lo.push([t, anchor * (1 - k)])
  })
  return {
    date: day.date, thresholdBps, points: pts.length, quoted, hi, lo, events, requotes: events.length,
    marketChanges, dev: devStats(devs, refs), holds: events.map((e) => e.heldSec),
  }
}

export function simulateStaticDay(day: DayInput, thresholdBps: number): StaticDay {
  const pts = sorted(day.points)
  const open = pts.length ? pts[0][1] : 0
  const k = thresholdBps / 1e4
  const devs = pts.map(([, p]) => bps(p, open))
  const outside = devs.filter((d) => Math.abs(d) > thresholdBps)
  const exit = pts.find(([, p]) => Math.abs(bps(p, open)) > thresholdBps)
  return {
    date: day.date, thresholdBps, points: pts.length, open, lo: open * (1 - k), hi: open * (1 + k),
    outside: outside.length, firstExitT: exit ? exit[0] : null, dev: devStats(devs, devs.map(() => open)),
  }
}

export interface DynamicSummary {
  thresholdBps: number
  days: number
  points: number
  requotes: number
  requotesPerDay: number | null
  marketChanges: number
  /** Tỷ lệ giảm số lần đổi giá: 1 - (số lần báo lại / số lần giá thị trường đổi). */
  changeReduction: number | null
  dev: DevStats
  hold: HoldStats
}

function median(a: number[]) {
  if (!a.length) return null
  const s = [...a].sort((x, y) => x - y)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export function summarizeDynamic(results: DynamicDay[], thresholdBps: number): DynamicSummary {
  const holds = results.flatMap((r) => r.holds)
  const points = results.reduce((s, r) => s + r.points, 0)
  const requotes = results.reduce((s, r) => s + r.requotes, 0)
  const marketChanges = results.reduce((s, r) => s + r.marketChanges, 0)
  // Độ lệch trung bình theo điểm dữ liệu: trung bình có trọng số của từng ngày
  const w = results.filter((r) => r.dev.avgBps !== null && r.points > 0)
  const wsum = w.reduce((s, r) => s + r.points, 0)
  const avgBps = wsum ? w.reduce((s, r) => s + (r.dev.avgBps as number) * r.points, 0) / wsum : null
  const avgVnd = wsum ? w.reduce((s, r) => s + (r.dev.avgVnd as number) * r.points, 0) / wsum : null
  const maxBps = w.length ? Math.max(...w.map((r) => r.dev.maxBps as number)) : null
  const maxVnd = w.length ? Math.max(...w.map((r) => r.dev.maxVnd as number)) : null
  return {
    thresholdBps, days: results.length, points, requotes,
    requotesPerDay: results.length ? requotes / results.length : null,
    marketChanges,
    changeReduction: marketChanges > 0 ? 1 - requotes / marketChanges : null,
    dev: { avgBps, maxBps, avgVnd, maxVnd },
    hold: {
      count: holds.length,
      avgSec: holds.length ? holds.reduce((s, x) => s + x, 0) / holds.length : null,
      medianSec: median(holds),
      maxSec: holds.length ? Math.max(...holds) : null,
    },
  }
}

export interface StaticSummary {
  thresholdBps: number
  days: number
  points: number
  outside: number
  outsideShare: number | null
  daysOutside: number
  dev: DevStats
}

export function summarizeStatic(results: StaticDay[], thresholdBps: number): StaticSummary {
  const points = results.reduce((s, r) => s + r.points, 0)
  const outside = results.reduce((s, r) => s + r.outside, 0)
  const w = results.filter((r) => r.dev.avgBps !== null && r.points > 0)
  const wsum = w.reduce((s, r) => s + r.points, 0)
  return {
    thresholdBps, days: results.length, points, outside, outsideShare: points ? outside / points : null,
    daysOutside: results.filter((r) => r.outside > 0).length,
    dev: {
      avgBps: wsum ? w.reduce((s, r) => s + (r.dev.avgBps as number) * r.points, 0) / wsum : null,
      maxBps: w.length ? Math.max(...w.map((r) => r.dev.maxBps as number)) : null,
      avgVnd: wsum ? w.reduce((s, r) => s + (r.dev.avgVnd as number) * r.points, 0) / wsum : null,
      maxVnd: w.length ? Math.max(...w.map((r) => r.dev.maxVnd as number)) : null,
    },
  }
}

export function runDynamic(days: DayInput[], thresholdBps: number) {
  const per = days.map((d) => simulateDynamicDay(d, thresholdBps))
  return { per, summary: summarizeDynamic(per, thresholdBps) }
}

export function runStatic(days: DayInput[], thresholdBps: number) {
  const per = days.map((d) => simulateStaticDay(d, thresholdBps))
  return { per, summary: summarizeStatic(per, thresholdBps) }
}

export const COMPARE_BPS = [10, 20, 30]

/** Mở cửa → đóng cửa và cao nhất → thấp nhất là hai số khác nhau. */
export function openToClose(day: { open: number; last: number }) {
  return (day.last / day.open - 1) * 100
}
export function highLow(day: { high: number; low: number }) {
  return (day.high / day.low - 1) * 100
}
