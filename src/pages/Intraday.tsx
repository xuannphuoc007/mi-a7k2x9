import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { LazySeries } from '../charts/lazy'
import { Card, EmptyState, PageHeader, Segmented } from '../components/ui'
import { useData } from '../hooks/useData'
import { loadLatest } from '../services/data'
import type { Snapshot } from '../types/snapshot'
import { fmtNum } from '../utils/format'
import { COMPARE_BPS, highLow, openToClose, runDynamic, runStatic } from '../utils/requote'

type Intraday = NonNullable<Snapshot['tables']['intraday']>
type Day = Intraday['days'][number]
type Mode = 'static' | 'dynamic'

const ALL = 'all'
const SOURCE_LABEL: Record<string, string> = {
  y1: 'Yahoo 1 phút', y5: 'Yahoo 5 phút', tv: 'Mẫu TradingView', old: 'Đã lưu (không rõ khung)',
}
const STATUS: Record<string, { label: string; cls: string }> = {
  new_data: { label: 'Có dữ liệu thị trường mới', cls: 'text-up' },
  no_new: { label: 'Chạy thành công, chưa có điểm mới', cls: 'text-warn' },
  stale_suspect: { label: 'Nghi ngờ nguồn ngừng cập nhật', cls: 'text-down' },
  market_closed: { label: 'Thị trường nghỉ', cls: 'text-muted' },
  source_error: { label: 'Lỗi nguồn lần này', cls: 'text-down' },
}
const DEFAULT_CFG = { min_points: 10, min_changes: 2, unusual_gap_min: 240, stale_after_hours: 4, assessment: { min_sessions: 10, min_price_changes: 30 } }

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
const pct = (v: number, digits = 2) => `${v >= 0 ? '+' : ''}${fmtNum(v, digits)}%`
const bpsTxt = (v: number | null, digits = 1) => (v === null ? '–' : `${fmtNum(v, digits)} bps`)
const vndTxt = (v: number | null) => (v === null ? '–' : `${fmtNum(v, 0)} đ`)
const clock = (t: number) =>
  new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(t * 1000))
const dmyHm = (t: number | null | undefined) =>
  t == null ? '–' : new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000))
const dur = (sec: number | null) => {
  if (sec === null) return '–'
  if (sec < 90) return `${Math.round(sec)} giây`
  if (sec < 5400) return `${fmtNum(sec / 60, 0)} phút`
  return `${fmtNum(sec / 3600, 1)} giờ`
}
const mins = (m: number | null | undefined) => (m == null ? '–' : m >= 90 ? `${fmtNum(m / 60, 1)} giờ` : `${fmtNum(m, 0)} phút`)
const valid = (d: Day) => d.meta?.valid ?? (d.n_points >= DEFAULT_CFG.min_points)

