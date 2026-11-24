import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { LazySeries } from '../charts/lazy'
import type { P2PIntraday as Data, P2PTick } from '../types/snapshot'
import { fmtNum } from '../utils/format'
import BandGauge from './BandGauge'
import { Card, EmptyState } from './ui'

const vnDate = (t: number) => new Date(t * 1000).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const hm = (t: number) => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' }).format(new Date(t * 1000))
const dmy = (d: string) => d.split('-').reverse().join('/')
const f0 = (v: number | null | undefined) => fmtNum(v, 0)
const pct = (v: number) => `${v >= 0 ? '+' : ''}${fmtNum(v, 2)}%`
const mid = (k: P2PTick) => (k.buy && k.sell ? (k.buy + k.sell) / 2 : k.buy ?? k.sell ?? null)

function Side({ title, hint, best, med, n, prev }: { title: string; hint: string; best: number | null; med: number | null; n: number; prev: number | null }) {
  const ch = best && prev ? best - prev : null
  return (
    <div className="border-t border-line pt-2.5">
      <div className="label">{title}</div>
      <div className="num text-[28px] font-semibold leading-tight mt-1">{f0(best)}</div>
      <div className="text-[13px] text-muted">
        {hint} · trung vị top {n}: <span className="num">{f0(med)}</span>
        {ch !== null && ch !== 0 && <span className={clsx('num ml-1', ch > 0 ? 'text-up' : 'text-down')}>({ch > 0 ? '+' : ''}{f0(ch)} so với lần trước)</span>}
      </div>
    </div>
  )
}

