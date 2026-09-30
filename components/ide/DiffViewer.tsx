'use client';

import React from 'react';
import { GitCompare, ArrowLeft, Check, Plus, Minus } from 'lucide-react';

interface DiffViewerProps {
  filePath: string;
  original: string;
  modified: string;
  onClose: () => void;
}

export function DiffViewer({ filePath, original, modified, onClose }: DiffViewerProps) {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] overflow-hidden select-none">
      {/* Diff Header */}
      <div className="h-9 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-[#38bdf8]" />
          <span className="font-semibold text-white">{filePath}</span>
          <span className="text-[#858585] text-[11px]">(Working Tree vs HEAD)</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-mono border border-emerald-800">
            +36 lines
          </span>
          <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 text-[10px] font-mono border border-rose-800">
            -84 lines
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-xs transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Editor</span>
        </button>
      </div>

      {/* Side-by-side or unified diff container */}
      <div className="flex-1 grid grid-cols-2 divide-x divide-[#2b2b2b] overflow-hidden font-mono text-[12px] leading-5">
        {/* Left: Original (Deleted redundant sections highlighted) */}
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin bg-[#1e1e1e]">
          <div className="sticky top-0 bg-[#252526] px-3 py-1 text-[11px] text-rose-400 font-semibold border-b border-[#2b2b2b] flex items-center gap-1.5">
            <Minus className="w-3 h-3 text-rose-400" />
            <span>Original (Duplicated Logic)</span>
          </div>
          <div className="py-2">
            {originalLines.map((line, idx) => {
              const isDuplicatedSection = (idx >= 15 && idx <= 36) || (idx >= 40 && idx <= 72);
              return (
                <div
                  key={idx}
                  className={`flex px-2 ${
                    isDuplicatedSection
                      ? 'bg-rose-950/30 text-rose-200'
                      : 'text-[#858585]'
                  }`}
                >
                  <span className="w-8 text-right pr-3 select-none text-[#555555]">
                    {idx + 1}
                  </span>
                  <span className="w-4 select-none text-rose-400">
                    {isDuplicatedSection ? '-' : ' '}
                  </span>
                  <span className="whitespace-pre overflow-x-auto">{line}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Modified (Refactored delegation) */}
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin bg-[#1e1e1e]">
          <div className="sticky top-0 bg-[#252526] px-3 py-1 text-[11px] text-emerald-400 font-semibold border-b border-[#2b2b2b] flex items-center gap-1.5">
            <Plus className="w-3 h-3 text-emerald-400" />
            <span>Refactored (Clean Delegation to SessionValidator)</span>
          </div>
          <div className="py-2">
            {modifiedLines.map((line, idx) => {
              const isAddedOrChanged = idx >= 1 && idx <= 32;
              return (
                <div
                  key={idx}
                  className={`flex px-2 ${
                    isAddedOrChanged
                      ? 'bg-emerald-950/30 text-emerald-200'
                      : 'text-[#cccccc]'
                  }`}
                >
                  <span className="w-8 text-right pr-3 select-none text-[#555555]">
                    {idx + 1}
                  </span>
                  <span className="w-4 select-none text-emerald-400">
                    {isAddedOrChanged ? '+' : ' '}
                  </span>
                  <span className="whitespace-pre overflow-x-auto">{line}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
