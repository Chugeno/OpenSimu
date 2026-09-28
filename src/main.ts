import { CanvasView, type ToolType } from './ui/CanvasView';
import { COMPONENT_DEFINITIONS } from './core/ComponentRegistry';
import type { CircuitComponent, ComponentCategory } from './core/types';
import { CadeSimuParser } from './core/CadeSimuParser';
import { COMPONENT_ICONS } from './ui/icons';
import { I18n, t, type SupportedLocale } from './core/i18n';
import { DeviceDetector, type DeviceInfo } from './core/DeviceDetector';

// Initialize i18n and Device Detection
I18n.init();
DeviceDetector.init();

// Initialize Canvas
const canvasEl = document.getElementById('circuit-canvas') as HTMLCanvasElement;
const canvasView = new CanvasView(canvasEl);

// State
let currentCategory: ComponentCategory | 'cables' = 'power';
let activeCompType: string | null = null;
let editingComponent: CircuitComponent | null = null;

// Elements
const btnEdit = document.getElementById('btn-edit') as HTMLButtonElement;
const btnSimulate = document.getElementById('btn-simulate') as HTMLButtonElement;
const btnStop = document.getElementById('btn-stop') as HTMLButtonElement;
const btnSelect = document.getElementById('btn-select') as HTMLButtonElement;
const btnDelete = document.getElementById('btn-delete') as HTMLButtonElement;
const btnUndo = document.getElementById('btn-undo') as HTMLButtonElement | null;
const btnRedo = document.getElementById('btn-redo') as HTMLButtonElement | null;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
const btnShowroom = document.getElementById('btn-showroom') as HTMLButtonElement;
const btnDemo = document.getElementById('btn-demo') as HTMLButtonElement;
const btnSave = document.getElementById('btn-save') as HTMLButtonElement;
const btnExportCad = document.getElementById('btn-export-cad') as HTMLButtonElement;
const btnLoad = document.getElementById('btn-load') as HTMLButtonElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const btnResetZoom = document.getElementById('btn-reset-zoom') as HTMLButtonElement;

const langSelect = document.getElementById('lang-select') as HTMLSelectElement | null;
const deviceBadge = document.getElementById('device-badge');

const paletteContainer = document.getElementById('component-palette') as HTMLDivElement;
const catTabs = document.querySelectorAll<HTMLButtonElement>('.cat-tab');

const statusMode = document.getElementById('status-mode') as HTMLSpanElement;
const statusCoords = document.getElementById('status-coords') as HTMLSpanElement;
const statusZoom = document.getElementById('status-zoom') as HTMLSpanElement;
const statusHint = document.getElementById('status-hint') as HTMLSpanElement;

const tagModal = document.getElementById('tag-modal') as HTMLDivElement;
const tagInput = document.getElementById('tag-input') as HTMLInputElement;
const modalCompTitle = document.getElementById('modal-comp-title') as HTMLHeadingElement;
const modalCompType = document.getElementById('modal-comp-type') as HTMLSpanElement;
const terminalsSection = document.getElementById('terminals-section') as HTMLDivElement;
const terminalsContainer = document.getElementById('terminals-container') as HTMLDivElement;
const modalCancel = document.getElementById('modal-cancel') as HTMLButtonElement;
const modalSave = document.getElementById('modal-save') as HTMLButtonElement;

const shortCircuitModal = document.getElementById('short-circuit-modal') as HTMLDivElement;
const shortCircuitMsg = document.getElementById('short-circuit-msg') as HTMLParagraphElement;
const shortCircuitCoords = document.getElementById('short-circuit-coords') as HTMLDivElement;
const btnShortCircuitDismiss = document.getElementById('btn-short-circuit-dismiss') as HTMLButtonElement;

// Device Badge Updates
function updateDeviceBadge(info: DeviceInfo) {
  if (deviceBadge) {
    if (info.isMobile) {
      deviceBadge.textContent = '📱 Mobile';
    } else if (info.isTablet) {
      deviceBadge.textContent = '📱 Tablet';
    } else {
      deviceBadge.textContent = '💻 Desktop';
    }
  }
}
updateDeviceBadge(DeviceDetector.getInfo());
DeviceDetector.onDeviceChange(updateDeviceBadge);

