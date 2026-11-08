import type { Metric, Snapshot } from '../types/snapshot'
import { fmtNum } from './format'

export interface SnapRow {
  label: string
  value: string | null
  unit: string
  detail: string
  stale?: boolean
}

const has = (m?: Metric): m is Metric => !!m && m.value != null

const dm = (iso?: string | null) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : '')

const hm = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : ''

const pct = (v: number | null) => fmtNum(v, 2)

/** Đúng 7 dòng người dùng yêu cầu, theo thứ tự cố định. Thiếu số thì ghi rõ, không thay bằng số khác. */
export function snapshotRows(s: Snapshot): SnapRow[] {
  const m = s.metrics
  const stale = (...xs: (Metric | undefined)[]) => xs.some((x) => x?.quality === 'stale')
  const rows: SnapRow[] = []

  const fb = m.usdvnd_free_buy, fs = m.usdvnd_free_sell
  rows.push(has(fb) && has(fs)
    ? { label: 'USD/VND chợ đen', value: `${fmtNum(fb.value, 0)} / ${fmtNum(fs.value, 0)}`, unit: 'mua / bán',
        detail: `${fs.source} · lấy lúc ${hm(fs.timestamp)} ${dm(fs.timestamp)}`, stale: stale(fb, fs) }
    : { label: 'USD/VND chợ đen', value: null, unit: '', detail: 'Nguồn chưa trả số' })

  const ib = m.usdvnd_interbank
  rows.push(has(ib)
    ? { label: 'USD/VND liên ngân hàng', value: fmtNum(ib.value, 0), unit: 'đồng/USD',
        detail: `Giá chốt phiên ${dm(ib.period)} · ${ib.quality === 'manual' ? 'nhập tay' : 'VIRA (MSB Research)'}`, stale: stale(ib) }
    : { label: 'USD/VND liên ngân hàng', value: null, unit: '', detail: 'Chưa có bản tin VIRA' })

  const ub = m.usdtvnd_p2p_bid, ua = m.usdtvnd_p2p_ask
  const ref = s.tables.fx?.reference_size_vnd
  rows.push(has(ub) && has(ua)
    ? { label: 'USDT/VND', value: `${fmtNum(ub.value, 0)} / ${fmtNum(ua.value, 0)}`, unit: 'mua / bán',
        detail: `Trung vị Binance, OKX, Bybit, Bitget${ref ? `, lệnh ${ref / 1e6} triệu` : ''} · lấy lúc ${hm(ua.timestamp)} ${dm(ua.timestamp)}`,
        stale: stale(ub, ua) }
    : { label: 'USDT/VND', value: null, unit: '', detail: 'Các sàn P2P chưa trả số' })

  const c = m.sbv_central_rate
  rows.push(has(c)
    ? { label: 'Tỷ giá trung tâm NHNN', value: fmtNum(c.value, 0), unit: 'đồng/USD', detail: `Áp dụng ngày ${dm(c.period)} · sbv.gov.vn`, stale: stale(c) }
    : { label: 'Tỷ giá trung tâm NHNN', value: null, unit: '', detail: 'Chưa lấy được từ sbv.gov.vn' })

  const q = m.usdvnd_fwd_1m_quote, f = m.usdvnd_fwd_1m_implied, fw = s.tables.forward
  if (has(q)) {
    rows.push({ label: 'USD/VND kỳ hạn 1 tháng', value: fmtNum(q.value, 0), unit: 'đồng/USD', detail: `Giá yết nhập tay ngày ${dm(q.period)}` })
  } else if (has(f) && fw?.spot != null && fw.r_vnd != null && fw.r_usd != null) {
    rows.push({ label: 'USD/VND kỳ hạn 1 tháng', value: fmtNum(f.value, 0), unit: 'đồng/USD',
      detail: `Tính theo chênh lệch lãi suất từ spot LNH ${fmtNum(fw.spot, 0)}, VND 1T ${pct(fw.r_vnd)}%, USD 1T ${pct(fw.r_usd)}%. Không phải giá ngân hàng yết` })
  } else {
    rows.push({ label: 'USD/VND kỳ hạn 1 tháng', value: null, unit: '',
      detail: `Chưa tính được${fw?.missing?.length ? `: thiếu ${fw.missing.join(', ')}` : ''}` })
  }

  const on = m.interbank_overnight_rate
  rows.push(has(on)
    ? { label: 'Lãi suất qua đêm VND', value: pct(on.value), unit: '%/năm', detail: `Bình quân liên ngân hàng ngày ${dm(on.period)} · NHNN`, stale: stale(on) }
    : { label: 'Lãi suất qua đêm VND', value: null, unit: '', detail: 'Chưa lấy được từ NHNN' })

  const uo = m.interbank_usd_overnight_rate
  rows.push(has(uo)
    ? { label: 'Lãi suất qua đêm USD', value: pct(uo.value), unit: '%/năm',
        detail: `Bình quân liên ngân hàng phiên ${dm(uo.period)} · ${uo.quality === 'manual' ? 'nhập tay' : 'VIRA'}`, stale: stale(uo) }
    : { label: 'Lãi suất qua đêm USD', value: null, unit: '', detail: 'Chưa có bản tin VIRA' })

  return rows
}

