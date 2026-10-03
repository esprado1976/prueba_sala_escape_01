import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface HintSystemProps {
  hints: {
    level1: string;
    level2: string;
    level3: string;
  };
  onUseHint?: () => void;
}

export const HintSystem: React.FC<HintSystemProps> = ({ hints, onUseHint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unlockedTier, setUnlockedTier] = useState<number>(0);

  const handleUnlockTier = (tier: number) => {
    sound.playClick();
    if (tier > unlockedTier) {
      setUnlockedTier(tier);
      onUseHint?.();
    }
  };

  return (
    <div className="border border-slate-800 bg-[#080d17]/80 rounded-lg p-3 text-xs font-mono my-4">
      <button
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between text-left text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">
            ¿Necesitas ayuda con este sector? (Protocolo de Pistas)
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 pt-3 border-t border-slate-800/80">
          {/* Tier 1 */}
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 font-semibold">Pista Nivel 1 · Orientación General</span>
              {unlockedTier < 1 && (
                <button
                  onClick={() => handleUnlockTier(1)}
                  className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-800/60 text-[10px] cursor-pointer"
                >
                  Revelar
                </button>
              )}
            </div>
            {unlockedTier >= 1 ? (
              <p className="text-slate-300 text-[11px] leading-relaxed">{hints.level1}</p>
            ) : (
              <p className="text-slate-600 text-[10px] italic">Información encriptada.</p>
            )}
          </div>

          {/* Tier 2 */}
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 font-semibold">Pista Nivel 2 · Especificación Técnica</span>
              {unlockedTier < 2 && (
                <button
                  onClick={() => handleUnlockTier(2)}
                  className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 hover:bg-amber-900 border border-amber-800/60 text-[10px] cursor-pointer"
                >
                  Revelar
                </button>
              )}
            </div>
            {unlockedTier >= 2 ? (
              <p className="text-slate-300 text-[11px] leading-relaxed">{hints.level2}</p>
            ) : (
              <p className="text-slate-600 text-[10px] italic">Requiere análisis de laboratorio.</p>
            )}
          </div>

          {/* Tier 3 */}
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 font-semibold">Pista Nivel 3 · Solución Detallada</span>
              {unlockedTier < 3 && (
                <button
                  onClick={() => handleUnlockTier(3)}
                  className="px-2 py-0.5 rounded bg-red-950 text-red-400 hover:bg-red-900 border border-red-800/60 text-[10px] cursor-pointer"
                >
                  Revelar Solución
                </button>
              )}
            </div>
            {unlockedTier >= 3 ? (
              <div className="p-2 bg-red-950/20 border border-red-500/30 rounded text-red-200 text-[11px] leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>{hints.level3}</div>
              </div>
            ) : (
              <p className="text-slate-600 text-[10px] italic">Desbloqueo de emergencia.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
