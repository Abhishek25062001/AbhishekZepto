"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const delivery_realtime_connection_banner_util_1 = require("../utils/delivery-realtime-connection-banner.util");
(0, node_test_1.test)('connection banner hides when socket is connected or idle', () => {
    strict_1.default.equal((0, delivery_realtime_connection_banner_util_1.getDeliveryRealtimeConnectionBannerMessage)('connected', null), null);
    strict_1.default.equal((0, delivery_realtime_connection_banner_util_1.getDeliveryRealtimeConnectionBannerMessage)('idle', null), null);
});
(0, node_test_1.test)('connection banner shows reconnecting message for transient states', () => {
    strict_1.default.equal((0, delivery_realtime_connection_banner_util_1.getDeliveryRealtimeConnectionBannerMessage)('reconnecting', null), 'Reconnecting live updates...');
    strict_1.default.equal((0, delivery_realtime_connection_banner_util_1.getDeliveryRealtimeConnectionBannerMessage)('connecting', null), 'Reconnecting live updates...');
});
(0, node_test_1.test)('connection banner shows failure message when socket has failed', () => {
    strict_1.default.equal((0, delivery_realtime_connection_banner_util_1.getDeliveryRealtimeConnectionBannerMessage)('failed', 'token expired'), 'token expired');
    strict_1.default.equal((0, delivery_realtime_connection_banner_util_1.getDeliveryRealtimeConnectionBannerMessage)('failed', null), 'Live updates unavailable');
});
