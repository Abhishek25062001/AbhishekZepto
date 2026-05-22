import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  ACTIVE_ORDER_STATUSES,
  HISTORY_ORDER_STATUSES,
  buildActiveOrdersQuery,
  buildIncomingOrdersQuery,
  buildOrderHistoryQuery,
  buildVendorOrderListQueryParams,
  isActiveVendorOrderStatus,
  isHistoryVendorOrderStatus,
} from './vendor-orders-query.util';

test('buildVendorOrderListQueryParams removes empty values', () => {
  assert.deepEqual(
    buildVendorOrderListQueryParams({
      page: 2,
      limit: 20,
      status: 'placed',
      storeStatus: undefined,
    }),
    {
      page: 2,
      limit: 20,
      status: 'placed',
    },
  );
});

test('buildIncomingOrdersQuery defaults to placed pending acceptance orders', () => {
  assert.deepEqual(buildIncomingOrdersQuery({ page: 1, limit: 10 }), {
    page: 1,
    limit: 10,
    status: 'placed',
    storeStatus: 'pending_acceptance',
  });
});

test('buildIncomingOrdersQuery allows explicit override for refresh states', () => {
  assert.deepEqual(buildIncomingOrdersQuery({ status: 'accepted' }), {
    status: 'accepted',
    storeStatus: 'pending_acceptance',
  });
});

test('buildActiveOrdersQuery defaults to accepted store orders without forcing one lifecycle status', () => {
  assert.deepEqual(buildActiveOrdersQuery({ page: 2, limit: 15 }), {
    page: 2,
    limit: 15,
    storeStatus: 'accepted',
  });
});

test('active order statuses exclude placed and cancelled states', () => {
  assert.deepEqual([...ACTIVE_ORDER_STATUSES], [
    'accepted',
    'picking',
    'packing',
    'ready_for_pickup',
  ]);
  assert.equal(isActiveVendorOrderStatus('accepted'), true);
  assert.equal(isActiveVendorOrderStatus('placed'), false);
  assert.equal(isActiveVendorOrderStatus('cancelled'), false);
});

test('buildOrderHistoryQuery uses only provided supported store order filters', () => {
  assert.deepEqual(buildOrderHistoryQuery({
    limit: 25,
    page: 4,
    paymentStatus: 'paid',
    status: 'cancelled',
    storeStatus: 'accepted',
  }), {
    limit: 25,
    page: 4,
    paymentStatus: 'paid',
    status: 'cancelled',
    storeStatus: 'accepted',
  });
});

test('buildOrderHistoryQuery resets cleanly when filters are cleared by caller', () => {
  assert.deepEqual(buildOrderHistoryQuery({
    limit: 20,
    page: undefined,
    paymentStatus: undefined,
    status: undefined,
    storeStatus: undefined,
  }), {
    limit: 20,
  });
});

test('buildOrderHistoryQuery omits empty filter values', () => {
  assert.deepEqual(buildOrderHistoryQuery({
    limit: 20,
    page: 1,
    paymentStatus: undefined,
    status: undefined,
    storeStatus: undefined,
  }), {
    limit: 20,
    page: 1,
  });
});

test('history order statuses use existing lifecycle statuses only', () => {
  assert.deepEqual([...HISTORY_ORDER_STATUSES], [
    'accepted',
    'cancelled',
    'packing',
    'picking',
    'placed',
    'ready_for_pickup',
  ]);
  assert.equal(isHistoryVendorOrderStatus('cancelled'), true);
  assert.equal(isHistoryVendorOrderStatus('ready_for_pickup'), true);
});
