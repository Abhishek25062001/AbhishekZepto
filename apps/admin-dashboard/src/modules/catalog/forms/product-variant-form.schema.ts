import { z } from 'zod';

import { CATALOG_STATUS } from '../constants/catalog-status.constants';

const optionalNullableText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : null))
  .nullable()
  .optional();

const optionalNullableNumber = z
  .number()
  .min(0)
  .nullable()
  .optional();

export const productVariantFormSchema = z
  .object({
    barcode: optionalNullableText,
    defaultSellingPrice: optionalNullableNumber,
    heightCm: optionalNullableNumber,
    imageUrl: optionalNullableText,
    isDefault: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    lengthCm: optionalNullableNumber,
    mrp: z.number().min(0, 'MRP cannot be negative.'),
    sku: z.string().trim().min(1, 'SKU is required.').max(100),
    status: z
      .enum([CATALOG_STATUS.ACTIVE, CATALOG_STATUS.INACTIVE, CATALOG_STATUS.ARCHIVED])
      .optional(),
    unit: z.string().trim().min(1, 'Unit is required.').max(50),
    unitValue: z.number().positive('Unit value must be greater than zero.'),
    variantName: z.string().trim().min(1, 'Variant name is required.').max(200),
    weightInGrams: optionalNullableNumber,
    widthCm: optionalNullableNumber,
  })
  .strict();

export type ProductVariantFormInput = z.input<typeof productVariantFormSchema>;
export type ProductVariantFormSchemaValues = z.output<typeof productVariantFormSchema>;
