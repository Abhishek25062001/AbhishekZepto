"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorCancelOrderSchema = void 0;
const zod_1 = require("zod");
exports.vendorCancelOrderSchema = zod_1.z.object({
    reason: zod_1.z.string().trim().min(1, 'Cancellation reason is required.').max(500),
});
