import assert from 'node:assert/strict';
import { test } from 'node:test';

import { VENDOR_REALTIME_EVENTS } from '../types/vendor-realtime.types';
import { getNewOrderRealtimeAlertViewModel } from '../utils/vendor-realtime-alert.util';

test('new order realtime alert builds view model from order created event', () => {
  const viewModel = getNewOrderRealtimeAlertViewModel({
    eventName: VENDOR_REALTIME_EVENTS.ORDER_CREATED,
    orderId: 'order-1',
    storeId: 'store-1',
    orderStatus: 'placed',
    totalAmount: 125.5,
    itemCount: 4,
    updatedAt: '2026-01-01T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
    order: null,
  });

  assert.equal(viewModel?.orderId, 'order-1');
  assert.equal(viewModel?.totalAmountLabel, '₹125.50');
  assert.equal(viewModel?.itemCountLabel, '4 items');
  assert.equal(viewModel?.targetPath, '/orders/order-1');
});

test('new order realtime alert hides for status update events', () => {
  const viewModel = getNewOrderRealtimeAlertViewModel({
    eventName: VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
    orderId: 'order-1',
    storeId: 'store-1',
    orderStatus: 'accepted',
    totalAmount: 125.5,
    itemCount: 4,
    updatedAt: '2026-01-01T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
    order: null,
  });

  assert.equal(viewModel, null);
});

