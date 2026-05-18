import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { authenticate } from '../../../modules/auth/middlewares/authenticate.middleware';
import * as authSessionRepositoryModule from '../../../modules/auth/repositories/auth-session.repository';
import * as roleRepositoryModule from '../../../modules/auth/repositories/role.repository';
import * as userIdentityRepositoryModule from '../../../modules/auth/repositories/user-identity.repository';
import * as tokenServiceModule from '../../../modules/auth/services/token.service';
import type { AuthTokenPayload } from '../../../modules/auth/types/auth-token.types';
import {
  ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES,
  ACCESS_CONTROL_SESSION_STATE_FIXTURES,
  ACCESS_CONTROL_TEST_USERS,
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

const tokenService = tokenServiceModule as unknown as {
  verifyAccessToken: (token: string) => AuthTokenPayload;
};

const originals = {
  findActiveSessionById: sessionRepository.findActiveSessionById,
  findActiveUserIdentityById: userIdentityRepository.findActiveUserIdentityById,
  findRoleByCode: roleRepository.findRoleByCode,
  verifyAccessToken: tokenService.verifyAccessToken,
};

afterEach(() => {
  sessionRepository.findActiveSessionById = originals.findActiveSessionById;
  userIdentityRepository.findActiveUserIdentityById = originals.findActiveUserIdentityById;
  roleRepository.findRoleByCode = originals.findRoleByCode;
  tokenService.verifyAccessToken = originals.verifyAccessToken;
});

const runAuthenticateForStatus = async (accountStatus: string) => {
  const fixture = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER];
  const userObjectId = new Types.ObjectId(fixture.userId);
  const sessionObjectId = new Types.ObjectId(ACCESS_CONTROL_SESSION_STATE_FIXTURES.ACTIVE_SESSION_ID);

  tokenService.verifyAccessToken = () => ({
    userId: fixture.userId,
    role: fixture.role,
    sessionId: fixture.sessionId,
    permissions: fixture.permissions,
    tokenType: 'access',
  });

  sessionRepository.findActiveSessionById = async () => ({
    _id: sessionObjectId,
    userId: userObjectId,
    expiresAt: new Date(Date.now() + 60_000),
  });
  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: userObjectId,
    role: fixture.role,
    permissions: [],
    accountStatus,
    vendorId: null,
    storeId: null,
    cityId: null,
  });
  roleRepository.findRoleByCode = async () => ({ permissions: fixture.permissions });

  return runAccessControlMiddleware(authenticate(), {
    headers: { authorization: 'Bearer account-status-token' },
  });
};

test('authenticate denies blocked, inactive, and pending-approval accounts', async () => {
  const blocked = await runAuthenticateForStatus(ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES.BLOCKED);
  assert.equal(blocked.errorCode, ERROR_CODES.ACCOUNT_BLOCKED);

  const inactive = await runAuthenticateForStatus(ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES.INACTIVE);
  assert.equal(inactive.errorCode, ERROR_CODES.ACCOUNT_INACTIVE);

  const pending = await runAuthenticateForStatus(
    ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES.PENDING_APPROVAL,
  );
  assert.equal(pending.errorCode, ERROR_CODES.ACCOUNT_PENDING_APPROVAL);
});

test('authenticate allows active accounts', async () => {
  const active = await runAuthenticateForStatus(ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES.ACTIVE);
  assert.equal(active.allowed, true);
});

// Login-time account status enforcement on OTP verify routes requires live DB + OTP provider.
// Covered manually in docs/testing/access-control-backend-deny-path.md — NEEDS VERIFICATION.
