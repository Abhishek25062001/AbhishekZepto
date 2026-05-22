import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateOrderNumber } from './order-number.util';

test('generateOrderNumber returns ORD prefix and unique values', () => {
  const a = generateOrderNumber();
  const b = generateOrderNumber();

  assert.match(a, /^ORD-/);
  assert.match(b, /^ORD-/);
  assert.notEqual(a, b);
  assert.ok(a.length <= 64);
});
