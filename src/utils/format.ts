import type { Metric } from '../types/snapshot'

const nf = (d: number) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: d, minimumFractionDigits: d })

export function compact(v: number): string {
  const a = Math.abs(v)
  if (a >= 1e12) return `${nf(2).format(v / 1e12)} T`
  if (a >= 1e9) return `${nf(2).format(v / 1e9)} B`
  if (a >= 1e6) return `${nf(2).format(v / 1e6)} M`
  if (a >= 1e3) return `${nf(1).format(v / 1e3)} K`
  return nf(2).format(v)
}

/** Số thập phân phù hợp theo độ lớn. */
export function smartDigits(v: number): number {
  const a = Math.abs(v)
  if (a >= 10000) return 0
  if (a >= 1) return 2
  if (a === 0) return 2
  if (a >= 0.01) return 4
  return 5
}

export function fmtNum(v: number | null | undefined, digits?: number): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—'
  return nf(digits ?? smartDigits(v)).format(v)
}

export function fmtValue(m: Metric | undefined, opts: { compact?: boolean; digits?: number } = {}): string {
  if (!m || m.value === null) return '—'
  if (opts.compact) return compact(m.value)
  if (m.unit === 'USD' && Math.abs(m.value) >= 1e7) return compact(m.value)
  return fmtNum(m.value, opts.digits)
}

export function fmtPct(v: number | null | undefined, digits = 2, sign = true): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—'
  const s = sign && v > 0 ? '+' : ''
  return `${s}${nf(digits).format(v)}%`
}

export function fmtChange(v: number | null | undefined, unit = '%'): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—'
  const s = v > 0 ? '+' : ''
  if (unit === '%') return `${s}${nf(2).format(v)}%`
  if (unit === 'bp') return `${s}${nf(0).format(v)} bp`
  return `${s}${nf(2).format(v)} ${unit}`
}

export function unitLabel(m: Metric): string {
  if (m.unit === 'USD' && m.value !== null && Math.abs(m.value) >= 1e7) return 'USD'
  return m.unit
}

export function fmtTime(iso: string | null | undefined, withDate = true): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const p = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit',
    ...(withDate ? { day: '2-digit', month: '2-digit', year: 'numeric' } : {}),
  }).format(d)
  return `${p} (UTC+7)`
}

export function fmtDateShort(ts: number): string {
  return new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit' })
    .format(new Date(ts * 1000))
}

export function ageHours(iso: string | null | undefined, now = Date.now()): number | null {
  if (!iso) return null
  const t = new Date(iso).getTime()
  return Number.isNaN(t) ? null : (now - t) / 3600000
}

export function toneOf(v: number | null | undefined): 'up' | 'down' | 'flat' {
  if (v === null || v === undefined || Math.abs(v) < 1e-9) return 'flat'
  return v > 0 ? 'up' : 'down'
}

export function toCsv(rows: (string | number | null | undefined)[][]): string {
  const esc = (c: string | number | null | undefined) => {
    const s = c === null || c === undefined ? '' : String(c)
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return '﻿' + rows.map((r) => r.map(esc).join(',')).join('\n')
}