// Language Selector Handler
if (langSelect) {
  langSelect.value = I18n.getLocale();
  langSelect.onchange = (e) => {
    const newLocale = (e.target as HTMLSelectElement).value as SupportedLocale;
    I18n.setLocale(newLocale);
  };
}

function applyTranslations() {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = t(key);
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key) {
      el.title = t(key);
    }
  });

  renderPalette();
}

I18n.onLocaleChange(() => {
  applyTranslations();
  canvasView.render();
});

btnShortCircuitDismiss.onclick = () => {
  shortCircuitModal.style.display = 'none';
  canvasView.stopSimulation();
  btnEdit.classList.add('active');
  btnSimulate.classList.remove('active');
  canvasView.setTool('select');
  updateToolButtons();
};

canvasView.onShortCircuit = (result) => {
  shortCircuitMsg.textContent = result.shortCircuitMessage || 'Conflicto de potenciales detectado.';
  if (result.shortCircuitLocation) {
    shortCircuitCoords.textContent = `📍 Ubicación del corto: X: ${Math.round(result.shortCircuitLocation.x)}, Y: ${Math.round(result.shortCircuitLocation.y)}`;
    shortCircuitCoords.style.display = 'block';
  } else {
    shortCircuitCoords.style.display = 'none';
  }
  shortCircuitModal.style.display = 'flex';
};

// Status Updates from Canvas
canvasView.onStatusUpdate = (status) => {
  statusCoords.textContent = `X: ${status.x}, Y: ${status.y}`;
  statusZoom.textContent = `Zoom: ${status.zoom}%`;

  if (canvasView.isSimulation) {
    if (canvasView.simulationResult.shortCircuit) {
      statusMode.className = 'badge badge-alert';
      statusMode.textContent = t('status.short_circuit_warn');
      statusHint.textContent = canvasView.simulationResult.shortCircuitMessage || t('status.short_circuit_warn');
    } else {
      statusMode.className = 'badge badge-sim';
      statusMode.textContent = t('status.sim_mode');
      statusHint.textContent = t('status.hint_sim');
    }
  } else {
    statusMode.className = 'badge badge-normal';
    statusMode.textContent = t('status.edit_mode');
    if (canvasView.activeTool.startsWith('wire_')) {
      statusHint.textContent = t('status.hint_wire');
    } else if (canvasView.activeTool === 'place_component') {
      statusHint.textContent = t('status.hint_place');
    } else if (canvasView.activeTool === 'delete') {
      statusHint.textContent = t('status.hint_delete');
    } else {
      statusHint.textContent = t('status.hint_default');
    }
  }
};

// Tool Change Callback (from Esc or Right-Click cancel)
canvasView.onToolChange = (_tool, compType) => {
  activeCompType = compType;
  updateToolButtons();
  renderPalette();
};

// Tag & Terminal Edit Request Callback (Double-click or Enter/F2)
canvasView.onTagEditRequest = (comp) => {
  editingComponent = comp;
  const def = COMPONENT_DEFINITIONS[comp.type];
  if (modalCompTitle) {
    modalCompTitle.textContent = def ? def.name : t('modal.tag.title');
  }
  if (modalCompType) {
    modalCompType.textContent = comp.tag;
  }
  tagInput.value = comp.tag;

  // Generar inputs dinámicos para cada borne de conexión
  if (terminalsContainer && terminalsSection) {
    terminalsContainer.innerHTML = '';
    if (!comp.terminals || comp.terminals.length === 0) {
      terminalsSection.style.display = 'none';
    } else {
      terminalsSection.style.display = 'block';
      comp.terminals.forEach((t, idx) => {
        const item = document.createElement('div');
        item.className = 'terminal-item';

        const label = document.createElement('label');
        label.className = 'terminal-label';
        const isTop = t.relY === 0;
        const posHint = isTop ? 'Entrada' : 'Salida';
        label.textContent = `Borna ${idx + 1} (${posHint})`;
        label.htmlFor = `terminal-input-${idx}`;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `terminal-input-${idx}`;
        input.className = 'terminal-input';
        input.value = t.name;
        input.dataset.index = idx.toString();

        input.onkeydown = (e) => {
          e.stopPropagation();
          if (e.key === 'Enter') modalSave.click();
          if (e.key === 'Escape') modalCancel.click();
        };

        item.appendChild(label);
        item.appendChild(input);
        terminalsContainer.appendChild(item);
      });
    }
  }

  tagModal.style.display = 'flex';
  setTimeout(() => tagInput.focus(), 50);
};

