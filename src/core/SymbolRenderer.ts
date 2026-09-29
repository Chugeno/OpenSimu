import type { CircuitComponent } from './types';
import { getComponentBounds } from './ComponentRegistry';
import { EMBEDDED_SYMBOLS } from './EmbeddedSymbols';

export class SymbolRenderer {
  private static svgImageCache: Map<string, HTMLImageElement> = new Map();
  public static onRedrawNeeded?: () => void;

  public static renderComponent(
    ctx: CanvasRenderingContext2D,
    comp: CircuitComponent,
    isSimulation: boolean,
    selected: boolean
  ) {
    ctx.save();
    ctx.translate(comp.x, comp.y);

    // Selection highlight
    if (selected) {
      const bounds = getComponentBounds(comp);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(bounds.x - comp.x, bounds.y - comp.y, bounds.width, bounds.height);
      ctx.setLineDash([]);
    }

    // Default stroke
    ctx.strokeStyle = '#1e293b';
    ctx.fillStyle = '#1e293b';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (comp.type) {
      case 'source_l':
      case 'source_n':
      case 'source_pe':
      case 'source_dc_pos':
      case 'source_dc_neg':
      case 'power_l_n':
      case 'power_l_n_pe':
      case 'power_3p':
      case 'power_3p_pe':
      case 'power_3p_n':
      case 'power_3p_n_pe':
      case 'power_dc':
      case 'ground':
        this.renderSource(ctx, comp, isSimulation);
        break;

      case 'pushbutton_no':
      case 'pushbutton_emergency_no':
      case 'switch_no':
      case 'contact_no':
      case 'contact_no_1p': {
        const isClosed = Boolean(comp.state.pressed || comp.state.closed || comp.state.energized);
        const stateIdx = isClosed ? 1 : 0;
        const folder = comp.type === 'contact_no_1p' ? 'contact_no' : comp.type;
        const svgPath = `/symbols/${folder}/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 40, height: 60 },
          () => this.renderSwitchNO(ctx, comp, isSimulation),
          isClosed
        );
        break;
      }

      case 'pushbutton_nc':
      case 'pushbutton_emergency_nc':
      case 'switch_nc':
      case 'contact_nc':
      case 'contact_nc_1p': {
        const isClosed = comp.state.closed && !comp.state.pressed && !comp.state.energized;
        const stateIdx = isClosed ? 0 : 1;
        const isActuated = !isClosed;
        const folder = comp.type === 'contact_nc_1p' ? 'contact_nc' : comp.type;
        const svgPath = `/symbols/${folder}/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 40, height: 60 },
          () => this.renderSwitchNC(ctx, comp, isSimulation),
          isActuated
        );
        break;
      }

