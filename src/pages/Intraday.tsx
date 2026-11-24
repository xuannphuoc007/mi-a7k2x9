import clsx from 'clsx'
import { useState } from 'react'
import { LazyCandle, LazySeries } from '../charts/lazy'
import BandGauge from '../components/BandGauge'
import P2PIntraday from '../components/P2PIntraday'
import { Card, EmptyState, PageHeader } from '../components/ui'
import { useData } from '../hooks/useData'
import type { Candle } from '../types/snapshot'
import { fmtNum } from '../utils/format'

const dmy = (d: string) => d.split('-').reverse().join('/')
const pct = (v: number, digits = 2) => `${v >= 0 ? '+' : ''}${fmtNum(v, digits)}%`
const stamp = (t: number) =>
  new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000))
const dayTs = (date: string, hour = 0) => Date.parse(`${date}T${String(hour).padStart(2, '0')}:00:00Z`) / 1000
const RANGES: [number, string][] = [[30, '1 tháng'], [90, '3 tháng'], [180, '6 tháng'], [365, '1 năm']]
const tone = (v: number) => (v > 0 ? 'text-up' : v < 0 ? 'text-down' : undefined)

function Stat({ label, value, sub, className }: { label: string; value: string; sub?: string; className?: string }) {
  return (
    <div className="border-t border-line pt-2.5">
      <div className="label">{label}</div>
      <div className={clsx('num text-[21px] font-semibold leading-tight mt-1', className)}>{value}</div>
      {sub && <div className="text-[13px] text-muted">{sub}</div>}
    </div>
  )
}

