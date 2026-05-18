import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import {
  listAdminUserSessionsController,
  revokeAdminUserSessionController,
} from '../../../modules/auth/controllers/admin-session.controller';
import { hasAnyPermission } from '../../../modules/auth/services/permission.service';
import * as sessionServiceModule from '../../../modules/auth/services/session.service';
import {
  ACCESS_CONTROL_FIXTURE_PERMISSIONS,
  ACCESS_CONTROL_TEST_USERS,
  createMockAuthenticatedRequest,
  evaluateAccessControlController,
  runAccessControlMiddleware,
} from '../index';
import { requireAnyPermission } from '../../../modules/auth/middlewares/require-any-permission.middleware';

const sessionService = sessionServiceModule as unknown as {
  listAdminUserSessions: (...args: unknown[]) => Promise<unknown>;
  revokeAdminUserSession: (...args: unknown[]) => Promise<unknown>;
};

const sessionReadPermissions = [
  ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.AUTH_READ,
  ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ,
  ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.SETTINGS_MANAGE,
] as const;

const sessionRevokePermissions = [ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.AUTH_MANAGE] as const;

test('admin session list controller returns summaries for authorized admin', async () => {
  const original = sessionService.listAdminUserSessions;
  sessionService.listAdminUserSessions = async () => [
    {
      sessionId: 'session-1',
      isCurrent: true,
      isRevoked: false,
    },
  ];

  const result = await evaluateAccessControlController(
    listAdminUserSessionsController,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN], {
      params: { userId: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER].userId },
    }),
  );

  sessionService.listAdminUserSessions = original;

  assert.equal(result.allowed, true);
});

test('admin session revoke controller requires authenticated admin user', async () => {
  const result = await evaluateAccessControlController(revokeAdminUserSessionController, {
    params: {
      userId: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER].userId,
      sessionId: 'session-foreign',
    },
  });

  assert.equal(result.allowed, false);
  assert.equal(result.errorCode, ERROR_CODES.UNAUTHORIZED);
});

test('session route permission middleware mirrors admin list vs revoke boundaries', async () => {
  const listMiddleware = requireAnyPermission(sessionReadPermissions);
  const revokeMiddleware = requireAnyPermission(sessionRevokePermissions);

  const supportList = await runAccessControlMiddleware(
    listMiddleware,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPPORT_ADMIN]),
  );
  assert.equal(supportList.allowed, true);

  const supportRevoke = await runAccessControlMiddleware(
    revokeMiddleware,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPPORT_ADMIN]),
  );
  assert.equal(supportRevoke.allowed, false);

  assert.equal(
    hasAnyPermission({
      userPermissions: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN].permissions,
      requiredPermissions: sessionRevokePermissions,
    }),
    true,
  );
});
