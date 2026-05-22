"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorOrderItemQuantitySchema = void 0;
const zod_1 = require("zod");
exports.vendorOrderItemQuantitySchema = zod_1.z.object({
    quantity: zod_1.z.coerce
        .number()
        .int('Quantity must be a whole number.')
        .positive('Quantity must be greater than zero.'),
});
