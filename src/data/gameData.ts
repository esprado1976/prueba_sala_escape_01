import { WeatherPattern, CryoKey, LaserBarrier, GridNode } from '../types/game';

// LEVEL 1: Meteorological Patterns
// Chronological & Thermodynamic altitude sequence:
// 1. Viento Catabático (Descenso por gravedad desde meseta a ras del hielo) - Posición 0
// 2. Inversión Térmica Criogénica (Atrapamiento de aire gélido superficial) - Posición 1
// 3. Vórtice Polar Antártico (Ciclón estratosférico circumpolar) - Posición 2
// 4. Modo Anular del Sur / SAM (Oscilación barométrica de latitudes medias a altas) - Posición 3
// 5. Aurora Australis (Ionización geomagnética en la alta atmósfera) - Posición 4
export const WEATHER_PATTERNS: WeatherPattern[] = [
  {
    id: 'pat_katabatic',
    name: 'Viento Catabático Polar',
    symbol: '▼ ⇊',
    altitudeLayer: 'surface',
    historicalEvent: 'Registro Mawson 1912: Ráfagas de gravedad a 320 km/h',
    barometricSignature: 'Alta densidad superficial, pendiente de hielo adiabática',
    description: 'Flujo denso de aire superenfriado que cae por gravedad desde el domo antártico hacia la costa.',
    correctSlotIndex: 0
  },
  {
    id: 'pat_inversion',
    name: 'Inversión Criogénica Superficial',
    symbol: '⊜ ⇋',
    altitudeLayer: 'troposphere',
    historicalEvent: 'Estación Vostok 1983: Gradiente anómalo a -89.2°C',
    barometricSignature: 'dT/dz > 0 en los primeros 500 metros sobre el casquete',
    description: 'Capa donde la temperatura aumenta con la altitud debido a la radiación infrarroja emitida por la nieve.',
    correctSlotIndex: 1
  },
  {
    id: 'pat_vortex',
    name: 'Vórtice Polar Estratosférico',
    symbol: '🌀 ⟲',
    altitudeLayer: 'stratosphere',
    historicalEvent: 'Monitoreo Halley Bay 1985: Aislamiento del aire polar circumpolar',
    barometricSignature: 'Circulación ciclónica cerrada de oeste a este a 25 km de altitud',
    description: 'Torbellino ciclónico persistente a gran escala que aísla térmicamente el continente helado.',
    correctSlotIndex: 2
  },
  {
    id: 'pat_sam',
    name: 'Modo Anular del Sur (SAM)',
    symbol: '◎ ⇄',
    altitudeLayer: 'tropopause',
    historicalEvent: 'Índice de Marshall 1957: Oscilación de presión interlatitudinal',
    barometricSignature: 'Anomalía dipolo entre 40°S y 65°S',
    description: 'Patrón de variabilidad que modula el cinturón de vientos del oeste y el flujo de corrientes oceánicas.',
    correctSlotIndex: 3
  },
  {
    id: 'pat_aurora',
    name: 'Resonancia Aurora Australis',
    symbol: '⚡ ✧',
    altitudeLayer: 'ionosphere',
    historicalEvent: 'Tormenta Solar Carrington: Ionización sincrotrón a 100-300 km',
    barometricSignature: 'Emisión de excitación atómica O(¹S) y N₂⁺ a 557.7 nm',
    description: 'Precipitación de partículas cargadas que excita la termósfera y sella el vector electrodinámico polar.',
    correctSlotIndex: 4
  },
  {
    id: 'pat_decoy',
    name: 'Afloramiento Océano Profundo (CDW)',
    symbol: '≈ ⇈',
    altitudeLayer: 'surface',
    historicalEvent: 'Sondeo Glaciar Thwaites: Intrusión hidrotérmica',
    barometricSignature: 'Gradiente salino sub-plataforma',
    description: 'Flujo oceánico profundo (patrón hidrológico, no patrón atmosférico estratificado de la secuencia de acceso).',
    correctSlotIndex: -1 // Señuelo incorrecto
  }
];

