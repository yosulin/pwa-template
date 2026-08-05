// core/escapeHtml.js
// Cualquier campo de datos (JSON) que se interpole dentro de un innerHTML
// debe pasar por aquí — nombre, descripción, cualquier texto libre, y
// también URLs usadas dentro de atributos (p.ej. una imagen en un
// style="background-image:url('...')"). Sin esto, un campo con
// "<img src=x onerror=...>" o con una comilla suelta se ejecuta o rompe
// el atributo. El riesgo real hoy es bajo (los datos los escribes tú a
// mano), pero es la costumbre correcta si algún proyecto futuro mete datos
// de un origen menos controlado.
export function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
