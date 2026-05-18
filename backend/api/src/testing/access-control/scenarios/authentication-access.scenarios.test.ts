import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { AUTH_ACCOUNT_STATUS } from '../../../modules/auth/constants/auth-status.constants';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { authenticate } from '../../../modules/auth/middlewares/authenticate.middleware';
import { requirePermission } from '../../../modules/auth/middlewares/require-permission.middleware';
import { requireRole } from '../../../modules/auth/middlewares/require-role.middleware';
import * as authSessionRepositoryModule from '../../../modules/auth/repositories/auth-session.repository';
import * as roleRepositoryModule from '../../../modules/auth/repositories/role.repository';
import * as userIdentityRepositoryModule from '../../../modules/auth/repositories/user-identity.repository';
import * as tokenServiceModule from '../../../modules/auth/services/token.service';
import {
  ACCESS_CONTROL_FIXTURE_PERMISSIONS,
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
  verifyAccessToken: (token: string) => Record<string, unknown>;
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

test('protected middleware rejects unauthenticated requests', async () => {
  const permissionDenied = await runAccessControlMiddleware(
    requirePermission(ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.AUTH_READ),
    {},
  );
  assert.equal(permissionDenied.allowed, false);
  assert.equal(permissionDenied.errorCode, ERROR_CODES.UNAUTHORIZED);

  const roleDenied = await runAccessControlMiddleware(requireRole([AUTH_ROLE.SUPER_ADMIN]), {});
  assert.equal(roleDenied.allowed, false);
  assert.equal(roleDenied.errorCode, ERROR_CODES.UNAUTHORIZED);
});

test('authenticate rejects missing, malformed, and empty bearer tokens', async () => {
  const missing = await runAccessControlMiddleware(authenticate(), {
    headers: {},
  });
  assert.equal(missing.errorCode, ERROR_CODES.UNAUTHORIZED);

  const malformed = await runAccessControlMiddleware(authenticate(), {
    headers: { authorization: 'Token abc' },
  });
  assert.equal(malformed.errorCode, ERROR_CODES.UNAUTHORIZED);

  const empty = await runAccessControlMiddleware(authenticate(), {
    headers: { authorization: 'Bearer ' },
  });
  assert.equal(empty.errorCode, ERROR_CODES.UNAUTHORIZED);
});

test('authenticate allows active session and sets req.user', async () => {
  const fixture = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN];
  const userObjectId = new Types.ObjectId(fixture.userId);
  const sessionObjectId = new Types.ObjectId(fixture.sessionId);

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
    accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
    vendorId: null,
    storeId: null,
    cityId: null,
  });
  roleRepository.findRoleByCode = async () => ({
    permissions: fixture.permissions,
  });

  const request: Parameters<typeof runAccessControlMiddleware>[1] = {
    headers: { authorization: 'Bearer valid-access-token' },
  };

  const result = await runAccessControlMiddleware(authenticate(), request);
  assert.equal(result.allowed, true);
  assert.equal(request.user?.role, AUTH_ROLE.OPERATIONS_ADMIN);
});

test('authenticate rejects revoked and expired sessions', async () => {
  const fixture = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER];
  const userObjectId = new Types.ObjectId(fixture.userId);

  tokenService.verifyAccessToken = () => ({
    userId: fixture.userId,
    role: fixture.role,
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.REVOKED_SESSION_ID,
    permissions: [],
    tokenType: 'access',
  });

  sessionRepository.findActiveSessionById = async () => null;
  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: userObjectId,
    role: fixture.role,
    permissions: [],
    accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
    vendorId: null,
    storeId: null,
    cityId: null,
  });

  const revoked = await runAccessControlMiddleware(authenticate(), {
    headers: { authorization: 'Bearer revoked-token' },
  });
  assert.equal(revoked.errorCode, ERROR_CODES.SESSION_REVOKED);
  assert.equal(revoked.statusCode, HTTP_STATUS.UNAUTHORIZED);

  sessionRepository.findActiveSessionById = async () => ({
    _id: new Types.ObjectId(fixture.sessionId),
    userId: userObjectId,
    expiresAt: new Date(Date.now() - 60_000),
  });

  const expired = await runAccessControlMiddleware(authenticate(), {
    headers: { authorization: 'Bearer expired-token' },
  });
  assert.equal(expired.errorCode, ERROR_CODES.SESSION_EXPIRED);
});

// OTP request/verify and full login-route HTTP flows require a live MongoDB-backed server.
// See docs/testing/access-control-backend-happy-path.md — marked NEEDS VERIFICATION in review docs.
