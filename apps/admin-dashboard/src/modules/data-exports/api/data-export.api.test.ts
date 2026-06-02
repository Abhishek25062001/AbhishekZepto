import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import {
  DATA_EXPORT_FORMATS,
  DATA_EXPORT_STATUSES,
  DATA_EXPORT_TYPES,
} from '../types/data-export.types';

const apiSource = () => readFileSync(
  resolve(process.cwd(), 'src/modules/data-exports/api/data-export.api.ts'),
  'utf8',
);

test('data export API client uses Module 20 create list and detail endpoints only', () => {
  const source = apiSource();

  assert.match(source, /const BASE = '\/api\/v1\/admin\/data-exports'/);
  assert.match(source, /apiClient\.post<ApiSuccessResponse<DataExportRecord>>\(BASE, input\)/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<DataExportListResponse>>\(BASE/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<DataExportRecord>>/);
  assert.match(source, /`\$\{BASE\}\/\$\{exportId\}`/);
  assert.doesNotMatch(source, /apiClient\.(patch|put|delete)/);
  assert.doesNotMatch(source, /download|signedUrl|retry|cancel|schedule|generate|storage|email/i);
});

test('data export query builder removes blank optional filters', () => {
  const source = apiSource();

  assert.match(source, /Object\.entries\(query\)/);
  assert.match(source, /value !== undefined && value !== ''/);
  assert.match(source, /params: buildDataExportParams\(query\)/);
});

test('data export UI types include the Module 20 bounded values', () => {
  assert.deepEqual(DATA_EXPORT_FORMATS, ['csv', 'json']);
  assert.deepEqual(DATA_EXPORT_STATUSES, ['queued', 'completed', 'failed']);
  assert.ok(DATA_EXPORT_TYPES.includes('customers'));
  assert.ok(DATA_EXPORT_TYPES.includes('audit_logs'));
  assert.ok(DATA_EXPORT_TYPES.includes('operational_analytics'));
});
