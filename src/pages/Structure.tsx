import clsx from 'clsx'
import { useState } from 'react'
import { LazyCorr } from '../charts/lazy'
import RegimeBanner from '../components/RegimeBanner'
import { Card, Note, PageHeader, Segmented } from '../components/ui'
import { useData } from '../hooks/useData'
import { fmtNum } from '../utils/format'

const PAIRS: [string, string, string][] = [
  ['USD_BROAD', 'BTC', 'Đồng USD và BTC'], ['US10Y', 'BTC', 'Lợi suất Mỹ 10 năm và BTC'], ['BTC', 'ETH', 'BTC và ETH'],
  ['BTC', 'SOL', 'BTC và SOL'], ['ETH', 'SOL', 'ETH và SOL'], ['USDVND', 'USDTVND', 'USD/VND và USDT/VND'],
  ['BTC_FUNDING', 'BTC', 'Funding BTC và giá BTC'], ['BTC_OI', 'BTC', 'Hợp đồng mở BTC và giá BTC'], ['STABLE', 'BTC', 'Lượng stablecoin và BTC'],
]

const RULE: Record<string, string> = {
  '|USDT peg deviation| (%)': 'USDT lệch khỏi 1 USD (%)',
  '|P2P premium| (%)': 'USDT cao hơn ngân hàng (%)',
  'Stablecoin supply 7D (%)': 'Lượng stablecoin, 7 ngày (%)',
  'BTC realized vol 7D annualized (%)': 'Độ biến động BTC, 7 ngày (%)',
  '|BTC 24h| (%)': 'BTC trong 24 giờ (%)',
  'BTC so với SMA20 (%)': 'BTC so với trung bình 20 ngày (%)',
  'BTC 7D (%)': 'BTC trong 7 ngày (%)',
  'Fear & Greed': 'Chỉ số sợ hãi và tham lam',
  'US10Y 7D (bp)': 'Lợi suất Mỹ 10 năm, 7 ngày (bp)',
  'BTC funding (%/8h)': 'Funding BTC (%/8 giờ)',
}

const GROUP: Record<string, string> = { 'Liquidity Stress': 'Căng thanh khoản', 'High Volatility': 'Biến động mạnh', Score: 'Điểm xu hướng' }

export default function Structure() {
  const { snap } = useData()
  const [w, setW] = useState('30')
  if (!snap) return null
  const corr = snap.correlation
  const reg = snap.regime
  const win = corr?.windows[w]
  const get = (a: string, b: string) => {
    if (!corr || !win) return { r: null as number | null, n: 0 }
    const i = corr.assets.indexOf(a)
    const j = corr.assets.indexOf(b)
    if (i < 0 || j < 0) return { r: null, n: 0 }
    return { r: win.matrix[i][j], n: win.n[i][j] }
  }
  const pairs = PAIRS.map(([a, b, l]) => ({ l, ...get(a, b) })).filter((p) => p.r !== null)
  const rules = (reg?.rules ?? []).filter((r) => r.triggered !== null)

  return (
    <div className="space-y-9">
      <PageHeader title="Liên thị trường" desc="Các thị trường đang đi cùng chiều hay ngược chiều nhau. Tương quan chỉ mô tả mức độ cùng chiều, không chứng minh nguyên nhân."
        right={<Segmented value={w} onChange={setW} options={[{ value: '7', label: '7 ngày' }, { value: '30', label: '30 ngày' }, { value: '90', label: '90 ngày' }]} />} />

      <RegimeBanner regime={reg} why={snap.tables.digest?.regime_why} />

      {pairs.length > 0 && (
        <Card title="Các cặp đáng theo dõi" subtitle="Càng gần +1: càng đi cùng chiều. Càng gần −1: càng đi ngược chiều.">
          <div className="overflow-x-auto">
            <table className="table-news">
              <thead><tr><th>Cặp</th><th className="min-w-[180px]">Tương quan</th><th>Mức</th></tr></thead>
              <tbody>
                {pairs.map(({ l, r }) => (
                  <tr key={l}>
                    <td>{l}</td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative w-24 h-2 bg-panel2" aria-hidden>
                          <div className={clsx('absolute top-0 bottom-0', r! > 0 ? 'bg-accent left-1/2' : 'bg-down right-1/2')} style={{ width: `${Math.abs(r!) * 50}%` }} />
                        </div>
                        <span className="w-10 text-right">{r!.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </td>
                    <td className="text-muted">{Math.abs(r!) >= 0.7 ? 'Mạnh' : Math.abs(r!) >= 0.4 ? 'Vừa' : 'Yếu'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {corr && corr.assets.length > 1 && (
        <Card title="Bảng tương quan đầy đủ">
          <LazyCorr corr={corr} window={w} />
        </Card>
      )}

      {rules.length > 0 && (
        <Card title="Vì sao có trạng thái này" subtitle="Quy tắc cố định, không dùng AI. Ưu tiên: căng thanh khoản, rồi biến động mạnh, rồi đến điểm xu hướng.">
          <div className="overflow-x-auto">
            <table className="table-news">
              <thead><tr><th>Nhóm</th><th className="!text-left">Chỉ báo</th><th>Giá trị</th><th>Ngưỡng</th><th>Kết quả</th></tr></thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.group + r.name}>
                    <td className="text-muted">{GROUP[r.group] ?? r.group}</td>
                    <td className="!text-left">{RULE[r.name] ?? r.name}</td>
                    <td>{fmtNum(r.value)}</td>
                    <td className="text-muted text-[13px]">{r.threshold}</td>
                    <td>
                      {r.group === 'Score'
                        ? <span className={clsx(r.effect > 0 ? 'text-up' : r.effect < 0 ? 'text-down' : 'text-muted')}>{r.effect > 0 ? '+1' : r.effect < 0 ? '−1' : '0'}</span>
                        : r.triggered ? <span className="text-down font-semibold">Kích hoạt</span> : <span className="text-muted">Không</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {corr?.notes && <Note>{corr.notes}</Note>}
    </div>
  )
}
