import type { CircuitComponent, Wire, WireType } from './types';
import { COMPONENT_DEFINITIONS } from './ComponentRegistry';
import { Grid } from './Grid';

export interface CadeSimuImportResult {
  components: CircuitComponent[];
  wires: Wire[];
  metadata?: {
    version?: string;
    sheetSize?: string;
    date?: string;
    title?: string;
  };
}

export class CadeSimuParser {
  // Mapping CADe_SIMU numeric component codes to OpenSimu types
  private static readonly CODE_MAP: Record<string, string> = {
    // Alimentaciones
    '3000': 'source_l',
    '3001': 'source_n',
    '3002': 'source_pe',
    '3003': 'power_l_n', // L+N
    '3011': 'power_l_n_pe', // L+N+PE
    '3004': 'power_3p', // L1+L2+L3
    '3005': 'power_3p_pe', // L1+L2+L3+PE
    '3006': 'power_3p_n', // L1+L2+L3+N
    '3007': 'power_3p_n_pe', // L1+L2+L3+N+PE
    '3010': 'power_dc', // + -
    '3015': 'ground', // Tierra física
    // Motores
    '1000': 'motor_3p',
    '1001': 'motor_3p_star_delta',
    '1002': 'motor_1p',
    '1008': 'motor_1p_4w',

    // Accionamientos (Pulsadores e Interruptores)
    '8000': 'pushbutton_no',
    '8001': 'pushbutton_nc',
    '8002': 'pushbutton_no_nc',
    '8003': 'pushbutton_changeover',
    '8004': 'pushbutton_emergency_nc',
    '8005': 'pushbutton_emergency_no',
    '8008': 'switch_no',
    '8009': 'switch_nc',

    // Bobinas
    '9000': 'coil',
    '9001': 'coil',
    '2000': 'coil',

    // Protecciones (Automáticos y disyuntores)
    '6000': 'mcb_1p',
    '6001': 'mcb_1p_n',
    '6002': 'mcb_2p',
    '6003': 'mcb_3p',
    '6004': 'mcb_4p',
    '6005': 'rcd_2p',
    '6006': 'rcd_4p',
    '6007': 'thermal_relay_3p',
    '6008': 'motor_breaker_2p',
    '6009': 'motor_breaker_3p',
    '6010': 'motor_breaker_1p',
    '6011': 'motor_breaker_1p_n',
    '6012': 'motor_breaker_4p',
    '6013': 'surge_arrester_1p_n',
    '6014': 'surge_arrester_3p_n',

    // Contactores y Contactos
    '5000': 'contactor_1p',
    '5001': 'contact_nc_1p',
    '5002': 'contactor_2p',
    '5003': 'contact_nc_2p',
    '5004': 'contactor_3p',
    '5005': 'contact_nc_3p',
    '5006': 'contactor_4p',
    '5007': 'contact_nc_4p',
    '7000': 'contact_no',
    '7001': 'contact_nc',
    '7002': 'contact_no_nc',
    '7003': 'contact_changeover',
    '8016': 'thermal_contact_no',
    '8017': 'thermal_contact_nc',
    '8018': 'thermal_contact_no_nc',
    '8019': 'thermal_contact_changeover',

    // Señalización
    '9008': 'pilot_light',
    '9009': 'pilot_light',
  };

  /**
   * Transforma coordenadas de CADe_SIMU (base 3) a coordenadas de OpenSimu (Grid.STEP = 20)
   */
  public static coordToOpenSimu(cadCoord: number): number {
    return Math.round((cadCoord / 3) * Grid.STEP);
  }

  /**
   * Transforma coordenadas de OpenSimu a CADe_SIMU (base 3)
   */
  public static openSimuToCoord(osCoord: number): number {
    return Math.round((osCoord / Grid.STEP) * 3);
  }

