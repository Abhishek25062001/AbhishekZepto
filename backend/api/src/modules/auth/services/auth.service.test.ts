import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ACCOUNT_STATUS } from '../constants/auth-status.constants';
import type { AuthTokenPayload } from '../types/auth-token.types';
import { refreshAccessToken } from './auth.service';
import * as roleRepositoryModule from '../repositories/role.repository';
import * as userIdentityRepositoryModule from '../repositories/user-identity.repository';
import * as sessionServiceModule from './session.service';
import * as tokenServiceModule from './token.service';

type UserIdentityRepositoryModule = {
  findActiveUserIdentityById: (userId: string) => Promise<Record<string, unknown> | null>;
};

type RoleRepositoryModule = {
  findRoleByCode: (roleCode: string) => Promise<Record<string, unknown> | null>;
};

type SessionServiceModule = {
  findSessionByRefreshToken: (refreshToken: string) => Promise<Record<string, unknown> | null>;
  rotateSessionRefreshToken: (sessionId: string, refreshToken: string) => Promise<unknown>;
};

type TokenServiceModule = {
  verifyRefreshToken: (refreshToken: string) => AuthTokenPayload;
  generateAccessToken: (input: Record<string, unknown>) => string;
  generateRefreshToken: (input: Record<string, unknown>) => string;
};

const userIdentityRepository =
  userIdentityRepositoryModule as unknown as UserIdentityRepositoryModule;
const roleRepository = roleRepositoryModule as unknown as RoleRepositoryModule;
const sessionService = sessionServiceModule as unknown as SessionServiceModule;
const tokenService = tokenServiceModule as unknown as TokenServiceModule;

const originalUserIdentityRepository: UserIdentityRepositoryModule = {
  findActiveUserIdentityById: userIdentityRepository.findActiveUserIdentityById,
};

const originalRoleRepository: RoleRepositoryModule = {
  findRoleByCode: roleRepository.findRoleByCode,
};

const originalSessionService: SessionServiceModule = {
  findSessionByRefreshToken: sessionService.findSessionByRefreshToken,
  rotateSessionRefreshToken: sessionService.rotateSessionRefreshToken,
};

const originalTokenService: TokenServiceModule = {
  verifyRefreshToken: tokenService.verifyRefreshToken,
  generateAccessToken: tokenService.generateAccessToken,
  generateRefreshToken: tokenService.generateRefreshToken,
};

const buildUserIdentity = () => ({
  _id: new Types.ObjectId('68295cf6d5cc8fddf6b8d200'),
  role: 'support_admin' as const,
  permissions: [],
  vendorId: null,
  storeId: null,
  cityId: null,
  accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
});

afterEach(() => {
  userIdentityRepository.findActiveUserIdentityById =
    originalUserIdentityRepository.findActiveUserIdentityById;
  roleRepository.findRoleByCode = originalRoleRepository.findRoleByCode;
  sessionService.findSessionByRefreshToken = originalSessionService.findSessionByRefreshToken;
  sessionService.rotateSessionRefreshToken = originalSessionService.rotateSessionRefreshToken;
  tokenService.verifyRefreshToken = originalTokenService.verifyRefreshToken;
  tokenService.generateAccessToken = originalTokenService.generateAccessToken;
  tokenService.generateRefreshToken = originalTokenService.generateRefreshToken;
});

test('refreshAccessToken rotates the refresh token and returns the replacement token', async () => {
  let rotatedSessionId = '';
  let rotatedToken = '';

  tokenService.verifyRefreshToken = () => ({
    userId: '68295cf6d5cc8fddf6b8d200',
    role: 'support_admin',
    sessionId: '68295cf6d5cc8fddf6b8d2ab',
    tokenType: 'refresh',
  });
  tokenService.generateAccessToken = () => 'new-access-token';
  tokenService.generateRefreshToken = () => 'new-refresh-token';
  sessionService.findSessionByRefreshToken = async () => ({
    _id: new Types.ObjectId('68295cf6d5cc8fddf6b8d2ab'),
    role: 'support_admin',
    isRevoked: false,
    expiresAt: new Date(Date.now() + 60_000),
  });
  sessionService.rotateSessionRefreshToken = async (sessionId, refreshToken) => {
    rotatedSessionId = sessionId;
    rotatedToken = refreshToken;
    return {};
  };
  userIdentityRepository.findActiveUserIdentityById = async () => buildUserIdentity();
  roleRepository.findRoleByCode = async () => ({
    permissions: ['users:read'],
  });

  const response = await refreshAccessToken(
    { refreshToken: 'old-refresh-token' },
    {
      requestId: 'req-1',
      traceId: 'trace-1',
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    },
  );

  assert.equal(response.accessToken, 'new-access-token');
  assert.equal(response.refreshToken, 'new-refresh-token');
  assert.equal(rotatedSessionId, '68295cf6d5cc8fddf6b8d2ab');
  assert.equal(rotatedToken, 'new-refresh-token');
});

test('refreshAccessToken rejects revoked sessions before rotation', async () => {
  tokenService.verifyRefreshToken = () => ({
    userId: '68295cf6d5cc8fddf6b8d200',
    role: 'support_admin',
    sessionId: '68295cf6d5cc8fddf6b8d2ab',
    tokenType: 'refresh',
  });
  sessionService.findSessionByRefreshToken = async () => ({
    _id: new Types.ObjectId('68295cf6d5cc8fddf6b8d2ab'),
    role: 'support_admin',
    isRevoked: true,
    expiresAt: new Date(Date.now() + 60_000),
  });

  await assert.rejects(
    () =>
      refreshAccessToken(
        { refreshToken: 'revoked-refresh-token' },
        {
          requestId: 'req-2',
          traceId: 'trace-2',
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent',
        },
      ),
    (error: unknown) =>
      error instanceof AppError && error.errorCode === ERROR_CODES.SESSION_REVOKED,
  );
});
