import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CUSTOMER_REALTIME_ORDER_STATUS } from '../types/realtime-order.types';
import { getRealtimeOrderStatusToastMessage } from '../utils/realtime-order-status-toast.util';

test('accepted order toast message is returned', () => {
  assert.equal(
    getRealtimeOrderStatusToastMessage(CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED),
    'Your order has been accepted',
  );
});

test('packed order toast message is returned', () => {
  assert.equal(
    getRealtimeOrderStatusToastMessage(CUSTOMER_REALTIME_ORDER_STATUS.PACKED),
    'Your order is packed',
  );
});

test('delivered order toast message is returned', () => {
  assert.equal(
    getRealtimeOrderStatusToastMessage(CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED),
    'Your order has been delivered',
  );
});
