import { LazySeries } from '../charts/lazy'
import { MetricCard, MetricGrid } from '../components/MetricCard'
import { Card, PageHeader } from '../components/ui'
import { useData } from '../hooks/useData'
import { fmtNum } from '../utils/format'
import { lastDays } from '../utils/series'

function daysUntil(d: string) {
  const ms = new Date(`${d}T00:00:00+07:00`).getTime() - Date.now()
  return Math.ceil(ms / 86400000)
}

export default function Macro() {
  const { snap, latest } = useData()
  if (!snap) return null
  const m = snap.metrics
  const s = latest?.series ?? {}
  const fomc = snap.tables.fomc
  const tu = m.dfedtaru?.value
  const tl = m.dfedtarl?.value
  const yields = ['dgs2', 'dgs10'].filter((k) => s[k]).map((k) => ({ key: k, label: s[k].label, points: lastDays(s[k].points, 365) }))
  const core = ['cpilfesl', 'pcepilfe'].filter((k) => s[k]).map((k) => ({ key: k, label: s[k].label, points: s[k].points }))
  const notes = snap.tables.sbv_policy_notes ?? []
  const signals = snap.tables.macro_signals ?? []

  return (
    <div className="space-y-9">
      <PageHeader title="Vĩ mô" desc="Số liệu kinh tế Mỹ từ FRED. Số liệu tháng hiển thị theo kỳ tham chiếu." />

      {signals.length > 0 && (
        <ul className="space-y-1.5 text-[15.5px] max-w-3xl">
          {signals.map((x, i) => <li key={i}><span className="text-muted">{x.topic}:</span> {x.text}</li>)}
        </ul>
      )}

      <Card title="Lãi suất & đồng USD">
        <MetricGrid>
          {tl != null && tu != null && (
            <div className="border-t border-line pt-2.5">
              <div className="label">Lãi suất mục tiêu của Fed</div>
              <div className="num text-[21px] font-semibold leading-tight mt-1">{fmtNum(tl, 2)}–{fmtNum(tu, 2)}<span className="text-[13px] text-muted font-normal ml-1">%</span></div>
            </div>
          )}
          {fomc?.next && (
            <div className="border-t border-line pt-2.5">
              <div className="label">Họp FOMC kế tiếp</div>
              <div className="num text-[21px] font-semibold leading-tight mt-1">{fomc.next.end.slice(8)}/{fomc.next.end.slice(5, 7)}</div>
              <div className="text-[13px] text-muted">còn {Math.max(daysUntil(fomc.next.end), 0)} ngày{fomc.next.tentative ? ', dự kiến' : ''}</div>
            </div>
          )}
          <MetricCard m={m.dgs2} label="Lợi suất Mỹ 2 năm" />
          <MetricCard m={m.dgs10} label="Lợi suất Mỹ 10 năm" />
          <MetricCard m={m.t10y2y} label="Chênh 10 năm so với 2 năm" />
          <MetricCard m={m.dtwexbgs} label="Chỉ số USD rộng (FRED)" />
        </MetricGrid>
      </Card>

      <Card title="Lạm phát & việc làm Mỹ">
        <MetricGrid>
          <MetricCard m={m.cpiaucsl} label="CPI" />
          <MetricCard m={m.cpilfesl} label="CPI lõi" />
          <MetricCard m={m.pcepi} label="PCE" />
          <MetricCard m={m.pcepilfe} label="PCE lõi" />
          <MetricCard m={m.payems} label="Việc làm phi nông nghiệp" />
          <MetricCard m={m.unrate} label="Tỷ lệ thất nghiệp" />
        </MetricGrid>
      </Card>

      <div className="grid gap-x-8 gap-y-9 lg:grid-cols-2">
        {yields.length > 0 && <Card title="Lợi suất trái phiếu Mỹ"><LazySeries lines={yields} unit="%" /></Card>}
        {s.t10y2y && (
          <Card title="Chênh lệch 10 năm so với 2 năm" subtitle="Dưới 0 là đường cong đảo ngược.">
            <LazySeries lines={[{ key: 'spread', label: s.t10y2y.label, points: lastDays(s.t10y2y.points, 365) }]} unit="%" zero />
          </Card>
        )}
        {core.length > 0 && <Card title="Lạm phát lõi so với cùng kỳ"><LazySeries lines={core} unit="%" /></Card>}
      </div>

      {(m.sbv_central_rate?.value != null || m.interbank_overnight_rate?.value != null || notes.length > 0) && (
        <Card title="Việt Nam">
          <MetricGrid>
            <MetricCard m={m.sbv_central_rate} label="Tỷ giá trung tâm NHNN" />
            <MetricCard m={m.interbank_overnight_rate} label="Lãi suất liên ngân hàng qua đêm" />
          </MetricGrid>
          {notes.length > 0 && (
            <ul className="mt-4 text-[15px]">
              {notes.map((n, i) => (
                <li key={i} className="py-2 border-t border-line flex gap-3">
                  <span className="num text-muted shrink-0">{n.date}</span>
                  <span>{n.text} {n.link && <a className="underline" href={n.link} target="_blank" rel="noreferrer">nguồn</a>}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  )
}
