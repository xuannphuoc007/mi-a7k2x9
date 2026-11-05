import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'dark', toggle: () => {} })

function read(): Theme {
  try {
    return localStorage.getItem('mi-theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = read()
    document.documentElement.classList.toggle('dark', t === 'dark')
    return t
  })
  useEffect(() => {
    try {
      localStorage.setItem('mi-theme', theme)
    } catch {
      /* bỏ qua khi trình duyệt chặn storage */
    }
  }, [theme])
  return <Ctx.Provider value={{ theme, toggle: () => {
    // đổi class ngay để biểu đồ (effect của component con) đọc đúng màu
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    setTheme(next)
  } }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)

/** Màu thực tế (rgb) từ biến CSS, dùng cho thư viện biểu đồ. */
export function cssColor(name: string, alpha = 1): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
  if (!v) return '#888888'
  const [r, g, b] = v.split(/\s+/)
  return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`
}
