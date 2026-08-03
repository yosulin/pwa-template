# Esquema de datos — `data/lugares.json`

Formato usado por `core/sheet.js`, `core/map.js` y `app.js`. Todos los campos
son opcionales salvo `id`, `nombre`, `categoria` y `coordenadas` (necesarios
para que el lugar aparezca en el mapa y sea clicable).

```jsonc
{
  "lugares": [
    {
      "id": "identificador-unico",          // requerido, usado como key
      "nombre": "Nombre del lugar",          // requerido
      "categoria": "monumento",              // requerido — cualquier string;
                                              // se les asigna color automáticamente
                                              // por orden de aparición (ver core/categoryColors.js)
      "prioridad": "imprescindible",         // opcional: imprescindible | recomendado | opcional
      "descripcion_breve": "...",
      "historia": "...",
      "dato_curioso_niños": "...",
      "audioguia": "...",                    // texto narrado; si no existe, se usa descripcion_breve
      "horario": "...",
      "precio_adulto": "...",
      "precio_niño": "...",
      "necesita_reserva": true,
      "tiempo_visita_recomendado": "...",
      "hora_visita_recomendada": "...",
      "mejor_momento_dia": "...",
      "consejo_practico": "...",
      "coordenadas": { "lat": 0.0, "lng": 0.0 },  // requerido para mapa
      "zona": "...",
      "cercania_metro": "...",
      "spots_fotografia": [
        { "nombre": "...", "coordenadas": {"lat":0,"lng":0}, "mejor_hora": "...", "por_que": "...", "duracion_recomendada": "..." }
      ],
      "sitios_para_comer": [
        { "nombre": "...", "tipo": "...", "especialidad": "...", "precio_aprox_persona": "...", "puntuacion": "...", "distancia_aprox": "...", "necesita_reserva": "..." }
      ]
    }
  ],

  // Opcional — si existe, se muestra la vista "Itinerario" con tabs por día.
  // Si tu proyecto no tiene itinerario (p.ej. una guía de rutas sin fechas),
  // omite esta clave y quita la vista "Itinerario" del index.html.
  "itinerario_familiar_recomendado": {
    "clave_del_dia": {
      "tema": "Título del día",
      "plan": [
        "08:00 Texto libre — si el texto contiene el nombre de un lugar de `lugares`, se enlaza automáticamente"
      ]
    }
  }
}
```

## Notas
- `categoria` no está limitada a una lista fija: usa las que tenga sentido para
  tu proyecto (rutas de senderismo podría usar `facil`/`media`/`dificil`, por
  ejemplo). Los colores se asignan automáticamente, hasta 8 categorías
  distintas (`--cat-a` … `--cat-h` en `styles.css`).
- El emparejamiento de `plan` con `lugares` es por coincidencia de texto
  (ver `matchLugarFromPlanLine` en `app.js`) — no es infalible, revísalo tras
  generar el itinerario.

# Esquema de datos — `data/trip.json` (opcional)

Metadatos del viaje, separados de `lugares.json` porque cambian con menos
frecuencia y no son "lugares visitables". Ver `data/trip.example.json`.

- `fechas`: mapea cada clave de día usada en `itinerario_familiar_recomendado`
  a una fecha ISO (`YYYY-MM-DD`). Con esto, `core/now.js` puede detectar
  automáticamente qué día del itinerario corresponde a "hoy" y abrir esa
  pestaña al cargar la app.
- `vuelos`: lista de trayectos con horarios — **no incluyas aquí nombres
  completos de pasajeros ni fechas de nacimiento**; la app es pública en
  GitHub Pages. Si necesitas esos datos a mano, guárdalos fuera de este repo.
- `alojamiento`: un único objeto con los datos del hotel/apartamento.
- `contactos_emergencia`: lista de `{ nombre, telefono, direccion?, nota? }`
  (número europeo de emergencias, embajada/consulado, seguro de viaje...).

Si `data/trip.json` no existe, la vista "Info" y el modo "ahora" simplemente
no se activan — el resto de la app funciona igual.

