import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_GRID_NODES } from '../../data/gameData';
import { GridNode } from '../../types/game';
import { HintSystem } from '../HintSystem';
import { sound } from '../../utils/audio';
import { Cpu, Terminal, CheckCircle2, ArrowRight, RotateCw, Network, Zap, ShieldCheck } from 'lucide-react';

interface Level4MainframeProps {
  onComplete: (digit: string) => void;
  isCompleted: boolean;
  onNextLevel: () => void;
}

// Direction helpers: 0 = North, 1 = East, 2 = South, 3 = West
function getNodeConnections(type: GridNode['type'], rotation: number): boolean[] {
  // Returns [north, east, south, west]
  let base: [boolean, boolean, boolean, boolean];
  switch (type) {
    case 'start':
      base = [false, true, true, false]; // exits East and South
      break;
    case 'end':
      base = [true, false, false, true]; // enters from North or West
      break;
    case 'wire_straight':
      base = [true, false, true, false]; // North and South
      break;
    case 'wire_corner':
      base = [true, true, false, false]; // North and East
      break;
    case 'wire_t':
      base = [true, true, false, true]; // North, East, West
      break;
    case 'gate_not':
      base = [true, false, true, false]; // in-line inverter
      break;
    case 'gate_and':
      base = [true, true, true, false]; // triple junction
      break;
    default:
      base = [false, false, false, false];
  }

  // Rotate connections clockwise by rotation / 90
  const steps = Math.floor(rotation / 90) % 4;
  const rotated = [false, false, false, false];
  for (let i = 0; i < 4; i++) {
    rotated[(i + steps) % 4] = base[i];
  }
  return rotated;
}

