# pwa-template/react (Josu)

Variante React + Vite del template. **No sustituye** al núcleo vanilla-JS de
la raíz — ese sigue siendo la base para PWAs de "lugares/itinerario" (mapa,
audioguía). Esta carpeta es la base para lo demás: quizzes, juegos, apps con
más interactividad/estado del que un `app.js` vanilla lleva cómodamente.

Nace de construir `elige-tu-pan-quiz` (quiz de panes de OKIN) — cada pieza de
aquí es la versión genérica de algo que ese proyecto necesitó de verdad, no
un diseño especulativo. Ver ese repo si quieres el ejemplo completo en
contexto: https://github.com/yosulin/elige-tu-pan-quiz

## Cuándo usar esta variante en vez de la raíz

| Si el proyecto...                                      | Usa       |
| -------------------------------------------------------- | --------- |
| Es un mapa/itinerario de lugares                       | raíz (vanilla) |
| Tiene estado de juego/quiz, muchas interacciones, animaciones con estado | `react/`  |
| No sabes, es pequeño y sin mucho estado                | raíz — es más simple, sin build |

## Qué trae (y de qué bug/lección viene cada cosa)

```
vite.config.js          base:'./' (subpath-safe), workbox.globPatterns
                         incluyendo imágenes explícitamente (el default de
                         vite-plugin-pwa NO cachea jpg/png — si tu app
                         depende de fotos, sin esto el offline se queda sin
                         ellas), inyección de __APP_VERSION__/__GIT_HASH__/
                         __BUILD_DATE__

src/utils/assetUrl.js    CUALQUIER ruta que venga de datos (JSON) y no de un
                         import necesita pasar por aquí. En GitHub Pages con
                         subpath, una ruta "/images/x.jpg" a pelo apunta a la
                         raíz del dominio, no a tu carpeta — 404 en
                         producción que en local (base '/') nunca se ve.

src/i18n/                Contexto + hook, sin librería. Sincroniza
                         document.documentElement.lang al cambiar de idioma
                         (si no lo haces, lectores de pantalla y el
                         "traducir esta página" del navegador se quedan
                         pillados en el idioma inicial).

src/hooks/useTheme.js     Oscuro/claro con detección de prefers-color-scheme
                         + override manual persistido.

src/utils/feedback.js     Sonido (Web Audio, sin ficheros) y vibración.

src/components/
  InstallPrompt.jsx        Insiste en cada visita mientras no esté instalada
                           (decisión deliberada — documenta si tu proyecto
                           quiere lo contrario). Android/Chrome con prompt
                           nativo, iOS con instrucciones manuales (no hay
                           beforeinstallprompt en Safari).
  UpdateToast.jsx           registerType:'prompt' + este toast, en vez de
                           autoUpdate en silencio — para que quien tenga la
                           pestaña abierta sepa que hay versión nueva.
  InfoPanel.jsx             Versión + HASH DE COMMIT + fecha de build. El
                           hash es lo que de verdad confirma un despliegue
                           sin ambigüedad; la versión sola no sirve si
                           publicas varias veces el mismo día.
  ThemeToggle.jsx, LanguageSwitcher.jsx   Piezas simples, a propósito.

eslint.config.js          Flat config, con eslint-plugin-react para que
                           no-unused-vars no dé falsos positivos en
                           componentes solo usados en JSX.

scripts/validate-data.mjs  Esqueleto — AJÚSTALO al esquema real de tus
                           datos, no funciona "tal cual".

.github/workflows/deploy.yml   lint + validate-data + test como puerta
                           obligatoria ANTES de build/deploy. Necesita que
                           el token de GitHub tenga scope `workflow` además
                           de `repo` para poder subir este mismo fichero la
                           primera vez.
```

## Lo que NO incluye por defecto (a propósito)

- **Selector de idioma con arrastre** (píldora deslizante tipo segmented
  control, agarrable con el dedo). Existe y funciona bien en el quiz de
  OKIN, pero tiene bastante más superficie de bugs de la que la mayoría de
  proyectos necesita (hubo que arreglar dos: uno de hit-testing porque el
  botón tapaba la píldora, otro de cierre obsoleto de React en el listener
  de `resize`). Si un proyecto concreto quiere ese capricho, copia
  `LanguageSwitcher.jsx` del quiz y las clases `.lang-thumb`/`.is-origin`
  de su `global.css`, no lo asumas por defecto aquí.
- **Confeti, taxonomías de contenido, modos de dificultad** — específicos
  del contenido de cada proyecto, no de la carcasa PWA.

## Arrancar un proyecto nuevo

1. Copia esta carpeta (`react/`) completa como raíz del repo nuevo.
2. Sustituye los placeholders `{{APP_NAME}}`, `{{THEME_COLOR}}`, etc. en
   `index.html`, `vite.config.js`, `src/styles/global.css` — y el nombre en
   `package.json` (ojo: ahí NO valen `{{ }}`, el campo `name` de npm no
   admite esos caracteres).
3. Diseña `assets/icon.svg` (normal) y `assets/icon-maskable.svg` (con el
   contenido dentro de la zona segura central) y corre
   `scripts/make-icons.sh` (necesita `rsvg-convert`).
4. Crea `public/og.png` (1200×630) para la tarjeta de compartir — sin esto
   los enlaces se comparten sin imagen de vista previa.
5. `npm install && npm run dev` para comprobar que arranca.
6. Escribe tus datos, tu lógica real, sustituye el `<main>` de ejemplo en
   `App.jsx`.
7. `git config core.hooksPath ../.githooks` si quieres el mismo hook de
   pre-commit que la raíz (opcional, no hay ningún check de versión de SW
   aquí como en la vanilla — `vite-plugin-pwa` hace cache-busting solo por
   contenido).
8. Antes de crear el repo remoto o hacer push: confirma con Josu, y nunca
   reutilices un token que ya haya aparecido en texto plano en la
   conversación sin recordarle que lo revoque (misma norma que la raíz).
