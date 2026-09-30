'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  DemoAction,
  DemoPhase,
  ProjectFile,
  TerminalEntry,
  CursorPosition,
  InlineAISuggestion,
  AIMessageEntry,
} from './demo-types';
import { DEMO_SCENARIO, PHASES_LIST } from './demo-scenarios';
import {
  INITIAL_FILES,
  INITIAL_FILE_TREE,
  FileTreeNode,
  EXTRACTED_SESSION_VALIDATOR_V1,
  EXTRACTED_SESSION_VALIDATOR_FIXED,
  REFACTORED_AUTH_SERVICE,
} from '@/data/demo-project';

export interface DemoEngineState {
  isPlaying: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  currentActionIndex: number;
  totalActions: number;
  progressPercent: number;
  currentPhase: DemoPhase;
  phaseTitle: string;
  phaseSubtitle: string;
  speedMultiplier: number;
  files: Record<string, ProjectFile>;
  fileTree: FileTreeNode[];
  openFiles: string[];
  activeFile: string;
  editorFocusedLine: number;
  selectedRange: { startLine: number; endLine: number; startCol?: number; endCol?: number } | null;
  cursor: CursorPosition;
  aiMessages: AIMessageEntry[];
  aiStatus: { text: string; isBusy: boolean };
  inlineSuggestion: InlineAISuggestion | null;
  diffView: { visible: boolean; file: string; original: string; modified: string } | null;
  terminalTab: 'TERMINAL' | 'OUTPUT' | 'PROBLEMS' | 'DEBUG CONSOLE';
  terminalLines: TerminalEntry[];
  currentCommandTyping: string;
  statusBar: { leftText: string; aiText: string; errors: number; warnings: number };
  completionMetrics: {
    refactoredFiles: number;
    linesReduced: number;
    testsPassing: number;
    timeElapsed: string;
  } | null;
}

