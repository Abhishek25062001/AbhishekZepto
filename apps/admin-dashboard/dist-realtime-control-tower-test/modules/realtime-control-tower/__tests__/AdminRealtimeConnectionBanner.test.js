"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const admin_realtime_connection_banner_util_1 = require("../utils/admin-realtime-connection-banner.util");
(0, node_test_1.default)('connection banner hides when socket is connected', () => {
    strict_1.default.equal((0, admin_realtime_connection_banner_util_1.getAdminRealtimeConnectionBannerMessage)('connected', null), null);
});
(0, node_test_1.default)('connection banner shows reconnecting message for transient states', () => {
    strict_1.default.equal((0, admin_realtime_connection_banner_util_1.getAdminRealtimeConnectionBannerMessage)('reconnecting', null), 'Reconnecting live control tower...');
});
(0, node_test_1.default)('connection banner shows failure details', () => {
    strict_1.default.equal((0, admin_realtime_connection_banner_util_1.getAdminRealtimeConnectionBannerMessage)('failed', 'socket unavailable'), 'socket unavailable');
});
