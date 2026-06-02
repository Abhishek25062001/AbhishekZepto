"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFormSchema = void 0;
const zod_1 = require("zod");
const catalog_status_constants_1 = require("../constants/catalog-status.constants");
const product_constants_1 = require("../constants/product.constants");
const optionalTrimmedId = zod_1.z
    .string()
    .optional()
    .transform((value) => {
    if (value === undefined) {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
});
const PRODUCT_FORM_TYPES = [
    product_constants_1.PRODUCT_TYPE.SIMPLE,
    product_constants_1.PRODUCT_TYPE.BUNDLE_PLACEHOLDER,
];
const FOOD_TYPE_VALUES = [
    product_constants_1.FOOD_TYPE.VEG,
    product_constants_1.FOOD_TYPE.NON_VEG,
    product_constants_1.FOOD_TYPE.EGG,
    product_constants_1.FOOD_TYPE.NOT_APPLICABLE,
];
exports.productFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(200),
    shortDescription: zod_1.z
        .string()
        .max(500)
        .optional()
        .transform((value) => (value === '' ? undefined : value)),
    description: zod_1.z
        .string()
        .max(20_000)
        .optional()
        .transform((value) => (value === '' ? undefined : value)),
    categoryId: zod_1.z.string().min(1, 'Category is required'),
    subcategoryId: optionalTrimmedId,
    brandId: optionalTrimmedId,
    productType: zod_1.z.enum(PRODUCT_FORM_TYPES),
    foodType: zod_1.z
        .union([zod_1.z.enum(FOOD_TYPE_VALUES), zod_1.z.literal(''), zod_1.z.undefined()])
        .transform((value) => (value === '' || value === undefined ? undefined : value)),
    taxCategoryId: optionalTrimmedId,
    hsnCode: zod_1.z
        .string()
        .max(32)
        .optional()
        .transform((value) => (value === '' ? undefined : value)),
    searchKeywords: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    tags: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    defaultImageMediaFileId: optionalTrimmedId,
    defaultImageUrl: zod_1.z
        .string()
        .optional()
        .transform((value) => (value === '' ? undefined : value)),
    attributeSummary: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    isFeatured: zod_1.z.boolean(),
    isVisible: zod_1.z.boolean(),
    status: zod_1.z.enum([catalog_status_constants_1.CATALOG_STATUS.ACTIVE, catalog_status_constants_1.CATALOG_STATUS.INACTIVE, catalog_status_constants_1.CATALOG_STATUS.ARCHIVED]),
});
