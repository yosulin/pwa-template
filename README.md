# pwa-template (Josu)

Base para las PWAs estáticas de lugares/itinerarios que suelo montar
(rutas de senderismo, guías de pintxos, viajes familiares...): sin backend,
datos en JSON, mapa Leaflet, alojadas en GitHub Pages.

## Atribución

La carcasa de la PWA (`sw.js` con versión + lint de cache-busting, dark mode,
tarjeta OG, generación de iconos, pull-to-refresh, aviso de "hay versión
nueva") está basada en **[jsundram/pwa-starter](https://github.com/jsundram/pwa-starter)**,
que invita explícitamente en su README a usarse como punto de partida para
proyectos nuevos. Algunos archivos (`core/pullToRefresh.js`,
`scripts/make-icons.sh`, `scripts/make-og.sh`, `scripts/og-lint.py`,
`assets/icon.svg`, `assets/og.svg`) son prácticamente los originales; el resto
(`sw.js`, `sw-lint.py`, el shell HTML/CSS, y toda la capa `core/` de
mapa/ficha/filtros/audioguía) es reimplementación propia, adaptada al patrón
de "lugares con mapa e itinerario" que repito en mis proyectos.

## Qué trae

```
index.html          shell con placeholders {{...}} + banner de instalación + toast de actualización
styles.css           diseño con variables CSS, dark mode automático (prefers-color-scheme)
app.js                orquestador: carga datos, pinta itinerario/mapa/grid, conecta core/
sw.js                 service worker con VERSION explícita (cache-busting)
manifest.json          instalabilidad, con placeholders

core/
  categoryColors.js    asigna color a cada categoría automáticamente
  sheet.js              bottom sheet de detalle (genérico, ver data/SCHEMA.md)
  map.js                wrapper de Leaflet: init + marcadores + filtro
  maps.js                enlaces "Ver en Maps" / "Cómo llegar"
  filters.js             chips de filtro reutilizables
  audioguide.js           audioguía vía Web Speech API (sin archivos de audio)
  install.js              banner de instalación (Android/desktop + iOS)
  update.js                detecta nueva versión del SW y ofrece recargar
  pullToRefresh.js          gesto nativo de refrescar en apps instaladas (de pwa-starter)

data/
  SCHEMA.md             qué campos espera cada "lugar"

scripts/
  make-icons.sh          assets/icon.svg → PNGs (de pwa-starter, necesita rsvg-convert)
  make-og.sh              assets/og.svg → assets/og.png (de pwa-starter, necesita pngquant)
  sw-lint.py               falla el commit si cambias assets pero no subes VERSION en sw.js
  og-lint.py                valida el tamaño de la tarjeta OG (de pwa-starter)

.githooks/pre-commit     ejecuta sw-lint.py — activar con `git config core.hooksPath .githooks`
config.example.json      valores a copiar en la CONFIG de app.js por proyecto
```

## Arrancar un proyecto nuevo

1. Clona o usa como template de GitHub.
2. Reemplaza los placeholders `{{APP_NAME}}`, `{{THEME_COLOR}}`, etc. en
   `index.html` y `manifest.json` (o pide a Claude que lo haga a partir de
   `config.example.json`).
3. Sustituye `assets/icon.svg` por tu icono y corre:
   ```
   scripts/make-icons.sh
   scripts/make-og.sh
   ```
4. Rellena `data/lugares.json` siguiendo `data/SCHEMA.md`.
5. Ajusta `CONFIG` en `app.js` (centro del mapa, etiquetas de categoría...).
6. `git config core.hooksPath .githooks` para activar el lint de versión.
7. Sirve en local para probar: `python3 -m http.server 8000`.
8. Sube a GitHub Pages.

## Toolchain (solo en build time, la app final no tiene dependencias)

| Herramienta | Para qué | Instalar |
|---|---|---|
| `rsvg-convert` (librsvg2-bin) | `make-icons.sh` | `apt install librsvg2-bin` / `brew install librsvg` |
| `pngquant` | `make-og.sh` | `apt install pngquant` / `brew install pngquant` |
| `python3` ≥ 3.9 | `sw-lint.py`, `og-lint.py` | preinstalado |
