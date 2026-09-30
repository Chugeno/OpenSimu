import type { ComponentDefinition, CircuitComponent, Rect } from './types';

export const COMPONENT_DEFINITIONS: Record<string, ComponentDefinition> = {
  // ALIMENTACIONES
  source_l: {
    type: 'source_l',
    category: 'power',
    name: 'Alimentación Fase (L)',
    defaultTag: 'L',
    width: 20,
    height: 20,
    terminals: [{ id: 'L', name: 'L', relX: 0, relY: 0 }],
  },
  source_n: {
    type: 'source_n',
    category: 'power',
    name: 'Alimentación Neutro (N)',
    defaultTag: 'N',
    width: 20,
    height: 20,
    terminals: [{ id: 'N', name: 'N', relX: 0, relY: 0 }],
  },
  source_pe: {
    type: 'source_pe',
    category: 'power',
    name: 'Conductor Protección (PE)',
    defaultTag: 'PE',
    width: 20,
    height: 20,
    terminals: [{ id: 'PE', name: 'PE', relX: 0, relY: 0 }],
  },
  source_dc_pos: {
    type: 'source_dc_pos',
    category: 'power',
    name: 'Positivo CC (+)',
    defaultTag: '+',
    width: 20,
    height: 20,
    terminals: [{ id: '+', name: '+', relX: 0, relY: 0 }],
  },
  source_dc_neg: {
    type: 'source_dc_neg',
    category: 'power',
    name: 'Negativo CC (-)',
    defaultTag: '-',
    width: 20,
    height: 20,
    terminals: [{ id: '-', name: '-', relX: 0, relY: 0 }],
  },
  power_l_n: {
    type: 'power_l_n',
    category: 'power',
    name: 'Alimentación L + N',
    defaultTag: '-X',
    width: 60,
    height: 20,
    terminals: [
      { id: 'L', name: 'L', relX: 0, relY: 0 },
      { id: 'N', name: 'N', relX: 40, relY: 0 },
    ],
  },
  power_l_n_pe: {
    type: 'power_l_n_pe',
    category: 'power',
    name: 'Alimentación L + N + PE',
    defaultTag: '-X',
    width: 100,
    height: 20,
    terminals: [
      { id: 'L', name: 'L', relX: 0, relY: 0 },
      { id: 'N', name: 'N', relX: 40, relY: 0 },
      { id: 'PE', name: 'PE', relX: 80, relY: 0 },
    ],
  },
  power_3p: {
    type: 'power_3p',
    category: 'power',
    name: 'Trifásica (L1 + L2 + L3)',
    defaultTag: '-X',
    width: 100,
    height: 20,
    terminals: [
      { id: 'L1', name: 'L1', relX: 0, relY: 0 },
      { id: 'L2', name: 'L2', relX: 40, relY: 0 },
      { id: 'L3', name: 'L3', relX: 80, relY: 0 },
    ],
  },
  power_3p_pe: {
    type: 'power_3p_pe',
    category: 'power',
    name: 'Trifásica + PE (L1-L2-L3-PE)',
    defaultTag: '-X',
    width: 140,
    height: 20,
    terminals: [
      { id: 'L1', name: 'L1', relX: 0, relY: 0 },
      { id: 'L2', name: 'L2', relX: 40, relY: 0 },
      { id: 'L3', name: 'L3', relX: 80, relY: 0 },
      { id: 'PE', name: 'PE', relX: 120, relY: 0 },
    ],
  },
  power_3p_n: {
    type: 'power_3p_n',
    category: 'power',
    name: 'Trifásica + N (L1-L2-L3-N)',
    defaultTag: '-X',
    width: 140,
    height: 20,
    terminals: [
      { id: 'L1', name: 'L1', relX: 0, relY: 0 },
      { id: 'L2', name: 'L2', relX: 40, relY: 0 },
      { id: 'L3', name: 'L3', relX: 80, relY: 0 },
      { id: 'N', name: 'N', relX: 120, relY: 0 },
    ],
  },
  power_3p_n_pe: {
    type: 'power_3p_n_pe',
    category: 'power',
    name: 'Trifásica + N + PE (L1-L2-L3-N-PE)',
    defaultTag: '-X',
    width: 180,
    height: 20,
    terminals: [
      { id: 'L1', name: 'L1', relX: 0, relY: 0 },
      { id: 'L2', name: 'L2', relX: 40, relY: 0 },
      { id: 'L3', name: 'L3', relX: 80, relY: 0 },
      { id: 'N', name: 'N', relX: 120, relY: 0 },
      { id: 'PE', name: 'PE', relX: 160, relY: 0 },
    ],
  },
  power_dc: {
    type: 'power_dc',
    category: 'power',
    name: 'Continua CC (+ y -)',
    defaultTag: '-X',
    width: 60,
    height: 20,
    terminals: [
      { id: '+', name: '+', relX: 0, relY: 0 },
      { id: '-', name: '-', relX: 40, relY: 0 },
    ],
  },
  transformer: {
    type: 'transformer',
    category: 'power',
    name: 'Transformador Monofásico (1-2 / 3-4)',
    defaultTag: '-T',
    width: 68,
    height: 100,
    manualAction: 'none',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 60, relY: 0 },
      { id: '3', name: '3', relX: 0, relY: 100 },
      { id: '4', name: '4', relX: 60, relY: 100 },
    ],
  },
  transformer_III: {
    type: 'transformer_III',
    category: 'power',
    name: 'Transformador Trifásico (1-2-3 / 4-5-6)',
    defaultTag: '-T',
    width: 92,
    height: 100,
    manualAction: 'none',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 40, relY: 0 },
      { id: '3', name: '3', relX: 80, relY: 0 },
      { id: '4', name: '4', relX: 0, relY: 100 },
      { id: '5', name: '5', relX: 40, relY: 100 },
      { id: '6', name: '6', relX: 80, relY: 100 },
    ],
  },
  ground: {
    type: 'ground',
    category: 'power',
    name: 'Puesta a Tierra',
    defaultTag: 'PE',
    width: 20,
    height: 20,
    terminals: [{ id: 'PE', name: 'PE', relX: 0, relY: 0 }],
  },

  // PROTECCIONES (TERMOMAGNÉTICAS, GUARDAMOTOR, DIFERENCIAL, RELÉ TÉRMICO, DESCARGADORES)
  // Grupo 1: Termomagnéticas (MCB)
  mcb_1p: {
    type: 'mcb_1p',
    category: 'protections',
    name: 'Termomagnética 1P',
    defaultTag: '-Q',
    width: 30,
    height: 60,
    poles: 1,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
    ],
  },
  mcb_1p_n: {
    type: 'mcb_1p_n',
    category: 'protections',
    name: 'Termomagnética 1P+N',
    defaultTag: '-Q',
    width: 60,
    height: 60,
    poles: 2,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: 'N', name: 'N', relX: 40, relY: 0 },
      { id: 'N2', name: 'N', relX: 40, relY: 60 },
    ],
  },
  mcb_2p: {
    type: 'mcb_2p',
    category: 'protections',
    name: 'Termomagnética 2P',
    defaultTag: '-Q',
    width: 60,
    height: 60,
    poles: 2,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
    ],
  },
  mcb_3p: {
    type: 'mcb_3p',
    category: 'protections',
    name: 'Termomagnética 3P',
    defaultTag: '-Q',
    width: 100,
    height: 60,
    poles: 3,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
      { id: '5', name: '5', relX: 80, relY: 0 },
      { id: '6', name: '6', relX: 80, relY: 60 },
    ],
  },
  mcb_4p: {
    type: 'mcb_4p',
    category: 'protections',
    name: 'Termomagnética 4P',
    defaultTag: '-Q',
    width: 140,
    height: 60,
    poles: 4,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
      { id: '5', name: '5', relX: 80, relY: 0 },
      { id: '6', name: '6', relX: 80, relY: 60 },
      { id: 'N', name: 'N', relX: 120, relY: 0 },
      { id: 'N2', name: 'N', relX: 120, relY: 60 },
    ],
  },

  // Grupo 2: Guardamotores (1P+N, 2P, 3P, 4P)
  motor_breaker_1p_n: {
    type: 'motor_breaker_1p_n',
    category: 'protections',
    name: 'Guardamotor 1P+N',
    defaultTag: '-QM',
    width: 60,
    height: 80,
    poles: 2,
    manualAction: 'toggle',
    dividerBefore: true,
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 80 },
      { id: 'N', name: 'N', relX: 40, relY: 0 },
      { id: 'N2', name: 'N', relX: 40, relY: 80 },
    ],
  },
  motor_breaker_2p: {
    type: 'motor_breaker_2p',
    category: 'protections',
    name: 'Guardamotor 2P',
    defaultTag: '-QM',
    width: 60,
    height: 80,
    poles: 2,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 80 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 80 },
    ],
  },
  motor_breaker_3p: {
    type: 'motor_breaker_3p',
    category: 'protections',
    name: 'Guardamotor 3P',
    defaultTag: '-QM',
    width: 100,
    height: 80,
    poles: 3,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 80 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 80 },
      { id: '5', name: '5', relX: 80, relY: 0 },
      { id: '6', name: '6', relX: 80, relY: 80 },
    ],
  },
  motor_breaker_4p: {
    type: 'motor_breaker_4p',
    category: 'protections',
    name: 'Guardamotor 4P (3P+N)',
    defaultTag: '-QM',
    width: 140,
    height: 80,
    poles: 4,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 80 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 80 },
      { id: '5', name: '5', relX: 80, relY: 0 },
      { id: '6', name: '6', relX: 80, relY: 80 },
      { id: 'N', name: 'N', relX: 120, relY: 0 },
      { id: 'N2', name: 'N', relX: 120, relY: 80 },
    ],
  },
  // Obsoletos / ocultos de la paleta
  motor_breaker_1p: {
    type: 'motor_breaker_1p',
    category: 'protections',
    name: 'Guardamotor 1P',
    defaultTag: '-QM',
    width: 60,
    height: 80,
    poles: 1,
    manualAction: 'toggle',
    hidden: true,
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 80 },
    ],
  },
  motor_breaker_mag_3p: {
    type: 'motor_breaker_mag_3p',
    category: 'protections',
    name: 'Guardamotor Magnético 3P',
    defaultTag: '-QM',
    width: 100,
    height: 80,
    poles: 3,
    manualAction: 'toggle',
    hidden: true,
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 80 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 80 },
      { id: '5', name: '5', relX: 80, relY: 0 },
      { id: '6', name: '6', relX: 80, relY: 80 },
    ],
  },

  // Grupo 3: Diferenciales (RCD)
  rcd_2p: {
    type: 'rcd_2p',
    category: 'protections',
    name: 'Interruptor Diferencial 2P',
    defaultTag: '-Q',
    width: 60,
    height: 60,
    poles: 2,
    manualAction: 'toggle',
    dividerBefore: true,
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: 'N', name: 'N', relX: 40, relY: 0 },
      { id: 'N2', name: 'N', relX: 40, relY: 60 },
    ],
  },
  rcd_4p: {
    type: 'rcd_4p',
    category: 'protections',
    name: 'Interruptor Diferencial 4P',
    defaultTag: '-Q',
    width: 140,
    height: 60,
    poles: 4,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
      { id: '5', name: '5', relX: 80, relY: 0 },
      { id: '6', name: '6', relX: 80, relY: 60 },
      { id: 'N', name: 'N', relX: 120, relY: 0 },
      { id: 'N2', name: 'N', relX: 120, relY: 60 },
    ],
  },

  // Grupo 4: Relé Térmico de Fuerza
  thermal_relay_3p: {
    type: 'thermal_relay_3p',
    category: 'protections',
    name: 'Relé Térmico Bimetálico 3P (Fuerza)',
    defaultTag: '-F',
    width: 100,
    height: 60,
    poles: 3,
    manualAction: 'toggle',
    dividerBefore: true,
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
      { id: '5', name: '5', relX: 80, relY: 0 },
      { id: '6', name: '6', relX: 80, relY: 60 },
    ],
  },

  // Grupo 5: Descargadores de Sobretensión
  surge_arrester_1p_n: {
    type: 'surge_arrester_1p_n',
    category: 'protections',
    name: 'Limitador de Sobretensiones 1P+N',
    defaultTag: '-F',
    width: 60,
    height: 60,
    manualAction: 'none',
    dividerBefore: true,
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 40, relY: 0 },
      { id: 'PE', name: 'PE', relX: 20, relY: 60 },
    ],
  },
  surge_arrester_3p_n: {
    type: 'surge_arrester_3p_n',
    category: 'protections',
    name: 'Limitador de Sobretensiones 3P+N',
    defaultTag: '-F',
    width: 140,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 40, relY: 0 },
      { id: '3', name: '3', relX: 80, relY: 0 },
      { id: '4', name: '4', relX: 120, relY: 0 },
      { id: 'PE', name: 'PE', relX: 60, relY: 60 },
    ],
  },
  fuse_I: {
    type: 'fuse_I',
    category: 'protections',
    name: 'Fusible Seccionable Monopolar (1-2)',
    defaultTag: '-F',
    width: 40,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
    ],
  },

  // ACCIONAMIENTOS (MANDOS / PULSADORES)
  // 1. Pulsadores estándar
  pushbutton_no: {
    type: 'pushbutton_no',
    category: 'control',
    name: 'Pulsador NA (3-4)',
    defaultTag: '-S',
    width: 40,
    height: 60,
    manualAction: 'momentary',
    terminals: [
      { id: '3', name: '3', relX: 0, relY: 0 },
      { id: '4', name: '4', relX: 0, relY: 60 },
    ],
  },
  pushbutton_nc: {
    type: 'pushbutton_nc',
    category: 'control',
    name: 'Pulsador NC (1-2)',
    defaultTag: '-S',
    width: 40,
    height: 60,
    manualAction: 'momentary',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
    ],
  },
  pushbutton_no_nc: {
    type: 'pushbutton_no_nc',
    category: 'control',
    name: 'Pulsador Doble (NC 1-2 / NA 3-4)',
    defaultTag: '-S',
    width: 80,
    height: 60,
    manualAction: 'momentary',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
    ],
  },
  pushbutton_changeover: {
    type: 'pushbutton_changeover',
    category: 'control',
    name: 'Pulsador Conmutado (1-2-4)',
    defaultTag: '-S',
    width: 80,
    height: 60,
    manualAction: 'momentary',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: -20, relY: 60 },
      { id: '4', name: '4', relX: 20, relY: 60 },
    ],
  },

  // 2. Setas de emergencia
  pushbutton_emergency_nc: {
    type: 'pushbutton_emergency_nc',
    category: 'control',
    name: 'Seta de Emergencia NC (1-2)',
    defaultTag: '-S',
    width: 40,
    height: 60,
    manualAction: 'toggle',
    dividerBefore: true,
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
    ],
  },
  pushbutton_emergency_no: {
    type: 'pushbutton_emergency_no',
    category: 'control',
    name: 'Seta de Emergencia NA (3-4)',
    defaultTag: '-S',
    width: 40,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '3', name: '3', relX: 0, relY: 0 },
      { id: '4', name: '4', relX: 0, relY: 60 },
    ],
  },
  pushbutton_emergency_no_nc: {
    type: 'pushbutton_emergency_no_nc',
    category: 'control',
    name: 'Seta Emergencia Doble (NC 1-2 / NA 3-4)',
    defaultTag: '-S',
    width: 80,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
    ],
  },
  pushbutton_emergency_changeover: {
    type: 'pushbutton_emergency_changeover',
    category: 'control',
    name: 'Seta Emergencia Conmutada (1-2-4)',
    defaultTag: '-S',
    width: 80,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: -20, relY: 60 },
      { id: '4', name: '4', relX: 20, relY: 60 },
    ],
  },

  // 3. Interruptores / Selectores rotativos
  switch_no: {
    type: 'switch_no',
    category: 'control',
    name: 'Interruptor Selector NA (3-4)',
    defaultTag: '-S',
    width: 40,
    height: 60,
    manualAction: 'toggle',
    dividerBefore: true,
    terminals: [
      { id: '3', name: '3', relX: 0, relY: 0 },
      { id: '4', name: '4', relX: 0, relY: 60 },
    ],
  },
  switch_nc: {
    type: 'switch_nc',
    category: 'control',
    name: 'Interruptor Selector NC (1-2)',
    defaultTag: '-S',
    width: 40,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
    ],
  },
  switch_no_nc: {
    type: 'switch_no_nc',
    category: 'control',
    name: 'Interruptor Selector Doble (NC 1-2 / NA 3-4)',
    defaultTag: '-S',
    width: 60,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
    ],
  },
  switch_changeover: {
    type: 'switch_changeover',
    category: 'control',
    name: 'Interruptor Conmutado (1-2-4)',
    defaultTag: '-S',
    width: 60,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 20, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '4', name: '4', relX: 40, relY: 60 },
    ],
  },
  switch_I_0_II: {
    type: 'switch_I_0_II',
    category: 'control',
    name: 'Interruptor Selector I-0-II (1-2-4)',
    defaultTag: '-S',
    width: 60,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 20, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '4', name: '4', relX: 40, relY: 60 },
    ],
  },

  // 4. Finales de carrera
  limit_no: {
    type: 'limit_no',
    category: 'control',
    name: 'Final de Carrera NA (3-4)',
    defaultTag: '-S',
    width: 40,
    height: 60,
    manualAction: 'toggle',
    dividerBefore: true,
    terminals: [
      { id: '3', name: '3', relX: 0, relY: 0 },
      { id: '4', name: '4', relX: 0, relY: 60 },
    ],
  },
  limit_nc: {
    type: 'limit_nc',
    category: 'control',
    name: 'Final de Carrera NC (1-2)',
    defaultTag: '-S',
    width: 40,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
    ],
  },
  limit_no_nc: {
    type: 'limit_no_nc',
    category: 'control',
    name: 'Final de Carrera Doble (NC 1-2 / NA 3-4)',
    defaultTag: '-S',
    width: 80,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
    ],
  },
  limit_changeover: {
    type: 'limit_changeover',
    category: 'control',
    name: 'Final de Carrera Conmutado (1-2-4)',
    defaultTag: '-S',
    width: 80,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: -20, relY: 60 },
      { id: '4', name: '4', relX: 20, relY: 60 },
    ],
  },

  // 5. Detectores / Sensores de proximidad
  inductive_detector_no: {
    type: 'inductive_detector_no',
    category: 'control',
    name: 'Detector Inductivo NA (A1-A2)',
    defaultTag: '-B',
    width: 52,
    height: 60,
    manualAction: 'toggle',
    dividerBefore: true,
    terminals: [
      { id: 'A1', name: 'A1', relX: 0, relY: 0 },
      { id: 'A2', name: 'A2', relX: 0, relY: 60 },
    ],
  },
  inductive_detector_nc: {
    type: 'inductive_detector_nc',
    category: 'control',
    name: 'Detector Inductivo NC (A1-A2)',
    defaultTag: '-B',
    width: 52,
    height: 60,
    manualAction: 'toggle',
    terminals: [
      { id: 'A1', name: 'A1', relX: 0, relY: 0 },
      { id: 'A2', name: 'A2', relX: 0, relY: 60 },
    ],
  },

  // BOBINAS DE CONTACTORES / RELÉS
  coil: {
    type: 'coil',
    category: 'coils',
    name: 'Bobina Contactor / Relé',
    defaultTag: '-K',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: 'A1', name: 'A1', relX: 0, relY: 0 },
      { id: 'A2', name: 'A2', relX: 0, relY: 60 },
    ],
  },
  bistable_coil: {
    type: 'bistable_coil',
    category: 'coils',
    name: 'Bobina Biestable (A1-B1-A2)',
    defaultTag: '-K',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: 'A1', name: 'A1', relX: 0, relY: 0 },
      { id: 'B1', name: 'B1', relX: 20, relY: 0 },
      { id: 'A2', name: 'A2', relX: 0, relY: 60 },
    ],
  },
  step_relay: {
    type: 'step_relay',
    category: 'coils',
    name: 'Relé de Pasos / Telerruptor (A1-A2)',
    defaultTag: '-K',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: 'A1', name: 'A1', relX: 0, relY: 0 },
      { id: 'A2', name: 'A2', relX: 0, relY: 60 },
    ],
  },
  connection_timer: {
    type: 'connection_timer',
    category: 'coils',
    name: 'Temporizador a la Conexión TON (A1-A2)',
    defaultTag: '-KM',
    width: 40,
    height: 60,
    manualAction: 'none',
    dividerBefore: true,
    terminals: [
      { id: 'A1', name: 'A1', relX: 0, relY: 0 },
      { id: 'A2', name: 'A2', relX: 0, relY: 60 },
    ],
  },
  disconnection_timer: {
    type: 'disconnection_timer',
    category: 'coils',
    name: 'Temporizador a la Desconexión TOF (A1-A2)',
    defaultTag: '-KM',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: 'A1', name: 'A1', relX: 0, relY: 0 },
      { id: 'A2', name: 'A2', relX: 0, relY: 60 },
    ],
  },
  disconnect_connection_timer: {
    type: 'disconnect_connection_timer',
    category: 'coils',
    name: 'Temporizador Conexión/Desconexión TON/TOF (A1-A2)',
    defaultTag: '-KM',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: 'A1', name: 'A1', relX: 0, relY: 0 },
      { id: 'A2', name: 'A2', relX: 0, relY: 60 },
    ],
  },
  timer: {
    type: 'timer',
    category: 'coils',
    name: 'Relé Programador / Reloj Horario (A1-A2)',
    defaultTag: '-KT',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: 'A1', name: 'A1', relX: 0, relY: 0 },
      { id: 'A2', name: 'A2', relX: 0, relY: 60 },
    ],
  },

  // CONTACTORES (POTENCIA 1P, 2P, 3P, 4P)
  contactor_1p: {
    type: 'contactor_1p',
    category: 'contactors',
    name: 'Contactor 1 Polo (1-2)',
    defaultTag: '-KM',
    width: 30,
    height: 60,
    poles: 1,
    manualAction: 'none',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
    ],
  },
  contactor_2p: {
    type: 'contactor_2p',
    category: 'contactors',
    name: 'Contactor 2 Polos (1-2, 3-4)',
    defaultTag: '-KM',
    width: 60,
    height: 60,
    poles: 2,
    manualAction: 'none',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
    ],
  },
  contactor_3p: {
    type: 'contactor_3p',
    category: 'contactors',
    name: 'Contactor 3 Polos (1-2, 3-4, 5-6)',
    defaultTag: '-KM',
    width: 100,
    height: 60,
    poles: 3,
    manualAction: 'none',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
      { id: '5', name: '5', relX: 80, relY: 0 },
      { id: '6', name: '6', relX: 80, relY: 60 },
    ],
  },
  contactor_4p: {
    type: 'contactor_4p',
    category: 'contactors',
    name: 'Contactor 4 Polos (1-2, 3-4, 5-6, 7-8)',
    defaultTag: '-KM',
    width: 140,
    height: 60,
    poles: 4,
    manualAction: 'none',
    terminals: [
      { id: '1', name: '1', relX: 0, relY: 0 },
      { id: '2', name: '2', relX: 0, relY: 60 },
      { id: '3', name: '3', relX: 40, relY: 0 },
      { id: '4', name: '4', relX: 40, relY: 60 },
      { id: '5', name: '5', relX: 80, relY: 0 },
      { id: '6', name: '6', relX: 80, relY: 60 },
      { id: '7', name: '7', relX: 120, relY: 0 },
      { id: '8', name: '8', relX: 120, relY: 60 },
    ],
  },

  // CONTACTOS AUXILIARES (NA, NC, NA-NC, COM-NA-NC)
  contact_no: {
    type: 'contact_no',
    category: 'contacts',
    name: 'Contacto Auxiliar NA (13-14)',
    defaultTag: '-K',
    width: 30,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '13', name: '13', relX: 0, relY: 0 },
      { id: '14', name: '14', relX: 0, relY: 60 },
    ],
  },
  contact_nc: {
    type: 'contact_nc',
    category: 'contacts',
    name: 'Contacto Auxiliar NC (11-12)',
    defaultTag: '-K',
    width: 30,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '11', name: '11', relX: 0, relY: 0 },
      { id: '12', name: '12', relX: 0, relY: 60 },
    ],
  },
  contact_no_nc: {
    type: 'contact_no_nc',
    category: 'contacts',
    name: 'Contacto Doble (NA + NC)',
    defaultTag: '-K',
    width: 60,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '13', name: '13', relX: 0, relY: 0 },
      { id: '14', name: '14', relX: 0, relY: 60 },
      { id: '21', name: '21', relX: 40, relY: 0 },
      { id: '22', name: '22', relX: 40, relY: 60 },
    ],
  },
  contact_changeover: {
    type: 'contact_changeover',
    category: 'contacts',
    name: 'Contacto Conmutado (11-12-14)',
    defaultTag: '-K',
    width: 60,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '11', name: '11', relX: 20, relY: 0 },
      { id: '12', name: '12', relX: 0, relY: 60 },
      { id: '14', name: '14', relX: 40, relY: 60 },
    ],
  },

  // CONTACTOS TEMPORIZADOS A LA CONEXIÓN (TON)
  ondelay_no: {
    type: 'ondelay_no',
    category: 'contacts',
    name: 'Contacto Temporizado a la Conexión NA (67-68)',
    defaultTag: '-KM',
    width: 40,
    height: 60,
    manualAction: 'none',
    dividerBefore: true,
    terminals: [
      { id: '67', name: '67', relX: 0, relY: 0 },
      { id: '68', name: '68', relX: 0, relY: 60 },
    ],
  },
  ondelay_nc: {
    type: 'ondelay_nc',
    category: 'contacts',
    name: 'Contacto Temporizado a la Conexión NC (55-56)',
    defaultTag: '-KM',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '55', name: '55', relX: 0, relY: 0 },
      { id: '56', name: '56', relX: 0, relY: 60 },
    ],
  },

  // CONTACTOS TEMPORIZADOS A LA DESCONEXIÓN (TOF)
  offdelay_no: {
    type: 'offdelay_no',
    category: 'contacts',
    name: 'Contacto Temporizado a la Desconexión NA (67-68)',
    defaultTag: '-KM',
    width: 40,
    height: 60,
    manualAction: 'none',
    dividerBefore: true,
    terminals: [
      { id: '67', name: '67', relX: 0, relY: 0 },
      { id: '68', name: '68', relX: 0, relY: 60 },
    ],
  },
  offdelay_nc: {
    type: 'offdelay_nc',
    category: 'contacts',
    name: 'Contacto Temporizado a la Desconexión NC (55-56)',
    defaultTag: '-KM',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '55', name: '55', relX: 0, relY: 0 },
      { id: '56', name: '56', relX: 0, relY: 60 },
    ],
  },

  // CONTACTOS TEMPORIZADOS CONEXIÓN / DESCONEXIÓN (TON / TOF)
  on_offdelay_no: {
    type: 'on_offdelay_no',
    category: 'contacts',
    name: 'Contacto Temporizado Conexión/Desconexión NA (67-68)',
    defaultTag: '-KM',
    width: 40,
    height: 60,
    manualAction: 'none',
    dividerBefore: true,
    terminals: [
      { id: '67', name: '67', relX: 0, relY: 0 },
      { id: '68', name: '68', relX: 0, relY: 60 },
    ],
  },
  on_offdelay_nc: {
    type: 'on_offdelay_nc',
    category: 'contacts',
    name: 'Contacto Temporizado Conexión/Desconexión NC (55-56)',
    defaultTag: '-KM',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '55', name: '55', relX: 0, relY: 0 },
      { id: '56', name: '56', relX: 0, relY: 60 },
    ],
  },

  // CONTACTOS DE RELÉ TÉRMICO
  thermal_contact_nc: {
    type: 'thermal_contact_nc',
    category: 'contacts',
    name: 'Contacto Térmico NC (95-96)',
    dividerBefore: true,
    defaultTag: '-F',
    width: 30,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '95', name: '95', relX: 0, relY: 0 },
      { id: '96', name: '96', relX: 0, relY: 60 },
    ],
  },
  thermal_contact_no: {
    type: 'thermal_contact_no',
    category: 'contacts',
    name: 'Contacto Térmico NA (97-98)',
    defaultTag: '-F',
    width: 30,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '97', name: '97', relX: 0, relY: 0 },
      { id: '98', name: '98', relX: 0, relY: 60 },
    ],
  },
  thermal_contact_no_nc: {
    type: 'thermal_contact_no_nc',
    category: 'contacts',
    name: 'Contacto Térmico Doble (95-96 / 97-98)',
    defaultTag: '-F',
    width: 60,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '95', name: '95', relX: 0, relY: 0 },
      { id: '96', name: '96', relX: 0, relY: 60 },
      { id: '97', name: '97', relX: 40, relY: 0 },
      { id: '98', name: '98', relX: 40, relY: 60 },
    ],
  },
  thermal_contact_changeover: {
    type: 'thermal_contact_changeover',
    category: 'contacts',
    name: 'Contacto Térmico Conmutado (95-96-98)',
    defaultTag: '-F',
    width: 60,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: '95', name: '95', relX: 20, relY: 0 },
      { id: '96', name: '96', relX: 0, relY: 60 },
      { id: '98', name: '98', relX: 40, relY: 60 },
    ],
  },

  // SEÑALIZACIÓN (PILOTOS)
  pilot_light: {
    type: 'pilot_light',
    category: 'signaling',
    name: 'Piloto Señalización (-H)',
    defaultTag: '-H',
    width: 40,
    height: 60,
    manualAction: 'none',
    terminals: [
      { id: 'X1', name: 'X1', relX: 0, relY: 0 },
      { id: 'X2', name: 'X2', relX: 0, relY: 60 },
    ],
  },

  // MOTORES ELÉCTRICOS (TRIFÁSICOS Y MONOFÁSICOS)
  motor_3p: {
    type: 'motor_3p',
    category: 'motors',
    name: 'Motor Trifásico (U1-V1-W1-PE)',
    defaultTag: '-M',
    width: 140,
    height: 100,
    manualAction: 'none',
    terminals: [
      { id: 'U1', name: 'U1', relX: 0, relY: 0 },
      { id: 'V1', name: 'V1', relX: 40, relY: 0 },
      { id: 'W1', name: 'W1', relX: 80, relY: 0 },
      { id: 'PE', name: 'PE', relX: 120, relY: 0 },
    ],
  },
  motor_3p_star_delta: {
    type: 'motor_3p_star_delta',
    category: 'motors',
    name: 'Motor Trifásico 6 Bornes (Estrella-Triángulo)',
    defaultTag: '-M',
    width: 140,
    height: 120,
    manualAction: 'none',
    terminals: [
      { id: 'U1', name: 'U1', relX: 0, relY: 0 },
      { id: 'V1', name: 'V1', relX: 40, relY: 0 },
      { id: 'W1', name: 'W1', relX: 80, relY: 0 },
      { id: 'PE', name: 'PE', relX: 120, relY: 0 },
      { id: 'W2', name: 'W2', relX: 0, relY: 120 },
      { id: 'U2', name: 'U2', relX: 40, relY: 120 },
      { id: 'V2', name: 'V2', relX: 80, relY: 120 },
    ],
  },
  motor_1p: {
    type: 'motor_1p',
    category: 'motors',
    name: 'Motor Monofásico (U1-V1-PE)',
    defaultTag: '-M',
    width: 100,
    height: 100,
    manualAction: 'none',
    terminals: [
      { id: 'U1', name: 'U1', relX: 0, relY: 0 },
      { id: 'V1', name: 'V1', relX: 40, relY: 0 },
      { id: 'PE', name: 'PE', relX: 80, relY: 0 },
    ],
  },
  motor_1p_4w: {
    type: 'motor_1p_4w',
    category: 'motors',
    name: 'Motor Monofásico 4 Hilos (U1-V1, U2-V2, PE)',
    defaultTag: '-M',
    width: 100,
    height: 120,
    manualAction: 'none',
    terminals: [
      { id: 'U1', name: 'U1', relX: 0, relY: 0 },
      { id: 'V1', name: 'V1', relX: 40, relY: 0 },
      { id: 'PE', name: 'PE', relX: 80, relY: 0 },
      { id: 'U2', name: 'U2', relX: 0, relY: 120 },
      { id: 'V2', name: 'V2', relX: 40, relY: 120 },
    ],
  },

  // ANOTACIONES Y SÍMBOLOS SVG EXTERNOS (MUESTRARIO)
  text_label: {
    type: 'text_label',
    category: 'signaling',
    name: 'Etiqueta de Texto',
    defaultTag: 'Texto',
    width: 200,
    height: 50,
    terminals: [],
  },
  svg_symbol: {
    type: 'svg_symbol',
    category: 'signaling',
    name: 'Símbolo SVG Externo',
    defaultTag: 'SVG',
    width: 80,
    height: 80,
    terminals: [],
  },
};

