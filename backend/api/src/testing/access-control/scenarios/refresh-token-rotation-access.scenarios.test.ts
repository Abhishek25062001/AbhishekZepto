import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { AUTH_ACCOUNT_STATUS } from '../../../modules/auth/constants/auth-status.constants';
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
} from '../index';

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
  verifyRefreshToken: (refreshToken: string) => AuthTokenPayload;
  generateAccessToken: (input: Record<string, unknown>) => string;
  generateRefreshToken: (input: Record<string, unknown>) => string;
};

const originals = {
  findActiveUserIdentityById: userIdentityRepository.findActiveUserIdentityById,
  findRoleByCode: roleRepository.findRoleByCode,
  verifyRefreshToken: tokenService.verifyRefreshToken,
  findSessionByRefreshToken: sessionService.findSessionByRefreshToken,
  rotateSessionRefreshToken: sessionService.rotateSessionRefreshToken,
  generateAccessToken: tokenService.generateAccessToken,
  generateRefreshToken: tokenService.generateRefreshToken,
};

afterEach(() => {
  userIdentityRepository.findActiveUserIdentityById = originals.findActiveUserIdentityById;
  roleRepository.findRoleByCode = originals.findRoleByCode;
  tokenService.verifyRefreshToken = originals.verifyRefreshToken;
  sessionService.findSessionByRefreshToken = originals.findSessionByRefreshToken;
  sessionService.rotateSessionRefreshToken = originals.rotateSessionRefreshToken;
  tokenService.generateAccessToken = originals.generateAccessToken;
  tokenService.generateRefreshToken = originals.generateRefreshToken;
});

test('refresh token rotation returns replacement tokens for active sessions', async () => {
  const fixture = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN];
  let rotatedSessionId = '';
  let rotatedToken = '';

  tokenService.verifyRefreshToken = () => ({
    userId: fixture.userId,
    role: fixture.role,
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.OTHER_SESSION_ID,
    tokenType: 'refresh',
  });
  tokenService.generateAccessToken = () => 'rotated-access-token';
  tokenService.generateRefreshToken = () => 'rotated-refresh-token';
  sessionService.findSessionByRefreshToken = async () => ({
    _id: new Types.ObjectId(ACCESS_CONTROL_SESSION_STATE_FIXTURES.OTHER_SESSION_ID),
    role: fixture.role,
    isRevoked: false,
    expiresAt: new Date(Date.now() + 60_000),
  });
  sessionService.rotateSessionRefreshToken = async (sessionId, refreshToken) => {
    rotatedSessionId = sessionId;
    rotatedToken = refreshToken;
    return {};
  };
  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: new Types.ObjectId(fixture.userId),
    role: fixture.role,
    permissions: [],
    accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
    vendorId: null,
    storeId: null,
    cityId: null,
  });
  roleRepository.findRoleByCode = async () => ({
    permissions: fixture.permissions,
  });

  const result = await evaluateAccessControlAction(async () => {
    const response = await refreshAccessToken(
      { refreshToken: 'active-refresh-token' },
      {
        requestId: 'req-rotate',
        traceId: 'trace-rotate',
        ipAddress: '127.0.0.1',
        userAgent: 'access-control-test-agent',
      },
    );

    assert.equal(response.accessToken, 'rotated-access-token');
    assert.equal(response.refreshToken, 'rotated-refresh-token');
    assert.equal(rotatedSessionId, ACCESS_CONTROL_SESSION_STATE_FIXTURES.OTHER_SESSION_ID);
    assert.equal(rotatedToken, 'rotated-refresh-token');
  });

  assert.equal(result.allowed, true);
});
