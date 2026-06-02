import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildAnalyticsDateMatch, buildBreakdown } from './operational-analytics.repository';

test('buildAnalyticsDateMatch returns empty match without date filters', () => {
  assert.deepEqual(buildAnalyticsDateMatch('createdAt', {}), {});
});

test('buildAnalyticsDateMatch applies bounded date range', () => {
  const fromDate = new Date('2026-01-01T00:00:00.000Z');
  const toDate = new Date('2026-01-31T23:59:59.999Z');

  assert.deepEqual(buildAnalyticsDateMatch('createdAt', { fromDate, toDate }), {
    createdAt: {
      $gte: fromDate,
      $lte: toDate,
    },
  });
});

test('buildBreakdown maps aggregate rows into count breakdown', () => {
  assert.deepEqual(
    buildBreakdown([
      { _id: 'placed', count: 2 },
      { _id: 'delivered', count: 3 },
      { _id: null, count: 1 },
    ]),
    {
      placed: 2,
      delivered: 3,
    },
  );
});