modalCancel.onclick = () => {
  tagModal.style.display = 'none';
  editingComponent = null;
};

modalSave.onclick = () => {
  if (editingComponent) {
    canvasView.saveSnapshot();
    if (tagInput.value.trim()) {
      editingComponent.tag = tagInput.value.trim();
    }
    // Guardar numeración de bornes personalizada
    if (terminalsContainer) {
      const inputs = terminalsContainer.querySelectorAll<HTMLInputElement>('.terminal-input');
      inputs.forEach((inp) => {
        const idx = parseInt(inp.dataset.index || '-1', 10);
        if (idx >= 0 && editingComponent!.terminals[idx]) {
          const val = inp.value.trim();
          if (val) {
            editingComponent!.terminals[idx].name = val;
          }
        }
      });
    }
    canvasView.render();
  }
  tagModal.style.display = 'none';
  editingComponent = null;
};

tagInput.onkeydown = (e) => {
  e.stopPropagation();
  if (e.key === 'Enter') modalSave.click();
  if (e.key === 'Escape') modalCancel.click();
};

// Mode Buttons
btnEdit.onclick = () => {
  canvasView.stopSimulation();
  btnEdit.classList.add('active');
  btnSimulate.classList.remove('active');
  canvasView.setTool('select');
  updateToolButtons();
};

btnSimulate.onclick = () => {
  canvasView.startSimulation();
  btnSimulate.classList.add('active');
  btnEdit.classList.remove('active');
  updateToolButtons();
};

btnStop.onclick = () => {
  btnEdit.click();
};

// Tools
btnSelect.onclick = () => {
  canvasView.setTool('select');
  activeCompType = null;
  updateToolButtons();
  renderPalette();
};

btnDelete.onclick = () => {
  canvasView.setTool('delete');
  activeCompType = null;
  updateToolButtons();
  renderPalette();
};

btnClear.onclick = () => {
  if (confirm('¿Limpiar todo el circuito?')) {
    canvasView.clearCircuit();
  }
};

if (btnUndo) {
  btnUndo.onclick = () => {
    canvasView.undo();
  };
}

if (btnRedo) {
  btnRedo.onclick = () => {
    canvasView.redo();
  };
}

canvasView.onHistoryChange = (canUndo, canRedo) => {
  if (btnUndo) btnUndo.disabled = !canUndo;
  if (btnRedo) btnRedo.disabled = !canRedo;
};

btnResetZoom.onclick = () => {
  canvasView.resetZoom();
};

// Muestrario Comparativo IEC (OpenSimu vs Radica vs QElectroTech)
btnShowroom.onclick = () => {
  loadShowroomDemo();
};

// Demo Circuit: Marcha / Paro con Autoenclavamiento
btnDemo.onclick = () => {
  loadDemoCircuit();
};

// Category Switching
catTabs.forEach((tab) => {
  tab.onclick = () => {
    catTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.cat as any;
    renderPalette();
  };
});

function updateToolButtons() {
  btnSelect.classList.toggle('active', canvasView.activeTool === 'select');
  btnDelete.classList.toggle('active', canvasView.activeTool === 'delete');
}

