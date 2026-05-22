"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const admin_cancel_order_schema_1 = require("./admin-cancel-order.schema");
const admin_order_status_update_schema_1 = require("./admin-order-status-update.schema");
(0, node_test_1.test)('adminCancelOrderSchema requires reason', () => {
    strict_1.default.throws(() => admin_cancel_order_schema_1.adminCancelOrderSchema.parse({ reason: '' }));
    strict_1.default.deepEqual(admin_cancel_order_schema_1.adminCancelOrderSchema.parse({ reason: 'Customer support request' }), {
        reason: 'Customer support request',
    });
});
(0, node_test_1.test)('adminOrderStatusUpdateSchema requires known status', () => {
    strict_1.default.throws(() => admin_order_status_update_schema_1.adminOrderStatusUpdateSchema.parse({ status: 'delivered' }));
    strict_1.default.deepEqual(admin_order_status_update_schema_1.adminOrderStatusUpdateSchema.parse({ status: 'accepted' }), {
        status: 'accepted',
    });
});
