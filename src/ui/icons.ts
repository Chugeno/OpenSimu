// Diccionario de iconos vectoriales SVG para la barra de herramientas de OpenSimu
// Iconos claros estilo CADe_SIMU en botones cuadrados de 36x36 px

export const COMPONENT_ICONS: Record<string, string> = {
  // ALIMENTACIÓN
  source_l: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="16" cy="10" r="4.5" stroke="#854d0e" stroke-width="2" />
      <line x1="16" y1="14.5" x2="16" y2="28" stroke="#854d0e" stroke-width="2" />
      <text x="16" y="13.5" font-size="7" font-weight="bold" fill="#854d0e" text-anchor="middle">L</text>
    </svg>`,

  source_n: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="16" cy="10" r="4.5" stroke="#0284c7" stroke-width="2" />
      <line x1="16" y1="14.5" x2="16" y2="28" stroke="#0284c7" stroke-width="2" />
      <text x="16" y="13.5" font-size="7" font-weight="bold" fill="#0284c7" text-anchor="middle">N</text>
    </svg>`,

  source_pe: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="16" cy="10" r="4.5" stroke="#16a34a" stroke-width="2" />
      <line x1="16" y1="14.5" x2="16" y2="28" stroke="#16a34a" stroke-width="2" />
      <text x="16" y="13" font-size="6" font-weight="bold" fill="#16a34a" text-anchor="middle">PE</text>
    </svg>`,

  source_dc_pos: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="16" cy="10" r="4.5" stroke="#dc2626" stroke-width="2" />
      <line x1="16" y1="14.5" x2="16" y2="28" stroke="#dc2626" stroke-width="2" />
      <text x="16" y="13.5" font-size="8" font-weight="bold" fill="#dc2626" text-anchor="middle">+</text>
    </svg>`,

  source_dc_neg: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="16" cy="10" r="4.5" stroke="#1e3a8a" stroke-width="2" />
      <line x1="16" y1="14.5" x2="16" y2="28" stroke="#1e3a8a" stroke-width="2" />
      <text x="16" y="13.5" font-size="9" font-weight="bold" fill="#1e3a8a" text-anchor="middle">-</text>
    </svg>`,

  power_l_n: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="11" cy="9" r="3.5" stroke="#854d0e" stroke-width="1.8" />
      <line x1="11" y1="12.5" x2="11" y2="26" stroke="#854d0e" stroke-width="1.8" />
      <circle cx="21" cy="9" r="3.5" stroke="#0284c7" stroke-width="1.8" />
      <line x1="21" y1="12.5" x2="21" y2="26" stroke="#0284c7" stroke-width="1.8" />
    </svg>`,

  power_l_n_pe: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="8" cy="9" r="3" stroke="#854d0e" stroke-width="1.5" />
      <line x1="8" y1="12" x2="8" y2="26" stroke="#854d0e" stroke-width="1.5" />
      <circle cx="16" cy="9" r="3" stroke="#0284c7" stroke-width="1.5" />
      <line x1="16" y1="12" x2="16" y2="26" stroke="#0284c7" stroke-width="1.5" />
      <circle cx="24" cy="9" r="3" stroke="#16a34a" stroke-width="1.5" />
      <line x1="24" y1="12" x2="24" y2="26" stroke="#16a34a" stroke-width="1.5" />
    </svg>`,

  power_3p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="8" cy="9" r="3" stroke="#854d0e" stroke-width="1.5" />
      <line x1="8" y1="12" x2="8" y2="26" stroke="#854d0e" stroke-width="1.5" />
      <circle cx="16" cy="9" r="3" stroke="#0f172a" stroke-width="1.5" />
      <line x1="16" y1="12" x2="16" y2="26" stroke="#0f172a" stroke-width="1.5" />
      <circle cx="24" cy="9" r="3" stroke="#dc2626" stroke-width="1.5" />
      <line x1="24" y1="12" x2="24" y2="26" stroke="#dc2626" stroke-width="1.5" />
    </svg>`,

  power_3p_pe: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="6" cy="9" r="2.5" stroke="#854d0e" stroke-width="1.5" />
      <line x1="6" y1="11.5" x2="6" y2="26" stroke="#854d0e" stroke-width="1.5" />
      <circle cx="13" cy="9" r="2.5" stroke="#0f172a" stroke-width="1.5" />
      <line x1="13" y1="11.5" x2="13" y2="26" stroke="#0f172a" stroke-width="1.5" />
      <circle cx="20" cy="9" r="2.5" stroke="#dc2626" stroke-width="1.5" />
      <line x1="20" y1="11.5" x2="20" y2="26" stroke="#dc2626" stroke-width="1.5" />
      <circle cx="27" cy="9" r="2.5" stroke="#16a34a" stroke-width="1.5" />
      <line x1="27" y1="11.5" x2="27" y2="26" stroke="#16a34a" stroke-width="1.5" />
    </svg>`,

  power_3p_n: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="6" cy="9" r="2.5" stroke="#854d0e" stroke-width="1.5" />
      <line x1="6" y1="11.5" x2="6" y2="26" stroke="#854d0e" stroke-width="1.5" />
      <circle cx="13" cy="9" r="2.5" stroke="#0f172a" stroke-width="1.5" />
      <line x1="13" y1="11.5" x2="13" y2="26" stroke="#0f172a" stroke-width="1.5" />
      <circle cx="20" cy="9" r="2.5" stroke="#dc2626" stroke-width="1.5" />
      <line x1="20" y1="11.5" x2="20" y2="26" stroke="#dc2626" stroke-width="1.5" />
      <circle cx="27" cy="9" r="2.5" stroke="#0284c7" stroke-width="1.5" />
      <line x1="27" y1="11.5" x2="27" y2="26" stroke="#0284c7" stroke-width="1.5" />
    </svg>`,

  power_3p_n_pe: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="5" cy="9" r="2" stroke="#854d0e" stroke-width="1.2" />
      <line x1="5" y1="11" x2="5" y2="26" stroke="#854d0e" stroke-width="1.2" />
      <circle cx="10.5" cy="9" r="2" stroke="#0f172a" stroke-width="1.2" />
      <line x1="10.5" y1="11" x2="10.5" y2="26" stroke="#0f172a" stroke-width="1.2" />
      <circle cx="16" cy="9" r="2" stroke="#dc2626" stroke-width="1.2" />
      <line x1="16" y1="11" x2="16" y2="26" stroke="#dc2626" stroke-width="1.2" />
      <circle cx="21.5" cy="9" r="2" stroke="#0284c7" stroke-width="1.2" />
      <line x1="21.5" y1="11" x2="21.5" y2="26" stroke="#0284c7" stroke-width="1.2" />
      <circle cx="27" cy="9" r="2" stroke="#16a34a" stroke-width="1.2" />
      <line x1="27" y1="11" x2="27" y2="26" stroke="#16a34a" stroke-width="1.2" />
    </svg>`,

  power_dc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="11" cy="9" r="3.5" stroke="#dc2626" stroke-width="1.8" />
      <line x1="11" y1="12.5" x2="11" y2="26" stroke="#dc2626" stroke-width="1.8" />
      <circle cx="21" cy="9" r="3.5" stroke="#1e3a8a" stroke-width="1.8" />
      <line x1="21" y1="12.5" x2="21" y2="26" stroke="#1e3a8a" stroke-width="1.8" />
    </svg>`,

  transformer: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <circle cx="16" cy="11" r="6" stroke="#38bdf8" />
      <circle cx="16" cy="21" r="6" stroke="#f59e0b" />
      <line x1="8" y1="3" x2="8" y2="11" stroke="#38bdf8" />
      <line x1="24" y1="3" x2="24" y2="11" stroke="#38bdf8" />
      <line x1="8" y1="21" x2="8" y2="29" stroke="#f59e0b" />
      <line x1="24" y1="21" x2="24" y2="29" stroke="#f59e0b" />
    </svg>`,

  transformer_III: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.3">
      <circle cx="9" cy="11" r="4.5" stroke="#38bdf8" />
      <circle cx="16" cy="11" r="4.5" stroke="#38bdf8" />
      <circle cx="23" cy="11" r="4.5" stroke="#38bdf8" />
      <circle cx="9" cy="21" r="4.5" stroke="#f59e0b" />
      <circle cx="16" cy="21" r="4.5" stroke="#f59e0b" />
      <circle cx="23" cy="21" r="4.5" stroke="#f59e0b" />
      <line x1="9" y1="3" x2="9" y2="6.5" stroke="#38bdf8" />
      <line x1="16" y1="3" x2="16" y2="6.5" stroke="#38bdf8" />
      <line x1="23" y1="3" x2="23" y2="6.5" stroke="#38bdf8" />
      <line x1="9" y1="25.5" x2="9" y2="29" stroke="#f59e0b" />
      <line x1="16" y1="25.5" x2="16" y2="29" stroke="#f59e0b" />
      <line x1="23" y1="25.5" x2="23" y2="29" stroke="#f59e0b" />
    </svg>`,

  ground: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#16a34a" stroke-width="2">
      <line x1="16" y1="4" x2="16" y2="15" />
      <line x1="8" y1="15" x2="24" y2="15" />
      <line x1="11" y1="20" x2="21" y2="20" />
      <line x1="14" y1="25" x2="18" y2="25" />
    </svg>`,

  // ACCIONAMIENTOS (MANDOS / PULSADORES)
  pushbutton_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="10" y2="11" />
      <line x1="13" y1="16" x2="8" y2="16" stroke-dasharray="1.5,1.5" />
      <polyline points="9.5,13 7,13 7,19 9.5,19" />
    </svg>`,

  pushbutton_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="11" x2="22" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="21" y2="9" />
      <line x1="17" y1="16" x2="10" y2="16" stroke-dasharray="1.5,1.5" />
      <polyline points="12.5,13 10,13 10,19 12.5,19" />
    </svg>`,

  pushbutton_emergency_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="11" x2="22" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="21" y2="9" />
      <line x1="17" y1="16" x2="9" y2="16" stroke-dasharray="1.5,1.5" />
      <path d="M 9 13 A 3 3 0 0 0 9 19 Z" />
    </svg>`,

  pushbutton_emergency_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="10" y2="11" />
      <line x1="13" y1="16" x2="8" y2="16" stroke-dasharray="1.5,1.5" />
      <path d="M 8 13 A 3 3 0 0 0 8 19 Z" />
    </svg>`,

  pushbutton_no_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="9" y1="4" x2="9" y2="10" />
      <line x1="9" y1="10" x2="13" y2="10" />
      <line x1="9" y1="20" x2="9" y2="28" />
      <line x1="9" y1="20" x2="13" y2="8" />
      <line x1="23" y1="4" x2="23" y2="10" />
      <line x1="23" y1="20" x2="23" y2="28" />
      <line x1="23" y1="20" x2="18" y2="10" />
      <line x1="10" y1="15" x2="22" y2="15" stroke-dasharray="1.5,1.5" stroke="#94a3b8" />
      <polyline points="7,12 5,12 5,18 7,18" stroke-width="1.3" />
    </svg>`,

  pushbutton_changeover: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="16" y1="4" x2="16" y2="12" />
      <line x1="8" y1="28" x2="8" y2="20" />
      <line x1="8" y1="20" x2="13" y2="20" />
      <line x1="24" y1="28" x2="24" y2="20" />
      <line x1="24" y1="20" x2="19" y2="20" />
      <line x1="16" y1="12" x2="10" y2="21" />
      <polyline points="14,14 11.5,14 11.5,18 14,18" stroke-width="1.3" />
    </svg>`,

  pushbutton_emergency_no_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="9" y1="4" x2="9" y2="10" />
      <line x1="9" y1="10" x2="13" y2="10" />
      <line x1="9" y1="20" x2="9" y2="28" />
      <line x1="9" y1="20" x2="13" y2="8" />
      <line x1="23" y1="4" x2="23" y2="10" />
      <line x1="23" y1="20" x2="23" y2="28" />
      <line x1="23" y1="20" x2="18" y2="10" />
      <line x1="10" y1="15" x2="22" y2="15" stroke-dasharray="1.5,1.5" stroke="#94a3b8" />
      <path d="M 6 12 A 3 3 0 0 0 6 18 Z" />
    </svg>`,

  pushbutton_emergency_changeover: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="16" y1="4" x2="16" y2="12" />
      <line x1="8" y1="28" x2="8" y2="20" />
      <line x1="8" y1="20" x2="13" y2="20" />
      <line x1="24" y1="28" x2="24" y2="20" />
      <line x1="24" y1="20" x2="19" y2="20" />
      <line x1="16" y1="12" x2="10" y2="21" />
      <path d="M 12 13 A 2.5 2.5 0 0 0 12 18 Z" />
    </svg>`,

  limit_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="18" y1="4" x2="18" y2="11" />
      <line x1="18" y1="21" x2="18" y2="28" />
      <line x1="18" y1="21" x2="12" y2="11" />
      <line x1="15" y1="16" x2="9" y2="16" stroke-dasharray="1.5,1.5" stroke="#94a3b8" />
      <circle cx="6" cy="16" r="3.5" stroke="#38bdf8" stroke-width="1.5" />
    </svg>`,

  limit_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="18" y1="4" x2="18" y2="11" />
      <line x1="18" y1="11" x2="24" y2="11" />
      <line x1="18" y1="21" x2="18" y2="28" />
      <line x1="18" y1="21" x2="23" y2="9" />
      <line x1="19" y1="16" x2="10" y2="16" stroke-dasharray="1.5,1.5" stroke="#94a3b8" />
      <circle cx="6" cy="16" r="3.5" stroke="#38bdf8" stroke-width="1.5" />
    </svg>`,

  limit_no_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="13" y1="4" x2="13" y2="10" />
      <line x1="13" y1="10" x2="17" y2="10" />
      <line x1="13" y1="20" x2="13" y2="28" />
      <line x1="13" y1="20" x2="17" y2="8" />
      <line x1="25" y1="4" x2="25" y2="10" />
      <line x1="25" y1="20" x2="25" y2="28" />
      <line x1="25" y1="20" x2="20" y2="10" />
      <line x1="8" y1="15" x2="24" y2="15" stroke-dasharray="1.5,1.5" stroke="#94a3b8" />
      <circle cx="5" cy="15" r="3" stroke="#38bdf8" stroke-width="1.3" />
    </svg>`,

  limit_changeover: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="18" y1="4" x2="18" y2="12" />
      <line x1="12" y1="28" x2="12" y2="20" />
      <line x1="12" y1="20" x2="16" y2="20" />
      <line x1="26" y1="28" x2="26" y2="20" />
      <line x1="26" y1="20" x2="22" y2="20" />
      <line x1="18" y1="12" x2="13" y2="21" />
      <line x1="14" y1="16" x2="8" y2="16" stroke-dasharray="1.5,1.5" stroke="#94a3b8" />
      <circle cx="5" cy="16" r="3" stroke="#38bdf8" stroke-width="1.3" />
    </svg>`,

  inductive_detector_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <rect x="5" y="8" width="22" height="16" rx="2" stroke="#e2e8f0" />
      <rect x="8" y="11" width="6" height="10" fill="#38bdf8" stroke="none" />
      <line x1="16" y1="4" x2="16" y2="8" />
      <line x1="16" y1="24" x2="16" y2="28" />
      <text x="21" y="18" font-size="5" font-weight="bold" fill="#22c55e" text-anchor="middle">NA</text>
    </svg>`,

  inductive_detector_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <rect x="5" y="8" width="22" height="16" rx="2" stroke="#e2e8f0" />
      <rect x="8" y="11" width="6" height="10" fill="#38bdf8" stroke="none" />
      <line x1="16" y1="4" x2="16" y2="8" />
      <line x1="16" y1="24" x2="16" y2="28" />
      <text x="21" y="18" font-size="5" font-weight="bold" fill="#ef4444" text-anchor="middle">NC</text>
    </svg>`,

  switch_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="10" y2="11" />
      <line x1="13" y1="16" x2="8" y2="16" stroke-dasharray="1.5,1.5" />
      <polyline points="9.5,13 7,13 7,19 4.5,19" />
    </svg>`,

  switch_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="11" x2="22" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="21" y2="9" />
      <line x1="17" y1="16" x2="10" y2="16" stroke-dasharray="1.5,1.5" />
      <polyline points="12.5,13 10,13 10,19 7.5,19" />
    </svg>`,

  switch_no_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <!-- NC Pole Left -->
      <line x1="9" y1="4" x2="9" y2="10" />
      <line x1="9" y1="10" x2="13" y2="10" />
      <line x1="9" y1="20" x2="9" y2="28" />
      <line x1="9" y1="20" x2="13" y2="8" />
      <!-- NO Pole Right -->
      <line x1="23" y1="4" x2="23" y2="10" />
      <line x1="23" y1="20" x2="23" y2="28" />
      <line x1="23" y1="20" x2="18" y2="10" />
      <!-- Link with S -->
      <line x1="10" y1="15" x2="22" y2="15" stroke-dasharray="1.5,1.5" stroke="#94a3b8" />
      <polyline points="7,12 5,12 5,18 3,18" stroke-width="1.3" />
    </svg>`,

  switch_changeover: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <!-- Common Top -->
      <line x1="16" y1="4" x2="16" y2="12" />
      <!-- NC Left -->
      <line x1="8" y1="28" x2="8" y2="20" />
      <line x1="8" y1="20" x2="13" y2="20" />
      <!-- NA Right -->
      <line x1="24" y1="28" x2="24" y2="20" />
      <line x1="24" y1="20" x2="19" y2="20" />
      <!-- Blade to NC -->
      <line x1="16" y1="12" x2="10" y2="21" />
      <!-- S actuator -->
      <polyline points="15,14 13,14 13,18 11,18" stroke-width="1.3" />
    </svg>`,

  switch_I_0_II: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <!-- Common Top -->
      <line x1="16" y1="4" x2="16" y2="12" />
      <!-- Terminal 12 (Left) -->
      <line x1="8" y1="28" x2="8" y2="20" />
      <line x1="8" y1="20" x2="12" y2="20" />
      <!-- Terminal 14 (Right) -->
      <line x1="24" y1="28" x2="24" y2="20" />
      <line x1="24" y1="20" x2="20" y2="20" />
      <!-- Blade straight vertical (Pos 0) -->
      <line x1="16" y1="12" x2="16" y2="22" stroke="#38bdf8" />
      <!-- Labels I - 0 - II -->
      <text x="8" y="10" font-size="4" font-weight="bold" fill="#f59e0b" stroke="none" text-anchor="middle">I</text>
      <text x="16" y="10" font-size="4" font-weight="bold" fill="#38bdf8" stroke="none" text-anchor="middle">0</text>
      <text x="24" y="10" font-size="4" font-weight="bold" fill="#f59e0b" stroke="none" text-anchor="middle">II</text>
    </svg>`,

  // PROTECCIONES (TERMOMAGNÉTICAS, GUARDAMOTOR, DIFERENCIAL)
  mcb_1p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="11" y2="11" />
      <!-- Disparo térmico y magnético -->
      <path d="M12,14 L10,18" stroke="#f59e0b" stroke-width="1.5" />
      <path d="M10,13 L14,13" stroke="#ef4444" stroke-width="1.5" />
      <text x="24" y="18" font-size="6" font-weight="bold" fill="#38bdf8" text-anchor="middle">1P</text>
    </svg>`,

  mcb_1p_n: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="10" y1="4" x2="10" y2="11" />
      <line x1="10" y1="21" x2="10" y2="28" />
      <line x1="10" y1="21" x2="6" y2="11" />
      <path d="M7.5,16 A1.5,1.5 0 0,0 4.5,16" stroke="#38bdf8" stroke-width="1.2" />
      <line x1="22" y1="4" x2="22" y2="11" />
      <line x1="22" y1="21" x2="22" y2="28" />
      <line x1="22" y1="21" x2="18" y2="11" />
      <line x1="10" y1="16" x2="22" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
      <text x="26" y="27" font-size="5" font-weight="bold" fill="#0284c7" text-anchor="middle">N</text>
      <text x="16" y="29" font-size="4.5" font-weight="bold" fill="#38bdf8" text-anchor="middle">1P+N</text>
    </svg>`,

  mcb_2p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="11" y1="4" x2="11" y2="11" />
      <line x1="11" y1="21" x2="11" y2="28" />
      <line x1="11" y1="21" x2="7" y2="11" />
      <line x1="21" y1="4" x2="21" y2="11" />
      <line x1="21" y1="21" x2="21" y2="28" />
      <line x1="21" y1="21" x2="17" y2="11" />
      <line x1="11" y1="16" x2="21" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
      <text x="26" y="27" font-size="6" font-weight="bold" fill="#38bdf8" text-anchor="middle">2P</text>
    </svg>`,

  mcb_3p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.3">
      <line x1="7" y1="4" x2="7" y2="11" />
      <line x1="7" y1="21" x2="7" y2="28" />
      <line x1="7" y1="21" x2="3.5" y2="11" />
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="12.5" y2="11" />
      <line x1="25" y1="4" x2="25" y2="11" />
      <line x1="25" y1="21" x2="25" y2="28" />
      <line x1="25" y1="21" x2="21.5" y2="11" />
      <line x1="7" y1="16" x2="25" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
      <text x="27" y="28" font-size="5.5" font-weight="bold" fill="#38bdf8" text-anchor="middle">3P</text>
    </svg>`,

  mcb_4p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.2">
      <line x1="5" y1="4" x2="5" y2="11" />
      <line x1="5" y1="21" x2="5" y2="28" />
      <line x1="5" y1="21" x2="2" y2="11" />
      <line x1="12" y1="4" x2="12" y2="11" />
      <line x1="12" y1="21" x2="12" y2="28" />
      <line x1="12" y1="21" x2="9" y2="11" />
      <line x1="19" y1="4" x2="19" y2="11" />
      <line x1="19" y1="21" x2="19" y2="28" />
      <line x1="19" y1="21" x2="16" y2="11" />
      <line x1="26" y1="4" x2="26" y2="11" />
      <line x1="26" y1="21" x2="26" y2="28" />
      <line x1="26" y1="21" x2="23" y2="11" />
      <line x1="5" y1="16" x2="26" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
      <text x="28" y="28" font-size="5.5" font-weight="bold" fill="#0284c7" text-anchor="middle">4P</text>
    </svg>`,

  motor_breaker_1p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="10" y2="11" />
      <rect x="13.5" y="8" width="5" height="4" fill="#16a34a" stroke="#22c55e" stroke-width="1" />
      <text x="24" y="22" font-size="6" font-weight="bold" fill="#22c55e" text-anchor="middle">M</text>
    </svg>`,

  motor_breaker_1p_n: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="10" y1="4" x2="10" y2="11" />
      <line x1="10" y1="21" x2="10" y2="28" />
      <line x1="10" y1="21" x2="6" y2="11" />
      <line x1="22" y1="4" x2="22" y2="11" />
      <line x1="22" y1="21" x2="22" y2="28" />
      <line x1="22" y1="21" x2="18" y2="11" />
      <line x1="10" y1="16" x2="22" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
      <rect x="8" y="8" width="4" height="3.5" fill="#16a34a" stroke="#22c55e" stroke-width="0.8" />
      <text x="26" y="27" font-size="5" font-weight="bold" fill="#0284c7" text-anchor="middle">N</text>
      <text x="16" y="29" font-size="4.5" font-weight="bold" fill="#22c55e" text-anchor="middle">M</text>
    </svg>`,

  motor_breaker_2p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="11" y1="4" x2="11" y2="11" />
      <line x1="11" y1="21" x2="11" y2="28" />
      <line x1="11" y1="21" x2="7" y2="11" />
      <line x1="21" y1="4" x2="21" y2="11" />
      <line x1="21" y1="21" x2="21" y2="28" />
      <line x1="21" y1="21" x2="17" y2="11" />
      <line x1="11" y1="16" x2="21" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
      <rect x="13.5" y="8" width="5" height="4" fill="#16a34a" stroke="#22c55e" stroke-width="1" />
      <text x="26" y="27" font-size="6" font-weight="bold" fill="#22c55e" text-anchor="middle">M</text>
    </svg>`,

  motor_breaker_3p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.3">
      <!-- 3 polos con accionamiento manual y térmico/magnético motor -->
      <line x1="7" y1="4" x2="7" y2="11" />
      <line x1="7" y1="21" x2="7" y2="28" />
      <line x1="7" y1="21" x2="3.5" y2="11" />
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="12.5" y2="11" />
      <line x1="25" y1="4" x2="25" y2="11" />
      <line x1="25" y1="21" x2="25" y2="28" />
      <line x1="25" y1="21" x2="21.5" y2="11" />
      <line x1="7" y1="16" x2="25" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
      <!-- Pulsador manual de marcha/paro de guardamotor -->
      <rect x="13.5" y="8" width="5" height="4" fill="#16a34a" stroke="#22c55e" stroke-width="1" />
      <text x="16" y="27" font-size="6" font-weight="bold" fill="#22c55e" text-anchor="middle">M</text>
    </svg>`,

  motor_breaker_4p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.2">
      <line x1="5" y1="4" x2="5" y2="11" />
      <line x1="5" y1="21" x2="5" y2="28" />
      <line x1="5" y1="21" x2="2" y2="11" />
      <line x1="12" y1="4" x2="12" y2="11" />
      <line x1="12" y1="21" x2="12" y2="28" />
      <line x1="12" y1="21" x2="9" y2="11" />
      <line x1="19" y1="4" x2="19" y2="11" />
      <line x1="19" y1="21" x2="19" y2="28" />
      <line x1="19" y1="21" x2="16" y2="11" />
      <line x1="26" y1="4" x2="26" y2="11" />
      <line x1="26" y1="21" x2="26" y2="28" />
      <line x1="26" y1="21" x2="23" y2="11" />
      <line x1="5" y1="16" x2="26" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
      <rect x="10.5" y="8" width="4" height="3" fill="#16a34a" stroke="#22c55e" stroke-width="0.8" />
      <text x="28" y="28" font-size="5" font-weight="bold" fill="#0284c7" text-anchor="middle">N</text>
      <text x="16" y="28" font-size="5" font-weight="bold" fill="#22c55e" text-anchor="middle">M</text>
    </svg>`,

  thermal_relay_3p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.3">
      <!-- Rectángulo contenedor de las omegas térmicas -->
      <rect x="4" y="10" width="24" height="12" stroke="#f59e0b" stroke-width="1.3" fill="#1e293b" />
      <line x1="8" y1="3" x2="8" y2="10" stroke="#e2e8f0" stroke-width="1.2" />
      <path d="M8,10 L8,12 L11.5,12 L11.5,20 L8,20 L8,22" stroke="#f59e0b" stroke-width="1.4" />
      <line x1="8" y1="22" x2="8" y2="29" stroke="#e2e8f0" stroke-width="1.2" />
      <line x1="16" y1="3" x2="16" y2="10" stroke="#e2e8f0" stroke-width="1.2" />
      <path d="M16,10 L16,12 L19.5,12 L19.5,20 L16,20 L16,22" stroke="#f59e0b" stroke-width="1.4" />
      <line x1="16" y1="22" x2="16" y2="29" stroke="#e2e8f0" stroke-width="1.2" />
      <line x1="24" y1="3" x2="24" y2="10" stroke="#e2e8f0" stroke-width="1.2" />
      <path d="M24,10 L24,12 L27.5,12 L27.5,20 L24,20 L24,22" stroke="#f59e0b" stroke-width="1.4" />
      <line x1="24" y1="22" x2="24" y2="29" stroke="#e2e8f0" stroke-width="1.2" />
      <!-- Enlace mecánico y botón TEST / TRIP -->
      <line x1="2" y1="16" x2="30" y2="16" stroke-dasharray="2,1" stroke="#f59e0b" stroke-width="1" />
      <rect x="1" y="6" width="5.5" height="4.5" rx="1" fill="#ef4444" />
      <text x="3.75" y="9.5" font-size="3.5" font-weight="bold" fill="#ffffff" text-anchor="middle">T</text>
    </svg>`,

  surge_arrester_1p_n: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="10" y1="3" x2="10" y2="8" />
      <rect x="6" y="8" width="8" height="12" stroke="#e2e8f0" stroke-width="1.4" />
      <path d="M7,17 L10,14 L10,11 L13,11" stroke="#f59e0b" stroke-width="1.2" />
      <line x1="10" y1="20" x2="10" y2="24" />
      <line x1="22" y1="3" x2="22" y2="8" />
      <rect x="18" y="8" width="8" height="12" stroke="#e2e8f0" stroke-width="1.4" />
      <path d="M19,17 L22,14 L22,11 L25,11" stroke="#f59e0b" stroke-width="1.2" />
      <line x1="22" y1="20" x2="22" y2="24" />
      <line x1="10" y1="24" x2="22" y2="24" stroke="#16a34a" stroke-width="1.5" />
      <line x1="16" y1="24" x2="16" y2="27" stroke="#16a34a" stroke-width="1.5" />
      <line x1="12" y1="27" x2="20" y2="27" stroke="#16a34a" stroke-width="1.5" />
      <line x1="14" y1="29" x2="18" y2="29" stroke="#16a34a" stroke-width="1.5" />
    </svg>`,

  surge_arrester_3p_n: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.2">
      <rect x="3" y="8" width="5.5" height="11" stroke="#e2e8f0" stroke-width="1.2" />
      <line x1="5.7" y1="3" x2="5.7" y2="8" />
      <line x1="5.7" y1="19" x2="5.7" y2="23" />
      <rect x="10.5" y="8" width="5.5" height="11" stroke="#e2e8f0" stroke-width="1.2" />
      <line x1="13.2" y1="3" x2="13.2" y2="8" />
      <line x1="13.2" y1="19" x2="13.2" y2="23" />
      <rect x="18" y="8" width="5.5" height="11" stroke="#e2e8f0" stroke-width="1.2" />
      <line x1="20.7" y1="3" x2="20.7" y2="8" />
      <line x1="20.7" y1="19" x2="20.7" y2="23" />
      <rect x="25" y="8" width="5" height="11" stroke="#e2e8f0" stroke-width="1.2" />
      <line x1="27.5" y1="3" x2="27.5" y2="8" />
      <line x1="27.5" y1="19" x2="27.5" y2="23" />
      <line x1="5.7" y1="23" x2="27.5" y2="23" stroke="#16a34a" stroke-width="1.5" />
      <line x1="16.5" y1="23" x2="16.5" y2="26" stroke="#16a34a" stroke-width="1.5" />
      <line x1="13.5" y1="26" x2="19.5" y2="26" stroke="#16a34a" stroke-width="1.5" />
      <line x1="14.5" y1="28.5" x2="18.5" y2="28.5" stroke="#16a34a" stroke-width="1.5" />
    </svg>`,

  rcd_2p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <!-- Toroide diferencial con botón Test -->
      <circle cx="16" cy="16" r="9" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4,2" />
      <line x1="11" y1="4" x2="11" y2="28" />
      <line x1="21" y1="4" x2="21" y2="28" />
      <rect x="13.5" y="13.5" width="5" height="5" fill="#f59e0b" stroke="#f59e0b" />
      <text x="16" y="17.5" font-size="4.5" font-weight="bold" fill="#0f172a" text-anchor="middle">T</text>
      <text x="16" y="29" font-size="5" font-weight="bold" fill="#38bdf8" text-anchor="middle">ΔI</text>
    </svg>`,

  rcd_4p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.2">
      <ellipse cx="16" cy="16" rx="13" ry="8" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4,2" />
      <line x1="6" y1="4" x2="6" y2="28" />
      <line x1="12" y1="4" x2="12" y2="28" />
      <line x1="18" y1="4" x2="18" y2="28" />
      <line x1="24" y1="4" x2="24" y2="28" />
      <rect x="14" y="13.5" width="4" height="4" fill="#f59e0b" />
      <text x="16" y="16.8" font-size="3.5" font-weight="bold" fill="#0f172a" text-anchor="middle">T</text>
      <text x="16" y="29" font-size="5" font-weight="bold" fill="#38bdf8" text-anchor="middle">ΔI 4P</text>
    </svg>`,

  fuse_I: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="3" x2="16" y2="8" />
      <line x1="16" y1="24" x2="16" y2="29" />
      <rect x="11" y="8" width="10" height="16" rx="2" stroke="#e2e8f0" />
      <line x1="16" y1="8" x2="16" y2="24" stroke="#38bdf8" stroke-width="1.4" />
      <text x="25" y="18" font-size="5" font-weight="bold" fill="#f59e0b" text-anchor="middle">F</text>
    </svg>`,

  // CONTACTORES DE POTENCIA
  contactor_1p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="12" />
      <path d="M16,12 A2.5,2.5 0 0,1 16,7" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="11" y2="12" />
    </svg>`,

  contactor_2p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="11" y1="4" x2="11" y2="12" />
      <path d="M11,12 A2,2 0 0,1 11,8" />
      <line x1="11" y1="21" x2="11" y2="28" />
      <line x1="11" y1="21" x2="7" y2="12" />
      <line x1="21" y1="4" x2="21" y2="12" />
      <path d="M21,12 A2,2 0 0,1 21,8" />
      <line x1="21" y1="21" x2="21" y2="28" />
      <line x1="21" y1="21" x2="17" y2="12" />
      <line x1="11" y1="16" x2="21" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
    </svg>`,

  contactor_3p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.3">
      <line x1="7" y1="4" x2="7" y2="12" />
      <path d="M7,12 A1.8,1.8 0 0,1 7,8" />
      <line x1="7" y1="21" x2="7" y2="28" />
      <line x1="7" y1="21" x2="3.5" y2="12" />
      <line x1="16" y1="4" x2="16" y2="12" />
      <path d="M16,12 A1.8,1.8 0 0,1 16,8" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="12.5" y2="12" />
      <line x1="25" y1="4" x2="25" y2="12" />
      <path d="M25,12 A1.8,1.8 0 0,1 25,8" />
      <line x1="25" y1="21" x2="25" y2="28" />
      <line x1="25" y1="21" x2="21.5" y2="12" />
      <line x1="7" y1="16" x2="25" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
    </svg>`,

  contactor_4p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.2">
      <line x1="5" y1="5" x2="5" y2="12" />
      <path d="M5,12 A1.5,1.5 0 0,1 5,8" />
      <line x1="5" y1="21" x2="5" y2="27" />
      <line x1="5" y1="21" x2="2" y2="12" />
      <line x1="12" y1="5" x2="12" y2="12" />
      <path d="M12,12 A1.5,1.5 0 0,1 12,8" />
      <line x1="12" y1="21" x2="12" y2="27" />
      <line x1="12" y1="21" x2="9" y2="12" />
      <line x1="19" y1="5" x2="19" y2="12" />
      <path d="M19,12 A1.5,1.5 0 0,1 19,8" />
      <line x1="19" y1="21" x2="19" y2="27" />
      <line x1="19" y1="21" x2="16" y2="12" />
      <line x1="26" y1="5" x2="26" y2="12" />
      <path d="M26,12 A1.5,1.5 0 0,1 26,8" />
      <line x1="26" y1="21" x2="26" y2="27" />
      <line x1="26" y1="21" x2="23" y2="12" />
      <line x1="5" y1="16" x2="26" y2="16" stroke-dasharray="1.5,1" stroke="#94a3b8" />
    </svg>`,

  // MOTORES ELÉCTRICOS
  motor_3p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="16" cy="18" r="9" stroke="#1e293b" stroke-width="1.8" fill="#ffffff" />
      <circle cx="16" cy="18" r="5.5" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2" />
      <text x="16" y="17" font-size="7" font-weight="bold" fill="#0f172a" text-anchor="middle">M</text>
      <text x="14" y="23" font-size="5" font-weight="bold" fill="#0f172a" text-anchor="middle">3~</text>
      <line x1="10" y1="4" x2="10" y2="10" stroke="#1e293b" stroke-width="1.4" />
      <line x1="16" y1="4" x2="16" y2="9" stroke="#1e293b" stroke-width="1.4" />
      <line x1="22" y1="4" x2="22" y2="10" stroke="#1e293b" stroke-width="1.4" />
      <line x1="26" y1="4" x2="26" y2="18" stroke="#16a34a" stroke-width="1.2" />
      <line x1="26" y1="18" x2="25" y2="18" stroke="#16a34a" stroke-width="1.2" />
    </svg>`,

  motor_3p_star_delta: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="16" cy="16" r="8" stroke="#1e293b" stroke-width="1.8" fill="#ffffff" />
      <text x="16" y="15" font-size="6.5" font-weight="bold" fill="#0f172a" text-anchor="middle">M</text>
      <text x="14" y="20.5" font-size="4.5" font-weight="bold" fill="#0f172a" text-anchor="middle">3~</text>
      <line x1="11" y1="3" x2="11" y2="9" stroke="#1e293b" stroke-width="1.2" />
      <line x1="16" y1="3" x2="16" y2="8" stroke="#1e293b" stroke-width="1.2" />
      <line x1="21" y1="3" x2="21" y2="9" stroke="#1e293b" stroke-width="1.2" />
      <line x1="26" y1="3" x2="26" y2="16" stroke="#16a34a" stroke-width="1.2" />
      <line x1="11" y1="23" x2="11" y2="29" stroke="#1e293b" stroke-width="1.2" />
      <line x1="16" y1="24" x2="16" y2="29" stroke="#1e293b" stroke-width="1.2" />
      <line x1="21" y1="23" x2="21" y2="29" stroke="#1e293b" stroke-width="1.2" />
    </svg>`,

  motor_1p: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="14" cy="18" r="9" stroke="#1e293b" stroke-width="1.8" fill="#ffffff" />
      <circle cx="14" cy="18" r="5.5" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2" />
      <text x="14" y="17" font-size="7" font-weight="bold" fill="#0f172a" text-anchor="middle">M</text>
      <text x="12" y="23" font-size="5" font-weight="bold" fill="#0f172a" text-anchor="middle">1~</text>
      <line x1="10" y1="4" x2="10" y2="10" stroke="#1e293b" stroke-width="1.4" />
      <line x1="18" y1="4" x2="18" y2="10" stroke="#1e293b" stroke-width="1.4" />
      <line x1="26" y1="4" x2="26" y2="18" stroke="#16a34a" stroke-width="1.2" />
      <line x1="26" y1="18" x2="23" y2="18" stroke="#16a34a" stroke-width="1.2" />
    </svg>`,

  motor_1p_4w: `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor">
      <circle cx="14" cy="16" r="8" stroke="#1e293b" stroke-width="1.8" fill="#ffffff" />
      <text x="14" y="15" font-size="6.5" font-weight="bold" fill="#0f172a" text-anchor="middle">M</text>
      <text x="12" y="20.5" font-size="4.5" font-weight="bold" fill="#0f172a" text-anchor="middle">1~</text>
      <line x1="10" y1="3" x2="10" y2="9" stroke="#1e293b" stroke-width="1.2" />
      <line x1="18" y1="3" x2="18" y2="9" stroke="#1e293b" stroke-width="1.2" />
      <line x1="26" y1="3" x2="26" y2="16" stroke="#16a34a" stroke-width="1.2" />
      <line x1="10" y1="23" x2="10" y2="29" stroke="#1e293b" stroke-width="1.2" />
      <line x1="18" y1="23" x2="18" y2="29" stroke="#1e293b" stroke-width="1.2" />
    </svg>`,

  // BOBINAS
  coil: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="3" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="29" />
      <rect x="7" y="11" width="18" height="10" stroke="#e2e8f0" fill="#1e293b" />
      <text x="16" y="18.5" font-size="6" font-weight="bold" fill="#f8fafc" text-anchor="middle">KM</text>
    </svg>`,

  bistable_coil: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.6">
      <line x1="10" y1="3" x2="10" y2="11" />
      <line x1="22" y1="3" x2="22" y2="11" />
      <line x1="16" y1="21" x2="16" y2="29" />
      <rect x="7" y="11" width="18" height="10" stroke="#e2e8f0" fill="#1e293b" />
      <line x1="10" y1="21" x2="13" y2="11" stroke="#38bdf8" />
      <line x1="19" y1="11" x2="22" y2="21" stroke="#38bdf8" />
      <text x="10" y="9" font-size="4" fill="#38bdf8">S</text>
      <text x="22" y="9" font-size="4" fill="#38bdf8">R</text>
    </svg>`,

  step_relay: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.6">
      <line x1="16" y1="3" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="29" />
      <rect x="7" y="11" width="18" height="10" stroke="#e2e8f0" fill="#1e293b" />
      <line x1="11" y1="21" x2="11" y2="11" stroke="#f59e0b" />
      <line x1="11" y1="11" x2="16" y2="11" stroke="#f59e0b" />
      <line x1="16" y1="11" x2="16" y2="16" stroke="#f59e0b" />
      <line x1="16" y1="16" x2="21" y2="16" stroke="#f59e0b" />
      <line x1="21" y1="16" x2="21" y2="21" stroke="#f59e0b" />
    </svg>`,

  connection_timer: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.6">
      <line x1="16" y1="3" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="29" />
      <rect x="7" y="11" width="18" height="10" stroke="#e2e8f0" fill="#1e293b" />
      <line x1="7" y1="11" x2="13" y2="21" stroke="#38bdf8" />
      <line x1="7" y1="21" x2="13" y2="11" stroke="#38bdf8" />
      <line x1="13" y1="11" x2="13" y2="21" stroke="#38bdf8" />
      <text x="19" y="18" font-size="4.5" font-weight="bold" fill="#38bdf8" text-anchor="middle">TON</text>
    </svg>`,

  disconnection_timer: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.6">
      <line x1="16" y1="3" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="29" />
      <rect x="7" y="11" width="18" height="10" stroke="#e2e8f0" fill="#1e293b" />
      <rect x="7" y="11" width="6" height="10" fill="#f59e0b" stroke="none" />
      <text x="19" y="18" font-size="4.5" font-weight="bold" fill="#f59e0b" text-anchor="middle">TOF</text>
    </svg>`,

  disconnect_connection_timer: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.6">
      <line x1="16" y1="3" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="29" />
      <rect x="7" y="11" width="18" height="10" stroke="#e2e8f0" fill="#1e293b" />
      <rect x="10" y="11" width="3" height="10" fill="#f59e0b" stroke="none" />
      <line x1="7" y1="11" x2="10" y2="21" stroke="#38bdf8" />
      <line x1="7" y1="21" x2="10" y2="11" stroke="#38bdf8" />
      <text x="19" y="18" font-size="4" font-weight="bold" fill="#38bdf8" text-anchor="middle">TON/F</text>
    </svg>`,

  timer: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.6">
      <line x1="16" y1="3" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="29" />
      <rect x="7" y="11" width="18" height="10" stroke="#e2e8f0" fill="#1e293b" />
      <circle cx="16" cy="16" r="3.5" stroke="#38bdf8" stroke-width="1.2" />
      <polyline points="16,14 16,16 17.5,16" stroke="#38bdf8" stroke-width="1.2" />
    </svg>`,

  // CONTACTOS AUXILIARES
  contact_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="10" y2="11" />
      <text x="19" y="10" font-size="6" fill="#94a3b8">13</text>
      <text x="19" y="27" font-size="6" fill="#94a3b8">14</text>
    </svg>`,

  contact_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="11" x2="22" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="21" y2="9" />
      <text x="8" y="10" font-size="6" fill="#94a3b8">11</text>
      <text x="8" y="27" font-size="6" fill="#94a3b8">12</text>
    </svg>`,

  contact_no_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="10" y1="4" x2="10" y2="11" />
      <line x1="10" y1="21" x2="10" y2="28" />
      <line x1="10" y1="21" x2="5" y2="11" />
      <line x1="22" y1="4" x2="22" y2="11" />
      <line x1="22" y1="11" x2="27" y2="11" />
      <line x1="22" y1="21" x2="22" y2="28" />
      <line x1="22" y1="21" x2="26" y2="9" />
      <line x1="10" y1="16" x2="22" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
    </svg>`,

  contact_changeover: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.6">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="10" y1="21" x2="10" y2="28" />
      <line x1="10" y1="21" x2="14" y2="21" />
      <line x1="22" y1="21" x2="22" y2="28" />
      <line x1="22" y1="21" x2="18" y2="21" />
      <line x1="16" y1="11" x2="12" y2="21" />
    </svg>`,

  // CONTACTOS TEMPORIZADOS (TON, TOF, TON/TOF)
  ondelay_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="18" y1="4" x2="18" y2="11" />
      <line x1="18" y1="21" x2="18" y2="28" />
      <line x1="18" y1="21" x2="12" y2="11" />
      <!-- Paracaídas a la conexión hacia la izquierda -->
      <path d="M12,18 C9,18 7,16 7,14 C7,12 9,10 12,10" stroke="#38bdf8" stroke-width="1.5" />
      <text x="21" y="10" font-size="5.5" fill="#94a3b8">67</text>
      <text x="21" y="27" font-size="5.5" fill="#94a3b8">68</text>
    </svg>`,

  ondelay_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="18" y1="4" x2="18" y2="11" />
      <line x1="18" y1="11" x2="24" y2="11" />
      <line x1="18" y1="21" x2="18" y2="28" />
      <line x1="18" y1="21" x2="23" y2="9" />
      <!-- Paracaídas a la conexión hacia la izquierda -->
      <path d="M14,18 C11,18 9,16 9,14 C9,12 11,10 14,10" stroke="#38bdf8" stroke-width="1.5" />
      <text x="6" y="10" font-size="5.5" fill="#94a3b8">55</text>
      <text x="6" y="27" font-size="5.5" fill="#94a3b8">56</text>
    </svg>`,

  offdelay_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="18" y1="4" x2="18" y2="11" />
      <line x1="18" y1="21" x2="18" y2="28" />
      <line x1="18" y1="21" x2="12" y2="11" />
      <!-- Paracaídas a la desconexión hacia la derecha -->
      <path d="M8,18 C11,18 13,16 13,14 C13,12 11,10 8,10" stroke="#f59e0b" stroke-width="1.5" />
      <text x="21" y="10" font-size="5.5" fill="#94a3b8">67</text>
      <text x="21" y="27" font-size="5.5" fill="#94a3b8">68</text>
    </svg>`,

  offdelay_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="18" y1="4" x2="18" y2="11" />
      <line x1="18" y1="11" x2="24" y2="11" />
      <line x1="18" y1="21" x2="18" y2="28" />
      <line x1="18" y1="21" x2="23" y2="9" />
      <!-- Paracaídas a la desconexión hacia la derecha -->
      <path d="M10,18 C13,18 15,16 15,14 C15,12 13,10 10,10" stroke="#f59e0b" stroke-width="1.5" />
      <text x="6" y="10" font-size="5.5" fill="#94a3b8">55</text>
      <text x="6" y="27" font-size="5.5" fill="#94a3b8">56</text>
    </svg>`,

  on_offdelay_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="18" y1="4" x2="18" y2="11" />
      <line x1="18" y1="21" x2="18" y2="28" />
      <line x1="18" y1="21" x2="12" y2="11" />
      <!-- Doble paracaídas Conexión / Desconexión -->
      <path d="M13,18 C10,18 8,16 8,14 C8,12 10,10 13,10" stroke="#38bdf8" stroke-width="1.4" />
      <path d="M6,18 C9,18 11,16 11,14 C11,12 9,10 6,10" stroke="#f59e0b" stroke-width="1.4" />
      <text x="21" y="10" font-size="5.5" fill="#94a3b8">67</text>
      <text x="21" y="27" font-size="5.5" fill="#94a3b8">68</text>
    </svg>`,

  on_offdelay_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="18" y1="4" x2="18" y2="11" />
      <line x1="18" y1="11" x2="24" y2="11" />
      <line x1="18" y1="21" x2="18" y2="28" />
      <line x1="18" y1="21" x2="23" y2="9" />
      <!-- Doble paracaídas Conexión / Desconexión -->
      <path d="M15,18 C12,18 10,16 10,14 C10,12 12,10 15,10" stroke="#38bdf8" stroke-width="1.4" />
      <path d="M8,18 C11,18 13,16 13,14 C13,12 11,10 8,10" stroke="#f59e0b" stroke-width="1.4" />
      <text x="6" y="10" font-size="5.5" fill="#94a3b8">55</text>
      <text x="6" y="27" font-size="5.5" fill="#94a3b8">56</text>
    </svg>`,

  thermal_contact_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="11" x2="22" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="21" y2="9" />
      <!-- Tirador omega cuadrada horizontal de relé térmico (lados iguales = 4.5px) -->
      <line x1="18" y1="16" x2="14" y2="16" stroke-dasharray="1.5,1.5" stroke="#94a3b8" stroke-width="1.2" />
      <path d="M14,16 L14,11.5 L9.5,11.5 L9.5,16 L6.5,16" stroke="#f59e0b" stroke-width="1.4" />
      <text x="6" y="9" font-size="5" fill="#f59e0b">95</text>
      <text x="6" y="27" font-size="5" fill="#f59e0b">96</text>
    </svg>`,

  thermal_contact_no: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="4" x2="16" y2="11" />
      <line x1="16" y1="21" x2="16" y2="28" />
      <line x1="16" y1="21" x2="10" y2="11" />
      <!-- Tirador omega cuadrada horizontal de relé térmico (lados iguales = 4.5px) -->
      <line x1="13" y1="16" x2="11" y2="16" stroke-dasharray="1.5,1.5" stroke="#94a3b8" stroke-width="1.2" />
      <path d="M11,16 L11,11.5 L6.5,11.5 L6.5,16 L3.5,16" stroke="#f59e0b" stroke-width="1.4" />
      <text x="20" y="9" font-size="5" fill="#f59e0b">97</text>
      <text x="20" y="27" font-size="5" fill="#f59e0b">98</text>
    </svg>`,

  thermal_contact_no_nc: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.5">
      <line x1="12" y1="4" x2="12" y2="11" />
      <line x1="12" y1="11" x2="16" y2="11" />
      <line x1="12" y1="21" x2="12" y2="28" />
      <line x1="12" y1="21" x2="15.5" y2="9" />
      <line x1="24" y1="4" x2="24" y2="11" />
      <line x1="24" y1="21" x2="24" y2="28" />
      <line x1="24" y1="21" x2="19" y2="11" />
      <!-- Enlace mecánico que sobresale a la izquierda con omega cuadrada -->
      <line x1="7" y1="16" x2="24" y2="16" stroke-dasharray="2,1" stroke="#94a3b8" />
      <path d="M7,16 L7,11.5 L2.5,11.5 L2.5,16" stroke="#f59e0b" stroke-width="1.4" />
      <text x="7" y="9" font-size="4" fill="#f59e0b">95</text>
      <text x="27" y="9" font-size="4" fill="#f59e0b">97</text>
    </svg>`,


  // SEÑALIZACIÓN
  pilot_light: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8">
      <line x1="16" y1="3" x2="16" y2="9" />
      <line x1="16" y1="23" x2="16" y2="29" />
      <circle cx="16" cy="16" r="7" stroke="#22c55e" stroke-width="2" />
      <line x1="11" y1="11" x2="21" y2="21" stroke="#22c55e" stroke-width="1.6" />
      <line x1="11" y1="21" x2="21" y2="11" stroke="#22c55e" stroke-width="1.6" />
    </svg>`,

  buzzer: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.6">
      <line x1="10" y1="4" x2="10" y2="13" />
      <line x1="10" y1="13" x2="18" y2="13" />
      <line x1="18" y1="19" x2="10" y2="19" />
      <line x1="10" y1="19" x2="10" y2="28" />
      <path d="M 23 10 A 6 6 0 0 0 23 22 Z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5" />
    </svg>`,

  ring: `
    <svg viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.6">
      <line x1="10" y1="4" x2="10" y2="13" />
      <line x1="10" y1="13" x2="16" y2="13" />
      <line x1="16" y1="19" x2="10" y2="19" />
      <line x1="10" y1="19" x2="10" y2="28" />
      <path d="M 16 10 A 6 6 0 0 1 16 22 Z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5" />
    </svg>`,

  junction: `
    <svg viewBox="0 0 32 32" fill="none">
      <line x1="16" y1="4" x2="16" y2="28" stroke="#94a3b8" stroke-width="2" />
      <line x1="4" y1="16" x2="28" y2="16" stroke="#94a3b8" stroke-width="2" />
      <circle cx="16" cy="16" r="5" fill="#f8fafc" stroke="#0284c7" stroke-width="2" />
      <circle cx="16" cy="16" r="3" fill="#0284c7" />
    </svg>`,

  wire_3phase: `
    <svg viewBox="0 0 32 32" fill="none">
      <line x1="3" y1="8" x2="29" y2="8" stroke="#854d0e" stroke-width="2.5" stroke-linecap="round" />
      <line x1="3" y1="15" x2="29" y2="15" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
      <line x1="3" y1="22" x2="29" y2="22" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="7" cy="8" r="2.2" fill="#854d0e" />
      <circle cx="7" cy="15" r="2.2" fill="#0f172a" />
      <circle cx="7" cy="22" r="2.2" fill="#dc2626" />
      <text x="21" y="29" font-size="7" font-weight="bold" fill="#3b82f6" text-anchor="middle">3F</text>
    </svg>`,

  wire_phase_l1: `
    <svg viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="#854d0e" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="#854d0e" />
      <text x="16" y="27" font-size="7" font-weight="bold" fill="#854d0e" text-anchor="middle">L1</text>
    </svg>`,

  wire_phase_l2: `
    <svg viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="#0f172a" />
      <text x="16" y="27" font-size="7" font-weight="bold" fill="#94a3b8" text-anchor="middle">L2</text>
    </svg>`,

  wire_phase_l3: `
    <svg viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="#dc2626" />
      <text x="16" y="27" font-size="7" font-weight="bold" fill="#dc2626" text-anchor="middle">L3</text>
    </svg>`,

  wire_neutral: `
    <svg viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="#0284c7" />
      <text x="16" y="27" font-size="7" font-weight="bold" fill="#0284c7" text-anchor="middle">Neutro</text>
    </svg>`,

  wire_pe: `
    <svg viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="4,2" />
      <circle cx="16" cy="16" r="3.5" fill="#16a34a" />
      <text x="16" y="27" font-size="7" font-weight="bold" fill="#16a34a" text-anchor="middle">PE</text>
    </svg>`,

  wire_dc_pos: `
    <svg viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="#dc2626" />
      <text x="16" y="27" font-size="8" font-weight="bold" fill="#dc2626" text-anchor="middle">+</text>
    </svg>`,

  wire_dc_neg: `
    <svg viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="#1e3a8a" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="#1e3a8a" />
      <text x="16" y="27" font-size="8" font-weight="bold" fill="#1e3a8a" text-anchor="middle">-</text>
    </svg>`,
};
