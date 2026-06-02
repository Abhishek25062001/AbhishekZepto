"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const catalog_status_constants_1 = require("../constants/catalog-status.constants");
const category_form_schema_1 = require("./category-form.schema");
(0, node_test_1.test)('categoryFormSchema accepts minimal valid payloads', () => {
    const result = category_form_schema_1.categoryFormSchema.safeParse({
        isFeatured: false,
        isVisible: true,
        name: 'Beverages',
        status: catalog_status_constants_1.CATALOG_STATUS.ACTIVE,
    });
    strict_1.default.equal(result.success, true);
});
(0, node_test_1.test)('categoryFormSchema rejects empty names', () => {
    const result = category_form_schema_1.categoryFormSchema.safeParse({
        isFeatured: false,
        isVisible: true,
        name: '',
        status: catalog_status_constants_1.CATALOG_STATUS.ACTIVE,
    });
    strict_1.default.equal(result.success, false);
});
