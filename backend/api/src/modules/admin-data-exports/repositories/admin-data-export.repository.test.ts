import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string) => {
  const candidates = [
    resolve(process.cwd(), path),
    resolve(process.cwd(), 'backend/api', path),
  ];
  const sourcePath = candidates.find((candidate) => existsSync(candidate));

  assert.ok(sourcePath, `Expected source path to exist for ${path}`);
  return readFileSync(sourcePath, 'utf8');
};

test('admin data export repository creates queued metadata records only', () => {
  const source = readSource('src/modules/admin-data-exports/repositories/admin-data-export.repository.ts');

  assert.match(source, /AdminDataExportModel\.create/);
  assert.match(source, /status: ADMIN_DATA_EXPORT_STATUS\.QUEUED/);
  assert.match(source, /requestedByAdminId: toObjectId\(requestedByAdminId\)/);
  assert.doesNotMatch(source, /downloadUrl:|fileKey:|fileName:|expiresAt:/);
  assert.doesNotMatch(source, /writeFile|createWriteStream|upload|signedUrl|generate/i);
});

test('admin data export repository supports filtered list and detail lookups', () => {
  const source = readSource('src/modules/admin-data-exports/repositories/admin-data-export.repository.ts');

  assert.match(source, /exportType/);
  assert.match(source, /format/);
  assert.match(source, /status/);
  assert.match(source, /requestedByAdminId/);
  assert.match(source, /requestedAt/);
  assert.match(source, /AdminDataExportModel\.find\(filter\)/);
  assert.match(source, /AdminDataExportModel\.countDocuments\(filter\)/);
  assert.match(source, /AdminDataExportModel\.findById\(exportId\)/);
  assert.match(source, /sort\(\{ requestedAt: -1 \}\)/);
});
