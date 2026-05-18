import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../../validators/common.validators';
import { SERVICE_AREA_STATUS_VALUES } from '../constants/service-area-status.constant';

const optionalNullableString = z.string().trim().nullable().optional();

export const createServiceAreaBodyValidator = z
  .object({
    cityId: mongoObjectIdValidator,
    name: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(200).optional(),
    description: optionalNullableString,
    polygon: z.array(z.unknown()).nullable().optional(),
    centerLatitude: z.number().optional(),
    centerLongitude: z.number().optional(),
    radiusKm: z.number().positive().optional(),
    isServiceable: z.boolean().optional(),
    status: z.enum(SERVICE_AREA_STATUS_VALUES).optional(),
  })
  .strict();

export const updateServiceAreaBodyValidator = createServiceAreaBodyValidator
  .partial()
  .strict();

export const serviceAreaIdParamsValidator = z
  .object({
    serviceAreaId: mongoObjectIdValidator,
  })
  .strict();

export const listServiceAreasQueryValidator = paginationValidator
  .extend({
    cityId: mongoObjectIdValidator.optional(),
    status: z.enum(SERVICE_AREA_STATUS_VALUES).optional(),
    isServiceable: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
