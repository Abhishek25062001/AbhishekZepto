import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { CUSTOMER_ADDRESS_STATUS_VALUES } from '../constants/customer-address-status.constant';

const latitudeValidator = z.coerce.number().min(-90).max(90);
const longitudeValidator = z.coerce.number().min(-180).max(180);

const addressFieldsValidator = z.object({
  label: z.string().trim().min(1).max(50),
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).nullable().optional(),
  landmark: z.string().trim().max(120).nullable().optional(),
  city: z.string().trim().min(1).max(100),
  cityId: mongoObjectIdValidator.nullable().optional(),
  state: z.string().trim().max(100).nullable().optional(),
  postalCode: z.string().trim().max(20).nullable().optional(),
  country: z.string().trim().min(2).max(2).optional(),
  latitude: latitudeValidator,
  longitude: longitudeValidator,
  isDefault: z.boolean().optional(),
});

export const createCustomerAddressBodyValidator = addressFieldsValidator.strict();

export const updateCustomerAddressBodyValidator = addressFieldsValidator
  .partial()
  .extend({
    status: z.enum(CUSTOMER_ADDRESS_STATUS_VALUES).optional(),
  })
  .strict();

export const addressIdParamsValidator = z
  .object({
    addressId: mongoObjectIdValidator,
  })
  .strict();
