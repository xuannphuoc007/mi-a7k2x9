import { LazySeries } from '../charts/lazy'
import { MetricCard } from '../components/MetricCard'
import SignalList from '../components/SignalList'
import { Card, Change, EmptyState, Note, PageHeader, RiskPill } from '../components/ui'
import { useData } from '../hooks/useData'
import { compact, fmtNum, fmtPct, fmtTime } from '../utils/format'
import { lastDays } from '../utils/series'

export default function Stablecoin() {
  const { snap, latest } = useData()
  if (!snap) return null
  const m = snap.metrics
  const p2p = snap.tables.p2p
  const plats = Object.entries(p2p?.platforms ?? {})
  const supply = latest?.series?.stablecoin_supply

  return (
    <div className="space-y-4">
      <PageHeader title="Stablecoin & USDT/VND"
        desc="Phân biệt: circulating supply (lượng lưu hành, DefiLlama), market cap (giá × lưu hành, CoinGecko), volume giao dịch (khớp trên sàn trong 24h) — volume không phải giá trị settlement on-chain." />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <MetricCard m={m.usdt_supply} />
        <MetricCard m={m.usdc_supply} />
        <MetricCard m={m.usdt_mcap} />
        <MetricCard m={m.usdc_mcap} />
        <MetricCard m={m.stablecoin_supply_total} />
        <MetricCard m={m.usdt_volume_24h} />
        <MetricCard m={m.usdc_volume_24h} />
        <MetricCard m={m.usdt_peg_dev} digits={3} />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card title="Tổng cung stablecoin (USD-pegged)" subtitle={supply ? `${supply.source} · theo ngày` : undefined} className="lg:col-span-2">
          {supply?.points.length ? <LazySeries lines={[{ key: 's', label: supply.label, points: lastDays(supply.points, 180) }]} unit="USD" />
            : <EmptyState title="Chưa có dữ liệu" />}
        </Card>
        <Card title="Stablecoin Exchange Inflow / Outflow">
          <EmptyState title="Chưa có dữ liệu">Dòng nạp/rút stablecoin vào sàn cần dữ liệu on-chain có gắn nhãn ví sàn (CryptoQuant, Glassnode — trả phí). Không ước lượng thay thế.</EmptyState>
        </Card>
      </div>

      <Card title="USDT/VND — giá thực thi P2P theo quy mô giao dịch"
        subtitle="Ask = giá ta MUA USDT, Bid = giá ta BÁN USDT. Chỉ tính quảng cáo thoả hạn mức min/max, đủ lượng khả dụng, chuyển khoản ngân hàng và tiêu chí uy tín người đăng.">
        {!p2p?.enabled ? (
          <EmptyState title="Chưa có dữ liệu P2P" icon="warn">{p2p?.note ?? 'Collector P2P chưa chạy.'}</EmptyState>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              <MetricCard m={m.usdtvnd_p2p_bid} />
              <MetricCard m={m.usdtvnd_p2p_ask} />
              <MetricCard m={m.p2p_premium} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted">
                  <tr className="border-b border-line text-left">
                    <th className="py-2 pr-3 font-medium">Nền tảng</th><th className="pr-3 font-medium">Quy mô (VND)</th>
                    <th className="pr-3 font-medium text-right">Best bid</th><th className="pr-3 font-medium text-right">Best ask</th>
                    <th className="pr-3 font-medium text-right">Mid</th><th className="pr-3 font-medium text-right">Spread</th>
                    <th className="font-medium text-right">QC đủ ĐK (bid/ask)</th>
                  </tr>
                </thead>
                <tbody>
                  {plats.map(([name, p]) => p.error ? (
                    <tr key={name} className="border-b border-line/60"><td className="py-2 pr-3 capitalize">{name}</td><td colSpan={6} className="text-down">Lỗi: {p.error}</td></tr>
                  ) : p.by_size?.map((r, i) => (
                    <tr key={name + r.size_vnd} className="border-b border-line/60">
                      <td className="py-2 pr-3 capitalize">{i === 0 ? name : ''}</td>
                      <td className="num pr-3">{compact(r.size_vnd)}</td>
                      <td className="num pr-3 text-right">{fmtNum(r.bid, 0)}</td>
                      <td className="num pr-3 text-right">{fmtNum(r.ask, 0)}</td>
                      <td className="num pr-3 text-right">{fmtNum(r.mid, 0)}</td>
                      <td className="num pr-3 text-right">{fmtPct(r.spread_pct, 3, false)}</td>
                      <td className="num text-right">{r.bid_count}/{r.ask_count}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-xs text-muted">
              {plats.filter(([, p]) => !p.error).map(([name, p]) => (
                <div key={name} className="panel bg-panel2 px-3 py-2">
                  <b className="capitalize text-fg">{name}</b>: độ sâu trong biên ±{String(p2p.config?.depth_band_pct ?? 0.5)}% — phía mua <span className="num text-fg">{fmtNum(p.depth_bid_usdt, 0)}</span> USDT, phía bán <span className="num text-fg">{fmtNum(p.depth_ask_usdt, 0)}</span> USDT · {p.ads_bid}/{p.ads_ask} quảng cáo · {fmtTime(p.timestamp)}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card title="Bảng theo dõi rủi ro Market Making" subtitle="Mức rủi ro tính theo ngưỡng cấu hình trong config/settings.json → risk_thresholds. Thay đổi 24h/7D so với bản lưu của ngày tương ứng (theo đơn vị của chỉ số).">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted">
              <tr className="border-b border-line text-left">
                <th className="py-2 pr-3 font-medium">Indicator</th><th className="pr-3 font-medium text-right">Current</th>
                <th className="pr-3 font-medium text-right">24h Change</th><th className="pr-3 font-medium text-right">7D Change</th>
                <th className="pr-3 font-medium">Risk Level</th><th className="pr-3 font-medium">Ngưỡng (TB / Cao)</th><th className="font-medium">Cách tính</th>
              </tr>
            </thead>
            <tbody>
              {(snap.tables.risk ?? []).map((r) => (
                <tr key={r.key} className="border-b border-line/60 align-top">
                  <td className="py-2 pr-3 font-medium whitespace-nowrap">{r.label}</td>
                  <td className="num pr-3 text-right whitespace-nowrap">{r.value === null ? '—' : `${fmtNum(r.value, 3)}`} <span className="text-muted">{r.value === null ? '' : r.unit}</span></td>
                  <td className="pr-3 text-right"><Change v={r.change_24h} unit="" /></td>
                  <td className="pr-3 text-right"><Change v={r.change_7d} unit="" /></td>
                  <td className="pr-3"><RiskPill risk={r.risk} /></td>
                  <td className="num pr-3 text-muted whitespace-nowrap">{r.thresholds ? `${r.thresholds[0]} / ${r.thresholds[1]}` : '—'}</td>
                  <td className="text-muted min-w-[240px]">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Tín hiệu Market Making (theo quy tắc)" subtitle="Tự động sinh từ số liệu và ngưỡng, không dùng AI. Fact = số liệu; Analysis = diễn giải theo quy tắc, cần đối chiếu.">
          <SignalList items={snap.tables.mm_signals} />
        </Card>
        <Card title="Rủi ro cần đánh giá thủ công" subtitle="Không có dữ liệu định lượng công khai — cần thông tin nội bộ">
          <ul className="text-[13px] space-y-2 text-muted leading-relaxed">
            <li><b className="text-fg">Tồn kho USDT & thanh khoản VND:</b> cần số dư nội bộ (nhập tại config/manual_inputs.json → internal_usdt_inventory).</li>
            <li><b className="text-fg">Chuyển tiền & settlement:</b> thời gian xác nhận chuyển khoản, giới hạn ngân hàng, rủi ro đóng băng tài khoản.</li>
            <li><b className="text-fg">Đối tác:</b> uy tín merchant P2P/OTC — bộ lọc hiện dùng tỷ lệ hoàn thành và số lệnh/tháng.</li>
            <li><b className="text-fg">Pháp lý & AML:</b> nguồn tiền đối ứng, KYC đối tác, quy định hiện hành về tài sản số tại Việt Nam.</li>
            <li><b className="text-fg">Pricing engine:</b> premium và spread ở bảng trên là đầu vào tham khảo, không phải lệnh giao dịch.</li>
          </ul>
        </Card>
      </div>
      <Note>Hệ thống không đặt lệnh và không đưa ra quyết định giao dịch.</Note>
    </div>
  )
}