// LEVEL 2: Cryogenic Keys
// Thermodynamic Rule:
// "Para cebar los intercambiadores criogénicos sin fractura por choque térmico:
//  1. Inserte las 4 llaves en estricto orden ASCENDENTE de CONDUCTIVIDAD TÉRMICA (k: W/m·K)
//  2. Calibre el switch de amortiguación gravitacional al peso exacto de la llave más densa (780g)."
//
// Keys:
// A (Aerogel-Titanio): 0.08 W/(m·K) | 142g -> Slot 1
// C (Osmio-Tungsteno): 87 W/(m·K)   | 780g -> Slot 2
// B (Cobre-Bismuto):   385 W/(m·K)  | 410g -> Slot 3
// D (Grafeno-Plata):   429 W/(m·K)  | 295g -> Slot 4
export const CRYO_KEYS: CryoKey[] = [
  {
    id: 'key_a',
    name: 'Llave Alfa (Aerogel-Titanio Criogénico)',
    composition: 'Ti-SiO₂ Aerogel microreticulado al vacío',
    weightGrams: 142,
    thermalConductivity: 0.08,
    colorHex: '#38bdf8',
    accentClass: 'text-sky-400 border-sky-500/50',
    description: 'Ultraligera y extremadamente aislante. Prácticamente bloquea cualquier transferencia térmica.'
  },
  {
    id: 'key_b',
    name: 'Llave Beta (Cobre-Bismuto Sinterizado)',
    composition: 'Cu-Bi 94/6 con recubrimiento de boro',
    weightGrams: 410,
    thermalConductivity: 385,
    colorHex: '#f97316',
    accentClass: 'text-orange-400 border-orange-500/50',
    description: 'Aleación pesada de brillo rojizo mate. Gran conductor de calor en entornos subcero.'
  },
  {
    id: 'key_c',
    name: 'Llave Gamma (Osmio-Tungsteno Polar)',
    composition: 'Os-W 60/40 forjado a ultra-alta presión',
    weightGrams: 780,
    thermalConductivity: 87,
    colorHex: '#a855f7',
    accentClass: 'text-purple-400 border-purple-500/50',
    description: 'Masa formidable con inercia notable. Densidad extrema y disipación moderada.'
  },
  {
    id: 'key_d',
    name: 'Llave Delta (Grafeno-Plata Cuántica)',
    composition: 'Ag monocristalina con nanoplaquetas de grafeno',
    weightGrams: 295,
    thermalConductivity: 429,
    colorHex: '#34d399',
    accentClass: 'text-emerald-400 border-emerald-500/50',
    description: 'Matriz cristalina con anisotropía térmica inusualmente veloz. Máxima conducción calórica.'
  }
];

// LEVEL 3: Laser corridor
// 4 Laser tripwires with acoustic resonance piezoelectric frequencies
// Wall Clue formula:
// "Frecuencia armónica fundamental = 220Hz * Multiplicador armónico"
// - Láser Alfa (Rojo 650nm)   -> 220 Hz, Onda Senoidal (Sine, tono puro continuo)
// - Láser Beta (Ámbar 590nm)  -> 330 Hz (220*1.5), Onda Triángulo (Triangle, armónicos impares suaves)
// - Láser Gamma (Cian 490nm)  -> 440 Hz (220*2), Onda Diente de Sierra (Sawtooth, espectro denso completo)
// - Láser Delta (Violeta 405nm)-> 660 Hz (220*3), Onda Cuadrada (Square, armónicos agresivos)
export const LASER_BARRIERS: LaserBarrier[] = [
  {
    id: 'alpha',
    name: 'Barrera Fotónica Alfa',
    colorName: 'Rojo Rubí (650 nm)',
    wavelengthNm: 650,
    laserColor: 'rgb(239, 68, 68)',
    targetFreqHz: 220,
    targetWaveform: 'sine',
    active: true,
    hintSign: 'Sector 1-A: Cristal de cuarzo monocromático. Resonancia piezoeléctrica en tono fundamental puro (220 Hz · Sinusoidal).'
  },
  {
    id: 'beta',
    name: 'Barrera Fotónica Beta',
    colorName: 'Ámbar Criogénico (590 nm)',
    wavelengthNm: 590,
    laserColor: 'rgb(245, 158, 11)',
    targetFreqHz: 330,
    targetWaveform: 'triangle',
    active: true,
    hintSign: 'Sector 2-B: Modulador fotoacústico de banda media. Quinta justa (330 Hz) con decaimiento simétrico triangular.'
  },
  {
    id: 'gamma',
    name: 'Barrera Fotónica Gamma',
    colorName: 'Cian Polar (490 nm)',
    wavelengthNm: 490,
    laserColor: 'rgb(6, 182, 212)',
    targetFreqHz: 440,
    targetWaveform: 'sawtooth',
    active: true,
    hintSign: 'Sector 3-C: Deflector de iones helados. Requiere tono de concierto (440 Hz) con rampa de sierra continua.'
  },
  {
    id: 'delta',
    name: 'Barrera Fotónica Delta',
    colorName: 'Violeta Ionizante (405 nm)',
    wavelengthNm: 405,
    laserColor: 'rgb(168, 85, 247)',
    targetFreqHz: 660,
    targetWaveform: 'square',
    active: true,
    hintSign: 'Sector 4-D: Barrera de alta energía. Tercer armónico resonante (660 Hz) en onda pulsada cuadrada de 50% ciclo.'
  }
];

