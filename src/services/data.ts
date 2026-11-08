import type { DataIndex, Snapshot } from '../types/snapshot'

const BASE = `${import.meta.env.BASE_URL}data/`

async function getJson<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (r.status === 404) throw new NotFoundError(path)
  if (!r.ok) throw new Error(`HTTP ${r.status} khi tải ${path}`)
  return (await r.json()) as T
}

export class NotFoundError extends Error {
  constructor(path: string) {
    super(`Không tìm thấy ${path}`)
  }
}

export const loadIndex = () => getJson<DataIndex>('index.json')
export const loadLatest = () => getJson<Snapshot>('latest.json')
export const loadHistory = (file: string) => getJson<Snapshot>(file)
