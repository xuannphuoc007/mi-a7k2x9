import clsx from 'clsx'
import {
  Activity, Bitcoin, CalendarDays, Coins, Download, FileDown, Globe2, LayoutDashboard, Menu, Moon, Network,
  Search, Server, Sun, X,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useData } from '../hooks/useData'
import { useTheme } from '../hooks/useTheme'
import { fmtTime, fmtValue, toCsv } from '../utils/format'

export const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, keys: [] as string[] },
  { to: '/crypto', label: 'Crypto Market', icon: Bitcoin, keys: ['btc_', 'eth_', 'sol_', 'total_', 'fear'] },
  { to: '/stablecoin', label: 'Stablecoin & USDT/VND', icon: Coins, keys: ['usdt', 'usdc', 'stablecoin', 'p2p', 'internal'] },
  { to: '/macro', label: 'FX & Macro', icon: Globe2, keys: ['usdvnd', 'sbv', 'interbank', 'dgs', 'dff', 'dfed', 't10y', 'dtwex', 'dxy', 'cpi', 'pce', 'payems', 'unrate', 'vcb_'] },
  { to: '/structure', label: 'Market Structure', icon: Network, keys: [] },
  { to: '/status', label: 'Data Sources & Status', icon: Server, keys: [] },
]

function pageForMetric(key: string): string {
  const order = [NAV[3], NAV[2], NAV[1]]
  return order.find((n) => n.keys.some((k) => key.startsWith(k) || key.includes(k)))?.to ?? '/'
}

