import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  ORDER_HISTORY_CANCELLATION_FIELDS,
  ORDER_HISTORY_DETAIL_SECTIONS,
  ORDER_HISTORY_LIST_COLUMNS,
  formatVendorOrderRefundReview,
  getVendorOrderCancellationReason,
} from '../utils/vendor-orders-display.util';
import { buildOrderHistoryQuery } from '../utils/vendor-orders-query.util';
import { canCancelVendorStoreOrder } from '../utils/vendor-orders-workflow.util';

test('order history page defines expected scan columns', () => {
  assert.deepEqual([...ORDER_HISTORY_LIST_COLUMNS], [
    'Order',
    'Order status',
    'Store status',
    'Payment',
    'Total',
    'Placed',
    'Activity',
  ]);
});

test('order history page uses neutral default query', () => {
  assert.deepEqual(buildOrderHistoryQuery({ page: 1, limit: 20 }), {
    page: 1,
    limit: 20,
  });
});

test('order history detail starts with read-only sections', () => {
  assert.deepEqual([...ORDER_HISTORY_DETAIL_SECTIONS], ['Summary', 'Items', 'Totals', 'Timeline']);
});

test('store cancellation guard defers final eligibility to backend active states', () => {
  assert.equal(canCancelVendorStoreOrder({
    orderStatus: 'placed',
    storeStatus: 'pending_acceptance',
    pickerStatus: null,
  }), true);
  assert.equal(canCancelVendorStoreOrder({
    orderStatus: 'packing',
    storeStatus: 'accepted',
    pickerStatus: 'completed',
    packingStatus: 'in_progress',
  }), true);
  assert.equal(canCancelVendorStoreOrder({
    orderStatus: 'ready_for_pickup',
    storeStatus: 'accepted',
    pickerStatus: 'completed',
    packingStatus: 'ready_for_pickup',
  }), false);
  assert.equal(canCancelVendorStoreOrder({
    orderStatus: 'cancelled',
    storeStatus: 'accepted',
    pickerStatus: null,
  }), false);
});

test('order history cancellation display helpers prefer cancellation metadata', () => {
  assert.deepEqual([...ORDER_HISTORY_CANCELLATION_FIELDS], [
    'Cancelled',
    'Reason',
    'Refund review',
  ]);
  assert.equal(getVendorOrderCancellationReason({
    cancellationReason: 'Store closed',
    rejectionReason: 'Rejected by store',
  }), 'Store closed');
  assert.equal(getVendorOrderCancellationReason({
    cancellationReason: null,
    rejectionReason: 'Rejected by store',
  }), 'Rejected by store');
  assert.equal(formatVendorOrderRefundReview(true), 'Required');
  assert.equal(formatVendorOrderRefundReview(false), 'Not required');
});
