import type { Snapshot } from '../types/snapshot'

export function closes(s: Snapshot | null, sym: string, n = 30): number[] {
  const c = s?.candles?.[sym]?.['1d'] ?? []
  return c.slice(-n).map((k) => k.close)
}

export function seriesVals(s: Snapshot | null, key: string, n = 60): number[] {
  return (s?.series?.[key]?.points ?? []).slice(-n).map((p) => p[1])
}

export function lastDays(points: [number, number][] | undefined, days: number): [number, number][] {
  if (!points?.length) return []
  const end = points[points.length - 1][0]
  return points.filter((p) => p[0] >= end - days * 86400)
}

export const RANGES = [
  { value: '1', label: '1D' },
  { value: '7', label: '7D' },
  { value: '30', label: '30D' },
  { value: '90', label: '90D' },
] as const
