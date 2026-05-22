import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { test } from 'node:test';
import type { CartItemRecord } from '../../cart/types/cart.types';
import { detectCartPriceDrift } from './cart-price-drift.util';

test('detectCartPriceDrift finds changed line', () => {
  const itemId = new Types.ObjectId();
  const items: CartItemRecord[] = [
    {
      _id: itemId,
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId: new Types.ObjectId(),
      quantity: 1,
      unitPriceSnapshot: 100,
      lineTotal: 100,
      productNameSnapshot: 'Milk',
      addedAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const result = detectCartPriceDrift(items, [
    {
      itemId: itemId.toString(),
      variantId: items[0]!.variantId.toString(),
      storeProductId: items[0]!.storeProductId.toString(),
      unitPrice: 120,
      productName: 'Milk',
    },
  ]);

  assert.equal(result.hasDrift, true);
  assert.equal(result.changedItems.length, 1);
  assert.equal(result.changedItems[0]?.newPrice, 120);
});

test('detectCartPriceDrift returns no drift when prices match', () => {
  const itemId = new Types.ObjectId();
  const items: CartItemRecord[] = [
    {
      _id: itemId,
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId: new Types.ObjectId(),
      quantity: 1,
      unitPriceSnapshot: 100,
      lineTotal: 100,
      productNameSnapshot: 'Milk',
      addedAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const result = detectCartPriceDrift(items, [
    {
      itemId: itemId.toString(),
      variantId: items[0]!.variantId.toString(),
      storeProductId: items[0]!.storeProductId.toString(),
      unitPrice: 100,
      productName: 'Milk',
    },
  ]);

  assert.equal(result.hasDrift, false);
});
