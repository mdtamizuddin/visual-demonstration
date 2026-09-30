import { ProjectFile } from '@/engine/demo-types';

export const INITIAL_FILES: Record<string, ProjectFile> = {
  'src/modules/auth/auth.service.ts': {
    path: 'src/modules/auth/auth.service.ts',
    name: 'auth.service.ts',
    language: 'typescript',
    gitStatus: 'clean',
    content: `import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@/lib/jwt';
import { RedisService } from '@/lib/redis';
import { AuthUser, SessionPayload, UserRole } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Validate a generic bearer session token
   * Checks expiration, signature verification, and redis revocation
   */
  async validateSession(rawBearerToken: string): Promise<SessionPayload> {
    if (!rawBearerToken || !rawBearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    const token = rawBearerToken.slice(7).trim();
    const isRevoked = await this.redis.get(\`revoked_token:\${token}\`);
    if (isRevoked) {
      throw new UnauthorizedException('Session token has been explicitly revoked');
    }

    let payload: SessionPayload;
    try {
      payload = await this.jwtService.verifyAsync<SessionPayload>(token);
    } catch {
      throw new UnauthorizedException('Token signature validation failed or expired');
    }

    if (!payload.userId || !payload.sessionId) {
      throw new UnauthorizedException('Invalid session payload structure');
    }

    return payload;
  }

  /**
   * Validate an admin session token
   * Duplicates basic session token validation with added role checking
   */
  async validateAdminSession(rawBearerToken: string): Promise<SessionPayload> {
    if (!rawBearerToken || !rawBearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    const token = rawBearerToken.slice(7).trim();
    const isRevoked = await this.redis.get(\`revoked_token:\${token}\`);
    if (isRevoked) {
      throw new UnauthorizedException('Session token has been explicitly revoked');
    }

    let payload: SessionPayload;
    try {
      payload = await this.jwtService.verifyAsync<SessionPayload>(token);
    } catch {
      throw new UnauthorizedException('Token signature validation failed or expired');
    }

    if (!payload.userId || !payload.sessionId) {
      throw new UnauthorizedException('Invalid session payload structure');
    }

    // Role check duplication
    if (payload.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Insufficient privileges: Admin role required');
    }

    return payload;
  }

  /**
   * Validate session for a specific target user ID
   * Duplicates token verification and checks subject match
   */
  async validateUserSession(rawBearerToken: string, targetUserId: string): Promise<SessionPayload> {
    if (!rawBearerToken || !rawBearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    const token = rawBearerToken.slice(7).trim();
    const isRevoked = await this.redis.get(\`revoked_token:\${token}\`);
    if (isRevoked) {
      throw new UnauthorizedException('Session token has been explicitly revoked');
    }

    let payload: SessionPayload;
    try {
      payload = await this.jwtService.verifyAsync<SessionPayload>(token);
    } catch {
      throw new UnauthorizedException('Token signature validation failed or expired');
    }

    if (!payload.userId || !payload.sessionId) {
      throw new UnauthorizedException('Invalid session payload structure');
    }

    if (payload.userId !== targetUserId && payload.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied: Cannot access resource of another user');
    }

    return payload;
  }
}
`,
  },

  'src/modules/auth/auth.controller.ts': {
    path: 'src/modules/auth/auth.controller.ts',
    name: 'auth.controller.ts',
    language: 'typescript',
    gitStatus: 'clean',
    content: `import { Controller, Get, Post, Headers, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionPayload } from './auth.types';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('session/me')
  async getCurrentSession(
    @Headers('authorization') authHeader: string,
  ): Promise<SessionPayload> {
    return this.authService.validateSession(authHeader);
  }

  @Get('admin/metrics')
  async getAdminDashboard(
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; timestamp: number }> {
    await this.authService.validateAdminSession(authHeader);
    return { status: 'healthy', timestamp: Date.now() };
  }

  @Get('user/:id/profile')
  async getUserProfile(
    @Headers('authorization') authHeader: string,
    @Param('id') userId: string,
  ): Promise<SessionPayload> {
    return this.authService.validateUserSession(authHeader, userId);
  }
}
`,
  },

  'src/modules/auth/auth.types.ts': {
    path: 'src/modules/auth/auth.types.ts',
    name: 'auth.types.ts',
    language: 'typescript',
    gitStatus: 'clean',
    content: `export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export interface SessionPayload {
  userId: string;
  sessionId: string;
  role: UserRole;
  email: string;
  issuedAt: number;
  expiresAt: number;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  twoFactorEnabled: boolean;
}

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
}
`,
  },

  'src/modules/auth/auth.service.spec.ts': {
    path: 'src/modules/auth/auth.service.spec.ts',
    name: 'auth.service.spec.ts',
    language: 'typescript',
    gitStatus: 'clean',
    content: `import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@/lib/jwt';
import { RedisService } from '@/lib/redis';
import { UserRole } from './auth.types';

describe('AuthService (Unit & Integration)', () => {
  let service: AuthService;
  let jwtMock: Partial<JwtService>;
  let redisMock: Partial<RedisService>;

  beforeEach(async () => {
    jwtMock = {
      verifyAsync: jest.fn().mockImplementation(async (token: string) => {
        if (token === 'valid_admin_token') {
          return { userId: 'usr_admin', sessionId: 'sess_1', role: UserRole.ADMIN };
        }
        if (token === 'valid_superadmin_token') {
          return { userId: 'usr_super', sessionId: 'sess_2', role: UserRole.SUPERADMIN };
        }
        if (token === 'valid_user_token') {
          return { userId: 'usr_alice', sessionId: 'sess_3', role: UserRole.USER };
        }
        throw new Error('Invalid token');
      }),
    };

    redisMock = {
      get: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate valid user session token', async () => {
    const res = await service.validateSession('Bearer valid_user_token');
    expect(res.userId).toBe('usr_alice');
  });

  it('should allow ADMIN role in validateAdminSession', async () => {
    const res = await service.validateAdminSession('Bearer valid_admin_token');
    expect(res.role).toBe(UserRole.ADMIN);
  });

  it('should allow SUPERADMIN role in validateAdminSession with inherited privileges', async () => {
    const res = await service.validateAdminSession('Bearer valid_superadmin_token');
    expect(res.role).toBe(UserRole.SUPERADMIN);
  });
});
`,
  },

  'package.json': {
    path: 'package.json',
    name: 'package.json',
    language: 'json',
    gitStatus: 'clean',
    content: `{
  "name": "nova-dashboard",
  "version": "2.4.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "jest --passWithNoTests",
    "lint": "eslint src/ --ext .ts"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "ioredis": "^5.3.2",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/jest": "^29.5.11",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.10"
  }
}
`,
  },

  'README.md': {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    gitStatus: 'clean',
    content: `# Nova Dashboard Backend

Autonomous microservice for cloud cluster orchestration and enterprise IAM.

## Architecture

- **Framework**: NestJS & Fastify
- **Cache**: Redis 7.2 Cluster
- **Authentication**: JWT RS256 with distributed session revocation list
- **Testing**: Jest unit + E2E integration suites
`,
  },
};

