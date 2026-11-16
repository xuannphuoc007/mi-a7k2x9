import { describe, expect, it } from 'vitest'
import { highLow, openToClose, runDynamic, runStatic, simulateDynamicDay, simulateStaticDay } from './requote'

const day = (prices: number[], step = 300) => ({
  date: '2026-11-10',
  points: prices.map((p, i) => [1_000_000 + i * step, p] as [number, number]),
})

describe('simulateDynamicDay', () => {
  it('không Requote khi giá nằm trong ngưỡng', () => {
    const r = simulateDynamicDay(day([100000, 100100, 99900, 100200]), 30)
    expect(r.requotes).toBe(0)
    expect(r.quoted.every(([, q]) => q === 100000)).toBe(true)
    expect(r.hi[0][1]).toBeCloseTo(100300, 6)
    expect(r.lo[0][1]).toBeCloseTo(99700, 6)
  })

  it('Requote khi vượt ngưỡng, biên dời theo giá báo mới', () => {
    // 100000 -> 100310 lệch 31 bps: báo lại 100310; sau đó 100500 chỉ lệch ~19 bps nên không báo lại
    const r = simulateDynamicDay(day([100000, 100310, 100500, 101000]), 30)
    expect(r.requotes).toBe(2)
    expect(r.events[0]).toMatchObject({ price: 100310, from: 100000, heldSec: 300 })
    expect(r.events[0].devBps).toBeCloseTo(31, 5)
    expect(r.quoted.map(([, q]) => q)).toEqual([100000, 100310, 100310, 101000])
    expect(r.hi[1][1]).toBeCloseTo(100310 * 1.003, 6)
    expect(r.holds).toEqual([300, 600])
  })

  it('đo độ lệch so với giá báo đang hiệu lực', () => {
    const r = simulateDynamicDay(day([100000, 100100, 100200]), 30)
    expect(r.dev.maxBps).toBeCloseTo(20, 5)
    expect(r.dev.avgBps).toBeCloseTo((0 + 10 + 20) / 3, 5)
    expect(r.dev.maxVnd).toBeCloseTo(200, 5)
  })

  it('ngưỡng nhỏ hơn thì Requote nhiều hơn', () => {
    const d = day([100000, 100120, 100260, 100380, 100500, 100650, 100800])
    const n = (bps: number) => simulateDynamicDay(d, bps).requotes
    expect(n(10)).toBeGreaterThanOrEqual(n(20))
    expect(n(20)).toBeGreaterThanOrEqual(n(30))
    expect(n(10)).toBeGreaterThan(n(30))
  })

  it('đếm số lần giá thị trường đổi và tỷ lệ giảm', () => {
    const { summary } = runDynamic([day([100000, 100010, 100020, 100030, 100040, 100400])], 30)
    expect(summary.marketChanges).toBe(5)
    expect(summary.requotes).toBe(1)
    expect(summary.changeReduction).toBeCloseTo(0.8, 6)
  })

  it('không lỗi khi không có điểm nào', () => {
    const r = simulateDynamicDay({ date: 'x', points: [] }, 30)
    expect(r.requotes).toBe(0)
    expect(r.dev.avgBps).toBeNull()
  })
})

describe('simulateStaticDay', () => {
  it('đếm điểm ngoài biên quanh giá mở cửa và thời điểm ra biên đầu tiên', () => {
    const r = simulateStaticDay(day([100000, 100200, 100400, 99600]), 30)
    expect(r.open).toBe(100000)
    expect(r.outside).toBe(2)
    expect(r.firstExitT).toBe(1_000_600)
    expect(r.hi).toBeCloseTo(100300, 6)
  })

  it('tổng hợp nhiều ngày', () => {
    const { summary } = runStatic([day([100000, 100400]), day([100000, 100100])], 30)
    expect(summary.days).toBe(2)
    expect(summary.outside).toBe(1)
    expect(summary.daysOutside).toBe(1)
    expect(summary.outsideShare).toBeCloseTo(0.25, 6)
  })
})

describe('Open-to-Close khác High-Low', () => {
  it('hai số khác nhau cho cùng một ngày', () => {
    const d = { open: 100, last: 100, high: 101, low: 99 }
    expect(openToClose(d)).toBe(0)
    expect(highLow(d)).toBeGreaterThan(1.9)
  })
})
