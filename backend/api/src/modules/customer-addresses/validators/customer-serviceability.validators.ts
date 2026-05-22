import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';

export const serviceabilityBodyValidator = z
  .object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    addressId: mongoObjectIdValidator.optional(),
  })
  .strict();

export const storeSelectionBodyValidator = z
  .object({
    addressId: mongoObjectIdValidator,
    storeId: mongoObjectIdValidator,
  })
  .strict();
