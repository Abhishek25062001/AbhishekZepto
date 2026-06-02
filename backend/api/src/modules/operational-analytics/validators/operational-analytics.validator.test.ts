import assert from 'node:assert/strict';
import { test } from 'node:test';

import { OPERATIONAL_ANALYTICS_PERMISSION_GROUPS } from '../constants/operational-analytics-permissions.constants';
import { analyticsQuerySchema } from './operational-analytics.validator';

test('analytics query validator accepts documented filters', () => {
  const parsed = analyticsQuerySchema.parse({
    fromDate: '2026-01-01T00:00:00.000Z',
    toDate: '2026-01-31T23:59:59.999Z',
    timezone: 'Asia/Kolkata',
    storeId: '507f1f77bcf86cd799439011',
    vendorId: '507f1f77bcf86cd799439012',
    cityId: '507f1f77bcf86cd799439013',
  });

  assert.equal(parsed.timezone, 'Asia/Kolkata');
  assert.equal(parsed.storeId, '507f1f77bcf86cd799439011');
  assert.ok(parsed.fromDate instanceof Date);
});

test('analytics query validator defaults timezone to UTC', () => {
  const parsed = analyticsQuerySchema.parse({});

  assert.equal(parsed.timezone, 'UTC');
});

test('analytics query validator rejects inverted date ranges', () => {
  assert.throws(() => {
    analyticsQuerySchema.parse({
      fromDate: '2026-02-01T00:00:00.000Z',
      toDate: '2026-01-01T00:00:00.000Z',
    });
  }, /fromDate must be before or equal to toDate/);
});

test('analytics query validator rejects malformed entity identifiers', () => {
  assert.throws(() => {
    analyticsQuerySchema.parse({
      storeId: 'not-a-valid-object-id',
    });
  });
});

test('operational analytics read permission is reports read only', () => {
  assert.deepEqual(OPERATIONAL_ANALYTICS_PERMISSION_GROUPS.READ, ['reports:read']);
});
