"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUnitFormSchema = void 0;
const zod_1 = require("zod");
const catalog_status_constants_1 = require("../constants/catalog-status.constants");
const product_unit_constants_1 = require("../constants/product-unit.constants");
exports.productUnitFormSchema = zod_1.z.object({
    code: zod_1.z.string().min(1, 'Code is required').max(64),
    name: zod_1.z.string().min(1, 'Name is required').max(200),
    baseUnit: zod_1.z.enum([
        product_unit_constants_1.BASE_UNIT.PIECE,
        product_unit_constants_1.BASE_UNIT.PACK,
        product_unit_constants_1.BASE_UNIT.KG,
        product_unit_constants_1.BASE_UNIT.G,
        product_unit_constants_1.BASE_UNIT.LITRE,
        product_unit_constants_1.BASE_UNIT.ML,
        product_unit_constants_1.BASE_UNIT.DOZEN,
    ]),
    conversionFactor: zod_1.z.coerce
        .number()
        .refine((value) => value > 0, { message: 'Conversion factor must be greater than zero.' }),
    status: zod_1.z.enum([catalog_status_constants_1.CATALOG_STATUS.ACTIVE, catalog_status_constants_1.CATALOG_STATUS.INACTIVE, catalog_status_constants_1.CATALOG_STATUS.ARCHIVED]),
});
