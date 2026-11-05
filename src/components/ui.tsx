import clsx from 'clsx'
import { AlertTriangle, Database } from 'lucide-react'
import type { ReactNode } from 'react'
import { fmtChange, toneOf } from '../utils/format'

export function Card({ title, subtitle, right, children, className }: {
  title?: ReactNode; subtitle?: ReactNode; right?: ReactNode; children: ReactNode; className?: string
}) {
  return (
    <section className={clsx('panel pt-3', className)}>
      {(title || right) && (
        <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 mb-3">
          <div className="min-w-0">
            {title && <h2 className="serif text-[20px] font-semibold leading-tight">{title}</h2>}
            {subtitle && <p className="text-[13.5px] text-muted mt-1 max-w-3xl">{subtitle}</p>}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </header>
      )}
      {children}
    </section>
  )
}

export function Change({ v, unit = '%', className, label }: { v: number | null | undefined; unit?: string; className?: string; label?: string }) {
  const t = toneOf(v)
  return (
    <span className={clsx('num', t === 'up' && 'text-up', t === 'down' && 'text-down', t === 'flat' && 'text-muted', className)}>
      {label && <span className="text-muted mr-1">{label}</span>}
      {fmtChange(v, unit)}
    </span>
  )
}

export function Segmented<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex flex-wrap gap-3 no-print text-[14px]" role="group">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} aria-pressed={value === o.value}
          className={clsx('pb-0.5 border-b-2 num', value === o.value ? 'border-fg font-semibold' : 'border-transparent text-muted hover:text-fg')}>
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
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 gap-2">
      <I className="h-5 w-5 text-muted" />
      <p className="font-medium">{title}</p>
      {children && <div className="text-[14px] text-muted max-w-md">{children}</div>}
    </div>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-[13.5px] text-muted max-w-3xl">{children}</p>
}

export function PageHeader({ title, desc, right }: { title: string; desc?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="serif text-[30px] font-semibold leading-tight tracking-tight">{title}</h1>
        {desc && <p className="text-[15px] text-muted mt-1.5 max-w-3xl">{desc}</p>}
      </div>
      {right}
    </div>
  )
}
