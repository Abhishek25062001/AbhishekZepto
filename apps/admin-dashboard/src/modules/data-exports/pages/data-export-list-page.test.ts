import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

test('data export list page wires Module 20 filters and pagination', () => {
  const pageSource = readSource('src/modules/data-exports/pages/DataExportListPage.tsx');
  const filterSource = readSource('src/modules/data-exports/components/DataExportFilters.tsx');
  const tableSource = readSource('src/modules/data-exports/components/DataExportTable.tsx');

  assert.match(pageSource, /useDataExports\(filters\)/);
  assert.match(pageSource, /<DataExportRequestForm \/>/);
  assert.match(pageSource, /DATA_EXPORT_DEFAULT_FILTERS/);
  assert.match(pageSource, /pagination\.hasPreviousPage/);
  assert.match(pageSource, /pagination\.hasNextPage/);
  assert.match(filterSource, /exportType/);
  assert.match(filterSource, /format/);
  assert.match(filterSource, /status/);
  assert.match(filterSource, /requestedByAdminId/);
  assert.match(filterSource, /fromDate/);
  assert.match(filterSource, /toDate/);
  assert.match(tableSource, /\/exports\/\$\{row\.id\}/);
  assert.doesNotMatch(`${pageSource}\n${filterSource}\n${tableSource}`, /download|signedUrl|retryExport|cancelExport|schedule|deleteExport|generate|storage|email|apiClient\.(patch|put|delete)/i);
});

test('data export hooks expose list query without mutations', () => {
  const hookSource = readSource('src/modules/data-exports/hooks/useDataExports.ts');

  assert.match(hookSource, /all: \['data-exports'\] as const/);
  assert.match(hookSource, /list: \(query: DataExportListQuery\)/);
  assert.match(hookSource, /detail: \(exportId: string\)/);
  assert.match(hookSource, /queryFn: \(\) => listDataExports\(query\)/);
  assert.doesNotMatch(hookSource, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
});
