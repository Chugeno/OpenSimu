import type { CircuitComponent, Wire } from './types';
import { SymbolRenderer } from './SymbolRenderer';
import { getComponentBounds } from './ComponentRegistry';

export interface SheetDimension {
  name: string;
  widthMm: number;
  heightMm: number;
}

export const PRESET_SHEETS: Record<string, SheetDimension> = {
  A4_H: { name: 'A4 Horizontal', widthMm: 297, heightMm: 210 },
  A4_V: { name: 'A4 Vertical', widthMm: 210, heightMm: 297 },
  A3_H: { name: 'A3 Horizontal', widthMm: 420, heightMm: 297 },
  A3_V: { name: 'A3 Vertical', widthMm: 297, heightMm: 420 },
  LETTER_H: { name: 'Carta Horizontal (Letter)', widthMm: 279.4, heightMm: 215.9 },
  LETTER_V: { name: 'Carta Vertical (Letter)', widthMm: 215.9, heightMm: 279.4 },
  LEGAL_H: { name: 'Oficio Horizontal (Legal)', widthMm: 355.6, heightMm: 215.9 },
  LEGAL_V: { name: 'Oficio Vertical (Legal)', widthMm: 215.9, heightMm: 355.6 },
};

export interface CircuitBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export function computeCircuitBounds(
  components: CircuitComponent[],
  wires: Wire[],
  junctions: { x: number; y: number }[] = []
): CircuitBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const comp of components) {
    const b = getComponentBounds(comp);
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.width);
    maxY = Math.max(maxY, b.y + b.height);
  }

  for (const wire of wires) {
    for (const pt of wire.points) {
      minX = Math.min(minX, pt.x);
      minY = Math.min(minY, pt.y);
      maxX = Math.max(maxX, pt.x);
      maxY = Math.max(maxY, pt.y);
    }
  }

  for (const j of junctions) {
    minX = Math.min(minX, j.x);
    minY = Math.min(minY, j.y);
    maxX = Math.max(maxX, j.x);
    maxY = Math.max(maxY, j.y);
  }

  if (minX === Infinity) {
    // Empty circuit default box
    return { minX: 0, minY: 0, maxX: 400, maxY: 300, width: 400, height: 300 };
  }

  // Padding margin around circuit elements
  const pad = 30;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(80, maxX - minX),
    height: Math.max(60, maxY - minY),
  };
}

export function renderCircuitToContext(
  ctx: CanvasRenderingContext2D,
  components: CircuitComponent[],
  wires: Wire[],
  junctions: { x: number; y: number }[] = []
) {
  // 1. Draw Wires
  for (const w of wires) {
    if (w.points.length === 0) continue;
    ctx.save();
    let strokeColor = '#854d0e';
    const lineWidth = 2;

    if (w.type === 'phase' || w.type === 'phase_l1') strokeColor = '#854d0e';
    else if (w.type === 'phase_l2') strokeColor = '#0f172a';
    else if (w.type === 'phase_l3') strokeColor = '#dc2626';
    else if (w.type === 'neutral') strokeColor = '#0284c7';
    else if (w.type === 'pe') strokeColor = '#16a34a';
    else if (w.type === 'dc_pos') strokeColor = '#dc2626';
    else if (w.type === 'dc_neg') strokeColor = '#1e3a8a';

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    for (let i = 0; i < w.points.length; i++) {
      const pt = w.points[i];
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }

    if (w.type === 'pe') {
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = lineWidth;
      ctx.setLineDash([7, 7]);
      ctx.stroke();

      ctx.strokeStyle = '#eab308';
      ctx.lineDashOffset = 7;
      ctx.stroke();
    } else {
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. Draw Junction Dots
  for (const j of junctions) {
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(j.x, j.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3. Draw Components
  for (const comp of components) {
    SymbolRenderer.renderComponent(ctx, comp, false, false);
  }
}
