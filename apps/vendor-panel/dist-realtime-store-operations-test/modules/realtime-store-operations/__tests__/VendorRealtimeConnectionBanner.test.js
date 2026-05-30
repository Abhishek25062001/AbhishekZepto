"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_realtime_connection_banner_util_1 = require("../utils/vendor-realtime-connection-banner.util");
(0, node_test_1.test)('vendor realtime connection banner shows reconnecting message', () => {
    strict_1.default.equal((0, vendor_realtime_connection_banner_util_1.getVendorRealtimeConnectionBannerMessage)('reconnecting', null), 'Reconnecting live store updates...');
});
(0, node_test_1.test)('vendor realtime connection banner shows failure message', () => {
    strict_1.default.equal((0, vendor_realtime_connection_banner_util_1.getVendorRealtimeConnectionBannerMessage)('failed', 'socket unavailable'), 'socket unavailable');
    strict_1.default.equal((0, vendor_realtime_connection_banner_util_1.getVendorRealtimeConnectionBannerMessage)('failed', null), 'Live store updates unavailable');
});
(0, node_test_1.test)('vendor realtime connection banner hides when connected', () => {
    strict_1.default.equal((0, vendor_realtime_connection_banner_util_1.getVendorRealtimeConnectionBannerMessage)('connected', null), null);
});
