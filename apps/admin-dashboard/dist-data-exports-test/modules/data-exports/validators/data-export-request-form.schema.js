"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDataExportFilters = exports.dataExportRequestFormSchema = void 0;
const zod_1 = require("zod");
const data_export_types_1 = require("../types/data-export.types");
exports.dataExportRequestFormSchema = zod_1.z.object({
    exportType: zod_1.z.enum(data_export_types_1.DATA_EXPORT_TYPES),
    format: zod_1.z.enum(data_export_types_1.DATA_EXPORT_FORMATS),
    filtersText: zod_1.z.string().trim().default('{}'),
    reason: zod_1.z.string().trim().min(5).max(500),
});
const parseDataExportFilters = (filtersText) => {
    const trimmed = filtersText.trim();
    if (!trimmed)
        return {};
    const parsed = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Filters must be a JSON object.');
    }
    return parsed;
};
exports.parseDataExportFilters = parseDataExportFilters;
