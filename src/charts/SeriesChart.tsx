import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { compact, fmtNum } from '../utils/format'

export interface SeriesLine {
  key: string
  label: string
  points: [number, number][]
  color?: string
  dashed?: boolean
}

const COLORS = ['rgb(var(--accent))', 'rgb(var(--warn))', 'rgb(var(--up))', 'rgb(var(--muted))']

function merge(lines: SeriesLine[]) {
  const rows = new Map<number, Record<string, number>>()
  lines.forEach((l) => l.points.forEach(([t, v]) => {
    const r = rows.get(t) ?? { t }
    if (l.key === 't') throw new Error("SeriesLine.key không được là 't'")
    r[l.key] = v
    rows.set(t, r)
  }))
  return [...rows.values()].sort((a, b) => a.t - b.t)
}

const fmtAxis = (v: number) => (Math.abs(v) >= 1e4 ? compact(v) : fmtNum(v, Math.abs(v) < 1 ? 3 : 2))
const fmtDate = (t: number) => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit' }).format(new Date(t * 1000))
const fmtHour = (t: number) => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000))
const fmtFull = (t: number) => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000))

function TipBox({ active, payload, label, unit, labels }: {
  active?: boolean; payload?: { dataKey: string; value: number; color: string }[]; label?: number; unit: string; labels: Record<string, string>
}) {
  if (!active || !payload?.length || label === undefined) return null
  return (
    <div className="bg-panel border border-line px-2.5 py-1.5 text-xs">
      <div className="text-muted num mb-1">{fmtFull(label)}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2" style={{ background: p.color }} />
          <span className="text-muted">{labels[p.dataKey]}</span>
          <span className="num ml-auto">{fmtNum(p.value)} {unit}</span>
        </div>
      ))}
    </div>
  )
}

export default function SeriesChart({ lines, unit, height = 220, type = 'area', zero = false, timeAxis = false }: {
  lines: SeriesLine[]; unit: string; height?: number; type?: 'area' | 'bar'; zero?: boolean; timeAxis?: boolean
}) {
  const data = merge(lines)
  const spanDays = data.length ? (data[data.length - 1].t - data[0].t) / 86400 : 0
  const xFmt = timeAxis && spanDays <= 1.5 ? fmtHour : fmtDate
  const labels = Object.fromEntries(lines.map((l) => [l.key, l.label]))
  const axis = { stroke: 'rgb(var(--muted))', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', tickLine: false, axisLine: false }
  const grid = <CartesianGrid stroke="rgb(var(--line))" strokeOpacity={0.6} vertical={false} />
  const tip = <Tooltip content={<TipBox unit={unit} labels={labels} />} cursor={{ stroke: 'rgb(var(--line))' }} />
  if (type === 'bar') {
    const k = lines[0].key
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
          {grid}
          <XAxis dataKey="t" tickFormatter={fmtDate} {...axis} minTickGap={24} />
          <YAxis tickFormatter={fmtAxis} {...axis} width={52} />
          {tip}
          <ReferenceLine y={0} stroke="rgb(var(--muted))" strokeOpacity={0.5} />
          <Bar dataKey={k} isAnimationActive={false}>
            {data.map((d, i) => <Cell key={i} fill={(d[k] ?? 0) >= 0 ? 'rgb(var(--up))' : 'rgb(var(--down))'} fillOpacity={0.75} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
        <defs>
          {lines.map((l, i) => (
            <linearGradient key={l.key} id={`g-${l.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={l.color ?? COLORS[i]} stopOpacity={0.25} />
              <stop offset="100%" stopColor={l.color ?? COLORS[i]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {grid}
        <XAxis dataKey="t" tickFormatter={xFmt} {...axis} minTickGap={24} />
        <YAxis tickFormatter={fmtAxis} {...axis} width={52} domain={['auto', 'auto']} />
        {tip}
        {zero && <ReferenceLine y={0} stroke="rgb(var(--muted))" strokeOpacity={0.5} />}
        {lines.map((l, i) => (
          <Area key={l.key} type={l.dashed ? 'stepAfter' : timeAxis ? 'linear' : 'monotone'} dataKey={l.key} stroke={l.color ?? COLORS[i]}
            strokeWidth={l.dashed ? 1 : 1.6} strokeDasharray={l.dashed ? '5 4' : undefined}
            fill={l.dashed ? 'none' : `url(#g-${l.key})`} dot={false} isAnimationActive={false} connectNulls />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
