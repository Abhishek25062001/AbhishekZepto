import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../../validators/common.validators';
import { BRAND_STATUS_VALUES } from '../constants/brand-status.constant';

const brandStatusValidator = z.enum(BRAND_STATUS_VALUES);
const optionalNullableString = z.string().trim().nullable().optional();

export const createBrandBodyValidator = z
  .object({
    name: z.string().trim().min(2).max(120),
    slug: z.string().trim().min(2).max(120).optional(),
    description: optionalNullableString,
    logoUrl: optionalNullableString,
    bannerUrl: optionalNullableString,
    logoMediaFileId: mongoObjectIdValidator.optional(),
    bannerMediaFileId: mongoObjectIdValidator.optional(),
    isFeatured: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    status: brandStatusValidator.optional(),
  })
  .strict();

export const updateBrandBodyValidator = createBrandBodyValidator.partial().strict();

export const brandIdParamsValidator = z
  .object({
    brandId: mongoObjectIdValidator,
  })
  .strict();

export const listBrandsQueryValidator = paginationValidator
  .extend({
    status: brandStatusValidator.optional(),
    isVisible: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    isFeatured: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
