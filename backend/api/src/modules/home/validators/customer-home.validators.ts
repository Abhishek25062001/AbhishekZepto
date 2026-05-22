import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';

export const customerHomeQueryValidator = z
  .object({
    storeId: mongoObjectIdValidator,
    cityId: mongoObjectIdValidator.optional(),
    categoryLimit: z.coerce.number().int().min(1).max(50).optional(),
    featuredLimit: z.coerce.number().int().min(1).max(50).optional(),
  })
  .strict();
