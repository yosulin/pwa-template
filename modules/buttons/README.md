# modules/buttons — botones con feedback táctil/sonoro con nombre

## Qué resuelve

Sin esto, cada proyecto reinventa "¿cuánto vibra este botón?" con números
sueltos (`vibrate(12)`, `vibrate([15,60,15,60,40])`...) que no dicen nada
por sí solos y que además acaban siendo *distintos* entre proyectos para la
misma acción, sin motivo. La solución: un vocabulario compartido de
patrones con nombre, y los mismos nombres en vanilla y en react.

## `HAPTIC` — el vocabulario

| Nombre          | Para qué                                          | Patrón (ms)      |
| ---------------- | -------------------------------------------------- | ----------------- |
| `HAPTIC.tap`      | Pulsar algo normal (filtro, opción, tarjeta)       | `8`                |
| `HAPTIC.select`   | Elegir/confirmar algo con más peso que un tap suelto | `12`             |
| `HAPTIC.toggleOn` | Activar un interruptor/marcar algo                 | `[10, 30, 10]`     |
| `HAPTIC.toggleOff`| Desactivar                                         | `10`               |
| `HAPTIC.dismiss`  | Cerrar/descartar (modal, aviso, tarjeta)           | `15`               |
| `HAPTIC.celebrate`| Una acción con más ganas — arrancar algo, un logro | `[15, 60, 15, 60, 40]` |

`tap`/`select`/`toggleOn`/`toggleOff`/`dismiss` vienen de `core/haptics.js`
de la raíz vanilla — ya estaban bien pensados ahí, se adoptan tal cual.
`celebrate` es nuevo, viene del botón "Empezar" de `elige-tu-pan-quiz`
(un redoble en miniatura, no un simple toque, para una acción con más
intención que un tap cualquiera).

Si una acción no encaja en ninguno de estos, probablemente no necesita
vibración — no inventes un patrón nuevo por defecto, usa `HAPTIC.tap`.

## Vibración vs. sonido — cuándo cada uno

- **Vibración**: por defecto, para casi todo. Barata, no interrumpe si el
  móvil está en silencio, funciona igual de bien en un mapa que en un quiz.
- **Sonido** (`playSuccessSound`/`playErrorSound`, Web Audio, sin ficheros):
  SOLO para feedback de acierto/error real (un quiz, un formulario que
  valida...). No lo añadas a taps genéricos (un filtro, una tarjeta) —
  un "ding" en cada tap de un mapa de rutas sería ruido, no ayuda. Si un
  proyecto necesita apagar el sonido (uso en sitio silencioso), añade un
  toggle en ajustes — no lo fuerces siempre activo sin forma de apagarlo
  (ver nota pendiente de `elige-tu-pan-quiz`, que hoy no tiene ese toggle).

## Botones visuales que trae

- **`.btn` / `.btn-primary` / `.btn-secondary`** — botón normal, con texto.
  Primario = acción principal (accent). Secundario = alternativa, borde sin
  relleno.
- **`.corner-btn`** — botón circular flotante, para acciones "de sistema"
  fijas en una esquina (tema, info...). `.bottom-left` / `.bottom-right`.
  No uses más de dos por pantalla (una por esquina inferior) — si necesitas
  un tercero, probablemente no debería ser un `corner-btn`.

## Implementaciones

- [`react/`](react/) — `feedback.js` (con `HAPTIC`) + clases CSS
- [`vanilla/`](vanilla/) — extiende `core/haptics.js` de la raíz con sonido
  y `HAPTIC.celebrate` (los patrones tap/select/toggle*/dismiss ya estaban)
