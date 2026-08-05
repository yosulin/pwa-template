import { LANGUAGES, useI18n } from '../i18n'

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  return (
    <div className="lang-switcher" role="group" aria-label="Idioma / Language">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={lang === code ? 'is-active' : ''}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