export const Level4Mainframe: React.FC<Level4MainframeProps> = ({
  onComplete,
  isCompleted,
  onNextLevel,
}) => {
  const [nodes, setNodes] = useState<GridNode[]>(() =>
    INITIAL_GRID_NODES.map((n) => ({ ...n }))
  );
  const [isCoreConnected, setIsCoreConnected] = useState(false);
  const [parityChecked, setParityChecked] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'CYBERGRID OS v4.2 // INICIALIZANDO ENLACE FIBRA ÓPTICA SUB-GLACIAL...',
    'ERROR: Circuito cuántico desfasado por congelación criogénica.',
    'Alinee los repetidores ópticos rotándolos para enrutar el bus hacia el Núcleo (4,4).',
  ]);

  const SECRET_DIGIT = '4';

  // Compute power propagation from (0,0)
  const computePowerFlow = useCallback((currentNodes: GridNode[]) => {
    // 5x5 matrix
    const grid: (GridNode | null)[][] = Array(5)
      .fill(null)
      .map(() => Array(5).fill(null));

    currentNodes.forEach((n) => {
      grid[n.row][n.col] = n;
    });

    const poweredSet = new Set<string>();
    const queue: [number, number][] = [[0, 0]];
    poweredSet.add('0-0');

    // Directions: North: [-1, 0], East: [0, 1], South: [1, 0], West: [0, -1]
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    const oppositeDir = [2, 3, 0, 1];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const currentNode = grid[r][c]!;
      const currentConns = getNodeConnections(currentNode.type, currentNode.rotation);

      for (let dir = 0; dir < 4; dir++) {
        if (!currentConns[dir]) continue;

        const nr = r + dr[dir];
        const nc = c + dc[dir];

        if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
          const neighbor = grid[nr][nc];
          if (neighbor && !poweredSet.has(neighbor.id)) {
            const neighborConns = getNodeConnections(neighbor.type, neighbor.rotation);
            // Check if neighbor connects back
            if (neighborConns[oppositeDir[dir]]) {
              poweredSet.add(neighbor.id);
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    const updatedNodes = currentNodes.map((n) => ({
      ...n,
      powered: poweredSet.has(n.id),
    }));

    const endNodePowered = poweredSet.has('4-4');
    return { updatedNodes, endNodePowered };
  }, []);

  // Recompute power whenever nodes change
  const handleRotateNode = (nodeId: string) => {
    if (isCompleted) return;
    sound.playRelayClick();

    setNodes((prev) => {
      const next = prev.map((n) => {
        if (n.id === nodeId && !n.locked) {
          return { ...n, rotation: (n.rotation + 90) % 360 };
        }
        return n;
      });

      const { updatedNodes, endNodePowered } = computePowerFlow(next);
      setIsCoreConnected(endNodePowered);

      if (endNodePowered && !isCoreConnected) {
        sound.playLaserScan?.();
        setTerminalLogs((logs) => [
          ...logs.slice(-4),
          '>> [CIRCUITO ESTABLECIDO]: Portadora óptica acoplada al Core Override (4,4).',
          '>> Pulse "Inyectar Paquete de Paridad" para validar el volcado de memoria.',
        ]);
      }

      return updatedNodes;
    });
  };

  // Initial calculation on mount
  useEffect(() => {
    const { updatedNodes, endNodePowered } = computePowerFlow(nodes);
    setNodes(updatedNodes);
    setIsCoreConnected(endNodePowered);
  }, []);

  const handleInjectParity = () => {
    sound.playTerminalKey();
    if (!isCoreConnected) {
      sound.playWrong();
      setTerminalLogs((logs) => [
        ...logs.slice(-4),
        '>> [FALLO]: El bus de datos aún no llega al Core Override (4,4). Conexión rota.',
      ]);
      return;
    }

    sound.playSuccessChord();
    setParityChecked(true);
    setTerminalLogs((logs) => [
      ...logs.slice(-4),
      '>> [PARITY CHECK: OK] - Flujo cuántico coherente al 100%.',
      '>> MEM_DUMP AT 0x04: "SECTOR BOREAS FRAGMENTO IV = 4".',
      '>> ACCESO DE NIVEL ROOT CONCEDIDO.',
    ]);
    onComplete(SECRET_DIGIT);
  };

  // Render node icon/graphic based on type and connections
  const renderNodeGraphic = (node: GridNode) => {
    const isPowered = node.powered;
    const conns = getNodeConnections(node.type, node.rotation);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Connection lines visual */}
        {conns[0] && (
          <div
            className={`absolute top-0 w-1.5 h-1/2 -translate-y-0 transition-colors ${
              isPowered ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-700'
            }`}
          />
        )}
        {conns[1] && (
          <div
            className={`absolute right-0 h-1.5 w-1/2 translate-x-0 transition-colors ${
              isPowered ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-700'
            }`}
          />
        )}
        {conns[2] && (
          <div
            className={`absolute bottom-0 w-1.5 h-1/2 translate-y-0 transition-colors ${
              isPowered ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-700'
            }`}
          />
        )}
        {conns[3] && (
          <div
            className={`absolute left-0 h-1.5 w-1/2 -translate-x-0 transition-colors ${
              isPowered ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-700'
            }`}
          />
        )}

        {/* Central junction glyph */}
        <div
          className={`relative z-10 w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-bold transition-all ${
            node.type === 'start'
              ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.8)]'
              : node.type === 'end'
              ? isPowered
                ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.9)]'
                : 'bg-red-950 text-red-400 border border-red-800'
              : isPowered
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
              : 'bg-slate-900 text-slate-500 border border-slate-800'
          }`}
        >
          {node.type === 'start' && 'IN'}
          {node.type === 'end' && 'CORE'}
          {node.type === 'gate_not' && '¬'}
          {node.type === 'gate_and' && '&'}
          {node.type === 'wire_t' && 'T'}
          {node.type === 'wire_corner' && '∟'}
          {node.type === 'wire_straight' && '│'}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-900/60 bg-[#090e18] p-6 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Sector 04 · Sala del Servidor Cuántico</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white tracking-wide">
              Enrutamiento del Mainframe Criogénico
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
              El canal de datos hacia el núcleo de control climático está desconectado. Rota los repetidores
              ópticos y compuertas cuánticas para trazar una ruta continua desde el inyector (0,0) hasta el
              Core Override (4,4) y valida la paridad de la señal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              className={`px-3 py-1.5 rounded border ${
                isCoreConnected
                  ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                  : 'border-amber-500/60 bg-amber-950/40 text-amber-300'
              }`}
            >
              {isCoreConnected ? 'NÚCLEO ENLAZADO (100%)' : 'CIRCUITO INCOMPLETO'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 5x5 Network Matrix */}
        <div className="lg:col-span-7 bg-[#070b13] border border-cyan-900/50 rounded-xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Matriz Cuántica 5x5 (Repetidores de Fibra)
            </span>
            <span className="text-[11px] text-slate-500">
              Click en cualquier nodo para rotarlo 90°
            </span>
          </div>

          {/* 5x5 Interactive Board */}
          <div className="max-w-md mx-auto aspect-square p-2 bg-[#04070e] border border-cyan-900/60 rounded-xl shadow-2xl grid grid-cols-5 gap-1.5">
            {nodes.map((node) => {
              const isLocked = node.locked;

              return (
                <button
                  key={node.id}
                  disabled={isCompleted || isLocked}
                  onClick={() => handleRotateNode(node.id)}
                  className={`relative rounded-lg p-1 transition-all flex items-center justify-center cursor-pointer select-none ${
                    isLocked
                      ? 'border border-slate-700 bg-slate-900/80 cursor-default'
                      : node.powered
                      ? 'bg-cyan-950/40 border border-cyan-500/60 hover:border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/50 border border-slate-800 hover:border-slate-600'
                  }`}
                  title={
                    isLocked
                      ? 'Nodo fijo de interfaz'
                      : `Nodo [${node.row},${node.col}] - Rotar repetidor`
                  }
                >
                  {renderNodeGraphic(node)}

                  {!isLocked && (
                    <span className="absolute bottom-1 right-1 text-[8px] text-slate-600 hover:text-cyan-400">
                      <RotateCw className="w-2.5 h-2.5 opacity-60" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Circuit Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[10px] text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Inyector Datos (0,0)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Línea Energizada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Core Override (4,4)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal & Parity Validator */}
        <div className="lg:col-span-5 bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Consola Netrunner / Kernel Dump
            </span>
          </div>

          {/* Terminal Screen */}
          <div className="h-56 bg-[#04060b] border border-slate-800 rounded-lg p-3 text-[11px] text-emerald-400 overflow-y-auto space-y-1.5 shadow-inner">
            {terminalLogs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>

          {/* Action: Inject Parity */}
          {!isCompleted ? (
            <button
              onClick={handleInjectParity}
              disabled={!isCoreConnected}
              className={`w-full py-3 px-4 rounded-lg font-display font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                isCoreConnected
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Inyectar Paquete y Validar Paridad</span>
            </button>
          ) : (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded-xl space-y-3">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-sm uppercase text-emerald-300">
                    Mainframe Hackeado con Éxito
                  </h3>
                  <p className="text-[11px] font-mono text-emerald-400/80">
                    Control de actuadores obtenido. Acceso al reactor concedido.
                  </p>
                </div>
              </div>

              {/* Code Digit 4 */}
              <div className="p-3 bg-[#060a12] border border-cyan-500/40 rounded-lg">
                <div className="text-[10px] text-cyan-400 font-mono uppercase font-bold tracking-wider mb-1">
                  Fragmento de Seguridad Revelado en el Volcado de Kernel:
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-mono">
                    Código Maestro Boreas · Posición 4:
                  </span>
                  <span className="text-2xl font-bold font-display text-cyan-300 glow-cyan">
                    {SECRET_DIGIT}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Offset de Memoria = 4. Guardado en tu Bitácora.
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onNextLevel();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Avanzar al Nivel 5: Detener Autodestrucción</span>
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
            'Cada clic en una celda gira su cable o compuerta 90 grados. Tu objetivo es conectar los cables brillantes desde la esquina superior izquierda (0,0) hasta la inferior derecha (4,4).',
          level2:
            'Observa los codos y las líneas rectas. Un camino viable baja por la columna 0 hasta la fila 2 o bordea hacia la derecha a través de la fila 0 hacia la columna 3.',
          level3:
            'Solución: Rota las piezas de forma que se forme un camino continuo iluminado en cian que toque la casilla CORE (4,4). En cuanto la casilla CORE se vuelva verde, haz clic en "Inyectar Paquete y Validar Paridad".',
        }}
      />
    </div>
  );
};
