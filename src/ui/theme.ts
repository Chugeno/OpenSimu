export interface ThemePalette {
  name: string;
  // Canvas
  canvasBg: string;
  gridDot: string;
  // Wires (Idle & Simulation)
  wirePhase: string;
  wireNeutral: string;
  wirePE: string;
  wireDCPos: string;
  wireDCNeg: string;
  wirePhaseGlow: string;
  wireNeutralGlow: string;
  // Components
  compStroke: string;
  compFill: string;
  compEnergizedFill: string;
  compEnergizedStroke: string;
  // UI Chrome
  topbarBg: string;
  paletteBg: string;
  statusbarBg: string;
  borderColor: string;
  tabActiveBorder: string;
  textMain: string;
  textMuted: string;
}

export const THEMES: Record<string, ThemePalette> = {
  // Tema Actual: Modern Dark Slate
  modernDark: {
    name: 'Modern Dark (Por defecto)',
    canvasBg: '#f8fafc',
    gridDot: '#cbd5e1',
    wirePhase: '#334155',
    wireNeutral: '#0284c7',
    wirePE: '#16a34a',
    wireDCPos: '#dc2626',
    wireDCNeg: '#1e3a8a',
    wirePhaseGlow: '#b91c1c',
    wireNeutralGlow: '#06b6d4',
    compStroke: '#1e293b',
    compFill: '#ffffff',
    compEnergizedFill: '#fef08a',
    compEnergizedStroke: '#ca8a04',
    topbarBg: '#0f172a',
    paletteBg: '#0f172a',
    statusbarBg: '#0f172a',
    borderColor: '#334155',
    tabActiveBorder: '#3b82f6',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
  },

  // Tema CADe_SIMU Clásico (Retro Windows / Fondo Blanco-Gris)
  classicCadeSimu: {
    name: 'CADe_SIMU Clásico (Retro)',
    canvasBg: '#ffffff',
    gridDot: '#a8a29e',
    wirePhase: '#78350f', // Marrón oscuro típico
    wireNeutral: '#0284c7', // Azul
    wirePE: '#15803d', // Verde
    wireDCPos: '#dc2626',
    wireDCNeg: '#1e3a8a',
    wirePhaseGlow: '#ef4444',
    wireNeutralGlow: '#38bdf8',
    compStroke: '#000000',
    compFill: '#ffffff',
    compEnergizedFill: '#fef08a',
    compEnergizedStroke: '#ca8a04',
    topbarBg: '#e2e8f0',
    paletteBg: '#f1f5f9',
    statusbarBg: '#e2e8f0',
    borderColor: '#94a3b8',
    tabActiveBorder: '#2563eb',
    textMain: '#0f172a',
    textMuted: '#64748b',
  },

  // Tema Aula / Escuelas (Alto Contraste y Claro)
  schoolHighContrast: {
    name: 'Escuela / Proyector (Alto Contraste)',
    canvasBg: '#ffffff',
    gridDot: '#94a3b8',
    wirePhase: '#000000',
    wireNeutral: '#0369a1',
    wirePE: '#15803d',
    wireDCPos: '#b91c1c',
    wireDCNeg: '#1e40af',
    wirePhaseGlow: '#dc2626',
    wireNeutralGlow: '#0284c7',
    compStroke: '#000000',
    compFill: '#ffffff',
    compEnergizedFill: '#fde047',
    compEnergizedStroke: '#a16207',
    topbarBg: '#1e293b',
    paletteBg: '#334155',
    statusbarBg: '#1e293b',
    borderColor: '#475569',
    tabActiveBorder: '#60a5fa',
    textMain: '#ffffff',
    textMuted: '#cbd5e1',
  },
};

export class ThemeManager {
  public static currentTheme: ThemePalette = THEMES.modernDark;

  public static applyTheme(themeKey: string) {
    const theme = THEMES[themeKey] || THEMES.modernDark;
    this.currentTheme = theme;

    const root = document.documentElement;
    root.style.setProperty('--bg-dark', theme.topbarBg);
    root.style.setProperty('--bg-panel', theme.paletteBg);
    root.style.setProperty('--bg-canvas', theme.canvasBg);
    root.style.setProperty('--border-color', theme.borderColor);
    root.style.setProperty('--text-main', theme.textMain);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--accent-blue', theme.tabActiveBorder);
  }
}
