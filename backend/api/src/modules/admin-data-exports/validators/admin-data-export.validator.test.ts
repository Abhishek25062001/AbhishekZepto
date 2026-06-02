import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { ADMIN_DATA_EXPORT_FORMAT, ADMIN_DATA_EXPORT_STATUS, ADMIN_DATA_EXPORT_TYPE } from '../constants/admin-data-export.constants';
import {
  createAdminDataExportBodyValidator,
  listAdminDataExportsQuerySchema,
} from './admin-data-export.validator';

const readSource = (path: string) => {
  const candidates = [
    resolve(process.cwd(), path),
    resolve(process.cwd(), 'backend/api', path),
  ];
  const sourcePath = candidates.find((candidate) => existsSync(candidate));
  assert.ok(sourcePath, `Expected source path to exist for ${path}`);
  return readFileSync(sourcePath, 'utf8');
};

test('admin data export create validator accepts bounded request metadata', () => {
  const parsed = createAdminDataExportBodyValidator.body.parse({
    exportType: ADMIN_DATA_EXPORT_TYPE.OPERATIONAL_ANALYTICS,
    format: ADMIN_DATA_EXPORT_FORMAT.CSV,
    filters: { fromDate: '2026-01-01' },
    reason: 'Operational review export',
  });

  assert.equal(parsed.exportType, 'operational_analytics');
  assert.equal(parsed.format, 'csv');
});

test('admin data export validators reject unsupported values and inverted dates', () => {
  assert.throws(() => createAdminDataExportBodyValidator.body.parse({
    exportType: 'future_domain',
    format: ADMIN_DATA_EXPORT_FORMAT.CSV,
    reason: 'Bad export request',
  }));
  assert.throws(() => listAdminDataExportsQuerySchema.parse({
    fromDate: '2026-02-01T00:00:00.000Z',
    toDate: '2026-01-01T00:00:00.000Z',
  }), /fromDate must be before or equal to toDate/);
});

test('admin data export list validator accepts documented filters and pagination', () => {
  const parsed = listAdminDataExportsQuerySchema.parse({
    exportType: ADMIN_DATA_EXPORT_TYPE.AUDIT_LOGS,
    format: ADMIN_DATA_EXPORT_FORMAT.JSON,
    status: ADMIN_DATA_EXPORT_STATUS.QUEUED,
    requestedByAdminId: '507f1f77bcf86cd799439011',
    page: '2',
    limit: '25',
  });

  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 25);
});

test('admin data export schema keeps file generation fields nullable', () => {
  const source = readSource('src/modules/admin-data-exports/models/admin-data-export.model.ts');

  assert.match(source, /fileKey: \{ type: String, default: null/);
  assert.match(source, /fileName: \{ type: String, default: null/);
  assert.match(source, /downloadUrl: \{ type: String, default: null/);
  assert.match(source, /expiresAt: \{ type: Date, default: null/);
  assert.doesNotMatch(source, /stream|upload|signedUrl|schedule|retry|cancel|delete/i);
});
