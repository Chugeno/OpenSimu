import { CanvasView } from './ui/CanvasView';
import { COMPONENT_DEFINITIONS } from './core/ComponentRegistry';
import type { CircuitComponent, ComponentCategory } from './core/types';
import { CadeSimuParser } from './core/CadeSimuParser';
import { COMPONENT_ICONS, CATEGORY_ICONS } from './ui/EmbeddedIcons';
import { I18n, t, type SupportedLocale } from './core/i18n';
import { DeviceDetector, type DeviceInfo } from './core/DeviceDetector';

// Initialize i18n and Device Detection
I18n.init();
DeviceDetector.init();

// Initialize Canvas
const canvasEl = document.getElementById('circuit-canvas') as HTMLCanvasElement;
const canvasView = new CanvasView(canvasEl);

// State
let currentCategory: ComponentCategory = 'power';
let activeCompType: string | null = null;
let editingComponent: CircuitComponent | null = null;

// Direct Wire & Junction Tool Buttons
const btnToolWire = document.getElementById('btn-tool-wire') as HTMLButtonElement | null;
const btnToolJunction = document.getElementById('btn-tool-junction') as HTMLButtonElement | null;

// Floating Canvas Tool Banner
const floatingToolBanner = document.getElementById('canvas-floating-tool') as HTMLDivElement | null;
const floatingToolLabel = document.getElementById('floating-tool-label') as HTMLSpanElement | null;
const btnFloatingCancel = document.getElementById('btn-floating-cancel') as HTMLButtonElement | null;

// Mobile FAB Stack Elements
const btnFabUndo = document.getElementById('btn-fab-undo') as HTMLButtonElement | null;
const btnFabCopy = document.getElementById('btn-fab-copy') as HTMLButtonElement | null;
const btnFabPaste = document.getElementById('btn-fab-paste') as HTMLButtonElement | null;
const btnFabDelete = document.getElementById('btn-fab-delete') as HTMLButtonElement | null;
const btnFabTransform = document.getElementById('btn-fab-transform') as HTMLButtonElement | null;
const mobileTransformFlyout = document.getElementById('mobile-transform-flyout') as HTMLDivElement | null;
const btnFabRotateCcw = document.getElementById('btn-fab-rotate-ccw') as HTMLButtonElement | null;
const btnFabRotateCw = document.getElementById('btn-fab-rotate-cw') as HTMLButtonElement | null;
const btnFabMirrorH = document.getElementById('btn-fab-mirror-h') as HTMLButtonElement | null;
const btnFabMirrorV = document.getElementById('btn-fab-mirror-v') as HTMLButtonElement | null;
const btnFabWire = document.getElementById('btn-fab-wire') as HTMLButtonElement | null;
const btnFabNode = document.getElementById('btn-fab-node') as HTMLButtonElement | null;
const btnFabAdd = document.getElementById('btn-fab-add') as HTMLButtonElement | null;

// Mobile Catalog Sheet (Drawer) Elements
const mobileCatalogDrawer = document.getElementById('mobile-catalog-drawer') as HTMLDivElement | null;
const mobileCatalogBackdrop = document.getElementById('mobile-catalog-backdrop') as HTMLDivElement | null;
const mobileCatalogBack = document.getElementById('mobile-catalog-back') as HTMLButtonElement | null;
const mobileCatalogTitle = document.getElementById('mobile-catalog-title') as HTMLHeadingElement | null;
const mobileCatalogClose = document.getElementById('mobile-catalog-close') as HTMLButtonElement | null;
const mobileCategoriesView = document.getElementById('mobile-categories-view') as HTMLDivElement | null;
const mobileComponentsView = document.getElementById('mobile-components-view') as HTMLDivElement | null;

// Mobile File Menu Drawer (Archivo) Elements
const btnMobileMenu = document.getElementById('btn-mobile-menu') as HTMLButtonElement | null;
const mobileFileDrawer = document.getElementById('mobile-file-drawer') as HTMLDivElement | null;
const mobileFileBackdrop = document.getElementById('mobile-file-backdrop') as HTMLDivElement | null;
const mobileFileClose = document.getElementById('mobile-file-close') as HTMLButtonElement | null;

const mobileBtnClear = document.getElementById('mobile-btn-clear') as HTMLButtonElement | null;
const mobileBtnLoad = document.getElementById('mobile-btn-load') as HTMLButtonElement | null;
const mobileBtnSave = document.getElementById('mobile-btn-save') as HTMLButtonElement | null;
const mobileBtnExportCad = document.getElementById('mobile-btn-export-cad') as HTMLButtonElement | null;
const mobileBtnPrint = document.getElementById('mobile-btn-print') as HTMLButtonElement | null;
const mobileBtnDemo = document.getElementById('mobile-btn-demo') as HTMLButtonElement | null;
const mobileBtnOptions = document.getElementById('mobile-btn-options') as HTMLButtonElement | null;
const mobileBtnFullscreen = document.getElementById('mobile-btn-fullscreen') as HTMLButtonElement | null;
const mobileBtnInstallApp = document.getElementById('mobile-btn-install-app') as HTMLButtonElement | null;

// Elements: TopBar
const btnFile = document.getElementById('btn-file') as HTMLButtonElement | null;
const fileMenu = document.getElementById('file-menu') as HTMLDivElement | null;
const btnLoad = document.getElementById('btn-load') as HTMLButtonElement | null;
const btnSave = document.getElementById('btn-save') as HTMLButtonElement | null;
const btnExportCad = document.getElementById('btn-export-cad') as HTMLButtonElement | null;
const btnPrint = document.getElementById('btn-print') as HTMLButtonElement | null;
const btnFullscreen = document.getElementById('btn-fullscreen') as HTMLButtonElement | null;
const btnDemo = document.getElementById('btn-demo') as HTMLButtonElement | null;
const btnOptions = document.getElementById('btn-options') as HTMLButtonElement | null;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement | null;
const btnInstallApp = document.getElementById('btn-install-app') as HTMLButtonElement | null;
const sepInstall = document.getElementById('sep-install') as HTMLDivElement | null;
const fileInput = document.getElementById('file-input') as HTMLInputElement;

const btnUndo = document.getElementById('btn-undo') as HTMLButtonElement | null;
const btnRedo = document.getElementById('btn-redo') as HTMLButtonElement | null;

const btnCopy = document.getElementById('btn-copy') as HTMLButtonElement | null;
const btnCut = document.getElementById('btn-cut') as HTMLButtonElement | null;
const btnPaste = document.getElementById('btn-paste') as HTMLButtonElement | null;

const btnRotateCcw = document.getElementById('btn-rotate-ccw') as HTMLButtonElement | null;
const btnRotateCw = document.getElementById('btn-rotate-cw') as HTMLButtonElement | null;
const btnMirrorH = document.getElementById('btn-mirror-h') as HTMLButtonElement | null;
const btnMirrorV = document.getElementById('btn-mirror-v') as HTMLButtonElement | null;

const btnZoomIn = document.getElementById('btn-zoom-in') as HTMLButtonElement | null;
const btnZoomOut = document.getElementById('btn-zoom-out') as HTMLButtonElement | null;
const btnZoomReset = document.getElementById('btn-zoom-reset') as HTMLButtonElement | null;

const btnLang = document.getElementById('btn-lang') as HTMLButtonElement | null;
const langMenu = document.getElementById('lang-menu') as HTMLDivElement | null;
const langCurrentLabel = document.getElementById('lang-current-label') as HTMLSpanElement | null;
const langSelect = document.getElementById('lang-select') as HTMLSelectElement | null;

const btnSimulateToggle = document.getElementById('btn-simulate-toggle') as HTMLButtonElement | null;

