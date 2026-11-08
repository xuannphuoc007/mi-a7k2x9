import { Camera, Copy, Download, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { loadLatest } from '../services/data'
import { renderSnapshot } from '../utils/snapshot'

/**
 * Bấm là tải lại dữ liệu mới nhất trên máy chủ (không dùng bản đang mở trên trang, có thể là ngày cũ),
 * rồi vẽ ảnh gồm 7 chỉ số tỷ giá và lãi suất.
 */
export default function SnapshotButton() {
  const [busy, setBusy] = useState(false)
  const [img, setImg] = useState<{ url: string; blob: Blob; name: string } | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => () => { if (img) URL.revokeObjectURL(img.url) }, [img])
  // Link #/?snapshot=1 mở sẵn ảnh, tiện để đánh dấu trang dùng hằng ngày
  useEffect(() => {
    if (new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('snapshot') === '1') take()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function take() {
    setBusy(true)
    setMsg(null)
    try {
      const snap = await loadLatest()
      const now = new Date()
      const blob = await renderSnapshot(snap, now, window.location.origin + window.location.pathname)
      const stamp = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' })
        .format(now).replace(/[-: ]/g, '')
      setImg({ url: URL.createObjectURL(blob), blob, name: `ty-gia-${stamp}.png` })
    } catch (e) {
      setMsg(`Không tạo được ảnh: ${(e as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  async function copy() {
    if (!img) return
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': img.blob })])
      setMsg('Đã sao chép ảnh, dán vào tin nhắn là được.')
    } catch {
      setMsg('Trình duyệt không cho sao chép ảnh. Hãy bấm Tải ảnh.')
    }
  }

  function close() {
    setImg(null)
    setMsg(null)
  }

  return (
    <>
      <button onClick={take} disabled={busy} title="Chụp ảnh tỷ giá và lãi suất hiện tại"
        className="no-print inline-flex items-center gap-1.5 border border-fg px-2.5 py-1.5 text-[13.5px] font-medium hover:bg-fg hover:text-bg disabled:opacity-50">
        <Camera className="h-4 w-4" />{busy ? 'Đang chụp…' : 'Snapshot'}
      </button>
      {msg && !img && <span className="text-[13px] text-down ml-2">{msg}</span>}
      {img && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 no-print" onClick={close}>
          <div className="bg-panel max-h-full overflow-auto w-full max-w-[560px] p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="serif text-[20px] font-semibold">Snapshot</div>
              <button onClick={close} aria-label="Đóng" className="p-1 text-muted hover:text-fg"><X className="h-5 w-5" /></button>
            </div>
            <img src={img.url} alt="Ảnh tỷ giá và lãi suất" className="w-full border border-line" />
            <div className="flex flex-wrap gap-2 mt-3">
              <a href={img.url} download={img.name}
                className="inline-flex items-center gap-1.5 bg-fg text-bg px-3 py-2 text-[14px] font-medium"><Download className="h-4 w-4" />Tải ảnh</a>
              <button onClick={copy} className="inline-flex items-center gap-1.5 border border-fg px-3 py-2 text-[14px] font-medium">
                <Copy className="h-4 w-4" />Sao chép ảnh</button>
            </div>
            {msg && <p className="text-[13.5px] text-muted mt-2">{msg}</p>}
          </div>
        </div>
      )}
    </>
  )
}
