import { MetricCard } from '../components/MetricCard'
import RegimeBanner from '../components/RegimeBanner'
import { Card, Note, PageHeader } from '../components/ui'
import { useData } from '../hooks/useData'
import { fmtTime } from '../utils/format'
import { closes, seriesVals } from '../utils/series'

export default function Overview() {
  const { snap, latest } = useData()
  if (!snap) return null
  const m = snap.metrics
  return (
    <div className="space-y-4">
      <PageHeader title="Tổng quan thị trường"
        desc={<>Ảnh chụp dữ liệu ngày <b className="num">{snap.date}</b>, tạo lúc {fmtTime(snap.generated_at)}. Mỗi chỉ số ghi rõ nguồn, thời điểm và trạng thái chất lượng.</>} />
      <RegimeBanner regime={snap.regime} />

      <div>
        <div className="label mb-2">Crypto</div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {['btc', 'eth', 'sol'].map((k) => (
            <MetricCard key={k} m={m[`${k}_price`]} spark={closes(latest, k.toUpperCase())} big />
          ))}
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 mt-3">
          {['btc', 'eth', 'sol'].map((k) => <MetricCard key={k} m={m[`${k}_volume_24h`]} />)}
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard m={m.total_mcap} />
        <MetricCard m={m.btc_dominance} />
        <MetricCard m={m.eth_dominance} />
        <MetricCard m={m.total_volume_24h} />
        <MetricCard m={m.stablecoin_supply_total} />
        <MetricCard m={m.fear_greed} digits={0} />
      </div>

      <Card title="Ngoại hối & USDT/VND" subtitle="Bốn loại giá khác bản chất: chỉ số USD, tỷ giá niêm yết ngân hàng (bid/ask), tỷ giá tham chiếu NHNN và giá thực thi P2P. Không so sánh trực tiếp như cùng một loại giá.">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard m={m.dxy} />
          <MetricCard m={m.dtwexbgs} spark={seriesVals(latest, 'dtwexbgs', 60)} />
          <MetricCard m={m.usdvnd_vcb_buy_transfer} />
          <MetricCard m={m.usdvnd_vcb_sell} />
          <MetricCard m={m.sbv_central_rate} />
          <MetricCard m={m.usdtvnd_p2p_bid} />
          <MetricCard m={m.usdtvnd_p2p_ask} />
          <MetricCard m={m.usdt_price} digits={4} />
          <MetricCard m={m.p2p_premium} />
          <MetricCard m={m.usdt_peg_dev} digits={3} />
        </div>
      </Card>

      {(snap.warnings?.length ?? 0) > 0 && (
        <Note tone="warn">
          {snap.warnings!.length} cảnh báo chất lượng dữ liệu trong lần cập nhật này (dữ liệu cũ, ngoài khoảng, lệch nguồn). Xem trang Data Sources & Status.
        </Note>
      )}
    </div>
  )
}
