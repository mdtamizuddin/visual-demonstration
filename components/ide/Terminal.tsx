'use client';

import React, { useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Maximize2,
  Trash2,
  X,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { TerminalEntry } from '@/engine/demo-types';

interface TerminalProps {
  activeTab: 'TERMINAL' | 'OUTPUT' | 'PROBLEMS' | 'DEBUG CONSOLE';
  onTabChange: (tab: 'TERMINAL' | 'OUTPUT' | 'PROBLEMS' | 'DEBUG CONSOLE') => void;
  lines: TerminalEntry[];
  currentTypingCommand?: string;
  errorCount?: number;
  onClear?: () => void;
}

export function Terminal({
  activeTab,
  onTabChange,
  lines,
  currentTypingCommand = '',
  errorCount = 0,
  onClear,
}: TerminalProps) {
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [lines, currentTypingCommand]);

  const renderLine = (entry: TerminalEntry, idx: number) => {
    switch (entry.type) {
      case 'command':
        return (
          <div key={idx} className="text-[#e5e5e5] font-semibold flex items-start gap-1 py-0.5">
            <span className="text-[#38bdf8] select-none font-bold">❯</span>
            <span>{entry.text.replace(/^\$\s*/, '')}</span>
          </div>
        );
      case 'success':
        return (
          <div key={idx} className="text-emerald-400 py-0.5 whitespace-pre font-mono">
            {entry.text}
          </div>
        );
      case 'error':
        return (
          <div key={idx} className="text-rose-400 font-medium py-0.5 whitespace-pre font-mono">
            {entry.text}
          </div>
        );
      case 'info':
        return (
          <div key={idx} className="text-[#569cd6] py-0.5 whitespace-pre font-mono">
            {entry.text}
          </div>
        );
      default:
        return (
          <div key={idx} className="text-[#cccccc] py-0.5 whitespace-pre font-mono">
            {entry.text}
          </div>
        );
    }
  };

  return (
    <div className="h-56 bg-[#181818] border-t border-[#252526] flex flex-col shrink-0 overflow-hidden select-none font-sans">
      {/* Terminal Title Bar & Tabs */}
      <div className="h-8 bg-[#181818] border-b border-[#252526] flex items-center justify-between px-3 text-[11px] text-[#969696]">
        {/* Left Tabs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onTabChange('PROBLEMS')}
            className={`flex items-center gap-1.5 pb-1 uppercase font-semibold transition-colors ${
              activeTab === 'PROBLEMS'
                ? 'text-white border-b-2 border-white'
                : 'hover:text-[#cccccc]'
            }`}
          >
            <span>Problems</span>
            {errorCount > 0 && (
              <span className="px-1 rounded-full bg-rose-900 text-rose-300 text-[10px] font-mono">
                {errorCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('OUTPUT')}
            className={`pb-1 uppercase font-semibold transition-colors ${
              activeTab === 'OUTPUT'
                ? 'text-white border-b-2 border-white'
                : 'hover:text-[#cccccc]'
            }`}
          >
            Output
          </button>

          <button
            onClick={() => onTabChange('DEBUG CONSOLE')}
            className={`pb-1 uppercase font-semibold transition-colors ${
              activeTab === 'DEBUG CONSOLE'
                ? 'text-white border-b-2 border-white'
                : 'hover:text-[#cccccc]'
            }`}
          >
            Debug Console
          </button>

          <button
            id="terminal-tab-btn"
            onClick={() => onTabChange('TERMINAL')}
            className={`flex items-center gap-1 pb-1 uppercase font-semibold transition-colors ${
              activeTab === 'TERMINAL'
                ? 'text-white border-b-2 border-[#007acc]'
                : 'hover:text-[#cccccc]'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Terminal</span>
            <span className="text-[10px] text-zinc-500 font-mono">1: node (pnpm)</span>
          </button>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2 text-[#858585]">
          <button
            title="New Terminal"
            className="hover:text-white p-1 hover:bg-[#333333] rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            title="Split Terminal"
            className="hover:text-white p-1 hover:bg-[#333333] rounded transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClear}
            title="Clear Terminal"
            className="hover:text-white p-1 hover:bg-[#333333] rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            title="Maximize Terminal Panel"
            className="hover:text-white p-1 hover:bg-[#333333] rounded transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            title="Close Panel"
            className="hover:text-white p-1 hover:bg-[#333333] rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Stream */}
      <div
        ref={terminalScrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 font-mono text-[12px] leading-snug scrollbar-thin select-text bg-[#181818]"
      >
        {lines.map((line, i) => renderLine(line, i))}

        {/* Active Command Input Line */}
        <div
          id="terminal-input-prompt"
          data-cursor-id="terminal-input-prompt"
          className="flex items-center gap-1.5 text-[#e5e5e5] py-0.5 mt-1 font-mono"
        >
          <span className="text-emerald-400 select-none">usr@nova-dev</span>
          <span className="text-zinc-500 select-none">:</span>
          <span className="text-[#38bdf8] select-none">~/projects/nova-dashboard</span>
          <span className="text-[#e5e5e5] select-none font-bold">$</span>
          <span className="text-white font-medium">{currentTypingCommand}</span>
          <span className="w-2 h-4 bg-[#38bdf8] animate-pulse inline-block align-middle ml-0.5" />
        </div>
      </div>
    </div>
  );
}
