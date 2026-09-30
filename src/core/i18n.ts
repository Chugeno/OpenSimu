export type SupportedLocale = 'es-AR' | 'es-ES' | 'en';

export interface LocaleMeta {
  code: SupportedLocale;
  name: string;
  flag: string;
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: 'es-AR', name: 'Español (Argentina)', flag: '🇦🇷' },
  { code: 'es-ES', name: 'Español (España - CADe_SIMU)', flag: '🇪🇸' },
  { code: 'en', name: 'English (US/UK)', flag: '🇬🇧' },
];

export const TRANSLATIONS: Record<SupportedLocale, Record<string, string>> = {
  'es-AR': {
    // App & Topbar
    'app.title': 'OpenSimu - Simulador Electrotécnico Libre',
    'app.badge': 'Fase 0 Core',
    'btn.edit': '✏️ Edición',
    'btn.edit.title': 'Modo Edición (Diseño de Esquema)',
    'btn.simulate': '▶️ Simular',
    'btn.simulate.title': 'Iniciar Simulación Eléctrica',
    'btn.stop': '⏹ Detener',
    'btn.stop.title': 'Detener Simulación',
    'btn.select': '👆 Seleccionar',
    'btn.select.title': 'Herramienta de Selección (V)',
    'btn.delete': '🗑️ Borrar',
    'btn.delete.title': 'Herramienta Borrar elemento',
    'btn.undo': '↩️ Deshacer',
    'btn.undo.title': 'Deshacer última acción (Ctrl+Z)',
    'btn.redo': '↪️ Rehacer',
    'btn.redo.title': 'Rehacer última acción (Ctrl+Y o Ctrl+Shift+Z)',
    'btn.demo': '🚀 Cargar Demo',
    'btn.demo.title': 'Cargar Circuito Demo de Marcha y Paro con Autoenclavamiento',
    'btn.clear': '🧹 Limpiar',
    'btn.clear.title': 'Limpiar todo el circuito',
    'btn.save': '💾 Guardar JSON',
    'btn.save.title': 'Guardar circuito como archivo JSON',
    'btn.export_cad': '📄 Exportar .CAD',
    'btn.export_cad.title': 'Exportar circuito en formato .CAD compatible con CADe_SIMU',
    'btn.load': '📂 Abrir',
    'btn.load.title': 'Cargar circuito (.json o .cad de CADe_SIMU)',
    'btn.zoom_reset': '🔍 1:1',
    'btn.zoom_reset.title': 'Centrar y restablecer zoom al 100%',

    // Categories
    'cat.power': '⚡ Alimentación',
    'cat.power.title': 'Alimentaciones CA, CC y Puesta a Tierra',
    'cat.protections': '🛡️ Protecciones',
    'cat.protections.title': 'Termomagnéticas, Guardamotores y Diferenciales',
    'cat.control': '🔘 Accionamientos',
    'cat.control.title': 'Pulsadores, Interruptores y Mandos',
    'cat.contactors': '⚡ Contactores',
    'cat.contactors.title': 'Contactores de Potencia / Fuerza (1P - 4P)',
    'cat.motors': '⚙️ Motores',
    'cat.motors.title': 'Motores Eléctricos Trifásicos y Monofásicos',
    'cat.coils': '🧲 Bobinas',
    'cat.coils.title': 'Bobinas de Contactores, Relés y Temporizadores',
    'cat.contacts': '🔌 Contactos Aux',
    'cat.contacts.title': 'Contactos Auxiliares (NA, NC, Dobles, Conmutados)',
    'cat.signaling': '💡 Señalización',
    'cat.signaling.title': 'Pilotos Luminosos y Avisadores Acústicos',
    'cat.cables': '〰️ Cables',
    'cat.cables.title': 'Cables, Fases, Neutro y Puntos de Conexión',

    // Component Names (Argentina)
    'comp.source_l': 'Alimentación Fase (L)',
    'comp.source_n': 'Alimentación Neutro (N)',
    'comp.source_pe': 'Conductor de Protección (PE)',
    'comp.source_dc_pos': 'Positivo CC (+)',
    'comp.source_dc_neg': 'Negativo CC (-)',
    'comp.power_l_n': 'Alimentación Línea + Neutro (L+N)',
    'comp.power_l_n_pe': 'Alimentación L + N + PE',
    'comp.power_3p': 'Alimentación Trifásica (L1 + L2 + L3)',
    'comp.power_3p_pe': 'Trifásica + PE (L1-L2-L3-PE)',
    'comp.power_3p_n': 'Trifásica + N (L1-L2-L3-N)',
    'comp.power_3p_n_pe': 'Trifásica + N + PE',
    'comp.power_dc': 'Fuente Continua CC (+ / -)',
    'comp.transformer': 'Transformador Monofásico (-T)',
    'comp.transformer_III': 'Transformador Trifásico (-T)',
    'comp.ground': 'Puesta a Tierra Física',

    // Protecciones (Vocabulario Argentino)
    'comp.mcb_1p': 'Termomagnética Unipolar 1P',
    'comp.mcb_1p_n': 'Termomagnética 1P+N',
    'comp.mcb_2p': 'Termomagnética Bipolar 2P',
    'comp.mcb_3p': 'Termomagnética Tripolar 3P',
    'comp.mcb_4p': 'Termomagnética Tetrapolar 4P',
    'comp.motor_breaker_1p': 'Guardamotor Unipolar 1P',
    'comp.motor_breaker_1p_n': 'Guardamotor 1P+N',
    'comp.motor_breaker_2p': 'Guardamotor Bipolar 2P',
    'comp.motor_breaker_3p': 'Guardamotor 3P (Protección Motor)',
    'comp.motor_breaker_4p': 'Guardamotor Tetrapolar 4P (3P+N)',
    'comp.rcd_2p': 'Interruptor Diferencial 2P (30mA)',
    'comp.rcd_4p': 'Interruptor Diferencial 4P (30mA)',
    'comp.thermal_relay_3p': 'Relevo Térmico 3P (Fuerza)',
    'comp.surge_arrester_1p_n': 'Descargador de Sobretensiones 1P+N',
    'comp.surge_arrester_3p_n': 'Descargador de Sobretensiones 3P+N',
    'comp.fuse_I': 'Fusible Seccionable Monopolar (-F)',
    'comp.thermal_contact_nc': 'Contacto Relevo Térmico NC (95-96)',
    'comp.thermal_contact_no': 'Contacto Relevo Térmico NA (97-98)',
    'comp.thermal_contact_no_nc': 'Contacto Térmico Doble (95-96 / 97-98)',
    'comp.thermal_contact_changeover': 'Contacto Térmico Conmutado (95-96-98)',

    // Accionamientos
    'comp.pushbutton_no': 'Pulsador NA (3-4)',
    'comp.pushbutton_nc': 'Pulsador NC (1-2)',
    'comp.pushbutton_no_nc': 'Pulsador Doble (NC 1-2 / NA 3-4)',
    'comp.pushbutton_changeover': 'Pulsador Conmutado (1-2-4)',
    'comp.pushbutton_emergency_nc': 'Seta de Emergencia NC (1-2)',
    'comp.pushbutton_emergency_no': 'Seta de Emergencia NA (3-4)',
    'comp.pushbutton_emergency_no_nc': 'Seta de Emergencia Doble (1-2 / 3-4)',
    'comp.pushbutton_emergency_changeover': 'Seta de Emergencia Conmutada (1-2-4)',
    'comp.limit_no': 'Final de Carrera NA (3-4)',
    'comp.limit_nc': 'Final de Carrera NC (1-2)',
    'comp.limit_no_nc': 'Final de Carrera Doble (1-2 / 3-4)',
    'comp.limit_changeover': 'Final de Carrera Conmutado (1-2-4)',
    'comp.inductive_detector_no': 'Detector Inductivo NA (A1-A2)',
    'comp.inductive_detector_nc': 'Detector Inductivo NC (A1-A2)',
    'comp.switch_no': 'Interruptor Unipolar NA (3-4)',
    'comp.switch_nc': 'Interruptor Unipolar NC (1-2)',
    'comp.switch_no_nc': 'Interruptor Selector Doble (1-2 / 3-4)',
    'comp.switch_changeover': 'Interruptor Conmutado (1-2-4)',
    'comp.switch_I_0_II': 'Interruptor Selector I-0-II (1-2-4)',
    'comp.level_switch': 'Interruptor de Nivel / Boya (1-2-4)',

    'comp.coil': 'Bobina Relé / Contactor (-K)',
    'comp.bistable_coil': 'Bobina Biestable Set/Reset (-K)',
    'comp.step_relay': 'Relé de Pasos / Telerruptor (-K)',
    'comp.connection_timer': 'Temporizador a la Conexión TON (-KM)',
    'comp.disconnection_timer': 'Temporizador a la Desconexión TOF (-KM)',
    'comp.disconnect_connection_timer': 'Temporizador Conexión/Desconexión TON/TOF (-KM)',
    'comp.timer': 'Relé Horario / Programador Semanal (-KT)',
    'comp.motor_3p': 'Motor Trifásico (U1-V1-W1-PE)',
    'comp.motor_3p_star_delta': 'Motor Trifásico 6 Bornes (Estrella-Triángulo)',
    'comp.motor_1p': 'Motor Monofásico (U1-V1-PE)',
    'comp.motor_1p_4w': 'Motor Monofásico 4 Hilos (U1-V1, U2-V2, PE)',
    'comp.pilot_light': 'Lámpara de Señalización (-H)',
    'comp.buzzer': 'Avisador Acústico / Chicharra (-H)',

    // Contactores y Auxiliares
    'comp.contactor_1p': 'Contactor 1 Polo (1-2)',
    'comp.contactor_2p': 'Contactor 2 Polos (1-2, 3-4)',
    'comp.contactor_3p': 'Contactor 3 Polos (1-2, 3-4, 5-6)',
    'comp.contactor_4p': 'Contactor 4 Polos (1-2, 3-4, 5-6, 7-8)',
    'comp.contact_no': 'Contacto Auxiliar NA (13-14)',
    'comp.contact_nc': 'Contacto Auxiliar NC (21-22)',
    'comp.contact_no_nc': 'Contacto Doble NA+NC (13-14 / 21-22)',
    'comp.contact_changeover': 'Contacto Conmutado SPDT (11-12-14)',
    'comp.ondelay_no': 'Contacto Temporizado a la Conexión NA (67-68)',
    'comp.ondelay_nc': 'Contacto Temporizado a la Conexión NC (55-56)',
    'comp.offdelay_no': 'Contacto Temporizado a la Desconexión NA (67-68)',
    'comp.offdelay_nc': 'Contacto Temporizado a la Desconexión NC (55-56)',
    'comp.on_offdelay_no': 'Contacto Temporizado Conexión/Desconexión NA (67-68)',
    'comp.on_offdelay_nc': 'Contacto Temporizado Conexión/Desconexión NC (55-56)',

    // Cables y Nodos
    'wire.junction': 'Nodo / Conexión (Punto de Unión)',
    'wire.3phase': 'Manguera 3 Fases (L1-L2-L3)',
    'wire.l1': 'Fase L1 (Marrón)',
    'wire.l2': 'Fase L2 (Negro)',
    'wire.l3': 'Fase L3 (Rojo)',
    'wire.neutral': 'Neutro N (Azul Celeste)',
    'wire.pe': 'Protección PE (Verde)',
    'wire.dc_pos': 'Positivo CC + (Rojo)',
    'wire.dc_neg': 'Negativo CC - (Azul)',

    // Hints & Status
    'status.edit_mode': 'Modo Edición',
    'status.sim_mode': '▶️ Simulación',
    'status.sim_ok': '▶️ Simulación en Curso (OK)',
    'status.short_circuit_warn': '⚠️ Cortocircuito detectado',
    'status.hint_default': 'Arrastrá componentes, doble clic para renombrar tag, Supr para borrar. Clic derecho para deseleccionar.',
    'status.hint_wire': 'Modo Cable: Clic para trazar segmentos. Clic en borna para conectar. Clic derecho o Esc para cancelar.',
    'status.hint_place': 'Clic en el lienzo para colocar el componente. Clic derecho o Esc para liberar el ratón.',
    'status.hint_delete': 'Clic en un componente o cable para eliminarlo. Clic derecho o Esc para salir.',
    'status.hint_sim': 'Hacé clic en los pulsadores o interruptores para interactuar con el circuito.',

    // Modals
    'modal.tag.title': 'Propiedades del Componente',
    'modal.tag.name': 'Nombre / Identificador (Tag):',
    'modal.tag.desc': 'Los elementos con el mismo nombre se accionan sincronizados (diferencia mayúsculas y minúsculas).',
    'modal.terminals.title': 'Numeración de Bornes de Conexión',
    'modal.tag.cancel': 'Cancelar',
    'modal.tag.accept': 'Aceptar',
    'modal.short.title': '¡Cortocircuito Detectado!',
    'modal.short.dismiss': 'Aceptar y Corregir',
    'modal.short.coords': '📍 Ubicación del corto: X: {x}, Y: {y}',
    'confirm.clear': '¿Limpiar todo el circuito?',
  },

  'es-ES': {
    // App & Topbar
    'app.title': 'OpenSimu - Simulador Electrotécnico Libre',
    'app.badge': 'Fase 0 Core',
    'btn.edit': '✏️ Edición',
    'btn.edit.title': 'Modo Edición (Diseño de Esquema)',
    'btn.simulate': '▶️ Simular',
    'btn.simulate.title': 'Iniciar Simulación Eléctrica',
    'btn.stop': '⏹ Detener',
    'btn.stop.title': 'Detener Simulación',
    'btn.select': '👆 Seleccionar',
    'btn.select.title': 'Herramienta de Selección (V)',
    'btn.delete': '🗑️ Borrar',
    'btn.delete.title': 'Herramienta Borrar elemento',
    'btn.undo': '↩️ Deshacer',
    'btn.undo.title': 'Deshacer última acción (Ctrl+Z)',
    'btn.redo': '↪️ Rehacer',
    'btn.redo.title': 'Rehacer última acción (Ctrl+Y o Ctrl+Shift+Z)',
    'btn.demo': '🚀 Cargar Demo',
    'btn.demo.title': 'Cargar Circuito Demo de Marcha y Paro con Autoenclavamiento',
    'btn.clear': '🧹 Limpiar',
    'btn.clear.title': 'Limpiar todo el circuito',
    'btn.save': '💾 Guardar JSON',
    'btn.save.title': 'Guardar circuito como archivo JSON',
    'btn.export_cad': '📄 Exportar .CAD',
    'btn.export_cad.title': 'Exportar circuito en formato .CAD compatible con CADe_SIMU',
    'btn.load': '📂 Abrir',
    'btn.load.title': 'Cargar circuito (.json o .cad de CADe_SIMU)',
    'btn.zoom_reset': '🔍 1:1',
    'btn.zoom_reset.title': 'Centrar y restablecer zoom al 100%',

    // Categories
    'cat.power': '⚡ Alimentaciones',
    'cat.power.title': 'Alimentaciones CA, CC y Tierra',
    'cat.protections': '🛡️ Disyuntores',
    'cat.protections.title': 'Magnetotérmicos, Disyuntores de motor y Diferenciales',
    'cat.control': '🔘 Accionamientos',
    'cat.control.title': 'Pulsadores, Interruptores y Accionamientos',
    'cat.contactors': '⚡ Contactores',
    'cat.contactors.title': 'Contactores de Potencia (1P - 4P)',
    'cat.motors': '⚙️ Motores',
    'cat.motors.title': 'Motores Eléctricos Trifásicos y Monofásicos',
    'cat.coils': '🧲 Bobinas',
    'cat.coils.title': 'Bobinas de Relés y Contactores',
    'cat.contacts': '🔌 Contactos',
    'cat.contacts.title': 'Contactos Auxiliares (NA, NC, Dobles, Conmutados)',
    'cat.signaling': '💡 Señalización',
    'cat.signaling.title': 'Pilotos y Avisadores Acústicos',
    'cat.cables': '〰️ Cables',
    'cat.cables.title': 'Cables y Conexiones',

    // Component Names (España - CADe_SIMU)
    'comp.source_l': 'Alimentación Fase (L)',
    'comp.source_n': 'Alimentación Neutro (N)',
    'comp.source_pe': 'Conductor de Protección (PE)',
    'comp.source_dc_pos': 'Positivo CC (+)',
    'comp.source_dc_neg': 'Negativo CC (-)',
    'comp.power_l_n': 'Alimentación L + N',
    'comp.power_l_n_pe': 'Alimentación L + N + PE',
    'comp.power_3p': 'Alimentación Trifásica (L1 + L2 + L3)',
    'comp.power_3p_pe': 'Trifásica + PE (L1-L2-L3-PE)',
    'comp.power_3p_n': 'Trifásica + N (L1-L2-L3-N)',
    'comp.power_3p_n_pe': 'Trifásica + N + PE',
    'comp.power_dc': 'Alimentación CC (+ / -)',
    'comp.transformer': 'Transformador Monofásico (-T)',
    'comp.transformer_III': 'Transformador Trifásico (-T)',
    'comp.ground': 'Puesta a Tierra',

    // Protecciones (Vocabulario España)
    'comp.mcb_1p': 'Disyuntor Magnetotérmico 1P (PIA)',
    'comp.mcb_1p_n': 'Disyuntor Magnetotérmico 1P+N (PIA)',
    'comp.mcb_2p': 'Disyuntor Magnetotérmico 2P (PIA)',
    'comp.mcb_3p': 'Disyuntor Magnetotérmico 3P (PIA)',
    'comp.mcb_4p': 'Disyuntor Magnetotérmico 4P (PIA)',
    'comp.motor_breaker_1p': 'Disyuntor Motor 1P (Guardamotor)',
    'comp.motor_breaker_1p_n': 'Disyuntor Motor 1P+N (Guardamotor)',
    'comp.motor_breaker_2p': 'Disyuntor Motor 2P (Guardamotor)',
    'comp.motor_breaker_3p': 'Disyuntor de Motor 3P (Guardamotor)',
    'comp.motor_breaker_4p': 'Disyuntor Motor 4P (3P+N Guardamotor)',
    'comp.rcd_2p': 'Interruptor Diferencial 2P (30mA)',
    'comp.rcd_4p': 'Interruptor Diferencial 4P (30mA)',
    'comp.thermal_relay_3p': 'Relé Térmico 3P (Potencia)',
    'comp.surge_arrester_1p_n': 'Limitador de Sobretensiones 1P+N',
    'comp.surge_arrester_3p_n': 'Limitador de Sobretensiones 3P+N',
    'comp.fuse_I': 'Fusible Seccionable Monopolar (-F)',
    'comp.thermal_contact_nc': 'Contacto Relé Térmico NC (95-96)',
    'comp.thermal_contact_no': 'Contacto Relé Térmico NA (97-98)',
    'comp.thermal_contact_no_nc': 'Contacto Térmico Doble (95-96 / 97-98)',
    'comp.thermal_contact_changeover': 'Contacto Térmico Conmutado (95-96-98)',

    // Accionamientos
    'comp.pushbutton_no': 'Pulsador NA (3-4)',
    'comp.pushbutton_nc': 'Pulsador NC (1-2)',
    'comp.pushbutton_no_nc': 'Pulsador Doble (NC 1-2 / NA 3-4)',
    'comp.pushbutton_changeover': 'Pulsador Conmutado (1-2-4)',
    'comp.pushbutton_emergency_nc': 'Seta de Emergencia NC (1-2)',
    'comp.pushbutton_emergency_no': 'Seta de Emergencia NA (3-4)',
    'comp.pushbutton_emergency_no_nc': 'Seta de Emergencia Doble (1-2 / 3-4)',
    'comp.pushbutton_emergency_changeover': 'Seta de Emergencia Conmutada (1-2-4)',
    'comp.limit_no': 'Final de Carrera NA (3-4)',
    'comp.limit_nc': 'Final de Carrera NC (1-2)',
    'comp.limit_no_nc': 'Final de Carrera Doble (1-2 / 3-4)',
    'comp.limit_changeover': 'Final de Carrera Conmutado (1-2-4)',
    'comp.inductive_detector_no': 'Detector Inductivo NA (A1-A2)',
    'comp.inductive_detector_nc': 'Detector Inductivo NC (A1-A2)',
    'comp.switch_no': 'Interruptor NA (3-4)',
    'comp.switch_nc': 'Interruptor NC (1-2)',
    'comp.switch_no_nc': 'Interruptor Selector Doble (1-2 / 3-4)',
    'comp.switch_changeover': 'Interruptor Conmutado (1-2-4)',
    'comp.switch_I_0_II': 'Interruptor Selector I-0-II (1-2-4)',
    'comp.level_switch': 'Interruptor de Nivel (1-2-4)',

    'comp.coil': 'Bobina Relé / Contactor (-K)',
    'comp.bistable_coil': 'Bobina Biestable Set/Reset (-K)',
    'comp.step_relay': 'Relé de Pasos / Telerruptor (-K)',
    'comp.connection_timer': 'Temporizador a la Conexión TON (-KM)',
    'comp.disconnection_timer': 'Temporizador a la Desconexión TOF (-KM)',
    'comp.disconnect_connection_timer': 'Temporizador Conexión/Desconexión TON/TOF (-KM)',
    'comp.timer': 'Relé Programador / Reloj Horario (-KT)',
    'comp.motor_3p': 'Motor Trifásico (U1-V1-W1-PE)',
    'comp.motor_3p_star_delta': 'Motor Trifásico 6 Bornes (Estrella-Triángulo)',
    'comp.motor_1p': 'Motor Monofásico (U1-V1-PE)',
    'comp.motor_1p_4w': 'Motor Monofásico 4 Hilos (U1-V1, U2-V2, PE)',
    'comp.pilot_light': 'Piloto de Señalización (-H)',
    'comp.buzzer': 'Zumbador / Avisador Acústico (-H)',

    // Contactores y Auxiliares
    'comp.contactor_1p': 'Contactor 1 Polo (1-2)',
    'comp.contactor_2p': 'Contactor 2 Polos (1-2, 3-4)',
    'comp.contactor_3p': 'Contactor 3 Polos (1-2, 3-4, 5-6)',
    'comp.contactor_4p': 'Contactor 4 Polos (1-2, 3-4, 5-6, 7-8)',
    'comp.contact_no': 'Contacto Auxiliar NA (13-14)',
    'comp.contact_nc': 'Contacto Auxiliar NC (21-22)',
    'comp.contact_no_nc': 'Contacto Doble NA+NC (13-14 / 21-22)',
    'comp.contact_changeover': 'Contacto Conmutado (11-12-14)',
    'comp.ondelay_no': 'Contacto Temporizado a la Conexión NA (67-68)',
    'comp.ondelay_nc': 'Contacto Temporizado a la Conexión NC (55-56)',
    'comp.offdelay_no': 'Contacto Temporizado a la Desconexión NA (67-68)',
    'comp.offdelay_nc': 'Contacto Temporizado a la Desconexión NC (55-56)',
    'comp.on_offdelay_no': 'Contacto Temporizado Conexión/Desconexión NA (67-68)',
    'comp.on_offdelay_nc': 'Contacto Temporizado Conexión/Desconexión NC (55-56)',

    // Cables y Nodos
    'wire.junction': 'Punto de Conexión (Nodo)',
    'wire.3phase': 'Manguera 3 Fases (L1-L2-L3)',
    'wire.l1': 'Fase L1 (Marrón)',
    'wire.l2': 'Fase L2 (Negro)',
    'wire.l3': 'Fase L3 (Rojo)',
    'wire.neutral': 'Neutro N (Azul)',
    'wire.pe': 'Protección PE (Verde)',
    'wire.dc_pos': 'Positivo CC + (Rojo)',
    'wire.dc_neg': 'Negativo CC - (Azul)',

    // Hints & Status
    'status.edit_mode': 'Modo Edición',
    'status.sim_mode': '▶️ Simulación',
    'status.sim_ok': '▶️ Simulación en Curso (OK)',
    'status.short_circuit_warn': '⚠️ Cortocircuito detectado',
    'status.hint_default': 'Arrastre componentes, doble clic para renombrar tag, Supr para borrar. Clic derecho para deseleccionar.',
    'status.hint_wire': 'Modo Cable: Clic para trazar segmentos. Clic en borne para conectar. Clic derecho o Esc para cancelar.',
    'status.hint_place': 'Clic en el lienzo para colocar el componente. Clic derecho o Esc para liberar el ratón.',
    'status.hint_delete': 'Clic en un componente o cable para eliminarlo. Clic derecho o Esc para salir.',
    'status.hint_sim': 'Haga clic en los pulsadores o interruptores para interactuar con el circuito.',

    // Modals
    'modal.tag.title': 'Propiedades del Componente',
    'modal.tag.name': 'Nombre / Identificador (Tag):',
    'modal.tag.desc': 'Los elementos con el mismo nombre se accionan sincronizados (diferencia mayúsculas y minúsculas).',
    'modal.terminals.title': 'Numeración de Bornes de Conexión',
    'modal.tag.cancel': 'Cancelar',
    'modal.tag.accept': 'Aceptar',
    'modal.short.title': '¡Cortocircuito Detectado!',
    'modal.short.dismiss': 'Aceptar y Corregir',
    'modal.short.coords': '📍 Ubicación del corto: X: {x}, Y: {y}',
    'confirm.clear': '¿Desea limpiar todo el circuito?',
  },

  en: {
    // App & Topbar
    'app.title': 'OpenSimu - Free Electrotechnical Simulator',
    'app.badge': 'Phase 0 Core',
    'btn.edit': '✏️ Edit',
    'btn.edit.title': 'Edit Mode (Schematic Design)',
    'btn.simulate': '▶️ Simulate',
    'btn.simulate.title': 'Start Electrical Simulation',
    'btn.stop': '⏹ Stop',
    'btn.stop.title': 'Stop Simulation',
    'btn.select': '👆 Select',
    'btn.select.title': 'Selection Tool (V)',
    'btn.delete': '🗑️ Delete',
    'btn.delete.title': 'Delete Component or Wire',
    'btn.undo': '↩️ Undo',
    'btn.undo.title': 'Undo last action (Ctrl+Z)',
    'btn.redo': '↪️ Redo',
    'btn.redo.title': 'Redo last action (Ctrl+Y or Ctrl+Shift+Z)',
    'btn.demo': '🚀 Load Demo',
    'btn.demo.title': 'Load Start/Stop Circuit with Latch Demo',
    'btn.clear': '🧹 Clear',
    'btn.clear.title': 'Clear Entire Circuit',
    'btn.save': '💾 Save JSON',
    'btn.save.title': 'Save circuit to JSON file',
    'btn.export_cad': '📄 Export .CAD',
    'btn.export_cad.title': 'Export circuit to CADe_SIMU compatible .CAD file',
    'btn.load': '📂 Open',
    'btn.load.title': 'Open circuit (.json or CADe_SIMU .cad)',
    'btn.zoom_reset': '🔍 1:1',
    'btn.zoom_reset.title': 'Center and reset zoom to 100%',

    // Categories
    'cat.power': '⚡ Power Supplies',
    'cat.power.title': 'AC, DC and Ground Power Supplies',
    'cat.protections': '🛡️ Protections',
    'cat.protections.title': 'Circuit Breakers, Motor Starters & RCDs',
    'cat.control': '🔘 Control & Actuators',
    'cat.control.title': 'Pushbuttons, Switches and Controls',
    'cat.contactors': '⚡ Contactors',
    'cat.contactors.title': 'Main Power Contactors (1P - 4P)',
    'cat.motors': '⚙️ Motors',
    'cat.motors.title': 'Three-Phase and Single-Phase Electric Motors',
    'cat.coils': '🧲 Coils',
    'cat.coils.title': 'Relay and Contactor Coils',
    'cat.contacts': '🔌 Aux Contacts',
    'cat.contacts.title': 'Auxiliary Contacts (NO, NC, Changeover)',
    'cat.signaling': '💡 Signaling',
    'cat.signaling.title': 'Pilot Lights and Acoustic Alarms',
    'cat.cables': '〰️ Wires',
    'cat.cables.title': 'Cables, Wires and Junction Nodes',

    // Component Names (English)
    'comp.source_l': 'Phase Supply (L)',
    'comp.source_n': 'Neutral Supply (N)',
    'comp.source_pe': 'Protective Earth (PE)',
    'comp.source_dc_pos': 'DC Positive (+)',
    'comp.source_dc_neg': 'DC Negative (-)',
    'comp.power_l_n': 'Power Supply L + N',
    'comp.power_l_n_pe': 'Power Supply L + N + PE',
    'comp.power_3p': 'Three-Phase Supply (L1 + L2 + L3)',
    'comp.power_3p_pe': 'Three-Phase + PE (L1-L2-L3-PE)',
    'comp.power_3p_n': 'Three-Phase + N (L1-L2-L3-N)',
    'comp.power_3p_n_pe': 'Three-Phase + N + PE',
    'comp.power_dc': 'DC Power Supply (+ / -)',
    'comp.transformer': '1-Phase Transformer (-T)',
    'comp.transformer_III': '3-Phase Transformer (-T)',
    'comp.ground': 'Earth Ground',

    // Protections (English)
    'comp.mcb_1p': '1-Pole Miniature Circuit Breaker (MCB)',
    'comp.mcb_1p_n': '1P+N Miniature Circuit Breaker (MCB)',
    'comp.mcb_2p': '2-Pole Miniature Circuit Breaker (MCB)',
    'comp.mcb_3p': '3-Pole Miniature Circuit Breaker (MCB)',
    'comp.mcb_4p': '4-Pole Miniature Circuit Breaker (MCB)',
    'comp.motor_breaker_1p': '1-Pole Motor Protection Breaker (MPCB)',
    'comp.motor_breaker_1p_n': '1P+N Motor Protection Breaker (MPCB)',
    'comp.motor_breaker_2p': '2-Pole Motor Protection Breaker (MPCB)',
    'comp.motor_breaker_3p': '3-Pole Motor Protection Breaker (MPCB)',
    'comp.motor_breaker_4p': '4-Pole Motor Protection Breaker (MPCB)',
    'comp.rcd_2p': 'Residual Current Device 2P (30mA RCD)',
    'comp.rcd_4p': 'Residual Current Device 4P (30mA RCD)',
    'comp.thermal_relay_3p': 'Thermal Overload Relay (Power)',
    'comp.surge_arrester_1p_n': 'Surge Protection Device 1P+N (SPD)',
    'comp.surge_arrester_3p_n': 'Surge Protection Device 3P+N (SPD)',
    'comp.fuse_I': '1-Pole Disconnectable Fuse (-F)',
    'comp.thermal_contact_nc': 'Thermal Relay NC Contact (95-96)',
    'comp.thermal_contact_no': 'Thermal Relay NO Contact (97-98)',
    'comp.thermal_contact_no_nc': 'Thermal Relay Dual Contact (95-96 / 97-98)',
    'comp.thermal_contact_changeover': 'Thermal Relay Changeover (95-96-98)',

    // Accionamientos
    'comp.pushbutton_no': 'NO Pushbutton (3-4)',
    'comp.pushbutton_nc': 'NC Pushbutton (1-2)',
    'comp.pushbutton_no_nc': 'Dual Pushbutton (NC 1-2 / NO 3-4)',
    'comp.pushbutton_changeover': 'Changeover Pushbutton (1-2-4)',
    'comp.pushbutton_emergency_nc': 'Emergency Stop NC (1-2)',
    'comp.pushbutton_emergency_no': 'Emergency Stop NO (3-4)',
    'comp.pushbutton_emergency_no_nc': 'Emergency Stop Dual (NC 1-2 / NO 3-4)',
    'comp.pushbutton_emergency_changeover': 'Emergency Stop Changeover (1-2-4)',
    'comp.limit_no': 'Limit Switch NO (3-4)',
    'comp.limit_nc': 'Limit Switch NC (1-2)',
    'comp.limit_no_nc': 'Limit Switch Dual (NC 1-2 / NO 3-4)',
    'comp.limit_changeover': 'Limit Switch Changeover (1-2-4)',
    'comp.inductive_detector_no': 'Inductive Proximity Sensor NO (A1-A2)',
    'comp.inductive_detector_nc': 'Inductive Proximity Sensor NC (A1-A2)',
    'comp.switch_no': 'NO Single Switch (3-4)',
    'comp.switch_nc': 'NC Single Switch (1-2)',
    'comp.switch_no_nc': 'Double Selector Switch (1-2 / 3-4)',
    'comp.switch_changeover': 'Changeover Switch (1-2-4)',
    'comp.switch_I_0_II': 'Rotary Selector Switch I-0-II (1-2-4)',
    'comp.level_switch': 'Level / Float Switch (1-2-4)',

    'comp.coil': 'Contactor / Relay Coil (-K)',
    'comp.bistable_coil': 'Bistable Latching Coil Set/Reset (-K)',
    'comp.step_relay': 'Step Relay / Impulse Switch (-K)',
    'comp.connection_timer': 'On-Delay Timer TON (-KM)',
    'comp.disconnection_timer': 'Off-Delay Timer TOF (-KM)',
    'comp.disconnect_connection_timer': 'On/Off-Delay Timer TON/TOF (-KM)',
    'comp.timer': 'Weekly / 24h Time Switch (-KT)',
    'comp.motor_3p': '3-Phase Motor (U1-V1-W1-PE)',
    'comp.motor_3p_star_delta': '3-Phase Motor 6-Terminal (Star-Delta)',
    'comp.motor_1p': '1-Phase Motor (U1-V1-PE)',
    'comp.motor_1p_4w': '1-Phase Motor 4-Wire (U1-V1, U2-V2, PE)',
    'comp.pilot_light': 'Pilot Light (-H)',
    'comp.buzzer': 'Acoustic Alarm / Buzzer (-H)',

    // Contactores y Auxiliares
    'comp.contactor_1p': '1-Pole Contactor (1-2)',
    'comp.contactor_2p': '2-Pole Contactor (1-2, 3-4)',
    'comp.contactor_3p': '3-Pole Contactor (1-2, 3-4, 5-6)',
    'comp.contactor_4p': '4-Pole Contactor (1-2, 3-4, 5-6, 7-8)',
    'comp.contact_no': 'Auxiliary Contact NO (13-14)',
    'comp.contact_nc': 'Auxiliary Contact NC (21-22)',
    'comp.contact_no_nc': 'Dual Aux Contact NO+NC (13-14 / 21-22)',
    'comp.contact_changeover': 'Changeover Contact (11-12-14)',
    'comp.ondelay_no': 'On-Delay Timed Contact NO (67-68)',
    'comp.ondelay_nc': 'On-Delay Timed Contact NC (55-56)',
    'comp.offdelay_no': 'Off-Delay Timed Contact NO (67-68)',
    'comp.offdelay_nc': 'Off-Delay Timed Contact NC (55-56)',
    'comp.on_offdelay_no': 'On/Off-Delay Timed Contact NO (67-68)',
    'comp.on_offdelay_nc': 'On/Off-Delay Timed Contact NC (55-56)',

    // Cables y Nodos
    'wire.junction': 'Junction Node (Connection Dot)',
    'wire.3phase': '3-Phase Cable Hose (L1-L2-L3)',
    'wire.l1': 'Phase L1 (Brown)',
    'wire.l2': 'Phase L2 (Black)',
    'wire.l3': 'Phase L3 (Red)',
    'wire.neutral': 'Neutral N (Light Blue)',
    'wire.pe': 'Protective Earth PE (Green)',
    'wire.dc_pos': 'DC Positive + (Red)',
    'wire.dc_neg': 'DC Negative - (Dark Blue)',

    // Hints & Status
    'status.edit_mode': 'Edit Mode',
    'status.sim_mode': '▶️ Simulation',
    'status.sim_ok': '▶️ Simulation Running (OK)',
    'status.short_circuit_warn': '⚠️ Short Circuit Detected',
    'status.hint_default': 'Drag components, double-click to rename tag, Del to delete. Right-click to deselect.',
    'status.hint_wire': 'Wire Mode: Click to draw segments. Click terminal to connect. Right-click or Esc to cancel.',
    'status.hint_place': 'Click canvas to place component. Right-click or Esc to release mouse.',
    'status.hint_delete': 'Click component or wire to delete. Right-click or Esc to exit.',
    'status.hint_sim': 'Click pushbuttons or switches to interact with circuit.',

    // Modals
    'modal.tag.title': 'Component Properties',
    'modal.tag.name': 'Name / Identifier (Tag):',
    'modal.tag.desc': 'Elements with the exact same name actuate together (case-sensitive).',
    'modal.terminals.title': 'Connection Terminals Numbering',
    'modal.tag.cancel': 'Cancel',
    'modal.tag.accept': 'Save',
    'modal.short.title': 'Short Circuit Detected!',
    'modal.short.dismiss': 'Acknowledge and Fix',
    'modal.short.coords': '📍 Short location: X: {x}, Y: {y}',
    'confirm.clear': 'Clear entire circuit?',
  },
};

