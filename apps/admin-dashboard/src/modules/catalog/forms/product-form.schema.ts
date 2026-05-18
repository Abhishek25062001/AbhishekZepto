import { z } from 'zod';

import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import {
  FOOD_TYPE,
  PRODUCT_TYPE,
  type FoodType,
  type ProductType,
} from '../constants/product.constants';

const optionalTrimmedId = z
  .string()
  .optional()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  });

const PRODUCT_FORM_TYPES: [ProductType, ...ProductType[]] = [
  PRODUCT_TYPE.SIMPLE,
  PRODUCT_TYPE.BUNDLE_PLACEHOLDER,
];

const FOOD_TYPE_VALUES: [FoodType, ...FoodType[]] = [
  FOOD_TYPE.VEG,
  FOOD_TYPE.NON_VEG,
  FOOD_TYPE.EGG,
  FOOD_TYPE.NOT_APPLICABLE,
];

export const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  shortDescription: z
    .string()
    .max(500)
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  description: z
    .string()
    .max(20_000)
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: optionalTrimmedId,
  brandId: optionalTrimmedId,
  productType: z.enum(PRODUCT_FORM_TYPES),
  foodType: z
    .union([z.enum(FOOD_TYPE_VALUES), z.literal(''), z.undefined()])
    .transform((value) => (value === '' || value === undefined ? undefined : value)),
  taxCategoryId: optionalTrimmedId,
  hsnCode: z
    .string()
    .max(32)
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  searchKeywords: z.array(z.string().min(1)).optional(),
  tags: z.array(z.string().min(1)).optional(),
  defaultImageMediaFileId: optionalTrimmedId,
  defaultImageUrl: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  attributeSummary: z.record(z.string(), z.unknown()).optional(),
  isFeatured: z.boolean(),
  isVisible: z.boolean(),
  status: z.enum([CATALOG_STATUS.ACTIVE, CATALOG_STATUS.INACTIVE, CATALOG_STATUS.ARCHIVED]),
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormSchemaValues = z.output<typeof productFormSchema>;
