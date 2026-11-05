import clsx from 'clsx'
import type { ReactNode } from 'react'
import type { Metric } from '../types/snapshot'
import { fmtValue, unitLabel } from '../utils/format'
import { Change } from './ui'

/** Một con số kèm thay đổi. Chỉ số không có dữ liệu thì không hiển thị gì. */
export function MetricCard({ m, label, compact: cmp, digits, className, big }: {
  m: Metric | undefined; label?: string; compact?: boolean; digits?: number; className?: string; big?: boolean
}) {
  if (!m || m.value === null) return null
  const cu = m.change_unit ?? '%'
  return (
    <div className={clsx('border-t border-line pt-2.5 pb-1 min-w-0', className)} title={`Nguồn: ${m.source}${m.note ? `\n${m.note}` : ''}`}>
      <div className="label leading-snug">{label ?? m.label}</div>
      <div className="mt-1">
        <span className={clsx('num font-semibold', big ? 'text-[28px] leading-none' : 'text-[21px] leading-tight')}>
          {fmtValue(m, { compact: cmp, digits })}
        </span>
        <span className="text-[13px] text-muted ml-1">{unitLabel(m)}</span>
      </div>
      {(m.change_24h != null || m.change_7d != null || m.change_30d != null) && (
        <div className="flex flex-wrap gap-x-3 text-[13px] mt-1">
          {m.change_24h != null && <Change v={m.change_24h} unit={cu} label="24h" />}
          {m.change_7d != null && <Change v={m.change_7d} unit={cu} label="7 ngày" />}
          {m.change_30d != null && <Change v={m.change_30d} unit={cu} label="30 ngày" />}
        </div>
      )}
      {m.quality === 'stale' && <div className="text-[12.5px] text-warn mt-0.5">Số liệu cũ, nguồn chưa cập nhật</div>}
    </div>
  )
}

export function MetricGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('grid gap-x-6 gap-y-3 grid-cols-2 lg:grid-cols-4', className)}>{children}</div>
}
