"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_reject_order_schema_1 = require("./vendor-reject-order.schema");
(0, node_test_1.test)('vendorRejectOrderSchema requires a reason', () => {
    strict_1.default.equal(vendor_reject_order_schema_1.vendorRejectOrderSchema.safeParse({ reason: '   ' }).success, false);
});
(0, node_test_1.test)('vendorRejectOrderSchema trims a valid reason', () => {
    const result = vendor_reject_order_schema_1.vendorRejectOrderSchema.parse({ reason: '  Out of stock  ' });
    strict_1.default.deepEqual(result, { reason: 'Out of stock' });
});
