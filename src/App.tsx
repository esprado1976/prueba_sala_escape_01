/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameStage, LevelProgress } from './types/game';
import { Header } from './components/Header';
import { IntroScreen } from './components/IntroScreen';
import { Level1Airlock } from './components/levels/Level1Airlock';
import { Level2Elevator } from './components/levels/Level2Elevator';
import { Level3Lasers } from './components/levels/Level3Lasers';
import { Level4Mainframe } from './components/levels/Level4Mainframe';
import { Level5SelfDestruct } from './components/levels/Level5SelfDestruct';
import { NotebookModal } from './components/NotebookModal';
import { VictoryModal } from './components/VictoryModal';
import { sound } from './utils/audio';

import baseExteriorImg from './assets/images/antarctica_base_exterior_1790988941804.jpg';
import holoTerminalImg from './assets/images/holo_control_terminal_1790988952274.jpg';

const INITIAL_PROGRESS: Record<string, LevelProgress> = {
  lvl1: { unlocked: true, completed: false, timeSpentSeconds: 0, hintsUsed: 0 },
  lvl2: { unlocked: false, completed: false, timeSpentSeconds: 0, hintsUsed: 0 },
  lvl3: { unlocked: false, completed: false, timeSpentSeconds: 0, hintsUsed: 0 },
  lvl4: { unlocked: false, completed: false, timeSpentSeconds: 0, hintsUsed: 0 },
  lvl5: { unlocked: false, completed: false, timeSpentSeconds: 0, hintsUsed: 0 },
};

