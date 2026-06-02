"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandFormSchema = void 0;
const zod_1 = require("zod");
const catalog_status_constants_1 = require("../constants/catalog-status.constants");
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
exports.brandFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(200),
    description: zod_1.z
        .string()
        .max(5000)
        .optional()
        .transform((value) => (value === '' ? undefined : value)),
    logoMediaFileId: optionalTrimmedId,
    bannerMediaFileId: optionalTrimmedId,
    logoUrl: zod_1.z
        .string()
        .optional()
        .transform((value) => (value === '' ? undefined : value)),
    bannerUrl: zod_1.z
        .string()
        .optional()
        .transform((value) => (value === '' ? undefined : value)),
    isFeatured: zod_1.z.boolean(),
    isVisible: zod_1.z.boolean(),
    status: zod_1.z.enum([catalog_status_constants_1.CATALOG_STATUS.ACTIVE, catalog_status_constants_1.CATALOG_STATUS.INACTIVE, catalog_status_constants_1.CATALOG_STATUS.ARCHIVED]),
});
