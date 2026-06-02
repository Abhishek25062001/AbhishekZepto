"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productApprovalSchema = void 0;
const zod_1 = require("zod");
const product_constants_1 = require("../constants/product.constants");
exports.productApprovalSchema = zod_1.z
    .object({
    approvalStatus: zod_1.z.enum([
        product_constants_1.PRODUCT_APPROVAL_STATUS.DRAFT,
        product_constants_1.PRODUCT_APPROVAL_STATUS.PENDING_REVIEW,
        product_constants_1.PRODUCT_APPROVAL_STATUS.APPROVED,
        product_constants_1.PRODUCT_APPROVAL_STATUS.REJECTED,
        product_constants_1.PRODUCT_APPROVAL_STATUS.ARCHIVED,
    ]),
    rejectionReason: zod_1.z
        .string()
        .optional()
        .transform((value) => (value === '' ? undefined : value)),
})
    .superRefine((data, context) => {
    if (data.approvalStatus === product_constants_1.PRODUCT_APPROVAL_STATUS.REJECTED) {
        const reason = data.rejectionReason?.trim();
        if (!reason) {
            context.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Rejection reason is required.',
                path: ['rejectionReason'],
            });
        }
    }
});
