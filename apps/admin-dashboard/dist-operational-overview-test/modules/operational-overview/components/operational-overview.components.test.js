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
(0, node_test_1.test)('analytics filter bar exposes only Module 18 supported filters', () => {
    const source = readSource('src/modules/operational-overview/components/AnalyticsFilterBar.tsx');
    for (const field of ['fromDate', 'toDate', 'timezone', 'storeId', 'vendorId', 'cityId']) {
        strict_1.default.match(source, new RegExp(`'${field}'`));
    }
    strict_1.default.doesNotMatch(source, /exportAnalytics|dataExport|download|schedule|builder|forecast|priority|category/i);
});
(0, node_test_1.test)('operational metric grid renders overview summary domains only', () => {
    const source = readSource('src/modules/operational-overview/components/OperationalMetricGrid.tsx');
    strict_1.default.match(source, /Orders/);
    strict_1.default.match(source, /Delivery/);
    strict_1.default.match(source, /Stores/);
    strict_1.default.match(source, /Support/);
    strict_1.default.match(source, /No status activity/);
    strict_1.default.doesNotMatch(source, /apiClient|useMutation|Export|Download|Schedule|Builder/);
});
(0, node_test_1.test)('domain analytics panels use read-only analytics hooks', () => {
    const sources = [
        'OrderAnalyticsPanel.tsx',
        'DeliveryAnalyticsPanel.tsx',
        'StoreAnalyticsPanel.tsx',
        'SupportAnalyticsPanel.tsx',
    ].map((file) => readSource(`src/modules/operational-overview/components/${file}`)).join('\n');
    strict_1.default.match(sources, /useOrderAnalytics\(filters\)/);
    strict_1.default.match(sources, /useDeliveryAnalytics\(filters\)/);
    strict_1.default.match(sources, /useStoreAnalytics\(filters\)/);
    strict_1.default.match(sources, /useSupportAnalytics\(filters\)/);
    strict_1.default.match(sources, /Support Priority/);
    strict_1.default.match(sources, /Support Category/);
    strict_1.default.doesNotMatch(sources, /apiClient|useMutation|Export|Download|Schedule|Builder/);
});
