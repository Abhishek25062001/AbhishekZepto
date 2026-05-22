import assert from 'node:assert/strict';
import { test } from 'node:test';

import { adminCancelOrderSchema } from './admin-cancel-order.schema';
import { adminOrderStatusUpdateSchema } from './admin-order-status-update.schema';

test('adminCancelOrderSchema requires reason', () => {
  assert.throws(() => adminCancelOrderSchema.parse({ reason: '' }));
  assert.deepEqual(adminCancelOrderSchema.parse({ reason: 'Customer support request' }), {
    reason: 'Customer support request',
  });
});

test('adminOrderStatusUpdateSchema requires known status', () => {
  assert.throws(() => adminOrderStatusUpdateSchema.parse({ status: 'delivered' }));
  assert.deepEqual(adminOrderStatusUpdateSchema.parse({ status: 'accepted' }), {
    status: 'accepted',
  });
});