// Workspace & Status
const paletteContainer = document.getElementById('component-palette') as HTMLDivElement;
const catTabs = document.querySelectorAll<HTMLButtonElement>('.category-tab');
const statusMode = document.getElementById('status-mode') as HTMLSpanElement;
const statusCoords = document.getElementById('status-coords') as HTMLSpanElement;
const statusZoom = document.getElementById('status-zoom') as HTMLSpanElement;
const statusHint = document.getElementById('status-hint') as HTMLSpanElement;
const deviceBadge = document.getElementById('device-badge');
const btnResetZoom = document.getElementById('btn-reset-zoom') as HTMLButtonElement | null;

// Modals
const tagModal = document.getElementById('tag-modal') as HTMLDivElement;
const tagInput = document.getElementById('tag-input') as HTMLInputElement;
const modalCompTitle = document.getElementById('modal-comp-title') as HTMLHeadingElement;
const modalCompType = document.getElementById('modal-comp-type') as HTMLSpanElement;
const terminalsSection = document.getElementById('terminals-section') as HTMLDivElement;
const terminalsContainer = document.getElementById('terminals-container') as HTMLDivElement;
const modalCancel = document.getElementById('modal-cancel') as HTMLButtonElement;
const modalSave = document.getElementById('modal-save') as HTMLButtonElement;
const modalExtraOptions = document.getElementById('modal-extra-options') as HTMLDivElement | null;
const modalExtraLabel = document.getElementById('modal-extra-label') as HTMLLabelElement | null;
const modalExtraContent = document.getElementById('modal-extra-content') as HTMLDivElement | null;

let tempSelectedColor: 'green' | 'red' | 'yellow' | 'blue' | 'white' = 'green';
let tempSelectedProtectionType: 'mag' | 'mag_thermal' = 'mag';
let tempSelectedDays: string[] = ['L', 'M', 'X', 'J', 'V'];
let tempTimerManualTest: boolean = false;
let tempSelectedLatching: boolean = false;

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

// Language display helper
const localeLabels: Record<string, string> = {
  'es-AR': 'AR',
  'es-ES': 'ES',
  en: 'EN',
};

function updateLangDisplay(locale: SupportedLocale) {
  if (langCurrentLabel) {
    langCurrentLabel.textContent = localeLabels[locale] || 'AR';
  }
  if (langSelect) {
    langSelect.value = locale;
  }
}
updateLangDisplay(I18n.getLocale());

// Language Dropdown Setup
if (langMenu) {
  langMenu.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const newLocale = btn.dataset.locale as SupportedLocale;
      if (newLocale) {
        I18n.setLocale(newLocale);
        updateLangDisplay(newLocale);
      }
      closeAllMenus();
    };
  });
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

  // Render Category Tab Icons
  document.querySelectorAll<HTMLElement>('[data-cat-icon]').forEach((el) => {
    const cat = el.dataset.catIcon;
    if (cat && CATEGORY_ICONS[cat]) {
      el.innerHTML = CATEGORY_ICONS[cat];
    }
  });

  renderPalette();
  updateSimulationButton(canvasView.isSimulation);
}

I18n.onLocaleChange(() => {
  applyTranslations();
  canvasView.render();
});

// Dropdown Menus Management
function closeAllMenus() {
  document.querySelectorAll<HTMLElement>('.menu').forEach((m) => m.classList.remove('open'));
  if (mobileTransformFlyout) {
    mobileTransformFlyout.classList.add('hidden');
  }
  if (mobileFileDrawer && mobileFileDrawer.style.display !== 'none') {
    mobileFileDrawer.style.display = 'none';
  }
}

function setupDropdown(btn: HTMLElement | null, menu: HTMLElement | null) {
  if (!btn || !menu) return;
  btn.onclick = (e) => {
    e.stopPropagation();
    const wasOpen = menu.classList.contains('open');
    closeAllMenus();
    if (!wasOpen) {
      menu.classList.add('open');
    }
  };
}

setupDropdown(btnFile, fileMenu);
setupDropdown(btnLang, langMenu);

document.addEventListener('click', () => {
  closeAllMenus();
});

