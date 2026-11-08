import clsx from 'clsx'
import { ChevronLeft, ChevronRight, Download, Moon, Printer, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useData } from '../hooks/useData'
import { useTheme } from '../hooks/useTheme'
import SnapshotButton from './SnapshotButton'
import { fmtDateLong, fmtTime, toCsv } from '../utils/format'

const NAV = [
  { to: '/', label: 'Hôm nay' },
  { to: '/ty-gia', label: 'Tỷ giá' },
  { to: '/crypto', label: 'Crypto' },
  { to: '/stablecoin', label: 'Stablecoin' },
  { to: '/macro', label: 'Vĩ mô' },
  { to: '/lien-thi-truong', label: 'Liên thị trường' },
]

function exportCsv(snap: ReturnType<typeof useData>['snap']) {
  if (!snap) return
  const rows: (string | number | null | undefined)[][] = [
    ['key', 'label', 'value', 'unit', 'change_24h', 'change_7d', 'change_30d', 'source', 'timestamp'],
  ]
  Object.entries(snap.metrics).forEach(([k, m]) => {
    if (m.value !== null) rows.push([k, m.label, m.value, m.unit, m.change_24h, m.change_7d, m.change_30d, m.source, m.timestamp])
  })
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `thi-truong-${snap.date}.csv`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

const iconBtn = 'p-2 text-muted hover:text-fg disabled:opacity-30 disabled:hover:text-muted'

function DateNav() {
  const { index, selectedDate, setDate } = useData()
  const dates = index?.dates ?? []
  const i = dates.findIndex((d) => d.date === selectedDate)
  const older = i >= 0 ? dates[i + 1]?.date : undefined
  const newer = i > 0 ? dates[i - 1]?.date : undefined
  return (
    <div className="flex items-center gap-1 no-print">
      <button className={iconBtn} disabled={!older} onClick={() => older && setDate(older)} aria-label="Ngày trước" title="Ngày trước">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <select value={selectedDate ?? ''} onChange={(e) => setDate(e.target.value)} aria-label="Chọn ngày"
        className="num bg-transparent border-b border-fg/40 hover:border-fg py-1 px-1 text-[14px] outline-none cursor-pointer">
        {dates.map((d) => (
          <option key={d.date} value={d.date} className="bg-panel text-fg">
            {d.date.split('-').reverse().join('/')}{d.date === index?.latest ? ' (mới nhất)' : ''}
          </option>
        ))}
      </select>
      <button className={iconBtn} disabled={!newer} onClick={() => newer && setDate(newer)} aria-label="Ngày sau" title="Ngày sau">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  const { snap, selectedDate, setDate, isLatest } = useData()
  const loc = useLocation()

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <header className="pt-5 sm:pt-7">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pb-3">
            <div>
              <div className="serif text-[28px] sm:text-[34px] font-semibold leading-none tracking-tight">Bản tin thị trường</div>
              <div className="text-[14px] text-muted mt-2">
                {selectedDate ? fmtDateLong(selectedDate) : ''}
                {snap?.generated_at && <> · cập nhật {fmtTime(snap.generated_at, false)}</>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <SnapshotButton />
              <DateNav />
              <div className="flex items-center no-print">
                <button onClick={() => exportCsv(snap)} title="Tải số liệu (CSV)" aria-label="Tải số liệu" className={iconBtn}><Download className="h-4 w-4" /></button>
                <button onClick={() => window.print()} title="In hoặc lưu PDF" aria-label="In" className={iconBtn}><Printer className="h-4 w-4" /></button>
                <button onClick={toggle} title="Đổi nền sáng/tối" aria-label="Đổi nền" className={iconBtn}>
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <nav className="no-print flex gap-5 sm:gap-7 overflow-x-auto border-y border-line text-[14.5px]">
            {NAV.map((n) => (
              <NavLink key={n.to} to={{ pathname: n.to, search: loc.search }} end={n.to === '/'}
                className={({ isActive }) => clsx('py-2.5 whitespace-nowrap border-b-2 -mb-px',
                  isActive ? 'border-fg font-semibold' : 'border-transparent text-muted hover:text-fg')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="py-6 sm:py-8 print-full">
          {snap?.fixture && (
            <div className="mb-5 border-l-4 border-down pl-3 py-1 text-[14px] text-down">
              Đây là dữ liệu thử nghiệm giả lập, không phải số liệu thị trường.
            </div>
          )}
          {!isLatest && snap && (
            <div className="mb-5 border-l-4 border-warn pl-3 py-1 text-[14px] no-print">
              Đang xem bản lưu ngày <b className="num">{snap.date.split('-').reverse().join('/')}</b>.{' '}
              <button className="underline" onClick={() => setDate(null)}>Về ngày mới nhất</button>
            </div>
          )}
          {children}
        </main>

        <footer className="border-t border-line py-5 text-[13px] text-muted no-print">
          Dữ liệu chụp mỗi sáng khoảng 7:30, không phải giá thời gian thực. Chỉ để tham khảo, không phải khuyến nghị giao dịch.
        </footer>
      </div>
    </div>
  )
}
