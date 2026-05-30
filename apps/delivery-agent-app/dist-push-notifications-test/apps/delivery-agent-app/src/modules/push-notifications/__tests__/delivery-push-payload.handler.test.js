"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const delivery_push_payload_handler_1 = require("../utils/delivery-push-payload.handler");
(0, node_test_1.test)('assignment-created payload navigates to active assignment screen', () => {
    const calls = [];
    const handled = (0, delivery_push_payload_handler_1.handleDeliveryPushPayload)({ assignmentId: 'assignment-1', type: 'assignment_created' }, { navigate: (screen, params) => calls.push({ screen, params }) });
    strict_1.default.equal(handled, true);
    strict_1.default.deepEqual(calls, [
        { screen: 'ActiveDelivery', params: { assignmentId: 'assignment-1' } },
    ]);
});
(0, node_test_1.test)('malformed delivery payload falls back to dashboard', () => {
    const calls = [];
    const handled = (0, delivery_push_payload_handler_1.handleDeliveryPushPayload)({ type: 'assignment_created' }, { navigate: (screen, params) => calls.push({ screen, params }) });
    strict_1.default.equal(handled, false);
    strict_1.default.deepEqual(calls, [{ screen: 'DeliveryHome', params: undefined }]);
});