// SIMULATION TOGGLE LOGIC
function updateSimulationButton(isSimulating: boolean) {
  if (!btnSimulateToggle) return;
  btnSimulateToggle.classList.toggle('simulating', isSimulating);
  const icon = btnSimulateToggle.querySelector('.icon');
  const text = btnSimulateToggle.querySelector('.btn-text');

  if (isSimulating) {
    if (icon) {
      icon.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>`;
    }
    if (text) text.textContent = 'Detener';
    btnSimulateToggle.title = 'Detener Simulación Eléctrica';
    if (statusMode) {
      statusMode.className = 'status-pill simulating';
      statusMode.textContent = t('status.sim_mode') || 'Simulación activa';
    }
  } else {
    if (icon) {
      icon.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    }
    if (text) text.textContent = 'Simular';
    btnSimulateToggle.title = 'Iniciar Simulación Eléctrica';
    if (statusMode) {
      statusMode.className = 'status-pill';
      statusMode.textContent = t('status.edit_mode') || 'Modo Edición';
    }
  }
}

function setSimulationMode(simulating: boolean) {
  if (simulating) {
    activeCompType = null;
    renderPalette();
    canvasView.startSimulation();
    updateSimulationButton(true);
  } else {
    canvasView.stopSimulation();
    canvasView.setTool('select');
    updateSimulationButton(false);
  }
}

if (btnSimulateToggle) {
  btnSimulateToggle.onclick = () => {
    setSimulationMode(!canvasView.isSimulation);
  };
}

// Short Circuit Dismiss
btnShortCircuitDismiss.onclick = () => {
  shortCircuitModal.style.display = 'none';
  setSimulationMode(false);
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
  statusCoords.textContent = `X: ${status.x}  Y: ${status.y}`;
  statusZoom.textContent = `Zoom: ${status.zoom}%`;

  if (canvasView.isSimulation) {
    if (canvasView.simulationResult.shortCircuit) {
      statusMode.className = 'status-pill alert';
      statusMode.textContent = t('status.short_circuit_warn') || '¡Cortocircuito!';
      statusHint.textContent = canvasView.simulationResult.shortCircuitMessage || t('status.short_circuit_warn');
    } else {
      statusMode.className = 'status-pill simulating';
      statusMode.textContent = t('status.sim_mode') || 'Simulación activa';
      statusHint.textContent = t('status.hint_sim');
    }
  } else {
    statusMode.className = 'status-pill';
    statusMode.textContent = t('status.edit_mode') || 'Modo Edición';
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
  updateToolButtonsState();
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

  // Extra options (pilot colors, motor breaker types, emergency latching, timers)
  if (modalExtraOptions && modalExtraLabel && modalExtraContent) {
    modalExtraContent.innerHTML = '';
    if (comp.type === 'pilot_light') {
      modalExtraOptions.style.display = 'block';
      modalExtraLabel.textContent = 'Color de Señalización:';
      tempSelectedColor = (comp.state?.color as any) || 'green';

      const colorGrid = document.createElement('div');
      colorGrid.className = 'color-picker-grid';

      const colors: { key: 'green' | 'red' | 'yellow' | 'blue' | 'white'; label: string; hex: string }[] = [
        { key: 'green', label: 'Verde', hex: '#22c55e' },
        { key: 'red', label: 'Rojo', hex: '#ef4444' },
        { key: 'yellow', label: 'Amarillo', hex: '#eab308' },
        { key: 'blue', label: 'Azul', hex: '#3b82f6' },
        { key: 'white', label: 'Blanco / Gris', hex: '#e2e8f0' },
      ];

      colors.forEach((c) => {
        const chip = document.createElement('div');
        chip.className = `color-chip ${tempSelectedColor === c.key ? 'active' : ''}`;

        const dot = document.createElement('span');
        dot.className = 'color-chip-dot';
        dot.style.background = c.hex;

        const text = document.createElement('span');
        text.textContent = c.label;

        chip.appendChild(dot);
        chip.appendChild(text);

        chip.onclick = () => {
          tempSelectedColor = c.key;
          colorGrid.querySelectorAll('.color-chip').forEach((el) => el.classList.remove('active'));
          chip.classList.add('active');
        };

        colorGrid.appendChild(chip);
      });

      modalExtraContent.appendChild(colorGrid);
    } else if (comp.type.startsWith('motor_breaker_')) {
      modalExtraOptions.style.display = 'block';
      modalExtraLabel.textContent = 'Tipo de Protección Guardamotor:';
      tempSelectedProtectionType = comp.state?.protectionType || 'mag';

      const typeGrid = document.createElement('div');
      typeGrid.className = 'protection-type-grid';

      const types: { key: 'mag' | 'mag_thermal'; title: string; desc: string }[] = [
        {
          key: 'mag',
          title: '⚡ Magnético',
          desc: 'Protección contra cortocircuito (I >>). Disparo instantáneo.',
        },
        {
          key: 'mag_thermal',
          title: '🔥⚡ Magnetotérmico',
          desc: 'Protección contra sobrecarga (bimetal térmico) y cortocircuito.',
        },
      ];

      types.forEach((t) => {
        const card = document.createElement('div');
        card.className = `protection-type-card ${tempSelectedProtectionType === t.key ? 'active' : ''}`;

        const title = document.createElement('div');
        title.className = 'protection-type-title';
        title.textContent = t.title;

        const desc = document.createElement('div');
        desc.className = 'protection-type-desc';
        desc.textContent = t.desc;

        card.appendChild(title);
        card.appendChild(desc);

        card.onclick = () => {
          tempSelectedProtectionType = t.key;
          typeGrid.querySelectorAll('.protection-type-card').forEach((el) => el.classList.remove('active'));
          card.classList.add('active');
        };

        typeGrid.appendChild(card);
      });

      modalExtraContent.appendChild(typeGrid);
    } else if (comp.type.startsWith('pushbutton_emergency_')) {
      modalExtraOptions.style.display = 'block';
      modalExtraLabel.textContent = 'Mecanismo de Retención / Enclavamiento:';
      tempSelectedLatching = Boolean(comp.state?.latching);

      const typeGrid = document.createElement('div');
      typeGrid.className = 'protection-type-grid';

      const options: { key: boolean; title: string; desc: string }[] = [
        {
          key: false,
          title: '🔘 Sin retención (Pulsador)',
          desc: 'Accionamiento momentáneo. Vuelve automáticamente a reposo al soltar.',
        },
        {
          key: true,
          title: '🔒 Con retención (Enclavamiento)',
          desc: 'Enclavamiento mecánico biestable. Un clic enclava, otro desenclava.',
        },
      ];

      options.forEach((opt) => {
        const card = document.createElement('div');
        card.className = `protection-type-card ${tempSelectedLatching === opt.key ? 'active' : ''}`;

        const title = document.createElement('div');
        title.className = 'protection-type-title';
        title.textContent = opt.title;

        const desc = document.createElement('div');
        desc.className = 'protection-type-desc';
        desc.textContent = opt.desc;

        card.appendChild(title);
        card.appendChild(desc);

        card.onclick = () => {
          tempSelectedLatching = opt.key;
          typeGrid.querySelectorAll('.protection-type-card').forEach((el) => el.classList.remove('active'));
          card.classList.add('active');
        };

        typeGrid.appendChild(card);
      });

      modalExtraContent.appendChild(typeGrid);
    } else if (comp.type === 'timer') {
      modalExtraOptions.style.display = 'block';
      modalExtraLabel.textContent = 'Programación Semanal (Reloj Horario):';

      tempSelectedDays = [...(comp.state?.timerDays ?? ['L', 'M', 'X', 'J', 'V'])];
      tempTimerManualTest = Boolean(comp.state?.timerManualTest);

      const weeklyBox = document.createElement('div');
      weeklyBox.style.display = 'flex';
      weeklyBox.style.flexDirection = 'column';
      weeklyBox.style.gap = '12px';
      weeklyBox.style.marginTop = '8px';

      const daysTitle = document.createElement('span');
      daysTitle.textContent = 'Días de Funcionamiento:';
      daysTitle.style.fontSize = '12px';
      daysTitle.style.fontWeight = 'bold';
      daysTitle.style.color = '#cbd5e1';

      const daysContainer = document.createElement('div');
      daysContainer.style.display = 'flex';
      daysContainer.style.gap = '6px';
      daysContainer.style.flexWrap = 'wrap';

      const allDays: { id: string; name: string }[] = [
        { id: 'L', name: 'Lun' },
        { id: 'M', name: 'Mar' },
        { id: 'X', name: 'Mié' },
        { id: 'J', name: 'Jue' },
        { id: 'V', name: 'Vie' },
        { id: 'S', name: 'Sáb' },
        { id: 'D', name: 'Dom' },
      ];

      allDays.forEach((d) => {
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.textContent = d.name;
        dayBtn.className = `btn ${tempSelectedDays.includes(d.id) ? 'btn-primary' : 'btn-secondary'}`;
        dayBtn.style.padding = '4px 8px';
        dayBtn.style.fontSize = '12px';
        dayBtn.style.fontWeight = 'bold';
        dayBtn.onclick = () => {
          if (tempSelectedDays.includes(d.id)) {
            tempSelectedDays = tempSelectedDays.filter((x) => x !== d.id);
            dayBtn.className = 'btn btn-secondary';
          } else {
            tempSelectedDays.push(d.id);
            dayBtn.className = 'btn btn-primary';
          }
        };
        daysContainer.appendChild(dayBtn);
      });

      const timeRow = document.createElement('div');
      timeRow.style.display = 'flex';
      timeRow.style.alignItems = 'center';
      timeRow.style.gap = '14px';

      const onCol = document.createElement('div');
      onCol.style.display = 'flex';
      onCol.style.flexDirection = 'column';
      onCol.style.gap = '4px';
      const onLbl = document.createElement('span');
      onLbl.textContent = 'Hora Encendido (ON):';
      onLbl.style.fontSize = '11px';
      onLbl.style.color = '#94a3b8';
      const onInp = document.createElement('input');
      onInp.type = 'time';
      onInp.id = 'timer-on-input';
      onInp.value = comp.state?.timerOnTime ?? '08:00';
      onInp.className = 'terminal-input';
      onInp.style.width = '110px';
      onCol.appendChild(onLbl);
      onCol.appendChild(onInp);

      const offCol = document.createElement('div');
      offCol.style.display = 'flex';
      offCol.style.flexDirection = 'column';
      offCol.style.gap = '4px';
      const offLbl = document.createElement('span');
      offLbl.textContent = 'Hora Apagado (OFF):';
      offLbl.style.fontSize = '11px';
      offLbl.style.color = '#94a3b8';
      const offInp = document.createElement('input');
      offInp.type = 'time';
      offInp.id = 'timer-off-input';
      offInp.value = comp.state?.timerOffTime ?? '18:00';
      offInp.className = 'terminal-input';
      offInp.style.width = '110px';
      offCol.appendChild(offLbl);
      offCol.appendChild(offInp);

      timeRow.appendChild(onCol);
      timeRow.appendChild(offCol);

      const testRow = document.createElement('label');
      testRow.style.display = 'flex';
      testRow.style.alignItems = 'center';
      testRow.style.gap = '8px';
      testRow.style.cursor = 'pointer';
      testRow.style.fontSize = '12px';
      testRow.style.fontWeight = 'bold';
      testRow.style.color = '#f59e0b';
      testRow.style.marginTop = '4px';

      const testChk = document.createElement('input');
      testChk.type = 'checkbox';
      testChk.id = 'timer-test-checkbox';
      testChk.checked = tempTimerManualTest;
      testChk.onchange = () => {
        tempTimerManualTest = testChk.checked;
      };

      const testTxt = document.createElement('span');
      testTxt.textContent = '⚡ Forzar activo en simulación (Modo Prueba)';

      testRow.appendChild(testChk);
      testRow.appendChild(testTxt);

      weeklyBox.appendChild(daysTitle);
      weeklyBox.appendChild(daysContainer);
      weeklyBox.appendChild(timeRow);
      weeklyBox.appendChild(testRow);
      modalExtraContent.appendChild(weeklyBox);
    } else if (
      comp.type === 'connection_timer' ||
      comp.type === 'disconnection_timer' ||
      comp.type === 'disconnect_connection_timer'
    ) {
      modalExtraOptions.style.display = 'block';
      modalExtraLabel.textContent = 'Configuración de Temporización:';

      const timerBox = document.createElement('div');
      timerBox.style.display = 'flex';
      timerBox.style.alignItems = 'center';
      timerBox.style.gap = '10px';
      timerBox.style.marginTop = '6px';

      const valInput = document.createElement('input');
      valInput.type = 'number';
      valInput.min = '0.1';
      valInput.step = '0.5';
      valInput.value = (comp.state?.timeValue ?? 5).toString();
      valInput.className = 'terminal-input';
      valInput.style.width = '100px';
      valInput.style.fontWeight = 'bold';
      valInput.id = 'timer-val-input';

      const unitSelect = document.createElement('select');
      unitSelect.className = 'terminal-input';
      unitSelect.style.width = '120px';
      unitSelect.style.cursor = 'pointer';
      unitSelect.id = 'timer-unit-select';

      const units: { val: 's' | 'min' | 'h'; label: string }[] = [
        { val: 's', label: 'Segundos (s)' },
        { val: 'min', label: 'Minutos (min)' },
        { val: 'h', label: 'Horas (h)' },
      ];
      units.forEach((u) => {
        const opt = document.createElement('option');
        opt.value = u.val;
        opt.textContent = u.label;
        if ((comp.state?.timeUnit ?? 's') === u.val) opt.selected = true;
        unitSelect.appendChild(opt);
      });

      timerBox.appendChild(valInput);
      timerBox.appendChild(unitSelect);
      modalExtraContent.appendChild(timerBox);
    } else {
      modalExtraOptions.style.display = 'none';
    }
  }

  // Generate dynamic terminal inputs
  if (terminalsContainer && terminalsSection) {
    terminalsContainer.innerHTML = '';
    const existingDecadeSelector = terminalsSection.querySelector('.decade-selector-container');
    if (existingDecadeSelector) {
      existingDecadeSelector.remove();
    }

    if (!comp.terminals || comp.terminals.length === 0) {
      terminalsSection.style.display = 'none';
    } else {
      terminalsSection.style.display = 'block';

      if (comp.type === 'contact_no' || comp.type === 'contact_nc') {
        const isNC = comp.type === 'contact_nc';
        const decadeBox = document.createElement('div');
        decadeBox.className = 'decade-selector-container';

        const decTitle = document.createElement('div');
        decTitle.className = 'decade-selector-title';
        decTitle.textContent = isNC ? 'Pares prefijados NC (11-12, 21-22...):' : 'Pares prefijados NA (13-14, 23-24...):';

        const grid = document.createElement('div');
        grid.className = 'decade-btn-grid';

        const decades = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        decades.forEach((dec) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'decade-btn';
          btn.textContent = dec.toString();

          const termIn = isNC ? (dec + 1).toString() : (dec + 3).toString();
          const termOut = isNC ? (dec + 2).toString() : (dec + 4).toString();

          if (comp.terminals && comp.terminals[0]?.name === termIn && comp.terminals[1]?.name === termOut) {
            btn.classList.add('active');
          }

          btn.onclick = () => {
            grid.querySelectorAll('.decade-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const inp0 = document.getElementById('terminal-input-0') as HTMLInputElement | null;
            const inp1 = document.getElementById('terminal-input-1') as HTMLInputElement | null;
            if (inp0) inp0.value = termIn;
            if (inp1) inp1.value = termOut;
          };

          grid.appendChild(btn);
        });

        decadeBox.appendChild(decTitle);
        decadeBox.appendChild(grid);
        terminalsSection.insertBefore(decadeBox, terminalsContainer);
      }

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
        input.value = (t.name || '').toUpperCase();
        input.dataset.index = idx.toString();

        input.addEventListener('input', () => {
          input.value = input.value.toUpperCase();
        });

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
  setTimeout(() => {
    tagInput.focus();
    tagInput.select();
  }, 50);
};

modalCancel.onclick = () => {
  tagModal.style.display = 'none';
  editingComponent = null;
};

modalSave.onclick = () => {
  if (editingComponent) {
    canvasView.saveSnapshot();
    if (tagInput.value.trim()) {
      editingComponent.tag = tagInput.value.trim().toUpperCase();
    }
    if (editingComponent.type === 'pilot_light') {
      editingComponent.state = editingComponent.state || {};
      editingComponent.state.color = tempSelectedColor;
    } else if (editingComponent.type.startsWith('motor_breaker_')) {
      editingComponent.state = editingComponent.state || {};
      editingComponent.state.protectionType = tempSelectedProtectionType;
    } else if (editingComponent.type.startsWith('pushbutton_emergency_')) {
      editingComponent.state = editingComponent.state || {};
      editingComponent.state.latching = tempSelectedLatching;
      if (editingComponent.tag && editingComponent.tag !== '-S') {
        for (const c of canvasView.components) {
          if (c.tag === editingComponent.tag && c.type.startsWith('pushbutton_emergency_')) {
            c.state = c.state || {};
            c.state.latching = tempSelectedLatching;
          }
        }
      }
    } else if (editingComponent.type === 'timer') {
      editingComponent.state = editingComponent.state || {};
      editingComponent.state.timerDays = [...tempSelectedDays];
      const onEl = document.getElementById('timer-on-input') as HTMLInputElement | null;
      const offEl = document.getElementById('timer-off-input') as HTMLInputElement | null;
      if (onEl) editingComponent.state.timerOnTime = onEl.value;
      if (offEl) editingComponent.state.timerOffTime = offEl.value;
      editingComponent.state.timerManualTest = tempTimerManualTest;
    } else if (
      editingComponent.type === 'connection_timer' ||
      editingComponent.type === 'disconnection_timer' ||
      editingComponent.type === 'disconnect_connection_timer'
    ) {
      editingComponent.state = editingComponent.state || {};
      const valEl = document.getElementById('timer-val-input') as HTMLInputElement | null;
      const unitEl = document.getElementById('timer-unit-select') as HTMLSelectElement | null;
      if (valEl) {
        const parsed = parseFloat(valEl.value);
        editingComponent.state.timeValue = !isNaN(parsed) && parsed > 0 ? parsed : 5;
      }
      if (unitEl) {
        editingComponent.state.timeUnit = unitEl.value as any;
      }
    }
    if (terminalsContainer) {
      const inputs = terminalsContainer.querySelectorAll<HTMLInputElement>('.terminal-input');
      inputs.forEach((inp) => {
        const idx = parseInt(inp.dataset.index || '-1', 10);
        if (idx >= 0 && editingComponent!.terminals[idx]) {
          const val = inp.value.trim().toUpperCase();
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

tagInput.addEventListener('input', () => {
  tagInput.value = tagInput.value.toUpperCase();
});

tagInput.onkeydown = (e) => {
  e.stopPropagation();
  if (e.key === 'Enter') modalSave.click();
  if (e.key === 'Escape') modalCancel.click();
};

// Toolbar Buttons: Undo, Redo
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

// Rotation & Mirror (Direct topbar buttons)
if (btnRotateCw) {
  btnRotateCw.onclick = () => {
    canvasView.rotateSelected(90);
  };
}

if (btnRotateCcw) {
  btnRotateCcw.onclick = () => {
    canvasView.rotateSelected(-90);
  };
}

if (btnMirrorH) {
  btnMirrorH.onclick = () => {
    canvasView.mirrorSelectedHorizontal();
  };
}

if (btnMirrorV) {
  btnMirrorV.onclick = () => {
    canvasView.mirrorSelectedVertical();
  };
}

canvasView.onHistoryChange = (canUndo, canRedo) => {
  if (btnUndo) btnUndo.disabled = !canUndo;
  if (btnRedo) btnRedo.disabled = !canRedo;
  if (btnFabUndo) btnFabUndo.disabled = !canUndo;
};

// Clipboard Actions (Copy, Cut, Paste)
if (btnCopy) {
  btnCopy.onclick = () => {
    canvasView.copy();
  };
}

if (btnCut) {
  btnCut.onclick = () => {
    canvasView.cut();
  };
}

if (btnPaste) {
  btnPaste.onclick = () => {
    canvasView.paste();
  };
}

// Zoom Actions (Zoom +, Zoom -, Reset Zoom)
if (btnZoomIn) {
  btnZoomIn.onclick = () => {
    canvasView.zoomIn();
  };
}

if (btnZoomOut) {
  btnZoomOut.onclick = () => {
    canvasView.zoomOut();
  };
}

if (btnZoomReset) {
  btnZoomReset.onclick = () => {
    canvasView.resetZoom();
  };
}

if (btnResetZoom) {
  btnResetZoom.onclick = () => {
    canvasView.resetZoom();
  };
}

// File Menu Actions
if (btnDemo) {
  btnDemo.onclick = () => {
    loadDemoCircuit();
    closeAllMenus();
  };
}

if (btnClear) {
  btnClear.onclick = () => {
    closeAllMenus();
    const msg = t('confirm.clear') || '¿Crear un circuito nuevo? Se borrará el lienzo actual.';
    if (confirm(msg)) {
      canvasView.clearCircuit();
      canvasView.render();
    }
  };
}

if (btnPrint) {
  btnPrint.onclick = () => {
    closeAllMenus();
    window.print();
  };
}

if (btnFullscreen) {
  const fsText = document.getElementById('fullscreen-text');
  btnFullscreen.onclick = () => {
    closeAllMenus();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  document.addEventListener('fullscreenchange', () => {
    if (fsText) {
      fsText.textContent = document.fullscreenElement ? 'Salir Pantalla Completa' : 'Pantalla Completa';
    }
  });
}

function updateToolButtonsState() {
  if (btnToolWire) {
    btnToolWire.classList.toggle('active', canvasView.activeTool.startsWith('wire_'));
  }
  if (btnToolJunction) {
    btnToolJunction.classList.toggle('active', canvasView.activeTool === 'junction');
  }
  if (btnFabWire) {
    btnFabWire.classList.toggle('active', canvasView.activeTool.startsWith('wire_'));
  }
  if (btnFabNode) {
    btnFabNode.classList.toggle('active', canvasView.activeTool === 'junction');
  }

  // Actualizar banner flotante en el lienzo
  if (floatingToolBanner && floatingToolLabel) {
    if (canvasView.activeTool === 'select') {
      floatingToolBanner.classList.add('hidden');
    } else {
      floatingToolBanner.classList.remove('hidden');
      if (canvasView.activeTool.startsWith('wire_')) {
        floatingToolLabel.textContent = '⚡ Modo Cable Activo';
      } else if (canvasView.activeTool === 'junction') {
        floatingToolLabel.textContent = '⚪ Modo Nodo Activo';
      } else if (canvasView.activeTool === 'place_component') {
        floatingToolLabel.textContent = '📍 Colocar Componente';
      } else {
        floatingToolLabel.textContent = `Herramienta: ${canvasView.activeTool}`;
      }
    }
  }
}

if (btnFloatingCancel) {
  btnFloatingCancel.onclick = () => {
    canvasView.cancelAction();
    activeCompType = null;
    updateToolButtonsState();
    renderPalette();
  };
}

if (btnToolWire) {
  btnToolWire.onclick = () => {
    if (canvasView.activeTool.startsWith('wire_')) {
      canvasView.setTool('select');
    } else {
      activeCompType = null;
      canvasView.setTool('wire_phase');
    }
    updateToolButtonsState();
    renderPalette();
  };
  btnToolWire.onmouseenter = () => {
    statusHint.textContent = 'Cable (Conductor): Arrastrá en la cuadrícula para trazar el cable.';
  };
}

if (btnToolJunction) {
  btnToolJunction.onclick = () => {
    if (canvasView.activeTool === 'junction') {
      canvasView.setTool('select');
    } else {
      activeCompType = null;
      canvasView.setTool('junction');
    }
    updateToolButtonsState();
    renderPalette();
  };
  btnToolJunction.onmouseenter = () => {
    statusHint.textContent = 'Nodo / Conexión: Clic para crear un nodo de unión donde no hay, o clic sobre un nodo para borrarlo.';
  };
}

// ==========================================================================
// MOBILE FLOATING ACTION BUTTONS (FAB) & CATALOG SHEET LOGIC
// ==========================================================================

const MOBILE_CATEGORIES: { id: ComponentCategory; nameKey: string; defaultName: string; desc: string }[] = [
  { id: 'power', nameKey: 'cat.power', defaultName: 'Alimentación', desc: 'Alimentaciones CA y CC' },
  { id: 'protections', nameKey: 'cat.protections', defaultName: 'Protecciones', desc: 'Termomagnéticas y Guardamotores' },
  { id: 'control', nameKey: 'cat.control', defaultName: 'Accionamientos', desc: 'Pulsadores e Interruptores' },
  { id: 'contactors', nameKey: 'cat.contactors', defaultName: 'Contactores', desc: 'Contactores de Potencia (1P - 4P)' },
  { id: 'motors', nameKey: 'cat.motors', defaultName: 'Motores', desc: 'Motores Trifásicos y Monofásicos' },
  { id: 'coils', nameKey: 'cat.coils', defaultName: 'Bobinas', desc: 'Bobinas de Mando y Relés' },
  { id: 'contacts', nameKey: 'cat.contacts', defaultName: 'Contactos Aux.', desc: 'Contactos NA, NC y Conmutados' },
  { id: 'signaling', nameKey: 'cat.signaling', defaultName: 'Señalización', desc: 'Pilotos e Indicadores' },
  { id: 'sensors', nameKey: 'cat.sensors', defaultName: 'Sensores', desc: 'Detectores y Sensores' },
];

// 1. FAB Deshacer
if (btnFabUndo) {
  btnFabUndo.onclick = () => {
    canvasView.undo();
  };
}

// 2. FAB Copiar
if (btnFabCopy) {
  btnFabCopy.onclick = () => {
    canvasView.copy();
  };
}

// 3. FAB Pegar
if (btnFabPaste) {
  btnFabPaste.onclick = () => {
    canvasView.paste();
  };
}

// FAB Borrar (Aparece dinámicamente cuando hay un elemento seleccionado en móvil)
if (btnFabDelete) {
  btnFabDelete.onclick = () => {
    canvasView.deleteSelected();
  };
}

canvasView.onSelectionChange = (hasSelection) => {
  if (btnFabDelete) {
    if (hasSelection) {
      btnFabDelete.classList.remove('hidden');
    } else {
      btnFabDelete.classList.add('hidden');
    }
  }
};

// 4. FAB Rotar / Espejo con Menú Desplegable (Flyout)
if (btnFabTransform && mobileTransformFlyout) {
  btnFabTransform.onclick = (e) => {
    e.stopPropagation();
    mobileTransformFlyout.classList.toggle('hidden');
  };
}

if (btnFabRotateCcw) {
  btnFabRotateCcw.onclick = (e) => {
    e.stopPropagation();
    canvasView.rotateSelected(-90);
    if (mobileTransformFlyout) mobileTransformFlyout.classList.add('hidden');
  };
}

if (btnFabRotateCw) {
  btnFabRotateCw.onclick = (e) => {
    e.stopPropagation();
    canvasView.rotateSelected(90);
    if (mobileTransformFlyout) mobileTransformFlyout.classList.add('hidden');
  };
}

if (btnFabMirrorH) {
  btnFabMirrorH.onclick = (e) => {
    e.stopPropagation();
    canvasView.mirrorSelectedHorizontal();
    if (mobileTransformFlyout) mobileTransformFlyout.classList.add('hidden');
  };
}

if (btnFabMirrorV) {
  btnFabMirrorV.onclick = (e) => {
    e.stopPropagation();
    canvasView.mirrorSelectedVertical();
    if (mobileTransformFlyout) mobileTransformFlyout.classList.add('hidden');
  };
}

// 5. FAB Cable
if (btnFabWire) {
  btnFabWire.onclick = () => {
    if (canvasView.activeTool.startsWith('wire_')) {
      canvasView.setTool('select');
    } else {
      activeCompType = null;
      canvasView.setTool('wire_phase');
    }
    updateToolButtonsState();
    renderPalette();
  };
}

// 6. FAB Nodo
if (btnFabNode) {
  btnFabNode.onclick = () => {
    if (canvasView.activeTool === 'junction') {
      canvasView.setTool('select');
    } else {
      activeCompType = null;
      canvasView.setTool('junction');
    }
    updateToolButtonsState();
    renderPalette();
  };
}

// 7. FAB Agregar Componente (+)
if (btnFabAdd) {
  btnFabAdd.onclick = () => {
    openMobileCatalog();
  };
}

function openMobileCatalog() {
  if (!mobileCatalogDrawer) return;
  if (mobileTransformFlyout) mobileTransformFlyout.classList.add('hidden');
  mobileCatalogDrawer.style.display = 'flex';
  showMobileCategoriesView();
}

function closeMobileCatalog() {
  if (!mobileCatalogDrawer) return;
  mobileCatalogDrawer.style.display = 'none';
}

function showMobileCategoriesView() {
  if (!mobileCategoriesView || !mobileComponentsView || !mobileCatalogBack || !mobileCatalogTitle) return;
  mobileCategoriesView.style.display = 'grid';
  mobileComponentsView.style.display = 'none';
  mobileCatalogBack.style.visibility = 'hidden';
  mobileCatalogTitle.textContent = 'Componentes';
  renderMobileCategories();
}

function showMobileComponentsView(catId: ComponentCategory) {
  if (!mobileCategoriesView || !mobileComponentsView || !mobileCatalogBack || !mobileCatalogTitle) return;
  currentCategory = catId;
  catTabs.forEach((t) => t.classList.toggle('active', t.dataset.cat === catId));
  renderPalette();

  const meta = MOBILE_CATEGORIES.find((c) => c.id === catId);
  mobileCatalogTitle.textContent = meta ? (t(meta.nameKey) || meta.defaultName) : catId;
  mobileCatalogBack.style.visibility = 'visible';
  mobileCategoriesView.style.display = 'none';
  mobileComponentsView.style.display = 'grid';
  renderMobileComponents(catId);
}

function renderMobileCategories() {
  if (!mobileCategoriesView) return;
  mobileCategoriesView.innerHTML = '';

  MOBILE_CATEGORIES.forEach((cat) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'mobile-category-card';
    const localizedName = t(cat.nameKey) || cat.defaultName;
    const iconSvg = CATEGORY_ICONS[cat.id] || '⚡';

    card.innerHTML = `
      <div class="mobile-cat-icon">${iconSvg}</div>
      <div class="mobile-cat-name">${localizedName}</div>
      <div class="mobile-cat-desc">${cat.desc}</div>
    `;

    card.onclick = () => {
      showMobileComponentsView(cat.id);
    };

    mobileCategoriesView.appendChild(card);
  });
}

function renderMobileComponents(catId: ComponentCategory) {
  if (!mobileComponentsView) return;
  mobileComponentsView.innerHTML = '';

  const defs = Object.values(COMPONENT_DEFINITIONS).filter((d) => d.category === catId && !d.hidden);

  if (defs.length === 0) {
    mobileComponentsView.innerHTML = '<p style="color:#94a3b8;grid-column:1/-1;text-align:center;padding:24px;">No hay componentes en esta categoría.</p>';
    return;
  }

  defs.forEach((def) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'mobile-component-card';
    const localizedName = t(def.type) || def.name;
    const svgIcon = COMPONENT_ICONS[def.type] || '⚡';

    card.innerHTML = `
      <div class="mobile-comp-icon">${svgIcon}</div>
      <div class="mobile-comp-name">${localizedName}</div>
      <span class="mobile-comp-tag">${def.defaultTag || ''}</span>
    `;

    card.onclick = () => {
      // Inserción directa en el centro visible para pantalla táctil / móvil
      canvasView.placeComponentAtVisibleCenter(def.type);
      canvasView.setTool('select');
      activeCompType = null;
      updateToolButtonsState();
      renderPalette();
      closeMobileCatalog();
    };

    mobileComponentsView.appendChild(card);
  });
}

if (mobileCatalogBack) {
  mobileCatalogBack.onclick = () => {
    showMobileCategoriesView();
  };
}

if (mobileCatalogClose) {
  mobileCatalogClose.onclick = () => {
    closeMobileCatalog();
  };
}

if (mobileCatalogBackdrop) {
  mobileCatalogBackdrop.onclick = () => {
    closeMobileCatalog();
  };
}

// Global click outside to dismiss flyout
document.addEventListener('click', (e) => {
  if (mobileTransformFlyout && !mobileTransformFlyout.classList.contains('hidden')) {
    if (!mobileTransformFlyout.contains(e.target as Node) && !(btnFabTransform && btnFabTransform.contains(e.target as Node))) {
      mobileTransformFlyout.classList.add('hidden');
    }
  }
});

// Escape key to close mobile dialogs
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (mobileCatalogDrawer && mobileCatalogDrawer.style.display !== 'none') {
      closeMobileCatalog();
    }
    if (mobileFileDrawer && mobileFileDrawer.style.display !== 'none') {
      closeMobileFileDrawer();
    }
    if (mobileTransformFlyout && !mobileTransformFlyout.classList.contains('hidden')) {
      mobileTransformFlyout.classList.add('hidden');
    }
  }
});

// ==========================================================================
// MOBILE FILE MENU DRAWER (ARCHIVO) LOGIC
// ==========================================================================
function openMobileFileDrawer() {
  if (!mobileFileDrawer) return;
  closeAllMenus();
  if (mobileCatalogDrawer) mobileCatalogDrawer.style.display = 'none';
  mobileFileDrawer.style.display = 'flex';
}

function closeMobileFileDrawer() {
  if (!mobileFileDrawer) return;
  mobileFileDrawer.style.display = 'none';
}

if (btnMobileMenu) {
  btnMobileMenu.onclick = (e) => {
    e.stopPropagation();
    openMobileFileDrawer();
  };
}

if (mobileFileClose) {
  mobileFileClose.onclick = () => closeMobileFileDrawer();
}

if (mobileFileBackdrop) {
  mobileFileBackdrop.onclick = () => closeMobileFileDrawer();
}

if (mobileBtnClear) {
  mobileBtnClear.onclick = () => {
    closeMobileFileDrawer();
    btnClear?.click();
  };
}

if (mobileBtnLoad) {
  mobileBtnLoad.onclick = () => {
    closeMobileFileDrawer();
    btnLoad?.click();
  };
}

if (mobileBtnSave) {
  mobileBtnSave.onclick = () => {
    closeMobileFileDrawer();
    btnSave?.click();
  };
}

if (mobileBtnExportCad) {
  mobileBtnExportCad.onclick = () => {
    closeMobileFileDrawer();
    btnExportCad?.click();
  };
}

if (mobileBtnPrint) {
  mobileBtnPrint.onclick = () => {
    closeMobileFileDrawer();
    btnPrint?.click();
  };
}

if (mobileBtnDemo) {
  mobileBtnDemo.onclick = () => {
    closeMobileFileDrawer();
    btnDemo?.click();
  };
}

if (mobileBtnOptions) {
  mobileBtnOptions.onclick = () => {
    closeMobileFileDrawer();
    btnOptions?.click();
  };
}

if (mobileBtnFullscreen) {
  mobileBtnFullscreen.onclick = () => {
    closeMobileFileDrawer();
    btnFullscreen?.click();
  };
}

if (mobileBtnInstallApp) {
  mobileBtnInstallApp.onclick = () => {
    closeMobileFileDrawer();
    btnInstallApp?.click();
  };
}

// Category Tabs Switching
catTabs.forEach((tab) => {
  tab.onclick = () => {
    catTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.cat as ComponentCategory;
    renderPalette();
  };
});

// Render Palette Items (SVG vector icons + tooltip hint)
function renderPalette() {
  paletteContainer.innerHTML = '';
  updateToolButtonsState();

  // Filter definitions for current category
  const defs = Object.values(COMPONENT_DEFINITIONS).filter((d) => d.category === currentCategory && !d.hidden);

  defs.forEach((def) => {
    if (def.dividerBefore) {
      const sep = document.createElement('div');
      sep.className = 'palette-divider';
      paletteContainer.appendChild(sep);
    }
    const btn = document.createElement('button');
    const isActive = canvasView.activeTool === 'place_component' && activeCompType === def.type;
    btn.className = `palette-item ${isActive ? 'active' : ''}`;
    const localizedName = t(`comp.${def.type}`, undefined, def.name);
    btn.title = `${localizedName} (${def.defaultTag})`;

    const svgIcon = COMPONENT_ICONS[def.type] || '⚡';
    btn.innerHTML = svgIcon;

    btn.onmouseenter = () => {
      const termNames = def.terminals.map((t) => t.name).join(', ');
      statusHint.textContent = `${localizedName} [Tag: ${def.defaultTag}] — Bornas: [${termNames}]`;
    };

    btn.onclick = (e) => {
      const isTouch =
        (e as PointerEvent).pointerType === 'touch' ||
        DeviceDetector.getInfo().isMobile ||
        DeviceDetector.getInfo().isTablet;

      if (isTouch) {
        // En pantalla táctil / móvil: colocar directamente en el centro visible del canvas
        canvasView.placeComponentAtVisibleCenter(def.type);
        canvasView.setTool('select');
        activeCompType = null;
        updateToolButtonsState();
        renderPalette();
      } else {
        // En escritorio con mouse: clic de nuevo cancela/toggle a select, o activa estampilla
        if (canvasView.activeTool === 'place_component' && activeCompType === def.type) {
          canvasView.setTool('select');
          activeCompType = null;
        } else {
          activeCompType = def.type;
          canvasView.setTool('place_component', def.type);
        }
        updateToolButtonsState();
        renderPalette();
      }
    };
    paletteContainer.appendChild(btn);
  });
}

// JSON Save & Load
if (btnSave) {
  btnSave.onclick = () => {
    closeAllMenus();
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
}

if (btnExportCad) {
  btnExportCad.onclick = () => {
    closeAllMenus();
    const cadContent = CadeSimuParser.exportToCad(canvasView.components, canvasView.wires);
    const blob = new Blob([cadContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuito_cadesimu_${Date.now()}.cad`;
    a.click();
    URL.revokeObjectURL(url);
  };
}

if (btnLoad) {
  btnLoad.onclick = () => {
    closeAllMenus();
    fileInput.click();
  };
}

// ==========================================================================
// PWA INSTALLATION & SERVICE WORKER
// ==========================================================================
let deferredInstallPrompt: any = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        console.log('[OpenSimu PWA] Service Worker registrado correctamente:', reg.scope);
      })
      .catch((err) => {
        console.warn('[OpenSimu PWA] Service Worker no registrado (modo no-https o local):', err);
      });
  });
}

