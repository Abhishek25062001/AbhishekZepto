import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

test('analytics filter bar exposes only Module 18 supported filters', () => {
  const source = readSource('src/modules/operational-overview/components/AnalyticsFilterBar.tsx');

  for (const field of ['fromDate', 'toDate', 'timezone', 'storeId', 'vendorId', 'cityId']) {
    assert.match(source, new RegExp(`'${field}'`));
  }

  assert.doesNotMatch(source, /exportAnalytics|dataExport|download|schedule|builder|forecast|priority|category/i);
});

test('operational metric grid renders overview summary domains only', () => {
  const source = readSource('src/modules/operational-overview/components/OperationalMetricGrid.tsx');

  assert.match(source, /Orders/);
  assert.match(source, /Delivery/);
  assert.match(source, /Stores/);
  assert.match(source, /Support/);
  assert.match(source, /No status activity/);
  assert.doesNotMatch(source, /apiClient|useMutation|Export|Download|Schedule|Builder/);
});

test('domain analytics panels use read-only analytics hooks', () => {
  const sources = [
    'OrderAnalyticsPanel.tsx',
    'DeliveryAnalyticsPanel.tsx',
    'StoreAnalyticsPanel.tsx',
    'SupportAnalyticsPanel.tsx',
  ].map((file) => readSource(`src/modules/operational-overview/components/${file}`)).join('\n');

  assert.match(sources, /useOrderAnalytics\(filters\)/);
  assert.match(sources, /useDeliveryAnalytics\(filters\)/);
  assert.match(sources, /useStoreAnalytics\(filters\)/);
  assert.match(sources, /useSupportAnalytics\(filters\)/);
  assert.match(sources, /Support Priority/);
  assert.match(sources, /Support Category/);
  assert.doesNotMatch(sources, /apiClient|useMutation|Export|Download|Schedule|Builder/);
});
