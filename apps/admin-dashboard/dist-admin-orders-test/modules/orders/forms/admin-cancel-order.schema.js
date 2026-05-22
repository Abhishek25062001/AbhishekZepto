"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCancelOrderSchema = void 0;
const zod_1 = require("zod");
exports.adminCancelOrderSchema = zod_1.z.object({
    reason: zod_1.z.string().trim().min(1).max(500),
});
