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
(0, node_test_1.test)('data export list page wires Module 20 filters and pagination', () => {
    const pageSource = readSource('src/modules/data-exports/pages/DataExportListPage.tsx');
    const filterSource = readSource('src/modules/data-exports/components/DataExportFilters.tsx');
    const tableSource = readSource('src/modules/data-exports/components/DataExportTable.tsx');
    strict_1.default.match(pageSource, /useDataExports\(filters\)/);
    strict_1.default.match(pageSource, /<DataExportRequestForm \/>/);
    strict_1.default.match(pageSource, /DATA_EXPORT_DEFAULT_FILTERS/);
    strict_1.default.match(pageSource, /pagination\.hasPreviousPage/);
    strict_1.default.match(pageSource, /pagination\.hasNextPage/);
    strict_1.default.match(filterSource, /exportType/);
    strict_1.default.match(filterSource, /format/);
    strict_1.default.match(filterSource, /status/);
    strict_1.default.match(filterSource, /requestedByAdminId/);
    strict_1.default.match(filterSource, /fromDate/);
    strict_1.default.match(filterSource, /toDate/);
    strict_1.default.match(tableSource, /\/exports\/\$\{row\.id\}/);
    strict_1.default.doesNotMatch(`${pageSource}\n${filterSource}\n${tableSource}`, /download|signedUrl|retryExport|cancelExport|schedule|deleteExport|generate|storage|email|apiClient\.(patch|put|delete)/i);
});
(0, node_test_1.test)('data export hooks expose list query without mutations', () => {
    const hookSource = readSource('src/modules/data-exports/hooks/useDataExports.ts');
    strict_1.default.match(hookSource, /all: \['data-exports'\] as const/);
    strict_1.default.match(hookSource, /list: \(query: DataExportListQuery\)/);
    strict_1.default.match(hookSource, /detail: \(exportId: string\)/);
    strict_1.default.match(hookSource, /queryFn: \(\) => listDataExports\(query\)/);
    strict_1.default.doesNotMatch(hookSource, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
});
