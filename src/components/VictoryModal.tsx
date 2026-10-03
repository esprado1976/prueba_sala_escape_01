import React from 'react';
import { Award, Clock, RotateCcw, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import { sound } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  totalTimeSeconds: number;
  hintsUsedCount: number;
  onRestart: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  totalTimeSeconds,
  hintsUsedCount,
  onRestart,
  onClose,
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(totalTimeSeconds / 60);
  const seconds = totalTimeSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#080d18] border-2 border-emerald-500/60 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col font-mono text-slate-200">
        {/* Banner with Antarctic Aurora visual */}
        <div className="relative h-44 bg-gradient-to-b from-[#0b2427] via-[#091522] to-[#080d18] flex items-center justify-center p-6 border-b border-emerald-900/60 overflow-hidden">
          {/* Stylized Aurora waves */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-cyan-500/10 to-transparent blur-xl" />

          <div className="relative z-10 text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Protocolo Boreas Zero Neutralizado</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide glow-emerald">
              ¡CRIÓSFERA MUNDIAL SALVADA!
            </h1>
            <p className="text-xs text-emerald-200/80 max-w-lg mx-auto">
              La corriente en chorro circumpolar y las plataformas glaciares de la Antártida se han estabilizado
              con éxito.
            </p>
          </div>
        </div>

        {/* Dossier Content */}
        <div className="p-6 space-y-5 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-[#050810] border border-cyan-900/40 space-y-3">
            <h3 className="font-display font-bold text-sm text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Certificado de Rango Operativo
            </h3>
            <div className="text-base font-bold text-amber-300 font-display">
              Rango Asignado: &quot;Arquitecto Supremo de la Criósfera&quot;
            </div>
            <p className="text-slate-400 text-[11px]">
              Has demostrado maestría en termodinámica de aleaciones, meteorología estratosférica histórica,
              resonancia piezoacústica y computación cuántica polar en condiciones extremas.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Tiempo de Misión</span>
              <span className="font-display font-bold text-lg text-cyan-300">
                {minutes}m {seconds.toString().padStart(2, '0')}s
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Sectores Superados</span>
              <span className="font-display font-bold text-lg text-emerald-400">5 / 5</span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Pistas Consultadas</span>
              <span className="font-display font-bold text-lg text-amber-400">{hintsUsedCount}</span>
            </div>
          </div>

          <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-lg flex items-start gap-3">
            <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 text-[11px]">
              La estación secreta Vostok-9 ha sido reclasificada como Reserva Científica Internacional. Los
              datos recopilados permitirán modelar con precisión milimétrica la evolución del clima del
              planeta durante el próximo siglo.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-cyan-900/40 bg-[#050811] flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-xs cursor-pointer"
          >
            Permanecer en la Base (Modo Libre)
          </button>

          <button
            onClick={() => {
              sound.playRelayClick();
              onRestart();
            }}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jugar de Nuevo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
