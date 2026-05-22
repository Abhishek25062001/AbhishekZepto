import type { OrderSlaStage, OrderSlaStatus } from '../constants/order-sla.constant';

export type OrderSlaEvaluationInput = {
  evaluatedAt?: Date;
};

export type OrderSlaEvaluationResult = {
  breachedStage: OrderSlaStage | null;
  evaluatedAt: Date;
  stage: OrderSlaStage | null;
  startedAt: Date | null;
  status: OrderSlaStatus;
};

export type OrderSlaMarkingResult = {
  breachedCount: number;
  evaluatedCount: number;
  skippedCount: number;
};
