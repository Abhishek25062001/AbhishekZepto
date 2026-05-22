"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_order_item_quantity_schema_1 = require("./vendor-order-item-quantity.schema");
(0, node_test_1.test)('vendorOrderItemQuantitySchema accepts a positive integer quantity', () => {
    strict_1.default.equal(vendor_order_item_quantity_schema_1.vendorOrderItemQuantitySchema.parse({ quantity: '3' }).quantity, 3);
});
(0, node_test_1.test)('vendorOrderItemQuantitySchema rejects zero quantity', () => {
    strict_1.default.equal(vendor_order_item_quantity_schema_1.vendorOrderItemQuantitySchema.safeParse({ quantity: 0 }).success, false);
});
(0, node_test_1.test)('vendorOrderItemQuantitySchema rejects negative quantity', () => {
    strict_1.default.equal(vendor_order_item_quantity_schema_1.vendorOrderItemQuantitySchema.safeParse({ quantity: -1 }).success, false);
});
(0, node_test_1.test)('vendorOrderItemQuantitySchema rejects decimal quantity', () => {
    strict_1.default.equal(vendor_order_item_quantity_schema_1.vendorOrderItemQuantitySchema.safeParse({ quantity: 1.5 }).success, false);
});
