import type { CircuitComponent, Wire, WireType, Point, SimulationResult, Rect, CircuitSnapshot } from '../core/types';
import { Grid } from '../core/Grid';
import { SymbolRenderer } from '../core/SymbolRenderer';
import { SimulationEngine } from '../core/SimulationEngine';
import { COMPONENT_DEFINITIONS, getComponentBounds } from '../core/ComponentRegistry';

export type ToolType = 
  | 'select' 
  | 'wire_phase' 
  | 'wire_phase_l1'
  | 'wire_phase_l2'
  | 'wire_phase_l3'
  | 'wire_3phase'
  | 'wire_neutral' 
  | 'wire_pe' 
  | 'wire_dc_pos' 
  | 'wire_dc_neg' 
  | 'junction'
  | 'place_component' 
  | 'delete';

export class CanvasView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private grid: Grid;

  public components: CircuitComponent[] = [];
  public wires: Wire[] = [];
  public manualNodes: Point[] = [];
  public suppressedNodes: Point[] = [];

  public isSimulation: boolean = false;
  public simulationResult: SimulationResult = { running: false, shortCircuit: false, activeCoils: [] };

  public activeTool: ToolType = 'select';
  public pendingComponentType: string | null = null;

  // History & Undo / Redo state
  private undoStack: CircuitSnapshot[] = [];
  private redoStack: CircuitSnapshot[] = [];
  private readonly MAX_HISTORY: number = 50;
  private preDragSnapshot: CircuitSnapshot | null = null;
  public onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;

  // Clipboard state
  public clipboard: {
    components: CircuitComponent[];
    wires: Wire[];
    pasteCount: number;
  } | null = null;

  // Multi-selection state
  public selectedComponents: Set<CircuitComponent> = new Set();
  public selectedWires: Set<Wire> = new Set();

  public get selectedComponent(): CircuitComponent | null {
    return this.selectedComponents.size === 1 ? Array.from(this.selectedComponents)[0] : null;
  }
  public set selectedComponent(comp: CircuitComponent | null) {
    this.selectedComponents.clear();
    if (comp) this.selectedComponents.add(comp);
  }

  public get selectedWire(): Wire | null {
    return this.selectedWires.size === 1 ? Array.from(this.selectedWires)[0] : null;
  }
  public set selectedWire(wire: Wire | null) {
    this.selectedWires.clear();
    if (wire) this.selectedWires.add(wire);
  }

  // Interaction states
  private isPanning: boolean = false;
  private panStart: Point = { x: 0, y: 0 };
  private spacePressed: boolean = false;

  // Group drag state
  private isDraggingGroup: boolean = false;
  private dragStartWorld: Point = { x: 0, y: 0 };
  private initialCompPositions: Map<CircuitComponent, Point> = new Map();
  private initialWirePositions: Map<Wire, Point[]> = new Map();

  // CAD Box / Marquee selection state (Window vs Crossing)
  private isBoxSelecting: boolean = false;
  private boxSelectStart: Point = { x: 0, y: 0 };
  private boxSelectCurrent: Point = { x: 0, y: 0 };
  private baseSelectedComponents: Set<CircuitComponent> = new Set();
  private baseSelectedWires: Set<Wire> = new Set();

  // Wire drawing state (Click-and-drag or Click-to-click CADe_SIMU style)
  private isDrawingWire: boolean = false;
  private wireStartPoint: Point | null = null;
  private isPointerDownForWire: boolean = false;
  private currentMouseWorld: Point = { x: 0, y: 0 };
  private activeMomentaryComp: CircuitComponent | null = null;

  // Snap and hover preview state
  public hoveredSnapTarget: {
    point: Point;
    terminal?: {
      name: string;
      componentTag: string;
      component: CircuitComponent;
    };
    isWire?: boolean;
  } | null = null;
  public hoveredJunctionNode: Point | null = null;

  // Callbacks
  public onStatusUpdate?: (status: { x: number; y: number; simStatus: string; zoom: number }) => void;
  public onTagEditRequest?: (comp: CircuitComponent) => void;
  public onShortCircuit?: (result: SimulationResult) => void;
  public onToolChange?: (tool: ToolType, compType: string | null) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.grid = new Grid();

    this.setupEvents();
    SymbolRenderer.onRedrawNeeded = () => this.render();
    this.resize();
    this.render();
  }

  public resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  public setTool(tool: ToolType, compType: string | null = null) {
    this.activeTool = tool;
    this.pendingComponentType = compType;
    this.isDrawingWire = false;
    this.wireStartPoint = null;
    this.isPointerDownForWire = false;
    this.hoveredSnapTarget = null;
    this.hoveredJunctionNode = null;
    this.updateCursor(this.currentMouseWorld);
    this.render();
    this.notifyStatus();
  }

  public cancelAction() {
    this.isDrawingWire = false;
    this.wireStartPoint = null;
    this.isPointerDownForWire = false;
    this.isBoxSelecting = false;
    this.isDraggingGroup = false;
    this.hoveredSnapTarget = null;
    this.hoveredJunctionNode = null;
    this.clearSelection();
    this.activeTool = 'select';
    this.pendingComponentType = null;
    this.canvas.style.cursor = 'default';
    if (this.onToolChange) {
      this.onToolChange('select', null);
    }
    this.render();
    this.notifyStatus();
  }

  public findSnapTarget(worldPos: Point, snapRadius: number = 14): {
    point: Point;
    terminal?: {
      name: string;
      componentTag: string;
      component: CircuitComponent;
    };
    isWire?: boolean;
  } | null {
    let bestDist = snapRadius;
    let bestSnap: {
      point: Point;
      terminal?: {
        name: string;
        componentTag: string;
        component: CircuitComponent;
      };
      isWire?: boolean;
    } | null = null;

    // 1. Terminals de componentes (prioridad máxima)
    for (const comp of this.components) {
      for (const term of comp.terminals) {
        const tx = comp.x + term.relX;
        const ty = comp.y + term.relY;
        const d = Math.hypot(worldPos.x - tx, worldPos.y - ty);
        if (d < bestDist) {
          bestDist = d;
          bestSnap = {
            point: { x: tx, y: ty },
            terminal: {
              name: term.name,
              componentTag: comp.tag,
              component: comp,
            },
          };
        }
      }
    }

    if (bestSnap) return bestSnap;

    // 2. Vértices o puntos de cables existentes
    for (const wire of this.wires) {
      for (const pt of wire.points) {
        const d = Math.hypot(worldPos.x - pt.x, worldPos.y - pt.y);
        if (d < bestDist) {
          bestDist = d;
          bestSnap = {
            point: { x: pt.x, y: pt.y },
            isWire: true,
          };
        }
      }
    }

    // 3. Nodos de unión activos
    for (const j of this.getActiveJunctionNodes()) {
      const d = Math.hypot(worldPos.x - j.x, worldPos.y - j.y);
      if (d < bestDist) {
        bestDist = d;
        bestSnap = {
          point: { x: j.x, y: j.y },
          isWire: true,
        };
      }
    }

    return bestSnap;
  }

  public updateCursor(worldPos: Point) {
    if (this.spacePressed || this.isPanning) {
      this.canvas.style.cursor = 'grabbing';
      return;
    }

    if (this.isSimulation) {
      const comp = this.findComponentAt(worldPos);
      const def = comp ? COMPONENT_DEFINITIONS[comp.type] : null;
      if (def && (def.manualAction === 'toggle' || def.manualAction === 'momentary')) {
        this.canvas.style.cursor = 'pointer';
      } else {
        this.canvas.style.cursor = 'default';
      }
      return;
    }

    if (this.activeTool === 'junction') {
      if (this.hoveredJunctionNode) {
        // Hover sobre un nodo existente: cursor indicando acción de borrar/marcar
        this.canvas.style.cursor = 'pointer';
      } else {
        this.canvas.style.cursor = 'crosshair';
      }
      return;
    }

    if (this.activeTool.startsWith('wire_')) {
      this.canvas.style.cursor = 'crosshair';
      return;
    }

    if (this.activeTool === 'place_component') {
      this.canvas.style.cursor = 'crosshair';
      return;
    }

    if (this.activeTool === 'delete') {
      const comp = this.findComponentAt(worldPos);
      const wire = !comp ? this.findWireAt(worldPos) : null;
      this.canvas.style.cursor = comp || wire ? 'pointer' : 'not-allowed';
      return;
    }

    if (this.activeTool === 'select') {
      if (this.isDraggingGroup) {
        this.canvas.style.cursor = 'grabbing';
        return;
      }
      const comp = this.findComponentAt(worldPos);
      const wire = !comp ? this.findWireAt(worldPos) : null;
      if (comp || wire) {
        this.canvas.style.cursor = 'move';
      } else {
        this.canvas.style.cursor = 'default';
      }
      return;
    }

    this.canvas.style.cursor = 'default';
  }

  public startSimulation() {
    this.isSimulation = true;
    this.activeTool = 'select';
    this.selectedComponent = null;
    this.selectedWire = null;
    this.isDrawingWire = false;
    this.notifyHistoryChange();
    this.stepSimulation();
  }

  public stopSimulation() {
    this.isSimulation = false;
    this.activeMomentaryComp = null;
    // Reset all component states
    for (const comp of this.components) {
      comp.state.pressed = false;
      comp.state.energized = false;
      comp.state.tripped = false;
      comp.state.closed = comp.type.endsWith('_nc') && comp.type !== 'contact_no_nc';
    }
    this.simulationResult = { running: false, shortCircuit: false, activeCoils: [] };
    this.notifyHistoryChange();
    this.render();
  }

  public stepSimulation() {
    if (!this.isSimulation) return;
    this.simulationResult = SimulationEngine.solve(
      this.components,
      this.wires,
      this.simulationResult.activeCoils,
      this.manualNodes,
      this.suppressedNodes
    );
    this.render();
    this.notifyStatus();

    if (this.simulationResult.shortCircuit && this.onShortCircuit) {
      this.onShortCircuit(this.simulationResult);
    }
  }

  public clearCircuit() {
    if (this.components.length > 0 || this.wires.length > 0 || this.manualNodes.length > 0) {
      this.saveSnapshot();
    }
    this.components = [];
    this.wires = [];
    this.manualNodes = [];
    this.suppressedNodes = [];
    this.clearSelection();
    this.stopSimulation();
  }

  // --- UNDO / REDO (HISTORIAL) ---
  public canUndo(): boolean {
    return !this.isSimulation && this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return !this.isSimulation && this.redoStack.length > 0;
  }

  public notifyHistoryChange() {
    if (this.onHistoryChange) {
      this.onHistoryChange(this.canUndo(), this.canRedo());
    }
  }

  public createSnapshot(): CircuitSnapshot {
    return JSON.parse(
      JSON.stringify({
        components: this.components,
        wires: this.wires,
        manualNodes: this.manualNodes,
        suppressedNodes: this.suppressedNodes,
      })
    );
  }

  public saveSnapshot() {
    if (this.isSimulation) return;
    this.undoStack.push(this.createSnapshot());
    if (this.undoStack.length > this.MAX_HISTORY) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.notifyHistoryChange();
  }

  public pushPreSnapshot(snapshot: CircuitSnapshot) {
    if (this.isSimulation) return;
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.MAX_HISTORY) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.notifyHistoryChange();
  }

  public undo(): boolean {
    if (!this.canUndo()) return false;
    const current = this.createSnapshot();
    this.redoStack.push(current);
    const prev = this.undoStack.pop()!;
    this.restoreSnapshot(prev);
    this.notifyHistoryChange();
    return true;
  }

  public redo(): boolean {
    if (!this.canRedo()) return false;
    const current = this.createSnapshot();
    this.undoStack.push(current);
    const next = this.redoStack.pop()!;
    this.restoreSnapshot(next);
    this.notifyHistoryChange();
    return true;
  }

  private restoreSnapshot(snapshot: CircuitSnapshot) {
    this.components = snapshot.components || [];
    this.wires = snapshot.wires || [];
    this.manualNodes = snapshot.manualNodes || [];
    this.suppressedNodes = snapshot.suppressedNodes || [];
    this.clearSelection();
    this.render();
  }

  public clearHistory() {
    this.undoStack = [];
    this.redoStack = [];
    this.notifyHistoryChange();
  }

  // --- PORTAPAPELES (COPIAR / CORTAR / PEGAR / DUPLICAR / SELECCIONAR TODO) ---
  public selectAll() {
    if (this.isSimulation) return;
    this.selectedComponents = new Set(this.components);
    this.selectedWires = new Set(this.wires);
    this.render();
  }

  public copy(): boolean {
    if (this.isSimulation) return false;
    if (this.selectedComponents.size === 0 && this.selectedWires.size === 0) {
      return false;
    }

    const selectedComps = Array.from(this.selectedComponents);
    const selectedWiresList = Array.from(this.selectedWires);

    // Inclusión inteligente de cables que conectan los componentes seleccionados
    const selectedCompTerminals: Point[] = [];
    for (const c of selectedComps) {
      for (const t of c.terminals) {
        selectedCompTerminals.push({ x: c.x + t.relX, y: c.y + t.relY });
      }
    }

    const allWiresToCopy = new Set<Wire>(selectedWiresList);
    for (const w of this.wires) {
      if (allWiresToCopy.has(w) || w.points.length < 2) continue;
      const pStart = w.points[0];
      const pEnd = w.points[w.points.length - 1];
      const startConnected = selectedCompTerminals.some((pt) => Grid.pointsEqual(pt, pStart, 4));
      const endConnected = selectedCompTerminals.some((pt) => Grid.pointsEqual(pt, pEnd, 4));
      if (startConnected && endConnected) {
        allWiresToCopy.add(w);
      }
    }

    this.clipboard = {
      components: JSON.parse(JSON.stringify(selectedComps)),
      wires: JSON.parse(JSON.stringify(Array.from(allWiresToCopy))),
      pasteCount: 0,
    };

    return true;
  }

  public cut(): boolean {
    if (this.isSimulation) return false;
    if (this.selectedComponents.size === 0 && this.selectedWires.size === 0) {
      return false;
    }
    this.copy();
    this.saveSnapshot();
    this.components = this.components.filter((c) => !this.selectedComponents.has(c));
    this.wires = this.wires.filter((w) => !this.selectedWires.has(w));
    this.clearSelection();
    this.render();
    return true;
  }

  public paste(): boolean {
    if (this.isSimulation || !this.clipboard) return false;
    if (this.clipboard.components.length === 0 && this.clipboard.wires.length === 0) {
      return false;
    }

    this.saveSnapshot();

    this.clipboard.pasteCount++;
    const offset = this.clipboard.pasteCount * 20;

    // Vincular tags comunes: si se copió bobina -KM1 y contacto aux -KM1, ambos pasan a -KM2
    const tagMap = new Map<string, string>();
    const usedTags = new Set(this.components.map((c) => c.tag));

    for (const origComp of this.clipboard.components) {
      const origTag = origComp.tag;
      if (!tagMap.has(origTag)) {
        if (!origTag || origTag === 'Texto' || origTag === 'SVG') {
          tagMap.set(origTag, origTag);
        } else {
          const newTag = this.getNextAvailableTag(origTag, usedTags);
          tagMap.set(origTag, newTag);
          usedTags.add(newTag);
        }
      }
    }

    const newComps: CircuitComponent[] = [];
    for (const comp of this.clipboard.components) {
      const cloned: CircuitComponent = JSON.parse(JSON.stringify(comp));
      cloned.id = `c_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      cloned.x += offset;
      cloned.y += offset;
      cloned.tag = tagMap.get(comp.tag) || comp.tag;
      cloned.state = {
        pressed: false,
        closed: comp.type.endsWith('_nc') && comp.type !== 'contact_no_nc',
        energized: false,
        tripped: false,
        poles: comp.state?.poles || 1,
      };
      for (const t of cloned.terminals) {
        t.potential = 'NONE';
      }
      newComps.push(cloned);
    }

    const newWires: Wire[] = [];
    for (const wire of this.clipboard.wires) {
      const cloned: Wire = JSON.parse(JSON.stringify(wire));
      cloned.id = `w_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      cloned.points = cloned.points.map((p) => ({ x: p.x + offset, y: p.y + offset }));
      cloned.potential = 'NONE';
      newWires.push(cloned);
    }

    this.components.push(...newComps);
    this.wires.push(...newWires);

    // Seleccionar automáticamente los nuevos elementos pegados
    this.selectedComponents = new Set(newComps);
    this.selectedWires = new Set(newWires);

    this.render();
    return true;
  }

  public duplicate(): boolean {
    if (this.isSimulation) return false;
    if (this.selectedComponents.size === 0 && this.selectedWires.size === 0) {
      return false;
    }
    if (this.copy()) {
      return this.paste();
    }
    return false;
  }

  private getNextAvailableTag(originalTag: string, reservedTags?: Set<string>): string {
    const match = originalTag.match(/^(.*?)(\d+)$/);
    let prefix = originalTag;
    let nextNum = 1;
    if (match) {
      prefix = match[1];
      nextNum = parseInt(match[2], 10) + 1;
    } else {
      nextNum = 2;
    }

    const existingTags = reservedTags || new Set(this.components.map((c) => c.tag));
    let candidate = `${prefix}${nextNum}`;
    while (existingTags.has(candidate)) {
      nextNum++;
      candidate = `${prefix}${nextNum}`;
    }
    return candidate;
  }

  public resetZoom() {
    this.grid.zoom = 1.0;
    this.grid.panX = 60;
    this.grid.panY = 60;
    this.render();
    this.notifyStatus();
  }

  private notifyStatus() {
    if (!this.onStatusUpdate) return;
    let simMsg = 'Modo Edición';
    if (this.isSimulation) {
      simMsg = this.simulationResult.shortCircuit
        ? `⚠️ ${this.simulationResult.shortCircuitMessage}`
        : '▶️ Simulación en Curso (OK)';
    }
    this.onStatusUpdate({
      x: Math.round(this.currentMouseWorld.x),
      y: Math.round(this.currentMouseWorld.y),
      simStatus: simMsg,
      zoom: Math.round(this.grid.zoom * 100),
    });
  }

  private setupEvents() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('keydown', (e) => {
      // Ignore global canvas shortcuts if typing inside an input, textarea or editable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl) {
        if (!e.shiftKey && e.code === 'KeyZ') {
          e.preventDefault();
          this.undo();
          return;
        }
        if ((e.shiftKey && e.code === 'KeyZ') || e.code === 'KeyY') {
          e.preventDefault();
          this.redo();
          return;
        }
        if (e.code === 'KeyC') {
          e.preventDefault();
          this.copy();
          return;
        }
        if (e.code === 'KeyX') {
          e.preventDefault();
          this.cut();
          return;
        }
        if (e.code === 'KeyV') {
          e.preventDefault();
          this.paste();
          return;
        }
        if (e.code === 'KeyD') {
          e.preventDefault();
          this.duplicate();
          return;
        }
        if (e.code === 'KeyA') {
          e.preventDefault();
          this.selectAll();
          return;
        }
      }

      if (e.code === 'Space') {
        this.spacePressed = true;
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        if (!this.isSimulation) {
          if (this.selectedComponents.size > 0 || this.selectedWires.size > 0) {
            this.saveSnapshot();
            this.components = this.components.filter((c) => !this.selectedComponents.has(c));
            this.wires = this.wires.filter((w) => !this.selectedWires.has(w));
            this.clearSelection();
            this.render();
          }
        }
      } else if (e.code === 'Escape') {
        this.cancelAction();
      } else if (e.code === 'Enter' || e.code === 'F2') {
        if (!this.isSimulation && this.selectedComponents.size === 1 && this.onTagEditRequest) {
          const comp = Array.from(this.selectedComponents)[0];
          this.onTagEditRequest(comp);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.spacePressed = false;
      }
    });

    // Suppress context menu on canvas and trigger cancelAction
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.cancelAction();
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldBefore = this.grid.screenToWorld(mouseX, mouseY);
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.grid.zoom = Math.max(0.3, Math.min(3.0, this.grid.zoom * zoomFactor));

      const worldAfter = this.grid.screenToWorld(mouseX, mouseY);
      this.grid.panX += (worldAfter.x - worldBefore.x) * this.grid.zoom;
      this.grid.panY += (worldAfter.y - worldBefore.y) * this.grid.zoom;

      this.render();
      this.notifyStatus();
    }, { passive: false });

    this.canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    this.canvas.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    this.canvas.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
  }

  private handlePointerDown(e: PointerEvent) {
    // Right click (CADe_SIMU style: cancels placement/tool, liberates mouse)
    if (e.button === 2) {
      e.preventDefault();
      this.cancelAction();
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = this.grid.screenToWorld(sx, sy);
    const snapped = Grid.snapPoint(world);

    // Pan with middle click or space + left click
    if (e.button === 1 || this.spacePressed) {
      this.isPanning = true;
      this.panStart = { x: sx - this.grid.panX, y: sy - this.grid.panY };
      return;
    }

    if (this.isSimulation) {
      // In simulation mode, clicking interacts according to manualAction (toggle / momentary)
      const clickedComp = this.findComponentAt(world);
      if (clickedComp) {
        const def = COMPONENT_DEFINITIONS[clickedComp.type];
        const action = def?.manualAction || 'none';
        const targetTag = clickedComp.tag;

        // Elementos vinculados por nombre idéntico (case-sensitive exact match estilo CADe_SIMU)
        const isNamedDevice = Boolean(targetTag && targetTag !== 'Texto' && targetTag !== 'SVG');
        const linkedComps = isNamedDevice
          ? this.components.filter((c) => c.tag === targetTag)
          : [clickedComp];

        if (action === 'momentary') {
          this.activeMomentaryComp = clickedComp;
          const wasAlreadyPressed = Boolean(clickedComp.state.pressed);
          const nextPressed = !wasAlreadyPressed;

          for (const c of linkedComps) {
            c.state.pressed = nextPressed;
          }
          this.stepSimulation();
        } else if (action === 'toggle') {
          if (clickedComp.type === 'thermal_relay_3p') {
            const willBeTripped = !clickedComp.state.tripped;
            for (const c of linkedComps) {
              c.state.tripped = willBeTripped;
            }
          } else if (clickedComp.state.tripped) {
            for (const c of linkedComps) {
              c.state.tripped = false;
              c.state.closed = false;
            }
          } else {
            const willBeClosed = !clickedComp.state.closed;
            for (const c of linkedComps) {
              c.state.tripped = false;
              const isNC = c.type.endsWith('_nc') && c.type !== 'contact_no_nc';
              const clickedIsNC = clickedComp.type.endsWith('_nc') && clickedComp.type !== 'contact_no_nc';
              if (isNC === clickedIsNC) {
                c.state.closed = willBeClosed;
              } else {
                c.state.closed = !willBeClosed;
              }
              if (c.state.pressed !== undefined) {
                c.state.pressed = willBeClosed;
              }
            }
          }
          this.stepSimulation();
        }
      }
      return;
    }

    // Edit Mode Actions
    if (this.activeTool === 'place_component' && this.pendingComponentType) {
      this.placeComponent(this.pendingComponentType, snapped);
      this.render();
      return;
    }

    if (this.activeTool === 'junction') {
      this.toggleJunctionNode(world);
      const activeNodes = this.getActiveJunctionNodes();
      this.hoveredJunctionNode =
        activeNodes.find(
          (n) => Grid.pointsEqual(n, snapped, 8) || Math.hypot(world.x - n.x, world.y - n.y) < 8
        ) || null;
      this.updateCursor(world);
      return;
    }

    if (this.activeTool.startsWith('wire_')) {
      const snapPt = this.hoveredSnapTarget ? this.hoveredSnapTarget.point : snapped;

      if (this.wireStartPoint && !this.isPointerDownForWire) {
        // Second click of click-click mode: commit wire segment
        const end = this.getOrthogonalEnd(this.wireStartPoint, snapPt);
        if (Grid.distance(this.wireStartPoint, end) >= Grid.STEP) {
          this.commitWire(this.wireStartPoint, end, this.activeTool);
          this.wireStartPoint = null;
          this.isDrawingWire = false;
          this.render();
          return;
        }
      }

      // Start new wire (either drag or click)
      this.wireStartPoint = snapPt;
      this.isPointerDownForWire = true;
      this.isDrawingWire = true;
      this.render();
      return;
    }

    if (this.activeTool === 'delete') {
      const comp = this.findComponentAt(world);
      if (comp) {
        this.saveSnapshot();
        this.components = this.components.filter((c) => c !== comp && !this.selectedComponents.has(c));
        this.selectedComponents.delete(comp);
        this.render();
        return;
      }
      const wire = this.findWireAt(world);
      if (wire) {
        this.saveSnapshot();
        this.wires = this.wires.filter((w) => w !== wire && !this.selectedWires.has(w));
        this.selectedWires.delete(wire);
        this.render();
        return;
      }
    }

    if (this.activeTool === 'select') {
      const comp = this.findComponentAt(world);
      const wire = !comp ? this.findWireAt(world) : null;
      const isMultiModifier = e.shiftKey || e.ctrlKey || e.metaKey;

      if (comp) {
        if (isMultiModifier) {
          if (this.selectedComponents.has(comp)) {
            this.selectedComponents.delete(comp);
          } else {
            this.selectedComponents.add(comp);
          }
        } else {
          // If clicking an unselected component without shift, make it the sole selection
          if (!this.selectedComponents.has(comp)) {
            this.clearSelection();
            this.selectedComponents.add(comp);
          }
        }

        // Start dragging group if comp is in selectedComponents
        if (this.selectedComponents.has(comp)) {
          this.isDraggingGroup = true;
          this.dragStartWorld = { ...snapped };
          this.recordInitialPositions();
          this.preDragSnapshot = this.createSnapshot();
        }
        this.render();
        return;
      }

      if (wire) {
        if (isMultiModifier) {
          if (this.selectedWires.has(wire)) {
            this.selectedWires.delete(wire);
          } else {
            this.selectedWires.add(wire);
          }
        } else {
          if (!this.selectedWires.has(wire)) {
            this.clearSelection();
            this.selectedWires.add(wire);
          }
        }

        if (this.selectedWires.has(wire)) {
          this.isDraggingGroup = true;
          this.dragStartWorld = { ...snapped };
          this.recordInitialPositions();
          this.preDragSnapshot = this.createSnapshot();
        }
        this.render();
        return;
      }

      // Clicked on empty space: start Box / Marquee Selection
      this.isBoxSelecting = true;
      this.boxSelectStart = { ...world };
      this.boxSelectCurrent = { ...world };

      if (isMultiModifier) {
        this.baseSelectedComponents = new Set(this.selectedComponents);
        this.baseSelectedWires = new Set(this.selectedWires);
      } else {
        this.clearSelection();
        this.baseSelectedComponents = new Set();
        this.baseSelectedWires = new Set();
      }
      this.render();
    }
  }

  private handlePointerMove(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (this.isPanning) {
      this.grid.panX = sx - this.panStart.x;
      this.grid.panY = sy - this.panStart.y;
      this.render();
      return;
    }

    const world = this.grid.screenToWorld(sx, sy);
    const snapped = Grid.snapPoint(world);
    this.currentMouseWorld = world;

    // Detectar snap para cables (bornas, vértices de cables o nodos)
    if (this.activeTool.startsWith('wire_') && !this.isSimulation) {
      this.hoveredSnapTarget = this.findSnapTarget(world, 14);
    } else {
      this.hoveredSnapTarget = null;
    }

    // Detectar nodo existente para herramienta junction
    if (this.activeTool === 'junction' && !this.isSimulation) {
      const activeNodes = this.getActiveJunctionNodes();
      this.hoveredJunctionNode =
        activeNodes.find(
          (n) => Grid.pointsEqual(n, snapped, 8) || Math.hypot(world.x - n.x, world.y - n.y) < 8
        ) || null;
    } else {
      this.hoveredJunctionNode = null;
    }

    this.updateCursor(world);
    this.notifyStatus();

    if (this.isDraggingGroup && !this.isSimulation) {
      const dx = snapped.x - this.dragStartWorld.x;
      const dy = snapped.y - this.dragStartWorld.y;

      for (const [comp, initPos] of this.initialCompPositions.entries()) {
        comp.x = initPos.x + dx;
        comp.y = initPos.y + dy;
      }
      for (const [wire, initPts] of this.initialWirePositions.entries()) {
        wire.points = initPts.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      }
      this.render();
      return;
    }

    if (this.isBoxSelecting && !this.isSimulation) {
      this.boxSelectCurrent = { ...world };
      this.updateBoxSelection(e.shiftKey || e.ctrlKey || e.metaKey);
      this.render();
      return;
    }

    // Redibujar en tiempo real si hay herramienta interactiva activa (vista previa/fantasma)
    if (
      this.isDrawingWire ||
      this.activeTool.startsWith('wire_') ||
      this.activeTool === 'junction' ||
      this.activeTool === 'place_component' ||
      this.activeTool === 'delete'
    ) {
      this.render();
    }
  }

  private handlePointerUp(e: PointerEvent) {
    if (this.isPanning) {
      this.isPanning = false;
    }

    if (this.isDraggingGroup) {
      this.isDraggingGroup = false;
      let moved = false;
      for (const [comp, initPos] of this.initialCompPositions.entries()) {
        if (comp.x !== initPos.x || comp.y !== initPos.y) {
          moved = true;
          break;
        }
      }
      if (!moved) {
        for (const [wire, initPts] of this.initialWirePositions.entries()) {
          if (wire.points.some((p, idx) => p.x !== initPts[idx]?.x || p.y !== initPts[idx]?.y)) {
            moved = true;
            break;
          }
        }
      }

      if (moved && this.preDragSnapshot) {
        this.pushPreSnapshot(this.preDragSnapshot);
      }
      this.preDragSnapshot = null;
      this.initialCompPositions.clear();
      this.initialWirePositions.clear();
    }

    if (this.isBoxSelecting) {
      const rw = Math.abs(this.boxSelectCurrent.x - this.boxSelectStart.x);
      const rh = Math.abs(this.boxSelectCurrent.y - this.boxSelectStart.y);
      this.isBoxSelecting = false;
      if (rw < 4 && rh < 4 && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        this.clearSelection();
      }
      this.render();
    }

    if (this.isDrawingWire && this.wireStartPoint && this.isPointerDownForWire) {
      const rect = this.canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const world = this.grid.screenToWorld(sx, sy);
      const snapPt = this.hoveredSnapTarget ? this.hoveredSnapTarget.point : world;
      const end = this.getOrthogonalEnd(this.wireStartPoint, snapPt);

      if (Grid.distance(this.wireStartPoint, end) >= Grid.STEP) {
        this.commitWire(this.wireStartPoint, end, this.activeTool);
        this.wireStartPoint = null;
        this.isDrawingWire = false;
        this.isPointerDownForWire = false;
        this.render();
      } else {
        // Did not drag: remain in wire placement mode for click-to-click placement
        this.isPointerDownForWire = false;
      }
    }

    if (this.isSimulation) {
      if (this.activeMomentaryComp) {
        const rect = this.canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const world = this.grid.screenToWorld(sx, sy);
        const compAtRelease = this.findComponentAt(world);

        const targetTag = this.activeMomentaryComp.tag;
        const isNamedDevice = Boolean(targetTag && targetTag !== 'Texto' && targetTag !== 'SVG');
        const linkedComps = isNamedDevice
          ? this.components.filter((c) => c.tag === targetTag)
          : [this.activeMomentaryComp];

        // Se considera soltado dentro si el mouse está sobre el pulsador activo o sobre cualquiera del mismo grupo vinculado
        const releasedInside = compAtRelease && (compAtRelease === this.activeMomentaryComp || (isNamedDevice && compAtRelease.tag === targetTag));

        if (releasedInside) {
          // Soltó DENTRO del pulsador: vuelve a reposo para todo el grupo
          for (const c of linkedComps) {
            c.state.pressed = false;
          }
          this.stepSimulation();
        } else {
          // Soltó FUERA del pulsador: ¡COMPORTAMIENTO CADe_SIMU!
          // Al arrastrar el cursor y soltar fuera, todo el grupo queda presionado/enclavado
          for (const c of linkedComps) {
            c.state.pressed = true;
          }
          this.stepSimulation();
        }
        this.activeMomentaryComp = null;
      }
    }
  }

  private getOrthogonalEnd(start: Point, current: Point): Point {
    const target = this.hoveredSnapTarget ? this.hoveredSnapTarget.point : Grid.snapPoint(current);
    const dx = Math.abs(target.x - start.x);
    const dy = Math.abs(target.y - start.y);
    if (dx >= dy) {
      return { x: target.x, y: start.y };
    } else {
      return { x: start.x, y: target.y };
    }
  }

  private commitWire(start: Point, end: Point, tool: ToolType) {
    if (Grid.distance(start, end) < Grid.STEP) return;

    this.saveSnapshot();

    if (tool === 'wire_3phase') {
      const isHorizontal = Math.abs(end.x - start.x) >= Math.abs(end.y - start.y);
      const offsets = [0, 40, 80];
      const wireTypes: WireType[] = ['phase_l1', 'phase_l2', 'phase_l3'];

      for (let p = 0; p < 3; p++) {
        const p1 = isHorizontal
          ? { x: start.x, y: start.y + offsets[p] }
          : { x: start.x + offsets[p], y: start.y };
        const p2 = isHorizontal
          ? { x: end.x, y: end.y + offsets[p] }
          : { x: end.x + offsets[p], y: end.y };

        this.wires.push({
          id: `w_${Date.now()}_${p}_${Math.random().toString(36).substr(2, 4)}`,
          type: wireTypes[p],
          points: [p1, p2],
          potential: 'NONE',
        });
      }
    } else {
      const wireType = tool.replace('wire_', '') as WireType;
      this.wires.push({
        id: `w_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: wireType,
        points: [{ ...start }, { ...end }],
        potential: 'NONE',
      });
    }
  }

  private handleDoubleClick(e: MouseEvent) {
    if (this.isSimulation) return;
    const rect = this.canvas.getBoundingClientRect();
    const world = this.grid.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const comp = this.findComponentAt(world);
    if (comp && this.onTagEditRequest) {
      this.onTagEditRequest(comp);
    }
  }

  public placeComponent(type: string, pos: Point) {
    const def = COMPONENT_DEFINITIONS[type];
    if (!def) return;

    this.saveSnapshot();

    // Count existing components of same type for auto-numbering
    const sameTypeCount = this.components.filter((c) => c.type === type).length + 1;
    let tag = def.defaultTag;
    if (tag.startsWith('-') || tag === 'L') {
      tag = `${tag}${sameTypeCount}`;
    }

    const newComp: CircuitComponent = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: def.type,
      tag,
      x: pos.x,
      y: pos.y,
      rotation: 0,
      terminals: def.terminals.map((t) => ({ ...t, potential: 'NONE' })),
      state: {
        pressed: false,
        closed: def.type.endsWith('_nc') && def.type !== 'contact_no_nc',
        energized: false,
        poles: def.poles || 1,
        protectionType: def.type.startsWith('motor_breaker_') ? 'mag' : undefined,
        color: def.type === 'pilot_light' ? 'green' : undefined,
      },
    };

    this.components.push(newComp);
    this.clearSelection();
    this.selectedComponents.add(newComp);
  }

  public clearSelection() {
    this.selectedComponents.clear();
    this.selectedWires.clear();
  }

  private recordInitialPositions() {
    this.initialCompPositions.clear();
    for (const comp of this.selectedComponents) {
      this.initialCompPositions.set(comp, { x: comp.x, y: comp.y });
    }
    this.initialWirePositions.clear();
    for (const wire of this.selectedWires) {
      this.initialWirePositions.set(wire, wire.points.map((p) => ({ ...p })));
    }
  }

  private updateBoxSelection(isMultiModifier: boolean) {
    const rx = Math.min(this.boxSelectStart.x, this.boxSelectCurrent.x);
    const ry = Math.min(this.boxSelectStart.y, this.boxSelectCurrent.y);
    const rw = Math.abs(this.boxSelectCurrent.x - this.boxSelectStart.x);
    const rh = Math.abs(this.boxSelectCurrent.y - this.boxSelectStart.y);

    const isCrossing = this.boxSelectCurrent.x < this.boxSelectStart.x;
    const boxRect: Rect = { x: rx, y: ry, width: rw, height: rh };

    if (rw < 3 && rh < 3) {
      if (!isMultiModifier) {
        this.clearSelection();
      }
      return;
    }

    const matchedComps = new Set<CircuitComponent>();
    const matchedWires = new Set<Wire>();

    for (const comp of this.components) {
      const bounds = getComponentBounds(comp);
      if (isCrossing) {
        if (Grid.rectIntersectsRect(bounds, boxRect)) {
          matchedComps.add(comp);
        }
      } else {
        if (Grid.rectContainsRect(boxRect, bounds)) {
          matchedComps.add(comp);
        }
      }
    }

    for (const wire of this.wires) {
      if (wire.points.length === 0) continue;
      if (isCrossing) {
        let touched = false;
        for (let i = 0; i < wire.points.length - 1; i++) {
          if (Grid.segmentIntersectsRect(wire.points[i], wire.points[i + 1], boxRect)) {
            touched = true;
            break;
          }
        }
        if (touched) {
          matchedWires.add(wire);
        }
      } else {
        const allInside = wire.points.every((pt) => Grid.rectContainsPoint(boxRect, pt));
        if (allInside) {
          matchedWires.add(wire);
        }
      }
    }

    if (isMultiModifier) {
      this.selectedComponents = new Set([...this.baseSelectedComponents, ...matchedComps]);
      this.selectedWires = new Set([...this.baseSelectedWires, ...matchedWires]);
    } else {
      this.selectedComponents = matchedComps;
      this.selectedWires = matchedWires;
    }
  }

  private findComponentAt(p: Point): CircuitComponent | null {
    for (let i = this.components.length - 1; i >= 0; i--) {
      const c = this.components[i];
      const bounds = getComponentBounds(c);
      if (
        p.x >= bounds.x &&
        p.x <= bounds.x + bounds.width &&
        p.y >= bounds.y &&
        p.y <= bounds.y + bounds.height
      ) {
        return c;
      }
    }
    return null;
  }

  private findWireAt(p: Point): Wire | null {
    for (const w of this.wires) {
      for (let i = 0; i < w.points.length - 1; i++) {
        if (Grid.pointToSegmentDistance(p, w.points[i], w.points[i + 1]) < 6) {
          return w;
        }
      }
    }
    return null;
  }

  public render() {
    const { ctx } = this;
    const rect = this.canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // 1. Draw Grid
    this.renderGrid(rect.width, rect.height);

    // 2. Setup World Matrix
    ctx.save();
    ctx.translate(this.grid.panX, this.grid.panY);
    ctx.scale(this.grid.zoom, this.grid.zoom);

    // 3. Draw Wires
    this.renderWires();

    // 4. Draw Components
    for (const comp of this.components) {
      SymbolRenderer.renderComponent(
        ctx,
        comp,
        this.isSimulation,
        this.selectedComponents.has(comp) && !this.isSimulation
      );
    }

    // 5. Draw Active Wire Preview (During Drawing)
    if (this.isDrawingWire && this.wireStartPoint) {
      const snapPt = this.hoveredSnapTarget ? this.hoveredSnapTarget.point : this.currentMouseWorld;
      const end = this.getOrthogonalEnd(this.wireStartPoint, snapPt);
      ctx.save();

      if (this.activeTool === 'wire_3phase') {
        const isHorizontal = Math.abs(end.x - this.wireStartPoint.x) >= Math.abs(end.y - this.wireStartPoint.y);
        const offsets = [0, 40, 80];
        const colors = ['#854d0e', '#0f172a', '#dc2626'];

        for (let p = 0; p < 3; p++) {
          const p1 = isHorizontal
            ? { x: this.wireStartPoint.x, y: this.wireStartPoint.y + offsets[p] }
            : { x: this.wireStartPoint.x + offsets[p], y: this.wireStartPoint.y };
          const p2 = isHorizontal
            ? { x: end.x, y: end.y + offsets[p] }
            : { x: end.x + offsets[p], y: end.y };

          ctx.strokeStyle = colors[p];
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          ctx.fillStyle = colors[p];
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, 3.5, 0, Math.PI * 2);
          ctx.arc(p2.x, p2.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        let wireColor = '#854d0e';
        if (this.activeTool === 'wire_phase' || this.activeTool === 'wire_phase_l1') wireColor = '#854d0e';
        else if (this.activeTool === 'wire_phase_l2') wireColor = '#0f172a';
        else if (this.activeTool === 'wire_phase_l3') wireColor = '#dc2626';
        else if (this.activeTool === 'wire_neutral') wireColor = '#0284c7';
        else if (this.activeTool === 'wire_pe') wireColor = '#16a34a';
        else if (this.activeTool === 'wire_dc_pos') wireColor = '#dc2626';
        else if (this.activeTool === 'wire_dc_neg') wireColor = '#1e3a8a';

        ctx.strokeStyle = wireColor;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(this.wireStartPoint.x, this.wireStartPoint.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Start and end indicator points
        ctx.fillStyle = wireColor;
        ctx.beginPath();
        ctx.arc(this.wireStartPoint.x, this.wireStartPoint.y, 3.5, 0, Math.PI * 2);
        ctx.arc(end.x, end.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Highlight terminal snap target if endpoint lands on a terminal
        if (this.hoveredSnapTarget?.terminal) {
          const t = this.hoveredSnapTarget.terminal;
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(end.x, end.y, 8, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          const text = `${t.componentTag} : ${t.name}`;
          ctx.font = 'bold 11px sans-serif';
          const tw = ctx.measureText(text).width;
          ctx.fillRect(end.x + 10, end.y - 20, tw + 10, 18);
          ctx.strokeStyle = '#10b981';
          ctx.strokeRect(end.x + 10, end.y - 20, tw + 10, 18);
          ctx.fillStyle = '#34d399';
          ctx.fillText(text, end.x + 15, end.y - 7);
        }
      }
      ctx.restore();
    }

    // 5b. Draw Active Wire Anchor Preview (Before First Click)
    if (!this.isDrawingWire && this.activeTool.startsWith('wire_') && !this.isSimulation) {
      ctx.save();
      const anchor = this.hoveredSnapTarget ? this.hoveredSnapTarget.point : Grid.snapPoint(this.currentMouseWorld);

      if (this.hoveredSnapTarget?.terminal) {
        const t = this.hoveredSnapTarget.terminal;
        // Aro brillante verde para borna
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Cruz de puntería interna
        ctx.beginPath();
        ctx.moveTo(anchor.x - 4, anchor.y);
        ctx.lineTo(anchor.x + 4, anchor.y);
        ctx.moveTo(anchor.x, anchor.y - 4);
        ctx.lineTo(anchor.x, anchor.y + 4);
        ctx.stroke();

        // Tooltip flotante con tag y nombre de borna
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        const text = `${t.componentTag} : ${t.name}`;
        ctx.font = 'bold 11px sans-serif';
        const tw = ctx.measureText(text).width;
        ctx.fillRect(anchor.x + 10, anchor.y - 20, tw + 10, 18);
        ctx.strokeStyle = '#10b981';
        ctx.strokeRect(anchor.x + 10, anchor.y - 20, tw + 10, 18);
        ctx.fillStyle = '#34d399';
        ctx.fillText(text, anchor.x + 15, anchor.y - 7);
      } else if (this.hoveredSnapTarget?.isWire) {
        // Aro cyan para conexión a cable existente
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, 6.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        const text = 'Conexión a Cable';
        ctx.font = 'bold 11px sans-serif';
        const tw = ctx.measureText(text).width;
        ctx.fillRect(anchor.x + 10, anchor.y - 20, tw + 10, 18);
        ctx.strokeStyle = '#06b6d4';
        ctx.strokeRect(anchor.x + 10, anchor.y - 20, tw + 10, 18);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(text, anchor.x + 15, anchor.y - 7);
      } else {
        // Marcador sutil sobre rejilla libre
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, 5.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 6. Draw Component Placement Ghost
    if (this.activeTool === 'place_component' && this.pendingComponentType && !this.isSimulation) {
      const snapped = Grid.snapPoint(this.currentMouseWorld);
      ctx.save();
      ctx.globalAlpha = 0.5;
      const ghostDef = COMPONENT_DEFINITIONS[this.pendingComponentType];
      if (ghostDef) {
        SymbolRenderer.renderComponent(
          ctx,
          {
            id: 'ghost',
            type: ghostDef.type,
            tag: ghostDef.defaultTag,
            x: snapped.x,
            y: snapped.y,
            rotation: 0,
            terminals: ghostDef.terminals.map((t) => ({ ...t, potential: 'NONE' })),
            state: { closed: ghostDef.type.endsWith('_nc') && ghostDef.type !== 'contact_no_nc', poles: ghostDef.poles || 1 },
          },
          false,
          false
        );
      }
      ctx.restore();
    }

    // 6b. Draw Junction Node Tool Hover Indicator
    if (this.activeTool === 'junction' && !this.isSimulation) {
      const snapped = Grid.snapPoint(this.currentMouseWorld);
      ctx.save();

      if (this.hoveredJunctionNode) {
        const j = this.hoveredJunctionNode;
        // Halo rojo translúcido y círculo con signo menos indicando borrar
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.beginPath();
        ctx.arc(j.x, j.y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(j.x, j.y, 7, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(j.x - 3.5, j.y);
        ctx.lineTo(j.x + 3.5, j.y);
        ctx.stroke();

        // Tooltip flotante: "Borrar nodo"
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.font = 'bold 11px sans-serif';
        const text = '🗑️ Borrar nodo';
        const tw = ctx.measureText(text).width;
        ctx.fillRect(j.x + 10, j.y - 20, tw + 10, 18);
        ctx.strokeStyle = '#ef4444';
        ctx.strokeRect(j.x + 10, j.y - 20, tw + 10, 18);
        ctx.fillStyle = '#f87171';
        ctx.fillText(text, j.x + 15, j.y - 7);
      } else {
        // Halo cyan y círculo con punto central indicando crear
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.beginPath();
        ctx.arc(snapped.x, snapped.y, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(snapped.x, snapped.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(snapped.x, snapped.y, 7, 0, Math.PI * 2);
        ctx.stroke();

        // Tooltip flotante: "Crear nodo"
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.font = 'bold 11px sans-serif';
        const text = '➕ Crear nodo';
        const tw = ctx.measureText(text).width;
        ctx.fillRect(snapped.x + 10, snapped.y - 20, tw + 10, 18);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(snapped.x + 10, snapped.y - 20, tw + 10, 18);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(text, snapped.x + 15, snapped.y - 7);
      }
      ctx.restore();
    }

    // 7. Draw Short Circuit Location Spark
    if (this.isSimulation && this.simulationResult.shortCircuit && this.simulationResult.shortCircuitLocation) {
      const loc = this.simulationResult.shortCircuitLocation;
      ctx.save();

      // Outer alert aura
      ctx.beginPath();
      ctx.arc(loc.x, loc.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 8-pointed starburst / explosion spark
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      const spikes = 8;
      const outerR = 16;
      const innerR = 7;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const sx = loc.x + Math.cos(angle) * r;
        const sy = loc.y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Central core
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(loc.x, loc.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Label above
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#b91c1c';
      ctx.textAlign = 'center';
      ctx.fillText('💥 CORTOCIRCUITO', loc.x, loc.y - 20);

      ctx.restore();
    }

    // 8. Draw CAD Box / Marquee Selection
    if (this.isBoxSelecting && !this.isSimulation) {
      const rx = Math.min(this.boxSelectStart.x, this.boxSelectCurrent.x);
      const ry = Math.min(this.boxSelectStart.y, this.boxSelectCurrent.y);
      const rw = Math.abs(this.boxSelectCurrent.x - this.boxSelectStart.x);
      const rh = Math.abs(this.boxSelectCurrent.y - this.boxSelectStart.y);
      const isCrossing = this.boxSelectCurrent.x < this.boxSelectStart.x;

      ctx.save();
      if (isCrossing) {
        // Crossing Selection (Right to Left): Green translucent, dashed border
        ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 1.2 / this.grid.zoom;
        ctx.setLineDash([5 / this.grid.zoom, 4 / this.grid.zoom]);
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);
      } else {
        // Window Selection (Left to Right): Blue translucent, solid border
        ctx.fillStyle = 'rgba(59, 130, 246, 0.18)';
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 1.2 / this.grid.zoom;
        ctx.setLineDash([]);
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);
      }
      ctx.restore();
    }

    ctx.restore();
  }

  private renderGrid(w: number, h: number) {
    const { ctx } = this;
    const step = Grid.STEP * this.grid.zoom;
    const startX = this.grid.panX % step;
    const startY = this.grid.panY % step;

    ctx.fillStyle = '#cbd5e1';
    for (let x = startX; x < w; x += step) {
      for (let y = startY; y < h; y += step) {
        ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
      }
    }
  }

  private renderWires() {
    const { ctx } = this;

    for (const w of this.wires) {
      ctx.save();
      let strokeColor = '#854d0e'; // Marrón L1 (norma IEC)
      let lineWidth = 2;

      // Base color by wire type
      if (w.type === 'phase' || w.type === 'phase_l1') strokeColor = '#854d0e'; // Marrón
      else if (w.type === 'phase_l2') strokeColor = '#0f172a'; // Negro L2
      else if (w.type === 'phase_l3') strokeColor = '#dc2626'; // Rojo L3
      else if (w.type === 'neutral') strokeColor = '#0284c7'; // Azul Celeste N
      else if (w.type === 'pe') strokeColor = '#16a34a'; // Verde PE
      else if (w.type === 'dc_pos') strokeColor = '#dc2626'; // Rojo CC (+)
      else if (w.type === 'dc_neg') strokeColor = '#1e3a8a'; // Azul Marino CC (-)

      // Simulation Potential Glowing Colors
      if (this.isSimulation) {
        if (this.simulationResult.shortCircuit) {
          strokeColor = '#ef4444';
          lineWidth = 3;
        } else if (w.potential === 'L1') {
          strokeColor = '#b91c1c'; // Energized Phase L1
          lineWidth = 2.5;
        } else if (w.potential === 'L2') {
          strokeColor = '#475569'; // Energized Phase L2
          lineWidth = 2.5;
        } else if (w.potential === 'L3') {
          strokeColor = '#f87171'; // Energized Phase L3
          lineWidth = 2.5;
        } else if (w.potential === 'N') {
          strokeColor = '#06b6d4'; // Energized Neutral
          lineWidth = 2.5;
        } else if (w.potential === 'DC_POS') {
          strokeColor = '#ea580c';
          lineWidth = 2.5;
        } else if (w.potential === 'DC_NEG') {
          strokeColor = '#3b82f6';
          lineWidth = 2.5;
        }
      }

      const isSelected = this.selectedWires.has(w) && !this.isSimulation;
      if (isSelected) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3.5;
      } else {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
      }

      // Draw path
      ctx.beginPath();
      for (let i = 0; i < w.points.length; i++) {
        const pt = w.points[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      if (isSelected) {
        ctx.fillStyle = '#2563eb';
        for (const pt of w.points) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // Render true junction dots (T-junctions and derivations only, no crossovers)
    this.renderJunctionDots();
  }

  public getActiveJunctionNodes(): Point[] {
    const junctions: Point[] = [];
    const hasJunction = (p: Point) => junctions.some((j) => Grid.pointsEqual(j, p, 4));

    // 1. Check each wire endpoint to see if it lands on another wire or meets 3+ wires (auto-junctions)
    for (let i = 0; i < this.wires.length; i++) {
      const w1 = this.wires[i];
      if (w1.points.length === 0) continue;
      const endpoints = [w1.points[0], w1.points[w1.points.length - 1]];

      for (const ep of endpoints) {
        // Skip if explicitly suppressed by the user
        if (this.suppressedNodes.some((sn) => Grid.pointsEqual(sn, ep, 4))) continue;

        let connections = 0;
        let isInteriorTouch = false;

        for (let j = 0; j < this.wires.length; j++) {
          const w2 = this.wires[j];
          for (let s = 0; s < w2.points.length - 1; s++) {
            const p1 = w2.points[s];
            const p2 = w2.points[s + 1];
            if (Grid.pointToSegmentDistance(ep, p1, p2) < 3) {
              connections++;
              const isAtEndpoint = Grid.pointsEqual(ep, p1, 3) || Grid.pointsEqual(ep, p2, 3);
              if (!isAtEndpoint) {
                isInteriorTouch = true;
              }
            }
          }
        }

        if (isInteriorTouch || connections >= 3) {
          if (!hasJunction(ep)) {
            junctions.push({ ...ep });
          }
        }
      }
    }

    // 2. Add manual nodes placed by the user
    for (const mn of this.manualNodes) {
      if (!hasJunction(mn)) {
        junctions.push({ ...mn });
      }
    }

    return junctions;
  }

  public toggleJunctionNode(worldPos: Point) {
    this.saveSnapshot();
    const snapped = Grid.snapPoint(worldPos);
    const activeNodes = this.getActiveJunctionNodes();
    const existingIndex = activeNodes.findIndex((n) => Grid.pointsEqual(n, snapped, 6));

    if (existingIndex >= 0) {
      // Junction exists -> DELETE IT (User clicks on node to remove it)
      const existing = activeNodes[existingIndex];
      const manualIdx = this.manualNodes.findIndex((mn) => Grid.pointsEqual(mn, existing, 6));
      if (manualIdx >= 0) {
        this.manualNodes.splice(manualIdx, 1);
      } else {
        // It's an auto-detected junction, suppress it
        if (!this.suppressedNodes.some((sn) => Grid.pointsEqual(sn, snapped, 4))) {
          this.suppressedNodes.push({ ...snapped });
        }
      }
    } else {
      // Junction does NOT exist -> CREATE IT (User clicks where there's no node)
      const suppIdx = this.suppressedNodes.findIndex((sn) => Grid.pointsEqual(sn, snapped, 6));
      if (suppIdx >= 0) {
        // If it was suppressed, un-suppress it
        this.suppressedNodes.splice(suppIdx, 1);
      } else {
        // Add manual node
        this.manualNodes.push({ ...snapped });
      }
    }

    if (this.isSimulation) {
      this.stepSimulation();
    }
    this.render();
  }

  private renderJunctionDots() {
    const { ctx } = this;
    const junctions = this.getActiveJunctionNodes();

    ctx.save();
    for (const j of junctions) {
      let dotColor = '#854d0e';
      for (const w of this.wires) {
        if (
          w.points.some((p) => Grid.pointsEqual(p, j, 4)) ||
          w.points.slice(0, -1).some((p1, idx) => Grid.pointToSegmentDistance(j, p1, w.points[idx + 1]) < 3.5)
        ) {
          if (this.isSimulation) {
            if (w.potential === 'L1') dotColor = '#b91c1c';
            else if (w.potential === 'L2') dotColor = '#475569';
            else if (w.potential === 'L3') dotColor = '#f87171';
            else if (w.potential === 'N') dotColor = '#06b6d4';
            else if (w.potential === 'DC_POS') dotColor = '#ea580c';
            else if (w.potential === 'DC_NEG') dotColor = '#3b82f6';
            else if (this.simulationResult.shortCircuit) dotColor = '#ef4444';
          } else {
            if (w.type === 'phase' || w.type === 'phase_l1') dotColor = '#854d0e';
            else if (w.type === 'phase_l2') dotColor = '#0f172a';
            else if (w.type === 'phase_l3') dotColor = '#dc2626';
            else if (w.type === 'neutral') dotColor = '#0284c7';
            else if (w.type === 'pe') dotColor = '#16a34a';
            else if (w.type === 'dc_pos') dotColor = '#dc2626';
            else if (w.type === 'dc_neg') dotColor = '#1e3a8a';
          }
          break;
        }
      }

      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(j.x, j.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
