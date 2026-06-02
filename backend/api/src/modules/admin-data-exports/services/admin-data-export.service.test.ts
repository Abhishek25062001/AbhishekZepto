import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { Types } from 'mongoose';

import {
  ADMIN_DATA_EXPORT_FORMAT,
  ADMIN_DATA_EXPORT_STATUS,
  ADMIN_DATA_EXPORT_TYPE,
} from '../constants/admin-data-export.constants';
import type { AdminDataExportRecord } from '../types/admin-data-export.types';
import { mapAdminDataExport } from './admin-data-export.service';

const readSource = (path: string) => {
  const candidates = [
    resolve(process.cwd(), path),
    resolve(process.cwd(), 'backend/api', path),
  ];
  const sourcePath = candidates.find((candidate) => existsSync(candidate));

  assert.ok(sourcePath, `Expected source path to exist for ${path}`);
  return readFileSync(sourcePath, 'utf8');
};

test('mapAdminDataExport returns stable response fields with nullable file metadata', () => {
  const now = new Date('2026-06-02T10:00:00.000Z');
  const record: AdminDataExportRecord = {
    _id: new Types.ObjectId('64f0f0f0f0f0f0f0f0f0f0f0'),
    exportType: ADMIN_DATA_EXPORT_TYPE.CUSTOMERS,
    format: ADMIN_DATA_EXPORT_FORMAT.CSV,
    status: ADMIN_DATA_EXPORT_STATUS.QUEUED,
    filters: { status: 'active' },
    requestedByAdminId: new Types.ObjectId('64f0f0f0f0f0f0f0f0f0f0f1'),
    requestedAt: now,
    completedAt: null,
    failedAt: null,
    failureReason: null,
    fileKey: null,
    fileName: null,
    downloadUrl: null,
    expiresAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const mapped = mapAdminDataExport(record);

  assert.equal(mapped.id, record._id.toString());
  assert.equal(mapped.requestedByAdminId, record.requestedByAdminId.toString());
  assert.equal(mapped.status, ADMIN_DATA_EXPORT_STATUS.QUEUED);
  assert.deepEqual(mapped.filters, { status: 'active' });
  assert.equal(mapped.fileKey, null);
  assert.equal(mapped.fileName, null);
  assert.equal(mapped.downloadUrl, null);
  assert.equal(mapped.expiresAt, null);
});

test('admin data export service audits creation and reports detail misses', () => {
  const source = readSource('src/modules/admin-data-exports/services/admin-data-export.service.ts');

  assert.match(source, /createAdminDataExportRecord/);
  assert.match(source, /writeAdminActionAudit/);
  assert.match(source, /ADMIN_ACTION_TYPE\.ADMIN_DATA_EXPORT_CREATED/);
  assert.match(source, /entityType: 'admin_data_export'/);
  assert.match(source, /ERROR_CODES\.ADMIN_DATA_EXPORT_NOT_FOUND/);
  assert.doesNotMatch(source, /writeFile|createWriteStream|upload|signedUrl|generate/i);
});
