import clsx from 'clsx'
import { Gauge } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { Regime } from '../types/snapshot'
import { fmtNum } from '../utils/format'

const TONE: Record<string, string> = {
  'Risk-on': 'text-up border-up/40 bg-up/10',
  'Risk-off': 'text-down border-down/40 bg-down/10',
  Neutral: 'text-fg border-line bg-panel2',
  'High Volatility': 'text-warn border-warn/40 bg-warn/10',
  'Liquidity Stress': 'text-down border-down/40 bg-down/10',
}

export default function RegimeBanner({ regime }: { regime?: Regime }) {
  const loc = useLocation()
  if (!regime) return null
  const fired = regime.rules.filter((r) => r.triggered)
  return (
    <div className="panel p-4 flex flex-col md:flex-row md:items-center gap-4 fade-in">
      <div className="flex items-center gap-3">
        <Gauge className="h-5 w-5 text-accent" />
        <div>
          <div className="label">Market Regime (theo quy tắc định lượng)</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={clsx('rounded-md border px-2.5 py-1 text-sm font-semibold', TONE[regime.label] ?? TONE.Neutral)}>{regime.label}</span>
            <span className="num text-xs text-muted">Điểm {regime.score > 0 ? '+' : ''}{regime.score} · {regime.score_inputs} chỉ báo có dữ liệu</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-wrap gap-1.5 md:justify-end">
        {fired.slice(0, 6).map((r) => (
          <span key={r.group + r.name} className="text-[11px] border border-line rounded px-1.5 py-0.5 bg-panel2">
            <span className="text-muted">{r.name}: </span>
            <span className={clsx('num', r.effect > 0 ? 'text-up' : r.effect < 0 ? 'text-down' : 'text-warn')}>{fmtNum(r.value)}</span>
          </span>
        ))}
        <Link to={{ pathname: '/structure', search: loc.search }} className="text-[11px] text-accent hover:underline self-center ml-1">Chi tiết quy tắc →</Link>
      </div>
    </div>
  )
}
