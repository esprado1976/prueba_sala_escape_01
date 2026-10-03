import React from 'react';
import { Play, ShieldAlert, ThermometerSnowflake, FileText, Compass, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface IntroScreenProps {
  onStart: () => void;
  onOpenNotebook: () => void;
  baseExteriorImg: string;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  onOpenNotebook,
  baseExteriorImg,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Hero Visual Card with Generated Base Exterior Image */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-[#090e18] shadow-[0_0_35px_rgba(6,182,212,0.15)] group">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={baseExteriorImg}
            alt="Base secreta antártica Boreas Zero"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradient scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b13] via-[#070b13]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b13]/90 via-[#070b13]/40 to-transparent" />

          {/* Holographic HUD Badge on Image */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded bg-black/70 backdrop-blur-md border border-cyan-500/50 text-[11px] font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
            <span>ESTACIÓN POLAR BOREAS-ZERO · 82°S 115°E · -68°C</span>
          </div>

          {/* Hero text overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-red-950/70 border border-red-500/50 text-red-300 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>ALERTA DE CATÁSTROFE CLIMÁTICA GLOBAL</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-wide glow-cyan leading-tight">
              PROTOCOLO CRIÓSFERA
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
              Una estación científica clandestina sepultada bajo 1,200 metros de hielo antártico ha entrado en
              modo de sobrecarga ionosférica. Si el generador no es desactivado, fracturará el Vórtice Polar y
              desencadenará un colapso irreversible del casquete antártico.
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div className="p-6 bg-[#070c16] border-t border-cyan-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Compass className="w-4 h-4 text-cyan-400" /> 5 Sectores de Escape
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <ThermometerSnowflake className="w-4 h-4 text-amber-400" /> Complejidad Media-Alta
            </span>
            <span>·</span>
            <span className="text-slate-400">Estética Cyberpunk Retro</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playClick();
                onOpenNotebook();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-cyan-800/80 hover:border-cyan-500/60 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Ver Bitácora de Campo</span>
            </button>

            <button
              onClick={() => {
                sound.playDoorOpen();
                onStart();
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Iniciar Misión (Nivel 1)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Sectors Breakdown Cards */}
      <div className="space-y-4 font-mono">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-400 font-display flex items-center gap-2">
          <span>Los 5 Desafíos de la Base Abandonada</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-[#080d17] border border-cyan-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">SECTOR 01</span>
              <span className="text-[10px] text-slate-500">Exterior</span>
            </div>
            <h3 className="font-display font-bold text-sm text-slate-200">Compuerta Criosférica</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Descifra patrones meteorológicos históricos polares y alinea la estratificación atmosférica.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080d17] border border-cyan-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">SECTOR 02</span>
              <span className="text-[10px] text-slate-500">Pozo -1,200m</span>
            </div>
            <h3 className="font-display font-bold text-sm text-slate-200">Ascensor Geotérmico</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Deduce el orden de 4 llaves criogénicas analizando su masa (g) y conductividad térmica (k).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080d17] border border-cyan-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">SECTOR 03</span>
              <span className="text-[10px] text-slate-500">Pasillo Blindado</span>
            </div>
            <h3 className="font-display font-bold text-sm text-slate-200">Red de Láseres</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Neutraliza 4 barreras fotónicas emitiendo secuencias y formas de onda de resonancia acústica.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080d17] border border-cyan-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">SECTOR 04</span>
              <span className="text-[10px] text-slate-500">Sala Servidor</span>
            </div>
            <h3 className="font-display font-bold text-sm text-slate-200">Mainframe Cuántico</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hackea la matriz de 5x5 compuertas lógicas rotando repetidores para enrutar el bus al núcleo.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080d17] border border-red-900/50 bg-red-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400">SECTOR 05</span>
              <span className="text-[10px] text-red-500 font-bold">Crítico</span>
            </div>
            <h3 className="font-display font-bold text-sm text-white">Detener Autodestrucción</h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Reúne el código numérico de 5 dígitos oculto en cada desafío anterior y estabiliza el reactor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
