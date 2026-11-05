import { LazySeries } from '../charts/lazy'
import { MetricCard } from '../components/MetricCard'
import SignalList from '../components/SignalList'
import { Badge, Card, EmptyState, Note, PageHeader } from '../components/ui'
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
  const notes = snap.tables.sbv_policy_notes ?? []

  return (
    <div className="space-y-4">
      <PageHeader title="FX & Macro" desc="Số liệu vĩ mô Mỹ từ FRED. Dữ liệu công bố theo tháng hiển thị kỳ tham chiếu; ngày công bố và kỳ vọng thị trường chưa có nguồn miễn phí nên không hiển thị." />

      <div className="label">Quốc tế</div>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="panel p-3.5 flex flex-col gap-2">
          <div className="label">Federal Funds Target Range</div>
          <div className="num text-xl font-semibold">{tl != null && tu != null ? `${fmtNum(tl, 2)} – ${fmtNum(tu, 2)}` : '—'} <span className="text-xs text-muted">%</span></div>
          <div className="mt-auto pt-1.5 border-t border-line/60 text-[10.5px] text-muted">{m.dfedtaru?.source} · {m.dfedtaru?.period}</div>
        </div>
        <MetricCard m={m.dff} />
        <MetricCard m={m.dgs2} />
        <MetricCard m={m.dgs10} />
        <MetricCard m={m.t10y2y} />
        <MetricCard m={m.dxy} />
        <MetricCard m={m.dtwexbgs} />
        <div className="panel p-3.5 flex flex-col gap-2">
          <div className="label">FOMC kế tiếp</div>
          {fomc?.next ? (
            <>
              <div className="num text-xl font-semibold">{fomc.next.start.slice(5)} → {fomc.next.end.slice(5)}</div>
              <div className="flex gap-1.5 flex-wrap">
                <Badge tone="accent">còn {Math.max(daysUntil(fomc.next.end), 0)} ngày</Badge>
                {fomc.next.sep && <Badge>Có SEP</Badge>}
                {fomc.next.tentative && <Badge tone="warn">Dự kiến</Badge>}
              </div>
            </>
          ) : <div className="text-muted text-sm">Chưa cập nhật lịch</div>}
          <div className="mt-auto pt-1.5 border-t border-line/60 text-[10.5px] text-muted">{fomc?.source}</div>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard m={m.cpiaucsl} />
        <MetricCard m={m.cpilfesl} />
        <MetricCard m={m.pcepi} />
        <MetricCard m={m.pcepilfe} />
        <MetricCard m={m.payems} />
        <MetricCard m={m.unrate} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Lợi suất Treasury 2Y & 10Y" subtitle="FRED DGS2, DGS10 · %">
          {yields.length ? <LazySeries lines={yields} unit="%" /> : <EmptyState title="Chưa có dữ liệu" />}
        </Card>
        <Card title="Spread 10Y − 2Y" subtitle="FRED T10Y2Y · % — âm = đường cong đảo ngược">
          {s.t10y2y ? <LazySeries lines={[{ key: 't', label: s.t10y2y.label, points: lastDays(s.t10y2y.points, 365) }]} unit="%" zero /> : <EmptyState title="Chưa có dữ liệu" />}
        </Card>
        <Card title="Lạm phát lõi (YoY)" subtitle="Core CPI & Core PCE — FRED CPILFESL, PCEPILFE">
          {s.cpilfesl ? <LazySeries lines={['cpilfesl', 'pcepilfe'].filter((k) => s[k]).map((k) => ({ key: k, label: s[k].label, points: s[k].points }))} unit="%" />
            : <EmptyState title="Chưa có dữ liệu" />}
        </Card>
        <Card title="Tín hiệu vĩ mô (theo quy tắc)" subtitle="Tự động từ số liệu, không dùng AI">
          <SignalList items={snap.tables.macro_signals} />
        </Card>
      </div>

      <div className="label pt-2">Việt Nam</div>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <MetricCard m={m.sbv_central_rate} />
        <MetricCard m={m.usdvnd_vcb_buy_transfer} />
        <MetricCard m={m.usdvnd_vcb_buy_cash} />
        <MetricCard m={m.usdvnd_vcb_sell} />
        <MetricCard m={m.vcb_vs_sbv} />
        <MetricCard m={m.interbank_overnight_rate} />
        <MetricCard m={m.p2p_premium} />
        <MetricCard m={m.usdtvnd_p2p_mid} />
      </div>
      <Card title="Chính sách điều hành NHNN" subtitle="Ghi chú nhập tay trong config/manual_inputs.json → sbv_policy_notes">
        {notes.length ? (
          <ul className="divide-y divide-line/70 text-[13px]">
            {notes.map((n, i) => (
              <li key={i} className="py-2 flex gap-3"><span className="num text-muted shrink-0">{n.date}</span>
                <span>{n.text} {n.link && <a className="text-accent underline" href={n.link} target="_blank" rel="noreferrer">nguồn</a>}</span></li>
            ))}
          </ul>
        ) : <EmptyState title="Chưa có ghi chú">NHNN không có API công khai. Thêm ghi chú chính sách bằng cách sửa file cấu hình trên GitHub.</EmptyState>}
      </Card>
      <Note>Tỷ giá trung tâm NHNN là tỷ giá tham chiếu; giá Vietcombank là tỷ giá niêm yết mua/bán; USDT/VND P2P là giá thực thi trên thị trường tài sản số. Ba loại không thay thế cho nhau.</Note>
    </div>
  )
}
