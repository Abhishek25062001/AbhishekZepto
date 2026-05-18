import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../../validators/common.validators';
import { FOOD_TYPE_VALUES } from '../constants/food-type.constant';
import { PRODUCT_APPROVAL_STATUS_VALUES } from '../constants/product-approval-status.constant';
import { PRODUCT_STATUS_VALUES } from '../constants/product-status.constant';
import { PRODUCT_TYPE_VALUES } from '../constants/product-type.constant';

const optionalNullableString = z.string().trim().nullable().optional();

const productBodyFields = {
  name: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).optional(),
  description: optionalNullableString,
  shortDescription: optionalNullableString,
  categoryId: mongoObjectIdValidator,
  subcategoryId: mongoObjectIdValidator.nullable().optional(),
  brandId: mongoObjectIdValidator.nullable().optional(),
  productType: z.enum(PRODUCT_TYPE_VALUES),
  foodType: z.enum(FOOD_TYPE_VALUES).nullable().optional(),
  taxCategoryId: mongoObjectIdValidator.nullable().optional(),
  hsnCode: optionalNullableString,
  searchKeywords: z.array(z.string().trim()).optional(),
  tags: z.array(z.string().trim()).optional(),
  defaultImageUrl: optionalNullableString,
  defaultImageMediaFileId: mongoObjectIdValidator.optional(),
  imageUrls: z.array(z.string().trim()).optional(),
  attributeSummary: z.record(z.unknown()).nullable().optional(),
  isFeatured: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  status: z.enum(PRODUCT_STATUS_VALUES).optional(),
};

export const createProductBodyValidator = z.object(productBodyFields).strict();

export const updateProductBodyValidator = createProductBodyValidator.partial().strict();

export const productIdParamsValidator = z
  .object({
    productId: mongoObjectIdValidator,
  })
  .strict();

export const listProductsQueryValidator = paginationValidator
  .extend({
    categoryId: mongoObjectIdValidator.optional(),
    subcategoryId: mongoObjectIdValidator.optional(),
    brandId: mongoObjectIdValidator.optional(),
    approvalStatus: z.enum(PRODUCT_APPROVAL_STATUS_VALUES).optional(),
    status: z.enum(PRODUCT_STATUS_VALUES).optional(),
    isVisible: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    isFeatured: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    foodType: z.enum(FOOD_TYPE_VALUES).optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();

export const updateProductApprovalBodyValidator = z
  .object({
    approvalStatus: z.enum(PRODUCT_APPROVAL_STATUS_VALUES),
    rejectionReason: optionalNullableString,
  })
  .strict()
  .superRefine((value, context) => {
    if (value.approvalStatus === 'rejected' && !value.rejectionReason?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'rejectionReason is required when approvalStatus is rejected',
        path: ['rejectionReason'],
      });
    }
  });
