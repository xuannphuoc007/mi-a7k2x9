import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { LazyCandle, LazySeries } from '../charts/lazy'
import { Card, EmptyState, PageHeader } from '../components/ui'
import { useData } from '../hooks/useData'
import type { Candle } from '../types/snapshot'
import { fmtNum } from '../utils/format'
import { highLow, openToClose } from '../utils/requote'

const dmy = (d: string) => d.split('-').reverse().join('/')
const pct = (v: number, digits = 2) => `${v >= 0 ? '+' : ''}${fmtNum(v, digits)}%`
const stamp = (t: number) =>
  new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000))
const dayTs = (date: string, hour = 0) => Date.parse(`${date}T${String(hour).padStart(2, '0')}:00:00Z`) / 1000
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
  const all = snap?.tables.intraday
  // Chỉ lấy ngày giao dịch (bỏ cuối tuần): cuối tuần thị trường nghỉ, giá đứng yên nên không vẽ
  const days = useMemo(
    () => (all ? all.days.filter((d) => !d.meta?.weekend).sort((a, b) => a.date.localeCompare(b.date)) : []),
    [all],
  )

  if (!snap) return null
  if (!all || days.length === 0) {
    return (
      <div className="space-y-9">
        <PageHeader title="USD/VND" desc="Biến động theo ngày." />
        <EmptyState title="Chưa có dữ liệu">Lần cập nhật kế tiếp sẽ có.</EmptyState>
      </div>
    )
  }

  const band = all.band_pct
  const latest = days[days.length - 1]
  // Nến ngày: ưu tiên nến ngày thật (Yahoo, hôm nay thêm TradingView) vì các điểm trong ngày rất thưa, có tuần giá không đổi
  const daily = (latestData?.candles?.usdvnd_market?.['1d'] ?? []).slice(-30)
  const dayOf = (t: number) => new Date(t * 1000).toISOString().slice(0, 10)
  const bars = daily.length
    ? daily.map((c) => ({ date: dayOf(c.time), open: c.open, high: c.high, low: c.low, close: c.close }))
    : days.map((d) => ({ date: d.date, open: d.open, high: d.high, low: d.low, close: d.last }))
  const o2cOf = (b: { open: number; close: number }) => (b.close / b.open - 1) * 100
  const lastBar = bars[bars.length - 1]
  const prevBar = bars.length > 1 ? bars[bars.length - 2] : null
  const o2c = o2cOf(lastBar)
  const vsPrevBar = prevBar ? (lastBar.close / prevBar.close - 1) * 100 : null
  const outDays = bars.filter((b) => Math.abs(o2cOf(b)) > band)

  const candles: Candle[] = bars.map((b) => ({ time: dayTs(b.date), open: b.open, high: b.high, low: b.low, close: b.close, volume: 0 }))
  const f0 = (v: number) => fmtNum(v, 0)
  const barDetails = Object.fromEntries(bars.map((b) => [dayTs(b.date, 12), [
    { label: 'Giá mở', value: f0(b.open) }, { label: 'Giá đóng', value: f0(b.close) },
    { label: 'Cao nhất', value: f0(b.high) }, { label: 'Thấp nhất', value: f0(b.low) },
  ]]))
  const o2cBars = bars.map((b) => [dayTs(b.date, 12), o2cOf(b)] as [number, number])

  const sel = days.find((d) => d.date === pick) ?? latest
  const flat = (v: number) => sel.points.map(([t]) => [t, v] as [number, number])
  const intraday = sel.points.map(([t, v]) => [t, v] as [number, number])
  const lastAt = Math.max(...all.days.map((d) => d.meta?.last_point_at ?? d.points[d.points.length - 1][0]))

  return (
    <div className="space-y-9">
      <PageHeader title="USD/VND" desc="Biến động theo ngày, so với giá mở cửa." />

      <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-4">
        <Stat label="Giá mới nhất" value={fmtNum(lastBar.close, 0)} sub={dmy(lastBar.date)} />
        <Stat label="So với đóng cửa hôm trước" value={vsPrevBar === null ? '–' : pct(vsPrevBar)} className={vsPrevBar === null ? undefined : tone(vsPrevBar)}
          sub={prevBar ? `${fmtNum(prevBar.close, 0)} → ${fmtNum(lastBar.close, 0)}` : undefined} />
        <Stat label="Mở → đóng hôm nay" value={pct(o2c)} className={tone(o2c)} sub={`${fmtNum(lastBar.open, 0)} → ${fmtNum(lastBar.close, 0)}`} />
        <Stat label={`Ngày vượt ±${fmtNum(band, 1)}%`} value={`${outDays.length} / ${bars.length}`} className={outDays.length ? 'text-warn' : undefined}
          sub={outDays.length ? outDays.map((d) => dmy(d.date).slice(0, 5)).join(', ') : undefined} />
      </div>

      <Card title="Nến theo ngày" subtitle="Mở, cao nhất, thấp nhất, đóng của từng ngày giao dịch.">
        <LazyCandle candles={candles} height={300} daily />
      </Card>

      <Card title="Mở → đóng mỗi ngày" subtitle={`Đường nét đứt là ±${fmtNum(band, 1)}%. Rê chuột vào từng cột để xem giá mở, đóng, cao nhất, thấp nhất.`}>
        <LazySeries type="bar" height={220} unit="%" lines={[{ key: 'o2c', label: 'Mở → đóng', points: o2cBars }]} refLines={[band, -band]} details={barDetails} />
      </Card>

      <Card title="Trong ngày"
        right={
          <select value={sel.date} onChange={(e) => setPick(e.target.value)} aria-label="Chọn ngày"
            className="num bg-transparent border-b border-fg/40 hover:border-fg py-1 px-1 text-[14px] outline-none cursor-pointer">
            {[...days].reverse().map((d) => <option key={d.date} value={d.date} className="bg-panel text-fg">{dmy(d.date)}</option>)}
          </select>
        }
        subtitle={`Mở ${fmtNum(sel.open, 0)} · đóng ${fmtNum(sel.last, 0)} (${pct(openToClose(sel))}) · cao–thấp ${fmtNum(highLow(sel), 2)}%`}>
        <LazySeries
          timeAxis
          height={260}
          unit="VND"
          lines={[
            { key: 'price', label: 'USD/VND', points: intraday },
            { key: 'hi', label: `+${fmtNum(band, 1)}%`, points: flat(sel.hi), dashed: true, color: 'rgb(var(--warn))' },
            { key: 'open', label: 'Mở cửa', points: flat(sel.open), dashed: true, color: 'rgb(var(--muted))' },
            { key: 'lo', label: `−${fmtNum(band, 1)}%`, points: flat(sel.lo), dashed: true, color: 'rgb(var(--warn))' },
          ]}
        />
      </Card>

      <p className="text-[13px] text-muted">
        Nguồn: Yahoo Finance, TradingView (giá tham chiếu quốc tế, không phải Investing.com). Điểm giá mới nhất {stamp(lastAt)}.
      </p>
    </div>
  )
}
