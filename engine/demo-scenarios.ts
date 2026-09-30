import { DemoAction, PhaseInfo } from './demo-types';
import {
  EXTRACTED_SESSION_VALIDATOR_V1,
  EXTRACTED_SESSION_VALIDATOR_FIXED,
  REFACTORED_AUTH_SERVICE,
  INITIAL_FILES,
} from '@/data/demo-project';

export const PHASES_LIST: PhaseInfo[] = [
  {
    id: 'analyze',
    title: 'Phase 1: Analyze Architecture',
    subtitle: 'AI scans codebase structure & flags duplication patterns',
    badge: '01 / 06',
  },
  {
    id: 'inspect',
    title: 'Phase 2: Inspect Code',
    subtitle: 'Deep code traversal & AST pattern matching in auth service',
    badge: '02 / 06',
  },
  {
    id: 'refactor',
    title: 'Phase 3: Extract Service',
    subtitle: 'Autonomously generating dedicated SessionValidator module',
    badge: '03 / 06',
  },
  {
    id: 'update_imports',
    title: 'Phase 4: Update Imports & Diff',
    subtitle: 'Refactoring consumer service and inspecting Git diff',
    badge: '04 / 06',
  },
  {
    id: 'run_tests_fail',
    title: 'Phase 5: Run Tests & Detect Issue',
    subtitle: 'Running test runner and detecting simulated edge-case regression',
    badge: '05 / 06',
  },
  {
    id: 'fix_issue',
    title: 'Phase 6: Self-Correction & Build',
    subtitle: 'Patching role hierarchy, all tests pass, production build ok',
    badge: '06 / 06',
  },
];