function exportCsv(snap: ReturnType<typeof useData>['snap']) {
  if (!snap) return
  const rows: (string | number | null | undefined)[][] = [
    ['key', 'label', 'value', 'unit', 'change_24h', 'change_7d', 'change_30d', 'change_unit', 'kind', 'quality', 'source', 'timestamp', 'period', 'note'],
  ]
  Object.entries(snap.metrics).forEach(([k, m]) => rows.push([k, m.label, m.value, m.unit, m.change_24h, m.change_7d,
    m.change_30d, m.change_unit ?? '%', m.kind, m.quality, m.source, m.timestamp, m.period, m.note]))
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `market-intelligence-${snap.date}.csv`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

function SearchBox() {
  const { snap } = useData()
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  const results = useMemo(() => {
    if (!snap || q.trim().length < 2) return []
    const s = q.toLowerCase()
    return Object.entries(snap.metrics)
      .filter(([k, m]) => m.label.toLowerCase().includes(s) || k.includes(s) || m.source.toLowerCase().includes(s))
      .slice(0, 8)
  }, [q, snap])
  return (
    <div className="relative w-full max-w-xs">
      <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm chỉ số…"
        className="w-full bg-panel2 border border-line rounded-md pl-8 pr-2 py-1.5 text-xs outline-none focus:border-accent/60" />
      {results.length > 0 && (
        <div className="absolute z-30 mt-1 w-[min(22rem,90vw)] panel shadow-xl py-1">
          {results.map(([k, m]) => (
            <button key={k} onClick={() => { nav({ pathname: pageForMetric(k), search: loc.search }); setQ('') }}
              className="w-full text-left px-3 py-1.5 hover:bg-panel2 flex justify-between gap-3 text-xs">
              <span className="truncate">{m.label}</span>
              <span className="num text-muted shrink-0">{fmtValue(m)} {m.value !== null ? m.unit : ''}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SourcesPill() {
  const { snap } = useData()
  const loc = useLocation()
  if (!snap) return null
  const active = snap.sources.filter((s) => s.status !== 'disabled')
  const total = active.length
  const ok = active.filter((s) => s.status === 'ok' || s.status === 'partial').length
  const err = snap.sources.filter((s) => s.status === 'error').length
  return (
    <NavLink to={{ pathname: '/status', search: loc.search }}
      className="hidden md:inline-flex items-center gap-1.5 text-[11px] border border-line rounded-md px-2 py-1 hover:bg-panel2">
      <span className={clsx('h-1.5 w-1.5 rounded-full', err ? 'bg-down' : ok === total ? 'bg-up' : 'bg-warn')} />
      <span className="num">{ok}/{total}</span>
      <span className="text-muted">nguồn OK</span>
    </NavLink>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  const { snap, index, selectedDate, setDate, isLatest } = useData()
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  const sidebar = (
    <nav className="flex flex-col gap-0.5 p-3">
      {NAV.map((n) => (
        <NavLink key={n.to} to={{ pathname: n.to, search: loc.search }} end={n.to === '/'} onClick={() => setOpen(false)}
          className={({ isActive }) => clsx('flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors',
            isActive ? 'bg-accent/10 text-accent font-medium' : 'text-muted hover:text-fg hover:bg-panel2')}>
          <n.icon className="h-4 w-4" />
          {n.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-full flex">
      <aside className="hidden lg:flex no-print w-60 shrink-0 flex-col border-r border-line bg-panel sticky top-0 h-screen">
        <div className="h-14 flex items-center gap-2 px-5 border-b border-line">
          <Activity className="h-4 w-4 text-accent" />
          <span className="font-semibold tracking-tight text-sm">Market Intelligence</span>
        </div>
        {sidebar}
        <div className="mt-auto p-4 text-[10.5px] text-muted leading-relaxed border-t border-line">
          Nội bộ. Dữ liệu cập nhật 1 lần/ngày khoảng 07:30 (UTC+7). Không phải dữ liệu real-time.
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden no-print" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-panel border-r border-line" onClick={(e) => e.stopPropagation()}>
            <div className="h-14 flex items-center justify-between px-4 border-b border-line">
              <span className="font-semibold text-sm">Market Intelligence</span>
              <button onClick={() => setOpen(false)} aria-label="Đóng menu"><X className="h-4 w-4" /></button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="no-print sticky top-0 z-20 h-14 border-b border-line bg-bg/85 backdrop-blur flex items-center gap-2 sm:gap-3 px-3 sm:px-5">
          <button className="lg:hidden p-1.5 -ml-1" onClick={() => setOpen(true)} aria-label="Mở menu"><Menu className="h-5 w-5" /></button>
          <span className="lg:hidden font-semibold text-sm whitespace-nowrap">MI</span>
          <div className="hidden sm:block flex-1 max-w-xs"><SearchBox /></div>
          <div className="flex-1 sm:hidden" />
          <div className="hidden xl:flex flex-col leading-tight text-right ml-auto">
            <span className="text-[10px] text-muted uppercase tracking-wider">Cập nhật</span>
            <span className="num text-[11.5px]">{fmtTime(snap?.generated_at)}</span>
          </div>
          <SourcesPill />
          <label className="flex items-center gap-1.5 border border-line rounded-md px-2 py-1 text-xs bg-panel2">
            <CalendarDays className="h-3.5 w-3.5 text-muted" />
            <select value={selectedDate ?? ''} onChange={(e) => setDate(e.target.value)}
              className="bg-transparent outline-none num text-xs max-w-[7.5rem]" aria-label="Chọn ngày">
              {(index?.dates ?? []).map((d) => (
                <option key={d.date} value={d.date} className="bg-panel">{d.date}{d.date === index?.latest ? ' (mới nhất)' : ''}</option>
              ))}
            </select>
          </label>
          <button onClick={() => exportCsv(snap)} title="Xuất CSV toàn bộ chỉ số" className="p-1.5 rounded-md border border-line hover:bg-panel2">
            <Download className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => window.print()} title="Xuất PDF (In → Lưu thành PDF)" className="p-1.5 rounded-md border border-line hover:bg-panel2">
            <FileDown className="h-3.5 w-3.5" />
          </button>
          <button onClick={toggle} title="Đổi giao diện sáng/tối" className="p-1.5 rounded-md border border-line hover:bg-panel2">
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </header>
        <div className="sm:hidden px-3 pt-3 no-print"><SearchBox /></div>
        <main className="flex-1 p-3 sm:p-5 print-full max-w-[1600px] w-full">
          <div className="hidden print:block mb-3 text-xs">
            Market Intelligence — dữ liệu ngày {snap?.date} — tạo lúc {fmtTime(snap?.generated_at)}
          </div>
          {snap?.fixture && (
            <div className="mb-3 rounded-md border border-down/40 bg-down/10 px-3 py-2 text-xs font-medium text-down">
              DỮ LIỆU THỬ NGHIỆM GIẢ LẬP — chỉ dùng để kiểm tra giao diện, không phải số liệu thị trường.
            </div>
          )}
          {!isLatest && snap && (
            <div className="mb-3 rounded-md border border-warn/40 bg-warn/10 px-3 py-2 text-xs flex flex-wrap items-center gap-2 no-print">
              Đang xem dữ liệu lưu ngày <b className="num">{snap.date}</b>. Biểu đồ chuỗi thời gian hiển thị dữ liệu mới nhất.
              <button className="underline text-accent" onClick={() => setDate(null)}>Về ngày mới nhất</button>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
