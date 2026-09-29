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

interface SvgMeta {
  viewBox: { minX: number; minY: number; width: number; height: number };
  terminals: Record<string, { x: number; y: number }>;
  refTerminal?: { x: number; y: number };
}

function parseSvgSync(xmlText: string): SvgMeta {
  let minX = 0, minY = 0, width = 40, height = 60;
  const vbMatch = xmlText.match(/viewBox=["']([^"']+)["']/i);
  if (vbMatch) {
    const parts = vbMatch[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      [minX, minY, width, height] = parts;
    }
  }

  const terminals: Record<string, { x: number; y: number }> = {};
  const tagRegex = /<([a-zA-Z0-9]+)\b([^>]*\bid=["'](?:terminal_|t_)([^"']+)["'][^>]*)>/gi;
  let m: RegExpExecArray | null;
  while ((m = tagRegex.exec(xmlText)) !== null) {
    const tag = m[1].toLowerCase();
    const attrs = m[2];
    const termName = m[3].toLowerCase();

    const getAttr = (name: string) => {
      const match = attrs.match(new RegExp(name + "=['\"]([^'\"]+)['\"]", 'i'));
      return match ? parseFloat(match[1]) : 0;
    };

    let x = 0, y = 0;
    if (tag === 'circle') {
      x = getAttr('cx');
      y = getAttr('cy');
    } else if (tag === 'rect') {
      x = getAttr('x') + getAttr('width') / 2;
      y = getAttr('y') + getAttr('height') / 2;
    } else if (tag === 'line') {
      x = getAttr('x1');
      y = getAttr('y1');
    }
    terminals[termName] = { x, y };
  }

  let refTerminal: { x: number; y: number } | undefined;
  const keys = Object.keys(terminals);
  if (keys.length > 0) {
    let minTermY = Infinity;
    let minTermX = Infinity;
    for (const k of keys) {
      const pt = terminals[k];
      if (pt.y < minTermY || (pt.y === minTermY && pt.x < minTermX)) {
        minTermY = pt.y;
        minTermX = pt.x;
        refTerminal = pt;
      }
    }
  }

  return {
    viewBox: { minX, minY, width, height },
    terminals,
    refTerminal,
  };
}

const files = walk('public/symbols');
const map: Record<string, string> = {};
const metaMap: Record<string, SvgMeta> = {};

files.forEach((f) => {
  const rel = f.replace(/^public/, '');
  const content = fs.readFileSync(f, 'utf8');
  map[rel] = content;
  metaMap[rel] = parseSvgSync(content);
});

const tsContent = `// Auto-generated bundle of SVG symbols and pre-compiled terminal metadata for 100% offline, ultra-fast performance.
// Generated automatically during build. Cero DOMParser required on client machine.
export const EMBEDDED_SYMBOLS: Record<string, string> = ${JSON.stringify(map, null, 2)};

export const EMBEDDED_SYMBOLS_META: Record<string, {
  viewBox: { minX: number; minY: number; width: number; height: number };
  terminals: Record<string, { x: number; y: number }>;
  refTerminal?: { x: number; y: number };
}> = ${JSON.stringify(metaMap, null, 2)};
`;

fs.writeFileSync('src/core/EmbeddedSymbols.ts', tsContent);
console.log(`[bundle-symbols] Pre-compiled ${Object.keys(map).length} symbols with metadata into src/core/EmbeddedSymbols.ts`);
