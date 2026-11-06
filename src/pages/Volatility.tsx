import clsx from 'clsx'
import { Card, EmptyState, PageHeader } from '../components/ui'
import { useData } from '../hooks/useData'
import type { VolRow } from '../types/snapshot'
import { fmtNum } from '../utils/format'

const STATUS: Record<VolRow['status'], string> = {
  ok: '', accumulating: 'Đang tích luỹ dữ liệu', stale: 'Số liệu cũ', no_data: 'Chưa có dữ liệu',
}

function Cell({ v, unit }: { v: number | null; unit: string }) {
  if (v == null) return <td className="text-muted">—</td>
  return <td className="num">{fmtNum(v, unit === '%/năm' ? 1 : 2)}</td>
}

export default function Volatility() {
  const { snap } = useData()
  if (!snap) return null
  const rows = snap.tables.vol_board
  if (!rows) return <EmptyState title="Ngày này chưa có bảng volatility">Hệ thống bắt đầu lưu bảng này từ lần chạy có tính năng volatility.</EmptyState>
  const ready = rows.filter((r) => r.status === 'ok')
  const waiting = rows.filter((r) => r.status !== 'ok')
  const groups = [...new Set(ready.map((r) => r.group))]
  return (
    <div className="space-y-9">
      <PageHeader title="Volatility"
        desc="Độ dao động của từng biến trong 7, 30 và 90 ngày gần nhất. Biến nào đã đủ dữ liệu thì được tính, biến chưa đủ nằm ở bảng cuối và tự được tính khi dữ liệu tích luỹ." />
      {groups.map((g) => (
        <Card key={g} title={g}>
          <div className="overflow-x-auto">
            <table className="table-news">
              <thead><tr><th>Biến</th><th>Đơn vị</th><th>7 ngày</th><th>30 ngày</th><th>90 ngày</th><th className="hidden sm:table-cell">Số quan sát</th></tr></thead>
              <tbody>
                {ready.filter((r) => r.group === g).map((r) => (
                  <tr key={r.key}>
                    <td className="font-semibold">{r.label}</td>
                    <td className="text-muted text-[13px]">{r.unit}</td>
                    <Cell v={r.vol_7d} unit={r.unit} /><Cell v={r.vol_30d} unit={r.unit} /><Cell v={r.vol_90d} unit={r.unit} />
                    <td className="hidden sm:table-cell text-muted">{r.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
      <p className="text-[13.5px] text-muted max-w-3xl">
        Giá và tỷ giá: độ lệch chuẩn log return, quy năm (%/năm). Lãi suất và funding: độ lệch chuẩn thay đổi theo kỳ, tính bằng điểm cơ bản (bp). Chỉ số tâm lý: điểm. Ô trống nghĩa là chưa đủ số quan sát cho cửa sổ đó.
      </p>
      {waiting.length > 0 && (
        <Card title="Chưa tính được" subtitle="Bị bỏ qua cho đến khi có đủ dữ liệu.">
          <ul className="text-[15px]">
            {waiting.map((r) => (
              <li key={r.key} className="py-2 border-t border-line flex flex-wrap gap-x-3">
                <span className="font-semibold">{r.label}</span>
                <span className={clsx('text-[13.5px]', r.status === 'stale' ? 'text-warn' : 'text-muted')}>{STATUS[r.status]}{r.note ? `: ${r.note}` : ''}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
