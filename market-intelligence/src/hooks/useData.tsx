import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadHistory, loadIndex, loadLatest, NotFoundError } from '../services/data'
import type { DataIndex, Snapshot } from '../types/snapshot'

interface DataState {
  index: DataIndex | null
  /** Snapshot của ngày đang chọn (lịch sử là bản rút gọn, không có chuỗi/nến). */
  snap: Snapshot | null
  /** Snapshot mới nhất (đầy đủ, dùng cho biểu đồ). */
  latest: Snapshot | null
  selectedDate: string | null
  isLatest: boolean
  setDate: (d: string | null) => void
  loading: boolean
  error: string | null
  empty: boolean
}

const Ctx = createContext<DataState | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams()
  const [index, setIndex] = useState<DataIndex | null>(null)
  const [latest, setLatest] = useState<Snapshot | null>(null)
  const [hist, setHist] = useState<Snapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [empty, setEmpty] = useState(false)
  const selected = params.get('date')

  useEffect(() => {
    let alive = true
    Promise.all([loadIndex(), loadLatest()])
      .then(([i, l]) => {
        if (!alive) return
        setIndex(i)
        setLatest(l)
      })
      .catch((e) => {
        if (!alive) return
        if (e instanceof NotFoundError) setEmpty(true)
        else setError(String(e.message ?? e))
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!index || !selected || selected === latest?.date) {
      setHist(null)
      return
    }
    const entry = index.dates.find((d) => d.date === selected)
    if (!entry) {
      setError(`Không có dữ liệu cho ngày ${selected}`)
      return
    }
    setLoading(true)
    loadHistory(entry.file)
      .then((s) => {
        setHist(s)
        setError(null)
      })
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false))
  }, [index, selected, latest?.date])

  const value = useMemo<DataState>(() => {
    const isLatest = !selected || selected === latest?.date
    return {
      index,
      latest,
      snap: isLatest ? latest : hist,
      selectedDate: selected ?? latest?.date ?? null,
      isLatest,
      setDate: (d) => {
        const p = new URLSearchParams(params)
        if (!d || d === latest?.date) p.delete('date')
        else p.set('date', d)
        setParams(p)
      },
      loading,
      error,
      empty,
    }
  }, [index, latest, hist, selected, loading, error, empty, params, setParams])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useData(): DataState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useData ngoài DataProvider')
  return v
}