export function getComponentBounds(comp: CircuitComponent): Rect {
  if (comp.type === 'text_label' || comp.type === 'svg_symbol') {
    const w = comp.state.width || (comp.type === 'text_label' ? 220 : 90);
    const h = comp.state.height || (comp.type === 'text_label' ? 50 : 90);
    const extraH = comp.type === 'svg_symbol' ? 32 : 0;
    return {
      x: comp.x,
      y: comp.y,
      width: w,
      height: h + extraH,
    };
  }

  const def = COMPONENT_DEFINITIONS[comp.type];
  const terminals = comp.terminals && comp.terminals.length > 0
    ? comp.terminals
    : (def?.terminals || []);

  let minTX = 0;
  let maxTX = 0;
  let minTY = 0;
  let maxTY = 0;

  if (terminals.length > 0) {
    minTX = Math.min(...terminals.map((t) => t.relX));
    maxTX = Math.max(...terminals.map((t) => t.relX));
    minTY = Math.min(...terminals.map((t) => t.relY));
    maxTY = Math.max(...terminals.map((t) => t.relY));
    if (def?.height) {
      maxTY = Math.max(maxTY, def.height);
    }
  } else if (def) {
    maxTX = def.width - 20;
    maxTY = def.height;
  }

  const isPower = def?.category === 'power' || comp.type.startsWith('source_') || comp.type.startsWith('power_');
  const isGround = comp.type === 'ground';
  const hasPushbuttonHead = comp.type.startsWith('pushbutton_') || comp.type.startsWith('switch_');
  const isThermal = comp.type.startsWith('thermal_contact_');

  let padLeft = 44;
  let padRight = 20;
  let padTop = 10;
  let padBottom = 10;

  if (isGround) {
    padLeft = 14;
    padRight = 14;
    padTop = 6;
    padBottom = 24;
  } else if (isPower) {
    padLeft = 32;
    padRight = 20;
    padTop = 22;
    padBottom = 12;
  } else if (hasPushbuttonHead) {
    padLeft = 56;
  } else if (isThermal) {
    padLeft = 64;
  }

  // Extra padding if tag is longer than 3 characters (e.g. -KM1_AUX)
  const tagExtra = Math.max(0, (comp.tag?.length || 0) - 3) * 7;
  padLeft += tagExtra;

  // Ajuste simétrico para componentes rotados a 90° o 270° (horizontales)
  const isHorizontal = comp.rotation === 90 || comp.rotation === 270;
  if (isHorizontal) {
    padTop = Math.max(padTop, 20);
    padBottom = Math.max(padBottom, 20);
    padLeft = Math.max(padLeft, 20);
    padRight = Math.max(padRight, 20);
  }

  const relX = minTX - padLeft;
  const relY = minTY - padTop;
  const width = Math.max(36, (maxTX - minTX) + padLeft + padRight);
  const height = Math.max(36, (maxTY - minTY) + padTop + padBottom);

  return {
    x: comp.x + relX,
    y: comp.y + relY,
    width,
    height,
  };
}

