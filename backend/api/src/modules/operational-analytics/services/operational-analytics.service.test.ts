import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getOperationalAnalyticsOrders,
  getOperationalAnalyticsOverview,
  getOperationalAnalyticsSupport,
  type OperationalAnalyticsRepository,
} from './operational-analytics.service';

const query = {
  fromDate: new Date('2026-01-01T00:00:00.000Z'),
  toDate: new Date('2026-01-31T23:59:59.999Z'),
  timezone: 'Asia/Kolkata',
};

const repository: OperationalAnalyticsRepository = {
  summarizeOrders: async () => ({
    total: 5,
    breakdown: {
      placed: 2,
      delivered: 3,
    },
  }),
  summarizeDeliveryAssignments: async () => ({
    total: 4,
    breakdown: {
      assigned: 1,
      delivered: 3,
    },
  }),
  summarizeStores: async () => ({
    total: 2,
    breakdown: {
      active: 2,
    },
  }),
  summarizeSupportTickets: async () => ({
    status: {
      total: 3,
      breakdown: {
        open: 1,
        resolved: 2,
      },
    },
    priority: {
      total: 3,
      breakdown: {
        high: 1,
        medium: 2,
      },
    },
    category: {
      total: 3,
      breakdown: {
        order: 3,
      },
    },
  }),
};

test('getOperationalAnalyticsOverview composes cross-domain summaries', async () => {
  const overview = await getOperationalAnalyticsOverview(query, repository);

  assert.equal(overview.window.timezone, 'Asia/Kolkata');
  assert.equal(overview.window.fromDate, '2026-01-01T00:00:00.000Z');
  assert.equal(overview.orders.total, 5);
  assert.equal(overview.delivery.byStatus?.delivered, 3);
  assert.equal(overview.stores.byStatus?.active, 2);
  assert.equal(overview.support.byPriority?.high, 1);
});

test('getOperationalAnalyticsOrders returns stable zero-count response', async () => {
  const response = await getOperationalAnalyticsOrders(query, {
    summarizeOrders: async () => ({
      total: 0,
      breakdown: {},
    }),
  });

  assert.deepEqual(response.orders, {
    total: 0,
    byStatus: {},
  });
});

test('getOperationalAnalyticsSupport maps status priority and category breakdowns', async () => {
  const response = await getOperationalAnalyticsSupport(query, repository);

  assert.equal(response.support.total, 3);
  assert.deepEqual(response.support.byCategory, {
    order: 3,
  });
});
