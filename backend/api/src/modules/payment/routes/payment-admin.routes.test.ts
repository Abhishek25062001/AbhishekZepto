import assert from 'node:assert/strict';
import { test } from 'node:test';
import paymentAdminRoutes from './payment-admin.routes';
import {
  listAdminPaymentsQueryValidator,
  paymentIdParamsValidator,
} from '../validators/payment.validators';

const listRoutes = (
  router: typeof paymentAdminRoutes,
): Array<{ path: string; methods: string[] }> => {
  const stack = (router as unknown as { stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }> })
    .stack;

  return stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route!.path,
      methods: Object.keys(layer.route!.methods),
    }));
};

test('payment admin routes expose expected endpoints', () => {
  const routes = listRoutes(paymentAdminRoutes);

  assert.deepEqual(routes, [
    { path: '/', methods: ['get'] },
    { path: '/:paymentId', methods: ['get'] },
  ]);
});

test('listAdminPaymentsQueryValidator accepts pagination filters', () => {
  const parsed = listAdminPaymentsQueryValidator.parse({
    page: '1',
    limit: '20',
    paymentStatus: 'paid',
  });

  assert.equal(parsed.page, 1);
  assert.equal(parsed.limit, 20);
  assert.equal(parsed.paymentStatus, 'paid');
});

test('paymentIdParamsValidator requires valid ObjectId', () => {
  assert.throws(() => paymentIdParamsValidator.parse({ paymentId: 'invalid' }));
});
