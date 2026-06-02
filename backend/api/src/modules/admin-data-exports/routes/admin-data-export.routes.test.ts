import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { createPermissionCode } from '../../auth/utils/permission-code.util';
import { ADMIN_DATA_EXPORT_PERMISSION_GROUPS } from '../constants/admin-data-export-permissions.constants';

const readSource = (path: string) => {
  const candidates = [
    resolve(process.cwd(), path),
    resolve(process.cwd(), 'backend/api', path),
  ];
  const sourcePath = candidates.find((candidate) => existsSync(candidate));

  assert.ok(sourcePath, `Expected source path to exist for ${path}`);
  return readFileSync(sourcePath, 'utf8');
};

test('admin data export routes expose metadata endpoints gated by reports export', () => {
  const source = readSource('src/modules/admin-data-exports/routes/admin-data-export.routes.ts');

  assert.match(source, /router\.post\(\s*'\/'/);
  assert.match(source, /router\.get\(\s*'\/'/);
  assert.match(source, /router\.get\(\s*'\/:exportId'/);
  assert.match(source, /requireAnyPermission\(ADMIN_DATA_EXPORT_PERMISSION_GROUPS\.EXPORT\)/);
  assert.match(source, /validateRequest\(createAdminDataExportBodyValidator\)/);
  assert.match(source, /validateRequest\(listAdminDataExportsQueryValidator\)/);
  assert.match(source, /validateRequest\(adminDataExportIdParamValidator\)/);
  assert.deepEqual(ADMIN_DATA_EXPORT_PERMISSION_GROUPS.EXPORT, [
    createPermissionCode('reports', 'export'),
  ]);
});

test('admin v1 router mounts data exports below admin authentication', () => {
  const source = readSource('src/routes/v1/admin.routes.ts');

  assert.match(source, /adminDataExportRoutes/);
  assert.match(source, /router\.use\('\/data-exports', authenticate\(\), requireRole\(adminRoles\), adminDataExportRoutes\)/);
});