export const DEMO_SCENARIO: DemoAction[] = [
  // ==========================================
  // PHASE 1: ANALYZE
  // ==========================================
  {
    type: 'SET_PHASE',
    phase: 'analyze',
    title: 'Phase 1: Analyze Project',
    subtitle: 'Autonomous agent initializing repo scan on nova-dashboard',
  },
  {
    type: 'SET_AI_STATUS',
    status: 'Scanning workspace AST...',
    isBusy: true,
  },
  {
    type: 'SET_STATUS_BAR',
    leftText: 'main*',
    aiText: 'Agent: Analyzing project structure...',
    errorCount: 0,
    warningCount: 0,
  },
  {
    type: 'AI_MESSAGE',
    messageType: 'analysis',
    title: 'Project Analysis Initiated',
    description: 'Scanning TypeScript AST across 18 source files in nova-dashboard. Indexing exported symbols and dependency graph.',
    badge: 'WORKSPACE SCAN',
  },
  { type: 'WAIT', duration: 900 },

  {
    type: 'AI_MESSAGE',
    messageType: 'thought',
    title: 'Inspecting Authentication Module',
    description: 'Found 4 files under src/modules/auth/. Checking controller, service, and type definitions for coupling.',
    file: 'src/modules/auth',
    badge: 'INSPECT',
  },
  { type: 'WAIT', duration: 700 },

  // Mouse moves to Explorer and opens auth.service.ts
  {
    type: 'MOVE_CURSOR',
    targetId: 'file-src/modules/auth/auth.service.ts',
    label: 'Open auth.service.ts',
    duration: 800,
  },
  { type: 'CLICK', targetId: 'file-src/modules/auth/auth.service.ts' },
  { type: 'OPEN_FILE', file: 'src/modules/auth/auth.service.ts' },
  { type: 'WAIT', duration: 800 },

  // Open auth.controller.ts
  {
    type: 'MOVE_CURSOR',
    targetId: 'file-src/modules/auth/auth.controller.ts',
    label: 'Open auth.controller.ts',
    duration: 700,
  },
  { type: 'CLICK', targetId: 'file-src/modules/auth/auth.controller.ts' },
  { type: 'OPEN_FILE', file: 'src/modules/auth/auth.controller.ts' },
  { type: 'WAIT', duration: 600 },

  // Open auth.types.ts
  {
    type: 'MOVE_CURSOR',
    targetId: 'file-src/modules/auth/auth.types.ts',
    label: 'Open auth.types.ts',
    duration: 700,
  },
  { type: 'CLICK', targetId: 'file-src/modules/auth/auth.types.ts' },
  { type: 'OPEN_FILE', file: 'src/modules/auth/auth.types.ts' },
  { type: 'WAIT', duration: 700 },

  // Return to auth.service.ts
  {
    type: 'MOVE_CURSOR',
    targetId: 'tab-src/modules/auth/auth.service.ts',
    label: 'Focus auth.service.ts',
    duration: 600,
  },
  { type: 'CLICK', targetId: 'tab-src/modules/auth/auth.service.ts' },
  { type: 'OPEN_FILE', file: 'src/modules/auth/auth.service.ts' },

  {
    type: 'AI_MESSAGE',
    messageType: 'alert',
    title: 'Code Duplication Detected',
    description: 'Found identical token parsing, signature verification, and redis revocation checks across 3 separate methods in auth.service.ts.',
    file: 'auth.service.ts',
    badge: 'ANTI-PATTERN',
  },
  { type: 'WAIT', duration: 900 },

  // ==========================================
  // PHASE 2: INSPECT CODE
  // ==========================================
  {
    type: 'SET_PHASE',
    phase: 'inspect',
    title: 'Phase 2: Inspect Code',
    subtitle: 'Reviewing authentication flow and token verification logic',
  },
  {
    type: 'SET_AI_STATUS',
    status: 'Inspecting auth.service.ts lines 15-75',
    isBusy: true,
  },
  {
    type: 'MOVE_CURSOR',
    targetId: 'editor-line-20',
    label: 'Inspecting validateSession()',
    duration: 800,
  },
  { type: 'FOCUS_EDITOR_LINE', line: 20 },
  { type: 'SELECT_CODE', startLine: 16, endLine: 38 },
  { type: 'WAIT', duration: 1100 },

  {
    type: 'AI_MESSAGE',
    messageType: 'thought',
    title: 'Reviewing Authentication Flow',
    description: 'Method validateSession() performs Bearer slicing, Redis blacklist check, and JWT verification. This exact 14-line sequence is repeated verbatim in validateAdminSession() and validateUserSession().',
    badge: 'AST REVIEW',
  },
  { type: 'WAIT', duration: 900 },

  {
    type: 'MOVE_CURSOR',
    targetId: 'editor-line-44',
    label: 'Comparing validateAdminSession()',
    duration: 800,
  },
  { type: 'FOCUS_EDITOR_LINE', line: 44 },
  { type: 'SELECT_CODE', startLine: 43, endLine: 74 },
  { type: 'WAIT', duration: 1100 },

  // Show subtle inline suggestion
  {
    type: 'SHOW_INLINE_SUGGESTION',
    file: 'src/modules/auth/auth.service.ts',
    line: 16,
    originalCode: 'validateSession(rawBearerToken: string)',
    suggestedCode: 'return this.sessionValidator.validate(rawBearerToken);',
    explanation: 'Extract common token verification into dedicated SessionValidator service to eliminate 48 redundant lines.',
  },
  { type: 'WAIT', duration: 1200 },

  {
    type: 'AI_MESSAGE',
    messageType: 'thought',
    title: 'Potential Refactoring Opportunity Detected',
    description: 'High cyclomatic complexity and violation of DRY principle. Proposing extraction of SessionValidator provider with delegation pattern.',
    badge: 'REFACTOR PLAN',
  },
  { type: 'WAIT', duration: 1000 },
  { type: 'HIDE_INLINE_SUGGESTION' },
  { type: 'CLEAR_SELECTION' },

  // ==========================================
  // PHASE 3: REFACTOR (EXTRACT SERVICE)
  // ==========================================
  {
    type: 'SET_PHASE',
    phase: 'refactor',
    title: 'Phase 3: Extract SessionValidator',
    subtitle: 'Generating new modular service with unified session logic',
  },
  {
    type: 'SET_AI_STATUS',
    status: 'Creating session-validator.ts...',
    isBusy: true,
  },
  {
    type: 'MOVE_CURSOR',
    targetId: 'explorer-new-file-btn',
    label: 'Create session-validator.ts',
    duration: 800,
  },
  { type: 'CLICK', targetId: 'explorer-new-file-btn' },

  // Create file in project
  {
    type: 'CREATE_FILE',
    file: 'src/modules/auth/session-validator.ts',
    content: '// Autonomous AI Generation in progress...\n',
  },
  { type: 'OPEN_FILE', file: 'src/modules/auth/session-validator.ts' },
  {
    type: 'AI_MESSAGE',
    messageType: 'action',
    title: 'Created session-validator.ts',
    description: 'Scaffolding dedicated Injectable SessionValidator with centralized cryptographic checks and permission guards.',
    file: 'session-validator.ts',
    badge: 'NEW SERVICE',
  },
  { type: 'WAIT', duration: 600 },

  // Simulate typing code character-by-character into editor
  {
    type: 'TYPE_CODE',
    file: 'src/modules/auth/session-validator.ts',
    content: EXTRACTED_SESSION_VALIDATOR_V1,
    speed: 35,
  },
  { type: 'WAIT', duration: 1000 },

  {
    type: 'AI_MESSAGE',
    messageType: 'success',
    title: 'SessionValidator Code Generated',
    description: 'Synthesized 58 lines of clean TypeScript. Implemented validate(), validateWithRole(), and validateOwnership().',
    file: 'session-validator.ts',
    badge: 'SYNTHESIS COMPLETE',
  },
  { type: 'WAIT', duration: 800 },

  // ==========================================
  // PHASE 4: UPDATE IMPORTS & DIFF
  // ==========================================
  {
    type: 'SET_PHASE',
    phase: 'update_imports',
    title: 'Phase 4: Update Consumer Service',
    subtitle: 'Rewriting auth.service.ts to consume SessionValidator',
  },
  {
    type: 'SET_AI_STATUS',
    status: 'Updating auth.service.ts dependencies...',
    isBusy: true,
  },
  {
    type: 'MOVE_CURSOR',
    targetId: 'tab-src/modules/auth/auth.service.ts',
    label: 'Switch to auth.service.ts',
    duration: 700,
  },
  { type: 'CLICK', targetId: 'tab-src/modules/auth/auth.service.ts' },
  { type: 'OPEN_FILE', file: 'src/modules/auth/auth.service.ts' },
  { type: 'WAIT', duration: 600 },

  {
    type: 'SELECT_CODE',
    startLine: 1,
    endLine: 110,
  },
  { type: 'WAIT', duration: 700 },

  // Update file content
  {
    type: 'UPDATE_FILE_CONTENT',
    file: 'src/modules/auth/auth.service.ts',
    content: REFACTORED_AUTH_SERVICE,
    gitStatus: 'modified',
  },
  { type: 'CLEAR_SELECTION' },

  {
    type: 'AI_MESSAGE',
    messageType: 'action',
    title: 'Refactored auth.service.ts',
    description: 'Replaced 98 lines with 34 lines of declarative delegation. Cognitive complexity score reduced by 72%.',
    file: 'auth.service.ts',
    badge: 'MODIFIED',
  },
  { type: 'WAIT', duration: 700 },

  // Show Git Diff
  {
    type: 'MOVE_CURSOR',
    targetId: 'git-diff-toggle-btn',
    label: 'Open Git Diff View',
    duration: 700,
  },
  { type: 'CLICK', targetId: 'git-diff-toggle-btn' },
  {
    type: 'SHOW_DIFF',
    file: 'src/modules/auth/auth.service.ts',
    original: INITIAL_FILES['src/modules/auth/auth.service.ts'].content,
    modified: REFACTORED_AUTH_SERVICE,
  },
  { type: 'WAIT', duration: 1800 },
  { type: 'HIDE_DIFF' },

  // ==========================================
  // PHASE 5: RUN TESTS & DETECT ISSUE
  // ==========================================
  {
    type: 'SET_PHASE',
    phase: 'run_tests_fail',
    title: 'Phase 5: Run Automated Tests',
    subtitle: 'Executing Jest suite to verify behavioral equivalence',
  },
  {
    type: 'SET_AI_STATUS',
    status: 'Running test runner...',
    isBusy: true,
  },
  {
    type: 'SWITCH_TERMINAL_TAB',
    tab: 'TERMINAL',
  },
  {
    type: 'MOVE_CURSOR',
    targetId: 'terminal-input-prompt',
    label: 'Focus Terminal',
    duration: 800,
  },
  { type: 'CLICK', targetId: 'terminal-input-prompt' },
  { type: 'WAIT', duration: 500 },

  // Run pnpm test
  {
    type: 'TERMINAL_COMMAND',
    command: 'pnpm test src/modules/auth/auth.service.spec.ts',
    outputLines: [
      { text: '$ jest src/modules/auth/auth.service.spec.ts --colors', type: 'info', delay: 200 },
      { text: ' PASS  src/modules/auth/auth.controller.spec.ts', type: 'success', delay: 350 },
      { text: ' FAIL  src/modules/auth/auth.service.spec.ts (648ms)', type: 'error', delay: 400 },
      { text: '  AuthService (Unit & Integration)', type: 'output', delay: 150 },
      { text: '    ✓ should validate valid user session token (18ms)', type: 'success', delay: 200 },
      { text: '    ✓ should allow ADMIN role in validateAdminSession (12ms)', type: 'success', delay: 200 },
      { text: '    ✕ should allow SUPERADMIN role in validateAdminSession with inherited privileges (29ms)', type: 'error', delay: 300 },
      { text: '', type: 'output', delay: 50 },
      { text: '  ● AuthService › should allow SUPERADMIN role in validateAdminSession with inherited privileges', type: 'error', delay: 100 },
      { text: '    ForbiddenException: Insufficient privileges: ADMIN role required', type: 'error', delay: 150 },
      { text: '      at SessionValidator.validateWithRole (session-validator.ts:46:13)', type: 'output', delay: 100 },
      { text: '      at AuthService.validateAdminSession (auth.service.ts:25:35)', type: 'output', delay: 100 },
      { text: '', type: 'output', delay: 50 },
      { text: 'Tests:       1 failed, 2 passed, 3 total', type: 'error', delay: 200 },
      { text: 'Snapshots:   0 total', type: 'output', delay: 50 },
      { text: 'Time:        1.42s', type: 'output', delay: 100 },
      { text: 'Ran all test suites matching /auth.service.spec.ts/.', type: 'output', delay: 100 },
    ],
  },
  { type: 'WAIT', duration: 1200 },

  {
    type: 'SET_STATUS_BAR',
    errorCount: 1,
    warningCount: 0,
    aiText: 'Agent: Test regression detected! Analyzing stack trace...',
  },
  {
    type: 'AI_MESSAGE',
    messageType: 'alert',
    title: 'Test Failure Detected',
    description: 'Test assertion failed: "should allow SUPERADMIN role in validateAdminSession with inherited privileges". Exact equality check (role !== requiredRole) rejected SUPERADMIN privileges.',
    file: 'session-validator.ts:46',
    badge: 'REGRESSION',
  },
  { type: 'WAIT', duration: 1200 },

  // ==========================================
  // PHASE 6: SELF-CORRECTION & BUILD
  // ==========================================
  {
    type: 'SET_PHASE',
    phase: 'fix_issue',
    title: 'Phase 6: Self-Correction & Verification',
    subtitle: 'Patching role inheritance edge-case and running full build',
  },
  {
    type: 'SET_AI_STATUS',
    status: 'Fixing role hierarchy in session-validator.ts...',
    isBusy: true,
  },
  {
    type: 'MOVE_CURSOR',
    targetId: 'tab-src/modules/auth/session-validator.ts',
    label: 'Return to session-validator.ts',
    duration: 700,
  },
  { type: 'CLICK', targetId: 'tab-src/modules/auth/session-validator.ts' },
  { type: 'OPEN_FILE', file: 'src/modules/auth/session-validator.ts' },
  { type: 'WAIT', duration: 600 },

  {
    type: 'MOVE_CURSOR',
    targetId: 'editor-line-44',
    label: 'Navigate to line 44',
    duration: 700,
  },
  { type: 'FOCUS_EDITOR_LINE', line: 44 },
  { type: 'SELECT_CODE', startLine: 42, endLine: 49 },
  { type: 'WAIT', duration: 900 },

  // Apply fix to session-validator.ts
  {
    type: 'UPDATE_FILE_CONTENT',
    file: 'src/modules/auth/session-validator.ts',
    content: EXTRACTED_SESSION_VALIDATOR_FIXED,
    gitStatus: 'untracked',
  },
  { type: 'CLEAR_SELECTION' },

  {
    type: 'AI_MESSAGE',
    messageType: 'success',
    title: 'Role Hierarchy Patched',
    description: 'Added privilege inheritance rule: `session.role === requiredRole || (requiredRole === UserRole.ADMIN && session.role === UserRole.SUPERADMIN)`.',
    file: 'session-validator.ts',
    badge: 'PATCH APPLIED',
  },
  { type: 'WAIT', duration: 900 },

  // Re-run tests in terminal
  {
    type: 'MOVE_CURSOR',
    targetId: 'terminal-input-prompt',
    label: 'Re-run Tests',
    duration: 700,
  },
  { type: 'CLICK', targetId: 'terminal-input-prompt' },

  {
    type: 'TERMINAL_COMMAND',
    command: 'pnpm test',
    outputLines: [
      { text: '$ jest --colors', type: 'info', delay: 180 },
      { text: ' PASS  src/modules/auth/session-validator.spec.ts (8 tests)', type: 'success', delay: 300 },
      { text: ' PASS  src/modules/auth/auth.service.spec.ts (14 tests)', type: 'success', delay: 320 },
      { text: ' PASS  src/modules/auth/auth.controller.spec.ts (9 tests)', type: 'success', delay: 280 },
      { text: '', type: 'output', delay: 50 },
      { text: 'Test Suites: 3 passed, 3 total', type: 'success', delay: 150 },
      { text: 'Tests:       31 passed, 31 total', type: 'success', delay: 150 },
      { text: 'Snapshots:   0 total', type: 'output', delay: 50 },
      { text: 'Time:        1.182s', type: 'output', delay: 100 },
      { text: 'Ran all test suites.', type: 'success', delay: 100 },
    ],
  },
  { type: 'WAIT', duration: 1100 },

  {
    type: 'SET_STATUS_BAR',
    errorCount: 0,
    warningCount: 0,
    aiText: 'Agent: All 31 tests passing! Running production bundle build...',
  },

  // Run pnpm build
  {
    type: 'TERMINAL_COMMAND',
    command: 'pnpm build',
    outputLines: [
      { text: '$ tsc && vite build', type: 'info', delay: 200 },
      { text: 'vite v5.0.10 building for production...', type: 'output', delay: 250 },
      { text: '✓ 48 modules transformed.', type: 'output', delay: 300 },
      { text: 'dist/index.html                   0.84 kB │ gzip:  0.42 kB', type: 'output', delay: 150 },
      { text: 'dist/assets/index-D8x2hA9z.css    4.12 kB │ gzip:  1.38 kB', type: 'output', delay: 150 },
      { text: 'dist/assets/index-Bx1L7v2k.js   142.18 kB │ gzip: 44.12 kB', type: 'output', delay: 180 },
      { text: '✓ built in 412ms', type: 'success', delay: 150 },
      { text: 'Zero TypeScript or bundle errors.', type: 'success', delay: 100 },
    ],
  },
  { type: 'WAIT', duration: 1000 },

  // Git Commit
  {
    type: 'TERMINAL_COMMAND',
    command: 'git add -A && git commit -m "refactor(auth): extract SessionValidator and unify role hierarchy"',
    outputLines: [
      { text: '[main a8c1f92] refactor(auth): extract SessionValidator and unify role hierarchy', type: 'output', delay: 200 },
      { text: ' 2 files changed, 82 insertions(+), 64 deletions(-)', type: 'success', delay: 150 },
      { text: ' create mode 100644 src/modules/auth/session-validator.ts', type: 'output', delay: 100 },
    ],
  },
  { type: 'WAIT', duration: 1000 },

  {
    type: 'SET_AI_STATUS',
    status: 'Autonomous workflow complete',
    isBusy: false,
  },
  {
    type: 'SET_STATUS_BAR',
    leftText: 'main (synced)',
    aiText: 'Agent: Task completed successfully (31/31 tests passing)',
    errorCount: 0,
    warningCount: 0,
  },
  {
    type: 'COMPLETE_DEMO',
    metrics: {
      refactoredFiles: 2,
      linesReduced: 48,
      testsPassing: 31,
      timeElapsed: '48.2s',
    },
  },
];
