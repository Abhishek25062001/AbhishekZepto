"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const catalog_status_constants_1 = require("../constants/catalog-status.constants");
const brand_form_schema_1 = require("./brand-form.schema");
(0, node_test_1.test)('brandFormSchema validates core merchandising fields', () => {
    const result = brand_form_schema_1.brandFormSchema.safeParse({
        isFeatured: true,
        isVisible: true,
        name: 'Acme',
        status: catalog_status_constants_1.CATALOG_STATUS.ACTIVE,
    });
    strict_1.default.equal(result.success, true);
});
(0, node_test_1.test)('brandFormSchema enforces enumerated status values', () => {
    const result = brand_form_schema_1.brandFormSchema.safeParse({
        isFeatured: false,
        isVisible: true,
        name: 'Acme',
        status: 'retired',
    });
    strict_1.default.equal(result.success, false);
});
