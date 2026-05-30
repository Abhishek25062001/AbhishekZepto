"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const realtime_connection_banner_util_1 = require("../utils/realtime-connection-banner.util");
(0, node_test_1.test)('reconnect banner renders when disconnected during reconnect', () => {
    strict_1.default.equal((0, realtime_connection_banner_util_1.getRealtimeConnectionBannerMessage)({
        connectionError: null,
        connectionState: 'reconnecting',
        socketConnected: false,
    }), 'Connecting...');
});
(0, node_test_1.test)('reconnect banner hides after reconnect', () => {
    strict_1.default.equal((0, realtime_connection_banner_util_1.getRealtimeConnectionBannerMessage)({
        connectionError: null,
        connectionState: 'connected',
        socketConnected: true,
    }), null);
});
