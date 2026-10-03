import React, { useState } from 'react';
import { CRYO_KEYS } from '../../data/gameData';
import { CryoKey } from '../../types/game';
import { HintSystem } from '../HintSystem';
import { sound } from '../../utils/audio';
import { Scale, Flame, ArrowDownCircle, CheckCircle2, AlertTriangle, ArrowRight, Zap, Info } from 'lucide-react';

interface Level2ElevatorProps {
  onComplete: (digit: string) => void;
  isCompleted: boolean;
  onNextLevel: () => void;
}

export const Level2Elevator: React.FC<Level2ElevatorProps> = ({
  onComplete,
  isCompleted,
  onNextLevel,
}) => {
  // Slots: 4 slots for 4 keys in thermal conductivity order
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);

  // Testing station states
  const [testedKeyId, setTestedKeyId] = useState<string | null>(null);
  const [measuredWeight, setMeasuredWeight] = useState<number | null>(null);
  const [measuredConductivity, setMeasuredConductivity] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Inertial balance counterweight dial (Target: 780g)
  const [counterweightGrams, setCounterweightGrams] = useState<number>(500);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showManual, setShowManual] = useState<boolean>(false);

  const TARGET_COUNTERWEIGHT = 780;
  const SECRET_DIGIT = '3';

  // Test selected key in diagnostic station
  const handleAnalyzeKey = (key: CryoKey) => {
    sound.playRelayClick();
    setIsAnalyzing(true);
    setTestedKeyId(key.id);
    setMeasuredWeight(null);
    setMeasuredConductivity(null);

    setTimeout(() => {
      sound.playLaserDisrupt();
      setMeasuredWeight(key.weightGrams);
      setMeasuredConductivity(key.thermalConductivity);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleAssignToSlot = (slotIdx: number) => {
    if (isCompleted) return;
    sound.playClick();
    if (!selectedKeyId) return;

    const newSlots = [...slots];
    const prevIdx = newSlots.indexOf(selectedKeyId);
    if (prevIdx !== -1) {
      newSlots[prevIdx] = null;
    }
    newSlots[slotIdx] = selectedKeyId;
    setSlots(newSlots);
    setSelectedKeyId(null);
    setErrorMessage(null);
  };

  const handleClearSlot = (slotIdx: number) => {
    if (isCompleted) return;
    sound.playClick();
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);
    setErrorMessage(null);
  };

  const handleIgnition = () => {
    sound.playRelayClick();
    setErrorMessage(null);

    if (slots.some((s) => s === null)) {
      sound.playWrong();
      setErrorMessage('ERROR: Debes colocar las 4 llaves criogénicas en los 4 receptores de ignición.');
      return;
    }

    if (counterweightGrams !== TARGET_COUNTERWEIGHT) {
      sound.playWrong();
      setErrorMessage(
        `ERROR DE CONTRAPESO: El dial inercial está en ${counterweightGrams}g, pero debe calibrarse exactamente al peso de la llave más densa.`
      );
      return;
    }

    // Correct thermal conductivity ascending order:
    // 1. key_a (Aerogel-Ti: 0.08 W/m·K)
    // 2. key_c (Osmio-W: 87 W/m·K)
    // 3. key_b (Cobre-Bi: 385 W/m·K)
    // 4. key_d (Grafeno-Ag: 429 W/m·K)
    const correctOrder = ['key_a', 'key_c', 'key_b', 'key_d'];
    const isCorrect = slots.every((val, idx) => val === correctOrder[idx]);

    if (isCorrect) {
      sound.playDoorOpen();
      sound.playSuccessChord();
      onComplete(SECRET_DIGIT);
    } else {
      sound.playWrong();
      setErrorMessage(
        'CHOQUE TÉRMICO PREVENIDO: La secuencia de disipación térmica es incorrecta. Las bobinas requieren orden estricto de conductividad térmica (k) ascendente.'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-900/60 bg-[#090e18] p-6 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Sector 02 · Pozo del Ascensor Geotérmico</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white tracking-wide">
              Activación del Ascensor Subterráneo (-1,200m)
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
              El ascensor magnético requiere acoplar 4 cilindros de aleación criogénica en orden físico deducido
              de sus propiedades termo-mecánicas (conductividad térmica k y masa). Utiliza el banco de ensayo
              espectrométrico para analizarlas.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setShowManual(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900 transition-colors text-xs font-mono cursor-pointer shrink-0"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Manual Termodinámico</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Keys inventory & Diagnostic Station */}
        <div className="lg:col-span-6 space-y-4">
          {/* Key Inventory */}
          <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 space-y-3">
            <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider block">
              Llaves Criogénicas de Aleación
            </span>
            <p className="text-[11px] text-slate-400 font-mono">
              Haz clic en una llave para examinarla en el banco de ensayo o para colocarla en un receptor del
              ascensor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CRYO_KEYS.map((k) => {
                const isSelected = selectedKeyId === k.id;
                const isAssigned = slots.includes(k.id);

                return (
                  <div
                    key={k.id}
                    className={`p-3 rounded-lg border transition-all text-xs font-mono ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : isAssigned
                        ? 'border-slate-800 bg-slate-900/20 text-slate-500'
                        : 'border-slate-800 bg-slate-900/50 hover:border-cyan-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-slate-200">{k.name}</span>
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: k.colorHex, boxShadow: `0 0 6px ${k.colorHex}` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mb-2">{k.composition}</div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleAnalyzeKey(k)}
                        className="flex-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>Analizar</span>
                      </button>
                      <button
                        disabled={isCompleted}
                        onClick={() => {
                          sound.playClick();
                          setSelectedKeyId(isSelected ? null : k.id);
                        }}
                        className={`flex-1 py-1 px-2 rounded text-[10px] font-semibold cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500 text-black'
                            : isAssigned
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60'
                        }`}
                      >
                        {isSelected ? 'Seleccionada' : isAssigned ? 'En ranura' : 'Elegir'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Test Bench */}
          <div className="bg-[#060a12] border border-cyan-900/40 rounded-xl p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                Estación de Análisis Físico
              </span>
              {isAnalyzing && (
                <span className="text-[10px] text-cyan-400 animate-pulse">Escaneando cristal...</span>
              )}
            </div>

            {testedKeyId ? (
              <div className="p-3.5 bg-slate-900/60 border border-cyan-900/50 rounded-lg space-y-2.5">
                <div className="text-xs font-bold text-slate-200">
                  {CRYO_KEYS.find((k) => k.id === testedKeyId)?.name}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-cyan-400" /> Masa Medida:
                    </span>
                    <span className="font-bold text-cyan-300 text-sm">
                      {measuredWeight !== null ? `${measuredWeight} g` : '---'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" /> Conductividad Térmica (k):
                    </span>
                    <span className="font-bold text-amber-300 text-sm">
                      {measuredConductivity !== null ? `${measuredConductivity} W/(m·K)` : '---'}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  {CRYO_KEYS.find((k) => k.id === testedKeyId)?.description}
                </p>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-600 text-xs border border-dashed border-slate-800 rounded-lg">
                Inserta una llave en el analizador para medir su conductividad térmica (k) y masa (g).
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Elevator Core Ignition Slots */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Matriz de Receptores Criogénicos (Ranuras 1 a 4)
              </span>
              <span className="text-[11px] text-slate-500">
                {slots.filter(Boolean).length}/4 acopladas
              </span>
            </div>

            <div className="space-y-3">
              {[0, 1, 2, 3].map((slotIdx) => {
                const assignedKeyId = slots[slotIdx];
                const keyObj = CRYO_KEYS.find((k) => k.id === assignedKeyId);

                return (
                  <div
                    key={slotIdx}
                    onClick={() => handleAssignToSlot(slotIdx)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      keyObj
                        ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                        : selectedKeyId
                        ? 'bg-slate-900/40 border-cyan-500/30 border-dashed hover:border-cyan-400'
                        : 'bg-slate-900/20 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded bg-slate-900 border border-cyan-900 flex items-center justify-center font-bold text-xs text-cyan-400">
                        0{slotIdx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          Receptor Térmico #{slotIdx + 1}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {slotIdx === 0
                            ? 'Etapa inicial: menor conductividad térmica'
                            : slotIdx === 3
                            ? 'Etapa final: máxima conductividad térmica'
                            : 'Gradiente intermedio de transferencia'}
                        </div>
                      </div>
                    </div>

                    {keyObj ? (
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-200 block">{keyObj.name}</span>
                          <span className="text-[10px] text-amber-400">
                            k: {keyObj.thermalConductivity} W/m·K · {keyObj.weightGrams}g
                          </span>
                        </div>
                        {!isCompleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearSlot(slotIdx);
                            }}
                            className="text-[10px] text-red-400 hover:text-red-300 px-2 py-0.5 rounded bg-red-950/40 border border-red-900/60"
                          >
                            Retirar
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600">
                        {selectedKeyId ? 'Click para insertar llave seleccionada' : '[Cilindro Vacío]'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Counterweight Slider */}
            <div className="p-4 bg-[#060a12] border border-cyan-900/40 rounded-lg space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  Regulador Inercial de Contrapeso
                </span>
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  {counterweightGrams} <span className="text-[10px] text-slate-400">g</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={isCompleted}
                  onClick={() => {
                    sound.playClick();
                    setCounterweightGrams((w) => Math.max(100, w - 20));
                  }}
                  className="px-2 py-1 bg-slate-800 text-slate-200 rounded text-xs cursor-pointer"
                >
                  -20
                </button>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="10"
                  disabled={isCompleted}
                  value={counterweightGrams}
                  onChange={(e) => {
                    sound.playClick();
                    setCounterweightGrams(Number(e.target.value));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <button
                  disabled={isCompleted}
                  onClick={() => {
                    sound.playClick();
                    setCounterweightGrams((w) => Math.min(1000, w + 20));
                  }}
                  className="px-2 py-1 bg-slate-800 text-slate-200 rounded text-xs cursor-pointer"
                >
                  +20
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Regla: Calibrar exactamente a la masa de la llave con mayor inercia gravitacional.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-lg text-red-200 text-xs font-mono flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action */}
            {!isCompleted ? (
              <button
                onClick={handleIgnition}
                className="w-full py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowDownCircle className="w-4 h-4" />
                <span>Cebar Bobinas e Iniciar Descenso</span>
              </button>
            ) : (
              <div className="p-5 bg-emerald-950/30 border border-emerald-500/50 rounded-xl space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-base uppercase text-emerald-300">
                      Ascensor Geotérmico Operativo
                    </h3>
                    <p className="text-xs font-mono text-emerald-400/80">
                      Gradiente térmico equilibrado. Descenso a -1,200m en curso.
                    </p>
                  </div>
                </div>

                {/* Secret Code Digit 2 */}
                <div className="p-3 bg-[#060a12] border border-cyan-500/40 rounded-lg">
                  <div className="text-[10px] text-cyan-400 font-mono uppercase font-bold tracking-wider mb-1">
                    Fragmento de Seguridad Revelado en la Consola del Motor:
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-mono">
                      Código Maestro Boreas · Posición 2:
                    </span>
                    <span className="text-2xl font-bold font-display text-cyan-300 glow-cyan">
                      {SECRET_DIGIT}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Registrado en tu Bitácora táctica.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onNextLevel();
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Avanzar al Nivel 3: Pasillo de Sensores Láser</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Graduated Hint System */}
      <HintSystem
        hints={{
          level1:
            'Examina cada llave en la estación de análisis para registrar su peso (g) y conductividad térmica k (W/m·K).',
          level2:
            'Ordena las llaves de menor a mayor conductividad térmica (k): 0.08 < 87 < 385 < 429. Para el contrapeso, busca la llave más pesada de todas.',
          level3:
            'Solución completa: Ranura 1: Llave Alfa (0.08 W/m·K) -> Ranura 2: Llave Gamma (87 W/m·K) -> Ranura 3: Llave Beta (385 W/m·K) -> Ranura 4: Llave Delta (429 W/m·K). Dial de contrapeso: 780 g (el peso de la Llave Gamma).',
        }}
      />

      {/* Manual Modal */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-[#090e18] border border-cyan-500/40 rounded-lg p-6 font-mono text-xs text-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
              <h3 className="font-display font-bold text-sm text-cyan-300 uppercase">
                Manual de Ingeniería: Protocolo de Arranque Sub-Glaciar
              </h3>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowManual(false);
                }}
                className="text-slate-400 hover:text-white px-2 py-1 border border-slate-800 rounded"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 leading-relaxed">
              <p className="text-amber-300">
                <strong>ATENCIÓN AL OPERADOR DE CRIOPLATAFORMA:</strong>
              </p>
              <p>
                Los motores de inducción del pozo operan sumergidos a -70°C. Si se transfiere calor de forma
                abrupta o desordenada, las aleaciones sufren microfisuras por choque térmico.
              </p>
              <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded space-y-1.5">
                <div>
                  <strong>Regla de Disipación Calórica:</strong> Los 4 cilindros deben montarse en orden
                  estricto de <strong>menor a mayor conductividad térmica</strong> ($k$).
                </div>
                <div>
                  <strong>Regla de Amortiguación Gravitacional:</strong> El rotor inercial debe balancearse
                  al <strong>peso exacto del componente más masivo</strong> (la llave con mayor número de gramos).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
