import { useI18n } from './i18n'
import { useTheme } from './hooks/useTheme'
import LanguageSwitcher from './components/LanguageSwitcher'
import ThemeToggle from './components/ThemeToggle'
import InstallPrompt from './components/InstallPrompt'
import UpdateToast from './components/UpdateToast'
import InfoPanel from './components/InfoPanel'

// Esto es el "chandelier" — la carcasa común a (casi) todos tus proyectos
// React. Sustituye el <main> por la app real; deja el resto tal cual salvo
// que el proyecto concreto no necesite alguna pieza (p.ej. si no vas a
// publicar como PWA instalable, quita InstallPrompt + UpdateToast).
export default function App() {
  const { t } = useI18n()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="app-shell">
      <UpdateToast />
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: 18 }}>
        <strong>{t('appTitle')}</strong>
        <LanguageSwitcher />
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>{'{{APP_NAME}} — sustituye este <main> por la app real.'}</p>
      </main>

      <InstallPrompt />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <InfoPanel />
    </div>
  )
}
