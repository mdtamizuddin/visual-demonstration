export type DemoPhase =
  | 'idle'
  | 'analyze'
  | 'inspect'
  | 'refactor'
  | 'update_imports'
  | 'run_tests_fail'
  | 'fix_issue'
  | 'run_tests_pass'
  | 'build_and_complete';

export interface PhaseInfo {
  id: DemoPhase;
  title: string;
  subtitle: string;
  badge: string;
}

export type FileGitStatus = 'clean' | 'modified' | 'untracked' | 'added' | 'deleted';

export interface ProjectFile {
  path: string;
  name: string;
  language: 'typescript' | 'json' | 'markdown';
  content: string;
  gitStatus: FileGitStatus;
  isNew?: boolean;
}

export interface TerminalEntry {
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  text: string;
  timestamp?: string;
}

export interface CursorPosition {
  x: number;
  y: number;
  visible: boolean;
  clicking: boolean;
  label?: string;
  targetId?: string;
}

export interface InlineAISuggestion {
  file: string;
  line: number;
  originalCode: string;
  suggestedCode: string;
  explanation: string;
  visible: boolean;
}

export interface AIMessageEntry {
  id: string;
  type: 'thought' | 'action' | 'analysis' | 'success' | 'alert';
  title: string;
  description: string;
  codeSnippet?: string;
  file?: string;
  timestamp: string;
  badge?: string;
}

export type DemoAction =
  | { type: 'SET_PHASE'; phase: DemoPhase; title: string; subtitle: string }
  | { type: 'MOVE_CURSOR'; targetId: string; label?: string; duration?: number }
  | { type: 'CLICK'; targetId?: string }
  | { type: 'OPEN_FILE'; file: string }
  | { type: 'CLOSE_FILE'; file: string }
  | { type: 'FOCUS_EDITOR_LINE'; line: number }
  | { type: 'SELECT_CODE'; startLine: number; endLine: number; startCol?: number; endCol?: number }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'AI_MESSAGE'; messageType: AIMessageEntry['type']; title: string; description: string; codeSnippet?: string; file?: string; badge?: string }
  | { type: 'SET_AI_STATUS'; status: string; isBusy: boolean }
  | { type: 'SHOW_INLINE_SUGGESTION'; file: string; line: number; originalCode: string; suggestedCode: string; explanation: string }
  | { type: 'HIDE_INLINE_SUGGESTION' }
  | { type: 'CREATE_FILE'; file: string; content?: string }
  | { type: 'TYPE_CODE'; file: string; insertAtLine?: number; content: string; speed?: number }
  | { type: 'UPDATE_FILE_CONTENT'; file: string; content: string; gitStatus?: FileGitStatus }
  | { type: 'SHOW_DIFF'; file: string; original: string; modified: string }
  | { type: 'HIDE_DIFF' }
  | { type: 'SWITCH_TERMINAL_TAB'; tab: 'TERMINAL' | 'OUTPUT' | 'PROBLEMS' | 'DEBUG CONSOLE' }
  | { type: 'TERMINAL_COMMAND'; command: string; outputLines: Array<{ text: string; type?: TerminalEntry['type']; delay?: number }> }
  | { type: 'CLEAR_TERMINAL' }
  | { type: 'SET_STATUS_BAR'; leftText?: string; aiText?: string; errorCount?: number; warningCount?: number }
  | { type: 'WAIT'; duration: number }
  | { type: 'COMPLETE_DEMO'; metrics: { refactoredFiles: number; linesReduced: number; testsPassing: number; timeElapsed: string } };
