import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { test } from 'node:test';
import type { CartRecord } from '../../cart/types/cart.types';
import { buildCheckoutSummarySnapshot } from './checkout-summary.util';

const buildCart = (): CartRecord => ({
  customerId: new Types.ObjectId(),
  storeId: new Types.ObjectId(),
  status: 'active',
  items: [
    {
      _id: new Types.ObjectId(),
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId: new Types.ObjectId(),
      quantity: 2,
      unitPriceSnapshot: 50,
      lineTotal: 100,
      productNameSnapshot: 'Milk',
      addedAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new Types.ObjectId(),
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId: new Types.ObjectId(),
      quantity: 1,
      unitPriceSnapshot: 30,
      lineTotal: 30,
      productNameSnapshot: 'Bread',
      addedAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  subtotal: 130,
  discountAmount: 0,
  taxAmount: 6.5,
  deliveryFeeAmount: 40,
  grandTotal: 176.5,
  currency: 'INR',
  lastCalculatedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

test('buildCheckoutSummarySnapshot sums item count and totals', () => {
  const summary = buildCheckoutSummarySnapshot(buildCart());

  assert.equal(summary.itemCount, 3);
  assert.equal(summary.subtotal, 130);
  assert.equal(summary.grandTotal, 176.5);
  assert.equal(summary.items.length, 2);
  assert.equal(summary.items[0]?.productName, 'Milk');
});
