import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { ORDER_PAYMENT_STATUS_VALUES } from '../constants/order-payment-status.constant';
import { ORDER_SLA_STAGE_VALUES, ORDER_SLA_STATUS_VALUES } from '../constants/order-sla.constant';
import { ORDER_STATUS_VALUES } from '../constants/order-status.constant';
import { ORDER_STORE_STATUS_VALUES } from '../constants/order-store-status.constant';

export const placeOrderBodyValidator = z.object({
  paymentId: mongoObjectIdValidator,
  idempotencyKey: z.string().trim().min(1).max(128).optional(),
});

export const listOrdersQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  status: z.enum(ORDER_STATUS_VALUES).optional(),
});

export const listStoreOrdersQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  status: z.enum(ORDER_STATUS_VALUES).optional(),
  storeStatus: z.enum(ORDER_STORE_STATUS_VALUES).optional(),
  paymentStatus: z.enum(ORDER_PAYMENT_STATUS_VALUES).optional(),
  slaStatus: z.enum(ORDER_SLA_STATUS_VALUES).optional(),
  slaBreachedStage: z.enum(ORDER_SLA_STAGE_VALUES).optional(),
});

export const listAdminOrdersQueryValidator = listStoreOrdersQueryValidator
  .extend({
    storeId: mongoObjectIdValidator.optional(),
    cityId: mongoObjectIdValidator.optional(),
    customerId: mongoObjectIdValidator.optional(),
    slaStatus: z.enum(ORDER_SLA_STATUS_VALUES).optional(),
    slaBreachedStage: z.enum(ORDER_SLA_STAGE_VALUES).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    sort: z
      .enum(['createdAt_desc', 'createdAt_asc', 'status_asc', 'status_desc', 'sla_priority'])
      .optional(),
  })
  .refine(
    (query) => !query.fromDate || !query.toDate || query.fromDate <= query.toDate,
    {
      message: 'fromDate must be before or equal to toDate',
      path: ['fromDate'],
    },
  );

export const orderIdParamValidator = z.object({
  orderId: mongoObjectIdValidator,
});

export const orderItemIdParamValidator = z.object({
  orderId: mongoObjectIdValidator,
  itemId: mongoObjectIdValidator,
});

export const rejectStoreOrderBodyValidator = z.object({
  reason: z.string().trim().min(1).max(500),
});

export const cancelOrderBodyValidator = z.object({
  reason: z.string().trim().min(1).max(500),
});

export const adminOrderStatusUpdateBodyValidator = z.object({
  status: z.enum(ORDER_STATUS_VALUES),
  reason: z.string().trim().min(1).max(500).optional(),
});

export const storeOrderItemPickingBodyValidator = z.object({
  quantity: z.coerce.number().int().min(1),
});
