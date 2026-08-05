// modules/buttons — ver README.md del módulo para el porqué de cada patrón.
// Vocabulario compartido con la implementación vanilla (core/haptics.js de
// la raíz) — mismos nombres, incluso si algún proyecto solo usa un lado.

export const HAPTIC = {
  tap: 8,
  select: 12,
  toggleOn: [10, 30, 10],
  toggleOff: 10,
  dismiss: 15,
  celebrate: [15, 60, 15, 60, 40]
}

export function vibrate(pattern = HAPTIC.tap) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // el navegador puede bloquearlo (sin interacción reciente, etc.)
    }
  }
}

// --- Sonido: SOLO para feedback de acierto/error real, no para taps
// genéricos (ver README del módulo). Web Audio, sin ficheros de audio. ---

let audioCtx = null

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null
  if (!audioCtx) audioCtx = new AudioContextClass()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone(ctx, { freq, start, duration, type = 'sine', gain = 0.16 }) {
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gainNode.gain.setValueAtTime(gain, start)
  gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.connect(gainNode)
  gainNode.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration)
}

export function playSuccessSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime
  tone(ctx, { freq: 587.33, start: now, duration: 0.12 }) // D5
  tone(ctx, { freq: 880, start: now + 0.09, duration: 0.18 }) // A5
}

export function playErrorSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime
  tone(ctx, { freq: 196, start: now, duration: 0.22, type: 'sawtooth', gain: 0.09 })
}
