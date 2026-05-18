import { z } from 'zod';
import { FULFILLMENT_TYPE, STORE_STATUS, STORE_TYPE } from '../constants/store.constants';

const operatingDay = z.string().min(1);

export const storeFormSchema = z
  .object({
    vendorId: z.string().min(1, 'Vendor ID is required'),
    cityId: z.string().min(1, 'City is required'),
    serviceAreaIds: z.array(z.string()).optional(),
    name: z.string().min(1, 'Name is required').max(200),
    slug: z.string().max(200).optional(),
    description: z.string().max(5000).optional().nullable(),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email().optional().nullable().or(z.literal('')),
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional().nullable(),
    landmark: z.string().optional().nullable(),
    pincode: z.string().min(1, 'Pincode is required'),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    serviceRadiusKm: z.coerce.number().positive(),
    openingTime: z.string().min(1),
    closingTime: z.string().min(1),
    operatingDays: z.array(operatingDay).min(1, 'Select at least one operating day'),
    isOpen: z.boolean().default(true),
    isAcceptingOrders: z.boolean().default(true),
    temporaryClosureReason: z.string().optional().nullable(),
    storeType: z.enum([
      STORE_TYPE.GROCERY,
      STORE_TYPE.PHARMACY,
      STORE_TYPE.RESTAURANT,
      STORE_TYPE.GENERAL,
      STORE_TYPE.DARK_STORE,
    ]),
    fulfillmentType: z.enum([
      FULFILLMENT_TYPE.DELIVERY,
      FULFILLMENT_TYPE.PICKUP,
      FULFILLMENT_TYPE.DELIVERY_AND_PICKUP,
    ]),
    status: z.enum([
      STORE_STATUS.ACTIVE,
      STORE_STATUS.INACTIVE,
      STORE_STATUS.SUSPENDED,
      STORE_STATUS.ARCHIVED,
    ]),
  })
  .superRefine((data, ctx) => {
    if ((!data.isOpen || !data.isAcceptingOrders) && !data.temporaryClosureReason?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Closure reason is required when store is closed or not accepting orders',
        path: ['temporaryClosureReason'],
      });
    }
  });

export type StoreFormInput = z.input<typeof storeFormSchema>;
export type StoreFormSchemaValues = z.output<typeof storeFormSchema>;
