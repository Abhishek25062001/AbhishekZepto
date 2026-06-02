"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const useOperationalAnalyticsFilters_1 = require("./useOperationalAnalyticsFilters");
const hooksSource = () => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/operational-overview/hooks/useOperationalOverview.ts'), 'utf8');
(0, node_test_1.test)('operational analytics filter helpers keep only supported non-empty filters', () => {
    strict_1.default.deepEqual(useOperationalAnalyticsFilters_1.OPERATIONAL_ANALYTICS_DEFAULT_FILTERS, { timezone: 'UTC' });
    strict_1.default.deepEqual((0, useOperationalAnalyticsFilters_1.cleanOperationalAnalyticsFilters)({
        fromDate: '2026-01-01',
        toDate: '',
        timezone: 'Asia/Kolkata',
        storeId: undefined,
        vendorId: '507f1f77bcf86cd799439011',
        cityId: '',
    }), {
        fromDate: '2026-01-01',
        timezone: 'Asia/Kolkata',
        vendorId: '507f1f77bcf86cd799439011',
    });
});
(0, node_test_1.test)('mergeOperationalAnalyticsFilters preserves bounded filter keys', () => {
    strict_1.default.deepEqual((0, useOperationalAnalyticsFilters_1.mergeOperationalAnalyticsFilters)({ timezone: 'UTC', storeId: '507f1f77bcf86cd799439011' }, { timezone: 'Asia/Kolkata', storeId: '' }), { timezone: 'Asia/Kolkata' });
});
(0, node_test_1.test)('operational overview hooks expose read-only analytics queries', () => {
    const source = hooksSource();
    strict_1.default.match(source, /all: \['operational-overview'\] as const/);
    strict_1.default.match(source, /queryFn: \(\) => getOperationalOverview\(filters\)/);
    strict_1.default.match(source, /queryFn: \(\) => getOrderAnalytics\(filters\)/);
    strict_1.default.match(source, /queryFn: \(\) => getDeliveryAnalytics\(filters\)/);
    strict_1.default.match(source, /queryFn: \(\) => getStoreAnalytics\(filters\)/);
    strict_1.default.match(source, /queryFn: \(\) => getSupportAnalytics\(filters\)/);
    strict_1.default.doesNotMatch(source, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
    strict_1.default.doesNotMatch(source, /poll|interval|realtime|schedule|exportAnalytics|dataExport|download/i);
});
