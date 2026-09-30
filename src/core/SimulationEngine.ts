import type { CircuitComponent, Wire, PotentialType, SimulationResult, Point } from './types';
import { Grid } from './Grid';

interface ElectricalNode {
  id: string;
  points: Point[];
  potential: PotentialType;
}

export class SimulationEngine {
  public static solve(
    components: CircuitComponent[],
    wires: Wire[],
    currentActiveCoils?: string[],
    manualNodes?: Point[],
    suppressedNodes?: Point[]
  ): SimulationResult {
    let shortCircuit = false;
    let shortCircuitMessage = '';
    let shortCircuitLocation: Point | undefined;
    // Inicializar con las bobinas que ya estaban activas para permitir autoretención
    const activeCoils = new Set<string>(currentActiveCoils || []);

    // Asegurar que componentes con memoria biestable, telerruptor o temporizador horario activo retengan sus contactos
    for (const comp of components) {
      if (comp.type === 'bistable_coil' && comp.state.bistableSet) {
        activeCoils.add(comp.tag);
      } else if (comp.type === 'step_relay' && comp.state.stepRelayActive) {
        activeCoils.add(comp.tag);
      } else if (comp.type === 'timer' && comp.state.timerActive) {
        activeCoils.add(comp.tag);
      }
    }

    // Reset potentials
    for (const comp of components) {
      for (const t of comp.terminals) {
        t.potential = 'NONE';
      }
      if (comp.type === 'coil' || comp.type === 'pilot_light') {
        comp.state.energized = activeCoils.has(comp.tag);
      }
    }
    for (const w of wires) {
      w.potential = 'NONE';
    }

    // Iterate up to 6 cycles to allow relay logic propagation & self-holding (enclavamiento)
    for (let cycle = 0; cycle < 6; cycle++) {
      // 1. Identify all equipotential clusters (nets)
      const clusters = this.buildEquipotentialClusters(
        components,
        wires,
        activeCoils,
        manualNodes,
        suppressedNodes
      );

      // 2. Inject source potentials into clusters
      for (const comp of components) {
        if (comp.type.startsWith('source_') || comp.type.startsWith('power_') || comp.type === 'ground') {
          for (const t of comp.terminals) {
            let srcPot: PotentialType = 'NONE';
            if (t.name === 'L' || t.name === 'L1') srcPot = 'L1';
            else if (t.name === 'L2') srcPot = 'L2';
            else if (t.name === 'L3') srcPot = 'L3';
            else if (t.name === 'N') srcPot = 'N';
            else if (t.name === 'PE') srcPot = 'PE';
            else if (t.name === '+') srcPot = 'DC_POS';
            else if (t.name === '-') srcPot = 'DC_NEG';

            if (srcPot !== 'NONE') {
              const pt = { x: comp.x + t.relX, y: comp.y + t.relY };
              const cluster = this.findClusterForPoint(clusters, pt);
              if (cluster) {
                if (cluster.potential === 'NONE') {
                  cluster.potential = srcPot;
                } else if (cluster.potential !== srcPot) {
                  // Conflicting potentials = short circuit!
                  if (
                    (cluster.potential.startsWith('L') && (srcPot === 'N' || srcPot === 'PE' || (srcPot.startsWith('L') && srcPot !== cluster.potential))) ||
                    (cluster.potential === 'N' && srcPot.startsWith('L')) ||
                    (cluster.potential === 'DC_POS' && srcPot === 'DC_NEG') ||
                    (cluster.potential === 'DC_NEG' && srcPot === 'DC_POS')
                  ) {
                    shortCircuit = true;
                    shortCircuitMessage = `¡Cortocircuito detectado entre ${cluster.potential} y ${srcPot}!`;
                    shortCircuitLocation = { ...pt };
                  }
                }
              }
            }
          }
        }
      }

      // 3. Assign potentials to terminals and wire segments
      for (const comp of components) {
        for (const t of comp.terminals) {
          const pt = { x: comp.x + t.relX, y: comp.y + t.relY };
          const cluster = this.findClusterForPoint(clusters, pt);
          t.potential = cluster ? cluster.potential : 'NONE';
        }
      }

      for (const w of wires) {
        if (w.points.length > 0) {
          const cluster = this.findClusterForPoint(clusters, w.points[0]);
          w.potential = cluster ? cluster.potential : 'NONE';
        }
      }

      // 4. Evaluate loads (Coils and Pilot Lights)
      let coilStateChanged = false;

      for (const comp of components) {
        if (comp.type === 'coil') {
          const t1 = comp.terminals.find((t) => t.id === 'A1');
          const t2 = comp.terminals.find((t) => t.id === 'A2');
          if (t1 && t2) {
            const isPhaseDiff =
              (t1.potential.startsWith('L') && t2.potential === 'N') ||
              (t1.potential === 'N' && t2.potential.startsWith('L')) ||
              (t1.potential.startsWith('L') && t2.potential.startsWith('L') && t1.potential !== t2.potential);
            const isDcDiff =
              (t1.potential === 'DC_POS' && t2.potential === 'DC_NEG') ||
              (t1.potential === 'DC_NEG' && t2.potential === 'DC_POS');

            const hasPotentialDiff = isPhaseDiff || isDcDiff;
            comp.state.energized = hasPotentialDiff;

            const wasActive = activeCoils.has(comp.tag);
            if (hasPotentialDiff && !wasActive) {
              activeCoils.add(comp.tag);
              coilStateChanged = true;
            } else if (!hasPotentialDiff && wasActive) {
              activeCoils.delete(comp.tag);
              coilStateChanged = true;
            }
          }
        } else if (
          comp.type === 'connection_timer' ||
          comp.type === 'disconnection_timer' ||
          comp.type === 'disconnect_connection_timer'
        ) {
          const t1 = comp.terminals.find((t) => t.id === 'A1');
          const t2 = comp.terminals.find((t) => t.id === 'A2');
          if (t1 && t2) {
            const isPhaseDiff =
              (t1.potential.startsWith('L') && t2.potential === 'N') ||
              (t1.potential === 'N' && t2.potential.startsWith('L')) ||
              (t1.potential.startsWith('L') && t2.potential.startsWith('L') && t1.potential !== t2.potential);
            const isDcDiff =
              (t1.potential === 'DC_POS' && t2.potential === 'DC_NEG') ||
              (t1.potential === 'DC_NEG' && t2.potential === 'DC_POS');

            const hasPotentialDiff = isPhaseDiff || isDcDiff;
            comp.state.energized = hasPotentialDiff;

            // En relé a la desconexión (TOF), al recibir tensión se arma inmediatamente
            if (comp.type === 'disconnection_timer' && hasPotentialDiff) {
              comp.state.timerActive = true;
              comp.state.timeElapsed = 0;
            }

            // Los contactos auxiliares estándar (-KM/-KT) responden de forma INSTANTÁNEA a la excitación A1-A2
            const wasActive = activeCoils.has(comp.tag);
            if (hasPotentialDiff && !wasActive) {
              activeCoils.add(comp.tag);
              coilStateChanged = true;
            } else if (!hasPotentialDiff && wasActive) {
              const otherCoilEnergized = components.some(
                (c) =>
                  c !== comp &&
                  c.tag === comp.tag &&
                  (c.type === 'coil' ||
                    c.type === 'connection_timer' ||
                    c.type === 'disconnection_timer' ||
                    c.type === 'disconnect_connection_timer' ||
                    c.type === 'step_relay' ||
                    c.type === 'bistable_coil') &&
                  Boolean(c.state.energized)
              );
              if (!otherCoilEnergized) {
                activeCoils.delete(comp.tag);
                coilStateChanged = true;
              }
            }
          }
        } else if (comp.type === 'timer') {
          // Relé programador horario semanal
          const t1 = comp.terminals.find((t) => t.id === 'A1');
          const t2 = comp.terminals.find((t) => t.id === 'A2');
          if (t1 && t2) {
            const isPhaseDiff =
              (t1.potential.startsWith('L') && t2.potential === 'N') ||
              (t1.potential === 'N' && t2.potential.startsWith('L')) ||
              (t1.potential.startsWith('L') && t2.potential.startsWith('L') && t1.potential !== t2.potential);
            const isDcDiff =
              (t1.potential === 'DC_POS' && t2.potential === 'DC_NEG') ||
              (t1.potential === 'DC_NEG' && t2.potential === 'DC_POS');
            comp.state.energized = isPhaseDiff || isDcDiff;
          }
          if (comp.state.timerActive) {
            if (!activeCoils.has(comp.tag)) {
              activeCoils.add(comp.tag);
              coilStateChanged = true;
            }
          } else {
            if (activeCoils.has(comp.tag)) {
              activeCoils.delete(comp.tag);
              coilStateChanged = true;
            }
          }
        } else if (comp.type === 'step_relay') {
          // Telerruptor / Relé de pasos:
          // Un impulso (flanco de subida en A1-A2) conmuta el mecanismo de trinquete (stepRelayActive).
          // La bobina física se energiza solo mientras hay tensión presente en A1-A2.
          // Los contactos auxiliares asociados (-K) permanecen cerrados/abiertos según stepRelayActive.
          const t1 = comp.terminals.find((t) => t.id === 'A1');
          const t2 = comp.terminals.find((t) => t.id === 'A2');
          if (t1 && t2) {
            const isPhaseDiff =
              (t1.potential.startsWith('L') && t2.potential === 'N') ||
              (t1.potential === 'N' && t2.potential.startsWith('L')) ||
              (t1.potential.startsWith('L') && t2.potential.startsWith('L') && t1.potential !== t2.potential);
            const isDcDiff =
              (t1.potential === 'DC_POS' && t2.potential === 'DC_NEG') ||
              (t1.potential === 'DC_NEG' && t2.potential === 'DC_POS');

            const hasPotentialDiff = isPhaseDiff || isDcDiff;
            comp.state.energized = hasPotentialDiff;

            // Detección de flanco de subida únicamente en el primer ciclo de este paso
            if (cycle === 0) {
              if (hasPotentialDiff && !comp.state.prevEnergized) {
                comp.state.stepRelayActive = !comp.state.stepRelayActive;
                coilStateChanged = true;
              }
              comp.state.prevEnergized = hasPotentialDiff;
            }

            if (comp.state.stepRelayActive) {
              if (!activeCoils.has(comp.tag)) {
                activeCoils.add(comp.tag);
                coilStateChanged = true;
              }
            } else {
              if (activeCoils.has(comp.tag)) {
                activeCoils.delete(comp.tag);
                coilStateChanged = true;
              }
            }
          }
        } else if (comp.type === 'bistable_coil') {
          // A1 = Set (enclava), B1 = Reset (desenclava), A2 = Común retorno
          const tA1 = comp.terminals.find((t) => t.id === 'A1');
          const tB1 = comp.terminals.find((t) => t.id === 'B1');
          const tA2 = comp.terminals.find((t) => t.id === 'A2');
          if (tA2) {
            const checkDiff = (t: typeof tA2) => {
              if (!t) return false;
              const isPhase =
                (t.potential.startsWith('L') && tA2.potential === 'N') ||
                (t.potential === 'N' && tA2.potential.startsWith('L')) ||
                (t.potential.startsWith('L') && tA2.potential.startsWith('L') && t.potential !== tA2.potential);
              const isDc =
                (t.potential === 'DC_POS' && tA2.potential === 'DC_NEG') ||
                (t.potential === 'DC_NEG' && tA2.potential === 'DC_POS');
              return isPhase || isDc;
            };

            const setPulses = tA1 ? checkDiff(tA1) : false;
            const resetPulses = tB1 ? checkDiff(tB1) : false;

            comp.state.energized = setPulses || resetPulses;

            if (setPulses && !comp.state.bistableSet) {
              comp.state.bistableSet = true;
              coilStateChanged = true;
            } else if (resetPulses && comp.state.bistableSet) {
              comp.state.bistableSet = false;
              coilStateChanged = true;
            }

            if (comp.state.bistableSet) {
              if (!activeCoils.has(comp.tag)) {
                activeCoils.add(comp.tag);
                coilStateChanged = true;
              }
            } else {
              if (activeCoils.has(comp.tag)) {
                activeCoils.delete(comp.tag);
                coilStateChanged = true;
              }
            }
          }
        } else if (comp.type === 'pilot_light') {
          const t1 = comp.terminals.find((t) => t.id === 'X1');
          const t2 = comp.terminals.find((t) => t.id === 'X2');
          if (t1 && t2) {
            const isPhaseDiff =
              (t1.potential.startsWith('L') && t2.potential === 'N') ||
              (t1.potential === 'N' && t2.potential.startsWith('L')) ||
              (t1.potential.startsWith('L') && t2.potential.startsWith('L') && t1.potential !== t2.potential);
            const isDcDiff =
              (t1.potential === 'DC_POS' && t2.potential === 'DC_NEG') ||
              (t1.potential === 'DC_NEG' && t2.potential === 'DC_POS');

            comp.state.energized = isPhaseDiff || isDcDiff;
          }
        } else if (comp.type === 'motor_3p') {
          const tU1 = comp.terminals.find((t) => t.id === 'U1');
          const tV1 = comp.terminals.find((t) => t.id === 'V1');
          const tW1 = comp.terminals.find((t) => t.id === 'W1');
          if (tU1 && tV1 && tW1) {
            const pU = tU1.potential;
            const pV = tV1.potential;
            const pW = tW1.potential;
            const is3Phase =
              pU.startsWith('L') &&
              pV.startsWith('L') &&
              pW.startsWith('L') &&
              pU !== pV &&
              pV !== pW &&
              pU !== pW;

            comp.state.energized = is3Phase;
            if (is3Phase) {
              if (
                (pU === 'L1' && pV === 'L2' && pW === 'L3') ||
                (pU === 'L2' && pV === 'L3' && pW === 'L1') ||
                (pU === 'L3' && pV === 'L1' && pW === 'L2')
              ) {
                comp.state.direction = 'CW';
              } else {
                comp.state.direction = 'CCW';
              }
            }
          }
        } else if (comp.type === 'motor_3p_star_delta') {
          const tU1 = comp.terminals.find((t) => t.id === 'U1');
          const tV1 = comp.terminals.find((t) => t.id === 'V1');
          const tW1 = comp.terminals.find((t) => t.id === 'W1');
          const tW2 = comp.terminals.find((t) => t.id === 'W2');
          const tU2 = comp.terminals.find((t) => t.id === 'U2');
          const tV2 = comp.terminals.find((t) => t.id === 'V2');

          if (tU1 && tV1 && tW1) {
            const pU = tU1.potential;
            const pV = tV1.potential;
            const pW = tW1.potential;
            const has3PhasesTop =
              pU.startsWith('L') &&
              pV.startsWith('L') &&
              pW.startsWith('L') &&
              pU !== pV &&
              pV !== pW &&
              pU !== pW;

            const clusterW2 = tW2 ? this.findClusterForPoint(clusters, { x: comp.x + tW2.relX, y: comp.y + tW2.relY }) : null;
            const clusterU2 = tU2 ? this.findClusterForPoint(clusters, { x: comp.x + tU2.relX, y: comp.y + tU2.relY }) : null;
            const clusterV2 = tV2 ? this.findClusterForPoint(clusters, { x: comp.x + tV2.relX, y: comp.y + tV2.relY }) : null;

            const isStar = Boolean(clusterW2 && clusterU2 && clusterV2 && clusterW2 === clusterU2 && clusterU2 === clusterV2);
            const isDelta = Boolean(
              tW2?.potential.startsWith('L') &&
              tU2?.potential.startsWith('L') &&
              tV2?.potential.startsWith('L') &&
              tW2.potential !== tU1.potential &&
              tU2.potential !== tV1.potential &&
              tV2.potential !== tW1.potential
            );

            const isEnergized = has3PhasesTop && (isStar || isDelta);
            comp.state.energized = isEnergized;

            if (isEnergized) {
              if (
                (pU === 'L1' && pV === 'L2' && pW === 'L3') ||
                (pU === 'L2' && pV === 'L3' && pW === 'L1') ||
                (pU === 'L3' && pV === 'L1' && pW === 'L2')
              ) {
                comp.state.direction = 'CW';
              } else {
                comp.state.direction = 'CCW';
              }
            }
          }
        } else if (comp.type === 'motor_1p') {
          const tU1 = comp.terminals.find((t) => t.id === 'U1');
          const tV1 = comp.terminals.find((t) => t.id === 'V1');
          if (tU1 && tV1) {
            const hasPotentialDiff =
              (tU1.potential.startsWith('L') && tV1.potential === 'N') ||
              (tU1.potential === 'N' && tV1.potential.startsWith('L')) ||
              (tU1.potential === 'DC_POS' && tV1.potential === 'DC_NEG') ||
              (tU1.potential === 'DC_NEG' && tV1.potential === 'DC_POS');

            comp.state.energized = hasPotentialDiff;
            if (hasPotentialDiff) {
              comp.state.direction = 'CW';
            }
          }
        } else if (comp.type === 'motor_1p_4w') {
          const tU1 = comp.terminals.find((t) => t.id === 'U1');
          const tU2 = comp.terminals.find((t) => t.id === 'U2');
          const tV1 = comp.terminals.find((t) => t.id === 'V1');
          const tV2 = comp.terminals.find((t) => t.id === 'V2');

          if (tU1 && tU2 && tV1 && tV2) {
            const hasDiffMain =
              (tU1.potential.startsWith('L') && tU2.potential === 'N') ||
              (tU1.potential === 'N' && tU2.potential.startsWith('L'));
            const hasDiffAux =
              (tV1.potential.startsWith('L') && tV2.potential === 'N') ||
              (tV1.potential === 'N' && tV2.potential.startsWith('L'));

            const isEnergized = hasDiffMain && hasDiffAux;
            comp.state.energized = isEnergized;

            if (isEnergized) {
              const mainL = tU1.potential.startsWith('L');
              const auxL = tV1.potential.startsWith('L');
              comp.state.direction = mainL === auxL ? 'CW' : 'CCW';
            }
          }
        }
      }

      // If coils haven't changed in this cycle, the circuit has stabilized
      if (!coilStateChanged || shortCircuit) {
        break;
      }
    }

    // Synchronize energized state across all auxiliary contacts and power contactors
    for (const comp of components) {
      const isCoilActive = activeCoils.has(comp.tag);
      const isTripped = Boolean(comp.state.tripped) || Boolean(comp.state.pressed);
      if (comp.type.startsWith('contact_') || comp.type.startsWith('contactor_')) {
        comp.state.energized = isCoilActive;
      } else if (comp.type.startsWith('thermal_contact_')) {
        const tagTripped = components.some((c) => c.tag === comp.tag && Boolean(c.state.tripped));
        comp.state.energized = isTripped || tagTripped;
      } else if (comp.type === 'ondelay_no' || comp.type === 'ondelay_nc') {
        const isActuated = components.some(
          (c) => c.tag === comp.tag && c.type === 'connection_timer' && Boolean(c.state.timerActive)
        ) || Boolean(comp.state.pressed);
        comp.state.energized = isActuated;
      } else if (comp.type === 'offdelay_no' || comp.type === 'offdelay_nc') {
        const isActuated = components.some(
          (c) => c.tag === comp.tag && c.type === 'disconnection_timer' && Boolean(c.state.timerActive)
        ) || Boolean(comp.state.pressed);
        comp.state.energized = isActuated;
      } else if (comp.type === 'on_offdelay_no' || comp.type === 'on_offdelay_nc') {
        const isActuated = components.some(
          (c) => c.tag === comp.tag && c.type === 'disconnect_connection_timer' && Boolean(c.state.timerActive)
        ) || Boolean(comp.state.pressed);
        comp.state.energized = isActuated;
      }
    }

    return {
      running: true,
      shortCircuit,
      shortCircuitMessage,
      shortCircuitLocation,
      activeCoils: Array.from(activeCoils),
    };
  }

