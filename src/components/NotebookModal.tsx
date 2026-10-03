import React, { useState } from 'react';
import { X, Book, KeyRound, Terminal, Cpu, FileText, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  discoveredCodes: {
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5Hint?: string;
  };
  userNotes: string;
  onSaveNotes: (notes: string) => void;
}

export const NotebookModal: React.FC<NotebookModalProps> = ({
  isOpen,
  onClose,
  discoveredCodes,
  userNotes,
  onSaveNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'briefing' | 'codes' | 'manuals' | 'notes'>('codes');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#090e18] border border-cyan-500/40 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/50 bg-[#060a12]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <h2 className="font-display font-bold text-cyan-300 text-sm tracking-widest uppercase">
              PDA Táctico · Bitácora de Campo Boreas-9
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded border border-slate-800 hover:border-cyan-500/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cyan-900/40 bg-[#070c16] px-4 gap-2 text-xs font-mono">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('codes');
            }}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'codes'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Códigos del Núcleo</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('briefing');
            }}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'briefing'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Book className="w-3.5 h-3.5 text-cyan-400" />
            <span>Misión & Catástrofe</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('manuals');
            }}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'manuals'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Archivos Técnicos</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('notes');
            }}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notes'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Anotaciones Libres</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed text-slate-300 space-y-4">
          {activeTab === 'codes' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded text-amber-200">
                <p className="font-semibold text-amber-300 text-sm mb-1 font-display">
                  CÓDIGO DE ANULACIÓN DE AUTODESTRUCCIÓN (5 DÍGITOS)
                </p>
                <p className="text-[11px] text-amber-200/80">
                  El protocolo Boreas Zero requiere ingresar un código numérico maestro en la consola final (Nivel 5).
                  Cada nivel de la base oculta o revela un dígito esencial.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {/* Digit 1 */}
                <div className="p-3 bg-[#0d1524] border border-cyan-900/60 rounded">
                  <div className="text-[10px] text-cyan-500 font-semibold mb-1">DÍGITO 1 (Nivel 1)</div>
                  <div className="text-xl font-bold font-display text-center py-2">
                    {discoveredCodes.lvl1 ? (
                      <span className="text-emerald-400 glow-emerald">{discoveredCodes.lvl1}</span>
                    ) : (
                      <span className="text-slate-600">?</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {discoveredCodes.lvl1
                      ? 'Grabado en el cuadrante barométrico del acceso.'
                      : 'Descifra los patrones meteorológicos de la compuerta.'}
                  </p>
                </div>

                {/* Digit 2 */}
                <div className="p-3 bg-[#0d1524] border border-cyan-900/60 rounded">
                  <div className="text-[10px] text-cyan-500 font-semibold mb-1">DÍGITO 2 (Nivel 2)</div>
                  <div className="text-xl font-bold font-display text-center py-2">
                    {discoveredCodes.lvl2 ? (
                      <span className="text-emerald-400 glow-emerald">{discoveredCodes.lvl2}</span>
                    ) : (
                      <span className="text-slate-600">?</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {discoveredCodes.lvl2
                      ? 'Integridad del ascensor geotérmico.'
                      : 'Analiza la conductividad y peso de las 4 llaves.'}
                  </p>
                </div>

                {/* Digit 3 */}
                <div className="p-3 bg-[#0d1524] border border-cyan-900/60 rounded">
                  <div className="text-[10px] text-cyan-500 font-semibold mb-1">DÍGITO 3 (Nivel 3)</div>
                  <div className="text-xl font-bold font-display text-center py-2">
                    {discoveredCodes.lvl3 ? (
                      <span className="text-emerald-400 glow-emerald">{discoveredCodes.lvl3}</span>
                    ) : (
                      <span className="text-slate-600">?</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {discoveredCodes.lvl3
                      ? 'Canal armónico piezoeléctrico de seguridad.'
                      : 'Sintoniza las frecuencias acústicas de los láseres.'}
                  </p>
                </div>

                {/* Digit 4 */}
                <div className="p-3 bg-[#0d1524] border border-cyan-900/60 rounded">
                  <div className="text-[10px] text-cyan-500 font-semibold mb-1">DÍGITO 4 (Nivel 4)</div>
                  <div className="text-xl font-bold font-display text-center py-2">
                    {discoveredCodes.lvl4 ? (
                      <span className="text-emerald-400 glow-emerald">{discoveredCodes.lvl4}</span>
                    ) : (
                      <span className="text-slate-600">?</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {discoveredCodes.lvl4
                      ? 'Offset cuántico recuperado del mainframe.'
                      : 'Resuelve el enrutamiento del servidor cuántico.'}
                  </p>
                </div>

                {/* Digit 5 */}
                <div className="p-3 bg-[#0d1524] border border-amber-900/60 rounded bg-amber-950/10">
                  <div className="text-[10px] text-amber-500 font-semibold mb-1">DÍGITO 5 (Nivel 5)</div>
                  <div className="text-xl font-bold font-display text-center py-2">
                    {discoveredCodes.lvl4 ? (
                      <span className="text-amber-400 glow-amber">8</span>
                    ) : (
                      <span className="text-slate-600">?</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Temperatura criogénica absoluta del reactor (-58°C: último dígito 8).
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800 rounded">
                <span className="text-cyan-400 font-semibold">Resumen de Claves: </span>
                <span className="text-slate-300">
                  Código completo verificado:{' '}
                  <strong className="text-emerald-300 tracking-widest font-mono text-sm">
                    {discoveredCodes.lvl1 || '?'}-{discoveredCodes.lvl2 || '?'}-{discoveredCodes.lvl3 || '?'}-{discoveredCodes.lvl4 || '?'}-{discoveredCodes.lvl4 ? '8' : '?'}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {activeTab === 'briefing' && (
            <div className="space-y-4">
              <div className="border-l-2 border-cyan-500 pl-4 py-1">
                <h3 className="font-display font-bold text-sm text-cyan-300 uppercase">
                  Informe de Inteligencia: Proyecto Boreas Zero
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ubicación: Meseta Polar Antártica · 82°14&apos;S 115°42&apos;E · Altitud: 3,488 m s.n.m.
                </p>
              </div>

              <p>
                En 1982, un consorcio de climatólogos y físicos independientes construyó una instalación bajo
                1,200 metros de hielo glacial eterno con el fin de contrarrestar el calentamiento global mediante
                un generador de ionización estratosférica por resonancia.
              </p>

              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded text-red-200">
                <strong className="text-red-400 font-display block mb-1">LA AMENAZA CLIMÁTICA INMINENTE</strong>
                El sistema de contención magnética entró en bucle crítico por sobreenfriamiento. Si la secuencia
                de autodestrucción y sobrecarga ionosférica no es abortada a tiempo, los transmisores polarizarán
                la tropopausa polar, pulverizando la Corriente en Chorro Polar (Polar Jet Stream) e induciendo
                el colapso instantáneo de la Plataforma de Hielo de la Antártida Occidental (WAIS), provocando
                un maremoto hiperbólico y una glaciación descontrolada en latitudes boreales.
              </div>

              <p>
                Tu misión consiste en infiltrarte en la base abandonada, penetrar sus 4 anillos de seguridad
                utilizando deducción científica y activar la consola criogénica para neutralizar el pulso.
              </p>
            </div>
          )}

          {activeTab === 'manuals' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded">
                <h4 className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Termodinámica de Materiales Exóticos (Nivel 2)
                </h4>
                <p className="text-[11px] text-slate-400">
                  La conductividad térmica (k) mide la rapidez con la que el calor se propaga a través de un cuerpo:
                  Aerogel-Ti (k = 0.08) &lt; Osmio-W (k = 87) &lt; Cobre-Bi (k = 385) &lt; Grafeno-Ag (k = 429).
                  Insertar fuera de orden provoca fractura frágil por contracción térmica asimétrica.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded">
                <h4 className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Resonancia Fotoacústica (Nivel 3)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Los haces de luz láser están sustentados por cristales piezo-ópticos que oscilan a frecuencias
                  específicas:
                  <br />• 650 nm (Rojo): 220 Hz · Sinusoidal (onda pura)
                  <br />• 590 nm (Ámbar): 330 Hz · Triángulo (armónicos impares)
                  <br />• 490 nm (Cian): 440 Hz · Diente de Sierra (rampa lineal)
                  <br />• 405 nm (Violeta): 660 Hz · Cuadrada (pulso binario)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-2">
              <label className="block text-slate-400 text-xs">
                Anota tus deducciones, cálculos o secuencias observadas:
              </label>
              <textarea
                value={userNotes}
                onChange={(e) => {
                  sound.playTerminalKey();
                  onSaveNotes(e.target.value);
                }}
                placeholder="Escribe aquí tus observaciones: por ejemplo 'Patrones meteorológicos ordenados de menor a mayor altitud...', 'Llave A pesa 142g...', etc."
                className="w-full h-48 bg-[#050911] border border-cyan-900/70 rounded p-3 text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs font-mono resize-none"
              />
              <p className="text-[10px] text-slate-500">
                Tus notas se guardan automáticamente en la memoria del dispositivo.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-cyan-900/40 bg-[#060a12] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">TERMINAL POLAR VER 4.8.2 // STATUS: SECURE</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 rounded transition-colors cursor-pointer"
          >
            Cerrar Bitácora
          </button>
        </div>
      </div>
    </div>
  );
};
