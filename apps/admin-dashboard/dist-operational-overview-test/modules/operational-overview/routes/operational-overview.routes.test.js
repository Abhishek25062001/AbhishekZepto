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
(0, node_test_1.test)('operational overview route is gated by reports read permission', () => {
    const routesSource = readSource('src/routes/admin.routes.tsx');
    strict_1.default.match(routesSource, /path: '\/analytics'/);
    strict_1.default.match(routesSource, /permission="reports:read"/);
    strict_1.default.match(routesSource, /<OperationalOverviewPage \/>/);
});
(0, node_test_1.test)('operational overview sidebar link is gated by reports read permission', () => {
    const sidebarSource = readSource('src/components/layout/Sidebar.tsx');
    strict_1.default.match(sidebarSource, /\{ label: 'Analytics', to: '\/analytics', permission: 'reports:read' \}/);
});
(0, node_test_1.test)('operational overview page shell avoids data and mutation workflows', () => {
    const pageSource = readSource('src/pages/analytics/OperationalOverviewPage.tsx');
    strict_1.default.match(pageSource, /Operational Overview/);
    strict_1.default.match(pageSource, /useOperationalOverview\(queryFilters\)/);
    strict_1.default.match(pageSource, /AnalyticsFilterBar/);
    strict_1.default.match(pageSource, /OperationalMetricGrid/);
    strict_1.default.match(pageSource, /OrderAnalyticsPanel/);
    strict_1.default.match(pageSource, /DeliveryAnalyticsPanel/);
    strict_1.default.match(pageSource, /StoreAnalyticsPanel/);
    strict_1.default.match(pageSource, /SupportAnalyticsPanel/);
    strict_1.default.match(pageSource, /No operational activity/);
    strict_1.default.doesNotMatch(pageSource, /apiClient|useMutation|Export|Download|Schedule|Builder/);
});
