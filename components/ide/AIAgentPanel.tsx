'use client';

import React from 'react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Activity,
  Layers,
  Zap,
} from 'lucide-react';
import { AIMessageEntry } from '@/engine/demo-types';

interface AIAgentPanelProps {
  messages: AIMessageEntry[];
  status: { text: string; isBusy: boolean };
  currentPhase: string;
  completionMetrics?: {
    refactoredFiles: number;
    linesReduced: number;
    testsPassing: number;
    timeElapsed: string;
  } | null;
  onRestart?: () => void;
}

export function AIAgentPanel({
  messages,
  status,
  currentPhase,
  completionMetrics,
  onRestart,
}: AIAgentPanelProps) {
  const getBadgeStyle = (type: AIMessageEntry['type']) => {
    switch (type) {
      case 'analysis':
        return 'bg-blue-950/80 text-blue-400 border-blue-800';
      case 'action':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'success':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
      case 'alert':
        return 'bg-rose-950/80 text-rose-400 border-rose-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getIcon = (type: AIMessageEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'alert':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'action':
        return <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />;
    }
  };

  return (
    <div className="w-80 bg-[#1e1e1e] border-l border-[#252526] flex flex-col h-full shrink-0 select-none overflow-hidden font-sans">
      {/* Panel Header */}
      <div className="p-3 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-4 h-4 text-[#38bdf8]" />
            {status.isBusy && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
            )}
          </div>
          <span className="font-semibold text-xs text-white tracking-wide">
            Autonomous Dev Agent
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              status.isBusy ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
            }`}
          />
          <span className="text-[10px] text-zinc-400 font-mono">
            {status.isBusy ? 'ACTIVE' : 'READY'}
          </span>
        </div>
      </div>

      {/* Agent Status Banner */}
      <div className="px-3 py-2 bg-[#181818] border-b border-[#252526] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-zinc-300 truncate font-mono text-[11px]">
          <Activity className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
          <span className="truncate">{status.text}</span>
        </div>
      </div>

      {/* Completion Metrics Modal / Card */}
      {completionMetrics && (
        <div className="m-3 p-3 bg-gradient-to-b from-[#1a2d24] to-[#122019] rounded-lg border border-emerald-600/50 shadow-lg text-xs animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Workflow Completed Successfully</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 text-[11px] font-mono">
            <div className="bg-black/30 p-2 rounded border border-emerald-900/60">
              <span className="text-zinc-400 text-[10px] block">REDUCED LINES</span>
              <span className="text-emerald-300 text-sm font-bold">
                -{completionMetrics.linesReduced} lines
              </span>
            </div>
            <div className="bg-black/30 p-2 rounded border border-emerald-900/60">
              <span className="text-zinc-400 text-[10px] block">TEST SUITES</span>
              <span className="text-emerald-300 text-sm font-bold">
                {completionMetrics.testsPassing} passing
              </span>
            </div>
            <div className="bg-black/30 p-2 rounded border border-emerald-900/60">
              <span className="text-zinc-400 text-[10px] block">FILES MODIFIED</span>
              <span className="text-zinc-200 text-sm font-bold">
                {completionMetrics.refactoredFiles} files
              </span>
            </div>
            <div className="bg-black/30 p-2 rounded border border-emerald-900/60">
              <span className="text-zinc-400 text-[10px] block">BUILD ELAPSED</span>
              <span className="text-zinc-200 text-sm font-bold">412ms</span>
            </div>
          </div>

          {onRestart && (
            <button
              onClick={onRestart}
              className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded text-xs transition-colors"
            >
              Replay Autonomous Simulation
            </button>
          )}
        </div>
      )}

      {/* Thought / Action Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-zinc-500" />
          <span>Agent Reasoning & Log</span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-2.5 bg-[#252526] hover:bg-[#282829] rounded border border-[#2d2d2d] transition-colors text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 truncate">
                {getIcon(msg.type)}
                <span className="font-semibold text-zinc-200 truncate text-[11px]">
                  {msg.title}
                </span>
              </div>
              {msg.badge && (
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${getBadgeStyle(
                    msg.type
                  )}`}
                >
                  {msg.badge}
                </span>
              )}
            </div>

            <p className="text-zinc-300 text-[11px] leading-relaxed select-text">
              {msg.description}
            </p>

            {msg.file && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                <FileCode2 className="w-3 h-3 text-[#3178c6]" />
                <span className="truncate">{msg.file}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