// Render Palette Items (Botones cuadrados CADe_SIMU con iconos vectoriales SVG)
function renderPalette() {
  paletteContainer.innerHTML = '';

  if (currentCategory === 'cables') {
    const cables = [
      { id: 'junction', key: 'wire.junction' },
      { id: 'wire_3phase', key: 'wire.3phase' },
      { id: 'wire_phase_l1', key: 'wire.l1' },
      { id: 'wire_phase_l2', key: 'wire.l2' },
      { id: 'wire_phase_l3', key: 'wire.l3' },
      { id: 'wire_neutral', key: 'wire.neutral' },
      { id: 'wire_pe', key: 'wire.pe' },
      { id: 'wire_dc_pos', key: 'wire.dc_pos' },
      { id: 'wire_dc_neg', key: 'wire.dc_neg' },
    ];

    cables.forEach((c) => {
      const btn = document.createElement('button');
      const localizedName = t(c.key);
      btn.className = `comp-btn ${canvasView.activeTool === c.id ? 'active' : ''}`;
      btn.title = localizedName;
      btn.innerHTML = COMPONENT_ICONS[c.id] || '〰️';

      btn.onmouseenter = () => {
        if (c.id === 'junction') {
          statusHint.textContent = `${localizedName}: Clic para crear un nodo de unión donde no hay, o clic sobre un nodo para borrarlo.`;
        } else {
          statusHint.textContent = `${localizedName}: Arrastrá en la cuadrícula para trazar el cable recto (CADe_SIMU style).`;
        }
      };

      btn.onclick = () => {
        canvasView.setTool(c.id as ToolType);
        activeCompType = null;
        updateToolButtons();
        renderPalette();
      };
      paletteContainer.appendChild(btn);
    });
    return;
  }

  // Filter definitions for current category
  const defs = Object.values(COMPONENT_DEFINITIONS).filter((d) => d.category === currentCategory);

  defs.forEach((def) => {
    const btn = document.createElement('button');
    const isActive = canvasView.activeTool === 'place_component' && activeCompType === def.type;
    btn.className = `comp-btn ${isActive ? 'active' : ''}`;
    const localizedName = t(`comp.${def.type}`, undefined, def.name);
    btn.title = `${localizedName} (${def.defaultTag})`;

    const svgIcon = COMPONENT_ICONS[def.type] || '⚡';
    btn.innerHTML = svgIcon;

    btn.onmouseenter = () => {
      const termNames = def.terminals.map((t) => t.name).join(', ');
      statusHint.textContent = `${localizedName} [Tag: ${def.defaultTag}] — Bornas: [${termNames}]`;
    };

    btn.onclick = () => {
      activeCompType = def.type;
      canvasView.setTool('place_component', def.type);
      updateToolButtons();
      renderPalette();
    };
    paletteContainer.appendChild(btn);
  });
}

