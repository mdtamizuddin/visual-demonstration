'use client';

import React from 'react';
import { Play, Sparkles, CheckCircle2, Terminal, Code2, GitBranch, ArrowRight, ShieldCheck } from 'lucide-react';

interface DemoOverlayProps {
  isOpen: boolean;
  onStart: () => void;
  onDismiss: () => void;
}

export function DemoOverlay({ isOpen, onStart, onDismiss }: DemoOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans animate-in zoom-in-95 fade-in duration-200">
        {/* Banner Header */}
        <div className="p-6 bg-gradient-to-r from-[#182333] via-[#1a2c3d] to-[#121c24] border-b border-[#2d3a47] relative">
          <div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs font-mono tracking-wider uppercase font-semibold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Autonomous AI Developer Simulation</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            VS Code Autonomous Coding Experience
          </h2>

          <p className="text-zinc-300 text-sm mt-2 leading-relaxed">
            Watch an AI software engineer operate inside VS Code — scanning the repo,
            navigating files, refactoring duplicated authentication logic, handling a test
            regression, and building production artifacts autonomously.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1e1e1e] text-xs">
          <div className="p-3 rounded-lg bg-[#252526] border border-[#2d2d2d] flex items-start gap-3">
            <div className="p-2 rounded bg-blue-950 text-blue-400 shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-0.5">Autonomous Refactoring</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Detects duplicated token checks across 3 methods and extracts a modular <code className="text-cyan-300">SessionValidator</code>.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#252526] border border-[#2d2d2d] flex items-start gap-3">
            <div className="p-2 rounded bg-amber-950 text-amber-400 shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-0.5">Test Execution & Failure Detection</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Runs <code className="text-amber-300">pnpm test</code>, catches an admin hierarchy regression, and self-heals the code.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#252526] border border-[#2d2d2d] flex items-start gap-3">
            <div className="p-2 rounded bg-emerald-950 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-0.5">Live Realistic Typing</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Character-by-character coding, tab switching, and inline VS Code Copilot style proposals.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#252526] border border-[#2d2d2d] flex items-start gap-3">
            <div className="p-2 rounded bg-purple-950 text-purple-400 shrink-0">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-0.5">Diff Inspection & Git Commit</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Side-by-side Git diff viewer and final git commit with 31 passing unit tests.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#252526] border-t border-[#2d2d2d] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive speed controls & phase navigation included</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white rounded hover:bg-[#333333] transition-colors"
            >
              Explore UI First
            </button>

            <button
              onClick={onStart}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg font-medium text-xs shadow-lg ring-1 ring-emerald-400/50 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>▶ Start Autonomous Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
