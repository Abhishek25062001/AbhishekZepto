import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  ACTIVE_ORDER_DETAIL_SECTIONS,
  ACTIVE_ORDER_LIST_COLUMNS,
} from '../utils/vendor-orders-display.util';
import { buildActiveOrdersQuery, isActiveVendorOrderStatus } from '../utils/vendor-orders-query.util';
import {
  canStartVendorOrderPicking,
  canCompleteVendorOrderPicking,
  canCompleteVendorOrderPacking,
  canMarkVendorOrderReadyForPickup,
  canUpdateVendorOrderItemPicking,
  canStartVendorOrderPacking,
  getVendorOrderItemRemainingQuantity,
} from '../utils/vendor-orders-workflow.util';

test('active orders page defines expected scan columns', () => {
  assert.deepEqual([...ACTIVE_ORDER_LIST_COLUMNS], [
    'Order',
    'Order status',
    'Picker',
    'Packing',
    'Items',
    'Total',
    'Accepted',
    'SLA',
  ]);
});

test('active orders page uses accepted store order defaults', () => {
  assert.deepEqual(buildActiveOrdersQuery({ page: 1, limit: 50 }), {
    page: 1,
    limit: 50,
    storeStatus: 'accepted',
  });
});

test('active order status helper includes only active workflow states', () => {
  assert.equal(isActiveVendorOrderStatus('accepted'), true);
  assert.equal(isActiveVendorOrderStatus('picking'), true);
  assert.equal(isActiveVendorOrderStatus('packing'), true);
  assert.equal(isActiveVendorOrderStatus('ready_for_pickup'), true);
  assert.equal(isActiveVendorOrderStatus('placed'), false);
  assert.equal(isActiveVendorOrderStatus('cancelled'), false);
});

test('active order detail view starts with expected read-only sections', () => {
  assert.deepEqual([...ACTIVE_ORDER_DETAIL_SECTIONS], ['Summary', 'Items', 'State']);
});

test('start picking guard allows only accepted orders before picking starts', () => {
  assert.equal(canStartVendorOrderPicking({
    orderStatus: 'accepted',
    storeStatus: 'accepted',
    pickerStatus: null,
  }), true);
  assert.equal(canStartVendorOrderPicking({
    orderStatus: 'accepted',
    storeStatus: 'accepted',
    pickerStatus: 'pending',
  }), true);
  assert.equal(canStartVendorOrderPicking({
    orderStatus: 'picking',
    storeStatus: 'accepted',
    pickerStatus: 'in_progress',
  }), false);
  assert.equal(canStartVendorOrderPicking({
    orderStatus: 'accepted',
    storeStatus: 'pending_acceptance',
    pickerStatus: null,
  }), false);
});

test('item picking guard allows updates only during active picking', () => {
  assert.equal(canUpdateVendorOrderItemPicking({
    orderStatus: 'picking',
    storeStatus: 'accepted',
    pickerStatus: 'in_progress',
  }), true);
  assert.equal(canUpdateVendorOrderItemPicking({
    orderStatus: 'accepted',
    storeStatus: 'accepted',
    pickerStatus: null,
  }), false);
});

test('remaining item quantity subtracts picked and missing quantities', () => {
  assert.equal(getVendorOrderItemRemainingQuantity({
    missingQuantity: 1,
    pickedQuantity: 2,
    quantity: 5,
  }), 2);
  assert.equal(getVendorOrderItemRemainingQuantity({
    missingQuantity: 3,
    pickedQuantity: 3,
    quantity: 5,
  }), 0);
});

test('complete picking guard requires active picking and resolved items', () => {
  assert.equal(canCompleteVendorOrderPicking({
    items: [
      {
        pickingStatus: 'picked',
      } as never,
      {
        pickingStatus: 'partial',
      } as never,
    ],
    orderStatus: 'picking',
    storeStatus: 'accepted',
    pickerStatus: 'in_progress',
  }), true);
  assert.equal(canCompleteVendorOrderPicking({
    items: [
      {
        pickingStatus: 'pending',
      } as never,
    ],
    orderStatus: 'picking',
    storeStatus: 'accepted',
    pickerStatus: 'in_progress',
  }), false);
  assert.equal(canCompleteVendorOrderPicking({
    items: [
      {
        pickingStatus: 'picked',
      } as never,
    ],
    orderStatus: 'accepted',
    storeStatus: 'accepted',
    pickerStatus: null,
  }), false);
});

test('packing guards follow backend transition order', () => {
  assert.equal(canStartVendorOrderPacking({
    orderStatus: 'picking',
    storeStatus: 'accepted',
    pickerStatus: 'completed',
    packingStatus: null,
  }), true);
  assert.equal(canCompleteVendorOrderPacking({
    orderStatus: 'packing',
    storeStatus: 'accepted',
    pickerStatus: 'completed',
    packingStatus: 'in_progress',
  }), true);
  assert.equal(canMarkVendorOrderReadyForPickup({
    orderStatus: 'packing',
    storeStatus: 'accepted',
    pickerStatus: 'completed',
    packingStatus: 'completed',
  }), true);
  assert.equal(canStartVendorOrderPacking({
    orderStatus: 'picking',
    storeStatus: 'accepted',
    pickerStatus: 'in_progress',
    packingStatus: null,
  }), false);
  assert.equal(canMarkVendorOrderReadyForPickup({
    orderStatus: 'ready_for_pickup',
    storeStatus: 'accepted',
    pickerStatus: 'completed',
    packingStatus: 'ready_for_pickup',
  }), false);
});
