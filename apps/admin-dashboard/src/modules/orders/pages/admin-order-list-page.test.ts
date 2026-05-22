import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ADMIN_ORDER_LIST_COLUMNS } from '../utils/admin-orders-display.util';
import { ADMIN_ORDER_DETAIL_SECTIONS } from '../utils/admin-orders-display.util';

test('admin order list columns match Module 11 contract', () => {
  assert.deepEqual([...ADMIN_ORDER_LIST_COLUMNS], [
    'Order',
    'Customer',
    'Store',
    'Status',
    'Store status',
    'Payment',
    'Total',
    'Created',
    'SLA',
  ]);
});

test('admin order detail sections match Module 11 contract', () => {
  assert.deepEqual([...ADMIN_ORDER_DETAIL_SECTIONS], [
    'Summary',
    'Payment',
    'Items',
    'State',
    'Timeline',
    'SLA',
    'Cancellation',
  ]);
});