// LEVEL 4: Quantum grid initial nodes (5x5 grid)
// Player must rotate wires/gates to establish complete circuit from (0,0) [Start] to (4,4) [Core]
export const INITIAL_GRID_NODES: GridNode[] = [
  // Row 0
  { id: '0-0', row: 0, col: 0, type: 'start', rotation: 0, powered: true, locked: true },
  { id: '0-1', row: 0, col: 1, type: 'wire_corner', rotation: 90, powered: false },
  { id: '0-2', row: 0, col: 2, type: 'wire_straight', rotation: 90, powered: false },
  { id: '0-3', row: 0, col: 3, type: 'wire_corner', rotation: 180, powered: false },
  { id: '0-4', row: 0, col: 4, type: 'wire_straight', rotation: 0, powered: false },

  // Row 1
  { id: '1-0', row: 1, col: 0, type: 'wire_straight', rotation: 0, powered: false },
  { id: '1-1', row: 1, col: 1, type: 'wire_t', rotation: 0, powered: false },
  { id: '1-2', row: 1, col: 2, type: 'gate_not', rotation: 90, powered: false },
  { id: '1-3', row: 1, col: 3, type: 'wire_straight', rotation: 90, powered: false },
  { id: '1-4', row: 1, col: 4, type: 'wire_corner', rotation: 270, powered: false },

  // Row 2
  { id: '2-0', row: 2, col: 0, type: 'wire_corner', rotation: 180, powered: false },
  { id: '2-1', row: 2, col: 1, type: 'gate_and', rotation: 0, powered: false },
  { id: '2-2', row: 2, col: 2, type: 'wire_t', rotation: 270, powered: false },
  { id: '2-3', row: 2, col: 3, type: 'wire_straight', rotation: 0, powered: false },
  { id: '2-4', row: 2, col: 4, type: 'wire_straight', rotation: 90, powered: false },

  // Row 3
  { id: '3-0', row: 3, col: 0, type: 'wire_straight', rotation: 90, powered: false },
  { id: '3-1', row: 3, col: 1, type: 'wire_corner', rotation: 90, powered: false },
  { id: '3-2', row: 3, col: 2, type: 'wire_straight', rotation: 90, powered: false },
  { id: '3-3', row: 3, col: 3, type: 'wire_corner', rotation: 0, powered: false },
  { id: '3-4', row: 3, col: 4, type: 'wire_t', rotation: 180, powered: false },

  // Row 4
  { id: '4-0', row: 4, col: 0, type: 'wire_corner', rotation: 270, powered: false },
  { id: '4-1', row: 4, col: 1, type: 'wire_straight', rotation: 0, powered: false },
  { id: '4-2', row: 4, col: 2, type: 'gate_not', rotation: 0, powered: false },
  { id: '4-3', row: 4, col: 3, type: 'wire_straight', rotation: 90, powered: false },
  { id: '4-4', row: 4, col: 4, type: 'end', rotation: 0, powered: false, locked: true },
];

// LEVEL 5: Master Code Info
// Digits collected from levels:
// Level 1: "7" (Grabado en el cuadrante barométrico del acceso)
// Level 2: "3" (Índice de conductividad mínima efectiva del ascensor)
// Level 3: "9" (Canal maestro del resonador piezoeléctrico en el manual de seguridad)
// Level 4: "4" (Offset de memoria cuántica del volcado del mainframe)
// Level 5: "8" (Deducido de la placa de temperatura crítica criogénica del reactor: -58°C, o del balance energético)
// MASTER CODE = "73948"
export const MASTER_CODE = "73948";
