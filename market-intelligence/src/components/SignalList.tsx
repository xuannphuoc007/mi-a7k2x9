import clsx from 'clsx'
import type { Signal } from '../types/snapshot'
import { EmptyState } from './ui'

const TYPE: Record<string, string> = { Fact: 'Fact', Analysis: 'Analysis', Hypothesis: 'Hypothesis' }

export default function SignalList({ items }: { items?: Signal[] }) {
  if (!items?.length) return <EmptyState title="Chưa có tín hiệu">Không đủ dữ liệu để rút ra tín hiệu theo quy tắc.</EmptyState>
  return (
    <ul className="divide-y divide-line/70">
      {items.map((s, i) => (
        <li key={i} className="py-2.5 flex gap-3 text-[13px] leading-relaxed">
          <span className={clsx('shrink-0 h-fit text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 border mt-0.5 w-[74px] text-center',
            s.type === 'Fact' ? 'text-accent border-accent/30 bg-accent/10' : s.type === 'Analysis' ? 'text-warn border-warn/30 bg-warn/10' : 'text-muted border-line')}>
            {TYPE[s.type] ?? s.type}
          </span>
          <div><span className="text-muted">{s.topic}: </span>{s.text}</div>
        </li>
      ))}
    </ul>
  )
}
