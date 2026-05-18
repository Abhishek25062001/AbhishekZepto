import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DB_STATUS } from '../../../database/constants/db-status.constants';
import * as roleServiceModule from '../services/role.service';
import {
  createRoleController,
  deleteRoleController,
  getRoleByIdController,
  listRolesController,
  updateRoleController,
} from './role.controller';

const mutableRoleService = roleServiceModule as unknown as {
  listRoles: (...args: unknown[]) => Promise<unknown>;
  createRole: (...args: unknown[]) => Promise<unknown>;
  getRoleById: (...args: unknown[]) => Promise<unknown>;
  updateRole: (...args: unknown[]) => Promise<unknown>;
  deleteRole: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, string>;
  requestId?: string;
  traceId?: string;
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

const buildRole = (overrides: Record<string, unknown> = {}) => ({
  code: 'support_admin',
  name: 'Support Admin',
  description: null,
  permissions: ['users:read'],
  isSystemRole: false,
  isEditable: true,
  status: DB_STATUS.ACTIVE,
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

test('listRolesController returns paginated roles', async () => {
  const original = mutableRoleService.listRoles;
  mutableRoleService.listRoles = async () => ({
    items: [buildRole()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listRolesController, {
    query: {
      page: '1',
      limit: '20',
    },
    requestId: 'req-1',
    traceId: 'trace-1',
  });

  mutableRoleService.listRoles = original;

  assert.equal(response.statusCode, 200);
});

test('createRoleController returns created response', async () => {
  const original = mutableRoleService.createRole;
  mutableRoleService.createRole = async (input: unknown) =>
    buildRole(input as Record<string, unknown>);

  const response = await runController(createRoleController, {
    body: {
      code: 'support_admin',
      name: 'Support Admin',
      description: null,
      permissions: ['users:read'],
      isEditable: true,
    },
    requestId: 'req-2',
    traceId: 'trace-2',
  });

  mutableRoleService.createRole = original;

  assert.equal(response.statusCode, 201);
});

test('getRoleByIdController returns role by id', async () => {
  const original = mutableRoleService.getRoleById;
  mutableRoleService.getRoleById = async () => buildRole();

  const response = await runController(getRoleByIdController, {
    params: {
      roleId: '68295cf6d5cc8fddf6b8d201',
    },
    requestId: 'req-3',
    traceId: 'trace-3',
  });

  mutableRoleService.getRoleById = original;

  assert.equal(response.statusCode, 200);
});

test('updateRoleController returns updated role', async () => {
  const original = mutableRoleService.updateRole;
  mutableRoleService.updateRole = async (_roleId: unknown, input: unknown) =>
    buildRole(input as Record<string, unknown>);

  const response = await runController(updateRoleController, {
    params: {
      roleId: '68295cf6d5cc8fddf6b8d201',
    },
    body: {
      name: 'Updated Support Admin',
    },
    requestId: 'req-4',
    traceId: 'trace-4',
  });

  mutableRoleService.updateRole = original;

  assert.equal(response.statusCode, 200);
});

test('deleteRoleController returns deleted role payload', async () => {
  const original = mutableRoleService.deleteRole;
  mutableRoleService.deleteRole = async () =>
    buildRole({
      isDeleted: true,
      status: DB_STATUS.INACTIVE,
    });

  const response = await runController(deleteRoleController, {
    params: {
      roleId: '68295cf6d5cc8fddf6b8d201',
    },
    requestId: 'req-5',
    traceId: 'trace-5',
  });

  mutableRoleService.deleteRole = original;

  assert.equal(response.statusCode, 200);
});
