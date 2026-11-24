import clsx from 'clsx'
import { fmtNum } from '../utils/format'

const pct = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${fmtNum(Math.abs(v), 2)}%`

/** Thanh biên ±band%: vùng trong biên, khoảng cao–thấp trong ngày, chấm là giá hiện tại. */
export default function BandGauge({ dev, low, high, band, refLabel }: {
  dev: number; low: number; high: number; band: number; refLabel: string
}) {
  const span = Math.max(band * 2, Math.abs(low), Math.abs(high), Math.abs(dev)) * 1.08
  const x = (v: number) => `${((v + span) / (2 * span)) * 100}%`
  const out = Math.abs(dev) > band
  const touched = high > band || low < -band
  return (
    <div>
      <div className="relative h-10 select-none" role="img"
        aria-label={`Hiện tại ${pct(dev)} so với ${refLabel}, cao nhất ${pct(high)}, thấp nhất ${pct(low)}, biên ±${band}%`}>
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-down/10" />
        <div className="absolute top-1/2 h-2 -translate-y-1/2 bg-panel2"
          style={{ left: x(-band), width: `calc(${x(band)} - ${x(-band)})` }} />
        <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-accent/45"
          style={{ left: x(low), width: `max(3px, calc(${x(high)} - ${x(low)}))` }} />
        {[-band, band].map((b) => (
          <div key={b} className="absolute top-1 bottom-1 border-l border-dashed border-warn" style={{ left: x(b) }} />
        ))}
        <div className="absolute top-1.5 bottom-1.5 w-px bg-muted" style={{ left: x(0) }} />
        <div className={clsx('absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-panel shadow',
          out ? 'bg-down' : 'bg-fg')} style={{ left: x(dev) }} />
      </div>
      <div className="relative h-4 text-[12px] text-muted num">
        <span className="absolute -translate-x-1/2" style={{ left: x(-band) }}>−{fmtNum(band, 1)}%</span>
        <span className="absolute -translate-x-1/2" style={{ left: x(0) }}>0</span>
        <span className="absolute -translate-x-1/2" style={{ left: x(band) }}>+{fmtNum(band, 1)}%</span>
      </div>
      <p className={clsx('text-[14px] mt-2', out ? 'text-down font-medium' : touched ? 'text-warn' : 'text-muted')}>
        Hiện tại <span className="num font-semibold">{pct(dev)}</span> so với {refLabel}
        {out ? ` — đang NGOÀI biên ±${fmtNum(band, 1)}%` : touched ? ` — trong biên, nhưng trong ngày đã chạm ngoài biên` : ` — trong biên ±${fmtNum(band, 1)}%`}.
        {' '}Khoảng trong ngày <span className="num">{pct(low)}</span> đến <span className="num">{pct(high)}</span>.
      </p>
    </div>
  )
}
