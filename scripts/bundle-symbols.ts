import fs from 'fs';
import path from 'path';

function walk(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.svg')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('public/symbols');
const map: Record<string, string> = {};
files.forEach((f) => {
  const rel = f.replace(/^public/, '');
  map[rel] = fs.readFileSync(f, 'utf8');
});

const tsContent = `// Auto-generated bundle of SVG symbols for 100% offline, standalone single-file distribution.\n// Generated automatically during build.\nexport const EMBEDDED_SYMBOLS: Record<string, string> = ${JSON.stringify(map, null, 2)};\n`;

fs.writeFileSync('src/core/EmbeddedSymbols.ts', tsContent);
console.log(`[bundle-symbols] Embedded ${Object.keys(map).length} symbols into src/core/EmbeddedSymbols.ts`);
