import assert from 'node:assert/strict';
import { test } from 'node:test';

import adminNotificationRoutes from '../routes/admin-notification.routes';
import customerNotificationRoutes from '../routes/customer-notification.routes';
import deliveryNotificationRoutes from '../routes/delivery-notification.routes';
import vendorNotificationRoutes from '../routes/vendor-notification.routes';
import {
  notificationIdParamsValidator,
  notificationListQueryValidator,
} from '../validators/in-app-notification.validator';

const listRoutes = (
  router: typeof customerNotificationRoutes,
): Array<{ path: string; methods: string[] }> => {
  const stack = (router as unknown as {
    stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }>;
  }).stack;

  return stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      methods: Object.keys(layer.route!.methods),
      path: layer.route!.path,
    }));
};

const expectedRoutes = [
  { methods: ['get'], path: '/' },
  { methods: ['get'], path: '/unread-count' },
  { methods: ['patch'], path: '/:notificationId/read' },
  { methods: ['patch'], path: '/read-all' },
];

test('notification routes expose list unread mark read and mark all endpoints', () => {
  assert.deepEqual(listRoutes(customerNotificationRoutes), expectedRoutes);
  assert.deepEqual(listRoutes(deliveryNotificationRoutes), expectedRoutes);
  assert.deepEqual(listRoutes(vendorNotificationRoutes), expectedRoutes);
  assert.deepEqual(listRoutes(adminNotificationRoutes), expectedRoutes);
});

test('notification list validator accepts documented filters', () => {
  assert.deepEqual(
    notificationListQueryValidator.parse({
      isRead: 'false',
      limit: '5',
      notificationType: 'order_update',
      page: '2',
    }),
    {
      isRead: false,
      limit: 5,
      notificationType: 'order_update',
      page: 2,
    },
  );
  assert.throws(() => notificationListQueryValidator.parse({ notificationType: 'invalid' }));
});

test('mark notification read validator requires notification id', () => {
  assert.throws(() => notificationIdParamsValidator.parse({}));
  assert.deepEqual(notificationIdParamsValidator.parse({ notificationId: 'notification-1' }), {
    notificationId: 'notification-1',
  });
});
