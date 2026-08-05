import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

function getGitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'dev' // fuera de un repo git (build local sin historial)
  }
}

// "base" en './' funciona tanto si publicas en usuario.github.io/repo/ como
// si usas un dominio propio en la raíz — no hace falta tocarlo salvo caso raro.
export default defineConfig({
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
    setupFiles: './src/test/setup.js'
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_HASH__: JSON.stringify(getGitHash()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' '))
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // no actualices en silencio: usa <UpdateToast />
      includeAssets: ['favicon.svg', 'og.png'],
      workbox: {
        // OJO: el default de workbox NO incluye jpg/png — si tu app depende
        // de fotos para funcionar (como un quiz de imágenes), tienes que
        // listarlas aquí explícitamente o el offline se queda sin ellas.
        globPatterns: ['**/*.{js,css,html,ico,svg,png,jpg,jpeg,webmanifest}']
      },
      manifest: {
        name: '{{APP_NAME}}',
        short_name: '{{APP_SHORT_NAME}}',
        description: '{{APP_DESCRIPTION}}',
        theme_color: '{{THEME_COLOR}}',
        background_color: '{{THEME_COLOR_BG}}',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
