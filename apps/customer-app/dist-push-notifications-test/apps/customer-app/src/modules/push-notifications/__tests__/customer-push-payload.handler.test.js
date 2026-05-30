"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const customer_push_payload_handler_1 = require("../utils/customer-push-payload.handler");
(0, node_test_1.test)('out-for-delivery payload navigates to tracking screen', () => {
    const calls = [];
    const handled = (0, customer_push_payload_handler_1.handleCustomerPushPayload)({ orderId: 'order-1', type: 'order_out_for_delivery' }, { navigate: (screen, params) => calls.push({ screen, params }) });
    strict_1.default.equal(handled, true);
    strict_1.default.deepEqual(calls, [{ screen: 'DeliveryTracking', params: { orderId: 'order-1' } }]);
});
(0, node_test_1.test)('delivered payload navigates to order detail screen', () => {
    const calls = [];
    const handled = (0, customer_push_payload_handler_1.handleCustomerPushPayload)({ orderId: 'order-2', type: 'order_delivered' }, { navigate: (screen, params) => calls.push({ screen, params }) });
    strict_1.default.equal(handled, true);
    strict_1.default.deepEqual(calls, [{ screen: 'OrderDetail', params: { orderId: 'order-2' } }]);
});
(0, node_test_1.test)('malformed customer payload does not crash', () => {
    const calls = [];
    const handled = (0, customer_push_payload_handler_1.handleCustomerPushPayload)({ type: 'order_out_for_delivery' }, { navigate: (screen, params) => calls.push({ screen, params }) });
    strict_1.default.equal(handled, false);
    strict_1.default.deepEqual(calls, []);
});
