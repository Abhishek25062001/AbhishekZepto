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
(0, node_test_1.test)('data export dashboard routes are gated by reports export', () => {
    const routesSource = readSource('src/routes/admin.routes.tsx');
    strict_1.default.match(routesSource, /DataExportListPage/);
    strict_1.default.match(routesSource, /DataExportDetailPage/);
    strict_1.default.match(routesSource, /path: '\/exports'/);
    strict_1.default.match(routesSource, /path: '\/exports\/:exportId'/);
    strict_1.default.match(routesSource, /permission="reports:export"/);
    strict_1.default.doesNotMatch(routesSource, /permission="reports:read"[\s\S]{0,120}<DataExport/);
});
(0, node_test_1.test)('data export sidebar navigation is gated by reports export', () => {
    const sidebarSource = readSource('src/components/layout/Sidebar.tsx');
    strict_1.default.match(sidebarSource, /\{ label: 'Exports', to: '\/exports', permission: 'reports:export' \}/);
});
