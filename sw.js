// sw.js — Service worker con versión explícita, precache configurable,
// y caché aparte para las teselas del mapa (para que el mapa funcione
// sin conexión en las zonas ya visitadas).
//
// REGLA: cada vez que cambies cualquier archivo listado en ASSETS,
// sube VERSION. scripts/sw-lint.py falla el commit si te olvidas.
const VERSION = '2026.08.06-19';
// Prefijo único por despliegue, derivado de dónde vive este service worker.
// Sin esto, dos proyectos DISTINTOS basados en esta misma plantilla usarían
// los mismos nombres genéricos "app-cache-"/"place-images-" — y como
// Cache Storage se comparte por origen (todo yosulin.github.io/*), el
// borrado de cachés antiguas de un proyecto podría llevarse por delante
// las del otro. Esto resuelve el problema en la plantilla misma, no solo
// en un proyecto concreto — cada copia lo hereda automáticamente.
const SCOPE_ID = self.registration.scope.replace(/[^a-z0-9]/gi, '-');
const CACHE_NAME = `${SCOPE_ID}app-cache-${VERSION}`;
const IMAGE_CACHE = `${SCOPE_ID}place-images-${VERSION}`;
// Sigue haciendo falta para excluir tiles de la caché genérica de imágenes
// de más abajo — ver el comentario en el handler de 'fetch'.
const TILE_HOST_PATTERN = /tile\.openstreetmap\.org/;

// Lista de archivos a precachear. Los datos de cada viaje (data/trips/<id>/*)
// se cachean solos al visitarlos, vía la estrategia stale-while-revalidate
// de más abajo — no hace falta listarlos aquí uno a uno.
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './core/categoryColors.js',
  './core/categoryIcons.js',
  './core/sheet.js',
  './core/map.js',
  './core/maps.js',
  './core/filters.js',
  './core/audioguide.js',
  './core/install.js',
  './core/update.js',
  './core/pullToRefresh.js',
  './core/now.js',
  './core/visited.js',
  './core/search.js',
  './core/info.js',
  './core/trips.js',
  './core/haptics.js',
  './data/trips.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS.map((a) => new Request(a, { cache: 'reload' }))).catch(() => {
        // si algún asset opcional no existe (p.ej. data/trip.json aún no creado), no bloquear la instalación
        return Promise.all(ASSETS.map((a) => cache.add(a).catch(() => {})));
      }))
    // OJO: NO llamar a self.skipWaiting() aquí. Si lo haces, el worker nuevo
    // se activa solo y (combinado con clients.claim() en 'activate') las
    // pestañas abiertas se recargan sin avisar — el aviso de "hay versión
    // nueva" de update.js se queda de adorno, nunca se ve. skipWaiting()
    // solo debe llegar en respuesta al mensaje SKIP_WAITING (ver abajo),
    // que es lo que dispara el botón del aviso.
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith(SCOPE_ID) && k !== CACHE_NAME && k !== IMAGE_CACHE).map((k) => caches.delete(k))
      ))
    // Tampoco clients.claim() aquí por la misma razón: solo se debe tomar
    // control de las pestañas abiertas cuando el usuario lo pide, no en
    // cuanto el worker nuevo termina de instalarse.
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;

  // Las teselas de tile.openstreetmap.org NO se cachean aquí a propósito.
  // Su política de uso prohíbe explícitamente el "offline use" y cualquier
  // patrón de "guardar para más tarde" (operations.osmfoundation.org/policies/tiles/),
  // con el aviso de que pueden bloquear el acceso sin avisar. Un caché
  // persistente en Cache Storage —aunque se rellene tesela a tesela según
  // se navega, no en bloque— es justo ese patrón. Dejamos el fetch pasar
  // directo a red: el caché HTTP normal del navegador ya respeta las
  // cabeceras Cache-Control del propio servidor de OSM, sin que el
  // service worker tenga que hacer nada. Si en algún proyecto hace
  // falta mapa de verdad offline, hay que alojar las teselas propias o
  // usar un proveedor que lo permita explícitamente — no interceptar aquí.

  // Fotos reales de lugares (data/lugares.json -> campo "imagen"): cache-first
  // igual que las teselas, para que también funcionen offline.
  if (event.request.destination === 'image' && !TILE_HOST_PATTERN.test(url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Resto de assets: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'GET_VERSION') {
    event.source.postMessage({ type: 'VERSION', version: VERSION });
  }
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting().then(() => self.clients.claim());
  }
});
