"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const product_constants_1 = require("../constants/product.constants");
const product_approval_schema_1 = require("./product-approval.schema");
(0, node_test_1.test)('productApprovalSchema requires a reason when rejecting', () => {
    const invalid = product_approval_schema_1.productApprovalSchema.safeParse({
        approvalStatus: product_constants_1.PRODUCT_APPROVAL_STATUS.REJECTED,
        rejectionReason: '',
    });
    strict_1.default.equal(invalid.success, false);
});
(0, node_test_1.test)('productApprovalSchema allows omissions for non-rejected states', () => {
    const valid = product_approval_schema_1.productApprovalSchema.safeParse({
        approvalStatus: product_constants_1.PRODUCT_APPROVAL_STATUS.APPROVED,
    });
    strict_1.default.equal(valid.success, true);
});
