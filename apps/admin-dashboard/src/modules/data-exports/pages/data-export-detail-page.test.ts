import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

test('data export detail page renders read-only Module 20 metadata', () => {
  const detailSource = readSource('src/modules/data-exports/pages/DataExportDetailPage.tsx');
  const panelSource = readSource('src/modules/data-exports/components/DataExportMetadataPanel.tsx');

  assert.match(detailSource, /useDataExportDetail\(exportId\)/);
  assert.match(detailSource, /<DataExportMetadataPanel dataExport=\{dataExport\} \/>/);
  assert.match(detailSource, /JSON\.stringify\(dataExport\.filters, null, 2\)/);
  assert.match(panelSource, /fileKey/);
  assert.match(panelSource, /fileName/);
  assert.match(panelSource, /downloadUrl/);
  assert.match(panelSource, /expiresAt/);
  assert.match(panelSource, /const nullable = \(value: string \| null\) => value \?\? 'Not available'/);
  assert.doesNotMatch(`${detailSource}\n${panelSource}`, /<a\s|href=|download=|downloadExport|signedUrl|retryExport|cancelExport|schedule|deleteExport|generate|storage|email|apiClient\.(post|patch|put|delete)/i);
});

test('data export detail hook uses detail query only', () => {
  const hookSource = readSource('src/modules/data-exports/hooks/useDataExportDetail.ts');

  assert.match(hookSource, /queryFn: \(\) => getDataExport\(exportId\)/);
  assert.match(hookSource, /enabled: exportId\.length > 0/);
  assert.doesNotMatch(hookSource, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
});
