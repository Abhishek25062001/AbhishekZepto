import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../../validators/common.validators';
import { BASE_UNIT_VALUES } from '../constants/base-unit.constant';
import { PRODUCT_UNIT_STATUS_VALUES } from '../constants/product-unit-status.constant';

const productUnitStatusValidator = z.enum(PRODUCT_UNIT_STATUS_VALUES);
const baseUnitValidator = z.enum(BASE_UNIT_VALUES);

export const createProductUnitBodyValidator = z
  .object({
    code: z.string().trim().min(1).max(32),
    name: z.string().trim().min(1).max(120),
    baseUnit: baseUnitValidator,
    conversionFactor: z.coerce.number().positive(),
    status: productUnitStatusValidator.optional(),
  })
  .strict();

export const updateProductUnitBodyValidator = createProductUnitBodyValidator.partial().strict();

export const productUnitIdParamsValidator = z
  .object({
    unitId: mongoObjectIdValidator,
  })
  .strict();

export const listProductUnitsQueryValidator = paginationValidator
  .extend({
    status: productUnitStatusValidator.optional(),
    baseUnit: baseUnitValidator.optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['code', 'name', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