// JSON Save & Load
btnSave.onclick = () => {
  const data = {
    version: '1.0.0',
    name: 'OpenSimu Circuit',
    created: new Date().toISOString(),
    components: canvasView.components,
    wires: canvasView.wires,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `circuito_opensimu_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

btnExportCad.onclick = () => {
  const cadContent = CadeSimuParser.exportToCad(canvasView.components, canvasView.wires);
  const blob = new Blob([cadContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `circuito_cadesimu_${Date.now()}.cad`;
  a.click();
  URL.revokeObjectURL(url);
};

btnLoad.onclick = () => {
  fileInput.click();
};

fileInput.onchange = (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const isCad = file.name.toLowerCase().endsWith('.cad');
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const text = event.target?.result as string;

      if (isCad) {
        // Importar formato .CAD de CADe_SIMU
        const result = CadeSimuParser.parse(text);
        canvasView.clearCircuit();
        canvasView.components = result.components;
        canvasView.wires = result.wires;
        canvasView.render();
        canvasView.resetZoom();
      } else {
        // Importar formato .JSON nativo
        const data = JSON.parse(text);
        if (Array.isArray(data.components) && Array.isArray(data.wires)) {
          canvasView.clearCircuit();
          canvasView.components = data.components;
          canvasView.wires = data.wires;
          canvasView.render();
          canvasView.resetZoom();
        } else {
          alert('Formato de archivo inválido.');
        }
      }
    } catch (err) {
      alert('Error al leer el archivo.');
    }
  };
  reader.readAsText(file);
  fileInput.value = '';
};

// DEMO CIRCUIT: Marcha y Paro con Autoenclavamiento
function loadDemoCircuit() {
  canvasView.clearCircuit();

  // 1. Sources
  // L at (100, 40)
  canvasView.placeComponent('source_l', { x: 100, y: 40 });
  // N at (100, 360)
  canvasView.placeComponent('source_n', { x: 100, y: 360 });

  // 2. Parada NC -S0 at (100, 80)
  canvasView.placeComponent('pushbutton_nc', { x: 100, y: 80 });
  canvasView.components[canvasView.components.length - 1].tag = '-S0';

  // 3. Marcha NA -S1 at (100, 180)
  canvasView.placeComponent('pushbutton_no', { x: 100, y: 180 });
  canvasView.components[canvasView.components.length - 1].tag = '-S1';

  // 4. Contacto Auxiliar NA -KM1 en paralelo con -S1 a (180, 180)
  canvasView.placeComponent('contact_no', { x: 180, y: 180 });
  canvasView.components[canvasView.components.length - 1].tag = '-KM1';

  // 5. Bobina -KM1 a (100, 260)
  canvasView.placeComponent('coil', { x: 100, y: 260 });
  canvasView.components[canvasView.components.length - 1].tag = '-KM1';

  // 6. Piloto de marcha -H1 a (240, 260) en paralelo con bobina
  canvasView.placeComponent('pilot_light', { x: 240, y: 260 });
  const pilot = canvasView.components[canvasView.components.length - 1];
  pilot.tag = '-H1';
  pilot.state.color = '#22c55e'; // Green

  // 7. Wires (Fase L - Segmentos rectos ortogonales de 2 puntos)
  // L (100, 40) -> -S0 terminal 11 (100, 80)
  canvasView.wires.push({
    id: 'w1',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 100, y: 40 }, { x: 100, y: 80 }],
  });

  // -S0 terminal 12 (100, 140) -> -S1 terminal 13 (100, 180)
  canvasView.wires.push({
    id: 'w2',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 100, y: 140 }, { x: 100, y: 180 }],
  });

  // Rama de retención superior: (100, 160) -> (180, 160) -> (180, 180 borna 13)
  canvasView.wires.push({
    id: 'w3_a',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 100, y: 160 }, { x: 180, y: 160 }],
  });
  canvasView.wires.push({
    id: 'w3_b',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 180, y: 160 }, { x: 180, y: 180 }],
  });

  // -S1 terminal 14 (100, 240) -> -KM1 coil A1 (100, 260)
  canvasView.wires.push({
    id: 'w4',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 100, y: 240 }, { x: 100, y: 260 }],
  });

  // Rama de retención inferior: borna 14 (180, 240) -> (100, 240)
  canvasView.wires.push({
    id: 'w5',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 180, y: 240 }, { x: 100, y: 240 }],
  });

  // Paralelo piloto: (100, 240) -> (240, 240) -> (240, 260 borna X1)
  canvasView.wires.push({
    id: 'w6_a',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 100, y: 240 }, { x: 240, y: 240 }],
  });
  canvasView.wires.push({
    id: 'w6_b',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 240, y: 240 }, { x: 240, y: 260 }],
  });

  // 8. Wires (Neutro N)
  // -KM1 bobina A2 (100, 320) -> N fuente (100, 360)
  canvasView.wires.push({
    id: 'w7',
    type: 'neutral',
    potential: 'NONE',
    points: [{ x: 100, y: 320 }, { x: 100, y: 360 }],
  });

  // Piloto X2 (240, 320) -> (240, 340) -> (100, 340)
  canvasView.wires.push({
    id: 'w8_a',
    type: 'neutral',
    potential: 'NONE',
    points: [{ x: 240, y: 320 }, { x: 240, y: 340 }],
  });
  canvasView.wires.push({
    id: 'w8_b',
    type: 'neutral',
    potential: 'NONE',
    points: [{ x: 240, y: 340 }, { x: 100, y: 340 }],
  });

  canvasView.resetZoom();
}

// SHOWROOM DEMO: Muestrario Comparativo IEC (OpenSimu vs Radica vs QElectroTech)
function loadShowroomDemo() {
  canvasView.clearCircuit();

  const addLabel = (
    x: number,
    y: number,
    tag: string,
    caption: string,
    subCaption: string,
    w = 240,
    h = 54,
    accent = '#3b82f6',
    bg = '#f8fafc'
  ) => {
    canvasView.components.push({
      id: `lbl_${Math.random().toString(36).substr(2, 9)}`,
      type: 'text_label',
      tag,
      x,
      y,
      rotation: 0,
      terminals: [],
      state: {
        caption,
        subCaption,
        width: w,
        height: h,
        accentColor: accent,
        color: bg,
      },
    });
  };

  const addSvg = (
    x: number,
    y: number,
    svgUrl: string,
    library: string,
    caption: string,
    w = 84,
    h = 84
  ) => {
    canvasView.components.push({
      id: `svg_${Math.random().toString(36).substr(2, 9)}`,
      type: 'svg_symbol',
      tag: library,
      x,
      y,
      rotation: 0,
      terminals: [],
      state: {
        svgUrl,
        library,
        caption,
        width: w,
        height: h,
      },
    });
  };

  // Main Header Banner
  addLabel(
    40, 20,
    '🏛️ CATÁLOGO Y MUESTRARIO DE SÍMBOLOS IEC 60617',
    'Comparativa directa: OpenSimu (interactivo) | Radica Software (Vecta) | QElectroTech (QET)',
    'Simbolología electrotécnica normalizada con trazabilidad completa de librerías',
    780, 58, '#10b981', '#f0fdf4'
  );

  // Column Headers
  addLabel(40, 100, '📋 COMPONENTE', 'Nombre y función', 'Designación según IEC 81346', 240, 42, '#64748b');
  addLabel(300, 100, '⚡ OPENSIMU', 'Lienzo interactivo', 'Canvas 2D / Grid 20px', 160, 42, '#3b82f6', '#eff6ff');
  addLabel(500, 100, '🌐 RADICA SOFTWARE', 'Vectorial original', 'symbols.radicasoftware.com', 120, 42, '#0284c7', '#f0f9ff');
  addLabel(660, 100, '🛠️ QELECTROTECH', 'Open Source IEC', 'qelectrotech-elements', 120, 42, '#059669', '#f0fdf4');

  // Rows definition (coordenadas Y y X múltiplos exactos de 20px)
  const rows = [
    {
      y: 180,
      tag: '-Q Termomagnética 1P',
      caption: 'Disyuntor magnetotérmico 1P',
      sub: 'Bimetal térmico + bobina magnética',
      opensimu: { type: 'mcb_1p', tag: '-Q1', x: 360, y: 180 },
      radica: { url: '/simbolos_svg/radica/228_iec-isolators-disconnectors-fuses-contactors-overloads/4_circuit-breaker-thermal-magnetic-1p.bfafa52300.svg', caption: '1P Térmico-Magnético' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/200_fuses_protective_gears/12_magneto_thermal_circuit_breakers/disjoncteur_magneto-thermique.svg', caption: 'Disj. magnéto-thermique' }
    },
    {
      y: 300,
      tag: '-Q Termomagnética 3P',
      caption: 'Interruptor magnetotérmico 3P',
      sub: 'Protección general de fuerza trifásica',
      opensimu: { type: 'mcb_3p', tag: '-Q2', x: 340, y: 300 },
      radica: { url: '/simbolos_svg/radica/228_iec-isolators-disconnectors-fuses-contactors-overloads/6_circuit-breaker-thermal-magnetic-3p.3ce27752ef.svg', caption: '3P Térmico-Magnético' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/200_fuses_protective_gears/12_magneto_thermal_circuit_breakers/dis_mag_term_3f-1.svg', caption: 'Disj. 3F mag-term' }
    },
    {
      y: 420,
      tag: '-QM Guardamotor Magnetotérmico',
      caption: 'Disyuntor motor trifásico (bimetal + I>)',
      sub: 'Accionamiento manual T en barra acoplamiento',
      opensimu: { type: 'motor_breaker_3p', tag: '-QM1', x: 340, y: 420 },
      radica: { url: '/simbolos_svg/radica/228_iec-isolators-disconnectors-fuses-contactors-overloads/40_motor-circuit-breaker-3p.e98b89f353.svg', caption: 'Motor Circuit Breaker 3P' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/200_fuses_protective_gears/12_magneto_thermal_circuit_breakers/fa4202_disjoncteur_moteur_3p.svg', caption: 'Disj. moteur 3P (GV2)' }
    },
    {
      y: 540,
      tag: '-QM Guardamotor Magnético',
      caption: 'Disyuntor motor solo magnético',
      sub: 'Disparo instantáneo I>> (sin bimetal térmico)',
      opensimu: { type: 'motor_breaker_mag_3p', tag: '-QM2', x: 340, y: 540 },
      radica: { url: '/simbolos_svg/radica/229_single-line-symbols/38_circuit-breaker-3p-magnetic.8c82083967.svg', caption: 'Circuit Breaker 3P Mag' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/200_fuses_protective_gears/11_circuit_breakers/disjonct-m_3f.svg', caption: 'Disjoncteur mag 3F' }
    },
    {
      y: 660,
      tag: '-ID Interruptor Diferencial 2P',
      caption: 'Diferencial toroidal (sin test)',
      sub: 'Detección toroidal de fuga a tierra',
      opensimu: { type: 'rcd_2p', tag: '-ID1', x: 340, y: 660 },
      radica: { url: '/simbolos_svg/radica/228_iec-isolators-disconnectors-fuses-contactors-overloads/42_residual-current-circuit-breaker-2p.0bdc6ec232.svg', caption: 'RCCB 2P Residual' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/200_fuses_protective_gears/50_residual_current_circuit_breaker/interrupteur_differentiel.svg', caption: 'Interrupteur différentiel' }
    },
    {
      y: 780,
      tag: '-KM Contactor de Potencia 3P',
      caption: 'Polos principales (1-2, 3-4, 5-6)',
      sub: 'Corte y maniobra bajo carga',
      opensimu: { type: 'contactor_3p', tag: '-KM1', x: 340, y: 780 },
      radica: { url: '/simbolos_svg/radica/228_iec-isolators-disconnectors-fuses-contactors-overloads/7_contactor-3p.8eaee38221.svg', caption: 'Contactor 3P Power' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/310_relays_contactors_contacts/02_contacts_cross_referencing/02_power_contacts/com_puiss6.svg', caption: 'Contact puissance 3P' }
    },
    {
      y: 900,
      tag: '-KM Bobina de Mando (A1-A2)',
      caption: 'Bobina electromagnética de contactor',
      sub: 'Formato rectangular 2:1 normalizado IEC',
      opensimu: { type: 'coil', tag: '-KM1', x: 360, y: 900 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/82_coil.8187db8640.svg', caption: 'Relay / Contactor Coil' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/310_relays_contactors_contacts/01_coils/bobine3.svg', caption: 'Bobine contacteur' }
    },
    {
      y: 1020,
      tag: '-KM Contacto Auxiliar NA',
      caption: 'Normalmente Abierto (13-14)',
      sub: 'Apertura izquierda, cierre hacia la derecha',
      opensimu: { type: 'contact_no', tag: '-KM1', x: 360, y: 1020 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/98_normally-open-contact.d80186de61.svg', caption: 'Normally Open (NO)' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/310_relays_contactors_contacts/03_contacts/contact_relais.svg', caption: 'Contact relais NO' }
    },
    {
      y: 1140,
      tag: '-KM Contacto Auxiliar NC',
      caption: 'Normalmente Cerrado (11-12)',
      sub: 'Paso de corriente en reposo',
      opensimu: { type: 'contact_nc', tag: '-KM1', x: 360, y: 1140 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/99_normally-closed-contact.7b1c4aac8b.svg', caption: 'Normally Closed (NC)' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/310_relays_contactors_contacts/03_contacts/contact_relais_nf.svg', caption: 'Contact relais NF' }
    },
    {
      y: 1260,
      tag: '-KM Contacto Auxiliar NA+NC (2E / 2S)',
      caption: 'Doble contacto aux. vinculado mecánicamente',
      sub: '2 entradas (13, 21) y 2 salidas (14, 22) con acoplamiento',
      opensimu: { type: 'contact_no_nc', tag: '-KM1', x: 340, y: 1260 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/98_normally-open-contact.d80186de61.svg', caption: 'IEC NO/NC' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/310_relays_contactors_contacts/03_contacts/comm_par_horl_no_nf.svg', caption: 'Contact lié NO/NF' }
    },
    {
      y: 1380,
      tag: '-KM Contacto Conmutado COM-NC-NA (1E / 2S)',
      caption: 'Inversor / SPDT vinculado eléctricamente',
      sub: '1 entrada COM (11) y 2 salidas: NC (12) y NA (14)',
      opensimu: { type: 'contact_changeover', tag: '-KM1', x: 340, y: 1380 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/107_changeover-contact-break-before-make.feb593265f.svg', caption: 'Changeover Contact' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/310_relays_contactors_contacts/02_contacts_cross_referencing/11_delayed_contacts/inverseur_tempo_travail.svg', caption: 'Contact inverseur' }
    },
    {
      y: 1500,
      tag: '-S Pulsador NA (Marcha)',
      caption: 'Pulsador normalmente abierto',
      sub: 'Accionamiento manual con retorno resorte',
      opensimu: { type: 'pushbutton_no', tag: '-S1', x: 360, y: 1500 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/129_push-button-no-spring-return.d09ff5a60e.svg', caption: 'Push Button NO' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/380_signaling_operating/20_push_buttons/poussoir.svg', caption: 'Poussoir NO' }
    },
    {
      y: 1620,
      tag: '-S Pulsador NC (Parada)',
      caption: 'Pulsador normalmente cerrado',
      sub: 'Apertura de circuito con retorno resorte',
      opensimu: { type: 'pushbutton_nc', tag: '-S0', x: 360, y: 1620 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/130_push-button-nc-spring-return.5fcd8782b6.svg', caption: 'Push Button NC' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/380_signaling_operating/20_push_buttons/poussoir_nf.svg', caption: 'Poussoir NF' }
    },
    {
      y: 1740,
      tag: '-S Seta de Emergencia (NC)',
      caption: 'Parada de emergencia enclavable',
      sub: 'Desbloqueo por rotación o tracción',
      opensimu: { type: 'pushbutton_emergency_nc', tag: '-SE', x: 360, y: 1740 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/144_emergency-stop-nc-spring-return.0415de9677.svg', caption: 'Emergency Stop NC' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/380_signaling_operating/20_push_buttons/arret_urgence_tourner_deverouiller.svg', caption: 'Arrêt urgence tourner' }
    },
    {
      y: 1860,
      tag: '-SA Interruptor / Selector NA',
      caption: 'Interruptor manual con enclavamiento',
      sub: 'Mando rotativo / conmutador 2 posiciones',
      opensimu: { type: 'switch_no', tag: '-SA1', x: 360, y: 1860 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/153_selector-switch-no-maintained.01c982dffb.svg', caption: 'Selector Switch NO' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/380_signaling_operating/21_selector_switches/commutateur_2_positions_a_cle.svg', caption: 'Commutateur 2 pos' }
    },
    {
      y: 1980,
      tag: '-H Lámpara Piloto (X1-X2)',
      caption: 'Señalización óptica luminosa',
      sub: 'Círculo con aspa cruzada interior',
      opensimu: { type: 'pilot_light', tag: '-H1', x: 360, y: 1980 },
      radica: { url: '/simbolos_svg/radica/225_iec-symbols/71_pilot-light.3ce54e3e95.svg', caption: 'Pilot Light' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/380_signaling_operating/11_optical_signaling/lampara-verde.svg', caption: 'Voyant lumineux' }
    },
    {
      y: 2100,
      tag: '-F Relé Térmico 3P',
      caption: 'Relé de sobrecarga bimetálico',
      sub: 'Protección de motor contra sobreintensidad prolongada',
      opensimu: null,
      radica: { url: '/simbolos_svg/radica/228_iec-isolators-disconnectors-fuses-contactors-overloads/52_thermal-current-overload-3p.22234aaff6.svg', caption: 'Thermal Overload 3P' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/200_fuses_protective_gears/30_thermal_relays/relais_therm4.svg', caption: 'Relais thermique 3P' }
    },
    {
      y: 2220,
      tag: '-M Motor Trifásico 3~',
      caption: 'Motor asíncrono jaula de ardilla',
      sub: 'Bornas U1-V1-W1 + tierra de protección PE',
      opensimu: null,
      radica: { url: '/simbolos_svg/radica/227_iec-power-meters-transformers-motors/67_ac-motor-3p-3-terminal.79b1909019.svg', caption: 'AC Motor 3P 3-Terminal' },
      qet: { url: '/simbolos_svg/qelectrotech/10_allpole/391_consumers_actuators/10_engines/moteur_tri.svg', caption: 'Moteur triphasé' }
    }
  ];

  for (const row of rows) {
    addLabel(40, row.y, row.tag, row.caption, row.sub, 240, 54);

    if (row.opensimu) {
      canvasView.placeComponent(row.opensimu.type, { x: row.opensimu.x, y: row.opensimu.y });
      const placed = canvasView.components[canvasView.components.length - 1];
      if (placed) placed.tag = row.opensimu.tag;
    } else {
      addLabel(300, row.y + 10, '(Próxima fase)', 'En catálogo SVG', '', 160, 34, '#cbd5e1', '#f8fafc');
    }

    if (row.radica) {
      addSvg(500, row.y - 15, row.radica.url, 'Radica', row.radica.caption);
    }

    if (row.qet) {
      addSvg(660, row.y - 15, row.qet.url, 'QElectroTech', row.qet.caption);
    }
  }

  canvasView.resetZoom();
}

// Initial palette render & default showroom
renderPalette();
loadShowroomDemo();
