import { lazy, Suspense, type ComponentProps } from 'react'
import { Skeleton } from '../components/ui'

const Candle = lazy(() => import('./CandleChart'))
const Series = lazy(() => import('./SeriesChart'))
const Corr = lazy(() => import('./CorrelationMatrix'))

export function LazyCandle(p: ComponentProps<typeof Candle>) {
  return <Suspense fallback={<Skeleton className="w-full" />}><Candle {...p} /></Suspense>
}
export function LazySeries(p: ComponentProps<typeof Series>) {
  return <Suspense fallback={<Skeleton className="w-full h-[220px]" />}><Series {...p} /></Suspense>
}
export function LazyCorr(p: ComponentProps<typeof Corr>) {
  return <Suspense fallback={<Skeleton className="w-full h-64" />}><Corr {...p} /></Suspense>
}
