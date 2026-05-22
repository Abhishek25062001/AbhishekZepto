"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const admin_orders_permissions_util_1 = require("./admin-orders-permissions.util");
(0, node_test_1.test)('admin order read permission controls list and detail visibility', () => {
    strict_1.default.equal((0, admin_orders_permissions_util_1.canReadAdminOrders)(['orders:read']), true);
    strict_1.default.equal((0, admin_orders_permissions_util_1.canReadAdminOrders)(['catalog:read']), false);
});
(0, node_test_1.test)('admin order mutation permissions are separated', () => {
    strict_1.default.equal((0, admin_orders_permissions_util_1.canUpdateAdminOrderStatus)(['orders:update-status']), true);
    strict_1.default.equal((0, admin_orders_permissions_util_1.canUpdateAdminOrderStatus)(['orders:cancel']), false);
    strict_1.default.equal((0, admin_orders_permissions_util_1.canCancelAdminOrder)(['orders:cancel']), true);
    strict_1.default.equal((0, admin_orders_permissions_util_1.canCancelAdminOrder)(['orders:read']), false);
});
(0, node_test_1.test)('wildcard permission can access all admin order operations', () => {
    strict_1.default.equal((0, admin_orders_permissions_util_1.canReadAdminOrders)(['*:*']), true);
    strict_1.default.equal((0, admin_orders_permissions_util_1.canUpdateAdminOrderStatus)(['*:*']), true);
    strict_1.default.equal((0, admin_orders_permissions_util_1.canCancelAdminOrder)(['*:*']), true);
    strict_1.default.equal((0, admin_orders_permissions_util_1.canMonitorAdminOrderSla)(['*:*']), true);
});