window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (btnInstallApp) btnInstallApp.style.display = 'block';
  if (mobileBtnInstallApp) mobileBtnInstallApp.style.display = 'flex';
  if (sepInstall) sepInstall.style.display = 'block';
  console.log('[OpenSimu PWA] Aplicación lista para instalarse.');
});

if (btnInstallApp) {
  btnInstallApp.onclick = async () => {
    closeAllMenus();
    if (!deferredInstallPrompt) {
      alert('Para instalar OpenSimu, abrí el menú de tu navegador (los tres puntos ⋮) y tocá "Instalar aplicación" o "Agregar a la pantalla principal".');
      return;
    }
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log('[OpenSimu PWA] Elección del usuario:', outcome);
    deferredInstallPrompt = null;
    if (btnInstallApp) btnInstallApp.style.display = 'none';
    if (mobileBtnInstallApp) mobileBtnInstallApp.style.display = 'none';
    if (sepInstall) sepInstall.style.display = 'none';
  };
}

window.addEventListener('appinstalled', () => {
  console.log('[OpenSimu PWA] ¡OpenSimu instalado con éxito!');
  if (btnInstallApp) btnInstallApp.style.display = 'none';
  if (mobileBtnInstallApp) mobileBtnInstallApp.style.display = 'none';
  if (sepInstall) sepInstall.style.display = 'none';
  if (statusHint) {
    statusHint.textContent = '¡OpenSimu instalado correctamente como aplicación!';
  }
});

