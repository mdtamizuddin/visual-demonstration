'use client';

import React from 'react';
import {
  Files,
  Search,
  GitBranch,
  PlayCircle,
  Package,
  Bot,
  Settings,
  User,
} from 'lucide-react';

interface ActivityBarProps {
  activeTab: 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'ai';
  onTabChange: (tab: 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'ai') => void;
  gitChangesCount?: number;
  isAiBusy?: boolean;
}

export function ActivityBar({
  activeTab,
  onTabChange,
  gitChangesCount = 1,
  isAiBusy = false,
}: ActivityBarProps) {
  return (
    <div className="w-12 bg-[#333333] flex flex-col justify-between items-center py-2 shrink-0 select-none border-r border-[#252526] z-10">
      {/* Top icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Explorer */}
        <button
          onClick={() => onTabChange('explorer')}
          title="Explorer (Ctrl+Shift+E)"
          className={`relative w-full h-11 flex items-center justify-center transition-colors group ${
            activeTab === 'explorer'
              ? 'text-white border-l-2 border-white bg-[#252526]'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          <Files className="w-5 h-5" />
        </button>

        {/* Search */}
        <button
          onClick={() => onTabChange('search')}
          title="Search (Ctrl+Shift+F)"
          className={`relative w-full h-11 flex items-center justify-center transition-colors group ${
            activeTab === 'search'
              ? 'text-white border-l-2 border-white bg-[#252526]'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Source Control */}
        <button
          id="activity-bar-git-btn"
          onClick={() => onTabChange('git')}
          title="Source Control (Ctrl+Shift+G)"
          className={`relative w-full h-11 flex items-center justify-center transition-colors group ${
            activeTab === 'git'
              ? 'text-white border-l-2 border-white bg-[#252526]'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          <GitBranch className="w-5 h-5" />
          {gitChangesCount > 0 && (
            <span className="absolute top-2 right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#007acc] text-white text-[9px] font-bold flex items-center justify-center">
              {gitChangesCount}
            </span>
          )}
        </button>

        {/* Run & Debug */}
        <button
          onClick={() => onTabChange('debug')}
          title="Run and Debug (Ctrl+Shift+D)"
          className={`relative w-full h-11 flex items-center justify-center transition-colors group ${
            activeTab === 'debug'
              ? 'text-white border-l-2 border-white bg-[#252526]'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          <PlayCircle className="w-5 h-5" />
        </button>

        {/* Extensions */}
        <button
          onClick={() => onTabChange('extensions')}
          title="Extensions (Ctrl+Shift+X)"
          className={`relative w-full h-11 flex items-center justify-center transition-colors group ${
            activeTab === 'extensions'
              ? 'text-white border-l-2 border-white bg-[#252526]'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          <Package className="w-5 h-5" />
        </button>

        {/* Autonomous AI Agent */}
        <button
          id="activity-bar-ai-btn"
          onClick={() => onTabChange('ai')}
          title="Autonomous AI Agent (Ctrl+Shift+A)"
          className={`relative w-full h-11 flex items-center justify-center transition-colors group ${
            activeTab === 'ai'
              ? 'text-[#38bdf8] border-l-2 border-[#38bdf8] bg-[#252526]'
              : 'text-[#38bdf8]/70 hover:text-[#38bdf8]'
          }`}
        >
          <Bot className="w-5 h-5" />
          {isAiBusy && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
          )}
        </button>
      </div>

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        <button
          title="Accounts"
          className="w-full h-10 flex items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <User className="w-5 h-5" />
        </button>
        <button
          title="Settings (Ctrl+,)"
          className="w-full h-10 flex items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
