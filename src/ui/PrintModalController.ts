import {
  PRESET_SHEETS,
  computeCircuitBounds,
  renderCircuitToContext,
  type CircuitBounds,
} from '../core/PrintEngine';
import type { CircuitComponent, Wire } from '../core/types';

export class PrintModalController {
  private modal: HTMLElement | null = null;
  private previewCanvas: HTMLCanvasElement | null = null;
  private sheetSelect: HTMLSelectElement | null = null;
  private customSizeRow: HTMLElement | null = null;
  private customWInput: HTMLInputElement | null = null;
  private customHInput: HTMLInputElement | null = null;
  private marginInput: HTMLInputElement | null = null;
  private titleBlockCheckbox: HTMLInputElement | null = null;
  private btnFit: HTMLButtonElement | null = null;
  private btnCenter: HTMLButtonElement | null = null;
  private btnCancel: HTMLButtonElement | null = null;
  private btnPrintExec: HTMLButtonElement | null = null;

  private components: CircuitComponent[] = [];
  private wires: Wire[] = [];
  private junctions: { x: number; y: number }[] = [];

  // Sheet configuration (in mm)
  private sheetWidthMm = 297;
  private sheetHeightMm = 210;
  private marginMm = 10;
  private showTitleBlock = true;

  // Circuit frame in sheet-space normalized coords (0 to 1, or mm)
  // We represent the placement in sheet mm:
  private frameX = 10;
  private frameY = 10;
  private frameW = 277;
  private frameH = 190;

