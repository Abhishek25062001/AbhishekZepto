import { z } from 'zod';

import { STORE_PRODUCT_STATUS } from '../constants/vendor-store-product.constants';

export const vendorStoreProductAvailabilitySchema = z
  .object({
    isAvailable: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    status: z
      .enum([
        STORE_PRODUCT_STATUS.ACTIVE,
        STORE_PRODUCT_STATUS.INACTIVE,
        STORE_PRODUCT_STATUS.ARCHIVED,
      ])
      .optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Change at least one availability field',
  });

export type VendorStoreProductAvailabilityInput = z.input<typeof vendorStoreProductAvailabilitySchema>;
export type VendorStoreProductAvailabilityValues = z.output<typeof vendorStoreProductAvailabilitySchema>;
