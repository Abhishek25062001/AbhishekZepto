import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getProductPriceDisplay } from './product-price-display.util';

test('price block strikes mrp when finalPrice is lower', () => {
  const display = getProductPriceDisplay(100, 80);
  assert.ok(display);
  assert.equal(display.showStrikeMrp, true);
  assert.equal(display.finalLabel, '₹80.00');
  assert.equal(display.mrpLabel, '₹100.00');
});

test('price block does not strike when prices are equal', () => {
  const display = getProductPriceDisplay(100, 100);
  assert.ok(display);
  assert.equal(display.showStrikeMrp, false);
});
