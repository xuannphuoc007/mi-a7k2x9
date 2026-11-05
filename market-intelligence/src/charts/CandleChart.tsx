import { useEffect, useRef } from 'react'
import { ColorType, createChart, type IChartApi, type UTCTimestamp } from 'lightweight-charts'
import type { Candle } from '../types/snapshot'
import { cssColor, useTheme } from '../hooks/useTheme'

export default function CandleChart({ candles, height = 360 }: { candles: Candle[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

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
      timeScale: { borderColor: cssColor('line'), timeVisible: true, secondsVisible: false },
      crosshair: { mode: 1 },
      localization: {
        timeFormatter: (t: number) => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000)),
      },
    })
    const up = cssColor('up')
    const down = cssColor('down')
    const s = chart.addCandlestickSeries({ upColor: up, downColor: down, wickUpColor: up, wickDownColor: down, borderVisible: false })
    s.setData(candles.map((c) => ({ time: c.time as UTCTimestamp, open: c.open, high: c.high, low: c.low, close: c.close })))
    const v = chart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: 'vol' })
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
    v.setData(candles.map((c) => ({ time: c.time as UTCTimestamp, value: c.volume,
      color: c.close >= c.open ? cssColor('up', 0.35) : cssColor('down', 0.35) })))
    chart.timeScale().fitContent()
    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth }))
    ro.observe(el)
    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [candles, height, theme])

  return <div ref={ref} style={{ height }} className="w-full" />
}
