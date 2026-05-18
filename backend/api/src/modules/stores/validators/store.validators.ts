import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../validators/common.validators';
import { FULFILLMENT_TYPE_VALUES } from '../constants/fulfillment-type.constant';
import { STORE_STATUS_VALUES } from '../constants/store-status.constant';
import { STORE_TYPE_VALUES } from '../constants/store-type.constant';

const optionalNullableString = z.string().trim().nullable().optional();

export const createStoreBodyValidator = z
  .object({
    vendorId: mongoObjectIdValidator,
    cityId: mongoObjectIdValidator,
    serviceAreaIds: z.array(mongoObjectIdValidator).optional(),
    name: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(200).optional(),
    code: z.string().trim().min(1).max(50).optional(),
    description: optionalNullableString,
    phone: z.string().trim().min(5).max(20),
    email: optionalNullableString,
    addressLine1: z.string().trim().min(1).max(300),
    addressLine2: optionalNullableString,
    landmark: optionalNullableString,
    pincode: z.string().trim().min(4).max(12),
    latitude: z.number(),
    longitude: z.number(),
    serviceRadiusKm: z.number().positive(),
    openingTime: z.string().trim().min(1).max(10),
    closingTime: z.string().trim().min(1).max(10),
    operatingDays: z.array(z.string().trim().min(1)).min(1),
    isOpen: z.boolean().optional(),
    isAcceptingOrders: z.boolean().optional(),
    temporaryClosureReason: optionalNullableString,
    storeType: z.enum(STORE_TYPE_VALUES),
    fulfillmentType: z.enum(FULFILLMENT_TYPE_VALUES),
    status: z.enum(STORE_STATUS_VALUES).optional(),
  })
  .strict();

export const updateStoreBodyValidator = createStoreBodyValidator
  .omit({ code: true })
  .partial()
  .strict()
  .superRefine((value, context) => {
    const closing =
      value.isOpen === false ||
      value.isAcceptingOrders === false;
    if (closing && !value.temporaryClosureReason?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'temporaryClosureReason is required when closing the store',
        path: ['temporaryClosureReason'],
      });
    }
  });

export const storeIdParamsValidator = z
  .object({
    storeId: mongoObjectIdValidator,
  })
  .strict();

export const listStoresQueryValidator = paginationValidator
  .extend({
    vendorId: mongoObjectIdValidator.optional(),
    cityId: mongoObjectIdValidator.optional(),
    serviceAreaId: mongoObjectIdValidator.optional(),
    status: z.enum(STORE_STATUS_VALUES).optional(),
    isOpen: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    isAcceptingOrders: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    storeType: z.enum(STORE_TYPE_VALUES).optional(),
    fulfillmentType: z.enum(FULFILLMENT_TYPE_VALUES).optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'code']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