fileInput.onchange = (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const isCad = file.name.toLowerCase().endsWith('.cad');
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const text = event.target?.result as string;

      if (isCad) {
        const result = CadeSimuParser.parse(text);
        canvasView.clearCircuit();
        canvasView.components = result.components;
        canvasView.wires = result.wires;
        canvasView.render();
        canvasView.resetZoom();
      } else {
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
  if (isCad) {
    reader.readAsText(file, 'windows-1252');
  } else {
    reader.readAsText(file, 'utf-8');
  }
  fileInput.value = '';
};

// DEMO CIRCUIT: Marcha y Paro con Autoenclavamiento
function loadDemoCircuit() {
  canvasView.clearCircuit();

  // 1. Sources
  canvasView.placeComponent('source_l', { x: 100, y: 40 });
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

  // 7. Wires (Fase L)
  canvasView.wires.push({
    id: 'w1',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 100, y: 40 }, { x: 100, y: 80 }],
  });

  canvasView.wires.push({
    id: 'w2',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 100, y: 140 }, { x: 100, y: 180 }],
  });

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

  canvasView.wires.push({
    id: 'w4',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 100, y: 240 }, { x: 100, y: 260 }],
  });

  canvasView.wires.push({
    id: 'w5',
    type: 'phase',
    potential: 'NONE',
    points: [{ x: 180, y: 240 }, { x: 100, y: 240 }],
  });

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
  canvasView.wires.push({
    id: 'w7',
    type: 'neutral',
    potential: 'NONE',
    points: [{ x: 100, y: 320 }, { x: 100, y: 360 }],
  });

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

