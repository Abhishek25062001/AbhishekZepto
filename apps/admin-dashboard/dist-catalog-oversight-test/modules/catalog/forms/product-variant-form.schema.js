"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productVariantFormSchema = void 0;
const zod_1 = require("zod");
const catalog_status_constants_1 = require("../constants/catalog-status.constants");
const optionalNullableText = zod_1.z
    .string()
    .trim()
    .transform((value) => (value.length ? value : null))
    .nullable()
    .optional();
const optionalNullableNumber = zod_1.z
    .number()
    .min(0)
    .nullable()
    .optional();
exports.productVariantFormSchema = zod_1.z
    .object({
    barcode: optionalNullableText,
    defaultSellingPrice: optionalNullableNumber,
    heightCm: optionalNullableNumber,
    imageUrl: optionalNullableText,
    isDefault: zod_1.z.boolean().optional(),
    isVisible: zod_1.z.boolean().optional(),
    lengthCm: optionalNullableNumber,
    mrp: zod_1.z.number().min(0, 'MRP cannot be negative.'),
    sku: zod_1.z.string().trim().min(1, 'SKU is required.').max(100),
    status: zod_1.z
        .enum([catalog_status_constants_1.CATALOG_STATUS.ACTIVE, catalog_status_constants_1.CATALOG_STATUS.INACTIVE, catalog_status_constants_1.CATALOG_STATUS.ARCHIVED])
        .optional(),
    unit: zod_1.z.string().trim().min(1, 'Unit is required.').max(50),
    unitValue: zod_1.z.number().positive('Unit value must be greater than zero.'),
    variantName: zod_1.z.string().trim().min(1, 'Variant name is required.').max(200),
    weightInGrams: optionalNullableNumber,
    widthCm: optionalNullableNumber,
})
    .strict();
