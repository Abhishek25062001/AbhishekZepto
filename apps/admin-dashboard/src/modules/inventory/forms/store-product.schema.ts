import { z } from 'zod';
import { DISCOUNT_TYPE, STORE_PRODUCT_STATUS } from '../constants/store-product.constants';

export const storeProductFormSchema = z
  .object({
    storeId: z.string().min(1, 'Store is required'),
    productId: z.string().min(1, 'Product is required'),
    variantId: z.string().min(1, 'Variant is required'),
    storeSku: z.string().optional().nullable(),
    mrp: z.coerce.number().nonnegative(),
    sellingPrice: z.coerce.number().nonnegative(),
    discountType: z.enum([DISCOUNT_TYPE.NONE, DISCOUNT_TYPE.FLAT, DISCOUNT_TYPE.PERCENTAGE]),
    discountValue: z.coerce.number().nonnegative().optional().default(0),
    taxCategoryId: z.string().optional().nullable(),
    isAvailable: z.boolean(),
    isVisible: z.boolean(),
    isFeatured: z.boolean(),
    status: z.enum([
      STORE_PRODUCT_STATUS.ACTIVE,
      STORE_PRODUCT_STATUS.INACTIVE,
      STORE_PRODUCT_STATUS.ARCHIVED,
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.sellingPrice > data.mrp) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selling price cannot exceed MRP',
        path: ['sellingPrice'],
      });
    }
  });

export type StoreProductFormInput = z.input<typeof storeProductFormSchema>;
export type StoreProductFormSchemaValues = z.output<typeof storeProductFormSchema>;