// Content for newly created session-validator.ts before edge case fix
export const EXTRACTED_SESSION_VALIDATOR_V1 = `import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@/lib/jwt';
import { RedisService } from '@/lib/redis';
import { SessionPayload, UserRole } from './auth.types';

@Injectable()
export class SessionValidator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Core token extraction and cryptographic signature validation
   */
  async validate(rawBearerToken: string): Promise<SessionPayload> {
    if (!rawBearerToken || !rawBearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    const token = rawBearerToken.slice(7).trim();
    const isRevoked = await this.redis.get(\`revoked_token:\${token}\`);
    if (isRevoked) {
      throw new UnauthorizedException('Session token has been explicitly revoked');
    }

    try {
      const payload = await this.jwtService.verifyAsync<SessionPayload>(token);
      if (!payload.userId || !payload.sessionId) {
        throw new UnauthorizedException('Invalid session payload structure');
      }
      return payload;
    } catch {
      throw new UnauthorizedException('Token signature validation failed or expired');
    }
  }

  /**
   * Validate session with role boundary enforcement
   */
  async validateWithRole(rawBearerToken: string, requiredRole: UserRole): Promise<SessionPayload> {
    const session = await this.validate(rawBearerToken);

    // Initial check: exact equality
    if (session.role !== requiredRole) {
      throw new ForbiddenException(\`Insufficient privileges: \${requiredRole} role required\`);
    }

    return session;
  }

  /**
   * Validate session with user ownership or admin override
   */
  async validateOwnership(rawBearerToken: string, targetUserId: string): Promise<SessionPayload> {
    const session = await this.validate(rawBearerToken);

    if (session.userId !== targetUserId && session.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied: Cannot access resource of another user');
    }

    return session;
  }
}
`;

// Fixed version of session-validator.ts with superadmin hierarchy
export const EXTRACTED_SESSION_VALIDATOR_FIXED = `import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@/lib/jwt';
import { RedisService } from '@/lib/redis';
import { SessionPayload, UserRole } from './auth.types';

@Injectable()
export class SessionValidator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Core token extraction and cryptographic signature validation
   */
  async validate(rawBearerToken: string): Promise<SessionPayload> {
    if (!rawBearerToken || !rawBearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    const token = rawBearerToken.slice(7).trim();
    const isRevoked = await this.redis.get(\`revoked_token:\${token}\`);
    if (isRevoked) {
      throw new UnauthorizedException('Session token has been explicitly revoked');
    }

    try {
      const payload = await this.jwtService.verifyAsync<SessionPayload>(token);
      if (!payload.userId || !payload.sessionId) {
        throw new UnauthorizedException('Invalid session payload structure');
      }
      return payload;
    } catch {
      throw new UnauthorizedException('Token signature validation failed or expired');
    }
  }

  /**
   * Validate session with role boundary enforcement and hierarchy inheritance
   */
  async validateWithRole(rawBearerToken: string, requiredRole: UserRole): Promise<SessionPayload> {
    const session = await this.validate(rawBearerToken);

    // Support role hierarchy: SUPERADMIN inherits ADMIN privileges
    const hasPermission =
      session.role === requiredRole ||
      (requiredRole === UserRole.ADMIN && session.role === UserRole.SUPERADMIN);

    if (!hasPermission) {
      throw new ForbiddenException(\`Insufficient privileges: \${requiredRole} or higher role required\`);
    }

    return session;
  }

  /**
   * Validate session with user ownership or admin override
   */
  async validateOwnership(rawBearerToken: string, targetUserId: string): Promise<SessionPayload> {
    const session = await this.validate(rawBearerToken);

    const isAuthorized =
      session.userId === targetUserId ||
      session.role === UserRole.ADMIN ||
      session.role === UserRole.SUPERADMIN;

    if (!isAuthorized) {
      throw new ForbiddenException('Access denied: Cannot access resource of another user');
    }

    return session;
  }
}
`;

