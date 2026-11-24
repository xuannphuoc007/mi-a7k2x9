import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { LazyCandle, LazySeries } from '../charts/lazy'
import BandGauge from '../components/BandGauge'
import P2PIntraday from '../components/P2PIntraday'
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
        <P2PIntraday data={snap.tables.p2p_intraday} />
      </div>
    )
  }

  const band = all.band_pct
  const latest = days[days.length - 1]
  // Nến ngày: ưu tiên nến ngày thật (Yahoo, hôm nay thêm TradingView) vì các điểm trong ngày rất thưa, có tuần giá không đổi
  const daily = latestData?.candles?.usdvnd_market?.['1d'] ?? []
  const dayOf = (t: number) => new Date(t * 1000).toISOString().slice(0, 10)
  const allBars = daily.length
    ? daily.map((c) => ({ date: dayOf(c.time), open: c.open, high: c.high, low: c.low, close: c.close }))
    : days.map((d) => ({ date: d.date, open: d.open, high: d.high, low: d.low, close: d.last }))
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
  const dateList = [...new Set([...days.map((d) => d.date), ...tickDays.keys()])].sort()
  const day = pick && dateList.includes(pick) ? pick : dateList[dateList.length - 1]
  const ticks = tickDays.get(day)
  const sel = days.find((d) => d.date === day) ?? latest
  const flat = (v: number) => sel.points.map(([t]) => [t, v] as [number, number])
  const intraday = sel.points.map(([t, v]) => [t, v] as [number, number])
  const lastAt = Math.max(...all.days.map((d) => d.meta?.last_point_at ?? d.points[d.points.length - 1][0]))
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
        right={
          <select value={day} onChange={(e) => setPick(e.target.value)} aria-label="Chọn ngày"
            className="num bg-transparent border-b border-fg/40 hover:border-fg py-1 px-1 text-[14px] outline-none cursor-pointer">
            {[...dateList].reverse().map((d) => <option key={d} value={d} className="bg-panel text-fg">{dmy(d)}</option>)}
          </select>
        }
        subtitle={ticks && tOpen && tLast
          ? `Nguồn Investing.com, ${ticks.length} lần lấy giá. Mở ${fmtNum(tOpen, 0)} · hiện tại ${fmtNum(tLast, 0)} (${pct(tDev(tLast))}) · cao–thấp ${fmtNum(Math.max(...tVals), 0)}–${fmtNum(Math.min(...tVals), 0)}`
          : `Nguồn Yahoo/TradingView (chưa có điểm giá Investing cho ngày này). Mở ${fmtNum(sel.open, 0)} · đóng ${fmtNum(sel.last, 0)} (${pct(openToClose(sel))}) · cao–thấp ${fmtNum(highLow(sel), 2)}%`}>
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
        )}
      </Card>

      <p className="text-[13px] text-muted">
        Nguồn: {latestData?.candles?.usdvnd_market?.source ?? 'Investing.com, Yahoo Finance'} (giá tham chiếu quốc tế). Điểm giá trong ngày mới nhất {stamp(lastAt)}.
      </p>

      <div className="border-t-2 border-fg" />
      <P2PIntraday data={snap.tables.p2p_intraday} />
    </div>
  )
}
