import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../validators/common.validators';
import { STORE_PRODUCT_BULK_DUPLICATE_MODE_VALUES } from '../constants/store-product-bulk-duplicate-mode.constant';
import { STORE_PRODUCT_DISCOUNT_TYPE_VALUES } from '../constants/store-product-discount-type.constant';
import { STORE_PRODUCT_STATUS_VALUES } from '../constants/store-product-status.constant';

const positiveNumber = z.number().positive();
const nonNegativeNumber = z.number().min(0);

const discountRefine = (
  value: {
    discountType?: (typeof STORE_PRODUCT_DISCOUNT_TYPE_VALUES)[number];
    discountValue?: number;
    sellingPrice?: number;
    mrp?: number;
  },
  context: z.RefinementCtx,
) => {
  if (value.mrp !== undefined && value.sellingPrice !== undefined && value.sellingPrice > value.mrp) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'sellingPrice cannot exceed mrp',
      path: ['sellingPrice'],
    });
  }

  const discountType = value.discountType ?? 'none';

  if (
    (discountType === 'flat' || discountType === 'percentage') &&
    value.discountValue === undefined
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'discountValue is required for flat or percentage discount',
      path: ['discountValue'],
    });
  }

  if (discountType === 'percentage' && value.discountValue !== undefined && value.discountValue > 100) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'percentage discount cannot exceed 100',
      path: ['discountValue'],
    });
  }
};

export const createStoreProductBodyValidator = z
  .object({
    storeId: mongoObjectIdValidator,
    productId: mongoObjectIdValidator,
    variantId: mongoObjectIdValidator,
    storeSku: z.string().trim().min(1).max(120).nullable().optional(),
    mrp: positiveNumber,
    sellingPrice: positiveNumber,
    discountType: z.enum(STORE_PRODUCT_DISCOUNT_TYPE_VALUES).optional(),
    discountValue: nonNegativeNumber.optional(),
    isAvailable: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isPriceLocked: z.boolean().optional(),
    status: z.enum(STORE_PRODUCT_STATUS_VALUES).optional(),
  })
  .strict()
  .superRefine(discountRefine);

export const updateStoreProductBodyValidator = z
  .object({
    storeSku: z.string().trim().min(1).max(120).nullable().optional(),
    mrp: positiveNumber.optional(),
    sellingPrice: positiveNumber.optional(),
    discountType: z.enum(STORE_PRODUCT_DISCOUNT_TYPE_VALUES).optional(),
    discountValue: nonNegativeNumber.optional(),
    isAvailable: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isPriceLocked: z.boolean().optional(),
    status: z.enum(STORE_PRODUCT_STATUS_VALUES).optional(),
  })
  .strict()
  .superRefine(discountRefine);

export const storeProductIdParamsValidator = z
  .object({
    storeProductId: mongoObjectIdValidator,
  })
  .strict();

export const listStoreProductsQueryValidator = paginationValidator
  .extend({
    storeId: mongoObjectIdValidator.optional(),
    vendorId: mongoObjectIdValidator.optional(),
    cityId: mongoObjectIdValidator.optional(),
    productId: mongoObjectIdValidator.optional(),
    variantId: mongoObjectIdValidator.optional(),
    categoryId: mongoObjectIdValidator.optional(),
    brandId: mongoObjectIdValidator.optional(),
    status: z.enum(STORE_PRODUCT_STATUS_VALUES).optional(),
    isAvailable: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    isVisible: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    isFeatured: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'finalPrice', 'sellingPrice']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();

const bulkMapItemValidator = z
  .object({
    productId: mongoObjectIdValidator,
    variantId: mongoObjectIdValidator,
    storeSku: z.string().trim().min(1).max(120).nullable().optional(),
    mrp: positiveNumber,
    sellingPrice: positiveNumber,
    discountType: z.enum(STORE_PRODUCT_DISCOUNT_TYPE_VALUES).optional(),
    discountValue: nonNegativeNumber.optional(),
    isAvailable: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  })
  .strict()
  .superRefine(discountRefine);

export const bulkMapStoreProductsBodyValidator = z
  .object({
    storeId: mongoObjectIdValidator,
    items: z.array(bulkMapItemValidator).min(1),
    duplicateMode: z.enum(STORE_PRODUCT_BULK_DUPLICATE_MODE_VALUES).optional(),
  })
  .strict();

export const bulkUpdateStoreProductPriceBodyValidator = z
  .object({
    storeProductIds: z.array(mongoObjectIdValidator).min(1),
    mrp: positiveNumber.optional(),
    sellingPrice: positiveNumber.optional(),
    discountType: z.enum(STORE_PRODUCT_DISCOUNT_TYPE_VALUES).optional(),
    discountValue: nonNegativeNumber.optional(),
  })
  .strict()
  .superRefine(discountRefine);

export const bulkUpdateStoreProductVisibilityBodyValidator = z
  .object({
    storeProductIds: z.array(mongoObjectIdValidator).min(1),
    isAvailable: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(STORE_PRODUCT_STATUS_VALUES).optional(),
  })
  .strict();

export const vendorUpdateAvailabilityBodyValidator = z
  .object({
    isAvailable: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    status: z.enum(STORE_PRODUCT_STATUS_VALUES).optional(),
  })
  .strict();

export const vendorUpdatePriceBodyValidator = z
  .object({
    mrp: positiveNumber.optional(),
    sellingPrice: positiveNumber.optional(),
    discountType: z.enum(STORE_PRODUCT_DISCOUNT_TYPE_VALUES).optional(),
    discountValue: nonNegativeNumber.optional(),
  })
  .strict()
  .superRefine(discountRefine);
