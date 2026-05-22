import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  INCOMING_ORDER_DETAIL_SECTIONS,
  INCOMING_ORDER_LIST_COLUMNS,
} from '../utils/vendor-orders-display.util';
import { buildIncomingOrdersQuery } from '../utils/vendor-orders-query.util';

test('incoming orders page defines expected scan columns', () => {
  assert.deepEqual([...INCOMING_ORDER_LIST_COLUMNS], [
    'Order',
    'Order status',
    'Store status',
    'Payment',
    'Total',
    'Placed',
    'SLA',
  ]);
});

test('incoming orders page uses incoming order defaults', () => {
  assert.deepEqual(buildIncomingOrdersQuery({ page: 3, limit: 15 }), {
    page: 3,
    limit: 15,
    status: 'placed',
    storeStatus: 'pending_acceptance',
  });
});

test('incoming order detail view keeps expected read-only sections', () => {
  assert.deepEqual([...INCOMING_ORDER_DETAIL_SECTIONS], ['Summary', 'Items', 'State']);
});
