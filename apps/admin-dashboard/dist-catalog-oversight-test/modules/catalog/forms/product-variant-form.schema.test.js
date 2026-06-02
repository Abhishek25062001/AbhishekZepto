"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const catalog_status_constants_1 = require("../constants/catalog-status.constants");
const product_variant_form_schema_1 = require("./product-variant-form.schema");
(0, node_test_1.test)('productVariantFormSchema accepts a valid variant payload', () => {
    const parsed = product_variant_form_schema_1.productVariantFormSchema.parse({
        barcode: '',
        defaultSellingPrice: 95,
        heightCm: null,
        imageUrl: '',
        isDefault: true,
        isVisible: true,
        lengthCm: null,
        mrp: 100,
        sku: 'SKU-001',
        status: catalog_status_constants_1.CATALOG_STATUS.ACTIVE,
        unit: 'piece',
        unitValue: 1,
        variantName: 'Single pack',
        weightInGrams: 250,
        widthCm: null,
    });
    strict_1.default.equal(parsed.barcode, null);
    strict_1.default.equal(parsed.imageUrl, null);
    strict_1.default.equal(parsed.variantName, 'Single pack');
});
(0, node_test_1.test)('productVariantFormSchema rejects negative prices and empty names', () => {
    const parsed = product_variant_form_schema_1.productVariantFormSchema.safeParse({
        mrp: -1,
        sku: '',
        unit: '',
        unitValue: 0,
        variantName: '',
    });
    strict_1.default.equal(parsed.success, false);
});
