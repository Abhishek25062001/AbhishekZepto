import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import {
  dataExportRequestFormSchema,
  parseDataExportFilters,
} from '../validators/data-export-request-form.schema';

test('data export request form schema accepts Module 20 create payload fields', () => {
  const parsed = dataExportRequestFormSchema.parse({
    exportType: 'customers',
    format: 'csv',
    filtersText: '{"status":"active"}',
    reason: 'Monthly compliance export',
  });

  assert.equal(parsed.exportType, 'customers');
  assert.equal(parsed.format, 'csv');
  assert.equal(parsed.reason, 'Monthly compliance export');
  assert.deepEqual(parseDataExportFilters(parsed.filtersText), { status: 'active' });
});

test('data export request form schema rejects unsupported values and non-object filters', () => {
  assert.throws(() => dataExportRequestFormSchema.parse({
    exportType: 'orders',
    format: 'csv',
    filtersText: '{}',
    reason: 'valid reason',
  }));
  assert.throws(() => dataExportRequestFormSchema.parse({
    exportType: 'customers',
    format: 'xlsx',
    filtersText: '{}',
    reason: 'valid reason',
  }));
  assert.throws(() => dataExportRequestFormSchema.parse({
    exportType: 'customers',
    format: 'csv',
    filtersText: '{}',
    reason: 'no',
  }));
  assert.throws(() => parseDataExportFilters('[]'));
});

test('data export request form submits queued metadata only', () => {
  const formSource = readFileSync(
    resolve(process.cwd(), 'src/modules/data-exports/forms/DataExportRequestForm.tsx'),
    'utf8',
  );
  const mutationSource = readFileSync(
    resolve(process.cwd(), 'src/modules/data-exports/hooks/useDataExportMutations.ts'),
    'utf8',
  );

  assert.match(formSource, /useCreateDataExportMutation\(\)/);
  assert.match(formSource, /exportType: parsed\.data\.exportType/);
  assert.match(formSource, /format: parsed\.data\.format/);
  assert.match(formSource, /filters,/);
  assert.match(formSource, /reason: parsed\.data\.reason/);
  assert.match(mutationSource, /createDataExport\(payload\)/);
  assert.match(mutationSource, /invalidateQueries\(\{ queryKey: dataExportQueryKeys\.all \}\)/);
  assert.doesNotMatch(`${formSource}\n${mutationSource}`, /download|signedUrl|retryExport|cancelExport|schedule|deleteExport|generate|storage|email|apiClient\.(patch|put|delete)/i);
});
