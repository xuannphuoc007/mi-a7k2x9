import { useState } from 'react'
import { LazyCandle, LazySeries } from '../charts/lazy'
import { MetricCard, MetricGrid } from '../components/MetricCard'
import { Card, PageHeader, Segmented } from '../components/ui'
import { useData } from '../hooks/useData'
import type { Snapshot } from '../types/snapshot'
import { fmtPct } from '../utils/format'
import { lastDays, RANGES } from '../utils/series'

const SYMS = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB'] as const
type Sym = (typeof SYMS)[number]
type Range = (typeof RANGES)[number]['value']

/** Chuỗi không có dữ liệu thì không hiển thị khung trống. */
function SeriesCard({ latest, k, title, range, type = 'area', zero }: {
  latest: Snapshot | null; k: string; title: string; range: number; type?: 'area' | 'bar'; zero?: boolean
}) {
  const s = latest?.series?.[k]
  const pts = lastDays(s?.points, Math.max(range, 7))
  if (!s || pts.length < 2) return null
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <LazySeries lines={[{ key: k, label: s.label, points: pts }]} unit={s.unit} type={type} zero={zero} />
    </div>
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
    <div className="space-y-9">
      <PageHeader title="Crypto" right={
        <div className="flex flex-wrap gap-x-7 gap-y-2">
          <Segmented value={sym} onChange={setSym} options={SYMS.map((s) => ({ value: s, label: s }))} />
          <Segmented value={range} onChange={setRange} options={RANGES.map((r) => ({ value: r.value, label: r.label }))} />
        </div>} />

      <MetricGrid>
        <MetricCard m={m[`${k}_price`]} label={`Giá ${sym}`} big />
        <MetricCard m={m[`${k}_mcap`]} label="Vốn hoá" />
        <MetricCard m={m[`${k}_volume_24h`]} label="Khối lượng 24h" />
        {vol?.vol_30d != null && (
          <div className="border-t border-line pt-2.5" title="Độ lệch chuẩn lợi suất ngày, quy đổi theo năm. Nguồn: Binance.">
            <div className="label">Độ biến động theo năm</div>
            <div className="num text-[21px] font-semibold leading-tight mt-1">{fmtPct(vol.vol_30d, 1, false)}</div>
            {vol.vol_7d != null && <div className="text-[13px] text-muted num">7 ngày gần đây: {fmtPct(vol.vol_7d, 1, false)}</div>}
          </div>
        )}
      </MetricGrid>

      {candles.length > 1 && (
        <Card title={`${sym}/USDT, nến ${days === 1 ? '1 giờ' : '1 ngày'}`} subtitle="Nguồn: Binance Spot. Biểu đồ luôn hiển thị dữ liệu mới nhất.">
          <LazyCandle candles={candles} height={380} />
        </Card>
      )}

      <Card title={`Phái sinh ${sym}`} subtitle="Số liệu của riêng sàn OKX, không đại diện toàn thị trường.">
        <MetricGrid className="mb-6">
          <MetricCard m={m[`${k}_oi`]} label="Hợp đồng mở (OI)" />
          <MetricCard m={m[`${k}_funding`]} label="Funding mỗi 8 giờ" digits={4} />
          <MetricCard m={m[`${k}_ls_ratio`]} label="Tỷ lệ tài khoản Long/Short" digits={2} />
          <MetricCard m={m[`${k}_basis`]} label="Chênh giá hợp đồng so với spot" digits={4} />
        </MetricGrid>
        <div className="grid gap-x-8 gap-y-7 lg:grid-cols-2">
          <SeriesCard latest={latest} k={`${k}_oi`} title="Hợp đồng mở" range={days} />
          <SeriesCard latest={latest} k={`${k}_funding`} title="Funding" range={days} zero />
          <SeriesCard latest={latest} k={`${k}_volume_delta`} title="Mua chủ động trừ bán chủ động" range={days} type="bar" />
          <SeriesCard latest={latest} k={`${k}_ls_ratio`} title="Tỷ lệ tài khoản Long/Short" range={days} />
        </div>
      </Card>

      <Card title="Toàn thị trường">
        <MetricGrid>
          <MetricCard m={m.total_mcap} label="Tổng vốn hoá" />
          <MetricCard m={m.total_volume_24h} label="Tổng khối lượng 24h" />
          <MetricCard m={m.btc_dominance} label="Tỷ trọng BTC" />
          <MetricCard m={m.eth_btc} label="ETH/BTC" digits={5} />
        </MetricGrid>
      </Card>
    </div>
  )
}
