import assert from 'node:assert/strict';
import { test } from 'node:test';
import { INVENTORY_LOCK_TYPE } from '../constants/inventory-lock-type.constant';
import { calculateLockExpiry } from './inventory-lock-expiry.util';

test('calculateLockExpiry applies cart default of 10 minutes', () => {
  const from = new Date('2026-05-18T10:00:00.000Z');
  const expiresAt = calculateLockExpiry(INVENTORY_LOCK_TYPE.CART, from);
  assert.equal(expiresAt.toISOString(), '2026-05-18T10:10:00.000Z');
});

test('calculateLockExpiry applies checkout default of 15 minutes', () => {
  const from = new Date('2026-05-18T10:00:00.000Z');
  const expiresAt = calculateLockExpiry(INVENTORY_LOCK_TYPE.CHECKOUT, from);
  assert.equal(expiresAt.toISOString(), '2026-05-18T10:15:00.000Z');
});

test('calculateLockExpiry applies order default of 30 minutes', () => {
  const from = new Date('2026-05-18T10:00:00.000Z');
  const expiresAt = calculateLockExpiry(INVENTORY_LOCK_TYPE.ORDER, from);
  assert.equal(expiresAt.toISOString(), '2026-05-18T10:30:00.000Z');
});
