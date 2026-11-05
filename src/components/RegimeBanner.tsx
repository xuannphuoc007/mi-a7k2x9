import clsx from 'clsx'
import type { Regime } from '../types/snapshot'

const LABEL: Record<string, [string, string]> = {
  'Risk-on': ['Ưa rủi ro', 'text-up'],
  'Risk-off': ['Né rủi ro', 'text-down'],
  Neutral: ['Trung tính', 'text-fg'],
  'High Volatility': ['Biến động mạnh', 'text-warn'],
  'Liquidity Stress': ['Căng thanh khoản', 'text-down'],
}

export default function RegimeBanner({ regime, why }: { regime?: Regime; why?: string }) {
  if (!regime) return null
  const [vi, tone] = LABEL[regime.label] ?? [regime.label, 'text-fg']
  return (
    <div>
      <div className="label">Trạng thái thị trường</div>
      <div className={clsx('serif text-[24px] font-semibold leading-tight mt-0.5', tone)}>{vi}</div>
      {why && <p className="text-[13.5px] text-muted mt-1">{why}</p>}
    </div>
  )
}
