import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';
import {
  ADMIN_DATA_EXPORT_FORMATS,
  ADMIN_DATA_EXPORT_STATUSES,
  ADMIN_DATA_EXPORT_TYPES,
} from '../constants/admin-data-export.constants';

const dateSchema = z.coerce.date().refine((value) => !Number.isNaN(value.getTime()), {
  message: 'Invalid date',
});

const dateRangeRefinement = (query: { fromDate?: Date; toDate?: Date }) => {
  if (!query.fromDate || !query.toDate) return true;
  return query.fromDate.getTime() <= query.toDate.getTime();
};

export const adminDataExportIdParamValidator = {
  params: z.object({
    exportId: mongoObjectIdValidator,
  }),
};

export const createAdminDataExportBodyValidator = {
  body: z.object({
    exportType: z.enum(ADMIN_DATA_EXPORT_TYPES as [string, ...string[]]),
    format: z.enum(ADMIN_DATA_EXPORT_FORMATS as [string, ...string[]]),
    filters: z.record(z.unknown()).default({}),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const listAdminDataExportsQuerySchema = z
  .object({
    exportType: z.enum(ADMIN_DATA_EXPORT_TYPES as [string, ...string[]]).optional(),
    format: z.enum(ADMIN_DATA_EXPORT_FORMATS as [string, ...string[]]).optional(),
    status: z.enum(ADMIN_DATA_EXPORT_STATUSES as [string, ...string[]]).optional(),
    requestedByAdminId: mongoObjectIdValidator.optional(),
    fromDate: dateSchema.optional(),
    toDate: dateSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .refine(dateRangeRefinement, {
    message: 'fromDate must be before or equal to toDate',
    path: ['toDate'],
  });

export const listAdminDataExportsQueryValidator = {
  query: listAdminDataExportsQuerySchema,
};
