import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DB_STATUS } from '../../../database/constants/db-status.constants';
import { AUTH_ACCOUNT_STATUS } from '../constants/auth-status.constants';
import { AUTH_ROLE } from '../constants/auth-role.constants';
import * as userPermissionServiceModule from '../services/user-permission.service';
import {
  assignUserRoleController,
  syncUserRolePermissionsController,
  updateUserPermissionsController,
} from './user-permission.controller';

const mutableUserPermissionService = userPermissionServiceModule as unknown as {
  updateUserPermissions: (...args: unknown[]) => Promise<unknown>;
  assignUserRole: (...args: unknown[]) => Promise<unknown>;
  syncUserPermissionsFromRole: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  requestId?: string;
  traceId?: string;
  user?: {
    userId: string;
  };
};

type MockResponse = {
  body?: unknown;
  statusCode?: number;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

const createMockResponse = (
  onJson: (payload: unknown, statusCode: number) => void,
): MockResponse => {
  const response: MockResponse = {
    body: undefined,
    statusCode: undefined,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      response.body = payload;
      onJson(payload, response.statusCode ?? 200);
      return response;
    },
  };

  return response;
};

const runController = async (
  controller: unknown,
  req: MockRequest,
) => {
  return new Promise<{ body: unknown; statusCode: number }>((resolve, reject) => {
    const res = createMockResponse((body, statusCode) => {
      resolve({
        body,
        statusCode,
      });
    });

    (controller as (req: MockRequest, res: MockResponse, next: (error?: unknown) => void) => void)(
      req,
      res,
      (error?: unknown) => {
      if (error) {
        reject(error);
      }
      },
    );
  });
};

const buildUserIdentity = (overrides: Record<string, unknown> = {}) => ({
  phone: '9999999999',
  email: null,
  name: 'Admin User',
  role: AUTH_ROLE.SUPPORT_ADMIN,
  accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
  permissions: ['users:read'],
  vendorId: null,
  storeId: null,
  cityId: null,
  lastLoginAt: null,
  createdBy: null,
  updatedBy: null,
  status: DB_STATUS.ACTIVE,
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

test('updateUserPermissionsController returns updated user', async () => {
  const original = mutableUserPermissionService.updateUserPermissions;
  mutableUserPermissionService.updateUserPermissions = async () =>
    buildUserIdentity({
      permissions: ['users:read', 'settings:read'],
    });

  const response = await runController(updateUserPermissionsController, {
    params: {
      userId: '68295cf6d5cc8fddf6b8d201',
    },
    body: {
      permissions: ['users:read', 'settings:read'],
    },
    user: {
      userId: '68295cf6d5cc8fddf6b8d202',
    },
    requestId: 'req-6',
    traceId: 'trace-6',
  });

  mutableUserPermissionService.updateUserPermissions = original;

  assert.equal(response.statusCode, 200);
});

test('assignUserRoleController returns updated user role', async () => {
  const original = mutableUserPermissionService.assignUserRole;
  mutableUserPermissionService.assignUserRole = async () =>
    buildUserIdentity({
      role: AUTH_ROLE.OPERATIONS_ADMIN,
    });

  const response = await runController(assignUserRoleController, {
    params: {
      userId: '68295cf6d5cc8fddf6b8d201',
    },
    body: {
      role: AUTH_ROLE.OPERATIONS_ADMIN,
    },
    user: {
      userId: '68295cf6d5cc8fddf6b8d202',
    },
    requestId: 'req-7',
    traceId: 'trace-7',
  });

  mutableUserPermissionService.assignUserRole = original;

  assert.equal(response.statusCode, 200);
});

test('syncUserRolePermissionsController returns synced user permissions', async () => {
  const original = mutableUserPermissionService.syncUserPermissionsFromRole;
  mutableUserPermissionService.syncUserPermissionsFromRole = async () =>
    buildUserIdentity({
      permissions: ['orders:read', 'inventory:update'],
    });

  const response = await runController(syncUserRolePermissionsController, {
    params: {
      userId: '68295cf6d5cc8fddf6b8d201',
    },
    body: {
      roleCode: AUTH_ROLE.OPERATIONS_ADMIN,
    },
    user: {
      userId: '68295cf6d5cc8fddf6b8d202',
    },
    requestId: 'req-8',
    traceId: 'trace-8',
  });

  mutableUserPermissionService.syncUserPermissionsFromRole = original;

  assert.equal(response.statusCode, 200);
});
