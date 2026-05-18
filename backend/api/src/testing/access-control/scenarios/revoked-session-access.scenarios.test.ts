import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { AUTH_ACCOUNT_STATUS } from '../../../modules/auth/constants/auth-status.constants';
import { authenticate } from '../../../modules/auth/middlewares/authenticate.middleware';
import * as authSessionRepositoryModule from '../../../modules/auth/repositories/auth-session.repository';
import * as roleRepositoryModule from '../../../modules/auth/repositories/role.repository';
import * as userIdentityRepositoryModule from '../../../modules/auth/repositories/user-identity.repository';
import { refreshAccessToken } from '../../../modules/auth/services/auth.service';
import * as sessionServiceModule from '../../../modules/auth/services/session.service';
import * as tokenServiceModule from '../../../modules/auth/services/token.service';
import type { AuthTokenPayload } from '../../../modules/auth/types/auth-token.types';
import {
  ACCESS_CONTROL_SESSION_STATE_FIXTURES,
  ACCESS_CONTROL_TEST_USERS,
  evaluateAccessControlAction,
  runAccessControlMiddleware,
} from '../index';

const sessionRepository = authSessionRepositoryModule as unknown as {
  findActiveSessionById: (sessionId: string) => Promise<Record<string, unknown> | null>;
};

const userIdentityRepository = userIdentityRepositoryModule as unknown as {
  findActiveUserIdentityById: (userId: string) => Promise<Record<string, unknown> | null>;
};

const roleRepository = roleRepositoryModule as unknown as {
  findRoleByCode: (roleCode: string) => Promise<Record<string, unknown> | null>;
};

const sessionService = sessionServiceModule as unknown as {
  findSessionByRefreshToken: (refreshToken: string) => Promise<Record<string, unknown> | null>;
  rotateSessionRefreshToken: (sessionId: string, refreshToken: string) => Promise<unknown>;
};

const tokenService = tokenServiceModule as unknown as {
  verifyAccessToken: (token: string) => AuthTokenPayload;
  verifyRefreshToken: (refreshToken: string) => AuthTokenPayload;
  generateAccessToken: (input: Record<string, unknown>) => string;
  generateRefreshToken: (input: Record<string, unknown>) => string;
};

const originals = {
  findActiveSessionById: sessionRepository.findActiveSessionById,
  findActiveUserIdentityById: userIdentityRepository.findActiveUserIdentityById,
  findRoleByCode: roleRepository.findRoleByCode,
  verifyAccessToken: tokenService.verifyAccessToken,
  verifyRefreshToken: tokenService.verifyRefreshToken,
  findSessionByRefreshToken: sessionService.findSessionByRefreshToken,
  rotateSessionRefreshToken: sessionService.rotateSessionRefreshToken,
};

afterEach(() => {
  sessionRepository.findActiveSessionById = originals.findActiveSessionById;
  userIdentityRepository.findActiveUserIdentityById = originals.findActiveUserIdentityById;
  roleRepository.findRoleByCode = originals.findRoleByCode;
  tokenService.verifyAccessToken = originals.verifyAccessToken;
  tokenService.verifyRefreshToken = originals.verifyRefreshToken;
  sessionService.findSessionByRefreshToken = originals.findSessionByRefreshToken;
  sessionService.rotateSessionRefreshToken = originals.rotateSessionRefreshToken;
});

test('refresh token flow rejects revoked sessions before rotation', async () => {
  const fixture = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPPORT_ADMIN];

  tokenService.verifyRefreshToken = () => ({
    userId: fixture.userId,
    role: fixture.role,
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.REVOKED_SESSION_ID,
    tokenType: 'refresh',
  });
  sessionService.findSessionByRefreshToken = async () => ({
    _id: new Types.ObjectId(ACCESS_CONTROL_SESSION_STATE_FIXTURES.REVOKED_SESSION_ID),
    role: fixture.role,
    isRevoked: true,
    expiresAt: new Date(Date.now() + 60_000),
  });

  const result = await evaluateAccessControlAction(async () => {
    await refreshAccessToken(
      { refreshToken: 'revoked-refresh-token' },
      {
        requestId: 'req-revoked',
        traceId: 'trace-revoked',
        ipAddress: '127.0.0.1',
        userAgent: 'access-control-test-agent',
      },
    );
  });

  assert.equal(result.allowed, false);
  assert.equal(result.errorCode, ERROR_CODES.SESSION_REVOKED);
});

test('authenticate middleware maps missing active session to SESSION_REVOKED', async () => {
  const fixture = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.STORE_MANAGER];

  const originalVerifyAccess = tokenService.verifyAccessToken;
  tokenService.verifyAccessToken = () => ({
    userId: fixture.userId,
    role: fixture.role,
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.REVOKED_SESSION_ID,
    tokenType: 'access',
  });

  sessionRepository.findActiveSessionById = async () => null;
  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: new Types.ObjectId(fixture.userId),
    role: fixture.role,
    permissions: fixture.permissions,
    accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
    vendorId: fixture.vendorId,
    storeId: fixture.storeId,
    cityId: fixture.cityId,
  });

  const result = await runAccessControlMiddleware(authenticate(), {
    headers: { authorization: 'Bearer revoked-access-token' },
  });

  tokenService.verifyAccessToken = originalVerifyAccess;

  assert.equal(result.allowed, false);
  assert.equal(result.errorCode, ERROR_CODES.SESSION_REVOKED);
});
