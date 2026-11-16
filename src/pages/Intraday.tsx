import clsx from 'clsx'
import { LazySeries } from '../charts/lazy'
import { Card, EmptyState, PageHeader } from '../components/ui'
import { useData } from '../hooks/useData'
import { fmtNum } from '../utils/format'

function Stat({ label, value, sub, className }: { label: string; value: string; sub?: string; className?: string }) {
  return (
    <div className="border-t border-line pt-2.5">
      <div className="label">{label}</div>
      <div className={clsx('num text-[21px] font-semibold leading-tight mt-1', className)}>{value}</div>
      {sub && <div className="text-[13px] text-muted">{sub}</div>}
    </div>
  )
}

const dmy = (d: string) => d.split('-').reverse().join('/')

export default function Intraday() {
  const { snap } = useData()
  if (!snap) return null
  const all = snap.tables.intraday
  if (!all || all.days.length === 0) {
    return (
      <div className="space-y-9">
        <PageHeader title="USD/VND trong ngày" desc="Biến động so với giá mở cửa từng ngày." />
        <EmptyState title="Chưa có dữ liệu trong ngày">Cần ít nhất hai điểm giá trong ngày. Lần cập nhật kế tiếp sẽ có.</EmptyState>
      </div>
    )
  }
  const days = [...all.days].sort((a, b) => a.date.localeCompare(b.date))
  const price = days.flatMap((d) => d.points)
  const band = (key: 'hi' | 'lo' | 'open') => days.flatMap((d) => d.points.map(([t]) => [t, d[key]] as [number, number]))
  const latest = days[days.length - 1]
  const widest = days.reduce((a, b) => (b.range_pct > a.range_pct ? b : a))
  const outDays = days.filter((d) => d.outside_count > 0)

  return (
    <div className="space-y-9">
      <PageHeader
        title="USD/VND trong ngày"
        desc={`Giá từ ngày ${dmy(days[0].date)} đến ${dmy(latest.date)}. Biên ±${all.band_pct}% tính quanh giá mở cửa của từng ngày.`}
      />

      <Card title="Đường giá và biên" subtitle="Nét đứt là biên trên, biên dưới và giá mở cửa của từng ngày (đổi bậc khi sang ngày mới).">
        <LazySeries
          timeAxis
          height={340}
          unit="VND"
          lines={[
            { key: 'price', label: 'USD/VND', points: price },
            { key: 'hi', label: `Biên trên +${all.band_pct}%`, points: band('hi'), dashed: true, color: 'rgb(var(--warn))' },
            { key: 'open', label: 'Giá mở cửa của ngày', points: band('open'), dashed: true, color: 'rgb(var(--muted))' },
            { key: 'lo', label: `Biên dưới −${all.band_pct}%`, points: band('lo'), dashed: true, color: 'rgb(var(--warn))' },
          ]}
        />
      </Card>

      <Card title="Biến động">
        <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-4">
          <Stat label="Giá mới nhất" value={fmtNum(latest.last, 0)} sub={`${latest.dev_pct >= 0 ? '+' : ''}${fmtNum(latest.dev_pct, 2)}% so với mở cửa ${dmy(latest.date)}`} />
          <Stat label="Từ đầu kỳ" value={`${fmtNum(days[0].open, 0)} → ${fmtNum(latest.last, 0)}`}
            sub={`${((latest.last / days[0].open - 1) * 100 >= 0 ? '+' : '')}${fmtNum((latest.last / days[0].open - 1) * 100, 2)}%`} />
          <Stat label="Ngày biên độ lớn nhất" value={`${fmtNum(widest.range_pct, 2)}%`} sub={dmy(widest.date)} />
          <Stat label="Ngày vượt biên" value={`${outDays.length} / ${days.length}`} className={outDays.length ? 'text-down' : 'text-up'}
            sub={outDays.length ? outDays.map((d) => dmy(d.date).slice(0, 5)).join(', ') : 'Chưa có ngày nào vượt biên'} />
        </div>

        <h3 className="serif text-[17px] font-semibold mt-7 mb-2">Từng ngày</h3>
        <table className="w-full max-w-3xl text-[14px]">
          <thead>
            <tr className="text-muted text-left">
              <th className="font-normal py-1">Ngày</th><th className="font-normal text-right">Mở cửa</th>
              <th className="font-normal text-right">Cuối</th><th className="font-normal text-right">Biên độ</th>
              <th className="font-normal text-right">Ngoài biên</th>
            </tr>
          </thead>
          <tbody>
            {[...days].reverse().map((x) => (
              <tr key={x.date} className="border-t border-line">
                <td className="py-1.5 num">{dmy(x.date)}</td>
                <td className="num text-right">{fmtNum(x.open, 0)}</td>
                <td className="num text-right">{fmtNum(x.last, 0)}</td>
                <td className="num text-right">{fmtNum(x.range_pct, 2)}%</td>
                <td className={clsx('num text-right', x.outside_count > 0 && 'text-down')}>{x.outside_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-[14.5px] text-muted max-w-3xl">Nguồn: {all.source}. Đây là giá tham chiếu quốc tế, không phải giá ngân hàng.</p>
      </Card>
    </div>
  )
}
