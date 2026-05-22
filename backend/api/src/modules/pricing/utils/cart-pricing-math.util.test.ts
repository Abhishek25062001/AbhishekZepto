import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateCartPricingTotals, recalculateLineTotal } from './cart-pricing-math.util';

test('recalculateLineTotal multiplies quantity and unit price', () => {
  assert.equal(recalculateLineTotal(2, 100), 200);
});

test('calculateCartPricingTotals with zero tax and delivery', () => {
  const totals = calculateCartPricingTotals(500);

  assert.equal(totals.subtotal, 500);
  assert.equal(totals.taxAmount, 0);
  assert.equal(totals.deliveryFeeAmount, 0);
  assert.equal(totals.grandTotal, 500);
  assert.equal(totals.discountAmount, 0);
});
