import { Badge, Card, Note, PageHeader, QualityBadge } from '../components/ui'
import { useData } from '../hooks/useData'
import type { Quality } from '../types/snapshot'
import { fmtTime } from '../utils/format'

const ST = { ok: ['Hoạt động', 'up'], partial: ['Một phần', 'warn'], error: ['Lỗi', 'down'], disabled: ['Đang tắt', 'neutral'] } as const

export default function Status() {
  const { snap, index } = useData()
  if (!snap) return null
  const q = snap.quality_summary ?? {}
  const run = snap.run
  return (
    <div className="space-y-4">
      <PageHeader title="Data Sources & System Status" desc="Trạng thái từng nguồn trong lần thu thập của ngày đang xem. Lỗi một nguồn không làm dừng cả hệ thống; các chỉ số liên quan hiển thị 'Chưa có dữ liệu'." />

      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        <Card title="Lần chạy">
          <dl className="text-xs grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
            <dt className="text-muted">Kích hoạt</dt><dd>{run.trigger === 'schedule' ? 'Lịch tự động' : run.trigger === 'workflow_dispatch' ? 'Chạy thủ công' : run.trigger}</dd>
            <dt className="text-muted">Lịch dự kiến</dt><dd className="num">{run.scheduled_for ? fmtTime(run.scheduled_for) : '—'}</dd>
            <dt className="text-muted">Bắt đầu thực tế</dt><dd className="num">{fmtTime(run.started_at)}</dd>
            <dt className="text-muted">Hoàn tất</dt><dd className="num">{fmtTime(run.finished_at)}</dd>
            <dt className="text-muted">Độ trễ so với lịch</dt><dd className="num">{run.delay_minutes != null ? `${run.delay_minutes} phút` : '—'}</dd>
            <dt className="text-muted">Nhật ký</dt><dd>{run.run_url ? <a className="text-accent underline" href={run.run_url} target="_blank" rel="noreferrer">GitHub Actions #{run.run_id}</a> : '—'}</dd>
          </dl>
        </Card>
        <Card title="Chất lượng chỉ số">
          <div className="flex flex-wrap gap-2">
            {Object.entries(q).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5"><QualityBadge q={k as Quality} /><span className="num text-sm">{v}</span></div>
            ))}
          </div>
          <p className="text-[11px] text-muted mt-3 leading-relaxed">Ngưỡng độ mới theo nhóm nằm trong config/settings.json → staleness_hours. Dữ liệu vượt ngưỡng được gắn nhãn “Cũ”, không bao giờ hiển thị như dữ liệu mới.</p>
        </Card>
        <Card title="Lưu trữ">
          <p className="text-xs"><span className="num text-xl font-semibold">{index?.dates.length ?? 0}</span> <span className="text-muted">ngày có dữ liệu</span></p>
          <p className="text-[11px] text-muted mt-2 leading-relaxed">Mỗi ngày lưu một file trong public/data/history/YYYY/MM/. Lần chạy lại trong ngày giữ bản cũ với hậu tố giờ; toàn bộ lịch sử có trong Git.</p>
        </Card>
      </div>

      <Card title="Nguồn dữ liệu" pad={false}>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full text-xs">
            <thead className="text-muted">
              <tr className="border-b border-line text-left">
                <th className="py-2 pr-3 font-medium">Nguồn</th><th className="pr-3 font-medium">Trạng thái</th>
                <th className="pr-3 font-medium text-right">Chỉ số</th><th className="pr-3 font-medium text-right">Thời gian</th>
                <th className="pr-3 font-medium">Thành công gần nhất</th><th className="pr-3 font-medium">API key</th><th className="font-medium">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {snap.sources.map((s) => {
                const [l, t] = ST[s.status] ?? ST.error
                return (
                  <tr key={s.id} className="border-b border-line/60 align-top">
                    <td className="py-2 pr-3"><div className="font-medium">{s.name}</div><div className="text-muted text-[10.5px] break-all">{s.url}</div></td>
                    <td className="pr-3"><Badge tone={t}>{l}</Badge></td>
                    <td className="num pr-3 text-right">{s.metrics_count ?? 0}</td>
                    <td className="num pr-3 text-right">{s.latency_ms != null ? `${(s.latency_ms / 1000).toFixed(1)}s` : '—'}</td>
                    <td className="num pr-3 whitespace-nowrap">{fmtTime(s.last_success)}</td>
                    <td className="pr-3 whitespace-nowrap">{s.optional_key ? (s.key_present ? <Badge tone="up">Có (tuỳ chọn)</Badge> : <Badge>Không bắt buộc</Badge>) : <span className="text-muted">Không cần</span>}</td>
                    <td className="text-muted max-w-md">
                      {s.error && <div className="text-down break-words">{s.error}</div>}
                      {s.warnings?.map((w, i) => <div key={i} className="break-words">{w}</div>)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {(snap.warnings?.length ?? 0) > 0 && (
        <Card title={`Cảnh báo chất lượng (${snap.warnings!.length})`}>
          <ul className="text-xs text-muted columns-1 md:columns-2 gap-6 space-y-1">
            {snap.warnings!.map((w, i) => <li key={i} className="break-inside-avoid">{w}</li>)}
          </ul>
        </Card>
      )}
      <Note>Website chỉ đọc file JSON tĩnh do GitHub Actions tạo. Không có API key nào được đưa lên frontend.</Note>
    </div>
  )
}