  /**
   * Parsea el contenido de texto plano de un archivo .cad de CADe_SIMU
   */
  public static parse(content: string): CadeSimuImportResult {
    const components: CircuitComponent[] = [];
    const wires: Wire[] = [];

    // CADe_SIMU separa cuerpo y cajetín con '$$$'
    const [body, _footer] = content.split('$$$');
    const tokens = body.split('#');

    for (let i = 0; i < tokens.length; i += 11) {
      const header = tokens[i];
      if (!header || !header.trim()) continue;

      const tag = (tokens[i + 1] || '').trim();
      const parts = header.split('*').filter(Boolean);
      const code = parts[parts.length - 1];
      const paramList = (tokens[i + 10] || '').split('*');

      if (paramList.length < 11) continue;

      const x1 = parseInt(paramList[9], 10);
      const y1 = parseInt(paramList[10], 10);
      const x2 = paramList[11] ? parseInt(paramList[11], 10) : x1;
      const y2 = paramList[12] ? parseInt(paramList[12], 10) : y1;

      if (isNaN(x1) || isNaN(y1)) continue;

      // Detectar Cables y Nodos
      if (code === '4000' || code === '4009' || code === '4010' || code === '4001') {
        let wireType: WireType = 'phase';
        if (code === '4009') wireType = 'neutral';
        else if (code === '4010') wireType = 'pe';

        const p1 = { x: this.coordToOpenSimu(x1), y: this.coordToOpenSimu(y1) };
        const p2 = { x: this.coordToOpenSimu(x2), y: this.coordToOpenSimu(y2) };

        // Si es un nodo de conexión puntual (4001)
        if (code === '4001') {
          // Representado como segmento cero o punto
          continue;
        }

        wires.push({
          id: `w_cad_${Date.now()}_${wires.length}`,
          type: wireType,
          points: [p1, p2],
          potential: 'NONE',
        });
        continue;
      }

      // Ignorar cajetín/formato (código 20000) por ahora
      if (code === '20000') continue;

      // Componentes
      const mappedType = this.CODE_MAP[code] || 'source_l';
      const def = COMPONENT_DEFINITIONS[mappedType];
      const compX = this.coordToOpenSimu(x1);
      const compY = this.coordToOpenSimu(y1);

      if (def) {
        components.push({
          id: `c_cad_${Date.now()}_${components.length}`,
          type: def.type,
          tag: tag || def.defaultTag,
          x: compX,
          y: compY,
          rotation: 0,
          terminals: def.terminals.map((t) => ({ ...t, potential: 'NONE' })),
          state: {
            pressed: false,
            closed: (def.type.endsWith('_nc') && def.type !== 'contact_no_nc') || def.type.startsWith('fuse_'),
            energized: false,
            poles: def.poles || 1,
          },
        });
      }
    }

    return { components, wires };
  }

  /**
   * Genera el contenido en formato .cad para abrir en CADe_SIMU
   */
  public static exportToCad(components: CircuitComponent[], wires: Wire[]): string {
    let output = '';
    let index = 0;

    // Invertir CodeMap para exportar
    const TYPE_TO_CODE: Record<string, string> = {
      source_l: '3000',
      source_n: '3001',
      source_pe: '3002',
      power_l_n: '3003',
      power_l_n_pe: '3011',
      power_3p: '3004',
      power_3p_pe: '3005',
      power_3p_n: '3006',
      power_3p_n_pe: '3007',
      power_dc: '3010',
      ground: '3015',
      source_dc_pos: '3010',
      motor_3p: '1000',
      motor_3p_star_delta: '1001',
      motor_1p: '1002',
      motor_1p_4w: '1008',
      mcb_1p: '6000',
      mcb_1p_n: '6001',
      mcb_2p: '6002',
      mcb_3p: '6003',
      mcb_4p: '6004',
      rcd_2p: '6005',
      rcd_4p: '6006',
      thermal_relay_3p: '6007',
      motor_breaker_1p: '6010',
      motor_breaker_1p_n: '6011',
      motor_breaker_2p: '6008',
      motor_breaker_3p: '6009',
      motor_breaker_4p: '6012',
      surge_arrester_1p_n: '6013',
      surge_arrester_3p_n: '6014',
      pushbutton_no: '8000',
      pushbutton_nc: '8001',
      pushbutton_emergency_nc: '8004',
      pushbutton_emergency_no: '8005',
      switch_no: '8008',
      switch_nc: '8009',
      coil: '9000',
      contact_no: '7000',
      contact_nc: '7001',
      contact_no_nc: '7002',
      contact_changeover: '7003',
      thermal_contact_no: '8016',
      thermal_contact_nc: '8017',
      thermal_contact_no_nc: '8018',
      thermal_contact_changeover: '8019',
      contactor_1p: '5000',
      contactor_2p: '5002',
      contactor_3p: '5004',
      contactor_4p: '5006',
      pilot_light: '9008',
    };

    // Componentes
    for (const comp of components) {
      const code = TYPE_TO_CODE[comp.type] || '3000';
      const prefix = index === 0 ? 'CADe_SIMU*' : '*';
      const xCad = this.openSimuToCoord(comp.x);
      const yCad = this.openSimuToCoord(comp.y);

      output += `${prefix}${index}*${code}#${comp.tag}#########*0*0*0*0*0*0*0*0*${xCad}*${yCad}*0*0*-12*-9*6*3*0*0*0*1*0*0*0#`;
      index++;
    }

    // Cables
    for (const wire of wires) {
      let code = '4000';
      if (wire.type === 'neutral') code = '4009';
      else if (wire.type === 'pe') code = '4010';

      for (let s = 0; s < wire.points.length - 1; s++) {
        const x1 = this.openSimuToCoord(wire.points[s].x);
        const y1 = this.openSimuToCoord(wire.points[s].y);
        const x2 = this.openSimuToCoord(wire.points[s + 1].x);
        const y2 = this.openSimuToCoord(wire.points[s + 1].y);

        output += `*${index}*${code}##########*0*0*0*0*0*0*0*0*${x1}*${y1}*${x2}*${y2}*0*0*0*0*0*0*0*0*0*0*0#`;
        index++;
      }
    }

    // Pie de formato A4 estándar de CADe_SIMU
    output += `$$$*1*1*1*2*5*0*1*0*0*279*210&&&*           *           *           *           *                         *                         *${new Date().toLocaleDateString()}*1          *1          *OpenSimu             *1*1*1*1*1*1*1*1*1*1*1*1*1*1***$$$&&&`;

    return output;
  }
}
