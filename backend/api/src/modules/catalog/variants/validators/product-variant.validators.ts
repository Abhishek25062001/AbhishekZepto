import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../../validators/common.validators';
import { VARIANT_STATUS_VALUES } from '../constants/variant-status.constant';

const optionalNullableString = z.string().trim().nullable().optional();

const positiveNumber = z.number().positive();
const nonNegativeNumber = z.number().min(0);

const variantBodyFields = {
  variantName: z.string().trim().min(1).max(200),
  sku: z.string().trim().min(1).max(100),
  barcode: optionalNullableString,
  unit: z.string().trim().min(1).max(50),
  unitValue: positiveNumber,
  mrp: nonNegativeNumber,
  defaultSellingPrice: nonNegativeNumber.nullable().optional(),
  weightInGrams: nonNegativeNumber.nullable().optional(),
  lengthCm: nonNegativeNumber.nullable().optional(),
  widthCm: nonNegativeNumber.nullable().optional(),
  heightCm: nonNegativeNumber.nullable().optional(),
  imageUrl: optionalNullableString,
  imageMediaFileId: mongoObjectIdValidator.optional(),
  attributeValues: z.record(z.unknown()).nullable().optional(),
  isDefault: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  status: z.enum(VARIANT_STATUS_VALUES).optional(),
};

export const createProductVariantBodyValidator = z.object(variantBodyFields).strict();

export const updateProductVariantBodyValidator = createProductVariantBodyValidator.partial().strict();

export const productIdParamsValidator = z
  .object({
    productId: mongoObjectIdValidator,
  })
  .strict();

export const productVariantParamsValidator = z
  .object({
    productId: mongoObjectIdValidator,
    variantId: mongoObjectIdValidator,
  })
  .strict();

export const listProductVariantsQueryValidator = paginationValidator
  .extend({
    status: z.enum(VARIANT_STATUS_VALUES).optional(),
    isVisible: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    isDefault: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'variantName', 'mrp']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
