import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../constants/auth-permission.constants';
import { createPermissionCode } from '../utils/permission-code.util';
import { hasAnyPermission } from '../services/permission.service';
import userSessionAdminRoutes from './user-session-admin.routes';

type RouterLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
};

const sessionReadPermissions = [
  createPermissionCode(AUTH_PERMISSION_RESOURCE.AUTH, AUTH_PERMISSION_ACTION.READ),
  createPermissionCode(AUTH_PERMISSION_RESOURCE.USERS, AUTH_PERMISSION_ACTION.READ),
  createPermissionCode(AUTH_PERMISSION_RESOURCE.SETTINGS, AUTH_PERMISSION_ACTION.MANAGE),
] as const;

const sessionRevokePermissions = [
  createPermissionCode(AUTH_PERMISSION_RESOURCE.AUTH, AUTH_PERMISSION_ACTION.MANAGE),
] as const;

const supportAdminPermissions = [
  createPermissionCode(AUTH_PERMISSION_RESOURCE.AUTH, AUTH_PERMISSION_ACTION.READ),
  createPermissionCode(AUTH_PERMISSION_RESOURCE.USERS, AUTH_PERMISSION_ACTION.READ),
  createPermissionCode(AUTH_PERMISSION_RESOURCE.SETTINGS, AUTH_PERMISSION_ACTION.READ),
] as const;

const operationsAdminPermissions = [
  ...supportAdminPermissions,
  createPermissionCode(AUTH_PERMISSION_RESOURCE.AUTH, AUTH_PERMISSION_ACTION.MANAGE),
  createPermissionCode(AUTH_PERMISSION_RESOURCE.SETTINGS, AUTH_PERMISSION_ACTION.MANAGE),
] as const;

test('user session admin routes expose list and revoke endpoints', () => {
  const stack = (userSessionAdminRoutes as unknown as { stack: RouterLayer[] }).stack;
  const routes = stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route?.path ?? '',
      methods: Object.keys(layer.route?.methods ?? {}).sort(),
    }));

  assert.deepEqual(routes, [
    {
      path: '/:userId/sessions',
      methods: ['get'],
    },
    {
      path: '/:userId/sessions/:sessionId',
      methods: ['delete'],
    },
    {
      path: '/:userId/sessions',
      methods: ['delete'],
    },
  ]);
});

test('support admin can list sessions but cannot revoke without auth:manage', () => {
  assert.equal(
    hasAnyPermission({
      userPermissions: [...supportAdminPermissions],
      requiredPermissions: sessionReadPermissions,
    }),
    true,
  );
  assert.equal(
    hasAnyPermission({
      userPermissions: [...supportAdminPermissions],
      requiredPermissions: sessionRevokePermissions,
    }),
    false,
  );
});

test('operations admin can revoke sessions with auth:manage', () => {
  assert.equal(
    hasAnyPermission({
      userPermissions: [...operationsAdminPermissions],
      requiredPermissions: sessionRevokePermissions,
    }),
    true,
  );
});
