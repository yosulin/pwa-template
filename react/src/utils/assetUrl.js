// En GitHub Pages la app normalmente NO vive en la raíz del dominio
// (https://usuario.github.io/repo/), así que cualquier ruta que empiece por
// "/" en tus datos (JSON, etc.) hay que recomponerla contra el BASE_URL real
// que Vite conoce en build. Sin esto, cualquier imagen/asset referenciado
// desde datos (no desde import) apunta a la raíz del dominio y da 404.
//
// Úsalo para CUALQUIER ruta que venga de datos (JSON, CMS, etc.), nunca
// para assets importados directamente en el código (esos ya los resuelve
// Vite solo).
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL // p.ej. './' o '/mi-repo/'
  const clean = path.replace(/^\/+/, '')
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`
}
