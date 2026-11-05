import type { Correlation } from '../types/snapshot'

function cellColor(r: number | null): string {
  if (r === null) return 'transparent'
  const a = Math.min(Math.abs(r), 1) * 0.85
  return r >= 0 ? `rgb(var(--accent) / ${a})` : `rgb(var(--down) / ${a})`
}

export default function CorrelationMatrix({ corr, window }: { corr: Correlation; window: string }) {
  const w = corr.windows[window]
  if (!w) return null
  const keys = corr.assets
  return (
    <div className="overflow-x-auto">
      <table className="text-xs border-separate border-spacing-0.5 min-w-full">
        <thead>
          <tr>
            <th />
            {keys.map((k) => (
              <th key={k} className="font-medium text-muted px-1 pb-1 align-bottom text-[10.5px] leading-tight min-w-[64px]">{corr.labels[k]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((a, i) => (
            <tr key={a}>
              <th className="text-left font-medium text-muted pr-2 whitespace-nowrap text-[10.5px]">{corr.labels[a]}</th>
              {keys.map((b, j) => {
                const r = w.matrix[i][j]
                const n = w.n[i][j]
                return (
                  <td key={b} title={`${corr.labels[a]} ↔ ${corr.labels[b]}: r = ${r ?? 'không đủ dữ liệu'} · n = ${n} quan sát`}
                    className="text-center rounded h-11 px-1 border border-line/60" style={{ background: cellColor(r) }}>
                    <div className="num font-semibold text-[12px]">{r === null ? '—' : r.toFixed(2)}</div>
                    <div className="num text-[9.5px] opacity-70">n={n}</div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
