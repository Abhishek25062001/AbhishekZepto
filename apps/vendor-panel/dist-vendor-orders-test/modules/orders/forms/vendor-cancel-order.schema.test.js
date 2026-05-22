"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_cancel_order_schema_1 = require("./vendor-cancel-order.schema");
(0, node_test_1.test)('vendorCancelOrderSchema requires a reason', () => {
    strict_1.default.equal(vendor_cancel_order_schema_1.vendorCancelOrderSchema.safeParse({ reason: '' }).success, false);
});
(0, node_test_1.test)('vendorCancelOrderSchema trims a valid reason', () => {
    strict_1.default.equal(vendor_cancel_order_schema_1.vendorCancelOrderSchema.parse({ reason: '  Store stock mismatch  ' }).reason, 'Store stock mismatch');
});
