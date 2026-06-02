import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

test('operational overview route is gated by reports read permission', () => {
  const routesSource = readSource('src/routes/admin.routes.tsx');

  assert.match(routesSource, /path: '\/analytics'/);
  assert.match(routesSource, /permission="reports:read"/);
  assert.match(routesSource, /<OperationalOverviewPage \/>/);
});

test('operational overview sidebar link is gated by reports read permission', () => {
  const sidebarSource = readSource('src/components/layout/Sidebar.tsx');

  assert.match(sidebarSource, /\{ label: 'Analytics', to: '\/analytics', permission: 'reports:read' \}/);
});

test('operational overview page shell avoids data and mutation workflows', () => {
  const pageSource = readSource('src/pages/analytics/OperationalOverviewPage.tsx');

  assert.match(pageSource, /Operational Overview/);
  assert.match(pageSource, /useOperationalOverview\(queryFilters\)/);
  assert.match(pageSource, /AnalyticsFilterBar/);
  assert.match(pageSource, /OperationalMetricGrid/);
  assert.match(pageSource, /OrderAnalyticsPanel/);
  assert.match(pageSource, /DeliveryAnalyticsPanel/);
  assert.match(pageSource, /StoreAnalyticsPanel/);
  assert.match(pageSource, /SupportAnalyticsPanel/);
  assert.match(pageSource, /No operational activity/);
  assert.doesNotMatch(pageSource, /apiClient|useMutation|Export|Download|Schedule|Builder/);
});
