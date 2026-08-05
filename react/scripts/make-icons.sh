#!/usr/bin/env bash
# Rasteriza assets/icon.svg (icono normal) y assets/icon-maskable.svg (variante
# de zona segura) -> los PNG que usa el manifest. Los SVG son la fuente de
# verdad — edítalos, vuelve a correr esto, nunca edites los PNG a mano.
#
# LECCIÓN (de construir la PWA del quiz de OKIN): sin un icono "maskable"
# dedicado, Android recorta tu icono normal con su propia forma (círculo,
# squircle...) y si el dibujo llega hasta el borde, se ve raro/cortado. El
# maskable necesita el contenido importante dentro del ~80% central (zona
# seguro = círculo centrado al 40% del radio). El normal (favicon, apple-touch-icon)
# puede llegar más al borde sin problema, porque nadie se lo recorta.
#
# Necesita rsvg-convert (librsvg2-bin / brew install librsvg).
set -euo pipefail
cd "$(dirname "$0")/../assets"

for s in 192 512; do
  rsvg-convert -w "$s" -h "$s" icon.svg -o "../public/icons/icon-$s.png"
  rsvg-convert -w "$s" -h "$s" icon-maskable.svg -o "../public/icons/icon-$s-maskable.png"
done
rsvg-convert -w 180 -h 180 icon.svg -o "../public/icons/icon-180.png" # apple-touch-icon
cp icon.svg ../public/favicon.svg

echo "escritos: public/icons/icon-{192,512}[-maskable].png, icon-180.png, favicon.svg"