const W = 1080
const PAD = 64
const C = { bg: '#f7f4ec', fg: '#1b1915', muted: '#6c665a', line: '#d6d0c1', warn: '#a0660a' }

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (ctx.measureText(next).width > maxW && cur) {
      lines.push(cur)
      cur = w
    } else cur = next
  }
  if (cur) lines.push(cur)
  return lines
}

/** Vẽ ảnh PNG. Dùng canvas thay cho chụp màn hình để ảnh giống nhau trên mọi máy. */
export async function renderSnapshot(s: Snapshot, takenAt: Date, site: string): Promise<Blob> {
  await Promise.all([
    document.fonts.load('600 40px "Source Serif 4"'), document.fonts.load('400 22px "Be Vietnam Pro"'),
    document.fonts.load('600 34px "Be Vietnam Pro"'),
  ]).catch(() => undefined)
  const rows = snapshotRows(s)
  const scale = 2
  const rowH = 128
  const H = 230 + rows.length * rowH + 110
  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = H * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, W, H)
  ctx.textBaseline = 'alphabetic'

  const sans = (w: number, px: number) => `${w} ${px}px "Be Vietnam Pro", system-ui, sans-serif`
  const serif = (px: number) => `600 ${px}px "Source Serif 4", Georgia, serif`
  const day = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'full' }).format(takenAt)

  ctx.fillStyle = C.fg
  ctx.font = serif(46)
  ctx.fillText('Tỷ giá & lãi suất USD/VND', PAD, 104)
  ctx.font = sans(400, 22)
  ctx.fillStyle = C.muted
  ctx.fillText(`Chụp lúc ${hm(takenAt.toISOString())}, ${day}`, PAD, 146)
  ctx.fillText(`Số liệu cập nhật lần cuối ${hm(s.generated_at)} ${dm(s.generated_at)}`, PAD, 178)
  ctx.fillStyle = C.fg
  ctx.fillRect(PAD, 206, W - 2 * PAD, 3)

  let y = 206
  for (const r of rows) {
    ctx.fillStyle = C.fg
    ctx.font = sans(600, 25)
    ctx.fillText(r.label, PAD, y + 50)
    ctx.textAlign = 'right'
    if (r.value) {
      ctx.font = sans(600, 38)
      ctx.fillText(r.value, W - PAD, y + 56)
      ctx.font = sans(400, 19)
      ctx.fillStyle = C.muted
      ctx.fillText(r.unit, W - PAD, y + 86)
    } else {
      ctx.font = sans(500, 26)
      ctx.fillStyle = C.muted
      ctx.fillText('Chưa có dữ liệu', W - PAD, y + 54)
    }
    ctx.textAlign = 'left'
    ctx.font = sans(400, 19)
    ctx.fillStyle = r.stale ? C.warn : C.muted
    const lines = wrap(ctx, r.detail + (r.stale ? ' · số liệu cũ' : ''), 560)
    lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, PAD, y + 84 + i * 25))
    y += rowH
    ctx.fillStyle = C.line
    ctx.fillRect(PAD, y, W - 2 * PAD, 1)
  }

  ctx.font = sans(400, 18)
  ctx.fillStyle = C.muted
  ctx.fillText('Chỉ để tham khảo, không phải khuyến nghị giao dịch. Giá kỳ hạn tính toán không phải giá ngân hàng yết.', PAD, y + 50)
  ctx.fillText(site, PAD, y + 78)

  return new Promise((ok, fail) => canvas.toBlob((b) => (b ? ok(b) : fail(new Error('Không tạo được ảnh'))), 'image/png'))
}
