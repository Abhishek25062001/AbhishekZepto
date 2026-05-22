"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const order_lifecycle_display_util_1 = require("./order-lifecycle-display.util");
(0, node_test_1.test)('getCustomerTimelineEventLabel maps timeline status to customer-safe labels', () => {
    strict_1.default.equal((0, order_lifecycle_display_util_1.getCustomerTimelineEventLabel)({ toStatus: 'accepted' }), 'Store accepted');
    strict_1.default.equal((0, order_lifecycle_display_util_1.getCustomerTimelineEventLabel)({ toStatus: 'ready_for_pickup' }), 'Ready for pickup');
    strict_1.default.equal((0, order_lifecycle_display_util_1.getCustomerTimelineEventLabel)({ toStatus: 'cancelled' }), 'Cancelled');
});
(0, node_test_1.test)('getCustomerTimelineEventLabel falls back without status', () => {
    strict_1.default.equal((0, order_lifecycle_display_util_1.getCustomerTimelineEventLabel)({ toStatus: null }), 'Order update');
});
(0, node_test_1.test)('getCustomerTimelineEventReason trims optional reason', () => {
    strict_1.default.equal((0, order_lifecycle_display_util_1.getCustomerTimelineEventReason)({ reason: ' Changed plans ' }), 'Changed plans');
    strict_1.default.equal((0, order_lifecycle_display_util_1.getCustomerTimelineEventReason)({ reason: '   ' }), null);
    strict_1.default.equal((0, order_lifecycle_display_util_1.getCustomerTimelineEventReason)({ reason: null }), null);
});
