import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../../validators/common.validators';
import { FOOD_TYPE_VALUES } from '../../products/constants/food-type.constant';
import { PRODUCT_APPROVAL_STATUS_VALUES } from '../../products/constants/product-approval-status.constant';
import { PRODUCT_STATUS_VALUES } from '../../products/constants/product-status.constant';
import { PRODUCT_TYPE_VALUES } from '../../products/constants/product-type.constant';
import {
  ADMIN_CATALOG_SORT_OPTIONS,
  CUSTOMER_CATALOG_SORT_OPTIONS,
  CATALOG_SORT_OPTIONS,
} from '../constants/catalog-sort.constant';

const searchField = z.string().trim().min(1).max(100).optional();
const priceField = z.coerce.number().min(0).optional();

const priceRangeRefine = (data: { minPrice?: number; maxPrice?: number }) => {
  if (data.minPrice !== undefined && data.maxPrice !== undefined) {
    return data.maxPrice >= data.minPrice;
  }
  return true;
};

export const adminCatalogSearchQueryValidator = paginationValidator
  .extend({
    search: searchField,
    categoryId: mongoObjectIdValidator.optional(),
    subcategoryId: mongoObjectIdValidator.optional(),
    brandId: mongoObjectIdValidator.optional(),
    foodType: z.enum(FOOD_TYPE_VALUES).optional(),
    productType: z.enum(PRODUCT_TYPE_VALUES).optional(),
    approvalStatus: z.enum(PRODUCT_APPROVAL_STATUS_VALUES).optional(),
    status: z.enum(PRODUCT_STATUS_VALUES).optional(),
    isVisible: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
    isFeatured: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
    sortBy: z.enum(ADMIN_CATALOG_SORT_OPTIONS as unknown as [string, ...string[]]).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();

export const vendorCatalogSearchQueryValidator = paginationValidator
  .extend({
    search: searchField,
    categoryId: mongoObjectIdValidator.optional(),
    subcategoryId: mongoObjectIdValidator.optional(),
    brandId: mongoObjectIdValidator.optional(),
    foodType: z.enum(FOOD_TYPE_VALUES).optional(),
    productType: z.enum(PRODUCT_TYPE_VALUES).optional(),
    status: z.enum(PRODUCT_STATUS_VALUES).optional(),
    isVisible: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
    isAvailable: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
    isFeatured: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
    sortBy: z.enum(CATALOG_SORT_OPTIONS as unknown as [string, ...string[]]).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();

const customerCatalogListBaseValidator = paginationValidator
  .extend({
    search: searchField,
    categoryId: mongoObjectIdValidator.optional(),
    subcategoryId: mongoObjectIdValidator.optional(),
    brandId: mongoObjectIdValidator.optional(),
    foodType: z.enum(FOOD_TYPE_VALUES).optional(),
    isFeatured: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
    isAvailable: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
    minPrice: priceField,
    maxPrice: priceField,
    cityId: mongoObjectIdValidator.optional(),
    storeId: mongoObjectIdValidator.optional(),
    sortBy: z.enum(CUSTOMER_CATALOG_SORT_OPTIONS as unknown as [string, ...string[]]).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();

export const customerCatalogListQueryValidator = customerCatalogListBaseValidator.refine(
  priceRangeRefine,
  { message: 'maxPrice must be greater than or equal to minPrice' },
);

export const customerCatalogSearchQueryValidator = customerCatalogListBaseValidator
  .omit({ search: true })
  .extend({
    q: z.string().trim().min(2).max(100),
  })
  .strict()
  .refine(priceRangeRefine, { message: 'maxPrice must be greater than or equal to minPrice' });

export const customerFeaturedQueryValidator = paginationValidator
  .extend({
    categoryId: mongoObjectIdValidator.optional(),
    brandId: mongoObjectIdValidator.optional(),
    cityId: mongoObjectIdValidator.optional(),
    storeId: mongoObjectIdValidator.optional(),
  })
  .strict();

export const customerProductIdParamsValidator = z
  .object({
    productId: mongoObjectIdValidator,
  })
  .strict();

export const customerProductDetailQueryValidator = z
  .object({
    cityId: mongoObjectIdValidator.optional(),
    storeId: mongoObjectIdValidator.optional(),
  })
  .strict();

export const customerCategoryBrowseQueryValidator = paginationValidator
  .extend({
    search: searchField,
    parentCategoryId: z.union([mongoObjectIdValidator, z.literal('null')]).optional(),
    isFeatured: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  })
  .strict();

export const customerBrandBrowseQueryValidator = paginationValidator
  .extend({
    search: searchField,
    isFeatured: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  })
  .strict();

export const customerFacetQueryValidator = z
  .object({
    search: searchField,
    categoryId: mongoObjectIdValidator.optional(),
    subcategoryId: mongoObjectIdValidator.optional(),
    brandId: mongoObjectIdValidator.optional(),
    foodType: z.enum(FOOD_TYPE_VALUES).optional(),
    cityId: mongoObjectIdValidator.optional(),
    storeId: mongoObjectIdValidator.optional(),
  })
  .strict();

export const vendorFacetQueryValidator = z
  .object({
    search: searchField,
    categoryId: mongoObjectIdValidator.optional(),
    subcategoryId: mongoObjectIdValidator.optional(),
    brandId: mongoObjectIdValidator.optional(),
    foodType: z.enum(FOOD_TYPE_VALUES).optional(),
    status: z.enum(PRODUCT_STATUS_VALUES).optional(),
    isAvailable: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  })
  .strict();
