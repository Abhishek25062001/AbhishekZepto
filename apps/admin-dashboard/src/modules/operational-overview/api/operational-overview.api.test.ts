import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const source = () => readFileSync(
  resolve(process.cwd(), 'src/modules/operational-overview/api/operational-overview.api.ts'),
  'utf8',
);

test('operational overview API client uses Module 18 read endpoints only', () => {
  const apiSource = source();

  assert.match(apiSource, /const BASE = '\/api\/v1\/admin\/analytics'/);
  assert.match(apiSource, /getAnalytics\('\/overview', filters\)/);
  assert.match(apiSource, /getAnalytics\('\/orders', filters\)/);
  assert.match(apiSource, /getAnalytics\('\/delivery', filters\)/);
  assert.match(apiSource, /getAnalytics\('\/stores', filters\)/);
  assert.match(apiSource, /getAnalytics\('\/support', filters\)/);
  assert.doesNotMatch(apiSource, /apiClient\.(post|patch|put|delete)/);
  assert.doesNotMatch(apiSource, /exportAnalytics|dataExport|download|schedule|builder|forecast/i);
});

test('buildOperationalAnalyticsParams removes blank optional filters', () => {
  const apiSource = source();

  assert.match(apiSource, /Object\.entries\(filters\)/);
  assert.match(apiSource, /value !== undefined && value !== ''/);
  assert.match(apiSource, /params: buildOperationalAnalyticsParams\(filters\)/);
});
