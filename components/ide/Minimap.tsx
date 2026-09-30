'use client';

import React from 'react';

interface MinimapProps {
  lines: string[];
  focusedLine?: number;
}

export function Minimap({ lines, focusedLine = 1 }: MinimapProps) {
  const visibleLines = lines.slice(0, 100);
  const total = Math.max(1, lines.length);
  const viewportTopPercent = Math.min(85, Math.max(0, ((focusedLine - 10) / total) * 100));

  return (
    <div className="w-20 bg-[#1e1e1e] border-l border-[#252526] h-full hidden lg:flex flex-col relative select-none overflow-hidden shrink-0 py-2 opacity-75 hover:opacity-100 transition-opacity">
      {/* Viewport indicator box */}
      <div
        style={{ top: `${viewportTopPercent}%` }}
        className="absolute left-0 right-0 h-16 bg-white/10 border border-white/20 pointer-events-none transition-all duration-300 rounded-[1px]"
      />

      {/* Miniature code lines */}
      <div className="flex flex-col gap-[2px] px-1 pointer-events-none">
        {visibleLines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-[2px] w-full" />;
          }

          const widthPercent = Math.min(95, Math.max(15, trimmed.length * 1.4));
          const isComment = trimmed.startsWith('//') || trimmed.startsWith('*');
          const isKeyword = trimmed.startsWith('import') || trimmed.startsWith('export') || trimmed.startsWith('class');

          return (
            <div
              key={idx}
              style={{ width: `${widthPercent}%` }}
              className={`h-[2px] rounded-[0.5px] ${
                isComment
                  ? 'bg-[#6a9955]/40'
                  : isKeyword
                  ? 'bg-[#c586c0]/60'
                  : 'bg-[#cccccc]/30'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
