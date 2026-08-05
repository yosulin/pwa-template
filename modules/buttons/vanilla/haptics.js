// core/haptics.js
// navigator.vibrate solo funciona en Android/Chrome — iOS Safari nunca ha
// implementado la Vibration API (ni siquiera instalada como PWA), así que
// esto se degrada en silencio ahí, no falla.

export function vibrate(pattern = 10) {
  if (navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch { /* ignorar */ }
  }
}

export const HAPTIC = {
  tap: 8,
  select: 12,
  toggleOn: [10, 30, 10],
  toggleOff: 10,
  dismiss: 15,
  // Nuevo (viene de elige-tu-pan-quiz): una acción con más intención que
  // un tap suelto — arrancar algo, un logro. No lo uses para nada rutinario.
  celebrate: [15, 60, 15, 60, 40]
};