export default function App() {
  const [currentStage, setCurrentStage] = useState<GameStage>(() => {
    const saved = localStorage.getItem('boreas_stage');
    return (saved as GameStage) || 'intro';
  });

  const [progress, setProgress] = useState<Record<string, LevelProgress>>(() => {
    const saved = localStorage.getItem('boreas_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PROGRESS;
  });

  const [discoveredCodes, setDiscoveredCodes] = useState<{
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
  }>(() => {
    const saved = localStorage.getItem('boreas_codes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  const [userNotes, setUserNotes] = useState<string>(() => {
    return localStorage.getItem('boreas_notes') || '';
  });

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);

  // Total timer in seconds
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('boreas_elapsed_time');
    return saved ? Number(saved) : 0;
  });

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('boreas_stage', currentStage);
    localStorage.setItem('boreas_progress', JSON.stringify(progress));
    localStorage.setItem('boreas_codes', JSON.stringify(discoveredCodes));
    localStorage.setItem('boreas_notes', userNotes);
    localStorage.setItem('boreas_elapsed_time', elapsedSeconds.toString());
  }, [currentStage, progress, discoveredCodes, userNotes, elapsedSeconds]);

  // Main game timer
  useEffect(() => {
    if (currentStage === 'intro' || isVictoryOpen) return;

    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStage, isVictoryOpen]);

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    sound.setMuted(newMuted);
    if (!newMuted) {
      sound.playClick();
    }
  };

  const handleToggleCrt = () => {
    setCrtEnabled(!crtEnabled);
  };

  const handleResetGame = () => {
    localStorage.removeItem('boreas_stage');
    localStorage.removeItem('boreas_progress');
    localStorage.removeItem('boreas_codes');
    localStorage.removeItem('boreas_notes');
    localStorage.removeItem('boreas_elapsed_time');

    setProgress(INITIAL_PROGRESS);
    setDiscoveredCodes({});
    setUserNotes('');
    setElapsedSeconds(0);
    setCurrentStage('intro');
    setIsVictoryOpen(false);
  };

  // Completion handlers for each level
  const handleCompleteLvl1 = (digit: string) => {
    setProgress((prev) => ({
      ...prev,
      lvl1: { ...prev.lvl1, completed: true, discoveredCodeDigit: digit },
      lvl2: { ...prev.lvl2, unlocked: true },
    }));
    setDiscoveredCodes((prev) => ({ ...prev, lvl1: digit }));
  };

  const handleCompleteLvl2 = (digit: string) => {
    setProgress((prev) => ({
      ...prev,
      lvl2: { ...prev.lvl2, completed: true, discoveredCodeDigit: digit },
      lvl3: { ...prev.lvl3, unlocked: true },
    }));
    setDiscoveredCodes((prev) => ({ ...prev, lvl2: digit }));
  };

  const handleCompleteLvl3 = (digit: string) => {
    setProgress((prev) => ({
      ...prev,
      lvl3: { ...prev.lvl3, completed: true, discoveredCodeDigit: digit },
      lvl4: { ...prev.lvl4, unlocked: true },
    }));
    setDiscoveredCodes((prev) => ({ ...prev, lvl3: digit }));
  };

  const handleCompleteLvl4 = (digit: string) => {
    setProgress((prev) => ({
      ...prev,
      lvl4: { ...prev.lvl4, completed: true, discoveredCodeDigit: digit },
      lvl5: { ...prev.lvl5, unlocked: true },
    }));
    setDiscoveredCodes((prev) => ({ ...prev, lvl4: digit }));
  };

  const handleCompleteLvl5 = () => {
    setProgress((prev) => ({
      ...prev,
      lvl5: { ...prev.lvl5, completed: true },
    }));
    setIsVictoryOpen(true);
  };

  // Count discovered codes (including final 5th clue if level 4 is done)
  const discoveredCount =
    (discoveredCodes.lvl1 ? 1 : 0) +
    (discoveredCodes.lvl2 ? 1 : 0) +
    (discoveredCodes.lvl3 ? 1 : 0) +
    (discoveredCodes.lvl4 ? 1 : 0) +
    (progress.lvl4?.completed ? 1 : 0);

  // Count hints used across levels
  const totalHintsUsed = Object.values(progress).reduce((acc, lvl) => acc + (lvl.hintsUsed || 0), 0);

  return (
    <div
      className={`min-h-screen bg-[#06090e] text-slate-200 relative selection:bg-cyan-500 selection:text-black ${
        crtEnabled ? 'crt-overlay' : ''
      }`}
    >
      {/* Subtle background glow atmosphere */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_60%)]" />

      {/* Top Bar HUD */}
      <Header
        currentStage={currentStage}
        progress={progress}
        onSelectStage={(stage) => setCurrentStage(stage)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        crtEnabled={crtEnabled}
        onToggleCrt={handleToggleCrt}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onResetGame={handleResetGame}
        discoveredCodesCount={discoveredCount}
      />

      {/* Main Game Surface */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 relative z-10">
        {currentStage === 'intro' && (
          <IntroScreen
            onStart={() => setCurrentStage('level_1')}
            onOpenNotebook={() => setIsNotebookOpen(true)}
            baseExteriorImg={baseExteriorImg}
          />
        )}

        {currentStage === 'level_1' && (
          <Level1Airlock
            isCompleted={progress.lvl1.completed}
            onComplete={handleCompleteLvl1}
            onNextLevel={() => setCurrentStage('level_2')}
          />
        )}

        {currentStage === 'level_2' && (
          <Level2Elevator
            isCompleted={progress.lvl2.completed}
            onComplete={handleCompleteLvl2}
            onNextLevel={() => setCurrentStage('level_3')}
          />
        )}

        {currentStage === 'level_3' && (
          <Level3Lasers
            isCompleted={progress.lvl3.completed}
            onComplete={handleCompleteLvl3}
            onNextLevel={() => setCurrentStage('level_4')}
          />
        )}

        {currentStage === 'level_4' && (
          <Level4Mainframe
            isCompleted={progress.lvl4.completed}
            onComplete={handleCompleteLvl4}
            onNextLevel={() => setCurrentStage('level_5')}
          />
        )}

        {currentStage === 'level_5' && (
          <Level5SelfDestruct
            onComplete={handleCompleteLvl5}
            discoveredCodes={discoveredCodes}
            onOpenNotebook={() => setIsNotebookOpen(true)}
          />
        )}
      </main>

      {/* Notebook & Clue PDA Modal */}
      <NotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        discoveredCodes={discoveredCodes}
        userNotes={userNotes}
        onSaveNotes={(notes) => setUserNotes(notes)}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryOpen}
        totalTimeSeconds={elapsedSeconds}
        hintsUsedCount={totalHintsUsed}
        onRestart={handleResetGame}
        onClose={() => setIsVictoryOpen(false)}
      />
    </div>
  );
}