/**
 * Transforma un punto local (x, y) según la rotación (0, 90, 180, 270) y espejado horizontal/vertical
 */
export function transformLocalPoint(
  point: { x: number; y: number },
  rotation: number = 0,
  mirrorH: boolean = false,
  mirrorV: boolean = false
): { x: number; y: number } {
  let x = point.x;
  let y = point.y;

  // Espejado en el sistema de coordenadas local
  if (mirrorH) x = -x;
  if (mirrorV) y = -y;

  // Rotación en pasos ortogonales de 90°
  const rot = ((rotation % 360) + 360) % 360;
  const rad = (rot * Math.PI) / 180;
  const cos = Math.round(Math.cos(rad));
  const sin = Math.round(Math.sin(rad));

  const rx = x * cos - y * sin;
  const ry = x * sin + y * cos;

  return { x: rx, y: ry };
}

/**
 * Actualiza las coordenadas relativas de los bornes (relX, relY) en base a su rotación y espejado
 */
export function updateComponentTerminals(comp: CircuitComponent): void {
  const def = COMPONENT_DEFINITIONS[comp.type];
  if (!def || !def.terminals || def.terminals.length === 0) return;

  const rot = comp.rotation || 0;
  const mH = Boolean(comp.mirrorH);
  const mV = Boolean(comp.mirrorV);

  comp.terminals.forEach((t, idx) => {
    const baseT = def.terminals[idx] || def.terminals.find((dt) => dt.id === t.id);
    if (baseT) {
      const transformed = transformLocalPoint({ x: baseT.relX, y: baseT.relY }, rot, mH, mV);
      t.relX = transformed.x;
      t.relY = transformed.y;
    }
  });
}
