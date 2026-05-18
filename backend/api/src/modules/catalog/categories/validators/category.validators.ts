import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../../validators/common.validators';
import { CATEGORY_STATUS_VALUES } from '../constants/category-status.constant';

const categoryStatusValidator = z.enum(CATEGORY_STATUS_VALUES);

const optionalNullableString = z.string().trim().nullable().optional();

export const createCategoryBodyValidator = z
  .object({
    name: z.string().trim().min(2).max(120),
    slug: z.string().trim().min(2).max(120).optional(),
    description: optionalNullableString,
    parentCategoryId: mongoObjectIdValidator.nullable().optional(),
    displayOrder: z.coerce.number().int().min(0).optional(),
    iconUrl: optionalNullableString,
    bannerUrl: optionalNullableString,
    iconMediaFileId: mongoObjectIdValidator.optional(),
    bannerMediaFileId: mongoObjectIdValidator.optional(),
    isFeatured: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    status: categoryStatusValidator.optional(),
  })
  .strict();

export const updateCategoryBodyValidator = createCategoryBodyValidator.partial().strict();

export const categoryIdParamsValidator = z
  .object({
    categoryId: mongoObjectIdValidator,
  })
  .strict();

export const listCategoriesQueryValidator = paginationValidator
  .extend({
    parentCategoryId: z.union([mongoObjectIdValidator, z.literal('null')]).optional(),
    status: categoryStatusValidator.optional(),
    isVisible: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    isFeatured: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['displayOrder', 'name', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