export default function IntradayPage() {
  const { snap } = useData()
  const [fresh, setFresh] = useState<Intraday | null>(null)
  const [mode, setMode] = useState<Mode>('dynamic')
  const [thr, setThr] = useState(30)
  const [pick, setPick] = useState<string | null>(null)
  const [runInfo, setRunInfo] = useState<{ at: number; msg: string | null } | null>(null)
  const [busy, setBusy] = useState(false)
  const all = fresh ?? snap?.tables.intraday
  const cfg = { ...DEFAULT_CFG, ...(all?.config ?? {}) }

  const sorted = useMemo(() => (all ? [...all.days].sort((a, b) => a.date.localeCompare(b.date)) : []), [all])
  const validDays = useMemo(() => sorted.filter(valid), [sorted])
  // Mặc định: ngày giao dịch gần nhất có dữ liệu hợp lệ, không phải ngày cuối tuần giá đứng yên
  const defaultPick = validDays.length ? validDays[validDays.length - 1].date : sorted.length ? sorted[sorted.length - 1].date : ALL
  const sel = pick ?? defaultPick
  const scope = useMemo(() => {
    if (sel === ALL) return validDays.length ? validDays : sorted
    const one = sorted.filter((d) => d.date === sel)
    return one.length ? one : validDays.length ? validDays : sorted
  }, [sorted, validDays, sel])
  const dyn = useMemo(() => runDynamic(scope, thr), [scope, thr])
  const sta = useMemo(() => runStatic(scope, thr), [scope, thr])
  // So sánh ngưỡng luôn chạy trên toàn bộ phiên đủ dữ liệu, không phụ thuộc ngày đang xem
  const evidence = validDays.length ? validDays : []
  const compare = useMemo(
    () => COMPARE_BPS.map((b) => ({ b, d: runDynamic(evidence, b).summary, s: runStatic(evidence, b).summary })),
    [evidence],
  )
  const dynByDate = useMemo(() => Object.fromEntries(runDynamic(sorted, thr).per.map((r) => [r.date, r])), [sorted, thr])

  if (!snap) return null
  if (!all || sorted.length === 0) {
    return (
      <div className="space-y-9">
        <PageHeader title="USD/VND trong ngày" desc="Biến động so với giá mở cửa từng ngày." />
        <EmptyState title="Chưa có dữ liệu trong ngày">Cần ít nhất hai điểm giá trong ngày. Lần cập nhật kế tiếp sẽ có.</EmptyState>
      </div>
    )
  }

  async function rerun() {
    setBusy(true)
    try {
      const s = await loadLatest()
      if (s.tables.intraday) setFresh(s.tables.intraday)
      setRunInfo({ at: Date.now() / 1000, msg: null })
    } catch (e) {
      setRunInfo({ at: Date.now() / 1000, msg: `Không tải được dữ liệu mới, chạy lại trên dữ liệu đang mở (${(e as Error).message})` })
    } finally {
      setBusy(false)
    }
  }

  const audit = all.audit
  const first = scope[0]
  const latest = scope[scope.length - 1]
  const price = scope.flatMap((d) => d.points.map(([t, v]) => [t, v] as [number, number]))
  const staticLine = (key: 'hi' | 'lo' | 'open') => sta.per.flatMap((r, i) => scope[i].points.map(([t]) => [t, r[key]] as [number, number]))
  const widest = scope.reduce((a, b) => (highLow(b) > highLow(a) ? b : a))
  const o2c = (latest.last / first.open - 1) * 100
  const summaryD = dyn.summary
  const summaryS = sta.summary
  const nPoints = scope.reduce((s, d) => s + d.n_points, 0)
  const events = dyn.per.flatMap((r) => r.events)
  const reduction = summaryD.changeReduction
  const warns = scope.flatMap((d) => (d.meta?.warnings ?? []).filter((w) => !w.startsWith('Cuối tuần')).map((w) => `${dmy(d.date)}: ${w}`))
  const viewingInvalid = sel !== ALL && !valid(latest)
  const st = audit ? (STATUS[audit.status] ?? { label: audit.status, cls: '' }) : null

  // --- kết luận chỉ khi đủ dữ liệu: dựa trên toàn bộ phiên hợp lệ, không phụ thuộc ngày đang xem
  const evD = compare.find((c) => c.b === thr)?.d ?? runDynamic(evidence, thr).summary
  const sessions = evidence.length
  const changes = evD.marketChanges
  const enough = sessions >= cfg.assessment.min_sessions && changes >= cfg.assessment.min_price_changes

  const cov = scope.reduce(
    (a, d) => {
      const c = d.meta?.coverage?.['5m']
      return c ? { expected: a.expected + c.expected, actual: a.actual + c.actual } : a
    },
    { expected: 0, actual: 0 },
  )
  const srcTotals = scope.reduce<Record<string, number>>((m, d) => {
    Object.entries(d.meta?.sources ?? {}).forEach(([k, v]) => { m[k] = (m[k] ?? 0) + v })
    return m
  }, {})

  return (
    <div className="space-y-9">
      <PageHeader
        title="USD/VND trong ngày"
        desc={`Giá từ ngày ${dmy(sorted[0].date)} đến ${dmy(sorted[sorted.length - 1].date)}. Mỗi ngày mô phỏng độc lập từ giá mở cửa của ngày đó. Nguồn giá thực tế là Yahoo Finance và TradingView, không phải Investing.com.`}
      />

      <Card title="Trạng thái cập nhật"
        subtitle="Workflow chạy thành công không có nghĩa là có dữ liệu thị trường mới: nguồn chỉ ghi giá khi giá đổi, nên nhiều lần chạy liên tiếp không thêm điểm nào.">
        {audit && st ? (
          <>
            <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-5">
              <Stat label="Last Fetch Time" value={dmyHm(new Date(audit.fetch_at).getTime() / 1000)} sub="Lần cuối hệ thống lấy dữ liệu" />
              <Stat label="Last Market Timestamp" value={dmyHm(audit.last_market_ts)} sub="Thời điểm giá cuối do Yahoo báo" />
              <Stat label="Latest Stored Timestamp" value={dmyHm(audit.latest_stored_ts)} sub="Điểm thị trường mới nhất đã lưu" />
              <Stat label="Data Status" value={st.label} className={clsx('!text-[17px]', st.cls)} />
              <Stat label="Bản ghi mới" value={String(audit.new_market_records)}
                sub={audit.compared_with ? `So với bản lưu lúc ${dmyHm(new Date(audit.compared_with).getTime() / 1000)}` : 'So với bản lưu trước'} />
            </div>
            <p className={clsx('mt-3 text-[14.5px] max-w-3xl', st.cls)}>{audit.status_text}.</p>
            <p className="mt-1 text-[13.5px] text-muted max-w-3xl">
              Bản ghi mới chỉ đếm điểm thị trường (nến Yahoo có giá), không đếm mẫu giá TradingView đọc mỗi lần chạy
              {audit.tradingview_sample_ts ? ` (mẫu gần nhất lúc ${dmyHm(audit.tradingview_sample_ts)})` : ''}.
              Các lần cập nhật trong ngày không được lưu vào repo, nên "so với bản lưu trước" là so với lần lưu gần nhất (07:10 hoặc 17:00).
            </p>
          </>
        ) : (
          <p className="text-[14.5px] text-muted">Bản dữ liệu này chưa có thông tin trạng thái cập nhật. Lần chạy kế tiếp sẽ bổ sung.</p>
        )}
      </Card>

      <Card title="Chế độ và ngưỡng">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4 text-[14px]">
          <div>
            <div className="label mb-1">Chế độ</div>
            <Segmented<Mode> value={mode} onChange={setMode}
              options={[{ value: 'static', label: 'Static Band quanh giá mở cửa' }, { value: 'dynamic', label: 'Dynamic Requote' }]} />
          </div>
          <div>
            <div className="label mb-1">Ngưỡng ±</div>
            <div className="flex items-center gap-3">
              <Segmented<string> value={String(thr)} onChange={(v) => setThr(Number(v))}
                options={COMPARE_BPS.map((b) => ({ value: String(b), label: `${b} bps` }))} />
              <input type="number" min={1} max={200} step={1} value={thr} aria-label="Ngưỡng tuỳ chỉnh (bps)"
                onChange={(e) => { const n = Number(e.target.value); if (n >= 1 && n <= 200) setThr(n) }}
                className="num w-16 bg-transparent border-b border-fg/40 py-0.5 px-1 outline-none" />
              <span className="text-muted">bps = ±{fmtNum(thr / 100, 2)}%</span>
            </div>
          </div>
          <div>
            <div className="label mb-1">Ngày</div>
            <select value={sel} onChange={(e) => setPick(e.target.value)} aria-label="Chọn ngày"
              className="num bg-transparent border-b border-fg/40 hover:border-fg py-1 px-1 outline-none cursor-pointer">
              <option value={ALL} className="bg-panel text-fg">Tất cả phiên đủ dữ liệu ({validDays.length})</option>
              {[...sorted].reverse().map((d) => (
                <option key={d.date} value={d.date} className="bg-panel text-fg">
                  {dmy(d.date)}{d.meta?.weekend ? ' (cuối tuần)' : !valid(d) ? ' (không đủ dữ liệu)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="no-print">
            <button onClick={rerun} disabled={busy}
              className="border border-fg px-2.5 py-1.5 font-medium hover:bg-fg hover:text-bg disabled:opacity-50">
              {busy ? 'Đang chạy…' : 'Chạy lại mô phỏng'}
            </button>
          </div>
        </div>
        <p className="mt-3 text-[13.5px] text-muted max-w-3xl">
          Mô phỏng chạy ngay trên trình duyệt từ các điểm giá đã lưu (từ {dmy(all.since)}), đổi chế độ hoặc ngưỡng là chạy lại.
          Nút "Chạy lại mô phỏng" tải bản dữ liệu mới nhất từ máy chủ rồi chạy lại. Mặc định là ngày giao dịch gần nhất có dữ liệu hợp lệ.
          {runInfo && <> Lần chạy lúc {clock(runInfo.at)}: {nPoints} điểm, {scope.length} ngày.</>}
          {runInfo?.msg && <span className="text-warn"> {runInfo.msg}</span>}
        </p>
        {viewingInvalid && (
          <p className="mt-2 text-[14px] text-warn max-w-3xl">
            Ngày {dmy(latest.date)} không đủ dữ liệu để phân tích{latest.meta?.invalid_reason ? `: ${latest.meta.invalid_reason}` : ''}. Số liệu bên dưới chỉ để tham khảo.
          </p>
        )}
      </Card>

      {mode === 'static' ? (
        <Card title="Static Band: đường giá và biên cố định"
          subtitle={`Biên ±${fmtNum(thr / 100, 2)}% quanh giá mở cửa của từng ngày. Nét đứt đổi bậc khi sang ngày mới.`}>
          <LazySeries
            timeAxis
            height={340}
            unit="VND"
            lines={[
              { key: 'price', label: 'USD/VND thị trường', points: price },
              { key: 'hi', label: `Biên trên +${fmtNum(thr / 100, 2)}%`, points: staticLine('hi'), dashed: true, color: 'rgb(var(--warn))' },
              { key: 'open', label: 'Giá mở cửa của ngày', points: staticLine('open'), dashed: true, color: 'rgb(var(--muted))' },
              { key: 'lo', label: `Biên dưới −${fmtNum(thr / 100, 2)}%`, points: staticLine('lo'), dashed: true, color: 'rgb(var(--warn))' },
            ]}
          />
        </Card>
      ) : (
        <Card title="Dynamic Requote: giá thị trường và giá báo"
          subtitle={`Giá báo giữ nguyên cho đến khi giá thị trường lệch từ ${thr} bps (±${fmtNum(thr / 100, 2)}%) so với giá báo hiện tại thì báo lại. Chấm đỏ là điểm kích hoạt Requote, nét đứt là biên dời theo giá báo.`}>
          <LazySeries
            timeAxis
            height={340}
            unit="VND"
            markers={events.map((e) => ({ t: e.t, v: e.price }))}
            lines={[
              { key: 'market', label: 'Giá thị trường', points: price },
              { key: 'quoted', label: 'Giá báo sau Requote', points: dyn.per.flatMap((r) => r.quoted), step: true, color: 'rgb(var(--up))' },
              { key: 'hi', label: 'Biên trên động', points: dyn.per.flatMap((r) => r.hi), dashed: true, color: 'rgb(var(--warn))' },
              { key: 'lo', label: 'Biên dưới động', points: dyn.per.flatMap((r) => r.lo), dashed: true, color: 'rgb(var(--warn))' },
            ]}
          />
        </Card>
      )}

      <Card title="Biến động"
        subtitle="Open-to-Close là giá cuối trừ giá mở cửa (có chiều tăng hoặc giảm). High–Low Range là chênh lệch giữa giá cao nhất và thấp nhất trong ngày, bất kể thứ tự.">
        <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-4">
          <Stat label="Giá mới nhất" value={fmtNum(latest.last, 0)} sub={`${pct(latest.dev_pct)} so với mở cửa ${dmy(latest.date)}`} />
          <Stat label="Open-to-Close" value={pct(o2c)}
            sub={`${fmtNum(first.open, 0)} → ${fmtNum(latest.last, 0)}${scope.length > 1 ? ` (${dmy(first.date).slice(0, 5)} – ${dmy(latest.date).slice(0, 5)})` : ''}`}
            className={o2c > 0 ? 'text-up' : o2c < 0 ? 'text-down' : undefined} />
          <Stat label="High–Low Range" value={`${fmtNum(highLow(widest), 2)}%`}
            sub={scope.length > 1 ? `Ngày rộng nhất ${dmy(widest.date)}` : `${fmtNum(widest.low, 0)} – ${fmtNum(widest.high, 0)}`} />
          {mode === 'static' ? (
            <Stat label="Điểm ngoài biên" value={`${summaryS.outside} / ${summaryS.points}`}
              className={summaryS.outside ? 'text-down' : 'text-up'}
              sub={`${summaryS.daysOutside} / ${summaryS.days} ngày có điểm ra ngoài ±${fmtNum(thr / 100, 2)}%`} />
          ) : (
            <Stat label="Requote Count" value={String(summaryD.requotes)}
              sub={summaryD.requotesPerDay !== null ? `Trung bình ${fmtNum(summaryD.requotesPerDay, 1)} lần/ngày` : undefined} />
          )}
        </div>
      </Card>

      <Card title="Đánh giá ngưỡng"
        subtitle={`Mô phỏng ngưỡng ±${thr} bps trên ${sessions} phiên đủ dữ liệu (trên tổng ${sorted.length} ngày có điểm giá), ${changes} lần giá thị trường đổi, tính lại mỗi khi đổi dữ liệu.`}>
        {enough ? (
          <p className="text-[15.5px] max-w-3xl">
            Trên {sessions} phiên đủ dữ liệu, giá thị trường đổi <b>{evD.marketChanges}</b> lần, giá báo đổi <b>{evD.requotes}</b> lần
            {evD.changeReduction !== null && <> (ít hơn {fmtNum(evD.changeReduction * 100, 0)}%)</>}. Giá báo lệch thị trường trung bình{' '}
            <b>{bpsTxt(evD.dev.avgBps)}</b> ({vndTxt(evD.dev.avgVnd)}), lệch lớn nhất <b>{bpsTxt(evD.dev.maxBps)}</b> ({vndTxt(evD.dev.maxVnd)}).
            Việc ngưỡng ±{fmtNum(thr / 100, 2)}% có phù hợp hay không phụ thuộc mức lệch tối đa bạn chấp nhận được.
          </p>
        ) : (
          <div className="max-w-3xl space-y-2">
            <p className="text-[16px] font-semibold text-warn">Chưa đủ dữ liệu để kết luận ngưỡng ±{fmtNum(thr / 100, 2)}% có phù hợp hay không.</p>
            <ul className="text-[14.5px] space-y-1">
              <li className={sessions >= cfg.assessment.min_sessions ? 'text-up' : 'text-warn'}>
                Phiên đủ dữ liệu: {sessions} / {cfg.assessment.min_sessions} cần có.
              </li>
              <li className={changes >= cfg.assessment.min_price_changes ? 'text-up' : 'text-warn'}>
                Số lần giá thị trường đổi: {changes} / {cfg.assessment.min_price_changes} cần có.
              </li>
              <li className="text-muted">
                Ngày cuối tuần và ngày giá đứng yên không được dùng làm bằng chứng. Các số bên dưới chỉ là kết quả sơ bộ, không dùng để kết luận mô hình "mượt".
              </li>
            </ul>
          </div>
        )}
        <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-4 mt-5">
          <Stat label="Requote Count" value={String(summaryD.requotes)} sub={`Giá thị trường đổi ${summaryD.marketChanges} lần (phạm vi đang xem)`} />
          <Stat label="Lệch trung bình / lớn nhất" value={`${bpsTxt(summaryD.dev.avgBps)} / ${bpsTxt(summaryD.dev.maxBps)}`}
            sub={`${vndTxt(summaryD.dev.avgVnd)} / ${vndTxt(summaryD.dev.maxVnd)}`} />
          <Stat label="Quote Holding Time" value={dur(summaryD.hold.avgSec)}
            sub={summaryD.hold.count ? `Trung vị ${dur(summaryD.hold.medianSec)}, dài nhất ${dur(summaryD.hold.maxSec)}` : 'Chưa có lần Requote nào'} />
          <Stat label="Giá báo đổi ít hơn thị trường" value={reduction !== null ? `${fmtNum(reduction * 100, 0)}%` : '–'}
            sub="1 − số lần Requote / số lần giá thị trường đổi" />
        </div>
        <p className="mt-3 text-[13.5px] text-muted max-w-3xl">
          Độ lệch đo tại từng điểm dữ liệu so với giá báo đang hiệu lực trước khi báo lại, nên điểm kích hoạt có độ lệch từ ngưỡng trở lên.
          Giữa hai điểm dữ liệu giá có thể đã lệch xa hơn mà dữ liệu không ghi lại. Holding Time chỉ tính các lần giá báo đã kết thúc.
        </p>

        <h3 className="serif text-[17px] font-semibold mt-7 mb-1">So sánh ngưỡng 10 / 20 / 30 bps</h3>
        <p className="text-[13.5px] text-muted mb-2">Chạy trên {sessions} / {sorted.length} phiên đủ dữ liệu, độc lập với ngày đang xem.</p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl text-[14px]">
            <thead>
              <tr className="text-muted text-left">
                <th className="font-normal py-1">Ngưỡng</th>
                <th className="font-normal text-right">Requote Count</th>
                <th className="font-normal text-right">Lần/phiên</th>
                <th className="font-normal text-right">Lệch TB</th>
                <th className="font-normal text-right">Lệch lớn nhất</th>
                <th className="font-normal text-right">Holding TB</th>
                <th className="font-normal text-right">Static: ngoài biên</th>
              </tr>
            </thead>
            <tbody>
              {compare.map(({ b, d, s }) => (
                <tr key={b} className={clsx('border-t border-line', b === thr && 'font-semibold')}>
                  <td className="py-1.5 num">±{b} bps</td>
                  <td className="num text-right">{d.requotes}</td>
                  <td className="num text-right">{d.requotesPerDay !== null ? fmtNum(d.requotesPerDay, 1) : '–'}</td>
                  <td className="num text-right">{bpsTxt(d.dev.avgBps)}</td>
                  <td className="num text-right">{bpsTxt(d.dev.maxBps)}</td>
                  <td className="num text-right">{dur(d.hold.avgSec)}</td>
                  <td className="num text-right">{s.outside} / {s.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="serif text-[17px] font-semibold mt-7 mb-2">Từng ngày</h3>
        <div className="overflow-x-auto">
          <table className="w-full max-w-5xl text-[14px]">
            <thead>
              <tr className="text-muted text-left">
                <th className="font-normal py-1">Ngày</th><th className="font-normal">Phiên</th>
                <th className="font-normal text-right">Mở cửa</th><th className="font-normal text-right">Cuối</th>
                <th className="font-normal text-right">Open-to-Close</th><th className="font-normal text-right">High–Low</th>
                <th className="font-normal text-right">Điểm</th><th className="font-normal text-right">Giá đổi</th>
                <th className="font-normal text-right">Phủ 5 phút</th><th className="font-normal text-right">Khoảng trống lớn nhất</th>
                <th className="font-normal text-right">Requote @{thr}</th><th className="font-normal text-right">Ngoài biên</th>
              </tr>
            </thead>
            <tbody>
              {[...sorted].reverse().map((x) => {
                const o = openToClose(x)
                const rq = dynByDate[x.date]
                const stDay = runStatic([x], thr).per[0]
                const c = x.meta?.coverage?.['5m']
                const ok = valid(x)
                return (
                  <tr key={x.date} onClick={() => setPick(x.date)} title={x.meta?.invalid_reason ?? undefined}
                    className={clsx('border-t border-line cursor-pointer hover:bg-fg/5', sel === x.date && 'font-semibold', !ok && 'text-muted')}>
                    <td className="py-1.5 num">{dmy(x.date)}</td>
                    <td>{ok ? 'Đủ dữ liệu' : x.meta?.weekend ? 'Cuối tuần' : 'Thiếu'}</td>
                    <td className="num text-right">{fmtNum(x.open, 0)}</td>
                    <td className="num text-right">{fmtNum(x.last, 0)}</td>
                    <td className={clsx('num text-right', ok && (o > 0 ? 'text-up' : o < 0 ? 'text-down' : ''))}>{pct(o)}</td>
                    <td className="num text-right">{fmtNum(highLow(x), 2)}%</td>
                    <td className="num text-right">{x.n_points}</td>
                    <td className="num text-right">{x.meta?.price_changes ?? '–'}</td>
                    <td className="num text-right">{c ? `${c.actual}/${c.expected} (${fmtNum(c.pct, 1)}%)` : '–'}</td>
                    <td className={clsx('num text-right', (x.meta?.unusual_gaps ?? 0) > 0 && 'text-warn')}>{mins(x.meta?.max_gap_min)}</td>
                    <td className="num text-right">{rq ? rq.requotes : '–'}</td>
                    <td className={clsx('num text-right', stDay.outside > 0 && 'text-down')}>{stDay.outside}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Bấm vào một dòng để xem riêng ngày đó. Đủ dữ liệu nghĩa là ngày trong tuần, có ít nhất {cfg.min_points} điểm thị trường và giá đổi ít nhất {cfg.min_changes} lần.
        </p>
      </Card>

      <Card title="Kiểm tra dữ liệu gốc" subtitle="Số liệu thô Yahoo Finance trả về và số điểm hệ thống giữ lại.">
        {audit && Object.keys(audit.api).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl text-[14px]">
              <thead>
                <tr className="text-muted text-left">
                  <th className="font-normal py-1">Khung</th><th className="font-normal text-right">Nến Yahoo trả về</th>
                  <th className="font-normal text-right">Có giá</th><th className="font-normal text-right">Giá null</th>
                  <th className="font-normal text-right">Giữ giá trùng giá trước</th><th className="font-normal text-right">Nến có giá cuối</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(audit.api).map(([k, a]) => (
                  <tr key={k} className="border-t border-line">
                    <td className="py-1.5">{a.interval} ({a.range})</td>
                    <td className="num text-right">{a.raw_bars}</td>
                    <td className="num text-right">{a.non_null}</td>
                    <td className="num text-right">{a.null} ({a.null_pct !== null ? fmtNum(a.null_pct, 1) : '–'}%)</td>
                    <td className="num text-right">{a.equal_to_previous_kept}</td>
                    <td className="num text-right">{dmyHm(a.last_priced_bar)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[14.5px] text-muted">Bản dữ liệu này chưa có số liệu kiểm toán dữ liệu gốc.</p>
        )}
        <ul className="mt-4 text-[14.5px] max-w-3xl space-y-1.5">
          <li>Yahoo trả đủ lưới thời gian nhưng phần lớn nến không có giá (null). Hệ thống chỉ bỏ các nến null này. Hệ thống không lọc nến có giá không đổi: các nến giá trùng giá trước vẫn được giữ (cột "Giữ giá trùng giá trước").</li>
          <li>Số điểm đã lưu từ {dmy(all.since)}: {audit?.stored_market_points ?? '–'} điểm thị trường. Phần chênh với số nến có giá ở trên là do khung 1 phút và 5 phút trùng thời điểm, hoặc nằm trước {dmy(all.since)}.</li>
          <li>Nến null nghĩa là nguồn không ghi nhận giá, không chứng minh thị trường không giao dịch. Dữ liệu này không cho biết giá đã thật sự đứng yên hay nguồn chưa cập nhật.</li>
        </ul>
      </Card>

      <Card title="Độ phủ dữ liệu">
        <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-4">
          <Stat label="Số điểm dữ liệu" value={String(nPoints)} sub={`${scope.length} ngày đang xem`} />
          <Stat label="Nến 5 phút có giá / kỳ vọng" value={cov.expected ? `${cov.actual} / ${cov.expected}` : '–'}
            sub={cov.expected ? `${fmtNum((cov.actual / cov.expected) * 100, 1)}% trong giờ giao dịch` : 'Chưa có lưới thời gian nguồn'} />
          <Stat label="Khoảng cách điểm (trung vị)"
            value={(() => {
              const v = scope.map((d) => d.meta?.interval_min).filter((x): x is number => x != null)
              return v.length ? mins(v.reduce((a, b) => a + b, 0) / v.length) : '–'
            })()}
            sub="Nguồn chỉ ghi khi giá đổi nên thưa hơn lưới 1 hoặc 5 phút" />
          <Stat label="Nguồn các điểm" value={Object.keys(srcTotals).map((k) => SOURCE_LABEL[k] ?? k).join(', ') || '–'}
            sub={Object.entries(srcTotals).map(([k, v]) => `${SOURCE_LABEL[k] ?? k}: ${v}`).join(' · ')} />
        </div>
        <ul className="mt-4 text-[14.5px] max-w-3xl space-y-1.5">
          {warns.length === 0 && <li className="text-up">Không có cảnh báo thiếu dữ liệu trong phạm vi đã chọn.</li>}
          {warns.map((w, i) => <li key={i} className="text-warn">{w}</li>)}
        </ul>
        <p className="mt-2 text-[13.5px] text-muted max-w-3xl">
          Số điểm kỳ vọng là số ô 5 phút trong giờ giao dịch theo lưới Yahoo trả về; khoảng trống bất thường là khoảng liên tục trên {mins(cfg.unusual_gap_min)} giao dịch không có điểm giá nào (giờ nghỉ không tính).
        </p>
      </Card>

      <Card title="Nguồn giá và hạn chế">
        <ul className="text-[14.5px] max-w-3xl space-y-2">
          <li><b>Yêu cầu ban đầu</b> là giá USD/VND trên Investing.com. <b>Dữ liệu thực tế đang dùng</b> là Yahoo Finance (USDVND=X, nến 1 và 5 phút) cho lịch sử và TradingView (FX_IDC:USDVND) cho mẫu giá hiện tại. Số liệu trên trang này không phải số Investing.</li>
          <li>Lý do: Investing.com không có API công khai và bị chặn từ mạng Việt Nam nên hệ thống không lấy được. Có thể lấy số Investing bằng cách nhập tay hoặc đưa file xuất vào.</li>
          <li>Thời điểm giá: {audit?.last_market_ts ? `giá cuối Yahoo báo lúc ${dmyHm(audit.last_market_ts)}` : 'chưa có'}; mẫu TradingView gần nhất {audit?.tradingview_sample_ts ? `lúc ${dmyHm(audit.tradingview_sample_ts)}` : 'chưa có'}. Giờ theo múi giờ Việt Nam.</li>
          <li>Hạn chế: nguồn chỉ ghi giá khi giá đổi nên rất thưa (chỉ vài điểm mỗi ngày); không có giá mua/bán hay khối lượng; Yahoo và TradingView cho số điểm tương tự nhau nên có thể cùng nguồn gốc, chưa được xác minh; đây là giá tham chiếu quốc tế, không phải giá ngân hàng.</li>
          <li className="text-muted">Nguồn: {all.source}.</li>
        </ul>
      </Card>
    </div>
  )
}
