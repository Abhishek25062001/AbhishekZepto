import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formatCartGrandTotal, formatCartLineTotal } from './cart-price.util';

test('formatCartLineTotal formats amount as rupees', () => {
  assert.equal(formatCartLineTotal(99), '₹99.00');
});

test('formatCartGrandTotal formats zero', () => {
  assert.equal(formatCartGrandTotal(0), '₹0.00');
});
