"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const catalog_status_constants_1 = require("../constants/catalog-status.constants");
const product_unit_constants_1 = require("../constants/product-unit.constants");
const product_unit_form_schema_1 = require("./product-unit-form.schema");
(0, node_test_1.test)('productUnitFormSchema accepts healthy conversion factors', () => {
    const result = product_unit_form_schema_1.productUnitFormSchema.safeParse({
        baseUnit: product_unit_constants_1.BASE_UNIT.KG,
        code: 'kg-retail',
        conversionFactor: 1,
        name: 'Kilogram',
        status: catalog_status_constants_1.CATALOG_STATUS.ACTIVE,
    });
    strict_1.default.equal(result.success, true);
});
(0, node_test_1.test)('productUnitFormSchema rejects non-positive conversion factors', () => {
    const result = product_unit_form_schema_1.productUnitFormSchema.safeParse({
        baseUnit: product_unit_constants_1.BASE_UNIT.PIECE,
        code: 'bad',
        conversionFactor: 0,
        name: 'Broken',
        status: catalog_status_constants_1.CATALOG_STATUS.ACTIVE,
    });
    strict_1.default.equal(result.success, false);
});
