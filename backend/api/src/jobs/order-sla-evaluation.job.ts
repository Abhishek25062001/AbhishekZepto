import { logger } from '../config/logger';
import { markDelayedOrdersForSla } from '../modules/orders/services/order-sla-marking.service';
import type { OrderSlaMarkingResult } from '../modules/orders/types/order-sla.types';

export type OrderSlaEvaluationJobResult =
  | (OrderSlaMarkingResult & { status: 'completed' })
  | {
      breachedCount: 0;
      errorMessage: string;
      evaluatedCount: 0;
      skippedCount: 0;
      status: 'failed';
    };

export const runOrderSlaEvaluationJob = async (
  input: { evaluatedAt?: Date; limit?: number } = {},
): Promise<OrderSlaEvaluationJobResult> => {
  try {
    const result = await markDelayedOrdersForSla(input);

    return {
      ...result,
      status: 'completed',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown SLA evaluation job error';
    logger.warn({ error: errorMessage }, 'Order SLA evaluation job failed');

    return {
      breachedCount: 0,
      errorMessage,
      evaluatedCount: 0,
      skippedCount: 0,
      status: 'failed',
    };
  }
};
