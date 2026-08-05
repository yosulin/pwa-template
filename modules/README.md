# modules/ — piezas sueltas, se usan las que hagan falta

`react/` y la raíz vanilla son **esqueletos completos** (arranca un proyecto
entero desde ahí). `modules/` es distinto: cada carpeta es una pieza
independiente — la usas si tu proyecto la necesita, la ignoras si no.
Un proyecto sin mapa no carga el módulo de mapa. Uno sin quiz no carga
categorías. Etc.

Esto se construye **poco a poco**, un módulo cada vez que hace falta de
verdad en un proyecto real — no de golpe ni especulando por adelantado.

## Convención de cada módulo

```
modules/<nombre>/
  README.md      qué es, cuándo usarlo, decisiones de diseño (ej. por qué
                  un patrón de vibración concreto para cada acción)
  react/          implementación para el esqueleto react/
  vanilla/        implementación para la raíz vanilla (si aplica — no todos
                  los módulos tienen sentido en los dos lados; "mapa" con
                  Leaflet no necesita puerto a React si no lo vas a usar ahí)
```

## Cómo se usan (hoy, sin tooling de paquetes)

No hay workspace ni paquetes npm internos — esto no es un monorepo con
build compartido, son ficheros que se **copian** al proyecto nuevo. Cuando
copies un módulo a un proyecto:

1. Copia la carpeta del módulo (`react/` o `vanilla/` según el esqueleto)
   al sitio correspondiente del proyecto nuevo.
2. Si el esqueleto base (`react/` o la raíz) ya trae una versión de ese
   módulo integrada (p.ej. `react/src/utils/feedback.js` ya es el módulo de
   botones), no la dupliques — ya está.
3. Si mejoras un módulo trabajando en un proyecto concreto, el cambio
   vuelve aquí (a `modules/`) y se repropaga a los esqueletos que lo usan
   integrado — no se queda solo en ese proyecto. Así es como esto crece sin
   desincronizarse.

## Módulos que existen

- [`buttons/`](buttons/) — botones con vibración/sonido con nombre
  semántico (`HAPTIC.tap`, `.select`, `.celebrate`...), no números sueltos.

## Módulos pendientes (se añaden cuando un proyecto real los necesite)

- `map/` — de `core/map.js` de la raíz vanilla (Leaflet + marcadores + filtro)
- `install/` — banner de instalación (ya existe en ambos esqueletos, falta
  documentarlo aquí como módulo aparte)
- `update/` — aviso de nueva versión (idem)
- `i18n/` — el patrón sin librería (idem, ya en `react/`)
