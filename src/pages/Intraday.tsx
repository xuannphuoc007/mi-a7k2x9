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
type Mode = 'static' | 'dynamic'

const ALL = 'all'
const SOURCE_LABEL: Record<string, string> = {
  y1: 'Yahoo 1 phút', y5: 'Yahoo 5 phút', tv: 'TradingView', old: 'Đã lưu (không rõ khung)',
}

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
const hm = (t: number) =>
  new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(t * 1000))
const dmyHm = (t: number) =>
  new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000))
const dur = (sec: number | null) => {
  if (sec === null) return '–'
  if (sec < 90) return `${Math.round(sec)} giây`
  if (sec < 5400) return `${fmtNum(sec / 60, 0)} phút`
  return `${fmtNum(sec / 3600, 1)} giờ`
}

export default function IntradayPage() {
  const { snap } = useData()
  const [fresh, setFresh] = useState<Intraday | null>(null)
  const [mode, setMode] = useState<Mode>('dynamic')
  const [thr, setThr] = useState(30)
  const [pick, setPick] = useState<string>(ALL)
  const [runInfo, setRunInfo] = useState<{ at: number; msg: string | null } | null>(null)
  const [busy, setBusy] = useState(false)
  const all = fresh ?? snap?.tables.intraday

  const sorted = useMemo(() => (all ? [...all.days].sort((a, b) => a.date.localeCompare(b.date)) : []), [all])
  const scope = useMemo(() => {
    const one = sorted.filter((d) => d.date === pick)
    return pick === ALL || one.length === 0 ? sorted : one
  }, [sorted, pick])
  const dyn = useMemo(() => runDynamic(scope, thr), [scope, thr])
  const sta = useMemo(() => runStatic(scope, thr), [scope, thr])
  const compare = useMemo(
    () => COMPARE_BPS.map((b) => ({ b, d: runDynamic(scope, b).summary, s: runStatic(scope, b).summary })),
    [scope],
  )
  const dynAllDays = useMemo(() => runDynamic(sorted, thr).per, [sorted, thr])
  const dynByDate = useMemo(() => Object.fromEntries(dynAllDays.map((r) => [r.date, r])), [dynAllDays])

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

  const first = scope[0]
  const latest = scope[scope.length - 1]
  const price = scope.flatMap((d) => d.points.map(([t, v]) => [t, v] as [number, number]))
  const staticLine = (key: 'hi' | 'lo' | 'open') => sta.per.flatMap((r, i) => scope[i].points.map(([t]) => [t, r[key]] as [number, number]))
  const widest = scope.reduce((a, b) => (highLow(b) > highLow(a) ? b : a))
  const o2c = (latest.last / first.open - 1) * 100
  const summaryD = dyn.summary
  const summaryS = sta.summary
  const lastPoint = Math.max(...scope.map((d) => d.meta?.last_point_at ?? d.points[d.points.length - 1][0]))
  const nPoints = scope.reduce((s, d) => s + d.n_points, 0)
  const srcTotals = scope.reduce<Record<string, number>>((m, d) => {
    Object.entries(d.meta?.sources ?? {}).forEach(([k, v]) => { m[k] = (m[k] ?? 0) + v })
    return m
  }, {})
  const warns = scope.flatMap((d) => (d.meta?.warnings ?? []).filter((w) => !w.startsWith('Cuối tuần')).map((w) => `${dmy(d.date)}: ${w}`))
  const weekendDays = scope.filter((d) => (d.meta?.warnings ?? []).some((w) => w.startsWith('Cuối tuần'))).map((d) => dmy(d.date).slice(0, 5))
  const events = dyn.per.flatMap((r) => r.events)
  const reduction = summaryD.changeReduction

  return (
    <div className="space-y-9">
      <PageHeader
        title="USD/VND trong ngày"
        desc={`Giá từ ngày ${dmy(sorted[0].date)} đến ${dmy(sorted[sorted.length - 1].date)}. Mỗi ngày mô phỏng độc lập từ giá mở cửa của ngày đó.`}
      />

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
            <select value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Chọn ngày"
              className="num bg-transparent border-b border-fg/40 hover:border-fg py-1 px-1 outline-none cursor-pointer">
              <option value={ALL} className="bg-panel text-fg">Tất cả các ngày</option>
              {[...sorted].reverse().map((d) => (
                <option key={d.date} value={d.date} className="bg-panel text-fg">{dmy(d.date)}</option>
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
          Nút "Chạy lại mô phỏng" tải bản dữ liệu mới nhất từ máy chủ rồi chạy lại.
          {runInfo && <> Lần chạy lúc {hm(runInfo.at)}: {nPoints} điểm, {scope.length} ngày.</>}
          {runInfo?.msg && <span className="text-warn"> {runInfo.msg}</span>}
        </p>
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

      <Card title="Giá báo có ổn định hơn không?"
        subtitle={`Kết quả mô phỏng ngưỡng ±${thr} bps trên ${summaryD.points} điểm giá, ${summaryD.days} ngày, tính lại mỗi khi đổi dữ liệu.`}>
        <p className="text-[15.5px] max-w-3xl">
          {summaryD.marketChanges === 0
            ? 'Giá thị trường không đổi trong dữ liệu đã chọn nên chưa so sánh được.'
            : <>
              Giá thị trường đổi <b>{summaryD.marketChanges}</b> lần, giá báo chỉ đổi <b>{summaryD.requotes}</b> lần
              {reduction !== null && <> (ít hơn {fmtNum(reduction * 100, 0)}%)</>}. Giá báo lệch so với thị trường trung bình{' '}
              <b>{bpsTxt(summaryD.dev.avgBps)}</b> ({vndTxt(summaryD.dev.avgVnd)}), lệch lớn nhất <b>{bpsTxt(summaryD.dev.maxBps)}</b> ({vndTxt(summaryD.dev.maxVnd)}).
            </>}
        </p>
        <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-4 mt-5">
          <Stat label="Requote Count" value={String(summaryD.requotes)} sub={`Giá thị trường đổi ${summaryD.marketChanges} lần`} />
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

        <h3 className="serif text-[17px] font-semibold mt-7 mb-2">So sánh ngưỡng 10 / 20 / 30 bps</h3>
        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl text-[14px]">
            <thead>
              <tr className="text-muted text-left">
                <th className="font-normal py-1">Ngưỡng</th>
                <th className="font-normal text-right">Requote Count</th>
                <th className="font-normal text-right">Lần/ngày</th>
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
          <table className="w-full max-w-4xl text-[14px]">
            <thead>
              <tr className="text-muted text-left">
                <th className="font-normal py-1">Ngày</th><th className="font-normal text-right">Mở cửa</th>
                <th className="font-normal text-right">Cuối</th><th className="font-normal text-right">Open-to-Close</th>
                <th className="font-normal text-right">High–Low</th><th className="font-normal text-right">Điểm</th>
                <th className="font-normal text-right">Requote @{thr}</th><th className="font-normal text-right">Ngoài biên</th>
              </tr>
            </thead>
            <tbody>
              {[...sorted].reverse().map((x) => {
                const o = openToClose(x)
                const rq = dynByDate[x.date]
                const stDay = runStatic([x], thr).per[0]
                return (
                  <tr key={x.date} onClick={() => setPick(x.date)}
                    className={clsx('border-t border-line cursor-pointer hover:bg-fg/5', pick === x.date && 'font-semibold')}>
                    <td className="py-1.5 num">{dmy(x.date)}</td>
                    <td className="num text-right">{fmtNum(x.open, 0)}</td>
                    <td className="num text-right">{fmtNum(x.last, 0)}</td>
                    <td className={clsx('num text-right', o > 0 ? 'text-up' : o < 0 ? 'text-down' : '')}>{pct(o)}</td>
                    <td className="num text-right">{fmtNum(highLow(x), 2)}%</td>
                    <td className="num text-right">{x.n_points}</td>
                    <td className="num text-right">{rq ? rq.requotes : '–'}</td>
                    <td className={clsx('num text-right', stDay.outside > 0 && 'text-down')}>{stDay.outside}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[13px] text-muted">Bấm vào một dòng để xem riêng ngày đó.</p>
      </Card>

      <Card title="Nguồn và chất lượng dữ liệu">
        <div className="grid gap-x-8 gap-y-5 grid-cols-2 lg:grid-cols-4">
          <Stat label="Số điểm dữ liệu" value={String(nPoints)} sub={`${scope.length} ngày`} />
          <Stat label="Điểm giá cuối" value={dmyHm(lastPoint)} sub={`Số liệu cập nhật lúc ${snap.generated_at ? dmyHm(new Date(snap.generated_at).getTime() / 1000) : '–'}`} />
          <Stat label="Khoảng cách điểm (trung vị)"
            value={(() => {
              const v = scope.map((d) => d.meta?.interval_min).filter((x): x is number => x != null)
              return v.length ? `${fmtNum(v.reduce((a, b) => a + b, 0) / v.length, 0)} phút` : '–'
            })()}
            sub="Yahoo chỉ ghi điểm khi giá đổi nên thưa hơn lưới 1 hoặc 5 phút" />
          <Stat label="Nguồn các điểm"
            value={Object.keys(srcTotals).map((k) => SOURCE_LABEL[k] ?? k).join(', ') || '–'}
            sub={Object.entries(srcTotals).map(([k, v]) => `${SOURCE_LABEL[k] ?? k}: ${v}`).join(' · ')} />
        </div>
        <ul className="mt-4 text-[14.5px] max-w-3xl space-y-1.5">
          {warns.length === 0 && <li className="text-up">Không có cảnh báo thiếu dữ liệu trong phạm vi đã chọn.</li>}
          {warns.map((w, i) => <li key={i} className="text-warn">{w}</li>)}
          {weekendDays.length > 0 && <li className="text-muted">Cuối tuần ({weekendDays.join(', ')}): thị trường ngoại hối nghỉ nên ít điểm là bình thường.</li>}
        </ul>
        <p className="mt-3 text-[14.5px] text-muted max-w-3xl">
          Nguồn: {all.source}. Khung 1 phút (Yahoo giữ khoảng 7 ngày) được ưu tiên hơn 5 phút khi trùng thời điểm.
          Đây là giá tham chiếu quốc tế, không phải giá ngân hàng.
        </p>
      </Card>
    </div>
  )
}