// Initial translations, category icons, palette render & default demo circuit
applyTranslations();
loadDemoCircuit();

// ==========================================================================
// PREFERENCIAS Y OPCIONES (SETTINGS / LOCAL STORAGE)
// ==========================================================================
interface AppSettings {
  hideGrid: boolean;
  showCursorGuide: boolean;
  showTitleBlock: boolean;
  sheetSize: string;
  cadesimuEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  hideGrid: false,
  showCursorGuide: false,
  showTitleBlock: false,
  sheetSize: 'A4_horizontal',
  cadesimuEnabled: true,
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem('opensimu_settings');
    const parsed = raw ? JSON.parse(raw) : {};
    const legacyDisabled = localStorage.getItem('opensimu_cadesimu_key_disabled') === 'true';
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      cadesimuEnabled: parsed.cadesimuEnabled !== undefined ? parsed.cadesimuEnabled : !legacyDisabled,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem('opensimu_settings', JSON.stringify(settings));
    if (settings.cadesimuEnabled) {
      localStorage.removeItem('opensimu_cadesimu_key_disabled');
    } else {
      localStorage.setItem('opensimu_cadesimu_key_disabled', 'true');
    }
  } catch (err) {
    console.error('Error al guardar ajustes en localStorage:', err);
  }
}

