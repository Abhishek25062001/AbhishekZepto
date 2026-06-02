import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import {
  cleanOperationalAnalyticsFilters,
  mergeOperationalAnalyticsFilters,
  OPERATIONAL_ANALYTICS_DEFAULT_FILTERS,
} from './useOperationalAnalyticsFilters';

const hooksSource = () => readFileSync(
  resolve(process.cwd(), 'src/modules/operational-overview/hooks/useOperationalOverview.ts'),
  'utf8',
);

test('operational analytics filter helpers keep only supported non-empty filters', () => {
  assert.deepEqual(OPERATIONAL_ANALYTICS_DEFAULT_FILTERS, { timezone: 'UTC' });
  assert.deepEqual(
    cleanOperationalAnalyticsFilters({
      fromDate: '2026-01-01',
      toDate: '',
      timezone: 'Asia/Kolkata',
      storeId: undefined,
      vendorId: '507f1f77bcf86cd799439011',
      cityId: '',
    }),
    {
      fromDate: '2026-01-01',
      timezone: 'Asia/Kolkata',
      vendorId: '507f1f77bcf86cd799439011',
    },
  );
});

test('mergeOperationalAnalyticsFilters preserves bounded filter keys', () => {
  assert.deepEqual(
    mergeOperationalAnalyticsFilters(
      { timezone: 'UTC', storeId: '507f1f77bcf86cd799439011' },
      { timezone: 'Asia/Kolkata', storeId: '' },
    ),
    { timezone: 'Asia/Kolkata' },
  );
});

test('operational overview hooks expose read-only analytics queries', () => {
  const source = hooksSource();

  assert.match(source, /all: \['operational-overview'\] as const/);
  assert.match(source, /queryFn: \(\) => getOperationalOverview\(filters\)/);
  assert.match(source, /queryFn: \(\) => getOrderAnalytics\(filters\)/);
  assert.match(source, /queryFn: \(\) => getDeliveryAnalytics\(filters\)/);
  assert.match(source, /queryFn: \(\) => getStoreAnalytics\(filters\)/);
  assert.match(source, /queryFn: \(\) => getSupportAnalytics\(filters\)/);
  assert.doesNotMatch(source, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
  assert.doesNotMatch(source, /poll|interval|realtime|schedule|exportAnalytics|dataExport|download/i);
});
