import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import es from './es.json'
import en from './en.json'

// Añade/quita idiomas aquí y en los imports de arriba. Los nombres propios
// (de producto, de lugar, etc.) NO se traducen — solo la interfaz.
export const LANGUAGES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' }
]

const DICTIONARIES = { es, en }
const DEFAULT_LANG = 'es'
const STORAGE_KEY = '{{APP_SLUG}}-lang'

function detectInitialLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && DICTIONARIES[stored]) return stored
  } catch {
    // localStorage puede no estar disponible (modo privado, etc.)
  }
  const browserLang = (navigator.language || DEFAULT_LANG).slice(0, 2)
  return DICTIONARIES[browserLang] ? browserLang : DEFAULT_LANG
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLanguage)

  // El <html lang="..."> debe reflejar el idioma real del contenido — si no
  // lo sincronizas, los lectores de pantalla y el "traducir esta página" del
  // navegador se quedan con el idioma con el que arrancó la app.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((code) => {
    if (!DICTIONARIES[code]) return
    setLangState(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // ignorar si no hay storage disponible
    }
  }, [])

  const t = useCallback(
    (key, vars) => {
      const dict = DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANG]
      let str = dict[key] ?? DICTIONARIES[DEFAULT_LANG][key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, v)
        }
      }
      return str
    },
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n debe usarse dentro de <I18nProvider>')
  return ctx
}
