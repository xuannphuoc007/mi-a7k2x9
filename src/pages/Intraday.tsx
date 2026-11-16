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

const hm = (t: number) =>
  new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000))

export default function Intraday() {
  const { snap } = useData()
  if (!snap) return null
  const d = snap.tables.intraday
  if (!d) {
    return (
      <div className="space-y-9">
        <PageHeader title="USD/VND trong ngày" desc="Biến động trong ngày so với giá mở cửa." />
        <EmptyState title="Chưa có dữ liệu trong ngày">Cần ít nhất hai điểm giá trong ngày. Lần cập nhật kế tiếp sẽ có.</EmptyState>
      </div>
    )
  }
  const flat = (v: number) => d.points.map(([t]) => [t, v] as [number, number])
  const first = d.points[0][0]
  const last = d.points[d.points.length - 1][0]
  const out = d.outside_count > 0

  return (
    <div className="space-y-9">
      <PageHeader
        title="USD/VND trong ngày"
        desc={`Giá so với giá mở cửa, biên ±${d.band_pct}%. Dữ liệu từ ${hm(first)} đến ${hm(last)}, ${d.n_points} điểm.`}
      />

      <Card title="Đường giá và biên" subtitle="Nét đứt là biên trên, biên dưới và giá mở cửa.">
        <LazySeries
          timeAxis
          height={300}
          unit="VND"
          lines={[
            { key: 'price', label: 'USD/VND', points: d.points },
            { key: 'hi', label: `Biên trên +${d.band_pct}%`, points: flat(d.hi), dashed: true, color: 'rgb(var(--warn))' },
            { key: 'open', label: 'Giá mở cửa', points: flat(d.open), dashed: true, color: 'rgb(var(--muted))' },
            { key: 'lo', label: `Biên dưới −${d.band_pct}%`, points: flat(d.lo), dashed: true, color: 'rgb(var(--warn))' },
          ]}
        />
      </Card>

      <Card title="Biến động">
        <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-4">
          <Stat label="Giá mở cửa" value={fmtNum(d.open, 0)} sub={`Biên ${fmtNum(d.lo, 0)} – ${fmtNum(d.hi, 0)}`} />
          <Stat label="Giá mới nhất" value={fmtNum(d.last, 0)} sub={`${d.dev_pct >= 0 ? '+' : ''}${fmtNum(d.dev_pct, 2)}% so với mở cửa`} />
          <Stat label="Cao nhất / thấp nhất" value={`${fmtNum(d.high, 0)} / ${fmtNum(d.low, 0)}`} sub={`Biên độ ${fmtNum(d.range_pct, 2)}%`} />
          <Stat label="So với biên ±" value={out ? 'Vượt biên' : 'Trong biên'} className={out ? 'text-down' : 'text-up'}
            sub={out ? `${d.outside_count} điểm ngoài biên` : 'Chưa có điểm nào ngoài biên'} />
        </div>
        <p className="mt-4 text-[14.5px] text-muted max-w-3xl">Nguồn: {d.source}. Đây là giá tham chiếu quốc tế, không phải giá ngân hàng.</p>
      </Card>
    </div>
  )
}
