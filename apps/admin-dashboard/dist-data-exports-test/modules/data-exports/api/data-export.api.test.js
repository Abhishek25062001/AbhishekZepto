"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const data_export_types_1 = require("../types/data-export.types");
const apiSource = () => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/data-exports/api/data-export.api.ts'), 'utf8');
(0, node_test_1.test)('data export API client uses Module 20 create list and detail endpoints only', () => {
    const source = apiSource();
    strict_1.default.match(source, /const BASE = '\/api\/v1\/admin\/data-exports'/);
    strict_1.default.match(source, /apiClient\.post<ApiSuccessResponse<DataExportRecord>>\(BASE, input\)/);
    strict_1.default.match(source, /apiClient\.get<ApiSuccessResponse<DataExportListResponse>>\(BASE/);
    strict_1.default.match(source, /apiClient\.get<ApiSuccessResponse<DataExportRecord>>/);
    strict_1.default.match(source, /`\$\{BASE\}\/\$\{exportId\}`/);
    strict_1.default.doesNotMatch(source, /apiClient\.(patch|put|delete)/);
    strict_1.default.doesNotMatch(source, /download|signedUrl|retry|cancel|schedule|generate|storage|email/i);
});
(0, node_test_1.test)('data export query builder removes blank optional filters', () => {
    const source = apiSource();
    strict_1.default.match(source, /Object\.entries\(query\)/);
    strict_1.default.match(source, /value !== undefined && value !== ''/);
    strict_1.default.match(source, /params: buildDataExportParams\(query\)/);
});
(0, node_test_1.test)('data export UI types include the Module 20 bounded values', () => {
    strict_1.default.deepEqual(data_export_types_1.DATA_EXPORT_FORMATS, ['csv', 'json']);
    strict_1.default.deepEqual(data_export_types_1.DATA_EXPORT_STATUSES, ['queued', 'completed', 'failed']);
    strict_1.default.ok(data_export_types_1.DATA_EXPORT_TYPES.includes('customers'));
    strict_1.default.ok(data_export_types_1.DATA_EXPORT_TYPES.includes('audit_logs'));
    strict_1.default.ok(data_export_types_1.DATA_EXPORT_TYPES.includes('operational_analytics'));
});
