import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import FxLadder from '../components/FxLadder'
import RegimeBanner from '../components/RegimeBanner'
import { Card, Change } from '../components/ui'
import { useData } from '../hooks/useData'
import type { NewsItem, Snapshot } from '../types/snapshot'
import { compact, fmtNum, fmtTime, toneOf } from '../utils/format'

const COINS = [
  ['btc', 'BTC', 'Bitcoin'], ['eth', 'ETH', 'Ethereum'], ['sol', 'SOL', 'Solana'],
  ['xrp', 'XRP', ''], ['bnb', 'BNB', ''],
] as const

function priceText(v: number): string {
  return fmtNum(v, v >= 1000 ? 0 : v >= 10 ? 2 : 4)
}

function CoinTable({ snap }: { snap: Snapshot }) {
  const m = snap.metrics
  const rows = COINS.filter(([k]) => m[`${k}_price`]?.value != null)
  if (!rows.length) return null
  const maxMove = Math.max(1, ...rows.map(([k]) => Math.abs(m[`${k}_price`]?.change_24h ?? 0)))
  return (
    <div className="overflow-x-auto">
      <table className="table-news">
        <thead>
          <tr>
            <th>Đồng</th><th>Giá (USD)</th><th className="min-w-[150px]">24 giờ</th><th>7 ngày</th>
            <th className="hidden sm:table-cell">Vốn hoá</th><th className="hidden sm:table-cell">Khối lượng 24h</th>
            <th className="hidden md:table-cell" title="Phí vị thế mỗi 8 giờ trên OKX. Dương: phe mua đang trả phí cho phe bán.">Funding</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, sym, name]) => {
            const p = m[`${k}_price`]
            const ch = p.change_24h ?? null
            const t = toneOf(ch)
            return (
              <tr key={k}>
                <td><span className="font-semibold">{sym}</span> <span className="text-muted text-[13px] hidden sm:inline">{name}</span></td>
                <td className="font-semibold">{priceText(p.value!)}</td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-14 h-2 flex justify-end" aria-hidden>
                      <div className={clsx('h-full', t === 'up' ? 'bg-up' : 'bg-down')} style={{ width: `${(Math.abs(ch ?? 0) / maxMove) * 100}%` }} />
                    </div>
                    <Change v={ch} className="w-[66px] text-right" />
                  </div>
                </td>
                <td><Change v={p.change_7d} /></td>
                <td className="hidden sm:table-cell">{m[`${k}_mcap`]?.value != null ? compact(m[`${k}_mcap`].value!) : '—'}</td>
                <td className="hidden sm:table-cell">{m[`${k}_volume_24h`]?.value != null ? compact(m[`${k}_volume_24h`].value!) : '—'}</td>
                <td className="hidden md:table-cell">{m[`${k}_funding`]?.value != null ? `${fmtNum(m[`${k}_funding`].value!, 4)}%` : '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function feelLabel(v: number): [string, string] {
  if (v < 25) return ['Rất sợ hãi', 'text-down']
  if (v < 45) return ['Sợ hãi', 'text-down']
  if (v <= 55) return ['Trung tính', 'text-fg']
  if (v <= 75) return ['Tham lam', 'text-up']
  return ['Rất tham lam', 'text-up']
}

function Sentiment({ v }: { v: number }) {
  const [label, tone] = feelLabel(v)
  return (
    <div>
      <div className="label">Tâm lý nhà đầu tư crypto</div>
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className={clsx('serif text-[24px] font-semibold leading-tight', tone)}>{label}</span>
        <span className="num text-[14px] text-muted">{fmtNum(v, 0)}/100</span>
      </div>
      <div className="relative h-1.5 mt-2.5 bg-panel2" aria-hidden>
        <div className="absolute -top-1 -bottom-1 w-[3px] bg-fg" style={{ left: `calc(${v}% - 1.5px)` }} />
      </div>
      <div className="flex justify-between text-[12px] text-muted mt-1"><span>Sợ hãi</span><span>Tham lam</span></div>
    </div>
  )
}

const TONE = {
  positive: ['Tích cực', 'text-up'],
  negative: ['Tiêu cực', 'text-down'],
  neutral: ['Trung tính', 'text-muted'],
} as const

function Story({ n }: { n: NewsItem }) {
  const fx = n.effects ?? []
  const tone = n.tone ? TONE[n.tone.label] : null
  return (
    <article className="py-3.5 border-b border-line">
      <div className="text-[13px] font-semibold text-accent">{n.topic_label}</div>
      <h3 className="serif text-[18px] font-semibold leading-snug mt-0.5">
        <a href={n.link} target="_blank" rel="noreferrer" className="hover:underline">{n.title}</a>
      </h3>
      <p className="text-[14px] text-muted mt-1">{n.effects_basis ?? n.why}</p>
      <dl className="grid grid-cols-[108px_minmax(0,1fr)] gap-x-2 text-[13px] mt-1.5">
        <dt className="text-muted">Hướng tác động</dt>
        <dd>
          {fx.length > 0
            ? fx.map((e, i) => (
              <span key={e.market}>{i > 0 && ', '}<span className="whitespace-nowrap">{e.market} <b className="font-semibold">{e.dir === 'up' ? '▲ tăng' : '▼ giảm'}</b></span></span>
            ))
            : <span className="text-muted">Chưa rõ hướng ({n.markets.join(', ')})</span>}
        </dd>
        {tone && (
          <>
            <dt className="text-muted">Giọng tin</dt>
            <dd className={clsx('font-medium', tone[1])}>{tone[0]} <span className="num font-normal text-muted">{Math.round(n.tone!.score * 100)}%</span></dd>
          </>
        )}
        {(n.reaction?.length ?? 0) > 0 && (
          <>
            <dt className="text-muted">Thực tế 24 giờ</dt>
            <dd>
              {n.reaction!.map((r, i) => (
                <span key={r.label}>{i > 0 && ', '}<span className="whitespace-nowrap">{r.label} <Change v={r.value} unit={r.unit} /></span></span>
              ))}
            </dd>
          </>
        )}
      </dl>
      <div className="text-[12.5px] text-muted mt-0.5">
        {n.sources.join(', ')} · <span className="num">{fmtTime(n.published)}</span>
      </div>
    </article>
  )
}

export default function Overview() {
  const { snap, isLatest } = useData()
  const loc = useLocation()
  if (!snap) return null
  const dg = snap.tables.digest
  const news = snap.tables.news ?? []
  const fng = snap.metrics.fear_greed?.value
  const mcap = snap.metrics.total_mcap

  return (
    <div className="space-y-9">
      <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[1fr_280px]">
        <section>
          {dg && (
            <>
              <h1 className="serif text-[30px] sm:text-[38px] font-semibold leading-[1.15] tracking-tight">{dg.headline}</h1>
              <dl className="mt-4">
                {dg.bullets.map((b) => (
                  <div key={b.tag} className="grid grid-cols-[84px_1fr] gap-x-3 py-1.5 text-[15.5px]">
                    <dt className="text-muted text-[14px] pt-px">{b.tag}</dt>
                    <dd>{b.text}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </section>
        <aside className="space-y-5 lg:border-l lg:border-line lg:pl-8">
          <RegimeBanner regime={snap.regime} why={dg?.regime_why} />
          {fng != null && <Sentiment v={fng} />}
          {mcap?.value != null && (
            <div>
              <div className="label">Tổng vốn hoá crypto</div>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="num text-[20px] font-semibold">{compact(mcap.value)} USD</span>
                <Change v={mcap.change_24h} className="text-[13.5px]" />
              </div>
            </div>
          )}
        </aside>
      </div>

      <Card title={isLatest ? 'Giá đô hôm nay' : 'Giá đô ngày này'}
        right={<Link to={{ pathname: '/ty-gia', search: loc.search }} className="text-[14px] underline no-print">Từng ngân hàng, từng sàn</Link>}>
        <FxLadder snap={snap} />
      </Card>

      <Card title="Crypto"
        right={<Link to={{ pathname: '/crypto', search: loc.search }} className="text-[14px] underline no-print">Biểu đồ chi tiết</Link>}>
        <CoinTable snap={snap} />
      </Card>

      {news.length > 0 && (
        <Card title="Tin lớn trong ngày" subtitle="Biến động giá 24 giờ phản ánh toàn cảnh thị trường trong ngày, không đồng nghĩa tin tức đó là nguyên nhân chính dẫn đến biến động.">
          <div className="grid gap-x-10 lg:grid-cols-2">
            {news.map((n) => <Story key={n.link} n={n} />)}
          </div>
        </Card>
      )}
    </div>
  )
}
