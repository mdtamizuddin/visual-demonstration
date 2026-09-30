'use client';

import React, { useRef, useEffect } from 'react';
import { Sparkles, Check, X, FileCode, ChevronRight } from 'lucide-react';
import { InlineAISuggestion, ProjectFile } from '@/engine/demo-types';
import { Minimap } from './Minimap';

interface EditorProps {
  file: ProjectFile;
  focusedLine?: number;
  selectedRange?: { startLine: number; endLine: number; startCol?: number; endCol?: number } | null;
  inlineSuggestion?: InlineAISuggestion | null;
  onAcceptSuggestion?: () => void;
  onRejectSuggestion?: () => void;
}

export function Editor({
  file,
  focusedLine = 1,
  selectedRange,
  inlineSuggestion,
  onAcceptSuggestion,
  onRejectSuggestion,
}: EditorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll editor to focused line smoothly
  useEffect(() => {
    if (focusedLine && scrollContainerRef.current) {
      const lineElement = document.getElementById(`editor-line-${focusedLine}`);
      if (lineElement) {
        lineElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [focusedLine]);

  const lines = (file?.content || '').split('\n');

  // Realistic TypeScript syntax highlighter tokenization
  const renderSyntaxLine = (lineText: string) => {
    if (!lineText) return <span>&nbsp;</span>;

    // Comments
    if (lineText.trim().startsWith('//') || lineText.trim().startsWith('*') || lineText.trim().startsWith('/*') || lineText.trim().startsWith('*/')) {
      return <span className="text-[#6a9955] italic">{lineText}</span>;
    }

    // Decorators
    if (lineText.trim().startsWith('@')) {
      return <span className="text-[#dcdcaa] font-semibold">{lineText}</span>;
    }

    // Regex token replacement for key TypeScript parts
    const tokens = lineText.split(/(\b(?:import|from|export|class|interface|enum|constructor|private|readonly|public|async|await|return|if|else|throw|new|try|catch|const|let|var|type|as)\b|\b(?:string|number|boolean|any|void|Promise|SessionPayload|UserRole|AuthUser|JwtService|RedisService|AuthService|SessionValidator|ValidationResult)\b|'[^']*'|`[^`]*`|"[^"]*"|\/\/.+$)/g);

    return (
      <>
        {tokens.map((token, i) => {
          if (!token) return null;

          // Keywords
          if (
            /^(import|from|export|class|interface|enum|constructor|private|readonly|public|async|await|return|if|else|throw|new|try|catch|const|let|var|type|as)$/.test(
              token
            )
          ) {
            return (
              <span key={i} className="text-[#c586c0] font-medium">
                {token}
              </span>
            );
          }

          // Types & Interfaces
          if (
            /^(string|number|boolean|any|void|Promise|SessionPayload|UserRole|AuthUser|JwtService|RedisService|AuthService|SessionValidator|ValidationResult)$/.test(
              token
            )
          ) {
            return (
              <span key={i} className="text-[#4ec9b0] font-medium">
                {token}
              </span>
            );
          }

          // Strings
          if (
            (token.startsWith("'") && token.endsWith("'")) ||
            (token.startsWith('"') && token.endsWith('"')) ||
            (token.startsWith('`') && token.endsWith('`'))
          ) {
            return (
              <span key={i} className="text-[#ce9178]">
                {token}
              </span>
            );
          }

          // Comment inside line
          if (token.startsWith('//')) {
            return (
              <span key={i} className="text-[#6a9955] italic">
                {token}
              </span>
            );
          }

          // Method calls or property access
          if (/\b[a-zA-Z_]\w*(?=\()/.test(token)) {
            return (
              <span key={i} className="text-[#dcdcaa]">
                {token}
              </span>
            );
          }

          return <span key={i} className="text-[#d4d4d4]">{token}</span>;
        })}
      </>
    );
  };

  const breadcrumbs = file.path.split('/');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] overflow-hidden relative">
      {/* Breadcrumb Bar */}
      <div className="h-6 bg-[#1e1e1e] border-b border-[#252526] flex items-center px-4 text-[11px] text-[#858585] select-none shrink-0 font-mono">
        <FileCode className="w-3.5 h-3.5 text-[#3178c6] mr-1.5" />
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3 h-3 text-[#555555] mx-1" />}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? 'text-[#cccccc] font-medium'
                  : 'hover:text-[#bbbbbb] cursor-pointer'
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Main Code View Area + Minimap */}
      <div className="flex-1 flex h-full overflow-hidden relative">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto font-mono text-[13px] leading-[21px] scrollbar-thin select-text"
        >
          <div className="py-2 min-w-max">
            {lines.map((lineText, lineIdx) => {
              const lineNum = lineIdx + 1;
              const isSelected =
                selectedRange &&
                lineNum >= selectedRange.startLine &&
                lineNum <= selectedRange.endLine;
              const isFocused = lineNum === focusedLine;

              return (
                <div
                  key={lineNum}
                  id={`editor-line-${lineNum}`}
                  data-cursor-id={`editor-line-${lineNum}`}
                  className={`flex items-stretch relative transition-colors ${
                    isSelected
                      ? 'bg-[#264f78]/40'
                      : isFocused
                      ? 'bg-[#282828]/60'
                      : 'hover:bg-[#282828]/25'
                  }`}
                >
                  {/* Git gutter diff indicator */}
                  <div
                    className={`w-1 shrink-0 ${
                      file.gitStatus === 'untracked'
                        ? 'bg-emerald-500'
                        : file.gitStatus === 'modified' && isSelected
                        ? 'bg-amber-400'
                        : 'bg-transparent'
                    }`}
                  />

                  {/* Line Number */}
                  <div className="w-12 text-right pr-4 text-[#858585] select-none text-[12px] font-mono shrink-0">
                    {lineNum}
                  </div>

                  {/* Code Line Text */}
                  <div className="flex-1 pr-6 pl-1 font-mono whitespace-pre text-[#d4d4d4]">
                    {renderSyntaxLine(lineText)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inline AI Suggestion Overlay Card (VS Code Inline Chat / Copilot) */}
          {inlineSuggestion && inlineSuggestion.file === file.path && (
            <div className="mx-12 my-3 p-3 rounded-lg bg-[#252526] border border-[#007acc] shadow-xl text-xs font-sans max-w-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3c3c3c]">
                <div className="flex items-center gap-2 text-[#38bdf8] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#38bdf8] animate-pulse" />
                  <span>AI Refactoring Proposal</span>
                  <span className="text-[10px] text-zinc-400 font-normal">
                    (Line {inlineSuggestion.line})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onAcceptSuggestion}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-[11px] font-medium transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Accept [Tab]
                  </button>
                  <button
                    onClick={onRejectSuggestion}
                    className="flex items-center gap-1 px-2 py-1 bg-[#333333] hover:bg-[#404040] text-zinc-300 rounded text-[11px] transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Discard [Esc]
                  </button>
                </div>
              </div>

              <p className="text-zinc-300 mb-2 leading-relaxed">
                {inlineSuggestion.explanation}
              </p>

              <div className="font-mono text-[11px] bg-[#1a1a1a] p-2.5 rounded border border-[#333333] text-emerald-400 overflow-x-auto">
                <span className="text-zinc-500">{'// Proposed replacement:'}</span>
                <br />
                {inlineSuggestion.suggestedCode}
              </div>
            </div>
          )}
        </div>

        {/* Minimap preview */}
        <Minimap lines={lines} focusedLine={focusedLine} />
      </div>
    </div>
  );
}
