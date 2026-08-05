import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = '{{APP_SLUG}}-theme'

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // sin storage disponible, seguimos con la preferencia del sistema
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      // Ajusta estos dos colores al tema claro/oscuro reales del proyecto
      metaThemeColor.setAttribute('content', theme === 'dark' ? '{{THEME_COLOR_DARK}}' : '{{THEME_COLOR}}')
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignorar si no hay storage disponible
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
