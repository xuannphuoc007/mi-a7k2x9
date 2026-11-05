import { useState } from 'react'
import { LazyCandle, LazySeries } from '../charts/lazy'
import { MetricCard } from '../components/MetricCard'
import { Card, EmptyState, Note, PageHeader, Segmented } from '../components/ui'
import { useData } from '../hooks/useData'
import type { Snapshot } from '../types/snapshot'
import { fmtNum, fmtPct } from '../utils/format'
import { lastDays, RANGES } from '../utils/series'

type Sym = 'BTC' | 'ETH' | 'SOL'
type Range = (typeof RANGES)[number]['value']

function SeriesCard({ latest, k, title, subtitle, range, type = 'area', zero }: {
  latest: Snapshot | null; k: string; title: string; subtitle?: string; range: number; type?: 'area' | 'bar'; zero?: boolean
}) {
  const s = latest?.series?.[k]
  const pts = lastDays(s?.points, Math.max(range, 7))
  return (
    <Card title={title} subtitle={subtitle ?? (s ? `${s.source} · ${s.unit}` : undefined)}>
      {pts.length > 1 ? (
        <LazySeries lines={[{ key: k, label: s!.label, points: pts }]} unit={s!.unit} type={type} zero={zero} />
      ) : (
        <EmptyState title="Chưa có dữ liệu">Nguồn không trả chuỗi này trong lần cập nhật gần nhất. Xem trang Data Sources & Status.</EmptyState>
      )}
    </Card>
  )
}

export default function Crypto() {
  const { snap, latest } = useData()
  const [sym, setSym] = useState<Sym>('BTC')
  const [range, setRange] = useState<Range>('30')
  if (!snap) return null
  const m = snap.metrics
  const k = sym.toLowerCase()
  const cs = latest?.candles?.[sym]
  const days = Number(range)
  const candles = days === 1 ? (cs?.['1h'] ?? []).slice(-24) : (cs?.['1d'] ?? []).slice(-days)
  const vol = snap.tables.volatility?.[sym]

  return (
    <div className="space-y-4">
      <PageHeader title="Crypto Market" desc="Spot từ CoinGecko (giá tổng hợp) và Binance (nến). Phái sinh từ OKX — một sàn, không đại diện toàn thị trường."
        right={<div className="flex flex-wrap gap-2">
          <Segmented value={sym} onChange={setSym} options={[{ value: 'BTC', label: 'BTC' }, { value: 'ETH', label: 'ETH' }, { value: 'SOL', label: 'SOL' }]} />
          <Segmented value={range} onChange={setRange} options={RANGES.map((r) => ({ value: r.value, label: r.label }))} />
        </div>} />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <MetricCard m={m[`${k}_price`]} big />
        <MetricCard m={m[`${k}_mcap`]} />
        <MetricCard m={m[`${k}_volume_24h`]} />
        <div className="panel p-3.5 flex flex-col gap-2">
          <div className="label">Realized Volatility (annualized)</div>
          <div className="flex gap-6">
            <div><div className="text-[11px] text-muted">7 ngày</div><div className="num text-xl font-semibold">{vol?.vol_7d != null ? fmtPct(vol.vol_7d, 1, false) : '—'}</div></div>
            <div><div className="text-[11px] text-muted">30 ngày</div><div className="num text-xl font-semibold">{vol?.vol_30d != null ? fmtPct(vol.vol_30d, 1, false) : '—'}</div></div>
          </div>
          <p className="text-[11px] text-muted mt-auto">Độ lệch chuẩn log return ngày × √365. Nguồn: {vol?.source ?? 'Binance Spot 1D'}</p>
        </div>
      </div>

      <Card title={`${sym}/USDT — nến ${days === 1 ? '1 giờ (24h)' : '1 ngày'}`} subtitle={cs ? `${cs.source} · volume = ${cs.volume_unit}` : undefined}>
        {candles.length > 1 ? <LazyCandle candles={candles} height={360} /> : <EmptyState title="Chưa có dữ liệu nến">Binance Spot không trả dữ liệu trong lần cập nhật gần nhất.</EmptyState>}
      </Card>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        <MetricCard m={m.btc_dominance} />
        <MetricCard m={m.eth_btc} digits={5} />
        <MetricCard m={m.fear_greed} digits={0} />
      </div>

      <div className="label pt-2">Phái sinh — {sym} (OKX)</div>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard m={m[`${k}_oi`]} />
        <MetricCard m={m[`${k}_funding`]} digits={4} />
        <MetricCard m={m[`${k}_ls_ratio`]} digits={3} />
        <MetricCard m={m[`${k}_basis`]} digits={4} />
        <MetricCard m={m[`${k}_volume_delta`]} />
        <MetricCard m={m[`${k}_liquidations`]} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <SeriesCard latest={latest} k={`${k}_oi`} title="Open Interest" range={days} />
        <SeriesCard latest={latest} k={`${k}_funding`} title="Funding Rate (realized, mỗi kỳ 8h)" range={days} zero />
        <SeriesCard latest={latest} k={`${k}_volume_delta`} title="Volume Delta theo ngày (taker buy − taker sell)" range={days} type="bar" />
        <SeriesCard latest={latest} k={`${k}_cvd`} title="CVD — cộng dồn Volume Delta" range={days} zero
          subtitle="Cộng dồn từ đầu cửa sổ dữ liệu OKX trả về (khoảng 30 ngày), dựa trên volume đã phân loại taker buy/sell" />
        <SeriesCard latest={latest} k={`${k}_ls_ratio`} title="Long/Short account ratio" range={days} />
        <Card title="Liquidation Long/Short">
          <EmptyState title="Chưa có dữ liệu">
            Dữ liệu thanh lý toàn thị trường cần nguồn tổng hợp (CoinGlass, API trả phí). OKX chỉ cung cấp mẫu lệnh thanh lý gần nhất của riêng sàn nên không dùng để tránh hiểu sai — dự kiến Phase 2.
          </EmptyState>
        </Card>
      </div>
      <Note>Khung 1D/7D/30D/90D áp dụng cho nến và chuỗi phái sinh. Các chuỗi phái sinh theo ngày luôn hiển thị tối thiểu 7 ngày. Funding hiện tại: {fmtNum(m[`${k}_funding`]?.value, 4)} %/kỳ.</Note>
    </div>
  )
}
