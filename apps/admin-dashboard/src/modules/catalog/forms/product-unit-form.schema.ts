import { z } from 'zod';

import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { BASE_UNIT } from '../constants/product-unit.constants';

export const productUnitFormSchema = z.object({
  code: z.string().min(1, 'Code is required').max(64),
  name: z.string().min(1, 'Name is required').max(200),
  baseUnit: z.enum([
    BASE_UNIT.PIECE,
    BASE_UNIT.PACK,
    BASE_UNIT.KG,
    BASE_UNIT.G,
    BASE_UNIT.LITRE,
    BASE_UNIT.ML,
    BASE_UNIT.DOZEN,
  ]),
  conversionFactor: z.coerce
    .number()
    .refine((value) => value > 0, { message: 'Conversion factor must be greater than zero.' }),
  status: z.enum([CATALOG_STATUS.ACTIVE, CATALOG_STATUS.INACTIVE, CATALOG_STATUS.ARCHIVED]),
});

export type ProductUnitFormInput = z.input<typeof productUnitFormSchema>;
export type ProductUnitFormSchemaValues = z.output<typeof productUnitFormSchema>;
