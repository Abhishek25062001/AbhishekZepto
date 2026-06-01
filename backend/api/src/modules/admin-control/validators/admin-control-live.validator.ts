import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { ORDER_SLA_STATUS_VALUES } from '../../orders/constants/order-sla.constant';
import { ORDER_STATUS_VALUES } from '../../orders/constants/order-status.constant';

export const adminControlLiveQueryValidator = z.object({
  cityId: mongoObjectIdValidator.optional(),
  status: z.enum(ORDER_STATUS_VALUES as unknown as [string, ...string[]]).optional(),
  slaRisk: z.enum(ORDER_SLA_STATUS_VALUES as unknown as [string, ...string[]]).optional(),
  storeId: mongoObjectIdValidator.optional(),
});
