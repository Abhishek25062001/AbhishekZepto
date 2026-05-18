import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../../validators/common.validators';
import { CITY_STATUS_VALUES } from '../constants/city-status.constant';

const cityBodyFields = {
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120).optional(),
  state: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120).optional(),
  timezone: z.string().trim().min(1).max(120),
  currencyCode: z.string().trim().min(1).max(10),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  serviceRadiusKm: z.number().positive().optional(),
  isServiceable: z.boolean().optional(),
  status: z.enum(CITY_STATUS_VALUES).optional(),
};

export const createCityBodyValidator = z.object(cityBodyFields).strict();

export const updateCityBodyValidator = createCityBodyValidator.partial().strict();

export const cityIdParamsValidator = z
  .object({
    cityId: mongoObjectIdValidator,
  })
  .strict();

export const listCitiesQueryValidator = paginationValidator
  .extend({
    status: z.enum(CITY_STATUS_VALUES).optional(),
    isServiceable: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
