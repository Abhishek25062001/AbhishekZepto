import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';

const DEFAULT_TIMEZONE = 'UTC';
const TIMEZONE_PATTERN = /^[A-Za-z_/-]+(?:\/[A-Za-z_/-]+)*$/;

const analyticsDateSchema = z.coerce.date().refine((value) => !Number.isNaN(value.getTime()), {
  message: 'Invalid date',
});

export const analyticsQuerySchema = z
  .object({
    fromDate: analyticsDateSchema.optional(),
    toDate: analyticsDateSchema.optional(),
    timezone: z.string().trim().regex(TIMEZONE_PATTERN).default(DEFAULT_TIMEZONE),
    storeId: mongoObjectIdValidator.optional(),
    vendorId: mongoObjectIdValidator.optional(),
    cityId: mongoObjectIdValidator.optional(),
  })
  .refine(
    (query) => {
      if (!query.fromDate || !query.toDate) {
        return true;
      }

      return query.fromDate.getTime() <= query.toDate.getTime();
    },
    {
      message: 'fromDate must be before or equal to toDate',
      path: ['toDate'],
    },
  );

export const analyticsQueryValidator = {
  query: analyticsQuerySchema,
};