function applySettings(settings: AppSettings) {
  canvasView.showGrid = !settings.hideGrid;
  canvasView.render();
}

// Elementos del Modal de Opciones
const optionsModal = document.getElementById('options-modal') as HTMLDivElement | null;
const btnOptionsClose = document.getElementById('btn-options-close') as HTMLButtonElement | null;
const btnOptionsCancel = document.getElementById('btn-options-cancel') as HTMLButtonElement | null;
const btnOptionsSave = document.getElementById('btn-options-save') as HTMLButtonElement | null;

const optHideGrid = document.getElementById('opt-hide-grid') as HTMLInputElement | null;
const optCursorGuide = document.getElementById('opt-cursor-guide') as HTMLInputElement | null;
const optTitleBlock = document.getElementById('opt-title-block') as HTMLInputElement | null;
const optSheetSize = document.getElementById('opt-sheet-size') as HTMLSelectElement | null;
const optCadesimu = document.getElementById('opt-cadesimu') as HTMLInputElement | null;
const optionItemCadesimu = document.getElementById('option-item-cadesimu') as HTMLElement | null;
const cadesimuLockedHint = document.getElementById('cadesimu-locked-hint') as HTMLDivElement | null;

function openOptionsModal() {
  closeAllMenus();
  const settings = loadSettings();
  const isCadesimuUnlocked = localStorage.getItem('opensimu_cadesimu_unlocked') === 'true';

  if (optHideGrid) optHideGrid.checked = settings.hideGrid;
  if (optCursorGuide) optCursorGuide.checked = settings.showCursorGuide;
  if (optTitleBlock) optTitleBlock.checked = settings.showTitleBlock;
  if (optSheetSize) optSheetSize.value = settings.sheetSize || 'A4_horizontal';

  if (optCadesimu) {
    optCadesimu.checked = settings.cadesimuEnabled;
    if (isCadesimuUnlocked) {
      // DESBLOQUEADO: El usuario puede activarlo o desactivarlo libremente
      optCadesimu.disabled = false;
      if (optionItemCadesimu) optionItemCadesimu.classList.remove('disabled');
      if (cadesimuLockedHint) cadesimuLockedHint.style.display = 'none';
    } else {
      // BLOQUEADO: Se muestra la opción pero está bloqueada
      optCadesimu.disabled = true;
      if (optionItemCadesimu) optionItemCadesimu.classList.add('disabled');
      if (cadesimuLockedHint) cadesimuLockedHint.style.display = 'block';
    }
  }

  if (optionsModal) optionsModal.style.display = 'flex';
}

