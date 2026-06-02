import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { AUDIT_LOG_SYSTEM_PERMISSION_GROUPS } from '../constants/audit-log-system-permissions.constants';

const readSource = (path: string) => {
  const candidates = [
    resolve(process.cwd(), path),
    resolve(process.cwd(), 'backend/api', path),
  ];
  const sourcePath = candidates.find((candidate) => existsSync(candidate));

  assert.ok(sourcePath, `Expected source path to exist for ${path}`);
  return readFileSync(sourcePath, 'utf8');
};

test('audit log routes expose only read endpoints behind audit permissions', () => {
  const source = readSource('src/modules/audit-log-system/routes/audit-log-system.routes.ts');

  assert.deepEqual(AUDIT_LOG_SYSTEM_PERMISSION_GROUPS.READ, ['audit_logs:read']);
  assert.match(source, /router\.get\(\s*'\/'/);
  assert.match(source, /router\.get\(\s*'\/:auditLogId'/);
  assert.match(source, /requireAnyPermission\(AUDIT_LOG_SYSTEM_PERMISSION_GROUPS\.READ\)/);
  assert.match(source, /validateRequest\(listAuditLogsQueryValidator\)/);
  assert.match(source, /validateRequest\(auditLogIdParamValidator\)/);
  assert.doesNotMatch(source, /router\.(post|patch|put|delete)/);
});

test('audit log routes are mounted under admin route group', () => {
  const source = readSource('src/routes/v1/admin.routes.ts');

  assert.match(source, /auditLogSystemRoutes/);
  assert.match(source, /router\.use\('\/audit-logs', authenticate\(\), requireRole\(adminRoles\), auditLogSystemRoutes\)/);
});

test('audit log OpenAPI documents only list and detail read endpoints', () => {
  const source = readSource('src/docs/openapi/audit-log-system.paths.ts');

  assert.match(source, /'\/admin\/audit-logs'/);
  assert.match(source, /'\/admin\/audit-logs\/\{auditLogId\}'/);
  assert.match(source, /summary: 'List admin action audit logs'/);
  assert.match(source, /summary: 'Get admin action audit log'/);
  assert.match(source, /adminId/);
  assert.match(source, /actionType/);
  assert.match(source, /entityType/);
  assert.match(source, /entityId/);
  assert.doesNotMatch(source, /\b(post|patch|put|delete):/);
});
