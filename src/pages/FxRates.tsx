import clsx from 'clsx'
import { useState } from 'react'
import FxLadder from '../components/FxLadder'
import { Card, EmptyState, PageHeader, Segmented } from '../components/ui'
import { useData } from '../hooks/useData'
import type { FxGap, Metric, Snapshot } from '../types/snapshot'
import { fmtNum, fmtPct, fmtTime } from '../utils/format'

function Gap({ label, g }: { label: string; g?: FxGap | null }) {
  if (!g) return null
  return (
    <div className="border-t border-line pt-2.5">
      <div className="label">{label}</div>
      <div className="num text-[24px] font-semibold leading-tight mt-0.5">{g.vnd > 0 ? '+' : ''}{fmtNum(g.vnd, 0)} <span className="text-[14px] font-normal text-muted">đồng</span></div>
      <div className="num text-[13.5px] text-muted">{fmtPct(g.pct)}</div>
    </div>
  )
}

interface BoardRow { name: string; ref: string; note?: string; text: string; unit: string; when: string }

const has = (m?: Metric): m is Metric => !!m && m.value != null

function boardRows(snap: Snapshot): BoardRow[] {
  const m = snap.metrics
  const when = (x: Metric) => (x.quality === 'manual' && x.period ? `${x.period} (nhập tay)` : x.period ?? fmtTime(x.timestamp))
  const out: BoardRow[] = []
  if (has(m.usdvnd_free_buy) && has(m.usdvnd_free_sell)) {
    out.push({ name: 'USD thị trường tự do (chợ đen)', ref: 'Thị trường tự do trong nước, tiền mặt. Số do các trang tygiausd.org, tygia.vn công bố. Mua vào / bán ra.',
      text: `${fmtNum(m.usdvnd_free_buy.value, 0)} / ${fmtNum(m.usdvnd_free_sell.value, 0)}`, unit: 'đồng/USD', when: when(m.usdvnd_free_sell) })
  }
  if (has(m.usdvnd_interbank)) {
    out.push({ name: 'USD giao dịch giữa các ngân hàng', ref: 'Thị trường liên ngân hàng trong nước, tỷ giá bình quân.',
      text: fmtNum(m.usdvnd_interbank.value, 0), unit: 'đồng/USD', when: when(m.usdvnd_interbank) })
  }
  if (has(m.sbv_central_rate)) {
    out.push({ name: 'Tỷ giá tham chiếu NHNN', ref: 'Tỷ giá trung tâm NHNN công bố mỗi ngày làm việc, không phải giá giao dịch.',
      note: `Nguồn: ${m.sbv_central_rate.source}.`, text: fmtNum(m.sbv_central_rate.value, 0), unit: 'đồng/USD', when: when(m.sbv_central_rate) })
  }
  const fwd = has(m.usdvnd_fwd_1m_quote) ? m.usdvnd_fwd_1m_quote : has(m.usdvnd_fwd_1m_implied) ? m.usdvnd_fwd_1m_implied : null
  if (fwd) {
    const quoted = fwd === m.usdvnd_fwd_1m_quote
    out.push({ name: 'USD/VND kỳ hạn 1 tháng', ref: quoted ? 'Giá forward do ngân hàng hoặc nhà cung cấp dữ liệu yết, nhập tay.'
      : 'Giá tính theo ngang giá lãi suất (CIP) từ spot và lãi suất hai đồng tiền, không phải giá ngân hàng yết.',
      text: fmtNum(fwd.value, 0), unit: 'đồng/USD', when: when(fwd) })
  }
  if (has(m.interbank_overnight_rate)) {
    out.push({ name: 'Lãi suất vay VND qua đêm', ref: 'Thị trường liên ngân hàng VND trong nước, lãi suất bình quân kỳ hạn qua đêm.',
      text: fmtNum(m.interbank_overnight_rate.value, 2), unit: '%/năm', when: when(m.interbank_overnight_rate) })
  }
  if (has(m.interbank_usd_overnight_rate)) {
    out.push({ name: 'Lãi suất vay USD qua đêm', ref: 'Thị trường liên ngân hàng USD trong nước, lãi suất bình quân kỳ hạn qua đêm.',
      text: fmtNum(m.interbank_usd_overnight_rate.value, 2), unit: '%/năm', when: when(m.interbank_usd_overnight_rate) })
  } else if (has(m.sofr)) {
    out.push({ name: 'Lãi suất vay USD qua đêm', ref: 'SOFR: thị trường repo trái phiếu kho bạc Mỹ, lãi suất USD qua đêm tham chiếu quốc tế. Không phải lãi suất liên ngân hàng trong nước Việt Nam.',
      text: fmtNum(m.sofr.value, 2), unit: '%/năm', when: when(m.sofr) })
  }
  return out
}

