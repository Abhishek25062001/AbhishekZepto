"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const admin_orders_workflow_util_1 = require("./admin-orders-workflow.util");
(0, node_test_1.test)('getNextAdminOrderStatuses follows backend transition order', () => {
    strict_1.default.deepEqual((0, admin_orders_workflow_util_1.getNextAdminOrderStatuses)('placed'), ['accepted']);
    strict_1.default.deepEqual((0, admin_orders_workflow_util_1.getNextAdminOrderStatuses)('packing'), ['ready_for_pickup']);
    strict_1.default.deepEqual((0, admin_orders_workflow_util_1.getNextAdminOrderStatuses)('ready_for_pickup'), []);
});
(0, node_test_1.test)('admin cancellation action is hidden after cutoff states', () => {
    strict_1.default.equal((0, admin_orders_workflow_util_1.canShowAdminCancellationAction)({ orderStatus: 'packing' }), true);
    strict_1.default.equal((0, admin_orders_workflow_util_1.canShowAdminCancellationAction)({ orderStatus: 'ready_for_pickup' }), false);
    strict_1.default.equal((0, admin_orders_workflow_util_1.canShowAdminCancellationAction)({ orderStatus: 'cancelled' }), false);
});
(0, node_test_1.test)('admin status update action is hidden for terminal states', () => {
    strict_1.default.equal((0, admin_orders_workflow_util_1.canShowAdminStatusUpdateAction)({ orderStatus: 'accepted' }), true);
    strict_1.default.equal((0, admin_orders_workflow_util_1.canShowAdminStatusUpdateAction)({ orderStatus: 'cancelled' }), false);
});
