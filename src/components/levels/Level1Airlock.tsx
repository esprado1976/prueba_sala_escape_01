import React, { useState } from 'react';
import { WEATHER_PATTERNS } from '../../data/gameData';
import { WeatherPattern } from '../../types/game';
import { HintSystem } from '../HintSystem';
import { sound } from '../../utils/audio';
import { Wind, Gauge, Lock, Unlock, Eye, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface Level1AirlockProps {
  onComplete: (digit: string) => void;
  isCompleted: boolean;
  onNextLevel: () => void;
}

export const Level1Airlock: React.FC<Level1AirlockProps> = ({
  onComplete,
  isCompleted,
  onNextLevel,
}) => {
  // Slots: 5 positions to fill with pattern IDs
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null, null]);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [pressureHpa, setPressureHpa] = useState<number>(750); // Target is 680 hPa
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDocModal, setShowDocModal] = useState<boolean>(false);

  const TARGET_PRESSURE = 680;
  const SECRET_DIGIT = '7';

  // Handle assigning a pattern to a slot
  const handleAssignToSlot = (slotIndex: number) => {
    if (isCompleted) return;
    sound.playClick();
    if (!selectedPatternId) return;

    const newSlots = [...slots];
    // If pattern was in another slot, remove it
    const existingIndex = newSlots.indexOf(selectedPatternId);
    if (existingIndex !== -1) {
      newSlots[existingIndex] = null;
    }
    newSlots[slotIndex] = selectedPatternId;
    setSlots(newSlots);
    setSelectedPatternId(null);
    setErrorMessage(null);
  };

  const handleClearSlot = (slotIndex: number) => {
    if (isCompleted) return;
    sound.playClick();
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setErrorMessage(null);
  };

  const handleVerify = () => {
    sound.playRelayClick();
    setErrorMessage(null);

    // Check if all 5 slots are populated
    if (slots.some((s) => s === null)) {
      sound.playWrong();
      setErrorMessage('ERROR: Debes asignar un patrón meteorológico a cada una de las 5 ranuras estratificadas.');
      return;
    }

    // Verify pressure
    if (pressureHpa !== TARGET_PRESSURE) {
      sound.playWrong();
      setErrorMessage(
        `ERROR BAROMÉTRICO: La presión de cabina (${pressureHpa} hPa) no coincide con la presión polar de meseta (680 hPa).`
      );
      return;
    }

    // Verify correct order:
    // Slot 0: pat_katabatic
    // Slot 1: pat_inversion
    // Slot 2: pat_vortex
    // Slot 3: pat_sam
    // Slot 4: pat_aurora
    const correctOrder = ['pat_katabatic', 'pat_inversion', 'pat_vortex', 'pat_sam', 'pat_aurora'];
    const isOrderCorrect = slots.every((val, idx) => val === correctOrder[idx]);

    if (isOrderCorrect) {
      sound.playDoorOpen();
      sound.playSuccessChord();
      onComplete(SECRET_DIGIT);
    } else {
      sound.playWrong();
      setErrorMessage(
        'SECUENCIA METEOROLÓGICA INCORRECTA: El gradiente adiabático o la progresión altitudinal es incoherente. Consulta la bitácora climática.'
      );
    }
  };

  const slotLabels = [
    { title: 'Nivel 1: Capa Límite Superficial', hint: 'Viento denso de gravedad polar' },
    { title: 'Nivel 2: Troposfera Inferior', hint: 'Gradiente criogénico anómalo' },
    { title: 'Nivel 3: Estratosfera Media', hint: 'Torbellino circumpolar continuo' },
    { title: 'Nivel 4: Tropopausa Dinámica', hint: 'Oscilación barométrica de latitudes' },
    { title: 'Nivel 5: Termósfera / Ionosfera', hint: 'Precipitación y resonancia electromagnética' },
  ];

  return (
    <div className="space-y-6">
      {/* Sector Banner */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-900/60 bg-[#090e18] p-6 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Sector 01 · Compuerta Exterior de Presión</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white tracking-wide">
              Desbloqueo de la Esclusa Criosférica
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
              Para ingresar a la estación subterránea, debes alinear el ciclo atmosférico polar en orden
              termodinámico ascendente (desde el suelo antártico hasta la ionosfera) y calibrar el barómetro
              polar a la altitud de la meseta (680 hPa).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setShowDocModal(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900 transition-colors text-xs font-mono cursor-pointer"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Ver Diario Meteorológico</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Puzzle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stratified Slots */}
        <div className="lg:col-span-7 bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
            <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              Columna de Alineación Atmosférica (5 Fases)
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {slots.filter(Boolean).length}/5 asignados
            </span>
          </div>

          <div className="space-y-3">
            {slotLabels.map((slotInfo, idx) => {
              const assignedPatternId = slots[idx];
              const assignedPattern = WEATHER_PATTERNS.find((p) => p.id === assignedPatternId);

              return (
                <div
                  key={idx}
                  onClick={() => handleAssignToSlot(idx)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    assignedPattern
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : selectedPatternId
                      ? 'bg-slate-900/40 border-cyan-500/30 border-dashed hover:border-cyan-400'
                      : 'bg-slate-900/20 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-slate-900 border border-cyan-900 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{slotInfo.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{slotInfo.hint}</div>
                    </div>
                  </div>

                  {assignedPattern ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                          <span>{assignedPattern.symbol}</span>
                          <span>{assignedPattern.name}</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono block">
                          {assignedPattern.barometricSignature}
                        </span>
                      </div>
                      {!isCompleted && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearSlot(idx);
                          }}
                          className="text-[11px] text-red-400 hover:text-red-300 px-2 py-0.5 rounded bg-red-950/40 border border-red-900/60"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-600">
                      {selectedPatternId ? 'Click para asignar seleccionado' : '[Ranura Vacía]'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Barometric Pressure Calibrator */}
          <div className="mt-5 p-4 rounded-lg bg-[#060a12] border border-cyan-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-amber-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                Válvula Barométrica Polar (Presión Meseta Antártica)
              </span>
              <span className="text-sm font-mono font-bold text-cyan-300">
                {pressureHpa} <span className="text-[10px] text-slate-400">hPa</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                disabled={isCompleted}
                onClick={() => {
                  sound.playClick();
                  setPressureHpa((p) => Math.max(500, p - 10));
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono text-xs cursor-pointer"
              >
                -10
              </button>
              <input
                type="range"
                min="550"
                max="850"
                step="5"
                disabled={isCompleted}
                value={pressureHpa}
                onChange={(e) => {
                  sound.playClick();
                  setPressureHpa(Number(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <button
                disabled={isCompleted}
                onClick={() => {
                  sound.playClick();
                  setPressureHpa((p) => Math.min(850, p + 10));
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono text-xs cursor-pointer"
              >
                +10
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Presión requerida: Presión media a 3,488m de altitud sobre la calota de hielo polar.
            </p>
          </div>
        </div>

        {/* Right Column: Pattern Palette & Verify */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pattern Pool */}
          <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 space-y-3">
            <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider block">
              Glifos de Patrones Disponibles
            </span>
            <p className="text-[11px] text-slate-400 font-mono">
              Selecciona un patrón meteorológico y haz click en una ranura para asignarlo. Uno de los patrones
              es un fenómeno oceánico señuelo que no pertenece a la estratificación atmosférica.
            </p>

            <div className="space-y-2">
              {WEATHER_PATTERNS.map((pattern) => {
                const isAssigned = slots.includes(pattern.id);
                const isSelected = selectedPatternId === pattern.id;

                return (
                  <button
                    key={pattern.id}
                    disabled={isCompleted}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPatternId(isSelected ? null : pattern.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs font-mono cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_12px_rgba(6,182,212,0.3)] text-cyan-200'
                        : isAssigned
                        ? 'border-slate-800 bg-slate-900/20 text-slate-500 opacity-60'
                        : 'border-slate-800/80 bg-slate-900/50 hover:border-cyan-700/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        <span className="text-cyan-400">{pattern.symbol}</span>
                        <span>{pattern.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{pattern.historicalEvent}</div>
                    </div>
                    {isAssigned && <span className="text-[10px] text-cyan-500 font-bold">Asignado</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-lg text-red-200 text-xs font-mono flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action or Completion status */}
          {!isCompleted ? (
            <button
              onClick={handleVerify}
              className="w-full py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Activar Sello Barométrico y Abrir Esclusa</span>
            </button>
          ) : (
            <div className="p-5 bg-emerald-950/30 border border-emerald-500/50 rounded-xl space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-base uppercase text-emerald-300">
                    Esclusa Desbloqueada con Éxito
                  </h3>
                  <p className="text-xs font-mono text-emerald-400/80">
                    Sello barométrico igualado a 680 hPa. Presión estabilizada.
                  </p>
                </div>
              </div>

              {/* Reveal Code Digit 1 */}
              <div className="p-3 bg-[#060a12] border border-cyan-500/40 rounded-lg">
                <div className="text-[10px] text-cyan-400 font-mono uppercase font-bold tracking-wider mb-1">
                  Fragmento de Seguridad Revelado en el Dial:
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-mono">
                    Código Maestro Boreas · Posición 1:
                  </span>
                  <span className="text-2xl font-bold font-display text-cyan-300 glow-cyan">
                    {SECRET_DIGIT}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Anotado automáticamente en tu PDA de Bitácora.
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onNextLevel();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Avanzar al Nivel 2: Ascensor Geotérmico</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Graduated Hint System */}
      <HintSystem
        hints={{
          level1:
            'Los patrones meteorológicos deben ordenarse según su altitud geopotencial termodinámica ascendente: empieza en el suelo helado y termina en el espacio exterior.',
          level2:
            'Orden de capas: 1. Suelo: Viento Catabático (flujo gravitacional superficial). 2. Troposfera baja: Inversión Criogénica (-89°C en superficie). 3. Estratosfera: Vórtice Polar (ciclón de 25 km). 4. Tropopausa: Modo Anular del Sur (SAM). 5. Ionosfera: Aurora Australis. Desecha el "Afloramiento Océano Profundo" ya que no es un patrón atmosférico.',
          level3:
            'Solución completa: Asigna en orden: 1. Viento Catabático -> 2. Inversión Criogénica -> 3. Vórtice Polar -> 4. Modo Anular del Sur -> 5. Aurora Australis. Luego ajusta el barómetro a exactamente 680 hPa y pulsa verificar.',
        }}
      />

      {/* Climatological Diary Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#090e18] border border-cyan-500/40 rounded-lg p-6 font-mono text-xs text-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
              <h3 className="font-display font-bold text-sm text-cyan-300 uppercase">
                Cuaderno Meteorológico · Expedición Vostok-1983
              </h3>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowDocModal(false);
                }}
                className="text-slate-400 hover:text-white px-2 py-1 border border-slate-800 rounded"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 leading-relaxed">
              <p>
                <em className="text-cyan-400">&quot;Bitácora del Dr. Mikhailov, 21 de Julio de 1983:&quot;</em>
              </p>
              <p>
                &quot;Para calibrar los servos de la esclusa hermética del sector 7 sin que se congele el sistema
                hidráulico de glicol, es mandatorio respetar la columna baroclinica antártica:&quot;
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                <li>
                  <strong className="text-slate-200">Base del hielo (0 metros):</strong> El aire denso y gélido
                  se precipita pendiente abajo desde el Domo A (los temibles vientos catabáticos).
                </li>
                <li>
                  <strong className="text-slate-200">Primeros 500 metros:</strong> Se genera la inversión térmica
                  criogénica, donde el aire en contacto con el casquete de hielo está más frío que el aire que
                  flota por encima.
                </li>
                <li>
                  <strong className="text-slate-200">Estratosfera polar (15-30 km):</strong> La fuerza de Coriolis
                  y el gradiente térmico sostienen el torbellino ciclónico del Vórtice Polar Antártico.
                </li>
                <li>
                  <strong className="text-slate-200">Frontera de masas de aire:</strong> El Modo Anular del Sur
                  (SAM) oscila gobernando la presión interlatitudinal.
                </li>
                <li>
                  <strong className="text-slate-200">Alta atmósfera (100+ km):</strong> La magnetosfera canaliza
                  el viento solar produciendo la luminiscencia de la Aurora Australis.
                </li>
              </ul>
              <p className="p-2 bg-cyan-950/40 border border-cyan-800/40 rounded text-[11px] text-cyan-200">
                <strong>Nota Barométrica:</strong> La meseta antártica se encuentra a gran elevación barométrica
                efectiva. El calibrador neumático debe fijarse en <strong>680 hPa</strong> para compensar la
                depresión troposférica polar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
