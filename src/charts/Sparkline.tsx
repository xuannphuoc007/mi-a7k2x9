export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const w = 100
  const h = 30
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / span) * (h - 4) - 2}`)
  const up = data[data.length - 1] >= data[0]
  const color = up ? 'rgb(var(--up))' : 'rgb(var(--down))'
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden>
      <polyline points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill={color} opacity={0.08} stroke="none" />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