function closeOptionsModal() {
  if (optionsModal) optionsModal.style.display = 'none';
}

if (btnOptions) {
  btnOptions.onclick = () => openOptionsModal();
}

if (btnOptionsClose) {
  btnOptionsClose.onclick = () => closeOptionsModal();
}

if (btnOptionsCancel) {
  btnOptionsCancel.onclick = () => closeOptionsModal();
}

if (btnOptionsSave) {
  btnOptionsSave.onclick = () => {
    const isCadesimuUnlocked = localStorage.getItem('opensimu_cadesimu_unlocked') === 'true';
    const current = loadSettings();

    const newSettings: AppSettings = {
      hideGrid: optHideGrid ? optHideGrid.checked : current.hideGrid,
      showCursorGuide: optCursorGuide ? optCursorGuide.checked : current.showCursorGuide,
      showTitleBlock: optTitleBlock ? optTitleBlock.checked : current.showTitleBlock,
      sheetSize: optSheetSize ? optSheetSize.value : current.sheetSize,
      cadesimuEnabled: isCadesimuUnlocked && optCadesimu ? optCadesimu.checked : current.cadesimuEnabled,
    };

    saveSettings(newSettings);
    applySettings(newSettings);
    closeOptionsModal();
  };
}

if (optionsModal) {
  optionsModal.onclick = (e) => {
    if (e.target === optionsModal) {
      closeOptionsModal();
    }
  };
}

// Cargar y aplicar configuración inicial
const initialSettings = loadSettings();
applySettings(initialSettings);

// ==========================================================================
// CHASCARRILLO & HOMENAJE: CADe_SIMU ACCESS KEYPAD (4962)
// ==========================================================================
function initCadesimuKeypad() {
  const cadesimuModal = document.getElementById('cadesimu-modal') as HTMLDivElement | null;
  const cadesimuDisplay = document.getElementById('cadesimu-display') as HTMLDivElement | null;
  const cadesimuOk = document.getElementById('cadesimu-ok') as HTMLButtonElement | null;
  const cadesimuCnl = document.getElementById('cadesimu-cnl') as HTMLButtonElement | null;
  const numBtns = document.querySelectorAll<HTMLButtonElement>('.cadesimu-btn[data-key]');

  const tributeModal = document.getElementById('cadesimu-tribute-modal') as HTMLDivElement | null;
  const tributeDesc = document.getElementById('tribute-desc') as HTMLParagraphElement | null;
  const tributeWebRow = document.getElementById('tribute-web-row') as HTMLParagraphElement | null;
  const tributeGuideBox = document.getElementById('tribute-guide-box') as HTMLDivElement | null;
  const btnTributeAccept = document.getElementById('btn-tribute-accept') as HTMLButtonElement | null;

  if (!cadesimuModal || !cadesimuDisplay) return;

  // Comprobar si se desactivó por hack en HTML o por configuración / localStorage
  const currentSettings = loadSettings();
  const isHackDisabled = (window as any).CADESIMU_KEY_REQUIRED === false;
  const isStorageDisabled = !currentSettings.cadesimuEnabled || localStorage.getItem('opensimu_cadesimu_key_disabled') === 'true';

  if (isHackDisabled || isStorageDisabled) {
    cadesimuModal.style.display = 'none';
    return;
  }

  // Estado del teclado (sólo mouse, bloquea teclado físico)
  let currentPin = '';
  cadesimuModal.style.display = 'flex';

  const updateDisplay = () => {
    cadesimuDisplay.textContent = '*'.repeat(currentPin.length);
  };

  numBtns.forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const val = btn.dataset.key;
      if (val && currentPin.length < 8) {
        currentPin += val;
        updateDisplay();
      }
    };
  });

  if (cadesimuCnl) {
    cadesimuCnl.onclick = (e) => {
      e.stopPropagation();
      currentPin = '';
      updateDisplay();
    };
  }

  const handleValidation = () => {
    cadesimuModal.style.display = 'none';
    const isMasterCode = currentPin === '4962';

    if (tributeModal) {
      if (isMasterCode) {
        // Desbloquear permanentemente el ajuste para desactivar el código desde Opciones
        localStorage.setItem('opensimu_cadesimu_unlocked', 'true');

        if (tributeDesc) {
          tributeDesc.innerHTML = '¡Has ingresado el legendario código <code>4962</code>! El acceso maestro original de CADe_SIMU.';
        }
        if (tributeWebRow) {
          tributeWebRow.style.display = 'block';
        }
        if (tributeGuideBox) {
          tributeGuideBox.style.display = 'flex';
        }
      } else {
        // Clave libre: permite entrar al simulador pero NO desbloquea la opción de desactivarlo
        if (tributeDesc) {
          tributeDesc.innerHTML = 'En CADe_SIMU original el código exigido era <code>4962</code>. ¡Aquí en OpenSimu eres libre y puedes continuar con cualquier clave!';
        }
        if (tributeWebRow) {
          tributeWebRow.style.display = 'none';
        }
        if (tributeGuideBox) {
          tributeGuideBox.style.display = 'none';
        }
      }
      tributeModal.style.display = 'flex';
    }
  };

  if (cadesimuOk) {
    cadesimuOk.onclick = (e) => {
      e.stopPropagation();
      handleValidation();
    };
  }

  // Bloqueo estricto del teclado físico en el modal de la calculadora (sólo mouse)
  window.addEventListener(
    'keydown',
    (e) => {
      if (cadesimuModal.style.display === 'flex') {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  if (btnTributeAccept) {
    btnTributeAccept.onclick = () => {
      if (tributeModal) tributeModal.style.display = 'none';
    };
  }
}

initCadesimuKeypad();
