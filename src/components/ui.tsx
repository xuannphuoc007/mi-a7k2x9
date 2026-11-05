import clsx from 'clsx'
import { AlertTriangle, Database, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Quality } from '../types/snapshot'
import { fmtChange, toneOf } from '../utils/format'

export function Card({ title, subtitle, right, children, className, pad = true }: {
  title?: ReactNode; subtitle?: ReactNode; right?: ReactNode; children: ReactNode; className?: string; pad?: boolean
}) {
  return (
    <section className={clsx('panel fade-in', className)}>
      {(title || right) && (
        <header className="flex items-start justify-between gap-3 px-4 pt-3.5 pb-2">
          <div className="min-w-0">
            {title && <h3 className="text-[13px] font-semibold tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </header>
      )}
      <div className={clsx(pad && 'px-4 pb-4', !title && pad && 'pt-4')}>{children}</div>
    </section>
  )
}

const QUALITY: Record<Quality, { label: string; cls: string; tip: string }> = {
  ok: { label: 'OK', cls: 'text-up border-up/30 bg-up/10', tip: 'Dữ liệu hợp lệ, trong ngưỡng độ mới' },
  stale: { label: 'Cũ', cls: 'text-warn border-warn/30 bg-warn/10', tip: 'Dữ liệu quá ngưỡng độ mới cấu hình' },
  missing: { label: 'Chưa có', cls: 'text-muted border-line bg-panel2', tip: 'Nguồn chưa cung cấp chỉ số này' },
  error: { label: 'Lỗi', cls: 'text-down border-down/30 bg-down/10', tip: 'Nguồn lỗi khi thu thập' },
  manual: { label: 'Nhập tay', cls: 'text-accent border-accent/30 bg-accent/10', tip: 'Giá trị nhập tay trong config/manual_inputs.json' },
  warning: { label: 'Cảnh báo', cls: 'text-warn border-warn/30 bg-warn/10', tip: 'Ngoài khoảng hợp lý hoặc lệch giữa các nguồn' },
}

export function QualityBadge({ q }: { q: Quality }) {
  const c = QUALITY[q] ?? QUALITY.missing
  return (
    <span title={c.tip} className={clsx('inline-flex items-center rounded border px-1.5 py-px text-[10px] font-medium', c.cls)}>
      {c.label}
    </span>
  )
}

export function Badge({ children, tone = 'neutral', title }: { children: ReactNode; tone?: 'neutral' | 'up' | 'down' | 'warn' | 'accent'; title?: string }) {
  const cls = {
    neutral: 'text-muted border-line bg-panel2',
    up: 'text-up border-up/30 bg-up/10',
    down: 'text-down border-down/30 bg-down/10',
    warn: 'text-warn border-warn/30 bg-warn/10',
    accent: 'text-accent border-accent/30 bg-accent/10',
  }[tone]
  return <span title={title} className={clsx('inline-flex items-center gap-1 rounded border px-1.5 py-px text-[11px] font-medium', cls)}>{children}</span>
}

export function Change({ v, unit = '%', className, label }: { v: number | null | undefined; unit?: string; className?: string; label?: string }) {
  const t = toneOf(v)
  return (
    <span className={clsx('num text-xs', t === 'up' && 'text-up', t === 'down' && 'text-down', t === 'flat' && 'text-muted', className)}>
      {label && <span className="text-muted font-sans mr-1">{label}</span>}
      {fmtChange(v, unit)}
    </span>
  )
}

export function Segmented<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-md border border-line bg-panel2 p-0.5 no-print">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={clsx('px-2.5 py-1 text-xs rounded font-medium transition-colors',
            value === o.value ? 'bg-panel text-fg shadow-sm' : 'text-muted hover:text-fg')}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />
}

export function EmptyState({ title, children, icon = 'data' }: { title: string; children?: ReactNode; icon?: 'data' | 'warn' }) {
  const I = icon === 'warn' ? AlertTriangle : Database
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4 gap-2">
      <I className="h-5 w-5 text-muted" />
      <p className="text-sm font-medium">{title}</p>
      {children && <div className="text-xs text-muted max-w-md leading-relaxed">{children}</div>}
    </div>
  )
}

export function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <div className={clsx('flex gap-2 rounded-md border px-3 py-2 text-xs leading-relaxed',
      tone === 'warn' ? 'border-warn/30 bg-warn/5 text-fg' : 'border-line bg-panel2 text-muted')}>
      {tone === 'warn' ? <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-warn" /> : <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
      <div>{children}</div>
    </div>
  )
}

export function PageHeader({ title, desc, right }: { title: string; desc?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {desc && <p className="text-xs text-muted mt-1 max-w-3xl leading-relaxed">{desc}</p>}
      </div>
      {right}
    </div>
  )
}

export function RiskPill({ risk }: { risk: 'low' | 'medium' | 'high' | 'na' }) {
  const map = {
    low: ['Thấp', 'up'], medium: ['Trung bình', 'warn'], high: ['Cao', 'down'], na: ['Chưa có dữ liệu', 'neutral'],
  } as const
  const [l, t] = map[risk]
  return <Badge tone={t}>{l}</Badge>
}
