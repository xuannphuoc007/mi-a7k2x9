import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { EmptyState, Skeleton } from './components/ui'
import { DataProvider, useData } from './hooks/useData'
import { ThemeProvider } from './hooks/useTheme'
import Overview from './pages/Overview'

const Crypto = lazy(() => import('./pages/Crypto'))
const Stablecoin = lazy(() => import('./pages/Stablecoin'))
const Macro = lazy(() => import('./pages/Macro'))
const Structure = lazy(() => import('./pages/Structure'))
const Status = lazy(() => import('./pages/Status'))

function Loading() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-60" />
      <Skeleton className="h-20 w-full" />
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
    </div>
  )
}

function Pages() {
  const { snap, loading, error, empty } = useData()
  if (loading && !snap) return <Loading />
  if (empty) {
    return (
      <div className="panel">
        <EmptyState title="Chưa có dữ liệu">
          Hệ thống chưa chạy lần thu thập nào. Vào GitHub → Actions → “Daily data update” → Run workflow, chờ khoảng 3 phút rồi tải lại trang.
        </EmptyState>
      </div>
    )
  }
  if (error && !snap) {
    return <div className="panel"><EmptyState icon="warn" title="Không tải được dữ liệu">{error}</EmptyState></div>
  }
  return (
    <Suspense fallback={<Loading />}>
      {error && <div className="mb-3 text-xs text-down">{error}</div>}
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/stablecoin" element={<Stablecoin />} />
        <Route path="/macro" element={<Macro />} />
        <Route path="/structure" element={<Structure />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <DataProvider>
          <Layout>
            <Pages />
          </Layout>
        </DataProvider>
      </HashRouter>
    </ThemeProvider>
  )
}
