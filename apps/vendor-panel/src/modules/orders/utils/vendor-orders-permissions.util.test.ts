import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { VendorOrderDetail } from '../types/vendor-orders.types';
import {
  canReadVendorActiveOrders,
  canReadVendorOrderHistory,
  canReadVendorOrders,
  canShowCompletePickingAction,
  canShowStartPickingAction,
  canShowStoreCancellationAction,
  canUpdateVendorOrderHistory,
  canUpdateVendorOrders,
  canUpdateVendorPickingPacking,
} from './vendor-orders-permissions.util';

const orderForPermissions = (override: Partial<VendorOrderDetail>): VendorOrderDetail => ({
  acceptedAt: null,
  addressSnapshot: {},
  assignedPickerId: null,
  cancellationReason: null,
  cancelledAt: null,
  checkoutSessionId: 'checkout-1',
  createdAt: '2026-05-21T00:00:00.000Z',
  currency: 'INR',
  customerId: 'customer-1',
  deliveryFeeAmount: 0,
  discountAmount: 0,
  grandTotal: 100,
  inventoryConfirmed: true,
  itemCount: 1,
  items: [
    {
      lineTotal: 100,
      missingQuantity: 0,
      pickedQuantity: 1,
      pickingStatus: 'picked',
      productId: 'product-1',
      productName: 'Milk',
      quantity: 1,
      storeProductId: 'store-product-1',
      unitPrice: 100,
      variantId: 'variant-1',
    },
  ],
  orderId: 'order-1',
  orderNumber: 'ORD-1',
  orderStatus: 'accepted',
  packingStatus: null,
  paymentId: 'payment-1',
  paymentStatus: 'paid',
  pickerStatus: null,
  placedAt: '2026-05-21T00:00:00.000Z',
  readyForPickupAt: null,
  refundReviewRequired: false,
  rejectedAt: null,
  rejectionReason: null,
  slaBreachedStage: null,
  slaStatus: null,
  storeId: 'store-1',
  storeStatus: 'accepted',
  subtotal: 100,
  taxAmount: 0,
  timeline: [],
  updatedAt: '2026-05-21T00:00:00.000Z',
  ...override,
});

test('vendor incoming orders require orders read visibility', () => {
  assert.equal(canReadVendorOrders(['orders:read']), true);
  assert.equal(canReadVendorOrders(['vendor:read_store']), false);
});

test('vendor incoming order actions require orders update visibility', () => {
  assert.equal(canUpdateVendorOrders(['orders:read']), false);
  assert.equal(canUpdateVendorOrders(['orders:update']), true);
});

test('vendor active orders reuse order read and update permissions', () => {
  assert.equal(canReadVendorActiveOrders(['orders:read']), true);
  assert.equal(canReadVendorActiveOrders(['orders:update']), false);
  assert.equal(canUpdateVendorPickingPacking(['orders:update']), true);
  assert.equal(canUpdateVendorPickingPacking(['orders:read']), false);
});

test('picking action visibility requires permission plus matching workflow state', () => {
  assert.equal(
    canShowStartPickingAction(['orders:update'], orderForPermissions({
      orderStatus: 'accepted',
      pickerStatus: null,
    })),
    true,
  );
  assert.equal(
    canShowStartPickingAction(['orders:read'], orderForPermissions({
      orderStatus: 'accepted',
      pickerStatus: null,
    })),
    false,
  );
  assert.equal(
    canShowCompletePickingAction(
      ['orders:update'],
      orderForPermissions({
        orderStatus: 'picking',
        pickerStatus: 'in_progress',
      }),
    ),
    true,
  );
});

test('vendor order history uses read permission and cancellation uses update permission', () => {
  assert.equal(canReadVendorOrderHistory(['orders:read']), true);
  assert.equal(canReadVendorOrderHistory(['orders:update']), false);
  assert.equal(canUpdateVendorOrderHistory(['orders:update']), true);
  assert.equal(canUpdateVendorOrderHistory(['orders:read']), false);
});

test('store cancellation visibility requires permission plus cancellable state', () => {
  assert.equal(
    canShowStoreCancellationAction(['orders:update'], orderForPermissions({
      orderStatus: 'accepted',
    })),
    true,
  );
  assert.equal(
    canShowStoreCancellationAction(['orders:read'], orderForPermissions({
      orderStatus: 'accepted',
    })),
    false,
  );
  assert.equal(
    canShowStoreCancellationAction(['orders:update'], orderForPermissions({
      orderStatus: 'ready_for_pickup',
      packingStatus: 'ready_for_pickup',
    })),
    false,
  );
});
