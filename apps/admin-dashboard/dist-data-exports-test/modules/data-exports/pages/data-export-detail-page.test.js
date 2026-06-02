"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const readSource = (path) => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), path), 'utf8');
(0, node_test_1.test)('data export detail page renders read-only Module 20 metadata', () => {
    const detailSource = readSource('src/modules/data-exports/pages/DataExportDetailPage.tsx');
    const panelSource = readSource('src/modules/data-exports/components/DataExportMetadataPanel.tsx');
    strict_1.default.match(detailSource, /useDataExportDetail\(exportId\)/);
    strict_1.default.match(detailSource, /<DataExportMetadataPanel dataExport=\{dataExport\} \/>/);
    strict_1.default.match(detailSource, /JSON\.stringify\(dataExport\.filters, null, 2\)/);
    strict_1.default.match(panelSource, /fileKey/);
    strict_1.default.match(panelSource, /fileName/);
    strict_1.default.match(panelSource, /downloadUrl/);
    strict_1.default.match(panelSource, /expiresAt/);
    strict_1.default.match(panelSource, /const nullable = \(value: string \| null\) => value \?\? 'Not available'/);
    strict_1.default.doesNotMatch(`${detailSource}\n${panelSource}`, /<a\s|href=|download=|downloadExport|signedUrl|retryExport|cancelExport|schedule|deleteExport|generate|storage|email|apiClient\.(post|patch|put|delete)/i);
});
(0, node_test_1.test)('data export detail hook uses detail query only', () => {
    const hookSource = readSource('src/modules/data-exports/hooks/useDataExportDetail.ts');
    strict_1.default.match(hookSource, /queryFn: \(\) => getDataExport\(exportId\)/);
    strict_1.default.match(hookSource, /enabled: exportId\.length > 0/);
    strict_1.default.doesNotMatch(hookSource, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
});
