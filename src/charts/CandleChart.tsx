import { useEffect, useRef, useState } from 'react'
import { ColorType, createChart, type IChartApi, type UTCTimestamp } from 'lightweight-charts'
import type { Candle } from '../types/snapshot'
import { cssColor, useTheme } from '../hooks/useTheme'

export default function CandleChart({ candles, height = 360, daily = false }: { candles: Candle[]; height?: number; daily?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [hover, setHover] = useState<Candle | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const chart: IChartApi = createChart(el, {
      height,
      width: el.clientWidth,
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: cssColor('muted'),
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
      grid: { vertLines: { color: cssColor('line', 0.5) }, horzLines: { color: cssColor('line', 0.5) } },
      rightPriceScale: { borderColor: cssColor('line') },
      timeScale: { borderColor: cssColor('line'), timeVisible: !daily, secondsVisible: false },
      crosshair: { mode: 1 },
      localization: {
        timeFormatter: (t: number) => new Intl.DateTimeFormat('vi-VN', daily
          ? { timeZone: 'UTC', day: '2-digit', month: '2-digit' }
          : { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000)),
      },
    })
    const up = cssColor('up')
    const down = cssColor('down')
    const s = chart.addCandlestickSeries({ upColor: up, downColor: down, wickUpColor: up, wickDownColor: down, borderVisible: false })
    s.setData(candles.map((c) => ({ time: c.time as UTCTimestamp, open: c.open, high: c.high, low: c.low, close: c.close })))
    if (!daily) {
      const v = chart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: 'vol' })
      chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
      v.setData(candles.map((c) => ({ time: c.time as UTCTimestamp, value: c.volume,
        color: c.close >= c.open ? cssColor('up', 0.35) : cssColor('down', 0.35) })))
    }
    chart.subscribeCrosshairMove((param) => {
      const d = param.seriesData.get(s) as { open: number; high: number; low: number; close: number } | undefined
      if (!d || param.time === undefined) { setHover(null); return }
      setHover({ time: param.time as number, open: d.open, high: d.high, low: d.low, close: d.close, volume: 0 })
    })
    chart.timeScale().fitContent()
    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth }))
    ro.observe(el)
    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [candles, height, theme, daily])

  const shown = hover ?? (daily ? candles[candles.length - 1] : null)
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: v >= 1000 ? 0 : 2 }).format(v)
  const when = (t: number) => new Intl.DateTimeFormat('vi-VN', daily
    ? { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }
    : { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000))
  return (
    <div className="w-full">
      {shown && (
        <div className="num text-[12.5px] flex flex-wrap gap-x-4 gap-y-0.5 mb-1.5 min-h-[18px]">
          <span className="text-muted">{when(shown.time)}</span>
          <span><span className="text-muted">Mở </span>{fmt(shown.open)}</span>
          <span><span className="text-muted">Cao </span>{fmt(shown.high)}</span>
          <span><span className="text-muted">Thấp </span>{fmt(shown.low)}</span>
          <span className={shown.close >= shown.open ? 'text-up' : 'text-down'}><span className="text-muted">Đóng </span>{fmt(shown.close)}</span>
        </div>
      )}
      <div ref={ref} style={{ height }} className="w-full" />
    </div>
  )
}
