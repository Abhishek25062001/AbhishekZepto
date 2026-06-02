import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

test('data export dashboard routes are gated by reports export', () => {
  const routesSource = readSource('src/routes/admin.routes.tsx');

  assert.match(routesSource, /DataExportListPage/);
  assert.match(routesSource, /DataExportDetailPage/);
  assert.match(routesSource, /path: '\/exports'/);
  assert.match(routesSource, /path: '\/exports\/:exportId'/);
  assert.match(routesSource, /permission="reports:export"/);
  assert.doesNotMatch(routesSource, /permission="reports:read"[\s\S]{0,120}<DataExport/);
});

test('data export sidebar navigation is gated by reports export', () => {
  const sidebarSource = readSource('src/components/layout/Sidebar.tsx');

  assert.match(sidebarSource, /\{ label: 'Exports', to: '\/exports', permission: 'reports:export' \}/);
});
