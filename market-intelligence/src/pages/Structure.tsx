import clsx from 'clsx'
import { useState } from 'react'
import { LazyCorr } from '../charts/lazy'
import RegimeBanner from '../components/RegimeBanner'
import { Card, EmptyState, Note, PageHeader, Segmented } from '../components/ui'
import { useData } from '../hooks/useData'
import { fmtNum } from '../utils/format'

const PAIRS: [string, string, string][] = [
  ['USD_BROAD', 'BTC', 'USD (thay DXY) ↔ BTC'], ['US10Y', 'BTC', 'US 10Y ↔ BTC'], ['BTC', 'ETH', 'BTC ↔ ETH'],
  ['BTC', 'SOL', 'BTC ↔ SOL'], ['ETH', 'SOL', 'ETH ↔ SOL'], ['USDVND', 'USDTVND', 'USD/VND ↔ USDT/VND'],
  ['BTC_FUNDING', 'BTC', 'BTC Funding ↔ BTC'], ['BTC_OI', 'BTC', 'BTC OI ↔ BTC'], ['STABLE', 'BTC', 'Stablecoin supply ↔ BTC'],
]

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

  return (
    <div className="space-y-4">
      <PageHeader title="Market Structure & Intermarket" desc="Tương quan Pearson trên chuỗi thay đổi theo ngày, đồng bộ theo ngày. Tương quan mô tả mức độ cùng chiều, không chứng minh quan hệ nhân quả." />
      <RegimeBanner regime={reg} />

      <Card title="Ma trận tương quan" subtitle={corr ? `Kết thúc ngày ${corr.end_day}. Di chuột vào ô để xem số quan sát.` : undefined}
        right={<Segmented value={w} onChange={setW} options={[{ value: '7', label: '7 ngày' }, { value: '30', label: '30 ngày' }, { value: '90', label: '90 ngày' }]} />}>
        {corr && corr.assets.length > 1 ? (
          <div className="space-y-3">
            <LazyCorr corr={corr} window={w} />
            <Note>{corr.method} {corr.notes}</Note>
          </div>
        ) : <EmptyState title="Chưa đủ dữ liệu để tính tương quan" />}
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Các cặp quan hệ theo dõi" subtitle={`Cửa sổ ${w} ngày`}>
          <table className="w-full text-xs">
            <thead className="text-muted"><tr className="border-b border-line text-left"><th className="py-2 font-medium">Cặp</th><th className="font-medium text-right">r</th><th className="font-medium text-right">n</th><th className="font-medium pl-3">Mức</th></tr></thead>
            <tbody>
              {PAIRS.map(([a, b, l]) => {
                const { r, n } = get(a, b)
                const lvl = r === null ? 'Không đủ dữ liệu' : Math.abs(r) >= 0.7 ? 'Mạnh' : Math.abs(r) >= 0.4 ? 'Trung bình' : 'Yếu'
                return (
                  <tr key={l} className="border-b border-line/60">
                    <td className="py-2">{l}</td>
                    <td className={clsx('num text-right', r !== null && (r > 0 ? 'text-accent' : 'text-down'))}>{r === null ? '—' : r.toFixed(2)}</td>
                    <td className="num text-right text-muted">{n}</td>
                    <td className="pl-3 text-muted">{lvl}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="text-[11px] text-muted mt-2">Mạnh |r| ≥ 0,7 · Trung bình ≥ 0,4. USD/VND ↔ USDT/VND dùng lịch sử hệ thống tự lưu, cần tích luỹ đủ ngày và bật nguồn P2P.</p>
        </Card>

        <Card title="Quy tắc Market Regime" subtitle={reg?.method}>
          {reg ? (
            <table className="w-full text-xs">
              <thead className="text-muted"><tr className="border-b border-line text-left"><th className="py-2 font-medium">Nhóm</th><th className="font-medium">Chỉ báo</th><th className="font-medium text-right">Giá trị</th><th className="font-medium pl-3">Ngưỡng</th><th className="font-medium text-right">Kết quả</th></tr></thead>
              <tbody>
                {reg.rules.map((r) => (
                  <tr key={r.group + r.name} className="border-b border-line/60">
                    <td className="py-2 text-muted whitespace-nowrap pr-2">{r.group}</td>
                    <td className="pr-2">{r.name}</td>
                    <td className="num text-right">{fmtNum(r.value)}</td>
                    <td className="pl-3 text-muted num text-[11px]">{r.threshold}</td>
                    <td className="text-right whitespace-nowrap">
                      {r.triggered === null ? <span className="text-muted">thiếu dữ liệu</span>
                        : r.group === 'Score' ? <span className={clsx('num', r.effect > 0 ? 'text-up' : r.effect < 0 ? 'text-down' : 'text-muted')}>{r.effect > 0 ? '+1' : r.effect < 0 ? '−1' : '0'}</span>
                          : r.triggered ? <span className="text-down font-medium">Kích hoạt</span> : <span className="text-muted">Không</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <EmptyState title="Chưa có dữ liệu" />}
        </Card>
      </div>
    </div>
  )
}
