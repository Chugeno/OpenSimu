import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('🚀 Desplegando OpenSimu a GitHub Pages (rama gh-pages)...');
try {
  execSync('git init', { cwd: distDir, stdio: 'inherit' });
  execSync('git checkout -B gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "deploy: publicar OpenSimu en GitHub Pages con soporte PWA"', { cwd: distDir, stdio: 'inherit' });
  execSync('git remote add origin https://github.com/Chugeno/OpenSimu.git', { cwd: distDir, stdio: 'inherit' });
  execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });
  console.log('🎉 ¡OpenSimu publicado exitosamente en GitHub Pages!');
} finally {
  try {
    execSync('rm -rf .git', { cwd: distDir, stdio: 'ignore' });
  } catch {}
}
