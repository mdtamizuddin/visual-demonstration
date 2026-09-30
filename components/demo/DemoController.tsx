'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { DemoPhase } from '@/engine/demo-types';
import { DemoTimeline } from './DemoTimeline';

interface DemoControllerProps {
  isPlaying: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  currentPhase: DemoPhase;
  phaseTitle: string;
  progressPercent: number;
  speedMultiplier: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  onPhaseSelect: (phase: DemoPhase) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function DemoController({
  isPlaying,
  isPaused,
  isCompleted,
  currentPhase,
  phaseTitle,
  progressPercent,
  speedMultiplier,
  onStart,
  onPause,
  onResume,
  onRestart,
  onSpeedChange,
  onPhaseSelect,
  isFullscreen,
  onToggleFullscreen,
}: DemoControllerProps) {
  const speeds = [0.75, 1, 1.5, 2, 4];

  return (
    <div className="bg-[#181818] border-b border-[#2b2b2b] px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs select-none z-20">
      {/* Left: Branding & Current Phase Title */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#007acc] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-white text-xs tracking-tight flex items-center gap-2">
              <span>Autonomous AI Coding Demo</span>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800">
                VS Code Simulation
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono truncate max-w-[260px]">
              {phaseTitle}
            </div>
          </div>
        </div>

        {/* Mobile Start button */}
        <div className="md:hidden">
          {!isPlaying || isPaused ? (
            <button
              onClick={isPlaying && isPaused ? onResume : onStart}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isPlaying && isPaused ? 'Resume' : 'Start'}</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium shadow"
            >
              <Pause className="w-3 h-3 fill-current" />
              <span>Pause</span>
            </button>
          )}
        </div>
      </div>

      {/* Center: Phase Timeline Scrubber */}
      <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
        <DemoTimeline currentPhase={currentPhase} onPhaseSelect={onPhaseSelect} />
      </div>

      {/* Right: Primary Controls */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
        {/* Speed Selector */}
        <div className="flex items-center bg-[#252526] rounded border border-[#333333] p-0.5 text-[11px]">
          <span className="px-1.5 text-zinc-400 font-mono text-[10px]">Speed:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                speedMultiplier === s
                  ? 'bg-[#007acc] text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Progress Bar Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-[#252526] px-2.5 py-1 rounded border border-[#333333] font-mono text-[11px] text-zinc-300">
          <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#007acc] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>{progressPercent}%</span>
        </div>

        {/* Reset / Restart */}
        <button
          onClick={onRestart}
          title="Restart Simulation (Reset project to initial state)"
          className="p-1.5 rounded bg-[#252526] hover:bg-[#333333] text-zinc-300 hover:text-white border border-[#333333] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Main Action Button */}
        {!isPlaying || isPaused ? (
          <button
            onClick={isPlaying && isPaused ? onResume : onStart}
            id="start-demo-btn"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded font-medium shadow-md transition-all ring-1 ring-emerald-400/40 text-xs font-sans tracking-wide"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPlaying && isPaused ? 'Resume Simulation' : '▶ Start Demo'}</span>
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium shadow transition-colors text-xs"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="p-1.5 rounded bg-[#252526] hover:bg-[#333333] text-zinc-300 hover:text-white border border-[#333333] transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
