import clsx from 'clsx'
import type { Metric, Snapshot } from '../types/snapshot'
import { fmtChange, fmtNum, toneOf } from '../utils/format'

interface Row {
  key: string
  name: string
  hint: string
  bid: number | null
  ask: number | null
  bidCh?: number | null
  askCh?: number | null
  color: string
}

const val = (m?: Metric) => m?.value ?? null

function rows(snap: Snapshot): Row[] {
  const m = snap.metrics
  const out: Row[] = [
    { key: 'bank', name: 'Ngân hàng', hint: 'Vietcombank, chuyển khoản', bid: val(m.usdvnd_vcb_buy_transfer), ask: val(m.usdvnd_vcb_sell),
      bidCh: m.usdvnd_vcb_buy_transfer?.change_24h, askCh: m.usdvnd_vcb_sell?.change_24h, color: 'bg-accent' },
    { key: 'free', name: 'Chợ đen', hint: 'Đô la tiền mặt, thị trường tự do', bid: val(m.usdvnd_free_buy), ask: val(m.usdvnd_free_sell),
      bidCh: m.usdvnd_free_buy?.change_24h, askCh: m.usdvnd_free_sell?.change_24h, color: 'bg-fg' },
    { key: 'usdt', name: 'USDT/VND', hint: 'Trung vị 4 sàn P2P, lệnh 50 triệu', bid: val(m.usdtvnd_p2p_bid), ask: val(m.usdtvnd_p2p_ask),
      bidCh: m.usdtvnd_p2p_bid?.change_24h, askCh: m.usdtvnd_p2p_ask?.change_24h, color: 'bg-warn' },
    { key: 'sbv', name: 'NHNN', hint: m.sbv_central_rate?.value != null ? `Mua/bán của NHNN, trung tâm ${fmtNum(m.sbv_central_rate.value, 0)}` : 'Giá mua/bán của NHNN',
      bid: val(m.sbv_buy_rate), ask: val(m.sbv_sell_rate), color: 'bg-muted' },
    { key: 'interbank', name: 'Liên ngân hàng', hint: 'Một giá bình quân, nhập tay', bid: val(m.usdvnd_interbank), ask: null,
      bidCh: m.usdvnd_interbank?.change_24h, color: 'bg-muted' },
    { key: 'fwd', name: 'Kỳ hạn 1 tháng', hint: m.usdvnd_fwd_1m_quote?.value != null ? 'Giá yết nhập tay' : 'Tính theo CIP, không phải giá yết',
      bid: val(m.usdvnd_fwd_1m_quote) ?? val(m.usdvnd_fwd_1m_implied), ask: null, color: 'bg-muted' },
  ]
  return out.filter((r) => r.bid != null || r.ask != null)
}

function Price({ v, ch }: { v: number | null; ch?: number | null }) {
  const t = toneOf(ch)
  return (
    <div className="text-right">
      <div className="num text-[22px] sm:text-[24px] font-semibold leading-tight">{fmtNum(v, 0)}</div>
      <div className={clsx('num text-[12.5px] h-[18px]', t === 'up' && 'text-up', t === 'down' && 'text-down', t === 'flat' && 'text-muted')}>
        {ch != null ? fmtChange(ch, 'đ') : ''}
      </div>
    </div>
  )
}

/**
 * Ba loại giá đô đặt trên cùng một thước, để thấy ngay chênh lệch.
 * Mỗi vạch chạy từ giá mua vào đến giá bán ra của thị trường đó.
 */
export default function FxLadder({ snap }: { snap: Snapshot }) {
  const list = rows(snap)
  if (!list.length) return null
  const values = list.flatMap((r) => [r.bid, r.ask]).filter((v): v is number => v != null)
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const pad = Math.max((hi - lo) * 0.04, 1)
  const pos = (v: number) => ((v - lo + pad) / (hi - lo + 2 * pad)) * 100

  return (
    <div>
      <div className="hidden sm:grid grid-cols-[230px_1fr_104px_104px] gap-x-5 text-[13px] text-muted pb-1.5 border-b border-line">
        <div>Thị trường</div>
        <div>Trên cùng một thước giá</div>
        <div className="text-right">Mua vào</div>
        <div className="text-right">Bán ra</div>
      </div>
      {list.map((r) => {
        const a = r.bid ?? r.ask!
        const b = r.ask ?? r.bid!
        return (
          <div key={r.key} className="grid grid-cols-2 sm:grid-cols-[230px_1fr_104px_104px] gap-x-5 gap-y-1 items-center py-3 border-b border-line">
            <div className="col-span-2 sm:col-span-1">
              <div className="font-semibold">{r.name}</div>
              <div className="text-[12.5px] text-muted leading-snug">{r.hint}</div>
            </div>
            <div className="col-span-2 sm:col-span-1 relative h-3 my-1" aria-hidden>
              <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
              <div className={clsx('absolute top-0 bottom-0 min-w-[3px]', r.color)}
                style={{ left: `${pos(a)}%`, width: `${Math.max(pos(b) - pos(a), 0.5)}%` }} />
            </div>
            <Price v={r.bid} ch={r.bidCh} />
            <Price v={r.ask} ch={r.askCh} />
          </div>
        )
      })}
      <div className="flex justify-between text-[12.5px] text-muted num pt-1.5 sm:ml-[250px] sm:mr-[248px]">
        <span>{fmtNum(lo, 0)}</span><span>{fmtNum(hi, 0)}</span>
      </div>
    </div>
  )
}
