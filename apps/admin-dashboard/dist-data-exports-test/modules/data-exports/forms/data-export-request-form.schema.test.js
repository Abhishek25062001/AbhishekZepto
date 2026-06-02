"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const data_export_request_form_schema_1 = require("../validators/data-export-request-form.schema");
(0, node_test_1.test)('data export request form schema accepts Module 20 create payload fields', () => {
    const parsed = data_export_request_form_schema_1.dataExportRequestFormSchema.parse({
        exportType: 'customers',
        format: 'csv',
        filtersText: '{"status":"active"}',
        reason: 'Monthly compliance export',
    });
    strict_1.default.equal(parsed.exportType, 'customers');
    strict_1.default.equal(parsed.format, 'csv');
    strict_1.default.equal(parsed.reason, 'Monthly compliance export');
    strict_1.default.deepEqual((0, data_export_request_form_schema_1.parseDataExportFilters)(parsed.filtersText), { status: 'active' });
});
(0, node_test_1.test)('data export request form schema rejects unsupported values and non-object filters', () => {
    strict_1.default.throws(() => data_export_request_form_schema_1.dataExportRequestFormSchema.parse({
        exportType: 'orders',
        format: 'csv',
        filtersText: '{}',
        reason: 'valid reason',
    }));
    strict_1.default.throws(() => data_export_request_form_schema_1.dataExportRequestFormSchema.parse({
        exportType: 'customers',
        format: 'xlsx',
        filtersText: '{}',
        reason: 'valid reason',
    }));
    strict_1.default.throws(() => data_export_request_form_schema_1.dataExportRequestFormSchema.parse({
        exportType: 'customers',
        format: 'csv',
        filtersText: '{}',
        reason: 'no',
    }));
    strict_1.default.throws(() => (0, data_export_request_form_schema_1.parseDataExportFilters)('[]'));
});
(0, node_test_1.test)('data export request form submits queued metadata only', () => {
    const formSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/data-exports/forms/DataExportRequestForm.tsx'), 'utf8');
    const mutationSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/data-exports/hooks/useDataExportMutations.ts'), 'utf8');
    strict_1.default.match(formSource, /useCreateDataExportMutation\(\)/);
    strict_1.default.match(formSource, /exportType: parsed\.data\.exportType/);
    strict_1.default.match(formSource, /format: parsed\.data\.format/);
    strict_1.default.match(formSource, /filters,/);
    strict_1.default.match(formSource, /reason: parsed\.data\.reason/);
    strict_1.default.match(mutationSource, /createDataExport\(payload\)/);
    strict_1.default.match(mutationSource, /invalidateQueries\(\{ queryKey: dataExportQueryKeys\.all \}\)/);
    strict_1.default.doesNotMatch(`${formSource}\n${mutationSource}`, /download|signedUrl|retryExport|cancelExport|schedule|deleteExport|generate|storage|email|apiClient\.(patch|put|delete)/i);
});
