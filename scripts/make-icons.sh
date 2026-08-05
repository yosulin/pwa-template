#!/usr/bin/env bash
# Rasterize assets/icon.svg (normal) and assets/icon-maskable.svg (safe-zone
# variant) -> the PWA / home-screen PNGs. The SVGs are the SINGLE SOURCE OF
# TRUTH: edit them, rerun this, never hand-edit the PNGs. Needs rsvg-convert
# (librsvg); swap in `inkscape -w $s icon.svg -o …` or ImageMagick
# `convert -background none -resize ${s}x${s}` if you don't have it.
# RUN THIS FIRST on a fresh clone — the head + manifest reference these files.
#   180 = apple-touch-icon   192/512 = manifest icons, purpose "any"
#   192/512-maskable = manifest icons, purpose "maskable" (Android
#     adaptive icon — needs its OWN safe-zone framing, reusing the normal
#     icon here is what caused the "icon looks cropped weird" bug before)
set -euo pipefail
cd "$(dirname "$0")/../assets"
for s in 192 512; do
  rsvg-convert -w "$s" -h "$s" icon.svg -o "icon-$s.png"
  rsvg-convert -w "$s" -h "$s" icon-maskable.svg -o "icon-$s-maskable.png"
done
rsvg-convert -w 180 -h 180 icon.svg -o "icon-180.png"
echo "wrote assets/icon-{180,192,512}.png and icon-{192,512}-maskable.png"
