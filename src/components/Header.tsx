import React from 'react';
import { GameStage, LevelProgress } from '../types/game';
import { Volume2, VolumeX, BookOpen, Monitor, RotateCcw, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentStage: GameStage;
  progress: Record<string, LevelProgress>;
  onSelectStage: (stage: GameStage) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onOpenNotebook: () => void;
  onResetGame: () => void;
  discoveredCodesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  progress,
  onSelectStage,
  isMuted,
  onToggleMute,
  crtEnabled,
  onToggleCrt,
  onOpenNotebook,
  onResetGame,
  discoveredCodesCount,
}) => {
  const levels: { stage: GameStage; label: string; number: number; key: string }[] = [
    { stage: 'level_1', label: 'Compuerta', number: 1, key: 'lvl1' },
    { stage: 'level_2', label: 'Ascensor', number: 2, key: 'lvl2' },
    { stage: 'level_3', label: 'Láseres', number: 3, key: 'lvl3' },
    { stage: 'level_4', label: 'Servidor', number: 4, key: 'lvl4' },
    { stage: 'level_5', label: 'Detonador', number: 5, key: 'lvl5' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-900/60 bg-[#070b13]/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onSelectStage('intro');
            }}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
            title="Ir al Centro de Operaciones"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="font-display font-bold text-lg tracking-wider text-cyan-300 group-hover:text-cyan-200 uppercase glow-cyan">
              Boreas Zero
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links / Sector Selector */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-xs font-mono">
          {levels.map((lvl) => {
            const isCurrent = currentStage === lvl.stage;
            const lvlProg = progress[lvl.key];
            const isUnlocked = lvlProg?.unlocked;
            const isDone = lvlProg?.completed;

            return (
              <button
                key={lvl.stage}
                disabled={!isUnlocked}
                onClick={() => {
                  sound.playClick();
                  onSelectStage(lvl.stage);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/70 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : isDone
                    ? 'text-emerald-400 hover:text-emerald-300 border border-emerald-900/40 hover:border-emerald-700/60 bg-emerald-950/20'
                    : isUnlocked
                    ? 'text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-800/60 bg-slate-900/40'
                    : 'text-slate-600 border border-slate-900/40 cursor-not-allowed opacity-60'
                }`}
              >
                <span className="font-bold text-[10px] opacity-70">0{lvl.number}</span>
                <span>{lvl.label}</span>
                {isDone && <span className="text-[10px] text-emerald-400 font-bold">✓</span>}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Notebook, Scanlines, Sound, Reset) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Field Notebook Clues */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNotebook();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-amber-500/50 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 hover:text-amber-200 transition-colors shadow-[0_0_8px_rgba(245,158,11,0.2)] cursor-pointer"
            title="Abrir Bitácora de Campo y Pistas del Código"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Bitácora</span>
            <span className="bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded text-[10px] text-amber-200 font-bold">
              {discoveredCodesCount}/5
            </span>
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleCrt();
            }}
            className={`p-2 rounded border transition-colors cursor-pointer ${
              crtEnabled
                ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300'
            }`}
            title={crtEnabled ? 'Desactivar efecto CRT scanlines' : 'Activar efecto CRT scanlines'}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded border transition-colors cursor-pointer ${
              !isMuted
                ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300'
            }`}
            title={isMuted ? 'Activar audio y sintetizador' : 'Silenciar audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Reset progress */}
          <button
            onClick={() => {
              if (window.confirm('¿Reiniciar la misión desde el principio?')) {
                sound.playRelayClick();
                onResetGame();
              }
            }}
            className="p-2 rounded border border-slate-800 hover:border-red-900/60 bg-slate-900/30 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
            title="Reiniciar Misión"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
