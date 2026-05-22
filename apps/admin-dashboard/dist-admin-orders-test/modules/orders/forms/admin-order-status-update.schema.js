"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrderStatusUpdateSchema = void 0;
const zod_1 = require("zod");
exports.adminOrderStatusUpdateSchema = zod_1.z.object({
    reason: zod_1.z.string().trim().min(1).max(500).optional(),
    status: zod_1.z.enum(['placed', 'accepted', 'picking', 'packing', 'ready_for_pickup', 'cancelled']),
});
