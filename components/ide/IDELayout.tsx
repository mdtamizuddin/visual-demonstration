'use client';

import React, { useState } from 'react';
import { ActivityBar } from './ActivityBar';
import { Explorer } from './Explorer';
import { EditorTabs } from './EditorTabs';
import { Editor } from './Editor';
import { DiffViewer } from './DiffViewer';
import { Terminal } from './Terminal';
import { StatusBar } from './StatusBar';
import { AIAgentPanel } from './AIAgentPanel';
import { DemoCursor } from '@/components/demo/DemoCursor';
import { DemoEngineState } from '@/engine/demo-engine';
import { Minus, Square, X, Code2 } from 'lucide-react';

interface IDELayoutProps {
  engineState: DemoEngineState;
  onFileSelect: (path: string) => void;
  onFileClose: (path: string) => void;
  onToggleDiff: (visible?: boolean) => void;
  onTerminalTabChange: (tab: 'TERMINAL' | 'OUTPUT' | 'PROBLEMS' | 'DEBUG CONSOLE') => void;
  onRestart: () => void;
}

export function IDELayout({
  engineState,
  onFileSelect,
  onFileClose,
  onToggleDiff,
  onTerminalTabChange,
  onRestart,
}: IDELayoutProps) {
  const [activeActivityTab, setActiveActivityTab] = useState<
    'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'ai'
  >('explorer');

  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(true);

  const activeFileObject = engineState.files[engineState.activeFile] || {
    path: 'src/modules/auth/auth.service.ts',
    name: 'auth.service.ts',
    language: 'typescript',
    content: '// File not found',
    gitStatus: 'clean',
  };

  // Determine git changes count
  const modifiedFilesCount = Object.values(engineState.files).filter(
    (f) => f.gitStatus === 'modified' || f.gitStatus === 'untracked'
  ).length;

  return (
    <div
      id="vs-code-window"
      className="flex-1 flex flex-col h-full w-full bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden select-none relative"
    >
      {/* Top VS Code Window Title Bar & Menubar */}
      <div className="h-8 bg-[#323233] border-b border-[#252526] flex items-center justify-between px-3 text-xs select-none shrink-0">
        {/* Left: VS Code Logo & Menu items */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#007acc]">
            <Code2 className="w-4 h-4 fill-current" />
          </div>
          <div className="hidden md:flex items-center gap-2 text-zinc-300 text-[11px]">
            <span className="hover:bg-[#404040] px-1.5 py-0.5 rounded cursor-pointer">File</span>
            <span className="hover:bg-[#404040] px-1.5 py-0.5 rounded cursor-pointer">Edit</span>
            <span className="hover:bg-[#404040] px-1.5 py-0.5 rounded cursor-pointer">Selection</span>
            <span className="hover:bg-[#404040] px-1.5 py-0.5 rounded cursor-pointer">View</span>
            <span className="hover:bg-[#404040] px-1.5 py-0.5 rounded cursor-pointer">Go</span>
            <span className="hover:bg-[#404040] px-1.5 py-0.5 rounded cursor-pointer">Run</span>
            <span className="hover:bg-[#404040] px-1.5 py-0.5 rounded cursor-pointer">Terminal</span>
            <span className="hover:bg-[#404040] px-1.5 py-0.5 rounded cursor-pointer">Help</span>
          </div>
        </div>

        {/* Center: File Title */}
        <div className="font-mono text-[11px] text-zinc-400 truncate max-w-sm flex items-center gap-1.5">
          <span>nova-dashboard</span>
          <span>—</span>
          <span className="text-zinc-200">{activeFileObject.name}</span>
          <span>(Autonomous Simulation)</span>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-2 text-zinc-400">
          <button className="hover:bg-[#404040] p-1 rounded">
            <Minus className="w-3 h-3" />
          </button>
          <button className="hover:bg-[#404040] p-1 rounded">
            <Square className="w-2.5 h-2.5" />
          </button>
          <button className="hover:bg-rose-600 hover:text-white p-1 rounded">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Far Left Activity Bar */}
        <ActivityBar
          activeTab={activeActivityTab}
          onTabChange={(tab) => {
            setActiveActivityTab(tab);
            if (tab === 'ai') {
              setIsAgentPanelOpen(true);
            }
          }}
          gitChangesCount={modifiedFilesCount}
          isAiBusy={engineState.aiStatus.isBusy}
        />

        {/* Explorer Sidebar */}
        {activeActivityTab === 'explorer' && (
          <Explorer
            fileTree={engineState.fileTree}
            files={engineState.files}
            activeFile={engineState.activeFile}
            onFileSelect={onFileSelect}
          />
        )}

        {/* Center Editor + Terminal Column */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
          {/* Editor Tabs Bar */}
          <EditorTabs
            openFiles={engineState.openFiles}
            activeFile={engineState.activeFile}
            files={engineState.files}
            onTabClick={onFileSelect}
            onTabClose={onFileClose}
            isDiffActive={!!engineState.diffView?.visible}
            onToggleDiff={() => onToggleDiff()}
          />

          {/* Active Document: Diff or Editor */}
          <div className="flex-1 flex overflow-hidden relative">
            {engineState.diffView?.visible ? (
              <DiffViewer
                filePath={engineState.diffView.file}
                original={engineState.diffView.original}
                modified={engineState.diffView.modified}
                onClose={() => onToggleDiff(false)}
              />
            ) : (
              <Editor
                file={activeFileObject}
                focusedLine={engineState.editorFocusedLine}
                selectedRange={engineState.selectedRange}
                inlineSuggestion={engineState.inlineSuggestion}
                onAcceptSuggestion={() => {
                  // Handled via scenario action
                }}
                onRejectSuggestion={() => {
                  // Handled via scenario action
                }}
              />
            )}
          </div>

          {/* Bottom Integrated Terminal */}
          <Terminal
            activeTab={engineState.terminalTab}
            onTabChange={onTerminalTabChange}
            lines={engineState.terminalLines}
            currentTypingCommand={engineState.currentCommandTyping}
            errorCount={engineState.statusBar.errors}
            onClear={() => {}}
          />
        </div>

        {/* Right AI Agent Panel */}
        {isAgentPanelOpen && (
          <AIAgentPanel
            messages={engineState.aiMessages}
            status={engineState.aiStatus}
            currentPhase={engineState.currentPhase}
            completionMetrics={engineState.completionMetrics}
            onRestart={onRestart}
          />
        )}
      </div>

      {/* VS Code Bottom Status Bar */}
      <StatusBar
        leftText={engineState.statusBar.leftText}
        aiText={engineState.statusBar.aiText}
        errorCount={engineState.statusBar.errors}
        warningCount={engineState.statusBar.warnings}
      />

      {/* Animated Cursor */}
      <DemoCursor cursor={engineState.cursor} />
    </div>
  );
}
