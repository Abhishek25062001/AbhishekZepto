"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRejectOrderSchema = void 0;
const zod_1 = require("zod");
exports.vendorRejectOrderSchema = zod_1.z.object({
    reason: zod_1.z.string().trim().min(1, 'Rejection reason is required.').max(500),
});
