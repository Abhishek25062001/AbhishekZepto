import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  adminOrderStatusUpdateBodyValidator,
  cancelOrderBodyValidator,
  listAdminOrdersQueryValidator,
} from '../validators/order.validators';
import adminOrderRoutes from './admin-order.routes';

const listRoutes = (
  router: typeof adminOrderRoutes,
): Array<{ path: string; methods: string[]; handlers: number }> => {
  const stack = (router as unknown as {
    stack: Array<{
      route?: {
        path: string;
        methods: Record<string, boolean>;
        stack: unknown[];
      };
    }>;
  }).stack;

  return stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route!.path,
      methods: Object.keys(layer.route!.methods),
      handlers: layer.route!.stack.length,
    }));
};

test('admin order routes expose cancellation endpoint with middleware chain', () => {
  const routes = listRoutes(adminOrderRoutes);

  assert.deepEqual(routes, [
    { path: '/', methods: ['get'], handlers: 3 },
    { path: '/:orderId/timeline', methods: ['get'], handlers: 3 },
    { path: '/:orderId', methods: ['get'], handlers: 3 },
    { path: '/:orderId/status', methods: ['post'], handlers: 3 },
    { path: '/:orderId/cancel', methods: ['post'], handlers: 3 },
  ]);
});

test('orders cancel permission code is available for admin cancellation route', () => {
  assert.equal(
    createPermissionCode(
      AUTH_PERMISSION_RESOURCE.ORDERS,
      AUTH_PERMISSION_ACTION.CANCEL,
    ),
    'orders:cancel',
  );
});

test('orders update-status permission code is available for admin status route', () => {
  assert.equal(
    createPermissionCode(
      AUTH_PERMISSION_RESOURCE.ORDERS,
      AUTH_PERMISSION_ACTION.UPDATE_STATUS,
    ),
    'orders:update-status',
  );
});

test('admin cancellation body validator requires a reason', () => {
  assert.throws(() => cancelOrderBodyValidator.parse({}));
  assert.throws(() => cancelOrderBodyValidator.parse({ reason: '   ' }));
  assert.deepEqual(cancelOrderBodyValidator.parse({ reason: 'Admin support cancellation' }), {
    reason: 'Admin support cancellation',
  });
});

test('admin order list query validator accepts documented filters', () => {
  const query = listAdminOrdersQueryValidator.parse({
    status: 'accepted',
    storeStatus: 'accepted',
    paymentStatus: 'paid',
    storeId: '507f1f77bcf86cd799439011',
    cityId: '507f1f77bcf86cd799439012',
    customerId: '507f1f77bcf86cd799439013',
    slaStatus: 'on_track',
    slaBreachedStage: 'acceptance',
    fromDate: '2026-05-01T00:00:00.000Z',
    toDate: '2026-05-21T00:00:00.000Z',
    page: '2',
    limit: '25',
    sort: 'createdAt_asc',
  });

  assert.equal(query.status, 'accepted');
  assert.equal(query.page, 2);
  assert.equal(query.limit, 25);
  assert.ok(query.fromDate);
  assert.equal(query.fromDate.toISOString(), '2026-05-01T00:00:00.000Z');
});

test('admin order status update validator requires a valid status', () => {
  assert.throws(() => adminOrderStatusUpdateBodyValidator.parse({}));
  assert.throws(() => adminOrderStatusUpdateBodyValidator.parse({ status: 'delivered' }));
  assert.deepEqual(
    adminOrderStatusUpdateBodyValidator.parse({
      status: 'accepted',
      reason: 'Manual operations correction',
    }),
    {
      status: 'accepted',
      reason: 'Manual operations correction',
    },
  );
});
