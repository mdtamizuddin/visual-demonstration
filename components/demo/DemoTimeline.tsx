'use client';

import React from 'react';
import { DemoPhase, PhaseInfo } from '@/engine/demo-types';
import { PHASES_LIST } from '@/engine/demo-scenarios';
import { Check } from 'lucide-react';

interface DemoTimelineProps {
  currentPhase: DemoPhase;
  onPhaseSelect: (phase: DemoPhase) => void;
}

export function DemoTimeline({ currentPhase, onPhaseSelect }: DemoTimelineProps) {
  const currentIdx = PHASES_LIST.findIndex((p) => p.id === currentPhase);

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none select-none">
      {PHASES_LIST.map((phase, idx) => {
        const isCurrent = phase.id === currentPhase;
        const isPast = currentIdx > idx;

        return (
          <button
            key={phase.id}
            onClick={() => onPhaseSelect(phase.id)}
            title={`${phase.title}: ${phase.subtitle}`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-all whitespace-nowrap ${
              isCurrent
                ? 'bg-[#007acc] text-white shadow-sm font-semibold ring-1 ring-[#38bdf8]'
                : isPast
                ? 'bg-[#252526] text-emerald-400 hover:bg-[#2e2e30]'
                : 'bg-[#1e1e1e] text-zinc-400 hover:bg-[#252526] hover:text-zinc-200'
            }`}
          >
            {isPast ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <span className="text-[10px] opacity-75">{phase.badge.split(' ')[0]}</span>
            )}
            <span className="truncate">{phase.title.split(':')[1]?.trim() || phase.title}</span>
          </button>
        );
      })}
    </div>
  );
}
