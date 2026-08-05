import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { assetUrl } from '../utils/assetUrl'

function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true // iOS Safari
  )
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function isSafari() {
  const ua = window.navigator.userAgent
  return /safari/i.test(ua) && !/crios|fxios|edgios|chrome|android/i.test(ua)
}

// Decisión deliberada: NO se recuerda el cierre entre sesiones — mientras
// la app no esté instalada, se vuelve a mostrar en cada visita. Si tu
// proyecto necesita ser menos insistente, guarda el cierre en localStorage
// con una fecha y compáralo (p.ej. no volver a mostrar en N días).
export default function InstallPrompt() {
  const { t } = useI18n()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIosHint, setShowIosHint] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isStandalone()) return

    function handleBeforeInstall(event) {
      event.preventDefault()
      setDeferredPrompt(event)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    function handleInstalled() {
      setDeferredPrompt(null)
      setDismissed(true)
    }
    window.addEventListener('appinstalled', handleInstalled)

    // iOS Safari no dispara beforeinstallprompt: no hay forma programática
    // de instalar, así que mostramos instrucciones manuales.
    if (isIos() && isSafari()) setShowIosHint(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function handleInstallClick() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  if (dismissed || isStandalone()) return null
  if (!deferredPrompt && !showIosHint) return null

  return (
    <div className="install-banner" role="dialog" aria-label={t('install.title')}>
      <img src={assetUrl('favicon.svg')} alt="" className="install-icon" />
      <div className="install-copy">
        <strong>{t('install.title')}</strong>
        <p>{showIosHint && !deferredPrompt ? t('install.iosDescription') : t('install.description')}</p>
      </div>
      {deferredPrompt && (
        <button type="button" className="btn btn-primary btn-install" onClick={handleInstallClick}>
          {t('install.cta')}
        </button>
      )}
      <button
        type="button"
        className="install-close"
        onClick={() => setDismissed(true)}
        aria-label={t('install.dismiss')}
      >
        ×
      </button>
    </div>
  )
}
