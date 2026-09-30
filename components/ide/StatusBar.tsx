'use client';

import React from 'react';
import { GitBranch, RefreshCw, XCircle, AlertTriangle, Sparkles, CheckCheck } from 'lucide-react';

interface StatusBarProps {
  leftText?: string;
  aiText?: string;
  errorCount?: number;
  warningCount?: number;
}

export function StatusBar({
  leftText = 'main',
  aiText = 'AI Agent: Idle',
  errorCount = 0,
  warningCount = 0,
}: StatusBarProps) {
  return (
    <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-sans select-none shrink-0 z-10">
      {/* Left items */}
      <div className="flex items-center gap-3">
        <button
          title="Git Branch: main"
          className="flex items-center gap-1 hover:bg-black/20 px-1.5 py-0.5 rounded transition-colors"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>{leftText}</span>
        </button>

        <button
          title="Synchronize Changes"
          className="flex items-center gap-1 hover:bg-black/20 px-1.5 py-0.5 rounded transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
        </button>

        <div className="flex items-center gap-2 hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer">
          <span className="flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>{errorCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{warningCount}</span>
          </span>
        </div>
      </div>

      {/* Center AI status */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-0.5 rounded bg-black/20 font-mono text-[11px]">
        <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
        <span className="text-cyan-100 font-medium">{aiText}</span>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        <span className="hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer hidden md:inline">
          Ln 24, Col 18
        </span>
        <span className="hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer hidden md:inline">
          Spaces: 2
        </span>
        <span className="hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer hidden md:inline">
          UTF-8
        </span>
        <span className="hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer">
          TypeScript
        </span>
        <span className="flex items-center gap-1 hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer hidden lg:flex">
          <CheckCheck className="w-3 h-3" />
          <span>Prettier</span>
        </span>
        <span className="hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer hidden lg:inline">
          Port: 3000
        </span>
      </div>
    </div>
  );
}
