import type { DeliverySlaStage, DeliverySlaStatus } from '../constants/delivery-sla.constant';

export type DeliverySlaEvaluationInput = {
  evaluatedAt?: Date;
};

export type DeliverySlaEvaluationResult = {
  breachedStage: DeliverySlaStage | null;
  evaluatedAt: Date;
  activeStage: DeliverySlaStage | null;
  startedAt: Date | null;
  status: DeliverySlaStatus;
};

export type DeliverySlaMarkingResult = {
  breachedCount: number;
  evaluatedCount: number;
  skippedCount: number;
};
