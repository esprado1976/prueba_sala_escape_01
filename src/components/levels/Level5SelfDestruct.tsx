import React, { useState, useEffect } from 'react';
import { MASTER_CODE } from '../../data/gameData';
import { HintSystem } from '../HintSystem';
import { sound } from '../../utils/audio';
import { AlertOctagon, KeyRound, ShieldAlert, CheckCircle2, RotateCcw, Play, Pause, Flame, Droplets } from 'lucide-react';

interface Level5SelfDestructProps {
  onComplete: () => void;
  discoveredCodes: {
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
  };
  onOpenNotebook: () => void;
}

export const Level5SelfDestruct: React.FC<Level5SelfDestructProps> = ({
  onComplete,
  discoveredCodes,
  onOpenNotebook,
}) => {
  // 5 digit keypad input
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '']);
  const [activeDigitIdx, setActiveDigitIdx] = useState<number>(0);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  // Coolant Valves state (Phase 2 after code verification)
  // Required order: 1: Nitrógeno (-196°C), 2: Argón (-186°C), 3: Helio-3 (-269°C)
  const [valvesOpened, setValvesOpened] = useState<string[]>([]);
  const [valvesError, setValvesError] = useState<string | null>(null);

  // Countdown timer: 600s (10 min)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(540);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [alarmActive, setAlarmActive] = useState<boolean>(true);

  // Countdown effect
  useEffect(() => {
    if (isCodeVerified && valvesOpened.length === 3) {
      sound.stopAlarm();
      return;
    }

    if (alarmActive && !sound.isMuted()) {
      sound.startAlarm();
    }

    const interval = setInterval(() => {
      if (!isTimerPaused && secondsRemaining > 0) {
        setSecondsRemaining((s) => s - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      sound.stopAlarm();
    };
  }, [isTimerPaused, secondsRemaining, alarmActive, isCodeVerified, valvesOpened]);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleKeypadPress = (num: string) => {
    if (isCodeVerified) return;
    sound.playTerminalKey();
    setCodeError(null);

    const newDigits = [...digits];
    newDigits[activeDigitIdx] = num;
    setDigits(newDigits);

    if (activeDigitIdx < 4) {
      setActiveDigitIdx(activeDigitIdx + 1);
    }
  };

  const handleBackspace = () => {
    if (isCodeVerified) return;
    sound.playTerminalKey();
    setCodeError(null);

    const newDigits = [...digits];
    if (newDigits[activeDigitIdx] !== '') {
      newDigits[activeDigitIdx] = '';
      setDigits(newDigits);
    } else if (activeDigitIdx > 0) {
      newDigits[activeDigitIdx - 1] = '';
      setDigits(newDigits);
      setActiveDigitIdx(activeDigitIdx - 1);
    }
  };

  const handleClearCode = () => {
    if (isCodeVerified) return;
    sound.playRelayClick();
    setDigits(['', '', '', '', '']);
    setActiveDigitIdx(0);
    setCodeError(null);
  };

  const handleVerifyMasterCode = () => {
    sound.playRelayClick();
    const entered = digits.join('');

    if (entered.length < 5) {
      sound.playWrong();
      setCodeError('ERROR: Debes introducir los 5 dígitos del código maestro.');
      return;
    }

    if (entered === MASTER_CODE) {
      sound.playSuccessChord();
      setIsCodeVerified(true);
      setCodeError(null);
    } else {
      sound.playWrong();
      setCodeError(
        'CÓDIGO DE ABORTO RECHAZADO: Combinación inválida. Revisa los códigos recuperados en cada nivel en tu Bitácora.'
      );
    }
  };

  // Valves logic
  // Required order: N2 (Nitrógeno) -> AR (Argón) -> HE3 (Helio-3)
  const handleValveToggle = (valveId: string) => {
    sound.playRelayClick();
    setValvesError(null);

    if (valvesOpened.includes(valveId)) return;

    const expectedOrder = ['valve_n2', 'valve_ar', 'valve_he3'];
    const nextExpected = expectedOrder[valvesOpened.length];

    if (valveId === nextExpected) {
      sound.playLaserDisrupt();
      const updated = [...valvesOpened, valveId];
      setValvesOpened(updated);

      if (updated.length === 3) {
        sound.stopAlarm();
        sound.playSuccessChord();
        onComplete();
      }
    } else {
      sound.playWrong();
      setValvesError(
        'SECUENCIA CRIOGÉNICA INCORRECTA: Válvula desincronizada. Las crioválvulas deben purgarse en orden de punto de ebullición decreciente (Nitrógeno -> Argón -> Helio-3).'
      );
      setValvesOpened([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Imminent Meltdown Alert Banner */}
      <div className="relative overflow-hidden rounded-xl border border-red-600/70 bg-gradient-to-r from-red-950/70 via-[#10070b] to-red-950/70 p-6 shadow-[0_0_35px_rgba(239,68,68,0.25)] animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-wider mb-1">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span className="font-bold">Sector 05 · Núcleo de Detonación Criogénica</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white tracking-wide flex items-center gap-2">
              <span className="text-red-500 glow-red">ALERTA ROJA:</span> Autodestrucción Inminente
            </h1>
            <p className="text-xs text-red-200/80 font-mono mt-1 max-w-2xl">
              El cañón ionosférico va a sobrecargar la corriente polar. Introduce el Código Maestro de 5
              dígitos (un dígito descubierto en cada sector previo más el valor térmico crítico) y purga el
              refrigerante criogénico para salvar el clima mundial.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-4 bg-black/60 border border-red-500/50 p-3 rounded-lg">
            <div>
              <div className="text-[10px] text-red-400 font-mono uppercase font-bold">Tiempo de Colapso</div>
              <div className="text-3xl font-display font-bold text-red-400 glow-red tracking-widest font-mono">
                {formatTime(secondsRemaining)}
              </div>
            </div>

            {/* Accessibility Timer Pause / Resume */}
            <button
              onClick={() => {
                sound.playClick();
                setIsTimerPaused(!isTimerPaused);
              }}
              className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors cursor-pointer"
              title={isTimerPaused ? 'Reanudar temporizador' : 'Pausar temporizador (accesibilidad)'}
            >
              {isTimerPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 5-Digit Master Code Keypad */}
        <div className="lg:col-span-6 bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              Consola de Aborto Maestro (5 Dígitos)
            </span>
            <button
              onClick={onOpenNotebook}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Revisar Bitácora ({discoveredCodes.lvl1 ? '1' : '?'}-{discoveredCodes.lvl2 ? '2' : '?'}-
              {discoveredCodes.lvl3 ? '3' : '?'}-{discoveredCodes.lvl4 ? '4' : '?'}-5)
            </button>
          </div>

          {/* 5-Digit Display */}
          <div className="flex justify-center gap-3 py-4">
            {[0, 1, 2, 3, 4].map((idx) => {
              const val = digits[idx];
              const isActive = activeDigitIdx === idx && !isCodeVerified;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (!isCodeVerified) {
                      sound.playClick();
                      setActiveDigitIdx(idx);
                    }
                  }}
                  className={`w-12 h-16 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isCodeVerified
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : isActive
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl font-bold font-display">{val || '-'}</span>
                  <span className="text-[8px] text-slate-500 uppercase mt-0.5">D0{idx + 1}</span>
                </div>
              );
            })}
          </div>

          {/* Code Error */}
          {codeError && (
            <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-lg text-red-200 text-xs font-mono">
              {codeError}
            </div>
          )}

          {/* Keypad */}
          {!isCodeVerified ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleKeypadPress(n)}
                    className="py-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/60 rounded-lg text-sm font-bold text-slate-200 transition-colors shadow cursor-pointer"
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={handleClearCode}
                  className="py-3 bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 rounded-lg text-xs font-bold text-red-300 transition-colors cursor-pointer"
                >
                  CLR
                </button>
                <button
                  onClick={() => handleKeypadPress('0')}
                  className="py-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/60 rounded-lg text-sm font-bold text-slate-200 transition-colors shadow cursor-pointer"
                >
                  0
                </button>
                <button
                  onClick={handleBackspace}
                  className="py-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/60 rounded-lg text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  DEL
                </button>
              </div>

              <button
                onClick={handleVerifyMasterCode}
                className="w-full mt-4 py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer"
              >
                Validar Código Maestro Boreas
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-display font-bold text-emerald-300 uppercase text-sm">
                Código Maestro Aceptado: 73948
              </div>
              <p className="text-xs text-emerald-400/80">
                Protocolo de autodestrucción anulado. Proceda a la purga criogénica para estabilizar el reactor.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Cryogenic Helium & Coolant Valves */}
        <div className="lg:col-span-6 bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Válvulas Criogénicas de Estabilización
            </span>
            <span className="text-[11px] text-slate-500">{valvesOpened.length}/3 purgadas</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Una vez validado el código maestro, purga los refrigerantes en orden de punto de ebullición
            decreciente para absorber el calor del cañón estratosférico:
            <br />
            <strong>1. Nitrógeno (-196°C) → 2. Argón (-186°C) → 3. Helio-3 (-269°C)</strong>
          </p>

          {/* Valves list */}
          <div className="space-y-3 pt-2">
            {[
              {
                id: 'valve_n2',
                name: 'Válvula Nitrógeno Líquido (N₂)',
                temp: '-196 °C',
                desc: 'Refrigerante criogénico primario de choque',
                color: 'text-sky-400',
              },
              {
                id: 'valve_ar',
                name: 'Válvula Argón Líquido (Ar)',
                temp: '-186 °C',
                desc: 'Amortiguador de plasma ionosférico denso',
                color: 'text-purple-400',
              },
              {
                id: 'valve_he3',
                name: 'Válvula Helio Cuántico (³He)',
                temp: '-269 °C',
                desc: 'Superfluido cuántico a 4 Kelvin del cero absoluto',
                color: 'text-cyan-400',
              },
            ].map((valve) => {
              const isOpened = valvesOpened.includes(valve.id);

              return (
                <div
                  key={valve.id}
                  className={`p-3.5 rounded-lg border transition-all flex items-center justify-between ${
                    isOpened
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${valve.color}`}>{valve.name}</span>
                      <span className="text-[10px] text-slate-400">({valve.temp})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{valve.desc}</div>
                  </div>

                  <button
                    disabled={!isCodeVerified || isOpened}
                    onClick={() => handleValveToggle(valve.id)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      isOpened
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : isCodeVerified
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isOpened ? 'Purgada ✓' : 'Purgar'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Valves Error */}
          {valvesError && (
            <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-lg text-red-200 text-xs font-mono">
              {valvesError}
            </div>
          )}
        </div>
      </div>

      {/* Graduated Hint System */}
      <HintSystem
        hints={{
          level1:
            'Cada uno de los 4 niveles previos descubrió un dígito del código: Nivel 1 (Compuerta) = 7, Nivel 2 (Ascensor) = 3, Nivel 3 (Láseres) = 9, Nivel 4 (Servidor) = 4.',
          level2:
            'El quinto dígito proviene de la temperatura criogénica crítica de referencia del reactor (-58°C: último dígito 8). Por tanto el código completo de 5 dígitos es: 7 - 3 - 9 - 4 - 8.',
          level3:
            'Solución completa: 1. Introduce 73948 en el teclado numérico y pulsa "Validar Código Maestro". 2. Luego purga las crioválvulas en orden: Nitrógeno Líquido -> Argón Líquido -> Helio Cuántico.',
        }}
      />
    </div>
  );
};