  // Aspect ratio of the circuit
  private circuitBounds: CircuitBounds = { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
  private circuitAspectRatio = 1.0;

  // Dragging state on preview canvas
  private isDragging = false;
  private isResizing = false;
  private resizeHandle: 'nw' | 'ne' | 'se' | 'sw' | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private initialFrameX = 0;
  private initialFrameY = 0;
  private initialFrameW = 0;
  private initialFrameH = 0;

  // Canvas display scale (pixels per mm on the screen preview)
  private previewScale = 1.0;
  private previewOffsetX = 0;
  private previewOffsetY = 0;

  constructor() {
    this.initDOMElements();
    this.setupEvents();
  }

  private initDOMElements() {
    this.modal = document.getElementById('print-modal');
    this.previewCanvas = document.getElementById('print-preview-canvas') as HTMLCanvasElement | null;
    this.sheetSelect = document.getElementById('print-sheet-preset') as HTMLSelectElement | null;
    this.customSizeRow = document.getElementById('print-custom-size-row');
    this.customWInput = document.getElementById('print-custom-w') as HTMLInputElement | null;
    this.customHInput = document.getElementById('print-custom-h') as HTMLInputElement | null;
    this.marginInput = document.getElementById('print-margin') as HTMLInputElement | null;
    this.titleBlockCheckbox = document.getElementById('print-title-block') as HTMLInputElement | null;
    this.btnFit = document.getElementById('btn-print-fit') as HTMLButtonElement | null;
    this.btnCenter = document.getElementById('btn-print-center') as HTMLButtonElement | null;
    this.btnCancel = document.getElementById('btn-print-cancel') as HTMLButtonElement | null;
    this.btnPrintExec = document.getElementById('btn-print-exec') as HTMLButtonElement | null;
  }

  private setupEvents() {
    if (this.sheetSelect) {
      this.sheetSelect.onchange = () => {
        const val = this.sheetSelect!.value;
        if (val === 'CUSTOM') {
          if (this.customSizeRow) this.customSizeRow.style.display = 'flex';
          const cw = parseFloat(this.customWInput?.value || '210');
          const ch = parseFloat(this.customHInput?.value || '297');
          this.sheetWidthMm = !isNaN(cw) && cw > 20 ? cw : 210;
          this.sheetHeightMm = !isNaN(ch) && ch > 20 ? ch : 297;
        } else {
          if (this.customSizeRow) this.customSizeRow.style.display = 'none';
          const preset = PRESET_SHEETS[val];
          if (preset) {
            this.sheetWidthMm = preset.widthMm;
            this.sheetHeightMm = preset.heightMm;
          }
        }
        this.fitCircuitToSheet();
        this.renderPreview();
      };
    }

    const onCustomSizeChange = () => {
      const cw = parseFloat(this.customWInput?.value || '210');
      const ch = parseFloat(this.customHInput?.value || '297');
      if (!isNaN(cw) && cw > 20) this.sheetWidthMm = cw;
      if (!isNaN(ch) && ch > 20) this.sheetHeightMm = ch;
      this.fitCircuitToSheet();
      this.renderPreview();
    };

    if (this.customWInput) this.customWInput.oninput = onCustomSizeChange;
    if (this.customHInput) this.customHInput.oninput = onCustomSizeChange;

    if (this.marginInput) {
      this.marginInput.oninput = () => {
        const m = parseFloat(this.marginInput!.value);
        this.marginMm = !isNaN(m) && m >= 0 ? m : 10;
        this.renderPreview();
      };
    }

    if (this.titleBlockCheckbox) {
      this.titleBlockCheckbox.onchange = () => {
        this.showTitleBlock = Boolean(this.titleBlockCheckbox?.checked);
        this.renderPreview();
      };
    }

    if (this.btnFit) {
      this.btnFit.onclick = () => {
        this.fitCircuitToSheet();
        this.renderPreview();
      };
    }

    if (this.btnCenter) {
      this.btnCenter.onclick = () => {
        this.centerCircuitOnSheet();
        this.renderPreview();
      };
    }

    if (this.btnCancel) {
      this.btnCancel.onclick = () => {
        this.close();
      };
    }

    if (this.btnPrintExec) {
      this.btnPrintExec.onclick = () => {
        this.executeHighResPrint();
      };
    }

    // Canvas Pointer / Mouse interactions for dragging & corner scaling
    if (this.previewCanvas) {
      this.previewCanvas.onpointerdown = (e) => this.handlePointerDown(e);
      window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
      window.addEventListener('pointerup', () => this.handlePointerUp());
    }

    window.addEventListener('resize', () => {
      if (this.modal && this.modal.style.display !== 'none') {
        this.renderPreview();
      }
    });
  }

  public open(components: CircuitComponent[], wires: Wire[], junctions: { x: number; y: number }[] = []) {
    this.components = components;
    this.wires = wires;
    this.junctions = junctions;

    this.circuitBounds = computeCircuitBounds(components, wires, junctions);
    this.circuitAspectRatio = this.circuitBounds.width / this.circuitBounds.height;

    // Default sheet: If circuit is wider than tall, A4_H, otherwise A4_V
    if (this.circuitAspectRatio >= 1) {
      this.sheetWidthMm = PRESET_SHEETS.A4_H.widthMm;
      this.sheetHeightMm = PRESET_SHEETS.A4_H.heightMm;
      if (this.sheetSelect) this.sheetSelect.value = 'A4_H';
    } else {
      this.sheetWidthMm = PRESET_SHEETS.A4_V.widthMm;
      this.sheetHeightMm = PRESET_SHEETS.A4_V.heightMm;
      if (this.sheetSelect) this.sheetSelect.value = 'A4_V';
    }

    if (this.customSizeRow) this.customSizeRow.style.display = 'none';

    this.marginMm = 10;
    if (this.marginInput) this.marginInput.value = '10';
    this.showTitleBlock = true;
    if (this.titleBlockCheckbox) this.titleBlockCheckbox.checked = true;

    this.fitCircuitToSheet();

    if (this.modal) {
      this.modal.style.display = 'flex';
      requestAnimationFrame(() => {
        this.renderPreview();
      });
    }
  }

  public close() {
    if (this.modal) {
      this.modal.style.display = 'none';
    }
  }

  private fitCircuitToSheet() {
    const titleBlockReserveH = this.showTitleBlock ? 25 : 0;
    const availW = Math.max(20, this.sheetWidthMm - this.marginMm * 2);
    const availH = Math.max(20, this.sheetHeightMm - this.marginMm * 2 - titleBlockReserveH);

    let targetW = availW;
    let targetH = targetW / this.circuitAspectRatio;

    if (targetH > availH) {
      targetH = availH;
      targetW = targetH * this.circuitAspectRatio;
    }

    this.frameW = targetW;
    this.frameH = targetH;
    this.frameX = this.marginMm + (availW - targetW) / 2;
    this.frameY = this.marginMm + (availH - targetH) / 2;
  }

  private centerCircuitOnSheet() {
    const titleBlockReserveH = this.showTitleBlock ? 25 : 0;
    const availW = Math.max(20, this.sheetWidthMm - this.marginMm * 2);
    const availH = Math.max(20, this.sheetHeightMm - this.marginMm * 2 - titleBlockReserveH);

    this.frameX = this.marginMm + (availW - this.frameW) / 2;
    this.frameY = this.marginMm + (availH - this.frameH) / 2;
  }

  private renderPreview() {
    if (!this.previewCanvas) return;
    const canvas = this.previewCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match display container
    const container = canvas.parentElement;
    if (container) {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark drafting backdrop
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Compute preview scale to fit sheet inside container with padding
    const padding = 28;
    const availCanvasW = Math.max(50, canvas.width - padding * 2);
    const availCanvasH = Math.max(50, canvas.height - padding * 2);

    const scaleX = availCanvasW / this.sheetWidthMm;
    const scaleY = availCanvasH / this.sheetHeightMm;
    this.previewScale = Math.min(scaleX, scaleY);

    const sheetPxW = this.sheetWidthMm * this.previewScale;
    const sheetPxH = this.sheetHeightMm * this.previewScale;
    this.previewOffsetX = (canvas.width - sheetPxW) / 2;
    this.previewOffsetY = (canvas.height - sheetPxH) / 2;

    // Draw Sheet Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    // Draw White Sheet of Paper
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.previewOffsetX, this.previewOffsetY, sheetPxW, sheetPxH);
    ctx.restore();

    // Sheet Border
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.previewOffsetX, this.previewOffsetY, sheetPxW, sheetPxH);

    // Margin Guides (dashed)
    if (this.marginMm > 0) {
      const mPx = this.marginMm * this.previewScale;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(
        this.previewOffsetX + mPx,
        this.previewOffsetY + mPx,
        sheetPxW - mPx * 2,
        sheetPxH - mPx * 2
      );
      ctx.setLineDash([]);
    }

    // Title Block (Cajetín Normalizado IEC / DIN)
    if (this.showTitleBlock) {
      this.renderTitleBlock(ctx, sheetPxW, sheetPxH);
    }

    // Draw Circuit inside Frame
    const fPxX = this.previewOffsetX + this.frameX * this.previewScale;
    const fPxY = this.previewOffsetY + this.frameY * this.previewScale;
    const fPxW = this.frameW * this.previewScale;
    const fPxH = this.frameH * this.previewScale;

    ctx.save();
    ctx.beginPath();
    ctx.rect(fPxX, fPxY, fPxW, fPxH);
    ctx.clip();

    // Map circuit bounds to frame
    const circuitScale = fPxW / this.circuitBounds.width;
    ctx.translate(fPxX, fPxY);
    ctx.scale(circuitScale, circuitScale);
    ctx.translate(-this.circuitBounds.minX, -this.circuitBounds.minY);

    renderCircuitToContext(ctx, this.components, this.wires, this.junctions);
    ctx.restore();

    // Draw Frame Bounding Box & Corner Handles
    ctx.save();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(fPxX, fPxY, fPxW, fPxH);
    ctx.setLineDash([]);

    // Corner Handles
    const handleSize = 8;
    const corners = [
      { x: fPxX, y: fPxY },
      { x: fPxX + fPxW, y: fPxY },
      { x: fPxX + fPxW, y: fPxY + fPxH },
      { x: fPxX, y: fPxY + fPxH },
    ];

    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (const c of corners) {
      ctx.fillRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
    }

    // Center Drag Icon
    ctx.fillStyle = 'rgba(2, 132, 199, 0.8)';
    ctx.beginPath();
    ctx.arc(fPxX + fPxW / 2, fPxY + fPxH / 2, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderTitleBlock(ctx: CanvasRenderingContext2D, sheetPxW: number, sheetPxH: number) {
    const mPx = this.marginMm * this.previewScale;
    const tbW = Math.min(sheetPxW - mPx * 2, 120 * this.previewScale);
    const tbH = 22 * this.previewScale;
    const tbX = this.previewOffsetX + sheetPxW - mPx - tbW;
    const tbY = this.previewOffsetY + sheetPxH - mPx - tbH;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tbX, tbY, tbW, tbH);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(tbX, tbY, tbW, tbH);

    // Inner dividing lines
    const halfH = tbH / 2;
    ctx.beginPath();
    ctx.moveTo(tbX, tbY + halfH);
    ctx.lineTo(tbX + tbW, tbY + halfH);
    ctx.moveTo(tbX + tbW * 0.6, tbY);
    ctx.lineTo(tbX + tbW * 0.6, tbY + tbH);
    ctx.stroke();

    // Text labels
    ctx.fillStyle = '#0f172a';
    const fontSize = Math.max(8, Math.round(3.2 * this.previewScale));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = 'middle';

    ctx.fillText('OpenSimu CAD', tbX + 6, tbY + halfH / 2);

    ctx.font = `${Math.max(7, fontSize - 2)}px sans-serif`;
    ctx.fillStyle = '#475569';
    const dateStr = new Date().toLocaleDateString();
    ctx.fillText(`Fecha: ${dateStr}`, tbX + 6, tbY + halfH + halfH / 2);

    ctx.fillText(`Hoja: ${this.sheetWidthMm}x${this.sheetHeightMm}mm`, tbX + tbW * 0.63, tbY + halfH / 2);
    ctx.fillText('Escala: Libre 1:1', tbX + tbW * 0.63, tbY + halfH + halfH / 2);

    ctx.restore();
  }

  // Pointer event handlers for Canvas interaction
  private handlePointerDown(e: PointerEvent) {
    if (!this.previewCanvas) return;
    const rect = this.previewCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const fPxX = this.previewOffsetX + this.frameX * this.previewScale;
    const fPxY = this.previewOffsetY + this.frameY * this.previewScale;
    const fPxW = this.frameW * this.previewScale;
    const fPxH = this.frameH * this.previewScale;
    const handleThreshold = 12;

    // Check corners
    if (Math.hypot(mx - fPxX, my - fPxY) <= handleThreshold) {
      this.isResizing = true;
      this.resizeHandle = 'nw';
    } else if (Math.hypot(mx - (fPxX + fPxW), my - fPxY) <= handleThreshold) {
      this.isResizing = true;
      this.resizeHandle = 'ne';
    } else if (Math.hypot(mx - (fPxX + fPxW), my - (fPxY + fPxH)) <= handleThreshold) {
      this.isResizing = true;
      this.resizeHandle = 'se';
    } else if (Math.hypot(mx - fPxX, my - (fPxY + fPxH)) <= handleThreshold) {
      this.isResizing = true;
      this.resizeHandle = 'sw';
    } else if (mx >= fPxX && mx <= fPxX + fPxW && my >= fPxY && my <= fPxY + fPxH) {
      this.isDragging = true;
    }

    if (this.isDragging || this.isResizing) {
      this.dragStartX = mx;
      this.dragStartY = my;
      this.initialFrameX = this.frameX;
      this.initialFrameY = this.frameY;
      this.initialFrameW = this.frameW;
      this.initialFrameH = this.frameH;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  }

  private handlePointerMove(e: PointerEvent) {
    if (!this.previewCanvas) return;
    const rect = this.previewCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (this.isDragging) {
      const deltaXmm = (mx - this.dragStartX) / this.previewScale;
      const deltaYmm = (my - this.dragStartY) / this.previewScale;
      this.frameX = this.initialFrameX + deltaXmm;
      this.frameY = this.initialFrameY + deltaYmm;
      this.renderPreview();
      return;
    }

    if (this.isResizing && this.resizeHandle) {
      const deltaXmm = (mx - this.dragStartX) / this.previewScale;

      let newW = this.initialFrameW;
      let newH = this.initialFrameH;
      let newX = this.initialFrameX;
      let newY = this.initialFrameY;

      if (this.resizeHandle === 'se') {
        newW = Math.max(20, this.initialFrameW + deltaXmm);
        newH = newW / this.circuitAspectRatio;
      } else if (this.resizeHandle === 'ne') {
        newW = Math.max(20, this.initialFrameW + deltaXmm);
        newH = newW / this.circuitAspectRatio;
        newY = this.initialFrameY - (newH - this.initialFrameH);
      } else if (this.resizeHandle === 'sw') {
        newW = Math.max(20, this.initialFrameW - deltaXmm);
        newH = newW / this.circuitAspectRatio;
        newX = this.initialFrameX + (this.initialFrameW - newW);
      } else if (this.resizeHandle === 'nw') {
        newW = Math.max(20, this.initialFrameW - deltaXmm);
        newH = newW / this.circuitAspectRatio;
        newX = this.initialFrameX + (this.initialFrameW - newW);
        newY = this.initialFrameY - (newH - this.initialFrameH);
      }

      this.frameW = newW;
      this.frameH = newH;
      this.frameX = newX;
      this.frameY = newY;
      this.renderPreview();
      return;
    }

    // Cursor feedback on hover
    const fPxX = this.previewOffsetX + this.frameX * this.previewScale;
    const fPxY = this.previewOffsetY + this.frameY * this.previewScale;
    const fPxW = this.frameW * this.previewScale;
    const fPxH = this.frameH * this.previewScale;
    const handleThreshold = 12;

    if (
      Math.hypot(mx - fPxX, my - fPxY) <= handleThreshold ||
      Math.hypot(mx - (fPxX + fPxW), my - (fPxY + fPxH)) <= handleThreshold
    ) {
      this.previewCanvas.style.cursor = 'nwse-resize';
    } else if (
      Math.hypot(mx - (fPxX + fPxW), my - fPxY) <= handleThreshold ||
      Math.hypot(mx - fPxX, my - (fPxY + fPxH)) <= handleThreshold
    ) {
      this.previewCanvas.style.cursor = 'nesw-resize';
    } else if (mx >= fPxX && mx <= fPxX + fPxW && my >= fPxY && my <= fPxY + fPxH) {
      this.previewCanvas.style.cursor = 'move';
    } else {
      this.previewCanvas.style.cursor = 'default';
    }
  }

  private handlePointerUp() {
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
  }

  /**
   * Generates a 300 DPI high-definition print sheet and opens the browser native print dialog.
   */
  private executeHighResPrint() {
    const dpi = 300;
    const mmToInch = 1 / 25.4;
    const printPixelW = Math.round(this.sheetWidthMm * mmToInch * dpi);
    const printPixelH = Math.round(this.sheetHeightMm * mmToInch * dpi);

    const offscreen = document.createElement('canvas');
    offscreen.width = printPixelW;
    offscreen.height = printPixelH;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    // Pure white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, printPixelW, printPixelH);

    const pxPerMm = (dpi / 25.4);

    // Margins (fine technical boundary line)
    if (this.marginMm > 0) {
      const mPx = this.marginMm * pxPerMm;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.strokeRect(mPx, mPx, printPixelW - mPx * 2, printPixelH - mPx * 2);
    }

    // Title Block in print
    if (this.showTitleBlock) {
      const mPx = this.marginMm * pxPerMm;
      const tbW = Math.min(printPixelW - mPx * 2, 130 * pxPerMm);
      const tbH = 24 * pxPerMm;
      const tbX = printPixelW - mPx - tbW;
      const tbY = printPixelH - mPx - tbH;

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(tbX, tbY, tbW, tbH);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(tbX, tbY, tbW, tbH);

      const halfH = tbH / 2;
      ctx.beginPath();
      ctx.moveTo(tbX, tbY + halfH);
      ctx.lineTo(tbX + tbW, tbY + halfH);
      ctx.moveTo(tbX + tbW * 0.6, tbY);
      ctx.lineTo(tbX + tbW * 0.6, tbY + tbH);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      const fontSize = Math.max(12, Math.round(3.5 * pxPerMm));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillText('OpenSimu CAD', tbX + 16, tbY + halfH / 2);

      ctx.font = `${Math.max(10, fontSize - 4)}px sans-serif`;
      ctx.fillStyle = '#334155';
      const dateStr = new Date().toLocaleDateString();
      ctx.fillText(`Fecha: ${dateStr}`, tbX + 16, tbY + halfH + halfH / 2);
      ctx.fillText(`Hoja: ${this.sheetWidthMm}x${this.sheetHeightMm}mm`, tbX + tbW * 0.62 + 10, tbY + halfH / 2);
      ctx.fillText('Escala: Libre 1:1', tbX + tbW * 0.62 + 10, tbY + halfH + halfH / 2);
      ctx.restore();
    }

    // Render Circuit
    const fPxX = this.frameX * pxPerMm;
    const fPxY = this.frameY * pxPerMm;
    const fPxW = this.frameW * pxPerMm;
    const fPxH = this.frameH * pxPerMm;

    ctx.save();
    ctx.beginPath();
    ctx.rect(fPxX, fPxY, fPxW, fPxH);
    ctx.clip();

    const circuitScale = fPxW / this.circuitBounds.width;
    ctx.translate(fPxX, fPxY);
    ctx.scale(circuitScale, circuitScale);
    ctx.translate(-this.circuitBounds.minX, -this.circuitBounds.minY);

    renderCircuitToContext(ctx, this.components, this.wires, this.junctions);
    ctx.restore();

    // Create printable window or inject printable image
    const dataUrl = offscreen.toDataURL('image/png');
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const isHorizontal = this.sheetWidthMm >= this.sheetHeightMm;
    const orientation = isHorizontal ? 'landscape' : 'portrait';

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Impresión OpenSimu</title>
          <style>
            @page {
              size: ${this.sheetWidthMm}mm ${this.sheetHeightMm}mm ${orientation};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #ffffff;
            }
            img {
              width: 100vw;
              height: 100vh;
              object-fit: contain;
              display: block;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.focus(); window.print();" />
        </body>
        </html>
      `);
      frameDoc.close();

      setTimeout(() => {
        printFrame.remove();
      }, 5000);
    }
  }
}
