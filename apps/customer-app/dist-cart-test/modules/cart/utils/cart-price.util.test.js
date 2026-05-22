"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const cart_price_util_1 = require("./cart-price.util");
(0, node_test_1.test)('formatCartLineTotal formats amount as rupees', () => {
    strict_1.default.equal((0, cart_price_util_1.formatCartLineTotal)(99), '₹99.00');
});
(0, node_test_1.test)('formatCartGrandTotal formats zero', () => {
    strict_1.default.equal((0, cart_price_util_1.formatCartGrandTotal)(0), '₹0.00');
});
