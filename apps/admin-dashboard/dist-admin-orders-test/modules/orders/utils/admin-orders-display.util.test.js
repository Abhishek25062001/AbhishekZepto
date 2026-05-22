"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const admin_orders_display_util_1 = require("./admin-orders-display.util");
(0, node_test_1.test)('ADMIN_ORDER_STATUS_LABELS includes ready for pickup label', () => {
    strict_1.default.equal(admin_orders_display_util_1.ADMIN_ORDER_STATUS_LABELS.ready_for_pickup, 'Ready for pickup');
});
(0, node_test_1.test)('formatAdminOrderMoney formats INR totals', () => {
    strict_1.default.match((0, admin_orders_display_util_1.formatAdminOrderMoney)(250), /250/);
});
(0, node_test_1.test)('getAdminOrderCancellationReason falls back when absent', () => {
    strict_1.default.equal((0, admin_orders_display_util_1.getAdminOrderCancellationReason)({ cancellationReason: null }), 'No cancellation reason recorded');
});