export class I18n {
  private static currentLocale: SupportedLocale = 'es-AR';
  private static listeners: Array<(locale: SupportedLocale) => void> = [];

  public static init() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('opensimu_locale') as SupportedLocale;
      if (saved && (saved === 'es-AR' || saved === 'es-ES' || saved === 'en')) {
        this.currentLocale = saved;
      } else {
        this.currentLocale = 'es-AR'; // Default Argentina
      }
    }
  }

  public static getLocale(): SupportedLocale {
    return this.currentLocale;
  }

  public static setLocale(locale: SupportedLocale) {
    if (locale !== this.currentLocale) {
      this.currentLocale = locale;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('opensimu_locale', locale);
      }
      this.notify(locale);
    }
  }

  public static onLocaleChange(listener: (locale: SupportedLocale) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify(locale: SupportedLocale) {
    for (const listener of this.listeners) {
      listener(locale);
    }
  }

  public static t(key: string, params?: Record<string, string | number>, defaultText?: string): string {
    const dict = TRANSLATIONS[this.currentLocale] || TRANSLATIONS['es-AR'];
    let text = dict[key] || TRANSLATIONS['es-AR'][key] || defaultText || key;

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }

    return text;
  }
}

// Global shortcut helper
export const t = (key: string, params?: Record<string, string | number>, defaultText?: string) =>
  I18n.t(key, params, defaultText);
