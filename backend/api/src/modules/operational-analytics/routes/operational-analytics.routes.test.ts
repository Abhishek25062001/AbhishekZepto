import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { OPERATIONAL_ANALYTICS_PERMISSION_GROUPS } from '../constants/operational-analytics-permissions.constants';

const readSource = (path: string) => {
  const candidates = [
    resolve(process.cwd(), path),
    resolve(process.cwd(), 'backend/api', path),
  ];
  const sourcePath = candidates.find((candidate) => existsSync(candidate));

  assert.ok(sourcePath, `Expected source path to exist for ${path}`);
  return readFileSync(sourcePath, 'utf8');
};

test('operational analytics read permission is reports read only', () => {
  assert.deepEqual(OPERATIONAL_ANALYTICS_PERMISSION_GROUPS.READ, ['reports:read']);
});

test('operational analytics routes expose only read endpoints behind reports permission', () => {
  const source = readSource('src/modules/operational-analytics/routes/operational-analytics.routes.ts');

  for (const route of ['overview', 'orders', 'delivery', 'stores', 'support']) {
    assert.match(source, new RegExp(`router\\.get\\(\\s*'/${route}'`));
  }

  assert.match(source, /requireAnyPermission\(OPERATIONAL_ANALYTICS_PERMISSION_GROUPS\.READ\)/);
  assert.match(source, /validateRequest\(analyticsQueryValidator\)/);
  assert.doesNotMatch(source, /router\.(post|patch|put|delete)/);
});

test('operational analytics routes are mounted under admin route group', () => {
  const source = readSource('src/routes/v1/admin.routes.ts');

  assert.match(source, /operationalAnalyticsRoutes/);
  assert.match(source, /router\.use\('\/analytics', authenticate\(\), requireRole\(adminRoles\), operationalAnalyticsRoutes\)/);
});

test('operational analytics OpenAPI documents all read endpoints', () => {
  const source = readSource('src/docs/openapi/operational-analytics.paths.ts');

  for (const path of [
    '/admin/analytics/overview',
    '/admin/analytics/orders',
    '/admin/analytics/delivery',
    '/admin/analytics/stores',
    '/admin/analytics/support',
  ]) {
    assert.match(source, new RegExp(`'${path}'`));
  }

  assert.match(source, /summary: 'Get operational analytics overview'/);
  assert.match(source, /byStatus/);
  assert.match(source, /byPriority/);
  assert.match(source, /byCategory/);
  assert.doesNotMatch(source, /\b(post|patch|put|delete):/);
});