export default function IntradayPage() {
  const { snap, latest: latestData } = useData()
  const [pick, setPick] = useState<string | null>(null)
  const [range, setRange] = useState<number>(30)
  if (!snap) return null

  const band = snap.tables.usdvnd_ticks?.band_pct ?? 0.3
  // Nến ngày: toàn bộ từ Investing.com (file CSV nhập tay, các ngày sau file dựng từ điểm giá Investing)
  const daily = latestData?.candles?.usdvnd_market?.['1d'] ?? []
  if (daily.length === 0) {
    return (
      <div className="space-y-9">
        <PageHeader title="USD/VND" desc="Biến động theo ngày." />
        <EmptyState title="Chưa có dữ liệu">Chưa có nến USD/VND. Cần file CSV Investing (config/investing_usdvnd_daily.csv).</EmptyState>
        <P2PIntraday data={snap.tables.p2p_intraday} />
      </div>
    )
  }
  const dayOf = (t: number) => new Date(t * 1000).toISOString().slice(0, 10)
  const allBars = daily.map((c) => ({ date: dayOf(c.time), open: c.open, high: c.high, low: c.low, close: c.close }))
  // Khoảng xem: tính theo số ngày lịch lùi từ nến cuối cùng
  const endMs = Date.parse(allBars[allBars.length - 1].date)
  const bars = allBars.filter((b) => Date.parse(b.date) > endMs - range * 86400000)
  const rangeLabel = RANGES.find(([d]) => d === range)?.[1] ?? ''
  const o2cOf = (b: { open: number; close: number }) => (b.close / b.open - 1) * 100
  const lastBar = allBars[allBars.length - 1]
  const prevBar = allBars.length > 1 ? allBars[allBars.length - 2] : null
  const o2c = o2cOf(lastBar)
  // Ngày cuối cùng là hôm nay thì nến chưa đóng: "đóng" lúc này chỉ là giá tại lần lấy gần nhất
  const forming = lastBar.date >= snap.date
  const vsPrevBar = prevBar ? (lastBar.close / prevBar.close - 1) * 100 : null
  const outDays = bars.filter((b) => Math.abs(o2cOf(b)) > band)

  const candles: Candle[] = bars.map((b) => ({ time: dayTs(b.date), open: b.open, high: b.high, low: b.low, close: b.close, volume: 0 }))
  const f0 = (v: number) => fmtNum(v, 0)
  const barDetails = Object.fromEntries(bars.map((b) => [dayTs(b.date, 12), [
    { label: 'Giá mở', value: f0(b.open) }, { label: 'Giá đóng', value: f0(b.close) },
    { label: 'Cao nhất', value: f0(b.high) }, { label: 'Thấp nhất', value: f0(b.low) },
  ]]))
  const o2cBars = bars.map((b) => [dayTs(b.date, 12), o2cOf(b)] as [number, number])

  // Điểm giá Investing mỗi lần web cập nhật, gom theo ngày giờ Việt Nam
  const vnDay = (t: number) => new Date(t * 1000).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
  const tickDays = new Map<string, [number, number][]>()
  for (const k of snap.tables.usdvnd_ticks?.ticks ?? []) {
    const d = vnDay(k.t)
    tickDays.set(d, [...(tickDays.get(d) ?? []), [k.t, k.v]])
  }
  const dateList = [...tickDays.keys()].sort()
  const day = pick && dateList.includes(pick) ? pick : dateList[dateList.length - 1]
  const ticks = day ? tickDays.get(day) : undefined
  const lastAt = snap.tables.usdvnd_ticks?.ticks.length ? Math.max(...snap.tables.usdvnd_ticks.ticks.map((k) => k.t)) : null
  // Chế độ Investing: mốc là giá mở của nến ngày đó (file Investing; hôm nay = đóng hôm trước)
  const tOpen = ticks ? (allBars.find((b) => b.date === day)?.open ?? ticks[0][1]) : null
  const tVals = ticks?.map(([, v]) => v) ?? []
  const tLast = tVals.length ? tVals[tVals.length - 1] : null
  const tDev = (v: number) => (v / (tOpen as number) - 1) * 100
  const tFlat = (v: number) => (ticks ?? []).map(([t]) => [t, v] as [number, number])

  return (
    <div className="space-y-9">
      <PageHeader title="USD/VND" desc="Biến động theo ngày, so với giá mở cửa." />

      <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-4">
        <Stat label="Giá mới nhất" value={fmtNum(lastBar.close, 0)} sub={`${dmy(lastBar.date)}${forming ? ', tạm thời' : ''}`} />
        <Stat label="So với đóng cửa hôm trước" value={vsPrevBar === null ? '–' : pct(vsPrevBar)} className={vsPrevBar === null ? undefined : tone(vsPrevBar)}
          sub={prevBar ? `${fmtNum(prevBar.close, 0)} → ${fmtNum(lastBar.close, 0)}` : undefined} />
        <Stat label={forming ? 'Mở → hiện tại (chưa đóng)' : 'Mở → đóng'} value={pct(o2c)} className={tone(o2c)} sub={`${fmtNum(lastBar.open, 0)} → ${fmtNum(lastBar.close, 0)}`} />
        <Stat label={`Ngày vượt ±${fmtNum(band, 1)}% (${rangeLabel})`} value={`${outDays.length} / ${bars.length}`} className={outDays.length ? 'text-warn' : undefined}
          sub={outDays.length ? outDays.map((d) => dmy(d.date).slice(0, 5)).join(', ') : undefined} />
      </div>

      <Card title="Nến theo ngày"
        right={
          <div className="flex gap-3 text-[14px]" role="group" aria-label="Khoảng thời gian">
            {RANGES.map(([d, label]) => (
              <button key={d} type="button" onClick={() => setRange(d)} aria-pressed={range === d}
                className={clsx('py-1 border-b-2 whitespace-nowrap', range === d ? 'border-fg font-semibold' : 'border-transparent text-muted hover:text-fg')}>{label}</button>
            ))}
          </div>
        }
        subtitle={`Mở, cao nhất, thấp nhất, đóng của từng ngày giao dịch.${forming ? ' Nến cuối cùng là hôm nay, chưa đóng: cao, thấp và giá đóng là số tại lần lấy gần nhất.' : ''}`}>
        <LazyCandle candles={candles} height={300} daily />
      </Card>

      <Card title="Mở → đóng mỗi ngày" subtitle={`Đường nét đứt là ±${fmtNum(band, 1)}%. Rê chuột vào từng cột để xem giá mở, đóng, cao nhất, thấp nhất.`}>
        <LazySeries type="bar" height={220} unit="%" lines={[{ key: 'o2c', label: 'Mở → đóng', points: o2cBars }]} refLines={[band, -band]} details={barDetails} />
      </Card>

      <Card title="Trong ngày"
        right={dateList.length > 1 ? (
          <select value={day} onChange={(e) => setPick(e.target.value)} aria-label="Chọn ngày"
            className="num bg-transparent border-b border-fg/40 hover:border-fg py-1 px-1 text-[14px] outline-none cursor-pointer">
            {[...dateList].reverse().map((d) => <option key={d} value={d} className="bg-panel text-fg">{dmy(d)}</option>)}
          </select>
        ) : undefined}
        subtitle={ticks && tOpen && tLast
          ? `Nguồn Investing.com, ${ticks.length} lần lấy giá. Mở ${fmtNum(tOpen, 0)} · hiện tại ${fmtNum(tLast, 0)} (${pct(tDev(tLast))}) · cao–thấp ${fmtNum(Math.max(...tVals), 0)}–${fmtNum(Math.min(...tVals), 0)}`
          : 'Nguồn Investing.com, mỗi lần web cập nhật lấy một điểm giá.'}>
        {ticks && tOpen && tLast ? (
          <div className="space-y-5">
            <BandGauge dev={tDev(tLast)} low={tDev(Math.min(...tVals))} high={tDev(Math.max(...tVals))} band={band} refLabel={`giá mở ${fmtNum(tOpen, 0)}`} />
            {ticks.length > 1 ? (
              <LazySeries timeAxis height={260} unit="VND" lines={[
                { key: 'price', label: 'USD/VND (Investing)', points: ticks, step: true },
                { key: 'hi', label: `+${fmtNum(band, 1)}%`, points: tFlat(tOpen * (1 + band / 100)), dashed: true, color: 'rgb(var(--warn))' },
                { key: 'open', label: 'Mở cửa', points: tFlat(tOpen), dashed: true, color: 'rgb(var(--muted))' },
                { key: 'lo', label: `−${fmtNum(band, 1)}%`, points: tFlat(tOpen * (1 - band / 100)), dashed: true, color: 'rgb(var(--warn))' },
              ]} />
            ) : (
              <p className="text-[13.5px] text-muted">Mới có một điểm giá. Biểu đồ sẽ hiện từ lần cập nhật kế tiếp.</p>
            )}
          </div>
        ) : (
          <EmptyState title="Chưa có điểm giá trong ngày">Điểm giá đầu tiên sẽ có sau lần cập nhật kế tiếp, nếu Investing.com trả giá.</EmptyState>
        )}
      </Card>

      <p className="text-[13px] text-muted">
        Nguồn: {latestData?.candles?.usdvnd_market?.source ?? 'Investing.com'} (giá tham chiếu quốc tế).{lastAt ? ` Điểm giá trong ngày mới nhất ${stamp(lastAt)}.` : ''}
      </p>

      <div className="border-t-2 border-fg" />
      <P2PIntraday data={snap.tables.p2p_intraday} />
    </div>
  )
}
