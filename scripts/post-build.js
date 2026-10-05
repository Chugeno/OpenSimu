import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(distDir)) {
  console.error('dist/ no existe.');
  process.exit(1);
}

// 1. Clonar index.html como OpenSimu.html para descarga directa
const indexPath = path.join(distDir, 'index.html');
const openSimuPath = path.join(distDir, 'OpenSimu.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, openSimuPath);
  console.log('✓ dist/OpenSimu.html generado');
}

// 2. Copiar archivos PWA necesarios para instalación web
const pwaFiles = [
  'manifest.webmanifest',
  'manifest.json',
  'sw.js',
  'favicon.svg',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-192.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
  'CNAME',
];

pwaFiles.forEach((file) => {
  const src = path.join(publicDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ PWA asset: dist/${file}`);
  }
});

console.log('🎉 Post-build PWA completado exitosamente.');