export default function P2PIntraday({ data }: { data?: Data }) {
  const [pick, setPick] = useState<string | null>(null)
  const byDay = useMemo(() => {
    const m = new Map<string, P2PTick[]>()
    for (const k of data?.ticks ?? []) {
      if (mid(k) === null) continue
      const d = vnDate(k.t)
      m.set(d, [...(m.get(d) ?? []), k])
    }
    return m
  }, [data])
  const dates = [...byDay.keys()].sort()

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-3 pt-4">
      <div>
        <h2 className="serif text-[26px] font-semibold leading-tight">USDT/VND P2P Binance</h2>
        <p className="text-[15px] text-muted mt-1 max-w-3xl">
          Giá chào mua/bán USDT trên Binance P2P, lấy mỗi lần web cập nhật (khoảng 30 phút một lần trong giờ làm việc).
        </p>
      </div>
      {dates.length > 1 && (
        <select value={pick ?? dates[dates.length - 1]} onChange={(e) => setPick(e.target.value)} aria-label="Chọn ngày P2P"
          className="num bg-transparent border-b border-fg/40 hover:border-fg py-1 px-1 text-[14px] outline-none cursor-pointer">
          {[...dates].reverse().map((d) => <option key={d} value={d} className="bg-panel text-fg">{dmy(d)}</option>)}
        </select>
      )}
    </div>
  )

  if (!data || dates.length === 0) {
    return (
      <div className="space-y-6">
        {header}
        <EmptyState title="Chưa có dữ liệu">Điểm giá đầu tiên sẽ có sau lần cập nhật kế tiếp.</EmptyState>
      </div>
    )
  }

  const day = pick && byDay.has(pick) ? pick : dates[dates.length - 1]
  const ticks = byDay.get(day)!
  const first = ticks[0]
  const last = ticks[ticks.length - 1]
  const prev = ticks.length > 1 ? ticks[ticks.length - 2] : null
  const ref = mid(first)!
  const devs = ticks.map((k) => (mid(k)! / ref - 1) * 100)
  const dev = devs[devs.length - 1]
  const band = data.band_pct
  const outTicks = ticks.filter((_, i) => Math.abs(devs[i]) > band)
  const spread = last.buy && last.sell ? last.buy - last.sell : null
  const lineOf = (key: 'buy' | 'sell') => ticks.filter((k) => k[key]).map((k) => [k.t, k[key]!] as [number, number])
  const flat = (v: number) => ticks.map((k) => [k.t, v] as [number, number])

  return (
    <div className="space-y-7">
      {header}

      <div className="grid gap-x-8 gap-y-5 grid-cols-1 sm:grid-cols-3">
        <Side title="Mua USDT (giá bán thấp nhất)" hint={`${dmy(day).slice(0, 5)} ${hm(last.t)}`} best={last.buy} med={last.buy_med} n={last.n_buy} prev={prev?.buy ?? null} />
        <Side title="Bán USDT (giá mua cao nhất)" hint={`${dmy(day).slice(0, 5)} ${hm(last.t)}`} best={last.sell} med={last.sell_med} n={last.n_sell} prev={prev?.sell ?? null} />
        <div className="border-t border-line pt-2.5">
          <div className="label">Chênh mua – bán</div>
          <div className="num text-[28px] font-semibold leading-tight mt-1">{spread === null ? '—' : `${f0(spread)} đ`}</div>
          <div className="text-[13px] text-muted">
            {spread !== null && last.sell ? `${fmtNum((spread / last.sell) * 100, 2)}% · ` : ''}giữa {f0(mid(last))}
          </div>
        </div>
      </div>

      <Card title={`Biên ±${fmtNum(band, 1)}% trong ngày`}
        subtitle={`Mốc là giá giữa (trung bình mua và bán) ở lần lấy đầu tiên trong ngày: ${f0(ref)} lúc ${hm(first.t)}. Thanh đậm là khoảng cao–thấp đã đi qua, chấm là giá hiện tại.`}>
        <BandGauge dev={dev} low={Math.min(...devs)} high={Math.max(...devs)} band={band} refLabel={`đầu ngày (${hm(first.t)})`} />
        <p className="text-[13.5px] text-muted mt-3">
          {ticks.length} lần lấy giá trong ngày, {outTicks.length ? <span className="text-warn">{outTicks.length} lần ngoài biên ({outTicks.map((k) => hm(k.t)).join(', ')})</span> : 'không lần nào ngoài biên'}.
        </p>
      </Card>

      {ticks.length > 1 && (
        <Card title="Diễn biến trong ngày" subtitle={`Đường nét đứt là ±${fmtNum(band, 1)}% quanh mốc đầu ngày.`}>
          <LazySeries timeAxis height={240} unit="VND" lines={[
            { key: 'buy', label: 'Mua USDT', points: lineOf('buy'), color: 'rgb(var(--down))', step: true },
            { key: 'sell', label: 'Bán USDT', points: lineOf('sell'), color: 'rgb(var(--up))', step: true },
            { key: 'hi', label: `+${fmtNum(band, 1)}%`, points: flat(ref * (1 + band / 100)), dashed: true, color: 'rgb(var(--warn))' },
            { key: 'lo', label: `−${fmtNum(band, 1)}%`, points: flat(ref * (1 - band / 100)), dashed: true, color: 'rgb(var(--warn))' },
          ]} />
        </Card>
      )}

      <Card title="Các lần lấy giá" subtitle="Mới nhất ở trên.">
        <div className="overflow-x-auto">
          <table className="table-news">
            <thead><tr><th>Giờ</th><th>Mua USDT</th><th>Trung vị mua</th><th>Bán USDT</th><th>Trung vị bán</th><th>Chênh</th><th>So với đầu ngày</th></tr></thead>
            <tbody>
              {[...ticks].reverse().map((k) => {
                const d = (mid(k)! / ref - 1) * 100
                return (
                  <tr key={k.t}>
                    <td className="num">{hm(k.t)}</td>
                    <td>{f0(k.buy)}</td><td className="text-muted">{f0(k.buy_med)}</td>
                    <td>{f0(k.sell)}</td><td className="text-muted">{f0(k.sell_med)}</td>
                    <td>{k.buy && k.sell ? f0(k.buy - k.sell) : '—'}</td>
                    <td className={clsx(Math.abs(d) > band ? 'text-down font-semibold' : d > 0 ? 'text-up' : d < 0 ? 'text-down' : undefined)}>{pct(d)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-[13px] text-muted">
        Nguồn: {data.source}. Bộ lọc: lệnh {fmtNum(data.amount_vnd / 1e6, 0)} triệu đồng, tỷ lệ hoàn thành ≥ {fmtNum(data.min_completion_rate * 100, 0)}%,
        ≥ {data.min_month_orders} lệnh/tháng, đủ USDT cho cả lệnh; lấy {data.top_n} giá tốt nhất. Giá chào trên P2P, không phải giá khớp.
      </p>
    </div>
  )
}
