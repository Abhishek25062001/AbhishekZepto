import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import {
  listAdminUserSessionsController,
  revokeAllAdminUserSessionsController,
  revokeAdminUserSessionController,
} from '../../../modules/auth/controllers/admin-session.controller';
import { hasAnyPermission } from '../../../modules/auth/services/permission.service';
import * as sessionServiceModule from '../../../modules/auth/services/session.service';
import {
  ACCESS_CONTROL_FIXTURE_PERMISSIONS,
  ACCESS_CONTROL_TEST_USERS,
  createMockAuthenticatedRequest,
  evaluateAccessControlController,
} from '../index';

const sessionService = sessionServiceModule as unknown as {
  listAdminUserSessions: (...args: unknown[]) => Promise<unknown>;
  revokeAdminUserSession: (...args: unknown[]) => Promise<unknown>;
  revokeAllAdminUserSessions: (...args: unknown[]) => Promise<unknown>;
};

const sessionReadPermissions = [
  ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.AUTH_READ,
  ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ,
  ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.SETTINGS_MANAGE,
] as const;

const sessionRevokePermissions = [ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.AUTH_MANAGE] as const;

test('support admin can list sessions but cannot satisfy revoke permission boundary', () => {
  const supportPermissions = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPPORT_ADMIN].permissions;

  assert.equal(
    hasAnyPermission({
      userPermissions: supportPermissions,
      requiredPermissions: sessionReadPermissions,
    }),
    true,
  );
  assert.equal(
    hasAnyPermission({
      userPermissions: supportPermissions,
      requiredPermissions: sessionRevokePermissions,
    }),
    false,
  );
});

test('operations admin can list and revoke sessions through controllers', async () => {
  const targetUserId = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER].userId;
  const sessionId = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER].sessionId;

  const originalList = sessionService.listAdminUserSessions;
  const originalRevoke = sessionService.revokeAdminUserSession;
  const originalRevokeAll = sessionService.revokeAllAdminUserSessions;

  sessionService.listAdminUserSessions = async () => [{ sessionId, isCurrent: false }];
  sessionService.revokeAdminUserSession = async () => ({
    sessionId,
    alreadyRevoked: false,
  });
  sessionService.revokeAllAdminUserSessions = async () => ({ revokedCount: 2 });

  const adminRequest = createMockAuthenticatedRequest(
    ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN],
    {
      params: { userId: targetUserId, sessionId },
    },
  );

  const listResult = await evaluateAccessControlController(
    listAdminUserSessionsController,
    adminRequest,
  );
  assert.equal(listResult.allowed, true);

  const revokeResult = await evaluateAccessControlController(
    revokeAdminUserSessionController,
    adminRequest,
  );
  assert.equal(revokeResult.allowed, true);

  const revokeAllResult = await evaluateAccessControlController(
    revokeAllAdminUserSessionsController,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN], {
      params: { userId: targetUserId },
    }),
  );
  assert.equal(revokeAllResult.allowed, true);

  sessionService.listAdminUserSessions = originalList;
  sessionService.revokeAdminUserSession = originalRevoke;
  sessionService.revokeAllAdminUserSessions = originalRevokeAll;
});

test('super admin wildcard satisfies revoke permission checks', () => {
  assert.equal(
    hasAnyPermission({
      userPermissions: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPER_ADMIN].permissions,
      requiredPermissions: sessionRevokePermissions,
    }),
    true,
  );
});

test('unauthenticated admin session revoke is denied before service access', async () => {
  const result = await evaluateAccessControlController(revokeAdminUserSessionController, {
    params: {
      userId: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER].userId,
      sessionId: 'session-1',
    },
  });

  assert.equal(result.allowed, false);
  assert.equal(result.errorCode, ERROR_CODES.UNAUTHORIZED);
});
