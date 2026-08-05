// Feedback táctil/sonoro sin dependencias ni archivos de audio (Web Audio
// API genera los tonos al vuelo). Usa esto para confirmar acciones
// (acierto/fallo, pulsar un botón importante, etc.) — pero si tu app tiene
// mucho de esto, considera un toggle de silencio en ajustes, no lo fuerces
// siempre activo sin forma de apagarlo.

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

// pattern: número (ms) o array de [vibra, pausa, vibra, ...] para patrones
export function vibrate(pattern) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // el navegador puede bloquearlo (sin interacción reciente, etc.)
    }
  }
}
