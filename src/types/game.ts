export type GameStage = 
  | 'intro'
  | 'level_1'
  | 'level_2'
  | 'level_3'
  | 'level_4'
  | 'level_5'
  | 'victory';

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  discoveredCodeDigit?: string;
  timeSpentSeconds: number;
  hintsUsed: number;
}

export interface ClueEntry {
  id: string;
  title: string;
  source: string;
  level: number;
  content: string;
  dataValue?: string;
  revealed: boolean;
}

// Level 1: Meteorological Patterns
export interface WeatherPattern {
  id: string;
  name: string;
  symbol: string;
  altitudeLayer: 'surface' | 'troposphere' | 'tropopause' | 'stratosphere' | 'ionosphere';
  historicalEvent: string;
  barometricSignature: string;
  description: string;
  correctSlotIndex: number; // 0 to 4 in chronological physical sequence
}

// Level 2: Physics Keys
export interface CryoKey {
  id: 'key_a' | 'key_b' | 'key_c' | 'key_d';
  name: string;
  composition: string;
  weightGrams: number; // Peso físico
  thermalConductivity: number; // W/(m·K)
  colorHex: string;
  accentClass: string;
  description: string;
}

// Level 3: Laser corridor
export interface LaserBarrier {
  id: 'alpha' | 'beta' | 'gamma' | 'delta';
  name: string;
  colorName: string;
  wavelengthNm: number;
  laserColor: string;
  targetFreqHz: number;
  targetWaveform: OscillatorType; // 'sine' | 'triangle' | 'sawtooth' | 'square'
  active: boolean;
  hintSign: string;
}

// Level 4: Quantum Grid Node
export type NodeType = 'start' | 'end' | 'wire_straight' | 'wire_corner' | 'wire_t' | 'gate_and' | 'gate_not';

export interface GridNode {
  id: string;
  row: number;
  col: number;
  type: NodeType;
  rotation: number; // 0, 90, 180, 270 degrees
  powered: boolean;
  locked?: boolean;
}

// Level 5: Code tracker
export interface MasterCodeState {
  digit1: string; // from level 1 (e.g. '7')
  digit2: string; // from level 2 (e.g. '3')
  digit3: string; // from level 3 (e.g. '9')
  digit4: string; // from level 4 (e.g. '4')
  digit5: string; // from level 5 deduction (e.g. '8')
}