  private static buildEquipotentialClusters(
    components: CircuitComponent[],
    wires: Wire[],
    activeCoils: Set<string>,
    manualNodes?: Point[],
    suppressedNodes?: Point[]
  ): ElectricalNode[] {
    const parent = new Map<string, string>();

    function key(p: Point): string {
      return `${Math.round(p.x)},${Math.round(p.y)}`;
    }

    function find(k: string): string {
      if (!parent.has(k)) parent.set(k, k);
      let root = k;
      while (root !== parent.get(root)) {
        root = parent.get(root)!;
      }
      let curr = k;
      while (curr !== root) {
        const nxt = parent.get(curr)!;
        parent.set(curr, root);
        curr = nxt;
      }
      return root;
    }

    function union(k1: string, k2: string) {
      const r1 = find(k1);
      const r2 = find(k2);
      if (r1 !== r2) {
        parent.set(r1, r2);
      }
    }

    // 1. Wire internal continuity: each consecutive point in a wire is connected
    for (const w of wires) {
      for (let i = 0; i < w.points.length - 1; i++) {
        union(key(w.points[i]), key(w.points[i + 1]));
      }
    }

    // 2. Wire intersections / T-junctions (conectar en extremos de cable salvo que el usuario lo haya suprimido)
    for (let i = 0; i < wires.length; i++) {
      if (wires[i].points.length === 0) continue;
      const endpoints = [wires[i].points[0], wires[i].points[wires[i].points.length - 1]];

      for (let j = 0; j < wires.length; j++) {
        if (i === j) continue;
        for (const pt of endpoints) {
          // Si el usuario eliminó explícitamente el nodo en esta posición, no conectar
          const isSuppressed = suppressedNodes?.some((sn) => Grid.pointsEqual(sn, pt, 4));
          if (isSuppressed) continue;

          for (let s = 0; s < wires[j].points.length - 1; s++) {
            const dist = Grid.pointToSegmentDistance(pt, wires[j].points[s], wires[j].points[s + 1]);
            if (dist < 3) {
              union(key(pt), key(wires[j].points[s]));
            }
          }
        }
      }
    }

    // 2b. Nodos de conexión manuales creados por el usuario
    if (manualNodes && manualNodes.length > 0) {
      for (const node of manualNodes) {
        const kNode = key(node);
        for (const w of wires) {
          for (let s = 0; s < w.points.length - 1; s++) {
            const dist = Grid.pointToSegmentDistance(node, w.points[s], w.points[s + 1]);
            if (dist < 3.5) {
              union(kNode, key(w.points[s]));
            }
          }
        }
      }
    }

    // 3. Connect terminals to wires that touch them
    for (const comp of components) {
      for (const t of comp.terminals) {
        const pt = { x: comp.x + t.relX, y: comp.y + t.relY };
        const kPt = key(pt);
        // Connect to any wire point or segment passing through this terminal
        for (const w of wires) {
          for (let s = 0; s < w.points.length - 1; s++) {
            const dist = Grid.pointToSegmentDistance(pt, w.points[s], w.points[s + 1]);
            if (dist < 3) {
              union(kPt, key(w.points[s]));
            }
          }
        }
      }
    }

    // 4. Closed switches / pushbuttons / contacts conductivity
    const trippedTags = new Set<string>();
    for (const c of components) {
      if (c.state.tripped) {
        trippedTags.add(c.tag);
      }
    }

    for (const comp of components) {
      const isCoilActive = activeCoils.has(comp.tag);

      if (
        comp.type === 'pushbutton_no' ||
        comp.type === 'switch_no' ||
        comp.type === 'pushbutton_emergency_no' ||
        comp.type === 'limit_no' ||
        comp.type === 'inductive_detector_no'
      ) {
        const isClosed = comp.state.pressed || comp.state.closed;
        if (isClosed && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (
        comp.type === 'pushbutton_nc' ||
        comp.type === 'switch_nc' ||
        comp.type === 'pushbutton_emergency_nc' ||
        comp.type === 'limit_nc' ||
        comp.type === 'inductive_detector_nc'
      ) {
        const isOpen = comp.state.pressed || !comp.state.closed;
        if (!isOpen && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type === 'fuse_I') {
        const isClosed = comp.state.closed !== false && !comp.state.fuseBlown;
        if (isClosed && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type.startsWith('contactor_')) {
        // Contactores de potencia: se cierran ÚNICAMENTE si la bobina (-KM) está activa
        const isClosed = isCoilActive;
        comp.state.energized = isCoilActive;
        comp.state.closed = isCoilActive;
        if (isClosed) {
          const poles = comp.state.poles || 1;
          for (let p = 0; p < poles; p++) {
            const t1 = comp.terminals[p * 2];
            const t2 = comp.terminals[p * 2 + 1];
            if (t1 && t2) {
              const p1 = { x: comp.x + t1.relX, y: comp.y + t1.relY };
              const p2 = { x: comp.x + t2.relX, y: comp.y + t2.relY };
              union(key(p1), key(p2));
            }
          }
        }
      } else if (
        comp.type.startsWith('mcb_') ||
        comp.type.startsWith('motor_breaker_') ||
        comp.type.startsWith('rcd_')
      ) {
        // Disyuntores de protección (Termomagnéticas, Guardamotores, Diferenciales)
        const isClosed = Boolean(comp.state.closed) && !comp.state.tripped;
        if (isClosed) {
          const poles = comp.state.poles || Math.floor(comp.terminals.length / 2);
          for (let p = 0; p < poles; p++) {
            const t1 = comp.terminals[p * 2];
            const t2 = comp.terminals[p * 2 + 1];
            if (t1 && t2) {
              const p1 = { x: comp.x + t1.relX, y: comp.y + t1.relY };
              const p2 = { x: comp.x + t2.relX, y: comp.y + t2.relY };
              union(key(p1), key(p2));
            }
          }
        }
      } else if (comp.type === 'thermal_relay_3p') {
        // Relé térmico bimetálico 3P: las barras sensoras de potencia conducen siempre de 1 a 2, 3 a 4, 5 a 6
        for (let p = 0; p < 3; p++) {
          const t1 = comp.terminals[p * 2];
          const t2 = comp.terminals[p * 2 + 1];
          if (t1 && t2) {
            union(
              key({ x: comp.x + t1.relX, y: comp.y + t1.relY }),
              key({ x: comp.x + t2.relX, y: comp.y + t2.relY })
            );
          }
        }
      } else if (comp.type === 'thermal_contact_no') {
        // Contacto térmico NA (97-98): se cierra si la protección vinculada se dispara
        const isTripped = trippedTags.has(comp.tag) || Boolean(comp.state.tripped) || Boolean(comp.state.pressed);
        comp.state.energized = isTripped;
        if (isTripped && comp.terminals.length >= 2) {
          union(
            key({ x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY }),
            key({ x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY })
          );
        }
      } else if (comp.type === 'thermal_contact_nc') {
        // Contacto térmico NC (95-96): se abre si la protección vinculada se dispara
        const isTripped = trippedTags.has(comp.tag) || Boolean(comp.state.tripped) || Boolean(comp.state.pressed);
        comp.state.energized = isTripped;
        if (!isTripped && comp.terminals.length >= 2) {
          union(
            key({ x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY }),
            key({ x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY })
          );
        }
      } else if (comp.type === 'thermal_contact_no_nc') {
        // Contacto térmico doble: 0-1 (95-96 NC), 2-3 (97-98 NA)
        const isTripped = trippedTags.has(comp.tag) || Boolean(comp.state.tripped) || Boolean(comp.state.pressed);
        comp.state.energized = isTripped;
        if (!isTripped && comp.terminals.length >= 2) {
          union(
            key({ x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY }),
            key({ x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY })
          );
        }
        if (isTripped && comp.terminals.length >= 4) {
          union(
            key({ x: comp.x + comp.terminals[2].relX, y: comp.y + comp.terminals[2].relY }),
            key({ x: comp.x + comp.terminals[3].relX, y: comp.y + comp.terminals[3].relY })
          );
        }
      } else if (comp.type === 'thermal_contact_changeover') {
        // Contacto térmico conmutado: 0 = 95 COM, 1 = 96 NC, 2 = 98 NA
        const isTripped = trippedTags.has(comp.tag) || Boolean(comp.state.tripped) || Boolean(comp.state.pressed);
        comp.state.energized = isTripped;
        const comPt = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
        if (isTripped && comp.terminals.length >= 3) {
          const naPt = { x: comp.x + comp.terminals[2].relX, y: comp.y + comp.terminals[2].relY };
          union(key(comPt), key(naPt));
        } else if (!isTripped && comp.terminals.length >= 2) {
          const ncPt = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(comPt), key(ncPt));
        }
      } else if (comp.type === 'contact_no' || comp.type === 'contact_no_1p') {
        const isClosed = isCoilActive || Boolean(comp.state.pressed) || Boolean(comp.state.closed);
        comp.state.energized = isCoilActive;
        if (isClosed && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type === 'contact_nc' || comp.type === 'contact_nc_1p') {
        const isClosed = !isCoilActive && !comp.state.pressed && comp.state.closed !== false;
        comp.state.energized = isCoilActive;
        if (isClosed && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type === 'ondelay_no') {
        const isActuated = components.some(
          (c) => c.tag === comp.tag && c.type === 'connection_timer' && Boolean(c.state.timerActive)
        ) || Boolean(comp.state.pressed);
        comp.state.energized = isActuated;
        if (isActuated && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type === 'ondelay_nc') {
        const isActuated = components.some(
          (c) => c.tag === comp.tag && c.type === 'connection_timer' && Boolean(c.state.timerActive)
        ) || Boolean(comp.state.pressed);
        comp.state.energized = isActuated;
        const isClosed = !isActuated && comp.state.closed !== false;
        if (isClosed && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type === 'offdelay_no') {
        const isActuated = components.some(
          (c) => c.tag === comp.tag && c.type === 'disconnection_timer' && Boolean(c.state.timerActive)
        ) || Boolean(comp.state.pressed);
        comp.state.energized = isActuated;
        if (isActuated && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type === 'offdelay_nc') {
        const isActuated = components.some(
          (c) => c.tag === comp.tag && c.type === 'disconnection_timer' && Boolean(c.state.timerActive)
        ) || Boolean(comp.state.pressed);
        comp.state.energized = isActuated;
        const isClosed = !isActuated && comp.state.closed !== false;
        if (isClosed && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type === 'on_offdelay_no') {
        const isActuated = components.some(
          (c) => c.tag === comp.tag && c.type === 'disconnect_connection_timer' && Boolean(c.state.timerActive)
        ) || Boolean(comp.state.pressed);
        comp.state.energized = isActuated;
        if (isActuated && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type === 'on_offdelay_nc') {
        const isActuated = components.some(
          (c) => c.tag === comp.tag && c.type === 'disconnect_connection_timer' && Boolean(c.state.timerActive)
        ) || Boolean(comp.state.pressed);
        comp.state.energized = isActuated;
        const isClosed = !isActuated && comp.state.closed !== false;
        if (isClosed && comp.terminals.length >= 2) {
          const p1 = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
          const p2 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(p1), key(p2));
        }
      } else if (comp.type === 'contact_no_nc') {
        // 0-1 NA, 2-3 NC
        const isActuated = isCoilActive || Boolean(comp.state.pressed);
        comp.state.energized = isCoilActive;
        const naClosed = isActuated;
        const ncClosed = !isActuated;
        if (naClosed && comp.terminals.length >= 2) {
          union(
            key({ x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY }),
            key({ x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY })
          );
        }
        if (ncClosed && comp.terminals.length >= 4) {
          union(
            key({ x: comp.x + comp.terminals[2].relX, y: comp.y + comp.terminals[2].relY }),
            key({ x: comp.x + comp.terminals[3].relX, y: comp.y + comp.terminals[3].relY })
          );
        }
      } else if (comp.type === 'contact_changeover') {
        // 0 = COM 11 at (20, 0), 1 = NC 12 at (0, 60), 2 = NA 14 at (40, 60)
        const isActuated = isCoilActive || Boolean(comp.state.pressed);
        comp.state.energized = isCoilActive;
        const comPt = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
        if (isActuated && comp.terminals.length >= 3) {
          // Conectado 11 con 14 (NA cerrado)
          const naPt = { x: comp.x + comp.terminals[2].relX, y: comp.y + comp.terminals[2].relY };
          union(key(comPt), key(naPt));
        } else if (!isActuated && comp.terminals.length >= 2) {
          // Conectado 11 con 12 (NC cerrado en reposo)
          const ncPt = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(comPt), key(ncPt));
        }
      } else if (
        comp.type === 'switch_no_nc' ||
        comp.type === 'pushbutton_no_nc' ||
        comp.type === 'pushbutton_emergency_no_nc' ||
        comp.type === 'limit_no_nc'
      ) {
        // Interruptor / pulsador / final de carrera doble: 11-12 (NC: 0, 1), 13-14 (NA: 2, 3)
        const isActuated = Boolean(comp.state.pressed || comp.state.closed);
        const naClosed = isActuated;
        const ncClosed = !isActuated;
        if (ncClosed && comp.terminals.length >= 2) {
          union(
            key({ x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY }),
            key({ x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY })
          );
        }
        if (naClosed && comp.terminals.length >= 4) {
          union(
            key({ x: comp.x + comp.terminals[2].relX, y: comp.y + comp.terminals[2].relY }),
            key({ x: comp.x + comp.terminals[3].relX, y: comp.y + comp.terminals[3].relY })
          );
        }
      } else if (
        comp.type === 'switch_changeover' ||
        comp.type === 'pushbutton_changeover' ||
        comp.type === 'pushbutton_emergency_changeover' ||
        comp.type === 'limit_changeover'
      ) {
        // Conmutador / inversor: 0 = 11 COM, 1 = 12 NC, 2 = 14 NA
        const isActuated = Boolean(comp.state.pressed || comp.state.closed);
        const comPt = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
        if (isActuated && comp.terminals.length >= 3) {
          // Conectado 11 con 14 (NA cerrado)
          const naPt = { x: comp.x + comp.terminals[2].relX, y: comp.y + comp.terminals[2].relY };
          union(key(comPt), key(naPt));
        } else if (!isActuated && comp.terminals.length >= 2) {
          // Conectado 11 con 12 (NC cerrado)
          const ncPt = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(comPt), key(ncPt));
        }
      } else if (comp.type === 'switch_I_0_II') {
        // Conmutador rotativo I-0-II: 0 = 11 COM (20, 0), 1 = 12 Pos I (0, 60), 2 = 14 Pos II (40, 60)
        const pos = comp.state.position ?? 0;
        const comPt = { x: comp.x + comp.terminals[0].relX, y: comp.y + comp.terminals[0].relY };
        if (pos === 1 && comp.terminals.length >= 2) {
          // Posición I: Conecta 11 con 12
          const p12 = { x: comp.x + comp.terminals[1].relX, y: comp.y + comp.terminals[1].relY };
          union(key(comPt), key(p12));
        } else if (pos === 2 && comp.terminals.length >= 3) {
          // Posición II: Conecta 11 con 14
          const p14 = { x: comp.x + comp.terminals[2].relX, y: comp.y + comp.terminals[2].relY };
          union(key(comPt), key(p14));
        }
      }
    }

    // Group keys by root
    const clusterMap = new Map<string, Point[]>();
    for (const k of parent.keys()) {
      const root = find(k);
      const [x, y] = k.split(',').map(Number);
      if (!clusterMap.has(root)) {
        clusterMap.set(root, []);
      }
      clusterMap.get(root)!.push({ x, y });
    }

    const clusters: ElectricalNode[] = [];
    for (const [id, points] of clusterMap.entries()) {
      clusters.push({
        id,
        points,
        potential: 'NONE',
      });
    }

    return clusters;
  }

  private static findClusterForPoint(clusters: ElectricalNode[], pt: Point): ElectricalNode | undefined {
    return clusters.find((c) => c.points.some((p) => Grid.pointsEqual(p, pt, 3)));
  }
}
