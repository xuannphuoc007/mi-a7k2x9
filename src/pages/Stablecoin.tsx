import clsx from 'clsx'
import { LazySeries } from '../charts/lazy'
import { MetricCard, MetricGrid } from '../components/MetricCard'
import { Card, PageHeader } from '../components/ui'
import { useData } from '../hooks/useData'
import { fmtNum } from '../utils/format'
import { lastDays } from '../utils/series'

const RISK = {
  low: ['Thấp', 'text-up'], medium: ['Trung bình', 'text-warn'], high: ['Cao', 'text-down'], na: ['', ''],
} as const

const RISK_LABEL: Record<string, [string, string]> = {
  usdt_vnd_spread: ['Chênh mua–bán USDT/VND', 'Chênh lệch càng lớn, chi phí giao dịch càng cao.'],
  p2p_premium: ['USDT cao hơn ngân hàng', 'Chênh lệch lớn cho thấy nhu cầu USDT trong nước đang căng.'],
  cross_exchange_spread: ['Chênh giá giữa các sàn', 'Chênh lệch lớn cho thấy thanh khoản bị phân mảnh.'],
  usdt_peg: ['USDT lệch khỏi 1 USD', 'Lệch càng xa càng đáng lo.'],
  usdt_inventory_risk: ['Tồn kho USDT', 'So với mức mục tiêu đã nhập.'],
}

export default function Stablecoin() {
  const { snap, latest } = useData()
  if (!snap) return null
  const m = snap.metrics
  const supply = latest?.series?.stablecoin_supply
  const risks = (snap.tables.risk ?? []).filter((r) => r.value !== null)

  return (
    <div className="space-y-9">
      <PageHeader title="Stablecoin" desc="Lượng stablecoin đang lưu hành tăng thường nghĩa là có thêm tiền sẵn sàng vào thị trường crypto, và ngược lại." />

      <MetricGrid>
        <MetricCard m={m.stablecoin_supply_total} label="Tổng lượng lưu hành" />
        <MetricCard m={m.usdt_supply} label="USDT đang lưu hành" />
        <MetricCard m={m.usdc_supply} label="USDC đang lưu hành" />
        <MetricCard m={m.usdt_price} label="Giá USDT" digits={4} />
        <MetricCard m={m.usdt_volume_24h} label="Khối lượng USDT 24h" />
        <MetricCard m={m.usdc_volume_24h} label="Khối lượng USDC 24h" />
      </MetricGrid>

      {supply && supply.points.length > 1 && (
        <Card title="Tổng lượng stablecoin 6 tháng qua" subtitle="Nguồn: DefiLlama">
          <LazySeries lines={[{ key: 's', label: supply.label, points: lastDays(supply.points, 180) }]} unit="USD" />
        </Card>
      )}

      {risks.length > 0 && (
        <Card title="Mức rủi ro hôm nay" subtitle="Tính theo ngưỡng cấu hình trong config/settings.json.">
          <div className="overflow-x-auto">
            <table className="table-news">
              <thead><tr><th>Chỉ báo</th><th>Hiện tại</th><th>Mức</th></tr></thead>
              <tbody>
                {risks.map((r) => {
                  const [label, why] = RISK_LABEL[r.key] ?? [r.label, r.note]
                  const [lv, tone] = RISK[r.risk]
                  return (
                    <tr key={r.key}>
                      <td className="!whitespace-normal min-w-[220px]">
                        <div className="font-semibold">{label}</div>
                        <div className="text-[13px] text-muted">{why}</div>
                      </td>
                      <td>{fmtNum(r.value, 2)}{r.unit === '%' ? '%' : ''}</td>
                      <td className={clsx('font-semibold', tone)}>{lv}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
