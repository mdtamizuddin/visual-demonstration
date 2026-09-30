'use client';

import React, { useState, useEffect } from 'react';
import { useDemoEngine } from '@/engine/demo-engine';
import { IDELayout } from '@/components/ide/IDELayout';
import { DemoController } from '@/components/demo/DemoController';
import { DemoOverlay } from '@/components/demo/DemoOverlay';

export default function AutonomousCodingApp() {
  const { state, controls } = useDemoEngine();
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Sync fullscreen change events
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Handle start from overlay or controller
  const handleStartDemo = () => {
    setIsOverlayOpen(false);
    // Request fullscreen automatically on user click if supported
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    controls.startDemo();
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (state.isPlaying && !state.isPaused) {
          controls.pauseDemo();
        } else {
          controls.resumeDemo();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        controls.restartDemo();
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
      } else if (e.key === '1') {
        controls.jumpToPhase('analyze');
      } else if (e.key === '2') {
        controls.jumpToPhase('inspect');
      } else if (e.key === '3') {
        controls.jumpToPhase('refactor');
      } else if (e.key === '4') {
        controls.jumpToPhase('update_imports');
      } else if (e.key === '5') {
        controls.jumpToPhase('run_tests_fail');
      } else if (e.key === '6') {
        controls.jumpToPhase('fix_issue');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isPlaying, state.isPaused, controls]);

  return (
    <main className="h-screen w-screen flex flex-col bg-[#181818] overflow-hidden select-none font-sans text-neutral-200">
      {/* Top Demo Simulation Controller Bar */}
      <DemoController
        isPlaying={state.isPlaying}
        isPaused={state.isPaused}
        isCompleted={state.isCompleted}
        currentPhase={state.currentPhase}
        phaseTitle={state.phaseTitle}
        progressPercent={state.progressPercent}
        speedMultiplier={state.speedMultiplier}
        onStart={handleStartDemo}
        onPause={controls.pauseDemo}
        onResume={controls.resumeDemo}
        onRestart={controls.restartDemo}
        onSpeedChange={controls.setSpeedMultiplier}
        onPhaseSelect={controls.jumpToPhase}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Full VS Code Environment Window */}
      <div className="flex-1 flex overflow-hidden relative">
        <IDELayout
          engineState={state}
          onFileSelect={controls.openFileManual}
          onFileClose={controls.closeFileManual}
          onToggleDiff={controls.toggleDiff}
          onTerminalTabChange={controls.setTerminalTab}
          onRestart={controls.restartDemo}
        />
      </div>

      {/* Start / Introduction Splash Modal */}
      <DemoOverlay
        isOpen={isOverlayOpen}
        onStart={handleStartDemo}
        onDismiss={() => setIsOverlayOpen(false)}
      />
    </main>
  );
}
