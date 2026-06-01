import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { AUTH_ACCOUNT_STATUSES } from '../../auth/constants/auth-status.constants';
import { ORDER_STATUS_VALUES } from '../../orders/constants/order-status.constant';
import { CUSTOMER_MANAGEMENT_ACCOUNT_STATUSES } from '../constants/customer-management.constants';

export const customerIdParamValidator = {
  params: z.object({
    customerId: mongoObjectIdValidator,
  }),
};

export const listCustomersQueryValidator = {
  query: z.object({
    status: z.enum(AUTH_ACCOUNT_STATUSES as [string, ...string[]]).optional(),
    cityId: mongoObjectIdValidator.optional(),
    search: z.string().trim().min(1).max(120).optional(),
    createdFrom: z.string().datetime().optional(),
    createdTo: z.string().datetime().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const updateCustomerStatusValidator = {
  body: z.object({
    status: z.enum(CUSTOMER_MANAGEMENT_ACCOUNT_STATUSES as [string, ...string[]]),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const updateCustomerNotesValidator = {
  body: z.object({
    adminNotes: z.string().trim().max(2000).nullable(),
  }),
};

export const customerOrdersQueryValidator = {
  query: z.object({
    status: z.enum(ORDER_STATUS_VALUES).optional(),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};
