import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { test } from 'node:test';
import type { CartRecord } from '../types/cart.types';
import { recalculateCartTotals, recalculateLineTotal } from './cart-totals.util';

const buildCart = (items: CartRecord['items']): CartRecord => ({
  customerId: new Types.ObjectId(),
  storeId: new Types.ObjectId(),
  status: 'active',
  items,
  subtotal: 0,
  discountAmount: 0,
  taxAmount: 0,
  deliveryFeeAmount: 0,
  grandTotal: 0,
  currency: 'INR',
  lastCalculatedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

test('recalculateLineTotal multiplies quantity and unit price', () => {
  assert.equal(recalculateLineTotal(3, 50), 150);
});

test('recalculateCartTotals sums line totals into subtotal and grandTotal', () => {
  const now = new Date();
  const cart = buildCart([
    {
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId: new Types.ObjectId(),
      quantity: 2,
      unitPriceSnapshot: 99,
      lineTotal: 198,
      productNameSnapshot: 'Milk',
      addedAt: now,
      updatedAt: now,
    },
    {
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId: new Types.ObjectId(),
      quantity: 1,
      unitPriceSnapshot: 40,
      lineTotal: 40,
      productNameSnapshot: 'Bread',
      addedAt: now,
      updatedAt: now,
    },
  ]);

  recalculateCartTotals(cart);

  assert.equal(cart.subtotal, 238);
  assert.equal(cart.grandTotal, 238);
  assert.equal(cart.discountAmount, 0);
  assert.ok(cart.lastCalculatedAt);
});