      case 'switch_no_nc': {
        const isActuated = Boolean(comp.state.closed);
        const stateIdx = isActuated ? 1 : 0;
        const svgPath = `/symbols/switch_no_nc/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 80, height: 60 },
          () => this.renderContactNONC(ctx, comp, isSimulation),
          isActuated
        );
        break;
      }

      case 'switch_changeover': {
        const isActuated = Boolean(comp.state.closed);
        const stateIdx = isActuated ? 1 : 0;
        const svgPath = `/symbols/switch_changeover/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 80, height: 60 },
          () => this.renderContactChangeover(ctx, comp, isSimulation),
          isActuated
        );
        break;
      }

      case 'switch_I_0_II': {
        const pos = comp.state.position ?? 0;
        const svgPath = `/symbols/switch_I_0_II/${pos}.svg`;
        const isActuated = pos !== 0;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 80, height: 60 },
          () => this.renderContactChangeover(ctx, comp, isSimulation),
          isActuated
        );
        break;
      }

      case 'contact_no_nc': {
        const isActuated = Boolean(comp.state.energized || comp.state.pressed);
        const stateIdx = isActuated ? 1 : 0;
        const svgPath = `/symbols/contact_no_nc/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 80, height: 60 },
          () => this.renderContactNONC(ctx, comp, isSimulation),
          isActuated
        );
        break;
      }

      case 'contact_changeover': {
        const isActuated = Boolean(comp.state.energized || comp.state.pressed);
        const stateIdx = isActuated ? 1 : 0;
        const svgPath = `/symbols/contact_changeover/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 80, height: 60 },
          () => this.renderContactChangeover(ctx, comp, isSimulation),
          isActuated
        );
        break;
      }

      case 'coil': {
        const energized = Boolean(isSimulation && comp.state.energized);
        const stateIdx = energized ? 1 : 0;
        const svgPath = `/symbols/coil/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 40, height: 60 },
          () => this.renderCoil(ctx, comp, isSimulation),
          energized
        );
        break;
      }

      case 'contactor_1p':
      case 'contactor_2p':
      case 'contactor_3p':
      case 'contactor_4p':
      case 'contact_no_2p':
      case 'contact_no_3p':
      case 'contact_no_4p':
        this.renderPowerContactor(ctx, comp, isSimulation);
        break;

      case 'pilot_light': {
        const energized = Boolean(isSimulation && comp.state.energized);
        const stateIdx = energized ? 1 : 0;
        const colorKey = comp.state.color || 'green';
        const svgPath = stateIdx === 1
          ? `/symbols/pilot_light/${colorKey}_1.svg`
          : `/symbols/pilot_light/0.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 40, height: 60 },
          () => this.renderPilotLight(ctx, comp, isSimulation)
        );
        break;
      }

      case 'mcb_1p':
      case 'mcb_1p_n':
      case 'mcb_2p':
      case 'mcb_3p':
      case 'mcb_4p': {
        const isClosed = Boolean(comp.state.closed) && !comp.state.tripped;
        const stateIdx = isClosed ? 1 : 0;
        const svgPath = `/symbols/${comp.type}/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: -20, minY: 0, width: 80, height: 60 },
          () => this.renderProtectionBreaker(ctx, comp, isSimulation),
          isClosed
        );
        break;
      }

      case 'motor_breaker_1p':
      case 'motor_breaker_1p_n':
      case 'motor_breaker_2p':
      case 'motor_breaker_3p':
      case 'motor_breaker_mag_3p':
      case 'motor_breaker_4p': {
        const isClosed = Boolean(comp.state.closed) && !comp.state.tripped;
        const stateIdx = isClosed ? 1 : 0;
        const isMag = (comp.state.protectionType ?? 'mag') === 'mag';
        const prefix = isMag ? 'mag' : 'mag_thermal';
        const normalizedType = comp.type === 'motor_breaker_mag_3p' ? 'motor_breaker_3p' : comp.type;
        const svgPath = `/symbols/${normalizedType}/${prefix}_${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: -40, minY: 0, width: 140, height: 80 },
          () => this.renderProtectionBreaker(ctx, comp, isSimulation),
          isClosed
        );
        break;
      }

      case 'rcd_2p':
      case 'rcd_4p': {
        const isClosed = Boolean(comp.state.closed) && !comp.state.tripped;
        const stateIdx = isClosed ? 1 : 0;
        const svgPath = `/symbols/${comp.type}/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: -40, minY: 0, width: 140, height: 60 },
          () => this.renderProtectionBreaker(ctx, comp, isSimulation),
          isClosed
        );
        break;
      }

      case 'thermal_relay_3p': {
        const isTripped = Boolean(comp.state.tripped);
        const stateIdx = isTripped ? 1 : 0;
        const svgPath = `/symbols/thermal_relay_3p/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 120, height: 60 },
          () => this.renderThermalRelay(ctx, comp, isSimulation),
          isTripped
        );
        break;
      }

      case 'surge_arrester_1p_n':
      case 'surge_arrester_3p_n': {
        const svgPath = `/symbols/${comp.type}/0.svg`;
        const width = comp.type === 'surge_arrester_3p_n' ? 160 : 80;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width, height: 60 },
          () => this.renderSurgeArrester(ctx, comp, isSimulation),
          false
        );
        break;
      }

      case 'thermal_contact_nc': {
        const isTripped = comp.state.closed === false || comp.state.pressed || comp.state.energized;
        const stateIdx = isTripped ? 1 : 0;
        const svgPath = `/symbols/thermal_contact_nc/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: -20, minY: 0, width: 40, height: 60 },
          () => this.renderSwitchNC(ctx, comp, isSimulation),
          isTripped
        );
        break;
      }

      case 'thermal_contact_no': {
        const isTripped = Boolean(comp.state.pressed || comp.state.closed || comp.state.energized);
        const stateIdx = isTripped ? 1 : 0;
        const svgPath = `/symbols/thermal_contact_no/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: -20, minY: 0, width: 40, height: 60 },
          () => this.renderSwitchNO(ctx, comp, isSimulation),
          isTripped
        );
        break;
      }

      case 'thermal_contact_no_nc': {
        const isTripped = Boolean(comp.state.pressed || comp.state.closed || comp.state.energized);
        const stateIdx = isTripped ? 1 : 0;
        const svgPath = `/symbols/thermal_contact_no_nc/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 80, height: 60 },
          () => this.renderContactNONC(ctx, comp, isSimulation),
          isTripped
        );
        break;
      }

      case 'thermal_contact_changeover': {
        const isTripped = Boolean(comp.state.pressed || comp.state.closed || comp.state.energized);
        const stateIdx = isTripped ? 1 : 0;
        const svgPath = `/symbols/thermal_contact_changeover/${stateIdx}.svg`;
        this.renderSvgWithFallback(
          ctx,
          comp,
          isSimulation,
          svgPath,
          { minX: 0, minY: 0, width: 80, height: 60 },
          () => this.renderContactChangeover(ctx, comp, isSimulation),
          isTripped
        );
        break;
      }

      case 'motor_3p':
      case 'motor_3p_star_delta':
      case 'motor_1p':
      case 'motor_1p_4w':
        this.renderMotor(ctx, comp, isSimulation);
        break;

      case 'text_label':
        this.renderTextLabel(ctx, comp);
        break;

      case 'svg_symbol':
        this.renderSvgSymbol(ctx, comp);
        break;

      default:
        // Generic fallback
        ctx.strokeRect(0, 0, 30, 40);
        break;
    }

    // Draw Terminals
    this.renderTerminals(ctx, comp, isSimulation);

    ctx.restore();
  }

  private static renderSource(ctx: CanvasRenderingContext2D, comp: CircuitComponent, _isSim: boolean) {
    if (comp.type === 'ground') {
      // Símbolo de Tierra física
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 12);
      // 3 barras decrecientes
      ctx.moveTo(-10, 12);
      ctx.lineTo(10, 12);
      ctx.moveTo(-6, 16);
      ctx.lineTo(6, 16);
      ctx.moveTo(-2, 20);
      ctx.lineTo(2, 20);
      ctx.stroke();
      return;
    }

    // Dibujar Tag a la izquierda (-X)
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(comp.tag, -8, -4);

    // Dibujar cada borna de alimentación
    for (const t of comp.terminals) {
      let color = '#854d0e'; // Marrón para Fase por defecto
      if (t.name === 'N') color = '#0284c7'; // Celeste
      else if (t.name === 'PE') color = '#16a34a'; // Verde
      else if (t.name === '+') color = '#dc2626'; // Rojo CC
      else if (t.name === '-') color = '#1e3a8a'; // Azul CC

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      // Línea vertical hacia la borna
      ctx.beginPath();
      ctx.moveTo(t.relX, -6);
      ctx.lineTo(t.relX, 0);
      ctx.stroke();

      // Círculo de alimentación
      ctx.beginPath();
      ctx.arc(t.relX, -6, 3.5, 0, Math.PI * 2);
      ctx.stroke();

      // Etiqueta de borna arriba (L, N, PE, L1, L2, L3, +, -)
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.name, t.relX, -14);

      ctx.restore();
    }
  }

  private static renderSwitchNO(ctx: CanvasRenderingContext2D, comp: CircuitComponent, isSim: boolean) {
    const isClosed = comp.state.pressed || comp.state.closed || comp.state.energized;
    const isActuated = Boolean(isSim && isClosed);
    const strokeColor = isActuated ? '#ef4444' : '#1e293b';

    // Terminal dots
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(0, 60, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Vertical lead lines
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 20);
    ctx.moveTo(0, 42);
    ctx.lineTo(0, 60);
    ctx.stroke();

    // Actuator rod / head: pushbutton ('C' cuadrada), emergency ('D' espejada), switch ('S' cuadrada), thermal ('_П_' bimetal)
    const isPushbutton = comp.type === 'pushbutton_no';
    const isEmergency = comp.type === 'pushbutton_emergency_no';
    const isSwitch = comp.type === 'switch_no';
    const isThermal = comp.type === 'thermal_contact_no';

    const bladeX = isClosed ? 0 : -5;
    const spineX = bladeX - 9;
    const startThermalX = bladeX - 8;

    // 1. CAPA INFERIOR: Línea punteada de vinculación mecánica (SIEMPRE gris, detrás)
    if (isPushbutton || isEmergency || isSwitch || isThermal) {
      ctx.save();
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (isThermal) {
        ctx.moveTo(bladeX, 32);
        ctx.lineTo(startThermalX, 32);
      } else {
        ctx.moveTo(bladeX, 32);
        ctx.lineTo(spineX, 32);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 2. CAPA SUPERIOR: Cuchilla móvil y símbolos/iconos de identificación en negro o rojo (pisan la línea gris)
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;

    // Contact blade: hinged at bottom (0, 42), tilting up-left in open state
    ctx.beginPath();
    if (isClosed) {
      ctx.moveTo(0, 42);
      ctx.lineTo(0, 20); // Closed straight
    } else {
      ctx.moveTo(0, 42);
      ctx.lineTo(-10, 22); // Open tilted to the left
    }
    ctx.stroke();

    if (isPushbutton || isEmergency || isSwitch || isThermal) {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;

      if (isPushbutton) {
        // "C cuadrada" abierta hacia la derecha (hacia la cuchilla, norma IEC 60617 / Radica 129)
        ctx.beginPath();
        ctx.moveTo(spineX + 3.5, 27);
        ctx.lineTo(spineX, 27);
        ctx.lineTo(spineX, 37);
        ctx.lineTo(spineX + 3.5, 37);
        ctx.stroke();
      } else if (isEmergency) {
        // "D espejada horizontalmente" (seta de emergencia: lomo vertical plano a la derecha, cúpula redondeada a la izquierda)
        ctx.beginPath();
        ctx.arc(spineX, 32, 5, Math.PI / 2, (3 * Math.PI) / 2, false);
        ctx.closePath();
        ctx.stroke();
      } else if (isSwitch) {
        // "S cuadrada" (interruptor manual / conmutador rotativo escalonado IEC 60617 / Radica 153)
        ctx.beginPath();
        ctx.moveTo(spineX + 3.5, 27);
        ctx.lineTo(spineX, 27);
        ctx.lineTo(spineX, 37);
        ctx.lineTo(spineX - 3.5, 37);
        ctx.stroke();
      } else if (isThermal) {
        // Omega cuadrada horizontal (IEC 60617) con todos sus lados de la misma longitud L
        const L = 6;
        ctx.beginPath();
        // Brazo vertical de subida (longitud L)
        ctx.moveTo(startThermalX, 32);
        ctx.lineTo(startThermalX, 32 - L);
        // Tramo horizontal superior (longitud L)
        ctx.lineTo(startThermalX - L, 32 - L);
        // Brazo vertical de bajada (longitud L)
        ctx.lineTo(startThermalX - L, 32);
        // Cola horizontal hacia la izquierda
        ctx.lineTo(startThermalX - L - 4, 32);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Tag and Terminal Numbers
    const numTop = comp.terminals[0]?.name ?? (isThermal ? '97' : '13');
    const numBot = comp.terminals[1]?.name ?? (isThermal ? '98' : '14');
    this.renderTagAndNumbers(ctx, comp, numTop, numBot);
  }

  private static renderSwitchNC(ctx: CanvasRenderingContext2D, comp: CircuitComponent, isSim: boolean) {
    const isClosed = comp.state.closed && !comp.state.pressed && !comp.state.energized;
    const isActuated = Boolean(isSim && !isClosed);
    const strokeColor = isActuated ? '#ef4444' : '#1e293b';

    // Terminal dots
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(0, 60, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Vertical lead lines & Horizontal fixed contact bar to the RIGHT (IEC 60617 / CADe_SIMU)
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 20);
    ctx.lineTo(10, 20); // Fixed contact bar extending to the right
    ctx.moveTo(0, 42);
    ctx.lineTo(0, 60);
    ctx.stroke();

    // Actuator rod / head: pushbutton ('C' cuadrada), emergency ('D' espejada), switch ('S' cuadrada), thermal ('_П_' bimetal)
    const isPushbutton = comp.type === 'pushbutton_nc';
    const isEmergency = comp.type === 'pushbutton_emergency_nc';
    const isSwitch = comp.type === 'switch_nc';
    const isThermal = comp.type === 'thermal_contact_nc';

    const bladeX = isClosed ? 3.5 : 9;
    const spineX = bladeX - 12;
    const startThermalX = bladeX - 8;

    // 1. CAPA INFERIOR: Línea punteada de vinculación mecánica (SIEMPRE gris, detrás)
    if (isPushbutton || isEmergency || isSwitch || isThermal) {
      ctx.save();
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (isThermal) {
        ctx.moveTo(bladeX, 31);
        ctx.lineTo(startThermalX, 31);
      } else {
        ctx.moveTo(bladeX, 31);
        ctx.lineTo(spineX, 31);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 2. CAPA SUPERIOR: Cuchilla móvil y símbolos/iconos de identificación en negro o rojo (pisan la línea gris)
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;

    // Blade: hinged at bottom (0, 42)
    ctx.beginPath();
    if (isClosed) {
      // Reposo (Normalmente Cerrado): la cuchilla sube hacia arriba-derecha cruzando la barra
      // Pasa por (6.5, 20) y la punta sobresale ligeramente a (8, 16)
      ctx.moveTo(0, 42);
      ctx.lineTo(8, 16);
    } else {
      // Accionado (Abierto): abre hacia la derecha separándose de la barra
      // Se inclina hacia (16, 22), abriendo visiblemente el circuito
      ctx.moveTo(0, 42);
      ctx.lineTo(16, 22);
    }
    ctx.stroke();

    if (isPushbutton || isEmergency || isSwitch || isThermal) {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;

      if (isPushbutton) {
        // "C cuadrada" abierta hacia la derecha (hacia la cuchilla, norma IEC 60617 / Radica 130)
        ctx.beginPath();
        ctx.moveTo(spineX + 3.5, 26);
        ctx.lineTo(spineX, 26);
        ctx.lineTo(spineX, 36);
        ctx.lineTo(spineX + 3.5, 36);
        ctx.stroke();
      } else if (isEmergency) {
        // "D espejada horizontalmente" (seta de emergencia: lomo vertical plano a la derecha, cúpula redondeada a la izquierda)
        ctx.beginPath();
        ctx.arc(spineX, 31, 5, Math.PI / 2, (3 * Math.PI) / 2, false);
        ctx.closePath();
        ctx.stroke();
      } else if (isSwitch) {
        // "S cuadrada" (interruptor manual / conmutador rotativo escalonado IEC 60617 / Radica 154)
        ctx.beginPath();
        ctx.moveTo(spineX + 3.5, 26);
        ctx.lineTo(spineX, 26);
        ctx.lineTo(spineX, 36);
        ctx.lineTo(spineX - 3.5, 36);
        ctx.stroke();
      } else if (isThermal) {
        // Omega cuadrada horizontal (IEC 60617) con todos sus lados de la misma longitud L
        const L = 6;
        ctx.beginPath();
        // Brazo vertical de subida (longitud L)
        ctx.moveTo(startThermalX, 31);
        ctx.lineTo(startThermalX, 31 - L);
        // Tramo horizontal superior (longitud L)
        ctx.lineTo(startThermalX - L, 31 - L);
        // Brazo vertical de bajada (longitud L)
        ctx.lineTo(startThermalX - L, 31);
        // Cola horizontal hacia la izquierda
        ctx.lineTo(startThermalX - L - 4, 31);
        ctx.stroke();
      }
      ctx.restore();
    }

    const numTop = comp.terminals[0]?.name ?? (isThermal ? '95' : '11');
    const numBot = comp.terminals[1]?.name ?? (isThermal ? '96' : '12');
    this.renderTagAndNumbers(ctx, comp, numTop, numBot);
  }

  private static renderCoil(ctx: CanvasRenderingContext2D, comp: CircuitComponent, isSim: boolean) {
    const energized = comp.state.energized;

    // Terminals
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(0, 60, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Lead lines (reaching the 2:1 horizontal rectangle at Y=22 and Y=38)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 22);
    ctx.moveTo(0, 38);
    ctx.lineTo(0, 60);
    ctx.stroke();

    // IEC 60617 Standard Coil Box: 2:1 Horizontal Rectangle (32x16 centered)
    const boxW = 32;
    const boxH = 16;
    const boxX = -boxW / 2;
    const boxY = 22;

    ctx.save();
    if (isSim && energized) {
      ctx.fillStyle = '#fef08a'; // Glowing yellow
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2.2;
    } else {
      ctx.fillStyle = '#ffffff';
    }

    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.restore();

    // Terminal labels A1 and A2 outside
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    const tTop = comp.terminals[0]?.name ?? 'A1';
    const tBot = comp.terminals[1]?.name ?? 'A2';
    ctx.fillText(tTop, 6, 12);
    ctx.fillText(tBot, 6, 52);

    // Tag OUTSIDE the coil box to the LEFT
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(comp.tag, -20, 34);
  }

  private static renderPowerContactor(
    ctx: CanvasRenderingContext2D,
    comp: CircuitComponent,
    isSim: boolean
  ) {
    const poles = comp.state.poles || 1;
    const isClosed = comp.state.closed || comp.state.energized;
    const isActuated = Boolean(isSim && isClosed);
    const strokeColor = isActuated ? '#ef4444' : '#1e293b';

    // 1. CAPA INFERIOR: Barra de acoplamiento mecánico en gris punteado si poles > 1 (detrás de las cuchillas)
    if (poles > 1) {
      ctx.save();
      ctx.setLineDash([3, 2]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 32);
      ctx.lineTo((poles - 1) * 40, 32);
      ctx.stroke();
      ctx.restore();
    }

    // 2. CAPA SUPERIOR: Bornes, líneas de paso, botitas y cuchillas en negro o rojo (pisan la línea gris)
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;

    for (let p = 0; p < poles; p++) {
      const offsetX = p * 40;

      // Terminal dots
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(offsetX, 0, 2.5, 0, Math.PI * 2);
      ctx.arc(offsetX, 60, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Lead lines
      ctx.beginPath();
      ctx.moveTo(offsetX, 0);
      ctx.lineTo(offsetX, 22);
      ctx.moveTo(offsetX, 42);
      ctx.lineTo(offsetX, 60);
      ctx.stroke();

      // IEC 60617 Power contact semicircular arc ("botita") at TOP fixed terminal
      // Curves to the LEFT forming the boot/lowercase d shape
      ctx.beginPath();
      ctx.arc(offsetX, 18, 4, Math.PI / 2, -Math.PI / 2, false);
      ctx.stroke();

      // Blade: hinged at bottom (offsetX, 42), tilting up-left
      ctx.beginPath();
      if (isClosed) {
        ctx.moveTo(offsetX, 42);
        ctx.lineTo(offsetX, 22);
      } else {
        ctx.moveTo(offsetX, 42);
        ctx.lineTo(offsetX - 10, 22);
      }
      ctx.stroke();

      // Numbers (odd on top, even on bottom)
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'left';
      const topNum = comp.terminals[p * 2]?.name ?? `${p * 2 + 1}`;
      const botNum = comp.terminals[p * 2 + 1]?.name ?? `${p * 2 + 2}`;
      ctx.fillText(topNum, offsetX + 4, 10);
      ctx.fillText(botNum, offsetX + 4, 54);
    }

    // Tag to the LEFT of Pole 1
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(comp.tag, -14, 32);
  }

  private static renderContactNONC(
    ctx: CanvasRenderingContext2D,
    comp: CircuitComponent,
    isSim: boolean
  ) {
    const isActuated = Boolean(comp.state.energized || comp.state.pressed);
    const strokeColor = Boolean(isSim && isActuated) ? '#ef4444' : '#1e293b';

    // Pole 1: NO (13-14) at X = 0
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(0, 60, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 20);
    ctx.moveTo(0, 42);
    ctx.lineTo(0, 60);
    ctx.stroke();

    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText(comp.terminals[0]?.name ?? '13', 4, 10);
    ctx.fillText(comp.terminals[1]?.name ?? '14', 4, 54);

    // Pole 2: NC (21-22) at X = 40
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(40, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(40, 60, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, 20);
    ctx.lineTo(50, 20); // Fixed contact bar extending to the right
    ctx.moveTo(40, 42);
    ctx.lineTo(40, 60);
    ctx.stroke();

    ctx.fillText(comp.terminals[2]?.name ?? '21', 46, 10);
    ctx.fillText(comp.terminals[3]?.name ?? '22', 46, 54);

    // Mechanical link touching both blades at Y = 32
    const blade1X = isActuated ? 0 : -5;
    const blade2X = isActuated ? 48 : 43.1;
    const isThermal = comp.type === 'thermal_contact_no_nc';
    const leftLinkX = isThermal ? blade1X - 8 : blade1X;

    // 1. CAPA INFERIOR: Enlace mecánico punteado (SIEMPRE gris, detrás de las cuchillas y del símbolo)
    ctx.save();
    ctx.setLineDash([3, 2]);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(leftLinkX, 32);
    ctx.lineTo(blade2X, 32);
    ctx.stroke();
    ctx.restore();

    // 2. CAPA SUPERIOR: Cuchillas de ambos polos en negro o rojo (pisan la línea gris)
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;

    // Pole 1 blade (hinged at (0, 42))
    ctx.beginPath();
    if (isActuated) {
      ctx.moveTo(0, 42);
      ctx.lineTo(0, 20);
    } else {
      ctx.moveTo(0, 42);
      ctx.lineTo(-10, 22);
    }
    ctx.stroke();

    // Pole 2 blade (hinged at (40, 42))
    ctx.beginPath();
    if (!isActuated) {
      // Reposo (Cerrado): sube hacia arriba-derecha cruzando la barra
      ctx.moveTo(40, 42);
      ctx.lineTo(48, 16);
    } else {
      // Accionado (Abierto): abre hacia la derecha separándose de la barra
      ctx.moveTo(40, 42);
      ctx.lineTo(56, 22);
    }
    ctx.stroke();

    // 3. CAPA SUPERIOR: Omega de relé térmico en negro (pisa la línea gris)
    if (isThermal) {
      const L = 6;
      const startX = leftLinkX;
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Omega cuadrada horizontal a la izquierda, idéntica a los otros contactos auxiliares
      ctx.moveTo(startX, 32);
      ctx.lineTo(startX, 32 - L);
      ctx.lineTo(startX - L, 32 - L);
      ctx.lineTo(startX - L, 32);
      ctx.lineTo(startX - L - 4, 32);
      ctx.stroke();
      ctx.restore();
    }

    // Tag to the LEFT of Pole 1 (con margen suficiente para no pisar el actuador)
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    const tagX = isThermal ? -28 : -14;
    ctx.fillText(comp.tag, tagX, 32);
  }

  private static renderContactChangeover(
    ctx: CanvasRenderingContext2D,
    comp: CircuitComponent,
    isSim: boolean
  ) {
    const isActuated = Boolean(comp.state.energized || comp.state.pressed);
    const strokeColor = Boolean(isSim && isActuated) ? '#ef4444' : '#1e293b';

    const comX = comp.terminals[0]?.relX ?? 20;
    const comY = comp.terminals[0]?.relY ?? 0;
    const ncX = comp.terminals[1]?.relX ?? 0;
    const ncY = comp.terminals[1]?.relY ?? 60;
    const naX = comp.terminals[2]?.relX ?? 40;
    const naY = comp.terminals[2]?.relY ?? 60;

    // Terminal dots (individual paths to prevent canvas fill polygon)
    ctx.fillStyle = strokeColor;
    for (const [tx, ty] of [
      [comX, comY],
      [ncX, ncY],
      [naX, naY],
    ]) {
      ctx.beginPath();
      ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // COM vertical lead from (comX, 0) to (comX, 18)
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(comX, comY);
    ctx.lineTo(comX, 18);

    // NC vertical lead from (ncX, 60) to (ncX, 42) and horizontal bar to the RIGHT (ncX + 10, 42)
    ctx.moveTo(ncX, ncY);
    ctx.lineTo(ncX, 42);
    ctx.lineTo(ncX + 10, 42);

    // NA vertical lead from (naX, 60) to (naX, 42) and horizontal bar to the LEFT (naX - 10, 42)
    ctx.moveTo(naX, naY);
    ctx.lineTo(naX, 42);
    ctx.lineTo(naX - 10, 42);
    ctx.stroke();

    const isThermal = comp.type === 'thermal_contact_changeover';
    const bladeMidX = isActuated ? 30 : 13;
    const L = 6;
    const startX = bladeMidX - 8;

    // 1. CAPA INFERIOR: Enlace mecánico en gris punteado (detrás de la cuchilla y de la omega)
    if (isThermal) {
      ctx.save();
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(bladeMidX, 30);
      ctx.lineTo(startX, 30);
      ctx.stroke();
      ctx.restore();
    }

    // 2. CAPA SUPERIOR: Cuchilla basculante en negro o rojo (pisa la línea gris)
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    if (!isActuated) {
      // Reposo: conecta con el contacto fijo de NC en (ncX + 6, 42)
      ctx.moveTo(comX, 18);
      ctx.lineTo(ncX + 6, 42);
    } else {
      // Accionado: bascula y conecta con el contacto fijo de NA en (naX - 6, 42)
      ctx.moveTo(comX, 18);
      ctx.lineTo(naX - 6, 42);
    }
    ctx.stroke();

    // 3. CAPA SUPERIOR: Omega de relé térmico en negro (pisa la línea gris)
    if (isThermal) {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Omega cuadrada horizontal (IEC 60617) desplazada a la izquierda
      ctx.moveTo(startX, 30);
      ctx.lineTo(startX, 30 - L);
      ctx.lineTo(startX - L, 30 - L);
      ctx.lineTo(startX - L, 30);
      ctx.lineTo(startX - L - 4, 30);
      ctx.stroke();
      ctx.restore();
    }

    // Terminal labels
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText(comp.terminals[0]?.name ?? (isThermal ? '95' : '11'), comX + 5, 12);
    ctx.fillText(comp.terminals[1]?.name ?? (isThermal ? '96' : '12'), ncX + 13, 50);
    ctx.fillText(comp.terminals[2]?.name ?? (isThermal ? '98' : '14'), naX + 5, 50);

    // Tag to the LEFT
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    const tagX = isThermal ? -26 : -14;
    ctx.fillText(comp.tag, tagX, 32);
  }

  private static renderPilotLight(ctx: CanvasRenderingContext2D, comp: CircuitComponent, isSim: boolean) {
    const energized = comp.state.energized;
    const colorKey = comp.state.color || 'green';

    let hexColor = '#22c55e';
    let glowColor = '#4ade80';
    if (colorKey === 'red' || colorKey === '#ef4444') {
      hexColor = '#ef4444';
      glowColor = '#f87171';
    } else if (colorKey === 'yellow' || colorKey === '#eab308') {
      hexColor = '#eab308';
      glowColor = '#fde047';
    } else if (colorKey === 'blue' || colorKey === '#3b82f6') {
      hexColor = '#3b82f6';
      glowColor = '#60a5fa';
    } else if (colorKey === 'white' || colorKey === '#94a3b8' || colorKey === '#ffffff') {
      hexColor = '#f8fafc';
      glowColor = '#ffffff';
    } else if (colorKey.startsWith('#')) {
      hexColor = colorKey;
      glowColor = colorKey;
    }

    // Terminals
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(0, 60, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Lead lines
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 18);
    ctx.moveTo(0, 42);
    ctx.lineTo(0, 60);
    ctx.stroke();

    // Lamp Circle (radius 12 at (0, 30))
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 30, 12, 0, Math.PI * 2);

    if (isSim && energized) {
      ctx.fillStyle = hexColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 14;
      ctx.fill();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    ctx.stroke();

    // Cross inside lamp
    ctx.beginPath();
    const d = 12 * Math.SQRT1_2;
    ctx.moveTo(-d, 30 - d);
    ctx.lineTo(d, 30 + d);
    ctx.moveTo(-d, 30 + d);
    ctx.lineTo(d, 30 - d);
    ctx.strokeStyle = isSim && energized ? (colorKey === 'white' ? '#0f172a' : '#ffffff') : '#1e293b';
    ctx.stroke();

    // In edit mode or off state: show small color dot at center to identify the lamp color
    if (!isSim || !energized) {
      ctx.beginPath();
      ctx.arc(0, 30, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = hexColor;
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // Terminal numbers X1, X2
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText(comp.terminals[0]?.name ?? 'X1', 6, 12);
    ctx.fillText(comp.terminals[1]?.name ?? 'X2', 6, 52);

    // Tag to the LEFT
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(comp.tag, -16, 34);
  }

  private static renderTagAndNumbers(
    ctx: CanvasRenderingContext2D,
    comp: CircuitComponent,
    numTop: string,
    numBot: string
  ) {
    // Numbers on the right
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText(numTop, 6, 10);
    ctx.fillText(numBot, 6, 54);

    // Tag on the LEFT (clearing pushbutton / switch / thermal actuator if present)
    const isThermal = comp.type.startsWith('thermal_contact_');
    const hasCap = comp.type.startsWith('pushbutton_') || comp.type.startsWith('switch_');
    const tagX = isThermal ? -26 : hasCap ? -22 : -14;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(comp.tag, tagX, 32);
  }

  private static renderProtectionBreaker(
    ctx: CanvasRenderingContext2D,
    comp: CircuitComponent,
    isSim: boolean
  ) {
    let poles = 1;
    if (
      comp.type === 'mcb_2p' ||
      comp.type === 'mcb_1p_n' ||
      comp.type === 'rcd_2p' ||
      comp.type === 'motor_breaker_2p' ||
      comp.type === 'motor_breaker_1p_n'
    ) poles = 2;
    else if (
      comp.type === 'mcb_3p' ||
      comp.type === 'motor_breaker_3p' ||
      comp.type === 'motor_breaker_mag_3p'
    ) poles = 3;
    else if (
      comp.type === 'mcb_4p' ||
      comp.type === 'rcd_4p' ||
      comp.type === 'motor_breaker_4p'
    ) poles = 4;
    else if (comp.type === 'motor_breaker_1p') poles = 1;

    const isClosed = Boolean(comp.state.closed) && !comp.state.tripped;
    const isRCD = comp.type.startsWith('rcd_');
    const isMotorBreaker = comp.type.startsWith('motor_breaker_');
    const isMCB = comp.type.startsWith('mcb_');
    const isMagOnly = comp.type === 'motor_breaker_mag_3p' || (comp.type.startsWith('motor_breaker_') && (comp.state.protectionType ?? 'mag') === 'mag');

    // Para Guardamotor: Dibujar primero actuador mecánico lateral y cajas de disparo (con fondo blanco limpio)
    if (isMotorBreaker) {
      const sqX = -26;
      const sqY = 22;
      const sqW = 12;
      const boxX = -10;
      const boxW = (poles - 1) * 40 + 20;

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;

      if (!isMagOnly) {
        // Guardamotor Magnetotérmico (2 filas: Térmico 38..52 + Magnético 52..66)
        ctx.fillRect(boxX, 38, boxW, 14);
        ctx.strokeRect(boxX, 38, boxW, 14);
        ctx.fillRect(boxX, 52, boxW, 14);
        ctx.strokeRect(boxX, 52, boxW, 14);
      } else {
        // Guardamotor Solo Magnético (1 sola fila de 44..62, altura 18)
        ctx.fillRect(boxX, 44, boxW, 18);
        ctx.strokeRect(boxX, 44, boxW, 18);
      }

      // Cuadradito con cruz de accionamiento manual (Y = 22..34)
      ctx.fillRect(sqX, sqY, sqW, sqW);
      ctx.strokeRect(sqX, sqY, sqW, sqW);
      ctx.beginPath();
      ctx.moveTo(sqX + sqW / 2, sqY);
      ctx.lineTo(sqX + sqW / 2, sqY + sqW);
      ctx.moveTo(sqX, sqY + sqW / 2);
      ctx.lineTo(sqX + sqW, sqY + sqW / 2);
      ctx.stroke();

      // Palanca T manual a la izquierda (en Y = 28)
      ctx.beginPath();
      ctx.moveTo(-34, 24);
      ctx.lineTo(-34, 32);
      ctx.stroke();

      // Enlaces mecánicos con línea discontinua
      ctx.setLineDash([3, 2]);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Desde T hasta cuadradito (a Y = 28)
      ctx.moveTo(-34, 28);
      ctx.lineTo(sqX, 28);
      // Barra de acoplamiento que atraviesa los 3 polos a la altura de la cuchilla
      ctx.moveTo(sqX + sqW, 28);
      ctx.lineTo((poles - 1) * 40, 28);

      // Vinculación hacia abajo hacia los bloques de disparo
      if (!isMagOnly) {
        ctx.moveTo(sqX + sqW / 2, sqY + sqW);
        ctx.lineTo(sqX + sqW / 2, 59);
        ctx.moveTo(sqX + sqW / 2, 45);
        ctx.lineTo(boxX, 45);
        ctx.moveTo(sqX + sqW / 2, 59);
        ctx.lineTo(boxX, 59);
      } else {
        ctx.moveTo(sqX + sqW / 2, sqY + sqW);
        ctx.lineTo(sqX + sqW / 2, 53);
        ctx.moveTo(sqX + sqW / 2, 53);
        ctx.lineTo(boxX, 53);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Para Interruptor Diferencial: Actuador de test lateral, vinculación mecánica y toroide inferior
    if (isRCD) {
      const sqX = -26;
      const sqY = 20;
      const sqW = 12;
      const couplingY = 26;
      const toroidY = 46;
      const midX = ((poles - 1) * 40) / 2;
      const rx = midX + 14;
      const ry = 5.5;

      ctx.save();
      // Cuadradito de test (con fondo blanco limpio)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.fillRect(sqX, sqY, sqW, sqW);
      ctx.strokeRect(sqX, sqY, sqW, sqW);
      // Cruz de test interior
      ctx.beginPath();
      ctx.moveTo(sqX + sqW / 2, sqY);
      ctx.lineTo(sqX + sqW / 2, sqY + sqW);
      ctx.moveTo(sqX, sqY + sqW / 2);
      ctx.lineTo(sqX + sqW, sqY + sqW / 2);
      ctx.stroke();

      // Botón/palanca manual de test a la izquierda
      ctx.beginPath();
      ctx.moveTo(-34, couplingY - 4);
      ctx.lineTo(-34, couplingY + 4);
      ctx.stroke();

      // Líneas mecánicas de vinculación en gris punteado
      ctx.setLineDash([3, 2]);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Desde pulsador de test hasta cuadradito
      ctx.moveTo(-34, couplingY);
      ctx.lineTo(sqX, couplingY);
      // Barra de acoplamiento que atraviesa las cuchillas de todos los polos
      ctx.moveTo(sqX + sqW, couplingY);
      ctx.lineTo((poles - 1) * 40, couplingY);
      // Bajada desde el actuador de test hasta el toroide
      ctx.moveTo(sqX + sqW / 2, sqY + sqW);
      ctx.lineTo(sqX + sqW / 2, toroidY);
      ctx.lineTo(midX - rx, toroidY);
      ctx.stroke();

      // Toroide celeste inferior
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(midX, toroidY, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 1. CAPA INFERIOR: Barra de acoplamiento mecánico (para MCB y seccionadores multipolares, detrás de cuchillas)
    if (poles > 1 && !isMotorBreaker && !isRCD) {
      ctx.save();
      ctx.setLineDash([3, 2]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (isMCB) {
        const startX = isClosed ? 0 : -5;
        ctx.moveTo(startX, 33);
        ctx.lineTo((poles - 1) * 40 + startX, 33);
      } else {
        ctx.moveTo(0, 30);
        ctx.lineTo((poles - 1) * 40, 30);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 2. CAPA SUPERIOR: Polos, cuchillas, símbolos bimetálicos/magnéticos en negro o rojo (pisan la línea gris)
    const isActuated = Boolean(isSim && isClosed);
    const strokeColor = isActuated ? '#ef4444' : '#1e293b';
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;

    for (let p = 0; p < poles; p++) {
      const offsetX = p * 40;
      const isNeutralPole = (poles === 2 && p === 1 && (isRCD || comp.type === 'mcb_1p_n' || comp.type === 'motor_breaker_1p_n')) || (poles === 4 && p === 3);
      const botTermY = isMotorBreaker ? 80 : 60;

      // Terminal points
      ctx.beginPath();
      ctx.arc(offsetX, 0, 2.5, 0, Math.PI * 2);
      ctx.arc(offsetX, botTermY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (isMCB) {
        // GEOMETRÍA RADICA SOFTWARE EXACTA PARA TERMOMAGNÉTICAS (MCB 1P..4P, LEAD SUPERIOR ALARGADO A 22px, APERTURA 10px)
        const tipX = isClosed ? offsetX : offsetX - 10;
        const xOmega = isClosed ? offsetX : offsetX - 5.52;
        const xArrow = isClosed ? offsetX : offsetX - 3.36;

        // Leads superior e inferior
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, 22);
        ctx.moveTo(offsetX, 44);
        ctx.lineTo(offsetX, 60);
        ctx.stroke();

        if (!isNeutralPole) {
          // Cruz 'x' (disparo automático)
          ctx.beginPath();
          ctx.moveTo(offsetX - 2.5, 13.5);
          ctx.lineTo(offsetX + 2.5, 18.5);
          ctx.moveTo(offsetX + 2.5, 13.5);
          ctx.lineTo(offsetX - 2.5, 18.5);
          ctx.stroke();
        }

        // Línea horizontal '—' (seccionador) justo sobre donde abre la cuchilla
        ctx.beginPath();
        ctx.moveTo(offsetX - 3.5, 22);
        ctx.lineTo(offsetX + 3.5, 22);
        ctx.stroke();

        // Cuchilla móvil articulada en (offsetX, 44) con apertura de 10px
        ctx.beginPath();
        ctx.moveTo(offsetX, 44);
        ctx.lineTo(tipX, 22);
        ctx.stroke();

        if (!isNeutralPole) {
          // Elemento térmico bimetálico escalonado (omega cuadrada _П_ estilo Radica) vinculado a la cuchilla
          ctx.beginPath();
          ctx.moveTo(xOmega, 31.85);
          ctx.lineTo(xOmega - 3.32, 32.71);
          ctx.lineTo(xOmega - 4.24, 29.40);
          ctx.lineTo(xOmega - 7.56, 30.26);
          ctx.lineTo(xOmega - 6.65, 33.57);
          ctx.lineTo(xOmega - 9.97, 34.43);
          ctx.stroke();

          // Disparo magnético: flecha horizontal apuntando hacia la izquierda estilo Radica
          // Brazo de la flecha
          ctx.beginPath();
          ctx.moveTo(xArrow, 36.61);
          ctx.lineTo(xArrow - 4.45, 37.64);
          ctx.stroke();

          // Cabeza de flecha triangular rellena
          ctx.beginPath();
          ctx.moveTo(xArrow - 4.87, 35.91);
          ctx.lineTo(xArrow - 10.37, 39.05);
          ctx.lineTo(xArrow - 4.05, 39.45);
          ctx.closePath();
          ctx.fillStyle = '#0f172a';
          ctx.fill();
        }

      } else if (isMotorBreaker) {
        // GEOMETRÍA RADICA PROPORCIONADA (ALTURA 80px, LEAD SUPERIOR ALARGADO A 20px, APERTURA 10px)
        const tipX = isClosed ? offsetX : offsetX - 10;

        // Lead superior (0 a 20)
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, 20);
        ctx.stroke();

        // Cruz 'x' (disparo automático)
        ctx.beginPath();
        ctx.moveTo(offsetX - 2.5, 12.5);
        ctx.lineTo(offsetX + 2.5, 17.5);
        ctx.moveTo(offsetX + 2.5, 12.5);
        ctx.lineTo(offsetX - 2.5, 17.5);
        ctx.stroke();

        // Línea horizontal '—' (seccionador) justo sobre donde abre la cuchilla
        ctx.beginPath();
        ctx.moveTo(offsetX - 3.5, 20);
        ctx.lineTo(offsetX + 3.5, 20);
        ctx.stroke();

        // Cuchilla móvil: articulada en (offsetX, 36), abierta a (offsetX - 7, 20) o vertical a (offsetX, 20)
        ctx.beginPath();
        ctx.moveTo(offsetX, 36);
        ctx.lineTo(tipX, 20);
        ctx.stroke();

        if (!isMagOnly) {
          // Guardamotor Magnetotérmico (2 filas)
          // Conductor hacia la caja térmica (36 a 38)
          ctx.beginPath();
          ctx.moveTo(offsetX, 36);
          ctx.lineTo(offsetX, 38);
          // Omega cuadrada vertical en la fila térmica superior (38 a 52)
          ctx.lineTo(offsetX, 41);
          ctx.lineTo(offsetX + 5.5, 41);
          ctx.lineTo(offsetX + 5.5, 49);
          ctx.lineTo(offsetX, 49);
          ctx.lineTo(offsetX, 52);
          ctx.stroke();

          // Símbolo vectorial "I >>" en la fila magnética inferior (52 a 66, centro 59)
          ctx.beginPath();
          // Letra I con serifs
          ctx.moveTo(offsetX - 6, 56.5);
          ctx.lineTo(offsetX - 6, 61.5);
          ctx.moveTo(offsetX - 7.5, 56.5);
          ctx.lineTo(offsetX - 4.5, 56.5);
          ctx.moveTo(offsetX - 7.5, 61.5);
          ctx.lineTo(offsetX - 4.5, 61.5);
          // Primer símbolo >
          ctx.moveTo(offsetX - 2, 56.5);
          ctx.lineTo(offsetX + 1, 59);
          ctx.lineTo(offsetX - 2, 61.5);
          // Segundo símbolo >
          ctx.moveTo(offsetX + 3.5, 56.5);
          ctx.lineTo(offsetX + 6.5, 59);
          ctx.lineTo(offsetX + 3.5, 61.5);
          ctx.stroke();

          // Lead inferior (66 a 80)
          ctx.beginPath();
          ctx.moveTo(offsetX, 66);
          ctx.lineTo(offsetX, 80);
          ctx.stroke();
        } else {
          // Guardamotor Solo Magnético (1 fila central de 44 a 62 con "I >>")
          // Conductor hacia la caja magnética (36 a 44)
          ctx.beginPath();
          ctx.moveTo(offsetX, 36);
          ctx.lineTo(offsetX, 44);
          ctx.stroke();

          // Símbolo vectorial "I >>" en la fila única (44 a 62, centro 53)
          ctx.beginPath();
          // Letra I con serifs
          ctx.moveTo(offsetX - 6.5, 50);
          ctx.lineTo(offsetX - 6.5, 56);
          ctx.moveTo(offsetX - 8, 50);
          ctx.lineTo(offsetX - 5, 50);
          ctx.moveTo(offsetX - 8, 56);
          ctx.lineTo(offsetX - 5, 56);
          // Primer símbolo >
          ctx.moveTo(offsetX - 2.5, 50);
          ctx.lineTo(offsetX + 1, 53);
          ctx.lineTo(offsetX - 2.5, 56);
          // Segundo símbolo >
          ctx.moveTo(offsetX + 3.5, 50);
          ctx.lineTo(offsetX + 7, 53);
          ctx.lineTo(offsetX + 3.5, 56);
          ctx.stroke();

          // Lead inferior (62 a 80)
          ctx.beginPath();
          ctx.moveTo(offsetX, 62);
          ctx.lineTo(offsetX, 80);
          ctx.stroke();
        }

      } else if (isRCD) {
        // INTERRUPTOR DIFERENCIAL (RCD, LEAD SUPERIOR ALARGADO A 20px, APERTURA 10px)
        const tipX = isClosed ? offsetX : offsetX - 10;

        // Lead superior (0 a 20)
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, 20);
        ctx.stroke();

        // Cruz 'x' (disparo automático)
        ctx.beginPath();
        ctx.moveTo(offsetX - 2.5, 12.5);
        ctx.lineTo(offsetX + 2.5, 17.5);
        ctx.moveTo(offsetX + 2.5, 12.5);
        ctx.lineTo(offsetX - 2.5, 17.5);
        ctx.stroke();

        // Línea horizontal '—' (seccionador) justo sobre donde abre la cuchilla
        ctx.beginPath();
        ctx.moveTo(offsetX - 3.5, 20);
        ctx.lineTo(offsetX + 3.5, 20);
        ctx.stroke();

        // Cuchilla móvil articulada en (offsetX, 36) con apertura de 10px
        ctx.beginPath();
        ctx.moveTo(offsetX, 36);
        ctx.lineTo(tipX, 20);
        ctx.stroke();

        // Lead inferior continuo a través del toroide (36 a 60)
        ctx.beginPath();
        ctx.moveTo(offsetX, 36);
        ctx.lineTo(offsetX, 60);
        ctx.stroke();

      } else {
        // Lead lines estándar (seccionadores y otros)
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, 20);
        ctx.moveTo(offsetX, 42);
        ctx.lineTo(offsetX, 60);
        ctx.stroke();

        // IEC 60617 Disconnector cross / mark at top
        ctx.beginPath();
        ctx.moveTo(offsetX - 3, 20);
        ctx.lineTo(offsetX + 3, 20);
        ctx.stroke();

        // Blade: hinged at (offsetX, 42)
        ctx.beginPath();
        if (isClosed) {
          ctx.moveTo(offsetX, 42);
          ctx.lineTo(offsetX, 20);
        } else {
          ctx.moveTo(offsetX, 42);
          ctx.lineTo(offsetX - 10, 20);
        }
        ctx.stroke();
      }

      // Terminal numbering on the LEFT of lead (IEC / Radica style)
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      const defaultTop = isNeutralPole ? 'N' : `${p * 2 + 1}`;
      const defaultBot = isNeutralPole ? 'N' : `${p * 2 + 2}`;
      const topNum = comp.terminals[p * 2]?.name ?? defaultTop;
      const botNum = comp.terminals[p * 2 + 1]?.name ?? defaultBot;
      const topY = 11;
      const botY = isMotorBreaker ? 77 : 56;
      ctx.fillText(topNum, offsetX - 5, topY);
      ctx.fillText(botNum, offsetX - 5, botY);
    }

    // Tag to the LEFT
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    const tagX = (isMotorBreaker || isRCD) ? -40 : (isMCB ? -22 : -14);
    const tagY = isMotorBreaker ? 36 : 33;
    ctx.fillText(comp.tag, tagX, tagY);
  }

  private static renderThermalRelay(
    ctx: CanvasRenderingContext2D,
    comp: CircuitComponent,
    _isSim: boolean
  ) {
    const poles = 3;
    const isTripped = Boolean(comp.state.tripped);

    // Terminal points
    ctx.fillStyle = '#0f172a';
    for (const t of comp.terminals) {
      ctx.beginPath();
      ctx.arc(t.relX, t.relY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const boxX = -10;
    const boxW = (poles - 1) * 40 + 20; // 100px (de -10 a 90)
    const boxY = 22;
    const boxH = 16;

    // Caja rectangular enmarcando la sección térmica de las 3 fases (estilo guardamotor)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = isTripped ? '#ef4444' : '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.restore();

    // Enlace mecánico horizontal a través de los 3 bimetales en Y = 30
    ctx.save();
    ctx.setLineDash([3, 2]);
    ctx.strokeStyle = isTripped ? '#ef4444' : '#64748b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-16, 30);
    ctx.lineTo(boxX + boxW - 2, 30);
    ctx.stroke();
    ctx.restore();

    for (let p = 0; p < poles; p++) {
      const ox = p * 40;

      // Leads superior e inferior
      ctx.strokeStyle = isTripped ? '#ef4444' : '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(ox, 0);
      ctx.lineTo(ox, boxY);
      ctx.moveTo(ox, boxY + boxH);
      ctx.lineTo(ox, 60);
      ctx.stroke();

      // Bucle bimetálico térmico IEC 60617 (_П_) enmarcado dentro del rectángulo
      ctx.beginPath();
      ctx.moveTo(ox, boxY);
      ctx.lineTo(ox, boxY + 2.5);
      ctx.lineTo(ox + 6.5, boxY + 2.5);
      ctx.lineTo(ox + 6.5, boxY + boxH - 2.5);
      ctx.lineTo(ox, boxY + boxH - 2.5);
      ctx.lineTo(ox, boxY + boxH);
      ctx.stroke();

      // Terminal numbers (1, 3, 5 arriba; 2, 4, 6 abajo)
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      const topNum = comp.terminals[p * 2]?.name ?? `${p * 2 + 1}`;
      const botNum = comp.terminals[p * 2 + 1]?.name ?? `${p * 2 + 2}`;
      ctx.fillText(topNum, ox - 5, 11);
      ctx.fillText(botNum, ox - 5, 56);
    }

    // Caja de ajuste / rearme del relé térmico a la izquierda (en X = -28, Y = 22..38)
    ctx.save();
    ctx.fillStyle = isTripped ? '#fee2e2' : '#f8fafc';
    ctx.strokeStyle = isTripped ? '#ef4444' : '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.fillRect(-28, 22, 12, 16);
    ctx.strokeRect(-28, 22, 12, 16);
    ctx.fillStyle = isTripped ? '#b91c1c' : '#475569';
    ctx.font = 'bold 7.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isTripped ? 'TRIP' : 'Ir', -22, 30);
    ctx.restore();

    // Tag a la izquierda
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = isTripped ? '#dc2626' : '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(comp.tag, -34, 30);
  }

  private static renderSurgeArrester(
    ctx: CanvasRenderingContext2D,
    comp: CircuitComponent,
    _isSim: boolean
  ) {
    const is3P = comp.type === 'surge_arrester_3p_n';
    const poles = is3P ? 4 : 2;
    const peX = is3P ? 60 : 20;

    // Terminal dots
    ctx.fillStyle = '#0f172a';
    for (const t of comp.terminals) {
      ctx.beginPath();
      ctx.arc(t.relX, t.relY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.8;

    for (let p = 0; p < poles; p++) {
      const ox = p * 40;

      // Lead superior (0 a 16)
      ctx.beginPath();
      ctx.moveTo(ox, 0);
      ctx.lineTo(ox, 16);
      ctx.stroke();

      // Cartucho varistor (caja 14x22)
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.4;
      ctx.fillRect(ox - 7, 16, 14, 22);
      ctx.strokeRect(ox - 7, 16, 14, 22);

      // Símbolo de resistencia no lineal dependiente de la tensión (Varistor /¯)
      ctx.beginPath();
      ctx.moveTo(ox - 4, 34);
      ctx.lineTo(ox + 4, 20);
      ctx.lineTo(ox + 6, 20);
      ctx.stroke();
      ctx.restore();

      // Lead inferior hacia la barra común (38 a 44)
      ctx.beginPath();
      ctx.moveTo(ox, 38);
      ctx.lineTo(ox, 44);
      ctx.stroke();

      // Terminal number at top
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      const topName = comp.terminals[p]?.name ?? `${p + 1}`;
      ctx.fillText(topName, ox - 5, 11);
    }

    // Barra común de descarga a tierra en Y = 44
    ctx.beginPath();
    ctx.moveTo(0, 44);
    ctx.lineTo((poles - 1) * 40, 44);
    // Bajada hacia el borne PE
    ctx.moveTo(peX, 44);
    ctx.lineTo(peX, 60);
    ctx.stroke();

    // Símbolo de puesta a tierra en el lead PE
    ctx.save();
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(peX - 5, 52);
    ctx.lineTo(peX + 5, 52);
    ctx.moveTo(peX - 3, 55);
    ctx.lineTo(peX + 3, 55);
    ctx.moveTo(peX - 1, 58);
    ctx.lineTo(peX + 1, 58);
    ctx.stroke();
    ctx.restore();

    // Terminal PE label
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#16a34a';
    ctx.textAlign = 'left';
    ctx.fillText('PE', peX + 6, 56);

    // Tag a la izquierda
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(comp.tag, -14, 30);
  }

  private static renderTextLabel(ctx: CanvasRenderingContext2D, comp: CircuitComponent) {
    const title = comp.tag || '';
    const caption = comp.state.caption || '';
    const sub = comp.state.subCaption || '';
    const w = comp.state.width || 240;
    const h = comp.state.height || 54;
    const r = 6;

    // Background card
    ctx.fillStyle = comp.state.color || '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, r);
    ctx.fill();
    ctx.stroke();

    // Accent strip
    ctx.fillStyle = comp.state.accentColor || '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(0, 0, 5, h, [r, 0, 0, r]);
    ctx.fill();

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, 12, 18);

    // Caption
    if (caption) {
      ctx.fillStyle = '#334155';
      ctx.font = '500 11px sans-serif';
      ctx.fillText(caption, 12, 33);
    }

    // Subtext
    if (sub) {
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(sub, 12, 46);
    }
  }

  private static renderSvgSymbol(ctx: CanvasRenderingContext2D, comp: CircuitComponent) {
    const url = comp.state.svgUrl;
    const w = comp.state.width || 80;
    const h = comp.state.height || 80;

    // Marco sutil transparente (sin relleno opaco, trazos puros transparentes)
    ctx.save();
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(0, 0, w, h);
    ctx.restore();

    if (url) {
      let img = this.svgImageCache.get(url);
      if (!img) {
        img = new Image();
        img.src = url;
        img.onload = () => {
          if (this.onRedrawNeeded) this.onRedrawNeeded();
        };
        this.svgImageCache.set(url, img);
      }

      if (img.complete && img.naturalWidth > 0) {
        const pad = 6;
        ctx.drawImage(img, pad, pad, w - pad * 2, h - pad * 2);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SVG...', w / 2, h / 2 + 3);
      }
    }

    // Origin Library Badge
    if (comp.state.library) {
      const isRadica = comp.state.library.toLowerCase().includes('radica');
      ctx.fillStyle = isRadica ? '#0284c7' : '#059669';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`[${comp.state.library}]`, w / 2, h + 14);
    }

    // Caption
    if (comp.state.caption) {
      ctx.fillStyle = '#475569';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(comp.state.caption, w / 2, h + 26);
    }
  }

  private static renderMotor(ctx: CanvasRenderingContext2D, comp: CircuitComponent, isSim: boolean) {
    const is3P = comp.type === 'motor_3p' || comp.type === 'motor_3p_star_delta';
    const isStarDelta = comp.type === 'motor_3p_star_delta';
    const is4W = comp.type === 'motor_1p_4w';
    const isRunning = isSim && Boolean(comp.state.energized);
    const direction = comp.state.direction || 'CW';

    // Center and radius of motor
    // 3P: U1=0, V1=40, W1=80, PE=120 => cx = 40, cy = 60, R = 30
    // 1P: U1=0, V1=40, PE=80 => cx = 20, cy = 60, R = 30
    const cx = is3P ? 40 : 20;
    const cy = 60;
    const R = 30;

    // Terminal dots (individual paths to prevent canvas fill polygon bug)
    ctx.fillStyle = '#0f172a';
    for (const t of comp.terminals) {
      ctx.beginPath();
      ctx.arc(t.relX, t.relY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top Leads & PE Connection
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.8;

    if (is3P) {
      // 3-Phase top leads
      // U1 (0, 0) drops to y=20 then angles to (18.8, 38.8) on stator
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 20);
      ctx.lineTo(18.8, 38.8);
      // V1 (40, 0) drops straight to (40, 30)
      ctx.moveTo(40, 0);
      ctx.lineTo(40, 30);
      // W1 (80, 0) drops to y=20 then angles to (61.2, 38.8) on stator
      ctx.moveTo(80, 0);
      ctx.lineTo(80, 20);
      ctx.lineTo(61.2, 38.8);
      ctx.stroke();

      // PE lead (120, 0) drops to y=60 and connects to stator casing at (70, 60)
      ctx.save();
      ctx.strokeStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(120, 0);
      ctx.lineTo(120, 60);
      ctx.lineTo(70, 60);
      ctx.stroke();

      // Tierra física / carcasa en (120, 60)
      ctx.beginPath();
      ctx.moveTo(114, 60);
      ctx.lineTo(126, 60);
      ctx.moveTo(116, 64);
      ctx.lineTo(124, 64);
      ctx.moveTo(118, 68);
      ctx.lineTo(122, 68);
      ctx.stroke();
      ctx.restore();
    } else {
      // 1-Phase top leads
      // U1 (0, 0) drops straight into circle at (0, 37.6)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 37.6);
      // V1 (40, 0) drops straight into circle at (40, 37.6)
      ctx.moveTo(40, 0);
      ctx.lineTo(40, 37.6);
      ctx.stroke();

      // PE lead (80, 0) drops to y=60 and connects to stator casing at (50, 60)
      ctx.save();
      ctx.strokeStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.lineTo(80, 60);
      ctx.lineTo(50, 60);
      ctx.stroke();

      // Tierra física / carcasa en (80, 60)
      ctx.beginPath();
      ctx.moveTo(74, 60);
      ctx.lineTo(86, 60);
      ctx.moveTo(76, 64);
      ctx.lineTo(84, 64);
      ctx.moveTo(78, 68);
      ctx.lineTo(82, 68);
      ctx.stroke();
      ctx.restore();
    }

    // Bottom Leads (if Star-Delta or 1P 4-Wire)
    if (isStarDelta) {
      // W2 (0, 120), U2 (40, 120), V2 (80, 120)
      ctx.beginPath();
      ctx.moveTo(0, 120);
      ctx.lineTo(0, 100);
      ctx.lineTo(18.8, 81.2);
      ctx.moveTo(40, 120);
      ctx.lineTo(40, 90);
      ctx.moveTo(80, 120);
      ctx.lineTo(80, 100);
      ctx.lineTo(61.2, 81.2);
      ctx.stroke();
    } else if (is4W) {
      // U2 (0, 120), V2 (40, 120)
      ctx.beginPath();
      ctx.moveTo(0, 120);
      ctx.lineTo(0, 82.4);
      ctx.moveTo(40, 120);
      ctx.lineTo(40, 82.4);
      ctx.stroke();
    }

    // Motor Stator (outer circle)
    if (isRunning) {
      ctx.save();
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 12;
      ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = isRunning ? '#ecfdf5' : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = isRunning ? '#16a34a' : '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Motor Rotor (inner circle / squirrel cage)
    const rRotor = R * 0.62;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rRotor, 0, Math.PI * 2);
    ctx.strokeStyle = isRunning ? '#16a34a' : '#64748b';
    ctx.lineWidth = 1.2;
    if (isRunning) {
      const time = Date.now() / 1000;
      const speed = 7;
      const angle = (time * speed * (direction === 'CCW' ? -1 : 1)) % (Math.PI * 2);
      ctx.setLineDash([5, 4]);
      ctx.lineDashOffset = -angle * rRotor;
    } else {
      ctx.setLineDash([]);
    }
    ctx.stroke();
    ctx.restore();

    // Inner Labels: 'M' and '3 ~' / '1 ~'
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = isRunning ? '#15803d' : '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', cx, cy - 6);

    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.fillText(is3P ? '3' : '1', cx - 6, cy + 9);

    // Símbolo senoidal AC ~
    ctx.beginPath();
    const wx = cx - 1;
    const wy = cy + 9;
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = isRunning ? '#15803d' : '#0f172a';
    ctx.moveTo(wx, wy);
    ctx.bezierCurveTo(wx + 2.5, wy - 2.8, wx + 2.5, wy - 2.8, wx + 5, wy);
    ctx.bezierCurveTo(wx + 7.5, wy + 2.8, wx + 7.5, wy + 2.8, wx + 10, wy);
    ctx.stroke();

    // Rotation Arrow when energized
    if (isRunning) {
      this.drawRotationArrow(ctx, cx, cy, R * 0.82, direction);
      // Auto-schedule redraw for continuous smooth rotor rotation in simulation
      if (this.onRedrawNeeded) {
        requestAnimationFrame(() => {
          if (this.onRedrawNeeded) this.onRedrawNeeded();
        });
      }
    }

    // Terminal Names & Tag
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';

    // Top terminal names
    for (const t of comp.terminals) {
      if (t.relY === 0) {
        ctx.fillText(t.name, t.relX + 5, 10);
      } else {
        ctx.fillText(t.name, t.relX + 5, t.relY - 4);
      }
    }

    // Component Tag to the LEFT
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    const tagX = is3P ? -14 : -18;
    ctx.fillText(comp.tag, tagX, cy);
  }

  private static drawRotationArrow(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    dir: 'CW' | 'CCW'
  ) {
    ctx.save();
    ctx.strokeStyle = '#16a34a';
    ctx.fillStyle = '#16a34a';
    ctx.lineWidth = 1.6;

    const isCW = dir === 'CW';
    const startAngle = isCW ? -Math.PI * 0.25 : Math.PI * 1.25;
    const endAngle = isCW ? Math.PI * 0.65 : Math.PI * 0.35;

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle, !isCW);
    ctx.stroke();

    // Punta de flecha
    const arrowX = cx + r * Math.cos(endAngle);
    const arrowY = cy + r * Math.sin(endAngle);
    const tangentAngle = endAngle + (isCW ? Math.PI / 2 : -Math.PI / 2);

    ctx.save();
    ctx.translate(arrowX, arrowY);
    ctx.rotate(tangentAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-5, -3.5);
    ctx.lineTo(-5, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  private static svgMetadataCache: Map<string, {
    terminals: Map<string, { x: number; y: number }>;
    viewBox: { minX: number; minY: number; width: number; height: number };
    refTerminal?: { x: number; y: number };
  }> = new Map();

  private static parseSvgMetadata(svgPath: string) {
    if (this.svgMetadataCache.has(svgPath)) return;

    // Fast offline path: use pre-embedded SVG bundle if available
    const embeddedXml = EMBEDDED_SYMBOLS[svgPath];
    if (embeddedXml) {
      this.processSvgXml(svgPath, embeddedXml);
      return;
    }

    // Asynchronously fetch and parse SVG XML to discover terminal IDs
    fetch(svgPath)
      .then((res) => (res.ok ? res.text() : Promise.reject('Failed to load SVG')))
      .then((xmlText) => {
        this.processSvgXml(svgPath, xmlText);
      })
      .catch(() => {
        // Mark as empty so we don't refetch
        this.svgMetadataCache.set(svgPath, {
          terminals: new Map(),
          viewBox: { minX: 0, minY: 0, width: 40, height: 60 },
        });
      });
  }

  private static processSvgXml(svgPath: string, xmlText: string) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      if (!svgEl) return;

      let minX = 0, minY = 0, width = 40, height = 60;
      const vbAttr = svgEl.getAttribute('viewBox');
      if (vbAttr) {
        const parts = vbAttr.split(/[\s,]+/).map(parseFloat);
        if (parts.length === 4) {
          [minX, minY, width, height] = parts;
        }
      }

      const termMap = new Map<string, { x: number; y: number }>();
      // Find all elements whose id contains 'terminal_' or 't_'
      const allElements = doc.querySelectorAll('[id]');
      allElements.forEach((el) => {
        const rawId = el.getAttribute('id') || '';
        const match = rawId.match(/^(?:terminal_|t_)(.+)$/i);
        if (!match) return;
        const termName = match[1].toLowerCase();

        let x = 0;
        let y = 0;
        if (el.tagName.toLowerCase() === 'circle') {
          x = parseFloat(el.getAttribute('cx') || '0');
          y = parseFloat(el.getAttribute('cy') || '0');
        } else if (el.tagName.toLowerCase() === 'rect') {
          x = parseFloat(el.getAttribute('x') || '0') + parseFloat(el.getAttribute('width') || '0') / 2;
          y = parseFloat(el.getAttribute('y') || '0') + parseFloat(el.getAttribute('height') || '0') / 2;
        } else if (el.tagName.toLowerCase() === 'line') {
          x = parseFloat(el.getAttribute('x1') || '0');
          y = parseFloat(el.getAttribute('y1') || '0');
        } else {
          // Generic element fallback
          const bbox = (el as any).getBBox ? (el as any).getBBox() : null;
          if (bbox) {
            x = bbox.x + bbox.width / 2;
            y = bbox.y + bbox.height / 2;
          }
        }

        termMap.set(termName, { x, y });
      });

      // Primary reference terminal for aligning component origin (0, 0)
      let refTerminal: { x: number; y: number } | undefined;
      if (termMap.size > 0) {
        // Find the top-most or first terminal (e.g. 95, 97, 11, 13, 1, etc.)
        let minTermY = Infinity;
        let minTermX = Infinity;
        termMap.forEach((pt) => {
          if (pt.y < minTermY || (pt.y === minTermY && pt.x < minTermX)) {
            minTermY = pt.y;
            minTermX = pt.x;
            refTerminal = pt;
          }
        });
      }

      this.svgMetadataCache.set(svgPath, {
        terminals: termMap,
        viewBox: { minX, minY, width, height },
        refTerminal,
      });

      // Generate actuated red SVG image (replaces dark strokes/fills with CADe_SIMU red #ef4444)
      try {
        const redSvgText = xmlText
          .replace(/#(?:1e293b|0f172a|000000|111827)\b/gi, '#ef4444')
          .replace(/rgb\(\s*(?:30|15|0)\s*,\s*(?:41|23|0)\s*,\s*(?:59|42|0)\s*\)/gi, '#ef4444');
        const redUrl = `data:image/svg+xml;utf8,${encodeURIComponent(redSvgText)}`;
        const redImg = new Image();
        redImg.onload = () => {
          if (this.onRedrawNeeded) this.onRedrawNeeded();
        };
        redImg.onerror = () => {
          (redImg as any)._failed = true;
        };
        redImg.src = redUrl;
        this.svgImageCache.set(`${svgPath}__actuated`, redImg);
      } catch {
        // Ignore blob generation errors
      }

      if (this.onRedrawNeeded) this.onRedrawNeeded();
    } catch {
      // Ignore parsing error
    }
  }

  private static getSvgSourceUrl(svgPath: string): string {
    const embedded = EMBEDDED_SYMBOLS[svgPath];
    if (embedded) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(embedded)}`;
    }
    return svgPath;
  }

  private static renderSvgWithFallback(
    ctx: CanvasRenderingContext2D,
    comp: CircuitComponent,
    isSimulation: boolean,
    svgPath: string,
    defaultViewBox: { minX: number; minY: number; width: number; height: number },
    canvasFallback: () => void,
    isActuated: boolean = false
  ): boolean {
    const shouldTintRed = Boolean(isSimulation && isActuated && comp.type !== 'pilot_light');
    const cacheKey = shouldTintRed ? `${svgPath}__actuated` : svgPath;

    let img = this.svgImageCache.get(cacheKey);

    if (img === undefined) {
      const srcUrl = this.getSvgSourceUrl(svgPath);
      if (shouldTintRed) {
        if (!this.svgImageCache.has(svgPath)) {
          const baseImg = new Image();
          baseImg.onload = () => {
            if (this.onRedrawNeeded) this.onRedrawNeeded();
          };
          baseImg.onerror = () => {
            (baseImg as any)._failed = true;
            if (this.onRedrawNeeded) this.onRedrawNeeded();
          };
          baseImg.src = srcUrl;
          this.svgImageCache.set(svgPath, baseImg);
        }
        this.parseSvgMetadata(svgPath);
        img = this.svgImageCache.get(svgPath);
      } else {
        img = new Image();
        img.onload = () => {
          if (this.onRedrawNeeded) this.onRedrawNeeded();
        };
        img.onerror = () => {
          (img as any)._failed = true;
          if (this.onRedrawNeeded) this.onRedrawNeeded();
        };
        img.src = srcUrl;
        this.svgImageCache.set(svgPath, img);
        this.parseSvgMetadata(svgPath);
      }
    }

    if (img && !img.complete) {
      canvasFallback();
      return true;
    }

    if (!img || (img as any)._failed || img.naturalWidth === 0) {
      canvasFallback();
      return false;
    }

    // Check if SVG has parsed terminal metadata
    const meta = this.svgMetadataCache.get(svgPath);
    const vb = meta?.viewBox || defaultViewBox;

    // Calculate alignment offset so that the primary terminal (e.g. terminal_95) aligns at (0, 0)
    // or use the SVG coordinates directly
    let drawOffsetX = vb.minX;
    let drawOffsetY = vb.minY;

    if (meta?.refTerminal) {
      // Offset SVG so that the reference terminal aligns at (0, 0) in component space
      drawOffsetX = vb.minX - meta.refTerminal.x;
      drawOffsetY = vb.minY - meta.refTerminal.y;

      // Dynamically sync component terminal positions according to the SVG IDs
      meta.terminals.forEach((pt, termKey) => {
        const compTerm = comp.terminals.find(
          (t) => t.id.toLowerCase() === termKey || t.name.toLowerCase() === termKey
        );
        if (compTerm) {
          compTerm.relX = Math.round(pt.x - meta.refTerminal!.x);
          compTerm.relY = Math.round(pt.y - meta.refTerminal!.y);
        }
      });
    }

    // SVG loaded successfully -> Draw image mapped to calibrated coordinates
    ctx.drawImage(img, drawOffsetX, drawOffsetY, vb.width, vb.height);

    // Draw Tag dynamically aligned to the left edge of the SVG artboard (lienzo)
    if (comp.tag) {
      const tagMargin = 1;
      const tagX = drawOffsetX - tagMargin;
      const tagY = drawOffsetY + vb.height / 2 + 2;

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'right';
      ctx.fillText(comp.tag, tagX, tagY);
    }

    // Draw Terminal numbers next to their respective terminals
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    for (const t of comp.terminals) {
      if (!t.name) continue;
      const numX = t.relX + 6;
      const numY = t.relY >= 40 ? t.relY - 6 : t.relY + 10;
      ctx.fillText(t.name, numX, numY);
    }

    return true;
  }

  private static renderTerminals(ctx: CanvasRenderingContext2D, comp: CircuitComponent, _isSim: boolean) {
    for (const t of comp.terminals) {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(t.relX, t.relY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