export function useDemoEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<DemoPhase>('idle');
  const [phaseTitle, setPhaseTitle] = useState('Idle: Ready to Start');
  const [phaseSubtitle, setPhaseSubtitle] = useState('Click "Start Demo" to run the autonomous coding workflow.');

  const [files, setFiles] = useState<Record<string, ProjectFile>>(() => JSON.parse(JSON.stringify(INITIAL_FILES)));
  const [fileTree, setFileTree] = useState<FileTreeNode[]>(() => JSON.parse(JSON.stringify(INITIAL_FILE_TREE)));
  const [openFiles, setOpenFiles] = useState<string[]>(['src/modules/auth/auth.service.ts']);
  const [activeFile, setActiveFile] = useState<string>('src/modules/auth/auth.service.ts');

  const [editorFocusedLine, setEditorFocusedLine] = useState(1);
  const [selectedRange, setSelectedRange] = useState<{
    startLine: number;
    endLine: number;
    startCol?: number;
    endCol?: number;
  } | null>(null);

  const [cursor, setCursor] = useState<CursorPosition>({
    x: 450,
    y: 350,
    visible: true,
    clicking: false,
    label: undefined,
  });

  const [aiMessages, setAiMessages] = useState<AIMessageEntry[]>([
    {
      id: 'welcome',
      type: 'thought',
      title: 'Autonomous AI Engine Ready',
      description: 'Workspace loaded (nova-dashboard). Ready to scan project for duplication patterns, refactor modules, and run automated Jest tests.',
      timestamp: 'Ready',
      badge: 'INITIALIZED',
    },
  ]);

  const [aiStatus, setAiStatus] = useState<{ text: string; isBusy: boolean }>({
    text: 'Standby - Click Start to begin',
    isBusy: false,
  });

  const [inlineSuggestion, setInlineSuggestion] = useState<InlineAISuggestion | null>(null);
  const [diffView, setDiffView] = useState<{ visible: boolean; file: string; original: string; modified: string } | null>(null);

  const [terminalTab, setTerminalTab] = useState<'TERMINAL' | 'OUTPUT' | 'PROBLEMS' | 'DEBUG CONSOLE'>('TERMINAL');
  const [terminalLines, setTerminalLines] = useState<TerminalEntry[]>([
    { type: 'info', text: 'workspace: ~/projects/nova-dashboard (node v20.10.0, pnpm v8.15.1)' },
    { type: 'output', text: '$ echo "Ready for autonomous testing"' },
    { type: 'output', text: 'Ready for autonomous testing' },
  ]);
  const [currentCommandTyping, setCurrentCommandTyping] = useState('');

  const [statusBar, setStatusBar] = useState({
    leftText: 'main',
    aiText: 'AI Agent: Idle',
    errors: 0,
    warnings: 0,
  });

  const [completionMetrics, setCompletionMetrics] = useState<{
    refactoredFiles: number;
    linesReduced: number;
    testsPassing: number;
    timeElapsed: string;
  } | null>(null);

  // Internal execution refs
  const isPlayingRef = useRef(isPlaying);
  const isPausedRef = useRef(isPaused);
  const speedRef = useRef(speedMultiplier);
  const actionIndexRef = useRef(currentActionIndex);
  const cancelExecutionRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    actionIndexRef.current = currentActionIndex;
  }, [currentActionIndex]);

  // Helper delay respecting speed multiplier
  const delay = useCallback((ms: number) => {
    const adjusted = Math.max(20, ms / speedRef.current);
    return new Promise<void>((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        if (cancelExecutionRef.current) {
          clearInterval(interval);
          resolve();
          return;
        }
        if (!isPausedRef.current) {
          if (Date.now() - start >= adjusted) {
            clearInterval(interval);
            resolve();
          }
        }
      }, 25);
    });
  }, []);

  // Update cursor position by resolving DOM target element
  const moveCursorToTarget = useCallback((targetId: string, label?: string) => {
    if (typeof window === 'undefined') return;
    const el = document.getElementById(targetId) || document.querySelector(`[data-cursor-id="${targetId}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const x = rect.left + Math.min(rect.width * 0.45, 120);
      const y = rect.top + Math.min(rect.height * 0.5, 20);
      setCursor({
        x,
        y,
        visible: true,
        clicking: false,
        label,
        targetId,
      });
    } else {
      // Fallback coordinate approximation based on target type
      if (targetId.startsWith('file-')) {
        setCursor((prev) => ({ ...prev, x: 140, y: 180, label, visible: true }));
      } else if (targetId.startsWith('tab-')) {
        setCursor((prev) => ({ ...prev, x: 280, y: 55, label, visible: true }));
      } else if (targetId.startsWith('terminal-')) {
        setCursor((prev) => ({ ...prev, x: 420, y: 640, label, visible: true }));
      } else {
        setCursor((prev) => ({ ...prev, label, visible: true }));
      }
    }
  }, []);

  // Simulate click on cursor
  const triggerClick = useCallback((targetId?: string) => {
    setCursor((prev) => ({ ...prev, clicking: true }));
    setTimeout(() => {
      setCursor((prev) => ({ ...prev, clicking: false }));
    }, 200);

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    }
  }, []);

  // Add new file to tree helper
  const addFileToTree = useCallback((filePath: string) => {
    setFileTree((prev) => {
      const newTree = JSON.parse(JSON.stringify(prev)) as FileTreeNode[];
      const authFolder = newTree[0]?.children?.[0]?.children?.[0]; // src/modules/auth
      if (authFolder && authFolder.children) {
        if (!authFolder.children.find((c) => c.path === filePath)) {
          authFolder.children.push({
            id: filePath,
            name: 'session-validator.ts',
            path: filePath,
            isFolder: false,
            gitStatus: 'untracked',
          });
        }
      }
      return newTree;
    });
  }, []);

  // Type code character-by-character into a file
  const simulateTyping = useCallback(async (filePath: string, targetContent: string) => {
    const lines = targetContent.split('\n');
    let currentBuffer = '';

    // Type line by line with realistic chunks
    for (let i = 0; i < lines.length; i++) {
      if (cancelExecutionRef.current) break;
      currentBuffer += (i > 0 ? '\n' : '') + lines[i];

      setFiles((prev) => ({
        ...prev,
        [filePath]: {
          ...(prev[filePath] || {
            path: filePath,
            name: filePath.split('/').pop() || '',
            language: 'typescript',
            gitStatus: 'untracked',
          }),
          content: currentBuffer,
        },
      }));

      // Focus editor line roughly matching current progress
      setEditorFocusedLine(i + 1);

      // Natural typing cadence
      await delay(Math.max(12, 45 - Math.min(i, 30)));
    }
  }, [delay]);

  // Terminal command typing simulation
  const simulateTerminalCommand = useCallback(
    async (
      command: string,
      outputLines: Array<{ text: string; type?: TerminalEntry['type']; delay?: number }>
    ) => {
      // Type command
      for (let i = 0; i <= command.length; i++) {
        if (cancelExecutionRef.current) break;
        setCurrentCommandTyping(command.slice(0, i));
        await delay(35);
      }

      await delay(150);

      // Push command to terminal history
      setTerminalLines((prev) => [
        ...prev,
        { type: 'command', text: `$ ${command}`, timestamp: new Date().toLocaleTimeString() },
      ]);
      setCurrentCommandTyping('');

      // Emit outputs
      for (const out of outputLines) {
        if (cancelExecutionRef.current) break;
        await delay(out.delay || 120);
        setTerminalLines((prev) => [
          ...prev,
          { type: out.type || 'output', text: out.text },
        ]);
      }
    },
    [delay]
  );

  // Execute a single DemoAction
  const executeAction = useCallback(
    async (action: DemoAction) => {
      if (cancelExecutionRef.current) return;

      switch (action.type) {
        case 'SET_PHASE':
          setCurrentPhase(action.phase);
          setPhaseTitle(action.title);
          setPhaseSubtitle(action.subtitle);
          break;

        case 'MOVE_CURSOR':
          moveCursorToTarget(action.targetId, action.label);
          await delay(action.duration || 600);
          break;

        case 'CLICK':
          triggerClick(action.targetId);
          await delay(200);
          break;

        case 'OPEN_FILE':
          setOpenFiles((prev) => (prev.includes(action.file) ? prev : [...prev, action.file]));
          setActiveFile(action.file);
          break;

        case 'CLOSE_FILE':
          setOpenFiles((prev) => prev.filter((f) => f !== action.file));
          if (activeFile === action.file) {
            setActiveFile(openFiles[0] || '');
          }
          break;

        case 'FOCUS_EDITOR_LINE':
          setEditorFocusedLine(action.line);
          break;

        case 'SELECT_CODE':
          setSelectedRange({
            startLine: action.startLine,
            endLine: action.endLine,
            startCol: action.startCol,
            endCol: action.endCol,
          });
          break;

        case 'CLEAR_SELECTION':
          setSelectedRange(null);
          break;

        case 'AI_MESSAGE':
          setAiMessages((prev) => [
            {
              id: `${Date.now()}-${Math.random()}`,
              type: action.messageType,
              title: action.title,
              description: action.description,
              codeSnippet: action.codeSnippet,
              file: action.file,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              badge: action.badge,
            },
            ...prev,
          ]);
          break;

        case 'SET_AI_STATUS':
          setAiStatus({ text: action.status, isBusy: action.isBusy });
          break;

        case 'SHOW_INLINE_SUGGESTION':
          setInlineSuggestion({
            file: action.file,
            line: action.line,
            originalCode: action.originalCode,
            suggestedCode: action.suggestedCode,
            explanation: action.explanation,
            visible: true,
          });
          break;

        case 'HIDE_INLINE_SUGGESTION':
          setInlineSuggestion(null);
          break;

        case 'CREATE_FILE':
          addFileToTree(action.file);
          setFiles((prev) => ({
            ...prev,
            [action.file]: {
              path: action.file,
              name: action.file.split('/').pop() || '',
              language: 'typescript',
              content: action.content || '',
              gitStatus: 'untracked',
              isNew: true,
            },
          }));
          break;

        case 'TYPE_CODE':
          await simulateTyping(action.file, action.content);
          break;

        case 'UPDATE_FILE_CONTENT':
          setFiles((prev) => ({
            ...prev,
            [action.file]: {
              ...prev[action.file],
              content: action.content,
              gitStatus: action.gitStatus || prev[action.file]?.gitStatus || 'modified',
            },
          }));
          break;

        case 'SHOW_DIFF':
          setDiffView({
            visible: true,
            file: action.file,
            original: action.original,
            modified: action.modified,
          });
          break;

        case 'HIDE_DIFF':
          setDiffView(null);
          break;

        case 'SWITCH_TERMINAL_TAB':
          setTerminalTab(action.tab);
          break;

        case 'TERMINAL_COMMAND':
          await simulateTerminalCommand(action.command, action.outputLines);
          break;

        case 'CLEAR_TERMINAL':
          setTerminalLines([]);
          break;

        case 'SET_STATUS_BAR':
          setStatusBar((prev) => ({
            leftText: action.leftText ?? prev.leftText,
            aiText: action.aiText ?? prev.aiText,
            errors: action.errorCount ?? prev.errors,
            warnings: action.warningCount ?? prev.warnings,
          }));
          break;

        case 'WAIT':
          await delay(action.duration);
          break;

        case 'COMPLETE_DEMO':
          setCompletionMetrics(action.metrics);
          setIsCompleted(true);
          setIsPlaying(false);
          setPhaseTitle('Demonstration Complete');
          setPhaseSubtitle('Autonomous AI developer successfully resolved duplication, handled edge-case, and passed all tests.');
          break;
      }
    },
    [delay, moveCursorToTarget, triggerClick, addFileToTree, simulateTyping, simulateTerminalCommand, activeFile, openFiles]
  );

  // Main execution loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    cancelExecutionRef.current = false;
    let isActive = true;

    async function runLoop() {
      for (let i = actionIndexRef.current; i < DEMO_SCENARIO.length; i++) {
        if (!isPlayingRef.current || isPausedRef.current || cancelExecutionRef.current) {
          break;
        }
        setCurrentActionIndex(i);
        actionIndexRef.current = i;
        await executeAction(DEMO_SCENARIO[i]);
      }
    }

    runLoop();

    return () => {
      isActive = false;
    };
  }, [isPlaying, isPaused, executeAction]);

  // Controls
  const startDemo = useCallback(() => {
    cancelExecutionRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);
    setIsCompleted(false);
  }, []);

  const pauseDemo = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeDemo = useCallback(() => {
    setIsPaused(false);
  }, []);

  const restartDemo = useCallback(() => {
    cancelExecutionRef.current = true;
    setIsPlaying(false);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentActionIndex(0);
    actionIndexRef.current = 0;

    // Reset workspace state
    setFiles(JSON.parse(JSON.stringify(INITIAL_FILES)));
    setFileTree(JSON.parse(JSON.stringify(INITIAL_FILE_TREE)));
    setOpenFiles(['src/modules/auth/auth.service.ts']);
    setActiveFile('src/modules/auth/auth.service.ts');
    setEditorFocusedLine(1);
    setSelectedRange(null);
    setDiffView(null);
    setInlineSuggestion(null);
    setCurrentPhase('idle');
    setPhaseTitle('Idle: Ready to Start');
    setPhaseSubtitle('Click "Start Demo" to run the autonomous coding workflow.');
    setTerminalTab('TERMINAL');
    setTerminalLines([
      { type: 'info', text: 'workspace: ~/projects/nova-dashboard (node v20.10.0, pnpm v8.15.1)' },
      { type: 'output', text: '$ echo "Ready for autonomous testing"' },
      { type: 'output', text: 'Ready for autonomous testing' },
    ]);
    setStatusBar({
      leftText: 'main',
      aiText: 'AI Agent: Idle',
      errors: 0,
      warnings: 0,
    });
    setCompletionMetrics(null);
    setAiMessages([
      {
        id: 'reset',
        type: 'thought',
        title: 'Workspace Reset to Initial State',
        description: 'Cleaned repository state. Ready for fresh autonomous coding sequence.',
        timestamp: 'Reset',
        badge: 'READY',
      },
    ]);
  }, []);

  const jumpToPhase = useCallback((targetPhase: DemoPhase) => {
    const targetIdx = DEMO_SCENARIO.findIndex(
      (action) => action.type === 'SET_PHASE' && action.phase === targetPhase
    );

    if (targetIdx !== -1) {
      setCurrentActionIndex(targetIdx);
      actionIndexRef.current = targetIdx;

      // Fast-forward file state up to targetIdx
      const fastFiles = JSON.parse(JSON.stringify(INITIAL_FILES));
      if (['update_imports', 'run_tests_fail', 'fix_issue', 'build_and_complete'].includes(targetPhase)) {
        fastFiles['src/modules/auth/session-validator.ts'] = {
          path: 'src/modules/auth/session-validator.ts',
          name: 'session-validator.ts',
          language: 'typescript',
          gitStatus: 'untracked',
          content: targetPhase === 'fix_issue' || targetPhase === 'build_and_complete'
            ? EXTRACTED_SESSION_VALIDATOR_FIXED
            : EXTRACTED_SESSION_VALIDATOR_V1,
        };
        addFileToTree('src/modules/auth/session-validator.ts');
        fastFiles['src/modules/auth/auth.service.ts'].content = REFACTORED_AUTH_SERVICE;
        fastFiles['src/modules/auth/auth.service.ts'].gitStatus = 'modified';
      }
      setFiles(fastFiles);
      setCurrentPhase(targetPhase);
    }
  }, [addFileToTree]);

  const openFileManual = useCallback((path: string) => {
    setOpenFiles((prev) => (prev.includes(path) ? prev : [...prev, path]));
    setActiveFile(path);
  }, []);

  const closeFileManual = useCallback((path: string) => {
    setOpenFiles((prev) => {
      const next = prev.filter((p) => p !== path);
      if (activeFile === path) {
        setActiveFile(next[0] || '');
      }
      return next;
    });
  }, [activeFile]);

  const toggleDiff = useCallback((explicitVisible?: boolean) => {
    setDiffView((prev) => {
      const nextVisible = explicitVisible !== undefined ? explicitVisible : !prev?.visible;
      if (!nextVisible) return null;
      return {
        visible: true,
        file: 'src/modules/auth/auth.service.ts',
        original: INITIAL_FILES['src/modules/auth/auth.service.ts'].content,
        modified: files['src/modules/auth/auth.service.ts']?.content || REFACTORED_AUTH_SERVICE,
      };
    });
  }, [files]);

  const progressPercent = Math.min(
    100,
    Math.round((currentActionIndex / (DEMO_SCENARIO.length - 1)) * 100)
  );

  return {
    state: {
      isPlaying,
      isPaused,
      isCompleted,
      currentActionIndex,
      totalActions: DEMO_SCENARIO.length,
      progressPercent,
      currentPhase,
      phaseTitle,
      phaseSubtitle,
      speedMultiplier,
      files,
      fileTree,
      openFiles,
      activeFile,
      editorFocusedLine,
      selectedRange,
      cursor,
      aiMessages,
      aiStatus,
      inlineSuggestion,
      diffView,
      terminalTab,
      terminalLines,
      currentCommandTyping,
      statusBar,
      completionMetrics,
    },
    controls: {
      startDemo,
      pauseDemo,
      resumeDemo,
      restartDemo,
      setSpeedMultiplier,
      jumpToPhase,
      openFileManual,
      closeFileManual,
      toggleDiff,
      setTerminalTab,
    },
  };
}
