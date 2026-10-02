export type PotentialType = 
  | 'NONE'
  | 'L1'
  | 'L2'
  | 'L3'
  | 'N'
  | 'PE'
  | 'DC_POS'
  | 'DC_NEG';

export type WireType = 
  | 'phase' 
  | 'phase_l1' 
  | 'phase_l2' 
  | 'phase_l3' 
  | 'neutral' 
  | 'pe' 
  | 'dc_pos' 
  | 'dc_neg';

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircuitSnapshot {
  components: CircuitComponent[];
  wires: Wire[];
  manualNodes: Point[];
  suppressedNodes: Point[];
}

export interface Terminal {
  id: string;
  name: string; // e.g. "13", "14", "A1", "A2", "L", "N", "X1", "X2", "1", "2"
  relX: number; // Offset relative to component (x, y)
  relY: number;
  potential: PotentialType;
}

export type ComponentCategory = 
  | 'power' 
  | 'protections'
  | 'control' 
  | 'contactors'
  | 'motors'
  | 'coils' 
  | 'contacts' 
  | 'signaling'
  | 'sensors';

export type ManualActionType = 'none' | 'toggle' | 'momentary';

export interface ComponentDefinition {
  type: string;
  category: ComponentCategory;
  name: string;
  defaultTag: string;
  width: number;
  height: number;
  poles?: number;
  manualAction?: ManualActionType;
  terminals: Omit<Terminal, 'potential'>[];
  dividerBefore?: boolean;
  hidden?: boolean;
}

export interface CircuitComponent {
  id: string;
  type: string;
  tag: string;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
  mirrorH?: boolean; // Flip horizontal (left/right)
  mirrorV?: boolean; // Flip vertical (top/bottom)
  terminals: Terminal[];
  state: {
    pressed?: boolean; // For pushbuttons
    closed?: boolean;  // For switches/contacts
    energized?: boolean; // For coils / lights
    tripped?: boolean;  // For circuit breakers / thermal relays
    color?: string;    // For pilot lights (e.g. green, red, amber)
    latching?: boolean; // For emergency pushbuttons (false = sin retención, true = con retención)
    protectionType?: 'mag' | 'mag_thermal'; // For motor breakers (mag = magnetic, mag_thermal = thermal-magnetic)
    direction?: 'CW' | 'CCW'; // For motors (CW = clockwise, CCW = counter-clockwise)
    position?: number; // For multi-position rotary switches (e.g. 0, 1, 2 for switch_I_0_II)
    switchStep?: number; // Cycle step: 0 -> 1 -> 2 -> 3
    poles?: number;
    svgUrl?: string;
    caption?: string;
    subCaption?: string;
    library?: string;
    width?: number;
    height?: number;
    accentColor?: string;
    timeValue?: number; // Configured delay duration (e.g. 5)
    timeUnit?: 's' | 'min' | 'h'; // Unit of delay
    timeElapsed?: number; // Milliseconds elapsed during simulation
    timerActive?: boolean; // True when timer delay is finished or output contact triggered
    timerDays?: string[]; // E.g. ['L', 'M', 'X', 'J', 'V']
    timerOnTime?: string; // E.g. '08:00'
    timerOffTime?: string; // E.g. '18:00'
    timerManualTest?: boolean; // True to force active in simulation test mode
    bistableSet?: boolean; // For bistable coil memory state
    stepRelayActive?: boolean; // For step relay / telerruptor toggle state
    prevEnergized?: boolean; // For rising edge detection on impulse relays / step relays
    fuseBlown?: boolean; // For fuse blown state
  };
}

export interface Wire {
  id: string;
  type: WireType;
  points: Point[]; // Sequence of orthogonal waypoints
  potential: PotentialType;
}

export interface SimulationResult {
  running: boolean;
  shortCircuit: boolean;
  shortCircuitMessage?: string;
  shortCircuitLocation?: Point;
  activeCoils: string[]; // Set of energized tags e.g. ["-KM1"]
}
