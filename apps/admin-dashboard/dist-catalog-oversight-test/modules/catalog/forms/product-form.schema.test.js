"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const catalog_status_constants_1 = require("../constants/catalog-status.constants");
const product_constants_1 = require("../constants/product.constants");
const product_form_schema_1 = require("./product-form.schema");
(0, node_test_1.test)('productFormSchema enforces taxonomy fields', () => {
    const result = product_form_schema_1.productFormSchema.safeParse({
        categoryId: 'cat-1',
        isFeatured: false,
        isVisible: true,
        name: 'Sparkling water',
        productType: product_constants_1.PRODUCT_TYPE.SIMPLE,
        status: catalog_status_constants_1.CATALOG_STATUS.ACTIVE,
    });
    strict_1.default.equal(result.success, true);
});
(0, node_test_1.test)('productFormSchema rejects simple/bundle placeholder mismatch', () => {
    const result = product_form_schema_1.productFormSchema.safeParse({
        categoryId: 'cat-1',
        isFeatured: false,
        isVisible: true,
        name: 'Invalid',
        productType: 'variant',
        status: catalog_status_constants_1.CATALOG_STATUS.ACTIVE,
    });
    strict_1.default.equal(result.success, false);
});
(0, node_test_1.test)('productFormSchema allows optional food type to be blank', () => {
    const result = product_form_schema_1.productFormSchema.safeParse({
        categoryId: 'cat-1',
        foodType: '',
        isFeatured: false,
        isVisible: true,
        name: 'Still water',
        productType: product_constants_1.PRODUCT_TYPE.BUNDLE_PLACEHOLDER,
        status: catalog_status_constants_1.CATALOG_STATUS.ACTIVE,
    });
    strict_1.default.equal(result.success, true);
    if (result.success) {
        strict_1.default.equal(result.data.foodType, undefined);
    }
});
