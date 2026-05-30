import assert from 'node:assert/strict';
import { test } from 'node:test';

import { handleCustomerPushPayload } from '../utils/customer-push-payload.handler';

test('out-for-delivery payload navigates to tracking screen', () => {
  const calls: Array<{ screen: string; params?: Record<string, string> }> = [];

  const handled = handleCustomerPushPayload(
    { orderId: 'order-1', type: 'order_out_for_delivery' },
    { navigate: (screen, params) => calls.push({ screen, params }) },
  );

  assert.equal(handled, true);
  assert.deepEqual(calls, [{ screen: 'DeliveryTracking', params: { orderId: 'order-1' } }]);
});

test('delivered payload navigates to order detail screen', () => {
  const calls: Array<{ screen: string; params?: Record<string, string> }> = [];

  const handled = handleCustomerPushPayload(
    { orderId: 'order-2', type: 'order_delivered' },
    { navigate: (screen, params) => calls.push({ screen, params }) },
  );

  assert.equal(handled, true);
  assert.deepEqual(calls, [{ screen: 'OrderDetail', params: { orderId: 'order-2' } }]);
});

test('malformed customer payload does not crash', () => {
  const calls: Array<{ screen: string; params?: Record<string, string> }> = [];

  const handled = handleCustomerPushPayload(
    { type: 'order_out_for_delivery' },
    { navigate: (screen, params) => calls.push({ screen, params }) },
  );

  assert.equal(handled, false);
  assert.deepEqual(calls, []);
});
