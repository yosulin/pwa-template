#!/usr/bin/env node
// Valida src/data/*.json antes de desplegar. Ajusta las comprobaciones al
// esquema real del proyecto — esto es un ESQUELETO, no algo que funcione
// "tal cual" salvo que tu JSON tenga exactamente estos campos.
//
// Patrón general que vale la pena mantener sea cual sea el esquema:
//   - ids duplicados
//   - campos obligatorios vacíos
//   - referencias a ficheros (imágenes, audio...) que no existen en disco
//   - rangos numéricos inválidos
//   - un mínimo de registros para que la app tenga sentido (p.ej. un quiz
//     con menos de 4 opciones no puede generar una pregunta)
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// AJUSTA esta ruta al fichero de datos real del proyecto
const dataPath = path.join(rootDir, 'src/data/items.json')

if (!existsSync(dataPath)) {
  console.log('ℹ️  validate-data: no hay src/data/items.json todavía — nada que validar')
  process.exit(0)
}

const items = JSON.parse(readFileSync(dataPath, 'utf-8'))
const errors = []
const seenIds = new Set()

for (const item of items) {
  const label = item?.id ? `"${item.id}"` : JSON.stringify(item)

  if (!item.id || typeof item.id !== 'string') {
    errors.push(`${label}: falta un "id" válido`)
    continue
  }
  if (seenIds.has(item.id)) errors.push(`id duplicado: "${item.id}"`)
  seenIds.add(item.id)

  if (!item.nombre || !String(item.nombre).trim()) {
    errors.push(`${label}: "nombre" vacío`)
  }

  // Si el item referencia una imagen (ajusta el nombre del campo si hace falta)
  if (item.imagen) {
    const imgFile = path.join(rootDir, 'public', String(item.imagen).replace(/^\/+/, ''))
    if (!existsSync(imgFile)) {
      errors.push(`${label}: la imagen "${item.imagen}" no existe en public/`)
    }
  }
}

if (errors.length > 0) {
  console.error(`❌ validate-data: ${errors.length} problema(s)\n`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(`✅ validate-data: ${items.length} registros correctos`)
