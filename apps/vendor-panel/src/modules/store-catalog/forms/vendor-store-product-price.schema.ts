import { z } from 'zod';

import { DISCOUNT_TYPE } from '../constants/vendor-store-product.constants';

export const vendorStoreProductPriceSchema = z
  .object({
    mrp: z.coerce.number().nonnegative().optional(),
    sellingPrice: z.coerce.number().nonnegative().optional(),
    discountType: z
      .enum([DISCOUNT_TYPE.NONE, DISCOUNT_TYPE.FLAT, DISCOUNT_TYPE.PERCENTAGE])
      .optional(),
    discountValue: z.coerce.number().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sellingPrice !== undefined && data.mrp !== undefined && data.sellingPrice > data.mrp) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selling price cannot exceed MRP',
        path: ['sellingPrice'],
      });
    }
    if (data.discountType === DISCOUNT_TYPE.PERCENTAGE && (data.discountValue ?? 0) > 100) {
      ctx.addIssue({
        code: 'custom',
        message: 'Percentage discount cannot exceed 100',
        path: ['discountValue'],
      });
    }
  });

export type VendorStoreProductPriceInput = z.input<typeof vendorStoreProductPriceSchema>;
export type VendorStoreProductPriceValues = z.output<typeof vendorStoreProductPriceSchema>;
