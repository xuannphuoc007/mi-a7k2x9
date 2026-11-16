import { describe, expect, it } from 'vitest'
import fixture from './__fixtures__/yahoo_0611_1011.json'
import { highLow, openToClose, runDynamic, runStatic, simulateDynamicDay, simulateStaticDay } from './requote'

/**
 * Dữ liệu thật đã lưu của hai ngày có biên độ lớn nhất (nến Yahoo có giá, bỏ mẫu TradingView).
 * Giá trị kỳ vọng được tính độc lập bằng một bản cài đặt Python riêng, không lấy từ chính hàm đang kiểm thử.
 * Cả hai ngày đều là một mức giá đứng yên rồi nhảy đúng một lần.
 */
const d0611 = { date: '2026-11-06', points: fixture['2026-11-06'] as [number, number][] }
const d1011 = { date: '2026-11-10', points: fixture['2026-11-10'] as [number, number][] }

describe('06/11: 25.680 → 25.580 (một lần giảm)', () => {
  it.each([10, 20, 30])('ngưỡng %i bps: đúng một lần Requote tại cú nhảy', (b) => {
    const r = simulateDynamicDay(d0611, b)
    expect(r.requotes).toBe(1)
    expect(r.events[0].from).toBe(25680)
    expect(r.events[0].price).toBe(25580)
    expect(r.events[0].devBps).toBeCloseTo(-38.94, 2) // độ lệch tính TRƯỚC khi báo lại
    expect(r.dev.maxBps).toBeCloseTo(38.94, 2)
    expect(r.dev.avgBps).toBeCloseTo(1.77, 2)
  })

  it('giá báo được reset về giá thị trường sau Requote, biên dời theo', () => {
    const r = simulateDynamicDay(d0611, 30)
    const i = r.quoted.findIndex(([, q]) => q === 25580)
    expect(i).toBeGreaterThan(0)
    expect(r.quoted.slice(0, i).every(([, q]) => q === 25680)).toBe(true)
    expect(r.quoted.slice(i).every(([, q]) => q === 25580)).toBe(true)
    expect(r.hi[i][1]).toBeCloseTo(25580 * 1.003, 6)
    expect(r.lo[i][1]).toBeCloseTo(25580 * 0.997, 6)
    expect(r.hi[i - 1][1]).toBeCloseTo(25680 * 1.003, 6) // biên cũ còn nguyên ngay trước đó
  })

  it('Static Band vẫn đếm điểm ngoài biên sau cú nhảy, Dynamic thì không', () => {
    const s = simulateStaticDay(d0611, 30)
    expect(s.outside).toBe(10)
    const dyn = simulateDynamicDay(d0611, 30)
    // sau Requote, độ lệch so với giá báo bằng 0 nên không còn điểm nào "ngoài biên"
    const i = dyn.quoted.findIndex(([, q]) => q === 25580)
    const after = d0611.points.slice(i).map(([, p], k) => Math.abs((p / dyn.quoted[i + k][1] - 1) * 1e4))
    expect(Math.max(...after)).toBe(0)
  })

  it('Open-to-Close khác High-Low: âm 0,39% so với 0,39% không dấu', () => {
    const day = { open: 25680, last: 25580, high: 25680, low: 25580 }
    expect(openToClose(day)).toBeCloseTo(-0.3894, 3)
    expect(highLow(day)).toBeCloseTo(0.3909, 3)
    expect(openToClose(day)).not.toBeCloseTo(highLow(day), 3)
  })
})

describe('10/11: 25.509 → 25.594 (một lần tăng)', () => {
  it.each([10, 20, 30])('ngưỡng %i bps: đúng một lần Requote', (b) => {
    const r = simulateDynamicDay(d1011, b)
    expect(r.requotes).toBe(1)
    expect(r.events[0]).toMatchObject({ from: 25509, price: 25594 })
    expect(r.events[0].devBps).toBeCloseTo(33.32, 2)
    expect(r.dev.avgBps).toBeCloseTo(1.59, 2)
  })

  it('Static: 9 điểm ngoài biên ±30 bps; Dynamic reset nên chỉ còn một lần báo lại', () => {
    expect(simulateStaticDay(d1011, 30).outside).toBe(9)
    expect(runDynamic([d1011], 30).summary.requotes).toBe(1)
  })

  it('Holding time của lần Requote đầu bằng thời gian từ mở cửa đến cú nhảy', () => {
    const r = simulateDynamicDay(d1011, 30)
    const jumpT = d1011.points.find(([, p]) => p === 25594)![0]
    expect(r.events[0].heldSec).toBe(jumpT - d1011.points[0][0])
  })
})

describe('Mỗi lần Requote reset đúng mốc tham chiếu (chuỗi nhiều lần)', () => {
  it('from của lần sau bằng price của lần trước, và độ lệch luôn từ ngưỡng trở lên', () => {
    const pts: [number, number][] = [100000, 100050, 100400, 100430, 100100, 99700, 99690, 100500].map((p, i) => [1000 + i * 60, p])
    const r = simulateDynamicDay({ date: 'x', points: pts }, 30)
    expect(r.events.length).toBeGreaterThanOrEqual(3)
    r.events.forEach((e, i) => {
      expect(e.from).toBe(i === 0 ? 100000 : r.events[i - 1].price)
      expect(Math.abs(e.devBps)).toBeGreaterThanOrEqual(30)
    })
    r.quoted.forEach(([t, q]) => {
      const last = [...r.events].reverse().find((e) => e.t <= t)
      expect(q).toBe(last ? last.price : 100000)
    })
  })
})

describe('Tổng hợp nhiều ngày', () => {
  it('cộng đúng số Requote và số lần giá thị trường đổi', () => {
    const { summary } = runDynamic([d0611, d1011], 30)
    expect(summary.days).toBe(2)
    expect(summary.requotes).toBe(2)
    expect(summary.marketChanges).toBe(2)
    expect(summary.dev.maxBps).toBeCloseTo(38.94, 2)
    expect(runStatic([d0611, d1011], 30).summary.outside).toBe(19)
  })
})
