import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const apiSource = () => readFileSync(
  resolve(process.cwd(), 'src/modules/audit-logs/api/audit-log.api.ts'),
  'utf8',
);

const readModuleSource = (directory: string): string => readdirSync(directory)
  .flatMap((entry) => {
    const entryPath = resolve(directory, entry);
    if (statSync(entryPath).isDirectory()) return [readModuleSource(entryPath)];
    if (entryPath.endsWith('.test.ts')) return [];
    if (!/\.(ts|tsx)$/.test(entryPath)) return [];
    return [readFileSync(entryPath, 'utf8')];
  })
  .join('\n');

test('audit log API client uses Module 16 read-only endpoints only', () => {
  const source = apiSource();

  assert.match(source, /const BASE = '\/api\/v1\/admin\/audit-logs'/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<AuditLogsListResponse>>\(BASE/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<AuditLogRecord>>/);
  assert.match(source, /`\$\{BASE\}\/\$\{auditLogId\}`/);
  assert.doesNotMatch(source, /apiClient\.(post|patch|put|delete)/);
  assert.doesNotMatch(
    source,
    /exportAudit|dataExport|analytics|replay|restore|refund|payout|commission|promotion|tax|\/orders|\/delivery|\/customers|\/support|\/catalog|\/vendors|\/stores|\/settings/i,
  );
});

test('audit log hooks expose read-only list and detail queries', () => {
  const listHookSource = readFileSync(
    resolve(process.cwd(), 'src/modules/audit-logs/hooks/useAuditLogs.ts'),
    'utf8',
  );
  const detailHookSource = readFileSync(
    resolve(process.cwd(), 'src/modules/audit-logs/hooks/useAuditLogDetail.ts'),
    'utf8',
  );

  assert.match(listHookSource, /all: \['audit-logs'\] as const/);
  assert.match(listHookSource, /list: \(query: AuditLogsListQuery\)/);
  assert.match(listHookSource, /detail: \(auditLogId: string\)/);
  assert.match(listHookSource, /queryFn: \(\) => listAuditLogs\(query\)/);
  assert.match(detailHookSource, /queryFn: \(\) => getAuditLog\(auditLogId\)/);
  assert.match(detailHookSource, /enabled: auditLogId\.length > 0/);
  assert.doesNotMatch(`${listHookSource}\n${detailHookSource}`, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
});

test('audit log list page wires documented filters pagination and route gate', () => {
  const pageSource = readFileSync(resolve(process.cwd(), 'src/pages/audit-logs/AuditLogsPage.tsx'), 'utf8');
  const filterSource = readFileSync(
    resolve(process.cwd(), 'src/modules/audit-logs/components/AuditLogFilterBar.tsx'),
    'utf8',
  );
  const tableSource = readFileSync(
    resolve(process.cwd(), 'src/modules/audit-logs/components/AuditLogTable.tsx'),
    'utf8',
  );
  const routesSource = readFileSync(resolve(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');

  assert.match(pageSource, /useAuditLogs\(filters\)/);
  assert.match(pageSource, /AUDIT_LOG_DEFAULT_FILTERS/);
  assert.match(pageSource, /pagination\.hasPreviousPage/);
  assert.match(pageSource, /pagination\.hasNextPage/);
  assert.match(filterSource, /adminId:/);
  assert.match(filterSource, /actionType:/);
  assert.match(filterSource, /entityType:/);
  assert.match(filterSource, /entityId:/);
  assert.match(filterSource, /from:/);
  assert.match(filterSource, /to:/);
  assert.match(tableSource, /\/audit-logs\/\$\{row\.id\}/);
  assert.match(routesSource, /path: '\/audit-logs'/);
  assert.match(routesSource, /permission="audit_logs:read"/);
  assert.doesNotMatch(`${pageSource}\n${tableSource}`, /Export|Replay|Restore|Delete|Edit|Reveal|useMutation|apiClient\.(post|patch|put|delete)/);
});

test('audit log detail page renders read-only metadata and state panels', () => {
  const detailSource = readFileSync(
    resolve(process.cwd(), 'src/modules/audit-logs/pages/AuditLogDetailPage.tsx'),
    'utf8',
  );
  const statePanelSource = readFileSync(
    resolve(process.cwd(), 'src/modules/audit-logs/components/AuditLogStatePanel.tsx'),
    'utf8',
  );
  const routesSource = readFileSync(resolve(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');

  assert.match(detailSource, /useAuditLogDetail\(auditLogId\)/);
  assert.match(detailSource, /<AuditLogStatePanel state=\{auditLog\.beforeState\} title="Before state" \/>/);
  assert.match(detailSource, /<AuditLogStatePanel state=\{auditLog\.afterState\} title="After state" \/>/);
  assert.match(statePanelSource, /JSON\.stringify\(state, null, 2\)/);
  assert.match(routesSource, /path: '\/audit-logs\/:auditLogId'/);
  assert.match(routesSource, /permission="audit_logs:read"/);
  assert.doesNotMatch(`${detailSource}\n${statePanelSource}`, /Export|Replay|Restore|Delete|Edit|Reveal|useMutation|apiClient\.(post|patch|put|delete)/);
});

test('audit log UI navigation and module source stay read-only', () => {
  const sidebarSource = readFileSync(resolve(process.cwd(), 'src/components/layout/Sidebar.tsx'), 'utf8');
  const routesSource = readFileSync(resolve(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
  const moduleSource = readModuleSource(resolve(process.cwd(), 'src/modules/audit-logs'));

  assert.match(sidebarSource, /\{ label: 'Audit Logs', to: '\/audit-logs', permission: 'audit_logs:read' \}/);
  assert.match(routesSource, /path: '\/audit-logs'/);
  assert.match(routesSource, /path: '\/audit-logs\/:auditLogId'/);
  assert.match(routesSource, /permission="audit_logs:read"/);
  assert.doesNotMatch(moduleSource, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
  assert.doesNotMatch(
    moduleSource,
    /exportAudit|dataExport|analytics|replay|restore|refund|payout|commission|promotion|tax|\/orders|\/delivery|\/customers|\/support|\/catalog|\/vendors|\/stores|\/settings/i,
  );
});
