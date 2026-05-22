import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import * as orderSlaMarkingModule from '../modules/orders/services/order-sla-marking.service';
import { runOrderSlaEvaluationJob } from './order-sla-evaluation.job';

const orderSlaMarkingService = orderSlaMarkingModule as unknown as {
  markDelayedOrdersForSla: typeof orderSlaMarkingModule.markDelayedOrdersForSla;
};

afterEach(() => {
  orderSlaMarkingService.markDelayedOrdersForSla = orderSlaMarkingModule.markDelayedOrdersForSla;
});

test('runOrderSlaEvaluationJob returns completed marking result', async () => {
  const evaluatedAt = new Date('2026-05-21T10:00:00.000Z');
  const capturedInputs: Array<{ evaluatedAt?: Date; limit?: number } | undefined> = [];

  orderSlaMarkingService.markDelayedOrdersForSla = async (input) => {
    capturedInputs.push(input);
    return {
      breachedCount: 1,
      evaluatedCount: 2,
      skippedCount: 1,
    };
  };

  const result = await runOrderSlaEvaluationJob({ evaluatedAt, limit: 25 });

  assert.equal(result.status, 'completed');
  assert.equal(result.evaluatedCount, 2);
  assert.equal(result.breachedCount, 1);
  const [capturedInput] = capturedInputs;
  assert.ok(capturedInput);
  assert.equal(capturedInput.evaluatedAt?.toISOString(), evaluatedAt.toISOString());
  assert.equal(capturedInput.limit, 25);
});

test('runOrderSlaEvaluationJob contains marking failures', async () => {
  orderSlaMarkingService.markDelayedOrdersForSla = async () => {
    throw new Error('marking failed');
  };

  const result = await runOrderSlaEvaluationJob();

  assert.equal(result.status, 'failed');
  assert.equal(result.evaluatedCount, 0);
  assert.equal(result.breachedCount, 0);
  assert.match(result.errorMessage, /marking failed/);
});
