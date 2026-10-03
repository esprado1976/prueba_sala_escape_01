import React, { useState } from 'react';
import { LASER_BARRIERS } from '../../data/gameData';
import { LaserBarrier } from '../../types/game';
import { HintSystem } from '../HintSystem';
import { sound } from '../../utils/audio';
import { Radio, Volume2, ShieldAlert, CheckCircle2, ArrowRight, Activity, FileText } from 'lucide-react';

interface Level3LasersProps {
  onComplete: (digit: string) => void;
  isCompleted: boolean;
  onNextLevel: () => void;
}

export const Level3Lasers: React.FC<Level3LasersProps> = ({
  onComplete,
  isCompleted,
  onNextLevel,
}) => {
  // Laser state: track which lasers are deactivated
  const [activeLasers, setActiveLasers] = useState<Record<string, boolean>>({
    alpha: true,
    beta: true,
    gamma: true,
    delta: true,
  });

  const [selectedLaserId, setSelectedLaserId] = useState<'alpha' | 'beta' | 'gamma' | 'delta'>('alpha');
  const [frequencyHz, setFrequencyHz] = useState<number>(220);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [showSignsModal, setShowSignsModal] = useState<boolean>(false);

  const SECRET_DIGIT = '9';

  const selectedBarrier = LASER_BARRIERS.find((b) => b.id === selectedLaserId)!;
  const remainingCount = Object.values(activeLasers).filter(Boolean).length;

  const handleTestTone = () => {
    sound.playTone(frequencyHz, waveform, 0.4);
  };

  const handleEmitResonance = () => {
    sound.playRelayClick();
    sound.playTone(frequencyHz, waveform, 0.6);

    const targetLaser = LASER_BARRIERS.find((b) => b.id === selectedLaserId)!;

    if (!activeLasers[selectedLaserId]) {
      setFeedbackMsg({
        text: `La barrera ${targetLaser.name} ya está completamente neutralizada.`,
        isError: false,
      });
      return;
    }

    const freqMatches = Math.abs(frequencyHz - targetLaser.targetFreqHz) <= 5;
    const waveMatches = waveform === targetLaser.targetWaveform;

    if (freqMatches && waveMatches) {
      sound.playLaserDisrupt();
      const updated = { ...activeLasers, [selectedLaserId]: false };
      setActiveLasers(updated);
      setFeedbackMsg({
        text: `¡RESONANCIA PIEZOACÚSTICA LOGRADA! El cristal de la ${targetLaser.name} colapsó. Haz desactivado.`,
        isError: false,
      });

      // Check if all are disabled
      const allDisabled = Object.values(updated).every((v) => !v);
      if (allDisabled) {
        sound.playSuccessChord();
        onComplete(SECRET_DIGIT);
      } else {
        // Auto-switch to next active laser for convenience
        const nextActive = LASER_BARRIERS.find((b) => updated[b.id]);
        if (nextActive) {
          setSelectedLaserId(nextActive.id);
        }
      }
    } else if (!freqMatches) {
      sound.playWrong();
      setFeedbackMsg({
        text: `FRECUENCIA DISONANTE: ${frequencyHz} Hz no induce resonancia en el emisor de ${targetLaser.wavelengthNm} nm. Comprueba los carteles del sector.`,
        isError: true,
      });
    } else {
      sound.playWrong();
      setFeedbackMsg({
        text: `FORMA DE ONDA INCOMPATIBLE: La frecuencia es cercana pero la curva (${waveform}) no concuerda con la geometría del cristal fotoacústico.`,
        isError: true,
      });
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
              <span>Sector 03 · Pasillo Blindado de Seguridad</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white tracking-wide">
              Neutralización de la Red Láser Fotónica
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
              Cuatro haces láser bloquean el pasillo a la sala de control. Los cristales fotoacústicos que los
              proyectan pueden ser sobrecargados emitiendo frecuencias sonoras y formas de onda armónicas
              específicas indicadas en los carteles de advertencia de la base.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setShowSignsModal(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900 transition-colors text-xs font-mono cursor-pointer shrink-0"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Ver Carteles del Pasillo</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Corridor Simulation */}
        <div className="lg:col-span-6 bg-[#070b13] border border-cyan-900/50 rounded-xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Monitoreo Visual del Pasillo de Láseres
            </span>
            <span
              className={`text-xs font-bold ${
                remainingCount === 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {remainingCount === 0 ? 'DESPEJADO' : `${remainingCount}/4 BARRERAS ACTIVAS`}
            </span>
          </div>

          {/* Corridor Graphics */}
          <div className="relative h-64 bg-[#04070e] border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-around p-4 shadow-inner">
            {/* Grid background lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

            {LASER_BARRIERS.map((barrier, index) => {
              const isActive = activeLasers[barrier.id];
              const isSelected = selectedLaserId === barrier.id;

              return (
                <div
                  key={barrier.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedLaserId(barrier.id);
                  }}
                  className={`relative z-10 flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900/80 border border-cyan-400/80'
                      : 'hover:bg-slate-900/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">ZONA {index + 1}</span>
                    <span className="text-xs text-slate-200 font-semibold">{barrier.name}</span>
                  </div>

                  {/* Beam visual */}
                  <div className="flex-1 mx-4 h-2 rounded relative overflow-hidden bg-slate-950/60">
                    {isActive ? (
                      <div
                        className="w-full h-full animate-pulse"
                        style={{
                          backgroundColor: barrier.laserColor,
                          boxShadow: `0 0 12px ${barrier.laserColor}, 0 0 24px ${barrier.laserColor}`,
                        }}
                      />
                    ) : (
                      <div className="w-full h-full border border-dashed border-emerald-900/40 flex items-center justify-center">
                        <span className="text-[9px] text-emerald-500 font-bold uppercase">Neutralizado</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right text-[10px]">
                    {isActive ? (
                      <span className="text-red-400 font-bold uppercase">Activo</span>
                    ) : (
                      <span className="text-emerald-400 font-bold uppercase">Apagado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 space-y-1">
            <p>
              Haz clic en cualquier barrera para seleccionarla como objetivo del sintetizador piezoeléctrico.
            </p>
          </div>
        </div>

        {/* Right Column: Acoustic Tone Synthesizer Console */}
        <div className="lg:col-span-6 bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Sintetizador de Resonancia Sonora
            </span>
            <span className="text-[11px] text-slate-400">
              Objetivo: <strong className="text-cyan-300">{selectedBarrier.name}</strong>
            </span>
          </div>

          {/* Frequency Control */}
          <div className="p-3.5 bg-[#060a12] border border-cyan-900/40 rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Frecuencia de Resonancia:
              </span>
              <span className="text-base font-bold text-cyan-300">
                {frequencyHz} <span className="text-[11px] text-slate-400">Hz</span>
              </span>
            </div>

            <input
              type="range"
              min="150"
              max="880"
              step="5"
              disabled={isCompleted}
              value={frequencyHz}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFrequencyHz(val);
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />

            {/* Quick frequency presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[220, 330, 440, 550, 660, 770].map((f) => (
                <button
                  key={f}
                  disabled={isCompleted}
                  onClick={() => {
                    sound.playClick();
                    setFrequencyHz(f);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                    frequencyHz === f
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {f} Hz
                </button>
              ))}
            </div>
          </div>

          {/* Waveform Selector */}
          <div className="p-3.5 bg-[#060a12] border border-cyan-900/40 rounded-lg space-y-2">
            <span className="text-xs text-slate-300 font-semibold block">
              Forma de Onda del Oscilador:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'sine' as OscillatorType, label: 'Sinusoidal', desc: 'Tono puro' },
                { type: 'triangle' as OscillatorType, label: 'Triangular', desc: 'Armónicos suaves' },
                { type: 'sawtooth' as OscillatorType, label: 'Sierra', desc: 'Rampa cortante' },
                { type: 'square' as OscillatorType, label: 'Cuadrada', desc: 'Pulso binario' },
              ].map((w) => (
                <button
                  key={w.type}
                  disabled={isCompleted}
                  onClick={() => {
                    sound.playClick();
                    setWaveform(w.type);
                  }}
                  className={`p-2 rounded text-center transition-all cursor-pointer ${
                    waveform === w.type
                      ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold">{w.label}</div>
                  <div className="text-[9px] opacity-70">{w.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: Test Tone & Emit Resonance */}
          <div className="flex gap-3">
            <button
              onClick={handleTestTone}
              className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Probar Tono</span>
            </button>

            <button
              onClick={handleEmitResonance}
              disabled={isCompleted}
              className="flex-2 py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-display font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Emitir Pulso Acústico</span>
            </button>
          </div>

          {/* Feedback message */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded-lg border text-xs font-mono leading-relaxed ${
                feedbackMsg.isError
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              }`}
            >
              {feedbackMsg.text}
            </div>
          )}

          {/* Completion Card */}
          {isCompleted && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded-xl space-y-3">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-sm uppercase text-emerald-300">
                    Pasillo Completamente Seguro
                  </h3>
                  <p className="text-[11px] font-mono text-emerald-400/80">
                    Los 4 cristales fotónicos han sido neutralizados armónicamente.
                  </p>
                </div>
              </div>

              {/* Code Digit 3 */}
              <div className="p-3 bg-[#060a12] border border-cyan-500/40 rounded-lg">
                <div className="text-[10px] text-cyan-400 font-mono uppercase font-bold tracking-wider mb-1">
                  Fragmento de Seguridad Revelado en el Terminal Maestro del Pasillo:
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-mono">
                    Código Maestro Boreas · Posición 3:
                  </span>
                  <span className="text-2xl font-bold font-display text-cyan-300 glow-cyan">
                    {SECRET_DIGIT}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Canal Armónico Maestro = 9. Registrado en tu PDA.
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onNextLevel();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Avanzar al Nivel 4: Hackeo del Servidor Central</span>
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
            'Abre los carteles del pasillo para leer las notas sobre las frecuencias armónicas y tipos de onda que desestabilizan cada haz de color.',
          level2:
            'Las frecuencias siguen la serie armónica: Rojo (220 Hz), Ámbar (330 Hz), Cian (440 Hz), Violeta (660 Hz). La forma de onda debe coincidir con la física del cristal: pura (sinusoidal), simétrica (triángulo), rampa (diente de sierra), y conmutada (cuadrada).',
          level3:
            'Solución completa:\n• Láser Alfa (Rojo): 220 Hz + Onda Sinusoidal\n• Láser Beta (Ámbar): 330 Hz + Onda Triangular\n• Láser Gamma (Cian): 440 Hz + Onda Sierra (Sawtooth)\n• Láser Delta (Violeta): 660 Hz + Onda Cuadrada',
        }}
      />

      {/* Warning Signs Modal */}
      {showSignsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#090e18] border border-cyan-500/40 rounded-lg p-6 font-mono text-xs text-slate-300 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
              <h3 className="font-display font-bold text-sm text-cyan-300 uppercase">
                Cartelería de Seguridad Técnica · Pasillo de Láseres
              </h3>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowSignsModal(false);
                }}
                className="text-slate-400 hover:text-white px-2 py-1 border border-slate-800 rounded"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-red-950/20 border border-red-500/40 rounded-lg">
                <span className="text-red-400 font-bold block mb-1">
                  CARTEL 1-A (Sector Láser Rojo · 650 nm):
                </span>
                <p className="text-[11px] text-slate-300">
                  &quot;PRECAUCIÓN: Cristal resonador de cuarzo primario. La vibración piezoeléctrica se excita
                  con un tono fundamental continuo a <strong>220 Hz</strong> en modo de oscilación pura{' '}
                  <strong>Sinusoidal</strong>.&quot;
                </p>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded-lg">
                <span className="text-amber-400 font-bold block mb-1">
                  CARTEL 2-B (Sector Láser Ámbar · 590 nm):
                </span>
                <p className="text-[11px] text-slate-300">
                  &quot;PRECAUCIÓN: Filtro óptico de bismuto polar. Resonancia en la quinta armónica justa a{' '}
                  <strong>330 Hz</strong>, requiriendo un espectro simétrico en diente <strong>Triangular</strong>.&quot;
                </p>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-500/40 rounded-lg">
                <span className="text-cyan-400 font-bold block mb-1">
                  CARTEL 3-C (Sector Láser Cian · 490 nm):
                </span>
                <p className="text-[11px] text-slate-300">
                  &quot;PRECAUCIÓN: Emisor de ionización helada. Su frecuencia destructiva de corte es la nota
                  de concierto <strong>440 Hz</strong>, generada mediante rampa lineal ascendente en{' '}
                  <strong>Diente de Sierra (Sawtooth)</strong>.&quot;
                </p>
              </div>

              <div className="p-3 bg-purple-950/20 border border-purple-500/40 rounded-lg">
                <span className="text-purple-400 font-bold block mb-1">
                  CARTEL 4-D (Sector Láser Violeta · 405 nm):
                </span>
                <p className="text-[11px] text-slate-300">
                  &quot;PELIGRO ALTA ENERGÍA: Barrera cuántica ultravioleta. Requiere el armónico triple de{' '}
                  <strong>660 Hz</strong> modulado en pulsos digitales de onda <strong>Cuadrada</strong>.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
