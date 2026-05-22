import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fromPaise, toPaise } from './payment-amount.util';

test('toPaise converts rupees to integer paise', () => {
  assert.equal(toPaise(250), 25000);
  assert.equal(toPaise(99.99), 9999);
  assert.equal(toPaise(0.5), 50);
});

test('fromPaise converts paise to rupees', () => {
  assert.equal(fromPaise(25000), 250);
});
