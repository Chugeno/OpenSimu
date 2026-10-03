import fs from 'fs';
import path from 'path';

function walk(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    if (file === '60px' || file.startsWith('.')) return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.svg')) {
      results.push(fullPath);
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

/**
 * Inlines CSS rules from <style> blocks (e.g. Adobe Illustrator .st0, .st1, etc.)
 * directly into style="..." attributes on matching SVG elements.
 * This completely isolates each SVG icon so that class names never collide globally.
 */
export function inlineSvgStyles(xmlText: string): string {
  // 1. Remove XML declaration and comments
  let result = xmlText.replace(/<\?xml[^>]*\?>/gi, '').replace(/<!--[\s\S]*?-->/g, '').trim();

  // 2. Extract and parse all <style> blocks
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let styleMatch: RegExpExecArray | null;
  const classStyles: Record<string, Record<string, string>> = {};

  while ((styleMatch = styleRegex.exec(result)) !== null) {
    const css = styleMatch[1];
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let ruleMatch: RegExpExecArray | null;
    while ((ruleMatch = ruleRegex.exec(css)) !== null) {
      const selectorGroup = ruleMatch[1];
      const declarationsStr = ruleMatch[2];

      const declarations: Record<string, string> = {};
      declarationsStr.split(';').forEach((decl) => {
        const colonIdx = decl.indexOf(':');
        if (colonIdx > 0) {
          const prop = decl.substring(0, colonIdx).trim().toLowerCase();
          const val = decl.substring(colonIdx + 1).trim();
          if (prop && val) {
            declarations[prop] = val;
          }
        }
      });

      const selectors = selectorGroup.split(',');
      for (const sel of selectors) {
        const cleanSel = sel.trim();
        if (cleanSel.startsWith('.')) {
          const className = cleanSel.substring(1);
          if (!classStyles[className]) {
            classStyles[className] = {};
          }
          Object.assign(classStyles[className], declarations);
        }
      }
    }
  }

  // 3. Remove all <style>...</style> blocks
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  result = result.replace(/<defs>\s*<\/defs>/gi, '');

  // 4. If no class styles were defined, return sanitized result
  if (Object.keys(classStyles).length === 0) {
    return result.replace(/^\s*[\r\n]/gm, '').trim();
  }

  // 5. Replace class attributes on SVG elements with inlined styles
  result = result.replace(/<([a-zA-Z0-9]+)\b([^>]*?)>/g, (fullTag, tagName, rawAttrs) => {
    if (tagName.toLowerCase() === 'svg') return fullTag;

    const classMatch = rawAttrs.match(/\bclass=[\"']([^\"']+)[\"']/i);
    if (!classMatch) return fullTag;

    const isSelfClosing = /\/\s*$/.test(rawAttrs);
    let attrs = rawAttrs.replace(/\/\s*$/, '');

    const classList = classMatch[1].trim().split(/\s+/);
    const inlinedProps: Record<string, string> = {};
    const remainingClasses: string[] = [];

    for (const cls of classList) {
      if (classStyles[cls]) {
        Object.assign(inlinedProps, classStyles[cls]);
      } else {
        remainingClasses.push(cls);
      }
    }

    if (Object.keys(inlinedProps).length === 0) return fullTag;

    const styleMatch = attrs.match(/\bstyle=[\"']([^\"']+)[\"']/i);
    if (styleMatch) {
      styleMatch[1].split(';').forEach((decl: string) => {
        const colonIdx = decl.indexOf(':');
        if (colonIdx > 0) {
          const prop = decl.substring(0, colonIdx).trim().toLowerCase();
          const val = decl.substring(colonIdx + 1).trim();
          if (prop && val) {
            inlinedProps[prop] = val;
          }
        }
      });
    }

    const styleStr = Object.entries(inlinedProps)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    let newAttrs = attrs;
    if (remainingClasses.length > 0) {
      newAttrs = newAttrs.replace(/\bclass=[\"'][^\"']+[\"']/i, `class="${remainingClasses.join(' ')}"`);
    } else {
      newAttrs = newAttrs.replace(/\s*\bclass=[\"'][^\"']+[\"']/i, '');
    }

    if (styleMatch) {
      newAttrs = newAttrs.replace(/\bstyle=[\"'][^\"']+[\"']/i, `style="${styleStr}"`);
    } else {
      newAttrs = `${newAttrs} style="${styleStr}"`;
    }

    return `<${tagName}${newAttrs}${isSelfClosing ? '/>' : '>'}`;
  });

  return result.replace(/^\s*[\r\n]/gm, '').trim();
}

// 1. Bundle Canvas Symbols from public/symbols
const files = walk('public/symbols');
const map: Record<string, string> = {};
const metaMap: Record<string, SvgMeta> = {};

files.forEach((f) => {
  const rel = f.replace(/^public/, '');
  const rawContent = fs.readFileSync(f, 'utf8');
  const content = inlineSvgStyles(rawContent);
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

// 2. Bundle UI Icons from public/icons (Category tabs & Component palette)
const iconFiles = walk('public/icons');
const componentIconsMap: Record<string, string> = {};
const categoryIconsMap: Record<string, string> = {};

iconFiles.forEach((f) => {
  const rel = f.replace(/^public\/icons\//, '');
  const rawContent = fs.readFileSync(f, 'utf8').trim();
  const content = inlineSvgStyles(rawContent);
  const parts = rel.split(path.sep);
  if (parts.length === 2) {
    const [cat, file] = parts;
    const id = file.replace(/\.svg$/, '');
    if (cat === 'categories') {
      categoryIconsMap[id] = content;
    } else {
      componentIconsMap[id] = content;
    }
  }
});

const iconsTsContent = `// Auto-generated bundle of UI SVG icons for Categories and Component Palettes.
// Generated automatically during build from public/icons/.
// Can be edited directly as SVG files in public/icons/<category>/<id>.svg

export const CATEGORY_ICONS: Record<string, string> = ${JSON.stringify(categoryIconsMap, null, 2)};

export const COMPONENT_ICONS: Record<string, string> = ${JSON.stringify(componentIconsMap, null, 2)};
`;

fs.writeFileSync('src/ui/EmbeddedIcons.ts', iconsTsContent);
console.log(`[bundle-symbols] Pre-compiled ${Object.keys(categoryIconsMap).length} category icons and ${Object.keys(componentIconsMap).length} component icons into src/ui/EmbeddedIcons.ts`);
