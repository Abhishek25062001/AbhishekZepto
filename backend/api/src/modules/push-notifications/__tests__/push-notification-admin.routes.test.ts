import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import adminPushNotificationRoutes from '../routes/push-notification-admin.routes';
import {
  pushLogIdParamsValidator,
  pushLogListQueryValidator,
} from '../validators/device-token.validator';

const listRoutes = (
  router: typeof adminPushNotificationRoutes,
): Array<{ path: string; methods: string[] }> => {
  const stack = (router as unknown as { stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }> })
    .stack;

  return stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      methods: Object.keys(layer.route!.methods),
      path: layer.route!.path,
    }));
};

test('admin push notification routes expose logs list and detail endpoints', () => {
  assert.deepEqual(listRoutes(adminPushNotificationRoutes), [
    { methods: ['get'], path: '/logs' },
    { methods: ['get'], path: '/logs/:logId' },
  ]);
});

test('push_notifications read permission code is available for admin logs', () => {
  assert.equal(
    createPermissionCode(
      AUTH_PERMISSION_RESOURCE.PUSH_NOTIFICATIONS,
      AUTH_PERMISSION_ACTION.READ,
    ),
    'push_notifications:read',
  );
});

test('admin push log validators accept documented filters', () => {
  assert.deepEqual(
    pushLogListQueryValidator.parse({
      limit: '10',
      notificationType: 'delivery.completed',
      page: '2',
      status: 'sent',
      userId: 'user-1',
    }),
    {
      limit: 10,
      notificationType: 'delivery.completed',
      page: 2,
      status: 'sent',
      userId: 'user-1',
    },
  );
  assert.throws(() => pushLogListQueryValidator.parse({ status: 'unknown' }));
  assert.deepEqual(pushLogIdParamsValidator.parse({ logId: 'log-1' }), { logId: 'log-1' });
});
