import clsx from 'clsx'
import type { Metric } from '../types/snapshot'
import { fmtTime, fmtValue, unitLabel } from '../utils/format'
import { Sparkline } from '../charts/Sparkline'
import { Change, QualityBadge } from './ui'

const KIND: Record<string, string> = {
  bid: 'Bid', ask: 'Ask', mid: 'Mid', reference: 'Tham chiếu', executable: 'Giá khớp', index: 'Giá tổng hợp',
}

export function MetricCard({ m, spark, compact: cmp, digits, className, big }: {
  m: Metric | undefined; spark?: number[]; compact?: boolean; digits?: number; className?: string; big?: boolean
}) {
  if (!m) {
    return (
      <div className={clsx('panel p-3.5', className)}>
        <div className="label">Không có chỉ số</div>
      </div>
    )
  }
  const cu = m.change_unit ?? '%'
  const missing = m.value === null
  return (
    <div className={clsx('panel p-3.5 flex flex-col gap-2 fade-in min-w-0', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="label leading-snug">{m.label}</div>
        <div className="flex items-center gap-1 shrink-0">
          {m.kind && <span className="text-[10px] text-muted border border-line rounded px-1">{KIND[m.kind] ?? m.kind}</span>}
          <QualityBadge q={m.quality} />
        </div>
      </div>
      {missing ? (
        <div>
          <div className="num text-xl text-muted">—</div>
          <p className="text-[11px] text-muted leading-relaxed mt-1">{m.note ?? 'Chưa có dữ liệu'}</p>
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className={clsx('num font-semibold tracking-tight', big ? 'text-2xl' : 'text-xl')}>
                {fmtValue(m, { compact: cmp, digits })}
              </span>
              <span className="text-xs text-muted ml-1.5">{unitLabel(m)}</span>
            </div>
            {spark && spark.length > 2 && <Sparkline data={spark} className="h-8 w-24 shrink-0" />}
          </div>
          {(m.change_24h != null || m.change_7d != null || m.change_30d != null) && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {m.change_24h != null && <Change v={m.change_24h} unit={cu} label="24h" />}
              {m.change_7d != null && <Change v={m.change_7d} unit={cu} label="7D" />}
              {m.change_30d != null && <Change v={m.change_30d} unit={cu} label="30D" />}
            </div>
          )}
          {m.note && <p className="text-[11px] text-muted leading-relaxed line-clamp-2" title={m.note}>{m.note}</p>}
        </>
      )}
      <div className="mt-auto pt-1.5 border-t border-line/60 flex flex-wrap justify-between gap-x-2 text-[10.5px] text-muted">
        <span className="truncate" title={m.source}>{m.source}</span>
        <span className="num">{m.period && m.unit !== 'USD' && m.category?.startsWith('macro') ? `Kỳ ${m.period}` : fmtTime(m.timestamp)}</span>
      </div>
    </div>
  )
}
