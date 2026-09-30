'use client';

import React from 'react';
import { X, GitCompare, Columns, MoreHorizontal } from 'lucide-react';
import { ProjectFile } from '@/engine/demo-types';

interface EditorTabsProps {
  openFiles: string[];
  activeFile: string;
  files: Record<string, ProjectFile>;
  onTabClick: (path: string) => void;
  onTabClose: (path: string) => void;
  isDiffActive: boolean;
  onToggleDiff: () => void;
}

export function EditorTabs({
  openFiles,
  activeFile,
  files,
  onTabClick,
  onTabClose,
  isDiffActive,
  onToggleDiff,
}: EditorTabsProps) {
  const getFileBadge = (file?: ProjectFile) => {
    if (!file) return null;
    if (file.gitStatus === 'untracked') {
      return <span className="text-[10px] font-bold text-emerald-400 font-mono">U</span>;
    }
    if (file.gitStatus === 'modified') {
      return <span className="text-[10px] font-bold text-amber-400 font-mono">M</span>;
    }
    return null;
  };

  return (
    <div className="h-9 bg-[#252526] flex items-center justify-between border-b border-[#1e1e1e] select-none overflow-hidden shrink-0">
      {/* Scrollable Tab List */}
      <div className="flex items-center h-full overflow-x-auto scrollbar-none flex-1">
        {openFiles.map((path) => {
          const file = files[path];
          const fileName = path.split('/').pop() || path;
          const isActive = activeFile === path && !isDiffActive;

          return (
            <div
              key={path}
              id={`tab-${path}`}
              data-cursor-id={`tab-${path}`}
              onClick={() => onTabClick(path)}
              className={`group relative flex items-center gap-2 h-full px-3 text-xs border-r border-[#1e1e1e] cursor-pointer transition-colors max-w-[200px] shrink-0 ${
                isActive
                  ? 'bg-[#1e1e1e] text-white font-medium border-t-2 border-t-[#007acc]'
                  : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#282828] hover:text-[#cccccc]'
              }`}
            >
              {/* TS badge icon */}
              <span className="text-[10px] font-bold text-[#3178c6] font-mono shrink-0">
                TS
              </span>

              {/* File name */}
              <span className="truncate">{fileName}</span>

              {/* Status badge */}
              {getFileBadge(file)}

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(path);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-[#404040] rounded p-0.5 transition-opacity text-[#969696] hover:text-white"
                title="Close (Ctrl+W)"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 px-2 shrink-0 bg-[#252526] text-[#858585]">
        {/* Git Diff Toggle */}
        <button
          id="git-diff-toggle-btn"
          data-cursor-id="git-diff-toggle-btn"
          onClick={onToggleDiff}
          title="Toggle Git Diff View (Working Tree vs HEAD)"
          className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
            isDiffActive
              ? 'bg-[#007acc] text-white'
              : 'hover:bg-[#333333] hover:text-[#cccccc] text-[#969696]'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span className="text-[11px] font-mono">Diff</span>
        </button>

        <button
          title="Split Editor Right (Ctrl+\)"
          className="p-1 hover:bg-[#333333] hover:text-[#cccccc] rounded transition-colors"
        >
          <Columns className="w-3.5 h-3.5" />
        </button>

        <button
          title="More Actions..."
          className="p-1 hover:bg-[#333333] hover:text-[#cccccc] rounded transition-colors"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
