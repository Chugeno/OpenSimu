#!/usr/bin/env bash
set -e

# Generates high-res PNG icons for PWA and Apple touch icons from SVG sources
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_DIR="$DIR/public"
TMP_DIR="/tmp/opensimu-icons"

mkdir -p "$TMP_DIR"

echo "🎨 Generando iconos PWA para OpenSimu..."

# 1. Standard icon SVG
cat << 'EOF' > "$TMP_DIR/app-icon.svg"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="bolt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#0284c7" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background with rounded squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="#1e293b" stroke-width="4"/>

  <!-- Radial glow behind center -->
  <circle cx="256" cy="256" r="180" fill="url(#glow)"/>

  <!-- Circuit schematic lines -->
  <g stroke="#334155" stroke-width="5" stroke-linecap="round">
    <line x1="96" y1="120" x2="416" y2="120"/>
    <line x1="140" y1="120" x2="140" y2="170"/>
    <line x1="372" y1="120" x2="372" y2="170"/>

    <line x1="96" y1="392" x2="416" y2="392"/>
    <line x1="140" y1="342" x2="140" y2="392"/>
    <line x1="372" y1="342" x2="372" y2="392"/>

    <circle cx="140" cy="120" r="7" fill="#38bdf8" stroke="#0f172a" stroke-width="3"/>
    <circle cx="372" cy="120" r="7" fill="#38bdf8" stroke="#0f172a" stroke-width="3"/>
    <circle cx="140" cy="392" r="7" fill="#38bdf8" stroke="#0f172a" stroke-width="3"/>
    <circle cx="372" cy="392" r="7" fill="#38bdf8" stroke="#0f172a" stroke-width="3"/>
  </g>

  <!-- Central powerful lightning bolt -->
  <path d="M288 68 L148 268 L244 268 L220 444 L364 236 L268 236 Z" 
        fill="url(#bolt)" 
        filter="url(#shadow)"
        stroke="#ffffff"
        stroke-width="3"
        stroke-linejoin="round"/>
</svg>
EOF

# 2. Maskable icon SVG (full bleed background, center 65% safe zone)
cat << 'EOF' > "$TMP_DIR/app-icon-maskable.svg"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="boltm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="glowm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadowm" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#0284c7" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="512" height="512" fill="url(#bgm)"/>
  <circle cx="256" cy="256" r="140" fill="url(#glowm)"/>

  <g stroke="#334155" stroke-width="4.5" stroke-linecap="round">
    <line x1="128" y1="140" x2="384" y2="140"/>
    <line x1="160" y1="140" x2="160" y2="180"/>
    <line x1="352" y1="140" x2="352" y2="180"/>

    <line x1="128" y1="372" x2="384" y2="372"/>
    <line x1="160" y1="332" x2="160" y2="372"/>
    <line x1="352" y1="332" x2="352" y2="372"/>

    <circle cx="160" cy="140" r="6" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="352" cy="140" r="6" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="160" cy="372" r="6" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="352" cy="372" r="6" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
  </g>

  <g transform="translate(256, 256) scale(0.82) translate(-256, -256)">
    <path d="M288 68 L148 268 L244 268 L220 444 L364 236 L268 236 Z" 
          fill="url(#boltm)" 
          filter="url(#shadowm)"
          stroke="#ffffff"
          stroke-width="3"
          stroke-linejoin="round"/>
  </g>
</svg>
EOF

qlmanage -t -s 512 -o "$TMP_DIR" "$TMP_DIR/app-icon.svg" >/dev/null 2>&1
qlmanage -t -s 512 -o "$TMP_DIR" "$TMP_DIR/app-icon-maskable.svg" >/dev/null 2>&1

sips -z 512 512 "$TMP_DIR/app-icon.svg.png" --out "$PUBLIC_DIR/icon-512.png" >/dev/null
sips -z 192 192 "$TMP_DIR/app-icon.svg.png" --out "$PUBLIC_DIR/icon-192.png" >/dev/null
sips -z 512 512 "$TMP_DIR/app-icon-maskable.svg.png" --out "$PUBLIC_DIR/icon-maskable-512.png" >/dev/null
sips -z 192 192 "$TMP_DIR/app-icon-maskable.svg.png" --out "$PUBLIC_DIR/icon-maskable-192.png" >/dev/null
sips -z 180 180 "$TMP_DIR/app-icon.svg.png" --out "$PUBLIC_DIR/apple-touch-icon.png" >/dev/null
cp "$TMP_DIR/app-icon.svg" "$PUBLIC_DIR/favicon.svg"

echo "✓ Iconos PWA generados con éxito en public/"