const best = (cond: boolean) => clsx(cond && 'font-semibold text-up')

export default function FxRates() {
  const { snap } = useData()
  const fx = snap?.tables.fx
  const sizes = fx?.trade_sizes_vnd ?? []
  const [picked, setPicked] = useState<string | null>(null)
  if (!snap) return null
  const board = boardRows(snap)
  if (!fx) return <EmptyState title="Ngày này chưa có bảng tỷ giá">Hệ thống bắt đầu lưu bảng này từ ngày 05/11/2026.</EmptyState>

  const size = Number(picked ?? fx.reference_size_vnd ?? sizes[0])
  const vcb = fx.banks.find((b) => b.id === 'vcb')?.sell ?? null
  const rows = fx.platforms
    .map((p) => ({ p, r: p.by_size.find((s) => s.size_vnd === size) }))
    .filter((x) => x.r && (x.r.bid != null || x.r.ask != null))
  const maxBid = Math.max(...rows.map((x) => x.r!.bid ?? -Infinity))
  const minAsk = Math.min(...rows.map((x) => x.r!.ask ?? Infinity))
  const bankSellMin = Math.min(...fx.banks.map((b) => b.sell ?? Infinity))
  const bankBuyMax = Math.max(...fx.banks.map((b) => b.buy_transfer ?? -Infinity))
  const sameFree = fx.free.length > 1 && fx.free.every((q) => q.buy === fx.free[0].buy && q.sell === fx.free[0].sell)

  return (
    <div className="space-y-9">
      <PageHeader title="Tỷ giá" desc="Mua vào là giá họ mua đô của bạn. Bán ra là giá họ bán đô cho bạn. Màu xanh là giá có lợi nhất cho bạn trong bảng." />

      <FxLadder snap={snap} />

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <Gap label="Chợ đen so với ngân hàng (giá bán)" g={fx.gaps.free_vs_bank} />
        <Gap label="USDT so với ngân hàng" g={fx.gaps.usdt_vs_bank} />
        <Gap label="USDT so với chợ đen" g={fx.gaps.usdt_vs_free} />
      </div>

      {board.length > 0 && (
        <Card title="Tỷ giá và lãi suất tham chiếu" subtitle="Mỗi dòng ghi rõ thị trường tham chiếu. Chỉ số chưa có dữ liệu thì không hiển thị.">
          <div className="overflow-x-auto">
            <table className="table-news">
              <thead><tr><th>Chỉ số</th><th>Giá trị</th><th>Thị trường tham chiếu</th><th className="hidden sm:table-cell">Cập nhật</th></tr></thead>
              <tbody>
                {board.map((r) => (
                  <tr key={r.name}>
                    <td className="font-semibold !whitespace-normal min-w-[150px]">{r.name}</td>
                    <td className="num whitespace-nowrap">{r.text} <span className="text-[13px] text-muted">{r.unit}</span></td>
                    <td className="!whitespace-normal !text-left text-[13.5px] text-muted min-w-[240px] max-w-md pl-4 !text-left leading-snug">{r.ref}{r.note ? ` ${r.note}` : ''}</td>
                    <td className="hidden sm:table-cell text-muted text-[13px]">{r.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {fx.banks.length > 0 && (
        <Card title="Ngân hàng" subtitle="Tỷ giá niêm yết của từng ngân hàng, đồng trên 1 USD.">
          <div className="overflow-x-auto">
            <table className="table-news">
              <thead><tr><th>Ngân hàng</th><th>Mua tiền mặt</th><th>Mua chuyển khoản</th><th>Bán ra</th><th className="hidden sm:table-cell">Cập nhật</th></tr></thead>
              <tbody>
                {fx.banks.map((b) => (
                  <tr key={b.id}>
                    <td className="font-semibold">{b.name}</td>
                    <td>{fmtNum(b.buy_cash, 0)}</td>
                    <td className={best(b.buy_transfer === bankBuyMax)}>{fmtNum(b.buy_transfer, 0)}</td>
                    <td className={best(b.sell === bankSellMin)}>{fmtNum(b.sell, 0)}</td>
                    <td className="hidden sm:table-cell text-muted text-[13px]">{fmtTime(b.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {fx.free.length > 0 && (
        <Card title="Chợ đen" subtitle={`Không có nguồn chính thức, số do các trang tỷ giá công bố.${sameFree ? ' Các trang đang báo cùng một giá, nhiều khả năng dùng chung nguồn nên chưa phải là đối chiếu độc lập.' : ''}`}>
          <div className="overflow-x-auto">
            <table className="table-news">
              <thead><tr><th>Nguồn</th><th>Mua vào</th><th>Bán ra</th><th className="hidden sm:table-cell">Lúc lấy</th></tr></thead>
              <tbody>
                {fx.free.map((q) => (
                  <tr key={q.source}>
                    <td><a className="font-semibold hover:underline" href={q.url} target="_blank" rel="noreferrer">{q.source}</a></td>
                    <td>{fmtNum(q.buy, 0)}</td>
                    <td>{fmtNum(q.sell, 0)}</td>
                    <td className="hidden sm:table-cell text-muted text-[13px]">{fmtTime(q.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {rows.length > 0 && (
        <Card title="USDT/VND trên các sàn"
          subtitle="Giá tốt nhất trong các quảng cáo P2P đủ hạn mức cho lệnh này, chuyển khoản ngân hàng, người đăng có tỷ lệ hoàn thành từ 95%."
          right={<div className="flex items-center gap-3"><span className="label">Lệnh</span><Segmented value={String(size)} onChange={setPicked}
            options={sizes.map((s) => ({ value: String(s), label: s >= 1e9 ? `${s / 1e9} tỷ` : `${s / 1e6} tr` }))} /></div>}>
          <div className="overflow-x-auto">
            <table className="table-news">
              <thead><tr><th>Sàn</th><th>Mua vào</th><th>Bán ra</th><th>Chênh mua–bán</th><th>So với Vietcombank</th><th className="hidden md:table-cell">Số quảng cáo đủ điều kiện</th></tr></thead>
              <tbody>
                {rows.map(({ p, r }) => (
                  <tr key={p.id}>
                    <td className="font-semibold">{p.name}</td>
                    <td className={best(r!.bid === maxBid)}>{fmtNum(r!.bid, 0)}</td>
                    <td className={best(r!.ask === minAsk)}>{fmtNum(r!.ask, 0)}</td>
                    <td>{r!.spread_pct != null ? fmtPct(r!.spread_pct, 2, false) : '—'}</td>
                    <td>{r!.mid != null && vcb ? fmtPct((r!.mid / vcb - 1) * 100) : '—'}</td>
                    <td className="hidden md:table-cell text-muted">{r!.bid_count} / {r!.ask_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {snap.metrics.usdtvnd_reference?.value != null && (
            <p className="text-[13.5px] text-muted mt-3">
              Để so sánh: quy đổi theo tỷ giá quốc tế (CoinGecko), 1 USDT = <span className="num">{fmtNum(snap.metrics.usdtvnd_reference.value, 0)}</span> đồng.
            </p>
          )}
        </Card>
      )}
    </div>
  )
}
