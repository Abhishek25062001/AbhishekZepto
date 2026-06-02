"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const source = () => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/operational-overview/api/operational-overview.api.ts'), 'utf8');
(0, node_test_1.test)('operational overview API client uses Module 18 read endpoints only', () => {
    const apiSource = source();
    strict_1.default.match(apiSource, /const BASE = '\/api\/v1\/admin\/analytics'/);
    strict_1.default.match(apiSource, /getAnalytics\('\/overview', filters\)/);
    strict_1.default.match(apiSource, /getAnalytics\('\/orders', filters\)/);
    strict_1.default.match(apiSource, /getAnalytics\('\/delivery', filters\)/);
    strict_1.default.match(apiSource, /getAnalytics\('\/stores', filters\)/);
    strict_1.default.match(apiSource, /getAnalytics\('\/support', filters\)/);
    strict_1.default.doesNotMatch(apiSource, /apiClient\.(post|patch|put|delete)/);
    strict_1.default.doesNotMatch(apiSource, /exportAnalytics|dataExport|download|schedule|builder|forecast/i);
});
(0, node_test_1.test)('buildOperationalAnalyticsParams removes blank optional filters', () => {
    const apiSource = source();
    strict_1.default.match(apiSource, /Object\.entries\(filters\)/);
    strict_1.default.match(apiSource, /value !== undefined && value !== ''/);
    strict_1.default.match(apiSource, /params: buildOperationalAnalyticsParams\(filters\)/);
});