// Refactored auth.service.ts cleanly delegating to SessionValidator
export const REFACTORED_AUTH_SERVICE = `import { Injectable } from '@nestjs/common';
import { SessionValidator } from './session-validator';
import { SessionPayload, UserRole } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionValidator: SessionValidator,
  ) {}

  /**
   * Validate a generic bearer session token
   * Delegated to dedicated SessionValidator service
   */
  async validateSession(rawBearerToken: string): Promise<SessionPayload> {
    return this.sessionValidator.validate(rawBearerToken);
  }

  /**
   * Validate an admin session token
   * Enforces role requirements with full hierarchy support
   */
  async validateAdminSession(rawBearerToken: string): Promise<SessionPayload> {
    return this.sessionValidator.validateWithRole(rawBearerToken, UserRole.ADMIN);
  }

  /**
   * Validate session for a specific target user ID
   * Enforces resource ownership with admin bypass
   */
  async validateUserSession(rawBearerToken: string, targetUserId: string): Promise<SessionPayload> {
    return this.sessionValidator.validateOwnership(rawBearerToken, targetUserId);
  }
}
`;

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  isFolder: boolean;
  children?: FileTreeNode[];
  gitStatus?: 'clean' | 'modified' | 'untracked';
}

export const INITIAL_FILE_TREE: FileTreeNode[] = [
  {
    id: 'src',
    name: 'src',
    path: 'src',
    isFolder: true,
    children: [
      {
        id: 'src/modules',
        name: 'modules',
        path: 'src/modules',
        isFolder: true,
        children: [
          {
            id: 'src/modules/auth',
            name: 'auth',
            path: 'src/modules/auth',
            isFolder: true,
            children: [
              { id: 'src/modules/auth/auth.service.ts', name: 'auth.service.ts', path: 'src/modules/auth/auth.service.ts', isFolder: false, gitStatus: 'clean' },
              { id: 'src/modules/auth/auth.controller.ts', name: 'auth.controller.ts', path: 'src/modules/auth/auth.controller.ts', isFolder: false, gitStatus: 'clean' },
              { id: 'src/modules/auth/auth.types.ts', name: 'auth.types.ts', path: 'src/modules/auth/auth.types.ts', isFolder: false, gitStatus: 'clean' },
              { id: 'src/modules/auth/auth.service.spec.ts', name: 'auth.service.spec.ts', path: 'src/modules/auth/auth.service.spec.ts', isFolder: false, gitStatus: 'clean' },
            ],
          },
          {
            id: 'src/modules/users',
            name: 'users',
            path: 'src/modules/users',
            isFolder: true,
            children: [
              { id: 'src/modules/users/user.service.ts', name: 'user.service.ts', path: 'src/modules/users/user.service.ts', isFolder: false, gitStatus: 'clean' },
            ],
          },
          {
            id: 'src/modules/dashboard',
            name: 'dashboard',
            path: 'src/modules/dashboard',
            isFolder: true,
            children: [
              { id: 'src/modules/dashboard/metrics.service.ts', name: 'metrics.service.ts', path: 'src/modules/dashboard/metrics.service.ts', isFolder: false, gitStatus: 'clean' },
            ],
          },
        ],
      },
      {
        id: 'src/lib',
        name: 'lib',
        path: 'src/lib',
        isFolder: true,
        children: [
          { id: 'src/lib/jwt.ts', name: 'jwt.ts', path: 'src/lib/jwt.ts', isFolder: false, gitStatus: 'clean' },
          { id: 'src/lib/redis.ts', name: 'redis.ts', path: 'src/lib/redis.ts', isFolder: false, gitStatus: 'clean' },
        ],
      },
    ],
  },
  {
    id: 'package.json',
    name: 'package.json',
    path: 'package.json',
    isFolder: false,
    gitStatus: 'clean',
  },
  {
    id: 'README.md',
    name: 'README.md',
    path: 'README.md',
    isFolder: false,
    gitStatus: 'clean',
  },
];
