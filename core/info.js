// core/info.js
// Renderiza data/trip.json (vuelos, alojamiento, contactos de emergencia)
// en la vista "Info". Todas las secciones son opcionales.
import { escapeHtml } from './escapeHtml.js';

export function renderTripInfo(containerId, trip) {
  const el = document.getElementById(containerId);
  if (!el || !trip) return;

  const vuelos = (trip.vuelos || []).map((v) => `
    <div class="info-card">
      <div class="info-card-title">${escapeHtml(v.ruta)}</div>
      <div class="info-card-row"><span>${escapeHtml(v.fecha)}</span><strong>${escapeHtml(v.salida)} → ${escapeHtml(v.llegada)}</strong></div>
      <div class="info-card-sub">${escapeHtml(v.aerolinea || '')} ${escapeHtml(v.numero_vuelo || '')} · ${escapeHtml(v.duracion || '')}</div>
      ${v.numero_vuelo ? `<a class="info-card-track" href="https://www.flightradar24.com/data/flights/${encodeURIComponent(v.numero_vuelo.toLowerCase().replace(/\s+/g, ''))}" target="_blank" rel="noopener">🛫 Ver estado del vuelo en vivo</a>` : ''}
    </div>
  `).join('');

  const alojamiento = trip.alojamiento ? `
    <div class="info-card">
      <div class="info-card-title">${escapeHtml(trip.alojamiento.nombre || 'Alojamiento')}</div>
      ${trip.alojamiento.direccion ? `<div class="info-card-row">${escapeHtml(trip.alojamiento.direccion)}</div>` : ''}
      ${trip.alojamiento.checkin ? `<div class="info-card-sub">Check-in: ${escapeHtml(trip.alojamiento.checkin)} · Check-out: ${escapeHtml(trip.alojamiento.checkout || '')}</div>` : ''}
      ${trip.alojamiento.telefono ? `<div class="info-card-sub">📞 ${escapeHtml(trip.alojamiento.telefono)}</div>` : ''}
      ${trip.alojamiento.notas ? `<div class="info-card-sub">${escapeHtml(trip.alojamiento.notas)}</div>` : ''}
    </div>
  ` : '';

  const contactos = (trip.contactos_emergencia || []).map((c) => `
    <div class="info-card">
      <div class="info-card-title">${escapeHtml(c.nombre)}</div>
      ${c.telefono ? `<div class="info-card-row">📞 <a href="tel:${encodeURIComponent(c.telefono.replace(/\s/g, ''))}">${escapeHtml(c.telefono)}</a></div>` : ''}
      ${c.direccion ? `<div class="info-card-sub">${escapeHtml(c.direccion)}</div>` : ''}
      ${c.nota ? `<div class="info-card-sub">${escapeHtml(c.nota)}</div>` : ''}
    </div>
  `).join('');

  el.innerHTML = `
    ${vuelos ? `<div class="sheet-section info-section"><h4>Vuelos</h4>${vuelos}</div>` : ''}
    ${alojamiento ? `<div class="sheet-section info-section"><h4>Alojamiento</h4>${alojamiento}</div>` : ''}
    ${contactos ? `<div class="sheet-section info-section"><h4>Contactos de emergencia</h4>${contactos}</div>` : ''}
  `;
}
